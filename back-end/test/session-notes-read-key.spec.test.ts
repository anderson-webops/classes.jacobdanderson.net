import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execPath } from "node:process";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("../../scripts/create-session-notes-read-key.mjs", import.meta.url));
const directories: string[] = [];
function directory() {
	const path = mkdtempSync(join(tmpdir(), "session-read-key-test-"));
	directories.push(path);
	return path;
}
afterEach(() => {
	for (const path of directories.splice(0)) rmSync(path, { recursive: true });
});

describe("private read-only credential setup", () => {
	it("writes restricted files with an expiring hash and does not print the credential", () => {
		const path = join(directory(), "private");
		const output = execFileSync(execPath, [script, path], { encoding: "utf8" });
		const token = readFileSync(join(path, "session-notes-read.token"), "utf8").trim();
		const config = readFileSync(join(path, "session-notes-read.env"), "utf8");
		expect(token).toMatch(/^[\w-]{43}$/);
		expect(config).toContain(createHash("sha256").update(token).digest("hex"));
		const expiry = Date.parse(config.split("SESSION_NOTES_READ_TOKEN_EXPIRES_AT=")[1].trim());
		expect(expiry - Date.now()).toBeGreaterThan(89 * 86_400_000);
		expect(expiry - Date.now()).toBeLessThanOrEqual(90 * 86_400_000);
		expect(statSync(path).mode & 0o777).toBe(0o700);
		for (const file of ["session-notes-read.token", "session-notes-read.env"]) {
			expect(statSync(join(path, file)).mode & 0o777).toBe(0o600);
		}
		expect(output).not.toContain(token);
		expect(spawnSync(execPath, [script, path]).status).not.toBe(0);
		expect(readFileSync(join(path, "session-notes-read.token"), "utf8").trim()).toBe(token);
	});
	it("preserves existing configuration and removes only the incomplete new credential", () => {
		const path = directory();
		writeFileSync(join(path, "session-notes-read.env"), "existing-config", { mode: 0o600 });
		expect(spawnSync(execPath, [script, path]).status).not.toBe(0);
		expect(readFileSync(join(path, "session-notes-read.env"), "utf8")).toBe("existing-config");
		expect(existsSync(join(path, "session-notes-read.token"))).toBe(false);
	});
});
