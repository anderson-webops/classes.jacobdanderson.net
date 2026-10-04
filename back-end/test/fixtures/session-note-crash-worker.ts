import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { createNoteSendWorkflow } from "../../src/services/sessionNoteSending.js";
await mongoose.connect(process.argv[2]);
const workflow = createNoteSendWorkflow({
	enabled: () => true,
	validateBeforeSend: async () => {},
	send: async record => {
		await nodemailer
			.createTransport({
				host: "127.0.0.1",
				port: Number(process.argv[3]),
				secure: false,
				ignoreTLS: true
			})
			.sendMail({
				from: "fixture@example.test",
				to: record.note.primaryEmail,
				text: "Synthetic fixture only",
				messageId: record.messageId
			});
		process.stdout.write("synthetic_smtp_accepted\n");
		// Parent kills here, after DATA acceptance and before recording the result.
		await new Promise(() => {});
		return {};
	},
	archive: async () => {}
});
await workflow.dispatch(process.argv[4]);
