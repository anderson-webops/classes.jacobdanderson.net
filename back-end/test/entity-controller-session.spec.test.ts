import type { Server } from "node:http";
import type { CustomSession } from "../src/types/session/CustomSession.js";
import cookieSession from "cookie-session";
import express from "express";
import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import { makeEntityController } from "../src/controllers/common/entityController.js";

class TestUser {
	_id = new Types.ObjectId();
	name: string;

	constructor(data: { name: string }) {
		this.name = data.name;
	}

	async save() {}
}

async function withEntityRoutes<T>(
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const controller = makeEntityController({
		model: TestUser as any,
		idParam: "userID",
		sessionKey: "userID",
		responseKey: "currentUser"
	});
	const app = express();
	app.use(express.json());
	app.use(
		cookieSession({
			name: "session",
			keys: ["entity-controller-test-secret"]
		})
	);
	app.post("/test/session/course-code", (req, res) => {
		(req.session as CustomSession).courseCodeLearnerID =
			new Types.ObjectId().toString();
		res.sendStatus(204);
	});
	app.get("/test/session", (req, res) => {
		const session = req.session as CustomSession;
		res.json({
			adminID: session.adminID ?? null,
			courseCodeLearnerID: session.courseCodeLearnerID ?? null,
			tutorID: session.tutorID ?? null,
			userID: session.userID ?? null
		});
	});
	app.post("/users", controller.create);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

function responseCookie(response: Response) {
	return response.headers
		.getSetCookie()
		.map(cookie => cookie.split(";", 1)[0])
		.join("; ");
}

describe("entity controller session replacement", () => {
	it("replaces a course-code identity when a standard account is created", async () => {
		await withEntityRoutes(async baseUrl => {
			const seedResponse = await fetch(
				`${baseUrl}/test/session/course-code`,
				{ method: "POST" }
			);
			const seedCookie = responseCookie(seedResponse);
			const createResponse = await fetch(`${baseUrl}/users`, {
				body: JSON.stringify({ name: "Student" }),
				headers: {
					"content-type": "application/json",
					cookie: seedCookie
				},
				method: "POST"
			});
			const accountCookie = responseCookie(createResponse);
			const createdBody = await createResponse.json();
			const sessionResponse = await fetch(`${baseUrl}/test/session`, {
				headers: { cookie: accountCookie }
			});

			expect(createResponse.status).toBe(201);
			await expect(sessionResponse.json()).resolves.toEqual({
				adminID: null,
				courseCodeLearnerID: null,
				tutorID: null,
				userID: createdBody.currentUser._id
			});
		});
	});
});
