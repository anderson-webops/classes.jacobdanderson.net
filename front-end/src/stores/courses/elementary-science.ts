import type { RawCourse, RawCourseModuleItem } from "./types";

const ELEMENTARY_SCIENCE_REFERENCES = {
	nasaBiomes: "https://science.nasa.gov/kids/earth/mission-biomes/",
	nasaEarthKids: "https://science.nasa.gov/kids/earth/",
	nasaSpacePlace: "https://spaceplace.nasa.gov/menu/solar-system/",
	ngssEngineering35:
		"https://www.nextgenscience.org/topic-arrangement/3-5engineering-design",
	ngssEngineeringK2:
		"https://www.nextgenscience.org/dci-arrangement/k-2-ets1-engineering-design",
	ngssStandards: "https://www.nextgenscience.org/standards",
	phetElementaryGuide:
		"https://phet.colorado.edu/files/guides/ElementarySchool_en.pdf",
	usgsWaterCycle:
		"https://www.usgs.gov/special-topics/water-science-school/science/water-cycle-diagrams"
} as const;

const ELEMENTARY_SCIENCE_MATERIALS = {
	answerKey:
		"/course-assets/elementary-science/elementary-science-rubrics-answer-key.md",
	pack: "/course-assets/elementary-science/elementary-science-materials-pack.md"
} as const;

function elementaryScienceMaterial(section: string) {
	return `${ELEMENTARY_SCIENCE_MATERIALS.pack}#${section}`;
}

function elementaryScienceAnswerKey(section: string) {
	return `${ELEMENTARY_SCIENCE_MATERIALS.answerKey}#${section}`;
}

