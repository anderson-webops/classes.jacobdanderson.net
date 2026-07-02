import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AboutPage from "@/pages/about.vue";

describe("AboutPage", () => {
	it("ends with a link to course pathways", () => {
		const wrapper = mount(AboutPage, {
			global: {
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});

		const actions = wrapper.get('[aria-label="About page actions"]');
		const text = actions.text();
		const pathwayLink = actions.get('a[href="/pathways"]');

		expect(pathwayLink.text()).toBe("View Course Pathways");
		expect(text.indexOf("View LinkedIn")).toBeLessThan(
			text.indexOf("View Course Pathways")
		);
	});
});
