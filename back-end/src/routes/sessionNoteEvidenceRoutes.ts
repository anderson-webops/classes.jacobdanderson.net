import { Router } from "express";
import { z } from "zod";
import { createSessionNoteVerificationLimiter } from "../middleware/rateLimiters.js";
import { evidenceMachineIdentity, sessionNoteEvidenceAuth } from "../middleware/sessionNoteEvidenceAuth.js";
import { ScheduledSession } from "../models/schemas/ScheduledSession.js";
import { SessionNote } from "../models/schemas/SessionNote.js";
import { SessionNoteEvidence } from "../models/schemas/SessionNoteEvidence.js";
import { User } from "../models/schemas/User.js";
import { ensureNoteWorkflowIndexes, noteAssociationMatches } from "../services/sessionNoteSending.js";
import { withSessionNoteWriter } from "../services/sessionNoteWriteFence.js";
import { metadataHash, noteDay, noteObjectId, NoteWorkflowError, snapshotSession } from "../utils/sessionNoteIdentity.js";

import { externalEvidenceStatus } from "../utils/sessionNoteVerificationMetadata.js";

const schema = z.object({
	studentId: noteObjectId,
	noteId: noteObjectId.optional(),
	scheduledSessionId: noteObjectId.optional(),
	unlinked: z.boolean().optional(),
	classDate: noteDay,
	source: z.enum(["mac_sent_item", "admin_attestation"]),
	observedSendAt: z.iso.datetime({ offset: true }),
	evidenceType: z.enum(["observed_sent_item", "user_attestation"]),
	// SHA-256 of a protected local reference. Raw mail identifiers are rejected.
	evidenceRef: z.string().regex(/^[a-f0-9]{64}$/),
	idempotencyKey: z.string().regex(/^[\w-]{16,128}$/),
	replaces: noteObjectId.optional(),
	correctionReason: z.enum(["wrong_timestamp", "wrong_association", "withdrawn"]).optional()
}).strict().refine(v => Boolean(v.scheduledSessionId) !== Boolean(v.unlinked)).refine(v => (v.source === "mac_sent_item") === (v.evidenceType === "observed_sent_item")).refine(v => Boolean(v.replaces) === Boolean(v.correctionReason)).refine(v => Date.parse(v.observedSendAt) <= Date.now() + 60_000);
export const sessionNoteEvidenceRoutes = Router();
sessionNoteEvidenceRoutes.use((_req, res, next) => {
	res.set("Cache-Control", "no-store");
	next();
});
sessionNoteEvidenceRoutes.post("/", createSessionNoteVerificationLimiter({ limit: 20 }), sessionNoteEvidenceAuth, async (req, res) => {
	const parsed = schema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid evidence metadata" });
	const input = parsed.data;
	const machine = evidenceMachineIdentity(req);
	if (machine && (!machine.students.includes(input.studentId) || input.replaces || input.source !== "mac_sent_item")) {
		return res.status(403).json({ message: "Evidence scope does not permit this operation" });
	}
	try {
		const actorId = machine?.actorId ?? String(req.currentAdmin!._id);
		const keyHash = metadataHash(input.idempotencyKey);
		const payload = { studentId: input.studentId, noteId: input.noteId ?? null, scheduledSessionId: input.scheduledSessionId ?? null, unlinked: input.unlinked === true, classDate: input.classDate, source: input.source, observedSendAt: new Date(input.observedSendAt).toISOString(), evidenceType: input.evidenceType, evidenceRef: input.evidenceRef, replaces: input.replaces ?? null, correctionReason: input.correctionReason ?? null };
		const payloadHash = metadataHash(payload);
		await ensureNoteWorkflowIndexes();
		const prior = await SessionNoteEvidence.findOne({ actorId, keyHash }).maxTimeMS(2000).lean();
		if (prior) {
			if (prior.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "idempotency_payload_conflict");
			return res.json({ recordId: String(prior._id), evidenceStatus: externalEvidenceStatus(prior) });
		}
		const student = await User.findById(input.studentId).select({ _id: 1 });
		if (!student) throw new NoteWorkflowError(404, "student_not_found");
		const session = input.scheduledSessionId ? await ScheduledSession.findOne({ _id: input.scheduledSessionId, user: student._id }) : null;
		if (input.scheduledSessionId && !session) throw new NoteWorkflowError(409, "session_identity_conflict");
		if (input.noteId) {
			const note = await SessionNote.findOne({ _id: input.noteId, user: student._id });
			if (!note || !noteAssociationMatches(note, { scheduledSessionId: input.scheduledSessionId, sessionSnapshot: session ? snapshotSession(session) : undefined } as any)) throw new NoteWorkflowError(409, "note_identity_conflict");
		}
		if (input.replaces) {
			const old = await SessionNoteEvidence.findOne({ _id: input.replaces, studentId: input.studentId });
			if (!old) throw new NoteWorkflowError(409, "correction_identity_conflict");
			if (old.evidenceType === "observed_sent_item" && input.evidenceType === "user_attestation") throw new NoteWorkflowError(409, "stronger_evidence_cannot_be_replaced");
		}
		const record = {
			actorId,
			keyHash,
			payloadHash,
			studentId: input.studentId,
			noteId: input.noteId,
			scheduledSessionId: input.scheduledSessionId,
			sessionSnapshot: session ? snapshotSession(session) : undefined,
			associationStatus: session ? "verified_session" as const : "unlinked_review_required" as const,
			classDate: new Date(`${input.classDate}T12:00:00Z`),
			source: input.source,
			observedSendAt: new Date(input.observedSendAt),
			evidenceType: input.evidenceType,
			evidenceRef: input.evidenceRef,
			replaces: input.replaces,
			correctionReason: input.correctionReason
		};
		let saved;
		try {
			saved = await withSessionNoteWriter(input.studentId, async () => (await SessionNoteEvidence.create([record], { w: "majority", j: true, wtimeout: 5000 }))[0]);
		}
		catch (e) {
			if ((e as { code?: number }).code !== 11000) throw e;
			saved = await SessionNoteEvidence.findOne({ $or: [{ actorId, keyHash }, { studentId: input.studentId, evidenceRef: input.evidenceRef }] });
			if (!saved || saved.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "evidence_deduplication_conflict");
		}
		return res.status(201).json({ recordId: String(saved._id), evidenceStatus: externalEvidenceStatus(saved) });
	}
	catch (error) {
		return res.status(error instanceof NoteWorkflowError ? error.status : 503).json({ message: error instanceof NoteWorkflowError ? error.code : "Evidence registration unavailable" });
	}
});