const elementaryScienceSourceCourse: RawCourse = {
	name: "Elementary Science",
	modules: [
		{
			title: "ES1 Scientists, Questions, and Evidence",
			curriculum: [
				{
					title: "Zoom Science Notebook",
					content:
						"No physical lab supplies are required beyond paper or notes. A notebook or digital document is used for dated vocabulary, sketches, questions, evidence, and short explanations. The Zoom format relies on shared images, simulations, short videos, discussion, paper sketches, and simple graphs."
				},
				{
					title: "Grade-Band Path: Observations and Evidence",
					content:
						"K-2 path: name what is visible, draw or sort examples, and explain one idea aloud or in a sentence frame. Grades 3-5 path: turn observations into a small table or graph, separate observation from inference, and write a short claim-evidence-reasoning explanation. The same image, clip, or dataset can support both levels by changing the expected evidence format and vocabulary depth."
				},
				{
					title: "Observing, Inferring, and Asking Testable Questions",
					content:
						"Observations describe what is directly visible or measurable, inferences explain what the evidence may mean, and testable questions point toward evidence that could be collected or analyzed. A mystery image or short nature clip can support five observations, two inferences, and one evidence-based question."
				},
				{
					title: "Guided Practice: Claims, Evidence, and Reasoning",
					content:
						"Claim-evidence-reasoning connects an answer, visible evidence, and an explanation. A claim about an image, animal behavior clip, weather map, or simple data table is stronger when it cites evidence from the source and explains why that evidence supports the claim."
				},
				{
					title: "Counting, Sorting, and Simple Graphs",
					content:
						"Observations can become data by sorting objects in a shared picture or provided dataset. A tally table and simple bar graph make the pattern visible, and the explanation separates what the graph shows from what it might mean."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Observation Field Guide Page",
					content:
						"Choose a plant, animal, rock, cloud, household object, or provided image. Create a field guide page with a labeled sketch, five observations, two questions, and one inference clearly marked as an inference."
				},
				{
					title: "Project: Evidence Detective Card",
					content:
						"Use a provided image, video still, or data table to write one scientific claim. Add three pieces of evidence and a short reasoning sentence that connects the evidence to the claim."
				}
			]
		},
		{
			title: "ES2 Living Things and Life Needs",
			curriculum: [
				{
					title: "What Makes Something Living?",
					content:
						"Living things can be recognized through needs, growth, response, reproduction, and cells at an elementary level. Clear examples and edge cases such as seeds, fire, robots, and viruses help separate everyday guesses from evidence-based classification without requiring advanced biology vocabulary."
				},
				{
					title: "Grade-Band Path: Living Things",
					content:
						"K-2 path: classify examples as living or nonliving, name one need, and connect one structure to a job. Grades 3-5 path: compare organisms with a table, explain structure and function with evidence, and use environment-change scenarios to predict survival challenges. Both paths keep vocabulary concrete before adding more abstract cause-and-effect reasoning."
				},
				{
					title: "Plants, Animals, and Survival Needs",
					content:
						"Compare plant and animal needs: water, energy, air, space, protection, and suitable conditions. Use diagrams and images to show that plants make food using sunlight while animals get energy by eating other organisms."
				},
				{
					title: "Guided Practice: Structure and Function",
					content:
						"Use animal and plant images to connect body parts to jobs. Examples can include bird beaks, fish fins, cactus spines, roots, leaves, claws, and fur. Explain how a structure helps a living thing survive."
				},
				{
					title: "Sensemaking Discussion: What Would Change If the Environment Changed?",
					content:
						"Present a change such as less rain, colder weather, fewer insects, or a new predator. Predict which organisms would struggle, which might do well, and what evidence supports the prediction."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Creature Survival Profile",
					content:
						"Choose a real or imagined creature and create a profile showing its habitat, needs, structures, behaviors, and survival challenges. The creature can be drawn on paper or built as a slide."
				},
				{
					title: "Project: Plant or Animal Compare Chart",
					content:
						"Compare two organisms using a table. Include what they need, where they live, how they get energy, and two structures that help each organism survive."
				}
			]
		},
		{
			title: "ES3 Habitats, Food Chains, and Ecosystems",
			curriculum: [
				{
					title: "Habitats and Ecosystem Parts",
					content:
						"Habitats are places that provide what organisms need. Living parts, such as plants and animals, can be separated from nonliving parts, such as sunlight, water, air, rocks, and temperature."
				},
				{
					title: "Grade-Band Path: Ecosystems",
					content:
						"K-2 path: identify living and nonliving parts, match organisms to needs, and draw simple food-chain arrows. Grades 3-5 path: build a small food web, trace cause and effect when one population changes, and use graph evidence to support a claim about ecosystem stability. The shared goal is understanding relationships, with older students carrying the reasoning through more links."
				},
				{
					title: "Producers, Consumers, and Decomposers",
					content:
						"Build food chains from shared pictures and simple cards. Explain producers, consumers, and decomposers, then emphasize that energy starts with sunlight for most ecosystems."
				},
				{
					title: "Guided Practice: Food Web Cause and Effect",
					content:
						"Move from one food chain to a small food web. Trace what happens if one organism becomes more common or less common, then follow the effects through the web."
				},
				{
					title: "Data Talk: Population Change",
					content:
						"Use a simple graph of animal or plant populations over time. Describe increases, decreases, and possible causes while separating what the graph shows from what it suggests."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Digital Food Web Poster",
					content:
						"Create a food web for a forest, ocean, desert, pond, or backyard ecosystem using drawings or slides. Include at least one producer, three consumers, one decomposer, and arrows showing energy flow."
				},
				{
					title: "Project: Ecosystem Change Scenario",
					content:
						"Write or present a short scenario where one ecosystem factor changes. Explain at least three effects on living things and identify which effects are supported directly by evidence."
				}
			]
		},
		{
			title: "ES4 Weather, Water, and Earth Changes",
			curriculum: [
				{
					title: "Weather Variables",
					content:
						"Temperature, wind, clouds, precipitation, and humidity describe weather with measurements and observations rather than only with feelings. Current weather maps or provided examples make these variables visible."
				},
				{
					title: "Grade-Band Path: Weather and Earth Systems",
					content:
						"K-2 path: observe sky conditions, match weather symbols to descriptions, and sequence water-cycle steps with pictures. Grades 3-5 path: read simple forecasts, compare data points, distinguish weather from longer patterns, and explain slow versus fast Earth changes with evidence from images or maps. Both paths use remote visuals instead of physical demonstrations."
				},
				{
					title: "The Water Cycle",
					content:
						"The water cycle connects evaporation, condensation, precipitation, runoff, and collection using diagrams and animation. Water changes location and state, but the same water is recycled through the system."
				},
				{
					title: "Guided Practice: Reading Weather Data",
					content:
						"Use a simple forecast, weather graph, or map. Identify patterns, make a short prediction, and explain which data points influenced the prediction."
				},
				{
					title: "Slow and Fast Earth Changes",
					content:
						"Compare slow changes such as erosion, weathering, and deposition with fast changes such as earthquakes, floods, and volcanic eruptions. Use images, maps, and animations rather than physical demonstrations."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Weather Report Script",
					content:
						"Create a short weather report using a provided forecast or map. Include temperature, precipitation chance, wind or clouds, one safety or planning recommendation, and one evidence sentence."
				},
				{
					title: "Project: Water Cycle Comic",
					content:
						"Draw or build a four-to-six panel comic following one drop of water through the water cycle. Use vocabulary labels and include at least one change of state."
				}
			]
		},
		{
			title: "ES5 Matter, Materials, and Changes",
			curriculum: [
				{
					title: "Solids, Liquids, and Gases",
					content:
						"States of matter can be described through shape, volume, and particle spacing using diagrams and simulations. Comparing examples shows why some materials are easy to classify while others are more complicated."
				},
				{
					title: "Grade-Band Path: Matter and Materials",
					content:
						"K-2 path: sort visible examples by state or property and describe them with everyday words. Grades 3-5 path: use property data to justify material choices, compare reversible and irreversible changes, and explain tricky examples with particle or evidence language. No physical samples are required because images, tables, and simulations provide the evidence. The shared goal is to move from naming what is visible toward explaining why a material fits a purpose, what evidence supports the claim, and which examples are difficult because they combine several properties at once."
				},
				{
					title: "Properties of Materials",
					content:
						"Material properties include color, texture, hardness, flexibility, transparency, absorbency, magnetism, and whether a material floats or sinks. Images and provided data can replace physical supplies while still supporting evidence-based choices. A useful comparison names both the property and the job the material needs to do: a window needs transparency, a bridge needs strength, and a towel needs absorbency. When two materials both seem reasonable, choose the one with stronger evidence and describe the tradeoff. The final claim uses because language: this material works because the evidence shows the needed property."
				},
				{
					title: "Guided Practice: Choosing Materials for a Purpose",
					content:
						"Use a design problem such as building an umbrella, backpack, bridge, or window. Choose materials from a list and justify the choices using properties."
				},
				{
					title: "Reversible and Irreversible Changes",
					content:
						"Compare changes such as melting, freezing, tearing, dissolving, cooking, burning, and rusting using safe images, videos, and examples. Decide whether the original material can be easily recovered."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Material Choice Pitch",
					content:
						"Choose a product and recommend materials for its parts. Explain at least three material properties and why each property matters for the product's job."
				},
				{
					title: "Project: Matter Sorting Board",
					content:
						"Create a sorting board for examples of solids, liquids, gases, reversible changes, and irreversible changes. Include at least one tricky example and explain why it is tricky."
				}
			]
		},
		{
			title: "ES6 Forces, Motion, and Simple Machines",
			curriculum: [
				{
					title: "Pushes, Pulls, Speed, and Direction",
					content:
						"A force is a push or pull that can change motion. Animations, short videos, and simple drawings can show starting, stopping, speeding up, slowing down, and changing direction."
				},
				{
					title: "Grade-Band Path: Forces and Motion",
					content:
						"K-2 path: use arrows and motion words to show pushes, pulls, starts, stops, and direction changes. Grades 3-5 path: compare force-arrow diagrams, read simple motion graphs, and explain how a simple machine changes force or distance. The older path adds graph reasoning while keeping the same visible motion examples."
				},
				{
					title: "Gravity, Friction, and Balanced Forces",
					content:
						"Explain gravity and friction with everyday examples. Use diagrams to show balanced and unbalanced forces, then predict motion from arrow models."
				},
				{
					title: "Guided Practice: Motion Graphs for Beginners",
					content:
						"Use a simple position-over-time graph to describe whether an object is still, moving slowly, or moving quickly. Keep the graph reading visual and intuitive."
				},
				{
					title: "Simple Machines as Force Helpers",
					content:
						"Levers, pulleys, wheels and axles, inclined planes, wedges, and screws are tools that make work easier by changing force or distance. Pictures and virtual examples keep the focus on how the machine changes the task."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Force Diagram Story",
					content:
						"Draw a short comic or slide sequence showing an object before, during, and after a force acts on it. Include arrows for forces and labels for motion changes."
				},
				{
					title: "Project: Simple Machine Scavenger Map",
					content:
						"Use images, memory, or provided examples to identify simple machines in everyday objects. Create a map or list with each object, the simple machine type, and the job it helps perform."
				}
			]
		},
		{
			title: "ES7 Light, Sound, and Signals",
			curriculum: [
				{
					title: "Light Travels and Interacts",
					content:
						"Light travels from a source and can be reflected, absorbed, or transmitted. Diagrams, images, and virtual ray models can show these interactions without requiring flashlights or physical materials."
				},
				{
					title: "Grade-Band Path: Light, Sound, and Signals",
					content:
						"K-2 path: identify sources, receivers, shadows, reflections, and sounds in pictures or short clips. Grades 3-5 path: draw paths for light or sound, compare signal designs, and explain why a signal carries information reliably or unreliably. The same phenomenon can be handled as vocabulary recognition first and model-based explanation second."
				},
				{
					title: "Shadows, Reflection, and Color",
					content:
						"Shadows form when light is blocked, and reflection helps explain how objects become visible. Color can be connected to the light that reaches our eyes at an age-appropriate level."
				},
				{
					title: "Sound as Vibration",
					content:
						"Sound comes from vibrations traveling through matter. Use videos, wave diagrams, and audio examples to compare loudness, pitch, and source."
				},
				{
					title: "Guided Practice: Signals and Communication",
					content:
						"Compare light and sound signals such as traffic lights, alarms, music, animal calls, and coded messages. Explain what information the signal carries and why the signal works."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Light Path Diagram",
					content:
						"Draw a diagram showing how light travels from a source, interacts with an object, and reaches an eye or camera. Include labels for source, object, reflection or blocking, and receiver."
				},
				{
					title: "Project: Signal Design Challenge",
					content:
						"Design a visual or sound-based signal for a classroom, game, or imaginary explorer team. Explain what the signal means, how it is detected, and why it avoids confusion."
				}
			]
		},
		{
			title: "ES8 Space, Patterns, and Science Design",
			curriculum: [
				{
					title: "Day, Night, and Sky Patterns",
					content:
						"The Sun, Moon, stars, day and night, and repeating sky patterns can be studied as observable patterns. Animations and diagrams show that many sky changes are patterns caused by motion."
				},
				{
					title: "Grade-Band Path: Space and Capstone Design",
					content:
						"K-2 path: observe repeating sky patterns, compare familiar objects, and use a drawing or oral explanation to describe a model. Grades 3-5 path: critique model scale, compare planetary properties, and build a capstone explanation with a question, evidence, model, and limitation. The capstone can stay visual for younger learners and become a fuller CER presentation for older learners."
				},
				{
					title: "Planets and the Solar System",
					content:
						"Planets can be compared by size, distance, surface, atmosphere, and temperature at an elementary level. Models are scaled-down tools, and no single classroom diagram shows all distances accurately."
				},
				{
					title: "Guided Practice: Model Strengths and Limits",
					content:
						"Compare two or three models of the same science idea, such as the solar system or water cycle. Identify what each model helps explain and what each model leaves out."
				},
				{
					title: "Course Capstone: Ask, Model, Explain",
					content:
						"Choose one science question, build a model or visual explanation, and present a claim supported by evidence. Keep the final product Zoom-friendly: slides, drawings, paper notes, or a short recorded explanation."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Solar System Comparison Card",
					content:
						"Create a comparison card for two planets or one planet and the Moon. Include at least four properties and explain one way the objects are similar and one way they are different."
				},
				{
					title: "Project: Elementary Science Capstone",
					content:
						"Choose a favorite topic from the course and create a short presentation with a question, vocabulary, model or diagram, evidence, and final explanation."
				}
			]
		}
	]
};

