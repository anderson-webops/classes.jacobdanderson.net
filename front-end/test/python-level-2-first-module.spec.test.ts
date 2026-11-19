import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const source =
	"https://github.com/instruction-material/Python-Level-2/tree/b58d958347f0c3ca6f9d96963a674cc3d00813bf";

const assignments = [
	["Mad Libs", "Mad-Libs", "core"],
	["Index Picker", "Index-Picker", "core"],
	["Space Mountain", "Space-Mountain", "choice"],
	["Tip Calculator", "Tip-Calculator", "choice"],
	["Relay Race", "Relay-Race", "choice"]
] as const;

it.each([
	["python-level-2", "learner"],
	["python-level-2", "instructor"],
	["python-level-2-classroom", "learner"],
	["python-level-2-classroom", "instructor"]
] as const)(
	"links role-appropriate first module projects in %s for %s",
	async (courseId, role) => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "python-course-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [courseId],
				editTutors: false,
				saveEdit: "Save"
			});
		}

		const course = (await useCoursesStore().loadCourseById(courseId))!;
		const module = course.modules.find(({ id }) =>
			id.endsWith("-ps1-variables-strings-and-input")
		)!;
		const items = [...module.curriculum, ...module.supplementalProjects];

		for (const [title, folder, path] of assignments) {
			const item = items.find(candidate =>
				candidate.title.endsWith(title)
			)!;
			const projectSource = `${source}/PS1-${folder}`;
			expect(item.learningPath).toBe(path);
			expect(item.solutionLink).toBe(
				role === "instructor" ? `${projectSource}/solution` : undefined
			);
			if (courseId === "python-level-2") {
				expect(item.projectLink).toBe(`${projectSource}/starter`);
			} else {
				const launch = new URL(
					item.projectLink!,
					"https://classes.example"
				);
				expect(launch.pathname).toBe("/ide");
				expect(launch.searchParams.get("classroomSource")).toBe(
					`${projectSource}/solution`.replace(
						"https://github.com/instruction-material/",
						""
					)
				);
			}
		}
	}
);
