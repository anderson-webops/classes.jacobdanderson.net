import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaCreationalProjectKey } from "./javaCreationalResources";

export const javaBoundaryRevision = "58bdf79b35e5d867e558c4d01448a6d1f3568980";
export const javaBoundaryModuleID =
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns";
export const javaBoundaryReadingID =
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-creational-patterns-ii-and-boundary-patterns-core-concepts";
export const javaBoundaryApplicationID =
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-creational-patterns-ii-and-boundary-patterns-application-check";
export const javaBoundaryCoreID =
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-core-project-creational-patterns-ii-and-boundary-patterns";
export const javaBoundaryExtensionID =
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-creational-patterns-ii-and-boundary-patterns-extension-practice";
export const javaBoundaryReferenceItems = [
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-creational-patterns-ii-and-boundary-patterns-core-concepts",
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-creational-patterns-ii-and-boundary-patterns-application-check",
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-core-project-creational-patterns-ii-and-boundary-patterns",
	"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-creational-patterns-ii-and-boundary-patterns-extension-practice"
] as const;
export const javaBoundaryFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md",
	"sources.txt",
	"src/boundary/LegacyPrice.java",
	"src/boundary/LifetimeExamples.java",
	"src/boundary/OrderDraft.java",
	"src/boundary/PriceAdapter.java",
	"src/boundary/PricePort.java",
	"src/boundary/QuoteFacade.java"
] as const;
export const javaBoundaryWorkedFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md"
] as const;
export function javaBoundaryURL(role: "starter" | "solution" | "example") {
	if (role === "example")
		return `https://github.com/instruction-material/Java-Level-3/tree/${javaBoundaryRevision}/DPJ4-Boundary-Worked-Example`;
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaBoundaryRevision}/DPJ4-Legacy-Quote-Packs/${role}`;
}
export function javaBoundaryResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaBoundaryRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "DPJ4-Boundary-Worked-Example" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		pack !== "DPJ4-Legacy-Quote-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaBoundaryProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaBoundaryResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaCreationalProjectKey(courseID, itemID, role, url);
	const readingReference =
		selected.role !== "example" &&
		role === "reference" &&
		(javaBoundaryReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		selected.role !== "example" &&
		role === "starter" &&
		[javaBoundaryApplicationID, javaBoundaryExtensionID].includes(itemID);
	const maintainedID = readingReference
		? javaBoundaryReadingID
		: learnerContinuation
			? javaBoundaryCoreID
			: itemID;
	return `${courseID}:${maintainedID}:${role}:native-java-boundary`;
}
export function javaBoundaryImportFiles(url: string) {
	const selected = javaBoundaryResource(url);
	if (!selected) return null;
	const names =
		selected.role === "example"
			? javaBoundaryWorkedFiles
			: javaBoundaryFiles;
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
