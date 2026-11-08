# Java foundations: inputs and worked answers

## Blob inputs

Before: ReportBlob owns validation, rendering and direct console printing.
After: Report owns validity/snapshot; TextFormatter owns rendering; ReportPublisher orders calls through injected ports; ConsoleSink owns console output; Main selects objects.
Predict title Weekly report with Ready and Checked, and title T with an empty body. Compare render and the new formatter.

## Blob answers

The outputs, in escaped notation, are "Weekly report\nReady\nChecked\n" and "T\n". Each logical line ends with LF. The final LF is part of the contract.

Move data validity and list copying to Report. Keep formatting in TextFormatter and perform one injected sink write after successful formatting in ReportPublisher. Main chooses ConsoleSink; application no longer imports or constructs it. Domain and ports remain independent of concrete adapters. The core harness reports 649 passed. Retain before/after responsibilities and output evidence as well as passing tests.

## Packages inputs

Draw imports for domain, ports, application and adapters. Main is outside these packages and selects implementations.
Diagnose: application constructs ConsoleSink; Report retains a caller's mutable list; a foreign class accesses report.title; ConsoleSink becomes package-private.

## Packages answers

domain -> Java value/collection types only. ports -> domain. application -> domain and ports. adapters -> domain and ports. Main -> concrete adapters, application and domain.

Constructing ConsoleSink in application couples the use case to an output effect and violates the declared import boundary; keep construction at Main and inject ReportSink. Retaining the mutable list lets later caller edits change an existing report; take an unmodifiable snapshot. report.title is private, so use public title(). A package-private ConsoleSink is inaccessible to Main in another package; this concrete adapter needs public visibility at the current composition boundary. Internal helpers can remain less visible.

## Seam inputs

Context A: one-off fixed console report script.
Context B: maintained publisher, replaceable destinations, tests with no network/disk/clock effects.
Choose function, interface or abstract class. For B, predict recorder calls after one successful format and after a throwing formatter. Explain one cost.

## Seam answers

A can keep a plain formatting/printing function when no substitution or test seam is required. B benefits from constructor-injected ReportFormatter and ReportSink: the recorder supplies the same write contract in memory. Success produces one formatter call and one sink write; a formatter failure produces zero writes.

The interfaces add types and object wiring, justified here by the destination boundary and a real test substitute. An abstract class is useful when implementations need a stable shared algorithm or inherited state; it also commits each subclass to that single superclass. Independent formatting and destination operations do not need that shared base. A decision record identifies the actual requirement and the preserved behavior rather than selecting a pattern by habit.

## Types inputs

Report("T", ["one"]) with TITLE_ONLY and FULL; Report("T", []) with FULL.
Predict the lambdaExample result. Explain a caller-list mutation after Report construction, and whether a foreign class may implement Outcome or ReportFormatter.

## Types answers

TITLE_ONLY -> Published("T\n"). FULL -> Published("T\none\n"). Empty-body FULL -> Refused("No body"). lambdaExample -> "Weekly report\n".

The preview requires a body even though Report and TextFormatter permit an empty body. A caller-list change leaves this Report unchanged because its constructor snapshots the list. A record with a raw mutable list reference would not provide that guarantee.

Outcome is deliberately closed to Published and Refused; an unpermitted external implementation is rejected by the compiler. ReportFormatter is open so adapters and test doubles can implement it. Report represents data, PreviewMode represents two fixed choices, and the sealed family supports exhaustive handling. Additional Builder, State, or Visitor machinery would need further requirements.

## Contract inputs

Use a valid Report and a fake formatter returning "fake\n". Then consider a formatter that throws, a formatter returning null, and a sink that throws. Record formatter/sink calls, propagated failure, and whether any retry is required.

## Contract answers

| Path | Formatter calls | Sink calls | Result |
| --- | --- | --- | --- |
| Formatter returns fake + LF | 1 | 1 | Recorder retains exact fake + LF |
| Formatter throws IllegalStateException | 1 | 0 | Same failure propagates |
| Formatter returns null | 1 | 0 | NullPointerException |
| Sink throws IllegalStateException | 1 | 1 | Sink failure propagates |

