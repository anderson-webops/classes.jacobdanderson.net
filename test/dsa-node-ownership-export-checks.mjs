import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function verifyNodeOwnershipExport(directory, folder, runNative) {
	const source = await readFile(new URL("./fixtures/dsa-node-ownership-regressions.cpp", import.meta.url), "utf8");
	const kind = folder.startsWith("DSCPP6-") ? 1 : folder.startsWith("DSCPP7-") ? 2 : folder.startsWith("DSCPP8-") ? 3 : 4;
	const reference = folder.endsWith("/solution");
	try {
		await writeFile(join(directory, "ownership-checks.cpp"), source);
		for (const diagnostic of [false, true]) {
			const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Wconversion", "-Wsign-conversion", "-Werror", ...(diagnostic ? ["-g", "-O1", "-fsanitize=address,undefined", "-fno-sanitize-recover=all", "-fno-omit-frame-pointer"] : ["-O2"])];
			for (const [name, files] of [["ownership-demo", ["main.cpp"]], ["ownership-checks", [`-DCOURSE_SOURCE=${JSON.stringify(join(directory, "main.cpp"))}`, `-DOWNER_KIND=${kind}`, `-DOWNER_REFERENCE=${Number(reference)}`, "ownership-checks.cpp"]]]) {
				assert.deepEqual(await runNative("clang++", [...flags, ...files, "-o", name], directory), { code: 0, stdout: "", stderr: "" });
				const result = await runNative(join(directory, name), [], directory);
				assert.equal(result.code, 0, result.stderr);
				assert.equal(result.stderr, "");
				if (name === "ownership-checks") {
					assert.equal(result.stdout, "Single-owner policy and independent lifetimes passed\n");
				}
				else {
					assert.ok(result.stdout);
					if (kind === 4) {
						const lines = result.stdout.trimEnd().split("\n");
						assert.equal(lines.length, 6);
						assert.ok(lines.every(line => /^(?:vector|set|unordered_set|linked list|bst|avl) insert \(us\): \d+$/.test(line)));
					}
				}
			}
		}
	}
	finally {
		for (const name of ["ownership-demo", "ownership-checks", "ownership-checks.cpp"]) await rm(join(directory, name), { force: true });
	}
}
