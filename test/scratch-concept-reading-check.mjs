import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readings from "../front-end/test/fixtures/scratch-concept-readings.json" with { type: "json" };

export async function checkScratchConceptReadings(
	page,
	{ origin, files, setRole }
) {
	const output =
		process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR ||
		path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const groups = Map.groupBy(readings, row => row.moduleId);
	const views = [];
	const nestedViews = [];
	for (const role of ["learner", "instructor"]) {
		setRole(role);
		for (const width of [390, 1280]) {
			await page.setViewport({ width, height: 900 });
			for (const [moduleId, items] of groups) {
				await page.goto("about:blank");
				await page.goto(`${origin}/courses#${moduleId}`, {
					waitUntil: "networkidle2"
				});
				await page.waitForFunction(
					role =>
						document
							.querySelector(".site-nav__badge")
							?.textContent.trim() ===
						(role === "instructor" ? "Tutor" : "Student"),
					{},
					role
				);
				await page.waitForSelector(".lesson-view-toggle button");
				await page
					.locator(".lesson-view-toggle button:nth-child(3)")
					.click();
				for (const expected of items) {
					await page.waitForFunction(
						({ title, required }) =>
							[...document.querySelectorAll(".lesson-item")].some(
								item =>
									item
										.querySelector("h5")
										?.textContent.trim() === title &&
									required.every(text =>
										item.textContent.includes(text)
									)
							),
						{},
						{
							title: expected.title,
							required: expected.requiredText
						}
					);
					const actual = await page.$$eval(
						".lesson-item",
						(items, title) => {
							const item = items.find(
								item =>
									item
										.querySelector("h5")
										?.textContent.trim() === title
							);
							return {
								text: item.textContent.replace(/\s+/g, " "),
								headings: [...item.querySelectorAll("h3")].map(
									h => h.textContent.trim()
								),
								contained:
									item.scrollWidth <= item.clientWidth + 1 &&
									document.documentElement.scrollWidth <=
										innerWidth + 1,
								readingContentVisible: [
									...item.querySelectorAll(
										".item-content-markdown"
									)
								].some(
									section =>
										section.getBoundingClientRect().height >
										0
								)
							};
						},
						expected.title
					);
					assert.ok(
						actual.contained && actual.readingContentVisible,
						`${role}/${width}/${expected.itemId}: reading visibility or containment`
					);
					assert.doesNotMatch(
						actual.text,
						/(?:Core Concepts|Application Check) project/
					);
					if (expected.itemId.endsWith("curriculum-nested-loops")) {
						assert.deepEqual(actual.headings, [
							"Repeat one shape",
							"Square Inception",
							"Growing triangles",
							"Rows and columns",
							"Reset a value at the right level",
							"Wait for another sprite"
						]);
						for (const text of [
							"6 × 8 = 48",
							"90 degrees",
							"120-degree",
							"50, 75 and 100",
							"15 times",
							"ends at 320",
							"last drawn side was 300",
							"192 side movements",
							"0 through 39",
							"60-degree",
							"Six petals",
							"three strikes",
							"Broadcast and wait"
						])
							assert.ok(
								actual.text.includes(text),
								`${role}/${width}: ${text}`
							);
						nestedViews.push({ role, width, ...actual });
					}
					const handle = await page.evaluateHandle(
						title =>
							[...document.querySelectorAll(".lesson-item")].find(
								item =>
									item
										.querySelector("h5")
										?.textContent.trim() === title
							),
						expected.title
					);
					await handle
						.asElement()
						.screenshot({
							path: path.join(
								output,
								`concept-reading-${expected.itemId}-${role}-${width}.png`
							)
						});
					await handle.dispose();
					views.push({ role, width, ...expected, ...actual });
					await writeFile(
						path.join(output, "concept-readings.json"),
						`${JSON.stringify({ complete: false, views }, null, 2)}\n`
					);
				}
			}
		}
	}
	assert.equal(views.length, 52);
	assert.equal(nestedViews.length, 4);
	await writeFile(
		path.join(output, "concept-readings.json"),
		`${JSON.stringify({ complete: true, sourceCommit: process.env.GITHUB_SHA, views }, null, 2)}\n`
	);
	await writeFile(
		path.join(output, "nested-reading.json"),
		`${JSON.stringify({ complete: true, sourceCommit: process.env.GITHUB_SHA, views: nestedViews }, null, 2)}\n`
	);
}
