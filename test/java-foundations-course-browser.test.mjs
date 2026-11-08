// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-foundations-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID = "design-patterns-in-java-dpj2-java-design-foundations";
const coreID = moduleID + "-curriculum-core-project-java-design-foundations";
const readingID =
	moduleID + "-curriculum-java-design-foundations-core-concepts";
const blobID =
	moduleID +
	"-curriculum-refactoring-exercise-untangle-a-responsibility-blob";
const extensionID =
	moduleID + "-supplemental-java-design-foundations-extension-practice";
test(
	"Java foundations actual consent, package tree, saved source and ZIPs",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ2-Report-Foundations-Packs",
			coreID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			fixturePath: "./fixtures/java-foundations-sources.json",
			continuationsByRole: {
				starter: [blobID, extensionID],
				solution: [
					readingID,
					blobID,
					moduleID +
						"-curriculum-design-review-favoring-explicit-package-structure",
					moduleID +
						"-curriculum-modern-java-types-before-classic-pattern-machinery",
					moduleID +
						"-curriculum-package-dependency-and-test-seam-contract",
					extensionID
				]
			},
			sourceUrl: role =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ2-Report-Foundations-Packs/" +
				role,
			projectKey: role =>
				"design-patterns-in-java:" +
				(role === "starter" ? coreID : readingID) +
				":" +
				(role === "starter" ? "starter" : "reference") +
				":native-java-foundations",
			previousProject: role => ({
				_id: "earlier-foundations-" + role,
				title: "Earlier foundations work",
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
				"src/report/domain/Report.java",
				"src/report/adapters/TextFormatter.java",
				"src/report/application/ReportPublisher.java",
				"README.md"
			],
			primaryFile: "Main.java",
			taskFile: "README.md",
			initialFile: "Main.java",
			fileCount: 13,
			expectedFile: (role, name) =>
				fixture.files[
					"DPJ2-Report-Foundations-Packs/" + role + "/" + name
				],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved foundations trace " + width + "\n"
					: "\nSaved foundations trace " + width + "\n"),
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
			outputEnv: "JAVA_FOUNDATIONS_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-foundations",
			outputSubdirectory: "report-foundations",
			kind: "foundations",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false
			})
		});
	}
);

test(
	"Java foundations public worked-code action, consent and exports",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			pack: "DPJ2-Seam-Worked-Example",
			coreID: readingID,
			moduleID,
			courseID: "design-patterns-in-java",
			mode: "java",
			sourceRepository: "Java-Level-3",
			roles: ["starter"],
			continuationIDs: [],
			fixturePath: "./fixtures/java-foundations-sources.json",
			sourceUrl: () =>
				"https://github.com/" +
				fixture.repository +
				"/tree/" +
				fixture.revision +
				"/DPJ2-Seam-Worked-Example",
			projectKey: () =>
				"design-patterns-in-java:" +
				readingID +
				":starter:native-java-foundations",
			previousProject: () => ({
				_id: "earlier-foundations-worked",
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
				fixture.files["DPJ2-Seam-Worked-Example/" + name],
			editContent: ({ original, filename, width }) =>
				original +
				(filename.endsWith(".java")
					? "\n// Saved foundations trace " + width + "\n"
					: "\nSaved foundations trace " + width + "\n"),
			verifyRun: async page => {
				await page
					.locator("button.run-control:not([disabled])")
					.click();
				await page.waitForFunction(() =>
					document
						.querySelector(".output-panel")
						?.textContent.includes(
							"Seam worked contracts: 14 passed"
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
			outputEnv: "JAVA_FOUNDATIONS_BROWSER_PROOF_DIR",
			defaultOutput: "output/java-foundations",
			outputSubdirectory: "worked-example",
			kind: "foundations-example",
			afterImport: async () => ({
				fullContractAcceptance: "native-JDK21-exported-source",
				browserPreviewChecked: false,
				workedExample: true
			})
		});
	}
);
