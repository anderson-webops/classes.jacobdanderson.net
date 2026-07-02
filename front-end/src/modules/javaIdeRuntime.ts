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
	inputText?: string;
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
	returnType: string;
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

interface JavaConsoleContext {
	input: JavaScannerInput;
	methodCallDepth: number;
	methods: Map<string, JavaMethodDefinition>;
	stderr: string[];
	variables: Map<string, JavaConsoleValue>;
}

interface JavaScannerInput {
	index: number;
	values: string[];
}

interface JavaConsoleOutputState {
	pendingLine: string;
	stdout: string[];
}

interface JavaConsoleForLoop {
	body: string;
	condition: string;
	initializer: string;
	nextIndex: number;
	update: string;
}

type JavaConsoleValue =
	| {
			elementType: string;
			type: "array" | "arrayList";
			value: JavaConsoleValue[];
	  }
	| {
			type: "boolean";
			value: boolean;
	  }
	| {
			type: "null";
			value: null;
	  }
	| {
			type: "number";
			value: number;
	  }
	| {
			type: "string";
			value: string;
	  };

type JavaConsoleSignal =
	| "break"
	| "continue"
	| {
			kind: "return";
			value: JavaConsoleValue;
	  }
	| null;

const DEFAULT_WORLD_SIZE = 10;
const MAX_KAREL_PREVIEW_COMMANDS = 500;
const MAX_JAVA_CONSOLE_METHOD_CALL_DEPTH = 40;
const MAX_JAVA_CONSOLE_LOOP_ITERATIONS = 500;
const JAVA_PRINT_RE = /System\.out\.(print|println)\s*\(([\s\S]*?)\)\s*;/g;
const JAVA_SCANNER_READ_RE =
	/\b[A-Z_]\w*\.next(Line|Int|Double|Boolean)?\s*\(\s*\)/i;
const JAVA_VARIABLE_DECLARATION_START_RE =
	/^[A-Z_]\w*(?:\s*<[^>;]+>)?(?:\s*\[\s*\])?\s+([A-Z_]\w*)\s*=/i;
const JAVA_VARIABLE_ASSIGNMENT_START_RE = /^([A-Z_]\w*)\s*=/i;
const JAVA_COMPOUND_ASSIGNMENT_START_RE = /^([A-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=)/i;
const JAVA_INDEXED_ASSIGNMENT_START_RE = /^([A-Z_]\w*)\s*\[([\s\S]+)\]\s*=/i;
const JAVA_INDEXED_COMPOUND_ASSIGNMENT_START_RE =
	/^([A-Z_]\w*)\s*\[([\s\S]+)\]\s*(\+=|-=|\*=|\/=|%=)/i;
const JAVA_INDEXED_INCREMENT_RE =
	/^(?:\+\+([A-Z_]\w*)\s*\[([\s\S]+)\]|([A-Z_]\w*)\s*\[([\s\S]+)\]\+\+|--([A-Z_]\w*)\s*\[([\s\S]+)\]|([A-Z_]\w*)\s*\[([\s\S]+)\]--)$/i;
const JAVA_INCREMENT_RE =
	/^(?:\+\+([A-Z_]\w*)|([A-Z_]\w*)\+\+|--([A-Z_]\w*)|([A-Z_]\w*)--)$/i;
const ROBOT_DECLARATION_RE =
	/\bUrRobot\s+([A-Z_]\w*)\s*=\s*new\s+UrRobot\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*([A-Z_]\w*(?:\s*\.\s*[A-Z_]\w*)?)\s*,\s*(\d+)\s*\)/i;
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
		: runConsoleJavaProject(activeFile, options.inputText ?? "");
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

function runConsoleJavaProject(
	file: PythonIdeFile,
	inputText = ""
): JavaIdeRunResult {
	const { stderr, stdout } = javaConsoleOutput(
		stripJavaComments(file.content),
		inputText
	);
	return {
		stderr:
			stdout.length || stderr.length
				? stderr
				: [
						"The browser Java runner can preview System.out.print, System.out.println, simple variables, and Scanner input."
					],
		stdout
	};
}

function javaConsoleOutput(source: string, inputText: string) {
	const methods = parseJavaMethods(source);
	const context: JavaConsoleContext = {
		input: {
			index: 0,
			values: inputText.split(/\r?\n/).map(value => value.trimEnd())
		},
		methodCallDepth: 0,
		methods,
		stderr: [],
		variables: new Map()
	};
	const output: JavaConsoleOutputState = { pendingLine: "", stdout: [] };
	const mainBody = methods.get("main")?.body ?? source;
	executeJavaConsoleBody(mainBody, context, output);

	if (output.pendingLine) output.stdout.push(output.pendingLine);
	return { stderr: context.stderr, stdout: output.stdout };
}

