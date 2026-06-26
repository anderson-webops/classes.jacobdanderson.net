import type { RawCourse, RawCourseModule } from "./types";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

interface SourceLibraryCourseSpec {
	area: string;
	focus: string;
	name: string;
	modules: string[];
	staticAssets?: string[];
}

function compactTopic(title: string) {
	return title
		.replace(/^[A-Z]{2,}\s*\d+[A-Z]?\s*/i, "")
		.replace(/^[A-Z]{2,}\d+[A-Z]?\s*/i, "")
		.replace(/^JoR\s+/i, "")
		.replace(/^WYB\s+/i, "")
		.replace(/^MS[A-C]\s+/i, "")
		.replace(/^NW\d+\s+/i, "")
		.replace(/^MYP\d+\s+/i, "")
		.replace(/^Check-in\s+#?(\d+)/i, "Check-In $1")
		.replace(/^Module Project:\s*/i, "")
		.replace(/\s+\(with [^)]+\)/gi, "")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function topicKeywords(topic: string) {
	const stopWords = new Set([
		"a",
		"an",
		"and",
		"for",
		"in",
		"my",
		"of",
		"on",
		"part",
		"the",
		"to",
		"with",
		"your"
	]);
	const words = topic
		.replace(/[#:&/(),]/g, " ")
		.split(/\s+/)
		.map(word => word.trim())
		.filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()));

	return [...new Set(words)].slice(0, 5);
}

function domainFrame(spec: SourceLibraryCourseSpec) {
	const domain = `${spec.area} ${spec.focus}`.toLowerCase();

	if (
		/math|addition|subtraction|fraction|decimal|geometry|algebra|calculus|number|measurement|coordinate/.test(
			domain
		)
	) {
		return {
			artifact:
				"worked math record with diagrams, equations, labels, and a reasonableness check",
			checks: [
				"Each number has a label or unit when context matters.",
				"The representation matches the operation or relationship being used.",
				"The final answer is checked with estimation, substitution, inverse operation, or a second representation."
			],
			process:
				"Translate the situation into a diagram, equation, table, or model before calculating. Keep intermediate steps visible so an arithmetic mistake can be found without restarting the whole problem.",
			transfer:
				"Change one number, unit, shape, graph feature, or condition and compare which parts of the solution method stay the same."
		};
	}

	if (
		/speaking|presentation|speech|toast|storyteller|radio|comedy/.test(
			domain
		)
	) {
		return {
			artifact:
				"speech outline with purpose, audience, structure, rehearsal notes, and delivery evidence",
			checks: [
				"The opening states the topic and gives the listener a reason to keep listening.",
				"Main points are ordered intentionally and supported by concrete details.",
				"Delivery notes address pacing, eye contact, gestures, vocal clarity, and revision after rehearsal."
			],
			process:
				"Separate message design from delivery practice. First define the audience, central point, and evidence. Then rehearse with a small number of specific delivery goals instead of trying to improve everything at once.",
			transfer:
				"Change the audience, time limit, tone, or speaking purpose and revise the outline so the same idea still lands clearly."
		};
	}

	if (
		/reading|literary|literature|figurative|analysis|grammar|writing|novel|story|book|narrative/.test(
			domain
		)
	) {
		return {
			artifact:
				"reading or writing record with claim, evidence, draft choices, revision notes, and final reflection",
			checks: [
				"Claims point to a specific sentence, passage detail, grammar rule, or draft choice.",
				"Explanations connect evidence to meaning instead of only quoting or naming a rule.",
				"Revision changes are visible and tied to clarity, structure, voice, audience, or mechanics."
			],
			process:
				"Start with the text or draft evidence, then explain the choice being made. For writing work, preserve at least one revision note so the final version shows how the idea improved.",
			transfer:
				"Apply the same reading, grammar, or writing move to a new passage, sentence, audience, scene, or draft section."
		};
	}

	if (
		/finance|invest|entrepreneur|business|credit|bank|portfolio|stock|income|spending/.test(
			domain
		)
	) {
		return {
			artifact:
				"decision record with assumptions, calculations, tradeoffs, risk notes, and a recommendation",
			checks: [
				"Financial assumptions are named before the calculation or decision.",
				"Benefits, costs, risks, and time horizon are compared rather than listed separately.",
				"The recommendation explains what evidence would change the decision."
			],
			process:
				"Treat each scenario as a decision under constraints. Identify the goal, the available options, the numbers or evidence, and the tradeoff before choosing a recommendation.",
			transfer:
				"Change the budget, customer, risk level, time horizon, or market condition and compare how the recommendation changes."
		};
	}

	if (
		/usaco|competitive|programming|scratch|visual programming|simulation/.test(
			domain
		)
	) {
		return {
			artifact:
				"problem-solving record with inputs, state, algorithm, test cases, and debugging notes",
			checks: [
				"The input or event model is written before coding or constructing the solution.",
				"The solution handles a normal case, a smallest case, and a case that stresses the key rule.",
				"Debugging notes identify the state change, loop, condition, or representation that controls the result."
			],
			process:
				"Name the data or event flow first. Then build the smallest working version, test it, and add only one rule or behavior at a time.",
			transfer:
				"Change a constraint, board state, input size, sprite behavior, or edge case and explain whether the same algorithm or event structure still works."
		};
	}

	return {
		artifact:
			"learning record with vocabulary, example, evidence, revision, and reflection",
		checks: [
			"The main terms are defined with examples and non-examples.",
			"The response includes evidence rather than only a final answer.",
			"The final note explains what changed, what stayed stable, and what still needs verification."
		],
		process:
			"Break the task into setup, evidence, result, and explanation. Keep each part visible so the reasoning can be checked without relying on hidden context.",
		transfer:
			"Change one condition and compare the new result to the original result."
	};
}

function conceptContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const keywords = topicKeywords(topic);
	const frame = domainFrame(spec);

	return `
**Concept path:** ${topic} is the central focus for this part of ${spec.name}. It connects to ${spec.focus}. The module record is a ${frame.artifact}, not just a completed answer.

Core topics in this module:

1. **Vocabulary and model**  
   Define the important terms in plain language, connect them to a simple example, and include one non-example so the boundary of the idea is clear.${keywords.length ? ` Key terms to watch include ${keywords.join(", ")}.` : ""}

2. **Worked example**  
   Break a typical problem, passage, speech outline, business case, or number scenario into smaller pieces. The record includes the known information, the decision point, and the evidence that supports the answer.

3. **Transfer task**  
   Change one detail from the worked example. The comparison makes the transferable rule visible instead of treating the first example as a script to copy.

4. **Evidence check**
   ${frame.process}

**Evidence checklist:**

${frame.checks.map(check => `- ${check}`).join("\n")}
	`.trim();
}

function practiceContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const frame = domainFrame(spec);
	const planning = buildSupportSectionGuidance({
		courseFamily: spec.name,
		moduleTitle: topic,
		section: "planning"
	});

	return [
		`**Goal:** Create a short ${spec.name} practice record for ${topic} with one typical case and one changed case.`,
		`**Setup:** Name the goal, the starting information, and the form of evidence needed. The expected product is a ${frame.artifact}.`,
		[
			"**Process:**",
			"1. Record the givens, constraints, audience, source text, numbers, or starting state.",
			"2. Build the first solution or draft with visible intermediate reasoning.",
			"3. Run a second case with one changed detail and compare the result.",
			"4. Write a short explanation of which rule, model, or evidence controlled the final answer."
		].join("\n"),
		[
			"**Completion evidence:**",
			...frame.checks.map(check => `- ${check}`)
		].join("\n"),
		planning
	].join("\n\n");
}

function extensionContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const frame = domainFrame(spec);
	const verification = buildSupportSectionGuidance({
		courseFamily: spec.name,
		moduleTitle: topic,
		section: "verification"
	});

	return [
		`**Goal:** Extend ${topic} in ${spec.name} by changing one constraint, audience, number set, passage detail, scenario, or design choice.`,
		`**Transfer move:** ${frame.transfer}`,
		[
			"**Extension choices:**",
			"1. Add a more difficult input, passage detail, model constraint, or audience requirement.",
			"2. Compare two solution methods, drafts, explanations, or recommendations and name the better fit for the goal.",
			"3. Turn the final answer into a short presentation, annotated example, table, diagram, or revision note.",
			"4. Add one reflection explaining what evidence would make the result more reliable."
		].join("\n"),
		"The extension keeps the original idea recognizable while testing whether the method still works under a new condition. The response includes the changed condition, the expected effect, the actual result, and one revision that would make the explanation or product stronger.",
		verification
	].join("\n\n");
}

