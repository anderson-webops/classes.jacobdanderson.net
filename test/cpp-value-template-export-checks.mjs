import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const comparison = "friend bool operator<(const Score& left, const Score& right) {\n        return left.value < right.value;\n    }";
const flags = sanitized => ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Wconversion", "-Wsign-conversion", "-Werror", ...(sanitized ? ["-g", "-O0", "-fsanitize=address,undefined", "-fno-sanitize-recover=all", ...(process.platform === "linux" ? ["-fno-pie", "-no-pie"] : [])] : [])];
async function compile(directory, sanitized, runNative, name = "main.cpp", extra = []) {
	const binary = join(directory, "value-template-native");
	assert.deepEqual(await runNative("clang++", [...flags(sanitized), ...extra, name, "-o", binary], directory), { code: 0, stdout: "", stderr: "" });
	return binary;
}
export function completeValueTemplateFile(folder, source, references) {
	if (!folder.endsWith("/starter")) return source;
	const reference = references?.["main.cpp"];
	assert.ok(reference);
	if (folder.startsWith("CPPI5-Fraction-Toolkit/")) {
		for (const name of ["constructFraction", "compareFraction", "addFraction", "multiplyFraction", "chooseSmaller"]) {
			const expression = new RegExp(`(// TODO BEGIN ${name}\\n)([\\s\\S]*?)([ \t]*// TODO END ${name})`);
			const target = expression.exec(source);
			const answer = expression.exec(reference);
			assert.ok(target && answer, name);
			source = source.slice(0, target.index) + target[1] + answer[2] + target[3] + source.slice(target.index + target[0].length);
		}
	}
	else {
		assert.ok(source.includes("// TODO: Add the conventional ordering operation after reading the diagnostic."));
		source = source.replace("// TODO: Add the conventional ordering operation after reading the diagnostic.", comparison);
	}
	assert.equal(source, reference, "Only the five Fraction bodies or one Score comparison differ");
	return source;
}
export async function verifyValueTemplateDefaultExport(directory, folder, runNative) {
	try {
		for (const sanitized of [false, true]) {
			const binary = await compile(directory, sanitized, runNative);
			const result = await runNative(binary, [], directory);
			assert.deepEqual(result, folder.startsWith("CPPI5-Fraction-Toolkit/") ? { code: 1, stdout: "", stderr: "Rejected: Unfinished task: constructFraction.\n" } : { code: 0, stdout: "number 3\ntext apple\n", stderr: "" });
		}
		if (folder.startsWith("CPPI5-Template-")) {
			const result = await runNative("clang++", [...flags(false), "-DCPPI5_TRIGGER_TEMPLATE_ERROR", "main.cpp", "-o", "controlled-failure"], directory);
			assert.notEqual(result.code, 0);
			assert.match(result.stderr, /Score/);
			assert.match(result.stderr, /chooseSmaller/);
			assert.match(result.stderr, /invalid operands|no match|operator</);
		}
	}
	finally {
		await rm(join(directory, "value-template-native"), { force: true });
		await rm(join(directory, "controlled-failure"), { force: true });
	}
}
function gcd(left, right) {
	while (right !== 0n) [left, right] = [right, left % right];
	return left < 0n ? -left : left;
}
function reduced(n, d) {
	if (d < 0n) [n, d] = [-n, -d];
	const factor = gcd(n, d);
	return [n / factor, d / factor];
}
const text = ([n, d]) => `${n}/${d}`;
const less = ([a, b], [c, d]) => a * d < c * b;
function fractionOutput(tokens) {
	const [left, right] = tokens.map(token => reduced(...token.split("/").map(BigInt)));
	const [a, b] = left;
	const [c, d] = right;
	const sum = reduced(a * d + c * b, b * d);
	const product = reduced(a * c, b * d);
	const sorted = [left, right, [0n, 1n]].sort((x, y) => less(x, y) ? -1 : less(y, x) ? 1 : 0);
	return `LEFT ${text(left)}\nRIGHT ${text(right)}\nLESS ${less(left, right)}\nSUM ${text(sum)}\nPRODUCT ${text(product)}\nSMALLER ${text(less(right, left) ? right : left)}\nSORTED ${sorted.map(text).join(" ")}\n`;
}
export async function verifyValueTemplateExport(directory, folder, runNative) {
	try {
		for (const sanitized of [false, true]) {
			const binary = await compile(directory, sanitized, runNative);
			if (folder.startsWith("CPPI5-Fraction-Toolkit/")) {
				const accepted = [["1/2", "2/3"], ["-1/-2", "2/-3"], ["0/-4", "0003/0009"], ["4/8", "1/2"], ["-8/3", "-1/7"]];
				for (let index = 0; index < 24; index++) accepted.push([`${index * 11 - 100}/${index % 17 + 1}`, `${80 - index * 7}/${index % 13 + 1}`]);
				assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: fractionOutput(accepted[0]), stderr: "" });
				for (const tokens of accepted) assert.deepEqual(await runNative(binary, tokens, directory), { code: 0, stdout: fractionOutput(tokens), stderr: "" });
				for (const tokens of [["1/0", "1/2"], ["1000001/1", "1/2"], ["999999/1000000", "1/1000000"], ["1000000/1", "-1000000/1"], ["+1/2", "1/2"], ["1/2x", "1/2"]]) {
					const result = await runNative(binary, tokens, directory);
					assert.equal(result.code, 1);
					assert.equal(result.stdout, "");
					assert.match(result.stderr, /^Rejected: .+\n$/);
				}
				assert.deepEqual(await runNative(binary, ["1/2"], directory), { code: 2, stdout: "", stderr: "Usage: main [LEFT_FRACTION RIGHT_FRACTION]\n" });
			}
			else {
				assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: "number 3\ntext apple\n", stderr: "" });
				assert.deepEqual(await runNative(binary, ["extra"], directory), { code: 2, stdout: "", stderr: "Usage: main\n" });
				const enabled = await compile(directory, sanitized, runNative, "main.cpp", ["-DCPPI5_TRIGGER_TEMPLATE_ERROR"]);
				assert.deepEqual(await runNative(enabled, [], directory), { code: 0, stdout: "score 59\n", stderr: "" });
				const original = await readFile(join(directory, "main.cpp"), "utf8");
				for (const [left, right] of [[0, 100], [91, 76], [84, 84]]) {
					const changed = original.replace("Score{84}, Score{59}", `Score{${left}}, Score{${right}}`);
					assert.notEqual(changed, original);
					await writeFile(join(directory, "changed.cpp"), changed);
					const changedBinary = await compile(directory, sanitized, runNative, "changed.cpp", ["-DCPPI5_TRIGGER_TEMPLATE_ERROR"]);
					assert.deepEqual(await runNative(changedBinary, [], directory), { code: 0, stdout: `score ${Math.min(left, right)}\n`, stderr: "" });
				}
			}
		}
	}
	finally {
		await rm(join(directory, "value-template-native"), { force: true });
		await rm(join(directory, "changed.cpp"), { force: true });
	}
}
export async function verifyValueTemplateLessons(directory, lessons, runNative) {
	const programs = Object.fromEntries(["values", "templates"].map(key => [key, [...lessons[key].matchAll(/```cpp\n([\s\S]*?)\n```/g)].map(match => `${match[1]}\n`)]));
	assert.equal(programs.values.length, 1);
	assert.equal(programs.templates.length, 2);
	const cases = [
		["value-lesson", programs.values[0], "original 84\ncopy 91\noperator 91\nless true\nrejected true\npreserved true\n", source => source.replace("original(84)", "original(59)").replaceAll("raisedBy(7)", "raisedBy(1)").replace("original + 7", "original + 1"), "original 59\ncopy 60\noperator 60\nless true\nrejected true\npreserved true\n"],
		["template-lesson", programs.templates[0], "number 3\ntext apple\nreading 59\ntie left\n", source => source.replace("chooseSmaller(7, 3)", "chooseSmaller(-4, 6)").replace("std::string(\"pear\"), std::string(\"apple\")", "std::string(\"z\"), std::string(\"aa\")").replace("Reading{84, \"high\"}, Reading{59, \"low\"}", "Reading{0, \"high\"}, Reading{100, \"low\"}").replace("Reading{59, \"left\"}, Reading{59, \"right\"}", "Reading{59, \"right\"}, Reading{59, \"left\"}"), "number -4\ntext aa\nreading 0\ntie right\n"],
		["box-lesson", programs.templates[1], "original 7\ncopy 9\nborrowed station\nretained station\n", source => source.replace("original(7)", "original(-4)").replace("ValueBox<int>(9)", "ValueBox<int>(12)").replace("std::string(\"station\")", "std::string(\"lab\")"), "original -4\ncopy 12\nborrowed lab\nretained lab\n"]
	];
	try {
		for (const [name, source, expected, change, changedOutput] of cases) {
			for (const sanitized of [false, true]) {
				await writeFile(join(directory, "main.cpp"), source);
				let binary = await compile(directory, sanitized, runNative);
				assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: expected, stderr: "" });
				assert.deepEqual(await runNative(binary, ["extra"], directory), { code: 2, stdout: "", stderr: `Usage: ${name}\n` });
				assert.notEqual(change(source), source);
				await writeFile(join(directory, "main.cpp"), change(source));
				binary = await compile(directory, sanitized, runNative);
				assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: changedOutput, stderr: "" });
			}
		}
	}
	finally {
		await rm(join(directory, "value-template-native"), { force: true });
		await rm(join(directory, "main.cpp"), { force: true });
	}
}
