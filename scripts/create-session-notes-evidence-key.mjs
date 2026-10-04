#!/usr/bin/env node
import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const [directory, ids] = process.argv.slice(2);
const students = ids?.split(",") ?? [];
if (process.argv.length !== 4 || !directory || !students.length || students.length > 1000 || students.some(id => !/^[a-f0-9]{24}$/.test(id))) {
	console.error("Usage: node scripts/create-session-notes-evidence-key.mjs <private-directory> <comma-separated-student-ids>");
	process.exit(1);
}
const destination = resolve(directory);
mkdirSync(destination, { recursive: true, mode: 0o700 });
const tokenPath = resolve(destination, "session-notes-evidence.token");
const envPath = resolve(destination, "session-notes-evidence.env");
const token = randomBytes(32).toString("base64url");
const digest = createHash("sha256").update(token).digest("hex");
const expiry = new Date(Date.now() + 90 * 86_400_000).toISOString();
writeFileSync(tokenPath, `${token}\n`, { mode: 0o600, flag: "wx" });
try {
	writeFileSync(envPath, [
		`SESSION_NOTES_EVIDENCE_TOKEN_SHA256=${digest}`,
		`SESSION_NOTES_EVIDENCE_TOKEN_EXPIRES_AT=${expiry}`,
		"SESSION_NOTES_EVIDENCE_SCOPE=register",
		`SESSION_NOTES_EVIDENCE_STUDENT_IDS=${[...new Set(students)].join(",")}`,
		""
	].join("\n"), { mode: 0o600, flag: "wx" });
}
catch (error) {
	rmSync(tokenPath);
	throw error;
}
console.log("Created private registration credential files. Existing read credentials were not changed. Never commit or print these files.");
