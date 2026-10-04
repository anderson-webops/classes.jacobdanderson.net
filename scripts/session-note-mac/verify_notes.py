#!/usr/bin/env python3
"""Read-only Mac workflow. Stable identities, complete coverage, no mail sending."""
import argparse
import datetime as dt
import importlib.util
import json
import os
import re
import stat
import time
from pathlib import Path

folder = Path(__file__).resolve().parent
DEFAULT_CREDENTIAL_PATH = folder / "private/classes-session-notes-read-only.json"
helper = folder / "session_notes_client.py"
if not helper.exists():
    helper = folder.parent / "session-notes-client.py"
spec = importlib.util.spec_from_file_location("session_notes_client", helper)
client = importlib.util.module_from_spec(spec)
spec.loader.exec_module(client)
ENDPOINT = "https://classes.jacobdanderson.net/api/session-notes/verification"
BASE = ENDPOINT.rsplit("/session-notes/verification", 1)[0]
FIELDS = client.RECORD_FIELDS | {
    "originalSessionStartAt", "associationCorrectedAt", "operationId", "noteVersion",
    "replacesRecordId", "supersededByRecordId",
}


def load_read_credential(path):
    """Load an owner-only JSON credential without a Downloads fallback."""
    try:
        fd = os.open(path, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
        with os.fdopen(fd, "r") as handle:
            info = os.fstat(handle.fileno())
            if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid() or info.st_mode & 0o077 or info.st_size > 16384:
                raise ValueError()
            raw = handle.read(16385)
            if len(raw) > 16384:
                raise ValueError()
            config = json.loads(raw)
        tokens = [config[key] for key in ("token", "bearerToken", "accessToken", "bearer_token", "access_token") if isinstance(config.get(key), str)]
        if len(tokens) != 1 or not tokens[0] or re.search(r"\s", tokens[0]):
            raise ValueError()
        return tokens[0]
    except Exception:
        raise client.EvidenceError("Read credential could not be loaded safely. No request sent.") from None


def project_response(data):
    client.verify_page(data)
    return {**{key: data[key] for key in client.PAGE_FIELDS},
            "records": [{key: row[key] for key in FIELDS if key in row} for row in data["records"]],
            "nextCursor": data["nextCursor"]}


class IncompleteEvidence(client.EvidenceError):
    def __init__(self, reason, result):
        super().__init__(reason)
        self.result = result


def verify_query(identity, from_date, to_date, limit, fetch, initial_cursor=None):
    if set(identity) not in ({"studentId"}, {"studentName"}):
        raise client.EvidenceError("Select exactly one stable student ID or exact legacy label")
    params = {**identity, "from": from_date, "to": to_date, "limit": limit}
    if initial_cursor:
        params["cursor"] = initial_cursor
    pages, seen_ids, seen_cursors = [], set(), set()
    coverage = None
    from urllib.parse import urlencode
    try:
        for _ in range(100):
            raw = fetch("/session-notes/verification?" + urlencode(params))
            data = project_response(raw)
            current = {key: data[key] for key in client.PAGE_FIELDS}
            if coverage is not None and coverage != current:
                raise client.EvidenceError("Coverage changed during pagination; evidence is incomplete")
            coverage = current
            for row in data["records"]:
                if row["recordId"] in seen_ids:
                    raise client.EvidenceError("Duplicate evidence record; pagination is incomplete")
                seen_ids.add(row["recordId"])
            pages.append({"metadata": data})
            cursor = data["nextCursor"]
            if cursor is None:
                return {**identity, "pages": pages, "outcome": "recorded_evidence_only",
                        "paginationComplete": initial_cursor is None,
                        "startedAtCursor": initial_cursor is not None, **coverage}
            if not isinstance(cursor, str) or not 0 < len(cursor) <= 256 or cursor in seen_cursors:
                raise client.EvidenceError("Invalid or repeated cursor; evidence is incomplete")
            seen_cursors.add(cursor)
            params["cursor"] = cursor
        raise client.EvidenceError("Page bound reached; evidence is incomplete")
    except Exception as error:
        reason = str(error) if isinstance(error, client.EvidenceError) else "Network or response failure; evidence is incomplete"
        partial = {**identity, "pages": pages, "paginationComplete": False,
                   "outcome": "evidence_error", "reason": reason,
                   "startedAtCursor": initial_cursor is not None, **(coverage or {})}
        raise IncompleteEvidence(reason, partial) from None



def associate_bindings(site_records, bindings, verified_local_sent=None):
    """Unknown site evidence never invalidates protected local Sent observations."""
    local = verified_local_sent or []
    associations = []
    for binding in bindings:
        student, session = binding.get("studentId"), binding.get("scheduledSessionId")
        if not student or not session:
            associations.append({"entryId": binding.get("entryId"), "associationStatus": "unverified"})
            continue
        selected = [row for row in site_records if client.matches_actual_session(row, student, session)]
        local_selected = [row for row in local if row.get("studentId") == student and row.get("scheduledSessionId") == session]
        associations.append({"entryId": binding.get("entryId"), "associationStatus": "verified_session" if selected else "unverified",
                             "siteEvidence": selected, "localSentEvidence": local_selected})
    return {**client.preserve_local_sent(site_records, local), "associations": associations}


def main():
    parser = argparse.ArgumentParser()
    who = parser.add_mutually_exclusive_group(required=True)
    who.add_argument("--student-name", action="append")
    who.add_argument("--student-id", action="append")
    parser.add_argument("--from", dest="start", required=True)
    parser.add_argument("--to", dest="end", required=True)
    parser.add_argument("--limit", type=int, default=100)
    parser.add_argument("--cursor")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--credential-file", type=Path, default=DEFAULT_CREDENTIAL_PATH,
                        help="Owner-only read credential JSON; defaults to the workflow's private directory")
    args = parser.parse_args()
    try:
        start, end = dt.date.fromisoformat(args.start), dt.date.fromisoformat(args.end)
        assert start.isoformat() == args.start and end.isoformat() == args.end
        assert 1 <= (end-start).days+1 <= 366 and 1 <= args.limit <= 100
        assert not args.student_id or all(re.fullmatch("[a-fA-F0-9]{24}", value) for value in args.student_id)
        assert not args.student_name or all(0 < len(value.strip()) <= 120 for value in args.student_name)
        assert not args.cursor or re.fullmatch(r"[\w-]{1,256}", args.cursor)
    except (ValueError, AssertionError):
        parser.error("Invalid identity, date range, limit or cursor")
    try:
        token = load_read_credential(args.credential_file)
    except client.EvidenceError as error:
        parser.exit(1, str(error) + "\n")
    last = 0.0
    def fetch(path):
        nonlocal last
        time.sleep(max(0, 1.1-(time.monotonic()-last)))
        last = time.monotonic()
        return client.request_json(BASE, path, token)
    report = {"endpoint": ENDPOINT, "clientSchemaVersion": 2,
              "queriedAtUTC": dt.datetime.now(dt.timezone.utc).isoformat(),
              "from": args.start, "to": args.end,
              "deliveryMeaning": "Primary SMTP acceptance is not inbox delivery. Empty/unknown records are incomplete evidence, not overdue or never sent.",
              "queries": []}
    for identity in args.student_name or args.student_id:
        field = "studentName" if args.student_name else "studentId"
        selected = identity.strip() if field == "studentName" else identity.lower()
        try:
            result = verify_query({field: selected}, args.start, args.end, args.limit, fetch, args.cursor)
        except client.EvidenceError as error:
            result = getattr(error, "result", {field: selected, "pages": [], "outcome": "evidence_error", "paginationComplete": False, "reason": str(error)})
        except Exception:
            result = {field: selected, "pages": [], "outcome": "network_or_response_error", "paginationComplete": False}
        report["queries"].append(result)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    fd = os.open(args.output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w") as output:
        json.dump(report, output, indent=2)
    print("Private metadata report saved. No email was sent; prior reports and mailbox evidence were preserved.")
    if any(not query["paginationComplete"] for query in report["queries"]):
        parser.exit(1, "Evidence verification incomplete; inspect the private report before updating a tracker.\n")


if __name__ == "__main__":
    main()
