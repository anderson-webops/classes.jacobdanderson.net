import type { KarelWorldState } from "@/modules/javaIdeRuntime";

type KarelWorldPlaybackTimer = ReturnType<typeof globalThis.setTimeout>;

export interface KarelWorldPlaybackScheduler {
	clearTimeout: (timer: KarelWorldPlaybackTimer) => void;
	setTimeout: (
		callback: () => void,
		delayMs: number
	) => KarelWorldPlaybackTimer;
}

interface KarelWorldPlaybackControllerOptions {
	delayMs: number;
	scheduler?: KarelWorldPlaybackScheduler;
	showStep: (step: KarelWorldState) => void;
}

export function createKarelWorldPlaybackController({
	delayMs,
	scheduler = {
		clearTimeout: timer => globalThis.clearTimeout(timer),
		setTimeout: (callback, timeoutMs) =>
			globalThis.setTimeout(callback, timeoutMs)
	},
	showStep
}: KarelWorldPlaybackControllerOptions) {
	let timer: KarelWorldPlaybackTimer | null = null;
	let resolvePlayback: ((completed: boolean) => void) | null = null;

	function clear() {
		if (timer !== null) scheduler.clearTimeout(timer);
		timer = null;
		if (!resolvePlayback) return;
		resolvePlayback(false);
		resolvePlayback = null;
	}

	function play(
		steps: KarelWorldState[] | undefined,
		shouldContinue: () => boolean
	) {
		clear();
		if (!steps?.length) return Promise.resolve(false);

		return new Promise<boolean>(resolve => {
			let index = 0;
			const finish = (completed: boolean) => {
				if (timer !== null) scheduler.clearTimeout(timer);
				timer = null;
				resolvePlayback = null;
				resolve(completed);
			};
			resolvePlayback = finish;

			const showNextStep = () => {
				if (!shouldContinue()) {
					finish(false);
					return;
				}

				const step = steps[index];
				if (!step) {
					finish(true);
					return;
				}

				showStep(step);
				index += 1;
				if (index >= steps.length) {
					finish(true);
					return;
				}

				timer = scheduler.setTimeout(showNextStep, delayMs);
			};

			showNextStep();
		});
	}

	return {
		clear,
		play
	};
}
