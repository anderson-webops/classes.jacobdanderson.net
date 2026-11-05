import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native source/archive verification.
import { test } from "node:test";
import { strFromU8, unzipSync } from "fflate";
import {
	createOriginalProject,
	originalAttributionId,
	originalScratchProjects
} from "../front-end/scripts/scratch/generate-original-projects.mjs";

const compatibility = JSON.parse(
	await readFile(
		new URL(
			"../front-end/scripts/scratch/originals/compatibility.json",
			import.meta.url
		),
		"utf8"
	)
).changes;

function verifyAndRestoreRocketship(loaded, source) {
	const target = loaded.targets.find(t => t.name === "Rocketship");
	const original = source.targets.find(t => t.name === "Rocketship");
	const blocks = target.blocks;
	const flag = Object.keys(original.blocks).find(
		id => original.blocks[id].opcode === "event_whenflagclicked"
	);
	const show = original.blocks[flag].next;
	const reset = "classes-rocketship-reset-position";
	assert.deepEqual(
		Object.keys(blocks).filter(id => !original.blocks[id]),
		[reset]
	);
	assert.equal(blocks[flag].next, reset);
	assert.deepEqual(blocks[reset], {
		opcode: "motion_gotoxy",
		next: show,
		parent: flag,
		inputs: { X: [1, [4, "0"]], Y: [1, [4, "-204"]] },
		fields: {},
		shadow: false,
		topLevel: false
	});
	assert.equal(blocks[show].opcode, "looks_show");
	assert.equal(blocks[show].parent, reset);
	for (const [id, block] of Object.entries(original.blocks)) {
		const restored = structuredClone(blocks[id]);
		if (id === flag) restored.next = block.next;
		if (id === show) restored.parent = block.parent;
		assert.deepEqual(
			restored,
			block,
			`Only rocket reset links change: ${id}`
		);
	}
	blocks[flag].next = original.blocks[flag].next;
	blocks[show].parent = original.blocks[show].parent;
	delete blocks[reset];
}

function verifyAndRestoreSpeedClick(loaded, source) {
	const target = loaded.targets.find(t => t.name === "Button");
	const original = source.targets.find(t => t.name === "Button");
	const b = target.blocks;
	const additions = ["reset", "start", "finish", "and", "positive"].map(
		key => `classes-speed-click-round-${key}`
	);
	assert.equal(
		Object.keys(b).length,
		Object.keys(original.blocks).length + 5
	);
	assert.deepEqual(
		Object.keys(b)
			.filter(id => !original.blocks[id])
			.sort(),
		additions.sort()
	);
	const changed = new Map([
		["+xgmdXI1G@(/B{9]h/Uh", ["next"]],
		["oPn/}#K24oTQ0){*pAAJ", ["next"]],
		["W.0C4`2f(t`52N(*qpd+", ["topLevel", "parent", "x", "y", "inputs"]],
		["%C$yb|/7!FMQ;-eP_=^1", ["parent"]],
		["~2u};p0pUpjtkC1R{[^V", ["parent"]],
		["hG^=4;_pJAIaPU+~^:=e", ["next"]],
		["quv2uz-8|kxf~l,1HXOo", ["next", "parent"]],
		["?kLAjyC)`,,aPo1.)vyr", ["parent"]],
		["){[Zk3SJuUrAP0SZNz;A", ["topLevel", "parent", "x", "y"]]
	]);
	for (const [id, block] of Object.entries(original.blocks)) {
		const actual = structuredClone(b[id]);
		for (const key of changed.get(id) ?? []) {
			if (Object.hasOwn(block, key)) actual[key] = block[key];
			else delete actual[key];
		}
		assert.deepEqual(
			actual,
			block,
			`Only reviewed Speed Click fields change: ${id}`
		);
	}
	const prefix = "classes-speed-click-round-";
	const flag = Object.entries(b).find(
		([, block]) => block.opcode === "event_whenflagclicked"
	)[0];
	const click = Object.entries(b).find(
		([, block]) => block.opcode === "event_whenthisspriteclicked"
	)[0];
	const chain = [];
	for (let id = b[flag].next; id; id = b[id].next) {
		assert.ok(!chain.includes(id));
		chain.push(id);
	}
	assert.equal(chain[0], `${prefix}reset`);
	for (const key of ["reset", "start", "finish"])
		assert.equal(b[prefix + key].opcode, "data_setvariableto");
	assert.equal(b[`${prefix}reset`].inputs.VALUE[1][1], "False");
	assert.equal(b[`${prefix}start`].inputs.VALUE[1][1], "True");
	assert.equal(b[`${prefix}finish`].inputs.VALUE[1][1], "False");
	const start = chain.indexOf(`${prefix}start`);
	const finish = chain.indexOf(`${prefix}finish`);
	assert.equal(b[chain[start - 1]].inputs.MESSAGE[1][1], "Go!");
	assert.equal(b[chain[start + 1]].opcode, "control_repeat");
	assert.equal(finish, start + 2);
	const guard = b[b[click].next];
	assert.equal(guard.opcode, "control_if");
	assert.deepEqual(guard.inputs.CONDITION, [2, `${prefix}and`]);
	assert.deepEqual(
		guard.inputs.SUBSTACK,
		original.blocks[b[click].next].inputs.SUBSTACK
	);
	const and = b[`${prefix}and`];
	assert.equal(and.opcode, "operator_and");
	assert.deepEqual(and.inputs.OPERAND2, [2, `${prefix}positive`]);
	const running = b[and.inputs.OPERAND1[1]];
	assert.equal(running.opcode, "operator_equals");
	assert.equal(b[`${prefix}positive`].opcode, "operator_gt");
	assert.equal(b[`${prefix}positive`].inputs.OPERAND1[1][1], "Timer");
	assert.equal(b[`${prefix}positive`].inputs.OPERAND2[1][1], "0");
	for (const [id, block] of Object.entries(original.blocks))
		b[id] = structuredClone(block);
	for (const id of additions) delete b[id];
}

