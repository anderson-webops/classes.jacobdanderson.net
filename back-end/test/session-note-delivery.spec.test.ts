import { describe, expect, it } from "vitest";
import { SessionNote } from "../src/models/schemas/SessionNote.js";
import { sessionNoteDeliveryFromSend } from "../src/utils/sessionNoteDelivery.js";

const sentAt = new Date("2026-10-03T17:00:00Z");

describe("session note send evidence", () => {
	it.each([
		{ accepted: ["Student@Example.test"] },
		{ accepted: [{ address: "student@example.test" }] }
	])("records only explicit primary-recipient SMTP acceptance", (info) => {
		expect(sessionNoteDeliveryFromSend(info, "student@example.test", sentAt))
			.toEqual({ source: "site_smtp", status: "smtp_accepted", sentAt });
	});
	it("does not confuse CC acceptance with primary acceptance", () => {
		expect(sessionNoteDeliveryFromSend({ accepted: ["parent@example.test"] }, "student@example.test", sentAt))
			.toEqual({ source: "site_smtp", status: "unknown" });
	});
	it("prioritizes explicit primary rejection over acceptance", () => {
		expect(sessionNoteDeliveryFromSend({
			accepted: ["parent@example.test", "student@example.test"],
			rejected: [{ address: "student@example.test" }]
		}, "student@example.test", sentAt))
			.toEqual({ source: "site_smtp", status: "smtp_rejected" });
	});
	it.each([{}, { accepted: "student@example.test" }, { accepted: [null, 1, {}] }])(
		"does not fabricate dates for missing or malformed transport evidence",
		(info) => {
			expect(sessionNoteDeliveryFromSend(info, "student@example.test", sentAt))
				.toEqual({ source: "site_smtp", status: "unknown" });
		}
	);
	it("keeps manual and legacy documents without default sent metadata", async () => {
		const note = new SessionNote({
			studentName: "Student",
			primaryEmail: "student@example.test",
			subject: "Notes",
			sessionDate: sentAt,
			markdown: "Notes",
			html: "<p>Notes</p>"
		});
		await expect(note.validate()).resolves.toBeUndefined();
		expect(note.toObject()).not.toHaveProperty("delivery");
	});
});
