import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-welcome-survey-source.json", import.meta.url), "utf8"));
const roleName = role => role === "starter" ? "starter" : "reference";
const courseID = fixture.courseId;
const moduleID = `${courseID}-jss1-variables-and-data-types`;
const coreID = `${moduleID}-curriculum-jss1-project-1-welcome-survey`;
for (const files of Object.values(fixture.files)) {
	for (const file of files) {
		const path = new URL(`../front-end/public/course-assets/javascript-level-1/welcome-survey-v1/${file.path}`, import.meta.url);
		const raw = readFileSync(path);
		assert.equal(raw.length, file.byteLength);
		assert.equal(createHash("sha256").update(raw).digest("hex"), file.sha256);
	}
}

test("JavaScript survey: course consent, both roles, saved source and offline-ready ZIPs", { timeout: 180000 }, async (t) => {
	await runAssemblyCoreCourseWorkflow(t, {
		kind: "javascript-welcome-survey",
		courseID,
		moduleID,
		coreID,
		mode: "web",
		fixturePath: "./fixtures/javascript-welcome-survey-source.json",
		sourceUrl: role => fixture.sourceURL[roleName(role)],
		localSource: {
			prefix: "/course-assets/javascript-level-1/welcome-survey-v1/",
			files: role => fixture.files[roleName(role)]
		},
		expectedFile: (role, name) => fixture.files[roleName(role)].find(file => file.name === name),
		flatFiles: true,
		fileCount: 6,
		initialFile: "index.html",
		primaryFile: "script.js",
		taskFile: "README.md",
		continuationIDs: [coreID],
		projectKey: role => `${courseID}:${coreID}:${roleName(role)}:welcome-survey:v1`,
		previousProject: () => ({
			_id: "earlier-javascript-attempt",
			title: "Earlier work",
			mode: "python",
			files: [{ name: "main.py", content: "# earlier work\n" }],
			activeFileName: "main.py",
			courseID,
			courseProjectKey: `${courseID}:earlier:starter`,
			createdAt: "2026-10-01T12:00:00.000Z",
			updatedAt: "2026-10-01T12:00:00.000Z"
		}),
		instructionTokens: ["index.html", "vendor/d3.min.js", "without a server"],
		starterToken: "script.js",
		referenceToken: "script.js",
		readyToken: "Open index.html",
		outputEnv: "JAVASCRIPT_SURVEY_BROWSER_DIR",
		defaultOutput: "output/javascript-survey-browser"
	});
});
