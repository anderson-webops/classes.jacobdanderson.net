# Code IDE account transitions

The `/ide`, `/python-ide` and `/bluej` entry points mount an account-bound
workspace. Changing account or signing out revokes the previous workspace's
requests immediately and replaces its editor, project state and timers. A rapid
sign-out and sign-in to the same account also creates a new lifetime.

Local recovery retains the original account namespace, including separate tutor,
administrator and classroom-learner prefixes. Deferred writes capture detached
files and serialize by owner. A newer unload snapshot cannot be replaced by an
older asynchronous mirror, and revoked clear operations cannot erase recovery
for a later session. IndexedDB recovery is queued even when the smaller
localStorage mirror is full. Existing autosave-off and manual-save behavior is retained.
Signing out does not copy private work into the anonymous workspace.

Every own-workspace request includes `X-Code-IDE-Owner` and an account-lifetime
abort signal. The server authenticates normally, then compares that precondition
with its authenticated owner before reading or mutating projects or reviews.
A mismatch returns a generic 409 response without revealing either account.
The header never selects an owner or grants access. Older clients without this
header retain existing authentication and project ownership checks; users must
reload the updated client to receive the account-transition protections.

Synthetic regression coverage lives in
`front-end/test/code-ide-account-isolation.spec.test.ts`,
`back-end/test/code-ide-account.spec.test.ts` and
`back-end/test/python-project-review-routes.spec.test.ts`. It covers account
switches, sign-out, same-account return, delayed recovery and writes, cancellation,
all eight own-workspace API operations, role-qualified identities and legacy
requests. No production accounts, projects or provider messages are used.