function createSourceLibraryModule(
	spec: SourceLibraryCourseSpec,
	moduleTitle: string
): RawCourseModule {
	const topic = compactTopic(moduleTitle);

	return {
		title: moduleTitle,
		curriculum: [
			{
				title: `Concepts: ${topic}`,
				content: conceptContent(spec, moduleTitle)
			}
		],
		supplementalProjects: [
			{
				title: `Practice Map: ${topic}`,
				content: practiceContent(spec, moduleTitle)
			},
			{
				title: `Extension Review: ${topic}`,
				content: extensionContent(spec, moduleTitle)
			}
		]
	};
}

function createStaticAssetAppendix(
	courseName: string,
	staticAssets: string[] | undefined
) {
	if (!staticAssets?.length) return [];

	const uniqueAssets = [...new Set(staticAssets)].sort((left, right) =>
		left.localeCompare(right)
	);

	return [
		{
			kind: "appendix" as const,
			title: "Original Asset Reservations",
			curriculum: [
				{
					title: "Static Asset Placeholders",
					content: [
						`Archived ${courseName} material referenced the static assets below. They are reserved on the class static host so the files can be added later without changing course links.`,
						...uniqueAssets.map(
							filename =>
								`- ${staticMediaUrl(filename)}\n\n${pendingStaticMediaNotice(filename)}`
						)
					].join("\n\n")
				}
			],
			supplementalProjects: []
		}
	];
}

function createSourceLibraryCourse(spec: SourceLibraryCourseSpec): RawCourse {
	return {
		name: spec.name,
		modules: [
			...spec.modules.map(moduleTitle =>
				createSourceLibraryModule(spec, moduleTitle)
			),
			...createStaticAssetAppendix(spec.name, spec.staticAssets)
		]
	};
}

const investingCourses = {
	smartMoney: createSourceLibraryCourse({
		name: "Smart Money: Introduction to Personal Finance",
		area: "personal finance",
		focus: "income growth, spending plans, banking, credit, purchasing decisions, investing basics, and long-term financial tradeoffs",
		staticAssets: [
			"ent3_project2_0.png",
			"ent3_project2_1.png",
			"pf5_concept1_1.png",
			"pf5_concept1_2.png",
			"pf5_concept1_3.png",
			"pf5_concept1_4.png",
			"pf5_concept1_5.png",
			"pf5_concept1_6.png"
		],
		modules: [
			"PF1 Building Wealth Through Personal Finance",
			"PF2 How to Grow My Income",
			"PF3 How to Manage My Spending",
			"PF4 How to Build Credit: Making Your Small Purchases Count",
			"PF5 How to Make Smart Purchase Decisions",
			"PF6 How To Find Your Perfect Bank",
			"PF7 How to Plan for and Invest in Your Future",
			"PF8 Making Your Money Count",
			"PF9 Smart Money Master Project"
		]
	}),
	moneyMinded: createSourceLibraryCourse({
		name: "Money-Minded: Investing in the Stock Market",
		area: "investing",
		focus: "stock selection, compounding returns, risk, bonds, ETFs, diversification, company analysis, ethical investing, shorting, and cryptocurrency context",
		staticAssets: ["inv3_0.png"],
		modules: [
			"INV 1 Picking My First Stock",
			"INV 2 Strategically Choosing My Stocks",
			"INV 3 Understanding Compounding Returns",
			"INV 4 Assessing My Portfolio's Risk",
			"INV 5 Investing in Bonds and ETFs",
			"INV 6 Diversifying My Stock Portfolio",
			"INV 7 Assessing a Company's Success",
			"INV 8 Holding Companies Socially Responsible",
			"INV 9 Shorting Stocks",
			"INV 10 Understanding the Value of Cryptocurrency",
			"INV 11 Money-Minded Master Project"
		]
	}),
	entrepreneurship: createSourceLibraryCourse({
		name: "Be Your Own Boss: Entrepreneurship 101",
		area: "entrepreneurship",
		focus: "design thinking, problem discovery, customer definition, iteration, competitors, feasibility, marketing, social impact, and pitch development",
		staticAssets: [
			"ent3_project2_0.png",
			"ent3_project2_1.png",
			"ent5_project1_0.png"
		],
		modules: [
			"ENT1 Design Thinking Methodology",
			"ENT2 Learning What It Takes To Be An Entrepreneur",
			"ENT3 Solving Problems Through Entrepreneurship",
			"ENT4 Identifying the Ideal Customer",
			"ENT5 Iterating On Your Idea",
			"ENT6 Conducting Competitor Analysis",
			"ENT7 Testing Financial Feasibility",
			"ENT8 Building and Testing Marketing Strategies",
			"ENT9 Focusing on Social Impact",
			"ENT10 Be Your Own Boss Master Project"
		]
	})
} as const;

