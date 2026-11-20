import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	copyClassroomCourseModules,
	createClassroomLaunchModule
} from "./classroom-course";
import {
	PYTHON_LEVEL_2_PS1_SOURCE,
	PYTHON_LEVEL_2_PS2_SOURCE,
	PYTHON_LEVEL_2_PS3_SOURCE,
	PYTHON_LEVEL_2_PS4_SOURCE,
	pythonLevel2Course
} from "./python-level-2";

const PYTHON_LEVEL_2_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/main";

const pinnedLaunchSources: Record<string, string> = {
	"PS1-Mad-Libs": PYTHON_LEVEL_2_PS1_SOURCE,
	"PS2-Change-Machine": PYTHON_LEVEL_2_PS2_SOURCE,
	"PS3-Caesar-Cipher": PYTHON_LEVEL_2_PS3_SOURCE,
	"PS4-Rock-Paper-Scissors": PYTHON_LEVEL_2_PS4_SOURCE,
	"PS13-Wordsmith":
		"https://github.com/instruction-material/Python-Level-2/tree/a840f54eb6a55718f6305544adc937c32fa516ee"
};

function launchProject(
	title: string,
	content: string,
	sourcePath: string,
	learningPath: "choice" | "challenge"
): RawCourseModuleItem {
	const source = pinnedLaunchSources[sourcePath] ?? PYTHON_LEVEL_2_SOURCE;
	return {
		title,
		content,
		learningPath,
		solutionLink: `${source}/${sourcePath}/solution`
	};
}

