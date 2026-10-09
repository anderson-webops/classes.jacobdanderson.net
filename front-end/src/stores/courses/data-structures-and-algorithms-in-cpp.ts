import type { RawCourse } from "./types";
import { dsaGraphLessons } from "./dsaGraphLessons";
import { dsaMarkovLessons } from "./dsaMarkovLessons";
import { dsaMazeLessons } from "./dsaMazeLessons";
import { dsaQuicksortLessons } from "./dsaQuicksortLessons";
import { dsaSetupLessons } from "./dsaSetupLessons";
import { dsaTaskRecordLessons } from "./dsaTaskRecordLessons";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const dataStructuresAndAlgorithmsInCppSourceCourse: RawCourse = {
	name: "Data Structures and Algorithms in C++",
	modules: [
		{
			title: "DSCPP0 Setup and Positioning",
			curriculum: [
				{
					title: "Setup and Positioning Core Concepts",
					content: dsaSetupLessons.positioning,
					ideImport: false
				},
				{
					title: "Preferred Toolchain",
					content: dsaSetupLessons.toolchain,
					ideImport: false
				},
				{
					title: "Why This Course Uses Small Labs Instead of Giant Apps",
					content: dsaSetupLessons.invariant,
					ideImport: false
				},
				{
					title: "Working Habits for the Sequence",
					content: dsaSetupLessons.habits,
					ideImport: false
				},
				{
					title: "DSCPP0 Setup and Positioning: Core Project",
					content: dsaSetupLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp0-setup-and-positioning/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp0-setup-and-positioning/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Complexity Checkpoint: Setup and Positioning",
					content: dsaSetupLessons.checkpoint,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSA-08-dscpp0-setup-and-positioning/README.md"
				},
				{
					title: "Setup and Positioning Transfer Practice",
					content: dsaSetupLessons.transfer,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSA-01-dscpp0-setup-and-positioning-supplemental-2/README.md"
				},
				{
					title: "Setup and Positioning Extension Practice",
					content: dsaSetupLessons.extension,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSA-02-dscpp0-setup-and-positioning-supplemental-3/README.md"
				}
			]
		},
		{
			title: "DSCPP1 Interfaces, Records, and a Task Manager CLI",
			curriculum: [
				{
					title: "Interfaces, Records, and a Task Manager CLI Core Concepts",
					id: "data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-curriculum-interfaces-records-and-a-task-manager-cli-core-concepts",
					content: dsaTaskRecordLessons.records,
					ideImport: false
				},
				{
					title: "Filtering, Removal, and Stable Output",
					content: dsaTaskRecordLessons.views,
					ideImport: false
				},
				{
					title: "Command-Style Program Structure",
					content: dsaTaskRecordLessons.driver,
					ideImport: false
				},
				{
					title: "Verification Review: Interfaces, Records, and a Task Manager CLI",
					id: "data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-curriculum-verification-review-interfaces-records-and-a-task-manager-cli",
					content: dsaTaskRecordLessons.verification,
					ideImport: false
				},
				{
					title: "DSCPP1 Interfaces, Records, and a Task Manager CLI: Core Project",
					id: "data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-curriculum-core-project-interfaces-records-and-a-task-manager-cli",
					content: dsaTaskRecordLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP1-Task-Manager-CLI/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP1-Task-Manager-CLI/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Task Manager CLI",
					id: "data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-supplemental-project-task-manager-cli",
					content: dsaTaskRecordLessons.checkpoint,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP1-Task-Manager-CLI/README.md"
				},
				{
					title: "Task Manager CLI Transfer Practice",
					id: "data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-supplemental-task-manager-cli-transfer-practice",
					content: dsaTaskRecordLessons.transfer,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP1-Task-Manager-CLI/README.md"
				},
				{
					title: "Task Manager CLI Extension Practice",
					id: "data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-supplemental-task-manager-cli-extension-practice",
					content: dsaTaskRecordLessons.extension,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP1-Task-Manager-CLI/README.md"
				}
			]
		},
		{
			title: "DSCPP2 Graphs and Shortest Paths",
			curriculum: [
				{
					title: "Adjacency Matrices and Weighted Connectivity",
					id: "data-structures-and-algorithms-in-cpp-dscpp2-graphs-and-shortest-paths-curriculum-graphs-and-shortest-paths-core-concepts",
					content: dsaGraphLessons.representation,
					ideImport: false
				},
				{
					title: "Shortest Path Thinking",
					content: dsaGraphLessons.selection,
					ideImport: false
				},
				{
					title: "Path Reconstruction",
					content: dsaGraphLessons.reconstruction,
					ideImport: false
				},
				{
					title: "Graphs and Shortest Paths: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle: "Graphs and Shortest Paths",
						section: "verification"
					})
				},
				{
					title: "DSCPP2 Graphs and Shortest Paths: Core Project",
					content: dsaGraphLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP2-Graph-Navigation/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP2-Graph-Navigation/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Graph Navigation",
					content: dsaGraphLessons.walkthrough,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP2-Graph-Navigation/README.md"
				},
				{
					title: "Graph Navigation Transfer Practice",
					content: dsaGraphLessons.transfer,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP2-Graph-Navigation/README.md"
				},
				{
					title: "Graph Navigation Extension Practice",
					content: dsaGraphLessons.extension,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP2-Graph-Navigation/README.md"
				}
			]
		},
		{
			title: "DSCPP3 STL Containers and State-Based Text Generation",
			curriculum: [
				{
					title: "Vectors, Sets, Maps, and Deques as Different Stories",
					content: dsaMarkovLessons.containers,
					ideImport: false
				},
				{
					title: "Tokenization and Cleanup",
					content: dsaMarkovLessons.cleanup,
					ideImport: false
				},
				{
					title: "State Windows and Markov-Style Generation",
					content: dsaMarkovLessons.windows,
					ideImport: false
				},
				{
					title: "STL Containers and State Based Text Generation: Verification and Reflection",
					content: dsaMarkovLessons.verification,
					ideImport: false
				},
				{
					title: "DSCPP3 STL Containers and State-Based Text Generation: Core Project",
					content: dsaMarkovLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP3-Markov-Text-Generator/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP3-Markov-Text-Generator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Markov Text Generator",
					content: dsaMarkovLessons.checkpoint,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP3-Markov-Text-Generator/README.md"
				},
				{
					title: "Container Text Generation Transfer Practice",
					content: dsaMarkovLessons.transfer,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP3-Markov-Text-Generator/README.md"
				},
				{
					title: "Container Text Generation Extension Practice",
					content: dsaMarkovLessons.extension,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP3-Markov-Text-Generator/README.md"
				}
			]
		},
		{
			title: "DSCPP4 Recursion and Backtracking in 3D Mazes",
			curriculum: [
				{
					title: "Recursive Search as Controlled Exploration",
					content: dsaMazeLessons.recursion,
					ideImport: false
				},
				{
					title: "Visited State and Cycle Prevention",
					content: dsaMazeLessons.state,
					ideImport: false
				},
				{
					title: "Path Construction and Rollback",
					content: dsaMazeLessons.coordinates,
					ideImport: false
				},
				{
					title: "Recursion and Backtracking in 3D Mazes: Verification and Reflection",
					content: dsaMazeLessons.verification,
					ideImport: false
				},
				{
					title: "DSCPP4 Recursion and Backtracking in 3D Mazes: Core Project",
					content: dsaMazeLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP4-Recursive-Maze-Pathfinder/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP4-Recursive-Maze-Pathfinder/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Recursive Maze Pathfinder",
					content: dsaMazeLessons.checkpoint,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP4-Recursive-Maze-Pathfinder/README.md"
				},
				{
					title: "Recursive Maze Transfer Practice",
					content: dsaMazeLessons.transfer,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP4-Recursive-Maze-Pathfinder/README.md"
				},
				{
					title: "Recursive Maze Extension Practice",
					content: dsaMazeLessons.extension,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP4-Recursive-Maze-Pathfinder/README.md"
				}
			]
		},
		{
			title: "DSCPP5 Quicksort and Partitioning",
			curriculum: [
				{
					title: "Why Partition-Based Sorting Works",
					id: "data-structures-and-algorithms-in-cpp-dscpp5-quicksort-and-partitioning-curriculum-quicksort-and-partitioning-core-concepts",
					content: dsaQuicksortLessons.partition,
					ideImport: false
				},
				{
					title: "Median of Three and Practical Pivot Choice",
					content: dsaQuicksortLessons.pivot,
					ideImport: false
				},
				{
					title: "Recursive Boundaries and Base Cases",
					content: dsaQuicksortLessons.recursion,
					ideImport: false
				},
				{
					title: "Quicksort and Partitioning: Verification and Reflection",
					content: dsaQuicksortLessons.verification,
					ideImport: false
				},
				{
					title: "DSCPP5 Quicksort and Partitioning: Core Project",
					content: dsaQuicksortLessons.project,
					ideImport: true,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP5-Quicksort-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP5-Quicksort-Toolkit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Quicksort Toolkit",
					content: dsaQuicksortLessons.checkpoint,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP5-Quicksort-Toolkit/README.md"
				},
				{
					title: "Quicksort Partition Transfer Practice",
					content: dsaQuicksortLessons.transfer,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP5-Quicksort-Toolkit/README.md"
				},
				{
					title: "Quicksort Partition Extension Practice",
					content: dsaQuicksortLessons.extension,
					ideImport: false,
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/blob/main/DSCPP5-Quicksort-Toolkit/README.md"
				}
			]
		},
		{
			title: "DSCPP6 Templates and Linked Structures",
			curriculum: [
				{
					title: "Why Templates Matter Here",
					content:
						"Templates let the same linked-list logic work across multiple data types without copying code. The important distinction is that templates are resolved at compile time rather than behaving like runtime generics."
				},
				{
					title: "Single-Linked Nodes and Pointer Updates",
					content:
						"Insertion and removal require one pointer change at a time. This is the point where head updates, middle insertions, and missing-target behavior must be fluent. Keep the CS235 linked-list discipline: templated list, no STL inside the implementation, clear/remove/index tests, and no leaks."
				},
				{
					title: "Index Access and Structural Tradeoffs",
					content:
						"Use index-based access mainly as a learning contrast: linked lists are good at local insertion patterns and poor at random access. Connect that tradeoff to later tree and array conversations."
				},
				{
					title: "Templates and Linked Structures: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle: "Templates and Linked Structures",
						section: "verification"
					})
				},
				{
					title: "DSCPP6 Templates and Linked Structures: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP6 Templates and Linked Structures",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Template Linked List",
					content:
						"Implement a templated singly linked list with insert, remove, clear, indexed access, and string rendering helpers. This is the structural bridge into the tree labs and keeps the pointer discipline visible.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/solution"
				},
				{
					title: "Template Linked List Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP6 Templates and Linked Structures",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-13-dscpp6-templates-and-linked-structures-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-13-dscpp6-templates-and-linked-structures-supplemental-2/solution"
				},
				{
					title: "Template Linked List Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP6 Templates and Linked Structures",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-14-dscpp6-templates-and-linked-structures-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-14-dscpp6-templates-and-linked-structures-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP7 Binary Search Trees",
			curriculum: [
				{
					title: "Ordering Invariants in Tree Form",
					content:
						"BSTs are ordered structures, not just branching shapes. State the left-subtree and right-subtree invariants clearly and use those invariants to justify insertion, search, and removal behavior."
				},
				{
					title: "Recursive Insert and Search",
					content:
						"Make recursive tree traversal feel like controlled narrowing: each comparison shrinks the problem to one subtree. This is the first place where recursion becomes a natural tool for data-structure navigation instead of only maze search."
				},
				{
					title: "Removal with Predecessors",
					content:
						"Removal requires careful reasoning because it combines structure cases with invariant preservation. Explicitly reason through leaf removal, one-child replacement, two-child replacement using the in-order predecessor, duplicate rejection, and invalid removals that leave the tree unchanged."
				},
				{
					title: "Binary Search Trees: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle: "Binary Search Trees",
						section: "verification"
					})
				},
				{
					title: "DSCPP7 Binary Search Trees: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP7 Binary Search Trees",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Binary Search Tree",
					content:
						"Implement BST insertion, duplicate rejection, level-order debugging output, and removal using the in-order predecessor convention. This follows the structure of the source BST lab while cleaning up the visible project surface.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/solution"
				},
				{
					title: "BST Invariant Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP7 Binary Search Trees",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-15-dscpp7-binary-search-trees-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-15-dscpp7-binary-search-trees-supplemental-2/solution"
				},
				{
					title: "BST Invariant Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP7 Binary Search Trees",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-16-dscpp7-binary-search-trees-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-16-dscpp7-binary-search-trees-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP8 AVL Trees and Rebalancing",
			curriculum: [
				{
					title: "Why Balancing Exists",
					content:
						"Start from the BST weakness: ordered insert patterns can destroy the expected performance story. AVL trees exist to keep height under control by repairing local imbalance as insertions and removals change the shape."
				},
				{
					title: "Heights and Balance Factors",
					content:
						"Height maintenance and balance factors are structural evidence. The important work is computing imbalance from the tree shape, not just memorizing the names of the rotation cases."
				},
				{
					title: "Single and Double Rotations",
					content:
						"Make left-left, right-right, left-right, and right-left cases concrete with tiny examples. Rotations are local rewiring steps that preserve in-order structure while reducing height problems. Stress the CS235-style verification cases: ordered inserts, duplicate inserts, missing removals, and repeated add/remove operations that keep every balance factor valid."
				},
				{
					title: "AVL Trees and Rebalancing: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle: "AVL Trees and Rebalancing",
						section: "verification"
					})
				},
				{
					title: "DSCPP8 AVL Trees and Rebalancing: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP8 AVL Trees and Rebalancing",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: AVL Tree",
					content:
						"Extend the BST ideas into a self-balancing AVL tree with height tracking, rotations, and removal that preserves both BST ordering and balance constraints. This is the natural sequel to the source AVL lab.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/solution"
				},
				{
					title: "AVL Rotation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP8 AVL Trees and Rebalancing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-17-dscpp8-avl-trees-and-rebalancing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-17-dscpp8-avl-trees-and-rebalancing-supplemental-2/solution"
				},
				{
					title: "AVL Rotation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DSCPP8 AVL Trees and Rebalancing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-18-dscpp8-avl-trees-and-rebalancing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-18-dscpp8-avl-trees-and-rebalancing-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP9 Benchmarking and Data-Structure Tradeoffs",
			curriculum: [
				{
					title: "Asymptotic Language versus Real Measurements",
					content:
						"Close the course by connecting complexity claims to actual timing data. Big-O is still the right long-run story, but practical measurements depend on constants, memory layout, balancing, and container implementation details."
				},
				{
					title: "Comparing Standard Containers and Custom Structures",
					content:
						"Use timed inserts, removals, and lookups to compare `set`, `unordered_set`, a custom linked list, a BST, and an AVL tree under both random and ordered workloads. The point is not to crown one universal winner, but to connect operation patterns to the right tool and to explain why ordered input punishes an unbalanced BST."
				},
				{
					title: "Interpreting Results Without Overclaiming",
					content:
						"Talk cautiously about benchmarks: build mode, machine state, sample size, warm-up, workload shape, random seed, and implementation detail all matter. Separate correctness tests from timing, use repeated measurements and a robust summary such as the median, and preserve the raw results. Good benchmarking language reports what this fixture supports without declaring a universal winner."
				},
				{
					title: "Benchmarking and Data Structure Tradeoffs: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"Benchmarking and Data Structure Tradeoffs",
						section: "verification"
					})
				},
				{
					title: "DSCPP9 Benchmarking and Data-Structure Tradeoffs: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DSCPP9 Benchmarking and Data-Structure Tradeoffs",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Performance Benchmarks",
					content:
						"Benchmark standard containers and custom linked or tree structures on a controlled insertion workload, then explain the timing differences in terms of structure, lookup behavior, and balancing. This is the reflective capstone to the whole sequence.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/solution"
				},
				{
					title: "Benchmarking Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DSCPP9 Benchmarking and Data-Structure Tradeoffs",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-19-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-19-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-2/solution"
				},
				{
					title: "Benchmarking Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DSCPP9 Benchmarking and Data-Structure Tradeoffs",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-20-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-20-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Algorithm Lab 11: Sequence Invariant Studio",
			curriculum: [
				{
					title: "C++ Algorithm Lab 11: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 11: Sequence Invariant Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Algorithm Lab 11: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 11: Sequence Invariant Studio",
						section: "example"
					})
				},
				{
					title: "C++ Algorithm Lab 11: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 11: Sequence Invariant Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/solution"
				},
				{
					title: "C++ Algorithm Lab 11: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 11: Sequence Invariant Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Algorithm Lab 11: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 11: Sequence Invariant Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/solution"
				},
				{
					title: "Sequence Invariant Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 11: Sequence Invariant Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-21-applied-studio-11-c-algorithm-lab-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-21-applied-studio-11-c-algorithm-lab-11-supplemental-2/solution"
				},
				{
					title: "Sequence Invariant Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 11: Sequence Invariant Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-22-applied-studio-11-c-algorithm-lab-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-22-applied-studio-11-c-algorithm-lab-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Algorithm Lab 12: Graph Route Analysis Studio",
			curriculum: [
				{
					title: "C++ Algorithm Lab 12: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 12: Graph Route Analysis Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Algorithm Lab 12: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 12: Graph Route Analysis Studio",
						section: "example"
					})
				},
				{
					title: "C++ Algorithm Lab 12: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 12: Graph Route Analysis Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/solution"
				},
				{
					title: "C++ Algorithm Lab 12: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 12: Graph Route Analysis Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Algorithm Lab 12: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 12: Graph Route Analysis Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/solution"
				},
				{
					title: "Graph Route Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 12: Graph Route Analysis Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-23-applied-studio-12-c-algorithm-lab-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-23-applied-studio-12-c-algorithm-lab-12-supplemental-2/solution"
				},
				{
					title: "Graph Route Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 12: Graph Route Analysis Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-24-applied-studio-12-c-algorithm-lab-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-24-applied-studio-12-c-algorithm-lab-12-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Algorithm Lab 13: Recursive Search Studio",
			curriculum: [
				{
					title: "C++ Algorithm Lab 13: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 13: Recursive Search Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Algorithm Lab 13: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 13: Recursive Search Studio",
						section: "example"
					})
				},
				{
					title: "C++ Algorithm Lab 13: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 13: Recursive Search Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/solution"
				},
				{
					title: "C++ Algorithm Lab 13: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 13: Recursive Search Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Algorithm Lab 13: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 13: Recursive Search Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/solution"
				},
				{
					title: "Recursive Search Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 13: Recursive Search Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-25-applied-studio-13-c-algorithm-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-25-applied-studio-13-c-algorithm-lab-13-supplemental-2/solution"
				},
				{
					title: "Recursive Search Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 13: Recursive Search Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-26-applied-studio-13-c-algorithm-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-26-applied-studio-13-c-algorithm-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Algorithm Lab 14: Partition Sorting Studio",
			curriculum: [
				{
					title: "C++ Algorithm Lab 14: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 14: Partition Sorting Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Algorithm Lab 14: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 14: Partition Sorting Studio",
						section: "example"
					})
				},
				{
					title: "C++ Algorithm Lab 14: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 14: Partition Sorting Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/solution"
				},
				{
					title: "C++ Algorithm Lab 14: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 14: Partition Sorting Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Algorithm Lab 14: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 14: Partition Sorting Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/solution"
				},
				{
					title: "Partition Sorting Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 14: Partition Sorting Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-27-applied-studio-14-c-algorithm-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-27-applied-studio-14-c-algorithm-lab-14-supplemental-2/solution"
				},
				{
					title: "Partition Sorting Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 14: Partition Sorting Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-28-applied-studio-14-c-algorithm-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-28-applied-studio-14-c-algorithm-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Algorithm Lab 15: Template Linked Structure Studio",
			curriculum: [
				{
					title: "C++ Algorithm Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 15: Template Linked Structure Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Algorithm Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 15: Template Linked Structure Studio",
						section: "example"
					})
				},
				{
					title: "C++ Algorithm Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 15: Template Linked Structure Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/solution"
				},
				{
					title: "C++ Algorithm Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 15: Template Linked Structure Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Algorithm Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 15: Template Linked Structure Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/solution"
				},
				{
					title: "Template Linked Structure Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 15: Template Linked Structure Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-29-applied-studio-15-c-algorithm-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-29-applied-studio-15-c-algorithm-lab-15-supplemental-2/solution"
				},
				{
					title: "Template Linked Structure Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 15: Template Linked Structure Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-30-applied-studio-15-c-algorithm-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-30-applied-studio-15-c-algorithm-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Algorithm Lab 16: Tree Invariant Studio",
			curriculum: [
				{
					title: "C++ Algorithm Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 16: Tree Invariant Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Algorithm Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 16: Tree Invariant Studio",
						section: "example"
					})
				},
				{
					title: "C++ Algorithm Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 16: Tree Invariant Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/solution"
				},
				{
					title: "C++ Algorithm Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 16: Tree Invariant Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Algorithm Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 16: Tree Invariant Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/solution"
				},
				{
					title: "Tree Invariant Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 16: Tree Invariant Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-31-applied-studio-16-c-algorithm-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-31-applied-studio-16-c-algorithm-lab-16-supplemental-2/solution"
				},
				{
					title: "Tree Invariant Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 16: Tree Invariant Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-32-applied-studio-16-c-algorithm-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-32-applied-studio-16-c-algorithm-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Algorithm Lab 17: Benchmarking Capstone Studio",
			curriculum: [
				{
					title: "C++ Algorithm Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 17: Benchmarking Capstone Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Algorithm Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 17: Benchmarking Capstone Studio",
						section: "example"
					})
				},
				{
					title: "C++ Algorithm Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 17: Benchmarking Capstone Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/solution"
				},
				{
					title: "C++ Algorithm Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 17: Benchmarking Capstone Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Algorithm Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C++ data structures and algorithms",
						moduleTitle:
							"C++ Algorithm Lab 17: Benchmarking Capstone Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/solution"
				},
				{
					title: "Benchmarking Capstone Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 17: Benchmarking Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-33-applied-studio-17-c-algorithm-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-33-applied-studio-17-c-algorithm-lab-17-supplemental-2/solution"
				},
				{
					title: "Benchmarking Capstone Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"C++ Algorithm Lab 17: Benchmarking Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-34-applied-studio-17-c-algorithm-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-34-applied-studio-17-c-algorithm-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

interface DataStructuresCppModuleFlow {
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const DATA_STRUCTURES_CPP_PRIMARY_MODULE_COUNT = 10;

const DATA_STRUCTURES_CPP_MODULE_FLOW: Record<
	string,
	DataStructuresCppModuleFlow
> = {
	"DSCPP0 Setup and Positioning": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"C++20 / CMake",
			"warnings / sanitizers",
			"operation count",
			"invariant",
			"deterministic test"
		],
		flowNote:
			"Confirm the Level 2/3 prerequisites with a clean C++20 build before beginning the sequence. For one small operation, write the invariant, count the dominant work, state the expected growth class, and connect a failed test or diagnostic to the exact correction."
	},
	"DSCPP1 Interfaces, Records, and a Task Manager CLI": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"record invariant",
			"sequence storage",
			"search / erase",
			"stable output",
			"missing description"
		],
		flowNote:
			"Use the task manager as a short readiness bridge rather than a large application. Prove empty, one-record, duplicate, missing-description, filtered and removed behavior. Complete the two sorting tasks while preserving insertion-order first matches, then explain vector search, erasure and copied-view sorting costs before moving to graphs."
	},
	"DSCPP2 Graphs and Shortest Paths": {
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"graph representation",
			"nonnegative weights",
			"relaxation",
			"priority queue",
			"path reconstruction"
		],
		flowNote:
			"Define node, edge, sentinel, and weight rules before parsing the fixture. The core task replaces matrix minimum selection with a priority queue; adjacency lists are an optional representation change. Reject negative weights other than the absent sentinel, ignore stale queue entries, preserve valid state on a rejected reload, and test large costs, start-equals-goal, disconnected, competing-route, and path-reconstruction cases."
	},
	"DSCPP3 STL Containers and State-Based Text Generation": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"container contract",
			"token normalization",
			"state window",
			"fixed seed",
			"empty corpus"
		],
		flowNote:
			"Use original or public-domain sample text and keep the generator local. Build tokenization and state transitions separately, use a fixed seed for regression tests, and verify empty input, one-token input, unseen state, repeated state, requested length, and deterministic replay."
	},
	"DSCPP4 Recursion and Backtracking in 3D Mazes": {
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"recursive contract",
			"base case",
			"visited state",
			"path rollback",
			"atomic import"
		],
		flowNote:
			"Validate all 125 cells before replacing the active maze, then trace one successful and one failed branch by hand. Test six legal directions, boundaries, cycles, blocked entrance or exit, no-path, and successful path preservation while failed imports leave the prior maze unchanged."
	},
	"DSCPP5 Quicksort and Partitioning": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"partition invariant",
			"pivot policy",
			"recursive bounds",
			"worst case",
			"comparison fixture"
		],
		flowNote:
			"Write the partition invariant and recursive interval convention before coding. Verify empty, one-item, duplicate-heavy, sorted, reverse-sorted, and random fixed-seed inputs, then compare correctness and operation counts with `std::sort` without treating one timing run as proof."
	},
	"DSCPP6 Templates and Linked Structures": {
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"node ownership",
			"head / tail invariant",
			"pointer update",
			"copy / move policy",
			"sanitizer evidence"
		],
		flowNote:
			"Choose and document one ownership model before linking nodes. Test empty, front, middle, back, missing, repeated clear, copy/move policy, and destruction behavior; every mutation must preserve the head/tail/size invariant and pass the available memory diagnostic. The supplied node-owning collections are noncopyable and nonmovable. Pass an existing collection by reference; implementing deep copy or move is outside these algorithm exercises."
	},
	"DSCPP7 Binary Search Trees": {
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"ordering invariant",
			"recursive search",
			"duplicate policy",
			"three removal cases",
			"destruction"
		],
		flowNote:
			"Check the ordering invariant after every mutation rather than judging only printed output. Cover empty and missing cases, duplicate policy, leaf removal, one-child removal, two-child removal with the selected predecessor convention, repeated clear, and clean destruction. The supplied node-owning collections are noncopyable and nonmovable. Pass an existing collection by reference; implementing deep copy or move is outside these algorithm exercises."
	},
	"DSCPP8 AVL Trees and Rebalancing": {
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"height invariant",
			"balance factor",
			"four rotations",
			"rebalanced removal",
			"ordered workload"
		],
		flowNote:
			"Derive each rotation from a tiny tree and verify both BST order and stored heights afterward. Exercise all four insertion rotations, duplicates, missing removals, removal-triggered rebalancing, and ordered insert/remove sequences while checking every balance factor. The supplied node-owning collections are noncopyable and nonmovable. Pass an existing collection by reference; implementing deep copy or move is outside these algorithm exercises."
	},
	"DSCPP9 Benchmarking and Data-Structure Tradeoffs": {
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"correctness gate",
			"release build",
			"fixed workload",
			"repeated samples",
			"bounded conclusion"
		],
		flowNote:
			"Pass identical correctness fixtures before collecting performance data. Record compiler and build mode, fixed seeds, workload sizes, warm-up policy, repeated raw samples, and median results for random and ordered workloads, then limit conclusions to the measured implementations and environment. The supplied node-owning collections are noncopyable and nonmovable. Pass an existing collection by reference; implementing deep copy or move is outside these algorithm exercises."
	}
};