const englishCourses = {
	joyOfReading: createSourceLibraryCourse({
		name: "Early Elementary A: Discovering the Joy of Reading",
		area: "reading",
		focus: "characters, plot, literature comprehension, informational texts, figurative language, and short reading responses",
		staticAssets: ["jor2_disact_plotempty.png"],
		modules: [
			"JoR1 Characters",
			"JoR2 Plot",
			"JoR Check-In #1",
			"JoR3 Reading Literature",
			"JoR4 Reading Informational Texts",
			"JoR5 Figurative Language",
			"JoR Check-In #2",
			"JoR6 Master Project"
		]
	}),
	pictureBook: createSourceLibraryCourse({
		name: "Early Elementary B: Write Your Own Picture Book",
		area: "writing",
		focus: "story planning, parts of speech, capitalization, commas, quotation marks, opinion writing, agreement, word choice, narrative writing, presentation skills, and book revision",
		staticAssets: ["wyb1_proj1_plotempty.png"],
		modules: [
			"WYB1 Book Brainstorm I",
			"WYB2 Parts of Speech",
			"WYB3 Capitalization",
			"WYB4 Commas & Quotation Marks",
			"WYB5 Opinion Writing",
			"WYB Check-In #1",
			"WYB6 Book Brainstorm II",
			"WYB7 Subject-Verb Agreement",
			"WYB8 Word Choice",
			"WYB9 Narrative Writing",
			"WYB Check-In #2",
			"WYB10 Presentation Skills",
			"WYB11 Master Project"
		]
	}),
	publicSpeaking: createSourceLibraryCourse({
		name: "Make Your Point: Introduction to Public Speaking",
		area: "public speaking",
		focus: "introductions, toast structure, speechwriting, keynote organization, storytelling, radio pitches, argument defense, comedy timing, and polished talk delivery",
		staticAssets: ["ted_ed_release.pdf"],
		modules: [
			"MYP1 Personal Introductions",
			"MYP2 Toastmaker",
			"MYP3 Speechwriter",
			"MYP4 Keynote Speaker",
			"MYP5 Storyteller",
			"MYP6 Radio Pitch",
			"MYP7 Defense Attorney",
			"MYP8 Stand-up Comedian",
			"MYP9 Master Project: Your TED-Ed Talk"
		]
	}),
	middleSchoolLiterature: createSourceLibraryCourse({
		name: "Middle School A: Reading and Analyzing Literature",
		area: "literary analysis",
		focus: "main ideas, supporting evidence, inference, showing versus telling, theme, point of view, word choice, rhyme, alliteration, figurative language, and final analysis writing",
		modules: [
			"MSA1 Main Ideas & Supporting Evidence I",
			"MSA2 Main Ideas & Supporting Evidence II",
			"MSA3 Making Inferences",
			"MSA4 Show; Don't Tell",
			"MSA Check-In #1",
			"MSA5 Identifying Themes",
			"MSA6 Analyzing & Developing Themes",
			"MSA7 Analyzing Point of View",
			"MSA8 Analyzing Words & Phrases",
			"MSA9 Analyzing Rhyme & Alliteration",
			"MSA10 Analyzing Figurative Language",
			"MSA Check-In #2",
			"MSA11 Master Project"
		]
	}),
	middleSchoolWriting: createSourceLibraryCourse({
		name: "Middle School B: Analytical and Creative Writing",
		area: "writing",
		focus: "arguments, evidence, counterclaims, evidence analysis, transitions, revision, character development, conflict, plot, point of view, and short-story drafting",
		modules: [
			"MSB1 Arguments & Evidence",
			"MSB2 Counterclaims",
			"MSB3 Integrating Evidence",
			"MSB4 Analyzing Evidence",
			"MSB5 Concluding Statements & Transitional Devices",
			"MSB6 Color Coding & Revision",
			"MSB Check-In #1",
			"MSB7 Character Development",
			"MSB8 Character Portraits",
			"MSB9 Generating Conflict & Structuring Plot",
			"MSB10 Manipulating Point of View",
			"MSB11 Writing an Original Short Story",
			"MSB Check-In #2",
			"MSB12 Master Project"
		]
	}),
	middleSchoolWritingRetake: createSourceLibraryCourse({
		name: "Middle School B: Analytical and Creative Writing Retake",
		area: "writing reinforcement",
		focus: "targeted review of arguments, evidence, counterclaims, evidence analysis, transitions, revision, character development, conflict, plot, point of view, and short-story drafting",
		modules: [
			"MSB1 Arguments & Evidence",
			"MSB2 Counterclaims",
			"MSB3 Integrating Evidence",
			"MSB4 Analyzing Evidence",
			"MSB5 Concluding Statements & Transitional Devices",
			"MSB6 Color Coding & Revision",
			"MSB Check-In #1",
			"MSB7 Character Development",
			"MSB8 Character Portraits",
			"MSB9 Generating Conflict & Structuring Plot",
			"MSB10 Manipulating Point of View",
			"MSB11 Writing an Original Short Story",
			"MSB Check-In #2",
			"MSB12 Master Project"
		]
	}),
	grammarMechanics: createSourceLibraryCourse({
		name: "Middle School C: Grammar and Mechanics",
		area: "grammar",
		focus: "parts of speech, capitalization, punctuation, phrases, clauses, subjects, predicates, objects, sentence types, and mechanics revision",
		modules: [
			"MSC1 Nouns, Pronouns & Adjectives",
			"MSC2 Verbs, Adverbs & Verbals",
			"MSC3 Prepositions & Interjections",
			"MSC4 Coordinating & Subordinating Conjunctions",
			"MSC Check-In #1",
			"MSC5 Capitalization",
			"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks",
			"MSC7 Phrases & Clauses I",
			"MSC8 Commas",
			"MSC9 Semicolons",
			"MSC10 Colons",
			"MSC11 Common Punctuation Errors",
			"MSC12 Pauses & Breaks",
			"MSC Check-In #2",
			"MSC13 Subjects & Predicates",
			"MSC14 Direct & Indirect Objects",
			"MSC15 Phrases & Clauses II",
			"MSC16 Sentence Types",
			"MSC Check-In #3",
			"MSC17 Master Project"
		]
	}),
	novelWriting: createSourceLibraryCourse({
		name: "Novel Writing",
		area: "long-form writing",
		focus: "goal setting, protagonist and antagonist design, drafting, conflict, setting, plot structure, character development, narration, dialogue, and revision toward a complete story arc",
		modules: [
			"NW1 Course Overview & Goal Setting",
			"NW2 Developing a Protagonist and an Antagonist",
			"NW3 Novel Drafting: Introducing Your Characters",
			"NW4 Generating Conflict",
			"NW5 Novel Drafting: Setting the Scene",
			"NW6 Structuring Plot",
			"NW7 Character Development",
			"NW8 Narration",
			"Check-In #1",
			"NW9 Describing Setting",
			"NW10 Writing Dialogue",
			"NW11 Novel Drafting: Conflict",
			"NW12 Novel Drafting: Falling Action & Resolution",
			"Check-In #2"
		]
	})
} as const;

