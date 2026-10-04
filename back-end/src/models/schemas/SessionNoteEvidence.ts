import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	actorId: { type: String, required: true },
	keyHash: { type: String, required: true },
	payloadHash: { type: String, required: true },
	studentId: { type: String, required: true },
	noteId: String,
	scheduledSessionId: String,
	sessionSnapshot: { startAt: Date, endAt: Date, timezone: String, scheduleRevision: Number },
	associationStatus: { type: String, required: true, enum: ["verified_session", "unlinked_review_required"] },
	classDate: { type: Date, required: true },
	source: { type: String, enum: ["mac_sent_item", "admin_attestation"], required: true },
	observedSendAt: { type: Date, required: true },
	evidenceType: { type: String, enum: ["observed_sent_item", "user_attestation"], required: true },
	evidenceRef: { type: String, required: true },
	replaces: { type: String },
	correctionReason: { type: String, enum: ["wrong_timestamp", "wrong_association", "withdrawn"] }
}, { timestamps: true, autoIndex: false });
schema.index({ actorId: 1, keyHash: 1 }, { unique: true });
schema.index({ studentId: 1, evidenceRef: 1 }, { unique: true });
schema.index({ studentId: 1, classDate: -1, _id: -1 });
schema.index({ replaces: 1 }, { unique: true, partialFilterExpression: { replaces: { $type: "string" } } });
export const SessionNoteEvidence = mongoose.model("SessionNoteEvidence", schema);
