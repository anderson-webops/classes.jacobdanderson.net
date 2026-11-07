import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";

const titles = ["Introduction and Setup", "GrS2 Project 1: Basic Shapes"];

describe("python Turtle foundation teaching", () => {
	for (const id of ["python-level-1", "python-level-1-classroom"]) {
		for (const role of ["learner", "instructor"]) {
			it(`retains complete worked lessons for ${id} / ${role}`, async () => {
				setActivePinia(createPinia());
				if (role === "instructor") {
					useAppStore().setCurrentTutor({
						_id: "foundation-tutor",
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
						_id: "foundation-learner",
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
				const source = raw.modules.flatMap(module => module.curriculum);
				const items = course.modules.flatMap(
					module => module.curriculum
				);
				const selected = titles.map(title => {
					const expected = source.find(item => item.title === title)!;
					const actual = items.find(item => item.title === title)!;
					expect(actual, title).toBeDefined();
					expect(actual.content).toBe(expected.content.trim());
					expect(actual.content).toContain("```python");
					expect(actual.learningPath).toBe("core");
					if (role === "learner")
						expect(actual.solutionLink).toBeUndefined();
					return actual;
				});
				const directory = process.env.PYTHON_FOUNDATIONS_PROOF_DIR;
				if (directory) {
					mkdirSync(directory, { recursive: true });
					writeFileSync(
						join(directory, `${id}-${role}.json`),
						JSON.stringify({ id, role, items: selected }, null, 2)
					);
				}
			});
		}
	}
	it("keeps the classroom task tied to the actual Triangle Motion template", async () => {
		const raw = (await loadRawCourse("python-level-1-classroom"))!;
		const item = raw.modules
			.flatMap(module => module.curriculum)
			.find(item => item.title === titles[1])!;
		const url = new URL(item.projectLink!, "https://example.invalid");
		expect(url.searchParams.get("template")).toBe("triangle-motion");
		expect(item.content).toContain(
			"**Normal:** Complete `draw_triangle()`"
		);
		expect(item.content).toContain(
			"**Hard:** Complete `add_triangle_detail()`"
		);
	});
});
