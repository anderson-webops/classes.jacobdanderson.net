# Classes note drafting and evidence client

## Outcome

Release target: `v2.8.182`, through the existing attested native ARM64 release
workflow. The tag, release assets and signed inventory establish the exact
source and runtime identity; publication and protected activation remain separate.

The provider schema omits the Markdown regex while local decoding still requires
`**Homework**:`. Existing note text survives failed generation and expired Zoom
selections. Diagnostics contain only bounded stage/code fields and an opaque
request ID. Sending, archival, recovery and student authorization retain their
existing independent controls.

The maintained Mac client retains schema-v2 page coverage and separate mailbox
evidence, rejects foreign-student records and binds optional note/record IDs to
the actual session. The installed standalone client was updated with private
recoverable originals. Its live read-only synthetic empty query passed without
querying real student records or registering evidence.

## Acceptance evidence

The dedicated configured model, `gpt-5.6-luna`, completed the synthetic provider
fixture twice. The instrumented run returned HTTP 200/completed and passed local
Homework/shared-work validation on Node 24.18.0. The request contract digest and
service/lockfile digests are in
[`session-note-drafting-20261102.json`](../acceptance/session-note-drafting-20261102.json).
Zoom was stubbed; these checks performed no mail, note saves or database writes.

Local lint, type checks, build and 795 backend tests passed. The focused editor
suite passed 48 tests; the two Python client suites passed 25. Eight dependency
regressions and ten native deployment contracts passed; Linux archive behavior
remains covered by the native CI gates. Full and production audits reported zero
advisories for the root and independent backend graphs after clean locked installs.
The release requires the remaining applicable frontend and native artifact gates.

## Protected activation

Use the exact verified native artifact with the existing credentials, dedicated
provider/model, Node runtime, mail/recovery flags and external mutable stores.
Preserve the previous release and configuration as a recoverable rollback target.
This update has no database migration or historical evidence backfill.

Serve the artifact's signed minimal `/release.json` metadata with `no-store` from
one canonical location. Reconcile the existing host bridge with that location,
and retain the previous release's metadata behavior for rollback. Internal native
inventory and `/api/release` retain their private boundary.

Acceptance includes readiness, IPv4/IPv6 HTTPS, current metadata identity,
authorization and privacy; the editable draft survives expired/failed requests.
Verify the artifact's synthetic request contract against the recorded digest.
Ordinary sending and recovery retain their existing operating state throughout.
External evidence registration remains a separate scoped-credential workflow.