const elementaryMathCourses = {
	earlyElementaryA: createSourceLibraryCourse({
		name: "Early Elementary A: Discovering Numbers, Operations, and Measurement",
		area: "early elementary math",
		focus: "addition, subtraction, word problems, length, place value, equal groups, rectangles, time, money, data, polygons, circles, and visual math explanations",
		staticAssets: ["module_project_1_0.png"],
		modules: [
			"EEA1 Addition and Subtraction within 20",
			"EEA2 Addition and Subtraction within 100",
			"EEA3 Representing Word Problems",
			"EEA4 Module Project: Escape the Game",
			"EEA5 Measuring and Estimating Length in Standard Units",
			"EEA6 Relating Addition and Subtraction to Length",
			"EEA7 Module Project: The Longest Sandwich in California",
			"EEA8 Understanding Place Value",
			"EEA9 Adding and Subtracting within 200",
			"EEA10 Representing Advanced Word Problems",
			"EEA11 Adding and Subtracting within 1000",
			"EEA12 Strategies to Add and Subtract within 1000",
			"EEA13 Module Project: Going TikTok Famous",
			"Check-in #1",
			"EEA14 Working with Equal Groups",
			"EEA15 Partitioning Rectangles",
			"EEA16 Time",
			"EEA17 Money",
			"EEA18 Visualizing Data",
			"EEA19 Polygons and Circles",
			"EEA20 Module Project: The Next Hit iPhone",
			"Check-in #2"
		]
	}),
	earlyElementaryB: createSourceLibraryCourse({
		name: "Early Elementary B: Exploring Arithmetic, Fractions, and Geometry",
		area: "early elementary math",
		focus: "multi-digit operations, multiplication, division, word problems, measurement, area, fractions, data, perimeter, quadrilaterals, and geometric explanation",
		staticAssets: ["mfb10_concept1_0.png"],
		modules: [
			"EEB1 Adding and Subtracting within 1000",
			"EEB2 Strategies to Add and Subtract within 1000",
			"EEB3 Multiplying and Dividing within 100",
			"EEB4 Properties of Multiplication and Division",
			"EEB5 Multiplication and Division Word Problems",
			"EEB6 Applying the Four Operations",
			"EEB7 Multiples of 10",
			"EEB8 Module Project: Using Science For Good",
			"Check-in #1",
			"EEB9 Units of Measurement",
			"EEB10 Area",
			"EEB11 Module Project: Investing for the Future",
			"EEB12 Partitioning Shapes",
			"EEB13 Fractions as Numbers",
			"EEB14 Represent and Interpret Data",
			"EEB15 Perimeter",
			"EEB16 Quadrilaterals",
			"EEB17 Module Project: 2001: A Warehouse Odyssey",
			"Check-in #2"
		]
	}),
	lateElementaryA: createSourceLibraryCourse({
		name: "Late Elementary A: Investigating Multiplication, Division, and Geometry",
		area: "late elementary math",
		focus: "place value, rounding, whole-number operations, factors, multiples, multiplication, division, lines, angles, triangles, polygons, perimeter, area, and volume",
		staticAssets: ["module_project_1_0.png"],
		modules: [
			"LEA1 Place Value",
			"LEA2 Comparing and Rounding",
			"LEA3 Addition and Subtraction",
			"LEA4 Module Project: Soccer Season",
			"LEA5 Factors and Multiples",
			"LEA6 Multiplication by One-Digit Numbers",
			"LEA7 Multiplication by Two-Digit Numbers",
			"LEA8 Division by One-Digit Numbers",
			"LEA9 Module Project: Invest-a-thon",
			"Check-in #1",
			"LEA10 Lines",
			"LEA11 Angles",
			"LEA12 Triangles",
			"LEA13 Module Project: An Obtuse Life",
			"LEA14 Polygons and Perimeter",
			"LEA15 Quadrilaterals",
			"LEA16 Area and Volume",
			"LEA17 Module Project: The LA River Master Plan",
			"Check-in #2"
		]
	}),
	lateElementaryB: createSourceLibraryCourse({
		name: "Late Elementary B: Mastering Fractions, Decimals, Units, and Coordinates",
		area: "late elementary math",
		focus: "fractions, decimals, unit conversion, numerical expressions, multi-digit multiplication and division, coordinate planes, patterns, figures, and geometric reasoning",
		staticAssets: ["leb16_concept1_0.png"],
		modules: [
			"LEB1 Equivalent Fractions",
			"LEB2 Comparing and Ordering Fractions",
			"LEB3 Adding and Subtracting Fractions",
			"LEB4 Multiplying Fractions",
			"LEB5 Dividing Fractions",
			"LEB6 Module Project: Saving the Environment One Cake at a Time",
			"LEB7 Place Value with Decimals",
			"LEB8 Comparing and Rounding Decimals",
			"LEB9 Decimal Operations",
			"LEB10 Module Project: From Facebook to YouTube",
			"Check-in #1",
			"LEB11 Customary and Metric Units",
			"LEB12 Module Project: From Factory Line to Test Drive",
			"LEB13 Numerical Expressions",
			"LEB14 Multiplying by Two and Three Digit Numbers",
			"LEB15 Dividing by Two Digit Numbers",
			"LEB16 The Coordinate Plane",
			"LEB17 Patterns, Figures and Shapes in the Coordinate Plane",
			"LEB18 Module Project: Chanh's Space Adventure",
			"Check-in #2"
		]
	})
} as const;

