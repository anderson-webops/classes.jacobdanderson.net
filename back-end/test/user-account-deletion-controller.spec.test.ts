import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const deletionMocks = vi.hoisted(() => ({
	deleteUserAccount: vi.fn()
}));

const auditMocks = vi.hoisted(() => ({
	recordSecurityAuditEvent: vi.fn()
}));

const modelMocks = vi.hoisted(() => ({
	userFindById: vi.fn()
}));

vi.mock("../src/services/userAccountDeletion.js", () => ({
	deleteUserAccount: deletionMocks.deleteUserAccount,
	UserAccountDeletionAuthorizationError:
		class UserAccountDeletionAuthorizationError extends Error {
			readonly statusCode = 403;
		},
	UserAccountDeletionError: class UserAccountDeletionError extends Error {
		readonly statusCode = 503;

		constructor() {
			super(
				"Account deletion is temporarily unavailable until database transactions are enabled."
			);
		}
	}
}));

vi.mock("../src/utils/securityAudit.js", () => ({
	recordSecurityAuditEvent: auditMocks.recordSecurityAuditEvent
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: {
		findById: modelMocks.userFindById
	}
}));

const {
	deleteOwnUser,
	deleteUserAsAdmin,
	deleteUserAsTutor
} = await import("../src/controllers/users/userExtraController.js");
const { UserAccountDeletionError } = await import(
	"../src/services/userAccountDeletion.js"
);

function userQuery<T>(user: T) {
	const promise = Promise.resolve(user);
	return {
		catch: promise.catch.bind(promise),
		populate: vi.fn().mockResolvedValue(user),
		then: promise.then.bind(promise)
	};
}

function response() {
	const res = {
		json: vi.fn(),
		sendStatus: vi.fn(),
		status: vi.fn()
	};
	res.json.mockReturnValue(res);
	res.sendStatus.mockReturnValue(res);
	res.status.mockReturnValue(res);
	return res;
}

describe("user deletion controllers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		auditMocks.recordSecurityAuditEvent.mockResolvedValue(undefined);
	});

	it("uses the centralized deletion service for self, tutor, and admin routes", async () => {
		const userID = new Types.ObjectId();
		const tutorID = new Types.ObjectId();
		const adminID = new Types.ObjectId();
		const auditSubjectIDs = [
			new Types.ObjectId(),
			new Types.ObjectId(),
			new Types.ObjectId()
		];
		const user = {
			_id: userID,
			email: "student@example.com",
			tutors: [tutorID]
		};
		modelMocks.userFindById.mockImplementation(() => userQuery(user));
		for (const auditSubjectID of auditSubjectIDs) {
			deletionMocks.deleteUserAccount.mockResolvedValueOnce({
				auditSubjectID,
				deleted: true
			});
		}

		const selfResponse = response();
		await deleteOwnUser(
			{
				currentUser: user,
				params: { userID: userID.toString() }
			} as never,
			selfResponse as never,
			vi.fn()
		);
		const tutorResponse = response();
		await deleteUserAsTutor(
			{
				currentTutor: { _id: tutorID },
				params: { userID: userID.toString() }
			} as never,
			tutorResponse as never,
			vi.fn()
		);
		const adminResponse = response();
		await deleteUserAsAdmin(
			{
				currentAdmin: { _id: adminID },
				params: { userID: userID.toString() }
			} as never,
			adminResponse as never,
			vi.fn()
		);

		expect(deletionMocks.deleteUserAccount).toHaveBeenCalledTimes(3);
		expect(deletionMocks.deleteUserAccount).toHaveBeenNthCalledWith(
			1,
			userID
		);
		expect(deletionMocks.deleteUserAccount).toHaveBeenNthCalledWith(
			2,
			userID,
			{ requiredTutorID: tutorID }
		);
		expect(deletionMocks.deleteUserAccount).toHaveBeenNthCalledWith(
			3,
			userID
		);
		expect(auditMocks.recordSecurityAuditEvent).toHaveBeenNthCalledWith(
			1,
			expect.anything(),
			{
				action: "user.delete-self",
				omitActor: true,
				targetID: auditSubjectIDs[0],
				targetRole: "user"
			}
		);
		expect(auditMocks.recordSecurityAuditEvent).toHaveBeenNthCalledWith(
			2,
			expect.anything(),
			{
				action: "user.delete-by-tutor",
				targetID: auditSubjectIDs[1],
				targetRole: "user"
			}
		);
		expect(auditMocks.recordSecurityAuditEvent).toHaveBeenNthCalledWith(
			3,
			expect.anything(),
			{
				action: "user.delete-by-admin",
				targetID: auditSubjectIDs[2],
				targetRole: "user"
			}
		);
		expect(selfResponse.sendStatus).toHaveBeenCalledWith(200);
		expect(tutorResponse.sendStatus).toHaveBeenCalledWith(200);
		expect(adminResponse.sendStatus).toHaveBeenCalledWith(200);
	});

	it("returns 503 without a success audit when transactions are unavailable", async () => {
		const userID = new Types.ObjectId();
		const user = {
			_id: userID,
			email: "student@example.com",
			tutors: []
		};
		modelMocks.userFindById.mockImplementation(() => userQuery(user));
		deletionMocks.deleteUserAccount.mockRejectedValue(
			new UserAccountDeletionError()
		);
		const res = response();

		await deleteOwnUser(
			{
				currentUser: user,
				params: { userID: userID.toString() }
			} as never,
			res as never,
			vi.fn()
		);

		expect(res.status).toHaveBeenCalledWith(503);
		expect(res.json).toHaveBeenCalledWith({
			message:
				"Account deletion is temporarily unavailable until database transactions are enabled."
		});
		expect(res.sendStatus).not.toHaveBeenCalledWith(200);
		expect(auditMocks.recordSecurityAuditEvent).not.toHaveBeenCalled();
	});
});
