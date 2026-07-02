import type { PythonIdeFile, PythonIdeMode } from "@/modules/pythonIde";
import { isPythonIdeJavaFile } from "@/modules/pythonIde";

export type KarelDirection = "North" | "East" | "South" | "West";
export type KarelWallSide = "north" | "east" | "south" | "west";

export interface KarelRobotState {
	avenue: number;
	beepers: number;
	direction: KarelDirection;
	name: string;
	street: number;
}

export interface KarelBeeperState {
	avenue: number;
	count: number;
	street: number;
}

export interface KarelWallState {
	avenue: number;
	side: KarelWallSide;
	street: number;
}

export interface KarelWorldState {
	beepers: KarelBeeperState[];
	cols: number;
	robot: KarelRobotState | null;
	rows: number;
	trace: string[];
	walls: KarelWallState[];
}

interface JavaIdeRunOptions {
	activeFileName: string;
	files: PythonIdeFile[];
	mode: Extract<PythonIdeMode, "java" | "karel">;
}

interface JavaIdeRunResult {
	karelWorld?: KarelWorldState;
	stderr: string[];
	stdout: string[];
}

interface MutableKarelWorld {
	beepers: Map<string, KarelBeeperState>;
	cols: number;
	rows: number;
	walls: KarelWallState[];
}

interface JavaMethodDefinition {
	body: string;
	name: string;
	parameters: string[];
}

interface KarelCommandPlan {
	commands: KarelCommand[];
	warnings: string[];
}

interface KarelPreviewExecution {
	robot: KarelRobotState;
	stopped: boolean;
	world: MutableKarelWorld;
}

interface JavaForLoopIterations {
	capped: boolean;
	count: number;
}

const DEFAULT_WORLD_SIZE = 10;
const MAX_KAREL_PREVIEW_COMMANDS = 500;
const JAVA_PRINT_RE = /System\.out\.(print|println)\s*\(([\s\S]*?)\)\s*;/g;
const ROBOT_DECLARATION_RE =
	/\bUrRobot\s+([A-Z_]\w*)\s*=\s*new\s+UrRobot\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*([A-Z_]\w*)\s*,\s*(\d+)\s*\)/i;
const WORLD_READ_RE = /\bWorld\.readWorld\s*\(\s*"([^"]+)"\s*\)/;
const KAREL_COMMANDS = [
	"move",
	"turnLeft",
	"turnRight",
	"turnAround",
	"putBeeper",
	"pickBeeper",
	"putBall",
	"takeBall"
] as const;
type KarelCommand =
	| "move"
	| "pickBeeper"
	| "putBeeper"
	| "turnAround"
	| "turnLeft"
	| "turnRight";
const KAREL_COMMAND_ALIASES = {
	move: "move",
	pickBeeper: "pickBeeper",
	putBeeper: "putBeeper",
	putBall: "putBeeper",
	takeBall: "pickBeeper",
	turnAround: "turnAround",
	turnLeft: "turnLeft",
	turnRight: "turnRight"
} satisfies Record<(typeof KAREL_COMMANDS)[number], KarelCommand>;
const directionOrder: KarelDirection[] = ["North", "East", "South", "West"];
const wallOpposites: Record<KarelWallSide, KarelWallSide> = {
	east: "west",
	north: "south",
	south: "north",
	west: "east"
};
const karelFacingConditions: Record<string, KarelDirection> = {
	facingEast: "East",
	facingNorth: "North",
	facingSouth: "South",
	facingWest: "West",
	notFacingEast: "East",
	notFacingNorth: "North",
	notFacingSouth: "South",
	notFacingWest: "West"
};

export function runJavaIdeProject(
	options: JavaIdeRunOptions
): JavaIdeRunResult {
	const activeFile = getActiveJavaFile(options);
	if (!activeFile) {
		return {
			stderr: ["Add a .java file before running this project."],
			stdout: []
		};
	}

	return options.mode === "karel"
		? runKarelProject(options.files, activeFile)
		: runConsoleJavaProject(activeFile);
}

function getActiveJavaFile(options: JavaIdeRunOptions) {
	return (
		options.files.find(
			file =>
				file.name === options.activeFileName &&
				isPythonIdeJavaFile(file.name)
		) ?? options.files.find(file => isPythonIdeJavaFile(file.name))
	);
}

