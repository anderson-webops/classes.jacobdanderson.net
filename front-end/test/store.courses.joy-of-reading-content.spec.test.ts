import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { joyOfReadingGuidance } from "@/stores/courses/joyOfReadingGuidance";

describe("Joy of Reading on-site explanations and practice", () => {
	it("preserves the source sequence and supplies eight worked explanations", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const modules = course!.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(modules.map(module => module.title)).toEqual(
			joyOfReadingGuidance.map(unit => unit.module)
		);
		for (const material of joyOfReadingGuidance) {
			const module = modules.find(
				module => module.title === material.module
			)!;
			expect(module.curriculum[0].contentKind).toBe("reading");
			expect(module.curriculum[0].content).toContain(material.method);
			expect(module.curriculum[0].content).toContain(material.worked);
			for (const kind of ["practice", "challenge"] as const)
				expect(
					module.supplementalProjects.some(item =>
						item.content.includes(material[kind].prompt)
					)
				).toBe(true);
		}
	});
	it("restores both character assignments while preserving the reading identity", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const module = course!.modules.find(
			module => module.title === "JoR1 Characters"
		)!;
		expect(module.curriculum.map(item => item.title)).toEqual([
			"Characters Core Concepts",
			"Character Investigator Report",
			"Sweet Sixteen Character Evidence"
		]);
		expect(
			module.curriculum
				.slice(1)
				.every(
					item =>
						item.contentKind === "assignment" &&
						item.preserveAssignment &&
						item.preserveInstructions
				)
		).toBe(true);
	});
	it("requires a finished chosen capstone response and retains both original options", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const module = course!.modules.find(
			module => module.title === "JoR6 Master Project"
		)!;
		expect(module.curriculum[1].content).toContain(
			"Complete the selected response and document one revision."
		);
		const choices = module.supplementalProjects.filter(item =>
			[
				"Bacon and Mittens Review or Figurative Art",
				"Dinosaur Footprint Interview or News Report"
			].includes(item.title)
		);
		expect(choices).toHaveLength(2);
		expect(
			choices.every(
				item =>
					item.learningPath === "choice" &&
					item.contentKind === "assignment"
			)
		).toBe(true);
	});
	it("provides sentence context without forcing an unsupported personification label", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const module = course!.modules.find(
			module => module.title === "JoR5 Figurative Language"
		)!;
		expect(module.curriculum[0].content).toContain(
			"Categories can overlap"
		);
		expect(module.curriculum[1].content).toContain(
			"The wind whispered a secret"
		);
		expect(module.curriculum[1].content).toContain(
			"strong motion alone does not establish human behavior"
		);
		expect(module.curriculum[1].content).toContain("Project self-check");
	});
	it("keeps the unresolved original-text dependency explicit", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		const text = course!.modules[0].curriculum[0].content;
		expect(text).toContain("The named story texts are not included");
		expect(text).not.toContain("Break a typical problem");
	});
});
