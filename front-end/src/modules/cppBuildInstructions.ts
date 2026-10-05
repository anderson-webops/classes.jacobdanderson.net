import type { PythonIdeFile } from "@/modules/pythonIde";
import { isValidPythonFileName } from "@/modules/pythonIde";

export function cppBuildInstructions(files: PythonIdeFile[]) {
	const sources = files
		.filter(
			file =>
				/\.(?:cc|cpp|cxx)$/i.test(file.name) &&
				isValidPythonFileName(file.name) &&
				file.encoding !== "base64"
		)
		.map(file => `'${file.name}'`);
	return [
		"Save and download the ZIP, then extract it before compiling.",
		"The browser edits this C++ project; it does not compile or execute it.",
		...(sources.length
			? [
					"For this console project in a macOS/Linux shell with a C++17 compiler:",
					`c++ -std=c++17 -Wall -Wextra -pedantic -I. ${sources.join(" ")} -o project`,
					"./project"
				]
			: ["Add a .cpp, .cc or .cxx source file before building."]),
		"Use the course README for custom compiler options, dependencies and input checks."
	];
}
