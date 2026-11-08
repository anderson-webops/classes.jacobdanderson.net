# Creation-pattern cases

## Builder inputs

Use Report("T", ["one"]). Build A with the untouched builder defaults. Set BOXED, includeCount true, footer "End", then build B. Change footer to "Next" and includeCount to false, then build C. Keep A and B. Try style(null), footer(null), footer("bad\nline"), and footer("bad\rline"). Compare B with the direct ReportJob constructor using the same four components.

## Builder answers

A renders "T\none\n". B renders "[T]\n| one |\nLines: 1\nEnd\n". C renders "[T]\n| one |\nNext\n". A and B retain their original outputs after later builder changes. Each setter returns the same builder. Every build creates a distinct immutable ReportJob; two builds with the same settings are equal values. The direct constructor with B's settings is equal to B. Null settings throw NullPointerException; embedded CR or LF throws IllegalArgumentException at the setter. Defaults are PLAIN, false, "". build leaves the builder's settings intact.

## Selection inputs

Choose a mechanism for A: one fixed Page configuration; B: a renderer chosen from a fixed enum with no creator hierarchy; C: an inherited export workflow with subclass-specific renderer creation; D: two product types whose style must match; E: several independent optional settings; F: a test-only creation/retrieval function. Give a cost and an observable test for each.

## Selection answers

### Case A

**Choice:** Direct Page constructor

**Test and cost:** Compare its components/rendered text; positional options can become less clear as their number grows.

### Case B

**Choice:** Named static factory with the fixed switch

**Test and cost:** Both enum choices render correctly and null is rejected; adding a choice edits this selection boundary.

### Case C

**Choice:** Factory Method in the existing creator workflow

**Test and cost:** Subclass hook called once and chosen product used; inheritance adds navigation and couples the subclass to the creator.

### Case D

**Choice:** Injected Abstract Factory for Heading and BodyLine

**Test and cost:** Both families render correctly and a mixed pair is refused; more product interfaces and implementations must agree.

### Case E

**Choice:** Fluent configuration Builder

**Test and cost:** Defaults, invalid options and independent built values; a mutable builder and duplicated construction API add maintenance.

### Case F

**Choice:** Injected Supplier or a simpler direct collaborator

**Test and cost:** Exactly one get call and the agreed null/cache behavior; the caller must state semantics beyond the Supplier interface.

Equivalent designs can be justified by different explicit assumptions. A builder does not select a product family merely because it has fluent methods. A static create method does not become Factory Method merely because of its name.

## Reflection inputs

A has three identical fixed Page constructor calls. B duplicates plain/boxed heading-body selection at three sites and one site mixes styles. Explain the current pressure, smallest useful change, added cost, revealing test, and a future condition that could change the decision.

## Reflection answers

A's repeated call syntax alone supplies little reason for a hierarchy. Retain the constructor; centralize a real repeated validation/default rule if one appears. A future new required setting or alternate implementation can justify a named factory. Test the promised Page value. B has a consistency defect: move coordinated selection to a family boundary, then inject/select the family once. A plain heading plus boxed body must fail FamilyRenderer construction before render. Extra factory/product types and one selection point are costs. If the only variation were one independently injected renderer, that smaller seam could suffice. Keep the decision tied to the observed failure and change pressure.

## Matrix inputs

Use six rows: constructor, named static factory, Supplier injection, Factory Method, Abstract Factory, fluent Builder. Record the changing decision, its owner, default/invalid contract, one test, and maintenance cost. Include cached results, a null creation hook, mixed products, and reuse of a builder.

## Matrix answers

### Constructor

**Decision and owner:** Caller chooses concrete valid value

**Contract and test:** Page rejects null title/body; fixed values render as promised

**Cost:** Caller names the class and supplies positional arguments

### Named static factory

**Decision and owner:** Static method names/selects creation

**Contract and test:** Label.named preserves text; RendererFactory checks both styles and null

**Cost:** Shared selection point changes for new fixed choices

### Supplier injection

**Decision and owner:** Caller supplies creation or retrieval function

**Contract and test:** Cached Label is permitted; supplied calls get once and rejects null

**Cost:** Freshness/null semantics need explicit agreement

### Factory Method

**Decision and owner:** Creator subclass chooses product inside stable workflow

**Contract and test:** Null report fails before hook; hook called once; null product fails

**Cost:** Inheritance and creator/product collaboration

### Abstract Factory

