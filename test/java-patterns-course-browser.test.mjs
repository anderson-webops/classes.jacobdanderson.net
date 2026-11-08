// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/java-patterns-sources.json", import.meta.url),
		"utf8"
	)
);
const moduleID =
	"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not";
const readingID =
	moduleID +
	"-curriculum-what-patterns-are-and-what-they-are-not-core-concepts";
const extensionID =
	moduleID +
	"-supplemental-what-patterns-are-and-what-they-are-not-extension-practice";
const examples = [
	{
		pack: "DPJ1-Pricing-Contracts",
		coreID:
			moduleID +
			"-curriculum-core-project-what-patterns-are-and-what-they-are-not",
		continuationIDs: [],
		folder: "pricing"
	},
	{
		pack: "DPJ1-Design-Comparison-Packs",
		coreID: readingID,
		roles: ["solution"],
		continuationIDs: [
			moduleID +
				"-curriculum-design-exercise-smell-or-reasonable-simplicity",
			moduleID +
				"-curriculum-reflection-question-when-does-a-pattern-actually-help",
			moduleID +
				"-curriculum-java-pattern-course-contract-and-characterization-baseline",
			moduleID + "-curriculum-one-change-scenario-before-one-abstraction",
			extensionID
		],
		folder: "comparison-reference"
	},
	{
		pack: "DPJ1-Design-Comparison-Packs",
		coreID: extensionID,
		roles: ["starter"],
		continuationIDs: [],
		folder: "comparison-extension"
	}
];
for (const example of examples) {
	test(
		"Java Patterns course import, saved source and actual ZIPs: " +
			example.folder,
		{ timeout: 180000 },
		async t => {
			const pricing = example.folder === "pricing";
			await runAssemblyCoreCourseWorkflow(t, {
				...example,
				fixturePath: "./fixtures/java-patterns-sources.json",
				courseID: "design-patterns-in-java",
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
					"/" +
					role,
				projectKey: role =>
					"design-patterns-in-java:" +
					example.coreID +
					":" +
					(role === "starter" ? "starter" : "reference") +
					":native-java-patterns",
				previousProject: role => ({
					_id: "earlier-patterns-" + example.folder + "-" + role,
					title: "Earlier patterns work",
					mode: "java",
					files: [
						{
							name: "Main.java",
							content: "// Earlier design attempt\n"
						}
					],
					activeFileName: "Main.java",
					courseID: "design-patterns-in-java",
					courseProjectKey:
						"design-patterns-in-java:" +
						example.coreID +
						":" +
						(role === "starter" ? "starter" : "reference"),
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				nativeInstructions: true,
				flatFiles: true,
				sharedFiles: [],
				primaryFile: "Main.java",
				taskFile: "README.md",
				initialFile: "Main.java",
				fileCount: pricing ? 5 : 3,
				expectedFile: (role, name) =>
					fixture.files[example.pack + "/" + role + "/" + name],
				editContent: ({ original, filename, width }) =>
					original +
					(filename.endsWith(".java")
						? "\n// Saved design decision " + width + "\n"
						: "\nSaved design decision " + width + "\n"),
				verifyRun: async page => {
					await page
						.locator("button.run-control:not([disabled])")
						.click();
					const command = pricing
						? "javac --release 21 -Xlint:all -Werror Main.java PricingStrategy.java BulkPricingStrategy.java ContractTests.java"
						: "javac --release 21 -Xlint:all -Werror Main.java ContractTests.java";
					await page.waitForFunction(
						command =>
							document
								.querySelector(".output-panel")
								?.textContent.includes(command),
						{},
						command
					);
					assert.equal(
						await page.$eval("button.run-control", button =>
							button.textContent.trim()
						),
						"Run"
					);
					assert.equal(await page.$(".stdin-panel"), null);
				},
				outputEnv: "JAVA_PATTERNS_BROWSER_PROOF_DIR",
				defaultOutput: "output/java-patterns",
				outputSubdirectory: example.folder,
				kind: "patterns",
				afterImport: async () => ({
					fullContractAcceptance: "native-JDK21-exported-source",
					browserPreviewChecked: false
				})
			});
		}
	);
}
