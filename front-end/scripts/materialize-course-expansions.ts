import fs from "node:fs/promises";
import path from "node:path";

import prettier from "prettier";

import { courseCatalog, loadRawCourse } from "../src/stores/courses/index.ts";
import type {
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "../src/stores/courses/types.ts";

type ProjectKind =
	| "assembly"
	| "c"
	| "cpp"
	| "cpp-pattern"
	| "java"
	| "java-pattern"
	| "linux"
	| "python"
	| "python-ai"
	| "python-data"
	| "python-pattern"
	| "python-security"
	| "rust"
	| "swift"
	| "web";

interface CourseConfig {
	codeBacked: boolean;
	hostRepos: string[];
	moduleFocus: string;
	prefix: string;
	projectKind?: ProjectKind;
}

interface ResourceEntry {
	label: string;
	projectLink?: string;
	solutionLink?: string;
	sourcePath: string;
	repoName: string;
}

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const FRONTEND_DIR = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(FRONTEND_DIR, "..");
const COURSES_DIR = path.join(FRONTEND_DIR, "src/stores/courses");
const INSTRUCTION_MATERIAL_ROOT =
	"/Users/jacobanderson/Documents/Work/Instruction-Material";
const TARGET_MODULE_COUNT = 17;
const TARGET_CURRICULUM_ITEMS = 4;
const TARGET_SUPPLEMENTAL_ITEMS = 3;

const HIDDEN_ITEM_TITLES = new Set([
	"session recap & assignment",
	"recap & assignment review"
]);
const COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const LEADING_HYPHENS_RE = /^-+/;
const TRAILING_HYPHENS_RE = /-+$/;
const PARAGRAPH_BREAK_RE = /\n{2,}/;
const INSTRUCTOR_NOTE_RE = /instructor note/i;
const EXCESS_BLANK_LINES_RE = /\n{3,}/g;
const PROJECT_TITLE_RE =
	/\bproject\b|\bcapstone\b|^problem:|^practice:|^extension:|^optional project:/i;
const DEDICATED_SOLUTION_SEGMENT_RE =
	/(?:^|\/)solution(?:\/|$)|(?:^|[-_])solution(?:[-_]|$)/i;
const SENTENCE_END_RE = /[.!?]$/;
const TRAILING_SLASH_RE = /\/$/;
const TRAILING_URL_PUNCTUATION_RE = /[,.;:]+$/;
const GITHUB_BLOB_SEGMENT_RE = /\/blob\//i;
const FIRST_WHITESPACE_RE = /\s/;
const CHECK_IN_PREFIX_RE = /^check-?in\s*#?\d*:?\s*/i;
const DUPLICATE_COLON_TITLE_RE = /^(.+): \1$/;
const COURSE_CONFIG: Record<string, CourseConfig> = {
	"scratch-level-1": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "Scratch studio",
		prefix: "SCR1X"
	},
	"scratch-level-2": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "Scratch systems studio",
		prefix: "SCR2X"
	},
	pygames: {
		codeBacked: true,
		hostRepos: ["PyGames"],
		moduleFocus: "PyGame build",
		prefix: "PGX",
		projectKind: "python"
	},
	"python-level-1": {
		codeBacked: true,
		hostRepos: ["Python-Level-1"],
		moduleFocus: "Python project",
		prefix: "PY1X",
		projectKind: "python"
	},
	"python-level-2": {
		codeBacked: true,
		hostRepos: ["Python-Level-2"],
		moduleFocus: "Python project",
		prefix: "PY2X",
		projectKind: "python"
	},
	"python-level-3": {
		codeBacked: true,
		hostRepos: ["Python-Level-3"],
		moduleFocus: "Python project",
		prefix: "PY3X",
		projectKind: "python"
	},
	"data-science-in-python": {
		codeBacked: true,
		hostRepos: ["Data-Science"],
		moduleFocus: "data analysis lab",
		prefix: "DSPX",
		projectKind: "python-data"
	},
	"ai-level-1": {
		codeBacked: true,
		hostRepos: ["AI-Level-1"],
		moduleFocus: "AI search lab",
		prefix: "AIX",
		projectKind: "python-ai"
	},
	"python-to-java-and-cpp-bridge": {
		codeBacked: true,
		hostRepos: ["Java-Level-1", "CPP-Level-1"],
		moduleFocus: "language bridge lab",
		prefix: "BRGX",
		projectKind: "java"
	},
	"c-level-1": {
		codeBacked: true,
		hostRepos: ["CPP-Level-1"],
		moduleFocus: "C++ foundations build",
		prefix: "CPPX",
		projectKind: "cpp"
	},
	"data-structures-and-algorithms-in-cpp": {
		codeBacked: true,
		hostRepos: ["Data-Structures-and-Algorithms-in-CPP"],
		moduleFocus: "C++ algorithm lab",
		prefix: "DSAX",
		projectKind: "cpp"
	},
	"c-systems-engineering": {
		codeBacked: true,
		hostRepos: ["C-Systems-Engineering"],
		moduleFocus: "systems build",
		prefix: "CSEX",
		projectKind: "c"
	},
	assembly: {
		codeBacked: true,
		hostRepos: ["Assembly"],
		moduleFocus: "assembly lab",
		prefix: "ASMX",
		projectKind: "assembly"
	},
	"java-level-1": {
		codeBacked: true,
		hostRepos: ["Java-Level-1"],
		moduleFocus: "Java foundations build",
		prefix: "J1X",
		projectKind: "java"
	},
	"java-level-2": {
		codeBacked: true,
		hostRepos: ["Java-Level-2"],
		moduleFocus: "Java project",
		prefix: "J2X",
		projectKind: "java"
	},
	"java-level-3": {
		codeBacked: true,
		hostRepos: ["Java-Level-3"],
		moduleFocus: "advanced Java project",
		prefix: "J3X",
		projectKind: "java"
	},
	"ap-computer-science-a": {
		codeBacked: true,
		hostRepos: ["APCS"],
		moduleFocus: "APCS practice build",
		prefix: "APCSX",
		projectKind: "java"
	},
	"usaco-bronze": {
		codeBacked: true,
		hostRepos: ["USACO-Bronze"],
		moduleFocus: "contest problem set",
		prefix: "UBX",
		projectKind: "cpp"
	},
	"usaco-silver": {
		codeBacked: true,
		hostRepos: ["USACO-Silver"],
		moduleFocus: "contest problem set",
		prefix: "USX",
		projectKind: "cpp"
	},
	"usaco-gold": {
		codeBacked: true,
		hostRepos: ["USACO-Gold"],
		moduleFocus: "contest problem set",
		prefix: "UGX",
		projectKind: "cpp"
	},
	"design-patterns-in-java": {
		codeBacked: true,
		hostRepos: ["Java-Level-3"],
		moduleFocus: "pattern implementation lab",
		prefix: "DPJX",
		projectKind: "java-pattern"
	},
	"design-patterns-in-java-part-2": {
		codeBacked: true,
		hostRepos: ["Java-Level-3"],
		moduleFocus: "refactoring clinic",
		prefix: "DPRX",
		projectKind: "java-pattern"
	},
	"design-patterns-in-cpp": {
		codeBacked: true,
		hostRepos: ["Design-Patterns-in-CPP"],
		moduleFocus: "pattern implementation lab",
		prefix: "DPCX",
		projectKind: "cpp-pattern"
	},
	"pythonic-design-patterns": {
		codeBacked: true,
		hostRepos: ["Python-Courses"],
		moduleFocus: "pattern implementation lab",
		prefix: "PDPX",
		projectKind: "python-pattern"
	},
	"intro-to-chemistry": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "chemistry lab",
		prefix: "CHEMX"
	},
	"intro-to-physics": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "physics lab",
		prefix: "PHYX"
	},
	"physics-level-2": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "physics problem lab",
		prefix: "PHY2X"
	},
	"intro-to-swift-app-development": {
		codeBacked: true,
		hostRepos: ["Swift"],
		moduleFocus: "Swift app build",
		prefix: "SADX",
		projectKind: "swift"
	},
	"linux-systems": {
		codeBacked: true,
		hostRepos: ["Linux-Systems"],
		moduleFocus: "Linux systems lab",
		prefix: "LSX",
		projectKind: "linux"
	},
	"network-systems": {
		codeBacked: true,
		hostRepos: ["Network-Systems"],
		moduleFocus: "network systems lab",
		prefix: "NSX",
		projectKind: "python-security"
	},
	"network-security": {
		codeBacked: true,
		hostRepos: ["Network-Security"],
		moduleFocus: "network security lab",
		prefix: "NSECX",
		projectKind: "python-security"
	},
	"rust-systems-security": {
		codeBacked: true,
		hostRepos: ["Low-Level-Security"],
		moduleFocus: "Rust systems lab",
		prefix: "RUSTX",
		projectKind: "rust"
	},
	"javascript-level-1": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "web app build",
		prefix: "JSSX",
		projectKind: "web"
	},
	"javascript-level-1-javascript-superstar": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "web app build",
		prefix: "JSSX",
		projectKind: "web"
	},
	"javascript-level-2": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "interactive web build",
		prefix: "JSMX",
		projectKind: "web"
	},
	"javascript-level-2-javascript-master": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "interactive web build",
		prefix: "JSMX",
		projectKind: "web"
	},
	"web-development-foundations": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "full-stack web lab",
		prefix: "WDFX",
		projectKind: "web"
	},
	"machine-learning": {
		codeBacked: true,
		hostRepos: ["AI-Level-2"],
		moduleFocus: "machine learning lab",
		prefix: "MLX",
		projectKind: "python-data"
	},
	"low-level-security": {
		codeBacked: true,
		hostRepos: ["Low-Level-Security"],
		moduleFocus: "low-level security lab",
		prefix: "LLSX",
		projectKind: "c"
	},
	"low-level-security-part-2": {
		codeBacked: true,
		hostRepos: ["Low-Level-Security"],
		moduleFocus: "offensive security lab",
		prefix: "LLS2X",
		projectKind: "c"
	}
};