function runConsoleJavaProject(file: PythonIdeFile): JavaIdeRunResult {
	const stdout = javaPrintOutput(stripJavaComments(file.content));
	return {
		stderr: stdout.length
			? []
			: [
					"The browser Java runner can preview System.out.print and System.out.println output."
				],
		stdout
	};
}

function javaPrintOutput(source: string) {
	const outputLines: string[] = [];
	let pendingLine = "";
	for (const match of source.matchAll(JAVA_PRINT_RE)) {
		const method = match[1];
		const expression = match[2] ?? "";
		const value = evaluateJavaPrintExpression(expression);
		if (method === "print") {
			pendingLine += value;
			continue;
		}

		outputLines.push(`${pendingLine}${value}`);
		pendingLine = "";
	}

	if (pendingLine) outputLines.push(pendingLine);
	return outputLines;
}

function evaluateJavaPrintExpression(expression: string): string {
	const trimmed = expression.trim();
	if (!trimmed) return "";

	const parts = splitJavaConcat(trimmed);
	if (parts.length > 1)
		return parts.map(part => evaluateJavaPrintExpression(part)).join("");

	if (/^"(?:\\.|[^"\\])*"$/.test(trimmed))
		return unescapeJavaString(trimmed.slice(1, -1));
	if (/^'(?:\\.|[^'\\])'$/.test(trimmed))
		return unescapeJavaString(trimmed.slice(1, -1));
	if (/^(?:true|false|null)$/i.test(trimmed)) return trimmed.toLowerCase();
	if (/^[\d\s+\-*/%().]+$/.test(trimmed)) {
		const value = evaluateNumericExpression(trimmed);
		if (value !== null) return value;
	}

	return trimmed;
}

function evaluateNumericExpression(expression: string) {
	const tokens = expression.match(/\d+(?:\.\d+)?|[()+\-*/%]/g);
	if (!tokens || tokens.join("") !== expression.replace(/\s+/g, ""))
		return null;
	let index = 0;

	const parser = {
		parseExpression(): number {
			let value = parser.parseTerm();
			while (tokens[index] === "+" || tokens[index] === "-") {
				const operator = tokens[index];
				index += 1;
				const nextValue = parser.parseTerm();
				value =
					operator === "+" ? value + nextValue : value - nextValue;
			}
			return value;
		},
		parseFactor(): number {
			const token = tokens[index];
			if (token === "+" || token === "-") {
				index += 1;
				const value = parser.parseFactor();
				return token === "-" ? -value : value;
			}
			if (token === "(") {
				index += 1;
				const value = parser.parseExpression();
				if (tokens[index] !== ")")
					throw new Error("Missing closing paren");
				index += 1;
				return value;
			}
			index += 1;
			const value = Number(token);
			if (!Number.isFinite(value)) throw new Error("Invalid number");
			return value;
		},
		parseTerm(): number {
			let value = parser.parseFactor();
			while (
				tokens[index] === "*" ||
				tokens[index] === "/" ||
				tokens[index] === "%"
			) {
				const operator = tokens[index];
				index += 1;
				const nextValue = parser.parseFactor();
				if (operator === "*") value *= nextValue;
				if (operator === "/") value /= nextValue;
				if (operator === "%") value %= nextValue;
			}
			return value;
		}
	};

	try {
		const value = parser.parseExpression();
		if (index !== tokens.length || !Number.isFinite(value)) return null;
		return String(value);
	} catch {
		return null;
	}
}

function splitJavaConcat(expression: string) {
	const parts: string[] = [];
	let quote: '"' | "'" | null = null;
	let start = 0;
	let escaped = false;
	let parenDepth = 0;

	for (let index = 0; index < expression.length; index += 1) {
		const character = expression[index];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === "(") {
			parenDepth += 1;
			continue;
		}
		if (character === ")") {
			parenDepth = Math.max(0, parenDepth - 1);
			continue;
		}
		if (character !== "+" || parenDepth > 0) continue;
		parts.push(expression.slice(start, index).trim());
		start = index + 1;
	}

	parts.push(expression.slice(start).trim());
	return parts.filter(Boolean);
}

function unescapeJavaString(value: string) {
	return value
		.replaceAll("\\n", "\n")
		.replaceAll("\\t", "\t")
		.replaceAll("\\r", "\r")
		.replaceAll('\\"', '"')
		.replaceAll("\\'", "'")
		.replaceAll("\\\\", "\\");
}

