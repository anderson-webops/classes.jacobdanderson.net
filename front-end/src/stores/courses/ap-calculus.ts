import type { RawCourse } from "./types";

interface CalculusModuleData {
	title: string;
	topic: string;
	concepts: string[];
	practice: string[];
	assessment: string;
	extension: string;
	bcOnly?: boolean;
	review?: boolean;
}

function lesson(title: string, content: string) {
	return { title, content };
}

function moduleCode(title: string) {
	return title.split(/\s+/)[0] ?? title;
}

function module({
	assessment,
	bcOnly,
	concepts,
	extension,
	practice,
	review,
	title,
	topic
}: CalculusModuleData) {
	const trackLabel = bcOnly
		? "BC extension path"
		: review
			? "Topic review path"
			: "AB core path";
	const focus = review
		? `${topic} consolidates earlier modules through mixed AP-style reasoning.`
		: `${topic} develops one major AP Calculus strand through definitions, representation changes, computation, and justification.`;
	const code = moduleCode(title);

	return {
		title,
		curriculum: [
			lesson(
				"Concept Path",
				[
					`**Track:** ${trackLabel}`,
					`**Focus:** ${focus}`,
					`**Core ideas:**\n${concepts.map(concept => `- ${concept}`).join("\n")}`,
					"**Representation habit:** Use graphical, numerical, analytical, and verbal evidence when the problem type allows it.",
					"**AP habit:** State hypotheses, domains, intervals, units, and conclusion language explicitly before using a theorem or formula."
				].join("\n\n")
			),
			lesson(
				"Worked Reasoning Map",
				[
					`**Goal:** Build a reproducible reasoning path for ${topic}.`,
					"**Sequence:**",
					"1. Identify what is known, what is being asked, and which representation is most useful.",
					"2. Name any theorem, definition, derivative rule, integral rule, convergence test, or modeling assumption before applying it.",
					"3. Complete the calculation or argument with units, intervals, or endpoint behavior visible.",
					"4. Verify the result against a graph, table, sign chart, limiting behavior, or contextual interpretation.",
					"5. Write the final sentence in AP style: claim, evidence, and reason."
				].join("\n\n")
			),
			lesson(
				"Module Problem Set",
				[
					`**Practice target:** ${practice.join(" ")}`,
					"**Required mix:** include one direct computation, one graph or table interpretation, one theorem or definition justification, and one short written explanation.",
					`**Assessment check:** ${assessment}`,
					"**Calculator policy:** Graphing technology can support exploration or checking, but the written solution still records the mathematical reason."
				].join("\n\n")
			)
		],
		supplementalProjects: [
			lesson(
				`${code} Error Audit`,
				[
					`**Goal:** Diagnose common mistakes in ${topic} before they become exam habits.`,
					"**Mistake bank:**",
					"- Create one flawed solution with a missing hypothesis, domain restriction, interval condition, or continuity requirement.",
					"- Create one flawed solution with unsupported algebra, notation drift, a wrong sign, or an invalid simplification.",
					"- Create one flawed solution that overtrusts a graph, table, or calculator output without a mathematical reason.",
					"- Create one flawed solution with an answer that is numerically plausible but poorly justified.",
					"**Repair process:**",
					"1. Mark the first invalid step.",
					"2. Replace that step with a valid theorem, definition, rule, or representation-based argument.",
					"3. Add a prevention note that names the warning sign to check next time.",
					"**Completion evidence:** each repaired solution includes a corrected final answer and a sentence explaining why the repair is valid."
				].join("\n\n")
			),
			lesson(
				`${code} AP Practice Plan`,
				[
					`**Goal:** Turn ${topic} into a targeted AP practice set with explicit evidence.`,
					"**Prompt set:**",
					"- One multiple-choice-style prompt that can be checked quickly but still requires a defined method.",
					"- One free-response-style prompt that asks for setup, calculation, and a written conclusion.",
					"- One explanation prompt that focuses on a theorem, graph feature, table pattern, model assumption, or notation decision.",
					"**Solution log:** For each prompt, record the representation used, the concept being tested, the smallest prerequisite skill that controls the answer, and one reason the final answer is defensible.",
					`**Extension:** ${extension}`,
					"**Completion evidence:** the plan includes answer keys, correction notes, and at least one prompt that can be solved without calculator support."
				].join("\n\n")
			)
		]
	};
}

