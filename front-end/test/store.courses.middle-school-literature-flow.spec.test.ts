import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { middleSchoolLiteratureCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"MSA1 Main Ideas & Supporting Evidence I",
	"MSA2 Main Ideas & Supporting Evidence II",
	"MSA3 Making Inferences",
	"MSA4 Show; Don't Tell",
	"MSA Check-In #1",
	"MSA5 Identifying Themes",
	"MSA6 Analyzing & Developing Themes",
	"MSA7 Analyzing Point of View",
	"MSA8 Analyzing Words & Phrases",
	"MSA9 Analyzing Rhyme & Alliteration",
	"MSA10 Analyzing Figurative Language",
	"MSA Check-In #2",
	"MSA11 Master Project"
];

function requireModule(title: string) {
	const module = middleSchoolLiteratureCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Literature module ${title}.`);
	return module;
}

describe("Middle School A Literature learner flow", () => {
	it("keeps the main-idea-to-craft-analysis progression", () => {
		expect(
			middleSchoolLiteratureCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			middleSchoolLiteratureCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
	});

	it("gives every module pacing, analysis targets, and explicit paths", () => {
		for (const module of middleSchoolLiteratureCourse.modules) {
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

	it("preserves all source tasks while keeping enrichment optional", () => {
		const requiredCount = middleSchoolLiteratureCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = middleSchoolLiteratureCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(27);
		expect(optionCount).toBe(26);
		expect(
			requireModule(
				"MSA1 Main Ideas & Supporting Evidence I"
			).curriculum.map(item => item.title)
		).toEqual([
			"Concepts: Main Ideas & Supporting Evidence I",
			"Lead Prankster Main Idea Model",
			"Kyra's Fear Main Idea and Evidence"
		]);
	});

	it("makes passage access and safe source use explicit", () => {
		expect(
			requireModule("MSA2 Main Ideas & Supporting Evidence II")
				.curriculum[0]?.content
		).toContain("lawful copy of Soccer Summer or an equivalent passage");
		expect(
			requireModule("MSA1 Main Ideas & Supporting Evidence I")
				.curriculum[1]?.content
		).toContain("without carrying it out");
		expect(
			requireModule("MSA11 Master Project").curriculum[1]?.content
		).toContain("Do not infer facts about real people");
	});

	it("keeps unavailable diagram bookkeeping out of the learner flow", async () => {
		const course = await loadRawCourse("middle-school-a-literature");
		expect(course).not.toBeNull();

		const text = JSON.stringify(
			course!.modules.filter(module => module.kind !== "appendix")
		);
		expect(text).not.toContain(
			"msa1_concept1_mainideasupportingevidence.png"
		);
		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
		expect(
			course!.modules.find(
				module => module.title === "Pending Source Media Inventory"
			)?.kind
		).toBe("appendix");
	});
});
