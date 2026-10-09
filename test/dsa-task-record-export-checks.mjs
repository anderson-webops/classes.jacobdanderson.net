import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export function completeTaskRecordFile(folder, source, reference) {
	if (!folder.endsWith("/starter")) return source;
	assert.equal((source.match(/TODO:/g) ?? []).length, 2);
	const functions
		= /^ {4}(?:std::vector<Task> tasksOnDate\([^\n]+|void printAll\([^\n]+)\n[\s\S]+?^ {4}\}/gm;
	const original = [...source.matchAll(functions)];
	const answers = [...reference["main.cpp"].matchAll(functions)];
	assert.equal(original.length, 2);
	assert.equal(answers.length, 2);
	let index = 0;
	const completed = source.replace(functions, () => answers[index++][0]);
	assert.equal(
		completed.replace(functions, "TASK"),
		source.replace(functions, "TASK"),
		"Only the two marked sorting methods change"
	);
	return completed;
}

export async function verifyTaskRecordExport(
	directory,
	folder,
	runNative,
	unfinished = false
) {
	const source = await readFile(join(directory, "main.cpp"), "utf8");
	assert.equal((source.match(/int main\(\)/g) ?? []).length, 1);
	const oracle = await readFile(
		new URL("./fixtures/dsa-task-record-regressions.cpp", import.meta.url),
		"utf8"
	);
	const reference = folder.endsWith("/solution");
	if (unfinished) assert.equal((source.match(/TODO:/g) ?? []).length, 2);
	try {
		await writeFile(
			join(directory, "task-under-test.hpp"),
			source.slice(0, source.indexOf("int main()"))
		);
		await writeFile(join(directory, "task-record-checks.cpp"), oracle);
		for (const sanitized of [false, true]) {
			const flags = [
				"-std=c++20",
				"-Wall",
				"-Wextra",
				"-Wpedantic",
				"-Wconversion",
				"-Wsign-conversion",
				"-Werror",
				"-g",
				"-O0",
				...(sanitized
					? [
							"-fsanitize=address,undefined",
							"-fno-sanitize-recover=all"
						]
					: [])
			];
			assert.deepEqual(
				await runNative(
					"clang++",
					[...flags, "main.cpp", "-o", "task-record-sample"],
					directory
				),
				{ code: 0, stdout: "", stderr: "" }
			);
			const suffix = reference
				? "\nTasks on 2026-05-01:\n- Draft graph notes\n"
				: "\nTasks on 2026-05-01: 1\n";
			assert.deepEqual(
				await runNative(
					join(directory, "task-record-sample"),
					[],
					directory
				),
				{
					code: 0,
					stdout:
						`Task List\n---------\n[x] 2026-05-01 - Draft graph notes\n[ ] 2026-05-03 - Read quicksort walkthrough\n${
							suffix}`,
					stderr: ""
				}
			);
			assert.deepEqual(
				await runNative(
					"clang++",
					[
						...flags,
						`-DTASK_REFERENCE=${unfinished ? 0 : 1}`,
						"task-record-checks.cpp",
						"-o",
						"task-record-checks"
					],
					directory
				),
				{ code: 0, stdout: "", stderr: "" }
			);
			assert.deepEqual(
				await runNative(
					join(directory, "task-record-checks"),
					[],
					directory
				),
				{
					code: 0,
					stdout: "First-match records and 512 state transitions passed\n",
					stderr: ""
				}
			);
		}
	}
	finally {
		for (const name of [
			"task-under-test.hpp",
			"task-record-checks.cpp",
			"task-record-checks",
			"task-record-sample"
		])
			await rm(join(directory, name), { force: true });
	}
}

export async function verifyTaskRecordTeaching(page, options) {
	const {
		origin,
		selector,
		referenceFixture,
		screenshotDirectory,
		revealCourseSource,
		sourceRequestCount,
		record
	} = options;
	const requestsBefore = sourceRequestCount();
	const titles = [
		"Interfaces, Records, and a Task Manager CLI Core Concepts",
		"Filtering, Removal, and Stable Output",
		"Command-Style Program Structure",
		"Verification Review: Interfaces, Records, and a Task Manager CLI"
	];
	const worksheets = [
		"Project: Task Manager CLI",
		"Task Manager CLI Transfer Practice",
		"Task Manager CLI Extension Practice"
	];
	const primaryKey
		= "data-structures-and-algorithms-in-cpp:data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-curriculum-core-project-interfaces-records-and-a-task-manager-cli:starter";
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
							`course-import-cpp-DSCPP1-lesson-${index}-${referenceFixture ? "staff" : "learner"}-${width}.png`
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
					.includes("two sorting tasks"),
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
				text.includes("first matching description")
				&& text.includes("must not reorder stored records")
			);
			assert.equal(
				!!(await page.$(
					"a.resource-link.is-solution[href='https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP1-Task-Manager-CLI/solution']"
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
					title =>
						[...document.querySelectorAll(".lesson-item")]
							.find(
								item =>
									item.querySelector("h5")?.textContent
									=== title
							)
							?.textContent
							.includes(
								"Continue saved task-manager project"
							),
					{},
					title
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
				const href = await card.evaluate(item =>
					[...item.querySelectorAll(".item-content-markdown a")]
						.find(
							a =>
								a.textContent
								=== "Continue saved task-manager project"
						)
						?.getAttribute("href")
				);
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
			"Reading task-record lessons and worksheets imports no code"
		);
		assert.ok(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth + 1
			)
		);
		record("verified-task-record-teaching", {
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
