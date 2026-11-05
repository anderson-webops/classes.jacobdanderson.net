import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export async function checkScratchNestedReading(
	page,
	{ origin, files, setRole }
) {
	const output =
		process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR ||
		path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const views = [];
	for (const role of ["learner", "instructor"]) {
		setRole(role);
		for (const width of [390, 1280]) {
			await page.setViewport({ width, height: 900 });
			await page.goto("about:blank");
			await page.goto(
				`${origin}/courses#scratch-level-2-gm2-nested-loops`,
				{ waitUntil: "networkidle2" }
			);
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
			await page.waitForFunction(() =>
				[...document.querySelectorAll(".lesson-item")].some(
					item =>
						item.querySelector("h5")?.textContent.trim() ===
							"Nested loops" &&
						item.textContent.includes("Wait for another sprite")
				)
			);
			const reading = await page.$$eval(".lesson-item", items => {
				const item = items.find(
					item =>
						item.querySelector("h5")?.textContent.trim() ===
						"Nested loops"
				);
				return {
					text: item.textContent.replace(/\s+/g, " "),
					headings: [...item.querySelectorAll("h3")].map(h =>
						h.textContent.trim()
					),
					contained:
						item.scrollWidth <= item.clientWidth + 1 &&
						document.documentElement.scrollWidth <= innerWidth + 1,
					readingContentVisible: [
						...item.querySelectorAll(".item-content-markdown")
					].some(
						section => section.getBoundingClientRect().height > 0
					)
				};
			});
			assert.deepEqual(reading.headings, [
				"Repeat one shape",
				"Square Inception",
				"Growing triangles",
				"Rows and columns",
				"Reset a value at the right level",
				"Wait for another sprite"
			]);
			for (const required of [
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
			]) {
				assert.ok(
					reading.text.includes(required),
					`${role}/${width}: ${required}`
				);
			}
			assert.ok(
				reading.contained && reading.readingContentVisible,
				`${role}/${width}: reading visibility or containment`
			);
			const handle = await page.evaluateHandle(() =>
				[...document.querySelectorAll(".lesson-item")].find(
					item =>
						item.querySelector("h5")?.textContent.trim() ===
						"Nested loops"
				)
			);
			await handle
				.asElement()
				.screenshot({
					path: path.join(
						output,
						`nested-reading-${role}-${width}.png`
					)
				});
			await handle.dispose();
			views.push({ role, width, ...reading });
			await writeFile(
				path.join(output, "nested-reading.json"),
				`${JSON.stringify({ complete: false, views }, null, 2)}\n`
			);
		}
	}
	await writeFile(
		path.join(output, "nested-reading.json"),
		`${JSON.stringify({ complete: true, sourceCommit: process.env.GITHUB_SHA, views }, null, 2)}\n`
	);
}
