# Account Role Transfer Contract

Promotion and demotion require a MongoDB replica set or mongos. The API returns
`503` before making changes when transaction support is unavailable.

## Preserved atomically

- Name, normalized email, optional age/state, and the exact Argon2 password hash
- Google or Apple external identities
- Code IDE projects, including their owner ID and owner role
- A new session version, which prevents an old role cookie from becoming valid
  for the replacement account

## Promotion safeguards

Promotion is rejected with `409` while the user has learner-only state:
assigned tutors, course access/progress, recipient association, communications,
project reviews, session notes, or scheduled sessions. This prevents silent
loss or ambiguous reassignment. Clear or deliberately archive that state before
retrying.

## Demotion cleanup

Demotion transfers tutor-owned IDE projects, disables course access codes issued
by the tutor, removes the tutor from learner assignments, and clears future and
historical scheduled-session tutor references. Existing code-review records
retain the reviewer name and historical `tutor` role.

Every transfer deletes outstanding password-reset tokens for the old role.

The optional native integration test reads `MONGODB_REPLICA_SET_TEST_URI`,
creates an isolated temporary database, verifies both directions, and drops that
database afterward. It does not use Docker.
