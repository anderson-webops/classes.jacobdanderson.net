import type { RawCourse } from "./types";

export const elementaryScienceReferences: Record<
	string,
	Record<string, string>
> = {
	"Standards Map": {
		"Elementary Science Reference Guide":
			"The eight units combine observation, models, data, explanation and design. NGSS describes these as science and engineering practices used with subject ideas. K–2 responses can use a labelled drawing and one evidence detail; grades 3–5 add organized data, reasoning and a limitation. The course's supplied fictional cases support those practices without representing a complete assessment of every elementary science standard. [NGSS practices and progressions](https://www.nextgenscience.org/resources/ngss-appendices).",
		"Elementary Science Core Skills":
			"Begin with a source detail, distinguish it from an explanation, and organize a comparison. For the plant model, P's growth is 9 − 5 = 4 cm and Q's is 6 − 5 = 1 cm. The difference supports a bounded comparison. Graph labels identify what was measured and in which units. A claim answers the question; evidence cites the values; reasoning connects them while retaining the small comparison's limits.",
		"Elementary Science Next Topics":
			"ES1 introduces evidence and comparisons. ES2 applies them to organisms and their needs; ES3 connects organisms in a pond web. ES4 follows weather and water. ES5 compares matter and materials; ES6 connects forces to motion and machines; ES7 studies light, sound and communication. ES8 combines model critique and a revised explanation. Middle School Integrated Science continues with more quantitative and multi-system cases after these introductory habits are secure.",
		"Elementary Science Boundaries":
			"The cases concern introductory life, physical and Earth/space science. A living-things classification uses several biological criteria; a material decision uses the supplied property ratings; a forecast remains a prediction. A fictional table supplies practice evidence rather than measurements of a real schoolyard or community. A correct result stays within that case's assumptions. Specialist biology, chemistry and physics courses develop deeper mechanisms and mathematics beyond this elementary sequence.",
		"Elementary Science Prerequisite Check":
			"Three readiness examples are available before the investigations: count three pictured or described puddles; sort a bean plant and a rock using the supplied descriptions; compare 9 cm with 6 cm as taller and shorter. K–2 can point, dictate or draw the answers. Grades 3–5 can also subtract the plant starting heights and label a small graph. ES1 teaches the evidence routine used afterward.",
		"Elementary Science Pathway Map":
			"Observation and inference in ES1 support every later explanation. Organism needs in ES2 support the food relationships in ES3. Water changes in ES4 connect with states of matter in ES5. The force and motion model in ES6 supports the source/path/receiver comparisons in ES7. ES8 uses earlier case work in one required capstone, while optional projects extend selected questions. The grade-band route changes response depth within this sequence."
	},
	"Course Roadmap": {
		"Elementary Science Follow-Up Path":
			"A completed question provides a useful direction for further study. Comparing organism structures can lead to biology; explaining particle changes can lead to chemistry; investigating force, motion or signals can lead to physics. Middle School Integrated Science links these strands through more detailed systems and quantitative evidence. Its own readiness activities establish the mathematics needed for that next course. Optional elementary projects can first extend a familiar case with one changed condition.",
		"Elementary Science Resource Map":
			"The local materials pack follows ES1–ES8 with mystery scenes, living-things cases, a pond web, weather and water records, material ratings, cart and machine cases, light and sound comparisons, and sky/model descriptions. The answer pack supplies reasoning and model limits. Both grade bands use these same sources with different response depths. Only notes, paper, shared-screen materials and optional simple sketches are needed. No physical supplies beyond paper are required.",
		"Elementary Science Module Alignment Guide":
			"A question, representation and explanation concern the same evidence. For the cart, the position table produces interval changes of 1, 2, 2 and 2 m. A position-time graph shows the same pattern; the final intervals support steady average speed. A graph of a different variable would answer another question. Use the source title, axis labels and units to check that each representation supports the claim actually being made.",
		"Elementary Science Reference Map":
			"References have different jobs. The local pack supplies the exact assessment inputs, while the answer pack explains examples and limits. NASA pages provide space or Earth-system background; USGS diagrams explain water stores and movement; NOAA defines forecast terms. A reference's real-world facts do not turn fictional classroom values into field observations. When using an outside example, record its source and distinguish its evidence from the supplied case.",
		"Elementary Science Prerequisite Map":
			"The dependency sequence connects skills, not only subject names: separate observation from inference before claiming a cause; read units before comparing table columns; calculate position changes before interpreting a motion graph; define a design's requirements before choosing materials. A bar graph of plant growth requires the subtraction in ES1. A food-web prediction requires the producer/consumer relationships in ES3. Each worked reading supplies the smaller step before its activities.",
		"Elementary Science Resource Inventory":
			"Each required activity links a local case-input section and an answer section. The inputs contain observations, descriptions, ratings or model states. The answer section gives a worked response and a boundary on the claim. An invented creature, design or graph is created during the activity and labelled accordingly. External simulations and public readings are background or optional exploration; the supplied records provide the evidence used in the stated assessments."
	},
	"Project Practice Guide": {
		"Elementary Science Project Ladder":
			"Practice can move from one observation to a comparison and then to a revised explanation. In the schoolyard case, first identify puddles, then compare two possible causes, then revise the initial rain claim to include the sprinkler alternative. A more elaborate presentation adds organization rather than replacing that evidence. The optional practice examples below continue the same supplied cases with a particular representation or changed question.",
		"Elementary Science Checkpoints":
			"A useful checkpoint identifies both a correct result and a remaining uncertainty. P grows 4 cm and Q 1 cm in the plant model; their unequal light cards support a question about light, but one pair does not establish a universal cause. In the pond case, compare observations per hour before ranking heron records. In a design case, retain a failed criterion alongside a passing result instead of reporting only the preferred option.",
		"Elementary Science Rubric":
			"A secure response names its source, represents a relevant detail accurately, connects that detail to a claim and states an appropriate limit. K–2 can show these through a labelled drawing, a spoken because sentence or dictated words. Grades 3–5 add a data display, an explicit reasoning chain and a changed-condition prediction. A revision identifies the evidence that changed the explanation; neat presentation alone does not supply the evidence.",
		"Elementary Science Capstone Gate":
			"One completed required capstone brings together a question, supplied evidence, a representation, reasoning and a revision. For the signal case, the first beep-only design fails in noise; adding RETURN text improves detection when the screen remains visible. The obscured-screen failure stays in the record as a limit. An optional continuation preserves that artifact and adds a changed condition, additional evidence or a competing design rather than restarting the required project.",
		"Practice Project: Draw-and-label Observation Notebook":
			"Use Mystery Scene A. Draw or list its three puddles, leaf droplets and cloud cover; label one inference separately. K–2: include three source details and one because sentence. Grades 3–5: add rain and sprinkler as competing explanations and name one observation that could distinguish them.\n\n**Checkpoints:** The labelled details occur in the supplied description, the inference is identified as an explanation, and the revised claim retains uncertainty rather than inventing an observed cause.",
		"Practice Project: Sort or Classify Image Cards":
			"Use the seven living-things text cards as the supplied equivalents of image cards. K–2: sort plant, seed, robot and rock and explain one choice. Grades 3–5: add flame, wooden block and snail, retaining living, dormant, once-living material and nonliving distinctions.\n\n**Checkpoints:** Movement alone does not decide the group; a dormant seed remains living; wood's origin is distinguished from current life processes; each reason points to its actual description.",
		"Practice Project: Weather Graph From Provided Data":
			"Use the seven daily highs 18, 19, 22, 24, 23, 20 and 17 °C. K–2: order two days as warmer or cooler and mark one value. Grades 3–5: draw a labelled temperature graph with equally spaced day positions and temperature intervals, then describe its maximum and minimum.\n\n**Checkpoints:** Day 4 is 24 °C and Day 7 is 17 °C; the axis names daily high temperature, and the separate Day 8 forecast is not inserted as an observed value.",
		"Practice Project: Paper Bridge or Tower Design with Optional Physical Build":
			"Create a drawing of a bridge platform from the supplied material ratings. Its model criteria are strength at least 3 and relative mass at most 2. Compare cardboard, cloth and clear plastic; label the intended span and supports as design choices.\n\n**Checkpoints:** Cardboard and clear plastic pass those two rating limits; cloth fails strength. The drawing supplies no measured load capacity. Add one proposed comparison of the two passing designs, distinguishing a planned test from an observed success.",
		"Practice Project: Animal Habitat Model with Drawing and Explanation":
			"Use the supplied duck and fox descriptions for a drawn comparison. K–2: label the duck's webbed feet and fox's dense fur with their jobs. Grades 3–5: compare water movement and heat-loss conditions, then predict how a changed habitat could reduce one advantage.\n\n**Checkpoints:** Separate structure, function and behavior; cite a supplied feature; explain a limit; and label any invented addition as a model rather than a real observed adaptation."
	},
	"Digital Resource Bank": {
		"Curated Digital Resource Bank":
			"The [local case pack](/course-resource?asset=%2Fcourse-assets%2Felementary-science%2Felementary-science-materials-pack.md) supplies all assessment observations, descriptions and tables. [NASA Space Place](https://spaceplace.nasa.gov/menu/solar-system/) offers additional space explanations, and [USGS water-cycle diagrams](https://www.usgs.gov/special-topics/water-science-school/science/water-cycle-diagrams) show water storage and movement. NOAA's [forecast glossary](https://www.noaa.gov/jetstream/appendix/weather-glossary-p) explains precipitation probability. Optional [PhET simulations](https://phet.colorado.edu/) provide additional model exploration. Record which source supports a claim; optional background remains distinct from the fictional values in the local cases.",
		"Module-by-Module Resource Mapping Routine":
			"ES1 uses the observation and plant cards; ES2 the living-things descriptions; ES3 the food web and population records; ES4 the weather, forecast and water routes. ES5 uses material ratings; ES6 cart positions and machine cases; ES7 light, vibration and signal records; ES8 the sky descriptions, comparison table and capstone record. The matching answer sections follow that same order, so a response can be checked against its actual inputs.",
		"Online Safety and Accessibility Check":
			"Required investigations use supplied descriptions, diagrams and fictional records. Physical supplies are optional only. The source details remain available as text; a sound comparison uses vibration data and a signal comparison uses recorded outcomes. Responses can be spoken, dictated, drawn, selected or written. A visual artifact includes labels or a text description so its meaning does not depend on color alone. Keep source-based examples separate from a learner's personal location, health or family information.",
		"Science Notebook Evidence Routine":
			"Keep the source title, question, observations, representation, explanation and revision together. For the cart, record the time and position columns before drawing the graph; retain both when correcting an axis label. For the schoolyard, retain the original inference and add a competing cause rather than replacing the observed details. An entry's date records when the work was made; it does not turn a fictional case into a real local observation.",
		"Resource Project: Simulation-to-CER Writeup":
			"Use the supplied point-light shadow model states A and B. K–2: identify which shadow is larger. Grades 3–5: write a claim, cite object positions 1 and 2 and shadow heights 4 and 2, and connect the comparison to the fixed light/screen setup.\n\n**Checkpoints:** The object size, source position and screen position stay fixed. The claim concerns these supplied model states; it identifies the omitted effect of an extended real light source.",
		"Resource Project: Model Critique":
			"Compare solar-system Model A, which preserves order while exaggerating sizes, with Model B, which compares diameters while omitting distance. K–2: choose a model for one question. Grades 3–5: name two useful features and one omission, using the Earth/Mars values to distinguish diameter from separation.\n\n**Checkpoints:** Match each model to its purpose, keep the units consistent and propose one added feature while acknowledging what the revised model still leaves out."
	},
	"Elementary Science Grade-Band Paths": {
		"Decision: Keep One Course with K-2 and 3-5 Paths":
			"The same supplied case can support different response depths. K–2 uses a visible or described detail, a labelled drawing or sort, and an oral or written explanation. Grades 3–5 organize more evidence, use a table or graph and explain a limitation or changed condition. For the plant case, one route compares taller and shorter while the other calculates growth from both starting and ending heights. Select the route appropriate to the current learning goal.",
		"K-2 Path":
			"A complete short response points to a source detail and connects it to an idea. For the schoolyard: “I observe three puddles. I think rain could explain them.” A drawing labels the puddles rather than adding an unseen rainstorm as an observation. A follow-up can ask whether a sprinkler could also explain the water. Pointing, dictation, selected words and drawing can show the same distinction between observation and inference.",
		"Grades 3-5 Path":
			"A fuller response records comparable values, a representation and a bounded conclusion. For plants P and Q, calculate growth as 4 and 1 cm, label the changed light duration and equal supplied water amounts, and graph growth rather than final height. A reasoning sentence connects the comparison to the claim. A limitation notes the small model dataset and unspecified conditions; it avoids concluding that one amount of light always helps every plant.",
		"Shared Zoom Constraint":
			"The lesson uses the same case details whether work is read independently or discussed through a shared screen. A notebook entry can be a drawing, a short written response or a dictated explanation. The local material pack supplies the descriptions and data needed for each investigation. Keep labels and a text description with diagrams so another person can follow the evidence and distinguish an observed value from a proposed explanation.",
		"Differentiation Project: Two-Level Prompt":
			"Use the same P/Q plant table for two questions. K–2 prompt: which plant ended taller, and what detail shows that? Grades 3–5 prompt: how much did each grow, and what limits a causal explanation? Write or discuss one response to each.\n\n**Checkpoints:** The younger route cites 9 and 6 cm as final heights. The older route computes 4 and 1 cm growth, identifies the light comparison and retains uncertainty.",
		"Differentiation Project: Sentence Frame Bank":
			"Complete three frames with the supplied pond evidence: “I observe ___”; “My claim is ___ because ___”; and “More evidence about ___ would help.” K–2 can use the A and D minnow counts. Grades 3–5 can compare heron counts with observation hours.\n\n**Checkpoints:** An observation cites the table, a claim stays within it and the follow-up identifies a relevant missing measurement. For A versus C herons, use 0.5 and 0.75 observations per hour before ranking."
	},
	"K-2 and 3-5 Online Science Scope Map": {
		"K-2 Primary Science Path":
			"The early route recognizes observable patterns and explains one relationship at a time: living versus nonliving evidence, food-source arrows, weather differences, material properties, pushes and pulls, light paths and repeating daylight states. ES1's observation/inference distinction carries through these topics. A labelled drawing or sort and one because sentence can demonstrate the target relationship. The supplied scene, object or data description establishes what the explanation must refer to.",
		"Grades 3-5 Upper Elementary Path":
			"The later route adds comparable values, graph labels, multi-step relationships and model limits. Examples include growth differences in ES1, observation effort in ES3, weather graphs in ES4, competing material criteria in ES5 and position changes in ES6. ES7 compares controlled frequency/amplitude cases; ES8 compares model purposes and revisions. The deeper response uses these supplied records, distinguishes a description from a cause and identifies evidence that could change the conclusion.",
		"Engineering Every Year":
			"A design problem specifies a goal and limits before comparing options. The cover case requires transparency and water resistance ratings of at least 4 with mass at most 2. Adding flexibility at least 4 rejects the earlier plastic choice, and no supplied material passes every requirement. A useful revision changes a requirement or proposes a new material and test. K–2 can compare two choices; grades 3–5 can check every criterion and retain the failed case.",
		"Physical-Material Boundary":
			"Required evidence comes from the local descriptions, tables and model states. Physical supplies are optional only; no activity requires beakers, chemicals, heat, food, kits, outdoor collection or construction. The shadow task uses two supplied states rather than a flashlight demonstration, and the machine task compares a paper design with a recorded failure. A drawing or model proposal is labelled as such, so it does not imply that a physical experiment was performed.",
		"K-2 Project: Picture Evidence Notebook":
			"Use Mystery Scene A's text description as the picture's evidence equivalent. Draw and label its puddles, droplets and cloud cover, then give one possible explanation. Finish with a question about additional evidence.\n\n**Checkpoints:** Three details match the supplied scene; the explanation is labelled as an inference; a because sentence connects it to one detail; and the follow-up remains answerable by some relevant observation rather than by personal certainty.",
		"Grades 3-5 Project: Fair-Test Data Story":
			"Use P and Q's plant records. State the question, identify light duration as the supplied changed condition, growth as the measured comparison, and water amount and starting height as equal values. Draw growth bars and write a claim/evidence/reasoning response.\n\n**Checkpoints:** Growth is 4 and 1 cm. The conclusion is limited to the fictional comparison; unspecified plant characteristics and the small sample prevent a universal causal claim. Propose an additional comparable case rather than inventing its result."
	}
};