function executeJavaConsoleBody(
	body: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState,
	depth = 0
): JavaConsoleSignal {
	if (depth > 30) {
		context.stderr.push("Stopped Java preview after nested control flow.");
		return null;
	}

	let index = 0;
	while (index < body.length) {
		index = skipWhitespace(body, index);
		if (index >= body.length) break;

		if (wordAt(body, index, "if")) {
			const parsedIf = parseJavaIfStatement(body, index);
			if (parsedIf) {
				const branchBody = evaluateJavaBooleanExpression(
					parsedIf.condition,
					context,
					output
				)
					? parsedIf.body
					: parsedIf.elseBody;
				if (branchBody) {
					const signal = executeJavaConsoleBody(
						branchBody,
						context,
						output,
						depth + 1
					);
					if (signal) return signal;
				}
				index = parsedIf.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "for")) {
			const parsedLoop = parseJavaConsoleForLoop(body, index);
			if (parsedLoop) {
				executeJavaConsoleStatement(
					`${parsedLoop.initializer};`,
					context,
					output
				);
				for (
					let count = 0;
					evaluateJavaBooleanExpression(
						parsedLoop.condition,
						context,
						output
					);
					count += 1
				) {
					if (count >= MAX_JAVA_CONSOLE_LOOP_ITERATIONS) {
						context.stderr.push(
							`Stopped Java preview after ${MAX_JAVA_CONSOLE_LOOP_ITERATIONS} loop iterations.`
						);
						break;
					}
					const signal = executeJavaConsoleBody(
						parsedLoop.body,
						context,
						output,
						depth + 1
					);
					if (signal === "break") break;
					if (signal && signal !== "continue") return signal;
					executeJavaConsoleStatement(
						`${parsedLoop.update};`,
						context,
						output
					);
					if (signal === "continue") continue;
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "while")) {
			const parsedLoop = parseJavaConditionalLoop(body, index);
			if (parsedLoop) {
				for (
					let count = 0;
					evaluateJavaBooleanExpression(
						parsedLoop.condition,
						context,
						output
					);
					count += 1
				) {
					if (count >= MAX_JAVA_CONSOLE_LOOP_ITERATIONS) {
						context.stderr.push(
							`Stopped Java preview after ${MAX_JAVA_CONSOLE_LOOP_ITERATIONS} loop iterations.`
						);
						break;
					}
					const signal = executeJavaConsoleBody(
						parsedLoop.body,
						context,
						output,
						depth + 1
					);
					if (signal === "break") break;
					if (signal && signal !== "continue") return signal;
					if (signal === "continue") continue;
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (body[index] === "{") {
			const closingBrace = findMatchingDelimiter(body, index, "{", "}");
			if (closingBrace < 0) break;
			const signal = executeJavaConsoleBody(
				body.slice(index + 1, closingBrace),
				context,
				output,
				depth + 1
			);
			if (signal) return signal;
			index = closingBrace + 1;
			continue;
		}

		const end = findJavaStatementEnd(body, index);
		if (end < 0) break;
		const signal = executeJavaConsoleStatement(
			body.slice(index, end + 1).trim(),
			context,
			output
		);
		if (signal) return signal;
		index = end + 1;
	}

	return null;
}

function executeJavaConsoleStatement(
	statement: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
): JavaConsoleSignal {
	const trimmed = statement.trim().replace(/;$/, "").trim();
	if (trimmed === "break") return "break";
	if (trimmed === "continue") return "continue";
	if (trimmed === "return") {
		return {
			kind: "return",
			value: { type: "null", value: null }
		};
	}
	if (trimmed.startsWith("return ")) {
		return {
			kind: "return",
			value: evaluateJavaExpression(
				trimmed.slice("return ".length),
				context,
				output
			)
		};
	}

	for (const match of statement.matchAll(JAVA_PRINT_RE)) {
		const method = match[1];
		const expression = match[2] ?? "";
		const value = javaValueToString(
			evaluateJavaExpression(expression, context, output)
		);
		if (method === "print") {
			output.pendingLine += value;
			continue;
		}

		output.stdout.push(`${output.pendingLine}${value}`);
		output.pendingLine = "";
	}

	if (executeJavaConsoleMethodStatement(trimmed, context, output))
		return null;
	if (executeJavaCollectionMutationStatement(trimmed, context, output))
		return null;

	storeJavaVariableFromStatement(statement, context, output);
	return null;
}

function executeJavaConsoleMethodStatement(
	statement: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
) {
	const methodCall = statement.match(/^([A-Z_]\w*)\s*\(([\s\S]*)\)$/i);
	const methodName = methodCall?.[1];
	if (!methodName || !context.methods.has(methodName)) return false;
	executeJavaConsoleMethodCall(
		methodName,
		methodCall?.[2] ?? "",
		context,
		output
	);
	return true;
}

function executeJavaCollectionMutationStatement(
	statement: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
) {
	const match = statement.match(
		/^([A-Z_]\w*)\.(add|set|remove|clear)\s*\(([\s\S]*)\)$/i
	);
	if (!match?.[1] || !match[2]) return false;
	const collection = context.variables.get(match[1]);
	if (collection?.type !== "arrayList") return false;
	const args = splitJavaArguments(match[3] ?? "");
	const method = match[2].toLowerCase();
	if (method === "add") {
		collection.value.push(
			evaluateJavaExpression(args.at(-1) ?? "", context, output)
		);
		return true;
	}
	if (method === "set") {
		const index = javaExpressionToIndex(args[0] ?? "", context, output);
		collection.value[index] = evaluateJavaExpression(
			args[1] ?? "",
			context,
			output
		);
		return true;
	}
	if (method === "remove") {
		collection.value.splice(
			javaExpressionToIndex(args[0] ?? "", context, output),
			1
		);
		return true;
	}
	collection.value.splice(0);
	return true;
}

function storeJavaVariableFromStatement(
	statement: string,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const trimmed = statement.trim().replace(/;$/, "").trim();
	const indexedIncrement = trimmed.match(JAVA_INDEXED_INCREMENT_RE);
	if (indexedIncrement) {
		const variableName =
			indexedIncrement[1] ??
			indexedIncrement[3] ??
			indexedIncrement[5] ??
			indexedIncrement[7];
		const rawIndex =
			indexedIncrement[2] ??
			indexedIncrement[4] ??
			indexedIncrement[6] ??
			indexedIncrement[8] ??
			"";
		if (!variableName) return;
		const currentValue = getJavaIndexedValue(
			variableName,
			rawIndex,
			context,
			output
		);
		const direction = trimmed.includes("--") ? -1 : 1;
		setJavaIndexedValue(
			variableName,
			rawIndex,
			{
				type: "number",
				value: javaValueToNumber(currentValue) + direction
			},
			context,
			output
		);
		return;
	}

	const indexedCompound = trimmed.match(
		JAVA_INDEXED_COMPOUND_ASSIGNMENT_START_RE
	);
	if (indexedCompound?.[1] && indexedCompound[2] && indexedCompound[3]) {
		setJavaIndexedValue(
			indexedCompound[1],
			indexedCompound[2],
			applyJavaCompoundAssignment(
				getJavaIndexedValue(
					indexedCompound[1],
					indexedCompound[2],
					context,
					output
				),
				indexedCompound[3],
				evaluateJavaExpression(
					trimmed.slice(indexedCompound[0].length),
					context,
					output
				)
			),
			context,
			output
		);
		return;
	}

	const indexedAssignment = trimmed.match(JAVA_INDEXED_ASSIGNMENT_START_RE);
	if (indexedAssignment?.[1] && indexedAssignment[2]) {
		setJavaIndexedValue(
			indexedAssignment[1],
			indexedAssignment[2],
			evaluateJavaExpression(
				trimmed.slice(indexedAssignment[0].length),
				context,
				output
			),
			context,
			output
		);
		return;
	}

	const increment = trimmed.match(JAVA_INCREMENT_RE);
	if (increment) {
		const variableName = increment.slice(1).find(Boolean);
		if (!variableName) return;
		const currentValue = context.variables.get(variableName);
		const currentNumber =
			currentValue?.type === "number" ? currentValue.value : 0;
		const direction = trimmed.includes("--") ? -1 : 1;
		context.variables.set(variableName, {
			type: "number",
			value: currentNumber + direction
		});
		return;
	}

	const compound = trimmed.match(JAVA_COMPOUND_ASSIGNMENT_START_RE);
	if (compound?.[1] && compound[2]) {
		context.variables.set(
			compound[1],
			applyJavaCompoundAssignment(
				context.variables.get(compound[1]) ?? {
					type: "number",
					value: 0
				},
				compound[2],
				evaluateJavaExpression(
					trimmed.slice(compound[0].length),
					context,
					output
				)
			)
		);
		return;
	}

	const declaration = trimmed.match(JAVA_VARIABLE_DECLARATION_START_RE);
	if (declaration?.[1]) {
		context.variables.set(
			declaration[1],
			evaluateJavaExpression(
				trimmed.slice(declaration[0].length),
				context,
				output
			)
		);
		return;
	}

	const assignment = trimmed.match(JAVA_VARIABLE_ASSIGNMENT_START_RE);
	if (assignment?.[1]) {
		context.variables.set(
			assignment[1],
			evaluateJavaExpression(
				trimmed.slice(assignment[0].length),
				context,
				output
			)
		);
	}
}

function applyJavaCompoundAssignment(
	currentValue: JavaConsoleValue,
	operator: string,
	nextValue: JavaConsoleValue
): JavaConsoleValue {
	if (operator === "+=") {
		if (currentValue.type === "string" || nextValue.type === "string") {
			return {
				type: "string",
				value: `${javaValueToString(currentValue)}${javaValueToString(nextValue)}`
			};
		}
		return {
			type: "number",
			value:
				javaValueToNumber(currentValue) + javaValueToNumber(nextValue)
		};
	}

	const currentNumber = javaValueToNumber(currentValue);
	const nextNumber = javaValueToNumber(nextValue);
	if (operator === "-=")
		return { type: "number", value: currentNumber - nextNumber };
	if (operator === "*=")
		return { type: "number", value: currentNumber * nextNumber };
	if (operator === "/=")
		return { type: "number", value: currentNumber / nextNumber };
	return { type: "number", value: currentNumber % nextNumber };
}

function evaluateJavaExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue {
	const trimmed = expression.trim();
	if (!trimmed) return { type: "string", value: "" };

	const scannerValue = evaluateJavaScannerRead(trimmed, context);
	if (scannerValue) return scannerValue;

	const collectionValue = evaluateJavaCollectionExpression(
		trimmed,
		context,
		output
	);
	if (collectionValue) return collectionValue;

	const castValue = evaluateJavaCastExpression(trimmed, context, output);
	if (castValue) return castValue;

	const mathMethodValue = evaluateJavaMathMethodExpression(
		trimmed,
		context,
		output
	);
	if (mathMethodValue) return mathMethodValue;

	const stringMethodValue = evaluateJavaStringMethodExpression(
		trimmed,
		context,
		output
	);
	if (stringMethodValue) return stringMethodValue;

	const methodCallValue = evaluateJavaMethodCallExpression(
		trimmed,
		context,
		output
	);
	if (methodCallValue) return methodCallValue;

	const booleanValue = evaluateJavaBooleanValueExpression(
		trimmed,
		context,
		output
	);
	if (booleanValue) return booleanValue;

	const numericValue = evaluateNumericExpression(trimmed, context, output);
	if (numericValue !== null) return { type: "number", value: numericValue };

	const parts = splitJavaConcat(trimmed);
	if (parts.length > 1) {
		return {
			type: "string",
			value: parts
				.map(part =>
					javaValueToString(
						evaluateJavaExpression(part, context, output)
					)
				)
				.join("")
		};
	}

	if (/^"(?:\\.|[^"\\])*"$/.test(trimmed)) {
		return {
			type: "string",
			value: unescapeJavaString(trimmed.slice(1, -1))
		};
	}
	if (/^'(?:\\.|[^'\\])'$/.test(trimmed)) {
		return {
			type: "string",
			value: unescapeJavaString(trimmed.slice(1, -1))
		};
	}
	if (/^(?:true|false)$/i.test(trimmed)) {
		return { type: "boolean", value: trimmed.toLowerCase() === "true" };
	}
	if (/^null$/i.test(trimmed)) return { type: "null", value: null };

	const variable = context?.variables.get(trimmed);
	if (variable) return variable;

	return { type: "string", value: trimmed };
}

