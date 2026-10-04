import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "mac_workflow", Path(__file__).parents[1] / "scripts/session-note-mac/verify_notes.py"
)
workflow = importlib.util.module_from_spec(spec)
spec.loader.exec_module(workflow)


def page(rows=None, cursor=None):
    return dict(schemaVersion=2, coverage="site_records_only", coverageSince=None,
                coverageDetails=dict(completeHistoricalCoverage=False,
                                     sources=["site_saved_notes", "site_smtp_attempts", "registered_external_metadata"],
                                     mailboxHistoryQueried=False, expectedSessionsIncluded=False),
                statusMeaning="Primary SMTP acceptance is not inbox delivery; missing evidence is incomplete.",
                records=rows or [], nextCursor=cursor)


def record(**changes):
    return dict(recordId="note", noteId="note", recordType="site_note", studentId="student",
                classDate="2026-09-18", sentAt=None, deliveryStatus="unknown", deliverySource=None,
                evidenceStatus="legacy_missing_metadata", statusReason="legacy_missing_metadata",
                evidenceRecordedAt=None, externalSentAt=None, scheduledSessionId="session19",
                actualSessionStartAt="2026-09-19T01:00:00Z", sessionTimezone="America/Los_Angeles",
                associationStatus="verified_session", **changes)


class MacWorkflowTests(unittest.TestCase):
    def test_empty_evidence_preserves_every_coverage_field(self):
        result = workflow.verify_query({"studentId": "student"}, "2026-09-01", "2026-09-30", 100, lambda _: page())
        self.assertTrue(result["paginationComplete"])
        self.assertIsNone(result["coverageSince"])
        self.assertFalse(result["coverageDetails"]["completeHistoricalCoverage"])
        self.assertEqual(result["statusMeaning"], page()["statusMeaning"])

    def test_pages_keep_session_identity_and_status_reasons(self):
        pages = iter([page([record()], "next"), page([{**record(), "recordId": "second"}])])
        result = workflow.verify_query({"studentId": "student"}, "2026-09-01", "2026-09-30", 100, lambda _: next(pages))
        self.assertEqual(len(result["pages"]), 2)
        for item in result["pages"]:
            self.assertEqual(item["metadata"]["records"][0]["scheduledSessionId"], "session19")
            self.assertEqual(item["metadata"]["records"][0]["statusReason"], "legacy_missing_metadata")
            self.assertEqual(item["metadata"]["statusMeaning"], page()["statusMeaning"])

    def test_later_schema_or_network_failure_retains_completed_pages(self):
        for tail in ({**page(), "schemaVersion": 3}, OSError("private transport details")):
            pages = iter([page([record()], "next"), tail])
            def fetch(_):
                value = next(pages)
                if isinstance(value, Exception):
                    raise value
                return value
            with self.assertRaises(workflow.IncompleteEvidence) as error:
                workflow.verify_query({"studentId": "student"}, "2026-09-01", "2026-09-30", 100, fetch)
            result = error.exception.result
            self.assertFalse(result["paginationComplete"])
            self.assertEqual(len(result["pages"]), 1)
            self.assertEqual(result["coverage"], "site_records_only")
            self.assertNotIn("private transport", result["reason"])

    def test_cursor_slice_never_claims_complete_window(self):
        result = workflow.verify_query({"studentId": "student"}, "2026-09-01", "2026-09-30", 100, lambda _: page(), "slice")
        self.assertFalse(result["paginationComplete"])
        self.assertTrue(result["startedAtCursor"])

    def test_shared_mailbox_or_old_subject_date_does_not_match_another_session(self):
        bindings = [{"entryId": "actual", "studentId": "student", "scheduledSessionId": "session19"},
                    {"entryId": "old_date", "studentId": "student", "scheduledSessionId": "session18"},
                    {"entryId": "other_child", "studentId": "other", "scheduledSessionId": "session19"}]
        result = workflow.associate_bindings([record()], bindings)
        self.assertEqual([r["associationStatus"] for r in result["associations"]], ["verified_session", "unverified", "unverified"])
        self.assertEqual(result["associations"][0]["siteEvidence"][0]["classDate"], "2026-09-18")

    def test_unknown_or_saved_site_evidence_never_overwrites_verified_local_sent(self):
        local = [{"studentId": "student", "scheduledSessionId": "session19", "source": "local_sent_item", "observedSendAt": "2026-09-20T00:00:00Z"}]
        for site in ([], [record()], [{**record(), "evidenceStatus": "saved_not_sent"}]):
            result = workflow.associate_bindings(site, [{"entryId": "actual", "studentId": "student", "scheduledSessionId": "session19"}], local)
            self.assertEqual(result["localSentEvidence"], local)
            self.assertEqual(result["associations"][0]["localSentEvidence"], local)

    def test_projection_excludes_mail_identifiers_and_private_bodies(self):
        row = {**record(), "messageId": "private@example.test", "subject": "Private subject", "markdown": "Private code"}
        result = workflow.project_response(page([row]))["records"][0]
        self.assertNotIn("messageId", result)
        self.assertNotIn("subject", result)
        self.assertNotIn("markdown", result)
        self.assertEqual(result["recordId"], "note")

    def test_repeated_cursor_and_changed_coverage_fail_visibly(self):
        for second in (page([], "next"), {**page(), "coverage": "different"}):
            pages = iter([page([], "next"), second])
            with self.assertRaises(workflow.IncompleteEvidence):
                workflow.verify_query({"studentId": "student"}, "2026-09-01", "2026-09-30", 100, lambda _: next(pages))


if __name__ == "__main__":
    unittest.main()
