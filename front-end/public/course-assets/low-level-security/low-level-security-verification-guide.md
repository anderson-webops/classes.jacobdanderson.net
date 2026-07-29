# Low Level Security Verification Guide

Use this guide after completing a practice case independently. The entries describe evidence criteria rather than supplying copy-ready project code.

## Safe Lab Preflight Key

- The scope names the supplied local source tree and excludes public targets, third-party binaries, credentials, payloads, persistence, and unbounded work.
- The source baseline is CMake 3.20 with C++17. The record contains actual compiler and CMake versions rather than a guessed current standard.
- A useful warnings profile includes debug symbols and common warning flags. A sanitizer profile records platform support and avoids treating `-Werror` as a universal sanitizer requirement.
- The run has finite time, input, output, memory, and worker limits plus a reset route.
- The current source verification script's CRLF interpreter defect is recorded honestly when observed; successful CMake compilation and finite binary runs are separate evidence.

## Memory Layout Evidence Key

- Storage class and lifetime are stable concepts even when concrete addresses change because of runtime layout choices.
- Stack locals commonly cluster within a frame; owned dynamic objects use heap storage; globals, statics, and literals have program-duration storage.
- Relative observations are evidence only for the recorded build and run, not a universal address map.
- A sanitizer report identifies a detected runtime violation and source path. A clean result does not establish complete memory safety, logical correctness, or absence of an unexecuted defect.

## Bounded Copy Contract Key

- A 16-byte C-style destination holds at most 15 visible characters plus a null terminator.
- Empty and short valid inputs can succeed; the exact policy determines whether 16-character and oversized inputs truncate or reject.
- Validation and range checks occur before copying or size arithmetic.
- Every return path leaves the destination in the documented valid state.
- Expected status, reported count, visible output, and byte dump agree for every matrix row.

## Defensive Parser Key

- The safe order is minimum shape, declared length range, actual length agreement, command allowlist, payload-byte validation, and only then dispatch.
- Each malformed fixture maps to one stable rejection reason.
- Unknown commands fail closed.
- No error path uses payload bytes beyond the supplied buffer or changes protected state.
- The independent case differs meaningfully from the supplied rows and reaches the intended branch.

## Integer State Invariants Key

- `head` and `tail` remain within capacity; `count` remains between zero and capacity; free space equals capacity minus count.
- Logical byte order survives physical wraparound.
- A request is validated before index or count updates are committed.
- The rejected pop leaves head, tail, count, storage, and logical contents unchanged.
- UndefinedBehaviorSanitizer evidence can reveal selected arithmetic or language violations, but explicit invariant tests remain necessary.

## Bounded Fuzzing Triage Key

- The record contains an explicit seed, one-worker default, maximum input length, finite run or time limit, memory bound, and output location.
- The harness is deterministic for a given input and does not rely on mutable global state.
- The first trustworthy finding is reproduced outside the fuzz loop and reduced without changing the failure.
- The patch addresses the root cause, and both the reduced input and prior corpus pass afterward.
- A bounded campaign samples behavior; it cannot prove that all inputs or defect classes are safe.

## Patch and Capstone Audit Key

- The audit distinguishes observation, inferred impact, root cause, patch, verification, and residual limitation.
- Trust boundaries and invariants cover packet shape, command dispatch, label capacity, printable data, and state changes.
- Standard, malformed, exact-boundary, repeated-operation, and regression cases are included.
- Each patch is narrow enough to review and tied to the evidence that exposed the issue.
- The handoff includes exact build and run commands, tool versions, cleanup, reset, and a concise demonstration.
- The outcome is defensive remediation for a supplied toy system, not an exploit or claim about an external target.
