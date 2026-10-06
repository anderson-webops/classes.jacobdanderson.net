import ts from "typescript";

function proseForCopyChecks(text: string) {
	return text
		.replace(/(`{3,}|~{3,})[\s\S]*?\1/g, " ")
		.replace(/(`+)[\s\S]*?\1/g, " ");
}

export function rawCourseProse(source: string) {
	const tree = ts.createSourceFile(
		"course.ts",
		source,
		ts.ScriptTarget.Latest
	);
	const literals: Array<[number, number, string]> = [];
	function visit(node: ts.Node) {
		if (
			ts.isStringLiteralLike(node) ||
			ts.isTemplateHead(node) ||
			ts.isTemplateMiddle(node) ||
			ts.isTemplateTail(node)
		) {
			const prose = proseForCopyChecks(node.text);
			if (prose !== node.text)
				literals.push([
					node.getStart(tree),
					node.end,
					JSON.stringify(prose)
				]);
		}
		ts.forEachChild(node, visit);
	}
	visit(tree);
	for (const [start, end, prose] of literals.reverse())
		source = source.slice(0, start) + prose + source.slice(end);
	return source;
}
