import assert from "node:assert/strict";
import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { mazeSearchOracle } from "./fixtures/cpp-maze-search-packs.mjs";

export function completeMazeSearchFile(folder, name, source, referenceFiles) {
	if (!folder.endsWith("/starter") || name !== "maze_search.cpp") return source;
	assert.match(source, /UNFINISHED/);
	assert.equal((source.match(/\/\/ TODO:/g) ?? []).length, 1);
	assert.ok(referenceFiles?.[name]);
	// Only the search TODO is completed through the learner's editor.
	return referenceFiles[name];
}

async function build(directory, diagnostic, runNative, driver = "main.cpp") {
	const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Wconversion", "-Wsign-conversion", "-Werror", "-g", "-O0", ...(diagnostic ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
	const result = await runNative("clang++", [...flags, "-I.", driver, "maze.cpp", "maze_search.cpp", "-o", "maze-search-native"], directory);
	assert.equal(result.code, 0, result.stderr);
	assert.equal(result.stderr, "");
}

export async function verifyMazeSearchDefaultExport(directory, runNative) {
	try {
		await build(directory, false, runNative);
		assert.deepEqual(await runNative(join(directory, "maze-search-native"), [], directory, "1 2\nSE\n"), { code: 3, stdout: "", stderr: "Error: UNFINISHED: implement recursive search.\n" });
	}
	finally {
		await rm(join(directory, "maze-search-native"), { force: true });
	}
}

function checkSearch(stdout, rows) {
	const position = tile => rows.flatMap((row, r) => [...row].flatMap((value, c) => value === tile ? [[r, c]] : []))[0];
	const start = position("S");
	const exit = position("E");
	const label = ([r, c]) => `${r},${c}`;
	const passable = ([r, c]) => r >= 0 && r < rows.length && c >= 0 && c < rows[0].length && rows[r][c] !== "#";
	// Breadth-first reachability checks the recursive export independently.
	const queue = [start];
	const reached = new Set([label(start)]);
	for (let head = 0; head < queue.length; head++) {
		const [r, c] = queue[head];
		for (const cell of [[r + 1, c], [r, c - 1], [r - 1, c], [r, c + 1]]) {
			if (passable(cell) && !reached.has(label(cell))) {
				reached.add(label(cell));
				queue.push(cell);
			}
		}
	}
	const lines = stdout.trimEnd().split("\n");
	const stack = [];
	const entered = new Set();
	while (/^(?:Enter|Backtrack) /.test(lines[0] ?? "")) {
		const match = /^(Enter|Backtrack) (\d+) (\d+)$/.exec(lines.shift());
		assert.ok(match);
		const cell = [Number(match[2]), Number(match[3])];
		assert.ok(passable(cell));
		if (match[1] === "Enter") {
			assert.ok(!entered.has(label(cell)), "A cell is entered once per search");
			if (stack.length) assert.equal(Math.abs(cell[0] - stack.at(-1)[0]) + Math.abs(cell[1] - stack.at(-1)[1]), 1);
			else assert.deepEqual(cell, start);
			entered.add(label(cell));
			stack.push(cell);
		}
		else assert.deepEqual(stack.pop(), cell, "Backtracking unwinds the active frame");
	}
	assert.ok(entered.size > 0 && entered.size <= rows.length * rows[0].length);
	if (!reached.has(label(exit))) {
		assert.deepEqual(lines, ["No path"]);
		assert.deepEqual(stack, []);
		assert.deepEqual(entered, reached, "A failed search explores the entire reachable region");
		return;
	}
	const header = /^Path (\d+)$/.exec(lines.shift());
	assert.ok(header);
	const path = lines.map(line => {
		assert.match(line, /^\d+ \d+$/);
		return line.split(" ").map(Number);
	});
	assert.equal(path.length, Number(header[1]));
	assert.deepEqual(path[0], start);
	assert.deepEqual(path.at(-1), exit);
	assert.equal(new Set(path.map(label)).size, path.length);
	assert.deepEqual(stack, path, "The successful frames are the returned path");
}

export async function verifyMazeSearchExport(directory, runNative) {
	const binary = join(directory, "maze-search-native");
	try {
		for (const diagnostic of [false, true]) {
			await build(directory, diagnostic, runNative);
			assert.deepEqual(await runNative(binary, ["--trace"], directory, "1 2\nSE\n"), { code: 0, stdout: "Enter 0 0\nEnter 0 1\nPath 2\n0 0\n0 1\n", stderr: "" });
			for (const input of ["", "0 2\nSE\n", "1 2\nSS\n", "1 2\nSE\n\n", "2 3\nS#E\n..\n", "1 2\nS?\n", "x".repeat(16385)]) {
				const result = await runNative(binary, [], directory, input);
				assert.equal(result.code, 2);
				assert.equal(result.stdout, "");
				assert.match(result.stderr, /^Error: .+\n$/);
			}
			const cases = [["S#E"], ["S#E", "..."], ["S..", ".#E", "..."], ["S.#", ".#E"], ["S...", "...E"], ["S", ".", "E"]];
			let seed = 20261007;
			const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
			for (let i = 0; i < 20; i++) {
				const rows = Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => random() < 0.35 ? "#" : "."));
				rows[0][0] = "S";
				rows[5][6] = "E";
				cases.push(rows.map(row => row.join("")));
			}
			for (const rows of cases) {
				const input = `${rows.length} ${rows[0].length}\r\n${rows.join("\r\n")}`;
				const result = await runNative(binary, ["--trace"], directory, input);
				assert.equal(result.code, 0, result.stderr);
				assert.equal(result.stderr, "");
				checkSearch(result.stdout, rows);
			}
			await writeFile(join(directory, "maze-oracle.cpp"), mazeSearchOracle);
			await build(directory, diagnostic, runNative, "maze-oracle.cpp");
			assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: "", stderr: "" });
		}
	}
	finally {
		for (const name of ["maze-search-native", "maze-oracle.cpp"]) await rm(join(directory, name), { force: true });
	}
}
