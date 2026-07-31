import type { ClientSession, Types as MongooseTypes } from "mongoose";
import mongoose, { Types } from "mongoose";
import { ExternalIdentity } from "../models/schemas/ExternalIdentity.js";
import { InternalEmail } from "../models/schemas/InternalEmail.js";
import { PasswordResetToken } from "../models/schemas/PasswordResetToken.js";
import { PythonProject } from "../models/schemas/PythonProject.js";
import { PythonProjectReview } from "../models/schemas/PythonProjectReview.js";
import { ScheduledSession } from "../models/schemas/ScheduledSession.js";
import { SecurityAuditEvent } from "../models/schemas/SecurityAuditEvent.js";
import { SessionNote } from "../models/schemas/SessionNote.js";
import { User } from "../models/schemas/User.js";
import { getRoleTransferReadiness } from "../utils/roleTransferReadiness.js";

const USER_DELETION_TRANSACTION_OPTIONS = {
	readConcern: { level: "snapshot" },
	readPreference: "primary",
	writeConcern: { w: "majority" }
} as const;

export class UserAccountDeletionError extends Error {
	readonly statusCode = 503;

	constructor() {
		super(
			"Account deletion is temporarily unavailable until database transactions are enabled."
		);
		this.name = "UserAccountDeletionError";
	}
}

export class UserAccountDeletionAuthorizationError extends Error {
	readonly statusCode = 403;

	constructor() {
		super("You can only delete your own students");
		this.name = "UserAccountDeletionAuthorizationError";
	}
}

export type UserAccountDeletionResult
	= | { deleted: false }
		| {
			auditSubjectID: MongooseTypes.ObjectId;
			deleted: true;
		};

async function deleteAccountLinkedRecords(
	userID: MongooseTypes.ObjectId,
	email: string,
	auditSubjectID: MongooseTypes.ObjectId,
	session: ClientSession
) {
	// The MongoDB driver does not support parallel operations within one
	// transaction. Keep this sweep sequential so every operation reliably uses
	// the same snapshot and can be rolled back as one unit.
	await ExternalIdentity.deleteMany(
		{ accountID: userID, accountRole: "user" },
		{ session }
	).exec();
	await PasswordResetToken.deleteMany(
		{ accountID: userID, role: "user" },
		{ session }
	).exec();
	await PythonProject.deleteMany({ user: userID }, { session }).exec();
	await PythonProjectReview.deleteMany({ user: userID }, { session }).exec();
	await InternalEmail.deleteMany({ user: userID }, { session }).exec();
	await ScheduledSession.deleteMany({ user: userID }, { session }).exec();
	await SessionNote.deleteMany(
		{
			$or: [
				{ user: userID },
				{
					primaryEmail: email,
					$or: [
						{ user: { $exists: false } },
						{ user: null }
					]
				}
			]
		},
		{ session }
	).exec();
	await SecurityAuditEvent.updateMany(
		{ actorID: userID, actorRole: "user" },
		{ $set: { actorID: auditSubjectID } },
		{ session }
	).exec();
	await SecurityAuditEvent.updateMany(
		{ targetID: userID, targetRole: "user" },
		{ $set: { targetID: auditSubjectID } },
		{ session }
	).exec();
}

/**
 * Permanently remove one user and every record owned by that account.
 *
 * Deletion is transaction-only so a failed child-record sweep cannot remove
 * the account while leaving retained personal data behind. Direct user IDs in
 * security history are replaced with one random, unmapped audit pseudonym.
 * That preserves event correlation without retaining the deleted account ID.
 */
export async function deleteUserAccount(
	userID: MongooseTypes.ObjectId | string,
	{
		requiredTutorID
	}: {
		requiredTutorID?: MongooseTypes.ObjectId | string;
	} = {}
): Promise<UserAccountDeletionResult> {
	const readiness = await getRoleTransferReadiness();
	if (!readiness.ok) {
		throw new UserAccountDeletionError();
	}

	const objectID = typeof userID === "string" ? new Types.ObjectId(userID) : userID;
	const auditSubjectID = new Types.ObjectId();

	return mongoose.connection.transaction(async (session) => {
		const user = await User.findById(objectID).session(session).exec();
		if (!user) return { deleted: false };
		if (
			requiredTutorID
			&& !user.tutors.some(
				tutorID => tutorID.toString() === requiredTutorID.toString()
			)
		) {
			throw new UserAccountDeletionAuthorizationError();
		}

		await deleteAccountLinkedRecords(
			objectID,
			user.email.trim().toLowerCase(),
			auditSubjectID,
			session
		);

		const deletion = await User.deleteOne({ _id: objectID }, { session }).exec();
		if (deletion.deletedCount !== 1) {
			throw new Error("User account disappeared during account deletion");
		}

		return {
			auditSubjectID,
			deleted: true
		};
	}, USER_DELETION_TRANSACTION_OPTIONS);
}
