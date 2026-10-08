import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export function completeGraphFile(folder, source, reference) {
	if (!folder.endsWith("/starter")) return source;
	const task = / {8}\/\/ BEGIN TASK:[\s\S]*? {8}\/\/ END TASK/;
	assert.equal((source.match(/\/\/ BEGIN TASK:/g) ?? []).length, 1);
	const begin = reference.indexOf("        using QueueItem =");
	const end = reference.indexOf("        if (distance[static_cast<std::size_t>(goal)] == infinity)", begin);
	assert.ok(begin > 0 && end > begin);
	const body = reference.slice(begin, end).trimEnd();
	const result = source.replace(task, () => `        // BEGIN TASK: priority-queue comparison completed.\n${body}\n        // END TASK`)
		.replace("#include <cstdint>\n", "#include <cstdint>\n#include <functional>\n#include <queue>\n");
	const surrounding = text => text.replace(task, "TASK").replace("#include <functional>\n#include <queue>\n", "");
	assert.equal(surrounding(result), surrounding(source), "Only marked selection and supporting headers change");
	return result;
}

export async function verifyGraphExport(directory, folder, runNative) {
	const oracle = await readFile(new URL("./fixtures/dsa-graph-regressions.cpp", import.meta.url), "utf8");
	const sample = folder.endsWith("/starter") ? "Starter path: 0 2 3 4\n" : "Shortest path: 0 2 3 4\nCost: 7\n";
	try {
		await writeFile(join(directory, "graph-checks.cpp"), oracle);
		for (const diagnostic of [false, true]) {
			const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Wconversion", "-Wsign-conversion", "-Werror", "-g", "-O0", ...(diagnostic ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
			for (const [name, args] of [["graph-sample", ["main.cpp"]], ["graph-checks", [`-DCOURSE_SOURCE=${JSON.stringify(join(directory, "main.cpp"))}`, "graph-checks.cpp"]]]) {
				const built = await runNative("clang++", [...flags, ...args, "-o", name], directory);
				assert.deepEqual(built, { code: 0, stdout: "", stderr: "" });
				const result = await runNative(join(directory, name), [], directory);
				assert.equal(result.code, 0, result.stderr);
				assert.equal(result.stderr, "");
				if (name === "graph-sample") assert.equal(result.stdout, sample);
				else assert.equal(result.stdout, "Graph regressions passed: 14 malformed loads, bad stream, 32 independent graphs, 816 endpoint comparisons, large costs, 256-node chain and zero-cost cycles\n");
			}
		}
	}
	finally {
		for (const name of ["graph-sample", "graph-checks", "graph-checks.cpp"]) await rm(join(directory, name), { force: true });
	}
}

export async function verifyGraphLesson(directory, lessons, runNative) {
	const programs = [...lessons.selection.matchAll(/```cpp\n([\s\S]*?)\n```/g)];
	assert.equal(programs.length, 1);
	try {
		for (const [source, expected] of [[programs[0][1], "current 0 4\ncurrent 1 5\nstale 0 7\n"], [programs[0][1].replace("queue.push({7, 0})", "queue.push({9, 0})"), "current 0 4\ncurrent 1 5\nstale 0 9\n"]]) {
			await writeFile(join(directory, "queue-demo.cpp"), `${source}\n`);
			for (const diagnostic of [false, true]) {
				const built = await runNative("clang++", ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", ...(diagnostic ? ["-g", "-O0", "-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : []), "queue-demo.cpp", "-o", "queue-demo"], directory);
				assert.deepEqual(built, { code: 0, stdout: "", stderr: "" });
				assert.deepEqual(await runNative(join(directory, "queue-demo"), [], directory), { code: 0, stdout: expected, stderr: "" });
			}
		}
	}
	finally {
		for (const name of ["queue-demo", "queue-demo.cpp"]) await rm(join(directory, name), { force: true });
	}
}
