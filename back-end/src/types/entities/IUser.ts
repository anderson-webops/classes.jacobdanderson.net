// src/types/entities/IUser.ts
import type { Types } from "mongoose";
import type { IBaseUser } from "../abstractions/BaseUser.js";

export interface IUser extends IBaseUser {
	noteWorkflowDeleting?: boolean;
	noteWorkflowWriters?: { id: string; at: Date }[];
	noteWorkflowWriterDispositions?: { at: Date; actorId: string; writerId: string; keyHash: string; payloadHash: string; evidenceRef: string }[];
	age: string;
	state: string;
	tutors: Types.ObjectId[];
	courseAccess: string[];
	courseStatus: Record<string, CourseAccessStatus>;
	courseProgress: CourseProgress[];
	recipientName?: string;
	recipientNameKey?: string;
	editUsers: boolean;
	role: string; // e.g. "user"
}

export type CourseAccessStatus = "current" | "past" | "available";

export interface CourseProgress {
	courseId: string;
	completedModuleIds: string[];
	completedItemIds: string[];
	updatedAt?: Date;
	updatedBy?: Types.ObjectId;
	updatedByRole?: "admin" | "tutor";
}
