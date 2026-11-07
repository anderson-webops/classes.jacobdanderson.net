import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaStructuralModuleID,
	javaStructuralURL
} from "@/modules/javaStructuralResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path = "/course-assets/design-patterns-in-java/structural-checks.md#";
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
export function completeJavaStructural(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPJ5 Structural Patterns in Depth") return module;
	return {
		...module,
		id: javaStructuralModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-structural-patterns-in-depth-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-core-concepts"
				],
				title: "Structural Patterns in Depth Core Concepts",
				learningPath: "core",
				content: `**Course flow:** Compare two independent variations, then a tree, a behavior layer, delayed access and shared state. Trace output, object identity and lifetime before choosing a pattern. The application check and core project share one scene implementation. Reflection and lifecycle work are written analyses.

### Five structural pressures

Bridge separates two dimensions that vary independently. A shape has geometry, while a Renderer supplies notation. Circle/Box can each use Plain/Compact without four combined subclasses. The abstraction delegates through a stable implementation interface. Adding geometry should not require a renderer-specific subclass of every existing shape.

Composite gives leaves and groups one client-facing operation. A Graphic can be a Circle or a Group of Graphics; the client calls render in either case. A group recursively combines child results. Acyclic, bounded graphs are assumed here. Arbitrary cyclic or very deep graphs need a termination and stack-depth policy.

Decorator implements the same client contract while adding behavior around a wrapped component. Frame renders its child once and adds brackets. Nested layers compose; their order can matter. The wrapper has a distinct identity, even while preserving the interface.

Proxy implements the same contract and controls access to another object. LazyGraphic delays constructing its product until render is called and then retains that product. Access-control and remote proxies require additional failure/security contracts. This exercise assigns lazy access.

Flyweight shares immutable intrinsic state among many contexts. Glyph(symbol,tone) is shared; Placement coordinates belong to each use. The pool's key excludes coordinates. Sharing reduces duplicate glyph instances in this model, but a map, keys and lookups have costs. A real memory claim requires measurements and a workload; small collections may be simpler without a pool.

| Pattern | Pressure | Client operation and identity |
| --- | --- | --- |
| Bridge | Two independent variations | Geometry delegates notation; each shape keeps its identity |
| Composite | Leaf/group hierarchy | One render contract; group retains child identities |
| Decorator | Layered behavior | New wrapper identity; wrapped object retained |
| Proxy | Access and loading lifetime | New proxy identity; loaded product retained after success |
| Flyweight | Repeated intrinsic state | Equal keys in one pool share one immutable glyph |

Adapter, from the previous unit, translates an incompatible API. Bridge deliberately separates independent variations. Facade exposes a simpler workflow entry point. The problem and contract establish a pattern's role.

### Complete message example

This separate Main.java supplies all five ideas. Greeting and Warning vary independently of Plain and Upper text styles. Sequence combines children, Emphasis adds a layer, LazyNode delays a node, and WordPool shares words independently of their rows.

\`\`\`java
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.function.Supplier;

public class Main {
    @FunctionalInterface public interface Node { String render(); }
    @FunctionalInterface public interface TextStyle { String apply(String text); }
    public static final class Plain implements TextStyle {
        public String apply(String text) { return Objects.requireNonNull(text, "text"); }
    }
    public static final class Upper implements TextStyle {
        public String apply(String text) { return Objects.requireNonNull(text, "text").toUpperCase(Locale.ROOT); }
    }
    public abstract static class Message implements Node {
        private final TextStyle style;
        protected Message(TextStyle style) { this.style = Objects.requireNonNull(style, "style"); }
        protected final String styled(String text) { return Objects.requireNonNull(style.apply(text), "styled text"); }
    }
    public static final class Greeting extends Message {
        private final String text;
        public Greeting(TextStyle style, String text) { super(style); this.text = Objects.requireNonNull(text, "text"); }
        public String render() { return styled(text); }
    }
    public static final class Warning extends Message {
        private final String text;
        public Warning(TextStyle style, String text) { super(style); this.text = Objects.requireNonNull(text, "text"); }
        public String render() { return styled("Warning: " + text); }
    }
    public record Sequence(List<Node> children) implements Node {
        public Sequence { children = List.copyOf(children); }
        public String render() {
            List<String> values = new ArrayList<>();
            for (Node child : children) values.add(Objects.requireNonNull(child.render(), "child text"));
            return "[" + String.join(",", values) + "]";
        }
    }
    public record Emphasis(Node child) implements Node {
        public Emphasis { Objects.requireNonNull(child, "child"); }
        public String render() { return "*" + Objects.requireNonNull(child.render(), "child text") + "*"; }
    }
    public static final class LazyNode implements Node {
        private final Supplier<? extends Node> loader;
        private Node cached;
        public LazyNode(Supplier<? extends Node> loader) { this.loader = Objects.requireNonNull(loader, "loader"); }
        public boolean loaded() { return cached != null; }
        public String render() {
            if (cached == null) cached = Objects.requireNonNull(loader.get(), "node");
            return Objects.requireNonNull(cached.render(), "node text");
        }
    }
    public enum Lexeme { READY, WAIT }
    public record Word(String text) {
        public Word { Objects.requireNonNull(text, "text"); }
    }
    public static final class WordPool {
        private final Map<Lexeme, Word> words = new EnumMap<>(Lexeme.class);
        public Word get(Lexeme key) {
            Objects.requireNonNull(key, "key");
            return words.computeIfAbsent(key, value -> new Word(value.name().toLowerCase(Locale.ROOT)));
        }
    }
    public record At(Word word, int row) implements Node {
        public At {
            Objects.requireNonNull(word, "word");
            if (row < 0 || row > 9) throw new IllegalArgumentException("row must be 0..9");
        }
        public String render() { return word.text() + "@" + row; }
    }
    public static void main(String[] args) {
        Node messages = new Sequence(List.of(new Greeting(new Plain(), "Ready"),
            new Emphasis(new Warning(new Upper(), "wait")),
            new LazyNode(() -> new Greeting(new Upper(), "go"))));
        System.out.println(messages.render());
        WordPool pool = new WordPool();
        At first = new At(pool.get(Lexeme.READY), 1), second = new At(pool.get(Lexeme.READY), 2);
        System.out.println(first.render()); System.out.println(second.render());
        System.out.println(first.word() == second.word());
    }
}
\`\`\`

The call path for the first line is Sequence.render -> each child.render -> its TextStyle, Emphasis child or LazyNode product -> joined text. Upper uses Locale.ROOT for language-neutral casing. The program reads no input and writes no files. Its exact four output lines are:

\`\`\`text
[Ready,*WARNING: WAIT*,GO]
ready@1
ready@2
true
\`\`\`

Sequence snapshots list structure and retains each child identity. A custom Node may be mutable, so an unmodifiable list does not make the entire graph immutable. Emphasis returns one star, one child result and one closing star. Emphasis around a Sequence differs from a Sequence of individually emphasized children.

LazyNode begins unloaded. The first successful non-null loader result becomes the retained Node, and every render delegates again to that Node. It caches the object. A thrown loader or null product leaves it unloaded; the exception propagates and a later separate call can try loading again. A successfully loaded node remains cached even if its render throws. The example uses one thread and owns no connection or file handle.

WordPool has two possible keys, READY and WAIT. It creates at most one Word for each requested key within that pool. At adds row 0 through 9. Two At values can have different rows while first.word() == second.word() is true. A separate pool can hold equal Word values with different identities. The bounded enum key space needs no weak-reference eviction policy.

Keep the example's three files in a separate folder:

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

Its complete harness reports Structural worked contracts: 41 passed. For a fixed message printed once, a String can be sufficient. Interfaces and wrappers earn their cost when the corresponding variation, hierarchy, layer or lifetime matters.

### Scene project contracts

The project has fourteen files: Main.java, ContractTests.java, README.md, sources.txt and ten Java files in src/scene. Keep the paths and package declarations intact.

Graphic has String render(), returning non-null text. A null collaborator, list, child or required result causes NullPointerException. A label matches [A-Za-z][A-Za-z0-9_]{0,19}: an ASCII letter first, followed by up to 19 ASCII letters, digits or underscores. Geometry sizes are integers 1 through 100. Invalid non-null labels/sizes cause IllegalArgumentException. These are literal exercise strings.

Renderer supplies circle(name,radius), box(name,width,height) and group(renderedChildren). The supplied formats are:

| Value | Plain | Compact |
| --- | --- | --- |
| Circle named c, radius 2 | circle(c,2) | C:c:2 |
| Box named b, width 3, height 4 | box(b,3x4) | B:b:3:4 |
| Children x and y | group[x;y] | G(x\\|y) |
| Empty group | group[] | G() |

The results contain no spaces or final line ending. Circle retains its renderer, validated name and radius. Implement Circle.render by delegating once to renderer.circle and rejecting a null result. Box supplies the second geometry example; Plain and Compact supply the notation variants. A test renderer can record arguments and call count independently of geometry.

Group snapshots its incoming list with List.copyOf. Changes to the caller's list leave membership and order unchanged. children() exposes an unmodifiable list, retaining the original child references. Duplicate references remain duplicate occurrences: a child placed twice is rendered twice. Implement Group.render by rendering each occurrence once in order, rejecting null child results, and passing the collected strings to its own renderer.group once. Reject a null renderer result. If a child throws, that exception propagates before later children or group formatting are reached. Each child retains its own renderer; the parent controls only the surrounding group notation.

For a Plain Circle c of radius 2 and a Compact Box b of 3 by 4, a Plain group renders group[circle(c,2);B:b:3:4]. A Compact group around that group renders G(group[circle(c,2);B:b:3:4]). The tree determines structure and each object's renderer determines notation.

Frame retains one non-null wrapped Graphic. Implement render to call it once, reject a null result and add "[" and "]". Framing the Plain group yields [group[circle(c,2);B:b:3:4]]. Grouping framed children yields group[[circle(c,2)];[B:b:3:4]]. Child identity stays unchanged. Two Frames around one Circle yield [[circle(c,2)]]. A thrown child exception propagates.

### Lazy access and state transitions

LazyGraphic accepts a non-null Supplier<? extends Graphic>. Supplier.get takes no arguments and supplies a Graphic when called. Construction does not invoke it. isLoaded reports whether a successful non-null product has been retained.

| State before render | Event | State after call and outcome |
| --- | --- | --- |
| Unloaded | Loader throws | Unloaded; propagate exception |
| Unloaded | Loader returns null | Unloaded; NullPointerException |
| Unloaded | Loader returns Graphic | Cache that identity, then render it |
| Loaded | Product renders successfully | Keep same product; return current text |
| Loaded | Product throws or returns null | Keep same product; propagate error or NullPointerException |

Call the loader at most once per render call. After successful loading, reuse that product for every subsequent render. A mutable product can return different text each time; caching its first String would violate this contract. A loading failure permits another attempt only on a later separate render call. This single-threaded exercise owns no external resource and assigns no disposal operation. Concurrent loading and resource management require explicit synchronization, owners and failure policies.

### Intrinsic and extrinsic state

GlyphPool contains Tone values INK and ACCENT and immutable Glyph records with a char symbol and a Tone value. A valid symbol is A through Z. Null tone causes NullPointerException; an invalid symbol causes IllegalArgumentException. get validates before changing the pool and returns the same reference for repeated equal (symbol,tone) keys within that pool. Different tones use different keys. There are 26 times 2, or 52, possible keys; size counts requested distinct keys.

The private Key record supplies value equality and hashing. A Map finds the cached value by key. computeIfAbsent can create a value only when a key has no non-null mapping. The general Map contract supplies no synchronization guarantee; this HashMap-based pool is used within one thread. Shared values remain immutable so one context cannot change all others.

Placement is an immutable record holding a non-null Glyph and coordinates x/y from 0 through 1000. render returns symbol + ":" + tone + "@" + x + "," + y. Placements (A,INK,1,2) and (A,INK,5,6) render A:INK@1,2 and A:INK@5,6. Within one pool their glyph references are identical and their Placement values differ. A second pool's A/INK glyph can be value-equal but reference-distinct. Adding coordinates to the key would prevent sharing across positions.

The pool retains entries for its own lifetime. Its key space is bounded. An unbounded production key space would need a retention policy. Direct record construction is simpler when repeated state is uncommon or sharing identity is unnecessary.

### Build and completion

Implement Circle.render, Group.render, Frame.render, LazyGraphic.render and GlyphPool.get. The application check starts Bridge, Composite and Decorator; the core project finishes Proxy and Flyweight in the same saved project. Keep an object graph, call-count trace, state table and intrinsic/extrinsic inventory.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

sources.txt lists all twelve Java files. The untouched starter compiles and identifies the first unfinished method. Completed core reports Core structural contracts: 621 passed. Main prints:

\`\`\`text
group[circle(moon,2);[box(tile,3x4)];C:sun:1]
A:INK@1,2
A:INK@5,6
true
\`\`\`

Optional Placement.shift returns a fresh Placement with the same Glyph and checked coordinate addition. Math.addExact rejects int overflow with ArithmeticException; the Placement constructor rejects an out-of-bounds result with IllegalArgumentException. The original remains unchanged. Core and Main work while shift remains unfinished. The complete java -cp classes ContractTests harness checks the extension too and reports Complete structural contracts: 628 passed.

Behavior checks support the implementation contract. The design explanation also identifies the actual pressure, preserved identity/lifetime, a simpler alternative and added cost.

[List.copyOf](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#copyOf(java.util.Collection)) defines the unmodifiable list snapshot. [Map.computeIfAbsent](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html#computeIfAbsent(K,java.util.function.Function)) defines conditional lookup and synchronization limits. [Objects.requireNonNull](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html#requireNonNull(T)) defines the null failure.
`,
				contentKind: "reading",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaStructuralURL("example"),
				solutionLink: javaStructuralURL("solution")
			},
			task(
				{
					id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-structural-patterns-in-depth-application-check",
					aliases: [
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-application-misconceptions-and-readiness-check",
						"application-check",
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-application-check"
					],
					title: "Structural Patterns in Depth Application Check",
					learningPath: "core",
					content: `Open the shared scene starter. Implement Circle.render, Group.render and Frame.render. Keep the supplied Box and renderer implementations. Predict a Plain Circle c/2, a Compact Box b/3/4, their Plain group, a Frame around that group and a Plain group of individually framed children.

Construct a Group from a caller-owned list, then clear the original list. Also group the same counting Graphic twice. State retained identities, output order and render call count. Proxy and Flyweight remain the later core step. **Completion evidence:** Keep three methods, the five-output table, list ownership sketch and duplicate-child trace.`,
					ideImport: true,
					projectLink: javaStructuralURL("starter"),
					solutionLink: javaStructuralURL("solution")
				},
				"application"
			),
			task(
				{
					id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-reflection-question-which-structural-pattern-changes-the-client-view",
					title: "Reflection Question: Which Structural Pattern Changes the Client View?",
					learningPath: "core",
					content: `Choose the structural boundary for five pressures: A, Circle/Box geometry and Plain/Compact notation vary independently; B, clients render either a leaf or a group; C, optional brackets wrap existing rendering; D, an expensive Graphic is created on first use; E, many positions reuse the same letter and tone.

Name each client operation, object identity/lifetime and a simpler alternative. Compare Frame(group) with a group of Frames. Explain why Proxy and Decorator assign different responsibilities despite sharing an interface. **Completion evidence:** Keep five reasoned choices, both nesting outputs and a cost that would justify rejecting a pattern.`
				},
				"reflection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-structural-pattern-identity-and-lifecycle-contract",
					title: "Structural Pattern Identity and Lifecycle Contract",
					learningPath: "core",
					content: `Trace independent cases: A, caller clears its list after Group construction; B, the same counting Graphic occurs twice; C, a LazyGraphic loader throws first and returns a Graphic second; D, loading succeeds but the product's first render throws; E, one pool serves A/INK at (1,2) and (5,6), then another pool serves A/INK.

Record membership, identity, loader/render call counts, loaded state, exceptions and next-call behavior. Add null loader and rendered results. Distinguish list immutability, child immutability and resource ownership. **Completion evidence:** Keep the state/identity table and bounded single-threaded assumptions. This is a written contract analysis.`
				},
				"lifecycle"
			),
			task(
				{
					id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-core-project-structural-patterns-in-depth",
					aliases: [
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-core-project",
						"dpj5-structural-patterns-in-depth-core-project",
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-curriculum-dpj5-structural-patterns-in-depth-core-project"
					],
					title: "Core Project: Structural Patterns in Depth",
					learningPath: "core",
					content: `Complete the same saved project's Circle.render, Group.render, Frame.render, LazyGraphic.render and GlyphPool.get. Preserve validation, list snapshots, ordered calls, null checks, successful-product caching and bounded immutable sharing.

Keep all fourteen files and src/scene. Export and run:
\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

Core reports 621 passed. Main's four exact lines are in Core Concepts and the case inputs. Compare empty groups, duplicate children, mixed renderers, nested frames, failed loading/rendering, repeated pool keys and invalid inputs. Placement.shift stays optional. **Completion evidence:** Keep implementation, case results, call-count/state traces, intrinsic/extrinsic inventory and a justified simpler alternative before consulting the separate reference.`,
					ideImport: true,
					projectLink: javaStructuralURL("starter"),
					solutionLink: javaStructuralURL("solution")
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-understanding-check-structural-patterns-in-depth",
					aliases: [
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-dpj5-structural-patterns-in-depth-diagnostic-checkpoint",
						"diagnostic-checkpoint-structural-patterns-in-depth",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-diagnostic-checkpoint-structural-patterns-in-depth",
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-understanding-check"
					],
					title: "Understanding Check: Structural Patterns in Depth",
					learningPath: "choice",
					content: `Evaluate five proposals: A, Bridge requires a subclass for each geometry/notation pair; B, an unmodifiable child list makes every Graphic immutable; C, Frame and its child have the same identity; D, a lazy proxy should cache the first rendered String; E, pool keys must include each placement's coordinates.

Correct each using the contracts. For B/D use a mutable counting Graphic; for E compare positions sharing one A/INK Glyph. **Completion evidence:** Keep five corrections with revealing outputs or identities and a suitable case for direct construction. This optional check is written work.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-structural-patterns-in-depth-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-transfer-practice",
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-transfer-practice-structural-patterns-in-depth"
					],
					title: "Structural Patterns in Depth Transfer Practice",
					learningPath: "choice",
					content: `Use the complete message example. Compare Emphasis around a Sequence of Greeting(Plain,"a") and Greeting(Upper,"b") with a Sequence of those messages each wrapped in Emphasis. Predict exact text.

Request WordPool.READY for rows 1/2 and from another pool; construct At with row10. Trace identities, equal values and failure. Explain how a LazyNode's mutable product changes output without loading again. **Completion evidence:** Keep both nesting outputs, word/row inventory and lifetime trace. This transfer worksheet assigns no additional starter pack.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-structural-patterns-in-depth-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-extension-practice",
						"design-patterns-in-java-dpj5-structural-patterns-in-depth-supplemental-extension-practice-structural-patterns-in-depth"
					],
					title: "Structural Patterns in Depth Extension Practice",
					learningPath: "challenge",
					content: `Complete core first, then continue the same saved project. Implement Placement.shift(dx,dy) as a fresh Placement sharing the immutable Glyph. Use Math.addExact, then constructor validation of 0..1000 bounds.

Start A/INK at (10,20). Predict shifts (3,-4), (0,0), (-11,0), (0,981) and (Integer.MAX_VALUE,0). Preserve the original on success/failure. Run core before/after (621 passed), then the complete harness (628 passed). **Completion evidence:** Keep exact results/errors, new placement versus shared glyph identities and unchanged core results.`,
					ideImport: true,
					projectLink: javaStructuralURL("starter"),
					solutionLink: javaStructuralURL("solution")
				},
				"extension"
			)
		]
	};
}
