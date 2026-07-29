# JavaScript Level 1 Verification Guide

Open this guide after an independent attempt. The entries describe evidence and decision rules rather than one exact visual design. A valid result uses fictional data, current browser standards, safe text rendering, bounded work, and a documented local fallback for any external host or library.

## variables-types-and-private-input-key

- The fixed title uses `const`; only a value that changes uses `let`.
- String, number, and boolean values remain distinguishable in code and output.
- Quantity conversion rejects `""`, `NaN`, and infinity before calculation.
- Markup-shaped text appears literally because rendering uses `textContent`.
- The record contains no real learner identity or response.

## operators-conversion-and-randomness-key

- Inputs are converted once at the boundary.
- Parentheses make the intended precedence visible.
- Inclusive random integers follow `Math.floor(random * (max - min + 1)) + min`.
- Fixed substitute random values prove both endpoints.
- Invalid or negative values take an explicit path rather than producing a misleading total.

## loop-range-and-stop-condition-key

- The `for` loop has a known inclusive or exclusive range that matches the prediction.
- The `while` loop changes the value used by its condition on every normal iteration.
- Counts above the stated cap are rejected or reduced before work begins.
- Generated values are collected before one rendering pass.
- The trace identifies the exact boundary or update responsible for each supplied defect.

## functions-accumulators-and-generated-values-key

- Each function has one named responsibility and a clear input/output contract.
- Accumulation starts from a deliberate identity value and changes in one location.
- Fixed generated inputs make tests repeatable.
- Rendering does not hide calculation or generation logic.
- Fictional generated strings are not labeled secure passwords.

## conditional-rule-table-key

- Every valid value maps to exactly one row in the written rule table.
- Strict equality is used for exact comparisons.
- Branch order cannot swallow a narrower boundary inside a broader range.
- Invalid conversion has its own result.
- Any secret-word exercise is labeled as practice logic rather than account security.

## compound-condition-and-truthiness-key

- Named booleans match the written truth table.
- Parentheses communicate mixed AND/OR precedence.
- Negation applies to the intended expression.
- Truthy and falsy samples are observed, but validation uses the actual domain rule.
- FizzBuzz checks the combined case before either single-divisor case.

## native-svg-shape-key

- SVG dimensions and coordinates are deliberate.
- The circle center is calculated from the square position and dimensions.
- Repeated elements use a group or generated structure.
- A title, description, or adjacent text conveys the visual meaning.
- The native result works with D3 absent; any D3 comparison records version 7.9.0.

## nested-loop-pattern-and-work-budget-key

- The outer loop owns rows and the inner loop owns columns.
- Expected work equals rows multiplied by columns.
- Both dimensions and total generated items are capped.
- Data generation can be tested independently from DOM insertion.
- Zero and over-budget requests return a deliberate result without heavy work.

## fundamentals-checkpoint-key

- The checkpoint follows JSS8 in the normal sequence.
- Variables, conversion, operators, a function, a loop, a conditional, and calculated SVG placement all have visible evidence.
- A prediction and one boundary or invalid case accompany each topic.
- The console is clean and reset is repeatable.
- The learner identifies a revisit module before using any reference solution.

## semantic-html-and-css-key

- Landmarks and headings communicate the document without layout styles.
- Controls have programmatic labels and actions use the correct native element.
- Selectors style meaningful elements without replacing their semantics.
- DOM/source order remains useful with CSS disabled.
- Core content remains readable when JavaScript is unavailable.

## events-animation-and-reduced-motion-key

- Events change state; a render function reflects that state.
- Repeated start does not create duplicate animation loops.
- Stop and reset leave a known stable state.
- Keyboard and pointer paths reach the same primary actions.
- Reduced-motion preference produces an immediate or substantially reduced transition.

## box-model-positioning-and-reflow-key

- Measured box size matches content plus padding and border under the selected box-sizing rule.
- Positioned decoration has a deliberate containing block and does not cover content.
- Normal-flow content remains readable at all three viewports.
- At 200% zoom, controls, text, and focus stay visible without two-dimensional scrolling for ordinary content.
- The record names and corrects one concrete layout failure.

## component-library-and-native-fallback-key

- Semantic structure and controls exist before Materialize loads.
- Links and buttons match their behavior.
- Any Materialize component records version 2.2.2 and initialization.
- Removing the library preserves content and core operation.
- Keyboard order, visible focus, labels, and narrow reflow are verified.

## grid-source-order-and-responsive-key

- Source order communicates the same sequence as the visual layout.
- `repeat` and `minmax` create a flexible layout without fragile fixed placement.
- Keyboard order does not jump to match decorative visual rearrangement.
- Long content and a missing image do not break the grid.
- All three viewport checks are recorded.

## dom-state-and-safe-rendering-key

- Input normalization, state mutation, rendering, and event handling are separate named steps.
- The rendered list is derived from state rather than accumulated accidental DOM state.
- Learner text uses `textContent` and markup-shaped input remains inert.
- Add, remove, repeat, invalid input, and reset produce predictable results.
- Focus and status remain understandable after a dynamic update.

## web-experience-checkpoint-key

- The checkpoint follows JSS14 in the normal sequence.
- Semantic structure, responsive layout, event-driven state, safe rendering, and accessible motion all have evidence.
- Keyboard, focus, narrow viewport, malformed input, reset, and console checks pass.
- The page keeps meaningful content without D3 or Materialize.
- Failed criteria map to a named JSS9–JSS14 revisit.

## accessible-interactive-site-capstone-key

- One audience and primary task govern the content and interaction.
- Semantic HTML and source order remain useful before JavaScript.
- Named functions separate normalization, state, rendering, and events.
- The original SVG or DOM interaction includes an equivalent text result.
- The packet covers keyboard, pointer, focus, status, contrast, reduced motion, narrow reflow, boundaries, repetition, reset, console output, external dependencies, attribution, privacy choices, regression evidence, and limitations.
