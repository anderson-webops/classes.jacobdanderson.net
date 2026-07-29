# Rust Systems Security Practice Pack

These deterministic cases provide the complete course reasoning path when a Rust toolchain, supported Miri or fuzzing platform, network-backed advisory refresh, C compiler, or FFI lab is unavailable. All programs, labels, bytes, dependencies, diagnostics, and findings are fictional or course-owned. The cases do not authorize work against a third-party binary, repository, service, or dependency.

## Toolchain Baseline and Build Evidence Case

Linked checkpoint:

```toml
[package]
name = "label_checkpoint"
version = "0.1.0"
edition = "2021"
```

Course-authored copy:

```toml
[package]
name = "label_checkpoint_2024"
version = "0.1.0"
edition = "2024"
publish = false
```

Recorded evidence:

```text
$ rustc -Vv
rustc 1.97.1 (stable)

$ cargo -V
cargo 1.97.1

$ cargo fmt --all -- --check
pass

$ cargo clippy --all-targets --all-features -- -D warnings
pass

$ cargo test --locked
8 passed; 0 failed

$ cargo run --locked -- packet-42!
packet-42
```

Explain what the release, edition, manifest, lockfile, formatter, linter, compiler, tests, and run each establish. Write a migration plan that preserves the linked Rust 2021 checkpoint while using Rust 2024 for the course-authored copy. Identify one security claim none of these results can prove.

## Ownership Resource Ledger Case

Program sketch:

```rust
struct Batch {
	labels: Vec<String>,
	audit_note: String,
}

fn normalize(batch: Batch) -> Batch {
	// consumes and returns the batch
	batch
}

fn label_count(batch: &Batch) -> usize {
	batch.labels.len()
}
```

Proposed operations:

1. create `original`;
2. read its count through `label_count(&original)`;
3. move it into `normalize(original)`;
4. read `original.audit_note`;
5. bind the returned value as `normalized`;
6. clone `normalized.labels` for a second independent owner;
7. leave scope.

Create a ledger with the resource, owner before the operation, operation type, owner after the operation, whether the earlier binding remains usable, and drop point. Correct the invalid operation without cloning the complete `Batch`, and justify the one clone that remains.

## Borrowing Aliasing Refactor Case

Starter:

```rust
fn normalize_first(labels: &mut Vec<String>) -> Option<&str> {
	let first = labels.first()?;
	labels.push(first.trim().to_ascii_lowercase());
	Some(first)
}
```

Required behavior:

- return a normalized owned label derived from the first entry;
- append that normalized label once;
- leave all earlier entries unchanged;
- return `None` for an empty vector;
- avoid cloning the complete vector;
- expose no reference invalidated by vector growth.

Draw the lifetime of the first borrow and the mutation. Then propose the smallest signature and implementation strategy that satisfies the behavior. Explain why adding an explicit lifetime annotation cannot repair the original conflict.

## Typed Error Parser Case

Legacy result conventions:

```text
parse("A:17")    -> 17
parse("A:")      -> -1
parse("B:17")    -> -2
parse("A:99999") -> process abort
```

Target model:

```rust
enum RecordKind {
	Alpha,
}

enum ParseError {
	MissingSeparator,
	UnknownKind,
	MissingValue,
	InvalidNumber,
	ValueOutOfRange,
}

struct Record {
	kind: RecordKind,
	value: u16,
}
```

Define the parser’s accepted grammar and the meaning of every error variant. Add bounded cases for valid input, each error, exact maximum, one over maximum, extra separator, trailing whitespace, and input whose text must not be repeated in a public error. No malformed case may panic.

## Bounds Safe Collections Case

Record format:

```text
byte 0: payload length N
bytes 1..=N: UTF-8 label bytes
remaining bytes: forbidden
maximum N: 12
```

Fixtures:

```text
[0]
[3, 99, 97, 116]
[4, 99, 97, 116]
[3, 0xE2, 0x98, 0x83]
[13, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97]
[255]
```

Design a parser using checked arithmetic and safe slice access. Classify each fixture, including whether the byte sequence is structurally complete and valid UTF-8. Add one case that distinguishes byte length from displayed character count and one case that exercises arithmetic failure without allocating.

## State Machine Enum Case

Legacy job record:

```rust
struct ImportJob {
	started: bool,
	finished: bool,
	failed: bool,
	error: Option<String>,
	rows_written: Option<usize>,
}
```

Observed contradictory values:

```text
started=false, finished=true, failed=false, error=None, rows_written=Some(8)
started=true, finished=true, failed=true, error=None, rows_written=Some(5)
started=true, finished=false, failed=false, error=Some("bad row"), rows_written=None
```

