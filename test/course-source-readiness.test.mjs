/* eslint-disable test/no-import-node-test -- This suite uses the CI native Node test runner. */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	parseSourceReadinessOptions,
	sourceReadinessRepositoryRoot,
	writeSourceReadinessFile
} from "../front-end/scripts/source-readiness-io.mts";

function fixture(t) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "course-readiness-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	return root;
}

test("previews the required Juni layout by default", () => {
	assert.deepEqual(parseSourceReadinessOptions([]), {
		sourceRoot: path.join(os.homedir(), "Documents", "Work", "Juni"),
		repository: null,
		write: false
	});
	assert.throws(() => parseSourceReadinessOptions(["--write"]));
	assert.throws(() =>
		parseSourceReadinessOptions([
			"--write",
			"--repo",
			"Python-Level-3",
			"--dry-run"
		])
	);
	assert.throws(() => parseSourceReadinessOptions(["--repo", "../other"]));
	assert.throws(() => parseSourceReadinessOptions(["--source-root"]));
	assert.throws(() => parseSourceReadinessOptions(["--typo"]));
});

test("maps current course folders and rejects an escaping repository", (t) => {
	const root = fixture(t);
	const outside = fixture(t);
	const options = parseSourceReadinessOptions(["--source-root", root]);
	fs.mkdirSync(path.join(root, "C++ Level 3"));
	assert.equal(
		sourceReadinessRepositoryRoot(options, "CPP-Level-3"),
		path.join(root, "C++ Level 3")
	);
	assert.equal(sourceReadinessRepositoryRoot(options, "USACO-Silver"), null);
	fs.symlinkSync(outside, path.join(root, "USACO Silver"));
	assert.throws(
		() => sourceReadinessRepositoryRoot(options, "USACO-Silver"),
		/leaves the selected root/
	);
});

test("preview creates neither files nor project directories", (t) => {
	const root = fixture(t);
	const file = path.join(root, "Unity", "Assets", "Tests", "Rules.cs");
	assert.equal(
		writeSourceReadinessFile(root, file, "new rules", false),
		"proposed"
	);
	assert.deepEqual(fs.readdirSync(root), []);
});

test("preserves authored verification, role records and project bytes and modes", (t) => {
	const root = fixture(t);
	for (const [name, content, mode] of [
		[
			"verify-course-source.sh",
			"#!/bin/sh\npython3 verify_algorithms.py\n",
			0o700
		],
		[
			"COURSE_SOURCE_MANIFEST.md",
			"Starter: unfinished; reference: oracle-checked\n",
			0o640
		],
		[
			"SOURCE_BACKLOG.md",
			"Missing roles still require implementation\n",
			0o600
		],
		["Main.cs", "// Authored learner task\n", 0o644]
	]) {
		const file = path.join(root, name);
		fs.writeFileSync(file, content, { mode });
		const before = fs.statSync(file);
		assert.equal(
			writeSourceReadinessFile(
				root,
				file,
				"generic replacement",
				true,
				0o755
			),
			"preserved"
		);
		assert.equal(fs.readFileSync(file, "utf8"), content);
		assert.equal(fs.statSync(file).mode, before.mode);
		assert.equal(fs.statSync(file).mtimeMs, before.mtimeMs);
	}
});

test("explicit writing creates only missing files and is idempotent", (t) => {
	const root = fixture(t);
	const file = path.join(root, "Python Level 3", "verify-course-source.sh");
	assert.equal(
		writeSourceReadinessFile(root, file, "#!/bin/sh\nexit 0", true, 0o755),
		"created"
	);
	assert.equal(fs.readFileSync(file, "utf8"), "#!/bin/sh\nexit 0\n");
	assert.equal(fs.statSync(file).mode & 0o777, 0o755);
	assert.equal(
		writeSourceReadinessFile(root, file, "changed gate", true),
		"preserved"
	);
	assert.equal(fs.readFileSync(file, "utf8"), "#!/bin/sh\nexit 0\n");
});

