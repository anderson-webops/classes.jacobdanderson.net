# Low Level Security Practice Pack

Use these local cases when a compiler feature, sanitizer, debugger, fuzzer, network connection, or source-host account is unavailable. Every case stays inside supplied toy code and ends with mitigation or verification evidence.

## Safe Lab Preflight Case

Scenario: prepare the six LLS1–LLS6 starter/solution pairs for a reproducible C++17 lab.

1. Record operating system, architecture, compiler and version, CMake version, generator, source revision, and workspace path.
2. Define the allowed files, defensive question, maximum command time, maximum input size, one-worker limit, stop condition, and reset path.
3. Configure one warnings-and-debug build and one supported AddressSanitizer plus UndefinedBehaviorSanitizer build.
4. Run one finite solution case and record expected result, observed result, and platform difference.
5. If `verify-course-source.sh` reports a `bash\r` interpreter error on Unix, record the CRLF line-ending defect and use the direct CMake build. Do not represent the script as a successful verification.

Submit: scope sheet, version record, commands, one captured result, reset command, and one limitation.

## Memory Layout Evidence Case

Given stack, heap, global, static, read-only, string, and vector objects:

1. Predict storage duration before running.
2. Run twice and record address relationships without expecting fixed values.
3. Explain ownership and destruction for every object.
4. Interpret one supplied sanitizer excerpt by naming the first invalid access, owning object, and broken assumption.
5. Name one defect class that the selected sanitizer result does not rule out.

Submit: observation table plus a five-sentence evidence note.

## Bounded Copy Contract Case

A 16-byte destination stores a printable label and must remain a valid null-terminated string.

1. Define capacity, maximum visible length, accepted characters, and truncation or rejection policy.
2. Predict status, bytes written, and final destination for empty, short, 15-character, 16-character, oversized, and newline-containing input.
3. Implement or trace a copy that validates before arithmetic, preserves termination, and returns a named status.
4. Verify that rejection leaves a documented valid destination state.

Submit: contract, expected/observed matrix, byte dump, and one policy tradeoff.

## Defensive Parser Case

Packet shape: byte 0 is payload length, byte 1 is command, remaining bytes are printable payload. Commands 1 and 2 are allowed; maximum payload is 16 bytes.

1. Order checks so no payload byte is used before minimum shape and length validation.
2. Classify valid, too-short, length-mismatch, oversized, unknown-command, and non-printable packets.
3. Add one independent malformed packet that reaches a different rejection branch.
4. Confirm each rejected packet produces a stable named status without changing protected state.

Submit: parser contract, rejection matrix, independent case, and trace of check order.

## Integer State Invariants Case

An eight-byte ring buffer tracks `head`, `tail`, and `count`.

1. State the invariants for index range, count, free capacity, and logical byte order.
2. Trace push 4, pop 2, push 6, pop 4, then rejected pop 9.
3. Stage each operation before committing state.
4. Compare the complete state immediately before and after the rejected operation.
5. Add one exact-capacity or wraparound boundary case.

Submit: state table, invariant checks, rejection comparison, and one sanitizer limitation.

## Bounded Fuzzing Triage Case

Use only the supplied length-prefixed parser and seed corpus.

1. Set an explicit seed, one worker, maximum input length, finite run or time limit, memory limit, and output directory.
2. Mutate length, command, payload bytes, and size while preserving a count by parser status.
3. Stop at the first trustworthy sanitizer or invariant finding, preserve and reduce the input, and reproduce it outside the loop.
4. Patch the root cause narrowly and rerun the original case plus the complete saved corpus.
5. State why a clean bounded run does not prove that no defect remains.

Submit: bounds, seed, status summary, reduced case, root cause, patch evidence, and corpus rerun.

## Patch and Capstone Audit Case

The supplied packet-driven toy system stores a fixed-size label and dispatches mode commands.

1. Write the local scope, assets, trust boundaries, assumptions, invariants, and non-goals.
2. Build a malformed-input inventory covering length, command, printable data, label capacity, state transition, and repeated-operation cases.
3. Reproduce each failure with warnings, test output, or supported sanitizer evidence.
4. Select the smallest useful patch for each confirmed root cause.
5. Rerun standard, malformed, boundary, and regression cases.
6. Prepare a maintainer handoff with impact limited to observed toy behavior, residual risk, cleanup, and a three-minute demonstration.

Submit: complete defensive audit packet. No exploit artifact or public target is part of the case.