Replace the booleans and loosely related options with states such as queued, running, completed, and failed. Define the data owned by each state, the permitted events, each resulting state, and a typed invalid-transition error. Keep fields private and make partial mutation impossible through the public API.

## Trait API Contract Case

Proposed API:

```rust
trait RecordSource {
	fn all_records(&self) -> Vec<String>;
	fn delete_everything(&mut self);
	fn debug_token(&self) -> Option<String>;
}

fn invalid_count(source: &dyn RecordSource) -> usize {
	source
		.all_records()
		.into_iter()
		.filter(|record| !record.contains(':'))
		.count()
}
```

The only consumer needs to inspect records one at a time and count invalid shapes. Redesign the smallest useful trait. State ownership, ordering, failure, side-effect, complexity, and privacy contracts. Demonstrate an in-memory implementation and explain why deletion and token access do not belong in the interface.

## Secure CLI Parser Case

Command:

```text
label-audit <fixture-path>
```

Contract:

- exactly one local fixture path;
- regular file inside the supplied fixture directory;
- maximum 16 KiB read;
- one `kind:value` record per line;
- maximum 100 records;
- no write, recursion, URL, child process, or symbolic-link traversal;
- exit `0` for a valid file, `2` for usage, `3` for input access, and `4` for invalid content.

Create a boundary pipeline for argument parsing, path policy, metadata check, bounded read, UTF-8 handling, line count, pure record parsing, output, and exit status. Define tests for help, missing and extra arguments, missing file, non-regular entry, exact and over-size input, exact and over-count records, malformed line, valid file, and a diagnostic that does not echo the complete input.

## Concurrency Invariant Case

Fixed work:

```text
items: [2, 3, 5, 7, 11, 13]
workers: 3
queue capacity: 2
result: square every item exactly once
aggregate invariant: count=6 and sum=377
```

Observed event trace:

```text
send 2
send 3
worker-b complete 3 -> 9
worker-a complete 2 -> 4
send 5
worker-c error 5 -> supplied failure
send 7
sender exits without closing the channel
worker-a waits
worker-b waits
main waits for workers
```

Design completion, error propagation, cancellation, channel closure, and thread joining. Add a deterministic test seam that does not use timing sleeps as proof. State which data-race class safe Rust reduces and which ordering, deadlock, starvation, and business-invariant failures remain possible.

## Unsafe FFI Boundary Case

Unsafe helper:

```rust
fn byte_at(bytes: &[u8], index: usize) -> Option<u8> {
	if index <= bytes.len() {
		unsafe {
			Some(*bytes.get_unchecked(index))
		}
	} else {
		None
	}
}
```

Optional C ABI:

```text
int normalize_label(
    const unsigned char *input,
    size_t input_len,
    unsigned char *output,
    size_t output_capacity
);
```

First, repair the helper using safe Rust. Then, only for the supplied ABI review, write the caller and callee obligations for nullability, pointer validity, readable and writable byte ranges, overlap, output length, error codes, ownership, lifetime, unwind behavior, and maximum size. Design a narrow safe wrapper and negative tests. Classify what ordinary tests, code review, and a supplied Miri trace each establish or miss.

## Legacy Tool Hardening Capstone Case

Legacy pseudocode:

```c
int parse_record(const unsigned char *input, size_t length, Record *out) {
	unsigned char declared = input[0];
	char label[12];
	memcpy(label, input + 1, declared);
	label[declared] = '\0';
	out->kind = input[declared + 1];
	out->label = duplicate(label);
	return 0;
}
```

Valid behavior:

- record is one length byte, that many UTF-8 label bytes, and one kind byte;
- label length is 1 through 10 bytes;
- supported kinds are `1`, `2`, and `3`;
- output owns its label;
- trailing bytes are rejected.

Regression corpus:

```text
[3, 99, 97, 116, 1]
[0, 1]
[11, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1]
[3, 99, 97]
[3, 0xFF, 0xFF, 0xFF, 1]
[3, 99, 97, 116, 9]
[3, 99, 97, 116, 1, 0]
[255]
```

Produce a behavior contract, threat model, Rust 2024 data model, bounded parser, typed errors, test matrix, dependency and lock review, and before-and-after claim table. Keep the implementation safe unless an optional supplied ABI adapter creates a genuine need for a narrow unsafe boundary. For advanced evidence, use either the supplied Miri and fuzz summaries or a fixed local run with explicit case, time, input-size, artifact, stop, and cleanup limits.
