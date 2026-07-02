import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LearnerCodeReviewTools from "@/components/LearnerCodeReviewTools.vue";

const moduleMocks = vi.hoisted(() => ({
	createReview: vi.fn(),
	fetchProjects: vi.fn(),
	updateReview: vi.fn()
}));

vi.mock("@/modules/pythonIde", () => ({
	createPythonIdeProjectReview: moduleMocks.createReview,
	fetchManagedPythonIdeProjects: moduleMocks.fetchProjects,
	isPythonIdeBinaryAssetFile: (file: { encoding?: string }) => file.encoding === "base64",
	updatePythonIdeProjectReview: moduleMocks.updateReview
}));

const project = {
	_id: "project-1",
	title: "Loops practice",
	mode: "python",
	files: [
		{
			name: "main.py",
			content: "print('student')\n",
			encoding: "text"
		}
	],
	activeFileName: "main.py",
	courseID: "python-level-2",
	courseProjectTitle: "Loops practice",
	createdAt: "2026-06-20T12:00:00.000Z",
	updatedAt: "2026-06-20T12:00:00.000Z"
};

const review = {
	_id: "review-1",
	sourceProject: "project-1",
	title: "Loops practice",
	mode: "python",
	files: [
		{
			name: "main.py",
			content: "# Try a loop here.\nprint('review')\n",
			encoding: "text"
		}
	],
	activeFileName: "main.py",
	courseID: "python-level-2",
	courseProjectTitle: "Loops practice",
	reviewerRole: "admin",
	reviewerName: "Admin",
	lastEditedByRole: "admin",
	lastEditedByName: "Admin",
	visibleToStudent: false,
	note: "",
	sourceUpdatedAt: "2026-06-20T12:00:00.000Z",
	createdAt: "2026-06-20T12:05:00.000Z",
	updatedAt: "2026-06-20T12:05:00.000Z"
};

function mountTools() {
	return mount(LearnerCodeReviewTools, {
		props: {
			userEmail: "student@example.com",
			userId: "student-1",
			userName: "Student One"
		}
	});
}

async function openTools(wrapper: ReturnType<typeof mountTools>) {
	const details = wrapper.find("details");
	(details.element as HTMLDetailsElement).open = true;
	await details.trigger("toggle");
	await flushPromises();
}

describe("LearnerCodeReviewTools", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		moduleMocks.fetchProjects.mockResolvedValue([{ project, review: null }]);
		moduleMocks.createReview.mockResolvedValue({ project, review });
		moduleMocks.updateReview.mockResolvedValue({ project, review });
	});

	it("loads learner projects on demand and creates a separate staff copy", async () => {
		const wrapper = mountTools();
		await openTools(wrapper);

		expect(moduleMocks.fetchProjects).toHaveBeenCalledWith("student-1");
		expect(wrapper.text()).toContain("Student current");
		expect(wrapper.text()).toContain("print('student')");
		expect(wrapper.text()).toContain("Create a staff copy");

		await wrapper.find("button.btn-primary").trigger("click");
		await flushPromises();

		expect(moduleMocks.createReview).toHaveBeenCalledWith("student-1", "project-1");
		expect((wrapper.find("textarea[aria-label='Edit staff review copy']").element as HTMLTextAreaElement).value)
			.toContain("Try a loop here");
	});

	it("uses Code IDE copy when learner projects fail to load", async () => {
		moduleMocks.fetchProjects.mockRejectedValue(new Error());
		const wrapper = mountTools();
		await openTools(wrapper);

		expect(wrapper.text()).toContain(
			"Unable to load saved Code IDE projects."
		);
		expect(wrapper.text()).not.toContain("Unable to load saved Python projects.");
	});

	it("saves edits, notes, and learner visibility only to the review copy", async () => {
		moduleMocks.fetchProjects.mockResolvedValue([{ project, review }]);
		const wrapper = mountTools();
		await openTools(wrapper);

		await wrapper.find("textarea[aria-label='Edit staff review copy']").setValue(
			"# Reviewed version\nprint('reviewed')\n"
		);
		await wrapper.find(".review-options textarea").setValue("Review before next class.");
		await wrapper.find(".visibility-toggle input").setValue(true);
		await wrapper.findAll("button").at(-1)?.trigger("click");
		await flushPromises();

		expect(moduleMocks.updateReview).toHaveBeenCalledWith(
			"student-1",
			"project-1",
			"review-1",
			expect.objectContaining({
				activeFileName: "main.py",
				note: "Review before next class.",
				visibleToStudent: true,
				files: [
					expect.objectContaining({
						name: "main.py",
						content: "# Reviewed version\nprint('reviewed')\n"
					})
				]
			})
		);
	});
});
