import { expect, it } from "vitest";
import { formatAuthoredReading } from "@/stores/courses/authoredReading";

it("keeps source programs byte-for-byte while joining wrapped prose", () => {
	const program =
		"```python\nprint('one')\n\n# A blank line and indentation belong to the program.\nif True:\n    print('two')\n```";
	const text = `A wrapped\nparagraph.\n\n${program}\n\nAnother wrapped\nparagraph.`;
	const formatted = formatAuthoredReading(text);
	const fenced = formatted.match(/```python[\s\S]+?```/)?.[0];
	expect(fenced).toBe(program);
	expect(formatted).toBe(
		`A wrapped paragraph.\n\n${program}\n\nAnother wrapped paragraph.`
	);
});

it("retains poem lines, lists, tables and explicit hard breaks", () => {
	const structures =
		"1. First poem line.\n2. Second poem line.\n\n- A list item\n  with its continuation.\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\nA deliberate break.  \nThe next line.";
	expect(formatAuthoredReading(structures)).toBe(structures);
});
