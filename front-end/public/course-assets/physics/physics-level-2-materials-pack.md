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

Use launch speed 20.0 m/s, launch and landing at the same height, and \(g=9.80\text{ m/s}^2\).

| Angle | \(v_{0x}\) (m/s) | \(v_{0y}\) (m/s) |     Time (s) |    Range (m) | Maximum height (m) |
| ----: | ---------------: | ---------------: | -----------: | -----------: | -----------------: |
|   30° |     to calculate |     to calculate | to calculate | to calculate |       to calculate |
|   45° |     to calculate |     to calculate | to calculate | to calculate |       to calculate |
|   60° |     to calculate |     to calculate | to calculate | to calculate |       to calculate |

Tasks:

- derive component equations before using range shortcuts;
- compare complementary-angle ranges;
- identify which launch has greatest time and height;
- state exactly where the no-drag and equal-height assumptions enter;
- predict how a horizontal drag force would alter the component story.

### Supplied no-drag and drag traces

Both traces use 20.0 m/s at 45°. Positions are rounded.

| Time (s) | No-drag \(x\) (m) | No-drag \(y\) (m) | Drag-model \(x\) (m) | Drag-model \(y\) (m) |
| -------: | ----------------: | ----------------: | -------------------: | -------------------: |
|      0.0 |               0.0 |               0.0 |                  0.0 |                  0.0 |
|      0.5 |               7.1 |               5.8 |                  6.7 |                  5.5 |
|      1.0 |              14.1 |               9.2 |                 12.7 |                  8.4 |
|      1.5 |              21.2 |              10.2 |                 18.1 |                  8.7 |
|      2.0 |              28.3 |               8.7 |                 23.0 |                  6.5 |
|      2.5 |              35.4 |               4.7 |                 27.4 |                  2.0 |

Calculate horizontal residuals relative to the no-drag model and identify when the discrepancy becomes decision-relevant under a ±1.0 m position tolerance.

### Rescue-drone vector case

A drone can move at 12.0 m/s relative to the air. A steady wind is 5.0 m/s east. The desired ground path is 600 m due north.

- determine the needed westward air-velocity component;
- calculate the available northward component;
- calculate travel time;
- compare with a naive due-north heading;
- repeat for a 7.0 m/s east wind and state the feasibility limit.

## Multi Force and Equilibrium Cases

### Elevator scale data

A 70.0 kg rider uses \(g=9.80\text{ m/s}^2\).

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

## Friction Inclines and Connected Systems Cases

### Static threshold

A block has \(\mu_s=0.30\) and \(\mu_k=0.20\).

| Ramp angle | \(mg\sin\theta/mg\) | \(\mu_s\cos\theta\) | Predicted state from rest |
| ---------: | ------------------: | ------------------: | ------------------------- |
|        10° |        to calculate |        to calculate | classify                  |
|        15° |        to calculate |        to calculate | classify                  |
|        20° |        to calculate |        to calculate | classify                  |
|        25° |        to calculate |        to calculate | classify                  |

Compare the downslope requirement with maximum static friction. Do not substitute kinetic friction until sliding occurs.

### Sliding acceleration

For the same block after sliding begins, use \(a=g(\sin\theta-\mu_k\cos\theta)\).

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

## Quantitative Momentum and Collisions Cases

### Two-dimensional collision

Positive \(x\) is east and positive \(y\) is north.

| Object | Mass (kg) | Initial velocity (m/s) | Final velocity (m/s) |
| ------ | --------: | ---------------------- | -------------------- |
| A      |      1.00 | \((4.0,0.0)\)          | \((0.0,2.0)\)        |
| B      |      2.00 | \((0.0,1.0)\)          | \((2.0,0.0)\)        |

Build separate \(x\)- and \(y\)-momentum ledgers, compare total kinetic energy, and identify one physical energy-transfer route.

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

| Object | Inertia model   | \(I\) (kg·m²) | Angular acceleration (rad/s²) |
| ------ | --------------- | ------------: | ----------------------------: |
| disk   | \(\frac12MR^2\) |  to calculate |                  to calculate |
| ring   | \(MR^2\)        |  to calculate |                  to calculate |

Explain why equal mass, radius, and torque do not give equal angular acceleration.

### Rotational equilibrium

A 4.00 m beam of mass 20.0 kg is supported at its center. A 300 N load hangs 1.50 m left of center. An unknown downward load hangs 1.00 m right of center.

