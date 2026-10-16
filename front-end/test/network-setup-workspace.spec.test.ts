import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it } from "vitest";
import {
	networkCourseProjectKey,
	networkFoundationPacks
} from "@/modules/networkProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

type Fixture = {
	pack: string;
	revision: string;
	mode: string;
	moduleId: string;
	coreItemId: string;
	learningPath: string;
	files: Record<string, { content: string; sha256: string }>;
};
const fixtures: Fixture[] = JSON.parse(
	readFileSync(
		resolve(process.cwd(), "../test/fixtures/network-setup-contracts.json"),
		"utf8"
	)
);
afterEach(() => clearLocalPythonProjects());

it("keeps setup transfer and extension optional with distinct saved attempts and a separate required project", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "setup-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["network-systems"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById("network-systems"))!;
	const module = course.modules.find(
		item => item.id === fixtures[0].moduleId
	)!;
	const required = module.curriculum.find(
		item => item.id === networkFoundationPacks[0].coreItemId
	)!;
	const keys = new Set<string>();
	for (const fixture of fixtures) {
		const item = module.supplementalProjects.find(
			item => item.id === fixture.coreItemId
		)!;
		expect(item.learningPath).toBe(fixture.learningPath);
		expect(item.learningPath).not.toBe("core");
		expect(item.content).toContain(
			fixture.files["README.md"].content.trim()
		);
		expect(item.ideImport).toBe(true);
		for (const role of ["starter", "reference"] as const) {
			const url =
				role === "starter" ? item.projectLink! : item.solutionLink!;
			const requiredUrl =
				role === "starter"
					? required.projectLink!
					: required.solutionLink!;
			const key = networkCourseProjectKey(course.id, item.id, role, url);
			expect(key).not.toBe(
				networkCourseProjectKey(
					course.id,
					required.id,
					role,
					requiredUrl
				)
			);
			keys.add(key);
		}
	}
	expect(keys.size).toBe(4);
});

it.each(
	fixtures.flatMap(fixture =>
		["starter", "solution"].map(role => ({ fixture, role }))
	)
)(
	"preserves a completed $fixture.mode/$role configuration and prior work through reopening and ZIP export",
	({ fixture, role }) => {
		setActivePinia(createPinia());
		const key =
			"network-systems:" +
			fixture.coreItemId +
			":" +
			(role === "starter" ? "starter" : "reference") +
			":native-network";
		const files = Object.entries(fixture.files)
			.filter(
				([name]) => name === "README.md" || name.startsWith(role + "/")
			)
			.map(([name, file]) => ({ name, content: file.content }));
		const earlier = createPythonIdeProject("python", {
			title: "Earlier setup work",
			courseProjectKey: key.replace(":native-network", "")
		});
		const project = createPythonIdeProject("linux", {
			files,
			courseID: "network-systems",
			courseProjectKey: key,
			starterUrl:
				"https://github.com/instruction-material/Network-Systems/tree/" +
				fixture.revision +
				"/" +
				fixture.pack +
				"/" +
				role
		});
		project.activeFileName = role + "/case.json";
		const completed =
			fixture.mode === "context"
				? { first_tool: "beta", work_area: "second" }
				: { quote_arguments: true };
		project.files.find(
			file => file.name === project.activeFileName
		)!.content = JSON.stringify(completed, null, 2) + "\n";
		project.files.find(
			file => file.name === role + "/network-notes.md"
		)!.content +=
			"\nIndependent prediction and corrected observation retained.\n";
		saveLocalPythonProjects([earlier, project]);
		const [old, saved] = loadLocalPythonProjects();
		expect(old).toEqual(earlier);
		expect(saved).toEqual(project);
		expect(saved.activeFileName).toBe(role + "/case.json");
		const archive = unzipSync(createProjectArchive(saved));
		expect(Object.keys(archive)).toHaveLength(6);
		const caseFile = Object.keys(archive).find(name =>
			name.endsWith("/" + role + "/case.json")
		)!;
		expect(JSON.parse(strFromU8(archive[caseFile]))).toEqual(completed);
		for (const file of saved.files) {
			const member = Object.keys(archive).find(name =>
				name.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[member])).toBe(file.content);
		}
	}
);
