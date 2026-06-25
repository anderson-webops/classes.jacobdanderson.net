import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	courseAssetViewerUrl,
	extractMarkdownSection,
	loadCourseAssetSection,
	parseCourseAssetUrl,
	resetCourseAssetPreviewCache,
	slugMarkdownHeading
} from "@/modules/courseAssetPreview";

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
		expect(previewSource).toContain(".course-asset-preview-panel {");
		expect(previewSource).toContain("contain: inline-size;");
		expect(previewSource).toContain("overflow: hidden;");
		expect(previewSource).toContain("min-inline-size: 0;");
		expect(previewSource).toContain("max-inline-size: 100%;");
		expect(previewSource).toContain("grid-template-columns: minmax(0, 1fr);");
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
		expect(previewSource).toContain("width: 100%;");
		expect(previewSource).toContain("inline-size: 100%;");
		expect(previewSource).toContain("max-inline-size: 100%;");
		expect(previewSource).toContain("table-layout: fixed;");
		expect(previewSource).toContain("scrollbar-gutter: stable;");
		expect(previewSource).toContain(
			".course-asset-preview-content :deep(.item-content-markdown th)"
		);
		expect(previewSource).toContain(
			".course-asset-preview-content :deep(.item-content-markdown th code)"
		);
		expect(previewSource).toContain("overflow-wrap: anywhere;");
		expect(explorerSource).toContain(".course-reader {");
		expect(explorerSource).toContain("overflow-x: hidden;");
		expect(explorerSource).toContain(".course-workspace > *");
		expect(explorerSource).toContain(".lesson-list {");
		expect(explorerSource).toContain(".lesson-item {");
		expect(explorerSource).toContain("overflow-x: hidden;");
		expect(explorerSource).toContain(".reader-section {");
		expect(explorerSource).toContain(".lesson-card {");

		expect(markdownSource).toContain("max-width: min(100%, 82ch);");
		expect(markdownSource).toContain(
			"max-inline-size: min(100%, 82ch);"
		);
		expect(markdownSource).toContain("box-sizing: border-box;");
		expect(markdownSource).toContain(
			".item-content-markdown :deep(.markdown-table-scroll)"
		);
		expect(markdownSource).toContain("contain: inline-size layout paint;");
		expect(markdownSource).toContain("overscroll-behavior-inline: contain;");
		expect(markdownSource).toContain(".item-content-markdown :deep(table)");
		expect(markdownSource).toContain("width: 100%;");
		expect(markdownSource).toContain("inline-size: 100%;");
		expect(markdownSource).toContain("min-width: 100%;");
		expect(markdownSource).toContain("max-width: 100%;");
		expect(markdownSource).toContain("table-layout: fixed;");
		expect(markdownSource).toContain("min-inline-size: 0;");
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
