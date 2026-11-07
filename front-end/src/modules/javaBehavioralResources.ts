import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaStructuralProjectKey } from "./javaStructuralResources";

export const javaBehavioralRevision =
	"1f1b5f143b553bf95e714346d09c000110e37ee6";
export const javaBehavioralModuleID =
	"design-patterns-in-java-dpj6-behavioral-patterns-i";
export const javaBehavioralReadingID =
	"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-behavioral-patterns-i-core-concepts";
export const javaBehavioralApplicationID =
	"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-behavioral-patterns-i-application-check";
export const javaBehavioralCoreID =
	"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-core-project-behavioral-patterns-i";
export const javaBehavioralExtensionID =
	"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-behavioral-patterns-i-extension-practice";
export const javaBehavioralReferenceItems = [
	"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-behavioral-patterns-i-core-concepts",
	"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-behavioral-patterns-i-application-check",
	"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-core-project-behavioral-patterns-i",
	"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-behavioral-patterns-i-extension-practice"
] as const;
export const javaBehavioralFiles = [
	"ContractTests.java",
	"Main.java",
	"README.md",
	"sources.txt",
	"src/behavior/Document.java",
	"src/behavior/ReportTemplate.java",
	"src/behavior/Reports.java",
	"src/behavior/ReviewQueue.java",
	"src/behavior/RuleContext.java",
	"src/behavior/Rules.java",
	"src/behavior/TextRule.java"
] as const;
export const javaBehavioralWorkedFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md"
] as const;
export function javaBehavioralURL(role: "starter" | "solution" | "example") {
	if (role === "example")
		return `https://github.com/instruction-material/Java-Level-3/tree/${javaBehavioralRevision}/DPJ6-Behavioral-Worked-Example`;
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaBehavioralRevision}/DPJ6-Behavioral-Document-Packs/${role}`;
}
export function javaBehavioralResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaBehavioralRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "DPJ6-Behavioral-Worked-Example" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		pack !== "DPJ6-Behavioral-Document-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaBehavioralProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaBehavioralResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaStructuralProjectKey(courseID, itemID, role, url);
	const readingReference =
		selected.role !== "example" &&
		role === "reference" &&
		(javaBehavioralReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		selected.role !== "example" &&
		role === "starter" &&
		[javaBehavioralApplicationID, javaBehavioralExtensionID].includes(
			itemID
		);
	const maintainedID = readingReference
		? javaBehavioralReadingID
		: learnerContinuation
			? javaBehavioralCoreID
			: itemID;
	return `${courseID}:${maintainedID}:${role}:native-java-behavioral`;
}
export function javaBehavioralImportFiles(url: string) {
	const selected = javaBehavioralResource(url);
	if (!selected) return null;
	const names =
		selected.role === "example"
			? javaBehavioralWorkedFiles
			: javaBehavioralFiles;
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
