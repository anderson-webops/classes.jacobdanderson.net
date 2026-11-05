import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function checkDottyGraph(frame, output) {
	const record = {
		project: "338501835",
		complete: false,
		glideAndSayDurationsAcceleratedToZero: true,
		naturalTimingAccepted: false,
		cases: []
	};
	const retain = () =>
		writeFile(
			path.join(output, "dotty-graph.json"),
			JSON.stringify(record, null, 2) + "\n"
		);
	const answers = [-120, -90, -30, -1, 0, 1, 30, 90, 120, 180];
	await frame.evaluate(() => {
		const vm = window.__courseTestVm,
			runtime = vm.runtime;
		const dotty = runtime.targets.find(
			target => target.getName() === "Dotty"
		);
		const names = [
			"motion_glidesecstoxy",
			"looks_sayforsecs",
			"motion_gotoxy",
			"pen_penDown",
			"pen_penUp",
			"pen_stamp"
		];
		const originals = Object.fromEntries(
			names.map(name => [name, runtime._primitives[name]])
		);
		if (!dotty || names.some(name => typeof originals[name] !== "function"))
			throw Error("Dotty runtime was not loaded");
		const state = { dotty, originals, current: null };
		for (const name of ["motion_glidesecstoxy", "looks_sayforsecs"])
			runtime._primitives[name] = (args, util) =>
				originals[name](
					state.current ? { ...args, SECS: 0 } : args,
					util
				);
		runtime._primitives.pen_penDown = (args, util) => {
			const result = originals.pen_penDown(args, util);
			if (state.current) {
				state.current.drawing = true;
				state.current.trace.push([dotty.x, dotty.y]);
			}
			return result;
		};
		runtime._primitives.pen_penUp = (args, util) => {
			const result = originals.pen_penUp(args, util);
			if (state.current) state.current.drawing = false;
			return result;
		};
		runtime._primitives.motion_gotoxy = (args, util) => {
			const result = originals.motion_gotoxy(args, util);
			if (state.current?.drawing)
				state.current.trace.push([dotty.x, dotty.y]);
			return result;
		};
		runtime._primitives.pen_stamp = (args, util) => {
			if (state.current) state.current.stamps.push([dotty.x, dotty.y]);
			return originals.pen_stamp(args, util);
		};
		window.__courseDottyGraph = state;
	});
	try {
		for (const initialPenDown of [false, true]) {
			record.inProgress = { initialPenDown };
			await retain();
			await frame.evaluate(
				({ initialPenDown, answers }) => {
					const vm = window.__courseTestVm,
						state = window.__courseDottyGraph;
					vm.stopAll();
					state.originals[
						initialPenDown ? "pen_penDown" : "pen_penUp"
					]({}, { target: state.dotty });
					const current = {
						initialPenDown,
						questions: [],
						stamps: [],
						trace: [],
						drawing: initialPenDown
					};
					const respond = question => {
						if (typeof question === "string") {
							const index = current.questions.length;
							current.questions.push(question);
							if (index >= answers.length) {
								current.extraQuestion = true;
								return;
							}
							setTimeout(
								() =>
									vm.runtime.emit(
										"ANSWER",
										String(answers[index])
									),
								0
							);
						}
					};
					state.current = current;
					state.respond = respond;
					vm.runtime.on("QUESTION", respond);
				},
				{ initialPenDown, answers }
			);
			await frame.locator('[class*="green-flag_green-flag"]').click();
			await frame.waitForFunction(
				() => window.__courseDottyGraph.current.questions.length > 0
			);
			const actual = await frame.evaluate(async () => {
				const vm = window.__courseTestVm,
					state = window.__courseDottyGraph;
				const limit = Date.now() + 90000;
				try {
					while (
						vm.runtime.threads.some(
							thread =>
								thread.target === state.dotty &&
								!thread.updateMonitor &&
								vm.runtime.isActiveThread(thread)
						)
					) {
						if (Date.now() > limit)
							return {
								...state.current,
								timedOut: true,
								x: state.dotty.x,
								y: state.dotty.y
							};
						await new Promise(resolve => setTimeout(resolve, 20));
					}
					return {
						...state.current,
						x: state.dotty.x,
						y: state.dotty.y,
						actualScratchVm: true
					};
				} finally {
					vm.stopAll();
					vm.runtime.removeListener("QUESTION", state.respond);
					state.current = null;
				}
			});
			record.cases.push(actual);
			await retain();
			assert.ok(!actual.timedOut, JSON.stringify(actual));
			assert.ok(!actual.extraQuestion);
			assert.equal(actual.questions.length, 10);
			assert.deepEqual(
				actual.stamps,
				answers.map(x => [x, Math.abs(x)])
			);
			assert.deepEqual(
				actual.trace,
				Array.from({ length: 361 }, (_, index) => [
					index - 180,
					Math.abs(index - 180)
				])
			);
			assert.deepEqual([actual.x, actual.y], [180, 180]);
			assert.equal(actual.drawing, false);
		}
		delete record.inProgress;
		record.complete = true;
		await retain();
		return record;
	} finally {
		await frame.evaluate(() => {
			const vm = window.__courseTestVm,
				state = window.__courseDottyGraph;
			vm.stopAll();
			if (state.respond)
				vm.runtime.removeListener("QUESTION", state.respond);
			state.current = null;
			Object.assign(vm.runtime._primitives, state.originals);
			delete window.__courseDottyGraph;
		});
	}
}
