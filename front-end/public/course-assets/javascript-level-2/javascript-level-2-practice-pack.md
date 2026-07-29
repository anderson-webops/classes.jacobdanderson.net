# JavaScript Level 2 Practice Pack

Use local `index.html`, `styles.css`, `script.js`, and copied fixture data in an evergreen browser. CodePen, hosted database tools, public APIs, and remote storage are optional references. Use only fictional records. Never put an API key, access token, database credential, or real learner post in browser source. For each case, record browser and viewport, expected and observed state transitions, standard and failure inputs, console state, keyboard and pointer checks, reset or recovery, and one remaining limitation.

## level-1-readiness-and-state-case

Rebuild a fictional event-score calculator in local files.

- Use `const`, `let`, explicit conversion, strict comparison, one named function, one bounded loop, and one array or object.
- Replace `prompt`, `alert`, and `printToScreen` with a labeled form and `textContent`.
- Add a small native SVG or CSS result whose position or size comes from calculated state.
- Test empty, non-numeric, exact boundary, repeated submit, reset, refresh, and markup-shaped text.
- Record any JSS module that needs review before continuing.

## function-contract-and-pure-test-case

Create helpers for a fictional transit-fare tool.

- Write contracts for `normalizeAge`, `fareForAge`, `totalFare`, and `formatFare`.
- Keep normalization and fare calculations pure; render in a separate function.
- Test ages at every rule boundary, an invalid age, zero riders, and decimal fare.
- Compare fixed values before connecting any random or event-driven caller.
- Record parameters, return values, side effects, and one removed duplication.

## decision-table-and-ternary-case

Implement a fictional exhibit-admission decision table.

- Define booleans for reservation, open hours, capacity, and accessibility support.
- List every meaningful combination before writing code.
- Use grouped boolean expressions and mutually exclusive branches.
- Use one ternary only for a compact display label.
- Test exact capacity, one below and above, invalid conversion, and reordered branch behavior.

## canvas-coordinate-and-fallback-case

Draw a bounded 640-by-360 fictional transit map.

- Set CSS size and drawing-buffer size deliberately and record device pixel ratio handling.
- Store stations and lines as data, then draw from that data.
- Use `save`, `restore`, paths, and calculated coordinates.
- Provide adjacent DOM text or canvas fallback content naming every station and connection.
- Test narrow layout, resize or redraw, reset, canvas unavailable, and high pixel ratio.

## array-transform-and-grid-case

Transform a supplied set of fictional weather readings.

- Use `for...of` to inspect values, `filter` for valid readings, `map` for conversion, and `reduce` for a summary.
- Preserve the original array and explain every callback’s return value.
- Convert a rectangular 2D grid into row summaries without assuming every row is valid.
- Test empty, duplicate, invalid, one-row, uneven-row, and maximum-size data.
- Cap rows, columns, and total cells before processing.

## object-model-and-animation-state-case

Model a small array of animated fictional delivery drones.

- Give every object a stable ID, position, velocity, radius, color, and active state.
- Validate defaults and ignore or reject unknown fields.
- Separate `updateDrone`, `updateAll`, and `renderAll`.
- Use fixed time steps for logic tests before connecting animation.
- Verify that rendering does not mutate state and inactive objects do not update.

## logic-data-canvas-checkpoint-case

Complete this after JSM6, or use it earlier only as a placement preview.

- Build one local program with a function contract, compound conditional, array transformation, object state, and data-driven canvas drawing.
- Use fixed data before randomness and provide an essential DOM text result.
- Include standard, boundary, malformed, empty, repeated, reset, and canvas-unavailable cases.
- Explain each selected structure and record console state.
- Name a JSM1–JSM6 revisit before opening the key.

## event-normalization-and-input-case

Create a focusable canvas target selector.

- Attach named pointer and keyboard listeners exactly once.
- Convert pointer coordinates through `getBoundingClientRect`.
- Handle Arrow keys, WASD, Enter, and Space only while the interaction surface is focused.
- Call `preventDefault` only for a handled key in that active state; preserve page scrolling elsewhere.
- Test pointer scaling, all handled keys, an unrelated key, blur, repeated setup, teardown, and focus visibility.

## collision-boundary-case

Implement pure circle-circle and rectangle-rectangle collision helpers.

- State whether edge touching counts as collision.
- Keep detection separate from score, sound, velocity, or removal.
- Test separated, touching, overlapping, contained, corner, zero-size, and high-speed crossing cases.
- Add a debug overlay that can be disabled without changing logic.
- Ensure one sustained overlap creates only one score or life event.

## bounded-game-loop-case

Build a minimal catch-or-dodge game.

