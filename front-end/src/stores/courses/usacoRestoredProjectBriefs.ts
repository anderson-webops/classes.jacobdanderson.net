import type { RawCourse, RawCourseModuleItem } from "./types";
import { restoredUsacoResourceUrl } from "../../modules/usacoProjectResources";

export const marathonSavedItemId =
	"usaco-gold-optional-historical-and-applied-gold-studios-supplemental-marathon";

const briefs: Record<
	string,
	{
		title: string;
		input: string;
		output: string;
		stdio?: boolean;
		contract: string;
		model: string;
		tasks: string;
		sample: string;
		checks: string;
		cost: string;
	}
> = {
	"UB1-Square-Pasture": {
		title: "Square Pasture: bounding rectangles with a square",
		input: "square.in",
		output: "square.out",
		contract:
			"The December 2016 Bronze problem gives two nonoverlapping, nontouching rectangles. Each of the two input lines contains x1 y1 x2 y2, lower-left then upper-right coordinates from 0 through 10; both dimensions are positive. Return the area of the smallest axis-aligned square covering both rectangles. Its placement need not be unique.",
		model: "Find the leftmost, rightmost, lowest and highest boundaries across both rectangles. Their differences give the enclosing width and height. A square must cover both spans, so its side is the larger span and its area is side squared. Explain why a smaller side fails and why the selected side is sufficient; do not return the side or perimeter.",
		tasks: "Complete the three geometry tasks in minimum_square_area. The Python driver supplies file reading and output; the untouched helper raises NotImplementedError before opening the answer file.",
		sample: "The supplied rectangles are (6,6)–(8,8) and (1,8)–(4,9). Width 7 and height 3 require side 7, so the output is 49.",
		checks: "Draw horizontal and vertical separation, reverse the rectangle order, vary unequal dimensions, and include extreme coordinates. For tiny coordinates, enumerate candidate square placements as an independent oracle.",
		cost: "A fixed number of boundary comparisons takes O(1) time and space."
	},
	"UB62-Cow-College": {
		title: "Cow College: frequency counts, revenue and ties",
		input: "sample.in",
		output: "",
		stdio: true,
		contract:
			"Choose one tuition for all cows to maximize revenue, returning the smallest tuition among tied optima. This optional project practices frequency tables and cumulative counts. Before starting, be able to read integer input, index a list and trace a decreasing loop. The first input line is N (1 through 100,000); the second contains N affordable tuition values (1 through 1,000,000). A cow attends when its value is at least the chosen price. Print maximum revenue and smallest optimal tuition on one line. The program reads standard input and prints standard output. [USACO problem contract](https://usaco.org/index.php?cpid=1251&page=viewproblem2).",
		model: "The supplied driver builds tuition_to_cow[p], the number of cows willing to pay exactly p. Scan prices from MAX_TUITION down to one, including both endpoints. Add the current frequency before calculating revenue; the cumulative count then includes precisely the cows able to pay that price. Multiply price by count. Descending order visits larger tied prices first, so replacing a saved result when revenue is equal retains the smallest tied price. For values 1 and 2, both prices earn 2 and the answer is 2 1. Explain the count invariant and tie rule before editing. Python integers hold the full revenue; another language needs 64-bit storage.",
		tasks: "Complete only choose_tuition in main.py, returning (maximum_revenue, smallest_optimal_tuition). Keep the supplied frequency-table input driver and output order. Initialize the count and best pair, scan both endpoints, add the frequency, compare the candidate and return the pair. In an instructor walkthrough, hand-trace the sample table at each step. For independent work, record that trace before implementing. Sorting the original offers is an alternative formulation, but this pack's helper receives a frequency table.",
		sample: "The included sample is N=4 with values 1, 6, 4, 6. Tuition 4 admits three cows and earns 12, so the printed answer is 12 4.",
		checks: "Check the sample, the tied values 1 and 2 (2 1), one value 1,000,000 (1000000 1000000), and three values 7 (21 7). Reordering the same values must not change the result. For 100,000 cows each willing to pay 1,000,000, revenue is 100,000,000,000. For small cases, separately count attendees at each distinct offered price and compare the best revenue and smallest tied price. Explain why adding the frequency after calculating revenue would omit eligible cows.",
		cost: "O(N + 1,000,000) time and O(1,000,000) storage. Avoid scanning every cow separately at every possible price."
	},
	"UB63-Feeding-the-Cows": {
		title: "Feeding the Cows: greedy coverage with two breeds",
		input: "sample.in",
		output: "",
		stdio: true,
		contract:
			"Place the fewest breed-specific patches so every cow reaches a patch of its own breed. This optional project practices a left-to-right greedy scan, separate coverage state and output validation. Before starting, be able to index strings, update lists and trace inclusive distances. Input starts with T (1 through 10). Each case gives N K, then N G/H characters; N is 1 through 100,000 and K is 0 through N-1. A position holds G, H or a dot. A patch feeds unlimited same-breed cows at distance at most K. Print the minimum patch count, then a length-N layout on the next line. Any valid optimal layout is accepted. Read standard input and print standard output. [USACO problem contract](https://usaco.org/index.php?cpid=1252&page=viewproblem2).",
		model: "Maintain a patch list and separate rightmost covered positions for G and H, initially uncovered. Scan cow indices left to right. An already covered cow needs no new patch. For an uncovered cow with idx+k inside the line, put its matching patch at idx+k and update only that breed's coverage to idx+2*k. This is the furthest-right placement that feeds the current cow, reaching as far as possible into later same-breed cows. Near the end, when idx+k is outside the line, a patch at idx reaches every remaining position. If the other breed already occupies idx, use idx-1 without overwriting it. For K=0 this collision cannot occur; for K>0 the adjacent trailing position remains reachable and available. Trace GH with K=1. An exchange argument justifies the interior choice, and the trailing choice covers every remaining same-breed cow.",
		tasks: "Complete only place_patches(cows, k) in main.py. Create N dots, initialize separate coverage boundaries, test whether each cow is uncovered, place an interior or trailing patch, and return the character list. The supplied driver counts non-dot positions and prints both lines. Keep G and H coverage independent. In a shared walkthrough, draw GHHGG with K=0, 1 and 2 before editing. For independent work, predict layouts and mark each patch's matching coverage interval first.",
		sample: "The six included cases require counts 5, 3, 2, 2, 2 and 2. Validate the breed and distance for every cow; a correct layout may differ from the sample characters.",
		checks: "Check one cow, K=0 (N patches matching the cows), one breed with K=N-1 (one patch), both breeds with K=N-1 (two different patch positions), alternating breeds near the right edge, and the two-cow GH case with K=1. Swapping G and H preserves the minimum count while swapping patch breeds. The reported count must equal the non-dot count. Enumerate tiny dot/G/H layouts independently to find the minimum valid count, then accept any layout reaching that optimum. Explain why an uncovered cow needs a patch and why updating G coverage cannot update H coverage.",
		cost: "O(N) work and O(N) output storage per case. Validate optimal count, breed, position occupancy and inclusive distance separately."
	},
	"US18-Counting-Haybales": {
		title: "Counting Haybales: inclusive coordinate queries",
		input: "haybales.in",
		output: "haybales.out",
		contract:
			"The December 2016 Silver problem reads N Q, N distinct haybale positions, and Q pairs A B. N and Q are at most 100,000; positions and query endpoints are between 0 and 1,000,000,000, with A <= B. Each answer counts positions in the inclusive interval [A,B], one integer per line.",
		model: "Sort positions once. lower_bound(A) locates the first position at least A and upper_bound(B) locates the first position greater than B. The distance between them counts the requested positions. Trace positions equal to either endpoint; using upper_bound(B) avoids computing B+1. This is coordinate counting, while the optional Prefix Sums pack sums array values over index ranges.",
		tasks: "Complete the sorted boundary searches in the learner helper. Preserve the supplied input validation, sorted representation and driver; justify both endpoint choices before coding.",
		sample: "The supplied six queries produce 2, 2, 3, 4, 1, 0 on separate lines. Trace the final empty interval rather than special-casing its answer.",
		checks: "Check ranges outside all positions, a singleton coordinate, both exact endpoints, a query spanning every position, reversed input position order, and the largest coordinates. Compare small queries with direct inclusive counting.",
		cost: "Sorting costs O(N log N); each query costs O(log N). The provided driver uses O(N+Q) storage including buffered answers."
	},
	"US21-Priority-Queues": {
		title: "Priority queue studio: stable task scheduling",
		input: "priority.in",
		output: "priority.out",
		contract:
			"This course-authored heap exercise reads N from 0 through 100,000, then N signed 64-bit priorities with whitespace-free labels. Output one label per line, lowest numerical priority first and earliest input position first for ties. Repeated labels are distinct tasks; negative priorities are valid.",
		model: "Pair each priority with its arrival index, which also locates its label. C++ priority_queue exposes the greatest entry by default; choose a comparison that exposes the smallest pair. Labels are not tie-breakers. Only inspect top or pop a nonempty queue. Trace equal-priority labels whose alphabetical order differs from arrival order.",
		tasks: "Complete orderTasks by inserting entries, removing the minimum entry repeatedly, and collecting labels. File handling is provided. The optional extension adds interleaved arrivals in a separate attempt with its own input contract; the supplied batch reference does not implement that extension.",
		sample: "The supplied sample outputs urgent, alpha, gamma, beta, beta on separate lines.",
		checks: "Check no tasks, one task, equal priorities, repeated labels, negative and extreme priorities. Use a stable sort of the original records as an independent small-case oracle.",
		cost: "O(N log N) time and O(N) storage. A heap becomes especially useful when insertions and removals interleave."
	},
	"US22-Prefix-Sums": {
		title: "Prefix sums practice: zero sentinel and half-open ranges",
		input: "prefix.in",
		output: "prefix.out",
		contract:
			"This course-authored optional exercise reads N Q, N signed values, then Q pairs left right. N and Q are from 0 through 100,000; values are from -1,000,000,000 through 1,000,000,000. Each query satisfies 0 <= left <= right <= N and asks for the sum in [left,right), excluding right. Write one signed sum per line.",
		model: "prefix[k] stores the sum of the first k values, so prefix[0]=0 and the table has N+1 entries. Build prefix[i+1]=prefix[i]+values[i]; subtract prefix[left] from prefix[right] to remove preceding values. Empty ranges give zero. Use signed 64-bit totals: the allowed magnitude reaches 100,000,000,000,000. This static table must be rebuilt if input values change.",
		tasks: "Complete makePrefix and rangeSum. Hand-build all six prefix entries for [3,-2,7,0,4], explaining each entry before deriving the range expression. The validated file driver is provided.",
		sample: "The supplied five queries produce 0, -2, 12, 7, 0 on separate lines.",
		checks: "Check an empty array, an empty interior range, a singleton, [0,N), negative totals and totals beyond 32-bit range. Compare every valid interval of a small array with direct slice addition.",
		cost: "O(N) preprocessing and O(1) per query, or O(N+Q) total time. The provided driver uses O(N+Q) storage."
	},
	"UG1-Dynamic-Programming-with-Fibonacci": {
		title: "Fibonacci: a bounded dynamic-programming warmup",
		input: "fibonacci.in",
		output: "fibonacci.out",
		contract:
			"This course-authored warmup reads one integer n from 0 through 92 and writes F(n), with F(0)=0 and F(1)=1. F(92)=7,540,113,804,746,346,429 fits signed 64-bit storage; F(93) does not. It establishes DP reasoning before larger Gold state-design problems rather than serving as a complete Gold assessment.",
		model: "Each value depends only on the two preceding values. Naive recursive evaluation repeats subproblems; a table or two retained values evaluates each state once. State the base cases, dependency order and storage bound before implementing the recurrence.",
		tasks: "Complete the unfinished Fibonacci helper while retaining validation and file handling. Trace indices 0, 1, 2 and 10 by hand; a later independent retry can reduce a table to two retained values without changing the file contract.",
		sample: "For n=10 the output is 55. Check the actual included input before predicting its answer.",
		checks: "Check n=0, 1, 2, 10 and 92. Inputs -1, 93 and nonintegers must be refused. Compare small values with a separately written recursive definition, restricted to small n.",
		cost: "O(n) time; O(n) storage for a table or O(1) for two retained values."
	},
	"UG3-Teamwork": {
		title: "Teamwork: choose the final team of a prefix",
		input: "teamwork.in",
		output: "teamwork.out",
		contract:
			"The December 2018 Gold problem reads N K and N skills in original cow order. N <= 10,000, K <= 1,000 and skills are from 1 through 100,000. Partition the sequence into consecutive teams of at most K cows. A team contributes its size times its maximum skill; output the greatest total.",
		model: "Let dp[i] be the best score for the first i cows, with dp[0]=0. Try every feasible final team length, maintaining that team's maximum while extending backward. Add its score to the best earlier prefix, then retain the greatest candidate. Every valid partition has one of these final teams, which justifies the recurrence. Sorting cows changes the problem.",
		tasks: "Complete the learner DP helper. Trace candidate final teams on a short unequal-skill sequence and explain why choosing the largest immediate team score need not maximize the full partition.",
		sample: "The supplied seven-cow, K=3 sample outputs 84.",
		checks: "Check one cow, K=1, K>=N, equal skills, high skills at either end, and a case where a greedy team choice fails. Enumerate every legal partition for small N as an independent oracle.",
		cost: "O(NK) time and O(N) DP storage, sufficient for the full Gold limits."
	},
	"UG5-Marathon": {
		title: "Marathon Gold: mutable checkpoints and range aggregates",
		input: "marathon.in",
		output: "marathon.out",
		contract:
			"The December 2014 Gold variant reads N Q (each at most 100,000), N checkpoint coordinates from -1,000 through 1,000, then commands. U I X Y replaces checkpoint I. Q I J asks for the shortest Manhattan sub-route from I to J, skipping at most one interior checkpoint. File indices are one-based, I <= J, and endpoints cannot be skipped. Write one distance per query. The Bronze and Silver variants have different contracts.",
		model: "Convert to zero-based points. Edge i connects i to i+1; a route a through b sums edges in [a,b). Skipping interior i saves distance(i-1,i)+distance(i,i+1)-distance(i-1,i+1). Subtract the largest gain in [a+1,b), excluding endpoints. Use separate sum and maximum segment trees with zero identities. A point update changes two incident edges and at most three neighboring gains. A static prefix sum needs rebuilding; a sum-only Fenwick tree does not supply this replacement range maximum.",
		tasks: "Complete point assignment and ancestor rebuilding, half-open range aggregation, and update refresh. Allocation, Manhattan distances, file handling and the route formula are provided. Draw the trees' meanings and trace an endpoint update before coding.",
		sample: "The supplied official sample outputs 11, 8, 8 on separate lines.",
		checks: "Check one checkpoint, adjacent endpoints, repeated points, collinear routes, first/last-point updates and repeated updates. For small routes enumerate each allowable skipped point and directly total distances.",
		cost: "The supplied repeated-assignment initialization is O(N log N); updates and queries are O(log N), with O(N+Q) driver storage. Bottom-up O(N) building is an optional extension."
	},
	"UG8-Bookshelf": {
		title: "Bookshelf Gold: constrained contiguous partitions",
		input: "bookshelf.in",
		output: "bookshelf.out",
		contract:
			"The November 2012 Gold problem reads N and maximum shelf width L, then N HEIGHT WIDTH pairs in that order. N <= 100,000, L <= 1,000,000,000, height <= 1,000,000 and each width is from 1 through L. Preserve book order and partition into contiguous shelves whose width sums are at most L. A shelf costs its tallest book's height; minimize total cost. This is the full Gold variant.",
		model: "dp[i] is the minimum cost for the first i books. A candidate shelf start j contributes dp[j] plus the maximum height from j through i-1. Positive widths give a moving lower bound on feasible starts. A monotonic stack groups starts sharing a maximum height; a lazy range-add/minimum tree updates groups when a new height replaces their maxima and selects the least feasible cost. Explain candidate activation, expired starts and lazy propagation; a quadratic DP is useful only as a small-case oracle.",
		tasks: "Complete the marked range-tree and candidate-DP helpers after tracing a tiny candidate table. This advanced challenge follows prefix-partition DP and range structures; defer it until both invariants can be explained.",
		sample: "The supplied official sample costs 21; a greedy packing choice costs 25. The preserved historical bookshelf.out value 248427 belongs to an unavailable older input and is not the expected result for this sample.",
		checks: "Check one book, every book requiring its own shelf, equal heights, increasing/decreasing heights, exact-width shelves and widths beyond 32-bit total range. Compare small cases with exhaustive contiguous partitions or independent quadratic DP.",
		cost: "O(N log N) time and O(N) storage are required for the full Gold limit. Use 64-bit width sums and DP costs."
	}
};

