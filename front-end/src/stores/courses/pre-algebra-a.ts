import type { RawCourse } from "./types";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";

const KICKOFF_INVENTORY = "paa_kickoff_0.png";
const KICKOFF_PRICING = "paa_kickoff_1.png";

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

export const preAlgebraACourse: RawCourse = {
	name: "Pre-Algebra A",
	modules: [
		module("Pre-Algebra A Kick-Off", [
			lesson(
				"Course Map and Readiness Check",
				[
					"Pre-Algebra A connects arithmetic fluency to early algebraic reasoning. The opening sequence checks comfort with signed numbers, order of operations, fractions, decimals, percents, ratios, variables, exponents, and radicals.",
					"Use the kickoff as a placement map rather than a formal test. Each question points to a later module, so a difficult step identifies the next useful learning target.",
					"Readiness evidence can include written arithmetic, a number-line model, a short explanation of the chosen operation, and one correction after an error is found."
				].join("\n\n")
			),
			lesson(
				"Project: Starting a Gardening Business",
				[
					project({
						title: "Project 1: Starting a Gardening Business",
						goal: "Use a gardening-business scenario to review arithmetic, negative numbers, absolute value, fractions, and mixed numbers.",
						steps: [
							"Create a store name and budget plan with a starting investment of $3000.",
							"Write and evaluate an expression for inventory, moving carts, and advertising expenses.",
							"Represent floor-repair depths with negative numbers and absolute value.",
							"Choose items from plant, tool, pot, and miscellaneous categories, then compare the category fractions.",
							"Divide four tenths of a bag of soil across three garden sections and record the result as a fraction."
						],
						evidence:
							"The finished plan shows the spending expression, money remaining, absolute concrete amount, ordered category fractions, and soil-per-section fraction."
					}),
					pendingStaticMediaNotice(KICKOFF_INVENTORY)
				].join("\n\n"),
				staticMediaUrl(KICKOFF_INVENTORY)
			),
			lesson(
				"Project: Growing the Gardening Business",
				[
					project({
						title: "Project 2: Growing Your Gardening Business",
						goal: "Use the same business context to connect decimals, percents, ratios, arithmetic expressions, sequences, exponents, and scientific notation.",
						steps: [
							"Calculate first-week sales from a pricing table and compare revenue with the startup spending from the first project.",
							"Interpret a 30% profit target for two gardening-tool items and decide how a price change affects the goal.",
							"Convert 1537 minutes into hours, then calculate weekly pay at $13 per hour.",
							"Analyze the sequence 5, 9, 13, 17, ..., predict later weeks, and write an expression using w for the week number.",
							"Evaluate flower-bundle and receipt expressions that use exponents, negative exponents, and scientific notation."
						],
						evidence:
							"The finished work includes revenue, profit reasoning, time conversion, wage calculation, sequence rule, exponent calculation, and corrected scientific notation."
					}),
					pendingStaticMediaNotice(KICKOFF_PRICING)
				].join("\n\n"),
				staticMediaUrl(KICKOFF_PRICING)
			)
		]),
		module(
			"PAA1-PAA2 Arithmetic Foundations",
			[
				lesson(
					"Negative Numbers, Order of Operations, and Absolute Value",
					overview({
						title: "Signed numbers extend the number line below zero, order of operations keeps multi-step expressions unambiguous, and absolute value measures distance from zero.",
						concepts: [
							"Negative numbers represent positions or changes below a reference point, such as depth, loss, temperature, or debt.",
							"Absolute value is distance, so |−7| and |7| both equal 7 even though the original positions are different.",
							"Order of operations groups calculation decisions: parentheses first, exponents next, multiplication/division left to right, then addition/subtraction left to right."
						],
						practice:
							"Trace each expression in stages. Write one line per operation so the calculation path is visible instead of relying on mental arithmetic.",
						check: "A correct explanation identifies the reference point, labels positive and negative directions, and justifies the operation order used in a multi-step expression."
					})
				)
			],
			[
				lesson(
					"Project: High and Low Species",
					project({
						title: "PAA2 Module Project: High and Low Species",
						goal: "Model animal heights and depths on a vertical number line, then use absolute value and signed arithmetic to reason about habitat placement.",
						steps: [
							"Find three animals that live or move above ground and three that live or move below ground or underwater.",
							"Choose zero on the vertical number line and explain what it represents.",
							"Place each animal as a positive or negative value and calculate distance from the ground.",
							"Design a habitat tower with above-ground roosts and an underground foundation that avoids the lowest habitat.",
							"Write a short recommendation for a building plan that accounts for animal habitat impact."
						],
						evidence:
							"The diagram uses positive and negative positions consistently, includes at least six animal placements, and calculates the full tower distance from bottom to top."
					})
				)
			]
		),
		module(
			"PAA3-PAA7 Fractions and Arithmetic",
			[
				lesson(
					"Long Multiplication, Long Division, and Fraction Structure",
					overview({
						title: "Multi-digit arithmetic and fraction structure build the accuracy needed for later algebra.",
						concepts: [
							"Long multiplication separates place-value products before combining them into one total.",
							"Long division tracks how many groups fit, what remains, and how the remainder can continue as a decimal or fraction.",
							"A fraction names a numerator, denominator, and whole; simplifying divides numerator and denominator by the same common factor.",
							"Equivalent fractions represent the same quantity even when the numerator and denominator look different."
						],
						practice:
							"Use one worked example with place-value labels, then compare a fraction model, a numeric fraction, and a simplified result.",
						check: "A correct solution preserves value while simplifying, explains the remainder, and catches common denominator or place-value mistakes."
					})
				),
				lesson(
					"Multiplying, Dividing, Adding, and Subtracting Fractions",
					overview({
						title: "Fraction operations depend on the operation being used, not on one universal rule.",
						concepts: [
							"Multiplying fractions multiplies numerators and denominators, with simplification available before or after multiplying.",
							"Dividing by a fraction means multiplying by its reciprocal because the question asks how many of one fractional amount fit inside another.",
							"Adding and subtracting fractions require common denominators because the pieces being combined must have the same size.",
							"Mixed numbers can be rewritten as improper fractions when multiplication or division is easier in that form."
						],
						practice:
							"Classify each problem by operation first, then write the required denominator or reciprocal step before calculating.",
						check: "A complete response states why a common denominator is or is not needed and leaves the final value simplified."
					})
				)
			],
			[
				lesson(
					"Project: Mochi's Product Adventure",
					project({
						title: "PAA7 Module Project: Mochi's Amazon Adventure",
						goal: "Use fractions to allocate a large product supply, compare store shares, and model follow-up demand.",
						steps: [
							"Create a table for four product categories and four stores with different preferences.",
							"Allocate the starting supply across stores and record each store's fraction of each product.",
							"Compare which store receives the greatest share of each product and represent the result with a chart.",
							"Apply fractional demand increases such as 12/10, 5/4, and 14/8 to calculate additional units.",
							"Summarize the most popular and least popular products using totals from the first and second orders."
						],
						evidence:
							"The allocation table, fraction comparisons, chart, and demand calculations use consistent totals and distinguish first-order supply from new demand."
					}),
					"https://www.youtube.com/watch?v=8nKPC-WmLjU"
				)
			]
		),
		module(
			"PAA8-PAA12 Decimals, Percents, Ratios, and Rates",
			[
				lesson(
					"Decimals and Percents",
					overview({
						title: "Decimals and percents are alternate representations of place value, parts of a whole, and change.",
						concepts: [
							"Decimal place value extends tenths, hundredths, and thousandths to the right of the decimal point.",
							"Multiplying and dividing decimals uses ordinary arithmetic plus a place-value check on the final answer.",
							"A percent means out of 100; 30% is the same as 30/100 or 0.30.",
							"Percent change compares the change amount with the original amount, not the new amount."
						],
						practice:
							"Convert among fraction, decimal, and percent forms, then apply each representation to a money or measurement context.",
						check: "A correct percent response names the original quantity, the change, and the final interpretation in context."
					})
				),
				lesson(
					"Ratios, Proportions, Unit Conversions, and Distance-Rate-Time",
					overview({
						title: "Ratios compare quantities, proportions state two ratios are equal, conversions change units, and distance problems connect d = rt.",
						concepts: [
							"A ratio compares two quantities in a fixed relationship, such as cups of flour to batches of cookies.",
							"A proportion uses equivalent ratios to solve for an unknown value.",
							"Unit conversion multiplies by a form of 1 so the value stays the same while the unit changes.",
							"Distance-rate-time problems use d = rt and can be reorganized to find distance, rate, or time."
						],
						practice:
							"Write units in every step. Cancel units during conversions and label which variable is unknown in d = rt problems.",
						check: "A correct solution has matching units, a proportion or formula setup, and a reasonableness check on the final magnitude."
					})
				)
			],
			[
				lesson(
					"Project: Cookie Catering",
					project({
						title: "PAA11 Module Project: Cookie Catering",
						goal: "Use decimals, percents, ratios, and unit conversions to plan a cookie catering order.",
						steps: [
							"Build a cookie order table with quantities, unit prices, and total revenue.",
							"Calculate ingredient or packaging costs and compare cost with selling price.",
							"Use a percent target to decide whether the planned price meets a profit goal.",
							"Scale a recipe up or down with ratios and proportions.",
							"Convert units when ingredient amounts or time estimates use different measurement systems."
						],
						evidence:
							"The catering plan includes a price table, scaled recipe calculation, percent-profit explanation, and one unit-conversion check."
					})
				),
				lesson(
					"Challenge: Rate-Time-Distance Route Plan",
					project({
						title: "PAA12 Rate-Time-Distance Problems",
						goal: "Compare routes or delivery schedules using d = rt and advanced rate-time-distance reasoning.",
						steps: [
							"Choose two routes with different distances, speeds, or travel times.",
							"Write the known distance, rate, and time values with units.",
							"Solve for the missing value in each route.",
							"Compare the routes and explain which value controlled the decision.",
							"Add one challenge case with a stop, delay, or speed change."
						],
						evidence:
							"The route comparison shows formulas, units, solved values, and a final recommendation backed by calculations."
					})
				)
			]
		),
		module("Check-In #1", [
			lesson(
				"Arithmetic and Ratio Readiness Check",
				[
					"Check-In #1 reviews the first half of Pre-Algebra A: signed numbers, order of operations, absolute value, long multiplication, long division, fraction operations, decimals, percents, ratios, proportions, conversions, and rate-time-distance problems.",
					"Useful evidence includes one clean worked example from each topic, one corrected error, and one short written explanation connecting a representation to the calculation.",
					"Additional practice can target the first topic that breaks the reasoning chain: number-line placement, denominator selection, decimal place value, percent baseline, unit cancellation, or d = rt setup."
				].join("\n\n")
			)
		]),
		module(
			"PAA13-PAA17 Expressions and Sequences",
			[
				lesson(
					"Variables, Expressions, Grouping, Distribution, and Factoring",
					overview({
						title: "Variables make arithmetic general, grouping controls order, and distribution/factoring move between expanded and grouped forms.",
						concepts: [
							"A variable represents a value that can change or an unknown value to solve for.",
							"Combining like terms works only when the variable part matches.",
							"Parentheses group a repeated quantity or a shared operation.",
							"The distributive property rewrites a(b + c) as ab + ac, and factoring reverses that move."
						],
						practice:
							"Color-code like terms, rewrite one expression in expanded form, then factor it back to prove the two forms are equivalent.",
						check: "A correct explanation names the common factor or like-term structure and verifies equivalence with a substitution."
					})
				),
				lesson(
					"Arithmetic Sequences and Sums",
					overview({
						title: "Arithmetic sequences grow by a constant difference, and arithmetic sums combine many terms efficiently.",
						concepts: [
							"The common difference is the amount added or subtracted each step.",
							"An nth-term rule uses the starting value, common difference, and term number.",
							"A sequence table makes it easier to distinguish term number from term value.",
							"Arithmetic sums can be found by pairing first and last terms when the sequence structure is clear."
						],
						practice:
							"Create a table for term number and value, write the rule, test it on a known term, then use it to predict a later term.",
						check: "A complete sequence response separates the week or term number from the amount being counted."
					})
				)
			],
			[
				lesson(
					"Project: Designing the Perfect Scanning Device",
					project({
						title: "PAA17 Module Project: Designing the Perfect Scanning Device",
						goal: "Use variables, expressions, sequences, grouping, distribution, and factoring to design and evaluate a scanning-device model.",
						steps: [
							"Define variables for scan time, item count, setup time, and repeated work.",
							"Write expressions for at least two scanning strategies.",
							"Use sequence reasoning when scan counts grow by a constant amount.",
							"Rewrite one expression with distribution and one with factoring.",
							"Compare the models and identify which strategy scales better."
						],
						evidence:
							"The device proposal includes named variables, equivalent expression forms, a sequence rule or table, and a comparison based on calculated outputs."
					})
				)
			]
		),
		module(
			"PAA18-PAA23 Exponents, Roots, and Scientific Notation",
			[
				lesson(
					"Exponent Rules, Nonpositive Exponents, Roots, and Fractional Exponents",
					overview({
						title: "Exponent notation records repeated multiplication, while roots reverse powers and fractional exponents combine both ideas.",
						concepts: [
							"A positive whole-number exponent counts repeated multiplication by the same base.",
							"When multiplying powers with the same base, add exponents; when dividing powers with the same base, subtract exponents.",
							"A zero exponent equals 1 for any nonzero base because the quotient rule leaves no factors behind.",
							"A negative exponent represents a reciprocal power.",
							"A square root asks which value squared gives the radicand; fractional exponents connect roots and powers."
						],
						practice:
							"Rewrite each expression in expanded form first, then simplify with exponent rules and compare the two paths.",
						check: "A correct response names the base, the exponent rule used, and any restriction such as a nonzero base."
					})
				),
				lesson(
					"Scientific Notation and Scale",
					overview({
						title: "Scientific notation writes very large or very small values as a number between 1 and 10 times a power of 10.",
						concepts: [
							"Positive powers of 10 move the decimal point to create large values.",
							"Negative powers of 10 move the decimal point to create small values.",
							"The coefficient carries the measured digits while the power of 10 carries scale.",
							"Scientific notation is useful for comparing quantities with very different sizes."
						],
						practice:
							"Convert ordinary notation to scientific notation and back, then compare two values by coefficient and exponent.",
						check: "A correct conversion keeps the coefficient between 1 and 10 and keeps the same value."
					})
				)
			],
			[
				lesson(
					"Project: Symptom Spree",
					project({
						title: "PAA22 Module Project: Symptom Spree",
						goal: "Use exponent rules, roots, and scale reasoning in a symptom-spread or population-growth scenario.",
						steps: [
							"Choose a starting amount and a repeated growth or shrink factor.",
							"Write an exponential expression for several stages.",
							"Use exponent rules to simplify or compare stages.",
							"Translate one large or small value into scientific notation.",
							"Explain what the model captures and what real-world detail it leaves out."
						],
						evidence:
							"The model includes exponent expressions, at least one simplified comparison, a scientific-notation value, and a sentence about model limits."
					})
				),
				lesson(
					"Project: Red Hot Chilli Chicken",
					project({
						title: "PAA23 Module Project: Red Hot Chilli Chicken",
						goal: "Use exponents, roots, ratios, and scale to model a spicy-food challenge or recipe-growth scenario.",
						steps: [
							"Define a spice scale or recipe scale with a starting value.",
							"Use powers or roots to model repeated increases, decreases, or comparisons.",
							"Convert one extreme value into scientific notation.",
							"Compare two recipes or challenge levels using ratios.",
							"Write a recommendation backed by the calculations."
						],
						evidence:
							"The recommendation includes a scale definition, exponent or root calculation, scientific notation, ratio comparison, and a reasonableness check."
					})
				)
			]
		),
		module("Check-In #2 and Capstone", [
			lesson(
				"Expressions and Exponents Readiness Check",
				[
					"Check-In #2 reviews expressions with variables, arithmetic sequences, grouping, distribution, factoring, exponent rules, roots, fractional exponents, and scientific notation.",
					"A useful readiness sample includes one simplification, one factored expression, one sequence rule, one exponent-rule explanation, one root calculation, and one scientific-notation conversion.",
					"The strongest evidence is not only a correct answer; it is a traceable chain of equivalent expressions."
				].join("\n\n")
			),
			lesson(
				"Master Project: Pre-Algebra A",
				project({
					title: "PAA24 Master Project: Pre-Algebra A",
					goal: "Design a final math project that combines arithmetic, fractions, decimals, percents, ratios, expressions, sequences, exponents, and radicals in one coherent scenario.",
					steps: [
						"Choose a scenario such as a business plan, science model, sports analysis, travel plan, game system, or recipe design.",
						"Include at least one calculation from each major course strand.",
						"Use a table, diagram, graph, or number-line model to make the reasoning visible.",
						"Add one deliberate error-analysis section that identifies and corrects a plausible mistake.",
						"End with a short reflection naming the topic that improved most and the topic that still needs practice."
					],
					evidence:
						"The capstone contains multiple representations, labeled calculations, one error correction, and a final explanation connecting the scenario to the math."
				})
			)
		])
	],
	developmentMetadata: {
		priority: "soon",
		standards: [
			"Common Core middle-school number system, expressions, equations, ratios, proportional relationships, and early functions readiness",
			"Pre-algebra readiness for Algebra 1A"
		],
		sourcePolicy:
			"Adapted from the Pre-Algebra A source sequence with neutral wording, source-backed projects, and reserved static placeholders for unavailable kickoff images.",
		assessmentCadence: [
			"Kickoff readiness map",
			"Check-In #1 after arithmetic, fractions, decimals, percents, ratios, and rates",
			"Check-In #2 before the final capstone"
		],
		toolchain: [
			"Notebook or shared document",
			"Calculator when arithmetic is not the target skill",
			"Static-host placeholders for source diagrams and tables"
		],
		safetyPolicy: [
			"No physical materials required",
			"External videos are optional context, not required experiments"
		],
		courseBoundaries: [
			"Focuses on pre-algebra foundations rather than full Algebra 1 graphing and systems",
			"Avoids instructor-portal operations and private platform references"
		],
		capstoneExpectations: [
			"At least one calculation from each major course strand",
			"At least one table, diagram, graph, or number-line model",
			"One error-analysis section with corrected reasoning"
		],
		recommendedNextWork: [
			"Add Pre-Algebra B from the source sequence",
			"Add Geometry A/B and Pre-Calculus A/B to complete the visible math pathway",
			"Upload reserved kickoff source images to the static classes host"
		]
	}
};
