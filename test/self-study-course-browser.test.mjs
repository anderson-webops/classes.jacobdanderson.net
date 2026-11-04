import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native CI browser entrypoint.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { preview } from "vite";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const courseIds = [
	"entrepreneurship-101",
	"middle-school-a-literature",
	"middle-school-b-writing",
	"middle-school-b-writing-retake",
	"middle-school-c-grammar",
	"novel-writing"
];
const digest = value => createHash("sha256").update(value).digest("hex");

function account(path, role) {
	const learner = {
		_id: "self-study-learner",
		name: "Course fixture",
		email: "learner@example.invalid",
		age: 14,
		state: "GA",
		courseAccess: courseIds,
		courseProgress: []
	};
	if (path === "/api/accounts/me")
		return role === "instructor"
			? { tutorID: "self-study-tutor" }
			: { userID: learner._id };
	if (path === "/api/users/loggedin" && role === "learner")
		return { currentUser: learner };
	if (path === "/api/tutors/loggedin" && role === "instructor")
		return {
			currentTutor: {
				_id: "self-study-tutor",
				name: "Course fixture",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 1,
				coursePermissions: courseIds,
				editTutors: false,
				saveEdit: "Save"
			}
		};
	if (path === "/api/users/oftutor/self-study-tutor") return [learner];
	return {};
}

async function chooseModule(page, module, index) {
	const toggle = await page.$(".outline-toggle");
	if (
		toggle &&
		(await toggle.boundingBox()) &&
		(await toggle.evaluate(
			element => element.getAttribute("aria-expanded") !== "true"
		))
	)
		await toggle.click();
	const label = `Show ${module.kind} ${index + 1}: ${module.title}`;
	await page
		.locator(`.outline-button[aria-label=${JSON.stringify(label)}]`)
		.click();
	await page.waitForFunction(
		title =>
			document
				.querySelector("#course-reader-panel h3")
				?.textContent.trim() === title,
		{},
		module.title
	);
}

async function chooseView(page, position) {
	await page
		.locator(`.lesson-view-toggle button:nth-child(${position})`)
		.click();
	await page.waitForSelector(
		`.lesson-view-toggle button:nth-child(${position})[aria-pressed='true']`
	);
}

async function checkTableLayout(page, anchor, width, stressWideTable) {
	const result = await page.evaluate(
		({ anchor, width, stressWideTable }) => {
			const content = document
				.getElementById(anchor)
				.querySelector(".item-content-markdown");
			const wrappers = [
				...content.querySelectorAll(".markdown-table-scroll")
			];
			const compactTablesFit =
				width < 1280 ||
				wrappers.every(
					wrapper =>
						wrapper.querySelectorAll("thead th").length > 3 ||
						wrapper.scrollWidth <= wrapper.clientWidth + 2
				);
			let wideTableScrolls = null;
			if (stressWideTable && wrappers.length) {
				const clone = content.cloneNode(true);
				try {
					for (const row of clone.querySelectorAll("tr"))
						while (row.children.length < 12)
							row.append(row.children[0].cloneNode(true));
					content.parentElement.append(clone);
					const wide = clone.querySelector(".markdown-table-scroll");
					wideTableScrolls =
						wide.scrollWidth > wide.clientWidth &&
						document.documentElement.scrollWidth <= innerWidth;
				} finally {
					clone.remove();
				}
			}
			return {
				compactTablesFit,
				wideTableScrolls,
				forcedParagraphBreaks:
					content.querySelectorAll(":scope > p > br").length
			};
		},
		{ anchor, width, stressWideTable }
	);
	assert.equal(
		result.compactTablesFit,
		true,
		"Compact comparison tables fit the desktop reading pane"
	);
	assert.equal(
		result.forcedParagraphBreaks,
		0,
		"Prose wraps to the viewport instead of source-code line lengths"
	);
	if (stressWideTable)
		assert.equal(
			result.wideTableScrolls,
			true,
			"Genuinely wide tables keep independent scrolling"
		);
	return result;
}

async function checkCards(page, module, expected, optional) {
	const rows = await page.$$eval(
		"#course-reader-panel .lesson-list > .lesson-item",
		items =>
			items.map(item => ({
				id: item.id,
				title: item.querySelector("h5")?.textContent.trim(),
				classes: item.querySelector(".lesson-card")?.className
			}))
	);
	assert.deepEqual(
		rows.map(row => row.title),
		expected.map(item => item.title),
		`${module.title}: exact assignment placement`
	);
	for (const [index, item] of expected.entries()) {
		assert.equal(rows[index].id, `${module.id}-${item.id}`);
		assert.ok(
			rows[index].classes
				.split(/\s+/)
				.includes(
					`is-${item.learningPath ?? (optional ? "choice" : "core")}`
				),
			`${item.title}: path label`
		);
		if (item.requiredDirective) {
			await page.waitForFunction(
				({ id, required }) => {
					const row = document.getElementById(id);
					return row
						?.querySelector(".assignment-content")
						?.textContent.replace(/\s+/g, " ")
						.trim()
						.includes(required);
				},
				{},
				{ id: rows[index].id, required: item.requiredDirective }
			);
		}
	}
	return rows.map(row => row.id);
}

