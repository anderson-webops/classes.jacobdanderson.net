import type { RawCourse } from "./types";

const APCS_REPO_BASE = "https://github.com/instruction-material/APCS/tree/main";
const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";
const BARRONS_TEXTBOOK =
	"https://www.amazon.com/Computer-Science-Premium-2024-Comprehensive-dp-1506287913/dp/1506287913/ref=dp_ob_title_bk";
const AP_2022_FRQ =
	"https://apcentral.collegeboard.org/media/pdf/ap22-frq-computer-science-a.pdf";
const AP_2022_FRQ_SCORING =
	"https://apcentral.collegeboard.org/media/pdf/ap22-sg-computer-science-a.pdf";
const AP_FRQ_ARCHIVE =
	"https://apstudents.collegeboard.org/courses/ap-computer-science-a/free-response-questions-by-year";
const APCS_README =
	"https://github.com/instruction-material/APCS/blob/main/README.md";
const APCS_TRACKS_GUIDE = "/course-assets/apcs/apcs-pacing-tracks.md";
const WINDOWS_VSCODE_JAVA_SETUP = `
This checklist supports Java setup on Windows with VS Code:

1. Install a full JDK, not only a Java Runtime. The tested setup uses Eclipse Temurin JDK 21:

\`\`\`powershell
winget install --id EclipseAdoptium.Temurin.21.JDK -e --accept-package-agreements --accept-source-agreements
\`\`\`

2. Close and reopen PowerShell and VS Code after installation so Windows refreshes \`PATH\` and \`JAVA_HOME\`.

3. Install the VS Code Java Extension Pack:

\`\`\`powershell
code --install-extension vscjava.vscode-java-pack
\`\`\`

4. Verify the toolchain from a new PowerShell window:

\`\`\`powershell
java -version
javac -version
echo $env:JAVA_HOME
where.exe java
where.exe javac
\`\`\`

The Eclipse Adoptium JDK path should appear before any old Oracle \`javapath\` entry. If Java reports a missing registry key,
missing \`java.dll\`, or missing Java SE Runtime, move the Eclipse Adoptium \`bin\` folder above
\`C:\\ProgramData\\Oracle\\Java\\javapath\` in the system \`Path\`, or remove the old Oracle entry.

5. Open one assignment folder at a time in VS Code, for example:

\`\`\`powershell
code .\\APCS1-Variables-Reference
\`\`\`

Most APCS projects use the default Java package and a \`Main.java\` file, so opening the whole APCS repo can confuse VS Code's
Java runner. For terminal runs, use \`javac Main.java && java Main\` in a single-file assignment, or \`javac *.java && java Main\`
for folders with multiple Java files.

If VS Code still will not run Java, reopen only the assignment folder, re-check \`java -version\` and \`javac -version\`, then run
\`Java: Clean Java Language Server Workspace\` from the VS Code Command Palette.
`.trim();

const repo = (path: string) => `${APCS_REPO_BASE}/${path}`;
const media = (file: string) => `${STATIC_MEDIA_BASE}/${file}`;

function apConcept({
	evidence,
	focus,
	practice
}: {
	evidence: string;
	focus: string;
	practice: string[];
}) {
	return [
		`**Concept path:** ${focus}`,
		`**Practice sequence:**\n${practice.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**Evidence:** ${evidence}`
	].join("\n\n");
}

function apProject({
	apReasoning,
	checks,
	extension,
	goal,
	steps
}: {
	apReasoning: string;
	checks: string[];
	extension?: string;
	goal: string;
	steps: string[];
}) {
	return [
		`**Goal:** ${goal}`,
		`**Build path:**\n${steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**AP CSA Java reasoning:** ${apReasoning}`,
		`**Checks:**\n${checks.map(check => `- ${check}`).join("\n")}`,
		extension ? `**Extension:** ${extension}` : ""
	]
		.filter(Boolean)
		.join("\n\n");
}

