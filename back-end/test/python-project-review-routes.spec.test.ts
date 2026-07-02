import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	tutorFindById: vi.fn(),
	userFindById: vi.fn(),
	pythonProjectFind: vi.fn(),
	pythonProjectFindOne: vi.fn(),
	pythonProjectReviewFind: vi.fn(),
	pythonProjectReviewFindOne: vi.fn(),
	pythonProjectReviewCreate: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findById: modelMocks.adminFindById }
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: { findById: modelMocks.tutorFindById }
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: { findById: modelMocks.userFindById }
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		find: modelMocks.pythonProjectFind,
		findOne: modelMocks.pythonProjectFindOne
	}
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		create: modelMocks.pythonProjectReviewCreate,
		find: modelMocks.pythonProjectReviewFind,
		findOne: modelMocks.pythonProjectReviewFindOne
	}
}));

const { userRoutes } = await import("../src/routes/userRoutes.js");

const adminID = new Types.ObjectId();
const tutorID = new Types.ObjectId();
const otherTutorID = new Types.ObjectId();
const studentID = new Types.ObjectId();
const projectID = new Types.ObjectId();
const reviewID = new Types.ObjectId();
const now = new Date("2026-06-20T12:00:00.000Z");

function queryWith<T>(result: T) {
	const query = {
		populate: vi.fn().mockResolvedValue(result),
		sort: vi.fn(() => query),
		limit: vi.fn(() => query),
		lean: vi.fn().mockResolvedValue(result),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => Promise.resolve(result).catch(reject)
	};
	return query;
}

function makeStudent(tutors: Types.ObjectId[] = [tutorID]) {
	return {
		_id: studentID,
		name: "Student One",
		email: "student@example.com",
		tutors
	};
}

function makeProject(overrides: Record<string, unknown> = {}) {
	return {
		_id: projectID,
		user: studentID,
		title: "Loops practice",
		mode: "python",
		files: [
			{
				name: "main.py",
				content: "print('student')\n",
				encoding: "text"
			}
		],
		activeFileName: "main.py",
		courseID: "python-level-2",
		courseProjectKey: "python-level-2:loops:starter",
		courseProjectTitle: "Loops practice",
		shared: false,
		shareID: undefined,
		shareCreatedAt: undefined,
		createdAt: now,
		updatedAt: now,
		save: vi.fn().mockResolvedValue(undefined),
		...overrides
	};
}

function makeReview(overrides: Record<string, unknown> = {}) {
	const review = {
		_id: reviewID,
		user: studentID,
		sourceProject: projectID,
		title: "Loops practice",
		mode: "python",
		files: [
			{
				name: "main.py",
				content: "# Try a for loop here.\nprint('review')\n",
				encoding: "text"
			}
		],
		activeFileName: "main.py",
		courseID: "python-level-2",
		courseProjectKey: "python-level-2:loops:starter",
		courseProjectTitle: "Loops practice",
		reviewer: adminID,
		reviewerRole: "admin",
		reviewerName: "Admin",
		lastEditedBy: adminID,
		lastEditedByRole: "admin",
		lastEditedByName: "Admin",
		visibleToStudent: false,
		note: "",
		sourceUpdatedAt: now,
		createdAt: now,
		updatedAt: now,
		save: vi.fn().mockResolvedValue(undefined),
		...overrides
	};
	return review;
}

async function withUserRoutes<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json({ limit: "15mb" }));
	app.use((req: any, _res, next) => {
		req.session = {
			adminID: req.get("x-admin-id") || undefined,
			tutorID: req.get("x-tutor-id") || undefined,
			userID: req.get("x-user-id") || undefined
		};
		next();
	});
	app.use("/users", userRoutes);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

