import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import { cppLevel2Course } from "@/stores/courses/cpp-level-2";
import { cppDynamicMemoryProjectBriefs } from "@/stores/courses/cppDynamicMemoryProjectBriefs";

const source = "https://github.com/instruction-material/CPP-Level-2/tree/main/";
const moduleTitle = "CPPM4 Dynamic Memory and Custom Dynamic Arrays";

describe("CPPM4 dynamic-memory catalog workflows", () => {
	it("loads the complete lesson and keeps required and optional builds distinct", async () => {
		setActivePinia(createPinia());
		useAppStore().setCurrentTutor({
			_id: "tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["cpp-level-2"],
			editTutors: false,
			saveEdit: "Save"
		});
		for (const course of [
			cppLevel2Course,
			(await useCoursesStore().loadCourseById("cpp-level-2"))!
		]) {
			const module = course.modules.find(
				item => item.title === moduleTitle
			)!;
			const lesson = module.curriculum.find(
				item => item.title === "Dynamic Allocation and Manual Ownership"
			)!;
			expect(lesson.projectLink).toBe(
				source + "CPPM4-Dynamic-Variables-Reference"
			);
			expect(lesson.ideImport).toBe(true);
			expect(lesson.content).toContain("## Complete worked program");
			for (const [title, folder, role] of [
				[
					"CPPM4 Project 2: Dynamic Array Implementation",
					"CPPM4-Dynamic-Array-Implementation",
					"core"
				],
				[
					"CPPM4 Project 1: Assembly Line",
					"CPPM4-Assembly-Line",
					"choice"
				],
				[
					"CPPM4 Project 3: Grocery List",
					"CPPM4-Grocery-List",
					"challenge"
				]
			] as const) {
				const item = [
					...module.curriculum,
					...module.supplementalProjects
				].find(item => item.title === title)!;
				expect(item.learningPath).toBe(role);
				expect(item.projectLink).toBe(`${source}${folder}-Starter`);
				expect(item.solutionLink).toBe(source + folder);
				expect(item.ideImport).toBe(true);
				expect(item.projectLink).not.toBe(item.solutionLink);
			}
			const gate = module.curriculum.findIndex(
				item =>
					item.title ===
					"Copy-Control Gate: Rule of Three and Rule of Five"
			);
			expect(gate).toBeGreaterThan(0);
			expect(gate).toBeLessThan(
				module.curriculum.findIndex(
					item =>
						item.title ===
						"CPPM4 Project 2: Dynamic Array Implementation"
				)
			);
			const reflection = module.supplementalProjects.find(
				item =>
					item.title ===
					(course === cppLevel2Course
						? "Dynamic Memory: Verification and Reflection"
						: "Verification Review: Dynamic Memory")
			)!;
			expect(reflection.projectLink).toBeUndefined();
			expect(reflection.solutionLink).toBeUndefined();
			expect(reflection.content).toContain(
				"saved Dynamic Array Implementation attempt"
			);
		}
	});
	it("offers four independent current-pack keys while retaining earlier attempts", () => {
		const keys = new Set<string>();
		for (const [name, folder] of [
			["lifetime", "CPPM4-Dynamic-Variables-Reference"],
			["array", "CPPM4-Dynamic-Array-Implementation-Starter"],
			["assembly", "CPPM4-Assembly-Line-Starter"],
			["grocery", "CPPM4-Grocery-List-Starter"]
		] as const) {
			const brief = cppDynamicMemoryProjectBriefs[name];
			const href = brief.match(/\]\((\/ide\?[^)]+)\)/)![1];
			const params = new URL(href, "https://classes.local").searchParams;
			expect(params.get("course")).toBe("cpp-level-2");
			expect(params.get("mode")).toBe("cpp");
			expect(params.get("projectKey")).toBe(
				`cpp-level-2:${folder.toLowerCase()}:current-pack-v1`
			);
			expect(params.get("starterUrl")).toBe(source + folder);
			expect(params.get("lesson")).toBe(
				"cpp-level-2-cppm4-dynamic-memory-and-custom-dynamic-arrays"
			);
			expect(brief).toContain(
				"earlier project\nremains available in Projects"
			);
			keys.add(params.get("projectKey")!);
		}
		expect(keys.size).toBe(4);
	});
	it("preserves original tasks, precise failure boundaries and native instructions", () => {
		const { lifetime, array, assembly, grocery, copyControl, reflection } =
			cppDynamicMemoryProjectBriefs;
		expect(lifetime).toContain("does not set the\npointer to null");
		expect(array).toContain("81-value");
		expect(array).toContain("std::out_of_range");
		expect(assembly).toContain("base/member initialization");
		expect(assembly).toContain("pounds / 2.205");
		expect(assembly).toContain("1 through 20");
		expect(grocery).toContain("std::unique_ptr<Grocery[]>");
		expect(grocery).toContain("does not undo an already completed removal");
		expect(grocery).toContain("Rule of Zero");
		expect(copyControl).toContain(
			"Self-assignment and moved-from-state rules"
		);
		expect(reflection).toContain("no duplicate project import");
		for (const text of [array, assembly, grocery]) {
			expect(text).toContain("unfinished");
			expect(text).toContain("make main main-debug");
			expect(text).toContain("ASAN_OPTIONS=detect_leaks=0");
			expect(text.toLowerCase()).toContain("completion evidence");
		}
	});
});
