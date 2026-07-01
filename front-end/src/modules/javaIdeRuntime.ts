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

const DEFAULT_WORLD_SIZE = 10;
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
	"pickBeeper"
] as const;
const directionOrder: KarelDirection[] = ["North", "East", "South", "West"];
const wallOpposites: Record<KarelWallSide, KarelWallSide> = {
	east: "west",
	north: "south",
	south: "north",
	west: "east"
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

	if (!declaration) {
		const karelWorld = serializeKarelWorld(world, null, trace);
		return {
			karelWorld,
			stderr: [
				"Create a Karel robot with new UrRobot(street, avenue, Direction, beepers)."
			],
			stdout: []
		};
	}

	const robot: KarelRobotState = {
		name: declaration[1] ?? "robot",
		street: Number(declaration[2] ?? 1),
		avenue: Number(declaration[3] ?? 1),
		direction: normalizeDirection(declaration[4] ?? "East"),
		beepers: Number(declaration[5] ?? 0)
	};
	clampRobotToWorld(robot, world);
	trace.push(formatRobotTrace(robot));

	for (const command of karelCommandsForRobot(source, robot.name)) {
		const error = applyKarelCommand(world, robot, command);
		trace.push(formatRobotTrace(robot));
		if (!error) continue;
		stderr.push(error);
		break;
	}

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

function karelCommandsForRobot(source: string, robotName: string) {
	const commandPattern = new RegExp(
		`\\b${escapeRegExp(robotName)}\\.(${KAREL_COMMANDS.join("|")})\\s*\\(\\s*\\)\\s*;`,
		"g"
	);
	return [...source.matchAll(commandPattern)].map(
		match => match[1] as (typeof KAREL_COMMANDS)[number]
	);
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyKarelCommand(
	world: MutableKarelWorld,
	robot: KarelRobotState,
	command: (typeof KAREL_COMMANDS)[number]
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
