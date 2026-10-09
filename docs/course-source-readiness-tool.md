# Previewing course source inventory

The source-readiness tool defaults to a preview under
`~/Documents/Work/Juni`. It uses the existing course folder names, including
`C++ Level 3`, `Python Level 3` and `USACO Silver`. Missing checkouts are
reported without being created. It never selects the older Instruction-Material
tree automatically.

Run from `front-end/` using the installed TypeScript runner:

```sh
npm run courses:sync-source-readiness -- --repo Python-Level-3
```

Use `--source-root /absolute/path` to inspect another prepared course workspace.
An explicit `--write --repo Python-Level-3` can create missing inventory,
bootstrap verification and project scaffold files for that one repository.
Existing files are always preserved, including their permissions. Review and
edit existing authored manifests, source-role ledgers and verification gates
separately when coursework changes. Unity project files follow the same rule.

A newly generated verification script checks inventory only. Counts that
include Markdown do not prove that a starter is usable, a reference is correct,
or an IDE import works. Keep and run the repository's authored algorithm,
file-I/O, compiler and import checks before marking those requirements complete.

Run the maintenance regression checks from the repository root:

```sh
node --test test/course-source-readiness.test.mjs
```
