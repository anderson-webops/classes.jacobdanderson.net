import { beforeEach, describe, expect, it, vi } from "vitest";

const auditMocks = vi.hoisted(() => ({
	create: vi.fn()
}));

vi.mock("mongoose", () => ({
	default: {
		connection: { readyState: 1 }
	}
}));

vi.mock("../src/models/schemas/SecurityAuditEvent.js", () => ({
	SecurityAuditEvent: { create: auditMocks.create }
}));

const { recordSecurityAuditEvent } = await import(
	"../src/utils/securityAudit.js"
);

describe("account-deletion security audit", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		auditMocks.create.mockResolvedValue(undefined);
	});

	it("does not reinsert the deleted self actor ID", async () => {
		const auditSubjectID = "random-unmapped-audit-subject";

		await recordSecurityAuditEvent(
			{
				currentUser: { _id: "deleted-user-id" },
				get: vi.fn().mockReturnValue("test browser"),
				ip: "127.0.0.1",
				socket: { remoteAddress: "127.0.0.1" }
			} as never,
			{
				action: "user.delete-self",
				omitActor: true,
				targetID: auditSubjectID,
				targetRole: "user"
			}
		);

		expect(auditMocks.create).toHaveBeenCalledWith(
			expect.objectContaining({
				action: "user.delete-self",
				targetID: auditSubjectID,
				targetRole: "user"
			})
		);
		const event = auditMocks.create.mock.calls[0][0];
		expect(event).not.toHaveProperty("actorID");
		expect(event).not.toHaveProperty("actorRole");
	});
});
