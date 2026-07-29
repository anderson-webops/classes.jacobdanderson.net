import type { RawCourse, RawCourseModuleItem } from "./types";

const middleSchoolIntegratedScienceSourceCourse: RawCourse = {
	name: "Middle School Integrated Science",
	modules: [
		{
			title: "MS1 Scientific Reasoning, Models, and Data",
			curriculum: [
				{
					title: "Remote Science Workflow",
					content:
						"No specialized science equipment or required household experiments are needed. The course uses notebooks, shared simulations, images, public datasets, diagrams, short readings, and structured discussion. Optional observations are included only when they are safe, simple, and replaceable with an equivalent data or simulation option."
				},
				{
					title: "Progression Map: Reasoning, Models, and Data",
					content:
						"Core path: identify variables, controls, claims, evidence, and model limitations in short scenarios. Stretch path: revise flawed investigations, choose graph types, explain uncertainty, and compare two possible interpretations of the same data. The module builds a repeatable evidence routine that applies to life, Earth, physical, and space science."
				},
				{
					title: "Questions, Variables, and Fair Tests",
					content:
						"Independent variables, dependent variables, controls, constants, and fair tests define whether evidence can answer a scientific question. Sample scenarios show what changes, what is measured, and what must stay the same."
				},
				{
					title: "Models as Useful Simplifications",
					content:
						"Models are tools for explaining systems, not perfect copies of reality. Diagrams, simulations, graphs, equations, and written explanations each reveal some details while hiding or simplifying others."
				},
				{
					title: "Data Practice: Tables, Graphs, and Pattern Claims",
					content:
						"Use a small dataset to practice choosing graph types, labeling axes, identifying trends, and writing a claim with evidence. Distinguish a pattern in the data from a possible explanation for the pattern."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Experimental Design Critique",
					content:
						"Review a flawed experiment description. Identify the question, variables, missing controls, possible confounders, and a revised procedure that would make the test more reliable."
				},
				{
					title: "Project: Data Story One-Pager",
					content:
						"Create a one-page explanation from a provided dataset. Include a table or graph, a claim, two evidence points, and one limitation or uncertainty."
				}
			]
		},
		{
			title: "MS2 Cells, Microscopes, and Body Systems",
			curriculum: [
				{
					title: "Cells as the Basic Unit of Life",
					content:
						"Cells are the basic unit of life, and cell theory connects living things to repeated evidence from observation. Microscope images or virtual slides support comparisons among plant, animal, and bacterial cells while keeping structure and function connected."
				},
				{
					title: "Progression Map: Cells and Systems",
					content:
						"Core path: match cell structures to jobs and connect cells, tissues, organs, and body systems. Stretch path: explain how several systems coordinate in a case, identify what an analogy hides, and trace matter, energy, or information through the model. The emphasis is function and interaction rather than memorizing labels alone."
				},
				{
					title: "Organelles and Cell Jobs",
					content:
						"Cover the nucleus, cell membrane, cytoplasm, mitochondria, chloroplasts, cell wall, and vacuole. Keep the focus on the job of each structure and how cells meet life needs."
				},
				{
					title: "From Cells to Body Systems",
					content:
						"Connect cells, tissues, organs, and organ systems. Use the digestive, respiratory, circulatory, nervous, and muscular systems to show how specialized parts work together."
				},
				{
					title: "Guided Practice: System Interaction Case Study",
					content:
						"Use a case such as running up stairs, eating lunch, or reacting to a hot surface. Trace which body systems are involved and how matter, energy, or information moves."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Cell Analogy With Limits",
					content:
						"Create an analogy for a cell, such as a city, school, factory, or game world. Match at least six cell parts to jobs and include a section explaining where the analogy breaks down."
				},
				{
					title: "Project: Body Systems Flowchart",
					content:
						"Build a flowchart showing how at least three body systems work together in a real situation. Include arrows, short explanations, and one question the model does not answer."
				}
			]
		},
		{
			title: "MS3 Genetics, Traits, and Adaptation",
			curriculum: [
				{
					title: "DNA, Genes, and Inherited Traits",
					content:
						"DNA sequences, gene products, environmental conditions, and development can all influence traits. Inherited variation is distinguished from learned behavior without treating a gene as a guaranteed one-to-one instruction for a visible outcome."
				},
				{
					title: "Progression Map: Traits and Adaptation",
					content:
						"Core path: distinguish inherited traits, learned behaviors, variation, and environmental pressure. Stretch path: interpret trait-frequency data, explain why individuals do not choose to evolve, and connect adaptation claims to population-level evidence over generations. Simulations and datasets keep the reasoning visible without physical manipulatives."
				},
				{
					title: "Variation and Natural Selection",
					content:
						"Individuals in a population vary, and some variations can affect survival and reproduction. Simulations or screen-based card examples can model the pattern without physical manipulatives."
				},
				{
					title: "Adaptations Are Population-Level Changes",
					content:
						"Clarify that individual organisms do not choose to evolve. Populations change over generations when inherited traits become more or less common."
				},
				{
					title: "Guided Practice: Trait Data and Environmental Pressure",
					content:
						"Analyze a small dataset showing trait frequencies before and after an environmental change. Describe the frequency pattern, explain a possible selection pathway, and identify evidence needed to distinguish it from chance or sampling effects."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Adaptation Evidence Brief",
					content:
						"Choose an organism and explain one adaptation. Include the environmental challenge, the trait, how the trait helps, and what evidence would support the explanation."
				},
				{
					title: "Project: Selection Simulation Reflection",
					content:
						"Use a provided simulation or dataset to track how trait frequencies change. Summarize the starting variation, environmental pressure, result, and one limitation of the model."
				}
			]
		},
		{
			title: "MS4 Ecosystems, Energy Flow, and Human Impact",
			curriculum: [
				{
					title: "Energy Flow and Matter Cycling",
					content:
						"Producers, consumers, decomposers, food webs, and energy pyramids describe how ecosystems move resources. Energy flows through ecosystems while matter cycles through organisms and the environment."
				},
				{
					title: "Progression Map: Ecosystems and Human Impact",
					content:
						"Core path: trace energy through food webs and identify limiting factors in population graphs. Stretch path: evaluate biodiversity, indirect effects, stakeholder tradeoffs, and evidence quality in a human-impact case. The module connects ecological models to decisions without reducing the issue to one simple answer."
				},
				{
					title: "Population Dynamics",
					content:
						"Carrying capacity, limiting factors, competition, predation, disease, and resource availability all affect population size. Graphs and scenarios make it possible to predict population changes from evidence."
				},
				{
					title: "Biodiversity and Ecosystem Stability",
					content:
						"Connect biodiversity to resilience and ecosystem services. Use examples such as pollination, soil health, clean water, fisheries, and forests."
				},
				{
					title: "Case Study: Human Impact and Tradeoffs",
					content:
						"Analyze a case involving land use, pollution, invasive species, conservation, or climate pressure. Identify stakeholders, benefits, costs, and evidence."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Ecosystem Impact Memo",
					content:
						"Write a short memo about a human impact on an ecosystem. Include background, affected organisms, evidence, tradeoffs, and one practical recommendation."
				},
				{
					title: "Project: Food Web Stability Analysis",
					content:
						"Create or analyze a food web, then remove or increase one organism. Predict direct and indirect effects and explain which relationships are most important."
				}
			]
		},
		{
			title: "MS5 Earth Systems, Weather, and Climate Data",
			curriculum: [
				{
					title: "Earth as Interacting Systems",
					content:
						"The geosphere, hydrosphere, atmosphere, and biosphere are interacting Earth systems. One event, such as a wildfire, storm, or drought, can affect several systems at once."
				},
				{
					title: "Progression Map: Earth Systems and Climate",
					content:
						"Core path: read maps and graphs for weather variables, Earth-system interactions, and short-term patterns. Stretch path: separate weather from climate, interpret long-term data trends, and name uncertainty or scale limits in the evidence. The course uses public datasets and maps so reasoning stays source-based."
				},
				{
					title: "Weather, Air Masses, and Forecasting",
					content:
						"Cover temperature, pressure, humidity, fronts, wind, clouds, and precipitation. Use maps and forecasts to show how meteorologists infer future conditions from current data."
				},
				{
					title: "Climate Patterns and Climate Change",
					content:
						"Distinguish weather from climate and short-term variation from long-term trends. Use graphs of temperature, precipitation, or carbon dioxide and discuss evidence-based reasoning."
				},
				{
					title: "Data Practice: Reading Earth Science Graphs",
					content:
						"Analyze a real or simplified dataset involving temperature, precipitation, sea level, storm frequency, or carbon dioxide. Identify the trend, scale, and uncertainty."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Weather Forecast Reasoning",
					content:
						"Use a weather map or forecast data to write a reasoned forecast for a city. Include current conditions, expected change, evidence, and one uncertainty."
				},
				{
					title: "Project: Climate Data Explainer",
					content:
						"Create a slide or one-page explainer for a climate dataset. Include a graph, trend statement, possible causes or impacts, and a note about what the data does not prove by itself."
				}
			]
		},
		{
			title: "MS6 Matter, Atoms, and Chemical Change",
			curriculum: [
				{
					title: "Atoms, Elements, Molecules, and Compounds",
					content:
						"Particle-level explanations connect visible matter to atoms, elements, molecules, compounds, mixtures, and pure substances. Diagrams and formulas help distinguish these categories."
				},
				{
					title: "Progression Map: Matter and Chemical Change",
					content:
						"Core path: classify matter, compare physical and chemical changes, and track particles before and after a change. Stretch path: use conservation of matter to explain coefficients, identify uncertainty in reaction evidence, and decide when a scenario lacks enough information. Diagrams and simulations replace unsafe or impractical reactions."
				},
				{
					title: "Conservation of Matter",
					content:
						"Atoms are rearranged during physical and chemical changes, but matter is conserved in closed systems. Balanced visual models can show conservation without requiring physical reactions."
				},
				{
					title: "Physical vs. Chemical Change",
					content:
						"Compare melting, dissolving, cutting, burning, rusting, cooking, and reacting. Gas formation, color change, temperature change, and precipitate formation can be clues, but each clue needs context and does not prove by itself that a new substance formed."
				},
				{
					title: "Simulation Practice: Particle Models of Reactions",
					content:
						"Use an online particle model or provided diagrams. Track atoms before and after a reaction and explain why coefficients are needed in simple chemical equations."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Particle Model Explanation",
					content:
						"Create a before-and-after particle diagram for a physical or chemical change. Label atoms or molecules and explain what changed and what stayed conserved."
				},
				{
					title: "Project: Chemical Change Evidence Case File",
					content:
						"Review a set of provided scenarios and classify each as physical change, chemical change, or not enough information. Explain the evidence and uncertainty for each case."
				}
			]
		},
		{
			title: "MS7 Energy, Heat, and Engineering Tradeoffs",
			curriculum: [
				{
					title: "Forms and Transfers of Energy",
					content:
						"Kinetic, potential, thermal, chemical, electrical, light, and sound energy are useful categories for tracking systems. The focus is energy transfer and transformation rather than memorizing isolated forms."
				},
				{
					title: "Progression Map: Energy and Engineering",
					content:
						"Core path: identify energy inputs, outputs, transfers, and losses in diagrams. Stretch path: compare efficiency, cost, reliability, safety, and environmental constraints before recommending a design improvement. The module treats engineering as evidence-based tradeoff analysis."
				},
				{
					title: "Heat Transfer",
					content:
						"Heat transfer can happen through conduction, convection, and radiation. Use diagrams, simulations, and everyday examples to identify which transfer method dominates in a given scenario."
				},
				{
					title: "Energy Efficiency and Constraints",
					content:
						"Useful energy, wasted energy, efficiency, cost, reliability, safety, and environmental impact all shape engineering decisions. The topic works as a tradeoff analysis, not a single right answer."
				},
				{
					title: "Guided Practice: Energy Flow Diagrams",
					content:
						"Draw energy flow diagrams for systems such as a phone charging, a roller coaster, a lamp, a refrigerator, or a car. Identify inputs, outputs, and losses."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Energy Audit From a Diagram",
					content:
						"Analyze a provided diagram of a home, device, vehicle, or school system. Identify where energy enters, where it is used, where it is lost, and one improvement with tradeoffs."
				},
				{
					title: "Project: Heat Transfer Storyboard",
					content:
						"Create a storyboard explaining conduction, convection, and radiation in one setting. Use arrows and short labels to show the direction of energy transfer."
				}
			]
		},
		{
			title: "MS8 Forces, Motion, and Graphs",
			curriculum: [
				{
					title: "Position, Speed, Velocity, and Acceleration",
					content:
						"Define motion quantities and relate them to everyday examples. Use simple calculations and graphs to connect words, numbers, and visual representations."
				},
				{
					title: "Progression Map: Forces and Motion",
					content:
						"Core path: describe motion with words, numbers, and position-time or speed-time graphs. Stretch path: draw free-body diagrams, connect net force to motion changes, and explain Newton's laws through scenario evidence. The same scenario can be represented as a story, graph, diagram, and calculation."
				},
				{
					title: "Newton's Laws in Plain Language",
					content:
						"Inertia, force causing acceleration, and action-reaction pairs provide a plain-language entry point to Newton's laws. Diagrams and scenarios are more useful here than formal derivations."
				},
				{
					title: "Gravity, Friction, and Normal Force",
					content:
						"Common forces and free-body diagrams simplify motion problems by showing which forces act on one object. Practice includes force arrows and predictions about whether motion changes."
				},
				{
					title: "Data Practice: Motion Graph Interpretation",
					content:
						"Analyze position-time and speed-time graphs. Describe motion, calculate simple speed, and identify where an object is speeding up, slowing down, or staying steady."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Motion Graph Comic",
					content:
						"Create a story that matches a provided motion graph, or create a motion graph for a story. Include labels for speed changes and explain how the graph shows the motion."
				},
				{
					title: "Project: Force Diagram Challenge Set",
					content:
						"Draw free-body diagrams for several provided scenarios. For each, predict whether the object speeds up, slows down, changes direction, or stays balanced."
				}
			]
		},
		{
			title: "MS9 Waves, Light, Sound, Electricity, and Magnetism",
			curriculum: [
				{
					title: "Wave Properties",
					content:
						"Amplitude, wavelength, frequency, and wave speed describe wave behavior. Simulations and diagrams can compare water waves, sound waves, light waves, and seismic waves."
				},
				{
					title: "Progression Map: Waves and Electricity",
					content:
						"Core path: name wave properties, compare light and sound interactions, and model simple circuits. Stretch path: explain how waves carry information, compare series and parallel circuit behavior, and connect magnetism to fields, motors, or generators. Virtual builders and diagrams provide the evidence base."
				},
				{
					title: "Light and Sound Interactions",
					content:
						"Reflection, absorption, transmission, refraction, echoes, pitch, and loudness show how waves interact with matter. Waves carry energy and information, so the same vocabulary supports both science and communication examples."
				},
				{
					title: "Electricity and Circuits",
					content:
						"Charge, current, voltage, resistance, conductors, insulators, series circuits, and parallel circuits can be modeled with virtual circuit builders rather than physical components."
				},
				{
					title: "Magnetism and Electromagnetism",
					content:
						"Magnetic poles, fields, compasses, motors, generators, and electromagnets can be handled at a conceptual level. Visual field models and simple cause-and-effect reasoning are enough for this stage."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Virtual Circuit Investigation",
					content:
						"Use a circuit simulation or provided screenshots to compare series and parallel circuits. Explain how brightness, current path, and failure behavior differ."
				},
				{
					title: "Project: Wave Communication Design",
					content:
						"Create a communication system that uses light, sound, radio, or another wave. Explain the source, signal, receiver, possible interference, and one design improvement."
				}
			]
		},
		{
			title: "MS10 Space Systems and Integrated Science Capstone",
			curriculum: [
				{
					title: "Earth, Moon, Sun, and Gravity",
					content:
						"Day and night, seasons, Moon phases, eclipses, tides, and orbital motion can be explained with models and animations. Model limitations and common misconceptions stay visible."
				},
				{
					title: "Progression Map: Space Systems and Capstone",
					content:
						"Core path: use models to explain sky patterns, scale, gravity, and planetary conditions. Stretch path: critique model distortions, explain evidence from light, and revise a capstone claim after feedback. The final presentation combines question, evidence, model, limitation, and next question."
				},
				{
					title: "Solar System Scale and Planetary Conditions",
					content:
						"Planets, moons, asteroids, and comets can be compared by distance, size, gravity, atmosphere, temperature, and surface conditions. Scale models are difficult because space is enormous, but they are still useful for reasoning."
				},
				{
					title: "Stars, Galaxies, and Evidence From Light",
					content:
						"Stars, galaxies, spectra, and the idea that light carries information about distant objects connect astronomy to evidence. The focus remains on scientific inference from observations."
				},
				{
					title: "Capstone Studio: Research, Model, Explain, Revise",
					content:
						"Choose a question from life science, Earth science, physical science, or space science. Build a model or analysis, explain evidence, receive feedback, and revise the final presentation."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Space Systems Model Critique",
					content:
						"Compare two models of a space system such as Moon phases, seasons, or the solar system. Identify what each model explains well, what it distorts, and how to improve it."
				},
				{
					title: "Project: Middle School Science Capstone",
					content:
						"Create a final science presentation with a question, background, data or evidence, model, explanation, limitation, and next question. The format can be slides, a written brief, or a recorded explanation."
				}
			]
		}
	]
};

