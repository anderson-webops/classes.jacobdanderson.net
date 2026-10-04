// src/types/entities/ISessionNote.ts
import type { Document, Types } from "mongoose";
import type { SessionSnapshot } from "./ISessionNoteSend.js";

export interface SessionNoteDelivery {
	source: "site_smtp";
	status: "smtp_accepted" | "smtp_rejected" | "unknown";
	sentAt?: Date;
}

export interface ISessionNote extends Document {
	user?: Types.ObjectId;
	studentName: string;
	primaryEmail: string;
	ccEmails: string[];
	subject: string;
	sessionDate: Date;
	markdown: string;
	html: string;
	delivery?: SessionNoteDelivery;
	associationReviewResolved?: boolean;
	associationCorrections?: { at: Date; actorId: string; keyHash: string; payloadHash: string; previousSessionId?: string; nextSessionId: string; nextSnapshot: SessionSnapshot }[];
	workflowVersion?: number;
	noteVersion?: string;
	savedAt?: Date;
	scheduledSessionId?: Types.ObjectId;
	sessionSnapshot?: SessionSnapshot;
	associationStatus?: "verified_session" | "unlinked_review_required";
	createdAt: Date;
	updatedAt: Date;
}
