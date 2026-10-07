# Course lesson views

The course reader opens **Projects** by default. Each assignment has its own
card. **Supplemental Projects** contains the additional assignments, and
**Learn** contains explicit concept/reference items, learning goals and compact
key-block lists. The old lesson-guide disclosure and estimated pace are not
displayed.

Required instructions remain the main content of an assignment. Notes and
information use quieter inset panels; optional and hard extensions are identified
separately. This is a presentation change, not a rewrite of course requirements.
Tasks written only as an objective stay visible as assignments. Shared Markdown
reference definitions remain together so their links continue working.

Switching views does not change resource links, solution permissions, course
access or saved completion IDs. Search covers all three views and reveals the
matching view when necessary. Item links open their corresponding view, and
changing lessons returns to Projects.

## Validation

Unit tests cover content classification, code/Markdown preservation, default
view, view switching, deep links, search, empty states and saved completion IDs.
The isolated browser smoke checks all three views in light/dark themes at
desktop, tablet and phone widths, including accessibility and horizontal overflow.
Its API responses are synthetic, and external requests are intercepted; it does
not change accounts, send mail or modify production records.

No database migration, dependency change or runtime change is required.
Deploy using the existing native release process; rollback uses the prior
immutable release without changing course progress.

### Local checks, October 7, 2026

- 77 focused unit tests passed across reader, presentation, Markdown and assets.
- Root lint, typecheck and front-end/back-end production build passed.
- 42 browser layout checks passed, including 18 lesson-view/theme/viewport
  combinations, with no horizontal overflow or serious/critical axe violations.
- Synthetic student, tutor and administrator catalog checks and both restricted
  fork-origin checks passed. No production requests or API mutations occurred.
- Both lockfiles are unchanged; no dependency reinstall was needed.
- The wider serial frontend core run was stopped after five minutes without a
  completed report. It is not counted as a passing full-suite verification.

These are source and isolated-preview results, not confirmation of deployment.
