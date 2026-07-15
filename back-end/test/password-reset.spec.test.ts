import type { Server } from "node:http";
import type { CustomSession } from "../src/types/session/CustomSession.js";
import { createHash } from "node:crypto";
import cookieSession from "cookie-session";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.PASSWORD_RESET_RATE_MAX = "1000";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	adminFindOne: vi.fn(),
	resetDeleteOne: vi.fn(),
	resetFindOneAndDelete: vi.fn(),
	resetFindOneAndUpdate: vi.fn(),
	tutorFindById: vi.fn(),
	tutorFindOne: vi.fn(),
	userFindById: vi.fn(),
	userFindOne: vi.fn()
}));

const emailMocks = vi.hoisted(() => ({
	sendTransactionalEmail: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		findById: modelMocks.adminFindById,
		findOne: modelMocks.adminFindOne
	}
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: {
		findById: modelMocks.tutorFindById,
		findOne: modelMocks.tutorFindOne
	}
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: {
		findById: modelMocks.userFindById,
		findOne: modelMocks.userFindOne
	}
}));

vi.mock("../src/models/schemas/PasswordResetToken.js", () => ({
	PasswordResetToken: {
		deleteOne: modelMocks.resetDeleteOne,
		findOneAndDelete: modelMocks.resetFindOneAndDelete,
		findOneAndUpdate: modelMocks.resetFindOneAndUpdate
	}
}));

vi.mock("../src/utils/transactionalEmail.js", () => ({
	sendTransactionalEmail: emailMocks.sendTransactionalEmail
}));

const { accountRoutes } = await import("../src/routes/accountRoutes.js");

interface TestAccount {
	_id: Types.ObjectId;
	email: string;
	password: string;
	save: ReturnType<typeof vi.fn>;
}

function queryWith<T>(result: T) {
	return {
		exec: vi.fn().mockResolvedValue(result)
	};
}

function makeAccount(email = "julio@example.com"): TestAccount {
	return {
		_id: new Types.ObjectId(),
		email,
		password: "stored-password-hash",
		save: vi.fn().mockResolvedValue(undefined)
	};
}

function mockAccounts({
	admin = null,
	tutor = null,
	user = null
}: {
	admin?: TestAccount | null;
	tutor?: TestAccount | null;
	user?: TestAccount | null;
}) {
	modelMocks.adminFindOne.mockReturnValue(queryWith(admin));
	modelMocks.tutorFindOne.mockReturnValue(queryWith(tutor));
	modelMocks.userFindOne.mockReturnValue(queryWith(user));
}

