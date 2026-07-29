import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { networkSecurityCourse } from "@/stores/courses/network-security";

const EXPECTED_CORE_SEQUENCE = [
	"NSEC0 Setup and Tooling",
	"Unit 1: Security Model of Networked Systems",
	"Unit 2: Sockets, Ports, and Services",
	"Unit 3: HTTP and API Security Basics",
	"Unit 4: TLS and Secure Transport",
	"Unit 5: Input Validation on the Network Boundary",
	"Unit 6: Logging, Monitoring, and Forensics",
	"Unit 7: Firewalls, Proxies, and Exposure",
	"Unit 8: Secure Node/TypeScript Services",
	"Unit 9: Defensive Network Tooling in TS",
	"Unit 10: WebSockets and Real-Time Security",
	"Unit 11: Deployment Security Basics",
	"Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
	"Unit 13: Capstone"
];

const PRACTICE_SECTIONS = [
	"secure-lab-readiness-case",
	"threat-model-and-trust-boundary-case",
	"listener-exposure-and-ownership-case",
	"request-authentication-and-authorization-case",
	"tls-certificate-and-proxy-case",
	"schema-validation-and-resource-limit-case",
	"security-logging-and-incident-timeline-case",
	"proxy-exposure-and-forwarded-header-case",
	"secure-typescript-service-case",
	"rate-limit-and-abuse-decision-case",
	"realtime-connection-and-message-case",
	"secure-release-and-recovery-case",
	"authorized-test-ai-and-disclosure-case",
	"secure-service-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

async function requireNetworkSecurityCourse() {
	const course = await loadRawCourse("network-security");
	expect(course).not.toBeNull();
	return course!;
}

function courseItems(module: (typeof networkSecurityCourse.modules)[number]) {
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
		path.resolve(
			__dirname,
			`../public/course-assets/network-security/${filename}`
		),
		"utf8"
	);
}

