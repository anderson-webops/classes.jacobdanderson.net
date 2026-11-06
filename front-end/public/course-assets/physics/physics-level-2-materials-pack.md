# Physics Level 2 Materials Pack

These fictional instructional datasets and structured cases support every quantitative core, advanced extension, and independent-synthesis route. No task requires projectiles, collision apparatus, elevated masses, pulley builds, home circuits, heat sources, pressure equipment, magnets, engines, physical sensors, personal devices, or learner data.

## Common Quantitative Model Record

Use these fields throughout the course:

1. phenomenon, question, and source;
2. system, boundary, and time interval;
3. origin, axes, sign convention, and reference frame;
4. known quantities with symbols, values, units, and uncertainty;
5. assumptions, initial conditions, constraints, and operating domain;
6. diagram, raw table, graph, or computational trace;
7. relationship or update rule with substitution;
8. dimensional, limiting-case, analytic, residual, or conservation check;
9. bounded claim, alternative, and model limitation;
10. changed-condition prediction and substantive revision.

Visual work includes text descriptions, signal and sound work includes time-series or event-table routes, and color is paired with labels, symbols, or patterns.

## Quantitative Kinematics and Vectors Cases

### Ideal projectile comparison

Use launch speed 20.0 m/s, launch and landing at the same height, and `g=9.80 m/s²`.

| Angle | `v_0x` (m/s) | `v_0y` (m/s) |     Time (s) |    Range (m) | Maximum height (m) |
| ----: | -----------: | -----------: | -----------: | -----------: | -----------------: |
|   30° | to calculate | to calculate | to calculate | to calculate |       to calculate |
|   45° | to calculate | to calculate | to calculate | to calculate |       to calculate |
|   60° | to calculate | to calculate | to calculate | to calculate |       to calculate |

Tasks:

- derive component equations before using range shortcuts;
- compare complementary-angle ranges;
- identify which launch has greatest time and height;
- state exactly where the no-drag and equal-height assumptions enter;
- predict how a horizontal drag force would alter the component story.

### Supplied no-drag and drag traces

Both traces use 20.0 m/s at 45°. Positions are rounded.

| Time (s) | No-drag `x` (m) | No-drag `y` (m) | Drag-model `x` (m) | Drag-model `y` (m) |
| -------: | --------------: | --------------: | -----------------: | -----------------: |
|      0.0 |             0.0 |             0.0 |                0.0 |                0.0 |
|      0.5 |             7.1 |             5.8 |                6.7 |                5.5 |
|      1.0 |            14.1 |             9.2 |               12.7 |                8.4 |
|      1.5 |            21.2 |            10.2 |               18.1 |                8.7 |
|      2.0 |            28.3 |             8.7 |               23.0 |                6.5 |
|      2.5 |            35.4 |             4.7 |               27.4 |                2.0 |

Calculate horizontal residuals relative to the no-drag model and identify when the discrepancy becomes decision-relevant under a ±1.0 m position tolerance.

### Rescue-drone vector case

A drone can move at 12.0 m/s relative to the air. A steady wind is 5.0 m/s east. The desired ground path is 600 m due north.

- determine the needed westward air-velocity component;
- calculate the available northward component;
- calculate travel time;
- compare with a naive due-north heading;
- repeat for a 7.0 m/s east wind and state the feasibility limit.

### River-crossing case

The river flows east at 1.50 m/s. A modeled swimmer moves at 3.00 m/s relative to the water. The banks are 120 m apart in the north–south direction, and the target is directly opposite the starting point.

Find the westward swimming component and available northward component needed for the target. Calculate crossing time. Compare with a due-north heading, including crossing time and eastward drift. Treat the velocities as constant and use this supplied case without a physical water investigation.

## Multi Force and Equilibrium Cases

### Elevator scale data

A 70.0 kg rider uses `g=9.80 m/s²`.