const PYTHON_BASELINE_IDS = new Set([
	"python-level-1",
	"python-level-2",
	"python-level-3"
]);

function slugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(COMBINING_MARKS_RE, "")
		.replace(NON_ALPHANUMERIC_RE, "-")
		.replace(LEADING_HYPHENS_RE, "")
		.replace(TRAILING_HYPHENS_RE, "");
}

function shouldHideItem(title: string) {
	return HIDDEN_ITEM_TITLES.has(title.trim().toLowerCase());
}

function trimUrl(url: string) {
	return url.trim().replace(TRAILING_URL_PUNCTUATION_RE, "");
}

function canonicalizeResourceUrl(url?: string) {
	if (!url) return undefined;

	const trimmedUrl = trimUrl(url);

	try {
		const parsed = new URL(trimmedUrl);

		if (parsed.hostname !== "github.com") {
			return trimmedUrl;
		}

		if (!GITHUB_BLOB_SEGMENT_RE.test(parsed.pathname)) {
			return trimmedUrl.replace(TRAILING_SLASH_RE, "");
		}

		const pathSegments = parsed.pathname.split("/").filter(Boolean);

		if (pathSegments.length < 5 || pathSegments[2] !== "blob") {
			return trimmedUrl;
		}

		const [owner, repo, _blob, ref, ...fileSegments] = pathSegments;

		if (fileSegments.length === 0) {
			return trimmedUrl.replace(TRAILING_SLASH_RE, "");
		}

		const directorySegments = fileSegments.slice(0, -1);
		parsed.pathname =
			directorySegments.length > 0
				? `/${owner}/${repo}/tree/${ref}/${directorySegments.join("/")}`
				: `/${owner}/${repo}/tree/${ref}`;
		parsed.search = "";
		parsed.hash = "";

		return parsed.toString().replace(TRAILING_SLASH_RE, "");
	} catch {
		return trimmedUrl;
	}
}

function shouldExposeLegacySolutionAsProject(title: string, url?: string) {
	if (!url || !PROJECT_TITLE_RE.test(title)) {
		return false;
	}

	return !DEDICATED_SOLUTION_SEGMENT_RE.test(url);
}

function extractLeadingResourceLink(title: string, content: string) {
	const separatorIndex = content.indexOf(": ");

	if (separatorIndex < 1 || separatorIndex > 60) {
		return null;
	}

	const label = content.slice(0, separatorIndex).trim();
	const afterLabel = content.slice(separatorIndex + 2).trimStart();

	if (!afterLabel.startsWith("http")) {
		return null;
	}

	const firstWhitespaceIndex = afterLabel.search(FIRST_WHITESPACE_RE);
	const rawUrl =
		firstWhitespaceIndex === -1
			? afterLabel
			: afterLabel.slice(0, firstWhitespaceIndex);
	const remainder =
		firstWhitespaceIndex === -1
			? ""
			: afterLabel.slice(firstWhitespaceIndex).trim();
	const normalizedUrl = canonicalizeResourceUrl(rawUrl);

	if (!normalizedUrl) {
		return null;
	}

	const isInstructionMaterialLink =
		normalizedUrl.includes("github.com/instruction-material/") ||
		normalizedUrl.includes("scratch.mit.edu/projects/") ||
		normalizedUrl.includes("static.junilearning.com/") ||
		normalizedUrl.includes("static.classes.jacobdanderson.net/");

	if (!isInstructionMaterialLink && !PROJECT_TITLE_RE.test(title)) {
		return null;
	}

	return {
		content: remainder.trim(),
		url: normalizedUrl
	};
}

function normalizeContent(content: string) {
	const paragraphs = content
		.split(PARAGRAPH_BREAK_RE)
		.map(part => part.trim())
		.filter(Boolean)
		.filter(part => !INSTRUCTOR_NOTE_RE.test(part));
	return paragraphs
		.join("\n\n")
		.replace(EXCESS_BLANK_LINES_RE, "\n\n")
		.trim();
}

function dedupeRepeatedTitle(title: string) {
	const duplicateMatch = title.match(DUPLICATE_COLON_TITLE_RE);
	return duplicateMatch?.[1] ?? title;
}

function expandSlightly(title: string, content: string) {
	return content.trim();
}

function normalizeItem(item: RawCourseModuleItem): RawCourseModuleItem {
	const extractedLink = extractLeadingResourceLink(item.title, item.content);
	const normalizedSolutionLink = canonicalizeResourceUrl(item.solutionLink);

	return {
		title: dedupeRepeatedTitle(item.title.trim()),
		content: expandSlightly(
			item.title,
			normalizeContent(extractedLink?.content ?? item.content)
		),
		projectLink:
			canonicalizeResourceUrl(item.projectLink) ??
			extractedLink?.url ??
			(shouldExposeLegacySolutionAsProject(
				item.title,
				normalizedSolutionLink
			)
				? normalizedSolutionLink
				: undefined),
		solutionLink: normalizedSolutionLink,
		datasetLink: item.datasetLink,
		mediaLink: item.mediaLink
	};
}

function normalizeCourse(rawCourse: RawCourse): RawCourse {
	return {
		name: rawCourse.name,
		modules: rawCourse.modules.map(module => ({
			title: module.title.trim(),
			curriculum: module.curriculum
				.filter(item => !shouldHideItem(item.title))
				.map(normalizeItem),
			supplementalProjects: module.supplementalProjects
				.filter(item => !shouldHideItem(item.title))
				.map(normalizeItem)
		}))
	};
}

