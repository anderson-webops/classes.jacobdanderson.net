import type { Server } from "node:http";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import express from "express";
import { Types } from "mongoose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	find: vi.fn(),
	aggregate: vi.fn(),
	admin: vi.fn()
}));
vi.mock("../src/models/schemas/SessionNote.js", () => ({
	SessionNote: { find: mocks.find, aggregate: mocks.aggregate }
}));
vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findById: mocks.admin }
}));
const { createSessionNoteVerificationRoutes } = await import("../src/routes/sessionNoteVerificationRoutes.js");
const { validAdmin } = await import("../src/middleware/auth.js");
const studentID = new Types.ObjectId().toString();
const token = "a".repeat(43);
const headers = { authorization: `Bearer ${token}` };
const params = new URLSearchParams({
	studentId: studentID,
	from: "2026-09-01",
	to: "2026-09-30"
});
let rows: Record<string, unknown>[];
let identities: unknown[];
let query: ReturnType<typeof chain>;

function chain() {
	const result = {
		select: vi.fn(() => result),
		sort: vi.fn(() => result),
		limit: vi.fn(() => result),
		collation: vi.fn(() => result),
		maxTimeMS: vi.fn(() => result),
		lean: vi.fn(async () => rows),
		option: vi.fn(async () => identities)
	};
	return result;
}

async function withRoutes(run: (url: string) => Promise<void>, limit = 60) {
	const app = express();
	app.use((req, _res, next) => {
		// Headers model sessions only in this isolated test application.
		req.session = {
			adminID: req.get("x-admin"),
			userID: req.get("x-user"),
			tutorID: req.get("x-tutor"),
			courseCodeLearnerID: req.get("x-learner"),
			accountSessionVersion: 0,
			authenticatedSessionExpiresAt: req.get("x-expired") ? 1 : Date.now() + 60_000
		};
		next();
	});
	app.use("/verify", createSessionNoteVerificationRoutes({ limit }));
	app.post("/admin-write", validAdmin, (_req, res) => res.sendStatus(204));
	const server = await new Promise<Server>((resolve) => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	try {
		const address = server.address();
		if (!address || typeof address === "string") throw new Error("No test port");
		await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		server.closeAllConnections();
		await new Promise<void>((resolve, reject) => {
			server.close(error => error ? reject(error) : resolve());
		});
	}
}

function note(extra: Record<string, unknown> = {}) {
	return {
		_id: new Types.ObjectId(),
		user: new Types.ObjectId(studentID),
		sessionDate: new Date("2026-09-17T12:00:00Z"),
		markdown: "PRIVATE NOTE",
		html: "PRIVATE HTML",
		primaryEmail: "private@example.test",
		subject: "PRIVATE SUBJECT",
		createdAt: new Date(),
		updatedAt: new Date(),
		...extra
	};
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.stubEnv("SESSION_NOTES_READ_TOKEN_SHA256", createHash("sha256").update(token).digest("hex"));
	vi.stubEnv("SESSION_NOTES_READ_TOKEN_EXPIRES_AT", new Date(Date.now() + 60_000).toISOString());
	rows = [];
	identities = [];
	query = chain();
	mocks.find.mockReturnValue(query);
	mocks.aggregate.mockReturnValue(query);
	mocks.admin.mockResolvedValue({ sessionVersion: 0 });
});
afterEach(() => vi.unstubAllEnvs());

