import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { middleSchoolWritingRetakeCourse } from "@/stores/courses/source-library-courses";

const TARGETED_REVIEW_MODULES = [
	"MSB1 Arguments & Evidence",
	"MSB2 Counterclaims",
	"MSB3 Integrating Evidence",
	"MSB4 Analyzing Evidence",
	"MSB5 Concluding Statements & Transitional Devices",
	"MSB6 Color Coding & Revision",
	"MSB Check-In #1",
	"MSB7 Character Development",
	"MSB8 Character Portraits",
	"MSB9 Generating Conflict & Structuring Plot",
	"MSB10 Manipulating Point of View",
	"MSB11 Writing an Original Short Story",
	"MSB Check-In #2",
	"MSB12 Master Project"
];

const EXPECTED_MODULE_SEQUENCE = [
	"MSB Retake Entry Diagnostic",
	...TARGETED_REVIEW_MODULES,
	"MSB Retake Exit Evidence"
];

function requireModule(title: string) {
	const module = middleSchoolWritingRetakeCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Writing Retake module ${title}.`);
	return module;
}

describe("Middle School B Writing Retake learner flow", () => {
	it("wraps targeted review between entry and exit evidence", () => {
		expect(
			middleSchoolWritingRetakeCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			requireModule("MSB Retake Entry Diagnostic").curriculum.map(
				item => item.title
			)
		).toEqual([
			"Concepts: Retake Entry Diagnostic",
			"Argument and Fiction Entry Diagnostic"
		]);
		expect(
			requireModule("MSB Retake Exit Evidence").curriculum.map(
				item => item.title
			)
		).toEqual([
			"Concepts: Retake Exit Evidence",
			"Before-and-After Retake Evidence Record"
		]);
	});

	it("marks review modules as choices selected from the diagnostic", () => {
		for (const title of TARGETED_REVIEW_MODULES) {
			const module = requireModule(title);
			expect(module.estimatedTime, title).toMatch(/session/);
			expect(module.keyBlocks?.length, title).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "choice"),
				title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				title
			).toBe(true);
			expect(module.curriculum[0]?.content, title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("requires only the diagnostic and exit comparison", () => {
		const curriculumItems = middleSchoolWritingRetakeCourse.modules.flatMap(
			module => module.curriculum
		);
		const supplementalItems =
			middleSchoolWritingRetakeCourse.modules.flatMap(
				module => module.supplementalProjects
			);

		expect(curriculumItems).toHaveLength(18);
		expect(supplementalItems).toHaveLength(52);
		expect(
			curriculumItems.filter(item => item.learningPath === "core")
		).toHaveLength(4);
		expect(
			curriculumItems.filter(item => item.learningPath === "choice")
		).toHaveLength(14);
	});

	it("uses fresh evidence and preserves both optional capstone paths", () => {
		expect(
			requireModule(
				"MSB1 Arguments & Evidence"
			).supplementalProjects.find(
				item => item.title === "Steph Curry Argument Parts Model"
			)?.content
		).toContain("Retake focus: revisit this skill with a fresh");
		expect(
			requireModule("MSB12 Master Project")
				.supplementalProjects.filter(item =>
					[
						"Analytical Writing Presentation",
						"Fiction Writing Presentation"
					].includes(item.title)
				)
				.every(item => item.learningPath === "choice")
		).toBe(true);
	});

	it("keeps unavailable diagram bookkeeping out of the retake", async () => {
		const course = await loadRawCourse("middle-school-b-writing-retake");
		expect(course).not.toBeNull();

		const text = JSON.stringify(course);
		for (const filename of [
			"msa15_concept2_transitionaldevices.png",
			"msa17_concept2_nemochart.png",
			"msa19_concept2_emptyplot.png",
			"msa19_concept2_labeledplot.png"
		]) {
			expect(text).not.toContain(filename);
		}
	});
});