function runKarelProject(
	files: PythonIdeFile[],
	activeFile: PythonIdeFile
): JavaIdeRunResult {
	const source = stripJavaComments(activeFile.content);
	const declaration = source.match(ROBOT_DECLARATION_RE);
	const world = parseKarelWorld(files, source);
	const stderr: string[] = [];
	const trace: string[] = [];

	const robot: KarelRobotState = {
		name: declaration?.[1] ?? "karel",
		street: Number(declaration?.[2] ?? 1),
		avenue: Number(declaration?.[3] ?? 1),
		direction: normalizeDirection(declaration?.[4] ?? "East"),
		beepers: Number(declaration?.[5] ?? MAX_KAREL_PREVIEW_COMMANDS)
	};
	clampRobotToWorld(robot, world);

	const previewExecution: KarelPreviewExecution = {
		robot: cloneKarelRobot(robot),
		stopped: false,
		world: cloneMutableKarelWorld(world)
	};
	const plan = karelCommandsForRobot(source, robot.name, previewExecution);
	if (!declaration && !plan.commands.length) {
		const karelWorld = serializeKarelWorld(world, null, trace);
		return {
			karelWorld,
			stderr: [
				"Create a Karel robot with new UrRobot(street, avenue, Direction, beepers), or write CodeHS-style Karel commands in main() or run()."
			],
			stdout: []
		};
	}

	trace.push(formatRobotTrace(robot));
	for (const command of plan.commands) {
		const error = applyKarelCommand(world, robot, command);
		trace.push(formatRobotTrace(robot));
		if (!error) continue;
		stderr.push(error);
		break;
	}
	stderr.push(...plan.warnings);

	return {
		karelWorld: serializeKarelWorld(world, robot, trace),
		stderr,
		stdout: trace
	};
}

function stripJavaComments(source: string) {
	let output = "";
	let index = 0;
	let quote: '"' | "'" | null = null;
	let escaped = false;

	while (index < source.length) {
		const character = source[index] ?? "";
		const nextCharacter = source[index + 1] ?? "";

		if (quote) {
			output += character;
			if (escaped) {
				escaped = false;
			} else if (character === "\\") {
				escaped = true;
			} else if (character === quote) {
				quote = null;
			}
			index += 1;
			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			output += character;
			index += 1;
			continue;
		}

		if (character === "/" && nextCharacter === "/") {
			index += 2;
			while (index < source.length && !/[\r\n]/.test(source[index] ?? ""))
				index += 1;
			continue;
		}

		if (character === "/" && nextCharacter === "*") {
			index += 2;
			while (index < source.length) {
				const blockCharacter = source[index] ?? "";
				if (blockCharacter === "\n") output += "\n";
				if (
					blockCharacter === "*" &&
					(source[index + 1] ?? "") === "/"
				) {
					index += 2;
					break;
				}
				index += 1;
			}
			continue;
		}

		output += character;
		index += 1;
	}

	return output;
}

function parseKarelWorld(files: PythonIdeFile[], source: string) {
	const readWorldFileName = source.match(WORLD_READ_RE)?.[1] ?? "world.txt";
	const worldFile = files.find(file => file.name === readWorldFileName);
	const world: MutableKarelWorld = {
		beepers: new Map(),
		cols: DEFAULT_WORLD_SIZE,
		rows: DEFAULT_WORLD_SIZE,
		walls: []
	};
	if (!worldFile) return world;

	for (const rawLine of worldFile.content.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;

		const [command = "", ...args] = line.split(/\s+/);
		if (command === "rows")
			world.rows = positiveInteger(args[0], world.rows);
		if (command === "cols")
			world.cols = positiveInteger(args[0], world.cols);
		if (line.startsWith("rows="))
			world.rows = positiveInteger(line.split("=", 2)[1], world.rows);
		if (line.startsWith("cols="))
			world.cols = positiveInteger(line.split("=", 2)[1], world.cols);
		if (command === "beeper") {
			const street = positiveInteger(args[0], 1);
			const avenue = positiveInteger(args[1], 1);
			const count = positiveInteger(args[2], 1);
			world.beepers.set(beeperKey(street, avenue), {
				avenue,
				count,
				street
			});
		}
		if (command === "wall") {
			const street = positiveInteger(args[0], 1);
			const avenue = positiveInteger(args[1], 1);
			const side = normalizeWallSide(args[2]);
			if (side) world.walls.push({ avenue, side, street });
		}
	}

	return world;
}

