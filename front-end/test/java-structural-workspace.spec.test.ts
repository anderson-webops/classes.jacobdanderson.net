import {
	javaBoundaryCoreID,
	javaBoundaryProjectKey,
	javaBoundaryURL
} from "@/modules/javaBoundaryResources";
import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../test/fixtures/java-structural-sources.json";
import originals from "./fixtures/java-structural-identities.json";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaStructuralApplicationID,
	javaStructuralCoreID,
	javaStructuralExtensionID,
	javaStructuralFiles,
	javaStructuralImportFiles,
	javaStructuralModuleID,
	javaStructuralProjectKey,
	javaStructuralReadingID,
	javaStructuralReferenceItems,
	javaStructuralResource,
	javaStructuralURL
} from "@/modules/javaStructuralResources";
import {
	javaPatternsPricingID,
	javaPatternsProjectKey,
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
import { designPatternsInJavaCourse } from "@/stores/courses/design-patterns-in-java";
import { useCoursesStore } from "@/stores/courses";

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
const sources: Record<string, { content: string; sha256: string }> =
	fixture.files;
it.each(["starter", "solution"] as const)(
	"preserves all14packaged %s files through import/save/ZIP",
	async role => {
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
		const url = javaStructuralURL(role);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "java");
		expect(files.map(file => file.name)).toEqual(javaStructuralFiles);
		expect(files).toHaveLength(14);
		const folder = "DPJ5-Structural-Scene-Packs/" + role + "/";
		expect(requested).toEqual(
			javaStructuralFiles.map(name => folder + name)
		);
		for (const file of files) {
			expect(file.content).toBe(sources[folder + file.name].content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(sources[folder + file.name].sha256);
		}
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: "structural-" + role
		});
		expect(project.activeFileName).toBe("Main.java");
		project.files[0].content += "\n// saved package trace\n";
		const old = createPythonIdeProject("java", {
			files: [
				{
					name: "Main.java",
					content: "// earlier project",
					encoding: "text"
				}
			],
			courseProjectKey: "legacy"
		});
		await saveLocalPythonProjects([old, project]);
		expect(await loadLocalPythonProjects()).toEqual([old, project]);
		const archive = unzipSync(await createProjectArchive(project));
		expect(Object.keys(archive)).toHaveLength(14);
		for (const file of project.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	}
);
it("preserves all8published structural identities and complete source bodies", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const module = course.modules.find(
		module => module.id === javaStructuralModuleID
	)!;
	const raw = designPatternsInJavaCourse.modules.find(
		module => module.id === javaStructuralModuleID
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
			expect(item.content).toBe(
				raw[section].find(row => row.id === item.id)!.content.trim()
			);
			expect(item.contentKind).toBe(
				item.id === javaStructuralReadingID ? "reading" : "assignment"
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
	expect(module.curriculum).toHaveLength(5);
	expect(module.supplementalProjects).toHaveLength(3);
	for (const item of module.supplementalProjects.slice(0, 2)) {
		expect(item.projectLink).toBeUndefined();
		expect(item.solutionLink).toBeUndefined();
	}
	expect(module.curriculum[0].content).toContain(
		sources["DPJ5-Structural-Worked-Example/Main.java"].content.trim()
	);
});
it("shares core continuations, keeps the reference separate and preserves DPJ1 keys", () => {
	const core = javaStructuralProjectKey(
		"design-patterns-in-java",
		javaStructuralCoreID,
		"starter",
		javaStructuralURL("starter")
	);
	for (const item of [javaStructuralApplicationID, javaStructuralExtensionID])
		expect(
			javaStructuralProjectKey(
				"design-patterns-in-java",
				item,
				"starter",
				javaStructuralURL("starter")
			)
		).toBe(core);
	const reference = javaStructuralProjectKey(
		"design-patterns-in-java",
		javaStructuralReadingID,
		"reference",
		javaStructuralURL("solution")
	);
	expect(reference).not.toBe(core);
	for (const item of javaStructuralReferenceItems)
		expect(
			javaStructuralProjectKey(
				"design-patterns-in-java",
				item,
				"reference",
				javaStructuralURL("solution")
			)
		).toBe(reference);
	for (const key of [core, reference]) {
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"-d classes @sources.txt"
		);
		expect(
			javaNativeBuildInstructions(
				key.replace(":native-java-structural", "")
			)
		).toBeNull();
	}
	for (const role of ["starter", "reference"] as const) {
		const url = javaPatternsURL(
			"pricing",
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaStructuralProjectKey(
				"design-patterns-in-java",
				javaPatternsPricingID,
				role,
				url
			)
		).toBe(
			javaPatternsProjectKey(
				"design-patterns-in-java",
				javaPatternsPricingID,
				role,
				url
			)
		);
	}
	for (const role of ["starter", "reference"] as const) {
		const url = javaBoundaryURL(
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaStructuralProjectKey(
				"design-patterns-in-java",
				javaBoundaryCoreID,
				role,
				url
			)
		).toBe(
			javaBoundaryProjectKey(
				"design-patterns-in-java",
				javaBoundaryCoreID,
				role,
				url
			)
		);
	}
	for (const url of [
		javaStructuralURL("starter") + "/extra",
		javaStructuralURL("starter").replace(fixture.revision, "main"),
		javaStructuralURL("starter").replace("Java-Level-3", "Other"),
		javaStructuralURL("starter").replace("/starter", "/reference")
	]) {
		expect(javaStructuralResource(url)).toBeNull();
		expect(javaStructuralImportFiles(url)).toBeNull();
	}
});

it("offers the complete worked example to a learner and imports its three files", async () => {
	setActivePinia(createPinia());
	vi.stubGlobal("crypto", webcrypto);
	const requested: string[] = [];
	const prefix =
		"https://raw.githubusercontent.com/" +
		fixture.repository +
		"/" +
		fixture.revision +
		"/";
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			expect(url.startsWith(prefix)).toBe(true);
			const path = url.slice(prefix.length);
			requested.push(path);
			expect(sources[path], path).toBeDefined();
			return new Response(sources[path].content);
		})
	);
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const reading = course.modules.find(
		module => module.id === javaStructuralModuleID
	)!.curriculum[0];
	expect(reading.projectLink).toBe(javaStructuralURL("example"));
	const files = await loadPythonIdeStarterFilesFromGitHub(
		reading.projectLink!,
		"java"
	);
	expect(files.map(file => file.name)).toEqual([
		"Main.java",
		"ContractTests.java",
		"README.md"
	]);
	expect(requested).toEqual(
		files.map(file => "DPJ5-Structural-Worked-Example/" + file.name)
	);
	const project = createPythonIdeProject("java", {
		files,
		courseProjectKey: javaStructuralProjectKey(
			"design-patterns-in-java",
			javaStructuralReadingID,
			"starter",
			reading.projectLink!
		)
	});
	expect(project.activeFileName).toBe("Main.java");
	expect(
		javaNativeBuildInstructions(project.courseProjectKey)?.join("\n")
	).toContain("Structural worked contracts: 41 passed");
	expect(
		javaNativeBuildInstructions(project.courseProjectKey)?.join("\n")
	).toContain("Main.java ContractTests.java");
	const archive = unzipSync(await createProjectArchive(project));
	expect(Object.keys(archive)).toHaveLength(3);
	for (const file of files) {
		expect(file.content).toBe(
			sources["DPJ5-Structural-Worked-Example/" + file.name].content
		);
		const path = Object.keys(archive).find(path =>
			path.endsWith("/" + file.name)
		)!;
		expect(strFromU8(archive[path])).toBe(file.content);
	}
});
