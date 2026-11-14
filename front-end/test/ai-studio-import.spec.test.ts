import { createHash, webcrypto } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { resetCodePreviewCaches } from "@/modules/codePreview";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjectsAsync,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseId,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/ai-studio-sources.json"), "utf8")
);
const prefix =
	"https://github.com/instruction-material/AI-Level-1/tree/" +
	fixture.revision +
	"/";
const hash = (value: string) =>
	createHash("sha256").update(value).digest("hex");

vi.mock("@/api", () => ({
	api: { get: vi.fn().mockResolvedValue({ data: [] }), put: vi.fn() }
}));
afterEach(async () => {
	vi.unstubAllGlobals();
	resetCodePreviewCaches();
	await clearLocalPythonProjects();
});

it("retains seven published studio tasks while supplying concrete worked cases and distinct role actions", async () => {
	expect(pythonIdeModeForCourseId("ai-level-1")).toBe("data");
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "ai-studio-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["ai-level-1"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = await useCoursesStore().loadCourseById("ai-level-1");
	const records = [];
	for (const project of fixture.projects) {
		const starter = prefix + project.folder + "/starter";
		const reference = prefix + project.folder + "/solution";
		const module = course!.modules.find(m =>
			m.curriculum.some(i => i.projectLink === starter)
		)!;
		expect(module, project.key).toBeTruthy();
		const task = module.curriculum.find(i => i.projectLink === starter)!;
		expect(task.solutionLink).toBe(reference);
		const reading = module.curriculum.find(
			i =>
				i.title === project.readingTitle ||
				i.aliases?.includes(project.readingTitle)
		)!;
		expect(reading, project.key).toBeTruthy();
		expect(reading.content).toContain("## Worked case");
		expect(reading.content).toContain("## Build and verify");
		expect(reading.content).not.toContain(
			"Record the input, expected output"
		);
		records.push({
			key: project.key,
			moduleId: module.id,
			itemId: task.id,
			readingId: reading.id,
			readingText: reading.content
		});
	}
	expect(new Set(records.map(r => r.itemId)).size).toBe(7);
	if (process.env.AI_STUDIO_CATALOG_PROOF_FILE)
		writeFileSync(
			process.env.AI_STUDIO_CATALOG_PROOF_FILE,
			JSON.stringify(records, null, 2) + "\n"
		);
});

for (const project of fixture.projects) {
	for (const role of ["starter", "solution"]) {
		it(
			"imports, saves, reopens and exports exact " +
				project.key +
				" " +
				role +
				" files",
			async () => {
				vi.stubGlobal("crypto", webcrypto);
				const folder = project.folder + "/" + role;
				const expected = Object.fromEntries(
					["main.py", "README.md"].map(name => [
						name,
						fixture.files[folder + "/" + name]
					])
				);
				const requests: string[] = [];
				vi.stubGlobal(
					"fetch",
					vi.fn(async (input: string | URL | Request) => {
						const url = new URL(String(input));
						requests.push(String(url));
						if (url.hostname === "api.github.com") {
							expect(url.searchParams.get("ref")).toBe(
								fixture.revision
							);
							expect(decodeURIComponent(url.pathname)).toBe(
								"/repos/instruction-material/AI-Level-1/contents/" +
									folder
							);
							return new Response(
								JSON.stringify(
									Object.entries(expected).map(
										([name, file]: [string, any]) => ({
											type: "file",
											name,
											path: folder + "/" + name,
											size: file.byteLength,
											sha: file.gitBlob,
											html_url:
												"https://github.com/instruction-material/AI-Level-1/blob/" +
												fixture.revision +
												"/" +
												folder +
												"/" +
												name,
											download_url:
												"https://raw.githubusercontent.com/instruction-material/AI-Level-1/" +
												fixture.revision +
												"/" +
												folder +
												"/" +
												name
										})
									)
								)
							);
						}
						expect(url.hostname).toBe("raw.githubusercontent.com");
						const name = url.pathname.split("/").at(-1)!;
						expect(url.pathname).toBe(
							"/instruction-material/AI-Level-1/" +
								fixture.revision +
								"/" +
								folder +
								"/" +
								name
						);
						expect(expected[name]).toBeTruthy();
						return new Response(expected[name].content);
					})
				);
				const imported = await loadPythonIdeStarterFilesFromGitHub(
					prefix + folder,
					"data"
				);
				expect(imported).toHaveLength(2);
				for (const file of imported) {
					expect(file.content).toBe(expected[file.name].content);
					expect(hash(file.content)).toBe(expected[file.name].sha256);
				}
				const code = imported.find(
					file => file.name === "main.py"
				)!.content;
				expect(code.includes("NotImplementedError")).toBe(
					role === "starter"
				);
				const savedProject = createPythonIdeProject("data", {
					courseID: "ai-level-1",
					files: imported
				});
				savedProject.files.find(
					file => file.name === "main.py"
				)!.content += "\n# Saved studio variation\n";
				saveLocalPythonProjects([savedProject]);
				const reopened = (await loadLocalPythonProjectsAsync()).find(
					p => p._id === savedProject._id
				)!;
				expect(reopened.files).toEqual(savedProject.files);
				const archive = unzipSync(await createProjectArchive(reopened));
				expect(Object.keys(archive)).toHaveLength(2);
				for (const file of reopened.files) {
					const name = Object.keys(archive).find(
						n => n === file.name || n.endsWith("/" + file.name)
					)!;
					expect(strFromU8(archive[name])).toBe(file.content);
				}
				expect(requests).toHaveLength(3);
			}
		);
	}
}
