import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaCreationalModuleID,
	javaCreationalURL
} from "@/modules/javaCreationalResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path = "/course-assets/design-patterns-in-java/creational-checks.md#";
	return {
		...item,
		content: `${item.content}\n\n[Case inputs](${courseAssetViewerUrl(
			`${path + section}-inputs`
		)}) · [Project self-check](${courseAssetViewerUrl(
			`${path + section}-answers`
		)})`,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true
	};
}
export function completeJavaCreational(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPJ3 Creational Patterns I") return module;
	return {
		...module,
		id: javaCreationalModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj3-creational-patterns-i-curriculum-creational-patterns-i-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj3-creational-patterns-i-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj3-creational-patterns-i-curriculum-core-concepts"
				],
				title: "Creational Patterns I Core Concepts",
				learningPath: "core",
				content: `**Course flow:** Start with direct construction, identify the changing creation rule, then compare Factory Method, Abstract Factory, and Builder. Use the same report cases to test the choice. The selection, reflection, and decision-matrix activities are written design work; the Builder activity and core project share one implementation.

### Creation pressure and the simplest useful choice

A constructor creates an instance of its named class and establishes valid state. A named static factory is an ordinary static method that returns a value, such as Label.named("Ready"). A name can express intent or hide a representation. It can select a subtype or reuse an instance if its documented contract allows that. A fixed enum switch inside a static factory is a useful selection mechanism; the subclass hook described below is the distinct Factory Method pattern.

The design question is which decision changes. A single fixed configuration usually needs a constructor. A repeated validation rule belongs at a shared construction boundary. An existing inherited workflow that needs a replaceable creation step can use Factory Method. Two related product types that must change together can use Abstract Factory. Many optional settings can justify named Builder steps. Each extra interface or class adds navigation and maintenance cost. Select it for a concrete change pressure and testable rule.

A Supplier<T> has one abstract method, get(), with no input and a T result. It is a small injection seam for creation or retrieval. Its interface guarantees neither a fresh instance nor a non-null result. This lesson's supplied method adds null rejection and calls get exactly once. The caller may deliberately supply a cached immutable Label. A freshness requirement needs an explicit contract and a test.

### Complete comparison example

The following Main.java is complete Java 21 code. It uses small label and page values so creation choices can be read without solving the report assignment. The worked-code action imports this file, its tests, and README.

\`\`\`java
import java.util.Objects;
import java.util.function.Supplier;

/** Small, complete comparisons; no assignment implementation is hidden here. */
public class Main {
    public record Label(String text) {
        public Label { Objects.requireNonNull(text, "text"); }
        public static Label named(String text) { return new Label(text); }
    }
    /** A supplier may return a cached value. This method calls it exactly once. */
    public static Label supplied(Supplier<Label> supplier) {
        return Objects.requireNonNull(Objects.requireNonNull(supplier, "supplier").get(), "label");
    }
    public interface Token { String render(); }
    public record PlainToken(String text) implements Token {
        public PlainToken { Objects.requireNonNull(text, "text"); }
        public String render() { return text; }
    }
    public record BracketToken(String text) implements Token {
        public BracketToken { Objects.requireNonNull(text, "text"); }
        public String render() { return "[" + text + "]"; }
    }
    public abstract static class Creator {
        protected abstract Token create(String text);
        public final String display(String text) {
            Objects.requireNonNull(text, "text");
            Token token = Objects.requireNonNull(create(text), "token");
            return Objects.requireNonNull(token.render(), "rendered text");
        }
    }
    public static final class Brackets extends Creator {
        protected Token create(String text) { return new BracketToken(text); }
    }
    public interface Heading { String render(String text); }
    public interface Body { String render(String text); }
    /** Two product types vary together through one injected family. */
    public interface Theme { Heading heading(); Body body(); }
    public static final class PlainTheme implements Theme {
        public Heading heading() { return text -> Objects.requireNonNull(text, "text"); }
        public Body body() { return text -> Objects.requireNonNull(text, "text"); }
    }
    public static final class MarkedTheme implements Theme {
        public Heading heading() { return text -> "**" + Objects.requireNonNull(text, "text") + "**"; }
        public Body body() { return text -> "> " + Objects.requireNonNull(text, "text"); }
    }
    public static String themed(Theme theme, String heading, String body) {
        Objects.requireNonNull(theme, "theme");
        Objects.requireNonNull(heading, "heading");
        Objects.requireNonNull(body, "body");
        return theme.heading().render(heading) + "\\n" + theme.body().render(body);
    }
    /** The constructor is sufficient for a small fixed configuration. */
    public record Page(String title, String body, boolean emphasize) {
        public Page {
            Objects.requireNonNull(title, "title");
            Objects.requireNonNull(body, "body");
        }
        public String render() { return (emphasize ? "[" + title + "]" : title) + "\\n" + body; }
    }
    /** A fluent configuration builder, a common Java variation of Builder. */
    public static final class PageBuilder {
        private final String title;
        private String body = "";
        private boolean emphasize;
        public PageBuilder(String title) { this.title = Objects.requireNonNull(title, "title"); }
        public PageBuilder body(String value) { body = Objects.requireNonNull(value, "body"); return this; }
        public PageBuilder emphasize(boolean value) { emphasize = value; return this; }
        public Page build() { return new Page(title, body, emphasize); }
    }
    public static void main(String[] args) {
        System.out.println(new Label("Ready").text());
        System.out.println(Label.named("Ready").text());
        System.out.println(supplied(() -> new Label("Ready")).text());
        System.out.println(new Brackets().display("Ready"));
        System.out.println(themed(new MarkedTheme(), "Title", "Body"));
        System.out.println(new PageBuilder("Title").body("Body").emphasize(true).build().render());
    }
}
\`\`\`

A call to new Brackets().display("Ready") enters the inherited display workflow. It validates the input, dispatches create to Brackets, receives a BracketToken through the Token interface, and renders "[Ready]". This is Factory Method: the creator's stable operation uses an overridable creation hook. The subclass selects a product. It does not follow that every call must return a fresh object. An abstract hook is appropriate when a creator hierarchy is already useful; constructor injection of a Supplier or a plain renderer can be a smaller choice when only one collaborator varies.

Theme is an Abstract Factory interface. Its heading and body methods create two different product types. PlainTheme supplies an unmarked pair; MarkedTheme supplies a heading decorated with "**" and a body prefixed by "> ". Calling themed with one family keeps the choice together. An interface cannot prove semantic compatibility: an implementation that mixes an unmarked heading with a marked body still compiles. Product-family tests must protect that rule.

PageBuilder is a fluent configuration-builder variation commonly used in Java. It retains a required title, defaults body to "" and emphasize to false, returns itself from each setter, and creates a new Page value at build. Strings and the boolean are immutable, so an already built Page is independent of later builder changes. The builder itself is mutable and used within one thread. The classic Builder idea separates construction steps from the resulting representation; a fluent API is one useful variation, and a separate director is unnecessary for this small example. The direct Page constructor remains equally valid for a short, fixed configuration.

For new PageBuilder("T").body("B").emphasize(true), the first built page renders "[T]\\nB". Change the builder to body "Next" and emphasize false: the first page still renders "[T]\\nB"; a new page renders "T\\nNext". These are escaped strings: \\n denotes one LF character.

Compile the complete worked example in its own folder:

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The harness reports Creation worked contracts: 31 passed. Main prints Ready three times, [Ready], **Title**, > Body, [Title], and Body, each on its own line. These programs read no standard input and create no output file.

### The report project's contracts

The 14-file report pack has Main.java, ContractTests.java, README.md, sources.txt, and ten Java sources under src/creation. Keep that tree intact. Report retains the previous unit's immutable data contract: a non-null, nonblank, single-line title and a snapshot of a non-null list of non-null single-line strings. Empty bodies and blank body lines are allowed. Null values cause NullPointerException; embedded CR/LF or a blank title causes IllegalArgumentException. A caller's later list edits cannot change the report.

Style is PLAIN or BOXED. PLAIN renders title followed by LF and each body item followed by LF. BOXED renders "[" + title + "]" followed by LF, then "| " + line + " |" followed by LF for each item. An empty body still has its heading. A blank body item renders "|  |\\n" in BOXED. These are this exercise's text layouts.

Renderer exposes style() and render(Report). Heading and BodyLine each expose stable, non-null Style metadata and a non-null rendering result. Families.Factory creates a Heading and a BodyLine. The supplied PlainFactory returns plain products; BoxedFactory must return the boxed pair. FamilyRenderer rejects null products, null styles, or null rendered text. It rejects a mixed pair with IllegalArgumentException before rendering. These checks require reliable product metadata; a style tag alone cannot prove that an arbitrary plugin's rendered text is correct.

RendererFactory.forStyle uses a fixed switch and delegates to RendererFactory.from(Families.Factory). That is a simple static factory. Exporters.Exporter separately implements Factory Method with protected createRenderer(). Its final export method validates the report before calling the hook, calls the hook once, rejects a null renderer or result, and propagates a creation or rendering exception. Plain and Boxed select the corresponding renderer.

For Report("T", ["one"]), a boxed export is "[T]\\n| one |\\n". The call trace is export -> Boxed.createRenderer -> RendererFactory.forStyle -> BoxedFactory heading/bodyLine -> FamilyRenderer.render. Passing a null report fails before the hook is called. A mixed heading/body pair fails at FamilyRenderer construction. No retry, disk write, or network request is part of this contract.

### Builder state and validity

ReportJob is an immutable record of report, style, includeCount, and footer. Its constructor validates report/style/footer. Builder requires a Report; its defaults are PLAIN, false, and "". style, includeCount, and footer return that same builder. Null style or footer is rejected immediately. A footer can be empty or one line; CR/LF is rejected immediately with IllegalArgumentException. build creates a fresh ReportJob snapshot. It does not reset the builder.

ReportJob.render first renders the report in the selected style. If includeCount is true it appends "Lines: N\\n", where N is the body-item count, including blank items. If footer is nonempty it appends footer plus LF. The count and footer are unboxed. With title "Notes", body ["one", "two"], BOXED, true, and "End", the output is:

\`\`\`text
[Notes]
| one |
| two |
Lines: 2
End
\`\`\`

A state trace records each option before build and the separate resulting value. Change the same builder after building, and verify that an older job is unchanged. The supplied immutable Report and String values make this snapshot safe. A future mutable option would require its own ownership rule and defensive copy.

### Implementation and evidence

Seven core methods are unfinished: BoxedFactory.heading and bodyLine, Boxed.createRenderer, and Builder.style, includeCount, footer, and build. Complete the family and hook methods first, then use the factories harness. The Builder activity and core project reopen the same saved learner project. Reference actions use a separate project; retain the original attempt and design table.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests factories
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

The compiler reads the twelve Java paths in sources.txt and writes packaged classes under classes. Factories reports 635 passed after its stage; completed core reports 2101 passed. Main prints the Notes example above. The untouched starter compiles, then the harness names unfinished work. The IDE Run action displays these native commands; execute the full checks with Java 21 after exporting the saved ZIP.

The optional toBuilder method returns a fresh Builder carrying all four values from a job. Core checks and Main work before that extension is implemented. The complete harness, java -cp classes ContractTests, also checks this copy and reports 2105 passed. Tests verify text, call order, compatibility, defaults, invalid settings, and snapshot behavior. Keep the rejected alternative and cost alongside the passing results; output alone does not justify a pattern choice.

[Supplier API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/Supplier.html) specifies the supplier contract. [Oracle's factory-based DAO example](https://www.oracle.com/java/technologies/dataaccessobject.html) illustrates choosing a related family through a factory boundary.
`,
				contentKind: "reading",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaCreationalURL("example"),
				solutionLink: javaCreationalURL("solution")
			},
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-curriculum-builder",
					title: "Builder",
					learningPath: "core",
					content: `Continue the report starter and implement Builder.style, includeCount, footer, and build. Use the supplied ReportJob constructor as the validity boundary, while rejecting bad setter input immediately. Each setter returns the same builder; each build returns a new immutable job. Defaults are PLAIN, false, and "".

Trace Report("T", ["one"]) through a default build, then style(BOXED).includeCount(true).footer("End"), then another build. Change the builder to footer("Next") and includeCount(false). Compare all three saved jobs, and try a null style, null footer, and footer "bad\\nline". Complete the two family methods and boxed creation hook before running ContractTests core. **Completion evidence:** Keep the option-state table, immutable outputs, invalid-input results, and a comparison with new ReportJob(report, Style.BOXED, true, "End").`,
					ideImport: true,
					projectLink: javaCreationalURL("starter"),
					solutionLink: javaCreationalURL("solution")
				},
				"builder"
			),
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-curriculum-pattern-selection-drill-factory-or-builder",
					title: "Pattern Selection Drill: Factory or Builder?",
					learningPath: "core",
					content: `Complete a selection worksheet for six given pressures: A, one fixed Page("T", "B", false); B, PLAIN/BOXED chosen from a fixed enum without a creator hierarchy; C, an existing export workflow whose subclasses supply different renderer products; D, a heading and body layout that must change together; E, a report with independently optional count and footer settings; F, a test that supplies one in-memory Label creation/retrieval function.

For each, name the varying decision, choose the smallest useful construction mechanism, identify its cost, and give a test. Distinguish a static factory from an overridable Factory Method, and a two-product family from a single product. More than one design can be justified when the assumptions differ. **Completion evidence:** Save six decisions with explicit assumptions and one case where direct construction remains sufficient.`
				},
				"selection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-curriculum-reflection-question-how-much-creation-logic-is-too-much",
					title: "Reflection Question: How Much Creation Logic Is Too Much?",
					learningPath: "core",
					content: `Compare two creation sites. Case A has three call sites that each write new Page("T", "B", false), with no varying validation or implementation. Case B has three call sites selecting a plain heading and plain body or a boxed heading and boxed body; one site accidentally pairs a plain heading with a boxed body.

Explain the concrete maintenance pressure in each, the smallest useful change, the extra navigation that change adds, and a test that would expose the reported failure. Then state one future change that could justify revisiting Case A. **Completion evidence:** Keep a paragraph for each case, a mixed-family failure trace, and the condition under which the decision would change.`
				},
				"reflection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-curriculum-creational-pattern-decision-matrix",
					title: "Creational Pattern Decision Matrix",
					learningPath: "core",
					content: `Build a decision matrix with rows constructor, named static factory, Supplier injection, Factory Method, Abstract Factory, and fluent Builder. For each row record: changing decision; who supplies it; default/invalid-input contract; smallest representative test; and cost.

Use only the supplied Label/Page comparison and report project as evidence. Include a cached Supplier case, a creator whose hook returns null, a mixed Heading/BodyLine pair, and a builder changed after an earlier build. **Completion evidence:** Keep the completed matrix and choose the two simplest mechanisms for a fixed Page configuration and a test-only creation seam. This is a design worksheet; the reference Java API is supporting reading.`
				},
				"matrix"
			),
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-curriculum-core-project-creational-patterns-i",
					aliases: [
						"design-patterns-in-java-dpj3-creational-patterns-i-curriculum-core-project",
						"dpj3-creational-patterns-i-core-project",
						"design-patterns-in-java-dpj3-creational-patterns-i-curriculum-dpj3-creational-patterns-i-core-project"
					],
					title: "Core Project: Creational Patterns I",
					learningPath: "core",
					content: `Complete the report project's seven core methods: the two BoxedFactory product methods, Boxed.createRenderer, and the four Builder methods. Preserve the supplied interfaces and deterministic text contract. PLAIN and BOXED must select compatible Heading/BodyLine products. Exporter validates input before one creation call, rejects null collaborators/results, and propagates failures. The Builder defaults to PLAIN, no count, and empty footer, validates options, returns itself from setters, and builds independent immutable values.

Keep all fourteen files and the package tree. Export the saved learner attempt, then run:

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests factories
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

The two stages report 635 and 2101 passed. Main prints [Notes], | one |, | two |, Lines: 2, and End on separate lines. Core must remain usable while optional toBuilder is unfinished. Predict the empty body, one blank body line, mixed product metadata, and builder reuse before checking output. **Completion evidence:** Preserve the implementation, exact output/error table, creation-call trace, builder-state trace, and a justified constructor/static-factory alternative.`,
					ideImport: true,
					projectLink: javaCreationalURL("starter"),
					solutionLink: javaCreationalURL("solution")
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-supplemental-understanding-check-creational-patterns-i",
					aliases: [
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-dpj3-creational-patterns-i-diagnostic-checkpoint",
						"diagnostic-checkpoint-creational-patterns-i",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-diagnostic-checkpoint-creational-patterns-i",
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-understanding-check"
					],
					title: "Understanding Check: Creational Patterns I",
					learningPath: "choice",
					content: `Diagnose four proposals. A: any method named create is automatically Factory Method. B: two unrelated factory classes automatically establish a compatible family. C: a final field pointing at a mutable list guarantees immutable built data. D: Supplier.get must return a fresh non-null object.

For each, use a specific type or method from the reading, state the contract that actually holds, and propose one test or ownership rule. **Completion evidence:** Keep four reasoned corrections and one case where no additional pattern is needed. This optional check is written work.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-supplemental-creational-patterns-i-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-transfer-practice",
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-transfer-practice-creational-patterns-i"
					],
					title: "Creational Patterns I Transfer Practice",
					learningPath: "choice",
					content: `Use this new-domain snippet inside a Java main method as a creation/retrieval worksheet:

