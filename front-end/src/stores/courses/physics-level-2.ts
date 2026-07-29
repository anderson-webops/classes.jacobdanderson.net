import type { RawCourse, RawCourseModuleItem } from "./types";
import { contextualizePhysicsCourse } from "./physicsContentContext";

const physicsLevel2SourceCourse: RawCourse = contextualizePhysicsCourse({
	name: "Physics Level 2",
	modules: [
		{
			title: "PHY8 Quantitative Kinematics and Vector Modeling",
			curriculum: [
				{
					title: "Introductions, Tooling, and Data Workflow",
					content:
						"This course builds on Intro to Physics and assumes comfort with algebra, graph reading, and basic trigonometry. The modeling workflow includes VS Code or PyCharm for optional Python notebooks, spreadsheets for quick data work, and browser tools like PhET and Desmos for visual reasoning. The course now expects more multi-step modeling, clearer assumptions, and stronger graph interpretation than the introductory sequence."
				},
				{
					title: "Functions, Vectors, and Coordinate Systems",
					content:
						"Treat position, velocity, and acceleration as functions that can be analyzed numerically, graphically, and geometrically. Reinforce vector direction, magnitude, and components, then explain how a well-chosen coordinate system can simplify a complicated problem dramatically. Build the habit of choosing axes before writing equations."
				},
				{
					title: "Worked Example Set: Relative Velocity and Projectile Motion",
					content:
						"Work a wind-and-aircraft example, a river-crossing example, and a projectile example where horizontal and vertical motion are separated cleanly. Use component form, not memorized shortcuts alone, so the source of each equation is clear. Connect the mathematics back to physical storylines such as rescue drones, kicked balls, or supply drops."
				},
				{
					title: "Graph and Data Exercise: Motion Graph Detective 2D",
					content:
						"Extend the motion-graph strand by combining graph interpretation with vector reasoning. Compare horizontal and vertical component graphs, estimate turning points, and decide when acceleration changes only one part of the motion. Justify each conclusion with slope, area, or vector language."
				},
				{
					title: "Investigation or Simulation: Ballistics Model Comparison",
					content:
						"Compare a projectile prediction from equations with data from video, a simulator, or a spreadsheet model. Decide which assumptions are reasonable, where drag starts to matter, and why a model can still be useful when it is not perfect."
				},
				{
					title: "Reflection Question: When Do Components Clarify a Problem?",
					content:
						"Explain one motion problem that looked complex until it was decomposed into perpendicular components. A strong response identifies exactly which quantity became easier to reason about after the coordinate system was chosen."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: resolve vectors accurately, label angles consistently, and explain why horizontal and vertical equations can be solved separately in projectile motion. Prompt: choose axes and defend the choice before calculating."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating horizontal motion as if it 'runs out' at the top of a projectile, adding vectors by simply adding magnitudes, and treating sign mistakes as minor when they actually signal a broken coordinate setup."
				},
				{
					title: "Extension Project: Rescue Drone Navigation",
					content:
						"Plan a drone route that must compensate for wind or current. Use components, displacement vectors, and a short written explanation to compare intended motion with actual motion."
				}
			]
		},
		{
			title: "PHY9 Multi-Force Systems and Equilibrium",
			curriculum: [
				{
					title: "Net Force in Real Systems",
					content:
						"Forces are vectors that can combine, oppose, or redirect motion, so the course moves beyond single-force examples. Equilibrium, acceleration, and isolating one object at a time matter in multi-object systems. Free-body diagrams stay central instead of becoming a warm-up step."
				},
				{
					title: "Worked Example Set: Elevators, Scales, and Connected Objects",
					content:
						"Work examples involving elevators, hanging masses, and platforms where the same object experiences multiple forces at once. Use Newton's laws to connect scale readings, normal force, and acceleration in a quantitative way. Highlight how the algebra stays manageable when the diagram is accurate."
				},
				{
					title: "Graph and Data Exercise: Force Sensor or Spreadsheet Trends",
					content:
						"Use measured or simulated data that compares net force, mass, and acceleration across several trials. Graph the relationships, interpret slopes, and explain which variables were controlled and which were changed. Use the results to reinforce that acceleration is a system response, not an independent ingredient."
				},
				{
					title: "Investigation or Simulation: Elevator and Scale Force Study",
					content:
						"Model an elevator or amusement-ride scenario and compare actual weight with apparent weight. Predict when the scale reading exceeds, matches, or falls below true weight and justify each case with a net-force argument."
				},
				{
					title: "Reflection Question: What Does Equilibrium Really Mean?",
					content:
						"Explain why equilibrium is not the same thing as 'nothing is happening.' A strong response distinguishes between static equilibrium and constant-velocity motion with zero net force."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify all external forces before solving and state whether the system is accelerating along each chosen axis. A short diagram checkpoint explains a scale reading without relying on intuition alone."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include mixing up the force pair in Newton's third law with the set of forces on one object, and assuming a larger scale reading means the object's mass changed."
				},
				{
					title: "Extension Project: Tug-of-War System Audit",
					content:
						"Analyze a tug-of-war setup by separating the rope, the teams, and the ground into distinct objects. Use the project to reinforce the difference between internal and external forces in a system."
				}
			]
		},
		{
			title: "PHY10 Friction, Inclines, and Connected Systems",
			curriculum: [
				{
					title: "Friction and Ramp Geometry",
					content:
						"Develop static and kinetic friction carefully and connect both to the normal force and the surfaces involved. Use inclined planes to make force components concrete and to show why geometry matters in mechanics. Add connected systems such as pulleys so the model coordinates several equations rather than solving only one object at a time."
				},
				{
					title: "Worked Example Set: Blocks, Ramps, and Pulleys",
					content:
						"Work through a block at rest on a ramp, a sliding crate with kinetic friction, and a simple connected-mass or pulley example. Choose axes along and perpendicular to the incline, then interpret each sign and term physically. Use the worked examples to normalize slow, organized setup."
				},
				{
					title: "Graph and Data Exercise: Acceleration Versus Angle",
					content:
						"Use simulation or spreadsheet data to compare how acceleration changes as ramp angle changes under different friction assumptions. Graph the results, identify thresholds where slipping begins, and discuss why the relationship is not captured by 'steeper always means simple linear growth.'"
				},
				{
					title: "Investigation or Simulation: Pulley or Incline Force Analyzer",
					content:
						"Use a simulation, provided dataset, or optional safe build of a pulley or incline system and compare the predicted acceleration with observed motion. Keep a force summary, a diagram, and a short note about how friction or mass mismatch changes the result."
				},
				{
					title: "Reflection Question: Which Assumption Matters Most Here?",
					content:
						"Identify the single assumption that most strongly shapes the answer in an incline or pulley problem. Examples include neglecting pulley mass, assuming constant friction, or choosing the positive direction poorly."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: decide when static friction must be compared against a maximum value and when kinetic friction is the better model. A strong checkpoint explains why the normal force is not always equal to weight."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include assuming friction always equals mu times N even in static situations where it only adjusts up to a maximum, and projecting the full weight down the ramp instead of resolving gravity into components."
				},
				{
					title: "Extension Project: Ramp Design Challenge",
					content:
						"Design a ramp that either keeps an object stationary or produces a chosen acceleration. Defend the design with a free-body diagram, trig-based components, and a short engineering-style justification."
				}
			]
		},
		{
			title: "PHY11 Momentum, Impulse, and Collisions",
			curriculum: [
				{
					title: "Momentum as a Conserved Quantity",
					content:
						"Momentum is a vector quantity that is often more useful than force alone when analyzing short interactions. Impulse is force applied over time and connects directly to the change in momentum. Collisions show how conservation laws organize messy events into a solvable structure."
				},
				{
					title: "Worked Example Set: Recoil, Bounces, and Crash Carts",
					content:
						"Work examples involving elastic and inelastic collisions, recoil, and impulse comparisons. Define the system first and then state whether external impulses are negligible. Keep the emphasis on sign, direction, and physical interpretation."
				},
				{
					title: "Graph and Data Exercise: Force-Time and Momentum Accounting",
					content:
						"Use force-time graphs or collision data tables to estimate impulse from area under the curve. Compare the momentum before and after several collision cases and discuss which differences come from measurement error versus genuine modeling limits."
				},
				{
					title: "Investigation or Simulation: Collision Momentum Ledger",
					content:
						"Use a collision simulation, provided cart dataset, video case, or optional safe collision investigation and keep a momentum accounting table. Record predictions, classify the collision type, and explain why momentum and kinetic energy do not always behave the same way."
				},
				{
					title: "Reflection Question: Why Is System Choice So Important?",
					content:
						"Explain how the same event looks different when the chosen system changes. A strong response uses the words momentum, external force, and impulse correctly."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish momentum conservation from kinetic-energy conservation and interpret the sign of momentum consistently. Prompt: decide whether a force-time graph indicates a large force for a short time or a smaller force for a longer time."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating momentum as conserved only when objects bounce apart, assuming heavier objects always 'win' a collision regardless of velocity, and confusing impulse with impact duration alone."
				},
				{
					title: "Extension Project: Safety System Design Review",
					content:
						"Compare helmets, airbags, or crumple zones through the impulse idea. Explain how changing impact time can reduce force without claiming momentum disappears."
				}
			]
		},
		{
			title: "PHY12 Rotational Motion and Torque",
			curriculum: [
				{
					title: "Angular Quantities and Torque",
					content:
						"Mechanics extends from straight-line motion to rotation through angular displacement, angular velocity, angular acceleration, and torque. Levers, doors, wrenches, and balance points make the ideas physical before formalizing them. Where a force acts matters just as much as how large it is."
				},
				{
					title: "Worked Example Set: Lever Arms and Rotational Equilibrium",
					content:
						"Work several torque-balance problems involving seesaws, meter sticks, hanging masses, and tools. Compare a force applied close to the pivot with the same force applied farther away, and explain the difference with moment arm language. Use sign conventions carefully so rotational direction becomes part of the reasoning."
				},
				{
					title: "Graph and Data Exercise: Torque Versus Distance from Pivot",
					content:
						"Build or interpret a simple dataset that changes lever arm length while keeping force fixed. Graph torque versus distance, explain the trend, and discuss when the relationship may deviate because of measurement limits or setup geometry."
				},
				{
					title: "Investigation or Simulation: Balance and Door-Handle Analysis",
					content:
						"Use a balance simulation, provided torque dataset, door-handle case, or optional safe physical observation to compare rotational effectiveness at different distances from the pivot. Connect physical effort to torque rather than claiming one side is simply 'heavier' in every case."
				},
				{
					title: "Reflection Question: How Is Rotation Like Translation, and How Is It Different?",
					content:
						"Map force to torque, mass to rotational inertia qualitatively, and linear acceleration to angular acceleration. The goal is not perfect formalism but deeper structural comparison."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify the pivot, choose a sign convention, and explain why a large force near the pivot may be less effective than a smaller force farther away. A quick prompt about opening a heavy door works well here."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating force magnitude as the only important factor, ignoring the location of the force, and confusing clockwise versus counterclockwise sign choices with right versus wrong answers rather than conventions."
				},
				{
					title: "Extension Project: Torque Design Challenge",
					content:
						"Design a lifting or balancing tool using lever-arm reasoning. Explain the pivot location, effort-force location, and tradeoffs the design introduces."
				}
			]
		},
		{
			title: "PHY13 Gravitation, Circular Motion, and Orbits",
			curriculum: [
				{
					title: "Universal Gravitation and Inward Acceleration",
					content:
						"Develop gravity as a universal interaction between masses rather than only as a local downward pull. Pair that idea with circular motion so the inward net force explains continuous direction change even when speed stays constant. This module functions as a bridge from terrestrial mechanics to space applications."
				},
				{
					title: "Worked Example Set: Loops, Satellites, and Orbital Speed",
					content:
						"Work a loop-the-loop force comparison, a satellite-in-orbit speed problem, and a mass-distance gravity comparison. Explain how gravitational force can supply the centripetal force without introducing a second mysterious force. Use diagrams to keep the inward direction visible at every point."
				},
				{
					title: "Graph and Data Exercise: Radius, Period, and Inverse-Square Trends",
					content:
						"Compare how orbital radius changes period, speed, and gravitational force using tables, plots, or simulation output. Include an inverse-square comparison so the distance effect in gravity problems is visible before exact values are computed."
				},
				{
					title: "Investigation or Simulation: Simple Orbit Model in Python or Spreadsheet",
					content:
						"Build a basic orbit model with a spreadsheet, Desmos, or simple Python code that updates position and velocity qualitatively. Compare a low-orbit and high-orbit case and explain what changes in period, speed, and curvature."
				},
				{
					title: "Reflection Question: Why Doesn't an Orbiting Object 'Run Out of Gravity'?",
					content:
						"Explain why astronauts feel weightless in orbit even though gravity is still present. A strong response connects free fall, orbital motion, and continuous inward acceleration in one coherent explanation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify the inward direction in circular motion and explain why constant speed does not imply zero acceleration. Prompt: compare gravity at Earth's surface with gravity in low orbit."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include adding centrifugal force automatically in every inertial-frame analysis, assuming satellites orbit because gravity has become negligible, and confusing constant speed with constant velocity."
				},
				{
					title: "Extension Project: Orbit Planner",
					content:
						"Design a simple satellite mission comparison between two orbital radii. Explain which orbit is better for faster revisits, which is better for wider coverage, and what the tradeoffs are."
				}
			]
		},
		{
			title: "PHY14 Electricity, Circuits, and Fields",
			curriculum: [
				{
					title: "From Circuits to Fields",
					content:
						"Advance the electricity unit by connecting circuit reasoning to electric field and potential ideas. Review current, voltage, and resistance, then extend to equivalent resistance, junction reasoning, and how potential difference drives charge motion. Keep the physics grounded in practical circuits while showing the deeper conceptual layer behind them."
				},
				{
					title: "Worked Example Set: Series-Parallel Analysis and Potential Drops",
					content:
						"Work several circuits with mixed branches, equivalent resistance, and qualitative current comparisons. Use simple energy and potential language so voltage is more than a number on a meter. Include one troubleshooting example where the circuit behavior reveals the hidden structure."
				},
				{
					title: "Graph and Data Exercise: I-V Curves and Circuit Tables",
					content:
						"Collect or interpret current-voltage data for resistive elements and compare linear versus non-linear behavior qualitatively. Build a clean circuit table listing current, potential difference, and resistance for each branch or component in a mixed circuit."
				},
				{
					title: "Investigation or Simulation: Series-Parallel Circuit Analysis",
					content:
						"Create or simulate a series-parallel circuit and compare predictions with measured or observed results. Keep a circuit diagram, note where potential drops occur, and explain how current splits or recombines at junctions."
				},
				{
					title: "Reflection Question: What Does Voltage Explain Better Than Current Alone?",
					content:
						"Explain one circuit behavior that becomes clearer once potential difference is considered explicitly. Avoid the shortcut claim that voltage is just 'electricity strength.'"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: compare branch current and branch voltage correctly in series and parallel settings. A useful checkpoint predicts what changes everywhere in the circuit when one resistor is increased."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include assuming the battery provides a fixed current regardless of circuit structure, treating voltage as if it is used up the same way current is imagined to be used up, and overgeneralizing pure-series rules to every mixed circuit."
				},
				{
					title: "Extension Project: Circuit Design Audit",
					content:
						"Design a circuit that achieves a target brightness or resistance pattern, then justify the design in schematic and verbal form. Include at least one branch and one design tradeoff."
				}
			]
		},
		{
			title: "PHY15 Thermal Physics, Optics, and Modern Bridges",
			curriculum: [
				{
					title: "Heat Transfer and Model Boundaries",
					content:
						"Temperature, internal energy, specific heat, and the three main heat-transfer pathways (conduction, convection, and radiation) anchor the module. The module then bridges to optics and early modern-physics ideas by showing how models can shift when wave behavior, energy quantization, or light-matter interaction becomes important. This is intentionally a bridge module: it broadens the physics map without requiring a full advanced course in each topic."
				},
				{
					title: "Worked Example Set: Heating Curves, Lenses, and Threshold Ideas",
					content:
						"Work one heat-transfer comparison, one heating-curve interpretation, and one simple mirror or lens reasoning problem. Close with a modern-physics bridge discussion such as why light color alone can matter in photoelectric-style threshold reasoning, even when brightness changes too. Keep the emphasis on interpretation and model choice rather than advanced derivations."
				},
				{
					title: "Graph and Data Exercise: Heating Curves and Image Trends",
					content:
						"Interpret a heating curve to identify temperature changes versus phase-change plateaus, then compare that skill to reading an optics graph or image-distance table. Describe what the graph means physically, not just to label segments."
				},
				{
					title: "Investigation or Simulation: Insulation or Lens Analysis",
					content:
						"Use a thermal simulation, optics simulation, provided dataset, or optional safe observation to compare insulation behavior, trace heat loss, or explore image formation with lenses or mirrors. Define what counts as evidence and note where the simplified classroom model begins to break down."
				},
				{
					title: "Reflection Question: When Does a Model Need to Change?",
					content:
						"Describe one topic in the course where an earlier simple model was helpful and one place where a more refined model was needed later. This helps bridge introductory and modern viewpoints without losing coherence."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish heat from temperature, identify the dominant heat-transfer pathway in a scenario, and interpret a heating curve in words. If optics is included, the checkpoint explains what a lens is doing to rays rather than merely naming the lens type."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include using heat and temperature interchangeably, assuming shiny automatically means hotter or colder without a mechanism, and treating a virtual image as if it physically sits on a screen."
				},
				{
					title: "Extension Project: Thermal Design Challenge",
					content:
						"Choose an everyday problem involving insulation, cooling, or light control and propose a design improvement. Support the proposal with one graph, one model, and one explicit limitation."
				}
			]
		},
		{
			title: "PHY16 Engineering Physics Capstone",
			curriculum: [
				{
					title: "Building a Defensible Physics Model",
					content:
						"The capstone brings the course together through assumptions, approximations, uncertainty, and communication. A strong capstone does not need to be huge; it needs to be coherent, testable, and honest about limits. Prefer projects that combine at least two major themes, such as vectors with forces, collisions with momentum, or circuits with power and heat."
				},
				{
					title: "Worked Example Set: From Physical Situation to Model",
					content:
						"Model selection includes choosing a system, stating assumptions, defining variables, and deciding whether the right tool is forces, energy, momentum, torque, or a hybrid model. Include one example where the first chosen model is not the best one, then revise it."
				},
				{
					title: "Graph and Data Exercise: Prediction Versus Observation",
					content:
						"Compare an experimental or simulated dataset to a model prediction, then separate random error, systematic error, and model breakdown. Include a graph that makes the comparison visible rather than hiding it inside paragraphs."
				},
				{
					title: "Investigation or Simulation: Engineering Modeling Challenge",
					content:
						"Accept projects such as a projectile planner, elevator-force simulation, pulley design, collision analysis, orbit model, or thermal design study. Each project includes a question, a model, a data source, a graph, and a short defense of the model's limits."
				},
				{
					title: "Reflection Question: What Makes a Physics Answer Convincing?",
					content:
						"Explain how diagrams, equations, graphs, and plain-language reasoning support one another in a strong final explanation. Include one model weakness and one improvement that would matter most in a later revision."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: defend the system choice, assumptions, graph choice, and uncertainty treatment under follow-up questioning. A strong checkpoint explains what evidence would have changed the conclusion."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include hiding weak reasoning behind long calculations, treating simulation output as automatically trustworthy because a computer produced it, and mistaking complexity for rigor instead of choosing a simpler, better-justified model."
				},
				{
					title: "Capstone Option: Physics Modeling Challenge",
					content:
						"Design a multi-step investigation or model that combines at least two major topics from the course. Present the final work with diagrams, calculations, graph evidence, stated assumptions, and a short engineering-style defense."
				}
			]
		},
		{
			title: "PHY17 Numerical Modeling and Simulation Checks",
			curriculum: [
				{
					title: "Numerical Model Concepts",
					content:
						"Numerical modeling turns a physics relationship into repeated update rules. Track the state variables, choose a time step, calculate the next state, and compare the result with a conservation check or known limiting case. The main question is not whether the computer produced numbers; it is whether the step size, assumptions, and validation evidence make those numbers physically defensible."
				},
				{
					title: "Simulation Reasoning Toolkit",
					content:
						"Start each simulation by naming the system, stored quantities, update equation, units, and stopping condition. Use a very small test case before trusting a longer run: constant velocity stays linear, free fall curves predictably, and total energy only drifts for a known reason. Record both the graph and one numerical check so errors in the loop, signs, or time step are visible."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from projectile motion with drag, iterative motion updates, and simulation-versus-ideal comparisons. For each example, show the update rule, a small table or graph, the first few calculated steps, and the validation check that makes the output credible."
				},
				{
					title: "Time-Step Data Exercise",
					content:
						"Run the same model with at least two time-step sizes and graph the results together. Look for divergence, artificial energy gain or loss, and places where a smooth path becomes jagged. The written conclusion explains whether the model is stable enough for the question being asked, not simply which graph looks better."
				},
				{
					title: "Simulation Case Study",
					content:
						"Use a browser simulation, spreadsheet, or short Python notebook to model projectile drag, repeated acceleration updates, orbit-like motion, or another iterative system. Keep the case study evidence-based and usable without special equipment: include the update rule, sample rows or graph output, one validation check, and one reason the ideal model and corrected model differ."
				},
				{
					title: "Transfer Practice: Model Stability",
					content:
						"Transfer the simulation pattern to a new physical system by identifying which variables still update step by step and which assumptions change. A strong response names the most fragile assumption, explains how smaller steps or better data would test it, and distinguishes a numerical artifact from a real physical effect."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the update rule, time step, initial conditions, and validation target are stated before a simulation run is trusted. A strong checkpoint explains one conservation or limiting-case test that would catch a broken numerical model."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include trusting a long simulation without a small sanity test, choosing a time step that creates artificial behavior, and treating graph smoothness as confirmation that the physics is correct."
				},
				{
					title: "Extension Project: Motion Model Comparison",
					content:
						"Compare an ideal motion model with a corrected model for drag, friction, nonconstant acceleration, or measurement noise. Include both graphs, explain what changed physically, and state which model is useful for prediction versus explanation."
				}
			]
		},
		{
			title: "PHY18 Experimental Uncertainty and Curve Fitting",
			curriculum: [
				{
					title: "Uncertainty and Fit Concepts",
					content:
						"Experimental uncertainty is part of the evidence, not a decoration added after the answer. Distinguish precision from accuracy, random scatter from systematic bias, and a good-looking trend from a justified model. Residuals, slope meaning, units, and fit quality all help decide what the data actually supports."
				},
				{
					title: "Data Quality Toolkit",
					content:
						"Before fitting a curve, define the measured quantities, units, instrument resolution, expected relationship, and possible bias source. Then inspect the data visually before calculating. A fitted line or curve needs a physical interpretation: the slope, intercept, residual pattern, and outliers all need context."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from position-time, velocity-time, force-extension, current-voltage, and transformed-variable graphs. For each example, identify the measured variables, graph shape, fitted relationship, residual behavior, and physical meaning of the slope or intercept."
				},
				{
					title: "Residuals and Slope Exercise",
					content:
						"Create a graph with labeled axes, a fitted relationship, and a residual check. Explain what the slope means physically, whether the intercept is meaningful or just a fitting artifact, and whether the residuals show random scatter or a pattern that the model missed."
				},
				{
					title: "Measurement Case Study",
					content:
						"Use provided data, a simulation export, a video measurement, or a spreadsheet dataset to make a claim with uncertainty attached. The final explanation includes the fitted model, the evidence for trusting or rejecting it, and one additional measurement that would most improve the conclusion."
				},
				{
					title: "Transfer Practice: Evidence Strength",
					content:
						"Apply the same uncertainty reasoning to a new dataset. State what the graph can prove, what it cannot prove, and how the conclusion changes if a suspected bias is real. The emphasis is on defensible evidence rather than producing a single polished equation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the measurement units, precision, suspected bias, fit type, and residual pattern are named before drawing a conclusion. A strong checkpoint explains what the slope means and whether the data actually supports that model."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include reporting too many digits, ignoring systematic bias because the graph looks linear, treating correlation as a physics law, and skipping residuals that would reveal a poor fit."
				},
				{
					title: "Extension Project: Measurement Audit",
					content:
						"Audit a measurement set by identifying precision, possible systematic bias, residuals, and the meaning of the fitted slope or trend. Revise the conclusion so it names what the data supports, what remains uncertain, and what additional measurement would help most."
				}
			]
		},
		{
			title: "PHY19 Coupled Systems and Constraints",
			curriculum: [
				{
					title: "Constraint Concepts",
					content:
						"Coupled systems require reasoning about relationships between objects before solving equations. Shared acceleration, fixed string length, tension assumptions, rods, pulleys, and contact constraints all restrict what motion is possible. The model succeeds when the diagram, constraint statement, and algebra describe the same physical linkage."
				},
				{
					title: "Constraint Reasoning Toolkit",
					content:
						"Name each object, force, idealization, and shared variable before writing equations. Then write the constraint in words and symbols: equal accelerations, opposite directions, fixed distance, rolling without slipping, or another relationship. Check that every equation follows from a diagram feature rather than from a memorized setup."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from pulleys, elevators, linked carts, friction pairs, rods, strings, and mechanical linkages. For each example, draw the connected objects, state the constraint in words, translate it into equations, and check whether the assumed linkage is physically plausible."
				},
				{
					title: "Constraint Diagram Exercise",
					content:
						"Draw a diagram or table that separates object-level forces from system-level constraints. The representation shows which quantities are shared, which directions are linked, and which assumptions would fail if a string stretches, a pulley has mass, or contact is lost."
				},
				{
					title: "Coupled-System Case Study",
					content:
						"Use a browser simulation, diagram set, or paper design case to analyze a connected system. The final explanation states the chosen system boundary, the constraint equation, the force model, and one realistic condition where the simplified constraint would stop working."
				},
				{
					title: "Transfer Practice: Changing Constraints",
					content:
						"Transfer the analysis to a related system with one changed constraint, such as a heavier pulley, slipping contact, elastic string, or added friction. Explain which equations survive, which must be rewritten, and what observation would reveal the change."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the system boundary, connected objects, shared variables, and idealized constraints are named before solving. A strong checkpoint explains why two accelerations, distances, or forces are linked rather than merely copying a pulley formula."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include assigning one tension value when the ideal-string assumption is not justified, mixing internal and external forces, and writing more equations without checking whether the constraints are independent."
				},
				{
					title: "Extension Project: Connected System Constraint Map",
					content:
						"Map a connected mechanical system such as linked carts, pulley masses, an elevator setup, or a hinged structure. Label the shared constraints, forces, assumed ideal parts, and one failure mode where the simplified constraint model would break."
				}
			]
		},
		{
			title: "PHY20 Fluids and Continuum Models",
			curriculum: [
				{
					title: "Continuum Model Concepts",
					content:
						"Fluid models treat many particles as a continuous material when the scale makes that approximation useful. Pressure, density, viscosity, flow rate, and boundary shape determine which model is reasonable. The important habit is naming when a continuum model is useful and when turbulence, compressibility, or material complexity makes it too simple."
				},
				{
					title: "Fluid Reasoning Toolkit",
					content:
						"Define the fluid region, inlet and outlet conditions, pressure or height difference, flow assumptions, and relevant material properties. Use diagrams to show where pressure changes, where speed changes, and where energy or mass conservation is being applied. Keep units visible because flow, pressure, and density errors often hide inside conversions."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from pipes, nozzles, blood vessels, ducts, weather, water slides, and simplified wing models. For each example, label the control volume or flow path, name the pressure and flow variables, and decide which assumptions make the simplified fluid model usable."
				},
				{
					title: "Pressure and Flow Exercise",
					content:
						"Represent a pipe, nozzle, duct, vessel, or flow path with a labeled diagram and a simple graph or table. The representation connects geometry to pressure, speed, or flow-rate changes and identifies where the model would be unreliable because of turbulence, leaks, changing viscosity, or poorly defined boundaries."
				},
				{
					title: "Fluid Case Study",
					content:
						"Use a simulation, provided data, video observation, or paper case such as a nozzle, wing analogy, blood-vessel model, water slide, or ventilation duct. The final explanation states the continuum assumption, the key variables, the evidence source, and one condition that would force a more detailed model."
				},
				{
					title: "Transfer Practice: Model Domain",
					content:
						"Transfer the fluid model to a new scale or material and decide whether the same assumptions still apply. A strong response compares what stays conserved with what changes because of viscosity, turbulence, compressibility, or boundary shape."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the fluid region, density or pressure variables, flow assumptions, and model limits are stated before calculation. A strong checkpoint explains why a continuum model is acceptable for the case being analyzed."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include using a pipe-flow formula outside its assumptions, ignoring viscosity or turbulence, mixing pressure and force units, and treating density as constant when the situation does not justify it."
				},
				{
					title: "Extension Project: Fluid System Case Study",
					content:
						"Analyze a fluid-system case such as a pipe, nozzle, duct, blood-vessel analogy, simplified wing, or water-slide segment. Identify the continuum assumption, flow or pressure variables, evidence source, and one reason the model may not transfer to a turbulent or real-material case."
				}
			]
		},
		{
			title: "PHY21 Thermodynamics and Engines",
			curriculum: [
				{
					title: "Thermal System Concepts",
					content:
						"Thermodynamics tracks energy as heat, work, and internal energy across a defined system boundary. The first law is an accounting rule, but the physical interpretation depends on sign convention, process path, useful output, and irreversibility. Engines, refrigerators, and heat pumps make the bookkeeping concrete."
				},
				{
					title: "Energy Accounting Toolkit",
					content:
						"Begin with a system boundary and an energy-flow diagram. Label heat entering or leaving, work done by or on the system, internal-energy change, and the process being approximated. Only then calculate efficiency, coefficient of performance, or energy balance; otherwise the signs and useful-output claims become guesswork."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from engines, refrigerators, heat pumps, power plants, human bodies, and energy-flow diagrams. For each example, mark the system boundary, heat direction, work direction, internal-energy change, and useful-output definition before comparing efficiency or performance."
				},
				{
					title: "Energy Flow Exercise",
					content:
						"Create an energy-flow diagram, process table, or simplified PV-style sketch for an engine, refrigerator, heat pump, power plant, or biological energy-transfer example. The representation separates total energy accounting from useful output and names the loss or irreversible step."
				},
				{
					title: "Thermal Case Study",
					content:
						"Use a browser simulation, provided data, product specification, or paper design case to compare heat, work, and efficiency. The final explanation states the energy claim, the evidence used, the chosen sign convention, and one reason a real device cannot reach the ideal limit."
				},
				{
					title: "Transfer Practice: Useful Energy",
					content:
						"Transfer the accounting method to a different thermal device and decide what counts as useful output. Explain how the conclusion changes when the goal is heating, cooling, mechanical work, or electrical generation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether heat, work, internal-energy change, system boundary, and useful output are labeled before efficiency is calculated. A strong checkpoint explains the sign convention and why an ideal limit is not the same as a real device."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating heat as stored energy, reversing work signs, claiming lost energy disappeared, and comparing engines or refrigerators without first defining the useful output."
				},
				{
					title: "Extension Project: Engine or Refrigerator Audit",
					content:
						"Audit an engine, refrigerator, heat pump, or power-plant cycle by defining useful output before calculating or comparing efficiency. Include an energy-flow diagram, identify heat and work directions, and explain one unavoidable loss or irreversibility."
				}
			]
		},
		{
			title: "PHY22 Electromagnetic Applications and Signals",
			curriculum: [
				{
					title: "Signal and Sensor Concepts",
					content:
						"Signals are changing physical quantities that become useful only after measurement, calibration, and interpretation. Sensors and transducers convert one kind of physical behavior into another, while noise and filtering shape what can be trusted. The physics question is how the signal relates to the real quantity, not just how to make a graph."
				},
				{
					title: "Signal Reasoning Toolkit",
					content:
						"Identify the measured quantity, transducer mechanism, sampling pattern, calibration method, noise source, and expected signal shape. Compare raw and processed data before drawing conclusions. A useful model states what the sensor can resolve, what it averages away, and what failure mode could produce a misleading signal."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from microphones, speakers, thermistors, accelerometers, RC-style filtering, and noisy time-series graphs. For each example, trace the physical quantity through the transducer, calibration step, signal graph, and interpretation limit."
				},
				{
					title: "Noisy Signal Exercise",
					content:
						"Plot a signal with noise, calibration points, or filtering applied. Explain which features represent the physical quantity and which are measurement artifacts. Compare at least two interpretations, such as raw peak value versus averaged trend or unfiltered noise versus smoothed signal."
				},
				{
					title: "Sensor Case Study",
					content:
						"Use a provided data file, browser simulation, app sensor export, or device-spec case to analyze a signal. The final explanation states the physical quantity, transducer or measurement method, calibration evidence, noise treatment, and one test that would reveal whether the sensor is trustworthy."
				},
				{
					title: "Transfer Practice: Measurement Trust",
					content:
						"Transfer the signal model to a different sensor or physical quantity. Decide what changes about calibration, sampling, noise, and interpretation, then name the evidence needed before the measurement can support a claim."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the measured quantity, transducer, sampling method, calibration evidence, and noise source are identified before interpreting a signal. A strong checkpoint explains which part of the graph is physical and which part may be measurement artifact."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include smoothing away real events, mistaking noise for a signal, trusting an uncalibrated sensor, and forgetting that a transducer can distort the quantity it is supposed to reveal."
				},
				{
					title: "Extension Project: Sensor System Proposal",
					content:
						"Design a sensor-system proposal that names the physical quantity, transducer, calibration method, noise source, and filtering or averaging plan. Include a sample signal sketch and one test that would show whether the sensor is trustworthy."
				}
			]
		},
		{
			title: "PHY23 Relativity and Reference Frames Preview",
			curriculum: [
				{
					title: "Reference Frame Concepts",
					content:
						"Reference frames determine how position, velocity, time, and event order are described. Classical relative velocity works well at everyday speeds, but high-speed or high-precision cases require clearer domain limits and relativistic corrections. The aim is to see why a model can be accurate in one regime and incomplete in another. For each scenario, name the observer, define what that observer measures, and avoid mixing measurements from different frames in the same equation. A good explanation can say both what stays consistent and what changes when the reference frame changes."
				},
				{
					title: "Frame Reasoning Toolkit",
					content:
						"State the observer frame before writing a velocity, time, or distance claim. Use event diagrams, frame labels, and domain notes to prevent accidental mixing of perspectives. When a correction is needed, explain the condition that makes the classical model insufficient rather than treating relativity as a disconnected formula set."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from passenger-car-road frames, high-speed limits, GPS timing, particle examples, and event diagrams. For each example, label the observer frame, event order, classical expectation, correction trigger, and scale where the difference matters."
				},
				{
					title: "Event Diagram Exercise",
					content:
						"Represent a passenger-car-road problem, GPS timing example, particle scenario, or light-signal case with labeled frames and events. The diagram makes clear which observer describes each quantity and where the classical description remains adequate or begins to fail."
				},
				{
					title: "Relativity Case Study",
					content:
						"Use a safe simulation, provided article excerpt, GPS timing example, or particle-physics case to compare classical and frame-aware reasoning. The final explanation states the frame, the quantity being corrected, the evidence or scale that requires the correction, and one limitation of the simplified treatment."
				},
				{
					title: "Transfer Practice: Domain Limits",
					content:
						"Transfer the reference-frame reasoning to a new high-speed or high-precision example. State when the classical model is still useful, when it is not, and what scale of evidence would justify using a relativistic correction."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the observer frame, event labels, velocity claim, and domain limit are stated before applying a correction. A strong checkpoint explains why the classical frame description is adequate or why a relativistic preview is needed."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include mixing quantities from different frames, treating relativity as relevant at every everyday speed, and using a correction formula without naming the physical scale that makes the correction matter."
				},
				{
					title: "Extension Project: Relativity Explainer",
					content:
						"Create a relativity explainer that starts with the classical expectation, then shows why a frame-aware correction is needed. Use an event diagram, timing comparison, or GPS-style example and clearly mark the speed or precision conditions where the correction matters."
				}
			]
		},
		{
			title: "PHY24 Independent Physics Research Portfolio",
			curriculum: [
				{
					title: "Research Portfolio Concepts",
					content:
						"An independent physics portfolio begins with a focused question narrow enough to model and broad enough to matter. Source quality, model choice, evidence, limitations, and revision all shape the final claim. The final product shows how physics reasoning changed the question, not just collect facts about a topic."
				},
				{
					title: "Research Reasoning Toolkit",
					content:
						"Define the system, physical quantities, model type, evidence source, and expected relationship before collecting material. Use formulas, diagrams, or simulations only when they answer the research question directly. Keep a revision log that records why the claim narrowed, changed, or became better supported."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from sports, rockets, music, climate, medicine, robotics, or electronics translated into physics questions. For each example, narrow the broad topic into a modelable question, identify the evidence source, and explain how the physics model supports or limits the claim."
				},
				{
					title: "Portfolio Evidence Exercise",
					content:
						"Create one graph, diagram sequence, calculation table, or source-comparison chart that carries real evidence for the portfolio. The representation makes a physical relationship visible and includes a note about uncertainty, model fit, or a limitation in the available source."
				},
				{
					title: "Independent Case Study",
					content:
						"Use a safe remote-friendly simulation, public dataset, article diagram, video observation, or paper design case tied to the chosen topic. The final explanation states the claim, evidence, model used, and one uncertainty or simplifying assumption that limits the conclusion."
				},
				{
					title: "Transfer Practice: Revising a Claim",
					content:
						"Finish by revising the portfolio claim after reviewing the evidence. State what became more precise, what remains uncertain, which assumption is most fragile, and what additional source or model would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the research question, source quality, physical quantities, model choice, and limitation are explicit before the portfolio is drafted. A strong checkpoint explains how the evidence narrows or revises the original claim."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include choosing a topic too broad to model, collecting interesting facts without a physics question, using an unvetted source as evidence, and hiding uncertainty instead of using it to improve the final claim."
				},
				{
					title: "Extension Project: Independent Physics Portfolio",
					content:
						"Build an independent physics portfolio with a focused question, chosen model, evidence source, graph or diagram, conclusion, and limitation. The final revision shows how the evidence changed the claim or narrowed the scope."
				}
			]
		}
	]
});