- Model ready, running, paused, complete, and reset states.
- Maintain exactly one `requestAnimationFrame` loop and cancel it when stopped.
- Cap delta time, player speed, spawned objects, frame work, and session duration.
- Expose start, pause, and reset as semantic controls with focus-aware keys.
- Render instructions, score, lives, status, and outcome as DOM text; test reduced motion and a background-tab pause.

## resilient-fetch-and-fixture-case

Use this bounded PokéAPI-shaped fixture before any public request:

```json
{
	"results": [
		{ "name": "tackle", "url": "https://pokeapi.co/api/v2/move/33/" },
		{ "name": "growl", "url": "https://pokeapi.co/api/v2/move/45/" }
	]
}
```

- Validate object, `results` array, item count, names, and HTTPS provider URLs.
- Render through one state machine: idle, loading, success, empty, stale, error.
- Optionally GET `https://pokeapi.co/api/v2/move/?limit=20`; check `response.ok`, abort on timeout or replacement, and cache success.
- Test fixture, network disabled, non-OK, timeout, abort, malformed shape, unexpected URL, repeated request, stale cache, and recovery.
- Use no API key or remote write.

## relational-schema-and-query-case

Use these fictional rows:

`shelves(id, label)`: `(1, "Blue")`, `(2, "Green")`, `(3, "Empty")`

`books(id, title, shelf_id)`: `(10, "Orbit", 1)`, `(11, "Moss", 2)`, `(12, "Loose", NULL)`

- Draw tables, primary keys, foreign key, cardinality, optionality, and delete behavior.
- Predict results for selecting titles, filtering shelf 1, ordering titles, inner joining shelves, and left joining all shelves.
- Add a many-to-many `books_authors` junction with a uniqueness rule.
- Preview target rows before one fictional update and delete, then state rollback or transaction intent.
- No live database or destructive execution is needed.

## local-crud-and-persistence-case

Start with this versioned document:

```json
{
	"version": 2,
	"notes": [{ "id": "n1", "text": "fictional note", "complete": false }]
}
```

- Implement load, validate, create, read, update, delete, render, save, migrate, and reset as separate operations.
- Use stable IDs, `textContent`, native checkboxes, and fixed length and count limits.
- Migrate a version-1 string array into version 2.
- Test missing, malformed, unsupported-version, duplicate-ID, unknown-ID, empty, overlength, quota or unavailable storage, refresh, and reset.
- Keep all required writes in localStorage; never place a JSONBin key in browser code.

## events-requests-data-checkpoint-case

Complete this after JSM12, or use it earlier only as a placement preview.

- Normalize one pointer or keyboard event into a visible state change.
- Load and validate a fixture, then optionally perform one resilient public GET.
- Draw a two-table relational model and predict one join.
- Implement versioned local create, update, and delete with recovery.
- Verify focus-aware keys, pointer input, network and storage failure, safe rendering, reset, and the JSM7–JSM12 module to revisit before opening the key.

## safe-message-board-case

Build a single-browser fictional message board.

- Store bounded versioned posts with stable ID, title, reviewed HTTPS link, optional reviewed image URL, comments, and local ordering.
- Parse URLs with `URL`; allow only reviewed protocols and origins.
- Render all learner-controlled text with `textContent`; provide fallback text for failed images.
- Tie each comment form to the post’s stable ID and preserve predictable focus and status.
- Test two posts, duplicate text, markup-shaped text, invalid URL, failed image, unknown ID, length and count caps, malformed storage, migration, refresh, delete, and reset.

## accessible-quiz-state-machine-case

Use this local fictional fixture:

```json
{
	"version": 1,
	"questions": [
		{ "id": "q1", "region": "North", "capital": "Pine" },
		{ "id": "q2", "region": "South", "capital": "Lake" }
	]
}
```

- Model loading, ready, asking, feedback, complete, and reset.
- Accept exactly one scored answer per question through a labeled form or native buttons.
- Render question, progress, score, feedback, status, and final result in the DOM.
- Use canvas only for optional decorative region coloring and provide reduced-motion behavior.
- Test correct, wrong, empty, duplicate submit, final question, empty or malformed fixture, keyboard, focus, canvas unavailable, complete, and restart.

## browser-app-capstone-case

Plan one browser-only app or game for a fictional audience.

- Define one task, non-goals, states, events, data shape, effect boundaries, and smallest complete vertical slice.
- Separate pure logic from DOM, canvas, storage, and optional network work.
- Include a complete supplied-fixture route and no browser secret; use local CRUD only when it serves the task.
- Bound frames, generated objects, records, text, requests, retries, and stored data.
- Verify keyboard and pointer operation, focus and status, canvas alternative, motion, contrast, narrow reflow, request and storage failures, reset, regression, attribution, privacy choices, limitations, and a three-minute demonstration.
