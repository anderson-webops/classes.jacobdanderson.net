import type { RawCourse } from "./types";

export const middleSchoolScienceReferences: Record<
	string,
	Record<string, string>
> = {
	"Standards Map": {
		"Middle School Integrated Science Reference Guide":
			"[NGSS appendices](https://www.nextgenscience.org/resources/ngss-appendices) explain science practices, crosscutting concepts and disciplinary progressions. This course combines physical, life and Earth/space science through evidence and models. The supplied materials are fictional instructional cases; public references provide scientific background. A case value remains a modeled input even when the underlying scientific idea also applies to real systems.",
		"Middle School Integrated Science Core Skills":
			"Read a table's headings and units, divide a count by its observation time, compare proportions and label a graph. For example, 18 observations in 2 hours gives 9 observations/hour. An observation reports a value; an inference explains it. A complete explanation identifies a claim, specific evidence, the connecting mechanism and a limitation. MS1 teaches this routine before later subject investigations.",
		"Middle School Integrated Science Next Topics":
			"The integrated sequence develops reasoning in MS1, living systems in MS2–MS4, Earth systems in MS5, matter and energy in MS6–MS7, motion and signals in MS8–MS9, and space-system synthesis in MS10. Specialist biology, chemistry and physics courses deepen particular threads after this broad sequence. Optional projects add comparisons and changed conditions to the same supplied cases.",
		"Middle School Integrated Science Boundaries":
			"The ten units introduce scientific models and evidence across disciplines. Supplied diagrams, descriptions and fictional tables support the required investigations. Claims apply to the stated system, interval and assumptions. A model of a runner explains system interactions; it supplies no clinical assessment. A regional fictional climate series supports arithmetic and trend analysis; it supplies no forecast for a real locality.",
		"Middle School Integrated Science Prerequisite Check":
			"Three worked readiness checks: 20 counts in 4 hours is 5 counts/hour; 8 of 20 individuals is a proportion of 0.40, or 40%; a line graph with time on its horizontal axis displays how a quantity changes across an ordered series. Review division, fractions and graph labels when these operations are unfamiliar. MS1 introduces the scientific evidence routine using a complete pond case.",
		"Middle School Integrated Science Pathway Map":
			"MS1's units, rates, graphs and claim boundaries support every later investigation. MS2's cell and system relationships support MS3 heredity and MS4 ecology. MS6's particle and conservation models connect to MS7 energy transfer. MS8's motion and force models support orbital reasoning in MS10. The final presentation uses completed case work, a justified claim and a substantive revision."
	},
	"Course Roadmap": {
		"Middle School Integrated Science Follow-Up Path":
			"Choose further study from a completed question: cell processes and inheritance lead toward biology; particle identity and chemical evidence lead toward chemistry; quantitative force, energy and circuit models lead toward physics. The integrated course supplies the shared vocabulary and evidence habits. The next course's own prerequisite checks establish the needed mathematics and subject depth.",
		"Middle School Integrated Science Resource Map":
			"The local materials pack contains ten sections matching MS1–MS10: pond records, cells and systems, beetles, ecosystems, Earth and climate, particles, cooling designs, motion, signals and space. Each investigation links its case and response section. The answer pack includes reasoning and limitations. Public simulations offer additional exploration of these models.",
		"Middle School Integrated Science Module Alignment Guide":
			"The same question can be represented in several ways. In MS8, the position table supports a graph and interval calculations: distance adds path lengths, while displacement compares endpoints. A claim of constant speed can be checked against equal-time position changes. Agreement between a calculation and a graph strengthens an interpretation; disagreement identifies an assumption or representation to revisit.",
		"Middle School Integrated Science Reference Map":
			"Reference types answer different questions. A supplied table gives the values for a course calculation. A response key explains that calculation and its limits. NASA explains astronomical models, USGS explains Earth processes, NIH/NHGRI support cell and inheritance background, and PhET offers interactive exploration. A link to a broad reference supplies background rather than additional measurements for the fictional case.",
		"Middle School Integrated Science Prerequisite Map":
			"Before comparing beetle frequencies, calculate category count divided by sample total. Before comparing cooling designs, read the elapsed time and apply the same temperature-change calculation. Before defending a Moon model, identify light direction and observer viewpoint. These dependencies connect MS1's quantitative reasoning to MS3, MS7 and MS10.",
		"Middle School Integrated Science Resource Inventory":
			"Course inputs include fictional observation tables, labeled system descriptions, particle counts, circuit states, signal packets and two explicit Moon models. Outputs can be written explanations, graphs, labeled diagrams or presentations with text descriptions. A notebook or digital document is sufficient. The materials pack supplies raw cases; the answer pack supplies worked checks and assessment criteria."
	},
	"Project Practice Guide": {
		"Middle School Integrated Science Project Ladder":
			"Practice progresses from a bounded case to comparison and synthesis. A pond-rate calculation checks one representation; an ecosystem recommendation combines a pathway with criteria and limitations; the final capstone organizes completed evidence into a revised explanation. The optional practice cases below revisit particular models with an additional comparison or error analysis.",
		"Middle School Integrated Science Checkpoints":
			"A science checkpoint identifies the quantity and units, the evidence source, the pattern, the proposed mechanism and a limitation. For the cart, 32 m is distance and +12 m is displacement. Both are correct for the same trip because they measure different features. A correction should name the mistaken quantity or assumption and show how the evidence changes the conclusion.",
		"Middle School Integrated Science Rubric":
			"A secure explanation states the question and boundary, cites exact observations or values, uses a labeled representation, connects evidence through a scientific mechanism, and identifies an uncertainty or alternative. A revision retains the original explanation and identifies the evidence behind a substantive change. Presentation quality supports readable evidence; the claim still needs the scientific reasoning.",
		"Middle School Integrated Science Capstone Gate":
			"The required MS10 capstone is a completed presentation using supplied case records: question, source log, raw evidence, labeled model or display, claim, two evidence points, reasoning, alternative, limitation and revision. Text descriptions accompany visuals. The optional extension connects a second discipline or competing design and adds evidence that changes or qualifies the explanation.",
		"Practice Project: Simulation Lab with Graph and CER Response":
			"Use the supplied cooling table to graph A and B across the same 30 minutes. Compare their overall cooling magnitudes, then inspect whether equal-time intervals have equal temperature changes. An optional simulation can be compared with the supplied states.\n\n**Checkpoints:** Label both axes and designs, show the two overall-rate calculations, cite two interval changes and explain why an average can hide changing rates. State one test condition that must remain comparable.",
		"Practice Project: Ecosystem Food-Web Model":
			"Build the supplied estuary web with arrows from food toward its receiver. Mark producers, consumers and decomposers. Consider a decrease in phytoplankton and trace two possible effects through different pathways.\n\n**Checkpoints:** Label energy transfer and matter cycling separately. Support each predicted effect with an arrow path, identify an uncertainty and explain why the web alone cannot calculate the size of a population change.",
		"Practice Project: Climate or Weather Data Analysis":
			"Compare the seven-day weather sequence with the five decadal climate records. Graph one variable from each using its own units and time scale. Calculate the first-to-last anomaly change and identify the incomplete decade.\n\n**Checkpoints:** Cite two weather observations and two climate values. Explain which evidence describes short-term conditions and which describes a longer pattern. State what driver evidence would be needed for a causal claim and why the missing year's effect cannot be calculated.",
		"Practice Project: Moon Phases or Seasons Model":
			"Use Moon models A and B to evaluate the draft explanation: 'The full Moon is caused by Earth's shadow, and the circles' drawn spacing gives the real Earth–Moon separation.' Correct each claim using viewing geometry and the scale calculation.\n\n**Checkpoints:** Show the illuminated half and observer, calculate model B's Moon diameter and center separation, and identify which model can answer each question. Keep the approximate modeled phase times separate from measured sky observations.",
		"Practice Project: Engineering Tradeoff Design Using Provided Constraints":
			"Compare the supplied cooling designs with a maximum cost score of 3. Choose the eligible design retaining the highest temperature after 30 minutes. Then change the maximum cost score to 5 and reconsider the decision under the same heat-retention priority.\n\n**Checkpoints:** Name eligible designs in each case, cite their final temperatures and cost scores, and explain the change in recommendation. Describe a different priority that could favor another design."
	},
	"Digital Resource Bank": {
		"Curated Digital Resource Bank":
			"Each unit has a complete local case route: MS1 pond; MS2 cells and runner; MS3 beetles and chance trials; MS4 estuary; MS5 weather, climate and plates; MS6 particle and mass records; MS7 cooling; MS8 cart and forces; MS9 signals and circuits; MS10 Moon models, planets and spectra. External references deepen the explanation while supplied states preserve the evidence needed for the investigations. Optional references include the [PhET biology catalog](https://phet.colorado.edu/en/simulations/filter?subjects=biology) and [Ask A Biologist activities](https://askabiologist.asu.edu/activities). ASU cell-size and food-web activities offer further digital comparisons for MS2–MS4.",
		"Module-by-Module Resource Mapping Routine":
			"A source record distinguishes supplied observations, model states, calculated results and background explanations. For a Moon scale calculation, the rounded diameters and separation are inputs; 2.73 mm and 30.2 cm are calculated model dimensions. NASA explains the underlying system. Recording these roles keeps a model-derived result from being presented as a new sky measurement.",
		"Online Safety and Accessibility Check":
			"Required investigations use supplied descriptions, diagrams and fictional records. No case requires chemicals, heat, electrical construction, organisms, outdoor sampling or personal health and family data. Text labels accompany model features; signal tables provide a route without hearing the signal or distinguishing colors. A written or dictated explanation can communicate the same evidence as a diagram with a text description.",
		"Science Notebook Evidence Routine":
			"Record the question, source, system boundary and time interval first. Preserve raw values and units before calculations. Add a labeled graph or model, a claim, two evidence points, reasoning, an alternative or limitation and a changed-condition prediction. Keep the first explanation alongside its revision. For the pond, replace an unsupported population ranking with observation rates and state the remaining sampling limitation.",
		"Resource Project: Simulation-to-CER Writeup":
			"Use the supplied MS9 signal table as the noninteractive route. Compare P1 with P2 while holding frequency fixed, then P1 with P3 while holding amplitude fixed. State how each pair tests a different signal property. A simulation can supply an additional comparison if available.\n\n**Checkpoints:** Cite amplitudes, frequencies and encoded bits; explain the variable held fixed in each comparison; predict the code for a high-amplitude 8 Hz signal under the supplied rule; and name a limit of this fictional code.",
		"Resource Project: Model Critique":
			"Compare phase model A and scale model B for two purposes: explaining a changing visible illuminated fraction and representing relative size and separation. Identify two useful features and one omission in each.\n\n**Checkpoints:** Cite a specific model state and a calculated dimension. Propose a combined representation, explain what the added feature permits and identify one remaining limit, such as omitted orbital tilt or approximate timing."
	},
	"Middle School Integrated Science 6-8 Scope Map": {
		"Grade 6 Theme: Systems Visible Systems and Models":
			"One possible early middle-school thread connects visible structures and interactions: cell parts, organs, food-web arrows, Earth spheres and Sun–Earth–Moon geometry. MS2's runner illustrates a system: gases, nutrients and signals travel through different interacting pathways. A system boundary makes the chosen relationship manageable while recording what the model leaves outside it.",
		"Grade 7 Theme: Matter Moving Through Living and Earth Systems":
			"A matter-and-energy thread connects MS4's food web, MS5's Earth-system transfers, MS6's particle counts and MS7's cooling designs. Matter cycles through organisms and environmental reservoirs, while energy transfers and disperses. The particle case preserves atom counts across a reaction; the open-container case changes measured mass because material crosses its boundary.",
		"Grade 8 Theme: Forces, Waves, Heredity, and Evolutionary Change":
			"A comparison-of-evidence thread connects MS3 inheritance and selection, MS8 forces and motion, MS9 signals, and MS10 orbital models. Equal-time cart displacements test a constant-speed claim; a single-bit and two-bit change test the limits of parity. A model can explain one pattern while leaving alternatives or unmeasured processes unresolved.",
		"6-8 Coverage Guardrail":
			"These grade-theme entries are optional ways to organize review. NGSS describes grade-band progressions and offers several course-mapping models; a particular school sequence can arrange the strands differently. The ten course units combine physical science, life science, Earth/space science and engineering with practices such as modeling, data analysis, explanation and revision.",
		"Integrated Science Project: Public Dataset CER":
			"Use the supplied weather and runoff tables to compare how a storm can appear in atmospheric and ecosystem records. Identify observed changes, propose one connecting pathway and state which measurements would be needed to test that connection. The tables describe separate fictional cases, so combining them does not establish one measured event.\n\n**Checkpoints:** Keep both sources labeled, cite two values from each, separate observation from hypothesis and propose a matched-place/time measurement plan.",
		"Integrated Science Project: Model Revision":
			"Begin with the draft pond claim 'Team B recorded the most minnows, so it has the largest minnow population.' Preserve it, calculate all three observation rates, and build a corrected graph and explanation.\n\n**Checkpoints:** Show raw counts and effort, calculate 9, 7 and 11 observations/hour, correct the ranking and axis label, and explain why even the corrected rate comparison does not establish true population size. Identify the evidence that changed the first model."
	}
};

