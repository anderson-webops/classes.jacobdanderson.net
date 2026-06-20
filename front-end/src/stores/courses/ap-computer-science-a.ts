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
						"Use the APCS track guide as the course pacing readme. It separates the course into Slow/Supported, Medium/Standard, Fast/Quick, Hard/Challenge, and Exam-focused tracks, with concrete module decisions, project-load choices, and advancement rules for each route.",
						"Use the placement checkpoints in the guide to choose the route from evidence: recent code, Java-specific mistakes, hand tracing, object-state explanations, and AP-style written reasoning.",
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
						"The repo-backed reference projects for variables, strings, and casting establish a clean notes-and-sandbox workflow from day one. Use them to separate Java syntax issues from actual concept gaps before starting the first graded-style projects.",
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
						"This reference build gives a tighter review of integer division, explicit casts, and loss-of-precision reasoning. Use it to explain when Java truncates automatically, when an explicit cast is required, and what information is lost.",
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
						"Use the first check-in as guided review rather than a formal test. Focus on what the explanation covers and debug independently across variables, conditionals, loops, and basic exceptions."
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
						"Use the additional practice project after the check-in when divisibility checks, ordered conditionals, and loop tracing need one more pass.",
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
						"Use the loop reference pack for fast review of counted iteration before moving into APCS4. Focus on predicting the first iteration, last iteration, number of iterations, and the variable state after the loop ends.",
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
						"This project gives another structured pass through typed input, variable naming, and console formatting. Use it to check that numeric and text inputs are read with the correct scanner method and then reported with useful labels.",
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
						"Use the boolean-only version first so logic is encoded cleanly before conditionals are added in APCS3. A strong solution names each boolean expression, tests both true and false paths, and avoids hiding the decision inside vague variable names.",
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
						"Use this one-line boolean exercise to force concise reasoning about relationships between values. The goal is to write one readable compound expression, then justify the expression with at least one matching case and one non-matching case.",
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
						"Use Elevator Warning as the cleanest repo-backed APCS3 project for threshold checks, conditionals, and readable output. The decision structure should make the unsafe condition obvious and should handle boundary values exactly, not just typical inputs.",
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
						"The source course used a Replit math demo; the repo-backed counterpart is the `APCS3-Math-Fun` project and should be used instead.",
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
						"Use nested loops for patterns and tables, then connect loop correctness to common runtime errors like bounds issues and arithmetic mistakes."
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
						"Keep the loop references available for targeted review on tracing, nested iteration, and pattern generation. Use them to practice predicting output before execution and identifying which variable controls each repeated action.",
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
						"Use this mixed practice set to drill while-loop termination and nested iteration on structured output problems. The key check is explaining which condition eventually becomes false and how many times the inner loop runs.",
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
						"Use the reference pack when nested iteration needs one more clean example before arrays arrive. Focus on loop initialization, update placement, and the relationship between row-style output and nested loop structure.",
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
						"Use Check-In #2 to review class construction, methods, inheritance vocabulary, access control, and `this` before the course moves into the heavier object-oriented sequence."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The check-in concentrates on class definitions, constructors, accessor and mutator methods, static members, inheritance, overriding, and `super`. Treat the answers as evidence of object-model reasoning, not just isolated syntax recall."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Use the prompt bank for the full Check-In #2 review. This checkpoint shows whether classes, methods, and inheritance are ready for the main object-oriented sequence.",
					projectLink: repo("APCS-Check-in-2/starter"),
					solutionLink: repo("APCS-Check-in-2/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Animal Kingdom",
					content:
						"Use the taxonomy inheritance project after the check-in when inheritance needs one more structured build. The important design target is avoiding repeated data by letting each subclass add only the classification level it owns.",
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
						"Use this short class example when constructor syntax or instance variables still feel shaky. It should make the relationship between a class definition, a constructed object, and the object's stored fields concrete.",
					projectLink: repo("APCS5-Class-Example/starter"),
					solutionLink: repo("APCS5-Class-Example/solution")
				},
				{
					title: "This Reference",
					content:
						"Use the `this` reference pack when constructor syntax works but `this.field` still needs a clearer explanation. The checkpoint is distinguishing a parameter name from the instance variable that belongs to the current object.",
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
						"Use short object builds to make getters, setters, parameters, return values, and `this` references concrete. A finished example should show both reading state safely and changing state only through methods that preserve the class contract."
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
						"Use the APCS5 method-practice project for short parameter and return-value repetitions. Each method should identify its inputs, output, side effects if any, and one call from `main` that proves the method contract is being used correctly.",
					projectLink: repo("APCS5-Practice-with-Methods/starter"),
					solutionLink: repo("APCS5-Practice-with-Methods/solution"),
					mediaLink: media("apcs5-project-1-method-practice.mp4")
				},
				{
					title: "Project: Store Class",
					content:
						"Use Store Class when another object model with a small but meaningful state transition would help. The useful evidence is a before-and-after object state, such as inventory, price, or balance changing through a method rather than direct field access.",
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
						"Use the APCS6 reference packs to distinguish field access, parameter shadowing, and the difference between primitive copies and object references."
				},
				{
					title: "Core Project: Vending Machine Class",
					content:
						"Use the vending-machine project as the main APCS6 build because it exercises constructors, fields, controlled mutation, and method design in one compact model.",
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
						"Use the bank-account build for clean state transitions, deposits, withdrawals, and invariant thinking. A strong implementation prevents invalid balances, keeps fields encapsulated, and demonstrates state before and after each transaction.",
					projectLink: repo("APCS6-Bank-Account-Class/starter"),
					solutionLink: repo("APCS6-Bank-Account-Class/solution"),
					mediaLink: media("apcs6-project-2-bank-account-class.mp4")
				},
				{
					title: "Project: Farm Class",
					content:
						"Use the starter and review pair when another class-based build with simpler domain language would help. Focus on fields, constructor setup, method-driven updates, and a short demonstration that object state changes only in intended ways.",
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
						"Use Book and PictureBook Class as the main APCS7 build because it maps directly to the source module and keeps the inheritance tree readable.",
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
						"Use the pet-class build for the first inheritance pass before expanding the class family further. The goal is to identify what belongs in the superclass and what should be left for subclasses to specialize.",
					projectLink: repo("APCS7-Pets/starter"),
					solutionLink: repo("APCS7-Pets/solution"),
					mediaLink: media("apcs7-project-1-pet-class.mp4")
				},
				{
					title: "Project: More Pets",
					content:
						"Use the extended pets build for a second inheritance pass with more subclasses and behavior to compare. The useful evidence is a small set of objects whose shared and specialized behavior can be explained side by side.",
					projectLink: repo("APCS7-Pets/starter"),
					solutionLink: repo("APCS7-Pets/solution"),
					mediaLink: media("apcs7-project-2-more-pets.mp4")
				},
				{
					title: "Project: Pet Special Methods",
					content:
						"Use the later pet build to focus on overridden object methods and more specialized subclass behavior. Explain which method implementation runs for each object and why overriding is better than duplicating unrelated code.",
					projectLink: repo("APCS7-Dogs/starter"),
					solutionLink: repo("APCS7-Dogs/solution"),
					mediaLink: media("apcs7-project-3-pet-special-methods.mp4")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"Use the APCS7 multiple-choice reference to reinforce inheritance vocabulary and trace reasoning. Each answer should be justified by constructor order, inherited member access, or overridden method behavior.",
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
						"Use the Many Shapes project as the main polymorphism build. It should show superclass references, overridden methods, shared method contracts, and the difference between compile-time visibility and runtime behavior.",
					projectLink: repo("APCS8-Many-Shapes/starter"),
					solutionLink: repo("APCS8-Many-Shapes/solution"),
					mediaLink: media("apcs8-project-1-many-shapes.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Polymorphism Reference",
					content:
						"Use the reference pack for short, explicit examples of superclass references and overridden methods. For each example, identify the declared reference type, actual object type, visible methods, and method body that runs.",
					projectLink: repo("APCS8-Polymorphism-Reference/starter"),
					solutionLink: repo("APCS8-Polymorphism-Reference/solution")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"Use the APCS8 multiple-choice reference when a polymorphic model is easier to code than to trace. The target is eliminating answer choices by compile-time type rules and dynamic dispatch behavior.",
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
						"Use Check-In #3 as cumulative review for polymorphism, software design and lifecycle reasoning, arrays, and ArrayLists before the later AP-heavy units."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes type reasoning, UML and specification thinking, arrays and matrices, ArrayLists, and one final polymorphism pass."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Use the GitHub-backed prompt bank for the main Check-In #3 review sequence. It should confirm that design reasoning, polymorphism, arrays, and ArrayLists are ready before the course moves into AP-style algorithm work.",
					projectLink: repo("APCS-Check-in-3/starter"),
					solutionLink: repo("APCS-Check-in-3/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Letter Shifter",
					content:
						"Use the letter-shifter project to reinforce inheritance, overriding, and character-level string manipulation after the check-in. A strong solution reuses shared shifting logic and handles wraparound cases for uppercase and lowercase letters.",
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
						"Use the ArrayList reference pack when the check-in shows mutation or traversal gaps. Focus on method names, shifting behavior after removal, wrapper-class requirements, and when index-based loops are safer than enhanced loops.",
					projectLink: repo("APCS11-Array-List-Reference/starter"),
					solutionLink: repo("APCS11-Array-List-Reference/solution")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"Use the APCS11 multiple-choice reference here because the check-in's later prompts rely on strong collection tracing. Focus on index shifting, removal effects, and wrapper-class constraints rather than memorizing method names only.",
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
						"Use APCS9 for reading a spec, identifying missing requirements, and designing code that can be tested cleanly instead of guessed into existence.",
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
						"Use robust input practice as the main APCS9 implementation checkpoint. The implementation should show validation loops, clear error messages, and a final valid value before continuing.",
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
						"The source module's deck-spec work maps to the repo's specification folder. Use it to practice reading and refining incomplete requirements.",
					projectLink: repo("APCS9-Specification/starter"),
					solutionLink: repo("APCS9-Specification/solution")
				},
				{
					title: "Robust Input Solution Build",
					content:
						"Use the completed robust-input build to compare an input-validation structure against a reference implementation. Look for where invalid values are rejected, where the program repeats, and where valid data finally enters the main logic.",
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
						"Use arrays to show how object references behave in methods, then extend that reasoning into two-dimensional arrays and matrix-style traversal."
				},
				{
					title: "Core Project: Practice With Arrays",
					content:
						"Use the practice-with-arrays project as the main APCS10 implementation checkpoint for traversal, accumulation, and simple array-return methods. The evidence should include a trace of how each loop visits elements and updates an answer.",
					projectLink: repo("APCS10-Practice-With-Arrays/starter"),
					solutionLink: repo("APCS10-Practice-With-Arrays/solution"),
					mediaLink: media(
						"apcs10-project-1-practice-with-arrays.mp4"
					)
				},
				{
					title: "Array Reference Pack",
					content:
						"Keep the array reference build available for quick review of indexing, `.length`, and default values. Use it when array syntax is blocking the more important reasoning about traversal, bounds, and mutation.",
					projectLink: repo("APCS10-Array-Reference/starter"),
					solutionLink: repo("APCS10-Array-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Random Mad Libs",
					content:
						"Use Random Mad Lib to connect arrays, random indexing, and lightweight string generation. The check is that every random index stays in bounds, every word bank has a clear role, and the generated output still reads as a complete sentence.",
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
						"Use matrix arithmetic as a more structured 2D-array build. The project should make dimension compatibility explicit, then trace at least one cell of the result so array indexing and arithmetic reasoning are connected.",
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
						"Use the ArrayList practice project as the main APCS11 implementation checkpoint for counting, filtering, mutation, and removal logic.",
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
						"Use FortuneTeller to combine ArrayLists, random selection, and controlled mutation of collection state. The interesting check is whether random choices remain valid as items are added, removed, or reused.",
					projectLink: repo("APCS11-Fortune-Teller-Class/starter"),
					solutionLink: repo("APCS11-Fortune-Teller-Class/solution"),
					mediaLink: media("apcs11-project-2-fortune-teller.mp4")
				},
				{
					title: "Project: Card Shuffler",
					content:
						"Use the starter and review pair for Card Shuffler to connect objects, ArrayLists, and algorithmic updates in a higher-signal build.",
					projectLink: repo("APCS11-Card-Shuffler/starter"),
					solutionLink: repo("APCS11-Card-Shuffler/solution"),
					mediaLink: media("apcs11-project-3-card-shuffler.mp4")
				},
				{
					title: "Free Response Practice",
					content:
						"Use the APCS11 FRQ practice build to bridge list manipulation and AP free-response expectations. The focus is writing correct list updates while explaining index choices, loop direction, and side effects clearly enough for partial credit.",
					projectLink: repo("APCS11-Free-Response-Practice/starter"),
					solutionLink: repo("APCS11-Free-Response-Practice/solution")
				},
				{
					title: "Card and Deck Classes",
					content:
						"Use the card-and-deck classes as a bridge build when object-list modeling needs more practice before APCS12 and APCS17.",
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
						"Use Check-In #4 as a cumulative review of wrapper classes, runtime analysis, recursion, sorting, and searching before the final AP prep stretch."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes computational steps, recursive reasoning, sorting traces, search preconditions, and wrapper-class behavior. Treat it as a readiness check for the algorithm-heavy final third of the course."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Use the GitHub-backed prompt bank for the full Check-In #4 review sequence. It should identify whether the remaining work should prioritize wrappers, recursion, sorting, searching, or AP-style trace explanations.",
					projectLink: repo("APCS-Check-in-4/starter"),
					solutionLink: repo("APCS-Check-in-4/solution"),
					mediaLink: media("apcs-check-in-4.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Inversion Counting",
					content:
						"Use inversion counting after the check-in when one more applied problem should connect sorting and runtime ideas. The important reasoning is how pair comparisons reveal disorder and why a brute-force count has quadratic cost.",
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
						"Use the runtime starter if the check-in shows weak step-counting or loop-cost reasoning. The goal is to connect a loop structure to growth rate before using Big-O notation as shorthand.",
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
						"Use Suits, Decks, and Hands as the main APCS12 build. The project connects wrapper-aware values, object collections, random selection, and clear class responsibilities in one card-modeling task.",
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
						"Use Deck Class when another wrapper-style object around a collection would help before APCS17. The useful check is whether cards are represented consistently and deck operations preserve valid collection state.",
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
					content:
						"Runtime should be measured in operations rather than wall-clock time so algorithms can be compared independent of machine speed."
				},
				{
					title: "Best, Average, and Worst Case",
					content:
						"Runtime should be described across favorable, typical, and unfavorable cases, especially for loops and search tasks. Use concrete input examples to explain why the same code can do different amounts of work."
				},
				{
					title: "Core Project: Runtime Analysis",
					content:
						"Use runtime analysis as the main APCS13 reasoning checkpoint. The goal is to count operations from code structure first, then summarize the growth rate with notation.",
					projectLink: repo("APCS13-Runtime-Analysis/starter"),
					solutionLink: repo("APCS13-Runtime-Analysis/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Linear Search Implementation",
					content:
						"Use the linear-search build to compare unsorted search, sorted early exits, and traceable search behavior. A complete explanation should cover found-at-front, found-at-end, and not-found cases.",
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
					content:
						"Selection sort is the repeated process of finding the next extreme element and moving it into the sorted section."
				},
				{
					title: "Insertion Sort",
					content:
						"Insertion sort uses repeated local insertion into an already sorted prefix, with special attention to best-case and worst-case inputs."
				},
				{
					title: "Core Project: Selection Sort",
					content:
						"Use the selection-sort build as the main APCS14 checkpoint because it gives the algorithm a clean invariant to describe while coding.",
					projectLink: repo("APCS14-Selection-Sort/starter"),
					solutionLink: repo("APCS14-Selection-Sort/solution"),
					mediaLink: media("apcs14-project-1-selection-sort.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Insertion Sort",
					content:
						"Use the insertion-sort build to contrast local shifting with global minimum selection. The useful trace shows the sorted prefix growing, the current value shifting left, and why nearly sorted input behaves differently from reverse-sorted input.",
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
					content:
						"Recursion depends on naming the base case, describing the smaller subproblem, and tracing the call stack on paper.",
					mediaLink: media("apcs15-recursion-1.png")
				},
				{
					title: "Stack Overflow and Tail Recursion",
					content:
						"Use the stack-overflow discussion to show why a missing or weak base case is not a minor bug but a structural failure.",
					mediaLink: media("apcs15-recursion-2.png")
				},
				{
					title: "Core Project: Tracing Recursion",
					content:
						"Use tracing recursion as the main APCS15 reasoning checkpoint. The expected evidence is a stack-frame trace that names the base case, the recursive call, and the order in which values return.",
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
					content:
						"Use the full recursion-practice build for factorials, powers, Fibonacci, cascades, and other classic recursive patterns. Each method should name its base case, smaller subproblem, and return path before being considered complete.",
					projectLink: repo("APCS15-Recursion-Practice/starter"),
					solutionLink: repo("APCS15-Recursion-Practice/solution"),
					mediaLink: media("apcs15-project-2-recursion-practice.mp4")
				},
				{
					title: "Project: Blob Erase",
					content:
						"Use Blob Erase to extend recursion into two-dimensional traversal and backtracking logic. The key explanation is why the current cell must be checked and marked before recursive calls expand to neighboring cells.",
					projectLink: repo("APCS15-Blob-Erase/starter"),
					solutionLink: repo("APCS15-Blob-Erase/solution"),
					mediaLink: media("apcs15-project-3-blob-erase.mp4")
				},
				{
					title: "Reference: Stack Overflow",
					content:
						"This reference targets the case where a recursive call is easy to write but the stopping condition is still hard to explain.",
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
					content:
						"Binary search is a fast search that only works because the data is sorted. Each comparison halves the remaining search space."
				},
				{
					title: "Merge Sort and Divide-and-Conquer",
					content:
						"Merge sort uses recursive splitting followed by deterministic merging of sorted halves. The merge step should be traced explicitly, not hand-waved."
				},
				{
					title: "Core Project: Binary Search",
					content:
						"Use the binary-search build for both iterative and recursive search structure. Each version should state the sorted-data precondition, the low/high bounds, the middle calculation, and the condition that proves the target is absent.",
					projectLink: repo("APCS16-Binary-Search/starter"),
					solutionLink: repo("APCS16-Binary-Search/solution"),
					mediaLink: media("apcs16-project-1-binary-search.mp4")
				},
				{
					title: "Merge Step Visual",
					content:
						"Use the merge visual together with the repo merge-sort project to separate the recursive split from the actual merge operation.",
					projectLink: repo("APCS16-Merge-Sort/starter"),
					solutionLink: repo("APCS16-Merge-Sort/solution"),
					mediaLink: media("am_10_merge.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Merge Sort",
					content:
						"Use the merge-sort build for the full divide-and-conquer implementation after the merge step itself is clear. The trace should separate splitting, recursive sorting, and merging so the `O(n log n)` structure is visible rather than memorized.",
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
					content:
						"Reserve full practice exams for timed work and use past FRQs throughout the final stretch so tracing, partial-credit thinking, and time management become routine."
				},
				{
					title: "Next Course Positioning",
					content:
						"Use the end of the course to identify the right next step: more advanced Java, C++, Python Level 2, or USACO depending on readiness and goals."
				},
				{
					title: "Core Project: Spaceships",
					content:
						"Use Spaceships as the first full capstone because it pulls together classes, collections, add/remove methods, and `toString()` design in one larger build.",
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
					content:
						"Use Elevens as the card-game capstone when the next challenge should involve stateful gameplay logic and collection updates.",
					projectLink: repo("APCS17-Elevens/starter"),
					solutionLink: repo("APCS17-Elevens/solution"),
					mediaLink: media("apcs17-master-project-2-elevens.mp4")
				},
				{
					title: "Master Project: Decode",
					content:
						"Use Decode as the lighter-weight string and object capstone built around encode/decode behavior and paired tower logic.",
					projectLink: repo("APCS17-Decode/starter"),
					solutionLink: repo("APCS17-Decode/solution"),
					mediaLink: media("apcs17-master-project-3-decode.mp4")
				},
				{
					title: "2022 FRQ and Scoring Guidelines",
					content:
						"Use the 2022 AP CS A FRQ set and official scoring guidelines for timed practice and post-run scoring conversations.",
					projectLink: AP_2022_FRQ,
					solutionLink: AP_2022_FRQ_SCORING
				},
				{
					title: "2020 Repo Practice Exam",
					content:
						"Keep the repo-backed practice exam available as an additional full-run benchmark. Use it when timing, stamina, and mixed-topic switching matter more than another isolated concept drill.",
					projectLink: repo("APCS-A-2020-Practice-Exam/starter"),
					solutionLink: repo("APCS-A-2020-Practice-Exam/solution")
				}
			]
		}
	]
};
