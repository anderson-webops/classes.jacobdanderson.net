import type { Server } from "node:http";
import express from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ admin: vi.fn(), tutor: vi.fn(), student: vi.fn(), setting: vi.fn(), update: vi.fn(), candidates: vi.fn(), generate: vi.fn() }));
vi.mock("../src/models/schemas/Admin.js", () => ({ Admin: { findById: mocks.admin } }));
vi.mock("../src/models/schemas/Tutor.js", () => ({ Tutor: { findById: mocks.tutor } }));
vi.mock("../src/models/schemas/User.js", () => ({ User: { findOne: mocks.student } }));
vi.mock("../src/models/schemas/SessionNoteDraftSettings.js", () => ({ SessionNoteDraftSettings: { findById: mocks.setting, findOneAndUpdate: mocks.update } }));
vi.mock("../src/services/sessionNoteDrafting.js", async importOriginal => ({
	...await importOriginal<typeof import("../src/services/sessionNoteDrafting.js")>(),
	createSessionNoteDrafting: () => ({ candidates: mocks.candidates, generate: mocks.generate })
}));
const { sessionNoteDraftRoutes } = await import("../src/routes/sessionNoteDraftRoutes.js");
const adminId = "a".repeat(24);
const tutorId = "b".repeat(24);
const studentId = "c".repeat(24);
const body = { studentId, classDate: "2026-10-07" };

function query(value: unknown) {
	const result = { select: () => result, maxTimeMS: () => result, lean: async () => value };
	return result;
}
beforeEach(() => {
	vi.clearAllMocks();
	vi.stubEnv("SESSION_NOTE_AI_SITE_ORIGIN", "https://classes.jacobdanderson.net");
	vi.stubEnv("AUTH_ORIGIN", "https://classes.jacobdanderson.net");
	vi.stubEnv("SESSION_NOTE_ZOOM_HOST_ID", "synthetic-admin-host");
	vi.stubEnv("SESSION_NOTE_ZOOM_TUTOR_HOSTS", JSON.stringify({ [tutorId]: "synthetic-tutor-host" }));
	mocks.admin.mockResolvedValue({ _id: adminId, sessionVersion: 0 });
	mocks.tutor.mockResolvedValue({ _id: tutorId, sessionVersion: 0 });
	mocks.student.mockReturnValue(query({ name: "Synthetic Student" }));
	mocks.setting.mockReturnValue(query({ tutorsEnabled: false }));
	mocks.update.mockResolvedValue({ tutorsEnabled: true });
	mocks.candidates.mockResolvedValue({ status: "no_transcript", candidates: [] });
	mocks.generate.mockResolvedValue({ markdown: "Synthetic draft", draftOnly: true });
});
afterEach(() => vi.unstubAllEnvs());

async function withApi(run: (request: (path: string, method?: string, role?: string, input?: unknown, origin?: string) => Promise<Response>) => Promise<void>) {
	const app = express();
	app.use((req, _res, next) => {
		const role = req.get("x-role");
		req.session = {
			...(role === "admin" ? { adminID: adminId } : role === "tutor" ? { tutorID: tutorId } : role === "user" ? { userID: studentId } : {}),
			accountSessionVersion: 0, authenticatedSessionExpiresAt: Date.now() + 60_000
		};
		next();
	});
	app.use("/drafting", sessionNoteDraftRoutes);
	const server = await new Promise<Server>(resolve => { const instance = app.listen(0, "127.0.0.1", () => resolve(instance)); });
	try {
		const address = server.address();
		if (!address || typeof address === "string") throw new Error("No test port");
		await run((path, method = "POST", role = "admin", input = body, origin = "https://classes.jacobdanderson.net") => fetch(`http://127.0.0.1:${address.port}/drafting${path}`, {
			method, headers: { "content-type": "application/json", "x-role": role, origin, authorization: "Bearer synthetic-read-only" },
			...(method === "GET" ? {} : { body: JSON.stringify(input) })
		}));
	} finally {
		server.closeAllConnections();
		await new Promise<void>(resolve => server.close(() => resolve()));
	}
}

