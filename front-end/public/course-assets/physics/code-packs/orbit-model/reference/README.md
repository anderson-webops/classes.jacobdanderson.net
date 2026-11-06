# Orbit Model

Use the PHY13 orbit cases and PHY17 update-method reading. The file uses only math and json; no package installation is needed.

The advance function receives (time in seconds, x/y in metres, vx/vy in m/s). Compute acceleration from the old position. Update both velocity components over the step, then position with the new velocities. Return the same five-field state.

Run python main.py. The starter prints its unfinished status until that update is implemented. A completed run compares 10, 5 and 2.5 second steps over one analytic circular period. Compare radius, energy and final-position errors; step refinement tests numerical convergence rather than proving the physical model.

The starting orbit uses mu = 3.986e14 m^3/s^2 and radius 6.77e6 m. Its period is about 5544 seconds. Coordinates are relative to the central body. The model omits atmosphere, thrust and other bodies. The orbit_trace function returns the state table for a graph; no graphing dependency is required.

This directory contains the worked reference implementation.
