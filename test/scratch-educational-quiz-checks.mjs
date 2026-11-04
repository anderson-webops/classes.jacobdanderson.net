import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

export async function checkScratchEducationalQuiz(page, base, files, loaded, openFile) {
	await page.setViewport({ width: 1440, height: 1080 });
	await page.goto(`${base}/ide?mode=scratch&starter=educational-quiz&role=reference`, { waitUntil: "networkidle2" });
	await loaded();
	let frame = page.frames().find(f => f !== page.mainFrame());
	await frame.waitForFunction(() => Boolean(window.__courseTestVm));
	assert.match(await page.$eval(".scratch-toolbar input", input => input.value), /Reference$/);
	const snapshot = () => frame.evaluate(() => {
		const targets = window.__courseTestVm.runtime.targets;
		return {
			values: Object.fromEntries(Object.entries(targets.find(t => t.isStage).variables).map(([id, variable]) => [id, ["score", "quizState", "question", "num1", "num2"].includes(id) ? Number(variable.value) : variable.value])),
			scene: targets.find(t => t.isStage).currentCostume,
			sprites: Object.fromEntries(targets.filter(t => !t.isStage).map(t => [t.sprite.name, t.visible]))
		};
	});
	const waitValues = values => frame.waitForFunction((values) => {
		const stage = window.__courseTestVm.runtime.targets.find(t => t.isStage);
		return Object.entries(values).every(([id, value]) => typeof value === "number" ? Number(stage.variables[id]?.value) === value : stage.variables[id]?.value === value);
	}, { timeout: 5000 }, values);
	const flag = async () => {
		await frame.evaluate(() => window.__courseTestVm.greenFlag());
		await waitValues({ quizState: 0, question: 0, score: 0 });
	};
	const clickControl = async (name) => {
		assert.equal((await snapshot()).sprites[name], true);
		const canvas = await frame.$("[class*=\"stage_stage_\"] > div > canvas");
		await canvas.evaluate(element => element.scrollIntoView({ block: "center", inline: "center" }));
		await frame.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		const box = await canvas.boundingBox();
		assert.ok(box);
		const target = await frame.evaluate((name) => {
			const target = window.__courseTestVm.runtime.targets.find(t => t.sprite?.name === name);
			return { x: target.x, y: target.y };
		}, name);
		const point = { x: box.x + box.width * (0.5 + target.x / 480), y: box.y + box.height * (0.5 - target.y / 360) };
		await page.mouse.click(point.x, point.y);
		return { box, target, point };
	};
	const observeQuestions = () => frame.evaluate(() => {
		window.__quizQuestions = [];
		window.__quizPrompts = [];
		const runtime = window.__courseTestVm.runtime;
		// A visible sprite puts its prompt in a speech bubble and emits a
		// blank QUESTION to open the answer input. Observe both real events.
		runtime.on("SAY", (target, type, message) => {
			if (target.sprite?.name === "Quiz" && type === "say" && (message === "Choose a display name:" || message.startsWith("What is (")))
				window.__quizPrompts.push(message);
		});
		runtime.on("QUESTION", (question) => {
			if (typeof question === "string") window.__quizQuestions.push(question);
		});
	});
	await observeQuestions();
	const answer = async (value) => {
		if (value === "") {
			// Exercise the actual VM's empty-answer behavior even if its GUI
			// prevents submitting an empty input before it reaches the project.
			await frame.evaluate(() => window.__courseTestVm.runtime.emit("ANSWER", ""));
			return;
		}
		const input = await frame.waitForSelector("input[class*=question], [class*=question_question-input] input", { visible: true, timeout: 5000 });
		await input.type(value);
		await input.press("Enter");
	};
	const start = async () => {
		const click = await clickControl("Start");
		try {
			await frame.waitForFunction(() => window.__quizPrompts.at(-1) === "Choose a display name:", { timeout: 5000 });
		}
		catch (error) {
			console.log(JSON.stringify({ event: "quiz-start-question-failure", click, state: await snapshot(), questions: await frame.evaluate(() => window.__quizQuestions) }));
			if (process.env.SCRATCH_SCREENSHOT_DIR) {
				await mkdir(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
				await page.screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, "scratch-conditionals-quiz-start-failure.png") });
			}
			throw error;
		}
		await answer("Reader");
		await waitValues({ quizState: 2 });
	};
	const next = async (expected) => {
		await clickControl("Next");
		await waitValues({ quizState: 3, question: expected });
		await frame.waitForFunction(() => window.__quizPrompts.at(-1)?.startsWith("What is ("));
	};
	await flag();
	assert.deepEqual((await snapshot()).sprites, { Quiz: false, Start: true, Next: false });
	await start();
	await next(1);
	const questionBefore = (await snapshot()).values;
	await frame.evaluate(() => {
		const vm = window.__courseTestVm;
		const nextButton = vm.runtime.targets.find(t => t.sprite?.name === "Next");
		vm.runtime.startHats("event_whenthisspriteclicked", null, nextButton);
		vm.runtime.startHats("event_whenthisspriteclicked", null, nextButton);
	});
	for (const wrong of ["99", "frog", ""]) {
		const count = await frame.evaluate(() => window.__quizQuestions.length);
		await answer(wrong);
		await frame.waitForFunction(count => window.__quizQuestions.length > count, { timeout: 5000 }, count);
		const values = (await snapshot()).values;
		assert.equal(values.question, 1);
		assert.equal(values.score, 0);
		assert.equal(values.num1, questionBefore.num1);
		assert.equal(values.num2, questionBefore.num2);
	}
	await answer("5");
	await waitValues({ quizState: 2, question: 1, score: 1 });
	await next(2);
	await answer("-3");
	await waitValues({ quizState: 2, question: 2, score: 2 });
	await next(3);
	await answer("-9");
	await waitValues({ quizState: 4, question: 3, score: 3 });
	assert.equal((await snapshot()).scene, 2);
	assert.equal((await snapshot()).sprites.Next, false);
	assert.equal((await snapshot()).sprites.Start, false);
	if (process.env.SCRATCH_SCREENSHOT_DIR)
		await page.screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, "scratch-conditionals-educational-quiz-reference-complete.png") });
	const bytes = await frame.evaluate(async () => Array.from(new Uint8Array(await (await window.__courseTestVm.saveProjectSb3()).arrayBuffer())));
	const filename = join(files, "educational-quiz-reopened.sb3");
	await writeFile(filename, new Uint8Array(bytes));
	await openFile(filename);
	await flag();
	await start();
	await next(1);
	await flag();
	assert.deepEqual((await snapshot()).sprites, { Quiz: false, Start: true, Next: false });
	assert.equal((await snapshot()).scene, 0);
	console.log(JSON.stringify({ event: "verified-educational-quiz-reference", wrongInputsAndStoredOperands: true, scoreOnce: true, blockedReentry: true, allThreeQuestions: true, exportedReopenedAndReset: true }));
	await page.goto(`${base}/ide?mode=scratch&starter=educational-quiz`, { waitUntil: "networkidle2" });
	await loaded();
	const starterFrame = page.frames().find(f => f !== page.mainFrame());
	await starterFrame.waitForFunction(() => Boolean(window.__courseTestVm));
	frame = starterFrame;
	await observeQuestions();
	await flag();
	await start();
	await next(1);
	const promptCount = await frame.evaluate(() => window.__quizQuestions.length);
	await answer("5");
	await frame.waitForFunction(count => window.__quizQuestions.length > count, { timeout: 5000 }, promptCount);
	await waitValues({ quizState: 3, question: 1, score: 0 });
	const savedStarter = await starterFrame.evaluate(() => window.__courseTestVm.toJSON());
	assert.notEqual(savedStarter, "");
	assert.doesNotMatch(await page.$eval(".scratch-toolbar input", input => input.value), /Reference$/);
	const project = JSON.parse(savedStarter);
	const quiz = project.targets.find(t => t.name === "Quiz");
	const loop = Object.values(quiz.blocks).find(block => block.opcode === "control_repeat_until");
	assert.equal(quiz.blocks[loop.inputs.CONDITION[1]].opcode, "operator_equals");
	console.log(JSON.stringify({ event: "verified-educational-quiz-starter-launch", completeReferenceSeparate: true, namedComparisonStillUnfinished: true }));
}
