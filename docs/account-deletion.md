# User Account Deletion Contract

The self-service, tutor, and Admin user-deletion routes all use one deletion
service. The service requires a MongoDB replica set or mongos and returns `503`
without making changes when transactions are unavailable. This is deliberate:
an account must not disappear while its personal data remains because one part
of a cleanup failed.

## Deleted atomically

- The user account and its embedded profile, course-access, and progress data
- Google or Apple external-identity links
- Outstanding password-reset tokens
- Code IDE projects and project reviews
- Internal email records and scheduled sessions
- Session notes linked by account ID, plus legacy unlinked notes whose primary
  email matches the deleted account

The operation is idempotent. A transaction failure rolls back the entire
deletion, and retrying an already completed deletion does not recreate or
re-delete data. The sweep runs sequentially inside the transaction because the
MongoDB driver does not support parallel operations within one transaction.
Tutor-initiated deletion also rechecks that the tutor is still assigned to the
student inside that same transaction, preventing a stale authorization check
from deleting an account after the assignment changes.
Successful self-deletion clears the signed browser session before returning.

## Security-audit policy

Security audit history is retained so authentication and authorization events
remain useful for incident review. Before the account is removed, every direct
user ID in an audit actor or target reference is replaced with the same fresh,
random ObjectId. The pseudonym is not written to the user record or to a
separate lookup table, so it preserves event-to-event correlation without
retaining a mapping back to the deleted account.

The final deletion event uses that audit pseudonym as its target. For
self-deletion, it omits the original user actor ID so the event cannot
reintroduce the identifier after cleanup. Staff-initiated deletion events keep
the tutor or Admin actor attribution because those accounts were not deleted.
