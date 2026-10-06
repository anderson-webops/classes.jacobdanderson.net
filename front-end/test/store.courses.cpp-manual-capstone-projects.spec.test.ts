import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import { cppLevel2Course } from "@/stores/courses/cpp-level-2";
import { cppManualCapstoneProjectBriefs } from "@/stores/courses/cppManualCapstoneProjectBriefs";

const source = "https://github.com/instruction-material/CPP-Level-2/tree/main/";
const moduleTitle = "CPPM5 Manual-Memory Capstones";

describe("CPPM5 capstone catalog workflows", () => {
	it("loads distinct learner/reference packs and retains their required or optional roles", async () => {
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
			for (const [title, folder, path] of [
				[
					"CPPM5 Project 2: Profile Posts",
					"CPPM5-Profile-Posts",
					"core"
				],
				[
					"CPPM5 Project 1: Matrix Fun with a Matrix Class",
					"CPPM5-Matrix-Fun-with-Matrix-Class",
					"choice"
				]
			]) {
				const item = [
					...module.curriculum,
					...module.supplementalProjects
				].find(item => item.title === title)!;
				expect(item.learningPath).toBe(path);
				expect(item.projectLink).toBe(`${source}${folder}-Starter`);
				expect(item.solutionLink).toBe(source + folder);
				expect(item.ideImport).toBe(true);
			}
			const worked = module.supplementalProjects.find(
				item =>
					item.title ===
					"CPPM5 Project 3: Modern Ownership Reflection"
			)!;
			expect(worked.projectLink).toBe(
				source + "CPPM5-Modern-Ownership-Reflection"
			);
			expect(worked.solutionLink).toBeUndefined();
			expect(worked.ideImport).toBe(true);
			expect(worked.content).toContain("## Complete worked program");
			const extension = module.supplementalProjects.find(
				item =>
					item.title ===
					(course === cppLevel2Course
						? "Manual-Memory Capstones: Extension Challenge"
						: "Extension Challenge: Manual-Memory Capstones")
			)!;
			expect(extension.projectLink).toBeUndefined();
			expect(extension.solutionLink).toBeUndefined();
			expect(extension.content).toContain("saved Profile Posts attempt");
			expect(
				module.curriculum.some(
					item => item.title === "Manual-Memory Class Design"
				)
			).toBe(true);
			expect(
				module.curriculum.some(
					item =>
						item.title ===
						"CPPM5 Capstone Completion Contract: Profile Posts Ownership"
				)
			).toBe(true);
		}
	});
	it("separates three current imports from stable saved-attempt identities", () => {
		const keys = new Set<string>();
		for (const [key, folder] of [
			["profile", "CPPM5-Profile-Posts-Starter"],
			["matrix", "CPPM5-Matrix-Fun-with-Matrix-Class-Starter"],
			["ownership", "CPPM5-Modern-Ownership-Reflection"]
		] as const) {
			const brief = cppManualCapstoneProjectBriefs[key];
			const href = brief.match(/\]\((\/ide\?[^)]+)\)/)![1];
			const params = new URL(href, "https://classes.local").searchParams;
			expect(params.get("course")).toBe("cpp-level-2");
			expect(params.get("mode")).toBe("cpp");
			expect(params.get("projectKey")).toBe(
				`cpp-level-2:${folder.toLowerCase()}:current-pack-v1`
			);
			expect(params.get("starterUrl")).toBe(source + folder);
			expect(params.get("lesson")).toBe(
				"cpp-level-2-cppm5-manual-memory-capstones"
			);
			expect(brief).toContain(
				"earlier project\nremains available in Projects"
			);
			keys.add(params.get("projectKey")!);
		}
		expect(keys.size).toBe(3);
	});
	it("keeps incomplete learner work separate from the supplied ownership comparison", async () => {
		setActivePinia(createPinia());
		const learnerCourse =
			(await useCoursesStore().loadCourseById("cpp-level-2"))!;
		const module = learnerCourse.modules.find(
			item => item.title === moduleTitle
		)!;
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		])
			expect(item.solutionLink).toBeUndefined();
		const { profile, matrix, ownership } = cppManualCapstoneProjectBriefs;
		expect(profile).toContain("unfinished learner pack");
		expect(profile).toContain("**seven posts with 160 total hearts**");
		expect(matrix).toContain("transactional copy assignment");
		expect(matrix).toContain("58 64");
		expect(ownership).toContain("supplied worked comparison");
		expect(ownership).toContain("saved capstone");
		expect(ownership).toContain("catch (...)");
		for (const brief of [profile, matrix, ownership]) {
			expect(brief).toContain("make main main-debug");
			expect(brief).toContain("ASAN_OPTIONS=detect_leaks=0");
			expect(brief).toContain("instructor walkthrough");
		}
	});
});
