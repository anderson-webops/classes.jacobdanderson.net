import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { confirmProjectImport } from "./ide-workspace-controls.mjs";
import {
	exportedBytes,
	savedProjects,
	waitSaved
} from "./pygames-core-browser-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/physics-level-2-code-packs.json", import.meta.url),
		"utf8"
	)
);
const output =
	process.env.PHYSICS2_BROWSER_PROOF_DIR ??
	"output/physics-level-2-workflows";
const digest = value => createHash("sha256").update(value).digest("hex");
const sourceOwner = "anderson-webops/classes.jacobdanderson.net";
const storageKey = "classes-python-ide-projects:anonymous";
const sources = new Map();

function account(path, staff, inIde) {
	if (inIde) return {};
	const learner = {
		_id: "physics-browser-learner",
		name: "Learner",
		email: "learner@example.invalid",
		age: 14,
		state: "GA",
		courseAccess: ["physics-level-2"],
		courseProgress: []
	};
	if (path === "/api/accounts/me")
		return staff
			? { tutorID: "physics-browser-tutor" }
			: { userID: learner._id };
	if (path === "/api/users/loggedin" && !staff)
		return { currentUser: learner };
	if (path === "/api/tutors/loggedin" && staff)
		return {
			currentTutor: {
				_id: "physics-browser-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				coursePermissions: ["physics-level-2"],
				usersOfTutorLength: 1,
				editTutors: false,
				saveEdit: "Save"
			}
		};
	if (path === "/api/users/oftutor/physics-browser-tutor") return [learner];
	return {};
}

function checkNumericOutput(text, pack) {
	const records = text
		.split("\n")
		.map(line => line.trim())
		.filter(line => line.startsWith("{"))
		.map(line => JSON.parse(line));
	if (pack === "orbit-model") {
		assert.equal(records.length, 3);
		assert.deepEqual(
			records.map(record => record.step_s),
			[10, 5, 2.5]
		);
		for (const record of records) {
			assert.ok(Math.abs(record.period_s - 5543.629845125085) < 1e-7);
			assert.ok(record.max_relative_radius_error < 0.01);
			assert.ok(record.max_relative_energy_error < 0.001);
		}
		assert.ok(
			records[2].max_relative_radius_error <
				records[1].max_relative_radius_error
		);
		assert.ok(
			records[1].max_relative_radius_error <
				records[0].max_relative_radius_error
		);
	} else {
		assert.equal(records.length, 6);
		assert.deepEqual(
			records
				.slice(0, 4)
				.map(record => Number(record.absolute_error_m.toFixed(6))),
			[9.8, 4.9, 2.45, 1.225]
		);
		const energies = [
			[
				0.5, 0.6418124443692347, 0.8238464274944239, 1.0575097788301124,
				1.3574458721906466
			],
			[
				0.5, 0.5073882100497722, 0.4887596930631416, 0.5126116634332623,
				0.4912402245314406
			]
		];
		for (const [index, method] of ["explicit", "symplectic"].entries()) {
			assert.equal(records[index + 4].method, method);
			assert.deepEqual(
				records[index + 4].samples.map(sample => sample.time_s),
				[0, 5, 10, 15, 20]
			);
			for (const [i, sample] of records[index + 4].samples.entries())
				assert.ok(
					Math.abs(sample.energy_J - energies[index][i]) < 1e-8
				);
		}
	}
	return records;
}