\`\`\`java
record Ticket(int id) {}
Ticket cached = new Ticket(7);
java.util.function.Supplier<Ticket> shared = () -> cached;
int[] next = {7};
java.util.function.Supplier<Ticket> fresh = () -> new Ticket(next[0]++);
Ticket a = shared.get(), b = shared.get();
Ticket c = fresh.get(), d = fresh.get();
\`\`\`

Predict a == b, c == d, all four ids, and next[0]. Then design an injected Ticket supplier for a consumer that calls get once per request. State whether caching is allowed. If fresh identity or increasing ids are required, make each requirement explicit and propose a test; also consider a supplier returning null. **Completion evidence:** Keep the value/identity table, call-count rule, invalid-result rule, and an explanation of why a new creator hierarchy is optional for this seam.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj3-creational-patterns-i-supplemental-creational-patterns-i-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-extension-practice",
						"design-patterns-in-java-dpj3-creational-patterns-i-supplemental-extension-practice-creational-patterns-i"
					],
					title: "Creational Patterns I Extension Practice",
					learningPath: "challenge",
					content: `Complete core first, then continue the same saved report project. Implement ReportJob.toBuilder so each call creates an independent Builder containing the same report, style, includeCount, and footer. Preserve every option before the caller changes any.

Start with Report("T", ["one"]) and a job configured BOXED, true, "End". An immediate copy.build must equal the original. Change only the copy's style to PLAIN and footer to "Next"; its count remains true and the original stays unchanged. Two calls to toBuilder return distinct builders. Run the core harness before and after (2101 passed), then java -cp classes ContractTests (2105 passed). **Completion evidence:** Retain both outputs, option snapshots, a fresh-builder identity check, and a case that would detect a forgotten count option.`,
					ideImport: true,
					projectLink: javaCreationalURL("starter"),
					solutionLink: javaCreationalURL("solution")
				},
				"extension"
			)
		]
	};
}