describe("session-note verification access", () => {
	it.each([{}, { "x-user": studentID }, { "x-tutor": studentID }, { "x-learner": studentID }])(
		"rejects non-admin sessions %j without reading notes",
		async (sessionHeaders) => {
			await withRoutes(async (url) => {
				expect((await fetch(`${url}/verify?${params}`, { headers: sessionHeaders })).status).toBe(403);
				expect(mocks.find).not.toHaveBeenCalled();
			});
		}
	);
	it("permits a current admin without machine access configured", async () => {
		vi.stubEnv("SESSION_NOTES_READ_TOKEN_SHA256", "");
		await withRoutes(async (url) => {
			const response = await fetch(`${url}/verify?${params}`, { headers: { "x-admin": studentID } });
			expect(response.status).toBe(200);
			expect(mocks.admin).toHaveBeenCalledWith(studentID);
		});
	});
	it.each(["deleted", "revoked", "expired"])("rejects a %s admin session", async (state) => {
		mocks.admin.mockResolvedValue(state === "deleted" ? null : { sessionVersion: state === "revoked" ? 1 : 0 });
		await withRoutes(async (url) => {
			const response = await fetch(`${url}/verify?${params}`, {
				headers: { "x-admin": studentID, ...(state === "expired" ? { "x-expired": "1" } : {}) }
			});
			expect(response.status).toBe(403);
			expect(mocks.find).not.toHaveBeenCalled();
		});
	});
	it.each(["wrong-token", "missing-hash", "bad-hash", "missing-expiry", "expired", "bad-expiry"])(
		"fails closed for %s even with an admin cookie",
		async (state) => {
			if (state === "missing-hash") vi.stubEnv("SESSION_NOTES_READ_TOKEN_SHA256", "");
			if (state === "bad-hash") vi.stubEnv("SESSION_NOTES_READ_TOKEN_SHA256", "bad");
			if (state === "missing-expiry") vi.stubEnv("SESSION_NOTES_READ_TOKEN_EXPIRES_AT", "");
			if (state === "expired") vi.stubEnv("SESSION_NOTES_READ_TOKEN_EXPIRES_AT", "2020-01-01");
			if (state === "bad-expiry") vi.stubEnv("SESSION_NOTES_READ_TOKEN_EXPIRES_AT", "bad");
			await withRoutes(async (url) => {
				const response = await fetch(`${url}/verify?${params}`, {
					headers: { "x-admin": studentID, "authorization": `Bearer ${state === "wrong-token" ? "b".repeat(43) : token}` }
				});
				expect(response.status).toBe(401);
				expect(response.headers.get("www-authenticate")).toBe("Bearer");
				expect(mocks.find).not.toHaveBeenCalled();
			});
		}
	);
	it("does not turn the reader credential into an admin session or write permission", async () => {
		await withRoutes(async (url) => {
			const response = await fetch(`${url}/verify?${params}`, { headers });
			expect(response.status).toBe(200);
			expect(response.headers.get("set-cookie")).toBeNull();
			expect((await fetch(`${url}/admin-write`, { headers, method: "POST" })).status).toBe(403);
			for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
				const denied = await fetch(`${url}/verify?${params}`, { headers, method });
				expect(denied.status).toBe(405);
				expect(denied.headers.get("allow")).toBe("GET, HEAD");
			}
			expect(mocks.find).toHaveBeenCalledTimes(1);
			expect(mocks.admin).not.toHaveBeenCalled();
		});
	});
});

