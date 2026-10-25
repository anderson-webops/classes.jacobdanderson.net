import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey, javascriptCourseResource } from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import { clearLocalPythonProjects, createPythonIdeProject, loadLocalPythonProjects, loadPythonIdeStarterFilesFromGitHub, pythonIdeModeForCourseResource, saveLocalPythonProjects } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-drawing-sources.json"), "utf8"));
const originals = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-drawing-originals.json"), "utf8"));
const root = resolve("public/course-assets/javascript-level-1");
const prefix = "/course-assets/javascript-level-1/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(`imports, saves and exports the assigned ${resource.project} ${resource.role}`, async () => {
		vi.stubGlobal("crypto", webcrypto);
		const requested: string[] = [];
		vi.stubGlobal("fetch", vi.fn(async (value: string, options: RequestInit) => {
			expect(value.startsWith(prefix)).toBe(true);
			expect(options).toMatchObject({ credentials: "omit", redirect: "error" });
			requested.push(value);
			return new Response(readFileSync(resolve(root, value.slice(prefix.length))));
		}));
		const url = resource.urls[0];
		expect(javascriptCourseResource(url)).toMatchObject({ project: resource.project, role: resource.role });
		expect(pythonIdeModeForCourseResource(fixture.courseId, url)).toBe("web");
		expect(requested).toHaveLength(0);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
		expect(files).toHaveLength(resource.files.length);
		expect(requested).toHaveLength(resource.files.length);
		for (const file of files) {
			const declared = resource.files.find((row: { name: string }) => row.name === file.name);
			expect(file.content).toBe(readFileSync(resolve(root, declared.path), "utf8"));
			expect(sha(file.content)).toBe(declared.sha256);
		}
		const original = originals.resources.find((row: { url: string }) => row.url === url);
		expect(sha(original.panels.JavaScript)).toBe(resource.originalSourceSHA256);
		const script = files.find(file => file.name === "script.js")!.content;
		expect(sha(script)).toBe(resource.expectedScriptSHA256);
		const key = javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, url);
		for (const alias of resource.urls) expect(javascriptCourseProjectKey(fixture.courseId, resource.itemId, resource.role, alias)).toBe(key);
		const earlier = createPythonIdeProject("web", { files: [{ name: "script.js", content: "// Earlier drawing work\n", encoding: "text" }], courseID: fixture.courseId, courseProjectKey: `${key}:earlier` });
		const project = createPythonIdeProject("web", { files, courseID: fixture.courseId, courseProjectKey: key, starterUrl: url });
		project.files.find(file => file.name === "script.js")!.content += "\n// Saved drawing change\n";
		await saveLocalPythonProjects([earlier, project]);
		const saved = await loadLocalPythonProjects();
		expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
		const reopened = saved.find(row => row._id === project._id)!;
		expect(reopened).toEqual(project);
		const archive = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(archive)).toHaveLength(resource.files.length);
		for (const file of reopened.files) {
			const path = Object.keys(archive).find(path => path.endsWith(`/${file.name}`))!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	});
}

for (const role of ["learner", "instructor"] as const) {
	it(`keeps the drawing assignments and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({ _id: "drawing-course-tutor", name: "Tutor", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 0, coursePermissions: [fixture.courseId], editTutors: false, saveEdit: "Save" });
		}
		const course = (await useCoursesStore().loadCourseById(fixture.courseId))!;
		const module = course.modules.find(module => module.id === fixture.moduleId)!;
		expect(module).toBeDefined();
		for (const resource of fixture.resources) {
			const items = resource.section === "core" ? module.curriculum : module.supplementalProjects;
			const item = items.find(item => item.id === resource.itemId)!;
			expect(item, resource.assignmentTitle).toBeDefined();
			expect(item.title).toBe(resource.assignmentTitle);
			if (resource.role === "starter") expect(item.projectLink).toBe(resource.urls[0]);
			else if (role === "instructor") expect(item.solutionLink).toBe(resource.urls[0]);
			else expect(item.solutionLink).toBeUndefined();
		}
	});
}

for (const resource of fixture.resources) {
	it(`draws the source geometry for ${resource.project} ${resource.role}`, () => {
		const read = (name: string) => readFileSync(resolve(root, resource.files.find((f: { name: string }) => f.name === name).path), "utf8");
		const context = { document, setTimeout, clearTimeout, setInterval, clearInterval, performance };
		const execute = () => runInNewContext(`${read("vendor/d3.min.js")}\n${read("script.js")}`, context, { timeout: 1000 });
		if (resource.intentionalRuntimeError) expect(execute).toThrow(/positionX/u);
		else execute();
		const svg = document.querySelector("svg");
		if (resource.role === "starter" && resource.project !== "debugging-olaf-star") {
			expect(svg).toBeNull();
			return;
		}
		expect(svg!.getAttribute("viewBox")).toBe(resource.viewBox);
		expect(svg!.getAttribute("role")).toBe("img");
		const attributes = (selector: string, names: string[]) => [...svg!.querySelectorAll(selector)].map(node => names.map(name => node.getAttribute(name)));
		if (resource.project === "basic-shapes") {
			expect(attributes("rect", ["x", "y", "width", "height", "fill"])).toEqual([["50", "75", "50", "50", "green"]]);
			expect(attributes("circle", ["cx", "cy", "r", "fill"])).toEqual([["200", "100", "50", "blue"]]);
			expect(attributes("ellipse", ["cx", "cy", "rx", "ry", "fill"])).toEqual([["350", "100", "30", "50", "red"]]);
		}
		else if (resource.project === "smiley-face") {
			expect(attributes("rect", ["x", "y", "width", "height"])).toEqual([["200", "25", "10", "100"], ["290", "25", "10", "100"]]);
			expect(attributes("path", ["transform", "fill"])).toEqual([["translate(250,200)", "green"]]);
		}
		else if (resource.project === "pac-man") {
			expect(attributes("path", ["transform", "fill"])).toEqual([["translate(150,110)", "yellow"], ["translate(400,110)", "yellow"]]);
			const paths = attributes("path", ["d"]).flat();
			expect(paths[0]).not.toBe(paths[1]);
		}
		else if (resource.project === "captain-america-shield") {
			expect(attributes("circle", ["cx", "cy", "r", "fill"])).toEqual([["200", "200", "110", "red"], ["200", "200", "90", "white"], ["200", "200", "70", "red"], ["200", "200", "50", "blue"]]);
			expect(attributes("path", ["transform", "fill"])).toEqual([["translate(200,200)", "white"]]);
		}
		else {
			expect(svg!.querySelectorAll("circle")).toHaveLength(6);
			const olaf = resource.project === "debugging-olaf-star";
			expect(attributes("circle", ["cy", "r"]).filter(row => ["50", "70", "100"].includes(row[1]!))).toEqual(olaf ? [["100", "50"], ["210", "70"], ["350", "100"]] : [["50", "50"], ["160", "70"], ["300", "100"]]);
			if (olaf) {
				const star = svg!.querySelector("path:last-child")!;
				if (resource.role === "starter") {
					expect(star.getAttribute("d")).toBeNull();
				}
				else {
					expect(star.getAttribute("transform")).toBe("translate(150,210)");
					expect(star.getAttribute("fill")).toBe("yellow");
					expect(star.getAttribute("d")).toBeTruthy();
				}
			}
		}
	});
}
