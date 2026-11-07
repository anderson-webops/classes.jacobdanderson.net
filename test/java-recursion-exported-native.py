
"""Compile actual course-browser ZIPs and run their independent Java contracts."""
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
FIXTURE = json.loads((ROOT / "test/fixtures/java-recursion-sources.json").read_text())
SOURCE = Path(os.environ.get("JAVA_RECURSION_BROWSER_PROOF_DIR", ROOT / "output/java-recursion"))
JAVA_HOME = os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA = str(Path(JAVA_HOME) / "bin/java") if JAVA_HOME else shutil.which("java")
JAVAC = str(Path(JAVA_HOME) / "bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-recursion-native"),
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


results = []
with tempfile.TemporaryDirectory(prefix="java-recursion-exports-") as temporary:
    for pack in ["AJ4-Recursion-Practice-Packs", "AJ4-Divisible-by-7-Packs", "AJ4-Call-Trace"]:
        worked = pack == "AJ4-Call-Trace"
        roles = ["starter"] if worked else ["starter", "solution"]
        for role in roles:
            for width in [390, 1280]:
                for variant in ["exact", "edited"]:
                    archive = SOURCE / pack / f"{role}-{width}-{variant}.zip"
                    assert archive.is_file(), archive
                    output = Path(temporary) / f"{pack}-{role}-{width}-{variant}"
                    output.mkdir()
                    with zipfile.ZipFile(archive) as zipped:
                        names = zipped.namelist()
                        assert len(names) == 3 and len(set(names)) == 3
                        for filename in ["Main.java", "ContractTests.java", "README.md"]:
                            matches = [name for name in names if name.endswith("/" + filename)]
                            assert len(matches) == 1
                            content = zipped.read(matches[0])
                            key = pack + "/" + ("" if worked else role + "/") + filename
                            original = FIXTURE["files"][key]
                            if variant == "exact":
                                assert hashlib.sha256(content).hexdigest() == original["sha256"]
                            else:
                                suffix = ""
                                if filename == "Main.java":
                                    suffix = f"\n// Saved recursion trace {width}\n"
                                if filename == "README.md":
                                    suffix = f"\nSaved recursion trace {width}\n"
                                assert content.decode() == original["content"] + suffix
                            (output / filename).write_bytes(content)
                    run([JAVAC, "-Xlint:all", "-Werror", "--release", "21", "Main.java", "ContractTests.java"], cwd=output,check=True,timeout=25)
                    completed = run([JAVA, "ContractTests"],cwd=output,timeout=25)
                    if role == "starter" and not worked:
                        assert completed.returncode != 0 and "UnsupportedOperationException" in completed.stderr, completed
                        accepted = "unfinished-starter-rejected"
                    else:
                        assert completed.returncode == 0, completed.stderr
                        expected = "105 passed" if worked else "368 passed" if pack.startswith("AJ4-Recursion") else "220005 passed"
                        assert expected in completed.stdout, completed.stdout
                        accepted = completed.stdout.strip()
                        if worked:
                            driver = run([JAVA,"Main"],cwd=output,check=True,timeout=25)
                            assert driver.stdout == "10" + chr(10)
                        if pack == "AJ4-Divisible-by-7-Packs":
                            driver = run([JAVA,"Main"],input="203 bad -7 quit 204",cwd=output,check=True,timeout=25)
                            assert driver.stdout.splitlines() == ["203 is divisible by 7", "Invalid integer.", "-7 is divisible by 7"]
                    results.append({"pack":pack,"role":role,"width":width,"variant":variant,"archive":str(archive),"sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"result":accepted})
assert len(results) == 20
proof = {"accepted":True,"jdk":run([JAVA,"-version"],check=True).stderr,"actualBrowserArchives":results,"temporaryBuildsCleaned":True,"learnerRecursiveTraceInferred":False}
(SOURCE / "native-export-proof.json").write_text(json.dumps(proof,indent=2)+chr(10))
print(json.dumps(proof),flush=True)
