import type { SessionNoteSendRecord } from "../../types/entities/ISessionNoteSend.js";
import mongoose, { Schema } from "mongoose";

const snapshot = new Schema({
	user: { type: String, required: true },
	studentName: { type: String, required: true },
	primaryEmail: { type: String, required: true },
	ccEmails: [String],
	subject: { type: String, required: true },
	sessionDate: { type: Date, required: true },
	markdown: { type: String, required: true },
	html: { type: String, required: true },
	scheduledSessionId: String,
	sessionSnapshot: { startAt: Date, endAt: Date, timezone: String, scheduleRevision: Number },
	associationStatus: { type: String, required: true }
}, { _id: false });
const schema = new Schema<SessionNoteSendRecord>({
	_id: { type: String, required: true },
	actorId: { type: String, required: true },
	keyHash: { type: String, required: true },
	payloadHash: { type: String, required: true },
	noteId: { type: String, required: true },
	noteVersion: { type: String, required: true },
	note: { type: snapshot, required: true },
	state: { type: String, enum: ["preparing", "queued", "sending", "smtp_accepted", "smtp_rejected", "send_failed", "delivery_unconfirmed"], required: true },
	messageId: { type: String, required: true },
	claimedAt: Date,
	claimId: String,
	sentAt: Date,
	evidenceRecordedAt: Date,
	errorCode: String,
	attempts: [{ _id: false, claimId: String, startedAt: Date, outcome: String }],
	archiveState: { type: String, enum: ["pending", "archiving", "archived", "retry", "review_required", "not_applicable"], required: true },
	archiveAttempts: { type: Number, default: 0 },
	archiveClaimedAt: Date,
	nextArchiveAt: Date,
	signalAt: Date,
	dispositions: [{ _id: false, actorId: String, at: Date, decision: String, evidenceRef: String, keyHash: String, payloadHash: String }]
}, { timestamps: true, autoIndex: false });
schema.index({ actorId: 1, keyHash: 1 }, { unique: true });
schema.index({ noteId: 1, noteVersion: 1 }, { unique: true });
// One immutable saved version owns one intent; corrections cannot bypass an uncertain attempt.
schema.index({ noteId: 1 }, { unique: true });
schema.index({ state: 1, createdAt: 1 });
schema.index({ archiveState: 1, nextArchiveAt: 1 });
schema.index({ "note.user": 1, "createdAt": -1 });
export const SessionNoteSend = mongoose.model<SessionNoteSendRecord>("SessionNoteSend", schema);
