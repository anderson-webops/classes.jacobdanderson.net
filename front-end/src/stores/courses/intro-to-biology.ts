import type { RawCourse } from "./types";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";

function concept({
	evidence,
	focus,
	investigation,
	model
}: {
	evidence: string;
	focus: string;
	investigation: string;
	model: string;
}) {
	return [
		`**Investigation:** ${investigation}`,
		`**Model:** ${model}`,
		`**Evidence target:** ${evidence}`,
		`**Review check:** ${focus}`
	].join("\n\n");
}

function project({
	artifact,
	evidence,
	investigation,
	review
}: {
	artifact: string;
	evidence: string;
	investigation: string;
	review: string;
}) {
	return [
		`**Investigation:** ${investigation}`,
		`**Artifact:** ${artifact}`,
		`**Evidence target:** ${evidence}`,
		`**Review check:** ${review}`
	].join("\n\n");
}

export const introToBiologyCourse: RawCourse = {
	name: "Intro to Biology",
	modules: [
		{
			title: "BIO1 Human Body Systems",
			curriculum: [
				{
					title: "Equipment-Free Biology Workflow",
					content: concept({
						investigation:
							"No beakers, kits, dissections, food handling, or required household experiments are needed. The course works through diagrams, shared reference images, short readings, provided scenarios, notebook sketches, comparison tables, and claim-evidence-reasoning responses.",
						model: "A biology notebook stores vocabulary, labeled sketches, evidence notes, open questions, and model revisions. The same notebook also tracks a digestive-system travel journal that grows across the course.",
						evidence:
							"Every activity separates observation from inference. A labeled diagram, a table, a scenario response, or a short CER paragraph counts as evidence when it names what was observed and why it supports the claim.",
						focus: "Explain the difference between a body part, an organ, an organ system, and a body process."
					})
				},
				{
					title: "Body Systems Reference A",
					content: [
						concept({
							investigation:
								"This section has a placeholder for the human-body diagram `biomod1pro1im1.jpg`. The class static host URL is reserved so the diagram can appear here when the file is available.",
							model: "Body systems are coordinated groups of organs. A useful systems map includes at least one representative organ and the main job for each system.",
							evidence:
								"Label skeletal, nervous, integumentary, respiratory, circulatory, digestive, excretory, endocrine, immune, and muscular examples.",
							focus: "Trace one everyday action, such as running or eating, across at least three interacting systems."
						}),
						pendingStaticMediaNotice("biomod1pro1im1.jpg")
					].join("\n\n"),
					mediaLink: staticMediaUrl("biomod1pro1im1.jpg")
				},
				{
					title: "Body Systems Reference B",
					content: [
						concept({
							investigation:
								"This section has a placeholder for the body-systems reference `biomod1pro1im2.jpg`. When the hosted file becomes available, the course viewer renders the image in this space automatically.",
							model: "Systems overlap rather than operating as isolated boxes. Respiratory and circulatory systems exchange and transport gases; nervous and endocrine systems coordinate signals; immune and integumentary systems protect boundaries.",
							evidence:
								"Use arrows to show which system receives information, which system moves material, and which system changes the body's response.",
							focus: "Name one system interaction and explain what would break if either system stopped contributing."
						}),
						pendingStaticMediaNotice("biomod1pro1im2.jpg")
					].join("\n\n"),
					mediaLink: staticMediaUrl("biomod1pro1im2.jpg")
				},
				{
					title: "Scenario-Based System Interactions",
					content: concept({
						investigation:
							"Three source scenarios anchor this module: exercising on a hot day, a food-allergy reaction, and calcium intake from milk or another calcium source.",
						model: "Each scenario is a cause-and-effect chain. The event changes internal conditions, body systems detect or respond to the change, and organs coordinate a response that helps maintain stability.",
						evidence:
							"Highlight the systems involved, add arrows for information or material flow, and write one sentence explaining how the response helps the body.",
						focus: "Separate direct evidence in the scenario from a reasonable biological inference."
					})
				},
				{
					title: "Travel Journal Framework",
					content: concept({
						investigation:
							"The course-long travel journal follows one meal through digestion, absorption, energy conversion, regulation, elimination, and excretion.",
						model: "The journal is a narrative model. It records where the meal components move, how molecules change form, which organs participate, and which processes are still uncertain.",
						evidence:
							"Each entry contains one labeled location, one biological process, one vocabulary term, and one question or revision note.",
						focus: "Connect a journal entry to the body-system map rather than treating it as a separate writing task."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Human Body Systems Map",
					content: project({
						investigation:
							"Create a human-body map with one representative organ from each major system named in the module.",
						artifact:
							"A labeled diagram, slide, or notebook page with organs, system names, and one short function note per system.",
						evidence:
							"At least ten system labels are present, and at least three arrows show how systems work together.",
						review: "Explain why the map is a model instead of a complete copy of the body."
					})
				},
				{
					title: "Project: Scenario Response Map",
					content: project({
						investigation:
							"Choose one system-interaction scenario and annotate the body map with the organs and systems involved.",
						artifact:
							"A marked-up system map plus a short claim-evidence-reasoning paragraph.",
						evidence:
							"The response names the trigger, the responding systems, and the evidence that supports the pathway.",
						review: "Identify one assumption in the explanation and one piece of evidence that would make the model stronger."
					})
				},
				{
					title: "Project: Travel Journal Launch",
					content: project({
						investigation:
							"Select one realistic meal or snack to follow through the digestive and excretory-system journey.",
						artifact:
							"A first journal entry that describes the meal, predicts where it will travel, and names at least two molecule or nutrient types to track.",
						evidence:
							"The entry includes an initial diagram or flow chart that can be revised in later modules.",
						review: "Mark which parts of the entry are observations, predictions, and open questions."
					})
				}
			]
		},
		{
			title: "BIO2 Nutrients and Macromolecules",
			curriculum: [
				{
					title: "Macromolecule Evidence",
					content: concept({
						investigation:
							"Food can be interpreted by the major biological molecules it provides: carbohydrates, lipids, proteins, vitamins, minerals, and water.",
						model: "Carbohydrates often provide quick energy, lipids store energy and build membranes, proteins supply amino acids for structures and chemical work, and vitamins and minerals support many processes without acting as the main energy source.",
						evidence:
							"Classify meal ingredients by nutrient group, then explain which evidence points to each classification.",
						focus: "Distinguish a food name from the molecules and nutrients contained inside that food."
					})
				},
				{
					title: "Mission Dossier Graph",
					content: [
						concept({
							investigation:
								"The original source mission used a scrambled graph to match dinner guests with the dishes they ate. This placeholder reserves the original image filename `biomod2pro1im1.png`.",
							model: "A graph can represent relative molecule levels before and after a meal. Changes in carbohydrate, amino-acid, and fatty-acid levels act as clues.",
							evidence:
								"Match each guest to a dish by naming the strongest graph clue and ruling out at least one alternative.",
							focus: "Explain why a graph pattern supports a meal hypothesis without claiming certainty beyond the evidence."
						}),
						pendingStaticMediaNotice("biomod2pro1im1.png")
					].join("\n\n"),
					mediaLink: staticMediaUrl("biomod2pro1im1.png")
				},
				{
					title: "Nutrient Recipe Book",
					content: concept({
						investigation:
							"A recipe can be analyzed as a nutrient model. Ingredients are grouped by the main nutrients they contribute, not by whether the food seems healthy in everyday language.",
						model: "Each recipe page links ingredients to carbohydrate, protein, fat, vitamin, and mineral categories. The model can also show when one ingredient contributes more than one category.",
						evidence:
							"Use ingredient labels, common nutrition knowledge, or provided notes to justify each category.",
						focus: "Identify one missing nutrient group and revise the recipe or explanation to account for it."
					})
				},
				{
					title: "Travel Journal Meal Profile",
					content: concept({
						investigation:
							"The selected meal becomes the main object tracked through digestion. This entry records what the meal contains before the body changes it.",
						model: "The journal profile is an initial inventory: ingredients, nutrient groups, predicted molecules, and expected destinations. It stays revisable because later modules may change an early prediction about where a nutrient travels or how the body uses it.",
						evidence:
							"Name at least three meal components and classify each by nutrient group with a short evidence note. Include one uncertainty note when an ingredient has more than one possible nutrient role.",
						focus: "Predict which components are likely to provide energy, structure, or regulatory support, then mark which prediction will need digestive-system evidence later."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Dinner Mystery",
					content: project({
						investigation:
							"Use nutrient clues to match fictional guests with dishes from the source mission.",
						artifact:
							"A table with one row per guest, one predicted dish, the strongest clue, and one rejected alternative.",
						evidence:
							"Each match references carbohydrates, fatty acids, or amino acids as the deciding evidence.",
						review: "Explain which match has the strongest evidence and which match remains most uncertain."
					})
				},
				{
					title: "Project: Nutrient Recipe Book",
					content: project({
						investigation:
							"Design two or three meals that include multiple nutrient categories.",
						artifact:
							"Recipe cards with ingredients, nutrient labels, and one explanation of how the meal supports the body.",
						evidence:
							"Each recipe includes carbohydrates, proteins, fats, vitamins, and minerals or explains a missing category clearly.",
						review: "Revise one recipe after noticing a weak or unsupported nutrient claim."
					})
				},
				{
					title: "Project: Meal Journal Entry",
					content: project({
						investigation:
							"Write the first full travel-journal entry for the selected meal.",
						artifact:
							"A paragraph, slide, or diagram naming the meal's components and predicted nutrient groups.",
						evidence:
							"The entry includes at least one evidence note for each major nutrient claim.",
						review: "Mark one prediction that will be checked again after studying digestion and absorption."
					})
				}
			]
		},
		{
			title: "BIO3 Digestive Process",
			curriculum: [
				{
					title: "Digestive System Organs",
					content: concept({
						investigation:
							"The digestive system includes the mouth, pharynx, esophagus, stomach, small intestine, large intestine, liver, and pancreas.",
						model: "A complete digestive-system model shows both path organs, where food physically travels, and accessory organs, which release materials that support digestion.",
						evidence:
							"Label each organ, place it in sequence, and name its role in ingestion, digestion, absorption, or elimination.",
						focus: "Distinguish the tube-like path from organs that support the path without food passing through them."
					})
				},
				{
					title: "Ingestion Pathway",
					content: concept({
						investigation:
							"Ingestion begins when food enters the mouth and moves through the pharynx and esophagus toward the stomach.",
						model: "The pathway can be modeled as a storyboard. Each frame shows the food location, the physical movement, and any chemical or mechanical change.",
						evidence:
							"Add arrows for movement, labels for organs, and notes for chewing, swallowing, and peristalsis.",
						focus: "Explain why movement through the digestive tract is active and coordinated rather than simple falling."
					})
				},
				{
					title: "Food Processing Stages",
					content: concept({
						investigation:
							"Food processing can be organized as ingestion, digestion, absorption, and elimination.",
						model: "Each stage answers a different question: how food enters, how large molecules are broken down, how useful material enters the body, and how unused material leaves.",
						evidence:
							"Match each stage to the organs where it mainly occurs and add one example of a material being changed or moved.",
						focus: "Connect the stage names to biological actions rather than memorizing a list."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Digestive Anatomy Gallery",
					content: project({
						investigation:
							"Create an art-gallery style collection of major digestive organs.",
						artifact:
							"A labeled set of organ sketches or slides plus a combined digestive-system map.",
						evidence:
							"Each organ has a name, an approximate position, and a short function note.",
						review: "Explain how the individual organ cards combine into one system-level model."
					})
				},
				{
					title: "Project: Ingestion Storyboard",
					content: project({
						investigation:
							"Model food traveling through the mouth, pharynx, and esophagus.",
						artifact:
							"A three-page storyboard or flow diagram with arrows, labels, and process notes.",
						evidence:
							"The storyboard identifies what moves, what muscles or structures help, and what changes before the stomach.",
						review: "Find one place where the drawing could imply the wrong direction or process, then revise it."
					})
				},
				{
					title: "Project: Digestive Travel Entry",
					content: project({
						investigation:
							"Add a journal entry focused on the ingestion stage of the selected meal.",
						artifact:
							"A narrative or diagram that follows the meal through the first digestive organs.",
						evidence:
							"The entry names at least three organs and one physical process.",
						review: "Connect the journal entry back to the digestive-system organ map."
					})
				}
			]
		},
		{
			title: "BIO4 Digestion and Absorption",
			curriculum: [
				{
					title: "Digestion Versus Absorption",
					content: concept({
						investigation:
							"Digestion breaks food into smaller molecules; absorption moves useful molecules into the body.",
						model: "A timeline of the digestive tract can show where carbohydrates, proteins, fats, vitamins, minerals, and water are broken down or absorbed.",
						evidence:
							"Use separate color tracks for nutrient groups and mark where each group changes or enters the bloodstream or lymphatic system.",
						focus: "Explain why breaking food apart is not the same as absorbing it."
					})
				},
				{
					title: "Absorption Timeline",
					content: concept({
						investigation:
							"Different nutrients have different processing paths and do not all enter the body in exactly the same way.",
						model: "A multi-track timeline makes the digestive tract visible as a sequence of locations and transformations.",
						evidence:
							"Place digestion and absorption events along the mouth, stomach, small intestine, and large intestine.",
						focus: "Identify the small intestine as a major absorption site and explain what kind of evidence supports that role."
					})
				},
				{
					title: "Salad Clue Case",
					content: concept({
						investigation:
							"The case describes a salad ingredient carrying a fictional poison that shuts down digestion only after reaching a specific location.",
						model: "A clue-based biological argument uses the digestive sequence to rule out impossible locations and identify likely ingredients.",
						evidence:
							"Use the clue that the mouth, throat, and esophagus are unaffected, then compare lettuce, tomatoes, chicken, and olive oil by nutrient category.",
						focus: "Write a report that separates the clue, the digestive reasoning, and the final recommendation."
					})
				},
				{
					title: "Digestive Model Case Study",
					content: concept({
						investigation:
							"This online version treats the digestion model as a diagram, video still, or written case study unless safe materials are deliberately chosen outside the core assignment.",
						model: "The model compares mouth, stomach, and intestine roles through mechanical breakdown, chemical environment, and filtering or absorption.",
						evidence:
							"Annotate what each part of the model represents and name one important limitation of the model.",
						focus: "Explain why a model can be useful even when it does not copy the real digestive system perfectly."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Nutrient Absorption Timeline",
					content: project({
						investigation:
							"Build a digestive-tract timeline with separate tracks for major nutrient groups.",
						artifact:
							"A diagram or slide with organs, nutrient tracks, arrows, and short process labels.",
						evidence:
							"Each nutrient track includes at least one digestion note and one absorption or destination note.",
						review: "Use the timeline to explain where one meal component changes most."
					})
				},
				{
					title: "Project: Salad Clue Report",
					content: project({
						investigation:
							"Solve the fictional salad poison case using digestive sequence evidence.",
						artifact:
							"A short report with claim, evidence, reasoning, and one rejected alternative.",
						evidence:
							"The report cites the clue and explains why the unaffected organs matter.",
						review: "Identify whether the conclusion is certain or only best-supported by the available information."
					})
				},
				{
					title: "Project: Model Strengths and Limits",
					content: project({
						investigation:
							"Analyze a digestion model as a representation rather than a perfect replica.",
						artifact:
							"A two-column chart naming what the model explains well and what it hides or distorts.",
						evidence:
							"The chart references at least three digestive structures or processes.",
						review: "Connect one model limitation to a possible wrong conclusion."
					})
				}
			]
		},
		{
			title: "BIO5 Energy Use and Storage",
			curriculum: [
				{
					title: "Food to Cellular Energy",
					content: concept({
						investigation:
							"Food molecules can be converted into usable cellular energy after digestion and absorption.",
						model: "A cell-as-factory diagram shows inputs, processing steps, useful energy, and waste products. The model can connect glucose, oxygen, carbon dioxide, water, and ATP without turning the course into advanced biochemistry.",
						evidence:
							"Label the starting materials, the cellular location or process, and the products leaving the model.",
						focus: "Explain why food energy is transformed rather than simply appearing as usable energy."
					})
				},
				{
					title: "Energy Budget",
					content: concept({
						investigation:
							"A meal supplies energy that the body allocates across movement, temperature control, repair, growth, organ function, and storage.",
						model: "An energy budget is an estimate, not an exact medical calculation. It organizes where energy might go over a chosen time window.",
						evidence:
							"Assign portions of a meal's estimated energy to several body uses and explain the assumptions behind the allocation.",
						focus: "Separate the arithmetic in the budget from the biological claim being made."
					})
				},
				{
					title: "Energy Storage",
					content: concept({
						investigation:
							"Energy not used immediately can be stored in biological forms such as glycogen and fat.",
						model: "Storage is part of regulation. The body balances current energy demand, available nutrients, and future needs through connected organ systems.",
						evidence:
							"Trace one meal component from digestion to immediate use or storage.",
						focus: "Explain why stored energy can be useful and why unlimited storage would create problems."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Cell Factory Diagram",
					content: project({
						investigation:
							"Create a cell-factory model for converting absorbed nutrients into usable energy.",
						artifact:
							"A labeled diagram with inputs, process arrows, ATP or usable-energy output, and waste products.",
						evidence:
							"The diagram identifies glucose or another nutrient, oxygen, carbon dioxide, water, and energy transfer.",
						review: "Name one simplification in the factory model and one reason it remains useful."
					})
				},
				{
					title: "Project: Three-Hour Energy Budget",
					content: project({
						investigation:
							"Estimate how energy from the selected meal might be used across a three-hour period.",
						artifact:
							"A budget table or pie chart with activity categories, approximate energy allocation, and notes.",
						evidence:
							"The estimate is tied to at least four body functions or activities.",
						review: "Mark which values are measured, estimated, or assumed."
					})
				},
				{
					title: "Project: Energy Journal Entry",
					content: project({
						investigation:
							"Add a travel-journal entry focused on how the meal provides energy and storage material.",
						artifact:
							"A paragraph or diagram tracing at least two meal components into energy use or storage.",
						evidence:
							"The entry names the nutrient group and the likely body use for each tracked component.",
						review: "Revise an earlier prediction from the meal profile if the energy model changes it."
					})
				}
			]
		},
		{
			title: "BIO6 Regulation of Digestion",
			curriculum: [
				{
					title: "Regulation Organs",
					content: concept({
						investigation:
							"The stomach, pancreas, and liver support digestion and energy regulation through chemicals, storage, release, and feedback.",
						model: "A flowchart can show signals, organ responses, and changes in digestive activity or energy storage. Strong flowcharts separate the signal, the responding organ, the material released or stored, and the body condition that changes afterward.",
						evidence:
							"Add labeled arrows showing what each organ releases, stores, or changes. Use separate arrows for material movement, such as nutrients or bile, and information flow, such as chemical signals.",
						focus: "Explain why regulation requires feedback rather than a one-way process, and identify one place where the model would need more evidence to choose the exact signal."
					})
				},
				{
					title: "System Interaction Evidence",
					content: concept({
						investigation:
							"Digestive regulation connects with the endocrine, nervous, immune, circulatory, and excretory systems.",
						model: "A system-interaction map represents signals and material movement between systems. The map makes the direction of each connection visible so a hormone signal, blood transport pathway, nerve signal, immune response, or waste-removal pathway is not treated as the same kind of interaction.",
						evidence:
							"Use a short abstract, summary, or provided scenario to identify a digestive-system interaction with another body system. Record the quoted or paraphrased evidence beside the inferred biological meaning.",
						focus: "Quote or paraphrase the evidence before explaining the biological connection, then label whether the connection is directly stated or inferred from the scenario."
					})
				},
				{
					title: "Research Abstract Practice",
					content: concept({
						investigation:
							"Scientific abstracts are dense summaries. They can still be mined for the question, system involved, measured factor, and conclusion.",
						model: "An abstract annotation separates purpose, method, result, and limitation.",
						evidence:
							"Highlight or list phrases connected to digestion, energy storage, regulation, or body-system interaction.",
						focus: "Distinguish what the abstract directly reports from what the course model infers."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Regulation Flowchart",
					content: project({
						investigation:
							"Build a flowchart showing how digestive activity or energy storage is regulated.",
						artifact:
							"A labeled flowchart using the stomach, pancreas, liver, and at least one other body system.",
						evidence:
							"Arrows show signals or materials, and each node includes a short function label.",
						review: "Find one feedback loop or one missing signal that would improve the model."
					})
				},
				{
					title: "Project: Abstract Interaction Notes",
					content: project({
						investigation:
							"Read a short biology abstract or summary and extract digestive-system interactions.",
						artifact:
							"A bullet list or table naming the interaction, evidence phrase, and interpretation.",
						evidence:
							"At least three notes connect digestive regulation to another system.",
						review: "Label one note as direct evidence and one note as an inference."
					})
				},
				{
					title: "Project: Regulation Journal Entry",
					content: project({
						investigation:
							"Add a journal entry about one way another body system influences the selected meal's digestion or energy use.",
						artifact:
							"A paragraph, diagram, or flowchart connecting the meal to regulation.",
						evidence:
							"The entry names one regulating organ and one interacting body system.",
						review: "Connect the entry to the regulation flowchart rather than leaving it as an isolated description."
					})
				}
			]
		},
		{
			title: "BIO7 Elimination and Excretion",
			curriculum: [
				{
					title: "Elimination Versus Excretion",
					content: concept({
						investigation:
							"Elimination removes undigested or unabsorbed material from the digestive tract, while excretion removes metabolic wastes from the body.",
						model: "A comparison chart keeps digestive waste and metabolic waste separate. The large intestine, rectum, and anus are central to elimination; kidneys, bladder, lungs, liver, and skin connect to excretion.",
						evidence:
							"Classify example materials as eliminated, excreted, both connected, or not enough information.",
						focus: "Explain why feces and urine are not the same biological category of waste."
					})
				},
				{
					title: "Excretory Organ Cards",
					content: concept({
						investigation:
							"Major excretory structures include kidneys, bladder, liver, lungs, skin, and the materials they help remove or process.",
						model: "Trading cards turn organ structure and function into a compact reference model.",
						evidence:
							"Each card names the organ, the waste or material involved, and the body's reason for removing or processing it.",
						focus: "Connect each organ card to a material rather than only naming the organ."
					})
				},
				{
					title: "Alien Biology Comparison",
					content: concept({
						investigation:
							"The source scenario describes an alien with missing digestive structures but similar excretory organs.",
						model: "A Venn diagram compares how two organisms handle undigested material and metabolic waste.",
						evidence:
							"Classify similarities and differences using digestive and excretory vocabulary.",
						focus: "Explain how removing a digestive structure changes elimination without automatically changing every excretory process."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Waste-System Trading Cards",
					content: project({
						investigation:
							"Create trading cards for kidneys, bladder, liver, lungs, skin, and excreted material.",
						artifact:
							"Cards with image or symbol, function, waste material, and a short biological explanation.",
						evidence:
							"Each card names what the organ processes or removes.",
						review: "Sort the cards into digestive, excretory, or both-connected categories."
					})
				},
				{
					title: "Project: Alien Venn Diagram",
					content: project({
						investigation:
							"Compare a human and the source alien that lacks part of the digestive tract.",
						artifact:
							"A Venn diagram plus a short explanation of elimination and excretion differences.",
						evidence:
							"The comparison uses at least four vocabulary terms from the module.",
						review: "Name one claim the scenario supports and one claim that remains unknown."
					})
				},
				{
					title: "Project: Final Waste Journal Entry",
					content: project({
						investigation:
							"Complete the final travel-journal entry for the selected meal.",
						artifact:
							"A journal entry distinguishing which parts of the meal may be eliminated and which byproducts may be excreted.",
						evidence:
							"The entry names at least one digestive waste pathway and one metabolic waste pathway.",
						review: "Connect the final entry to earlier nutrient, energy, and regulation entries."
					})
				}
			]
		},
		{
			title: "BIO8 Digestive Odyssey Capstone",
			curriculum: [
				{
					title: "Capstone Evidence Portfolio",
					content: concept({
						investigation:
							"The final project synthesizes the digestive and excretory-system journey from the travel journal.",
						model: "The portfolio is a multi-stage system model: meal components enter, break down, absorb, convert to energy or storage, interact with regulation, and leave as eliminated or excreted material.",
						evidence:
							"Collect the meal profile, organ map, absorption timeline, energy model, regulation flowchart, and waste comparison.",
						focus: "Identify which artifact gives the strongest evidence for each stage of the biological journey."
					})
				},
				{
					title: "Capstone Representation Choices",
					content: concept({
						investigation:
							"The final product can be a slide exhibit, illustrated story, annotated map, comic, poster, or recorded explanation represented through notes and visuals.",
						model: "Different representations reveal different information. A map shows location, a timeline shows order, a flowchart shows regulation, and a story can connect cause and effect.",
						evidence:
							"Choose a representation and name what it shows well and what it may hide.",
						focus: "Make the final representation traceable back to notebook evidence rather than only decorative."
					})
				},
				{
					title: "Course Synthesis",
					content: concept({
						investigation:
							"The course connects organ systems, macromolecules, digestion, absorption, energy, regulation, elimination, and excretion.",
						model: "Biology explanations combine structure, function, evidence, and scale. A single meal can be traced from visible food to molecules, organs, cells, and body systems, and the final explanation shows how those scales connect instead of listing them separately.",
						evidence:
							"Use at least three earlier artifacts to support the final explanation. Good evidence might include the nutrient inventory, digestive organ map, absorption timeline, energy budget, regulation flowchart, or waste comparison.",
						focus: "Name one concept that became clearer after connecting multiple modules, then identify one model limitation that still matters after the capstone."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Digestive Odyssey Exhibit",
					content: project({
						investigation:
							"Create a final product that represents the selected meal's journey through digestion, energy use, regulation, and waste handling.",
						artifact:
							"A slide deck, poster, illustrated story, comic, annotated map, or notebook exhibit with labeled stages.",
						evidence:
							"The exhibit includes meal description, digestion and absorption observations, energy conversion, at least two system interactions, and elimination or excretion explanation.",
						review: "Trace one meal component across the whole exhibit from starting food to final destination."
					})
				},
				{
					title: "Project: Biology CER Presentation",
					content: project({
						investigation:
							"Turn one part of the capstone into a claim-evidence-reasoning explanation.",
						artifact:
							"A short presentation or written CER paragraph connected to one diagram or table.",
						evidence:
							"The claim references a body process, evidence comes from the journal or model, and reasoning explains the biological connection.",
						review: "Separate claim, evidence, and reasoning so the argument can be checked."
					})
				},
				{
					title: "Project: Final Systems Reflection",
					content: project({
						investigation:
							"Reflect on how the digestive and excretory systems connect with the rest of the body.",
						artifact:
							"A comparison or reflection page naming the most important system interaction and the strongest model from the course.",
						evidence:
							"The reflection cites at least two earlier artifacts.",
						review: "Name one model limitation that remains after the final project."
					})
				}
			]
		}
	],
	developmentMetadata: {
		priority: "soon",
		standards: [
			"NGSS life science practices",
			"Structure and function",
			"Systems and system models",
			"Energy and matter",
			"Claim-evidence-reasoning"
		],
		sourcePolicy:
			"Adapted from the BIO1-BIO8 sequence with neutral wording, equipment-free activities, and static.classes placeholder media for missing images.",
		assessmentCadence: [
			"One diagram or model per module",
			"One short CER or evidence explanation per module",
			"Course-long travel journal evidence portfolio"
		],
		toolchain: [
			"Shared screen",
			"Notebook or digital document",
			"Diagrams",
			"Provided source scenarios",
			"Static image placeholders"
		],
		safetyPolicy: [
			"No required food handling",
			"No required household experiments",
			"No biological specimens",
			"No medical advice or diagnosis"
		],
		courseBoundaries: [
			"Introductory body systems and digestion focus",
			"No dissection or wet lab requirement",
			"No personalized nutrition or health guidance"
		],
		capstoneExpectations: [
			"Digestive-system journey model",
			"Evidence portfolio",
			"Claim-evidence-reasoning explanation",
			"Model limitation reflection"
		],
		recommendedNextWork: [
			"Add vetted open biology reference links by module",
			"Upload missing original biology images to static.classes",
			"Cross-link Intro to Environmental Science where ecosystems, energy flow, and evidence modeling continue the biology sequence"
		]
	}
};
