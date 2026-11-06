import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function checkRepairedScratchGame(frame, output, project) {
	const record = {
		project,
		complete: false,
		actualScratchVM: true,
		controlledCollisionSensors: true,
		timingAccelerated: true,
		physicalCollisionAndNaturalTimingAccepted: false,
		cases: []
	};
	const retain = () =>
		writeFile(
			path.join(output, `game-state-${project}.json`),
			`${JSON.stringify(record, null, 2)}\n`
		);
	await retain();
	try {
		const result = await frame.evaluate(async (project) => {
			const vm = window.__courseTestVm;
			const rt = vm.runtime;
			const primitives = rt._primitives;
			const progress = { cases: [], inProgress: "setup" };
			window.__courseGameStateProgress = progress;
			const state = {
				budget: 0,
				holdTimer: true,
				freeze: true,
				touching: "",
				keys: [],
				mode: "floor",
				floor: -109,
				ceiling: -79,
				seed: 1,
				picks: 0,
				said: [],
				penUp: new Set(),
				placements: [],
				recovered: false,
				sawLow: false,
				spawn: null
			};
			const originals = new Map();
			const restores = [];
			const actor = name =>
				rt.targets.find(t => t.isOriginal && t.sprite.name === name);
			const clones = name =>
				rt.targets.filter(t => !t.isOriginal && t.sprite.name === name);
			const variable = id =>
				rt.getTargetForStage().lookupVariableById(id);
			const value = id => variable(id).value;
			const check = (condition, detail) => {
				if (!condition) throw new Error(detail);
			};
			const wait = async (predicate, label) => {
				const limit = Date.now() + 12000;
				while (!predicate()) {
					if (Date.now() > limit) {
						throw new Error(
							`${label
							} ${
								JSON.stringify({
									targets: rt.targets.map(t => ({
										name: t.sprite.name,
										x: t.x,
										y: t.y,
										visible: t.visible
									})),
									threads: rt.threads
										.filter(t => rt.isActiveThread(t))
										.map(t => ({
											top: t.topBlock,
											stack: t.stack,
											status: t.status
										})),
									state: {
										mode: state.mode,
										recovered: state.recovered
									}
								})}`
						);
					}
					await new Promise(resolve => setTimeout(resolve, 20));
				}
			};
			const wrap = (op, callback) => {
				const original = primitives[op];
				check(
					typeof original === "function",
					`Missing primitive ${op}`
				);
				originals.set(op, original);
				primitives[op] = (args, util) => callback(args, util, original);
			};
			const active = () =>
				rt.threads.filter(t => !t.isMonitor && rt.isActiveThread(t));
			const broadcast = (name) => {
				const message = Object.values(
					rt.getTargetForStage().variables
				).find(
					v =>
						v.type === "broadcast_msg"
						&& v.name.toLowerCase() === name.toLowerCase()
				);
				check(!!message, `Missing broadcast ${name}`);
				return rt.startHats("event_whenbroadcastreceived", {
					BROADCAST_OPTION: message.name
				});
			};
			const finish = (name, data) =>
				progress.cases.push({ name, ...data });
			try {
				wrap("looks_sayforsecs", (args, util, original) => {
					state.said.push(String(args.MESSAGE));
					return original({ ...args, SECS: 0 }, util);
				});
				wrap("control_create_clone_of", (args, util, original) => {
					if (
						["Food", "Fruit", "Spider"].includes(
							util.target.sprite.name
						)
					) {
						if (state.budget <= 0) return;
						state.budget--;
					}
					return original(args, util);
				});
				wrap("control_wait", (args, util, original) => {
					if (
						util.target.sprite.name === "Blade"
						&& Number(args.DURATION) === 1
						&& state.holdTimer
					) {
						util.yield();
						return;
					}
					const spawner
						= util.target.isOriginal
							&& ["Food", "Fruit", "Spider"].includes(
								util.target.sprite.name
							);
					return original(
						{ ...args, DURATION: spawner ? 0.05 : 0 },
						util
					);
				});
				wrap("motion_glidesecstoxy", (args, util, original) => {
					if (
						!util.target.isOriginal
						&& ["Food", "Fruit"].includes(util.target.sprite.name)
						&& state.freeze
					) {
						util.yield();
						return;
					}
					return original(args, util);
				});
				wrap("motion_movesteps", (args, util, original) => {
					if (
						project === "341945558"
						&& !util.target.isOriginal
						&& state.freeze
					) {
						util.yield();
						return;
					}
					return original(args, util);
				});
				wrap("sensing_touchingobject", (args, util, original) => {
					if (
						!util.target.isOriginal
						&& ["Food", "Fruit"].includes(util.target.sprite.name)
					) {
						return util.target.id === state.touching;
					}
					return original(args, util);
				});
				wrap("sensing_keypressed", (args, util, original) =>
					util.target.sprite.name === "Pal"
						? state.keys.includes(
								String(args.KEY_OPTION).toLowerCase()
							)
						: original(args, util));
				wrap("sensing_touchingcolor", (args, util, original) => {
					if (util.target.sprite.name !== "Pal")
						return original(args, util);
					const rawColor = String(args.COLOR).toLowerCase();
					const color = rawColor.startsWith("#")
						? rawColor
						: `#${
							(Number(args.COLOR) & 0xFFFFFF)
								.toString(16)
								.padStart(6, "0")}`;
					const y = util.target.y;
					if (state.mode === "pit") return color === "#79654a";
					return (
						color === "#00cc44"
						&& (y <= state.floor
							|| (state.mode === "ceiling" && y >= state.ceiling))
					);
				});
				wrap("operator_random", (args, util, original) => {
					if (
						project === "342645999"
						&& Number(args.FROM) === 1
						&& Number(args.TO) === 20
					) {
						state.picks++;
						return state.seed;
					}
					if (
						project === "348994271"
						&& util.target.sprite.name === "Fruit"
						&& Number(args.FROM) === 1
						&& Number(args.TO) === 10
					) {
						return state.picks++ % 2 === 0 ? 1 : 4;
					}
					return original(args, util);
				});
				if (project === "341945558") {
					wrap("pen_penUp", (args, util, original) => {
						state.penUp.add(util.target.id);
						return original(args, util);
					});
				}
				wrap("motion_goto", (args, util, original) => {
					if (
						project === "341945558"
						&& !util.target.isOriginal
						&& args.TO === "_random_"
					) {
						state.placements.push({
							id: util.target.id,
							penUp: state.penUp.has(util.target.id),
							direction: util.target.direction
						});
					}
					return original(args, util);
				});
				vm.stopAll();
				if (project === "357453262") {
					const player = actor("Player");
					const sizeId = "Ku;G(*g2d(Nh|wi(:5oZ-Player Size-";
					const phase = "classes-fish-round-state";
					const start = async () => {
						state.budget = 1;
						state.touching = "";
						vm.greenFlag();
						await wait(
							() =>
								value(phase) === "playing"
								&& Number(value(sizeId)) === 20
								&& player.x === 0
								&& player.y === 0
								&& clones("Food").length === 1,
							"Fish reset"
						);
					};
					progress.inProgress = "win and ended growth guard";
					await start();
					variable(sizeId).value = 200;
					player.setSize(200);
					broadcast("Ate Food");
					await wait(
						() =>
							value(phase) === "won"
							&& actor("Sprite2").visible
							&& actor("Sprite3").visible
							&& active().length === 0,
						"Fish win"
					);
					check(Number(value(sizeId)) === 205, "Fish winning size");
					const hats = broadcast("Ate Food");
					await wait(
						() => hats.every(t => !rt.isActiveThread(t)),
						"Ended growth handler"
					);
					check(
						Number(value(sizeId)) === 205,
						"Ended fish must not grow"
					);
					finish("win and ended growth guard", {
						size: Number(value(sizeId)),
						phase: value(phase),
						messagesVisible: true
					});
					progress.inProgress = "loss message order";
					await start();
					const food = clones("Food")[0];
					food.setSize(100);
					state.touching = food.id;
					await wait(
						() =>
							value(phase) === "lost"
							&& actor("Sprite1").visible
							&& actor("Sprite3").visible
							&& active().length === 0,
						"Fish loss"
					);
					check(!player.visible, "Lost player hides");
					finish("loss", {
						phase: value(phase),
						allMessagesVisibleBeforeStop: true
					});
					progress.inProgress = "restart after loss";
					player.setXY(120, -40);
					player.setVisible(false);
					await start();
					check(
						!actor("Sprite1").visible
						&& !actor("Sprite2").visible
						&& !actor("Sprite3").visible,
						"Restart hides endings"
					);
					finish("restart", {
						x: player.x,
						y: player.y,
						size: Number(value(sizeId)),
						phase: value(phase)
					});
				}
				else if (project === "343348430") {
					const pal = actor("Pal");
					state.mode = "floor";
					state.floor = -109;
					state.keys = [];
					vm.greenFlag();
					await wait(
						() => pal.x === -207 && pal.y === -109,
						"Level1 start"
					);
					progress.inProgress = "ceiling return";
					state.mode = "ceiling";
					state.ceiling = -79;
					state.keys = ["up arrow"];
					await wait(
						() =>
							Number(
								pal.lookupVariableById(
									"classes-pal-jump-blocked"
								).value
							) === 1,
						"Ceiling collision"
					);
					state.keys = [];
					await wait(() => pal.y === -109, "Return to ground");
					const x = pal.x;
					state.keys = ["right arrow"];
					await wait(
						() => pal.x > x,
						"Controller movement after ceiling"
					);
					state.keys = [];
					finish("ceiling returns to controller", {
						x: pal.x,
						y: pal.y
					});
					const originalXY = pal.setXY;
					pal.setXY = function (...args) {
						const result = originalXY.apply(this, args);
						if (this.y < -170) state.sawLow = true;
						if (
							state.spawn
							&& state.sawLow
							&& this.x === state.spawn.x
							&& this.y === state.spawn.y
						) {
							state.recovered = true;
							state.mode = "floor";
							state.floor = state.spawn.y;
						}
						return result;
					};
					restores.push(() => (pal.setXY = originalXY));
					for (const [message, x, y] of [
						["Level Two", -204, 37],
						["Level Three", -187, 13]
					]) {
						progress.inProgress = `${message} pitfall`;
						vm.stopAll();
						state.mode = "pit";
						state.sawLow = false;
						state.recovered = false;
						state.spawn = { x, y };
						broadcast(message);
						await wait(
							() => state.recovered && pal.x === x && pal.y === y,
							`${message} recovery`
						);
						const controllers = active().filter(
							t => t.target === pal
						);
						check(
							controllers.length === 1,
							`One level controller after ${message}`
						);
						finish(`${message} pitfall`, {
							x: pal.x,
							y: pal.y,
							activeControllers: controllers.length
						});
					}
				}
				else if (project === "348994271") {
					const timer = "0X*V_C]Q6ePKZ[W%dxkr";
					const score = "!g.Xe!-sR9Q8o0e2m;c+";
					const misses = "CJg!#vP~DGeJ,CsQpWi2";
					const start = async (budget) => {
						state.budget = budget;
						state.touching = "";
						state.holdTimer = true;
						state.picks = 0;
						vm.greenFlag();
						await wait(
							() =>
								Number(value(timer)) === 60
								&& !actor("Sprite1").visible,
							"Fruit reset"
						);
					};
					progress.inProgress = "independent clones and score";
					await start(2);
					await wait(
						() =>
							clones("Fruit").length === 2
							&& clones("Fruit").every(
								t =>
									[1, 2].includes(
										Number(
											t.lookupVariableById(
												"classes-fruit-kind"
											).value
										)
									)
									&& t.currentCostume
									=== Number(
										t.lookupVariableById(
											"classes-fruit-kind"
										).value
									)
									- 1
							),
						"Two fruit kinds"
					);
					const fruit = clones("Fruit").find(
						t =>
							Number(
								t.lookupVariableById("classes-fruit-kind")
									.value
							) === 1
					);
					const bomb = clones("Fruit").find(
						t =>
							Number(
								t.lookupVariableById("classes-fruit-kind")
									.value
							) === 2
					);
					check(!!fruit && !!bomb, "One fruit and one bomb");
					check(
						fruit.variables["classes-fruit-kind"]
						!== bomb.variables["classes-fruit-kind"],
						"Clone variables must differ"
					);
					check(
						fruit.currentCostume === 0 && bomb.currentCostume === 1,
						"Costume matches private kind"
					);
					state.touching = fruit.id;
					await wait(
						() =>
							Number(value(score)) === 1
							&& !rt.targets.includes(fruit),
						"Fruit slice"
					);
					check(
						rt.targets.includes(bomb),
						"Bomb remains independent"
					);
					finish("private clone kind and one score", {
						score: Number(value(score)),
						remainingBombKind:
							bomb.lookupVariableById("classes-fruit-kind").value
					});
					progress.inProgress = "bomb ending";
					state.touching = bomb.id;
					await wait(
						() => actor("Sprite1").visible && active().length === 0,
						"Bomb game over"
					);
					finish("bomb ending", { gameOver: true });
					progress.inProgress = "miss threshold";
					await start(0);
					variable(misses).value = 4;
					await wait(
						() => actor("Sprite1").visible && active().length === 0,
						"Miss threshold"
					);
					finish("miss threshold", {
						misses: Number(value(misses)),
						gameOver: true
					});
					progress.inProgress = "timeout";
					await start(0);
					state.holdTimer = false;
					await wait(
						() =>
							Number(value(timer)) === 0
							&& actor("Sprite1").visible
							&& active().length === 0,
						"Countdown ending"
					);
					finish("timeout", {
						secondsLeft: Number(value(timer)),
						gameOver: true,
						timingAccelerated: true
					});
				}
				else if (project === "341945558") {
					progress.inProgress = "private drawing clones";
					state.budget = 2;
					vm.greenFlag();
					await wait(
						() =>
							clones("Spider").length === 2
							&& clones("Spider").every(
								t =>
									Number(
										t.lookupVariableById(
											"classes-checkin-clone-side"
										).value
									) === 20
							),
						"Drawing clones"
					);
					const [first, second] = clones("Spider");
					first.lookupVariableById(
						"classes-checkin-clone-side"
					).value = 80;
					check(
						Number(
							second.lookupVariableById(
								"classes-checkin-clone-side"
							).value
						) === 20,
						"Clone side length stays independent"
					);
					check(
						state.placements.length === 2
						&& state.placements.every(
							p => p.penUp && p.direction === 90
						),
						"Pen up and heading before placement"
					);
					finish("independent clone lengths and drawing entry", {
						first: 80,
						second: 20,
						placements: state.placements
					});
				}
				else if (project === "342645999") {
					for (const number of [1, 9, 10, 20]) {
						progress.inProgress = `stored random ${number}`;
						vm.stopAll();
						state.seed = number;
						state.picks = 0;
						state.said = [];
						const threads = rt.startHats("event_whenkeypressed", {
							KEY_OPTION: "2"
						});
						check(threads.length === 1, "One math handler");
						await wait(
							() => threads.every(t => !rt.isActiveThread(t)),
							"Stored random handler"
						);
						check(
							state.picks === 1
							&& Number(
								value("classes-checkin-random-number")
							) === number,
							"One saved random draw"
						);
						check(
							JSON.stringify(state.said)
							=== JSON.stringify([
								"11",
								number < 10
									? "Wow, that's a small number!"
									: "Whoa, that's a big number!",
								"The remainder of dividing 11 by 2 is: 1"
							]),
							"Math output"
						);
						finish(`stored random ${number}`, {
							stored: number,
							draws: state.picks,
							said: [...state.said]
						});
					}
				}
				else {
					throw new Error(`Unexpected repaired game ${project}`);
				}
				delete progress.inProgress;
				return { cases: progress.cases, complete: true };
			}
			finally {
				vm.stopAll();
				for (const restore of restores) restore();
				for (const [op, original] of originals)
					primitives[op] = original;
			}
		}, project);
		const expected = {
			357453262: 3,
			343348430: 3,
			348994271: 4,
			341945558: 1,
			342645999: 4
		};
		assert.equal(result.cases.length, expected[project]);
		Object.assign(record, result);
		return record;
	}
	catch (error) {
		record.failure = String(error);
		record.partial = await frame
			.evaluate(() => window.__courseGameStateProgress)
			.catch(() => null);
		throw error;
	}
	finally {
		await retain();
	}
}
