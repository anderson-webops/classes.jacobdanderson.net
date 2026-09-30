# Private classroom workspace credentials

A shared course code grants enrollment in one course. It is not proof that a
learner owns an existing username or its saved projects. Every new classroom
workspace now requires a private password of 12–128 characters, stored only as
an Argon2 hash. Learners still do not need an email address. Use a password
manager or another private record; do not reuse or distribute classmates'
passwords.

## Existing workspaces and recovery

Existing learner IDs and project ownership do not change. There is no bulk
password assignment, data rewrite, project deletion, or automatic claim of an
old username. Passwordless legacy sessions stop working after this release.

The administrator, or the tutor who owns the course code and still has that
course enabled, can use **Recover an existing learner workspace** in the course
code manager. Confirm the learner's identity independently through existing
class records or a private conversation. A code, username, old browser session,
or request from a classmate alone is not sufficient proof.

Choose the existing code and username, confirm that identity was checked, and
reset the password. The server generates a random private password and returns
it once with `Cache-Control: no-store`. Give it privately to that learner and
hide it afterward. Do not put it in class chat, logs, tickets, screenshots, or
email broadcasts. No message is sent automatically. If the result is lost,
perform a new authorized reset rather than retrieving a stored password.

Recovery atomically replaces the credential hash and its random session
version. Every previously issued learner session is rejected on its next
authenticated request, including the current-learner endpoint. Saved projects
remain attached to the same learner ID. A disabled course code remains disabled
after recovery. Tutors cannot recover another staff member's code or a course
that is no longer enabled for them. Administrators can recover any course code.

## API and verification

- `POST /course-access/redeem` now requires `code`, `username`, and `password`.
  Existing usernames require the matching credential, including after a
  concurrent enrollment loses the unique-key race. Legacy usernames require
  staff recovery; providing a new password never claims them.
- `POST /course-access/codes/:codeID/learners/recover` requires an authenticated
  authorized staff session and the existing `username`. It preserves the learner
  and projects and returns only the new password. Existing mutation-origin and
  rate-limit protections apply.
- Identity responses never include password hashes or credential versions.
  Authentication failures do not disclose whether an existing workspace is
  passwordless or has a different password.
- Regression tests cover private enrollment, normalized-name reopening, invalid
  credentials, legacy-session rejection, staff ownership, recovery revocation,
  concurrent enrollment, and one-time recovery display.

Deploy the frontend and backend together. Rolling back to the former
passwordless authentication behavior reopens the reported security boundary;
it is not a safe authentication rollback. Keep the corrected backend in place
or disable classroom-code access while preparing a reviewed forward repair.

## Account deletion

Deleting an account removes session notes only when their immutable `user`
owner matches that account. Unowned legacy notes and other learners' notes are
preserved even if their email matches. Associating or removing those legacy
notes requires a separate verified-ownership or retention process.
