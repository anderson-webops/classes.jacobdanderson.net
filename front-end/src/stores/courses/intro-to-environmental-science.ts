import type { RawCourse } from "./types";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";

const NASA_BIOMES = "https://earthobservatory.nasa.gov/biome";
const NASA_GRASSLAND =
	"https://earthobservatory.nasa.gov/biome/biograssland.php";
const NASA_WATER_CYCLE = "https://gpm.nasa.gov/education/water-cycle";
const FOOD_LIFETIME_REFERENCE =
	"https://njbiblio.com/2013/02/01/how-much-do-humans-eat-in-a-liftetime-infographic/";
const PHOTOSYNTHESIS_DIAGRAM =
	"c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png";

function concept({
	check,
	evidence,
	model,
	vocabulary
}: {
	check: string;
	evidence: string;
	model: string;
	vocabulary: string[];
}) {
	return [
		`**Concept path:** ${model}`,
		`**Vocabulary:** ${vocabulary.join(", ")}.`,
		`**Evidence work:** ${evidence}`,
		`**Review check:** ${check}`
	].join("\n\n");
}

function project({
	artifact,
	check,
	evidence,
	goal
}: {
	artifact: string;
	check: string;
	evidence: string;
	goal: string;
}) {
	return [
		`**Project goal:** ${goal}`,
		`**Artifact:** ${artifact}`,
		`**Evidence target:** ${evidence}`,
		`**Completion check:** ${check}`
	].join("\n\n");
}

function terminology(terms: Array<[string, string]>) {
	return [
		"Use this vocabulary as a working reference while building models and reports. Each term is strongest when it is paired with an example from the selected biome, a diagram label, or a real environmental event.",
		...terms.map(([term, definition]) => `- **${term}:** ${definition}`)
	].join("\n\n");
}

