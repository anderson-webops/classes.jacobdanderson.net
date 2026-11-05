/** Drop only the redundant lead label; preserve the task and any source code. */
export function formatAuthoredAssignment(content: string) {
	return content.replace(/^\*\*(?:Project )?Goal:\*\*\s*/i, "");
}

/** Join source-wrapped prose while retaining Markdown structure and hard breaks. */
export function formatAuthoredReading(content: string) {
	const result: string[] = [];
	let paragraph: string[] = [];
	let fence = "";
	const flush = () => {
		if (paragraph.length) result.push(paragraph.join(" "));
		paragraph = [];
	};
	for (const line of content.split("\n")) {
		const match = line.match(/^ {0,3}(`{3,}|~{3,})/);
		const marker = match?.[1];
		const trailing = match ? line.slice(match[0].length).trim() : "";
		if (fence || marker) {
			flush();
			result.push(line);
			if (!fence) {
				fence = marker!;
			} else if (
				marker?.[0] === fence[0] &&
				marker.length >= fence.length &&
				!trailing
			) {
				fence = "";
			}
		} else if (
			!line.trim() ||
			/^\s|^#{1,6}\s|^>|^\||^(?:[-*+]|\d+[.)])\s|^\[[^\]]+\]:|^!\[/.test(
				line
			) ||
			/ {2}$|\\$/.test(line)
		) {
			flush();
			result.push(line);
		} else {
			paragraph.push(line.trim());
		}
	}
	flush();
	return result.join("\n");
}
