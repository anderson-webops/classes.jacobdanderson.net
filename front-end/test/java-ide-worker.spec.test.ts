import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JAVA_PREVIEW_TIMEOUT_MS, startJavaPreview } from "../src/modules/javaIdeWorker";

class PreviewWorker {
	static instances: PreviewWorker[] = [];
	onmessage: ((event: MessageEvent) => void) | null = null;
	onerror: ((event: ErrorEvent) => void) | null = null;
	onmessageerror: (() => void) | null = null;
	postMessage = vi.fn();
	terminate = vi.fn();
	constructor(public url: URL, public options: WorkerOptions) { PreviewWorker.instances.push(this); }
}
const project = { activeFileName: "Main.java", mode: "java" as const, files: [{ name: "Main.java", content: "class Main {}" }, { name: "world.txt", content: "rows=5" }] };
beforeEach(() => { vi.useFakeTimers(); PreviewWorker.instances = []; vi.stubGlobal("Worker", PreviewWorker); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("terminable Java preview", () => {
	it("runs the module worker and preserves world files", async () => {
		const preview = startJavaPreview(project);
		const worker = PreviewWorker.instances[0]!;
		expect(worker.options).toEqual({ type: "module" });
		expect(worker.url.pathname).toContain("javaIde.worker.ts");
		expect(worker.postMessage.mock.calls[0]![0].files).toEqual(project.files);
		worker.onmessage?.({ data: { stdout: ["42"], stderr: [] } } as MessageEvent);
		expect(await preview.done).toEqual({ stdout: ["42"], stderr: [] });
		expect(worker.terminate).toHaveBeenCalledTimes(1);
		expect(vi.getTimerCount()).toBe(0);
	});
	it("terminates an unresponsive worker from an external deadline", async () => {
		const preview = startJavaPreview(project);
		vi.advanceTimersByTime(JAVA_PREVIEW_TIMEOUT_MS);
		expect((await preview.done).stderr.join(" ")).toContain("time limit");
		expect(PreviewWorker.instances[0]!.terminate).toHaveBeenCalledTimes(1);
	});
	it("cancels promptly and ignores queued stale results", async () => {
		const preview = startJavaPreview(project);
		const worker = PreviewWorker.instances[0]!;
		const lateMessage = worker.onmessage;
		preview.stop(); preview.stop();
		lateMessage?.({ data: { stdout: ["stale private result"], stderr: [] } } as MessageEvent);
		expect((await preview.done).stdout).toEqual([]);
		expect(worker.terminate).toHaveBeenCalledTimes(1);
		expect(worker.onmessage).toBeNull();
		expect(vi.getTimerCount()).toBe(0);
	});
	it("cleans up worker errors without echoing source", async () => {
		const preview = startJavaPreview(project);
		PreviewWorker.instances[0]!.onerror?.({ preventDefault() {}, message: "private source" } as ErrorEvent);
		expect((await preview.done).stderr.join(" ")).not.toContain("private source");
		expect(PreviewWorker.instances[0]!.terminate).toHaveBeenCalledTimes(1);
	});
	it("rejects oversized messages before cloning or starting a worker", async () => {
		const preview = startJavaPreview({ ...project, files: [{ name: "Main.java", content: "x".repeat(200001) }] });
		expect((await preview.done).stderr.length).toBe(1);
		expect(PreviewWorker.instances).toHaveLength(0);
	});
});
