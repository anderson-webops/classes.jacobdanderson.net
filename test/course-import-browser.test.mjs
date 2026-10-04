import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import { runAxeInPage } from "../scripts/a11y-axe-runtime.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const axeSource = createRequire(import.meta.url).resolve("axe-core/axe.min.js");

test(
	"confirmed imports, retry, accessible feedback, and analysis resource roles",
	{ timeout: 120000 },
	async () => {
		let browser;
		let server;
		const previousDirectory = process.cwd();
		const startedAt = new Date().toISOString();
		const taskId =
			process.env.CLASSES_FAMILY_TASK_ID ?? "course-import-browser-ci";
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: "course-import-browser",
				pid: process.pid,
				startedAt,
				timeoutMs: 120000
			})
		);
		try {
			process.chdir(root);
			server = await createServer({
				root,
				server: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			await server.listen();
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				await puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(
				value => typeof value === "string" && value && existsSync(value)
			);
			assert.ok(
				executablePath,
				"Chrome is required for course import browser checks"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			const page = await browser.newPage();
			try {
				let failDownload = true;
				let sourceRequests = 0;
				let remoteWrites = 0;
				let courseFixture = false;
				await page.setRequestInterception(true);
				page.on("request", request => {
					const url = new URL(request.url());
					if (url.hostname === "api.github.com") {
						sourceRequests++;
						void request.respond({
							status: failDownload ? 503 : 200,
							contentType: "application/json",
							headers: { "access-control-allow-origin": "*" },
							body: failDownload
								? "{}"
								: JSON.stringify([
										{
											type: "file",
											name: "main.py",
											path: "starter/main.py",
											size: 29,
											html_url:
												"https://github.com/example/course/blob/main/starter/main.py",
											download_url:
												"https://raw.githubusercontent.com/example/course/main/starter/main.py"
										}
									])
						});
					} else if (url.hostname === "raw.githubusercontent.com") {
						sourceRequests++;
						void request.respond({
							status: 200,
							contentType: "text/plain",
							headers: { "access-control-allow-origin": "*" },
							body: "print('course source marker')\n"
						});
					} else if (
						url.origin !== origin ||
						url.pathname.startsWith("/api/")
					) {
						if (
							request.method() !== "GET" &&
							request.method() !== "OPTIONS"
						)
							remoteWrites++;
						// All APIs and external services are fixtures, never production requests.
						let body = {};
						if (
							courseFixture &&
							url.pathname === "/api/accounts/me"
						) {
							body = { userID: "course-fixture" };
						} else if (
							courseFixture &&
							url.pathname === "/api/users/loggedin"
						) {
							body = {
								currentUser: {
									_id: "course-fixture",
									name: "Course fixture",
									email: "course@example.invalid",
									courseAccess: ["python-level-3"],
									courseProgress: []
								}
							};
						}
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: JSON.stringify(body)
						});
					} else void request.continue();
				});
				for (const width of [390, 1280]) {
					await page.setViewport({ width, height: 900 });
					const before = sourceRequests;
					const params = new URLSearchParams({
						mode: "python",
						projectKey: `browser:${width}:starter`,
						starterUrl:
							"https://github.com/example/course/tree/main/starter",
						starterTitle: "Course import fixture"
					});
					await page.goto(`${origin}/ide?${params}`, {
						waitUntil: "domcontentloaded"
					});
					await page.waitForSelector(
						"[data-testid='ide-route-import-confirm']"
					);
					assert.equal(
						sourceRequests,
						before,
						"No source download before confirmation"
					);
					await page.click(
						"[data-testid='ide-route-import-confirm']"
					);
					await page.waitForSelector(
						"[data-testid='ide-route-import-error']"
					);
					assert.match(
						await page.$eval(
							"[data-testid='ide-route-import-error']",
							element => element.textContent
						),
						/GitHub returned 503/
					);
					assert.equal(
						await page.$(".code-ide-workspace"),
						null,
						"No replacement demo after a failed import"
					);
					assert.equal(
						await page.evaluate(
							() =>
								document.documentElement.scrollWidth <=
								innerWidth
						),
						true
					);
					await page.addScriptTag({ path: axeSource });
					assert.deepEqual(
						(await runAxeInPage(page)).violations,
						[],
						`Import error accessibility at ${width}px`
					);
					if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
						const directory = join(
							previousDirectory,
							process.env.COURSE_IMPORT_SCREENSHOT_DIR
						);
						await mkdir(directory, { recursive: true });
						await page.screenshot({
							path: join(
								directory,
								`course-import-error-${width}.png`
							),
							fullPage: true
						});
					}
				}
				failDownload = false;
				await page.click("[data-testid='ide-route-import-confirm']");
				await page.waitForSelector(".code-ide-workspace .cm-content");
				await page.waitForFunction(() =>
					document
						.querySelector(".cm-content")
						?.textContent.includes("course source marker")
				);
				assert.equal(
					await page.$("[data-testid='ide-route-import-prompt']"),
					null
				);
				assert.equal(remoteWrites, 0, "Anonymous imports remain local");
				assert.equal(
					sourceRequests,
					4,
					"Two failed downloads plus one complete retry"
				);
				courseFixture = true;
				for (const width of [390, 1280]) {
					await page.setViewport({ width, height: 900 });
					await page.goto(
						`${origin}/courses#python-level-3-am6-introduction-to-algorithms-runtime-analysis`,
						{ waitUntil: "domcontentloaded" }
					);
					const worksheetSelector =
						"a[href*='AM6-Big-O-Analysis/starter']";
					const analysisSelector =
						"a[href*='AM6-Function-Analysis/starter']";
					await page.waitForSelector(worksheetSelector);
					await page.waitForSelector(analysisSelector);
					assert.match(
						await page.$eval(
							worksheetSelector,
							link => link.textContent
						),
						/Worksheet/
					);
					assert.equal(
						await page.$eval(worksheetSelector, link => {
							return [
								...link
									.closest(".lesson-item")
									.querySelectorAll("button")
							].some(button =>
								/Preview starter code/.test(button.textContent)
							);
						}),
						false,
						"A worksheet does not offer a code preview"
					);
					assert.equal(
						await page.$eval(
							worksheetSelector,
							link =>
								link
									.closest(".lesson-item")
									.querySelectorAll(".is-ide-starter").length
						),
						0,
						"The mathematical worksheet keeps its readable source link without an IDE shortcut"
					);
					const analysisHref = await page.$eval(
						analysisSelector,
						link =>
							link
								.closest(".lesson-item")
								.querySelector(".is-ide-starter")
								.getAttribute("href")
					);
					const query = new URL(analysisHref, origin).searchParams;
					assert.equal(query.get("mode"), "python");
					assert.equal(
						query.get("starterUrl"),
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Function-Analysis/starter"
					);
					assert.equal(
						sourceRequests,
						4,
						"Reading course instructions does not download code"
					);
					if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
						const directory = join(
							previousDirectory,
							process.env.COURSE_IMPORT_SCREENSHOT_DIR
						);
						for (const [role, selector] of [
							["worksheet", worksheetSelector],
							["analysis", analysisSelector]
						]) {
							const link = await page.$(selector);
							const card = await link.evaluateHandle(element =>
								element.closest(".lesson-item")
							);
							await card.asElement().screenshot({
								path: join(
									directory,
									`course-import-${role}-${width}.png`
								)
							});
							await card.dispose();
							await link.dispose();
						}
					}
					await page.goto(new URL(analysisHref, origin).href, {
						waitUntil: "domcontentloaded"
					});
					await page.waitForSelector(
						"[data-testid='ide-route-import-confirm']"
					);
					assert.equal(
						sourceRequests,
						4,
						"Supplied-code analysis still requires confirmation before downloading"
					);
				}
				assert.equal(
					remoteWrites,
					0,
					"Resource inspection never writes to production"
				);
			} finally {
				await page.close();
			}
		} finally {
			if (browser) await browser.close();
			if (server) await server.close();
			process.chdir(previousDirectory);
			console.log(
				JSON.stringify({
					event: "cleanup",
					taskId,
					pid: process.pid,
					startedAt,
					endedAt: new Date().toISOString()
				})
			);
		}
	}
);