const practiceSections: Record<string, [string, string]> = {
	"Practice Project: Draw-and-label Observation Notebook": [
		"observation-inference-and-fair-comparison-cards",
		"science-practices-key"
	],
	"Practice Project: Sort or Classify Image Cards": [
		"living-things-and-structure-function-cases",
		"living-things-key"
	],
	"Practice Project: Weather Graph From Provided Data": [
		"weather-water-and-earth-change-data",
		"weather-water-and-earth-key"
	],
	"Practice Project: Paper Bridge or Tower Design with Optional Physical Build":
		["matter-and-materials-data", "matter-and-materials-key"],
	"Practice Project: Animal Habitat Model with Drawing and Explanation": [
		"living-things-and-structure-function-cases",
		"living-things-key"
	],
	"Resource Project: Simulation-to-CER Writeup": [
		"light-sound-and-signal-cases",
		"light-sound-and-signals-key"
	],
	"Resource Project: Model Critique": [
		"sky-pattern-and-planet-model-cards",
		"sky-and-models-key"
	],
	"Differentiation Project: Two-Level Prompt": [
		"observation-inference-and-fair-comparison-cards",
		"science-practices-key"
	],
	"Differentiation Project: Sentence Frame Bank": [
		"food-web-and-population-cases",
		"ecosystems-key"
	],
	"K-2 Project: Picture Evidence Notebook": [
		"observation-inference-and-fair-comparison-cards",
		"science-practices-key"
	],
	"Grades 3-5 Project: Fair-Test Data Story": [
		"observation-inference-and-fair-comparison-cards",
		"science-practices-key"
	]
};

