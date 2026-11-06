import hashlib
import json
import math
import os
import runpy
from datetime import UTC, datetime
from pathlib import Path

P = Path(__file__).resolve().parent
root = P.parent / 'front-end/public/course-assets/physics/code-packs'
loaded = {}
for pack in ['orbit-model', 'numerical-model']:
    for role in ['starter', 'reference']:
        f = root / pack / role / 'main.py'
        compile(f.read_text(), str(f), 'exec')
        loaded[pack, role] = runpy.run_path(str(f))
o = loaded['orbit-model', 'reference']
mu = o['MU']
r = o['RADIUS']
ax, ay = o['acceleration'](r, 0)
assert math.isclose(ax, -mu / r ** 2, rel_tol=1e-14) and ay == 0
period = 2 * math.pi * math.sqrt(r ** 3 / mu)
orbits = []
for step in [10.0, 5.0, 2.5]:
    trace = o['orbit_trace'](step)
    assert abs(trace[-1][0] - period) < 1e-08
    result = o['summary'](trace)
    assert result['max_relative_radius_error'] < 0.01
    assert result['max_relative_energy_error'] < 0.001
    orbits.append(dict(step=step, **result))
assert orbits[2]['max_relative_radius_error'] < orbits[1]['max_relative_radius_error'] < orbits[0]['max_relative_radius_error']
for bad in [0.0, -1.0, math.nan, math.inf]:
    try:
        o['orbit_trace'](bad)
    except ValueError:
        pass
    else:
        raise AssertionError(('unrefused orbit step', bad))
n = loaded['numerical-model', 'reference']
fall = [n['freefall'](h) for h in [1.0, 0.5, 0.25, 0.125]]
assert [round(x['absolute_error_m'], 6) for x in fall] == [9.8, 4.9, 2.45, 1.225]
expected = {'explicit': [0.5, 0.6418124443692347, 0.8238464274944239, 1.0575097788301124, 1.3574458721906466], 'symplectic': [0.5, 0.5073882100497722, 0.4887596930631416, 0.5126116634332623, 0.4912402245314406]}
osc = {}
for method, energies in expected.items():
    samples = n['oscillator'](method)
    assert [x['time_s'] for x in samples] == [0.0, 5.0, 10.0, 15.0, 20.0]
    assert all((abs(x['energy_J'] - e) < 1e-09 for x, e in zip(samples, energies)))
    assert [x['time_s'] for x in n['oscillator'](method, 0.7)] == [0.0, 5.0, 10.0, 15.0, 20.0]
    assert [x['time_s'] for x in n['oscillator'](method, 0.7, 3.2)] == [0.0, 3.2]
    osc[method] = samples
for bad in [0.0, -1.0, math.nan, math.inf]:
    for func in [n['freefall'], lambda step: n['oscillator']('explicit', step)]:
        try:
            func(bad)
        except ValueError:
            pass
        else:
            raise AssertionError(('unrefused numerical step', bad))
for call in [lambda: loaded['orbit-model', 'starter']['advance']((0, r, 0, 0, 1), 1), lambda: loaded['numerical-model', 'starter']['freefall_step'](0, 0, 1), lambda: loaded['numerical-model', 'starter']['oscillator_step'](1, 0, 0.05, 'explicit')]:
    try:
        call()
    except NotImplementedError:
        pass
    else:
        raise AssertionError('Starter concealed an unfinished method.')
files = [{'file': str(f), 'bytes': f.stat().st_size, 'sha256': hashlib.sha256(f.read_bytes()).hexdigest()} for f in sorted(root.rglob('*')) if f.is_file()]
receipt = {'at': datetime.now(UTC).isoformat(), 'files': files, 'orbitConvergence': orbits, 'freefall': fall, 'oscillator': osc, 'syntaxPassed': True, 'invalidStepRejectionPassed': True, 'partialSampleTimeChecksPassed': True, 'starterIncompleteMethodsExplicit': True, 'allNativeChecksPassed': True, 'scope': 'Committed Python source and independent numeric contracts; browser import, execution and persistence have separate evidence.'}
output = Path(os.environ.get('PHYSICS2_BROWSER_PROOF_DIR', str(P.parent / 'output/physics-level-2-workflows')))
output.mkdir(parents=True, exist_ok=True)
(output / 'native-code-acceptance.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'files': len(files), 'allNativeChecksPassed': True, 'orbitRelativeRadiusErrors': [x['max_relative_radius_error'] for x in orbits]}))
