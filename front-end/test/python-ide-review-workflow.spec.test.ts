import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFile(path: string) {
	return readFileSync(resolve(__dirname, path), "utf8");
}

describe("Code IDE review workflow wiring", () => {
	it("keeps staff review copies on managed-project endpoints separate from student saves", () => {
		const moduleSource = sourceFile("../src/modules/pythonIde.ts");

		expect(moduleSource).toContain("fetchManagedPythonIdeProjects");
		expect(moduleSource).toContain("fetchManagedPythonIdeProject(");
		expect(moduleSource).toContain("createPythonIdeProjectReview");
		expect(moduleSource).toContain("updatePythonIdeProjectReview");
		expect(moduleSource).toContain("fetchVisiblePythonIdeProjectReviews");
		expect(moduleSource).toContain("`/users/${userID}/python-projects`");
		expect(moduleSource).toContain("`/users/${userID}/python-projects/${projectID}/review`");
		expect(moduleSource).toContain('"/users/loggedin/python-project-reviews"');
	});

	it("renders visible staff copies inside the learner Code IDE without autosave state", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");

		expect(pageSource).toContain("const visibleProjectReviews = ref<PythonIdeProjectReview[]>([]);");
		expect(pageSource).toContain("fetchVisiblePythonIdeProjectReviews().catch(() => [])");
		expect(pageSource).toContain("selectedVisibleReview");
		expect(pageSource).toContain('class="visible-review-panel"');
		expect(pageSource).toContain("activeVisibleReviewFileContent");
		expect(pageSource).not.toContain("visibleProjectReviews.value.push");
	});

	it("loads project and review contents lazily while keeping metadata catalogs complete", () => {
		const moduleSource = sourceFile("../src/modules/pythonIde.ts");
		const pageSource = sourceFile(
			"../src/components/CodeIdeWorkspace.vue"
		);
		const reviewSource = sourceFile(
			"../src/components/LearnerCodeReviewTools.vue"
		);

		expect(moduleSource).toContain(
			"export type PythonIdeProjectMetadata"
		);
		expect(moduleSource).toContain(
			"export async function fetchPythonIdeProject("
		);
		expect(moduleSource).toContain(
			"export async function fetchVisiblePythonIdeProjectReview("
		);
		expect(moduleSource).toContain("signal?: AbortSignal");
		expect(pageSource).toContain(
			"const projectCatalog = ref<PythonIdeProjectMetadata[]>([]);"
		);
		expect(pageSource).toContain(
			"async function loadRemoteProjectDetail("
		);
		expect(pageSource).toMatch(
			/projects\.value\.filter\(candidate\s*=>\s*candidate\._id\.startsWith\("local-"\)\s*\)/
		);
		expect(pageSource).toContain(
			"const deletingSelectedProject"
		);
		expect(pageSource).toContain(
			"await loadRemoteProjectDetail(selectedProjectID.value);"
		);
		expect(pageSource).toContain(
			"remoteProjectDetailAbortController?.abort();"
		);
		expect(pageSource).toContain(
			"function visibleReviewLoadIsCurrent("
		);
		expect(pageSource).toContain(
			"if (!visibleReviewLoadIsCurrent(projectID, loadRunID, signal)) return;"
		);
		expect(pageSource).not.toContain(".catch(() => null)");
		expect(reviewSource).toContain(
			"const selectedRecordDetail = ref<ManagedPythonIdeProject | null>(null);"
		);
		expect(reviewSource).toContain(
			"await fetchManagedPythonIdeProject("
		);
		expect(reviewSource).toContain(
			"selectedProjectAbortController?.abort();"
		);
	});
});
