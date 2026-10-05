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
import { strFromU8, unzipSync } from "fflate";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const axeSource = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
// Synthetic workflow fixture, not a completed course sorting assignment.
const fileIoInput = "b\n \nA\nb";
const fileIoOutput = "B\n \nA\nB\n";
const fileIoSource = [
	"from pathlib import Path",
	"source = Path('input.txt').read_text(encoding='utf-8')",
	"with open('output.txt', 'w', encoding='utf-8', newline='\\n') as output:",
	"    for letter in source.splitlines():",
	"        output.write(letter.upper() + '\\n')",
	"print('COURSE_FILE_IO_PASS')",
	""
].join("\n");

test(
	"confirmed imports, accessible resource roles, and saved Python file exports",
	{ timeout: 180000 },
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
				timeoutMs: 180000
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
				let fileIoFixture = false;
				await page.setRequestInterception(true);
				page.on("request", request => {
					if (
						request.interceptResolutionState().action === "disabled"
					) {
						if (!["GET", "OPTIONS"].includes(request.method()))
							remoteWrites++;
						const hostname = new URL(request.url()).hostname;
						if (
							[
								"api.github.com",
								"raw.githubusercontent.com"
							].includes(hostname)
						)
							sourceRequests++;
						return;
					}
					const url = new URL(request.url());
					if (url.hostname === "api.github.com") {
						sourceRequests++;
						void request.respond({
							status: failDownload ? 503 : 200,
							contentType: "application/json",
							headers: { "access-control-allow-origin": "*" },
							body: failDownload
								? "{}"
								: JSON.stringify(
										fileIoFixture
											? [
													...[
														"main.py",
														"input.txt"
													].map(name => ({
														type: "file",
														name,
														path: `starter/${name}`,
														size:
															name === "main.py"
																? Buffer.byteLength(
																		fileIoSource
																	)
																: Buffer.byteLength(
																		fileIoInput
																	),
														html_url: `https://github.com/example/course/blob/main/starter/${name}`,
														download_url: `https://raw.githubusercontent.com/example/course/main/starter/${name}`
													}))
												]
											: [
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
												]
									)
						});
					} else if (url.hostname === "raw.githubusercontent.com") {
						sourceRequests++;
						void request.respond({
							status: 200,
							contentType: "text/plain",
							headers: { "access-control-allow-origin": "*" },
							body: fileIoFixture
								? url.pathname.endsWith("/input.txt")
									? fileIoInput
									: fileIoSource
								: "print('course source marker')\n"
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

				// Real Python execution: release page-level interception only after
				// importing controlled source. CDP still blocks APIs and production
				// hosts; worker runtime imports otherwise stall under interception.
				courseFixture = false;
				fileIoFixture = true;
				const fileParams = new URLSearchParams({
					mode: "python",
					projectKey: "browser:file-io:starter",
					starterUrl:
						"https://github.com/example/course/tree/main/starter",
					starterTitle: "File workflow fixture"
				});
				await page.goto(`${origin}/ide?${fileParams}`, {
					waitUntil: "domcontentloaded"
				});
				await page.waitForSelector(
					"[data-testid='ide-route-import-confirm']"
				);
				assert.equal(
					sourceRequests,
					4,
					"File source also waits for confirmation"
				);
				await page.click("[data-testid='ide-route-import-confirm']");
				await page.waitForFunction(() =>
					document
						.querySelector(".cm-content")
						?.textContent.includes("COURSE_FILE_IO_PASS")
				);
				await page.waitForFunction(() =>
					[...document.querySelectorAll(".file-button")].some(
						button => button.textContent.includes("input.txt")
					)
				);
				assert.equal(
					sourceRequests,
					7,
					"One directory plus two exact source files"
				);
				const cdp = await page.createCDPSession();
				try {
					await cdp.send("Network.enable");
					await cdp.send("Network.setBlockedURLs", {
						urls: [
							`${origin}/api/*`,
							"*://classes.jacobdanderson.net/*",
							"*://scheduler.classes.jacobdanderson.net/*",
							"*://api.github.com/*",
							"*://raw.githubusercontent.com/*"
						]
					});
					await page.setRequestInterception(false);
					await page.waitForSelector(
						"button.run-control:not([disabled])"
					);
					assert.equal(
						await page.$eval(
							"[data-testid='ide-run-status']",
							element => element.getAttribute("role")
						),
						"status",
						"Run results remain a live status in the compact workspace"
					);
					await page.click("button.run-control");
					await page.waitForFunction(
						() =>
							document
								.querySelector(".output-panel")
								?.textContent.includes("COURSE_FILE_IO_PASS") &&
							document
								.querySelector("[data-testid='ide-run-status']")
								?.textContent.includes("Run complete"),
						{ timeout: 90000 }
					);
					await page.waitForFunction(
						expected => {
							const projects = JSON.parse(
								localStorage.getItem(
									"classes-python-ide-projects:anonymous"
								) ?? "[]"
							);
							return projects.some(project =>
								project.files.some(
									file =>
										file.name === "output.txt" &&
										file.content === expected
								)
							);
						},
						{},
						fileIoOutput
					);
					const clickFile = async name => {
						const index = await page.$$eval(
							".file-button",
							(buttons, name) =>
								buttons.findIndex(
									button =>
										button.querySelector("span")
											?.textContent === name
								),
							name
						);
						assert.ok(
							index >= 0,
							`Project file ${name} is available`
						);
						const buttons = await page.$$(".file-button");
						await buttons[index].click();
						for (const button of buttons) await button.dispose();
					};
					await clickFile("output.txt");
					await page.waitForFunction(
						() =>
							document.querySelector(
								".file-button.is-active span"
							)?.textContent === "output.txt"
					);
					assert.deepEqual(
						await page.$$eval(".cm-content .cm-line", lines =>
							lines.map(line => line.textContent)
						),
						fileIoOutput.split("\n"),
						"Generated output reopens in the editor with its space and final newline"
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
								"course-import-file-io-1280.png"
							),
							fullPage: true
						});
					}
					// Capture the actual ZIP triggered by the UI, not a reconstruction
					// from localStorage or a direct call to the archive helper.
					await page.evaluate(() => {
						const originalClick = HTMLAnchorElement.prototype.click;
						HTMLAnchorElement.prototype.click = function () {
							if (
								this.download.endsWith(".zip") &&
								this.href.startsWith("blob:")
							) {
								void fetch(this.href)
									.then(response => response.arrayBuffer())
									.then(bytes => {
										window.__courseDownloadedZip =
											Array.from(new Uint8Array(bytes));
									});
								return;
							}
							return originalClick.call(this);
						};
					});
					await page.click(
						"button[aria-label='Download project ZIP']"
					);
					await page.waitForFunction(() =>
						Array.isArray(window.__courseDownloadedZip)
					);
					const zip = unzipSync(
						Uint8Array.from(
							await page.evaluate(
								() => window.__courseDownloadedZip
							)
						)
					);
					const archivedFile = name => {
						const key = Object.keys(zip).find(path =>
							path.endsWith("/" + name)
						);
						assert.ok(key, `Export contains ${name}`);
						return strFromU8(zip[key]);
					};
					assert.equal(archivedFile("main.py"), fileIoSource);
					assert.equal(
						archivedFile("input.txt"),
						fileIoInput,
						"Original input bytes survive execution/export"
					);
					assert.equal(
						archivedFile("output.txt"),
						fileIoOutput,
						"Export retains generated file bytes"
					);
					console.log(
						"Real Python input, generated output, and exported ZIP bytes verified"
					);
					await page.reload({ waitUntil: "domcontentloaded" });
					await page.waitForSelector(".file-button");
					await clickFile("output.txt");
					await page.waitForFunction(
						() =>
							document.querySelector(
								".file-button.is-active span"
							)?.textContent === "output.txt"
					);
					assert.deepEqual(
						await page.$$eval(".cm-content .cm-line", lines =>
							lines.map(line => line.textContent)
						),
						fileIoOutput.split("\n"),
						"Generated file persists after reopening the workspace"
					);
					assert.equal(
						sourceRequests,
						7,
						"Reopening saved work does not redownload the starter"
					);
					assert.equal(
						await page.$("[data-testid='ide-route-import-prompt']"),
						null
					);
					assert.equal(
						remoteWrites,
						0,
						"File execution and export remain local"
					);
				} finally {
					await cdp.detach();
				}
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
