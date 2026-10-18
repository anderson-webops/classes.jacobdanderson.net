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
export const rustBorrowingRevision = "660b39f70a2c24d5f702b64e5ce12d10db03f9b8";
export const rustBorrowingPack = "RUST-02-borrowing-evidence";
export const rustBorrowingModuleId =
	"rust-systems-security-rss2-borrowing-aliasing-and-lifetimes";
export const rustBorrowingItemIds = {
	core: "rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-curriculum-core-project-borrowing-aliasing-and-lifetimes",
	workflow:
		"rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-supplemental-project-borrowing-and-aliasing-lab",
	choice: "rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-supplemental-borrowing-aliasing-and-lifetimes-transfer-practice",
	challenge:
		"rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-supplemental-borrowing-aliasing-and-lifetimes-extension-practice"
} as const;
export const rustBorrowingRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/main.rs",
	"diagnostics/escaped-local.rs",
	"diagnostics/last-use-before-mutation.rs",
	"diagnostics/missing-lifetime.rs",
	"diagnostics/owned-result.rs",
	"diagnostics/related-lifetimes.rs",
	"diagnostics/shared-and-mutable.rs",
	"diagnostics/split-borrows.rs",
	"diagnostics/two-mutable.rs"
] as const;

export const rustTypedErrorsRevision =
	"1c436c353bd8664ea92c4abd8cfb71d95a26c75a";
export const rustTypedErrorsPack = "RUST-03-typed-errors-evidence";
export const rustTypedErrorsModuleId =
	"rust-systems-security-rss3-option-result-and-typed-error-paths";
export const rustTypedErrorsItemIds = {
	core: "rust-systems-security-rss3-option-result-and-typed-error-paths-curriculum-core-project-option-result-and-typed-error-paths",
	workflow:
		"rust-systems-security-rss3-option-result-and-typed-error-paths-supplemental-project-option-and-result-audit-tool",
	choice: "rust-systems-security-rss3-option-result-and-typed-error-paths-supplemental-option-result-and-typed-error-paths-transfer-practice",
	challenge:
		"rust-systems-security-rss3-option-result-and-typed-error-paths-supplemental-option-result-and-typed-error-paths-extension-practice"
} as const;
export const rustTypedErrorsRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"diagnostics/exhaustive-match.rs",
	"diagnostics/missing-match.rs",
	"diagnostics/option-question-mark.rs",
	"diagnostics/option-to-result.rs",
	"diagnostics/sentinel-result.rs",
	"diagnostics/typed-result.rs"
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
	},
	{
		kind: "borrowing",
		revision: rustBorrowingRevision,
		pack: rustBorrowingPack,
		roleFiles: rustBorrowingRoleFiles,
		itemIds: rustBorrowingItemIds
	},
	{
		kind: "typed-errors",
		revision: rustTypedErrorsRevision,
		pack: rustTypedErrorsPack,
		roleFiles: rustTypedErrorsRoleFiles,
		itemIds: rustTypedErrorsItemIds
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
