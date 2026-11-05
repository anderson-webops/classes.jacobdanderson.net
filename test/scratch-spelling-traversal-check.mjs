import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function checkSpellingBeeTraversal(frame, output) {
	const record = {
		project: "357452924",
		complete: false,
		sayDurationsAcceleratedToZero: true,
		naturalSpeechTimingAccepted: false,
		cases: []
	};
	const retain = () =>
		writeFile(
			path.join(output, "spelling-bee-traversal.json"),
			JSON.stringify(record, null, 2) + "\n"
		);
	const words = [
		"",
		"a",
		"ab",
		"abc",
		"CODING",
		"seventh",
		"a b",
		" ",
		"  ab  "
	];
	for (const word of words) {
		const letters = word.split("");
		const expected = [
			letters,
			letters.slice(1),
			letters.slice(0, -1),
			letters.slice(1, -1),
			letters.filter((_, index) => index % 2 === 0),
			[...letters].reverse()
		];
		for (let index = 0; index < 6; index++) {
			const actual = await frame.evaluate(
				async ({ mode, word }) => {
					const vm = window.__courseTestVm;
					vm.stopAll();
					const runtime = vm.runtime;
					const original = runtime._primitives.looks_sayforsecs;
					const said = [];
					const questions = [];
					const respond = question => {
						if (typeof question === "string" && question) {
							questions.push(question);
							setTimeout(() => runtime.emit("ANSWER", word), 0);
						}
					};
					runtime.on("QUESTION", respond);
					runtime._primitives.looks_sayforsecs = (args, util) => {
						if (!util.stackFrame.timer)
							said.push(String(args.MESSAGE));
						return original({ ...args, SECS: 0 }, util);
					};
					try {
						const threads = runtime.startHats(
							"event_whenkeypressed",
							{ KEY_OPTION: mode }
						);
						if (threads.length !== 1)
							throw Error("Expected one spelling key handler");
						const limit = Date.now() + 10000;
						while (runtime.threads.length) {
							if (Date.now() > limit)
								throw Error(
									"Spelling traversal did not finish"
								);
							await new Promise(resolve =>
								setTimeout(resolve, 20)
							);
						}
						return { said, questions, actualScratchVm: true };
					} finally {
						vm.stopAll();
						runtime.removeListener("QUESTION", respond);
						runtime._primitives.looks_sayforsecs = original;
					}
				},
				{ mode: String(index + 1), word }
			);
			assert.equal(actual.questions.length, 1);
			assert.deepEqual(
				actual.said,
				expected[index],
				JSON.stringify({ mode: index + 1, word })
			);
			record.cases.push({
				mode: index + 1,
				word,
				expected: expected[index],
				...actual
			});
			await retain();
		}
	}
	assert.equal(record.cases.length, 54);
	record.complete = true;
	await retain();
	return record;
}
