import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { linuxSystemsCourse } from "@/stores/courses/linux-systems";

const EXPECTED_CORE_SEQUENCE = [
	"LS0 Setup and Tooling",
	"Unit 1: Shell Foundations",
	"Unit 2: Filesystem Hierarchy and Directory Purpose",
	"Unit 3: Users, Groups, and Permissions",
	"Unit 4: Editing and Configuration",
	"Unit 5: Processes and Job Control",
	"Unit 6: Services and systemd",
	"Unit 7: Logging and Observability",
	"Unit 8: Scheduling and Automation",
	"Unit 9: Package Management and Software Layout",
	"Unit 10: Networking from a Systems View",
	"Unit 11: Web Servers",
	"Unit 12: Storage, Backups, and Reliability",
	"Linux Systems Lab 17: Operations Capstone Studio"
];

const PRACTICE_SECTIONS = [
	"lab-readiness-and-scope-case",
	"shell-pipeline-and-exit-status-case",
	"filesystem-purpose-and-path-case",
	"users-groups-and-permissions-case",
	"configuration-change-and-rollback-case",
	"process-state-and-signal-case",
	"systemd-service-and-failure-case",
	"journal-and-observability-case",
	"scheduler-and-automation-case",
	"package-source-and-update-case",
	"network-state-and-diagnostics-case",
	"web-server-and-reverse-proxy-case",
	"backup-restore-and-capacity-case",
	"operations-capstone-incident-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

async function requireLinuxSystemsCourse() {
	const course = await loadRawCourse("linux-systems");
	expect(course).not.toBeNull();
	return course!;
}

function courseItems(module: (typeof linuxSystemsCourse.modules)[number]) {
	return [...module.curriculum, ...module.supplementalProjects];
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/gu, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/gu, "-")
				.replace(/-+/gu, "-")
		)
	);
}

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(__dirname, `../public/course-assets/linux/${filename}`),
		"utf8"
	);
}

