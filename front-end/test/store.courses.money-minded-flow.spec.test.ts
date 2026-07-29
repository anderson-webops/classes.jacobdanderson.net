import { describe, expect, it } from "vitest";
import { moneyMindedInvestingCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
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
];

function requireModule(title: string) {
	const module = moneyMindedInvestingCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Money-Minded module ${title}.`);
	return module;
}

describe("Money-Minded investing learner flow", () => {
	it("uses one paper portfolio from baseline hypothesis through strategy brief", () => {
		expect(
			moneyMindedInvestingCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			requireModule("INV 1 Picking My First Stock").curriculum[0]?.content
		).toContain("baseline hypothesis");
		expect(
			requireModule("INV 11 Money-Minded Master Project").curriculum[0]
				?.content
		).toContain("analytical strategy brief");
	});

	it("gives every module pacing, analysis targets, and explicit paths", () => {
		for (const module of moneyMindedInvestingCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("keeps advanced and high-risk cases optional without deleting them", () => {
		const requiredCount = moneyMindedInvestingCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = moneyMindedInvestingCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const options = moneyMindedInvestingCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => ({
				path: item.learningPath,
				title: item.title
			}))
		);

		expect(requiredCount).toBe(27);
		expect(optionCount).toBe(29);
		for (const challenge of [
			"Sharpe Ratio Portfolio Review",
			"Stock Category and Sector Rotation Map",
			"Overvalued Company Short Plan"
		]) {
			expect(options).toContainEqual({
				path: "challenge",
				title: challenge
			});
		}
		for (const choice of [
			"Build Your Stax Diversification Review",
			"Private Company Ranking Case",
			"Bitcoin Historical Return Case",
			"Private Company Re-Evaluation"
		]) {
			expect(options).toContainEqual({ path: "choice", title: choice });
		}
	});

	it("requires dated evidence and never directs real financial activity", () => {
		expect(
			requireModule("INV 2 Strategically Choosing My Stocks")
				.curriculum[0]?.content
		).toContain("dated index data");
		expect(
			requireModule("INV 7 Assessing a Company's Success").curriculum[0]
				?.content
		).toContain("matched reporting periods");
		expect(
			requireModule("INV 9 Shorting Stocks").curriculum[0]?.content
		).toContain("no real borrowing, trade, or recommendation");
		expect(
			requireModule("INV 10 Understanding the Value of Cryptocurrency")
				.curriculum[0]?.content
		).toContain(
			"Wallet setup, coin purchase, and real-money use are not required"
		);
		expect(
			requireModule("INV 11 Money-Minded Master Project").curriculum[0]
				?.content
		).toContain(
			"brokerage funding, public promotion, and real transactions are not required"
		);
	});

	it("provides tool fallbacks and removes the unavailable compounding image", () => {
		const text = moneyMindedInvestingCourse.modules
			.flatMap(module => [
				module.title,
				...module.curriculum.map(item => item.content),
				...module.supplementalProjects.map(item => item.content)
			])
			.join("\n");

		expect(
			requireModule("INV 2 Strategically Choosing My Stocks")
				.curriculum[0]?.content
		).toContain("instructor-supplied price table");
		expect(
			requireModule("INV 3 Understanding Compounding Returns")
				.curriculum[0]?.content
		).toContain("text table or calculator");
		expect(
			moneyMindedInvestingCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
		expect(text).not.toContain("inv3_0.png");
	});
});
