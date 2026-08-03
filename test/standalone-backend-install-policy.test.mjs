import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
// This executable configuration test intentionally uses Node's test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";

const repositoryRoot = resolve(import.meta.dirname, "..");
const exactInstallScriptPins = [
	"argon2@0.44.0",
	"esbuild@0.28.1",
	"fsevents@2.3.3"
];

function read(relativePath) {
	return readFileSync(join(repositoryRoot, relativePath), "utf8");
}

function readJson(relativePath) {
	return JSON.parse(read(relativePath));
}

function packageNameFromLockPath(location) {
	const marker = "node_modules/";
	const packagePath = location.slice(
		location.lastIndexOf(marker) + marker.length
	);
	const segments = packagePath.split("/");
	return segments[0].startsWith("@")
		? `${segments[0]}/${segments[1]}`
		: segments[0];
}

function installScriptPins(lockfile) {
	const pins = installScriptOccurrences(lockfile).map(
		({ name, version }) => `${name}@${version}`
	);
	return [...new Set(pins)].sort();
}

function installScriptOccurrences(lockfile) {
	return Object.entries(lockfile.packages)
		.filter(
			([location, metadata]) =>
				location.includes("node_modules/")
				&& metadata.hasInstallScript === true
		)
		.map(([location, metadata]) => ({
			location,
			name: packageNameFromLockPath(location),
			version: metadata.version
		}));
}

function installedPackagePins(lockfile) {
	const pins = Object.entries(lockfile.packages)
		.filter(([location]) => location.includes("node_modules/"))
		.map(
			([location, metadata]) =>
				`${packageNameFromLockPath(location)}@${metadata.version}`
		);
	return new Set(pins);
}

function exactPackageIdentity(identity) {
	const separator = identity.lastIndexOf("@");
	assert.notEqual(separator, -1, `invalid exact package identity: ${identity}`);
	return {
		name: identity.slice(0, separator),
		version: identity.slice(separator + 1)
	};
}

function expectedRegistryTarball(name, version) {
	const tarballName = name.slice(name.lastIndexOf("/") + 1);
	return `https://registry.npmjs.org/${name}/-/${tarballName}-${version}.tgz`;
}

function npmrcSettings(source) {
	const settings = new Map();
	for (const line of source.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const separator = trimmed.indexOf("=");
		assert.notEqual(separator, -1, `invalid .npmrc line: ${trimmed}`);
		const name = trimmed.slice(0, separator);
		assert.equal(
			settings.has(name),
			false,
			`duplicate .npmrc key: ${name}`
		);
		settings.set(name, trimmed.slice(separator + 1));
	}
	return settings;
}

function workflowJob(source, name) {
	const marker = `    ${name}:\n`;
	const start = source.indexOf(marker);
	assert.notEqual(start, -1, `missing ${name} job`);
	const remainder = source.slice(start + marker.length);
	const nextJob = remainder.search(/^ {4}[\w-]+:\n/mu);
	return nextJob === -1
		? source.slice(start)
		: source.slice(start, start + marker.length + nextJob);
}

function workflowJobNames(source) {
	return [...source.matchAll(/^ {4}([\w-]+):\n/gmu)].map(
		match => match[1]
	);
}

test("standalone backend approvals exactly match lockfile install scripts", () => {
	const lockPins = installScriptPins(readJson("back-end/package-lock.json"));
	assert.deepEqual(lockPins, exactInstallScriptPins);
	assert.equal(
		Object.hasOwn(readJson("back-end/package.json"), "allowScripts"),
		false
	);

	const settings = npmrcSettings(read("back-end/.npmrc"));
	assert.deepEqual(
		[...settings],
		[
			["strict-allow-scripts", "true"],
			["allow-scripts", exactInstallScriptPins.join(",")]
		]
	);
});

