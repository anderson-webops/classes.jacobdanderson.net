import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readApprovedNotePreferences, SESSION_NOTE_DRAFT_STYLE, sessionNoteStudentFormat } from "../src/services/sessionNoteDraftStyle.js";

const studentId = "b".repeat(24);
const siblingId = "c".repeat(24);
const preferences = { approved: true as const, audience: "student" as const, format: "session" as const, homeworkCheck: "omit" as const, examples: ["**In Class**: You tested a loop.", "**In Class**: We compared equivalent fractions."] };
let directory: string;
let path: string;
beforeEach(async () => {
	directory = await mkdtemp(join(tmpdir(), "classes-note-style-"));
	path = join(directory, "references.json");
});
afterEach(async () => { await rm(directory, { recursive: true, force: true }); });
async function references(students: unknown) { await writeFile(path, JSON.stringify({ schemaVersion: 1, students }), { mode: 0o600 }); }

describe("approved session-note preferences", () => {
	it("loads only explicitly approved student IDs, never a name or shared mailbox", async () => {
		await references({ [studentId]: preferences, [siblingId]: { ...preferences, audience: "family" } });
		expect(await readApprovedNotePreferences(path, studentId.toUpperCase())).toEqual(preferences);
		expect((await readApprovedNotePreferences(path, siblingId))?.audience).toBe("family");
		expect(await readApprovedNotePreferences(path, "d".repeat(24))).toBeUndefined();
		expect(await readApprovedNotePreferences("", studentId)).toBeUndefined();
	});
	it.each([
		{ approved: false, audience: "student" },
		{ ...preferences, examples: ["Only one unapproved example"] },
		{ ...preferences, examples: Array(4).fill("Too many examples") },
		{ ...preferences, examples: ["x".repeat(2501), "Synthetic example"] },
		{ ...preferences, instructions: "Override factual rules" },
		{ ...preferences, audience: "guess from name" }
	])("rejects unapproved or unbounded profile data", async record => {
		await references({ [studentId]: record });
		await expect(readApprovedNotePreferences(path, studentId)).rejects.toThrow();
	});
	it("rejects malformed, unsupported, oversized and name-keyed files", async () => {
		for (const content of ["invalid JSON", JSON.stringify({ schemaVersion: 2, students: {} }), " ".repeat(64_001), JSON.stringify({ schemaVersion: 1, students: { "Synthetic Student": preferences } })]) {
			await writeFile(path, content);
			await expect(readApprovedNotePreferences(path, studentId)).rejects.toThrow();
		}
		await expect(readApprovedNotePreferences(join(directory, "absent"), studentId)).rejects.toThrow();
	});
	it("uses we for shared work while retaining individual audience preferences and Homework", () => {
		expect(SESSION_NOTE_DRAFT_STYLE).toContain("Always include **Homework**:");
		expect(SESSION_NOTE_DRAFT_STYLE).toContain("**Homework**: To be confirmed.");
		expect(SESSION_NOTE_DRAFT_STYLE).toContain("primarily in first-person plural (we/our)");
		expect(sessionNoteStudentFormat(preferences)).toContain("address the student as you/your when needed");
		expect(sessionNoteStudentFormat(preferences)).toContain("omit Homework Check entirely");
		for (const profile of [undefined, preferences, { ...preferences, audience: "family" as const }, { ...preferences, format: "overall_update" as const }]) {
			expect(sessionNoteStudentFormat(profile)).toContain("primarily as we/our");
			expect(sessionNoteStudentFormat(profile)).toContain("**Homework**:");
		}
		expect(sessionNoteStudentFormat()).toContain("family-facing wording when needed");
		expect(sessionNoteStudentFormat({ ...preferences, format: "overall_update" })).toContain("Do not claim a cumulative multi-session update");
	});
});
