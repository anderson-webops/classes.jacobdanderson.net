import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native source/archive verification.
import { test } from "node:test";
import { strFromU8, unzipSync } from "fflate";
import { createOriginalProject, originalAttributionId, originalScratchProjects } from "../front-end/scripts/scratch/generate-original-projects.mjs";

test("all original Scratch archives preserve the complete upstream program and every media byte", async () => {
	assert.equal(originalScratchProjects.length, 164);
	const assets = new Set();
	const records = [];
	for (const original of originalScratchProjects) {
		const source = JSON.parse(await readFile(new URL(`../front-end/scripts/scratch/originals/projects/${original.id}.json`, import.meta.url), "utf8"));
		const { archive } = await createOriginalProject(original.id);
		const files = unzipSync(archive);
		const loaded = JSON.parse(strFromU8(files["project.json"]));
		const stage = loaded.targets.find(target => target.isStage);
		const attribution = stage.comments[originalAttributionId(original.id)].text;
		assert.ok(attribution.includes(original.author) && attribution.includes(original.url));
		assert.ok(attribution.includes("https://creativecommons.org/licenses/by-sa/2.0/"));
		assert.ok(strFromU8(files["SOURCE.txt"]).includes(attribution));
		delete stage.comments[originalAttributionId(original.id)];
		if (!source.targets.find(target => target.isStage).comments) delete stage.comments;
		assert.deepEqual(loaded, source, `Only attribution may be added to ${original.id}`);
		const expected = new Set(["project.json", "SOURCE.txt"]);
		for (const target of source.targets) {
			for (const asset of [...target.costumes, ...target.sounds]) {
				const name = asset.md5ext || `${asset.assetId}.${asset.dataFormat}`;
				expected.add(name);
				assets.add(name);
				assert.ok(files[name], `${original.id}: ${name}`);
				assert.equal(createHash("md5").update(files[name]).digest("hex"), name.split(".")[0]);
			}
		}
		assert.deepEqual(new Set(Object.keys(files)), expected);
		records.push({ id: original.id, sourceSHA256: original.sourceSHA256, sha256: createHash("sha256").update(archive).digest("hex"), bytes: archive.length });
	}
	assert.equal(assets.size, 505);
	if (process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR) {
		await mkdir(process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR, { recursive: true });
		await writeFile(path.join(process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR, "archive-identity.json"), `${JSON.stringify({ projects: 164, assets: 505, onlyAttributionAdded: true, records }, null, 2)}\n`);
	}
});

test("original Scratch source identifiers cannot select arbitrary files", async () => {
	for (const value of ["../../package", "214828609", "999999999999", "https://scratch.mit.edu/projects/287707460/"])
		await assert.rejects(createOriginalProject(value), /Unknown original Scratch project/);
});
