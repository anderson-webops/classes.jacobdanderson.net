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
- Gives the ZIP import control an accessible name and uses theme-aware readable
  text for the import source URL, addressing browser-discovered label and dark
  contrast failures.

No dependencies, lockfiles, saved projects, course identifiers, or progress keys
were changed. Existing learner projects are not automatically rewritten.

## Source-pack reconciliation and corrections

An untruncated public tree at Python Level 3 source revision
`d3610afbe355ce2ab3fa6747ef438bce2c83c3be` confirmed the local finding: 44 linked
starter folders, eleven with Python code and 33 structural placeholders.

[Source PR #1](https://github.com/instruction-material/Python-Level-3/pull/1)
provided six incomplete algorithm starters and fixed large-integer binary
conversion. Its integrated source was `9293c232ec7d8b318956df516836d7d4d4d04449`.

[Source PR #2](https://github.com/instruction-material/Python-Level-3/pull/2)
at integrated source `f9b62f604a0429a7081e94cff7a3c9769dd9dc7d` provides nine more
incomplete console/recursion starters, fourteen supplied function-analysis
examples without answer comments, and a complete ten-prompt mathematical
worksheet with a separate reference key. All 22 source tests passed locally
and in hosted CI. The first check-in practice remains core; AM5's extra list
and substring practice remains supplemental.

Reference corrections cover empty inputs, literal/case-sensitive palindromes,
bracket-only validation, negative maxima, stable contiguous substrings, exact
and blank assistant commands, per-session name state, and case-insensitive
language rules with specific failure messages. The site text states these
contracts. Coding imports still require confirmation and do not execute source.

Big-O analysis is a mathematical worksheet, so it keeps its readable source
and reference links without misleading code-preview or IDE-import controls.
Its verification evidence is worksheet-specific, not a coding implementation.
Function Analysis
does supply code and retains its Python import shortcut. A Python-file count is
not a correctness or readiness gate for a non-coding assignment.

[Source PR #3](https://github.com/instruction-material/Python-Level-3/pull/3)
adds six incomplete sorting starters with explicit new-list, in-place and
consuming contracts. References fix selection's suffix scan and tied-record
identity, use stable indexed merging, handle empty/singleton lists consistently,
and no longer run demonstrations or experiments during import. Sorting Comparison
remains core and reports only measured medians on fresh copies of shared, seeded
inputs after correctness checks. It excludes preparation, copying, validation
and printing from timings. All 31 source tests and the eight focused site-flow
tests passed locally; full site CI remains the delivery authority.

Ten structural placeholder roles remain open. A separate bounded review of the
eleven distinct migrated pairs found seven concrete prompt/reference mismatches,
including inexact Hailstone arithmetic, a ten-versus-twenty list count, tied-mode
ordering, a missing first-one search, a missing sorted experiment shape, absent
bubble-sort early exit, and a broken optional punctuation extension. These are
recorded follow-ups, not repairs delivered by the sorting milestone. Additional
input-domain, file-format and mutation contracts need assignment-specific review.
Those seven findings were open at the sorting milestone. The fundamentals,
check-in and record/file follow-ups below repair all seven. This closes those
specific mismatches, not the ten remaining placeholders or the broader audit.

[Source PR #4](https://github.com/instruction-material/Python-Level-3/pull/4)
at integrated source `6ed2caf76313b92163e3c450f6bd7192e518b9a5` repairs AM2
Functions Practice, AM2 Lists Practice and the AM3 Fundamentals Problem Set.
Thirty-two callable starter functions remain intentionally incomplete, with
separate reference implementations and complete learner briefs. The five
required iterative function exercises remain distinct from their two optional
challenges and the later recursion projects.

References use exact integer Hailstone and digit arithmetic, produce twenty
positive evens, and return tied modes in ascending order. Domain, case, empty-list,
fresh-output and mutation rules are explicit. Hailstone has a transition cap;
bounded examples do not prove general convergence. All sixteen fundamentals
prompts are available in the site and starter brief without requiring reference
answers. Normalized learner copy retains these full prompts and existing progress
IDs, and corrects the article when replacing instructor with course facilitator.

All 45 source tests passed locally and in exact-head hosted CI. Focused site
regressions check the complete normalized instructions and confirmed-import
workflow; full site CI remains the delivery authority. At that milestone, twenty-four authored
coding pairs, one supplied-code analysis and one worksheet are checked. Eight
distinct migrated pairs and ten coding placeholder roles still awaited verification.
The source repository's
[review ledger](https://github.com/instruction-material/Python-Level-3/blob/6ed2caf76313b92163e3c450f6bd7192e518b9a5/SOURCE_PACK_REVIEW.md)
distinguishes those boundaries. Do not copy completed answers into coding starters
or certify a nonempty folder as an implementation pair.

[Source PR #5](https://github.com/instruction-material/Python-Level-3/pull/5)
at integrated source `2a5f8d3ef1c7ec91e98219c399c849d2528edcb5` completes five
check-in/review packs with 27 incomplete callable tasks and complete briefs.
Five original supplied problem functions remain tracing/optimization inputs,
checked against their frozen source fixture; reference answers stay separate.
All 63 source methods passed locally and hosted. The matching site change
[PR #124](https://github.com/anderson-webops/classes.jacobdanderson.net/pull/124)
passed full reviewed-head and independent integrated-main CI, including real
confirmed Python import, execution, generated output reopening, exact-byte ZIP
export and saved-workspace reopening with production/API writes blocked.
The CI-attested native files are retained unchanged in immutable
[v2.8.25](https://github.com/anderson-webops/classes.jacobdanderson.net/releases/tag/v2.8.25).
Production activation remains separate and unverified.

[Source PR #6](https://github.com/instruction-material/Python-Level-3/pull/6)
at integrated source `6b7ed239bf995cc0725e71850ba6c8b83bb0629d` completes the
last three migrated pairs: Baseball Analytics, File IO and Dictionaries, and
Juni Latin with File IO. Three complete learner briefs accompany twelve matching
incomplete callable tasks, including one explicitly optional punctuation helper.

Baseball uses exact statistic keys, validated synthetic records, fresh stable
descending rankings and unchanged inputs. Dictionary reading defines surrounding
whitespace, blank/odd/duplicate policies without inventing output writing. The
translator preserves the original character-to-end-plus-ay rule and literal case,
states deliberate whitespace/line changes and keeps punctuation separately
selected. File validation and reading precede output opening; identical paths,
symlink/hardlink aliases and malformed input cannot silently overwrite source.

All 80 source methods passed locally and in exact-head
[push CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37258197420)
and [review CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37258200108),
then independently on [integrated main](https://github.com/instruction-material/Python-Level-3/actions/runs/37258283220).
Independent bounded oracles check rankings, dictionary pairs and character
translation. Original player records and all six Git input blobs match the
pre-change source byte-for-byte. Exact fixtures recognize baseline LF bytes and
the Mac's configured CRLF checkout variants, without arbitrary normalization.
The first Linux run exposed that checkout difference and was corrected against
the original Git blobs; input files and Git attributes were not changed.

The matching site briefs state every function/domain/file rule, retain titles,
core placement and progress IDs, and separate learner/reference source roles.
The AM7 explanation also distinguishes logarithmic binary-search comparisons
and index-bound runtime from the original sliced reference's linear worst-case
copying work. Full site verification for this new group is pending; the existing
v2.8.25 workflow evidence is not substituted for its own checks.

That group subsequently passed full reviewed-head and independent integrated-main
site CI. Its unchanged CI-attested native artifacts are retained in immutable
[v2.8.26](https://github.com/anderson-webops/classes.jacobdanderson.net/releases/tag/v2.8.26).
Production activation remains separate and unverified.

Thirty-two authored coding/review pairs, one supplied-code analysis and one
worksheet are checked; no distinct migrated pair remains open. Ten genuine
coding placeholder roles and other-course purpose, source and workflow audits
remain incomplete. Current source boundaries are recorded in the
[review ledger](https://github.com/instruction-material/Python-Level-3/blob/6b7ed239bf995cc0725e71850ba6c8b83bb0629d/SOURCE_PACK_REVIEW.md).

Additional source/language alignment checks remain necessary for generated
bridge extension packs. Several local folders titled as C++ practice contained
Java starters; selecting a working Java runtime does not resolve that coursework
content mismatch.

## Interactive search follow-up

[Source PR #7](https://github.com/instruction-material/Python-Level-3/pull/7)
at integrated source `2473272796d28401c2b8a3f50b472070d9272e3a` completes three
genuine coding placeholders: Reverse Number Guesser, Number Guesser and Runtime
Comparator. Thirteen matching incomplete callables accompany complete learner
briefs; the sliced recursive-search helper is explicitly optional. Completed
reference answers stay separate. Original commands, folder names, 1–100 domains,
seven-try defaults and search parameter names remain.

Computer-led guessing now distinguishes confirmed, conditionally inferred,
contradictory, exhausted and cancelled outcomes. Invalid responses retry without
consuming attempts. The supplemental player-led random-secret game validates
ASCII integer text and accepted attempts, supports injected secrets and does not
claim seven arbitrary guesses guarantee a win. These distinct purposes remain
required and optional respectively; the search experiment remains required.

The experiment uses a shared multiset/query batch, independently checked untimed
warm-ups, fresh copies and measured full-batch medians. Preparation, sorting,
oracle work, validation and printing are not timed. Original-order versus sorted
hit positions are disclosed as a confound; timings do not prove Big-O or include
the end-to-end preparation cost. Workloads and repeat counts are bounded.

All 101 native source methods passed locally, in exact-head
[push CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37263130709)
and [review CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37263164387),
then on independent [integrated main](https://github.com/instruction-material/Python-Level-3/actions/runs/37263245237).
Tests cover every default secret, exhaustive small-list membership, invalid and
terminal states, quiet imports, original incomplete signatures, real guarded
default runs, independent clocks, timer boundaries and mutation/result failures.
The optional guarded Ruff preflight refused audited-version drift; its policy
was unchanged, and the canonical native source gate passed.

Matching site briefs retain titles, progress IDs and the 86-core/4-optional
inventory. That group passed full
[reviewed-head CI](https://github.com/anderson-webops/classes.jacobdanderson.net/actions/runs/37263916323)
and independent
[integrated-main CI](https://github.com/anderson-webops/classes.jacobdanderson.net/actions/runs/37264361642).
Its exact tagged
[native build and attestation](https://github.com/anderson-webops/classes.jacobdanderson.net/actions/runs/37264829763)
produced the unchanged authenticated assets published in immutable
[v2.8.27](https://github.com/anderson-webops/classes.jacobdanderson.net/releases/tag/v2.8.27).
Downstream [PR #17](https://github.com/instruction-material/classes.jacobdanderson.net/pull/17)
and independent [fork-main CI](https://github.com/instruction-material/classes.jacobdanderson.net/actions/runs/37265017700)
passed after preserving the neutral instructor overlay. Production activation
remains separate and unverified. Thirty-five authored coding/review pairs, one
supplied-code analysis and one worksheet are checked. Seven genuine coding
placeholders and the broader course/purpose/source/workflow audit remained open.

## Crazy Name Tags follow-up

[Source PR #8](https://github.com/instruction-material/Python-Level-3/pull/8)
at integrated source `efd0cdfb190a9110ec1a160786e13f724a60153f` replaces the
structural Name Tags starter with a full learner brief, four incomplete core
callables and one optional separate-file callable. The single-file project
remains required; it teaches transformation, exact formatting and deliberate
writing before dictionary parsing and the translator's read/transform/write
pipeline. Titles, existing progress IDs and the 86-core/4-optional inventory remain.

The original literal character orders and extra LF after each core section are
preserved. Empty names give exactly three LFs. Case, spaces/tabs and Unicode code
points are literal; grapheme-aware reversal is not claimed. Reference imports
no longer prompt or truncate output. Validation precedes opening; actual writes
use UTF-8/LF and context-managed closure. Console results distinguish written,
invalid, failed and cancelled states. Optional three-file output has no section
separators, rejects aliases before writing and does not promise rollback after
an ordinary later I/O failure. All four historical sample blobs remain unchanged;
the empty core sample is not misrepresented as a new expected output.

All 118 native source methods pass locally, in exact-head
[push CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37301232728)
and [review CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37301281776),
then independent [integrated-main CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37301369734).
Seventeen new methods use independent bounded character/index oracles and real
temporary-file/console workflows. The optional guarded Ruff and Oxlint preflights
refused audited-version drift; their policy remains unchanged.

Matching site copy now states the full core and optional contracts. The native
browser regression imports the exact immutable incomplete starter and complete
README after confirmation, exercises initial Run, then edits the scaffold for a
valid Unicode-name path, supplies console input, checks generated LF/UTF-8
output, reopens it, captures the real UI ZIP download and reopens saved work.
These test-only edits verify the workflow; independent source checks verify
reference correctness. Production/API writes remain blocked. Site reviewed-head
[CI](https://github.com/anderson-webops/classes.jacobdanderson.net/actions/runs/37302611757)
and independent integrated-main
[CI](https://github.com/anderson-webops/classes.jacobdanderson.net/actions/runs/37303337648)
passed. The exact tagged native build and attestation
[run](https://github.com/anderson-webops/classes.jacobdanderson.net/actions/runs/37304026563)
produced the unchanged assets retained in immutable
[v2.8.28](https://github.com/anderson-webops/classes.jacobdanderson.net/releases/tag/v2.8.28).
Downstream [PR #18](https://github.com/instruction-material/classes.jacobdanderson.net/pull/18)
and independent fork-main
[CI](https://github.com/instruction-material/classes.jacobdanderson.net/actions/runs/37304570527)
passed. Production activation remains unverified.
Thirty-six authored coding/review pairs were checked; six coding
placeholders and the full course/purpose/source/workflow audit remain open.

## Conway simulation and ownership follow-up

[Source PR #9](https://github.com/instruction-material/Python-Level-3/pull/9)
integrated at `5e32ed800087ac4d9b0a45d28a3e815e28d58a24` supplies complete
briefs, 24 matching incomplete callable tasks and all ten unchanged original
pattern inputs. Both projects remain required: synchronous Boolean simulation
first, then owned legal turns and strategy. Existing titles, progress IDs and
the 86-core/4-optional inventory remain unchanged.

References use finite nonwrapping B3/S23 and fresh generations. Owned survivors
retain their owner, births use majority, edits precede generation and O/X turns
alternate independently of counts. Paired grow-dead/kill-opponent choices validate
before mutation. Initial/post-edit/post-generation extinction, invalid retries,
full-board passes, cancellation and bounded limits are explicit. Continuous modes
remain selectable without a promise of natural termination. Legacy filenames
resolve their own canonical sibling rather than running conflicting references.

All 144 source methods pass locally and in exact-head
[push CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37309223318),
[review CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37309230627)
and independent integrated-main
[CI](https://github.com/instruction-material/Python-Level-3/actions/runs/37309325600).
Twenty-six new methods use independent exhaustive small-board rule oracles,
fresh-row/domain checks and actual file/console tests. Frozen LF and configured
CRLF input digests allow shallow checkouts without weakening byte preservation.
Optional guarded Ruff/Oxlint refused version drift; approved policy is unchanged.

The site previously filtered out `.in` inputs. Import eligibility, filename/text
handling, upload selection, user/course-code account saving and runtime capture
now retain them, including record
line endings during capture. Full learner contracts are readable in the course.
Native browser coverage uses immutable checked starter/README/input bytes,
requires confirmation, runs the initial reminder, makes test-only valid-path
edits, reads original patterns and console moves, executes a generation, exports
the actual UI ZIP and reopens saved files. A generated `.in` probe exercises
runtime capture. These workflow edits do not replace independent reference tests.
Production/API writes are blocked. Thirty focused front-end methods and 341
back-end methods pass locally (one existing back-end test is conditionally
skipped). API fixtures verify actual accepted payloads and unchanged input
records for both account roles while retaining path restrictions. The first
local API run could not bind its isolated loopback servers in the sandbox;
the authorized rerun passed without changing tests. Full site CI and milestone delivery remain
pending; previous release checks are not substituted for them.

Thirty-eight authored coding/review pairs, one supplied-code analysis and one
worksheet are checked. Four Tic Tac Toe coding placeholders and the broader
course purpose/source/workflow audit remain open. No live activation is claimed.

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