function evaluateJavaScannerRead(
	expression: string,
	context: JavaConsoleContext | undefined
): JavaConsoleValue | null {
	const match = expression.match(JAVA_SCANNER_READ_RE);
	if (!match || !context) return null;
	const method = match[1] ?? "";
	const raw = context.input.values[context.input.index] ?? "";
	context.input.index += 1;

	if (raw === "" && context.input.index > context.input.values.length) {
		context.stderr.push(`Scanner input ran out for next${method}().`);
	}

	if (method === "Int") {
		const value = Number.parseInt(raw.trim(), 10);
		if (Number.isFinite(value)) return { type: "number", value };
		context.stderr.push(`Scanner could not read int from "${raw}".`);
		return { type: "number", value: 0 };
	}

	if (method === "Double") {
		const value = Number.parseFloat(raw.trim());
		if (Number.isFinite(value)) return { type: "number", value };
		context.stderr.push(`Scanner could not read double from "${raw}".`);
		return { type: "number", value: 0 };
	}

	if (method === "Boolean") {
		return { type: "boolean", value: raw.trim().toLowerCase() === "true" };
	}

	return { type: "string", value: raw };
}

function evaluateJavaCollectionExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const arrayLiteral = evaluateJavaArrayLiteral(expression, context, output);
	if (arrayLiteral) return arrayLiteral;

	const newArrayLiteral = expression.match(
		/^new\s+([A-Z_]\w*)\s*\[\s*\]\s*\{([^{}]*)\}$/i
	);
	if (newArrayLiteral?.[1]) {
		return javaArrayValue(
			newArrayLiteral[1],
			splitJavaArguments(newArrayLiteral[2] ?? "").map(arg =>
				evaluateJavaExpression(arg, context, output)
			)
		);
	}

	const newArray = expression.match(/^new\s+([A-Z_]\w*)\s*\[([^\]]+)\]$/i);
	if (newArray?.[1]) {
		const elementType = newArray[1];
		const length = Math.max(
			0,
			javaExpressionToIndex(newArray[2] ?? "0", context, output)
		);
		return javaArrayValue(
			elementType,
			Array.from({ length }, () => defaultJavaValueForType(elementType))
		);
	}

	const arrayList = expression.match(
		/^new\s+ArrayList(?:\s*<[^>]*>)?\s*\(\s*\)$/i
	);
	if (arrayList) return javaArrayListValue();

	const arraysToString = expression.match(
		/^Arrays\.toString\s*\(([^()]*)\)$/i
	);
	if (arraysToString?.[1]) {
		const value = evaluateJavaExpression(
			arraysToString[1],
			context,
			output
		);
		return {
			type: "string",
			value:
				value.type === "array" || value.type === "arrayList"
					? javaCollectionToString(value)
					: javaValueToString(value)
		};
	}

	const lengthMatch = expression.match(/^([A-Z_]\w*)\.length$/i);
	if (lengthMatch?.[1]) {
		const value = context?.variables.get(lengthMatch[1]);
		if (value?.type === "array") {
			return { type: "number", value: value.value.length };
		}
	}

	const arrayAccess = expression.match(/^([A-Z_]\w*)\s*\[([\s\S]+)\]$/i);
	if (arrayAccess?.[1] && arrayAccess[2]) {
		return getJavaIndexedValue(
			arrayAccess[1],
			arrayAccess[2],
			context,
			output
		);
	}

	const listMethod = expression.match(
		/^([A-Z_]\w*)\.(get|size|isEmpty)\s*\(([^()]*)\)$/i
	);
	if (!listMethod?.[1] || !listMethod[2]) return null;
	const value = context?.variables.get(listMethod[1]);
	if (value?.type !== "arrayList") return null;
	const method = listMethod[2].toLowerCase();
	if (method === "size") return { type: "number", value: value.value.length };
	if (method === "isempty") {
		return { type: "boolean", value: value.value.length === 0 };
	}
	return (
		value.value[
			javaExpressionToIndex(listMethod[3] ?? "0", context, output)
		] ?? { type: "null", value: null }
	);
}

