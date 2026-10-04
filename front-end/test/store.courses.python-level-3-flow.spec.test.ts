import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { pythonLevel3Course } from "@/stores/courses/python-level-3";

const EXPECTED_TEACHING_MODULES = [
	"AM1 Review: Variables, Strings, Input, Loops, & Conditionals",
	"AM2 Review: Functions & Lists",
	"AM3 Review: Dictionaries & Recap",
	"AM4 Recursion Part 1",
	"AM5 Recursion Part 2",
	"Check-In #1",
	"AM6 Introduction to Algorithms & Runtime Analysis",
	"AM7 Binary Search",
	"AM8 Selection Sort & Insertion Sort",
	"Check-In #2",
	"AM9 Bubble Sort",
	"AM10 Merge Sort",
	"AM11 Quicksort",
	"AM12 File Input/Output",
	"Check-In #3",
	"AM13 Master Project: Conway's Game of Life",
	"AM14 Master Project: Tic Tac Toe AI"
];

function requireSourceModule(title: string) {
	const module = pythonLevel3Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Python Level 3 module ${title}.`);
	return module;
}

describe("Python Level 3 learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("keeps review, algorithms, I/O, simulation, and AI in dependency order", () => {
		expect(pythonLevel3Course.modules.map(module => module.title)).toEqual(
			EXPECTED_TEACHING_MODULES
		);
		expect(
			pythonLevel3Course.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, trace targets, and explicit paths", () => {
		for (const module of pythonLevel3Course.modules) {
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

	it("keeps authored projects core and only supplemental work optional", () => {
		const requiredCount = pythonLevel3Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = pythonLevel3Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(86);
		expect(optionCount).toBe(4);

		// Juni places these check-in projects in curriculum, despite their titles.
		for (const title of ["Check-In #1", "Check-In #2", "Check-In #3"]) {
			expect(
				requireSourceModule(title).curriculum.find(item =>
					item.title.includes("Additional Practice Project")
				)?.learningPath
			).toBe("core");
		}
		expect(
			requireSourceModule("AM4 Recursion Part 1").curriculum.find(
				item =>
					item.title === "AM4 Project 3: Recursive Fibonacci Numbers"
			)?.learningPath
		).toBe("core");
		expect(
			requireSourceModule("AM7 Binary Search").curriculum.find(
				item => item.title === "AM7 Project 2: Reverse Number Guesser"
			)?.learningPath
		).toBe("core");
		expect(
			requireSourceModule(
				"AM14 Master Project: Tic Tac Toe AI"
			).curriculum.find(
				item => item.title === "AM14 Project 4: Advanced Tic Tac Toe AI"
			)?.learningPath
		).toBe("core");
	});

	it("states source contracts and distinguishes worksheet from supplied-code analysis", () => {
		const items = pythonLevel3Course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const byTitle = new Map(items.map(item => [item.title, item]));
		expect(
			byTitle.get("AM1 Project 2: Fictional Language Verifier")?.content
		).toContain("ignoring letter case");
		expect(
			byTitle.get("AM1 Project 3: Command Assistant")?.content
		).toContain("blank or unknown input");
		expect(
			byTitle.get("AM5 Project 1: Recursive Cascade")?.content
		).toContain("empty string prints no lines");
		expect(
			byTitle.get("AM5 Project 2: Recursive Palindrome Checker")?.content
		).toContain("literal, case-sensitive");
		expect(
			byTitle.get("AM5 Project 3: Parentheses Validator")?.content
		).toContain("non-bracket character is rejected");
		expect(
			byTitle.get("AM5 Supplemental Project 1: Recursive Sum and Max")
				?.content
		).toContain("ValueError for an empty maximum");
		const substrings = byTitle.get(
			"AM5 Supplemental Project 2: Substring Generator"
		);
		expect(substrings?.content).toContain("contiguous substrings");
		expect(substrings?.content).toContain("excludes ac");
		expect(substrings?.learningPath).toBe("challenge");
		expect(byTitle.get("AM6 Project 2: Big-O Notation")?.content).toContain(
			"mathematical worksheet"
		);
		expect(byTitle.get("AM6 Project 2: Big-O Notation")?.content).toContain(
			"justified classification for each of the ten prompts"
		);
		expect(
			byTitle.get("AM6 Project 2: Big-O Notation")?.content
		).not.toContain("The finished project proves");
		expect(
			byTitle.get("AM6 Project 3: Function Analysis")?.content
		).toContain("supplied f1 through f14");
	});

	it("stages both capstones around testable minimum systems", () => {
		expect(
			requireSourceModule("AM13 Master Project: Conway's Game of Life")
				.curriculum[0]?.content
		).toContain("simulation capstone");
		expect(
			requireSourceModule("AM14 Master Project: Tic Tac Toe AI")
				.curriculum[0]?.content
		).toContain("AI capstone");
		expect(
			requireSourceModule("AM14 Master Project: Tic Tac Toe AI").keyBlocks
		).toContain("strategy test");
	});

	it("preserves project progress IDs in the core listing", async () => {
		const course = await useCoursesStore().loadCourseById("python-level-3");
		expect(course).not.toBeNull();

		const recursion = course!.modules.find(
			module => module.title === "AM4 Recursion Part 1"
		);
		const fibonacci = recursion?.curriculum.find(
			item => item.title === "AM4 Project 3: Recursive Fibonacci Numbers"
		);

		expect(fibonacci?.id).toBe(
			"python-level-3-am4-recursion-part-1-curriculum-am4-project-3-recursive-fibonacci-numbers"
		);
		expect(fibonacci?.aliases).toBeUndefined();
	});

	it("states sorting mutation, stability, and measured-experiment contracts", () => {
		const items = pythonLevel3Course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const byTitle = new Map(items.map(item => [item.title, item]));
		const selection = byTitle.get("AM8 Project 1: Selection Sort")!;
		expect(selection.content).toContain("leaves the input empty");
		expect(selection.content).toContain("current unsorted suffix");
		expect(selection.content).toContain("return the same list");
		expect(byTitle.get("AM8 Project 2: Insertion Sort")?.content).toContain(
			"tied items retain their order"
		);
		expect(byTitle.get("AM9 Project 1: Bubble Sort")?.content).toContain(
			"Count comparisons"
		);
		expect(byTitle.get("AM10 Project 1: Merge")?.content).toContain(
			"`pop(0)`"
		);
		expect(byTitle.get("AM10 Project 2: Split")?.content).toContain(
			"return None"
		);
		expect(byTitle.get("AM10 Project 3: Merge Sort")?.content).toContain(
			"empty and singleton base cases return a copy"
		);
		expect(byTitle.get("AM11 Project 1: Partition")?.content).toContain(
			"pivot value, not an index"
		);
		expect(byTitle.get("AM11 Project 2: Quicksort")?.content).toContain(
			"without mutating or aliasing"
		);
		const comparison = byTitle.get("AM11 Project 3: Sorting Comparison")!;
		// Juni's authored comparison project remains required, not optional.
		expect(comparison.learningPath).toBe("core");
		for (const contract of [
			"fresh copy of the same input",
			"time.perf_counter()",
			"validate the result after stopping the clock",
			"from 0 to 2000",
			"from 1 to 10",
			"medians of measured runs only",
			"do not prove Big-O"
		]) {
			expect(comparison.content).toContain(contract);
		}
		for (const item of [selection, comparison]) {
			expect(item.projectLink).toMatch(/\/starter$/);
			expect(item.solutionLink).toMatch(/\/solution$/);
		}
	});

	it("keeps licensed sort animations and only available project media", async () => {
		const course = await loadRawCourse("python-level-3");
		expect(course).not.toBeNull();

		const items = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const byTitle = new Map(items.map(item => [item.title, item]));
		expect(byTitle.get("Bubble Sort Introduction")?.mediaLink).toBe(
			"https://static.classes.jacobdanderson.net/py3_bubble_sort_wikimedia.gif"
		);
		expect(byTitle.get("Bubble Sort Introduction")?.content).toContain(
			"Wikimedia Commons"
		);
		expect(byTitle.get("AM1 Project 1: Mad Libs")?.mediaLink).toBe(
			"https://static.classes.jacobdanderson.net/am_1_mad_libs.mp4"
		);
		expect(
			byTitle.get("AM12 Project 2: File IO and Dictionaries")?.mediaLink
		).toBeUndefined();
		expect(JSON.stringify(course)).not.toContain(
			"Pending Python Level 3 Assets"
		);
	});
});
