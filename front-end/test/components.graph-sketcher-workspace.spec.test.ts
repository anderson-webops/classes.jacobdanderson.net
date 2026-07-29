import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GraphSketcherWorkspace from "@/components/GraphSketcherWorkspace.vue";
import { GRAPH_SKETCHER_STORAGE_KEY } from "@/modules/graphSketcher";

function installLocalStorageStub() {
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			clear: () => values.clear(),
			getItem: (key: string) => values.get(key) ?? null,
			removeItem: (key: string) => values.delete(key),
			setItem: (key: string, value: string) => values.set(key, value)
		}
	});
}

function buttonWithText(wrapper: ReturnType<typeof mount>, label: string) {
	const button = wrapper
		.findAll("button")
		.find(candidate => candidate.text().trim() === label);
	expect(button, `Expected a "${label}" button`).toBeDefined();
	return button!;
}

function setCanvasBounds(canvas: Element) {
	Object.defineProperty(canvas, "getBoundingClientRect", {
		configurable: true,
		value: () => ({
			bottom: 600,
			height: 600,
			left: 0,
			right: 900,
			top: 0,
			width: 900,
			x: 0,
			y: 0,
			toJSON: () => ({})
		})
	});
}

describe("GraphSketcherWorkspace.vue", () => {
	beforeEach(() => {
		installLocalStorageStub();
		window.localStorage.clear();
	});

	it("renders a complete client-side graphing workspace", async () => {
		const wrapper = mount(GraphSketcherWorkspace);

		expect(wrapper.get("h1").text()).toBe("Graph Sketcher");
		expect(wrapper.get("svg[role='img']").attributes("tabindex")).toBe("0");
		expect(wrapper.text()).toContain("Open / import");
		expect(wrapper.text()).toContain("Download project");
		expect(wrapper.text()).toContain("Plot a function");

		await buttonWithText(wrapper, "Style").trigger("click");
		expect(wrapper.text()).toContain("Add linear best fit");

		await buttonWithText(wrapper, "Graph").trigger("click");
		expect(wrapper.text()).toContain("Original source");
		expect(wrapper.text()).toContain("Linux desktop port");
	});

	it("plots equations and keeps keyboard scrolling inside the canvas", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		const equation = wrapper
			.findAll("input")
			.find(input => input.attributes("placeholder") === "sin(x) + 0.5x");
		expect(equation).toBeDefined();
		await equation.setValue("x^2 - 4");
		await buttonWithText(wrapper, "Plot function").trigger("click");

		expect(wrapper.text()).toContain("y = x^2 - 4");
		expect(wrapper.text()).toContain("Plotted y = x^2 - 4");

		const canvas = wrapper.get("svg[role='img']");
		const event = new KeyboardEvent("keydown", {
			key: "ArrowDown",
			cancelable: true
		});
		canvas.element.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});

	it("keeps wheel zoom and drag gestures inside the canvas surface", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		const canvas = wrapper.get("svg[role='img']");
		setCanvasBounds(canvas.element);

		const parentWheel = vi.fn();
		const parentPointerDown = vi.fn();
		const parentPointerMove = vi.fn();
		wrapper.element.addEventListener("wheel", parentWheel);
		wrapper.element.addEventListener("pointerdown", parentPointerDown);
		wrapper.element.addEventListener("pointermove", parentPointerMove);

		const wheel = new WheelEvent("wheel", {
			bubbles: true,
			cancelable: true,
			clientX: 450,
			clientY: 300,
			deltaY: -100
		});
		canvas.element.dispatchEvent(wheel);
		await wrapper.vm.$nextTick();

		expect(wheel.defaultPrevented).toBe(true);
		expect(parentWheel).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain("Zoomed in.");

		const shellWheel = new WheelEvent("wheel", {
			bubbles: true,
			cancelable: true,
			clientX: 5,
			clientY: 5,
			deltaY: 100
		});
		wrapper.get(".graph-canvas-shell").element.dispatchEvent(shellWheel);
		expect(shellWheel.defaultPrevented).toBe(true);
		expect(parentWheel).not.toHaveBeenCalled();

		const panButton = wrapper
			.findAll("button")
			.find(candidate => candidate.text().includes("Pan"));
		expect(panButton).toBeDefined();
		await panButton!.trigger("click");
		Object.defineProperties(canvas.element, {
			hasPointerCapture: {
				configurable: true,
				value: () => false
			},
			setPointerCapture: {
				configurable: true,
				value: vi.fn()
			}
		});
		const pointerDown = new MouseEvent("pointerdown", {
			bubbles: true,
			cancelable: true,
			clientX: 450,
			clientY: 300
		});
		canvas.element.dispatchEvent(pointerDown);

		expect(pointerDown.defaultPrevented).toBe(true);
		expect(parentPointerDown).not.toHaveBeenCalled();

		const pointerMove = new MouseEvent("pointermove", {
			bubbles: true,
			cancelable: true,
			clientX: 500,
			clientY: 325
		});
		canvas.element.dispatchEvent(pointerMove);

		expect(pointerMove.defaultPrevented).toBe(true);
		expect(parentPointerMove).not.toHaveBeenCalled();
	});

	it("creates an editable point series when a generated curve is active", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Plot function").trigger("click");
		const pointButton = wrapper
			.findAll("button")
			.find(candidate => candidate.text().includes("Point"));
		expect(pointButton).toBeDefined();
		await pointButton!.trigger("click");

		const canvas = wrapper.get("svg[role='img']");
		setCanvasBounds(canvas.element);
		canvas.element.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 450,
				clientY: 300
			})
		);
		await wrapper.vm.$nextTick();

		expect(canvas.attributes("aria-label")).toContain(
			"4 series and 654 points"
		);
		expect(wrapper.text()).toContain("Added a point to Points 4.");
		expect(wrapper.text()).toContain("Editable points for Points 4");
	});

	it("keeps generated curves read-only and duplicates editable snapshots", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Plot function").trigger("click");
		await buttonWithText(wrapper, "Data").trigger("click");

		expect(wrapper.text()).toContain("Generated points are read-only.");
		expect(wrapper.find(".graph-data-table").exists()).toBe(false);

		await buttonWithText(wrapper, "Duplicate").trigger("click");

		expect(wrapper.find(".graph-data-table").exists()).toBe(true);
		expect(wrapper.text()).toContain("Editable points for y = sin(x) copy");
	});

	it("restores locally autosaved graph projects", async () => {
		window.localStorage.setItem(
			GRAPH_SKETCHER_STORAGE_KEY,
			JSON.stringify({
				schemaVersion: 1,
				title: "My saved graph",
				series: [],
				annotations: []
			})
		);

		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain("My saved graph");
		expect(wrapper.text()).toContain(
			"Restored the graph saved in this browser."
		);
	});
});
