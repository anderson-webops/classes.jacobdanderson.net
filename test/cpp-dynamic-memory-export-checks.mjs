import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dynamicMemoryNativeCases } from "./fixtures/cpp-dynamic-memory-native-cases.mjs";

export function completeDynamicMemoryFile(folder, name, source, reference) {
	if (!folder.endsWith("-Starter") || !/\.(?:h|cpp)$/.test(name)) return source;
	assert.equal(typeof reference?.[name], "string", `Independently hashed ${name} reference is available`);
	// QA supplies an accepted completed attempt through the actual editor. These
	// bytes are never copied into the learner pack or offered automatically to users.
	return reference[name];
}

export async function verifyDynamicMemoryDefaultExport(directory, folder, runNative) {
	assert.ok(folder.endsWith("-Starter"));
	try {
		const build = await runNative("make", ["main", "main-debug"], directory);
		assert.equal(build.code, 0, build.stderr);
		const pending = folder.includes("Grocery") ? "Grocery record constructor" : folder.includes("Assembly") ? "Assembly Line loop" : "addVal";
		for (const name of ["main", "main-debug"]) {
			const result = await runNative(join(directory, name), [], directory);
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			assert.ok(result.stdout.includes(`Unfinished learner task: ${pending}`));
		}
	}
	finally {
		await cleanup(directory, runNative);
	}
}

async function cleanup(directory, runNative) {
	const cleaned = await runNative("make", ["clean"], directory);
	assert.equal(cleaned.code, 0, cleaned.stderr);
	for (const name of ["main", "main-debug", "main.dSYM", "main-debug.dSYM"]) assert.equal(existsSync(join(directory, name)), false);
}

export async function verifyDynamicMemoryExport(directory, folder, result, runNative) {
	assert.equal(result.stderr, "");
	assert.doesNotMatch(result.stdout, /Unfinished learner task:/);
	const kind = folder.includes("Variables") ? "LIFETIME" : folder.includes("Assembly") ? "ASSEMBLY" : folder.includes("Grocery") ? "GROCERY" : "ARRAY";
	const expected = {
		LIFETIME: /Verified parser boundaries, repeated scalar\/string cleanup, allocation\/output failures and failed input/,
		ARRAY: /Verified independent copies, allocation-free moves, reuse, bounds, growth and failure cleanup/,
		ASSEMBLY: /Verified parser boundaries, object conversion, scalar\/array failure cleanup and read errors/,
		GROCERY: /Verified Grocery copies, moves, growth, removal, input boundaries and injected cleanup/
	};
	try {
		const build = await runNative("make", ["main", "main-debug"], directory);
		assert.equal(build.code, 0, build.stderr);
		for (const name of ["main", "main-debug"]) {
			const binary = join(directory, name);
			const initial = await runNative(binary, [], directory);
			assert.equal(initial.code, 0, initial.stderr);
			assert.equal(initial.stderr, "");
			if (kind === "ARRAY") {
				const lines = initial.stdout.trimEnd().split("\n");
				assert.deepEqual(lines.filter(line => line.startsWith("Adding ")), Array.from({ length: 81 }, (_, i) => `Adding ${i + 1}`));
				assert.deepEqual(lines.at(-1).trim().split(/\s+/).map(Number), Array.from({ length: 81 }, (_, i) => i + 1));
			}
			if (kind === "LIFETIME") {
				for (const [text, value] of [["5\n", 5], [" -1 \n", -1], ["+0\n", 0], ["42", 42]]) {
					const output = await runNative(binary, [], directory, text);
					assert.equal(output.code, 0, output.stderr);
					assert.equal(output.stderr, "");
					assert.ok(output.stdout.includes(`The value of *p1 is: ${value}\n`));
					assert.match(output.stdout, /p1 is nullptr: true/);
					assert.match(output.stdout, /strPtr is nullptr: true/);
				}
				for (const text of ["\n", "no\n", "5x\n", "5 6\n", "1.5\n", "+-5\n", "99999999999999999999999\n"]) {
					const output = await runNative(binary, [], directory, text);
					assert.equal(output.code, 1);
					assert.equal(output.stderr, "Expected a complete, representable integer.\n");
					assert.doesNotMatch(output.stdout, /The value of/);
				}
			}
			if (kind === "ASSEMBLY") {
				for (const [input, args, count] of [["small crate\n2.205\n!quit\n", [], 1], ["small crate\n-1\nnan\n1x\n4.41\n!quit\n", [], 1], ["small crate\n", [], 0], ["small crate\n!quit\n", [], 0], ["2\nsmall crate\n2.205\nlarge box\n4.41\n", ["--batch"], 2], ["2\nsmall crate\n2.205\n!quit\n", ["--batch"], 0]]) {
					const output = await runNative(binary, args, directory, input);
					assert.equal(output.code, 0, output.stderr);
					assert.equal(output.stderr, "");
					assert.equal(output.stdout.match(/ kilograms\./g)?.length ?? 0, count);
					if (count) assert.match(output.stdout, /small crate/);
				}
			}
			if (kind === "GROCERY") {
				const seed = [["milk", 2], ["cheese", 5]];
				for (const [input, records] of [["", seed], ["add\nwhole milk\n2.5\nprint\n!quit\n", [...seed, ["whole milk", 2.5]]], ["add\n\n whole milk \n-1\nnan\ninf\n1x\n1 2\n1e9999\n0\nprint\n!quit\n", [...seed, ["whole milk", 0]]], ["remove\n1\nprint\n!quit\n", [["cheese", 5]]], ["remove\n2\nprint\n!quit\n", [["milk", 2]]], ["remove\n0\n-1\n1.5\n1x\n99999999999999999999999999\n999\nprint\n!quit\n", seed], ["add words\nunknown\nprint\n!quit\n", seed], ["add\n", seed], ["add\nnew name\n", seed], ["remove\n", seed], ["add\n!quit\n", seed], ["add\nnew\n!quit\n", seed], ["remove\n!quit\n", seed], ["remove\n+1\nprint", [["cheese", 5]]]]) {
					const output = await runNative(binary, [], directory, input);
					assert.equal(output.code, 0, output.stderr);
					assert.equal(output.stderr, "");
					const marker = output.stdout.lastIndexOf("Here are your groceries!");
					assert.ok(marker >= 0);
					const lines = output.stdout.slice(marker).split("\n");
					const names = lines.filter(line => line.startsWith(" Name: ")).map(line => line.slice(7));
					const prices = lines.filter(line => line.startsWith(" Price: ")).map(line => Number(line.slice(8)));
					assert.deepEqual(names.map((name, i) => [name, prices[i]]), records);
				}
				for (const header of ["DynamicArray.h", "GroceryList.h"]) {
					const rebuild = await runNative("make", ["-n", "-W", header, "main"], directory);
					assert.equal(rebuild.code, 0, rebuild.stderr);
					assert.match(rebuild.stdout, /DynamicArray\.cpp GroceryList\.cpp main\.cpp/);
				}
			}
		}
		await writeFile(join(directory, "ownership-check.cpp"), dynamicMemoryNativeCases[kind]);
		for (const diagnostic of [false, true]) {
			const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", ...(diagnostic ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
			const compiled = await runNative("clang++", [...flags, "ownership-check.cpp", "-o", "ownership-check"], directory);
			assert.equal(compiled.code, 0, compiled.stderr);
			const checked = await runNative(join(directory, "ownership-check"), [], directory);
			assert.equal(checked.code, 0, checked.stderr);
			assert.equal(checked.stderr, "");
			assert.match(checked.stdout, expected[kind]);
		}
	}
	finally {
		await cleanup(directory, runNative);
	}
}
