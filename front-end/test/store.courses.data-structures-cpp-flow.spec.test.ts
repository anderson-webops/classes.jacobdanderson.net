import { describe, expect, it } from "vitest";
import { dataStructuresAndAlgorithmsInCppCourse } from "@/stores/courses/data-structures-and-algorithms-in-cpp";

const EXPECTED_PRIMARY_SEQUENCE = [
	"DSCPP0 Setup and Positioning",
	"DSCPP1 Interfaces, Records, and a Task Manager CLI",
	"DSCPP2 Graphs and Shortest Paths",
	"DSCPP3 STL Containers and State-Based Text Generation",
	"DSCPP4 Recursion and Backtracking in 3D Mazes",
	"DSCPP5 Quicksort and Partitioning",
	"DSCPP6 Templates and Linked Structures",
	"DSCPP7 Binary Search Trees",
	"DSCPP8 AVL Trees and Rebalancing",
	"DSCPP9 Benchmarking and Data-Structure Tradeoffs"
];

function requireModule(title: string) {
	const module = dataStructuresAndAlgorithmsInCppCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected DS&A C++ module ${title}.`);
	return module;
}

describe("Data Structures and Algorithms in C++ learner flow", () => {
	it("keeps ten distinct units and one optional studio archive", () => {
		expect(
			dataStructuresAndAlgorithmsInCppCourse.modules
				.slice(0, 10)
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(dataStructuresAndAlgorithmsInCppCourse.modules).toHaveLength(11);
		expect(
			dataStructuresAndAlgorithmsInCppCourse.modules[10]
		).toMatchObject({
			kind: "appendix",
			title: "Optional Algorithm Studios and Transfer Archive"
		});
	});

	it("gives every primary unit pacing, algorithm targets, and explicit paths", () => {
		for (const module of dataStructuresAndAlgorithmsInCppCourse.modules.slice(
			0,
			10
		)) {
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

	it("removes seven repetitive studios from the required spine without losing them", () => {
		const archive = requireModule(
			"Optional Algorithm Studios and Transfer Archive"
		);
		const archivedTitles = archive.supplementalProjects.map(
			item => item.title
		);
		const curriculumCount =
			dataStructuresAndAlgorithmsInCppCourse.modules.reduce(
				(total, module) => total + module.curriculum.length,
				0
			);
		const optionCount =
			dataStructuresAndAlgorithmsInCppCourse.modules.reduce(
				(total, module) => total + module.supplementalProjects.length,
				0
			);

		expect(curriculumCount).toBe(53);
		expect(optionCount).toBe(79);
		expect(archive.supplementalProjects).toHaveLength(49);
		for (const title of [
			"C++ Algorithm Lab 11: Core Project",
			"C++ Algorithm Lab 12: Core Project",
			"C++ Algorithm Lab 13: Core Project",
			"C++ Algorithm Lab 14: Core Project",
			"C++ Algorithm Lab 15: Core Project",
			"C++ Algorithm Lab 16: Core Project",
			"C++ Algorithm Lab 17: Core Project"
		]) {
			expect(archivedTitles).toContain(title);
		}
	});

	it("establishes complexity evidence and safe shortest-path preconditions", () => {
		const setup = requireModule("DSCPP0 Setup and Positioning");
		const graph = requireModule("DSCPP2 Graphs and Shortest Paths");
		const readiness = setup.curriculum.find(
			item =>
				item.title ===
				"DSCPP0 Project 0: Complexity and Toolchain Readiness"
		);
		const graphText = graph.curriculum.map(item => item.content).join("\n");

		expect(readiness?.content).toContain(
			"documented C++20 configure/build/test path"
		);
		expect(readiness?.content).toContain(
			"operation-count table, one invariant, and one justified Big-O statement"
		);
		expect(graphText).toContain("nonnegative-edge precondition");
		expect(graphText).toContain("std::priority_queue");
		expect(graphText).toContain("stale queue entries");
		expect(graphText).toContain("disconnected goals");
	});

	it("ends with reproducible benchmarks and bounded conclusions", () => {
		const benchmark = requireModule(
			"DSCPP9 Benchmarking and Data-Structure Tradeoffs"
		);
		const contract = benchmark.curriculum.find(
			item => item.title === "DSCPP9 Capstone Completion Contract"
		);
		const benchmarkText = benchmark.curriculum
			.map(item => item.content)
			.join("\n");

		expect(benchmarkText).toContain("fixed seeds");
		expect(benchmarkText).toContain("repeated raw samples");
		expect(benchmarkText).toContain("median results");
		expect(contract?.content).toContain(
			"does not claim a universal winner"
		);
	});
});
