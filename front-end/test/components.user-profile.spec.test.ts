import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import UserProfile from "@/components/UserProfile.vue";
import { useAppStore } from "@/stores/app";

describe("student account", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		useAppStore().setCurrentUser({
			_id: "learner-1",
			name: "Learner",
			email: "learner@example.invalid",
			age: 12,
			state: "GA",
			courseAccess: ["python-level-1"],
			tutors: [{ _id: "tutor-1", name: "Instructor" } as any],
			editUsers: false,
			saveEdit: "Save"
		});
	});
	function render() {
		return mount(UserProfile, {
			global: {
				stubs: {
					SelfAccountSettings: {
						template: "<section>Account settings form</section>"
					},
					UserCommunicationPanel: {
						template:
							"<section class=\"history\">Private class history</section>"
					}
				}
			}
		});
	}
	it("defaults to profile settings without duplicate course lists or eagerly loaded history", () => {
		const wrapper = render();
		expect(wrapper.text()).toContain("Account settings form");
		expect(wrapper.text()).not.toMatch(
			/Courses and tutors|Current:|Past:|Other available:/
		);
		expect(wrapper.find(".history").exists()).toBe(false);
		wrapper.unmount();
	});
	it("opens private class history without losing the mounted profile form", async () => {
		const wrapper = render();
		await wrapper.get("input[value=\"history\"]").setValue();
		expect(wrapper.text()).toContain("Private class history");
		expect(wrapper.text()).toContain("Instructor: Instructor");
		await wrapper.get("input[value=\"profile\"]").setValue();
		expect(wrapper.find(".history").isVisible()).toBe(false);
		wrapper.unmount();
	});
});