interface PhysicsLevel2ModuleFlow {
	stage:
		| "Quantitative core"
		| "Advanced modeling extension"
		| "Independent synthesis";
	estimatedTime: string;
	keyBlocks: string[];
	materialSection: string;
	answerSection: string;
	phenomenon: string;
	corePath: string;
	stretchPath: string;
	evidenceGate: string;
	boundary: string;
	referenceLink: string;
	projectCore: string;
	projectStretch: string;
}

const PHYSICS_LEVEL_2_REFERENCES = {
	projectile:
		"https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion",
	phetProjectile:
		"https://phet.colorado.edu/en/simulations/projectile-motion",
	volume1:
		"https://openstax.org/books/university-physics-volume-1/pages/preface",
	phetForces:
		"https://phet.colorado.edu/en/simulations/forces-and-motion-basics",
	phetCollisions: "https://phet.colorado.edu/en/simulations/collision-lab",
	phetTorque: "https://phet.colorado.edu/en/simulations/balancing-act",
	phetOrbits: "https://phet.colorado.edu/en/simulations/gravity-and-orbits",
	phetCircuits:
		"https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
	volume2:
		"https://openstax.org/books/university-physics-volume-2/pages/1-introduction",
	nistUncertainty: "https://www.nist.gov/pml/nist-technical-note-1297",
	phetCurveFitting: "https://phet.colorado.edu/en/simulations/curve-fitting",
	phetGas: "https://phet.colorado.edu/en/simulations/gas-properties",
	heatEngines:
		"https://openstax.org/books/university-physics-volume-2/pages/4-2-heat-engines",
	phetFaraday:
		"https://phet.colorado.edu/en/simulations/faradays-electromagnetic-lab",
	relativity:
		"https://openstax.org/books/university-physics-volume-3/pages/5-introduction",
	volume3:
		"https://openstax.org/books/university-physics-volume-3/pages/preface"
} as const;

