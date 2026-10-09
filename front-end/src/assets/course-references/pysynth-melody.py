"""Browser PySynth reference: two seconds, including a rest and the final note."""
from pysynth import make_wav

# Each pair is (note name, duration denominator).
# At 120 bpm: quarter = 0.5 s, eighth = 0.25 s, half = 1 s.
song = [("c4", 4), ("r", 8), ("g4", 8), ("c5", 2)]
make_wav(song, fn="course_melody.wav", bpm=120, pause=0)