function dataStructuresCppSupplementalPath(title: string) {
	return /extension|challenge/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

const DATA_STRUCTURES_CPP_CURRENT_OWNERSHIP_PACKS: Record<
	string,
	{ key: string; anchor: string }
> = {
	"DSCPP6 Templates and Linked Structures": {
		key: "dscpp6-node-ownership",
		anchor: "dscpp6-templates-and-linked-structures"
	},
	"DSCPP7 Binary Search Trees": {
		key: "dscpp7-node-ownership",
		anchor: "dscpp7-binary-search-trees"
	},
	"DSCPP8 AVL Trees and Rebalancing": {
		key: "dscpp8-node-ownership",
		anchor: "dscpp8-avl-trees-and-rebalancing"
	}
};

function decorateDataStructuresCppModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = DATA_STRUCTURES_CPP_MODULE_FLOW[module.title];
	const curriculum = module.curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? item.content.startsWith("**Concept focus:**")
					? item.content.replace(
							"\n\n",
							`\n\n**Course flow:** ${flow.flowNote}\n\n`
						)
					: `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content,
		learningPath: "core" as const
	}));
	if (module.title === "DSCPP1 Interfaces, Records, and a Task Manager CLI") {
		const project = curriculum.find(
			item => item.title === `${module.title}: Core Project`
		)!;
		const courseId = "data-structures-and-algorithms-in-cpp";
		const lesson = `${courseId}-dscpp1-interfaces-records-and-a-task-manager-cli`;
		const params = new URLSearchParams({
			course: courseId,
			mode: "cpp",
			projectKey: `${courseId}:dscpp1-task-record:current-pack-v1`,
			starterUrl: project.projectLink!,
			starterTitle:
				"Core Project: Interfaces, Records, and a Task Manager CLI",
			starterLabel: "Learner starter",
			lesson
		});
		project.content += `\n\n## Keep existing work and compare current source\n\nThe normal Start in IDE action continues your saved project. Save and export an earlier attempt before comparing the current record starter. [Open current starter separately](/ide?${params}) asks before importing and keeps the earlier project available.`;
		const continuation = new URLSearchParams({
			course: courseId,
			mode: "cpp",
			projectKey: `${courseId}:data-structures-and-algorithms-in-cpp-dscpp1-interfaces-records-and-a-task-manager-cli-curriculum-core-project-interfaces-records-and-a-task-manager-cli:starter`,
			starterUrl: project.projectLink!,
			starterTitle:
				"Core Project: Interfaces, Records, and a Task Manager CLI",
			starterLabel: "Learner starter",
			lesson
		});
		for (const worksheet of module.supplementalProjects)
			worksheet.content += `\n\n[Continue saved task-manager project](/ide?${continuation}). This worksheet adds practice to the same required record project.`;
	}

	const statePractice = {
		"DSCPP3 STL Containers and State-Based Text Generation": {
			key: "dscpp3-markov-contract",
			anchor: "dscpp3-stl-containers-and-state-based-text-generation",
			label: "text-generator"
		},
		"DSCPP4 Recursion and Backtracking in 3D Mazes": {
			key: "dscpp4-maze-contract",
			anchor: "dscpp4-recursion-and-backtracking-in-3d-mazes",
			label: "maze"
		},
		"DSCPP5 Quicksort and Partitioning": {
			key: "dscpp5-quicksort-contract",
			anchor: "dscpp5-quicksort-and-partitioning",
			label: "quicksort"
		}
	}[module.title];
	if (statePractice) {
		const project = curriculum.find(
			item => item.title === `${module.title}: Core Project`
		)!;
		const courseId = "data-structures-and-algorithms-in-cpp";
		const starterTitle = `Core Project: ${module.title.replace(/^DSCPP\d+ /, "")}`;
		const lesson = `${courseId}-${statePractice.anchor}`;
		const params = new URLSearchParams({
			course: courseId,
			mode: "cpp",
			projectKey: `${courseId}:${statePractice.key}:current-pack-v1`,
			starterUrl: project.projectLink!,
			starterTitle,
			starterLabel: "Learner starter",
			lesson
		});
		project.content += `\n\n## Keep existing work and compare current source\n\nThe normal Start in IDE action continues the saved core project. Save and export an earlier attempt before comparing source. [Open current starter separately](/ide?${params}) asks before importing and keeps that earlier project available.`;
		const resource = `${lesson}-curriculum-core-project-${statePractice.anchor.replace(/^dscpp\d+-/, "")}`;
		const continuation = new URLSearchParams({
			course: courseId,
			mode: "cpp",
			projectKey: `${courseId}:${resource}:starter`,
			starterUrl: project.projectLink!,
			starterTitle,
			starterLabel: "Learner starter",
			lesson
		});
		for (const worksheet of module.supplementalProjects)
			worksheet.content += `\n\n[Continue saved ${statePractice.label} project](/ide?${continuation}). This worksheet continues the same required project.`;
	}

	const currentOwnershipPack =
		DATA_STRUCTURES_CPP_CURRENT_OWNERSHIP_PACKS[module.title];
	if (currentOwnershipPack) {
		const project = curriculum.find(
			item => item.title === `${module.title}: Core Project`
		)!;
		project.ideImport = true;
		const courseId = "data-structures-and-algorithms-in-cpp";
		const params = new URLSearchParams({
			course: courseId,
			mode: "cpp",
			projectKey: `${courseId}:${currentOwnershipPack.key}:current-pack-v1`,
			starterUrl: project.projectLink!,
			starterTitle: `Core Project: ${module.title.replace(/^DSCPP\d+ /, "")}`,
			starterLabel: "Learner starter",
			lesson: `${courseId}-${currentOwnershipPack.anchor}`
		});
		project.content +=
			"\n\n## Keep existing work and compare current source\n\n" +
			"The normal Start in IDE action continues the usual saved project. " +
			"Save and export an earlier attempt before comparing it with the corrected ownership starter. " +
			`[Open current starter separately](/ide?${params}) asks before importing and preserves the earlier project. ` +
			"Extract the exported ZIP and use the native C++20 compiler to build and run it.";
	}

	if (module.title === "DSCPP0 Setup and Positioning") {
		curriculum.push({
			title: "DSCPP0 Project 0: Complexity and Toolchain Readiness",
			content: dsaSetupLessons.completion,
			ideImport: false,
			learningPath: "core"
		});
	}

	if (module.title === "DSCPP9 Benchmarking and Data-Structure Tradeoffs") {
		const project = curriculum.find(
			item => item.title === `${module.title}: Core Project`
		)!;
		project.ideImport = true;
		curriculum.push({
			title: "DSCPP9 Capstone Completion Contract",
			content: [
				"**Completion evidence:**",
				"- Correctness suite shared across every compared container or custom structure.",
				"- Recorded compiler, optimization mode, machine context, fixed seeds, workload generators, and warm-up policy.",
				"- Repeated raw samples plus median results for random and ordered insert, lookup, and removal workloads at multiple sizes.",
				"- A graph or table, one result that matches the asymptotic prediction, one surprising result, and a bounded conclusion that does not claim a universal winner."
			].join("\n"),
			learningPath: "core"
		});
	}

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: dataStructuresCppSupplementalPath(item.title)
		}))
	};
}

function buildOptionalAlgorithmStudioArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Algorithm Studios and Transfer Archive",
		estimatedTime: "Choose individual studios as needed",
		keyBlocks: [
			"sequence invariant",
			"graph route",
			"recursive search",
			"linked / tree invariant",
			"benchmark transfer"
		],
		curriculum: [
			{
				title: "Algorithm Studio Archive Guide",
				content:
					"**Course flow:** Labs 11–17 are optional transfer and extension studios for concepts already established in DSCPP1–9. Select a studio when its matching invariant, trace, or benchmark needs more evidence; completing every archived studio is not part of the required course path.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: dataStructuresCppSupplementalPath(item.title)
				})
			)
		)
	};
}

const dataStructuresCppPrimaryModules =
	dataStructuresAndAlgorithmsInCppSourceCourse.modules
		.slice(0, DATA_STRUCTURES_CPP_PRIMARY_MODULE_COUNT)
		.map(decorateDataStructuresCppModule);
const dataStructuresCppArchiveModules =
	dataStructuresAndAlgorithmsInCppSourceCourse.modules.slice(
		DATA_STRUCTURES_CPP_PRIMARY_MODULE_COUNT
	);

export const dataStructuresAndAlgorithmsInCppCourse: RawCourse = {
	...dataStructuresAndAlgorithmsInCppSourceCourse,
	modules: [
		...dataStructuresCppPrimaryModules,
		buildOptionalAlgorithmStudioArchive(dataStructuresCppArchiveModules)
	]
};
