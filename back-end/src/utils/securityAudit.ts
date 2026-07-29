import type { Request } from "express";
import type { Types } from "mongoose";
import { createHmac } from "node:crypto";
import { env } from "node:process";
import mongoose from "mongoose";
import { SecurityAuditEvent } from "../models/schemas/SecurityAuditEvent.js";

type AuditRole = "admin" | "tutor" | "user";

interface SecurityAuditInput {
	action: string;
	metadata?: Record<string, unknown>;
	outcome?: "denied" | "failure" | "success";
	targetID?: Types.ObjectId | string;
	targetRole?: AuditRole;
}

function requestActor(req: Request) {
	if (req.currentAdmin) {
		return { actorID: req.currentAdmin._id, actorRole: "admin" as const };
	}
	if (req.currentTutor) {
		return { actorID: req.currentTutor._id, actorRole: "tutor" as const };
	}
	if (req.currentUser) {
		return { actorID: req.currentUser._id, actorRole: "user" as const };
	}
	return {};
}

function requestIpHash(req: Request) {
	const auditKey = env.SECURITY_AUDIT_KEY || env.SESSION_SECRET;
	const ip = req.ip ?? req.socket.remoteAddress;
	if (!auditKey || !ip) return undefined;
	return createHmac("sha256", auditKey).update(ip).digest("hex");
}

export async function recordSecurityAuditEvent(
	req: Request,
	event: SecurityAuditInput
) {
	if (mongoose.connection.readyState !== 1) return;
	try {
		await SecurityAuditEvent.create({
			...requestActor(req),
			action: event.action,
			ipHash: requestIpHash(req),
			metadata: event.metadata,
			outcome: event.outcome ?? "success",
			targetID: event.targetID,
			targetRole: event.targetRole,
			userAgent: req.get("user-agent")?.slice(0, 300)
		});
	}
	catch (error) {
		console.error("Unable to write security audit event:", error);
	}
}
