import type { RawCourse } from "./types";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";

const MARCO_GRAPH = "pab5_0.png";
const UBER_ROUTE = "pab14_0.png";
const ESMASH_MODEL = "pab22_0.png";

function lesson(title: string, content: string, mediaLink?: string) {
	return mediaLink ? { title, content, mediaLink } : { title, content };
}

function module(
	title: string,
	curriculum: ReturnType<typeof lesson>[],
	supplementalProjects: ReturnType<typeof lesson>[] = []
) {
	return {
		title,
		curriculum,
		supplementalProjects
	};
}

function overview({
	check,
	concepts,
	practice,
	title
}: {
	check: string;
	concepts: string[];
	practice: string;
	title: string;
}) {
	return [
		`**Concept path:** ${title}`,
		`**Core ideas:**\n${concepts.map(concept => `- ${concept}`).join("\n")}`,
		`**Practice model:** ${practice}`,
		`**Evidence check:** ${check}`
	].join("\n\n");
}

function project({
	evidence,
	goal,
	steps,
	title
}: {
	evidence: string;
	goal: string;
	steps: string[];
	title: string;
}) {
	return [
		`**Project goal:** ${goal}`,
		`**Work path:**\n${steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**Evidence of completion:** ${evidence}`,
		`**Source project:** ${title}`
	].join("\n\n");
}

