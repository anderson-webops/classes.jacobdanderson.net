import type { RawCourse, RawCourseModule } from "./types";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

interface SourceLibraryCourseSpec {
	area: string;
	focus: string;
	name: string;
	modules: string[];
	sourceActivityAnchors?: Record<string, SourceActivityAnchor[]>;
	staticAssets?: string[];
}

interface SourceActivityAnchor {
	title: string;
	prompt: string;
	evidence: string[];
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

function createSourceActivityAnchorItems(
	spec: SourceLibraryCourseSpec,
	moduleTitle: string
) {
	const anchors = spec.sourceActivityAnchors?.[moduleTitle];
	if (!anchors?.length) return [];

	const topic = compactTopic(moduleTitle);

	return [
		{
			title: `Source Activity Anchors: ${topic}`,
			content: [
				"The original source course used the concrete activity anchors below. This neutral version keeps the scenario structure, decision practice, and evidence requirements while removing platform-specific submission steps.",
				...anchors.map((anchor, index) =>
					[
						`${index + 1}. **${anchor.title}**`,
						anchor.prompt,
						"Evidence record:",
						...anchor.evidence.map(item => `- ${item}`)
					].join("\n")
				)
			].join("\n\n")
		}
	];
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
			},
			...createSourceActivityAnchorItems(spec, moduleTitle)
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
			title: "Pending Static Assets",
			curriculum: [
				{
					title: "Static Asset Placeholders",
					content: [
						`${courseName} has placeholders for the static assets below. Each URL points to the class static host and can be filled when the matching file is available.`,
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
		sourceActivityAnchors: {
			"PF1 Building Wealth Through Personal Finance": [
				{
					title: "Spend Like Bill Gates Constraint Ladder",
					prompt: "Use the spending simulator at [neal.fun/spend](https://neal.fun/spend/) as a changing-constraint case study. Compare an unlimited receipt, a responsible-use receipt, and a $500,000 plan spread across 60 years.",
					evidence: [
						"List of purchases that stayed, changed, or disappeared as the constraint became stricter.",
						"Five to seven personal values or future commitments that affect the revised spending plan.",
						"One explanation of how long-term goals change a short-term purchase decision."
					]
				},
				{
					title: "Graduate Profile and First-Month Budget",
					prompt: "Build a fictional post-graduation profile with fixed starting assumptions: $10,000 in savings, an old scooter, and $30,000 in student debt. Choose a city, starting salary, housing cost, and first-month expense plan.",
					evidence: [
						"Profile table with income, debt, savings, location, and housing assumptions.",
						"First-month Budget Planner and Expense Tracker with income, necessities, wants, debt payments, and remaining cash.",
						"Revision note explaining which profile assumption changed after the first budget pass."
					]
				},
				{
					title: "Wealth-Building Research and Financial Perspectives",
					prompt: "Research one wealthy person or interview one to three trusted adults about financial habits. Compare income sources, assets, lifestyle choices, weekly or monthly money routines, and long-term goals.",
					evidence: [
						"Research or interview notes with source names, dates, and the specific financial behaviors observed.",
						"Comparison table separating income, assets, spending habits, saving habits, and risk tolerance.",
						"Reflection connecting at least one outside perspective to the Graduate Profile decisions."
					]
				}
			],
			"PF2 How to Grow My Income": [
				{
					title: "Income Streams Comparison",
					prompt: "Compare different ways to make money, including salary growth, content revenue, part-time work, freelancing, entrepreneurship, and investing. Focus on time requirements, startup costs, skill requirements, reliability, and risk.",
					evidence: [
						"Pros and cons table for two income options beyond the main job.",
						"Skill and time estimate for each option, including one hidden cost or limitation.",
						"Decision note naming which option fits the profile and which option is too risky or impractical."
					]
				},
				{
					title: "Salary Negotiation Case",
					prompt: "Create a mock salary-increase request from the employee and employer perspectives. The case includes three to five reasons the raise could make sense and two risks or objections from the employer side.",
					evidence: [
						"Raise request with value created, evidence of performance, and proposed new salary or raise range.",
						"Employer objection list with calm responses tied to business value.",
						"Updated income tracker showing the effect of a successful, partial, or unsuccessful negotiation."
					]
				},
				{
					title: "Wild Card Ledger",
					prompt: "Track unexpected income or expense events as flat, per-month, or multi-month changes. Each event modifies the same financial profile rather than creating a separate disconnected example.",
					evidence: [
						"Ledger row with event name, amount, duration, affected month, and category.",
						"Before-and-after monthly cash comparison.",
						"Short note explaining whether the event changes the long-term recommendation."
					]
				}
			],
			"PF3 How to Manage My Spending": [
				{
					title: "Spending Style and Needs-versus-Wants Budget",
					prompt: "Use a spending-style quiz, the Bean Game, or a fictional spending scenario to separate needs, wants, savings, and debt. Translate the result into a 50/30/20 or custom budget rule.",
					evidence: [
						"Needs-versus-wants criteria written as questions that can be reused for future purchases.",
						"Budget allocation with necessities, wants, savings, and debt categories.",
						"One tradeoff case where the budget blocks a purchase that still seems desirable."
					]
				},
				{
					title: "Profile Budget Revision",
					prompt: "Use a salary estimate, income-tax calculator, and budget calculator to revise the Graduate Profile. Include yearly and monthly views so the budget can be checked at both scales.",
					evidence: [
						"Gross income, estimated taxes, net income, and monthly take-home pay.",
						"Five necessities, five wants, and three debts with yearly or monthly cost estimates.",
						"Revised expense tracker with leftover monthly cash and one possible savings decision."
					]
				}
			],
			"PF4 How to Build Credit: Making Your Small Purchases Count": [
				{
					title: "Debt Growth and Credit Card Simulation",
					prompt: "Use a debt-growth game, credit-card simulator, or calculator to connect borrowing choices with APR, repayment time, credit limit, fees, and total paid over time.",
					evidence: [
						"Definition set for credit card, APR, introductory APR, minimum payment, credit limit, and unpaid balance.",
						"Comparison of two borrowing scenarios with different interest rates or repayment behavior.",
						"Debt-management rule that would reduce risk in the Graduate Profile."
					]
				},
				{
					title: "Credit Card Selection Case",
					prompt: "Compare fictional card offers such as cash rewards, travel rewards, low APR, and high-reward/high-fee cards. Match card features to the profile holder's spending habits and debt risk.",
					evidence: [
						"Card comparison table with APR, fees, rewards, credit limit, and hidden risk.",
						"Chosen card or cards with a reason tied to the profile rather than the largest reward headline.",
						"Rejected-card note explaining who the card might fit better."
					]
				},
				{
					title: "Car Loan and Housing What-If",
					prompt: "Use loan and housing calculators to test how credit score, interest rate, down payment, rent, and purchase price change monthly obligations.",
					evidence: [
						"Two loan outcomes with the same principal and different rates or credit assumptions.",
						"Buy-versus-rent note that separates lifestyle preference from financial feasibility.",
						"Profile update showing whether the monthly payment fits the existing budget."
					]
				}
			],
			"PF5 How to Make Smart Purchase Decisions": [
				{
					title: "Long-Run Purchase Value",
					prompt: "Compare short-term cheap purchases with longer-lasting alternatives. Examples include toothbrushes, home drinks versus daily takeout, reusable dishware, groceries, furniture, and vehicle choices.",
					evidence: [
						"Cost-over-time comparison with purchase price, replacement frequency, and total cost.",
						"Quality or convenience factor that cannot be captured by price alone.",
						"Recommendation explaining when the cheaper option is actually more expensive."
					]
				},
				{
					title: "Vehicle Purchase Decision",
					prompt: "Research a new or used four-wheeled vehicle, estimate financing terms, add insurance and maintenance, and decide whether the purchase belongs in the profile budget.",
					evidence: [
						"Vehicle comparison with purchase price, down payment, loan term, monthly payment, and total interest.",
						"Recurring-cost estimate for insurance, maintenance, fuel or charging, and registration.",
						"Expense-tracker update showing the effect of fixed and variable vehicle costs."
					]
				}
			],
			"PF6 How To Find Your Perfect Bank": [
				{
					title: "Checking-versus-Savings Allocation",
					prompt: "Use a $5,000 prize scenario to decide how much belongs in checking, savings, or another account. Compare access, safety, interest, fees, minimum balances, and purpose.",
					evidence: [
						"Account allocation table matching common expenses to checking or savings.",
						"One-year interest estimate for the savings portion using a compound-interest calculator.",
						"Bank comparison with fees, interest rate, minimum balance, access, and account purpose."
					]
				},
				{
					title: "Savings Account Offer Case",
					prompt: "Compare fictional bank and credit-union offers with opening bonuses, minimum balances, monthly fees, interest rates, and loan eligibility. Choose one or more accounts for the Graduate Profile.",
					evidence: [
						"Offer table with immediate bonus, interest rate, minimum balance, fees, and restrictions.",
						"Cash-flow check showing whether the profile can maintain the required minimum balance.",
						"Recommendation naming the account choice and the evidence that would change the choice."
					]
				}
			],
			"PF7 How to Plan for and Invest in Your Future": [
				{
					title: "Retirement Savings Calculator",
					prompt: "Estimate an ideal retirement age, monthly living costs, health costs, discretionary spending, and savings rate. Compare conservative and aggressive assumptions with an investment calculator.",
					evidence: [
						"Monthly necessity, discretionary, and health-cost estimates for the target retirement location.",
						"Calculator outputs for required savings and monthly contribution.",
						"Comparison of conservative and aggressive assumptions with the risk tradeoff named clearly."
					]
				},
				{
					title: "Investment Account Allocation",
					prompt: "Compare retirement account types such as Roth IRA and 401k, then allocate monthly savings between retirement accounts, self-directed investments, and bank savings.",
					evidence: [
						"Allocation table with account type, monthly contribution, tax treatment, access constraints, and risk level.",
						"One explanation of why early access, taxes, employer match, or risk changes the recommendation.",
						"Retirement-plan diagram or written summary tied back to the Graduate Profile."
					]
				}
			],
			"PF8 Making Your Money Count": [
				{
					title: "Ethical Spending and Investing",
					prompt: "Research companies, charities, products, or funds connected to environmental or social goals. Separate marketing claims from evidence such as product materials, labor practices, charity ratings, and measurable impact.",
					evidence: [
						"Cause list with direct donation, spending-choice, investment, and non-financial support options.",
						"Evidence comparison of two or more companies, charities, or products.",
						"Budget update showing how much money, time, or attention the cause receives."
					]
				},
				{
					title: "Cause-Aligned Business or Awareness Project",
					prompt: "Design a product, service, post, proposal, or awareness campaign that supports a cause while accounting for production costs, waste, community effect, and revenue or donation assumptions.",
					evidence: [
						"Mission statement with the cause, audience, and concrete action.",
						"Budget or operations note naming expected costs, benefits, and possible unintended harm.",
						"Revision note explaining how the idea becomes more financially realistic or socially responsible."
					]
				}
			],
			"PF9 Smart Money Master Project": [
				{
					title: "Financial Journey Portfolio",
					prompt: "Create a final portfolio that traces the Graduate Profile from the initial goals through income, spending, debt, credit, banking, purchases, retirement planning, and values-based money choices.",
					evidence: [
						"Timeline of major decisions, including income changes, budget changes, wild cards, debts, and savings milestones.",
						"Final balance sheet with savings, debt, monthly cash flow, retirement plan, and chosen accounts.",
						"Reflection naming the best decision, weakest decision, and one profile assumption that would change with better evidence."
					]
				},
				{
					title: "Next-Year Outlook",
					prompt: "Project the profile one year forward using the current budget, remaining debt, expected savings, recurring wild cards, and retirement contribution plan.",
					evidence: [
						"Projected monthly or annual table with income, required expenses, discretionary spending, savings, and debt.",
						"Risk note for one or more emergency, job change, market change, or unexpected expense cases.",
						"Final recommendation for the next financial move and the evidence that supports it."
					]
				}
			]
		},
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
		sourceActivityAnchors: {
			"INV 1 Picking My First Stock": [
				{
					title: "Public Company and Stock Market Tour",
					prompt: "Use [Investopedia](https://www.investopedia.com/) to inspect Apple (AAPL), then compare Apple with another familiar company. Separate what makes a company popular from what makes it publicly traded, investable, and risky.",
					evidence: [
						"Definitions for stock market, public company, stock, investor benefit, and investor risk.",
						"Apple (AAPL) observation notes naming business strength, popularity, and one possible weakness.",
						"Pros-and-cons comparison of public markets from the company perspective and investor perspective."
					]
				},
				{
					title: "First Simulated Portfolio Entry",
					prompt: "Create a simulated portfolio plan using an imaginary $100,000 starting balance. Choose a first stock, explain the purchase rationale, then identify two additional companies to research next.",
					evidence: [
						"First stock selection with ticker, estimated share count, allocation, and purchase rationale.",
						"Expectation note naming what would count as a successful result and what evidence would cause a sell or hold decision.",
						"Watchlist of three to five companies with one reason each company is worth researching."
					]
				}
			],
			"INV 2 Strategically Choosing My Stocks": [
				{
					title: "Time-the-Market Comparison",
					prompt: "Use the Quartz time-the-market activity at [data.qz.com/2015/time-the-market](https://data.qz.com/2015/time-the-market/) to compare one buy-and-sell attempt with a hold-through-the-period strategy.",
					evidence: [
						"Two outcomes: active timing result and hold-only result.",
						"Explanation of beat the market, index, bull market, bear market, crash, and long-term trend.",
						"Strategy note explaining why short-term timing is difficult even when long-term market trends are visible."
					]
				},
				{
					title: "Index and Portfolio Strategy Check",
					prompt: "Compare the S&P 500, Dow Jones, and Nasdaq over a one-year window, then decide whether current conditions look more bullish or bearish. Use that decision to refine a simulated stock list.",
					evidence: [
						"Index comparison with S&P 500, Dow Jones, and Nasdaq notes.",
						"Trade plan for three to five stocks with share counts, estimated cost, and portfolio percentage.",
						"Reflection comparing individual stock performance with an index such as S&P 500, DJI, or QQQ."
					]
				}
			],
			"INV 3 Understanding Compounding Returns": [
				{
					title: "Compounding and Inflation Scenarios",
					prompt: "Compare a $100 birthday gift kept in a piggy bank, placed in savings at 2%, and invested with a 10% average return. Extend the comparison to 1, 5, and 10 years, then account for 2% inflation.",
					evidence: [
						"Table comparing piggy bank, savings, and investing outcomes after 1, 5, and 10 years.",
						"Inflation-adjusted note explaining buying power rather than only nominal dollars.",
						"Comparison of early investing and late investing using the age 25 versus age 35 scenarios from the source course."
					]
				},
				{
					title: "Rule of 72 Portfolio Projection",
					prompt: "For each simulated stock, estimate one-year return with `(current value - value one year ago) / value one year ago * 100`, then use the Rule of 72 to estimate doubling time.",
					evidence: [
						"One-year return calculation for at least two stocks.",
						"Rule of 72 doubling-time estimate for each calculated return.",
						"Portfolio revision note explaining whether a 10% average return seems realistic for the chosen stocks."
					]
				}
			],
			"INV 4 Assessing My Portfolio's Risk": [
				{
					title: "Dice Risk Ledger",
					prompt: "Model risk with a five-round dice game that starts at $20, costs $1 per round, and changes reward or loss based on how many guesses are allowed.",
					evidence: [
						"Five-round ledger with guesses allowed, result, money won or lost, and ending balance.",
						"Risk-reward explanation using the source table: 6 guesses has low reward and low loss, while 1 guess has high reward and high loss.",
						"Pressure and strategy note connecting the game to portfolio risk tolerance."
					]
				},
				{
					title: "Sharpe Ratio Portfolio Review",
					prompt: "Calculate a portfolio risk review using stock returns, a risk-free comparison, and the Sharpe Ratio. Treat the ratio as one tool, not a complete investing decision.",
					evidence: [
						"List of stock percentage returns used in the Sharpe Ratio review.",
						"Definition of investment portfolio, risk-free investment, return, volatility, and Sharpe Ratio.",
						"Portfolio adjustment note explaining how the risk analysis changes or confirms the strategy."
					]
				}
			],
			"INV 5 Investing in Bonds and ETFs": [
				{
					title: "Build Your Stax Diversification Review",
					prompt: "Use [Build Your Stax](https://buildyourstax.com/) as a diversification case study. Compare stocks with CDs, mutual funds, index funds, ETFs, and bond-like investments.",
					evidence: [
						"Investment-type comparison naming risk, return potential, liquidity, and diversification role.",
						"Explanation of how diversification changes total portfolio risk.",
						"Game result reflection identifying one decision that reduced risk and one decision that limited returns."
					]
				},
				{
					title: "ETF and Bond Fund Allocation",
					prompt: "Allocate part of the imaginary $100,000 portfolio to ETFs and bond funds. Consider index ETFs such as SPY, QQQ, and DIA, thematic ETFs such as BOTZ, and one to three bond funds.",
					evidence: [
						"Allocation percentage for ETFs and bond funds with a reason tied to portfolio risk.",
						"ETF table with ticker, category, expected role, and short-term or long-term purpose.",
						"Bond fund table with ticker or fund name, expected role, and return expectation."
					]
				}
			],
			"INV 6 Diversifying My Stock Portfolio": [
				{
					title: "Stock Category and Sector Rotation Map",
					prompt: "Classify stocks as cyclical, defensive, growth, blue-chip, or IPO, then connect those categories to sector rotation and the current stage of the economic cycle.",
					evidence: [
						"Definitions and examples for cyclical, defensive, growth, blue-chip, and IPO stocks.",
						"Sector rotation map explaining which categories may perform better in different economic conditions.",
						"Current-cycle note explaining which stock categories appear better aligned with the market environment."
					]
				},
				{
					title: "Category-Based Portfolio Diversification",
					prompt: "Choose stocks from multiple categories and industries, then compare their historical performance with the role they serve in the simulated portfolio.",
					evidence: [
						"At least two researched stock options in each chosen category.",
						"Purchase or watchlist table naming ticker, category, industry, reason for selection, and risk.",
						"Diversification explanation that goes beyond owning several similar stocks."
					]
				}
			],
			"INV 7 Assessing a Company's Success": [
				{
					title: "Financial Statement and P/E Ratio Review",
					prompt: "Use Tesla's public financial statements as a model for reading revenue, expenses, net income, and P/E ratio. Compare Tesla with GM to separate company performance from market valuation.",
					evidence: [
						"Definitions for revenue, expenses, net income, income statement, and P/E ratio.",
						"Tesla trend notes for revenue and net income over multiple reporting periods.",
						"Tesla-versus-GM comparison explaining why a higher valuation may or may not be justified."
					]
				},
				{
					title: "Undervalued Stock Candidate Review",
					prompt: "Find one or two stocks that may be undervalued, review their income statements, calculate or look up their P/E ratios, and decide whether they belong in the simulated portfolio.",
					evidence: [
						"Candidate table with ticker, industry, revenue trend, net income trend, and P/E ratio.",
						"Undervalued thesis explaining the evidence and the uncertainty.",
						"Portfolio change note naming any additions, removals, or holds caused by the analysis."
					]
				},
				{
					title: "Private Company Ranking Case",
					prompt: "Use [Republic.co](https://republic.co/) as a private-company research case. Rank three startup opportunities using differentiation, team, business/product evaluation, mission and impact, and one additional criterion.",
					evidence: [
						"Top-three ranking with evidence for differentiation, team, product value, and mission or impact.",
						"Additional criteria list informed by startup failure patterns such as market need, business model, competition, or execution risk.",
						"Final recommendation explaining why the top-ranked company is stronger than the runner-up."
					]
				}
			],
			"INV 8 Holding Companies Socially Responsible": [
				{
					title: "ESG Criteria and Reliability Review",
					prompt: "Study environmental, social, and governance criteria, then compare sample ESG score evidence for companies such as Alphabet, Disney, and PepsiCo.",
					evidence: [
						"Definitions for environmental, social, governance, ESG score, and socially responsible investing.",
						"Priority list naming two or three criteria that matter most for an investing decision.",
						"Reliability note explaining why ESG scores are useful but incomplete."
					]
				},
				{
					title: "Values-Aligned Portfolio Update",
					prompt: "Research companies whose practices align with priorities such as environmental responsibility, worker treatment, or community impact. Examples from the source include PLUG, FCEL, CRM, and ABNB.",
					evidence: [
						"Research notes for two or three companies with cited evidence of positive or negative practices.",
						"Estimated ESG or values-alignment score with a clear reason.",
						"Portfolio update explaining which shares are added, kept, or replaced because of the values screen."
					]
				}
			],
			"INV 9 Shorting Stocks": [
				{
					title: "Short Selling and Short Squeeze Case",
					prompt: "Use the Jordans resale analogy to explain short selling, then analyze a short squeeze case such as GameStop. Separate potential profit from unlimited-loss risk.",
					evidence: [
						"Short-selling explanation with borrow, sell, price drop, buy back, and return steps.",
						"Loss scenario showing what happens when the price rises instead of falls.",
						"Short squeeze summary naming the mechanism, recent example, and risk lesson."
					]
				},
				{
					title: "Overvalued Company Short Plan",
					prompt: "Find one to three companies that may be overvalued, use financial metrics or a research source such as Chartmill, and create a short-position plan with an exit rule.",
					evidence: [
						"Candidate table with overvaluation evidence and uncertainty.",
						"Short-position plan naming share count, entry rationale, risk cap, and buy-to-cover exit condition.",
						"Portfolio risk note explaining why each candidate is or is not appropriate for shorting."
					]
				}
			],
			"INV 10 Understanding the Value of Cryptocurrency": [
				{
					title: "Cryptocurrency Value Comparison",
					prompt: "Define cryptocurrency, compare how fiat money and cryptocurrencies gain value, and inspect popular coins through a price list such as Coinbase's public price directory.",
					evidence: [
						"Definition of cryptocurrency, blockchain-based transfer, fiat currency, and market capitalization.",
						"Comparison of Bitcoin, Ethereum, and Dogecoin by purpose, market capitalization, and coin issuance.",
						"Advantages-and-disadvantages list covering volatility, access, decentralization, speculation, and practical use."
					]
				},
				{
					title: "Bitcoin Historical Return Case",
					prompt: "Use a Bitcoin historical price chart such as [Coindesk's Bitcoin price page](https://www.coindesk.com/price/bitcoin) to compare buying near the 2018 peak, after the 2018 crash, and near the original low-price period.",
					evidence: [
						"Price comparison for a 2018 peak purchase, a post-crash purchase, and a 2010-style early-price scenario.",
						"Percentage gain or loss calculation for at least one scenario.",
						"Investment thesis explaining whether cryptocurrency fits the portfolio and what risk evidence limits the conclusion."
					]
				}
			],
			"INV 11 Money-Minded Master Project": [
				{
					title: "Investment Strategy Pitch",
					prompt: "Create a final pitch for a hypothetical brokerage-account funding request. The pitch explains what the money will be invested in, how the portfolio is diversified, and how the strategy handles risk, growth, ethics, and possible cryptocurrency exposure.",
					evidence: [
						"Portfolio allocation with stocks, ETFs, bond funds, possible cryptocurrency, and cash or reserve assumptions.",
						"Growth projection with expected return, time horizon, risk level, and evidence that could change the plan.",
						"Implementation plan naming brokerage or app choice, profit-sharing or accountability rules, and responsible-use constraints."
					]
				},
				{
					title: "Private Company Re-Evaluation",
					prompt: "Return to the Republic.co private-company ranking case and decide whether the original top-three choices still hold up when new opportunities or better criteria are available.",
					evidence: [
						"Updated top-three ranking with old and new company comparisons.",
						"Criteria audit explaining which research criteria changed after completing the course.",
						"Final decision note explaining whether the original ranking is confirmed or revised."
					]
				}
			]
		},
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
		sourceActivityAnchors: {
			"ENT1 Design Thinking Methodology": [
				{
					title: "Business Canvas Preview",
					prompt: "Start the course by previewing the final business canvas. Use a Lean Canvas-style structure to connect the problem, solution, key metrics, value proposition, unfair advantage, channels, target customers, cost structure, and revenue streams.",
					evidence: [
						"Draft canvas with each major box labeled, even when some boxes still contain open questions.",
						"Two feedback questions for an entrepreneur, business owner, or other knowledgeable reviewer.",
						"Revision note explaining which business assumption needs the most evidence."
					]
				},
				{
					title: "Ideal Wallet Design Sprint",
					prompt: "Run a short design-thinking sprint around a wallet or small everyday object. Interview a user, write a point-of-view statement, sketch three possible solutions, gather feedback, and revise the strongest design.",
					evidence: [
						"Interview notes naming what the user stores, worries about, or wants easier access to.",
						"Point-of-view statement in the form: user needs a way to ___ because or but ___.",
						"Three concept sketches plus a final iteration note based on feedback."
					]
				}
			],
			"ENT2 Learning What It Takes To Be An Entrepreneur": [
				{
					title: "Entrepreneur Strengths and Values Sketch",
					prompt: "Create a founder profile that names three to five strengths and two to four values. Connect each strength or value to how a future customer, teammate, or investor might judge the business.",
					evidence: [
						"Founder sketch or profile with strengths, values, and one concrete behavior for each value.",
						"Example of a real entrepreneur or company whose choices either reinforced or weakened trust.",
						"Reflection explaining why values can become harder to protect as a company grows."
					]
				},
				{
					title: "Brand Foundation Website Page",
					prompt: "Create an About or brand-foundation page for the developing business. Include founder values, a brief origin story, and the motivation behind the company before the product is fully defined.",
					evidence: [
						"About-page draft with founder strengths, values, and business motivation.",
						"Customer-facing sentence explaining why those values matter to the buyer.",
						"Revision note naming which claim sounds generic and how to make it more specific."
					]
				},
				{
					title: "Empathy Observation Persona",
					prompt: "Observe a person, pet, or realistic daily routine and record pain points, frustrations, habits, and needs. Translate the observation into a simple persona that can guide later problem selection.",
					evidence: [
						"Observation notes organized into story, pain points, frustrations, habits, and needs.",
						"Persona summary with one specific problem worth solving.",
						"Evidence note separating observed behavior from assumptions about motivation."
					]
				}
			],
			"ENT3 Solving Problems Through Entrepreneurship": [
				{
					title: "Problem Statement and Initial Solution",
					prompt: "Convert empathy notes into a concrete problem statement, then propose an initial product, service, or brand solution. Compare the statement to examples such as Duolingo, Airbnb, or Uber to check clarity.",
					evidence: [
						"Problem statement that names a target user, pain point, and reason the problem matters.",
						"Initial solution statement that directly answers the problem rather than listing features only.",
						"Search or market-interest notes, such as common questions people ask about the problem."
					]
				},
				{
					title: "Product or Service Prototype",
					prompt: "Build a first prototype. A product idea can use a labeled sketch or simple 3D model; a service idea can use a customer flowchart from first request through delivery and follow-up.",
					evidence: [
						"Prototype artifact with labels explaining the important parts of the product or service.",
						"Customer journey or use case showing how the prototype solves the selected problem.",
						"Website or one-page description that explains the prototype in customer-facing language."
					]
				},
				{
					title: "Name, Logo, Tagline, and Feedback Survey",
					prompt: "Give the company a recognizable identity and prepare feedback collection. Create a name, logo, and tagline, then write survey questions that gather specific reactions to the prototype.",
					evidence: [
						"Brand identity draft with name, logo concept, tagline, and reason each choice fits the customer.",
						"Survey with open-ended questions about usefulness, price, concerns, and likelihood of use.",
						"Feedback plan naming three to five possible respondents and what each can evaluate."
					]
				}
			],
			"ENT4 Identifying the Ideal Customer": [
				{
					title: "Coffee Shop Customer Needs Simulation",
					prompt: "Use the coffee shop simulation at [coolmathgames.com/0-coffee-shop](https://www.coolmathgames.com/0-coffee-shop) as a customer-needs case study. Track how price, recipe, weather, and customer comments affect sales.",
					evidence: [
						"Daily notes recording price, recipe choices, sales, and customer feedback patterns.",
						"Observation explaining how one customer complaint led to a changed business decision.",
						"Conclusion about why a product that is technically good can still fail if the buyer rejects price or fit."
					]
				},
				{
					title: "Ideal Customer Persona Profile",
					prompt: "Define one ideal customer with age range, income range, education or background, location, needs, values, blockers, habits, and motivators. The persona must be specific enough to guide product and marketing decisions.",
					evidence: [
						"Customer persona with demographic details, needs, motivators, blockers, and buying habits.",
						"List of two to five real or realistic people who fit the persona.",
						"Reasoning note explaining which persona detail changes the business plan the most."
					]
				},
				{
					title: "Customer Feedback Survey Draft",
					prompt: "Write five to ten open-ended survey questions for potential customers. Include questions about willingness to pay, frequency of use, concerns, and desired changes without forcing yes-or-no answers.",
					evidence: [
						"Survey draft with open-ended wording and no leading answer choices.",
						"Question map showing which product assumption each question tests.",
						"Revision note improving one biased or vague question."
					]
				}
			],
			"ENT5 Iterating On Your Idea": [
				{
					title: "Feedback Interpretation and Iteration Plan",
					prompt: "Review prototype and persona-survey feedback. Separate improvements, keepers, conflicting responses, and surprising results, then choose which feedback will drive the next prototype version.",
					evidence: [
						"Feedback table grouped by improvement, keep, conflict, and surprise.",
						"Iteration plan with specific changes and the customer evidence behind each change.",
						"Decision note explaining how conflicting feedback was resolved."
					]
				},
				{
					title: "Revised Prototype Evidence Summary",
					prompt: "Revise the prototype using the iteration plan. Summarize what changed, what evidence caused the change, and which unresolved concern still needs testing.",
					evidence: [
						"Before-and-after prototype comparison.",
						"Change log connecting each revision to survey or interview evidence.",
						"Next-test question focused on the riskiest remaining assumption."
					]
				}
			],
			"ENT6 Conducting Competitor Analysis": [
				{
					title: "Competitor Positioning Matrix",
					prompt: "Research similar companies and place them on a two-axis positioning matrix such as price versus quality. Use the map to identify the company niche and possible differentiation strategy.",
					evidence: [
						"Competitor list with two chosen comparison dimensions and notes for each company.",
						"Positioning matrix showing where the new company fits relative to competitors.",
						"Differentiation note naming whether the strategy resembles disruptive, new-market, integrative, or sustaining innovation."
					]
				},
				{
					title: "Competitor Question Research",
					prompt: "Write questions for competitors or competitor research, then collect answers from public websites, product pages, reviews, or direct outreach when appropriate.",
					evidence: [
						"Question list about problem solved, target customer, product difference, functionality, and motivation to buy.",
						"Research notes with source links or dates.",
						"Prototype update based on one competitor strength and one competitor weakness."
					]
				}
			],
			"ENT7 Testing Financial Feasibility": [
				{
					title: "Price and Competitor Comparison",
					prompt: "Choose a tentative price using customer feedback and competitor prices. Separate one-time purchases from recurring-fee models and explain why the selected model fits the product or service.",
					evidence: [
						"Pricing table with customer willingness-to-pay evidence and competitor prices.",
						"Decision note explaining one-time versus recurring pricing.",
						"Advertisement sketch or landing-page copy that displays the chosen price clearly."
					]
				},
				{
					title: "Production Cost and Profit Margin Forecast",
					prompt: "Estimate the cost of production or service delivery, then calculate revenue, costs, profit, and profit margin for a first-year scenario with 1,000 customers.",
					evidence: [
						"Materials, tools, labor, software, or operating-cost list with estimated prices.",
						"Profit-margin calculation and industry comparison note.",
						"First-year forecast with revenue, total cost, profit, and margin at the final chosen price."
					]
				}
			],
			"ENT8 Building and Testing Marketing Strategies": [
				{
					title: "One-Sentence Value Proposition",
					prompt: "Synthesize product experience, customer needs, competitor differences, and benefits into one clear value proposition. The statement must name what makes the offer useful and distinct.",
					evidence: [
						"Notes on customer feeling, features, benefits, persona needs, motivators, blockers, and competitor gaps.",
						"One-sentence value proposition placed where a customer would see it first.",
						"Revision note cutting vague or duplicate wording from the proposition."
					]
				},
				{
					title: "Channels and Launch Campaign Sketch",
					prompt: "Choose sales and promotion channels based on the ideal customer's habits. Review consistent marketing from known companies, then sketch launch posts or website sections for the company.",
					evidence: [
						"Channel decision explaining online, in-store, website, social, marketplace, or retailer choices.",
						"Marketing reference notes from at least three companies with clear brand consistency.",
						"Launch campaign draft with offer, audience, call to action, and visual or written style notes."
					]
				}
			],
			"ENT9 Focusing on Social Impact": [
				{
					title: "Impact Risk and Alternative Materials Review",
					prompt: "Identify possible environmental or community harms from production, labor, packaging, maintenance, or distribution. Research alternatives that reduce harm and update the cost assumptions accordingly.",
					evidence: [
						"Impact-risk list tied to specific materials, labor conditions, packaging, energy, or supply-chain choices.",
						"Alternative-practice research with costs, benefits, and tradeoffs.",
						"Updated price or cost calculation showing how the impact choice changes feasibility."
					]
				},
				{
					title: "Cause-Aligned Website Page and Campaign",
					prompt: "Create a cause-aligned page or campaign that explains the company's social or environmental commitment with concrete evidence instead of vague claims.",
					evidence: [
						"Cause page draft with the chosen cause, business practice, and measurable evidence.",
						"Promotional post or campaign outline focused on awareness and customer trust.",
						"Credibility check naming which claim needs a source, number, or clearer boundary."
					]
				}
			],
			"ENT10 Be Your Own Boss Master Project": [
				{
					title: "Lean Business Canvas Portfolio",
					prompt: "Finalize the business canvas by connecting work from the full course: problem, solution, metrics, value proposition, unfair advantage, channels, customers, costs, and revenue streams.",
					evidence: [
						"Completed canvas or slide deck with all major business-model sections.",
						"Supporting artifacts from customer research, prototype iteration, competitor analysis, pricing, marketing, and impact work.",
						"Final website or landing-page cleanup checklist."
					]
				},
				{
					title: "Entrepreneur Feedback and Pitch Revision",
					prompt: "Present the business plan to an entrepreneur, business owner, or knowledgeable reviewer. Gather feedback on clarity, feasibility, differentiation, and presentation, then revise the pitch.",
					evidence: [
						"Feedback notes answering what works, what does not work, what is unclear, and what can improve.",
						"Revision log showing what changed after feedback.",
						"Final pitch outline with problem, customer, solution, proof, business model, and ask or next step."
					]
				}
			]
		},
		staticAssets: [
			"ent3_project2_0.png",
			"ent3_project2_1.png",
			"ent4_project2_0.png",
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
		staticAssets: [
			"jor2_disact_plotempty.png",
			"jor2_disact_plotexample.png"
		],
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
		sourceActivityAnchors: {
			"MYP1 Personal Introductions": [
				{
					title: "Two-Minute Self Introduction",
					prompt: "Prepare and deliver a two-minute introduction that includes basic identity details, background, and a few specific interests or experiences. Treat the introduction as a mini-speech with an opening, main points, and a closing summary.",
					evidence: [
						"Outline that separates opening, main points, and closing summary.",
						"Delivery notes for confidence, pacing, and reduced filler words such as like and um.",
						"Reflection comparing the first version with a revised version."
					]
				},
				{
					title: "Introduce Another Person",
					prompt: "Create a short introduction for another real or fictional person. Include a visual support plan, the details that define who the person is, and the tone that fits the audience.",
					evidence: [
						"Profile notes naming the person's background, interests, and one memorable detail.",
						"Visual support sketch or description that reinforces the introduction without replacing the speaker.",
						"Delivery checklist for confident voice, clear structure, and controlled filler words."
					]
				}
			],
			"MYP2 Toastmaker": [
				{
					title: "Toast Outline and Delivery Notes",
					prompt: "Turn a toast outline into a short performance plan. The speech honors a person or group, keeps a conversational tone, and uses notes rather than a word-for-word script.",
					evidence: [
						"Toast outline with opening, meaningful details, and closing sentiment.",
						"Eye-contact cues placed at important moments in the outline.",
						"Revision note explaining how tone, pacing, or eye contact changed after rehearsal."
					]
				}
			],
			"MYP4 Keynote Speaker": [
				{
					title: "Annotated Keynote Performance",
					prompt: "Prepare a keynote speech from an annotated outline. Mark places for emphasis, gestures, enacted phrases, pacing, enunciation, and open posture.",
					evidence: [
						"Annotated outline with two emphasis cues and one enacted-gesture cue.",
						"Visual theme or slide/backdrop plan connected to the speech topic.",
						"Rehearsal note naming one pacing change, one clarity change, and one body-language change."
					]
				}
			],
			"MYP5 Storyteller": [
				{
					title: "Personal Narrative Performance",
					prompt: "Build a true-story performance from a personal narrative outline. The performance uses a hook, a clear sequence of events, a lesson or point, and conversational delivery from notes.",
					evidence: [
						"Narrative outline with hook, key scene, conflict or turning point, and ending lesson.",
						"Two eye-contact cues and two gesture or emphasis cues.",
						"Delivery reflection on whether the story sounded conversational rather than read aloud."
					]
				}
			],
			"MYP6 Radio Pitch": [
				{
					title: "Five-Minute Media Pitch",
					prompt: "Pitch a TV show or movie as the best choice for a specific audience. Limit the pitch to five minutes, organize the main details quickly, and revise the delivery after one feedback pass.",
					evidence: [
						"Three-minute planning outline with the title, audience, main claim, and strongest details.",
						"Pitch structure with opening hook, reasons, examples, and closing recommendation.",
						"Before-and-after note explaining what changed in the second delivery."
					]
				}
			],
			"MYP7 Defense Attorney": [
				{
					title: "Happiness v. Money Case Argument",
					prompt: "Use the case question 'Can money buy happiness?' to prepare a courtroom-style argument. Build a claim, supporting evidence, counterargument, and closing statement for one side of the case.",
					evidence: [
						"Three pieces of evidence that support the chosen side.",
						"Counterargument with a concise response supported by two reasons.",
						"Closing statement that summarizes the argument and includes delivery notes for eye contact, pacing, enunciation, gestures, and posture."
					]
				}
			],
			"MYP8 Stand-up Comedian": [
				{
					title: "Stand-Up Routine Performance",
					prompt: "Draft and perform a four-to-five-minute stand-up routine from an outline. Keep the tone conversational, mark gesture and eye-contact cues, and rehearse enough to speak from memory rather than reading line by line.",
					evidence: [
						"Routine outline with setup, joke sequence, transitions, and closing beat.",
						"Two eye-contact cues and two gesture or emphasis cues.",
						"Rehearsal note describing timing, filler-word control, and whether the routine landed clearly."
					]
				}
			],
			"MYP9 Master Project: Your TED-Ed Talk": [
				{
					title: "Ideas Worth Spreading Analysis",
					prompt: "Analyze TED-Ed-style talks for through-line, body language, visual aids, emotional effect, and the qualities that make an idea worth spreading.",
					evidence: [
						"Notes from several talks naming through-line, gestures, visual aids, and audience effect.",
						"Pattern list of qualities shared by strong ideas worth spreading.",
						"Draft criteria for choosing a personal talk topic."
					]
				},
				{
					title: "TED-Style Talk Portfolio",
					prompt: "Prepare a polished talk with a central idea, supporting stories or arguments, visual aids, rehearsal plan, delivery notes, and production-quality checklist.",
					evidence: [
						"Talk script or outline with through-line, supporting sections, and closing idea.",
						"Visual-aid plan that highlights points without carrying the whole message.",
						"Production checklist covering landscape framing, clear lighting, audible sound, clean edits, file format, and copyright-safe materials."
					]
				}
			]
		},
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
		staticAssets: ["msa1_concept1_mainideasupportingevidence.png"],
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
		staticAssets: [
			"msa15_concept2_transitionaldevices.png",
			"msa17_concept2_nemochart.png",
			"msa19_concept2_emptyplot.png",
			"msa19_concept2_labeledplot.png"
		],
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
		staticAssets: [
			"msa15_concept2_transitionaldevices.png",
			"msa17_concept2_nemochart.png",
			"msa19_concept2_emptyplot.png",
			"msa19_concept2_labeledplot.png"
		],
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
		staticAssets: [
			"nw6_blank_narrative_arc.jpg",
			"nw6_narrative_arc_definitions.jpg"
		],
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
		staticAssets: [
			"check_in_1_length_0.png",
			"check_in_1_sums_0.png",
			"check_in_1_sums_1.png",
			"check_in_2_additional_0.png",
			"check_in_2_money_1.png",
			"check_in_2_multiplication_0.png",
			"check_in_2_multiplication_1.png",
			"check_in_2_multiplication_2.png",
			"check_in_2_time_0.png",
			"mfa18_pset1_0.png",
			"module_example.png",
			"module_project_1_0.png"
		],
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
		staticAssets: [
			"checkin2_app_0.png",
			"checkin2_gm_2.png",
			"checkin2_gm_3.png",
			"checkin2_gm_4.png",
			"checkin2_ma_0.png",
			"mfb10_concept1_0.png",
			"mfb14_pset1_0.png",
			"mfb14_pset1_1.png",
			"mfb14_pset1_2.png",
			"mfb14_pset1_3.png",
			"mfb14_pset1_4.png",
			"module_example.png"
		],
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
		staticAssets: [
			"check_in_1_multiplication_0.png",
			"check_in_1_multiplication_1.png",
			"check_in_1_multiplication_3.png",
			"check_in_2_lines_0.png",
			"check_in_2_lines_2.png",
			"check_in_2_lines_4.png",
			"check_in_2_lines_5.png",
			"checkin1_app_0.png",
			"maa1_pset1_0.png",
			"maa6_pset1_0.png",
			"maa6_pset1_1.png",
			"maa6_pset1_2.png",
			"maa6_pset1_3.png",
			"maa6_pset1_4.png",
			"maa7_pset1_0.png",
			"maa7_pset1_1.png",
			"maa7_pset1_10.png",
			"maa7_pset1_11.png",
			"maa7_pset1_2.png",
			"maa7_pset1_6.png",
			"maa7_pset1_7.png",
			"maa7_pset1_8.png",
			"maa7_pset1_9.png",
			"maa7_pset2_0.png",
			"maa7_pset2_1.png",
			"maa7_pset2_2.png",
			"maa7_pset2_3.png",
			"maa7_pset3_0.png",
			"maa7_pset3_1.png",
			"maa7_pset3_2.png",
			"maa7_pset3_3.png",
			"maa7_pset3_4.png",
			"maa7_pset3_5.png",
			"maa7_pset3_6.png",
			"maa7_pset3_7.png",
			"maa7_pset3_8.png",
			"maa7_pset3_9.png",
			"module_example.png",
			"module_project_1_0.png"
		],
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
		staticAssets: [
			"checkin1_fractions_0.png",
			"checkin1_fractions_1.png",
			"leb16_concept1_0.png",
			"leb16_pset1_0.png",
			"leb16_pset1_2.png",
			"leb16_pset1_3.png",
			"module_example.png"
		],
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
