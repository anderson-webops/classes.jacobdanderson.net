import type { ClientSession } from "mongoose";
import mongoose, { Types } from "mongoose";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const readinessMocks = vi.hoisted(() => ({
	getRoleTransferReadiness: vi.fn()
}));

const modelMocks = vi.hoisted(() => ({
	externalIdentityDeleteMany: vi.fn(),
	internalEmailDeleteMany: vi.fn(),
	passwordResetTokenDeleteMany: vi.fn(),
	pythonProjectDeleteMany: vi.fn(),
	pythonProjectReviewDeleteMany: vi.fn(),
	scheduledSessionDeleteMany: vi.fn(),
	securityAuditEventUpdateMany: vi.fn(),
	sessionNoteDeleteMany: vi.fn(),
	userDeleteOne: vi.fn(),
	userFindById: vi.fn()
}));

vi.mock("../src/utils/roleTransferReadiness.js", () => ({
	getRoleTransferReadiness: readinessMocks.getRoleTransferReadiness
}));

vi.mock("../src/models/schemas/ExternalIdentity.js", () => ({
	ExternalIdentity: { deleteMany: modelMocks.externalIdentityDeleteMany }
}));

vi.mock("../src/models/schemas/InternalEmail.js", () => ({
	InternalEmail: { deleteMany: modelMocks.internalEmailDeleteMany }
}));

vi.mock("../src/models/schemas/PasswordResetToken.js", () => ({
	PasswordResetToken: {
		deleteMany: modelMocks.passwordResetTokenDeleteMany
	}
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: { deleteMany: modelMocks.pythonProjectDeleteMany }
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		deleteMany: modelMocks.pythonProjectReviewDeleteMany
	}
}));

vi.mock("../src/models/schemas/ScheduledSession.js", () => ({
	ScheduledSession: { deleteMany: modelMocks.scheduledSessionDeleteMany }
}));

vi.mock("../src/models/schemas/SecurityAuditEvent.js", () => ({
	SecurityAuditEvent: {
		updateMany: modelMocks.securityAuditEventUpdateMany
	}
}));

vi.mock("../src/models/schemas/SessionNote.js", () => ({
	SessionNote: { deleteMany: modelMocks.sessionNoteDeleteMany }
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: {
		deleteOne: modelMocks.userDeleteOne,
		findById: modelMocks.userFindById
	}
}));

const {
	deleteUserAccount,
	UserAccountDeletionError
} = await import("../src/services/userAccountDeletion.js");

const session = { id: "user-account-deletion-session" } as unknown as ClientSession;
const transaction = vi.spyOn(mongoose.connection, "transaction");

function queryResult<T>(result: T) {
	return {
		exec: vi.fn().mockResolvedValue(result)
	};
}

function findQueryResult<T>(result: T) {
	return {
		session: vi.fn().mockReturnValue(queryResult(result))
	};
}

