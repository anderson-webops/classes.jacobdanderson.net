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

## Teaching and Runtime References

- [BlueJ / Greenfoot](https://github.com/k-pet-group/BlueJ-Greenfoot) remains
  the classroom reference for visual Java object inspection. It is useful for
  course sequencing, but not something this site embeds or runs server-side.
- [CodeHS Java Karel docs](https://codehs.com/documentation/javaKarel) inform
  Karel command vocabulary, method patterns, comments, conditions, and loops.
  The local Karel preview follows `UrRobot` commands from `main`, CodeHS-style
  commands from `main` or `run`, simple helper methods, `putBall` / `takeBall`
  aliases, and bounded numeric `for` loops. It is still a teaching preview, not
  a full Java compiler or VM.
- [CodeHS Java docs](https://codehs.com/documentation/new/java-main) inform
  beginner Java console vocabulary such as printing, variables, methods,
  input, comparisons, math, and random numbers.
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) is a useful
  comparison point for browser editor UX, but its deeper Java IntelliSense path
  usually implies a language-server architecture. That is intentionally outside
  the current client-only scope.
