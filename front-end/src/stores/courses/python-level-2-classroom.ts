import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	copyClassroomCourseModules,
	createClassroomLaunchModule
} from "./classroom-course";
import {
	PYTHON_LEVEL_2_PS1_SOURCE,
	PYTHON_LEVEL_2_PS2_SOURCE,
	PYTHON_LEVEL_2_PS3_SOURCE,
	pythonLevel2Course
} from "./python-level-2";

const PYTHON_LEVEL_2_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/main";

const pinnedLaunchSources: Record<string, string> = {
	"PS1-Mad-Libs": PYTHON_LEVEL_2_PS1_SOURCE,
	"PS2-Change-Machine": PYTHON_LEVEL_2_PS2_SOURCE,
	"PS3-Caesar-Cipher": PYTHON_LEVEL_2_PS3_SOURCE,
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
			`The completed game handles two moves and reports ties, wins, losses, and invalid input.

**Normal:** Add one clearly named score or replay value and update it only after a valid round.

**Hard:** Add a computer opponent or expanded move set while keeping the branch order explainable and every invalid-input path safe.`,
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

export const pythonLevel2ClassroomCourse: RawCourse = {
	name: "Python Level 2: Classroom Edition",
	modules: [
		classroomLaunchModule,
		...copyClassroomCourseModules(pythonLevel2Course.modules)
	]
};
