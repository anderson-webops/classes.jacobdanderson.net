// test/store.app.bootstrap.spec.test.ts
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as apiMod from "../src/api";
import { useAppStore } from "../src/stores/app";

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

	it("stays unresolved through both delayed account requests", async () => {
		let resolveAccount!: (result: any) => void;
		let resolveAdmin!: (result: any) => void;
		(apiMod.api.get as any)
			.mockImplementationOnce(
				() =>
					new Promise(resolve => {
						resolveAccount = resolve;
					})
			)
			.mockImplementationOnce(
				() =>
					new Promise(resolve => {
						resolveAdmin = resolve;
					})
			);
		const app = useAppStore();
		const pending = app.bootstrapSession();
		expect(app.isSessionResolved).toBe(false);
		resolveAccount({ data: { adminID: "a1" } });
		await Promise.resolve();
		expect(app.isSessionResolved).toBe(false);
		resolveAdmin({ data: { currentAdmin: { _id: "a1", name: "A" } } });
		await pending;
		expect(app.isSessionResolved).toBe(true);
		expect(app.isAdmin).toBe(true);
	});

	it("clears managed directories on an account change and suppresses late privileged results", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({ _id: "admin-1" } as any);
		app.setUsers([{ _id: "private-student" } as any]);
		app.setTutors([{ _id: "private-tutor" } as any]);
		let resolve!: (value: any) => void;
		(apiMod.api.get as any).mockImplementationOnce(
			() =>
				new Promise(done => {
					resolve = done;
				})
		);
		const pending = app.fetchUsers();
		app.setCurrentAdmin(null);
		app.setCurrentTutor({ _id: "tutor-1" } as any);
		expect(app.users).toEqual([]);
		expect(app.tutors).toEqual([]);
		resolve({ data: [{ _id: "late-private-student" }] });
		await pending;
		expect(app.users).toEqual([]);
	});

	it("suppresses a previous role's directory even when the account ID is unchanged", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({ _id: "shared-id" } as any);
		let resolve!: (value: any) => void;
		(apiMod.api.get as any).mockImplementationOnce(
			() =>
				new Promise(done => {
					resolve = done;
				})
		);
		const pending = app.fetchTutors();
		app.setCurrentAdmin(null);
		app.setCurrentTutor({ _id: "shared-id" } as any);
		resolve({ data: [{ _id: "private-admin-directory" }] });
		await pending;
		expect(app.tutors).toEqual([]);
	});

	it("clears stale directories when a privileged list request fails", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({ _id: "admin-1" } as any);
		app.setUsers([{ _id: "stale-student" } as any]);
		(apiMod.api.get as any).mockRejectedValueOnce(new Error("unavailable"));
		await expect(app.fetchUsers()).rejects.toThrow("unavailable");
		expect(app.users).toEqual([]);
	});

	it("settles an anonymous or failed session so login remains available", async () => {
		const app = useAppStore();
		(apiMod.api.get as any).mockRejectedValueOnce(new Error("unavailable"));
		await app.bootstrapSession();
		expect(app.isSessionResolved).toBe(true);
		expect(app.isLoggedIn).toBe(false);
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
			"Student One",
			"synthetic-private-passphrase"
		);

		expect(apiMod.api.post).toHaveBeenCalledWith("/course-access/redeem", {
			code: "2345-6789-ABCD",
			username: "Student One",
			password: "synthetic-private-passphrase"
		});
		expect(result).toEqual(learner);
		expect(app.currentCourseLearner).toEqual(learner);
		expect(app.currentAdmin).toBeNull();
		expect(app.currentTutor).toBeNull();
		expect(app.currentUser).toBeNull();
	});
});
