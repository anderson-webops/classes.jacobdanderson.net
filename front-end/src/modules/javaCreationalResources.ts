import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaFoundationsProjectKey } from "./javaFoundationsResources";

export const javaCreationalRevision =
	"b82c4e7e50be39652407661e402d1e17c75c65a7";
export const javaCreationalModuleID =
	"design-patterns-in-java-dpj3-creational-patterns-i";
export const javaCreationalReadingID = `${
	javaCreationalModuleID
}-curriculum-creational-patterns-i-core-concepts`;
export const javaCreationalCoreID = `${
	javaCreationalModuleID
}-curriculum-core-project-creational-patterns-i`;
export const javaCreationalBuilderID = `${javaCreationalModuleID}-curriculum-builder`;
export const javaCreationalExtensionID = `${
	javaCreationalModuleID
}-supplemental-creational-patterns-i-extension-practice`;
export const javaCreationalReferenceItems = [
	"design-patterns-in-java-dpj3-creational-patterns-i-curriculum-creational-patterns-i-core-concepts",
	"design-patterns-in-java-dpj3-creational-patterns-i-curriculum-builder",
	"design-patterns-in-java-dpj3-creational-patterns-i-curriculum-core-project-creational-patterns-i",
	"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-creational-patterns-i-extension-practice"
] as const;
export const javaCreationalFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md",
	"sources.txt",
	"src/creation/BodyLine.java",
	"src/creation/Exporters.java",
	"src/creation/Families.java",
	"src/creation/FamilyRenderer.java",
	"src/creation/Heading.java",
	"src/creation/Renderer.java",
	"src/creation/RendererFactory.java",
	"src/creation/Report.java",
	"src/creation/ReportJob.java",
	"src/creation/Style.java"
] as const;
export const javaCreationalWorkedFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md"
] as const;
export function javaCreationalURL(role: "starter" | "solution" | "example") {
	if (role === "example")
		return `https://github.com/instruction-material/Java-Level-3/tree/${javaCreationalRevision}/DPJ3-Creation-Worked-Example`;
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaCreationalRevision}/DPJ3-Report-Creation-Packs/${role}`;
}
export function javaCreationalResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaCreationalRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "DPJ3-Creation-Worked-Example" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		pack !== "DPJ3-Report-Creation-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaCreationalProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaCreationalResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaFoundationsProjectKey(courseID, itemID, role, url);
	const readingReference =
		selected.role !== "example" &&
		role === "reference" &&
		(javaCreationalReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		selected.role !== "example" &&
		role === "starter" &&
		[javaCreationalBuilderID, javaCreationalExtensionID].includes(itemID);
	const maintainedID = readingReference
		? javaCreationalReadingID
		: learnerContinuation
			? javaCreationalCoreID
			: itemID;
	return `${courseID}:${maintainedID}:${role}:native-java-creational`;
}
export function javaCreationalImportFiles(url: string) {
	const selected = javaCreationalResource(url);
	if (!selected) return null;
	const names =
		selected.role === "example"
			? javaCreationalWorkedFiles
			: javaCreationalFiles;
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
