# Copy and boundary cases

## Application inputs

Create a caller-owned Line("book", 6) and a list containing it. Construct OrderDraft("Class order", list), then set the caller's line to 2. Copy the draft, change the copy's book line to 9, and add Line("pen", 1) to the copy. Compare totals and Line identities. Try clearing the copy's lines list.

For each fresh adapter case, use quantity 4, 5, 9 or 10 with LegacyPrice.Standard. Record the exact request String and returned BigDecimal value/scale. Also try quantity -1 and a legacy stub returning "EUR 18.00" for quantity 6.

## Application answers

The caller's line becomes 2, the draft stays at 6, and the modified copy totals 10. The draft and copy are distinct objects with distinct owned mutable Line objects. Their immutable name/title Strings may be shared. The lines list is structurally read-only, so clear throws UnsupportedOperationException; editing a contained Line is allowed.

### Quantity 4

The request is "4"; the response is "USD 14.00"; the typed value is BigDecimal("14.00") with scale 2.

### Quantity 5

The request is "5"; the response is "USD 15.00"; the typed value is BigDecimal("15.00") with scale 2.

### Quantity 9

The request is "9"; the response is "USD 27.00"; the typed value is BigDecimal("27.00") with scale 2.

### Quantity 10

The request is "10"; the response is "USD 25.00"; the typed value is BigDecimal("25.00") with scale 2. The all-units bulk tier explains the drop from 9 to 10.

Quantity -1 raises IllegalArgumentException before a legacy call. The EUR response raises IllegalArgumentException after exactly one call. A new list sharing the original mutable Line would fail the copy-mutation case.

## Reflection inputs

A is an immutable shared USD setting. B is a mutable session counter with two independent sessions. C is a pricing dependency replaced by independent 1.00 and 2.00 test fakes. Choose lifetime/wiring, trace two calls on the first counter and one on the second, and state a limit of Singleton plus a concurrency concern.

## Reflection answers

### A: immutable setting

One application-owned instance passed explicitly is sufficient. An immutable enum constant is also a reasonable shared value within its defining class. Another process or independently defining class loader can have a separate instance. A single global access point can still constrain future configuration.

### B: session state

Construct one Counter per session. The calls return 1, 2, 1. Reusing a hidden shared mutable Counter would make the third result 3 and couple tests/sessions. One instance does not supply synchronization or make compound operations atomic.

### C: replaceable pricing

Pass the PricePort into each QuoteFacade constructor. Independent fakes return 1.00 and 2.00 without resetting global state. The chosen service owner controls its lifetime. A static mutable singleton would introduce cross-test coupling and replacement cost.

## Risk inputs

Use a fresh object/spy per case. A copies a list but shares its mutable Line elements, then changes the copy's line. B calls PriceAdapter.total(-1). C adapts response "USD 18.0" at quantity 6. D quotes a draft with two 600-unit lines through a spy PricePort. E quotes a valid draft with a fake port returning BigDecimal("18.0"). F quotes a valid draft with a fake port throwing IllegalStateException. Also trace a valid six-unit quote with a fake returning 18.00. Record ownership, outcome and call counts.

## Risk answers

### A: shared mutable element

Changing the copy also changes the original's Line, violating independent ownership. This is an observable wrong state rather than an automatic exception. No price request is needed to expose it. Copy each owned mutable Line.

### B: invalid request

The adapter raises IllegalArgumentException before a legacy request. The legacy call count is zero.

### C: invalid foreign response

The adapter calls legacy once, then raises IllegalArgumentException because exactly two fractional digits are required.

### D: invalid aggregate

The facade computes 1200 and raises IllegalArgumentException before calling its PricePort. The spy port count is zero, so an adapter behind that port would make zero legacy calls.

### E: invalid typed result

The fake PricePort is called once. Quote validation rejects scale 1 with IllegalArgumentException. No legacy request occurs because this case injects the fake directly.

### F: port failure

The fake port is called once and its IllegalStateException propagates. No retry is promised. A custom port could already have caused external effects; this workflow supplies no rollback guarantee.

### Valid path

The facade snapshots a six-unit draft, calls the fake once, and returns "Class order: 6 units = USD 18.00\n" for that title. Later draft edits preserve the immutable Quote's components. Adapter tests isolate foreign translation; facade tests can use a typed fake and isolate sequencing without a real legacy implementation.

