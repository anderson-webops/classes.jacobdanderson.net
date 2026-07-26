import type { Types } from "mongoose";

export type CourseAccessCodeCreatorRole = "admin" | "tutor";

export interface ICourseAccessCode {
	_id: Types.ObjectId;
	codeHash: string;
	codeHint: string;
	courseID: string;
	label: string;
	createdBy: Types.ObjectId;
	createdByRole: CourseAccessCodeCreatorRole;
	createdByName: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}