async function postJson(baseUrl: string, path: string, body: unknown, headers: Record<string, string> = {}) {
	return fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

async function putJson(baseUrl: string, path: string, body: unknown, headers: Record<string, string> = {}) {
	return fetch(`${baseUrl}${path}`, {
		method: "PUT",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

describe("Python project review routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		modelMocks.adminFindById.mockImplementation((id: string) =>
			id === adminID.toString()
				? Promise.resolve({ _id: adminID, name: "Admin", email: "admin@example.com" })
				: Promise.resolve(null)
		);
		modelMocks.tutorFindById.mockImplementation((id: string) =>
			id === tutorID.toString()
				? Promise.resolve({ _id: tutorID, name: "Tutor", email: "tutor@example.com", coursePermissions: [] })
				: Promise.resolve(null)
		);
		modelMocks.userFindById.mockImplementation(() => queryWith(makeStudent()));
		modelMocks.pythonProjectFind.mockReturnValue(queryWith([makeProject()]));
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());
		modelMocks.pythonProjectReviewFind.mockReturnValue(queryWith([makeReview()]));
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(makeReview());
		modelMocks.pythonProjectReviewCreate.mockImplementation(async payload => makeReview(payload));
	});

	it("lets signed-in students list their own Code IDE projects", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/loggedin/python-projects`, {
				headers: { "x-user-id": studentID.toString() }
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFind).toHaveBeenCalledWith({ user: studentID });
			expect(body.projects).toHaveLength(1);
			expect(body.projects[0].files[0].content).toBe("print('student')\n");
		});
	});

	it("lets admins list saved projects with their staff review copies", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/${studentID}/python-projects`, {
				headers: { "x-admin-id": adminID.toString() }
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFind).toHaveBeenCalledWith({ user: studentID });
			expect(modelMocks.pythonProjectReviewFind).toHaveBeenCalledWith({ user: studentID });
			expect(body.projects).toHaveLength(1);
			expect(body.projects[0].project.files[0].content).toBe("print('student')\n");
			expect(body.projects[0].review.files[0].content).toContain("Try a for loop");
		});
	});

	it("lets assigned tutors create a staff review copy from a student project", async () => {
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(null);

		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review`,
				{},
				{ "x-tutor-id": tutorID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectReviewCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					user: studentID,
					sourceProject: projectID,
					files: makeProject().files,
					visibleToStudent: false,
					reviewer: tutorID,
					reviewerRole: "tutor",
					lastEditedBy: tutorID,
					lastEditedByRole: "tutor"
				})
			);
			expect(body.review.sourceProject).toBe(projectID.toString());
			expect(body.review.visibleToStudent).toBe(false);
		});
	});

	it("lets staff create and edit Java IDE review copies without backend execution", async () => {
		const javaFiles = [
			{
				name: "Main.java",
				content: "public class Main { public static void main(String[] args) {} }",
				encoding: "text"
			},
			{
				name: "Helper.java",
				content: "public class Helper {}",
				encoding: "text"
			}
		];
		const javaProject = makeProject({
			activeFileName: "Main.java",
			files: javaFiles,
			mode: "java",
			title: "Java classes"
		});
		const javaReview = makeReview({
			activeFileName: "Main.java",
			files: javaFiles,
			mode: "java",
			title: "Java classes"
		});
		modelMocks.pythonProjectFindOne.mockResolvedValueOnce(javaProject);
		modelMocks.pythonProjectReviewFindOne.mockResolvedValueOnce(null);
		modelMocks.pythonProjectReviewCreate.mockImplementationOnce(async payload => makeReview(payload));

		await withUserRoutes(async baseUrl => {
			const createResponse = await postJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review`,
				{},
				{ "x-admin-id": adminID.toString() }
			);
			const createBody = await createResponse.json();

			expect(createResponse.status).toBe(201);
			expect(modelMocks.pythonProjectReviewCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					activeFileName: "Main.java",
					files: javaFiles,
					mode: "java",
					title: "Java classes"
				})
			);
			expect(createBody.review.mode).toBe("java");
			expect(createBody.review.files.map((file: { name: string }) => file.name)).toEqual([
				"Main.java",
				"Helper.java"
			]);
		});

		modelMocks.pythonProjectFindOne.mockResolvedValue(javaProject);
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(javaReview);

		await withUserRoutes(async baseUrl => {
			const updateResponse = await putJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
				{
					activeFileName: "Main.java",
					files: [
						{
							name: "Main.java",
							content: "public class Main { public static void main(String[] args) { System.out.println(\"reviewed\"); } }"
						}
					],
					visibleToStudent: true
				},
				{ "x-admin-id": adminID.toString() }
			);
			const updateBody = await updateResponse.json();

			expect(updateResponse.status).toBe(200);
			expect(javaReview.save).toHaveBeenCalled();
			expect(updateBody.project.files).toEqual(javaFiles);
			expect(updateBody.review.mode).toBe("java");
			expect(updateBody.review.files).toEqual([
				{
					name: "Main.java",
					content: "public class Main { public static void main(String[] args) { System.out.println(\"reviewed\"); } }",
					encoding: "text"
				}
			]);
			expect(updateBody.review.visibleToStudent).toBe(true);
		});
	});

	it("blocks tutors from reviewing code for students not assigned to them", async () => {
		modelMocks.userFindById.mockImplementation(() => queryWith(makeStudent([otherTutorID])));

		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review`,
				{},
				{ "x-tutor-id": tutorID.toString() }
			);

			expect(response.status).toBe(403);
			expect(modelMocks.pythonProjectReviewCreate).not.toHaveBeenCalled();
		});
	});

	it("updates only the staff review copy and visibility flag", async () => {
		const review = makeReview();
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(review);

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
				{
					files: [
						{
							name: "main.py",
							content: "# Nice decomposition.\nprint('reviewed')\n"
						}
					],
					activeFileName: "main.py",
					visibleToStudent: true,
					note: "Review this before the next lesson."
				},
				{ "x-tutor-id": tutorID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(review.save).toHaveBeenCalled();
			expect(body.project.files[0].content).toBe("print('student')\n");
			expect(body.review.files[0].content).toContain("Nice decomposition");
			expect(body.review.visibleToStudent).toBe(true);
			expect(body.review.note).toBe("Review this before the next lesson.");
			expect(body.review.lastEditedByRole).toBe("tutor");
		});
	});

	it("lists only visible review copies for the logged-in student", async () => {
		modelMocks.pythonProjectReviewFind.mockReturnValue(queryWith([
			makeReview({
				visibleToStudent: true,
				note: "Tutor comments are in the code."
			})
		]));

		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/loggedin/python-project-reviews`, {
				headers: { "x-user-id": studentID.toString() }
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectReviewFind).toHaveBeenCalledWith({
				user: studentID,
				visibleToStudent: true
			});
			expect(body.reviews).toHaveLength(1);
			expect(body.reviews[0].sourceProject).toBe(projectID.toString());
			expect(body.reviews[0].note).toBe("Tutor comments are in the code.");
		});
	});

	it("lets signed-in students create and disable a share link for their own project", async () => {
		const project = makeProject();
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);

		await withUserRoutes(async baseUrl => {
			const enableResponse = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: true },
				{ "x-user-id": studentID.toString() }
			);
			const enableBody = await enableResponse.json();

			expect(enableResponse.status).toBe(200);
			expect(modelMocks.pythonProjectFindOne).toHaveBeenCalledWith({
				_id: new Types.ObjectId(projectID),
				user: studentID
			});
			expect(project.shared).toBe(true);
			expect(project.shareID).toMatch(/^[\w-]{20,80}$/);
			expect(project.shareCreatedAt).toBeInstanceOf(Date);
			expect(project.save).toHaveBeenCalled();
			expect(enableBody.project.shared).toBe(true);
			expect(enableBody.project.shareID).toBe(project.shareID);

			const disableResponse = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: false },
				{ "x-user-id": studentID.toString() }
			);
			const disableBody = await disableResponse.json();

			expect(disableResponse.status).toBe(200);
			expect(project.shared).toBe(false);
			expect(disableBody.project.shared).toBe(false);
			expect(disableBody.project.shareID).toBeUndefined();
		});
	});

	it("serves only enabled shared Code IDE project links without a login", async () => {
		const shareID = "share_ABC1234567890_xyz";
		modelMocks.pythonProjectFindOne.mockResolvedValue(
			makeProject({
				shared: true,
				shareID,
				shareCreatedAt: now
			})
		);

		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/python-projects/shared/${shareID}`
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFindOne).toHaveBeenCalledWith({
				shareID,
				shared: true
			});
			expect(body.project.title).toBe("Loops practice");
			expect(body.project.files[0].content).toBe("print('student')\n");
			expect(body.project.shared).toBe(true);
			expect(body.project.shareID).toBe(shareID);
		});
	});
});
