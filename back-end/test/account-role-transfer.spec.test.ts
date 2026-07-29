import type { ClientSession } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface MockAccount {
	_id: string;
	age?: string;
	email: string;
	name: string;
	password: string;
	role: "tutor" | "user";
	sessionVersion: number;
	skipPasswordHash?: boolean;
	state?: string;
	deleteOne: (options: unknown) => Promise<{ deletedCount: number }>;
	save: (options: unknown) => Promise<MockAccount>;
}

const transactionMocks = vi.hoisted(() => ({
	transaction: vi.fn()
}));

const modelMocks = vi.hoisted(() => ({
	adminExists: vi.fn(),
	externalIdentityUpdateMany: vi.fn(),
	courseAccessCodeUpdateMany: vi.fn(),
	internalEmailExists: vi.fn(),
	passwordResetTokenDeleteMany: vi.fn(),
	pythonProjectReviewExists: vi.fn(),
	pythonProjectUpdateMany: vi.fn(),
	scheduledSessionExists: vi.fn(),
	scheduledSessionUpdateMany: vi.fn(),
	sessionNoteExists: vi.fn(),
	tutorConstructed: vi.fn(),
	tutorDelete: vi.fn(),
	tutorExists: vi.fn(),
	tutorFindById: vi.fn(),
	tutorSave: vi.fn(),
	userConstructed: vi.fn(),
	userDelete: vi.fn(),
	userExists: vi.fn(),
	userFindById: vi.fn(),
	userSave: vi.fn(),
	userUpdateMany: vi.fn()
}));

const readinessMocks = vi.hoisted(() => ({
	getRoleTransferReadiness: vi.fn()
}));

vi.mock("../src/utils/roleTransferReadiness.js", () => ({
	getRoleTransferReadiness: readinessMocks.getRoleTransferReadiness
}));

vi.mock("../src/models/schemas/CourseAccessCode.js", () => ({
	CourseAccessCode: {
		updateMany: modelMocks.courseAccessCodeUpdateMany
	}
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		exists: modelMocks.adminExists
	}
}));

vi.mock("../src/models/schemas/ExternalIdentity.js", () => ({
	ExternalIdentity: {
		updateMany: modelMocks.externalIdentityUpdateMany
	}
}));

vi.mock("../src/models/schemas/InternalEmail.js", () => ({
	InternalEmail: {
		exists: modelMocks.internalEmailExists
	}
}));

vi.mock("../src/models/schemas/PasswordResetToken.js", () => ({
	PasswordResetToken: {
		deleteMany: modelMocks.passwordResetTokenDeleteMany
	}
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		updateMany: modelMocks.pythonProjectUpdateMany
	}
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		exists: modelMocks.pythonProjectReviewExists
	}
}));

vi.mock("../src/models/schemas/ScheduledSession.js", () => ({
	ScheduledSession: {
		exists: modelMocks.scheduledSessionExists,
		updateMany: modelMocks.scheduledSessionUpdateMany
	}
}));

vi.mock("../src/models/schemas/SessionNote.js", () => ({
	SessionNote: {
		exists: modelMocks.sessionNoteExists
	}
}));

vi.mock("mongoose", () => ({
	default: {
		connection: {
			transaction: transactionMocks.transaction
		}
	}
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: class MockTutor {
		static exists = modelMocks.tutorExists;
		static findById = modelMocks.tutorFindById;

		constructor(values: Record<string, unknown>) {
			Object.assign(this, { _id: "new-tutor-id" }, values);
			modelMocks.tutorConstructed(this);
		}

		deleteOne(options: unknown) {
			return modelMocks.tutorDelete(this, options);
		}

		save(options: unknown) {
			return modelMocks.tutorSave(this, options);
		}
	}
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: class MockUser {
		static exists = modelMocks.userExists;
		static findById = modelMocks.userFindById;
		static updateMany = modelMocks.userUpdateMany;

		constructor(values: Record<string, unknown>) {
			Object.assign(this, { _id: "new-user-id" }, values);
			modelMocks.userConstructed(this);
		}

		deleteOne(options: unknown) {
			return modelMocks.userDelete(this, options);
		}

		save(options: unknown) {
			return modelMocks.userSave(this, options);
		}
	}
}));

const {
	demoteTutorAccount,
	promoteUserAccount
} = await import("../src/utils/accountRoleTransfer.js");

const session = { id: "role-transfer-session" } as unknown as ClientSession;

