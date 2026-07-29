# Low Level Security Part 2 Practice Pack

These cases provide a complete local, defensive route through Part 2. Use only supplied toy evidence and source. No public target, third-party binary, credential, payload, gadget construction, persistence, or unbounded campaign is included.

## Part 2 Preflight Case

1. Rebuild and rerun the Part 1 capstone; attach its scope, patch, regression, and limitation evidence.
2. Record the Low-Level-Security source revision, operating system, architecture, compiler, CMake, debugger, sanitizer, and available binary-inspection tools.
3. Configure the repository's CMake 3.20/C++17 build and compile LLS13–LLS18.
4. Run one finite solution binary and compare expected with observed output.
5. Set maximum command time, input size, output size, process count, stop condition, and reset path.
6. If a shell script reports a `bash\r` interpreter error, record the CRLF defect and use the direct CMake route.

Submit: prerequisite record, version table, finite command record, observed output, platform note, and reset evidence.

## Exploitability Triage Case

Classify four supplied toy reports:

- an assertion abort reachable only from a local test flag;
- a repeatable null dereference reached by untrusted input;
- stale internal bytes crossing a public serializer boundary;
- an unchecked write changing adjacent toy frame state.

For each, record reachability, controllable input, observed outcome, mitigation evidence, preconditions, likely impact, confidence, and next defensive action. Do not infer control of execution from a crash or adjacent-state change alone.

Submit: one-row-per-report triage table and a concise maintainer note for the highest-priority observed issue.

## Stack Frame Hardening Case

A supplied toy `Frame` contains a 12-byte label followed by eight bytes of sentinel state.

1. Predict results for empty, short, 11-character, 12-character, and oversized input.
2. Compare the supplied unchecked trace with a bounded-copy trace.
3. Identify the first sentinel byte changed by the oversized case without calculating a real machine return address.
4. Define rejection, termination, and unchanged-on-failure rules.
5. Verify that the final path preserves the sentinel for every case.

Submit: copy contract, expected/observed matrix, correction, and regression evidence.

## Heap Lifetime Case

A toy session pool reuses slots and returns handles containing slot and generation.

1. Trace allocate Alice, release Alice, allocate Bob in the reused slot, inspect the stale Alice handle, and attempt a second release.
2. State ownership, valid-lifetime, release, slot-reuse, and generation invariants.
3. Add or trace generation validation before every read and release.
4. Confirm that Bob remains available while stale access and repeated release are blocked.
5. Distinguish this model from claims about a specific production allocator.

Submit: state-transition table, stale observation, corrected result, and one limitation.

## Disclosure Boundary Case

A 16-byte internal buffer previously held `token=BLUE`; its visible public result is now `ok`.

1. Mark intended public bytes, stale internal bytes, terminator, and visible length.
2. Compare serializing capacity with serializing visible length.
3. Select clearing, initialization, and length rules that expose only `ok`.
4. Add empty, exact-boundary, repeated-use, and error-path cases.
5. Record public output before and after the correction without using a real secret.

Submit: byte-boundary diagram, correction, expected/observed outputs, and regression matrix.

## Mitigation Build Matrix Case

Compare two supplied build records for the same toy program. One record enables supported sanitizer and stack-protection instrumentation; the other is a reduced-hardening comparison.

1. Record compiler, linker, executable format, optimization, and exact flags.
2. Mark each protection as observed, absent, unknown, unsupported, or not applicable on the platform.
3. Keep ASan/UBSan separate from PIE, stack protection, RELRO, NX, and fortify-style checks.
4. Explain how each observed difference changes confidence or risk wording.
5. Name the source correction and regression still required in both builds.

Submit: platform-qualified matrix and a five-sentence mitigation note.

## Control Flow Integrity Case

A supplied trace lists indirect calls from `parse` to `validate`, `validate` to `dispatch`, and `parse` to an unlisted diagnostic target.

1. Write the allowed target set for each call site.
2. Mark the valid and invalid transitions.
3. Explain what an enforced control-flow integrity policy can reject.
4. Explain why the memory defect and input boundary still require correction.
5. State the compiler, link-time, and platform assumptions needed before claiming enforcement.

Submit: transition table and a defensive risk note. Do not add addresses, gadget sequences, payloads, or executable construction.

## Patch and Advisory Case

Use the supplied LLS17 serializer behavior.

1. Record local scope, exact reproducer, intended output, observed bytes, and root cause.
2. Bound impact to the toy public-output boundary and name every unverified assumption.
3. Apply or trace the narrow clearing and visible-length correction.
4. Rerun standard, empty, boundary, repeated-use, and error cases.
5. Write an internal note with summary, affected path, impact, mitigation context, correction, verification, prevention, and remaining limitation.

Submit: reproduction-to-remediation packet. Public disclosure is not required.

## Hardening Capstone Case

Audit the supplied LLS18 toy system across three areas: bounded label writes, generation-checked session handles, and public serialization.

1. Freeze scope, source revision, assets, trust boundaries, attacker assumptions, non-goals, resource limits, and cleanup.
2. Reproduce and rank each confirmed finding by observed impact, reachability, controllable input, mitigation state, confidence, and repair urgency.
3. Patch each root cause narrowly.
4. Run standard, malformed, exact-boundary, repeated-operation, and cross-feature regressions.
5. Compare observed build protections without treating them as code fixes.
6. Prepare a maintainer packet and three-minute defensive demonstration.

Submit: ranked audit, patch set, complete regression table, mitigation matrix, residual risks, and reset evidence. No exploit artifact is part of the capstone.