function evaluateJavaArrayLiteral(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	if (!expression.startsWith("{")) return null;
	const close = findMatchingDelimiter(expression, 0, "{", "}");
	if (close !== expression.length - 1) return null;
	return javaArrayValue(
		"var",
		splitJavaArguments(expression.slice(1, -1)).map(arg =>
			evaluateJavaExpression(arg, context, output)
		)
	);
}

function javaValueToString(value: JavaConsoleValue) {
	if (value.type === "array" || value.type === "arrayList")
		return javaCollectionToString(value);
	if (value.type === "null") return "null";
	return String(value.value);
}

function javaValueToNumber(value: JavaConsoleValue) {
	if (value.type === "number") return value.value;
	if (value.type === "array" || value.type === "arrayList")
		return value.value.length;
	const parsed = Number(javaValueToString(value).trim());
	return Number.isFinite(parsed) ? parsed : 0;
}

function javaCollectionToString(
	value: Extract<JavaConsoleValue, { type: "array" | "arrayList" }>
) {
	return `[${value.value.map(javaValueToString).join(", ")}]`;
}

function javaArrayValue(
	elementType: string,
	value: JavaConsoleValue[]
): JavaConsoleValue {
	return {
		elementType,
		type: "array",
		value
	};
}

function javaArrayListValue(value: JavaConsoleValue[] = []): JavaConsoleValue {
	return {
		elementType: "Object",
		type: "arrayList",
		value
	};
}

