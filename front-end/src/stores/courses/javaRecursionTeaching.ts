import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaRecursionContinuations,
	javaRecursionModuleID,
	javaRecursionProjects,
	javaRecursionReadingID,
	javaRecursionURL
} from "@/modules/javaRecursionResources";

const contracts = `| Method | Accepted input and result | Base case / smaller problem |
| --- | --- | --- |
| factorial(n) | Integers 0..12; 0! = 1. Other inputs throw IllegalArgumentException. | n = 0 returns 1; multiply n by factorial(n - 1). |
| exponent(b, p) | Any int base; exponent 0..31. Empty product, including 0^0, is 1. Invalid exponent throws IllegalArgumentException; int overflow throws ArithmeticException. | p = 0 returns 1; use Math.multiplyExact(b, exponent(b, p - 1)). |
| sumDigits(n) | Every signed int; sum the magnitude's decimal digits. | Widen to long before absolute value. Magnitude below 10 returns itself; otherwise last digit plus the remaining digits. |
| fibonacci(n) | One-based terms 1..31: term 1 is 0, term 2 is 1. Other terms throw IllegalArgumentException. | Return 0 or 1 at terms 1 or 2; otherwise add terms n - 1 and n - 2. |
| palindrome(word) | Non-null ASCII strings of at most 256 characters. Case, spaces, and punctuation count. Invalid input throws IllegalArgumentException. | Length 0 or 1 returns true; otherwise matching end characters and the inside substring. |`;

const workflow = `Use Java 21 for the complete compile and contract-test workflow. Open the selected starter in the site IDE after confirming the import. Main.java contains the unfinished methods; ContractTests.java contains runnable checks; README.md documents the same input contract. Keep the reference in its separate project. The complete call-trace example runs in the bounded browser Java preview. For the two core packs, Run displays native build instructions; Java 21 runs the complete test harness and console driver.

Download the project ZIP, extract it, and open a terminal in the directory containing Main.java:

\`\`\`sh
javac --release 21 Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

Compile each project in its own directory because each defines a class named Main. The untouched starter compiles and throws UnsupportedOperationException when its unfinished method is reached. Implement the method bodies, then run the harness again. A correct result also needs a hand trace showing the base case, smaller calls, and returned values; passing outputs alone do not establish that recursion was used.`;

const legacyAliases: Record<string, string[]> = {
	"java-level-3-aj4-recursion-supplemental-extension-challenge-recursion": [
		"java-level-3-aj4-recursion-supplemental-extension-challenge",
		"recursion-extension-challenge",
		"java-level-3-aj4-recursion-supplemental-recursion-extension-challenge"
	],
	"java-level-3-aj4-recursion-supplemental-recursive-trace-transfer-practice":
		[
			"java-level-3-aj4-recursion-supplemental-transfer-practice",
			"java-level-3-aj4-recursion-supplemental-transfer-practice-recursion"
		],
	"java-level-3-aj4-recursion-supplemental-recursive-backtracking-extension-practice":
		[
			"java-level-3-aj4-recursion-supplemental-extension-practice",
			"java-level-3-aj4-recursion-supplemental-extension-practice-recursion"
		]
};

function task(
	id: string,
	title: string,
	content: string,
	optional = false,
	pack?: string
): RawCourseModuleItem {
	return {
		id,
		...(legacyAliases[id] ? { aliases: legacyAliases[id] } : {}),
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: optional ? "challenge" : "core",
		...(pack
			? {
					projectLink: javaRecursionURL(`${pack}/starter`),
					solutionLink: javaRecursionURL(`${pack}/solution`),
					ideImport: true
				}
			: {})
	};
}
function resources(section: string) {
	const asset = "/course-assets/java-level-3/recursion-checks.md#";
	return `\n\n[Case inputs](/course-resource-viewer?asset=${encodeURIComponent(
		`${asset + section}-inputs`
	)}) · [Project self-check](/course-resource-viewer?asset=${encodeURIComponent(
		`${asset + section}-answers`
	)})`;
}