interface ElementaryScienceFlow {
	answerSection: string;
	estimatedTime: string;
	evidenceGate: string;
	keyBlocks: string[];
	k2Path: string;
	materialSection: string;
	misconceptionCheck: string;
	referenceLink: string;
	sharedPhenomenon: string;
	upperPath: string;
}

const ELEMENTARY_SCIENCE_FLOW: Record<string, ElementaryScienceFlow> = {
	"ES1 Scientists, Questions, and Evidence": {
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"observable phenomenon",
			"observation",
			"inference",
			"question",
			"fair comparison",
			"evidence explanation"
		],
		sharedPhenomenon:
			"Two supplied mystery scenes contain visible patterns but support more than one explanation. Learners first record what the source shows, then decide what additional evidence would distinguish the explanations.",
		k2Path: "Point, name, draw, tally, or sort three visible details; complete the frames I observe, I think, and I wonder; and explain one because sentence orally, by dictation, or in writing.",
		upperPath:
			"Organize observations in a table or graph, separate observation from inference, identify what changes and what is measured in a fair comparison, and write a short claim-evidence-reasoning response with one limitation.",
		evidenceGate:
			"Every response points to a supplied image, table, description, or simulation state; observation and inference remain separately labeled, and the claim does not exceed what that source can show.",
		misconceptionCheck:
			"Scientists do more than look, a question is not evidence, a graph does not explain its own cause, and a confident idea is still an inference until relevant evidence supports it.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.ngssStandards,
		materialSection: "observation-inference-and-fair-comparison-cards",
		answerSection: "science-practices-key"
	},
	"ES2 Living Things and Life Needs": {
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"living and nonliving evidence",
			"needs",
			"growth and response",
			"structure and function",
			"habitat fit",
			"changed condition"
		],
		sharedPhenomenon:
			"A supplied set of seed, plant, animal, robot, fire, and nonliving-object cases creates classification disagreements that can be resolved only by using several kinds of evidence over time.",
		k2Path: "Sort clear examples, name one need and one body or plant part, match that structure to a job, and use a picture or sentence frame to predict what happens when one needed condition changes.",
		upperPath:
			"Use a multi-criterion evidence table, distinguish an organism's structure from its behavior, compare two survival strategies, and defend a changed-environment prediction while naming an uncertainty.",
		evidenceGate:
			"A living-things claim cites more than movement, growth-like change, or one need; a structure-function claim names the structure, task, environmental condition, and evidence for the proposed advantage.",
		misconceptionCheck:
			"Movement alone does not make something alive, plants do not obtain food by eating soil, every helpful trait has limits, and an imagined creature remains a model rather than evidence about a real species.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.ngssStandards,
		materialSection: "living-things-and-structure-function-cases",
		answerSection: "living-things-key"
	},
	"ES3 Habitats, Food Chains, and Ecosystems": {
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"habitat needs",
			"living and nonliving parts",
			"producer",
			"consumer",
			"decomposer",
			"population evidence"
		],
		sharedPhenomenon:
			"A pond food-web card set and a four-period population graph show that one habitat change can affect several organisms through direct and indirect relationships.",
		k2Path: "Match organisms to habitat needs, identify living and nonliving parts, build one producer-to-consumer chain with labeled arrows, and describe one change using first-then language.",
		upperPath:
			"Build a small web with an explicit energy-arrow convention, add decomposers and a nonliving matter reservoir, interpret a population graph, and compare one direct with one indirect effect.",
		evidenceGate:
			"Food-web arrows follow one declared meaning, the Sun or another supported source begins the energy path, graph description remains separate from causal explanation, and uncertain links stay marked as predictions.",
		misconceptionCheck:
			"Arrows do not point toward the organism that looks strongest, decomposers do not recycle energy, one population graph does not prove a cause, and ecosystem stability does not mean no change.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.nasaBiomes,
		materialSection: "food-web-and-population-cases",
		answerSection: "ecosystems-key"
	},
	"ES4 Weather, Water, and Earth Changes": {
		estimatedTime: "6 sessions · 45–75 minutes each",
		keyBlocks: [
			"weather variable",
			"pattern",
			"water pool",
			"water movement",
			"slow Earth change",
			"fast Earth event"
		],
		sharedPhenomenon:
			"A seven-day fictional weather table, a K–5 water-cycle diagram, and before-and-after landform cards show how measurements, repeating patterns, moving water, and different time scales explain Earth changes.",
		k2Path: "Match weather symbols to observations, compare warmer or cooler and wetter or drier days, sequence a water journey with arrows, and sort Earth changes as usually slow or sometimes fast.",
		upperPath:
			"Graph weather variables, distinguish one-day weather from a longer pattern, trace water among pools and flows, compare erosion with an event such as a flood, and state a prediction with evidence and uncertainty.",
		evidenceGate:
			"Weather claims name the measured variable and date, water-cycle arrows identify a pool and a movement process, and Earth-change explanations separate the event from the slower process or evidence of prior change.",
		misconceptionCheck:
			"Clouds are not made of water vapor alone, the water cycle has many pathways rather than one circle, weather is not climate, and fast events can produce effects that continue slowly afterward.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.usgsWaterCycle,
		materialSection: "weather-water-and-earth-change-data",
		answerSection: "weather-water-and-earth-key"
	},
	"ES5 Matter, Materials, and Changes": {
		estimatedTime: "6 sessions · 45–75 minutes each",
		keyBlocks: [
			"state of matter",
			"observable property",
			"particle model",
			"material purpose",
			"reversible change",
			"design tradeoff"
		],
		sharedPhenomenon:
			"Supplied material cards show that the same object can have several observable properties and that the best material depends on the job, while change cards reveal that appearance alone may not show whether material remains recoverable.",
		k2Path: "Sort supplied examples by visible state or property, describe them with comparative words, choose a material for one job, and identify whether a familiar change can be reversed easily.",
		upperPath:
			"Use a property table and an age-appropriate particle model, compare options against criteria, distinguish observed state from model explanation, and justify reversible or irreversible classifications with a stated boundary.",
		evidenceGate:
			"A material choice cites measured or supplied properties and a criterion, a particle diagram is labeled as a model rather than an observation, and a change claim states what would count as recovering the original material.",
		misconceptionCheck:
			"Particles in a solid are not motionless, dissolved material has not vanished, gases are matter even when unseen, and no material is universally strongest, safest, or best for every purpose.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.phetElementaryGuide,
		materialSection: "matter-and-materials-data",
		answerSection: "matter-and-materials-key"
	},
	"ES6 Forces, Motion, and Simple Machines": {
		estimatedTime: "6 sessions · 45–75 minutes each",
		keyBlocks: [
			"push and pull",
			"force direction",
			"motion change",
			"balanced force",
			"position-time graph",
			"machine tradeoff"
		],
		sharedPhenomenon:
			"A four-frame cart story, matching position-time graph, and ramp-lever comparison show that forces change motion and that tools can trade force for distance or direction.",
		k2Path: "Use arrows and motion words to identify pushes, pulls, starts, stops, speed changes, and direction changes; then match a familiar tool picture to the job it helps perform.",
		upperPath:
			"Compare force-arrow diagrams, read position changes over equal time intervals, distinguish balanced from unbalanced net force, and compare how a lever or ramp changes required force, distance, and direction.",
		evidenceGate:
			"Every force arrow identifies the object receiving the force and its direction, motion claims use before-and-after position evidence, and machine claims compare the same task rather than saying the tool creates energy.",
		misconceptionCheck:
			"A moving object does not need an unbalanced force to keep moving in the simplified model, balanced forces do not always mean stationary, and simple machines do not make the total task disappear.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.phetElementaryGuide,
		materialSection: "forces-motion-and-machines-data",
		answerSection: "forces-and-machines-key"
	},
	"ES7 Light, Sound, and Signals": {
		estimatedTime: "6 sessions · 45–75 minutes each",
		keyBlocks: [
			"source",
			"path",
			"reflection and blocking",
			"vibration",
			"receiver",
			"signal reliability"
		],
		sharedPhenomenon:
			"Paired light-path and sound-signal cases show that information must travel from a source through a pathway to a receiver, and that blocking, distance, noise, or ambiguous coding can reduce reliability.",
		k2Path: "Identify source and receiver, trace a visible path with arrows, match shadow or reflection examples, identify a vibrating sound source, and explain what one familiar signal means.",
		upperPath:
			"Compare reflected, absorbed, transmitted, and blocked light; connect vibration to a sound pathway through matter; and test signal designs against distance, background noise, visibility, ambiguity, and accessibility.",
		evidenceGate:
			"A light diagram reaches the eye or camera from a source through an interaction, a sound claim identifies the vibrating source and medium, and a signal explanation states the message, receiver, and evidence of reliable detection.",
		misconceptionCheck:
			"Eyes do not send sight rays, shadows are not objects, sound does not travel through empty space in the course model, louder does not mean higher pitch, and a signal is useful only when its receiver can distinguish it.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.phetElementaryGuide,
		materialSection: "light-sound-and-signal-cases",
		answerSection: "light-sound-and-signals-key"
	},
	"ES8 Space, Patterns, and Science Design": {
		estimatedTime: "7–9 sessions · 45–90 minutes each",
		keyBlocks: [
			"repeating sky pattern",
			"rotation and orbit",
			"planet comparison",
			"model scale",
			"criteria and constraints",
			"plan-test-improve"
		],
		sharedPhenomenon:
			"Sky-pattern cards and two intentionally different solar-system models show that repeating observations can support explanations while every model emphasizes some relationships and distorts or omits others.",
		k2Path: "Sequence day-and-night or sky-pattern cards, compare two objects with pictures and words, build or draw one model, and explain what the model helps show using an oral, dictated, or written sentence.",
		upperPath:
			"Graph or sequence repeated observations, explain day and night with an Earth-rotation model, compare planetary properties with consistent units, critique scale, and complete a plan-test-improve capstone with evidence.",
		evidenceGate:
			"Sky claims use repeated observations rather than one picture, planet comparisons use the same property and unit, model claims state what is represented and omitted, and design choices trace to criteria, constraints, tests, and revisions.",
		misconceptionCheck:
			"The Sun does not travel around Earth each day in the course model, diagrams rarely preserve both size and distance scale, larger drawings do not prove larger real objects, and a first design is not automatically the final solution.",
		referenceLink: ELEMENTARY_SCIENCE_REFERENCES.nasaSpacePlace,
		materialSection: "sky-pattern-and-planet-model-cards",
		answerSection: "sky-and-models-key"
	}
};

