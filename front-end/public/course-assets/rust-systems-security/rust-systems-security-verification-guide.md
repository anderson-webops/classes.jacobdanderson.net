# Rust Systems Security Verification Guide

Compare this guide only after recording an independent prediction, design, or diagnosis. Equivalent implementations are valid when they prove the same ownership, failure, state, boundary, and recovery properties. Tool output is evidence with limits, not proof that a program is completely secure.

## Toolchain Baseline and Build Evidence Key

- The linked checkpoint truthfully declares Rust 2021; the course-authored copy explicitly declares Rust 2024.
- Rust 1.97.1 and Cargo 1.97.1 identify the baseline, while the manifest and lock define package configuration and resolved dependencies.
- Format establishes style conformance, Clippy reports selected lint findings, compilation checks language and type rules, tests exercise declared cases, and the run proves one observed behavior.
- `--locked` prevents an unnoticed dependency-resolution change.
- None of the checks alone proves authorization logic, panic freedom for all input, absence of unsafe-contract errors, dependency safety, or complete security.

## Ownership Resource Ledger Key

- The initial read borrow ends before the move into `normalize`.
- The earlier `original` binding is unavailable after the move, so operation 4 is invalid.
- The returned `Batch` becomes owned by `normalized` and drops at the end of its scope.
- The full `Batch` need not be cloned; read the note before the move or read it from `normalized` afterward.
- Cloning only `normalized.labels` is justified when a second independently mutable or longer-lived owner is part of the stated requirement.

## Borrowing Aliasing Refactor Key

- `first()` creates a shared reference into the vector.
- `push` needs exclusive access and may reallocate, so it cannot coexist with a returned reference into the earlier storage.
- Compute an owned normalized `String` in a small inner scope, let the shared borrow end, push a clone or move according to the return contract, and return an owned value.
- A practical signature is `fn normalize_first(labels: &mut Vec<String>) -> Option<String>`.
- A lifetime annotation describes a relationship the implementation already satisfies; it cannot make an invalidated reference valid.

## Typed Error Parser Key

- The grammar has one supported kind, one separator, a required decimal value, and a declared `u16` or narrower course range.
- Missing separator, unknown kind, missing value, invalid number, and out-of-range value remain distinct caller actions.
- Extra separators and trailing characters follow an explicit reject policy.
- Public display text names the error class without repeating the complete untrusted input.
- Every malformed case returns `Err`; no library branch uses `unwrap`, `expect`, or process exit.

## Bounds Safe Collections Key

- `[0]` is structurally complete but violates a nonempty-label rule when that rule is declared.
- `[3, 99, 97, 116]` is a complete `cat` label.
- `[4, 99, 97, 116]` is truncated.
- `[3, 0xE2, 0x98, 0x83]` is one displayed snowman encoded as three UTF-8 bytes.
- The length-13 fixture exceeds the declared maximum, and `[255]` is both over-limit and truncated.
- `checked_add(1)` plus `get(start..end)` prevents wrapped end positions and unchecked slicing; UTF-8 validation remains a separate step.

## State Machine Enum Key

- `Queued`, `Running`, `Completed { rows_written }`, and `Failed { error }` carry only data valid for that state.
- Start moves queued to running; completion and failure begin from running; terminal states reject later mutation unless a reset transition is explicitly designed.
- Private fields and constructors prevent callers from assembling contradictory booleans.
- A failed transition returns the original state unchanged or uses a design that makes atomic replacement explicit.
- Exhaustive matching makes newly added states visible at every transition site.

## Trait API Contract Key

- The consumer needs an iteration or callback boundary over record views plus a typed source error when retrieval can fail.
- Deletion and token access violate least authority and are unrelated to counting invalid records.
- A narrow contract records ordering, borrowing duration, error timing, side effects, and complexity.
- An in-memory implementation proves the algorithm without filesystem, network, credential, or global state.
- Iterator composition remains readable when fallible acquisition and record validation are not silently discarded.

## Secure CLI Parser Key

- Argument parsing precedes path access; path policy and metadata checks precede reading; the byte limit precedes full allocation and parsing.
- The implementation rejects entries outside the fixture root and does not follow a symbolic link to an unreviewed location.
- Exact size and record limits pass; one over either limit fails before deeper work.
- Pure parsing makes malformed-record tests independent from filesystem behavior.
- Stable exit codes distinguish usage, access, and content errors; diagnostics name the failure category and safe path label without echoing the full file.

## Concurrency Invariant Key

- The supplied worker error must reach the coordinator and trigger a defined cancellation or drain policy.
- Dropping every sender closes the channel; every worker exits and is joined before the program returns.
- The result set accounts for each accepted item exactly once, and the declared all-success aggregate is asserted only when no supplied worker error occurs.
- A barrier, injected worker function, or explicit event channel provides deterministic control without treating sleep duration as correctness.
- Safe Rust prevents selected unsynchronized memory access from compiling, but deadlock, starvation, wrong ordering, duplicate business work, dropped messages, and incorrect invariants remain possible.

## Unsafe FFI Boundary Key

- The helper has an off-by-one bug: `index == bytes.len()` is out of bounds. The safe solution is `bytes.get(index).copied()`.
- A C ABI contract covers null rules, valid regions, overlap, capacity, output length, ownership, lifetime, error codes, unwind containment, and maximum accepted size.
- The safe wrapper validates every precondition it can before entering the minimal unsafe call and exposes an owned or correctly borrowed Rust result.
- Ordinary tests exercise selected behavior, review checks the written contract and all callers, and Miri detects many undefined-behavior classes inside its supported model.
- Miri does not prove logic correctness, production-platform behavior, external native-library correctness, every Rust specification property, or future compiler behavior.

## Legacy Tool Hardening Capstone Key

- The legacy parser reads `input[0]` before proving nonempty input, trusts the declared length, can overflow `label`, writes a terminator out of bounds, reads the kind without proving presence, accepts trailing data, and leaves allocation and error ownership unclear.
- A Rust design uses a bounded slice, checked end positions, UTF-8 validation, an enum for supported kinds, an owned label, typed errors, and exact-consumption validation.
- Every supplied corpus entry maps to one expected success or error without panic or unbounded allocation.
- The before-and-after table limits its claim: Rust removes the demonstrated unchecked-memory path in the redesign, while logic, dependency, resource, unsafe-wrapper, and operational risks still need review.
- Final evidence records Rust 1.97.1, Edition 2024, lock state, format, Clippy, tests, advisory review, bounded corpus or fuzz conditions, optional unsafe ledger, and a reproducible command sequence.
