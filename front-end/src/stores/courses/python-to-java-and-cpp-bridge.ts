import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const pythonToJavaAndCppBridgeCourse: RawCourse = {
	name: "Python to Java and C++ Bridge",
	modules: [
		{
			title: "PTJ0 Positioning and Workflow Translation",
			curriculum: [
				{
					title: "Why Typed Languages Feel Harder at First",
					content:
						"Frame the bridge as a translation problem, not a full restart. The assumed background is variables, loops, functions, and objects from Python; the new challenge is stronger type declarations, compilation, braces, semicolons, and more explicit project structure."
				},
				{
					title: "Compiled vs. Interpreted Workflows",
					content:
						"Compare Python's quick script loop with Java and C++ compile-run cycles. Compiler errors are structured feedback rather than evidence that the language is hostile."
				},
				{
					title: "Blocks, Braces, and Signatures",
					content:
						"Translate indentation-based thinking into braces and method signatures. Typed syntax adds ceremony, but the underlying control flow is still the same."
				},
				{
					title: "What Transfers Cleanly from Python",
					content:
						"Make the transfer explicit: loops, conditionals, string processing, decomposition into helper functions, and object modeling still matter. The bridge preserves confidence by showing where the existing mental model still applies."
				},
				{
					title: "PTJ0 Positioning and Workflow Translation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ0 Positioning and Workflow Translation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Syntax Translation Warmup",
					content:
						"Port several tiny Python snippets into typed Java and C++ starter files to compare variables, conditionals, loops, and return statements side by side.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/solution"
				},
				{
					title: "Project: Starter Source Review",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ0 Positioning and Workflow Translation",
						itemTitle: "Project: Starter Source Review",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/solution"
				},
				{
					title: "Workflow Translation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ0 Positioning and Workflow Translation",
						itemTitle: "Workflow Translation Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-01-ptj0-positioning-and-workflow-translation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-01-ptj0-positioning-and-workflow-translation-supplemental-3/solution"
				}
			]
		},
		{
			title: "PTJ1 Functions, Parameters, and Return Types",
			curriculum: [
				{
					title: "From def to Method Signatures",
					content:
						"Map Python's `def` syntax to Java methods and C++ functions. Read the parameter types and return type before reading the body."
				},
				{
					title: "Void, Value Returns, and Compile-Time Mismatches",
					content:
						"Practice spotting the common mistakes that typed languages catch immediately: returning the wrong type, forgetting a return statement, or passing the wrong argument type."
				},
				{
					title: "Reading Compiler Feedback Productively",
					content:
						"Work through small broken examples where a missing semicolon, bad type, or mismatched brace causes several errors. The skill is to find the first real error and ignore the noise that cascades after it."
				},
				{
					title: "Functions, Parameters, and Return Types: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Functions, Parameters, and Return Types",
						section: "verification"
					})
				},
				{
					title: "PTJ1 Functions, Parameters, and Return Types: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ1 Functions, Parameters, and Return Types",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Function Port Pack",
					content:
						"Translate a Python helper-function worksheet into Java and C++, preserving the same behavior while adding explicit parameter and return types.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/solution"
				},
				{
					title: "Function Signature Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ1 Functions, Parameters, and Return Types",
						itemTitle: "Function Signature Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-02-ptj1-functions-parameters-and-return-types-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-02-ptj1-functions-parameters-and-return-types-supplemental-2/solution"
				},
				{
					title: "Return-Type Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ1 Functions, Parameters, and Return Types",
						itemTitle: "Return-Type Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-03-ptj1-functions-parameters-and-return-types-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-03-ptj1-functions-parameters-and-return-types-supplemental-3/solution"
				}
			]
		},
		{
			title: "PTJ2 Collections, Strings, and Indexing",
			curriculum: [
				{
					title: "Lists vs. Arrays, ArrayLists, and Vectors",
					content:
						"Compare Python lists with Java arrays and `ArrayList`, then with C++ arrays and `vector`. Explain which structure is fixed-size, which grows dynamically, and how indexing and methods differ."
				},
				{
					title: "String APIs and Slice Replacement",
					content:
						"Translate Python slicing habits into Java and C++ string methods. The bridge slows the workflow just enough to make substring ranges, mutation rules, and off-by-one boundaries deliberate."
				},
				{
					title: "Bounds and Loop Discipline",
					content:
						"Use list and string loops to reinforce boundary conditions in typed languages. This is where Python habits can translate into stronger debugging: predict the valid index range, trace the loop endpoint, then compare that prediction with compiler or runtime feedback."
				},
				{
					title: "Collections, Strings, and Indexing: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Collections, Strings, and Indexing",
						section: "verification"
					})
				},
				{
					title: "PTJ2 Collections, Strings, and Indexing: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ2 Collections, Strings, and Indexing",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Text and Collection Port Lab",
					content:
						"Port a Python list-and-string processing exercise into Java and C++ and compare how the same algorithm changes once indexing, arrays, and string APIs become more explicit.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/solution"
				},
				{
					title: "Collection Indexing Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ2 Collections, Strings, and Indexing",
						itemTitle: "Collection Indexing Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-04-ptj2-collections-strings-and-indexing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-04-ptj2-collections-strings-and-indexing-supplemental-2/solution"
				},
				{
					title: "Text API Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ2 Collections, Strings, and Indexing",
						itemTitle: "Text API Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-05-ptj2-collections-strings-and-indexing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-05-ptj2-collections-strings-and-indexing-supplemental-3/solution"
				}
			]
		},
		{
			title: "PTJ3 Classes and Objects across Languages",
			curriculum: [
				{
					title: "What Stays the Same in OOP",
					content:
						"Re-anchor classes in familiar Python ideas: objects still carry state, constructors still initialize that state, and methods still bundle behavior with data. The new work is mostly syntax and file organization."
				},
				{
					title: "Java Class Structure",
					content:
						"Fields, constructors, getters, setters, and access modifiers define the Java object model. Visible pattern: why Java looks more ceremonial while still describing a familiar object model."
				},
				{
					title: "C++ Class Structure and Header/Source Separation",
					content:
						"C++ class declarations often live in header files while method definitions live in source files. The split exists for organization and compilation reasons, not because the class model itself is conceptually different from Python."
				},
				{
					title: "Classes and Objects across Languages: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Classes and Objects across Languages",
						section: "verification"
					})
				},
				{
					title: "PTJ3 Classes and Objects across Languages: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ3 Classes and Objects across Languages",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Shared Class Port",
					content:
						"Rewrite a small Python class such as `Pet`, `BankAccount`, or `Character` as both a Java class and a C++ header/source pair.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/solution"
				},
				{
					title: "Class Port Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ3 Classes and Objects across Languages",
						itemTitle: "Class Port Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-06-ptj3-classes-and-objects-across-languages-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-06-ptj3-classes-and-objects-across-languages-supplemental-2/solution"
				},
				{
					title: "Header Source Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"PTJ3 Classes and Objects across Languages",
						itemTitle: "Header Source Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-07-ptj3-classes-and-objects-across-languages-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-07-ptj3-classes-and-objects-across-languages-supplemental-3/solution"
				}
			]
		},
		{
			title: "PTJ4 Java-Specific Adaptation",
			curriculum: [
				{
					title: "Scanner, main, and Java Project Rhythm",
					content:
						"Practice `Scanner`, `public static void main`, and the file structure expected by early Java projects. This makes the first weeks of `Java Level 1` feel familiar instead of abrupt."
				},
				{
					title: "String Equality and Reference Habits",
					content:
						'Java string comparison separates value equality from reference identity. In Python, `==` usually compares string contents, so Java requires a deliberate adjustment: `.equals()` expresses content equality while `==` asks whether two variables point to the same object. The bridge example needs at least one literal string, one string built from input or concatenation, and one `null` check so the difference is visible instead of memorized. Good Java habits place the known non-null value first when useful, such as `"yes".equals(answer)`, and reserve `==` for primitives, enum constants, or intentional identity checks.'
				},
				{
					title: "Bridge Exit to Java Level 1",
					content:
						"By the end of the Java branch, the target outcome is readiness to write simple typed methods, use `Scanner`, and build a small class without getting stuck on boilerplate."
				},
				{
					title: "Java Specific Adaptation: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Java Specific Adaptation",
						section: "verification"
					})
				},
				{
					title: "PTJ4 Java-Specific Adaptation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ4 Java-Specific Adaptation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Python to Java Quiz Game",
					content:
						"Port a small Python quiz or Mad Libs program into Java and use it as the last pre-Java-Level-1 confidence check.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/solution"
				},
				{
					title: "Java Scanner Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ4 Java-Specific Adaptation",
						itemTitle: "Java Scanner Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-08-ptj4-java-specific-adaptation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-08-ptj4-java-specific-adaptation-supplemental-2/solution"
				},
				{
					title: "Java Quiz Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ4 Java-Specific Adaptation",
						itemTitle: "Java Quiz Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-09-ptj4-java-specific-adaptation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-09-ptj4-java-specific-adaptation-supplemental-3/solution"
				}
			]
		},
		{
			title: "PTJ5 C++-Specific Adaptation",
			curriculum: [
				{
					title: "Includes, std, and Console Streams",
					content:
						"Practice `#include`, `std::`, `cout`, and `cin` until the syntax stops feeling special. The first C++ goal is comfort with typed syntax and compilation, not early pointer complexity."
				},
				{
					title: "Vectors, References, and Pass-by-Value Intuition",
					content:
						"`vector` and the difference between passing by value and by reference prepare for C++ collections without jumping ahead to the full pointer-heavy part of the C++ path."
				},
				{
					title: "Bridge Exit to C++ Level 1",
					content:
						"By the end of the C++ branch, the target outcome is readiness to work with console I/O, typed functions, vectors, and small classes, with pointers still deferred to the normal C++ course sequence."
				},
				{
					title: "C++ Specific Adaptation: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C++ Specific Adaptation",
						section: "verification"
					})
				},
				{
					title: "PTJ5 C++-Specific Adaptation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ5 C++-Specific Adaptation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Python to C++ Console Port",
					content:
						"Convert a small Python console game into C++ and use it as the last transition exercise before entering the main `C++ Level 1` path.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/solution"
				},
				{
					title: "C++ Console Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ5 C++-Specific Adaptation",
						itemTitle: "C++ Console Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-10-ptj5-cpp-specific-adaptation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-10-ptj5-cpp-specific-adaptation-supplemental-2/solution"
				},
				{
					title: "C++ Vector Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "PTJ5 C++-Specific Adaptation",
						itemTitle: "C++ Vector Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-11-ptj5-cpp-specific-adaptation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-11-ptj5-cpp-specific-adaptation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Language Bridge Lab 11: Compile-Run Comparison Studio",
			curriculum: [
				{
					title: "Language Bridge Lab 11: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 11: Compile-Run Comparison Studio",
						section: "concepts"
					})
				},
				{
					title: "Language Bridge Lab 11: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 11: Compile-Run Comparison Studio",
						section: "example"
					})
				},
				{
					title: "Language Bridge Lab 11: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 11: Compile-Run Comparison Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-01-language-bridge-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-01-language-bridge-lab-11/solution"
				},
				{
					title: "Language Bridge Lab 11: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 11: Compile-Run Comparison Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Language Bridge Lab 11: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 11: Compile-Run Comparison Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-01-language-bridge-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-01-language-bridge-lab-11/solution"
				},
				{
					title: "Compile-Run Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 11: Compile-Run Comparison Studio",
						itemTitle: "Compile-Run Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-12-applied-studio-7-language-bridge-lab-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-12-applied-studio-7-language-bridge-lab-11-supplemental-2/solution"
				},
				{
					title: "Compile-Run Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 11: Compile-Run Comparison Studio",
						itemTitle: "Compile-Run Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-13-applied-studio-7-language-bridge-lab-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-13-applied-studio-7-language-bridge-lab-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "Language Bridge Lab 12: Type Signature Translation Studio",
			curriculum: [
				{
					title: "Language Bridge Lab 12: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 12: Type Signature Translation Studio",
						section: "concepts"
					})
				},
				{
					title: "Language Bridge Lab 12: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 12: Type Signature Translation Studio",
						section: "example"
					})
				},
				{
					title: "Language Bridge Lab 12: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 12: Type Signature Translation Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-02-language-bridge-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-02-language-bridge-lab-12/solution"
				},
				{
					title: "Language Bridge Lab 12: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 12: Type Signature Translation Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Language Bridge Lab 12: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 12: Type Signature Translation Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-02-language-bridge-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-02-language-bridge-lab-12/solution"
				},
				{
					title: "Type Signature Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 12: Type Signature Translation Studio",
						itemTitle: "Type Signature Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-14-applied-studio-8-language-bridge-lab-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-14-applied-studio-8-language-bridge-lab-12-supplemental-2/solution"
				},
				{
					title: "Type Signature Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 12: Type Signature Translation Studio",
						itemTitle: "Type Signature Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-15-applied-studio-8-language-bridge-lab-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-15-applied-studio-8-language-bridge-lab-12-supplemental-3/solution"
				}
			]
		},
		{
			title: "Language Bridge Lab 13: Collection Porting Studio",
			curriculum: [
				{
					title: "Language Bridge Lab 13: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 13: Collection Porting Studio",
						section: "concepts"
					})
				},
				{
					title: "Language Bridge Lab 13: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 13: Collection Porting Studio",
						section: "example"
					})
				},
				{
					title: "Language Bridge Lab 13: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 13: Collection Porting Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-03-language-bridge-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-03-language-bridge-lab-13/solution"
				},
				{
					title: "Language Bridge Lab 13: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 13: Collection Porting Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Language Bridge Lab 13: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 13: Collection Porting Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-03-language-bridge-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-03-language-bridge-lab-13/solution"
				},
				{
					title: "Collection Porting Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 13: Collection Porting Studio",
						itemTitle: "Collection Porting Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-16-applied-studio-9-language-bridge-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-16-applied-studio-9-language-bridge-lab-13-supplemental-2/solution"
				},
				{
					title: "Collection Porting Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 13: Collection Porting Studio",
						itemTitle: "Collection Porting Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-17-applied-studio-9-language-bridge-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-17-applied-studio-9-language-bridge-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "Language Bridge Lab 14: Class Model Translation Studio",
			curriculum: [
				{
					title: "Language Bridge Lab 14: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 14: Class Model Translation Studio",
						section: "concepts"
					})
				},
				{
					title: "Language Bridge Lab 14: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 14: Class Model Translation Studio",
						section: "example"
					})
				},
				{
					title: "Language Bridge Lab 14: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 14: Class Model Translation Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-04-language-bridge-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-04-language-bridge-lab-14/solution"
				},
				{
					title: "Language Bridge Lab 14: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 14: Class Model Translation Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Language Bridge Lab 14: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 14: Class Model Translation Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-04-language-bridge-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-04-language-bridge-lab-14/solution"
				},
				{
					title: "Class Model Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 14: Class Model Translation Studio",
						itemTitle: "Class Model Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-18-applied-studio-10-language-bridge-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-18-applied-studio-10-language-bridge-lab-14-supplemental-2/solution"
				},
				{
					title: "Class Model Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 14: Class Model Translation Studio",
						itemTitle: "Class Model Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-19-applied-studio-10-language-bridge-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-19-applied-studio-10-language-bridge-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Language Bridge Lab 15: Java Console Adaptation Studio",
			curriculum: [
				{
					title: "Language Bridge Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 15: Java Console Adaptation Studio",
						section: "concepts"
					})
				},
				{
					title: "Language Bridge Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 15: Java Console Adaptation Studio",
						section: "example"
					})
				},
				{
					title: "Language Bridge Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 15: Java Console Adaptation Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-05-language-bridge-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-05-language-bridge-lab-15/solution"
				},
				{
					title: "Language Bridge Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 15: Java Console Adaptation Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Language Bridge Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 15: Java Console Adaptation Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-05-language-bridge-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-05-language-bridge-lab-15/solution"
				},
				{
					title: "Java Console Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 15: Java Console Adaptation Studio",
						itemTitle: "Java Console Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-20-applied-studio-11-language-bridge-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-20-applied-studio-11-language-bridge-lab-15-supplemental-2/solution"
				},
				{
					title: "Java Console Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 15: Java Console Adaptation Studio",
						itemTitle: "Java Console Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-21-applied-studio-11-language-bridge-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-21-applied-studio-11-language-bridge-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Language Bridge Lab 16: C++ Console Adaptation Studio",
			curriculum: [
				{
					title: "Language Bridge Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 16: C++ Console Adaptation Studio",
						section: "concepts"
					})
				},
				{
					title: "Language Bridge Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 16: C++ Console Adaptation Studio",
						section: "example"
					})
				},
				{
					title: "Language Bridge Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 16: C++ Console Adaptation Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-06-language-bridge-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-06-language-bridge-lab-16/solution"
				},
				{
					title: "Language Bridge Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 16: C++ Console Adaptation Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Language Bridge Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 16: C++ Console Adaptation Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-06-language-bridge-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-06-language-bridge-lab-16/solution"
				},
				{
					title: "C++ Console Adaptation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 16: C++ Console Adaptation Studio",
						itemTitle: "C++ Console Adaptation Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-22-applied-studio-12-language-bridge-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-22-applied-studio-12-language-bridge-lab-16-supplemental-2/solution"
				},
				{
					title: "C++ Console Adaptation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 16: C++ Console Adaptation Studio",
						itemTitle: "C++ Console Adaptation Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-23-applied-studio-12-language-bridge-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-23-applied-studio-12-language-bridge-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Language Bridge Lab 17: Bridge Capstone Port Studio",
			curriculum: [
				{
					title: "Language Bridge Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 17: Bridge Capstone Port Studio",
						section: "concepts"
					})
				},
				{
					title: "Language Bridge Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 17: Bridge Capstone Port Studio",
						section: "example"
					})
				},
				{
					title: "Language Bridge Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 17: Bridge Capstone Port Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-07-language-bridge-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-07-language-bridge-lab-17/solution"
				},
				{
					title: "Language Bridge Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 17: Bridge Capstone Port Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Language Bridge Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle:
							"Language Bridge Lab 17: Bridge Capstone Port Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-07-language-bridge-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-07-language-bridge-lab-17/solution"
				},
				{
					title: "Bridge Capstone Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 17: Bridge Capstone Port Studio",
						itemTitle: "Bridge Capstone Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-24-applied-studio-13-language-bridge-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-24-applied-studio-13-language-bridge-lab-17-supplemental-2/solution"
				},
				{
					title: "Bridge Capstone Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle:
							"Language Bridge Lab 17: Bridge Capstone Port Studio",
						itemTitle: "Bridge Capstone Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-25-applied-studio-13-language-bridge-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-25-applied-studio-13-language-bridge-lab-17-supplemental-3/solution"
				}
			]
		},
		{
			title: "Graphics Translation Studio",
			curriculum: [
				{
					title: "Graphics Translation Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Graphics Translation Studio",
						section: "concepts"
					})
				},
				{
					title: "Graphics Translation Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Graphics Translation Studio",
						section: "example"
					})
				},
				{
					title: "Graphics Translation Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Graphics Translation Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/graphics"
				},
				{
					title: "Graphics Translation Studio: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Graphics Translation Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Graphics Translation Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Graphics Translation Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/graphics"
				},
				{
					title: "Graphics Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "Graphics Translation Studio",
						itemTitle: "Graphics Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-26-applied-studio-14-graphics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-26-applied-studio-14-graphics-supplemental-2/solution"
				},
				{
					title: "Graphics Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "Graphics Translation Studio",
						itemTitle: "Graphics Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-27-applied-studio-14-graphics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-27-applied-studio-14-graphics-supplemental-3/solution"
				}
			]
		},
		{
			title: "C++ Console Practice Studio",
			curriculum: [
				{
					title: "C++ Console Practice Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C++ Console Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "C++ Console Practice Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C++ Console Practice Studio",
						section: "example"
					})
				},
				{
					title: "C++ Console Practice Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C++ Console Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/solution"
				},
				{
					title: "C++ Console Practice Studio: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C++ Console Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C++ Console Practice Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C++ Console Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/solution"
				},
				{
					title: "C++ Console Practice Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "C++ Console Practice Studio",
						itemTitle: "C++ Console Practice Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-28-applied-studio-15-cpp-practice-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-28-applied-studio-15-cpp-practice-supplemental-2/solution"
				},
				{
					title: "C++ Console Practice Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "C++ Console Practice Studio",
						itemTitle: "C++ Console Practice Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-29-applied-studio-15-cpp-practice-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-29-applied-studio-15-cpp-practice-supplemental-3/solution"
				}
			]
		},
		{
			title: "Java Foundations Transfer Studio",
			curriculum: [
				{
					title: "Java Foundations Transfer Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Java Foundations Transfer Studio",
						section: "concepts"
					})
				},
				{
					title: "Java Foundations Transfer Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Java Foundations Transfer Studio",
						section: "example"
					})
				},
				{
					title: "Java Foundations Transfer Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Java Foundations Transfer Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-java-foundations-build-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-java-foundations-build-12/solution"
				},
				{
					title: "Java Foundations Transfer Studio: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Java Foundations Transfer Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Java Foundations Transfer Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "Java Foundations Transfer Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-java-foundations-build-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-java-foundations-build-12/solution"
				},
				{
					title: "Java Foundations Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "Java Foundations Transfer Studio",
						itemTitle: "Java Foundations Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-30-applied-studio-16-j1x01-java-foundations-build-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-30-applied-studio-16-j1x01-java-foundations-build-12-supplemental-2/solution"
				},
				{
					title: "Java Foundations Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "Java Foundations Transfer Studio",
						itemTitle: "Java Foundations Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-31-applied-studio-16-j1x01-java-foundations-build-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-31-applied-studio-16-j1x01-java-foundations-build-12-supplemental-3/solution"
				}
			]
		},
		{
			title: "C Foundations Transfer Studio",
			curriculum: [
				{
					title: "C Foundations Transfer Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C Foundations Transfer Studio",
						section: "concepts"
					})
				},
				{
					title: "C Foundations Transfer Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C Foundations Transfer Studio",
						section: "example"
					})
				},
				{
					title: "C Foundations Transfer Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C Foundations Transfer Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CF-01-c-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CF-01-c-foundations-build-13/solution"
				},
				{
					title: "C Foundations Transfer Studio: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C Foundations Transfer Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "C Foundations Transfer Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "language bridge",
						moduleTitle: "C Foundations Transfer Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CF-01-c-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CF-01-c-foundations-build-13/solution"
				},
				{
					title: "C Foundations Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "C Foundations Transfer Studio",
						itemTitle: "C Foundations Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-32-applied-studio-17-c-foundations-build-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-32-applied-studio-17-c-foundations-build-13-supplemental-2/solution"
				},
				{
					title: "C Foundations Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java/C++ bridge",
						moduleTitle: "C Foundations Transfer Studio",
						itemTitle: "C Foundations Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-33-applied-studio-17-c-foundations-build-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRG-33-applied-studio-17-c-foundations-build-13-supplemental-3/solution"
				}
			]
		}
	]
};
