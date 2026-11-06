import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function checkWheelFinalGuess(frame, output) {
	const record = {
		project: "342643080",
		complete: false,
		sayDurationsAcceleratedToZero: true,
		naturalSpeechTimingAccepted: false,
		cases: []
	};
	const retain = () =>
		writeFile(
			path.join(output, "wheel-final-guess.json"),
			JSON.stringify(record, null, 2) + "\n"
		);
	await frame.evaluate(() => {
		const runtime = window.__courseTestVm.runtime;
		const state = {
			active: null,
			say: runtime._primitives.looks_sayforsecs,
			random: runtime._primitives.operator_random
		};
		runtime._primitives.looks_sayforsecs = (args, util) => {
			if (!state.active) return state.say(args, util);
			state.active.said.push(String(args.MESSAGE));
			return state.say({ ...args, SECS: 0 }, util);
		};
		runtime._primitives.operator_random = (args, util) =>
			state.active && Number(args.FROM) === 1 && Number(args.TO) === 3
				? state.active.wordIndex
				: state.random(args, util);
		window.__courseWheelFinalGuess = state;
	});
	try {
		for (const [index, word] of ["fun", "new", "happy"].entries()) {
			const letters = [...new Set(word)],
				budget = letters.length + 5;
			for (const scenario of [
				{ name: "early win", answers: letters, win: true },
				{
					name: "last allowed guess wins",
					answers: [...Array(5).fill("z"), ...letters],
					win: true
				},
				{
					name: "duplicate then last-guess win",
					answers: [
						letters[0],
						letters[0],
						...Array(4).fill("z"),
						...letters.slice(1)
					],
					win: true
				},
				{
					name: "all incorrect",
					answers: Array(budget).fill("z"),
					win: false
				},
				{
					name: "all empty",
					answers: Array(budget).fill(""),
					win: false
				}
			]) {
				record.inProgress = { word, scenario: scenario.name };
				await retain();
				const actual = await frame.evaluate(
					async ({ wordIndex, answers }) => {
						const vm = window.__courseTestVm,
							runtime = vm.runtime,
							state = window.__courseWheelFinalGuess;
						vm.stopAll();
						const current = {
							wordIndex,
							said: [],
							questions: 0,
							extraQuestion: false,
							actualScratchVm: true
						};
						state.active = current;
						const respond = question => {
							if (typeof question !== "string") return;
							if (current.questions >= answers.length) {
								current.extraQuestion = true;
								return;
							}
							const answer = answers[current.questions++];
							setTimeout(() => runtime.emit("ANSWER", answer), 0);
						};
						runtime.on("QUESTION", respond);
						try {
							vm.greenFlag();
							const threads = runtime.threads.filter(
								t =>
									t.target.sprite.name === "Devin" &&
									!t.isMonitor
							);
							if (threads.length !== 1)
								throw Error("Expected one Wheel flag script");
							const limit = Date.now() + 15000;
							while (
								threads.some(t => runtime.isActiveThread(t))
							) {
								if (Date.now() > limit || current.extraQuestion)
									throw Error(JSON.stringify(current));
								await new Promise(resolve =>
									setTimeout(resolve, 20)
								);
							}
							const stage = runtime.getTargetForStage();
							return {
								...current,
								correctLetters: [
									...stage.lookupVariableById(
										",B^S%3SF+N)MQx#G=EvO"
									).value
								],
								guessedLetters: [
									...stage.lookupVariableById(
										"s{EFnMot(AQFK1.V)h(L"
									).value
								].sort()
							};
						} finally {
							vm.stopAll();
							runtime.removeListener("QUESTION", respond);
							state.active = null;
						}
					},
					{ wordIndex: index + 1, answers: scenario.answers }
				);
				record.cases.push({ word, scenario: scenario.name, ...actual });
				await retain();
				assert.equal(actual.questions, scenario.answers.length);
				assert.equal(actual.extraQuestion, false);
				assert.deepEqual(actual.correctLetters, letters);
				if (scenario.win) {
					assert.equal(
						actual.said.at(-1),
						"Congratulations, you've guessed it! the word was: " +
							word
					);
					assert.deepEqual(
						actual.guessedLetters,
						[...letters].sort()
					);
				} else {
					assert.match(actual.said.at(-1), /all out of guesses/);
					assert.deepEqual(actual.guessedLetters, []);
				}
			}
		}
		assert.equal(record.cases.length, 15);
		delete record.inProgress;
		record.complete = true;
		await retain();
		return record;
	} finally {
		await frame.evaluate(() => {
			const vm = window.__courseTestVm,
				state = window.__courseWheelFinalGuess;
			vm.stopAll();
			state.active = null;
			vm.runtime._primitives.looks_sayforsecs = state.say;
			vm.runtime._primitives.operator_random = state.random;
			delete window.__courseWheelFinalGuess;
		});
	}
}
