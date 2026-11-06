import { afterEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import fixture from "../../test/fixtures/physics-level-2-code-packs.json";
import { resetCodePreviewCaches } from "@/modules/codePreview";
import {
	physicsLevel2CourseResource,
	physicsLevel2SourceRevision,
	physicsLevel2SourceUrl
} from "@/modules/physicsLevel2ProjectResources";
import {
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource
} from "@/modules/pythonIde";
import { physicsLevel2Course } from "@/stores/courses/physics-level-2";

const packs = ["orbit-model", "numerical-model"] as const;
const roles = ["starter", "reference"] as const;

afterEach(() => {
	vi.unstubAllGlobals();
	resetCodePreviewCaches();
});

describe("Physics Level 2 code workflows", () => {
	it("limits Python course imports to the exact two reviewed role folders", () => {
		expect(physicsLevel2SourceRevision).toBe(fixture.revision);
		for (const pack of packs) {
			for (const role of roles) {
				const url = physicsLevel2SourceUrl(pack, role);
				expect(physicsLevel2CourseResource(url)).toMatchObject({
					pack,
					role,
					ref: fixture.revision
				});
				expect(
					pythonIdeModeForCourseResource("physics-level-2", url)
				).toBe("python");
			}
		}
		const verified = physicsLevel2SourceUrl("orbit-model", "starter");
		for (const url of [
			verified.replace(fixture.revision, "main"),
			verified.replace("anderson-webops", "someone-else"),
			verified.replace("orbit-model", "unreviewed-model"),
			verified.replace("/starter", "/reference/main.py"),
			"https://example.invalid/model.py"
		]) {
			expect(physicsLevel2CourseResource(url)).toBeNull();
			expect(
				pythonIdeModeForCourseResource("physics-level-2", url)
			).toBeNull();
		}
	});

	it("connects only the assigned modeling tasks and retains local cases and module keys", () => {
		const imported = physicsLevel2Course.modules.flatMap(module =>
			module.curriculum.filter(item => item.ideImport)
		);
		expect(imported.map(item => item.title)).toEqual(
			fixture.activities.map(activity => activity.title)
		);
		for (const activity of fixture.activities) {
			const item = imported.find(item => item.title === activity.title)!;
			expect(item.datasetLink).toBe(
				`/course-assets/physics/physics-level-2-materials-pack.md#${activity.caseSection}`
			);
			expect(item.content).toContain("spreadsheet");
			const module = physicsLevel2Course.modules.find(module =>
				module.curriculum.includes(item)
			)!;
			expect(
				module.curriculum.some(
					candidate =>
						candidate.solutionLink ===
						`/course-assets/physics/physics-level-2-rubrics-answer-key.md#${activity.answerSection}`
				)
			).toBe(true);
		}
	});

	it.each(packs.flatMap(pack => roles.map(role => ({ pack, role }))))(
		"imports all $pack/$role files unchanged with main.py active first",
		async ({ pack, role }) => {
			const folder = `${fixture.sourceRoot}/${pack}/${role}`;
			const files = ["README.md", "main.py"].map(name => {
				const content = readFileSync(
					resolve(
						`public/course-assets/physics/code-packs/${pack}/${role}/${name}`
					),
					"utf8"
				);
				const identity =
					fixture.files[
						`${pack}/${role}/${name}` as keyof typeof fixture.files
					];
				expect(createHash("sha256").update(content).digest("hex")).toBe(
					identity.sha256
				);
				return { name, content };
			});
			const fetcher = vi.fn(async (input: string | URL | Request) => {
				const url = new URL(String(input));
				if (url.hostname === "api.github.com") {
					expect(url.searchParams.get("ref")).toBe(fixture.revision);
					expect(url.pathname).toBe(
						`/repos/anderson-webops/classes.jacobdanderson.net/contents/${folder}`
					);
					return new Response(
						JSON.stringify(
							files.map(file => ({
								name: file.name,
								path: `${folder}/${file.name}`,
								type: "file",
								size: new TextEncoder().encode(file.content)
									.byteLength,
								html_url: physicsLevel2SourceUrl(pack, role),
								download_url: `https://raw.githubusercontent.com/anderson-webops/classes.jacobdanderson.net/${fixture.revision}/${folder}/${file.name}`
							}))
						)
					);
				}
				expect(url.hostname).toBe("raw.githubusercontent.com");
				const file = files.find(
					file =>
						url.pathname ===
						`/anderson-webops/classes.jacobdanderson.net/${fixture.revision}/${folder}/${file.name}`
				);
				expect(file).toBeDefined();
				return new Response(file!.content);
			});
			vi.stubGlobal("fetch", fetcher);
			const loaded = await loadPythonIdeStarterFilesFromGitHub(
				physicsLevel2SourceUrl(pack, role),
				"python"
			);
			expect(loaded.map(file => file.name)).toEqual([
				"main.py",
				"README.md"
			]);
			for (const file of loaded) {
				expect(file.content).toBe(
					files.find(source => source.name === file.name)!.content
				);
			}
			expect(fetcher).toHaveBeenCalledTimes(3);
		}
	);
});