function defaultJavaValueForType(type: string): JavaConsoleValue {
	const normalized = type.toLowerCase();
	if (
		normalized === "int" ||
		normalized === "double" ||
		normalized === "float" ||
		normalized === "long" ||
		normalized === "short" ||
		normalized === "byte"
	) {
		return { type: "number", value: 0 };
	}
	if (normalized === "boolean") return { type: "boolean", value: false };
	if (normalized === "char" || normalized === "string")
		return { type: "string", value: "" };
	return { type: "null", value: null };
}

function javaExpressionToIndex(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	return Math.trunc(
		javaValueToNumber(evaluateJavaExpression(expression, context, output))
	);
}

function getJavaIndexedValue(
	variableName: string,
	rawIndex: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue {
	const collection = context?.variables.get(variableName);
	if (collection?.type !== "array" && collection?.type !== "arrayList") {
		return { type: "null", value: null };
	}
	return (
		collection.value[javaExpressionToIndex(rawIndex, context, output)] ?? {
			type: "null",
			value: null
		}
	);
}

function setJavaIndexedValue(
	variableName: string,
	rawIndex: string,
	value: JavaConsoleValue,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const collection = context.variables.get(variableName);
	if (collection?.type !== "array" && collection?.type !== "arrayList")
		return;
	collection.value[javaExpressionToIndex(rawIndex, context, output)] = value;
}

function evaluateJavaCastExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	if (!expression.startsWith("(")) return null;
	const castEnd = findMatchingDelimiter(expression, 0, "(", ")");
	if (castEnd < 0) return null;
	const castType = expression.slice(1, castEnd).trim().toLowerCase();
	if (castType !== "int" && castType !== "double") return null;
	const value = javaValueToNumber(
		evaluateJavaExpression(
			expression.slice(castEnd + 1).trim(),
			context,
			output
		)
	);
	return {
		type: "number",
		value: castType === "int" ? Math.trunc(value) : value
	};
}

function evaluateJavaMathMethodExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const match = expression.match(/^Math\.(\w+)\s*\(([\s\S]*)\)$/);
	if (!match?.[1]) return null;
	const args = splitJavaArguments(match[2] ?? "").map(arg =>
		javaValueToNumber(evaluateJavaExpression(arg, context, output))
	);
	const method = match[1];
	switch (method) {
		case "abs":
			return { type: "number", value: Math.abs(args[0] ?? 0) };
		case "ceil":
			return { type: "number", value: Math.ceil(args[0] ?? 0) };
		case "floor":
			return { type: "number", value: Math.floor(args[0] ?? 0) };
		case "max":
			return { type: "number", value: Math.max(...args) };
		case "min":
			return { type: "number", value: Math.min(...args) };
		case "pow":
			return { type: "number", value: (args[0] ?? 0) ** (args[1] ?? 0) };
		case "random":
			return { type: "number", value: Math.random() };
		case "round":
			return { type: "number", value: Math.round(args[0] ?? 0) };
		case "sqrt":
			return { type: "number", value: Math.sqrt(args[0] ?? 0) };
		default:
			return null;
	}
}

function evaluateJavaStringMethodExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const match = expression.match(
		/^([\s\S]+)\.(length|charAt|substring)\s*\(([\s\S]*)\)$/i
	);
	if (!match?.[1] || !match[2]) return null;
	const receiver = javaValueToString(
		evaluateJavaExpression(match[1], context, output)
	);
	const args = splitJavaArguments(match[3] ?? "").map(arg =>
		Math.trunc(
			javaValueToNumber(evaluateJavaExpression(arg, context, output))
		)
	);
	const method = match[2].toLowerCase();
	if (method === "length") return { type: "number", value: receiver.length };
	if (method === "charat") {
		return {
			type: "string",
			value: receiver[args[0] ?? 0] ?? ""
		};
	}
	return {
		type: "string",
		value: receiver.slice(args[0] ?? 0, args[1] ?? receiver.length)
	};
}

function evaluateJavaMethodCallExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const methodCall = expression.match(/^([A-Z_]\w*)\s*\(([\s\S]*)\)$/i);
	const methodName = methodCall?.[1];
	if (!methodName || !context?.methods.has(methodName)) return null;
	return executeJavaConsoleMethodCall(
		methodName,
		methodCall?.[2] ?? "",
		context,
		output
	);
}

function executeJavaConsoleMethodCall(
	methodName: string,
	rawArguments: string,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue {
	const method = context.methods.get(methodName);
	if (!method) return { type: "null", value: null };
	if (context.methodCallDepth >= MAX_JAVA_CONSOLE_METHOD_CALL_DEPTH) {
		context.stderr.push(
			`Stopped Java preview after ${MAX_JAVA_CONSOLE_METHOD_CALL_DEPTH} nested method calls.`
		);
		return { type: "null", value: null };
	}

	const localContext: JavaConsoleContext = {
		input: context.input,
		methodCallDepth: context.methodCallDepth + 1,
		methods: context.methods,
		stderr: context.stderr,
		variables: new Map()
	};
	const args = splitJavaArguments(rawArguments);
	method.parameters.forEach((parameter, parameterIndex) => {
		localContext.variables.set(
			parameter,
			evaluateJavaExpression(args[parameterIndex] ?? "", context, output)
		);
	});

	const signal = executeJavaConsoleBody(
		method.body,
		localContext,
		output ?? { pendingLine: "", stdout: [] }
	);
	if (signal && typeof signal === "object" && signal.kind === "return")
		return signal.value;
	return { type: "null", value: null };
}

function evaluateJavaBooleanValueExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	if (!context) return null;
	const trimmed = stripJavaOuterParens(expression.trim());
	const orParts = splitJavaTopLevel(trimmed, "||");
	if (orParts.length > 1) {
		return {
			type: "boolean",
			value: orParts.some(part =>
				evaluateJavaBooleanExpression(part, context, output)
			)
		};
	}

	const andParts = splitJavaTopLevel(trimmed, "&&");
	if (andParts.length > 1) {
		return {
			type: "boolean",
			value: andParts.every(part =>
				evaluateJavaBooleanExpression(part, context, output)
			)
		};
	}

	if (trimmed.startsWith("!")) {
		return {
			type: "boolean",
			value: !evaluateJavaBooleanExpression(
				trimmed.slice(1),
				context,
				output
			)
		};
	}

	const comparison = splitJavaComparison(trimmed);
	if (!comparison) return null;
	return {
		type: "boolean",
		value: evaluateJavaComparison(
			evaluateJavaExpression(comparison.left, context, output),
			comparison.operator,
			evaluateJavaExpression(comparison.right, context, output)
		)
	};
}

