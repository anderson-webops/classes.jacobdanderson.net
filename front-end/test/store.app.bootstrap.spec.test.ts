// test/store.app.bootstrap.spec.test.ts
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "../src/stores/app";
import * as apiMod from "../src/api";

// mock axios client
vi.mock("@/api", () => {
	const mock = {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn()
	};
	return { api: mock };
});

describe("app store bootstrapSession()", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("hydrates admin", async () => {
		(apiMod.api.get as any)
			.mockResolvedValueOnce({ data: { adminID: "a1" } }) // /accounts/me
			.mockResolvedValueOnce({
				data: { currentAdmin: { _id: "a1", name: "A" } }
			}); // /admins/loggedin

		const app = useAppStore();
		await app.bootstrapSession();

		expect(app.currentAdmin?._id).toBe("a1");
		expect(app.currentUser).toBeNull();
		expect(app.currentTutor).toBeNull();
	});

	it("hydrates an email-free course-code learner when no account role is active", async () => {
		(apiMod.api.get as any)
			.mockResolvedValueOnce({
				data: { adminID: null, tutorID: null, userID: null }
			})
			.mockResolvedValueOnce({
				data: {
					currentCourseLearner: {
						_id: "course-learner-1",
						username: "Student One",
						courseID: "python-level-1",
						courseAccess: ["python-level-1"],
						courseStatus: { "python-level-1": "current" },
						role: "course-code",
						createdAt: "2026-07-25T12:00:00.000Z",
						lastSeenAt: "2026-07-25T12:00:00.000Z"
					}
				}
			});

		const app = useAppStore();
		await app.bootstrapSession();

		expect(apiMod.api.get).toHaveBeenNthCalledWith(2, "/course-access/me");
		expect(app.currentCourseLearner?.username).toBe("Student One");
		expect(app.currentCourseLearner?.courseAccess).toEqual([
			"python-level-1"
		]);
		expect(app.currentAdmin).toBeNull();
		expect(app.currentTutor).toBeNull();
		expect(app.currentUser).toBeNull();
		expect(app.isLoggedIn).toBe(true);
	});

	it("clears session on error", async () => {
		(apiMod.api.get as any).mockRejectedValueOnce(new Error("no cookie"));

		const app = useAppStore();
		await app.bootstrapSession();

		expect(app.currentAdmin).toBeNull();
		expect(app.currentTutor).toBeNull();
		expect(app.currentUser).toBeNull();
	});

	it("redeems a course code into a course-only identity", async () => {
		const learner = {
			_id: "course-learner-1",
			username: "Student One",
			courseID: "python-level-1",
			courseAccess: ["python-level-1"],
			courseStatus: { "python-level-1": "current" as const },
			role: "course-code" as const,
			createdAt: "2026-07-25T12:00:00.000Z",
			lastSeenAt: "2026-07-25T12:00:00.000Z"
		};
		(apiMod.api.post as any).mockResolvedValueOnce({
			data: { currentCourseLearner: learner }
		});
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "admin-1",
			name: "Admin",
			email: "admin@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const result = await app.redeemCourseAccessCode(
			"2345-6789-ABCD",
			"Student One"
		);

		expect(apiMod.api.post).toHaveBeenCalledWith(
			"/course-access/redeem",
			{
				code: "2345-6789-ABCD",
				username: "Student One"
			}
		);
		expect(result).toEqual(learner);
		expect(app.currentCourseLearner).toEqual(learner);
		expect(app.currentAdmin).toBeNull();
		expect(app.currentTutor).toBeNull();
		expect(app.currentUser).toBeNull();
	});
});