**Decision and owner:** Injected family chooses several related products

**Contract and test:** Heading and BodyLine styles agree; both plain/boxed text cases pass

**Cost:** Related product APIs and compatibility tests

### Fluent Builder

**Decision and owner:** Caller names optional configuration steps

**Contract and test:** PLAIN/false/empty defaults; bad footer rejected; old job unchanged after reuse

**Cost:** Mutable builder and extra methods

The simplest fixed Page case uses its constructor. A test-only retrieval seam can use a Supplier without a new creator hierarchy. A cached supplier returning the same immutable object is valid when the consumer permits it.

## Core inputs

Use title T with body [], [""] and ["one"] in both styles. Include count both false and true; footer both "" and "End". Try a plain heading with a boxed body and the reverse. In Exporter, count hook calls for a valid report and for null input. Build a job, change the builder, and inspect the old value. Also run the supplied Notes driver and native harnesses.

## Core answers

PLAIN empty body: "T\n". PLAIN one blank body item: "T\n\n". BOXED empty body: "[T]\n". BOXED one blank body item: "[T]\n| |\n". BOXED ["one"] with count and footer: "[T]\n| one |\nLines: 1\nEnd\n". Count is the number of body items, including blanks; optional count/footer are appended unboxed with LF. Mixed families throw IllegalArgumentException during renderer construction. Valid export calls its creation hook once; null input throws before the hook. Null products, metadata, or rendered text throw NullPointerException; creation failure propagates. Builder changes leave old jobs unchanged. Factories/core harnesses report 635/2101 passed, respectively. Main prints "[Notes]\n| one |\n| two |\nLines: 2\nEnd\n". The optional copy is not reached by these core commands. Preserve an actual creation trace and a justified alternative alongside these results.

## Understanding inputs

Evaluate four claims: every create method is Factory Method; unrelated factories guarantee a compatible family; a final mutable-list reference proves immutability; Supplier guarantees a fresh non-null object. Use the supplied types to explain a test for each.

## Understanding answers

Method spelling does not establish the creator/subclass hook collaboration: compare RendererFactory.forStyle with Exporters.Exporter.createRenderer. A compatible family requires related product contracts and tests for each complete pair; two factory names alone establish neither. A final reference can still point at a mutable list: Report snapshots with List.copyOf so later caller mutation cannot alter its lines. Supplier alone permits reuse and does not promise non-null; Main.supplied adds a non-null result rule and checks one get call. Test subclass dispatch/call count, mixed family rejection, caller-list mutation, and cached/null supplier behavior. A fixed Page configuration remains a direct-construction case.

## Transfer inputs

Inside a Java main method, declare local record Ticket(int id), cached = new Ticket(7), shared = () -> cached, next = new int[]{7}, and fresh = () -> new Ticket(next[0]++), with both suppliers typed Supplier<Ticket>. Let a and b be successive shared.get results and c and d successive fresh.get results. Predict all ids, identity comparisons and final counter. Specify consumer call count, caching and null-result rules.

## Transfer answers

a.id and b.id are 7; a == b is true. c.id is 7, d.id is 8; c == d is false, and next[0] is 9. This fresh lambda constructs each time, while Supplier itself imposes no freshness contract. A consumer making two requests calls its injected supplier twice when the agreed rule is once per request. Caching is acceptable if shared immutable Tickets are allowed. If distinct identity and increasing ids are required, test both requirements separately. Decide whether null is rejected at the consumer boundary and test that result. The sample counter is single-threaded and supplies no concurrent sequence guarantee. A function parameter can express this seam without a creator hierarchy.

## Extension inputs

Use Report("T", ["one"]) and ReportJob(report, BOXED, true, "End"). Call toBuilder twice. Build the first unchanged, then set its style to PLAIN and footer to "Next", leaving count untouched. Inspect the original, changed result, and second builder. Run core and complete harnesses.

## Extension answers

The two builders have distinct identities. An unchanged copy.build equals the original. The original renders "[T]\n| one |\nLines: 1\nEnd\n". The changed copy renders "T\none\nLines: 1\nNext\n". The second builder still holds BOXED, true, "End"; the original stays unchanged. Losing includeCount during copying is detected because the changed result would omit "Lines: 1\n". Every component must be transferred. Core still reports 2101 passed; the complete harness reports 2105 passed. Copying immutable Report/String values is safe here; future mutable components need an ownership rule.
