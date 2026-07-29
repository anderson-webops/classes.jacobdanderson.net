import { describe, expect, it } from "vitest";
import { cppLevel2Course } from "@/stores/courses/cpp-level-2";

const EXPECTED_MODULE_SEQUENCE = [
	"CPPM0 Lifetime, References, and Ownership Framing",
	"CPPM1 Pointers and Addresses",
	"CPPM2 Raw Arrays and Pointer Arithmetic",
	"CPPM3 Two-Dimensional Arrays and Layout",
	"CPPM4 Dynamic Memory and Custom Dynamic Arrays",
	"CPPM5 Manual-Memory Capstones"
];

function requireModule(title: string) {
	const module = cppLevel2Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected C++ Level 2 module ${title}.`);
	return module;
}

describe("C++ Level 2 learner flow", () => {
	it("keeps lifetime reasoning ahead of pointers and manual ownership", () => {
		expect(cppLevel2Course.modules.map(module => module.title)).toEqual(
			EXPECTED_MODULE_SEQUENCE
		);
		expect(
			EXPECTED_MODULE_SEQUENCE.indexOf(
				"CPPM0 Lifetime, References, and Ownership Framing"
			)
		).toBeLessThan(
			EXPECTED_MODULE_SEQUENCE.indexOf(
				"CPPM4 Dynamic Memory and Custom Dynamic Arrays"
			)
		);
	});

	it("gives every module pacing, memory targets, and explicit paths", () => {
		for (const module of cppLevel2Course.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("keeps one principal build per stage and moves secondary builds to options", () => {
		const requiredCount = cppLevel2Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = cppLevel2Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const options = cppLevel2Course.modules.flatMap(module =>
			module.supplementalProjects.map(item => ({
				path: item.learningPath,
				title: item.title
			}))
		);

		expect(requiredCount).toBe(18);
		expect(optionCount).toBe(14);
		for (const choice of [
			"CPPM0 Project 2: Ownership Boundary Debugging",
			"CPPM2 Project 2: Tic Tac Toe",
			"CPPM3 Project 2: Bank Transactions",
			"CPPM4 Project 1: Assembly Line",
			"CPPM5 Project 1: Matrix Fun with a Matrix Class"
		]) {
			expect(options).toContainEqual({ path: "choice", title: choice });
		}
		for (const challenge of [
			"CPPM1 Project 2: Pointer Error Examples",
			"CPPM4 Project 3: Grocery List"
		]) {
			expect(options).toContainEqual({
				path: "challenge",
				title: challenge
			});
		}
	});

	it("requires diagnostics and copy control before the custom container", () => {
		const foundation = requireModule(
			"CPPM0 Lifetime, References, and Ownership Framing"
		);
		const dynamicMemory = requireModule(
			"CPPM4 Dynamic Memory and Custom Dynamic Arrays"
		);
		const readiness = foundation.curriculum.find(
			item =>
				item.title ===
				"CPPM0 Project 0: C++20 Memory Diagnostics Readiness Check"
		);
		const gateIndex = dynamicMemory.curriculum.findIndex(
			item =>
				item.title ===
				"Copy-Control Gate: Rule of Three and Rule of Five"
		);
		const implementationIndex = dynamicMemory.curriculum.findIndex(
			item =>
				item.title === "CPPM4 Project 2: Dynamic Array Implementation"
		);

		expect(readiness?.content).toContain(
			"-fsanitize=address,undefined -fno-omit-frame-pointer"
		);
		expect(gateIndex).toBeGreaterThanOrEqual(0);
		expect(gateIndex).toBeLessThan(implementationIndex);
		expect(dynamicMemory.curriculum[0]?.content).toContain(
			"deep copy, move, self-assignment, destruction, and empty-state behavior"
		);
	});

	it("ends with a private ownership capstone and an RAII correction", () => {
		const capstone = requireModule("CPPM5 Manual-Memory Capstones");
		const contract = capstone.curriculum.find(
			item =>
				item.title ===
				"CPPM5 Capstone Completion Contract: Profile Posts Ownership"
		);
		const capstoneText = capstone.curriculum
			.map(item => item.content)
			.join("\n");

		expect(capstone.curriculum[0]?.content).toContain(
			"fictional, local-only Profile Posts"
		);
		expect(contract?.content).toContain(
			"copy, move, resize, self-assignment, and destruction behavior"
		);
		expect(contract?.content).toContain(
			"no real personal, account, or public-posting data"
		);
		expect(capstoneText).toContain("std::unique_ptr");
		expect(capstoneText).toContain("RAII");
	});
});
