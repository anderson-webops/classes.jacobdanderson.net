"""Verify actual browser ZIP package trees and Java creational contracts."""
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
ROOT=Path(__file__).resolve().parents[1]
FIXTURE=json.loads((ROOT/"test/fixtures/java-creational-sources.json").read_text())
SOURCE=Path(os.environ.get("JAVA_CREATIONAL_BROWSER_PROOF_DIR",ROOT/"output/java-creational"))
JAVA_HOME=os.environ.get("JAVA_HOME_21_X64") or os.environ.get("JAVA_HOME")
JAVA=str(Path(JAVA_HOME)/"bin/java") if JAVA_HOME else shutil.which("java")
JAVAC=str(Path(JAVA_HOME)/"bin/javac") if JAVA_HOME else shutil.which("javac")
assert JAVA and JAVAC
def run(args, cwd=None, input=None, check=False, timeout=25):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(args, cwd=cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, text=True, start_new_session=True)
    base = {"parentTask": os.environ.get("CLASSES_FAMILY_TASK_ID", "java-creational-native"),
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


version=run([JAVAC,"-version"],check=True)
assert version.stdout.startswith("javac 21."),version
results=[]
with tempfile.TemporaryDirectory(prefix="java-creational-exports-") as temporary:
    for role in ["starter","solution"]:
        prefix="DPJ3-Report-Creation-Packs/"+role+"/"
        filenames=[path[len(prefix):] for path in FIXTURE["files"] if path.startswith(prefix)]
        assert len(filenames)==14
        for width in [390,1280]:
            for variant in ["exact","edited"]:
                archive=SOURCE/"report-creation"/f"{role}-{width}-{variant}.zip"
                assert archive.is_file(),archive
                output=Path(temporary)/f"{role}-{width}-{variant}"
                output.mkdir()
                with zipfile.ZipFile(archive) as zipped:
                    names=zipped.namelist()
                    assert len(names)==len(set(names))==14
                    for filename in filenames:
                        matches=[name for name in names if name.endswith("/"+filename)]
                        assert len(matches)==1,(filename,names)
                        data=zipped.read(matches[0]);original=FIXTURE["files"][prefix+filename]
                        if variant=="exact":assert hashlib.sha256(data).hexdigest()==original["sha256"]
                        else:
                            suffix=f"\n// Saved creational trace {width}\n" if filename in ["src/creation/Families.java","src/creation/Exporters.java","src/creation/ReportJob.java"] else f"\nSaved creational trace {width}\n" if filename=="README.md" else ""
                            assert data.decode()==original["content"]+suffix
                        path=output/filename;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
                run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                core=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output)
                if role=="starter":
                    assert core.returncode!=0 and "UnsupportedOperationException: Implement the boxed heading product." in core.stderr,core
                    outcome="unfinished-starter-rejected"
                else:
                    assert core.returncode==0 and core.stdout=="Core creation contracts: 2101 passed\n",core
                    full=run([JAVA,"-cp","classes","ContractTests"],cwd=output,check=True)
                    assert full.stdout=="Complete creation contracts: 2105 passed\n",full
                    demo=run([JAVA,"-cp","classes","Main"],cwd=output,check=True)
                    assert demo.stdout=="[Notes]\n| one |\n| two |\nLines: 2\nEnd\n",demo
                    outcome=full.stdout.strip()
                    # Derivative check: a completed core remains usable before the optional extension.
                    path=output/"src/creation/ReportJob.java"
                    text=path.read_text()
                    old="return new Builder(report).style(style).includeCount(includeCount).footer(footer);"
                    assert text.count(old)==1
                    path.write_text(text.replace(old,'throw new UnsupportedOperationException("Implement the optional independent toBuilder copy.");'))
                    run([JAVAC,"--release","21","-Xlint:all","-Werror","-d","classes","@sources.txt"],cwd=output,check=True)
                    completed_core=run([JAVA,"-cp","classes","ContractTests","core"],cwd=output,check=True)
                    assert completed_core.stdout=="Core creation contracts: 2101 passed\n",completed_core
                    extension=run([JAVA,"-cp","classes","ContractTests"],cwd=output)
                    assert extension.returncode!=0 and "UnsupportedOperationException: Implement the optional independent toBuilder copy." in extension.stderr,extension
                results.append({"role":role,"width":width,"variant":variant,"archive":str(archive),"sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"files":14,"result":outcome,"optionalIndependentOfCore":role=="solution"})

    for width in [390,1280]:
        for variant in ["exact","edited"]:
            archive=SOURCE/"worked-example"/f"starter-{width}-{variant}.zip"
            assert archive.is_file(),archive
            output=Path(temporary)/f"worked-{width}-{variant}";output.mkdir()
            with zipfile.ZipFile(archive) as zipped:
                names=zipped.namelist();assert len(names)==len(set(names))==3
                for filename in ["Main.java","ContractTests.java","README.md"]:
                    matches=[name for name in names if name.endswith("/"+filename)];assert len(matches)==1
                    data=zipped.read(matches[0]);original=FIXTURE["files"]["DPJ3-Creation-Worked-Example/"+filename]
                    if variant=="exact":assert hashlib.sha256(data).hexdigest()==original["sha256"]
                    else:
                        suffix=f"\n// Saved creational trace {width}\n" if filename=="Main.java" else f"\nSaved creational trace {width}\n" if filename=="README.md" else ""
                        assert data.decode()==original["content"]+suffix
                    (output/filename).write_bytes(data)
            run([JAVAC,"--release","21","-Xlint:all","-Werror","Main.java","ContractTests.java"],cwd=output,check=True)
            contracts=run([JAVA,"ContractTests"],cwd=output,check=True)
            assert contracts.stdout=="Creation worked contracts: 31 passed\n",contracts
            demo=run([JAVA,"Main"],cwd=output,check=True);assert demo.stdout=="Ready\nReady\nReady\n[Ready]\n**Title**\n> Body\n[Title]\nBody\n",demo
            results.append({"role":"starter","width":width,"variant":variant,"archive":str(archive),"sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"files":3,"result":contracts.stdout.strip(),"workedExample":True})
assert len(results)==12
proof={"accepted":True,"jdk":version.stdout.strip(),"actualBrowserArchives":results,
       "temporaryBuildsCleaned":True,"learnerRefactoringReasoningInferred":False}
(SOURCE/"native-export-proof.json").write_text(json.dumps(proof,indent=2)+"\n")
print(json.dumps(proof),flush=True)