async function runProgram(page, activity, width, complete, marker = "") {
	if (width < 900)
		await page
			.locator(".mobile-view-picker button[data-view='code']")
			.click();
	await page.locator("button.run-control").click();
	if (width < 900)
		await page
			.locator(".mobile-view-picker button[data-view='console']")
			.click();
	await page.waitForFunction(
		expected => {
			const status = document
				.querySelector("[data-testid='ide-run-status']")
				?.textContent.trim();
			if (
				status === "Run failed" ||
				status === "Run finished with issues"
			)
				return true;
			const stdout = [
				...document.querySelectorAll(".output-line--stdout")
			]
				.map(element => element.textContent)
				.join("\n");
			return status === "Run complete" && stdout.includes(expected);
		},
		{ timeout: 90000 },
		marker || (complete ? activity.completion : "starter:")
	);
	const status = await page.$eval("[data-testid='ide-run-status']", element =>
		element.textContent.trim()
	);
	const text = await page.$$eval(".output-line--stdout", elements =>
		elements.map(element => element.textContent).join("\n")
	);
	const errors = await page.$$eval(".output-line--stderr", elements =>
		elements.map(element => element.textContent).join("\n")
	);
	assert.equal(status, "Run complete", errors);
	assert.equal(errors, "");
	if (complete) {
		assert.ok(text.includes(activity.completion), text);
		checkNumericOutput(text, activity.pack);
	} else {
		assert.match(text, /starter:/);
		assert.ok(!text.includes(activity.completion));
		assert.ok(
			!text.includes('"period_s"') && !text.includes('"absolute_error_m"')
		);
	}
	if (marker) assert.ok(text.includes(marker));
	return {
		status,
		stdout: text,
		stderr: errors,
		complete,
		editedMarker: marker || null
	};
}

async function retainZip(page, project, label) {
	const bytes = await exportedBytes(page);
	const members = unzipSync(bytes);
	assert.equal(Object.keys(members).length, 2);
	for (const file of project.files) {
		const paths = Object.keys(members).filter(path =>
			path.endsWith("/" + file.name)
		);
		assert.equal(paths.length, 1, file.name);
		assert.ok(
			!paths[0].startsWith("/") && !paths[0].split("/").includes("..")
		);
		assert.deepEqual(
			Buffer.from(members[paths[0]]),
			Buffer.from(file.content, "utf8"),
			file.name
		);
	}
	const name = label + ".zip";
	await writeFile(join(output, name), bytes);
	return {
		file: name,
		bytes: bytes.length,
		sha256: digest(bytes),
		memberSHA256: Object.fromEntries(
			Object.entries(members).map(([name, content]) => [
				name,
				digest(content)
			])
		)
	};
}

async function editMain(page, width, key, content) {
	if (width < 900)
		await page
			.locator(".mobile-view-picker button[data-view='code']")
			.click();
	await page.select("select[aria-label='Active project file']", "main.py");
	await page.waitForSelector(".cm-content", { visible: true });
	await page.focus(".cm-content");
	const modifier = await page.evaluate(() =>
		/Mac/.test(navigator.platform) ? "Meta" : "Control"
	);
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(content);
	await page.keyboard.down(modifier);
	await page.keyboard.press("s");
	await page.keyboard.up(modifier);
	return waitSaved(page, key, project =>
		project.files.some(
			file => file.name === "main.py" && file.content === content
		)
	);
}

async function checkViewer(page, selector, expectedAsset, card, label) {
	const href = await page.$eval(selector, element =>
		element.getAttribute("href")
	);
	const url = new URL(href, page.url());
	assert.equal(url.pathname, "/course-resource");
	assert.equal(url.searchParams.get("asset"), expectedAsset);
	await page.$eval(selector, element => {
		element.target = "_self";
	});
	await page.locator(selector).click();
	await page.waitForSelector(".course-resource-card .item-content-markdown");
	assert.equal(await page.$(".course-resource-error"), null);
	const heading = await page.$eval(".course-resource-page h1", element =>
		element.textContent.trim()
	);
	assert.equal(
		heading
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-"),
		expectedAsset.split("#")[1]
	);
	const text = await page.$eval(
		".course-resource-card",
		element => element.innerText
	);
	assert.ok(text.length > 300);
	await page.screenshot({
		path: join(output, label + ".png"),
		fullPage: true
	});
	await page.goBack({ waitUntil: "domcontentloaded" });
	await page.waitForSelector(card);
	return { href, expectedAsset, heading, renderedTextSHA256: digest(text) };
}

