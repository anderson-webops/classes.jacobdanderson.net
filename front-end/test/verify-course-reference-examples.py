"""Check the supplied examples against independent observable expectations."""
import base64
import io
import math
from pathlib import Path
import random
import re
import subprocess
import sys
import tempfile
import types
import wave

root = Path(__file__).resolve().parents[1]
examples = root / "src/assets/course-references"

# Exhaustive pairs across varied shapes and seeds; no rendering or asset mock.
layout = {}
exec((examples / "tile_layout.py").read_text(), layout)
positions = layout["layout_positions"]
for width, height, tw, th, gap in [(600, 400, 40, 40, 12), (91, 73, 17, 11, 3),
                                  (40, 40, 40, 40, 0), (8, 6, 3, 2, 0)]:
    capacity = max(0, (width - gap) // (tw + gap)) * max(0, (height - gap) // (th + gap))
    for seed in range(30):
        for count in {0, 1, capacity // 2, capacity}:
            points = positions(count, width, height, tw, th, gap, random.Random(seed))
            assert len(points) == count and len(set(points)) == count
            for x, y in points:
                assert gap <= x - tw / 2 and x + tw / 2 <= width - gap
                assert gap <= y - th / 2 and y + th / 2 <= height - gap
            for i, (x1, y1) in enumerate(points):
                for x2, y2 in points[i + 1:]:
                    assert abs(x1 - x2) >= tw + gap or abs(y1 - y2) >= th + gap
    try:
        positions(capacity + 1, width, height, tw, th, gap)
        raise AssertionError("Overcrowded layout accepted")
    except ValueError:
        pass
for args in [(-1, 600, 400, 40, 40), (1, 600, 0, 40, 40), (True, 600, 400, 40, 40),
             (1, 20, 20, 40, 40), (1, 600, 400, 40, 40, -1)]:
    try:
        positions(*args)
        raise AssertionError("Invalid layout accepted")
    except ValueError:
        pass

# Extract the shipped compatibility module's template literal. Its sole JS
# escapes are doubled backslashes; this runs that source, not a second synth.
runtime = (root / "src/modules/pythonPysynthShim.ts").read_text()
shim = re.search(r"const pysynthShim = `([\s\S]*?)`;", runtime).group(1)
assert "${" not in shim
shim = shim.replace("\\\\", "\\")
emitted = []
artifacts = types.ModuleType("_classes_artifacts")
artifacts.emit = lambda *args: emitted.append(args)
sys.modules["_classes_artifacts"] = artifacts
synth = types.ModuleType("pysynth")
exec(shim, synth.__dict__)
sys.modules["pysynth"] = synth
with tempfile.TemporaryDirectory() as folder:
    import os
    previous = Path.cwd()
    os.chdir(folder)
    try:
        exec((examples / "pysynth-melody.py").read_text(), {})
        audio = Path("course_melody.wav").read_bytes()
    finally:
        os.chdir(previous)
assert emitted[-1][:2] == ("PySynth: course_melody.wav", "audio/wav")
assert base64.b64decode(emitted[-1][2]) == audio
with wave.open(io.BytesIO(audio), "rb") as result:
    assert (result.getnchannels(), result.getsampwidth(), result.getframerate()) == (1, 2, 44100)
    assert result.getnframes() == 88200
    raw = result.readframes(result.getnframes())
samples = [int.from_bytes(raw[i:i + 2], "little", signed=True) for i in range(0, len(raw), 2)]
assert all(value == 0 for value in samples[22050:33075])  # Exact eighth-note rest.
for start, end, frequency in [(1000, 21000, 261.625565), (34000, 43000, 391.995436),
                              (46000, 87000, 523.251131)]:
    segment = samples[start:end]
    assert max(segment) > 8000 and min(segment) < -8000
    rises = sum(a <= 0 < b for a, b in zip(segment, segment[1:]))
    observed = rises * 44100 / len(segment)
    assert math.isclose(observed, frequency, abs_tol=4), (observed, frequency)

# Exercise event guards and cancellation with a deterministic callback queue.
# Browser rendering and delivery remain separate Cypress acceptance gates.
pgzrun = types.ModuleType("pgzrun")
pgzrun.go = lambda: None
sys.modules["pgzrun"] = pgzrun
pygame = types.ModuleType("pygame")
class Rectangle:
    def __init__(self, x, y, width, height):
        self.bounds = (x, y, width, height)

    def collidepoint(self, point):
        x, y, w, h = self.bounds
        return x <= point[0] < x + w and y <= point[1] < y + h
pygame.Rect = Rectangle
sys.modules["pygame"] = pygame
pending = {}
class Clock:
    def schedule_unique(self, callback, delay):
        assert callable(callback) and delay == 1.0
        pending[callback] = delay

    def unschedule(self, callback):
        pending.pop(callback, None)
screen = types.SimpleNamespace(fill=lambda *_: None,
    draw=types.SimpleNamespace(filled_rect=lambda *_: None, text=lambda *_, **kwargs: None))
game = {"clock": Clock(), "mouse": types.SimpleNamespace(LEFT=1), "screen": screen,
        "keys": types.SimpleNamespace(R="r", RETURN="enter")}
exec((examples / "pgzero-events.py").read_text(), game)
click = game["on_mouse_down"]
click((300, 200), 1)
assert game["hits"] == 0 and not pending
game["on_key_down"]("enter")
click((300, 200), 3)
assert game["hits"] == 0 and not pending
click((0, 0), 1)
assert game["hits"] == 0 and game["feedback"] == "Miss"
click((300, 200), 1)
assert game["hits"] == 1 and len(pending) == 1
for _ in range(100):
    game["draw"]()
    game["update"]()
assert game["hits"] == 1
callback = next(iter(pending))
pending.clear()
callback()
assert game["feedback"] == "" and game["hits"] == 1
click((300, 200), 1)
game["on_key_down"]("r")
assert game["hits"] == 0 and game["game_state"] == "ready" and not pending

# A real native compiler validates the record example and expected stdout.
with tempfile.TemporaryDirectory() as folder:
    source = Path(folder) / "Main.java"
    source.write_bytes((examples / "Main.java").read_bytes())
    subprocess.run(["javac", "-Xlint:all", "-Werror", "Main.java"], cwd=folder,
                   check=True, capture_output=True, text=True, timeout=30)
    result = subprocess.run(["java", "Main"], cwd=folder, check=True,
                            capture_output=True, text=True, timeout=30)
    assert result.stderr == ""
    assert result.stdout == ("Oak: 8\nPine: 5\nCopied tags: [ready]\n"
                             "Shared tags: [ready, changed]\nNegative score rejected\n")
print("PASS: finite layouts, WAV duration/rest/all pitches, event state/reset, native Java records")
