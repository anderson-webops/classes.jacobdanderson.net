import importlib.util
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location("client", Path(__file__).parents[1] / "scripts/session-notes-client.py")
client = importlib.util.module_from_spec(spec)
spec.loader.exec_module(client)

def page(rows=None, cursor=None):
    return dict(schemaVersion=2, coverage="site_records_only", coverageSince=None,
                coverageDetails=dict(completeHistoricalCoverage=False),
                statusMeaning="Incomplete evidence is not overdue mail",
                records=rows or [], nextCursor=cursor)

def record(status="saved_not_sent"):
    return dict(recordId="record", noteId="note", recordType="site_note", studentId="student",
                classDate="2026-09-18", sentAt=None, deliveryStatus="unknown", deliverySource=None,
                evidenceStatus=status, statusReason=status, evidenceRecordedAt=None,
                externalSentAt=None, scheduledSessionId="session19", actualSessionStartAt="2026-09-19T00:00:00Z",
                sessionTimezone="UTC", associationStatus="verified_session")

class ClientTests(unittest.TestCase):
    def test_empty_preserves_coverage(self):
        result = client.fetch_evidence("", "", "student", "2026-09-01", "2026-09-30", fetch=lambda *a: page())
        self.assertTrue(result["paginationComplete"])
        self.assertIsNone(result["coverageSince"])
        self.assertEqual(result["schemaVersion"], 2)

    def test_every_page_retained(self):
        pages = iter([page([record()], "cursor"), page([{**record(), "recordId": "external", "recordType": "external_evidence", "externalSentAt": "2026-09-20T00:00:00Z"}])])
        result = client.fetch_evidence("", "", "", "", "", fetch=lambda *a: next(pages))
        self.assertEqual(len(result["pages"]), 2)
        self.assertEqual(len(result["records"]), 2)

    def test_schema_fails_visibly(self):
        with self.assertRaises(client.EvidenceError):
            client.verify_page({**page(), "schemaVersion": 1})
        with self.assertRaises(client.EvidenceError):
            client.verify_page({**page([record()]), "coverageDetails": None, "schemaVersion": 3})

    def test_missing_identity_fails(self):
        row = record()
        del row["scheduledSessionId"]
        with self.assertRaises(client.EvidenceError):
            client.verify_page(page([row]))

    def test_date_never_proves_identity(self):
        self.assertFalse(client.matches_actual_session(record(), "student", "session18"))
        self.assertTrue(client.matches_actual_session(record(), "student", "session19"))

    def test_saved_only_and_local_sent_remain_separate(self):
        result = client.preserve_local_sent([record()], [{"source": "local_sent_item", "observedSendAt": "verified"}])
        self.assertEqual(result["siteEvidence"][0]["sentAt"], None)
        self.assertEqual(result["localSentEvidence"][0]["observedSendAt"], "verified")

    def test_changed_coverage_and_repeated_cursor_fail(self):
        pages = iter([page([], "cursor"), {**page(), "coverage": "different"}])
        with self.assertRaises(client.EvidenceError):
            client.fetch_evidence("", "", "", "", "", fetch=lambda *a: next(pages))
        with self.assertRaises(client.EvidenceError):
            client.fetch_evidence("", "", "", "", "", fetch=lambda *a: page([], "cursor"))

    def test_metadata_only_registration(self):
        metadata = dict(source="mac_sent_item", evidenceType="observed_sent_item", evidenceRef="opaque", idempotencyKey="stable")
        self.assertEqual(client.register_external("", "", metadata, fetch=lambda *a, **k: k["payload"]), metadata)
        with self.assertRaises(client.EvidenceError):
            client.register_external("", "", {**metadata, "subject": "private"})

if __name__ == "__main__":
    unittest.main()
