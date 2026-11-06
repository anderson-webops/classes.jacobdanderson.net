import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { lateElementaryAMaterials } from "@/stores/courses/lateElementaryAMaterials";
import { lateElementaryMathACourse } from "@/stores/courses/source-library-courses";

describe("Late Elementary A complete math materials", () => {
	it("preserves the sequential source topics and supplies every full reading and case", async () => {
		const course = await loadRawCourse("late-elementary-a-math");
		const modules = course!.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(modules.map(module => module.title.toLowerCase())).toEqual(
			lateElementaryMathACourse.modules.map(module =>
				module.title.toLowerCase()
			)
		);
		expect(modules).toHaveLength(19);
		const core = modules.flatMap(module => module.curriculum);
		const optional = modules.flatMap(module => module.supplementalProjects);
		expect(
			core.filter(item => item.contentKind === "reading")
		).toHaveLength(19);
		expect(
			core.filter(item => item.contentKind === "assignment")
		).toHaveLength(24);
		expect(optional).toHaveLength(38);
		for (const material of lateElementaryAMaterials) {
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
			expect(
				optional.some(item =>
					item.content.includes(material.practice.prompt)
				)
			).toBe(true);
			expect(
				optional.some(item =>
					item.content.includes(material.challenge.prompt)
				)
			).toBe(true);
		}
		const tasks = [
			...core.filter(item => item.contentKind === "assignment"),
			...optional
		];
		for (const item of tasks) {
			expect(item.preserveInstructions).toBe(true);
			expect(item.preserveAssignment).toBe(true);
			expect(item.content).toContain("Project self-check");
			expect(item.content).not.toContain("Break a typical problem");
		}
	});
	it("restores all nine merged tasks and keeps readings separate", async () => {
		const course = await loadRawCourse("late-elementary-a-math");
		for (const code of ["LEA4 ", "LEA9 ", "LEA13 ", "LEA17 "]) {
			const module = course!.modules.find(module =>
				module.title.startsWith(code)
			)!;
			expect(module.curriculum).toHaveLength(code === "LEA9 " ? 4 : 3);
			expect(module.curriculum[0].contentKind).toBe("reading");
			expect(
				module.curriculum
					.slice(1)
					.every(item => item.contentKind === "assignment")
			).toBe(true);
		}
	});
	it("distinguishes final angles, turn amounts and integer ratio reserves", async () => {
		const course = await loadRawCourse("late-elementary-a-math");
		const light = course!.modules.find(module =>
			module.title.startsWith("LEA13 ")
		)!;
		expect(light.curriculum[0].content).toContain("90 - 23 = 67");
		expect(light.curriculum[2].content).toContain("amount turned");
		const funding = course!.modules.find(module =>
			module.title.startsWith("LEA9 ")
		)!;
		expect(funding.curriculum[3].content).toContain(
			"smallest possible unallocated reserve"
		);
		expect(funding.curriculum[3].content).toContain("fictional");
	});
});
