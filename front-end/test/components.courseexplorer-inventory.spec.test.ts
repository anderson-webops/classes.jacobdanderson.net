import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { api } from "@/api";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

vi.mock("@/api", () => ({
	api: { get: vi.fn().mockResolvedValue({ data: [] }), put: vi.fn() }
}));

it.each(["learner", "instructor"])(
	"keeps source-media bookkeeping out of %s course navigation",
	async role => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const id = "middle-school-a-literature";
		const app = useAppStore();
		const learner = {
			_id: "inventory-learner",
			name: "Student",
			email: "student@example.invalid",
			age: 14,
			state: "GA",
			courseAccess: [id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		};
		vi.mocked(api.get).mockResolvedValue({ data: [learner] });
		app.setUsers([learner]);
		if (role === "instructor")
			app.setCurrentTutor({
				_id: "inventory-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 1,
				coursePermissions: [id],
				editTutors: false,
				saveEdit: "Save"
			});
		else app.setCurrentUser(learner);
		window.localStorage.clear();
		window.history.replaceState(
			{},
			"",
			"/courses#middle-school-a-literature-msa1-main-ideas-supporting-evidence-i"
		);
		const wrapper = mount(CourseExplorer, { global: { plugins: [pinia] } });
		try {
			await flushPromises();
			await vi.waitFor(
				() =>
					expect(
						wrapper.findAll(".outline-button").length
					).toBeGreaterThan(0),
				{ timeout: 5000 }
			);
			expect(
				wrapper
					.findAll(".outline-button")
					.map(button => button.text())
					.join("\n")
			).not.toContain("Pending Source Media Inventory");
			expect(wrapper.findAll(".outline-button")).toHaveLength(13);
			const course = (await useCoursesStore().loadCourseById(id))!;
			const inventory = course.modules.find(
				module => module.title === "Pending Source Media Inventory"
			)!;
			expect(inventory.id).toBe(
				"middle-school-a-literature-pending-source-media-inventory"
			);
			expect(inventory.curriculum[0].id).toBe(
				"middle-school-a-literature-pending-source-media-inventory-curriculum-middle-school-a-reading-and-analyzing-literature-pending-source-media"
			);
			expect(inventory.curriculum[0].content).toContain(
				"msa1_concept1_mainideasupportingevidence.png"
			);
		} finally {
			wrapper.unmount();
		}
	}
);