test("rejects writes outside the root or through a linked project directory", (t) => {
	const root = fixture(t);
	const outside = fixture(t);
	assert.throws(
		() =>
			writeSourceReadinessFile(
				root,
				path.join(outside, "new.md"),
				"text",
				true
			),
		/leaves the selected/
	);
	fs.symlinkSync(outside, path.join(root, "Assets"));
	assert.throws(
		() =>
			writeSourceReadinessFile(
				root,
				path.join(root, "Assets", "Tests", "new.cs"),
				"text",
				true
			),
		/symbolic link/
	);
	assert.deepEqual(fs.readdirSync(outside), []);
});

test("preserves a dangling authored file link", (t) => {
	const root = fixture(t);
	const file = path.join(root, "verify-course-source.sh");
	fs.symlinkSync("missing-authored-gate.sh", file);
	assert.equal(
		writeSourceReadinessFile(root, file, "generic gate", true),
		"preserved"
	);
	assert.equal(fs.readlinkSync(file), "missing-authored-gate.sh");
	assert.equal(
		fs.existsSync(path.join(root, "missing-authored-gate.sh")),
		false
	);
});

test("the complete generator previews and preserves real authored gates", (t) => {
	const root = fixture(t);
	const repository = path.join(root, "Python Level 3");
	fs.mkdirSync(repository);
	const gate = path.join(repository, "verify-course-source.sh");
	const content = "#!/bin/sh\npython3 verify_algorithms.py\n";
	fs.writeFileSync(gate, content, { mode: 0o700 });
	const script = fileURLToPath(
		new URL(
			"../front-end/scripts/sync-course-source-readiness.mts",
			import.meta.url
		)
	);
	const run = (...args) => {
		const startedAt = new Date().toISOString();
		const result = spawnSync(
			process.execPath,
			[
				"--import",
				import.meta.resolve("tsx"),
				script,
				"--source-root",
				root,
				"--repo",
				"Python-Level-3",
				...args
			],
			{
				cwd: fileURLToPath(new URL("../front-end", import.meta.url)),
				encoding: "utf8",
				timeout: 20000,
				killSignal: "SIGKILL",
				detached: process.platform !== "win32"
			}
		);
		let groupCleanup = "not needed";
		if (result.error || result.signal || result.status !== 0) {
			try {
				process.kill(process.platform === "win32" ? result.pid : -result.pid, "SIGKILL");
				groupCleanup = "terminated";
			}
			catch (error) {
				if (error.code !== "ESRCH") throw error;
				groupCleanup = "already exited";
			}
		}
		t.diagnostic(JSON.stringify({
			parentTaskId: "course-source-readiness-regression",
			cwd: fileURLToPath(new URL("../front-end", import.meta.url)),
			command: [script, "--source-root", root, "--repo", "Python-Level-3", ...args],
			pid: result.pid,
			startedAt,
			endedAt: new Date().toISOString(),
			exitCode: result.status,
			timeoutMs: 20000,
			groupCleanup
		}));
		return result;
	};
	const preview = run();
	assert.equal(preview.status, 0, preview.stderr);
	assert.match(preview.stdout, /Preview only; no files changed/);
	assert.deepEqual(fs.readdirSync(repository), ["verify-course-source.sh"]);
	const written = run("--write");
	assert.equal(written.status, 0, written.stderr);
	assert.match(written.stdout, /preserved:.*verify-course-source.sh/);
	assert.equal(fs.readFileSync(gate, "utf8"), content);
	assert.equal(fs.statSync(gate).mode & 0o777, 0o700);
	assert.ok(
		fs.existsSync(path.join(repository, "COURSE_SOURCE_MANIFEST.md"))
	);
	assert.ok(fs.existsSync(path.join(repository, "SOURCE_BACKLOG.md")));
});
