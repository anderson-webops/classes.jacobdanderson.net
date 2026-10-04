# Mac session-note verification workflow

`verify_notes.py` is the maintained schema-v2 adapter for the existing standalone
Mac workflow. Install it alongside `session_notes_client.py` (the repository's
`scripts/session-notes-client.py`). Back up the old sources first. Preserve the
read credential in its original Downloads location and all historical reports.
Do not copy credentials or student reports into Git.

The client requires schemaVersion 2 and every critical evidence/identity field.
Running against the older deployed contract fails visibly and leaves the report
incomplete. Use it after the server operator accepts the new API. The fixed HTTPS
origin rejects redirects; reads are spaced at least 1.1 seconds apart, responses
are limited to 2 MB, and pagination stops after 100 pages. HTTP/rate-limit errors
fail visibly rather than implying empty evidence. Output must be a new file and
is created with owner-only permissions.

Coverage, statusMeaning, evidenceStatus/reasons and stable note/session IDs are
retained on every page, including empty pages. Successfully read pages survive a
later network/schema failure, but paginationComplete remains false. Starting
from a cursor also marks the overall window incomplete. No timestamp aliases,
subject-date guessing, message IDs, notes, addresses or raw response bodies are
retained. Saved-only, unknown or absent site evidence never establishes that a
student's notes are overdue or were never sent. SMTP acceptance is not inbox
receipt.

Prefer `--student-id` for future queries. Repeated exact `--student-name` labels
remain compatible with the private tracker runner; ambiguous names fail closed.
The runner preserves its existing students/date range and uses a new timestamped
output filename rather than replacing `verification-metadata-v2.json`.

For tracker integration, call `associate_bindings(site_records, bindings,
verified_local_sent)` after loading a private report. Bindings contain entryId,
studentId and scheduledSessionId, established from verified booking identity.
The returned site association is verified only when both stable IDs match a
verified session record. September 18 classDate cannot identify a September 19
session. Verified local Sent timestamps remain separately sourced even when the
site returns unknown or no record. This helper does not edit or finalize a sheet.

Outside-site evidence registration is an explicit, separate workflow using
`session_notes_client.py --api <HTTPS-base>/api --token-file <private-register-token>
register --metadata-file <private-metadata.json>`. Use the new narrowly scoped
credential, never the existing read-only credential. Retain a stable key and
opaque SHA-256 evidence reference before submission. The JSON contains only
studentId, scheduledSessionId (or explicitly unlinked), optional noteId, classDate,
source=mac_sent_item, evidenceType=observed_sent_item, observedSendAt, evidenceRef
and idempotencyKey. Keep mailbox content/identifiers private. Do not register or
backfill historical evidence automatically. Administrator corrections use the
separate authenticated review workflow.

Synthetic source checks:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 test/session-note-mac.test.py
PYTHONDONTWRITEBYTECODE=1 python3 test/session-notes-client.test.py
```

These checks do not load a real credential, query production, send mail or modify
student data. Local installation is backed up separately with a SHA-256 manifest.
