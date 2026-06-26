#!/usr/bin/env node

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const auditSource = String.raw`
import {
	courseCatalog,
	loadRawCourse
} from "@/stores/courses/index";
import {
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES,
	STATIC_MEDIA_BASE
} from "@/stores/courses/staticMedia";

const staticPrefix = STATIC_MEDIA_BASE + "/";
const knownPending = new Set(KNOWN_PENDING_STATIC_MEDIA_FILENAMES);
const urls = new Map();

function add(url, source) {
	if (!url?.startsWith(staticPrefix)) return;
	const sources = urls.get(url) ?? [];
	sources.push(source);
	urls.set(url, sources);
}

for (const entry of courseCatalog) {
	const course = await loadRawCourse(entry.id);
	if (!course) continue;

	for (const module of course.modules) {
		const items = [
			...module.curriculum,
			...module.supplementalProjects
		];

		for (const item of items) {
			const source = [entry.id, module.title, item.title].join(" / ");
			add(item.mediaLink, source);
			add(item.datasetLink, source);
			add(item.projectLink, source);
			add(item.solutionLink, source);
		}
	}
}

const missing = [];
const available = [];

for (const [url, sources] of [...urls].sort(([left], [right]) =>
	left.localeCompare(right)
)) {
	let status = 0;
	let ok = false;
	let error = "";

	try {
		let response = await fetch(url, { method: "HEAD" });
		if (response.status === 405 || response.status === 403) {
			response = await fetch(url, {
				headers: { Range: "bytes=0-0" },
				method: "GET"
			});
		}
		status = response.status;
		ok = response.ok || response.status === 206;
	} catch (err) {
		error = err instanceof Error ? err.message : String(err);
	}

	const filename = url.slice(staticPrefix.length);
	const row = {
		filename,
		isKnownPending: knownPending.has(filename),
		sourceCount: sources.length,
		sources,
		status,
		url,
		...(error ? { error } : {})
	};

	if (ok) available.push(row);
	else missing.push(row);
}

const unknownMissing = missing.filter(row => !row.isKnownPending);
console.log(
	JSON.stringify(
		{
			availableCount: available.length,
			checkedCount: urls.size,
			missing,
			missingCount: missing.length,
			unknownMissing
		},
		null,
		2
	)
);

if (unknownMissing.length > 0) {
	process.exitCode = 1;
}
`;

const tempDir = await mkdtemp(join(tmpdir(), "classes-static-media-"));
const auditFile = join(tempDir, "audit.ts");

try {
	await writeFile(auditFile, auditSource);

	const child = spawn(
		"npm",
		["exec", "-w", "front-end", "--", "vite-node", auditFile],
		{
			stdio: "inherit"
		}
	);

	const exitCode = await new Promise((resolve, reject) => {
		child.once("error", reject);
		child.once("exit", code => resolve(code ?? 1));
	});

	process.exitCode = exitCode;
} finally {
	await rm(tempDir, { force: true, recursive: true });
}
