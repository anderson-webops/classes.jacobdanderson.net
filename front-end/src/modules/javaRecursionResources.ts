import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const javaRecursionRevision = "d3bb9c332fb1908ba9da8b73d8fdc70e6ae1d4d6";
export const javaRecursionModuleID = "java-level-3-aj4-recursion";
export const javaRecursionReadingID = `${javaRecursionModuleID}-curriculum-recursion-core-concepts`;
export const javaRecursionProjects = [
	{
		pack: "AJ4-Recursion-Practice-Packs",
		id: `${
			javaRecursionModuleID
		}-curriculum-aj4-project-1-recursion-practice`
	},
	{
		pack: "AJ4-Divisible-by-7-Packs",
		id: `${javaRecursionModuleID}-curriculum-aj4-project-2-divisible-by-7`
	}
] as const;
export const javaRecursionContinuations = [
	`${javaRecursionModuleID}-supplemental-extension-challenge-recursion`,
	`${javaRecursionModuleID}-supplemental-recursive-trace-transfer-practice`
] as const;

export function javaRecursionURL(folder: string) {
	return `https://github.com/instruction-material/Java-Level-3/tree/${
		javaRecursionRevision
	}/${folder}`;
}

export function javaRecursionResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaRecursionRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "AJ4-Call-Trace" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		extra !== undefined ||
		!javaRecursionProjects.some(project => project.pack === pack) ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}

export function javaRecursionProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaRecursionResource(url);
	const continuation = (
		javaRecursionContinuations as readonly string[]
	).includes(itemID);
	const maintainedID =
		courseID === "java-level-3" &&
		continuation &&
		selected?.pack === javaRecursionProjects[0].pack
			? javaRecursionProjects[0].id
			: itemID;
	const base = `${courseID}:${maintainedID}:${role}`;
	return selected && courseID === "java-level-3"
		? `${base}:native-java-recursion`
		: base;
}

export function javaRecursionImportFiles(url: string) {
	const selected = javaRecursionResource(url);
	if (!selected) return null;
	return ["Main.java", "ContractTests.java", "README.md"].map(name => {
		const path = `${selected.resource.path}/${name}`;
		return {
			name,
			file: {
				path,
				label: name,
				size: null,
				htmlUrl: `https://github.com/${selected.resource.owner}/${
					selected.resource.repo
				}/blob/${selected.resource.ref}/${path}`,
				rawUrl: githubRawUrl(selected.resource, path)
			}
		};
	});
}
