import type { Server } from "node:http";
import type { CustomSession } from "../src/types/session/CustomSession.js";
import cookieSession from "cookie-session";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminExists: vi.fn(),
	adminFindById: vi.fn(),
	codeCreate: vi.fn(),
	codeFind: vi.fn(),
	codeFindOne: vi.fn(),
	learnerCreate: vi.fn(),
	learnerFindById: vi.fn(),
	learnerFindOne: vi.fn(),
	tutorExists: vi.fn(),
	tutorFindById: vi.fn(),
	userFindById: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		exists: modelMocks.adminExists,
		findById: modelMocks.adminFindById
	}
}));

vi.mock("../src/models/schemas/CourseAccessCode.js", () => ({
	CourseAccessCode: {
		create: modelMocks.codeCreate,
		find: modelMocks.codeFind,
		findOne: modelMocks.codeFindOne
	}
}));

vi.mock("../src/models/schemas/CourseCodeLearner.js", () => ({
	CourseCodeLearner: {
		create: modelMocks.learnerCreate,
		findById: modelMocks.learnerFindById,
		findOne: modelMocks.learnerFindOne
	}
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: {
		exists: modelMocks.tutorExists,
		findById: modelMocks.tutorFindById
	}
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: {
		findById: modelMocks.userFindById
	}
}));

const { courseAccessCodeRoutes } = await import(
	"../src/routes/courseAccessCodeRoutes.js"
);
const { validAccountSession } = await import("../src/middleware/auth.js");
const {
	hashCourseAccessCode,
	normalizeCourseAccessCode
} = await import("../src/utils/courseAccessCodes.js");

interface AccessCodeRecord {
	_id: Types.ObjectId;
	codeHash: string;
	codeHint: string;
	courseID: string;
	label: string;
	createdBy: Types.ObjectId;
	createdByRole: "admin" | "tutor";
	createdByName: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
	save: ReturnType<typeof vi.fn>;
}

interface LearnerRecord {
	_id: Types.ObjectId;
	accessCode: Types.ObjectId;
	username: string;
	usernameKey: string;
	courseID: string;
	lastSeenAt: Date;
	createdAt: Date;
	updatedAt: Date;
	save: ReturnType<typeof vi.fn>;
}

const adminID = new Types.ObjectId();
const tutorID = new Types.ObjectId();
const testCodeID = new Types.ObjectId();
const testCode = "2345-6789-ABCD";
const testCodeHash = hashCourseAccessCode(
	normalizeCourseAccessCode(testCode) ?? ""
);
let accessCodes: AccessCodeRecord[] = [];
let learners: LearnerRecord[] = [];
let tutorCoursePermissions: string[] = [];

function makeThenableQuery<T>(value: T) {
	const promise = Promise.resolve(value);
	return {
		catch: promise.catch.bind(promise),
		select: vi.fn().mockResolvedValue(value),
		then: promise.then.bind(promise)
	};
}

function makeAccessCode(
	overrides: Partial<AccessCodeRecord> = {}
): AccessCodeRecord {
	const now = new Date("2026-07-25T12:00:00.000Z");
	return {
		_id: testCodeID,
		codeHash: testCodeHash,
		codeHint: "ABCD",
		courseID: "python-level-1",
		label: "Period 2",
		createdBy: adminID,
		createdByRole: "admin",
		createdByName: "Admin",
		active: true,
		createdAt: now,
		updatedAt: now,
		save: vi.fn().mockResolvedValue(undefined),
		...overrides
	};
}

function makeLearner(
	payload: Pick<
		LearnerRecord,
		"accessCode" | "courseID" | "lastSeenAt" | "username" | "usernameKey"
	>
): LearnerRecord {
	const now = new Date("2026-07-25T12:00:00.000Z");
	return {
		_id: new Types.ObjectId(),
		createdAt: now,
		updatedAt: now,
		save: vi.fn().mockResolvedValue(undefined),
		...payload
	};
}

function responseCookie(response: Response) {
	return response.headers
		.getSetCookie()
		.map(cookie => cookie.split(";", 1)[0])
		.join("; ");
}

