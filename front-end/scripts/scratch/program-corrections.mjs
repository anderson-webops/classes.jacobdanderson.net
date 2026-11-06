import { isDeepStrictEqual } from "node:util";
import corrections from "./originals/program-corrections.json" with { type: "json" };

/** Apply only the declared patch to its exact reviewed upstream input. */
export function applyOriginalProgramCorrection(project, original) {
	const correction = corrections.find(record => record.id === original.id);
	if (!correction) return undefined;
	if (correction.sourceSHA256 !== original.sourceSHA256)
		throw new Error("Scratch program correction source identity mismatch");
	const targets = project.targets.filter(
		target => target.name === correction.target
	);
	if (targets.length !== 1)
		throw new Error("Scratch program correction target mismatch");
	const { blocks } = targets[0];
	for (const change of correction.changes) {
		if (!isDeepStrictEqual(blocks[change.blockId] ?? null, change.before)) {
			throw new Error(
				`Scratch program correction input mismatch: ${change.blockId}`
			);
		}
	}
	for (const change of correction.changes)
		blocks[change.blockId] = structuredClone(change.after);
	return correction;
}
