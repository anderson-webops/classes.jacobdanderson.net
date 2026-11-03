import assert from "node:assert/strict";
import * as filesystem from "node:fs";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
// Run these contracts independently of the application test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";
import { runInNewContext } from "node:vm";
import { renderToString } from "@vue/server-renderer";
import { glob, globSync, hasMagic } from "glob";
import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { Minimatch, minimatch } from "minimatch";
import { createSSRApp, h } from "vue";
import { createI18n } from "vue-i18n";

const require = createRequire(import.meta.url);

test("the patched math dependency retains inline and display rendering", () => {
	const output = micromark(
		"Inline $x^2 + 1$ and\n\n$$\n\\frac{1}{2}\n$$\n",
		{ extensions: [math()], htmlExtensions: [mathHtml()] }
	);
	assert.match(output, /class="math math-inline"/);
	assert.match(output, /<msup><mi>x<\/mi><mn>2<\/mn><\/msup>/);
	assert.match(output, /class="math math-display"/);
	assert.match(output, /<mfrac><mn>1<\/mn><mn>2<\/mn><\/mfrac>/);
});

test("server rendering rejects carriage returns in attribute names", async () => {
	const app = createSSRApp({
		render: () => h("div", {
			"data-safe": "kept",
			"x\ronclick": "alert(1)"
		}, "Safe")
	});
	assert.equal(await renderToString(app), "<div data-safe=\"kept\">Safe</div>");
});

test("matching retains modern CommonJS, ESM, EditorConfig and ESLint contracts", () => {
	const common = require("minimatch");
	for (const matcher of [minimatch, common.minimatch]) {
		assert.equal(matcher("src/page.vue", "**/*.{ts,vue}"), true);
		assert.equal(matcher("src/page.js", "**/*.{ts,vue}"), false);
		assert.equal(matcher("src/.private.vue", "**/*.vue"), false);
		assert.equal(matcher("src/.private.vue", "**/*.vue", { dot: true }), true);
		assert.equal(matcher("MAIN.PY", "*.py", { nocase: true }), true);
	}
	assert.equal(new Minimatch("*.py", { matchBase: true, dot: true, noext: true }).match("lessons/main.py"), true);
	assert.equal(new common.Minimatch("src/**/*.ts", { partial: true }).match("src/nested"), true);
	assert.equal(new Minimatch("!**/*.js", { flipNegate: true }).match("src/main.js"), true);
});

test("optimization bounds amplification while retaining ordinary matches", () => {
	assert.match(require("minimatch/package.json").version, /^11\./u);
	for (const optimizationLevel of [0, 1, 2]) {
		const bounded = new Minimatch(Array.from({ length: 30 }).fill("**/../a/b").join("/"), { optimizationLevel, braceExpandMax: 64 });
		assert.ok(bounded.set.length <= 64);
		const ordinary = new Minimatch("src/**/*.{ts,vue}", { optimizationLevel });
		assert.equal(ordinary.match("src/unit/page.vue"), true);
		assert.equal(ordinary.match("src/unit/page.js"), false);
	}
});

test("glob retains sync/async exports and stops cancelled traversal", async () => {
	const directory = await fs.mkdtemp(path.join(tmpdir(), "classes-glob-contract-"));
	try {
		await fs.mkdir(path.join(directory, "keep/deep"), { recursive: true });
		await fs.mkdir(path.join(directory, "ignored"));
		for (const filename of ["keep/a.py", "keep/deep/b.py", "ignored/c.py"]) await fs.writeFile(path.join(directory, filename), "synthetic fixture\n");
		const options = { cwd: directory, ignore: "ignored/**", absolute: true };
		const expected = ["keep/a.py", "keep/deep/b.py"].map(filename => path.join(directory, filename)).sort();
		assert.equal(hasMagic("**/*.py"), true);
		assert.deepEqual(globSync("**/*.py", options).sort(), expected);
		assert.deepEqual((await glob("**/*.py", options)).sort(), expected);
		const controller = new AbortController();
		let reads = 0;
		const guardedFs = { ...filesystem, readdir(...args) {
			reads++;
			controller.abort(new Error("Synthetic cancellation"));
			return filesystem.readdir(...args);
		} };
		await assert.rejects(glob("**/*", { cwd: directory, fs: guardedFs, signal: controller.signal }));
		await new Promise(resolve => setTimeout(resolve, 50));
		assert.ok(reads <= 1, `Unexpected post-cancellation traversal: ${reads}`);
	}
	finally {
		await fs.rm(directory, { recursive: true, force: true });
	}
});

test("translations escape mixed parameters and disable nested srcdoc documents", () => {
	const i18n = createI18n({ legacy: false, locale: "en", escapeParameter: true, warnHtmlMessage: false, messages: { en: { ordinary: "Hello {name}", mixed: "{0} {name}", frame: "<iframe srcdoc=\"{body}\"></iframe>" } } });
	assert.equal(i18n.global.t("ordinary", { name: "Learner" }), "Hello Learner");
	const mixed = i18n.global.t("mixed", ["Practice"], { named: { name: "<b>Learner</b>" } });
	assert.ok(mixed.includes("&lt;b&gt;"));
	assert.ok(!mixed.includes("<b>"));
	assert.doesNotMatch(i18n.global.t("frame", { body: "<p>Lesson</p>" }), /\bsrcdoc\s*=/iu);
});

test("cross-realm sensitive-header lists protect redirected credentials", async () => {
	const target = createServer((request, response) => response.end(JSON.stringify(request.headers)));
	let destination;
	const source = createServer((request, response) => {
		if (request.url === "/same") return response.end(JSON.stringify(request.headers));
		response.writeHead(302, { Location: destination });
		response.end();
	});
	try {
		await new Promise(resolve => target.listen(0, "127.0.0.1", resolve));
		destination = `http://127.0.0.1:${target.address().port}/target`;
		await new Promise(resolve => source.listen(0, "127.0.0.1", resolve));
		const origin = `http://127.0.0.1:${source.address().port}`;
		const headers = { "X-Project-Key": "synthetic-secret", "Authorization": "Bearer synthetic", "Cookie": "session=synthetic" };
		const read = route => new Promise((resolve, reject) => {
			const request = require("follow-redirects").http.get(origin + route, { headers: { ...headers }, sensitiveHeaders: runInNewContext("[\"X-Project-Key\"]") }, (response) => {
				let body = "";
				response.setEncoding("utf8");
				response.on("data", (chunk) => {
					body += chunk;
				});
				response.on("end", () => resolve(JSON.parse(body)));
			});
			request.on("error", reject);
			request.setTimeout(3000, () => request.destroy(new Error("Synthetic redirect timeout")));
		});
		const redirected = await read("/redirect");
		assert.equal(redirected["x-project-key"], undefined);
		assert.equal(redirected.authorization, undefined);
		assert.equal(redirected.cookie, undefined);
		assert.equal((await read("/same"))["x-project-key"], "synthetic-secret");
	}
	finally {
		for (const server of [source, target]) {
			server.closeAllConnections();
			await new Promise(resolve => server.close(resolve));
		}
	}
});

test("Cypress keeps the patched system-information diagnostic API", () => {
	assert.equal(require("systeminformation/package.json").version, "5.33.16");
	const diagnostics = require("systeminformation");
	for (const method of ["osInfo", "networkStats", "services"]) assert.equal(typeof diagnostics[method], "function");
});
