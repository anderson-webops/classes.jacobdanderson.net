# Public course discovery

## Scope

- Pathways now use visual progression maps and parallel subject choices, with
  short readiness notes, subject filters and search. Every catalog course
  appears once. Classroom and bootcamp variants share a stage rather than
  becoming extra prerequisites.
- The home page has one Course Pathways action, short teaching copy and no
  repeated booking/payment calls to action or subject disclosures. Scheduling
  and payment remain in navigation. Contact stays an email link in the footer,
  with an envelope icon and an accessible email-app cue; no contact page was
  introduced. The About booking action is removed.
- Catalog visibility is open only when the browser origin is exactly
  `https://classes.jacobdanderson.net`. It is not enabled by a query parameter,
  a cached login or a matching hostname substring. Other origins retain the
  existing assigned-course gate. No downstream checkout was changed.
- The origin decision happens after mounting so prerendered markup stays
  neutral instead of flashing a guest login gate. Local previews intentionally
  retain the restricted default; the isolated browser test supplies canonical
  and fork origins without making production requests.
- Public browsing does not grant progress-edit permissions, reveal learner
  records or enable solution views. Signed-in staff retain their learner
  selector and can update progress only for the learner's assigned course.
  Other courses remain readable without tracking controls. API authorization
  and account/session handling are unchanged.

## Validation

- 78 focused tests cover canonical-only visibility, public browsing, assigned
  tracking, restricted defaults, stable course anchors, complete map coverage,
  alternate course variants, footer contact and About/home simplification.
- Full lint, typecheck and production build pass using existing dependencies.
  Root lock provenance passes; neither lockfile nor any dependency changed.
- All six isolated Cypress navigation checks pass, including the Payment and
  Schedule Class labels, login mode switching, new-tab cues and compact IDE
  controls. Synthetic API responses prevent production access.
- `scripts/public-course-discovery-smoke.mjs` checks the built pages at desktop,
  tablet and mobile widths in both themes. It verifies 24 layout/accessibility
  combinations, signed-in student/tutor/admin catalog views, and two simulated
  fork-origin gates. No serious or critical WCAG A/AA violations or horizontal
  overflow remain on the tested pages.
- Browser tests use synthetic records and intercepted API responses. All
  document/assets come from a loopback-only preview, with real network
  destinations blocked. They assert zero API mutations and close the browser,
  context, pages and owned preview process on completion or failure.

## Release and rollback

This is a source-only UX change with no migration, new indexes, dependency
installation, credential changes or host runtime changes. Source publication
does not establish production activation.

Build the candidate through the annotated-tag native-release workflow, verify
its attestation and inventory, then use the established native promotion
procedure. Preserve SMTP/recovery pause flags and all existing configuration.
Do not send acceptance email. Check the canonical catalog unsigned and signed
in, its personalized progress boundaries, pathway anchors and both themes.
Rollback uses the previous trusted artifact and configuration; no data rollback
or evidence backfill is needed.
