import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaBehavioralModuleID,
	javaBehavioralURL
} from "@/modules/javaBehavioralResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path = "/course-assets/design-patterns-in-java/behavioral-checks.md#";
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
export function completeJavaBehavioral(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPJ6 Behavioral Patterns I") return module;
	return {
		...module,
		id: javaBehavioralModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-behavioral-patterns-i-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-core-concepts"
				],
				title: "Behavioral Patterns I Core Concepts",
				learningPath: "core",
				content: `**Course flow:** Identify who chooses a behavior and when it changes. Compare caller-selected Strategy with internally dispatched State, a fixed Template Method skeleton and independent Iterator positions. Trace the public contract before adding an abstraction. The application check and core project share one saved document workflow.

### Who owns the decision?

Strategy packages an interchangeable algorithm behind an interface. The caller selects the rule, and the context delegates without knowing its implementation. TextRule has one operation, apply, so a lambda or method reference can implement a small stateless rule. Rules.Prefix is a named object with a configured prefix. A class is useful when named configuration, dependencies or lifecycle deserve their own boundary.

State delegates behavior to the current state object. An operation can move its context to another state, changing later permitted behavior. Document owns its current phase; callers request submit, approve or revise through Document. They do not select or install the next private state directly.

Strategy and State can both use interfaces and delegation. Their decision ownership differs. A caller supplies a text algorithm; a document's current phase defines legal operations and transitions. A small fixed state machine may be clearest as an enum switch. State objects become useful when each phase has enough behavior to justify separating it.

Template Method fixes an algorithm's ordering in a base method and delegates selected steps to subclass hooks. ReportTemplate.render is final. Its subclasses provide headings and line formatting; they cannot replace the validation/order/result assembly through an override of render. Inheritance couples those variants to the skeleton. When only one step varies, an injected function can be simpler.

Iterator lets a client ask hasNext/next without depending on storage representation. Each traversal needs its own position. The Iterator interface defines exhaustion and optional removal; this project's snapshot policy is an additional contract. A plain library iterator is usually sufficient for an ordinary list.

### Complete worked example

The complete example uses a caller-selected LabelStyle, a Gate with private phase objects, a fixed list-printing skeleton and immutable Labels with standard-library iterators. It runs separately from the document assignment.

\`\`\`java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

public class Main {
    @FunctionalInterface public interface LabelStyle { String apply(String text); }
    public static String styled(LabelStyle style, String text) {
        return Objects.requireNonNull(Objects.requireNonNull(style, "style").apply(Objects.requireNonNull(text, "text")), "styled text");
    }
    public static final class Gate {
        private State state = Phase.CLOSED;
        public String phase() { return state.name(); }
        public void open() { state.open(this); }
        public void lock() { state.lock(this); }
        private interface State {
            String name();
            default void open(Gate gate) { throw new IllegalStateException("open unavailable"); }
            default void lock(Gate gate) { throw new IllegalStateException("lock unavailable"); }
        }
        private enum Phase implements State {
            CLOSED { public void open(Gate gate) { gate.state = OPEN; } },
            OPEN { public void lock(Gate gate) { gate.state = LOCKED; } },
            LOCKED
        }
    }
    public abstract static class ListPrinter {
        protected abstract String item(String text);
        public final String print(List<String> values) {
            List<String> snapshot = List.copyOf(values), output = new ArrayList<>();
            for (String value : snapshot) output.add(Objects.requireNonNull(item(value), "item text"));
            return "[" + String.join("|", output) + "]";
        }
    }
    public static final class DashPrinter extends ListPrinter {
        protected String item(String text) { return "-" + text; }
    }
    public record Labels(List<String> values) implements Iterable<String> {
        public Labels { values = List.copyOf(values); }
        public Iterator<String> iterator() { return values.iterator(); }
    }
    public static void main(String[] args) {
        Gate gate = new Gate(); gate.open(); gate.lock();
        System.out.println(gate.phase());
        System.out.println(styled(text -> text.toUpperCase(Locale.ROOT), "ready"));
        System.out.println(new DashPrinter().print(List.of("one","two")));
        for (String label : new Labels(List.of("a","b"))) System.out.println(label);
    }
}
\`\`\`

Main prints:

\`\`\`text
LOCKED
READY
[-one|-two]
a
b
\`\`\`

Gate starts CLOSED. Only open moves it to OPEN, and only lock moves OPEN to LOCKED. Other transitions throw IllegalStateException and preserve the phase. Two gates share immutable enum phase objects while each owns its own state reference. Closing the type family keeps illegal wiring outside the public API; adding a new phase requires editing that family.

styled calls the caller's LabelStyle once and rejects null collaborators/input/results. The uppercase lambda uses Locale.ROOT. A style failure propagates. ListPrinter snapshots its non-null input list before item hooks, rejects null elements, then formats each occurrence once in order. Null item text is rejected; an exception stops later hooks. Its bracket/pipe output is literal exercise notation with no escaping convention.

Labels copies membership at construction. Later edits to the caller's original list leave it unchanged. Values are immutable Strings, so sharing them is safe. iterator delegates to the standard immutable list and supplies an independent cursor each time. The assignment's ReviewQueue instead permits additions and captures membership at each iterator call. Choose the snapshot point to fit the owner's contract.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

Keep the three worked files together in their own folder. The complete harness reports Behavioral worked contracts: 36 passed. Main reads no input and writes no files.

### Strategy in the document project

Keep all eleven project files: Main.java, ContractTests.java, README.md, sources.txt and seven files under src/behavior. The source list contains nine Java files.

TextRule.line defines the exercise text boundary: a String is non-null and contains neither CR nor LF. Empty text and spaces are valid. Null causes NullPointerException; CR/LF causes IllegalArgumentException. This is an in-memory text exercise with no escaping or file/network behavior.

RuleContext takes one non-null TextRule. Implement format to validate the input, call the selected rule exactly once and validate the returned text. An invalid input must fail before any rule call. A null output fails with NullPointerException, an output containing CR/LF fails with IllegalArgumentException, and a rule exception propagates without retry. A rule may have its own effects; validation of its result promises no rollback.

The supplied Rules.Identity preserves spaces. Rules.Upper uses Locale.ROOT. Rules.Prefix validates its prefix at construction and retains it. For input " Ready ", the exact results are:

\`\`\`text
Identity: " Ready "
String::strip: "Ready"
Prefix("Review: "): "Review:  Ready "
\`\`\`

The prefix result retains the input spaces. The caller chooses the object or method reference when constructing a RuleContext. Constructing a fresh context with another rule leaves the first context unchanged.

A test can inject a rule that records its input and call count. Compare that seam with writing a direct function for a one-off calculation. A long conditional is a change-pressure clue; it does not by itself require Strategy.

### State transitions and encapsulation

Document starts DRAFT and owns its validated text. It exposes text, a phase name and four operations: replace, submit, approve and revise. Its State interface and Phases enum are private. Per-document mutable fields remain on Document; enum constants hold behavior without shared mutable document data.

| Current phase | Operation | Result |
| --- | --- | --- |
| DRAFT | replace(valid text) | Remain DRAFT with new text |
| DRAFT | submit | Move to REVIEW |
| REVIEW | revise | Move to DRAFT with text retained |
| REVIEW | approve | Move to PUBLISHED with text retained |
| PUBLISHED | Any transition or replacement | IllegalStateException; unchanged |

Every other operation also throws IllegalStateException and preserves phase/text. The replace method validates text before state dispatch, so malformed replacement text fails validation even when the current phase would reject a valid replacement.

Implement three transition methods inside the private enum: DRAFT.submit selects REVIEW; REVIEW.approve selects PUBLISHED; REVIEW.revise selects DRAFT. Default state methods already reject unavailable operations. DRAFT replacement is supplied.

Trace Ready -> submit -> revise -> replace("Checked") -> submit -> approve. The final phase is PUBLISHED and text is Checked. A second Document remains DRAFT. Approval from DRAFT, another submit during REVIEW, and any operation after publication are illegal. This closed single-threaded exercise has no publication side effect or persistence; sharing enum instances alone supplies no concurrency guarantee.

### Template Method ordering and failure

Implement ReportTemplate.render as the fixed public algorithm. First make a List.copyOf snapshot and validate every input line. This rejects a null list, a null element or CR/LF before any hook runs. Retain duplicates and order.

Then call heading once, formatLine once per occurrence in order, and footer once. Each hook result uses the same non-null/CR/LF boundary. Append LF after heading, each formatted line and footer, including the final footer LF. Empty input still includes heading and footer. The default footer is End.

The supplied Reports.Plain uses heading Report and unchanged lines. Reports.Upper uses heading UPPER and uppercase lines. For ["a","Ready"], Upper returns these four lines, with a final LF:

\`\`\`text
UPPER
A
READY
End
\`\`\`

A recording subclass can log heading, line:a, line:b, footer. If its heading hook clears the caller's original list, the snapshot still supplies a and b. If heading fails, no line/footer runs. If a line fails or returns null, later lines and footer are skipped. A footer failure propagates after earlier hooks have run. No partial String is returned, and arbitrary hook effects are not reversed.

The final method protects this skeleton through its public entry point. A subclass can still have mutable fields or extra methods; final is an ordering boundary, not a complete correctness guarantee. Compare a subclass family with a small object that accepts formatting functions when inheritance itself would add coupling.

### Independent snapshot iterators

ReviewQueue owns a mutable list of valid text. add appends one occurrence; duplicates are allowed. Implement iterator to capture current membership and return a new traversal with its own index.

hasNext reports whether the snapshot has an unvisited element without advancing. next returns one element and advances once, or throws NoSuchElementException after exhaustion. The cursor inherits Iterator.remove's default UnsupportedOperationException. forEachRemaining follows the remaining order and propagates callback exceptions.

For a queue ["first","second"], create iterators A and B, then add "third". A.next and B.next both return first. Each then has second remaining. Neither old snapshot includes third; a newly created iterator sees all three entries. Repeated hasNext calls leave the next result unchanged. An iterator created when empty stays exhausted after later additions.

List.copyOf(entries).iterator() is a valid simpler implementation of this snapshot contract. The reference's explicit cursor makes the position and exhaustion rule visible for study. Copying a mutable queue's membership for every traversal costs time and space proportional to its current size; a live view would need a different mutation contract. Strings remain safely shared. The queue is single-threaded and owns no file, network connection or disposal operation.

### Core and optional completion

Complete six core methods: RuleContext.format; the three private document transitions; ReportTemplate.render; and ReviewQueue.iterator. The application check begins rule dispatch and transitions. The core project completes the skeleton and traversal in the same saved attempt.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

The untouched starter compiles and identifies its first unfinished method. Completed core reports Core behavioral contracts: 82 passed. Main prints:

\`\`\`text
PUBLISHED
Review: Checked
UPPER
CHECKED
DONE
End
first
second
\`\`\`

Optional ReviewQueue.matching accepts a non-null Predicate, snapshots membership, evaluates each occurrence once in order and returns an unmodifiable selected list. A callback may add entries to the queue, but additions do not enter the current snapshot. A thrown predicate stops the operation and propagates; earlier callback effects remain.

For ["a","b","a"], selecting a yields ["a","a"]. If the first callback adds later, the predicate still visits only the original three entries; the queue then contains four. A null predicate fails before any call. Core and Main remain usable while matching is unfinished. The complete java -cp classes ContractTests harness reports Complete behavioral contracts: 91 passed.

Keep a decision-owner comparison, transition table, hook trace, interleaved cursor trace and rejected simpler alternative alongside passing behavior checks. Those explain the design choice that a test count alone cannot establish.

The [Iterator API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Iterator.html) defines next, hasNext and optional remove. [List.copyOf](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#copyOf(java.util.Collection)) defines the unmodifiable membership snapshot.
`,
				contentKind: "reading",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaBehavioralURL("example"),
				solutionLink: javaBehavioralURL("solution")
			},
			task(
				{
					id: "design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-behavioral-patterns-i-application-check",
					aliases: [
						"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-application-misconceptions-and-readiness-check",
						"application-check",
						"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-application-check"
					],
					title: "Behavioral Patterns I Application Check",
					learningPath: "core",
					content: `Open the shared document starter. Implement RuleContext.format and the three private transitions: DRAFT.submit, REVIEW.approve and REVIEW.revise. Leave ReportTemplate.render and ReviewQueue.iterator for the core step.

Compare Identity, String::strip and Prefix("Review: ") on " Ready ". Trace Ready -> submit -> revise -> replace("Checked") -> submit -> approve, alongside a second untouched Document. Try approve in DRAFT and submit in REVIEW. **Completion evidence:** Keep exact text outputs, a recorded one-call rule, phase/text trace and invalid-operation results. Explain caller-selected Strategy versus internally dispatched State.`,
					ideImport: true,
					projectLink: javaBehavioralURL("starter"),
					solutionLink: javaBehavioralURL("solution")
				},
				"application"
			),
			task(
				{
					id: "design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-reflection-question-where-does-the-decision-live-now",
					title: "Reflection Question: Where Does the Decision Live Now?",
					learningPath: "core",
					content: `Compare four decisions: A, choose a text rule for a new formatting context; B, decide whether a submitted document can be edited; C, keep heading/line/footer order while varying line formatting; D, traverse a private queue without exposing its list.

Name the owner of each decision, its public contract and a simpler alternative. Explain when a direct function, enum switch, injected formatter or ordinary list iterator is sufficient. **Completion evidence:** Keep four reasoned choices and one cost of each abstraction. This is a written design reflection.`
				},
				"reflection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-functional-strategy-and-explicit-state-alternatives",
					title: "Functional Strategy and Explicit-State Alternatives",
					learningPath: "core",
					content: `Compare a Prefix class retaining configured text with a small lambda/method reference; private document phase objects with a closed enum switch; a final report skeleton with composition using functions; and an explicit snapshot cursor with List.copyOf(entries).iterator().

For each pair, state the observable contract that must remain unchanged, the state/lifetime it owns and when the smaller alternative fits. Trace two independent documents and two interleaved queue iterators. **Completion evidence:** Keep four comparisons, a transition decision and a snapshot timing sketch. This is a written alternatives analysis.`
				},
				"alternatives"
			),
			task(
				{
					id: "design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-core-project-behavioral-patterns-i",
					aliases: [
						"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-core-project",
						"dpj6-behavioral-patterns-i-core-project",
						"design-patterns-in-java-dpj6-behavioral-patterns-i-curriculum-dpj6-behavioral-patterns-i-core-project"
					],
					title: "Core Project: Behavioral Patterns I",
					learningPath: "core",
					content: `Complete the same saved project's six core methods: RuleContext.format; DRAFT.submit, REVIEW.approve and REVIEW.revise; ReportTemplate.render; ReviewQueue.iterator. Keep all eleven files and src/behavior intact.

Export the saved project and run:
\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

Core reports 82 passed. Main's exact eight lines are in Core Concepts and the case inputs. Cover invalid rule input/output, legal/illegal state operations, validation before hooks, hook order/failure, independent cursors, later queue additions and exhaustion. Optional matching remains independent. **Completion evidence:** Keep implementation, phase table, hook/cursor traces and a simpler rejected alternative before consulting the separate reference.`,
					ideImport: true,
					projectLink: javaBehavioralURL("starter"),
					solutionLink: javaBehavioralURL("solution")
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-understanding-check-behavioral-patterns-i",
					aliases: [
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-dpj6-behavioral-patterns-i-diagnostic-checkpoint",
						"diagnostic-checkpoint-behavioral-patterns-i",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-diagnostic-checkpoint-behavioral-patterns-i",
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-understanding-check"
					],
					title: "Understanding Check: Behavioral Patterns I",
					learningPath: "choice",
					content: `Evaluate five claims: A, Strategy and State have the same decision owner; B, sharing enum phase objects makes Document state shared; C, final render means every subclass hook is correct; D, hasNext should consume an element; E, all Iterator implementations promise snapshots.

Correct each using a revealing call/identity/state trace. Include one invalid input before collaborator invocation and one hook failure that stops later hooks. **Completion evidence:** Keep five reasoned corrections and the project's explicit single-threaded ownership assumptions. This optional check is written work.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-behavioral-patterns-i-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-transfer-practice",
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-transfer-practice-behavioral-patterns-i"
					],
					title: "Behavioral Patterns I Transfer Practice",
					learningPath: "choice",
					content: `Use the complete worked example. Try Gate.lock before open, then open/lock, then open again. Compare a second untouched Gate. Use String::strip on " a " and a lambda adding ">" to "a". Print empty and duplicate-item lists with DashPrinter.

Create Labels from a caller list ["a","a","b"], clear that original list, and interleave two iterators. State exact output, retained membership, cursor independence and exhausted-next/removal failures. **Completion evidence:** Keep the gate trace, formatter outputs and iterator inventory. This transfer worksheet uses the public example and assigns no extra starter pack.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-behavioral-patterns-i-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-extension-practice",
						"design-patterns-in-java-dpj6-behavioral-patterns-i-supplemental-extension-practice-behavioral-patterns-i"
					],
					title: "Behavioral Patterns I Extension Practice",
					learningPath: "challenge",
					content: `Complete core first, then continue the same saved document project. Implement only ReviewQueue.matching: reject null Predicate, capture current membership, evaluate each occurrence once in order, and return an unmodifiable selected list.

Begin ["a","b","a"]. Select a while adding later during the first predicate call. Predict visited entries, selected values and final queue size. Also try a predicate that throws on its first call and one that selects nothing. Run core before/after (82 passed), then the full harness (91 passed). **Completion evidence:** Keep predicate call order, snapshot versus later additions, failure effects and unchanged core results.`,
					ideImport: true,
					projectLink: javaBehavioralURL("starter"),
					solutionLink: javaBehavioralURL("solution")
				},
				"extension"
			)
		]
	};
}
