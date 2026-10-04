import { webcrypto } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { retainNoteSendIntent } from "@/modules/sessionNoteSendIntent";

describe("durable composer request identity", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.stubGlobal("crypto", webcrypto);
		let tail = Promise.resolve();
		vi.stubGlobal("navigator", {
			locks: {
				request: (
					_name: string,
					_options: object,
					action: () => Promise<unknown>
				) => {
					const result = tail.then(action);
					tail = result.then(
						() => undefined,
						() => undefined
					);
					return result;
				}
			}
		});
	});
	afterEach(() => vi.unstubAllGlobals());
	it("reuses the same saved note and key after reloading the composer", async () => {
		const save = vi.fn().mockResolvedValue("507f1f77bcf86cd799439011");
		const signature = JSON.stringify({
			markdown: "Private synthetic notes",
			email: "guardian@example.test"
		});
		const first = await retainNoteSendIntent(signature, save);
		const retry = await retainNoteSendIntent(signature, save);
		expect(retry).toEqual(first);
		expect(save).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(localStorage)).not.toMatch(
			/Private synthetic|guardian@example/
		);
	});
	it("does not expose a send key if draft or local tracking persistence fails", async () => {
		await expect(
			retainNoteSendIntent("synthetic", async () => {
				throw new Error("database unavailable");
			})
		).rejects.toThrow("database unavailable");
		expect(localStorage.length).toBe(0);
		const storage = {
			getItem: () => null,
			setItem: () => {
				throw new Error("storage unavailable");
			}
		} as unknown as Storage;
		await expect(
			retainNoteSendIntent(
				"synthetic",
				async () => "507f1f77bcf86cd799439011",
				storage
			)
		).rejects.toThrow("storage unavailable");
	});
	it("refuses damaged or full tracking history instead of silently losing prior request identity", async () => {
		const save = vi.fn();
		const damaged = { getItem: () => "[]" } as unknown as Storage;
		await expect(
			retainNoteSendIntent("synthetic", save, damaged)
		).rejects.toThrow("requires review");
		const full = {
			getItem: () =>
				JSON.stringify(
					Object.fromEntries(
						Array.from({ length: 200 }, (_, i) => [String(i), {}])
					)
				)
		} as unknown as Storage;
		await expect(
			retainNoteSendIntent("synthetic", save, full)
		).rejects.toThrow("history is full");
		expect(save).not.toHaveBeenCalled();
	});
	it("serializes concurrent tab preparation and retains exactly one draft/key", async () => {
		const save = vi.fn().mockImplementation(async () => {
			await Promise.resolve();
			return "507f1f77bcf86cd799439011";
		});
		const results = await Promise.all([
			retainNoteSendIntent("same draft", save),
			retainNoteSendIntent("same draft", save)
		]);
		expect(results[0]).toEqual(results[1]);
		expect(save).toHaveBeenCalledTimes(1);
	});
	it("fails closed when cross-tab locking is unsupported", async () => {
		vi.stubGlobal("navigator", {});
		const save = vi.fn();
		await expect(retainNoteSendIntent("same draft", save)).rejects.toThrow(
			"cannot safely coordinate"
		);
		expect(save).not.toHaveBeenCalled();
	});
});