async function checkMaterialPreview(page, activity, card, staff, label) {
	const toggle = card + " .course-asset-preview-toggle";
	await page.locator(toggle).click();
	await page.waitForSelector(
		card + " .course-asset-preview-content .item-content-markdown"
	);
	const text = await page.$eval(
		card + " .course-asset-preview-content",
		element => element.textContent
	);
	assert.ok(text.length > 300);
	assert.equal(await page.$(card + " .course-asset-preview-error"), null);
	const link = await page.$eval(
		card + " .course-asset-preview-open-link",
		element => element.getAttribute("href")
	);
	const url = new URL(link, page.url());
	assert.equal(url.pathname, "/course-resource");
	assert.equal(
		url.searchParams.get("asset"),
		"/course-assets/physics/physics-level-2-materials-pack.md#" +
			activity.caseSection
	);
	const materialViewer = await checkViewer(
		page,
		card + " .course-asset-preview-open-link",
		url.searchParams.get("asset"),
		card,
		label + "-material"
	);
	let answerViewer = null;
	if (staff) {
		const selector =
			".lesson-item a.resource-link.is-solution[href*='physics-level-2-rubrics-answer-key.md']";
		answerViewer = await checkViewer(
			page,
			selector,
			"/course-assets/physics/physics-level-2-rubrics-answer-key.md#" +
				activity.answerSection,
			card,
			label + "-answer"
		);
	} else assert.equal(await page.$(".lesson-item a.is-solution"), null);
	return {
		previewOpened: true,
		viewerHref: link,
		textSHA256: digest(text),
		materialViewer,
		answerViewer
	};
}

