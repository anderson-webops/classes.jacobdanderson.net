# JavaScript Level 1 Practice Pack

These cases support the required course flow without a CodePen account, CDN, or published learner data. Use local `index.html`, `styles.css`, and `script.js` files in an evergreen browser. Keep all names, responses, images, and credentials fictional. Record the browser, viewport, expected result, observed result, console state, reset route, and one accessibility check for every case.

## variables-types-and-private-input-case

Build a “fictional snack survey” with a labeled text field and submit button.

- Declare the fixed survey title with `const` and the current response with `let`.
- Store and display one string, number, and boolean.
- Convert the quantity field with `Number()` and reject empty or non-finite values.
- Render the summary with `textContent`; do not insert the response as HTML.
- Test `mango / 2 / true`, an empty quantity, and `<strong>tea</strong>`.

## operators-conversion-and-randomness-case

Create a “festival ticket calculator” with fictional prices.

- Convert quantity and discount inputs before arithmetic.
- Write one expression that makes precedence explicit with parentheses.
- Add a remainder calculation and an inclusive random seat helper.
- Test minimum and maximum seat values with fixed substitute random values.
- Record decimal, empty, negative, and non-numeric input behavior.

## loop-range-and-stop-condition-case

Generate a bounded list of practice badges.

- Use a `for` loop for badge numbers 1 through 8.
- Use a `while` loop to reduce a fictional energy value to zero.
- Predict both iteration counts before running.
- Cap requested badge count at 50 and render once after generation.
- Diagnose one off-by-one example and one missing-update example without running an infinite loop.

## functions-accumulators-and-generated-values-case

Refactor a fictional arcade-score generator.

- Create separate functions for normalization, bounded random values, accumulation, and formatting.
- Give every function parameters and a return value unless its single job is rendering.
- Test generated values with a fixed sequence before using `Math.random()`.
- Keep variables local and use `const` unless reassignment is required.
- Treat any password-shaped output as a fictional string exercise, not real credential advice.

## conditional-rule-table-case

Implement a fictional museum-ticket rule table.

- Write exact age boundaries and expected labels before coding.
- Convert the field, then use strict equality and non-overlapping ranges.
- Include a final branch for invalid or uncovered input.
- Test every boundary and one value on each side.
- Explain why a browser-only “secret word” comparison is not authentication.

## compound-condition-and-truthiness-case

Build a fictional park-activity chooser.

- Define named booleans for weather, permission, and equipment.
- Write the truth table before using `&&`, `||`, and `!`.
- Group mixed operators with parentheses.
- Compare `false`, `0`, `""`, `"0"`, and `[]` without treating truthiness as a substitute for validation.
- Finish with a FizzBuzz variant that exposes branch-order differences.

## native-svg-shape-case

Create a 500-by-500 native SVG scene.

- Draw a square and calculate the center of a circle from the square dimensions.
- Add one grouped repeated motif and one visible text label.
- Add an SVG `title` or `desc`, or an adjacent text equivalent.
- Implement the required result without D3; optionally compare it with D3 7.9.0.
- Test the scene at narrow width and confirm that the text meaning remains available.

## nested-loop-pattern-and-work-budget-case

Create a responsive color-tile pattern.

- Assign rows to the outer loop and columns to the inner loop.
- Calculate total iterations before generation.
- Cap each dimension at 20 and total work at 400 tiles.
- Generate a data structure first, then render the tiles in one pass.
- Test 1-by-1, 3-by-4, 20-by-20, zero, and an over-budget request.

## fundamentals-checkpoint-case

Complete this after JSS8, or use it earlier only as a placement preview.

- Build one fictional score tool using variables, conversion, operators, a named function, a loop, and a conditional.
- Add one native SVG result whose position comes from a calculation.
- Include an exact boundary, invalid input, and reset.
- Predict the result before running and explain each selected structure.
- Record confidence and the JSS module to revisit for every weak result before opening the key.

## semantic-html-and-css-case

Create a one-page fictional community-event guide.

- Use `header`, `nav`, `main`, two sections, and `footer`.
- Keep one logical heading sequence and label every form control.
- Write useful text and source order before adding layout styles.
- Compare block and inline behavior with a meaningful element choice.
- Test reading order with CSS disabled and core content with JavaScript unavailable.

## events-animation-and-reduced-motion-case

Create a controllable moving shape.

- Store position, direction, speed, and running state in one small object.
- Use named event, update, and render functions.
- Support keyboard and pointer controls without relying on hover.
- Stop cleanly and provide an immediate stable result for `prefers-reduced-motion`.
- Test repeated start, stop, reset, held key, focus movement, and console cleanliness.

## box-model-positioning-and-reflow-case

Build three fictional article cards.

- Predict and measure one card’s content, padding, border, and margin.
- Keep primary content in normal flow.
- Add one positioned badge with a named containing block.
- Test at 1280, 768, and 320 CSS pixels and at 200% zoom.
- Record any overlap, clipping, horizontal scrolling, or hidden focus and revise the rule.

## component-library-and-native-fallback-case

Build a small guide with navigation, a comparison table, and expandable details.

- Implement the structure with native HTML and CSS first.
- Use buttons only for actions and links only for navigation.
- Optionally enhance one component with Materialize 2.2.2.
- Reload without the library and confirm that content and core controls remain usable.
- Test labels, keyboard order, visible focus, narrow reflow, and library-load failure.

## grid-source-order-and-responsive-case

Create a fictional four-card exhibit.

- Keep the DOM order meaningful before applying Grid.
- Use `repeat`, `minmax`, and a flexible column rule.
- Avoid CSS placement that changes the reading or keyboard sequence.
- Test desktop, tablet, narrow mobile, long text, and one missing image.
- Compare the native Grid route with an optional Materialize grid only after the native layout passes.

## dom-state-and-safe-rendering-case

Build a fictional reading-list editor.

- Read values from labeled controls and normalize them in a named function.
- Keep the list in explicit state and render from that state.
- Insert learner-controlled strings with `textContent`.
- Support add, remove, repeated action, empty input, and reset.
- Test `<img src=x onerror=alert(1)>` as visible text and confirm no markup executes.

## web-experience-checkpoint-case

Complete this after JSS14, or use it earlier only as a placement preview.

- Build one semantic page with responsive Grid and a labeled form.
- Use an event to update explicit state and safely render a visible result.
- Add one motion or visual-state change with a reduced-motion route.
- Verify keyboard operation, focus, narrow reflow, malformed input, reset, and console state.
- Record the module to revisit for every failed criterion before opening the key.

## accessible-interactive-site-capstone-case

Plan one focused single-page experience for a fictional audience.

- Define the audience, one primary task, content hierarchy, state, events, and a useful no-JavaScript reading order.
- Build semantic HTML and responsive CSS before adding interaction.
- Separate input normalization, state updates, rendering, and events into named functions.
- Add one original native SVG or DOM interaction with a text equivalent.
- Verify keyboard and pointer use, focus, status, contrast, reduced motion, narrow reflow, boundaries, repeated actions, reset, console state, external assets, privacy choices, and known limitations.
