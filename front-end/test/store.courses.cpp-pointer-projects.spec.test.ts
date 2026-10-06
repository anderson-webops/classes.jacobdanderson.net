import { describe, expect, it } from "vitest";
import { cppLevel2Course } from "@/stores/courses/cpp-level-2";
import { cppPointerProjectBriefs } from "@/stores/courses/cppPointerProjectBriefs";
import { loadRawCourse } from "@/stores/courses/index";

const source = "https://github.com/instruction-material/CPP-Level-2/tree/main/";

describe("CPPM1 error and traversal learner workflows", () => {
	it("retains the optional challenge and choice while separating learner and reference files", async () => {
		for (const course of [
			cppLevel2Course,
			(await loadRawCourse("cpp-level-2"))!
		]) {
			const module = course.modules.find(
				module => module.title === "CPPM1 Pointers and Addresses"
			)!;
			const errors = module.supplementalProjects.find(
				item => item.title === "CPPM1 Project 2: Pointer Error Examples"
			)!;
			const practice = module.supplementalProjects.find(
				item => item.title === "Pointers: Practice Lab"
			)!;
			expect(errors.learningPath).toBe("challenge");
			expect(practice.learningPath).toBe("choice");
			for (const [item, folder, brief] of [
				[
					errors,
					"CPPM1-Pointer-Error-Examples",
					cppPointerProjectBriefs.errors
				],
				[
					practice,
					"CPPM1-Pointer-Practice",
					cppPointerProjectBriefs.practice
				]
			] as const) {
				expect(item.projectLink).toBe(`${source}${folder}-Starter`);
				expect(item.solutionLink).toBe(`${source}${folder}`);
				expect(item.content).toContain("## Completion evidence");
				expect(item.content).toContain("## Native workflow");
				expect(item.content).toContain("verify-pointer-projects.py");
				expect(item.content).toContain("Open current starter");
				expect(item.content).toContain(
					"earlier project remains available in Projects"
				);
				for (const command of brief.matchAll(
					/```sh\n([\s\S]*?)\n```/g
				)) {
					expect(item.content).toContain(command[1]);
				}
			}
		}
	});
	it("states the safe default, isolated diagnostic and complete scanner/result contracts", () => {
		expect(cppPointerProjectBriefs.errors).toContain(
			"Ordinary builds reject these flags"
		);
		expect(cppPointerProjectBriefs.errors).toContain("--null");
		expect(cppPointerProjectBriefs.errors).toContain("--dangling");
		expect(cppPointerProjectBriefs.errors).toContain(
			"seven counterexamples"
		);
		for (const text of [
			"1a2bc",
			"0a1b",
			"4abc1",
			"9a1bc",
			"Empty input",
			"increment < length - offset"
		]) {
			expect(cppPointerProjectBriefs.practice).toContain(text);
		}
	});
	it("offers separate fresh-project keys without changing the normal saved-attempt route", () => {
		for (const [brief, folder] of [
			[cppPointerProjectBriefs.errors, "CPPM1-Pointer-Error-Examples"],
			[cppPointerProjectBriefs.practice, "CPPM1-Pointer-Practice"]
		] as const) {
			const href = brief.match(/\]\((\/ide\?[^)]+)\)/)![1];
			const parameters = new URL(href, "https://classes.local")
				.searchParams;
			expect(parameters.get("mode")).toBe("cpp");
			expect(parameters.get("course")).toBe("cpp-level-2");
			expect(parameters.get("starterUrl")).toBe(
				`${source}${folder}-Starter`
			);
			expect(parameters.get("projectKey")).toBe(
				`cpp-level-2:${folder.toLowerCase()}:current-starter-v1`
			);
		}
	});
});
