import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
	return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("course-code IDE integration", () => {
	it("offers code redemption on Courses and management to tutors and admins", () => {
		const coursesPage = source("src/pages/courses.vue");
		const tutorProfile = source("src/components/TutorProfile.vue");
		const adminProfile = source("src/components/AdminProfile.vue");

		expect(coursesPage).toContain("<CourseCodeAccessForm");
		expect(tutorProfile).toContain("<CourseAccessCodeManager");
		expect(tutorProfile).toContain(':courses="permittedCourses"');
		expect(adminProfile).toContain("<CourseAccessCodeManager");
		expect(adminProfile).toContain(':courses="courseOptions"');
	});

	it("uses the classroom learner as an isolated IDE project owner", () => {
		const workspace = source("src/components/CodeIdeWorkspace.vue");

		expect(workspace).toContain("currentCourseLearner.value?._id");
		expect(workspace).toContain('role: "courseCodeLearner" as const');
		expect(workspace).toContain(
			'currentCourseLearner.value ? "course workspace" : "account"'
		);
		expect(workspace).toContain("fetchPythonIdeProjects()");
		expect(workspace).toContain("createRemotePythonIdeProject");
	});

	it("uses dark theme surfaces for course-code and learner assignment controls", () => {
		const manager = source("src/components/CourseAccessCodeManager.vue");
		const adminProfile = source("src/components/AdminProfile.vue");

		expect(manager).toContain(":global(html.dark .course-code-manager)");
		expect(manager).toContain("--manager-surface: var(--color-surface);");
		expect(manager).toContain(
			"--manager-surface-muted: var(--color-surface-muted);"
		);
		expect(adminProfile).toContain(
			":global(html.dark .admin-workspace .course-choice)"
		);
		expect(adminProfile).toContain(
			"background: var(--color-surface-muted);"
		);
		expect(adminProfile).toContain(
			":global(html.dark .admin-workspace .course-access-group-title)"
		);
	});
});
