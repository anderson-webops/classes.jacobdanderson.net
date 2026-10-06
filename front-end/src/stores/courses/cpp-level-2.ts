import type { RawCourse } from "./types";
import { cppArrayProjectBriefs } from "./cppArrayProjectBriefs";
import { cppLifetimeProjectBriefs } from "./cppLifetimeProjectBriefs";
import { cppPointerProjectBriefs } from "./cppPointerProjectBriefs";
import { cppTwoDimensionalProjectBriefs } from "./cppTwoDimensionalProjectBriefs";

const cppLevel2SourceCourse: RawCourse = {
	name: "C++ Level 2",
	modules: [
		{
			title: "CPPM0 Lifetime, References, and Ownership Framing",
			curriculum: [
				{
					title: "Level 2 Positioning and Ownership Vocabulary",
					content: cppLifetimeProjectBriefs.positioning
				},
				{
					title: "References, Lifetimes, and Evidence-Based Debugging",
					content: cppLifetimeProjectBriefs.references
				},
				{
					title: "CPPM0 Project 1: Lifetime Tracing Warm-Up",
					content: cppLifetimeProjectBriefs.tracing.replaceAll(
						/\bTODO\b/g,
						"`TODO`"
					),
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Lifetime-Tracing-Warm-Up/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Lifetime-Tracing-Warm-Up/solution"
				},
				{
					title: "CPPM0 Project 2: Ownership Boundary Debugging",
					content: cppLifetimeProjectBriefs.ownership.replaceAll(
						/\bTODO\b/g,
						"`TODO`"
					),
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Ownership-Boundary-Debugging/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Ownership-Boundary-Debugging/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPM0 Project 3: Lifetime Diagram Extension",
					content: cppLifetimeProjectBriefs.extension
				}
			]
		},
		{
			title: "CPPM1 Pointers and Addresses",
			curriculum: [
				{
					title: "Pointer Basics, Aliasing, and Failure Modes",
					content: cppLifetimeProjectBriefs.pointers
				},
				{
					title: "CPPM1 Project 1: Pointer Starter",
					content: cppLifetimeProjectBriefs.pointerProject,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointers-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointers"
				},
				{
					title: "CPPM1 Project 2: Pointer Error Examples",
					content: cppPointerProjectBriefs.errors,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Error-Examples-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Error-Examples"
				}
			],
			supplementalProjects: [
				{
					title: "Pointers: Practice Lab",
					content: cppPointerProjectBriefs.practice,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Practice"
				}
			]
		},
		{
			title: "CPPM2 Raw Arrays and Pointer Arithmetic",
			curriculum: [
				{
					title: "Raw Arrays as Contiguous Memory",
					content: cppArrayProjectBriefs.basics,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Basics-Reference"
				},
				{
					title: "Pointer Arithmetic and Offset Reasoning",
					content: cppArrayProjectBriefs.arithmetic,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Pointer-Arithmetic-Reference"
				},
				{
					title: "CPPM2 Project 1: Array Practice",
					content: cppArrayProjectBriefs.practice,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice"
				},
				{
					title: "CPPM2 Project 2: Tic Tac Toe",
					content: cppArrayProjectBriefs.game,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Tic-Tac-Toe-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Tic-Tac-Toe"
				}
			],
			supplementalProjects: [
				{
					title: "Raw Arrays: Verification Drill",
					content: cppArrayProjectBriefs.verification,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice"
				}
			]
		},
		{
			title: "CPPM3 Two-Dimensional Arrays and Layout",
			curriculum: [
				{
					title: "Two-Dimensional Arrays, Layout, and Function Boundaries",
					content: cppTwoDimensionalProjectBriefs.layout,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-Two-Dimensional-Arrays-Reference",
					ideImport: true
				},
				{
					title: "CPPM3 Project 1: 2D Array Practice",
					content: cppTwoDimensionalProjectBriefs.practice,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Practice"
				},
				{
					title: "CPPM3 Project 2: Bank Transactions",
					content: cppTwoDimensionalProjectBriefs.bank,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-Bank-Transactions-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-Bank-Transactions"
				}
			],
			supplementalProjects: [
				{
					title: "Two-Dimensional Arrays: Extension Challenge",
					content: cppTwoDimensionalProjectBriefs.extension,
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Extension-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Extension"
				}
			]
		},
		{
			title: "CPPM4 Dynamic Memory and Custom Dynamic Arrays",
			curriculum: [
				{
					title: "Dynamic Allocation and Manual Ownership",
					content:
						"`new` and `delete` make heap allocation, leaks, and dangling pointers explicit. Include why heap objects outlive the current stack frame until deleted; how ownership must be assigned before allocation; why every allocation needs exactly one cleanup path; what can go wrong during replacement and resizing; and why raw `new`/`delete` is a learning tool for ownership rather than the preferred modern endpoint.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Variables-Reference"
				},
				{
					title: "CPPM4 Project 1: Assembly Line",
					content:
						"Use dynamically created objects in a small loop-driven workflow so allocation, replacement, and cleanup happen in a concrete program.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Assembly-Line",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Assembly-Line"
				},
				{
					title: "CPPM4 Project 2: Dynamic Array Implementation",
					content:
						"Implement a growable array manually with capacity tracking, reallocation, copying, and cleanup. This is the course's core ownership and resizing lab.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation"
				},
				{
					title: "CPPM4 Project 3: Grocery List",
					content:
						"Adapt the custom dynamic array to store real record data instead of plain integers. This shows how quickly manual container management becomes more demanding.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Grocery-List",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Grocery-List"
				}
			],
			supplementalProjects: [
				{
					title: "Dynamic Memory: Verification and Reflection",
					content:
						"Pause after the custom-array work and explain what gets allocated, copied, and deleted at each stage of a resize.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation"
				}
			]
		},
		{
			title: "CPPM5 Manual-Memory Capstones",
			curriculum: [
				{
					title: "Manual-Memory Class Design",
					content:
						"Use capstone-sized classes that own their own storage so invariants have to be maintained across multiple methods, not just in a single free function. Include constructors that establish valid storage, destructors that release it, copy and move operations that preserve valid states without double deletion, methods that preserve size/capacity rules, input validation before mutation, and how matrix/profile examples force class boundaries and ownership rules to stay aligned."
				},
				{
					title: "CPPM5 Project 1: Matrix Fun with a Matrix Class",
					content:
						"Model a matrix as a class, then implement fill, add, multiply, and display operations. This is a useful design capstone because it combines grid reasoning with class boundaries.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Matrix-Fun-with-Matrix-Class",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Matrix-Fun-with-Matrix-Class"
				},
				{
					title: "CPPM5 Project 2: Profile Posts",
					content:
						"Rebuild the profile-posts concept with manual dynamic storage instead of `std::vector`. This is intentionally harder than the Level 1 capstone and serves as a second-course endpoint.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts"
				},
				{
					title: "Modern Ownership and Next-Step Positioning",
					content:
						"After the manual-memory capstones, the modern correction is RAII: resources normally tie to object lifetime, and single-owner heap data usually moves toward `std::unique_ptr` or a standard container. The next-step comparison separates cleanup responsibility, design responsibility, and course placement: `C++ Level 3` for medium-size idiomatic C++, `Data Structures and Algorithms in C++` for implementation depth, or `C Systems Engineering` for lower-level representation."
				}
			],
			supplementalProjects: [
				{
					title: "Manual-Memory Capstones: Extension Challenge",
					content:
						"Extend either capstone with one extra operation or safety check so ownership reasoning continues under a little more pressure.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts"
				},
				{
					title: "CPPM5 Project 3: Modern Ownership Reflection",
					content:
						"Pick one manual allocation from a capstone and compare it with a standard container or `std::unique_ptr` version. The comparison focuses on ownership responsibilities, not rewriting the whole project.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Modern-Ownership-Reflection",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Modern-Ownership-Reflection"
				}
			]
		}
	]
};

