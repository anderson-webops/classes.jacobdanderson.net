"""Compile actual browser ZIPs and exercise both source roles on iOS simulators."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import platform
import re
import signal
import subprocess
import sys
import time
import zipfile

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--browser", type=Path, required=True)
parser.add_argument("--proof", type=Path, required=True)
args = parser.parse_args()
args.browser = args.browser.resolve()
args.proof = args.proof.resolve()
OUT = args.proof.parent
assert platform.system() == "Darwin", "An existing Xcode/iOS simulator installation is required"
assert not args.proof.exists()
OUT.mkdir(parents=True, exist_ok=True)
WORK = OUT / "work"
WORK.mkdir()
(WORK / ".metadata_never_index").touch()
LOGS = OUT / "logs"
LOGS.mkdir()
RESULTS = OUT / "results"
RESULTS.mkdir()
task_id = "swift-welcome-ios-" + os.environ.get("GITHUB_RUN_ID", str(os.getpid()))


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def stop(signum, _frame):
    raise SystemExit(128 + signum)


signal.signal(signal.SIGTERM, stop)
signal.signal(signal.SIGINT, stop)


def run(label, command, timeout=180):
    event = dict(parentTaskId=task_id, parentPid=os.getpid(), cwd=str(ROOT),
                 command=command, startTime=now(), timeoutSeconds=timeout)
    child = subprocess.Popen(command, cwd=ROOT, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    event["pid"] = child.pid
    log = OUT / "processes.jsonl"
    with log.open("a") as stream:
        stream.write(json.dumps(dict(event, event="start")) + "\n")
    stdout, stderr = b"", b""
    cleanup = "owned process exited and reaped"
    try:
        stdout, stderr = child.communicate(timeout=timeout)
    except BaseException:
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                stdout, stderr = child.communicate(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                stdout, stderr = child.communicate()
        cleanup = "owned child process group terminated and reaped"
        raise
    finally:
        with log.open("a") as stream:
            stream.write(json.dumps(dict(event, event="end", endTime=now(),
                                         exitCode=child.returncode,
                                         childProcessGroupCleanup=cleanup)) + "\n")
        (LOGS / (label + ".stdout.txt")).write_bytes(stdout)
        (LOGS / (label + ".stderr.txt")).write_bytes(stderr)
    assert child.returncode == 0, (label, stderr.decode(errors="replace")[-4000:])
    return stdout


def version(value):
    numbers = re.match(r"(\d+)\.(\d+)(?:\.(\d+))?", value)
    assert numbers, value
    return tuple(int(x or "0") for x in numbers.groups())


def wait_for_idle():
    deadline = time.monotonic() + 300
    while os.getloadavg()[0] > 8:
        assert time.monotonic() < deadline, "Host load must settle before another native build/test"
        time.sleep(10)


fixture = json.loads((ROOT / "test/fixtures/swift-welcome-source.json").read_text())
browser = json.loads((args.browser / "swift-swift-welcome-course-proof.json").read_text())
profiles = browser["profiles"]
assert {(x["role"], x["width"]) for x in profiles} == {
    (role, width) for role in ("starter", "solution") for width in (390, 1280)
} and len(profiles) == 4
assert all(x["revision"] == fixture["revision"] and x["consentBeforeFetch"]
           and x["sameAttemptReused"] and x["previousWorkPreserved"]
           and x["remoteWrites"] == 0 for x in profiles)
record = dict(at=now(), accepted=False, sourceRevision=fixture["revision"],
              exports=[], simulatorTests=[], ownedSimulatorsDeleted=[])
args.proof.write_text(json.dumps(record, indent=2) + "\n")
sdk = run("sdk-path", ["/usr/bin/xcrun", "--sdk", "iphonesimulator", "--show-sdk-path"]).decode().strip()
sdk_version = run("sdk-version", ["/usr/bin/xcrun", "--sdk", "iphonesimulator", "--show-sdk-version"]).decode().strip()
assert version(sdk_version) >= (17, 0, 0)
arch = platform.machine()
assert arch in ("arm64", "x86_64")
target = arch + "-apple-ios17.0-simulator"
record.update(sdk=sdk, sdkVersion=sdk_version, target=target, languageMode="Swift6",
              architecture=arch, hostMacOS=platform.mac_ver()[0],
              swiftVersion=run("swift-version", ["/usr/bin/xcrun", "swiftc", "--version"]).decode().strip(),
              xcodeVersion=run("xcode-version", ["/usr/bin/xcrun", "xcodebuild", "-version"]).decode().strip())
for profile in profiles:
    role = profile["role"]
    expected_names = {"README.md", role + "/ContentView.swift", role + "/WelcomeProfileApp.swift"}
    for kind in ("exact", "edited"):
        archive = args.browser / profile[kind + "Archive"]
        assert archive.parent == args.browser and archive.stat().st_size < 8 * 1024 * 1024
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        assert digest == profile[kind + "ArchiveSha256"]
        files = profile["sourceFiles" if kind == "exact" else "editedFiles"]
        assert {x["name"] for x in files} == expected_names and len(files) == 3
        destination = WORK / "sdk" / archive.stem
        destination.mkdir(parents=True)
        with zipfile.ZipFile(archive) as z:
            assert len(z.infolist()) == 3
            for entry in z.infolist():
                path = PurePosixPath(entry.filename)
                assert not path.is_absolute() and ".." not in path.parts and "\\" not in entry.filename
                assert entry.file_size < 2 * 1024 * 1024
            for file in files:
                matches = [key for key in z.namelist() if key.endswith("/" + file["name"])]
                assert len(matches) == 1
                raw = z.read(matches[0])
                assert hashlib.sha256(raw).hexdigest() == file["sha256"]
                if kind == "exact":
                    source = fixture["files"][fixture["pack"] + "/" + file["name"]]
                    assert raw == source["content"].encode() and file["sha256"] == source["sha256"]
                path = destination / file["name"]
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(raw)
        sources = sorted(str(path) for path in destination.rglob("*.swift"))
        assert len(sources) == 2
        run("sdk-" + archive.stem, ["/usr/bin/xcrun", "swiftc", "-typecheck", "-parse-as-library",
                                  "-swift-version", "6", "-sdk", sdk, "-target", target,
                                  "-module-cache-path", str(WORK / "module-cache"), *sources])
        record["exports"].append(dict(archive=archive.name, sha256=digest, sdkTypecheckPassed=True))
        args.proof.write_text(json.dumps(record, indent=2) + "\n")

project_root = WORK / "xcode"
run("project-inputs", [sys.executable, str(ROOT / "test/swift-welcome-xcode.py"),
                       "--browser", str(args.browser), "--output", str(project_root)])
inputs = json.loads((project_root / "inputs.json").read_text())
project = inputs["project"]
for profile in inputs["profiles"]:
    wait_for_idle()
    run("build-" + profile["role"], [
        "/usr/bin/xcrun", "xcodebuild", "build-for-testing", "-project", project,
        "-scheme", profile["scheme"], "-configuration", "Debug", "-sdk", "iphonesimulator",
        "-destination", "generic/platform=iOS Simulator", "-jobs", "1",
        "-derivedDataPath", str(WORK / "derived"), "-disableAutomaticPackageResolution",
        "SWIFT_VERSION=6.0", "IPHONEOS_DEPLOYMENT_TARGET=17.0", "CODE_SIGNING_ALLOWED=NO"
    ], timeout=600)
runtimes = json.loads(run("runtimes", ["/usr/bin/xcrun", "simctl", "list", "runtimes", "--json"]))["runtimes"]
available = [x for x in runtimes if x.get("isAvailable") and x["identifier"].startswith("com.apple.CoreSimulator.SimRuntime.iOS-")
             and (17, 0, 0) <= version(x["version"]) <= version(sdk_version)]
assert available, "Use a preinstalled iOS runtime compatible with the selected SDK; no downloads are performed"
runtime = max(available, key=lambda x: version(x["version"]))
phones = [x for x in runtime["supportedDeviceTypes"] if x["name"].startswith("iPhone")]
small = next((x for name in ["iPhone SE (3rd generation)", "iPhone 17", "iPhone 16", "iPhone 15"]
              for x in phones if x["name"] == name), None)
large = next((x for name in ["iPhone 17 Pro Max", "iPhone 16 Pro Max", "iPhone 15 Pro Max"]
              for x in phones if x["name"] == name), None)
assert small and large and small["identifier"] != large["identifier"], "Two installed iPhone size profiles are required"
record["runtime"] = dict(identifier=runtime["identifier"], version=runtime["version"])
for size, model in [("small", small), ("large", large)]:
    wait_for_idle()
    device = run("create-" + size, ["/usr/bin/xcrun", "simctl", "create", task_id + "-" + size,
                                  model["identifier"], runtime["identifier"]]).decode().strip()
    assert re.fullmatch(r"[0-9A-Fa-f-]{36}", device)
    try:
        run("boot-" + size, ["/usr/bin/xcrun", "simctl", "boot", device])
        run("ready-" + size, ["/usr/bin/xcrun", "simctl", "bootstatus", device, "-b"], timeout=300)
        wait_for_idle()
        for profile in inputs["profiles"]:
            wait_for_idle()
            label = profile["role"] + "-" + size
            result = RESULTS / (label + ".xcresult")
            run("ui-" + label, [
                "/usr/bin/xcrun", "xcodebuild", "test-without-building", "-project", project,
                "-scheme", profile["scheme"], "-configuration", "Debug", "-jobs", "1",
                "-destination", "platform=iOS Simulator,id=" + device, "-destination-timeout", "60",
                "-parallel-testing-enabled", "NO", "-maximum-concurrent-test-simulator-destinations", "1",
                "-derivedDataPath", str(WORK / "derived"), "-resultBundlePath", str(result),
                "SWIFT_VERSION=6.0", "IPHONEOS_DEPLOYMENT_TARGET=17.0", "CODE_SIGNING_ALLOWED=NO"
            ], timeout=600)
            summary = json.loads(run("summary-" + label, [
                "/usr/bin/xcrun", "xcresulttool", "get", "test-results", "summary", "--path", str(result)
            ]))
            assert summary.get("totalTestCount") == summary.get("passedTests") == 1, summary
            assert summary.get("failedTests") == summary.get("skippedTests") == 0, summary
            record["simulatorTests"].append(dict(role=profile["role"], size=size, model=model["name"],
                                                passed=True, resultBundle=str(result), executedTests=1))
            args.proof.write_text(json.dumps(record, indent=2) + "\n")
    finally:
        try:
            run("shutdown-" + size, ["/usr/bin/xcrun", "simctl", "shutdown", device])
        except AssertionError:
            pass
        run("delete-" + size, ["/usr/bin/xcrun", "simctl", "delete", device])
        record["ownedSimulatorsDeleted"].append(device)
        args.proof.write_text(json.dumps(record, indent=2) + "\n")
record.update(at=now(), accepted=len(record["exports"]) == 8 and len(record["simulatorTests"]) == 4
              and len(record["ownedSimulatorsDeleted"]) == 2)
args.proof.write_text(json.dumps(record, indent=2) + "\n")
assert record["accepted"]
print(json.dumps(record, indent=2))
