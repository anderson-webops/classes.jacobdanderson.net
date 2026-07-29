import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminCreate: vi.fn(),
	adminExists: vi.fn(),
	adminFind: vi.fn(),
	adminFindById: vi.fn(),
	tutorCreate: vi.fn(),
	tutorExists: vi.fn(),
	tutorFind: vi.fn(),
	tutorFindById: vi.fn(),
	userCreate: vi.fn(),
	userExists: vi.fn(),
	userFind: vi.fn(),
	userFindById: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		create: modelMocks.adminCreate,
		exists: modelMocks.adminExists,
		find: modelMocks.adminFind,
		findById: modelMocks.adminFindById
	}
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: {
		create: modelMocks.tutorCreate,
		exists: modelMocks.tutorExists,
		find: modelMocks.tutorFind,
		findById: modelMocks.tutorFindById
	}
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: {
		create: modelMocks.userCreate,
		exists: modelMocks.userExists,
		find: modelMocks.userFind,
		findById: modelMocks.userFindById
	}
}));

const { adminRoutes } = await import("../src/routes/adminRoutes.js");
const { tutorRoutes } = await import("../src/routes/tutorRoutes.js");
const { userRoutes } = await import("../src/routes/userRoutes.js");

function account(role: "admin" | "tutor" | "user", id = new Types.ObjectId()) {
	return {
		_id: id,
		age: "",
		comparePassword: vi.fn(),
		courseAccess: [],
		coursePermissions: [],
		courseProgress: [],
		courseStatus: {},
		editAdmins: false,
		email: `${role}@example.com`,
		name: role,
		password: "stored-password-hash",
		role,
		save: vi.fn().mockResolvedValue(undefined),
		saveEdit: "Edit",
		sessionVersion: 0,
		state: "",
		tutors: []
	};
}

function queryWith<T>(result: T) {
	const exec = vi.fn().mockResolvedValue(result);
	const query: Record<string, any> = {
		exec,
		lean: vi.fn(),
		limit: vi.fn(),
		populate: vi.fn(),
		select: vi.fn(),
		skip: vi.fn(),
		sort: vi.fn()
	};
	for (const method of ["lean", "limit", "populate", "select", "skip", "sort"]) {
		query[method].mockReturnValue(query);
	}
	return query;
}

async function withAccountRoutes<T>(run: (baseUrl: string) => Promise<T>) {
	const app = express();
	app.use(express.json());
	app.use((req: any, _res, next) => {
		req.session = {
			accountSessionVersion: 0,
			adminID: req.get("x-admin-id") || undefined,
			tutorID: req.get("x-tutor-id") || undefined,
			userID: req.get("x-user-id") || undefined
		};
		next();
	});
	app.use("/admins", adminRoutes);
	app.use("/tutors", tutorRoutes);
	app.use("/users", userRoutes);

	const server = await new Promise<Server>((resolve) => {
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
			server.close(error => error ? reject(error) : resolve());
		});
	}
}

async function sendJson(
	baseUrl: string,
	path: string,
	method: "POST" | "PUT",
	body: unknown,
	headers: Record<string, string> = {}
) {
	return fetch(`${baseUrl}${path}`, {
		body: JSON.stringify(body),
		headers: {
			"content-type": "application/json",
			...headers
		},
		method
	});
}

