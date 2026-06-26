import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	courseAssetViewerUrl,
	extractMarkdownSection,
	loadCourseAssetSection,
	parseCourseAssetUrl,
	resetCourseAssetPreviewCache,
	slugMarkdownHeading
} from "@/modules/courseAssetPreview";
import CourseAssetPreview from "@/components/CourseAssetPreview.vue";

describe("course asset preview utilities", () => {
	beforeEach(() => {
		resetCourseAssetPreviewCache();
	});

	it("parses local Markdown course asset URLs and fragments", () => {
		expect(
			parseCourseAssetUrl(
				"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data"
			)
		).toEqual({
			hash: "heating-curve-data",
			path: "/course-assets/chemistry/chemistry-materials-pack.md"
		});
		expect(parseCourseAssetUrl("https://example.com/file.md")).toBeNull();
		expect(
			parseCourseAssetUrl("/course-assets/chemistry/image.png")
		).toBeNull();
	});

	it("builds styled viewer URLs for local Markdown course assets", () => {
		expect(
			courseAssetViewerUrl(
				"/course-assets/chemistry/chemistry-materials-pack.md#measurement-tables-and-unit-conversions",
				"Measurement tables"
			)
		).toBe(
			"/course-resource?asset=%2Fcourse-assets%2Fchemistry%2Fchemistry-materials-pack.md%23measurement-tables-and-unit-conversions&label=Measurement+tables"
		);
		expect(courseAssetViewerUrl("https://example.com/file.md")).toBe(
			"https://example.com/file.md"
		);
	});

	it("uses the same heading slug style as authored chemistry asset links", () => {
		expect(slugMarkdownHeading("Heating Curve Data")).toBe(
			"heating-curve-data"
		);
		expect(slugMarkdownHeading("Formula `H₂O` and pH")).toBe(
			"formula-ho-and-ph"
		);
	});

	it("extracts only the requested Markdown section", () => {
		const markdown = [
			"# Packet",
			"",
			"## Measurement Tables",
			"",
			"Measurement text.",
			"",
			"## Heating Curve Data",
			"",
			"Heating text.",
			"",
			"### Detail",
			"",
			"Nested detail.",
			"",
			"## Capstone Evidence Seeds",
			"",
			"Capstone text."
		].join("\n");

		const section = extractMarkdownSection(markdown, "heating-curve-data");

		expect(section).toContain("## Heating Curve Data");
		expect(section).toContain("Nested detail.");
		expect(section).not.toContain("Measurement text.");
		expect(section).not.toContain("Capstone text.");
	});

	it("fetches the asset file once and extracts the fragment locally", async () => {
		const fetcher = vi.fn(async () => ({
			ok: true,
			text: async () =>
				[
					"# Packet",
					"",
					"## Phase Diagram Data",
					"",
					"Phase text.",
					"",
					"## Other",
					"",
					"Other text."
				].join("\n")
		})) as any;

		const section = await loadCourseAssetSection(
			"/course-assets/chemistry/chemistry-materials-pack.md#phase-diagram-data",
			"Phase diagram data",
			fetcher
		);

		expect(fetcher).toHaveBeenCalledWith(
			"/course-assets/chemistry/chemistry-materials-pack.md"
		);
		expect(section.title).toBe("Phase Diagram Data");
		expect(section.content).toContain("Phase text.");
		expect(section.content).not.toContain("Other text.");
	});

	it("keeps wide embedded course resource markdown inside the preview scrollbox", async () => {
		const fetcher = vi.fn(async () => ({
			ok: true,
			text: async () =>
				[
					"# Turtle Pack",
					"",
					"## Wide Resource",
					"",
					"| Command | Argument or unit | What it does |",
					"| --- | --- | --- |",
					"| `shape(\"triangle\")` | shape name | Common shapes include `turtle`, `arrow`, `circle`, `square`, and `triangle`, so this row intentionally uses enough inline code to challenge the preview width. |",
					"",
					"```python",
					"player.forward(50)      # Move 50 pixels forward.",
					"player.goto(-120, 80)   # Move to x = -120, y = 80 without drawing.",
					"```"
				].join("\n")
		})) as any;
		vi.stubGlobal("fetch", fetcher);

		const wrapper = mount(CourseAssetPreview, {
			props: {
				resources: [
					{
						kind: "asset",
						label: "Wide resource",
						url: "/course-assets/python/turtle-project-reference.md#wide-resource"
					}
				]
			}
		});

		await wrapper.find(".course-asset-preview-toggle").trigger("click");
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.find(".markdown-table-scroll").exists()).toBe(true);
			expect(wrapper.find("pre").exists()).toBe(true);
		});

		const scrollbox = wrapper.find(".course-asset-preview-scrollbox");
		const markdown = wrapper.find(".item-content-markdown");
		const tableWrapper = wrapper.find(".markdown-table-scroll");
		const table = wrapper.find("table");
		const codeBlock = wrapper.find("pre");

		expect(scrollbox.exists()).toBe(true);
		expect(markdown.exists()).toBe(true);
		expect(tableWrapper.exists()).toBe(true);
		expect(table.exists()).toBe(true);
		expect(codeBlock.exists()).toBe(true);
		expect(scrollbox.element.contains(markdown.element)).toBe(true);
		expect(scrollbox.element.contains(tableWrapper.element)).toBe(true);
		expect(tableWrapper.element.contains(table.element)).toBe(true);
		expect(scrollbox.element.contains(codeBlock.element)).toBe(true);
		expect(fetcher).toHaveBeenCalledWith(
			"/course-assets/python/turtle-project-reference.md"
		);
	});

	it("keeps the full course resource page constrained on mobile", () => {
		const source = readFileSync(
			resolve(__dirname, "../src/pages/course-resource.vue"),
			"utf8"
		);

		expect(source).toContain(
			"grid-template-columns: minmax(0, 1fr);"
		);
		expect(source).toContain("min-width: 0;");
		expect(source).toContain("overflow-x: hidden;");
		expect(source).toContain(
			".course-resource-card :deep(.item-content-markdown)"
		);
		expect(source).toContain("width: 100%;");
	});

	it("contains inline course asset previews and Markdown tables inside the reader column", () => {
		const previewSource = readFileSync(
			resolve(__dirname, "../src/components/CourseAssetPreview.vue"),
			"utf8"
		);
		const explorerSource = readFileSync(
			resolve(__dirname, "../src/components/CourseExplorer.vue"),
			"utf8"
		);
		const markdownSource = readFileSync(
			resolve(__dirname, "../src/components/LazyMarkdownContent.vue"),
			"utf8"
		);

		expect(previewSource).toContain(".course-asset-preview {");
		expect(previewSource).toContain("min-width: 0;");
		expect(previewSource).toContain("width: 100%;");
		expect(previewSource).toContain("max-width: 100%;");
		expect(previewSource).toContain("box-sizing: border-box;");
		expect(previewSource).toContain("container-type: inline-size;");
		expect(previewSource).toContain("overflow-x: hidden;");
		expect(previewSource).not.toContain("overflow: clip;");
		expect(previewSource).toContain("contain: inline-size;");
		expect(previewSource).toContain(".course-asset-preview-panel {");
		expect(previewSource).toContain("justify-items: stretch;");
		expect(previewSource).toContain("overflow: hidden;");
		expect(previewSource).toContain("min-inline-size: 0;");
		expect(previewSource).toContain("max-inline-size: 100%;");
		expect(previewSource).toContain(
			"grid-template-columns: minmax(0, 1fr);"
		);
		expect(previewSource).toContain(
			'<div class="course-asset-preview-scrollbox">'
		);
		expect(previewSource).toContain(".course-asset-preview-scrollbox {");
		expect(previewSource).toContain("position: relative;");
		expect(previewSource).toContain(
			".course-asset-preview-scrollbox :deep(.item-content-markdown)"
		);
		expect(previewSource).toContain("justify-self: stretch;");
		expect(previewSource).toContain("isolation: isolate;");
		expect(previewSource).toContain("overflow-x: auto;");
		expect(previewSource).toContain("overflow-y: hidden;");
		expect(previewSource).toContain("overflow-inline: auto;");
		expect(previewSource).toContain("-webkit-overflow-scrolling: touch;");
		expect(previewSource).toContain(
			".course-asset-preview-content :deep(.item-content-markdown)"
		);
		expect(previewSource).toContain(".course-asset-preview-content");
		expect(previewSource).toContain(
			":deep(.item-content-markdown .markdown-table-scroll)"
		);
		expect(previewSource).toContain(
			".course-asset-preview-content :deep(.item-content-markdown table)"
		);
		expect(previewSource).toContain("width: max-content;");
		expect(previewSource).toContain("inline-size: max-content;");
		expect(previewSource).toContain("min-width: 100%;");
		expect(previewSource).toContain("min-inline-size: 100%;");
		expect(previewSource).toContain("max-width: none;");
		expect(previewSource).toContain("max-inline-size: none;");
		expect(previewSource).toContain("table-layout: auto;");
		expect(previewSource).toContain("scrollbar-gutter: stable;");
		expect(previewSource).toContain("overflow-inline: auto;");
		expect(previewSource).toContain(
			".course-asset-preview-content :deep(.item-content-markdown th)"
		);
		expect(previewSource).toContain(
			".course-asset-preview-content :deep(.item-content-markdown th code)"
		);
		expect(previewSource).toContain("overflow-wrap: anywhere;");
		expect(previewSource).toContain("word-break: break-word;");
		expect(explorerSource).toContain(".course-reader {");
		expect(explorerSource).toContain("width: 100%;");
		expect(explorerSource).toContain("inline-size: 100%;");
		expect(explorerSource).toContain("overflow-x: hidden;");
		expect(explorerSource).toContain(".course-workspace > *");
		expect(explorerSource).toContain(".lesson-list {");
		expect(explorerSource).toContain(".lesson-item {");
		expect(explorerSource).toContain("overflow-x: hidden;");
		expect(explorerSource).toContain(".reader-section {");
		expect(explorerSource).toContain(".lesson-card {");
		expect(explorerSource).toContain("box-sizing: border-box;");
		expect(explorerSource).toContain(".lesson-card > *");
		expect(explorerSource).toContain("min-inline-size: 0;");
		expect(explorerSource).toContain("max-inline-size: 100%;");

		expect(markdownSource).toContain("max-width: 100%;");
		expect(markdownSource).toContain("max-inline-size: 100%;");
		expect(markdownSource).toContain("max-width: 82ch;");
		expect(markdownSource).toContain("max-inline-size: 82ch;");
		expect(markdownSource).toContain("box-sizing: border-box;");
		expect(markdownSource).toContain("display: grid;");
		expect(markdownSource).toContain(
			"grid-template-columns: minmax(0, 1fr);"
		);
		expect(markdownSource).toContain(
			".item-content-markdown :deep(.markdown-table-scroll)"
		);
		expect(markdownSource).toContain("contain: inline-size;");
		expect(markdownSource).toContain("clip-path: inset(0 round 14px);");
		expect(markdownSource).toContain("isolation: isolate;");
		expect(markdownSource).toContain("overscroll-behavior-inline: contain;");
		expect(markdownSource).toContain(".item-content-markdown :deep(table)");
		expect(markdownSource).toContain("width: max-content;");
		expect(markdownSource).toContain("inline-size: max-content;");
		expect(markdownSource).toContain("min-width: 100%;");
		expect(markdownSource).toContain("min-inline-size: 100%;");
		expect(markdownSource).toContain("max-width: none;");
		expect(markdownSource).toContain("max-inline-size: none;");
		expect(markdownSource).toContain("table-layout: auto;");
		expect(markdownSource).toContain("min-inline-size: 7rem;");
		expect(markdownSource).toContain(
			".item-content-markdown :deep(th code)"
		);
		expect(markdownSource).toContain("white-space: normal;");
		expect(markdownSource).toContain("overflow-x: auto;");
		expect(markdownSource).toContain("overflow-inline: auto;");
		expect(markdownSource).toContain(".item-content-markdown :deep(pre)");
		expect(markdownSource).toContain("max-width: 100%;");
	});
});
