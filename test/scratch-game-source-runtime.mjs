import assert from "node:assert/strict";

// Deterministic source execution for the named game-state branches. Renderer,
// input timing, audio and concurrent VM scheduling require separate acceptance.
export function sourceGameRuntime(project, options = {}) {
	const state = {
		targets: project.targets.map(t => ({
			...structuredClone(t),
			alive: true,
			costume: (t.currentCostume || 0) + 1
		})),
		stopped: false,
		events: [],
		waits: 0,
		queue: [],
		said: []
	};
	const stage = state.targets.find(t => t.isStage);
	const stopScript = Symbol("stop script"),
		stopAll = Symbol("stop all"),
		deleted = Symbol("deleted");
	let steps = 0;
	const byName = name => state.targets.find(t => t.name === name);
	const lookup = (target, id) => target.variables[id] || stage.variables[id];
	const get = (target, input) => {
		if (!input) return false;
		const v = input[1];
		if (typeof v === "string") return expression(target, target.blocks[v]);
		if (v[0] === 12) return lookup(target, v[2])[1];
		return v[1];
	};
	const expression = (target, b) => {
		assert.ok(b, "Referenced source block must exist");
		const read = key => get(target, b.inputs[key]);
		switch (b.opcode) {
			case "operator_join":
				return String(read("STRING1")) + String(read("STRING2"));
			case "operator_equals":
				return (
					String(read("OPERAND1")).toLowerCase() ===
					String(read("OPERAND2")).toLowerCase()
				);
			case "operator_lt":
				return Number(read("OPERAND1")) < Number(read("OPERAND2"));
			case "operator_gt":
				return Number(read("OPERAND1")) > Number(read("OPERAND2"));
			case "operator_mod":
				return (
					((Number(read("NUM1")) % Number(read("NUM2"))) +
						Number(read("NUM2"))) %
					Number(read("NUM2"))
				);
			case "operator_add":
				return Number(read("NUM1")) + Number(read("NUM2"));
			case "operator_and":
				return read("OPERAND1") && read("OPERAND2");
			case "operator_or":
				return read("OPERAND1") || read("OPERAND2");
			case "operator_not":
				return !read("OPERAND");
			case "operator_random":
				return (
					options.random?.(
						Number(read("FROM")),
						Number(read("TO")),
						target
					) ?? Number(read("FROM"))
				);
			case "data_itemoflist":
				return (target.lists[b.fields.LIST[1]] ||
					stage.lists[b.fields.LIST[1]])[1][
					Number(read("INDEX")) - 1
				];
			case "sensing_touchingcolor":
				return options.color?.(target, read("COLOR")) ?? false;
			case "sensing_touchingobject":
				return (
					options.touch?.(target, read("TOUCHINGOBJECTMENU")) ?? false
				);
			case "sensing_keypressed":
				return options.key?.(read("KEY_OPTION")) ?? false;
			case "looks_size":
				return target.size;
			case "motion_xposition":
				return target.x;
			case "motion_yposition":
				return target.y;
			case "sensing_touchingobjectmenu":
				return b.fields.TOUCHINGOBJECTMENU[0];
			case "sensing_keyoptions":
				return b.fields.KEY_OPTION[0];
			case "sound_sounds_menu":
				return b.fields.SOUND_MENU[0];
			case "looks_costume":
				return b.fields.COSTUME[0];
			case "motion_goto_menu":
				return b.fields.TO[0];
			case "looks_backdrops":
				return b.fields.BACKDROP[0];
			default:
				throw Error("Unhandled source reporter " + b.opcode);
		}
	};
	function dispatch(name) {
		state.events.push(name);
		for (const target of state.targets) {
			for (const [id, b] of Object.entries(target.blocks)) {
				if (
					b.opcode === "event_whenbroadcastreceived" &&
					b.fields.BROADCAST_OPTION[0] === name
				)
					thread(target, id);
			}
		}
	}
	function stack(target, id, stopBefore) {
		while (id && id !== stopBefore) {
			assert.ok(
				++steps < 10000,
				"Selected source path must stay bounded"
			);
			const b = target.blocks[id],
				read = key => get(target, b.inputs[key]);
			assert.ok(b, id);
			switch (b.opcode) {
				case "event_whenflagclicked":
				case "event_whenbroadcastreceived":
				case "event_whenkeypressed":
				case "control_start_as_clone":
					break;
				case "data_setvariableto":
					lookup(target, b.fields.VARIABLE[1])[1] = read("VALUE");
					break;
				case "data_changevariableby":
					lookup(target, b.fields.VARIABLE[1])[1] =
						Number(lookup(target, b.fields.VARIABLE[1])[1]) +
						Number(read("VALUE"));
					break;
				case "data_showvariable":
				case "data_hidevariable":
					break;
				case "looks_sayforsecs":
					state.said.push(String(read("MESSAGE")));
					break;
				case "pen_penUp":
					target.penDown = false;
					break;
				case "pen_setPenColorToColor":
					target.penColor = read("COLOR");
					break;
				case "motion_goto": {
					assert.equal(read("TO"), "_random_");
					target.penAtRandomPlacement = !!target.penDown;
					const point = options.randomPosition?.(target) ?? {
						x: 100,
						y: 100
					};
					target.x = point.x;
					target.y = point.y;
					break;
				}
				case "looks_show":
					target.visible = true;
					break;
				case "looks_hide":
					target.visible = false;
					break;
				case "looks_setsizeto":
					target.size = Number(read("SIZE"));
					break;
				case "looks_changesizeby":
					target.size += Number(read("CHANGE"));
					break;
				case "looks_switchcostumeto":
					target.costume = Number(read("COSTUME"));
					break;
				case "looks_switchbackdropto":
					stage.backdrop = read("BACKDROP");
					break;
				case "motion_gotoxy":
					target.x = Number(read("X"));
					target.y = Number(read("Y"));
					break;
				case "motion_changexby":
					target.x += Number(read("DX"));
					break;
				case "motion_changeyby":
					target.y += Number(read("DY"));
					break;
				case "motion_pointindirection":
					target.direction = Number(read("DIRECTION"));
					break;
				case "motion_movesteps": {
					const angle = (target.direction * Math.PI) / 180;
					target.x += Math.sin(angle) * Number(read("STEPS"));
					target.y += Math.cos(angle) * Number(read("STEPS"));
					break;
				}
				case "motion_setrotationstyle":
					target.rotationStyle = b.fields.STYLE[0];
					break;
				case "sound_play":
					state.events.push("sound:" + read("SOUND_MENU"));
					break;
				case "control_wait":
					state.waits += Number(read("DURATION"));
					break;
				case "control_repeat": {
					const count = Math.max(
						0,
						Math.round(Number(read("TIMES")))
					);
					for (let i = 0; i < count; i++)
						stack(target, b.inputs.SUBSTACK[1]);
					break;
				}
				case "control_forever":
					stack(target, b.inputs.SUBSTACK[1]);
					break;
				case "control_repeat_until":
					while (!read("CONDITION"))
						stack(target, b.inputs.SUBSTACK[1]);
					break;
				case "control_if":
				case "control_if_else": {
					const branch = read("CONDITION")
						? b.inputs.SUBSTACK
						: b.inputs.SUBSTACK2;
					if (branch) stack(target, branch[1]);
					break;
				}
				case "procedures_call": {
					const code = b.mutation.proccode;
					const definition = Object.values(target.blocks).find(
						block =>
							block.opcode === "procedures_definition" &&
							target.blocks[block.inputs.custom_block[1]].mutation
								.proccode === code
					);
					assert.ok(definition, code);
					stack(target, definition.next);
					break;
				}
				case "event_broadcast":
					state.queue.push(b.inputs.BROADCAST_INPUT[1][1]);
					break;
				case "event_broadcastandwait":
					dispatch(b.inputs.BROADCAST_INPUT[1][1]);
					break;
				case "control_stop":
					if (b.fields.STOP_OPTION[0] === "all") {
						state.stopped = true;
						throw stopAll;
					}
					assert.equal(b.fields.STOP_OPTION[0], "this script");
					throw stopScript;
				case "control_delete_this_clone":
					target.alive = false;
					throw deleted;
				default:
					throw Error("Unhandled source command " + b.opcode);
			}
			id = b.next;
		}
	}
	function thread(target, id, stopBefore) {
		try {
			stack(target, id, stopBefore);
			return { returned: true };
		} catch (error) {
			if (error === stopScript) return { scriptStopped: true };
			if (error === deleted) return { cloneDeleted: true };
			throw error;
		}
	}
	return {
		state,
		target: byName,
		variable(target, id, value) {
			const pair = lookup(target, id);
			if (arguments.length === 3) pair[1] = value;
			return pair[1];
		},
		expression(target, id) {
			return expression(target, target.blocks[id]);
		},
		clone(name, suffix) {
			const t = structuredClone(byName(name));
			t.name = name + suffix;
			state.targets.push(t);
			return t;
		},
		run(target, id, stopBefore) {
			try {
				const result = thread(target, id, stopBefore);
				while (state.queue.length && !state.stopped)
					dispatch(state.queue.shift());
				return result;
			} catch (error) {
				if (error !== stopAll) throw error;
				return { allStopped: true };
			}
		},
		procedure(target, code) {
			const definition = Object.values(target.blocks).find(
				b =>
					b.opcode === "procedures_definition" &&
					target.blocks[b.inputs.custom_block[1]].mutation
						.proccode === code
			);
			return this.run(target, definition.next);
		}
	};
}
