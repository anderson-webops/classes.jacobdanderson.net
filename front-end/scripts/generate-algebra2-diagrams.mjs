import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(
	new URL("../public/course-assets/", import.meta.url)
);
const colors = ["#2563eb", "#b91c1c", "#15803d", "#7c3aed"];
function escape(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll('"', "&quot;");
}
const number = value => Number(value.toFixed(4));
function text(x, y, value, size = 23, color = "#0f172a", anchor = "start") {
	return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
}
function line(x1, y1, x2, y2, color = "#cbd5e1", dashed = false) {
	return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5"${dashed ? ' stroke-dasharray="8 6"' : ""}/>`;
}
let panelSequence = 0;

function plot(
	{
		title,
		bounds,
		ticks,
		curves = [],
		points = [],
		guides = [],
		square = false,
		xLabel = "x",
		yLabel = "y",
		note = ""
	},
	top
) {
	const [xmin, xmax, ymin, ymax] = bounds;
	const left = square ? 210 : 80;
	const width = square ? 300 : 560;
	const height = 300;
	const y = top + 130;
	const px = x => number(left + ((x - xmin) * width) / (xmax - xmin));
	const py = value => number(y + ((ymax - value) * height) / (ymax - ymin));
	const clip = `plot-${++panelSequence}`;
	let body = `<g data-bounds="${bounds.join(",")}" data-viewport="${left},${y},${width},${height}">`;
	body += text(360, top + 35, title, 27, "#0f172a", "middle");
	curves.forEach((curve, index) => {
		body += text(
			80 + (index % 2) * 300,
			top + 68 + Math.floor(index / 2) * 29,
			curve.label,
			21,
			curve.color ?? colors[index]
		);
	});
	body += `<defs><clipPath id="${clip}"><rect x="${left}" y="${y}" width="${width}" height="${height}"/></clipPath></defs>`;
	for (const tick of ticks[0]) {
		const [x, label] = Array.isArray(tick) ? tick : [tick, tick];
		body += line(px(x), y, px(x), y + height);
		body += text(px(x), y + height + 27, label, 20, "#475569", "middle");
	}
	for (const tick of ticks[1]) {
		const [value, label] = Array.isArray(tick) ? tick : [tick, tick];
		body += line(left, py(value), left + width, py(value));
		body += text(left - 12, py(value) + 7, label, 20, "#475569", "end");
	}
	if (xmin <= 0 && xmax >= 0)
		body += line(px(0), y, px(0), y + height, "#334155");
	if (ymin <= 0 && ymax >= 0)
		body += line(left, py(0), left + width, py(0), "#334155");
	body += text(
		left + width + 15,
		py(Math.max(ymin, Math.min(ymax, 0))) + 7,
		xLabel,
		21
	);
	body += text(px(Math.max(xmin, Math.min(xmax, 0))) + 10, y - 7, yLabel, 21);
	body += `<g clip-path="url(#${clip})">`;
	for (const guide of guides) {
		body +=
			guide.axis === "x"
				? line(
						px(guide.value),
						y,
						px(guide.value),
						y + height,
						"#64748b",
						true
					)
				: line(
						left,
						py(guide.value),
						left + width,
						py(guide.value),
						"#64748b",
						true
					);
	}
	curves.forEach((curve, index) => {
		const segments = curve.points
			? [curve.points]
			: curve.domains.map(([a, b]) =>
					Array.from({ length: 161 }, (_, i) => {
						const x = a + ((b - a) * i) / 160;
						return [x, curve.fn(x)];
					})
				);
		for (const segment of segments) {
			if (
				!segment.every(
					([x, value]) => Number.isFinite(x) && Number.isFinite(value)
				)
			) {
				throw new Error(curve.id);
			}
			if (curve.discrete) {
				for (const [x, value] of segment)
					body += `<circle data-equation="${curve.id}" cx="${px(x)}" cy="${py(value)}" r="5" fill="${curve.color ?? colors[index]}"/>`;
				continue;
			}
			body += `<polyline data-equation="${curve.id}" points="${segment.map(([x, value]) => `${px(x)},${py(value)}`).join(" ")}" stroke="${curve.color ?? colors[index]}" stroke-width="3" fill="none"/>`;
		}
	});
	for (const point of points)
		body += `<circle data-coordinate="${point.x},${point.y}" cx="${px(point.x)}" cy="${py(point.y)}" r="6" fill="${point.open ? "white" : (point.color ?? "#0f172a")}" stroke="${point.color ?? "#0f172a"}" stroke-width="2.5"/>`;
	body += "</g>";
	for (const point of points) {
		if (point.label) {
			body += text(
				px(point.x) + (point.dx ?? 10),
				py(point.y) + (point.dy ?? -12),
				point.label,
				20,
				point.color ?? "#0f172a",
				point.anchor ?? "start"
			);
		}
	}
	if (note) {
		const words = note.split(" ");
		const rows = [""];
		for (const word of words) {
			if (`${rows.at(-1)} ${word}`.length > 60) rows.push("");
			rows[rows.length - 1] += (rows.at(-1) ? " " : "") + word;
		}
		rows.forEach((row, i) => {
			body += text(
				360,
				y + height + 56 + i * 25,
				row,
				21,
				"#334155",
				"middle"
			);
		});
	}
	return `${body}</g>`;
}

