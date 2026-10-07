import { mount } from "@vue/test-utils";
import { createHead } from "@unhead/vue/server";
import { describe, expect, it } from "vitest";
import PaymentPage from "@/pages/payment.vue";

describe("PaymentPage", () => {
	it("keeps pricing and payment methods without duplicate FAQs or scheduling", () => {
		const wrapper = mount(PaymentPage, {
			global: {
				plugins: [createHead()],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});
		expect(wrapper.get("h1").text()).toBe("Payment");
		expect(wrapper.get(".amount").text()).toBe("$40");
		expect(wrapper.get(".details").text()).toContain("50 Minutes");
		expect(wrapper.get(".payment-policy").text()).toBe(
			"Pay only for classes taught"
		);
		expect(wrapper.text()).toContain("Need another option?");
		expect(wrapper.get('a[href="/zelle"]').text()).toBe("Pay with Zelle");
		expect(wrapper.get('a[target="_blank"]').attributes("href")).toContain(
			"venmo.com/"
		);
		expect(wrapper.text()).not.toMatch(
			/Private one-on-one sessions are|Tuition|Common Questions|One learner at a time|Use Venmo|Book one-time/
		);
		expect(wrapper.find("details").exists()).toBe(false);
		expect(wrapper.find('a[href="/signup"]').exists()).toBe(false);
		wrapper.unmount();
	});
});
