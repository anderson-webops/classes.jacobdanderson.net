import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { strFromU8, unzipSync } from "fflate";
import { originalAttributionId, originalScratchProjects } from "../front-end/scripts/scratch/generate-original-projects.mjs";

export async function checkScratchOriginalImports(page, { origin, files, loaded, downloadProject, openFile, newProject, setRole, acceptDialogs }) {
	const output = process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR || path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const requests = [];
	const records = [];
	const observe = (request) => {
		const url = new URL(request.url());
		if (/^\/scratch-originals\/\d+\.sb3$/.test(url.pathname)) requests.push(url.pathname);
	};
	page.on("request", observe);
	const route = href => page.evaluate(async (href) => {
		await document.querySelector("#app").__vue_app__.config.globalProperties.$router.push(href);
	}, href);
	const sourceHref = (original) => {
		const binding = original.bindings.find(binding => binding.role === "project" || binding.role === "capstone-direction") || original.bindings[0];
		return `/ide?${new URLSearchParams({ mode: "scratch", originalProject: original.id, course: binding.courseId, role: binding.role === "reference" ? "reference" : "project" })}`;
	};
	const confirm = async () => {
		await page.waitForSelector(".scratch-original-import button:not([disabled])");
		await page.click(".scratch-original-import button");
		await page.waitForSelector(".scratch-original-import", { hidden: true, timeout: 45000 });
		await loaded();
	};
	async function inspect(original) {
		const expected = JSON.parse(await readFile(new URL(`../front-end/scripts/scratch/originals/projects/${original.id}.json`, import.meta.url), "utf8"));
		const frame = page.frames().find(frame => frame !== page.mainFrame());
		const snapshot = await frame.evaluate(({ expected, original, attributionId }) => {
			const vm = window.__courseTestVm;
			const actual = JSON.parse(vm.toJSON());
			const problems = [];
			for (const target of expected.targets) {
				const current = actual.targets.find(item => item.name === target.name && item.isStage === target.isStage);
				if (!current) {
					problems.push(`Missing target ${target.name}`);
					continue;
				}
				for (const [id, block] of Object.entries(target.blocks)) {
					if (Array.isArray(block)) continue;
					const present = current.blocks[id];
					if (!present || present.opcode !== block.opcode || (present.next || null) !== (block.next || null) || (present.parent || null) !== (block.parent || null))
						problems.push(`Changed program block ${target.name}:${id}`);
				}
				for (const kind of ["costumes", "sounds"]) {
					const wanted = target[kind].map(asset => `${asset.name}:${asset.assetId}`);
					const have = current[kind].map(asset => `${asset.name}:${asset.assetId}`);
					if (JSON.stringify(wanted) !== JSON.stringify(have)) problems.push(`Changed ${kind} in ${target.name}`);
				}
			}
			const comment = actual.targets.find(target => target.isStage).comments?.[attributionId]?.text;
			if (!comment?.includes(original.url) || !comment.includes("CC BY-SA 2.0")) problems.push("Missing portable attribution");
			const extensions = original.extensions.map(extension => ({ extension, loaded: vm.extensionManager.isExtensionLoaded(extension) }));
			return { problems, targets: actual.targets.length, extensions, attribution: comment };
		}, { expected, original, attributionId: originalAttributionId(original.id) });
		assert.deepEqual(snapshot.problems, [], original.id);
		assert.equal(snapshot.targets, expected.targets.length);
		assert.ok(snapshot.extensions.every(extension => extension.loaded), `${original.id}: extension not loaded`);
		return snapshot;
	}
	try {
		setRole("learner");
		await page.setViewport({ width: 1280, height: 900 });
		await page.goto("about:blank");
		await page.goto(`${origin}/courses#scratch-level-1-gs2-event-listeners`, { waitUntil: "networkidle2" });
		await page.waitForSelector(".lesson-view-toggle button");
		await page.click(".lesson-view-toggle button:first-child");
		const href = await page.$$eval("a.is-ide-starter", links => links.find(link => new URL(link.href).searchParams.get("originalProject") === "287707460")?.getAttribute("href"));
		assert.ok(href, "Original course project needs its own site-IDE entry");
		await page.goto(`${origin}${href}`, { waitUntil: "networkidle2" });
		await page.waitForSelector(".scratch-original-import button:not([disabled])");
		assert.equal(requests.length, 0, "No original archive is fetched before consent");
		await page.click(".scratch-original-import button:nth-of-type(2)");
		assert.equal(requests.length, 0);
		await route("/ide?mode=scratch");
		await route(href);
		await confirm();
		assert.equal(requests.length, 1);
		setRole("instructor");
		await page.goto("about:blank");
		await page.goto(`${origin}/courses#scratch-level-1-gs2-event-listeners`, { waitUntil: "networkidle2" });
		await page.waitForSelector(".lesson-view-toggle button");
		await page.click(".lesson-view-toggle button:first-child");
		const referenceHref = await page.$$eval("a.is-ide-starter", links => links.find(link => new URL(link.href).searchParams.get("originalProject") === "284408078")?.getAttribute("href"));
		assert.ok(referenceHref, "Instructor reference needs its distinct site-IDE entry");
		assert.equal(new URL(referenceHref, origin).searchParams.get("role"), "reference");
		await page.goto(`${origin}${referenceHref}`, { waitUntil: "networkidle2" });
		await confirm();

		for (const original of originalScratchProjects) {
			await route(sourceHref(original));
			await confirm();
			const snapshot = await inspect(original);
			records.push({ id: original.id, sourceSHA256: original.sourceSHA256, ...snapshot });
			await writeFile(path.join(output, "imports.json"), `${JSON.stringify({ complete: false, records }, null, 2)}\n`);
		}
		assert.equal(records.length, 164);
		const spinner = originalScratchProjects.find(project => project.id === "287887351");
		await route(sourceHref(spinner));
		await confirm();
		const spinnerFrame = page.frames().find(frame => frame !== page.mainFrame());
		await spinnerFrame.locator("[class*=\"green-flag_green-flag\"]").click();
		await spinnerFrame.waitForFunction(() => window.__courseTestVm.runtime.targets.find(target => !target.isStage).direction === 90);
		await spinnerFrame.click("[class*=\"stage_stage_\"] > div > canvas");
		for (const [key, direction] of [["ArrowUp", 0], ["a", -15], ["d", 0]]) {
			await page.keyboard.press(key);
			await spinnerFrame.waitForFunction(direction => window.__courseTestVm.runtime.targets.find(target => !target.isStage).direction === direction, {}, direction);
		}
		const dragonfly = originalScratchProjects.find(project => project.id === "287707460");
		await route(sourceHref(dragonfly));
		await confirm();
		const frame = page.frames().find(frame => frame !== page.mainFrame());
		await page.$eval(".scratch-toolbar input[maxlength='120']", (input) => {
			input.value = "Dragonfly original edited";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		const xInput = await frame.waitForSelector("input[placeholder='x']");
		await xInput.click({ clickCount: 3 });
		await xInput.type("77");
		await page.keyboard.press("Tab");
		await page.waitForFunction(() => document.querySelector(".scratch-status").textContent.includes("Unsaved changes."));
		const beforeReplace = requests.length;
		await route(sourceHref(originalScratchProjects.find(project => project.id === "287920173")));
		acceptDialogs(false);
		await page.click(".scratch-original-import button");
		acceptDialogs(true);
		assert.equal(requests.length, beforeReplace, "Declining replacement preserves the current project");
		assert.equal(await frame.$eval("input[placeholder='x']", input => input.value), "77");
		await page.click(".scratch-original-import button:nth-of-type(2)");
		await downloadProject("Dragonfly original edited.sb3");
		const saved = unzipSync(new Uint8Array(await readFile(path.join(files, "Dragonfly original edited.sb3"))));
		const project = JSON.parse(strFromU8(saved["project.json"]));
		assert.equal(project.targets.find(target => !target.isStage).x, 77);
		assert.match(project.targets.find(target => target.isStage).comments[originalAttributionId(dragonfly.id)].text, /JuniLearningScratch/);
		await newProject();
		assert.equal(await frame.evaluate(id => !!JSON.parse(window.__courseTestVm.toJSON()).targets.find(target => target.isStage).comments?.[id], originalAttributionId(dragonfly.id)), false);
		await openFile(path.join(files, "Dragonfly original edited.sb3"));
		assert.equal(await frame.$eval("input[placeholder='x']", input => input.value), "77");
		assert.equal(await frame.evaluate(id => !!JSON.parse(window.__courseTestVm.toJSON()).targets.find(target => target.isStage).comments?.[id], originalAttributionId(dragonfly.id)), true);
		await page.screenshot({ path: path.join(output, "original-edited-reopened-1280.png"), fullPage: false });
		await page.setViewport({ width: 390, height: 900 });
		await route(sourceHref(dragonfly));
		await page.waitForSelector(".scratch-original-import button:not([disabled])");
		await page.screenshot({ path: path.join(output, "original-consent-390.png"), fullPage: false });
		await confirm();
		await writeFile(path.join(output, "imports.json"), `${JSON.stringify({ complete: true, sourceCommit: process.env.GITHUB_SHA, records, bothCourseRolesVerified: true, consentBeforeFetch: true, cancelBeforeFetch: true, unsavedReplacementDeclined: true, originalKeyboardEventsVerified: true, editedFileReopenedAfterBlankReset: true, portableAttributionRetained: true, speechServiceExecutionVerified: false, wholeCourseSemanticReviewComplete: false }, null, 2)}\n`);
	}
	catch (error) {
		await page.screenshot({ path: path.join(output, "failed.png"), fullPage: false }).catch(() => {});
		await writeFile(path.join(output, "failure.json"), `${JSON.stringify({ error: String(error), completed: records.length, lastProject: records.at(-1)?.id }, null, 2)}\n`);
		throw error;
	}
	finally {
		acceptDialogs(true);
		page.off("request", observe);
	}
}