| Interval | Scale force (N) | Velocity description     |
| -------- | --------------: | ------------------------ |
| A        |             686 | upward, constant speed   |
| B        |             840 | upward, speeding up      |
| C        |             560 | upward, slowing down     |
| D        |             686 | downward, constant speed |

Calculate net force and acceleration. Preserve an upward-positive convention and explain why scale force is not mass.

### Two-cable sign

A 500 N sign hangs at rest from two identical cables. Each cable is 30° above horizontal.

- draw one free-body diagram for the sign;
- calculate cable tension;
- compare with cables at 60° above horizontal;
- explain why nearly horizontal cables create large tension;
- state the symmetry assumption.

### Three-force platform

A 120 kg platform accelerates upward at 0.80 m/s². Two vertical support cables share the load in a 3:2 tension ratio.

Find both tensions. Then compare the whole platform system with a subsystem containing only one attachment point and explain why the same equation cannot be copied unchanged.

### Tug-of-war system case

Both modeled teams and the taut 2.00 kg rope accelerate east at the same rate. The rope is horizontal; weight and normal forces balance vertically. The listed ground forces are within the available traction.

| Object    | Mass (kg) | Eastward horizontal force (N) | Westward horizontal force (N) |
| --------- | --------: | ----------------------------: | ----------------------------: |
| West team |      60.0 |                     rope: 180 |                   ground: 150 |
| East team |      70.0 |                   ground: 216 |                     rope: 181 |
| Rope      |      2.00 |                east team: 181 |                west team: 180 |

Draw each free-body diagram and calculate each acceleration. Then draw the combined teams-plus-rope system, cancel its internal interaction pairs, and calculate its acceleration from ground forces alone. Explain why the rope's two end tensions differ and why the ground forces on different teams are not a Newton's-third-law pair. The ground experiences the opposite member of each team–ground interaction.

## Friction Inclines and Connected Systems Cases

### Static threshold

A block has `μ_s=0.30` and `μ_k=0.20`.

| Ramp angle | `(mg sin θ)/(mg)` |  `μ_s cos θ` | Predicted state from rest |
| ---------: | ----------------: | -----------: | ------------------------- |
|        10° |      to calculate | to calculate | classify                  |
|        15° |      to calculate | to calculate | classify                  |
|        20° |      to calculate | to calculate | classify                  |
|        25° |      to calculate | to calculate | classify                  |

Compare the downslope requirement with maximum static friction. Do not substitute kinetic friction until sliding occurs.

### Sliding acceleration

For the same block after sliding begins, use `a=g(sin θ-μ_k cos θ)`.

| Angle | Acceleration (m/s²) |
| ----: | ------------------: |
|   15° |                0.64 |
|   20° |                1.51 |
|   25° |                2.37 |
|   30° |                3.20 |
|   35° |                4.02 |

Graph acceleration against angle and explain why the graph is not exactly linear.

### Ideal connected masses

Mass A = 3.00 kg hangs on one side of a massless rope and frictionless pulley. Mass B = 2.00 kg hangs on the other.

- draw separate diagrams;
- choose a positive direction for each object;
- write the rope constraint;
- calculate acceleration and tension;
- check the result using the whole two-mass system.

### Modified evidence

The same masses are tested with a pulley that has rotational inertia. Supplied acceleration is 1.55 m/s² rather than the ideal prediction. Use the discrepancy to explain which ideal equality or energy account needs refinement.

### Ramp design criteria

For a hold-at-rest design, select the steepest available ramp from 8°, 12° and 18° that permits rest across the entire supplied static-coefficient range 0.25–0.35. Compare the required friction with the smallest available maximum, and state the limiting angle.

For a sliding design, select from 15°, 20° and 25° with μk = 0.20. The target downslope acceleration is 1.40–1.60 m/s² with g = 9.80 m/s². Use the supplied sliding model and state whether each option meets the target.

## Quantitative Momentum and Collisions Cases

### Two-dimensional collision

Positive `x` is east and positive `y` is north.

