import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { strFromU8, unzipSync } from "fflate";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { resetCodePreviewCaches } from "../src/modules/codePreview";
import {
	createPythonIdeProject,
	getPythonIdeDefaultFileContent,
	getPythonIdeFileKindLabel,
	isPythonIdeTextFile,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeFileUploadAccept,
	saveLocalPythonProjects
} from "../src/modules/pythonIde";
import { createProjectArchive } from "../src/modules/projectArchive";

describe("Conway input-file workflow", () => {
	afterEach(() => vi.unstubAllGlobals());
	beforeEach(() => {
		resetCodePreviewCaches();
		const storage = new Map<string, string>();
		Object.defineProperty(window, "localStorage", {
			configurable: true,
			value: {
				getItem: (key: string) => storage.get(key) ?? null,
				setItem: (key: string, value: string) => storage.set(key, value)
			}
		});
	});

	it("imports original input records, saves them and exports exact bytes", async () => {
		const source = {
			"main.py": 'print("learner reminder")\n',
			"README.md": "# Learner instructions\n",
			"player1.in": "4 0 \r\n4 1\r\n5 2",
			"player2.in": "4 8\n5 6\n"
		};
		const calls: string[] = [];
		vi.stubGlobal("fetch", async (input: string | URL | Request) => {
			const url = String(input);
			calls.push(url);
			if (new URL(url).hostname === "api.github.com")
				return new Response(
					JSON.stringify(
						Object.entries(source).map(([name, content]) => ({
							name,
							type: "file",
							size: new TextEncoder().encode(content).length,
							path: "AM13-Two-Player-Conways/starter/" + name,
							html_url:
								"https://github.com/instruction-material/Python-Level-3/blob/main/AM13-Two-Player-Conways/starter/" +
								name,
							download_url:
								"https://raw.githubusercontent.com/instruction-material/Python-Level-3/main/AM13-Two-Player-Conways/starter/" +
								name
						}))
					),
					{ status: 200 }
				);
			const name = new URL(url).pathname
				.split("/")
				.at(-1)! as keyof typeof source;
			return new Response(source[name], { status: 200 });
		});
		const files = await loadPythonIdeStarterFilesFromGitHub(
			"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Two-Player-Conways/starter"
		);
		expect(calls).toHaveLength(5);
		expect(files.map(file => file.name).sort()).toEqual(
			Object.keys(source).sort()
		);
		for (const file of files)
			expect(file.content).toBe(source[file.name as keyof typeof source]);
		const project = createPythonIdeProject("python", {
			title: "Conway",
			files
		});
		saveLocalPythonProjects([project]);
		const reopened = loadLocalPythonProjects()[0]!;
		expect(reopened.files).toEqual(project.files);
		const zip = unzipSync(createProjectArchive(reopened));
		for (const [name, text] of Object.entries(source))
			expect(strFromU8(zip["Conway/" + name]!)).toBe(text);
	});

	it("treats pattern files as text while retaining filename restrictions", () => {
		expect(pythonIdeFileUploadAccept.split(",")).toContain(".in");
		expect(isValidPythonFileName("repeat.in")).toBe(true);
		expect(isPythonIdeTextFile("player1.in")).toBe(true);
		expect(getPythonIdeFileKindLabel("repeat.in")).toBe("Text");
		expect(getPythonIdeDefaultFileContent("repeat.in")).toBe("");
		for (const path of [
			"../repeat.in",
			"/repeat.in",
			"folder/repeat.in",
			"_classes_artifacts.py"
		])
			expect(isValidPythonFileName(path)).toBe(false);
	});

	it("captures generated pattern records through both runtime implementations", () => {
		const directory = mkdtempSync(join(tmpdir(), "conway-capture-"));
		const records = "4 0 \r\n4 1\r\n5 2";
		try {
			writeFileSync(join(directory, "repeat.in"), records);
			writeFileSync(join(directory, "workflow.in"), "");
			writeFileSync(join(directory, "invalid.in"), new Uint8Array([255]));
			for (const path of [
				"modules/pythonIdeRuntime.ts",
				"workers/pythonIdePlainWorker.ts"
			]) {
				const source = readFileSync(
					resolve(__dirname, "../src", path),
					"utf8"
				);
				const capture = source.slice(
					source.indexOf("async function captureProjectTextFiles")
				);
				const script = capture
					.split(
						"const snapshot = await pyodide.runPythonAsync(`"
					)[1]!
					.split("`);")[0]!
					.replace(
						"${escapePythonString(PROJECT_ROOT)}",
						JSON.stringify(directory)
					);
				const actual = JSON.parse(
					execFileSync(
						"python3",
						[
							"-B",
							"-c",
							script + "\nprint(json.dumps(__classes_files))"
						],
						{
							encoding: "utf8",
							timeout: 5000
						}
					)
				);
				expect(actual).toEqual([
					{ name: "repeat.in", content: records, encoding: "text" },
					{ name: "workflow.in", content: "", encoding: "text" }
				]);
			}
		} finally {
			rmSync(directory, { recursive: true, force: true });
		}
	});
});
