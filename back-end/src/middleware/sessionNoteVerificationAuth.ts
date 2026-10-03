import type { RequestHandler } from "express";
import { Buffer } from "node:buffer";
import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "node:process";
import { validAdmin } from "./auth.js";

export const sessionNoteVerificationAuth: RequestHandler = (req, res, next) => {
	const authorization = req.get("authorization");
	if (authorization === undefined) return validAdmin(req, res, next);

	const token = /^Bearer ([\w-]{43,128})$/i.exec(authorization)?.[1];
	const expected = env.SESSION_NOTES_READ_TOKEN_SHA256 ?? "";
	const expiresAt = Date.parse(env.SESSION_NOTES_READ_TOKEN_EXPIRES_AT ?? "");
	if (
		!token || !/^[a-f0-9]{64}$/i.test(expected)
		|| !Number.isFinite(expiresAt) || expiresAt <= Date.now()
		|| !timingSafeEqual(
			createHash("sha256").update(token).digest(),
			Buffer.from(expected, "hex")
		)
	) {
		res.setHeader("WWW-Authenticate", "Bearer");
		res.status(401).json({ message: "Invalid or expired read-only credential" });
		return;
	}
	// This credential grants access only inside this router. It never creates
	// an admin session and is not accepted by mail sending or account routes.
	next();
};