| Object | Mass (kg) | Initial velocity (m/s) | Final velocity (m/s) |
| ------ | --------: | ---------------------- | -------------------- |
| A      |      1.00 | `(4.0,0.0)`            | `(0.0,2.0)`          |
| B      |      2.00 | `(0.0,1.0)`            | `(2.0,0.0)`          |

Build separate `x`- and `y`-momentum ledgers, compare total kinetic energy, and identify one physical energy-transfer route.

### Elastic collision and recoil cases

For a one-dimensional elastic collision, a 1.00 kg cart moving at +3.00 m/s strikes a stationary 2.00 kg cart. Final velocities are −1.00 m/s and +2.00 m/s. Verify momentum and kinetic-energy balances, then compare with the supplied two-dimensional inelastic collision.

For an isolated recoil model, a 0.200 kg object and 2.00 kg launcher begin at rest. The object ends at +10.0 m/s. Find launcher velocity, check total momentum and identify why total kinetic energy increases. These are fictional records, with no physical launch required.

### Force-time safety records

Both designs bring the same modeled object to rest.

| Time (s) | Design A force (N) | Design B force (N) |
| -------: | -----------------: | -----------------: |
|     0.00 |                  0 |                250 |
|     0.01 |                500 |                250 |
|     0.02 |               1000 |                250 |
|     0.03 |                500 |                250 |
|     0.04 |                  0 |                250 |
|     0.05 |                  — |                250 |
|     0.06 |                  — |                250 |
|     0.07 |                  — |                250 |
|     0.08 |                  — |                250 |

Estimate impulse with trapezoids, compare peak and average force, and state whether the samples alone capture the true instantaneous peak.

For a design comparison, require a sampled peak no greater than 600 N and a stopping interval no greater than 0.10 s. Select any design meeting both criteria. Repeat with a stricter interval limit of 0.05 s. Keep these conclusions limited to the supplied records; they do not certify real protective equipment.

### Momentum uncertainty record

| Quantity                |     Value | Standard uncertainty |
| ----------------------- | --------: | -------------------: |
| Cart 1 mass             |  0.500 kg |             0.002 kg |
| Cart 1 initial velocity |  1.80 m/s |             0.04 m/s |
| Cart 2 mass             |  0.750 kg |             0.002 kg |
| Cart 2 initial velocity | -0.40 m/s |             0.03 m/s |
| Combined final velocity |  0.47 m/s |             0.03 m/s |

Calculate central momentum values, compare the apparent mismatch with measurement uncertainty qualitatively, and avoid declaring conservation failure from rounded values alone.

## Rotational Motion and Torque Cases

### Disk and ring response

A solid disk and thin ring each have mass 2.00 kg and radius 0.500 m. Each receives a net torque of 3.00 N·m.

| Object | Inertia model |  `I` (kg·m²) | Angular acceleration (rad/s²) |
| ------ | ------------- | -----------: | ----------------------------: |
| disk   | `(1/2)MR²`    | to calculate |                  to calculate |
| ring   | `MR²`         | to calculate |                  to calculate |

Explain why equal mass, radius, and torque do not give equal angular acceleration.

### Rotational equilibrium

A 4.00 m beam of mass 20.0 kg is supported at its center. A 300 N load hangs 1.50 m left of center. An unknown downward load hangs 1.00 m right of center.

- calculate the unknown load for rotational equilibrium;
- determine the vertical support force;
- state why beam weight creates no torque about the center but still enters force balance.

### Rolling comparison

The disk and ring roll without slipping from the same vertical drop of 1.20 m.

Use energy conservation and the inertia models to compare bottom speeds. Then name rolling resistance, deformation, and slip as effects absent from the ideal result.

### Lever design criteria

An ideal lever supports a 300 N load 0.200 m from its pivot. Choose an effort arm of 0.500 or 0.800 m, with perpendicular forces on opposite sides. Required effort is at most 100 N and total load-arm plus effort-arm length is at most 1.00 m. Neglect lever weight for the static calculation; explain how adding its weight or a dynamic load would change the model.