function physicsLevel2Material(section: string) {
	return `/course-assets/physics/physics-level-2-materials-pack.md#${section}`;
}

function physicsLevel2AnswerKey(section: string) {
	return `/course-assets/physics/physics-level-2-rubrics-answer-key.md#${section}`;
}

const PHYSICS_LEVEL_2_FLOW: Record<string, PhysicsLevel2ModuleFlow> = {
	"PHY8 Quantitative Kinematics and Vector Modeling": {
		stage: "Quantitative core",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"coordinate systems",
			"vector components",
			"function representations",
			"projectile motion",
			"relative velocity",
			"model comparison"
		],
		materialSection: "quantitative-kinematics-and-vectors-cases",
		answerSection: "quantitative-kinematics-and-vectors-key",
		phenomenon:
			"Two projectiles launched at complementary angles can have the same ideal range while reaching different heights and spending different times in flight.",
		corePath:
			"Choose axes, resolve vectors, build component equations, compare tables and graphs, calculate an ideal projectile trajectory, and validate the result against supplied simulation evidence.",
		stretchPath:
			"Compare no-drag with drag evidence, solve a relative-velocity route, use parametric or spreadsheet modeling, quantify residuals, and test how coordinate choice changes algebra without changing the physical event.",
		evidenceGate:
			"The setup includes origin, axes, angle convention, vector components, initial conditions, equations, units, predicted values, comparison evidence, and a reasonableness check.",
		boundary:
			"Horizontal and vertical components share time but not identical acceleration. The ideal projectile model neglects drag, spin, curvature, and changing gravitational field; a useful approximation is not a claim that these effects do not exist.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.projectile,
		projectCore:
			"Plan the supplied rescue-drone route with air-relative velocity, environmental velocity, ground velocity, displacement, travel time, and a labeled vector diagram.",
		projectStretch:
			"Compare two routes under changed wind, add uncertainty or a speed constraint, and explain which assumption most affects arrival position."
	},
	"PHY9 Multi-Force Systems and Equilibrium": {
		stage: "Quantitative core",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"system selection",
			"multi-axis free-body diagrams",
			"equilibrium equations",
			"apparent weight",
			"tension",
			"model validation"
		],
		materialSection: "multi-force-and-equilibrium-cases",
		answerSection: "multi-force-and-equilibrium-key",
		phenomenon:
			"One scale reading can be larger or smaller than \(mg\) even though an object's mass remains constant.",
		corePath:
			"Isolate each object, resolve forces by axis, write net-force equations, solve elevator and cable-equilibrium cases, and compare predictions with supplied force data.",
		stretchPath:
			"Analyze a nonuniform or accelerating system, infer an unknown tension or angle, compare subsystem with whole-system diagrams, and test the effect of sensor uncertainty.",
		evidenceGate:
			"Every equation traces to a labeled force on a specific object; component signs, acceleration constraints, units, and scale-reading interpretation remain consistent.",
		boundary:
			"Equilibrium means zero net force and can include constant velocity. Apparent weight is a contact-force measurement, not a change in mass or gravitational interaction.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.volume1,
		projectCore:
			"Audit the supplied tug-of-war system by separating both teams, rope, and ground; identify internal and external interactions and support the acceleration claim with diagrams.",
		projectStretch:
			"Add unequal rope mass or changing contact force, compare two system boundaries, and identify which conservation or Newton-law statement changes."
	},
	"PHY10 Friction, Inclines, and Connected Systems": {
		stage: "Quantitative core",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"incline components",
			"static friction limits",
			"kinetic friction",
			"connected constraints",
			"pulley models",
			"sensitivity analysis"
		],
		materialSection: "friction-inclines-and-connected-systems-cases",
		answerSection: "friction-inclines-and-connected-systems-key",
		phenomenon:
			"A block can remain at rest on a shallow incline because static friction adjusts, then begin sliding after a threshold is crossed.",
		corePath:
			"Choose incline-aligned axes, calculate normal force and parallel gravity components, test static friction against its maximum, and solve a supplied kinetic-friction or two-mass case.",
		stretchPath:
			"Compare massless with massive-pulley assumptions, graph acceleration against angle, estimate a threshold from noisy evidence, and test sensitivity to friction coefficients.",
		evidenceGate:
			"Each solution distinguishes actual static friction from its maximum, names motion state, shows separate object diagrams, states shared constraints, and checks signs and limiting cases.",
		boundary:
			"Static friction is not automatically \(\mu_sN\); it adjusts up to a limit. Normal force need not equal weight, and ideal strings or pulleys are assumptions that can fail.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.phetForces,
		projectCore:
			"Design a ramp that meets a supplied hold-or-accelerate criterion using a free-body diagram, trigonometric components, friction test, and calculation.",
		projectStretch:
			"Optimize angle under a second constraint, compare uncertain coefficients, and state a safe operating range rather than one exact threshold."
	},
	"PHY11 Momentum, Impulse, and Collisions": {
		stage: "Quantitative core",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"system impulse",
			"two-dimensional momentum",
			"center of mass",
			"elasticity",
			"energy comparison",
			"safety design"
		],
		materialSection: "quantitative-momentum-and-collisions-cases",
		answerSection: "quantitative-momentum-and-collisions-key",
		phenomenon:
			"A collision can conserve vector momentum in both axes while changing kinetic energy and producing deformation.",
		corePath:
			"Build signed or component momentum ledgers, calculate impulse from force-time evidence, solve one-dimensional collisions, and compare kinetic energy before and after.",
		stretchPath:
			"Analyze a two-dimensional collision, include an external impulse estimate, calculate center-of-mass motion, and compare uncertainty with apparent momentum mismatch.",
		evidenceGate:
			"The response defines system and interval, preserves vector components and units, checks external impulse, and evaluates momentum and kinetic energy separately.",
		boundary:
			"Momentum conservation depends on system and external impulse; kinetic energy is not conserved in every collision. Impact duration, average force, peak force, and momentum change are related but distinct.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.phetCollisions,
		projectCore:
			"Compare supplied helmet, airbag, or crumple-zone force-time records with impulse, average-force, stopping-time, and momentum-change evidence.",
		projectStretch:
			"Add peak-force and stopping-distance constraints, quantify uncertainty, and recommend a design conditionally across two impact cases."
	},
	"PHY12 Rotational Motion and Torque": {
		stage: "Quantitative core",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"angular kinematics",
			"torque",
			"moment of inertia",
			"rotational dynamics",
			"rolling energy",
			"angular momentum"
		],
		materialSection: "rotational-motion-and-torque-cases",
		answerSection: "rotational-motion-and-torque-key",
		phenomenon:
			"Objects with the same mass and radius can roll differently because their mass distributions create different moments of inertia.",
		corePath:
			"Translate linear and angular quantities, calculate net torque and angular acceleration, compare rotational inertia models, and analyze rotational equilibrium.",
		stretchPath:
			"Combine translation and rotation for rolling motion, use angular momentum in a changing-inertia case, infer an unknown inertia from data, and test bearing-friction effects.",
		evidenceGate:
			"Pivot or axis, torque direction, lever arm, inertia model, angular quantities, energy or momentum account, units, and assumptions all appear.",
		boundary:
			"Moment of inertia depends on mass distribution and chosen axis, not mass alone. Rolling without slipping is a constraint, and rotational equilibrium does not guarantee translational equilibrium.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.phetTorque,
		projectCore:
			"Design a lifting or balancing tool with pivot, load, effort, torque balance, one inertia or stability consideration, and a tradeoff table.",
		projectStretch:
			"Compare two mass distributions or force angles, quantify sensitivity, and add a dynamic or structural constraint absent from the static model."
	},
	"PHY13 Gravitation, Circular Motion, and Orbits": {
		stage: "Quantitative core",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"inward acceleration",
			"universal gravitation",
			"orbital speed",
			"period-radius relations",
			"energy in orbit",
			"model scale"
		],
		materialSection: "gravitation-circular-motion-and-orbits-cases",
		answerSection: "gravitation-circular-motion-and-orbits-key",
		phenomenon:
			"A satellite with nearly constant speed still accelerates continuously because its velocity direction changes.",
		corePath:
			"Draw inward acceleration and force, calculate circular-motion quantities, connect gravitation to orbital speed, and test period-radius or inverse-square patterns with supplied data.",
		stretchPath:
			"Compare orbit energies, estimate an altitude change, model elliptical limitations, distinguish inertial and rotating frames, and perform a scale or sensitivity check.",
		evidenceGate:
			"Central body, orbiting object, radius from center, tangential velocity, inward acceleration, force source, units, and model assumptions remain explicit.",
		boundary:
			"Centripetal force names the inward net-force role rather than an extra interaction. Circular, two-body, and point-mass assumptions narrow where the equations apply.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.phetOrbits,
		projectCore:
			"Plan a supplied orbit with radius, speed, period, force and velocity directions, central-body data, and a scale-honest diagram.",
		projectStretch:
			"Compare two candidate orbits by energy or period, add one operational constraint, and explain which noncircular or multi-body effect could change the result."
	},
	"PHY14 Electricity, Circuits, and Fields": {
		stage: "Quantitative core",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"electric field",
			"electric potential",
			"series-parallel reduction",
			"Kirchhoff reasoning",
			"power",
			"measurement loading"
		],
		materialSection: "electricity-circuits-and-fields-cases",
		answerSection: "electricity-circuits-and-fields-key",
		phenomenon:
			"Two circuit points can share potential while carrying different branch currents, and a measuring device can alter the circuit it is intended to observe.",
		corePath:
			"Relate field and potential qualitatively, reduce series-parallel networks, apply junction and loop reasoning, calculate power, and compare predictions with supplied current-voltage evidence.",
		stretchPath:
			"Analyze an internal-resistance or meter-loading case, solve a two-loop network, compare energy-per-charge and charge-flow views, and diagnose uncertainty or non-ohmic behavior.",
		evidenceGate:
			"Schematic topology, node labels, current directions, loop signs, values, units, power or energy check, and measurement assumptions all agree.",
		boundary:
			"Potential is energy per charge rather than current pressure in a literal fluid. Ideal wires, sources, meters, and ohmic resistors are model choices, not universal component behavior.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.phetCircuits,
		projectCore:
			"Audit the supplied circuit against current, voltage, power, independent-control, and failure-isolation criteria with a labeled schematic and calculation table.",
		projectStretch:
			"Add internal resistance or meter loading, compare two redesigns, and state a bounded operating range or failure threshold."
	},
	"PHY15 Thermal Physics, Optics, and Modern Bridges": {
		stage: "Quantitative core",
		estimatedTime: "5–6 sessions",
		keyBlocks: [
			"thermal energy transfer",
			"heating and phase curves",
			"optical imaging",
			"model transitions",
			"threshold evidence",
			"domain limits"
		],
		materialSection: "thermal-optics-and-modern-bridges-cases",
		answerSection: "thermal-optics-and-modern-bridges-key",
		phenomenon:
			"One course module can use different models—thermal accounts, rays, and quantized thresholds—without treating them as interchangeable descriptions.",
		corePath:
			"Analyze one thermal dataset, one lens or mirror case, and one model-limit evidence case; select the correct representation and state why each model fits its phenomenon.",
		stretchPath:
			"Quantify a heating slope or phase interval, compare predicted and measured image locations, evaluate a threshold trend, and explain where each classical approximation stops being enough.",
		evidenceGate:
			"Each mini-study names its system, quantities, representation, calculation, evidence, and domain rather than combining unrelated equations into one answer.",
		boundary:
			"Heat, temperature, and internal energy are distinct; rays are geometric models; modern evidence refines classical domains rather than making all classical reasoning invalid.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.volume2,
		projectCore:
			"Complete the supplied thermal-design comparison with energy-transfer evidence, one quantitative model, criteria, and a stated limitation.",
		projectStretch:
			"Add an optics or threshold-based sensing component, test a changed condition, and keep the models linked through a clear system interface rather than blended vocabulary."
	},
	"PHY16 Engineering Physics Capstone": {
		stage: "Quantitative core",
		estimatedTime: "6–8 sessions",
		keyBlocks: [
			"problem framing",
			"model selection",
			"quantitative evidence",
			"validation",
			"criteria and constraints",
			"revision and defense"
		],
		materialSection: "engineering-physics-capstone-cases",
		answerSection: "engineering-physics-capstone-key",
		phenomenon:
			"A model can produce a precise prediction and still be unsuitable when its assumptions, operating range, or decision criteria do not match the engineering problem.",
		corePath:
			"Choose one supplied quantitative design case, define system and criteria, select a model, calculate a prediction, compare with evidence, document uncertainty, compare options, revise, and defend.",
		stretchPath:
			"Couple two models, perform sensitivity or residual analysis, compare alternate explanations, optimize under competing constraints, and identify a reversal threshold.",
		evidenceGate:
			"The capstone includes raw evidence, equations, units, labeled representation, validation check, criteria, constraints, tradeoffs, model limit, substantive revision, and accessible defense.",
		boundary:
			"This capstone completes the Level 2 quantitative core. Later modules extend numerical, experimental, continuum, thermodynamic, signal, and relativity reasoning; they are not hidden prerequisites for this milestone.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.volume1,
		projectCore:
			"Complete one supplied modeling challenge with question, system, model, evidence, calculation, comparison, uncertainty, limitation, and documented revision.",
		projectStretch:
			"Integrate a second model or dataset, quantify sensitivity, optimize a tradeoff, and defend what new evidence would reverse the design choice."
	},
	"PHY17 Numerical Modeling and Simulation Checks": {
		stage: "Advanced modeling extension",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"state variables",
			"update rules",
			"initial conditions",
			"time steps",
			"convergence checks",
			"analytic comparison"
		],
		materialSection: "numerical-modeling-and-simulation-cases",
		answerSection: "numerical-modeling-and-simulation-key",
		phenomenon:
			"Two simulations using the same physical law can diverge because their time steps and update methods create different numerical error.",
		corePath:
			"Define state, initial conditions, update rule, and step size; run or inspect supplied Euler tables; compare with an analytic baseline; and identify numerical error.",
		stretchPath:
			"Perform a step-halving convergence study, compare Euler with a midpoint or energy-aware method, identify instability, and separate numerical artifacts from model inadequacy.",
		evidenceGate:
			"Code or spreadsheet output is accompanied by equations, units, initial conditions, step size, method, comparison baseline, error metric, and convergence evidence.",
		boundary:
			"Simulation output is not automatically physical truth. Smaller steps often reduce discretization error but do not fix a wrong model, wrong units, coding error, or unstable method without verification.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.volume1,
		projectCore:
			"Compare two supplied motion simulations against an analytic baseline with error-through-time and step-size evidence.",
		projectStretch:
			"Implement or analyze a second method, run a convergence test, and explain whether the remaining discrepancy is numerical, physical, or evidentiary."
	},
	"PHY18 Experimental Uncertainty and Curve Fitting": {
		stage: "Advanced modeling extension",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"measurands",
			"random and systematic effects",
			"best-fit models",
			"residuals",
			"parameter uncertainty",
			"evidence strength"
		],
		materialSection: "uncertainty-and-curve-fitting-cases",
		answerSection: "uncertainty-and-curve-fitting-key",
		phenomenon:
			"A best-fit line can be useful without passing through every point, while a visually close fit can still hide patterned residuals and model failure.",
		corePath:
			"Define the measurand, preserve raw data, graph points, estimate a best-fit relationship, calculate residuals, and separate scatter from possible systematic bias.",
		stretchPath:
			"Compare linear and curved models, estimate parameter uncertainty or sensitivity, evaluate an outlier rule before exclusion, and use residual structure to revise the model.",
		evidenceGate:
			"Source, units, raw values, fit equation, parameter meaning, residuals, uncertainty statement, exclusion rule, and claim scope remain visible.",
		boundary:
			"Uncertainty is not the same as mistake, fit quality is not proved by a high visual resemblance alone, and deleting points after seeing the result requires a defensible predeclared reason.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.nistUncertainty,
		projectCore:
			"Audit the supplied measurement study with raw-data preservation, graph, fit, residuals, slope meaning, uncertainty components, and a bounded conclusion.",
		projectStretch:
			"Compare a second model, quantify parameter sensitivity, evaluate one outlier under a declared rule, and state what evidence would favor the alternative."
	},
	"PHY19 Coupled Systems and Constraints": {
		stage: "Advanced modeling extension",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"multiple free-body diagrams",
			"constraint equations",
			"shared accelerations",
			"tension assumptions",
			"whole-system checks",
			"model alternatives"
		],
		materialSection: "coupled-systems-and-constraints-cases",
		answerSection: "coupled-systems-and-constraints-key",
		phenomenon:
			"Connected objects can share acceleration magnitude while experiencing different net forces, and tension can differ when a pulley or rope has nonnegligible inertia.",
		corePath:
			"Draw separate object diagrams, define coordinates, write force equations and a geometric constraint, solve a supplied connected-mass system, and verify with a whole-system equation.",
		stretchPath:
			"Add pulley inertia, a moving support, or multiple rope segments; derive the changed constraint; compare tensions; and test a limiting case.",
		evidenceGate:
			"Every shared quantity follows from a stated physical or geometric constraint, not from visual similarity. Subsystem and whole-system equations produce a consistent result.",
		boundary:
			"Connected does not automatically mean equal tension or equal acceleration vectors. Massless rope, frictionless pulley, no slip, and fixed support are assumptions with specific consequences.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.volume1,
		projectCore:
			"Create a constraint map for the supplied connected system with object diagrams, coordinates, rope-length relation, equations, and a verified solution.",
		projectStretch:
			"Change one connection or inertia assumption, derive the new constraint, compare predictions, and identify which earlier equality no longer holds."
	},
	"PHY20 Fluids and Continuum Models": {
		stage: "Advanced modeling extension",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"continuum assumption",
			"pressure fields",
			"continuity",
			"Bernoulli energy",
			"viscosity and loss",
			"model domain"
		],
		materialSection: "fluids-and-continuum-models-cases",
		answerSection: "fluids-and-continuum-models-key",
		phenomenon:
			"Flow speed can increase through a narrower section while measured pressure decreases under a restricted steady-flow model.",
		corePath:
			"Use pressure, density, area, and flow-speed data; apply continuity; evaluate a Bernoulli-style energy account; and compare predictions with supplied pressure evidence.",
		stretchPath:
			"Estimate head loss, compare ideal and viscous records, analyze a branching flow, and state where compressibility, turbulence, or particle scale breaks the continuum model.",
		evidenceGate:
			"Flow direction, control volume, areas, speeds, elevations, pressures, density, units, and assumptions are all named before using a relation.",
		boundary:
			"Bernoulli reasoning is not a universal pressure shortcut. Steady, incompressible, low-loss flow along an applicable streamline is a model domain, and continuum descriptions fail at sufficiently small scales.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.phetGas,
		projectCore:
			"Analyze the supplied fluid system with a control volume, continuity table, pressure or energy comparison, and one model-domain limitation.",
		projectStretch:
			"Compare ideal with loss-inclusive evidence, quantify one discrepancy, and recommend a design only within a stated flow regime."
	},
	"PHY21 Thermodynamics and Engines": {
		stage: "Advanced modeling extension",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"state variables",
			"first-law accounting",
			"process diagrams",
			"heat reservoirs",
			"engine efficiency",
			"second-law limits"
		],
		materialSection: "thermodynamics-and-engines-cases",
		answerSection: "thermodynamics-and-engines-key",
		phenomenon:
			"An engine can conserve energy while still being unable to convert all incoming thermal transfer into useful work.",
		corePath:
			"Define a thermodynamic system and sign convention, track heat, work, and internal-energy change, read a process diagram, and calculate engine efficiency or refrigerator performance.",
		stretchPath:
			"Compare cycles, calculate a reversible upper bound, identify irreversibility, test a reservoir-temperature change, and distinguish rate, energy, efficiency, and coefficient of performance.",
		evidenceGate:
			"System, process direction, state variables, reservoirs, sign convention, energy terms, units, and efficiency denominator remain explicit.",
		boundary:
			"The first law constrains energy accounting; the second law constrains direction and achievable conversion. Efficiency and coefficient of performance use different definitions and can have different numerical ranges.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.heatEngines,
		projectCore:
			"Audit the supplied engine or refrigerator with an energy-flow diagram, first-law account, efficiency or performance calculation, and one irreversibility.",
		projectStretch:
			"Compare a second cycle or reservoir condition, estimate a theoretical upper bound, and explain why the real device remains below it."
	},
	"PHY22 Electromagnetic Applications and Signals": {
		stage: "Advanced modeling extension",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"field-to-signal conversion",
			"calibration",
			"sampling",
			"noise",
			"filter tradeoffs",
			"sensor validation"
		],
		materialSection: "electromagnetic-signals-and-sensors-cases",
		answerSection: "electromagnetic-signals-and-sensors-key",
		phenomenon:
			"A sensor can be precise but biased, and a smoother filtered signal can look more convincing while hiding rapid physical changes.",
		corePath:
			"Trace physical input to electrical signal, build a calibration relation, convert voltage to a measured quantity, inspect noisy time-series data, and validate against reference points.",
		stretchPath:
			"Compare filters, sampling rates, bandwidth, saturation, hysteresis, and uncertainty; diagnose aliasing or drift; and design a bounded calibration schedule.",
		evidenceGate:
			"Measurand, sensor input, raw signal, units, calibration equation, reference values, residuals, sampling details, and uncertainty remain traceable.",
		boundary:
			"A sensor reading is an estimate produced by a measurement chain. Filtering cannot recover information never sampled, and a smooth display does not prove accuracy.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.phetFaraday,
		projectCore:
			"Propose a supplied sensor system with measurand, transduction path, calibration table, operating range, sampling plan, and validation check.",
		projectStretch:
			"Compare two filters or sampling choices, quantify drift or residual error, and define a recalibration or failure threshold."
	},
	"PHY23 Relativity and Reference Frames Preview": {
		stage: "Advanced modeling extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"inertial frames",
			"events",
			"simultaneity",
			"time dilation",
			"low-speed limits",
			"invariant relationships"
		],
		materialSection: "relativity-and-reference-frames-cases",
		answerSection: "relativity-and-reference-frames-key",
		phenomenon:
			"Observers in relative motion can assign different time intervals or simultaneity judgments while describing the same physical events under consistent transformation rules.",
		corePath:
			"Name frames and events, compare classical frame descriptions, calculate a Lorentz factor for supplied speeds, and identify proper-time or simultaneity conditions.",
		stretchPath:
			"Analyze an event diagram, compare low- and high-speed limits, calculate time dilation, and explain which measured quantities differ and which physical relationships remain consistent.",
		evidenceGate:
			"Observer, frame, event coordinates, relative speed, measured quantity, equation, units, and low-speed comparison are stated.",
		boundary:
			"Relativity is not mere perception and does not mean every claim is equally true. Ordinary-speed classical approximations remain accurate because relativistic corrections are tiny in that domain.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.relativity,
		projectCore:
			"Create a relativity explainer using the supplied observer and event case, one Lorentz-factor calculation, a low-speed comparison, and a model boundary.",
		projectStretch:
			"Add a spacetime-style event diagram or second observer, compare invariant and frame-dependent quantities, and correct one simultaneity misconception."
	},
	"PHY24 Independent Physics Research Portfolio": {
		stage: "Independent synthesis",
		estimatedTime: "7–10 sessions",
		keyBlocks: [
			"researchable questions",
			"source quality",
			"model selection",
			"quantitative evidence",
			"uncertainty and alternatives",
			"revision and defense"
		],
		materialSection: "independent-physics-portfolio-cases",
		answerSection: "independent-physics-portfolio-key",
		phenomenon:
			"A strong research portfolio becomes more credible when evidence narrows the original claim, exposes a model limit, or motivates a substantive revision.",
		corePath:
			"Select one approved supplied research seed, narrow the question, document sources, choose a model, analyze quantitative evidence, compare an alternative, state uncertainty, revise, and defend.",
		stretchPath:
			"Combine multiple evidence forms, reproduce or challenge a result, compare models, perform sensitivity analysis, and define a concrete result that would reverse or further narrow the conclusion.",
		evidenceGate:
			"The portfolio contains a research log, source evaluation, raw or supplied evidence, reproducible calculation, labeled representation, model and domain, uncertainty, alternative, revision history, and accessible defense.",
		boundary:
			"The portfolio is an instructional research synthesis, not original peer-reviewed proof or professional certification. Claims remain proportional to source quality, evidence range, model assumptions, and replication limits.",
		referenceLink: PHYSICS_LEVEL_2_REFERENCES.volume3,
		projectCore:
			"Build the independent portfolio around one focused question, source set, model, dataset, calculation, representation, conclusion, limitation, and documented revision.",
		projectStretch:
			"Reproduce or compare a second result, quantify sensitivity, evaluate an alternate model, and defend a reversal criterion plus next evidence step."
	}
};

