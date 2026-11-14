"""Inspect the retained failed Capstone result without rerunning the app."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/swift-capstone-original-diagnostics"
OUT.mkdir(parents=True, exist_ok=True)
TASK = os.environ.get("CLASSES_FAMILY_TASK_ID", "capstone-original-diagnostics")
EXPECTED = json.loads((ROOT / "test/fixtures/swift-capstone-original-failure-members.json").read_text())


def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def interrupted(signum, _frame):
    raise InterruptedError("Cancelled by signal " + str(signum))


signal.signal(signal.SIGTERM, interrupted)
signal.signal(signal.SIGINT, interrupted)


def run(args, timeout=120):
    started = utc()
    child = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                             start_new_session=True, text=True)
    cleanup = "not needed"
    stdout = stderr = ""
    record = {"parentTask": TASK, "parentPid": os.getpid(), "cwd": str(ROOT),
              "command": args, "pid": child.pid, "startTime": started, "timeoutSeconds": timeout}
    print(json.dumps({"event": "start", **record}), flush=True)
    try:
        stdout, stderr = child.communicate(timeout=timeout)
    except BaseException:
        cleanup = "child process group terminated"
        os.killpg(child.pid, signal.SIGTERM)
        try:
            stdout, stderr = child.communicate(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            stdout, stderr = child.communicate()
        raise
    finally:
        record.update({"endTime": utc(), "exitCode": child.returncode,
                       "childProcessGroupCleanup": cleanup, "stdout": stdout, "stderr": stderr})
        with (OUT / "processes.jsonl").open("a") as stream:
            stream.write(json.dumps(record) + "\n")
        print(json.dumps({"event": "end", **{k: v for k, v in record.items() if k not in ("stdout", "stderr")}}), flush=True)
    if child.returncode:
        raise RuntimeError(json.dumps(record))
    return stdout


scratch = Path(tempfile.mkdtemp(prefix="capstone-original-"))
try:
    run(["gh", "run", "download", str(EXPECTED["run"]), "--repo", EXPECTED["repository"],
         "--name", EXPECTED["artifactName"], "--dir", str(scratch)])
    result = scratch / EXPECTED["resultBundle"]
    if not result.exists():
        matches = list(scratch.glob("*/" + EXPECTED["resultBundle"]))
        assert len(matches) == 1, matches
        result = matches[0]
    root = result.resolve()
    actual = {str(p.relative_to(result)) for p in result.rglob("*") if p.is_file()}
    assert actual == set(EXPECTED["members"]), "Unexpected original result members"
    for name, digest in EXPECTED["members"].items():
        path = result / name
        assert not path.is_symlink() and path.resolve().is_relative_to(root)
        assert hashlib.sha256(path.read_bytes()).hexdigest() == digest, name
    summary = json.loads(run(["xcrun", "xcresulttool", "get", "test-results", "summary",
                              "--path", str(result)]))
    (OUT / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    assert summary["failedTests"] == 1 and summary["totalTestCount"] == 1
    failures = summary["testFailures"]
    assert any('value == "1"' in failure["failureText"] for failure in failures)
    run(["xcrun", "xcresulttool", "export", "attachments", "--path", str(result),
         "--output-path", str(OUT / "attachments")])
    help_text = run(["xcrun", "xcresulttool", "get", "test-results", "activities", "--help"])
    command = ["xcrun", "xcresulttool", "get", "test-results", "activities", "--path", str(result)]
    if "--test-id" in help_text:
        command += ["--test-id", "CanonicalCourseUITests/testCourseWorkflow()"]
    activities = run(command)
    (OUT / "activities.json").write_text(activities)
    proof = {"inspectedOriginal": True, "nativeAppRerun": False,
             "repository": EXPECTED["repository"], "run": EXPECTED["run"],
             "artifact": EXPECTED["artifact"], "originalArchiveSHA256": EXPECTED["archiveSHA256"],
             "allFailedResultMemberBytesVerified": True, "members": len(actual),
             "failureSummary": failures, "diagnosticFiles": [
                 str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file()
             ]}
    (OUT / "proof.json").write_text(json.dumps(proof, indent=2) + "\n")
finally:
    shutil.rmtree(scratch)
