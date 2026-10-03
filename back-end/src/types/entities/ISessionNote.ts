// src/types/entities/ISessionNote.ts
import type { Document, Types } from "mongoose";

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
	createdAt: Date;
	updatedAt: Date;
}
