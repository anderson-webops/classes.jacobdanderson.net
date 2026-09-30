import nodemailer from "nodemailer";
import { describe, expect, it } from "vitest";

describe("patched mail package compatibility", () => {
	it("composes transactional mail without contacting a provider", async () => {
		const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
		const result = await transport.sendMail({
			from: "sender@example.test",
			to: "learner@example.test",
			replyTo: "reply@example.test",
			subject: "Synthetic compatibility check",
			text: "Plain message",
			html: "<p>HTML message</p>"
		});
		expect(result.envelope.to).toEqual(["learner@example.test"]);
		expect(result.message.toString()).toContain("Subject: Synthetic compatibility check");
		expect(result.message.toString()).toContain("Plain message");
		expect(result.message.toString()).toContain("HTML message");
		transport.close();
	});
});
