# Structural pattern cases

## Application inputs

Use Plain Circle c radius2 and Compact Box b width3 height4. Predict each leaf, their Plain group, Frame(group), and a Plain group of framed leaves. Construct a Group from a mutable list, then clear that original list. Finally group the same counting child twice; its render returns x1 then x2.

## Application answers

The leaves render circle(c,2) and B:b:3:4. Their group renders group[circle(c,2);B:b:3:4]. Frame(group) renders [group[circle(c,2);B:b:3:4]]. Grouping framed leaves renders group[[circle(c,2)];[B:b:3:4]]. The caller's clear leaves Group membership unchanged; child references remain the original objects. The repeated counting child renders twice in occurrence order, producing group[x1;x2]. Bridge separates geometry/notation, Composite orders child calls, and Decorator adds a layer around one child call.

## Reflection inputs

Select a pattern and simpler alternative for independent geometry/notation, leaf/group rendering, optional brackets, first-use construction and repeated glyph data. Explain preserved identity or lifetime.

## Reflection answers

Independent variations suggest Bridge; fixed combinations can use direct methods. A hierarchy suggests Composite; a flat sequence can use a loop. Brackets suggest Decorator; one-off formatting can use a function. First-use construction suggests Proxy; inexpensive products can be constructed directly. Repeated immutable glyph data suggests Flyweight; infrequent values can be constructed as records. Wrappers have new identities; children/products remain separately identifiable. Frame(group) wraps the aggregate; a group of Frames wraps each child. Proxy controls access/lifetime; Decorator supplies a visible layer. Each choice adds interfaces, indirection or retention, so name the actual pressure before adding it.

## Lifecycle inputs

Trace independent cases: caller clears Group input list; one child appears twice; loader throws then succeeds; loaded product render throws then succeeds; loader returns null; loaded product returns null. Compare same-key glyphs within/across pools and different placement coordinates.

## Lifecycle answers

Clearing the input list leaves Group membership unchanged; children() cannot be structurally modified. Retained child identity permits an arbitrary child to remain mutable. Two occurrences cause two render calls. A loader failure leaves isLoaded false and calls no product render; a later separate call tries loading again. After successful loading, a product render failure leaves isLoaded true; the next call reuses that product without loading. A null load causes NullPointerException and leaves unloaded; null rendered text causes NullPointerException while retaining the successfully loaded product. A/INK repeated in one pool is the same Glyph reference; another pool's A/INK can be equal but distinct. Coordinates belong to Placement, outside the pool key. The proxy owns no external resource; the pool retains bounded entries. Both are single-threaded.

## Core inputs

Predict Main's four lines, Plain/Compact empty groups, a child or renderer returning null, labels _bad/a-b, sizes0/101, symbols @/[, null tone, and coordinates -1/1001. Compare failed loading with failed rendering, repeated pool keys and the complete harness.

## Core answers

Main prints these four lines:

```text
group[circle(moon,2);[box(tile,3x4)];C:sun:1]
A:INK@1,2
A:INK@5,6
true
```

Empty groups produce group[] and G(). Null child/renderer text causes NullPointerException. The invalid labels, sizes, symbols and coordinates cause IllegalArgumentException; null tone causes NullPointerException. Validate before changing pool state. Loader failure leaves unloaded; rendering failure after a successful load retains that product. Repeated keys share one reference within a pool, different tones are separate keys, and all 52 valid keys fill the bounded pool. Core reports 621 passed with optional shift unfinished; the complete reference reports 628 passed. Keep pattern-choice reasoning alongside these results.

## Understanding inputs

Evaluate the five Understanding Check proposals. Use a counting Graphic returning tick1 then tick2. Compare coordinates and glyph identity.

## Understanding answers

A: Bridge delegates notation and avoids a subclass for every pair. B: a snapshot protects list structure while an arbitrary retained Graphic may change. C: Frame is a separate wrapper whose wrapped() returns its original child. D: cache the successful Graphic; rendering twice yields tick1 then tick2 with one load. E: use symbol/tone as the pool key; coordinates belong to Placement. Direct construction suits a fixed inexpensive object with no independent variation or reuse pressure.

## Transfer inputs

Compare Emphasis around a Sequence of Plain a and Upper b against a Sequence of individually emphasized messages. Request READY for rows1/2, then from another pool; construct At at row10.

## Transfer answers

Emphasis(Sequence(...)) renders _[a,B]_. Sequence(Emphasis(...),Emphasis(...)) renders [_a_,_B_]. READY placements render ready@1 and ready@2 and share the Word reference in one pool. Another pool can return an equal ready Word with different identity. At row10 raises IllegalArgumentException before rendering. LazyNode retains one successfully loaded product; its mutable output may vary without loading again. Word is intrinsic, row is extrinsic. Direct enum/string values can be simpler if sharing carries no useful benefit.

## Extension inputs

Start A/INK Placement(10,20). Evaluate shifts(3,-4),(0,0),(-11,0),(0,981),(Integer.MAX_VALUE,0), preserving original state and tracing identities.

## Extension answers

Shift(3,-4) returns a new Placement at (13,16) sharing the Glyph. Shift(0,0) returns an equal but distinct Placement at (10,20), still sharing the Glyph. Shift(-11,0) produces x=-1 and raises IllegalArgumentException. Shift(0,981) produces y=1001 and raises IllegalArgumentException. Adding Integer.MAX_VALUE to 10 overflows int and raises ArithmeticException. Original state stays (10,20) after every call. Core stays 621 passed before/after the extension; the complete harness reports 628 passed.