function queryWith<T>(result: T) {
	const exec = vi.fn().mockResolvedValue(result);
	const sessionQuery = { exec };
	return {
		exec,
		session: vi.fn().mockReturnValue(sessionQuery)
	};
}

function makeSourceAccount(role: "tutor" | "user", password: string): MockAccount {
	const account = {
		_id: `${role}-id`,
		age: "42",
		email: "julio@example.com",
		name: "Julio Avasan",
		password,
		role,
		sessionVersion: 4,
		state: "CA",
		deleteOne: () => Promise.resolve({ deletedCount: 0 }),
		save: async () => Promise.reject(new Error("Source accounts are not saved during transfer"))
	} satisfies MockAccount;
	account.deleteOne = options => role === "user"
		? modelMocks.userDelete(account, options)
		: modelMocks.tutorDelete(account, options);
	return account;
}

describe("account role transfer transactions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		readinessMocks.getRoleTransferReadiness.mockResolvedValue({
			ok: true,
			topology: "replica-set"
		});
		transactionMocks.transaction.mockImplementation(
			async (operation: (session: ClientSession) => Promise<unknown>) => operation(session)
		);
		modelMocks.tutorExists.mockReturnValue(queryWith(null));
		modelMocks.userExists.mockReturnValue(queryWith(null));
		modelMocks.adminExists.mockReturnValue(queryWith(null));
		modelMocks.externalIdentityUpdateMany.mockReturnValue({
			exec: vi.fn().mockResolvedValue({ modifiedCount: 1 })
		});
		for (const mock of [
			modelMocks.courseAccessCodeUpdateMany,
			modelMocks.passwordResetTokenDeleteMany,
			modelMocks.pythonProjectUpdateMany,
			modelMocks.scheduledSessionUpdateMany,
			modelMocks.userUpdateMany
		]) {
			mock.mockReturnValue({
				exec: vi.fn().mockResolvedValue({ modifiedCount: 1 })
			});
		}
		for (const mock of [
			modelMocks.internalEmailExists,
			modelMocks.pythonProjectReviewExists,
			modelMocks.scheduledSessionExists,
			modelMocks.sessionNoteExists
		]) {
			mock.mockReturnValue(queryWith(null));
		}
		modelMocks.tutorDelete.mockResolvedValue({ deletedCount: 1 });
		modelMocks.userDelete.mockResolvedValue({ deletedCount: 1 });
		modelMocks.tutorSave.mockImplementation(async (account: MockAccount) => {
			expect(account.skipPasswordHash).toBe(true);
			delete account.skipPasswordHash;
			return account;
		});
		modelMocks.userSave.mockImplementation(async (account: MockAccount) => {
			expect(account.skipPasswordHash).toBe(true);
			delete account.skipPasswordHash;
			return account;
		});
	});

	it("preserves the exact Argon2 hash across promotion and demotion", async () => {
		const passwordHash = "$argon2id$v=19$m=65536,t=3,p=4$exact-salt$exact-password-hash";
		const originalUser = makeSourceAccount("user", passwordHash);
		modelMocks.userFindById.mockReturnValue(queryWith(originalUser));

		const promotedTutor = await promoteUserAccount(originalUser._id) as unknown as MockAccount;

		expect(promotedTutor.password).toBe(passwordHash);
		expect(promotedTutor.sessionVersion).toBe(5);
		expect(modelMocks.tutorSave).toHaveBeenCalledWith(promotedTutor, { session });
		expect(modelMocks.externalIdentityUpdateMany).toHaveBeenNthCalledWith(
			1,
			{ accountID: originalUser._id, accountRole: "user" },
			{
				$set: {
					accountID: promotedTutor._id,
					accountRole: "tutor"
				}
			},
			{ session }
		);
		expect(modelMocks.userDelete).toHaveBeenCalledWith(originalUser, { session });

		modelMocks.tutorFindById.mockReturnValue(queryWith(promotedTutor));
		const demotedUser = await demoteTutorAccount(promotedTutor._id) as unknown as MockAccount;

		expect(demotedUser.password).toBe(passwordHash);
		expect(demotedUser.sessionVersion).toBe(6);
		expect(demotedUser.password).toBe(originalUser.password);
		expect(modelMocks.userSave).toHaveBeenCalledWith(demotedUser, { session });
		expect(modelMocks.externalIdentityUpdateMany).toHaveBeenNthCalledWith(
			2,
			{ accountID: promotedTutor._id, accountRole: "tutor" },
			{
				$set: {
					accountID: demotedUser._id,
					accountRole: "user"
				}
			},
			{ session }
		);
		expect(modelMocks.tutorDelete).toHaveBeenCalledWith(promotedTutor, { session });
		expect(transactionMocks.transaction).toHaveBeenCalledTimes(2);
		expect(transactionMocks.transaction).toHaveBeenNthCalledWith(1, expect.any(Function), {
			readConcern: { level: "snapshot" },
			readPreference: "primary",
			writeConcern: { w: "majority" }
		});
	});

	it("rejects role transfer before opening a transaction on standalone MongoDB", async () => {
		readinessMocks.getRoleTransferReadiness.mockResolvedValue({
			ok: false,
			reason: "transactions-not-supported"
		});

		await expect(promoteUserAccount("user-id")).rejects.toMatchObject({
			statusCode: 503
		});
		expect(transactionMocks.transaction).not.toHaveBeenCalled();
	});

	it("rejects promotion when learner-only records would be lost", async () => {
		const originalUser = makeSourceAccount("user", "$argon2id$preserved-hash");
		modelMocks.userFindById.mockReturnValue(queryWith(originalUser));
		modelMocks.sessionNoteExists.mockReturnValue(queryWith({ _id: "note-id" }));

		await expect(promoteUserAccount(originalUser._id)).rejects.toMatchObject({
			statusCode: 409
		});
		expect(modelMocks.tutorSave).not.toHaveBeenCalled();
		expect(modelMocks.userDelete).not.toHaveBeenCalled();
	});

	it("treats stored course status as learner-only state during promotion", async () => {
		const originalUser = makeSourceAccount("user", "$argon2id$preserved-hash") as MockAccount & {
			courseStatus: Record<string, string>;
		};
		originalUser.courseStatus = { "python-level-1": "past" };
		modelMocks.userFindById.mockReturnValue(queryWith(originalUser));

		await expect(promoteUserAccount(originalUser._id)).rejects.toMatchObject({
			statusCode: 409
		});
		expect(modelMocks.tutorSave).not.toHaveBeenCalled();
	});

	it("rejects a role transfer when an admin already owns the email", async () => {
		const originalUser = makeSourceAccount("user", "$argon2id$preserved-hash");
		modelMocks.userFindById.mockReturnValue(queryWith(originalUser));
		modelMocks.adminExists.mockReturnValue(queryWith({ _id: "admin-id" }));

		await expect(promoteUserAccount(originalUser._id)).rejects.toMatchObject({
			statusCode: 409
		});
		expect(modelMocks.tutorSave).not.toHaveBeenCalled();
	});

	it("rolls back the created tutor when deleting the source user fails", async () => {
		const originalUser = makeSourceAccount("user", "$argon2id$preserved-hash");
		const persistedTutors: MockAccount[] = [];
		modelMocks.userFindById.mockReturnValue(queryWith(originalUser));
		modelMocks.tutorSave.mockImplementation(async (account: MockAccount) => {
			persistedTutors.push(account);
			return account;
		});
		modelMocks.userDelete.mockRejectedValue(new Error("source delete failed"));
		transactionMocks.transaction.mockImplementation(async (
			operation: (session: ClientSession) => Promise<unknown>
		) => {
			const originalTutorCount = persistedTutors.length;
			try {
				return await operation(session);
			}
			catch (error) {
				persistedTutors.length = originalTutorCount;
				throw error;
			}
		});

		await expect(promoteUserAccount(originalUser._id)).rejects.toThrow("source delete failed");

		expect(persistedTutors).toHaveLength(0);
		expect(modelMocks.tutorSave).toHaveBeenCalledWith(expect.anything(), { session });
		expect(modelMocks.userDelete).toHaveBeenCalledWith(originalUser, { session });
		expect(transactionMocks.transaction).toHaveBeenCalledOnce();
	});

	it("aborts the transaction if the stored hash changes while saving", async () => {
		const originalUser = makeSourceAccount("user", "$argon2id$preserved-hash");
		modelMocks.userFindById.mockReturnValue(queryWith(originalUser));
		modelMocks.tutorSave.mockImplementation(async (account: MockAccount) => {
			account.password = "$argon2id$unexpected-rehash";
			return account;
		});

		await expect(promoteUserAccount(originalUser._id))
			.rejects.toThrow("Account role transfer changed the stored password hash");
		expect(modelMocks.userDelete).not.toHaveBeenCalled();
	});
});
