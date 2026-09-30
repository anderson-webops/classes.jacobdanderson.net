import type {
	JavaIdeRunOptions,
	JavaIdeRunResult
} from "@/modules/javaIdeRuntime";

export const JAVA_PREVIEW_TIMEOUT_MS = 5000;

export function startJavaPreview(options: JavaIdeRunOptions) {
	let worker: Worker | null = null;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let settled = false;
	let complete!: (result: JavaIdeRunResult) => void;
	const done = new Promise<JavaIdeRunResult>(resolve => {
		complete = resolve;
	});
	function finish(result: JavaIdeRunResult) {
		if (settled) return;
		settled = true;
		clearTimeout(timer);
		if (worker) {
			worker.onmessage = null;
			worker.onerror = null;
			worker.onmessageerror = null;
			worker.terminate();
			worker = null;
		}
		complete(result);
	}
	function fail(message: string) {
		finish({ stdout: [], stderr: [message] });
	}
	try {
		if (
			options.files.length > 128 ||
			(options.inputText?.length ?? 0) > 200000
		) {
			throw new Error("Project exceeds preview limits.");
		}
		let characters = 0;
		const files = options.files
			.filter(file => file.encoding !== "base64")
			.map(file => {
				characters += file.content.length;
				if (
					file.name.length > 256 ||
					file.content.length > 200000 ||
					characters > 1000000
				) {
					throw new Error("Project exceeds preview limits.");
				}
				return { name: file.name, content: file.content };
			});
		worker = new Worker(new URL("./javaIde.worker.ts", import.meta.url), {
			type: "module"
		});
		worker.onmessage = (event: MessageEvent<JavaIdeRunResult>) =>
			finish(event.data);
		worker.onerror = event => {
			event.preventDefault();
			fail(
				"Java/Karel preview failed safely. Check the program or use a desktop IDE."
			);
		};
		worker.onmessageerror = () =>
			fail("Java/Karel preview returned an unreadable result.");
		timer = setTimeout(
			fail,
			JAVA_PREVIEW_TIMEOUT_MS,
			"Java/Karel preview stopped at its time limit. Run larger programs in a desktop IDE."
		);
		worker.postMessage({
			activeFileName: options.activeFileName,
			mode: options.mode,
			inputText: options.inputText ?? "",
			files
		});
	} catch {
		fail(
			"Java/Karel preview could not start. Check project size and browser worker support."
		);
	}
	return { done, stop: () => fail("Java/Karel preview stopped.") };
}