export const apComputerScienceACourse: RawCourse = {
	name: "AP Computer Science A",
	modules: [
		{
			title: "General: Course Introduction and Setup",
			curriculum: [
				{
					title: "Course Positioning",
					content:
						"AP Computer Science A is a Java course built around problem solving, object-oriented design, arrays, ArrayLists, inheritance, recursion, and exam-style tracing. It functions as both a real programming class and a specific AP exam prep track."
				},
				{
					title: "Track Guide",
					content: [
						"The APCS track guide is the course pacing readme. It separates the course into Slow/Supported, Medium/Standard, Fast/Quick, Hard/Challenge, and Exam-focused tracks, with concrete module decisions, project-load choices, and advancement rules for each route.",
						"The placement checkpoints in the guide connect route choice to evidence: recent code, Java-specific mistakes, hand tracing, object-state explanations, and AP-style written reasoning.",
						"**Fast-placement rule:** APCS1-4 can serve mostly as diagnostics for an experienced Python or C++ background. Backfill only Java-specific gaps such as `.equals()` versus `==`, integer division, casting, `Scanner`, `Math.random()`, file/class naming, and AP-style tracing.",
						"**Core-route rule:** Do not skip APCS5-8, APCS10-12, or APCS13-16 completely. These modules contain the AP-specific Java object model, inheritance/polymorphism, arrays/ArrayLists, wrapper constraints, recursion, runtime, searching, and sorting.",
						"**Challenge rule:** When APCS work is too easy, keep the AP concept but upgrade the artifact: add validation, multiple classes, test cases, file input, a menu loop, edge-case writeups, or an FRQ-style explanation."
					].join("\n\n"),
					datasetLink: APCS_TRACKS_GUIDE
				},
				{
					title: "Java Toolchain and Workflow",
					content:
						"Standardize on a full JDK, not just a runtime, with fast compile-run cycles in `IntelliJ IDEA`, `VS Code`, or an equivalent editor. The workflow should support short iterations, print debugging, and tracing without environment friction. Java 17 or newer is fine for AP CSA work; the current Windows VS Code setup guide has been tested with Eclipse Temurin JDK 21."
				},
				{
					title: "Windows VS Code Java Setup",
					content: WINDOWS_VSCODE_JAVA_SETUP,
					projectLink: APCS_README
				},
				{
					title: "Required Textbook",
					content:
						"The source material expects the Barron's AP Computer Science A book for chapter-based multiple choice and free-response practice. Keep the textbook aligned with the course sequence instead of treating it as a separate study track.",
					projectLink: BARRONS_TEXTBOOK
				},
				{
					title: "Reference Pack",
					content:
						"The repo-backed reference projects for variables, strings, and casting establish a clean notes-and-sandbox workflow from day one. They separate Java syntax issues from actual concept gaps before the first graded-style projects.",
					projectLink: repo("APCS1-Variables-Reference/starter"),
					solutionLink: repo("APCS1-Variables-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Strings and Printing Reference",
					content:
						"This reference build reinforces output formatting, concatenation, escape characters, and readable console output. The checkpoint is being able to predict the exact printed text, including spaces, quotation marks, and line breaks.",
					projectLink: repo(
						"APCS1-Strings-and-Printing-Reference/starter"
					),
					solutionLink: repo(
						"APCS1-Strings-and-Printing-Reference/solution"
					)
				},
				{
					title: "Casting Reference",
					content:
						"This reference build gives a tighter review of integer division, explicit casts, and loss-of-precision reasoning. It explains when Java truncates automatically, when an explicit cast is required, and what information is lost.",
					projectLink: repo("APCS1-Casting-Reference/starter"),
					solutionLink: repo("APCS1-Casting-Reference/solution")
				},
				{
					title: "2020 Practice Exam",
					content:
						"Keep the repo practice exam available as a later-course benchmark, but introduce it here so the AP end state is visible early.",
					projectLink: repo("APCS-A-2020-Practice-Exam/starter"),
					solutionLink: repo("APCS-A-2020-Practice-Exam/solution")
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"The first check-in works as guided review rather than a formal test. It focuses on what the explanation covers and independent debugging across variables, conditionals, loops, and basic exceptions."
				},
				{
					title: "Learning Target Coverage",
					content:
						"The prompt bank concentrates on variables and printing, conditionals, counted and condition-driven loops, and early exception reasoning. This is the first structured checkpoint before the class sequence becomes more object-oriented."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Run the check-in prompt bank from the APCS repo as the main review source. It collects the variables, conditionals, loops, and exception prompts in one place so the checkpoint stays structured.",
					projectLink: repo("APCS-Check-in-1/starter"),
					solutionLink: repo("APCS-Check-in-1/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: FizzBuzz",
					content:
						"The additional practice project after the check-in gives one more pass through divisibility checks, ordered conditionals, and loop tracing.",
					projectLink: repo(
						"APCS-Check-in-1-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-1-Additional-Practice-Project/solution"
					),
					mediaLink: media("ps4_fizzbuzz.gif")
				},
				{
					title: "Variables Reference",
					content:
						"Return to the variables reference when types, assignment, or `Math.random()` range construction are still hesitant. The useful evidence is a short program that declares values, updates them, and explains the resulting type of each expression.",
					projectLink: repo("APCS1-Variables-Reference/starter"),
					solutionLink: repo("APCS1-Variables-Reference/solution")
				},
				{
					title: "Loops Reference",
					content:
						"The loop reference pack gives a fast review of counted iteration before APCS4. The focus is predicting the first iteration, last iteration, number of iterations, and the variable state after the loop ends.",
					projectLink: repo("APCS4-Loops-Reference/starter"),
					solutionLink: repo("APCS4-Loops-Reference/solution")
				}
			]
		},
		{
			title: "APCS1 Variables and Input/Output",
			curriculum: [
				{
					title: "Variables, Primitive Types, and Strings",
					content:
						"`int`, `double`, `boolean`, and `String` are the basic vocabulary of Java programs. The working target is to declare, initialize, print, and update values without syntax friction."
				},
				{
					title: "Scanners, Formatting, and Casting",
					content:
						"`Scanner`-based input and explicit casting make the stored values and expression results visible enough to reason about precisely."
				},
				{
					title: "Core Project: Mad Libs",
					content:
						"This first APCS1 build combines variables, strings, scanner input, and formatted output without introducing structural overhead. A complete version should use clear prompts, store each input in a named variable, and produce readable output without accidental missing spaces.",
					projectLink: repo("APCS1-Mad-Libs/starter"),
					solutionLink: repo("APCS1-Mad-Libs/solution"),
					mediaLink: media("apcs1-project-1-mad-libs.mp4")
				},
				{
					title: "Barron's Chapter 2 Habit",
					content:
						"Start multiple-choice tracing early. The APCS1 chapter work is mainly about casting, output, and expression evaluation, so answer choices should be justified line by line."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Rounding It Off",
					content:
						"This project drills casting-based rounding without relying on `Math` helpers. The useful checkpoint is explaining why adding `0.5` before an integer cast works for positive values and where that shortcut would need more care.",
					projectLink: repo("APCS1-Rounding-It-Off/starter"),
					solutionLink: repo("APCS1-Rounding-It-Off/solution"),
					mediaLink: media("apcs1-project-2-rounding-it-off.mp4")
				},
				{
					title: "Project: Hospital Survey",
					content:
						"This project gives another structured pass through typed input, variable naming, and console formatting. The check is that numeric and text inputs are read with the correct scanner method and then reported with useful labels.",
					projectLink: repo("APCS1-Hospital-Survey/starter"),
					solutionLink: repo("APCS1-Hospital-Survey/solution"),
					mediaLink: media("apcs1-project-3-hospital-survey.mp4")
				},
				{
					title: "Strings and Printing Reference",
					content:
						"Keep the strings and printing reference nearby for review of escape characters, concatenation, and output layout. It is especially useful when the code is logically correct but the displayed result has spacing or formatting bugs.",
					projectLink: repo(
						"APCS1-Strings-and-Printing-Reference/starter"
					),
					solutionLink: repo(
						"APCS1-Strings-and-Printing-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS2 Operators",
			curriculum: [
				{
					title: "Arithmetic and Update Operators",
					content:
						"Arithmetic expressions, operator precedence, `%`, and update patterns like `+=`, `++`, and `--` are the basic mechanics for manipulating numeric state. Trace each expression before running it so precedence and mutation order are explicit."
				},
				{
					title: "Relational and Logical Operators",
					content:
						"Evaluate compound boolean expressions exactly, including short-circuit behavior and correct `String` equality with `.equals()`. The goal is to justify why an expression is true or false, not just guess from the final output."
				},
				{
					title: "Core Project: Verifying Expressions",
					content:
						"This project develops expression tracing and boolean reasoning. The checkpoint is being able to evaluate each subexpression in order, name the final boolean result, and explain any short-circuit behavior.",
					projectLink: repo("APCS2-Verifying-Expressions/starter"),
					solutionLink: repo("APCS2-Verifying-Expressions/solution")
				},
				{
					title: "Chapter 2 Multiple Choice Focus",
					content:
						"Barron's Chapter 2 work belongs here because integer division, casting, precedence, and boolean logic should be justified without running code."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Quotient and Remainder",
					content:
						"This build reinforces integer division and remainder reasoning before `%` becomes automatic. The explanation should connect quotient, remainder, truncation, and unit meaning rather than only reporting two numbers.",
					projectLink: repo("APCS2-Quotient-and-Remainder/starter"),
					solutionLink: repo("APCS2-Quotient-and-Remainder/solution"),
					mediaLink: media(
						"apcs2-project-1-quotient-and-remainder.mp4"
					)
				},
				{
					title: "Project: Too Chicken to Cross the Road",
					content:
						"The boolean-only version keeps logic encoded cleanly before conditionals are added in APCS3. A strong solution names each boolean expression, tests both true and false paths, and avoids hiding the decision inside vague variable names.",
					projectLink: repo(
						"APCS2-Too-Chicken-To-Cross-The-Road/starter"
					),
					solutionLink: repo(
						"APCS2-Too-Chicken-To-Cross-The-Road/solution"
					),
					mediaLink: media(
						"apcs2-project-3-too-chicken-to-cross-the-road.mp4"
					)
				},
				{
					title: "Project: Two in One",
					content:
						"This one-line boolean exercise develops concise reasoning about relationships between values. The goal is to write one readable compound expression, then justify the expression with at least one matching case and one non-matching case.",
					projectLink: repo("APCS2-Two-In-One/starter"),
					solutionLink: repo("APCS2-Two-In-One/solution"),
					mediaLink: media("apcs2-project-4-two-in-one.mp4")
				}
			]
		},
		{
			title: "APCS3 Conditionals and Packages",
			curriculum: [
				{
					title: "Conditionals, Scope, and Nesting",
					content:
						"`if`, `else if`, and `else` are precise control-flow tools. A correct explanation names which branch runs and why, especially in nested cases."
				},
				{
					title: "Packages, Math, and Randomness",
					content:
						"Package imports, `Math` methods, and `Math.random()` introduce library code while preserving careful tracing of local control flow."
				},
				{
					title: "Core Project: Elevator Warning",
					content:
						"Elevator Warning is the cleanest repo-backed APCS3 project for threshold checks, conditionals, and readable output. The decision structure should make the unsafe condition obvious and should handle boundary values exactly, not just typical inputs.",
					projectLink: repo("APCS3-Elevator-Warning/starter"),
					solutionLink: repo("APCS3-Elevator-Warning/solution"),
					mediaLink: media("apcs3-project-3-elevator-warning.mp4")
				},
				{
					title: "Reference Pack",
					content:
						"Keep the conditionals, math-package, and random-number references available as short focused reviews instead of burying those examples inside larger projects.",
					projectLink: repo("APCS3-Conditionals-Reference/starter"),
					solutionLink: repo("APCS3-Conditionals-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Too Chicken Take Two",
					content:
						"Redo the APCS2 boolean problem with explicit conditionals and nested branches. Compare this version to the boolean-only version by naming which part became easier to read, which part became longer, and how the same truth cases are preserved.",
					projectLink: repo("APCS3-Too-Chicken-Take-Two/starter"),
					solutionLink: repo("APCS3-Too-Chicken-Take-Two/solution"),
					mediaLink: media("apcs3-project-1-too-chicken-take-two.mp4")
				},
				{
					title: "Reference: Math Package",
					content:
						"This reference project supports focused review of `abs`, `pow`, `sqrt`, and round-off behavior. Connect each method call to its argument types, return type, and any casting needed before storing the result.",
					projectLink: repo("APCS3-Math-Package-Reference/starter"),
					solutionLink: repo("APCS3-Math-Package-Reference/solution")
				},
				{
					title: "Reference: Random Numbers",
					content:
						"This reference tightens integer-range generation and helps avoid off-by-one mistakes with `Math.random()`. A strong explanation names the lowest possible value, highest possible value, and why the cast happens after scaling.",
					projectLink: repo("APCS3-Random-Numbers-Reference/starter"),
					solutionLink: repo(
						"APCS3-Random-Numbers-Reference/solution"
					)
				},
				{
					title: "Project: Math Demo",
					content:
						"Use the `APCS3-Math-Fun` project to practice `Math` methods, packages, casting, and readable output. The finished program should demonstrate each calculation with inputs and output that make the method behavior easy to verify.",
					projectLink: repo("APCS3-Math-Fun/starter"),
					solutionLink: repo("APCS3-Math-Fun/solution"),
					mediaLink: media("apcs3-project-2-math-demo.mp4")
				}
			]
		},
		{
			title: "APCS4 Loops and Exceptions",
			curriculum: [
				{
					title: "For Loops, While Loops, and Infinite Loop Risk",
					content:
						"Counted loops and condition-driven loops are separate tools with separate failure modes. The central reasoning question is when a loop terminates and what state changes make that possible."
				},
				{
					title: "Nested Loops and Early Exception Reasoning",
					content:
						"Nested loops create patterns and tables, then connect loop correctness to common runtime errors like bounds issues and arithmetic mistakes."
				},
				{
					title: "Core Project: Translating Loops",
					content:
						"This project translates between `for` and `while` forms while preserving exact behavior. The important check is that initialization, condition, update, and output stay equivalent after the rewrite.",
					projectLink: repo("APCS4-Translating-Loops/starter"),
					solutionLink: repo("APCS4-Translating-Loops/solution"),
					mediaLink: media("apcs4-project-2-translating-loops.mp4")
				},
				{
					title: "Loop Reference Pack",
					content:
						"The loop references support targeted review on tracing, nested iteration, and pattern generation. They practice predicting output before execution and identifying which variable controls each repeated action.",
					projectLink: repo("APCS4-Loops-Reference/starter"),
					solutionLink: repo("APCS4-Loops-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: For Loop Practice",
					content:
						"This project reinforces counted iteration, accumulators, and output-driven tracing. Each loop should have a clear start value, stop condition, update step, and predicted output before the code is treated as finished.",
					projectLink: repo("APCS4-For-Loop-Practice/starter"),
					solutionLink: repo("APCS4-For-Loop-Practice/solution"),
					mediaLink: media("apcs4-project-1-for-loops-practice.mp4")
				},
				{
					title: "Project: While Loop and Nested Loop Practice",
					content:
						"This mixed practice set drills while-loop termination and nested iteration on structured output problems. The key check is explaining which condition eventually becomes false and how many times the inner loop runs.",
					projectLink: repo(
						"APCS4-While-Loop-and-Nested-Loop-Practice/starter"
					),
					solutionLink: repo(
						"APCS4-While-Loop-and-Nested-Loop-Practice/solution"
					),
					mediaLink: media(
						"apcs4-project-3-while-loop-and-nested-loop-practice.mp4"
					)
				},
				{
					title: "Reference: While Loops and Nested Loops",
					content:
						"The reference pack gives one more clean nested-iteration example before arrays arrive. The focus is loop initialization, update placement, and the relationship between row-style output and nested loop structure.",
					projectLink: repo(
						"APCS4-While-Loops-and-Nested-Loops-Reference/starter"
					),
					solutionLink: repo(
						"APCS4-While-Loops-and-Nested-Loops-Reference/solution"
					)
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Check-In #2 reviews class construction, methods, inheritance vocabulary, access control, and `this` before the course moves into the heavier object-oriented sequence."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The check-in concentrates on class definitions, constructors, accessor and mutator methods, static members, inheritance, overriding, and `super`. Treat the answers as evidence of object-model reasoning, not just isolated syntax recall."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"The prompt bank supports the full Check-In #2 review. This checkpoint shows whether classes, methods, and inheritance are ready for the main object-oriented sequence.",
					projectLink: repo("APCS-Check-in-2/starter"),
					solutionLink: repo("APCS-Check-in-2/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Animal Kingdom",
					content:
						"The taxonomy inheritance project after the check-in gives inheritance one more structured build. The important design target is avoiding repeated data by letting each subclass add only the classification level it owns.",
					projectLink: repo(
						"APCS-Check-in-2-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-2-Additional-Practice-Project/solution"
					)
				},
				{
					title: "Class Example",
					content:
						"This short class example reinforces constructor syntax and instance variables. It makes the relationship between a class definition, a constructed object, and the object's stored fields concrete.",
					projectLink: repo("APCS5-Class-Example/starter"),
					solutionLink: repo("APCS5-Class-Example/solution")
				},
				{
					title: "This Reference",
					content:
						"The `this` reference pack clarifies constructor syntax and `this.field`. The checkpoint is distinguishing a parameter name from the instance variable that belongs to the current object.",
					projectLink: repo("APCS6-This-Reference/starter"),
					solutionLink: repo("APCS6-This-Reference/solution")
				}
			]
		},
		{
			title: "APCS5 Classes Part I",
			curriculum: [
				{
					title: "Classes, Fields, and Constructors",
					content:
						"Start the object sequence by focusing on how a class groups state and behavior. The design check is naming what belongs as an instance variable and what belongs in a method."
				},
				{
					title: "Accessors, Mutators, and Method Practice",
					content:
						"Short object builds make getters, setters, parameters, return values, and `this` references concrete. A finished example should show both reading state safely and changing state only through methods that preserve the class contract."
				},
				{
					title: "Core Project: Student Class",
					content:
						"The Student Class build is the main APCS5 implementation checkpoint because it is a clean class-with-state project from the source sequence.",
					projectLink: repo("APCS5-Student-Class/starter"),
					solutionLink: repo("APCS5-Student-Class/solution"),
					mediaLink: media("apcs5-project-2-student-class.mp4")
				},
				{
					title: "Free Response Prep",
					content:
						"Start free-response style writing here so small-class behavior can be explained before inheritance and polymorphism raise the difficulty.",
					projectLink: repo("APCS5-Free-Response-Practice/starter"),
					solutionLink: repo("APCS5-Free-Response-Practice/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Method Practice",
					content:
						"The APCS5 method-practice project gives short parameter and return-value repetitions. Each method should identify its inputs, output, side effects if any, and one call from `main` that proves the method contract is being used correctly.",
					projectLink: repo("APCS5-Practice-with-Methods/starter"),
					solutionLink: repo("APCS5-Practice-with-Methods/solution"),
					mediaLink: media("apcs5-project-1-method-practice.mp4")
				},
				{
					title: "Project: Store Class",
					content:
						"Store Class gives another object model with a small but meaningful state transition. The useful evidence is a before-and-after object state, such as inventory, price, or balance changing through a method rather than direct field access.",
					projectLink: repo("APCS5-Store-Class/starter"),
					solutionLink: repo("APCS5-Store-Class/solution"),
					mediaLink: media("apcs5-project-3-store-class.mp4")
				},
				{
					title: "Supplemental: Spreadsheet Width",
					content:
						"This supplemental build gives precise method specs more implementation practice. The task is useful because it forces careful interpretation of inputs, return values, edge cases, and formatting rules before implementation starts.",
					projectLink: repo("APCS5-Spreadsheet-Width/starter"),
					solutionLink: repo("APCS5-Spreadsheet-Width/solution"),
					mediaLink: media(
						"apcs5-supplemental-project-1-spreadsheet-width.mp4"
					)
				}
			]
		},
		{
			title: "APCS6 Classes Part II",
			curriculum: [
				{
					title: "State Mutation and Reference Semantics",
					content:
						"Continue class work with object references, side effects, and method calls that mutate encapsulated state. The central tracing skill is predicting what changes inside an object after each method call and what remains unchanged."
				},
				{
					title: "Getters, Setters, `this`, and Primitive vs. Reference",
					content:
						"The APCS6 reference packs distinguish field access, parameter shadowing, and the difference between primitive copies and object references."
				},
				{
					title: "Core Project: Vending Machine Class",
					content:
						"The vending-machine project is the main APCS6 build because it exercises constructors, fields, controlled mutation, and method design in one compact model.",
					projectLink: repo("APCS6-Vending-Machine-Class/starter"),
					solutionLink: repo("APCS6-Vending-Machine-Class/solution"),
					mediaLink: media(
						"apcs6-project-1-vending-machine-class.mp4"
					)
				},
				{
					title: "Free Response and Multiple Choice Support",
					content:
						"Keep the APCS6 free-response and multiple-choice references available here because subtle object-state mistakes become common at this point.",
					projectLink: repo("APCS6-Free-Response-Practice/starter"),
					solutionLink: repo("APCS6-Free-Response-Practice/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Bank Account Class",
					content:
						"The bank-account build covers clean state transitions, deposits, withdrawals, and invariant thinking. A strong implementation prevents invalid balances, keeps fields encapsulated, and demonstrates state before and after each transaction.",
					projectLink: repo("APCS6-Bank-Account-Class/starter"),
					solutionLink: repo("APCS6-Bank-Account-Class/solution"),
					mediaLink: media("apcs6-project-2-bank-account-class.mp4")
				},
				{
					title: "Project: Farm Class",
					content:
						"The starter and review pair gives another class-based build with simpler domain language. The focus is fields, constructor setup, method-driven updates, and a short demonstration that object state changes only in intended ways.",
					projectLink: repo("APCS6-Farm-Class/starter"),
					solutionLink: repo("APCS6-Farm-Class/solution"),
					mediaLink: media("apcs6-project-1-farm-class.mp4")
				},
				{
					title: "Reference: Getters and Setters",
					content:
						"This reference directly reviews controlled access patterns and field updates. The key idea is that public methods can protect object invariants while still allowing outside code to read or request valid changes.",
					projectLink: repo(
						"APCS6-Getters-and-Setters-Reference/starter"
					),
					solutionLink: repo(
						"APCS6-Getters-and-Setters-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS7 Inheritance",
			curriculum: [
				{
					title: "Superclass and Subclass Design",
					content:
						"Inheritance captures shared state and behavior without copy-pasting class logic. A valid subclass relationship needs a clear justification."
				},
				{
					title: "Constructors, `super`, and Overriding",
					content:
						"Make constructor chaining and method overriding explicit: what gets inherited, what gets customized, and when `super(...)` is required."
				},
				{
					title: "Core Project: Book and PictureBook Class",
					content:
						"Book and PictureBook Class is the main APCS7 build because it maps directly to the source module and keeps the inheritance tree readable.",
					projectLink: repo("APCS7-Books-and-Picture-Books/starter"),
					solutionLink: repo(
						"APCS7-Books-and-Picture-Books/solution"
					),
					mediaLink: media(
						"apcs7-project-4-book-and-picturebook-class.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pet Class",
					content:
						"The pet-class build is the first inheritance pass before the class family expands further. The goal is to identify what belongs in the superclass and what should be left for subclasses to specialize.",
					projectLink: repo("APCS7-Pets/starter"),
					solutionLink: repo("APCS7-Pets/solution"),
					mediaLink: media("apcs7-project-1-pet-class.mp4")
				},
				{
					title: "Project: More Pets",
					content:
						"The extended pets build gives a second inheritance pass with more subclasses and behavior to compare. The useful evidence is a small set of objects whose shared and specialized behavior can be explained side by side.",
					projectLink: repo("APCS7-Pets/starter"),
					solutionLink: repo("APCS7-Pets/solution"),
					mediaLink: media("apcs7-project-2-more-pets.mp4")
				},
				{
					title: "Project: Pet Special Methods",
					content:
						"The later pet build focuses on overridden object methods and more specialized subclass behavior. Explain which method implementation runs for each object and why overriding is better than duplicating unrelated code.",
					projectLink: repo("APCS7-Dogs/starter"),
					solutionLink: repo("APCS7-Dogs/solution"),
					mediaLink: media("apcs7-project-3-pet-special-methods.mp4")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"The APCS7 multiple-choice reference reinforces inheritance vocabulary and trace reasoning. Each answer should be justified by constructor order, inherited member access, or overridden method behavior.",
					projectLink: repo(
						"APCS7-Multiple-Choice-Reference/starter"
					),
					solutionLink: repo(
						"APCS7-Multiple-Choice-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS8 Polymorphism",
			curriculum: [
				{
					title: "Superclass References and Dynamic Dispatch",
					content:
						"Polymorphism combines shared method contracts with runtime method selection based on the actual object type. The AP skill is explaining both compile-time reference restrictions and runtime overridden-method selection."
				},
				{
					title: "Type Reasoning and Invalid Calls",
					content:
						"Explain which method runs, which calls fail at compile time, and why a reference type constrains what members are visible."
				},
				{
					title: "Core Project: Many Shapes",
					content:
						"Many Shapes is the main polymorphism build. It should show superclass references, overridden methods, shared method contracts, and the difference between compile-time visibility and runtime behavior.",
					projectLink: repo("APCS8-Many-Shapes/starter"),
					solutionLink: repo("APCS8-Many-Shapes/solution"),
					mediaLink: media("apcs8-project-1-many-shapes.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Polymorphism Reference",
					content:
						"The reference pack gives short, explicit examples of superclass references and overridden methods. For each example, identify the declared reference type, actual object type, visible methods, and method body that runs.",
					projectLink: repo("APCS8-Polymorphism-Reference/starter"),
					solutionLink: repo("APCS8-Polymorphism-Reference/solution")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"The APCS8 multiple-choice reference helps when a polymorphic model is easier to code than to trace. The target is eliminating answer choices by compile-time type rules and dynamic dispatch behavior.",
					projectLink: repo(
						"APCS8-Multiple-Choice-Reference/starter"
					),
					solutionLink: repo(
						"APCS8-Multiple-Choice-Reference/solution"
					)
				}
			]
		},
		{
			title: "Check-In #3",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Check-In #3 is cumulative review for polymorphism, software design and lifecycle reasoning, arrays, and ArrayLists before the later AP-heavy units."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes type reasoning, UML and specification thinking, arrays and matrices, ArrayLists, and one final polymorphism pass."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"The GitHub-backed prompt bank supports the main Check-In #3 review sequence. It should confirm that design reasoning, polymorphism, arrays, and ArrayLists are ready before the course moves into AP-style algorithm work.",
					projectLink: repo("APCS-Check-in-3/starter"),
					solutionLink: repo("APCS-Check-in-3/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Letter Shifter",
					content:
						"The letter-shifter project reinforces inheritance, overriding, and character-level string manipulation after the check-in. A strong solution reuses shared shifting logic and handles wraparound cases for uppercase and lowercase letters.",
					projectLink: repo(
						"APCS-Check-in-3-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-3-Additional-Practice-Project/solution"
					)
				},
				{
					title: "ArrayList Reference",
					content:
						"The ArrayList reference pack supports mutation or traversal gaps. The focus is method names, shifting behavior after removal, wrapper-class requirements, and when index-based loops are safer than enhanced loops.",
					projectLink: repo("APCS11-Array-List-Reference/starter"),
					solutionLink: repo("APCS11-Array-List-Reference/solution")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"The APCS11 multiple-choice reference belongs here because the check-in's later prompts rely on strong collection tracing. The focus is index shifting, removal effects, and wrapper-class constraints rather than memorizing method names only.",
					projectLink: repo(
						"APCS11-Multiple-Choice-Reference/starter"
					),
					solutionLink: repo(
						"APCS11-Multiple-Choice-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS9 Software Development Lifecycle",
			curriculum: [
				{
					title: "Specifications, Design, and Testability",
					content:
						"APCS9 focuses on reading a spec, identifying missing requirements, and designing code that can be tested cleanly instead of guessed into existence.",
					mediaLink: media("apcs9-software-development-lifecycle.png")
				},
				{
					title: "Robust Input and Failure Handling",
					content:
						"Strengthen input handling and validation so malformed input is treated as part of core program correctness. The goal is a program that recovers from invalid input with a clear loop instead of crashing or accepting bad state."
				},
				{
					title: "Core Project: Robust Input Practice",
					content:
						"Robust input practice is the main APCS9 implementation checkpoint. The implementation should show validation loops, clear error messages, and a final valid value before continuing.",
					projectLink: repo("APCS9-Robust-Input-Practice/starter"),
					solutionLink: repo("APCS9-Robust-Input-Practice/solution"),
					mediaLink: media(
						"apcs9-project-1-robust-input-practice.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Deck Spec / Specification",
					content:
						"The source module's deck-spec work maps to the repo's specification folder. It practices reading and refining incomplete requirements.",
					projectLink: repo("APCS9-Specification/starter"),
					solutionLink: repo("APCS9-Specification/solution")
				},
				{
					title: "Robust Input Reference Review",
					content:
						"Compare the robust-input practice project with the reference implementation after the local version runs. Look for where invalid values are rejected, where the program repeats, and where valid data finally enters the main logic.",
					projectLink: repo("APCS9-Robust-Input-Practice/starter"),
					solutionLink: repo("APCS9-Robust-Input-Practice/solution")
				}
			]
		},
		{
			title: "APCS10 Arrays",
			curriculum: [
				{
					title: "Arrays, Indexing, and Fixed Size",
					content:
						"One-dimensional arrays are fixed-size ordered collections with constant-time indexed access and strict bounds. The essential habit is tracing valid indexes from `0` through `length - 1` before writing traversal code."
				},
				{
					title: "Pass-by-Reference Effects and 2D Arrays",
					content:
						"Arrays show how object references behave in methods, then extend that reasoning into two-dimensional arrays and matrix-style traversal."
				},
				{
					title: "Core Project: Practice With Arrays",
					content:
						"The practice-with-arrays project is the main APCS10 implementation checkpoint for traversal, accumulation, and simple array-return methods. The evidence should include a trace of how each loop visits elements and updates an answer.",
					projectLink: repo("APCS10-Practice-With-Arrays/starter"),
					solutionLink: repo("APCS10-Practice-With-Arrays/solution"),
					mediaLink: media(
						"apcs10-project-1-practice-with-arrays.mp4"
					)
				},
				{
					title: "Array Reference Pack",
					content:
						"The array reference build gives a quick review of indexing, `.length`, and default values when array syntax is blocking the more important reasoning about traversal, bounds, and mutation.",
					projectLink: repo("APCS10-Array-Reference/starter"),
					solutionLink: repo("APCS10-Array-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Random Mad Libs",
					content:
						"Random Mad Lib connects arrays, random indexing, and lightweight string generation. The check is that every random index stays in bounds, every word bank has a clear role, and the generated output still reads as a complete sentence.",
					projectLink: repo("APCS10-Random-Mad-Lib/starter"),
					solutionLink: repo("APCS10-Random-Mad-Lib/solution"),
					mediaLink: media("apcs10-project-2-random-mad-libs.mp4")
				},
				{
					title: "Project: Practice With Two-Dimensional Arrays",
					content:
						"This project develops grid traversal, row-and-column reasoning, and nested loops. A complete solution should explain which loop controls rows, which loop controls columns, and how the code changes when the target is a row, column, cell, or whole matrix.",
					projectLink: repo(
						"APCS10-Practice-With-Two-Dimensional-Arrays/starter"
					),
					solutionLink: repo(
						"APCS10-Practice-With-Two-Dimensional-Arrays/solution"
					),
					mediaLink: media(
						"apcs10-project-3-practice-with-two-dimensional-array.mp4"
					)
				},
				{
					title: "Project: Matrix Arithmetic",
					content:
						"Matrix arithmetic is a more structured 2D-array build. The project should make dimension compatibility explicit, then trace at least one cell of the result so array indexing and arithmetic reasoning are connected.",
					projectLink: repo("APCS10-Matrix-Arithmetic/starter"),
					solutionLink: repo("APCS10-Matrix-Arithmetic/solution"),
					mediaLink: media("apcs10-project-4-matrix-arithmetic.mp4")
				},
				{
					title: "Free Response Practice",
					content:
						"The source module uses the 2022 AP CS A FRQ set and scoring guidelines for Problem 4. Keep both resources directly linked here.",
					projectLink: AP_2022_FRQ,
					solutionLink: AP_2022_FRQ_SCORING
				}
			]
		},
		{
			title: "APCS11 ArrayLists",
			curriculum: [
				{
					title: "ArrayLists, Wrapper Constraints, and Core Methods",
					content:
						"`ArrayList` is a resizable ordered collection with method-based access, dynamic size, and object-only storage. The key contrast with arrays is that size changes through methods, while indexes still require careful bounds reasoning."
				},
				{
					title: "Mutation, Traversal, and Removal Rules",
					content:
						"The core rule is when enhanced `for` loops are appropriate, when index-based loops are safer, and why removal during enhanced iteration breaks."
				},
				{
					title: "Core Project: Practice With ArrayLists",
					content:
						"The ArrayList practice project is the main APCS11 implementation checkpoint for counting, filtering, mutation, and removal logic.",
					projectLink: repo(
						"APCS11-Practice-With-Array-Lists/starter"
					),
					solutionLink: repo(
						"APCS11-Practice-With-Array-Lists/solution"
					),
					mediaLink: media(
						"apcs11-project-1-practice-with-arraylists.mp4"
					)
				},
				{
					title: "ArrayList Reference Pack",
					content:
						"Keep the ArrayList reference build close for method review and quick syntax reinforcement. It should support fast checks of `add`, `get`, `set`, `remove`, `size`, traversal style, and mutation safety.",
					projectLink: repo("APCS11-Array-List-Reference/starter"),
					solutionLink: repo("APCS11-Array-List-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Fortune Teller",
					content:
						"FortuneTeller combines ArrayLists, random selection, and controlled mutation of collection state. The interesting check is whether random choices remain valid as items are added, removed, or reused.",
					projectLink: repo("APCS11-Fortune-Teller-Class/starter"),
					solutionLink: repo("APCS11-Fortune-Teller-Class/solution"),
					mediaLink: media("apcs11-project-2-fortune-teller.mp4")
				},
				{
					title: "Project: Card Shuffler",
					content:
						"The starter and review pair for Card Shuffler connects objects, ArrayLists, and algorithmic updates in a higher-signal build.",
					projectLink: repo("APCS11-Card-Shuffler/starter"),
					solutionLink: repo("APCS11-Card-Shuffler/solution"),
					mediaLink: media("apcs11-project-3-card-shuffler.mp4")
				},
				{
					title: "Free Response Practice",
					content:
						"The APCS11 FRQ practice build bridges list manipulation and AP free-response expectations. The focus is writing correct list updates while explaining index choices, loop direction, and side effects clearly enough for partial credit.",
					projectLink: repo("APCS11-Free-Response-Practice/starter"),
					solutionLink: repo("APCS11-Free-Response-Practice/solution")
				},
				{
					title: "Card and Deck Classes",
					content:
						"The card-and-deck classes provide a bridge build when object-list modeling needs more practice before APCS12 and APCS17.",
					projectLink: repo("APCS11-Card-and-Deck-Classes/starter"),
					solutionLink: repo("APCS11-Card-and-Deck-Classes/solution")
				}
			]
		},
		{
			title: "Check-In #4",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Check-In #4 is cumulative review of wrapper classes, runtime analysis, recursion, sorting, and searching before the final AP prep stretch."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes computational steps, recursive reasoning, sorting traces, search preconditions, and wrapper-class behavior. Treat it as a readiness check for the algorithm-heavy final third of the course."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"The GitHub-backed prompt bank supports the full Check-In #4 review sequence. It should identify whether the remaining work should prioritize wrappers, recursion, sorting, searching, or AP-style trace explanations.",
					projectLink: repo("APCS-Check-in-4/starter"),
					solutionLink: repo("APCS-Check-in-4/solution"),
					mediaLink: media("apcs-check-in-4.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Inversion Counting",
					content:
						"Inversion counting after the check-in gives one more applied problem connecting sorting and runtime ideas. The important reasoning is how pair comparisons reveal disorder and why a brute-force count has quadratic cost.",
					projectLink: repo(
						"APCS-Check-in-4-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-4-Additional-Practice-Project/solution"
					)
				},
				{
					title: "Project: Minimum and Maximum",
					content:
						"This project is a targeted follow-up when wrapper constants and search initialization still feel abstract. Trace the first element, current best value, comparison result, and update rule so the initialization choice is defensible.",
					projectLink: repo("APCS12-Minimum-and-Maximum/starter"),
					solutionLink: repo("APCS12-Minimum-and-Maximum/solution")
				},
				{
					title: "Runtime Analysis Starter",
					content:
						"The runtime starter supports weak step-counting or loop-cost reasoning. The goal is to connect a loop structure to growth rate before using Big-O notation as shorthand.",
					projectLink: repo("APCS13-Runtime-Analysis/starter"),
					solutionLink: repo("APCS13-Runtime-Analysis/solution")
				}
			]
		},
		{
			title: "APCS12 Wrapper Classes",
			curriculum: [
				{
					title: "Wrapper Types, Autoboxing, and Unboxing",
					content:
						"Wrapper classes are the object form of primitive values, with attention to why collections use them and how autoboxing and unboxing hide conversions."
				},
				{
					title: "Static Constants and Search Initialization",
					content:
						"`Integer.MIN_VALUE` and `Integer.MAX_VALUE` support sane initialization choices for min/max search problems. The concept matters because a bad starting value can make a correct-looking loop fail on all-negative or all-positive data."
				},
				{
					title: "Core Project: Suits, Decks, and Hands",
					content:
						"Suits, Decks, and Hands is the main APCS12 build. The project connects wrapper-aware values, object collections, random selection, and clear class responsibilities in one card-modeling task.",
					projectLink: repo("APCS12-Suit-Deck-and-Hand/starter"),
					solutionLink: repo("APCS12-Suit-Deck-and-Hand/solution"),
					mediaLink: media(
						"apcs12-project-1-suits-decks-and-hands.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Minimum and Maximum Search",
					content:
						"This build reinforces wrapper constants and collection scanning with boxed integers. The explanation should justify the initial minimum and maximum values, then trace how each comparison can update the answer.",
					projectLink: repo("APCS12-Minimum-and-Maximum/starter"),
					solutionLink: repo("APCS12-Minimum-and-Maximum/solution"),
					mediaLink: media("apcs12-project-2-minimum-search.mp4")
				},
				{
					title: "Project: Deck Class",
					content:
						"Deck Class gives another wrapper-style object around a collection before APCS17. The useful check is whether cards are represented consistently and deck operations preserve valid collection state.",
					projectLink: repo("APCS12-Deck-Class/starter"),
					solutionLink: repo("APCS12-Deck-Class/solution")
				}
			]
		},
		{
			title: "APCS13 Algorithmic Runtime and Linear Search",
			curriculum: [
				{
					title: "Runtime by Step Counting",
					content: apConcept({
						focus: "Runtime analysis compares how work grows as input size grows. Wall-clock time changes with hardware, compiler settings, and background load, so AP CSA reasoning counts loop iterations, comparisons, assignments, recursive calls, or other stable operations.",
						practice: [
							"Choose one code fragment and name the operation being counted.",
							"Trace the count for small inputs such as `n = 1`, `n = 2`, and `n = 5`.",
							"Rewrite the count as a simple expression in terms of `n`.",
							"Summarize the growth rate only after the counted work is clear."
						],
						evidence:
							"A complete runtime explanation connects the code structure to the count. The final Big-O label is not enough unless the loop bounds or recursive calls explain why that label fits."
					})
				},
				{
					title: "Best, Average, and Worst Case",
					content: apConcept({
						focus: "The same algorithm can do different amounts of work depending on the input. Search algorithms are the cleanest examples: the target might be first, last, absent, or positioned near the middle.",
						practice: [
							"Name one input that makes the algorithm finish quickly.",
							"Name one input that forces the largest number of checks.",
							"Explain whether a typical case needs a probability model or only a representative example.",
							"Connect the case labels to the exact comparison or loop that changes."
						],
						evidence:
							"Best, average, and worst-case labels are supported by concrete inputs and a trace of how many checks those inputs cause."
					})
				},
				{
					title: "Core Project: Runtime Analysis",
					content: apProject({
						goal: "Use the runtime-analysis starter to connect Java loop structure to growth-rate reasoning.",
						steps: [
							"Identify the input size for each method before counting anything.",
							"Mark the line or operation that represents the repeated work.",
							"Count the operation for small input sizes and look for the pattern.",
							"Classify the growth rate after the count is visible."
						],
						apReasoning:
							"AP CSA Java reasoning expects the answer to cite code structure: loop bounds, nested loops, early exits, or recursive calls. The notation is a summary of that evidence, not a replacement for it.",
						checks: [
							"The counted operation is named explicitly.",
							"At least one small input trace supports the formula.",
							"The final growth class matches the dominant term rather than a copied guess."
						],
						extension:
							"Compare two implementations of the same task and explain which input sizes would make the difference noticeable."
					}),
					projectLink: repo("APCS13-Runtime-Analysis/starter"),
					solutionLink: repo("APCS13-Runtime-Analysis/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Linear Search Implementation",
					content: apProject({
						goal: "Implement and trace linear search so the result and runtime case are both visible.",
						steps: [
							"Search an unsorted array with a simple left-to-right loop.",
							"Return or report the target as soon as it is found.",
							"Add a sorted-data variant only when the early-exit condition is justified.",
							"Trace found-at-front, found-at-end, and not-found inputs."
						],
						apReasoning:
							"The AP question is not only whether the code finds the target. It is also which comparisons occur, when the loop stops, and how sortedness changes the worst-case or early-exit behavior.",
						checks: [
							"The not-found case terminates without reading past the end.",
							"The found-at-front case performs one comparison.",
							"The sorted variant explains why values beyond the target point no longer need checking."
						],
						extension:
							"Return the first matching index instead of a boolean result, then test duplicates and explain why the first occurrence is returned."
					}),
					projectLink: repo(
						"APCS13-Linear-Search-Implementation/starter"
					),
					solutionLink: repo(
						"APCS13-Linear-Search-Implementation/solution"
					),
					mediaLink: media("apcs13-project-2-linear-search.mp4")
				}
			]
		},
		{
			title: "APCS14 Selection and Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort",
					content: apConcept({
						focus: "Selection sort repeatedly finds the next smallest or largest value and moves it into the sorted region. The sorted region grows from one side, while the unsorted region shrinks by one element per pass.",
						practice: [
							"Trace one pass and record the current index, candidate extreme index, and comparison result.",
							"Swap only after the pass identifies the correct extreme value.",
							"Draw the boundary between sorted and unsorted regions after each pass.",
							"Count the comparisons to connect the algorithm to quadratic runtime."
						],
						evidence:
							"A correct trace explains the invariant: after pass `k`, the first `k` positions contain the correct values in sorted order."
					})
				},
				{
					title: "Insertion Sort",
					content: apConcept({
						focus: "Insertion sort grows a sorted prefix by inserting the next value into the correct earlier position. It rewards nearly sorted data because values often do not need to move far.",
						practice: [
							"Mark the sorted prefix before each pass.",
							"Store the current value and shift larger or smaller values until the insertion point is open.",
							"Compare an already sorted input with a reverse-sorted input.",
							"Explain why the best case has fewer movements than the worst case."
						],
						evidence:
							"The trace shows both the current value being inserted and the sorted prefix remaining sorted after the insertion."
					})
				},
				{
					title: "Core Project: Selection Sort",
					content: apProject({
						goal: "Implement selection sort with a visible sorted-region invariant and traceable comparison behavior.",
						steps: [
							"Choose ascending or descending order and keep that direction consistent.",
							"Loop over each position that will receive the next selected value.",
							"Search the remaining unsorted region for the next extreme value.",
							"Swap after the scan and record how the sorted region changed."
						],
						apReasoning:
							"AP CSA Java reasoning focuses on the invariant and the nested-loop count. The outer loop fixes one position per pass, and the inner loop searches the remaining region.",
						checks: [
							"Already sorted, reverse sorted, duplicate-heavy, and single-element arrays all behave correctly.",
							"The trace identifies the selected index before the swap.",
							"The runtime explanation connects the nested loops to quadratic growth."
						],
						extension:
							"Sort objects by one field, such as card rank or student score, and explain what comparison changed."
					}),
					projectLink: repo("APCS14-Selection-Sort/starter"),
					solutionLink: repo("APCS14-Selection-Sort/solution"),
					mediaLink: media("apcs14-project-1-selection-sort.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Insertion Sort",
					content: apProject({
						goal: "Implement insertion sort and explain why its behavior changes with input order.",
						steps: [
							"Treat index `0` as the initial sorted prefix.",
							"Take the next value and move left through the prefix until the insertion point is found.",
							"Shift values without overwriting the stored current value.",
							"Trace a nearly sorted input and a reverse-sorted input."
						],
						apReasoning:
							"Insertion sort questions often test loop conditions, index bounds, and the order of assignment during shifting. A clean trace shows why `j >= 0` style bounds checks matter.",
						checks: [
							"The current value is preserved while other values shift.",
							"The algorithm handles duplicates without losing values.",
							"The best-case and worst-case examples are named and justified."
						],
						extension:
							"Add a counter for comparisons and shifts, then compare selection sort and insertion sort on the same inputs."
					}),
					projectLink: repo("APCS14-Insertion-Sort/starter"),
					solutionLink: repo("APCS14-Insertion-Sort/solution"),
					mediaLink: media("apcs14-project-2-insertion-sort.mp4")
				}
			]
		},
		{
			title: "APCS15 Recursion",
			curriculum: [
				{
					title: "Base Cases, Recursive Steps, and Stack Frames",
					content: apConcept({
						focus: "A recursive method solves a problem by delegating a smaller version of the same problem to another method call. The base case stops the chain, and the recursive step must move closer to that stop condition.",
						practice: [
							"Identify the base case before reading the recursive line.",
							"Write the smaller subproblem created by one recursive call.",
							"Draw stack frames for a small input and mark where each call pauses.",
							"Trace the return path separately from the call path."
						],
						evidence:
							"The explanation names the stopping condition, the shrinking input, and the order in which output or return values appear."
					}),
					mediaLink: media("apcs15-recursion-1.png")
				},
				{
					title: "Stack Overflow and Tail Recursion",
					content: apConcept({
						focus: "Every recursive call consumes a stack frame. A missing base case, a base case that is never reached, or a recursive step that does not shrink the problem eventually exhausts the stack.",
						practice: [
							"Find the recursive call and ask what input it receives next.",
							"Check whether that next input is closer to the base case.",
							"Compare a tail-recursive method with a method that still has work after the recursive call returns.",
							"Explain the error using stack frames rather than only naming `StackOverflowError`."
						],
						evidence:
							"A valid diagnosis points to the exact recursive step that fails to approach the base case or the exact input where the base case is skipped."
					}),
					mediaLink: media("apcs15-recursion-2.png")
				},
				{
					title: "Core Project: Tracing Recursion",
					content: apProject({
						goal: "Trace recursive methods by drawing the call chain, base case, and return path before relying on runtime output.",
						steps: [
							"Read each method and identify the base case.",
							"Trace the calls created by the input from `main`.",
							"Predict printed output or returned values before running the code.",
							"Summarize what the method does for any valid input."
						],
						apReasoning:
							"AP CSA Java reasoning often asks for output order, return value, or termination. The trace needs separate call-down and return-up phases because recursive output can occur before or after the recursive call.",
						checks: [
							"Each frame has its own parameter values.",
							"The base-case frame is identified explicitly.",
							"The predicted output order matches the method body order."
						],
						extension:
							"Modify one base case or recursive step and predict how the output or termination changes."
					}),
					projectLink: repo("APCS15-Tracing-Recursion/starter"),
					solutionLink: repo("APCS15-Tracing-Recursion/solution")
				},
				{
					title: "Recursion Reference Pack",
					content:
						"Keep the recursion reference available for short examples before assigning the longer practice set. It is most useful when a small trace is needed to separate the base case, recursive step, printed output order, and returned value.",
					projectLink: repo("APCS15-Recursion-Reference/starter"),
					solutionLink: repo("APCS15-Recursion-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Recursion Practice",
					content: apProject({
						goal: "Implement classic recursive methods while keeping the base case, smaller subproblem, and return path explicit.",
						steps: [
							"Write the base case before the recursive case.",
							"Reduce the input in a way that reaches the base case.",
							"Return or print in the correct order for factorials, powers, Fibonacci-style sequences, and string cascades.",
							"Test the smallest valid input, a typical input, and an input near a boundary."
						],
						apReasoning:
							"The AP emphasis is method behavior and traceability. A recursive method that works for one sample but lacks a defensible base case remains fragile.",
						checks: [
							"The recursive call uses a smaller or simpler input.",
							"Return values combine correctly after the recursive call returns.",
							"The method avoids duplicate or infinite work unless the prompt intentionally explores that cost."
						],
						extension:
							"Compare a recursive solution with an iterative version and explain which state is implicit in the call stack."
					}),
					projectLink: repo("APCS15-Recursion-Practice/starter"),
					solutionLink: repo("APCS15-Recursion-Practice/solution"),
					mediaLink: media("apcs15-project-2-recursion-practice.mp4")
				},
				{
					title: "Project: Blob Erase",
					content: apProject({
						goal: "Use recursion to erase a connected region in a 2D grid while avoiding repeated visits and out-of-bounds access.",
						steps: [
							"Represent the image as a 2D array of filled and empty cells.",
							"Reject invalid positions, empty cells, and already-erased cells as base cases.",
							"Erase or mark the current cell before exploring neighbors.",
							"Recurse up, down, left, and right to cover the connected blob."
						],
						apReasoning:
							"This is AP CSA Java reasoning for 2D arrays plus recursion. The correctness depends on the base-case order, row/column bounds, and marking the current cell before recursive expansion.",
						checks: [
							"Starting on an empty cell changes nothing.",
							"Starting outside the grid is handled safely.",
							"A blob with branches erases completely without infinite recursion."
						],
						extension:
							"Return the number of erased cells or add diagonal connectivity, then explain how the base cases and recursive calls changed."
					}),
					projectLink: repo("APCS15-Blob-Erase/starter"),
					solutionLink: repo("APCS15-Blob-Erase/solution"),
					mediaLink: media("apcs15-project-3-blob-erase.mp4")
				},
				{
					title: "Reference: Stack Overflow",
					content: apProject({
						goal: "Diagnose recursive methods that compile but do not terminate safely.",
						steps: [
							"Identify the base case and the recursive call.",
							"Trace two or three calls to see whether the input approaches the base case.",
							"Name the first repeated pattern that proves the recursion will continue indefinitely.",
							"Repair the stop condition or shrinking step and trace again."
						],
						apReasoning:
							"AP CSA Java reasoning treats stack overflow as evidence of a failed recursive structure, not as a random runtime event.",
						checks: [
							"The diagnosis cites a specific input and method line.",
							"The repaired version reaches the base case.",
							"The explanation separates infinite recursion from a long but finite recursion."
						]
					}),
					projectLink: repo(
						"APCS15-Stack-Overflow-Reference/starter"
					),
					solutionLink: repo(
						"APCS15-Stack-Overflow-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS16 Binary Search and Merge Sort",
			curriculum: [
				{
					title: "Binary Search Preconditions",
					content: apConcept({
						focus: "Binary search is fast because each comparison eliminates half of the remaining sorted search space. Without sorted data, the eliminated half might still contain the target.",
						practice: [
							"State the sorted-data precondition before tracing the algorithm.",
							"Record `low`, `high`, `middle`, and the middle value for each step.",
							"Choose the left or right half by comparing the target with the middle value.",
							"Stop when the target is found or when the bounds cross."
						],
						evidence:
							"A complete trace explains both why the selected half is still possible and why the discarded half is impossible."
					})
				},
				{
					title: "Merge Sort and Divide-and-Conquer",
					content: apConcept({
						focus: "Merge sort divides an array into smaller arrays, sorts those smaller arrays recursively, and then merges sorted halves into one sorted result. The merge step is where most visible work occurs.",
						practice: [
							"Draw the split tree until each subarray has length one.",
							"Merge two sorted one-element arrays by comparing their first values.",
							"Continue merging while preserving sorted order.",
							"Count the merge levels and connect them to `n log n` growth."
						],
						evidence:
							"The explanation separates divide, recursive sort, and merge. A result that is merely sorted is not enough unless the merge decisions can be traced."
					})
				},
				{
					title: "Core Project: Binary Search",
					content: apProject({
						goal: "Implement iterative and recursive binary search while making the sorted-data precondition and bound updates explicit.",
						steps: [
							"State the sorted-data precondition before using the algorithm.",
							"Trace at least one search by recording the low, high, and middle indices at each step.",
							"Move the lower or upper bound past the middle after each failed comparison.",
							"Return the correct result when the target is found or when the range becomes empty."
						],
						apReasoning:
							"AP CSA Java reasoning connects the code to halving behavior. The iterative version exposes loop invariants, while the recursive version exposes base cases and smaller search ranges.",
						checks: [
							"The target at the first, middle, and last positions is found.",
							"The absent-target case terminates when bounds cross.",
							"The recursive version changes the range on every recursive call."
						],
						extension:
							"Return the found index instead of a boolean and decide what to return when duplicates exist."
					}),
					projectLink: repo("APCS16-Binary-Search/starter"),
					solutionLink: repo("APCS16-Binary-Search/solution"),
					mediaLink: media("apcs16-project-1-binary-search.mp4")
				},
				{
					title: "Merge Step Visual",
					content: apProject({
						goal: "Use the merge visual to isolate the sorted-merge operation before implementing the full recursive sort.",
						steps: [
							"Start with two already sorted lists.",
							"Compare the first remaining value from each list.",
							"Move the smaller value into the output list.",
							"Append the rest of the non-empty list after the other side is exhausted."
						],
						apReasoning:
							"The merge operation is valid only because both input halves are already sorted. This precondition explains why the remaining tail can be copied without more cross-comparisons.",
						checks: [
							"Equal values follow a consistent tie rule.",
							"The output length equals the combined input lengths.",
							"The output remains sorted after every move."
						]
					}),
					projectLink: repo("APCS16-Merge-Sort/starter"),
					solutionLink: repo("APCS16-Merge-Sort/solution"),
					mediaLink: media("am_10_merge.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Merge Sort",
					content: apProject({
						goal: "Implement recursive merge sort and explain how splitting plus merging creates `O(n log n)` behavior.",
						steps: [
							"Use an array of length zero or one as the base case.",
							"Split larger arrays into left and right halves.",
							"Recursively sort each half.",
							"Merge the two sorted halves into one sorted result."
						],
						apReasoning:
							"AP CSA Java reasoning for merge sort depends on recognizing the recursive structure and the linear work at each merge level. The algorithm has no best-case shortcut like insertion sort.",
						checks: [
							"Empty, single-element, duplicate-heavy, and already sorted arrays are handled.",
							"The merge helper assumes sorted inputs and preserves every element.",
							"The runtime explanation identifies both the number of levels and the work per level."
						],
						extension:
							"Track temporary-array allocation or implement an index-range version, then compare clarity and space usage."
					}),
					projectLink: repo("APCS16-Merge-Sort/starter"),
					solutionLink: repo("APCS16-Merge-Sort/solution"),
					mediaLink: media("apcs16-project-2-merge-sort.mp4")
				}
			]
		},
		{
			title: "APCS17 Master Projects and Test Prep",
			curriculum: [
				{
					title: "Practice Exam and FRQ Rhythm",
					content: apConcept({
						focus: "The final APCS stretch changes from learning isolated topics to switching between topics under time pressure. Multiple-choice practice trains recognition and tracing; FRQs train method contracts, partial credit, and concise written reasoning.",
						practice: [
							"Run short mixed-topic sets before assigning full exams.",
							"Score FRQs with official rubrics and identify the exact missed point category.",
							"Keep an error log by unit, such as arrays, ArrayLists, recursion, inheritance, or sorting.",
							"Reserve full practice exams for timed conditions rather than casual review."
						],
						evidence:
							"Practice is productive when missed questions produce a targeted review action, not only a score."
					})
				},
				{
					title: "Next Course Positioning",
					content: apConcept({
						focus: "The next course choice depends on the kind of work that remains challenging after AP CSA: Java design depth, C++ memory and systems work, Python/data projects, or contest-style algorithmic problem solving.",
						practice: [
							"Review the strongest completed project and the hardest unresolved topic.",
							"Compare exam-readiness evidence with independent-project evidence.",
							"Choose one next route and name the prerequisite that makes it appropriate.",
							"Record one skill to preserve during the transition, such as tracing, testing, or design explanation."
						],
						evidence:
							"The recommendation follows from demonstrated work: runnable code, trace explanations, FRQ scoring, and independence on new prompts."
					})
				},
				{
					title: "Core Project: Spaceships",
					content: apProject({
						goal: "Build a nested object model for a spaceship fleet using classes, collections, add/remove behavior, and readable `toString()` output.",
						steps: [
							"Define `Passenger`, `Room`, `Ship`, and `Fleet` responsibilities before coding.",
							"Store collections at the level that owns them: passengers in rooms, rooms in ships, ships in fleets.",
							"Implement add and remove methods that preserve valid state.",
							"Generate a random fleet and print it in a readable hierarchy."
						],
						apReasoning:
							"This capstone tests AP CSA Java reasoning with object ownership, collection traversal, method contracts, and string representation. The design matters as much as the final printed output.",
						checks: [
							"Each class owns only the state that belongs to its abstraction.",
							"Add/remove methods work for empty, typical, and already-missing cases.",
							"The printed fleet can be checked against the constructed object counts."
						],
						extension:
							"Add capacity limits per room or ship and explain where the validation belongs."
					}),
					projectLink: repo("APCS17-Spaceships/starter"),
					solutionLink: repo("APCS17-Spaceships/solution"),
					mediaLink: media("apcs17-master-project-1-spaceships.mp4")
				},
				{
					title: "Past FRQ Archive",
					content:
						"Keep the official College Board FRQ archive available throughout APCS17 for cycling through multiple years of real prompts.",
					projectLink: AP_FRQ_ARCHIVE
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Elevens",
					content: apProject({
						goal: "Implement the Elevens card-game variation with deck state, hand state, move validation, and replenishment after removals.",
						steps: [
							"Reuse or adapt the deck/card model from earlier modules.",
							"Deal a nine-card hand while cards remain available.",
							"Detect valid moves: pairs summing to eleven or a Jack-Queen-King group.",
							"Remove selected cards, refill the hand, and stop when the deck is cleared or no move remains."
						],
						apReasoning:
							"Elevens combines ArrayList mutation, object modeling, conditionals, and game-state loops. The hardest part is keeping collection changes correct while validating legal moves.",
						checks: [
							"Removing cards does not skip or corrupt later indexes.",
							"The game detects both winning and no-move ending states.",
							"Ace, face-card, and suit behavior matches the stated rules."
						],
						extension:
							"Add a move suggester that lists all valid moves and compare its output with manual traces."
					}),
					projectLink: repo("APCS17-Elevens/starter"),
					solutionLink: repo("APCS17-Elevens/solution"),
					mediaLink: media("apcs17-master-project-2-elevens.mp4")
				},
				{
					title: "Master Project: Decode",
					content: apProject({
						goal: "Build a message-and-tower communication model where matching secret numbers allow encoded messages to be decoded correctly.",
						steps: [
							"Define a `Message` class that stores text and can shift letters forward or backward.",
							"Define a `Tower` class with a secret number used for transmission and receiving.",
							"Preserve spaces, punctuation, or nonletters according to a stated rule.",
							"Test two towers with matching and non-matching secret numbers."
						],
						apReasoning:
							"Decode is AP CSA Java reasoning for strings, methods, object state, and encapsulation. The important design question is which class owns the shifting behavior and which class owns the secret key.",
						checks: [
							"Encoding and decoding with the same number restores the original message.",
							"Different tower numbers produce unreadable or different text.",
							"Wraparound behavior for letters is specified and tested."
						],
						extension:
							"Add a simple history of sent messages or support different shift strategies without exposing tower internals."
					}),
					projectLink: repo("APCS17-Decode/starter"),
					solutionLink: repo("APCS17-Decode/solution"),
					mediaLink: media("apcs17-master-project-3-decode.mp4")
				},
				{
					title: "2022 FRQ and Scoring Guidelines",
					content:
						"The 2022 AP CS A FRQ set and official scoring guidelines support timed practice and post-run scoring conversations.",
					projectLink: AP_2022_FRQ,
					solutionLink: AP_2022_FRQ_SCORING
				},
				{
					title: "2020 Repo Practice Exam",
					content:
						"The repo-backed practice exam is an additional full-run benchmark for timing, stamina, and mixed-topic switching when those matter more than another isolated concept drill.",
					projectLink: repo("APCS-A-2020-Practice-Exam/starter"),
					solutionLink: repo("APCS-A-2020-Practice-Exam/solution")
				}
			]
		}
	]
};
