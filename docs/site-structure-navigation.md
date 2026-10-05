# Site structure and navigation changes

Implemented from the October 4, 2026 structure audit. Scope is the maintained
Classes application source. Course permissions, browser runtimes, durable mail
operations, account mutations, pricing, booking durations and production
configuration retain their existing contracts.

## Audit disposition

| Finding | Implementation |
| --- | --- |
| F01 Account creation | Account entry opens the existing signup dialog. `/signup` remains the booking URL and keeps Classes navigation. |
| F02 Orientation | Forward route changes start at the top and focus the persistent main landmark. Back restores position; lesson hashes and workspace query changes retain their own behavior. |
| F03 Working area | Compact IDE header and controls. Phone project/file navigation collapses; Code, Canvas and Console views keep the workspace mounted. |
| F04 Navigation | Brand serves as Home; task links, primary booking and one login/account entry replace the flat list. Role-specific teaching/admin access remains. |
| F05 Discovery | Public Courses entry points to searchable course families; protected lessons and solutions keep their access rules. Empty enrollment has a concrete next step. |
| F06 Entry | Email account and classroom code choices share the access dialog. New, returning and recovery instructions preserve classroom passwords. |
| F07 Visual consistency | Account/staff surfaces and compact headers use shared theme tokens; account headings are readable in both themes. |
| F08 Editor versus language | Switching editors opens Code or Scratch; a project's language remains fixed. Another language is chosen when creating a separate project. |
| F09 Starters | One New project picker offers language, Blank/Templates/Classroom/Demos and search. All 21 existing templates/demos and BlueJ import remain. |
| F10 Graphing | Collapsible inspector and grouped exports; Graph/Data/Style phone views and view-only graph reflow. Editable download stays distinct. |
| F11 Scratch | Honest wider-screen guidance, stage-first small-screen layout, Blocks/Stage horizontal navigation and Expand editor. A full-width inner frame prevents tablet stage clipping. |
| F12 Storage | Code explains account/device storage; graph reports actual save success or failure; Scratch explicitly requires downloading. Unsaved replacement/leave guards remain. |
| F13 Course reader | Continue and the current lesson lead; detailed totals sit in Course overview. Current/Past/Available and classroom editions remain distinct. |
| F14 Lesson actions | Project action is primary; contextual Return to lesson preserves the course/module hash. Resources, downloads and solution visibility remain. |
| F15 Pathways | Searchable family index and optional course detail. It remains at the end of About, outside global navigation. |
| F16 Tutor | Searchable learner roster comes first; personal security lives in Account. Classroom codes are optional details below the roster. |
| F17 Learner context | Courses and notes use stable student-ID links, validated against the managed roster. Projects/sessions open the selected learner's tools. Invalid scope fails closed. |
| F18 Admin | People, Notes and Courses are direct local tasks. Review status remains visible; diagnostics and the roster spreadsheet become secondary references. |
| F19 Notes | Explicit Session note/Internal message intent, verified student, actual session or explicit unlinked choice, preview, then durable send/tracking. Changing student preserves a draft until confirmed; shared mailboxes do not determine student identity. |
| F20 Duration and price | Tuition/preparation help sits beside booking. Existing duration, calendar-length and pricing indications are retained at Jacob's direction. |
| F21 Meetings | Join class is the task label; signed-in navigation offers a clearly marked direct Zoom link. The existing join page remains as fallback. |
| F22 Home | Booking is in the first phone screen; signed-in course continuation is concise. Credentials/details remain on About; booking FAQ and tuition sit beside booking. Hero image alt text now matches the image. |
| F23 Footer and labels | Workspaces use a compact help/privacy/tuition/theme footer and shared navigation labels. Public footer, route aliases and intentionally hidden pages remain. |
| F24 UI contracts | Shared workspace header, storage status, starter catalog/picker, learner actions, review summary and route orientation reduce duplication. Runtime/backend architecture was not rewritten. |

## Validation boundaries

Responsive browser checks used public, signed-out local pages at phone, tablet
and desktop widths. Account creation opens the real dialog; About to Pathways
starts at the title, and Back restores the previous link position. A project
picker remains usable with the sidebar collapsed; Escape closes it and restores
focus. The selected existing project was not run, replaced or deleted.

Final local measurements: the desktop code panel begins near y=466 and Run near
y=331, compared with the audit's code near y=750. Phone code begins near y=617,
compared with y=1,483. Exact positions vary with selected mode, status and width.
Scratch's tablet stage is fully rendered inside its horizontal viewport. Phone
editing retains a larger-screen recommendation rather than promising desktop
parity.

Staff workflows are checked with synthetic component fixtures. No real signed-in
student/tutor/admin browser acceptance, booking, payment, client email or student
record mutation was performed. Full accessibility compliance is not asserted.
Graph exports/persistence retain original geometry; phone reflow changes only
the interactive view. Browser theme/viewport settings were restored, and the
agent's local preview server was stopped.

Final local gates passed using installed Node 24.21.0 and existing dependencies:

- Root lint and frontend/backend typecheck.
- Frontend core: 161 files, 1,276 tests passed.
- Catalog quality/artifacts: 2 files, 267 tests passed.
- Backend: 34 files, 340 tests passed; one existing optional test skipped.
- Native deployment fixtures: 10 passed. The synthetic Git fixture used an
  isolated global Git configuration because the installed cloud scanner's
  exhausted quota prevented even its dummy commit. Real repository hooks were
  not changed.
- Updated production IDE smoke helpers: 11 passed; built Java/BlueJ/starter
  markers, compatibility/hidden pages and branded static 404 boundary verified.
- Root production client/server build passed. Existing bundler warnings about
  IIFE import.meta and large chunks remain; runtime code was not altered here.
- Offline staged secret scan passed with findings redacted.
- Manifests and both lockfiles unchanged; root/workspace/backend manifest parity
  checked. No clean install or dependency refresh was performed.

The browser preview and synthetic checks do not establish deployment to the
live host. Staff acceptance with a signed-in staging fixture remains a useful
operator check before rollout.

## Release and rollback

Publish as a new deployable navigation milestone after lint, typecheck,
regressions and production build pass. Use a fresh annotated `v2.x` tag, the
exact tagged native artifact and the existing Nginx/systemd workflow. Published
release tags are immutable. A pushed source or artifact is not proof that the
host has deployed it.

There is no database migration, index change or production environment change.
Rollback uses the previous verified native artifact and its configuration.
Browser project formats, storage keys, old IDE URLs, booking URLs and protected
course access remain compatible. Existing Graph/Scratch/code downloads remain
valid. No runtime upgrade is part of this change.
