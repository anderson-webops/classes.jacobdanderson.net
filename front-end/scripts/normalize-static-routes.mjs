import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const publicDir = path.resolve(__dirname, "../public");

async function collectPublicDirectoryNames() {
	const entries = await fs.readdir(publicDir, { withFileTypes: true });
	return new Set(
		entries.filter(entry => entry.isDirectory()).map(entry => entry.name)
	);
}

async function collectHtmlFiles(
	directory,
	ignoredRootDirectories,
	relativeDirectory = ""
) {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const htmlFiles = [];

	for (const entry of entries) {
		const relativePath = path.join(relativeDirectory, entry.name);
		if (entry.isDirectory()) {
			if (
				relativeDirectory === "" &&
				ignoredRootDirectories.has(entry.name)
			) {
				continue;
			}
			htmlFiles.push(
				...(await collectHtmlFiles(
					path.join(directory, entry.name),
					ignoredRootDirectories,
					relativePath
				))
			);
		} else if (entry.isFile() && entry.name.endsWith(".html")) {
			htmlFiles.push(relativePath);
		}
	}

	return htmlFiles;
}

export async function normalizeStaticRoutes(targetDistDir = distDir) {
	// Vite SSG emits this server-rendering manifest for its own build pipeline.
	// The deployed site is fully static, so retaining the directory only exposes
	// internal build metadata without providing any runtime capability.
	await fs.rm(path.join(targetDistDir, ".vite"), {
		force: true,
		recursive: true
	});
	const ignoredRootDirectories = await collectPublicDirectoryNames();
	ignoredRootDirectories.add("assets");
	const htmlFiles = await collectHtmlFiles(
		targetDistDir,
		ignoredRootDirectories
	);

	for (const relativeHtmlPath of htmlFiles) {
		const fileName = path.basename(relativeHtmlPath);
		if (fileName === "index.html" || relativeHtmlPath === "404.html") {
			continue;
		}

		const routePath = relativeHtmlPath.slice(0, -".html".length);
		const routeDirectory = path.join(targetDistDir, routePath);
		const targetIndexPath = path.join(routeDirectory, "index.html");

		await fs.mkdir(routeDirectory, { recursive: true });
		await fs.copyFile(
			path.join(targetDistDir, relativeHtmlPath),
			targetIndexPath
		);
		console.log(
			`[normalize-static-routes] wrote ${path.relative(targetDistDir, targetIndexPath)}`
		);
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	await normalizeStaticRoutes();
}
