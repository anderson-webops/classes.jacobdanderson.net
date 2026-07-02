# Java IDE Editor References

The Classes Java IDE keeps Java and Karel execution browser-side. It does not add
server-side compilation, `javac`, Docker, or long-running execution services.

## Editor Implementation

- Use [`@codemirror/lang-java`](https://github.com/codemirror/lang-java) for
  Java parsing, indentation, folding, highlighting, and `//` / `/* */` comment
  language data.
- Keep the existing CodeMirror shell for shared editing behavior: search,
  history, multi-cursor state, bracket matching, bracket pair coloring,
  wrap-selection typing, Tab / Shift+Tab indentation, and command shortcuts.
- Add Java and Karel-specific completion entries and snippets in
  `front-end/src/modules/pythonCodeMirror.ts`; do not introduce backend
  language services or worker pools without explicit approval.
- Keep Java/Karel recommendations quiet inside Java line comments, block
  comments, string literals, character literals, and text blocks. This matches
  the Python editor expectation that prose/comment text should not trigger code
  completions while the student is typing.
- Surface parser-backed Java/Karel syntax diagnostics through the same
  CodeMirror lint-gutter path used by Python so missing braces and malformed
  statements are visible before the student presses Run.
- Treat Karel static receiver completions separately from robot-object
  completions. `Directions.` should suggest `North`, `East`, `South`, and
  `West`, while robot variables such as `sam.` should suggest movement and
  beeper/ball commands. `Color.` may offer common `java.awt.Color` constants
  for CodeHS/Karel examples that import `java.awt.Color`.
- Keep beginner collection completions aligned with the course sequence:
  array declarations, enhanced `for` loops, `Arrays.toString(...)`, and
  `Arrays.deepToString(...)`, 2D array setup, and `ArrayList` creation and
  core methods should be available from the editor.
- Keep beginner `String` completions aligned with Java Level 1, AP CSA, and
  sorting lessons: `length()`, `charAt()`, `substring()`, `equals()`,
  `equalsIgnoreCase()`, `compareTo()`, `indexOf()`, `toLowerCase()`,
  `toUpperCase()`, and `trim()` should appear as member completions.
- Include beginner `Scanner` member completions for token reads, line reads,
  numeric/boolean reads, and validation predicates such as `hasNextInt()`.
- Include beginner formatted-output completions for `System.out.printf`,
  `System.out.format`, and `String.format`.

## Teaching and Runtime References

- [BlueJ / Greenfoot](https://github.com/k-pet-group/BlueJ-Greenfoot) remains
  the classroom reference for visual Java object inspection. It is useful for
  course sequencing, but not something this site embeds or runs server-side.
- [Monaco Editor](https://github.com/microsoft/monaco-editor) is a useful
  comparison point for browser editor UX because it is the editor from VS Code.
  Its deeper Java IntelliSense path generally implies language-server or worker
  architecture, so it remains a reference rather than the current implementation.
- [CodeHS Java Karel docs](https://codehs.com/documentation/javaKarel) inform
  Karel command vocabulary, method patterns, comments, conditions, and loops.
  The local Karel preview follows `UrRobot` commands from `main`, CodeHS-style
  commands from `main` or `run`, simple helper methods, `putBall` / `takeBall`
  aliases, `if` / `else`, Karel conditions such as `frontIsClear()` and
  `ballsPresent()`, compound `&&` / `||` / `!` Karel conditions, bounded
  `while` loops, and bounded numeric `for` loops. It is still a teaching
  preview, not a full Java compiler or VM.
- [CodeHS Java docs](https://codehs.com/documentation/new/java-main) inform
  beginner Java console vocabulary such as printing, variables, methods,
  input, comparisons, math, and random numbers. The local console preview
  follows a small beginner subset: `System.out.print` / `println`, formatted
  output through `System.out.printf`, `System.out.format`, and `String.format`,
  simple variables, string concatenation, string methods such as `length()`,
  `charAt()`, `substring()`, `equals()`, `equalsIgnoreCase()`, `compareTo()`,
  `indexOf()`, `toLowerCase()`, `toUpperCase()`, and `trim()`, numeric
  arithmetic, simple casts, common `Math` helpers and constants such as
  `Math.PI` and `Math.E`, `Scanner` reads from the IDE input box with
  Java-like token-versus-line behavior for `next()`,
  `nextInt()`, `nextDouble()`, `nextBoolean()`, and `nextLine()`, basic
  `hasNext...()` validation predicates, basic `if` / `else if` / `else`
  decisions, bounded `for` / `while` loops, void helper calls, and simple
  static methods with parameters, `return` values, arithmetic use, boolean
  helpers, capped recursion, one-dimensional arrays, `Arrays.toString(...)`,
  `array.length`, indexed array access and assignment, enhanced `for` loops
  over arrays and `ArrayList`s, beginner two-dimensional arrays with nested
  loops, row `.length`, chained row/column indexing, and
  `Arrays.deepToString(...)`, and beginner `ArrayList` calls such as `add`,
  indexed `add`, `get`, `set`, `remove`, `contains`, `clear`, `size`, and
  `isEmpty`. It remains a browser teaching preview rather than a compiler.
- [Java Formatter syntax](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html)
  is the reference point for formatted output. The browser preview implements a
  small teaching subset: `%s`, `%d`, `%f` with optional width/precision, `%%`,
  and `%n`.

## Online Editor Boundary

- CodeHS and BlueJ/Greenfoot are course-sequencing references for Karel,
  visual state, and novice Java object inspection.
- CodeMirror is the implementation choice for the Classes browser editor
  because it provides Java parsing and editing features without requiring
  server compilation.
- Online Java compilers and full IDEs that execute arbitrary Java generally
  require server-side compilation or hosted sandboxes. Do not connect those to
  the Classes backend unless a future task explicitly approves a bounded
  execution service with resource limits.
