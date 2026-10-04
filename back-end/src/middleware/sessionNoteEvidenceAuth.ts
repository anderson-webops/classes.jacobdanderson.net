import type { Request, RequestHandler } from "express";
import { Buffer } from "node:buffer";
import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "node:process";
import { validAdmin } from "./auth.js";
import { createRequestOriginGuard } from "./requestOriginGuard.js";

export function evidenceMachineIdentity(req: Request): { actorId: string; students: string[] } | null {
	const token = /^Bearer ([\w-]{43,128})$/i.exec(req.get("authorization") ?? "")?.[1];
	const expected = env.SESSION_NOTES_EVIDENCE_TOKEN_SHA256 ?? "";
	const expires = Date.parse(env.SESSION_NOTES_EVIDENCE_TOKEN_EXPIRES_AT ?? "");
	const students = (env.SESSION_NOTES_EVIDENCE_STUDENT_IDS ?? "").split(",").filter(Boolean);
	if (!token || !/^[a-f0-9]{64}$/.test(expected) || expected === env.SESSION_NOTES_READ_TOKEN_SHA256?.toLowerCase()
		|| !Number.isFinite(expires) || expires <= Date.now()
		|| env.SESSION_NOTES_EVIDENCE_SCOPE !== "register"
		|| !students.length || students.length > 1000 || students.some(id => !/^[a-f0-9]{24}$/.test(id))
		|| !timingSafeEqual(createHash("sha256").update(token).digest(), Buffer.from(expected, "hex"))) {
		return null;
	}
	return { actorId: `machine:${expected.slice(0, 16)}`, students };
}
export const sessionNoteEvidenceAuth: RequestHandler = (req, res, next) => {
	if (req.get("authorization") !== undefined) {
		if (!evidenceMachineIdentity(req)) {
			res.status(401).json({ message: "Invalid, expired or insufficient evidence credential" });
			return;
		}
		next();
		return;
	}
	// Session-based registration retains the same Origin/Referer CSRF protection
	// even when this router is mounted by another application.
	createRequestOriginGuard()(req, res, () => validAdmin(req, res, next));
};

export function createNoteAwareRequestOriginGuard(): RequestHandler {
	const guard = createRequestOriginGuard();
	return (req, res, next) => {
		if (req.method === "POST" && req.path === "/session-notes/evidence" && evidenceMachineIdentity(req)) return next();
		guard(req, res, next);
	};
}
