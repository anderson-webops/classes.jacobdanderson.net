import type { Server } from "node:http";
import type { CustomSession } from "../src/types/session/CustomSession.js";
import cookieSession from "cookie-session";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminFindOne: vi.fn(),
	tutorFindOne: vi.fn(),
	userFindOne: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findOne: modelMocks.adminFindOne }
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: { findOne: modelMocks.tutorFindOne }
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: { findOne: modelMocks.userFindOne }
}));

const { accountRoutes } = await import("../src/routes/accountRoutes.js");

type LoginRole = "admin" | "tutor" | "user";

interface TestLoginEntity {
	_id: Types.ObjectId;
	name: string;
	email: string;
	password: string;
	saveEdit: string;
	role: LoginRole;
	comparePassword: ReturnType<typeof vi.fn>;
}

function queryWith<T>(result: T) {
	return {
		exec: vi.fn().mockResolvedValue(result)
	};
}

function makeEntity(role: LoginRole, acceptedPassword: string): TestLoginEntity {
	return {
		_id: new Types.ObjectId(),
		name: `${role} account`,
		email: "shared@example.com",
		password: `stored-${role}-password-hash`,
		saveEdit: "Edit",
		role,
		comparePassword: vi.fn(async candidatePassword => candidatePassword === acceptedPassword)
	};
}

function mockAccounts({
	admin = null,
	tutor = null,
	user = null
}: {
	admin?: TestLoginEntity | null;
	tutor?: TestLoginEntity | null;
	user?: TestLoginEntity | null;
}) {
	modelMocks.adminFindOne.mockReturnValue(queryWith(admin));
	modelMocks.tutorFindOne.mockReturnValue(queryWith(tutor));
	modelMocks.userFindOne.mockReturnValue(queryWith(user));
}

function sessionSnapshot(session: CustomSession) {
	return {
		adminID: session.adminID ?? null,
		tutorID: session.tutorID ?? null,
		userID: session.userID ?? null
	};
}

async function withAccountRoutes<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json());
	app.use(cookieSession({
		name: "session",
		keys: ["auth-login-test-secret"]
	}));
	app.post("/test/session/stale-user", (req, res) => {
		const session = req.session as CustomSession;
		session.userID = "stale-user-id";
		res.sendStatus(204);
	});
	app.get("/test/session", (req, res) => {
		res.json(sessionSnapshot(req.session as CustomSession));
	});
	app.use("/accounts", accountRoutes);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
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

function responseCookie(response: Response): string {
	return response.headers
		.getSetCookie()
		.map(cookie => cookie.split(";", 1)[0])
		.join("; ");
}

async function loginRequest(
	baseUrl: string,
	password: string,
	cookie?: string
): Promise<Response> {
	return fetch(`${baseUrl}/accounts/login`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...(cookie ? { cookie } : {})
		},
		body: JSON.stringify({
			email: "  SHARED@EXAMPLE.COM ",
			password
		})
	});
}

async function seedStaleUserSession(baseUrl: string): Promise<string> {
	const response = await fetch(`${baseUrl}/test/session/stale-user`, { method: "POST" });
	expect(response.status).toBe(204);
	return responseCookie(response);
}

describe("account login role transfer", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAccounts({});
	});

	it("does not let a stale user record shadow a tutor login with the same email", async () => {
		const admin = makeEntity("admin", "admin-password");
		const tutor = makeEntity("tutor", "tutor-password");
		const user = makeEntity("user", "old-user-password");
		mockAccounts({ admin, tutor, user });

		await withAccountRoutes(async baseUrl => {
			const response = await loginRequest(baseUrl, "tutor-password");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body).toMatchObject({
				currentTutor: { _id: tutor._id.toString(), role: "tutor" }
			});
			expect(body).not.toHaveProperty("currentAdmin");
			expect(body).not.toHaveProperty("currentUser");
			expect(admin.comparePassword).toHaveBeenCalledWith("tutor-password");
			expect(tutor.comparePassword).toHaveBeenCalledWith("tutor-password");
			expect(user.comparePassword).not.toHaveBeenCalled();
			expect(admin.comparePassword.mock.invocationCallOrder[0])
				.toBeLessThan(tutor.comparePassword.mock.invocationCallOrder[0]);
			expect(modelMocks.adminFindOne).toHaveBeenCalledWith({ email: "shared@example.com" });
			expect(modelMocks.tutorFindOne).toHaveBeenCalledWith({ email: "shared@example.com" });
			expect(modelMocks.userFindOne).toHaveBeenCalledWith({ email: "shared@example.com" });
		});
	});

	it("replaces a stale user session with a tutor-only session after tutor login", async () => {
		const tutor = makeEntity("tutor", "tutor-password");
		mockAccounts({ tutor });

		await withAccountRoutes(async baseUrl => {
			const staleCookie = await seedStaleUserSession(baseUrl);
			const loginResponse = await loginRequest(baseUrl, "tutor-password", staleCookie);
			const tutorCookie = responseCookie(loginResponse);
			const sessionResponse = await fetch(`${baseUrl}/test/session`, {
				headers: { cookie: tutorCookie }
			});

			expect(loginResponse.status).toBe(200);
			await expect(sessionResponse.json()).resolves.toEqual({
				adminID: null,
				tutorID: tutor._id.toString(),
				userID: null
			});
		});
	});

	it("reports only tutorID from /accounts/me after tutor login", async () => {
		const tutor = makeEntity("tutor", "tutor-password");
		mockAccounts({ tutor });

		await withAccountRoutes(async baseUrl => {
			const staleCookie = await seedStaleUserSession(baseUrl);
			const loginResponse = await loginRequest(baseUrl, "tutor-password", staleCookie);
			const tutorCookie = responseCookie(loginResponse);
			const meResponse = await fetch(`${baseUrl}/accounts/me`, {
				headers: { cookie: tutorCookie }
			});

			expect(loginResponse.status).toBe(200);
			await expect(meResponse.json()).resolves.toEqual({
				adminID: null,
				tutorID: tutor._id.toString(),
				userID: null
			});
		});
	});

	it("never exposes password hashes in admin, tutor, or user login responses", async () => {
		const admin = makeEntity("admin", "admin-password");
		const tutor = makeEntity("tutor", "tutor-password");
		const user = makeEntity("user", "user-password");
		mockAccounts({ admin, tutor, user });
		const scenarios = [
			{ password: "admin-password", responseKey: "currentAdmin", hash: admin.password },
			{ password: "tutor-password", responseKey: "currentTutor", hash: tutor.password },
			{ password: "user-password", responseKey: "currentUser", hash: user.password }
		];

		await withAccountRoutes(async baseUrl => {
			for (const scenario of scenarios) {
				const response = await loginRequest(baseUrl, scenario.password);
				const responseText = await response.text();
				const body = JSON.parse(responseText) as Record<string, Record<string, unknown>>;

				expect(response.status).toBe(200);
				expect(body).toHaveProperty(scenario.responseKey);
				expect(body[scenario.responseKey]).not.toHaveProperty("password");
				expect(responseText).not.toContain(scenario.hash);
			}
		});
	});
});
