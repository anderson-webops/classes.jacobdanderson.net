import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { cppLevel1Course } from "@/stores/courses/cpp-level-1";
import { cppProfileProjectBriefs } from "@/stores/courses/cppProfileProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const title = "CPPF8 Master Project: Profile Posts";
const prefix = "c-level-1-cppf8-master-project-profile-posts";
const source = "https://github.com/instruction-material/CPP-Level-1/tree/main/";

describe("Profile Posts capstone source and saved progress", () => {
	it("keeps one required application and two distinct optional extensions", async () => {
		const normalized = await loadRawCourse("c-level-1");
		for (const course of [cppLevel1Course, normalized!]) {
			const module = course.modules.find(
				module => module.title === title
			)!;
			expect(module.curriculum.map(item => item.title)).toEqual([
				"Profile Modeling and API Design",
				"Command Loops, Switches, and Simple State Machines",
				"CPPF8 Project: Profile Posts",
				"Profile Posts Completion Contract"
			]);
			expect(
				module.curriculum.every(item => item.learningPath === "core")
			).toBe(true);
			expect(module.supplementalProjects).toHaveLength(2);
			expect(
				module.supplementalProjects.every(
					item => item.learningPath === "challenge"
				)
			).toBe(true);
			const core = module.curriculum[2];
			const states = module.supplementalProjects[1];
			expect(core.projectLink).toBe(
				`${source}CPPF8-Profile-Posts/starter`
			);
			expect(core.solutionLink).toBe(
				`${source}CPPF8-Profile-Posts/solution`
			);
			expect(states.projectLink).toBe(
				`${source}CPPF8-State-Machine-Profile-Posts/starter`
			);
			expect(states.solutionLink).toBe(
				`${source}CPPF8-State-Machine-Profile-Posts/solution`
			);
			expect(core.content).toContain(cppProfileProjectBriefs.profile);
			expect(states.content).toContain(cppProfileProjectBriefs.states);
		}
	});
	it("preserves every existing public module and item progress identity", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		expect(module.id).toBe(prefix);
		expect(module.curriculum.map(item => item.id)).toEqual([
			`${prefix}-curriculum-profile-modeling-and-api-design`,
			`${prefix}-curriculum-command-loops-switches-and-simple-state-machines`,
			`${prefix}-curriculum-cppf8-project-profile-posts`,
			`${prefix}-curriculum-profile-posts-completion-contract`
		]);
		expect(module.supplementalProjects.map(item => item.id)).toEqual([
			`${prefix}-supplemental-extension-challenge-profile-posts`,
			`${prefix}-supplemental-cppf8-project-2-profile-posts-state-machine-extension`
		]);
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			expect(item.solutionLink).toBeUndefined();
		}
	});
	it("teaches the model and complete-line command contract without importing answers", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		const [model, commands, project] = module.curriculum;
		expect(model.projectLink).toBeUndefined();
		expect(commands.projectLink).toBeUndefined();
		expect(model.content).toContain("std::vector<Post>");
		expect(model.content).toContain("size() const");
		expect(model.content).toContain("shifts later indexes");
		expect(model.content).toContain("zero-based indexes");
		expect(model.content).toContain("two independent profiles");
		expect(commands.content).toContain(
			"enum class Screen { MainMenu, Quit }"
		);
		expect(commands.content).toContain("2x must not become command 2");
		expect(commands.content).toContain("EOF halfway through an");
		expect(project.content).toContain(
			"main.cpp profile.cpp -o profile-posts"
		);
		expect(project.content).toContain("1..4096 bytes");
		expect(project.content).toContain("at most 1000 posts");
		expect(project.content).toContain("total 175");
		expect(project.content).toContain("total 85");
	});
	it("continues saved data-model work and labels the separate scripted state exercise", async () => {
		const course = await loadRawCourse("c-level-1");
		const module = course!.modules.find(module => module.title === title)!;
		const [challenge, states] = module.supplementalProjects;
		expect(challenge.projectLink).toBeUndefined();
		expect(challenge.solutionLink).toBeUndefined();
		expect(challenge.content).toContain("[site code IDE](/ide/code)");
		expect(challenge.content).toContain(
			"select that saved project from Projects"
		);
		expect(challenge.content).toContain(
			"normal, one boundary and one invalid/empty check"
		);
		expect(states.content).toContain("ViewingPosts");
		expect(states.content).toContain("EditingPost");
		expect(states.content).toContain(
			"intentionally uses scripted commands"
		);
		expect(states.content).toContain("optional bonus, not a requirement");
		expect(states.content).toContain("Quit, without mutation");
		expect(states.content).toContain("29 and 31 hearts");
	});
});