function parseJavaConsoleForLoop(
	source: string,
	start: number
): JavaConsoleForLoop | null {
	const parenStart = skipWhitespace(source, start + 3);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const headerParts = splitJavaTopLevel(
		source.slice(parenStart + 1, parenEnd),
		";"
	);
	if (headerParts.length !== 3) return null;
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;
	return {
		body: parsedBody.body,
		condition: headerParts[1] ?? "",
		initializer: headerParts[0] ?? "",
		nextIndex: parsedBody.nextIndex,
		update: headerParts[2] ?? ""
	};
}

function evaluateJavaBooleanExpression(
	expression: string,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
): boolean {
	const trimmed = stripJavaOuterParens(expression.trim());
	if (!trimmed) return false;

	const orParts = splitJavaTopLevel(trimmed, "||");
	if (orParts.length > 1) {
		return orParts.some(part =>
			evaluateJavaBooleanExpression(part, context, output)
		);
	}

	const andParts = splitJavaTopLevel(trimmed, "&&");
	if (andParts.length > 1) {
		return andParts.every(part =>
			evaluateJavaBooleanExpression(part, context, output)
		);
	}

	if (trimmed.startsWith("!")) {
		return !evaluateJavaBooleanExpression(
			trimmed.slice(1),
			context,
			output
		);
	}

	const equalityCall = trimmed.match(
		/^([\s\S]+)\.(equals|equalsIgnoreCase)\s*\(([\s\S]*)\)$/i
	);
	if (equalityCall?.[1] && equalityCall[2] && equalityCall[3]) {
		return javaValuesAreEqual(
			evaluateJavaExpression(equalityCall[1], context, output),
			evaluateJavaExpression(equalityCall[3], context, output),
			equalityCall[2].toLowerCase() === "equalsignorecase"
		);
	}

	const comparison = splitJavaComparison(trimmed);
	if (comparison) {
		return evaluateJavaComparison(
			evaluateJavaExpression(comparison.left, context, output),
			comparison.operator,
			evaluateJavaExpression(comparison.right, context, output)
		);
	}

	const value = evaluateJavaExpression(trimmed, context, output);
	if (value.type === "boolean") return value.value;
	if (value.type === "number") return value.value !== 0;
	if (value.type === "null") return false;
	return Boolean(value.value);
}

function javaValuesAreEqual(
	left: JavaConsoleValue,
	right: JavaConsoleValue,
	ignoreCase = false
) {
	if (left.type === "number" || right.type === "number") {
		return javaValueToNumber(left) === javaValueToNumber(right);
	}
	if (left.type === "boolean" || right.type === "boolean") {
		return javaValueToString(left) === javaValueToString(right);
	}
	const leftString = javaValueToString(left);
	const rightString = javaValueToString(right);
	return ignoreCase
		? leftString.toLowerCase() === rightString.toLowerCase()
		: leftString === rightString;
}

function evaluateJavaComparison(
	left: JavaConsoleValue,
	operator: string,
	right: JavaConsoleValue
) {
	if (operator === "==") return javaValuesAreEqual(left, right);
	if (operator === "!=") return !javaValuesAreEqual(left, right);
	const leftNumber = javaValueToNumber(left);
	const rightNumber = javaValueToNumber(right);
	if (operator === "<") return leftNumber < rightNumber;
	if (operator === "<=") return leftNumber <= rightNumber;
	if (operator === ">") return leftNumber > rightNumber;
	return leftNumber >= rightNumber;
}

function splitJavaComparison(expression: string) {
	const operator = findTopLevelJavaOperator(expression, [
		"==",
		"!=",
		">=",
		"<=",
		">",
		"<"
	]);
	if (!operator) return null;
	return {
		left: expression.slice(0, operator.index).trim(),
		operator: operator.operator,
		right: expression
			.slice(operator.index + operator.operator.length)
			.trim()
	};
}

function stripJavaOuterParens(expression: string): string {
	let trimmed = expression;
	while (trimmed.startsWith("(")) {
		const closing = findMatchingDelimiter(trimmed, 0, "(", ")");
		if (closing !== trimmed.length - 1) break;
		trimmed = trimmed.slice(1, -1).trim();
	}
	return trimmed;
}