const classroomLaunchModule = createClassroomLaunchModule({
	courseId: "python-level-2-classroom",
	courseFlow:
		"Build Mad Libs Studio and Change Machine together as the shared launch, then continue through the remaining projects by concept. Wordsmith and Blackjack are the harder integrated systems; the remixes remain supplemental practice.",
	coreItems: [
		{
			title: "Classroom Workflow: Run, Normal, Hard",
			content: `Each classroom project begins with a working program or a substantial completed framework. Run it unchanged, describe the input-to-output or state-change path, and locate the labeled student sections before editing.

Complete the **Normal** section first. Save and demonstrate that checkpoint before attempting **Hard**. Hard is a separate extension and may remain empty without breaking the completed framework.

During a class share, show one representative input, one boundary or invalid input, and one repair. Explain the section you changed rather than reading the entire completed program aloud.`
		},
		launchProject(
			"Launch Project 1: Mad Libs Studio",
			`The completed framework collects words and assembles a readable story so the first run already produces a complete result.

**Normal:** Complete the labeled addition by collecting one more clearly named word and using it in the story output.

**Hard:** Add input cleanup, a second story path, or replay without duplicating the complete story-building framework.`,
			"PS1-Mad-Libs",
			"choice"
		),
		launchProject(
			"Launch Project 2: Change Machine",
			`The completed program converts cents into coin counts and provides a concrete loop-and-remainder trace to inspect.

**Normal:** Complete the labeled addition with one extra output that reports or checks the remaining value after a conversion step.

**Hard:** Add validation for negative or nonnumeric input, then compare at least three boundary values without rewriting the working conversion logic.`,
			"PS2-Change-Machine",
			"choice"
		),
		launchProject(
			"Launch Project 3: Caesar Cipher Lab",
			`The framework shifts each ASCII letter and restores the original text with the opposite shift. It preserves uppercase and lowercase and carries punctuation through unchanged.

**Normal:** Show the original, shifted, and restored strings together with the shift used. With Az! and shift 1, compare Az!, Ba!, and Az!.

**Hard:** Add an encode or decode choice that works with a message entered in either form. Choose decode, enter Ba! and shift 1, and verify that only Az! is returned.`,
			"PS3-Caesar-Cipher",
			"choice"
		),
		launchProject(
			"Launch Project 4: Rock, Paper, Scissors Arena",
			`The completed game accepts two moves and reports a winner, a tie, or an invalid round.

**Normal:** Add a round summary with both normalized moves. Rock and Paper should display rock and paper before the Player 2 result.

**Hard:** Add a practice mode with a fixed Player 2 move. Set it to scissors, enter rock for Player 1, and confirm Player 1 wins. Preserve rejection of an invalid Player 1 move.`,
			"PS4-Rock-Paper-Scissors",
			"choice"
		),
		launchProject(
			"Launch Project 5: Song Generator",
			`The framework stores notes in a list and assembles them into a generated sequence.

**Normal:** Add one list operation that changes the order, length, or repeated pattern of the song.

**Hard:** Add a second collection for durations or measures and verify that every generated note has matching timing data.`,
			"PS6-Song-Generator",
			"choice"
		),
		launchProject(
			"Launch Project 6: To-Do List Manager",
			`The completed command loop can add, inspect, and update tasks without requiring students to build the menu framework from nothing.

**Normal:** Add one list command with a clear success message and a safe empty-list or invalid-index case.

**Hard:** Add priorities, completion state, search, or file persistence while preserving all existing commands.`,
			"PS10-Todo-List",
			"choice"
		),
		launchProject(
			"Launch Project 7: Wordsmith Challenge",
			`The framework selects letters, loads valid words, times a round, and checks submitted words.

**Normal:** Change the labeled word_score(word) helper to add one scoring rule based on word length or letter use; demonstrate an accepted word with the changed score.

**Hard:** Change the labeled choose_letters helper to guarantee a vowel, or add replay, difficulty or high scores while preserving duplicate rejection and the round deadline.`,
			"PS13-Wordsmith",
			"challenge"
		),
		launchProject(
			"Launch Project 8: Blackjack Table",
			`The completed game models cards, hands, player choices, dealer behavior, and the main win-loss-tie outcomes.

**Normal:** Add one clearly named helper or display feature for a hand value or round result.

**Hard:** Add ace handling, richer card representation, replay, betting, or statistics and test bust, blackjack, tie, and dealer-boundary cases.`,
			"PS14-Advanced-Blackjack",
			"challenge"
		),
		{
			title: "Classroom Debugging and Showcase Routine",
			content: `When a change fails, stop at the first useful error or incorrect output. Record the input, expected result, actual result, and named line or state involved. Make one repair and rerun the same case before trying a different case.

For a showcase, demonstrate the working Normal result first. If Hard is complete, show it second and identify the reused function, collection, or control-flow rule. End with one test that originally failed and the specific repair that made it pass.`
		}
	],
	supplementalItems: [
		{
			title: "Launch Remix: Data Structure Swap",
			content: `Choose a launch project that uses a list, dictionary, or set.

**Normal:** Identify one responsibility that belongs to the current structure and add one safe operation using that structure.

**Hard:** Rebuild one small responsibility with a different data structure, then explain the behavior, readability, and duplicate-handling tradeoffs.`,
			learningPath: "choice",
			solutionLink:
				"https://github.com/instruction-material/Python-Level-2/tree/a840f54eb6a55718f6305544adc937c32fa516ee/PS13-Wordsmith/solution"
		},
		{
			title: "Launch Remix: Test Matrix",
			content: `Choose any launch project and preserve its completed framework.

**Normal:** Write and run a three-case test matrix covering an ordinary, boundary, and invalid or empty case.

**Hard:** Add a small reusable test function or deterministic mode that reproduces a prior failure without manual re-entry.`,
			learningPath: "challenge",
			solutionLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Mad-Libs/solution`
		}
	]
});

const classroomProjectExtensions: Record<string, string> = {
	"PS4-Rock-Paper-Scissors": `Run the complete game and compare paper/rock, rock/paper, and rock/rock. Locate the invalid-input check and the winning combinations. Compare how the result changes when the same two valid moves trade places.

**Normal:** Add an explanation to a winning result. Paper against rock should include “paper beats rock.”

**Hard:** Play three rounds and keep a total for each player. A tie or a pair containing an invalid move adds zero points.

**Success criteria:** One Player 1 win, a tie, and one invalid round leave a score of 1–0.`,
	"PS4-FizzBuzz": `Run the full list and compare the results at 3, 5, 15, and 16. Trace how the overlapping condition is reached before either single-divisor condition.

**Normal:** Add an end-of-run count for each label. For 1 through 50, count 13 Fizz, 7 Buzz, and 3 FizzBuzz lines.

**Hard:** Accept the highest number to print and handle a nonpositive limit. For 15, report 4 Fizz, 2 Buzz, and 1 FizzBuzz.

**Success criteria:** The counts exclude the overlap from the single-label totals, and 16 prints as 16.`,
	"PS4-Credit-Card-Validator": `Run the checksum with the short fictional strings 1479 and 1478. Trace which digits are doubled and when the doubled result is reduced by 9.

**Normal:** Print each processed value while retaining the final total. For 1479, show 9, 5, 4, and 2 from right to left.

**Hard:** Add a mode that compares two fictional samples. When given 1479 and 1478, report totals of 20 and 19 and identify which checksum passes.

**Success criteria:** The sample 109 still passes with total 10. A string containing a letter is rejected before arithmetic.`,
	"PS4-Carnival-Strength-Tester": `Try 49, 50, 100, and 150 inches. Identify the first true condition for each height. Record why the boundary at 100 skips both lower tiers.

**Normal:** Include the distance to the next prize tier when one exists. For 99 inches, the distance to a frisbee is 1 inch.

**Hard:** Compare two attempts and award one prize based on the larger height. Attempts of 99 and 100 inches earn a frisbee.

**Success criteria:** A height of 150 earns the largest prize and reports no further tier.`,
	"PS4-Test-Statistics": `Run with 0, 70, 100, 70, and 100. Check the high, low, and average, then trace a single score through both comparisons.

**Normal:** Add a count of scores at least 70. The sample has four qualifying scores.

**Hard:** Ask how many valid scores to collect, then compute all four results for that count. For 3 scores of 0, 70, and 100, the qualifying count is 2 and the average rounds to 56.7.

**Success criteria:** An invalid score is replaced before counting, even when entered after earlier valid scores.`,
	"PS4-Relay-Race-Statistics": `Run with 50, 60, 55, and 55 seconds. The average is 55 seconds. Compare each runner with that same value.

**Normal:** Print each runner's difference from the average. Runner 1 is 5 seconds faster and runner 2 is 5 seconds slower. Compare the displayed signs with the wording.

**Hard:** Report which runners tie for the fastest time. For 52.5, 52.5, 55, and 55, identify runners 1 and 2.

**Success criteria:** Runners 3 and 4 in the first sample are exactly at the average and have a zero difference.`,
	"PS4-Joes-Donuts-Opening-Day": `Run with customer positions 1, 12, 13, 144, 200, 201, 500, and 501. Identify the separate first-customer and year-round offers.

**Normal:** Add a count of the offers printed. Positions 1 and 144 have 3 and 2 offers, respectively.

**Hard:** Print a numbered receipt with the actual offers received. For position 501, show the third-donut offer and the year-round deal in that order.

**Success criteria:** The month of free donuts for position 144 replaces the $1 dozen offer. Position 0 produces an input message with no receipt.`,
	"PS4-Number-Guesser": `Set the existing target to 27 for a repeatable trial. Enter 20, 30, and 27 to observe both feedback directions and the attempt count.

**Normal:** Print the absolute distance from the target after each incorrect guess. The two distances are 7 and 3.

**Hard:** Add a maximum of three valid guesses. After three misses, report the target and stop. A correct third guess still wins.

**Success criteria:** The fixed-target trials pass before random selection is restored. The program chooses one target per game.`,
	"PS4-Debugging-Conditionals": `Run the corrected program with 249, 250, 255, and 256 tickets. The matching T-shirts first become affordable at 256.

**Normal:** Print the additional tickets needed for matching shirts when the balance is below 256. At 255, one additional ticket is needed.

**Hard:** Ask how many tickets the friend needs and compute the new boundary. When the friend needs 10 tickets, 259 is short by one and 260 succeeds.

**Success criteria:** The independent prize messages still include all items the ticket balance can cover. At 350 all four individual purchases are available.`,
	"PS-Check-in-1": `Run the completed animal and color program with dog and black, then cat and black. Compare the combined and nested decisions. Both versions should agree for both inputs.

**Normal:** Print the number of correct guesses before the result. Dog and black should report two matches. Cat and black should report one.

**Hard:** Put the result into a repeatable round. Read a new animal and color after each round until a quit response. Keep the counters local to each round.

**Success criteria:** A partial match after a correct round still reports one match. A short color entry produces an informative message and the next round can run.`,
	"PS-Check-in-1/practice": `Run both shifters with Az! and compare Zy! with By!. Track the original index and the decision about direction. Punctuation occupies an index and remains unchanged.

**Normal:** Print the direction and output for each letter in the index rule. The first two rows should report A forward to B and z backward to y.

**Hard:** Add a reverse mode that uses the opposite direction for the selected rule. Run the index rule on Az!, then reverse By! to recover Az!.

**Success criteria:** Reversing the length-rule output Zy! also recovers Az!. The punctuation remains present through both transformations.`,
	"PS-Check-in-2": `Run the complete review once. Record the final guests, the size of the random digit-count dictionary, and the two ingredient sets. The list retains order, the dictionary connects numbers with digit counts, and the sets reveal overlaps.

**Normal:** Add a line with the number of entries in the digit-count dictionary. Run twice to verify the count is 15 even when the keys change.

**Hard:** Count how many keys have one, two, three, and four digits. Compare each bucket with the existing dictionary before adding a new random sample.

**Success criteria:** All bucket counts add to 15. The key 1000 is the only possible four-digit key in this exercise.`,
	"PS-Check-in-2/practice": `Run the letter counter with Banana, banana! and the word counter with Red,blue red. Check that case and punctuation handling produce three unique letters, then two unique words out of three.

**Normal:** Print the most frequent word and its count. Red,blue red should identify red twice.

**Hard:** List every word tied for the highest count in alphabetical order. Red blue red blue should report blue and red with two occurrences each.

**Success criteria:** A punctuation-only paragraph produces zero words and a clear empty result. Punctuation can separate adjacent words without entering either word.`
};

const classroomModules = copyClassroomCourseModules(pythonLevel2Course.modules);
for (const module of classroomModules) {
	for (const item of [...module.curriculum, ...module.supplementalProjects]) {
		const folder = item.solutionLink?.match(
			/\/tree\/[^/]+\/(.+)\/solution$/
		)?.[1];
		const content = folder && classroomProjectExtensions[folder];
		if (content) {
			item.content = content;
			item.contentKind = "assignment";
			item.preserveInstructions = true;
		}
	}
}

export const pythonLevel2ClassroomCourse: RawCourse = {
	name: "Python Level 2: Classroom Edition",
	modules: [classroomLaunchModule, ...classroomModules]
};
