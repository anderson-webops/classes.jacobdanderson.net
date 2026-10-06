import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { manualCapstoneNativeCases } from "./fixtures/cpp-manual-capstone-native-cases.mjs";

export function completeManualCapstoneFile(folder, name, source, reference) {
	if (!folder.endsWith("-Starter") || !/\.(?:h|cpp)$/.test(name))
		return source;
	assert.equal(
		typeof reference?.[name],
		"string",
		`Independently hashed ${name} reference is available`
	);
	// QA completes the saved attempt through the actual editor. Reference bytes
	// stay separate from learner packs and are never offered automatically.
	return reference[name];
}

async function cleanup(directory, runNative) {
	const cleaned = await runNative("make", ["clean"], directory);
	assert.equal(cleaned.code, 0, cleaned.stderr);
	for (const name of ["main", "main-debug", "main.dSYM", "main-debug.dSYM"])
		assert.equal(existsSync(join(directory, name)), false);
	for (const name of [
		"ownership-check",
		"ownership-check.cpp",
		"observer",
		"observer.cpp"
	])
		await rm(join(directory, name), { recursive: true, force: true });
}

export async function verifyManualCapstoneDefaultExport(
	directory,
	folder,
	runNative
) {
	assert.ok(folder.endsWith("-Starter"));
	try {
		const build = await runNative(
			"make",
			["main", "main-debug"],
			directory
		);
		assert.equal(build.code, 0, build.stderr);
		const task = folder.includes("Profile")
			? "Profile menu"
			: "Matrix program";
		for (const name of ["main", "main-debug"]) {
			const result = await runNative(
				join(directory, name),
				[],
				directory
			);
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			assert.ok(
				result.stdout.includes(`Unfinished learner task: ${task}`)
			);
		}
	}
	finally {
		await cleanup(directory, runNative);
	}
}

function flags(diagnostic) {
	return [
		"-std=c++20",
		"-Wall",
		"-Wextra",
		"-Wpedantic",
		"-Werror",
		"-g",
		"-O0",
		...(diagnostic
			? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"]
			: [])
	];
}

async function checkProfile(binary, directory, diagnostic, runNative) {
	const demo = await runNative(binary, ["--demo"], directory);
	assert.equal(demo.code, 0, demo.stderr);
	assert.equal(demo.stderr, "");
	const final = demo.stdout.slice(
		demo.stdout.lastIndexOf("Now printing out the current profile:")
	);
	assert.equal(final.match(/Post number:/g)?.length, 7);
	const hearts = [...final.matchAll(/^Post hearts: (\d+)$/gm)].map(match =>
		Number(match[1])
	);
	assert.deepEqual(hearts, [40, 20, 20, 20, 20, 20, 20]);
	assert.equal(
		hearts.reduce((sum, count) => sum + count, 0),
		160
	);
	await writeFile(
		join(directory, "observer.cpp"),
		manualCapstoneNativeCases.PROFILE_OBSERVER
	);
	const compiled = await runNative(
		"clang++",
		[...flags(diagnostic), "profile.cpp", "observer.cpp", "-o", "observer"],
		directory
	);
	assert.equal(compiled.code, 0, compiled.stderr);
	for (const [input, records] of [
		["", []],
		["add\nhello world\n30\nprint\n!quit\n", [["hello world", 30]]],
		["add\na\n30\nadd\nb\n10\nremove\n1\n!quit\n", [["b", 10]]],
		[
			"add\n\n example \n-1\n1x\n+0\nhearts\n1\n-2147483648\nhearts\n1\n2147483647\nhearts\n1\n1\n!quit\n",
			[["example", 2147483647]]
		],
		[
			"add\na\n2147483647\nadd\nb\n1\nsum\n!quit\n",
			[
				["a", 2147483647],
				["b", 1]
			]
		],
		["add\na\n30\nremove\n0\n-1\n1.5\n999\n!quit\n", [["a", 30]]],
		["add\ndraft\n", []],
		["add\ndraft\n!quit\n", []],
		["unknown\nadd words\nview\n1\nfill\n!quit\n", []],
		["add\na\n3\nfill\n!quit\n", Array.from({ length: 5 }, () => ["a", 3])]
	]) {
		const observed = await runNative(
			join(directory, "observer"),
			[],
			directory,
			input
		);
		assert.equal(observed.code, 0, observed.stderr);
		assert.equal(observed.stderr, "");
		const marker = observed.stdout.lastIndexOf(
			"Now printing out the current profile:"
		);
		assert.ok(marker >= 0);
		const trace = observed.stdout.slice(marker);
		const captions = [...trace.matchAll(/^Post caption: (.*)$/gm)].map(
			match => match[1]
		);
		const counts = [...trace.matchAll(/^Post hearts: (\d+)$/gm)].map(
			match => Number(match[1])
		);
		assert.deepEqual(
			captions.map((caption, i) => [caption, counts[i]]),
			records
		);
		if (input.includes("\nsum\n")) {
			assert.match(
				observed.stdout,
				/Rejected: Total hearts exceed the int range/
			);
		}
	}
}

