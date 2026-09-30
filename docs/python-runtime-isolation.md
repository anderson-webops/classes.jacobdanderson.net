# Python runtime isolation

All Python modes, including shared projects that a learner imports and explicitly
runs, execute inside a fresh scripts-only, opaque-origin frame. The account-aware
editor remains outside the frame. The runtime entrypoint does not bootstrap a
session, exposes no authenticated API client, and does not load or save projects.
Plain Python uses a terminable Blob worker created inside that frame. Turtle,
Pygame and data displays keep their synchronous graphics bridges inside the same
isolated frame as the interpreter.

The parent accepts only bounded output, text-file results, activity, enumerated
runtime stages and numeric runtime versions
from the exact frame, channel, account, project and run. It retains responsibility
for saving files and rejects results that would overwrite intervening edits.
Stop, replacement, account changes and leaving the editor discard the frame and
its callbacks. An iframe is an origin boundary, not a guarantee of CPU or memory
fairness for arbitrary programs.

## Input and Turtle prompts

Fill the existing Input box before running. Python `input()`, Turtle `textinput()`
and `numinput()` consume one line per prompt. Empty lines remain meaningful;
an empty numeric answer uses the provided default. A line containing `:cancel`
cancels a Turtle prompt and returns `None`. Use `\:cancel` for the literal text
`:cancel`. Numeric bounds remain enforced. Exhausted input reports the existing
input-panel EOF error. Browser popup prompts are no longer used.

## Production assets

The Vite build creates `python-runtime/runtime.js` and `runtime.css` as part of
the frontend artifact. They and the public `/ide/assets/` and
`/python-ide/assets/` trees require anonymous CORS and cross-origin resource
headers. No API route receives this allowance. The IDE worker policy permits
Blob workers; the frame applies its additional restrictive asset-only policy.
Do not add `allow-same-origin`, credentialed CORS, parent RPC for network access,
or ordinary application bootstrapping to the runtime to resolve compatibility.

Use the production IDE smoke gate to validate the runtime bundles and headers.
Unit tests cover the message contract, limits, lifecycle and persistence-free
surface. Browser acceptance must use built output with production-equivalent
headers and synthetic projects in all four modes. It must cover input,
drawing, interactive callbacks, data displays, file capture, rerun and stop.
No production data, provider calls or user account are needed.
