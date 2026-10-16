import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import {
	assemblyCourseProjectKey,
	assemblyCourseResource
} from "@/modules/assemblyProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixtures = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/assembly-syscall-contracts.json"
		),
		"utf8"
	)
) as {
	pack: string;
	revision: string;
	mode: string;
	moduleId: string;
	itemId: string;
	continuationItemId?: string;
	files: Record<string, { content: string; sha256: string }>;
}[];
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("requires actual write and file-creation investigations while preserving parser and earlier lesson identities", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "syscall-tutor",
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
		module => module.id === fixtures[0].moduleId
	)!;
	expect(module.curriculum).toHaveLength(3);
	const previousOrder = course.modules.flatMap(current => {
		const moved = current.curriculum.find(
			item => item.id === fixtures[1].itemId
		);
		const core = current.curriculum.filter(
			item => item.id !== fixtures[1].itemId
		);
		const optional = moved
			? [...current.supplementalProjects, moved]
			: current.supplementalProjects;
		return (
			[
				["core", core],
				["optional", optional]
			] as const
		).flatMap(([section, items]) =>
			items.map(item => ({ moduleId: current.id, id: item.id, section }))
		);
	});
	// Reversing only this intentional section move exactly restores the prior
	// published identity digest. No assignment identity or ordering is lost.
	expect(
		createHash("sha256").update(JSON.stringify(previousOrder)).digest("hex")
	).toBe("8e7cbdfb7bacfc029e7964e07b0170f73f857497c386bdabdbf8f74c318706b9");

	expect(
		module.curriculum.find(item =>
			item.id.endsWith("curriculum-project-tiny-command-line-parser")
		)?.projectLink
	).toContain(
		"b87661c22a4bc08245cac18a0d6b8d672723eec8/ASM5-Tiny-Command-Line-Parser/starter"
	);
	for (const fixture of fixtures) {
		const item = module.curriculum.find(
			item => item.id === fixture.itemId
		)!;
		expect(item.learningPath).toBe("core");
		expect(item.ideImport).toBe(true);
		expect(item.content).toContain(
			fixture.files[fixture.pack + "/README.md"].content.trim()
		);
		expect(item.projectLink).toBe(
			`https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/starter`
		);
		expect(item.solutionLink).toBe(
			`https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/solution`
		);
		if (fixture.continuationItemId) {
			const trace = module.supplementalProjects.find(
				item => item.id === fixture.continuationItemId
			)!;
			expect(trace).toMatchObject({
				learningPath: "core",
				ideImport: true,
				projectLink: item.projectLink,
				solutionLink: item.solutionLink
			});
			expect(trace.content).toContain("same saved");
			for (const role of ["starter", "reference"] as const) {
				const url =
					role === "starter" ? item.projectLink! : item.solutionLink!;
				expect(
					assemblyCourseProjectKey("assembly", trace.id, role, url)
				).toBe(
					assemblyCourseProjectKey("assembly", item.id, role, url)
				);
			}
		}
	}
	expect(
		module.supplementalProjects.filter(
			item => item.id === fixtures[1].itemId
		)
	).toHaveLength(0);
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById("assembly"))!;
	for (const fixture of fixtures) {
		const item = learner.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.find(item => item.id === fixture.itemId)!;
		expect(item.projectLink).toContain(fixture.revision);
		expect(item.solutionLink).toBeUndefined();
	}
});

it.each(
	fixtures.flatMap(fixture =>
		["starter", "solution"].map(role => ({ fixture, role }))
	)
)(
	"imports and persists $fixture.mode/$role bytes without replacing earlier or opposite-role work",
	async ({ fixture, role }) => {
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
		const url = `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/${role}`;
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url,
			"assembly"
		);
		expect(requests).toHaveLength(8);
		expect(files).toHaveLength(8);
		for (const file of files) {
			const expected = fixture.files[fixture.pack + "/" + file.name];
			expect(file.content).toBe(expected.content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(expected.sha256);
		}
		const key = assemblyCourseProjectKey(
			"assembly",
			fixture.itemId,
			role === "starter" ? "starter" : "reference",
			url
		);
		const earlier = createPythonIdeProject("python", {
			title: "Earlier runtime attempt",
			courseProjectKey: key.replace(/:native-assembly$/, "")
		});
		const opposite = createPythonIdeProject("assembly", {
			title: "Separate opposite role",
			courseProjectKey: key.replace(
				role === "starter" ? ":starter:" : ":reference:",
				role === "starter" ? ":reference:" : ":starter:"
			)
		});
		const project = createPythonIdeProject("assembly", {
			files,
			starterUrl: url,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe(role + "/routine.S");
		const archive = createProjectArchive(project);
		const directory = process.env.ASSEMBLY_EXPORT_PROOF_DIR;
		if (directory) {
			mkdirSync(directory, { recursive: true });
			writeFileSync(
				join(directory, fixture.pack + "-" + role + ".zip"),
				archive
			);
		}
		project.files = project.files.map(file => ({
			...file,
			content:
				file.content +
				(file.name === role + "/routine.S"
					? "\n/* Saved syscall observation. */\n"
					: file.name === role + "/trace.md"
						? "\nSaved raw return and cleanup evidence.\n"
						: "")
		}));
		project.activeFileName = role + "/trace.md";
		saveLocalPythonProjects([earlier, opposite, project]);
		const restored = loadLocalPythonProjects();
		expect(restored.find(item => item._id === earlier._id)).toEqual(
			earlier
		);
		expect(restored.find(item => item._id === opposite._id)).toEqual(
			opposite
		);
		const saved = restored.find(item => item._id === project._id)!;
		expect(saved.files).toEqual(project.files);
		expect(saved.activeFileName).toBe(role + "/trace.md");
		const entries = unzipSync(createProjectArchive(saved));
		expect(Object.keys(entries)).toHaveLength(8);
		for (const file of saved.files)
			expect(strFromU8(entries[saved.title + "/" + file.name])).toBe(
				file.content
			);
		const instructions = assemblyBuildInstructions(files, url).join("\n");
		for (const token of [
			"Linux x86-64",
			"strace",
			"gdb",
			"trace.md",
			"RCX/R11",
			"build-Release",
			"unchanged"
		])
			expect(instructions).toContain(token);
		expect(instructions).toContain(
			fixture.mode === "write" ? "SYSCALL_WRITE" : "SYSCALL_ARG4"
		);
		expect(
			assemblyBuildInstructions(
				files.filter(file => file.name !== role + "/abi_checks.S"),
				url
			).join("\n")
		).toContain("incomplete");
		expect(
			assemblyCourseResource(url.replace(fixture.revision, "main"))
		).toBeNull();
	}
);
