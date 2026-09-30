import type { ICourseCodeLearner } from "../types/entities/ICourseCodeLearner.js";
import type { CustomSession } from "../types/session/CustomSession.js";
import { randomBytes } from "node:crypto";
import argon2 from "argon2";
import { authenticatedSessionIsCurrent } from "./accountSessions.js";

export async function createCourseCodeCredentials(password: string) {
	return {
		passwordHash: await argon2.hash(password),
		credentialVersion: randomBytes(16).toString("hex")
	};
}

export async function verifyCourseCodePassword(
	learner: ICourseCodeLearner,
	password: string
) {
	if (!learner.passwordHash || !learner.credentialVersion) return false;
	try {
		return await argon2.verify(learner.passwordHash, password);
	}
	catch {
		return false;
	}
}

export function courseCodeSessionMatches(
	session: CustomSession,
	learner: ICourseCodeLearner
) {
	return authenticatedSessionIsCurrent(session)
		&& typeof learner.credentialVersion === "string"
		&& /^[a-f0-9]{32}$/.test(learner.credentialVersion)
		&& session.courseCodeCredentialVersion === learner.credentialVersion;
}
