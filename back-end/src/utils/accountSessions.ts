import type { IAdmin } from "../types/entities/IAdmin.js";
import type { ITutor } from "../types/entities/ITutor.js";
import type { IUser } from "../types/entities/IUser.js";
import type { CustomSession } from "../types/session/CustomSession.js";
import { Admin } from "../models/schemas/Admin.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";

export type AccountEntity = IAdmin | ITutor | IUser;
export type AccountRole = "admin" | "tutor" | "user";
export type AccountSessionKey = "adminID" | "tutorID" | "userID";
export type AccountResponseKey = "currentAdmin" | "currentTutor" | "currentUser";

export interface AccountCandidate {
	entity: AccountEntity | null;
	responseKey: AccountResponseKey;
	role: AccountRole;
	sessionKey: AccountSessionKey;
}

export async function findAccountsByEmail(normalizedEmail: string) {
	const [user, tutor, admin] = (await Promise.all([
		User.findOne({ email: normalizedEmail }).exec(),
		Tutor.findOne({ email: normalizedEmail }).exec(),
		Admin.findOne({ email: normalizedEmail }).exec()
	])) as [IUser | null, ITutor | null, IAdmin | null];

	return { admin, tutor, user };
}

export async function accountEmailExists(normalizedEmail: string) {
	const [user, tutor, admin] = await Promise.all([
		User.exists({ email: normalizedEmail }),
		Tutor.exists({ email: normalizedEmail }),
		Admin.exists({ email: normalizedEmail })
	]);
	return !!(user || tutor || admin);
}

export function accountCandidatesByPriority(accounts: {
	admin: IAdmin | null;
	tutor: ITutor | null;
	user: IUser | null;
}): AccountCandidate[] {
	return [
		{
			entity: accounts.admin,
			responseKey: "currentAdmin",
			role: "admin",
			sessionKey: "adminID"
		},
		{
			entity: accounts.tutor,
			responseKey: "currentTutor",
			role: "tutor",
			sessionKey: "tutorID"
		},
		{
			entity: accounts.user,
			responseKey: "currentUser",
			role: "user",
			sessionKey: "userID"
		}
	];
}

export function clearSessionRoles(session: CustomSession) {
	delete session.adminID;
	delete session.tutorID;
	delete session.userID;
	delete session.courseCodeLearnerID;
	delete session.accountSessionVersion;
}

export function getAccountID(entity: AccountEntity) {
	return entity._id.toString();
}

export function serializeAccountEntity(
	entity: AccountEntity
): Record<string, unknown> {
	const serializableEntity
		= "toJSON" in entity && typeof entity.toJSON === "function"
			? entity.toJSON()
			: { ...entity };
	const {
		password: _password,
		sessionVersion: _sessionVersion,
		...safeEntity
	}
		= serializableEntity as Record<string, unknown>;
	return safeEntity;
}

export function establishAccountSession(
	session: CustomSession,
	candidate: Pick<AccountCandidate, "entity" | "sessionKey">
) {
	if (!candidate.entity) {
		throw new TypeError("Cannot establish a session without an account");
	}

	clearSessionRoles(session);
	session[candidate.sessionKey] = getAccountID(candidate.entity);
	session.accountSessionVersion = candidate.entity.sessionVersion ?? 0;
}

export function accountSessionVersionMatches(
	session: CustomSession,
	entity: AccountEntity
) {
	return Number.isInteger(session.accountSessionVersion)
		&& session.accountSessionVersion === (entity.sessionVersion ?? 0);
}
