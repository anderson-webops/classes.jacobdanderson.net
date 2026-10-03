#!/usr/bin/env node
import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const directory = process.argv[2];
if (!directory || process.argv.length !== 3) {
	console.error("Usage: node scripts/create-session-notes-read-key.mjs <private-directory>");
	process.exit(1);
}
const destination = resolve(directory);
mkdirSync(destination, { recursive: true, mode: 0o700 });
const tokenFile = resolve(destination, "session-notes-read.token");
const configFile = resolve(destination, "session-notes-read.env");
const token = randomBytes(32).toString("base64url");
const hash = createHash("sha256").update(token).digest("hex");
const expiresAt = new Date(Date.now() + 90 * 86_400_000).toISOString();
writeFileSync(tokenFile, `${token}\n`, { mode: 0o600, flag: "wx" });
try {
	writeFileSync(configFile, [
		`SESSION_NOTES_READ_TOKEN_SHA256=${hash}`,
		`SESSION_NOTES_READ_TOKEN_EXPIRES_AT=${expiresAt}`,
		""
	].join("\n"), { mode: 0o600, flag: "wx" });
}
catch (error) {
	// Only remove the new file created by this invocation, never existing keys.
	rmSync(tokenFile);
	throw error;
}
console.log(`Client credential: ${tokenFile}`);
console.log(`Server configuration: ${configFile}`);
console.log(`Expires: ${expiresAt}. Neither file belongs in Git or a public directory.`);
