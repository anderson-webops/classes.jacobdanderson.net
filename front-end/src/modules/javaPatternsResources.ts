import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const javaPatternsRevision = "0ef716cb1fdd66fb6e11167f9c54c74bcb179c31";
export const javaPatternsModuleID =
	"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not";
export const javaPatternsReadingID = `${
	javaPatternsModuleID
}-curriculum-what-patterns-are-and-what-they-are-not-core-concepts`;
export const javaPatternsPricingID = `${
	javaPatternsModuleID
}-curriculum-core-project-what-patterns-are-and-what-they-are-not`;
export const javaPatternsExtensionID = `${
	javaPatternsModuleID
}-supplemental-what-patterns-are-and-what-they-are-not-extension-practice`;
export const javaPatternsComparisonItems = [
	javaPatternsReadingID,
	`${
		javaPatternsModuleID
	}-curriculum-design-exercise-smell-or-reasonable-simplicity`,
	`${
		javaPatternsModuleID
	}-curriculum-reflection-question-when-does-a-pattern-actually-help`,
	`${
		javaPatternsModuleID
	}-curriculum-java-pattern-course-contract-and-characterization-baseline`,
	`${
		javaPatternsModuleID
	}-curriculum-one-change-scenario-before-one-abstraction`,
	javaPatternsExtensionID
] as const;

export function javaPatternsURL(
	pack: "pricing" | "comparison",
	role: "starter" | "solution"
) {
	const folder =
		pack === "pricing"
			? "DPJ1-Pricing-Contracts"
			: "DPJ1-Design-Comparison-Packs";
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaPatternsRevision}/${folder}/${role}`;
}
export function javaPatternsResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaPatternsRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (
		extra !== undefined ||
		!["DPJ1-Pricing-Contracts", "DPJ1-Design-Comparison-Packs"].includes(
			pack ?? ""
		) ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaPatternsProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaPatternsResource(url);
	const sharedReference =
		role === "reference" &&
		selected?.pack === "DPJ1-Design-Comparison-Packs" &&
		(javaPatternsComparisonItems as readonly string[]).includes(itemID);
	const maintainedID = sharedReference ? javaPatternsReadingID : itemID;
	const base = `${courseID}:${maintainedID}:${role}`;
	return selected && courseID === "design-patterns-in-java"
		? `${base}:native-java-patterns`
		: base;
}
export function javaPatternsImportFiles(url: string) {
	const selected = javaPatternsResource(url);
	if (!selected) return null;
	const names =
		selected.pack === "DPJ1-Pricing-Contracts"
			? [
					"Main.java",
					"PricingStrategy.java",
					"BulkPricingStrategy.java",
					"ContractTests.java",
					"README.md"
				]
			: ["Main.java", "ContractTests.java", "README.md"];
	return names.map(name => {
		const path = `${selected.resource.path}/${name}`;
		return {
			name,
			file: {
				path,
				label: name,
				size: null,
				htmlUrl: `https://github.com/${selected.resource.owner}/${selected.resource.repo}/blob/${selected.resource.ref}/${path}`,
				rawUrl: githubRawUrl(selected.resource, path)
			}
		};
	});
}
