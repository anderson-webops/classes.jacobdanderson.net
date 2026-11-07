import assert from "node:assert/strict";
// eslint-disable-next-line test/no-import-node-test -- Native CI batch runner contracts.
import { it } from "node:test";
import { aggregateProofs, planBatches } from "../scripts/self-study-browser-batch-proof.mjs";

const sourceCommit = "a".repeat(40);
const ids = ["reading", "writing"];
const manifests = Object.fromEntries(ids.map(id => [id,	Object.fromEntries(["learner", "instructor"].map(role => [role, { modules: [{ id: "lesson", readings: [{}, {}] }], role }]))]));
const scope = { ids, manifests, sourceCommit, sourceMode: "build" };
function result(selectedCourseIds) {
	const profiles = selectedCourseIds.flatMap(id =>
		["learner", "instructor"].flatMap(role => [390, 1280].map(width =>
			({ id, role, width, sourceCommit, completeReadings: [{}, {}], pageErrors: [], writes: 0 }))));
	return { complete: true, sourceCommit, sourceMode: "build", selectedCourseIds, expectedProfiles: profiles.length, expectedReadingViews: profiles.length * 2, profiles };
}

it("batches retain all 23 courses in order with one browser run at a time", () => {
	const courses = Array.from({ length: 23 }, (_, index) => `course-${index}`);
	const batches = planBatches(courses);
	assert.equal(batches.length, 6);
	assert.ok(batches.every(batch => batch.length <= 4));
	assert.deepEqual(batches.flat(), courses);
	assert.throws(() => planBatches(["same", "same"]));
	assert.throws(() => planBatches([]));
	assert.throws(() => planBatches(courses, 0));
	assert.throws(() => planBatches(courses, 5));
});

it("aggregate becomes complete only after every course, role, width and reading passes", () => {
	const partial = aggregateProofs(scope, [result(["reading"])]);
	assert.equal(partial.complete, false);
	assert.equal(partial.expectedProfiles, 8);
	assert.equal(partial.expectedReadingViews, 16);
	const complete = aggregateProofs(scope, [result(["reading"]), result(["writing"])]);
	assert.equal(complete.complete, true);
	assert.equal(complete.profiles.length, 8);
	assert.equal(complete.profiles.reduce((n, p) => n + p.completeReadings.length, 0), 16);
});

it("reject duplicate, missing, failed or foreign results instead of accepting a partial review", () => {
	for (const mutate of [
		(p) => { p.complete = false; },
		(p) => { p.sourceCommit = "b".repeat(40); },
		(p) => { p.sourceMode = "dev"; },
		(p) => { p.profiles.pop(); },
		(p) => { p.profiles[0] = p.profiles[1]; },
		(p) => { p.profiles[0].sourceCommit = "b".repeat(40); },
		(p) => { p.profiles[0].pageErrors = ["render failed"]; },
		(p) => { p.profiles[0].writes = 1; },
		(p) => { p.profiles[0].completeReadings.pop(); },
		(p) => { p.profiles[0].role = "owner"; },
		(p) => { p.profiles[0].width = 800; },
		(p) => { p.expectedReadingViews -= 1; }
	]) {
		const broken = result(ids);
		mutate(broken);
		assert.throws(() => aggregateProofs(scope, [broken]));
	}
	assert.throws(() => aggregateProofs(scope, [result(["reading"]), result(["reading"])]));
	assert.throws(() => aggregateProofs(scope, [result(["other"])]));
});
