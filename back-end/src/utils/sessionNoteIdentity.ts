import type { Request } from "express";
import { createHash } from "node:crypto";
import { Types } from "mongoose";
import { z } from "zod";
import { ScheduledSession } from "../models/schemas/ScheduledSession.js";
import { User } from "../models/schemas/User.js";
import { loadAdminRecipients } from "./adminRecipients.js";

export const noteObjectId = z.string().regex(/^[a-f0-9]{24}$/i).transform(v => v.toLowerCase());
export const noteDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => {
	const date = new Date(`${v}T12:00:00Z`);
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === v;
});
export class NoteWorkflowError extends Error {
	constructor(readonly status: number, readonly code: string) { super(code); }
}
export const metadataHash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export const normalizeNoteEmails = (values: string[]) => [...new Set(values.map(v => v.trim().toLowerCase()).filter(Boolean))];
const normalized = (value: string) => value.trim().toLowerCase();
export function snapshotSession(session: { startAt: Date; endAt: Date; timezone: string; scheduleRevision?: number }) {
	return { startAt: session.startAt, endAt: session.endAt, timezone: session.timezone, scheduleRevision: session.scheduleRevision ?? 0 };
}
export async function resolveNoteIdentity(req: Request, input: {
	studentId: string;
	scheduledSessionId?: string;
	unlinked?: boolean;
	primaryEmail?: string;
	recipientName?: string;
}) {
	const student = await User.findById(input.studentId).select("+recipientNameKey").maxTimeMS(2000);
	if (!student) throw new NoteWorkflowError(404, "student_not_found");
	if (!req.currentAdmin && (!req.currentTutor || !student.tutors.some(t => String((t as any)._id ?? t) === String(req.currentTutor!._id)))) {
		throw new NoteWorkflowError(403, "student_not_authorized");
	}
	if (input.recipientName) {
		const name = normalized(input.recipientName);
		const expected = normalized(student.recipientNameKey || student.recipientName || student.name);
		if (name !== expected) throw new NoteWorkflowError(409, "recipient_identity_conflict");
	}
	if (input.primaryEmail) {
		const primary = normalized(input.primaryEmail);
		const mapped = loadAdminRecipients().find(r => normalized(r.name) === normalized(student.recipientNameKey || student.recipientName || student.name));
		// Guardian mailboxes require an explicit configured child mapping, not an email-only account lookup.
		if (primary !== normalized(student.email) && primary !== mapped?.emails[0]) throw new NoteWorkflowError(409, "recipient_identity_conflict");
	}
	if (Boolean(input.scheduledSessionId) === Boolean(input.unlinked)) {
		throw new NoteWorkflowError(400, "select_session_or_explicit_unlinked");
	}
	if (!input.scheduledSessionId) return { student, associationStatus: "unlinked_review_required" as const };
	const session = await ScheduledSession.findOne({ _id: new Types.ObjectId(input.scheduledSessionId), user: student._id });
	if (!session) throw new NoteWorkflowError(409, "session_identity_conflict");
	if (req.currentTutor && String(session.tutor) !== String(req.currentTutor._id)) throw new NoteWorkflowError(403, "session_not_authorized");
	return {
		student,
		scheduledSessionId: String(session._id),
		sessionSnapshot: snapshotSession(session),
		associationStatus: "verified_session" as const
	};
}