function buildCurriculumSupportItem(
	moduleTitle: string,
	focus: string,
	index: number
): RawCourseModuleItem {
	const variants = [
		{
			title: `${focus}: Guided Example Review`,
			content: `Trace one representative example from ${moduleTitle}, identify the checkpoints that matter most, and compare one correct approach to one flawed attempt.`
		},
		{
			title: `${focus}: Debugging and Failure Modes`,
			content: `Focus on common mistakes in ${moduleTitle}. The checkpoint diagnoses a broken attempt, repairs it, and explains why the fix works.`
		},
		{
			title: `${focus}: Planning and Architecture`,
			content: `Break ${moduleTitle} into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built.`
		},
		{
			title: `${focus}: Verification and Reflection`,
			content: `Finish ${moduleTitle} with a concise review of the required output, one alternate approach, and one specific improvement for a later revision.`
		}
	];
	return variants[(index - 1) % variants.length];
}

function buildSupplementalSupportItem(
	moduleTitle: string,
	focus: string,
	index: number
): RawCourseModuleItem {
	const variants = [
		{
			title: `${focus}: Extension Challenge`,
			content: `Extend the work from ${moduleTitle} with a tighter constraint, one extra feature, or a slightly more realistic input case.`
		},
		{
			title: `${focus}: Fluency Drill`,
			content: `Repeat the core ideas from ${moduleTitle} on a smaller problem to build speed, independence, and cleaner reasoning.`
		},
		{
			title: `${focus}: Open-Ended Variant`,
			content: `Create an original variation inspired by ${moduleTitle}. Keep the scope small, but require one meaningful design or reasoning choice.`
		}
	];
	return variants[(index - 1) % variants.length];
}

function buildLinkedSupplementalProjectItem(
	moduleTitle: string,
	focus: string,
	index: number,
	resource: ResourceEntry
): RawCourseModuleItem {
	const resourceLabel = humanizeResourceLabel(resource.label);
	const title =
		resourceLabel && slugify(resourceLabel) !== slugify(focus)
			? `${focus}: ${resourceLabel}`
			: `${focus}: Supplemental Project ${index}`;
	const variant =
		index % 2 === 0
			? "a transfer practice build that changes one input, constraint, or data shape from the core project"
			: "an extension build that adds one robustness, edge-case, or design-quality requirement";

	return {
		title,
		content: `**Project goal:** Use this linked project as ${variant} for ${moduleTitle}. The purpose is to prove that the main concept transfers beyond the exact walkthrough.\n\n**Required work:**\n1. Read the starter and identify the expected inputs, outputs, and state changes.\n2. Implement the missing behavior without copying from a completed version first.\n3. Add at least one normal case and one awkward or boundary case.\n4. Check the draft against the expected behavior only after a working version exists.\n\n**Completion checks:**\n- The changed constraint or edge case is named explicitly.\n- The implementation still satisfies the original module concept.\n- The final note explains one decision that would not be obvious from the starter alone.`,
		projectLink: resource.projectLink,
		solutionLink: resource.solutionLink
	};
}

function humanizeResourceLabel(label: string) {
	return label
		.replace(/[-_]/g, " ")
		.replace(/^[A-Za-z]{2,}\d+[A-Za-z0-9]*\s+/u, "")
		.replace(/\b(starter|solution|updated|template)\b/gi, "")
		.replace(/\s+/g, " ")
		.trim();
}

function nextFocusLabel(
	moduleTitle: string,
	resource: ResourceEntry | null,
	courseConfig: CourseConfig
) {
	if (resource) {
		return humanizeResourceLabel(resource.label);
	}

	return (
		moduleTitle.replace(CHECK_IN_PREFIX_RE, "").trim() ||
		courseConfig.moduleFocus
	);
}

function firstLinkedItem(module: RawCourseModule) {
	return [...module.curriculum, ...module.supplementalProjects].find(
		item => item.projectLink || item.solutionLink
	);
}

async function parseCourseFileMap() {
	const indexFile = await fs.readFile(
		path.join(COURSES_DIR, "index.ts"),
		"utf8"
	);
	const fileMap = new Map<string, string>();
	const regex = /id:\s*"([^"]+)"[\s\S]*?import\("\.\/([^"]+)"\)/g;

	for (const match of indexFile.matchAll(regex)) {
		fileMap.set(match[1], `${match[2]}.ts`);
	}

	return fileMap;
}

async function scanRepoResources(repoName: string) {
	const repoPath = path.join(INSTRUCTION_MATERIAL_ROOT, repoName);
	const dirEntries = await fs.readdir(repoPath, { withFileTypes: true });
	const resources: ResourceEntry[] = [];

	for (const dirEntry of dirEntries) {
		if (!dirEntry.isDirectory() || dirEntry.name.startsWith(".")) {
			continue;
		}

		const sourcePath = dirEntry.name;
		const topLevelPath = path.join(repoPath, sourcePath);
		const starterPath = path.join(topLevelPath, "starter");
		const solutionPath = path.join(topLevelPath, "solution");
		const hasStarter = await fs
			.stat(starterPath)
			.then(stat => stat.isDirectory())
			.catch(() => false);
		const hasSolution = await fs
			.stat(solutionPath)
			.then(stat => stat.isDirectory())
			.catch(() => false);

		resources.push({
			label: sourcePath,
			projectLink: hasStarter
				? `https://github.com/instruction-material/${repoName}/tree/main/${sourcePath}/starter`
				: `https://github.com/instruction-material/${repoName}/tree/main/${sourcePath}`,
			solutionLink: hasSolution
				? `https://github.com/instruction-material/${repoName}/tree/main/${sourcePath}/solution`
				: undefined,
			sourcePath,
			repoName
		});
	}

	return resources.sort((left, right) =>
		left.sourcePath.localeCompare(right.sourcePath)
	);
}

function buildReadme(
	projectTitle: string,
	courseName: string,
	moduleTitle: string,
	projectKind: ProjectKind
) {
	const runLine = {
		assembly: "`cc main.c routine.S -o app && ./app`",
		c: "`cc main.c -o app && ./app`",
		cpp: "`c++ -std=c++17 main.cpp -o app && ./app`",
		"cpp-pattern": "`c++ -std=c++17 main.cpp -o app && ./app`",
		java: "`javac Main.java && java Main`",
		"java-pattern": "`javac Main.java && java Main`",
		linux: "`bash task.sh`",
		python: "`python3 main.py`",
		"python-ai": "`python3 main.py`",
		"python-data": "`python3 main.py`",
		"python-pattern": "`python3 main.py`",
		"python-security": "`python3 main.py`",
		rust: "`cargo run`",
		swift: "`swift App.swift`",
		web: "open `index.html` in a browser"
	}[projectKind];

	return `# ${projectTitle}

Course: ${courseName}
Module: ${moduleTitle}

Use the starter folder first. The starter is intentionally incomplete, and the solution shows one clean way to finish the same build after a working draft exists.

Suggested flow:
- Read the module brief and identify the core requirement.
- Complete the TODO markers in the starter implementation.
- Test at least one custom case beyond the default example.
- Compare against the solution only after the starter has a working draft.

Quick run hint: ${runLine}
`;
}

