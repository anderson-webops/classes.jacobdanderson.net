import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { earlyElementaryAMaterials } from "@/stores/courses/earlyElementaryAMaterials";
import { earlyElementaryMathACourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"EEA1 Addition and Subtraction within 20",
	"EEA2 Addition and Subtraction within 100",
	"EEA3 Representing Word Problems",
	"EEA4 Module Project: Escape the Game",
	"EEA5 Measuring and Estimating Length in Standard Units",
	"EEA6 Relating Addition and Subtraction to Length",
	"EEA7 Module Project: The Longest Sandwich in California",
	"EEA8 Understanding Place Value",
	"EEA9 Adding and Subtracting within 200",
	"EEA10 Representing Advanced Word Problems",
	"EEA11 Adding and Subtracting within 1000",
	"EEA12 Strategies to Add and Subtract within 1000",
	"EEA13 Module Project: Going TikTok Famous",
	"Check-in #1",
	"EEA14 Working with Equal Groups",
	"EEA15 Partitioning Rectangles",
	"EEA16 Time",
	"EEA17 Money",
	"EEA18 Visualizing Data",
	"EEA19 Polygons and Circles",
	"EEA20 Module Project: The Next Hit iPhone",
	"Check-in #2"
];

function requireModule(title: string) {
	const module = earlyElementaryMathACourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module)
		throw new Error(`Expected Early Elementary A module ${title}.`);
	return module;
}

describe("Early Elementary A math learner flow", () => {
	it("keeps the original mathematical progression without asset bookkeeping", () => {
		expect(
			earlyElementaryMathACourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			earlyElementaryMathACourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, visual strategy targets, and explicit paths", () => {
		for (const module of earlyElementaryMathACourse.modules) {
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

	it("preserves every authored activity while making extensions optional", () => {
		const requiredCount = earlyElementaryMathACourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = earlyElementaryMathACourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(48);
		expect(optionCount).toBe(44);
		expect(
			requireModule(
				"EEA4 Module Project: Escape the Game"
			).curriculum.map(item => item.title)
		).toEqual([
			"Concepts: Escape the Game",
			"Escape the Game Character Budget",
			"Liang Escape Route Grid"
		]);
		expect(
			requireModule("EEA4 Module Project: Escape the Game")
				.curriculum.slice(1)
				.every(item =>
					item.content.includes("**Completion evidence:**")
				)
		).toBe(true);
	});

	it("frames familiar scenarios as neutral math contexts", () => {
		expect(
			requireModule("EEA13 Module Project: Going TikTok Famous")
				.curriculum[0]?.content
		).toContain("no social-media account or platform use is needed");
		expect(
			requireModule("EEA20 Module Project: The Next Hit iPhone")
				.curriculum[0]?.content
		).toContain("not a purchase endorsement");
	});

	it("assigns both complete escape cases outside the concept reading", async () => {
		const course = await loadRawCourse("early-elementary-a-math");
		const module = course!.modules.find(candidate =>
			candidate.title.startsWith("EEA4 ")
		)!;
		expect(module.curriculum.map(item => item.title)).toEqual([
			"Escape the Game Core Concepts",
			"Escape the Game Character Budget",
			"Liang Escape Route Grid"
		]);
		expect(module.curriculum[0].contentKind).toBe("reading");
		for (const item of module.curriculum.slice(1)) {
			expect(item.contentKind).toBe("assignment");
			expect(item.preserveInstructions).toBe(true);
			expect(item.content).toContain("Project self-check");
		}
		expect(module.curriculum[1].content).toContain(
			"| Suit | Rocket | 45 |"
		);
		expect(module.curriculum[2].content).toContain(
			"five squares across and 25 squares up"
		);
	});

	it("keeps unavailable source-image bookkeeping out of the learner flow", async () => {
		const course = await loadRawCourse("early-elementary-a-math");
		expect(course).not.toBeNull();

		const text = JSON.stringify(
			course!.modules.filter(module => module.kind !== "appendix")
		);
		for (const filename of [
			"check_in_1_length_0.png",
			"check_in_2_money_1.png",
			"mfa18_pset1_0.png",
			"module_example.png"
		]) {
			expect(text).not.toContain(filename);
		}
		expect(
			course!.modules.find(
				module => module.title === "Pending Source Media Inventory"
			)?.kind
		).toBe("appendix");
	});

	it("supplies methods, cases and self-checks throughout the complete course", async () => {
		const course = await loadRawCourse("early-elementary-a-math");
		const modules = course!.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(modules).toHaveLength(22);
		const core = modules.flatMap(module => module.curriculum);
		const optional = modules.flatMap(module => module.supplementalProjects);
		expect(
			core.filter(item => item.contentKind === "reading")
		).toHaveLength(22);
		expect(
			core.filter(item => item.contentKind === "assignment")
		).toHaveLength(26);
		expect(optional).toHaveLength(44);
		for (const material of earlyElementaryAMaterials) {
			expect(
				core.some(item => item.content.includes(material.method))
			).toBe(true);
			expect(
				core.some(item => item.content.includes(material.worked))
			).toBe(true);
			for (const task of material.tasks)
				expect(
					core.find(item => item.title === task.title)?.content
				).toContain(task.prompt);
		}
		for (const item of [
			...core.filter(item => item.contentKind === "assignment"),
			...optional
		]) {
			expect(item.content).toContain("Project self-check");
			expect(item.preserveInstructions).toBe(true);
		}
		const followerModule = modules.find(module =>
			module.title.startsWith("EEA13 ")
		)!;
		expect(
			followerModule.curriculum.map(item => item.content).join("\n")
		).not.toMatch(/one billion|1,000,000,000|1295/);
		expect(followerModule.supplementalProjects[1].content).toContain(
			"1,000,000,000"
		);
		expect(followerModule.supplementalProjects[1].learningPath).toBe(
			"challenge"
		);
	});
});
