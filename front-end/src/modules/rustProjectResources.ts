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

export const rustOwnershipRevision = "337017b99d7b64a1bfd32a0cf6295e9e310f6293";
export const rustOwnershipPack = "RUST-01-ownership-evidence";
export const rustOwnershipModuleId =
	"rust-systems-security-rss1-ownership-moves-and-memory-responsibility";
export const rustOwnershipItemIds = {
	core: `${rustOwnershipModuleId}-curriculum-core-project-ownership-moves-and-memory-responsibility`,
	workflow: `${rustOwnershipModuleId}-supplemental-project-ownership-and-move-tracer`,
	choice: `${rustOwnershipModuleId}-supplemental-ownership-moves-and-memory-responsibility-transfer-practice`,
	challenge: `${rustOwnershipModuleId}-supplemental-ownership-moves-and-memory-responsibility-extension-practice`
} as const;
export const rustOwnershipRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/main.rs",
	"diagnostics/use-after-move.rs",
	"diagnostics/returned-owner.rs",
	"diagnostics/use-after-drop.rs",
	"diagnostics/last-use-before-drop.rs",
	"diagnostics/copy-owned.rs",
	"diagnostics/clone-owned.rs"
] as const;
const rustLessons = [
	{
		kind: "cargo",
		revision: rustCargoRevision,
		pack: rustCargoPack,
		roleFiles: rustCargoRoleFiles,
		itemIds: rustCargoItemIds
	},
	{
		kind: "ownership",
		revision: rustOwnershipRevision,
		pack: rustOwnershipPack,
		roleFiles: rustOwnershipRoleFiles,
		itemIds: rustOwnershipItemIds
	}
] as const;

export function rustCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "low-level-security"
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = rustLessons.find(
		lesson => lesson.pack === pack && lesson.revision === resource.ref
	);
	if (
		!definition ||
		rest.length ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role, definition };
}

export function rustCourseProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	url: string
) {
	const selected =
		courseId === "rust-systems-security" && rustCourseResource(url);
	const knownItems: readonly string[] = selected
		? Object.values(selected.definition.itemIds)
		: [];
	const savedItem =
		selected && knownItems.includes(itemId)
			? selected.definition.itemIds.core
			: itemId;
	const base = `${courseId}:${savedItem}:${role}`;
	return selected ? `${base}:native-rust` : base;
}

export function rustImportFiles(url: string) {
	const selected = rustCourseResource(url);
	if (!selected) return null;
	const { resource, role, pack, definition } = selected;
	return [
		...definition.roleFiles.map(name => `${role}/${name}`),
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
