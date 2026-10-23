import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import HistoricalCourseProgress from "@/components/HistoricalCourseProgress.vue";

const course = {
	id: "pre-algebra-b",
	name: "Pre-Algebra B",
	modules: []
};

describe("HistoricalCourseProgress", () => {
	it("shows exact saved identities without assigning them to current lessons", async () => {
		const oldId = "pre-algebra-b-retired-checkpoint";
		const wrapper = mount(HistoricalCourseProgress, {
			props: {
				course,
				progress: {
					courseId: course.id,
					completedModuleIds: [],
					completedItemIds: [oldId]
				}
			}
		});

		expect(wrapper.text()).toContain("Earlier completions (1)");
		expect(wrapper.find("code").text()).toBe(oldId);
		expect(wrapper.find("button").exists()).toBe(false);
		await wrapper.setProps({ editable: true });
		await wrapper.find("button").trigger("click");
		expect(wrapper.emitted("remove")?.[0]).toEqual([
			{ id: oldId, kind: "item" }
		]);
	});

	it("limits rendered history until requested", async () => {
		const wrapper = mount(HistoricalCourseProgress, {
			props: {
				course,
				progress: {
					courseId: course.id,
					completedModuleIds: [],
					completedItemIds: Array.from(
						{ length: 51 },
						(_, index) => `pre-algebra-b-retired-${index}`
					)
				}
			}
		});

		expect(wrapper.findAll("li")).toHaveLength(50);
		await wrapper.find("button").trigger("click");
		expect(wrapper.findAll("li")).toHaveLength(51);
	});
});