function projectBrief(
	courseId: string,
	folder: string,
	mode: "python" | "cpp",
	item: RawCourseModuleItem
) {
	const brief = briefs[folder]!;
	const placement =
		item.learningPath === "core"
			? "Required implementation checkpoint: complete and explain this pack before continuing."
			: item.learningPath === "challenge"
				? "Optional challenge: choose this after the matching unit; it is not a prerequisite for completing the required spine."
				: "Optional practice: use this for a diagnosed gap or an independent retry. If the same pack was already completed in the required unit, preserve that attempt and change the test cases rather than repeat identical work.";
	return [
		`## ${brief.title}`,
		placement,
		"## Contract and reasoning",
		brief.contract,
		brief.model,
		"## Guided implementation",
		brief.tasks,
		brief.sample,
		"## Check and explain",
		brief.checks,
		brief.cost,
		"Record a prediction, a trace, source changes and two custom tests before reviewing a reference. A shared walkthrough follows the same sequence: interpret the contract, draw the state, predict a small case, implement, test and explain discrepancies. Finish with a later rewrite from an empty file.",
		...(courseId === "usaco-bronze-on-demand" &&
		folder === "UB1-Square-Pasture"
			? [
					"## Self-paced checkpoint",
					"Before opening the pack, draw the sample on a grid and write its area prediction. Read the boundary model only after recording the first attempt. If blocked, name the missing step and use one hint at a time; an instructor walkthrough is optional. Keep the prediction, a corrected trace and two custom cases in the attempt record. After at least two days, reconstruct the geometry from an empty file using different rectangles. This independent retry distinguishes the on-demand route from the instructor course's shared implementation checkpoint."
				]
			: []),
		"## Open, save and run",
		`Choose Open in IDE beside the starter resource, then confirm the import. The ${mode === "python" ? "Python" : "C++20"} pack includes main.${mode === "python" ? "py" : "cpp"} and ${brief.input}${folder === "UB1-Square-Pasture" ? "; the starter also includes README.md" : ", plus README.md"}. Existing saved attempts reopen with their edits. The starter and reference use separate project identities; reference resources are available in the authorized instructor view after an attempt.`,
		...(brief.stdio
			? [
					"In the site IDE, open sample.in and copy all its lines into the Input panel. Select main.py and choose Run. The untouched starter stops with NotImplementedError and prints no answer; complete its helper before expecting results. The completed program prints its answer in Console output. The input fixture is not opened automatically by this program.",
					"Save the attempt, download its ZIP and extract it. Run inside the extracted directory with the sample redirected into standard input:",
					"```sh\npython3 main.py < sample.in\n```",
					"Change the Input panel or the redirected fixture for each custom case. Reopening a saved attempt preserves its source edits; paste the desired input again before running. Keep a copy of learner work before using the separately saved instructor reference. Compare printed results using the contract above."
				]
			: [
					"Save the attempt, download its ZIP and extract it. Keep the input beside the source and run inside that extracted directory. The unfinished starter stops with an unfinished-task error and creates no answer file; that is the expected starting state.",
					"```sh",
					`rm -f ${brief.output}`,
					...(mode === "python"
						? ["python3 main.py"]
						: [
								"c++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o project",
								"./project"
							]),
					`cat ${brief.output}`,
					"```",
					mode === "cpp"
						? "The browser edits and exports C++ source; it does not compile or execute C++. Follow the native commands above with a C++20 compiler. Delete only the stale answer file before running so an old answer cannot be mistaken for a new result."
						: "Python can also run in the site IDE. Inspect the generated output file after completing the helper; the native commands provide the same file-I/O check after export."
				]),
		"Source checks validate the supplied packs; they do not grade a completed learner submission. Protected mocks and active contests begin from an empty file without these practice starters or references."
	]
		.join("\n\n")
		.replace(
			/```sh\n\n([\s\S]*?)\n\n```/g,
			(_match, commands: string) =>
				`\`\`\`sh\n${commands.replaceAll("\n\n", "\n")}\n\`\`\``
		);
}

export function applyRestoredUsacoProjects(
	courseId: string,
	course: RawCourse
) {
	if (!courseId.startsWith("usaco-")) return;
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const resource = restoredUsacoResourceUrl(
					courseId,
					item.projectLink ?? ""
				);
				if (!resource) continue;
				item.ideImport = true;
				item.content = projectBrief(
					courseId,
					resource.folder,
					resource.mode,
					item
				);
			}
		}
	}
	if (courseId !== "usaco-gold") return;
	const previous = course.modules.find(
		module =>
			module.title === "Optional Historical and Applied Gold Studios"
	);
	const destination = course.modules.find(
		module =>
			module.title ===
			"Unit 4: Fenwick and Segment Trees, Ordering, and Range Structure"
	);
	const index =
		previous?.supplementalProjects.findIndex(item =>
			item.projectLink?.includes("/UG5-Marathon/starter")
		) ?? -1;
	if (!previous || !destination || index < 0) return;
	const [marathon] = previous.supplementalProjects.splice(index, 1);
	marathon!.id = marathonSavedItemId;
	destination.supplementalProjects.push(marathon!);
}
