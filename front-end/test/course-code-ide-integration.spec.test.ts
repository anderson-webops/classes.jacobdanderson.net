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
		const accountWorkspace = source(
			"src/components/AccountCodeIdeWorkspace.vue"
		);

		expect(accountWorkspace).toContain("app.currentCourseLearner?._id");
		expect(accountWorkspace).toContain(
			"`courseCodeLearner:${app.currentCourseLearner._id}`"
		);
		expect(workspace).toContain(
			'accountScope.ownerKey?.startsWith("courseCodeLearner:")'
		);
		expect(workspace).toContain("fetchPythonIdeProjects(accountScope)");
		expect(workspace).toContain("createRemotePythonIdeProject");
	});

	it("uses dark theme surfaces for course-code and learner assignment controls", () => {
		const manager = source("src/components/CourseAccessCodeManager.vue");
		const adminProfile = source("src/components/AdminProfile.vue");
		const courseAccess = source("src/components/LearnerCourseAccess.vue");
		const mainStyles = source("src/styles/main.css");

		expect(manager).toContain(":global(html.dark .course-code-manager)");
		expect(manager).toContain("--manager-surface: var(--color-surface);");
		expect(manager).toContain(
			"--manager-surface-muted: var(--color-surface-muted);"
		);
		expect(adminProfile).toContain("<LearnerCourseAccess");
		expect(adminProfile).toContain("background: var(--color-surface);");
		expect(adminProfile).not.toContain("background: #");
		expect(courseAccess).toContain("color: var(--color-ink-soft);");
		expect(courseAccess).toContain(
			"border-bottom: 1px solid var(--color-border);"
		);
		expect(courseAccess).not.toContain("background: #");
		expect(mainStyles).toContain(
			"html.dark body :is(.assignment-editor, .course-editor, .editor-block)"
		);
		expect(mainStyles).toContain("html.dark body .checkbox-grid label");
		expect(mainStyles).toContain(
			"html.dark body :is(.course-choice, .checkbox-grid > label)"
		);
		expect(mainStyles).toContain(
			":is(.admin-workspace, .profile-workspace)"
		);
		expect(mainStyles).toContain(
			"select:is(.editor-select, .course-status-select)"
		);
	});
});
