import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI runner.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { usacoFixtures } from "./fixtures/usaco-restored-packs.mjs";
import { confirmProjectImport, downloadProjectZip, openProjectSidebar } from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "usaco-course-import-browser-ci";
const changes = {
	"UB1-Square-Pasture": ["0 0 1 1\n2 0 3 1\n", "9"],
	"US18-Counting-Haybales": ["3 3\n0 5 10\n0 0\n6 9\n0 10\n", "1\n0\n3\n"],
	"US21-Priority-Queues": ["3\n9 z\n9 a\n-1 urgent\n", "urgent\nz\na\n"],
	"US22-Prefix-Sums": ["3 3\n1 -2 4\n0 0\n0 3\n1 2\n", "0\n3\n-2\n"],
	"UG1-Dynamic-Programming-with-Fibonacci": ["0\n", "0\n"],
	"UG3-Teamwork": ["3 2\n1\n10\n1\n", "21\n"],
	"UG5-Marathon": ["3 3\n0 0\n1 1\n2 0\nQ 1 3\nU 3 5 0\nQ 1 3\n", "2\n5\n"],
	"UG8-Bookshelf": ["3 1000000000\n1000000 800000000\n1000000 800000000\n1000000 800000000\n", "3000000\n"]
};

function record(event, fields = {}) {
	console.log(JSON.stringify({ event, parentTaskId: taskId, cwd: root, parentPid: process.pid, time: new Date().toISOString(), ...fields }));
}

async function runNative(command, args, directory, environment = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { cwd: directory, detached: true, env: { ...process.env, ...environment }, stdio: ["ignore", "pipe", "pipe"] });
		record("start", { command: [command, ...args], cwd: directory, pid: child.pid, timeoutMs: 30000 });
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", data => stdout += data);
		child.stderr.on("data", data => stderr += data);
		const timer = setTimeout(() => {
			try {
				process.kill(-child.pid, "SIGKILL");
			}
			catch {}
			record("child-process-group-cleanup", { pid: child.pid, reason: "timeout" });
		}, 30000);
		child.once("error", (error) => {
			clearTimeout(timer);
			reject(error);
		});
		child.once("close", (code) => {
			clearTimeout(timer);
			record("end", { pid: child.pid, exitCode: code });
			resolve({ code, stdout, stderr });
		});
	});
}

async function sourceFiles(fixture) {
	const files = {};
	for (const [name, hash] of Object.entries(fixture.hashes)) {
		const url = `https://raw.githubusercontent.com/${fixture.repository}/${fixture.revision}/${fixture.folder}/${name}`;
		const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
		assert.equal(response.status, 200, url);
		const bytes = new Uint8Array(await response.arrayBuffer());
		assert.equal(createHash("sha256").update(bytes).digest("hex"), hash, url);
		files[name] = new TextDecoder().decode(bytes);
	}
	return files;
}

