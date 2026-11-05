import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function checkRocketshipRestart(frame, output) {
	const record = { project: "332459692", complete: false, cases: [] };
	const retain = () => writeFile(
		path.join(output, "rocketship-restart.json"),
		`${JSON.stringify(record, null, 2)}\n`
	);
	await frame.evaluate(() => {
		const vm = window.__courseTestVm;
		const rocket = vm.runtime.targets.find(
			target => target.sprite.name === "Rocketship"
		);
		const state = { rocket, calls: [], originalSetXY: rocket.setXY };
		rocket.setXY = function (...args) {
			const result = state.originalSetXY.apply(this, args);
			state.calls.push({ requested: args.slice(0, 2), x: this.x, y: this.y });
			return result;
		};
		window.__courseRocketRestart = state;
	});
	try {
		for (const previous of [
			{ name: "moved", x: 120, y: 20, visible: true },
			{ name: "hidden after launch", x: 0, y: 185, visible: false },
			{ name: "interrupted run", x: -90, y: 80, visible: false }
		]) {
			await frame.evaluate((previous) => {
				window.__courseTestVm.stopAll();
				const state = window.__courseRocketRestart;
				state.rocket.setXY(previous.x, previous.y);
				state.rocket.setVisible(previous.visible);
				state.rocket.setDirection(45);
				state.calls.length = 0;
			}, previous);
			await frame.locator("[class*=\"green-flag_green-flag\"]").click();
			await frame.waitForFunction(() => {
				const state = window.__courseRocketRestart;
				return state.calls.length && state.rocket.visible
					&& state.rocket.direction === 0;
			});
			const actual = await frame.evaluate(() => {
				const state = window.__courseRocketRestart;
				return { firstMove: state.calls[0], visible: state.rocket.visible, direction: state.rocket.direction };
			});
			assert.deepEqual(actual.firstMove.requested, [0, -204]);
			assert.equal(actual.firstMove.x, 0);
			assert.equal(actual.firstMove.y, -204);
			assert.equal(actual.visible, true);
			assert.equal(actual.direction, 0);
			record.cases.push({ previous, actual, nativeGreenFlag: true });
			await retain();
		}
		record.complete = true;
		await retain();
	}
	finally {
		await frame.evaluate(() => {
			window.__courseTestVm.stopAll();
			const state = window.__courseRocketRestart;
			state.rocket.setXY = state.originalSetXY;
			delete window.__courseRocketRestart;
		});
	}
	return record;
}
