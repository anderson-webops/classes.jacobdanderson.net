import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { expect, it, vi } from "vitest";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";

it.each([
	["intro-physics-materials-pack.md", "d = (1/2)gt²"],
	["intro-physics-rubrics-answer-key.md", "(4.8-0.0)/(4.0-0.0)=1.20 m/s"],
	["physics-level-2-materials-pack.md", "μ=3.986×10¹⁴ m³/s²"],
	["physics-level-2-rubrics-answer-key.md", "√(12²-5²)=10.91 m/s"]
])(
	"renders readable quantities from %s with the real course renderer",
	async (file, equation) => {
		const content = readFileSync(
			resolve("public/course-assets/physics", file),
			"utf8"
		);
		const wrapper = mount(LazyMarkdownContent, { props: { content } });
		try {
			await vi.waitFor(() => expect(wrapper.text()).toContain(equation));
			expect(wrapper.findAll("code").length).toBeGreaterThan(5);
			expect(wrapper.text()).not.toMatch(
				/\\(?:frac|sqrt|text|times|mu)|\\[()[\]]/
			);
			if (file === "physics-level-2-materials-pack.md") {
				expect(wrapper.text()).toContain("(mg sin θ)/(mg)");
				expect(wrapper.text()).toContain(
					"x_(n+1)=x_n+v_nΔt; v_(n+1)=v_n+aΔt"
				);
			}
		} finally {
			wrapper.unmount();
		}
	}
);
