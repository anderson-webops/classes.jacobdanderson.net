import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { getCodeIdeProjectSubtitle } from "@/modules/codeIdeProjectLabels";
import { createProjectArchive } from "@/modules/projectArchive";
import { rustBuildInstructions } from "@/modules/rustBuildInstructions";
import {
	rustCargoItemIds,
	rustCargoModuleId,
	rustCargoRevision,
	rustCourseProjectKey,
	rustCourseResource
} from "@/modules/rustProjectResources";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	getPythonIdeFileKindLabel,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	normalizePythonIdeMode,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve(process.cwd(), "../test/fixtures/rust-cargo-contracts.json"),
		"utf8"
	)
);
const identities = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/catalog-published-identities.json"
		),
		"utf8"
	)
);
const sourceRoot = `https://github.com/instruction-material/Low-Level-Security/tree/${rustCargoRevision}/${fixture.pack}`;
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("preserves every Rust assignment identity and purpose while giving four distinct activities a complete baseline", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "rust-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["rust-systems-security"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById(
		"rust-systems-security"
	))!;
	const rows = course.modules.flatMap(module =>
		(["curriculum", "supplementalProjects"] as const).flatMap(section =>
			module[section].map(item => ({
				moduleId: module.id,
				id: item.id,
				section: section === "curriculum" ? "core" : "optional"
			}))
		)
	);
	expect(rows).toHaveLength(identities[course.id].items);
	expect(
		createHash("sha256").update(JSON.stringify(rows)).digest("hex")
	).toBe(identities[course.id].sha256);
	const module = course.modules.find(item => item.id === rustCargoModuleId)!;
	const items = [...module.curriculum, ...module.supplementalProjects];
	for (const [kind, id] of Object.entries(rustCargoItemIds)) {
		const item = items.find(item => item.id === id)!;
		expect(item).toBeDefined();
		expect(item.learningPath).toBe(
			kind === "choice"
				? "choice"
				: kind === "challenge"
					? "challenge"
					: "core"
		);
		expect(item.content).toContain(
			fixture.files[fixture.pack + "/README.md"].content.trim()
		);
		expect(item.ideImport).toBe(true);
		expect(item.projectLink).toBe(sourceRoot + "/starter");
		expect(item.solutionLink).toBe(sourceRoot + "/solution");
	}
	expect(
		items.find(item => item.id === rustCargoItemIds.core)!.content
	).toContain("BASELINE, PREDICT, CHECKS and LIMITS");
	expect(
		items.find(item => item.id === rustCargoItemIds.workflow)!.content
	).toContain("CLEAN and COMPARE");
	expect(
		items.find(item => item.id === rustCargoItemIds.challenge)!.content
	).toContain("E0382");
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById(
		"rust-systems-security"
	))!;
	for (const module of learner.modules)
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		])
			expect(item.solutionLink).toBeUndefined();
});

