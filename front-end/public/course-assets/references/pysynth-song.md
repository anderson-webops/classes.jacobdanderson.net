# Browser PySynth Song Reference

This optional reference supports Build a Song and Song Generator. Confirm its
separate IDE import, then run `main.py` in Python mode. The browser supplies
`pysynth`; no package installation is needed for this example. Native PySynth
packages may expose a different API, so use their own documentation and a
virtual environment for native setup.

## Read and predict the data

The supplied sequence is `[("c4", 4), ("r", 8), ("g4", 8), ("c5", 2)]`.
Each pair contains a note name and positive duration denominator. `c4` and `c5`
are C in different octaves. `r` is a rest. The browser also accepts sharp and
flat spellings such as `c#4` and `db4`. Use validated names and positive numeric
durations; a generator should reject invalid choices rather than rely on
fallback values. These examples use the browser's supported positive durations.

At 120 beats per minute, a quarter note (`4`) lasts 0.5 seconds, an eighth (`8`)
lasts 0.25 seconds and a half (`2`) lasts 1 second. The denominator makes a
larger value shorter. `pause=0` adds no silence between entries, so this sequence
lasts two seconds: quarter C, eighth rest, eighth G, half high C. Changing bpm
changes time; changing octave changes pitch.

## Listen and keep the result

Run the example. The generated audio result is labeled
**PySynth: course_melody.wav**. Play it, then choose **Download WAV** beneath
the player to keep the WAV on the computer. The filename written inside the browser workspace is not an
ordinary operating-system folder path. Verify all three sounded notes, the rest
and the final high C. Change one duration or the final note, run again, and keep
the two downloads under distinct names for comparison.

The expected sequence and duration above apply to this supplied example.
They do not establish what happened in an older recording or another native
installation. For Song Generator, validate each input, append pairs in the
requested order, generate after entry is complete, and compare the final audio
with the whole saved list. Keep the learner attempt separate from this reference.
