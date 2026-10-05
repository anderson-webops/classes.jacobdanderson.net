import { afterEach, describe, expect, it, vi } from "vitest";
import { strFromU8, unzipSync } from "fflate";
import { cppBuildInstructions } from "../src/modules/cppBuildInstructions";
import { createProjectArchive } from "../src/modules/projectArchive";
import { pythonIdeCompletionsForMode } from "../src/modules/pythonCodeMirror";
import { sandboxRun } from "../src/modules/pythonSandbox";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	getPythonIdeDefaultFileContent,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseId,
	pythonIdeModeForCourseResource,
	pythonIdeProjectToPayload,
	saveLocalPythonProjects
} from "../src/modules/pythonIde";
import { resetCodePreviewCaches } from "../src/modules/codePreview";

afterEach(() => {
	vi.unstubAllGlobals();
	resetCodePreviewCaches();
	clearLocalPythonProjects();
});

describe("C++ source workspace", () => {
	it("uses C++ mode for the catalog's legacy Level 1 ID and typed courses", () => {
		for (const id of [
			"c-level-1",
			"cpp-level-2",
			"cpp-level-3",
			"data-structures-and-algorithms-in-cpp",
			"design-patterns-in-cpp"
		])
			expect(pythonIdeModeForCourseId(id)).toBe("cpp");
		const root =
			"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/";
		expect(
			pythonIdeModeForCourseResource(
				"python-to-java-and-cpp-bridge",
				root + "PTJ4-Shared-Class-Port/starter/cpp"
			)
		).toBe("cpp");
		expect(
			pythonIdeModeForCourseResource(
				"python-to-java-and-cpp-bridge",
				root + "PTJ4-Shared-Class-Port/starter/java"
			)
		).toBe("java");
	});

	it("preserves nested C++ sources and headers through save and ZIP export", () => {
		const project = createPythonIdeProject("cpp");
		project.files = [
			{
				name: "main.cpp",
				content: '#include "include/Task.hpp"\nint main() {}\n'
			},
			{ name: "src/Task.cc", content: '#include "include/Task.hpp"\n' },
			{ name: "include/Task.hpp", content: "#pragma once\n" },
			{ name: "README.md", content: "Build both sources.\n" }
		];
		for (const file of project.files)
			expect(isValidPythonFileName(file.name)).toBe(true);
		for (const name of [
			"../main.cpp",
			"/main.cpp",
			"src//main.cpp",
			"images/main.cpp",
			"main';echo.cpp"
		])
			expect(isValidPythonFileName(name)).toBe(false);
		saveLocalPythonProjects([project]);
		const [saved] = loadLocalPythonProjects();
		expect(saved?.mode).toBe("cpp");
		expect(saved?.files).toEqual(project.files);
		expect(pythonIdeProjectToPayload(project).mode).toBe("cpp");
		const exported = unzipSync(createProjectArchive(project));
		for (const file of project.files)
			expect(strFromU8(exported[`${project.title}/${file.name}`]!)).toBe(
				file.content
			);
	});

	it("imports every source and header without importing reference answers", async () => {
		const contents: Record<string, string> = {
			"main.cpp": '#include "BankAccount.h"\nint main() {}\n',
			"BankAccount.cpp": "// Implement the operations from README.md.\n",
			"BankAccount.h": "#pragma once\n",
			"README.md": "Starter brief\n"
		};
		const base =
			"https://raw.githubusercontent.com/example/course/main/starter/";
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: string) => {
				requests.push(String(input));
				if (String(input).startsWith("https://api.github.com/"))
					return new Response(
						JSON.stringify(
							Object.keys(contents).map(name => ({
								type: "file",
								name,
								path: `starter/${name}`,
								size: contents[name]!.length,
								download_url: base + name,
								html_url: `https://github.com/example/course/blob/main/starter/${name}`
							}))
						)
					);
				return new Response(contents[String(input).slice(base.length)]);
			})
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(
			"https://github.com/example/course/tree/main/starter",
			"cpp"
		);
		expect(
			Object.fromEntries(files.map(file => [file.name, file.content]))
		).toEqual(contents);
		expect(requests).toHaveLength(5);
		expect(requests.every(url => !url.includes("solution"))).toBe(true);
	});

	it("gives a complete native command without pretending to execute C++", () => {
		expect(getPythonIdeDefaultFileContent("main.cpp")).toContain("int main()");
		for (const name of ["Helper.cpp", "src/Task.cc", "Helper.cxx"])
			expect(getPythonIdeDefaultFileContent(name)).not.toContain("int main");
		const files = [
			{ name: "main.cpp", content: "" },
			{ name: "src/Helper.cxx", content: "" },
			{ name: "include/Helper.h", content: "" },
			{ name: "../bad.cpp", content: "" },
			{ name: "file';touch.cpp", content: "" }
		];
		const instructions = cppBuildInstructions(files).join("\n");
		expect(instructions).toContain(
			"'main.cpp' 'src/Helper.cxx' -o project"
		);
		expect(instructions).not.toMatch(/Helper\.h|bad\.cpp|touch/);
		expect(instructions).toContain("does not compile or execute");
		expect(
			cppBuildInstructions([{ name: "Helper.h", content: "" }]).join("\n")
		).toContain("Add a .cpp");
		expect(pythonIdeCompletionsForMode("cpp")).toEqual([]);
		expect(
			sandboxRun({
				mode: "cpp",
				files,
				activeFileName: "main.cpp",
				inputText: ""
			})
		).toBeNull();
	});
});