Compare both options with torque and vertical-force balance. A suitable response distinguishes this ideal mechanical comparison from a strength rating.

## Gravitation Circular Motion and Orbits Cases

Use Earth gravitational parameter `μ=3.986×10¹⁴ m³/s²`.

### Circular-orbit table

| Orbit                    | Radius from Earth's center (m) |  Speed (m/s) |   Period (s) |
| ------------------------ | -----------------------------: | -----------: | -----------: |
| low A                    |                     `6.77×10⁶` | to calculate | to calculate |
| low B                    |                     `7.37×10⁶` | to calculate | to calculate |
| geosynchronous reference |                   `4.2164×10⁷` | to calculate | to calculate |

Use `v=√(μ/r)` and `T=2π r/v`. Compare period and speed trends with radius.

### Inverse-square comparison

| Separation `r` | Relative gravitational force |
| -------------- | ---------------------------: |
| `R`            |                            1 |
| `2R`           |                 to calculate |
| `3R`           |                 to calculate |
| `4R`           |                 to calculate |

State which quantities are held fixed and why `r` is center-to-center separation.

### Orbit energy cards

For a 500 kg satellite, compare specific or total orbital energy at low A and low B. A complete explanation distinguishes changing gravitational potential, kinetic energy, and the external work needed to transfer between circular orbits.

### Vertical-loop contact case

A modeled 0.500 kg cart moves inside a vertical circular track of radius 0.800 m. Its speed at the top is 3.00 m/s. Use g = 9.80 m/s², maintained contact and negligible energy loss.

Calculate the top contact force. Then use the 1.600 m height change to predict bottom speed and bottom contact force. Find the minimum top speed for a nonnegative top contact force. No physical track or launch is required.

## Electricity Circuits and Fields Cases

### Source with internal resistance

An ideal emf of 12.0 V has internal resistance 1.00 Ω.

| Load resistance (Ω) |  Current (A) | Terminal voltage (V) | Load power (W) |
| ------------------: | -----------: | -------------------: | -------------: |
|                   2 | to calculate |         to calculate |   to calculate |
|                   5 | to calculate |         to calculate |   to calculate |
|                  10 | to calculate |         to calculate |   to calculate |
|                  20 | to calculate |         to calculate |   to calculate |

Use `I=ℰ/(R+r)`, `V_terminal=IR`, and `P_load=I²R`.

### Node-voltage case

A 12.0 V node connects through 6.0 Ω to unknown node `V`. Node `V` connects to ground through parallel 3.0 Ω and 6.0 Ω branches.

- write one junction equation;
- solve node voltage;
- calculate each branch current;
- verify source current equals branch-current sum;
- calculate total power from the source and in the resistors.

### Meter loading

An ideal 12.0 V source drives two 100 kΩ resistors in series between its positive terminal and ground. The midpoint connects to the top of the lower resistor. A voltmeter measures that midpoint relative to ground, placing its resistance in parallel with the lower resistor.

Compare an ideal infinite-resistance voltmeter, a 1.0 MΩ meter and a 100 kΩ meter. Draw each equivalent circuit, calculate the reading and compare it with the undisturbed midpoint voltage.

## Thermal Optics and Modern Bridges Cases

### Thermal record

A 0.250 kg sample receives energy at a modeled constant 50 W.

| Time (s) | Temperature (°C) |
| -------: | ---------------: |
|        0 |             20.0 |
|       20 |             24.8 |
|       40 |             29.7 |
|       60 |             34.4 |
|       80 |             39.1 |

Estimate energy input, temperature slope, and effective specific heat. State how environmental losses would alter the interpretation.

### Lens comparison

A converging lens has `f=12.0 cm`.

| Object distance (cm) | Measured image distance (cm) | Thin-lens prediction (cm) |
| -------------------: | ---------------------------: | ------------------------: |
|                   18 |                         37.0 |              to calculate |
|                   24 |                         24.5 |              to calculate |
|                   36 |                         18.2 |              to calculate |
|                   60 |                         15.3 |              to calculate |

