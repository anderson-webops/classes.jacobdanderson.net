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
			expect(requireSourceModule(title).curriculum[0]?.content).toContain(
				"remains a required core review project"
			);
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

	it("states complete iterative function and list review contracts", () => {
		const module = requireSourceModule("AM2 Review: Functions & Lists");
		const functions = module.curriculum.find(
			item => item.title === "AM2 Project 1: Functions Practice"
		)!;
		for (const name of [
			"product(a, b, c)",
			"average(x, y)",
			"count_letter(word, letter)",
			"count_seven(number)",
			"exponent(a, b)"
		]) {
			expect(functions.content).toContain(name);
		}
		expect(functions.content).toContain(
			"later AM4 projects teach recursion"
		);
		expect(functions.content).toContain("Optional iterative challenges");
		expect(functions.content).toContain("hailstone(n, max_steps=10000)");
		expect(functions.content).toContain("transition cap");
		expect(functions.content).toContain(
			"General Hailstone convergence is not proved"
		);
		expect(functions.content).toContain("case-sensitive");
		const lists = module.curriculum.find(
			item => item.title === "AM2 Project 2: Lists Practice"
		)!;
		for (const name of [
			"make_numbers()",
			"make_evens()",
			"make_squares()",
			"sum_lists(l1, l2)",
			"minimum(l)",
			"maximum(l)",
			"sum_list_of_lists(l)",
			"flatten_list(l)",
			"max_list(l)"
		]) {
			expect(lists.content).toContain(name);
		}
		expect(lists.content).toContain(
			"twenty positive even numbers, 2 through 40"
		);
		expect(lists.content).toContain("deliberately skip empty inner lists");
		expect(lists.content).toContain("No function changes input lists");
		for (const item of [functions, lists]) {
			expect(item.learningPath).toBe("core");
			expect(item.projectLink).toMatch(/\/starter$/);
			expect(item.solutionLink).toMatch(/\/solution$/);
		}
	});

	it("supplies all sixteen fundamentals tasks without requiring reference answers", () => {
		const item = requireSourceModule(
			"AM3 Review: Dictionaries & Recap"
		).curriculum.find(
			candidate =>
				candidate.title ===
				"AM3 Project 1: Python Fundamentals Problem Set"
		)!;
		const buildPath = item.content
			.split("**Build path:**\n")[1]
			.split("\n\n**Checkpoints:**")[0];
		expect(buildPath.match(/^\d+\./gm)).toHaveLength(16);
		for (const name of [
			"double",
			"starts_with_a",
			"num_of_evens",
			"sum_of_numbers",
			"index_of_largest_number",
			"all_squares",
			"largest_power_of_two",
			"factorial_sum",
			"largest_divisor",
			"largest_product",
			"sums_to_zero",
			"most_common_numbers",
			"reverse_string",
			"count_vowels",
			"count_pairs",
			"swap_min_max"
		]) {
			expect(buildPath).toContain(name + "(");
		}
		for (const contract of [
			"ascending numeric order",
			"`[3, 6, 2, 2, 6]` returns `[2, 6]`",
			"Only swap_min_max mutates input",
			"Integer N parameters reject bool",
			"two distinct positions",
			"either letter case",
			"a singleton is unchanged"
		]) {
			expect(item.content).toContain(contract);
		}
		expect(item.learningPath).toBe("core");
		expect(item.projectLink).toMatch(/\/starter$/);
		expect(item.solutionLink).toMatch(/\/solution$/);
	});

	it("preserves full learner instructions and existing review progress IDs", async () => {
		const course = await useCoursesStore().loadCourseById("python-level-3");
		const items = course!.modules.flatMap(module => module.curriculum);
		const expected = [
			[
				"AM2 Project 1: Functions Practice",
				"python-level-3-am2-review-functions-lists-curriculum-am2-project-1-functions-practice",
				"hailstone(n, max_steps=10000)"
			],
			[
				"AM2 Project 2: Lists Practice",
				"python-level-3-am2-review-functions-lists-curriculum-am2-project-2-lists-practice",
				"twenty positive even numbers, 2 through 40"
			],
			[
				"AM3 Project 1: Python Fundamentals Problem Set",
				"python-level-3-am3-review-dictionaries-recap-curriculum-am3-project-1-python-fundamentals-problem-set",
				"swap_min_max(numbers)"
			]
		];
		for (const [title, id, lastTask] of expected) {
			const item = items.find(candidate => candidate.title === title)!;
			expect(item.id).toBe(id);
			expect(item.aliases).toBeUndefined();
			expect(item.content).toContain(lastTask);
			expect(item.content).toContain("with a course facilitator");
			expect(item.content).not.toMatch(/\ban course facilitator\b/i);
			expect(item.projectLink).toMatch(/\/starter$/);
		}
		const fundamentals = items.find(
			item =>
				item.title === "AM3 Project 1: Python Fundamentals Problem Set"
		)!;
		expect(fundamentals.content).toContain("**Build plan:**");
		const buildPath = fundamentals.content
			.split("**Build plan:**")[1]
			.split("**Checkpoints:**")[0];
		expect(buildPath.match(/^\d+\./gm)).toHaveLength(16);
	});

	it("gives check-in one complete string, recursion and stack contracts", () => {
		const module = requireSourceModule("Check-In #1");
		const text = module.curriculum.map(item => item.content).join("\n");
		for (const contract of [
			"middle_letters(word)",
			"second_word(sentence)",
			"fewer than two words",
			"num_pins(rows)",
			"zero rows need zero pins",
			"lucas(n)",
			"one-based positions",
			"1 through 20",
			"strangeFunction(4)",
			"nums = [1, 2, 3, 4, 5]",
			"make_word(keystrokes)",
			"backspace on an empty stack does nothing",
			"separate solution and answer key"
		]) {
			expect(text).toContain(contract);
		}
	});

	it("preserves original check-in two expressions, traces and search boundaries", () => {
		const module = requireSourceModule("Check-In #2");
		const text = module.curriculum.map(item => item.content).join("\n");
		for (const contract of [
			"n^2 + 1000n",
			"log(n) + sqrt(n)",
			"1*2*3*...*n",
			"expression's value",
			"weirdFunction(nums)",
			"function1(nums)",
			"function2(50)",
			"linear_search(l, v)",
			"bin_search_iter(lst, item)",
			"bin_search_recur(lst, item)",
			"rather than slicing",
			"first_one_index(numbers)",
			"-1 for empty/all-zero input",
			"two descending selection passes on [2, 5, 10, 3, 6, 1]",
			"inserting indices 1, 2 and 3",
			"return the same list",
			"tied items"
		]) {
			expect(text).toContain(contract);
		}
		const timing = module.curriculum.find(item =>
			item.title.includes("Additional Practice Project")
		)!;
		for (const contract of [
			"two-sort review",
			"AM11's five-sort",
			"selection_sort2(lst)",
			"insertion_sort2(lst)",
			"make_workloads(n, seed=0)",
			"time_sort(sorter, values)",
			"benchmark(sizes=(100, 300), repeats=3, seed=0, sorters=None)",
			"random, sorted and reversed",
			"fresh copy of the same shape",
			"median of measured samples",
			"timings do not prove Big-O"
		]) {
			expect(timing.content).toContain(contract);
		}
	});

	it("states exact advanced-sort and file record policies without filling trace answers", () => {
		const module = requireSourceModule("Check-In #3");
		const text = module.curriculum.map(item => item.content).join("\n");
		for (const contract of [
			"unoptimized baseline",
			"[4, 8, 2, 1, 10, 0]",
			"actual no-swap early cutoff",
			"merge(listA, listB)",
			"taking left ties first",
			"Avoid pop(0)",
			"partition(lst, pivot)",
			"within-group order",
			"distinct-key model",
			"write_letters(word, path='file.txt')",
			"read_letter_counts(path='file.txt')",
			"not meaningful spaces",
			"Empty files return {}",
			"Neither automatically splits text into words",
			"Reopen generated file.txt"
		]) {
			expect(text).toContain(contract);
		}
		const fileSort = module.curriculum.find(item =>
			item.title.includes("Additional Practice Project")
		)!;
		for (const contract of [
			"read_letters(path='input.txt')",
			"sort_letters(letters)",
			"write_letters(letters, path='output.txt')",
			"sort_file(input_path='input.txt', output_path='output.txt')",
			"Literal space/tab",
			"one-based line number",
			"path/symlink/hardlink aliases",
			"preserve input bytes",
			"malformed input preserves existing output",
			"save/export"
		]) {
			expect(fileSort.content).toContain(contract);
		}
		for (const answer of [
			"[10, 6, 2, 3, 5, 1]",
			"[2, 3, 5, 7, 10, 1]",
			"[2, 1, 4, 0, 8, 10]"
		]) {
			expect(text).not.toContain(answer);
			expect(
				requireSourceModule("Check-In #2")
					.curriculum.map(item => item.content)
					.join("\n")
			).not.toContain(answer);
		}
	});

	it("keeps check-in source roles, core placement and progress IDs after normalization", async () => {
		const course = await useCoursesStore().loadCourseById("python-level-3");
		const raw = await loadRawCourse("python-level-3");
		const sourceItems = raw!.modules.flatMap(module => module.curriculum);
		const items = course!.modules.flatMap(module => module.curriculum);
		for (const [number, folder] of [
			[1, "AM-Check-In-1"],
			[2, "AM-Check-In-2"],
			[3, "AM-Check-In-3"]
		] as const) {
			const starterUrl = `https://github.com/instruction-material/Python-Level-3/tree/main/${folder}/starter`;
			const item = items.find(
				candidate => candidate.projectLink === starterUrl
			)!;
			expect(item.id).toBe(
				`python-level-3-check-in-${number}-curriculum-check-in-${number}-overview`
			);
			expect(item.aliases).toEqual([
				`python-level-3-check-in-${number}-curriculum-python-level-3-check-in-${number}-overview`
			]);
			expect(item.learningPath).toBe("core");
			expect(item.projectLink).toBe(
				`https://github.com/instruction-material/Python-Level-3/tree/main/${folder}/starter`
			);
			expect(item.solutionLink).toBeUndefined();
			expect(
				sourceItems.find(
					candidate => candidate.projectLink === starterUrl
				)?.solutionLink
			).toBe(
				`https://github.com/instruction-material/Python-Level-3/tree/main/${folder}/solution`
			);
			expect(item.content).toContain("Confirm importing");
		}
		for (const number of [2, 3]) {
			const item = items.find(candidate =>
				candidate.projectLink?.endsWith(
					`/AM-Check-In-${number}-Additional-Project/starter`
				)
			)!;
			expect(item.id).toBe(
				`python-level-3-check-in-${number}-curriculum-check-in-${number}-additional-practice-project`
			);
			expect(item.learningPath).toBe("core");
			expect(item.projectLink).toMatch(
				new RegExp(`/AM-Check-In-${number}-Additional-Project/starter$`)
			);
			expect(item.solutionLink).toBeUndefined();
			expect(
				sourceItems.find(
					candidate => candidate.projectLink === item.projectLink
				)?.solutionLink
			).toMatch(/\/solution$/);
		}
	});

	it("states the keyed leaderboard contract without changing original data roles", () => {
		const project = requireSourceModule("AM9 Bubble Sort").curriculum.find(
			item => item.title === "AM9 Project 2: Baseball Analytics"
		)!;
		for (const contract of [
			"ten synthetic p1-p10 records",
			"playerList",
			"player_list",
			"bubble_baseball(players, stat)",
			"Average, Home Run and RBI",
			"finite int/float in [0, 1]",
			"Boolean numbers are invalid",
			"Validate every field",
			"one-based record numbers",
			"fresh list of names in descending",
			"equal statistics in their original input order",
			"Do not change the outer input list",
			"not sorted or list.sort",
			"print_list(names)",
			"Imports must not print",
			"save/export"
		]) {
			expect(project.content).toContain(contract);
		}
		expect(project.content).not.toContain("such as batting average");
		expect(
			requireSourceModule("AM9 Bubble Sort").curriculum[0]?.content
		).toContain("required core data-context project");
	});

	it("defines alternating record errors and keeps dictionary work read-only", () => {
		const project = requireSourceModule(
			"AM12 File Input/Output"
		).curriculum.find(
			item => item.title === "AM12 Project 2: File IO and Dictionaries"
		)!;
		for (const contract of [
			"parse_pairs(lines)",
			'load_pairs(path="input.txt")',
			'main(path="input.txt")',
			"does not require writing an output file",
			"Strip surrounding whitespace from both",
			"retain interior spaces and string values",
			"blank keys are rejected, empty values are valid",
			"later duplicate keys replace earlier values",
			"odd counts, blank keys and embedded delimiters",
			"one-based line number",
			"readlines and a context manager",
			"A final newline is not an extra blank value",
			"preserve input bytes",
			"normal missing/unreadable-file or decoding errors"
		]) {
			expect(project.content).toContain(contract);
		}
	});

	it("keeps the literal translation pipeline core and punctuation separately optional", () => {
		const module = requireSourceModule("AM12 File Input/Output");
		const project = module.curriculum.find(
			item =>
				item.title === "AM12 Project 3: Word Translator with File I/O"
		)!;
		for (const contract of [
			"translate(word)",
			"move its first character to the end and append ay",
			"Preserve character case and Unicode literally",
			'read_lines(path="input_no_punctuation.txt")',
			"translate_lines(lines, punctuation=False)",
			"one output line per input line, including blanks",
			'write_lines(lines, path="output.txt")',
			"validates the entire list before opening output",
			"one LF after each record",
			"symlink/hardlink aliases",
			"Core completion does not require translate_punctuation",
			"Optionally implement translate_punctuation(word)",
			"punctuation=True",
			"straight/curly apostrophes",
			"Read input_punctuation.txt anew",
			"output_punctuation.txt",
			"not general Pig Latin or a known-word lookup"
		]) {
			expect(project.content).toContain(contract);
		}
		expect(project.content).toMatch(
			/punctuation-only tokens remain unchanged/
		);
		expect(project.content).not.toContain(
			"Unknown words and capitalization are handled consistently"
		);
		expect(module.curriculum[0]?.content).toContain(
			"only its punctuation extension is optional"
		);
	});

	it("preserves normalized record/file progress IDs, core placement and separated source roles", async () => {
		const course = await useCoursesStore().loadCourseById("python-level-3");
		const raw = await loadRawCourse("python-level-3");
		const sourceItems = raw!.modules.flatMap(module => module.curriculum);
		const items = course!.modules.flatMap(module => module.curriculum);
		for (const [folder, id] of [
			[
				"AM9-Baseball-Analytics",
				"python-level-3-am9-bubble-sort-curriculum-am9-project-2-baseball-analytics"
			],
			[
				"AM12-File-IO-and-Dictionaries",
				"python-level-3-am12-file-input-output-curriculum-am12-project-2-file-io-and-dictionaries"
			],
			[
				"AM12-Juni-Latin-with-File-IO",
				"python-level-3-am12-file-input-output-curriculum-am12-project-3-word-translator-with-file-i-o"
			]
		]) {
			const root = `https://github.com/instruction-material/Python-Level-3/tree/main/${folder}`;
			const project = items.find(
				item => item.projectLink === `${root}/starter`
			)!;
			expect(project).toBeDefined();
			expect(project.id).toBe(id);
			expect(project.learningPath).toBe("core");
			expect(project.solutionLink).toBeUndefined();
			expect(
				sourceItems.find(item => item.projectLink === `${root}/starter`)
					?.solutionLink
			).toBe(`${root}/solution`);
			expect(project.content).toContain("Confirm");
			expect(project.content).toContain("Python IDE");
			expect(project.content).toContain("save/export");
		}
	});

	it("distinguishes logarithmic binary comparisons from recursive slice copying", () => {
		const module = requireSourceModule("AM7 Binary Search");
		const project = module.curriculum.find(
			item => item.title === "AM7 Project 1: Binary Search Implementation"
		)!;
		expect(project.content).toContain("bin_search_iter(lst, item)");
		expect(project.content).toContain("bin_search_recur(lst, item)");
		expect(project.content).toContain(
			"returning True for membership and False"
		);
		const analysis = module.curriculum.find(
			item => item.title === "Binary Search Big-O Analysis"
		)!.content;
		for (const contract of [
			"`O(log n)` comparisons",
			"constant-time indexed access and index bounds",
			"original recursive reference uses list slices",
			"worst-case copying work is `O(n)`",
			"outside the search"
		]) {
			expect(analysis).toContain(contract);
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
