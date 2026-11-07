import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaPatternsProjectKey } from "./javaPatternsResources";
export const javaFoundationsRevision =
	"36edc08edc3fc9cb138bb30eda588d17c906f612";
export const javaFoundationsModuleID =
	"design-patterns-in-java-dpj2-java-design-foundations";
export const javaFoundationsReadingID =
	javaFoundationsModuleID +
	"-curriculum-java-design-foundations-core-concepts";
export const javaFoundationsCoreID =
	javaFoundationsModuleID +
	"-curriculum-core-project-java-design-foundations";
export const javaFoundationsBlobID =
	javaFoundationsModuleID +
	"-curriculum-refactoring-exercise-untangle-a-responsibility-blob";
export const javaFoundationsExtensionID =
	javaFoundationsModuleID +
	"-supplemental-java-design-foundations-extension-practice";
export const javaFoundationsReferenceItems = [
	"design-patterns-in-java-dpj2-java-design-foundations-curriculum-java-design-foundations-core-concepts",
	"design-patterns-in-java-dpj2-java-design-foundations-curriculum-refactoring-exercise-untangle-a-responsibility-blob",
	"design-patterns-in-java-dpj2-java-design-foundations-curriculum-design-review-favoring-explicit-package-structure",
	"design-patterns-in-java-dpj2-java-design-foundations-curriculum-modern-java-types-before-classic-pattern-machinery",
	"design-patterns-in-java-dpj2-java-design-foundations-curriculum-package-dependency-and-test-seam-contract",
	"design-patterns-in-java-dpj2-java-design-foundations-curriculum-core-project-java-design-foundations",
	"design-patterns-in-java-dpj2-java-design-foundations-supplemental-java-design-foundations-extension-practice"
] as const;
export const javaFoundationsFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md",
	"sources.txt",
	"src/report/domain/Report.java",
	"src/report/ports/ReportFormatter.java",
	"src/report/ports/ReportSink.java",
	"src/report/application/ReportPublisher.java",
	"src/report/adapters/TextFormatter.java",
	"src/report/adapters/UppercaseTitleFormatter.java",
	"src/report/adapters/ConsoleSink.java",
	"src/report/legacy/ReportBlob.java",
	"src/report/examples/LanguageChoices.java"
] as const;
export function javaFoundationsURL(role: "starter" | "solution") {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaFoundationsRevision}/DPJ2-Report-Foundations-Packs/${role}`;
}
export function javaFoundationsResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaFoundationsRevision
	)
		return null;
	const [pack, role, extra] = resource.path.split("/");
	if (
		pack !== "DPJ2-Report-Foundations-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	)
		return null;
	return { resource, pack, role };
}
export function javaFoundationsProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaFoundationsResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaPatternsProjectKey(courseID, itemID, role, url);
	const readingReference =
		role === "reference" &&
		(javaFoundationsReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		role === "starter" &&
		[javaFoundationsBlobID, javaFoundationsExtensionID].includes(itemID);
	const maintainedID = readingReference
		? javaFoundationsReadingID
		: learnerContinuation
			? javaFoundationsCoreID
			: itemID;
	return `${courseID}:${maintainedID}:${role}:native-java-foundations`;
}
export function javaFoundationsImportFiles(url: string) {
	const selected = javaFoundationsResource(url);
	if (!selected) return null;
	return javaFoundationsFiles.map(name => {
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
