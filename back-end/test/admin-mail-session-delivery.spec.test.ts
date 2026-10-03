import type { Server } from "node:http";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import express from "express";
import { Types } from "mongoose";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	send: vi.fn(),
	append: vi.fn(),
	connect: vi.fn(),
	logout: vi.fn(),
	create: vi.fn(),
	find: vi.fn(),
	findUser: vi.fn(),
	findNamedUser: vi.fn(),
	admin: vi.fn()
}));
vi.mock("nodemailer", () => ({
	default: {
		createTransport: (options: { streamTransport?: boolean }) => ({
			sendMail: options.streamTransport
				? async () => ({ message: Buffer.from("TEST MIME") })
				: mocks.send
		})
	}
}));
vi.mock("imapflow", () => ({
	ImapFlow: class {
		connect = mocks.connect;
		append = mocks.append;
		logout = mocks.logout;
	}
}));
vi.mock("../src/models/schemas/SessionNote.js", () => ({
	SessionNote: { create: mocks.create, find: mocks.find }
}));
vi.mock("../src/models/schemas/User.js", () => ({
	User: { find: mocks.findUser, findOne: mocks.findNamedUser }
}));
vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findById: mocks.admin }
}));
vi.mock("../src/utils/markdownEmail.js", () => ({
	renderMarkdownEmailHtml: async () => "<p>Test notes</p>"
}));

vi.stubEnv("IMAP_APPEND_PASS", "mock-only");
vi.stubEnv("SMTP_FALLBACK_USER", "mock-only");
vi.stubEnv("SMTP_FALLBACK_PASS", "mock-only");
vi.stubEnv("MDMAIL_ALLOW_TO", "");
const { adminMailRoutes } = await import("../src/routes/adminMailRoutes.js");
afterAll(() => vi.unstubAllEnvs());

const adminID = new Types.ObjectId().toString();
const studentID = new Types.ObjectId().toString();
const startedAt = new Date("2026-10-03T17:00:00Z");
const completedAt = new Date("2026-10-03T17:00:05Z");
const afterCopyAt = new Date("2026-10-03T17:00:12Z");

async function withMail(run: (baseUrl: string) => Promise<void>) {
	const app = express();
	app.use(express.json());
	app.use((req, _res, next) => {
		req.session = req.get("x-admin")
			? {
					adminID,
					accountSessionVersion: 0,
					authenticatedSessionExpiresAt: afterCopyAt.getTime() + 60_000
				}
			: {};
		next();
	});
	app.use("/admin-mail", adminMailRoutes);
	const server = await new Promise<Server>((resolve) => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	try {
		const address = server.address();
		if (!address || typeof address === "string") throw new Error("No test port");
		await run(`http://127.0.0.1:${address.port}/admin-mail`);
	}
	finally {
		server.closeAllConnections();
		await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
	}
}

async function send(url: string, extra: Record<string, unknown> = {}) {
	return fetch(`${url}/send`, {
		method: "POST",
		headers: { "content-type": "application/json", "x-admin": adminID },
		body: JSON.stringify({
			to: "student@example.test,parent@example.test",
			subject: "Test notes",
			md: "Test notes",
			recipientName: "Student",
			sessionDate: "2026-09-30",
			...extra
		})
	});
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.useFakeTimers({ toFake: ["Date"] });
	vi.setSystemTime(startedAt);
	vi.spyOn(console, "info").mockImplementation(() => {});
	vi.spyOn(console, "warn").mockImplementation(() => {});
	vi.spyOn(console, "error").mockImplementation(() => {});
	mocks.send.mockImplementation(async () => {
		vi.setSystemTime(completedAt);
		return { accepted: ["student@example.test"], rejected: [], messageId: "<test@example.test>" };
	});
	mocks.append.mockImplementation(async () => {
		vi.setSystemTime(afterCopyAt);
	});
	mocks.admin.mockResolvedValue({ sessionVersion: 0 });
	mocks.findUser.mockReturnValue({ lean: async () => [] });
	mocks.findNamedUser.mockReturnValue({ lean: async () => null });
	const query = { sort: () => query, limit: () => query, lean: async () => [] };
	mocks.find.mockReturnValue(query);
});
afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe("site SMTP session-note evidence", () => {
	it.each([false, true])("stores actual SMTP completion before the Sent-folder copy, linked=%s", async (linked) => {
		if (linked) {
			mocks.findNamedUser.mockReturnValue({
				lean: async () => ({ _id: studentID, name: "Student", email: "student@example.test" })
			});
		}
		await withMail(async (url) => {
			expect((await send(url)).status).toBe(200);
			expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
				sessionDate: new Date("2026-09-30T12:00:00Z"),
				delivery: { source: "site_smtp", status: "smtp_accepted", sentAt: completedAt }
			}));
			const saved = mocks.create.mock.lastCall?.[0];
			expect(saved.user).toBe(linked ? studentID : undefined);
			expect(mocks.append).toHaveBeenCalledOnce();
			expect(saved.delivery.sentAt).not.toEqual(mocks.send.mock.lastCall?.[0].date);
		});
	});
	it("retains send evidence when the optional IMAP copy fails", async () => {
		mocks.append.mockRejectedValue(new Error("Test copy failure"));
		await withMail(async (url) => {
			expect((await send(url)).status).toBe(200);
			expect(mocks.create.mock.lastCall?.[0].delivery.sentAt).toEqual(completedAt);
		});
	});
	it("records fallback transport completion", async () => {
		mocks.send.mockRejectedValueOnce(Object.assign(new Error("Test transport down"), { code: "ECONNREFUSED" }));
		await withMail(async (url) => {
			expect((await send(url)).status).toBe(200);
			expect(mocks.send).toHaveBeenCalledTimes(2);
			expect(mocks.create.mock.lastCall?.[0].delivery.sentAt).toEqual(completedAt);
		});
	});
	it("does not mark a rejected primary recipient as sent when only CC succeeds", async () => {
		mocks.send.mockResolvedValue({
			accepted: ["parent@example.test"],
			rejected: ["student@example.test"]
		});
		await withMail(async (url) => {
			expect((await send(url)).status).toBe(200);
			expect(mocks.create.mock.lastCall?.[0].delivery).toEqual({
				source: "site_smtp",
				status: "smtp_rejected"
			});
		});
	});
	it("does not persist claimed evidence after SMTP failure", async () => {
		mocks.send.mockRejectedValue(new Error("Test send failure"));
		await withMail(async (url) => {
			expect((await send(url)).status).toBe(502);
			expect(mocks.create).not.toHaveBeenCalled();
		});
	});
	it("does not accept the verification credential for mail sending or note contents", async () => {
		const token = "x".repeat(43);
		vi.stubEnv("SESSION_NOTES_READ_TOKEN_SHA256", createHash("sha256").update(token).digest("hex"));
		vi.stubEnv("SESSION_NOTES_READ_TOKEN_EXPIRES_AT", afterCopyAt.toISOString());
		await withMail(async (url) => {
			const headers = { authorization: `Bearer ${token}` };
			expect((await fetch(`${url}/send`, { headers, method: "POST" })).status).toBe(403);
			expect((await fetch(`${url}/session-notes/recent`, { headers })).status).toBe(403);
			expect(mocks.send).not.toHaveBeenCalled();
			expect(mocks.find).not.toHaveBeenCalled();
		});
	});
});