interface CppLevel2ModuleFlow {
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const CPP_LEVEL_2_OPTIONAL_CURRICULUM = new Set([
	"CPPM0 Project 2: Ownership Boundary Debugging",
	"CPPM1 Project 2: Pointer Error Examples",
	"CPPM2 Project 2: Tic Tac Toe",
	"CPPM3 Project 2: Bank Transactions",
	"CPPM4 Project 1: Assembly Line",
	"CPPM4 Project 3: Grocery List",
	"CPPM5 Project 1: Matrix Fun with a Matrix Class"
]);

const CPP_LEVEL_2_CHALLENGE_CURRICULUM = new Set([
	"CPPM1 Project 2: Pointer Error Examples",
	"CPPM4 Project 3: Grocery List"
]);

const CPP_LEVEL_2_MODULE_FLOW: Record<string, CppLevel2ModuleFlow> = {
	"CPPM0 Lifetime, References, and Ownership Framing": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"C++20 warning-clean build",
			"AddressSanitizer / UBSan",
			"owner / observer",
			"reference lifetime",
			"alias diagram"
		],
		flowNote:
			"Begin with a clean C++20 build and a supported AddressSanitizer/UndefinedBehaviorSanitizer run before tracing references. Complete one lifetime diagram and one mutation trace; the second ownership-debugging project is a choice after the trace agrees with observed behavior."
	},
	"CPPM1 Pointers and Addresses": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"address",
			"dereference",
			"nullptr",
			"non-owning pointer",
			"failure explanation"
		],
		flowNote:
			"Use pointers only as non-owning observers and mutators in this module. Predict aliases before running, check for `nullptr` before dereferencing, and explain one failed case with a trace or diagnostic; the larger error-example set is a challenge rather than required volume."
	},
	"CPPM2 Raw Arrays and Pointer Arithmetic": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"contiguous storage",
			"explicit size",
			"valid range",
			"pointer offset",
			"boundary cases"
		],
		flowNote:
			"Compare indexed and pointer traversal over the same fixed data while keeping an explicit size at every function boundary. Prove zero logical length, one element, full capacity, and rejected out-of-range cases; Tic Tac Toe is an optional integration build."
	},
	"CPPM3 Two-Dimensional Arrays and Layout": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"row-major layout",
			"row / column contract",
			"rectangular dimensions",
			"nested traversal",
			"index validation"
		],
		flowNote:
			"Distinguish nested rows, one real flat array, and separately owned row pointers before required 2D Array Practice. Test rectangular, empty, fractional-average and allocation-failure cases. Bank Transactions is an optional fictional input-ledger choice; the extension adds checked coordinates and column averages in a separate project."
	},
	"CPPM4 Dynamic Memory and Custom Dynamic Arrays": {
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"new[] / delete[]",
			"Rule of Three / Five",
			"deep copy",
			"move state",
			"sanitizer evidence"
		],
		flowNote:
			"Treat raw allocation as a bounded ownership laboratory, not the default production design. Pass the copy-control gate before building the dynamic array, then prove construction, growth, deep copy, move, self-assignment, destruction, and empty-state behavior with diagnostics enabled; Assembly Line and Grocery List are optional transfer work."
	},
	"CPPM5 Manual-Memory Capstones": {
		estimatedTime: "5–7 sessions · 45–60 minutes each",
		keyBlocks: [
			"owning class invariant",
			"copy / move lifecycle",
			"validated command",
			"regression harness",
			"RAII comparison"
		],
		flowNote:
			"Use fictional, local-only Profile Posts as the principal capstone and preserve a valid state after every command and lifecycle operation. Finish with warning-clean and sanitizer-clean evidence plus a focused comparison showing how `std::vector` or `std::unique_ptr` removes manual cleanup responsibilities; Matrix is an optional parallel design."
	}
};