describe("bounded private metadata queries", () => {
	it("returns only evidence fields and never substitutes saved dates for sent dates", async () => {
		const sentAt = new Date("2026-09-18T01:25:12.000Z");
		rows = [
			note({ delivery: { source: "site_smtp", status: "smtp_accepted", sentAt } }),
			note(),
			note({ user: undefined, delivery: { source: "site_smtp", status: "smtp_rejected", sentAt } }),
			note({ delivery: { source: "site_smtp", status: "smtp_accepted" } })
		];
		await withRoutes(async (url) => {
			const response = await fetch(`${url}/verify?${params}`, { headers });
			expect(response.status).toBe(200);
			expect(response.headers.get("cache-control")).toBe("no-store");
			const body = await response.json();
			expect(body.records).toEqual(rows.map((row, index) => ({
				recordId: String(row._id),
				studentId: index === 2 ? null : studentID,
				classDate: "2026-09-17",
				sentAt: index === 0 ? sentAt.toISOString() : null,
				deliveryStatus: ["smtp_accepted", "unknown", "smtp_rejected", "unknown"][index]
			})));
			expect(JSON.stringify(body)).not.toMatch(/PRIVATE|private@example|createdAt|updatedAt/);
			expect(body.coverage).toBe("site_records_only");
			expect(query.select).toHaveBeenCalledWith({ _id: 1, user: 1, sessionDate: 1, delivery: 1 });
			expect(query.maxTimeMS).toHaveBeenCalledWith(2000);
			expect(query.limit).toHaveBeenCalledWith(51);
		});
	});
	it("uses a stable cursor without losing student and date boundaries or same-class rows", async () => {
		rows = [note(), note(), note()];
		await withRoutes(async (url) => {
			const first = await fetch(`${url}/verify?${params}&limit=2`, { headers });
			const body = await first.json();
			expect(body.records).toHaveLength(2);
			const cursor = JSON.parse(Buffer.from(body.nextCursor, "base64url").toString());
			expect(cursor.id).toBe(String(rows[1]._id));
			expect(cursor.date).toBe("2026-09-17T12:00:00.000Z");
			await fetch(`${url}/verify?${params}&limit=2&cursor=${body.nextCursor}`, { headers });
			expect(mocks.find.mock.lastCall?.[0]).toEqual({
				user: new Types.ObjectId(studentID),
				sessionDate: { $gte: new Date("2026-09-01"), $lt: new Date("2026-10-01") },
				$or: [
					{ sessionDate: { $lt: new Date(cursor.date) } },
					{ sessionDate: new Date(cursor.date), _id: { $lt: rows[1]._id } }
				]
			});
			expect(query.sort).toHaveBeenCalledWith({ sessionDate: -1, _id: -1 });
		});
	});
	it("uses an exact case-insensitive name and supports unlinked students", async () => {
		rows = [note({ user: undefined })];
		await withRoutes(async (url) => {
			const response = await fetch(`${url}/verify?studentName=Student%20One&from=2026-09-01&to=2026-09-30`, { headers });
			expect(response.status).toBe(200);
			expect((await response.json()).records[0].studentId).toBeNull();
			expect(mocks.find.mock.lastCall?.[0].studentName).toBe("Student One");
			expect(query.collation).toHaveBeenCalledWith({ locale: "en", strength: 2 });
			expect(query.option).toHaveBeenCalledWith({ maxTimeMS: 2000 });
		});
	});
	it("refuses to conflate students with the same name", async () => {
		identities = [{ _id: studentID }, { _id: "another-student" }];
		await withRoutes(async (url) => {
			const response = await fetch(`${url}/verify?studentName=Sam&from=2026-09-01&to=2026-09-30`, { headers });
			expect(response.status).toBe(409);
			expect(mocks.find).not.toHaveBeenCalled();
		});
	});
	it.each([
		{ from: "2026-02-30" },
		{ from: "2026-10-01" },
		{ from: "2025-01-01" },
		{ limit: "0" },
		{ limit: "101" },
		{ limit: "1.5" },
		{ studentId: "bad" },
		{ studentName: "Second selector" },
		{ studentId: "" },
		{ cursor: "garbage" },
		{ cursor: Buffer.from(JSON.stringify({ id: studentID, date: "bad" })).toString("base64url") },
		{ token },
		{ "studentId[$ne]": "x" },
		{ unexpected: "field" }
	])("rejects invalid or unbounded query %j", async (overrides) => {
		const invalid = new URLSearchParams(params);
		for (const [key, value] of Object.entries(overrides)) invalid.set(key, value);
		await withRoutes(async (url) => {
			expect((await fetch(`${url}/verify?${invalid}`, { headers })).status).toBe(400);
			expect(mocks.find).not.toHaveBeenCalled();
		});
	});
	it("rejects repeated selectors and credentials in query strings", async () => {
		await withRoutes(async (url) => {
			expect((await fetch(`${url}/verify?${params}&studentId=${studentID}`, { headers })).status).toBe(400);
			expect((await fetch(`${url}/verify?${params}&token=${token}`)).status).toBe(403);
			expect(mocks.find).not.toHaveBeenCalled();
		});
	});
	it("allows an inclusive leap-year range of 366 days", async () => {
		await withRoutes(async (url) => {
			expect((await fetch(`${url}/verify?studentId=${studentID}&from=2024-01-01&to=2024-12-31`, { headers })).status).toBe(200);
		});
	});
	it("reports database failures without exposing errors or pretending there is no evidence", async () => {
		query.lean.mockRejectedValue(new Error("PRIVATE database connection detail"));
		await withRoutes(async (url) => {
			const response = await fetch(`${url}/verify?${params}`, { headers });
			expect(response.status).toBe(503);
			expect(await response.text()).not.toMatch(/PRIVATE|records/);
		});
	});
	it("rate limits before doing more database work", async () => {
		await withRoutes(async (url) => {
			expect((await fetch(`${url}/verify?${params}`, { headers })).status).toBe(200);
			const response = await fetch(`${url}/verify?${params}`, { headers });
			expect(response.status).toBe(429);
			expect(response.headers.get("retry-after")).not.toBeNull();
			expect(mocks.find).toHaveBeenCalledTimes(1);
		}, 1);
	});
});
