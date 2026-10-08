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

The requested style reference is
`https://chatgpt.com/share/6ac660b2-b16c-83ea-a2c8-c5eb29e2ea39`.
The shared URL redirected to an account-loading failure. The administrator then
provided the GPT's conventions directly, and those are the built-in default:
third-person, factual, constructive notes with **Homework Check**:, **In Class**:
and **Homework**:. Colons remain outside the bold labels and project names are
bold. Uncertain homework remains uncertain; confirmed promises can appear in a
short **Follow-up**: section. The output is raw Markdown rather than an outer
code block because it goes directly into the Markdown editor.

The selected student's first given name controls formatting only, never identity
or authorization. Devin/Jinen use second person and omit Homework Check.
Jayden/Abby use a topic-organized **Overall Update**: format. This single-class
feature does not silently claim to accumulate a complete reporting period,
combine students, track earlier updates or reset them after sending. Those
multi-session workflows require separately verified transcripts and history;
existing notes are never deleted or marked sent by generation.

An optional style override must exclude private example details and factual
example-student content that should not be shared with the provider. The
student-specific formatting and factual safety rules still apply to overrides.

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
[OpenAI Responses](https://developers.openai.com/api/reference/python/resources/responses/methods/create).

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
| `POST /generate` | Same identity/date/meeting metadata plus `{selectionToken, confirmedStudent: true}`. Returns `{markdown, draftOnly: true, source: {startAt, timezone}}`. |

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
sanitized transcript and approved style, not recipient addresses, passwords,
meeting URLs, mailbox contents or other student's saved note history. Caption
timing, email addresses, URLs and labeled access details are removed. Transcript
content remains untrusted data, never system instructions. Sanitization is not a
guarantee that every personal detail in a spoken conversation can be removed;
enable this only with appropriate permission to process student transcripts.

Responses use `store: false`, no tools, and an output budget of 3,000 tokens.
This avoids stored Responses application state; it does not promise zero provider
retention or replace an organization's retention/privacy agreement. Incomplete,
refused, oversized and failed responses do not update the draft. No transcript,
AI body, token, address, raw provider error or external meeting identity is logged
or persisted by this integration.

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
