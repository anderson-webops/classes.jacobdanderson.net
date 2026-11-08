"""Check all exact and edited browser exports on native JDK 21."""
import hashlib
import json
import os
import datetime
import signal
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = json.loads((ROOT / "test/fixtures/java-patterns-sources.json").read_text())
SOURCE = Path(os.environ.get("JAVA_PATTERNS_BROWSER_PROOF_DIR", ROOT / "output/java-patterns"))
JAVA_HOME = os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA = str(Path(JAVA_HOME) / "bin/java") if JAVA_HOME else shutil.which("java")
JAVAC = str(Path(JAVA_HOME) / "bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-patterns-native"),
            "parentPid": os.getpid(), "cwd": str(cwd or Path.cwd()), "command": args,
            "pid": child.pid, "startTime": started, "timeoutSeconds": timeout}
    print(json.dumps({**base, "event": "start"}), flush=True)
    cleaned = False
    timed_out = False
    try:
        stdout, stderr = child.communicate(input, timeout=timeout)
    except BaseException as error:
        timed_out = isinstance(error, subprocess.TimeoutExpired)
        os.killpg(child.pid, signal.SIGKILL)
        stdout, stderr = child.communicate()
        cleaned = True
        raise
    finally:
        if child.returncode not in [None, 0] and not cleaned:
            try:
                os.killpg(child.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            cleaned = True
        print(json.dumps({**base, "event": "end", "endTime": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                          "exitCode": child.returncode, "timedOut": timed_out,
                          "childProcessGroupCleanup": cleaned}), flush=True)
    result = subprocess.CompletedProcess(args, child.returncode, stdout, stderr)
    if check and result.returncode:
        raise RuntimeError({"command": args, "exitCode": result.returncode,
                            "stdout": stdout, "stderr": stderr})
    return result


version = run([JAVAC, "-version"], check=True)
assert version.stdout.startswith("javac 21."), version
results = []
with tempfile.TemporaryDirectory(prefix="java-patterns-exports-") as temporary:
    for folder, pack, roles in [
        ("pricing", "DPJ1-Pricing-Contracts", ["starter", "solution"]),
        ("comparison-reference", "DPJ1-Design-Comparison-Packs", ["solution"]),
        ("comparison-extension", "DPJ1-Design-Comparison-Packs", ["starter"]),
    ]:
        pricing = folder == "pricing"
        filenames = ["Main.java", "PricingStrategy.java", "BulkPricingStrategy.java", "ContractTests.java", "README.md"] if pricing else ["Main.java", "ContractTests.java", "README.md"]
        for role in roles:
            for width in [390, 1280]:
                for variant in ["exact", "edited"]:
                    archive = SOURCE / folder / f"{role}-{width}-{variant}.zip"
                    assert archive.is_file(), archive
                    output = Path(temporary) / f"{folder}-{role}-{width}-{variant}"
                    output.mkdir()
                    with zipfile.ZipFile(archive) as zipped:
                        names = zipped.namelist()
                        assert len(names) == len(filenames) and len(set(names)) == len(filenames)
                        for filename in filenames:
                            matches = [name for name in names if name.endswith("/" + filename)]
                            assert len(matches) == 1, (filename, names)
                            content = zipped.read(matches[0])
                            original = FIXTURE["files"][pack + "/" + role + "/" + filename]
                            if variant == "exact":
                                assert hashlib.sha256(content).hexdigest() == original["sha256"]
                            else:
                                suffix = f"\n// Saved design decision {width}\n" if filename == "Main.java" else f"\nSaved design decision {width}\n" if filename == "README.md" else ""
                                assert content.decode() == original["content"] + suffix
                            (output / filename).write_bytes(content)
                    run([JAVAC, "--release", "21", "-Xlint:all", "-Werror", *[name for name in filenames if name.endswith(".java")]], cwd=output, check=True)
                    baseline = None
                    if not pricing:
                        baseline = run([JAVA, "ContractTests", "base"], cwd=output, check=True)
                        assert baseline.stdout == "Base design contracts: 20052 passed\n", baseline
                    completed = run([JAVA, "ContractTests"], cwd=output)
                    if role == "starter":
                        assert completed.returncode != 0 and "UnsupportedOperationException" in completed.stderr, completed
                        accepted = "unfinished-starter-rejected"
                    else:
                        expected = "Pricing contracts: 10014 passed\n" if pricing else "Complete design contracts: 28070 passed\n"
                        assert completed.returncode == 0 and completed.stdout == expected, completed
                        accepted = completed.stdout.strip()
                    if role == "solution" or not pricing:
                        demo = run([JAVA, "Main"], cwd=output, check=True)
                        assert demo.stdout == ("18.0\n" if pricing else "1800\n2420\n1620\n2240\n"), demo
                    results.append({"folder":folder,"pack":pack,"role":role,"width":width,"variant":variant,
                                    "archive":str(archive),"sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),
                                    "baseline":baseline.stdout.strip() if baseline else None,"result":accepted})
assert len(results) == 16
proof = {"accepted":True,"jdk":version.stdout.strip(),"actualBrowserArchives":results,
         "temporaryBuildsCleaned":True,"learnerDesignReasoningInferred":False}
(SOURCE / "native-export-proof.json").write_text(json.dumps(proof,indent=2)+chr(10))
print(json.dumps(proof),flush=True)
