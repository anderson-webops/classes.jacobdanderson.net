import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import net from "node:net";
import { resolve } from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";
import { coursePathwayMaps } from "../front-end/src/modules/coursePathwayMaps.ts";
import { runAxeInPage } from "./a11y-axe-runtime.mjs";

const root = process.cwd();
const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "public-course-discovery";
const port = Number(process.env.DISCOVERY_PREVIEW_PORT ?? 3353);
const localOrigin = `http://127.0.0.1:${port}`;
const canonicalOrigin = "https://classes.jacobdanderson.net";
const artifactDir
	= process.env.DISCOVERY_ARTIFACT_DIR ?? "/tmp/classes-course-discovery";
const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const chromePath = [
	process.env.PUPPETEER_EXECUTABLE_PATH,
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium"
].find(candidate => candidate && existsSync(candidate));
const fixtureStudent = {
	_id: "discovery-student",
	name: "Example Student",
	email: "student@example.invalid",
	age: 14,
	state: "GA",
	courseAccess: ["python-level-1"],
	courseProgress: [],
	editUsers: false,
	saveEdit: "Save"
};
const fixtureTutor = {
	_id: "discovery-tutor",
	name: "Example Tutor",
	email: "tutor@example.invalid",
	age: 30,
	state: "GA",
	usersOfTutorLength: 1,
	coursePermissions: ["python-level-1"],
	editTutors: false,
	saveEdit: "Save"
};
const fixtureAdmin = {
	_id: "discovery-admin",
	name: "Example Admin",
	email: "admin@example.invalid",
	editAdmins: false,
	saveEdit: "Save"
};
let activeRole = "guest";
let browser;
let server;
let cleanupPromise;
const pageErrors = [];
const unexpectedWrites = [];
const responseCache = new Map();
const expectedCourseIds = coursePathwayMaps.flatMap(pathway =>
	pathway.stages.flatMap(stage => stage.courseIds)
);