function buildProjectFiles(
	projectKind: ProjectKind,
	projectTitle: string,
	courseName: string,
	moduleTitle: string
) {
	const readme = buildReadme(
		projectTitle,
		courseName,
		moduleTitle,
		projectKind
	);

	const sharedByKind: Record<ProjectKind, Record<string, string>> = {
		assembly: {
			"starter/main.c": `#include <stdio.h>

#define VALUE_COUNT 4

extern int transform_value(int value);

/**
 * @brief Run the assembly helper across a small sample set
 *
 * @return Zero when the program completes
 */
int main(void) {
\tconst int values[VALUE_COUNT] = {3, 7, 11, 19};
\tint total = 0;

\t// Add each transformed value into the running total
\tfor (int value_index = 0; value_index < VALUE_COUNT; value_index++) {
\t\ttotal += transform_value(values[value_index]);
\t}

\tprintf("total=%d\\n", total);
\treturn 0;
}
`,
			"starter/routine.S": `.global transform_value
transform_value:
\t# TODO: Load the input value, apply a simple transform, and return it in eax
\tmovl %edi, %eax
\tret
`,
			"solution/main.c": `#include <stdio.h>

#define VALUE_COUNT 4

extern int transform_value(int value);

/**
 * @brief Run the assembly helper across a small sample set
 *
 * @return Zero when the program completes
 */
int main(void) {
\tconst int values[VALUE_COUNT] = {3, 7, 11, 19};
\tint total = 0;

\t// Add each transformed value into the running total
\tfor (int value_index = 0; value_index < VALUE_COUNT; value_index++) {
\t\ttotal += transform_value(values[value_index]);
\t}

\tprintf("total=%d\\n", total);
\treturn 0;
}
`,
			"solution/routine.S": `.equ TRANSFORM_OFFSET, 5

.global transform_value
transform_value:
\t# Return input * 2 + TRANSFORM_OFFSET in eax
\tleal TRANSFORM_OFFSET(%rdi,%rdi), %eax
\tret
`
		},
		c: {
			"starter/main.c": `#include <stdio.h>
#include <string.h>

enum {
\tMAX_LABEL_LENGTH = 32,
\tRECORD_COUNT = 3
};

// Store one labeled integer record
typedef struct {
\tchar label[MAX_LABEL_LENGTH];
\tint value;
} record_t;

// Summarize records after the learner adds the target rule
static int summarize_records(const record_t *records, int record_count) {
\tint total = 0;

\t// Fold each record into the running summary
\tfor (int record_index = 0; record_index < record_count; record_index++) {
\t\t// TODO: Fold the current record into the total in a safer, clearer way
\t\t(void)records;
\t}

\treturn total;
}

/**
 * @brief Run the record summary example
 *
 * @return Zero when the program completes
 */
int main(void) {
\tconst record_t records[RECORD_COUNT] = {
\t\t{"alpha", 4},
\t\t{"beta", 9},
\t\t{"gamma", 15},
\t};

\tprintf("summary=%d\\n", summarize_records(records, RECORD_COUNT));
\treturn 0;
}
`,
			"solution/main.c": `#include <stdio.h>
#include <string.h>

enum {
\tMAX_LABEL_LENGTH = 32,
\tRECORD_COUNT = 3
};

static const int DEFAULT_RECORD_WEIGHT = 1;
static const int BETA_RECORD_WEIGHT = 2;

// Store one labeled integer record
typedef struct {
\tchar label[MAX_LABEL_LENGTH];
\tint value;
} record_t;

// Summarize records with a special weight for beta records
static int summarize_records(const record_t *records, int record_count) {
\tint total = 0;

\t// Fold each record into the running summary
\tfor (int record_index = 0; record_index < record_count; record_index++) {
\t\tconst record_t *current_record = &records[record_index];

\t\t// Apply the higher beta weight when the label matches
\t\tif (strncmp(current_record->label, "beta", sizeof(current_record->label)) == 0) {
\t\t\ttotal += current_record->value * BETA_RECORD_WEIGHT;
\t\t} else {
\t\t\ttotal += current_record->value * DEFAULT_RECORD_WEIGHT;
\t\t}
\t}

\treturn total;
}

/**
 * @brief Run the record summary example
 *
 * @return Zero when the program completes
 */
int main(void) {
\tconst record_t records[RECORD_COUNT] = {
\t\t{"alpha", 4},
\t\t{"beta", 9},
\t\t{"gamma", 15},
\t};

\tprintf("summary=%d\\n", summarize_records(records, RECORD_COUNT));
\treturn 0;
}
`
		},
		cpp: {
			"starter/main.cpp": `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

constexpr int TRANSFORM_MULTIPLIER = 2;
constexpr int TRANSFORM_OFFSET = 1;

/**
 * @brief Transform each input value into a new output vector
 *
 * @param values Source values to transform
 *
 * @return Transformed values
 */
std::vector<int> transform_values(const std::vector<int>& values) {
\tstd::vector<int> result;

\t// Transform each value and store the result
\tfor (int value : values) {
\t\t// TODO: Transform each value and push it into result
\t\tconst int transformed_value = value * TRANSFORM_MULTIPLIER + TRANSFORM_OFFSET;
\t\t(void)transformed_value;
\t}

\treturn result;
}

/**
 * @brief Run the vector transformation example
 *
 * @return Zero when the program completes
 */
int main() {
\tconst std::vector<int> values {3, 8, 13, 21};

\t// Print each transformed value on its own line
\tfor (int value : transform_values(values)) {
\t\tstd::cout << value << "\\n";
\t}

\treturn 0;
}
`,
			"solution/main.cpp": `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

constexpr int TRANSFORM_MULTIPLIER = 2;
constexpr int TRANSFORM_OFFSET = 1;

/**
 * @brief Transform each input value into a new output vector
 *
 * @param values Source values to transform
 *
 * @return Transformed values
 */
std::vector<int> transform_values(const std::vector<int>& values) {
\tstd::vector<int> result;
\tresult.reserve(values.size());

\t// Transform each value and store the result
\tfor (int value : values) {
\t\tresult.push_back(value * TRANSFORM_MULTIPLIER + TRANSFORM_OFFSET);
\t}

\treturn result;
}

/**
 * @brief Run the vector transformation example
 *
 * @return Zero when the program completes
 */
int main() {
\tconst std::vector<int> values {3, 8, 13, 21};

\t// Print each transformed value on its own line
\tfor (int value : transform_values(values)) {
\t\tstd::cout << value << "\\n";
\t}

\treturn 0;
}
`
		},
		"cpp-pattern": {
			"starter/main.cpp": `#include <iostream>
#include <memory>
#include <string>

// Define the shared formatter interface
class Formatter {
public:
\tvirtual ~Formatter() = default;

\t// Format text using the selected strategy
\tvirtual std::string format(const std::string& input) const = 0;
};

// Keep the title-formatting implementation separate from the caller
class TitleFormatter : public Formatter {
public:
\t// Return the original input until the learner implements the strategy
\tstd::string format(const std::string& input) const override {
\t\t// TODO: Return a transformed representation
\t\treturn input;
\t}
};

/**
 * @brief Run the formatter strategy example
 *
 * @return Zero when the program completes
 */
int main() {
\tstd::unique_ptr<Formatter> formatter = std::make_unique<TitleFormatter>();
\tstd::cout << formatter->format("design patterns") << "\\n";
\treturn 0;
}
`,
			"solution/main.cpp": `#include <cctype>
#include <iostream>
#include <memory>
#include <string>

// Define the shared formatter interface
class Formatter {
public:
\tvirtual ~Formatter() = default;

\t// Format text using the selected strategy
\tvirtual std::string format(const std::string& input) const = 0;
};

// Keep the title-formatting implementation separate from the caller
class TitleFormatter : public Formatter {
public:
\t// Format the input as title-style text
\tstd::string format(const std::string& input) const override {
\t\tstd::string output = input;
\t\tbool make_upper = true;

\t\t// Promote the first character after each word boundary
\t\tfor (char& ch : output) {
\t\t\t// Start a new word after whitespace
\t\t\tif (std::isspace(static_cast<unsigned char>(ch))) {
\t\t\t\tmake_upper = true;
\t\t\t\tcontinue;
\t\t\t}

\t\t\t// Convert the first character of each word to uppercase
\t\t\tif (make_upper) {
\t\t\t\tch = static_cast<char>(std::toupper(static_cast<unsigned char>(ch)));
\t\t\t\tmake_upper = false;
\t\t\t}
\t\t}

\t\treturn output;
\t}
};

/**
 * @brief Run the formatter strategy example
 *
 * @return Zero when the program completes
 */
int main() {
\tstd::unique_ptr<Formatter> formatter = std::make_unique<TitleFormatter>();
\tstd::cout << formatter->format("design patterns") << "\\n";
\treturn 0;
}
`
		},
		java: {
			"starter/Main.java": `import java.util.List;

/**
 * @brief Practice list traversal with a named scoring helper
 */
public class Main {
\tprivate static final List<Integer> DEFAULT_VALUES = List.of(2, 5, 8, 13);

\t/**
\t * @brief Compute a score from a list of values
\t *
\t * @param values Values to score
\t *
\t * @return Total score
\t */
\tprivate static int compute_score(List<Integer> values) {
\t\tint total = 0;

\t\t// Fold each value into the running total
\t\tfor (int value : values) {
\t\t\t// TODO: Update the scoring rule
\t\t}

\t\treturn total;
\t}

\t/**
\t * @brief Run the scoring example
\t *
\t * @param args Command-line arguments
\t */
\tpublic static void main(String[] args) {
\t\tSystem.out.println(compute_score(DEFAULT_VALUES));
\t}
}
`,
			"solution/Main.java": `import java.util.List;

/**
 * @brief Practice list traversal with a named scoring helper
 */
public class Main {
\tprivate static final int EVEN_DIVISOR = 2;
\tprivate static final int ODD_MULTIPLIER = 2;
\tprivate static final List<Integer> DEFAULT_VALUES = List.of(2, 5, 8, 13);

\t/**
\t * @brief Compute a score from a list of values
\t *
\t * @param values Values to score
\t *
\t * @return Total score
\t */
\tprivate static int compute_score(List<Integer> values) {
\t\tint total = 0;

\t\t// Fold each value into the running total
\t\tfor (int value : values) {
\t\t\t// Score even values differently from odd values
\t\t\tif (value % EVEN_DIVISOR == 0) {
\t\t\t\ttotal += value / EVEN_DIVISOR;
\t\t\t} else {
\t\t\t\ttotal += value * ODD_MULTIPLIER;
\t\t\t}
\t\t}

\t\treturn total;
\t}

\t/**
\t * @brief Run the scoring example
\t *
\t * @param args Command-line arguments
\t */
\tpublic static void main(String[] args) {
\t\tSystem.out.println(compute_score(DEFAULT_VALUES));
\t}
}
`
		},
		"java-pattern": {
			"starter/Main.java": `/**
 * @brief Define the pricing behavior shared by all strategies
 */
interface PricingStrategy {
\t/**
\t * @brief Compute a price for the requested unit count
\t *
\t * @param units Number of units being purchased
\t *
\t * @return Total price
\t */
\tdouble price_for(int units);
}

/**
 * @brief Apply bulk-pricing behavior behind a shared interface
 */
final class BulkPricingStrategy implements PricingStrategy {
\t/**
\t * @brief Compute a price for the requested unit count
\t *
\t * @param units Number of units being purchased
\t *
\t * @return Total price
\t */
\t@Override
\tpublic double price_for(int units) {
\t\t// TODO: Apply a smarter pricing strategy
\t\treturn units;
\t}
}

/**
 * @brief Run the pricing strategy example
 */
public class Main {
\tprivate static final int SAMPLE_UNITS = 6;

\t/**
\t * @brief Run the pricing strategy example
\t *
\t * @param args Command-line arguments
\t */
\tpublic static void main(String[] args) {
\t\tPricingStrategy strategy = new BulkPricingStrategy();
\t\tSystem.out.println(strategy.price_for(SAMPLE_UNITS));
\t}
}
`,
			"solution/Main.java": `/**
 * @brief Define the pricing behavior shared by all strategies
 */
interface PricingStrategy {
\t/**
\t * @brief Compute a price for the requested unit count
\t *
\t * @param units Number of units being purchased
\t *
\t * @return Total price
\t */
\tdouble price_for(int units);
}

/**
 * @brief Apply bulk-pricing behavior behind a shared interface
 */
final class BulkPricingStrategy implements PricingStrategy {
\tprivate static final int LARGE_ORDER_THRESHOLD = 10;
\tprivate static final int MEDIUM_ORDER_THRESHOLD = 5;
\tprivate static final double LARGE_ORDER_UNIT_PRICE = 2.5;
\tprivate static final double MEDIUM_ORDER_UNIT_PRICE = 3.0;
\tprivate static final double SMALL_ORDER_UNIT_PRICE = 3.5;

\t/**
\t * @brief Compute a price for the requested unit count
\t *
\t * @param units Number of units being purchased
\t *
\t * @return Total price
\t */
\t@Override
\tpublic double price_for(int units) {
\t\t// Apply the largest-order price first
\t\tif (units >= LARGE_ORDER_THRESHOLD) {
\t\t\treturn units * LARGE_ORDER_UNIT_PRICE;
\t\t}

\t\t// Apply the medium-order price before the fallback
\t\tif (units >= MEDIUM_ORDER_THRESHOLD) {
\t\t\treturn units * MEDIUM_ORDER_UNIT_PRICE;
\t\t}

\t\treturn units * SMALL_ORDER_UNIT_PRICE;
\t}
}

/**
 * @brief Run the pricing strategy example
 */
public class Main {
\tprivate static final int SAMPLE_UNITS = 6;

\t/**
\t * @brief Run the pricing strategy example
\t *
\t * @param args Command-line arguments
\t */
\tpublic static void main(String[] args) {
\t\tPricingStrategy strategy = new BulkPricingStrategy();
\t\tSystem.out.println(strategy.price_for(SAMPLE_UNITS));
\t}
}
`
		},
		linux: {
			"starter/task.sh": `#!/usr/bin/env bash
set -euo pipefail

readonly LOG_FILE="sample.log"
readonly ERROR_PATTERN="ERROR"

# TODO: Summarize the log file more carefully
grep -c "$ERROR_PATTERN" "$LOG_FILE"
`,
			"starter/sample.log": `INFO booting
WARNING low-disk
ERROR failed-auth
INFO retry
ERROR timeout
`,
			"solution/task.sh": `#!/usr/bin/env bash
set -euo pipefail

readonly LOG_FILE="sample.log"
readonly ERROR_PATTERN="ERROR"
readonly WARNING_PATTERN="WARNING"

# Count error and warning lines without failing on zero matches
error_count=$(grep -c "$ERROR_PATTERN" "$LOG_FILE" || true)
warning_count=$(grep -c "$WARNING_PATTERN" "$LOG_FILE" || true)

printf 'errors=%s warnings=%s\\n' "$error_count" "$warning_count"
`,
			"solution/sample.log": `INFO booting
WARNING low-disk
ERROR failed-auth
INFO retry
ERROR timeout
`
		},
		python: {
			"starter/main.py": `#####################
###   CONSTANTS   ###
#####################
SAMPLE_VALUES = [3, 7, 11, 19]


#####################
###   FUNCTIONS   ###
#####################
# Transform each source value into a result list
def transform(values: list[int]) -> list[int]:
\tresult: list[int] = []

\t# Visit each value before deciding how to transform it
\tfor value in values:
\t\t# TODO: Transform the current value and append it to result
\t\tpass

\treturn result


# Run the sample transformation
def main() -> None:
\tprint(transform(SAMPLE_VALUES))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `#####################
###   CONSTANTS   ###
#####################
SAMPLE_VALUES = [3, 7, 11, 19]
TRANSFORM_MULTIPLIER = 2
TRANSFORM_OFFSET = 1


#####################
###   FUNCTIONS   ###
#####################
# Transform each source value into a result list
def transform(values: list[int]) -> list[int]:
\tresult: list[int] = []

\t# Visit each value before applying the transform
\tfor value in values:
\t\tresult.append(value * TRANSFORM_MULTIPLIER + TRANSFORM_OFFSET)

\treturn result


# Run the sample transformation
def main() -> None:
\tprint(transform(SAMPLE_VALUES))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`
		},
		"python-ai": {
			"starter/main.py": `#####################
###   CONSTANTS   ###
#####################
GRAPH = {
\t"A": ["B", "C"],
\t"B": ["D"],
\t"C": ["E", "F"],
\t"D": [],
\t"E": [],
\t"F": [],
}
START_NODE = "A"
GOAL_NODE = "F"


#####################
###   FUNCTIONS   ###
#####################
# Find one breadth-first path from the start node to the goal node
def breadth_first_path(start: str, goal: str) -> list[str]:
\t# TODO: Return one path from start to goal
\treturn []


# Run the sample search
def main() -> None:
\tprint(breadth_first_path(START_NODE, GOAL_NODE))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `from collections import deque

#####################
###   CONSTANTS   ###
#####################
GRAPH = {
\t"A": ["B", "C"],
\t"B": ["D"],
\t"C": ["E", "F"],
\t"D": [],
\t"E": [],
\t"F": [],
}
START_NODE = "A"
GOAL_NODE = "F"


#####################
###   FUNCTIONS   ###
#####################
# Find one breadth-first path from the start node to the goal node
def breadth_first_path(start: str, goal: str) -> list[str]:
\tqueue: deque[list[str]] = deque([[start]])
\tvisited = {start}

\t# Explore queued paths until a goal path is found
\twhile queue:
\t\tpath = queue.popleft()
\t\tnode = path[-1]

\t\t# Stop when the current path reaches the goal
\t\tif node == goal:
\t\t\treturn path

\t\t# Add each unvisited neighbor as a new candidate path
\t\tfor neighbor in GRAPH[node]:
\t\t\t# Skip neighbors that already have a queued path
\t\t\tif neighbor not in visited:
\t\t\t\tvisited.add(neighbor)
\t\t\t\tqueue.append([*path, neighbor])

\treturn []


# Run the sample search
def main() -> None:
\tprint(breadth_first_path(START_NODE, GOAL_NODE))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`
		},
		"python-data": {
			"starter/data/sample.csv": `label,value
alpha,4
beta,8
gamma,11
delta,17
`,
			"starter/main.py": `import csv
from pathlib import Path

#####################
###   CONSTANTS   ###
#####################
DATA_FILE = Path("data/sample.csv")


#####################
###   FUNCTIONS   ###
#####################
# Load integer values from the sample CSV file
def load_values() -> list[int]:
\twith DATA_FILE.open() as handle:
\t\treader = csv.DictReader(handle)
\t\treturn [int(row["value"]) for row in reader]


# Build summary statistics for a value list
def summarize(values: list[int]) -> dict[str, float]:
\t# TODO: Compute count, total, and average
\treturn {"count": 0, "total": 0, "average": 0.0}


# Run the sample data summary
def main() -> None:
\tprint(summarize(load_values()))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`,
			"solution/data/sample.csv": `label,value
alpha,4
beta,8
gamma,11
delta,17
`,
			"solution/main.py": `import csv
from pathlib import Path

#####################
###   CONSTANTS   ###
#####################
DATA_FILE = Path("data/sample.csv")
COUNT_KEY = "count"
TOTAL_KEY = "total"
AVERAGE_KEY = "average"


#####################
###   FUNCTIONS   ###
#####################
# Load integer values from the sample CSV file
def load_values() -> list[int]:
\twith DATA_FILE.open() as handle:
\t\treader = csv.DictReader(handle)
\t\treturn [int(row["value"]) for row in reader]


# Build summary statistics for a value list
def summarize(values: list[int]) -> dict[str, float]:
\ttotal = sum(values)
\tcount = len(values)
\taverage = total / count if count else 0.0

\treturn {COUNT_KEY: count, TOTAL_KEY: total, AVERAGE_KEY: average}


# Run the sample data summary
def main() -> None:
\tprint(summarize(load_values()))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`
		},
		"python-pattern": {
			"starter/main.py": `#####################
###   CONSTANTS   ###
#####################
SAMPLE_TEXT = "design patterns"


#####################
###   CLASSES   ###
#####################
# Define the shared formatter contract
class Formatter:
\tdef format(self, text: str) -> str:
\t\traise NotImplementedError


# Define the title-formatting implementation
class TitleFormatter(Formatter):
\tdef format(self, text: str) -> str:
\t\t# TODO: Return a transformed string
\t\treturn text


#####################
###   FUNCTIONS   ###
#####################
# Run the formatter example
def main() -> None:
\tprint(TitleFormatter().format(SAMPLE_TEXT))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `#####################
###   CONSTANTS   ###
#####################
SAMPLE_TEXT = "design patterns"


#####################
###   CLASSES   ###
#####################
# Define the shared formatter contract
class Formatter:
\tdef format(self, text: str) -> str:
\t\traise NotImplementedError


# Define the title-formatting implementation
class TitleFormatter(Formatter):
\tdef format(self, text: str) -> str:
\t\treturn text.title()


#####################
###   FUNCTIONS   ###
#####################
# Run the formatter example
def main() -> None:
\tprint(TitleFormatter().format(SAMPLE_TEXT))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`
		},
		"python-security": {
			"starter/main.py": `#####################
###   CONSTANTS   ###
#####################
SAMPLE_RAW_PORTS = ["22", "443", "8080", "bad"]


#####################
###   FUNCTIONS   ###
#####################
# Normalize raw port strings into integer ports
def normalize_ports(raw_values: list[str]) -> list[int]:
\tnormalized: list[int] = []

\t# Review each raw value before adding it to the result
\tfor raw_value in raw_values:
\t\t# TODO: Parse the current entry, reject invalid ports, and append safe values
\t\tpass

\treturn normalized


# Run the sample port normalization
def main() -> None:
\tprint(normalize_ports(SAMPLE_RAW_PORTS))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `#####################
###   CONSTANTS   ###
#####################
MIN_PORT_NUMBER = 1
MAX_PORT_NUMBER = 65535
SAMPLE_RAW_PORTS = ["22", "443", "8080", "bad"]


#####################
###   FUNCTIONS   ###
#####################
# Normalize raw port strings into integer ports
def normalize_ports(raw_values: list[str]) -> list[int]:
\tnormalized: list[int] = []

\t# Review each raw value before adding it to the result
\tfor raw_value in raw_values:
\t\t# Skip values that are not written as digits
\t\tif not raw_value.isdigit():
\t\t\tcontinue

\t\tport = int(raw_value)

\t\t# Accept only values inside the valid TCP/UDP port range
\t\tif MIN_PORT_NUMBER <= port <= MAX_PORT_NUMBER:
\t\t\tnormalized.append(port)

\treturn normalized


# Run the sample port normalization
def main() -> None:
\tprint(normalize_ports(SAMPLE_RAW_PORTS))


#####################
###   MAIN CODE   ###
#####################
if __name__ == "__main__":
\tmain()
`
		},
		rust: {
			"starter/Cargo.toml": `[package]
name = "rust_systems_security_lab"
version = "0.1.0"
edition = "2021"
`,
			"starter/src/main.rs": `const SAMPLE_INPUT: &str = "packet-42!";

// Sanitize one input string for safe display
fn sanitize(input: &str) -> String {
\t// TODO: Keep only ASCII alphanumeric characters and dashes
\tinput.to_string()
}

// Run the sanitizer example
fn main() {
\tprintln!("{}", sanitize(SAMPLE_INPUT));
}
`,
			"solution/Cargo.toml": `[package]
name = "rust_systems_security_lab"
version = "0.1.0"
edition = "2021"
`,
			"solution/src/main.rs": `const SAMPLE_INPUT: &str = "packet-42!";

// Sanitize one input string for safe display
fn sanitize(input: &str) -> String {
\t// Keep only characters allowed in the sanitized identifier
\tinput
\t\t.chars()
\t\t.filter(|ch| ch.is_ascii_alphanumeric() || *ch == '-')
\t\t.collect()
}

// Run the sanitizer example
fn main() {
\tprintln!("{}", sanitize(SAMPLE_INPUT));
}
`
		},
		swift: {
			"starter/App.swift": `import SwiftUI

// Define the starter SwiftUI app entry point
@main
struct StarterApp: App {
\t// Create the main app scene
\tvar body: some Scene {
\t\tWindowGroup {
\t\t\tContentView()
\t\t}
\t}
}
`,
			"starter/ContentView.swift": `import SwiftUI

private let PROJECT_TITLE = "${projectTitle}"
private let TODO_MESSAGE = "TODO: replace this with the module UI"
private let CONTENT_SPACING = 16.0

// Define the starter content view
struct ContentView: View {
\t// Build the visible starter interface
\tvar body: some View {
\t\tVStack(spacing: CONTENT_SPACING) {
\t\t\tText(PROJECT_TITLE)
\t\t\tText(TODO_MESSAGE)
\t\t}
\t\t.padding()
\t}
}
`,
			"solution/App.swift": `import SwiftUI

// Define the solution SwiftUI app entry point
@main
struct SolutionApp: App {
\t// Create the main app scene
\tvar body: some Scene {
\t\tWindowGroup {
\t\t\tContentView()
\t\t}
\t}
}
`,
			"solution/ContentView.swift": `import SwiftUI

private let PROJECT_TITLE = "${projectTitle}"
private let READY_MESSAGE = "Ready for extension work"
private let START_MESSAGE = "Work through the core requirements first"
private let TOGGLE_BUTTON_LABEL = "Toggle Status"
private let CONTENT_SPACING = 16.0

// Define the solution content view
struct ContentView: View {
\t@State private var is_complete = false

\t// Build the visible solution interface
\tvar body: some View {
\t\tVStack(spacing: CONTENT_SPACING) {
\t\t\tText(PROJECT_TITLE)
\t\t\tText(is_complete ? READY_MESSAGE : START_MESSAGE)
\t\t\tButton(TOGGLE_BUTTON_LABEL) {
\t\t\t\tis_complete.toggle()
\t\t\t}
\t\t}
\t\t.padding()
\t}
}
`
		},
		web: {
			"starter/index.html": `<!doctype html>
<html lang="en">
\t<head>
\t\t<meta charset="UTF-8">
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t\t<title>${projectTitle}</title>
\t\t<link rel="stylesheet" href="./styles.css">
\t</head>
\t<body>
\t\t<main class="app">
\t\t\t<h1>${projectTitle}</h1>
\t\t\t<p>Complete the TODOs in <code>script.js</code>.</p>
\t\t\t<button id="action">Add Entry</button>
\t\t\t<ul id="entries"></ul>
\t\t</main>
\t\t<script src="./script.js"></script>
\t</body>
</html>
`,
			"starter/styles.css": `body {
\tfont-family: "Helvetica Neue", Arial, sans-serif;
\tbackground: #f7f4ed;
\tcolor: #1f2937;
\tmargin: 0;
}

.app {
\tmax-width: 720px;
\tmargin: 48px auto;
\tpadding: 24px;
\tbackground: white;
\tborder-radius: 18px;
\tbox-shadow: 0 16px 48px rgba(15, 23, 42, 0.08);
}
`,
			"starter/script.js": `const action_button = document.querySelector("#action");
const entry_list = document.querySelector("#entries");

// Add a new checkpoint entry when the button is clicked
action_button.addEventListener("click", () => {
\t// TODO: Append a new list item that reflects the module work
});
`,
			"solution/index.html": `<!doctype html>
<html lang="en">
\t<head>
\t\t<meta charset="UTF-8">
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t\t<title>${projectTitle}</title>
\t\t<link rel="stylesheet" href="./styles.css">
\t</head>
\t<body>
\t\t<main class="app">
\t\t\t<h1>${projectTitle}</h1>
\t\t\t<p>Each click appends another verified entry.</p>
\t\t\t<button id="action">Add Entry</button>
\t\t\t<ul id="entries"></ul>
\t\t</main>
\t\t<script src="./script.js"></script>
\t</body>
</html>
`,
			"solution/styles.css": `body {
\tfont-family: "Helvetica Neue", Arial, sans-serif;
\tbackground: #f7f4ed;
\tcolor: #1f2937;
\tmargin: 0;
}

.app {
\tmax-width: 720px;
\tmargin: 48px auto;
\tpadding: 24px;
\tbackground: white;
\tborder-radius: 18px;
\tbox-shadow: 0 16px 48px rgba(15, 23, 42, 0.08);
}

li + li {
\tmargin-top: 10px;
}
`,
			"solution/script.js": `const action_button = document.querySelector("#action");
const entry_list = document.querySelector("#entries");

let entry_count = 0;

// Add a new checkpoint entry when the button is clicked
action_button.addEventListener("click", () => {
\tentry_count += 1;
\tconst item = document.createElement("li");
\titem.textContent = \`Entry \${entry_count}: module checkpoint recorded\`;
\tentry_list.append(item);
});
`
		}
	};

	return {
		"README.md": readme,
		...sharedByKind[projectKind]
	};
}

