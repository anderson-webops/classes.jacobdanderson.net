import type { Model, Types } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface ISecurityAuditEvent {
	action: string;
	actorID?: Types.ObjectId;
	actorRole?: "admin" | "tutor" | "user";
	ipHash?: string;
	metadata?: Record<string, unknown>;
	outcome: "denied" | "failure" | "success";
	targetID?: Types.ObjectId;
	targetRole?: "admin" | "tutor" | "user";
	userAgent?: string;
}

const securityAuditEventSchema = new Schema<ISecurityAuditEvent>(
	{
		action: { type: String, required: true, trim: true, maxlength: 120, index: true },
		actorID: { type: Schema.Types.ObjectId, default: undefined, index: true },
		actorRole: {
			type: String,
			enum: ["admin", "tutor", "user"],
			default: undefined,
			index: true
		},
		ipHash: { type: String, default: undefined, maxlength: 64 },
		metadata: { type: Schema.Types.Mixed, default: undefined },
		outcome: {
			type: String,
			enum: ["denied", "failure", "success"],
			required: true,
			index: true
		},
		targetID: { type: Schema.Types.ObjectId, default: undefined, index: true },
		targetRole: {
			type: String,
			enum: ["admin", "tutor", "user"],
			default: undefined
		},
		userAgent: { type: String, default: undefined, maxlength: 300 }
	},
	{ timestamps: true }
);

securityAuditEventSchema.index({ createdAt: -1, action: 1 });
securityAuditEventSchema.index({ targetRole: 1, targetID: 1, createdAt: -1 });

export const SecurityAuditEvent: Model<ISecurityAuditEvent>
	= mongoose.models.SecurityAuditEvent
		|| mongoose.model<ISecurityAuditEvent>(
			"SecurityAuditEvent",
			securityAuditEventSchema
		);