function verifyAndRestoreSpellingBee(loaded, source) {
	const blocks = loaded.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	const original = source.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	const changes = new Map([
		["C9V.33_V_Q!H5w!8v)7O", "inputs"],
		["HLDy8|Y8t9dqT4dW{|Ej", "parent"],
		[":BH@23MI?jB?:NVu@;`e", "inputs"],
		["QBiOC]Cs4e]__flUyHP{", "parent"]
	]);
	const added = [
		"classes-spelling-bee-skip-first-count",
		"classes-spelling-bee-half-length",
		"classes-spelling-bee-alternate-count"
	];
	assert.deepEqual(
		Object.keys(blocks)
			.filter(id => !original[id])
			.sort(),
		[...added].sort()
	);
	assert.equal(blocks[added[0]].opcode, "operator_subtract");
	assert.equal(blocks[added[0]].inputs.NUM2[1][1], "1");
	assert.equal(blocks[added[1]].opcode, "operator_divide");
	assert.equal(blocks[added[1]].inputs.NUM2[1][1], "2");
	assert.equal(blocks[added[2]].opcode, "operator_mathop");
	assert.equal(blocks[added[2]].fields.OPERATOR[0], "ceiling");
	for (const [id, before] of Object.entries(original)) {
		const current = structuredClone(blocks[id]);
		const key = changes.get(id);
		if (key) current[key] = before[key];
		assert.deepEqual(
			current,
			before,
			"Only reviewed spelling bounds change: " + id
		);
		blocks[id] = structuredClone(before);
	}
	for (const id of added) delete blocks[id];
}