- calculate the unknown load for rotational equilibrium;
- determine the vertical support force;
- state why beam weight creates no torque about the center but still enters force balance.

### Rolling comparison

The disk and ring roll without slipping from the same vertical drop of 1.20 m.

Use energy conservation and the inertia models to compare bottom speeds. Then name rolling resistance, deformation, and slip as effects absent from the ideal result.

## Gravitation Circular Motion and Orbits Cases

Use Earth gravitational parameter \(\mu=3.986\times10^{14}\text{ m}^3/\text{s}^2\).

### Circular-orbit table

| Orbit                    | Radius from Earth's center (m) |  Speed (m/s) |   Period (s) |
| ------------------------ | -----------------------------: | -----------: | -----------: |
| low A                    |             \(6.77\times10^6\) | to calculate | to calculate |
| low B                    |             \(7.37\times10^6\) | to calculate | to calculate |
| geosynchronous reference |           \(4.2164\times10^7\) | to calculate | to calculate |

Use \(v=\sqrt{\mu/r}\) and \(T=2\pi r/v\). Compare period and speed trends with radius.

### Inverse-square comparison

| Separation \(r\) | Relative gravitational force |
| ---------------- | ---------------------------: |
| \(R\)            |                            1 |
| \(2R\)           |                 to calculate |
| \(3R\)           |                 to calculate |
| \(4R\)           |                 to calculate |

State which quantities are held fixed and why \(r\) is center-to-center separation.

### Orbit energy cards

For a 500 kg satellite, compare specific or total orbital energy at low A and low B. A complete explanation distinguishes changing gravitational potential, kinetic energy, and the external work needed to transfer between circular orbits.

## Electricity Circuits and Fields Cases

### Source with internal resistance

An ideal emf of 12.0 V has internal resistance 1.00 Ω.

| Load resistance (Ω) |  Current (A) | Terminal voltage (V) | Load power (W) |
| ------------------: | -----------: | -------------------: | -------------: |
|                   2 | to calculate |         to calculate |   to calculate |
|                   5 | to calculate |         to calculate |   to calculate |
|                  10 | to calculate |         to calculate |   to calculate |
|                  20 | to calculate |         to calculate |   to calculate |

Use \(I=\mathcal{E}/(R+r)\), \(V_\text{terminal}=IR\), and \(P_\text{load}=I^2R\).

### Node-voltage case

A 12.0 V node connects through 6.0 Ω to unknown node \(V\). Node \(V\) connects to ground through parallel 3.0 Ω and 6.0 Ω branches.

- write one junction equation;
- solve node voltage;
- calculate each branch current;
- verify source current equals branch-current sum;
- calculate total power from the source and in the resistors.

### Meter loading

A 100 kΩ resistor divider is measured with:

- ideal infinite-resistance voltmeter;
- 1.0 MΩ voltmeter;
- 100 kΩ voltmeter.

Draw the equivalent circuit for each and explain why the reading changes when meter resistance is comparable to the circuit resistance.

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

A converging lens has \(f=12.0\text{ cm}\).

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
- one open-failure and one short-risk case.

### Option C: Impact system

Goal: keep average force below 300 N for a supplied momentum change while limiting stopping distance to 0.12 m.

Available evidence:

- force-time records;
- object mass 4.0 kg;
- initial speed 5.0 m/s;
- candidate stopping times 0.05, 0.08, and 0.12 s;
- candidate average stopping forces.

### Capstone record

Every option includes question, system, model, source values, calculation, validation, criteria, constraints, uncertainty, alternative, revision, and a concrete reversal condition.

## Numerical Modeling and Simulation Cases

### Explicit Euler free-fall check

Use upward positive, \(a=-9.80\text{ m/s}^2\), \(x_0=0\), \(v_0=0\), and:

\[
x_{n+1}=x_n+v_n\Delta t,\qquad
v_{n+1}=v_n+a\Delta t.
\]

At \(t=2.00\text{ s}\), analytic \(x=-19.60\text{ m}\).

| Step size (s) | Euler position at 2.00 s (m) | Absolute error (m) |
| ------------: | ---------------------------: | -----------------: |
|          1.00 |                        -9.80 |       to calculate |
|          0.50 |                       -14.70 |       to calculate |
|          0.25 |                       -17.15 |       to calculate |
|         0.125 |                      -18.375 |       to calculate |

Graph error against step size and describe convergence.

### Oscillator stability trace

The same undamped oscillator is modeled with two methods.

