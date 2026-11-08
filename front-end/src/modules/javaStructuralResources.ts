import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaBoundaryProjectKey } from "./javaBoundaryResources";

export const javaStructuralRevision =
	"7a3b994cffa168769f34270efda85c745866891a";
export const javaStructuralModuleID =
	"design-patterns-in-java-dpj5-structural-patterns-in-depth";
export const javaStructuralReadingID =
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-structural-patterns-in-depth-core-concepts";
export const javaStructuralApplicationID =
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-structural-patterns-in-depth-application-check";
export const javaStructuralCoreID =
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-core-project-structural-patterns-in-depth";
export const javaStructuralExtensionID =
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-structural-patterns-in-depth-extension-practice";
export const javaStructuralReferenceItems = [
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-structural-patterns-in-depth-core-concepts",
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-structural-patterns-in-depth-application-check",
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-core-project-structural-patterns-in-depth",
	"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-structural-patterns-in-depth-extension-practice"
] as const;
export const javaStructuralFiles = [
	"ContractTests.java",
	"Main.java",
	"README.md",
	"sources.txt",
	"src/scene/Box.java",
	"src/scene/Circle.java",
	"src/scene/Formats.java",
	"src/scene/Frame.java",
	"src/scene/GlyphPool.java",
	"src/scene/Graphic.java",
	"src/scene/Group.java",
	"src/scene/LazyGraphic.java",
	"src/scene/Placement.java",
	"src/scene/Renderer.java"
] as const;
export const javaStructuralWorkedFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md"
] as const;
export function javaStructuralURL(role: "starter" | "solution" | "example") {
	if (role === "example")
		return `https://github.com/instruction-material/Java-Level-3/tree/${javaStructuralRevision}/DPJ5-Structural-Worked-Example`;
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaStructuralRevision}/DPJ5-Structural-Scene-Packs/${role}`;
}
export function javaStructuralResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaStructuralRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "DPJ5-Structural-Worked-Example" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		pack !== "DPJ5-Structural-Scene-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaStructuralProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaStructuralResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaBoundaryProjectKey(courseID, itemID, role, url);
	const readingReference =
		selected.role !== "example" &&
		role === "reference" &&
		(javaStructuralReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		selected.role !== "example" &&
		role === "starter" &&
		[javaStructuralApplicationID, javaStructuralExtensionID].includes(
			itemID
		);
	const maintainedID = readingReference
		? javaStructuralReadingID
		: learnerContinuation
			? javaStructuralCoreID
			: itemID;
	return `${courseID}:${maintainedID}:${role}:native-java-structural`;
}
export function javaStructuralImportFiles(url: string) {
	const selected = javaStructuralResource(url);
	if (!selected) return null;
	const names =
		selected.role === "example"
			? javaStructuralWorkedFiles
			: javaStructuralFiles;
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