const sourceVariantCourses = {
	scratchBootcamp: createSourceLibraryCourse({
		name: "Scratch Level 1: Game Superstar Bootcamp",
		area: "visual programming bootcamp",
		focus: "Scratch setup, sounds, motion, costumes, backdrops, event listeners, loops, conditionals, variables, and a short master project sequence",
		modules: [
			"GS1 Event Listeners and Movement",
			"GS2 Loops",
			"GS3 Conditionals and Variables",
			"GS4 Master Project"
		]
	}),
	usacoBronzeOnDemand: createSourceLibraryCourse({
		name: "USACO Bronze: On Demand",
		area: "self-paced competitive programming",
		focus: "USACO setup, file input and output, simulation, complete search, greedy reasoning, modular arithmetic, grids, strings, arrays, intervals, and contest postmortems",
		staticAssets: [
			"UB1.png",
			"UB2.png",
			"UB3.png",
			"UB4.png",
			"UB5.png",
			"UB6.png",
			"missionTitle2.png",
			"nextStepTitle.png"
		],
		modules: [
			"UB0 Welcome to USACO Bronze!",
			"UB1 Square Pasture",
			"UB2 Your Ride Is Here",
			"UB3 Friday the Thirteenth",
			"UB4 Broken Necklace",
			"UB5 Greedy Gift Givers",
			"UB6 Milking Cows",
			"UB7 Name That Number",
			"UB8 Palindromic Squares",
			"UB9 Dual Palindromes",
			"UB10 Transformations",
			"UB11 Mixing Milk",
			"UB12 Barn Repair",
			"UB13 Combination Lock",
			"UB14 Prime Cryptarithm",
			"UB15 Ski Course Design",
			"UB16 Wormholes",
			"UB17 Block Game",
			"UB18 The Cow-Signal",
			"UB19 Don't Be Last",
			"UB20 Hoof, Paper, Scissors",
			"UB21 Cow Tipping",
			"UB22 Why Did the Cow Cross the Road",
			"UB23 Why Did the Cow Cross the Road II",
			"UB24 Why Did the Cow Cross the Road III",
			"UB25 The Lost Cow",
			"UB26 Bovine Genomics",
			"UB27 Modern Art",
			"UB28 Fence Painting",
			"UB29 Speeding Ticket",
			"UB30 Contaminated Milk",
			"UB31 Promotion Counting",
			"UB32 Angry Cows",
			"UB33 Mowing the Field",
			"UB34 Milk Pails",
			"UB35 Circular Barn",
			"UB36 Load Balancing",
			"UB37 Diamond Collector",
			"UB38 Bull in a China Shop",
			"UB39 Field Reduction",
			"UB40 Blocked Billboard",
			"UB41 The Bovine Shuffle",
			"UB42 Milk Measurement",
			"UB43 Blocked Billboard II",
			"UB44 Lifeguards",
			"UB45 Out of Place",
			"UB46 Teleportation",
			"UB47 Hoofball",
			"UB48 Taming the Herd",
			"UB49 Team Tic Tac Toe",
			"UB50 Milking Order",
			"UB51 Family Tree",
			"UB52 Additional Practice Problems"
		]
	})
} as const;

