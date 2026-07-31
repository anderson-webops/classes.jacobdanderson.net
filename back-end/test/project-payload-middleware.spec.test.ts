import type { Server } from "node:http";
import { request } from "node:http";
import { gzipSync } from "node:zlib";
import express from "express";
import { describe, expect, it, vi } from "vitest";
import {
	createCodeIdeProjectJsonParser,
	createCodeIdeProjectPayloadConcurrencyGuard
} from "../src/middleware/projectPayload.js";
import { createCodeIdeHeavyProjectPayloadLimiter } from "../src/middleware/rateLimiters.js";

interface PayloadAppOptions {
	globalLimit?: number;
	heavyRateLimit?: number;
	heavyThresholdBytes?: number;
	normalGlobalLimit?: number;
	normalPerIdentityLimit?: number;
	parserLimit?: string;
	perIdentityLimit?: number;
}

interface PayloadAppControls {
	releaseHeld: () => void;
	saved: ReturnType<typeof vi.fn>;
	waitForHeldCount: (count: number) => Promise<void>;
}

async function withPayloadApp<T>(
	options: PayloadAppOptions,
	run: (baseUrl: string, controls: PayloadAppControls) => Promise<T>
): Promise<T> {
	const app = express();
	const saved = vi.fn();
	const heavyThresholdBytes = options.heavyThresholdBytes ?? 1_024;
	let heldCount = 0;
	let releaseHeld = () => undefined;
	const heldRelease = new Promise<void>(resolve => {
		releaseHeld = resolve;
	});
	const heldWaiters: Array<{ count: number; resolve: () => void }> = [];
	const markHeld = () => {
		heldCount += 1;
		for (const waiter of heldWaiters.splice(0)) {
			if (heldCount >= waiter.count) waiter.resolve();
			else heldWaiters.push(waiter);
		}
	};
	const waitForHeldCount = (count: number) => {
		if (heldCount >= count) return Promise.resolve();
		return new Promise<void>(resolve => {
			heldWaiters.push({ count, resolve });
		});
	};

	app.set("trust proxy", 1);
	app.use("/users/loggedin/python-projects", (req, _res, next) => {
		req.session = {
			authenticatedSessionExpiresAt: Date.now() + 60_000,
			userID: req.get("X-Test-User-ID") ?? "user-one"
		} as typeof req.session;
		next();
	});
	app.use(
		"/users/loggedin/python-projects",
		createCodeIdeHeavyProjectPayloadLimiter({
			heavyThresholdBytes,
			limit: options.heavyRateLimit ?? 100,
			windowMs: 60_000
		}),
		createCodeIdeProjectPayloadConcurrencyGuard({
			globalLimit: options.globalLimit ?? 1,
			heavyThresholdBytes,
			normalGlobalLimit: options.normalGlobalLimit,
			normalPerIdentityLimit: options.normalPerIdentityLimit,
			perIdentityLimit: options.perIdentityLimit ?? 1
		}),
		createCodeIdeProjectJsonParser(options.parserLimit ?? "8kb")
	);
	// A project parsed above must not fall through to the smaller global parser.
	app.use(express.json({ limit: "128b" }));
	app.post("/users/loggedin/python-projects", async (req, res) => {
		saved();
		if (req.get("X-Hold-Response") === "1") {
			markHeld();
			await heldRelease;
		}
		res.json({ contentLength: req.body.files[0].content.length });
	});
	app.use(
		(
			error: { status?: number },
			_req: express.Request,
			res: express.Response,
			_next: express.NextFunction
		) => {
			res.sendStatus(error.status ?? 500);
		}
	);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`, {
			releaseHeld,
			saved,
			waitForHeldCount
		});
	} finally {
		releaseHeld();
		await new Promise<void>((resolve, reject) => {
			server.close(error => (error ? reject(error) : resolve()));
		});
	}
}

function projectBody(content: string) {
	return JSON.stringify({
		files: [{ content, name: "main.py" }],
		title: "Payload boundary"
	});
}

function postProject(
	baseUrl: string,
	content: string,
	headers: Record<string, string> = {}
) {
	return fetch(`${baseUrl}/users/loggedin/python-projects`, {
		body: projectBody(content),
		headers: {
			"content-type": "application/json",
			...headers
		},
		method: "POST"
	});
}

function postCompressedProject(baseUrl: string, content: string) {
	return fetch(`${baseUrl}/users/loggedin/python-projects`, {
		body: gzipSync(projectBody(content)),
		headers: {
			"content-encoding": "gzip",
			"content-type": "application/json"
		},
		method: "POST"
	});
}

function postChunkedProject(
	baseUrl: string,
	content: string,
	headers: Record<string, string> = {}
): Promise<number> {
	const url = new URL(`${baseUrl}/users/loggedin/python-projects`);
	const body = projectBody(content);
	return new Promise((resolve, reject) => {
		const req = request(
			{
				headers: {
					"content-type": "application/json",
					...headers
				},
				host: url.hostname,
				method: "POST",
				path: url.pathname,
				port: url.port
			},
			res => {
				res.resume();
				res.on("end", () => resolve(res.statusCode ?? 0));
			}
		);
		req.on("error", reject);
		req.write(body.slice(0, Math.ceil(body.length / 2)));
		req.end(body.slice(Math.ceil(body.length / 2)));
	});
}

describe("Code IDE project payload middleware", () => {
	it("preserves normal autosaves above the global parser limit", async () => {
		await withPayloadApp(
			{ heavyThresholdBytes: 2_048 },
			async (baseUrl, controls) => {
				const responses = await Promise.all([
					postProject(baseUrl, "x".repeat(1_024)),
					postProject(baseUrl, "y".repeat(1_024))
				]);

				expect(responses.map(response => response.status)).toEqual([
					200,
					200
				]);
				expect(controls.saved).toHaveBeenCalledTimes(2);
			}
		);
	});

	it("bounds concurrent normal saves for one signed account", async () => {
		await withPayloadApp(
			{
				heavyThresholdBytes: 2_048,
				normalPerIdentityLimit: 2
			},
			async (baseUrl, controls) => {
				const first = postProject(baseUrl, "x".repeat(1_024), {
					"X-Hold-Response": "1"
				});
				const second = postProject(baseUrl, "y".repeat(1_024), {
					"X-Hold-Response": "1"
				});
				await controls.waitForHeldCount(2);
				const third = await postProject(baseUrl, "z".repeat(1_024));

				expect(third.status).toBe(429);
				expect(third.headers.get("retry-after")).toBe("1");
				controls.releaseHeld();
				expect(
					(await Promise.all([first, second])).map(
						response => response.status
					)
				).toEqual([200, 200]);
			}
		);
	});

	it("enforces the global heavy limit across signed accounts", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const first = postProject(baseUrl, "x".repeat(3_000), {
				"X-Hold-Response": "1",
				"X-Test-User-ID": "user-one"
			});
			await controls.waitForHeldCount(1);
			const second = await postProject(baseUrl, "y".repeat(3_000), {
				"X-Test-User-ID": "user-two"
			});

			expect(second.status).toBe(429);
			controls.releaseHeld();
			expect((await first).status).toBe(200);
		});
	});

	it("treats chunked requests as heavy", async () => {
		await withPayloadApp(
			{ heavyThresholdBytes: 2_048 },
			async (baseUrl, controls) => {
				const first = postChunkedProject(baseUrl, "x".repeat(100), {
					"X-Hold-Response": "1"
				});
				await controls.waitForHeldCount(1);
				const second = await postChunkedProject(
					baseUrl,
					"y".repeat(100)
				);

				expect(second).toBe(429);
				controls.releaseHeld();
				expect(await first).toBe(200);
			}
		);
	});

	it("rejects compressed project bodies before inflation", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const response = await postCompressedProject(
				baseUrl,
				"x".repeat(3_000)
			);

			expect(response.status).toBe(415);
			expect(controls.saved).not.toHaveBeenCalled();
		});
	});

	it("retains a dedicated parser ceiling", async () => {
		await withPayloadApp(
			{ parserLimit: "2kb" },
			async (baseUrl, controls) => {
				const response = await postProject(
					baseUrl,
					"x".repeat(3_000)
				);

				expect(response.status).toBe(413);
				expect(controls.saved).not.toHaveBeenCalled();
			}
		);
	});
});