Calculate residuals and identify whether the pattern suggests random reading scatter or a possible model/calibration issue.

### Threshold evidence

| Frequency (10¹⁴ Hz) | Response energy (eV) |
| ------------------: | -------------------: |
|                 4.5 |                 0.00 |
|                 5.0 |                 0.00 |
|                 5.5 |                 0.20 |
|                 6.0 |                 0.42 |
|                 7.0 |                 0.83 |

State the classical expectation being tested, the threshold pattern, and the limited refined idea needed to explain the data.

### Heating and phase record

An ideal 0.100 kg sample begins at its melting point, 0 °C. Constant input power is 100 W. Use latent heat 334,000 J/kg and liquid specific heat 4180 J/(kg·°C), with no losses.

| Time (s) | Temperature (°C) |
| -------: | ---------------: |
|        0 |                0 |
|      100 |                0 |
|      200 |                0 |
|      334 |                0 |
|    375.8 |               10 |
|    417.6 |               20 |

Explain what changes during the plateau. Calculate the melting duration and the energy needed for the following 10 °C increase.

### Thermal design comparison

Two fictional insulated enclosures have effective heat capacity 200 J/K, start at 60 °C and cool in the same 20 °C room.

| Time (s) | Design A temperature (°C) | Design B temperature (°C) |
| -------: | ------------------------: | ------------------------: |
|        0 |                        60 |                        60 |
|       60 |                        54 |                        57 |
|      120 |                        48 |                        54 |

A costs 4 units; B costs 7 units. Require temperature at least 52 °C at 120 s and cost at most 8 units. Estimate each average heat-loss rate from CΔT/Δt, compare the criteria, and identify why the short record does not establish a cooling law at all temperatures.

### Optional interference phase cards

Two linear waves travel in opposite directions with equal 2 cm amplitudes and period 1 s. At one position their displacements are:

| Time (s) | Wave A (cm) | Wave B, matching phase (cm) | Wave B, opposite phase (cm) |
| -------: | ----------: | --------------------------: | --------------------------: |
|     0.00 |           0 |                           0 |                           0 |
|     0.25 |           2 |                           2 |                          -2 |
|     0.50 |           0 |                           0 |                           0 |
|     0.75 |          -2 |                          -2 |                           2 |
|     1.00 |           0 |                           0 |                           0 |

Use signed addition to find both total-displacement records and their amplitudes. This is an optional wave-model bridge for the optics discussion, not a prerequisite for completing the quantitative core.

## Engineering Physics Capstone Cases

### Option A: Ramp delivery system

Goal: deliver a modeled package to a target speed range of 3.8–4.2 m/s.

Available evidence:

- ramp height 0.80–1.20 m;
- kinetic-friction coefficient estimate 0.10 ± 0.02;
- package mass 2.0–5.0 kg;
- 4.0 m maximum ramp length.

Required comparison:

- two ramp designs;
- ideal energy prediction;
- friction-inclusive prediction;
- sensitivity to coefficient uncertainty;
- criterion and constraint table.

### Option B: Circuit power supply

Goal: power two modeled loads independently while keeping source current below 2.0 A.

Available evidence:

- 12.0 V emf;
- 1.0 Ω internal resistance;
- load options 8 Ω, 12 Ω, and 20 Ω;
- switch and meter models;
- separate switches in each parallel load branch;
- an open failure in one branch;
- a wire bypass across one load that directly connects the two load-supply nodes, leaving only source internal resistance to limit fault current.

### Option C: Impact system

Goal: keep average force below 300 N for a supplied momentum change while limiting stopping distance to 0.12 m.

Available evidence:

- force-time records;
- object mass 4.0 kg;
- initial speed 5.0 m/s;
- candidate stopping times 0.05, 0.08, and 0.12 s;
- constant deceleration throughout each candidate stop, with force opposing motion;
- force magnitudes and distances to calculate from those times.

