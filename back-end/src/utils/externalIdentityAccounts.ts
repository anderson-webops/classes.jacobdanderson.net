import type {
	ExternalIdentityAccountRole,
	ExternalIdentityProvider
} from "../types/entities/IExternalIdentity.js";
import type { AccountCandidate } from "./accountSessions.js";
import { Admin } from "../models/schemas/Admin.js";
import { ExternalIdentity } from "../models/schemas/ExternalIdentity.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";
import {
	accountCandidatesByPriority,
	findAccountsByEmail
} from "./accountSessions.js";

export type ExternalIdentityErrorCode
	= | "account_not_found"
		| "email_unverified"
		| "identity_conflict";

export class ExternalIdentityAccountError extends Error {
	readonly code: ExternalIdentityErrorCode;

	constructor(code: ExternalIdentityErrorCode) {
		super(code);
		this.name = "ExternalIdentityAccountError";
		this.code = code;
	}
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
	return typeof error === "object"
		&& error !== null
		&& "code" in error
		&& error.code === 11000;
}

async function candidateForRole(
	role: ExternalIdentityAccountRole,
	accountID: unknown
): Promise<AccountCandidate | null> {
	if (role === "admin") {
		const entity = await Admin.findById(accountID).exec();
		return entity
			? {
					entity,
					responseKey: "currentAdmin",
					role,
					sessionKey: "adminID"
				}
			: null;
	}
	if (role === "tutor") {
		const entity = await Tutor.findById(accountID).exec();
		return entity
			? {
					entity,
					responseKey: "currentTutor",
					role,
					sessionKey: "tutorID"
				}
			: null;
	}

	const entity = await User.findById(accountID).exec();
	return entity
		? {
				entity,
				responseKey: "currentUser",
				role,
				sessionKey: "userID"
			}
		: null;
}

async function linkedCandidate(
	provider: ExternalIdentityProvider,
	subject: string,
	email: string | null
) {
	const identity = await ExternalIdentity.findOne({ provider, subject }).exec();
	if (!identity) return null;

	const candidate = await candidateForRole(
		identity.accountRole,
		identity.accountID
	);
	if (!candidate?.entity) {
		await ExternalIdentity.deleteOne({ _id: identity._id }).exec();
		return null;
	}

	const updates: Record<string, unknown> = { lastLoginAt: new Date() };
	if (email) updates.emailAtLink = email;
	await ExternalIdentity.updateOne(
		{ _id: identity._id },
		{ $set: updates }
	).exec();
	return candidate;
}

export async function resolveExternalIdentityAccount({
	email,
	provider,
	subject
}: {
	email: string | null;
	provider: ExternalIdentityProvider;
	subject: string;
}): Promise<AccountCandidate> {
	const existingLink = await linkedCandidate(provider, subject, email);
	if (existingLink?.entity) return existingLink;
	if (!email) {
		throw new ExternalIdentityAccountError("email_unverified");
	}

	const accounts = await findAccountsByEmail(email);
	const candidate = accountCandidatesByPriority(accounts).find(item => item.entity);
	if (!candidate?.entity) {
		throw new ExternalIdentityAccountError("account_not_found");
	}

	try {
		await ExternalIdentity.create({
			accountID: candidate.entity._id,
			accountRole: candidate.role,
			emailAtLink: email,
			lastLoginAt: new Date(),
			provider,
			subject
		});
		return candidate;
	}
	catch (error) {
		if (!isDuplicateKeyError(error)) throw error;

		const racedLink = await linkedCandidate(provider, subject, email);
		if (
			racedLink?.entity
			&& racedLink.role === candidate.role
			&& racedLink.entity._id.toString() === candidate.entity._id.toString()
		) {
			return racedLink;
		}
		throw new ExternalIdentityAccountError("identity_conflict");
	}
}