function positiveInteger(value: string | undefined, fallback: number) {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeDirection(value: string): KarelDirection {
	const normalized = value.toLowerCase();
	if (normalized === "north") return "North";
	if (normalized === "south") return "South";
	if (normalized === "west") return "West";
	return "East";
}

function normalizeWallSide(value: string | undefined): KarelWallSide | null {
	const normalized = value?.toLowerCase();
	if (
		normalized === "north" ||
		normalized === "east" ||
		normalized === "south" ||
		normalized === "west"
	) {
		return normalized;
	}
	return null;
}

function clampRobotToWorld(robot: KarelRobotState, world: MutableKarelWorld) {
	robot.street = Math.min(Math.max(robot.street, 1), world.rows);
	robot.avenue = Math.min(Math.max(robot.avenue, 1), world.cols);
}

function cloneKarelRobot(robot: KarelRobotState): KarelRobotState {
	return { ...robot };
}

function cloneMutableKarelWorld(world: MutableKarelWorld): MutableKarelWorld {
	return {
		beepers: new Map(
			[...world.beepers.entries()].map(([key, beeper]) => [
				key,
				{ ...beeper }
			])
		),
		cols: world.cols,
		rows: world.rows,
		walls: world.walls.map(wall => ({ ...wall }))
	};
}

function karelCommandsForRobot(
	source: string,
	robotName: string,
	execution: KarelPreviewExecution
) {
	const methods = parseJavaVoidMethods(source);
	const mainBody =
		methods.get("main")?.body ?? methods.get("run")?.body ?? source;
	const plan: KarelCommandPlan = { commands: [], warnings: [] };
	collectKarelCommandsFromBody(
		mainBody,
		methods,
		new Set([robotName]),
		plan,
		execution
	);
	return plan;
}

function parseJavaVoidMethods(source: string) {
	const methods = new Map<string, JavaMethodDefinition>();
	const methodPattern =
		/\b(?:public|private|protected|static|final|\s)*void\s+([A-Z_]\w*)\s*\(([^)]*)\)\s*\{/gi;
	for (const match of source.matchAll(methodPattern)) {
		const name = match[1];
		if (!name) continue;
		const openingBrace = (match.index ?? 0) + match[0].length - 1;
		const closingBrace = findMatchingDelimiter(
			source,
			openingBrace,
			"{",
			"}"
		);
		if (closingBrace < 0) continue;
		methods.set(name, {
			body: source.slice(openingBrace + 1, closingBrace),
			name,
			parameters: parseJavaParameterNames(match[2] ?? "")
		});
	}
	return methods;
}

function parseJavaParameterNames(parameters: string) {
	return splitJavaArguments(parameters)
		.map(
			parameter => parameter.match(/\b([A-Z_]\w*)\s*(?:\[\s*\])?$/i)?.[1]
		)
		.filter((parameter): parameter is string => Boolean(parameter));
}

function collectKarelCommandsFromBody(
	body: string,
	methods: Map<string, JavaMethodDefinition>,
	robotAliases: Set<string>,
	plan: KarelCommandPlan,
	execution: KarelPreviewExecution,
	depth = 0
) {
	if (depth > 20) {
		addKarelWarning(
			plan,
			"Stopped Karel preview after nested helper calls."
		);
		return;
	}

	let index = 0;
	while (
		index < body.length &&
		canAddKarelCommand(plan) &&
		!execution.stopped
	) {
		index = skipWhitespace(body, index);
		if (index >= body.length) break;

		if (wordAt(body, index, "if")) {
			const parsedIf = parseJavaIfStatement(body, index);
			if (parsedIf) {
				const branchBody = evaluateKarelCondition(
					parsedIf.condition,
					execution
				)
					? parsedIf.body
					: parsedIf.elseBody;
				if (branchBody) {
					collectKarelCommandsFromBody(
						branchBody,
						methods,
						robotAliases,
						plan,
						execution,
						depth + 1
					);
				}
				index = parsedIf.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "while")) {
			const parsedLoop = parseJavaConditionalLoop(body, index);
			if (parsedLoop) {
				let loopCount = 0;
				let previousCommandCount = plan.commands.length;
				while (
					evaluateKarelCondition(parsedLoop.condition, execution) &&
					canAddKarelCommand(plan) &&
					!execution.stopped
				) {
					collectKarelCommandsFromBody(
						parsedLoop.body,
						methods,
						robotAliases,
						plan,
						execution,
						depth + 1
					);
					loopCount += 1;
					if (plan.commands.length === previousCommandCount) {
						addKarelWarning(
							plan,
							"Stopped Karel preview after a while loop made no visible progress."
						);
						break;
					}
					previousCommandCount = plan.commands.length;
					if (loopCount >= MAX_KAREL_PREVIEW_COMMANDS) {
						addKarelWarning(
							plan,
							`Stopped Karel preview after ${MAX_KAREL_PREVIEW_COMMANDS} loop iterations.`
						);
						break;
					}
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "for")) {
			const parsedLoop = parseJavaForLoop(body, index);
			if (parsedLoop) {
				for (
					let count = 0;
					count < parsedLoop.iterations && canAddKarelCommand(plan);
					count += 1
				) {
					collectKarelCommandsFromBody(
						parsedLoop.body,
						methods,
						robotAliases,
						plan,
						execution,
						depth + 1
					);
				}
				if (
					parsedLoop.capped &&
					plan.commands.length >= MAX_KAREL_PREVIEW_COMMANDS
				) {
					addKarelWarning(
						plan,
						`Stopped Karel preview after ${MAX_KAREL_PREVIEW_COMMANDS} commands.`
					);
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (body[index] === "{") {
			const closingBrace = findMatchingDelimiter(body, index, "{", "}");
			if (closingBrace < 0) break;
			collectKarelCommandsFromBody(
				body.slice(index + 1, closingBrace),
				methods,
				robotAliases,
				plan,
				execution,
				depth + 1
			);
			index = closingBrace + 1;
			continue;
		}

		const statementEnd = findJavaStatementEnd(body, index);
		if (statementEnd < 0) break;
		collectKarelCommandsFromStatement(
			body.slice(index, statementEnd).trim(),
			methods,
			robotAliases,
			plan,
			execution,
			depth
		);
		index = statementEnd + 1;
	}
}

function collectKarelCommandsFromStatement(
	statement: string,
	methods: Map<string, JavaMethodDefinition>,
	robotAliases: Set<string>,
	plan: KarelCommandPlan,
	execution: KarelPreviewExecution,
	depth: number
) {
	const commandMatch = statement.match(
		new RegExp(
			`^([A-Z_]\\w*)\\.(${KAREL_COMMANDS.join("|")})\\s*\\(\\s*\\)$`,
			"i"
		)
	);
	if (commandMatch) {
		if (robotAliases.has(commandMatch[1] ?? "")) {
			const command = karelCommandForName(commandMatch[2] ?? "");
			if (command) addKarelCommand(plan, command, execution);
		}
		return;
	}

	const methodCall = statement.match(/^([A-Z_]\w*)\s*\(([\s\S]*)\)$/i);
	const methodName = methodCall?.[1];
	const method = methodName ? methods.get(methodName) : null;
	if (!methodCall) return;

	if (!method && methodName && !methodCall[2]?.trim()) {
		const command = karelCommandForName(methodName);
		if (command) addKarelCommand(plan, command, execution);
		return;
	}

	if (!method) return;

	const args = splitJavaArguments(methodCall[2] ?? "");
	const nextAliases = new Set(robotAliases);
	method.parameters.forEach((parameter, parameterIndex) => {
		const arg = args[parameterIndex]?.trim();
		if (arg && robotAliases.has(arg)) nextAliases.add(parameter);
	});
	collectKarelCommandsFromBody(
		method.body,
		methods,
		nextAliases,
		plan,
		execution,
		depth + 1
	);
}

function parseJavaIfStatement(source: string, start: number) {
	const parenStart = skipWhitespace(source, start + 2);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;

	let nextIndex = parsedBody.nextIndex;
	let elseBody = "";
	const elseStart = skipWhitespace(source, nextIndex);
	if (wordAt(source, elseStart, "else")) {
		const elseBodyStart = skipWhitespace(source, elseStart + 4);
		if (wordAt(source, elseBodyStart, "if")) {
			const parsedElseIf = parseJavaIfStatement(source, elseBodyStart);
			if (parsedElseIf) {
				elseBody = source.slice(elseBodyStart, parsedElseIf.nextIndex);
				nextIndex = parsedElseIf.nextIndex;
			}
		} else {
			const parsedElseBody = parseJavaControlBody(source, elseBodyStart);
			if (parsedElseBody) {
				elseBody = parsedElseBody.body;
				nextIndex = parsedElseBody.nextIndex;
			}
		}
	}

	return {
		body: parsedBody.body,
		condition: source.slice(parenStart + 1, parenEnd),
		elseBody,
		nextIndex
	};
}

function parseJavaConditionalLoop(source: string, start: number) {
	const parenStart = skipWhitespace(source, start + 5);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;
	return {
		body: parsedBody.body,
		condition: source.slice(parenStart + 1, parenEnd),
		nextIndex: parsedBody.nextIndex
	};
}

function parseJavaForLoop(source: string, start: number) {
	const parenStart = skipWhitespace(source, start + 3);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const iterations = evaluateSimpleForLoopIterations(
		source.slice(parenStart + 1, parenEnd)
	);
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;
	return {
		body: parsedBody.body,
		capped: iterations.capped,
		iterations: iterations.count,
		nextIndex: parsedBody.nextIndex
	};
}

function parseJavaControlBody(source: string, start: number) {
	if (source[start] === "{") {
		const end = findMatchingDelimiter(source, start, "{", "}");
		if (end < 0) return null;
		return { body: source.slice(start + 1, end), nextIndex: end + 1 };
	}

	const end = findJavaStatementEnd(source, start);
	if (end < 0) return null;
	return { body: source.slice(start, end + 1), nextIndex: end + 1 };
}

function evaluateKarelCondition(
	condition: string,
	execution: KarelPreviewExecution
): boolean {
	const trimmed = condition.trim().replace(/\s+/g, "");
	if (trimmed.startsWith("!"))
		return !evaluateKarelCondition(trimmed.slice(1), execution);

	const conditionName = trimmed.match(/^([A-Z_]\w*)\(\)$/i)?.[1];
	if (!conditionName) return false;

	if (conditionName === "frontIsClear")
		return karelDirectionIsClear(execution, execution.robot.direction);
	if (conditionName === "frontIsBlocked")
		return !karelDirectionIsClear(execution, execution.robot.direction);
	if (conditionName === "leftIsClear") {
		return karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, -1)
		);
	}
	if (conditionName === "leftIsBlocked") {
		return !karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, -1)
		);
	}
	if (conditionName === "rightIsClear") {
		return karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, 1)
		);
	}
	if (conditionName === "rightIsBlocked") {
		return !karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, 1)
		);
	}
	const facingDirection = karelFacingConditions[conditionName];
	if (facingDirection) {
		return conditionName.startsWith("not")
			? execution.robot.direction !== facingDirection
			: execution.robot.direction === facingDirection;
	}
	if (
		conditionName === "ballsPresent" ||
		conditionName === "beepersPresent"
	) {
		return karelBeepersAtRobot(execution) > 0;
	}
	if (
		conditionName === "noBallsPresent" ||
		conditionName === "noBeepersPresent"
	) {
		return karelBeepersAtRobot(execution) <= 0;
	}

	return false;
}

