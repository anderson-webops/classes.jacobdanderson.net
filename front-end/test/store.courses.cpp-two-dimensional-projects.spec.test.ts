import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel2Course } from "@/stores/courses/cpp-level-2";
import { cppTwoDimensionalProjectBriefs } from "@/stores/courses/cppTwoDimensionalProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const source = "https://github.com/instruction-material/CPP-Level-2/tree/main/";
const moduleTitle = "CPPM3 Two-Dimensional Arrays and Layout";

describe("CPPM3 two-dimensional lesson and learner workflows", () => {
	it("retains the worked-lesson import in the actual loaded catalog", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("cpp-level-2"))!;
		const module = course.modules.find(item => item.title === moduleTitle)!;
		const lesson = module.curriculum.find(
			item =>
				item.title ===
				"Two-Dimensional Arrays, Layout, and Function Boundaries"
		)!;
		expect(lesson.ideImport).toBe(true);
		expect(lesson.projectLink).toBe(
			source + "CPPM3-Two-Dimensional-Arrays-Reference"
		);
		expect(lesson.learningPath).toBe("core");
	});
	it("keeps required calculations, optional ledger and distinct extension in their roles", async () => {
		for (const course of [
			cppLevel2Course,
			(await loadRawCourse("cpp-level-2"))!
		]) {
			const module = course.modules.find(
				item => item.title === moduleTitle
			)!;
			const practice = module.curriculum.find(
				item =>
					item.projectLink ===
					source + "CPPM3-2D-Array-Practice-Starter"
			)!;
			const bank = module.supplementalProjects.find(
				item =>
					item.projectLink ===
					source + "CPPM3-Bank-Transactions-Starter"
			)!;
			const extension = module.supplementalProjects.find(
				item =>
					item.projectLink ===
					source + "CPPM3-2D-Array-Extension-Starter"
			)!;
			for (const [item, folder, role] of [
				[practice, "CPPM3-2D-Array-Practice", "core"],
				[bank, "CPPM3-Bank-Transactions", "choice"],
				[extension, "CPPM3-2D-Array-Extension", "challenge"]
			] as const) {
				expect(item.learningPath).toBe(role);
				expect(item.projectLink).toBe(`${source}${folder}-Starter`);
				expect(item.solutionLink).toBe(source + folder);
				expect(item.content).toContain("verify-2d-array-projects.py");
			}
			expect(
				module.curriculum.some(item => item.title === bank.title)
			).toBe(false);
		}
	});
	it("explains distinct storage shapes, original tasks and fractional-average ownership", () => {
		const { layout, practice } = cppTwoDimensionalProjectBriefs;
		expect(practice).toContain("separate project for checked coordinates");
		for (const text of [
			"A cast does not create a new flat array object",
			"const int rows[][3]",
			"neither `int*` nor `int**`",
			"capacity",
			"lifetime"
		])
			expect(layout).toContain(text);
		for (const text of [
			"sumArray",
			"minArray",
			"multTable",
			"averageArray",
			"owning `double*`",
			"1.5",
			"long double",
			"std::overflow_error",
			"INT_MAX",
			"Value-initialize",
			"release every allocated row",
			"delete[] result",
			"Preserve all input values"
		])
			expect(practice).toContain(text);
	});
	it("states ledger commit boundaries and new coordinate/column tasks", () => {
		const { bank, extension } = cppTwoDimensionalProjectBriefs;
		expect(bank).toContain("independent work or an instructor walkthrough");
		for (const text of [
			"int balances[4][5]",
			"three transaction rows",
			"initializeLedger",
			"recordTransaction",
			"only the requested initialized row prefix",
			"before any mutation",
			"End-of-input",
			"status one"
		])
			expect(bank).toContain(text);
		for (const text of [
			"checkedCell",
			"columnAverages",
			"std::out_of_range",
			"before forming an offset",
			"per **column**",
			"No required-practice body is repeated",
			"two unfinished task bodies"
		])
			expect(extension).toContain(text);
	});
	it("offers four separate current-pack keys without replacing earlier work", () => {
		const keys = new Set<string>();
		for (const [name, folder] of [
			["layout", "CPPM3-Two-Dimensional-Arrays-Reference"],
			["practice", "CPPM3-2D-Array-Practice-Starter"],
			["bank", "CPPM3-Bank-Transactions-Starter"],
			["extension", "CPPM3-2D-Array-Extension-Starter"]
		] as const) {
			const brief = cppTwoDimensionalProjectBriefs[name];
			const href = brief.match(/\]\((\/ide\?[^)]+)\)/)![1];
			const params = new URL(href, "https://classes.local").searchParams;
			expect(params.get("course")).toBe("cpp-level-2");
			expect(params.get("mode")).toBe("cpp");
			expect(params.get("starterUrl")).toBe(source + folder);
			expect(params.get("projectKey")).toBe(
				`cpp-level-2:${folder.toLowerCase()}:current-pack-v1`
			);
			expect(params.get("lesson")).toBe(
				"cpp-level-2-cppm3-two-dimensional-arrays-and-layout"
			);
			expect(brief).toContain(
				"earlier project\nremains available in Projects"
			);
			keys.add(params.get("projectKey")!);
		}
		expect(keys.size).toBe(4);
	});
});
