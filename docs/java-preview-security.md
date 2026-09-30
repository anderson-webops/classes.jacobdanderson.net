# Java and Karel preview limits

The browser preview is a small interpreter, not a JVM. It never evaluates Java
source as JavaScript or sends programs to a server to execute them. Java, BlueJ
projects and Karel share the same resource boundary.

- Runnable-file selection, parsing and interpretation run in a fresh module
  worker. A five-second deadline in the parent terminates even a stalled parser.
  Stop, a replacement run, account teardown and component teardown terminate the
  worker. Stale results cannot update the next project or account.
- All nested loops, helper calls, expressions, constant initialization and Karel
  planning share a 25,000-operation budget. Per-loop and recursion limits also
  remain. Exhaustion stops the entire preview, not just the innermost loop.
- Collection materialization is limited to 10,000 entries per allocation and
  100,000 aggregate reserved entries. Index assignment cannot grow sparse arrays.
  Multidimensional allocation, array copies, lists and maps use the same budget.
- Strings are limited to 200,000 characters and 16 million aggregate reserved
  characters. Formatting width and precision are checked before padding or
  numeric formatting. Cyclic or excessively deep collection display is rejected.
- Existing Java source, input, output, world-size and command limits remain.
  Worker messages exclude binary assets and are bounded before structured cloning.
  No worker support means a safe error, never synchronous fallback execution.

These are conservative preview accounting limits, not claims of a browser heap
quota. Ordinary course starters, Scanner input, nested beginner loops, maps,
arrays, BlueJ driver selection and Karel playback remain supported. Larger
programs should run in a desktop Java IDE. Preview failures never modify saved
source files.

Regression coverage lives in `java-preview-limits.spec.test.ts` (real interpreter
in memory- and wall-clock-bounded child processes), `java-ide-worker.spec.test.ts`
(deadline, cancellation and stale-message lifecycle), the existing Java/Karel
unit suite, and Cypress `java-preview-limits.spec.ts` plus the starter matrix.
Never reproduce a synchronous hang directly inside a test runner: its own test
timeout cannot interrupt blocked JavaScript.
