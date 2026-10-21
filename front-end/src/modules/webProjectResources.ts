import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const webPortfolioRevision = "2c7a9fa89e052cd5cdc51987ebf837ae81e3557f";
export const webPortfolioPack = "WDF1-Portfolio-Custom-Domain";
export const webPortfolioRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webPortfolioRevision}/${webPortfolioPack}`;
export const webPortfolioRoleFiles = [
	"index.html",
	"main.js",
	"styles.css",
	"package.json"
] as const;

export function webCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "web-development-foundations" ||
		!["main", webPortfolioRevision].includes(resource.ref)
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	if (
		pack !== webPortfolioPack ||
		(role !== "starter" && role !== "solution") ||
		rest.length
	) {
		return null;
	}
	return { resource: { ...resource, ref: webPortfolioRevision }, pack, role };
}

export function webCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	return courseID === "web-development-foundations" && webCourseResource(url)
		? `${courseID}:portfolio:${role}:web-source-v1`
		: `${courseID}:${itemID}:${role}`;
}

export function webImportFiles(url: string) {
	const selected = webCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role } = selected;
	return [...webPortfolioRoleFiles, "README.md"].map(name => {
		const path =
			name === "README.md"
				? `${pack}/${name}`
				: `${pack}/${role}/${name}`;
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
