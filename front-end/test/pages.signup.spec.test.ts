import { mount } from "@vue/test-utils";
import { createHead } from "@unhead/vue/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	openSchedulerPage,
	schedulerPortalUrl,
	schedulerUrl
} from "@/modules/scheduler";
import SignupPage from "@/pages/signup.vue";

vi.mock("@/modules/scheduler", async importOriginal => ({
	...(await importOriginal<typeof import("@/modules/scheduler")>()),
	openSchedulerPage: vi.fn()
}));

describe("full-page scheduler handoff", () => {
	afterEach(() => vi.resetAllMocks());

	it("opens booking without an embedded calendar or a new tab", () => {
		const wrapper = mount(SignupPage, {
			global: { plugins: [createHead()] }
		});
		expect(openSchedulerPage).toHaveBeenCalledExactlyOnceWith();
		expect(wrapper.find("iframe").exists()).toBe(false);
		expect(wrapper.get("a.site-button").attributes("href")).toBe(
			schedulerUrl
		);
		expect(
			wrapper.get("a.site-button").attributes("target")
		).toBeUndefined();
		expect(wrapper.get("a.text-link").attributes("href")).toBe(
			schedulerPortalUrl
		);
		wrapper.unmount();
	});

	it("keeps working direct links if automatic navigation is blocked", () => {
		vi.mocked(openSchedulerPage).mockImplementation(() => {
			throw new Error("Navigation blocked");
		});
		const wrapper = mount(SignupPage, {
			global: { plugins: [createHead()] }
		});
		expect(wrapper.get('[role="status"]').text()).toContain(
			"use the link below"
		);
		expect(wrapper.get("a.site-button").attributes("href")).toBe(
			schedulerUrl
		);
		expect(wrapper.get("a.text-link").attributes("href")).toBe(
			schedulerPortalUrl
		);
		wrapper.unmount();
	});
});
