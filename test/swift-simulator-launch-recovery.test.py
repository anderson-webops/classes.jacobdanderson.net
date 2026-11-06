"""Exercise observed launch failures and ordinary test failures without Xcode."""
import copy
import json
import unittest
from pathlib import Path

from swift_simulator_launch_recovery import (
    is_app_launch_timeout,
    run_with_launch_recovery,
)


class LaunchRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.observed = json.loads(
            (Path(__file__).parent / "fixtures/swift-capstone-launch-failures.json").read_text()
        )
        self.passed = {"status": 0, "summary": {
            "totalTestCount": 1, "passedTests": 1, "failedTests": 0,
            "skippedTests": 0, "testFailures": []}}

    def exercise(self, outcomes, bundle):
        trace = []
        retained = []
        def execute(attempt):
            trace.append(("execute", attempt))
            return outcomes[attempt]
        def recover():
            trace.append(("recover",))
        def retain(stage, result):
            retained.append((stage, result))
        result = run_with_launch_recovery(execute, recover, retain, bundle)
        return result, trace, retained

    def test_observed_failures_get_one_recovery_and_retain_both_attempts(self):
        for observed in self.observed:
            with self.subTest(job=observed["sourceJob"]):
                self.assertTrue(is_app_launch_timeout(observed, observed["bundleIdentifier"]))
                result, trace, retained = self.exercise([observed, self.passed], observed["bundleIdentifier"])
                self.assertEqual(result, self.passed)
                self.assertEqual(trace, [("execute", 0), ("recover",), ("execute", 1)])
                self.assertEqual(retained, [("beforeRecovery", observed), ("afterRecovery", self.passed)])

    def test_second_launch_failure_remains_a_failure(self):
        failed = self.observed[0]
        result, trace, retained = self.exercise([failed, failed], failed["bundleIdentifier"])
        self.assertEqual(result["status"], 65)
        self.assertEqual(len(retained), 2)
        self.assertEqual(trace, [("execute", 0), ("recover",), ("execute", 1)])

    def test_passed_test_is_not_repeated(self):
        result, trace, retained = self.exercise([self.passed], self.observed[0]["bundleIdentifier"])
        self.assertEqual(result, self.passed)
        self.assertEqual(trace, [("execute", 0)])
        self.assertEqual(retained, [])

    def test_assertion_and_mixed_failures_are_not_retried(self):
        for changes in [
            {"failureText": 'XCTAssertTrue failed: Save button is not visible'},
            {"failureText": 'Timed out waiting for the card to be hittable'},
            {"testIdentifierString": "CanonicalCourseUITests/testOtherWorkflow()"},
        ]:
            failed = copy.deepcopy(self.observed[0])
            failed["summary"]["testFailures"][0].update(changes)
            result, trace, retained = self.exercise([failed], failed["bundleIdentifier"])
            self.assertEqual(result, failed)
            self.assertEqual(trace, [("execute", 0)])
            self.assertEqual(retained, [])
        failed = copy.deepcopy(self.observed[0])
        failed["summary"]["testFailures"].append({"failureText": "XCTAssertEqual failed"})
        self.assertFalse(is_app_launch_timeout(failed, failed["bundleIdentifier"]))
        failed = copy.deepcopy(self.observed[0])
        failed["summary"]["skippedTests"] = 1
        self.assertFalse(is_app_launch_timeout(failed, failed["bundleIdentifier"]))
        self.assertFalse(is_app_launch_timeout(self.observed[0], "another.application"))

    def test_recovery_error_is_not_swallowed(self):
        failed = self.observed[0]
        retained = []
        def recover():
            raise RuntimeError("owned simulator could not restart")
        with self.assertRaisesRegex(RuntimeError, "could not restart"):
            run_with_launch_recovery(lambda _: failed, recover,
                                     lambda stage, result: retained.append((stage, result)),
                                     failed["bundleIdentifier"])
        self.assertEqual(retained, [("beforeRecovery", failed)])


if __name__ == "__main__":
    unittest.main()
