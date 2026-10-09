import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { confirmProjectImport, downloadProjectZip } from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const scenarios = [
	{ template: "event-reference", mode: "pgzero", id: "pgzero-events-reference", files: { "main.py": "pgzero-events.py", "tile_layout.py": "tile_layout.py" }, title: "Events and Safe Placement Reference" },
	{ template: "melody-reference", mode: "python", id: "pysynth-song-reference", files: { "main.py": "pysynth-melody.py" }, title: "Browser PySynth Song Reference" },
	{ template: "record-reference", mode: "java", id: "java-record-reference", files: { "Main.java": "Main.java" }, title: "Optional Java Record Reference" }
];

async function exportedFiles(page) {
	await page.evaluate(() => {
		delete window.__referenceDownloadedZip;
		if (window.__referenceDownloadTap) return;
		window.__referenceDownloadTap = true;
		const original = HTMLAnchorElement.prototype.click;
		HTMLAnchorElement.prototype.click = function () {
			if (this.download.endsWith(".zip") && this.href.startsWith("blob:")) {
				void fetch(this.href).then(response => response.arrayBuffer()).then((bytes) => {
					window.__referenceDownloadedZip = Array.from(new Uint8Array(bytes));
				});
				return;
			}
			return original.call(this);
		};
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() => Array.isArray(window.__referenceDownloadedZip));
	return unzipSync(Uint8Array.from(await page.evaluate(() => window.__referenceDownloadedZip)));
}

nodeTest("confirmed independent reference imports, exact exports and real browser melody", { timeout: 240000 }, async () => {
	let browser;
	let server;
	const previous = process.cwd();
	const screenshotDirectory = process.env.COURSE_IMPORT_SCREENSHOT_DIR
		? resolve(previous, process.env.COURSE_IMPORT_SCREENSHOT_DIR)
		: null;
	const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "course-reference-browser-ci";
	const startedAt = new Date().toISOString();
	console.log(JSON.stringify({ event: "start", taskId, cwd: root, command: "course-reference-browser", pid: process.pid, startedAt, timeoutMs: 240000 }));
	try {
		process.chdir(root);
		assert.ok(existsSync(join(root, "dist/index.html")), "Build before the browser gate");
		server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
		const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
		const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, await puppeteer.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(value => typeof value === "string" && existsSync(value));
		assert.ok(executablePath, "Chrome is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		const page = await browser.newPage();
		try {
			let remoteWrites = 0;
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				const url = new URL(request.url());
				if (request.interceptResolutionState().action === "disabled") return;
				if (url.origin !== origin || url.pathname.startsWith("/api/")) {
					if (!["GET", "OPTIONS"].includes(request.method())) remoteWrites++;
					void request.respond({ status: 200, contentType: "application/json", body: "{}" });
				}
				else {
					void request.continue();
				}
			});
			for (const width of [390, 1280]) {
				await page.setViewport({ width, height: 900 });
				for (const scenario of scenarios) {
					const key = `course-reference:${scenario.id}:v1`;
					const params = new URLSearchParams({ mode: scenario.mode, template: scenario.template, projectKey: key, starterTitle: scenario.title, starterLabel: "Optional worked reference" });
					await page.goto(`${origin}/ide?${params}`, { waitUntil: "domcontentloaded" });
					if (width === 390) {
						await page.waitForSelector("[data-testid='ide-route-import-confirm']");
						const before = await page.evaluate(key => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").filter(project => project.courseProjectKey === key).length, key);
						assert.equal(before, 0, "A pending reference does not replace or create work");
						await confirmProjectImport(page);
					}
					else {
						await page.waitForSelector("select[aria-label='Active project file']");
						assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null, "Saved reference reopens without replacement");
					}
					await page.waitForSelector("select[aria-label='Active project file']");
					await page.waitForFunction(key => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key), {}, key);
					const exported = await exportedFiles(page);
					for (const [name, source] of Object.entries(scenario.files)) {
						const member = Object.keys(exported).find(path => path === name || path.endsWith(`/${name}`));
						assert.ok(member, `Export includes ${name}`);
						assert.equal(strFromU8(exported[member]), await readFile(join(root, "src/assets/course-references", source), "utf8"));
					}
					assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
					if (screenshotDirectory) {
						await mkdir(screenshotDirectory, { recursive: true });
						await page.screenshot({ path: join(screenshotDirectory, `course-import-reference-${scenario.template}-${width}.png`), fullPage: true });
					}
					console.log(JSON.stringify({ event: "verified-course-reference-import", template: scenario.template, width, exactExport: true, confirmation: width === 390, savedReopen: width === 1280 }));
				}
			}
			// Execute the untouched melody in the browser's real Python runtime.
			const params = new URLSearchParams({ mode: "python", template: "melody-reference", projectKey: "course-reference:pysynth-song-reference:v1" });
			await page.goto(`${origin}/ide?${params}`, { waitUntil: "domcontentloaded" });
			await page.waitForSelector("button.run-control:not([disabled])");
			const cdp = await page.createCDPSession();
			try {
				await cdp.send("Network.enable");
				await cdp.send("Network.setBlockedURLs", { urls: [`${origin}/api/*`, "*://analytics.jacobdanderson.net/*", "*://classes.jacobdanderson.net/*", "*://scheduler.classes.jacobdanderson.net/*", "*://api.github.com/*", "*://raw.githubusercontent.com/*"] });
				await page.setRequestInterception(false);
				await page.click("button.run-control");
				await page.waitForFunction(() => /Run complete|Run failed/.test(document.querySelector("[data-testid='ide-run-status']")?.textContent ?? ""), { timeout: 120000 });
				assert.equal(await page.$eval("[data-testid='ide-run-status']", element => element.textContent.trim()), "Run complete", await page.$eval(".output-panel", element => element.textContent));
				await page.waitForFunction(() => [...document.querySelectorAll("audio")].some(audio => audio.src.startsWith("data:audio/wav;base64,")), { timeout: 120000 });
				const dataUrl = await page.$eval("audio[src^='data:audio/wav']", audio => audio.src);
				const wav = Buffer.from(dataUrl.split(",")[1], "base64");
				assert.equal(wav.subarray(0, 4).toString(), "RIFF");
				assert.equal(wav.subarray(8, 12).toString(), "WAVE");
				assert.equal(wav.readUInt32LE(24), 44100);
				assert.equal(wav.readUInt32LE(40), 176400);
				assert.equal(wav.length, 176444);
				assert.ok(wav.subarray(44 + 46000 * 2, 44 + 87000 * 2).some(byte => byte !== 0), "Final note is present in the generated browser result");
				assert.ok(wav.subarray(44 + 22050 * 2, 44 + 33075 * 2).every(byte => byte === 0), "Rest remains silent");
				const downloadFolder = await mkdtemp(join(tmpdir(), "course-reference-audio-"));
				try {
					await cdp.send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: downloadFolder });
					await page.waitForSelector("a[download='course_melody.wav']");
					assert.equal(await page.$eval("a[download='course_melody.wav']", link => link.textContent.trim()), "Download WAV");
					await page.click("a[download='course_melody.wav']");
					const destination = join(downloadFolder, "course_melody.wav");
					const deadline = Date.now() + 10000;
					while (!existsSync(destination) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 100));
					assert.deepEqual(await readFile(destination), wav, "The actual Download WAV action preserves the generated bytes");
				}
				finally { await rm(downloadFolder, { recursive: true, force: true }); }
				for (const width of [1280, 390]) {
					await page.setViewport({ width, height: 900 });
					if (width === 390) await page.click(".mobile-view-picker button[data-view='console']");
					await page.waitForFunction(() => (document.querySelector("a[download='course_melody.wav']")?.getBoundingClientRect().width ?? 0) > 0);
					assert.equal(await page.$eval("a[download='course_melody.wav']", link => link.getBoundingClientRect().width > 0), true);
					assert.equal(await page.$eval("audio[src^='data:audio/wav']", audio => audio.getBoundingClientRect().width > 0), true);
					assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
					if (screenshotDirectory) await page.screenshot({ path: join(screenshotDirectory, `course-import-reference-melody-output-${width}.png`), fullPage: true });
					console.log(JSON.stringify({ event: "verified-course-reference-melody-view", width, visibleAudioAndDownload: true }));
				}
				console.log(JSON.stringify({ event: "verified-course-reference-melody", seconds: 2, restPresent: true, finalNotePresent: true, realBrowserRuntime: true, exactWavDownload: true }));
			}
			finally { await cdp.detach(); }
			assert.equal(remoteWrites, 0, "All reference work remains local");
		}
		finally { await page.close(); }
	}
	finally {
		if (browser) await browser.close();
		if (server) await server.close();
		process.chdir(previous);
		console.log(JSON.stringify({ event: "cleanup", taskId, pid: process.pid, startedAt, endedAt: new Date().toISOString() }));
	}
});