describe("Linux Systems learner flow", () => {
	it("keeps one coherent foundation-to-operations-capstone core", async () => {
		const loaded = await requireLinuxSystemsCourse();
		const loadedCore = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		expect(
			linuxSystemsCourse.modules.slice(0, 14).map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);
		expect(loadedCore.map(module => module.title)).toEqual(
			EXPECTED_CORE_SEQUENCE
		);
		expect(loadedCore).toHaveLength(14);
		expect(loadedCore.every(module => module.kind === "module")).toBe(true);
	});

	it("moves three repetitive integration studios into one optional archive", () => {
		const archive = linuxSystemsCourse.modules.at(-1);
		const text = JSON.stringify(archive);

		expect(archive?.title).toBe(
			"Optional Linux Integration Studio Archive"
		);
		expect(archive?.kind).toBe("appendix");
		expect(archive?.curriculum).toHaveLength(1);
		expect(archive?.supplementalProjects).toHaveLength(21);
		expect(
			courseItems(archive!).every(item => item.learningPath !== "core")
		).toBe(true);
		expect(text).toContain(
			"Linux Systems Lab 14: Service Deployment Studio"
		);
		expect(text).toContain(
			"Linux Systems Lab 15: Automation and Observability Studio"
		);
		expect(text).toContain("Linux Systems Lab 16: Backup Recovery Studio");
		expect(text).toContain("completing all three is not required");
	});

	it("adds a bounded schedule and six-part operational map to every core module", () => {
		for (const module of linuxSystemsCourse.modules.slice(0, 14)) {
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Course flow:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Safe practice route:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Evidence gate:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Local continuity:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Primary reference:**"
			);
		}
	});

	it("keeps existing source projects traceable while distinguishing starter and solution", () => {
		const projectItems = linuxSystemsCourse.modules
			.flatMap(courseItems)
			.filter(item => item.projectLink);

		expect(projectItems.length).toBeGreaterThanOrEqual(65);
		for (const item of projectItems) {
			expect(item.projectLink, item.title).toContain(
				"github.com/instruction-material/Linux-Systems"
			);
			expect(item.projectLink, item.title).toContain("/starter");
			expect(item.solutionLink, item.title).toContain("/solution");
			expect(item.solutionLink, item.title).not.toBe(item.projectLink);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/linux\/linux-systems-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every local case and verification anchor valid", () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("linux-systems-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("linux-systems-verification-guide.md")
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const module of linuxSystemsCourse.modules.slice(0, 14)) {
			const content = module.curriculum[0].content;
			const practiceMatch = content.match(
				/\/course-assets\/linux\/linux-systems-practice-pack\.md#([a-z0-9-]+)/u
			);
			const answerMatch = content.match(
				/\/course-assets\/linux\/linux-systems-verification-guide\.md#([a-z0-9-]+)/u
			);

			expect(practiceMatch, module.title).not.toBeNull();
			expect(answerMatch, module.title).not.toBeNull();
			expect(practiceSlugs, module.title).toContain(practiceMatch?.[1]);
			expect(answerSlugs, module.title).toContain(answerMatch?.[1]);
		}
	});

	it("uses a current named distribution baseline without pretending all Linux is identical", async () => {
		const course = await requireLinuxSystemsCourse();
		const text = JSON.stringify(course);

		expect(text).toContain("Ubuntu Server 26.04 LTS");
		expect(text).toContain("Debian 13");
		expect(text).toContain("exact distribution/version is recorded");
		expect(text).toContain(
			"systemd, journald, package-manager, path, and service-name differences"
		);
		expect(text).toContain("Distribution-specific commands");
	});

	it("makes every privileged or state-changing exercise recoverable", async () => {
		const text = JSON.stringify(await requireLinuxSystemsCourse());

		expect(text).toContain("never use `chmod 777`");
		expect(text).toContain(
			"validate Nginx or Apache configuration before a reload"
		);
		expect(text).toContain(
			"Do not edit host `fstab`, format devices, overwrite the source"
		);
		expect(text).toContain(
			"Do not disable host protections, open a public listener"
		);
		expect(text).toContain(
			"Every privileged change records expected result"
		);
		expect(assetText("linux-systems-practice-pack.md")).toContain(
			"disable-stop-remove plus snapshot rollback"
		);
	});

	it("provides a complete transcript route when live system access is unavailable", async () => {
		const loaded = await requireLinuxSystemsCourse();
		const core = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		for (const module of core) {
			const text = JSON.stringify(module);
			expect(text, module.title).toContain(
				"/course-assets/linux/linux-systems-practice-pack.md#"
			);
			expect(text, module.title).toContain(
				"/course-assets/linux/linux-systems-verification-guide.md#"
			);
		}

		expect(assetText("linux-systems-practice-pack.md")).toContain(
			"All names, addresses, logs, and service data are fictional"
		);
	});

	it("retains course-specific operational language and canonical anchor labs", async () => {
		const text = JSON.stringify(await requireLinuxSystemsCourse());

		expect(text).toContain(
			"`grep`, `find`, `rg`, `sort`, `uniq`, `wc`, and `xargs` work as a family"
		);
		expect(text).toContain(
			"File permissions and directory permissions behave differently"
		);
		expect(text).toContain(
			"`journalctl` is the central way to read systemd-managed service output"
		);
		for (const folder of [
			"LS1-Personal-Lab-VM",
			"LS2-Static-Site-from-srv",
			"LS3-Nginx-Reverse-Proxy-App",
			"LS4-Apache-Virtual-Host-Compare",
			"LS5-Systemd-Toy-Service",
			"LS6-Backup-Cron-and-Timer"
		]) {
			expect(text, folder).toContain(folder);
		}
	});

	it("publishes an honest source, safety, and capstone contract", async () => {
		const metadata = (await requireLinuxSystemsCourse())
			.developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.standards).toHaveLength(6);
		expect(metadata?.toolchain).toHaveLength(5);
		expect(metadata?.safetyPolicy).toHaveLength(6);
		expect(metadata?.courseBoundaries).toHaveLength(4);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.sourcePolicy).toContain(
			"LS1–LS6 are the primary multi-file operational labs"
		);
		expect(metadata?.sourcePolicy).toContain(
			"numbered LS-* folders are lightweight shell checkpoints"
		);
	});
});
