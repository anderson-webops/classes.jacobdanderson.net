import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Exercises the real course and IDE in Chrome.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const moduleName
	= process.env.PYTHON_LEVEL_2_BROWSER_MODULE === "loops" ? "loop" : "first";
const fixturePath = `./fixtures/python-level-2-${moduleName}-module-sources.json`;
const fixture = JSON.parse(
	readFileSync(new URL(fixturePath, import.meta.url), "utf8")
);
const outputMarker = "Saved Python exercise check";

async function verifyExecution(
	page,
	{ input, expected, expectsSyntaxError },
	edited = false
) {
	const selector = ".stdin-panel textarea";
	await page.waitForSelector(selector);
	await page.$eval(
		selector,
		(element, value) => {
			element.value = value;
			element.dispatchEvent(new Event("input", { bubbles: true }));
		},
		input
	);
	await page.locator("button.run-control:not([disabled])").click();
	const tokens = edited ? [...expected, outputMarker] : expected;
	await page.waitForFunction(
		values =>
			values.every(value =>
				document
					.querySelector(".output-panel")
					?.textContent
					.includes(value)
			),
		{ timeout: 90000 },
		tokens
	);
	const output = await page.$eval(
		".output-panel",
		element => element.textContent
	);
	if (expectsSyntaxError) {
		assert.match(output, /\bSyntaxError\b/);
	}
	else {
		assert.doesNotMatch(
			output,
			/Traceback|\b(?:Syntax|Runtime|Type|Name|Import|Index|EOF)Error:/
		);
	}
	return output;
}

for (const exercise of fixture.exercises) {
	for (const classroom of [false, true]) {
		const courseID = classroom
			? "python-level-2-classroom"
			: "python-level-2";
		const sourceRole = role => (classroom ? "solution" : role);
		const { pack, itemId, examples } = exercise;
		const exampleFor = role => examples[sourceRole(role)];
		test(
			`${pack} ${courseID}: consent, runtime, saved edits and ZIPs`,
			{ timeout: 360000 },
			async (t) => {
				await runAssemblyCoreCourseWorkflow(t, {
					kind: pack.toLowerCase(),
					courseID,
					moduleID: fixture.moduleId,
					coreID: itemId,
					previousProject: () => ({
						_id: "earlier-python-project",
						title: "Earlier work",
						mode: "python",
						files: [
							{
								name: "main.py",
								content: "print('Earlier work')\n"
							}
						],
						activeFileName: "main.py",
						courseID,
						courseProjectKey: `${courseID}:earlier-python-project:starter`,
						createdAt: "2026-11-01T12:00:00.000Z",
						updatedAt: "2026-11-01T12:00:00.000Z"
					}),
					mode: "python",
					pack,
					sourceRepository: fixture.repository,
					fixturePath,
					sourceRole,
					sourceUrl: role =>
						`https://github.com/instruction-material/${fixture.repository}/tree/${fixture.revision}/${pack}/${sourceRole(role)}`,
					sameTab: true,
					githubDirectory: true,
					allowPythonRuntime: true,
					flatFiles: true,
					sharedFiles: [],
					fileCount: role =>
						Object.keys(fixture.files).filter(path =>
							path.startsWith(`${pack}/${sourceRole(role)}/`)
						).length,
					primaryFile: "main.py",
					expectedFile: (role, name) =>
						classroom
							? { sha256: exercise.classroomMainSha256 }
							: fixture.files[`${pack}/${role}/${name}`],
					editFiles: ["main.py"],
					editContent: ({ original, role }) => {
						const edited = exampleFor(role).expectsSyntaxError
							? fixture.files[`${pack}/solution/main.py`].content
							: original;
						return `${edited.trimEnd()}\n\nprint(${JSON.stringify(outputMarker)})\n`;
					},
					continuationIDs: [itemId],
					projectKey: role =>
						`${courseID}:${itemId}:${classroom || role === "starter" ? "starter" : "reference"}`,
					verifyRun: (page, { role }) =>
						verifyExecution(page, exampleFor(role)),
					afterEdit: async (page, { role }) => ({
						output: await verifyExecution(
							page,
							exampleFor(role).expectsSyntaxError
								? examples.solution
								: exampleFor(role),
							true
						)
					}),
					outputEnv: "PYTHON_LEVEL_2_BROWSER_DIR",
					outputSubdirectory: `${courseID}/${pack}`,
					defaultOutput: `output/python-${moduleName}-module-browser`
				});
			}
		);
	}
}
