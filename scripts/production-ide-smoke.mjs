import { pathToFileURL } from "node:url";

const origin =
	process.env.CLASSES_SITE_ORIGIN || "https://classes.jacobdanderson.net";
const timeoutMs = Number(process.env.CLASSES_SITE_SMOKE_TIMEOUT_MS || 15000);
const smokePaths = ["/ide", "/python-ide", "/bluej"];
const pageUrl = new URL(smokePaths[0], origin);

async function fetchText(url) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			headers: {
				accept: "text/html,application/javascript,text/javascript,*/*"
			},
			signal: controller.signal
		});

		if (!response.ok) {
			throw new Error(`${url} returned HTTP ${response.status}`);
		}

		return await response.text();
	}
	finally {
		clearTimeout(timeout);
	}
}

export function pageAssetUrls(html, baseUrl = pageUrl) {
	const urls = new Set();
	const assetAttributeRE = /\b(?:href|src)="([^"]+)"/g;
	for (const match of html.matchAll(assetAttributeRE)) {
		const value = match[1];
		if (!value || !value.includes(".js")) continue;

		const url = new URL(value, baseUrl);
		if (url.origin !== baseUrl.origin) continue;
		urls.add(url.href);
	}

	return [...urls];
}

export function productionIdeSmokePageUrls(baseOrigin = origin) {
	return smokePaths.map(path => new URL(path, baseOrigin));
}

export function containsJavaModeCopy(source) {
	return (
		source.includes("Python or Java") ||
		source.includes("Karel Java") ||
		source.includes("runJavaIdeProject")
	);
}

export function containsCurrentIdeBundleMarkers(source) {
	return (
		source.includes("Code, run, and draw in Python or Java") &&
		source.includes("Create and exchange BlueJ Java projects") &&
		source.includes("preview Java console programs or Karel robot") &&
		source.includes("BlueJ integration for desktop object-bench projects") &&
		source.includes("ZIP import") &&
		source.includes("package.bluej export") &&
		source.includes("Karel world ready") &&
		source.includes("BlueJ workspace") &&
		source.includes("Full Code IDE") &&
		source.includes("BlueJ integration") &&
		source.includes("BlueJ Desktop Integration") &&
		source.includes("BlueJ desktop bridge") &&
		source.includes("Class diagram preview") &&
		source.includes("Object bench class") &&
		source.includes("New BlueJ project") &&
		source.includes("Import BlueJ ZIP") &&
		source.includes("Download BlueJ ZIP") &&
		source.includes("Java preview skipped projects over") &&
		source.includes("total Java characters") &&
		source.includes("https://github.com/k-pet-group/BlueJ-Greenfoot")
	);
}

async function assertProductionIdePage(pageUrl) {
	const html = await fetchText(pageUrl);
	const assetUrls = pageAssetUrls(html, pageUrl);
	if (!assetUrls.length) {
		throw new Error(
			`${pageUrl.href} did not reference any same-origin JavaScript assets`
		);
	}

	const assetSources = await Promise.all(
		assetUrls.map(async url => ({
			source: await fetchText(url),
			url
		}))
	);
	const ideAsset = assetSources.find(asset =>
		containsCurrentIdeBundleMarkers(asset.source)
	);

	if (
		!containsJavaModeCopy(html) &&
		!assetSources.some(asset => containsJavaModeCopy(asset.source))
	) {
		throw new Error(
			`${pageUrl.href} did not include Java mode copy in the HTML or referenced IDE bundle`
		);
	}

	if (!ideAsset) {
		throw new Error(
			`${pageUrl.href} did not reference a current Code IDE bundle with Java and BlueJ runtime markers`
		);
	}

	console.log(
		`OK: ${pageUrl.href} references ${ideAsset.url} with current Code IDE Java/BlueJ markers`
	);
}

export async function runProductionIdeSmoke() {
	for (const smokePageUrl of productionIdeSmokePageUrls()) {
		await assertProductionIdePage(smokePageUrl);
	}
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionIdeSmoke().catch(error => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
