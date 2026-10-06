import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { twoDimensionalNativeCases } from "./fixtures/cpp-two-dimensional-native-cases.mjs";

const taskNames = {
	"CPPM3-2D-Array-Practice-Starter": ["sumArray", "minArray", "multTable", "averageArray"],
	"CPPM3-Bank-Transactions-Starter": ["initializeLedger", "recordTransaction", "print"],
	"CPPM3-2D-Array-Extension-Starter": ["checkedCell", "columnAverages"]
};

export function completeTwoDimensionalAttempt(folder, source, reference) {
	if (!folder.endsWith("-Starter")) return source;
	assert.ok(taskNames[folder], `Known CPPM3 learner ${folder}`);
	assert.equal(typeof reference, "string", "Independently hashed reference is available");
	for (const name of taskNames[folder]) {
		const pattern = new RegExp(`// TASK ${name}\\n[\\s\\S]*?\\n// END TASK ${name}`, "g");
		assert.equal(reference.match(pattern)?.length, 1, `One reference task ${name}`);
		assert.equal(source.match(pattern)?.length, 1, `One learner task ${name}`);
		source = source.replace(pattern, () => reference.match(pattern)[0]);
	}
	return source;
}

export async function verifyTwoDimensionalExport(directory, folder, result, runNative) {
	assert.doesNotMatch(result.stdout, /Learner task:/);
	const check = async (name, cases, expected, code = 0) => {
		await writeFile(join(directory, `${name}.cpp`), `#define main providedMain\n#include "main.cpp"\n${cases}`);
		const compiled = await runNative("c++", ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", "-fsanitize=address,undefined", "-fno-sanitize-recover=all", `${name}.cpp`, "-o", name], directory);
		assert.equal(compiled.code, 0, compiled.stderr);
		const checked = await runNative(join(directory, name), [], directory);
		assert.equal(checked.code, code, checked.stderr);
		if (code === 0) assert.equal(checked.stderr, "");
		assert.match(code === 0 ? checked.stdout : checked.stderr, expected);
	};
	try {
		const build = await runNative("make", ["main", "main-debug"], directory);
		assert.equal(build.code, 0, build.stderr);
		for (const name of ["main", "main-debug"]) {
			assert.deepEqual(await runNative(join(directory, name), [], directory), { code: 0, stdout: result.stdout, stderr: "" });
		}
		if (folder === "CPPM3-Two-Dimensional-Arrays-Reference") {
			const rows = Array.from({ length: 10 }, (_, row) => `${Array.from({ length: 10 }, (_, column) => `${row + column}\t`).join("")}\n`).join("");
			assert.equal(result.stdout, `Number of rows: 10\nNumber of cols: 10\nNumber of elements: 100\nExample value from arr2: 5\n42\n${rows}Nested rows through a typed function boundary:\n1 2 3 \n4 5 6 \n7 8 9 \nA real flat rectangular grid:\n1 2 3 \n4 5 6 \n`);
		}
		else if (folder === "CPPM3-2D-Array-Practice-Starter") {
			assert.match(result.stdout, /Sum: 36\nMin: 0\n/);
			assert.match(result.stdout, /Row averages: 2 5 5 /);
			await check("grid-check", twoDimensionalNativeCases.GRID_CASES, /1614 rectangular grids, 13 integer boundaries, fractional averages and input preservation/);
			await check("allocation-check", twoDimensionalNativeCases.ALLOCATION_CASES, /five table allocation failures, average allocation failure, and driver cleanup/);
		}
		else if (folder === "CPPM3-2D-Array-Extension-Starter") {
			assert.equal(result.stdout, "Cell (1, 2): 10\nColumn averages: 3 2 9 \n");
			await check("extension-check", twoDimensionalNativeCases.EXTENSION_CASES, /1614 extension rectangles, 9273 valid coordinates, rejected boundaries and preserved inputs/);
			await check("extension-allocation-check", twoDimensionalNativeCases.EXTENSION_ALLOCATION_CASES, /column-result allocation failure and extension driver cleanup/);
		}
		else {
			assert.equal(folder, "CPPM3-Bank-Transactions-Starter");
			await check("ledger-check", twoDimensionalNativeCases.BANK_CASES, /3861 calendar cases/);
			await check("read-error-check", "\n#undef main\nint main() { std::cin.setstate(std::ios::badbit); return providedMain(); }\n", /Input could not be read/, 1);
			const fixture = ["Pat Example", "100", "01012025", "01022025", "20", "01032025", "-30", "01042025", "0"];
			for (const name of ["main", "main-debug"]) {
				const input = async (lines) => {
					const output = await runNative(join(directory, name), [], directory, lines.join("\n") + (lines.length ? "\n" : ""));
					assert.equal(output.code, 0, output.stderr);
					assert.equal(output.stderr, "");
					return output.stdout;
				};
				const full = await input(fixture);
				assert.match(full, /Hi Pat Example,/);
				assert.equal(full.match(/TRANSACTION NO:/g)?.length, 4);
				assert.equal(full.match(/ENDING BALANCE: 90/g)?.length, 2);
				assert.doesNotMatch(full, /Input ended;/);
				for (let prefix = 0; prefix < fixture.length; ++prefix) {
					const partial = await input(fixture.slice(0, prefix));
					assert.equal(partial.match(/Input ended;/g)?.length, 1);
					assert.equal(partial.match(/TRANSACTION NO:/g)?.length ?? 0, prefix < 3 ? 0 : 1 + Math.floor((prefix - 3) / 2));
				}
				const rejected = await input(["", "Pat Example", "2.5", "7 8", "2147483648", "100", "02292025", "04312025", "01012025", ...fixture.slice(3)]);
				assert.equal(rejected.match(/Enter one whole number/g)?.length, 3);
				assert.equal(rejected.match(/Enter a valid eight-digit date/g)?.length, 2);
				assert.equal(rejected.match(/TRANSACTION NO:/g)?.length, 4);
				for (const [start, rejectedAmount, accepted] of [["2147483647", "1", "-1"], ["-2147483648", "-1", "1"]]) {
					const output = await input(["Pat Example", start, "01012025", "01022025", rejectedAmount, accepted, "01032025", "0", "01042025", "0"]);
					assert.equal(output.match(/would exceed the int balance range/g)?.length, 1);
					assert.equal(output.match(/TRANSACTION NO:/g)?.length, 4);
					assert.ok(output.includes(` AMOUNT: ${accepted}\n`));
				}
			}
		}
	}
	finally {
		const cleaned = await runNative("make", ["clean"], directory);
		assert.equal(cleaned.code, 0, cleaned.stderr);
		assert.equal(existsSync(join(directory, "main")), false);
		assert.equal(existsSync(join(directory, "main-debug")), false);
		assert.equal(existsSync(join(directory, "main.dSYM")), false);
		assert.equal(existsSync(join(directory, "main-debug.dSYM")), false);
	}
}
