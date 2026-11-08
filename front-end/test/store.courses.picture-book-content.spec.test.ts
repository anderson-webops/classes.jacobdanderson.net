import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { pictureBookGuidance } from "@/stores/courses/pictureBookGuidance";

describe("Picture book complete writing instruction", () => {
	it("supplies every worked lesson and complete practice case in source order", async () => {
		const course = (await loadRawCourse(
			"early-elementary-b-picture-book"
		))!;
		const modules = course.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(modules.map(module => module.title)).toEqual(
			pictureBookGuidance.map(unit => unit.module)
		);
		for (const unit of pictureBookGuidance) {
			const module = modules.find(
				module => module.title === unit.module
			)!;
			expect(module.curriculum[0].content).toContain(unit.method);
			expect(module.curriculum[0].content).toContain(unit.worked);
			expect(module.curriculum[0].content).not.toContain(
				"speech outline with purpose"
			);
			for (const task of [unit.practice, unit.challenge]) {
				const item = module.supplementalProjects.find(item =>
					item.content.includes(task.prompt)
				)!;
				expect(item.contentKind).toBe("assignment");
				expect(
					item.preserveInstructions && item.preserveAssignment
				).toBe(true);
				expect(item.content).toContain("Project self-check");
			}
		}
	});
	it("restores the merged projects as complete separate assignments", async () => {
		const course = (await loadRawCourse(
			"early-elementary-b-picture-book"
		))!;
		const module = course.modules.find(
			module => module.title === "WYB9 Narrative Writing"
		)!;
		expect(module.curriculum.slice(1).map(item => item.title)).toEqual([
			"Gabby Tries Narrative Map",
			"Brainstorm Bonanza Story Plan",
			"Picture Book Plot Diagram"
		]);
		expect(
			module.curriculum
				.slice(1)
				.every(
					item =>
						item.contentKind === "assignment" &&
						item.preserveAssignment
				)
		).toBe(true);
		expect(module.curriculum[3].content).toContain(
			"first attempt and result"
		);
	});
	it("provides the missing grammar cases and a finished book requirement", async () => {
		const course = (await loadRawCourse(
			"early-elementary-b-picture-book"
		))!;
		const items = course.modules.flatMap(module => module.curriculum);
		expect(
			items.find(item => item.title === "Heads Up Word-Sort Game")!
				.content
		).toContain("ten word-and-sentence cards");
		expect(
			items.find(item => item.title === "Which Word Works Context Cases")!
				.content
		).toContain("A small cat purrs peacefully in a lap");
		expect(
			items.find(
				item => item.title === "Picture Book Assembly Portfolio"
			)!.content
		).toContain("finished pages with the actual text and pictures");
		const agreement = pictureBookGuidance.find(
			unit => unit.module === "WYB7 Subject-Verb Agreement"
		)!;
		expect(agreement.method).toContain("I and you use the base form");
	});
	it("keeps the original named-text dependency distinct from new model stories", async () => {
		const course = (await loadRawCourse(
			"early-elementary-b-picture-book"
		))!;
		const module = course.modules.find(
			module => module.title === "WYB9 Narrative Writing"
		)!;
		expect(module.curriculum[1].content).toContain(
			"The text of Gabby Tries is not included"
		);
		expect(module.curriculum[0].content).toContain(
			"original Nico practice story"
		);
	});
});
