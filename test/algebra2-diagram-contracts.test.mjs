import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native coordinate validation entrypoint.
import { test } from "node:test";

const root = new URL("../front-end/public/course-assets/", import.meta.url);
const files = {
	"algebra-2a": [
		"quadratic-forms",
		"quadratic-transformations",
		"polynomial-behavior",
		"rational-functions",
		"radical-functions",
		"piecewise-functions"
	],
	"algebra-2b": ["exp-log-families", "unit-circle-trig"]
};
const functions = {
	"x2": x => x * x,
	"2x2": x => 2 * x * x,
	"quarter-x2": x => (x * x) / 4,
	"half-x2": x => (x * x) / 2,
	"negative-x2": x => -x * x,
	"vertex-quadratic": x => x * x + 4 * x - 5,
	"translated-quadratic": x => x * x - 6 * x + 13,
	"positive-cubic": x => (x * x * x) / 4,
	"negative-cubic": x => (-x * x * x) / 4,
	"multiplicity-cubic": x => x * x * x - x * x - x + 1,
	"reciprocal": x => 1 / x,
	"rational-hole": x => (x - 1) / (x - 4),
	"rational-slant": x => (x * x + 1) / (x - 1),
	"slant-line": x => x + 1,
	"square-root": x => Math.sqrt(x),
	"translated-root": x => Math.sqrt(x - 3) + 2,
	"cube-root": x => Math.cbrt(x),
	"piecewise-left": x => x - 1,
	"piecewise-right": x => 3 * x,
	"absolute-value": x => Math.abs(x),
	"exp-two": x => Math.exp(x * Math.LN2),
	"exp-half": x => Math.exp(-x * Math.LN2),
	"exp-shift": x => 2 * Math.exp(x * Math.LN2),
	"log-two": x => Math.log(x) / Math.LN2,
	"log-half": x => Math.log(x) / -Math.LN2,
	"log-shift": x => Math.log(x - 1) / Math.LN10 + 3
};
function attributes(tag) {
	return Object.fromEntries(
		[...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [
			match[1],
			match[2]
		])
	);
}
function close(actual, expected, label, tolerance = 0.004) {
	return assert.ok(
		Math.abs(actual - expected) < tolerance,
		`${label}: ${actual} != ${expected}`
	);
}

for (const [course, names] of Object.entries(files)) {
	for (const name of names) {
		test(`${course}/${name}: visible coordinates satisfy their equations`, () => {
			const svg = readFileSync(
				new URL(`${course}/${name}-v2.svg`, root),
				"utf8"
			);
			assert.match(svg, /role="img" aria-labelledby="title description"/);
			assert.match(
				svg,
				/<title id="title">.+<\/title><desc id="description">.+<\/desc>/
			);
			const panels = [
				...svg.matchAll(
					/<g data-bounds="([^"]+)" data-viewport="([^"]+)">([\s\S]*?)(?=<g data-bounds=|<\/g><\/svg>)/g
				)
			];
			assert.ok(panels.length >= 2);
			let checked = 0;
			for (const [, bounds, viewport, body] of panels) {
				const [xmin, xmax, ymin, ymax] = bounds.split(",").map(Number);
				const [left, top, width, height] = viewport
					.split(",")
					.map(Number);
				const invert = ([px, py]) => [
					xmin + ((px - left) * (xmax - xmin)) / width,
					ymax - ((py - top) * (ymax - ymin)) / height
				];
				for (const match of body.matchAll(/<polyline\b[^>]+>/g)) {
					const a = attributes(match[0]);
					const points = a.points
						.split(" ")
						.map(p => invert(p.split(",").map(Number)));
					assert.ok(points.length >= 2);
					for (let i = 0; i < points.length; i++) {
						const [x, y] = points[i];
						assert.ok(Number.isFinite(x) && Number.isFinite(y));
						if (a["data-equation"] === "unit-circle") {
							close(x * x + y * y, 1, "unit radius");
							close(
								width / (xmax - xmin),
								height / (ymax - ymin),
								"equal circle scales"
							);
						}
						else if (a["data-equation"] === "right-triangle") {
							assert.ok(
								Math.abs(y) < 0.004
								|| Math.abs(x - 24) < 0.004
								|| Math.abs(y - (x * 5) / 12) < 0.004
							);
						}
						else if (a["data-equation"] === "floor") {
							close(y, Math.round(y), "integer floor height");
							close(x, y + i, "floor interval endpoints");
						}
						else {
							assert.equal(
								typeof functions[a["data-equation"]],
								"function"
							);
							close(
								y,
								functions[a["data-equation"]](x),
								a["data-equation"],
								Math.max(0.004, Math.abs(y) * 0.0001)
							);
						}
						checked++;
					}
					if (a["data-equation"] === "reciprocal") {
						assert.equal(
							Math.sign(points[0][0]),
							Math.sign(points.at(-1)[0])
						);
					}
					if (a["data-equation"] === "rational-hole") {
						assert.equal(
							Math.sign(points[0][0] - 4),
							Math.sign(points.at(-1)[0] - 4)
						);
					}
					if (a["data-equation"] === "rational-slant") {
						assert.equal(
							Math.sign(points[0][0] - 1),
							Math.sign(points.at(-1)[0] - 1)
						);
					}
				}
				for (const match of body.matchAll(/<circle\b[^>]+>/g)) {
					const a = attributes(match[0]);
					if (!a["data-coordinate"]) continue;
					const expected = a["data-coordinate"]
						.split(",")
						.map(Number);
					const actual = invert([Number(a.cx), Number(a.cy)]);
					actual.forEach((value, i) =>
						close(value, expected[i], "marked point")
					);
				}
			}
			assert.ok(checked > 100);
		});
	}
}

test("matrix and probability diagrams retain operation conditions", () => {
	const matrix = readFileSync(
		new URL("algebra-2b/matrix-operations-v2.svg", root),
		"utf8"
	);
	const probability = readFileSync(
		new URL("algebra-2b/probability-tables-v2.svg", root),
		"utf8"
	);
	assert.match(matrix, /det\(A\) ≠ 0/);
	assert.match(matrix, /det\(B\) ≠ 0; order matters/);
	assert.match(probability, /P\(A\) P\(B \| A\)/);
	assert.match(probability, /For P\(A\) &gt; 0/);
	assert.match(probability, /Fair independent flips and a fair die/);
});
