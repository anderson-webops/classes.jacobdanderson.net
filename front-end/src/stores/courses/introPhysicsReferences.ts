import type { RawCourse } from "./types";

const referenceText: Record<string, Record<string, string>> = {
	"Standards Map": {
		"Intro to Physics Reference Guide":
			"[NIST SI units](https://www.nist.gov/pml/owm/metric-si/si-units) defines the units used in calculations. [OpenStax Physics](https://openstax.org/details/books/physics) provides optional textbook explanations. [NGSS appendices](https://www.nextgenscience.org/resources/ngss-appendices) provide standards background on scientific practices and crosscutting concepts.\n\nThe local [materials pack](/course-assets/physics/intro-physics-materials-pack.md) supplies the cases used throughout the course. PhET simulations are optional ways to explore the same models.",
		"Intro to Physics Core Skills":
			"The foundation uses arithmetic with decimals and fractions, ratios, unit conversion, substitution into a one-variable equation and reading a graph's axes. A slope is change in the vertical quantity divided by change in the horizontal quantity.\n\nFor example, 240 cm = 2.40 m, and 12 m in 10 s gives 1.2 m/s. A graph rising by 6 m over 3 s has slope 2 m/s. A negative velocity describes the chosen direction; it does not imply negative distance travelled. PHY1 and PHY2 introduce these representations before force and energy calculations.",
		"Intro to Physics Next Topics":
			"PHY8–PHY16 extend the foundation into momentum, torque, fluids, thermal physics, optics, electromagnetism, oscillation, orbits and model limits. They are optional extensions before the final synthesis.\n\n[Physics Level 2](/courses?course=physics-level-2) follows this introductory course with quantitative vector models, multi-step algebra, numerical modeling and uncertainty analysis. Algebra and basic trigonometry support that next course; calculus is not a hidden prerequisite for this foundation.",
		"Intro to Physics Boundaries":
			"PHY1–PHY7 form the introductory foundation and its first capstone. PHY8–PHY16 are guided extensions; PHY17 is a final portfolio using completed topics.\n\nThe models use supplied fictional data, diagrams and idealized systems. Real-device predictions need the omitted conditions and uncertainties. Required work uses paper or digital notes and the supplied cases; physical experiments, household electricity, recordings and personal measurements are not required.",
		"Intro to Physics Prerequisite Check":
			"A short self-check for the foundation:\n\n1. Convert 250 cm to metres.\n2. Calculate the average speed for 18 m in 15 s.\n3. Interpret a horizontal position-time graph.\n4. Distinguish mass in kilograms from weight in newtons.\n\nWorked checks: 250 cm × 1 m/100 cm = 2.50 m; 18/15 = 1.2 m/s; horizontal position means rest during that interval; weight is a gravitational force, W = mg, while mass measures inertia. These examples identify a useful starting review in PHY1–PHY3.",
		"Intro to Physics Pathway Map":
			"- PHY1 units, uncertainty and graphs → PHY2 motion representations.\n- PHY2 velocity and acceleration → PHY3 net force and PHY4 energy.\n- PHY4 energy transfer → PHY5 electrical energy and PHY6 wave energy.\n- PHY1–PHY6 evidence and model limits → PHY7 capstone.\n- PHY8–PHY16 completed extensions → optional additional evidence for PHY17.\n\nMomentum builds on signed velocity and system boundaries. Torque builds on forces and geometry. Oscillation combines restoring forces with energy. These dependencies explain why extension topics can be selected without requiring every later module before the first capstone."
	},
	"Course Roadmap": {
		"Intro to Physics Follow-Up Path":
			"After the PHY7 capstone, choose an extension that fits the question: collision or impact → PHY8; turning effect → PHY9; floating → PHY10; temperature change → PHY11; image formation → PHY12; induction → PHY13; periodic response → PHY14; orbital motion → PHY15; classical model limits → PHY16.\n\nPHY17 combines a completed thread into a defended portfolio. Physics Level 2 is the next quantitative course, with algebraic and vector reasoning applied to more complex systems.",
		"Intro to Physics Resource Map":
			"The [materials pack](/course-assets/physics/intro-physics-materials-pack.md) contains raw tables, diagrams described in words, case choices and portfolio criteria. The [answer and rubric pack](/course-assets/physics/intro-physics-rubrics-answer-key.md) contains worked values, model limits and assessment dimensions.\n\nThe lesson readings define the quantities and show worked examples. Optional PhET models supply another representation of those relationships. None of these investigations requires code, an IDE installation or a physical equipment kit.",
		"Intro to Physics Module Alignment Guide":
			"| Topic group | Evidence | Main interpretation |\n| --- | --- | --- |\n| PHY1–PHY2 measurement and motion | repeated trials, position and velocity tables | resolution, slope, signed area |\n| PHY3–PHY4 forces and energy | cart, elevator and track cases | net force, acceleration, energy transfer |\n| PHY5–PHY6 circuits and waves | topology, current-voltage and waveform tables | complete paths, proportionality, period |\n| PHY8–PHY11 interactions and materials | collision, lever, hull and thermal tables | conservation, turning effect, force balance, heat transfer |\n| PHY12–PHY16 fields and model limits | rays, induced signals, response curves, orbit and spectrum tables | image location, change, resonance, scaling, threshold |\n| PHY7 and PHY17 synthesis | selected evidence and revision | a bounded claim defended by a model |",
		"Intro to Physics Reference Map":
			"The local case sections follow module order: measurement, motion, forces, energy, circuits, waves, first capstone, momentum, torque, fluids, thermal physics, optics, induction, oscillation, orbits, modern physics and final portfolio.\n\nQuantities and units come from NIST; textbook explanations from OpenStax; optional interactive models from PhET; orbit context from NASA. The supplied tables and answer pack remain sufficient when an external reference is unavailable.",
		"Intro to Physics Prerequisite Map":
			"For a collision question, review PHY2 signed velocity, PHY3 external forces and PHY4 kinetic energy before PHY8 momentum. For an induction question, review PHY5 current/voltage and PHY4 energy before PHY13. For resonance, review PHY6 period/frequency and PHY4 energy before PHY14.\n\nFor each selected route, the earlier worked cases supply the necessary quantity definitions. The final portfolio can stay within the foundation when the advanced prerequisites are unfamiliar.",
		"Intro to Physics Resource Inventory":
			"The local evidence consists of 17 module case sections and 17 corresponding answer/rubric sections. Notes, a calculator and a graph or diagram on paper or in a digital document are sufficient.\n\nThe inputs include walking and motion tables, force/energy cases, ideal circuit cards, waveforms, collision and torque data, hull and cooling comparisons, lens cases, induced-voltage tables, resonance curves, planetary data and spectra. No starter program or source-code import is required for these evidence routes."
	},
	"Project Practice Guide": {
		"Intro to Physics Project Ladder":
			"Begin with one representation and a short explanation: a motion graph, free-body diagram, energy account, circuit sketch or waveform reading. Next compare two conditions from the same case and state the model limit.\n\nPHY7 combines a focused question, supplied data, calculation, representation and revised claim. PHY17 adds a two-option or two-model comparison and a defense of what would change the conclusion. The practice projects below are optional alternative applications of those same skills.",
		"Intro to Physics Checkpoints":
			"A useful physics check explains a value and its meaning together. Examples from the foundation:\n\n- A 6 m position change in 3 s gives average velocity 2 m/s.\n- A 10 N net force on 4 kg gives acceleration 2.5 m/s².\n- Two 6 Ω resistors in parallel across 12 V each carry 2 A.\n- A 2 Hz wave has period 0.5 s.\n\nUnits and signs are part of the answer. A numerical result without a system, interval or circuit topology can answer a different question.",
		"Intro to Physics Rubric":
			"The shared rubric scores six dimensions from 0 to 3: system and quantities; representation; calculation; evidence claim; model honesty; revision or transfer. The maximum is 18.\n\nThe final portfolio adds criteria/tradeoffs and defense/accessibility, also scored 0–3, for 24 points. The [complete rubric](/course-assets/physics/intro-physics-rubrics-answer-key.md#shared-scoring-language) defines the performance levels. A correct value and a supported explanation are related but separately reviewable evidence.",
		"Intro to Physics Capstone Gate":
			"The PHY7 capstone uses one supplied foundation case with a focused question, independent/dependent variables, a labeled graph or diagram, a calculation, a claim, a limitation and a substantive revision.\n\nThe PHY17 portfolio additionally compares two options or models and identifies the evidence or failed criterion that would reverse its recommendation. The [portfolio record](/course-assets/physics/intro-physics-materials-pack.md#required-portfolio-record) lists the ten required components. Presentation polish does not replace raw data, units or the reasoning chain.",
		"Practice Project: Motion Graph Analysis From Provided Data":
			"Use the piecewise position-time table in the Motion Graphs and Kinematics Cases. Draw a position-time graph, calculate signed velocity for each interval and build the matching velocity-time graph.\n\nReport total displacement and total distance separately. Identify a stopped interval and a reversal, citing exact times. Check that signed velocity-time area gives the same displacement as final minus initial position. For an extension, describe a different motion that has the same final displacement but a different total distance.",
		"Practice Project: Free-body Diagram Portfolio":
			"Use the supplied elevator cases for a 60 kg rider with upward positive and g = 9.8 m/s². Draw separate rider diagrams for support forces of 720 N, 588 N and 480 N. Label the force sources and calculate net force and acceleration.\n\nExplain why motion direction cannot be determined from acceleration alone, and why the rider's weight is not a Newton's-third-law pair with the support force. Add a fourth case with a chosen support force and check units and signs. The Forces Key supplies the three original calculations.",
		"Practice Project: Energy Skate Park Simulation Report":
			"Use the supplied coaster height-speed-friction table, with the optional Energy Skate Park simulation as a second view. For each recorded state, compute gravitational and kinetic energy using the stated mass and g.\n\nGraph or tabulate total mechanical energy and identify where it decreases. Account for the decrease as a transfer rather than destroyed energy. Compare the rough-track result with the ideal no-friction prediction. State the height reference and what the model omits; a supplied-data report is complete without running the simulation.",
		"Practice Project: Circuit Simulation Challenge":
			"Analyze Series S, Parallel P, Open O, Branch-open B and Bypass R from the Circuits Cases. Draw each topology and identify the complete paths before calculating equivalent resistance and source current.\n\nFor Bypass R, explain why the bypassed resistor carries no current while the remaining resistor limits source current to 2 A. Compare opening a parallel branch with opening the single series path. Use the Circuits Key to check the values and distinguish this finite-current bypass from a direct ideal-source short. A paper diagram or simulator can represent the same cases.",
		"Practice Project: Wave Interference Simulation":
			"In a linear wave model, displacement at a point is the signed sum of the displacements of overlapping waves there. Equal frequencies with matching phase can reinforce; opposite phase can cancel at that point. This is superposition, not disappearance of all wave energy.\n\nUse the Interference Phase Cards in the Waves Cases to calculate the total displacement at each supplied time for matching and opposite phase. Sketch both total-displacement graphs, report their amplitudes and explain why one is flat at the chosen point. A table-based model is sufficient; a simulation is optional. State the equal-frequency, equal-amplitude and linear-response assumptions.",
		"Practice Project: Safety-feature Design Using Energy and Momentum":
			"Use the Momentum Cases force-time table and impact-design comparison. Find impulse from graph area and calculate average force over the stated stopping interval. Compare two stopping times for the same momentum change.\n\nRecommend a design using a stated stopping-distance or added-mass constraint. Distinguish average from peak force, and identify which extra measurement would be needed to make a peak-force claim. Include one calculation, a before/after momentum diagram and a limitation. The Momentum Key provides the supplied-case values; the recommendation remains conditional on the selected constraint."
	},
	"Digital Resource Bank": {
		"Curated Digital Resource Bank":
			"The local materials and answer packs provide all required tables and cases. Optional [PhET physics models](https://phet.colorado.edu/en/simulations/filter?subjects=physics) illustrate motion, forces, energy, circuits, waves, collisions, torque, density, thermal transfer, optics, induction and oscillation.\n\n[NASA's orbit explanation](https://science.nasa.gov/solar-system/orbits-and-keplers-laws/) supplies astronomical context. These references extend the local evidence and do not replace the case inputs.",
		"Module-by-Module Resource Mapping Routine":
			"- Measurement/motion: compare quantities, units, resolution, slope and area.\n- Forces/energy: isolate the object or system before choosing an equation.\n- Circuits/waves: label topology or axes before reading current, period or wavelength.\n- Extension topics: identify the supplied table, diagram or model and its limiting assumption.\n- Synthesis: retain the original values alongside calculations and the revised claim.\n\nThe local case-section order matches PHY1–PHY17; each module links its own section.",
		"Online Safety and Accessibility Check":
			"Required investigations use supplied diagrams, descriptions and fictional tables. They require no household electricity, dropped objects, heat sources, outdoor activity, camera, microphone or personal measurements.\n\nWaveform and response tables provide a non-audio route. Named quantities, units and written diagram descriptions provide alternatives to color-only or simulation-only observations. Optional physical observations can be omitted without leaving a required case incomplete.",
		"Science Notebook Evidence Routine":
			"A physics evidence record contains the question, system and interval; raw values with units; a unit-aware graph or diagram; the model equation and assumptions; calculation steps; and the resulting claim.\n\nKeep uncertainty and interpretation separate from the raw observations. A revision records the original claim or graph, the changed evidence or assumption and the resulting correction. For example, changing “force causes motion” to “net force determines acceleration” changes the model, not merely the wording.",
		"Resource Project: Simulation-to-CER Writeup":
			"Choose one supplied case and a corresponding optional simulation. Predict a relationship, compare at least two supplied or simulated conditions and record the quantity held fixed.\n\nWrite a claim, cite two exact values or graph features and explain them with the relevant model. If the simulation is unavailable, the same response can use two rows of the supplied table. Finish with a changed-condition prediction and one model limitation. The relevant module key supplies a calculation check.",
		"Resource Project: Model Critique":
			"Compare an ideal model with its supplied evidence: a frictionless energy account, an ideal-wire circuit, a thin lens or a circular orbit. Identify two predictions the model supports and one effect it omits.\n\nImprove the representation by adding units, a sign convention, a system boundary or a missing-condition note. Explain whether the change alters the calculation, the claim's scope or both. Cite the exact local case or diagram; no additional external evidence is required."
	}
};

