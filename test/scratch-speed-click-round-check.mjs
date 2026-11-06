import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function checkSpeedClickRound(frame, output) {
	const record = {
		project: "299311602",
		complete: false,
		guardCases: [],
		setupPhases: [],
		naturalCountdownVerified: false,
		restartVerified: false
	};
	async function retain() {
		await writeFile(
			path.join(output, "speed-click-round.json"),
			`${JSON.stringify(record, null, 2)}\n`
		);
	}
	await frame.evaluate(() => {
		const vm = window.__courseTestVm;
		vm.stopAll();
		const runtime = vm.runtime;
		const stage = runtime.targets.find(target => target.isStage);
		const button = runtime.targets.find(
			target => target.sprite.name === "Button"
		);
		const variable = name =>
			Object.values(stage.variables).find(value => value.name === name);
		const read = () => ({
			clicks: Number(variable("Clicks").value),
			timer: Number(variable("Timer").value),
			running: String(variable("Timer going?").value),
			buttonVisible: button.visible
		});
		const state = {
			read,
			variable,
			button,
			says: [],
			clicks: [],
			pending: []
		};
		state.onSay = (target, type, text) => {
			if (target === button && type === "say" && text)
				state.says.push({ text: String(text), ...read() });
		};
		runtime.on("SAY", state.onSay);
		state.originalStartHats = runtime.startHats;
		runtime.startHats = function (...args) {
			const threads = state.originalStartHats.apply(this, args);
			if (
				args[0] === "event_whenthisspriteclicked"
				&& threads.some(thread => thread.target === button)
			) {
				state.clicks.push(read());
				state.pending = threads;
			}
			return threads;
		};
		window.__courseSpeedRound = state;
	});
	async function settleClick() {
		await frame.waitForFunction(
			() =>
				window.__courseSpeedRound.pending.every(
					thread =>
						!window.__courseTestVm.runtime.threads.includes(thread)
				),
			{ timeout: 5000 }
		);
		return frame.evaluate(() => window.__courseSpeedRound.read());
	}
	async function clickButton() {
		const before = await frame.evaluate(
			() => window.__courseSpeedRound.clicks.length
		);
		const canvas = await frame.$("[class*=\"stage_stage_\"] > div > canvas");
		assert.ok(canvas);
		const size = await canvas.evaluate(element => ({
			width: element.clientWidth,
			height: element.clientHeight
		}));
		const position = await frame.evaluate(() => {
			const button = window.__courseSpeedRound.button;
			return {
				x: button.x,
				y: button.y,
				native: window.__courseTestVm.runtime.renderer.getNativeSize()
			};
		});
		await canvas.click({
			offset: {
				x: size.width * (0.5 + position.x / position.native[0]),
				y: size.height * (0.5 - position.y / position.native[1])
			}
		});
		await frame.waitForFunction(
			count => window.__courseSpeedRound.clicks.length > count,
			{},
			before
		);
		return settleClick();
	}
	try {
		for (const [running, timer, expected] of [
			["False", 10, 0],
			["True", 10, 1],
			["True", 1, 1],
			["True", 0, 0],
			["True", -1, 0],
			["False", 1, 0]
		]) {
			const started = await frame.evaluate(
				({ running, timer }) => {
					window.__courseTestVm.stopAll();
					const state = window.__courseSpeedRound;
					state.variable("Clicks").value = 0;
					state.variable("Timer").value = timer;
					state.variable("Timer going?").value = running;
					return window.__courseTestVm.runtime.startHats(
						"event_whenthisspriteclicked",
						null,
						state.button
					).length;
				},
				{ running, timer }
			);
			assert.equal(started, 1);
			const actual = await settleClick();
			assert.equal(actual.clicks, expected);
			record.guardCases.push({ running, timer, expected, actual });
			await retain();
		}
		await frame.evaluate(() => {
			window.__courseSpeedRound.says.length = 0;
			window.__courseSpeedRound.clicks.length = 0;
		});
		await frame.locator("[class*=\"green-flag_green-flag\"]").click();
		for (const phase of ["Ready...", "Set...", "Go!"]) {
			await frame.waitForFunction(
				text =>
					window.__courseSpeedRound.says.some(
						value => value.text === text
					),
				{},
				phase
			);
			const actual = await clickButton();
			assert.equal(actual.running, "False");
			assert.equal(actual.clicks, 0);
			record.setupPhases.push({
				phase,
				actual,
				nativePointerEvent: true
			});
			await retain();
		}
		await frame.waitForFunction(() => {
			const s = window.__courseSpeedRound.read();
			return s.running === "True" && s.timer > 0;
		});
		const active = await clickButton();
		assert.equal(active.clicks, 1);
		record.activeRound = active;
		await frame.waitForFunction(
			() => window.__courseSpeedRound.read().timer === 1,
			{ timeout: 15000 }
		);
		const lastSecond = await clickButton();
		assert.equal(lastSecond.clicks, 2);
		record.lastPositiveSecond = lastSecond;
		await frame.waitForFunction(
			() => {
				const s = window.__courseSpeedRound.read();
				return (
					s.timer === 0
					&& s.running === "False"
					&& s.buttonVisible === false
				);
			},
			{ timeout: 5000 }
		);
		const endHatCount = await frame.evaluate(() => {
			const state = window.__courseSpeedRound;
			return window.__courseTestVm.runtime.startHats(
				"event_whenthisspriteclicked",
				null,
				state.button
			).length;
		});
		assert.equal(endHatCount, 1);
		const after = await settleClick();
		assert.equal(after.clicks, 2);
		assert.equal(after.buttonVisible, false);
		record.naturalRoundEnd = {
			...after,
			hiddenButtonGuardAlsoCheckedWithNativeHat: true
		};
		record.naturalCountdownVerified = true;
		await retain();
		const oldSayCount = await frame.evaluate(
			() => window.__courseSpeedRound.says.length
		);
		await frame.locator("[class*=\"green-flag_green-flag\"]").click();
		await frame.waitForFunction(
			count =>
				window.__courseSpeedRound.says.length > count
				&& window.__courseSpeedRound.says.at(-1).text === "Ready...",
			{},
			oldSayCount
		);
		const restart = await clickButton();
		assert.equal(restart.clicks, 0);
		assert.equal(restart.running, "False");
		record.restart = restart;
		record.restartVerified = true;
		record.nativeObservations = await frame.evaluate(() => ({
			says: window.__courseSpeedRound.says,
			clicks: window.__courseSpeedRound.clicks
		}));
		record.complete = true;
		await retain();
	}
	finally {
		await frame.evaluate(() => {
			const runtime = window.__courseTestVm.runtime;
			const state = window.__courseSpeedRound;
			window.__courseTestVm.stopAll();
			runtime.startHats = state.originalStartHats;
			runtime.removeListener("SAY", state.onSay);
			delete window.__courseSpeedRound;
		});
	}
	return record;
}