const ELEMENTARY_SCIENCE_ADDITIONS: Record<string, RawCourseModuleItem[]> = {
	"ES1 Scientists, Questions, and Evidence": [
		{
			title: "Two-Band Science Notebook Routine",
			content: [
				"**Shared routine:** Start with the phenomenon before vocabulary. Record the source and date, notice silently, share observations, sort observation from inference, ask a question, organize evidence, explain a claim, and end with what evidence could change the idea. Preserve the first response so revision is visible.",
				"**K–2 notebook:** Use one labeled drawing, three observation marks or tallies, the frames I observe, I think, I wonder, and one because sentence. Speaking, pointing, dictation, drawing, or selecting from supplied words are equivalent response routes.",
				"**Grades 3–5 notebook:** Add a small table or graph, label what changed and what was measured, write a CER paragraph, and identify one alternate explanation or missing measurement. Evidence is quoted or described precisely enough that another learner can find it.",
				"**Access check:** Every image has a text description, color is paired with labels or patterns, video evidence has a still or transcript, and no outdoor observation, camera, household object, or handwriting speed is required."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"science-notebook-and-response-frames"
			),
			solutionLink: elementaryScienceAnswerKey(
				"common-two-band-evidence-rubric"
			),
			learningPath: "core"
		},
		{
			title: "Question, Evidence, and Fair-Comparison Gate",
			content: [
				"**Question types:** A descriptive question asks what is present or changing. A comparison question asks how two cases differ. A testable cause-and-effect question names what changes, what is observed or measured, and what stays comparable. Questions about preference or meaning are valuable but require different evidence.",
				"**Evidence rule:** A picture, table, graph, written description, or simulation state can provide evidence. Personal certainty, a guess, a vocabulary definition, or the claim repeated in different words cannot serve as the evidence for itself.",
				"**Fair-comparison bridge:** K–2 learners compare two supplied scenes and name one difference. Grades 3–5 learners identify the changed condition, measured result, constants, repeated trials when supplied, and one reason the comparison remains limited.",
				"**Mastery check:** Correct one observation that includes an explanation, one question that cannot be checked with available evidence, and one graph claim that invents a cause."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"observation-inference-and-fair-comparison-cards"
			),
			solutionLink: elementaryScienceAnswerKey("science-practices-key"),
			learningPath: "core"
		}
	],
	"ES2 Living Things and Life Needs": [
		{
			title: "Living, Nonliving, and Once-Living Evidence Gate",
			content: [
				"**Classification routine:** Use several observations across time: cellular organization at the grade-appropriate level, use of energy and materials, growth through internal processes, response, reproduction at a species level, and maintenance of organized life processes. No single everyday clue decides every case.",
				"**Clear and edge cases:** Animals and growing plants are clear living examples; rocks and active machines are nonliving. Wood, paper, and fossils can be described as once-living or made from living material. Seeds are living but may be dormant. Fire and robots can move or spread without being organisms.",
				"**Grade-band bridge:** K–2 learners sort clear cases and explain one need. Grades 3–5 learners use the full supplied evidence table, preserve uncertain categories, and explain why one clue cannot settle the difficult cases.",
				"**Mastery check:** Defend four classifications, revise one movement-only explanation, and name the observation that would be most useful for a dormant-seed case."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"living-things-and-structure-function-cases"
			),
			solutionLink: elementaryScienceAnswerKey("living-things-key"),
			learningPath: "core"
		},
		{
			title: "Structure, Function, and Environment-Change Gate",
			content: [
				"**Relationship model:** A structure is a part or arrangement; function is a job or contribution; behavior is an action. A beak, root, fin, leaf, fur layer, or spine can support a task under particular environmental conditions without being perfect for every place.",
				"**Evidence chain:** Name the structure, visible feature, proposed function, habitat condition, and evidence connecting them. A plausible story is marked as a prediction unless the supplied comparison or source supports the function claim.",
				"**Changed condition:** K–2 learners draw or tell what might happen if one need changes. Grades 3–5 learners compare at least two structures, identify a benefit and limit, and predict how reduced water, changed food, temperature, or a new predator affects survival.",
				"**Mastery check:** Correct the claims that animals choose needed body parts, every cactus spine has one purpose, and a useful structure guarantees survival."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"living-things-and-structure-function-cases"
			),
			solutionLink: elementaryScienceAnswerKey("living-things-key"),
			learningPath: "core"
		}
	],
	"ES3 Habitats, Food Chains, and Ecosystems": [
		{
			title: "Food-Chain, Food-Web, and Energy-Arrow Gate",
			content: [
				"**Arrow convention:** In this course, a food-web arrow points from the food or energy source toward the organism receiving that transferred energy. Add a legend and text path so learners do not have to infer arrow direction from color or layout.",
				"**System model:** Most modeled food-web energy begins with sunlight captured by producers, moves to consumers, and disperses as heat. Decomposers process dead material and waste, returning matter to soil, water, or air; matter and energy are related but do not follow identical cycles.",
				"**Grade-band bridge:** K–2 learners build one chain and name producer and consumer. Grades 3–5 learners build a web with decomposers, mark supported and hypothetical links, and trace one direct and one indirect effect of a changed population.",
				"**Mastery check:** Repair reversed arrows, add a missing producer and decomposer route, and explain why the top predator is not outside the decomposer system."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"food-web-and-population-cases"
			),
			solutionLink: elementaryScienceAnswerKey("ecosystems-key"),
			learningPath: "core"
		},
		{
			title: "Population Graph and Habitat-Change Gate",
			content: [
				"**Graph reading:** Begin with title, axes, categories, units, and time intervals. Describe increase, decrease, peak, low point, or no clear change before proposing why the pattern occurred. A line that rises shows the supplied measure rising, not the cause.",
				"**Cause-and-effect model:** Habitat change can alter water, food, shelter, temperature, space, predation, competition, or movement. More than one pathway may fit the same population pattern, and indirect effects can be delayed.",
				"**Grade-band bridge:** K–2 learners order picture bars and say more, fewer, or same. Grades 3–5 learners cite two graph values, compare direct and indirect pathways, and name a missing measurement or alternate cause.",
				"**Mastery check:** Describe the supplied pond graph without causal language, propose two explanations, and identify evidence that would distinguish them."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"food-web-and-population-cases"
			),
			solutionLink: elementaryScienceAnswerKey("ecosystems-key"),
			learningPath: "core"
		}
	],
	"ES4 Weather, Water, and Earth Changes": [
		{
			title: "Weather Measurement and Pattern Gate",
			content: [
				"**Measurement routine:** Weather descriptions use dated temperature, precipitation, wind, cloud, or humidity evidence when supplied. Comfort words such as nice, bad, warm, or chilly can describe an experience but do not replace a measurement or observable condition.",
				"**Pattern boundary:** One day is weather evidence. A repeated series can show a short-term pattern and support a bounded forecast. Climate concerns longer distributions and seasons; this elementary dataset does not establish a climate trend.",
				"**Grade-band bridge:** K–2 learners match symbols and compare days. Grades 3–5 learners graph two variables, identify a pattern, make a one-step prediction, and name why a seven-day series remains limited.",
				"**Mastery check:** Use two exact values from the supplied table, distinguish observation from forecast, and revise one claim that turns one unusual day into a permanent pattern."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"weather-water-and-earth-change-data"
			),
			solutionLink: elementaryScienceAnswerKey(
				"weather-water-and-earth-key"
			),
			learningPath: "core"
		},
		{
			title: "Water Pools, Flows, and Earth-Change Gate",
			content: [
				"**Water model:** Pools store water in oceans, lakes, rivers, soil, groundwater, ice, living things, and atmosphere. Flows such as evaporation, condensation, precipitation, runoff, infiltration, and transpiration move water or change its state. The model has branching paths rather than one fixed circle.",
				"**Earth-change model:** Weathering breaks material down, erosion moves it, and deposition places it elsewhere. Floods, earthquakes, and eruptions can be fast events, while erosion, soil formation, recovery, and landscape adjustment can continue over longer periods.",
				"**Grade-band bridge:** K–2 learners sequence and label a supplied water journey and sort change cards. Grades 3–5 learners identify pools and flows, trace Sun and gravity roles, and compare the time scales and evidence for two Earth changes.",
				"**Safety boundary:** Hazards are studied through supplied maps, images, and descriptions; no disaster reenactment, travel, household water experiment, or personal emergency disclosure is required."
			].join("\n\n"),
			datasetLink: ELEMENTARY_SCIENCE_REFERENCES.usgsWaterCycle,
			solutionLink: elementaryScienceAnswerKey(
				"weather-water-and-earth-key"
			),
			learningPath: "core"
		}
	],
	"ES5 Matter, Materials, and Changes": [
		{
			title: "Matter State, Property, and Particle-Model Gate",
			content: [
				"**Observation and model:** Shape, volume, flow, texture, flexibility, transparency, absorbency, magnetism, and other properties can be observed or supplied as data. Particle spacing and motion are explanatory models; learners do not claim to see particles in a classroom image.",
				"**State boundary:** Solids, liquids, and gases are introductory categories. Powders, foams, gels, mixtures, and very small pieces can be tricky because an object-level appearance is not always the same as the state of each material.",
				"**Grade-band bridge:** K–2 learners sort clear examples and use comparative property words. Grades 3–5 learners interpret property data, use a particle diagram cautiously, and explain one tricky case or state change while conserving matter.",
				"**Mastery check:** Correct the claims that solid particles never move, gas is not matter, and dissolved material has disappeared; then identify what the supplied model leaves out."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial("matter-and-materials-data"),
			solutionLink: elementaryScienceAnswerKey(
				"matter-and-materials-key"
			),
			learningPath: "core"
		},
		{
			title: "Material Design and Change-Classification Gate",
			content: [
				"**Design comparison:** Define the job, criteria, and constraints before selecting a material. Strength, flexibility, waterproofing, transparency, absorbency, mass, cost, and reusability can conflict, so the evidence may support different choices for different parts.",
				"**Change classification:** Reversible means the chosen process can recover the starting material or state under the stated classroom boundary; irreversible means it cannot be easily restored by the modeled process. The classification depends on process and evidence, not whether the change looks dramatic.",
				"**Grade-band bridge:** K–2 learners choose between two supplied options and give a because statement. Grades 3–5 learners score three options, identify a tradeoff, compare a change before and after, and revise the design after one failed criterion.",
				"**Mastery check:** Defend one material choice with two properties, reject one universally best claim, and explain why tearing, melting, dissolving, rusting, and burning do not all belong in one simple appearance-based group."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial("matter-and-materials-data"),
			solutionLink: elementaryScienceAnswerKey(
				"matter-and-materials-key"
			),
			learningPath: "core"
		}
	],
	"ES6 Forces, Motion, and Simple Machines": [
		{
			title: "Force Arrow and Motion-Graph Gate",
			content: [
				"**Force model:** Draw each arrow on or from the object receiving the push or pull, label the source when useful, and use arrow direction consistently. The combined effect, not one arrow alone, supports the prediction about changing motion.",
				"**Motion evidence:** Position-time information describes where an object is at successive times. A steeper change in position over the same interval represents faster motion in the supplied cases; a flat section represents unchanged position, not necessarily an absence of all forces.",
				"**Grade-band bridge:** K–2 learners sequence before-during-after motion frames and add one force arrow. Grades 3–5 learners compare arrow diagrams with position-time tables or graphs and distinguish balanced from unbalanced net-force cases.",
				"**Mastery check:** Match four diagrams to motion outcomes, correct one arrow attached to the wrong object, and explain why balanced forces can accompany constant motion in the simplified model."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"forces-motion-and-machines-data"
			),
			solutionLink: elementaryScienceAnswerKey("forces-and-machines-key"),
			learningPath: "core"
		},
		{
			title: "Simple-Machine Plan, Test, and Improve Gate",
			content: [
				"**Design question:** Compare how a ramp, lever, pulley, wheel and axle, wedge, or screw changes the direction or amount of force and the distance over which the force acts. Keep the object moved and goal consistent across comparisons.",
				"**Tradeoff:** A machine can make one part of a task easier while requiring more distance, different setup, friction, stronger supports, or additional parts. It does not create energy or erase all work.",
				"**Grade-band bridge:** K–2 learners match machine pictures to jobs and draw one improvement. Grades 3–5 learners compare supplied force-distance cases, define criteria and constraints, choose a design, inspect a failure case, and revise one feature.",
				"**Mastery check:** Explain the benefit and cost of one machine, reject the phrase does the work for you, and preserve a before-and-after design note showing evidence-based revision."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"forces-motion-and-machines-data"
			),
			solutionLink: elementaryScienceAnswerKey("forces-and-machines-key"),
			learningPath: "core"
		}
	],
	"ES7 Light, Sound, and Signals": [
		{
			title: "Light Path, Reflection, and Shadow Gate",
			content: [
				"**Path model:** Light travels from a source, may be reflected, transmitted, absorbed, or blocked by an object, and reaches a receiver such as an eye or camera. A diagram labels every part and uses arrows for the modeled direction of travel.",
				"**Shadow model:** A shadow is a region receiving less direct light because an object blocks part of the path. Shadow position and size depend on source, object, surface, and distances; the shadow is not material attached to the object.",
				"**Grade-band bridge:** K–2 learners trace source-object-receiver paths and match shadow or reflection cards. Grades 3–5 learners compare materials, predict a changed source or object position, and critique what a two-dimensional ray drawing leaves out.",
				"**Mastery check:** Repair an eye-ray diagram, add the missing receiver to a reflection path, and explain one shadow change with source and object evidence."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"light-sound-and-signal-cases"
			),
			solutionLink: elementaryScienceAnswerKey(
				"light-sound-and-signals-key"
			),
			learningPath: "core"
		},
		{
			title: "Sound, Signals, and Accessible Communication Gate",
			content: [
				"**Sound pathway:** A vibrating source changes nearby matter, the disturbance travels through a medium, and a receiver detects it. Loudness and pitch describe different perceived features and are not interchangeable in the supplied comparison.",
				"**Signal design:** A signal has a sender, code or pattern, pathway, receiver, intended meaning, and conditions that can create error. Reliability improves when the signal is distinct, repeated appropriately, matched to the environment, and accessible to intended receivers.",
				"**Grade-band bridge:** K–2 learners identify source, receiver, and message. Grades 3–5 learners compare distance, background noise, visibility, ambiguity, and redundant light-plus-text or sound-plus-visual routes.",
				"**Access check:** Audio always has a transcript, waveform, or event table; visual signals always have text labels or patterns. No learner's hearing, vision, speech, or sensory response is tested or disclosed."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"light-sound-and-signal-cases"
			),
			solutionLink: elementaryScienceAnswerKey(
				"light-sound-and-signals-key"
			),
			learningPath: "core"
		}
	],
	"ES8 Space, Patterns, and Science Design": [
		{
			title: "Sky Pattern, Rotation, and Scale-Model Gate",
			content: [
				"**Pattern evidence:** Sequence repeated observations of sunlight, darkness, shadows, visible Moon position, or star patterns with date and time labels. One picture can show a state; repeated comparable observations are needed to establish a pattern.",
				"**Day-night model:** In the course model, Earth rotates, bringing locations into and out of sunlight. The Sun's apparent daily motion is an observation from Earth and does not mean the Sun circles Earth each day.",
				"**Scale boundary:** Solar-system models may preserve order, relative size, selected distances, orbital pattern, or surface details, but a classroom page rarely preserves all properties at once. Decorative size is not measurement.",
				"**Mastery check:** Explain one day-night sequence, compare two planet properties with consistent units, and label what each supplied model represents, distorts, and omits."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"sky-pattern-and-planet-model-cards"
			),
			projectLink: ELEMENTARY_SCIENCE_REFERENCES.nasaSpacePlace,
			solutionLink: elementaryScienceAnswerKey("sky-and-models-key"),
			learningPath: "core"
		},
		{
			title: "Capstone Plan, Test, Improve, and Explain Gate",
			content: [
				"**Question and model:** Choose one supplied phenomenon or design problem. Define the question, evidence source, grade-band vocabulary, model boundary, and what a successful explanation or solution must show before building the final artifact.",
				"**Engineering cycle:** Compare at least two ideas, name criteria and constraints, use supplied evidence or a paper/browser model to test one feature, inspect a failure or limitation, revise, and preserve the before-and-after decision.",
				"**Two-band defense:** K–2 learners present a labeled drawing or sort with one evidence-based because sentence and one improvement. Grades 3–5 learners add a data display or model comparison, CER response, limitation, and changed-condition prediction.",
				"**Mastery check:** The final explanation points to evidence, distinguishes model from reality, names one limitation, includes an accessible text route, and answers what evidence would change the claim or design."
			].join("\n\n"),
			datasetLink: elementaryScienceMaterial(
				"elementary-science-capstone-packet"
			),
			projectLink: ELEMENTARY_SCIENCE_REFERENCES.ngssEngineering35,
			solutionLink: elementaryScienceAnswerKey("capstone-defense-rubric"),
			learningPath: "core"
		}
	]
};

const ELEMENTARY_SCIENCE_PROJECT_COMPLETION: Record<string, string> = {
	"Project: Observation Field Guide Page":
		"Use a supplied image or description. K–2: include a labeled drawing, three visible observations, one I wonder question, and one clearly marked inference. Grades 3–5: add a tally or comparison table, distinguish source evidence from prior knowledge, and identify one observation needed to test the inference.",
	"Project: Evidence Detective Card":
		"K–2: point to or describe two source details and complete My claim is and I know because. Grades 3–5: cite three relevant details, explain the connection rather than repeating the claim, compare one alternate explanation, and state what evidence would change the answer.",
	"Project: Creature Survival Profile":
		"K–2: label habitat, two needs, one structure, one behavior, and one changed-condition prediction. Grades 3–5: separate structure from behavior, connect each feature to evidence and environmental conditions, include one tradeoff or limit, and mark imagined features as design choices rather than real-species evidence.",
	"Project: Plant or Animal Compare Chart":
		"K–2: compare two supplied organisms with pictures or words for needs, home, and one helpful part. Grades 3–5: use consistent categories, connect two structures to functions, explain one similarity and difference with evidence, and predict how one environment change affects each organism differently.",
	"Project: Digital Food Web Poster":
		"K–2: build one producer-to-consumer chain with a labeled Sun or supported energy source. Grades 3–5: add at least six organisms, decomposers, a nonliving matter reservoir, an arrow legend, one hypothetical link, and a text route that keeps energy flow distinct from nutrient cycling.",
	"Project: Ecosystem Change Scenario":
		"K–2: show a first-then sequence for one supplied habitat change and two organisms. Grades 3–5: trace one direct and two indirect effects, cite graph or card evidence, compare an alternate causal path, and identify a missing measurement before claiming the ecosystem became stable or unstable.",
	"Project: Weather Report Script":
		"K–2: name the supplied day's temperature or condition, use two weather symbols, and give one evidence-based planning statement. Grades 3–5: cite multiple values, separate observation from forecast, describe a short pattern, and state why the supplied series cannot establish a long-term climate conclusion.",
	"Project: Water Cycle Comic":
		"K–2: sequence four labeled pools or movements and narrate where the water goes next. Grades 3–5: include at least six pools or flows, one state change, Sun and gravity roles, one branch or alternate route, a human influence when supplied, and a text equivalent that avoids presenting the cycle as one fixed loop.",
	"Project: Material Choice Pitch":
		"K–2: choose between two supplied materials and use a because sentence tied to one needed property. Grades 3–5: define criteria and constraints, score at least three options with supplied property data, identify a tradeoff and failed criterion, and revise one part without calling any material universally best.",
	"Project: Matter Sorting Board":
		"K–2: sort clear supplied solids, liquids, and gases plus two change cards and explain one choice. Grades 3–5: include powders, mixtures, dissolving, melting, tearing, rusting, or another tricky case; separate observation from particle model; and state what recovery test defines reversible for this board.",
	"Project: Force Diagram Story":
		"K–2: show before, push or pull, and after frames with one correctly placed direction arrow and motion words. Grades 3–5: add all relevant force arrows for the simplified case, match a position-time table or graph, compare balanced and unbalanced outcomes, and name what the model leaves out.",
	"Project: Simple Machine Scavenger Map":
		"Use only supplied pictures or nonidentifying remembered examples. K–2: match four objects to machine types and jobs. Grades 3–5: compare two tools doing the same task, explain force-distance or direction tradeoffs, identify friction or setup limits, and revise one design after a supplied failure case.",
	"Project: Light Path Diagram":
		"K–2: label source, object, path, and eye or camera, then identify reflection or blocking. Grades 3–5: compare reflection, transmission, absorption, and blocking, predict one changed position or material, include an arrow legend and text route, and state one limitation of the two-dimensional ray model.",
	"Project: Signal Design Challenge":
		"K–2: identify sender, receiver, message, and one way to notice the signal. Grades 3–5: test the code against distance, noise, visibility, ambiguity, and accessibility; add a redundant text, pattern, visual, or audio route; record one failed condition; and revise the design with evidence.",
	"Project: Solar System Comparison Card":
		"K–2: compare two supplied objects with pictures or words for two shared properties and one difference. Grades 3–5: use four consistently defined properties with units when available, cite NASA information, distinguish measured comparison from model appearance, and name which size or distance relationship the card cannot preserve.",
	"Project: Elementary Science Capstone":
		"K–2: present a question, labeled model or sort, two source observations, one because explanation, and one improvement. Grades 3–5: add a data display or model comparison, CER response, criteria and constraints when designing, changed-condition prediction, limitation, accessible text route, and before-and-after revision evidence."
};

function elementaryScienceProjectPath(title: string) {
	return /detective|scenario|pitch|challenge|capstone/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

export const elementaryScienceCourse: RawCourse = {
	...elementaryScienceSourceCourse,
	modules: elementaryScienceSourceCourse.modules.map(module => {
		const flow = ELEMENTARY_SCIENCE_FLOW[module.title];
		const curriculum = module.curriculum.map((item, index) => ({
			...item,
			content: [
				index === 0
					? `**Course flow:** Begin with the shared phenomenon, let both grade bands use the same evidence, and change the response complexity rather than changing who can participate.`
					: "",
				item.content,
				`**Shared phenomenon:** ${flow.sharedPhenomenon}`,
				`**K–2 route:** ${flow.k2Path}`,
				`**Grades 3–5 route:** ${flow.upperPath}`,
				`**Evidence gate:** ${flow.evidenceGate}`,
				`**Misconception check:** ${flow.misconceptionCheck}`,
				`**Authoritative reference:** [Open the module reference](${flow.referenceLink}).`
			]
				.filter(Boolean)
				.join("\n\n"),
			datasetLink:
				item.datasetLink ??
				(index === 0
					? flow.referenceLink
					: elementaryScienceMaterial(flow.materialSection)),
			solutionLink:
				item.solutionLink ??
				elementaryScienceAnswerKey(flow.answerSection),
			learningPath: "core" as const
		}));
		const additions = ELEMENTARY_SCIENCE_ADDITIONS[module.title].map(
			item => ({
				...item,
				content: [
					item.content,
					`**Shared phenomenon:** ${flow.sharedPhenomenon}`,
					`**K–2 route:** ${flow.k2Path}`,
					`**Grades 3–5 route:** ${flow.upperPath}`,
					`**Evidence gate:** ${flow.evidenceGate}`,
					`**Misconception check:** ${flow.misconceptionCheck}`
				].join("\n\n"),
				projectLink: item.projectLink ?? flow.referenceLink
			})
		);
		const supplementalProjects = module.supplementalProjects.map(item => ({
			...item,
			content: [
				item.content,
				`**Shared phenomenon:** ${flow.sharedPhenomenon}`,
				`**Two-band completion route:** ${ELEMENTARY_SCIENCE_PROJECT_COMPLETION[item.title]}`,
				`**Evidence gate:** ${flow.evidenceGate}`,
				`**Misconception check:** ${flow.misconceptionCheck}`
			].join("\n\n"),
			datasetLink:
				item.datasetLink ??
				elementaryScienceMaterial(flow.materialSection),
			solutionLink:
				item.solutionLink ??
				elementaryScienceAnswerKey(flow.answerSection),
			learningPath: elementaryScienceProjectPath(item.title)
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
			"NGSS elementary physical, life, Earth/space, and engineering performance expectations",
			"Science and engineering practices progressing from K–2 to grades 3–5",
			"Patterns; cause and effect; systems and models; structure and function; stability and change",
			"Observation, data organization, model use, and evidence-based explanation",
			"Criteria, constraints, comparison, testing, and revision"
		],
		sourcePolicy:
			"Preserves the eight-module Elementary Science sequence and all 16 distinctive projects while making every card usable through one shared supplied phenomenon, explicit K–2 and grades 3–5 response routes, local evidence and answer packs, authoritative NGSS/NASA/USGS/PhET references, and fully equivalent text-first alternatives.",
		assessmentCadence: [
			"One source-based observation, sort, drawing, table, graph, or model per module",
			"One K–2 oral, dictated, selected, drawn, or short-written evidence route per task",
			"One grades 3–5 data, model, CER, limitation, or changed-condition route per task",
			"One misconception correction and one model or evidence boundary per module",
			"Recurring plan-test-improve record culminating in the capstone defense"
		],
		toolchain: [
			"Notebook, paper, or digital document",
			"Supplied Elementary Science materials pack and answer rubric",
			"Shared images, text descriptions, tables, graph cards, and simulation states",
			"Authoritative NGSS, NASA, USGS, and PhET references",
			"Optional audio, video, map, or simulation with a noninteractive text or table equivalent"
		],
		safetyPolicy: [
			"No required beakers, chemicals, heat, food, kits, outdoor collection, construction, travel, camera, or household experiment",
			"No required home, schedule, health, sensory ability, disaster experience, or location disclosure",
			"Supplied images, descriptions, datasets, and model cards remain sufficient for every assessment",
			"Audio has transcript or event-table alternatives; visuals have text, labels, and non-color cues",
			"Safety or hazard discussions use supplied scenarios and do not replace trusted-adult or local emergency guidance"
		],
		courseBoundaries: [
			"One course with explicit K–2 and grades 3–5 routes rather than one undifferentiated expectation",
			"Elementary models and supplied evidence rather than professional laboratory or fieldwork",
			"Observation remains distinct from inference, model, prediction, and causal explanation",
			"Grade-level simplifications are labeled and do not turn invisible model features into direct observations",
			"Middle-school quantitative depth is a next pathway rather than implied mastery"
		],
		capstoneExpectations: [
			"Question or design problem grounded in a supplied phenomenon",
			"Grade-band-appropriate evidence artifact and explanation",
			"Model with labels, boundary, and accessible text route",
			"Criteria and constraints when the artifact is an engineering design",
			"Test or comparison evidence plus before-and-after revision",
			"Limitation, changed-condition prediction, and answer to what evidence would change the idea"
		],
		recommendedNextWork: [
			"Add anonymized exemplar notebook pages and capstone responses at several writing and communication levels.",
			"Archive selected simulation states as locally owned screenshots and structured text tables so external tools are never required for continuity.",
			"Cross-link the grades 3–5 evidence route to Middle School Integrated Science after its readiness bridge is audited."
		]
	}
};
