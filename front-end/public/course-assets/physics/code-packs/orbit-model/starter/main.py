"""Circular-orbit model with a stated symplectic-Euler update.

State tuple: (time_s, x_m, y_m, vx_m_s, vy_m_s).
Point-mass central body, negligible satellite mass, no atmosphere or thrust.
"""
import json
import math

MU = 3.986e14
RADIUS = 6.77e6
MAX_STEPS = 20000


def acceleration(x, y, mu=MU):
    radius = math.hypot(x, y)
    if radius <= 0 or not math.isfinite(radius):
        raise ValueError("Position needs a finite positive distance from the centre.")
    if mu <= 0 or not math.isfinite(mu):
        raise ValueError("The gravitational parameter must be finite and positive.")
    scale = -mu / radius**3
    return scale * x, scale * y


def advance(state, step_s, mu=MU):
    """Update velocity from old position, then position from new velocity."""
    raise NotImplementedError(
        "Use acceleration(x, y, mu), update vx/vy over step_s, "
        "then update x/y with the new velocities and return the five state values."
    )


def orbit_trace(step_s, radius=RADIUS, mu=MU):
    """Advance exactly one analytic circular period, with a shorter last step."""
    if not all(math.isfinite(v) and v > 0 for v in (step_s, radius, mu)):
        raise ValueError("Step, starting radius and gravitational parameter must be positive.")
    period = 2 * math.pi * math.sqrt(radius**3 / mu)
    if math.ceil(period / step_s) > MAX_STEPS:
        raise ValueError("This trace exceeds 20000 steps; choose a coarser step.")
    state = (0.0, radius, 0.0, 0.0, math.sqrt(mu / radius))
    states = [state]
    for _ in range(math.ceil(period / step_s)):
        dt = min(step_s, period - state[0])
        state = advance(state, dt, mu)
        states.append(state)
    return states


def summary(states, radius=RADIUS, mu=MU):
    baseline_energy = -mu / (2 * radius)
    radius_errors = []
    energy_errors = []
    for _, x, y, vx, vy in states:
        r = math.hypot(x, y)
        energy = (vx * vx + vy * vy) / 2 - mu / r
        radius_errors.append(abs(r - radius) / radius)
        energy_errors.append(abs(energy - baseline_energy) / abs(baseline_energy))
    _, x, y, _, _ = states[-1]
    return {
        "period_s": states[-1][0],
        "states": len(states),
        "max_relative_radius_error": max(radius_errors),
        "max_relative_energy_error": max(energy_errors),
        "relative_closure_error": math.hypot(x - radius, y) / radius,
    }


def main():
    try:
        for step in (10.0, 5.0, 2.5):
            print(json.dumps({"step_s": step, **summary(orbit_trace(step))}, sort_keys=True))
        print("physics_orbit_case_complete")
    except NotImplementedError as error:
        print("Orbit starter: " + str(error))
        print("The model has not run yet. Complete advance(), then run again.")


if __name__ == "__main__":
    main()