function physicsLevel2Topic(moduleTitle: string) {
	return moduleTitle.replace(/^PHY\d+\s+/u, "").trim();
}

function physicsLevel2Title(moduleTitle: string, itemTitle: string) {
	return itemTitle === "Worked Example Set"
		? `${physicsLevel2Topic(moduleTitle)}: Worked Cases`
		: itemTitle;
}

function physicsLevel2CurriculumPath(
	stage: PhysicsLevel2ModuleFlow["stage"]
): RawCourseModuleItem["learningPath"] {
	return stage === "Advanced modeling extension" ? "choice" : "core";
}

function physicsLevel2ProjectPath(
	title: string
): RawCourseModuleItem["learningPath"] {
	if (/Readiness Check$/i.test(title)) return "core";
	if (/Failure Modes$/i.test(title)) return "choice";
	return "challenge";
}

function physicsLevel2ProjectCompletion(
	title: string,
	flow: PhysicsLevel2ModuleFlow
) {
	if (/Readiness Check$/i.test(title)) {
		return "Core: complete the supplied readiness cases with diagrams, equations, units, and one exact evidence point per conclusion. Stretch: quantify one sensitivity or alternate interpretation and state the assumption or measurement that controls confidence.";
	}

	if (/Failure Modes$/i.test(title)) {
		return "Core: repair at least three supplied errors and explain the physical consequence of each correction. Stretch: connect each misconception to a calculation, residual, diagram, constraint, or limiting case and create one transfer example.";
	}

	return `Core: ${flow.projectCore} Stretch: ${flow.projectStretch}`;
}

