import type { ClientSession, Types } from "mongoose";
import mongoose from "mongoose";
import { Admin } from "../models/schemas/Admin.js";
import { CourseAccessCode } from "../models/schemas/CourseAccessCode.js";
import { ExternalIdentity } from "../models/schemas/ExternalIdentity.js";
import { InternalEmail } from "../models/schemas/InternalEmail.js";
import { PasswordResetToken } from "../models/schemas/PasswordResetToken.js";
import { PythonProject } from "../models/schemas/PythonProject.js";
import { PythonProjectReview } from "../models/schemas/PythonProjectReview.js";
import { ScheduledSession } from "../models/schemas/ScheduledSession.js";
import { SessionNote } from "../models/schemas/SessionNote.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";
import { getRoleTransferReadiness } from "./roleTransferReadiness.js";

type AccountRoleTransferStatus = 404 | 409 | 503;

interface PasswordHashTransferDocument {
	password: string;
	skipPasswordHash?: boolean;
}

const ROLE_TRANSFER_TRANSACTION_OPTIONS = {
	readConcern: { level: "snapshot" },
	readPreference: "primary",
	writeConcern: { w: "majority" }
} as const;

export class AccountRoleTransferError extends Error {
	readonly statusCode: AccountRoleTransferStatus;

	constructor(statusCode: AccountRoleTransferStatus, message: string) {
		super(message);
		this.name = "AccountRoleTransferError";
		this.statusCode = statusCode;
	}
}

function preservePasswordHash(document: PasswordHashTransferDocument, passwordHash: string) {
	document.password = passwordHash;
	document.skipPasswordHash = true;
}

