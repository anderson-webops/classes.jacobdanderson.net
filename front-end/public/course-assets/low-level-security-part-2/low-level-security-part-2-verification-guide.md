# Low Level Security Part 2 Verification Guide

Compare this guide with completed independent work. It defines evidence criteria and bounded conclusions rather than supplying project source.

## Part 2 Preflight Key

- Part 1 capstone evidence is present before advanced analysis begins.
- The source baseline is CMake 3.20 with C++17; actual local versions and source revision are recorded.
- LLS13–LLS18 compile through the direct CMake path and at least one finite solution run matches its expected behavioral summary.
- Tool availability is separated from program correctness.
- Time, input, output, memory, process, stop, and reset limits are explicit.
- The repository verification and LLS16 matrix shell scripts currently use CRLF line endings; a Unix `bash\r` failure is recorded rather than counted as a successful script run.

## Exploitability Triage Key

- Every row separates reachability, controllable input, observed outcome, mitigation evidence, preconditions, impact, confidence, and next action.
- An assertion abort, repeatable null dereference, disclosure, and adjacent-state corruption are not treated as equivalent.
- Corruption evidence raises priority but does not by itself prove control of execution.
- The maintainer note uses bounded language and names what further defensive evidence would change the classification.

## Stack Frame Hardening Key

- The frame is an explicit toy layout, not a claim about a real compiler's stack arrangement.
- A 12-byte C-style label stores at most 11 visible characters plus its terminator.
- Input is validated before copying; rejection leaves label and sentinel state valid.
- The final matrix covers empty, short, 11-character, 12-character, and oversized input.
- Stack-protection evidence is an added layer; bounded source behavior and regressions remain required.

## Heap Lifetime Key

- The stale handle is invalid after release even when its slot is reused.
- Generation and active-state checks occur before a read or release.
- Bob's current handle remains valid while Alice's stale handle and repeated release are blocked.
- The report separates the toy pool's behavior from production allocator assumptions.
- Ownership, release, reuse, and invalidation invariants are explicit.

## Disclosure Boundary Key

- Only the two visible bytes for `ok` cross the public boundary.
- Capacity is not used as the public serialization length.
- Clearing or initialization prevents stale state from surviving reuse, and visible-length logic prevents unintended bytes from being emitted.
- Empty, exact-boundary, repeated-use, and error paths are verified.
- The example uses fictional bytes and does not expose a real token or secret.

## Mitigation Build Matrix Key

- Every entry is observed, absent, unknown, unsupported, or not applicable; no protection is inferred only from a label.
- Compiler instrumentation such as ASan/UBSan is distinguished from deployment hardening and executable-format properties.
- Linux ELF checks and macOS Mach-O checks are not presented as interchangeable.
- Fortify behavior records optimization and library assumptions.
- Both build variants still require the same root-cause patch and regression.

## Control Flow Integrity Key

- Allowed indirect targets are defined per call site.
- The unlisted diagnostic transition is invalid under the supplied policy.
- The note states the compiler, link-time, runtime, and platform assumptions behind enforcement.
- Control-flow integrity constrains selected transfers; it does not repair the memory or input-validation defect.
- The work contains no address calculation, gadget chain, payload, or executable construction.

## Patch and Advisory Key

- Scope, reproducer, intended output, observed bytes, root cause, and unverified assumptions are separate fields.
- Impact is limited to the supplied toy serializer evidence.
- The correction addresses both stale storage and visible-length behavior.
- Standard, empty, boundary, repeated-use, and error cases pass afterward.
- The internal note contains correction, verification, prevention, and residual limitation without requiring public disclosure.

## Hardening Capstone Key

- The packet freezes source revision, local scope, trust boundaries, attacker assumptions, non-goals, finite resource limits, cleanup, and reset.
- Findings are ranked from observed evidence and confidence, not dramatic output.
- Bounded writes, generation-safe handles, and public serialization each receive a root-cause correction and regression set.
- The mitigation matrix changes context but does not replace a patch.
- The final demonstration is reproducible, defensive, and maintainer-facing.
- No public target, weaponized artifact, credential, persistence step, or claim beyond the toy system appears.
