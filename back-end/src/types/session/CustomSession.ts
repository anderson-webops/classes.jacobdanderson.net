// src/types/session/CustomSession.ts
import type { Session } from "express-session";

export interface CustomSession extends Session {
	userID?: string;
	tutorID?: string;
	adminID?: string;
	courseCodeLearnerID?: string;
	courseCodeCredentialVersion?: string;
	accountSessionVersion?: number;
	authenticatedSessionExpiresAt?: number;
}
