import type { Types } from "mongoose";

export interface ICourseCodeLearner {
	_id: Types.ObjectId;
	accessCode: Types.ObjectId;
	username: string;
	usernameKey: string;
	passwordHash?: string;
	credentialVersion?: string;
	courseID: string;
	lastSeenAt: Date;
	createdAt: Date;
	updatedAt: Date;
}
