#!/usr/bin/env node

import { readFileSync } from "node:fs";
import process from "node:process";
import { pathToFileURL } from "node:url";

const coursePrefix = "~^/courses(?:/|$) \"";

export function courseContentSecurityPolicy(mapSource) {
	const lines = mapSource
		.split("\n")
		.map(line => line.trim())
		.filter(line => line.startsWith(coursePrefix));
	if (lines.length !== 1 || !lines[0].endsWith("\";")) {
		throw new Error("The release map has no unique course policy.");
	}
	const policy = lines[0].slice(coursePrefix.length, -2);
	if (!policy.startsWith("default-src ")) {
		throw new Error("The release map has an invalid course policy.");
	}
	return policy;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		if (process.argv.length !== 3) throw new Error("Expected one release map path.");
		process.stdout.write(
			courseContentSecurityPolicy(readFileSync(process.argv[2], "utf8"))
		);
	}
	catch {
		console.error("Could not read the retained release's course security policy.");
		process.exitCode = 1;
	}
}
