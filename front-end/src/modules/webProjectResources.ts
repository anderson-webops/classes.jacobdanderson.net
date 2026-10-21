import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const webPortfolioRevision = "2c7a9fa89e052cd5cdc51987ebf837ae81e3557f";
export const webPortfolioPack = "WDF1-Portfolio-Custom-Domain";
export const webPortfolioRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webPortfolioRevision}/${webPortfolioPack}`;
export const webModulePortfolioRevision =
	"6bfe60b31c07cbfabbc396790f1251503b1f4f7d";
export const webModulePortfolioRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webModulePortfolioRevision}/${webPortfolioPack}`;
export const webPortfolioRoleFiles = [
	"index.html",
	"main.js",
	"styles.css",
	"package.json"
] as const;
export const webNotificationRevision =
	"c18190dcca466f35f1e4a7ed677d922fa80daff8";
export const webNotificationPack = "WDF4-Realtime-Chat-App/local-client";
export const webNotificationRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webNotificationRevision}/${webNotificationPack}`;

const definitions = [
	{
		revision: webPortfolioRevision,
		pack: webPortfolioPack,
		project: "portfolio",
		version: 1,
		workflow: "vite",
		files: webPortfolioRoleFiles,
		shared: ["README.md"]
	},
	{
		revision: webModulePortfolioRevision,
		pack: webPortfolioPack,
		project: "portfolio",
		version: 2,
		workflow: "vite",
		files: [...webPortfolioRoleFiles, "project-idea.js"],
		shared: ["README.md"]
	},
	{
		revision: webNotificationRevision,
		pack: webNotificationPack,
		project: "notification-state",
		version: 1,
		workflow: "standalone",
		files: [
			"index.html",
			"app.mjs",
			"state.mjs",
			"styles.css",
			"events.json",
			"empty.json",
			"invalid.json",
			"malformed.json",
			"history.json",
			"out-of-order.json"
		],
		shared: ["README.md", "serve.mjs"]
	}
] as const;

export function webCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "web-development-foundations"
	) {
		return null;
	}
	const ref = resource.ref === "main" ? webPortfolioRevision : resource.ref;
	const definition = definitions.find(
		row =>
			row.revision === ref &&
			[`${row.pack}/starter`, `${row.pack}/solution`].includes(
				resource.path
			)
	);
	if (!definition) return null;
	const role = resource.path.endsWith("/starter")
		? ("starter" as const)
		: ("solution" as const);
	return {
		resource: { ...resource, ref },
		pack: definition.pack,
		role,
		definition
	};
}

export function webCourseResourceUrl(url: string) {
	const selected = webCourseResource(url);
	return selected
		? `https://github.com/${selected.resource.owner}/${selected.resource.repo}/tree/${selected.resource.ref}/${selected.pack}/${selected.role}`
		: null;
}

export function webCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = webCourseResource(url);
	return courseID === "web-development-foundations" && selected
		? `${courseID}:${selected.definition.project}:${role}:web-source-v${selected.definition.version}`
		: `${courseID}:${itemID}:${role}`;
}

export function webImportFiles(url: string) {
	const selected = webCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role, definition } = selected;
	const imports = [
		...definition.files.map(name => ({
			name,
			path: `${pack}/${role}/${name}`
		})),
		...definition.shared.map(name => ({ name, path: `${pack}/${name}` }))
	];
	return imports.map(({ name, path }) => {
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
