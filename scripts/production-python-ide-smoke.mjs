const origin = process.env.CLASSES_SITE_ORIGIN || "https://classes.jacobdanderson.net";
const timeoutMs = Number(process.env.CLASSES_SITE_SMOKE_TIMEOUT_MS || 15000);
const pageUrl = new URL("/python-ide", origin);

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

function pageAssetUrls(html) {
	const urls = new Set();
	const assetAttributeRE = /\b(?:href|src)="([^"]+)"/g;
	for (const match of html.matchAll(assetAttributeRE)) {
		const value = match[1];
		if (!value || !value.includes(".js")) continue;

		const url = new URL(value, pageUrl);
		if (url.origin !== pageUrl.origin) continue;
		urls.add(url.href);
	}

	return [...urls];
}

function containsJavaModeCopy(source) {
	return (
		source.includes("Python or Java") ||
		source.includes("Karel Java") ||
		source.includes("runJavaIdeProject")
	);
}

async function main() {
	const html = await fetchText(pageUrl);
	const assetUrls = pageAssetUrls(html);
	if (!assetUrls.length) {
		throw new Error(`${pageUrl.href} did not reference any same-origin JavaScript assets`);
	}

	const assetSources = await Promise.all(
		assetUrls.map(async url => ({
			source: await fetchText(url),
			url
		}))
	);
	const ideAsset = assetSources.find(asset => containsJavaModeCopy(asset.source));
	const hasJavaModeCopy = containsJavaModeCopy(html) || Boolean(ideAsset);

	if (!hasJavaModeCopy) {
		throw new Error(
			`${pageUrl.href} did not include Java mode copy in the HTML or referenced IDE bundle`
		);
	}

	if (!ideAsset) {
		throw new Error(
			`${pageUrl.href} included Java mode copy but no referenced asset matched the current IDE bundle`
		);
	}

	console.log(
		`OK: ${pageUrl.href} references ${ideAsset.url} with Java IDE mode copy/runtime markers`
	);
}

main().catch(error => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
