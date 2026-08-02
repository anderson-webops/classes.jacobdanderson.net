import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	contentSecurityPolicies,
	exactSecurityHeaders,
	serializeContentSecurityPolicy
} from "../scripts/production-security-headers.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
	return fs.readFile(path.join(repositoryRoot, relativePath), "utf8");
}

function nginxAddHeaderValues(sourceText) {
	const values = new Map();
	const addHeaderPattern = /^\s*add_header\s+([A-Za-z0-9-]+)\s+"((?:\\.|[^"\\])*)"\s+always;\s*$/gmu;
	for (const match of sourceText.matchAll(addHeaderPattern)) {
		const name = match[1].toLowerCase();
		values.set(name, [...(values.get(name) ?? []), match[2]]);
	}
	return values;
}

test("native Nginx keeps static, API, and hidden-file boundaries separate", async () => {
	const [maps, headers, policy, host, unit] = await Promise.all([
		source("deploy/native/classes-http-maps.conf"),
		source("deploy/native/classes-static-headers.conf"),
		source("deploy/native/classes-server-policy.conf"),
		source("deploy/native/host-nginx.conf.example"),
		source("deploy/native/classes-api.service")
	]);

	for (const profile of [
		"standard",
		"code-ide",
		"graph-sketcher",
		"scheduler-embed",
		"wheel-embed",
		"student-management-embed",
		"python-worker"
	]) {
		assert.ok(maps.includes(serializeContentSecurityPolicy(profile)), `${profile} CSP drifted`);
	}
	const configuredHeaders = nginxAddHeaderValues(headers);
	for (const [name, value] of Object.entries(exactSecurityHeaders)) {
		assert.deepEqual(configuredHeaders.get(name), [value]);
	}
	assert.match(policy, /error_page 404 =404 \/404[.]html;/u);
	assert.match(policy, /location = \/404[.]html \{\s*internal;/u);
	assert.match(policy, /location \/ \{\s*try_files \$uri \$uri\/ =404;/u);
	assert.doesNotMatch(policy, /try_files[^;]*index[.]html/u);
	assert.match(policy, /location = \/index[.]html \{/u);
	assert.match(policy, /classes_legacy_route/u);
	assert.match(policy, /location = \/admin\/student-management[.]html \{/u);
	assert.match(policy, /classes_canonical_route/u);
	assert.match(policy, /return 308 https:\/\/classes[.]jacobdanderson[.]net/u);
	assert.match(policy, /proxy_pass http:\/\/127[.]0[.]0[.]1:3008\//u);
	assert.match(policy, /proxy_set_header X-Forwarded-For \$remote_addr;/u);
	assert.doesNotMatch(policy, /proxy_intercept_errors/u);
	assert.match(policy, /location ~ \(\^\|\/\)\\[.] \{/u);
	assert.match(policy, /access_log off;/u);
	assert.match(host, /listen \[::\]:80;/u);
	assert.match(host, /include \/etc\/nginx\/snippets\/classes-http-maps[.]conf;/u);
	assert.match(unit, /Environment=HOST=127[.]0[.]0[.]1/u);
	assert.match(unit, /Environment=PORT=3008/u);
	assert.match(unit, /ExecStart=\/usr\/bin\/node back-end\/dist\/server[.]js/u);
	assert.match(unit, /ProtectSystem=strict/u);
});

test("Nginx header parsing preserves literal backslash sequences", () => {
	const value = String.raw`literal\path\(value\)`;
	const configuredHeaders = nginxAddHeaderValues(
		`add_header X-Literal-Test "${value}" always;\n`
	);

	assert.deepEqual(configuredHeaders.get("x-literal-test"), [value]);
});

test("prepare and promotion scripts enforce exact provenance and rollback gates", async () => {
	const [prepare, promote, verifier, documentation] = await Promise.all([
		source("scripts/prepare-native-release.sh"),
		source("scripts/promote-native-release.sh"),
		source("scripts/verify-native-release.mjs"),
		source("docs/native-production-deployment.md")
	]);

	assert.match(prepare, /Prepare releases as the unprivileged classes-build user/u);
	assert.match(prepare, /cat-file -t "refs\/tags\/\$classes_tag"/u);
	assert.match(prepare, /npm --prefix "\$1"/u);
	assert.match(prepare, /run -w front-end test:unit/u);
	assert.match(prepare, /run -w back-end test/u);
	assert.match(prepare, /run audit/u);
	assert.match(prepare, /classes_staging_candidate\/back-end" ci/u);
	assert.match(prepare, /back-end\/node_modules\/[.]bin/u);
	assert.match(promote, /Candidate must remain inside the managed [.]candidates directory/u);
	assert.match(promote, /chown -R root:root "\$classes_candidate"/u);
	assert.match(promote, /nginx -t/u);
	assert.match(promote, /verify_nginx_includes/u);
	assert.match(promote, /grep -Fxc "# configuration file \$classes_target:"/u);
	assert.match(promote, /atomic_link "\$classes_final_release" "\$classes_current_link"/u);
	assert.match(promote, /restore_previous/u);
	assert.match(promote, /--resolve "classes[.]jacobdanderson[.]net:443:127[.]0[.]0[.]1"/u);
	assert.match(promote, /--resolve "classes[.]jacobdanderson[.]net:80:127[.]0[.]0[.]1"/u);
	assert.match(promote, /https:\/\/classes[.]jacobdanderson[.]net\$classes_http_path/u);
	assert.match(promote, /\/api\/readyz/u);
	assert.match(promote, /"\/404[.]html"/u);
	assert.match(promote, /"\/courses[.]html"/u);
	assert.match(promote, /\/release[.]json/u);
	assert.match(promote, /\/api\/release/u);
	assert.match(promote, /\/api\/__native-release-missing-/u);
	assert.match(promote, /index\(\$0, ":"\)/u);
	assert.match(promote, /--noproxy '\*'/u);
	assert.match(verifier, /front-end\/dist\/[.]vite/u);
	assert.match(verifier, /front-end\/dist\/release[.]json/u);
	assert.match(verifier, /raw static route alias/u);
	assert.match(verifier, /back-end\/node_modules/u);
	assert.match(documentation, /internal `[.]classes-native-release[.]json`/u);
	assert.match(documentation, /Any activation failure restores the prior symlink/u);
});

test("internal manifest detects payload drift and stays out of public output", async t => {
	const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "classes-native-test-"));
	t.after(async () => fs.rm(temporaryRoot, { force: true, recursive: true }));
	const candidate = path.join(temporaryRoot, "candidate");
	for (const directory of [
		"front-end/dist",
		"back-end/dist",
		"back-end/node_modules/runtime-package",
		"front-end",
		"back-end",
		"scripts",
		"deploy"
	]) {
		await fs.mkdir(path.join(candidate, directory), { recursive: true });
	}
	for (const relativePath of [
		"package.json",
		"package-lock.json",
		"front-end/package.json",
		"back-end/package.json",
		"back-end/package-lock.json"
	]) {
		await fs.copyFile(path.join(repositoryRoot, relativePath), path.join(candidate, relativePath));
	}
	await fs.copyFile(
		path.join(repositoryRoot, "scripts/verify-native-release.mjs"),
		path.join(candidate, "scripts/verify-native-release.mjs")
	);
	await fs.cp(path.join(repositoryRoot, "deploy/native"), path.join(candidate, "deploy/native"), {
		recursive: true
	});
	await fs.writeFile(path.join(candidate, "front-end/dist/index.html"), "<h1>Classes with Jacob</h1>\n");
	await fs.writeFile(
		path.join(candidate, "front-end/dist/404.html"),
		"<title>Page not found | Classes with Jacob</title>\n"
	);
	await fs.mkdir(path.join(candidate, "front-end/dist/about"));
	await fs.writeFile(
		path.join(candidate, "front-end/dist/about/index.html"),
		"<h1>About</h1>\n"
	);
	await fs.writeFile(
		path.join(candidate, "front-end/dist/about.html"),
		"<h1>About</h1>\n"
	);
	await fs.writeFile(path.join(candidate, "back-end/dist/server.js"), "export {};\n");
	await fs.writeFile(
		path.join(candidate, "back-end/node_modules/runtime-package/index.js"),
		"export {};\n"
	);

	const verifier = path.join(repositoryRoot, "scripts/verify-native-release.mjs");
	const rawAliasResult = spawnSync(
		process.execPath,
		[verifier, "--write", "--tag", "v2.7.205", "--revision", "a".repeat(40), candidate],
		{ encoding: "utf8" }
	);
	assert.notEqual(rawAliasResult.status, 0);
	assert.match(rawAliasResult.stderr, /raw static route alias/u);
	await fs.rm(path.join(candidate, "front-end/dist/about.html"));

	const writeResult = spawnSync(
		process.execPath,
		[verifier, "--write", "--tag", "v2.7.205", "--revision", "a".repeat(40), candidate],
		{ encoding: "utf8" }
	);
	assert.equal(writeResult.status, 0, writeResult.stderr);
	const verifyResult = spawnSync(process.execPath, [verifier, candidate], { encoding: "utf8" });
	assert.equal(verifyResult.status, 0, verifyResult.stderr);
	assert.equal(
		await fs.lstat(path.join(candidate, ".classes-native-release.json")).then(stats => stats.isFile()),
		true
	);
	await assert.rejects(fs.access(path.join(candidate, "front-end/dist/release.json")));

	await fs.appendFile(path.join(candidate, "back-end/dist/server.js"), "// changed\n");
	const driftResult = spawnSync(process.execPath, [verifier, candidate], { encoding: "utf8" });
	assert.notEqual(driftResult.status, 0);
	assert.match(driftResult.stderr, /checksum mismatch/u);
});

test("all hosting profiles require COOP and CORP consistently", async () => {
	assert.equal(exactSecurityHeaders["cross-origin-opener-policy"], "same-origin");
	assert.equal(exactSecurityHeaders["cross-origin-resource-policy"], "same-origin");
	assert.equal(contentSecurityPolicies.standard["frame-ancestors"][0], "'none'");
	const netlify = await source("netlify.toml");
	assert.match(netlify, /Cross-Origin-Opener-Policy = "same-origin"/u);
	assert.match(netlify, /Cross-Origin-Resource-Policy = "same-origin"/u);
	const packageJson = JSON.parse(await source("package.json"));
	const continuousIntegration = await source(".github/workflows/ci.yml");
	assert.equal(
		packageJson.scripts["test:native-deployment"],
		"node --test test/native-production-deployment.test.mjs"
	);
	assert.match(continuousIntegration, /run: npm run test:native-deployment/u);
	assert.match(continuousIntegration, /run: npm run build/u);
});
