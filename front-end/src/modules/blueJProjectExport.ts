import type { PythonIdeFile, PythonIdeProject } from "@/modules/pythonIde";
import { strToU8, zipSync } from "fflate";
import {
	isPythonIdeJavaFile,
	isPythonIdeTextFile,
	isValidPythonFileName
} from "@/modules/pythonIde";

const BLUEJ_PROJECT_FILE_NAME = "package.bluej";
const BLUEJ_README_FILE_NAME = "README.TXT";
const BLUEJ_HOME_URL = "https://www.bluej.org/";
const BLUEJ_SOURCE_URL = "https://github.com/k-pet-group/BlueJ-Greenfoot";
const JAVA_IDENTIFIER_RE = /^[A-Z_$][\w$]*$/i;

export { BLUEJ_HOME_URL, BLUEJ_SOURCE_URL };

export interface BlueJProjectExportFile {
	name: string;
	content: string;
}

function safeBlueJProjectName(value: string) {
	const normalized = value
		.trim()
		.replaceAll(/[^\w-]+/g, "-")
		.replaceAll(/^-+|-+$/g, "");
	return normalized || "classes-bluej-project";
}

export function blueJProjectArchiveName(
	project: Pick<PythonIdeProject, "title">
) {
	return `${safeBlueJProjectName(project.title)}.zip`;
}

function blueJProjectFolderName(project: Pick<PythonIdeProject, "title">) {
	return safeBlueJProjectName(project.title);
}

function javaClassNameForBlueJTarget(fileName: string) {
	return (
		fileName
			.split("/")
			.filter(Boolean)
			.at(-1)
			?.replace(/\.java$/i, "") ?? ""
	);
}

function isBlueJTargetJavaFile(file: PythonIdeFile) {
	if (!isPythonIdeJavaFile(file.name) || file.name.includes("/"))
		return false;
	return JAVA_IDENTIFIER_RE.test(javaClassNameForBlueJTarget(file.name));
}

function blueJTargetLines(file: PythonIdeFile, index: number) {
	const targetNumber = index + 1;
	const column = index % 4;
	const row = Math.floor(index / 4);
	const name = javaClassNameForBlueJTarget(file.name);
	return [
		`target${targetNumber}.height=50`,
		`target${targetNumber}.name=${name}`,
		`target${targetNumber}.naviview.expanded=true`,
		`target${targetNumber}.showInterface=false`,
		`target${targetNumber}.type=ClassTarget`,
		`target${targetNumber}.width=${Math.max(80, name.length * 9)}`,
		`target${targetNumber}.x=${80 + column * 150}`,
		`target${targetNumber}.y=${70 + row * 110}`
	];
}

export function createBlueJPackageFile(files: PythonIdeFile[]) {
	const javaFiles = files.filter(isBlueJTargetJavaFile);
	return [
		"#BlueJ package file",
		"editor.fx.0.height=0",
		"editor.fx.0.width=0",
		"editor.fx.0.x=0",
		"editor.fx.0.y=0",
		"objectbench.height=96",
		"objectbench.width=760",
		"package.divider.horizontal=0.6",
		"package.divider.vertical=0.84",
		"package.editor.height=520",
		"package.editor.width=820",
		"package.editor.x=40",
		"package.editor.y=40",
		"package.frame.height=720",
		"package.frame.width=960",
		"package.numDependencies=0",
		`package.numTargets=${javaFiles.length}`,
		"package.showExtends=true",
		"package.showUses=true",
		"project.charset=UTF-8",
		"readme.height=58",
		"readme.name=@README",
		"readme.width=47",
		"readme.x=10",
		"readme.y=10",
		...javaFiles.flatMap(blueJTargetLines),
		""
	].join("\n");
}

function defaultBlueJReadme(project: Pick<PythonIdeProject, "title">) {
	return `BlueJ project exported from Classes Code IDE.

Project: ${project.title || "Untitled Java Project"}

Open this ZIP in BlueJ with File > Open Project, or unzip it and open the project folder.
BlueJ: ${BLUEJ_HOME_URL}
BlueJ source: ${BLUEJ_SOURCE_URL}
`;
}

function isBlueJExportableTextFile(file: PythonIdeFile) {
	return (
		file.encoding !== "base64" &&
		isValidPythonFileName(file.name) &&
		isPythonIdeTextFile(file.name) &&
		file.name.toLowerCase() !== BLUEJ_PROJECT_FILE_NAME
	);
}

function blueJExportFileName(file: PythonIdeFile) {
	return file.name.toUpperCase() === BLUEJ_README_FILE_NAME
		? BLUEJ_README_FILE_NAME
		: file.name;
}

export function createBlueJProjectFiles(
	project: Pick<PythonIdeProject, "files" | "title">
): BlueJProjectExportFile[] {
	const files: BlueJProjectExportFile[] = [];
	const usedFileNames = new Set<string>();

	for (const file of project.files) {
		if (!isBlueJExportableTextFile(file)) continue;

		const name = blueJExportFileName(file);
		if (usedFileNames.has(name)) continue;

		usedFileNames.add(name);
		files.push({
			name,
			content: file.content
		});
	}

	if (!usedFileNames.has(BLUEJ_README_FILE_NAME)) {
		files.push({
			name: BLUEJ_README_FILE_NAME,
			content: defaultBlueJReadme(project)
		});
	}

	files.push({
		name: BLUEJ_PROJECT_FILE_NAME,
		content: createBlueJPackageFile(files)
	});

	return files;
}

export function createBlueJProjectArchive(project: PythonIdeProject) {
	const folderName = blueJProjectFolderName(project);
	const entries = Object.fromEntries(
		createBlueJProjectFiles(project).map(file => [
			`${folderName}/${file.name}`,
			strToU8(file.content)
		])
	);
	return zipSync(entries);
}