## Core inputs

Quote an empty draft titled T. Quote one-line drafts of 4, 5, 9 and 10 units using Standard prices. Copy and mutate a six-unit draft. Try two 600-unit lines, a null draft, null constructor dependency, and price results null, -1.00 and scale-one 18.0. Preserve a valid and failed call trace, then run the documented Java 21 commands.

## Core answers

An empty T draft gives "T: 0 units = USD 0.00\n". Totals at 4/5/9/10 units are 14.00/15.00/27.00/25.00 with scale 2. A prototype copy owns fresh mutable Lines; caller/copy edits leave earlier owners unchanged. A later draft edit also leaves a previously returned immutable Quote unchanged.

Aggregate 1200 is rejected before pricing. Null draft/dependency causes NullPointerException; a null price causes NullPointerException after one price call. Negative or wrong-scale price causes IllegalArgumentException after one price call. A price exception propagates with no retry. A sufficiently large int sum can separately raise ArithmeticException before pricing.

The untouched starter compiles and identifies unfinished prototype work. Completed core reports 4064 passed; Main prints "Class order: 6 units = USD 18.00\n". Core and Main remain usable with copyWithTitle unfinished. A complete implementation also needs an ownership sketch, translation/facade trace and justified design alternative.

## Understanding inputs

A says an ArrayList copy always makes mutable elements independent. B says Cloneable automatically provides deep copy. C says Singleton is inherently thread-safe. D says Adapter and Facade have the same responsibility because both delegate. Explain each using the supplied examples and one revealing test.

## Understanding answers

A fresh list can still share mutable elements. Mutating a copied draft's Line must not alter the original; immutable String elements in the note example can safely be shared. Cloneable marks the default cloning mechanism's eligibility, not a public deep-copy policy. Object.clone copies fields by default, so an explicit ownership/copy contract is still required.

A single instance does not synchronize mutable operations. Two session counters should produce independent sequences; sharing one changes their results. Adapter translates the foreign string API to PricePort or NoteSource. Facade coordinates a caller-facing workflow through those typed contracts. Malformed foreign text exposes translation behavior; a fake typed port exposes facade sequencing independently. A fixed Note value can use direct construction; one calculation can use a plain function.

## Transfer inputs

Use the public worked example. Adapt "T|Ready|", "T", "|Ready", null and "T|bad\nline". Each case has a fresh legacy spy. Record the title/body, facade output or failure, and fetch count. Then render a fake NoteSource returning Note("Local", ["one"]) with no legacy parser. State one pipe-format limitation.

## Transfer answers

### Trailing field

"T|Ready|" becomes title T and body ["Ready", ""]. Facade renders "T\nReady\n\n". One load through the adapter makes one legacy fetch.

### Title only

"T" becomes title T with an empty body and renders "T\n". There is one legacy fetch.

### Blank title

"|Ready" is refused with IllegalArgumentException after one legacy fetch.

### Null response

Null is refused with NullPointerException after one legacy fetch.

### Embedded newline

"T|bad\nline" is refused with IllegalArgumentException after one legacy fetch. Here \n denotes the actual LF in the returned field.

### Typed fake

The fake renders "Local\none\n" with one NoteSource.load call and zero legacy fetches. Literal pipes cannot appear inside fields because this format has no escaping convention. A richer format would need its own parser and validity contract.

## Extension inputs

Create OrderDraft("Original", [Line("book", 6)]), then call copyWithTitle("Variant"). Change the variant's book units to 9 and add a pen line of 1. Inspect both objects, titles, totals and Line identities. Try null and blank titles. Run core before/after and then the complete harness.

## Extension answers

The original stays titled Original with total 6. The variant is titled Variant with total 10 and owns different mutable Lines. Changing the variant does not alter the original. Null title raises NullPointerException; blank title raises IllegalArgumentException; both leave the original unchanged. Copying immutable name/title Strings is safe, while editable Lines need independent ownership.

Core continues to report 4064 passed. The complete harness additionally verifies the optional titled copy and reports 4071 passed. Preserving core usability distinguishes this optional continuation from required implementation work.
