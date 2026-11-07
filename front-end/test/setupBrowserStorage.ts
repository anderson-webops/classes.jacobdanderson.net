// Bind Web Storage to the test browser. Node 26 also exposes these names,
// which Vitest otherwise leaves pointing at Node's unconfigured storage.
const browser = (
	globalThis as typeof globalThis & { jsdom?: { window: Window } }
).jsdom?.window;

if (browser && browser !== globalThis) {
	for (const key of ["localStorage", "sessionStorage"] as const) {
		Object.defineProperty(globalThis, key, {
			configurable: true,
			enumerable: true,
			get: () => browser[key]
		});
	}
}
