#!/usr/bin/env python3
"""Metadata-only Mac reference client. No email sending or tracker finalization."""
import argparse
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode, urlparse
from urllib.request import Request, build_opener, HTTPRedirectHandler

SCHEMA_VERSION = 2
RECORD_FIELDS = {
    "recordId", "noteId", "recordType", "studentId", "classDate", "sentAt",
    "deliveryStatus", "deliverySource", "evidenceStatus", "statusReason",
    "evidenceRecordedAt", "externalSentAt", "scheduledSessionId",
    "actualSessionStartAt", "sessionTimezone", "associationStatus",
}
PAGE_FIELDS = {"coverage", "statusMeaning", "schemaVersion", "coverageSince", "coverageDetails"}


class EvidenceError(Exception):
    pass


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise EvidenceError("Redirect refused; verify the API origin")


def request_json(base, path, token, payload=None):
    parsed = urlparse(base)
    if parsed.scheme != "https" or not parsed.netloc or parsed.username or parsed.password:
        raise EvidenceError("Use the exact HTTPS API origin without embedded credentials")
    data = json.dumps(payload).encode() if payload is not None else None
    req = Request(base.rstrip("/") + path, data=data, headers={
        "Authorization": "Bearer " + token, "Accept": "application/json",
        **({"Content-Type": "application/json"} if data is not None else {}),
    })
    try:
        with build_opener(NoRedirect()).open(req, timeout=15) as response:
            raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise EvidenceError("Response exceeds the metadata limit")
            return json.loads(raw)
    except HTTPError as error:
        # Never print server response bodies or authentication headers.
        raise EvidenceError("Evidence API HTTP error " + str(error.code)) from None


def verify_page(page):
    if page.get("schemaVersion") != SCHEMA_VERSION:
        raise EvidenceError("Unsupported evidence schema; update the client before using records")
    if not PAGE_FIELDS.issubset(page) or not isinstance(page.get("records"), list) or not isinstance(page["coverageDetails"], dict) or not isinstance(page["statusMeaning"], str):
        raise EvidenceError("Coverage or status semantics are missing")
    if len(page["records"]) > 100 or "nextCursor" not in page:
        raise EvidenceError("Invalid pagination")
    for row in page["records"]:
        if not isinstance(row, dict) or not RECORD_FIELDS.issubset(row):
            raise EvidenceError("Critical record identity or evidence semantics are missing")


def fetch_evidence(base, token, student_id, from_date, to_date, fetch=request_json):
    params = {"studentId": student_id, "from": from_date, "to": to_date, "limit": "100"}
    records = []
    pages = []
    seen = set()
    for _ in range(100):
        page = fetch(base, "/session-notes/verification?" + urlencode(params), token)
        verify_page(page)
        metadata = {field: page[field] for field in PAGE_FIELDS}
        if pages and metadata != pages[0]:
            raise EvidenceError("Coverage changed during pagination; review before updating a tracker")
        pages.append(metadata)
        for row in page["records"]:
            if row["recordId"] in seen:
                raise EvidenceError("Duplicate record in paginated evidence")
            seen.add(row["recordId"])
            records.append(row)
        cursor = page["nextCursor"]
        if cursor is None:
            return {"records": records, "pages": pages, "paginationComplete": True, **metadata}
        if not isinstance(cursor, str) or not 0 < len(cursor) <= 256 or cursor in seen:
            raise EvidenceError("Invalid or repeated cursor")
        seen.add(cursor)
        params["cursor"] = cursor
    raise EvidenceError("Pagination bound reached; evidence is incomplete")


def matches_actual_session(record, student_id, session_id):
    return bool(session_id) and record["studentId"] == student_id and (
        record["scheduledSessionId"] == session_id
        and record["associationStatus"] == "verified_session"
    )


def preserve_local_sent(site_records, verified_local_sent):
    """Keep protected local observations separately sourced; never overwrite them."""
    return {"siteEvidence": site_records, "localSentEvidence": verified_local_sent}


def register_external(base, token, metadata, fetch=request_json):
    allowed = {"studentId", "noteId", "scheduledSessionId", "unlinked", "classDate",
               "source", "observedSendAt", "evidenceType", "evidenceRef", "idempotencyKey"}
    if set(metadata) - allowed or len(json.dumps(metadata)) > 16000:
        raise EvidenceError("Registration accepts bounded metadata only")
    if metadata.get("source") != "mac_sent_item" or metadata.get("evidenceType") != "observed_sent_item":
        raise EvidenceError("Mac registration requires an observed Sent item, not an attestation")
    if not metadata.get("idempotencyKey") or not metadata.get("evidenceRef"):
        raise EvidenceError("Retain a stable key and opaque evidence reference before submission")
    return fetch(base, "/session-notes/evidence", token, payload=metadata)


def read_private_token(path):
    token_path = Path(path)
    if token_path.stat().st_mode & 0o077:
        raise EvidenceError("Credential file must be readable only by its owner")
    return token_path.read_text().strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--api", required=True, help="Exact HTTPS base ending in /api")
    parser.add_argument("--token-file", required=True)
    sub = parser.add_subparsers(dest="action", required=True)
    verify = sub.add_parser("verify")
    verify.add_argument("--student-id", required=True)
    verify.add_argument("--from", dest="from_date", required=True)
    verify.add_argument("--to", dest="to_date", required=True)
    register = sub.add_parser("register")
    register.add_argument("--metadata-file", required=True)
    args = parser.parse_args()
    try:
        token = read_private_token(args.token_file)
        if args.action == "verify":
            result = fetch_evidence(args.api, token, args.student_id, args.from_date, args.to_date)
        else:
            raw = Path(args.metadata_file).read_bytes()
            if len(raw) > 16000:
                raise EvidenceError("Metadata exceeds registration limit")
            result = register_external(args.api, token, json.loads(raw))
        print(json.dumps(result, indent=2))
    except (EvidenceError, OSError, ValueError, KeyError) as error:
        # No token, raw stack trace, private payload or server body is printed.
        parser.exit(1, "Evidence workflow failed: " + (str(error) if isinstance(error, EvidenceError) else "invalid local input") + "\n")


if __name__ == "__main__":
    main()
