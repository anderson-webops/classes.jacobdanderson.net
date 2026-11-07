import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../test/fixtures/java-foundations-sources.json";
import originals from "./fixtures/java-foundations-identities.json";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaFoundationsBlobID,
	javaFoundationsCoreID,
	javaFoundationsExtensionID,
	javaFoundationsFiles,
	javaFoundationsImportFiles,
	javaFoundationsModuleID,
	javaFoundationsProjectKey,
	javaFoundationsReadingID,
	javaFoundationsReferenceItems,
	javaFoundationsResource,
	javaFoundationsURL
} from "@/modules/javaFoundationsResources";
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
	"preserves all13packaged %s files through import/save/ZIP",
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
		const url = javaFoundationsURL(role);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "java");
		expect(files.map(file => file.name)).toEqual(javaFoundationsFiles);
		expect(files).toHaveLength(13);
		const folder = "DPJ2-Report-Foundations-Packs/" + role + "/";
		expect(requested).toEqual(
			javaFoundationsFiles.map(name => folder + name)
		);
		for (const file of files) {
			expect(file.content).toBe(sources[folder + file.name].content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(sources[folder + file.name].sha256);
		}
		const project = createPythonIdeProject("java", {
			files,
			courseProjectKey: "foundations-" + role
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
		expect(Object.keys(archive)).toHaveLength(13);
		for (const file of project.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	}
);
it("preserves all10published foundations identities and complete source bodies", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById(
		"design-patterns-in-java"
	))!;
	const module = course.modules.find(
		module => module.id === javaFoundationsModuleID
	)!;
	const raw = designPatternsInJavaCourse.modules.find(
		module => module.id === javaFoundationsModuleID
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
				item.id === javaFoundationsReadingID ? "reading" : "assignment"
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
	expect(module.curriculum).toHaveLength(7);
	expect(module.supplementalProjects).toHaveLength(3);
	for (const item of module.supplementalProjects.slice(0, 2)) {
		expect(item.projectLink).toBeUndefined();
		expect(item.solutionLink).toBeUndefined();
	}
	for (const filename of [
		"src/report/domain/Report.java",
		"src/report/application/ReportPublisher.java",
		"src/report/examples/LanguageChoices.java"
	])
		expect(module.curriculum[0].content).toContain(
			sources[
				"DPJ2-Report-Foundations-Packs/solution/" + filename
			].content.trim()
		);
});
it("shares core continuations, keeps the reference separate and preserves DPJ1 keys", () => {
	const core = javaFoundationsProjectKey(
		"design-patterns-in-java",
		javaFoundationsCoreID,
		"starter",
		javaFoundationsURL("starter")
	);
	for (const item of [javaFoundationsBlobID, javaFoundationsExtensionID])
		expect(
			javaFoundationsProjectKey(
				"design-patterns-in-java",
				item,
				"starter",
				javaFoundationsURL("starter")
			)
		).toBe(core);
	const reference = javaFoundationsProjectKey(
		"design-patterns-in-java",
		javaFoundationsReadingID,
		"reference",
		javaFoundationsURL("solution")
	);
	expect(reference).not.toBe(core);
	for (const item of javaFoundationsReferenceItems)
		expect(
			javaFoundationsProjectKey(
				"design-patterns-in-java",
				item,
				"reference",
				javaFoundationsURL("solution")
			)
		).toBe(reference);
	for (const key of [core, reference]) {
		expect(javaNativeBuildInstructions(key)?.join("\n")).toContain(
			"-d classes @sources.txt"
		);
		expect(
			javaNativeBuildInstructions(
				key.replace(":native-java-foundations", "")
			)
		).toBeNull();
	}
	for (const role of ["starter", "reference"] as const) {
		const url = javaPatternsURL(
			"pricing",
			role === "starter" ? "starter" : "solution"
		);
		expect(
			javaFoundationsProjectKey(
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
	for (const url of [
		javaFoundationsURL("starter") + "/extra",
		javaFoundationsURL("starter").replace(fixture.revision, "main"),
		javaFoundationsURL("starter").replace("Java-Level-3", "Other"),
		javaFoundationsURL("starter").replace("/starter", "/reference")
	]) {
		expect(javaFoundationsResource(url)).toBeNull();
		expect(javaFoundationsImportFiles(url)).toBeNull();
	}
});
