import assert from "node:assert/strict";
import { link, lstat, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

function body(source, name) {
	const match = new RegExp(`\\b${name}\\([^;]*?\\)\\s*\\{`).exec(source);
	assert.ok(match, name);
	const start = match.index + match[0].length;
	let depth = 1;
	let end = start;
	for (; depth && end < source.length; end++) {
		if (source[end] === "{") depth++;
		if (source[end] === "}") depth--;
	}
	assert.equal(depth, 0);
	return { start, end: end - 1, text: source.slice(start, end - 1) };
}

export function completeFileProcessorFile(folder, source, referenceFiles) {
	if (!folder.endsWith("/starter")) return source;
	assert.equal((source.match(/\/\/ TODO:/g) ?? []).length, 4);
	const reference = referenceFiles?.["main.cpp"];
	assert.ok(reference);
	for (const name of ["parseScoreRow", "readScores", "writeReport", "processFile"]) {
		const target = body(source, name);
		source = source.slice(0, target.start) + body(reference, name).text + source.slice(target.end);
	}
	assert.equal(source, reference, "Only the four task bodies differ from the published reference");
	return source;
}

async function build(directory, sanitized, runNative) {
	const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Wconversion", "-Wsign-conversion", "-Werror", ...(sanitized ? ["-g", "-O0", "-fsanitize=address,undefined", "-fno-sanitize-recover=all", ...(process.platform === "linux" ? ["-fno-pie", "-no-pie"] : [])] : [])];
	const result = await runNative("clang++", [...flags, "main.cpp", "-o", "file-processor-native"], directory);
	assert.deepEqual(result, { code: 0, stdout: "", stderr: "" });
	return join(directory, "file-processor-native");
}

async function absent(path) {
	await assert.rejects(lstat(path), { code: "ENOENT" });
}

export async function verifyFileProcessorDefaultExport(directory, runNative) {
	const previous = "Earlier accepted report\n";
	const sample = await readFile(join(directory, "scores.tsv"));
	try {
		const binary = await build(directory, false, runNative);
		await writeFile(join(directory, "report.tsv"), previous);
		assert.deepEqual(await runNative(binary, [], directory), { code: 1, stdout: "", stderr: "Processing stopped: Unfinished task: processFile.\n" });
		assert.equal(await readFile(join(directory, "report.tsv"), "utf8"), previous);
		assert.deepEqual(await readFile(join(directory, "scores.tsv")), sample);
		await absent(join(directory, "report.tsv.stage"));
	}
	finally {
		await rm(join(directory, "file-processor-native"), { force: true });
		await rm(join(directory, "report.tsv"), { force: true });
	}
}

// Expected reports are built from fixture rows, independently of the C++ parser.
function report(rows) {
	return `CPPI4_REPORT_V1\n${rows.map(([name, score]) => `${name}\t${score}\t${score >= 60 ? "pass" : "review"}\n`).join("")}TOTAL\t${rows.length}\t${rows.reduce((total, row) => total + row[1], 0)}\n`;
}

export async function verifyFileProcessorExport(directory, _folder, runNative) {
	const work = await mkdtemp(join(directory, "file-processor-cases-"));
	const header = "CPPI4_SCORES_V1";
	const accepted = [
		{ text: `${header}\nAda\t84\nLin\t59\n`, rows: [["Ada", 84], ["Lin", 59]] },
		{ text: header, rows: [] },
		{ text: `${header}\nA\t0\nB\t59\nC\t60\nD\t100\n`, rows: [["A", 0], ["B", 59], ["C", 60], ["D", 100]] },
		{ text: `${header}\r\nsame\t00060\r\nsame\t0\r\n`, rows: [["same", 60], ["same", 0]] },
		{ text: `${header}\n X \t00084`, rows: [[" X ", 84]] },
		{ text: `${header}\n${"A".repeat(40)}\t${"0".repeat(84)}100\n`, rows: [["A".repeat(40), 100]] },
		{ text: `${header}\n${"A\t100\n".repeat(100)}`, rows: Array.from({ length: 100 }, () => ["A", 100]) },
		{ text: `${header}\r\nLast\t000\r\n`, rows: [["Last", 0]] }
	];
	const rejected = ["", "WRONG\n", `${header}\n\n`, `${header}\nA\t60\nB\tbad\n`, `${header}\nA\t60\textra\n`, `${header}\n\t60\n`, `${header}\n   \t60\n`, `${header}\n${"X".repeat(41)}\t60\n`, `${header}\nA\0B\t60\n`, `${header}\nA\u007FB\t60\n`, `${header}\nA\t\n`, `${header}\nA\t+60\n`, `${header}\nA\t-1\n`, `${header}\nA\t60.0\n`, `${header}\nA\t 60\n`, `${header}\nA\t60 \n`, `${header}\nA\t60x\n`, `${header}\nA\t101\n`, `${header}\nA\t999999999999999999999\n`, `${header}\nA\t60\rX\n`, `${header}\n${"A\t60\n".repeat(101)}`, `${header}\n${"A".repeat(40)}\t${"0".repeat(85)}100\n`, `${header}\n${"A".repeat(40)}\t${"0".repeat(84)}100\r\n`, `${header}\n${"A\t60\n".repeat(4000)}`];
	const previous = "Previous report remains byte-for-byte\n";
	try {
		for (const sanitized of [false, true]) {
			const binary = await build(directory, sanitized, runNative);
			const input = join(work, "input.tsv");
			const output = join(work, "output.tsv");
			for (const [index, test] of accepted.entries()) {
				await writeFile(input, test.text);
				if (index === 0) await rm(output, { force: true });
				else await writeFile(output, previous);
				assert.deepEqual(await runNative(binary, [input, output], work), { code: 0, stdout: `Published ${test.rows.length} records; total ${test.rows.reduce((sum, row) => sum + row[1], 0)}.\n`, stderr: "" });
				assert.equal(await readFile(output, "utf8"), report(test.rows));
				assert.equal(await readFile(input, "utf8"), test.text);
				await absent(`${output}.stage`);
			}
			for (const text of rejected) {
				await writeFile(input, text);
				await writeFile(output, previous);
				const result = await runNative(binary, [input, output], work);
				assert.equal(result.code, 1, result.stderr);
				assert.equal(result.stdout, "");
				assert.match(result.stderr, /^Processing stopped: .+\n$/);
				assert.equal(await readFile(output, "utf8"), previous);
				assert.equal(await readFile(input, "utf8"), text);
				await absent(`${output}.stage`);
			}
			await writeFile(input, accepted[0].text);
			await writeFile(output, previous);
			assert.deepEqual(await runNative(binary, ["extra"], work), { code: 2, stdout: "", stderr: "Usage: project [INPUT OUTPUT]\n" });
			for (const [inputPath, outputPath] of [[join(work, "missing.tsv"), output], [input, join(work, "missing-parent", "report.tsv")], [input, input]]) {
				const result = await runNative(binary, [inputPath, outputPath], work);
				assert.equal(result.code, 1, result.stderr);
				assert.equal(result.stdout, "");
				assert.match(result.stderr, /^Processing stopped: .+\n$/);
				assert.equal(await readFile(input, "utf8"), accepted[0].text);
				assert.equal(await readFile(output, "utf8"), previous);
				await absent(`${outputPath}.stage`);
			}
			const alias = join(work, "alias.tsv");
			await link(input, alias);
			assert.equal((await runNative(binary, [input, alias], work)).code, 1);
			assert.equal(await readFile(alias, "utf8"), accepted[0].text);
			await rm(alias);
			await symlink(output, alias);
			assert.equal((await runNative(binary, [input, alias], work)).code, 1);
			assert.equal((await lstat(alias)).isSymbolicLink(), true);
			assert.equal(await readFile(output, "utf8"), previous);
			await rm(alias);
			const stage = `${output}.stage`;
			for (const kind of ["file", "directory", "symlink"]) {
				if (kind === "file") {
					await writeFile(stage, "Foreign collision\n");
				}
				else if (kind === "directory") {
					await mkdir(stage);
					await writeFile(join(stage, "foreign.txt"), "Foreign collision\n");
				}
				else {
					await symlink(join(work, "not-created"), stage);
				}
				const result = await runNative(binary, [input, output], work);
				assert.equal(result.code, 1, result.stderr);
				assert.equal(result.stdout, "");
				assert.match(result.stderr, /Cannot acquire output staging directory/);
				assert.equal(await readFile(output, "utf8"), previous);
				assert.equal(await readFile(input, "utf8"), accepted[0].text);
				if (kind === "symlink") assert.equal((await lstat(stage)).isSymbolicLink(), true);
				else assert.equal(await readFile(kind === "file" ? stage : join(stage, "foreign.txt"), "utf8"), "Foreign collision\n");
				await rm(stage, { recursive: kind === "directory" });
			}
		}
	}
	finally {
		await rm(join(directory, "file-processor-native"), { force: true });
		await rm(work, { recursive: true, force: true });
	}
}

export async function verifyResourceLessonPrograms(directory, lessons, runNative) {
	const expected = {
		ownership: "84 91 76\nfirst empty: true\n84 91 76\n84 91 76\n",
		errors: "Accepted: 84 91 76\n"
	};
	try {
		for (const name of ["ownership", "errors"]) {
			const programs = [...lessons[name].matchAll(/```cpp\n([\s\S]*?)\n```/g)];
			assert.equal(programs.length, 1);
			const code = `${programs[0][1]}\n`;
			for (const sanitized of [false, true]) {
				await writeFile(join(directory, "main.cpp"), code);
				const binary = await build(directory, sanitized, runNative);
				assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: expected[name], stderr: "" });
				if (name === "errors") {
					assert.deepEqual(await runNative(binary, ["reject"], directory), { code: 1, stdout: "Accepted: 84\n", stderr: "Rejected: Score outside 0 through 100.\n" });
					assert.deepEqual(await runNative(binary, ["other"], directory), { code: 2, stdout: "", stderr: "Usage: boundary [reject]\n" });
					const direct = code.replace("auto candidate = accepted;", "auto& candidate = accepted;").replace("    accepted.swap(candidate);\n", "");
					assert.notEqual(direct, code);
					await writeFile(join(directory, "main.cpp"), direct);
					await build(directory, sanitized, runNative);
					assert.deepEqual(await runNative(binary, ["reject"], directory), { code: 1, stdout: "Accepted: 84 91\n", stderr: "Rejected: Score outside 0 through 100.\n" });
				}
				else {
					const changed = code.replace("first[0] = 84;", "first[0] = 0;").replace("first[1] = 91;", "first[1] = 60;").replace("first[2] = 76;", "first[2] = 100;").replace("scores{84, 91, 76}", "scores{0, 60, 100}");
					assert.notEqual(changed, code);
					await writeFile(join(directory, "main.cpp"), changed);
					await build(directory, sanitized, runNative);
					assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: "0 60 100\nfirst empty: true\n0 60 100\n0 60 100\n", stderr: "" });
				}
			}
		}
	}
	finally {
		await rm(join(directory, "file-processor-native"), { force: true });
		await rm(join(directory, "main.cpp"), { force: true });
	}
}