function karelDirectionIsClear(
	execution: KarelPreviewExecution,
	direction: KarelDirection
) {
	const robot = { ...execution.robot, direction };
	const next = nextKarelPosition(robot);
	return (
		next.street >= 1 &&
		next.street <= execution.world.rows &&
		next.avenue >= 1 &&
		next.avenue <= execution.world.cols &&
		!hasWallBetween(
			execution.world,
			execution.robot.street,
			execution.robot.avenue,
			sideForDirection(direction)
		)
	);
}

function karelBeepersAtRobot(execution: KarelPreviewExecution) {
	return (
		execution.world.beepers.get(
			beeperKey(execution.robot.street, execution.robot.avenue)
		)?.count ?? 0
	);
}

function evaluateSimpleForLoopIterations(
	header: string
): JavaForLoopIterations {
	const match = header.match(
		/^\s*(?:int\s+)?([A-Z_]\w*)\s*=\s*(-?\d+)\s*;\s*\1\s*(<=|<|>=|>)\s*(-?\d+)\s*;\s*(\+\+\1|\1\+\+|--\1|\1--|\1\s*(\+=|-=)\s*(\d+))\s*$/i
	);
	if (!match) return { capped: false, count: 0 };

	const start = Number(match[2]);
	const operator = match[3] ?? "<";
	const end = Number(match[4]);
	const updateExpression = match[5] ?? "";
	const compoundOperator = match[6];
	const compoundStep = Number(match[7] ?? 1);
	const step =
		compoundOperator === "+="
			? compoundStep
			: compoundOperator === "-="
				? -compoundStep
				: updateExpression.includes("--")
					? -1
					: 1;
	if (!Number.isFinite(step) || step === 0)
		return { capped: false, count: 0 };

	let count = 0;
	let value = start;
	while (forLoopConditionIsTrue(value, operator, end)) {
		if (count >= MAX_KAREL_PREVIEW_COMMANDS) return { capped: true, count };
		count += 1;
		value += step;
	}
	return { capped: false, count };
}

