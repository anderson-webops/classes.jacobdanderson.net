import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaBoundaryModuleID,
	javaBoundaryURL
} from "@/modules/javaBoundaryResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path = "/course-assets/design-patterns-in-java/boundary-checks.md#";
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
export function completeJavaBoundary(module: RawCourseModule): RawCourseModule {
	if (module.title !== "DPJ4 Creational Patterns II and Boundary Patterns")
		return module;
	return {
		...module,
		id: javaBoundaryModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-creational-patterns-ii-and-boundary-patterns-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-core-concepts"
				],
				title: "Creational Patterns II and Boundary Patterns Core Concepts",
				learningPath: "core",
				content: `**Course flow:** Begin with a configured object and state its ownership rules. Compare an explicit Prototype copy with rebuilding the value. Then separate Adapter's contract translation from Facade's workflow boundary, and choose dependency lifetimes explicitly. The application check and core project share one saved quote implementation; reflection and boundary-risk work are written analyses.

### Copying a configured object

Prototype creates a new object from an existing configured object. A copy contract must say which identity is new, which values remain equal, and which mutable objects are shared or owned independently. The pattern can use an explicit copy method or constructor. It does not require Object.clone or a class hierarchy.

A shallow copy duplicates the outer object while retaining references to nested objects. That is enough when the referenced data is immutable and sharing is intended. A deep copy also duplicates the mutable parts whose ownership must be independent. Copying an entire graph blindly can duplicate shared services or fail on cycles. Choose the required ownership boundary first.

In the worked example below, Draft owns a mutable list of immutable Strings. Its copy makes a fresh list; sharing the String values is safe. snapshot creates an immutable Note whose list cannot be changed and whose elements are immutable. Adding to the copy leaves the original unchanged. In the quote assignment, Line objects themselves are mutable, so a new list alone is insufficient: each owned Line must also be copied.

Object.clone performs a field copy by default, which leaves referenced objects shared. Cloneable marks eligibility for that mechanism; it does not define a public copy API or supply a deep-copy policy. This unit uses explicit constructors so validation and ownership remain visible.

### A complete boundary example

This complete Main.java runs separately from the quote assignment. It includes a mutable prototype, a foreign text interface, a typed Adapter, a small Facade, and an immutable enum instance.

\`\`\`java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class Main {
    private static String line(String value) {
        Objects.requireNonNull(value, "line");
        if (value.contains("\\n") || value.contains("\\r"))
            throw new IllegalArgumentException("line must not contain CR or LF");
        return value;
    }
    public record Note(String title, List<String> lines) {
        public Note {
            title = line(title);
            if (title.isBlank()) throw new IllegalArgumentException("title must not be blank");
            lines = List.copyOf(lines);
            for (String item : lines) line(item);
        }
    }
    public static final class Draft {
        private final String title;
        private final List<String> lines;
        public Draft(String title, List<String> source) {
            Note valid = new Note(title, source);
            this.title = valid.title();
            lines = new ArrayList<>(valid.lines());
        }
        public void add(String text) { lines.add(line(text)); }
        public Draft copy() { return new Draft(title, lines); }
        public Note snapshot() { return new Note(title, lines); }
    }
    @FunctionalInterface
    public interface Legacy { String fetchPipeText(); }
    @FunctionalInterface
    public interface NoteSource { Note load(); }
    public static final class Adapter implements NoteSource {
        private final Legacy legacy;
        public Adapter(Legacy legacy) { this.legacy = Objects.requireNonNull(legacy, "legacy"); }
        public Note load() {
            String text = Objects.requireNonNull(legacy.fetchPipeText(), "legacy text");
            String[] fields = text.split("\\\\|", -1);
            return new Note(fields[0], Arrays.asList(Arrays.copyOfRange(fields, 1, fields.length)));
        }
    }
    public enum LineEnding {
        INSTANCE;
        public String value() { return "\\n"; }
    }
    public static final class Facade {
        private final NoteSource source;
        public Facade(NoteSource source) { this.source = Objects.requireNonNull(source, "source"); }
        public String render() {
            Note note = Objects.requireNonNull(source.load(), "note");
            StringBuilder text = new StringBuilder(note.title()).append(LineEnding.INSTANCE.value());
            for (String body : note.lines()) text.append(body).append(LineEnding.INSTANCE.value());
            return text.toString();
        }
    }
    public static void main(String[] args) {
        Draft original = new Draft("T", List.of("Ready"));
        Draft copy = original.copy(); copy.add("Next");
        System.out.println(original.snapshot().lines().size());
        System.out.println(copy.snapshot().lines().size());
        System.out.print(new Facade(new Adapter(() -> "T|Ready|Done")).render());
    }
}
\`\`\`

Main prints 1 and 2 because original and copy own different lists. It then prints T, Ready and Done on separate lines. The program reads no input and creates no output file.

The foreign Legacy interface returns a pipe-delimited string. The first field is a nonblank title and later fields are body lines. "T" has no body; "T|Ready|" has two body items, "Ready" and "". \`split("\\\\|", -1)\` treats the pipe literally and preserves the final empty field. A literal pipe cannot occur inside a field because this exercise's format has no escaping convention. CR/LF inside any field is rejected.

Adapter implements NoteSource and translates the foreign representation to a validated Note. It calls fetchPipeText once, rejects a null result, splits the fields, and relies on Note to validate content and copy the list. A vendor exception propagates. Facade accepts any NoteSource, loads once, rejects a null Note, and renders its title and body with LF separators and a final LF. A test can inject an in-memory source without a legacy parser. These two boundaries solve different pressures: translation of an incompatible contract and simpler access to a multi-step operation.

LineEnding.INSTANCE is an enum Singleton example: one named immutable value within the defining enum class. Class identity includes its defining class loader; another process or independently defining loader can have a separate instance. The immutable setting adds no mutable shared counter. Draft, Adapter and Facade still have explicit, ordinary construction and injected dependencies.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The complete three-file worked example reports Boundary worked contracts: 24 passed. Keep its Main.java in its own folder. For a fixed in-memory Note, direct construction is sufficient; a parser, facade or global service becomes useful only when the corresponding boundary exists.

### Prototype ownership in the quote project

The quote pack has ten files: Main.java, ContractTests.java, README.md, sources.txt and six Java sources under src/boundary. The source file paths and package declarations must stay together.

OrderDraft has a title and a list of editable Line objects. A Line has an immutable name and mutable units from 1 through 1000. Titles and names must be non-null, nonblank single lines. A null value causes NullPointerException; an invalid non-null value causes IllegalArgumentException. A draft can have no lines.

The supplied OrderDraft constructor creates its own list and a new Line for every source line. Its lines() accessor returns a structurally read-only view, but the Line elements remain editable through setUnits. Thus lines().clear fails while lines().get(0).setUnits(9) succeeds. This is an editable draft, not immutable data.

copy must return a distinct OrderDraft with the same title, names and quantities, independently owned list structure, and distinct mutable Line objects. Reuse the constructor's existing copy policy. If a caller changes its original input Line after constructing a draft, the draft stays unchanged. If a copy's Line changes, the original draft stays unchanged. The immutable title/name Strings may be shared.

For a draft titled "Class order" with one "book" line of 6 units, copy it, change the copy's book quantity to 9, then add a "pen" line of 1. The original total is 6 and the copy total is 10. A builder would name construction options; the pressure here is independent variation from a configured mutable prototype. A simple constructor is still appropriate when copying offers no useful reuse.

totalUnits uses Math.addExact. A sum outside int range raises ArithmeticException. This very large-input failure, like ordinary invalid quantity, occurs before a pricing request. The examples and normal facade inputs remain bounded to a total of 1000.

### Adapter: translate at one boundary

PricePort is the domain-facing contract:

\`\`\`java
package boundary;
import java.math.BigDecimal;
@FunctionalInterface
public interface PricePort {
    /** Total for 0..1000 units, non-null/nonnegative USD with scale exactly two. */
    BigDecimal total(int units);
}
\`\`\`

The foreign LegacyPrice API uses a String request and String response. Its supplied Standard implementation defines the existing exercise's bulk-pricing rules:

\`\`\`java
package boundary;
import java.math.BigDecimal;

/** Foreign string API: the adapter owns translation to the domain's typed API. */
@FunctionalInterface
public interface LegacyPrice {
    String totalFor(String unitsText);
    final class Standard implements LegacyPrice {
        public String totalFor(String unitsText) {
            int units = Integer.parseInt(unitsText);
            if (units < 0 || units > 1000) throw new IllegalArgumentException("units must be 0..1000");
            int unitCents = units >= 10 ? 250 : units >= 5 ? 300 : 350;
            return "USD " + BigDecimal.valueOf((long) units * unitCents, 2).toPlainString();
        }
    }
}
\`\`\`

The unit price is 350 cents below 5 units, 300 cents for 5–9, and 250 cents from 10. Total is units times that tier's unit price, not a per-tier incremental sum. Thus 4 units cost 14.00, 5 cost 15.00, 9 cost 27.00 and 10 cost 25.00. The boundary drop is part of this exercise's all-units bulk rule.

PriceAdapter retains an injected LegacyPrice. Its total method first validates units in 0..1000. It converts the integer with Integer.toString, calls totalFor exactly once, rejects null, and accepts only "USD " followed by one or more ASCII digits, a literal decimal point, and exactly two fractional digits. Other currencies, signs, exponent notation, missing/extra decimal digits, whitespace and embedded newlines are invalid. Leading zero digits are allowed by this grammar.

The Java regular-expression string for that result is \`"USD [0-9]+\\\\.[0-9]{2}"\`. After validation, parse the substring after the four-character prefix with new BigDecimal. Decimal text preserves scale two. No conversion through double is required. For total(6), the foreign request is "6", response is "USD 18.00", and typed result is BigDecimal("18.00"). An out-of-range quantity fails before any foreign call; a null response causes NullPointerException, a malformed response causes IllegalArgumentException, and a vendor failure propagates without retry.

BigDecimal is immutable. Its scale is part of equals: 18.0 and 18.00 compare numerically equal with compareTo but are unequal under equals. This project deliberately requires scale two so representation and displayed fractional digits are tested, not only numerical magnitude. These are exercise contracts rather than a complete international currency format.

### Facade: coordinate a coherent workflow

QuoteFacade takes a PricePort in its constructor. quote validates a non-null draft, takes an independent draft snapshot, computes its units, rejects an aggregate above 1000 before pricing, calls the price port once, and constructs an immutable Quote. Quote contains title, units and BigDecimal total, with non-null valid title and non-null, nonnegative total of scale exactly two. The supplied Quote constructor checks these invariants.

A valid draft of six books produces "Class order: 6 units = USD 18.00\\n". The call trace is Main -> QuoteFacade.quote -> OrderDraft.copy/totalUnits -> PricePort.total -> PriceAdapter -> LegacyPrice.totalFor -> Quote. Snapshot values become immutable Quote components; later draft edits leave the earlier quote unchanged. No file, network or console output is part of quote itself. Main prints the returned value.

A draft with two 600-unit lines is individually valid but has an invalid aggregate 1200. It is refused before the port is called. A null/negative/wrong-scale price fails when forming the Quote. A port exception propagates. Once a port has been called, this contract promises no retry, rollback or atomic reversal of any effects a custom port might have.

The facade hides the workflow from its client; it does not replace the adapter's foreign-format responsibility. A facade is useful when clients repeat a meaningful sequence and need one stable entry point. For one direct calculation, a plain function can be simpler.

### Lifetime and test isolation

The supplied LifetimeExamples.CurrencySettings.INSTANCE is immutable. LifetimeExamples.Counter is a normal mutable object constructed by its owner. With two counters, first.next(), first.next(), second.next() yield 1, 2, 1. A shared mutable counter would couple callers and their tests.

Choosing one service instance for an application can be reasonable. Constructing it once and passing it through constructors keeps its lifetime and dependencies explicit. Singleton access can hide dependencies, share mutable state between tests, and constrain replacement; a single instance also does not make operations thread-safe. The draft and sample counters are used within one thread. Initialization dependencies, resource cleanup and concurrent access require their own contracts if added later.

Two QuoteFacade instances can receive independent price fakes returning 1.00 and 2.00. Each then produces its own result without changing global state. Describe the required lifetime before choosing a global, application-owned, per-session or per-request instance.

### Build and completion

The three core methods are OrderDraft.copy, PriceAdapter.total and QuoteFacade.quote. The application check begins the copy/translation work; the core project completes the same saved attempt. Reference actions open a separate project. Keep an ownership sketch, request/response table, call-count trace and lifetime decision alongside the implementation.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

sources.txt lists all eight Java files. -d classes places package output below classes. The untouched starter compiles and names its first unfinished method. Completed core reports Core boundary contracts: 4064 passed. Main prints "Class order: 6 units = USD 18.00" with a final LF. The IDE Run action shows these native Java 21 commands.

Optional copyWithTitle makes another independent deep copy with a new validated title. Completed core and Main work before this extension is finished. The complete harness, java -cp classes ContractTests, additionally checks the optional copy and reports Complete boundary contracts: 4071 passed. Tests verify behavior, ownership and boundary failures; the choice of a pattern also needs an explicit rejected alternative and cost.

[Object.clone](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html#clone()) documents the default copy mechanism. [BigDecimal](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html) documents decimal representation and equality; the [Java enum specification](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.9) defines enum instances.
`,
				contentKind: "reading",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaBoundaryURL("example"),
				solutionLink: javaBoundaryURL("solution")
			},
			task(
				{
					id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-creational-patterns-ii-and-boundary-patterns-application-check",
					aliases: [
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-application-misconceptions-and-readiness-check",
						"application-check",
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-application-check"
					],
					title: "Creational Patterns II and Boundary Patterns Application Check",
					learningPath: "core",
					content: `Open the shared quote starter. Implement OrderDraft.copy using the supplied constructor's ownership policy, then implement PriceAdapter.total to validate quantity, convert the request, call the legacy API once, and validate/parse its response. QuoteFacade.quote remains the later core step.

Start with one caller-owned book line of 6 units. Construct a draft, change the caller's line to 2, then copy the draft, change the copy's line to 9 and add a pen line of 1. Predict both draft totals and object identities. For adapter quantities 4, 5, 9, 10, predict exact request strings and scale-two totals. Also predict quantity -1 and response "EUR 18.00". **Completion evidence:** Preserve the ownership sketch, copy/adapter code, exact case table and a test distinguishing a new list from independently copied mutable elements.`,
					ideImport: true,
					projectLink: javaBoundaryURL("starter"),
					solutionLink: javaBoundaryURL("solution")
				},
				"application"
			),
			task(
				{
					id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-reflection-question-why-is-singleton-so-tempting",
					title: "Reflection Question: Why Is Singleton So Tempting?",
					learningPath: "core",
					content: `Compare three lifetime requirements. A: an immutable USD setting shared by callers in one application. B: a mutable counter whose two independent sessions must each start at 1. C: a pricing dependency that tests must replace with independent 1.00 and 2.00 fakes.

Choose a lifetime and wiring approach for each, explain an appropriate use or cost of Singleton, and trace first.next(), first.next(), second.next() for independent counters. State the class-loader/process limit of a single enum instance and one concurrency concern that instance count alone does not resolve. **Completion evidence:** Keep three lifetime decisions, the counter trace and one failure that hidden shared mutable state would cause. This is a reflection worksheet.`
				},
				"reflection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-copy-global-state-and-boundary-risk-contract",
					title: "Copy, Global State, and Boundary Risk Contract",
					learningPath: "core",
					content: `Build a boundary-risk table for these cases: A, a copied list that still shares mutable Line objects; B, adapter input -1; C, foreign response "USD 18.0"; D, a draft with two 600-unit lines; E, a price port returning BigDecimal("18.0"); F, a price port throwing IllegalStateException.

For each, name the responsible boundary, observable outcome and whether the legacy API or price port is called. Add a valid6-unit trace with a fake price of 18.00. Explain what can be tested without a real legacy implementation and why a facade's failure contract does not imply rollback of arbitrary external effects. **Completion evidence:** Keep the ownership/call-count table, one injected fake and a distinction between API translation and workflow coordination.`
				},
				"risk"
			),
			task(
				{
					id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-core-project-creational-patterns-ii-and-boundary-patterns",
					aliases: [
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-core-project",
						"dpj4-creational-patterns-ii-and-boundary-patterns-core-project",
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-curriculum-dpj4-creational-patterns-ii-and-boundary-patterns-core-project"
					],
					title: "Core Project: Creational Patterns II and Boundary Patterns",
					learningPath: "core",
					content: `Complete the same saved quote starter's three core methods: OrderDraft.copy, PriceAdapter.total and QuoteFacade.quote. Preserve the supplied contracts. Copies own independent mutable Line objects; adapter requests/responses use the exact bounded USD format; the facade snapshots, rejects invalid aggregate quantity before pricing, calls one injected port and returns a valid immutable Quote.

Keep all ten files and the src/boundary tree. Export the saved attempt, then run:

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

Core reports 4064 passed. Main prints "Class order: 6 units = USD 18.00\\n". Predict the empty draft, tier boundaries 4/5/9/10, caller/copy mutations, two 600-unit lines, null collaborators and a wrong-scale price. Optional copyWithTitle stays independent. **Completion evidence:** Preserve the implementation, exact result/error table, prototype identity sketch, adapter/facade call trace and one justified simpler alternative before using the separate reference.`,
					ideImport: true,
					projectLink: javaBoundaryURL("starter"),
					solutionLink: javaBoundaryURL("solution")
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-understanding-check-creational-patterns-ii-and-boundary-patterns",
					aliases: [
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-dpj4-creational-patterns-ii-and-boundary-patterns-diagnostic-checkpoint",
						"diagnostic-checkpoint-creational-patterns-ii-and-boundary-patterns",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-diagnostic-checkpoint-creational-patterns-ii-and-boundary-patterns",
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-understanding-check"
					],
					title: "Understanding Check: Creational Patterns II and Boundary Patterns",
					learningPath: "choice",
					content: `Evaluate four proposals. A: copying an ArrayList always makes its mutable elements independent. B: implementing Cloneable automatically supplies a deep-copy method. C: a Singleton is thread-safe solely because only one instance exists. D: Adapter and Facade are interchangeable because both delegate.

Use the draft, legacy-price and note examples to correct each claim and give one revealing test. Compare sharing immutable Strings with sharing mutable Line objects. **Completion evidence:** Keep four reasoned corrections, an ownership sketch and a case where direct construction or a plain function is sufficient. This optional check is written work.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-creational-patterns-ii-and-boundary-patterns-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-transfer-practice",
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-transfer-practice-creational-patterns-ii-and-boundary-patterns"
					],
					title: "Creational Patterns II and Boundary Patterns Transfer Practice",
					learningPath: "choice",
					content: `A new integration accepts the foreign string "T|Ready|" through the complete worked Adapter. Its typed NoteSource consumer needs a nonblank title, a list of single-line body Strings and a rendering with a final LF.

Predict the parsed title/list and facade output. Then consider foreign "T", "|Ready", a null response and"T|bad\\nline". Specify the validation boundary, load/fetch call count and failure for each. Finally inject a fake NoteSource that returns Note("Local", ["one"]) without any parser. **Completion evidence:** Keep the five-case table, a source/facade sketch, the fake's expected output and a limitation of the pipe format. This transfer worksheet uses the complete public example and assigns no additional starter pack.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-creational-patterns-ii-and-boundary-patterns-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-extension-practice",
						"design-patterns-in-java-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-extension-practice-creational-patterns-ii-and-boundary-patterns"
					],
					title: "Creational Patterns II and Boundary Patterns Extension Practice",
					learningPath: "challenge",
					content: `Complete core first, then continue the same saved quote project. Implement only OrderDraft.copyWithTitle as an independent deep copy using a new valid title. Preserve names and quantities while giving the copy independent mutable Lines.

Begin with Original containing book 6. Create Variant, change its book quantity to 9 and add pen1. The original stays titled Original with total 6; the variant is titled Variant with total 10. A null or blank new title is rejected and leaves the original unchanged. Run core before/after (4064 passed), then java -cp classes ContractTests (4071 passed). **Completion evidence:** Keep both states, new Line identities, invalid-title cases and unchanged core results.`,
					ideImport: true,
					projectLink: javaBoundaryURL("starter"),
					solutionLink: javaBoundaryURL("solution")
				},
				"extension"
			)
		]
	};
}
