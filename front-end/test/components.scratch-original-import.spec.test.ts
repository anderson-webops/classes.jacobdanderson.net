import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { reactive } from "vue";
import ScratchIdeWorkspace from "@/components/ScratchIdeWorkspace.vue";
import { fetchScratchOriginalArchive } from "@/modules/scratch/originals";

const route = reactive({
	query: {
		originalProject: "287707460",
		course: "scratch-level-1",
		role: "project"
	}
});
vi.mock("vue-router", () => ({
	useRoute: () => route,
	onBeforeRouteLeave: vi.fn()
}));
vi.mock("@/modules/scratch/originals", async original => ({
	...(await original<typeof import("@/modules/scratch/originals")>()),
	fetchScratchOriginalArchive: vi.fn(async () => new ArrayBuffer(8))
}));

beforeEach(() => {
	route.query = {
		originalProject: "287707460",
		course: "scratch-level-1",
		role: "project"
	};
	vi.mocked(fetchScratchOriginalArchive).mockClear();
});
afterEach(() => vi.restoreAllMocks());

async function workspace() {
	const wrapper = mount(ScratchIdeWorkspace, {
		attachTo: document.body,
		global: {
			stubs: {
				WorkspaceHeader: true,
				WorkspaceStorageStatus: true,
				WorkspaceDisclosure: true,
				IdeEnvironmentSelect: true,
				RouterLink: true
			}
		}
	});
	await flushPromises();
	const frame = wrapper.get("iframe").element as HTMLIFrameElement;
	const channel = frame.srcdoc.match(/data-channel="([^"]+)"/)![1];
	const send = (type: string) =>
		window.dispatchEvent(
			new MessageEvent("message", {
				source: frame.contentWindow,
				origin: "null",
				data: { source: "classes-scratch", channel, type }
			})
		);
	return { wrapper, frame, send };
}

it("requires confirmation before fetching an original, and Cancel leaves it unopened", async () => {
	const { wrapper, send } = await workspace();
	try {
		send("ready");
		await flushPromises();
		expect(wrapper.text()).toContain("Open Dragonfly Events in Scratch?");
		expect(fetchScratchOriginalArchive).not.toHaveBeenCalled();
		await wrapper
			.findAll(".scratch-original-import button")[1]
			.trigger("click");
		expect(wrapper.find(".scratch-original-import").exists()).toBe(false);
		expect(fetchScratchOriginalArchive).not.toHaveBeenCalled();
	} finally {
		wrapper.unmount();
	}
});

it("loads the confirmed original and preserves unsaved work when replacement is declined", async () => {
	const { wrapper, frame, send } = await workspace();
	const post = vi.spyOn(frame.contentWindow!, "postMessage");
	try {
		send("ready");
		await flushPromises();
		await wrapper.get(".scratch-original-import button").trigger("click");
		await flushPromises();
		expect(fetchScratchOriginalArchive).toHaveBeenCalledTimes(1);
		expect(post).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "load",
				bytes: expect.any(ArrayBuffer)
			}),
			"*"
		);
		send("loaded");
		await flushPromises();
		expect(wrapper.find(".scratch-original-import").exists()).toBe(false);
		expect(wrapper.get(".scratch-original-credit").text()).toContain(
			"JuniLearningScratch"
		);
		send("changed");
		route.query.originalProject = "287920173";
		await flushPromises();
		vi.spyOn(window, "confirm").mockReturnValue(false);
		await wrapper.get(".scratch-original-import button").trigger("click");
		await flushPromises();
		expect(window.confirm).toHaveBeenCalled();
		expect(fetchScratchOriginalArchive).toHaveBeenCalledTimes(1);
		expect(wrapper.text()).toContain("Unsaved changes.");
	} finally {
		wrapper.unmount();
	}
});