function forLoopConditionIsTrue(value: number, operator: string, end: number) {
	if (operator === "<") return value < end;
	if (operator === "<=") return value <= end;
	if (operator === ">") return value > end;
	return value >= end;
}

function findJavaStatementEnd(source: string, start: number) {
	let quote: '"' | "'" | null = null;
	let escaped = false;
	let parenDepth = 0;
	for (let index = start; index < source.length; index += 1) {
		const character = source[index] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === "(") parenDepth += 1;
		if (character === ")") parenDepth = Math.max(0, parenDepth - 1);
		if (character === ";" && parenDepth === 0) return index;
	}
	return -1;
}

function findMatchingDelimiter(
	source: string,
	start: number,
	open: "(" | "{",
	close: ")" | "}"
) {
	let depth = 0;
	let quote: '"' | "'" | null = null;
	let escaped = false;
	for (let index = start; index < source.length; index += 1) {
		const character = source[index] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === open) depth += 1;
		if (character === close) {
			depth -= 1;
			if (depth === 0) return index;
		}
	}
	return -1;
}

function splitJavaArguments(args: string) {
	const parts: string[] = [];
	let quote: '"' | "'" | null = null;
	let start = 0;
	let escaped = false;
	let parenDepth = 0;
	for (let index = 0; index < args.length; index += 1) {
		const character = args[index] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === "(") parenDepth += 1;
		if (character === ")") parenDepth = Math.max(0, parenDepth - 1);
		if (character !== "," || parenDepth > 0) continue;
		parts.push(args.slice(start, index).trim());
		start = index + 1;
	}
	const last = args.slice(start).trim();
	if (last) parts.push(last);
	return parts;
}

