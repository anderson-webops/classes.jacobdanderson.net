import { afterEach, describe, expect, it, vi } from "vitest";
import {
	sandboxFiles,
	sandboxFrameDocument,
	sandboxPointerRelease,
	sandboxRun,
	startPythonSandbox,
	unchangedRunFiles
} from "../src/modules/pythonSandbox";

const request = {
	mode: "python" as const,
	files: [
		{
			name: "main.py",
			content: "print('hello')",
			encoding: "text" as const
		}
	],
	activeFileName: "main.py",
	inputText: "learner\n:cancel"
};
const cleanups: (() => void)[] = [];
afterEach(() => {
	cleanups.splice(0).forEach(cleanup => cleanup());
	document.body.replaceChildren();
	vi.useRealTimers();
});

function setup(
	mode: "python" | "turtle" | "pgzero" | "data" = "python",
	host = document.createElement("div")
) {
	document.body.append(host);
	const callbacks = {
		isCurrent: vi.fn(() => true),
		onOutput: vi.fn(),
		onFiles: vi.fn(),
		onActivity: vi.fn(),
		onStage: vi.fn(),
		onPythonVersion: vi.fn()
	};
	const handle = startPythonSandbox(host, { ...request, mode }, callbacks);
	cleanups.push(handle.destroy);
	const frame = host.querySelector("iframe")!;
	const channel = /data-channel="([^"]+)"/.exec(frame.srcdoc)![1];
	const receive = (
		body: Record<string, unknown>,
		origin = "null",
		source: MessageEventSource | null = frame.contentWindow
	) => {
		window.dispatchEvent(
			new MessageEvent("message", {
				data: { channel, ...body },
				source,
				origin
			})
		);
	};
	return { handle, frame, receive, callbacks, host };
}