it.each(["starter", "solution"] as const)(
	"imports, edits, reopens and exports all seven %s role files without changing earlier work",
	async role => {
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: string | URL) => {
				const url = String(input);
				requests.push(url);
				const file =
					fixture.files[url.split("/" + fixture.revision + "/")[1]];
				return new Response(file?.content ?? "missing", {
					status: file ? 200 : 404
				});
			})
		);
		const url = sourceRoot + "/" + role;
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "rust");
		expect(files).toHaveLength(7);
		expect(requests).toHaveLength(7);
		expect(
			files.every(file => isValidPythonFileName(file.name, "rust"))
		).toBe(true);
		for (const file of files)
			expect(file.content).toBe(
				fixture.files[fixture.pack + "/" + file.name].content
			);
		const key = rustCourseProjectKey(
			"rust-systems-security",
			rustCargoItemIds.core,
			role === "starter" ? "starter" : "reference",
			url
		);
		const earlier = createPythonIdeProject("python", {
			title: "Earlier work"
		});
		const project = createPythonIdeProject("rust", {
			files,
			starterUrl: url,
			courseID: "rust-systems-security",
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe(role + "/observations.md");
		expect(getCodeIdeProjectSubtitle(project)).toBe(
			`${role === "starter" ? "Learner" : "Reference"} · Rust`
		);
		project.files = project.files.map(file => ({
			...file,
			content:
				file.content +
				(file.name.endsWith("observations.md")
					? "\nSaved Cargo evidence.\n"
					: file.name.endsWith("src/main.rs")
						? "\n// Saved source observation.\n"
						: "")
		}));
		saveLocalPythonProjects([earlier, project]);
		const restored = loadLocalPythonProjects();
		expect(restored.find(item => item._id === earlier._id)).toEqual(
			earlier
		);
		const saved = restored.find(item => item._id === project._id)!;
		expect(saved.mode).toBe("rust");
		expect(saved.files).toEqual(project.files);
		const entries = unzipSync(createProjectArchive(saved));
		expect(Object.keys(entries)).toHaveLength(7);
		for (const file of saved.files)
			expect(strFromU8(entries[saved.title + "/" + file.name])).toBe(
				file.content
			);
		const instructions = rustBuildInstructions(saved.files, url).join("\n");
		for (const token of [
			"1.97.1",
			"edition 2024",
			"cargo test --locked --offline",
			"E0382",
			"observations.md"
		])
			expect(instructions).toContain(token);
		for (const id of Object.values(rustCargoItemIds))
			expect(
				rustCourseProjectKey(
					"rust-systems-security",
					id,
					role === "starter" ? "starter" : "reference",
					url
				)
			).toBe(key);
		expect(
			rustCourseProjectKey(
				"rust-systems-security",
				"unrelated",
				"starter",
				url
			)
		).not.toContain(rustCargoItemIds.core);
		if (process.env.RUST_CARGO_EXPORT_PROOF_DIR) {
			const { mkdirSync, writeFileSync } = await import("node:fs");
			mkdirSync(process.env.RUST_CARGO_EXPORT_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				resolve(process.env.RUST_CARGO_EXPORT_PROOF_DIR, `${role}.zip`),
				createProjectArchive(
					createPythonIdeProject("rust", {
						files,
						title: "Cargo lesson",
						starterUrl: url
					})
				)
			);
		}
	}
);

it("offers the verified Cargo target only, and keeps Rust paths separate from Python paths", async () => {
	expect(normalizePythonIdeMode("rust")).toBe("rust");
	expect(
		pythonIdeModeForCourseResource(
			"rust-systems-security",
			sourceRoot + "/starter"
		)
	).toBe("rust");
	for (const bad of [
		sourceRoot.replace(rustCargoRevision, "main") + "/starter",
		sourceRoot + "/starter/src/main.rs",
		sourceRoot.replace("Low-Level-Security", "Assembly") + "/starter"
	]) {
		expect(rustCourseResource(bad)).toBeNull();
		expect(
			pythonIdeModeForCourseResource("rust-systems-security", bad)
		).toBeNull();
		await expect(
			loadPythonIdeStarterFilesFromGitHub(bad, "rust")
		).rejects.toThrow("verified site import");
	}
	for (const name of [
		"Cargo.toml",
		"Cargo.lock",
		"src/main.rs",
		"starter/diagnostics/fixed-value.rs",
		"solution/observations.md"
	])
		expect(isValidPythonFileName(name, "rust")).toBe(true);
	for (const name of [
		"../src/main.rs",
		"/Cargo.toml",
		"src//main.rs",
		"src\\main.rs",
		"images/main.rs",
		"starter/../../Cargo.toml"
	])
		expect(isValidPythonFileName(name, "rust")).toBe(false);
	expect(isValidPythonFileName("Cargo.toml", "python")).toBe(false);
	expect(getPythonIdeFileKindLabel("src/main.rs")).toBe("Rust");
	const blank = createPythonIdeProject("rust");
	expect(blank.activeFileName).toBe("src/main.rs");
	expect(blank.files.some(file => file.name === "Cargo.lock")).toBe(true);
	expect(blank.files.some(file => file.name.endsWith(".py"))).toBe(false);
});
