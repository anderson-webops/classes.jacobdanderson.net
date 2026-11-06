import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { earlyElementaryBMaterials } from "@/stores/courses/earlyElementaryBMaterials";
import { earlyElementaryMathBCourse } from "@/stores/courses/source-library-courses";

describe("Early Elementary B complete math materials", () => {
	it("preserves the sequential source topics and supplies every full reading and case", async () => {
		const course = await loadRawCourse("early-elementary-b-math");
		const modules = course!.modules.filter(
			module => module.kind !== "appendix"
		);
		expect(modules.map(module => module.title.toLowerCase())).toEqual(
			earlyElementaryMathBCourse.modules.map(module =>
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
		).toHaveLength(23);
		expect(optional).toHaveLength(38);
		for (const material of earlyElementaryBMaterials) {
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
	it("assigns all eight previously merged project cases outside their readings", async () => {
		const course = await loadRawCourse("early-elementary-b-math");
		for (const code of ["EEB8 ", "EEB11 ", "EEB14 ", "EEB17 "]) {
			const module = course!.modules.find(module =>
				module.title.startsWith(code)
			)!;
			expect(module.curriculum).toHaveLength(3);
			expect(module.curriculum[0].contentKind).toBe("reading");
			expect(
				module.curriculum
					.slice(1)
					.every(item => item.contentKind === "assignment")
			).toBe(true);
			expect(module.curriculum[0].content).not.toContain("**Problems**");
		}
	});
	it("states units, fictional data, half-unit reasoning and strict comparison boundaries", async () => {
		const course = await loadRawCourse("early-elementary-b-math");
		const byCode = (code: string) =>
			course!.modules.find(module => module.title.startsWith(code))!;
		expect(byCode("EEB8 ").curriculum[0].content).toContain(
			"Two days at eleven and a half"
		);
		expect(byCode("EEB8 ").curriculum[1].content).toContain(
			"fictional arithmetic case"
		);
		expect(byCode("EEB9 ").curriculum[1].content).toContain(
			"250 milliliters"
		);
		expect(byCode("EEB11 ").curriculum[1].content).toContain(
			"fictional case data"
		);
		expect(byCode("EEB13 ").curriculum[1].content).toContain(
			"sandwich A into thirds"
		);
		expect(byCode("EEB17 ").curriculum[1].content).toContain(
			"strictly below half"
		);
		expect(byCode("EEB16 ").curriculum[0].content).toContain(
			"inclusive definition"
		);
	});
});