describe("account route authorization", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.adminExists.mockResolvedValue(null);
		modelMocks.tutorExists.mockResolvedValue(null);
		modelMocks.userExists.mockResolvedValue(null);
	});

	it("blocks unauthenticated admin and tutor account creation", async () => {
		await withAccountRoutes(async (baseUrl) => {
			const [adminResponse, tutorResponse] = await Promise.all([
				sendJson(baseUrl, "/admins", "POST", {
					email: "new-admin@example.com",
					name: "New Admin",
					password: "secure-password"
				}),
				sendJson(baseUrl, "/tutors", "POST", {
					email: "new-tutor@example.com",
					name: "New Tutor",
					password: "secure-password"
				})
			]);

			expect(adminResponse.status).toBe(403);
			expect(tutorResponse.status).toBe(403);
			expect(modelMocks.adminCreate).not.toHaveBeenCalled();
			expect(modelMocks.tutorCreate).not.toHaveBeenCalled();
		});
	});

	it("rejects stale admin cookies instead of trusting the signed role ID", async () => {
		modelMocks.adminFindById.mockResolvedValue(null);

		await withAccountRoutes(async (baseUrl) => {
			const response = await sendJson(
				baseUrl,
				"/tutors",
				"POST",
				{
					email: "new-tutor@example.com",
					name: "New Tutor",
					password: "secure-password"
				},
				{ "x-admin-id": new Types.ObjectId().toString() }
			);

			expect(response.status).toBe(403);
			expect(modelMocks.tutorCreate).not.toHaveBeenCalled();
		});
	});

	it("allows a live admin to create a tutor without accepting authorization fields", async () => {
		const admin = account("admin");
		const tutor = account("tutor");
		modelMocks.adminFindById.mockResolvedValue(admin);
		modelMocks.tutorCreate.mockResolvedValue(tutor);

		await withAccountRoutes(async (baseUrl) => {
			const rejected = await sendJson(
				baseUrl,
				"/tutors",
				"POST",
				{
					coursePermissions: ["all-courses"],
					email: "new-tutor@example.com",
					name: "New Tutor",
					password: "secure-password",
					role: "admin"
				},
				{ "x-admin-id": admin._id.toString() }
			);
			expect(rejected.status).toBe(400);
			expect(modelMocks.tutorCreate).not.toHaveBeenCalled();

			const accepted = await sendJson(
				baseUrl,
				"/tutors",
				"POST",
				{
					email: "new-tutor@example.com",
					name: "New Tutor",
					password: "secure-password"
				},
				{ "x-admin-id": admin._id.toString() }
			);
			expect(accepted.status).toBe(201);
			expect(modelMocks.tutorCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					coursePermissions: [],
					role: "tutor"
				})
			);
		});
	});

	it("forces self-service creation to a clean user role", async () => {
		const user = account("user");
		modelMocks.userCreate.mockResolvedValue(user);

		await withAccountRoutes(async (baseUrl) => {
			const rejected = await sendJson(baseUrl, "/users", "POST", {
				courseAccess: ["private-course"],
				email: "student@example.com",
				name: "Student",
				password: "secure-password",
				role: "admin"
			});
			expect(rejected.status).toBe(400);

			const accepted = await sendJson(baseUrl, "/users", "POST", {
				email: "student@example.com",
				name: "Student",
				password: "secure-password"
			});
			expect(accepted.status).toBe(201);
			expect(modelMocks.userCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					courseAccess: [],
					courseProgress: [],
					role: "user",
					tutors: []
				})
			);
		});
	});

	it("rejects new accounts when the email already belongs to another role", async () => {
		const existingTutorID = new Types.ObjectId();
		modelMocks.tutorExists.mockResolvedValue({ _id: existingTutorID });

		await withAccountRoutes(async (baseUrl) => {
			const response = await sendJson(baseUrl, "/users", "POST", {
				email: "shared@example.com",
				name: "Student",
				password: "secure-password"
			});

			expect(response.status).toBe(409);
			expect(modelMocks.userCreate).not.toHaveBeenCalled();
		});
	});

	it("blocks a user from updating another account", async () => {
		const currentUser = account("user");
		modelMocks.userFindById.mockResolvedValue(currentUser);

		await withAccountRoutes(async (baseUrl) => {
			const response = await sendJson(
				baseUrl,
				`/users/user/${new Types.ObjectId()}`,
				"PUT",
				{ name: "Attacker" },
				{ "x-user-id": currentUser._id.toString() }
			);
			expect(response.status).toBe(403);
			expect(currentUser.save).not.toHaveBeenCalled();
		});
	});

	it("rejects an otherwise valid account cookie after its session version changes", async () => {
		const currentUser = account("user");
		currentUser.sessionVersion = 1;
		modelMocks.userFindById.mockResolvedValue(currentUser);

		await withAccountRoutes(async (baseUrl) => {
			const response = await sendJson(
				baseUrl,
				`/users/user/${currentUser._id}`,
				"PUT",
				{ name: "Changed" },
				{ "x-user-id": currentUser._id.toString() }
			);
			expect(response.status).toBe(403);
			await expect(response.json()).resolves.toEqual({
				message: "User session has been revoked"
			});
			expect(currentUser.save).not.toHaveBeenCalled();
		});
	});

	it("applies only harmless profile fields during an authorized self-update", async () => {
		const currentUser = account("user");
		const storedUser = account("user", currentUser._id);
		modelMocks.userFindById
			.mockResolvedValueOnce(currentUser)
			.mockReturnValueOnce(queryWith(storedUser));

		await withAccountRoutes(async (baseUrl) => {
			const response = await sendJson(
				baseUrl,
				`/users/user/${currentUser._id}`,
				"PUT",
				{
					courseAccess: ["private-course"],
					name: "Updated Name",
					password: "replacement-password",
					role: "admin"
				},
				{ "x-user-id": currentUser._id.toString() }
			);

			expect(response.status).toBe(200);
			expect(storedUser.name).toBe("Updated Name");
			expect(storedUser.password).toBe("stored-password-hash");
			expect(storedUser.role).toBe("user");
			expect(storedUser.courseAccess).toEqual([]);
			expect(storedUser.save).toHaveBeenCalledOnce();
		});
	});

	it("rejects malformed values even when they use an allowed profile field", async () => {
		const currentUser = account("user");
		modelMocks.userFindById.mockResolvedValueOnce(currentUser);

		await withAccountRoutes(async (baseUrl) => {
			const response = await sendJson(
				baseUrl,
				`/users/user/${currentUser._id}`,
				"PUT",
				{ name: { role: "admin" } },
				{ "x-user-id": currentUser._id.toString() }
			);

			expect(response.status).toBe(400);
			expect(currentUser.save).not.toHaveBeenCalled();
			expect(modelMocks.userFindById).toHaveBeenCalledOnce();
		});
	});

	it("blocks tutors from updating learners they do not manage", async () => {
		const tutor = account("tutor");
		const user = account("user");
		modelMocks.tutorFindById.mockResolvedValue(tutor);
		modelMocks.userFindById.mockReturnValue({
			populate: vi.fn().mockResolvedValue(user)
		});

		await withAccountRoutes(async (baseUrl) => {
			const response = await sendJson(
				baseUrl,
				`/users/tutor/${user._id}`,
				"PUT",
				{ name: "Changed" },
				{ "x-tutor-id": tutor._id.toString() }
			);
			expect(response.status).toBe(403);
			expect(user.save).not.toHaveBeenCalled();
		});
	});

	it("keeps full user and tutor account lists private", async () => {
		await withAccountRoutes(async (baseUrl) => {
			const [usersResponse, tutorsResponse] = await Promise.all([
				fetch(`${baseUrl}/users/all`),
				fetch(`${baseUrl}/tutors`)
			]);
			expect(usersResponse.status).toBe(403);
			expect(tutorsResponse.status).toBe(403);
			expect(modelMocks.userFind).not.toHaveBeenCalled();
			expect(modelMocks.tutorFind).not.toHaveBeenCalled();
		});
	});

	it("keeps the public tutor directory limited to display fields", async () => {
		const directoryQuery = queryWith([
			{ _id: new Types.ObjectId(), name: "Tutor", state: "CA" }
		]);
		modelMocks.tutorFind.mockReturnValue(directoryQuery);

		await withAccountRoutes(async (baseUrl) => {
			const response = await fetch(`${baseUrl}/tutors/directory`);
			expect(response.status).toBe(200);
			expect(directoryQuery.select).toHaveBeenCalledWith(
				"_id name state usersOfTutorLength"
			);
		});
	});
});
