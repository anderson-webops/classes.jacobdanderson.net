import { isDeepStrictEqual } from "node:util";
import corrections from "./originals/program-corrections.json" with { type: "json" };

/** Validate every before-image before applying a reviewed original-source patch. */
export function applyOriginalProgramCorrection(project, original) {
	const correction = corrections.find(record => record.id === original.id);
	if (!correction) return undefined;
	if (correction.sourceSHA256 !== original.sourceSHA256)
		throw new Error("Scratch program correction source identity mismatch");
	const patches = [correction, ...(correction.additionalTargets || [])];
	if (new Set(patches.map(patch => patch.target)).size !== patches.length)
		throw new Error("Scratch program correction repeats a target");
	const prepared = patches.map(patch => {
		const targets = project.targets.filter(
			target => target.name === patch.target
		);
		if (targets.length !== 1)
			throw new Error("Scratch program correction target mismatch");
		const target = targets[0];
		const edits = [
			...patch.changes.map(change => ({
				table: target.blocks,
				key: change.blockId,
				...change
			})),
			...(patch.variables || []).map(change => ({
				table: target.variables,
				key: change.variableId,
				...change
			}))
		];
		for (const edit of edits) {
			if (!isDeepStrictEqual(edit.table[edit.key] ?? null, edit.before))
				throw new Error(
					"Scratch program correction input mismatch: " + edit.key
				);
		}
		return edits;
	});
	for (const edits of prepared) {
		for (const edit of edits) {
			if (edit.after === null) delete edit.table[edit.key];
			else edit.table[edit.key] = structuredClone(edit.after);
		}
	}
	return correction;
}
