import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native source/archive verification.
import { test } from "node:test";
import { strFromU8, unzipSync } from "fflate";
import { createOriginalProject, originalAttributionId, originalScratchProjects } from "../front-end/scripts/scratch/generate-original-projects.mjs";

const compatibility = JSON.parse(await readFile(new URL("../front-end/scripts/scratch/originals/compatibility.json", import.meta.url), "utf8")).changes;

test("all original Scratch archives retain upstream bytes and only reviewed SVG corrections", async () => {
	assert.equal(originalScratchProjects.length, 164);
	const assets = new Set();
	const records = [];
	const correctedProjects = new Set();
	const correctedAssets = new Set();
	for (const original of originalScratchProjects) {
		const source = JSON.parse(await readFile(new URL(`../front-end/scripts/scratch/originals/projects/${original.id}.json`, import.meta.url), "utf8"));
		const { archive } = await createOriginalProject(original.id);
		const files = unzipSync(archive);
		assert.equal(createHash("sha256").update(files["SOURCE/project.json"]).digest("hex"), original.sourceSHA256);
		const loaded = JSON.parse(strFromU8(files["project.json"]));
		const stage = loaded.targets.find(target => target.isStage);
		const attribution = stage.comments[originalAttributionId(original.id)].text;
		assert.ok(attribution.includes(original.author) && attribution.includes(original.url));
		assert.ok(attribution.includes("https://creativecommons.org/licenses/by-sa/2.0/"));
		assert.ok(strFromU8(files["SOURCE.txt"]).includes(attribution));
		delete stage.comments[originalAttributionId(original.id)];
		if (!source.targets.find(target => target.isStage).comments) delete stage.comments;
		const expected = new Set(["project.json", "SOURCE.txt", "SOURCE/project.json"]);
		const corrections = new Map();
		for (const [targetIndex, target] of source.targets.entries()) {
			assert.deepEqual(loaded.targets[targetIndex].blocks, target.blocks, `${original.id}: original program`);
			for (const [index, costume] of target.costumes.entries()) {
				const name = costume.md5ext || `${costume.assetId}.${costume.dataFormat}`;
				const correction = compatibility[name];
				if (!correction) continue;
				const current = loaded.targets[targetIndex].costumes[index];
				assert.equal(current.md5ext, correction.file);
				assert.equal(current.assetId, correction.file.split(".")[0]);
				assert.equal(createHash("md5").update(files[correction.file]).digest("hex"), current.assetId);
				assert.equal(createHash("sha256").update(files[correction.file]).digest("hex"), correction.sha256);
				assert.equal(createHash("sha256").update(files[name]).digest("hex"), correction.sourceSHA256);
				current.assetId = costume.assetId;
				if (costume.md5ext) current.md5ext = costume.md5ext;
				else delete current.md5ext;
				expected.add(correction.file);
				correctedAssets.add(correction.file);
				corrections.set(name, { original: name, ...correction });
			}
		}
		assert.deepEqual(loaded, source, `Only attribution and reviewed SVG references may change in ${original.id}`);
		if (corrections.size) {
			correctedProjects.add(original.id);
			expected.add("SOURCE/compatibility.json");
			assert.deepEqual(JSON.parse(strFromU8(files["SOURCE/compatibility.json"])), [...corrections.values()]);
			assert.ok(attribution.includes("SVG compatibility corrections"));
		}
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
	assert.equal(correctedAssets.size, 2);
	assert.equal(correctedProjects.size, 5);
	if (process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR) {
		await mkdir(process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR, { recursive: true });
		await writeFile(path.join(process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR, "archive-identity.json"), `${JSON.stringify({ projects: 164, assets: 505, originalSourceBytesRetained: true, originalProgramsUnchanged: true, onlyAttributionAndReviewedSvgCompatibility: true, compatibilityAssets: correctedAssets.size, compatibilityProjects: correctedProjects.size, records }, null, 2)}\n`);
	}
});

test("original Scratch source identifiers cannot select arbitrary files", async () => {
	for (const value of ["../../package", "214828609", "999999999999", "https://scratch.mit.edu/projects/287707460/"])
		await assert.rejects(createOriginalProject(value), /Unknown original Scratch project/);
});