Compare all candidates. An infeasible result is valid evidence: identify the conflicting criteria and propose an explicit revision rather than assuming a passing design exists. Limit the conclusion to this constant-deceleration model family.

### Capstone record

Every option includes question, system, model, source values, calculation, validation, criteria, constraints, uncertainty, alternative, revision, and a concrete reversal condition.

## Numerical Modeling and Simulation Cases

### Explicit Euler free-fall check

Use upward positive, `a=-9.80 m/s²`, `x_0=0`, `v_0=0`, and:

`x_(n+1)=x_n+v_nΔt; v_(n+1)=v_n+aΔt.`

At `t=2.00 s`, analytic `x=-19.60 m`.

| Step size (s) | Euler position at 2.00 s (m) | Absolute error (m) |
| ------------: | ---------------------------: | -----------------: |
|          1.00 |                        -9.80 |       to calculate |
|          0.50 |                       -14.70 |       to calculate |
|          0.25 |                       -17.15 |       to calculate |
|         0.125 |                      -18.375 |       to calculate |

Graph error against step size and describe convergence.

### Oscillator stability trace

The undamped oscillator has m = 1.00 kg, k = 1.00 N/m, x₀ = 1.00 m, v₀ = 0 and step h = 0.0500 s. Analytic energy is 0.500 J. Explicit Euler uses xnext = x + vh and vnext = v − (k/m)xh, with both right-hand sides from the old state. Symplectic Euler updates v first and then xnext = x + vnext h.

| Time (s) | Analytic energy (J) | Explicit Euler energy (J) | Symplectic Euler energy (J) |
| -------: | ------------------: | ------------------------: | --------------------------: |
|        0 |               0.500 |                     0.500 |                       0.500 |
|        5 |               0.500 |                     0.642 |                       0.507 |
|       10 |               0.500 |                     0.824 |                       0.489 |
|       15 |               0.500 |                     1.058 |                       0.513 |
|       20 |               0.500 |                     1.357 |                       0.491 |

Identify numerical energy drift and explain why a visually oscillating result can still fail a conservation check.

### Verification checklist

- exact or analytic special case;
- step-halving comparison;
- dimensional check;
- conservation or invariant check;
- limiting case;
- independent implementation or spreadsheet check;
- residual plot.

## Uncertainty and Curve Fitting Cases

### Linear calibration evidence

For both datasets below, x is time in seconds and y is position in metres. For the linear record, take independent standard uncertainty u(y) = 0.20 m at every point and negligible x uncertainty. The displayed candidate model is y = (2 m/s)x + 1 m; it is not declared to be the least-squares fit.

| `x` | Measured `y` | Model `y=2x+1` | Residual `y-y_model` |
| --: | -----------: | -------------: | -------------------: |
|   0 |          1.1 |   to calculate |         to calculate |
|   1 |          2.9 |   to calculate |         to calculate |
|   2 |          5.2 |   to calculate |         to calculate |
|   3 |          6.8 |   to calculate |         to calculate |
|   4 |          9.1 |   to calculate |         to calculate |
|   5 |         10.9 |   to calculate |         to calculate |

Graph data and residuals. Decide whether residual signs look random or patterned.

### Curved-model evidence

| `x` | Measured `y` |
| --: | -----------: |
|   0 |          0.1 |
|   1 |          1.0 |
|   2 |          4.2 |
|   3 |          9.1 |
|   4 |         15.9 |
|   5 |         25.2 |

Compare a linear fit with y = (1 m/s²)x². Use residual structure rather than visual preference alone.

### Bias and scatter cases

1. repeated readings cluster tightly 0.50 units above a certified reference;
2. readings scatter widely around the reference mean;
3. one point differs after a logged sensor disconnect;
4. one point differs with no recorded cause;
5. all points drift upward with time.

Classify random scatter, possible systematic bias, outlier evidence, and drift without deleting data automatically.

## Coupled Systems and Constraints Cases

### Two blocks on a table

Blocks A = 2.00 kg and B = 3.00 kg are connected by a massless rope on a frictionless table. A 20.0 N force pulls B right.

