import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export interface SourceReadinessOptions {
	sourceRoot: string;
	repository: string | null;
	write: boolean;
}

const localCourseFolders: Record<string, string> = {
	"CPP-Level-1": "C++ Level 1",
	"CPP-Level-2": "C++ Level 2",
	"CPP-Level-3": "C++ Level 3",
	"Data-Structures-and-Algorithms-in-CPP":
		"Data Structures and Algorithms in C++",
	"Python-Level-3": "Python Level 3",
	"Python-to-Java-and-CPP-Bridge": "Python to Java and C++ Bridge",
	"USACO-Bronze": "USACO Bronze",
	"USACO-Gold": "USACO Gold",
	"USACO-Silver": "USACO Silver",
	Swift: "Intro to Swift App Development",
	"Low-Level-Security": "Low Level Security",
	"Linux-Systems": "Linux Systems",
	"Web-Development-Foundations": "Web Development Foundations"
};

export function parseSourceReadinessOptions(args: string[]) {
	const options: SourceReadinessOptions = {
		sourceRoot: path.join(os.homedir(), "Documents", "Work", "Juni"),
		repository: null,
		write: false
	};
	let dryRun = false;
	for (let index = 0; index < args.length; index++) {
		const argument = args[index];
		if (argument === "--write") {
			options.write = true;
		} else if (argument === "--dry-run") {
			dryRun = true;
		} else if (argument === "--source-root" || argument === "--repo") {
			const value = args[++index];
			if (!value || value.startsWith("--")) {
				throw new Error(`Missing value for ${argument}`);
			}
			if (argument === "--source-root") {
				options.sourceRoot = path.resolve(value);
			} else {
				if (options.repository)
					throw new Error("Select only one --repo");
				if (!/^[\w-]+$/.test(value)) {
					throw new Error("Invalid repository name");
				}
				options.repository = value;
			}
		} else {
			throw new Error(`Unknown option: ${argument}`);
		}
	}
	if (options.write && (dryRun || !options.repository)) {
		throw new Error("--write requires one --repo and cannot use --dry-run");
	}
	return options;
}

export function sourceReadinessRepositoryRoot(
	options: SourceReadinessOptions,
	repository: string
) {
	const folder = localCourseFolders[repository] ?? repository;
	const root = path.join(options.sourceRoot, folder);
	if (!fs.existsSync(root)) return null;
	const sourceRoot = fs.realpathSync(options.sourceRoot);
	const relative = path.relative(sourceRoot, fs.realpathSync(root));
	if (
		relative.startsWith(`..${path.sep}`) ||
		relative === ".." ||
		path.isAbsolute(relative) ||
		!fs.statSync(root).isDirectory()
	) {
		throw new Error(`Source repository leaves the selected root: ${root}`);
	}
	return root;
}

export function writeSourceReadinessFile(
	sourceRoot: string,
	file: string,
	content: string,
	write: boolean,
	mode = 0o644
) {
	const root = path.resolve(sourceRoot);
	const relative = path.relative(root, path.resolve(file));
	if (
		!relative ||
		relative === ".." ||
		relative.startsWith(`..${path.sep}`) ||
		path.isAbsolute(relative)
	) {
		throw new Error("Readiness file leaves the selected source root");
	}
	for (
		let parent = path.dirname(path.resolve(file));
		parent !== root;
		parent = path.dirname(parent)
	) {
		if (fs.lstatSync(parent, { throwIfNoEntry: false })?.isSymbolicLink()) {
			throw new Error(
				`Readiness directory is a symbolic link: ${parent}`
			);
		}
	}
	// Existing authored gates, role ledgers and project files own their contents
	// and modes. Even --write only bootstraps missing files.
	if (fs.lstatSync(file, { throwIfNoEntry: false })) {
		return "preserved";
	}
	if (!write) return "proposed";
	fs.mkdirSync(path.dirname(file), { recursive: true });
	// Exclusive creation also protects a file created after the existence check.
	fs.writeFileSync(file, `${content.trim()}\n`, { flag: "wx", mode });
	return "created";
}