test("root approvals exactly match every install script in its graph", () => {
	const packageJson = readJson("package.json");
	const rootLockfile = readJson("package-lock.json");
	const rootPackages = installedPackagePins(rootLockfile);
	const standalonePinsInRoot = installScriptPins(
		readJson("back-end/package-lock.json")
	).filter(identity => rootPackages.has(identity));
	const expectedApprovals = [
		...new Set([
			...installScriptPins(rootLockfile),
			...standalonePinsInRoot
		])
	].sort();
	const expectedDenials = ["connect-mongo", "express-rate-limit"];
	const policyEntries = Object.entries(packageJson.allowScripts);
	const approvals = Object.entries(packageJson.allowScripts)
		.filter(([, allowed]) => allowed === true)
		.map(([identity]) => identity)
		.sort();
	const denials = Object.entries(packageJson.allowScripts)
		.filter(([, allowed]) => allowed === false)
		.map(([identity]) => identity)
		.sort();

	assert.equal(
		policyEntries.every(([, allowed]) => typeof allowed === "boolean"),
		true
	);
	assert.deepEqual(
		policyEntries.map(([identity]) => identity).sort(),
		[...expectedApprovals, ...expectedDenials].sort()
	);
	assert.deepEqual(approvals, expectedApprovals);
	assert.deepEqual(denials, expectedDenials);
	for (const { location, name, version } of installScriptOccurrences(
		rootLockfile
	)) {
		const exactDecision = packageJson.allowScripts[`${name}@${version}`];
		const nameDecision = packageJson.allowScripts[name];
		assert.equal(
			exactDecision === true || nameDecision === false,
			true,
			`install script lacks an explicit allow or deny decision: ${location}`
		);
	}
	assert.deepEqual(
		[...npmrcSettings(read(".npmrc"))],
		[["strict-allow-scripts", "true"]]
	);
});

test("every exact-approved root install script has trusted lock provenance", () => {
	const packageJson = readJson("package.json");
	const rootLockfile = readJson("package-lock.json");
	const approvals = Object.entries(packageJson.allowScripts)
		.filter(([, allowed]) => allowed === true)
		.map(([identity]) => identity);

	for (const identity of approvals) {
		const { name, version } = exactPackageIdentity(identity);
		const occurrences = Object.entries(rootLockfile.packages).filter(
			([location, metadata]) =>
				location.includes("node_modules/")
				&& packageNameFromLockPath(location) === name
				&& metadata.version === version
		);

		assert.notEqual(
			occurrences.length,
			0,
			`exact approval is absent from the root lockfile: ${identity}`
		);
		for (const [location, metadata] of occurrences) {
			assert.equal(
				metadata.resolved,
				expectedRegistryTarball(name, version),
				`untrusted registry source for ${identity} at ${location}`
			);
			assert.match(
				metadata.integrity ?? "",
				/^sha512-[A-Za-z0-9+/]+={0,2}$/u,
				`missing sha512 integrity for ${identity} at ${location}`
			);
			assert.equal(
				Buffer.from(metadata.integrity.slice("sha512-".length), "base64")
					.length,
				64,
				`invalid sha512 integrity for ${identity} at ${location}`
			);
		}
	}
});

test("backend CI installs the standalone lockfile with fail-closed flags", () => {
	const backendInstall = workflowJob(
		read(".github/workflows/ci.yml"),
		"backend-install"
	);
	const packageManager = readJson("package.json").packageManager;
	assert.match(packageManager, /^npm@\d+\.\d+\.\d+$/u);
	const npmVersion = packageManager.slice("npm@".length);
	const exactPinBlock = [
		`                  npm i -g ${packageManager}`,
		"                  npm -v",
		`                  test "$(npm --version)" = "${npmVersion}"`
	].join("\n");
	assert.equal(
		backendInstall.includes(exactPinBlock),
		true,
		"backend-install must pin and assert the root packageManager version"
	);
	assert.match(
		backendInstall,
		/^ {14}run: node --test test\/standalone-backend-install-policy\.test\.mjs$/mu
	);
	assert.match(
		backendInstall,
		/^ {14}run: npm ci --include=optional --strict-allow-scripts --workspaces=false$/mu
	);
	assert.match(
		backendInstall,
		/^ {14}run: npm audit --include=optional --workspaces=false$/mu
	);
});

test("every root npm ci job pins and asserts the packageManager version", () => {
	const workflow = read(".github/workflows/ci.yml");
	const packageManager = readJson("package.json").packageManager;
	const npmVersion = packageManager.slice("npm@".length);
	const rootInstallJobs = workflowJobNames(workflow).filter(name =>
		/^ {14}run: npm ci$/mu.test(workflowJob(workflow, name))
	);

	assert.notEqual(rootInstallJobs.length, 0, "missing root npm ci jobs");
	for (const name of rootInstallJobs) {
		const job = workflowJob(workflow, name);
		assert.match(
			job,
			new RegExp(`^ {18}npm i -g ${packageManager}$`, "mu"),
			`${name} must pin the root packageManager version`
		);
		assert.match(
			job,
			new RegExp(
				`^ {18}test "\\$\\(npm --version\\)" = "${npmVersion}"$`,
				"mu"
			),
			`${name} must assert the root packageManager version`
		);
	}
});