- draw separate diagrams;
- calculate shared acceleration;
- calculate tension;
- verify with the whole-system equation;
- repeat with 2.0 N kinetic friction on each block.

### Atwood machine

Masses 4.00 kg and 2.00 kg connect over a frictionless massless pulley.

- derive the shared acceleration magnitude;
- calculate tension;
- check `0<a<g`;
- compare with a fixed-axis 1.00 kg thin-ring pulley of radius R and inertia I = MR², with a massless rope, no slip and no bearing friction; derive acceleration before comparing with the supplied 2.80 m/s².

### Moving support constraint

A rope passes over a fixed pulley, around a movable pulley supporting load L, and attaches to a driven endpoint E.

If the total variable rope length is `x_E+2y_L`, derive the velocity and acceleration relation. State why the load speed is not equal to endpoint speed.

## Fluids and Continuum Models Cases

### Continuity and pressure record

Water has density 1000 kg/m³. Elevation is constant.

| Section | Area (cm²) |  Speed (m/s) | Ideal pressure (kPa) | Measured pressure (kPa) |
| ------- | ---------: | -----------: | -------------------: | ----------------------: |
| 1       |        4.0 |          1.0 |                120.0 |                   120.0 |
| 2       |        2.0 | to calculate |         to calculate |                   117.8 |
| 3       |        1.0 | to calculate |         to calculate |                   110.9 |

Use continuity and `p+(1/2)ρ v²=constant` for the ideal prediction. Compare measured pressure with ideal pressure and estimate loss.

### Branching flow

An inlet carries 6.0 L/s. Branch A carries 2.2 L/s and Branch B carries 1.8 L/s.

- calculate Branch C flow;
- convert all values to m³/s;
- state the steady incompressible assumption;
- identify storage or leakage as alternate explanations if measured outflow differs.

### Continuum-domain cards

- water pipe at ordinary scale;
- air flow at low speed;
- microchannel comparable to molecular mean free path;
- turbulent wake;
- compressible high-speed nozzle;
- viscous narrow tube.

For each, identify whether incompressible, inviscid, steady, laminar, one-dimensional, or continuum assumptions need review.

## Thermodynamics and Engines Cases

### Engine and refrigerator records

| Device         |    `Q_h` (J) |   `Q_c` (J) |     Work (J) | Quantity to calculate |
| -------------- | -----------: | ----------: | -----------: | --------------------- |
| Engine A       |         1000 |         650 | to calculate | efficiency            |
| Engine B       |         1000 |         500 | to calculate | efficiency            |
| Refrigerator C | 800 rejected | 600 removed | to calculate | refrigerator COP      |

Use a clear sign convention and energy-flow diagram.

### Reservoir comparison

Hot reservoir = 600 K; cold reservoir = 300 K.

- calculate the reversible upper-bound efficiency;
- compare Engine A and B with that bound;
- explain why matching the bound would still rely on ideal reversible operation;
- repeat the bound for a 400 K hot reservoir.

### Process-path record

A gas moves between the same initial and final states by two paths:

| Path | Heat into system (J) | Work done by system (J) |
| ---- | -------------------: | ----------------------: |
| X    |                  500 |                     200 |
| Y    |                  700 |                     400 |

Calculate `ΔU` for each and explain why heat and work can depend on path while internal-energy change depends only on endpoints.

## Electromagnetic Signals and Sensors Cases

### Sensor calibration

The reference quantity q is temperature in °C for a fictional sensor. Voltage sensitivity is 0.020 V/°C over 0–40 °C and nominal zero offset is 0.50 V.

| Reference temperature (°C) | Sensor voltage (V) |
| -------------------------: | -----------------: |
|                          0 |               0.51 |
|                         10 |               0.70 |
|                         20 |               0.91 |
|                         30 |               1.09 |
|                         40 |               1.31 |

Compare the nominal calibration `q=(V-0.50)/0.020` with the supplied points. Calculate residuals in voltage or inferred quantity.

