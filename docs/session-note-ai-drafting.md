# Session-note AI drafting

Scope: the canonical Classes site only. This is a draft-only integration, not a
new sending, archival, delivery-evidence or booking workflow. Do not copy this
feature into the instructor, CS or Math forks. Existing SMTP and recovery flags,
credentials, session associations and historical evidence remain unchanged.

## User interface

- Select a student and class date. **Generate** is at the right of **Markdown**.
- Settings failures on the canonical site show a bounded error and an explicit
  retry beside the editor and in administrator drafting settings. Failed or
  malformed settings never enable generation or change tutor permissions.
  Until private provider configuration is complete, Generate explains that
  configuration is required without looking up transcripts or calling AI.
- The default Zoom meeting number is `2543520025`. The lookup uses the configured
  Zoom time zone, not a date parsed from an email subject or a nearest-day match.
- Confirm the actual Zoom occurrence belongs to the selected student. A recurring
  meeting number and a date alone cannot establish student identity. Multiple
  same-day occurrences require an explicit selection; even a single occurrence
  requires confirmation. This confirmation is for drafting only and does not
  verify a ScheduledSession association or create one.
- If no downloadable transcript is found, an inline meeting-ID field appears.
  Supply another numeric meeting number and click Generate again.
- The generated body replaces the Markdown editor, only after confirming any
  replacement of existing text. Review/edit it and use the existing Send control.
  Generation never saves a note, queues a message or invokes SMTP/IMAP.
- Student/date changes, typing during generation, sending, or leaving the page
  invalidate outstanding results. Stale output never replaces a different draft.
- Evidence gaps appear as instructor-only **Review** warnings next to the editor,
  never in the generated email body, preview, saved note or send payload.
  Unsupported sections are omitted rather than filled with missing-evidence prose.
- Under administrator Account Settings, **Session-note AI** contains the
  Disabled/Enabled radio setting for tutor drafting. Disabled is the default.
  Enabled tutors use the same control in their assigned student's save-only note
  editor. It does not give tutors the administrator mail composer or mail rights.

## Protected operator configuration

Do not put credentials, approved style examples, transcripts or student mappings
in Git, frontend build variables, browser storage, Downloads or public static
files. Add the following through the existing protected native-service secret
configuration. No existing Zoom, SMTP, MongoDB or Vault values are replaced.

| Variable | Purpose |
| --- | --- |
| `SESSION_NOTE_AI_SITE_ORIGIN` | Exactly `https://classes.jacobdanderson.net`. An explicitly different `AUTH_ORIGIN` disables the feature. |
| `SESSION_NOTE_AI_ENABLED` | `true` to enable external drafting; missing/false prevents provider calls. |
| `SESSION_NOTE_ZOOM_ACCOUNT_ID` | Zoom Server-to-Server OAuth account ID. |
| `SESSION_NOTE_ZOOM_CLIENT_ID` | Dedicated Zoom read-only app client ID. |
| `SESSION_NOTE_ZOOM_CLIENT_SECRET` | Dedicated app secret. |
| `SESSION_NOTE_ZOOM_HOST_ID` | Administrator's actual Zoom host user ID, not an email, meeting ID or `me`. |
| `SESSION_NOTE_ZOOM_TIMEZONE` | IANA time zone for selected class dates. Defaults to `America/New_York`. |
| `SESSION_NOTE_ZOOM_TUTOR_HOSTS` | Optional protected JSON mapping of local tutor ObjectIds to their own verified Zoom host IDs. No administrator-host fallback. |
| `SESSION_NOTE_OPENAI_API_KEY` | Dedicated server-side project key with Responses permission and a spending limit. |
| `SESSION_NOTE_OPENAI_MODEL` | Explicit operator-selected compatible Responses text model; no implicit model upgrade. |
| `SESSION_NOTE_AI_STYLE_FILE` | Optional protected server-local UTF-8 file overriding the built-in approved style, maximum 16,000 bytes. Missing/empty/invalid configured files fail closed. |
| `SESSION_NOTE_AI_REFERENCES_FILE` | Optional protected server-local JSON file of explicitly approved preferences and style examples keyed by stable student ID. Maximum 64,000 bytes; invalid configured files fail closed. |