async function checkMatrix(binary, directory, runNative) {
	for (const [input, grid] of [
		["", null],
		["!quit\n", null],
		["add\n1 1\n1 1\n4\n", null],
		["add\n1 1\n1 1\n4\n!quit\n", null],
		[
			"multiply\n2 3\n3 2\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n",
			[
				[58, 64],
				[139, 154]
			]
		],
		[
			"add\n2 2\n2 2\n1\n-2\n0\n4\n5\n2\n-3\n6\n",
			[
				[6, 0],
				[-3, 10]
			]
		],
		[
			"unknown\nadd x\n add \n0 1\n1.5 1\n21 1\n1 1\n1 1\n\n1x\n+-1\n+2\n3",
			[[5]]
		]
	]) {
		const output = await runNative(binary, [], directory, input);
		assert.equal(output.code, 0, output.stderr);
		assert.equal(output.stderr, "");
		if (grid === null) {
			assert.doesNotMatch(output.stdout, /Matrix /);
		}
		else {
			const marker = output.stdout.lastIndexOf("Matrix ");
			assert.ok(marker >= 0);
			const rows = output.stdout
				.slice(marker)
				.split("\n")
				.slice(1)
				.filter(line => line.trim())
				.map(line => line.trim().split(/\s+/).map(Number));
			assert.deepEqual(rows, grid);
		}
	}
	for (const input of [
		"add\n1 1\n1 1\n2147483647\n1\n",
		"multiply\n1 1\n1 1\n-2147483648\n-1\n"
	]) {
		const failed = await runNative(binary, [], directory, input);
		assert.equal(failed.code, 1);
		assert.match(failed.stderr, /int range/);
	}
}

export async function verifyManualCapstoneExport(
	directory,
	folder,
	result,
	runNative
) {
	assert.equal(result.stderr, "");
	assert.doesNotMatch(result.stdout, /Unfinished learner task:/);
	const kind = folder.includes("Profile")
		? "PROFILE"
		: folder.includes("Matrix")
			? "MATRIX"
			: "OWNERSHIP";
	const expected = {
		PROFILE:
			/Verified Profile records, both copies\/moves, growth, heart bounds, removal, fill, input and injected cleanup/,
		MATRIX: /Verified Matrix grids, checked arithmetic, copy\/move, input and injected cleanup/,
		OWNERSHIP:
			/Verified all three ownership paths, exact scores, allocation failures and throwing-output cleanup/
	};
	try {
		const build = await runNative(
			"make",
			["main", "main-debug"],
			directory
		);
		assert.equal(build.code, 0, build.stderr);
		if (kind !== "OWNERSHIP") {
			const stem = kind === "PROFILE" ? "profile" : "matrix";
			const rebuild = await runNative(
				"make",
				["-n", "-W", `${stem}.h`, "main"],
				directory
			);
			assert.equal(rebuild.code, 0, rebuild.stderr);
			assert.ok(rebuild.stdout.includes(`${stem}.cpp main.cpp`));
		}
		for (const [name, diagnostic] of [
			["main", false],
			["main-debug", true]
		]) {
			const binary = join(directory, name);
			if (kind === "PROFILE") {
				await checkProfile(binary, directory, diagnostic, runNative);
			}
			else if (kind === "MATRIX") {
				await checkMatrix(binary, directory, runNative);
			}
			else {
				const output = await runNative(binary, [], directory);
				assert.equal(output.code, 0, output.stderr);
				assert.equal(output.stderr, "");
				assert.equal(
					output.stdout,
					manualCapstoneNativeCases.OWNERSHIP_EXPECTED
				);
			}
			const badArgs = await runNative(binary, ["--unknown"], directory);
			assert.equal(badArgs.code, 2);
			assert.equal(
				badArgs.stderr,
				kind === "PROFILE" ? "Usage: main [--demo]\n" : "Usage: main\n"
			);
			await writeFile(
				join(directory, "ownership-check.cpp"),
				manualCapstoneNativeCases[kind]
			);
			const compiled = await runNative(
				"clang++",
				[
					...flags(diagnostic),
					"ownership-check.cpp",
					"-o",
					"ownership-check"
				],
				directory
			);
			assert.equal(compiled.code, 0, compiled.stderr);
			const checked = await runNative(
				join(directory, "ownership-check"),
				[],
				directory
			);
			assert.equal(checked.code, 0, checked.stderr);
			assert.equal(checked.stderr, "");
			assert.match(checked.stdout, expected[kind]);
		}
	}
	finally {
		await cleanup(directory, runNative);
	}
}