function splitJavaTopLevel(expression: string, delimiter: string) {
	const parts: string[] = [];
	let start = 0;
	for (const index of topLevelJavaDelimiterIndexes(expression, delimiter)) {
		parts.push(expression.slice(start, index).trim());
		start = index + delimiter.length;
	}
	parts.push(expression.slice(start).trim());
	return parts;
}

function findTopLevelJavaOperator(expression: string, operators: string[]) {
	for (const index of topLevelJavaDelimiterIndexes(expression, operators)) {
		const operator = operators.find(candidate =>
			expression.startsWith(candidate, index)
		);
		if (operator) return { index, operator };
	}
	return null;
}

function topLevelJavaDelimiterIndexes(
	expression: string,
	delimiters: string | string[]
) {
	const delimiterOptions = Array.isArray(delimiters)
		? [...delimiters].sort((a, b) => b.length - a.length)
		: [delimiters];
	const indexes: number[] = [];
	let quote: '"' | "'" | null = null;
	let escaped = false;
	let parenDepth = 0;
	let bracketDepth = 0;
	let braceDepth = 0;

	for (let index = 0; index < expression.length; index += 1) {
		const character = expression[index] ?? "";
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
		if (character === "[") {
			bracketDepth += 1;
			continue;
		}
		if (character === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
			continue;
		}
		if (character === "{") {
			braceDepth += 1;
			continue;
		}
		if (character === "}") {
			braceDepth = Math.max(0, braceDepth - 1);
			continue;
		}
		if (parenDepth > 0 || bracketDepth > 0 || braceDepth > 0) continue;
		const delimiter = delimiterOptions.find(candidate =>
			expression.startsWith(candidate, index)
		);
		if (!delimiter) continue;
		indexes.push(index);
		index += delimiter.length - 1;
	}

	return indexes;
}

function evaluateNumericExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const tokens = expression.match(
		/[A-Z_]\w*\s*\[[^\][]+\]|(?:[A-Z_]\w*\.)?[A-Z_]\w*\s*\([^()]*\)|\d+(?:\.\d+)?|[A-Z_]\w*|[()+\-*/%]/gi
	);
	if (
		!tokens ||
		tokens.join("").replace(/\s+/g, "") !== expression.replace(/\s+/g, "")
	) {
		return null;
	}
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
			if (
				/^(?:[A-Z_]\w*\.)?[A-Z_]\w*\s*\(/i.test(token ?? "") ||
				/^[A-Z_]\w*\s*\[/i.test(token ?? "")
			) {
				return javaValueToNumber(
					evaluateJavaExpression(token ?? "", context, output)
				);
			}
			const variable = context?.variables.get(token ?? "");
			const value =
				variable?.type === "number" ? variable.value : Number(token);
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
		return value;
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
	let bracketDepth = 0;
	let braceDepth = 0;

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
		if (character === "[") {
			bracketDepth += 1;
			continue;
		}
		if (character === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
			continue;
		}
		if (character === "{") {
			braceDepth += 1;
			continue;
		}
		if (character === "}") {
			braceDepth = Math.max(0, braceDepth - 1);
			continue;
		}
		if (
			character !== "+" ||
			parenDepth > 0 ||
			bracketDepth > 0 ||
			braceDepth > 0
		) {
			continue;
		}
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
	const normalized = value
		.replace(/\s+/g, "")
		.split(".")
		.pop()
		?.toLowerCase();
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
	return new Map(
		[...parseJavaMethods(source)].filter(
			([, method]) => method.returnType === "void"
		)
	);
}

function parseJavaMethods(source: string) {
	const methods = new Map<string, JavaMethodDefinition>();
	const methodPattern =
		/\b(?:public|private|protected|static|final|abstract|synchronized|\s)*([A-Z_]\w*(?:\s*<[^>(){};]*>)?(?:\s*\[\s*\])?)\s+([A-Z_]\w*)\s*\(([^)]*)\)\s*\{/gi;
	for (const match of source.matchAll(methodPattern)) {
		const returnType = match[1]?.replace(/\s+/g, " ").trim() ?? "";
		const name = match[2];
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
			parameters: parseJavaParameterNames(match[3] ?? ""),
			returnType
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
	let bracketDepth = 0;
	let braceDepth = 0;
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
		if (character === "[") bracketDepth += 1;
		if (character === "]") bracketDepth = Math.max(0, bracketDepth - 1);
		if (character === "{") braceDepth += 1;
		if (character === "}") braceDepth = Math.max(0, braceDepth - 1);
		if (
			character !== "," ||
			parenDepth > 0 ||
			bracketDepth > 0 ||
			braceDepth > 0
		) {
			continue;
		}
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