export function applyIntroPhysicsReferences(course: RawCourse) {
	const practiceSections: Record<string, string> = {
		"Practice Project: Motion Graph Analysis From Provided Data":
			"motion-graphs-and-kinematics",
		"Practice Project: Free-body Diagram Portfolio":
			"forces-and-newton-laws",
		"Practice Project: Energy Skate Park Simulation Report":
			"gravity-work-and-energy",
		"Practice Project: Circuit Simulation Challenge": "circuits",
		"Practice Project: Wave Interference Simulation":
			"waves-sound-and-light",
		"Practice Project: Safety-feature Design Using Energy and Momentum":
			"momentum"
	};
	let replaced = 0;
	for (const module of course.modules) {
		const entries = referenceText[module.title];
		if (!entries) continue;
		const items = [...module.curriculum, ...module.supplementalProjects];
		if (items.length !== Object.keys(entries).length) {
			throw new Error(
				`Physics reference item count changed: ${module.title}`
			);
		}
		for (const item of items) {
			const content = entries[item.title];
			if (!content) {
				throw new Error(
					`Missing Physics reference text: ${item.title}`
				);
			}
			const practice = /^(?:Practice Project|Resource Project):/u.test(
				item.title
			);
			item.content = content;
			item.preserveInstructions = true;
			item.contentKind = practice ? "assignment" : "reading";
			item.learningPath = "choice";
			item.datasetLink =
				"/course-assets/physics/intro-physics-materials-pack.md";
			if (practice) {
				item.solutionLink =
					"/course-assets/physics/intro-physics-rubrics-answer-key.md";
			}
			const section = practiceSections[item.title];
			if (section) {
				item.datasetLink += `#${section}-cases`;
				item.solutionLink = `/course-assets/physics/intro-physics-rubrics-answer-key.md#${section}-key`;
			}
			replaced++;
		}
	}
	if (replaced !== 28)
		throw new Error("Expected all 28 Physics reference records.");
}
