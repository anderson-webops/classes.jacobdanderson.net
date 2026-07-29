import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PythonProject } from "../src/models/schemas/PythonProject.js";
import { Tutor } from "../src/models/schemas/Tutor.js";
import { User } from "../src/models/schemas/User.js";
import {
	demoteTutorAccount,
	promoteUserAccount
} from "../src/utils/accountRoleTransfer.js";

const replicaSetUri = process.env.MONGODB_REPLICA_SET_TEST_URI;
const replicaSetDescribe = replicaSetUri ? describe.sequential : describe.skip;

function isolatedDatabaseUri(uri: string) {
	const parsed = new URL(uri);
	parsed.pathname = `/classes_role_transfer_test_${randomBytes(8).toString("hex")}`;
	return parsed.toString();
}

replicaSetDescribe("account role transfer against MongoDB transactions", () => {
	beforeAll(async () => {
		await mongoose.connect(isolatedDatabaseUri(replicaSetUri!));
	});

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.disconnect();
	});

	it("commits the exact hash and IDE project owner migration in both directions", async () => {
		const user = await User.create({
			age: "",
			courseAccess: [],
			courseProgress: [],
			courseStatus: {},
			editUsers: false,
			email: "transaction-test@example.invalid",
			name: "Transaction Test",
			password: "transaction-test-password",
			role: "user",
			saveEdit: "Edit",
			sessionVersion: 0,
			state: "",
			tutors: []
		});
		const originalHash = user.password;
		const project = await PythonProject.create({
			activeFileName: "main.py",
			files: [{ content: "print('safe')", name: "main.py" }],
			mode: "python",
			ownerRole: "user",
			title: "Transaction project",
			user: user._id
		});

		const tutor = await promoteUserAccount(user._id.toString());
		expect(tutor.password).toBe(originalHash);
		expect(await User.exists({ _id: user._id })).toBeNull();
		expect(await PythonProject.exists({
			_id: project._id,
			ownerRole: "tutor",
			user: tutor._id
		})).toBeTruthy();

		const restoredUser = await demoteTutorAccount(tutor._id.toString());
		expect(restoredUser.password).toBe(originalHash);
		expect(await Tutor.exists({ _id: tutor._id })).toBeNull();
		expect(await PythonProject.exists({
			_id: project._id,
			ownerRole: "user",
			user: restoredUser._id
		})).toBeTruthy();
	});
});