export function completeJavaRecursionModule(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "AJ4 Recursion") return module;
	return {
		...module,
		id: javaRecursionModuleID,
		curriculum: [
			{
				id: javaRecursionReadingID,
				aliases: [
					`${
						javaRecursionModuleID
					}-curriculum-core-concepts-and-learning-sequence`,
					"core-concepts",
					`${javaRecursionModuleID}-curriculum-core-concepts`
				],
				title: "Recursion Core Concepts",
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "core",
				ideImport: true,
				projectLink: javaRecursionURL("AJ4-Call-Trace"),
				content: `**Course flow:** State the input domain, base case, and quantity that strictly decreases; trace calls and returns, implement the two core projects, then choose optional trace work. Pause before each return, predict the next value, and compare the finished trace with the worked answer.

### A complete recursive method

A recursive call pauses its caller. Each stack frame retains its parameter and the point where execution resumes. The base case produces a value without another call. A decreasing nonnegative integer or shorter structure proves that accepted inputs eventually reach that case.

\`\`\`java
public class Main {
    public static int sum(int n) {
        if (n < 0 || n > 100)
            throw new IllegalArgumentException("n must be 0..100");
        if (n == 0) return 0;
        return n + sum(n - 1);
    }
    public static void main(String[] args) {
        System.out.println(sum(4));
    }
}
\`\`\`

For sum(4), calls descend through 4, 3, 2, 1, 0. The return values are 0, 1, 3, 6, 10. The frame for n = 3 resumes at 3 + sum(2), receives 3, and returns 6. There are five calls, not four. The smallest accepted input sum(0) returns 0 immediately. Rejecting -1 before recursing prevents an endless descent away from zero. The worked-code button opens this complete example and its harness.

A loop can accumulate the same sum with constant extra memory. This recursive version uses one frame per value, so time and stack space grow linearly with n. Fibonacci branches twice; repeated subproblems cause much more work even though maximum stack depth grows linearly. The term bound below deliberately limits naive branching work.

### Core method contracts

${contracts}

Validate public inputs before entering the recursive helper. For sumDigits, Math.abs(Integer.MIN_VALUE) still overflows an int; Math.abs((long) n) produces the positive magnitude 2147483648. A helper accepting long can then discard one decimal digit per call. Fibonacci here preserves the original course's one-based convention: fibonacci(5) is 3.

For palindrome("level"), matching l characters leave "eve", matching e characters leave "v", and the single-character base case returns true. palindrome("Level") is false under the exact character contract. For exponent, multiplication that overflows int must fail visibly through Math.multiplyExact rather than wrapping to a plausible negative value.

### Divisibility by seven

Write a nonnegative magnitude as 10a + b, where b is the final digit. Subtract twice that digit from the remaining prefix: a - 2b. Since 10(a - 2b) = (10a + b) - 21b and 10 has no common factor with 7, this transformation preserves divisibility by 7. For signed input, first widen to long and take the absolute magnitude; changing a sign preserves divisibility.

At magnitude below 10, only 0 and 7 are divisible by 7. Otherwise recur on the absolute magnitude of a - 2b. For magnitude at least 10, a is at least 1 and b is 0..9, so |a - 2b| is strictly smaller than 10a + b: both a - 2b and 2b - a are less than 10a + b. This gives a terminating decreasing measure.

For 203, the trace is 203 → 14 → 7 → true. For -7, magnitude 7 reaches true immediately; for 204, 204 → 12 → 3 → false. Zero is divisible because 0 = 7 × 0.

### Build, test, and explain

${workflow}

Before coding, predict factorial(0), exponent(2, 0), sumDigits(-1234), fibonacci(5), palindrome(""), and isDivBySeven(-7). Their results are 1, 1, 10, 3, true, true. Explain each base case and trace one non-base example before comparing with the reference.`
			},
			task(
				javaRecursionProjects[0].id,
				"AJ4 Project 1: Recursion Practice",
				`**Goal:** Implement factorial, exponent, sumDigits, fibonacci, and palindrome recursively in the supplied starter while preserving its public method signatures.

**Steps:** Write each input domain and decreasing measure first. Implement one method at a time; validate rejected inputs before recursion and use a private helper where widening or string validation is needed. Trace factorial(4), exponent(2, 3), sumDigits(-1234), fibonacci(5), and palindrome("level") through calls and returns. Use the complete contract table in Recursion Core Concepts.

${workflow}

**Completion evidence:** Submit the five implementations, the native harness output, and a trace for each recursive pattern. Include zero, empty, negative, maximum accepted, rejected, and overflow cases where the contract permits them. Compare numeric results with independent loop-based or known-value checks. Explain why every accepted recursive path terminates.${resources(
					"practice"
				)}`,
				false,
				javaRecursionProjects[0].pack
			),
			task(
				javaRecursionProjects[1].id,
				"AJ4 Project 2: Divisible by 7",
				`**Goal:** Implement isDivBySeven(int n) recursively for every signed int and keep the supplied console driver usable at end-of-input.

**Steps:** Widen before taking the absolute magnitude. Below 10 return whether the magnitude is 0 or 7. Otherwise split it into prefix a and final digit b, and recurse on a - 2b using the magnitude helper. Use the proof and traces in Recursion Core Concepts. Keep modulo out of the method being implemented; use n % 7 == 0 only as an independent test oracle.

The supplied driver reads whitespace-separated integer tokens until quit or end-of-input. An invalid or out-of-range token prints Invalid integer. and processing continues. Input after quit is ignored. Trace 203, 204, -7, 0, and Integer.MIN_VALUE; capture the console results for 203 bad -7 quit 204.

${workflow}

**Completion evidence:** Submit the recursive method, a decreasing-magnitude argument, native harness output, and console evidence covering valid, invalid, quit, and end-of-input cases. Demonstrate agreement with modulo for positive and negative values.${resources(
					"seven"
				)}`,
				false,
				javaRecursionProjects[1].pack
			)
		],
		supplementalProjects: [
			task(
				javaRecursionContinuations[0],
				"Extension Challenge: Recursion",
				`**Goal:** Compare the work of branching recursion with the number of distinct subproblems, using the completed core Fibonacci method.

**Steps:** Reopen the core Recursion Practice workspace. Draw the full call trees for terms 5 and 6 using the one-based contract. Count every invocation, including repeated base cases, then count distinct term numbers. Annotate returned values on the tree. Compare with a loop that keeps only two previous values. Leave the completed core method intact and record counts in a separate worksheet or added notes file.

**Completion evidence:** Include both trees, total-call counts, distinct-state counts, and an explanation of why repeated work increases time while stack depth follows the longest unfinished chain. The reference button opens the completed core methods; the self-check supplies the call-count reasoning.${resources(
					"branching"
				)}`,
				true,
				javaRecursionProjects[0].pack
			),
			task(
				javaRecursionContinuations[1],
				"Recursive Trace Transfer Practice",
				`**Goal:** Explain signed digit recursion using the completed core sumDigits method.

**Steps:** Reopen Recursion Practice and retain its saved implementation. Trace 0, 1000, -1234, and Integer.MIN_VALUE. For each, record the widened magnitude, each remaining prefix and final digit, and all return additions. Predict the effect of moving the cast after Math.abs. Explain why leading zero digits in the reduced prefix do not create extra recursion.

**Completion evidence:** Provide four traces, the four sums, and a signed-overflow explanation. Add one regression assertion for Integer.MIN_VALUE without changing the existing public contract. The reference opens the core implementation; the self-check includes the complete numerical trace.${resources(
					"digits"
				)}`,
				true,
				javaRecursionProjects[0].pack
			),
			task(
				`${
					javaRecursionModuleID
				}-supplemental-recursive-backtracking-extension-practice`,
				"Recursive Backtracking Extension Practice",
				`**Goal:** Trace an include-or-skip search in which each supplied value may be selected once.

**Steps:** Use values [2, 3, 5] and target 8. Draw a binary tree with one level per index. The left branch appends that value to chosen; the right branch skips it. At index == values.length, record a copy of chosen only when its sum equals the target. After the include branch returns, remove its last appended value before exploring skip. Use this complete algorithm:

\`\`\`text
search(index, chosen, total):
    if index == values.length:
        if total == target: record(copy(chosen))
        return
    chosen.add(values[index])
    search(index + 1, chosen, total + values[index])
    chosen.removeLast()
    search(index + 1, chosen, total)
\`\`\`

List all eight leaf subsets and their sums, count all calls in the unpruned tree, and mark each undo. Repeat the leaf results for target 5, then for values [1, 2, 3, 4] with target 5. This is a state-trace worksheet; its full inputs and worked responses are supplied below.

**Completion evidence:** Submit the tree, subset sums, call count, and changed-input results. Explain why recording a mutable list without copying it changes earlier answers, and why omitting the undo contaminates the skip branch.${resources(
					"backtracking"
				)}`,
				true
			)
		]
	};
}
