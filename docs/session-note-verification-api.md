# Session-note verification API

`GET /api/session-notes/verification` returns saved class dates and verified
SMTP send metadata without note text, HTML, subjects, email addresses,
attachments, payment records or account credentials. It cannot send mail or
change a tracker. The native proxy removes `/api` before forwarding to Express.

## Access and setup

A current, non-revoked administrator session can use the endpoint immediately
after deployment. Tutor, student and classroom-code sessions cannot. For an
external read-only client, create a separate credential on a trusted machine:

```sh
node scripts/create-session-notes-read-key.mjs /absolute/private/directory
```

This creates two new owner-readable files without overwriting existing files
or printing the secret: `session-notes-read.token` for the client and
`session-notes-read.env` for the server. The server file contains only the
SHA-256 hash and a 90-day expiry. Add those two configuration values to the
existing protected API environment through the server's normal configuration
process, then restart that API. Keep the raw token in the client's credential
store. Do not put either file in source control, web assets, prompts or logs.

The client sends `Authorization: Bearer <token>` over HTTPS. Tokens in URLs,
query strings and request bodies are not accepted. A missing, invalid or
expired token configuration disables machine access; administrator access
still works. Replacing the hash rotates the credential; removing it revokes
it. This credential does not authenticate any other API or grant mail-sending
or account permissions. Local source work does not configure or deploy a host.

## Request

Provide exactly one of:

- `studentId`: the student's existing User ID (24 hexadecimal characters).
- `studentName`: the exact full saved recipient/student label, case-insensitive.
  No fuzzy or substring matching is performed. This also supports students
  without accounts. Ambiguous names return 409 instead of combining students.

`from` and `to` are inclusive class dates in `YYYY-MM-DD` format, covering at
most 366 days. `limit` defaults to 50 and has a maximum of 100. Continue with the
returned `nextCursor`, using the same student and date filters, until it is
null. Results sort by class date and record ID, newest first. For example:

```http
GET /api/session-notes/verification?studentName=Sophia&from=2026-09-01&to=2026-09-30
Authorization: Bearer <read-only credential>
```

```json
{
	"records": [{
		"recordId": "507f1f77bcf86cd799439012",
		"studentId": "507f1f77bcf86cd799439011",
		"classDate": "2026-09-17",
		"sentAt": "2026-09-18T01:25:12.000Z",
		"deliveryStatus": "smtp_accepted"
	}],
	"nextCursor": null,
	"coverage": "site_records_only",
	"statusMeaning": "smtp_accepted means the mail server accepted the primary recipient; inbox delivery is not confirmed. Unknown or absent records are not evidence that notes are overdue."
}
```

Each stored note has its own row; multiple sends for one class are not silently
merged. `studentId` is null for notes not associated with an account. Name
collisions or legacy mixtures of linked and unlinked identities must be
resolved explicitly; an ID query includes only notes actually linked to it.

## Evidence and tracker semantics

- `smtp_accepted`: the site's SMTP transport explicitly accepted the primary
  recipient. `sentAt` records that transport's successful completion in UTC,
  before an optional IMAP Sent-folder copy. Convert it to the tracker time
  zone before taking a calendar date, typically America/New_York.
- `smtp_rejected`: SMTP explicitly rejected the primary recipient, even if a
  copy recipient was accepted. `sentAt` is null.
- `unknown`: legacy/manual notes, missing transport evidence, or incomplete
  metadata. `sentAt` is null. Creation/modification timestamps are never used
  as send dates. This API does not claim recipient delivery, opening or reading.

New site sends capture this evidence automatically. Existing records are not
backfilled or treated as proof of sending. Mail sent outside this site, records
that were deleted, and failures to save a post-send record are outside coverage.
An empty result means no matching saved evidence, not that notes were never sent.
Failed SMTP attempts with no saved note also do not produce a verified row.

For the tracker, **Session Notes** means the date the notes were sent. **Done**
remains Jacob's manual finalization decision, including free classes or classes
that do not receive notes. **In progress** means a class occurred but its entry
has not been finalized. No status or overdue inference is made by this API.

## Limits and release checks

The endpoint is GET/HEAD-only, rate-limited to 60 requests per minute per IP,
uses positive metadata projections and `Cache-Control: no-store`, and bounds
each database query to two seconds. It does not enable cross-origin reading.
400 indicates invalid filters/cursor, 401 an invalid bearer credential, 403 a
missing or invalid admin session, 405 a write method, 409 an ambiguous name,
429 the rate limit, and 503 unavailable database evidence. Do not convert an
error response into an empty result or a tracker status.

The optional schema fields need no destructive migration. Deploy the matching
source release; allow Mongoose to create the new student/date indexes, or have
the database operator create the schema-declared indexes before heavy use if
automatic index creation is disabled. Validate a real authorized GET and an
unauthorized rejection on the host after deployment. Do not send test email to
students merely to test this API.
