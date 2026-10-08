import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export function completeSetupFile(folder, name, source, reference) {
	if (!folder.endsWith("/starter") || name !== "search.hpp") return source;
	assert.equal((source.match(/\/\/ TODO (?:LINEAR|BINARY):/g) ?? []).length, 2);
	const functions = /inline SearchReport findFirst(?:Linear|Binary)\([\s\S]+?^\}/gm;
	const original = [...source.matchAll(functions)];
	const answers = [...reference["search.hpp"].matchAll(functions)];
	assert.equal(original.length, 2);
	assert.equal(answers.length, 2);
	let index = 0;
	const completed = source.replace(functions, () => answers[index++][0]);
	assert.equal(completed.replace(functions, "TASK"), source.replace(functions, "TASK"), "Only the two marked search functions change");
	return completed;
}

export async function verifySetupExport(directory, runNative, unfinished = false) {
	const oracle = await readFile(new URL("./fixtures/dsa-setup-regressions.cpp", import.meta.url), "utf8");
	const invalid = [["x"], ["+4"], [" 4"], ["4x"], ["2147483648"], ["-2147483649"], ["4", "x"], ["4", "1", "0"], ["4", "4x"], ["4", ""], ["4", "+4"], ["4", ...Array.from({ length: 1025 }).fill("4")]];
	try {
		await writeFile(join(directory, "setup-checks.cpp"), oracle);
		for (const sanitized of [false, true]) {
			const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", ...(sanitized ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
			assert.deepEqual(await runNative("clang++", [...flags, "main.cpp", "-o", "setup-sample"], directory), { code: 0, stdout: "", stderr: "" });
			const sample = await runNative(join(directory, "setup-sample"), [], directory);
			assert.deepEqual(sample, { code: 0, stdout: unfinished ? "linear index=none comparisons=0\nbinary index=none comparisons=0\n" : "linear index=3 comparisons=4\nbinary index=3 comparisons=3\n", stderr: "" });
			assert.deepEqual(await runNative(join(directory, "setup-sample"), ["21"], directory), { code: 0, stdout: "linear index=none comparisons=0\nbinary index=none comparisons=0\n", stderr: "" });
			for (const args of invalid) {
				const result = await runNative(join(directory, "setup-sample"), args, directory);
				assert.equal(result.code, 2);
				assert.equal(result.stdout, "");
				assert.match(result.stderr, /^error:/);
			}
			const maximum = await runNative(join(directory, "setup-sample"), ["4", ...Array.from({ length: 1024 }).fill("4")], directory);
			assert.equal(maximum.code, 0);
			assert.equal(maximum.stderr, "");
			if (!unfinished) {
				assert.deepEqual(await runNative("clang++", [...flags, `-DCOURSE_HEADER=${JSON.stringify(join(directory, "search.hpp"))}`, "setup-checks.cpp", "-o", "setup-checks"], directory), { code: 0, stdout: "", stderr: "" });
				const result = await runNative(join(directory, "setup-checks"), [], directory);
				assert.equal(result.code, 0, result.stderr);
				assert.equal(result.stderr, "");
				assert.equal(result.stdout, "Search oracle passed: 5397 generated vector/target pairs, duplicates, extremes, empty and unchanged input\n");
			}
		}
		for (const args of [["-S", ".", "-B", "setup-build"], ["--build", "setup-build"]]) assert.equal((await runNative("cmake", args, directory)).code, 0);
		const ctest = await runNative("ctest", ["--test-dir", "setup-build", "--output-on-failure", "--output-junit", "setup-tests.xml"], directory);
		assert.equal(ctest.code, unfinished ? 8 : 0);
		const check = "import sys,xml.etree.ElementTree as E; r=E.parse(sys.argv[1]).getroot(); c=r.findall('.//testcase'); assert len(c)==4; f={v.attrib['name'] for v in c if v.find('failure') is not None}; assert f==({'default_search','duplicate_search'} if sys.argv[2]=='1' else set())";
		assert.deepEqual(await runNative("python3", ["-c", check, join(directory, "setup-build", "setup-tests.xml"), unfinished ? "1" : "0"], directory), { code: 0, stdout: "", stderr: "" });
	}
	finally {
		for (const name of ["setup-sample", "setup-checks", "setup-checks.cpp", "setup-build"]) await rm(join(directory, name), { recursive: true, force: true });
	}
}