const moduleData: CalculusModuleData[] = [
	{
		title: "APCA0 Preparing for AP Calculus",
		topic: "Course Setup and Diagnostic Readiness",
		concepts: [
			"AP Calculus AB and BC both require strong function, algebra, trigonometry, graph interpretation, and notation fluency.",
			"AB centers on limits, derivatives, integrals, differential equations, and applications of change and accumulation.",
			"BC includes all AB content plus additional integration techniques, parametric and polar calculus, vector-valued functions, and infinite series.",
			"Exam practice uses both multiple-choice and free-response formats, with calculator and no-calculator reasoning separated."
		],
		practice: [
			"Complete a diagnostic covering function behavior, trigonometric values, algebraic simplification, graph features, and rate language."
		],
		assessment:
			"A readiness profile names secure prerequisites, review targets, calculator comfort, and the intended AB or BC path.",
		extension:
			"Create a personal pacing map that separates AB core work, BC-only work, review weeks, and exam practice."
	},
	{
		title: "APC1 Introduction to Limits",
		topic: "Introducing Calculus and Defining Limits",
		concepts: [
			"A limit describes the value a function approaches as the input approaches a point, even when the function value at that point is different or undefined.",
			"One-sided limits compare behavior from the left and right.",
			"Graphical and numerical evidence can suggest a limit, while analytical work supports a formal conclusion.",
			"Limit notation must identify the input approaching value and the function expression."
		],
		practice: [
			"Estimate limits from graphs and tables, compare one-sided behavior, and write limit statements with precise notation."
		],
		assessment:
			"A complete solution distinguishes function value from limiting behavior and handles left-hand and right-hand evidence separately.",
		extension:
			"Add a removable discontinuity example and explain why the limit exists even when the function value is missing."
	},
	{
		title: "APC2 Calculating Limits",
		topic: "Properties and Procedures for Limits",
		concepts: [
			"Limit laws allow sums, differences, products, quotients, and compositions to be evaluated when hypotheses are met.",
			"Direct substitution works when the expression is continuous at the input value.",
			"Indeterminate forms require algebraic rewriting, factoring, rationalizing, common denominators, or known trigonometric limits.",
			"Limits at infinity describe end behavior and horizontal asymptotes."
		],
		practice: [
			"Calculate limits with substitution, algebraic simplification, piecewise definitions, and infinity behavior."
		],
		assessment:
			"The solution names the indeterminate form or continuity reason before choosing a procedure.",
		extension:
			"Create a procedure-selection chart for direct substitution, factoring, rationalizing, and end-behavior limits."
	},
	{
		title: "APC3 Continuity",
		topic: "Continuity and Limits Involving Infinity",
		concepts: [
			"Continuity at a point requires the function value, the limit, and equality between them.",
			"Discontinuities can be removable, jump, infinite, or oscillatory depending on the evidence.",
			"The Intermediate Value Theorem requires continuity on a closed interval and supports existence conclusions.",
			"Infinite limits describe unbounded behavior near vertical asymptotes."
		],
		practice: [
			"Classify discontinuities, repair removable gaps, justify IVT conclusions, and analyze infinite limit behavior."
		],
		assessment:
			"The response states the exact continuity condition or theorem hypothesis being used.",
		extension:
			"Design a piecewise function with three discontinuity types and write a continuity report for it."
	},
	{
		title: "APC4 Limits and Continuity Topic Review",
		topic: "Limits and Continuity Review",
		concepts: [
			"Limit reasoning combines numerical estimates, graph evidence, algebraic procedures, and theorem hypotheses.",
			"Continuity questions often fail when the function value and limiting behavior are treated as the same fact.",
			"Topic review problems mix direct calculation with explanation of existence, nonexistence, and required conditions."
		],
		practice: [
			"Complete mixed limit and continuity prompts with at least one graph, table, algebraic limit, and theorem justification."
		],
		assessment:
			"A review-ready solution explains why each limit exists, fails to exist, or requires more information.",
		extension:
			"Build a one-page limit and continuity decision tree with example problems for each branch.",
		review: true
	},
	{
		title: "APC5 Introduction to Derivatives",
		topic: "Rates of Change and Derivative Definitions",
		concepts: [
			"Average rate of change measures slope over an interval.",
			"Instantaneous rate of change is defined as a limit of average rates.",
			"The derivative at a point can be interpreted as slope, velocity, sensitivity, or local linear change depending on context.",
			"Differentiability implies continuity, but continuity alone does not guarantee differentiability."
		],
		practice: [
			"Use difference quotients, tangent-line slopes, derivative notation, and rate interpretations."
		],
		assessment:
			"The solution connects the derivative definition to a limit and interprets the result in context.",
		extension:
			"Compare two functions with the same value at a point but different derivative behavior."
	},
	{
		title: "APC6 Derivative Rules",
		topic: "Basic and Advanced Derivative Rules",
		concepts: [
			"Power, constant multiple, sum, difference, product, and quotient rules make derivative calculation efficient.",
			"Derivative rules rely on previously established derivative definitions and limit behavior.",
			"Algebraic simplification before differentiating can reduce errors.",
			"Notation such as f'(x), dy/dx, and derivative operator notation must stay connected to the variable of differentiation."
		],
		practice: [
			"Differentiate polynomial, rational, product, and quotient expressions, then verify the result by inspecting units or graph behavior."
		],
		assessment:
			"The derivative work identifies the rule used and avoids hiding algebraic domain restrictions.",
		extension:
			"Create a derivative-rule comparison table with one common trap for each rule."
	},
	{
		title: "APC7 Derivatives of Trigonometric and Other Functions",
		topic: "Trigonometric, Exponential, and Logarithmic Derivatives",
		concepts: [
			"Sine and cosine derivatives connect circular motion, rate, and graph phase.",
			"Tangent, reciprocal trigonometric functions, exponential functions, and logarithms each have specific derivative patterns.",
			"Derivative formulas require radian measure for trigonometric functions.",
			"Exponential and logarithmic derivatives often appear in growth, decay, and inverse-function reasoning."
		],
		practice: [
			"Differentiate trigonometric, exponential, and logarithmic functions and connect derivative signs to graph behavior."
		],
		assessment:
			"The work uses radian-based trig derivatives and preserves chain-rule needs when expressions are nested.",
		extension:
			"Build a sign chart comparing a trigonometric function and its derivative across one period."
	},
	{
		title: "APC8 Derivatives of Composite, Implicit, and Inverse Functions",
		topic: "Chain Rule, Implicit Differentiation, Inverses, and Higher-Order Derivatives",
		concepts: [
			"The chain rule differentiates nested functions by combining outside and inside rates of change.",
			"Implicit differentiation treats y as a function of x when an equation does not isolate y.",
			"Inverse-function derivatives connect reciprocal slopes at corresponding points.",
			"Higher-order derivatives describe changing rates, including acceleration and concavity."
		],
		practice: [
			"Differentiate composite functions, implicit relations, inverse-function situations, and second-derivative contexts."
		],
		assessment:
			"The solution shows where the inner derivative, dy/dx factor, inverse relationship, or second derivative enters.",
		extension:
			"Create one problem that can be solved by explicit differentiation and implicit differentiation, then compare the paths."
	},
	{
		title: "APC9 Differentiation Topic Review",
		topic: "Differentiation Review",
		concepts: [
			"Differentiation review requires definition-level reasoning, rule fluency, graph interpretation, and context-aware units.",
			"Common errors include missing chain-rule factors, misusing inverse derivatives, losing domain restrictions, and treating continuity as differentiability.",
			"AP free-response work rewards setup, notation, justification, and interpretation, not only the final derivative."
		],
		practice: [
			"Complete mixed derivative tasks with definitions, rules, graph evidence, implicit relations, and interpretation."
		],
		assessment:
			"The review demonstrates rule selection, derivative meaning, and accurate final conclusion language.",
		extension:
			"Write a short derivative checklist for no-calculator and calculator-active prompts.",
		review: true
	},
	{
		title: "APC10 Contextual Applications of Differentiation",
		topic: "Interpreting Derivatives, Related Rates, and Linear Approximation",
		concepts: [
			"Derivative values carry units and describe rates in context.",
			"Related rates connect variables through an equation and differentiate with respect to time.",
			"Linear approximation uses a tangent line to estimate nearby function values.",
			"Contextual derivative problems require defining variables before differentiating."
		],
		practice: [
			"Interpret derivative units, solve related-rates scenarios, and use tangent-line approximations with error awareness."
		],
		assessment:
			"The setup defines variables and units before applying derivative machinery.",
		extension:
			"Create a related-rates diagram and identify which quantities are fixed, changing, known, and requested."
	},
	{
		title: "APC11 Analytical Applications of Differentiation",
		topic: "Continuous Function Theorems and Function Analysis",
		concepts: [
			"The Mean Value Theorem and Extreme Value Theorem require specific interval and continuity or differentiability hypotheses.",
			"First derivative sign analysis identifies increasing and decreasing behavior.",
			"Second derivative sign analysis identifies concavity and supports the second derivative test.",
			"Optimization and analysis problems require endpoints, critical points, and domain restrictions."
		],
		practice: [
			"Use derivative sign charts, theorem hypotheses, critical values, and concavity to analyze function behavior."
		],
		assessment:
			"The response names theorem hypotheses and includes endpoint or domain checks when required.",
		extension:
			"Build a function-analysis report with intervals, extrema, concavity, inflection points, and justification."
	},
	{
		title: "APC12 A Function and Its Derivatives",
		topic: "Graphing Functions, Derivative Graphs, Optimization, and Implicit Relations",
		concepts: [
			"A function graph and derivative graph encode each other through slope, increasing or decreasing behavior, and extrema.",
			"Optimization identifies a target quantity, constraints, domain, and candidate values.",
			"Implicit relations can have tangent behavior even when the relation is not a function of x globally.",
			"Derivative information supports sketching and interpretation across multiple representations."
		],
		practice: [
			"Match functions with derivative graphs, solve optimization problems, and interpret implicit relation slopes."
		],
		assessment:
			"The solution connects graphical evidence to derivative signs and verifies the candidate that answers the question.",
		extension:
			"Design a graph-matching set using f, f', and f'' with a written answer key."
	},
	{
		title: "APC13 Applications of Derivatives Topic Review",
		topic: "Applications of Derivatives Review",
		concepts: [
			"Derivative applications connect rates, approximation, theorems, function analysis, optimization, and graph interpretation.",
			"Written justification often depends on naming hypotheses, candidate values, and the interval being discussed.",
			"Calculator evidence can support an answer only when the mathematical setup is clear."
		],
		practice: [
			"Complete mixed application prompts with related rates, optimization, theorem justification, and graph analysis."
		],
		assessment:
			"The review includes a correct setup, a defensible calculation path, and a conclusion tied to context.",
		extension:
			"Create a short guide for deciding when an AP derivative application needs a theorem, a sign chart, or a contextual model.",
		review: true
	},
	{
		title: "APC14 Accumulation of Change",
		topic: "Riemann Sums and the Fundamental Theorem of Calculus",
		concepts: [
			"Accumulation measures total change from rates over intervals.",
			"Riemann sums approximate signed area and accumulated change using rectangles.",
			"The definite integral formalizes accumulation as a limit of sums.",
			"The Fundamental Theorem of Calculus connects accumulation functions, derivatives, and definite integrals."
		],
		practice: [
			"Approximate integrals with sums, interpret signed area, and connect FTC statements to accumulation."
		],
		assessment:
			"The work distinguishes area, signed area, total change, and function value.",
		extension:
			"Use a table of rates to estimate total change and compare left, right, midpoint, and trapezoid estimates."
	},
	{
		title: "APC15 Integrals",
		topic: "Antiderivatives, Evaluating Integrals, and Integration Methods",
		concepts: [
			"Indefinite integrals represent families of antiderivatives and include a constant of integration.",
			"Definite integrals produce accumulated change over an interval.",
			"Substitution reverses the chain rule and requires matching differential structure.",
			"BC integration extends into methods such as integration by parts and partial fractions."
		],
		practice: [
			"Evaluate indefinite and definite integrals, choose substitution when appropriate, and identify BC-only integration methods."
		],
		assessment:
			"The solution preserves bounds, constants of integration, units, and method justification.",
		extension:
			"Make a method-selection chart for basic antiderivatives, substitution, integration by parts, and partial fractions."
	},
	{
		title: "APC16 Integration and Accumulation of Change Topic Review",
		topic: "Integration and Accumulation Review",
		concepts: [
			"Integration review combines approximation, exact evaluation, accumulation functions, FTC, and contextual interpretation.",
			"Common errors include dropping constants, reversing bounds without sign changes, mixing area with signed accumulation, and using FTC without continuity.",
			"AP explanations often require reading meaning from a table, graph, expression, or context."
		],
		practice: [
			"Complete mixed integration prompts with Riemann sums, FTC, antiderivatives, table evidence, and contextual conclusions."
		],
		assessment:
			"The review names whether each answer is an estimate, exact value, net change, or total amount.",
		extension:
			"Create a table-to-integral problem and solve it with two approximation methods.",
		review: true
	},
	{
		title: "APC17 Introduction to Differential Equations",
		topic: "Modeling Differential Equations, Slope Fields, and Euler's Method",
		concepts: [
			"Differential equations describe relationships involving a function and its derivatives.",
			"Slope fields visualize derivative rules across the plane.",
			"Solutions can be verified by substituting into the differential equation and checking initial conditions.",
			"Euler's Method, a BC topic, approximates a solution curve with repeated tangent-line steps."
		],
		practice: [
			"Verify solutions, sketch slope fields, interpret solution behavior, and apply Euler's Method for BC practice."
		],
		assessment:
			"The work separates the differential equation, initial condition, slope field evidence, and approximate solution.",
		extension:
			"Compare two Euler step sizes and explain how the approximation changes."
	},
	{
		title: "APC18 Solutions to Differential Equations",
		topic: "Separation of Variables, Exponential Models, and Logistic Models",
		concepts: [
			"Separation of variables rewrites a differential equation so each variable can be integrated on its own side.",
			"Initial conditions determine the constant in a general solution.",
			"Exponential growth and decay models connect rate proportionality to function behavior.",
			"Logistic models, a BC topic, include limiting capacity and changing growth rate."
		],
		practice: [
			"Solve separable differential equations, apply initial conditions, and interpret exponential or logistic model parameters."
		],
		assessment:
			"The final model is verified against the differential equation and interpreted in context.",
		extension:
			"Compare an exponential model with a logistic model for the same context and explain which assumption differs."
	},
	{
		title: "APC19 Differential Equations Topic Review",
		topic: "Differential Equations Review",
		concepts: [
			"Differential equations require model setup, solution verification, slope-field interpretation, and contextual conclusions.",
			"Initial conditions, equilibrium behavior, and units carry important meaning.",
			"BC review adds Euler approximation and logistic reasoning."
		],
		practice: [
			"Complete mixed differential equation tasks with verification, slope fields, separable equations, and model interpretation."
		],
		assessment:
			"The review demonstrates exact solution work where possible and approximate reasoning where required.",
		extension:
			"Build a two-column comparison of slope-field evidence and algebraic solution evidence.",
		review: true
	},
	{
		title: "APC20 Interpreting Context for Definite Integrals",
		topic: "Change Over an Interval and Area Between Curves",
		concepts: [
			"Definite integrals can represent net change, area, volume, distance, or accumulated quantity depending on context.",
			"Area between curves requires identifying top and bottom functions or right and left boundaries.",
			"Contextual integral problems require units and interval meaning.",
			"Graph intersections often define bounds for accumulated comparisons."
		],
		practice: [
			"Set up and interpret definite integrals for change over intervals and area between curves."
		],
		assessment:
			"The setup identifies the integrand, bounds, units, and reason the integral answers the question.",
		extension:
			"Create a context where the same two curves support both signed difference and total area interpretations."
	},
	{
		title: "APC21 Volumes of Solids Using Integrals",
		topic: "Cross Sections, Disc Method, Washer Method, and Arc Length",
		concepts: [
			"Volumes by cross sections integrate area formulas along an axis.",
			"Disc and washer methods model solids of revolution with radius functions.",
			"Correct radius expressions depend on the axis of rotation and the distance from the curve to that axis.",
			"BC arc length connects integration with accumulated distance along a curve."
		],
		practice: [
			"Set up volume integrals using cross sections, discs, washers, and BC arc length when applicable."
		],
		assessment:
			"The solution includes a diagram or verbal radius definition before writing the integral.",
		extension:
			"Compare a washer setup around two different axes and explain how the radius expressions change."
	},
	{
		title: "APC22 Applications of Integration Topic Review",
		topic: "Applications of Integration Review",
		concepts: [
			"Applications of integration combine setup, geometry, units, intersections, bounds, and interpretation.",
			"Volume and area problems fail when the visual model is not translated into an integrand carefully.",
			"AP review often asks for setup, explanation, or calculator-supported evaluation rather than only hand integration."
		],
		practice: [
			"Complete mixed area, accumulation, volume, and contextual integral prompts with precise setup."
		],
		assessment:
			"The review contains defensible bounds, integrands, units, and conclusion sentences.",
		extension:
			"Create one free-response-style application prompt with a graph, a table, and an interpretation part.",
		review: true
	},
	{
		title: "APC23 Parametric Equations, Polar Coordinates, and Vector-Valued Functions",
		topic: "Parametric Equations, Polar Coordinates, and Vector-Valued Calculus",
		concepts: [
			"Parametric equations describe motion with x and y depending on a shared parameter.",
			"Vector-valued functions describe position, velocity, speed, acceleration, and displacement in the plane.",
			"Polar coordinates describe curves by radius as a function of angle.",
			"BC calculus connects derivatives, arc length, area, and motion interpretation across these representations."
		],
		practice: [
			"Differentiate and integrate parametric, polar, and vector-valued relationships with attention to representation meaning."
		],
		assessment:
			"The solution names the parameter or angle, the requested quantity, and the representation-specific formula.",
		extension:
			"Compare a rectangular, parametric, and polar model of a curve and identify which calculus question each handles best.",
		bcOnly: true
	},
	{
		title: "APC24 Parametric Equations, Polar Coordinates, and Vector-Valued Functions Topic Review",
		topic: "Parametric, Polar, and Vector Review",
		concepts: [
			"BC representation review requires switching among parameter, vector, polar, and rectangular viewpoints.",
			"Motion problems distinguish position, velocity, speed, acceleration, and total distance.",
			"Polar area and slope questions require formulas that differ from rectangular procedures."
		],
		practice: [
			"Complete mixed BC prompts involving parametric motion, vector-valued functions, polar area, and representation choice."
		],
		assessment:
			"The review demonstrates representation-specific setup rather than forcing every problem into rectangular form.",
		extension:
			"Build a formula map for parametric, polar, and vector-valued derivatives and integrals.",
		bcOnly: true,
		review: true
	},
	{
		title: "APC25 Infinite Series",
		topic: "Infinite Series and Convergence Tests",
		concepts: [
			"Infinite series add infinitely many terms and require convergence reasoning before treating the sum as meaningful.",
			"Geometric, p-series, comparison, limit comparison, integral, ratio, root, alternating, and divergence tests each have specific conditions.",
			"Absolute and conditional convergence describe different strengths of convergence.",
			"Remainder bounds estimate error after a partial sum."
		],
		practice: [
			"Classify series, choose convergence tests, justify conditions, and estimate error when applicable."
		],
		assessment:
			"The solution names the test, checks its hypotheses, and states convergence, divergence, absolute convergence, or conditional convergence.",
		extension:
			"Create a convergence-test decision tree with one example and one non-example for each branch.",
		bcOnly: true
	},
	{
		title: "APC26 Infinite Sums and Representing Infinite Series",
		topic: "Approximating, Power Series, Taylor Series, and Polynomial Representations",
		concepts: [
			"Partial sums approximate infinite sums and require error awareness.",
			"Power series represent functions on intervals of convergence.",
			"Taylor and Maclaurin series use derivatives at a center to build polynomial approximations.",
			"Radius and interval of convergence require endpoint testing."
		],
		practice: [
			"Find interval of convergence, build Taylor polynomials, approximate function values, and discuss error."
		],
		assessment:
			"The work identifies the center, radius, endpoint behavior, approximation degree, and error information.",
		extension:
			"Compare a Taylor polynomial approximation with calculator or graph evidence across several input values.",
		bcOnly: true
	},
	{
		title: "APC27 Infinite Sequences and Series Topic Review",
		topic: "Infinite Sequences and Series Review",
		concepts: [
			"Series review requires recognizing structure, choosing a valid test, and communicating convergence evidence clearly.",
			"Power and Taylor series questions add representation, interval, endpoint, and error reasoning.",
			"BC free-response work often combines series notation, approximation, and justification."
		],
		practice: [
			"Complete mixed series prompts with convergence tests, power series, Taylor polynomials, interval checks, and error bounds."
		],
		assessment:
			"The review includes test selection, hypothesis checks, endpoint reasoning, and notation that matches the series.",
		extension:
			"Create a final BC series portfolio with five series types, one power series, and one Taylor approximation.",
		bcOnly: true,
		review: true
	}
];

