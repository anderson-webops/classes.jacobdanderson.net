import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel2Course } from "@/stores/courses/cpp-level-2";
import { cppArrayProjectBriefs } from "@/stores/courses/cppArrayProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const source = "https://github.com/instruction-material/CPP-Level-2/tree/main/";

describe("CPPM2 array lesson and learner workflows", () => {
	it("preserves configured worked-lesson imports through the learner catalog", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-2"))!;
		const module = course.modules.find(module => module.title === "CPPM2 Raw Arrays and Pointer Arithmetic")!;
		for (const [title, folder] of [["Raw Arrays as Contiguous Memory", "CPPM2-Array-Basics-Reference"], ["Pointer Arithmetic and Offset Reasoning", "CPPM2-Pointer-Arithmetic-Reference"]]) {
			const item = module.curriculum.find(item => item.title === title)!;
			expect(item.ideImport).toBe(true);
			expect(item.projectLink).toBe(source + folder);
		}
		expect([...module.curriculum, ...module.supplementalProjects].filter(item => item.ideImport).map(item => item.title)).toEqual(["Raw Arrays as Contiguous Memory", "Pointer Arithmetic and Offset Reasoning"]);
	});
	it("keeps required practice and an optional verification choice distinct", async () => {
		for (const course of [cppLevel2Course, (await loadRawCourse("cpp-level-2"))!]) {
			const module = course.modules.find(module => module.title === "CPPM2 Raw Arrays and Pointer Arithmetic")!;
			const practice = module.curriculum.find(item => item.title === "CPPM2 Project 1: Array Practice")!;
			const drill = module.supplementalProjects.find(item => item.title === "Raw Arrays: Verification Drill")!;
			expect(practice.learningPath).toBe("core");
			expect(drill.learningPath).toBe("choice");
			for (const item of [practice, drill]) {
				expect(item.projectLink).toBe(`${source}CPPM2-Array-Practice-Starter`);
				expect(item.solutionLink).toBe(`${source}CPPM2-Array-Practice`);
				expect(item.content).toContain("verify-array-projects.py");
			}
			expect(practice.content).toContain("four original tasks");
			expect(drill.content).toContain("Continue\nthe saved Array Practice attempt from Projects");
			expect(drill.content).toContain("rather than repeat the required implementation");
		}
	});
	it("keeps the optional flat-board integration separate from its reference", () => {
		const module = cppLevel2Course.modules.find(module => module.title === "CPPM2 Raw Arrays and Pointer Arithmetic")!;
		const game = module.supplementalProjects.find(item => item.title === "CPPM2 Project 2: Tic Tac Toe")!;
		expect(game.learningPath).toBe("choice");
		expect(game.projectLink).toBe(`${source}CPPM2-Tic-Tac-Toe-Starter`);
		expect(game.solutionLink).toBe(`${source}CPPM2-Tic-Tac-Toe`);
		for (const text of ["char square[10]", "unused marker", "applyMove", "checkwin", "board", "End-of-input exits once", "same player's turn", "completed board", "verify-tictactoe-project.py"]) expect(game.content).toContain(text);
	});
	it("states actual capacity, empty-range, ordered-prefix and byte-count contracts", () => {
		const brief = cppArrayProjectBriefs.practice;
		for (const text of ["0 <= size <= capacity", "INT_MIN", "INT_MAX", "std::overflow_error", "std::invalid_argument", "bytes", "285", "17", "four\npending tasks", "preserve every input element"]) expect(brief).toContain(text);
		expect(cppArrayProjectBriefs.arithmetic).toContain("Offset twenty is the\none-past pointer");
		expect(cppArrayProjectBriefs.arithmetic).toContain("attempts offset twenty-two");
		expect(cppArrayProjectBriefs.arithmetic).toContain("Keep both disabled");
		expect(cppArrayProjectBriefs.basics).toContain("does not work as an element count after an array parameter");
	});
	it("offers distinct fresh keys for both lessons and the learner pack", () => {
		const keys = new Set<string>();
		for (const [name, folder] of [["basics", "CPPM2-Array-Basics-Reference"], ["arithmetic", "CPPM2-Pointer-Arithmetic-Reference"], ["practice", "CPPM2-Array-Practice-Starter"], ["game", "CPPM2-Tic-Tac-Toe-Starter"]] as const) {
			const href = cppArrayProjectBriefs[name].match(/\]\((\/ide\?[^)]+)\)/)![1];
			const params = new URL(href, "https://classes.local").searchParams;
			expect(params.get("course")).toBe("cpp-level-2");
			expect(params.get("mode")).toBe("cpp");
			expect(params.get("starterUrl")).toBe(source + folder);
			expect(params.get("projectKey")).toBe(`cpp-level-2:${folder.toLowerCase()}:current-pack-v1`);
			expect(cppArrayProjectBriefs[name]).toContain("earlier project\nremains available in Projects");
			keys.add(params.get("projectKey")!);
		}
		expect(keys.size).toBe(4);
	});
});