const practiceSections: Record<string, string> = {
	"Practice Project: Simulation Lab with Graph and CER Response":
		"Energy Heat and Engineering",
	"Practice Project: Ecosystem Food-Web Model": "Ecosystems and Human Impact",
	"Practice Project: Climate or Weather Data Analysis":
		"Earth Weather Climate and Geologic",
	"Practice Project: Moon Phases or Seasons Model":
		"Space Systems and Capstone",
	"Practice Project: Engineering Tradeoff Design Using Provided Constraints":
		"Energy Heat and Engineering",
	"Resource Project: Simulation-to-CER Writeup": "Waves Circuits and Signals",
	"Resource Project: Model Critique": "Space Systems and Capstone",
	"Integrated Science Project: Public Dataset CER":
		"Earth Weather Climate and Geologic",
	"Integrated Science Project: Model Revision": "Reasoning Models and Data"
};

export function applyMiddleSchoolScienceReferences(course: RawCourse) {
	let replaced = 0;
	for (const module of course.modules) {
		const entries = middleSchoolScienceReferences[module.title];
		if (!entries) continue;
		const items = [...module.curriculum, ...module.supplementalProjects];
		if (items.length !== Object.keys(entries).length)
			throw new Error(`Science reference count changed: ${module.title}`);
		for (const item of items) {
			const content = entries[item.title];
			if (!content)
				throw new Error(`Missing science reference: ${item.title}`);
			const section = practiceSections[item.title];
			item.content = content;
			item.preserveInstructions = true;
			item.preserveAssignment = true;
			item.contentKind = section ? "assignment" : "reading";
			item.learningPath = "choice";
			item.datasetLink =
				"/course-assets/middle-school-science/middle-school-science-materials-pack.md";
			item.solutionLink =
				"/course-assets/middle-school-science/middle-school-science-rubrics-answer-key.md";
			if (section) {
				const slug = section.toLowerCase().replaceAll(" ", "-");
				item.datasetLink += `#${slug}-cases`;
				item.solutionLink += `#${slug}-key`;
				item.content += `\n\n[Case inputs](/course-resource?asset=${encodeURIComponent(item.datasetLink)})\n\n[Project self-check](/course-resource?asset=${encodeURIComponent(item.solutionLink)})`;
				if (
					item.title ===
					"Integrated Science Project: Public Dataset CER"
				) {
					const runoff =
						"/course-assets/middle-school-science/middle-school-science-materials-pack.md#ecosystems-and-human-impact-cases";
					item.content += `\n\n[Runoff inputs](/course-resource?asset=${encodeURIComponent(runoff)})`;
				}
			}
			replaced++;
		}
	}
	if (replaced !== 33)
		throw new Error("Expected all 33 science reference records.");
}
