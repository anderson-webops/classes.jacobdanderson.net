# Instructor and student workspace audit

October 7, 2026. Source baseline: v2.8.54, revision
47822b819e95aa0ef36da6dec1ae1aeb70970772.

## Scope and evidence

Reviewed navigation, instructor teaching/account views, administrator people
management, student account/history views, classroom identity, course selection,
IDE ownership and graphing entry points. The objective is a content-first
workspace, not another dashboard or a redesign of the execution engines.

Baseline and revised screens use synthetic students in an isolated, loopback
preview. Its API blocks all writes and does not connect to MongoDB, SMTP, IMAP,
the scheduler or real student records. Authorization tests use synthetic fixtures.
No production account, course assignment, booking or email was changed.

## Findings and changes

| Finding | Resolution |
| --- | --- |
| Instructors see student booking and Zoom actions. | Neither instructors nor administrators receive those header actions. Student and visitor entry points remain available. |
| “Courses and tutors” mixes account settings with teaching work. | Instructor accounts show the shared profile/security form. Teaching work stays on Teaching. |
| Every learner repeats identity fields and expands several tools in a crowded roster. | One student selector, one working pane, and Courses / Projects / Sessions & notes controls serve both staff roles. |
| Names alone can be ambiguous. | Selection values are stable student IDs. Duplicate names receive a short ID suffix, not an inferred email/session association. |
| Tools load for students the instructor is not working with. | Projects and session tools load only after their view is selected, for that student. |
| Switching panes can discard work or transfer a draft to another student. | Pane switches retain mounted drafts. Changing students requires confirmation for unsaved edits and is blocked during saves. Student-specific tool instances are keyed by ID. |
| Creation forms compete with existing classes and notes. | Existing records come first. Add-class and save-only-note forms are collapsed until requested. |
| Student accounts repeat courses, tutors and history in a long page. | Profile / Classes & notes controls separate settings from private history. History shows Notes / Schedule / Messages one category at a time. Courses remain in the course workspace. |
| Student history loads before it is requested. | Load private history on its first selection and retain it when returning to Profile. |
| Course access drafts and roster fetching are duplicated. | Shared course-access presentation, draft state and bounded roster pagination replace role-specific copies. Parents still own privileged save operations. |
| Default API pagination can silently omit students beyond the first 100. | Shared fetching requests bounded 250-record pages, deduplicates by ID and fails visibly rather than silently truncating an oversized roster. |
| Cached directories and delayed responses can outlive their account scope. | Clear managed directories on identity changes and suppress obsolete roster/history responses. Tutor directory requests compare both role and ID. |
| Cancelled course edits can remain in the next edit session. | Reset drafts from saved state without mutating the authorized source records. |
| Staff course links can open the wrong current course. | Pass the selected student ID and the course hash understood by the existing course explorer. |
| Administrator instructor permissions repeat another roster. | A separate, collapsed instructor selector displays one instructor's permissions. |
| Repeated “Advanced Settings” labels obscure which account is affected. | Staff management disclosures explicitly say Student account, Instructor account or Administrator account. Instructor permission saves interlock their selector and controls. |
| Classroom identities are shown under “Account Settings” despite having no general account. | The existing course-only entry is titled Classroom workspace; no new account authority is added. |
| Legacy gradients, inset cards and role-specific CSS obscure the content. | Shared compact controls use the existing light/dark theme tokens. Removed unused grid and profile styling rather than layering another override on it. |
| Midnight UTC class labels can render on the previous local date. | Date-only session-note labels use UTC consistently. Actual scheduled times and saved/sent timestamps keep their separate meanings. |
| “Delivered” suggests inbox confirmation the system does not establish. | History says “Sent to” instead; saved-note timestamps are still labeled as saved, not sent. |
| A tutor without course permissions is told to ask their tutor. | The restricted-catalog message correctly directs the instructor to an administrator. |

## Role and security boundaries

| Role | Working view | Retained authority |
| --- | --- | --- |
| Administrator | One student and one optional instructor at a time | Assign tutors/courses, manage recipient mappings, review projects, manage sessions, write session notes, and explicitly confirm promotion/deletion. |
| Instructor | One assigned student at a time | Change access only to courses enabled for that instructor; use authorized student project/session tools. No administrator sending, promotion or deletion controls. |
| Student | Own profile or own classes/notes | Own account settings, authorized private history, courses and IDE projects. No roster or teaching controls. |
| Classroom learner | Existing course-only identity | Existing assigned-course/project ownership and classroom exit. No general account or staff privileges. |
| Visitor | Public catalog and entry points according to site policy | No private roster, notes, projects or management mutations. |

UI visibility is not authorization. Existing backend middleware and ownership
checks remain the enforcement boundary:

- Instructor roster requests require the authorized tutor ID and query assigned
  students only; projected records exclude credentials.
- Course updates require the student/tutor relationship and enabled tutor courses.
- Schedule, note and managed-project routes retain tutor/admin ownership checks.
- Student communication history is queried using the authenticated student, not
  a selector or a date supplied by the browser.
- Shared components receive already authorized data. They never select a role,
  acquire permissions, infer session identity or bypass CSRF/authentication.
- Site-specific catalog and classroom-entry policies are unchanged. Classroom
  login remains available to downstream sites where their policy enables it.

## Shared presentation and state boundaries

- `LearnerWorkspace`: selected identity, lazy working views, draft-switch
  confirmation and save interlock.
- `WorkspaceViewToggle`: labeled radio groups and visible keyboard focus.
- `LearnerCourseAccess`: consistent read/edit presentation, with parent-supplied
  course permissions.
- `useCourseAccessDrafts`: normalized per-student drafts and cancellation.
- `fetchManagedLearners`: bounded transport/pagination for existing scoped routes.
- `SelfAccountSettings`: existing common self-service form for each account role.
- `TutorProfile` / `AdminProfile`: role-specific allowed data and save operations.

This follows the existing Vue component/composable/store architecture instead
of introducing a second MVC framework, duplicate account hierarchy or generic
privileged endpoint.

## Validation and rollout boundaries

The release notes record exact test counts and build results. Regression coverage
includes one-student selection, duplicate names, lazy loading, cancellation,
draft preservation, saving interlocks, role transitions, failed roster requests,
pagination, course-link identity, own-student history and existing authorization.

Browser checks cover synthetic desktop/phone layouts, light/dark mode, staff
selection and student history. These are local rehearsals, not real-user feedback,
an accessibility certification or confirmation of production activation.

IDE and graphing entry points retain their existing compact common workspaces.
No student program was executed in this audit. The read-only preview deliberately
rejects IDE remote-save requests; it is not a production persistence test.

No database migration, dependency change, runtime change or new configuration is
required. Deploy through the existing tagged native Nginx/systemd release workflow.
Keep the previous immutable release for rollback. Do not change sending/recovery
flags or generate a production email to validate this presentation change.
