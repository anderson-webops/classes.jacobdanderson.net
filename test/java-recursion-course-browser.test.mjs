// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-recursion-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID = "java-level-3-aj4-recursion";
const examples = [
	{
		pack: "AJ4-Recursion-Practice-Packs",
		coreID: moduleID + "-curriculum-aj4-project-1-recursion-practice",
		continuationIDs: [
			moduleID + "-supplemental-extension-challenge-recursion",
			moduleID + "-supplemental-recursive-trace-transfer-practice"
		]
	},
	{
		pack: "AJ4-Divisible-by-7-Packs",
		coreID: moduleID + "-curriculum-aj4-project-2-divisible-by-7",
		continuationIDs: []
	},
	{
		pack: "AJ4-Call-Trace",
		coreID: moduleID + "-curriculum-recursion-core-concepts",
		continuationIDs: [],
		roles: ["starter"]
	}
];
for (const example of examples) {
	test(
		"Java recursion actual course consent, saved source and exports: " +
			example.pack,
		{ timeout: 180000 },
		async t => {
			const worked = example.pack === "AJ4-Call-Trace";
			await runAssemblyCoreCourseWorkflow(t, {
				...example,
				fixturePath: "./fixtures/java-recursion-sources.json",
				courseID: "java-level-3",
				mode: "java",
				sourceRepository: "Java-Level-3",
				moduleID,
				sourceUrl: role =>
					"https://github.com/" +
					fixture.repository +
					"/tree/" +
					fixture.revision +
					"/" +
					example.pack +
					(worked ? "" : "/" + role),
				projectKey: role =>
					"java-level-3:" +
					example.coreID +
					":" +
					(role === "starter" ? "starter" : "reference") +
					":native-java-recursion",
				previousProject: role => ({
					_id: "earlier-recursion-" + role,
					title: "Earlier recursion work",
					mode: "java",
					files: [
						{
							name: "Main.java",
							content: "// Earlier recursion attempt\n"
						}
					],
					activeFileName: "Main.java",
					courseID: "java-level-3",
					courseProjectKey:
						"java-level-3:" +
						example.coreID +
						":" +
						(role === "starter" ? "starter" : "reference"),
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				flatFiles: true,
				sharedFiles: worked
					? ["Main.java", "ContractTests.java", "README.md"]
					: [],
				primaryFile: "Main.java",
				taskFile: "README.md",
				initialFile: "Main.java",
				fileCount: 3,
				expectedFile: (role, name) =>
					fixture.files[
						example.pack + "/" + (worked ? "" : role + "/") + name
					],
				editContent: ({ original, filename, width }) =>
					original +
					(filename.endsWith(".java")
						? "\n// Saved recursion trace " + width + "\n"
						: "\nSaved recursion trace " + width + "\n"),
				verifyRun: async page => {
					// Full contract harnesses run on native JDK 21 from the actual downloaded ZIPs.
					// The simple worked example also exercises the site's bounded Java preview.
					await page
						.locator("button.run-control:not([disabled])")
						.click();
					if (!worked) {
						await page.waitForFunction(() =>
							document
								.querySelector(".output-panel")
								?.textContent.includes(
									"javac --release 21 -Xlint:all -Werror Main.java ContractTests.java"
								)
						);
						assert.equal(
							await page.$eval("button.run-control", button =>
								button.textContent.trim()
							),
							"Run"
						);
						assert.equal(await page.$(".stdin-panel"), null);
						return;
					}
					await page.waitForFunction(() =>
						[...document.querySelectorAll(".output-line")].some(
							line => line.textContent.trim() === "10"
						)
					);
					assert.ok(await page.$(".output-panel"));
				},
				outputEnv: "JAVA_RECURSION_BROWSER_PROOF_DIR",
				defaultOutput: "output/java-recursion",
				outputSubdirectory: example.pack,
				kind: "recursion",
				afterImport: async () => ({
					fullContractAcceptance: "native-JDK21-exported-source",
					browserPreviewChecked: worked
				})
			});
		}
	);
}
