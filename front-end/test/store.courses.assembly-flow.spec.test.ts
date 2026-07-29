import { describe, expect, it } from "vitest";
import { assemblyCourse } from "@/stores/courses/assembly";

const EXPECTED_PRIMARY_SEQUENCE = [
	"ASM0 Setup and Tooling",
	"Unit 1: Machine Model and Toolchain",
	"Unit 2: Registers and Data Movement",
	"Unit 3: Arithmetic and Logic",
	"Unit 4: Branching and Loops",
	"Unit 5: The Stack and Function Calls",
	"Unit 6: Calling Conventions and ABI",
	"Unit 7: Memory Addressing and Data Structures",
	"Unit 8: System Calls and Runtime Interaction",
	"Unit 9: Reading Compiler Output",
	"Unit 10: Debugging at Instruction Level",
	"Unit 11: Performance and Code Shape",
	"Unit 12: Security and Reliability Visibility"
];

function requireModule(title: string) {
	const module = assemblyCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Assembly module ${title}.`);
	return module;
}

describe("Assembly learner flow", () => {
	it("keeps thirteen baseline units and one optional pathway archive", () => {
		expect(
			assemblyCourse.modules.slice(0, 13).map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(assemblyCourse.modules).toHaveLength(14);
		expect(assemblyCourse.modules[13]).toMatchObject({
			kind: "appendix",
			title: "Optional Assembly Pathways and Studio Archive"
		});
	});

	it("gives every baseline unit pacing, trace targets, and explicit paths", () => {
		for (const module of assemblyCourse.modules.slice(0, 13)) {
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

	it("moves architecture comparisons and repeat studios out of the required path", () => {
		const archive = requireModule(
			"Optional Assembly Pathways and Studio Archive"
		);
		const curriculumCount = assemblyCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = assemblyCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const archiveText = [
			...archive.curriculum,
			...archive.supplementalProjects
		]
			.map(item => `${item.title}\n${item.content}`)
			.join("\n");

		expect(curriculumCount).toBe(62);
		expect(optionCount).toBe(68);
		expect(archive.supplementalProjects).toHaveLength(29);
		expect(archiveText).toContain("ASM13 Expansion Ideas and Next Steps");
		expect(archiveText).toContain("Assembly Lab 15: Stack Trace Studio");
		expect(archiveText).toContain(
			"Assembly Lab 16: ABI Integration Studio"
		);
		expect(archiveText).toContain("Assembly Lab 17: Reverse Trace Studio");
	});

	it("pins one executable target and makes ABI obligations testable", () => {
		const setup = requireModule("ASM0 Setup and Tooling");
		const calls = requireModule("Unit 6: Calling Conventions and ABI");
		const readiness = setup.curriculum.find(
			item => item.title === "ASM0 Project 0: Target and Trace Readiness"
		);
		const setupText = setup.curriculum.map(item => item.content).join("\n");

		expect(setupText).toContain("x86-64 Linux");
		expect(setupText).toContain("System V AMD64 ABI");
		expect(setupText).toContain(".intel_syntax noprefix");
		expect(setupText).toContain(
			"rather than mixing native ARM64 instructions"
		);
		expect(readiness?.content).toContain("objdump -Mintel");
		expect(calls.curriculum[0]?.content).toContain(
			"preserve every callee-saved register touched"
		);
		expect(calls.curriculum[0]?.content).toContain(
			"maintain stack alignment"
		);
	});

	it("ends with bounded defensive reverse engineering on owned fixtures", () => {
		const endpoint = requireModule(
			"Unit 12: Security and Reliability Visibility"
		);
		const contract = endpoint.curriculum.find(
			item =>
				item.title ===
				"ASM12 Defensive Reverse-Trace Completion Contract"
		);

		expect(endpoint.curriculum[0]?.content).toContain(
			"course-owned toy binaries"
		);
		expect(endpoint.curriculum[0]?.content).toContain(
			"avoid exploit development or third-party targets"
		);
		expect(contract?.content).toContain(
			"does not target third-party software"
		);
		expect(contract?.content).toContain(
			"Pseudocode output matches the toy binary"
		);
	});
});
