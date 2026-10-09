# Optional Java Record Reference

Use this after ordinary classes, constructors and collections. Records are
Java enrichment; required AP CSA class-design work still uses the exam's
specified class contract. The course action imports a separate editable
`Main.java` and README after confirmation. Save and export that project, then
compile with a native JDK 17 or newer. The website Java preview does not supply
a full JDK or record compilation.

## Run the supplied comparison

Extract the exported ZIP. In the directory containing `Main.java`, use separate
commands so this also works in shells that do not support `&&`:

```sh
javac Main.java
java Main
```

Expected output:

```text
Oak: 8
Pine: 5
Copied tags: [ready]
Shared tags: [ready, changed]
Negative score rejected
```

Predict the two tag lists before running. Change the score or label in a separate
copy, recompile, and explain the result. Invalid construction must fail before
an accepted object is used.

## Read the record declaration

Components define stored values and same-name accessors such as `points()`.
The compact constructor validates and normalizes its parameters; implicit
assignment follows its body. Each `new Score(...)` creates an instance with
its own component values. Component references are final, but a mutable object
they refer to can still change. The example copies the Score list using
`List.copyOf`; OpenBag deliberately keeps the shared list. This copy protects
the list structure, not arbitrary mutable objects stored inside it.

The example's records are nested inside Main. A separate public top-level
`record Score(...)` belongs in `Score.java`; it does not replace a project's
entry point. [Oracle's Java 17 record guide](https://docs.oracle.com/en/java/javase/17/language/records.html).

## Instructor and independent checks

Identify the declaration, validation, accessors, two instances and shared list.
Explain why changing `original` affects OpenBag but not Score. Compare this
small data carrier with a mutable class from the earlier project. Keep the
original class attempt; a record is not a universal class replacement.

For console input in a native editor, use its terminal or the Java run/debug
input facility. A read-only Output panel is not standard input. Keep stdout,
stderr and compiler errors distinct. A nullable `Boolean` can throw during
unboxing; test null before using it as a primitive condition.