There is no retry or rollback promise. A constructor rejects null collaborators, and publish(null) fails before calling either collaborator. The recorder is a private test implementation of the public ReportSink port; application depends on the port and does not import the fake or console implementation. The tests verify effects through calls and stored strings without real external I/O.

## Core inputs

Inputs: title T with [], [""] and ["one"]; title Weekly report with ["Ready","Checked"]; caller-owned ["one"] changed after Report construction.
Refuse null title/list/body elements, blank title and embedded CR/LF.
Build with sources.txt and run the core harness and Main. Leave the optional uppercase method unfinished until core acceptance.

## Core answers

| Report | TextFormatter output in escaped notation |
| --- | --- |
| T, [] | T\n |
| T, [""] | T\n\n |
| T, ["one"] | T\none\n |
| Weekly report, ["Ready","Checked"] | Weekly report\nReady\nChecked\n |

The caller's later list addition does not change the existing report; its returned list cannot be mutated. Null values throw NullPointerException. Blank titles and embedded CR/LF throw IllegalArgumentException.

The completed core harness reports Core foundations contracts: 649 passed. Main prints the three Weekly report lines. The optional method may still throw when reached by the complete harness; it is not required by the core commands. Preserve package declarations and all source paths. A complete submission also explains list ownership and traces one successful publication and one formatter failure with zero writes.

## Understanding inputs

A: record stores the caller's ArrayList, then caller appends a second body line.
B: ReportPublisher creates ConsoleSink internally.
C: publisher writes the formatted document twice.
D: test supplies a recorder implementing ReportSink.
For each, identify an effect, repair and test. Explain the visibility choices.

## Understanding answers

A exposes caller-owned mutation: the report grows from one to two lines. Snapshot the list and test both caller mutation and accessor mutation.
B hides a concrete effect inside application. Inject the sink through the constructor; verify with a recorder and the package-import rule.
C violates one publication -> one write. Remove the duplicate and assert recorder.calls == 1 with the exact text.
D is a useful seam: the test observes output without performing real console/network/file work.

Public ports and required cross-package adapters are accessible to clients. Private fields hide collaborator references and record components. Package-private types are confined to their package. final classes close subclassing; that does not by itself freeze referenced mutable objects.

## Transfer inputs

An in-memory destination retains every string passed to ReportSink.write. Publish Report("T", ["one"]) twice with the existing TextFormatter and ReportPublisher.
Sketch destination state, its write operation and construction at Main. Then let the destination throw on its second call. This is a design worksheet, not an extra supplied executable.

## Transfer answers

Two successful calls retain ["T\none\n", "T\none\n"] in order; the sink call count is 2. Each publish formats once and writes once. Main constructs or supplies the new destination through ReportSink; application code remains unchanged.

A list and recorded::add method reference can be sufficient for a small test, since ReportSink is a functional interface. A named recorder is useful when call counts, failure injection or a clearer assertion surface are needed. If the second write throws, that failure propagates and the first retained entry remains. State whether the second entry was retained before the throw in the new destination's own contract; ReportPublisher provides no transaction or automatic retry.

## Extension inputs

Start from completed core work. Uppercase only the title with Locale.ROOT.
Predict Weekly report with Ready/Checked; i with body under English and Turkish default locales; T with no body. Preserve LF, body text and core behavior. Reject null Report.

## Extension answers

| Report | Extension output in escaped notation |
| --- | --- |
| Weekly report, ["Ready","Checked"] | WEEKLY REPORT\nReady\nChecked\n |
| i, ["body"], English default | I\nbody\n |
| i, ["body"], Turkish default | I\nbody\n |
| T, [] | T\n |

Locale.ROOT makes the exercise's title transformation independent of the process's default locale; body text is unchanged. Null Report causes NullPointerException.

Core remains 649 passed. The complete harness reports Complete foundations contracts: 654 passed. Main's normal text formatter still prints Weekly report, Ready, Checked. One formatter adapter implements the existing port, so neither ReportPublisher nor the sink needs a subclass or a changed signature.
