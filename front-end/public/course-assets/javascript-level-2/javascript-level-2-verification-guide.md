# JavaScript Level 2 Verification Guide

Open this guide after an independent attempt. A valid result works in local files with fictional fixtures, safe rendering, bounded state, and recovery. Public APIs and hosted tools may enrich the evidence, but network access, remote writes, and browser-held secrets never determine completion.

## level-1-readiness-and-state-key

- Local HTML, CSS, and JavaScript run after refresh without CodePen.
- Declarations, conversion, strict comparisons, loop limits, and state changes match the prediction.
- A labeled form and `textContent` replace blocking or sandbox-only output in the final route.
- Markup-shaped input stays inert and the console contains no private response.
- Any weak prerequisite maps to a named JSS module.

## function-contract-and-pure-test-key

- Every helper has a clear accepted domain, parameters, return value, and side-effect statement.
- Pure calculation tests run without DOM, random, storage, or network state.
- Boundary and invalid cases have deliberate results.
- Rendering consumes returned values rather than recreating business logic.
- The refactor removes duplication without combining unrelated responsibilities.

## decision-table-and-ternary-key

- The written table covers all meaningful combinations and exact numeric boundaries.
- Branches are mutually exclusive and use strict comparisons after explicit conversion.
- Parentheses make compound precedence visible.
- The ternary selects one value and does not hide multiple actions.
- Reordering a branch changes only the predicted cases.

## canvas-coordinate-and-fallback-key

- CSS and drawing-buffer dimensions are distinct and deliberate.
- Coordinates come from stored data and an explicit transform.
- Drawing context state is saved and restored around local changes.
- Essential stations and connections exist as DOM text or canvas fallback content.
- Narrow, resize, high-pixel-ratio, unavailable-canvas, and reset cases are recorded.

## array-transform-and-grid-key

- The selected iterator matches the requested transformation.
- Source mutation is intentional and documented; otherwise the original array remains unchanged.
- Empty, duplicate, and invalid values produce defined outputs.
- Every 2D row is validated before column access.
- Dimensions and total work remain under the stated cap.

## object-model-and-animation-state-key

- Every object has a stable identity and validated required fields.
- State updates and rendering are separate.
- Fixed-step logic tests prove position and active-state behavior.
- Unknown fields cannot enter drawing or update logic accidentally.
- Rendering leaves domain state unchanged.

## logic-data-canvas-checkpoint-key

- The checkpoint follows JSM6 in the normal sequence.
- Function, conditional, array, object, and canvas reasoning each have runnable evidence.
- Fixed, boundary, malformed, empty, repeated, reset, and canvas-unavailable cases are present.
- Essential result text and a clean console accompany the drawing.
- The learner names a revisit module before comparing solutions.

## event-normalization-and-input-key

- Named listeners attach exactly once and have a teardown or disabled state.
- Pointer coordinates account for the element bounding rectangle and drawing scale.
- Handled keys change state only while the interaction is focused.
- `preventDefault` applies only to a handled key in that state; ordinary page scrolling works elsewhere.
- Pointer, keyboard, unrelated key, blur, repeat setup, cleanup, and visible focus all pass.

## collision-boundary-key

- Each helper documents shape inputs and whether touching edges collide.
- Detection has no score, sound, velocity, removal, or rendering side effect.
- Separated, touching, overlapping, contained, corner, zero-size, and crossing cases match the table.
- A sustained overlap creates one event until separation resets eligibility.
- The debug overlay can be disabled without changing detection.

## bounded-game-loop-key

- Ready, running, paused, complete, and reset transitions are explicit.
- Only one animation-frame handle is active, and stop cancels it.
- Delta time and spawned object counts are capped.
- Controls are semantic, focus-aware, keyboard and pointer operable, and reduced-motion compatible.
- DOM text reports instructions, score, lives, status, and outcome; background, pause, restart, and budget tests pass.

## resilient-fetch-and-fixture-key

- The supplied fixture passes through the same validation and rendering path as remote data.
- `response.ok`, abort or timeout, shape and size checks, and one-active-request behavior are present.
- Successful reads are cached and repeated requests avoid unnecessary provider traffic.
- Offline, non-OK, timeout, abort, malformed, unexpected-URL, stale-cache, and recovery states are visible.
- No API key, personal input, unbounded retry, or remote write exists.

## relational-schema-and-query-key

- Primary and foreign keys, cardinality, optionality, and delete behavior agree.
- Inner and left join predictions handle unmatched books and empty shelves correctly.
- The junction table prevents duplicate book-author pairs.
- Every query prediction names columns, rows, ordering, and `NULL` behavior.
- Mutations preview exact targets and include transaction or rollback intent without touching a live database.

## local-crud-and-persistence-key

- Load validates version, shape, IDs, text, booleans, length, and count before state use.
- CRUD operations use stable IDs and preserve unrelated records.
- Rendering uses safe text and native controls.
- Version-1 strings migrate once into valid version-2 objects.
- Missing, malformed, unsupported, duplicate, unknown, quota or unavailable storage, refresh, and reset cases recover deliberately with no browser secret.

## events-requests-data-checkpoint-key

- The checkpoint follows JSM12 in the normal sequence.
- Event normalization, fixture and optional request flow, relational prediction, and local CRUD each have evidence.
- Focus-aware keyboard and pointer paths pass.
- Network and storage failure preserve understandable local state.
- Weak criteria map to a named JSM7–JSM12 revisit before the key is used.

## safe-message-board-key

- Posts and comments are bounded versioned fictional records with stable IDs.
- Text renders inertly, and URLs pass protocol and reviewed-origin validation.
- Failed images have useful fallback text.
- Comment updates target the intended post and focus/status remain predictable.
- Duplicate, markup-shaped, invalid URL, failed image, unknown ID, cap, malformed storage, migration, refresh, delete, and reset cases pass without public posting.

## accessible-quiz-state-machine-key

- Loading, ready, asking, feedback, complete, and reset transitions are explicit.
- Each question can affect score once.
- Question, progress, score, feedback, status, and final result remain in DOM text.
- Native controls support keyboard and pointer use, visible focus, and reduced motion.
- Correct, wrong, empty, duplicate, final, empty or malformed fixture, canvas unavailable, complete, and restart cases pass without remote storage.

## browser-app-capstone-key

- One audience, task, and set of non-goals control scope.
- Pure logic is separate from DOM, canvas, storage, and optional request effects.
- A supplied-fixture route is complete; no browser secret or remote write is required.
- Frame, object, record, text, request, retry, and storage budgets are enforced.
- The packet includes state and event models, data contract, expected and observed cases, request and storage failures, keyboard and pointer evidence, focus and status, canvas alternative, motion, contrast, reflow, reset, regression, attribution, privacy choices, limitations, and a three-minute demonstration.