test("all original Scratch archives retain upstream bytes and only declared corrections", async () => {
	assert.equal(originalScratchProjects.length, 164);
	const assets = new Set();
	const records = [];
	const correctedProjects = new Set();
	const correctedAssets = new Set();
	const programCorrections = [];
	for (const original of originalScratchProjects) {
		const source = JSON.parse(
			await readFile(
				new URL(
					`../front-end/scripts/scratch/originals/projects/${original.id}.json`,
					import.meta.url
				),
				"utf8"
			)
		);
		const { archive } = await createOriginalProject(original.id);
		const files = unzipSync(archive);
		assert.equal(
			Object.keys(files)[0],
			"project.json",
			"Scratch's runnable definition is first in the archive"
		);
		assert.deepEqual(
			Object.keys(files).filter(name =>
				/(?:^|\/)project\.json$/.test(name)
			),
			["project.json"],
			"The archived source cannot shadow the runnable project"
		);
		assert.equal(
			createHash("sha256")
				.update(files["SOURCE/original.json"])
				.digest("hex"),
			original.sourceSHA256
		);
		const loaded = JSON.parse(strFromU8(files["project.json"]));
		const stage = loaded.targets.find(target => target.isStage);
		const attribution =
			stage.comments[originalAttributionId(original.id)].text;
		assert.ok(
			attribution.includes(original.author) &&
				attribution.includes(original.url)
		);
		assert.ok(
			attribution.includes(
				"https://creativecommons.org/licenses/by-sa/2.0/"
			)
		);
		assert.ok(strFromU8(files["SOURCE.txt"]).includes(attribution));
		delete stage.comments[originalAttributionId(original.id)];
		if (!source.targets.find(target => target.isStage).comments)
			delete stage.comments;
		const expected = new Set([
			"project.json",
			"SOURCE.txt",
			"SOURCE/original.json"
		]);
		const corrections = new Map();
		if (original.id === "299311602") {
			verifyAndRestoreSpeedClick(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 5);
			assert.ok(attribution.includes("Active-round score guard"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		if (original.id === "332459692") {
			verifyAndRestoreRocketship(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 1);
			assert.ok(attribution.includes("Restart position reset"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		if (original.id === "357452924") {
			verifyAndRestoreSpellingBee(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 3);
			assert.ok(attribution.includes("String traversal bounds"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		for (const [targetIndex, target] of source.targets.entries()) {
			assert.deepEqual(
				loaded.targets[targetIndex].blocks,
				target.blocks,
				`${original.id}: original program`
			);
			for (const [index, costume] of target.costumes.entries()) {
				const name =
					costume.md5ext ||
					`${costume.assetId}.${costume.dataFormat}`;
				const correction = compatibility[name];
				if (!correction) continue;
				const current = loaded.targets[targetIndex].costumes[index];
				assert.equal(current.md5ext, correction.file);
				assert.equal(current.assetId, correction.file.split(".")[0]);
				assert.equal(
					createHash("md5")
						.update(files[correction.file])
						.digest("hex"),
					current.assetId
				);
				assert.equal(
					createHash("sha256")
						.update(files[correction.file])
						.digest("hex"),
					correction.sha256
				);
				assert.equal(
					createHash("sha256").update(files[name]).digest("hex"),
					correction.sourceSHA256
				);
				current.assetId = costume.assetId;
				if (costume.md5ext) current.md5ext = costume.md5ext;
				else delete current.md5ext;
				expected.add(correction.file);
				correctedAssets.add(correction.file);
				corrections.set(name, { original: name, ...correction });
			}
		}
		assert.deepEqual(
			loaded,
			source,
			`Only attribution and declared SVG/program corrections may change in ${original.id}`
		);
		if (corrections.size) {
			correctedProjects.add(original.id);
			expected.add("SOURCE/compatibility.json");
			assert.deepEqual(
				JSON.parse(strFromU8(files["SOURCE/compatibility.json"])),
				[...corrections.values()]
			);
			assert.ok(attribution.includes("SVG compatibility corrections"));
		}
		for (const target of source.targets) {
			for (const asset of [...target.costumes, ...target.sounds]) {
				const name =
					asset.md5ext || `${asset.assetId}.${asset.dataFormat}`;
				expected.add(name);
				assets.add(name);
				assert.ok(files[name], `${original.id}: ${name}`);
				assert.equal(
					createHash("md5").update(files[name]).digest("hex"),
					name.split(".")[0]
				);
			}
		}
		assert.deepEqual(new Set(Object.keys(files)), expected);
		records.push({
			id: original.id,
			sourceSHA256: original.sourceSHA256,
			sha256: createHash("sha256").update(archive).digest("hex"),
			bytes: archive.length
		});
	}
	assert.equal(assets.size, 505);
	assert.equal(correctedAssets.size, 2);
	assert.equal(correctedProjects.size, 5);
	assert.deepEqual(programCorrections, [
		"299311602",
		"332459692",
		"357452924"
	]);
	if (process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR) {
		await mkdir(process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR, {
			recursive: true
		});
		await writeFile(
			path.join(
				process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR,
				"archive-identity.json"
			),
			`${JSON.stringify({ projects: 164, assets: 505, originalSourceBytesRetained: true, unchangedPrograms: 161, declaredProgramCorrections: programCorrections, onlyDeclaredAttributionSvgAndProgramChanges: true, compatibilityAssets: correctedAssets.size, compatibilityProjects: correctedProjects.size, records }, null, 2)}\n`
		);
	}
});

test("original Scratch source identifiers cannot select arbitrary files", async () => {
	for (const value of [
		"../../package",
		"214828609",
		"999999999999",
		"https://scratch.mit.edu/projects/287707460/"
	]) {
		await assert.rejects(
			createOriginalProject(value),
			/Unknown original Scratch project/
		);
	}
});

test("Spelling Bee generated reference bounds produce only the selected letters", async () => {
	const { archive } = await createOriginalProject("357452924");
	const files = unzipSync(archive);
	const project = JSON.parse(strFromU8(files["project.json"]));
	const blocks = project.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	function run(mode, answer, program = blocks) {
		const state = new Map();
		const said = [];
		function value(input) {
			const node = input[1];
			if (typeof node === "string") {
				const b = program[node];
				const arg = key => value(b.inputs[key]);
				switch (b.opcode) {
					case "sensing_answer":
						return answer;
					case "operator_length":
						return String(arg("STRING")).length;
					case "operator_subtract":
						return Number(arg("NUM1")) - Number(arg("NUM2"));
					case "operator_divide":
						return Number(arg("NUM1")) / Number(arg("NUM2"));
					case "operator_mathop":
						assert.equal(b.fields.OPERATOR[0], "ceiling");
						return Math.ceil(Number(arg("NUM")));
					case "operator_letter_of":
						return String(arg("STRING")).charAt(
							Number(arg("LETTER")) - 1
						);
					default:
						throw Error("Unexpected spelling reporter " + b.opcode);
				}
			}
			return node[0] === 12 ? state.get(node[1]) : node[1];
		}
		function stack(id) {
			while (id) {
				const b = program[id];
				switch (b.opcode) {
					case "sensing_askandwait":
						break;
					case "data_setvariableto":
						state.set(b.fields.VARIABLE[0], value(b.inputs.VALUE));
						break;
					case "data_changevariableby":
						state.set(
							b.fields.VARIABLE[0],
							Number(state.get(b.fields.VARIABLE[0])) +
								Number(value(b.inputs.VALUE))
						);
						break;
					case "looks_sayforsecs":
						said.push(value(b.inputs.MESSAGE));
						break;
					case "control_repeat": {
						const count = Math.max(
							0,
							Math.round(Number(value(b.inputs.TIMES)))
						);
						for (let index = 0; index < count; index++)
							stack(b.inputs.SUBSTACK[1]);
						break;
					}
					default:
						throw Error("Unexpected spelling command " + b.opcode);
				}
				id = b.next;
			}
		}
		const hat = Object.values(program).find(
			b =>
				b.opcode === "event_whenkeypressed" &&
				b.fields.KEY_OPTION[0] === mode
		);
		stack(hat.next);
		return said;
	}
	const source = JSON.parse(strFromU8(files["SOURCE/original.json"]));
	verifyAndRestoreSpellingBee(structuredClone(project), source);
	const originalBlocks = source.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	assert.deepEqual(run("2", "CODING", originalBlocks), [
		"O",
		"D",
		"I",
		"N",
		"G",
		""
	]);
	assert.deepEqual(run("5", "CODING", originalBlocks), [
		"C",
		"D",
		"N",
		"",
		"",
		""
	]);
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
		for (let index = 0; index < 6; index++)
			assert.deepEqual(
				run(String(index + 1), word),
				expected[index],
				JSON.stringify({ mode: index + 1, word })
			);
	}
});
