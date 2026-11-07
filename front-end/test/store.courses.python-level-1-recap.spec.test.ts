import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";

const revision = "03134b0960cfc71a0114e35e4e58be17d44b17c4";
const root = `https://github.com/instruction-material/Python-Level-1/tree/${revision}/Game-Mechanics-Recap`;
const variableTitle =
	"GrS3 Supplemental Project 3: Variables and Random Numbers Recap";
const gameTitle = "GrS13 Supplemental Project 3: Game Mechanics Recap";

describe("python recap source alignment", () => {
	for (const id of ["python-level-1", "python-level-1-classroom"]) {
		for (const role of ["learner", "instructor"]) {
			it(`keeps each recap in its matching unit for ${id} / ${role}`, async () => {
				setActivePinia(createPinia());
				if (role === "instructor") {
					useAppStore().setCurrentTutor({
						_id: "recap-tutor",
						name: "Tutor",
						email: "tutor@example.invalid",
						age: 30,
						state: "GA",
						usersOfTutorLength: 0,
						coursePermissions: [id],
						editTutors: false,
						saveEdit: "Save"
					});
				} else {
					useAppStore().setCurrentUser({
						_id: "recap-learner",
						name: "Learner",
						email: "learner@example.invalid",
						age: 14,
						state: "GA",
						courseAccess: [id],
						editUsers: false,
						saveEdit: "Save"
					});
				}
				const raw = (await loadRawCourse(id))!;
				const course = (await useCoursesStore().loadCourseById(id))!;
				const variableModule = course.modules.find(
					module =>
						module.title === "GrS3 Variables and Random Numbers"
				)!;
				const gameModule = course.modules.find(
					module => module.title === "GrS13 Game Mechanics"
				)!;
				const variables = variableModule.supplementalProjects.find(
					item => item.title === variableTitle
				)!;
				const mechanics = gameModule.supplementalProjects.find(
					item => item.title === gameTitle
				)!;
				expect(variables).toBeDefined();
				expect(mechanics).toBeDefined();
				for (const item of [variables, mechanics]) {
					const expected = raw.modules
						.flatMap(module => module.supplementalProjects)
						.find(source => source.title === item.title)!;
					expect(item.content).toBe(expected.content);
					expect(item.learningPath).toBe("choice");
					if (role === "learner")
						expect(item.solutionLink).toBeUndefined();
				}
				expect(JSON.stringify(variables)).not.toContain(
					"Game-Mechanics-Recap"
				);
				expect(variables.content).toContain(
					"The right side uses the old value"
				);
				if (id.endsWith("classroom")) {
					const varsURL = new URL(
						variables.projectLink!,
						"https://example.invalid"
					);
					expect(
						varsURL.searchParams.get("classroomSource")
					).toBeNull();
					expect(varsURL.searchParams.get("template")).toBe(
						"classroom-project"
					);
					const url = new URL(
						mechanics.projectLink!,
						"https://example.invalid"
					);
					expect(url.searchParams.get("classroomSource")).toBe(
						`Python-Level-1/tree/${revision}/Game-Mechanics-Recap/solution`
					);
					expect(mechanics.content).toContain(
						"**Normal:** In `normal_addition()`"
					);
					expect(mechanics.content).toContain(
						"**Hard:** In `hard_addition()`"
					);
				} else {
					expect(variables.projectLink).toBeUndefined();
					expect(mechanics.projectLink).toBe(`${root}/starter`);
					if (role === "instructor")
						expect(mechanics.solutionLink).toBe(`${root}/solution`);
				}
				const output = process.env.PYTHON_RECAP_PROOF_DIR;
				if (output) {
					mkdirSync(output, { recursive: true });
					writeFileSync(
						join(output, `${id}-${role}.json`),
						JSON.stringify(
							{
								id,
								role,
								sourceRevision: revision,
								variables,
								mechanics
							},
							null,
							2
						)
					);
				}
			});
		}
	}
});