export const introToEnvironmentalScienceCourse: RawCourse = {
	name: "Intro to Environmental Science",
	modules: [
		{
			title: "ES1 Ecosystems",
			curriculum: [
				{
					title: "Biome and Ecosystem Framework",
					content: concept({
						model: "Environmental science studies interactions among living organisms, physical conditions, and human decisions. A biome is a large region with a recognizable climate and community of organisms, while an ecosystem is the interacting system inside a place. The same biome can contain many smaller ecosystems.",
						vocabulary: [
							"biome",
							"ecosystem",
							"flora",
							"fauna",
							"climate",
							"habitat"
						],
						evidence:
							"Select one core biome from the NASA biome reference and collect evidence about temperature, precipitation, landforms, plants, animals, and seasonal patterns. Keep notes in a comparison table so later projects can return to the same biome without restarting the research.",
						check: "Explain why a desert, tundra, grassland, forest, or aquatic biome is not defined by one species alone. The explanation needs both living and nonliving factors."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Disturbance and Succession",
					content: concept({
						model: "Ecosystems change after droughts, floods, fires, storms, insect outbreaks, volcanic events, invasive species, or human land-use decisions. A disturbance is not automatically permanent; succession describes the sequence of recovery or replacement over time.",
						vocabulary: [
							"ecological disturbance",
							"primary succession",
							"secondary succession",
							"anthropogenic disturbance",
							"recovery"
						],
						evidence:
							"Build a before-during-after timeline for one disturbance that could affect the core biome. The timeline needs a cause, visible ecosystem changes, short-term consequences, and a recovery path. Long events can be summarized by major phases instead of every detail.",
						check: "Distinguish the trigger of a disturbance from the ecosystem response. For example, a wildfire, flood, or invasive species introduction is not the same thing as the recovery sequence that follows."
					})
				},
				{
					title: "Core Biome Research Log",
					content: concept({
						model: "The course uses one core biome as a recurring case study. A useful research log separates facts, source notes, model sketches, and open questions. Each later unit adds a new layer: food webs, consumers, weather, water, soil, energy use, human impact, past change, and future change.",
						vocabulary: [
							"case study",
							"observation",
							"inference",
							"source reliability",
							"model limitation"
						],
						evidence:
							"Record three or more evidence-based facts about the biome and one or more uncertainties. Facts can come from NASA pages, maps, photographs, climate summaries, species references, or other vetted sources. Uncertainties are kept visible so future evidence can revise them.",
						check: "Mark which notes are direct observations from a source and which notes are inferences about how the ecosystem works."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Terminology: Ecosystems",
					content: terminology([
						[
							"Biome",
							"A large naturally occurring community shaped by climate, landforms, and characteristic plant and animal life."
						],
						[
							"Ecosystem",
							"A community of living organisms interacting with each other and with nonliving parts of the environment."
						],
						[
							"Ecological disturbance",
							"A temporary or lasting change in conditions that disrupts an ecosystem's structure or function."
						],
						[
							"Ecological succession",
							"The sequence of community changes that occurs as an ecosystem develops, recovers, or reorganizes."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Biome Travel Guide",
					content: project({
						goal: "Create a travel guide for the selected core biome that uses environmental evidence rather than generic tourism claims.",
						artifact:
							"A slide, document, poster, or notebook page recommending what to see, what climate to prepare for, and which plants or animals are characteristic of the biome.",
						evidence:
							"Include three or more organism examples, two nonliving environmental factors, and one explanation of how those factors shape life in the biome.",
						check: "The guide explains why this biome is distinct from another biome and names the evidence source used for the comparison."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Project: Ecological Disturbance Timeline",
					content: project({
						goal: "Model how one disturbance affects the core biome and how recovery or succession could unfold.",
						artifact:
							"A timeline with labeled stages before, during, and after the disturbance. The timeline may be drawn, written, or built as slides.",
						evidence:
							"Name the disturbance cause, the organisms or resources most affected, and the recovery process that reconnects the ecosystem over time.",
						check: "The model separates short-term disruption from long-term succession and names one uncertainty that would need stronger data."
					})
				},
				{
					title: "Project: Ecosystem Reporter",
					content: project({
						goal: "Report on a recent real-world event that disrupted one or more ecosystems.",
						artifact:
							"A written report, short presentation, or video script describing the event, conditions, consequences, and ecosystem recovery questions.",
						evidence:
							"Use one or more credible sources and connect the event to vocabulary from the module: biome, ecosystem, disturbance, and succession.",
						check: "The report explains what changed in the ecosystem and why the audience can trust the evidence."
					})
				}
			]
		},
		{
			title: "ES2 Flora and Decomposers",
			curriculum: [
				{
					title: "Primary Production",
					content: concept({
						model: "Most food webs begin with primary producers that convert energy into organic matter. In many ecosystems, plants and algae use photosynthesis to transform carbon dioxide, water, and light energy into sugars and oxygen. This producer layer supports consumers above it.",
						vocabulary: [
							"primary producer",
							"photosynthesis",
							"chlorophyll",
							"organic matter",
							"foundation species"
						],
						evidence:
							"Choose a temporary biome different from the core biome. Pick one species, identify what it eats, and keep tracing food sources downward until the chain reaches producers or another energy source. Add a note when the chain is uncertain.",
						check: "Explain why a food chain cannot be complete if it stops at an herbivore or predator without identifying the original energy source."
					})
				},
				{
					title: "Photosynthesis Diagram Reference",
					content: [
						"This section lists the pending photosynthesis diagram file. The static media URL is kept with the lesson so the visual can appear here once the asset is added.",
						"Until the diagram is uploaded, use the reserved space to connect the process verbally: light energy is captured by chlorophyll, carbon dioxide enters from the air, water moves through the plant, glucose stores usable chemical energy, and oxygen is released. The important ecosystem idea is that producers convert non-food inputs into food-web energy that consumers and decomposers depend on.",
						pendingStaticMediaNotice(PHOTOSYNTHESIS_DIAGRAM)
					].join("\n\n"),
					mediaLink: staticMediaUrl(PHOTOSYNTHESIS_DIAGRAM)
				},
				{
					title: "Food Webs and Decomposers",
					content: concept({
						model: "Food webs extend in many directions rather than forming one straight line. Consumers eat producers or other consumers, and decomposers return nutrients from dead organisms and waste back into the ecosystem. Decomposers connect every level, including the top predators.",
						vocabulary: [
							"food web",
							"consumer",
							"decomposer",
							"nutrient recycling",
							"trophic level"
						],
						evidence:
							"The producer chain from the previous concept extends upward into likely consumers and sideways into decomposers that process remains or waste. Uncertain links are marked as hypotheses.",
						check: "Explain why the phrase 'top of the food chain' is incomplete unless decomposers and nutrient cycling are included."
					})
				},
				{
					title: "Terminology: Producers and Decomposers",
					content: terminology([
						[
							"Primary producer",
							"An organism, often a plant or photosynthetic microorganism, that creates organic matter from light or chemical energy."
						],
						[
							"Photosynthesis",
							"The process by which plants and some other organisms use light energy, carbon dioxide, and water to make sugars and oxygen."
						],
						[
							"Decomposer",
							"An organism that breaks down dead organisms or waste, returning materials to the ecosystem."
						],
						[
							"Food web",
							"A network diagram showing feeding relationships among organisms in an ecosystem."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Foundation of the Food Web",
					content: project({
						goal: "Trace one ecosystem food chain down to its producer foundation.",
						artifact:
							"A labeled chain or web with arrows showing energy movement from producers through consumers.",
						evidence:
							"Include four or more organisms or organism groups when possible, plus a note explaining the original source of energy.",
						check: "The model can explain what changes if the producer layer becomes weaker or disappears."
					})
				},
				{
					title: "Project: Top Dog and Decomposer Web",
					content: project({
						goal: "Extend a food chain upward to predators and sideways to decomposers.",
						artifact:
							"A food web that includes producers, herbivores, carnivores or omnivores, and decomposers.",
						evidence:
							"The web uses arrows consistently and includes one or more decomposer links for dead organisms or waste.",
						check: "The explanation identifies which organisms depend indirectly on producers even when they do not eat plants directly."
					})
				},
				{
					title: "Project: Ecosystem Reporter Part 2",
					content: project({
						goal: "Analyze how a disturbance changes a food web rather than only naming damaged land or weather conditions.",
						artifact:
							"A report or diagram showing the original food web, the disrupted food web, and one possible recovery path.",
						evidence:
							"Name the food-web level most affected and explain how that effect spreads to other organisms.",
						check: "The report uses producer, consumer, decomposer, and food web vocabulary correctly."
					})
				}
			]
		},
		{
			title: "ES3 Fauna",
			curriculum: [
				{
					title: "Consumers and Energy Flow",
					content: concept({
						model: "Consumers obtain energy by eating organisms or organic matter. Energy moves through ecosystems from producers to consumers and is gradually lost as heat, so high-level consumers usually require large amounts of producer-supported biomass beneath them.",
						vocabulary: [
							"consumer",
							"herbivore",
							"carnivore",
							"omnivore",
							"energy flow",
							"biomass"
						],
						evidence:
							"Analyze a one-week food journal or a provided sample diet. Identify plant sources, animal sources, and the food-web levels behind each meal. Estimate which foods require more ecosystem energy to support.",
						check: "Compare a human diet with the diet of a wolf or lion by naming the producer base required to support each consumer."
					}),
					datasetLink: FOOD_LIFETIME_REFERENCE
				},
				{
					title: "Animal Rarity and Habitat Fit",
					content: concept({
						model: "Fauna are not spread evenly across a biome. An animal's rarity depends on habitat needs, food availability, reproduction, competition, predation, and human disturbance. A safari-style guide is stronger when it explains likelihood instead of listing animals randomly.",
						vocabulary: [
							"fauna",
							"habitat",
							"rarity",
							"adaptation",
							"population",
							"carrying capacity"
						],
						evidence:
							"Return to the core biome and choose several animals that could live there. For each animal, note diet, habitat, likely abundance, and one reason the animal is common, rare, seasonal, or hard to observe.",
						check: "Explain why a large predator often has a smaller population than the plants or herbivores beneath it in the food web."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Environmental Cost of Diet Choices",
					content: concept({
						model: "Diet choices connect human needs to land use, water use, energy flow, farming, transportation, culture, and health. Environmental analysis does not reduce the question to one 'good' or 'bad' food; it compares tradeoffs and identifies which evidence is missing.",
						vocabulary: [
							"resource use",
							"energy efficiency",
							"tradeoff",
							"nutrition",
							"sustainability"
						],
						evidence:
							"Compare a current or sample diet with a revised diet that lowers one environmental impact while still considering nutrition and practicality. Use a claim-evidence-reasoning paragraph to explain the revision.",
						check: "Separate an environmental claim from a health claim. A diet can reduce one environmental impact while still needing nutrition evidence."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Food Journal",
					content: project({
						goal: "Connect meals to producer and consumer relationships in a food web.",
						artifact:
							"A table or diagram tracing several foods back to plants, animals, fungi, or other source organisms.",
						evidence:
							"Each row names the likely producer base and identifies whether the food is mostly plant-based, animal-based, or mixed.",
						check: "The analysis explains why eating higher on a food web usually requires more ecosystem energy."
					})
				},
				{
					title: "Project: Biome Safari",
					content: project({
						goal: "Create a field guide to animals in the core biome with evidence-based rarity notes.",
						artifact:
							"A safari guide, slide deck, video outline, or illustrated page with animal names, habitats, diets, and rarity estimates.",
						evidence:
							"Five or more animals are tied to food-web position, habitat needs, and one factor affecting how often they are seen.",
						check: "The guide distinguishes common, rare, hidden, migratory, and endangered possibilities instead of treating all animals as equally visible."
					})
				},
				{
					title: "Project: Diet Plan",
					content: project({
						goal: "Design a more energy-efficient diet model while acknowledging health, culture, and practicality constraints.",
						artifact:
							"A revised meal plan or comparison chart showing original meals, revised meals, environmental reasoning, and open questions.",
						evidence:
							"The plan explains which changes affect food-web energy demand, transportation, water use, or land use.",
						check: "The final note records one benefit, one limitation, and one additional source needed before making a real recommendation."
					})
				}
			]
		},
		{
			title: "ES4 Weather and Climate",
			curriculum: [
				{
					title: "Water Cycle in a Biome",
					content: concept({
						model: "Water moves through ecosystems by evaporation, condensation, precipitation, runoff, infiltration, groundwater flow, plant uptake, and transpiration. The same water-cycle vocabulary can look different in a rainforest, desert, tundra, grassland, or aquatic ecosystem.",
						vocabulary: [
							"water cycle",
							"evaporation",
							"precipitation",
							"runoff",
							"infiltration",
							"transpiration"
						],
						evidence:
							"Use images or descriptions of the core biome to label visible and hidden water locations. Then draw arrows showing how water enters, moves through, leaves, or cycles within the biome.",
						check: "Explain why water may be present in soil, plants, ice, air, organisms, or groundwater even when surface water is not obvious."
					}),
					datasetLink: NASA_WATER_CYCLE
				},
				{
					title: "Weather Versus Climate",
					content: concept({
						model: "Weather describes short-term conditions at a time and place. Climate describes long-term patterns across seasons and years. A cold day does not disprove warming climate trends, and a hot day alone does not prove them; climate claims depend on patterns.",
						vocabulary: [
							"weather",
							"climate",
							"seasonal pattern",
							"trend",
							"long-term average"
						],
						evidence:
							"Compare travel advice for a short visit with advice for moving to the biome for months or years. Use climate summaries, seasonal descriptions, or biome charts to support the difference.",
						check: "Classify statements as weather or climate, then explain what kind of evidence would be needed for each statement."
					}),
					datasetLink: NASA_GRASSLAND
				},
				{
					title: "Climate Change Claim Evaluation",
					content: concept({
						model: "Climate change arguments need careful separation between local weather events, regional climate patterns, global temperature trends, greenhouse gases, impacts, uncertainty, and policy responses. The strongest explanations address the evidence directly instead of arguing from one anecdote.",
						vocabulary: [
							"climate change",
							"greenhouse gas",
							"global trend",
							"regional impact",
							"evidence"
						],
						evidence:
							"Respond to the claim that snowy weather proves climate change is not real. The response needs one or more reliable sources, a definition of weather versus climate, and one example of how local weather can coexist with broader climate trends.",
						check: "Identify whether a sentence is a claim, evidence, or reasoning, then revise it if it relies only on a single local weather observation."
					})
				},
				{
					title: "Terminology: Weather and Climate",
					content: terminology([
						[
							"Weather",
							"Short-term temperature, precipitation, wind, cloudiness, and related conditions at a specific time and place."
						],
						[
							"Climate",
							"Long-term patterns of temperature, precipitation, humidity, wind, and seasons in a region."
						],
						[
							"Water cycle",
							"The movement of water among land, ocean, atmosphere, living things, and underground reservoirs."
						],
						[
							"Climate change",
							"A long-term shift in global or regional climate patterns, often discussed today in relation to rising global temperatures and human greenhouse-gas emissions."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Where Is the Water?",
					content: project({
						goal: "Map visible and hidden water in the core biome.",
						artifact:
							"A labeled diagram, image annotation, or concept map identifying water in air, soil, plants, organisms, ice, rivers, lakes, or groundwater.",
						evidence:
							"Each label includes a short note about how water moves to or from that location.",
						check: "The map uses water-cycle vocabulary and includes one or more hidden water locations."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Project: Travel Guide Weather Addendum",
					content: project({
						goal: "Revise the ES1 travel guide so it distinguishes short-term weather from long-term climate.",
						artifact:
							"A travel-guide addendum with packing advice for a short trip and relocation advice for a long stay.",
						evidence:
							"Use seasonal or climate-pattern evidence to justify the long-term advice, not just the current day's weather.",
						check: "The addendum includes one sentence explaining why weather evidence and climate evidence answer different questions."
					}),
					datasetLink: NASA_GRASSLAND
				},
				{
					title: "Project: Climate Change Debate Response",
					content: project({
						goal: "Write a clear response to a misleading weather-versus-climate claim.",
						artifact:
							"A short blog post, video script, or spoken explanation that responds respectfully and uses evidence.",
						evidence:
							"Include a definition of weather, a definition of climate, a reliable source, and a reasoning sentence connecting the source to the claim.",
						check: "The response avoids overstating certainty from one local event and explains the scale of the evidence."
					})
				}
			]
		},
		{
			title: "ES5 Geology and Oceanography",
			curriculum: [
				{
					title: "Soil as an Ecosystem Resource",
					content: concept({
						model: "Soil is more than loose dirt. It stores water, supports roots, holds nutrients, contains organisms, and changes how ecosystems respond to rainfall, drought, erosion, and land use. Soil texture and structure affect which plants can survive.",
						vocabulary: [
							"soil",
							"erosion",
							"sediment",
							"nutrient",
							"groundwater",
							"water retention"
						],
						evidence:
							"Use a provided image, safe observation, or drawn model of a plant and its soil. Label where water goes, where roots grow, which organisms may live in the soil, and how soil differs from sand, rock, or bare pavement.",
						check: "Predict what changes if soil is replaced by sand, large rocks, pavement, or no ground material, then connect the prediction to water and plant needs."
					})
				},
				{
					title: "Fossils and Fossil Fuels",
					content: concept({
						model: "Fossils preserve evidence of past life, while fossil fuels form from ancient organic matter under specific heat, pressure, burial, and time conditions. Both connect geology to life history, but they serve different scientific and energy roles.",
						vocabulary: [
							"fossil",
							"fossil fuel",
							"coal",
							"oil",
							"natural gas",
							"nonrenewable resource"
						],
						evidence:
							"Create two timelines for an extinct organism or ancient plant material: one showing fossil formation and one showing fossil-fuel formation. The timelines need conditions, scale, and one or more reasons the process is slow.",
						check: "Explain why fossil fuels are considered nonrenewable on human time scales even though they come from once-living material."
					})
				},
				{
					title: "Renewable Energy Comparison",
					content: concept({
						model: "Renewable energy sources such as solar, wind, hydroelectric, geothermal, and some bioenergy options are replenished faster than fossil fuels. Environmental analysis still compares benefits, drawbacks, location limits, infrastructure, storage, wildlife impact, cost, and reliability.",
						vocabulary: [
							"renewable energy",
							"nonrenewable energy",
							"tradeoff",
							"infrastructure",
							"reliability"
						],
						evidence:
							"Compare one fossil fuel with one renewable alternative. Use a benefits/drawbacks table and include one or more environmental advantages and one practical limitation for the renewable option.",
						check: "Avoid treating renewable as automatically impact-free; the comparison needs both benefits and tradeoffs."
					})
				},
				{
					title: "Terminology: Earth Materials and Energy",
					content: terminology([
						[
							"Soil erosion",
							"The movement and loss of soil by water, wind, gravity, or human activity, often reducing soil quality over time."
						],
						[
							"Fossil fuel",
							"An energy resource formed from ancient buried organic material over very long periods of time."
						],
						[
							"Renewable energy",
							"Energy from a source that is replenished on a human time scale, such as sunlight, wind, or flowing water."
						],
						[
							"Oceanography",
							"The study of oceans, including water movement, marine ecosystems, chemistry, geology, and climate interactions."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Soil Photographer",
					content: project({
						goal: "Analyze soil as a functional part of an ecosystem.",
						artifact:
							"A labeled photo, provided image, drawing, or diagram of a plant-soil system with notes about water, roots, organisms, and erosion risk.",
						evidence:
							"Label four or more parts of the system and explain how soil supports plant growth or water movement.",
						check: "The explanation distinguishes soil from rock, sand, or pavement using ecosystem functions, not only appearance."
					})
				},
				{
					title: "Project: Fossil Timeline",
					content: project({
						goal: "Compare fossil formation and fossil-fuel formation using time and conditions.",
						artifact:
							"Two parallel timelines for an extinct animal, ancient plant matter, or another source organism.",
						evidence:
							"Each timeline includes burial or preservation conditions, time scale, and what evidence or resource results.",
						check: "The comparison names which process matters more for scientific evidence and which process matters more for modern energy use."
					})
				},
				{
					title: "Project: Fossil Fuel Alternative",
					content: project({
						goal: "Evaluate one renewable energy source as an alternative to a fossil fuel.",
						artifact:
							"A poster, slide, or brief report comparing the alternative's benefits, drawbacks, geography, cost or infrastructure needs, and environmental impact.",
						evidence:
							"Include one or more facts from reliable sources and one tradeoff that prevents the solution from being perfect everywhere.",
						check: "The final recommendation explains where the alternative works best and where another solution may be needed."
					})
				}
			]
		},
		{
			title: "ES6 Humans and the Environment",
			curriculum: [
				{
					title: "Ecosystem Services",
					content: concept({
						model: "Earth systems provide air, water, food, climate regulation, soil formation, pollination, decomposition, materials, and cultural value. These benefits are often called ecosystem services. A Mars-colony comparison makes hidden Earth services easier to see.",
						vocabulary: [
							"ecosystem service",
							"life-support system",
							"resource",
							"dependency",
							"resilience"
						],
						evidence:
							"Design a self-sufficient Mars colony on paper or slides, then match each required system to the equivalent service provided by Earth. Include water, food, oxygen, waste processing, shelter, energy, and climate control.",
						check: "Explain which Earth services are difficult to replace artificially and why that makes ecosystem protection a practical human concern."
					})
				},
				{
					title: "Daily Environmental Impact",
					content: concept({
						model: "Daily routines connect individuals and societies to electricity, transportation, food systems, packaging, buildings, roads, water, waste, and manufacturing. Environmental impact analysis works at multiple scales: personal choices, community systems, companies, governments, and infrastructure.",
						vocabulary: [
							"environmental impact",
							"consumption",
							"waste",
							"infrastructure",
							"mitigation",
							"systemic change"
						],
						evidence:
							"Map an average day from morning to night. For each activity, name a direct environmental impact and one indirect impact. Then classify possible improvements as individual, household, community, business, or policy-level actions.",
						check: "Separate individual action from system-level action. Both can matter, but they solve different parts of an environmental problem."
					})
				},
				{
					title: "Positive Human Interventions",
					content: concept({
						model: "Human activity can damage ecosystems, but it can also restore, protect, monitor, or redesign them. Conservation, habitat restoration, pollution cleanup, species reintroduction, protected areas, better farming, and policy changes are examples of positive interventions.",
						vocabulary: [
							"restoration",
							"conservation",
							"intervention",
							"protected area",
							"habitat"
						],
						evidence:
							"Find a case where people helped protect or restore an ecosystem. Record the problem, intervention, evidence of improvement, people or organizations involved, and one limitation or tradeoff.",
						check: "Explain why a positive environmental story still needs evidence rather than only good intentions."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Life on Mars",
					content: project({
						goal: "Use a Mars-colony model to identify environmental services Earth already provides.",
						artifact:
							"A colony diagram or systems chart linking survival needs to Earth equivalents.",
						evidence:
							"Include six or more systems and explain how Earth provides or supports each one.",
						check: "The model names one service that is easy to overlook because it normally happens in the background."
					})
				},
				{
					title: "Project: Daily Schedule Impact Map",
					content: project({
						goal: "Connect ordinary daily choices and systems to environmental impact.",
						artifact:
							"A timeline or table from morning to night with activity, resource use, direct impact, indirect impact, and one possible improvement.",
						evidence:
							"Five or more activities are analyzed, and improvements are classified by scale.",
						check: "The map includes both personal actions and larger systems such as power generation, transportation, buildings, or food supply."
					})
				},
				{
					title: "Project: Reverse Ecological Disturbance Report",
					content: project({
						goal: "Report on a case where human action protected, restored, or improved an ecosystem.",
						artifact:
							"A report, script, or presentation explaining the original problem, the intervention, evidence of improvement, and remaining limitations.",
						evidence:
							"Use one or more credible sources and connect the case to restoration, conservation, or ecosystem-service vocabulary.",
						check: "The report names who benefited, what evidence changed, and what problem remains unsolved."
					})
				}
			]
		},
		{
			title: "ES7 Earth's Past, Present, and Future",
			curriculum: [
				{
					title: "Personal Biome Comparison",
					content: concept({
						model: "A neighborhood, yard, balcony view, park, street, or nearby green space can be treated as a small environmental case study. Comparing this personal biome with the course core biome reveals how climate, landscape, water, plants, animals, and human design differ.",
						vocabulary: [
							"local environment",
							"landscape",
							"urban ecosystem",
							"comparison",
							"human interaction"
						],
						evidence:
							"Describe a local environment using notes, a safe observation, a provided photo, a map, or a memory-based sketch. Include landscape, plant life, animal life, water, weather, and human-built features.",
						check: "Name two or more similarities and two or more differences between the local environment and the selected core biome."
					})
				},
				{
					title: "Past Environmental Change",
					content: concept({
						model: "The same place can look very different across deep time, historical time, and recent decades. Past change may come from climate, sea level, glaciers, species movement, geological processes, agriculture, roads, buildings, and other human land use.",
						vocabulary: [
							"past environment",
							"land-use change",
							"deep time",
							"historical change",
							"evidence"
						],
						evidence:
							"Construct a fictional but evidence-informed report describing the local environment two million years ago or in another past period. Mark which details are documented, inferred, or speculative.",
						check: "Explain how humans have changed the current environment and how that kind of evidence differs from deep-time evidence."
					})
				},
				{
					title: "Future Scenario Modeling",
					content: concept({
						model: "Future environmental models use current trends, constraints, and choices to imagine possible outcomes. A scenario is not a prediction with certainty; it is a structured possibility that explains what would need to happen for the future to unfold that way.",
						vocabulary: [
							"future scenario",
							"trend",
							"uncertainty",
							"adaptation",
							"sustainability"
						],
						evidence:
							"Create two future versions of the local environment: one where current problems continue and one where people make improvements. Include landscape, water, organisms, climate or weather concerns, and human infrastructure.",
						check: "Explain which changes are likely, which are uncertain, and which depend on human decisions."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Tour of Your Biome",
					content: project({
						goal: "Create an environmental tour of a local place and compare it with the course core biome.",
						artifact:
							"A written report, video script, narrated slide deck, or illustrated guide describing landscape, plants, animals, water, weather, and human interactions.",
						evidence:
							"The tour includes five or more observations or documented descriptions and a comparison with the core biome.",
						check: "The tour explains how people interact with the local environment rather than only listing what is present."
					})
				},
				{
					title: "Project: Your Biome in the Past",
					content: project({
						goal: "Model how the local environment may have looked in the past.",
						artifact:
							"A fictional report, diagram, timeline, or slide set distinguishing evidence-backed details from inferred details.",
						evidence:
							"The model names climate, landforms, organisms, and human influence or lack of human influence.",
						check: "The project explains what changed, what stayed similar, and what evidence would improve the reconstruction."
					})
				},
				{
					title: "Project: Your Biome in the Future",
					content: project({
						goal: "Create a future scenario for the local environment and evaluate whether it is desirable.",
						artifact:
							"A report, diagram, or presentation showing the far-future environment, likely changes, uncertain changes, and preferred improvements.",
						evidence:
							"The scenario connects three or more current trends or choices to future outcomes.",
						check: "The project identifies one change that would make the local environment better for people and one change that would protect the natural system."
					})
				}
			]
		},
		{
			title: "ES8 Environmental Design Capstone",
			curriculum: [
				{
					title: "Capstone Problem Selection",
					content: concept({
						model: "The capstone turns the course's recurring ideas into an environmental design proposal. Strong proposals choose a specific problem, define who or what is affected, explain why the problem matters, and connect the solution to ecosystem evidence instead of only good intentions.",
						vocabulary: [
							"proposal",
							"stakeholder",
							"environmental benefit",
							"drawback",
							"long-term impact"
						],
						evidence:
							"Choose a problem from the core biome, the local environment, or one of the Ecosystem Reporter cases. Write a problem statement with location, cause, affected living and nonliving parts, and evidence that the problem is real.",
						check: "The problem statement is specific enough that a solution can be judged against it."
					})
				},
				{
					title: "Proposal Design and Tradeoffs",
					content: concept({
						model: "Environmental design requires tradeoffs. A proposal may benefit the natural environment, human society, or both, but it can also have costs, risks, unequal impacts, time constraints, or persuasion challenges. Naming tradeoffs makes the proposal stronger.",
						vocabulary: [
							"tradeoff",
							"feasibility",
							"cost",
							"risk",
							"persuasion",
							"implementation"
						],
						evidence:
							"Describe the proposed action, materials or systems needed, timeline, people involved, strategy for convincing others, expected short-term effects, and expected effects 50 years later.",
						check: "The proposal includes one or more drawbacks or harmed groups and explains how the design could reduce that problem."
					})
				},
				{
					title: "Course Synthesis",
					content: concept({
						model: "The final proposal connects ecosystems, food webs, weather and climate, water, soil, energy, human impact, past change, future scenarios, and evidence quality. A good synthesis does not repeat every module; it selects the concepts that actually explain the chosen problem.",
						vocabulary: [
							"ecosystem",
							"food web",
							"climate",
							"resource",
							"human impact",
							"sustainability"
						],
						evidence:
							"Create a one-page concept map showing which course ideas support the proposal. Each connection needs a short reason, such as how water affects plant survival or how energy choices affect greenhouse-gas emissions.",
						check: "The synthesis names three or more course modules and explains how each one changes the proposal."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Transform Our Environment Proposal",
					content: project({
						goal: "Design a proposal that protects, restores, or improves an environmental system over time.",
						artifact:
							"A written report, presentation, or video plan with problem statement, evidence, proposed action, resources, timeline, benefits, drawbacks, and long-term impacts.",
						evidence:
							"Use three or more course concepts and two or more credible sources or documented observations.",
						check: "The proposal explains what success would look like, who helps make it happen, and how the environment could look 50 years later."
					})
				},
				{
					title: "Project: Environmental Action Pitch",
					content: project({
						goal: "Turn the proposal into a concise pitch for an audience that could support the idea.",
						artifact:
							"A script, slide deck, or speaking outline that explains the problem, why it matters, the plan, and what role the audience can play.",
						evidence:
							"The pitch uses clear evidence and avoids relying only on fear, slogans, or vague claims.",
						check: "The pitch has a clear ask: learn more, change a behavior, support a policy, join a project, fund a tool, or share evidence."
					})
				},
				{
					title: "Project: Final Reflection Map",
					content: project({
						goal: "Reflect on how the course changed the way environmental systems are analyzed.",
						artifact:
							"A concept map or short reflection connecting five or more course vocabulary terms to projects completed during the course.",
						evidence:
							"The reflection includes one concept that became clearer, one question that remains open, and one environmental issue worth studying next.",
						check: "The reflection separates personal interest from evidence-based explanation."
					})
				}
			]
		}
	],
	developmentMetadata: {
		priority: "soon",
		standards: [
			"NGSS Earth and human activity",
			"NGSS ecosystems",
			"NGSS matter and energy in organisms and ecosystems",
			"Systems and system models",
			"Claim-evidence-reasoning"
		],
		sourcePolicy:
			"Built from the ES1-ES8 sequence with neutral wording, remote-safe activities, vetted public references, and a pending static-media entry for the photosynthesis diagram.",
		assessmentCadence: [
			"One model, map, or report per module",
			"One vocabulary-backed evidence explanation per module",
			"Recurring core-biome portfolio",
			"Capstone proposal with tradeoff analysis"
		],
		toolchain: [
			"Shared screen",
			"Notebook or digital document",
			"NASA biome references",
			"Provided images or diagrams",
			"Concept maps",
			"Written or video-script reports"
		],
		safetyPolicy: [
			"No required outdoor collection",
			"No required household experiments",
			"No food or diet change recommendation",
			"Optional observations can be replaced with provided images or references"
		],
		courseBoundaries: [
			"Introductory environmental science",
			"Evidence literacy and systems thinking over physical lab work",
			"No personal medical, nutrition, or political advocacy requirement"
		],
		capstoneExpectations: [
			"Specific environmental problem",
			"Evidence-backed proposal",
			"Benefits and drawbacks",
			"Stakeholder and timeline reasoning",
			"Long-term impact scenario"
		],
		recommendedNextWork: [
			"Add a local Environmental Science reference pack with selected NASA, NOAA, USGS, and EPA data sources by module.",
			"Upload the reserved photosynthesis diagram or replace it with an owned/source-safe visual.",
			"Add optional data tables for water, climate, energy, and land-use comparisons."
		]
	}
};
