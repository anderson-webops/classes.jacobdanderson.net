import { afterEach, expect, it } from "vitest";

const prefix = "browser-storage-environment-";
afterEach(() => {
	localStorage.removeItem(prefix + "local");
	sessionStorage.removeItem(prefix + "session");
});

it("uses the test browser's origin-scoped localStorage", () => {
	const browser = (
		globalThis as typeof globalThis & { jsdom: { window: Window } }
	).jsdom.window;
	expect(window.localStorage).toBe(browser.localStorage);
	localStorage.setItem(prefix + "local", "saved project");
	expect(window.localStorage.getItem(prefix + "local")).toBe("saved project");
	expect(localStorage.key(0)).toBe(prefix + "local");
});

it("keeps sessionStorage separate from local project storage", () => {
	const browser = (
		globalThis as typeof globalThis & { jsdom: { window: Window } }
	).jsdom.window;
	expect(window.sessionStorage).toBe(browser.sessionStorage);
	sessionStorage.setItem(prefix + "session", "session draft");
	expect(localStorage.getItem(prefix + "session")).toBeNull();
	expect(sessionStorage.getItem(prefix + "session")).toBe("session draft");
});
