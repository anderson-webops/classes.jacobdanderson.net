"""Euler checks using only the Python standard library.

Free fall: upward positive, a=-9.80 m/s^2, x0=v0=0.
Oscillator: m=1 kg, k=1 N/m, x0=1 m, v0=0.
"""
import json
import math

MAX_STEPS = 20000


def validate_step(step, duration):
    if not all(math.isfinite(value) and value > 0 for value in (step, duration)):
        raise ValueError("Step and duration must be finite and positive.")
    if math.ceil(duration / step) > MAX_STEPS:
        raise ValueError("This run exceeds 20000 steps; choose a coarser step.")


def freefall_step(x, v, step, acceleration=-9.8):
    """Explicit Euler: both updates use values from the old state."""
    return x + v * step, v + acceleration * step


def oscillator_step(x, v, step, method):
    """Use the specified update order for the supplied a=-x model."""
    if method == "explicit":
        return x + v * step, v - x * step
    if method == "symplectic":
        next_v = v - x * step
        return x + next_v * step, next_v
    raise ValueError("Choose explicit or symplectic.")


def freefall(step, duration=2.0):
    validate_step(step, duration)
    x = v = t = 0.0
    for _ in range(math.ceil(duration / step)):
        dt = min(step, duration - t)
        x, v = freefall_step(x, v, dt)
        t += dt
    analytic = -0.5 * 9.8 * duration**2
    return {"step_s": step, "position_m": x, "analytic_m": analytic,
            "absolute_error_m": abs(x - analytic)}


def oscillator(method, step=0.05, duration=20.0):
    validate_step(step, duration)
    if method not in ("explicit", "symplectic"):
        raise ValueError("Choose explicit or symplectic.")
    targets = sorted(set([0.0, duration] + [
        5.0 * index for index in range(1, math.floor(duration / 5.0) + 1)
    ]))
    if math.ceil(duration / step) + len(targets) > MAX_STEPS:
        raise ValueError("The sampled run exceeds 20000 steps.")
    x, v, t = 1.0, 0.0, 0.0
    samples = [{"time_s": 0.0, "energy_J": 0.5}]
    for target in targets[1:]:
        while t < target - 1e-12:
            dt = min(step, target - t)
            x, v = oscillator_step(x, v, dt, method)
            t += dt
        samples.append({"time_s": target, "energy_J": 0.5 * (x*x + v*v)})
    return samples


def main():
    try:
        for step in (1.0, 0.5, 0.25, 0.125):
            print(json.dumps(freefall(step), sort_keys=True))
        for method in ("explicit", "symplectic"):
            print(json.dumps({"method": method, "samples": oscillator(method)}, sort_keys=True))
        print("physics_numerical_case_complete")
    except NotImplementedError as error:
        print("Numerical starter: " + str(error))
        print("No completed-model result is claimed. Complete both update functions.")


if __name__ == "__main__":
    main()
