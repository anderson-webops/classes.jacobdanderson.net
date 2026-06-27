import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFile(path: string) {
	return readFileSync(resolve(__dirname, path), "utf8");
}

describe("Python IDE review workflow wiring", () => {
	it("keeps staff review copies on managed-project endpoints separate from student saves", () => {
		const moduleSource = sourceFile("../src/modules/pythonIde.ts");

		expect(moduleSource).toContain("fetchManagedPythonIdeProjects");
		expect(moduleSource).toContain("createPythonIdeProjectReview");
		expect(moduleSource).toContain("updatePythonIdeProjectReview");
		expect(moduleSource).toContain("fetchVisiblePythonIdeProjectReviews");
		expect(moduleSource).toContain("`/users/${userID}/python-projects`");
		expect(moduleSource).toContain("`/users/${userID}/python-projects/${projectID}/review`");
		expect(moduleSource).toContain('"/users/loggedin/python-project-reviews"');
	});

	it("renders visible staff copies inside the learner Python IDE without autosave state", () => {
		const pageSource = sourceFile("../src/components/PythonIdeWorkspace.vue");

		expect(pageSource).toContain("const visibleProjectReviews = ref<PythonIdeProjectReview[]>([]);");
		expect(pageSource).toContain("fetchVisiblePythonIdeProjectReviews().catch(() => [])");
		expect(pageSource).toContain("selectedVisibleReview");
		expect(pageSource).toContain('class="visible-review-panel"');
		expect(pageSource).toContain("activeVisibleReviewFileContent");
		expect(pageSource).not.toContain("visibleProjectReviews.value.push");
	});
});