nodeTest(
	"Physics Level 2 confirmed imports, real Python results, edits, saved continuations and exports",
	{ timeout: 1200000 },
	async t => {
		const taskId =
			process.env.CLASSES_FAMILY_TASK_ID ?? "physics-level-2-browser";
		const startedAt = new Date().toISOString();
		const profiles = [];
		const sessions = [];
		let server, browser, context, page;
		let exitCode = 1;
		let activeLabel = "";
		let activeStage = "";
		let cleanupPromise;
		async function cleanup() {
			if (cleanupPromise) return cleanupPromise;
			cleanupPromise = (async () => {
				if (context) await context.close().catch(() => {});
				context = null;
				if (browser) await browser.close();
				browser = null;
				if (server) await server.close();
				server = null;
			})();
			return cleanupPromise;
		}
		t.signal.addEventListener(
			"abort",
			() => {
				void cleanup();
			},
			{ once: true }
		);
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: process.argv,
				pid: process.pid,
				parentPid: process.ppid,
				startedAt,
				timeoutMs: 1200000
			})
		);
		try {
			await mkdir(output, { recursive: true });
			for (const [path, identity] of Object.entries(fixture.files)) {
				const content = await readFile(
					join(root, "public/course-assets/physics/code-packs", path)
				);
				assert.equal(content.length, identity.bytes, path);
				assert.equal(digest(content), identity.sha256, path);
				sources.set(path, content);
			}
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(executablePath, "Chrome is required");
			for (const activity of fixture.activities) {
				for (const role of ["starter", "reference"]) {
					for (const width of [390, 1280]) {
						activeLabel = activity.pack + "-" + role + "-" + width;
						activeStage = "opening course";
						const key =
							"physics-level-2:" + activity.item + ":" + role;
						const otherKey =
							"physics-level-2:" +
							activity.item +
							":" +
							(role === "starter" ? "reference" : "starter");
						const earlier = {
							_id: "preserved-physics-work",
							title: "Earlier physics work",
							mode: "python",
							courseID: "physics-level-2",
							courseProjectKey: otherKey,
							activeFileName: "main.py",
							files: [
								{
									name: "main.py",
									content: "print('earlier work retained')\n",
									encoding: "text"
								}
							],
							createdAt: "2026-10-01T12:00:00.000Z",
							updatedAt: "2026-10-01T12:00:00.000Z"
						};
						const requests = [],
							pageErrors = [];
						let inIde = false,
							writes = 0;
						browser = await puppeteer.launch({
							executablePath,
							headless: true,
							args: ["--no-sandbox"]
						});
						const child = browser.process();
						const session = {
							label: activeLabel,
							pid: child?.pid,
							parentPid: process.pid,
							cwd: root,
							command: child?.spawnargs,
							startedAt: new Date().toISOString(),
							timeoutMs: 1200000
						};
						sessions.push(session);
						console.log(
							JSON.stringify({
								event: "browser-start",
								taskId,
								...session
							})
						);
						context = await browser.createBrowserContext();
						page = await context.newPage();
						page.setDefaultTimeout(30000);
						await page.setViewport({ width, height: 950 });
						page.on("pageerror", error =>
							pageErrors.push(String(error))
						);
						page.on("error", error =>
							pageErrors.push(String(error))
						);
						await page.evaluateOnNewDocument(
							(storage, previous) => {
								if (window !== window.top) return;
								if (localStorage.getItem(storage) === null)
									localStorage.setItem(
										storage,
										JSON.stringify([previous])
									);
								const create = URL.createObjectURL;
								URL.createObjectURL = blob => {
									if (blob.type === "application/zip")
										window.__pyGamesArchive = blob;
									return create(blob);
								};
								const click = HTMLAnchorElement.prototype.click;
								HTMLAnchorElement.prototype.click =
									function () {
										if (
											this.download.endsWith(".zip") &&
											this.href.startsWith("blob:")
										)
											return;
										return click.call(this);
									};
							},
							storageKey,
							earlier
						);
						await page.setRequestInterception(true);
						page.on("request", request => {
							void (async () => {
								const url = new URL(request.url());
								const headers = {
									"access-control-allow-origin": "*"
								};
								if (url.hostname === "api.github.com") {
									requests.push({
										type: "directory",
										url: request.url(),
										inIde
									});
									const prefix =
										"/repos/" +
										sourceOwner +
										"/contents/" +
										fixture.sourceRoot +
										"/";
									const relative = url.pathname.startsWith(
										prefix
									)
										? decodeURIComponent(
												url.pathname.slice(
													prefix.length
												)
											)
										: "";
									const valid =
										url.searchParams.get("ref") ===
											fixture.revision &&
										[...sources.keys()].some(path =>
											path.startsWith(relative + "/")
										);
									const files = valid
										? [...sources.keys()]
												.filter(path =>
													path.startsWith(
														relative + "/"
													)
												)
												.map(path => ({
													type: "file",
													name: path
														.split("/")
														.at(-1),
													path:
														fixture.sourceRoot +
														"/" +
														path,
													size: sources.get(path)
														.length,
													html_url:
														"https://github.com/" +
														sourceOwner +
														"/blob/" +
														fixture.revision +
														"/" +
														fixture.sourceRoot +
														"/" +
														path,
													download_url:
														"https://raw.githubusercontent.com/" +
														sourceOwner +
														"/" +
														fixture.revision +
														"/" +
														fixture.sourceRoot +
														"/" +
														path
												}))
										: [];
									await request.respond({
										status: valid ? 200 : 404,
										contentType: "application/json",
										headers,
										body: JSON.stringify(files)
									});
								} else if (
									url.hostname === "raw.githubusercontent.com"
								) {
									const prefix =
										"/" +
										sourceOwner +
										"/" +
										fixture.revision +
										"/" +
										fixture.sourceRoot +
										"/";
									const relative = url.pathname.startsWith(
										prefix
									)
										? decodeURIComponent(
												url.pathname.slice(
													prefix.length
												)
											)
										: "";
									const content = sources.get(relative);
									requests.push({
										type: "file",
										path: relative,
										valid: !!content,
										inIde
									});
									await request.respond({
										status: content ? 200 : 404,
										contentType: "text/plain",
										headers,
										body: content ?? "Unknown source"
									});
								} else if (url.pathname.startsWith("/api/")) {
									if (
										!["GET", "OPTIONS"].includes(
											request.method()
										)
									)
										writes++;
									await request.respond({
										status: 200,
										contentType: "application/json",
										body: JSON.stringify(
											account(
												url.pathname,
												role === "reference",
												inIde
											)
										)
									});
								} else await request.continue();
							})().catch(error => {
								pageErrors.push(
									"Request handler: " + String(error)
								);
								void request.abort().catch(() => {});
							});
						});
						try {
							await page.goto(
								origin + "/courses#" + activity.module,
								{ waitUntil: "domcontentloaded" }
							);
							await page.waitForSelector(
								".lesson-view-toggle button"
							);
							await page
								.locator(
									".lesson-view-toggle button:nth-child(1)"
								)
								.click();
							const card =
								"#" + activity.module + "-" + activity.item;
							await page.waitForSelector(card);
							const actions = await page.$$eval(
								card + " a.is-ide-starter",
								elements =>
									elements.map(element =>
										element.getAttribute("href")
									)
							);
							assert.equal(
								actions.length,
								role === "reference" ? 2 : 1
							);
							const href = actions.find(
								href =>
									new URL(href, origin).searchParams.get(
										"projectKey"
									) === key
							);
							assert.ok(href);
							const params = new URL(href, origin).searchParams;
							assert.equal(params.get("mode"), "python");
							assert.equal(
								params.get("starterUrl"),
								"https://github.com/" +
									sourceOwner +
									"/tree/" +
									fixture.revision +
									"/" +
									fixture.sourceRoot +
									"/" +
									activity.pack +
									"/" +
									role
							);
							const material = await checkMaterialPreview(
								page,
								activity,
								card,
								role === "reference",
								activeLabel
							);
							await page.$eval(card, element =>
								element.scrollIntoView({ block: "center" })
							);
							await page.screenshot({
								path: join(output, activeLabel + "-course.png")
							});
							assert.equal(
								requests.length,
								0,
								"Unopened code previews must not import source"
							);
							const selector =
								card + " a[href=" + JSON.stringify(href) + "]";
							await page.$eval(selector, element => {
								element.target = "_self";
							});
							inIde = true;
							activeStage = "awaiting import confirmation";
							await page.locator(selector).click();
							await page.waitForSelector(
								"[data-testid='ide-route-import-confirm']"
							);
							assert.equal(requests.length, 0);
							assert.ok(
								!(await savedProjects(page)).some(
									project => project.courseProjectKey === key
								)
							);
							await confirmProjectImport(page);
							activeStage = "checking imported source";
							await page.waitForSelector(
								"select[aria-label='Active project file']"
							);
							const imported = await waitSaved(
								page,
								key,
								project => project.files.length === 2
							);
							assert.equal(imported.mode, "python");
							assert.equal(imported.activeFileName, "main.py");
							assert.deepEqual(
								imported.files.map(file => file.name),
								["main.py", "README.md"]
							);
							assert.equal(
								requests.filter(
									request => request.type === "directory"
								).length,
								1
							);
							assert.equal(
								requests.filter(
									request => request.type === "file"
								).length,
								2
							);
							assert.ok(requests.every(request => request.inIde));
							for (const file of imported.files)
								assert.equal(
									file.content,
									sources
										.get(
											activity.pack +
												"/" +
												role +
												"/" +
												file.name
										)
										.toString("utf8")
								);
							const exact = await retainZip(
								page,
								imported,
								activeLabel + "-exact"
							);
							activeStage = "running original import";
							const before = await runProgram(
								page,
								activity,
								width,
								role === "reference"
							);
							const marker =
								"physics_browser_edit_" +
								activeLabel.replaceAll("-", "_");
							const completed =
								sources
									.get(activity.pack + "/reference/main.py")
									.toString("utf8") +
								"\nprint(" +
								JSON.stringify(marker) +
								")\n";
							activeStage = "editing learner or reference source";
							const edited = await editMain(
								page,
								width,
								key,
								completed
							);
							const after = await runProgram(
								page,
								activity,
								width,
								true,
								marker
							);
							activeStage = "reopening saved project";
							await page.reload({
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"select[aria-label='Active project file']"
							);
							assert.equal(
								await page.$(
									"[data-testid='ide-route-import-confirm']"
								),
								null
							);
							const reopened = await waitSaved(page, key);
							assert.equal(reopened._id, imported._id);
							assert.deepEqual(reopened.files, edited.files);
							const continued = await runProgram(
								page,
								activity,
								width,
								true,
								marker
							);
							const exported = await retainZip(
								page,
								reopened,
								activeLabel + "-edited"
							);
							const preserved = (await savedProjects(page)).find(
								project => project.courseProjectKey === otherKey
							);
							assert.equal(preserved._id, earlier._id);
							assert.deepEqual(preserved.files, earlier.files);
							assert.equal(
								requests.length,
								3,
								"Reopening edited work must not reimport or overwrite it"
							);
							assert.equal(writes, 0);
							assert.deepEqual(pageErrors, []);
							await page.screenshot({
								path: join(
									output,
									activeLabel + "-workspace.png"
								)
							});
							profiles.push({
								label: activeLabel,
								activity: activity.pack,
								role,
								width,
								courseActionHref: href,
								projectKey: key,
								material,
								requests,
								consentBeforeFetch: true,
								initialFilesExact: true,
								exact,
								before,
								after,
								continued,
								edited: exported,
								sameProjectReopened: true,
								otherRoleWorkPreserved: true,
								unexpectedPageErrors: pageErrors,
								apiWrites: writes
							});
							await writeFile(
								join(output, "browser-proof.json"),
								JSON.stringify(
									{
										source: process.env.GITHUB_SHA ?? null,
										pinnedPackSource: fixture.revision,
										profiles
									},
									null,
									2
								)
							);
						} catch (error) {
							const state = {
								label: activeLabel,
								stage: activeStage,
								url: page.url(),
								requests,
								pageErrors,
								error: String(error),
								body: await page
									.evaluate(() => document.body.innerText)
									.catch(() => ""),
								storage: await savedProjects(page).catch(
									() => null
								)
							};
							await writeFile(
								join(output, activeLabel + "-failure.json"),
								JSON.stringify(state, null, 2)
							);
							await page
								.screenshot({
									path: join(
										output,
										activeLabel + "-failure.png"
									),
									fullPage: true
								})
								.catch(() => {});
							throw error;
						} finally {
							await context.close();
							context = null;
							await browser.close();
							browser = null;
							Object.assign(session, {
								endedAt: new Date().toISOString(),
								exitCode: child?.exitCode,
								signalCode: child?.signalCode,
								childProcessCleanup:
									"closed through browser API"
							});
							console.log(
								JSON.stringify({
									event: "browser-end",
									taskId,
									...session
								})
							);
							await writeFile(
								join(output, "browser-processes.json"),
								JSON.stringify(sessions, null, 2)
							);
						}
					}
				}
			}
			assert.equal(profiles.length, 8);
			exitCode = 0;
		} finally {
			await cleanup();
			console.log(
				JSON.stringify({
					event: "end",
					taskId,
					pid: process.pid,
					cwd: root,
					command: process.argv,
					startedAt,
					endedAt: new Date().toISOString(),
					exitCode,
					timeoutMs: 1200000,
					childProcessCleanup:
						"owned contexts, browsers and preview server closed"
				})
			);
		}
	}
);