export const preAlgebraBCourse: RawCourse = {
	name: "Pre-Algebra B",
	modules: [
		module("Pre-Algebra B Kick-Off", [
			lesson(
				"Course Map and Readiness Check",
				[
					"Pre-Algebra B connects data analysis, geometry, factors, counting, probability, and applied modeling. The course works best when each calculation is tied to a diagram, graph, table, or real situation.",
					"The kickoff functions as a readiness map. A useful sample includes one data summary, one angle or shape classification, one factor or multiple calculation, and one probability or counting explanation.",
					"Readiness evidence can include a labeled graph, a short written explanation, a diagram with measurements, and one corrected error showing why the revised method works."
				].join("\n\n")
			),
			lesson(
				"Project: Pre-Algebra B Readiness Map",
				project({
					title: "Pre-Algebra B Kick-Off Project",
					goal: "Create a compact map of the major course strands: statistics, graphing, geometry, factors, probability, and applied modeling.",
					steps: [
						"Choose one small dataset and report range, median, mode, and mean.",
						"Sketch or describe two lines or paths and classify their relationship as parallel, perpendicular, intersecting, or collinear where appropriate.",
						"Identify one two-dimensional shape and one three-dimensional shape, then name the measurement questions each shape supports.",
						"Choose one large population or quantity and list useful factors, multiples, or divisibility observations.",
						"Write one probability question and explain the sample space."
					],
					evidence:
						"The readiness map includes a data table, a geometric diagram, a factor or multiple list, and one probability statement with a clear denominator."
				})
			)
		]),
		module(
			"PAB1-PAB5 Data, Averages, and Graphs",
			[
				lesson(
					"Range, Median, Mode, and Mean",
					overview({
						title: "Statistics summarize a dataset from different viewpoints: spread, center, frequency, and balance point.",
						concepts: [
							"Range measures spread by subtracting the minimum value from the maximum value.",
							"Median is the middle value after data is ordered; with an even number of values, the two middle values are averaged.",
							"Mode is the most frequent value and may be absent or repeated across multiple values.",
							"Mean is the arithmetic average: total divided by number of values. It is sensitive to very large or very small values."
						],
						practice:
							"Sort the dataset first, then calculate each summary statistic and write one sentence explaining what that statistic reveals.",
						check: "A complete response distinguishes center from spread and explains which statistic best fits the question."
					})
				),
				lesson(
					"Single-Variable and Multivariable Graphs",
					overview({
						title: "Graphs turn data into visual evidence, but the graph type must match the question being asked.",
						concepts: [
							"Single-variable graphs show one quantity, such as a list of ages, scores, distances, or counts.",
							"Multivariable graphs compare two or more quantities, such as age versus income, distance versus time, or category versus count.",
							"Axis labels, scale choices, and units control whether a graph can be interpreted reliably.",
							"Outliers and clusters can change which statistic or model is most useful."
						],
						practice:
							"Create a table, choose a graph type, label axes and units, then write one interpretation that is directly supported by the visual evidence.",
						check: "A complete graph has a title, units, readable scale, and a statement that does not claim more than the data shows."
					})
				)
			],
			[
				lesson(
					"Project: Exploring the World with Marco",
					[
						project({
							title: "PAB5 Module Project: Exploring the World with Marco",
							goal: "Use data summaries and graphs to support an advertising or audience recommendation.",
							steps: [
								"Choose a real or fictional audience question, such as which platform or age range to prioritize.",
								"Collect or use a small dataset with at least 20 values or records.",
								"Calculate range, median, mode, and mean where those statistics make sense.",
								"Create at least one graph that makes a pattern visible.",
								"Write a recommendation that names the evidence and one limitation of the data."
							],
							evidence:
								"The recommendation includes a dataset, at least two summary statistics, a graph, and a limitation note explaining what the data cannot prove by itself."
						}),
						pendingStaticMediaNotice(MARCO_GRAPH)
					].join("\n\n"),
					staticMediaUrl(MARCO_GRAPH)
				),
				lesson(
					"Supplemental Project 1: Data Summary Error Repair",
					project({
						title: "PAB1-PAB5 Data Review",
						goal: "Repair a flawed data summary by checking ordering, totals, graph labels, and the statistic chosen for the question.",
						steps: [
							"Create or use a 10-15 value dataset with one repeated value and one possible outlier.",
							"Write a flawed range, median, mode, mean, or graph interpretation.",
							"Mark the first incorrect step and explain whether the issue is ordering, arithmetic, labels, scale, or overclaiming.",
							"Redo the summary and write one sentence explaining which statistic best fits the question."
						],
						evidence:
							"The repair includes the flawed work, the corrected statistic or graph statement, and a one-sentence explanation of why the correction is more reliable."
					})
				)
			]
		),
		module(
			"Check-In #1: Pre-Algebra B Data and Graphing",
			[
				lesson(
					"Data and Graphing Readiness Check",
					[
						"Check-In #1 reviews range, median, mode, mean, graph choice, graph labeling, and data interpretation. The check is strongest when the same dataset is summarized numerically and visually.",
						"Useful evidence includes an ordered list, a summary-statistics table, a graph with units, and a written conclusion that uses evidence without overclaiming.",
						"If a result looks surprising, the first review target is usually sorting, denominator count, graph scale, or whether the statistic matches the question."
					].join("\n\n")
				)
			],
			[
				lesson(
					"Supplemental Project 1: Graph Choice Defense",
					project({
						title: "Check-In #1 Data Transfer",
						goal: "Choose between two graph types for the same dataset and defend which one answers the question more clearly.",
						steps: [
							"Start from one dataset with categories or paired numerical values.",
							"Sketch two possible displays, such as a bar graph and a scatter plot.",
							"State what each graph reveals and what each graph hides.",
							"Choose the stronger graph for the question and justify the choice with labels, scale, and evidence."
						],
						evidence:
							"The defense names the question, compares two graph choices, and explains why the selected graph supports the conclusion."
					})
				),
				lesson(
					"Supplemental Project 2: Statistic Selection Check",
					project({
						title: "Check-In #1 Statistic Review",
						goal: "Decide whether range, median, mode, or mean is the best statistic for three different questions.",
						steps: [
							"Create three short questions about the same dataset: spread, typical value, and repeated value.",
							"Calculate the relevant statistic for each question.",
							"Explain why another statistic would be weaker for at least one question.",
							"Add one changed value and describe which statistic changes the most."
						],
						evidence:
							"The check includes three statistics, three question matches, and one changed-value comparison."
					})
				)
			]
		),
		module(
			"PAB6-PAB9 Lines, Angles, Triangles, and Similarity",
			[
				lesson(
					"Points, Lines, Angles, and Triangle Relationships",
					overview({
						title: "Geometry begins by naming relationships precisely: points locate positions, lines connect positions, and angles measure turns.",
						concepts: [
							"Collinear points lie on the same line.",
							"Parallel lines never meet in a plane, while perpendicular lines meet at right angles.",
							"Acute angles are less than 90 degrees, right angles are exactly 90 degrees, and obtuse angles are greater than 90 degrees but less than 180 degrees.",
							"The Pythagorean theorem connects the side lengths of right triangles: a squared plus b squared equals c squared, where c is the hypotenuse."
						],
						practice:
							"Draw the diagram first, label known quantities, identify the relationship, then choose the calculation that matches the diagram.",
						check: "A complete response identifies the geometric relationship before calculating and labels the final value with the correct unit."
					})
				),
				lesson(
					"Congruence, Similarity, and Scale",
					overview({
						title: "Congruent figures match in shape and size, while similar figures match in shape but may differ by a scale factor.",
						concepts: [
							"Congruent figures have matching side lengths and matching angle measures.",
							"Similar figures have proportional side lengths and matching angle measures.",
							"A scale factor compares corresponding side lengths.",
							"Similarity can be used to find missing side lengths when the proportional relationship is known."
						],
						practice:
							"Pair corresponding sides, write a proportion, solve the missing value, and check whether the scale factor is consistent.",
						check: "A correct similarity response names corresponding sides and verifies that the same scale factor works across the figure."
					})
				)
			],
			[
				lesson(
					"Project: Gymnastics Geometry Challenge",
					project({
						title: "PAB9 Module Project: How Many Flips Does It Take To Win?",
						goal: "Analyze gymnastics routines using angle classification, circular motion, triangle reasoning, similarity, and distance requirements.",
						steps: [
							"Classify turns or rotations using angle vocabulary.",
							"Use side lengths or proportional relationships to compare similar quadrilaterals.",
							"Read a graph of vertical and diagonal distance, then decide whether the horizontal-distance requirement is met.",
							"Use right-triangle reasoning when horizontal, vertical, and diagonal measurements form a right triangle.",
							"Write a final judging explanation supported by measurements."
						],
						evidence:
							"The judging explanation includes a labeled diagram or graph reading, a proportional comparison, and a final claim about which routine meets the stated requirement."
					}),
					"https://www.youtube.com/watch?v=SMLknNJt5Pk"
				)
			]
		),
		module(
			"PAB10-PAB14 Polygons, Area, Circles, and Solids",
			[
				lesson(
					"Quadrilaterals, Polygons, Perimeter, and Area",
					overview({
						title: "Polygon measurements depend on the figure's structure: sides determine perimeter, while dimensions and formulas determine area.",
						concepts: [
							"A polygon is a closed two-dimensional figure made from straight sides.",
							"Quadrilaterals have four sides; special quadrilaterals include rectangles, squares, parallelograms, trapezoids, and rhombi.",
							"Perimeter measures distance around a figure.",
							"Area measures the amount of two-dimensional space inside the figure."
						],
						practice:
							"Identify the shape, write the formula, substitute labeled values, and check whether the answer uses linear or square units.",
						check: "A complete measurement response distinguishes perimeter units from area units and names the formula used."
					})
				),
				lesson(
					"Circles and Three-Dimensional Shapes",
					overview({
						title: "Circle and solid-figure measurements extend geometry from flat regions to curved boundaries and three-dimensional objects.",
						concepts: [
							"Radius measures from the center of a circle to the edge; diameter is twice the radius.",
							"Circumference measures distance around a circle.",
							"Circle area measures the space inside the circle.",
							"Surface area measures the outside area of a solid, while volume measures the space inside it."
						],
						practice:
							"Draw or identify the figure, label radius, diameter, height, or side length, then select the formula that matches the measurement being requested.",
						check: "A correct response identifies whether the question asks for distance, area, surface area, or volume before calculating."
					})
				)
			],
			[
				lesson(
					"Project: Uber Internship Challenge",
					[
						project({
							title: "PAB14 Module Project: Uber Internship Challenge",
							goal: "Use geometry to compare route shapes, distances, perimeters, and area or volume constraints in a transportation-planning scenario.",
							steps: [
								"Inspect a route map or drawn route and break the path into measurable segments.",
								"Identify right angles, parallel paths, or polygon-like regions where they appear.",
								"Calculate perimeter or total route distance from the available measurements.",
								"Apply area, circle, or solid-figure reasoning when the route or object has a measurable region.",
								"Recommend a route or design choice using the computed evidence."
							],
							evidence:
								"The route recommendation includes labeled measurements, a geometric formula or theorem, unit-aware calculations, and a final comparison."
						}),
						pendingStaticMediaNotice(UBER_ROUTE)
					].join("\n\n"),
					staticMediaUrl(UBER_ROUTE)
				)
			]
		),
		module(
			"Check-In #2: Pre-Algebra B Geometry",
			[
				lesson(
					"Geometry Readiness Check",
					[
						"Check-In #2 reviews points, lines, angles, triangles, similarity, polygons, perimeter, area, circles, surface area, and volume. A strong response starts with a diagram before selecting formulas.",
						"Useful evidence includes labeled figures, units, formula substitutions, and one explanation of why a formula or theorem applies.",
						"Common review targets include mixing perimeter and area, using diameter as radius, pairing the wrong corresponding sides, or applying the Pythagorean theorem to a triangle that is not right."
					].join("\n\n")
				)
			],
			[
				lesson(
					"Supplemental Project 1: Geometry Formula Audit",
					project({
						title: "Check-In #2 Geometry Review",
						goal: "Audit a mixed geometry solution set for formula choice, unit choice, and diagram interpretation.",
						steps: [
							"Create three geometry prompts: one perimeter or circumference, one area, and one surface area or volume.",
							"Add one intentional mistake, such as radius/diameter confusion or square units on a perimeter answer.",
							"Correct the mistake and explain how the diagram shows which formula applies.",
							"Write a final note separating linear units, square units, and cubic units."
						],
						evidence:
							"The audit includes corrected formulas, labeled units, and one explanation connecting the diagram to the calculation."
					})
				),
				lesson(
					"Supplemental Project 2: Similarity Transfer",
					project({
						title: "Check-In #2 Similarity Review",
						goal: "Use proportional side lengths to solve a changed similarity problem and verify the scale factor.",
						steps: [
							"Draw or describe two similar figures with at least three corresponding sides.",
							"Calculate the scale factor from one side pair.",
							"Use the scale factor to find a missing side.",
							"Check a second side pair to confirm the figures are actually similar."
						],
						evidence:
							"The transfer shows corresponding sides, scale factor, missing-side calculation, and one verification pair."
					})
				)
			]
		),
		module(
			"PAB15-PAB19 Factors, Multiples, and Number Structure",
			[
				lesson(
					"Multiples, Factors, Divisibility, and Primes",
					overview({
						title: "Number structure explains how whole numbers can be built, divided, compared, and organized.",
						concepts: [
							"A factor divides a number evenly; a multiple is a product of that number and an integer.",
							"Divisibility rules offer quick tests for factors such as 2, 3, 5, 9, and 10.",
							"A prime number has exactly two positive factors: 1 and itself.",
							"Prime factorization rewrites a composite number as a product of prime factors."
						],
						practice:
							"List factor pairs, test divisibility, build prime factorizations, and use those factorizations to compare numbers.",
						check: "A complete response distinguishes factors from multiples and verifies prime factorization by multiplying back."
					})
				),
				lesson(
					"GCF and LCM",
					overview({
						title: "Greatest common factor and least common multiple compare how numbers share structure.",
						concepts: [
							"The greatest common factor is the largest factor shared by two or more numbers.",
							"The least common multiple is the smallest positive multiple shared by two or more numbers.",
							"GCF is useful for splitting quantities into equal groups.",
							"LCM is useful for repeated cycles, shared schedules, and common denominators."
						],
						practice:
							"Solve each problem twice when useful: first with lists, then with prime factorization, and compare which method is clearer.",
						check: "A correct response explains whether the situation calls for grouping by shared factors or synchronizing by shared multiples."
					})
				)
			],
			[
				lesson(
					"Project: The MARVELous Theme Park",
					project({
						title: "PAB19 Module Project: The MARVELous Theme Park",
						goal: "Use factors, multiples, divisibility, primes, GCF, and LCM to design a theme-park scheduling or grouping plan.",
						steps: [
							"Choose attractions, groups, or schedules that repeat or divide into equal parts.",
							"Use factors and divisibility to test equal grouping options.",
							"Use prime factorization to compare at least two large values.",
							"Apply GCF to one grouping problem.",
							"Apply LCM to one schedule or cycle problem."
						],
						evidence:
							"The theme-park plan includes factor lists or prime factorizations, one GCF decision, one LCM decision, and a written explanation of the final schedule or grouping."
					})
				)
			]
		),
		module(
			"PAB20-PAB23 Counting, Probability, and Applied Modeling",
			[
				lesson(
					"Counting Strategies and Probability",
					overview({
						title: "Counting strategies define the sample space, and probability compares favorable outcomes with possible outcomes.",
						concepts: [
							"A sample space lists all possible outcomes being considered.",
							"The multiplication principle counts choices across stages when each stage has several options.",
							"Probability is favorable outcomes divided by total possible outcomes when outcomes are equally likely.",
							"Experimental probability uses observed results, while theoretical probability uses a model of possible outcomes."
						],
						practice:
							"Create a table, tree diagram, or organized list before calculating probability, then check that every outcome is counted once.",
						check: "A complete probability response defines the sample space and explains why the denominator is correct."
					})
				),
				lesson(
					"Applied Data Models and Dashboards",
					overview({
						title: "Applied math projects combine data summaries, geometry, factors, and probability into decisions that can be explained.",
						concepts: [
							"A model simplifies a situation so a calculation or comparison can be made.",
							"A good dashboard or table makes important variables visible before a recommendation is written.",
							"Probability and counting can support game balance, product decisions, and risk comparisons.",
							"Limitations matter because a model can be useful without being a perfect copy of reality."
						],
						practice:
							"Name the decision, list the variables, choose the calculation, and write a limitation note next to the final recommendation.",
						check: "A complete applied model includes evidence, calculation, conclusion, and limitation."
					})
				)
			],
			[
				lesson(
					"Project: eSmash",
					[
						project({
							title: "PAB22 Module Project: eSmash",
							goal: "Use counting and probability to analyze a competitive game or match-up system.",
							steps: [
								"Define the possible characters, actions, moves, or match outcomes.",
								"Build an organized list, table, or tree diagram for the sample space.",
								"Calculate at least two probabilities from the model.",
								"Compare theoretical probability with a small set of simulated or observed results.",
								"Explain one limitation of the model."
							],
							evidence:
								"The game analysis includes a sample-space representation, probability calculations, a comparison, and one limitation statement."
						}),
						pendingStaticMediaNotice(ESMASH_MODEL)
					].join("\n\n"),
					staticMediaUrl(ESMASH_MODEL)
				),
				lesson(
					"Project: Airtable Revamped",
					project({
						title: "PAB23 Module Project: Airtable Revamped",
						goal: "Design a table or dashboard that uses statistics, graphing, geometry, factors, or probability to support a product decision.",
						steps: [
							"Choose a product, class, club, team, or game scenario with multiple records.",
							"Define the fields that belong in the table.",
							"Summarize the data with at least two statistics or calculated columns.",
							"Create a visual representation or dashboard view.",
							"Write a recommendation and name the data limitation that matters most."
						],
						evidence:
							"The table design includes fields, calculations, a visual summary, a recommendation, and one limitation note."
					})
				)
			]
		),
		module(
			"Check-In #3 and Capstone: Pre-Algebra B",
			[
				lesson(
					"Number Structure, Probability, and Modeling Readiness Check",
					[
						"Check-In #3 reviews factors, multiples, divisibility, prime factorization, GCF, LCM, counting strategies, probability, and applied modeling. The final readiness evidence can be a mixed problem set or a compact portfolio.",
						"A useful portfolio includes one factorization, one GCF or LCM decision, one sample-space representation, one probability calculation, and one applied recommendation.",
						"The capstone combines the course strands: data, geometry, number structure, probability, and explanation."
					].join("\n\n")
				),
				lesson(
					"Master Project: Pre-Algebra B",
					project({
						title: "PAB24 Master Project: Pre-Algebra B",
						goal: "Create a final applied-math project that uses data analysis, geometry, factors or multiples, counting, probability, and written reasoning.",
						steps: [
							"Choose a scenario such as a game, route, business, sports event, theme park, competition, or product dashboard.",
							"Collect or invent a dataset that can be summarized and graphed.",
							"Include one geometric diagram or measurement calculation.",
							"Include one factor, multiple, GCF, or LCM calculation.",
							"Include one counting or probability calculation.",
							"Write a conclusion that cites evidence from at least three parts of the project."
						],
						evidence:
							"The capstone includes a data display, a geometry calculation, a number-structure calculation, a probability or counting calculation, and a final evidence-based recommendation."
					})
				)
			],
			[
				lesson(
					"Supplemental Project 1: Probability Fairness Audit",
					project({
						title: "Check-In #3 Probability Review",
						goal: "Evaluate whether a simple game or drawing system is fair by listing outcomes and comparing probabilities.",
						steps: [
							"Define a game, spinner, card draw, or match-up with a clear sample space.",
							"List or table all outcomes so each is counted once.",
							"Calculate at least two probabilities.",
							"Decide whether the system is fair and explain one assumption behind the model."
						],
						evidence:
							"The audit includes a sample space, probability calculations, a fairness claim, and one model assumption."
					})
				),
				lesson(
					"Supplemental Project 2: Capstone Evidence Plan",
					project({
						title: "Pre-Algebra B Capstone Planning",
						goal: "Plan the capstone before building it by naming the data, geometry, number-structure, and probability evidence.",
						steps: [
							"Write the scenario and the decision the capstone will answer.",
							"List the dataset or table that will support the data display.",
							"Sketch the geometry calculation or diagram.",
							"Name the factor, multiple, GCF, LCM, counting, or probability calculation.",
							"Write the limitation that the final recommendation must mention."
						],
						evidence:
							"The plan names the capstone question, required evidence pieces, and one limitation before the final project begins."
					})
				)
			]
		)
	],
	developmentMetadata: {
		priority: "soon",
		standards: [
			"Common Core middle-school statistics, geometry, ratios, number system, expressions, and probability readiness",
			"Pre-algebra readiness for Geometry A and Algebra 1A"
		],
		sourcePolicy:
			"Adapted from the Pre-Algebra B sequence with neutral wording, course-linked projects, and static.classes placeholders for unavailable images.",
		assessmentCadence: [
			"Check-In #1 after statistics and graphs",
			"Check-In #2 after geometry measurement",
			"Check-In #3 before the final capstone"
		],
		toolchain: [
			"Notebook or shared document",
			"Spreadsheet or table tool for data summaries",
			"Drawing or graphing tool for diagrams and graphs",
			"Static-host placeholders for diagrams and screenshots"
		],
		safetyPolicy: [
			"No physical materials required",
			"External maps and videos are optional references, not required accounts or experiments"
		],
		courseBoundaries: [
			"Focuses on pre-algebra statistics, geometry, factors, probability, and modeling rather than full proof-based geometry",
			"Avoids instructor-portal operations and private platform references"
		],
		capstoneExpectations: [
			"One data display",
			"One geometry calculation",
			"One number-structure calculation",
			"One probability or counting calculation",
			"One evidence-based recommendation with a limitation"
		],
		recommendedNextWork: [
			"Cross-link Geometry A/B and Algebra 1A readiness checkpoints from the visible math pathway",
			"Upload reserved Pre-Algebra B images to the static classes host",
			"Review external map/video links for source-safe alternatives where useful"
		]
	}
};