function wordAt(source: string, index: number, word: string) {
	return (
		source.slice(index, index + word.length) === word &&
		!/\w/.test(source[index - 1] ?? "") &&
		!/\w/.test(source[index + word.length] ?? "")
	);
}

function skipWhitespace(source: string, index: number) {
	let cursor = index;
	while (cursor < source.length && /\s/.test(source[cursor] ?? ""))
		cursor += 1;
	return cursor;
}

function canAddKarelCommand(plan: KarelCommandPlan) {
	if (plan.commands.length < MAX_KAREL_PREVIEW_COMMANDS) return true;
	addKarelWarning(
		plan,
		`Stopped Karel preview after ${MAX_KAREL_PREVIEW_COMMANDS} commands.`
	);
	return false;
}

function addKarelCommand(
	plan: KarelCommandPlan,
	command: KarelCommand,
	execution?: KarelPreviewExecution
) {
	if (!canAddKarelCommand(plan)) return;
	plan.commands.push(command);
	if (!execution || execution.stopped) return;
	const error = applyKarelCommand(execution.world, execution.robot, command);
	if (error) execution.stopped = true;
}

function addKarelWarning(plan: KarelCommandPlan, warning: string) {
	if (!plan.warnings.includes(warning)) plan.warnings.push(warning);
}

function karelCommandForName(name: string): KarelCommand | null {
	return (
		KAREL_COMMAND_ALIASES[name as (typeof KAREL_COMMANDS)[number]] ?? null
	);
}