describe("user account deletion", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		readinessMocks.getRoleTransferReadiness.mockResolvedValue({
			ok: true,
			topology: "replica-set"
		});
		transaction.mockImplementation(
			async operation => operation(session)
		);

		const successfulDeletion = () => queryResult({
			acknowledged: true,
			deletedCount: 1
		});
		for (const deletionMock of [
			modelMocks.externalIdentityDeleteMany,
			modelMocks.internalEmailDeleteMany,
			modelMocks.passwordResetTokenDeleteMany,
			modelMocks.pythonProjectDeleteMany,
			modelMocks.pythonProjectReviewDeleteMany,
			modelMocks.scheduledSessionDeleteMany,
			modelMocks.sessionNoteDeleteMany
		]) {
			deletionMock.mockImplementation(successfulDeletion);
		}
		modelMocks.securityAuditEventUpdateMany.mockImplementation(() =>
			queryResult({ acknowledged: true, modifiedCount: 1 })
		);
		modelMocks.userDeleteOne.mockImplementation(successfulDeletion);
	});

	afterAll(() => {
		transaction.mockRestore();
	});

	it("atomically sweeps account data and pseudonymizes retained audit references", async () => {
		const userID = new Types.ObjectId();
		modelMocks.userFindById.mockReturnValue(
			findQueryResult({
				_id: userID,
				email: " Student@Example.COM "
			})
		);

		const result = await deleteUserAccount(userID);
		expect(result.deleted).toBe(true);
		if (!result.deleted) throw new Error("Expected the user to be deleted");

		expect(result.auditSubjectID.equals(userID)).toBe(false);
		expect(modelMocks.externalIdentityDeleteMany).toHaveBeenCalledWith(
			{ accountID: userID, accountRole: "user" },
			{ session }
		);
		expect(modelMocks.passwordResetTokenDeleteMany).toHaveBeenCalledWith(
			{ accountID: userID, role: "user" },
			{ session }
		);
		for (const deletionMock of [
			modelMocks.pythonProjectDeleteMany,
			modelMocks.pythonProjectReviewDeleteMany,
			modelMocks.internalEmailDeleteMany,
			modelMocks.scheduledSessionDeleteMany
		]) {
			expect(deletionMock).toHaveBeenCalledWith(
				{ user: userID },
				{ session }
			);
		}
		expect(modelMocks.sessionNoteDeleteMany).toHaveBeenCalledWith(
			{
				$or: [
					{ user: userID },
					{
						primaryEmail: "student@example.com",
						$or: [
							{ user: { $exists: false } },
							{ user: null }
						]
					}
				]
			},
			{ session }
		);
		expect(modelMocks.securityAuditEventUpdateMany).toHaveBeenNthCalledWith(
			1,
			{ actorID: userID, actorRole: "user" },
			{ $set: { actorID: result.auditSubjectID } },
			{ session }
		);
		expect(modelMocks.securityAuditEventUpdateMany).toHaveBeenNthCalledWith(
			2,
			{ targetID: userID, targetRole: "user" },
			{ $set: { targetID: result.auditSubjectID } },
			{ session }
		);
		expect(modelMocks.userDeleteOne).toHaveBeenCalledWith(
			{ _id: userID },
			{ session }
		);
		expect(transaction).toHaveBeenCalledWith(expect.any(Function), {
			readConcern: { level: "snapshot" },
			readPreference: "primary",
			writeConcern: { w: "majority" }
		});

		const accountDeleteOrder
			= modelMocks.userDeleteOne.mock.invocationCallOrder[0];
		for (const operation of [
			modelMocks.externalIdentityDeleteMany,
			modelMocks.internalEmailDeleteMany,
			modelMocks.passwordResetTokenDeleteMany,
			modelMocks.pythonProjectDeleteMany,
			modelMocks.pythonProjectReviewDeleteMany,
			modelMocks.scheduledSessionDeleteMany,
			modelMocks.securityAuditEventUpdateMany,
			modelMocks.sessionNoteDeleteMany
		]) {
			expect(operation.mock.invocationCallOrder[0]).toBeLessThan(
				accountDeleteOrder
			);
		}
	});

	it("does not delete the account or report success when a child sweep fails", async () => {
		const userID = new Types.ObjectId();
		modelMocks.userFindById.mockReturnValue(
			findQueryResult({
				_id: userID,
				email: "student@example.com"
			})
		);
		modelMocks.internalEmailDeleteMany.mockReturnValue({
			exec: vi.fn().mockRejectedValue(new Error("email sweep failed"))
		});

		await expect(deleteUserAccount(userID)).rejects.toThrow(
			"email sweep failed"
		);
		expect(modelMocks.userDeleteOne).not.toHaveBeenCalled();
	});

	it("requires transaction support before performing destructive work", async () => {
		readinessMocks.getRoleTransferReadiness.mockResolvedValue({
			ok: false,
			reason: "transactions-not-supported"
		});

		await expect(
			deleteUserAccount(new Types.ObjectId())
		).rejects.toBeInstanceOf(UserAccountDeletionError);
		expect(transaction).not.toHaveBeenCalled();
		expect(modelMocks.userFindById).not.toHaveBeenCalled();
	});

	it("rechecks tutor assignment inside the deletion transaction", async () => {
		const userID = new Types.ObjectId();
		const assignedTutorID = new Types.ObjectId();
		const removedTutorID = new Types.ObjectId();
		modelMocks.userFindById.mockReturnValue(
			findQueryResult({
				_id: userID,
				email: "student@example.com",
				tutors: [assignedTutorID]
			})
		);

		await expect(
			deleteUserAccount(userID, {
				requiredTutorID: removedTutorID
			})
		).rejects.toMatchObject({
			message: "You can only delete your own students",
			statusCode: 403
		});
		expect(modelMocks.externalIdentityDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.userDeleteOne).not.toHaveBeenCalled();
	});

	it("is idempotent when the account was already removed", async () => {
		modelMocks.userFindById.mockReturnValue(findQueryResult(null));

		await expect(deleteUserAccount(new Types.ObjectId())).resolves.toEqual({
			deleted: false
		});
		expect(modelMocks.externalIdentityDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.userDeleteOne).not.toHaveBeenCalled();
	});

	it("does not report success if the account disappears before the final delete", async () => {
		const userID = new Types.ObjectId();
		modelMocks.userFindById.mockReturnValue(
			findQueryResult({
				_id: userID,
				email: "student@example.com"
			})
		);
		modelMocks.userDeleteOne.mockReturnValue(
			queryResult({ acknowledged: true, deletedCount: 0 })
		);

		await expect(deleteUserAccount(userID)).rejects.toThrow(
			"User account disappeared"
		);
	});
});
