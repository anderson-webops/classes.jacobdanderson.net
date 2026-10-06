import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel2Course } from "@/stores/courses/cpp-level-2";
import { cppLifetimeProjectBriefs } from "@/stores/courses/cppLifetimeProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";
import progressBaseline from "./fixtures/cpp-level-2-progress.json";

const source = "https://github.com/instruction-material/CPP-Level-2/tree/main/";

describe("opening C++ Level 2 learner and reference workflows", () => {
	it("preserves every existing public progress identity and path", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("cpp-level-2");
		expect(
			course!.modules.map(module => ({
				id: module.id,
				title: module.title,
				curriculum: module.curriculum.map(item => ({
					id: item.id,
					title: item.title,
					learningPath: item.learningPath
				})),
				supplementalProjects: module.supplementalProjects.map(item => ({
					id: item.id,
					title: item.title,
					learningPath: item.learningPath
				}))
			}))
		).toEqual(progressBaseline);
	});
	it("imports separate learner packs while keeping the ownership helper optional", async () => {
		const normalized = await loadRawCourse("cpp-level-2");
		for (const course of [cppLevel2Course, normalized!]) {
			const module = course.modules[0];
			const tracing = module.curriculum[3];
			const ownership = module.supplementalProjects[0];
			expect(tracing.learningPath).toBe("core");
			expect(ownership.learningPath).toBe("choice");
			for (const [item, folder, brief] of [
				[
					tracing,
					"CPPM0-Lifetime-Tracing-Warm-Up",
					cppLifetimeProjectBriefs.tracing
				],
				[
					ownership,
					"CPPM0-Ownership-Boundary-Debugging",
					cppLifetimeProjectBriefs.ownership
				]
			] as const) {
				expect(item.projectLink).toBe(`${source}${folder}/starter`);
				expect(item.solutionLink).toBe(`${source}${folder}/solution`);
				if (course === cppLevel2Course)
					expect(item.content).toBe(
						brief.replaceAll(/\bTODO\b/g, "`TODO`")
					);
				for (const command of brief.matchAll(
					/```sh\n([\s\S]*?)\n```/g
				)) {
					expect(item.content).toContain(command[1]);
				}
				expect(item.content).toContain("## Native workflow");
				expect(item.content).toContain("verify-lifetime-projects.py");
			}
		}
	});
	it("keeps full instructional programs and the explicit diagnostic failure boundary", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("cpp-level-2");
		const [position, readiness, references, trace] =
			course!.modules[0].curriculum;
		const pointers = course!.modules[1].curriculum[0];
		for (const concept of [position, references, pointers]) {
			expect(concept.projectLink).toBeUndefined();
		}
		for (const [item, brief] of [
			[readiness, cppLifetimeProjectBriefs.diagnostics],
			[references, cppLifetimeProjectBriefs.references],
			[pointers, cppLifetimeProjectBriefs.pointers]
		] as const) {
			const supplied = brief.match(/```cpp\n([\s\S]*?)\n```/)![1];
			expect(item.content).toContain(supplied);
		}
		expect(readiness.content).toContain("heap-use-after-free");
		expect(readiness.content).toMatch(/trace\s+fallback/);
		expect(readiness.content).toContain("memory-check-debug --invalid");
		expect(references.content).toMatch(
			/a separate result is also permitted/
		);
		expect(pointers.content).toContain(
			"a non-null address can still dangle"
		);
		expect(trace.content).toMatch(/four\s+prediction notes/);
		for (const module of course!.modules.slice(0, 2)) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				expect(item.solutionLink).toBeUndefined();
			}
		}
	});
	it("retains the question-only pointer starter and the saved diagram extension", async () => {
		const course = await loadRawCourse("cpp-level-2");
		const project = course!.modules[1].curriculum[1];
		expect(project.projectLink).toBe(`${source}CPPM1-Pointers-Starter`);
		expect(project.solutionLink).toBe(`${source}CPPM1-Pointers`);
		expect(project.content).toContain("all ten prompts");
		expect(project.content).toContain("legacy starter Makefile");
		expect(project.content).toContain("ill-typed examples in comments");
		const extension = course!.modules[0].supplementalProjects[1];
		expect(extension.learningPath).toBe("challenge");
		expect(extension.projectLink).toBeUndefined();
		expect(extension.solutionLink).toBeUndefined();
		expect(extension.content).toContain("[site code IDE](/ide/code)");
		expect(extension.content).toContain(
			"select that saved project from Projects"
		);
		expect(extension.content).toContain("normal and changed-case trace");
	});
});
