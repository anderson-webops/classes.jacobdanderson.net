import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

export async function verifyStateProjectTeaching(page, options) {
	const {
		origin,
		folder,
		selector,
		referenceFixture,
		screenshotDirectory,
		revealCourseSource,
		sourceRequestCount,
		record
	} = options;
	const requestsBefore = sourceRequestCount();
	const markov = folder.startsWith("DSCPP3-");
	const unit = markov ? "DSCPP3" : "DSCPP4";
	const anchor = markov ? "dscpp3-stl-containers-and-state-based-text-generation" : "dscpp4-recursion-and-backtracking-in-3d-mazes";
	const titles = markov ? ["Vectors, Sets, Maps, and Deques as Different Stories", "Tokenization and Cleanup", "State Windows and Markov-Style Generation", "Verification Review: STL Containers and State Based Text Generation"] : ["Recursive Search as Controlled Exploration", "Visited State and Cycle Prevention", "Path Construction and Rollback", "Verification Review: Recursion and Backtracking in 3D Mazes"];
	const worksheets = markov ? ["Project: Markov Text Generator", "Container Text Generation Transfer Practice", "Container Text Generation Extension Practice"] : ["Project: Recursive Maze Pathfinder", "Recursive Maze Transfer Practice", "Recursive Maze Extension Practice"];
	const continuationLabel = markov ? "Continue saved text-generator project" : "Continue saved maze project";
	const primaryKey = `data-structures-and-algorithms-in-cpp:data-structures-and-algorithms-in-cpp-${anchor}-curriculum-core-project-${anchor.replace(/^dscpp\d+-/, "")}:starter`;
	if (screenshotDirectory)
		await mkdir(screenshotDirectory, { recursive: true });
	for (const width of [390, 1280]) {
		await page.setViewport({ width, height: 900 });
		const capture = async (card, index) => {
			if (screenshotDirectory) {
				await card
					.asElement()
					.screenshot({
						path: join(
							screenshotDirectory,
							`course-import-cpp-${unit}-lesson-${index}-${referenceFixture ? "staff" : "learner"}-${width}.png`
						)
					});
			}
		};
		await page.click(".lesson-view-toggle button:nth-child(3)");
		await page.waitForSelector(
			".lesson-view-toggle button:nth-child(3)[aria-pressed='true']"
		);
		for (const [index, title] of titles.entries()) {
			await page.waitForFunction(
				title =>
					[...document.querySelectorAll(".lesson-item")].some(
						item => item.querySelector("h5")?.textContent === title
					),
				{},
				title
			);
			const card = await page.evaluateHandle(
				title =>
					[...document.querySelectorAll(".lesson-item")].find(
						item => item.querySelector("h5")?.textContent === title
					),
				title
			);
			try {
				await card.asElement().scrollIntoView();
				await page.waitForFunction(
					title =>
						[...document.querySelectorAll(".lesson-item")]
							.find(
								item =>
									item.querySelector("h5")?.textContent
									=== title
							)
							?.querySelector(".item-content-markdown")
							?.textContent
							.includes("Concept focus"),
					{},
					title
				);
				const text = await card.evaluate(item => item.textContent);
				const headings = await card.evaluate(item =>
					[...item.querySelectorAll(".item-content-markdown h2")].map(
						heading => heading.textContent.trim()
					)
				);
				assert.deepEqual(headings, [
					"Learn",
					"Predict and practice",
					"Verify and debug",
					"Extend and review"
				]);
				for (const stage of [
					"Learn",
					"Predict and practice",
					"Verify and debug",
					"Extend and review"
				])
					assert.ok(text.includes(stage), `${title}: ${stage}`);
				assert.equal(
					await card.evaluate(
						item => item.querySelectorAll(".is-ide-starter").length
					),
					0
				);
				await capture(card, index);
			}
			finally {
				await card.dispose();
			}
		}
		await revealCourseSource(page, selector);
		await page.waitForFunction(
			selector =>
				document
					.querySelector(selector)
					?.closest(".lesson-item")
					?.textContent
					.includes("Complete and run the required project"),
			{},
			selector
		);
		const project = await page.evaluateHandle(
			selector =>
				document.querySelector(selector).closest(".lesson-item"),
			selector
		);
		try {
			const text = await project.evaluate(item => item.textContent);
			assert.ok(
				text.includes("role-only IDE ZIP")
				&& text.includes("C++20")
			);
			assert.equal(
				!!(await page.$(
					`a.resource-link.is-solution[href='https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/${folder.split("/")[0]}/solution']`
				)),
				referenceFixture
			);
			await capture(project, 4);
		}
		finally {
			await project.dispose();
		}
		await page.click(".lesson-view-toggle button:nth-child(2)");
		await page.waitForSelector(
			".lesson-view-toggle button:nth-child(2)[aria-pressed='true']"
		);
		for (const [index, title] of worksheets.entries()) {
			await page.waitForFunction(
				title =>
					[...document.querySelectorAll(".lesson-item")].some(
						item => item.querySelector("h5")?.textContent === title
					),
				{},
				title
			);
			const card = await page.evaluateHandle(
				title =>
					[...document.querySelectorAll(".lesson-item")].find(
						item => item.querySelector("h5")?.textContent === title
					),
				title
			);
			try {
				await card.asElement().scrollIntoView();
				await page.waitForFunction(
					(title, continuationLabel) =>
						[...document.querySelectorAll(".lesson-item")]
							.find(
								item =>
									item.querySelector("h5")?.textContent
									=== title
							)
							?.textContent
							.includes(
								continuationLabel
							),
					{},
					title,
					continuationLabel
				);
				assert.equal(
					await card.evaluate(
						item =>
							item.querySelectorAll(
								".is-ide-starter, .is-solution"
							).length
					),
					0
				);
				const href = await card.evaluate((item, continuationLabel) =>
					[...item.querySelectorAll(".item-content-markdown a")]
						.find(
							a =>
								a.textContent
								=== continuationLabel
						)
						?.getAttribute("href"), continuationLabel);
				assert.ok(href);
				assert.equal(
					new URL(href, origin).searchParams.get("projectKey"),
					primaryKey
				);
				await capture(card, index + 5);
			}
			finally {
				await card.dispose();
			}
		}
		assert.equal(
			sourceRequestCount(),
			requestsBefore,
			"Reading state-project lessons and worksheets imports no code"
		);
		assert.ok(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth + 1
			)
		);
		record("verified-state-project-teaching", {
			unit,
			role: referenceFixture ? "instructor" : "learner",
			width,
			authoredLessons: 4,
			sectionHeadingsRendered: true,
			optionalWorksheets: 3,
			readingImportsNoCode: true,
			referenceVisible: referenceFixture
		});
	}
	await page.setViewport({
		width: referenceFixture ? 1280 : 390,
		height: 900
	});
	await revealCourseSource(page, selector);
}
