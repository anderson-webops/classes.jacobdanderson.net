export const pysynthShim = `
import base64
import io
import math
import wave
from _classes_artifacts import emit

_SAMPLE_RATE = 44100
_NOTE_OFFSETS = {
    "c": -9,
    "c#": -8,
    "db": -8,
    "d": -7,
    "d#": -6,
    "eb": -6,
    "e": -5,
    "f": -4,
    "f#": -3,
    "gb": -3,
    "g": -2,
    "g#": -1,
    "ab": -1,
    "a": 0,
    "a#": 1,
    "bb": 1,
    "b": 2,
}

def _note_frequency(note, transpose=0):
    note = str(note).strip().lower()
    if note in ("", "r", "rest", "pause"):
        return 0

    if len(note) >= 2 and note[1] in ("#", "b"):
        pitch = note[:2]
        octave_text = note[2:]
    else:
        pitch = note[:1]
        octave_text = note[1:]

    if pitch not in _NOTE_OFFSETS:
        raise ValueError("Unsupported note name: {}".format(note))

    octave = int(octave_text) if octave_text else 4
    semitone_distance = _NOTE_OFFSETS[pitch] + (octave - 4) * 12 + int(transpose)
    return 440.0 * (2 ** (semitone_distance / 12))

def _duration_seconds(duration, bpm):
    try:
        denominator = abs(float(duration))
    except Exception:
        denominator = 4
    if denominator <= 0:
        denominator = 4
    return (60.0 / float(bpm)) * (4.0 / denominator)

def _samples_for_note(note, duration, bpm, transpose=0, pause=0.02):
    seconds = _duration_seconds(duration, bpm)
    sample_count = max(1, int(_SAMPLE_RATE * seconds))
    frequency = _note_frequency(note, transpose)
    fade_count = min(int(_SAMPLE_RATE * 0.01), max(1, sample_count // 8))
    samples = bytearray()

    for index in range(sample_count):
        if frequency <= 0:
            value = 0
        else:
            envelope = 1.0
            if index < fade_count:
                envelope = index / fade_count
            elif index > sample_count - fade_count:
                envelope = max(0.0, (sample_count - index) / fade_count)
            value = int(32767 * 0.28 * envelope * math.sin(2 * math.pi * frequency * index / _SAMPLE_RATE))
        samples.extend(int(value).to_bytes(2, "little", signed=True))

    pause_count = max(0, int(_SAMPLE_RATE * float(pause)))
    samples.extend(b"\\x00\\x00" * pause_count)
    return bytes(samples)

def _render_wav(song, bpm=120, transpose=0, pause=0.02):
    data = bytearray()
    for item in song:
        if not item:
            continue
        note = item[0]
        duration = item[1] if len(item) > 1 else 4
        data.extend(_samples_for_note(note, duration, bpm, transpose, pause))

    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(_SAMPLE_RATE)
        wav_file.writeframes(bytes(data))

    return buffer.getvalue()

def make_wav(song, fn="pysynth_output.wav", bpm=120, transpose=0, pause=0.02, **_kwargs):
    wav_bytes = _render_wav(song, bpm=bpm, transpose=transpose, pause=pause)
    with open(fn, "wb") as output_file:
        output_file.write(wav_bytes)

    encoded = base64.b64encode(wav_bytes).decode("ascii")
    emit("PySynth: {}".format(fn), "audio/wav", encoded)
    print("Wrote {} with {} notes.".format(fn, len(song)))
    return fn
`;
