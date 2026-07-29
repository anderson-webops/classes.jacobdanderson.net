import { describe, expect, it } from "vitest";
import { usacoBronzeCourse } from "@/stores/courses/usaco-bronze";

const EXPECTED_PRIMARY_SEQUENCE = [
	"USB0 Setup and Contest Workflow",
	"Unit 1: Simulation and Careful Translation",
	"Unit 2: Intervals, Arrays, and Greedy Warmups",
	"Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts",
	"Unit 4: Complete Search, Structured State, and Construction",
	"Unit 5: Mock Contests, Postmortems, and Silver Readiness"
];

function requireModule(title: string) {
	const module = usacoBronzeCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected USACO Bronze module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return usacoBronzeCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function courseResourceText() {
	return usacoBronzeCourse.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

describe("USACO Bronze learner flow", () => {
	it("uses one six-module Bronze spine and two explicit practice appendices", () => {
		expect(
			usacoBronzeCourse.modules.slice(0, 6).map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(usacoBronzeCourse.modules).toHaveLength(8);
		expect(usacoBronzeCourse.modules.slice(6)).toMatchObject([
			{
				kind: "appendix",
				title: "Optional Bronze Problem Bank and Language Mirrors"
			},
			{
				kind: "appendix",
				title: "Optional Java Bronze Practice Studios"
			}
		]);
	});

	it("gives every required module pacing, milestones, and explicit paths", () => {
		for (const module of usacoBronzeCourse.modules.slice(0, 6)) {
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

	it("preserves the complete repository bank while reducing the required path", () => {
		const curriculumTitles = usacoBronzeCourse.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);
		const optionTitles = usacoBronzeCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(41);
		expect(optionTitles).toHaveLength(102);
		for (const title of [
			"Problem Bank: Full Bronze Repo",
			"UB 12 Barn Repair Java: Core Project",
			"UB 13 Combination Lock Java: Core Project",
			"UB 14 Prime Cryptarithm Java: Core Project",
			"UB 15 Ski Course Design Java: Core Project",
			"UB 16 Wormholes Java: Core Project",
			"UB 17 Block Game Java: Core Project",
			"UB 18 The Cow Signal Java: Core Project",
			"UB 19 Don't Be Last Java: Core Project",
			"UB 20 Hoof Paper Scissors Java: Core Project",
			"UB 21 Cow Tipping Java: Core Project"
		]) {
			expect(optionTitles, title).toContain(title);
		}
	});

	it("matches the current contest, I/O, scoring, and technical contract", () => {
		const text = courseText();
		const resources = courseResourceText();

		expect(text).toContain("three or four algorithmic problems");
		expect(text).toContain("four-to-five-hour personal window");
		expect(text).toContain("partial credit");
		expect(text).toContain(
			"Current contests use terminal-based standard input"
		);
		expect(text).toContain("before December 2020");
		expect(text).toContain("wrong answer");
		expect(text).toContain("time limit");
		expect(text).toContain("runtime or memory error");
		expect(text).toContain("promotion thresholds can change");
		expect(text).toContain("C, C++, Java, and Python");
		expect(text).toContain("Bronze problems are generally designed");
		expect(text).toContain("64-bit");
		expect(resources).toContain("usaco.org/index.php?page=instructions");
		expect(resources).toContain("usaco.org/index.php?page=contests");
	});

	it("adds current patterns, protected practice, postmortems, and a Silver gate", () => {
		const setup = moduleText("USB0 Setup and Contest Workflow");
		const counting = moduleText(
			"Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts"
		);
		const construction = moduleText(
			"Unit 4: Complete Search, Structured State, and Construction"
		);
		const mock = moduleText(
			"Unit 5: Mock Contests, Postmortems, and Silver Readiness"
		);

		expect(setup).toContain("Generative AI");
		expect(setup).toContain("prewritten templates");
		expect(setup).toContain("automated submissions");
		expect(setup).toContain("Begin from an empty solution file");
		expect(counting).toContain("maps, sets, sorting, and prefix counts");
		expect(counting).toContain("one million values");
		expect(construction).toContain("Constructive output");
		expect(construction).toContain("validate the witness");
		expect(construction).toContain("total-input bound");
		expect(mock).toContain("2025–26 Bronze");
		expect(mock).toContain("three unseen Bronze problems");
		expect(mock).toContain("smallest counterexample");
		expect(mock).toContain("two complete independent solves");
		expect(mock).toContain("Promotion thresholds vary by contest");
	});
});
