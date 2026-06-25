import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("communication markdown list styles", () => {
	it("keeps profile communication list markers inset inside cards", () => {
		const source = readFileSync(
			resolve(__dirname, "../src/components/UserCommunicationPanel.vue"),
			"utf8"
		);

		expect(source).toContain(".record-body :deep(ul),");
		expect(source).toContain(".record-body :deep(ol) {");
		expect(source).toContain("margin: 0.75em 0 0.75em 0.25rem;");
		expect(source).toContain("padding-inline-start: 1.65rem;");
		expect(source).toContain("list-style-position: outside;");
		expect(source).toContain(".record-body :deep(li) {");
		expect(source).toContain("padding-inline-start: 0.25rem;");
	});
});