function figure(course, filename, title, description, panels) {
	panelSequence = 0;
	const height = 105 + panels.length * 510;
	const content = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="720" height="${height}" viewBox="0 0 720 ${height}" role="img" aria-labelledby="title description" fill="none"><title id="title">${escape(title)}</title><desc id="description">${escape(description)}</desc><rect width="720" height="${height}" fill="white"/><g font-family="Arial, sans-serif">${text(360, 48, title, 30, "#0f172a", "middle")}${panels.map((panel, i) => plot(panel, 80 + i * 510)).join("")}</g></svg>\n`;
	const path = `${output}${course}/${filename}-v2.svg`;
	if (process.argv.includes("--check")) {
		if (readFileSync(path, "utf8") !== content)
			throw new Error(`Regenerate ${path}`);
	} else {
		mkdirSync(`${output}${course}`, { recursive: true });
		writeFileSync(path, content);
	}
}

const curve = (id, label, fn, domains) => ({ id, label, fn, domains });
function quadratic(id, label, a = 1) {
	return curve(id, label, x => a * x * x, [[-4, 4]]);
}
const common = {
	bounds: [-4, 4, -1, 9],
	ticks: [
		[-4, -2, 0, 2, 4],
		[0, 2, 4, 6, 8]
	]
};
figure(
	"algebra-2a",
	"quadratic-forms",
	"Quadratic forms",
	"Positive quadratic functions share the origin as their vertex. The second graph marks both roots and the vertex of one equivalent-form example.",
	[
		{
			...common,
			title: "Parent and vertical scale",
			curves: [
				quadratic("x2", "y = x²"),
				quadratic("2x2", "y = 2x²", 2),
				quadratic("quarter-x2", "y = x²/4", 0.25)
			],
			points: [{ x: 0, y: 0 }],
			note: "All three vertices are (0, 0); positive curves open upward."
		},
		{
			title: "Vertex and intercept forms",
			bounds: [-6, 2, -10, 8],
			ticks: [
				[-6, -5, -2, 0, 1, 2],
				[-9, -6, -3, 0, 3, 6]
			],
			curves: [
				curve(
					"vertex-quadratic",
					"y = (x + 2)² − 9 = (x + 5)(x − 1)",
					x => (x + 2) ** 2 - 9,
					[[-6, 2]]
				)
			],
			points: [
				{ x: -5, y: 0, label: "(−5, 0)", dy: -14 },
				{ x: 1, y: 0, label: "(1, 0)", anchor: "end", dx: -8 },
				{ x: -2, y: -9, label: "(−2, −9)", dy: -15 }
			]
		}
	]
);
figure(
	"algebra-2a",
	"quadratic-transformations",
	"Quadratic transformations",
	"Exact sampled curves show reflection, translation and vertical scaling, with vertices marked on the curves.",
	[
		{
			title: "Reflection across the x-axis",
			bounds: [-3, 3, -9, 9],
			ticks: [
				[-3, -2, -1, 0, 1, 2, 3],
				[-8, -4, 0, 4, 8]
			],
			curves: [
				quadratic("x2", "y = x²"),
				quadratic("negative-x2", "y = −x²", -1)
			],
			points: [{ x: 0, y: 0 }]
		},
		{
			title: "Right 3 and up 4",
			bounds: [-2, 6, -1, 14],
			ticks: [
				[-2, 0, 2, 3, 4, 6],
				[0, 4, 8, 12]
			],
			curves: [
				quadratic("x2", "y = x²"),
				curve(
					"translated-quadratic",
					"y = (x − 3)² + 4",
					x => (x - 3) ** 2 + 4,
					[[-2, 6]]
				)
			],
			points: [
				{ x: 0, y: 0, label: "(0, 0)" },
				{ x: 3, y: 4, label: "(3, 4)" }
			]
		},
		{
			...common,
			title: "Vertical scaling",
			curves: [
				quadratic("x2", "y = x²"),
				quadratic("2x2", "y = 2x²", 2),
				quadratic("half-x2", "y = x²/2", 0.5)
			],
			points: [{ x: 0, y: 0 }],
			note: "Scaling changes width while the vertex stays fixed."
		}
	]
);
figure(
	"algebra-2a",
	"polynomial-behavior",
	"Polynomial graph features",
	"Odd and even leading terms have the stated end behavior. A factored cubic crosses at a simple zero and touches at its double zero.",
	[
		{
			title: "Odd degree",
			bounds: [-3, 3, -9, 9],
			ticks: [
				[-3, -2, -1, 0, 1, 2, 3],
				[-8, -4, 0, 4, 8]
			],
			curves: [
				curve(
					"positive-cubic",
					"Positive leading term: y = x³/4",
					x => x ** 3 / 4,
					[[-3, 3]]
				),
				curve(
					"negative-cubic",
					"Negative: y = −x³/4",
					x => -(x ** 3) / 4,
					[[-3, 3]]
				)
			]
		},
		{
			title: "Even degree",
			bounds: [-3, 3, -9, 9],
			ticks: [
				[-3, -2, -1, 0, 1, 2, 3],
				[-8, -4, 0, 4, 8]
			],
			curves: [
				quadratic("x2", "Positive leading term: y = x²"),
				quadratic("negative-x2", "Negative: y = −x²", -1)
			]
		},
		{
			title: "Zero multiplicity",
			bounds: [-2, 2.5, -4, 4],
			ticks: [
				[-2, -1, 0, 1, 2],
				[-4, -2, 0, 2, 4]
			],
			curves: [
				curve(
					"multiplicity-cubic",
					"y = (x + 1)(x − 1)²",
					x => (x + 1) * (x - 1) ** 2,
					[[-2, 2.5]]
				)
			],
			points: [
				{ x: -1, y: 0, label: "crosses: −1" },
				{ x: 1, y: 0, label: "touches: 1" }
			]
		}
	]
);
figure(
	"algebra-2a",
	"rational-functions",
	"Rational graph features",
	"Each graph is calculated from its equation. Original exclusions distinguish holes from vertical asymptotes; dashed lines mark asymptotes.",
	[
		{
			title: "Reciprocal parent",
			bounds: [-4, 4, -4, 4],
			ticks: [
				[-4, -2, 0, 2, 4],
				[-4, -2, 0, 2, 4]
			],
			curves: [
				curve("reciprocal", "y = 1/x; x ≠ 0", x => 1 / x, [
					[-4, -0.05],
					[0.05, 4]
				])
			],
			guides: [
				{ axis: "x", value: 0 },
				{ axis: "y", value: 0 }
			]
		},
		{
			title: "Hole and vertical asymptote",
			bounds: [-4, 8, -4, 5],
			ticks: [
				[-4, -1, 0, 2, 4, 6, 8],
				[-4, -2, 0, 1, 3, 5]
			],
			curves: [
				curve(
					"rational-hole",
					"y = (x² − 1)/(x² − 3x − 4)",
					x => (x - 1) / (x - 4),
					[
						[-4, 3.95],
						[4.05, 8]
					]
				)
			],
			points: [
				{
					x: -1,
					y: 0.4,
					open: true,
					label: "hole (−1, 2/5)",
					dx: -10,
					dy: -20,
					anchor: "end"
				},
				{ x: 1, y: 0 }
			],
			guides: [
				{ axis: "x", value: 4 },
				{ axis: "y", value: 1 }
			],
			note: "Original exclusions: −1 and 4; asymptotes: x = 4, y = 1."
		},
		{
			title: "Slant asymptote",
			bounds: [-4, 6, -6, 8],
			ticks: [
				[-4, -2, 0, 1, 2, 4, 6],
				[-6, -3, 0, 3, 6]
			],
			curves: [
				curve(
					"rational-slant",
					"y = (x² + 1)/(x − 1)",
					x => (x * x + 1) / (x - 1),
					[
						[-4, 0.95],
						[1.05, 6]
					]
				),
				curve("slant-line", "Slant line: y = x + 1", x => x + 1, [
					[-4, 6]
				])
			],
			guides: [{ axis: "x", value: 1 }],
			note: "Vertical asymptote x = 1; no real zeros."
		}
	]
);
figure(
	"algebra-2a",
	"radical-functions",
	"Radical functions",
	"Square roots begin at their domain boundary and bend downward. The real cube-root graph passes through the origin and accepts negative inputs.",
	[
		{
			title: "Square-root parent",
			bounds: [-1, 9, -1, 4],
			ticks: [
				[0, 1, 4, 9],
				[0, 1, 2, 3, 4]
			],
			curves: [curve("square-root", "y = √x", Math.sqrt, [[0, 9]])],
			points: [
				{ x: 0, y: 0 },
				{ x: 1, y: 1 },
				{ x: 4, y: 2 },
				{ x: 9, y: 3 }
			],
			note: "Domain x ≥ 0; range y ≥ 0."
		},
		{
			title: "Translated square root",
			bounds: [-1, 12, -1, 6],
			ticks: [
				[0, 3, 4, 7, 12],
				[0, 2, 3, 4, 5, 6]
			],
			curves: [
				curve(
					"translated-root",
					"y = √(x − 3) + 2",
					x => Math.sqrt(x - 3) + 2,
					[[3, 12]]
				)
			],
			points: [{ x: 3, y: 2, label: "start (3, 2)" }],
			note: "Domain x ≥ 3; range y ≥ 2."
		},
		{
			title: "Real cube root",
			bounds: [-8, 8, -3, 3],
			ticks: [
				[-8, -1, 0, 1, 8],
				[-2, -1, 0, 1, 2]
			],
			curves: [
				{
					id: "cube-root",
					label: "y = ∛x",
					points: Array.from({ length: 161 }, (_, i) => {
						const y = -2 + i / 40;
						return [y ** 3, y];
					})
				}
			],
			points: [
				{ x: -8, y: -2 },
				{ x: 0, y: 0 },
				{ x: 8, y: 2 }
			],
			note: "Domain and range: all real numbers."
		}
	]
);
const floorPoints = [];
const floorCurves = [];
for (let n = -3; n <= 3; n++) {
	floorCurves.push({
		id: "floor",
		label: "",
		points: [
			[n, n],
			[n + 1, n]
		],
		color: colors[0]
	});
	floorPoints.push(
		{ x: n, y: n, color: colors[0] },
		{ x: n + 1, y: n, open: true, color: colors[0] }
	);
}
figure(
	"algebra-2a",
	"piecewise-functions",
	"Piecewise functions",
	"Rules select the correct interval before evaluation. Open and filled markers distinguish excluded and included endpoints; floor steps include the left endpoint.",
	[
		{
			title: "Two linear rules",
			bounds: [-3, 2, -5, 7],
			ticks: [
				[-3, -2, -1, 0, 1, 2],
				[-4, -1, 0, 3, 6]
			],
			curves: [
				curve("piecewise-left", "y = x − 1 for x < 0", x => x - 1, [
					[-3, 0]
				]),
				curve("piecewise-right", "y = 3x for x ≥ 0", x => 3 * x, [
					[0, 2]
				])
			],
			points: [
				{ x: 0, y: -1, open: true, label: "excluded (0, −1)", dy: 25 },
				{ x: 0, y: 0, label: "included (0, 0)" }
			]
		},
		{
			title: "Floor: y = ⌊x⌋",
			bounds: [-3.3, 4.3, -3.5, 3.5],
			ticks: [
				[-3, -2, -1, 0, 1, 2, 3, 4],
				[-3, -2, -1, 0, 1, 2, 3]
			],
			curves: floorCurves,
			points: floorPoints,
			note: "For each integer n, floor(x) = n on [n, n + 1)."
		},
		{
			title: "Absolute value",
			bounds: [-3, 3, -1, 4],
			ticks: [
				[-3, -2, -1, 0, 1, 2, 3],
				[0, 1, 2, 3, 4]
			],
			curves: [curve("absolute-value", "y = |x|", Math.abs, [[-3, 3]])],
			points: [{ x: 0, y: 0 }],
			note: "Use −x for x < 0 and x for x ≥ 0."
		}
	]
);
figure(
	"algebra-2b",
	"exp-log-families",
	"Exponential and logarithmic graphs",
	"Parent exponentials meet at zero input and output one. Logarithms have their correct vertical asymptotes and original argument restrictions.",
	[
		{
			title: "Exponential families",
			bounds: [-3, 3, -1, 9],
			ticks: [
				[-3, -2, -1, 0, 1, 2, 3],
				[0, 1, 2, 4, 8]
			],
			curves: [
				curve("exp-two", "y = 2ˣ", x => 2 ** x, [[-3, 3]]),
				curve("exp-half", "y = (1/2)ˣ", x => 0.5 ** x, [[-3, 3]]),
				curve("exp-shift", "y = 2^(x + 1)", x => 2 ** (x + 1), [
					[-3, 3]
				])
			],
			points: [
				{ x: 0, y: 1, label: "(0, 1)", anchor: "end", dx: -10 },
				{ x: 0, y: 2, label: "(0, 2)", dy: -15 }
			],
			guides: [{ axis: "y", value: 0 }],
			note: "All have domain ℝ, positive range and asymptote y = 0."
		},
		{
			title: "Logarithmic families",
			bounds: [-1, 6, -4, 5],
			ticks: [
				[0, 1, 2, 4, 6],
				[-4, -2, 0, 2, 4]
			],
			curves: [
				curve("log-two", "y = log₂(x)", Math.log2, [[0.02, 6]]),
				curve("log-half", "y = log₁/₂(x)", x => -Math.log2(x), [
					[0.02, 6]
				]),
				curve(
					"log-shift",
					"y = log₁₀(x − 1) + 3",
					x => Math.log10(x - 1) + 3,
					[[1.001, 6]]
				)
			],
			points: [{ x: 1, y: 0, label: "(1, 0)" }],
			guides: [
				{ axis: "x", value: 0 },
				{ axis: "x", value: 1 }
			],
			note: "Parent domains x > 0; shifted log domain x > 1."
		}
	]
);
const anglePoints = [60, 150, 315].map((angle, index) => ({
	x: Math.cos((angle * Math.PI) / 180),
	y: Math.sin((angle * Math.PI) / 180),
	color: colors[index],
	label: `${angle}°`,
	dx: angle === 150 ? -12 : 12,
	anchor: angle === 150 ? "end" : "start"
}));
figure(
	"algebra-2b",
	"unit-circle-trig",
	"Unit circle and right triangles",
	"The marked sixty-degree point is one half, square root of three over two. The right triangle chooses theta at the origin, with opposite side ten and adjacent side twenty-four.",
	[
		{
			title: "Coordinates are (cos θ, sin θ)",
			bounds: [-1.4, 1.4, -1.4, 1.4],
			ticks: [
				[-1, 0, 1],
				[-1, 0, 1]
			],
			square: true,
			curves: [
				{
					id: "unit-circle",
					label: "Positive angles turn counterclockwise",
					points: Array.from({ length: 241 }, (_, i) => {
						const t = (2 * Math.PI * i) / 240;
						return [Math.cos(t), Math.sin(t)];
					})
				}
			],
			points: anglePoints,
			note: "60° → (1/2, √3/2); 150° → (−√3/2, 1/2)."
		},
		{
			title: "Right triangle: θ at O",
			bounds: [-2, 28, -3, 13],
			ticks: [
				[0, 8, 16, 24],
				[0, 5, 10]
			],
			curves: [
				{
					id: "right-triangle",
					label: "OA = 24; AB = 10; OB = 26",
					points: [
						[0, 0],
						[24, 0],
						[24, 10],
						[0, 0]
					]
				}
			],
			points: [
				{ x: 0, y: 0, label: "O: θ", dx: -8, dy: -15 },
				{ x: 24, y: 0, label: "A", dy: 25 },
				{ x: 24, y: 10, label: "B" }
			],
			note: "sin θ = 5/13; cos θ = 12/13; tan θ = 5/12."
		}
	]
);

figure(
	"algebra-2a",
	"complex-plane",
	"Complex numbers and geometry",
	"Complex numbers are points with real and imaginary coordinates. The distance example joins two minus four i to seven plus three i. The right triangle has vertices minus three minus two i, five plus four i and five minus two i.",
	[
		{
			title: "Plot a + bi at (a, b)",
			bounds: [-5, 5, -5, 5],
			ticks: [
				[-4, -2, 0, 2, 4],
				[-4, -2, 0, 2, 4]
			],
			square: true,
			xLabel: "Re",
			yLabel: "Im",
			points: [
				{ x: 3, y: 2, label: "3 + 2i" },
				{ x: -2, y: -4, label: "−2 − 4i", dx: -10, anchor: "end" },
				{ x: 2, y: -1, label: "2 − i" },
				{ x: 4, y: 0, label: "4" },
				{ x: 0, y: -3, label: "−3i", dx: 10, dy: 22 },
				{ x: 1, y: 4, label: "1 + 4i" }
			],
			note: "Real part = horizontal coordinate; imaginary part = vertical."
		},
		{
			title: "Distance on the complex plane",
			bounds: [0, 10, -5, 5],
			ticks: [
				[0, 2, 4, 6, 8, 10],
				[-4, -2, 0, 2, 4]
			],
			square: true,
			xLabel: "Re",
			yLabel: "Im",
			curves: [
				curve(
					"complex-distance",
					"From 2 − 4i to 7 + 3i",
					x => (7 * x) / 5 - 34 / 5,
					[[2, 7]]
				)
			],
			points: [
				{ x: 2, y: -4, label: "2 − 4i", dx: -10, anchor: "end" },
				{ x: 7, y: 3, label: "7 + 3i" }
			],
			note: "Changes (5, 7) give distance √(5² + 7²) = √74."
		},
		{
			title: "A right triangle with area 24",
			bounds: [-4, 6, -4, 6],
			ticks: [
				[-3, 0, 2, 5],
				[-2, 0, 2, 4]
			],
			square: true,
			xLabel: "Re",
			yLabel: "Im",
			curves: [
				{
					id: "area-triangle",
					label: "Vertices: (−3, −2), (5, 4), (5, −2)",
					points: [
						[-3, -2],
						[5, 4],
						[5, -2],
						[-3, -2]
					]
				}
			],
			points: [
				{ x: -3, y: -2, label: "−3 − 2i", dx: -10, anchor: "end" },
				{ x: 5, y: 4, label: "5 + 4i", dx: -10, anchor: "end" },
				{ x: 5, y: -2, label: "5 − 2i", dx: -10, dy: 24, anchor: "end" }
			],
			note: "Perpendicular base 8 and height 6 give area 8 × 6 / 2 = 24."
		}
	]
);
const discrete = (id, label, points) => ({ id, label, points, discrete: true });
figure(
	"algebra-2b",
	"arithmetic-sequences",
	"Arithmetic sequences and sums",
	"Sequence indices are positive integers with equal spacing. The first sequence begins with four at index one. The sum example totals ten through one hundred.",
	[
		{
			title: "One term at a time",
			bounds: [0, 6, 0, 18],
			ticks: [
				[0, 1, 2, 3, 4, 5, 6],
				[0, 4, 8, 12, 16]
			],
			xLabel: "n",
			yLabel: "aₙ",
			curves: [
				discrete(
					"arithmetic-terms",
					"aₙ = 4 + 3(n − 1)",
					[1, 2, 3, 4, 5].map(n => [n, 4 + 3 * (n - 1)])
				)
			],
			note: "The terms 4, 7, 10, 13, 16 have common difference 3."
		},
		{
			title: "10 + 20 + … + 100",
			bounds: [0, 11, 0, 600],
			ticks: [
				[0, 2, 4, 6, 8, 10],
				[0, 100, 200, 300, 400, 500, 600]
			],
			xLabel: "n",
			yLabel: "Sₙ",
			curves: [
				discrete(
					"arithmetic-sums",
					"Sₙ = n(10 + 10n) / 2",
					[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => [
						n,
						5 * n * (n + 1)
					])
				)
			],
			note: "Five first-and-last pairs of 110 give S₁₀ = 550."
		}
	]
);
figure(
	"algebra-2b",
	"geometric-sequences",
	"Geometric sequences and sums",
	"The term index increases by one at each plotted point and each term is three times the previous term. The partial sums of successive halves approach one from below.",
	[
		{
			title: "Repeated multiplication",
			bounds: [0, 6, 0, 90],
			ticks: [
				[0, 1, 2, 3, 4, 5, 6],
				[0, 20, 40, 60, 80]
			],
			xLabel: "n",
			yLabel: "aₙ",
			curves: [
				discrete(
					"geometric-terms",
					"aₙ = 3^(n − 1)",
					[1, 2, 3, 4, 5].map(n => [n, 3 ** (n - 1)])
				)
			],
			note: "The terms 1, 3, 9, 27, 81 have common ratio 3."
		},
		{
			title: "1/2 + 1/4 + 1/8 + …",
			bounds: [0, 9, 0, 1.1],
			ticks: [
				[0, 1, 2, 3, 4, 5, 6, 7, 8],
				[
					[0, "0"],
					[0.5, "1/2"],
					[1, "1"]
				]
			],
			xLabel: "n",
			yLabel: "Sₙ",
			curves: [
				discrete(
					"geometric-sums",
					"Sₙ = 1 − (1/2)ⁿ",
					[1, 2, 3, 4, 5, 6, 7, 8].map(n => [n, 1 - 0.5 ** n])
				)
			],
			guides: [{ axis: "y", value: 1 }],
			note: "Every finite sum is below 1; the infinite series has sum 1."
		}
	]
);
figure(
	"algebra-2b",
	"statistics-regression",
	"Correlation and regression",
	"The plotted observations are the complete datasets listed in the course. The fitted line uses ordinary least squares with an intercept. Nonlinear dependence can have zero Pearson correlation.",
	[
		{
			title: "A fitted line with an intercept",
			bounds: [0, 5, 0, 6],
			ticks: [
				[0, 1, 2, 3, 4, 5],
				[0, 1, 2, 3, 4, 5, 6]
			],
			curves: [
				discrete("regression-data", "Observed pairs", [
					[1, 2],
					[2, 4],
					[3, 3],
					[4, 5]
				]),
				curve("regression-line", "ŷ = 0.8x + 1.5", x => 0.8 * x + 1.5, [
					[0, 5]
				])
			],
			note: "For these four pairs, r = 0.8 and R² = 0.64."
		},
		{
			title: "Zero linear correlation, visible pattern",
			bounds: [-2.5, 2.5, -0.5, 5],
			ticks: [
				[-2, -1, 0, 1, 2],
				[0, 1, 2, 3, 4, 5]
			],
			curves: [
				discrete("nonlinear-data", "Observed pairs", [
					[-2, 4],
					[-1, 1],
					[0, 0],
					[1, 1],
					[2, 4]
				]),
				curve("x2", "y = x²", x => x * x, [[-2, 2]])
			],
			note: "Pearson r = 0; the nonlinear relationship is still visible."
		},
		{
			title: "Strong negative association",
			bounds: [2, 11, 0, 11],
			ticks: [
				[3, 5, 7, 9, 10],
				[0, 2, 4, 6, 8, 10]
			],
			curves: [
				discrete(
					"negative-data",
					"(3,10), (5,9), (8,8), (9,5), (10,3)",
					[
						[3, 10],
						[5, 9],
						[8, 8],
						[9, 5],
						[10, 3]
					]
				)
			],
			note: "r = −31/34 ≈ −0.912. Association does not establish cause."
		}
	]
);
const piTicks = [
	[0, "0"],
	[Math.PI / 2, "π/2"],
	[Math.PI, "π"],
	[(3 * Math.PI) / 2, "3π/2"],
	[2 * Math.PI, "2π"]
];
figure(
	"algebra-2b",
	"trig-graphs",
	"Sine, cosine and tangent",
	"Sine and cosine complete a full cycle from zero through two pi. Tangent has separate branches divided by its vertical asymptotes; no line joins across an undefined input.",
	[
		{
			title: "Sine over one complete cycle",
			bounds: [0, 2 * Math.PI, -1.3, 1.3],
			ticks: [piTicks, [-1, 0, 1]],
			curves: [curve("sine", "y = sin(x)", Math.sin, [[0, 2 * Math.PI]])],
			points: [
				{ x: 0, y: 0 },
				{ x: Math.PI / 2, y: 1 },
				{ x: Math.PI, y: 0 },
				{ x: (3 * Math.PI) / 2, y: -1 },
				{ x: 2 * Math.PI, y: 0 }
			],
			note: "Amplitude 1; period 2π; midline y = 0."
		},
		{
			title: "Cosine over one complete cycle",
			bounds: [0, 2 * Math.PI, -1.3, 1.3],
			ticks: [piTicks, [-1, 0, 1]],
			curves: [
				curve("cosine", "y = cos(x)", Math.cos, [[0, 2 * Math.PI]])
			],
			points: [
				{ x: 0, y: 1 },
				{ x: Math.PI / 2, y: 0 },
				{ x: Math.PI, y: -1 },
				{ x: (3 * Math.PI) / 2, y: 0 },
				{ x: 2 * Math.PI, y: 1 }
			],
			note: "Amplitude 1; period 2π; midline y = 0."
		},
		{
			title: "Tangent and its asymptotes",
			bounds: [-Math.PI, Math.PI, -4, 4],
			ticks: [
				[
					[-Math.PI, "−π"],
					[-Math.PI / 2, "−π/2"],
					[0, "0"],
					[Math.PI / 2, "π/2"],
					[Math.PI, "π"]
				],
				[-4, -2, 0, 2, 4]
			],
			curves: [
				curve("tangent", "y = tan(x)", Math.tan, [
					[-Math.PI, -Math.PI / 2 - 0.02],
					[-Math.PI / 2 + 0.02, Math.PI / 2 - 0.02],
					[Math.PI / 2 + 0.02, Math.PI]
				])
			],
			guides: [
				{ axis: "x", value: -Math.PI / 2 },
				{ axis: "x", value: Math.PI / 2 }
			],
			points: [
				{ x: -Math.PI, y: 0 },
				{ x: 0, y: 0 },
				{ x: Math.PI, y: 0 }
			],
			note: "Period π; asymptotes x = π/2 + kπ for integer k."
		}
	]
);
