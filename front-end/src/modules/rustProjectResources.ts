import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const rustCargoRevision = "54e4b74c556375f5f57c8fd52d23878aedca255f";
export const rustCargoPack = "RUST-00-cargo-tooling-evidence";
export const rustCargoModuleId =
	"rust-systems-security-rss0-tooling-cargo-and-why-rust-exists";
export const rustCargoItemIds = {
	core: `${rustCargoModuleId}-curriculum-core-project-tooling-cargo-and-why-rust-exists`,
	workflow: `${rustCargoModuleId}-supplemental-project-first-cargo-audit-cli`,
	choice: `${rustCargoModuleId}-supplemental-tooling-cargo-and-why-rust-exists-transfer-practice`,
	challenge: `${rustCargoModuleId}-supplemental-tooling-cargo-and-why-rust-exists-extension-practice`
} as const;
export const rustCargoRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/main.rs",
	"diagnostics/moved-value.rs",
	"diagnostics/fixed-value.rs"
] as const;

export function rustCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "low-level-security" ||
		resource.ref !== rustCargoRevision
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	if (
		pack !== rustCargoPack ||
		rest.length ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}

export function rustCourseProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	url: string
) {
	const selected =
		courseId === "rust-systems-security" && rustCourseResource(url);
	const savedItem =
		selected &&
		Object.values(rustCargoItemIds).includes(
			itemId as (typeof rustCargoItemIds)[keyof typeof rustCargoItemIds]
		)
			? rustCargoItemIds.core
			: itemId;
	const base = `${courseId}:${savedItem}:${role}`;
	return selected ? `${base}:native-rust` : base;
}

export function rustImportFiles(url: string) {
	const selected = rustCourseResource(url);
	if (!selected) return null;
	const { resource, role, pack } = selected;
	return [
		...rustCargoRoleFiles.map(name => `${role}/${name}`),
		"README.md"
	].map(name => {
		const path = `${pack}/${name}`;
		return {
			name,
			file: {
				path,
				htmlUrl: `https://github.com/${resource.owner}/${resource.repo}/blob/${resource.ref}/${path}`,
				rawUrl: githubRawUrl(resource, path),
				label: name,
				size: null
			}
		};
	});
}