export function applyElementaryScienceReferences(course: RawCourse) {
	let replaced = 0;
	for (const module of course.modules) {
		const entries = elementaryScienceReferences[module.title];
		if (!entries) continue;
		const items = [...module.curriculum, ...module.supplementalProjects];
		if (items.length !== Object.keys(entries).length) {
			throw new Error(
				`Elementary Science reference count changed: ${module.title}`
			);
		}
		for (const item of items) {
			const content = entries[item.title];
			if (!content) {
				throw new Error(
					`Missing Elementary Science reference: ${item.title}`
				);
			}
			const sections = practiceSections[item.title];
			if (
				item.title ===
				"Decision: Keep One Course with K-2 and 3-5 Paths"
			) {
				item.id =
					"elementary-science-elementary-science-grade-band-paths-curriculum-decision-keep-one-course-with-k-2-and-3-5-paths";
				item.title = "Choosing a Grade-Band Route";
			}
			item.content = content;
			item.preserveInstructions = true;
			item.preserveAssignment = true;
			item.contentKind = sections ? "assignment" : "reading";
			item.learningPath = "choice";
			item.datasetLink =
				"/course-assets/elementary-science/elementary-science-materials-pack.md";
			item.solutionLink =
				"/course-assets/elementary-science/elementary-science-rubrics-answer-key.md";
			if (sections) {
				item.datasetLink += `#${sections[0]}`;
				item.solutionLink += `#${sections[1]}`;
				item.content += `\n\n[Case inputs](/course-resource?asset=${encodeURIComponent(
					item.datasetLink
				)})\n\n[Project self-check](/course-resource?asset=${encodeURIComponent(
					item.solutionLink
				)})`;
			}
			replaced++;
		}
	}
	if (replaced !== 39)
		throw new Error("Expected all39Elementary Science reference records.");
}
