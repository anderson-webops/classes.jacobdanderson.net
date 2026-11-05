"""Bound recovery to explicit Xcode app-launch timeouts; preserve failed attempts."""


def is_app_launch_timeout(outcome, bundle_identifier):
    summary = outcome["summary"]
    failures = summary.get("testFailures", [])
    if not (
        outcome["status"] == 65
        and summary.get("totalTestCount") == summary.get("failedTests") == 1
        and summary.get("passedTests") == summary.get("skippedTests") == 0
        and len(failures) == 1
    ):
        return False
    failure = failures[0]
    text = failure.get("failureText", "")
    return (
        failure.get("testIdentifierString")
        == "CanonicalCourseUITests/testCourseWorkflow()"
        and bool(bundle_identifier)
        and bundle_identifier in text
        and (
            text.startswith("Failed to launch <XCUIApplicationImpl:")
            and "Timed out while launching application via Xcode." in text
            or text.startswith("Failed to get launch progress for <XCUIApplicationImpl:")
            and "Timed out while requesting launch progress." in text
        )
    )


def run_with_launch_recovery(run_case, recover_device, retain_attempt, bundle_identifier):
    first = run_case(0)
    if not is_app_launch_timeout(first, bundle_identifier):
        return first
    retain_attempt("beforeRecovery", first)
    recover_device()
    second = run_case(1)
    retain_attempt("afterRecovery", second)
    return second