async function exportedFiles(page) {
	await page.evaluate(() => {
		window.__usacoZip = null;
		if (window.__usacoZipHook) return;
		window.__usacoZipHook = true;
		const original = HTMLAnchorElement.prototype.click;
		HTMLAnchorElement.prototype.click = function () {
			if (this.download.endsWith(".zip") && this.href.startsWith("blob:")) {
				void fetch(this.href).then(response => response.arrayBuffer()).then(bytes => window.__usacoZip = Array.from(new Uint8Array(bytes)));
				return;
			}
			return original.call(this);
		};
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() => Array.isArray(window.__usacoZip));
	const zip = unzipSync(Uint8Array.from(await page.evaluate(() => window.__usacoZip)));
	return Object.fromEntries(Object.entries(zip).map(([path, bytes]) => [path.slice(path.indexOf("/") + 1), strFromU8(bytes)]));
}

async function verifyNativeExport(fixture, files, directory) {
	await mkdir(directory);
	for (const [name, content] of Object.entries(files)) await writeFile(join(directory, name), content);
	const source = fixture.mode === "python" ? "main.py" : "main.cpp";
	for (const sanitized of fixture.mode === "cpp" ? [false, true] : [false]) {
		if (fixture.mode === "cpp") {
			const compiler = await runNative("c++", ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", ...(sanitized ? ["-fsanitize=address,undefined", "-fno-omit-frame-pointer"] : []), source, "-o", "project"], directory);
			assert.equal(compiler.code, 0, compiler.stderr);
		}
		await rm(join(directory, fixture.output), { force: true });
		const command = fixture.mode === "python" ? "python3" : join(directory, "project");
		const args = fixture.mode === "python" ? [source] : [];
		const environment = sanitized ? { ASAN_OPTIONS: process.platform === "darwin" ? "detect_leaks=0" : "detect_leaks=1", UBSAN_OPTIONS: "halt_on_error=1" } : {};
		const result = await runNative(command, args, directory, environment);
		assert.doesNotMatch(result.stderr, /AddressSanitizer|runtime error:/);
		if (fixture.reference) {
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			assert.equal(await readFile(join(directory, fixture.output), "utf8"), fixture.expected);
			const [input, output] = changes[fixture.folder.split("/")[0]];
			await writeFile(join(directory, fixture.input), input);
			await rm(join(directory, fixture.output));
			const changed = await runNative(command, args, directory, environment);
			assert.equal(changed.code, 0, changed.stderr);
			assert.equal(changed.stderr, "");
			assert.equal(await readFile(join(directory, fixture.output), "utf8"), output);
			await writeFile(join(directory, fixture.input), files[fixture.input]);
		}
		else {
			assert.equal(result.code, fixture.mode === "cpp" ? 2 : 1, "An untouched learner must report its unfinished helper");
			assert.match(result.stderr, /TODO|NotImplementedError|unfinished|Complete .+ before running the starter/i);
			assert.equal(existsSync(join(directory, fixture.output)), false);
		}
	}
}

nodeTest("pinned USACO packs preserve unfinished helpers and native file contracts", { timeout: 180000 }, async () => {
	const temporary = await mkdtemp(join(tmpdir(), "usaco-pinned-native-"));
	const verified = new Set();
	try {
		for (const fixture of usacoFixtures) {
			const key = `${fixture.repository}/${fixture.folder}`;
			if (verified.has(key)) continue;
			await verifyNativeExport(fixture, await sourceFiles(fixture), join(temporary, String(verified.size)));
			verified.add(key);
		}
		assert.equal(verified.size, 16);
		record("verified-usaco-pinned-native-contracts", { roles: verified.size, packs: 8, samplesAndChangedInputs: true, ordinaryAndSanitizedCpp: true });
	}
	finally {
		await rm(temporary, { recursive: true, force: true });
		record("cleanup", { command: "usaco-pinned-native", pid: process.pid });
	}
});

nodeTest("restored USACO roles confirm, preserve edits and export correct native file I/O", { timeout: 600000 }, async () => {
	let browser;
	let server;
	let page;
	let temporary;
	let exitCode = 0;
	const previousDirectory = process.cwd();
	try {
		process.chdir(root);
		record("start", { command: "usaco-course-import-browser", pid: process.pid, timeoutMs: 600000 });
		assert.ok(existsSync(join(root, "dist/index.html")), "Build this exact front end before the browser check");
		temporary = await mkdtemp(join(tmpdir(), "usaco-course-workflow-"));
		server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
		const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
		const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, await puppeteer.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(value => value && existsSync(value));
		assert.ok(executablePath, "Chrome is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		page = await browser.newPage();
		let fixture;
		let files;
		let catalog = true;
		let sourceRequests = 0;
		let remoteWrites = 0;
		await page.setRequestInterception(true);
		page.on("request", (request) => {
			const url = new URL(request.url());
			const respond = (body, contentType = "application/json") => request.respond({ status: 200, contentType, headers: { "access-control-allow-origin": "*" }, body });
			if (url.hostname === "api.github.com") {
				sourceRequests++;
				assert.equal(url.pathname, `/repos/${fixture.repository}/contents/${fixture.folder}`);
				assert.equal(url.searchParams.get("ref"), "main");
				const paths = [...Object.keys(files), "ignored.out"];
				void respond(JSON.stringify(paths.map(name => ({ type: "file", name, path: `${fixture.folder}/${name}`, size: name === "ignored.out" ? 1 : Buffer.byteLength(files[name]), html_url: `https://github.com/${fixture.repository}/blob/main/${fixture.folder}/${name}`, download_url: `https://raw.githubusercontent.com/${fixture.repository}/main/${fixture.folder}/${name}` }))));
			}
			else if (url.hostname === "raw.githubusercontent.com") {
				sourceRequests++;
				const name = url.pathname.split("/").at(-1);
				assert.equal(url.pathname, `/${fixture.repository}/main/${fixture.folder}/${name}`);
				assert.ok(Object.hasOwn(files, name), "Only the selected role's allowed files can be fetched");
				void respond(files[name], "text/plain");
			}
			else if (url.origin !== origin || url.pathname.startsWith("/api/")) {
				if (!["GET", "OPTIONS"].includes(request.method())) remoteWrites++;
				let body = {};
				if (catalog && url.pathname === "/api/accounts/me") body = fixture.reference ? { tutorID: "usaco-tutor" } : { userID: "usaco-learner" };
				if (catalog && fixture.reference && url.pathname === "/api/tutors/loggedin") body = { currentTutor: { _id: "usaco-tutor", name: "Reference fixture", email: "reference@example.invalid", age: 30, state: "GA", coursePermissions: [fixture.courseId], usersOfTutorLength: 0 } };
				if (catalog && url.pathname === "/api/users/loggedin") body = { currentUser: { _id: "usaco-learner", name: "Learner fixture", email: "learner@example.invalid", age: 14, state: "GA", courseAccess: [fixture.courseId], courseProgress: [] } };
				if (catalog && fixture.reference && url.pathname === "/api/users/oftutor/usaco-tutor") body = [{ _id: "usaco-learner", name: "Learner fixture", email: "learner@example.invalid", age: 14, state: "GA", courseAccess: [fixture.courseId], courseProgress: [] }];
				void respond(JSON.stringify(body));
			}
			else {
				void request.continue();
			}
		});
		for (const [index, current] of usacoFixtures.entries()) {
			fixture = current;
			files = await sourceFiles(fixture);
			const sourceUrl = `https://github.com/${fixture.repository}/tree/main/${fixture.folder}`;
			const selector = `a[href='${sourceUrl}']`;
			const before = sourceRequests;
			catalog = true;
			await page.setViewport({ width: index % 2 ? 1280 : 390, height: 900 });
			await page.goto(`${origin}/courses#${fixture.anchor}`, { waitUntil: "domcontentloaded" });
			await page.waitForSelector(".lesson-view-toggle button");
			for (const position of [1, 2, 3]) {
				await page.click(`.lesson-view-toggle button:nth-child(${position})`);
				await page.waitForSelector(`.lesson-view-toggle button:nth-child(${position})[aria-pressed='true']`);
				if (await page.$(selector)) break;
			}
			await page.waitForSelector(selector);
			const card = await page.$eval(selector, link => ({ text: link.closest(".lesson-item").textContent, links: [...link.closest(".lesson-item").querySelectorAll("a")].map(action => ({ text: action.textContent, href: action.getAttribute("href"), import: action.classList.contains("is-ide-starter") })) }));
			assert.match(card.text, /Contract and reasoning/);
			if (!fixture.reference) assert.ok(card.links.every(link => !link.href.includes("/solution")), "Learner view withholds reference resources");
			const href = card.links.find(link => link.import && new URL(link.href, origin).searchParams.get("starterUrl") === sourceUrl)?.href;
			assert.ok(href, `${fixture.folder} needs its own confirmed action`);
			const params = new URL(href, origin).searchParams;
			assert.equal(params.get("mode"), fixture.mode);
			assert.equal(params.get("projectKey"), `${fixture.courseId}:${fixture.itemId}:${fixture.reference ? "reference" : "starter"}`);
			assert.equal(sourceRequests, before);
			if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
				const directory = join(previousDirectory, process.env.COURSE_IMPORT_SCREENSHOT_DIR);
				await mkdir(directory, { recursive: true });
				const link = await page.$(selector);
				const element = await link.evaluateHandle(element => element.closest(".lesson-item"));
				await element.asElement().screenshot({ path: join(directory, `course-import-usaco-${fixture.courseId}-${fixture.folder.replaceAll("/", "-")}-lesson.png`) });
			}
			catalog = false;
			await page.goto(new URL(href, origin).href, { waitUntil: "domcontentloaded" });
			await page.waitForSelector("[data-testid='ide-route-import-confirm']");
			assert.equal(sourceRequests, before, "Source is not fetched before consent");
			const previous = await page.evaluate(() => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]"));
			await confirmProjectImport(page);
			const key = params.get("projectKey");
			await page.waitForFunction((key, files) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key && project.files.length === Object.keys(files).length && Object.entries(files).every(([name, content]) => project.files.some(file => file.name === name && file.content === content))), {}, key, files);
			assert.equal(sourceRequests, before + 1 + Object.keys(files).length);
			await openProjectSidebar(page);
			assert.deepEqual(await exportedFiles(page), files);
			const source = fixture.mode === "python" ? "main.py" : "main.cpp";
			const edited = `${files[source]}\n${fixture.mode === "python" ? "#" : "//"} Saved USACO browser attempt\n`;
			await page.select("select[aria-label='Active project file']", source);
			await page.click(".cm-content");
			const modifier = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta" : "Control");
			await page.keyboard.down(modifier);
			await page.keyboard.press("a");
			await page.keyboard.up(modifier);
			await page.keyboard.sendCharacter(edited);
			await page.keyboard.down(modifier);
			await page.keyboard.press("s");
			await page.keyboard.up(modifier);
			await page.waitForFunction((key, edited, source) => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").some(project => project.courseProjectKey === key && project.files.some(file => file.name === source && file.content === edited)), {}, key, edited, source);
			if (fixture.mode === "cpp") {
				await page.click("button.run-control");
				await page.waitForFunction(() => document.querySelector(".output-panel")?.textContent.includes("-std=c++20"));
				assert.match(await page.$eval(".output-panel", element => element.textContent), /does not compile or execute/);
			}
			const expectedFiles = { ...files, [source]: edited };
			const exported = await exportedFiles(page);
			assert.deepEqual(exported, expectedFiles);
			await verifyNativeExport(fixture, exported, join(temporary, String(index)));
			await page.goto(new URL(href, origin).href, { waitUntil: "domcontentloaded" });
			await page.waitForSelector(".code-ide-workspace");
			assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
			const saved = await page.evaluate(key => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]").find(project => project.courseProjectKey === key), key);
			assert.deepEqual(Object.fromEntries(saved.files.map(file => [file.name, file.content])), expectedFiles);
			const all = await page.evaluate(() => JSON.parse(localStorage.getItem("classes-python-ide-projects:anonymous") ?? "[]"));
			for (const project of previous) assert.deepEqual(all.find(item => item.id === project.id), project, "Other saved attempts are unchanged");
			assert.equal(sourceRequests, before + 1 + Object.keys(files).length, "Reopening never redownloads or overwrites edits");
			if (process.env.COURSE_IMPORT_SCREENSHOT_DIR) {
				await page.screenshot({ path: join(previousDirectory, process.env.COURSE_IMPORT_SCREENSHOT_DIR, `course-import-usaco-${fixture.courseId}-${fixture.folder.replaceAll("/", "-")}-workspace.png`) });
			}
			record("verified-usaco-role", { course: fixture.courseId, folder: fixture.folder, revision: fixture.revision, mode: fixture.mode, savedKey: key, fileCount: Object.keys(files).length, preservedOtherAttempts: previous.length, ordinaryAndSanitized: fixture.mode === "cpp", unfinishedLearner: !fixture.reference, nativeFileIo: true });
		}
		assert.equal(remoteWrites, 0);
		record("verified-usaco-workflows", { imports: usacoFixtures.length, packs: 8, roleSeparation: true, consentBeforeSource: true, savedAndExported: true, remoteWrites });
	}
	catch (error) {
		exitCode = 1;
		throw error;
	}
	finally {
		if (page) await page.close();
		if (browser) await browser.close();
		if (server) await server.close();
		if (temporary) await rm(temporary, { recursive: true, force: true });
		process.chdir(previousDirectory);
		record("cleanup", { pid: process.pid, exitCode });
	}
});
