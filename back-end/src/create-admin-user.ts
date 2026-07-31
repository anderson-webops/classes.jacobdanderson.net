import process, { env } from "node:process";
import mongoose from "mongoose";
import * as readlineSync from "readline-sync";

import { Admin } from "./models/schemas/Admin.js";
import { selectMongoConnection } from "./security/mongoConnection.js";
import {
	adminCreationPayloadSchema,
	isDuplicateKeyError
} from "./utils/accountPayloads.js";
import { accountEmailExists } from "./utils/accountSessions.js";
import { readMongoSecret } from "./vaultClient.js";
import "dotenv/config";

async function main(): Promise<void> {
	try {
		const mongoConnection = await selectMongoConnection(
			env,
			readMongoSecret
		);
		await mongoose.connect(mongoConnection.uri);

		const parsed = adminCreationPayloadSchema.safeParse({
			name: readlineSync.question("Name: "),
			email: readlineSync.question("Email: "),
			password: readlineSync.question("Password: ", {
				hideEchoBack: true
			})
		});
		if (!parsed.success) {
			console.error(
				"Enter a valid name and email, and a password between 8 and 256 characters."
			);
			process.exitCode = 1;
			return;
		}

		const { email, name, password } = parsed.data;
		if (await accountEmailExists(email)) {
			console.error("That email already exists.");
			process.exitCode = 1;
			return;
		}

		const admin = new Admin({
			name,
			email,
			password,
			editAdmins: false,
			saveEdit: "Edit",
			role: "admin"
		});

		await admin.save();
		console.log("Admin account created.");
	}
	catch (error) {
		if (isDuplicateKeyError(error)) {
			console.error("That email already exists.");
		}
		else {
			// Connection errors can contain database credentials. Keep this
			// message deliberately independent of the caught error.
			console.error(
				"Admin provisioning failed. Check database connectivity and account state."
			);
		}
		process.exitCode = 1;
	}
	finally {
		if (mongoose.connection.readyState !== 0) {
			try {
				await mongoose.disconnect();
			}
			catch {
				console.error(
					"Database disconnect failed after Admin provisioning."
				);
				process.exitCode = 1;
			}
		}
	}
}

void main();
