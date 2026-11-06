import type { RawCourse } from "./types";

const referenceText: Record<string, Record<string, string>> = {
	"Standards Map": {
		"Physics Level 2 Reference Guide":
			"[OpenStax University Physics](https://openstax.org/subjects/science) supplies optional explanations; [NIST uncertainty guidance](https://www.nist.gov/pml/nist-technical-note-1297) supports measurement reasoning. [NGSS appendices](https://www.nextgenscience.org/resources/ngss-appendices) describe scientific practices and crosscutting concepts.\n\nThe local materials and answer packs supply the cases used in the lessons. PhET models are optional additional representations of the same quantities.",
		"Physics Level 2 Core Skills":
			"The starting skills are one-variable algebra, square roots, ratios, graph slope/area, sine and cosine, and consistent units. A 20 m/s vector at 30° has horizontal component 20 cos 30° = 17.32 m/s and vertical component 10.00 m/s.\n\nDiagrams identify the object, system, reference frame and sign convention before equations are selected. PHY8–PHY11 develop these practices through motion, force, friction and momentum cases.",
		"Physics Level 2 Next Topics":
			"PHY17–PHY23 extend the quantitative core into numerical methods, uncertainty, constraints, fluids, thermodynamics, signals and relativity. They are choices after PHY16, with prerequisites supplied by the earlier models.\n\nPHY24 synthesizes completed topics into a portfolio. Further study can deepen calculus-based mechanics, electromagnetism or measurement science; those follow-ups do not become unstated prerequisites for this course.",
		"Physics Level 2 Boundaries":
			"Intro to Physics introduces conceptual models and initial calculations. This course uses algebra, trigonometry, coupled equations, model comparison and uncertainty to revisit some of the same phenomena at greater depth.\n\nPHY8–PHY16 form the core, PHY17–PHY23 are advanced extensions and PHY24 is synthesis. Required investigations use supplied fictional data and diagrams. Physical experiments and personal measurements are optional.",
		"Physics Level 2 Prerequisite Check":
			"Foundation checks: convert 250 cm to metres; solve 3a = 12; resolve a 10 m/s vector at 30°; interpret a horizontal position–time segment.\n\nAnswers are 2.50 m, a = 4, components (8.66, 5.00) m/s, and rest during the segment. An unfamiliar trig or graph result identifies a focused review before the PHY8 vector cases, rather than a need to repeat every Intro extension.",
		"Physics Level 2 Pathway Map":
			"PHY8 components and motion → PHY9–PHY10 force equations and constraints → PHY11 momentum and energy comparison. PHY12 adds rotation, PHY13 orbital motion, PHY14 circuits and PHY15 thermal/optical models.\n\nPHY16 combines completed models in a design comparison. Numerical and uncertainty methods in PHY17–PHY18 can then support selected advanced investigations and the PHY24 portfolio."
	},
	"Course Roadmap": {
		"Physics Level 2 Follow-Up Path":
			"After PHY16, choose a route by the question: numerical reliability → PHY17; parameter evidence → PHY18; linked motion → PHY19; flow → PHY20; thermal devices → PHY21; measurement signals → PHY22; high-speed timing → PHY23.\n\nPHY24 uses completed core topics and selected extensions. Completing every advanced module is not required before the first engineering capstone.",
		"Physics Level 2 Resource Map":
			"The [materials pack](/course-assets/physics/physics-level-2-materials-pack.md) holds raw tables, system descriptions and design criteria. The [answer pack](/course-assets/physics/physics-level-2-rubrics-answer-key.md) gives calculations, interpretation checks and rubrics.\n\nThe 17 lesson readings explain their model and a worked supplied case. Paper, spreadsheet and optional simulation routes use the same quantities; an external simulation is not the sole source of required evidence.",
		"Physics Level 2 Module Alignment Guide":
			"| Module group | Supplied evidence | Central comparison |\n| --- | --- | --- |\n| PHY8–PHY11 | vectors, forces, ramps, collisions | component and conservation accounts |\n| PHY12–PHY15 | rotation, orbits, circuits, thermal/optical tables | equation choice and operating domain |\n| PHY16 | ramp, circuit and impact candidates | criteria and model revision |\n| PHY17–PHY19 | update traces, residuals, linked objects | numerical, measurement and constraint checks |\n| PHY20–PHY23 | flow, device, signal and frame records | model assumptions and scale |\n| PHY24 | selected supplied research seed | evidence, alternative and defense |",
		"Physics Level 2 Reference Map":
			"The materials and answer sections follow PHY8–PHY24 in order. Each lesson links its own section, including the numerical update rules, circuit topology and frame assumptions needed to interpret the values.\n\nOpenStax provides optional subject explanations; NIST supplies measurement guidance; PhET gives interactive views. A reference supports a model explanation, while the local case supplies its actual analysis inputs.",
		"Physics Level 2 Prerequisite Map":
			"For PHY17, review the PHY8 constant-acceleration equations before comparing numerical updates. For PHY19, review PHY9 free-body diagrams and PHY10 rope constraints. For PHY21, review PHY15 thermal energy before analyzing cycles.\n\nThe dependency is a quantity or method used in the later calculation. For example, time-step error needs an independent motion baseline; it is not a prerequisite about arrays or graphics grids.",
		"Physics Level 2 Resource Inventory":
			"Local evidence contains 17 module case sections and 17 matching answer sections, plus shared model records and rubrics. The inputs include vector traces, force tables, inertia models, source and load circuits, heating and lens data, numerical traces, residuals, device energy and sensor records.\n\nA calculator and labeled notes are sufficient for the supplied analyses. Optional Python or spreadsheet models need their equations, initial state and update procedure recorded."
	},
	"Project Practice Guide": {
		"Physics Level 2 Project Ladder":
			"Begin with a labeled representation and calculation for one supplied case. Then compare two conditions, check an independent relationship and state what the model omits.\n\nPHY16 adds engineering criteria and a revised recommendation; PHY24 adds source evaluation, reproducibility and a defended alternative. The practice projects below provide optional applications of the same models rather than a second required sequence.",
		"Physics Level 2 Checkpoints":
			"Useful checks join values to their meaning: the 20° sliding case gives 1.51 m/s² down the ramp; the circuit node is 3 V with branch currents 1.0 A and 0.5 A; halving the explicit-Euler free-fall step halves its position error in the supplied case.\n\nUnits, signs and assumptions distinguish a physical conclusion from an isolated number. A changed condition tests whether that reasoning transfers.",
		"Physics Level 2 Rubric":
			"The shared quantitative rubric scores setup, representation, mathematics, validation, evidence claim, model honesty and revision/transfer from 0 to 3. Seven dimensions total 21 points. The core point score uses the first six dimensions for an 18-point maximum; revision/transfer remains reviewed and is required at capstones.\n\nThe PHY24 rubric adds source/reproducibility and synthesis/defense for 27 points. A correct number with an incompatible diagram still needs revision.",
		"Physics Level 2 Capstone Gate":
			"PHY16 requires a defined design question, source values, model, calculation, representation, validation, criteria, alternative, uncertainty and substantive revision. The supplied options are a ramp, a two-load circuit and an impact comparison.\n\nAn infeasible result is a valid outcome when the conflicting constraints are shown. PHY24 adds a research log, source evaluation and a concrete result that would reverse the final claim.",
		"Practice Project: Motion Graph Analysis From Provided Data":
			"Use the PHY8 no-drag and drag position traces. Plot x(t) and y(t), estimate interval velocities and compare each horizontal residual with the stated ±1.0 m tolerance.\n\nIdentify the first recorded time beyond that tolerance. Compare the ideal projectile equations with the supplied observations and distinguish a measured residual from proof of a particular drag law. Extend the comparison with a changed launch angle or error tolerance.",
		"Practice Project: Free-body Diagram Portfolio":
			"Use the PHY9 elevator and tug-of-war cases and the PHY10 connected masses. Draw a separate object diagram for each, name the forces' interaction partners and choose positive axes.\n\nCalculate the stated accelerations and tensions. Then compare one whole-system equation with its object equations, showing which forces become internal. Include one changed-mass or changed-support case and explain which earlier equality no longer follows.",
		"Practice Project: Energy Skate Park Simulation Report":
			"Use the PHY16 ramp model with designs (height 1.05 m, length 2.50 m) and (height 1.20 m, length 4.00 m). Both start from rest; use g = 9.80 m/s² and μk = 0.10 ± 0.02.\n\nCompare no-friction and friction-inclusive bottom speeds using the supplied energy equation. Test the 3.8–4.2 m/s target at both coefficient endpoints. An optional skate-park simulation can provide another view; the supplied values are sufficient without it.",
		"Practice Project: Circuit Simulation Challenge":
			"Use the PHY14 node circuit and meter-divider cases. Draw the actual node connections, write a current-balance equation, calculate each branch and verify total source/resistor power.\n\nCompare ideal, 1.0 MΩ and 100 kΩ meter readings for the specified divider. Explain why measurement changes the circuit and why a battery's emf does not set one fixed current for every load. A paper schematic or optional circuit model can represent the same calculation.",
		"Practice Project: Wave Interference Simulation":
			"Use the optional phase cards in PHY15. At each time add the signed displacements for matching and opposite phases, plot both totals and report their amplitudes at that position.\n\nExplain how a zero total at one point differs from disappearance of wave energy. The calculation assumes equal frequencies and amplitudes and a linear response; it is an optional optics bridge. Predict how unequal amplitudes would change the cancellation.",
		"Practice Project: Safety-feature Design Using Energy and Momentum":
			"Use the PHY11 force–time records and PHY16 constant-deceleration impact candidates. Calculate impulse, average and sampled peak force, kinetic-energy change and stopping distance using each case's stated assumptions.\n\nCompare every candidate against both force and distance criteria. If none passes, show the conflict and propose one explicit criterion revision. Keep sampled peaks distinct from true instantaneous peaks and educational models distinct from real equipment ratings."
	},
	"Digital Resource Bank": {
		"Curated Digital Resource Bank":
			"The local case and answer packs contain the required analysis inputs. Optional [PhET physics models](https://phet.colorado.edu/en/simulations/filter?subjects=physics) illustrate the relationships; [OpenStax](https://openstax.org/subjects/science) explains subject background and [NIST](https://www.nist.gov/pml/nist-technical-note-1297) supports uncertainty terminology.\n\nThese sources have different roles: a model's explanation, an interactive representation and a measurement method. None replaces the actual numbers, conditions and diagrams stated in the local case.",
		"Module-by-Module Resource Mapping Routine":
			"PHY8–PHY11 use component, force and momentum ledgers. PHY12–PHY15 use inertia, orbit, circuit and thermal/optical models. PHY16 compares engineering criteria.\n\nPHY17–PHY19 connect update rules, residuals and constraints; PHY20–PHY23 add control volumes, device cycles, measurement chains and event coordinates. PHY24 preserves the selected inputs and analysis procedure so its conclusion can be checked independently.",
		"Online Safety and Accessibility Check":
			"Required analyses use fictional tables, written system descriptions and labeled graphs. No case requires launching an object, working with household wiring, heating materials, entering water, attaching sensors to a person or sharing personal measurements.\n\nTables provide alternatives to motion, sound and interactive displays. Labels and signs carry meaning independently of color. Optional physical observations can be omitted while retaining the complete supplied-data route.",
		"Science Notebook Evidence Routine":
			"A quantitative record contains a coordinate or system definition, interval, origin and sign conventions, raw values with units, assumptions, equations, substitution, a unit-aware graph or diagram and an independent check.\n\nInterpretation stays separate from raw observations. A revision states the original conclusion, the changed evidence or assumption and the revised claim. The full materials record also includes uncertainty, an alternative and a changed-condition prediction.",
		"Resource Project: Simulation-to-CER Writeup":
			"Choose a supplied module case and, optionally, its associated simulation. Predict one relationship, compare two stated conditions and retain their exact values, units and assumptions.\n\nWrite a claim, cite at least two table or graph features and explain them with the model. Make one changed-condition prediction and state a result that would challenge it. A supplied-table analysis is complete when the simulation is unavailable.",
		"Resource Project: Model Critique":
			"Compare one model with its local evidence: ideal projectile motion against drag traces, explicit Euler against analytic free fall, a lossless fluid account against pressure readings, or a calibrated sensor against reference points.\n\nName two supported predictions and one limitation, quantify one discrepancy and distinguish model inadequacy from numerical or measurement error. Propose one bounded improvement and explain what additional result would favor it."
	}
};

export function applyPhysicsLevel2References(course: RawCourse) {
	const practiceSections: Record<string, string> = {
		"Practice Project: Motion Graph Analysis From Provided Data":
			"quantitative-kinematics-and-vectors",
		"Practice Project: Free-body Diagram Portfolio":
			"multi-force-and-equilibrium",
		"Practice Project: Energy Skate Park Simulation Report":
			"engineering-physics-capstone",
		"Practice Project: Circuit Simulation Challenge":
			"electricity-circuits-and-fields",
		"Practice Project: Wave Interference Simulation":
			"thermal-optics-and-modern-bridges",
		"Practice Project: Safety-feature Design Using Energy and Momentum":
			"engineering-physics-capstone"
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
				"/course-assets/physics/physics-level-2-materials-pack.md";
			if (practice) {
				item.solutionLink =
					"/course-assets/physics/physics-level-2-rubrics-answer-key.md";
			}
			const section = practiceSections[item.title];
			if (section) {
				item.datasetLink += `#${section}-cases`;
				item.solutionLink = `/course-assets/physics/physics-level-2-rubrics-answer-key.md#${section}-key`;
			}
			replaced++;
		}
	}
	if (replaced !== 28)
		throw new Error("Expected all 28 Level 2 reference records.");
}