The requested style reference is
`https://chatgpt.com/share/6ac660b2-b16c-83ea-a2c8-c5eb29e2ea39`.
The shared URL redirected to an account-loading failure. The administrator then
provided the GPT's conventions directly, then approved a refinement emphasizing
homework accuracy, natural audience choices and demonstrated learning. Sections
are optional: **Homework Check**: only for actual prior homework reviewed,
**In Class**: for the work and learning, and **Homework**: only for evidenced
assignments. Colons remain outside bold labels and project names are bold.
Optional challenges stay optional, unfinished work is not automatically homework,
and claiming no homework was assigned also requires explicit evidence.
Discussion, attempts, completed work and independent demonstrations remain
distinct. Prefer coherent paragraphs and specific encouragement. About 100 to
200 words is a tendency, not a quota. Confirmed promises may appear in a short
**Follow-up**: section; uncertain completion belongs in instructor review.

### Approved preferences and examples

Do not infer preferences from a name or shared parent mailbox. The protected
references file uses stable student ObjectIds, verified privately by the operator
against the teacher's intended student. Without a matching approved entry, the
default is third person with natural "we" for shared work. The previous
first-name-based special cases have been removed; provision approved ID mappings
before activation to preserve their intended audience and update formats.

The supplied guidance approves student-specific second-person or family-facing
audiences, optional omission of Homework Check, and topic-organized Overall
Updates. These preferences are not authorization to identify records by name or
copy emails. Verify the intended students and stable IDs privately. Never commit
actual mappings or reference emails. Two or three anonymized teacher-approved
examples may be included per student; they are optional until provided/approved.

File contract, using a synthetic ID and synthetic examples only:

```json
{
  "schemaVersion": 1,
  "students": {
    "bbbbbbbbbbbbbbbbbbbbbbbb": {
      "approved": true,
      "audience": "student",
      "format": "session",
      "homeworkCheck": "omit",
      "examples": [
        "**In Class**: You compared equivalent fractions and explained why their values match.",
        "**In Class**: We tested a loop on two inputs. It worked in our tests; more edge cases remain."
      ]
    }
  }
}
```

`audience` is `student` or `family`; `format` is `session` (default) or
`overall_update`; `homeworkCheck` is `when_reviewed` (default) or `omit`.
Every entry requires `approved: true`. `examples`, when present, contains two or
three nonempty strings, at most 2,500 characters each. The file accepts at most
200 lowercase ObjectId keys and no unknown fields. It is read afresh per request
without persisting or caching content. Use an operator-owned file readable only
by its owner and the Classes service as needed, never Downloads, Git, frontend
storage or public assets. A configured missing, malformed, unsupported-version
or oversized file blocks generation without provider calls. Removing the
optional variable restores generic defaults, not name inference.

Only the selected ID's approved preferences and examples enter the request.
Examples are sanitized and sent as a separate, explicitly style-only data object,
not instructions or current-session facts. Never transfer an example's homework
or accomplishments into the selected session. No automatic mailbox/history
lookup or example approval occurs. Examples require teacher approval and
appropriate processing permission before use. Mandatory factual and output rules
apply after any optional style override.

An Overall Update still covers only the selected session. This feature does not
claim a complete cumulative reporting period, combine students, track earlier
updates or reset them after sending. Those workflows require separately verified
transcripts and history; generation never deletes notes or marks them sent.

Use least-privilege read scopes for listing a configured host's cloud recordings,
listing past meeting instances, reading past-meeting ownership/details, reading
meeting transcripts and reading cloud recording files. Do not grant write/delete
recording or meeting scopes. For Server-to-Server OAuth, the applicable granular
admin read scopes include:

- `cloud_recording:read:list_user_recordings:admin`
- `meeting:read:list_past_instances:admin`
- `meeting:read:past_meeting:admin`
- `cloud_recording:read:meeting_transcript:admin`
- `cloud_recording:read:list_recording_files:admin`

Confirm current Zoom app scope labels against its marketplace permission screen.
Unavailable required scopes fail visibly; they are not treated as proof that no
transcript exists. Host mappings restrict the account-level credential's use.
Tutors outside that Zoom account need a separately reviewed OAuth integration,
not an expanded host allowlist or permission to use the administrator's host.

Official contracts used:
[Zoom meeting/recording APIs](https://developers.zoom.us/docs/api/meetings/),
[Zoom Server-to-Server OAuth](https://developers.zoom.us/docs/internal-apps/s2s-oauth/),
[OpenAI Responses](https://developers.openai.com/api/reference/python/resources/responses/methods/create),
[OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

## API

All paths below are under `/api/session-notes/drafting`. Every request requires a
current administrator/tutor cookie session. The existing read-only verification
bearer does not authorize any drafting or configuration operation. Mutations
require the existing same-origin CSRF checks; requests are metadata-only and
bounded to 4 KB. Responses are `Cache-Control: no-store`.

| Method/path | Contract |
| --- | --- |
| `GET /settings` | `{siteAvailable, allowed, ready, tutorsEnabled, timezone?}`; no host IDs or provider secrets. |
| `PUT /settings` | Administrator only: `{tutorsEnabled: boolean}`. Persists a bounded, timestamped operator-change history. |
| `POST /candidates` | `{studentId, classDate: "YYYY-MM-DD", meetingId?: "2543520025"}`. Returns `{status: "selection_required" | "no_transcript", candidates: [{selectionToken, startAt, timezone}]}`. |
| `POST /generate` | Same identity/date/meeting metadata plus `{selectionToken, confirmedStudent: true}`. Returns `{markdown, reviewWarnings: [], draftOnly: true, source: {startAt, timezone}}`. |

`reviewWarnings` is an additive array of at most three deduplicated codes:
`homework_uncertain`, `transcript_incomplete`, `follow_up_uncertain`. The provider
returns a strict structured object; invalid, incomplete or refused output leaves
the existing draft unchanged. Only `markdown` is emitted to the editor. Warnings
use fixed UI text, not provider-supplied prose, clear on student/date/meeting
changes, and are not persisted or sent. Older clients can ignore this additive
field. During rolling activation the updated UI accepts an older server's absent
warning array, but rejects malformed or unknown codes.

The composer suppresses `homework_uncertain` and `transcript_incomplete` notices,
including an empty Review section. The API contract and factual drafting rules
remain unchanged; `follow_up_uncertain` can still appear in instructor review.

Selection tokens are opaque, in-memory, bounded to 200 total and expire in five
minutes. They bind the actor, student, host, date, meeting and actual occurrence.
They expire on restart; repeat lookup rather than persisting or logging them.
The student's assignment, tutor toggle, configured host and occurrence ownership
are rechecked on generation. No endpoint accepts a client-supplied transcript,
download URL, host ID, arbitrary prompt, recipient email or model override.

## Privacy, limits and operation

Lookup verifies actual Zoom UUID occurrences. It combines cloud recordings with
past meeting instances, then checks host, meeting number and local date against
the actual past-meeting response. It can use the meeting-transcript endpoint even
when a cloud-recording transcript is absent. Missing/ambiguous/incomplete results
do not select the first available recording.

Only the selected transcript is downloaded. HTTPS Zoom-only download targets,
ports, paths and redirects are validated before forwarding a token. Foreign
redirects and HTML responses fail closed. Lookup is bounded to five recording
pages and 20 same-day occurrences. Requests time out after 90 seconds. Transcript
downloads are capped at 256,000 bytes and are never silently truncated.

OpenAI receives the selected student's name, class date, actual occurrence time,
sanitized transcript, approved style and that student's explicitly approved
style-only examples, not recipient addresses, passwords, meeting URLs, mailbox
contents or other students' saved note history. Caption
timing, email addresses, URLs and labeled access details are removed. Transcript
content remains untrusted data, never system instructions. Sanitization is not a
guarantee that every personal detail in a spoken conversation can be removed;
enable this only with appropriate permission to process student transcripts.

Responses use `store: false`, no tools, strict JSON-schema output separating the
Markdown body from review codes, and an output budget of 3,000 tokens. The
operator-selected model must support Responses Structured Outputs; no implicit
model upgrade or unstructured fallback occurs.
This avoids stored Responses application state; it does not promise zero provider
retention or replace an organization's retention/privacy agreement. Incomplete,
refused, oversized and failed responses do not update the draft. No transcript,
AI body, token, address, raw provider error or external meeting identity is logged
or persisted by this integration.

Prompt/contract regression tests include synthetic retraction of an invented
April assignment, optional challenges, unfinished work and qualified test results.
They verify request boundaries and mocked response handling, not the factual
accuracy of a live model. Manual review remains essential. No real transcript or
historical email is required for source acceptance.

Delivery status copy distinguishes successful SMTP submission and a confirmed
Sent copy from recipient delivery: "Submitted successfully; Sent copy saved.
Recipient delivery is not tracked." This does not claim SES delivery events,
inbox placement or reading. No SMTP, archival, evidence or retry behavior changes.

Limits: 30 mutation requests/hour/account (lookup and generation both count),
one in-flight request/account, two total per native API process. Production uses
the existing distributed rate-limit store. The supported deployment has exactly
one API process; the concurrency cap is not a distributed multi-process lock.
Configure provider project spending limits separately.

## Release, validation and rollback

No dependency or lockfile changes. The only new collection is
`sessionnotedraftsettings`, with its ordinary unique `_id` index. Creation occurs
on the first explicit administrator setting update. There is no historical
backfill, SMTP evidence migration, transaction requirement or worker change.

Source tests use synthetic students, mocked database queries, fake Zoom and fake
OpenAI responses. No production transcript lookup, student-record mutation or
SMTP/IMAP call is used for implementation acceptance. Test results and exact
source/release identity belong in the release handoff after validation.

Local acceptance, October 7, 2026:

- Full backend suite: 399 passed; one pre-existing replica-set integration test
  skipped because its explicit test URI was not configured. The durable-mail
  fixture used an isolated local MongoDB and SMTP sink, not real mail servers.
- Focused composer, drafting, profile and learner-tool frontend suite: 51 passed.
- Full lint, both workspace type checks and production build passed.
- Root/back-end lockfiles are unchanged; lock provenance validation passed.
- Browser acceptance used a synthetic local composer with all provider calls and
  mail writes mocked. Verified disabled-before-selection, explicit Zoom-class
  confirmation, editable Markdown insertion and the tutor-access radios.
- A parallel backend attempt hit the existing synthetic database startup limit;
  rerunning the complete suite serially passed. No source workaround was added.

Publish this as a new immutable v2 release milestone, with the approved style
included. Its exact commit, tag and signed artifact identity are the release's
authority. Source/build acceptance is not proof of live provider configuration.

Native operator activation must use the existing attested release workflow.
Before enabling, verify the approved style, protected keys, host IDs, timezone,
read scopes, student-data permission and provider spending limit. First test with
an authorized synthetic Zoom transcript and review its editable draft without
sending. Real student generation remains an explicit administrator action.

Rollback: set `SESSION_NOTE_AI_ENABLED=false` and restart through the normal
operator workflow, or restore the previous immutable application release.
Leave settings/history intact. No generated draft triggers sending or recovery,
and no delivery evidence needs reversing. Disabling tutor access blocks new
tutor API requests but cannot undo an already transmitted provider request.
