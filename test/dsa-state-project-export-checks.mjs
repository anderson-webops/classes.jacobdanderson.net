import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function verifyStateProjectExport(directory, folder, runNative) {
	const markov = folder.startsWith("DSCPP3-");
	const reference = folder.endsWith("/solution");
	const kind = markov ? "markov" : "maze";
	const source = await readFile(join(directory, "main.cpp"), "utf8");
	assert.equal((source.match(/int main\(\)/g) ?? []).length, 1);
	if (!reference) {
		assert.match(source, /TODO:/);
		if (markov) assert.doesNotMatch(source, /buildModel\(/);
		else assert.match(source, /solveMaze\(\)\s*\{\s*\/\/ TODO:[^\n]*\n\s*return \{\};/);
	}
	const oracle = await readFile(new URL(`./fixtures/dsa-${kind}-regressions.cpp`, import.meta.url), "utf8");
	const header = `${kind}-under-test.hpp`;
	const checker = `${kind}-checks.cpp`;
	const program = `${kind}-sample`;
	const checks = `${kind}-checks`;
	try {
		await writeFile(join(directory, header), source.slice(0, source.indexOf("int main()")));
		await writeFile(join(directory, checker), oracle);
		for (const sanitized of [false, true]) {
			const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", ...(sanitized ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
			assert.deepEqual(await runNative("clang++", [...flags, "main.cpp", "-o", program], directory), { code: 0, stdout: "", stderr: "" });
			const demo = await runNative(join(directory, program), [], directory);
			assert.equal(demo.code, 0);
			assert.equal(demo.stderr, "");
			if (markov && reference) {
				assert.match(demo.stdout, /^Token count: 22\nUnique count: 16\nGenerated:(?: [a-z]+){1,18}\n$/);
				assert.deepEqual(await runNative(join(directory, program), [], directory), demo, "The same toolchain repeats the seeded demonstration");
			}
			else if (markov) {
				assert.equal(demo.stdout, "Token count: 11\nUnique count: 9\nStarter preview: structures matter trees matter lists matter\nTODO: replace the preview with a state-based text generator.\n");
			}
			else if (reference) {
				assert.equal(demo.stdout, "Path size: 61\nEnd coordinate: (4, 4, 4)\n");
			}
			else {
				const layers = Array.from({ length: 5 }, (_, z) => `Layer ${z}\n${"1 1 1 1 1 \n".repeat(5)}`).join("");
				assert.equal(demo.stdout, `${layers}Starter path length: 0\n`);
			}
			assert.deepEqual(await runNative("clang++", [...flags, `-D${markov ? "MARKOV" : "MAZE"}_REFERENCE=${reference ? 1 : 0}`, checker, "-o", checks], directory), { code: 0, stdout: "", stderr: "" });
			assert.deepEqual(await runNative(join(directory, checks), [], directory), { code: 0, stdout: markov ? reference ? "Token cleanup, 320 window models and input guards passed\n" : "Token cleanup and unfinished preview passed\n" : "17 malformed reloads, stream failure and 37 layouts passed\n", stderr: "" });
		}
	}
	finally {
		for (const name of [header, checker, program, checks]) await rm(join(directory, name), { force: true });
	}
}