test(
	"complete self-study readings and assignments in both roles and viewport sizes",
	{ timeout: 900000 },
	async () => {
		const previous = process.cwd();
		const output = resolve(
			previous,
			process.env.SELF_STUDY_BROWSER_PROOF_DIR ??
				"output/self-study-browser"
		);
		const taskId =
			process.env.CLASSES_FAMILY_TASK_ID ?? "self-study-browser";
		const startedAt = new Date().toISOString();
		const profiles = [];
		let browser;
		let server;
		let passed = false;
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: "self-study-course-browser",
				pid: process.pid,
				startedAt,
				timeoutMs: 900000
			})
		);
		try {
			await mkdir(output, { recursive: true });
			assert.ok(
				existsSync(join(root, "dist/index.html")),
				"Build this checkout before checking its pages"
			);
			process.chdir(root);
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(value => typeof value === "string" && existsSync(value));
			assert.ok(executablePath, "Chrome is required");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			for (const role of ["learner", "instructor"]) {
				for (const width of [390, 1280]) {
					for (const id of courseIds) {
						const fixture = JSON.parse(
							await readFile(
								join(output, `${id}-${role}.json`),
								"utf8"
							)
						);
						assert.equal(fixture.id, id);
						assert.equal(fixture.role, role);
						if (process.env.GITHUB_SHA)
							assert.equal(
								fixture.sourceCommit,
								process.env.GITHUB_SHA
							);
						const name = `${id}-${role}-${width}`;
						const context = await browser.createBrowserContext();
						const page = await context.newPage();
						let writes = 0;
						const pageErrors = [];
						const readings = [];
						const assignments = [];
						try {
							await page.setViewport({ width, height: 900 });
							page.setDefaultTimeout(20000);
							page.on("pageerror", error =>
								pageErrors.push(String(error))
							);
							await page.setRequestInterception(true);
							page.on("request", request => {
								if (request.isInterceptResolutionHandled())
									return;
								const url = new URL(request.url());
								if (
									url.origin !== origin ||
									url.pathname.startsWith("/api/")
								) {
									if (
										!["GET", "OPTIONS"].includes(
											request.method()
										)
									)
										writes++;
									void request.respond({
										status: 200,
										contentType: "application/json",
										body: JSON.stringify(
											url.origin === origin
												? account(url.pathname, role)
												: {}
										)
									});
								} else {
									void request.continue();
								}
							});
							const [accountResponse] = await Promise.all([
								page.waitForResponse(
									response =>
										response.request().method() === "GET" &&
										new URL(response.url()).pathname ===
											"/api/accounts/me"
								),
								page.goto(
									`${origin}/courses#${fixture.modules[0].id}`,
									{ waitUntil: "networkidle2" }
								)
							]);
							assert.equal(accountResponse.status(), 200);
							await page.waitForFunction(
								role =>
									document
										.querySelector(".site-nav__badge")
										?.textContent.trim() ===
									(role === "instructor"
										? "Tutor"
										: "Student"),
								{},
								role
							);
							await page.waitForFunction(
								id =>
									document.querySelector("#course-select")
										?.value === id,
								{},
								id
							);
							const outline = await page.$$eval(
								".outline-button strong",
								items =>
									items.map(item => item.textContent.trim())
							);
							assert.deepEqual(
								outline,
								fixture.modules.map(module => module.title),
								"Every teaching module is reachable; maintenance records stay outside course navigation"
							);
							for (const [
								index,
								module
							] of fixture.modules.entries()) {
								await chooseModule(page, module, index);
								await chooseView(page, 3);
								for (const item of module.readings) {
									const anchor = `${module.id}-${item.id}`;
									await page.waitForFunction(
										({ anchor, expected }) =>
											document
												.getElementById(anchor)
												?.querySelector(
													".item-content-markdown"
												)
												?.textContent.replace(
													/\s+/g,
													" "
												)
												.trim() === expected,
										{},
										{ anchor, expected: item.expectedText }
									);
									const actual = await page.$eval(
										`[id=${JSON.stringify(anchor)}] .item-content-markdown`,
										element => ({
											text: element.textContent
												.replace(/\s+/g, " ")
												.trim(),
											tableRows:
												element.querySelectorAll(
													"tbody tr"
												).length
										})
									);
									assert.equal(
										actual.tableRows,
										item.tableRows
									);
									const tableLayout = await checkTableLayout(
										page,
										anchor,
										width,
										width === 1280 &&
											module.title ===
												"MSC16 Sentence Types"
									);
									for (const image of item.images)
										await page.waitForFunction(
											({ anchor, image }) =>
												[
													...document
														.getElementById(anchor)
														.querySelectorAll("img")
												].some(
													element =>
														element.getAttribute(
															"src"
														) === image.src &&
														element.alt ===
															image.alt &&
														element.complete &&
														element.naturalWidth > 0
												),
											{},
											{ anchor, image }
										);
									assert.equal(
										await page.$eval(
											`[id=${JSON.stringify(anchor)}]`,
											element => {
												const next =
													document.querySelector(
														"#course-reader-panel .learning-card"
													);
												return (
													!next ||
													!!(
														element.compareDocumentPosition(
															next
														) &
														Node.DOCUMENT_POSITION_FOLLOWING
													)
												);
											}
										),
										true,
										"Complete reading precedes project summaries"
									);
									readings.push({
										module: module.id,
										id: item.id,
										contentSHA256: item.contentSHA256,
										renderedTextSHA256: digest(actual.text),
										tableRows: actual.tableRows,
										imagesLoaded: item.images.length,
										tableLayout
									});
								}
								assert.equal(
									await page.evaluate(
										() =>
											document.documentElement
												.scrollWidth <= innerWidth
									),
									true,
									`${module.title}: no page overflow`
								);
								if (
									index === 0 ||
									module.readings.some(
										item => item.images.length
									) ||
									/Financial Feasibility|Sentence Types|Analyzing Evidence|Entry Diagnostic|Exit Diagnostic|NW10 Writing Dialogue/.test(
										module.title
									)
								) {
									await page.$eval(
										"#course-reader-panel",
										element =>
											element.scrollIntoView({
												block: "start"
											})
									);
									await page.screenshot({
										path: join(
											output,
											`${name}-${index + 1}-learn.png`
										)
									});
								}
								await chooseView(page, 1);
								const core = await checkCards(
									page,
									module,
									module.projects,
									false
								);
								await chooseView(page, 2);
								const optional = await checkCards(
									page,
									module,
									module.optional,
									true
								);
								assignments.push({
									module: module.id,
									core,
									optional
								});
							}
							assert.equal(writes, 0);
							assert.deepEqual(pageErrors, []);
							profiles.push({
								id,
								role,
								width,
								sourceCommit: fixture.sourceCommit,
								moduleViews: fixture.modules.length,
								completeReadings: readings,
								assignments,
								internalModulesExcluded:
									fixture.internalModules,
								pageErrors,
								writes
							});
							await writeFile(
								join(output, "browser-proof.json"),
								JSON.stringify(
									{ complete: false, profiles },
									null,
									2
								) + "\n"
							);
							console.log(
								JSON.stringify({
									event: "verified-self-study-course",
									id,
									role,
									width,
									modules: fixture.modules.length,
									readings: readings.length,
									preservedPublishedIdentities:
										fixture.publishedIdentities,
									restoredIdentities:
										fixture.restoredIdentities,
									sourceProjects: fixture.sourceProjects,
									writes
								})
							);
						} catch (error) {
							await page
								.screenshot({
									path: join(output, `${name}-failed.png`),
									fullPage: true
								})
								.catch(() => {});
							await writeFile(
								join(output, `${name}-failed.json`),
								JSON.stringify(
									{
										id,
										role,
										width,
										url: page.url(),
										error: String(error),
										pageErrors,
										readings,
										assignments
									},
									null,
									2
								) + "\n"
							);
							throw error;
						} finally {
							await context.close();
						}
					}
				}
			}
			assert.equal(profiles.length, 24);
			assert.equal(
				profiles.reduce(
					(total, profile) => total + profile.completeReadings.length,
					0
				),
				348
			);
			await writeFile(
				join(output, "browser-proof.json"),
				JSON.stringify(
					{
						complete: true,
						sourceCommit: profiles[0].sourceCommit,
						profiles
					},
					null,
					2
				) + "\n"
			);
			passed = true;
		} finally {
			try {
				if (browser) await browser.close();
			} finally {
				if (server?.httpServer)
					await new Promise(resolve =>
						server.httpServer.close(resolve)
					);
				process.chdir(previous);
				console.log(
					JSON.stringify({
						event: "end",
						taskId,
						cwd: root,
						command: "self-study-course-browser",
						pid: process.pid,
						startedAt,
						endedAt: new Date().toISOString(),
						exitCode: passed ? 0 : 1,
						cleanup:
							"browser contexts, browser and preview server closed"
					})
				);
			}
		}
	}
);
