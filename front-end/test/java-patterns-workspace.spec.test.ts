import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../test/fixtures/java-patterns-sources.json";
import originals from "./fixtures/java-patterns-opening-identities.json";
import { designPatternsInJavaCourse } from "@/stores/courses/design-patterns-in-java";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaPatternsComparisonItems,
	javaPatternsImportFiles,
	javaPatternsModuleID,
	javaPatternsPricingID,
	javaPatternsProjectKey,
	javaPatternsReadingID,
	javaPatternsResource,
	javaPatternsURL
} from "@/modules/javaPatternsResources";
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
it.each(["pricing", "comparison"] as const)(
	"imports, edits, saves and exports both %s source roles exactly",
	async pack => {
		vi.stubGlobal("crypto", webcrypto);
		for (const role of ["starter", "solution"] as const) {
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
			const url = javaPatternsURL(pack, role);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				url,
				"java"
			);
			const names =
				pack === "pricing"
					? [
							"Main.java",
							"PricingStrategy.java",
							"BulkPricingStrategy.java",
							"ContractTests.java",
							"README.md"
						]
					: ["Main.java", "ContractTests.java", "README.md"];
			expect(files.map(file => file.name)).toEqual(names);
			const selected = javaPatternsResource(url)!;
			expect(requested).toEqual(
				names.map(name => selected.resource.path + "/" + name)
			);
			for (const file of files) {
				const input = sources[selected.resource.path + "/" + file.name];
				expect(file.content).toBe(input.content);
				expect(
					createHash("sha256").update(file.content).digest("hex")
				).toBe(input.sha256);
			}
			const project = createPythonIdeProject("java", {
				files,
				courseProjectKey: "dpj-" + pack + "-" + role
			});
			expect(project.activeFileName).toBe("Main.java");
			project.files[0].content += "\n// saved design decision\n";
			const old = createPythonIdeProject("java", {
				files: [
					{
						name: "Main.java",
						content: "// earlier attempt",
						encoding: "text"
					}
				],
				courseProjectKey: "old"
			});
			await saveLocalPythonProjects([old, project]);
			expect(await loadLocalPythonProjects()).toEqual([old, project]);
			const archive = unzipSync(await createProjectArchive(project));
			expect(Object.keys(archive)).toHaveLength(names.length);
			for (const file of project.files) {
				const path = Object.keys(archive).find(path =>
					path.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[path])).toBe(file.content);
			}
		}
	}
);
it("retains published opening identities, bodies, paths and working case/answer links", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const module = course.modules.find(
		module => module.id === javaPatternsModuleID
	)!;
	const raw = designPatternsInJavaCourse.modules[0];
	for (const section of ["curriculum", "supplementalProjects"] as const) {
		expect(
			module[section].map(({ id, aliases, title }) => ({
				id,
				...(aliases ? { aliases } : {}),
				title
			}))
		).toEqual(originals[section]);
		for (const item of module[section]) {
			expect(item.content).toBe(
				raw[section].find(row => row.id === item.id)!.content.trim()
			);
			const links = [
				...item.content.matchAll(
					/\[[^\]]+\]\((\/course-resource\?[^)]+)\)/g
				)
			];
			expect(links).toHaveLength(
				item.contentKind === "assignment" ? 2 : 0
			);
			for (const [, href] of links) {
				const [path, anchor] = new URL(
					href,
					"https://example.invalid"
				).searchParams
					.get("asset")!
					.split("#");
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
	expect(module.curriculum).toHaveLength(6);
	expect(module.supplementalProjects).toHaveLength(3);
	for (const item of module.supplementalProjects.slice(0, 2)) {
		expect(item.projectLink).toBeUndefined();
		expect(item.solutionLink).toBeUndefined();
	}
	expect(module.curriculum[0].content).toContain(
		sources[
			"DPJ1-Design-Comparison-Packs/solution/Main.java"
		].content.trim()
	);
});
it("shares comparison references and isolates learner, reference and legacy attempts", () => {
	const url = javaPatternsURL("comparison", "solution");
	const key = javaPatternsProjectKey(
		"design-patterns-in-java",
		javaPatternsReadingID,
		"reference",
		url
	);
	for (const item of javaPatternsComparisonItems)
		expect(
			javaPatternsProjectKey(
				"design-patterns-in-java",
				item,
				"reference",
				url
			)
		).toBe(key);
	const starter = javaPatternsProjectKey(
		"design-patterns-in-java",
		javaPatternsComparisonItems.at(-1)!,
		"starter",
		javaPatternsURL("comparison", "starter")
	);
	expect(starter).not.toBe(key);
	expect(starter).toContain(":native-java-patterns");
	const pricing = javaPatternsProjectKey(
		"design-patterns-in-java",
		javaPatternsPricingID,
		"starter",
		javaPatternsURL("pricing", "starter")
	);
	expect(pricing).not.toBe(starter);
	for (const current of [key, starter, pricing]) {
		expect(javaNativeBuildInstructions(current)?.join("\n")).toContain(
			"javac --release 21"
		);
		expect(
			javaNativeBuildInstructions(
				current.replace(":native-java-patterns", "")
			)
		).toBeNull();
	}
	for (const bad of [
		url + "/extra",
		url.replace(fixture.revision, "main"),
		url.replace("Java-Level-3", "Other"),
		url.replace("/solution", "/reference")
	]) {
		expect(javaPatternsResource(bad)).toBeNull();
		expect(javaPatternsImportFiles(bad)).toBeNull();
	}
});