const MIDDLE_SCHOOL_SCIENCE_REFERENCES = {
	nasaBiomes:
		"https://science.nasa.gov/kids/earth/mission-biomes/teacherresource/",
	nasaClimateEvidence: "https://science.nasa.gov/climate-change/evidence/",
	nasaSolarSystem:
		"https://science.nasa.gov/solar-system/solar-system-facts/",
	ngssStandards: "https://www.nextgenscience.org/standards",
	nhgriTraits: "https://www.genome.gov/genetics-glossary/Trait",
	nigmsCells: "https://www.nigms.nih.gov/education/glossary",
	phetMiddleSchool:
		"https://phet.colorado.edu/files/guides/MiddleSchool_en.pdf",
	usgsEarthquakes: "https://earthquake.usgs.gov/education/"
} as const;

const MIDDLE_SCHOOL_SCIENCE_MATERIALS = {
	answerKey:
		"/course-assets/middle-school-science/middle-school-science-rubrics-answer-key.md",
	pack: "/course-assets/middle-school-science/middle-school-science-materials-pack.md"
} as const;

function middleSchoolScienceMaterial(section: string) {
	return `${MIDDLE_SCHOOL_SCIENCE_MATERIALS.pack}#${section}`;
}

function middleSchoolScienceAnswerKey(section: string) {
	return `${MIDDLE_SCHOOL_SCIENCE_MATERIALS.answerKey}#${section}`;
}

