import type { ClientSession } from "mongoose";
import mongoose from "mongoose";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";

type AccountRoleTransferStatus = 404 | 409;

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

export async function promoteUserAccount(userID: string) {
	return runRoleTransferTransaction(async (session) => {
		const user = await User.findById(userID).session(session).exec();
		if (!user) {
			throw new AccountRoleTransferError(404, "User not found");
		}

		const existingTutor = await Tutor.exists({ email: user.email }).session(session).exec();
		if (existingTutor) {
			throw new AccountRoleTransferError(409, "Tutor with this email already exists");
		}

		const passwordHash = user.password;
		const tutor = new Tutor({
			name: user.name,
			email: user.email,
			age: user.age,
			state: user.state,
			password: passwordHash,
			role: "tutor"
		} as any);
		preservePasswordHash(tutor, passwordHash);

		await tutor.save({ session });
		assertPasswordHashPreserved(passwordHash, tutor.password);

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

		const existingUser = await User.exists({ email: tutor.email }).session(session).exec();
		if (existingUser) {
			throw new AccountRoleTransferError(409, "User with this email already exists");
		}

		const passwordHash = tutor.password;
		const user = new User({
			name: tutor.name,
			email: tutor.email,
			age: tutor.age,
			state: tutor.state,
			password: passwordHash,
			role: "user"
		} as any);
		preservePasswordHash(user, passwordHash);

		await user.save({ session });
		assertPasswordHashPreserved(passwordHash, user.password);

		const deletion = await tutor.deleteOne({ session });
		if (deletion.deletedCount !== 1) {
			throw new Error("Tutor account disappeared during role transfer");
		}

		return user;
	}, "User with this email already exists");
}