export const physicsLevel2Course: RawCourse = {
	...physicsLevel2SourceCourse,
	modules: physicsLevel2SourceCourse.modules.map((module, moduleIndex) => {
		const flow = PHYSICS_LEVEL_2_FLOW[module.title];
		if (!flow) {
			throw new Error(
				`Missing Physics Level 2 flow for ${module.title}.`
			);
		}

		const curriculum = module.curriculum.map((item, itemIndex) => ({
			...item,
			title: physicsLevel2Title(module.title, item.title),
			content: [
				itemIndex === 0
					? `**Teaching flow:** ${flow.stage}. Physics Level 2 is the quantitative continuation after Intro to Physics. Intro modules with similar PHY numbers are optional survey previews; this course's PHY8–PHY16 sequence rebuilds those ideas with algebra, trigonometry, multiple representations, validation, and uncertainty. No physical apparatus, personal-device data, home electrical work, projectiles, heat sources, or learner household measurements are required.`
					: "",
				item.content,
				`**Guiding phenomenon:** ${flow.phenomenon}`,
				`**Core route:** ${flow.corePath}`,
				`**Stretch route:** ${flow.stretchPath}`,
				`**Quantitative evidence gate:** ${flow.evidenceGate}`,
				`**Model domain and limit:** ${flow.boundary}`,
				`**Reference:** [Open the authoritative module reference](${flow.referenceLink}).`
			]
				.filter(Boolean)
				.join("\n\n"),
			learningPath: physicsLevel2CurriculumPath(flow.stage),
			datasetLink:
				item.datasetLink ?? physicsLevel2Material(flow.materialSection),
			solutionLink:
				item.solutionLink ?? physicsLevel2AnswerKey(flow.answerSection),
			projectLink: item.projectLink ?? flow.referenceLink
		}));

		const supplementalProjects = module.supplementalProjects.map(item => ({
			...item,
			content: [
				item.content,
				`**Course stage:** ${flow.stage}.`,
				`**Guiding phenomenon:** ${flow.phenomenon}`,
				`**Completion route:** ${physicsLevel2ProjectCompletion(item.title, flow)}`,
				`**Quantitative evidence gate:** ${flow.evidenceGate}`,
				`**Model domain and limit:** ${flow.boundary}`
			].join("\n\n"),
			learningPath: physicsLevel2ProjectPath(item.title),
			datasetLink:
				item.datasetLink ?? physicsLevel2Material(flow.materialSection),
			solutionLink:
				item.solutionLink ?? physicsLevel2AnswerKey(flow.answerSection),
			projectLink: item.projectLink ?? flow.referenceLink
		}));

		return {
			...module,
			estimatedTime: flow.estimatedTime,
			keyBlocks: flow.keyBlocks,
			curriculum,
			supplementalProjects,
			aliases:
				moduleIndex === 0
					? [
							...(module.aliases ?? []),
							"Physics Level 2 quantitative starting point"
						]
					: module.aliases
		};
	}),
	developmentMetadata: {
		priority: "soon",
		standards: [
			"Algebra- and trigonometry-based quantitative physics with explicit coordinate, system, and unit conventions",
			"Mechanics, rotation, gravitation, circuits and fields, thermal and optical bridges, fluids, thermodynamics, signals, and relativity previews",
			"Numerical verification, curve fitting, residual analysis, measurement uncertainty, and model-domain reasoning",
			"Evidence practices across vector diagrams, free-body diagrams, energy and momentum ledgers, process diagrams, circuits, field and signal plots, and simulation tables",
			"Engineering criteria, constraints, uncertainty, sensitivity, validation, tradeoff analysis, revision, and defense"
		],
		sourcePolicy:
			"Preserves all 17 modules and 51 named checkpoints, failure-mode studies, and projects while defining PHY8–PHY16 as the quantitative core, PHY17–PHY23 as advanced modeling extensions, and PHY24 as independent synthesis. Every route uses a supplied local quantitative case, answer and rubric material, and a verified public reference.",
		assessmentCadence: [
			"Coordinate, system, sign, units, and assumptions before equation selection",
			"Prediction plus a unit-aware diagram, table, graph, or computational representation",
			"Calculation trail with dimensional, limiting-case, analytic, or residual check",
			"One bounded quantitative claim and one model-domain limitation",
			"One core route plus an optional sensitivity, uncertainty, or alternate-model stretch route",
			"Substantive revision after evidence or rubric feedback at both capstone milestones"
		],
		toolchain: [
			"Notebook, paper, spreadsheet, graphing tool, or optional local Python environment",
			"Supplied Physics Level 2 materials pack and rubrics answer key",
			"Shared quantitative tables, diagrams, residual records, simulation traces, and design cases",
			"OpenStax University Physics, NIST uncertainty guidance, and verified PhET simulations",
			"Optional interactive or coded model with a supplied noninteractive table and analytic comparison route"
		],
		safetyPolicy: [
			"No required projectiles, collisions, elevated masses, pulley builds, home circuits, heat sources, optical exposure, pressure apparatus, magnets, engines, or physical sensors",
			"No required learner reaction-time, location, household-energy, body, device, camera, microphone, or personal measurement data",
			"Supplied fictional cases and quantitative datasets remain sufficient for every assessment",
			"Graphs, field diagrams, and signals include labels and text descriptions; audio and color always have non-audio and non-color encodings",
			"Engineering, sensor, impact, thermal, electrical, and fluid conclusions remain educational models rather than professional certification"
		],
		courseBoundaries: [
			"Intro to Physics supplies conceptual and algebra readiness; similarly numbered Intro extension modules are optional surveys, not duplicate prerequisites",
			"PHY8–PHY16 form a complete Level 2 quantitative core ending in the Engineering Physics Capstone",
			"PHY17–PHY23 extend numerical, uncertainty, constraint, continuum, thermodynamic, signal, and relativity reasoning",
			"PHY24 is independent synthesis and can draw from any completed core plus selected advanced extensions",
			"Every quantitative model states system, coordinates, initial and boundary conditions, units, assumptions, validation evidence, and operating domain"
		],
		capstoneExpectations: [
			"Focused quantitative question or design problem grounded in an approved supplied case",
			"Traceable source record, preserved values, units, and uncertainty",
			"Diagram or computational representation plus reproducible calculation and validation check",
			"Criteria, constraints, alternatives, and sensitivity or tradeoff analysis",
			"Bounded claim with model domain, limitation, and reversal condition",
			"Before-and-after revision plus accessible technical defense"
		],
		recommendedNextWork: [
			"Add anonymized exemplars at several algebra, coding, and communication levels after classroom use identifies priority modules.",
			"Archive selected simulation states and traces as locally owned tables and images so external tools never become continuity requirements.",
			"Map the quantitative core and advanced extensions to the target district, honors, or first-semester college sequence after that adoption context is selected."
		]
	}
};
