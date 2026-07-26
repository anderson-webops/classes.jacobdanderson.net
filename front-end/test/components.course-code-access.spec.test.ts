import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CourseCodeAccessForm from "@/components/CourseCodeAccessForm.vue";
import { useAppStore } from "@/stores/app";

describe("CourseCodeAccessForm.vue", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("opens a pseudonymous course workspace with a code and username", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		const learner = {
			_id: "course-learner-1",
			username: "Student One",
			courseID: "python-level-1",
			courseAccess: ["python-level-1"],
			courseStatus: { "python-level-1": "current" as const },
			role: "course-code" as const,
			codeLabel: "Period 2",
			createdAt: "2026-07-25T12:00:00.000Z",
			lastSeenAt: "2026-07-25T12:00:00.000Z"
		};
		const redeem = vi
			.spyOn(app, "redeemCourseAccessCode")
			.mockResolvedValue(learner);
		const wrapper = mount(CourseCodeAccessForm, {
			global: { plugins: [pinia] }
		});
		const inputs = wrapper.findAll("input");

		await inputs[0].setValue("2345-6789-ABCD");
		await inputs[1].setValue("Student One");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(redeem).toHaveBeenCalledWith(
			"2345-6789-ABCD",
			"Student One"
		);
		expect(wrapper.text()).toContain("Opened Period 2 as Student One.");
		expect(wrapper.text()).toContain("without providing an email address");
	});
});
