// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-boundary-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID =
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns";
const coreID =
	moduleID +
	"-curriculum-core-project-creational-patterns-ii-and-boundary-patterns";
const readingID =
	moduleID +
	"-curriculum-creational-patterns-ii-and-boundary-patterns-core-concepts";
const blobID =
	moduleID +
	"-curriculum-creational-patterns-ii-and-boundary-patterns-application-check";
const extensionID =
	moduleID +
	"-supplemental-creational-patterns-ii-and-boundary-patterns-extension-practice";
test(
	"Java boundary patterns actual consent, package tree, saved source and ZIPs",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ4-Legacy-Quote-Packs",
			coreID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			fixturePath: "./fixtures/java-boundary-sources.json",
			continuationsByRole: {
				starter: [blobID, extensionID],
				solution: [readingID, blobID, extensionID]
			},
			sourceUrl: role =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ4-Legacy-Quote-Packs/" +
				role,
			projectKey: role =>
				"design-patterns-in-java:" +
				(role === "starter" ? coreID : readingID) +
				":" +
				(role === "starter" ? "starter" : "reference") +
				":native-java-boundary",
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
				"src/boundary/OrderDraft.java",
				"src/boundary/PriceAdapter.java",
				"src/boundary/QuoteFacade.java",
				"README.md"
			],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 10,
			expectedFile: (role, name) =>
				fixture.files["DPJ4-Legacy-Quote-Packs/" + role + "/" + name],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved boundary trace " + width + "\n"
					: "\nSaved boundary trace " + width + "\n"),
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
			outputEnv: "JAVA_BOUNDARY_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-boundary",
			outputSubdirectory: "legacy-quote",
			kind: "boundary",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false
			})
		});
	}
);

test(
	"Java boundary patterns public worked-code action, consent and exports",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ4-Boundary-Worked-Example",
			coreID: readingID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			roles: ["starter"],
			continuationIDs: [],
			fixturePath: "./fixtures/java-boundary-sources.json",
			sourceUrl: () =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ4-Boundary-Worked-Example",
			projectKey: () =>
				"design-patterns-in-java:" +
				readingID +
				":starter:native-java-boundary",
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
				fixture.files["DPJ4-Boundary-Worked-Example/" + name],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved boundary trace " + width + "\n"
					: "\nSaved boundary trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"Boundary worked contracts: 24 passed"
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
			outputEnv: "JAVA_BOUNDARY_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-boundary",
			outputSubdirectory: "worked-example",
			kind: "boundary-example",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false,
				workedExample: true
			})
		});
	}
);