interface MiddleSchoolScienceFlow {
	estimatedTime: string;
	keyBlocks: string[];
	phenomenon: string;
	corePath: string;
	stretchPath: string;
	evidenceGate: string;
	boundary: string;
	referenceLink: string;
	materialSection: string;
	answerSection: string;
}

const MIDDLE_SCHOOL_SCIENCE_FLOW: Record<string, MiddleSchoolScienceFlow> = {
	"MS1 Scientific Reasoning, Models, and Data": {
		estimatedTime: "4–5 sessions (45–60 minutes each)",
		keyBlocks: [
			"Phenomenon notice and question sort",
			"Variable and fair-comparison analysis",
			"Table and graph construction",
			"Claim-evidence-reasoning draft",
			"Model limitation critique",
			"Data-story revision"
		],
		phenomenon:
			"Three fictional school-pond datasets report the same system with different sample sizes, observation times, and graph scales, creating a useful question about which claims the evidence can support.",
		corePath:
			"Name the question, variables, comparison, data source, pattern, and one limitation. Build a labeled table or graph and write a bounded claim with two exact evidence points.",
		stretchPath:
			"Compare alternate graph choices and explanations, identify confounding or sampling effects, revise a flawed investigation, and state what new evidence would distinguish the competing explanations.",
		evidenceGate:
			"Every claim identifies its source, units, sample or observation window, and relevant values. Pattern, mechanism, correlation, and causation remain separately labeled.",
		boundary:
			"A graph does not create a cause, a model is not the system itself, a controlled comparison can still be limited, and uncertainty does not make all explanations equally supported.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.ngssStandards,
		materialSection: "reasoning-models-and-data-cases",
		answerSection: "reasoning-models-and-data-key"
	},
	"MS2 Cells, Microscopes, and Body Systems": {
		estimatedTime: "4–5 sessions (45–60 minutes each)",
		keyBlocks: [
			"Scale and microscope evidence",
			"Cell-structure function mapping",
			"Plant-animal-bacterial comparison",
			"Cell-to-system organization model",
			"Fictional body-system case",
			"Analogy limitation revision"
		],
		phenomenon:
			"A supplied image-and-data set compares plant, animal, and bacterial cells and then traces oxygen, nutrients, and signals through a fictional runner case without asking learners to disclose health or body information.",
		corePath:
			"Identify observable image evidence, match selected structures to supported functions, and connect cells, tissues, organs, and systems in one supplied case.",
		stretchPath:
			"Compare magnification and scale, distinguish model color from observed color, trace matter or information through interacting systems, and critique where a familiar cell analogy fails.",
		evidenceGate:
			"Structure-function claims cite a visible or supplied feature and a supported job. Body-system explanations identify at least three interacting parts and the direction of matter, energy, or information transfer.",
		boundary:
			"Diagrams and microscope images use different scales and may use false color. Organelles are interacting structures, not independent people or miniature organs, and a classroom case cannot diagnose health.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nigmsCells,
		materialSection: "cells-and-body-systems-cases",
		answerSection: "cells-and-body-systems-key"
	},
	"MS3 Genetics, Traits, and Adaptation": {
		estimatedTime: "5 sessions (45–60 minutes each)",
		keyBlocks: [
			"DNA-gene-chromosome model",
			"Genotype-phenotype-environment sort",
			"Probability and sample-size check",
			"Variation dataset analysis",
			"Selection pathway model",
			"Population explanation revision"
		],
		phenomenon:
			"A fictional beetle population has inherited color variation, changing habitat conditions, unequal survival, and repeated-generation frequency data, while a second dataset shows how chance and sample size can produce a different pattern.",
		corePath:
			"Distinguish gene, allele, genotype, phenotype, inherited variation, environmental influence, and learned behavior. Describe changes in population trait frequencies with exact values.",
		stretchPath:
			"Compare selection with drift or sampling effects, explain how mutation and recombination contribute variation, use probability without calling outcomes guaranteed, and evaluate an alternate explanation.",
		evidenceGate:
			"Evolution claims use population data across generations and connect inherited variation, environmental conditions, differential reproductive success, and changing frequencies. Individual outcomes remain probabilistic.",
		boundary:
			"No task collects learner or family traits, ancestry, health, or genetic information. Human social categories are not treated as simple biological divisions, and one gene is not presented as a destiny for a complex trait.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nhgriTraits,
		materialSection: "genetics-variation-and-selection-cases",
		answerSection: "genetics-variation-and-selection-key"
	},
	"MS4 Ecosystems, Energy Flow, and Human Impact": {
		estimatedTime: "5 sessions (45–60 minutes each)",
		keyBlocks: [
			"Food-web arrow convention",
			"Energy and matter tracing",
			"Population and sampling analysis",
			"Biodiversity measure comparison",
			"Human-impact pathway map",
			"Decision and monitoring revision"
		],
		phenomenon:
			"A fictional estuary case combines a food web, population counts with unequal survey effort, water-quality measurements, habitat change, and several stakeholder options.",
		corePath:
			"Trace energy and matter, interpret population patterns, calculate or compare a simple biodiversity measure, and map one human action to an ecological response.",
		stretchPath:
			"Normalize unequal sampling effort, compare direct and indirect effects, distinguish hazard from exposure and risk, evaluate distributional tradeoffs, and design a monitoring trigger.",
		evidenceGate:
			"Food-web arrows follow the stated convention, population claims account for effort and time, biodiversity claims name the measure, and recommendations trace to ecological evidence plus criteria and constraints.",
		boundary:
			"Energy flows while matter cycles, carrying capacity can change, biodiversity is not a single universal number, and a detected pollutant release does not by itself establish every exposure or health outcome.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nasaBiomes,
		materialSection: "ecosystems-and-human-impact-cases",
		answerSection: "ecosystems-and-human-impact-key"
	},
	"MS5 Earth Systems, Weather, and Climate Data": {
		estimatedTime: "5–6 sessions (45–60 minutes each)",
		keyBlocks: [
			"Earth-system interaction map",
			"Weather-map evidence",
			"Forecast and uncertainty check",
			"Climate trend and attribution ladder",
			"Plate-boundary evidence comparison",
			"Earth-history model revision"
		],
		phenomenon:
			"A supplied regional case pairs a seven-day weather sequence, a multi-decade climate series, and maps of earthquakes, volcanoes, rocks, and fossils. Each claim must be matched to the correct time and space scale.",
		corePath:
			"Read weather variables and maps, distinguish forecast from observation, identify a long-term climate pattern, and connect clustered geologic evidence to plate-boundary models.",
		stretchPath:
			"Quantify trend and variability, move through a detection-attribution-impact claim ladder, compare several lines of plate-tectonic and Earth-history evidence, and name resolution or proxy limits.",
		evidenceGate:
			"Weather and climate claims state time span, location, variable, units, and uncertainty. Earth-history claims combine independent evidence such as fossils, rock ages, seafloor patterns, earthquakes, or volcanoes.",
		boundary:
			"One storm does not establish a climate trend, one graph alone does not establish attribution, tectonic hazards are not evenly distributed risk, and maps or timelines compress scale.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nasaClimateEvidence,
		materialSection: "earth-weather-climate-and-geologic-cases",
		answerSection: "earth-weather-climate-and-geologic-key"
	},
	"MS6 Matter, Atoms, and Chemical Change": {
		estimatedTime: "5 sessions (45–60 minutes each)",
		keyBlocks: [
			"Substance and mixture classification",
			"Particle-symbol-formula translation",
			"Closed-system mass analysis",
			"Physical-chemical evidence sort",
			"Reaction model conservation check",
			"Uncertainty case revision"
		],
		phenomenon:
			"A sealed-reaction data set includes particle diagrams, formulas, mass measurements, temperature records, and deliberately ambiguous visible changes.",
		corePath:
			"Classify substances and mixtures, translate among particle pictures and formulas, track each atom before and after a change, and identify which observations are clues rather than proof.",
		stretchPath:
			"Balance a simple visual equation, explain apparent mass change in open versus closed boundaries, compare competing explanations for ambiguous evidence, and identify a decisive follow-up observation.",
		evidenceGate:
			"Each particle type has a legend, subscripts remain distinct from coefficients, every atom count is conserved in the closed-system model, and chemical-change claims require converging evidence for new substances.",
		boundary:
			"Particles and bonds are models at an unseen scale. Color, gas, precipitate, odor, or temperature change alone can have more than one explanation, and the course uses no household reactions.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
		materialSection: "matter-atoms-and-reaction-cases",
		answerSection: "matter-atoms-and-reaction-key"
	},
	"MS7 Energy, Heat, and Engineering Tradeoffs": {
		estimatedTime: "5 sessions (45–60 minutes each)",
		keyBlocks: [
			"System boundary and energy stores",
			"Transfer pathway diagram",
			"Temperature and thermal-energy comparison",
			"Conduction-convection-radiation model",
			"Engineering constraint matrix",
			"Design revision and monitoring"
		],
		phenomenon:
			"Three fictional insulated-container designs have different masses, costs, temperature histories, and reliability notes, allowing both science explanation and engineering comparison.",
		corePath:
			"Define the system, identify energy stores and transfers, distinguish temperature from thermal energy, and use the provided table to compare designs against stated criteria.",
		stretchPath:
			"Calculate simple efficiency or rate comparisons, explain transfer mechanisms at particle and system scales, conduct sensitivity checks when criteria weights change, and revise a design.",
		evidenceGate:
			"Energy diagrams name the system boundary, initial and final stores, transfer pathway, and surroundings. Engineering recommendations use common tests and report both benefit and tradeoff.",
		boundary:
			"Energy is conserved in the wider model even when it becomes less useful, cold does not flow as a substance, temperature is not total thermal energy, and no design is best without criteria and constraints.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
		materialSection: "energy-heat-and-engineering-cases",
		answerSection: "energy-heat-and-engineering-key"
	},
	"MS8 Forces, Motion, and Graphs": {
		estimatedTime: "5 sessions (45–60 minutes each)",
		keyBlocks: [
			"Reference frame and motion story",
			"Position-time graph analysis",
			"Speed and acceleration comparison",
			"Free-body diagram construction",
			"Net-force prediction",
			"Representation consistency revision"
		],
		phenomenon:
			"A fictional cart journey is represented as a story, position table, position-time graph, velocity description, and force diagrams that include one intentional mismatch.",
		corePath:
			"Describe motion relative to a reference frame, calculate average speed over supplied intervals, interpret graph slope qualitatively, draw forces on one selected object, and predict motion change from net force.",
		stretchPath:
			"Compare position-time and velocity-time representations, distinguish velocity from acceleration, reason across balanced and unbalanced cases, and diagnose inconsistencies among story, graph, calculation, and diagram.",
		evidenceGate:
			"Axes, units, intervals, direction convention, and selected object are explicit. Force arrows represent interactions on that object, and a motion claim agrees with both the graph and net-force model.",
		boundary:
			"Motion does not require a net force, balanced forces do not require rest, action-reaction forces act on different objects, and a flat position-time segment differs from a flat velocity-time segment.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
		materialSection: "forces-motion-and-graph-cases",
		answerSection: "forces-motion-and-graphs-key"
	},
	"MS9 Waves, Light, Sound, Electricity, and Magnetism": {
		estimatedTime: "5–6 sessions (45–60 minutes each)",
		keyBlocks: [
			"Wave property representation",
			"Amplitude-frequency distinction",
			"Signal encoding and interference",
			"Series-parallel circuit comparison",
			"Electric and magnetic field model",
			"Accessible design revision"
		],
		phenomenon:
			"A fictional emergency communication system combines light pulses, sound waveforms, two circuit designs, and an electromagnet, with noisy and component-failure cases.",
		corePath:
			"Identify wave properties, distinguish amplitude from frequency, trace sender-signal-path-receiver, compare series and parallel current paths qualitatively, and model a magnetic interaction.",
		stretchPath:
			"Connect wave representations to encoded information, evaluate interference and accessibility, use voltage-current-resistance relationships qualitatively or numerically, and explain motor or generator energy transfer.",
		evidenceGate:
			"Wave claims name the representation and measured variable. Circuit claims trace complete paths and compare one controlled change; field models label source, direction convention, and interaction evidence.",
		boundary:
			"Wave drawings are not literal moving ropes in every medium, amplitude and frequency describe different features, current is not used up, voltage is not current, and field lines are a representation rather than physical threads.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
		materialSection: "waves-circuits-and-signals-cases",
		answerSection: "waves-circuits-and-signals-key"
	},
	"MS10 Space Systems and Integrated Science Capstone": {
		estimatedTime: "6–7 sessions (45–60 minutes each)",
		keyBlocks: [
			"Sky-pattern evidence sequence",
			"Earth-moon-sun geometry model",
			"Gravity and orbit explanation",
			"Solar-system scale comparison",
			"Evidence-from-light inference",
			"Capstone defense and revision"
		],
		phenomenon:
			"Repeated sky observations, model snapshots, planetary data, and spectra support several explanations while revealing that no single diagram can preserve geometry, motion, size, distance, and time scale at once.",
		corePath:
			"Use repeated evidence to explain day and night, Moon phases, seasons, and orbital motion; compare planetary properties with consistent units; and complete a source-based capstone.",
		stretchPath:
			"Critique competing space models, use gravity and evidence from light to justify inferences, quantify one scale relationship, compare an alternate explanation, and revise the capstone after feedback.",
		evidenceGate:
			"Sky claims use dated or sequenced observations, models label viewpoint and scale, planetary comparisons use consistent properties and units, and capstone claims trace to accessible sources.",
		boundary:
			"Moon phases are not Earth's shadow, seasons are not caused mainly by Earth-Sun distance, an orbit is continuous falling rather than no gravity, and a diagram rarely preserves every scale simultaneously.",
		referenceLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nasaSolarSystem,
		materialSection: "space-systems-and-capstone-cases",
		answerSection: "space-systems-and-capstone-key"
	}
};