function log(event, extra = {}) {
	console.log(
		JSON.stringify({
			taskId,
			event,
			at: new Date().toISOString(),
			...extra
		})
	);
}
async function checkPort() {
	const probe = net.createServer();
	await new Promise((resolveProbe, reject) => {
		probe.once("error", reject);
		probe.listen(port, "127.0.0.1", resolveProbe);
	});
	await new Promise(resolveProbe => probe.close(resolveProbe));
}
async function waitForPreview() {
	const deadline = Date.now() + 30000;
	while (Date.now() < deadline) {
		try {
			if ((await fetch(localOrigin)).ok) return;
		}
		catch {}
		await new Promise(resolveWait => setTimeout(resolveWait, 250));
	}
	throw new Error("Isolated preview did not become ready.");
}
function cleanup() {
	cleanupPromise ??= (async () => {
		if (browser) await browser.close();
		if (!server || server.exitCode !== null || server.signalCode !== null)
			return;
		const exited = new Promise(resolveExit =>
			server.once("exit", resolveExit)
		);
		try {
			process.kill(-server.pid, "SIGTERM");
		}
		catch {}
		await Promise.race([
			exited,
			new Promise(resolveWait => setTimeout(resolveWait, 5000))
		]);
		if (server.exitCode === null && server.signalCode === null) {
			try {
				process.kill(-server.pid, "SIGKILL");
			}
			catch {}
			await exited;
		}
		log("process-group-cleanup", { pid: server.pid });
	})();
	return cleanupPromise;
}
for (const signal of ["SIGINT", "SIGTERM"]) {
	process.once(signal, () => void cleanup().finally(() => process.exit(130)));
}
function apiFixture(pathname) {
	if (pathname === "/api/accounts/me") {
		if (activeRole === "student") return { userID: fixtureStudent._id };
		if (activeRole === "tutor") return { tutorID: fixtureTutor._id };
		if (activeRole === "admin") return { adminID: fixtureAdmin._id };
		return {};
	}
	if (pathname === "/api/users/loggedin")
		return { currentUser: fixtureStudent };
	if (pathname === "/api/tutors/loggedin")
		return { currentTutor: fixtureTutor };
	if (pathname === "/api/admins/loggedin")
		return { currentAdmin: fixtureAdmin };
	if (pathname === "/api/course-access/me")
		return { currentCourseLearner: null };
	if (
		pathname === "/api/users/all"
		|| pathname === `/api/users/oftutor/${fixtureTutor._id}`
	) {
		return [fixtureStudent];
	}
	return {};
}
async function intercept(page) {
	await page.setRequestInterception(true);
	page.on("request", async (request) => {
		try {
			const url = new URL(request.url());
			if (url.pathname.startsWith("/api/")) {
				log("fixture-api", { role: activeRole, pathname: url.pathname });
				if (request.method() !== "GET")
					unexpectedWrites.push(url.pathname);
				await request.respond({
					status: 200,
					contentType: "application/json",
					headers: { "cache-control": "no-store" },
					body: JSON.stringify(apiFixture(url.pathname))
				});
			}
			else if (
				[
					canonicalOrigin,
					"https://cs.avasan.org",
					"https://instruction-material.classes.jacobdanderson.net"
				].includes(url.origin)
			) {
				const localUrl = localOrigin + url.pathname + url.search;
				if (!responseCache.has(localUrl)) {
					const response = await fetch(localUrl);
					responseCache.set(localUrl, {
						status: response.status,
						contentType:
							response.headers.get("content-type")
							?? "text/plain",
						body: Buffer.from(await response.arrayBuffer())
					});
				}
				await request.respond(responseCache.get(localUrl));
			}
			else if (request.resourceType() === "image") {
				await request.respond({
					status: 200,
					contentType: "image/svg+xml",
					body: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"900\"><rect width=\"1200\" height=\"900\" fill=\"#64748b\"/></svg>"
				});
			}
			else {
				await request.abort();
			}
		}
		catch (error) {
			pageErrors.push(String(error));
			if (!request.isInterceptResolutionHandled()) await request.abort();
		}
	});
	page.on("pageerror", error => pageErrors.push(String(error)));
}
async function verifyLayout(page, name) {
	assert(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth + 1
		),
		`${name} has horizontal overflow`
	);
	await page.addScriptTag({ path: axePath });
	const { violations } = await runAxeInPage(page);
	const serious = violations.filter(violation =>
		["serious", "critical"].includes(violation.impact)
	);
	assert.deepEqual(
		serious.map(violation => ({
			id: violation.id,
			targets: violation.nodes.map(node => node.target)
		})),
		[],
		`${name} accessibility`
	);
	log("layout-pass", { name });
}
async function openPage(page, pathname, origin = canonicalOrigin) {
	await page.goto(origin + pathname, {
		waitUntil: "networkidle0",
		timeout: 30000
	});
	await page.waitForSelector("main h1");
}
try {
	await checkPort();
	mkdirSync(artifactDir, { recursive: true });
	const command = [
		resolve(root, "node_modules/vite/bin/vite.js"),
		"preview",
		"--host",
		"127.0.0.1",
		"--port",
		String(port),
		"--strictPort"
	];
	server = spawn(process.execPath, command, {
		cwd: resolve(root, "front-end"),
		detached: true,
		stdio: ["ignore", "pipe", "pipe"]
	});
	log("start", { command, cwd: root, pid: server.pid, timeoutMs: 30000 });
	server.on("exit", (exitCode, signal) =>
		log("exit", { pid: server.pid, exitCode, signal }));
	server.stderr.on("data", chunk => process.stderr.write(chunk));
	await waitForPreview();
	browser = await puppeteer.launch({
		headless: true,
		executablePath: chromePath,
		args: ["--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost"]
	});
	const context = await browser.createBrowserContext();
	const page = await context.newPage();
	await page.setCacheEnabled(false);
	await intercept(page);
	for (const theme of ["light", "dark"]) {
		await page.emulateMediaFeatures([
			{ name: "prefers-color-scheme", value: theme }
		]);
		for (const width of [1440, 768, 390]) {
			await page.setViewport({ width, height: 950 });
			for (const pathname of [
				"/",
				"/pathways",
				"/courses#python-level-1",
				"/about"
			]) {
				await openPage(page, pathname);
				if (pathname === "/pathways") {
					assert.equal(
						await page.$$eval(
							"main a[href^=\"/courses#\"]",
							anchors => anchors.length
						),
						expectedCourseIds.length
					);
					assert.equal(
						await page.$$eval(
							"main details",
							elements => elements.length
						),
						0
					);
					await page.click(".pathway-filters button:nth-child(3)");
					assert.equal(
						await page.$$eval(
							".pathway-card",
							elements => elements.length
						),
						1
					);
					await page.click(".pathway-filters button:first-child");
				}
				if (pathname.startsWith("/courses")) {
					await page.waitForSelector("#course-select");
					assert.equal(
						await page.$$eval(
							"#course-select option",
							options => options.length
						),
						expectedCourseIds.length
					);
					assert.equal(
						await page.$eval(
							"#course-select",
							element => element.value
						),
						"python-level-1"
					);
					assert(await page.$(".catalog-signin"));
					await page.select("#course-select", "scratch-level-1");
					await page.waitForSelector(".lesson-view-toggle button");
					await page.waitForFunction(() => document.querySelector(".lesson-card h5")?.textContent?.includes("Hungry Hippo"));
					assert.equal(await page.$(".module-guide-disclosure"), null);
					for (const [viewIndex, label] of ["Projects", "Supplemental Projects", "Learn"].entries()) {
						await page.click(`.lesson-view-toggle button:nth-child(${viewIndex + 1})`);
						await page.waitForFunction(expected => document.querySelector("#lesson-view-content")?.getAttribute("aria-label") === expected, {}, label);
						await page.waitForFunction(() => [...document.querySelectorAll(".item-content-markdown")].every(element => element.textContent.trim()));
						assert.equal(await page.$eval(`.lesson-view-toggle button:nth-child(${viewIndex + 1})`, element => element.getAttribute("aria-pressed")), "true");
						assert.equal(await page.$(".key-blocks") !== null, label === "Learn");
						await verifyLayout(page, `lesson-${label}-${theme}-${width}`);
						await page.screenshot({ path: resolve(artifactDir, `lesson-${viewIndex}-${theme}-${width}.png`) });
					}
				}
				if (pathname === "/") {
					const hrefs = await page.$$eval("a[href]", anchors =>
						anchors
							.filter(
								anchor =>
									anchor.getClientRects().length
									&& !anchor.hash
							)
							.map(anchor => anchor.href));
					assert.equal(
						hrefs.length,
						new Set(hrefs).size,
						"Home repeats visible destinations"
					);
					assert.equal(
						await page.$$eval(
							"main a[href=\"/pathways\"]",
							anchors => anchors.length
						),
						1
					);
				}
				await verifyLayout(page, `${pathname}-${theme}-${width}`);
				if (pathname === "/" || pathname === "/pathways") {
					await page.screenshot({
						path: resolve(
							artifactDir,
							`${pathname === "/" ? "home" : "pathways"}-${theme}-${width}.png`
						)
					});
				}
			}
		}
	}
	for (const role of ["student", "tutor", "admin"]) {
		activeRole = role;
		await page.setViewport({ width: 1440, height: 950 });
		await openPage(page, `/courses?fixtureRole=${role}#python-level-1`);
		await page.waitForSelector("#course-select");
		assert.equal(
			await page.$$eval(
				"#course-select option",
				options => options.length
			),
			expectedCourseIds.length
		);
		assert.equal(await page.$(".catalog-signin"), null);
		if (role !== "student") await page.waitForSelector("#learner-select", { timeout: 10000 });
		log("signed-in-catalog-pass", { role });
	}
	activeRole = "guest";
	for (const origin of [
		"https://cs.avasan.org",
		"https://instruction-material.classes.jacobdanderson.net"
	]) {
		await openPage(page, "/courses", origin);
		assert.equal(await page.$("#course-select"), null);
		assert.equal(await page.$(".catalog-signin"), null);
		assert(await page.$(".courses-code-entry"));
		log("fork-gate-pass", { origin });
	}
	assert.deepEqual(
		unexpectedWrites,
		[],
		"Browser smoke attempted an API mutation"
	);
	assert.deepEqual(pageErrors, [], "Browser smoke errors");
	await context.close();
	log("complete", {
		smtpCalls: 0,
		productionRequests: 0,
		artifacts: artifactDir
	});
}
finally {
	await cleanup();
}