function firstHostRepo(config: CourseConfig, indexHint = 0) {
	return config.hostRepos[indexHint % config.hostRepos.length];
}

async function main() {
	const courseFileMap = await parseCourseFileMap();
	const allRepoNames = Array.from(
		new Set(
			Object.values(COURSE_CONFIG).flatMap(config => config.hostRepos)
		)
	);
	const repoResources = new Map<string, ResourceEntry[]>();
	const repoExistingPaths = new Map<string, Set<string>>();

	for (const repoName of allRepoNames) {
		const resources = await scanRepoResources(repoName);
		repoResources.set(repoName, resources);
		repoExistingPaths.set(
			repoName,
			new Set(resources.map(resource => resource.sourcePath))
		);
	}

	const globalUsedLinks = new Set<string>();

	for (const entry of courseCatalog) {
		const rawCourse = normalizeCourse(await loadRawCourse(entry.id));
		for (const module of rawCourse.modules) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				if (item.projectLink) {
					globalUsedLinks.add(item.projectLink);
				}
				if (item.solutionLink) {
					globalUsedLinks.add(item.solutionLink);
				}
			}
		}
	}

	for (const [repoName, resources] of repoResources) {
		repoResources.set(
			repoName,
			resources.filter(resource => {
				if (
					resource.projectLink &&
					globalUsedLinks.has(resource.projectLink)
				) {
					return false;
				}

				if (
					resource.solutionLink &&
					globalUsedLinks.has(resource.solutionLink)
				) {
					return false;
				}

				return true;
			})
		);
	}

	const createdCountByPrefix = new Map<string, number>();

	async function allocateResource(
		courseId: string,
		moduleTitle: string,
		indexHint = 0
	): Promise<ResourceEntry | null> {
		const config = COURSE_CONFIG[courseId];
		if (!config?.codeBacked || !config.projectKind) {
			return null;
		}

		for (let offset = 0; offset < config.hostRepos.length; offset++) {
			const repoName =
				config.hostRepos[
					(indexHint + offset) % config.hostRepos.length
				];
			const pool = repoResources.get(repoName) ?? [];
			const nextResource = pool.shift();
			if (nextResource) {
				if (nextResource.projectLink)
					globalUsedLinks.add(nextResource.projectLink);
				if (nextResource.solutionLink)
					globalUsedLinks.add(nextResource.solutionLink);
				return nextResource;
			}
		}

		const repoName = firstHostRepo(config, indexHint);
		const prefixCount = (createdCountByPrefix.get(config.prefix) ?? 0) + 1;
		createdCountByPrefix.set(config.prefix, prefixCount);
		const folderSlug = slugify(moduleTitle).slice(0, 48);
		const sourcePath = `${config.prefix}${String(prefixCount).padStart(2, "0")}-${folderSlug || "applied-studio"}`;
		const existingPaths = repoExistingPaths.get(repoName);
		let uniquePath = sourcePath;
		let suffix = 2;
		while (existingPaths?.has(uniquePath)) {
			uniquePath = `${sourcePath}-${suffix}`;
			suffix += 1;
		}
		existingPaths?.add(uniquePath);

		const repoPath = path.join(INSTRUCTION_MATERIAL_ROOT, repoName);
		const projectRoot = path.join(repoPath, uniquePath);
		const files = buildProjectFiles(
			config.projectKind,
			moduleTitle,
			(await loadRawCourse(courseId)).name,
			moduleTitle
		);

		for (const [relativeFilePath, content] of Object.entries(files)) {
			const absoluteFilePath = path.join(projectRoot, relativeFilePath);
			await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
			await fs.writeFile(absoluteFilePath, content, "utf8");
		}

		const createdResource = {
			label: moduleTitle,
			projectLink: `https://github.com/instruction-material/${repoName}/tree/main/${uniquePath}/starter`,
			solutionLink: `https://github.com/instruction-material/${repoName}/tree/main/${uniquePath}/solution`,
			sourcePath: uniquePath,
			repoName
		} satisfies ResourceEntry;

		if (createdResource.projectLink) {
			globalUsedLinks.add(createdResource.projectLink);
		}
		if (createdResource.solutionLink) {
			globalUsedLinks.add(createdResource.solutionLink);
		}

		return createdResource;
	}

	for (const entry of courseCatalog) {
		if (PYTHON_BASELINE_IDS.has(entry.id)) {
			continue;
		}

		const config = COURSE_CONFIG[entry.id];
		const fileName = courseFileMap.get(entry.id);
		if (!config || !fileName) {
			continue;
		}

		const filePath = path.join(COURSES_DIR, fileName);
		const originalFile = await fs.readFile(filePath, "utf8");
		const exportMatch = originalFile.match(
			/export const (\w+): RawCourse =/
		);
		if (!exportMatch) {
			throw new Error(`Unable to find course export in ${fileName}`);
		}
		const exportName = exportMatch[1];
		const normalizedCourse = normalizeCourse(await loadRawCourse(entry.id));
		const modules = [...normalizedCourse.modules];

		while (modules.length < TARGET_MODULE_COUNT) {
			const studioIndex = modules.length + 1;
			const resource = await allocateResource(
				entry.id,
				`${config.moduleFocus} ${studioIndex}`,
				studioIndex
			);
			const focus = nextFocusLabel(config.moduleFocus, resource, config);
			const moduleTitle = `${focus}: Implementation Lab`;
			const newModule: RawCourseModule = {
				title: moduleTitle,
				curriculum: [
					{
						title: `${focus}: Core Concepts`,
						content:
							"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
					},
					{
						title: `${focus}: Guided Example`,
						content: `A representative example for ${moduleTitle} names the key inputs, expected outputs, and checkpoints worth verifying early.`
					},
					{
						title: `${focus}: Core Project`,
						content:
							"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
						projectLink: resource?.projectLink,
						solutionLink: resource?.solutionLink
					},
					{
						title: `${focus}: Review and Reflection`,
						content:
							"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
					}
				],
				supplementalProjects: [
					{
						title: `${focus}: Extension Challenge`,
						content:
							"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
						projectLink: resource?.projectLink,
						solutionLink: resource?.solutionLink
					},
					{
						title: `${focus}: Open Practice`,
						content: `Create a compact variant inspired by ${moduleTitle}. Keep the scope tight, but require one meaningful design or reasoning decision.`
					},
					{
						title: `${focus}: Integration Drill`,
						content: `Rebuild one part of ${moduleTitle} under a slightly different constraint so the work transfers beyond the exact same steps.`
					}
				]
			};
			modules.push(newModule);
		}

		for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
			const module = modules[moduleIndex];
			const linkedItem = firstLinkedItem(module);
			let resource: ResourceEntry | null = linkedItem
				? {
						label: module.title,
						projectLink: linkedItem.projectLink,
						solutionLink: linkedItem.solutionLink,
						sourcePath: "",
						repoName: ""
					}
				: null;

			while (module.curriculum.length < TARGET_CURRICULUM_ITEMS) {
				const focus = nextFocusLabel(module.title, resource, config);
				module.curriculum.push(
					buildCurriculumSupportItem(
						module.title,
						focus,
						module.curriculum.length + 1
					)
				);
			}

			if (config.codeBacked) {
				for (
					let supplementalIndex = 0;
					supplementalIndex < module.supplementalProjects.length;
					supplementalIndex++
				) {
					const supplementalProject =
						module.supplementalProjects[supplementalIndex];

					if (
						supplementalProject.projectLink ||
						supplementalProject.solutionLink
					) {
						continue;
					}

					const supplementalResource = await allocateResource(
						entry.id,
						`${module.title} supplemental ${supplementalIndex + 1}`,
						moduleIndex + supplementalIndex + 1
					);

					if (!supplementalResource) {
						continue;
					}

					const focus = nextFocusLabel(
						module.title,
						supplementalResource,
						config
					);
					module.supplementalProjects[supplementalIndex] =
						buildLinkedSupplementalProjectItem(
							module.title,
							focus,
							supplementalIndex + 1,
							supplementalResource
						);
				}
			}

			while (
				module.supplementalProjects.length < TARGET_SUPPLEMENTAL_ITEMS
			) {
				const focus = nextFocusLabel(module.title, resource, config);
				const supplementalIndex =
					module.supplementalProjects.length + 1;
				if (config.codeBacked) {
					const supplementalResource = await allocateResource(
						entry.id,
						`${module.title} supplemental ${supplementalIndex}`,
						moduleIndex + supplementalIndex
					);

					if (supplementalResource) {
						module.supplementalProjects.push(
							buildLinkedSupplementalProjectItem(
								module.title,
								nextFocusLabel(
									module.title,
									supplementalResource,
									config
								),
								supplementalIndex,
								supplementalResource
							)
						);
						continue;
					}
				}

				module.supplementalProjects.push(
					buildSupplementalSupportItem(
						module.title,
						focus,
						supplementalIndex
					)
				);
			}

			if (!resource && config.codeBacked) {
				resource = await allocateResource(
					entry.id,
					module.title,
					moduleIndex
				);
			}

			if (
				resource &&
				!module.curriculum.some(
					item => item.projectLink || item.solutionLink
				)
			) {
				module.curriculum.push({
					title: `${module.title}: Core Project`,
					content: `Core implementation project for ${module.title}. The starter provides the working artifact, and the completed review path includes at least one custom verification case.`,
					projectLink: resource.projectLink,
					solutionLink: resource.solutionLink
				});
			}

			if (
				resource &&
				!module.supplementalProjects.some(
					item => item.projectLink || item.solutionLink
				)
			) {
				module.supplementalProjects[0] = {
					...module.supplementalProjects[0],
					projectLink: resource.projectLink,
					solutionLink: resource.solutionLink
				};
			}

			if (
				resource &&
				module.curriculum.length > 0 &&
				!module.curriculum.some(
					item => item.projectLink || item.solutionLink
				)
			) {
				const projectItem =
					module.curriculum.find(item =>
						/\bproject\b|\bcapstone\b/i.test(item.title)
					) ?? module.curriculum[module.curriculum.length - 1];
				projectItem.projectLink = resource.projectLink;
				projectItem.solutionLink = resource.solutionLink;
			}

			module.curriculum = module.curriculum.map(item => ({
				...item,
				content: expandSlightly(
					item.title,
					normalizeContent(item.content)
				)
			}));
			module.supplementalProjects = module.supplementalProjects.map(
				item => ({
					...item,
					content: expandSlightly(
						item.title,
						normalizeContent(item.content)
					)
				})
			);
		}

		const nextCourse: RawCourse = {
			name: normalizedCourse.name,
			modules
		};
		const nextFile = `import type { RawCourse } from "./types";

export const ${exportName}: RawCourse = ${JSON.stringify(nextCourse, null, "\t")};
`;

		const formattedFile = await prettier.format(nextFile, {
			...((await prettier.resolveConfig(filePath)) ?? {}),
			filepath: filePath
		});

		await fs.writeFile(filePath, formattedFile, "utf8");
	}
}

main().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