const MIDDLE_SCHOOL_SCIENCE_ADDITIONS: Record<string, RawCourseModuleItem[]> = {
	"MS1 Scientific Reasoning, Models, and Data": [
		{
			title: "Investigation Design and Data Integrity Gate",
			content: [
				"**Question-to-evidence chain:** Rewrite a broad question so it names a measurable outcome, one changed condition, a comparison, and a time or sample boundary. Mark independent variable, dependent variable, controls, constants, repeated observations, and any factor that differs unintentionally.",
				"**Data integrity:** Keep raw values, units, missing entries, observation effort, and exclusions visible. Do not silently drop an inconvenient value or switch graph scales. A derived average or rate links back to the exact rows used.",
				"**Decision check:** Classify each conclusion as description, association, possible mechanism, or causal claim. Match claim strength to the design rather than adding stronger verbs after seeing a pattern.",
				"**Mastery check:** Repair the supplied pond comparison, explain why unequal observation time matters, and name one additional measure that would distinguish two plausible causes."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"reasoning-models-and-data-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"reasoning-models-and-data-key"
			),
			learningPath: "core"
		},
		{
			title: "Model, Graph, and CER Revision Gate",
			content: [
				"**Representation choice:** Use a bar graph for category comparisons, a line graph for ordered time values, a scatterplot for paired quantitative variables, and a table when exact values matter more than visual trend. State why the chosen representation fits the question.",
				"**Model critique:** Label the system boundary, represented parts, interactions, scale, time step, and omitted factors. A useful model can be simplified without being dishonest when its purpose and omissions are explicit.",
				"**CER revision:** Quote or calculate two evidence points, connect them to a mechanism, compare one alternate explanation, and narrow the claim when the data cannot decide between alternatives.",
				"**Mastery check:** Find the deliberate mismatch among the supplied table, graph, and caption; correct it; then write what evidence would change the revised claim."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"reasoning-models-and-data-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"reasoning-models-and-data-key"
			),
			learningPath: "core"
		}
	],
	"MS2 Cells, Microscopes, and Body Systems": [
		{
			title: "Cell Evidence, Scale, and Structure-Function Gate",
			content: [
				"**Image routine:** Record specimen, image type, scale bar or stated magnification, visible structures, labels supplied by the source, and whether colors are natural, stained, or digitally assigned. Observation stays separate from the explanatory cell model.",
				"**Comparison:** Plant, animal, and bacterial cells share cellular organization but differ in represented structures. Match membrane, cytoplasm, genetic material, mitochondria, chloroplast, cell wall, nucleus, and vacuole only where the supplied model supports them.",
				"**Structure-function claim:** Name a structure, its relevant feature, its supported contribution, and the process or system that depends on it. Avoid one-to-one factory slogans when the interaction among structures matters.",
				"**Mastery check:** Compare three supplied cells, correct one false-color observation, and identify one function the still image cannot demonstrate directly."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"cells-and-body-systems-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nigmsCells,
			solutionLink: middleSchoolScienceAnswerKey(
				"cells-and-body-systems-key"
			),
			learningPath: "core"
		},
		{
			title: "Body-System Interaction and Privacy Gate",
			content: [
				"**System map:** Use only the fictional runner case. Trace oxygen from environment to respiratory and circulatory pathways, nutrients from digestive pathways, chemical or electrical signals from nervous pathways, and movement through muscular and skeletal interactions.",
				"**Causal chain:** For each arrow, name what moves, the source, destination, and why the transfer matters. More than one system can contribute to the same observable response.",
				"**Privacy boundary:** No pulse, diet, diagnosis, disability, medical history, fitness, or body measurement is collected. Learners analyze the same supplied case and can respond with text, diagram, or narrated explanation.",
				"**Mastery check:** Build a three-system chain, identify a missing transfer in the flawed model, and state one limitation that prevents the case from serving as medical advice."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"cells-and-body-systems-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"cells-and-body-systems-key"
			),
			learningPath: "core"
		}
	],
	"MS3 Genetics, Traits, and Adaptation": [
		{
			title: "Genotype, Phenotype, Environment, and Probability Gate",
			content: [
				"**Model chain:** DNA is organized into chromosomes; a gene is a DNA region with a biological role; alleles are sequence variants; genotype records selected alleles; phenotype is an observed or measured outcome influenced by genotype, environment, development, and chance.",
				"**Probability:** A probability predicts a distribution over many comparable events, not a guaranteed result for one offspring or organism. Small samples can differ noticeably from expected ratios.",
				"**Trait boundary:** Use only fictional organisms and supplied records. Complex human traits, ability, identity, behavior, ancestry, and health are not reduced to single-gene classroom categories.",
				"**Mastery check:** Repair a one-gene-destiny claim, compare expected and observed counts, and identify whether genotype, environment, both, or insufficient evidence best fits each supplied case."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"genetics-variation-and-selection-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nhgriTraits,
			solutionLink: middleSchoolScienceAnswerKey(
				"genetics-variation-and-selection-key"
			),
			learningPath: "core"
		},
		{
			title: "Variation, Selection, and Population-Change Gate",
			content: [
				"**Variation sources:** Mutation can introduce sequence variation, while recombination and reproduction reshuffle existing alleles. Environmental conditions affect which inherited variations influence survival and reproduction in a particular setting.",
				"**Selection chain:** Begin with variation, identify the environmental condition, compare reproductive outcomes, follow frequencies across generations, and test whether the pattern is larger than expected sampling variation.",
				"**Alternative explanations:** Drift, migration, measurement error, or a second environmental variable can also change observed frequencies. Natural selection is supported when the full evidence chain fits better than these alternatives.",
				"**Mastery check:** Use exact beetle-frequency values, reject intentional or goal-directed evolution language, and state one additional dataset needed to separate selection from chance."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"genetics-variation-and-selection-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"genetics-variation-and-selection-key"
			),
			learningPath: "core"
		}
	],
	"MS4 Ecosystems, Energy Flow, and Human Impact": [
		{
			title: "Food-Web, Population, and Biodiversity Gate",
			content: [
				"**Arrow convention:** Arrows point from a food or energy source to the organism receiving transferred energy. Energy enters most course webs through producers and disperses as heat; atoms and nutrients move through organisms, waste, decomposers, and environmental reservoirs.",
				"**Population evidence:** Report counts together with area, time, method, and effort. A carrying-capacity estimate can change when resources, habitat, competitors, predators, disease, or climate conditions change.",
				"**Biodiversity evidence:** Species richness, relative abundance, and evenness answer different questions. Compare the same measure under comparable sampling before claiming one site is more diverse or stable.",
				"**Mastery check:** Correct reversed arrows, normalize the unequal surveys, compare richness with evenness, and predict one direct plus one indirect effect of a population change."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"ecosystems-and-human-impact-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"ecosystems-and-human-impact-key"
			),
			learningPath: "core"
		},
		{
			title: "Release, Exposure, Risk, Distribution, and Decision Gate",
			content: [
				"**Impact pathway:** Separate source or action, environmental release, transport, exposure pathway, measured ecological response, uncertainty, and possible consequence. A concentration at one station cannot automatically represent every organism, time, or location.",
				"**Decision matrix:** Compare options using ecological benefit, cost, feasibility, timing, reversibility, uncertainty, and how burdens or benefits are distributed among supplied stakeholder groups.",
				"**Monitoring:** Define an indicator, baseline, measurement schedule, threshold, and response if the intervention underperforms or creates an unintended effect.",
				"**Mastery check:** Build one complete pathway from the estuary case, remove an unsupported health claim, select an option conditionally, and name a trigger for revising the recommendation."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"ecosystems-and-human-impact-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nasaBiomes,
			solutionLink: middleSchoolScienceAnswerKey(
				"ecosystems-and-human-impact-key"
			),
			learningPath: "core"
		}
	],
	"MS5 Earth Systems, Weather, and Climate Data": [
		{
			title: "Weather, Climate, and Attribution Claim Gate",
			content: [
				"**Scale check:** Weather describes short-term atmospheric conditions; climate describes distributions and patterns over longer periods and regions. Record variable, location, time span, baseline, units, and data completeness before interpreting a trend.",
				"**Claim ladder:** First detect a pattern, then compare possible drivers, then evaluate attribution evidence, then discuss projected or observed impacts. Evidence sufficient for one rung does not automatically establish the next.",
				"**Variability and uncertainty:** Short-term variation can continue within a long-term trend. Uncertainty intervals, measurement limits, and model ranges refine claim strength rather than erasing well-supported patterns.",
				"**Mastery check:** Write one bounded weather forecast, one climate trend claim, one attribution statement supported by multiple evidence lines, and one claim the supplied data cannot establish."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"earth-weather-climate-and-geologic-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nasaClimateEvidence,
			solutionLink: middleSchoolScienceAnswerKey(
				"earth-weather-climate-and-geologic-key"
			),
			learningPath: "core"
		},
		{
			title: "Rock, Fossil, and Plate-Boundary Evidence Gate",
			content: [
				"**Multiple evidence lines:** Compare continental shapes cautiously, then add matching fossils and rock units, seafloor age and magnetic patterns, earthquake depth, volcano locations, and measured plate motion.",
				"**Boundary model:** Divergent, convergent, and transform boundaries describe relative motion; specific hazards and landforms depend on plate type, geometry, material, rate, and local conditions. A plate is not identical to a continent.",
				"**Deep-time scale:** Relative order, index fossils, radiometric ages supplied by the source, and cross-cutting relationships answer different chronology questions. Timelines and maps compress immense time and distance.",
				"**Mastery check:** Use three independent lines of evidence to support one boundary interpretation, distinguish hazard from risk, and identify what the map or classroom model omits."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"earth-weather-climate-and-geologic-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.usgsEarthquakes,
			solutionLink: middleSchoolScienceAnswerKey(
				"earth-weather-climate-and-geologic-key"
			),
			learningPath: "core"
		}
	],
	"MS6 Matter, Atoms, and Chemical Change": [
		{
			title: "Particle, Symbol, Formula, and Conservation Gate",
			content: [
				"**Representation ladder:** A particle picture uses a legend, a chemical symbol names an element, a formula records a composition, and an equation represents a modeled change. These representations are related but not interchangeable.",
				"**Counting rule:** Subscripts count atoms within one represented particle; coefficients count repeated particles or formula units. Balance by changing coefficients, never by changing the identity encoded in a formula.",
				"**System boundary:** Track atoms and measured mass inside the stated boundary. Apparent mass loss in an open system can reflect matter leaving the measurement region rather than destroyed atoms.",
				"**Mastery check:** Translate one particle model into formulas, balance the visual reaction, verify each atom count, and explain why the sealed mass remains constant within measurement resolution."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"matter-atoms-and-reaction-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"matter-atoms-and-reaction-key"
			),
			learningPath: "core"
		},
		{
			title: "Chemical-Change Evidence and Uncertainty Gate",
			content: [
				"**Evidence bundle:** Temperature, gas, color, light, odor, precipitate, conductivity, pH, or property change can contribute evidence, but each observation can have physical or measurement alternatives.",
				"**Classification routine:** Record observations, identify the proposed new substance, connect particle or property evidence, compare a physical-change explanation, and classify as physical, chemical, or insufficient evidence.",
				"**Safety and access:** All cases use supplied diagrams, measurements, and simulation states. No tasting, smelling, mixing, heating, household chemical, or improvised reaction is part of the course.",
				"**Mastery check:** Classify the ambiguous cases without appearance shortcuts and choose the most informative follow-up measurement for each."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"matter-atoms-and-reaction-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
			solutionLink: middleSchoolScienceAnswerKey(
				"matter-atoms-and-reaction-key"
			),
			learningPath: "core"
		}
	],
	"MS7 Energy, Heat, and Engineering Tradeoffs": [
		{
			title: "Energy Storage, Transfer, and System-Boundary Gate",
			content: [
				"**Energy account:** Define the system and time interval, identify initial and final energy stores, label transfers by heating, mechanical work, electrical work, or radiation, and include the surroundings when energy leaves the selected system.",
				"**Conservation:** A device can transfer energy into less useful thermal stores without destroying it. Useful output and efficiency depend on the task and boundary, so every comparison states both.",
				"**Cross-scale explanation:** Connect observable temperature or motion changes to a particle or interaction model while labeling which features are inferred rather than directly seen.",
				"**Mastery check:** Balance a qualitative energy account for two supplied devices, find the missing surroundings transfer, and explain why low efficiency is not missing energy."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"energy-heat-and-engineering-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"energy-heat-and-engineering-key"
			),
			learningPath: "core"
		},
		{
			title: "Heat, Temperature, and Engineering Comparison Gate",
			content: [
				"**Thermal distinction:** Temperature relates to average particle kinetic energy in the course model; thermal energy also depends on amount and composition. Heating is energy transfer caused by a temperature difference, not a material stored inside an object.",
				"**Transfer mechanisms:** Conduction involves interactions within or between materials, convection involves bulk fluid motion, and radiation can transfer energy through empty space. More than one can operate in one system.",
				"**Fair engineering test:** Compare common starting conditions, measurement times, and criteria. Use cost, mass, performance, safety, accessibility, and reliability together rather than naming one universally best design.",
				"**Mastery check:** Interpret the container temperature table, identify dominant modeled transfers, apply the decision matrix, and revise the recommendation when one criterion weight changes."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"energy-heat-and-engineering-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
			solutionLink: middleSchoolScienceAnswerKey(
				"energy-heat-and-engineering-key"
			),
			learningPath: "core"
		}
	],
	"MS8 Forces, Motion, and Graphs": [
		{
			title: "Net Force and Free-Body Diagram Gate",
			content: [
				"**Object first:** Name one object, draw only forces acting on that object, label each interaction source, and use a consistent arrow-length convention. Do not place the action-reaction partner on the same diagram.",
				"**Net-force reasoning:** Combine forces by direction. Zero net force supports constant velocity in the simplified model; nonzero net force supports acceleration in the net-force direction, not necessarily motion in that direction.",
				"**Interaction pairs:** Newton's third-law pair forces are equal and opposite interactions on different objects. They do not cancel on one object's free-body diagram.",
				"**Mastery check:** Correct three supplied diagrams, calculate qualitative or numerical net force, and predict whether velocity changes while keeping direction and reference frame explicit."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"forces-motion-and-graph-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"forces-motion-and-graphs-key"
			),
			learningPath: "core"
		},
		{
			title: "Motion Graph, Slope, and Representation Gate",
			content: [
				"**Graph routine:** Read title, axes, units, scale, direction convention, and interval. On a position-time graph, slope represents velocity; on a velocity-time graph, vertical value represents velocity and change in that value indicates acceleration.",
				"**Story consistency:** Match each story segment to table values, graph shape, velocity sign, and any net-force explanation. Returning to the start means position returns to zero, not that total distance is zero.",
				"**Calculation boundary:** Average speed uses total distance over elapsed time; average velocity uses displacement over elapsed time. A single average can hide changes within the interval.",
				"**Mastery check:** Locate the deliberate mismatch in the cart packet, correct it, calculate one interval and whole-trip quantity, and explain what the graph cannot reveal about the forces by itself."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"forces-motion-and-graph-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
			solutionLink: middleSchoolScienceAnswerKey(
				"forces-motion-and-graphs-key"
			),
			learningPath: "core"
		}
	],
	"MS9 Waves, Light, Sound, Electricity, and Magnetism": [
		{
			title: "Wave Property, Information, and Representation Gate",
			content: [
				"**Representation:** Label equilibrium, amplitude, wavelength, time or distance axis, frequency, and medium or field context. A spatial snapshot and a time trace can look similar while answering different questions.",
				"**Property distinction:** Amplitude and frequency vary independently in the supplied cases. For sound, pitch is associated with frequency and perceived loudness relates to amplitude plus source, medium, distance, and receiver conditions.",
				"**Information system:** Identify sender, encoding rule, signal, pathway, receiver, decoding rule, interference, error check, and accessible alternate route. The message is information represented by the wave, not the matter moving from sender to receiver.",
				"**Mastery check:** Decode the pulse table, repair an amplitude-frequency mix-up, compare two interference cases, and revise the design so it does not rely on sound or color alone."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"waves-circuits-and-signals-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"waves-circuits-and-signals-key"
			),
			learningPath: "core"
		},
		{
			title: "Circuit, Field, and Energy-Transfer Gate",
			content: [
				"**Circuit model:** Trace every closed conducting path, identify source and components, compare series and parallel arrangements, and explain what changes when one branch opens. Current is a rate around the circuit, while voltage represents an energy-per-charge difference.",
				"**Controlled comparison:** Change one component or arrangement at a time and use the same source model. Brightness alone is a qualitative clue unless the supplied measurement defines the comparison.",
				"**Field and device model:** Electric and magnetic fields represent interactions across space. Motors transfer electrical energy toward motion; generators transfer motion-related energy toward electrical pathways within the simplified model.",
				"**Mastery check:** Explain the branch-failure data, correct the used-up-current claim, annotate one field model, and identify energy inputs, outputs, and losses in an electromagnet device."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"waves-circuits-and-signals-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.phetMiddleSchool,
			solutionLink: middleSchoolScienceAnswerKey(
				"waves-circuits-and-signals-key"
			),
			learningPath: "core"
		}
	],
	"MS10 Space Systems and Integrated Science Capstone": [
		{
			title: "Sky Pattern, Gravity, Orbit, and Scale-Model Gate",
			content: [
				"**Observation before model:** Sequence dated or timed sky observations, then use geometry and motion models to explain the pattern. Label viewpoint, light source, illuminated half, observer location, direction, and time step.",
				"**Gravity and orbit:** Gravity continually changes an orbiting object's velocity direction. The object has tangential motion and inward acceleration; orbit does not mean gravity disappears.",
				"**Scale honesty:** State whether a model preserves order, relative size, distance, period, direction, or geometry. A classroom page cannot usually preserve all of them, and decorative spacing does not become measured distance.",
				"**Mastery check:** Correct Moon-phase and season misconceptions, compare two orbital models, quantify one supplied scale ratio, and name what each representation omits."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"space-systems-and-capstone-cases"
			),
			projectLink: MIDDLE_SCHOOL_SCIENCE_REFERENCES.nasaSolarSystem,
			solutionLink: middleSchoolScienceAnswerKey(
				"space-systems-and-capstone-key"
			),
			learningPath: "core"
		},
		{
			title: "Capstone Evidence, Alternatives, and Revision Gate",
			content: [
				"**Proposal:** Define a supplied phenomenon or design problem, system boundary, question, evidence sources, vocabulary, representation, criteria for success, and a realistic schedule before creating the polished product.",
				"**Analysis:** Keep source notes and calculations traceable, compare at least one alternate explanation or design, distinguish observed from inferred or modeled features, and state uncertainty or missing evidence.",
				"**Revision:** Obtain feedback against the rubric, preserve the first version, change a substantive claim, model, graph, or decision, and explain which evidence motivated the change.",
				"**Defense:** Present the claim or recommendation, point to evidence, explain mechanism, name the strongest limitation, answer what evidence would change the conclusion, and provide an equivalent text route for every visual or audio element."
			].join("\n\n"),
			datasetLink: middleSchoolScienceMaterial(
				"space-systems-and-capstone-cases"
			),
			solutionLink: middleSchoolScienceAnswerKey(
				"space-systems-and-capstone-key"
			),
			learningPath: "core"
		}
	]
};

const MIDDLE_SCHOOL_SCIENCE_PROJECT_COMPLETION: Record<string, string> = {
	"Project: Experimental Design Critique":
		"Core: identify the question, independent and dependent variables, comparison, two controlled conditions, one confounder, and a revised fairer design. Stretch: preserve raw-data and exclusion rules, add repetition or sampling logic, distinguish association from causation, and explain which added evidence would separate two explanations.",
	"Project: Data Story One-Pager":
		"Core: include source, table or graph, labels and units, one bounded claim, two exact evidence points, reasoning, and one limitation. Stretch: compare a second representation or explanation, normalize unequal effort when applicable, add uncertainty, and state what evidence would change the claim.",
	"Project: Cell Analogy With Limits":
		"Core: map six supplied cell structures to supported functions and explain two places the analogy fails. Stretch: distinguish observed image features from model features, add interactions among structures, include scale or false-color limits, and replace one misleading one-to-one match.",
	"Project: Body Systems Flowchart":
		"Core: use the fictional case to connect at least three systems and label matter, energy, or information on every arrow. Stretch: add cellular or tissue scale, a feedback or timing relationship, one alternative pathway, and a clear statement that the model is not diagnosis.",
	"Project: Adaptation Evidence Brief":
		"Core: identify inherited variation, environmental condition, differential outcome, population frequency change, exact evidence, and one model limitation for a supplied organism. Stretch: compare selection with drift, migration, or sampling error and name data that would discriminate among them.",
	"Project: Selection Simulation Reflection":
		"Core: report starting variation, rule, generations, frequency results, and one claim supported by the simulation. Stretch: run or analyze repeated trials, quantify variability, test a changed condition, compare an alternate mechanism, and reject intentional-evolution language.",
	"Project: Ecosystem Impact Memo":
		"Core: map action, ecological pathway, affected populations, evidence, two stakeholders, tradeoff, and conditional recommendation. Stretch: separate release, exposure, response, and risk; compare distributional effects; add a monitoring indicator, threshold, and revision trigger.",
	"Project: Food Web Stability Analysis":
		"Core: use a labeled arrow convention, include producers, consumers, decomposers, matter reservoir, and predict one direct plus one indirect population effect. Stretch: account for sampling effort, compare richness and evenness, evaluate an alternate pathway, and state why stability is conditional.",
	"Project: Weather Forecast Reasoning":
		"Core: cite current conditions and at least three mapped or tabular variables, make a bounded forecast, and name one uncertainty. Stretch: compare model or station evidence, calculate a simple change, explain forecast confidence, and identify why the short record cannot establish climate.",
	"Project: Climate Data Explainer":
		"Core: identify source, variable, units, location, time span, baseline, trend, variability, and one limitation. Stretch: separate detection, attribution, and impact claims, use multiple evidence lines for attribution, represent uncertainty, and correct one false-balance or single-event argument.",
	"Project: Particle Model Explanation":
		"Core: provide a legend, before-and-after particles, formulas, atom counts, system boundary, and conservation statement. Stretch: balance the visual equation with coefficients, compare open and closed measurements, connect particle and observable scales, and state one model omission.",
	"Project: Chemical Change Evidence Case File":
		"Core: classify each supplied case as physical, chemical, or insufficient evidence and justify it without single-clue shortcuts. Stretch: compare alternate explanations, identify the proposed new substance or property evidence, and select a decisive safe follow-up measurement.",
	"Project: Energy Audit From a Diagram":
		"Core: define the system, initial and final stores, inputs, useful output, transfers to surroundings, and one evidence-based improvement. Stretch: calculate a supplied efficiency or rate, compare criteria and constraints, perform a sensitivity check, and add a monitoring or reliability condition.",
	"Project: Heat Transfer Storyboard":
		"Core: show conduction, convection, and radiation with direction, source, receiver, and system boundary in one supplied setting. Stretch: connect observable and particle-scale models, distinguish temperature from thermal energy, compare mechanism strength, and revise one misleading cold-flow frame.",
	"Project: Motion Graph Comic":
		"Core: make story, position table, position-time graph, units, direction, and interval descriptions agree. Stretch: add velocity representation, calculate distance and displacement, explain slope, identify changing acceleration, and diagnose one deliberate mismatch.",
	"Project: Force Diagram Challenge Set":
		"Core: choose one object per case, label interactions, draw force arrows, determine net force, and predict velocity change. Stretch: quantify supplied forces, separate third-law pairs across objects, compare balanced moving and resting cases, and reconcile each diagram with motion data.",
	"Project: Virtual Circuit Investigation":
		"Core: compare supplied series and parallel circuits using complete paths, component states, and branch-failure evidence. Stretch: use voltage, current, and resistance values when provided, explain energy transfer, critique brightness-only evidence, and revise the design for reliability and accessibility.",
	"Project: Wave Communication Design":
		"Core: define sender, code, wave or signal, pathway, receiver, message, and one interference test. Stretch: compare amplitude and frequency choices, add error detection and a non-audio/non-color route, test two failure conditions, and revise from evidence.",
	"Project: Space Systems Model Critique":
		"Core: compare what two supplied models represent, explain, distort, and omit for one space phenomenon. Stretch: add viewpoint, geometry, gravity, time, and quantitative scale analysis; correct a phase, season, or orbit misconception; and propose a better combined representation.",
	"Project: Middle School Science Capstone":
		"Core: include question, source log, data or model, claim, two evidence points, reasoning, limitation, and revision. Stretch: compare an alternative, quantify uncertainty or sensitivity, connect multiple science disciplines or engineering constraints, preserve before-and-after evidence, and defend what would change the conclusion."
};

function middleSchoolScienceProjectPath(title: string) {
	return /critique|case file|challenge|impact memo|capstone/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

export const middleSchoolIntegratedScienceCourse: RawCourse = {
	...middleSchoolIntegratedScienceSourceCourse,
	modules: middleSchoolIntegratedScienceSourceCourse.modules.map(module => {
		const flow = MIDDLE_SCHOOL_SCIENCE_FLOW[module.title];
		const referenceIsMedia =
			flow.referenceLink.includes("phet.colorado.edu");
		const curriculum = module.curriculum.map((item, index) => ({
			...item,
			content: [
				index === 0
					? "**Teaching flow:** No specialized science equipment or required household experiments are needed; specialized science equipment or household experiments are not required for any core or stretch route. Begin with the supplied phenomenon, inspect evidence before vocabulary, complete the core route, and end by revising one claim, model, graph, or design decision."
					: "",
				item.content,
				`**Supplied phenomenon:** ${flow.phenomenon}`,
				`**Core route:** ${flow.corePath}`,
				`**Stretch route:** ${flow.stretchPath}`,
				`**Science explanation:** ${flow.evidenceGate}`,
				`**Model and claim boundary:** ${flow.boundary}`,
				`**Authoritative reference:** [Open the module reference](${flow.referenceLink}).`
			]
				.filter(Boolean)
				.join("\n\n"),
			datasetLink:
				item.datasetLink ??
				(index === 0
					? referenceIsMedia
						? middleSchoolScienceMaterial(flow.materialSection)
						: flow.referenceLink
					: middleSchoolScienceMaterial(flow.materialSection)),
			mediaLink:
				item.mediaLink ??
				(index === 0 && referenceIsMedia
					? flow.referenceLink
					: undefined),
			solutionLink:
				item.solutionLink ??
				middleSchoolScienceAnswerKey(flow.answerSection),
			learningPath: "core" as const
		}));
		const additions = MIDDLE_SCHOOL_SCIENCE_ADDITIONS[module.title].map(
			item => ({
				...item,
				content: [
					item.content,
					`**Supplied phenomenon:** ${flow.phenomenon}`,
					`**Core route:** ${flow.corePath}`,
					`**Stretch route:** ${flow.stretchPath}`,
					`**Science explanation:** ${flow.evidenceGate}`,
					`**Model and claim boundary:** ${flow.boundary}`
				].join("\n\n"),
				projectLink: item.projectLink ?? flow.referenceLink
			})
		);
		const supplementalProjects = module.supplementalProjects.map(item => ({
			...item,
			content: [
				item.content,
				`**Supplied phenomenon:** ${flow.phenomenon}`,
				`**Completion route:** ${MIDDLE_SCHOOL_SCIENCE_PROJECT_COMPLETION[item.title]}`,
				`**Science explanation:** ${flow.evidenceGate}`,
				`**Model and claim boundary:** ${flow.boundary}`
			].join("\n\n"),
			datasetLink:
				item.datasetLink ??
				middleSchoolScienceMaterial(flow.materialSection),
			solutionLink:
				item.solutionLink ??
				middleSchoolScienceAnswerKey(flow.answerSection),
			learningPath: middleSchoolScienceProjectPath(item.title)
		}));

		return {
			...module,
			estimatedTime: flow.estimatedTime,
			keyBlocks: flow.keyBlocks,
			curriculum: [...curriculum, ...additions],
			supplementalProjects
		};
	}),
	developmentMetadata: {
		priority: "soon",
		standards: [
			"NGSS middle-school physical, life, Earth/space, and engineering performance expectations",
			"Science and engineering practices: questions, models, investigations, data, mathematics, explanations, argument, information, and design",
			"Crosscutting concepts: patterns; cause and effect; scale; systems; energy and matter; structure and function; stability and change",
			"Evidence literacy across tables, graphs, simulations, maps, particle models, field models, and source-based explanations",
			"Engineering criteria, constraints, fair comparison, tradeoff analysis, monitoring, and revision"
		],
		sourcePolicy:
			"Maintains the ten-module integrated sequence and all 20 named projects while making every core task runnable from supplied evidence, explicit core and stretch routes, local material and answer packs, traceable public references, and noninteractive alternatives.",
		assessmentCadence: [
			"One source-based table, graph, model, map, or system diagram in every module",
			"One bounded claim with exact evidence plus one alternate explanation or model limitation",
			"One core route available to every learner and one stretch route using the same phenomenon",
			"One misconception or representation correction and one changed-condition prediction per module",
			"Project revision after rubric feedback, culminating in a traceable capstone defense"
		],
		toolchain: [
			"Notebook, paper, or digital document",
			"Supplied Middle School Science materials pack and answer rubric",
			"Shared images, structured descriptions, tables, maps, graph cards, particle models, and simulation states",
			"Authoritative NGSS, NIH, NHGRI, NASA, USGS, and PhET references",
			"Optional interactive simulation, video, or audio with a supplied noninteractive data, image, transcript, or event-table route"
		],
		safetyPolicy: [
			"No required chemicals, heat, food, organisms, electrical construction, outdoor sampling, household experiments, or improvised equipment",
			"No required health, body, family-trait, ancestry, location, household-resource, or disaster-experience disclosure",
			"Supplied fictional cases and datasets remain sufficient for every assessment",
			"Visual information includes labels and text; audio includes transcript or event data; color is never the only signal",
			"Hazard, health, climate, and environmental decisions stay source-based and do not replace local professional or emergency guidance"
		],
		courseBoundaries: [
			"Integrated middle-school breadth with explicit models and evidence, not a substitute for specialized laboratory courses",
			"Observation, measurement, inference, model, mechanism, prediction, correlation, causation, and recommendation remain distinct claim types",
			"Classroom models state system, scale, time, purpose, and omissions rather than presenting diagrams as literal reality",
			"Genetics uses fictional organisms and probabilistic population reasoning without personal trait collection or biological essentialism",
			"Climate, chemical-change, ecological-risk, and health-related claims match the strength and scale of supplied evidence"
		],
		capstoneExpectations: [
			"Question or design problem grounded in an approved supplied phenomenon",
			"Traceable source log and accessible evidence artifact",
			"Data display or model with system boundary, scale, labels, and uncertainty",
			"Claim or recommendation with mechanism and at least one alternative",
			"Criteria, constraints, fair comparison, and tradeoff record when designing",
			"Substantive before-and-after revision plus answer to what evidence would change the conclusion"
		],
		recommendedNextWork: [
			"Add anonymized exemplars for core and stretch routes at several communication levels.",
			"Archive selected public simulation states as locally owned screenshots and structured tables so external tools never become continuity requirements.",
			"Map each module to specific state or district grade-band expectations after the target adoption and sequence are selected."
		]
	}
};
