import type { Model } from "mongoose";
import type { ISessionNote } from "../../types/entities/ISessionNote.ts";
import mongoose, { Schema } from "mongoose";

const deliverySchema = new Schema({
	source: { type: String, enum: ["site_smtp"], required: true },
	status: {
		type: String,
		enum: ["smtp_accepted", "smtp_rejected", "unknown"],
		required: true
	},
	sentAt: { type: Date, default: undefined }
}, { _id: false });

const sessionNoteSchema: Schema<ISessionNote> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: undefined,
			index: true
		},
		studentName: { type: String, required: true, trim: true },
		primaryEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
		ccEmails: { type: [String], default: [] },
		subject: { type: String, required: true },
		sessionDate: { type: Date, required: true, index: true },
		markdown: { type: String, required: true },
		html: { type: String, required: true },
		// Optional so saved/manual/legacy notes never acquire inferred send dates.
		delivery: { type: deliverySchema, default: undefined },
		associationReviewResolved: Boolean,
		associationCorrections: [{ _id: false, at: Date, actorId: String, keyHash: String, payloadHash: String, previousSessionId: String, nextSessionId: String, nextSnapshot: { startAt: Date, endAt: Date, timezone: String, scheduleRevision: Number } }],
		workflowVersion: Number,
		noteVersion: String,
		savedAt: Date,
		scheduledSessionId: { type: Schema.Types.ObjectId, ref: "ScheduledSession", index: true },
		sessionSnapshot: { startAt: Date, endAt: Date, timezone: String, scheduleRevision: Number },
		associationStatus: { type: String, enum: ["verified_session", "unlinked_review_required"] }
	},
	{ timestamps: true }
);

sessionNoteSchema.index({ studentName: 1, sessionDate: -1 });
sessionNoteSchema.index({ primaryEmail: 1, sessionDate: -1 });
sessionNoteSchema.index({ user: 1, sessionDate: -1, createdAt: -1 });
sessionNoteSchema.index({ user: 1, sessionDate: -1, _id: -1 });
sessionNoteSchema.index(
	{ studentName: 1, sessionDate: -1, _id: -1 },
	{ collation: { locale: "en", strength: 2 } }
);

export const SessionNote: Model<ISessionNote> = mongoose.model<ISessionNote>("SessionNote", sessionNoteSchema);