export const smartMoneyPersonalFinanceCourse = investingCourses.smartMoney;
export const moneyMindedInvestingCourse = investingCourses.moneyMinded;
export const entrepreneurship101Course = investingCourses.entrepreneurship;

export const earlyElementaryJoyOfReadingCourse = englishCourses.joyOfReading;
export const earlyElementaryPictureBookCourse = englishCourses.pictureBook;
export const introductionToPublicSpeakingCourse = englishCourses.publicSpeaking;
export const middleSchoolLiteratureCourse =
	englishCourses.middleSchoolLiterature;
export const middleSchoolWritingCourse = englishCourses.middleSchoolWriting;
export const middleSchoolWritingRetakeCourse =
	englishCourses.middleSchoolWritingRetake;
export const grammarMechanicsCourse = englishCourses.grammarMechanics;
export const novelWritingCourse = englishCourses.novelWriting;

export const earlyElementaryMathACourse =
	elementaryMathCourses.earlyElementaryA;
export const earlyElementaryMathBCourse =
	elementaryMathCourses.earlyElementaryB;
export const lateElementaryMathACourse = elementaryMathCourses.lateElementaryA;
export const lateElementaryMathBCourse = elementaryMathCourses.lateElementaryB;

export const scratchLevel1BootcampCourse = sourceVariantCourses.scratchBootcamp;
export const usacoBronzeOnDemandCourse =
	sourceVariantCourses.usacoBronzeOnDemand;