function cppLevel2SupplementalPath(title: string) {
	return /extension|error examples|grocery list/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function decorateCppLevel2Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = CPP_LEVEL_2_MODULE_FLOW[module.title];
	const optionalCurriculum = module.curriculum.filter(item =>
		CPP_LEVEL_2_OPTIONAL_CURRICULUM.has(item.title)
	);
	const coreCurriculum = module.curriculum
		.filter(item => !CPP_LEVEL_2_OPTIONAL_CURRICULUM.has(item.title))
		.map((item, index) => ({
			...item,
			content:
				index === 0 && flow
					? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
					: item.content,
			learningPath: "core" as const
		}));

	if (module.title === "CPPM0 Lifetime, References, and Ownership Framing") {
		coreCurriculum.splice(1, 0, {
			title: "CPPM0 Project 0: C++20 Memory Diagnostics Readiness Check",
			content: cppLifetimeProjectBriefs.diagnostics,
			learningPath: "core"
		});
	}

	if (module.title === "CPPM4 Dynamic Memory and Custom Dynamic Arrays") {
		const implementationIndex = coreCurriculum.findIndex(
			item =>
				item.title === "CPPM4 Project 2: Dynamic Array Implementation"
		);
		coreCurriculum.splice(implementationIndex, 0, {
			title: "Copy-Control Gate: Rule of Three and Rule of Five",
			content: [
				"**Completion evidence:**",
				"- Ownership diagram for constructor, destructor, copy constructor, copy assignment, move constructor, and move assignment.",
				"- A shallow-copy failure explanation covering shared storage, double deletion, and how a deep copy changes the ownership graph.",
				"- Self-assignment and moved-from-state rules written before implementation.",
				"- A short Rule of Zero comparison explaining why a standard container is preferred after the manual exercise."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "CPPM5 Manual-Memory Capstones") {
		coreCurriculum.push({
			title: "CPPM5 Capstone Completion Contract: Profile Posts Ownership",
			content: [
				"**Completion evidence:**",
				"- Fictional seed profiles only; no real personal, account, or public-posting data.",
				"- Warning-clean and sanitizer-clean build instructions from a fresh checkout.",
				"- Tests or transcripts for empty, add, view, update, remove, invalid index, invalid command, copy, move, resize, self-assignment, and destruction behavior.",
				"- One ownership diagram, one corrected failure, and one focused RAII rewrite or comparison using `std::vector` or `std::unique_ptr`."
			].join("\n"),
			learningPath: "core"
		});
	}

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum: coreCurriculum,
		supplementalProjects: [
			...optionalCurriculum.map(item => ({
				...item,
				learningPath: CPP_LEVEL_2_CHALLENGE_CURRICULUM.has(item.title)
					? ("challenge" as const)
					: ("choice" as const)
			})),
			...module.supplementalProjects.map(item => ({
				...item,
				learningPath: cppLevel2SupplementalPath(item.title)
			}))
		]
	};
}

export const cppLevel2Course: RawCourse = {
	...cppLevel2SourceCourse,
	modules: cppLevel2SourceCourse.modules.map(decorateCppLevel2Module)
};
