# Behavioral pattern cases

## Application inputs

Compare Identity, String::strip and Prefix("Review: ") on " Ready ". Trace Ready -> submit -> revise -> replace("Checked") -> submit -> approve beside a second untouched Document. Try approval in DRAFT and repeated submit in REVIEW.

## Application answers

Identity returns " Ready "; strip returns "Ready"; Prefix returns "Review: Ready " with two spaces after the colon and one trailing space. The main trace visits DRAFT, REVIEW, DRAFT, DRAFT, REVIEW, PUBLISHED and ends with Checked. The second document stays DRAFT. Approval in DRAFT and submit in REVIEW throw IllegalStateException and preserve text/phase. Valid rule input reaches the selected collaborator exactly once; null or CR/LF input fails before that call. Strategy is selected by the context caller; State behavior is selected by the current private document phase.

## Reflection inputs

Identify the decision owner for text-algorithm choice, edit permission after submission, fixed heading/line/footer order and traversal of a private queue. Choose simpler alternatives.

## Reflection answers

The caller selects a Strategy; the current Document phase controls edit/transition behavior; the final Template Method controls ordering while subclass hooks supply steps; the iterator owns a traversal position and hides membership storage. A direct function, closed enum switch, injected formatter and ordinary library iterator are appropriate alternatives when they preserve the needed contract with less indirection. Name the variation or lifetime that justifies each extra boundary.

## Alternatives inputs

Compare configured Prefix versus lambda/method reference, private phase objects versus enum switch, final skeleton versus injected functions, and explicit snapshot cursor versus the library iterator. Interleave two documents and two queue traversals.

## Alternatives answers

Prefix gives retained configuration a name; a small function can supply the same single-operation contract. Either state representation must retain legal transitions and independent document fields. Either report design must validate input first, preserve hook order and propagate failures. A standard iterator over List.copyOf(entries) preserves the same independent snapshot contract as an explicit cursor. Two documents may share immutable phase objects while owning distinct current-state references. Two iterators own distinct positions; advancing one leaves the other's next value unchanged.

## Core inputs

Predict Main's eight lines, empty Plain report, null/multiline rule input/output, approve in DRAFT, replace in REVIEW, a heading that clears the caller's list, a failing line hook, two interleaved iterators, late queue additions and exhausted next.

## Core answers

Main prints:

```text
PUBLISHED
Review: Checked
UPPER
CHECKED
DONE
End
first
second
```

Empty Plain output is Report followed by End, each with LF. Null rule input/output causes NullPointerException; CR/LF causes IllegalArgumentException. Invalid input reaches no rule call. Illegal phase operations throw IllegalStateException without changing state/text. A heading clearing the caller's list leaves the input snapshot intact. A failing line stops later lines/footer; no partial String is returned. Each iterator retains its membership and independent index; a new iterator sees later additions. Exhausted next throws NoSuchElementException; remove throws UnsupportedOperationException. Core passes 82 checks with optional matching unfinished.

## Understanding inputs

Evaluate the five Understanding Check claims, including decision ownership, shared enum objects, final method guarantees, repeated hasNext and snapshot availability.

## Understanding answers

A: a Strategy caller chooses an algorithm, while current State objects govern allowed context operations. B: the enum objects share behavior; each Document owns its mutable current phase/text. C: final protects overriding the public skeleton but hooks can still fail or have effects. D: repeated hasNext leaves the next value unchanged; next consumes one. E: snapshot policy is explicit here and is not an Iterator-wide promise. Invalid text fails before the strategy or report hooks run. A hook exception stops later hooks; this promises no reversal of earlier effects. The project is single-threaded.

## Transfer inputs

Use Gate.lock before open, then open/lock, then open again and compare another gate. Apply strip to " a " and prefix ">" to "a". Print empty/duplicate lists and clear the original Labels input before interleaving cursors.

## Transfer answers

Lock in CLOSED raises IllegalStateException and leaves CLOSED. Open then lock visits OPEN then LOCKED; another open fails and leaves LOCKED. A second gate stays CLOSED. Styles produce "a" and ">a". DashPrinter returns [] for empty and [-a|-a|-b] for ["a","a","b"]. Labels retains ["a","a","b"] after the caller clears its list. Each cursor starts at the first a and advances independently. Exhausted next throws NoSuchElementException, remove throws UnsupportedOperationException, and null lists/elements are rejected.

## Extension inputs

For ["a","b","a"], select a while adding later in the first callback. Then test a throwing predicate, null predicate, no matches and modification of the result list.

## Extension answers

The predicate visits a,b,a once each and returns ["a","a"]; the queue then has four entries including later. The result list is unmodifiable. A first-call exception stops selection immediately, preserves any earlier callback effects and returns no partial list. Null predicate causes NullPointerException before any call. Selecting nothing returns an empty unmodifiable list. Core remains 82 passed; complete checks report 91 passed.
