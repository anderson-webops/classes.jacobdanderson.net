import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaFoundationsModuleID,
	javaFoundationsURL
} from "@/modules/javaFoundationsResources";

function resources(section: string) {
	const path =
		"/course-assets/design-patterns-in-java/foundations-checks.md#";
	return `\n\n[Case inputs](${courseAssetViewerUrl(
		`${path + section}-inputs`
	)}) · [Project self-check](${courseAssetViewerUrl(
		`${path + section}-answers`
	)})`;
}
function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	return {
		...item,
		content: item.content + resources(section),
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true
	};
}
export function completeJavaFoundations(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPJ2 Java Design Foundations") return module;
	return {
		...module,
		id: javaFoundationsModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj2-java-design-foundations-curriculum-java-design-foundations-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj2-java-design-foundations-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj2-java-design-foundations-curriculum-core-concepts"
				],
				title: "Java Design Foundations Core Concepts",
				content: `**Course flow:** Compare the supplied ReportBlob with a package-based report publisher, trace one publication through its collaborators, complete the three core methods, and choose optional analysis or uppercase-title work. Predict output and failure paths before checking the worked answers.

### A complete constructor-injection example

A Message contains one non-null immutable String. Sender receives its Sink through the constructor and writes the message once. The demonstration supplies an in-memory destination with a method reference. This first example permits empty and multiline strings; the report project below adds its own line and list-ownership rules.

\`\`\`java
import java.util.Objects;
public class Main {
    public record Message(String text) {
        public Message { Objects.requireNonNull(text, "text"); }
    }
    @FunctionalInterface
    public interface Sink { void write(String text); }
    public static final class Sender {
        private final Sink sink;
        public Sender(Sink sink) { this.sink = Objects.requireNonNull(sink, "sink"); }
        public void send(Message message) {
            sink.write(Objects.requireNonNull(message, "message").text());
        }
    }
    public static String demonstration(String text) {
        StringBuilder recorded = new StringBuilder();
        new Sender(recorded::append).send(new Message(text));
        return recorded.toString();
    }
    public static void main(String[] args) {
        System.out.println(demonstration("Ready"));
    }
}
\`\`\`

Open the worked example to import Main.java, ContractTests.java, and README.md. Use Java 21 in its extracted folder:

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The harness reports Seam worked contracts: 14 passed, and Main prints Ready. Changing the message to Checked produces Checked. A null message is rejected before a sink call, and a sink failure propagates. The method reference recorded::append implements the single Sink operation. Run displays this example's native commands. Keep this example and the report project in separate folders because both define Main.

### Contracts and responsibility boundaries

The project formats a report and passes the finished text to a destination. Its core contract preserves every title and body character, adds LF line separators, and performs one destination call after successful formatting. The supplied before-refactor class owns validation, formatting, and console output in one place:

\`\`\`java
package report.legacy;
import java.util.List;
import java.util.Objects;

/** Before-refactor example: validation, formatting and output share one class. */
public final class ReportBlob {
    private ReportBlob() {}
    public static String render(String title, List<String> lines) {
        Objects.requireNonNull(title, "title");
        Objects.requireNonNull(lines, "lines");
        if (title.isBlank() || title.contains("\\n") || title.contains("\\r"))
            throw new IllegalArgumentException("invalid title");
        StringBuilder text = new StringBuilder(title).append('\\n');
        for (String line : lines) {
            Objects.requireNonNull(line, "line");
            if (line.contains("\\n") || line.contains("\\r"))
                throw new IllegalArgumentException("invalid body line");
            text.append(line).append('\\n');
        }
        return text.toString();
    }
    public static void print(String title, List<String> lines) {
        System.out.print(render(title, lines));
    }
}
\`\`\`

Changing the output destination currently leads back to this class. The refactor gives valid data, formatting, publication order, and destination effects separate owners. This improves cohesion when a class's methods serve one responsibility. Lower coupling means a caller knows the contract it needs rather than the concrete destination's details. Additional types have a navigation and wiring cost; a small fixed print-only script can reasonably keep a function.

An interface declares behavior that multiple implementations can supply. A class can implement several interfaces. ReportFormatter promises one format operation; ReportSink promises one write operation. Their method documentation specifies non-null values and failure behavior. The compiler checks signatures, while tests check ownership, ordering, and effects.

An abstract class can retain instance state, constructors, and shared method bodies while leaving abstract methods for subclasses to implement. It cannot be instantiated directly, and a class can extend only one class. A shared algorithm with stable inherited state can justify such a base class. These independent report collaborators need replaceable operations and test doubles, so interfaces fit their boundary without a shared superclass. final prevents a class from being subclassed. private hides a member inside its declaring class; a top-level class with no visibility modifier is package-private. public makes the ports and adapters usable across this project's packages.

### Immutable data requires ownership

A Report is a record with a non-null, nonblank, single-line title and a non-null list of non-null, single-line body strings. Embedded CR or LF is invalid. Empty bodies and blank body items are allowed. Null values cause NullPointerException; other invalid text causes IllegalArgumentException.

A record provides component accessors and value equality with final component fields. That is shallow immutability: a final reference can still point to a mutable list. This constructor takes a list snapshot with List.copyOf. The returned list is unmodifiable and its String elements are immutable, so later caller-list changes cannot alter this report.

\`\`\`java
package report.domain;
import java.util.List;
import java.util.Objects;

/** Immutable single-line title and snapshot of immutable body strings. */
public record Report(String title, List<String> lines) {
    public Report {
        Objects.requireNonNull(title, "title");
        Objects.requireNonNull(lines, "lines");
        if (title.isBlank() || title.contains("\\n") || title.contains("\\r"))
            throw new IllegalArgumentException("title must be a nonblank single line");
        for (String line : lines) {
            Objects.requireNonNull(line, "line");
            if (line.contains("\\n") || line.contains("\\r"))
                throw new IllegalArgumentException("each body item must be a single line");
        }
        lines = List.copyOf(lines);
    }
}
\`\`\`

Given input = new ArrayList<>(List.of("Ready")), construct Report("Weekly", input), then append "Changed" to input. The report still has one line, "Ready". Adding through report.lines() throws UnsupportedOperationException. report.title() is its accessor; direct access to report.title from another class is private and fails compilation.

### Ports, adapters, and constructor injection

Each file's package declaration corresponds to its directory below src. domain has no project-package dependencies. ports refers to domain. application refers to domain and ports. adapters implements ports. Main chooses concrete collaborators at the composition boundary. An import from application to ConsoleSink would reverse the intended boundary.

The two ports contain the operations the application needs:

\`\`\`java
package report.ports;
import report.domain.Report;
@FunctionalInterface
public interface ReportFormatter {
    /** Return non-null text for a non-null report; keep the report unchanged. */
    String format(Report report);
}
\`\`\`

\`\`\`java
package report.ports;
@FunctionalInterface
public interface ReportSink {
    /** Consume one complete non-null formatted document or propagate a failure. */
    void write(String text);
}
\`\`\`

TextFormatter preserves the title and body and appends LF after each logical line. A report with title "T" and no body formats as "T\\n"; one blank body item formats as "T\\n\\n". These strings use escaped notation for LF; the actual output contains line breaks.

\`\`\`java
package report.adapters;
import java.util.Objects;
import report.domain.Report;
import report.ports.ReportFormatter;

public final class TextFormatter implements ReportFormatter {
    @Override
    public String format(Report report) {
        Objects.requireNonNull(report, "report");
        StringBuilder text = new StringBuilder(report.title()).append('\\n');
        for (String line : report.lines()) text.append(line).append('\\n');
        return text.toString();
    }
}
\`\`\`

Constructor injection supplies collaborators instead of constructing a console destination inside the application. ReportPublisher retains them in private final fields. publish validates the report, formats it once, rejects a null formatted result, and calls the sink once. Formatter failure prevents a sink call. Sink failure propagates; the contract supplies no retry or rollback guarantee.

\`\`\`java
package report.application;
import java.util.Objects;
import report.domain.Report;
import report.ports.ReportFormatter;
import report.ports.ReportSink;

public final class ReportPublisher {
    private final ReportFormatter formatter;
    private final ReportSink sink;
    public ReportPublisher(ReportFormatter formatter, ReportSink sink) {
        this.formatter = Objects.requireNonNull(formatter, "formatter");
        this.sink = Objects.requireNonNull(sink, "sink");
    }
    public void publish(Report report) {
        Objects.requireNonNull(report, "report");
        String text = Objects.requireNonNull(formatter.format(report), "formatted text");
        sink.write(text);
    }
}
\`\`\`

ConsoleSink implements ReportSink with System.out.print. Main assembles that real adapter and the text formatter:

\`\`\`java
import java.util.List;
import report.adapters.ConsoleSink;
import report.adapters.TextFormatter;
import report.application.ReportPublisher;
import report.domain.Report;
public class Main {
    public static void main(String[] args) {
        Report report = new Report("Weekly report", List.of("Ready", "Checked"));
        new ReportPublisher(new TextFormatter(), new ConsoleSink()).publish(report);
    }
}
\`\`\`

The output is Weekly report, Ready, Checked on separate lines. A call trace is Main -> ReportPublisher.publish -> TextFormatter.format -> ConsoleSink.write. The application sees ReportSink, so a test can supply a recorder that stores strings in memory. ContractTests includes a private Recorder class, verifies one call and the exact text, and injects a throwing formatter to verify zero destination calls. Its tests use no network, file, or clock effects. A functional interface with one abstract method also accepts lambdas, such as text -> recorded.add(text); the caller still uses the same port contract.

### Modern Java choices

The Report record represents data. PreviewMode is a small fixed enum. LanguageChoices.Outcome is a sealed interface permitting only Published and Refused records; an exhaustive Java 21 switch handles both alternatives. This preview has an additional, separate rule: an empty body returns Refused("No body"). TITLE_ONLY returns title plus LF without calling a formatter; FULL calls the supplied formatter. Null arguments and null formatted text are rejected.

This is a complete worked example of the type choices and a lambda:

\`\`\`java
package report.examples;
import java.util.List;
import java.util.Objects;
import report.domain.Report;
import report.ports.ReportFormatter;

/** Worked language alternatives; the preview rule requires a nonempty body. */
public final class LanguageChoices {
    private LanguageChoices() {}
    public enum PreviewMode { TITLE_ONLY, FULL }
    public sealed interface Outcome permits Published, Refused {}
    public record Published(String text) implements Outcome {
        public Published { Objects.requireNonNull(text, "text"); }
    }
    public record Refused(String reason) implements Outcome {
        public Refused { Objects.requireNonNull(reason, "reason"); }
    }
    public static Outcome preview(Report report, ReportFormatter formatter, PreviewMode mode) {
        Objects.requireNonNull(report, "report");
        Objects.requireNonNull(formatter, "formatter");
        Objects.requireNonNull(mode, "mode");
        if (report.lines().isEmpty()) return new Refused("No body");
        return new Published(mode == PreviewMode.TITLE_ONLY ?
            report.title() + "\\n" : Objects.requireNonNull(formatter.format(report), "text"));
    }
    public static String describe(Outcome result) {
        return switch (Objects.requireNonNull(result, "result")) {
            case Published value -> "Published: " + value.text();
            case Refused value -> "Refused: " + value.reason();
        };
    }
    public static String lambdaExample() {
        ReportFormatter heading = report -> report.title() + "\\n";
        return heading.format(new Report("Weekly report", List.of("Ready")));
    }
}
\`\`\`

A new external class implementing Outcome fails compilation because it is outside the permitted family. A new formatter implementation remains possible through the open ReportFormatter port. Use that difference deliberately: a closed set of results suits exhaustive handling, while a plugin or test seam may need an open interface. Builder, State, and Visitor add machinery that these small data, fixed-mode, and closed-result cases do not require.

[Records](https://docs.oracle.com/en/java/javase/21/language/records.html), [record API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html), [sealed interfaces](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.1.2), and [List.copyOf](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#copyOf(java.util.Collection)) document the language and collection contracts.

### Build and completion workflow

The core project’s starter button opens a confirmed 13-file import: Main.java, ContractTests.java, README.md, sources.txt, and nine Java files under src/report. Preserve the src tree and use Java 21 from the extracted project root:

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

The compiler's -d classes option creates package directories for compiled output. sources.txt names every Java source; it works without shell-specific wildcard expansion. The core harness reports Core foundations contracts: 649 passed. Main reads no standard input and creates no answer file. Edit its report data to explore another case. Run in the site IDE displays these native build instructions.

The starter has three core methods to implement: Report construction, TextFormatter.format, and ReportPublisher.publish. The optional UppercaseTitleFormatter method is reached by java -cp classes ContractTests, which checks both core and extension and reports Complete foundations contracts: 654 passed. A finished core remains runnable while that optional method is unfinished.

Keep the first learner attempt separate from the reference. The refactoring exercise, core project, and optional extension reuse the same learner project. Reference actions share a separate project. Preserve a before/after responsibility map, dependency arrows, and a trace of one successful and one refused or failed path; passing output alone does not establish a useful design.
`,
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "core",
				ideImport: true,
				projectLink: javaFoundationsURL("example"),
				solutionLink: javaFoundationsURL("solution")
			},
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-curriculum-refactoring-exercise-untangle-a-responsibility-blob",
					title: "Refactoring Exercise: Untangle a Responsibility Blob",
					learningPath: "core",
					content: `Study the supplied ReportBlob, whose render and print methods share validation, formatting, and console-output concerns. Preserve the observable text contract while moving validity and list ownership to Report, formatting to TextFormatter, and call order to ReportPublisher. The two port interfaces and console adapter are supplied.

Open the starter and implement the three named core methods. Keep Main as the composition boundary. For Report("Weekly report", ["Ready", "Checked"]), predict the exact output, including the final LF, before comparing the old render and new formatter. Repeat with title "T" and an empty body. **Completion evidence:** Save the passing core attempt, a before/after responsibility map, both exact outputs, and one dependency you removed. The core project continues this same saved attempt.`,
					ideImport: true,
					projectLink: javaFoundationsURL("starter"),
					solutionLink: javaFoundationsURL("solution")
				},
				"blob"
			),
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-curriculum-design-review-favoring-explicit-package-structure",
					title: "Design Review: Favoring Explicit Package Structure",
					learningPath: "core",
					content: `Use the supplied package tree. List the permitted project-package imports for domain, ports, application, and adapters. Identify where Main selects concrete types and why application depends on ReportSink rather than ConsoleSink.

Evaluate three proposed edits: application imports ConsoleSink and constructs it inside publish; Report exposes its mutable caller list; an external caller accesses report.title directly instead of title(). Explain each effect on the declared boundary, ownership, or visibility. Also explain why making ConsoleSink package-private would prevent root-package Main from constructing it. **Completion evidence:** Produce the dependency-arrow diagram and four diagnoses using exact source types.`,
					ideImport: true,
					solutionLink: javaFoundationsURL("solution")
				},
				"packages"
			),
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-curriculum-reflection-question-what-makes-a-good-seam-in-java",
					title: "Reflection Question: What Makes a Good Seam in Java?",
					learningPath: "core",
					content: `Compare two supplied contexts. A one-off script always prints one fixed report to the console. A maintained application must verify formatting without console, network, disk, or clock effects and may send the finished document to different destinations.

For each, choose a plain function, an interface collaborator, or an abstract base class. State the requirement, preserved behavior, cost, and a test. In the maintained application, explain how a recorder implementing ReportSink creates a test seam while ReportPublisher's constructor makes its dependency visible. **Completion evidence:** Keep two decision records and the expected sink-call counts after successful formatting and after a throwing formatter.`
				},
				"seam"
			),
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-curriculum-modern-java-types-before-classic-pattern-machinery",
					title: "Modern Java Types Before Classic Pattern Machinery",
					learningPath: "core",
					content: `Inspect Report, PreviewMode, Outcome, Published, Refused, and lambdaExample in the worked LanguageChoices file. Predict TITLE_ONLY and FULL for Report("T", ["one"]), then FULL for Report("T", []). The normal report formatter accepts an empty body; the preview's separate rule requires a body.

Explain why a record alone does not freeze a mutable list, why the enum suits two fixed preview modes, and why a sealed result supports an exhaustive switch. Contrast the closed Outcome family with the open ReportFormatter port. **Completion evidence:** Save the three exact result values, the lambda result, and one reason a Builder, State object hierarchy, or Visitor would add unnecessary machinery to each small case.`,
					ideImport: true,
					solutionLink: javaFoundationsURL("solution")
				},
				"types"
			),
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-curriculum-package-dependency-and-test-seam-contract",
					title: "Package Dependency and Test-Seam Contract",
					learningPath: "core",
					content: `Trace the ContractTests recorder and the injected formatter through ReportPublisher.publish. For a valid report and a formatter returning "fake\\n", expect one formatter call and one recorder write of that exact text. A formatter that throws or returns null must leave the recorder at zero calls. A throwing sink propagates its failure; no retry is promised.

Use the reference to inspect the existing tests, then describe a fake implementation in terms of ReportSink's single method. Draw the domain/ports/application/adapter arrows and verify that domain does not import a console or test implementation. **Completion evidence:** Keep a call-count table for success, formatter exception, null formatted result, and sink exception, plus the fake's role in the dependency diagram.`,
					ideImport: true,
					solutionLink: javaFoundationsURL("solution")
				},
				"contract"
			),
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-curriculum-core-project-java-design-foundations",
					aliases: [
						"design-patterns-in-java-dpj2-java-design-foundations-curriculum-core-project",
						"dpj2-java-design-foundations-core-project",
						"design-patterns-in-java-dpj2-java-design-foundations-curriculum-dpj2-java-design-foundations-core-project"
					],
					title: "Core Project: Java Design Foundations",
					learningPath: "core",
					content: `Complete the report publisher's three core tasks in the shared starter. Report validates title/list/body values and takes an immutable snapshot. TextFormatter preserves the title and each body item with LF separators and a final LF. ReportPublisher rejects null input, formats once, rejects a null result, and writes once through the injected sink. Formatter failure prevents a write; sink failure propagates.

Keep all 13 files and package declarations. Download the saved attempt and run:

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

The untouched starter compiles and identifies unfinished core work. A finished core reports 649 passed, and Main prints Weekly report, Ready, Checked on separate lines. UppercaseTitleFormatter remains optional and does not block those commands. Predict title "T" with no body, one blank line, and a mutable caller list changed after construction. **Completion evidence:** Preserve the implementation, case table, ownership explanation, and two publication traces before consulting the separate reference.`,
					ideImport: true,
					projectLink: javaFoundationsURL("starter"),
					solutionLink: javaFoundationsURL("solution")
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-supplemental-understanding-check-java-design-foundations",
					aliases: [
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-dpj2-java-design-foundations-diagnostic-checkpoint",
						"diagnostic-checkpoint-java-design-foundations",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-diagnostic-checkpoint-java-design-foundations",
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-understanding-check"
					],
					title: "Understanding Check: Java Design Foundations",
					learningPath: "choice",
					content: `This is a diagnosis worksheet. Case A stores a caller-owned ArrayList in a record without copying it; the caller then adds a second line. Case B constructs ConsoleSink inside ReportPublisher. Case C formats first, then writes the resulting document twice. Case D tests a formatter with a recorder in memory.

Classify the ownership, dependency, call-count, or testing implication of each. Explain public ports, private fields, package-private types, and final classes using the supplied packages. **Completion evidence:** Give the observed consequence, smallest useful repair, and one test for each case. No additional executable pack is assigned.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-supplemental-java-design-foundations-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-transfer-practice",
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-transfer-practice-java-design-foundations"
					],
					title: "Java Design Foundations Transfer Practice",
					learningPath: "choice",
					content: `This is a contract-and-design worksheet for an in-memory destination. The new destination retains each complete string passed to ReportSink.write. The caller publishes the same Report("T", ["one"]) twice. Existing formatting and publisher code remain unchanged.

