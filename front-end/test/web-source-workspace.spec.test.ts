import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createIdeDiagnostics } from "@/modules/ideDiagnostics";
import { createProjectArchive } from "@/modules/projectArchive";
import { pythonIdeCompletionsForMode } from "@/modules/pythonCodeMirror";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	getPythonIdeDefaultFileContent,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	normalizePythonIdeMode,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { webBuildInstructions } from "@/modules/webBuildInstructions";
import { isWebProjectTextPath } from "@/modules/webProjectFiles";
import {
	webCourseProjectKey,
	webCourseResource,
	webPortfolioRoot
} from "@/modules/webProjectResources";
import { isWebProjectTextPath as apiWebProjectTextPath } from "../../back-end/src/utils/webProjectFiles";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-portfolio-source.json"), "utf8")
);

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("web portfolio source workspace", () => {
	it.each(["starter", "solution"] as const)(
		"imports and round-trips exact %s source, edits and ZIP files",
		async role => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string | URL) => {
					const url = String(input);
					requests.push(url);
					const file =
						fixture.files[url.split(`/${fixture.revision}/`)[1]];
					return new Response(file?.content ?? "missing", {
						status: file ? 200 : 404
					});
				})
			);
			const url = `${webPortfolioRoot}/${role}`;
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			expect(files.map(file => file.name)).toEqual([
				"index.html",
				"main.js",
				"styles.css",
				"package.json",
				"README.md"
			]);
			expect(requests).toHaveLength(5);
			for (const file of files) {
				const path =
					file.name === "README.md"
						? `${fixture.pack}/README.md`
						: `${fixture.pack}/${role}/${file.name}`;
				expect(file.content).toBe(fixture.files[path].content);
				expect(file.encoding).toBe("text");
				expect(isValidPythonFileName(file.name, "web")).toBe(true);
			}
			expect(
				requests.every(
					request =>
						!request.includes(
							role === "starter" ? "/solution/" : "/starter/"
						)
				)
			).toBe(true);
			const key = webCourseProjectKey(
				"web-development-foundations",
				"first-activity",
				role === "starter" ? "starter" : "reference",
				url
			);
			const prior = createPythonIdeProject("python", {
				title: "Earlier attempt",
				courseID: "web-development-foundations",
				courseProjectKey: "web-development-foundations:earlier:starter"
			});
			const original = structuredClone(prior);
			const project = createPythonIdeProject("web", {
				files,
				starterUrl: url,
				courseID: "web-development-foundations",
				courseProjectKey: key
			});
			expect(project.activeFileName).toBe("index.html");
			project.files.find(file => file.name === "main.js")!.content +=
				"\n// Saved web observation\n";
			project.activeFileName = "main.js";
			await saveLocalPythonProjects([prior, project]);
			const reopened = await loadLocalPythonProjects();
			expect(reopened.find(row => row._id === prior._id)).toEqual(
				original
			);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const archive = unzipSync(createProjectArchive(saved));
			expect(Object.keys(archive)).toHaveLength(5);
			for (const file of saved.files) {
				const name = Object.keys(archive).find(name =>
					name.endsWith(`/${file.name}`)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
			const commands = webBuildInstructions(url).join("\n");
			expect(commands).toContain(
				`npm ci --workspace ${fixture.pack}/${role}`
			);
			expect(commands).toContain("not a standalone npm ci checkout");
			expect(commands).toContain("--host 127.0.0.1");
		}
	);

	it("keeps one saved continuation per role while leaving unknown sources unavailable", () => {
		for (const role of ["starter", "reference"] as const) {
			const url = `${webPortfolioRoot}/${role === "starter" ? "starter" : "solution"}`;
			expect(
				webCourseProjectKey(
					"web-development-foundations",
					"setup",
					role,
					url
				)
			).toBe(
				webCourseProjectKey(
					"web-development-foundations",
					"debugging",
					role,
					url
				)
			);
		}
		expect(
			webCourseResource(
				webPortfolioRoot.replace(fixture.revision, "main") + "/starter"
			)?.resource.ref
		).toBe(fixture.revision);
		expect(
			pythonIdeModeForCourseResource(
				"web-development-foundations",
				`${webPortfolioRoot}/starter`
			)
		).toBe("web");
		for (const url of [
			webPortfolioRoot + "/starter/main.js",
			webPortfolioRoot.replace(
				fixture.pack,
				"WDF2-Notes-App-with-MongoDB"
			) + "/starter",
			webPortfolioRoot.replace(fixture.revision, "unknown") + "/starter"
		])
			expect(
				pythonIdeModeForCourseResource(
					"web-development-foundations",
					url
				)
			).toBeNull();
	});

	it("uses web files and source-editor diagnostics without Python templates or completions", () => {
		const project = createPythonIdeProject("web");
		expect(normalizePythonIdeMode("web")).toBe("web");
		expect(project.activeFileName).toBe("index.html");
		expect(project.files.map(file => file.name)).toEqual([
			"index.html",
			"main.js",
			"styles.css"
		]);
		expect(getPythonIdeDefaultFileContent("helpers.js", "web")).toBe("");
		expect(pythonIdeCompletionsForMode("web")).toEqual([]);
		expect(
			createIdeDiagnostics("web", "idle", null, "3.13").runtime
		).toMatchObject({
			engine: "source-editor",
			pythonVersion: "not-loaded"
		});
	});

	it("keeps frontend/API path policies aligned and rejects traversal and unrelated code", () => {
		for (const name of [
			"index.html",
			"src/main.js",
			"styles.css",
			"package.json",
			"README.md",
			"data.txt"
		]) {
			expect(isWebProjectTextPath(name)).toBe(
				apiWebProjectTextPath(name)
			);
			expect(isValidPythonFileName(name, "web")).toBe(true);
		}
		for (const name of [
			"../main.js",
			"/index.html",
			"src//main.js",
			"main.py",
			"secrets.env",
			"src\\main.js",
			"image.png"
		])
			expect(isValidPythonFileName(name, "web")).toBe(false);
		expect(isValidPythonFileName("main.js", "python")).toBe(false);
		expect(isValidPythonFileName("index.html", "rust")).toBe(false);
	});
});