describe("session-note drafting authorization", () => {
	it("reports canonical admin availability separately from disabled provider processing", async () => {
		vi.stubEnv("SESSION_NOTE_AI_ENABLED", "false");
		await withApi(async request => {
			const response = await request("/settings", "GET");
			expect(response.status).toBe(200);
			expect(await response.json()).toMatchObject({ siteAvailable: true, allowed: true, ready: false, tutorsEnabled: false });
			expect(mocks.candidates).not.toHaveBeenCalled();
			expect(mocks.generate).not.toHaveBeenCalled();
		});
	});
	it("returns a bounded settings error without leaking database failures or calling providers", async () => {
		mocks.setting.mockReturnValue({ maxTimeMS: () => ({ lean: async () => { throw new Error("synthetic private database error"); } }) });
		await withApi(async request => {
			const response = await request("/settings", "GET");
			expect(response.status).toBe(503);
			expect(await response.json()).toEqual({ code: "DRAFT_UNAVAILABLE", message: "AI drafting is unavailable. Your notes are unchanged." });
			expect(mocks.candidates).not.toHaveBeenCalled();
			expect(mocks.generate).not.toHaveBeenCalled();
		});
	});
	it("lets a live administrator draft without enabling tutors and projects no private config", async () => {
		await withApi(async request => {
			const capabilities = await request("/settings", "GET");
			expect(capabilities.headers.get("cache-control")).toBe("no-store");
			expect(await capabilities.json()).toMatchObject({ siteAvailable: true, allowed: true, tutorsEnabled: false });
			expect((await request("/candidates")).status).toBe(200);
			expect(mocks.candidates).toHaveBeenCalledWith(expect.objectContaining({ actorId: adminId, hostId: "synthetic-admin-host", studentId }), expect.objectContaining({ meetingId: "2543520025" }));
		});
	});
	it("refuses students and bearer-only read credentials before touching drafting or settings", async () => {
		await withApi(async request => {
			for (const role of ["user", "reader", ""]) {
				for (const [path, method] of [["/candidates", "POST"], ["/generate", "POST"], ["/settings", "PUT"]]) expect((await request(path, method, role)).status).toBe(403);
			}
			expect(mocks.candidates).not.toHaveBeenCalled();
			expect(mocks.generate).not.toHaveBeenCalled();
			expect(mocks.update).not.toHaveBeenCalled();
		});
	});
	it("defaults tutors to disabled and lets only an admin change the global setting", async () => {
		await withApi(async request => {
			expect((await request("/candidates", "POST", "tutor")).status).toBe(403);
			expect((await request("/settings", "PUT", "tutor", { tutorsEnabled: true })).status).toBe(403);
			expect((await request("/settings", "PUT", "admin", { tutorsEnabled: true })).status).toBe(200);
			expect(mocks.update).toHaveBeenCalledWith({ _id: "session-note-drafting" }, expect.objectContaining({ $set: { tutorsEnabled: true }, $push: expect.any(Object) }), expect.objectContaining({ upsert: true, writeConcern: { w: "majority", j: true } }));
		});
	});
	it("restricts enabled tutors to assigned students and their protected Zoom host", async () => {
		mocks.setting.mockReturnValue(query({ tutorsEnabled: true }));
		await withApi(async request => {
			expect((await request("/candidates", "POST", "tutor")).status).toBe(200);
			expect(mocks.student).toHaveBeenCalledWith({ _id: studentId, tutors: tutorId });
			expect(mocks.candidates).toHaveBeenCalledWith(expect.objectContaining({ hostId: "synthetic-tutor-host", actorId: tutorId }), expect.any(Object));
			mocks.student.mockReturnValue(query(null));
			expect((await request("/candidates", "POST", "tutor")).status).toBe(404);
		});
	});
	it("does not give a tutor the administrator's Zoom host as a fallback", async () => {
		mocks.setting.mockReturnValue(query({ tutorsEnabled: true }));
		vi.stubEnv("SESSION_NOTE_ZOOM_TUTOR_HOSTS", "{}");
		await withApi(async request => {
			expect((await request("/candidates", "POST", "tutor")).status).toBe(503);
			expect(mocks.candidates).not.toHaveBeenCalled();
		});
	});
	it("enforces the tutor toggle again on generation, including after candidates were selected", async () => {
		await withApi(async request => {
			expect((await request("/generate", "POST", "tutor", { ...body, selectionToken: "d".repeat(64), confirmedStudent: true })).status).toBe(403);
			expect(mocks.generate).not.toHaveBeenCalled();
		});
	});
	it("blocks cross-origin writes, injected fields, impossible dates and oversized bodies", async () => {
		await withApi(async request => {
			expect((await request("/settings", "PUT", "admin", { tutorsEnabled: true }, "https://foreign.invalid")).status).toBe(403);
			for (const input of [{ ...body, classDate: "2026-02-30" }, { ...body, hostId: "foreign" }, { ...body, transcript: "x".repeat(5000) }]) expect((await request("/candidates", "POST", "admin", input)).status).toBe(400);
		});
	});
	it("does not make the feature available on downstream sites", async () => {
		vi.stubEnv("AUTH_ORIGIN", "https://math.avasan.org");
		await withApi(async request => {
			expect(await (await request("/settings", "GET")).json()).toEqual({ siteAvailable: false, ready: false, allowed: false, tutorsEnabled: false });
			expect((await request("/candidates")).status).toBe(404);
			expect(mocks.candidates).not.toHaveBeenCalled();
		});
	});
	it("bounds unknown errors without exposing student names, provider details or credentials", async () => {
		mocks.candidates.mockRejectedValue(new Error("raw transcript student@example.invalid secret"));
		await withApi(async request => {
			const response = await request("/candidates");
			expect(response.status).toBe(503);
			const text = await response.text();
			expect(text).not.toMatch(/raw transcript|example.invalid|secret/);
		});
	});
});
