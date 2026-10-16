import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import {
	assemblyCourseProjectKey,
	assemblyCourseResource,
	assemblyRecordPack
} from "@/modules/assemblyProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	isValidPythonFileName,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/assembly-records-contracts.json"
		),
		"utf8"
	)
) as {
	pack: string;
	revision: string;
	files: Record<string, { content: string; sha256: string }>;
};
const root =
	"https://github.com/instruction-material/Assembly/tree/" +
	fixture.revision +
	"/" +
	fixture.pack;
const coreID =
	"assembly-unit-1-machine-model-and-toolchain-curriculum-core-project-machine-model-and-toolchain";
const traceID =
	"assembly-unit-1-machine-model-and-toolchain-supplemental-register-trace-worksheet-machine-model-and-toolchain";
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("keeps Unit 1 identities and a complete required trace continuation with separate optional practice", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "record-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["assembly"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById("assembly"))!;
	expect(course.modules.flatMap(module => module.curriculum)).toHaveLength(
		50
	);
	const module = course.modules.find(
		module => module.id === "assembly-unit-1-machine-model-and-toolchain"
	)!;
	const core = module.curriculum.find(item => item.id === coreID)!;
	const trace = module.supplementalProjects.find(
		item => item.id === traceID
	)!;
	const concept = module.curriculum.find(item =>
		item.id.endsWith("curriculum-machine-model-and-toolchain-core-concepts")
	)!;
	expect(concept.content.split(/\s+/).length).toBeGreaterThan(800);
	for (const word of [
		"relocation",
		"interpreter",
		"-O0",
		"-O2",
		"little-endian",
		"undefined",
		"Intel",
		"AT&T"
	])
		expect(concept.content).toContain(word);
	for (const item of [core, trace]) {
		expect(item.learningPath).toBe("core");
		expect(item.ideImport).toBe(true);
		expect(item.projectLink).toBe(root + "/starter");
		expect(item.solutionLink).toBe(root + "/solution");
		expect(item.content).toContain("trace.md");
		expect(item.content).toContain("same saved");
	}
	expect(core.content).toContain(
		fixture.files[fixture.pack + "/README.md"].content
			.split("\n")
			.slice(1)
			.join("\n")
			.replace("Debug learner build", "Debug starter build")
			.replace(
				"Independent reading follows the same prediction, single-step and explanation sequence that a paced walkthrough pauses through with an instructor.",
				"Independent reading and a paced walkthrough follow the same prediction, single-step and explanation sequence."
			)
			.trim()
	);
	expect(trace.content.split(/\s+/).length).toBeGreaterThan(400);
	expect(
		module.supplementalProjects
			.filter(item => item.id !== traceID)
			.map(item => item.learningPath)
	).toEqual(["choice", "challenge"]);
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById("assembly"))!;
	for (const id of [coreID, traceID]) {
		const item = learner.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.find(item => item.id === id)!;
		expect(item.projectLink).toBe(root + "/starter");
		expect(item.solutionLink).toBeUndefined();
	}
});

it.each(["starter", "solution"] as const)(
	"imports and exports exact %s bytes, preserving code, trace and earlier work",
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
		const url = root + "/" + role;
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url,
			"assembly"
		);
		expect(files).toHaveLength(8);
		expect(requests).toHaveLength(8);
		expect(
			files.every(
				file =>
					file.name === "README.md" ||
					file.name.startsWith(role + "/")
			)
		).toBe(true);
		expect(files.every(file => isValidPythonFileName(file.name))).toBe(
			true
		);
		const key = assemblyCourseProjectKey(
			"assembly",
			coreID,
			role === "starter" ? "starter" : "reference",
			url
		);
		expect(
			assemblyCourseProjectKey(
				"assembly",
				traceID,
				role === "starter" ? "starter" : "reference",
				url
			)
		).toBe(key);
		const old = createPythonIdeProject("python", {
			courseProjectKey: key.replace(/:native-assembly$/, "")
		});
		const project = createPythonIdeProject("assembly", {
			files,
			starterUrl: url,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe(role + "/routine.S");
		const archive = createProjectArchive(project);
		if (process.env.ASSEMBLY_EXPORT_PROOF_DIR) {
			mkdirSync(process.env.ASSEMBLY_EXPORT_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				resolve(
					process.env.ASSEMBLY_EXPORT_PROOF_DIR,
					fixture.pack + "-" + role + ".zip"
				),
				archive
			);
		}
		const entries = unzipSync(archive);
		expect(Object.keys(entries)).toHaveLength(8);
		for (const file of files) {
			const bytes = entries[project.title + "/" + file.name];
			expect(strFromU8(bytes)).toBe(
				fixture.files[fixture.pack + "/" + file.name].content
			);
			expect(createHash("sha256").update(bytes).digest("hex")).toBe(
				fixture.files[fixture.pack + "/" + file.name].sha256
			);
		}
		project.files = project.files.map(file =>
			[role + "/routine.S", role + "/trace.md"].includes(file.name)
				? {
						...file,
						content:
							file.content +
							"\n# independent record observation\n"
					}
				: file
		);
		saveLocalPythonProjects([old, project]);
		const restored = loadLocalPythonProjects();
		expect(restored.find(item => item._id === old._id)).toEqual(old);
		const saved = restored.find(item => item._id === project._id)!;
		expect(saved.files).toEqual(project.files);
		const changedEntries = unzipSync(createProjectArchive(saved));
		for (const file of saved.files)
			expect(
				strFromU8(changedEntries[saved.title + "/" + file.name])
			).toBe(file.content);
		const instructions = assemblyBuildInstructions(files, url).join("\n");
		for (const command of [
			"readelf -Wr",
			"objdump -dr",
			"compile_commands.json",
			"-DCMAKE_ASM_FLAGS_DEBUG=",
			"-DCMAKE_ASM_FLAGS_RELEASE=",
			"gdb ./build-O0/assembly_demo",
			"--changed"
		])
			expect(instructions).toContain(command);
		expect(instructions).toContain(
			role === "starter" ? "RECORD_DECODE" : "196,609"
		);
		expect(
			assemblyBuildInstructions(
				files.filter(file => file.name !== role + "/trace.md"),
				url
			).join("\n")
		).not.toContain("readelf -Wr");
	}
);

it("normalizes only this pinned worksheet identity and preserves distinct role and old keys", () => {
	expect(fixture.pack).toBe(assemblyRecordPack);
	expect(
		assemblyCourseResource(
			root.replace(fixture.revision, "main") + "/starter"
		)
	).toBeNull();
	expect(assemblyCourseResource(root + "/starter/routine.S")).toBeNull();
	const keys = ["starter", "reference"].map(role =>
		assemblyCourseProjectKey(
			"assembly",
			coreID,
			role as "starter" | "reference",
			root + (role === "starter" ? "/starter" : "/solution")
		)
	);
	expect(new Set(keys).size).toBe(2);
	expect(
		assemblyCourseProjectKey(
			"assembly",
			traceID,
			"starter",
			root.replace(fixture.revision, "main") + "/starter"
		)
	).toBe("assembly:" + traceID + ":starter");
	expect(
		assemblyCourseProjectKey(
			"assembly",
			"unrelated",
			"starter",
			root + "/starter"
		)
	).toBe("assembly:unrelated:starter:native-assembly");
});