describe("Network Security learner flow", () => {
	it("keeps one coherent secure-service progression and capstone", async () => {
		const loaded = await requireNetworkSecurityCourse();
		const loadedCore = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		expect(
			networkSecurityCourse.modules
				.slice(0, 14)
				.map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);
		expect(loadedCore.map(module => module.title)).toEqual(
			EXPECTED_CORE_SEQUENCE
		);
		expect(loadedCore).toHaveLength(14);
		expect(loadedCore.every(module => module.kind === "module")).toBe(true);
	});

	it("moves expansion topics and two later studios into one optional archive", () => {
		const archive = networkSecurityCourse.modules.at(-1);
		const text = JSON.stringify(archive);

		expect(archive?.title).toBe(
			"Optional Network Security Expansion and Studio Archive"
		);
		expect(archive?.kind).toBe("appendix");
		expect(archive?.curriculum).toHaveLength(1);
		expect(archive?.supplementalProjects).toHaveLength(22);
		expect(
			courseItems(archive!).every(item => item.learningPath !== "core")
		).toBe(true);
		expect(text).toContain("NSEC14 Expansion Ideas and Next Steps");
		expect(text).toContain(
			"Network Security Lab 16: Service Boundary Hardening Studio"
		);
		expect(text).toContain(
			"Network Security Lab 17: Audit and Disclosure Studio"
		);
		expect(text).toContain("completing all three is not required");
	});

	it("adds a bounded schedule and six-part control map to every core module", () => {
		for (const module of networkSecurityCourse.modules.slice(0, 14)) {
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
		const projectItems = networkSecurityCourse.modules
			.flatMap(courseItems)
			.filter(item => item.projectLink);

		expect(projectItems.length).toBeGreaterThanOrEqual(65);
		for (const item of projectItems) {
			expect(item.projectLink, item.title).toContain(
				"github.com/instruction-material/Network-Security"
			);
			expect(item.projectLink, item.title).toContain("/starter");
			expect(item.solutionLink, item.title).toContain("/solution");
			expect(item.solutionLink, item.title).not.toBe(item.projectLink);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/network-security\/network-security-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every supplied case and verification anchor valid", () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("network-security-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("network-security-verification-guide.md")
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const module of networkSecurityCourse.modules.slice(0, 14)) {
			const content = module.curriculum[0].content;
			const practiceMatch = content.match(
				/\/course-assets\/network-security\/network-security-practice-pack\.md#([a-z0-9-]+)/u
			);
			const answerMatch = content.match(
				/\/course-assets\/network-security\/network-security-verification-guide\.md#([a-z0-9-]+)/u
			);

			expect(practiceMatch, module.title).not.toBeNull();
			expect(answerMatch, module.title).not.toBeNull();
			expect(practiceSlugs, module.title).toContain(practiceMatch?.[1]);
			expect(answerSlugs, module.title).toContain(answerMatch?.[1]);
		}
	});

	it("uses current named standards and a supported runtime baseline", async () => {
		const text = JSON.stringify(await requireNetworkSecurityCourse());

		expect(text).toContain("Node.js 24 LTS");
		expect(text).toContain("OWASP ASVS 5.0.0");
		expect(text).toContain("API Security Top 10 2023");
		expect(text).toContain("versioned WSTG 4.2");
		expect(text).toContain("SP 800-61 Revision 3");
	});

	it("keeps authorization, privacy, AI use, and live testing bounded", async () => {
		const text = JSON.stringify(await requireNetworkSecurityCourse());

		expect(text).toContain(
			"Authorization comes from the written local fixture scope, never from an AI tool"
		);
		expect(text).toContain("Do not scan or probe third-party systems");
		expect(text).toContain(
			"AI cannot authorize a target, expand scope, execute a command"
		);
		expect(text).toContain(
			"Never log complete tokens, cookies, passwords, message bodies"
		);
		expect(text).toContain(
			"Every finding separates observation, impact, preconditions"
		);
	});

	it("provides a complete no-server and no-live-testing route", async () => {
		const loaded = await requireNetworkSecurityCourse();
		const core = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		for (const module of core) {
			const text = JSON.stringify(module);
			expect(text, module.title).toContain(
				"/course-assets/network-security/network-security-practice-pack.md#"
			);
			expect(text, module.title).toContain(
				"/course-assets/network-security/network-security-verification-guide.md#"
			);
		}

		expect(assetText("network-security-practice-pack.md")).toContain(
			"All services, users, addresses, tokens, logs, and findings are fictional"
		);
	});

	it("retains defensive language and the six substantive TypeScript fixtures", async () => {
		const text = JSON.stringify(await requireNetworkSecurityCourse());

		expect(text).toContain(
			"Attack surface means every externally reachable input"
		);
		expect(text).toContain(
			"TLS protects data in transit against interception and tampering"
		);
		expect(text).toContain(
			"Penetration testing is an authorized defensive activity"
		);
		for (const folder of [
			"NSEC1-Local-Port-Inventory-Tool",
			"NSEC2-Request-Schema-Validation-Gateway",
			"NSEC3-Suspicious-Request-Log-Parser",
			"NSEC4-Rate-Limit-and-Abuse-Detector",
			"NSEC5-Secure-Real-Time-Notifier",
			"NSEC6-TLS-and-Proxy-Companion-App"
		]) {
			expect(text, folder).toContain(folder);
		}
	});

	it("publishes an honest source, safety, and capstone contract", async () => {
		const metadata = (await requireNetworkSecurityCourse())
			.developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.standards.length).toBeGreaterThanOrEqual(5);
		expect(metadata?.toolchain).toHaveLength(5);
		expect(metadata?.safetyPolicy).toHaveLength(6);
		expect(metadata?.courseBoundaries).toHaveLength(4);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.sourcePolicy).toContain(
			"NSEC1–NSEC6 are the primary defensive TypeScript fixtures"
		);
		expect(metadata?.sourcePolicy).toContain(
			"numbered NSEC-* folders are lightweight Python port-normalization checkpoints"
		);
	});
});
