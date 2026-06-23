interface ScratchFluencyDrillOptions {
	project: string;
	focus: string;
	restartCheck: string;
}

interface ScratchOpenEndedVariantOptions {
	project: string;
	coreIdea: string;
	variation: string;
	evidence: string;
}

export function buildScratchFluencyDrill({
	project,
	focus,
	restartCheck
}: ScratchFluencyDrillOptions) {
	return `**Fluency goal:** Rebuild the central ${project} behavior in a smaller Scratch scene so the core idea can be tested quickly.

**Practice path:** Focus on ${focus}. Keep the sprite count low, name the variables or broadcasts clearly, and make each script visibly affect the stage.

**Completion check:** Run the mini-project twice from the green flag. ${restartCheck} Record one sentence naming the Scratch block or variable most responsible for the result.`;
}

export function buildScratchOpenEndedVariant({
	project,
	coreIdea,
	variation,
	evidence
}: ScratchOpenEndedVariantOptions) {
	return `**Variant goal:** Build a new ${project} variation that changes ${variation} while preserving ${coreIdea}.

**Design path:** Start from a working version, then change one rule deliberately. Name the trigger, the state being tracked, and the feedback that proves the rule worked.

**Verification:** Test the normal path, one boundary case, and a fresh green-flag restart. ${evidence}`;
}