async function withAccountRoutes<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.set("trust proxy", false);
	app.use(express.json());
	app.use(cookieSession({
		name: "session",
		keys: ["password-reset-test-secret"]
	}));
	app.post("/test/session/stale", (req, res) => {
		const session = req.session as CustomSession;
		session.adminID = "stale-admin-id";
		session.userID = "stale-user-id";
		res.sendStatus(204);
	});
	app.use("/accounts", accountRoutes);

	const server = await new Promise<Server>((resolve) => {
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
			server.close((error) => {
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

describe("password reset", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAccounts({});
		modelMocks.resetFindOneAndUpdate.mockReturnValue(queryWith({}));
		modelMocks.resetDeleteOne.mockReturnValue(queryWith({ deletedCount: 1 }));
		emailMocks.sendTransactionalEmail.mockResolvedValue(undefined);
	});

	it("creates a hashed one-time reset for the tutor instead of a stale user record", async () => {
		const tutor = makeAccount();
		const staleUser = makeAccount();
		mockAccounts({ tutor, user: staleUser });

		await withAccountRoutes(async (baseUrl) => {
			const response = await fetch(`${baseUrl}/accounts/password-reset/request`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ email: "  JULIO@EXAMPLE.COM " })
			});

			expect(response.status).toBe(202);
			await expect(response.json()).resolves.toEqual({
				message: "If an account uses that email, a password reset link is on its way."
			});
			await vi.waitFor(() => {
				expect(emailMocks.sendTransactionalEmail).toHaveBeenCalledTimes(1);
			});

			expect(modelMocks.adminFindOne).toHaveBeenCalledWith({ email: "julio@example.com" });
			expect(modelMocks.tutorFindOne).toHaveBeenCalledWith({ email: "julio@example.com" });
			expect(modelMocks.userFindOne).toHaveBeenCalledWith({ email: "julio@example.com" });
			const [filter, update] = modelMocks.resetFindOneAndUpdate.mock.calls[0] as [
				Record<string, unknown>,
				{ $set: { tokenHash: string } }
			];
			expect(filter).toEqual({ role: "tutor", accountID: tutor._id });

			const mail = emailMocks.sendTransactionalEmail.mock.calls[0][0] as { text: string };
			const resetLink = mail.text.split("\n").find(line => line.startsWith("https://"));
			expect(resetLink).toBeTruthy();
			const rawToken = new URL(resetLink!).searchParams.get("token");
			expect(rawToken).toMatch(/^[a-f\d]{64}$/);
			expect(update.$set.tokenHash).not.toBe(rawToken);
			expect(update.$set.tokenHash).toBe(
				createHash("sha256").update(rawToken!).digest("hex")
			);
		});
	});

	it("returns the same response without creating a token for an unknown email", async () => {
		await withAccountRoutes(async (baseUrl) => {
			const response = await fetch(`${baseUrl}/accounts/password-reset/request`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ email: "unknown@example.com" })
			});

			expect(response.status).toBe(202);
			await expect(response.json()).resolves.toEqual({
				message: "If an account uses that email, a password reset link is on its way."
			});
			await vi.waitFor(() => {
				expect(modelMocks.userFindOne).toHaveBeenCalledTimes(1);
			});
			expect(modelMocks.resetFindOneAndUpdate).not.toHaveBeenCalled();
			expect(emailMocks.sendTransactionalEmail).not.toHaveBeenCalled();
		});
	});

	it("updates the selected role, consumes the token, and clears stale session roles", async () => {
		const rawToken = "a".repeat(64);
		const tutor = makeAccount();
		modelMocks.resetFindOneAndDelete.mockReturnValue(queryWith({
			accountID: tutor._id,
			role: "tutor"
		}));
		modelMocks.tutorFindById.mockReturnValue(queryWith(tutor));

		await withAccountRoutes(async (baseUrl) => {
			const staleResponse = await fetch(`${baseUrl}/test/session/stale`, { method: "POST" });
			const staleCookie = responseCookie(staleResponse);
			const response = await fetch(`${baseUrl}/accounts/password-reset/confirm`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					cookie: staleCookie
				},
				body: JSON.stringify({ token: rawToken, newPassword: "new-secure-password" })
			});
			const resetCookie = responseCookie(response);
			const meResponse = await fetch(`${baseUrl}/accounts/me`, {
				headers: { cookie: resetCookie }
			});

			expect(response.status).toBe(200);
			expect(modelMocks.resetFindOneAndDelete).toHaveBeenCalledWith({
				tokenHash: createHash("sha256").update(rawToken).digest("hex"),
				expiresAt: { $gt: expect.any(Date) }
			});
			expect(modelMocks.tutorFindById).toHaveBeenCalledWith(tutor._id);
			expect(tutor.password).toBe("new-secure-password");
			expect(tutor.save).toHaveBeenCalledTimes(1);
			await expect(meResponse.json()).resolves.toEqual({
				adminID: null,
				tutorID: null,
				userID: null
			});
		});
	});

	it("rejects an expired or already-used reset token", async () => {
		modelMocks.resetFindOneAndDelete.mockReturnValue(queryWith(null));

		await withAccountRoutes(async (baseUrl) => {
			const response = await fetch(`${baseUrl}/accounts/password-reset/confirm`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					token: "b".repeat(64),
					newPassword: "another-secure-password"
				})
			});

			expect(response.status).toBe(400);
			await expect(response.json()).resolves.toEqual({
				message: "This password reset link is invalid or expired."
			});
			expect(modelMocks.tutorFindById).not.toHaveBeenCalled();
		});
	});
});
