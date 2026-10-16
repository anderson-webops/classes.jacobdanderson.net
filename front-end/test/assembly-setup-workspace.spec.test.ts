import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
	isValidPythonFileName,
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
			"../test/fixtures/assembly-setup-contracts.json"
		),
		"utf8"
	)
) as {
	pack: string;
	revision: string;
	mode: string;
	itemId: string;
	learningPath: string;
	files: Record<string, { content: string; sha256: string }>;
}[];
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("retains required setup and separate optional identities, complete readings and reference visibility", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "setup-tutor",
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
		module => module.id === "assembly-asm0-setup-and-tooling"
	)!;
	expect(
		module.curriculum.find(
			item =>
				item.id ===
				"assembly-asm0-setup-and-tooling-curriculum-core-project-assembly"
		)?.projectLink
	).toContain(
		"117e34fb8ff90c2046da71090c37e7b45ef20624/ASM-04-asm0-setup-and-tooling/starter"
	);
	for (const fixture of fixtures) {
		const item = module.supplementalProjects.find(
			item => item.id === fixture.itemId
		)!;
		expect(item).toBeDefined();
		expect(item.learningPath).toBe(fixture.learningPath);
		expect(item.ideImport).toBe(true);
		expect(item.content).toBe(
			fixture.files[fixture.pack + "/README.md"].content.trim()
		);
		expect(item.solutionLink).toBe(
			`https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/solution`
		);
		expect(item.content).toContain("AT&T");
	}
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById("assembly"))!;
	for (const fixture of fixtures) {
		const item = learner.modules
			.flatMap(module => module.supplementalProjects)
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
	"persists $fixture.mode/$role source edits, trace and exact export without replacing earlier work",
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
		expect(requests).toHaveLength(7);
		expect(files).toHaveLength(7);
		expect(files.every(file => isValidPythonFileName(file.name))).toBe(
			true
		);
		const key = assemblyCourseProjectKey(
			"assembly",
			fixture.itemId,
			role === "starter" ? "starter" : "reference",
			url
		);
		const earlier = createPythonIdeProject("python", {
			title: "Earlier setup work",
			courseProjectKey: key.replace(/:native-assembly$/, "")
		});
		const project = createPythonIdeProject("assembly", {
			files,
			starterUrl: url,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe(role + "/routine.S");
		for (const file of files) {
			const source = fixture.files[fixture.pack + "/" + file.name];
			expect(file.content).toBe(source.content);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(source.sha256);
		}
		const task =
			fixture.mode === "symbols" ? "routine.S" : "CMakeLists.txt";
		project.files = project.files.map(file => {
			if (file.name === role + "/trace.md")
				return {
					...file,
					content:
						file.content +
						"\nObserved build and symbol evidence saved.\n"
				};
			if (file.name !== role + "/" + task) return file;
			const content =
				fixture.mode === "symbols"
					? file.content.replace(
							role === "starter"
								? "# TODO: export lab_answer to the separately compiled C caller"
								: ".globl lab_answer",
							role === "starter"
								? ".globl lab_answer"
								: "# saved local-symbol regression"
						)
					: file.content.replace(
							role === "starter"
								? 'set(LAB_ASM_LANGUAGE "assembler"'
								: 'set(LAB_ASM_LANGUAGE "assembler-with-cpp"',
							role === "starter"
								? 'set(LAB_ASM_LANGUAGE "assembler-with-cpp"'
								: 'set(LAB_ASM_LANGUAGE "assembler"'
						);
			expect(content).not.toBe(file.content);
			return { ...file, content };
		});
		project.activeFileName = role + "/trace.md";
		saveLocalPythonProjects([earlier, project]);
		const restored = loadLocalPythonProjects();
		expect(restored.find(item => item._id === earlier._id)).toEqual(
			earlier
		);
		const saved = restored.find(item => item._id === project._id)!;
		expect(saved.files).toEqual(project.files);
		expect(saved.activeFileName).toBe(role + "/trace.md");
		const entries = unzipSync(createProjectArchive(saved));
		expect(Object.keys(entries)).toHaveLength(7);
		for (const file of saved.files)
			expect(strFromU8(entries[saved.title + "/" + file.name])).toBe(
				file.content
			);
		const instructions = assemblyBuildInstructions(files, url).join("\n");
		for (const text of [
			"AT&T",
			"Linux x86-64",
			"link failure",
			"LAB_VALUE=73",
			"trace.md",
			"ctest --test-dir build-completed"
		])
			expect(instructions).toContain(text);
		expect(
			assemblyBuildInstructions(
				files.filter(file => file.name !== role + "/lab.h"),
				url
			).join("\n")
		).toContain("incomplete");
		expect(
			assemblyCourseResource(url.replace(fixture.revision, "main"))
		).toBeNull();
		expect(
			assemblyCourseProjectKey(
				"assembly",
				fixture.itemId,
				role === "starter" ? "reference" : "starter",
				url
			)
		).not.toBe(key);
	}
);
