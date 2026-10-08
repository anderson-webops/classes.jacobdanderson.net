import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CourseAccessCodeManager from "@/components/CourseAccessCodeManager.vue";

const moduleMocks = vi.hoisted(() => ({
	create: vi.fn(),
	fetch: vi.fn(),
	recover: vi.fn(),
	update: vi.fn()
}));

vi.mock("@/modules/courseAccessCodes", () => ({
	createCourseAccessCode: moduleMocks.create,
	fetchCourseAccessCodes: moduleMocks.fetch,
	recoverCourseCodeLearner: moduleMocks.recover,
	updateCourseAccessCode: moduleMocks.update
}));

const existingCode = {
	_id: "code-1",
	codeHint: "ABCD",
	courseID: "python-level-1",
	label: "Period 2",
	createdByRole: "tutor" as const,
	createdByName: "Tutor",
	active: true,
	createdAt: "2026-07-25T12:00:00.000Z",
	updatedAt: "2026-07-25T12:00:00.000Z"
};

describe("CourseAccessCodeManager.vue", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		moduleMocks.fetch.mockResolvedValue([]);
	});

	it("creates and reveals a raw course code only in the creation result", async () => {
		moduleMocks.create.mockResolvedValue({
			accessCode: existingCode,
			code: "2345-6789-ABCD"
		});
		const wrapper = mount(CourseAccessCodeManager, {
			props: {
				courses: [{ id: "python-level-1", name: "Python Level 1" }]
			}
		});
		await flushPromises();

		await wrapper.get("input").setValue("Period 2");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(moduleMocks.create).toHaveBeenCalledWith({
			courseID: "python-level-1",
			label: "Period 2"
		});
		expect(wrapper.text()).toContain("2345-6789-ABCD");
		expect(wrapper.text()).toContain("full code cannot be recovered later");
		expect(wrapper.text()).toContain("Code ending in ABCD");
	});

	it("lets staff disable an active code and explains the project effect", async () => {
		moduleMocks.fetch.mockResolvedValue([existingCode]);
		moduleMocks.update.mockResolvedValue({
			...existingCode,
			active: false
		});
		const wrapper = mount(CourseAccessCodeManager, {
			props: {
				courses: [{ id: "python-level-1", name: "Python Level 1" }]
			}
		});
		await flushPromises();
		const disableButton = wrapper
			.findAll("button")
			.find(button => button.text() === "Disable");
		expect(disableButton).toBeDefined();

		await disableButton!.trigger("click");
		await flushPromises();

		expect(moduleMocks.update).toHaveBeenCalledWith("code-1", {
			active: false
		});
		expect(wrapper.text()).toContain(
			"Existing code sessions can no longer sync or reopen projects."
		);
		expect(wrapper.text()).toContain("Disabled");
	});

	it("requires an identity confirmation and reveals a recovery password only once", async () => {
		moduleMocks.fetch.mockResolvedValue([existingCode]);
		moduleMocks.recover.mockResolvedValue("synthetic-recovery-password");
		const wrapper = mount(CourseAccessCodeManager, {
			props: {
				courses: [{ id: "python-level-1", name: "Python Level 1" }]
			}
		});
		await flushPromises();
		const details = wrapper.get(".workspace-disclosure");
		await details.get("select").setValue("code-1");
		await details.get("input:not([type=checkbox])").setValue("Learner");
		await details.get("form").trigger("submit.prevent");
		expect(moduleMocks.recover).not.toHaveBeenCalled();
		await details.get("input[type=checkbox]").setValue(true);
		await details.get("form").trigger("submit.prevent");
		await flushPromises();
		expect(moduleMocks.recover).toHaveBeenCalledWith("code-1", "Learner");
		expect(details.text()).toContain("synthetic-recovery-password");
		await details
			.findAll("button")
			.find(button => button.text() === "Hide password")!
			.trigger("click");
		expect(details.text()).not.toContain("synthetic-recovery-password");
	});
});
