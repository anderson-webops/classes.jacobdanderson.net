import assert from "node:assert/strict";

export function verifyAndRestoreWheel(loaded, source) {
	const original = source.targets.find(t => t.name === "Devin").blocks;
	const blocks = loaded.targets.find(t => t.name === "Devin").blocks;
	const repeat = ",G:EgEcp!wC])`Q~T5_a";
	const win = "_Q^j6H-:{Dhd.U1mEM+E";
	const ask = "D!*6[C4XMco`ElhJHiFe";
	const guess = "A--(Z;=#_#@*7YKRd|n:";
	assert.deepEqual(Object.keys(blocks), Object.keys(original));
	assert.equal(blocks[repeat].inputs.SUBSTACK[1], ask);
	assert.equal(blocks[ask].parent, repeat);
	assert.equal(blocks[guess].next, win);
	assert.equal(blocks[win].parent, guess);
	assert.equal(blocks[win].next, null);
	const changed = new Map([
		[repeat, ["inputs"]],
		[ask, ["parent"]],
		[guess, ["next"]],
		[win, ["parent", "next"]]
	]);
	for (const [id, block] of Object.entries(original)) {
		const restored = structuredClone(blocks[id]);
		for (const key of changed.get(id) || [])
			restored[key] = structuredClone(block[key]);
		assert.deepEqual(
			restored,
			block,
			"Only reviewed final-guess links change: " + id
		);
		blocks[id] = restored;
	}
}

// A deterministic source interpreter. It checks these exact block graphs,
// independently of the real VM/browser acceptance retained by the browser suite.
export function runWheelSource(project, wordIndex, answers) {
	const stage = project.targets.find(t => t.isStage);
	const blocks = project.targets.find(t => t.name === "Devin").blocks;
	const variables = structuredClone(stage.variables);
	const lists = structuredClone(stage.lists);
	const said = [];
	let answer = "",
		questions = 0,
		commands = 0;
	function value(input) {
		const v = input[1];
		if (typeof v === "string") return expression(blocks[v]);
		if (v[0] === 12) return variables[v[2]][1];
		return v[1];
	}
	function expression(b) {
		const get = key => value(b.inputs[key]);
		switch (b.opcode) {
			case "operator_random":
				return wordIndex;
			case "operator_length":
				return String(get("STRING")).length;
			case "operator_add":
				return Number(get("NUM1")) + Number(get("NUM2"));
			case "operator_equals":
				return (
					String(get("OPERAND1")).toLowerCase() ===
					String(get("OPERAND2")).toLowerCase()
				);
			case "operator_letter_of":
				return String(get("STRING")).charAt(Number(get("LETTER")) - 1);
			case "operator_join":
				return String(get("STRING1")) + String(get("STRING2"));
			case "data_itemoflist":
				return lists[b.fields.LIST[1]][1][Number(get("INDEX")) - 1];
			case "data_lengthoflist":
				return lists[b.fields.LIST[1]][1].length;
			case "data_listcontainsitem":
				return lists[b.fields.LIST[1]][1].includes(get("ITEM"));
			case "sensing_answer":
				return answer;
			default:
				throw Error("Unexpected Wheel reporter " + b.opcode);
		}
	}
	const stopped = Symbol("stopped");
	function stack(id) {
		while (id) {
			assert.ok(++commands < 2000, "Wheel source must terminate");
			const b = blocks[id],
				get = key => value(b.inputs[key]);
			switch (b.opcode) {
				case "event_whenflagclicked":
					break;
				case "data_deletealloflist":
					lists[b.fields.LIST[1]][1] = [];
					break;
				case "data_addtolist":
					lists[b.fields.LIST[1]][1].push(get("ITEM"));
					break;
				case "data_setvariableto":
					variables[b.fields.VARIABLE[1]][1] = get("VALUE");
					break;
				case "data_changevariableby":
					variables[b.fields.VARIABLE[1]][1] =
						Number(variables[b.fields.VARIABLE[1]][1]) +
						Number(get("VALUE"));
					break;
				case "control_repeat": {
					const count = Number(get("TIMES"));
					for (let i = 0; i < count; i++) stack(b.inputs.SUBSTACK[1]);
					break;
				}
				case "control_if":
				case "control_if_else": {
					const branch = get("CONDITION")
						? b.inputs.SUBSTACK
						: b.inputs.SUBSTACK2;
					if (branch) stack(branch[1]);
					break;
				}
				case "sensing_askandwait":
					assert.ok(
						questions < answers.length,
						"Every requested guess must have a supplied answer"
					);
					answer = answers[questions++];
					break;
				case "looks_sayforsecs":
					said.push(String(get("MESSAGE")));
					break;
				case "control_stop":
					assert.equal(b.fields.STOP_OPTION[0], "this script");
					throw stopped;
				default:
					throw Error("Unexpected Wheel command " + b.opcode);
			}
			id = b.next;
		}
	}
	try {
		stack(
			Object.keys(blocks).find(
				id => blocks[id].opcode === "event_whenflagclicked"
			)
		);
	} catch (error) {
		if (error !== stopped) throw error;
	}
	return {
		said,
		questions,
		correctLetters: lists[",B^S%3SF+N)MQx#G=EvO"][1],
		guessedLetters: lists["s{EFnMot(AQFK1.V)h(L"][1]
	};
}
