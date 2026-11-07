"""Exercise original result selection without Xcode, builds or test reruns."""
import importlib.util
import io
import json
from pathlib import Path
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "native_ui_evidence", ROOT / "scripts/inspect-native-ui-evidence.py")
inspector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inspector)


def archive(course="capstone", role="solution", size="small",
            variant="standard", failures=1, second_course=None):
    data = io.BytesIO()
    profiles = [dict(role=role, size=size, variant=variant, passed=False)
                for _ in range(failures)]
    with zipfile.ZipFile(data, "w") as bundle:
        bundle.writestr(course + "/proof.json", json.dumps(
            dict(simulatorTests=profiles)))
        bundle.writestr(course + "/results/" + role + "-" + size + "-"
                        + variant + ".xcresult/Info.plist", "result")
        bundle.writestr(course + "/results/starter-large-standard.xcresult/Info.plist",
                        "unrelated successful result")
        if second_course:
            bundle.writestr(second_course + "/proof.json", "{}")
    return zipfile.ZipFile(data)


class NativeResultSelectionTests(unittest.TestCase):
    def test_selects_exact_capstone_failure_and_excludes_other_results(self):
        with archive() as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertEqual(selected["course"], "capstone")
        self.assertEqual(selected["result"],
                         "capstone/results/solution-small-standard.xcresult")
        self.assertEqual(selected["testId"],
                         "CanonicalCourseUITests/testCourseWorkflow()")
        self.assertEqual(len(selected["selected"]), 2)

    def test_preserves_original_tracker_profile(self):
        with archive(course="tracker", size="large") as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertEqual(selected["result"],
                         "tracker/results/solution-large-standard.xcresult")
        self.assertEqual(selected["testId"], "TrackerUITests/testTrackerWorkflow()")

    def test_selects_swiftdata_failure_with_its_tracker_ui_identifier(self):
        with archive(course="swiftdata") as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertEqual(selected["course"], "swiftdata")
        self.assertEqual(selected["result"],
                         "swiftdata/results/solution-small-standard.xcresult")
        self.assertEqual(selected["testId"], "TrackerUITests/testTrackerWorkflow()")
        self.assertEqual(len(selected["selected"]), 2)

    def test_rejects_mixed_tracker_and_swiftdata_proofs(self):
        with archive(course="swiftdata", second_course="tracker") as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_accepts_largest_text_profile(self):
        with archive(variant="largest-text") as bundle:
            selected = inspector.select_failed_result(bundle)
        self.assertTrue(selected["result"].endswith("small-largest-text.xcresult"))

    def test_rejects_ambiguous_course_proofs(self):
        with archive(second_course="tracker") as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_unknown_course(self):
        with archive(course="unknown") as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_multiple_failures(self):
        with archive(failures=2) as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_missing_failure(self):
        with archive(failures=0) as bundle:
            with self.assertRaises(AssertionError):
                inspector.select_failed_result(bundle)

    def test_rejects_unexpected_profile_path(self):
        for field in [dict(role="../solution"), dict(size="../small"),
                      dict(variant="../standard")]:
            with self.subTest(field=field), archive(**field) as bundle:
                with self.assertRaises(AssertionError):
                    inspector.select_failed_result(bundle)


if __name__ == "__main__":
    unittest.main()