export const apCalculusCourse: RawCourse = {
	name: "AP Calculus",
	modules: moduleData.map(module),
	developmentMetadata: {
		priority: "urgent",
		standards: [
			"AP Calculus AB and BC limits, continuity, differentiation, applications of differentiation, integration, applications of integration, and differential equations",
			"AP Calculus BC parametric, polar, vector-valued, infinite series, power series, and Taylor series topics",
			"Mathematical practices using graphical, numerical, analytical, and verbal representations"
		],
		sourcePolicy:
			"Adapted from the AP Calculus source sequence with neutral wording, course-native summaries, AP-style practice structure, and no direct legacy static image embeds.",
		assessmentCadence: [
			"Diagnostic readiness module before limits.",
			"Topic reviews after limits and continuity, differentiation, applications of derivatives, integration and accumulation, differential equations, applications of integration, parametric/polar/vector-valued functions, and infinite series.",
			"Module problem sets combine computation, graph or table interpretation, theorem/definition justification, and written explanation."
		],
		toolchain: [
			"Notebook or shared document",
			"Graphing calculator or approved graphing technology for calculator-active exploration and checks",
			"College Board AP Calculus AB and BC Course and Exam Description",
			"College Board released free-response questions and scoring guidelines"
		],
		safetyPolicy: [
			"No physical materials are required.",
			"Calculator and external-resource use must match the target classroom or exam policy."
		],
		courseBoundaries: [
			"AB topics cover limits, derivatives, integrals, differential equations, and core applications.",
			"Selected AB modules include clearly labeled BC extensions such as Euler's Method, logistic models, and arc length.",
			"BC-only modules cover parametric, polar, vector-valued, and infinite series topics.",
			"The course does not reproduce proprietary textbook pages or AP Classroom materials."
		],
		capstoneExpectations: [
			"A final review portfolio includes one limits item, one derivative item, one derivative application, one integral item, one integral application, and BC-only representation or series work when applicable.",
			"Each portfolio entry records the prompt type, representation used, mathematical justification, answer, and correction note."
		],
		recommendedNextWork: [
			"Add owned or source-safe graph cards for common AP Calculus visual prompts.",
			"Add separate accelerated AB, BC, and exam-review pacing tracks.",
			"Add static media placeholders only for specific original AP Calculus images selected for future restoration."
		]
	}
};
