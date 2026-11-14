import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Actual assigned Python source workflows.
import { test } from "node:test";
import MarkdownIt from "markdown-it";
import { editedAiStudioSource, aiStudioFixture as fixture, studioChecks } from "./ai-studio-browser-cases.mjs";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

for (const project of fixture.projects) {
	const file = (role, name) => fixture.files[`${project.folder}/${role}/${name}`];
	test(`AI ${project.key}: actual consent, edited Python execution, saved continuations and ZIPs`, { timeout: 600000 }, async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: `ai-${project.key}`,
			courseID: fixture.courseId,
			moduleID: project.moduleId,
			coreID: project.itemId,
			mode: "data",
			sourceRepository: fixture.repository,
			pack: project.folder,
			fixturePath: "./fixtures/ai-studio-sources.json",
			roles: ["starter", "solution"],
			sourceUrl: role => `https://github.com/instruction-material/${fixture.repository}/tree/${fixture.revision}/${project.folder}/${role}`,
			sameTab: true,
			githubDirectory: true,
			allowPythonRuntime: true,
			nativeInstructions: false,
			flatFiles: true,
			sharedFiles: [],
			fileCount: 2,
			initialFile: "main.py",
			primaryFile: "main.py",
			taskFile: "README.md",
			expectedFile: file,
			editFiles: ["main.py"],
			editContent: () => editedAiStudioSource(project),
			continuationIDs: [project.itemId],
			projectKey: role => `${fixture.courseId}:${project.itemId}:${role === "starter" ? "starter" : "reference"}`,
			beforeImport: async (page, { role, width }) => {
				const selector = `#${project.moduleId}-${project.readingId} .item-content-markdown`;
				await page.waitForSelector(selector);
				const html = new MarkdownIt().render(project.readingText);
				const expected = await page.evaluate((value) => {
					const element = document.createElement("div");
					element.innerHTML = value;
					return element.textContent.replace(/\s+/g, " ").trim();
				}, html);
				const actual = await page.$eval(selector, element => ({
					text: element.textContent.replace(/\s+/g, " ").trim(),
					html: element.innerHTML,
					overflow: element.scrollWidth > element.clientWidth + 1,
					clipped: /line-clamp/.test(getComputedStyle(element).display)
				}));
				assert.equal(actual.text, expected);
				assert.equal(actual.overflow, false);
				assert.equal(actual.clipped, false);
				if (["search-15", "search-16"].includes(project.key))
					assert.equal((actual.text.match(/A\*/g) || []).length, (project.readingText.match(/A\*/g) || []).length);
				const output = join(process.env.AI_STUDIO_BROWSER_DIR ?? "output/ai-studio-browser", project.key);
				await writeFile(join(output, `reading-${role}-${width}.json`), `${JSON.stringify({ expected, actual }, null, 2)}\n`);
				await (await page.$(selector)).screenshot({ path: join(output, `reading-${role}-${width}.png`) });
				return { completeWorkedReading: true, literalSearchNotation: true, textLength: actual.text.length };
			},
			// Original ZIPs are executed separately in the native export contract.
			verifyRun: async () => {},
			afterEdit: async (page) => {
				const expected = `Studio result: ${studioChecks[project.key].result}`;
				await page.locator("button.run-control:not([disabled])").click();
				await page.waitForFunction(value => document.querySelector(".output-panel")?.textContent.includes(value), { timeout: 90000 }, expected);
				const output = await page.$eval(".output-panel", element => element.textContent);
				assert.doesNotMatch(output, /Traceback|(?:Syntax|Runtime|Type|Name|Import)Error:/);
				return { editedAlgorithmExecuted: true, expectedResult: expected, output };
			},
			instructionTokens: [],
			starterToken: "",
			referenceToken: "",
			readyToken: "",
			outputEnv: "AI_STUDIO_BROWSER_DIR",
			outputSubdirectory: project.key,
			defaultOutput: "output/ai-studio-browser"
		});
	});
}
