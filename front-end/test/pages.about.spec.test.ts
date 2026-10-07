import { mount } from "@vue/test-utils";
import { createHead } from "@unhead/vue/server";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import AboutPage from "@/pages/about.vue";
import { useContentStore } from "@/stores/content";

describe("AboutPage", () => {
	it("keeps a concise introduction, one FAQ section and course pathways", () => {
		const pinia = createPinia();
		const wrapper = mount(AboutPage, {
			global: {
				plugins: [pinia, createHead()],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});

		const actions = wrapper.get('[aria-label="About page actions"]');
		const pathwayLink = actions.get('a[href="/pathways"]');

		expect(pathwayLink.text()).toBe("View Course Pathways");
		expect(wrapper.get(".copy p").text().split(/\s+/).length).toBeLessThan(
			50
		);
		const questions = wrapper.findAll(".about-faq summary");
		expect(questions.map(question => question.text())).toEqual(
			useContentStore(pinia).faqs.map(faq => faq.question)
		);
		expect(wrapper.findAll(".about-faq details[open]")).toHaveLength(0);
		expect(wrapper.find('a[href="/payment"]').exists()).toBe(false);
		expect(actions.get('a[href="/signup"]').text()).toBe("Schedule Class");
		wrapper.unmount();
	});
});