function assertPasswordHashPreserved(sourceHash: string, targetHash: string) {
	if (targetHash !== sourceHash) {
		throw new Error("Account role transfer changed the stored password hash");
	}
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
	return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

async function runRoleTransferTransaction<T>(
	operation: (session: ClientSession) => Promise<T>,
	duplicateEmailMessage: string
): Promise<T> {
	const readiness = await getRoleTransferReadiness();
	if (!readiness.ok) {
		throw new AccountRoleTransferError(
			503,
			"Account role transfers are unavailable until MongoDB transactions are enabled"
		);
	}

	try {
		return await mongoose.connection.transaction(operation, ROLE_TRANSFER_TRANSACTION_OPTIONS);
	}
	catch (error) {
		if (isDuplicateKeyError(error)) {
			throw new AccountRoleTransferError(409, duplicateEmailMessage);
		}
		throw error;
	}
}

async function hasStudentOnlyDependencies(
	user: {
		_id: Types.ObjectId;
		courseAccess?: unknown[];
		courseProgress?: unknown[];
		courseStatus?: Record<string, unknown>;
		recipientName?: string;
		recipientNameKey?: string;
		tutors?: unknown[];
	},
	session: ClientSession
) {
	const hasEmbeddedLearnerState = !!(
		user.tutors?.length
		|| user.courseAccess?.length
		|| user.courseProgress?.length
		|| Object.keys(user.courseStatus ?? {}).length
		|| user.recipientName
		|| user.recipientNameKey
	);
	if (hasEmbeddedLearnerState) return true;

	const dependencyQueries = [
		InternalEmail.exists({ user: user._id }),
		PythonProjectReview.exists({ user: user._id }),
		ScheduledSession.exists({ user: user._id }),
		SessionNote.exists({ user: user._id })
	];
	const dependencies = await Promise.all(
		dependencyQueries.map(query => query.session(session).exec())
	);
	return dependencies.some(Boolean);
}

export async function promoteUserAccount(userID: string) {
	return runRoleTransferTransaction(async (session) => {
		const user = await User.findById(userID).session(session).exec();
		if (!user) {
			throw new AccountRoleTransferError(404, "User not found");
		}

		const [existingTutor, existingAdmin] = await Promise.all([
			Tutor.exists({ email: user.email }).session(session).exec(),
			Admin.exists({ email: user.email }).session(session).exec()
		]);
		if (existingTutor || existingAdmin) {
			throw new AccountRoleTransferError(409, "Another staff account with this email already exists");
		}
		if (await hasStudentOnlyDependencies(user, session)) {
			throw new AccountRoleTransferError(
				409,
				"Resolve learner assignments, progress, communications, reviews, notes, and scheduled sessions before promotion"
			);
		}

		const passwordHash = user.password;
		const tutor = new Tutor({
			name: user.name,
			email: user.email,
			age: user.age,
			state: user.state,
			password: passwordHash,
			role: "tutor",
			sessionVersion: (user.sessionVersion ?? 0) + 1
		} as any);
		preservePasswordHash(tutor, passwordHash);

		await tutor.save({ session });
		assertPasswordHashPreserved(passwordHash, tutor.password);
		await ExternalIdentity.updateMany(
			{ accountID: user._id, accountRole: "user" },
			{
				$set: {
					accountID: tutor._id,
					accountRole: "tutor"
				}
			},
			{ session }
		).exec();
		await PythonProject.updateMany(
			{
				user: user._id,
				$or: [
					{ ownerRole: "user" },
					{ ownerRole: { $exists: false } }
				]
			},
			{
				$set: {
					ownerRole: "tutor",
					user: tutor._id
				}
			},
			{ session }
		).exec();
		await PasswordResetToken.deleteMany({
			accountID: user._id,
			role: "user"
		}, { session }).exec();

		const deletion = await user.deleteOne({ session });
		if (deletion.deletedCount !== 1) {
			throw new Error("User account disappeared during role transfer");
		}

		return tutor;
	}, "Tutor with this email already exists");
}

export async function demoteTutorAccount(tutorID: string) {
	return runRoleTransferTransaction(async (session) => {
		const tutor = await Tutor.findById(tutorID).session(session).exec();
		if (!tutor) {
			throw new AccountRoleTransferError(404, "Tutor not found");
		}

		const [existingUser, existingAdmin] = await Promise.all([
			User.exists({ email: tutor.email }).session(session).exec(),
			Admin.exists({ email: tutor.email }).session(session).exec()
		]);
		if (existingUser || existingAdmin) {
			throw new AccountRoleTransferError(409, "Another account with this email already exists");
		}

		const passwordHash = tutor.password;
		const user = new User({
			name: tutor.name,
			email: tutor.email,
			age: tutor.age,
			state: tutor.state,
			password: passwordHash,
			role: "user",
			sessionVersion: (tutor.sessionVersion ?? 0) + 1
		} as any);
		preservePasswordHash(user, passwordHash);

		await user.save({ session });
		assertPasswordHashPreserved(passwordHash, user.password);
		await ExternalIdentity.updateMany(
			{ accountID: tutor._id, accountRole: "tutor" },
			{
				$set: {
					accountID: user._id,
					accountRole: "user"
				}
			},
			{ session }
		).exec();
		await Promise.all([
			PythonProject.updateMany(
				{
					user: tutor._id,
					ownerRole: "tutor"
				},
				{
					$set: {
						ownerRole: "user",
						user: user._id
					}
				},
				{ session }
			).exec(),
			CourseAccessCode.updateMany(
				{
					active: true,
					createdBy: tutor._id,
					createdByRole: "tutor"
				},
				{ $set: { active: false } },
				{ session }
			).exec(),
			ScheduledSession.updateMany(
				{ tutor: tutor._id },
				{ $unset: { tutor: 1 } },
				{ session }
			).exec(),
			User.updateMany(
				{ tutors: tutor._id },
				{ $pull: { tutors: tutor._id } },
				{ session }
			).exec(),
			PasswordResetToken.deleteMany({
				accountID: tutor._id,
				role: "tutor"
			}, { session }).exec()
		]);

		const deletion = await tutor.deleteOne({ session });
		if (deletion.deletedCount !== 1) {
			throw new Error("Tutor account disappeared during role transfer");
		}

		return user;
	}, "User with this email already exists");
}
