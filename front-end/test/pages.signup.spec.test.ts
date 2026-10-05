import { mount, type VueWrapper } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { isDark } from "@/composables/dark";
import {
	buildSchedulerEmbedUrl,
	SCHEDULER_ORIGIN,
	schedulerEmbedMessageSource,
	schedulerEmbedResizeType,
	schedulerEmbedThemeMessageSource,
	schedulerEmbedThemeType,
	schedulerUrl
} from "@/modules/scheduler";
import SignupPage from "@/pages/signup.vue";

describe("booking inside Classes", () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		vi.useFakeTimers();
		isDark.value = false;
		wrapper = mount(SignupPage, {
			attachTo: document.body,
			global: { plugins: [createPinia(), createHead()] }
		});
	});

	afterEach(() => {
		wrapper.unmount();
		vi.restoreAllMocks();
		vi.useRealTimers();
		isDark.value = false;
	});

	function sendResize(
		height: unknown,
		origin = SCHEDULER_ORIGIN,
		source = wrapper.get("iframe").element.contentWindow,
		extra = {}
	) {
		window.dispatchEvent(
			new MessageEvent("message", {
				origin,
				source,
				data: {
					source: schedulerEmbedMessageSource,
					type: schedulerEmbedResizeType,
					height,
					...extra
				}
			})
		);
	}

	it("embeds the scheduler without granting top-level navigation", () => {
		const frame = wrapper.get("iframe");
		expect(frame.attributes("src")).toBe(buildSchedulerEmbedUrl("light"));
		expect(frame.attributes("title")).toBe("Class scheduler");
		expect(frame.attributes("sandbox")).not.toContain("top-navigation");
		expect(wrapper.get("h1").text()).toBe("Schedule a class");
	});

	it("follows trusted content heights with bounded minimum and maximum", async () => {
		for (const [height, expected] of [
			[1300.2, 1301],
			[10, 760],
			[9000, 5000]
		]) {
			sendResize(height);
			await nextTick();
			expect(wrapper.get("iframe").attributes("style")).toContain(
				`height: ${expected}px`
			);
		}
	});

	it("rejects wrong origins, windows, message types and invalid heights", async () => {
		sendResize(1300, "https://example.invalid");
		sendResize(1400, SCHEDULER_ORIGIN, window);
		sendResize(1500, SCHEDULER_ORIGIN, null);
		sendResize(1600, SCHEDULER_ORIGIN, undefined, { type: "other" });
		for (const height of ["1700", NaN, Infinity, -1, 0]) sendResize(height);
		await nextTick();
		expect(wrapper.get("iframe").attributes("style")).toContain(
			"height: 760px"
		);
	});

	it("never navigates to a URL supplied by a resize message", async () => {
		sendResize(1300, SCHEDULER_ORIGIN, undefined, {
			customerPortalUrl: "https://example.invalid/"
		});
		await nextTick();
		expect(wrapper.get("iframe").attributes("src")).toBe(
			buildSchedulerEmbedUrl("light")
		);
		await wrapper.get("button").trigger("click");
		expect(wrapper.get("iframe").attributes("src")).toBe(
			buildSchedulerEmbedUrl("light", "/portal")
		);
	});

	it("recognizes a ready iframe even if its load event preceded hydration", async () => {
		sendResize(1300);
		vi.advanceTimersByTime(8000);
		await nextTick();
		expect(wrapper.find('[role="alert"]').exists()).toBe(false);
		expect(wrapper.find('[role="status"]').exists()).toBe(false);
	});

	it("updates the child theme without reloading a booking", async () => {
		const frame = wrapper.get("iframe");
		const src = frame.attributes("src");
		const post = vi.spyOn(frame.element.contentWindow!, "postMessage");
		await frame.trigger("load");
		post.mockClear();
		isDark.value = true;
		await nextTick();
		expect(post).toHaveBeenCalledExactlyOnceWith(
			{
				source: schedulerEmbedThemeMessageSource,
				type: schedulerEmbedThemeType,
				theme: "dark"
			},
			SCHEDULER_ORIGIN
		);
		expect(frame.attributes("src")).toBe(src);
	});

	it("keeps booking management in the same view with a return to the calendar", async () => {
		await wrapper.get("button").trigger("click");
		expect(wrapper.get("h1").text()).toBe("Manage bookings");
		expect(wrapper.get("button").text()).toBe("Back to calendar");
		expect(wrapper.get("iframe").attributes("src")).toBe(
			buildSchedulerEmbedUrl("light", "/portal")
		);
		await wrapper.get("button").trigger("click");
		expect(wrapper.get("h1").text()).toBe("Schedule a class");
		expect(wrapper.get("iframe").attributes("src")).toBe(
			buildSchedulerEmbedUrl("light")
		);
	});

	it("offers an explicit fallback when loading stalls and clears it on load", async () => {
		vi.advanceTimersByTime(8000);
		await nextTick();
		const fallback = wrapper.get('[role="alert"] a');
		expect(fallback.attributes("href")).toBe(schedulerUrl);
		expect(fallback.attributes("target")).toBe("_blank");
		await wrapper.get("iframe").trigger("load");
		expect(wrapper.find('[role="alert"]').exists()).toBe(false);
		expect(wrapper.find('[role="status"]').exists()).toBe(false);
	});

	it("removes its message listener and loading timer when navigating away", () => {
		const remove = vi.spyOn(window, "removeEventListener");
		const clear = vi.spyOn(window, "clearTimeout");
		wrapper.unmount();
		expect(remove).toHaveBeenCalledWith("message", expect.any(Function));
		expect(clear).toHaveBeenCalled();
	});
});