function applyKarelCommand(
	world: MutableKarelWorld,
	robot: KarelRobotState,
	command: KarelCommand
) {
	if (command === "turnLeft") {
		robot.direction = turnRobot(robot.direction, -1);
		return "";
	}
	if (command === "turnRight") {
		robot.direction = turnRobot(robot.direction, 1);
		return "";
	}
	if (command === "turnAround") {
		robot.direction = turnRobot(robot.direction, 2);
		return "";
	}
	if (command === "putBeeper") return putBeeper(world, robot);
	if (command === "pickBeeper") return pickBeeper(world, robot);
	return moveRobot(world, robot);
}

function turnRobot(direction: KarelDirection, step: number) {
	const index = directionOrder.indexOf(direction);
	return (
		directionOrder[
			(index + step + directionOrder.length) % directionOrder.length
		] ?? "East"
	);
}

function moveRobot(world: MutableKarelWorld, robot: KarelRobotState) {
	const side = sideForDirection(robot.direction);
	const next = nextKarelPosition(robot);
	if (
		next.street < 1 ||
		next.street > world.rows ||
		next.avenue < 1 ||
		next.avenue > world.cols
	) {
		return `${robot.name}.move() hit the edge of the world.`;
	}
	if (hasWallBetween(world, robot.street, robot.avenue, side)) {
		return `${robot.name}.move() hit a wall.`;
	}

	robot.street = next.street;
	robot.avenue = next.avenue;
	return "";
}

function sideForDirection(direction: KarelDirection): KarelWallSide {
	if (direction === "North") return "north";
	if (direction === "South") return "south";
	if (direction === "West") return "west";
	return "east";
}

function nextKarelPosition(robot: KarelRobotState) {
	if (robot.direction === "North") {
		return { avenue: robot.avenue, street: robot.street + 1 };
	}
	if (robot.direction === "South") {
		return { avenue: robot.avenue, street: robot.street - 1 };
	}
	if (robot.direction === "West") {
		return { avenue: robot.avenue - 1, street: robot.street };
	}
	return { avenue: robot.avenue + 1, street: robot.street };
}

function hasWallBetween(
	world: MutableKarelWorld,
	street: number,
	avenue: number,
	side: KarelWallSide
) {
	const adjacent = nextKarelPosition({
		avenue,
		beepers: 0,
		direction: directionForSide(side),
		name: "",
		street
	});
	const opposite = wallOpposites[side];
	return world.walls.some(
		wall =>
			(wall.street === street &&
				wall.avenue === avenue &&
				wall.side === side) ||
			(wall.street === adjacent.street &&
				wall.avenue === adjacent.avenue &&
				wall.side === opposite)
	);
}

function directionForSide(side: KarelWallSide): KarelDirection {
	if (side === "north") return "North";
	if (side === "south") return "South";
	if (side === "west") return "West";
	return "East";
}

function putBeeper(world: MutableKarelWorld, robot: KarelRobotState) {
	if (robot.beepers <= 0) {
		return `${robot.name}.putBeeper() needs at least one beeper.`;
	}
	const key = beeperKey(robot.street, robot.avenue);
	const beeper = world.beepers.get(key) ?? {
		avenue: robot.avenue,
		count: 0,
		street: robot.street
	};
	beeper.count += 1;
	world.beepers.set(key, beeper);
	robot.beepers -= 1;
	return "";
}

function pickBeeper(world: MutableKarelWorld, robot: KarelRobotState) {
	const key = beeperKey(robot.street, robot.avenue);
	const beeper = world.beepers.get(key);
	if (!beeper || beeper.count <= 0) {
		return `${robot.name}.pickBeeper() needs a beeper on this corner.`;
	}
	beeper.count -= 1;
	if (beeper.count <= 0) world.beepers.delete(key);
	robot.beepers += 1;
	return "";
}

function beeperKey(street: number, avenue: number) {
	return `${street}:${avenue}`;
}

function serializeKarelWorld(
	world: MutableKarelWorld,
	robot: KarelRobotState | null,
	trace: string[]
): KarelWorldState {
	return {
		beepers: [...world.beepers.values()].sort(
			(a, b) => a.street - b.street || a.avenue - b.avenue
		),
		cols: world.cols,
		robot,
		rows: world.rows,
		trace,
		walls: world.walls
	};
}

function formatRobotTrace(robot: KarelRobotState) {
	return `Robot ${robot.name} at (street: ${robot.street}) (avenue: ${robot.avenue}) (beepers: ${robot.beepers}) (direction: ${robot.direction})`;
}
