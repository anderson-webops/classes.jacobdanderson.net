// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-structural-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID = "design-patterns-in-java-dpj5-structural-patterns-in-depth";
const coreID =
	moduleID + "-curriculum-core-project-structural-patterns-in-depth";
const readingID =
	moduleID + "-curriculum-structural-patterns-in-depth-core-concepts";
const blobID =
	moduleID + "-curriculum-structural-patterns-in-depth-application-check";
const extensionID =
	moduleID + "-supplemental-structural-patterns-in-depth-extension-practice";
test(
	"Java structural patterns actual consent, package tree, saved source and ZIPs",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ5-Structural-Scene-Packs",
			coreID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			fixturePath: "./fixtures/java-structural-sources.json",
			continuationsByRole: {
				starter: [blobID, extensionID],
				solution: [readingID, blobID, extensionID]
			},
			sourceUrl: role =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ5-Structural-Scene-Packs/" +
				role,
			projectKey: role =>
				"design-patterns-in-java:" +
				(role === "starter" ? coreID : readingID) +
				":" +
				(role === "starter" ? "starter" : "reference") +
				":native-java-structural",
			previousProject: role => ({
				_id: "earlier-creational-" + role,
				title: "Earlier creational work",
				mode: "java",
				files: [
					{
						name: "Main.java",
						content: "// Earlier foundation attempt\n"
					}
				],
				activeFileName: "Main.java",
				courseID: "design-patterns-in-java",
				courseProjectKey:
					"design-patterns-in-java:" +
					coreID +
					":" +
					(role === "starter" ? "starter" : "reference"),
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			nativeInstructions: true,
			flatFiles: true,
			sharedFiles: [],
			editFiles: [
				"src/scene/Circle.java",
				"src/scene/Group.java",
				"src/scene/Frame.java",
				"src/scene/LazyGraphic.java",
				"src/scene/GlyphPool.java",
				"README.md"
			],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 14,
			expectedFile: (role, name) =>
				fixture.files[
					"DPJ5-Structural-Scene-Packs/" + role + "/" + name
				],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved structural trace " + width + "\n"
					: "\nSaved structural trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"javac --release 21 -Xlint:all -Werror -d classes @sources.txt"
						)
				);
				assert.equal(
					await page.$eval("button.run-control", button =>
						button.textContent.trim()
					),
					"Run"
				);
				assert.equal(await page.$(".stdin-panel"), null);
			},
			outputEnv: "JAVA_STRUCTURAL_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-structural",
			outputSubdirectory: "scene",
			kind: "structural",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false
			})
		});
	}
);

test(
	"Java structural patterns public worked-code action, consent and exports",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ5-Structural-Worked-Example",
			coreID: readingID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			roles: ["starter"],
			continuationIDs: [],
			fixturePath: "./fixtures/java-structural-sources.json",
			sourceUrl: () =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ5-Structural-Worked-Example",
			projectKey: () =>
				"design-patterns-in-java:" +
				readingID +
				":starter:native-java-structural",
			previousProject: () => ({
				_id: "earlier-creational-worked",
				title: "Earlier worked example",
				mode: "java",
				files: [
					{
						name: "Main.java",
						content: "// Earlier worked example\n"
					}
				],
				activeFileName: "Main.java",
				courseID: "design-patterns-in-java",
				courseProjectKey:
					"design-patterns-in-java:" + readingID + ":starter",
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			nativeInstructions: true,
			flatFiles: true,
			sharedFiles: ["Main.java", "ContractTests.java", "README.md"],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 3,
			expectedFile: (_role, name) =>
				fixture.files["DPJ5-Structural-Worked-Example/" + name],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved structural trace " + width + "\n"
					: "\nSaved structural trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"Structural worked contracts: 41 passed"
						)
				);
				assert.equal(
					await page.$eval("button.run-control", button =>
						button.textContent.trim()
					),
					"Run"
				);
				assert.equal(await page.$(".stdin-panel"), null);
			},
			outputEnv: "JAVA_STRUCTURAL_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-structural",
			outputSubdirectory: "worked-example",
			kind: "structural-example",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false,
				workedExample: true
			})
		});
	}
);