async function withCourseAccessRoutes<T>(
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const app = express();
	app.set("trust proxy", false);
	app.use(express.json());
	app.use(
		cookieSession({
			name: "session",
			keys: ["course-access-test-secret"]
		})
	);
	app.post("/test/session/admin", (req, res) => {
		(req.session as CustomSession).adminID = adminID.toString();
		res.sendStatus(204);
	});
	app.post("/test/session/tutor", (req, res) => {
		(req.session as CustomSession).tutorID = tutorID.toString();
		res.sendStatus(204);
	});
	app.get("/test/session", (req, res) => {
		const session = req.session as CustomSession;
		res.json({
			adminID: session.adminID ?? null,
			courseCodeLearnerID: session.courseCodeLearnerID ?? null,
			tutorID: session.tutorID ?? null,
			userID: session.userID ?? null
		});
	});
	app.get("/test/protected-project", validAccountSession, (req, res) => {
		res.json({
			learnerID: req.currentCourseCodeLearner?._id.toString() ?? null
		});
	});
	app.use("/course-access", courseAccessCodeRoutes);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
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

async function seedSession(
	baseUrl: string,
	role: "admin" | "tutor"
): Promise<string> {
	const response = await fetch(`${baseUrl}/test/session/${role}`, {
		method: "POST"
	});
	expect(response.status).toBe(204);
	return responseCookie(response);
}

async function postJson(
	url: string,
	body: unknown,
	cookie?: string
): Promise<Response> {
	return fetch(url, {
		body: JSON.stringify(body),
		headers: {
			"content-type": "application/json",
			...(cookie ? { cookie } : {})
		},
		method: "POST"
	});
}

describe("course access code routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		accessCodes = [];
		learners = [];
		tutorCoursePermissions = ["python-level-1"];

		modelMocks.adminFindById.mockResolvedValue({
			_id: adminID,
			name: "Admin"
		});
		modelMocks.adminExists.mockResolvedValue({ _id: adminID });
		modelMocks.tutorFindById.mockImplementation(async () => ({
			_id: tutorID,
			name: "Tutor",
			coursePermissions: tutorCoursePermissions
		}));
		modelMocks.tutorExists.mockImplementation(async query =>
			query._id.toString() === tutorID.toString()
			&& tutorCoursePermissions.includes(query.coursePermissions)
				? { _id: tutorID }
				: null
		);
		modelMocks.codeCreate.mockImplementation(async payload => {
			const record = makeAccessCode({
				...payload,
				_id: new Types.ObjectId(),
				createdAt: new Date("2026-07-25T12:00:00.000Z"),
				updatedAt: new Date("2026-07-25T12:00:00.000Z")
			});
			accessCodes.push(record);
			return record;
		});
		modelMocks.codeFind.mockImplementation(query => ({
			sort: () => ({
				limit: async () =>
					accessCodes.filter(code =>
						!query.createdBy
						|| code.createdBy.toString() === query.createdBy.toString()
					)
			})
		}));
		modelMocks.codeFindOne.mockImplementation(query => {
			const match =
				accessCodes.find(code => {
					if (query.active !== undefined && code.active !== query.active) {
						return false;
					}
					if (query.codeHash && code.codeHash !== query.codeHash) return false;
					if (query._id && code._id.toString() !== query._id.toString()) {
						return false;
					}
					if (
						query.createdBy
						&& code.createdBy.toString() !== query.createdBy.toString()
					) {
						return false;
					}
					if (
						query.createdByRole
						&& code.createdByRole !== query.createdByRole
					) {
						return false;
					}
					return true;
				}) ?? null;
			return makeThenableQuery(match);
		});
		modelMocks.learnerFindOne.mockImplementation(async query =>
			learners.find(
				learner =>
					learner.accessCode.toString() === query.accessCode.toString()
					&& learner.usernameKey === query.usernameKey
			) ?? null
		);
		modelMocks.learnerCreate.mockImplementation(async payload => {
			const learner = makeLearner(payload);
			learners.push(learner);
			return learner;
		});
		modelMocks.learnerFindById.mockImplementation(async learnerID =>
			learners.find(
				learner => learner._id.toString() === learnerID.toString()
			) ?? null
		);
	});

	it("lets an admin issue a one-time raw code without returning or storing plaintext", async () => {
		await withCourseAccessRoutes(async baseUrl => {
			const cookie = await seedSession(baseUrl, "admin");
			const response = await postJson(
				`${baseUrl}/course-access/codes`,
				{ courseID: "python-level-1", label: "Period 2" },
				cookie
			);
			const responseText = await response.text();
			const body = JSON.parse(responseText);
			const compactCode = normalizeCourseAccessCode(body.code);

			expect(response.status).toBe(201);
			expect(body.code).toMatch(/^[23456789A-HJ-NP-Z]{4}(?:-[23456789A-HJ-NP-Z]{4}){2}$/);
			expect(compactCode).not.toBeNull();
			expect(modelMocks.codeCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					codeHash: hashCourseAccessCode(compactCode!),
					codeHint: compactCode!.slice(-4),
					courseID: "python-level-1"
				})
			);
			expect(modelMocks.codeCreate.mock.calls[0][0]).not.toHaveProperty("code");
			expect(responseText).not.toContain(hashCourseAccessCode(compactCode!));

			const listResponse = await fetch(
				`${baseUrl}/course-access/codes`,
				{ headers: { cookie } }
			);
			const listText = await listResponse.text();
			expect(listResponse.status).toBe(200);
			expect(listText).not.toContain(hashCourseAccessCode(compactCode!));
			expect(listText).not.toContain(body.code);
		});
	});

	it("prevents a tutor from issuing a code outside their enabled courses", async () => {
		await withCourseAccessRoutes(async baseUrl => {
			const cookie = await seedSession(baseUrl, "tutor");
			const response = await postJson(
				`${baseUrl}/course-access/codes`,
				{ courseID: "java-level-1" },
				cookie
			);

			expect(response.status).toBe(403);
			expect(modelMocks.codeCreate).not.toHaveBeenCalled();
			await expect(response.json()).resolves.toEqual({
				message: "This course is not enabled for your tutor account"
			});
		});
	});

	it("prevents a tutor from changing a code created by another staff member", async () => {
		const otherTutorCode = makeAccessCode({
			createdBy: new Types.ObjectId(),
			createdByRole: "tutor",
			createdByName: "Other Tutor"
		});
		accessCodes.push(otherTutorCode);

		await withCourseAccessRoutes(async baseUrl => {
			const cookie = await seedSession(baseUrl, "tutor");
			const response = await fetch(
				`${baseUrl}/course-access/codes/${otherTutorCode._id}`,
				{
					body: JSON.stringify({ active: false }),
					headers: {
						"content-type": "application/json",
						cookie
					},
					method: "PATCH"
				}
			);

			expect(response.status).toBe(404);
			expect(otherTutorCode.save).not.toHaveBeenCalled();
		});
	});

	it("reopens the same pseudonymous learner for a code and normalized username", async () => {
		accessCodes.push(makeAccessCode());

		await withCourseAccessRoutes(async baseUrl => {
			const firstResponse = await postJson(
				`${baseUrl}/course-access/redeem`,
				{ code: "2345 6789 abcd", username: "  Student   One  " }
			);
			const firstBody = await firstResponse.json();
			const firstCookie = responseCookie(firstResponse);
			const secondResponse = await postJson(
				`${baseUrl}/course-access/redeem`,
				{ code: testCode, username: "student one" }
			);
			const secondBody = await secondResponse.json();

			expect(firstResponse.status).toBe(200);
			expect(secondResponse.status).toBe(200);
			expect(modelMocks.learnerCreate).toHaveBeenCalledTimes(1);
			expect(firstBody.currentCourseLearner).toMatchObject({
				courseAccess: ["python-level-1"],
				courseID: "python-level-1",
				role: "course-code",
				username: "Student One"
			});
			expect(secondBody.currentCourseLearner._id).toBe(
				firstBody.currentCourseLearner._id
			);

			const sessionResponse = await fetch(`${baseUrl}/test/session`, {
				headers: { cookie: firstCookie }
			});
			await expect(sessionResponse.json()).resolves.toEqual({
				adminID: null,
				courseCodeLearnerID: firstBody.currentCourseLearner._id,
				tutorID: null,
				userID: null
			});

			const meResponse = await fetch(`${baseUrl}/course-access/me`, {
				headers: { cookie: firstCookie }
			});
			await expect(meResponse.json()).resolves.toMatchObject({
				currentCourseLearner: {
					_id: firstBody.currentCourseLearner._id,
					courseID: "python-level-1",
					username: "Student One"
				}
			});
		});
	});

	it("revokes an existing classroom session when its code is disabled", async () => {
		const accessCode = makeAccessCode();
		accessCodes.push(accessCode);

		await withCourseAccessRoutes(async baseUrl => {
			const redeemResponse = await postJson(
				`${baseUrl}/course-access/redeem`,
				{ code: testCode, username: "Student Two" }
			);
			const cookie = responseCookie(redeemResponse);
			const activeProjectResponse = await fetch(
				`${baseUrl}/test/protected-project`,
				{ headers: { cookie } }
			);
			expect(activeProjectResponse.status).toBe(200);
			accessCode.active = false;

			const meResponse = await fetch(`${baseUrl}/course-access/me`, {
				headers: { cookie }
			});
			expect(meResponse.status).toBe(200);
			await expect(meResponse.json()).resolves.toEqual({
				currentCourseLearner: null
			});

			const projectSessionResponse = await fetch(
				`${baseUrl}/test/protected-project`,
				{ headers: { cookie } }
			);
			expect(projectSessionResponse.status).toBe(403);
		});
	});
});