describe("isolated Python contract", () => {
	it.each(["python", "turtle", "pgzero", "data"] as const)(
		"replaces the %s runtime context and rejects results from its previous run",
		async mode => {
			const previous = setup(mode);
			const previousWindow = previous.frame.contentWindow;
			previous.receive({ type: "ready" });
			previous.handle.destroy();
			await previous.handle.done;
			const current = setup(mode, previous.host);
			current.receive({ type: "ready" });
			expect(current.frame.contentWindow === previousWindow).toBe(false);
			expect(current.frame.srcdoc).not.toBe(previous.frame.srcdoc);
			expect(current.host.querySelectorAll("iframe")).toHaveLength(1);
			expect(previous.frame.isConnected).toBe(false);
			previous.receive(
				{ type: "files", files: request.files },
				"null",
				previousWindow
			);
			current.receive(
				{ type: "files", files: request.files },
				"null",
				previousWindow
			);
			expect(previous.callbacks.onFiles).not.toHaveBeenCalled();
			expect(current.callbacks.onFiles).not.toHaveBeenCalled();
			current.receive({ type: "files", files: request.files });
			expect(current.callbacks.onFiles).toHaveBeenCalledExactlyOnceWith(
				request.files
			);
		}
	);
	it("forwards pointer releases only to the active drawing frame", () => {
		const { frame, handle, receive, callbacks } = setup("turtle");
		const post = vi.spyOn(frame.contentWindow!, "postMessage");
		const release = () =>
			window.dispatchEvent(
				new MouseEvent("mouseup", {
					button: 0,
					clientX: 20,
					clientY: 30
				})
			);
		release();
		expect(post).not.toHaveBeenCalled();
		receive({ type: "ready" });
		post.mockClear();
		release();
		expect(post).toHaveBeenCalledTimes(1);
		const message = post.mock.calls[0][0] as Record<string, unknown>;
		expect(
			sandboxPointerRelease(message, message.channel as string)
		).toEqual({ button: 0, clientX: 20, clientY: 30 });
		for (const change of [
			{ channel: "wrong" },
			{ button: -1 },
			{ clientX: Infinity },
			{ clientY: 100_001 },
			{ extra: true }
		]) {
			expect(
				sandboxPointerRelease(
					{ ...message, ...change },
					message.channel as string
				)
			).toBeNull();
		}
		callbacks.isCurrent.mockReturnValue(false);
		release();
		handle.destroy();
		release();
		expect(post).toHaveBeenCalledTimes(1);
	});
	it("accepts all four modes and rejects unsupported request fields", () => {
		for (const mode of ["python", "turtle", "pgzero", "data"])
			expect(sandboxRun({ ...request, mode })).not.toBeNull();
		expect(sandboxRun({ ...request, mode: "java" })).toBeNull();
		expect(sandboxRun({ ...request, token: "unused" })).toBeNull();
		expect(
			sandboxRun({ ...request, activeFileName: "absent.py" })
		).toBeNull();
		expect(
			sandboxRun({ ...request, inputText: "a".repeat(100_001) })
		).toBeNull();
	});
	it("bounds files and permits only project-relative supported paths", () => {
		for (const name of [
			"../main.py",
			"/main.py",
			"turtle.py",
			"main.html",
			"images/../main.py"
		]) {
			expect(sandboxFiles([{ name, content: "" }])).toBeNull();
		}
		expect(
			sandboxFiles([
				{ name: "nested/main.py", content: "print('module')" }
			])
		).not.toBeNull();
		expect(
			sandboxFiles([
				{ name: "a.py", content: "" },
				{ name: "A.py", content: "" }
			])
		).toBeNull();
		expect(
			sandboxFiles([{ name: "a.py", content: "a".repeat(3_000_001) }])
		).toBeNull();
		expect(
			sandboxFiles(
				Array.from({ length: 41 }, (_, index) => ({
					name: `file${index}.py`,
					content: ""
				}))
			)
		).toBeNull();
		expect(
			sandboxFiles([
				{ name: "images/logo.png", content: "YQ==", encoding: "base64" }
			])
		).not.toBeNull();
		expect(
			sandboxFiles(
				[
					{
						name: "images/logo.png",
						content: "YQ==",
						encoding: "base64"
					}
				],
				true
			)
		).toBeNull();
	});
	it("uses an opaque frame and confines its site access to public assets", () => {
		const { frame } = setup();
		expect(frame.getAttribute("sandbox")).toBe("allow-scripts");
		expect(frame.srcdoc).not.toContain("allow-same-origin");
		expect(frame.srcdoc).not.toContain("print('hello')");
		expect(frame.srcdoc).toContain("form-action 'none'");
		expect(frame.srcdoc).toContain("worker-src blob:");
		expect(frame.srcdoc).not.toContain("/api");
		expect(() =>
			sandboxFrameDocument("file:///tmp", "a".repeat(30))
		).toThrow();
	});
	it("binds messages to the exact frame, opaque origin, channel and active run", async () => {
		const { frame, receive, callbacks, handle } = setup();
		const post = vi.spyOn(frame.contentWindow!, "postMessage");
		receive({ type: "ready" }, window.location.origin);
		receive({ type: "ready" }, "null", window);
		receive({ type: "ready", channel: "different" });
		expect(post).not.toHaveBeenCalled();
		receive({ type: "ready" });
		receive({ type: "ready" });
		expect(post).toHaveBeenCalledTimes(1);
		receive({ type: "output", kind: "stdout", text: "hello" });
		expect(callbacks.onOutput).toHaveBeenCalledWith("stdout", "hello");
		callbacks.isCurrent.mockReturnValue(false);
		receive({ type: "files", files: request.files });
		expect(callbacks.onFiles).not.toHaveBeenCalled();
		handle.destroy();
		await handle.done;
		expect(frame.isConnected).toBe(false);
	});
	it("accepts bounded results once and revokes callbacks on stop", async () => {
		const { receive, callbacks, handle } = setup();
		receive({ type: "ready" });
		receive({ type: "output", kind: "stdout", text: "a".repeat(16_001) });
		receive({
			type: "files",
			files: [{ name: "../outside.txt", content: "" }]
		});
		expect(callbacks.onOutput).not.toHaveBeenCalled();
		expect(callbacks.onFiles).not.toHaveBeenCalled();
		receive({ type: "files", files: request.files });
		receive({ type: "files", files: request.files });
		expect(callbacks.onFiles).toHaveBeenCalledTimes(1);
		receive({ type: "done" });
		await handle.done;
		receive({ type: "activity", active: true });
		expect(callbacks.onActivity).toHaveBeenLastCalledWith(true);
		handle.destroy();
		receive({ type: "output", kind: "stdout", text: "late" });
		expect(callbacks.onOutput).not.toHaveBeenCalled();
		expect(callbacks.onActivity).toHaveBeenLastCalledWith(false);
	});
	it("fails startup within its deadline", async () => {
		vi.useFakeTimers();
		const { handle, frame } = setup();
		const rejected = expect(handle.done).rejects.toThrow("did not start");
		vi.advanceTimersByTime(30_000);
		await rejected;
		expect(frame.isConnected).toBe(false);
	});
	it("relays only bounded runtime diagnostics from the current frame", () => {
		const { receive, callbacks } = setup();
		receive({ type: "stage", stage: "executing" });
		expect(callbacks.onStage).not.toHaveBeenCalled();
		receive({ type: "ready" });
		receive({ type: "stage", stage: "executing" });
		receive({ type: "version", version: "3.14.0" });
		expect(callbacks.onStage).toHaveBeenCalledExactlyOnceWith("executing");
		expect(callbacks.onPythonVersion).toHaveBeenCalledExactlyOnceWith(
			"3.14.0"
		);
		receive({ type: "stage", stage: "importing" });
		receive({ type: "stage", stage: "executing", extra: "ignored" });
		receive({
			type: "version",
			version: "runtime details are not allowed"
		});
		callbacks.isCurrent.mockReturnValue(false);
		receive({ type: "version", version: "3.14.1" });
		expect(callbacks.onStage).toHaveBeenCalledTimes(1);
		expect(callbacks.onPythonVersion).toHaveBeenCalledTimes(1);
	});
	it("does not overwrite edits made while a run was in progress", () => {
		const project = { _id: "local", title: "Synthetic", ...request };
		expect(unchangedRunFiles(project, request.files)).toBe(true);
		expect(
			unchangedRunFiles(
				{
					...project,
					files: [{ ...request.files[0], content: "print('edited')" }]
				},
				request.files
			)
		).toBe(false);
	});
});
