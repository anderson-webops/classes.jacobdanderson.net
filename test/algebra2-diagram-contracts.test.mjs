import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native coordinate validation entrypoint.
import { test } from "node:test";

const root = new URL("../front-end/public/course-assets/", import.meta.url);
const files = {
	"algebra-2a": [
		"complex-plane",
		"quadratic-forms",
		"quadratic-transformations",
		"polynomial-behavior",
		"rational-functions",
		"radical-functions",
		"piecewise-functions"
	],
	"algebra-2b": [
		"exp-log-families",
		"unit-circle-trig",
		"arithmetic-sequences",
		"geometric-sequences",
		"statistics-regression",
		"trig-graphs"
	]
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
	"log-shift": x => Math.log(x - 1) / Math.LN10 + 3,
	"complex-distance": x => (7 * x - 34) / 5,
	"regression-line": x => (4 * x) / 5 + 3 / 2,
	"sine": Math.sin,
	"cosine": Math.cos,
	"tangent": x => Math.sin(x) / Math.cos(x)
};
const dataSets = {
	"arithmetic-terms": [
		[1, 4],
		[2, 7],
		[3, 10],
		[4, 13],
		[5, 16]
	],
	"arithmetic-sums": [
		[1, 10],
		[2, 30],
		[3, 60],
		[4, 100],
		[5, 150],
		[6, 210],
		[7, 280],
		[8, 360],
		[9, 450],
		[10, 550]
	],
	"geometric-terms": [
		[1, 1],
		[2, 3],
		[3, 9],
		[4, 27],
		[5, 81]
	],
	"geometric-sums": [
		[1, 1 / 2],
		[2, 3 / 4],
		[3, 7 / 8],
		[4, 15 / 16],
		[5, 31 / 32],
		[6, 63 / 64],
		[7, 127 / 128],
		[8, 255 / 256]
	],
	"regression-data": [
		[1, 2],
		[2, 4],
		[3, 3],
		[4, 5]
	],
	"nonlinear-data": [
		[-2, 4],
		[-1, 1],
		[0, 0],
		[1, 1],
		[2, 4]
	],
	"negative-data": [
		[3, 10],
		[5, 9],
		[8, 8],
		[9, 5],
		[10, 3]
	]
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
			const discreteSeen = new Map();
			const markedCoordinates = [];
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
						else if (a["data-equation"] === "area-triangle") {
							assert.ok(
								[
									[-3, -2],
									[5, 4],
									[5, -2]
								].some(
									([vx, vy]) =>
										Math.abs(x - vx) < 0.004
										&& Math.abs(y - vy) < 0.004
								)
							);
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
						assert.notEqual(Math.sign(points[0][0]), 0);
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
					if (a["data-equation"] === "tangent") {
						assert.equal(
							Math.floor((points[0][0] + Math.PI / 2) / Math.PI),
							Math.floor(
								(points.at(-1)[0] + Math.PI / 2) / Math.PI
							)
						);
					}
					if (["sine", "cosine"].includes(a["data-equation"])) {
						close(points[0][0], 0, "cycle start");
						close(points.at(-1)[0], 2 * Math.PI, "complete cycle");
					}
				}
				for (const match of body.matchAll(/<circle\b[^>]+>/g)) {
					const a = attributes(match[0]);
					if (a["data-equation"]) {
						const actual = invert([Number(a.cx), Number(a.cy)]);
						const expected = dataSets[a["data-equation"]];
						assert.ok(expected);
						const index = expected.findIndex(p =>
							p.every(
								(value, i) =>
									Math.abs(value - actual[i]) < 0.004
							)
						);
						assert.ok(
							index >= 0,
							`${a["data-equation"]} unexpected observation ${actual}`
						);
						discreteSeen.set(a["data-equation"], [
							...(discreteSeen.get(a["data-equation"]) ?? []),
							index
						]);
						checked++;
					}
					if (!a["data-coordinate"]) continue;
					const expected = a["data-coordinate"]
						.split(",")
						.map(Number);
					const actual = invert([Number(a.cx), Number(a.cy)]);
					actual.forEach((value, i) =>
						close(value, expected[i], "marked point")
					);
					markedCoordinates.push(expected);
					if (name === "trig-graphs") {
						const equation = body.includes("data-equation=\"sine\"")
							? Math.sin
							: body.includes("data-equation=\"cosine\"")
								? Math.cos
								: Math.tan;
						close(actual[1], equation(actual[0]), "trig key point");
					}
				}
			}
			for (const [id, indices] of discreteSeen) {
				assert.deepEqual(
					indices.sort((a, b) => a - b),
					dataSets[id].map((_, i) => i)
				);
			}
			if (
				["arithmetic-sequences", "geometric-sequences"].includes(name)
			) {
				assert.equal(
					checked,
					name === "arithmetic-sequences" ? 15 : 13
				);
				assert.doesNotMatch(svg, /<polyline/);
			}
			else {
				assert.ok(checked > 100);
			}
			if (name === "complex-plane") {
				const expected = [
					[3, 2],
					[-2, -4],
					[2, -1],
					[4, 0],
					[0, -3],
					[1, 4],
					[2, -4],
					[7, 3],
					[-3, -2],
					[5, 4],
					[5, -2]
				];
				assert.deepEqual(
					markedCoordinates.map(p => JSON.stringify(p)).sort(),
					expected.map(p => JSON.stringify(p)).sort()
				);
			}
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
