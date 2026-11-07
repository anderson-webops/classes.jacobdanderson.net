import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../test/fixtures/java-recursion-sources.json";
import originals from "./fixtures/java-recursion-published-identities.json";
import { javaLevel3Course } from "@/stores/courses/java-level-3";
import {
	javaRecursionContinuations,
	javaRecursionImportFiles,
	javaRecursionModuleID,
	javaRecursionProjects,
	javaRecursionProjectKey,
	javaRecursionResource,
	javaRecursionURL
} from "@/modules/javaRecursionResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useCoursesStore } from "@/stores/courses";

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
const sources: Record<string, { content: string; sha256: string }> =
	fixture.files;
const folders = [
	...new Set(
		Object.keys(sources).map(path => path.split("/").slice(0, -1).join("/"))
	)
];

it.each(folders)(
	"preserves exact %s files through import, edit, save and ZIP export",
	async folder => {
		vi.stubGlobal("crypto", webcrypto);
		const requested: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => {
				const prefix =
					"https://raw.githubusercontent.com/" +
					fixture.repository +
					"/" +
					fixture.revision +
					"/";
				expect(url.startsWith(prefix)).toBe(true);
				const path = url.slice(prefix.length);
				requested.push(path);
				expect(sources[path], path).toBeDefined();
				return new Response(sources[path].content);
			})
		);
		const url = javaRecursionURL(folder);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "java");
		expect(files.map(file => file.name)).toEqual([
			"Main.java",
			"ContractTests.java",
			"README.md"
		]);
		expect(requested).toEqual(files.map(file => folder + "/" + file.name));
		for (const file of files) {
			expect(file.content).toBe(
				sources[folder + "/" + file.name].content
			);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(sources[folder + "/" + file.name].sha256);
		}
		const old = createPythonIdeProject("java", {
			files: [
				{
					name: "Main.java",
					content: "// earlier attempt",
					encoding: "text"
				}
			],
			courseProjectKey: "legacy-recursion"
		});
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: "new-recursion"
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files[0].content += "\n// saved recursion trace\n";
		await saveLocalPythonProjects([old, project]);
		expect(await loadLocalPythonProjects()).toEqual([old, project]);
		const archive = unzipSync(await createProjectArchive(project));
		expect(Object.keys(archive)).toHaveLength(3);
		for (const file of project.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	}
);

it("retains published AJ4 identities and complete authored bodies after normalization", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById("java-level-3"))!;
	const module = course.modules.find(
		module => module.id === javaRecursionModuleID
	)!;
	const raw = javaLevel3Course.modules.find(
		module => module.title === "AJ4 Recursion"
	)!;
	for (const section of ["curriculum", "supplementalProjects"] as const) {
		expect(
			module[section].map(({ id, aliases, title }) => ({
				id,
				...(aliases ? { aliases } : {}),
				title
			}))
		).toEqual(originals[section]);
		for (const item of module[section]) {
			expect(item.content).not.toMatch(/\b(?:instructor|tutor)\b/i);
			expect(item.content).toBe(
				raw[section].find(row => row.id === item.id)!.content.trim()
			);
			expect(item.contentKind).toBe(
				item.id.includes("core-concepts") ? "reading" : "assignment"
			);
		}
	}
	expect(module.curriculum).toHaveLength(3);
	expect(module.supplementalProjects).toHaveLength(3);
	for (const section of ["curriculum", "supplementalProjects"] as const) {
		for (const item of module[section]) {
			for (const [, href] of item.content.matchAll(
				/\[[^\]]+\]\((\/course-resource-viewer[^)]+)\)/g
			)) {
				const asset = new URL(
					href,
					"https://example.invalid"
				).searchParams.get("asset")!;
				const [path, anchor] = asset.split("#");
				expect(
					readFileSync(resolve("public", path.slice(1)), "utf8")
				).toContain(
					"## " +
						anchor
							.replaceAll("-", " ")
							.replace(/^./, c => c.toUpperCase())
				);
			}
		}
	}
	const backtracking = module.supplementalProjects[2];
	expect(backtracking.projectLink).toBeUndefined();
	expect(backtracking.solutionLink).toBeUndefined();
});

it("shares optional core attempts and keeps role and legacy projects independent", () => {
	const project = javaRecursionProjects[0];
	for (const role of ["starter", "reference"] as const) {
		const url = javaRecursionURL(
			project.pack + "/" + (role === "starter" ? "starter" : "solution")
		);
		const core = javaRecursionProjectKey(
			"java-level-3",
			project.id,
			role,
			url
		);
		expect(core.endsWith(":native-java-recursion")).toBe(true);
		for (const id of javaRecursionContinuations)
			expect(javaRecursionProjectKey("java-level-3", id, role, url)).toBe(
				core
			);
	}
	expect(
		javaRecursionProjectKey(
			"java-level-3",
			project.id,
			"starter",
			javaRecursionURL(project.pack + "/starter")
		)
	).not.toBe(
		javaRecursionProjectKey(
			"java-level-3",
			project.id,
			"reference",
			javaRecursionURL(project.pack + "/solution")
		)
	);
	for (const path of [
		project.pack,
		project.pack + "/starter/extra",
		project.pack + "/reference"
	]) {
		expect(javaRecursionResource(javaRecursionURL(path))).toBeNull();
		expect(javaRecursionImportFiles(javaRecursionURL(path))).toBeNull();
	}
	expect(
		javaRecursionResource(
			javaRecursionURL(project.pack + "/starter").replace(
				fixture.revision,
				"main"
			)
		)
	).toBeNull();
});
