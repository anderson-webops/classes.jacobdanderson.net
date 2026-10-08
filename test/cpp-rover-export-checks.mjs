import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const primary = folder => folder.startsWith("CPPI6-Saveable-");
const flags = sanitized => ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Wconversion", "-Wsign-conversion", "-Werror", ...(sanitized ? ["-g", "-O0", "-fsanitize=address,undefined", "-fno-sanitize-recover=all", ...(process.platform === "linux" ? ["-fno-pie", "-no-pie"] : [])] : [])];
export function completeRoverFile(folder, name, source, references) {
	if (!folder.endsWith("/starter")) return source;
	const reference = references?.[name];
	assert.ok(reference, name);
	const openings = [...source.matchAll(/^([ \t]*)\/\/ BEGIN TASK (\w+)$/gm)];
	for (const match of openings) {
		const begin = `${match[0]}\n`;
		const end = `${match[1]}// END TASK ${match[2]}\n`;
		const start = source.indexOf(begin);
		const stop = source.indexOf(end, start) + end.length;
		const referenceStart = reference.indexOf(begin);
		const referenceStop = reference.indexOf(end, referenceStart) + end.length;
		assert.ok(start >= 0 && referenceStart >= 0 && stop > start && referenceStop > referenceStart, match[2]);
		source = source.slice(0, start) + reference.slice(referenceStart, referenceStop) + source.slice(stop);
	}
	assert.equal(source, reference, "Only the marked task bodies may differ from the reference");
	return source;
}
async function compile(directory, folder, sanitized, runNative, driver = "main.cpp") {
	const sources = primary(folder) ? ["rover.cpp", "command.cpp", "storage.cpp"] : ["state_review.cpp"];
	const binary = join(directory, "rover-native");
	assert.deepEqual(await runNative("clang++", [...flags(sanitized), "-I.", driver, ...sources, "-o", binary], directory), { code: 0, stdout: "", stderr: "" });
	return binary;
}
export async function verifyRoverDefaultExport(directory, folder, runNative) {
	try {
		for (const sanitized of [false, true]) {
			const binary = await compile(directory, folder, sanitized, runNative);
			assert.deepEqual(await runNative(binary, [], directory, "start\n"), primary(folder) ? { code: 0, stdout: "", stderr: "Rejected: Unfinished command parser.\n" } : { code: 1, stdout: "", stderr: "Failed: Unfinished state factory.\n" });
		}
	}
	finally {
		await rm(join(directory, "rover-native"), { force: true });
	}
}
const initialGraph = { dock: [], entry: ["lab"], lab: ["dock"] };
function encode(graph, phase = "running", position = "entry", moves = 0) {
	const edges = Object.entries(graph).flatMap(([from, to]) => to.map(target => `${from} ${target}`)).sort();
	return `ROVER 1\nphase ${phase}\nposition ${position}\nmoves ${moves}\nzones ${Object.keys(graph).length}\n${Object.keys(graph).sort().map(name => `${name}\n`).join("")}edges ${edges.length}\n${edges.map(edge => `${edge}\n`).join("")}end\n`;
}
function reachable(graph, target) {
	const queue = ["entry"];
	const seen = new Set(queue);
	for (const here of queue) {
		if (here === target) return true;
		for (const next of graph[here]) {
			if (!seen.has(next)) {
				seen.add(next);
				queue.push(next);
			}
		}
	}
	return false;
}
const table = new Map([["ready,start", "running"], ["running,pause", "paused"], ["paused,resume", "running"], ["running,finish", "finished"], ["paused,finish", "finished"]]);
function stateOutput(events) {
	let phase = "ready";
	return `${events.map((event) => {
		const next = table.get(`${phase},${event}`);
		if (next) phase = next;
		return `${event} ${next ? "accepted" : "rejected"} enum ${phase} poly ${phase}\n`;
	}).join("")}lifetime balanced true\n`;
}
export async function verifyRoverExport(directory, folder, runNative) {
	try {
		for (const sanitized of [false, true]) {
			const binary = await compile(directory, folder, sanitized, runNative);
			if (primary(folder)) {
				const before = "phase ready position entry moves 0\ndock:\nentry: lab\nlab: dock\n";
				const running = "phase running position lab moves 1\ndock:\nentry: lab\nlab: dock\n";
				assert.deepEqual(await runNative(binary, [], directory, "show\nroute dock\nstart\nmove lab\npause\nmove dock\nresume\nmove dock\nfinish\nshow\nquit\nshow\n"), { code: 0, stdout: `${before}route entry -> lab -> dock\nphase running\nposition lab moves 1\nphase paused\nphase running\nposition dock moves 2\nphase finished\nphase finished position dock moves 2\ndock:\nentry: lab\nlab: dock\n`, stderr: "Rejected: Move requires running phase.\n" });
				assert.deepEqual(await runNative(binary, [], directory, "start\nmove lab\nsave \"restart state.txt\"\nquit\n"), { code: 0, stdout: "phase running\nposition lab moves 1\nsaved\n", stderr: "" });
				const saved = encode(initialGraph, "running", "lab", 1);
				assert.equal(await readFile(join(directory, "restart state.txt"), "utf8"), saved);
				assert.deepEqual(await runNative(binary, [], directory, "load \"restart state.txt\"\nshow\n"), { code: 0, stdout: `loaded\n${running}`, stderr: "" });
				for (const damaged of [saved.replace("ROVER 1", "ROVER 2"), saved.slice(0, -1), `${saved}extra\n`, saved.replace("position lab", "position absent"), saved.replace("entry lab", "entry absent"), saved.replace("zones 3", "zones 65")]) {
					await writeFile(join(directory, "damaged.txt"), damaged);
					const result = await runNative(binary, [], directory, "start\nmove lab\nload damaged.txt\nshow\n");
					assert.equal(result.code, 0);
					assert.equal(result.stdout, `phase running\nposition lab moves 1\n${running}`);
					assert.match(result.stderr, /^Rejected:/);
				}
				await mkdir(join(directory, "restart state.txt.rover-stage"));
				await writeFile(join(directory, "restart state.txt.rover-stage", "sentinel"), "preserve");
				const refused = await runNative(binary, [], directory, "save \"restart state.txt\"\nshow\n");
				assert.equal(refused.code, 0);
				assert.equal(refused.stdout, before);
				assert.match(refused.stderr, /^Rejected:/);
				assert.equal(await readFile(join(directory, "restart state.txt"), "utf8"), saved);
				assert.equal(await readFile(join(directory, "restart state.txt.rover-stage", "sentinel"), "utf8"), "preserve");
				await rm(join(directory, "restart state.txt.rover-stage"), { recursive: true });
				const graphs = [initialGraph, { entry: ["branch", "lab"], branch: ["entry"], lab: ["dock"], dock: [] }, { entry: ["branch"], branch: ["entry"], dock: [] }];
				for (const graph of graphs) {
					await writeFile(join(directory, "graph.txt"), encode(graph));
					const names = Object.keys(graph).sort();
					const result = await runNative(binary, [], directory, `load graph.txt\n${names.map(name => `route ${name}\n`).join("")}`);
					assert.equal(result.code, 0);
					assert.equal(result.stderr, "");
					const lines = result.stdout.trimEnd().split("\n");
					assert.equal(lines.shift(), "loaded");
					assert.equal(lines.length, names.length);
					for (const [index, target] of names.entries()) {
						assert.equal(lines[index] !== "route unavailable", reachable(graph, target));
						if (reachable(graph, target)) {
							const route = lines[index].replace(/^route /, "").split(" -> ");
							assert.equal(route[0], "entry");
							assert.equal(route.at(-1), target);
							assert.equal(route.length, new Set(route).size);
							for (let i = 1;
								i < route.length;
								i++) assert.ok(graph[route[i - 1]].includes(route[i]));
						}
					}
				}
				assert.deepEqual(await runNative(binary, ["extra"], directory), { code: 2, stdout: "", stderr: "Usage: rover\n" });
			}
			else {
				for (const prefix of [[], ["start"], ["start", "pause"], ["start", "finish"]]) {
					for (const event of ["start", "pause", "resume", "finish"]) {
						const events = [...prefix, event];
						assert.deepEqual(await runNative(binary, [], directory, `${events.join("\n")}\nquit\nstart\n`), { code: 0, stdout: stateOutput(events), stderr: "" });
					}
				}
				assert.deepEqual(await runNative(binary, [], directory, ""), { code: 0, stdout: "lifetime balanced true\n", stderr: "" });
				assert.deepEqual(await runNative(binary, ["extra"], directory), { code: 2, stdout: "", stderr: "Usage: state-review\n" });
			}
		}
		const made = await runNative("make", ["CXX=clang++", "main"], directory);
		assert.equal(made.code, 0, made.stderr);
		const expected = primary(folder) ? { code: 0, stdout: "phase running\n", stderr: "" } : { code: 0, stdout: stateOutput(["start"]), stderr: "" };
		assert.deepEqual(await runNative(join(directory, "main"), [], directory, "start\n"), expected);
	}
	finally {
		for (const name of ["rover-native", "main", "restart state.txt", "restart state.txt.rover-stage", "damaged.txt", "graph.txt"]) await rm(join(directory, name), { recursive: true, force: true });
	}
}
export async function verifyRoverLessons(directory, lessons, runNative) {
	const program = (key) => {
		const matches = [...lessons[key].matchAll(/```cpp\n([\s\S]*?)\n```/g)];
		assert.equal(matches.length, 1);
		return `${matches[0][1]}\n`;
	};
	const dispatch = program("dispatch");
	const pathways = program("pathways");
	const cases = [
		["dispatch", dispatch, 0, "move 1\nread 1\nmove 3\nread 3\ndestroyed 4\n", ""],
		["dispatch", dispatch.replace("<Move>(1, destroyed)", "<Move>(3, destroyed)").replace("<Move>(2, destroyed)", "<Move>(4, destroyed)"), 0, "move 3\nread 3\nmove 7\nread 7\ndestroyed 4\n", ""],
		["dispatch", dispatch.replace("<Move>(1, destroyed)", "<Move>(11, destroyed)"), 1, "", "Rejected: Move outside the lesson bounds.\n"],
		["pathway", pathways, 0, "found true\nentry -> archive -> dock\nentered 3\n", ""],
		["pathway", pathways.replace("{\"archive\", {\"dock\"}}", "{\"archive\", {\"entry\"}}"), 0, "found true\nentry -> lab -> dock\nentered 4\n", ""],
		["pathway", pathways.replace("{\"archive\", {\"dock\"}}", "{\"archive\", {}}").replace("{\"lab\", {\"dock\"}}", "{\"lab\", {}}"), 0, "found false\n\nentered 3\n", ""]
	];
	try {
		for (const sanitized of [false, true]) {
			for (const [name, source, code, stdout, stderr] of cases) {
				await writeFile(join(directory, "lesson.cpp"), source);
				const binary = join(directory, "lesson-native");
				assert.deepEqual(await runNative("clang++", [...flags(sanitized), "lesson.cpp", "-o", binary], directory), { code: 0, stdout: "", stderr: "" });
				assert.deepEqual(await runNative(binary, [], directory), { code, stdout, stderr });
				assert.deepEqual(await runNative(binary, ["extra"], directory), { code: 2, stdout: "", stderr: `Usage: ${name}-lesson\n` });
			}
		}
	}
	finally {
		for (const name of ["lesson.cpp", "lesson-native"]) await rm(join(directory, name), { force: true });
	}
}