### Induction transduction case

A fixed 100-turn coil has signed magnetic flux per turn changing from 0.002 Wb to 0.005 Wb in 0.10 s. Calculate average induced emf using the stated positive-flux orientation. Compare reversing the flux change and holding flux constant. These are supplied model values, with no physical electrical apparatus required.

### Noisy time series

| Time (s) | Raw signal (V) |
| -------: | -------------: |
|        0 |           1.00 |
|        1 |           1.08 |
|        2 |           0.94 |
|        3 |           1.12 |
|        4 |           0.97 |
|        5 |           1.30 |
|        6 |           1.33 |
|        7 |           1.28 |

Compare raw values with a trailing three-point mean aligned to the current sample: mean at t uses values at t−2, t−1 and t. Leave the first two filtered values undefined. Describe the step-like rise near 5 s and how smoothing delays or blurs it; these samples alone do not establish its physical cause.

### Sampling cards

- 1 Hz physical signal sampled at 10 Hz;
- 5 Hz physical signal sampled at 6 Hz;
- brief pulse between sample times;
- sensor saturated at 5.0 V;
- slowly drifting zero offset;
- high-frequency noise removed by a low-pass filter.

For each, identify what the record can preserve, distort, or entirely miss.

## Relativity and Reference Frames Cases

### Lorentz-factor table

Use `γ=1/√(1-β²)`, where `β=v/c`.

|  `β` |          `γ` |
| ---: | -----------: |
| 0.01 | to calculate |
| 0.10 | to calculate |
| 0.50 | to calculate |
| 0.80 | to calculate |
| 0.95 | to calculate |

Compare each with the classical low-speed approximation `γ≈1`.

### Proper-time case

A moving unstable particle has proper lifetime 2.20 µs and speed 0.95c in the laboratory frame.

- calculate `γ`;
- calculate laboratory mean lifetime;
- calculate mean laboratory travel distance under constant speed;
- identify which frame measures proper time;
- state the introductory constant-velocity assumption.

### Train-platform events

The train moves toward its front at constant velocity. At platform time zero its midpoint passes the platform midpoint. At that same platform time, front and rear flashes are emitted at equal distances from the platform midpoint. Both light signals travel toward the midpoints.

Create:

- named platform and train frames;
- five distinct events: front emission, rear emission, the simultaneous arrival of both signals at the platform midpoint, front signal reaching the train midpoint, rear signal reaching the train midpoint;
- a qualitative order argument for the train observer;
- a correction to “both observers merely see different illusions.”

## Independent Physics Portfolio Cases

### Research seed A: Numerical model verification

Question family: How does step size or update method affect a conservation or trajectory result?

Minimum evidence:

- equation and analytic baseline;
- two methods or three step sizes;
- error or residual graph;
- model-versus-numerical distinction.

### Research seed B: Measurement model

Question family: Which relationship best represents a supplied dataset, and how strong is the parameter evidence?

Minimum evidence:

- raw data and source;
- at least two candidate models;
- residuals;
- uncertainty or sensitivity;
- declared exclusion rule.

### Research seed C: Engineering comparison

Question family: Which of two designs better meets stated criteria under uncertain conditions?

Minimum evidence:

- criteria and constraints;
- shared test conditions;
- quantitative model;
- tradeoff and sensitivity table;
- reversal threshold.

### Research seed D: Model-domain study

Question family: Where does a familiar physics model remain useful, and what evidence motivates refinement?

Minimum evidence:

- classical model;
- operating domain;
- evidence inside and outside the domain;
- refined model feature;
- caution against claiming total model failure.

### Required portfolio record

1. focused question and scope;
2. source-quality notes;
3. system, quantities, units, and model;
4. preserved supplied evidence;
5. reproducible calculation or analysis;
6. graph, diagram, residual, or trace;
7. uncertainty, sensitivity, and alternative;
8. bounded conclusion;
9. first version, feedback, and substantive revision;
10. defense and concrete reversal condition.