Sketch the new destination's state and single method, its construction at Main, and the expected retained entries and call count. Then specify how an exception on the second write would behave under the existing no-retry contract. **Completion evidence:** Save the two-entry result table, dependency arrows, failure explanation, and one case where a plain list plus method reference would be sufficient. The supplied recorder is a worked model; this worksheet does not promise an additional client executable.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj2-java-design-foundations-supplemental-java-design-foundations-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-extension-practice",
						"design-patterns-in-java-dpj2-java-design-foundations-supplemental-extension-practice-java-design-foundations"
					],
					title: "Java Design Foundations Extension Practice",
					learningPath: "challenge",
					content: `Complete the core project first, then continue the same saved learner project. Implement only UppercaseTitleFormatter.format. Reject null input and uppercase only the title with Locale.ROOT, preserving every body character, blank line, and final LF. The existing ReportFormatter interface, ReportPublisher, and clients keep their contract.

Run the core harness before and after; both must report 649 passed. Then run java -cp classes ContractTests; the complete reference reports 654 passed. Predict Report("Weekly report", ["Ready", "Checked"]), Report("i", ["body"]) under English and Turkish default locales, and title "T" with an empty body. **Completion evidence:** Preserve the optional implementation, exact output table, unchanged core result, and an explanation of why this formatter is one new adapter rather than a new publisher subclass.`,
					ideImport: true,
					projectLink: javaFoundationsURL("starter"),
					solutionLink: javaFoundationsURL("solution")
				},
				"extension"
			)
		]
	};
}
