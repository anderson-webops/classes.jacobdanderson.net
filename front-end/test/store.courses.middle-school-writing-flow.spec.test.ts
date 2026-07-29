import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { middleSchoolWritingCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
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

function requireModule(title: string) {
	const module = middleSchoolWritingCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Writing module ${title}.`);
	return module;
}

describe("Middle School B Writing learner flow", () => {
	it("keeps separate analytical and fiction arcs", () => {
		expect(
			middleSchoolWritingCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			middleSchoolWritingCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
		expect(EXPECTED_MODULE_SEQUENCE.indexOf("MSB Check-In #1")).toBe(
			EXPECTED_MODULE_SEQUENCE.indexOf("MSB7 Character Development") - 1
		);
	});

	it("gives every module pacing, writing targets, and explicit paths", () => {
		for (const module of middleSchoolWritingCourse.modules) {
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

	it("restores standard prompts instead of retake-prefixed prompts", () => {
		const text = JSON.stringify(middleSchoolWritingCourse);
		expect(text).not.toContain("Retake focus:");
		expect(
			requireModule("MSB1 Arguments & Evidence").curriculum[1]?.content
		).toContain("Steph Curry");
	});

	it("preserves source work and makes the final presentation a choice", () => {
		const requiredCount = middleSchoolWritingCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = middleSchoolWritingCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const masterProject = requireModule("MSB12 Master Project");

		expect(requiredCount).toBe(32);
		expect(optionCount).toBe(30);
		expect(masterProject.curriculum.map(item => item.title)).toEqual([
			"Concepts: Master Project",
			"Master Project Path and Evidence Plan"
		]);
		expect(
			masterProject.supplementalProjects
				.filter(item =>
					[
						"Analytical Writing Presentation",
						"Fiction Writing Presentation"
					].includes(item.title)
				)
				.every(item => item.learningPath === "choice")
		).toBe(true);
	});

	it("provides accessible tools and source alternatives", () => {
		expect(
			requireModule("MSB4 Analyzing Evidence").curriculum[0]?.content
		).toContain("lawful copy of Car Ride or an equivalent passage");
		expect(
			requireModule("MSB6 Color Coding & Revision").curriculum[0]?.content
		).toContain("colors, labels, symbols, underlines, or tags");
		expect(
			requireModule("MSB9 Generating Conflict & Structuring Plot")
				.curriculum[0]?.content
		).toContain("hand-drawn, text-only, or instructor-supplied plot curve");
	});

	it("keeps unavailable diagram bookkeeping out of the course", async () => {
		const course = await loadRawCourse("middle-school-b-writing");
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
