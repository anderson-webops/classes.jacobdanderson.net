# Course audit progress

## Scope and evidence boundary

The audit covers course availability, distinct delivery purposes, self-contained
student reading and instructor walkthroughs, neutral copy, core and supplemental
project placement, accurate starter/solution source, confirmed IDE imports, Juni
source fidelity, and transcript-backed teaching requirements. It remains active;
a passing catalog test is not proof that every source pack is complete.

The 2026-10-04 availability sweep used the normalized catalog at `v2.8.15`:

- All 77 catalog entries loaded successfully.
- Every directly attached `/course-assets/` project, solution, dataset, and media
  path had a corresponding file in `front-end/public`.
- This was a local source check, not an HTTP check of every external resource,
  an inline-Markdown link audit, or a production deployment check.

## Starter-import corrections

Previously, linked starter failures could fall through to a generic demo carrying
the requested project's title and source metadata. README-only starters could
also create projects without runnable source. Imports reused the read-only
preview, which intentionally cuts text at 80,000 characters and limits directory
traversal. The language bridge selected Python mode for Java source.

The corrected workflow:

- Requires explicit import confirmation and does not execute imported code.
- Imports full eligible text within the existing 120,000-byte file limit.
- Rejects oversized files, more than 80 eligible files, excessive folder depth,
  and linked-source entries rather than silently importing a partial list.
- Keeps preview caches separate from fresh import reads.
- Rejects missing source for the selected runtime and propagates download errors
  without creating a replacement demo or overwriting existing learner work.
- Shows the failure beside the confirmation controls, including empty accounts
  that do not yet have a console. Retrying downloads the requested source again.
- Opens bridge Java starters in Java mode. The C++ console-port starter keeps its
  GitHub source link and documented local compiler workflow, without a misleading
  browser-import button. This does not add a C++ browser runtime.

No dependencies, lockfiles, saved projects, course identifiers, or progress keys
were changed. Existing learner projects are not automatically rewritten.

## Unfinished source-pack finding

A read-only check of the local `Python-Level-3` reference checkout found 44
distinct starter paths linked by the normalized catalog. Eleven contained Python
source; 33 contained no Python source. For example, `AM7-Binary-Search/starter`
contained a placeholder README while the implementation lived in `solution/`.
The checkout's source manifest independently recorded 33 placeholder roles.

This is a source-pack follow-up, not a claim that the remote repository has the
same current state. Reconcile the exact public source revision before changes,
then provide assignment-specific incomplete starters and verify their solution
counterparts. Do not copy completed answers into starters or classify a README
and a nonempty repository as a ready implementation pair.

Additional source/language alignment checks remain necessary for generated
bridge extension packs. Several local folders titled as C++ practice contained
Java starters; selecting a working Java runtime does not resolve that coursework
content mismatch.

## Verification authority

Functional regression tests exercise confirmation, remote and local failure,
retry, unchanged existing work, Java source import, source-size limits, preview
cache separation, bounded directory traversal, and course resource links.
Repository-native lint, typechecking, full CI, and exact tagged release provenance
remain the delivery gates. The transcript review has a separate evidence boundary
in [zoom-followup-review.md](zoom-followup-review.md).

The broad audit remains open for assignment-level source correctness, full
course purpose and content review, justified duplication, original-source
identity reconciliation, and workflow verification across supported environments.