| Time | Analytic energy | Explicit Euler energy | Symplectic Euler energy |
| ---: | --------------: | --------------------: | ----------------------: |
|    0 |           0.500 |                 0.500 |                   0.500 |
|    5 |           0.500 |                 0.641 |                   0.487 |
|   10 |           0.500 |                 0.822 |                   0.519 |
|   15 |           0.500 |                 1.054 |                   0.493 |
|   20 |           0.500 |                 1.352 |                   0.506 |

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

| \(x\) | Measured \(y\) | Model \(y=2x+1\) | Residual \(y-y_\text{model}\) |
| ----: | -------------: | ---------------: | ----------------------------: |
|     0 |            1.1 |     to calculate |                  to calculate |
|     1 |            2.9 |     to calculate |                  to calculate |
|     2 |            5.2 |     to calculate |                  to calculate |
|     3 |            6.8 |     to calculate |                  to calculate |
|     4 |            9.1 |     to calculate |                  to calculate |
|     5 |           10.9 |     to calculate |                  to calculate |

Graph data and residuals. Decide whether residual signs look random or patterned.

### Curved-model evidence

| \(x\) | Measured \(y\) |
| ----: | -------------: |
|     0 |            0.1 |
|     1 |            1.0 |
|     2 |            4.2 |
|     3 |            9.1 |
|     4 |           15.9 |
|     5 |           25.2 |

Compare a linear fit with \(y=x^2\). Use residual structure rather than visual preference alone.

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
- check \(0<a<g\);
- compare with a 1.0 kg pulley-inertia case using supplied acceleration 2.80 m/s².

### Moving support constraint

A rope passes over a fixed pulley, around a movable pulley supporting load L, and attaches to a driven endpoint E.

If the total variable rope length is \(x_E+2y_L\), derive the velocity and acceleration relation. State why the load speed is not equal to endpoint speed.

## Fluids and Continuum Models Cases

### Continuity and pressure record

Water has density 1000 kg/m³. Elevation is constant.

| Section | Area (cm²) |  Speed (m/s) | Ideal pressure (kPa) | Measured pressure (kPa) |
| ------- | ---------: | -----------: | -------------------: | ----------------------: |
| 1       |        4.0 |          1.0 |                120.0 |                   120.0 |
| 2       |        2.0 | to calculate |         to calculate |                   117.8 |
| 3       |        1.0 | to calculate |         to calculate |                   110.9 |

Use continuity and \(p+\frac12\rho v^2=\text{constant}\) for the ideal prediction. Compare measured pressure with ideal pressure and estimate loss.

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

| Device         |  \(Q_h\) (J) | \(Q_c\) (J) |     Work (J) | Quantity to calculate |
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

Calculate \(\Delta U\) for each and explain why heat and work can depend on path while internal-energy change depends only on endpoints.

## Electromagnetic Signals and Sensors Cases

### Sensor calibration

| Reference quantity | Sensor voltage (V) |
| -----------------: | -----------------: |
|                  0 |               0.51 |
|                 10 |               0.70 |
|                 20 |               0.91 |
|                 30 |               1.09 |
|                 40 |               1.31 |

Compare the nominal calibration \(q=(V-0.50)/0.020\) with the supplied points. Calculate residuals in voltage or inferred quantity.

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

Compare raw values with a three-point moving average. Identify the real step-like change near 5 s and explain how smoothing shifts or blurs its apparent timing.

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

Use \(\gamma=1/\sqrt{1-\beta^2}\), where \(\beta=v/c\).

| \(\beta\) |   \(\gamma\) |
| --------: | -----------: |
|      0.01 | to calculate |
|      0.10 | to calculate |
|      0.50 | to calculate |
|      0.80 | to calculate |
|      0.95 | to calculate |

Compare each with the classical low-speed approximation \(\gamma\approx1\).

### Proper-time case

A moving unstable particle has proper lifetime 2.20 µs and speed 0.95c in the laboratory frame.

- calculate \(\gamma\);
- calculate laboratory mean lifetime;
- calculate mean laboratory travel distance under constant speed;
- identify which frame measures proper time;
- state the introductory constant-velocity assumption.

### Train-platform events

Two flashes occur at the front and rear of a moving train. A platform observer records the flashes as simultaneous and equidistant from the platform midpoint.

Create:

- named platform and train frames;
- four events: front flash, rear flash, light reaches platform midpoint, light reaches train midpoint;
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
