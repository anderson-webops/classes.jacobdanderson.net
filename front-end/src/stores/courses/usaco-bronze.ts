import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

export const usacoBronzeCourse: RawCourse = {
	name: "USACO Bronze",
	modules: [
		{
			title: "USB0 Setup and Contest Workflow",
			curriculum: [
				{
					title: "USACO File I/O and Submission Rhythm",
					content:
						"Set up a clean competitive-programming workflow with fast compile-run cycles, local sample files, and disciplined input/output handling. Contest success depends on fast iteration and careful reading, not on large project scaffolding."
				},
				{
					title: "Bronze-Level Problem Framing",
					content:
						"This section treats Bronze problems as exercises in accurate simulation, manageable brute force, careful counting, and well-structured conditionals. Many Bronze tasks become approachable once the story is translated into data and steps."
				},
				{
					title: "Trace First, Optimize Second",
					content:
						"Use handwritten traces and small custom tests before speed becomes the focus. Bronze work usually fails because of overlooked cases or incorrect translation, not because the code is too slow."
				},
				{
					title: "Language Strategy",
					content:
						"Choose the language that best supports current growth, while keeping problem-solving habits language-agnostic. Python is often enough for Bronze, while Java versions in the repo are useful preparation for later tiers."
				},
				{
					title: "USB0 Setup and Contest Workflow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "USB0 Setup and Contest Workflow",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Bronze Log: Setup and Contest Workflow",
					content:
						"Keep a short contest log for setup and contest workflow that records one wrong assumption, one edge case that broke an early idea, and one note about which part of the problem statement is easiest to misread under time pressure. Bronze-level progress comes from disciplined debugging as much as from knowing a trick.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java/solution"
				},
				{
					title: "UB 23 Why Did the Cow Cross the Road II Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 23 Why Did the Cow Cross the Road II Java",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-23-Why-Did-the-Cow-Cross-the-Road-II-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-23-Why-Did-the-Cow-Cross-the-Road-II-Java/solution"
				},
				{
					title: "UB 24 Why Did the Cow Cross the Road III Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 24 Why Did the Cow Cross the Road III Java",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-24-Why-Did-the-Cow-Cross-the-Road-III-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-24-Why-Did-the-Cow-Cross-the-Road-III-Java/solution"
				}
			]
		},
		{
			title: "Unit 1: Simulation and Careful Translation",
			curriculum: [
				{
					title: "Turn Story Problems into Variables and Steps",
					content:
						"Translate narrative wording into a tiny model: what is tracked, what changes each step, and when the answer is updated. The first win at Bronze is usually accurate modeling, not deep theory."
				},
				{
					title: "Follow the Rules Exactly",
					content:
						"Bronze problems often reward literal implementation of a process. Resist inventing shortcuts until they can restate the official rules precisely and prove their simulation matches them."
				},
				{
					title: "Make Small Custom Tests",
					content:
						"Use intentionally tiny cases to catch off-by-one mistakes and state-update errors. Leave this unit knowing that small tests are the fastest path to correctness."
				},
				{
					title: "Use Tables and Traces",
					content:
						"Use tables of values, timeline traces, and manual updates. Bronze-level debugging becomes much easier when the evolving state is visible on paper."
				},
				{
					title: "Unit 1: Simulation and Careful Translation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 1: Simulation and Careful Translation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Square Pasture",
					content:
						"Use geometric bounds and direct translation to practice reading a short statement carefully and converting it into a compact calculation.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/solution"
				},
				{
					title: "Problem: Your Ride Is Here",
					content:
						"Use a classic warmup to reinforce modular arithmetic, string processing, and exact interpretation of a quirky problem statement.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here/solution"
				},
				{
					title: "Problem: Transformations",
					content:
						"Practice rule-driven simulation by applying each transformation as a named case, comparing the resulting grid to the target, and stopping only after the fallback case is justified. A strong solution keeps rotation, reflection, and combination logic separate enough to debug with a tiny custom pattern.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations/solution"
				},
				{
					title: "Square Pasture Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 1: Simulation and Careful Translation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture-Java/solution"
				}
			]
		},
		{
			title: "Unit 2: Intervals, Arrays, and Greedy Warmups",
			curriculum: [
				{
					title: "Intervals and Coverage Thinking",
					content:
						"Reason about segments, overlaps, and gaps with small sorted lists or interval scans. Many Bronze tasks become easier once the timeline or number line is made explicit."
				},
				{
					title: "Greedy Choice with Just Enough Justification",
					content:
						"Small greedy arguments apply when choosing the earliest finish, largest gap, or best local option can be justified clearly. At Bronze level, the proof stays intuitive but still needs to be named aloud."
				},
				{
					title: "Scanning Arrays for Best Answers",
					content:
						"Use running best values, counts, and interval endpoints to show how one pass over data can be enough. This reinforces efficient habits without turning the unit into a complexity lecture."
				},
				{
					title: "Sorted Input as a Strategic Advantage",
					content:
						"Sort when it clarifies the structure of the task. Bronze solutions often become dramatically simpler once the data is in a useful order."
				},
				{
					title: "Unit 2: Intervals, Arrays, and Greedy Warmups: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 2: Intervals, Arrays, and Greedy Warmups",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Milking Cows",
					content:
						"Use interval merging and longest-gap reasoning to practice scanning sorted ranges carefully. The key checkpoint is explaining when two intervals count as continuous milking, when a true idle gap begins, and why sorting by start time makes the one-pass scan trustworthy.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows/solution"
				},
				{
					title: "Problem: Barn Repair",
					content:
						"Use a clean greedy idea to decide where not to cover space, which is a great Bronze introduction to minimizing wasted coverage.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB12-Barn-Repair/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB12-Barn-Repair/solution"
				},
				{
					title: "Problem: Speeding Ticket",
					content:
						"Practice range comparisons and piecewise simulation while keeping the data model simple enough to debug quickly. The solution states how each mile segment receives a limit and an actual speed, then reports the maximum violation rather than only whether a violation happened.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket/solution"
				}
			]
		},
		{
			title: "Unit 3: Counting, Sorting, and Ranking",
			curriculum: [
				{
					title: "Frequency and Ranking Problems",
					content:
						"Count occurrences, rank values, and compare groups without overcomplicating the data structures. Many Bronze tasks can be solved with careful counts and sorted lists alone."
				},
				{
					title: "Look for the Key Ordering",
					content:
						"Sorting often reveals the decisive pattern in a Bronze problem. Once data is ordered, the main logic may shrink to a single pass or a compact window scan."
				},
				{
					title: "Explain the Metric Being Optimized",
					content:
						"State exactly what quantity is being maximized, minimized, or counted. This helps prevent the common mistake of solving a nearby but different problem."
				},
				{
					title: "Compare Similar Solutions",
					content:
						"Compare two plausible but different approaches and identify why one is safer, simpler, or more general. This builds real contest judgment."
				},
				{
					title: "Unit 3: Counting, Sorting, and Ranking: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 3: Counting, Sorting, and Ranking",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Diamond Collector",
					content:
						"Use sorting and window-style reasoning to capture the largest valid group under a size-difference constraint. The final explanation identifies the sorted invariant, why the left edge only moves forward, and which sample cases prove that duplicate sizes and boundary-equal differences are handled correctly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector/solution"
				},
				{
					title: "Problem: Promotion Counting",
					content:
						"Practice tier-by-tier counting and careful propagation of totals through a simple structure. Work from the highest division downward, track how many animals must have moved up at each boundary, and verify that the intermediate totals reconcile with the before-and-after counts.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB31-Promotion-Counting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB31-Promotion-Counting/solution"
				},
				{
					title: "Problem: Acowdemia",
					content:
						"Use ranking and threshold logic to reinforce the habit of naming the exact score or count the problem asks for.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB54-Acowdemia/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB54-Acowdemia/solution"
				},
				{
					title: "Transformations Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 3: Counting, Sorting, and Ranking",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations-Java/solution"
				}
			]
		},
		{
			title: "Unit 4: Search-Flavored Bronze Problems",
			curriculum: [
				{
					title: "Path Simulation and Reachability",
					content:
						"Bronze problems can feel a little more graph-like or stateful without demanding heavy graph theory. The main habit is staying organized as the state space becomes less linear."
				},
				{
					title: "Track Structure Explicitly",
					content:
						"Use tables, parent relationships, or step histories when the problem involves movement, ancestry, or repeated transitions. Explicit structure prevents guessing."
				},
				{
					title: "Separate Representation from Process",
					content:
						"Decide what data structure best represents the problem before choosing the algorithmic loop that uses it. This is the first step toward Silver-level thinking."
				},
				{
					title: "Stay Grounded in Bronze Simplicity",
					content:
						"Even when a problem hints at graphs or search, Bronze solutions are usually still modest. Avoid overengineering the problem beyond what the constraints require."
				},
				{
					title: "Unit 4: Search-Flavored Bronze Problems: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 4: Search-Flavored Bronze Problems",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: The Lost Cow",
					content:
						"Use path simulation to model repeated movement and distance accumulation carefully. The important evidence is a trace of each outward sweep, including overshooting the target, so the total distance reflects the route actually traveled rather than only the difference between endpoints.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow/solution"
				},
				{
					title: "Problem: Wormholes",
					content:
						"Treat pairings and repeated movement as a structured search exercise with a clear, bounded state space. Build the pairing recursively, simulate rightward travel through paired wormholes, and include a termination argument showing how a repeated state reveals a cycle.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB16-Wormholes/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB16-Wormholes/solution"
				},
				{
					title: "Problem: Family Tree",
					content:
						"Use parent and ancestor reasoning to practice a light graph-style relationship problem without leaving Bronze territory. The solution compares ancestor chains, distinguishes direct parent-child relationships from cousins or siblings, and explains why the reported relationship is the most specific valid one.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB51-Family-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB51-Family-Tree/solution"
				}
			]
		},
		{
			title: "Unit 5: Contest Sets and Tier Transition",
			curriculum: [
				{
					title: "Bundle Problems by Pattern",
					content:
						"Practice solving short sets of problems that share a theme such as simulation, intervals, or counting. Start to recognize families of Bronze tasks instead of experiencing each prompt as brand new."
				},
				{
					title: "Know When Bronze Is Solved",
					content:
						"Stop polishing once the solution is clearly correct, tested, and within constraints. This is important for contest pacing and prevents time loss on unnecessary rewrites."
				},
				{
					title: "Reflect on Weak Spots",
					content:
						"Use logs to identify whether the main obstacle is misreading statements, building the wrong state model, weak test design, or overcomplicating simple tasks. Bronze growth is very diagnosable when the evidence is tracked honestly."
				},
				{
					title: "Prepare for USACO Silver",
					content:
						"Close by identifying the habits that carry forward: stronger use of sorting, cleaner state models, comfort with custom tests, and willingness to justify an approach before coding. Move to `USACO Silver` only once these habits are stable."
				},
				{
					title: "Unit 5: Contest Sets and Tier Transition: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 5: Contest Sets and Tier Transition",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Milking Order",
					content:
						"Use ordering constraints and careful placement to rehearse the kind of structured reasoning that starts to appear near the top of Bronze.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order/solution"
				},
				{
					title: "Problem: Feeding the Cows",
					content:
						"Use a late-Bronze constraint problem to test whether the solution stays simple under a more layered prompt. Focus on placing feed as far right as safely possible, tracking which cows are already covered, and proving the greedy placement does not waste future coverage.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB63-Feeding-the-Cows/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB63-Feeding-the-Cows/solution"
				},
				{
					title: "Problem: Just Stalling",
					content:
						"Use a counting-and-ordering problem as a final check for combining sorting with a careful interpretation of what is being counted.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB55-Just-Stalling/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB55-Just-Stalling/solution"
				},
				{
					title: "Mixing Milk Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 5: Contest Sets and Tier Transition",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk-Java/solution"
				}
			]
		},
		{
			title: "Unit 6: Optional Bronze Problem Bank",
			curriculum: [
				{
					title: "How to Read the Repo Bank",
					content:
						"Treat the extra `USACO-Bronze` repo folders as an optional canonical problem bank rather than as hidden missing lessons. The public course keeps a curated spine, while the repo holds a broader set of classical and modern Bronze problems for extra practice."
				},
				{
					title: "Classical Bronze Bank",
					content:
						"Classical training problems in the repo include `UB3 Friday the Thirteenth`, `UB4 Broken Necklace`, `UB5 Greedy Gift Givers`, `UB7 Name That Number`, `UB8 Palindromic Squares`, `UB9 Dual Palindromes`, `UB11 Mixing Milk`, `UB13 Combination Lock`, `UB14 Prime Cryptarithm`, and `UB15 Ski Course Design`."
				},
				{
					title: "Simulation, Arrays, and Grid Practice",
					content:
						"Mid-course optional problems include `UB17 Block Game`, `UB18 The Cow Signal`, `UB19 Don't Be Last`, `UB20 Hoof Paper Scissors`, `UB21 Cow Tipping`, `UB22/UB23/UB24 Why Did the Cow Cross the Road`, `UB26 Bovine Genomics`, `UB27 Modern Art`, and `UB28 Fence Painting`."
				},
				{
					title: "Late Bronze and Modern Contest Bank",
					content:
						"Later optional repo practice includes `UB30 Contaminated Milk`, `UB32 Angry Cows`, `UB33 Mowing the Field`, `UB34 Milk Pails`, `UB35 Circular Barn`, `UB36 Load Balancing`, `UB38 Bull in a China Shop`, `UB39 Field Reduction`, `UB40/UB43 Blocked Billboard`, `UB41 The Bovine Shuffle`, `UB42 Milk Measurement`, `UB44 Lifeguards`, `UB45 Out of Place`, `UB46 Teleportation`, `UB47 Hoofball`, `UB48 Taming the Herd`, `UB49 Team Tic-Tac-Toe`, `UB52 Do You Know Your ABCs`, `UB53 Daisy Chains`, `UB56 Photoshoot`, `UB57 Photoshoot 2`, `UB58 Air Cownditioning`, `UB59 Non-Transitive Dice`, `UB60 Rotate and Shift`, `UB61 FEB`, and `UB62 Cow College`."
				},
				{
					title: "Language Variants",
					content:
						"The repo also contains parallel `-Java` versions for many Bronze problems. Treat the plain folder as the canonical public problem entry and the `-Java` mirror as an alternate language path rather than as a duplicate lesson."
				},
				{
					title: "Unit 6: Optional Bronze Problem Bank: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 6: Optional Bronze Problem Bank",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Bronze Repo",
					content:
						"Browse the full Bronze repo bank, including the Python-side canonical problems and their parallel Java mirrors, when the curated course spine is not enough practice.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main"
				},
				{
					title: "Problem: Mixing Milk",
					content:
						"Use repeated pour operations to rehearse careful simulation and container-state updates. Each pour updates both source and destination amounts from the same transfer value, with a short trace showing that capacity limits and empty-source cases behave correctly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk/solution"
				},
				{
					title: "Problem: Hoof, Paper, Scissors",
					content:
						"Use case-based counting and matchup reasoning to strengthen simple game-logic analysis. Enumerate the possible winning rule assignments, count how many rounds each assignment wins, and explain why trying the small complete set is safer than hard-coding one assumed rule order.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB20-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB20-Hoof-Paper-Scissors/solution"
				},
				{
					title: "Problem: Circular Barn",
					content:
						"Use a stronger late-Bronze simulation and counting problem to test whether state modeling stays clean under more layered movement.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB35-Circular-Barn/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB35-Circular-Barn/solution"
				},
				{
					title: "Problem: Cow College",
					content:
						"Use a late Bronze optimization prompt to practice sorting, revenue reasoning, and clear objective definition. Sort tuition offers, evaluate each candidate price by the number of cows willing to pay it, and record how ties are handled so the chosen answer matches the stated output rule.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB62-Cow-College/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB62-Cow-College/solution"
				}
			]
		},
		{
			title: "UB 12 Barn Repair Java: Practice Studio",
			curriculum: [
				{
					title: "UB 12 Barn Repair Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 12 Barn Repair Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 12 Barn Repair Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 12 Barn Repair Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 12 Barn Repair Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 12 Barn Repair Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/solution"
				},
				{
					title: "UB 12 Barn Repair Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 12 Barn Repair Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 12 Barn Repair Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 12 Barn Repair Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java/solution"
				},
				{
					title: "Combination Lock",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 12 Barn Repair Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB13-Combination-Lock/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB13-Combination-Lock/solution"
				},
				{
					title: "Prime Cryptarithm",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 12 Barn Repair Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB14-Prime-Cryptarithm/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB14-Prime-Cryptarithm/solution"
				}
			]
		},
		{
			title: "UB 13 Combination Lock Java: Practice Studio",
			curriculum: [
				{
					title: "UB 13 Combination Lock Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 13 Combination Lock Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 13 Combination Lock Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/solution"
				},
				{
					title: "UB 13 Combination Lock Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 13 Combination Lock Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java/solution"
				},
				{
					title: "Ski Course Design",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB15-Ski-Course-Design/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB15-Ski-Course-Design/solution"
				},
				{
					title: "Block Game",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 13 Combination Lock Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB17-Block-Game/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB17-Block-Game/solution"
				}
			]
		},
		{
			title: "UB 14 Prime Cryptarithm Java: Practice Studio",
			curriculum: [
				{
					title: "UB 14 Prime Cryptarithm Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/solution"
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 14 Prime Cryptarithm Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java/solution"
				},
				{
					title: "The Cow Signal",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB18-The-Cow-Signal/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB18-The-Cow-Signal/solution"
				},
				{
					title: "Don't Be Last",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 14 Prime Cryptarithm Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB19-Dont-Be-Last/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB19-Dont-Be-Last/solution"
				}
			]
		},
		{
			title: "UB 15 Ski Course Design Java: Practice Studio",
			curriculum: [
				{
					title: "UB 15 Ski Course Design Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 15 Ski Course Design Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 15 Ski Course Design Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/solution"
				},
				{
					title: "UB 15 Ski Course Design Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 15 Ski Course Design Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java/solution"
				},
				{
					title: "Your Ride Is Here Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here-Java/solution"
				},
				{
					title: "Cow Tipping",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 15 Ski Course Design Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB21-Cow-Tipping/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB21-Cow-Tipping/solution"
				}
			]
		},
		{
			title: "UB 16 Wormholes Java: Practice Studio",
			curriculum: [
				{
					title: "UB 16 Wormholes Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 16 Wormholes Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 16 Wormholes Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/solution"
				},
				{
					title: "UB 16 Wormholes Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 16 Wormholes Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java/solution"
				},
				{
					title: "Why Did the Cow Cross the Road",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB22-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB22-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 16 Wormholes Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB23-Why-Did-the-Cow-Cross-the-Road-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB23-Why-Did-the-Cow-Cross-the-Road-II/solution"
				}
			]
		},
		{
			title: "UB 17 Block Game Java: Practice Studio",
			curriculum: [
				{
					title: "UB 17 Block Game Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 17 Block Game Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 17 Block Game Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/solution"
				},
				{
					title: "UB 17 Block Game Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 17 Block Game Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java/solution"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB24-Why-Did-the-Cow-Cross-the-Road-III/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB24-Why-Did-the-Cow-Cross-the-Road-III/solution"
				},
				{
					title: "The Lost Cow Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 17 Block Game Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow-Java/solution"
				}
			]
		},
		{
			title: "UB 18 The Cow Signal Java: Practice Studio",
			curriculum: [
				{
					title: "UB 18 The Cow Signal Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 18 The Cow Signal Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 18 The Cow Signal Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/solution"
				},
				{
					title: "UB 18 The Cow Signal Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 18 The Cow Signal Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java/solution"
				},
				{
					title: "Bovine Genomics",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics/solution"
				},
				{
					title: "Bovine Genomics Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 18 The Cow Signal Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics-Java/solution"
				}
			]
		},
		{
			title: "UB 19 Don't Be Last Java: Practice Studio",
			curriculum: [
				{
					title: "UB 19 Don't Be Last Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 19 Don't Be Last Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 19 Don't Be Last Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/solution"
				},
				{
					title: "UB 19 Don't Be Last Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 19 Don't Be Last Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java/solution"
				},
				{
					title: "Modern Art",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art/solution"
				},
				{
					title: "Modern Art Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 19 Don't Be Last Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art-Java/solution"
				}
			]
		},
		{
			title: "UB 20 Hoof Paper Scissors Java: Practice Studio",
			curriculum: [
				{
					title: "UB 20 Hoof Paper Scissors Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/solution"
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 20 Hoof Paper Scissors Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java/solution"
				},
				{
					title: "Fence Painting",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting/solution"
				},
				{
					title: "Fence Painting Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"UB 20 Hoof Paper Scissors Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting-Java/solution"
				}
			]
		},
		{
			title: "UB 21 Cow Tipping Java: Practice Studio",
			curriculum: [
				{
					title: "UB 21 Cow Tipping Java: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "UB 21 Cow Tipping Java: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "example"
					})
				},
				{
					title: "UB 21 Cow Tipping Java: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/solution"
				},
				{
					title: "UB 21 Cow Tipping Java: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "UB 21 Cow Tipping Java: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java/solution"
				},
				{
					title: "Speeding Ticket Java",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket-Java/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket-Java/solution"
				},
				{
					title: "Friday the Thirteenth",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "UB 21 Cow Tipping Java: Practice Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB3-Friday-the-Thirteenth/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB3-Friday-the-Thirteenth/solution"
				}
			]
		}
	]
};
