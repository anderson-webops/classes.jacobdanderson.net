import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export const aiStudioFixture = JSON.parse(readFileSync(new URL("./fixtures/ai-studio-sources.json", import.meta.url), "utf8"));
export const studioChecks = {
	"search-13": { expression: "breadth_first_search(GRAPH, \"A\", \"E\")[\"path\"]", result: "['A', 'C', 'E']" },
	"search-14": { expression: "depth_limited_search(GRAPH, \"S\", \"G\", 2)[\"status\"]", result: "cutoff" },
	"search-15": { expression: "search(GRAPH, \"S\", \"G\", BAD, \"astar\")[\"cost\"]", result: "9" },
	"search-16": { expression: "search(GRAPH, \"S\", \"G\", {}, \"greedy\")[\"cost\"]", result: "4" },
	"search-17": { expression: "solve((2, 3, 1, 0), \"greedy\", blank_distance)[\"moves\"]", result: "4" },
	"tic-tac-toe": { expression: "best_move(tuple(\"X---O---X\"))", result: "1" },
	"marble-game": { expression: "best_move(7)", result: "3" }
};
export function editedAiStudioSource(project) {
	const source = aiStudioFixture.files[`${project.folder}/solution/main.py`].content;
	const entry = "if __name__ == \"__main__\":\n    main()\n";
	assert.equal(source.split(entry).length, 2);
	return source.replace(entry, `if __name__ == "__main__":\n    print("Studio result:", ${studioChecks[project.key].expression})\n`);
}
