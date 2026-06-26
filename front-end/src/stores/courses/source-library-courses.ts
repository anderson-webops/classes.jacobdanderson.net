import type { RawCourse, RawCourseModule } from "./types";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

interface SourceLibraryCourseSpec {
	area: string;
	focus: string;
	name: string;
	modules: string[];
	sourceActivityAnchors?: Record<string, SourceActivityAnchor[]>;
	staticAssets?: string[];
}

interface SourceActivityAnchor {
	title: string;
	prompt: string;
	evidence: string[];
}

const middleSchoolBWritingSourceAnchors: Record<
	string,
	SourceActivityAnchor[]
> = {
	"MSB1 Arguments & Evidence": [
		{
			title: "Steph Curry Argument Parts Model",
			prompt: "Use the Steph Curry example to separate a debatable claim, supporting reasons, and evidence. Then create argument records for the cell phones at school debate, TikTok dances as art, and the best pet comparison.",
			evidence: [
				"A debatable claim that can be reasonably opposed.",
				"Two reasons connected to the claim with because or by.",
				"Evidence that supports the reasons instead of repeating the claim."
			]
		}
	],
	"MSB2 Counterclaims": [
		{
			title: "Hypothetical Hannah Counterclaim Lab",
			prompt: "Practice counterclaims by pairing each claim with an opposing but still reasonable argument. Use conditional verbs and contrast transitions such as still or however so the opposing perspective is clearly marked.",
			evidence: [
				"One original claim with reasoning and evidence.",
				"One counterclaim with its own reasoning and evidence.",
				"Conditional or contrast language that signals the counterclaim without abandoning the original position."
			]
		}
	],
	"MSB3 Integrating Evidence": [
		{
			title: "Colon and Comma Quote Integration",
			prompt: "Integrate textual evidence in two ways: a complete sentence followed by a colon, and a short introductory phrase followed by a comma. Use the dog-versus-cat example as the model for punctuation and sentence flow.",
			evidence: [
				"One quote introduced by a complete sentence and colon.",
				"One quote introduced by a short phrase and comma.",
				"A note explaining why the punctuation matches the introductory wording."
			]
		}
	],
	"MSB4 Analyzing Evidence": [
		{
			title: "Car Ride Evidence Analysis Paragraph",
			prompt: "Use Car Ride to build an analytical paragraph: make a debatable inference about Kazim's mood, select textual evidence, integrate the evidence, then explain how and why the evidence supports the claim.",
			evidence: [
				"A claim about Kazim's mood or attitude.",
				"Integrated textual evidence from the passage.",
				"Analysis that connects the evidence to the claim rather than ending at the quote."
			]
		},
		{
			title: "Arguing for the Opposition",
			prompt: "Write from the opposing side of an argument by selecting evidence that could support a different interpretation. The goal is to make the alternative position credible before evaluating it.",
			evidence: [
				"An opposing claim that is debatable and plausible.",
				"Evidence chosen specifically for that opposing claim.",
				"Analysis explaining how the evidence supports the opposition."
			]
		}
	],
	"MSB5 Concluding Statements & Transitional Devices": [
		{
			title: "Conclusion and Transition Revision Pass",
			prompt: "Revise an argumentative paragraph by adding a concluding statement that restates the argument in fresh language and extends it with a related idea. Then add transitional devices that clarify addition, contrast, cause, example, or conclusion relationships.",
			evidence: [
				"A revised conclusion that is not a copy of the topic sentence.",
				"Transitions placed where relationships between ideas need to be clear.",
				"A short explanation of how each transition changes the paragraph's flow."
			]
		}
	],
	"MSB6 Color Coding & Revision": [
		{
			title: "Color-Coded Argument Revision",
			prompt: "Use color-coding to mark claim, reasoning, counterclaim, evidence, analysis, transitions, and conclusion in an argumentative paragraph. Revise any section that is missing, repetitive, unsupported, or out of order.",
			evidence: [
				"A color-coded paragraph or labeled outline.",
				"At least one revision based on the color pattern.",
				"A note naming which argument part improved and why."
			]
		},
		{
			title: "Opposition Paragraph Revision",
			prompt: "Apply the same color-coding and revision process to an opposition paragraph. The paragraph needs a credible opposing claim, support, and analysis rather than a weak straw-person version.",
			evidence: [
				"A labeled opposition paragraph.",
				"Evidence and analysis that make the opposition plausible.",
				"One revision that improves clarity or balance."
			]
		}
	],
	"MSB Check-In #1": [
		{
			title: "Analytical Writing Check-In Record",
			prompt: "Create an analytical writing record that demonstrates claim, reasoning, evidence integration, evidence analysis, counterclaim, transitions, conclusion, and revision. Keep the evidence record separate from self-assessment notes.",
			evidence: [
				"A complete argumentative paragraph or paragraph plan.",
				"Textual evidence integrated with correct punctuation.",
				"Revision evidence showing claim, support, analysis, and conclusion improvements."
			]
		}
	],
	"MSB7 Character Development": [
		{
			title: "Character Objective Bank",
			prompt: "Use Harry Potter, Wonder Woman, Spider-Man, and a favorite character to practice identifying character objectives. Then create an original objective bank that can support a new character.",
			evidence: [
				"Objective statements written as what each character wants most.",
				"Reasoning that connects background details to the objective.",
				"An original objective bank with several possible story-driving goals."
			]
		},
		{
			title: "Nemo Objective-to-Qualities Flowchart",
			prompt: "Use the Nemo chart model to connect objective, choices, thoughts, actions, speech, and character qualities. Then apply the same chain to an original character.",
			evidence: [
				"A flowchart from objective to choices, actions, speech, and qualities.",
				"At least one explanation of how a choice follows from the objective.",
				"Character qualities that are supported by the flowchart rather than assigned randomly."
			]
		}
	],
	"MSB8 Character Portraits": [
		{
			title: "Character Portrait Iceberg",
			prompt: "Build a character portrait using the iceberg model: the visible story shows only a small part of the character, while the full portrait records objective, backstory, motivations, habits, contradictions, and details below the surface.",
			evidence: [
				"A detailed character portrait with objective, backstory, choices, and speech patterns.",
				"A note distinguishing portrait details from details that belong directly in the story.",
				"One scene-ready detail that shows the character instead of explaining every background fact."
			]
		}
	],
	"MSB9 Generating Conflict & Structuring Plot": [
		{
			title: "Objective-to-Conflict Generator",
			prompt: "Start with a protagonist and objective, then create a major conflict that blocks the objective. Use a favorite book, movie, or show as a model before applying the same method to an original story.",
			evidence: [
				"A protagonist, objective, obstacle, and conflict statement.",
				"An explanation of how the obstacle blocks the objective.",
				"A comparison between the model story and the original story plan."
			]
		},
		{
			title: "Plot Curve Event Map",
			prompt: "Use the labeled plot curve and blank plot curve models to organize beginning, middle, and end events. The beginning introduces protagonist and objective, the middle develops conflict, and the end resolves the conflict.",
			evidence: [
				"Three or more plot events placed on a beginning-middle-end structure.",
				"One dramatic-tension note naming where investment is highest and why.",
				"A plot map for an original story or a familiar movie."
			]
		}
	],
	"MSB10 Manipulating Point of View": [
		{
			title: "Jonah and Caleb Point-of-View Rewrite",
			prompt: "Review first person, second person, third person objective, third person limited, and third person omniscient narration using the Jonah and Caleb examples. Then revise a scene to change reader access, sympathy, suspense, or humor.",
			evidence: [
				"Correct point-of-view labels with pronoun or narrator-access evidence.",
				"A rewritten scene from a different point of view.",
				"A note explaining how the changed point of view changes the reading experience."
			]
		}
	],
	"MSB11 Writing an Original Short Story": [
		{
			title: "Final Story Revision",
			prompt: "Revise the final short story so it includes a three-dimensional protagonist, plausible conflict, logical plot, clear point of view, theme development, figurative language, and showing rather than direct explanation.",
			evidence: [
				"A complete short story draft.",
				"Revision notes for protagonist, conflict, plot, point of view, theme, and figurative language.",
				"At least one before-and-after revision showing added depth or clearer craft choices."
			]
		}
	],
	"MSB Check-In #2": [
		{
			title: "Fiction Writing Check-In Record",
			prompt: "Create a fiction-writing record that demonstrates character objective, character portrait, conflict, plot structure, point of view, final story craft, theme, figurative language, and showing rather than direct explanation.",
			evidence: [
				"An original scene or story excerpt.",
				"Planning evidence for objective, portrait, conflict, plot, and point of view.",
				"Revision evidence for theme, figurative language, and showing."
			]
		}
	],
	"MSB12 Master Project": [
		{
			title: "Analytical Writing Presentation",
			prompt: "Create a presentation arguing why a chosen athlete, musician, restaurant, pet, food, or similar category choice is the best option. The presentation includes claim, reasoning, evidence, counterclaim, conclusion, and speaker notes.",
			evidence: [
				"A claim with reasoning and supporting evidence.",
				"A counterclaim with reasoning and supporting evidence.",
				"Presentation notes that move from topic introduction to claim, counterclaim, and conclusion."
			]
		},
		{
			title: "Fiction Writing Presentation",
			prompt: "Create a short fiction-writing lesson using the final story as evidence. The lesson defines fiction writing, explains why it matters, presents three core concepts, gives examples from the story, and ends with five practical writing tips.",
			evidence: [
				"A lesson outline with three fiction-writing concepts.",
				"Examples from the final story connected to each concept.",
				"Five writing tips and a closing reflection on the strongest part of the final story."
			]
		}
	]
};

const middleSchoolBWritingRetakeSourceAnchors = Object.fromEntries(
	Object.entries(middleSchoolBWritingSourceAnchors).map(
		([module, anchors]) => [
			module,
			anchors.map(anchor => ({
				...anchor,
				prompt: `Retake focus: revisit this skill with a fresh passage, draft, or presentation example before repeating the original source pattern. ${anchor.prompt}`,
				evidence: [
					...anchor.evidence,
					"A comparison note naming the skill that improved from the first course pass."
				]
			}))
		]
	)
) as Record<string, SourceActivityAnchor[]>;

const grammarMechanicsSourceAnchors: Record<string, SourceActivityAnchor[]> = {
	"MSC1 Nouns, Pronouns & Adjectives": [
		{
			title: "Snow Day Parts-of-Speech Sort",
			prompt: "Use the snow day paragraph to identify nouns, pronouns, and adjectives. The sort separates words by job, not by where they appear in the sentence.",
			evidence: [
				"Five nouns, five pronouns, and five adjectives from the passage.",
				"A one-sentence definition of each part of speech.",
				"One original sentence labeled for noun, pronoun, and adjective use."
			]
		},
		{
			title: "Pronoun Agreement Repair",
			prompt: "Map each pronoun to its antecedent, then revise any sentence with an inappropriate shift in number or person. The corrected version keeps singular antecedents with singular pronouns and plural antecedents with plural pronouns.",
			evidence: [
				"An antecedent-pronoun map for each sentence.",
				"Corrections for number shifts and person shifts.",
				"A note explaining why the corrected pronoun now agrees."
			]
		}
	],
	"MSC2 Verbs, Adverbs & Verbals": [
		{
			title: "Verb and Adverb Action Sort",
			prompt: "Identify action words and modifier words, then explain how each adverb changes the verb's meaning. The record distinguishes the action itself from details such as how, when, where, or to what degree the action happens.",
			evidence: [
				"A list of verbs from sample sentences.",
				"A matching list of adverbs and the verbs they modify.",
				"One revised sentence where changing the adverb changes the meaning."
			]
		},
		{
			title: "Gerund, Participle, and Infinitive Identification",
			prompt: "Classify verbals as gerunds, participles, or infinitives by checking the job they perform in the sentence. A gerund acts as a noun, a participle acts as an adjective, and an infinitive begins with to plus a verb.",
			evidence: [
				"At least three labeled verbals.",
				"The sentence job for each verbal.",
				"One original sentence using each verbal type."
			]
		}
	],
	"MSC3 Prepositions & Interjections": [
		{
			title: "Preposition Phrase and Interjection Sort",
			prompt: "Identify prepositions, the objects of prepositions, complete prepositional phrases, and interjections. The sort separates words that show relationships from words that express sudden feeling.",
			evidence: [
				"Three prepositional phrases with the preposition and object labeled.",
				"Two interjections with punctuation that fits the strength of feeling.",
				"One original sentence combining a prepositional phrase and an interjection."
			]
		}
	],
	"MSC4 Coordinating & Subordinating Conjunctions": [
		{
			title: "FANBOYS and Subordination Contrast",
			prompt: "Use FANBOYS to join equal ideas, then use subordinating conjunctions to make one idea dependent on another. The contrast shows the difference between coordination and dependency.",
			evidence: [
				"One compound sentence joined with a coordinating conjunction.",
				"One complex sentence using a subordinating conjunction.",
				"A note explaining which idea is independent and which idea depends on another."
			]
		},
		{
			title: "Conjunction and Comma Practice",
			prompt: "Revise sentences that use conjunctions and commas together. The finished examples show when a comma is needed before a coordinating conjunction and when a dependent clause needs a comma after it.",
			evidence: [
				"Two corrected coordinating-conjunction examples.",
				"Two corrected subordinating-conjunction examples.",
				"Rule labels explaining the comma choice."
			]
		}
	],
	"MSC Check-In #1": [
		{
			title: "Parts-of-Speech Concept Review",
			prompt: "Create a concept review for nouns, pronouns, adjectives, verbs, adverbs, verbals, prepositions, interjections, coordinating conjunctions, and subordinating conjunctions. Each definition is paired with an original example.",
			evidence: [
				"A definition and example for each reviewed term.",
				"At least one corrected sentence involving pronoun agreement.",
				"At least one sentence that uses a conjunction and comma correctly."
			]
		},
		{
			title: "Parts-of-Speech Application Passage",
			prompt: "Apply the parts-of-speech review to a short passage by labeling targeted words and revising any sentence-level issue that appears.",
			evidence: [
				"Labeled examples from a passage.",
				"One revision that improves agreement, clarity, or sentence joining.",
				"A short explanation of the rule used for the revision."
			]
		}
	],
	"MSC5 Capitalization": [
		{
			title: "Capitalization Repair Pass",
			prompt: "Repair capitalization for proper nouns, titles and headings, sentence starts, and the pronoun I. The revision separates rules for names and titles from rules for sentence boundaries.",
			evidence: [
				"Corrections for proper nouns and the pronoun I.",
				"Corrections for titles, headings, and sentence starts.",
				"Rule labels that explain each capitalization change."
			]
		}
	],
	"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks": [
		{
			title: "End-Mark and Quotation Repair",
			prompt: "Choose periods, question marks, exclamation points, and quotation marks based on sentence purpose and speaker words. Dialogue punctuation stays attached to the quoted material.",
			evidence: [
				"Three sentences with corrected end marks.",
				"Two dialogue examples with quotation marks and punctuation placed correctly.",
				"A note explaining how sentence purpose controlled the punctuation."
			]
		}
	],
	"MSC7 Phrases & Clauses I": [
		{
			title: "Phrase vs. Clause Independence Test",
			prompt: "Separate phrases from clauses by checking for a subject-verb pair and then testing whether the words can stand alone as a complete idea.",
			evidence: [
				"Three phrases labeled as missing a subject, verb, or complete thought.",
				"Three clauses labeled as independent or dependent.",
				"One dependent clause revised into a complete sentence."
			]
		},
		{
			title: "Dependent Clause Practice",
			prompt: "Use dependent clauses to add context without creating sentence fragments. Each example connects the dependent clause to an independent clause that can stand alone.",
			evidence: [
				"Two dependent clauses attached to independent clauses.",
				"One fragment repair.",
				"A comma decision explained for a dependent clause at the beginning or end."
			]
		}
	],
	"MSC8 Commas": [
		{
			title: "Comma Rule Diagnosis",
			prompt: "Diagnose comma use by naming the rule before adding punctuation. Practice commas in lists, introductory elements, direct address, interrupters, and joined clauses.",
			evidence: [
				"Five corrected sentences with rule labels.",
				"One sentence where a comma was removed because no rule supported it.",
				"A comparison between a pause in speech and a grammar-based comma."
			]
		},
		{
			title: "More Practice with Commas",
			prompt: "Use a mixed set of comma sentences to decide whether the sentence needs no comma, one comma, or a pair of commas.",
			evidence: [
				"A mixed correction set with rule labels.",
				"One sentence using a pair of commas around extra information.",
				"One explanation distinguishing necessary information from extra information."
			]
		}
	],
	"MSC9 Semicolons": [
		{
			title: "Semicolon Independent-Clause Join",
			prompt: "Use semicolons to join closely related independent clauses. Each side of the semicolon must be able to stand alone as a complete sentence.",
			evidence: [
				"Two semicolon joins between independent clauses.",
				"One correction where a semicolon was replaced because one side was not independent.",
				"A note explaining the relationship between the two joined clauses."
			]
		}
	],
	"MSC10 Colons": [
		{
			title: "Colon List, Explanation, and Quotation Starter",
			prompt: "Use colons after a complete sentence to introduce a list, explanation, or quoted material. The words before the colon must prepare the reader for what follows.",
			evidence: [
				"One colon introducing a list.",
				"One colon introducing an explanation or example.",
				"One correction where a colon was removed because the starter was incomplete."
			]
		}
	],
	"MSC11 Common Punctuation Errors": [
		{
			title: "Comma Splice and Run-On Repair",
			prompt: "Find comma splices and run-on sentences, then repair them with a period, semicolon, coordinating conjunction, or subordinating conjunction.",
			evidence: [
				"Two comma-splice repairs.",
				"Two run-on repairs.",
				"A note explaining why the chosen repair creates a complete sentence boundary."
			]
		},
		{
			title: "Coordinate vs. Cumulative Adjective Test",
			prompt: "Decide whether adjectives are coordinate or cumulative by testing whether and can fit between them and whether their order can change without changing the meaning.",
			evidence: [
				"Two coordinate-adjective examples with commas.",
				"Two cumulative-adjective examples without commas.",
				"One and-test or order-test explanation."
			]
		},
		{
			title: "Common Errors Passage Edit",
			prompt: "Edit a passage for comma splices, run-ons, adjective punctuation, capitalization after colons, and missing punctuation. The edit log names each error category rather than only marking the final answer.",
			evidence: [
				"A corrected passage.",
				"An error log grouped by rule.",
				"One revision that improves clarity beyond basic punctuation."
			]
		}
	],
	"MSC12 Pauses & Breaks": [
		{
			title: "Dashes, Parentheses, and Ellipses Meaning Check",
			prompt: "Compare dashes, parentheses, and ellipses as different kinds of interruptions or omissions. The choice depends on emphasis, side information, or trailing/incomplete thought.",
			evidence: [
				"One sentence using dashes for emphasis or interruption.",
				"One sentence using parentheses for side information.",
				"One sentence using an ellipsis for omission or trailing thought, with a note explaining the effect."
			]
		}
	],
	"MSC Check-In #2": [
		{
			title: "Punctuation Concept Review",
			prompt: "Review capitalization, end marks, quotation marks, phrases, clauses, commas, semicolons, colons, common punctuation errors, dashes, parentheses, and ellipses.",
			evidence: [
				"A definition or rule summary for each punctuation category.",
				"At least one corrected sentence for each major punctuation mark.",
				"One explanation of how punctuation changes meaning or sentence structure."
			]
		},
		{
			title: "Punctuation Application Passage",
			prompt: "Apply punctuation rules to a passage by correcting errors and labeling the reason for each change.",
			evidence: [
				"A corrected passage.",
				"Rule labels for capitalization, commas, semicolons, colons, quotation marks, or pause punctuation.",
				"One reflection naming the error type that was hardest to identify."
			]
		}
	],
	"MSC13 Subjects & Predicates": [
		{
			title: "Subject-Predicate Core Map",
			prompt: "Find the subject and predicate by identifying who or what the sentence is about and what that subject does or is. The core map removes extra phrases before labeling the sentence backbone.",
			evidence: [
				"Three complete subjects and complete predicates.",
				"Three simple subjects and simple predicates.",
				"One sentence with extra phrases removed to reveal the core."
			]
		}
	],
	"MSC14 Direct & Indirect Objects": [
		{
			title: "Direct and Indirect Object Sentence Diagram",
			prompt: "Diagram sentences by finding the verb, direct object, and indirect object. The direct object receives the action; the indirect object receives or benefits from the direct object.",
			evidence: [
				"Three sentences labeled for verb and direct object.",
				"Two sentences labeled for indirect object.",
				"One explanation using the questions what, whom, or to/for whom."
			]
		},
		{
			title: "Subjects, Predicates, and Objects Practice",
			prompt: "Combine subject-predicate work with object identification so each sentence has a clear structure map.",
			evidence: [
				"A structure map for three sentences.",
				"Labels for subject, predicate, direct object, and indirect object when present.",
				"One corrected incomplete sentence."
			]
		}
	],
	"MSC15 Phrases & Clauses II": [
		{
			title: "Phrase-and-Clause Sentence Expansion",
			prompt: "Expand sentences with phrases and clauses while keeping the sentence complete and punctuated correctly. The expansion adds detail without losing the main subject-predicate structure.",
			evidence: [
				"One sentence expanded with a phrase.",
				"One sentence expanded with a dependent clause.",
				"One revision note explaining how the added detail changes the sentence."
			]
		}
	],
	"MSC16 Sentence Types": [
		{
			title: "Sentence Type Identification and Rewrite",
			prompt: "Identify simple, compound, complex, and compound-complex sentences, then rewrite a basic idea in more than one sentence type.",
			evidence: [
				"Four labeled sentences, one for each sentence type.",
				"One idea rewritten as simple, compound, complex, and compound-complex.",
				"Clause labels showing why each sentence type is correct."
			]
		},
		{
			title: "More Practice with Sentence Types",
			prompt: "Use a mixed sentence set to classify sentence types, repair fragments or run-ons, and revise a paragraph so the sentence pattern varies on purpose instead of repeating the same structure.",
			evidence: [
				"A mixed classification set with clause labels.",
				"One repaired fragment or run-on sentence.",
				"A short paragraph revision that uses at least two different sentence types."
			]
		}
	],
	"MSC Check-In #3": [
		{
			title: "Sentence Structure Concept Review",
			prompt: "Review subjects, predicates, direct objects, indirect objects, phrases, clauses, and sentence types as connected sentence-structure tools.",
			evidence: [
				"A definition and example for each structure term.",
				"One complete sentence map.",
				"One sentence rewritten into a different sentence type."
			]
		},
		{
			title: "Sentence Structure Application Passage",
			prompt: "Apply sentence-structure tools to a short passage by identifying sentence parts and revising at least one sentence for structure variety.",
			evidence: [
				"Sentence-part labels for the passage.",
				"One revised sentence that changes type or structure.",
				"An explanation of how the revision affects clarity, rhythm, or emphasis."
			]
		}
	],
	"MSC17 Master Project": [
		{
			title: "Grammar and Mechanics Presentation",
			prompt: "Create a short grammar lesson using three selected concepts from the course. Each concept includes a definition, an example with visuals or labels, a 3-5 question practice exercise, and speaker notes.",
			evidence: [
				"Three selected concepts with definitions and examples.",
				"Practice questions with an answer key.",
				"Presentation notes that explain the rules in a logical sequence."
			]
		},
		{
			title: "Personal Narrative Mechanics Portfolio",
			prompt: "Write or revise a personal narrative that demonstrates grammar and mechanics control. The portfolio highlights capitalization, punctuation, sentence boundaries, sentence variety, and selected parts-of-speech choices.",
			evidence: [
				"A complete personal narrative draft or revision.",
				"An annotation record naming grammar and mechanics choices.",
				"Before-and-after revisions for at least three sentence-level improvements."
			]
		}
	]
};

const novelWritingSourceAnchors: Record<string, SourceActivityAnchor[]> = {
	"NW1 Course Overview & Goal Setting": [
		{
			title: "Novel Scope and Word-Count Plan",
			prompt: "Choose a novel-writing scope before drafting begins: a short story, a novella-length project, a longer novel excerpt, or a complete long-form draft. Convert the choice into a target word count, a weekly writing rhythm, and a completion definition. The plan also names the story idea, genre, likely audience, and the kind of ending that would make the project feel complete rather than simply stopped.",
			evidence: [
				"Selected project scope with a target word count and a reason the scope matches the available writing time.",
				"One-paragraph story premise that names the central character, central desire, likely obstacle, and possible ending direction.",
				"Drafting plan that divides the total word count into checkpoints and explains how progress will be measured across the course."
			]
		}
	],
	"NW2 Developing a Protagonist and an Antagonist": [
		{
			title: "Protagonist, Antagonist, and Objective Portraits",
			prompt: "Build character portraits for the protagonist and antagonist using character objective, motivation, strength, flaw, fear, and conflict pressure. A protagonist is not only the main character; the protagonist wants something badly enough to take action. An antagonist is not always a villain; the antagonist blocks, challenges, or complicates the protagonist's objective. The portraits explain why the two forces collide and what each character risks losing.",
			evidence: [
				"Profile for the protagonist naming objective, motivation, strength, flaw, fear, and first visible action.",
				"Profile for the antagonist naming objective, motivation, pressure on the protagonist, and at least one sympathetic or understandable trait.",
				"Conflict statement showing why both objectives cannot be fully satisfied at the same time."
			]
		}
	],
	"NW3 Novel Drafting: Introducing Your Characters": [
		{
			title: "Opening Scene Character Introduction",
			prompt: "Draft the opening section of the novel so the reader meets the main character through action, voice, and choice rather than a list of facts. The first pages establish what normal life looks like, what the protagonist cares about, and what tension is already present. The draft can introduce the antagonist directly, hint at the antagonist's influence, or show the problem that will eventually connect both characters.",
			evidence: [
				"Opening-scene draft or excerpt that introduces the protagonist in a concrete situation.",
				"Annotation identifying one action, one line of thought or dialogue, and one detail that reveals character.",
				"Revision note naming where the opening feels active and where it relies too much on summary."
			]
		}
	],
	"NW4 Generating Conflict": [
		{
			title: "Conflict Ladder",
			prompt: "Create a conflict ladder that starts with the protagonist's objective and then adds increasingly serious obstacles. Include at least one external obstacle, one interpersonal obstacle, and one internal obstacle. The ladder makes clear how conflict grows because of character choices, not random inconvenience. Each rung changes the protagonist's options, raises the cost of continuing, or reveals a weakness that makes the next scene harder.",
			evidence: [
				"Protagonist objective written as a clear want with a reason it matters.",
				"Three-to-five conflict rungs showing external, interpersonal, and internal complications.",
				"Short explanation of how one conflict rung causes or intensifies the next one."
			]
		}
	],
	"NW5 Novel Drafting: Setting the Scene": [
		{
			title: "Scene Placement and Atmosphere Draft",
			prompt: "Draft a scene that places the reader in a specific location before major action happens. Setting includes more than a named place; it includes time, sensory detail, mood, available objects, social rules, and limits on what characters can do. The scene uses setting to shape character behavior, create pressure, or reveal a contrast between what the protagonist wants and what the environment allows.",
			evidence: [
				"Scene draft with a clear physical location, time context, and at least three sensory details.",
				"Annotation explaining how one setting detail affects action, mood, or character decision-making.",
				"Revision note identifying one generic location detail that was replaced with a more specific detail."
			]
		}
	],
	"NW6 Structuring Plot": [
		{
			title: "Narrative Arc Map",
			prompt: "Map the novel on a narrative arc using exposition, rising action, conflict at greatest tension, falling action, and resolution. The arc is a planning tool, not a rigid formula. It helps reveal whether the story has enough escalation before the turning point and whether the ending answers the central conflict. The map can be revised as the draft changes, but each section needs a specific story event rather than a vague label.",
			evidence: [
				"Completed narrative arc with at least one concrete event in each section.",
				"Explanation of the event that creates the highest tension and why it changes the protagonist's path.",
				"Revision note naming one missing bridge between two plot points or one event that needs stronger cause and effect."
			]
		}
	],
	"NW7 Character Development": [
		{
			title: "Character Change and Rising Action Check",
			prompt: "Track how the protagonist changes across the rising action. Character development can appear through decisions, reactions under pressure, relationship changes, mistakes, and new self-knowledge. Choose two scenes already drafted or planned, then compare what the protagonist believes, fears, or attempts in each one. The comparison helps determine whether the character is growing, resisting growth, or becoming more complicated.",
			evidence: [
				"Before-and-after character snapshot using two drafted or planned scenes.",
				"Evidence from each scene showing a decision, reaction, or relationship shift.",
				"Revision target for one scene where the protagonist's change needs to become more visible through action or dialogue."
			]
		}
	],
	"NW8 Narration": [
		{
			title: "Point-of-View Consistency Audit",
			prompt: "Choose the story's point of view and audit a draft excerpt for consistency. First person, third-person limited, third-person omniscient, and other narration choices control what the reader can know, how close the reader feels to the character, and what information can stay hidden. The audit marks sentences that reveal thoughts, judgments, or information unavailable to the chosen narrator and revises them to match the intended point of view.",
			evidence: [
				"Selected point of view with a reason it fits the story's tension and character access.",
				"Annotated excerpt marking narration that fits and narration that breaks the chosen viewpoint.",
				"Revised passage that keeps knowledge, tone, and distance consistent."
			]
		}
	],
	"Check-In #1": [
		{
			title: "Midpoint Self-Assessment and Revision Plan",
			prompt: "Select a meaningful excerpt from the draft and evaluate it against the course skills covered so far: goal clarity, protagonist and antagonist design, character introduction, conflict generation, plot structure, character development, and narration. The response identifies one strength that is already working and one revision target that would improve the next draft. The revision plan is specific enough to change sentences, scene structure, or character choices.",
			evidence: [
				"Selected excerpt with a note explaining why it represents important current work.",
				"Self-assessment naming one strong skill and one developing skill from the first half of the course.",
				"Revision plan with concrete changes to character, conflict, plot, or narration and a short explanation of why those changes matter."
			]
		},
		{
			title: "Revised Excerpt Reflection",
			prompt: "Revise the selected excerpt using the midpoint plan, then compare the original and revised versions. The reflection explains what changed, what stayed the same, and how the revision affects the reader's understanding of character, conflict, or point of view. This turns revision into visible decision-making instead of simple proofreading.",
			evidence: [
				"Original excerpt and revised excerpt, or clearly labeled before-and-after sections.",
				"Three revision choices labeled by purpose, such as clarity, tension, character, pacing, or narration.",
				"Reflection explaining which revision had the greatest effect and what still needs another pass."
			]
		}
	],
	"NW9 Describing Setting": [
		{
			title: "Sensory Setting Expansion",
			prompt: "Choose a setting from the novel and expand it with sensory language connected to story purpose. Sight, sound, smell, touch, temperature, movement, and spatial detail can all help, but the strongest setting description does more than decorate the scene. It supports mood, reveals character attention, creates danger or comfort, and gives the reader information needed for the action.",
			evidence: [
				"Original setting paragraph or scene notes plus an expanded version.",
				"At least four sensory details, with each detail connected to mood, character, or plot usefulness.",
				"Revision note identifying one detail that was cut because it was vivid but not useful to the scene."
			]
		}
	],
	"NW10 Writing Dialogue": [
		{
			title: "Dialogue Formatting and Subtext Pass",
			prompt: "Write or revise a dialogue scene so each speaker has clear formatting, purposeful speech, and at least one layer of subtext. Dialogue can reveal information, create conflict, show relationships, and hide what a character is truly thinking. The pass checks paragraph breaks, quotation marks, speaker tags, action beats, and whether each line changes the scene in some way.",
			evidence: [
				"Dialogue excerpt with correct paragraphing, quotation marks, and speaker clarity.",
				"Annotation for one line that reveals direct information and one line that suggests subtext.",
				"Revision note replacing at least one filler line with speech or action that changes tension, relationship, or plot direction."
			]
		}
	],
	"NW11 Novel Drafting: Conflict": [
		{
			title: "Highest-Tension Conflict Draft",
			prompt: "Draft or revise the section where the central conflict reaches its strongest pressure. The scene needs a clear objective, a serious obstacle, and a consequence that cannot be ignored afterward. The protagonist may succeed, fail, compromise, or discover a new problem, but the outcome changes the path toward the ending. This section tests whether the conflict has grown from earlier character choices and plot events.",
			evidence: [
				"Conflict-scene draft or detailed scene plan with objective, obstacle, choice, and consequence labeled.",
				"Connection note explaining which earlier scene or decision made this conflict possible.",
				"Revision target for increasing stakes, clarifying the protagonist's choice, or strengthening the consequence."
			]
		}
	],
	"NW12 Novel Drafting: Falling Action & Resolution": [
		{
			title: "Ending Cause-and-Effect Chain",
			prompt: "Plan or draft the falling action and resolution as a cause-and-effect chain rather than a quick wrap-up. Falling action shows the consequences of the main conflict, and resolution shows what has changed by the end. The ending can be happy, sad, mixed, or open, but it needs to answer the central question created by the protagonist's objective and reveal what the journey cost or taught the character.",
			evidence: [
				"Cause-and-effect chain from the main conflict outcome to the final scene.",
				"Ending draft or outline that identifies what changed externally and internally.",
				"Revision note checking whether the ending answers the original objective, character arc, and main conflict."
			]
		}
	],
	"Check-In #2": [
		{
			title: "Final Revision Portfolio",
			prompt: "Build a final revision portfolio from a selected excerpt or completed draft section. The portfolio evaluates setting, dialogue, conflict, falling action, resolution, and earlier craft skills. It names the strongest current feature of the novel, identifies the highest-priority next revision, and explains how the draft has changed from the first course plan to the current version.",
			evidence: [
				"Selected excerpt or draft section with notes tied to setting, dialogue, conflict, and resolution.",
				"Self-assessment naming one polished craft strength and one high-impact revision priority.",
				"Revision summary explaining how the novel changed across planning, drafting, midpoint revision, and final revision."
			]
		},
		{
			title: "Publication Readiness Reflection",
			prompt: "Review the novel as a reader-facing project. The reflection checks whether the title, opening, character arc, conflict, ending, and formatting are ready for sharing. The publication readiness check does not mean the draft is perfect; it means the writer can explain what the story is, what revision work has already happened, and what the next realistic editing pass would address.",
			evidence: [
				"Reader-facing summary of the novel's premise, protagonist, conflict, and ending direction.",
				"Checklist covering title, opening clarity, character arc, conflict resolution, dialogue formatting, and remaining copyedits.",
				"Next-pass editing plan separating big-picture revision from sentence-level proofreading."
			]
		}
	]
};

function compactTopic(title: string) {
	return title
		.replace(/^[A-Z]{2,}\s*\d+[A-Z]?\s*/i, "")
		.replace(/^[A-Z]{2,}\d+[A-Z]?\s*/i, "")
		.replace(/^JoR\s+/i, "")
		.replace(/^WYB\s+/i, "")
		.replace(/^MS[A-C]\s+/i, "")
		.replace(/^NW\d+\s+/i, "")
		.replace(/^MYP\d+\s+/i, "")
		.replace(/^Check-in\s+#?(\d+)/i, "Check-In $1")
		.replace(/^Module Project:\s*/i, "")
		.replace(/\s+\(with [^)]+\)/gi, "")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function topicKeywords(topic: string) {
	const stopWords = new Set([
		"a",
		"an",
		"and",
		"for",
		"in",
		"my",
		"of",
		"on",
		"part",
		"the",
		"to",
		"with",
		"your"
	]);
	const words = topic
		.replace(/[#:&/(),]/g, " ")
		.split(/\s+/)
		.map(word => word.trim())
		.filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()));

	return [...new Set(words)].slice(0, 5);
}

function domainFrame(spec: SourceLibraryCourseSpec) {
	const domain = `${spec.area} ${spec.focus}`.toLowerCase();

	if (
		/math|addition|subtraction|fraction|decimal|geometry|algebra|calculus|number|measurement|coordinate/.test(
			domain
		)
	) {
		return {
			artifact:
				"worked math record with diagrams, equations, labels, and a reasonableness check",
			checks: [
				"Each number has a label or unit when context matters.",
				"The representation matches the operation or relationship being used.",
				"The final answer is checked with estimation, substitution, inverse operation, or a second representation."
			],
			process:
				"Translate the situation into a diagram, equation, table, or model before calculating. Keep intermediate steps visible so an arithmetic mistake can be found without restarting the whole problem.",
			transfer:
				"Change one number, unit, shape, graph feature, or condition and compare which parts of the solution method stay the same."
		};
	}

	if (
		/speaking|presentation|speech|toast|storyteller|radio|comedy/.test(
			domain
		)
	) {
		return {
			artifact:
				"speech outline with purpose, audience, structure, rehearsal notes, and delivery evidence",
			checks: [
				"The opening states the topic and gives the listener a reason to keep listening.",
				"Main points are ordered intentionally and supported by concrete details.",
				"Delivery notes address pacing, eye contact, gestures, vocal clarity, and revision after rehearsal."
			],
			process:
				"Separate message design from delivery practice. First define the audience, central point, and evidence. Then rehearse with a small number of specific delivery goals instead of trying to improve everything at once.",
			transfer:
				"Change the audience, time limit, tone, or speaking purpose and revise the outline so the same idea still lands clearly."
		};
	}

	if (
		/reading|literary|literature|figurative|analysis|grammar|writing|novel|story|book|narrative/.test(
			domain
		)
	) {
		return {
			artifact:
				"reading or writing record with claim, evidence, draft choices, revision notes, and final reflection",
			checks: [
				"Claims point to a specific sentence, passage detail, grammar rule, or draft choice.",
				"Explanations connect evidence to meaning instead of only quoting or naming a rule.",
				"Revision changes are visible and tied to clarity, structure, voice, audience, or mechanics."
			],
			process:
				"Start with the text or draft evidence, then explain the choice being made. For writing work, preserve at least one revision note so the final version shows how the idea improved.",
			transfer:
				"Apply the same reading, grammar, or writing move to a new passage, sentence, audience, scene, or draft section."
		};
	}

	if (
		/finance|invest|entrepreneur|business|credit|bank|portfolio|stock|income|spending/.test(
			domain
		)
	) {
		return {
			artifact:
				"decision record with assumptions, calculations, tradeoffs, risk notes, and a recommendation",
			checks: [
				"Financial assumptions are named before the calculation or decision.",
				"Benefits, costs, risks, and time horizon are compared rather than listed separately.",
				"The recommendation explains what evidence would change the decision."
			],
			process:
				"Treat each scenario as a decision under constraints. Identify the goal, the available options, the numbers or evidence, and the tradeoff before choosing a recommendation.",
			transfer:
				"Change the budget, customer, risk level, time horizon, or market condition and compare how the recommendation changes."
		};
	}

	if (
		/usaco|competitive|programming|scratch|visual programming|simulation/.test(
			domain
		)
	) {
		return {
			artifact:
				"problem-solving record with inputs, state, algorithm, test cases, and debugging notes",
			checks: [
				"The input or event model is written before coding or constructing the solution.",
				"The solution handles a normal case, a smallest case, and a case that stresses the key rule.",
				"Debugging notes identify the state change, loop, condition, or representation that controls the result."
			],
			process:
				"Name the data or event flow first. Then build the smallest working version, test it, and add only one rule or behavior at a time.",
			transfer:
				"Change a constraint, board state, input size, sprite behavior, or edge case and explain whether the same algorithm or event structure still works."
		};
	}

	return {
		artifact:
			"learning record with vocabulary, example, evidence, revision, and reflection",
		checks: [
			"The main terms are defined with examples and non-examples.",
			"The response includes evidence rather than only a final answer.",
			"The final note explains what changed, what stayed stable, and what still needs verification."
		],
		process:
			"Break the task into setup, evidence, result, and explanation. Keep each part visible so the reasoning can be checked without relying on hidden context.",
		transfer:
			"Change one condition and compare the new result to the original result."
	};
}

function conceptContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const keywords = topicKeywords(topic);
	const frame = domainFrame(spec);

	return `
**Concept path:** ${topic} is the central focus for this part of ${spec.name}. It connects to ${spec.focus}. The module record is a ${frame.artifact}, not just a completed answer.

Core topics in this module:

1. **Vocabulary and model**  
   Define the important terms in plain language, connect them to a simple example, and include one non-example so the boundary of the idea is clear.${keywords.length ? ` Key terms to watch include ${keywords.join(", ")}.` : ""}

2. **Worked example**  
   Break a typical problem, passage, speech outline, business case, or number scenario into smaller pieces. The record includes the known information, the decision point, and the evidence that supports the answer.

3. **Transfer task**  
   Change one detail from the worked example. The comparison makes the transferable rule visible instead of treating the first example as a script to copy.

4. **Evidence check**
   ${frame.process}

**Evidence checklist:**

${frame.checks.map(check => `- ${check}`).join("\n")}
	`.trim();
}

function practiceContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const frame = domainFrame(spec);
	const planning = buildSupportSectionGuidance({
		courseFamily: spec.name,
		moduleTitle: topic,
		section: "planning"
	});

	return [
		`**Goal:** Create a short ${spec.name} practice record for ${topic} with one typical case and one changed case.`,
		`**Setup:** Name the goal, the starting information, and the form of evidence needed. The expected product is a ${frame.artifact}.`,
		[
			"**Process:**",
			"1. Record the givens, constraints, audience, source text, numbers, or starting state.",
			"2. Build the first solution or draft with visible intermediate reasoning.",
			"3. Run a second case with one changed detail and compare the result.",
			"4. Write a short explanation of which rule, model, or evidence controlled the final answer."
		].join("\n"),
		[
			"**Completion evidence:**",
			...frame.checks.map(check => `- ${check}`)
		].join("\n"),
		planning
	].join("\n\n");
}

function extensionContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const frame = domainFrame(spec);
	const verification = buildSupportSectionGuidance({
		courseFamily: spec.name,
		moduleTitle: topic,
		section: "verification"
	});

	return [
		`**Goal:** Extend ${topic} in ${spec.name} by changing one constraint, audience, number set, passage detail, scenario, or design choice.`,
		`**Transfer move:** ${frame.transfer}`,
		[
			"**Extension choices:**",
			"1. Add a more difficult input, passage detail, model constraint, or audience requirement.",
			"2. Compare two solution methods, drafts, explanations, or recommendations and name the better fit for the goal.",
			"3. Turn the final answer into a short presentation, annotated example, table, diagram, or revision note.",
			"4. Add one reflection explaining what evidence would make the result more reliable."
		].join("\n"),
		"The extension keeps the original idea recognizable while testing whether the method still works under a new condition. The response includes the changed condition, the expected effect, the actual result, and one revision that would make the explanation or product stronger.",
		verification
	].join("\n\n");
}

function createSourceActivityAnchorItems(
	spec: SourceLibraryCourseSpec,
	moduleTitle: string
) {
	const anchors = spec.sourceActivityAnchors?.[moduleTitle];
	if (!anchors?.length) return [];

	const topic = compactTopic(moduleTitle);

	return [
		{
			title: `Source Activity Anchors: ${topic}`,
			content: [
				"The original source course used the concrete activity anchors below. This neutral version keeps the scenario structure, decision practice, and evidence requirements while removing platform-specific submission steps.",
				...anchors.map((anchor, index) =>
					[
						`${index + 1}. **${anchor.title}**`,
						anchor.prompt,
						"Evidence record:",
						...anchor.evidence.map(item => `- ${item}`)
					].join("\n")
				)
			].join("\n\n")
		}
	];
}

function createSourceLibraryModule(
	spec: SourceLibraryCourseSpec,
	moduleTitle: string
): RawCourseModule {
	const topic = compactTopic(moduleTitle);

	return {
		title: moduleTitle,
		curriculum: [
			{
				title: `Concepts: ${topic}`,
				content: conceptContent(spec, moduleTitle)
			},
			...createSourceActivityAnchorItems(spec, moduleTitle)
		],
		supplementalProjects: [
			{
				title: `Practice Map: ${topic}`,
				content: practiceContent(spec, moduleTitle)
			},
			{
				title: `Extension Review: ${topic}`,
				content: extensionContent(spec, moduleTitle)
			}
		]
	};
}

function createStaticAssetAppendix(
	courseName: string,
	staticAssets: string[] | undefined
) {
	if (!staticAssets?.length) return [];

	const uniqueAssets = [...new Set(staticAssets)].sort((left, right) =>
		left.localeCompare(right)
	);

	return [
		{
			kind: "appendix" as const,
			title: "Pending Static Assets",
			curriculum: [
				{
					title: "Static Asset Placeholders",
					content: [
						`${courseName} has placeholders for the static assets below. Each URL points to the class static host and can be filled when the matching file is available.`,
						...uniqueAssets.map(
							filename =>
								`- ${staticMediaUrl(filename)}\n\n${pendingStaticMediaNotice(filename)}`
						)
					].join("\n\n")
				}
			],
			supplementalProjects: []
		}
	];
}

function createSourceLibraryCourse(spec: SourceLibraryCourseSpec): RawCourse {
	return {
		name: spec.name,
		modules: [
			...spec.modules.map(moduleTitle =>
				createSourceLibraryModule(spec, moduleTitle)
			),
			...createStaticAssetAppendix(spec.name, spec.staticAssets)
		]
	};
}

const investingCourses = {
	smartMoney: createSourceLibraryCourse({
		name: "Smart Money: Introduction to Personal Finance",
		area: "personal finance",
		focus: "income growth, spending plans, banking, credit, purchasing decisions, investing basics, and long-term financial tradeoffs",
		sourceActivityAnchors: {
			"PF1 Building Wealth Through Personal Finance": [
				{
					title: "Spend Like Bill Gates Constraint Ladder",
					prompt: "Use the spending simulator at [neal.fun/spend](https://neal.fun/spend/) as a changing-constraint case study. Compare an unlimited receipt, a responsible-use receipt, and a $500,000 plan spread across 60 years.",
					evidence: [
						"List of purchases that stayed, changed, or disappeared as the constraint became stricter.",
						"Five to seven personal values or future commitments that affect the revised spending plan.",
						"One explanation of how long-term goals change a short-term purchase decision."
					]
				},
				{
					title: "Graduate Profile and First-Month Budget",
					prompt: "Build a fictional post-graduation profile with fixed starting assumptions: $10,000 in savings, an old scooter, and $30,000 in student debt. Choose a city, starting salary, housing cost, and first-month expense plan.",
					evidence: [
						"Profile table with income, debt, savings, location, and housing assumptions.",
						"First-month Budget Planner and Expense Tracker with income, necessities, wants, debt payments, and remaining cash.",
						"Revision note explaining which profile assumption changed after the first budget pass."
					]
				},
				{
					title: "Wealth-Building Research and Financial Perspectives",
					prompt: "Research one wealthy person or interview one to three trusted adults about financial habits. Compare income sources, assets, lifestyle choices, weekly or monthly money routines, and long-term goals.",
					evidence: [
						"Research or interview notes with source names, dates, and the specific financial behaviors observed.",
						"Comparison table separating income, assets, spending habits, saving habits, and risk tolerance.",
						"Reflection connecting at least one outside perspective to the Graduate Profile decisions."
					]
				}
			],
			"PF2 How to Grow My Income": [
				{
					title: "Income Streams Comparison",
					prompt: "Compare different ways to make money, including salary growth, content revenue, part-time work, freelancing, entrepreneurship, and investing. Focus on time requirements, startup costs, skill requirements, reliability, and risk.",
					evidence: [
						"Pros and cons table for two income options beyond the main job.",
						"Skill and time estimate for each option, including one hidden cost or limitation.",
						"Decision note naming which option fits the profile and which option is too risky or impractical."
					]
				},
				{
					title: "Salary Negotiation Case",
					prompt: "Create a mock salary-increase request from the employee and employer perspectives. The case includes three to five reasons the raise could make sense and two risks or objections from the employer side.",
					evidence: [
						"Raise request with value created, evidence of performance, and proposed new salary or raise range.",
						"Employer objection list with calm responses tied to business value.",
						"Updated income tracker showing the effect of a successful, partial, or unsuccessful negotiation."
					]
				},
				{
					title: "Wild Card Ledger",
					prompt: "Track unexpected income or expense events as flat, per-month, or multi-month changes. Each event modifies the same financial profile rather than creating a separate disconnected example.",
					evidence: [
						"Ledger row with event name, amount, duration, affected month, and category.",
						"Before-and-after monthly cash comparison.",
						"Short note explaining whether the event changes the long-term recommendation."
					]
				}
			],
			"PF3 How to Manage My Spending": [
				{
					title: "Spending Style and Needs-versus-Wants Budget",
					prompt: "Use a spending-style quiz, the Bean Game, or a fictional spending scenario to separate needs, wants, savings, and debt. Translate the result into a 50/30/20 or custom budget rule.",
					evidence: [
						"Needs-versus-wants criteria written as questions that can be reused for future purchases.",
						"Budget allocation with necessities, wants, savings, and debt categories.",
						"One tradeoff case where the budget blocks a purchase that still seems desirable."
					]
				},
				{
					title: "Profile Budget Revision",
					prompt: "Use a salary estimate, income-tax calculator, and budget calculator to revise the Graduate Profile. Include yearly and monthly views so the budget can be checked at both scales.",
					evidence: [
						"Gross income, estimated taxes, net income, and monthly take-home pay.",
						"Five necessities, five wants, and three debts with yearly or monthly cost estimates.",
						"Revised expense tracker with leftover monthly cash and one possible savings decision."
					]
				}
			],
			"PF4 How to Build Credit: Making Your Small Purchases Count": [
				{
					title: "Debt Growth and Credit Card Simulation",
					prompt: "Use a debt-growth game, credit-card simulator, or calculator to connect borrowing choices with APR, repayment time, credit limit, fees, and total paid over time.",
					evidence: [
						"Definition set for credit card, APR, introductory APR, minimum payment, credit limit, and unpaid balance.",
						"Comparison of two borrowing scenarios with different interest rates or repayment behavior.",
						"Debt-management rule that would reduce risk in the Graduate Profile."
					]
				},
				{
					title: "Credit Card Selection Case",
					prompt: "Compare fictional card offers such as cash rewards, travel rewards, low APR, and high-reward/high-fee cards. Match card features to the profile holder's spending habits and debt risk.",
					evidence: [
						"Card comparison table with APR, fees, rewards, credit limit, and hidden risk.",
						"Chosen card or cards with a reason tied to the profile rather than the largest reward headline.",
						"Rejected-card note explaining who the card might fit better."
					]
				},
				{
					title: "Car Loan and Housing What-If",
					prompt: "Use loan and housing calculators to test how credit score, interest rate, down payment, rent, and purchase price change monthly obligations.",
					evidence: [
						"Two loan outcomes with the same principal and different rates or credit assumptions.",
						"Buy-versus-rent note that separates lifestyle preference from financial feasibility.",
						"Profile update showing whether the monthly payment fits the existing budget."
					]
				}
			],
			"PF5 How to Make Smart Purchase Decisions": [
				{
					title: "Long-Run Purchase Value",
					prompt: "Compare short-term cheap purchases with longer-lasting alternatives. Examples include toothbrushes, home drinks versus daily takeout, reusable dishware, groceries, furniture, and vehicle choices.",
					evidence: [
						"Cost-over-time comparison with purchase price, replacement frequency, and total cost.",
						"Quality or convenience factor that cannot be captured by price alone.",
						"Recommendation explaining when the cheaper option is actually more expensive."
					]
				},
				{
					title: "Vehicle Purchase Decision",
					prompt: "Research a new or used four-wheeled vehicle, estimate financing terms, add insurance and maintenance, and decide whether the purchase belongs in the profile budget.",
					evidence: [
						"Vehicle comparison with purchase price, down payment, loan term, monthly payment, and total interest.",
						"Recurring-cost estimate for insurance, maintenance, fuel or charging, and registration.",
						"Expense-tracker update showing the effect of fixed and variable vehicle costs."
					]
				}
			],
			"PF6 How To Find Your Perfect Bank": [
				{
					title: "Checking-versus-Savings Allocation",
					prompt: "Use a $5,000 prize scenario to decide how much belongs in checking, savings, or another account. Compare access, safety, interest, fees, minimum balances, and purpose.",
					evidence: [
						"Account allocation table matching common expenses to checking or savings.",
						"One-year interest estimate for the savings portion using a compound-interest calculator.",
						"Bank comparison with fees, interest rate, minimum balance, access, and account purpose."
					]
				},
				{
					title: "Savings Account Offer Case",
					prompt: "Compare fictional bank and credit-union offers with opening bonuses, minimum balances, monthly fees, interest rates, and loan eligibility. Choose one or more accounts for the Graduate Profile.",
					evidence: [
						"Offer table with immediate bonus, interest rate, minimum balance, fees, and restrictions.",
						"Cash-flow check showing whether the profile can maintain the required minimum balance.",
						"Recommendation naming the account choice and the evidence that would change the choice."
					]
				}
			],
			"PF7 How to Plan for and Invest in Your Future": [
				{
					title: "Retirement Savings Calculator",
					prompt: "Estimate an ideal retirement age, monthly living costs, health costs, discretionary spending, and savings rate. Compare conservative and aggressive assumptions with an investment calculator.",
					evidence: [
						"Monthly necessity, discretionary, and health-cost estimates for the target retirement location.",
						"Calculator outputs for required savings and monthly contribution.",
						"Comparison of conservative and aggressive assumptions with the risk tradeoff named clearly."
					]
				},
				{
					title: "Investment Account Allocation",
					prompt: "Compare retirement account types such as Roth IRA and 401k, then allocate monthly savings between retirement accounts, self-directed investments, and bank savings.",
					evidence: [
						"Allocation table with account type, monthly contribution, tax treatment, access constraints, and risk level.",
						"One explanation of why early access, taxes, employer match, or risk changes the recommendation.",
						"Retirement-plan diagram or written summary tied back to the Graduate Profile."
					]
				}
			],
			"PF8 Making Your Money Count": [
				{
					title: "Ethical Spending and Investing",
					prompt: "Research companies, charities, products, or funds connected to environmental or social goals. Separate marketing claims from evidence such as product materials, labor practices, charity ratings, and measurable impact.",
					evidence: [
						"Cause list with direct donation, spending-choice, investment, and non-financial support options.",
						"Evidence comparison of two or more companies, charities, or products.",
						"Budget update showing how much money, time, or attention the cause receives."
					]
				},
				{
					title: "Cause-Aligned Business or Awareness Project",
					prompt: "Design a product, service, post, proposal, or awareness campaign that supports a cause while accounting for production costs, waste, community effect, and revenue or donation assumptions.",
					evidence: [
						"Mission statement with the cause, audience, and concrete action.",
						"Budget or operations note naming expected costs, benefits, and possible unintended harm.",
						"Revision note explaining how the idea becomes more financially realistic or socially responsible."
					]
				}
			],
			"PF9 Smart Money Master Project": [
				{
					title: "Financial Journey Portfolio",
					prompt: "Create a final portfolio that traces the Graduate Profile from the initial goals through income, spending, debt, credit, banking, purchases, retirement planning, and values-based money choices.",
					evidence: [
						"Timeline of major decisions, including income changes, budget changes, wild cards, debts, and savings milestones.",
						"Final balance sheet with savings, debt, monthly cash flow, retirement plan, and chosen accounts.",
						"Reflection naming the best decision, weakest decision, and one profile assumption that would change with better evidence."
					]
				},
				{
					title: "Next-Year Outlook",
					prompt: "Project the profile one year forward using the current budget, remaining debt, expected savings, recurring wild cards, and retirement contribution plan.",
					evidence: [
						"Projected monthly or annual table with income, required expenses, discretionary spending, savings, and debt.",
						"Risk note for one or more emergency, job change, market change, or unexpected expense cases.",
						"Final recommendation for the next financial move and the evidence that supports it."
					]
				}
			]
		},
		staticAssets: [
			"ent3_project2_0.png",
			"ent3_project2_1.png",
			"pf5_concept1_1.png",
			"pf5_concept1_2.png",
			"pf5_concept1_3.png",
			"pf5_concept1_4.png",
			"pf5_concept1_5.png",
			"pf5_concept1_6.png"
		],
		modules: [
			"PF1 Building Wealth Through Personal Finance",
			"PF2 How to Grow My Income",
			"PF3 How to Manage My Spending",
			"PF4 How to Build Credit: Making Your Small Purchases Count",
			"PF5 How to Make Smart Purchase Decisions",
			"PF6 How To Find Your Perfect Bank",
			"PF7 How to Plan for and Invest in Your Future",
			"PF8 Making Your Money Count",
			"PF9 Smart Money Master Project"
		]
	}),
	moneyMinded: createSourceLibraryCourse({
		name: "Money-Minded: Investing in the Stock Market",
		area: "investing",
		focus: "stock selection, compounding returns, risk, bonds, ETFs, diversification, company analysis, ethical investing, shorting, and cryptocurrency context",
		sourceActivityAnchors: {
			"INV 1 Picking My First Stock": [
				{
					title: "Public Company and Stock Market Tour",
					prompt: "Use [Investopedia](https://www.investopedia.com/) to inspect Apple (AAPL), then compare Apple with another familiar company. Separate what makes a company popular from what makes it publicly traded, investable, and risky.",
					evidence: [
						"Definitions for stock market, public company, stock, investor benefit, and investor risk.",
						"Apple (AAPL) observation notes naming business strength, popularity, and one possible weakness.",
						"Pros-and-cons comparison of public markets from the company perspective and investor perspective."
					]
				},
				{
					title: "First Simulated Portfolio Entry",
					prompt: "Create a simulated portfolio plan using an imaginary $100,000 starting balance. Choose a first stock, explain the purchase rationale, then identify two additional companies to research next.",
					evidence: [
						"First stock selection with ticker, estimated share count, allocation, and purchase rationale.",
						"Expectation note naming what would count as a successful result and what evidence would cause a sell or hold decision.",
						"Watchlist of three to five companies with one reason each company is worth researching."
					]
				}
			],
			"INV 2 Strategically Choosing My Stocks": [
				{
					title: "Time-the-Market Comparison",
					prompt: "Use the Quartz time-the-market activity at [data.qz.com/2015/time-the-market](https://data.qz.com/2015/time-the-market/) to compare one buy-and-sell attempt with a hold-through-the-period strategy.",
					evidence: [
						"Two outcomes: active timing result and hold-only result.",
						"Explanation of beat the market, index, bull market, bear market, crash, and long-term trend.",
						"Strategy note explaining why short-term timing is difficult even when long-term market trends are visible."
					]
				},
				{
					title: "Index and Portfolio Strategy Check",
					prompt: "Compare the S&P 500, Dow Jones, and Nasdaq over a one-year window, then decide whether current conditions look more bullish or bearish. Use that decision to refine a simulated stock list.",
					evidence: [
						"Index comparison with S&P 500, Dow Jones, and Nasdaq notes.",
						"Trade plan for three to five stocks with share counts, estimated cost, and portfolio percentage.",
						"Reflection comparing individual stock performance with an index such as S&P 500, DJI, or QQQ."
					]
				}
			],
			"INV 3 Understanding Compounding Returns": [
				{
					title: "Compounding and Inflation Scenarios",
					prompt: "Compare a $100 birthday gift kept in a piggy bank, placed in savings at 2%, and invested with a 10% average return. Extend the comparison to 1, 5, and 10 years, then account for 2% inflation.",
					evidence: [
						"Table comparing piggy bank, savings, and investing outcomes after 1, 5, and 10 years.",
						"Inflation-adjusted note explaining buying power rather than only nominal dollars.",
						"Comparison of early investing and late investing using the age 25 versus age 35 scenarios from the source course."
					]
				},
				{
					title: "Rule of 72 Portfolio Projection",
					prompt: "For each simulated stock, estimate one-year return with `(current value - value one year ago) / value one year ago * 100`, then use the Rule of 72 to estimate doubling time.",
					evidence: [
						"One-year return calculation for at least two stocks.",
						"Rule of 72 doubling-time estimate for each calculated return.",
						"Portfolio revision note explaining whether a 10% average return seems realistic for the chosen stocks."
					]
				}
			],
			"INV 4 Assessing My Portfolio's Risk": [
				{
					title: "Dice Risk Ledger",
					prompt: "Model risk with a five-round dice game that starts at $20, costs $1 per round, and changes reward or loss based on how many guesses are allowed.",
					evidence: [
						"Five-round ledger with guesses allowed, result, money won or lost, and ending balance.",
						"Risk-reward explanation using the source table: 6 guesses has low reward and low loss, while 1 guess has high reward and high loss.",
						"Pressure and strategy note connecting the game to portfolio risk tolerance."
					]
				},
				{
					title: "Sharpe Ratio Portfolio Review",
					prompt: "Calculate a portfolio risk review using stock returns, a risk-free comparison, and the Sharpe Ratio. Treat the ratio as one tool, not a complete investing decision.",
					evidence: [
						"List of stock percentage returns used in the Sharpe Ratio review.",
						"Definition of investment portfolio, risk-free investment, return, volatility, and Sharpe Ratio.",
						"Portfolio adjustment note explaining how the risk analysis changes or confirms the strategy."
					]
				}
			],
			"INV 5 Investing in Bonds and ETFs": [
				{
					title: "Build Your Stax Diversification Review",
					prompt: "Use [Build Your Stax](https://buildyourstax.com/) as a diversification case study. Compare stocks with CDs, mutual funds, index funds, ETFs, and bond-like investments.",
					evidence: [
						"Investment-type comparison naming risk, return potential, liquidity, and diversification role.",
						"Explanation of how diversification changes total portfolio risk.",
						"Game result reflection identifying one decision that reduced risk and one decision that limited returns."
					]
				},
				{
					title: "ETF and Bond Fund Allocation",
					prompt: "Allocate part of the imaginary $100,000 portfolio to ETFs and bond funds. Consider index ETFs such as SPY, QQQ, and DIA, thematic ETFs such as BOTZ, and one to three bond funds.",
					evidence: [
						"Allocation percentage for ETFs and bond funds with a reason tied to portfolio risk.",
						"ETF table with ticker, category, expected role, and short-term or long-term purpose.",
						"Bond fund table with ticker or fund name, expected role, and return expectation."
					]
				}
			],
			"INV 6 Diversifying My Stock Portfolio": [
				{
					title: "Stock Category and Sector Rotation Map",
					prompt: "Classify stocks as cyclical, defensive, growth, blue-chip, or IPO, then connect those categories to sector rotation and the current stage of the economic cycle.",
					evidence: [
						"Definitions and examples for cyclical, defensive, growth, blue-chip, and IPO stocks.",
						"Sector rotation map explaining which categories may perform better in different economic conditions.",
						"Current-cycle note explaining which stock categories appear better aligned with the market environment."
					]
				},
				{
					title: "Category-Based Portfolio Diversification",
					prompt: "Choose stocks from multiple categories and industries, then compare their historical performance with the role they serve in the simulated portfolio.",
					evidence: [
						"At least two researched stock options in each chosen category.",
						"Purchase or watchlist table naming ticker, category, industry, reason for selection, and risk.",
						"Diversification explanation that goes beyond owning several similar stocks."
					]
				}
			],
			"INV 7 Assessing a Company's Success": [
				{
					title: "Financial Statement and P/E Ratio Review",
					prompt: "Use Tesla's public financial statements as a model for reading revenue, expenses, net income, and P/E ratio. Compare Tesla with GM to separate company performance from market valuation.",
					evidence: [
						"Definitions for revenue, expenses, net income, income statement, and P/E ratio.",
						"Tesla trend notes for revenue and net income over multiple reporting periods.",
						"Tesla-versus-GM comparison explaining why a higher valuation may or may not be justified."
					]
				},
				{
					title: "Undervalued Stock Candidate Review",
					prompt: "Find one or two stocks that may be undervalued, review their income statements, calculate or look up their P/E ratios, and decide whether they belong in the simulated portfolio.",
					evidence: [
						"Candidate table with ticker, industry, revenue trend, net income trend, and P/E ratio.",
						"Undervalued thesis explaining the evidence and the uncertainty.",
						"Portfolio change note naming any additions, removals, or holds caused by the analysis."
					]
				},
				{
					title: "Private Company Ranking Case",
					prompt: "Use [Republic.co](https://republic.co/) as a private-company research case. Rank three startup opportunities using differentiation, team, business/product evaluation, mission and impact, and one additional criterion.",
					evidence: [
						"Top-three ranking with evidence for differentiation, team, product value, and mission or impact.",
						"Additional criteria list informed by startup failure patterns such as market need, business model, competition, or execution risk.",
						"Final recommendation explaining why the top-ranked company is stronger than the runner-up."
					]
				}
			],
			"INV 8 Holding Companies Socially Responsible": [
				{
					title: "ESG Criteria and Reliability Review",
					prompt: "Study environmental, social, and governance criteria, then compare sample ESG score evidence for companies such as Alphabet, Disney, and PepsiCo.",
					evidence: [
						"Definitions for environmental, social, governance, ESG score, and socially responsible investing.",
						"Priority list naming two or three criteria that matter most for an investing decision.",
						"Reliability note explaining why ESG scores are useful but incomplete."
					]
				},
				{
					title: "Values-Aligned Portfolio Update",
					prompt: "Research companies whose practices align with priorities such as environmental responsibility, worker treatment, or community impact. Examples from the source include PLUG, FCEL, CRM, and ABNB.",
					evidence: [
						"Research notes for two or three companies with cited evidence of positive or negative practices.",
						"Estimated ESG or values-alignment score with a clear reason.",
						"Portfolio update explaining which shares are added, kept, or replaced because of the values screen."
					]
				}
			],
			"INV 9 Shorting Stocks": [
				{
					title: "Short Selling and Short Squeeze Case",
					prompt: "Use the Jordans resale analogy to explain short selling, then analyze a short squeeze case such as GameStop. Separate potential profit from unlimited-loss risk.",
					evidence: [
						"Short-selling explanation with borrow, sell, price drop, buy back, and return steps.",
						"Loss scenario showing what happens when the price rises instead of falls.",
						"Short squeeze summary naming the mechanism, recent example, and risk lesson."
					]
				},
				{
					title: "Overvalued Company Short Plan",
					prompt: "Find one to three companies that may be overvalued, use financial metrics or a research source such as Chartmill, and create a short-position plan with an exit rule.",
					evidence: [
						"Candidate table with overvaluation evidence and uncertainty.",
						"Short-position plan naming share count, entry rationale, risk cap, and buy-to-cover exit condition.",
						"Portfolio risk note explaining why each candidate is or is not appropriate for shorting."
					]
				}
			],
			"INV 10 Understanding the Value of Cryptocurrency": [
				{
					title: "Cryptocurrency Value Comparison",
					prompt: "Define cryptocurrency, compare how fiat money and cryptocurrencies gain value, and inspect popular coins through a price list such as Coinbase's public price directory.",
					evidence: [
						"Definition of cryptocurrency, blockchain-based transfer, fiat currency, and market capitalization.",
						"Comparison of Bitcoin, Ethereum, and Dogecoin by purpose, market capitalization, and coin issuance.",
						"Advantages-and-disadvantages list covering volatility, access, decentralization, speculation, and practical use."
					]
				},
				{
					title: "Bitcoin Historical Return Case",
					prompt: "Use a Bitcoin historical price chart such as [Coindesk's Bitcoin price page](https://www.coindesk.com/price/bitcoin) to compare buying near the 2018 peak, after the 2018 crash, and near the original low-price period.",
					evidence: [
						"Price comparison for a 2018 peak purchase, a post-crash purchase, and a 2010-style early-price scenario.",
						"Percentage gain or loss calculation for at least one scenario.",
						"Investment thesis explaining whether cryptocurrency fits the portfolio and what risk evidence limits the conclusion."
					]
				}
			],
			"INV 11 Money-Minded Master Project": [
				{
					title: "Investment Strategy Pitch",
					prompt: "Create a final pitch for a hypothetical brokerage-account funding request. The pitch explains what the money will be invested in, how the portfolio is diversified, and how the strategy handles risk, growth, ethics, and possible cryptocurrency exposure.",
					evidence: [
						"Portfolio allocation with stocks, ETFs, bond funds, possible cryptocurrency, and cash or reserve assumptions.",
						"Growth projection with expected return, time horizon, risk level, and evidence that could change the plan.",
						"Implementation plan naming brokerage or app choice, profit-sharing or accountability rules, and responsible-use constraints."
					]
				},
				{
					title: "Private Company Re-Evaluation",
					prompt: "Return to the Republic.co private-company ranking case and decide whether the original top-three choices still hold up when new opportunities or better criteria are available.",
					evidence: [
						"Updated top-three ranking with old and new company comparisons.",
						"Criteria audit explaining which research criteria changed after completing the course.",
						"Final decision note explaining whether the original ranking is confirmed or revised."
					]
				}
			]
		},
		staticAssets: ["inv3_0.png"],
		modules: [
			"INV 1 Picking My First Stock",
			"INV 2 Strategically Choosing My Stocks",
			"INV 3 Understanding Compounding Returns",
			"INV 4 Assessing My Portfolio's Risk",
			"INV 5 Investing in Bonds and ETFs",
			"INV 6 Diversifying My Stock Portfolio",
			"INV 7 Assessing a Company's Success",
			"INV 8 Holding Companies Socially Responsible",
			"INV 9 Shorting Stocks",
			"INV 10 Understanding the Value of Cryptocurrency",
			"INV 11 Money-Minded Master Project"
		]
	}),
	entrepreneurship: createSourceLibraryCourse({
		name: "Be Your Own Boss: Entrepreneurship 101",
		area: "entrepreneurship",
		focus: "design thinking, problem discovery, customer definition, iteration, competitors, feasibility, marketing, social impact, and pitch development",
		sourceActivityAnchors: {
			"ENT1 Design Thinking Methodology": [
				{
					title: "Business Canvas Preview",
					prompt: "Start the course by previewing the final business canvas. Use a Lean Canvas-style structure to connect the problem, solution, key metrics, value proposition, unfair advantage, channels, target customers, cost structure, and revenue streams.",
					evidence: [
						"Draft canvas with each major box labeled, even when some boxes still contain open questions.",
						"Two feedback questions for an entrepreneur, business owner, or other knowledgeable reviewer.",
						"Revision note explaining which business assumption needs the most evidence."
					]
				},
				{
					title: "Ideal Wallet Design Sprint",
					prompt: "Run a short design-thinking sprint around a wallet or small everyday object. Interview a user, write a point-of-view statement, sketch three possible solutions, gather feedback, and revise the strongest design.",
					evidence: [
						"Interview notes naming what the user stores, worries about, or wants easier access to.",
						"Point-of-view statement in the form: user needs a way to ___ because or but ___.",
						"Three concept sketches plus a final iteration note based on feedback."
					]
				}
			],
			"ENT2 Learning What It Takes To Be An Entrepreneur": [
				{
					title: "Entrepreneur Strengths and Values Sketch",
					prompt: "Create a founder profile that names three to five strengths and two to four values. Connect each strength or value to how a future customer, teammate, or investor might judge the business.",
					evidence: [
						"Founder sketch or profile with strengths, values, and one concrete behavior for each value.",
						"Example of a real entrepreneur or company whose choices either reinforced or weakened trust.",
						"Reflection explaining why values can become harder to protect as a company grows."
					]
				},
				{
					title: "Brand Foundation Website Page",
					prompt: "Create an About or brand-foundation page for the developing business. Include founder values, a brief origin story, and the motivation behind the company before the product is fully defined.",
					evidence: [
						"About-page draft with founder strengths, values, and business motivation.",
						"Customer-facing sentence explaining why those values matter to the buyer.",
						"Revision note naming which claim sounds generic and how to make it more specific."
					]
				},
				{
					title: "Empathy Observation Persona",
					prompt: "Observe a person, pet, or realistic daily routine and record pain points, frustrations, habits, and needs. Translate the observation into a simple persona that can guide later problem selection.",
					evidence: [
						"Observation notes organized into story, pain points, frustrations, habits, and needs.",
						"Persona summary with one specific problem worth solving.",
						"Evidence note separating observed behavior from assumptions about motivation."
					]
				}
			],
			"ENT3 Solving Problems Through Entrepreneurship": [
				{
					title: "Problem Statement and Initial Solution",
					prompt: "Convert empathy notes into a concrete problem statement, then propose an initial product, service, or brand solution. Compare the statement to examples such as Duolingo, Airbnb, or Uber to check clarity.",
					evidence: [
						"Problem statement that names a target user, pain point, and reason the problem matters.",
						"Initial solution statement that directly answers the problem rather than listing features only.",
						"Search or market-interest notes, such as common questions people ask about the problem."
					]
				},
				{
					title: "Product or Service Prototype",
					prompt: "Build a first prototype. A product idea can use a labeled sketch or simple 3D model; a service idea can use a customer flowchart from first request through delivery and follow-up.",
					evidence: [
						"Prototype artifact with labels explaining the important parts of the product or service.",
						"Customer journey or use case showing how the prototype solves the selected problem.",
						"Website or one-page description that explains the prototype in customer-facing language."
					]
				},
				{
					title: "Name, Logo, Tagline, and Feedback Survey",
					prompt: "Give the company a recognizable identity and prepare feedback collection. Create a name, logo, and tagline, then write survey questions that gather specific reactions to the prototype.",
					evidence: [
						"Brand identity draft with name, logo concept, tagline, and reason each choice fits the customer.",
						"Survey with open-ended questions about usefulness, price, concerns, and likelihood of use.",
						"Feedback plan naming three to five possible respondents and what each can evaluate."
					]
				}
			],
			"ENT4 Identifying the Ideal Customer": [
				{
					title: "Coffee Shop Customer Needs Simulation",
					prompt: "Use the coffee shop simulation at [coolmathgames.com/0-coffee-shop](https://www.coolmathgames.com/0-coffee-shop) as a customer-needs case study. Track how price, recipe, weather, and customer comments affect sales.",
					evidence: [
						"Daily notes recording price, recipe choices, sales, and customer feedback patterns.",
						"Observation explaining how one customer complaint led to a changed business decision.",
						"Conclusion about why a product that is technically good can still fail if the buyer rejects price or fit."
					]
				},
				{
					title: "Ideal Customer Persona Profile",
					prompt: "Define one ideal customer with age range, income range, education or background, location, needs, values, blockers, habits, and motivators. The persona must be specific enough to guide product and marketing decisions.",
					evidence: [
						"Customer persona with demographic details, needs, motivators, blockers, and buying habits.",
						"List of two to five real or realistic people who fit the persona.",
						"Reasoning note explaining which persona detail changes the business plan the most."
					]
				},
				{
					title: "Customer Feedback Survey Draft",
					prompt: "Write five to ten open-ended survey questions for potential customers. Include questions about willingness to pay, frequency of use, concerns, and desired changes without forcing yes-or-no answers.",
					evidence: [
						"Survey draft with open-ended wording and no leading answer choices.",
						"Question map showing which product assumption each question tests.",
						"Revision note improving one biased or vague question."
					]
				}
			],
			"ENT5 Iterating On Your Idea": [
				{
					title: "Feedback Interpretation and Iteration Plan",
					prompt: "Review prototype and persona-survey feedback. Separate improvements, keepers, conflicting responses, and surprising results, then choose which feedback will drive the next prototype version.",
					evidence: [
						"Feedback table grouped by improvement, keep, conflict, and surprise.",
						"Iteration plan with specific changes and the customer evidence behind each change.",
						"Decision note explaining how conflicting feedback was resolved."
					]
				},
				{
					title: "Revised Prototype Evidence Summary",
					prompt: "Revise the prototype using the iteration plan. Summarize what changed, what evidence caused the change, and which unresolved concern still needs testing.",
					evidence: [
						"Before-and-after prototype comparison.",
						"Change log connecting each revision to survey or interview evidence.",
						"Next-test question focused on the riskiest remaining assumption."
					]
				}
			],
			"ENT6 Conducting Competitor Analysis": [
				{
					title: "Competitor Positioning Matrix",
					prompt: "Research similar companies and place them on a two-axis positioning matrix such as price versus quality. Use the map to identify the company niche and possible differentiation strategy.",
					evidence: [
						"Competitor list with two chosen comparison dimensions and notes for each company.",
						"Positioning matrix showing where the new company fits relative to competitors.",
						"Differentiation note naming whether the strategy resembles disruptive, new-market, integrative, or sustaining innovation."
					]
				},
				{
					title: "Competitor Question Research",
					prompt: "Write questions for competitors or competitor research, then collect answers from public websites, product pages, reviews, or direct outreach when appropriate.",
					evidence: [
						"Question list about problem solved, target customer, product difference, functionality, and motivation to buy.",
						"Research notes with source links or dates.",
						"Prototype update based on one competitor strength and one competitor weakness."
					]
				}
			],
			"ENT7 Testing Financial Feasibility": [
				{
					title: "Price and Competitor Comparison",
					prompt: "Choose a tentative price using customer feedback and competitor prices. Separate one-time purchases from recurring-fee models and explain why the selected model fits the product or service.",
					evidence: [
						"Pricing table with customer willingness-to-pay evidence and competitor prices.",
						"Decision note explaining one-time versus recurring pricing.",
						"Advertisement sketch or landing-page copy that displays the chosen price clearly."
					]
				},
				{
					title: "Production Cost and Profit Margin Forecast",
					prompt: "Estimate the cost of production or service delivery, then calculate revenue, costs, profit, and profit margin for a first-year scenario with 1,000 customers.",
					evidence: [
						"Materials, tools, labor, software, or operating-cost list with estimated prices.",
						"Profit-margin calculation and industry comparison note.",
						"First-year forecast with revenue, total cost, profit, and margin at the final chosen price."
					]
				}
			],
			"ENT8 Building and Testing Marketing Strategies": [
				{
					title: "One-Sentence Value Proposition",
					prompt: "Synthesize product experience, customer needs, competitor differences, and benefits into one clear value proposition. The statement must name what makes the offer useful and distinct.",
					evidence: [
						"Notes on customer feeling, features, benefits, persona needs, motivators, blockers, and competitor gaps.",
						"One-sentence value proposition placed where a customer would see it first.",
						"Revision note cutting vague or duplicate wording from the proposition."
					]
				},
				{
					title: "Channels and Launch Campaign Sketch",
					prompt: "Choose sales and promotion channels based on the ideal customer's habits. Review consistent marketing from known companies, then sketch launch posts or website sections for the company.",
					evidence: [
						"Channel decision explaining online, in-store, website, social, marketplace, or retailer choices.",
						"Marketing reference notes from at least three companies with clear brand consistency.",
						"Launch campaign draft with offer, audience, call to action, and visual or written style notes."
					]
				}
			],
			"ENT9 Focusing on Social Impact": [
				{
					title: "Impact Risk and Alternative Materials Review",
					prompt: "Identify possible environmental or community harms from production, labor, packaging, maintenance, or distribution. Research alternatives that reduce harm and update the cost assumptions accordingly.",
					evidence: [
						"Impact-risk list tied to specific materials, labor conditions, packaging, energy, or supply-chain choices.",
						"Alternative-practice research with costs, benefits, and tradeoffs.",
						"Updated price or cost calculation showing how the impact choice changes feasibility."
					]
				},
				{
					title: "Cause-Aligned Website Page and Campaign",
					prompt: "Create a cause-aligned page or campaign that explains the company's social or environmental commitment with concrete evidence instead of vague claims.",
					evidence: [
						"Cause page draft with the chosen cause, business practice, and measurable evidence.",
						"Promotional post or campaign outline focused on awareness and customer trust.",
						"Credibility check naming which claim needs a source, number, or clearer boundary."
					]
				}
			],
			"ENT10 Be Your Own Boss Master Project": [
				{
					title: "Lean Business Canvas Portfolio",
					prompt: "Finalize the business canvas by connecting work from the full course: problem, solution, metrics, value proposition, unfair advantage, channels, customers, costs, and revenue streams.",
					evidence: [
						"Completed canvas or slide deck with all major business-model sections.",
						"Supporting artifacts from customer research, prototype iteration, competitor analysis, pricing, marketing, and impact work.",
						"Final website or landing-page cleanup checklist."
					]
				},
				{
					title: "Entrepreneur Feedback and Pitch Revision",
					prompt: "Present the business plan to an entrepreneur, business owner, or knowledgeable reviewer. Gather feedback on clarity, feasibility, differentiation, and presentation, then revise the pitch.",
					evidence: [
						"Feedback notes answering what works, what does not work, what is unclear, and what can improve.",
						"Revision log showing what changed after feedback.",
						"Final pitch outline with problem, customer, solution, proof, business model, and ask or next step."
					]
				}
			]
		},
		staticAssets: [
			"ent3_project2_0.png",
			"ent3_project2_1.png",
			"ent4_project2_0.png",
			"ent5_project1_0.png"
		],
		modules: [
			"ENT1 Design Thinking Methodology",
			"ENT2 Learning What It Takes To Be An Entrepreneur",
			"ENT3 Solving Problems Through Entrepreneurship",
			"ENT4 Identifying the Ideal Customer",
			"ENT5 Iterating On Your Idea",
			"ENT6 Conducting Competitor Analysis",
			"ENT7 Testing Financial Feasibility",
			"ENT8 Building and Testing Marketing Strategies",
			"ENT9 Focusing on Social Impact",
			"ENT10 Be Your Own Boss Master Project"
		]
	})
} as const;

const englishCourses = {
	joyOfReading: createSourceLibraryCourse({
		name: "Early Elementary A: Discovering the Joy of Reading",
		area: "reading",
		focus: "characters, plot, literature comprehension, informational texts, figurative language, and short reading responses",
		sourceActivityAnchors: {
			"JoR1 Characters": [
				{
					title: "Character Investigator Report",
					prompt: "Read The Secret Ingredient and track Moira, Sunli, and Zaira through appearance details, preparation actions, problem response, and story impact. Use the evidence to infer two character traits for each character and write a three-sentence report for each one.",
					evidence: [
						"Character notes for Moira, Sunli, and Zaira that separate appearance, actions, and response to the competition problem.",
						"Two traits for each character with one action or quotation that supports the trait.",
						"Three-sentence report for each character describing the character, explaining an important action, and predicting how the story would change without that character."
					]
				},
				{
					title: "Sweet Sixteen Character Evidence",
					prompt: "Read Sweet Sixteen and compare Leonard, Frankie, and Morgan. Build a character sketch from descriptive details and then write short descriptions that use exact text evidence instead of only personal impressions.",
					evidence: [
						"Sketch or written profile for each triplet using details from the story and one inferred detail.",
						"Three-to-five-sentence description of Leonard, Frankie, and Morgan.",
						"At least one copied or quoted story detail for each description, with a note explaining how the detail supports the character claim."
					]
				}
			],
			"JoR2 Plot": [
				{
					title: "Faithful Friend Plot Diagram",
					prompt: "Read The Faithful Friend and place the major story events on a plot diagram. The diagram identifies exposition, rising action, climax, and resolution, then explains why each event belongs in that location.",
					evidence: [
						"Completed plot diagram or text equivalent for The Faithful Friend.",
						"Plain-language definitions for exposition, rising action, climax, and resolution.",
						"Short explanation for at least two placements that connects the event to the story structure."
					]
				}
			],
			"JoR Check-In #1": [
				{
					title: "Happy Halloween Plot and Character Check",
					prompt: "Read Happy Halloween and review both plot and character evidence. Track Jenny, Stacey, and Rebecca, then use a plot diagram to show how the haunted-house problem leads to the cookie-baking resolution.",
					evidence: [
						"Plot diagram or ordered event list with exposition, rising action, climax, and resolution.",
						"Three-to-five-sentence descriptions of Jenny, Stacey, and Rebecca that include traits and actions.",
						"Short oral or written review introducing the characters and explaining how the drawings or notes connect to traits and actions."
					]
				}
			],
			"JoR3 Reading Literature": [
				{
					title: "Groceries Storyboard",
					prompt: "Read Groceries and choose the six most important moments for a storyboard. Each frame captures a meaningful event, and the final explanation names why those moments matter and what lesson the story suggests.",
					evidence: [
						"Six-frame storyboard or numbered scene list for the story.",
						"Reason for choosing each scene as important to the plot.",
						"One-sentence moral or lesson supported by a story event."
					]
				}
			],
			"JoR4 Reading Informational Texts": [
				{
					title: "Megalodon News Report",
					prompt: "Read Ancient megalodon sharks were huge! and identify the who, what, when, where, why, and central message. Convert the article into a short news report that explains the discovery clearly for an audience.",
					evidence: [
						"Answers for who, what, when, where, why, and central message.",
						"News-report script with an introduction, central message, key details, and closing.",
						"Backdrop notes, image plan, or key-detail list that supports the report without replacing the explanation."
					]
				}
			],
			"JoR5 Figurative Language": [
				{
					title: "Figurative Language Drawing Set",
					prompt: "Compare literal drawings with sentence context for idioms, similes, metaphors, and personification. Use phrases such as hard nut to crack, walk on eggshells, in a nutshell, as tall as a giraffe, The test was a breeze, and The wind whipped through my hair to infer the meaning of each type.",
					evidence: [
						"Drawing or written literal interpretation for each figurative phrase.",
						"Definition of idiom, simile, metaphor, and personification using the phrase examples.",
						"Explanation of the difference between literal and figurative meaning and why an author might use figurative language."
					]
				}
			],
			"JoR Check-In #2": [
				{
					title: "Kevin's Crafts Story Review",
					prompt: "Read Kevin's Crafts and identify the moral, Kevin's character change, and at least three examples of figurative language. The review explains both what happened and how the language shapes the story.",
					evidence: [
						"Moral or overall lesson of Kevin's Crafts.",
						"Three figurative-language examples labeled as metaphor, simile, idiom, or another appropriate type.",
						"Story review that explains what the story is about, the moral, and whether the evidence supports the response."
					]
				},
				{
					title: "Lab-Grown Meat Main Idea Report",
					prompt: "Read Is lab-grown meat a good idea? and separate the central idea from supporting details. Use both the possible benefits and concerns to build a balanced informational report.",
					evidence: [
						"Main idea sentence for the article.",
						"Three key details copied or paraphrased from the text.",
						"Short report explaining how the key details relate to the main idea."
					]
				}
			],
			"JoR6 Master Project": [
				{
					title: "Bacon and Mittens Review or Figurative Art",
					prompt: "Read Bacon and Mittens and choose either a story review or a figurative-language art response. Both options require a summary, a moral or lesson, and evidence from the story.",
					evidence: [
						"Summary of what the story is about and the moral or lesson.",
						"At least three figurative-language examples from the story, with meanings explained.",
						"Response format selected: story review with opinion and reasons, or figurative-language art with explanation for each example."
					]
				},
				{
					title: "Dinosaur Footprint Interview or News Report",
					prompt: "Read Four-year-old makes a big discovery! and choose either an interview script or a news report. The response uses article facts about Lily, the footprint, the scientists, and the protected beach site.",
					evidence: [
						"Interview questions with imagined answers grounded in article details, or a news script with introduction, main idea, key details, and closing.",
						"Key-detail list that includes the discovery, estimated age, dinosaur information, and museum/protection context.",
						"Explanation of how the selected format helps the audience understand the informational text."
					]
				}
			]
		},
		staticAssets: [
			"jor2_disact_plotempty.png",
			"jor2_disact_plotexample.png"
		],
		modules: [
			"JoR1 Characters",
			"JoR2 Plot",
			"JoR Check-In #1",
			"JoR3 Reading Literature",
			"JoR4 Reading Informational Texts",
			"JoR5 Figurative Language",
			"JoR Check-In #2",
			"JoR6 Master Project"
		]
	}),
	pictureBook: createSourceLibraryCourse({
		name: "Early Elementary B: Write Your Own Picture Book",
		area: "writing",
		focus: "story planning, parts of speech, capitalization, commas, quotation marks, opinion writing, agreement, word choice, narrative writing, presentation skills, and book revision",
		sourceActivityAnchors: {
			"WYB1 Book Brainstorm I": [
				{
					title: "Favorite Ideas Opinion Board",
					prompt: "Draw or list favorite foods, places, and after-school activities, then identify which statements are opinions. Choose one opinion that could become a picture-book topic.",
					evidence: [
						"At least three favorite-topic sketches or notes.",
						"Plain-language definition of opinion using one example and one non-example.",
						"One opinion sentence with a matching picture idea that could support it."
					]
				},
				{
					title: "Opinion Book Seed",
					prompt: "Turn one favorite-topic opinion into a first book seed. The seed names the opinion, the audience, and one picture that would help the reader understand the point.",
					evidence: [
						"Opinion sentence that can become the center of a short book.",
						"Audience note naming who would enjoy or understand the topic.",
						"Support-picture sketch or description connected to the opinion."
					]
				}
			],
			"WYB2 Parts of Speech": [
				{
					title: "Parts of Speech Definition Map",
					prompt: "Create a map for nouns, adjectives, verbs, and adverbs. Include definitions, examples, and the difference between common nouns and proper nouns.",
					evidence: [
						"Definition for noun, adjective, verb, and adverb.",
						"Examples that show the difference between a common noun and proper noun with capitalization shown correctly.",
						"One sentence labeled with at least two parts of speech."
					]
				},
				{
					title: "Heads Up Word-Sort Game",
					prompt: "Use short answer cards such as favorite food, weekend activity, ideal pet, artist, and self-description to sort real words by part of speech.",
					evidence: [
						"Card list with at least ten single-word answers.",
						"Each selected card sorted as noun, proper noun, adjective, verb, or adverb.",
						"Revision note for one word that could fit more than one category depending on sentence context."
					]
				}
			],
			"WYB3 Capitalization": [
				{
					title: "Find the Capitalization Rule",
					prompt: "Begin with any capitalization rules already known, then study example sentences out loud, underline every capital letter, and infer the rules that explain the pattern. The activity ends by writing a clear rule list and using the rules to correct a new sentence, so capitalization is treated as evidence-based editing rather than memorizing an isolated list.",
					evidence: [
						"Starting rule list showing what was already known before the examples.",
						"Annotated examples with capital letters marked.",
						"Rule list for sentence beginnings, names, titles, places, and other proper nouns.",
						"One corrected sentence showing which capitalization rule was applied and why."
					]
				}
			],
			"WYB4 Commas & Quotation Marks": [
				{
					title: "Punctuation Treasure Hunt",
					prompt: "Solve punctuation puzzles by adding missing commas and quotation marks. Use the corrected sentences to build rules for lists, introductory phrases, and spoken dialogue.",
					evidence: [
						"Corrected versions of list sentences such as markers, pens, colored pencils, and a cutting machine.",
						"Corrected versions of dialogue sentences such as the zoo sentence and the hamburger request.",
						"Rule notes explaining when to use commas and when to use quotation marks."
					]
				},
				{
					title: "Comma and Quotation Rule Card",
					prompt: "Create a compact rule card that separates comma jobs from quotation-mark jobs and includes one original example for each.",
					evidence: [
						"Comma rule with an original list or opening-phrase example.",
						"Quotation-mark rule with an original dialogue example.",
						"One sentence revised after noticing a missing punctuation mark."
					]
				}
			],
			"WYB5 Opinion Writing": [
				{
					title: "Would You Rather Opinion Reasons",
					prompt: "Choose between two options, state an opinion, and support it with at least two reasons. Then write a new would-you-rather question and prepare reasons for one side.",
					evidence: [
						"Opinion answer with two supporting reasons.",
						"Original would-you-rather question with a chosen side.",
						"Reason note explaining how reasons differ from repeating the opinion."
					]
				},
				{
					title: "Opinion Paragraph Outline",
					prompt: "Brainstorm favorite foods, subjects, places, books, shows, movies, or animals, then outline an opinion paragraph with a topic sentence, two strong reasons, linking words, and a closing sentence.",
					evidence: [
						"Brainstorm list with several possible opinion topics.",
						"Outline naming the four parts of an opinion paragraph.",
						"Two strongest reasons circled or labeled before drafting."
					]
				}
			],
			"WYB6 Book Brainstorm II": [
				{
					title: "Favorite Story Structure Review",
					prompt: "Pick a familiar story and summarize what happens in the beginning, middle, and end. Identify the conflict and how the conflict is solved.",
					evidence: [
						"Beginning, middle, and end notes for the selected story.",
						"Conflict sentence and solution sentence.",
						"Character sketch or description connected to the story events."
					]
				},
				{
					title: "Original Character and Conflict Seed",
					prompt: "Create an original character for a story picture book. Draw or describe the character, then write one possible conflict the character could face.",
					evidence: [
						"Original character name and visual or descriptive details.",
						"One-sentence conflict that can drive a beginning, middle, and end.",
						"Connection note explaining how the character and conflict fit together."
					]
				}
			],
			"WYB7 Subject-Verb Agreement": [
				{
					title: "Subject-Verb Ambassador Sort",
					prompt: "Write sentences, identify subjects and verbs, and separate singular-subject examples from plural-subject examples. Use the sorted examples to explain agreement.",
					evidence: [
						"At least one sentence with the subject circled or labeled and the verb underlined or labeled.",
						"Singular-subject and plural-subject examples with matching verbs.",
						"Explanation of how the verb choice was selected for one blank."
					]
				}
			],
			"WYB8 Word Choice": [
				{
					title: "Which Word Works Context Cases",
					prompt: "Compare synonym choices in short passages and choose the word that best fits the context. Use the cat, homework, and diary examples to explain how tone changes meaning.",
					evidence: [
						"Choice between beast, creature, and animal with a reason tied to the cat passage.",
						"Choice between excuse, reason, and explanation with a reason tied to the homework passage.",
						"Choice between nosy, curious, and inquisitive with a reason tied to the diary passage."
					]
				},
				{
					title: "Word Choice Reflection",
					prompt: "Write a short reflection explaining why synonyms are not always interchangeable. Include one original sentence where two similar words would create different effects.",
					evidence: [
						"Definition of word choice using context and tone.",
						"Original sentence pair showing how changing one word changes meaning.",
						"Revision note choosing the stronger word for the intended effect."
					]
				}
			],
			"WYB9 Narrative Writing": [
				{
					title: "Gabby Tries Narrative Map",
					prompt: "Use the story Gabby Tries to identify characters, setting, conflict, time-order words, dialogue, description, beginning, middle, end, and lesson.",
					evidence: [
						"Beginning, middle, and end notes for Gabby Tries.",
						"List of time-order words from the story.",
						"Character note with one dialogue example, one description example, and one sentence explaining the lesson."
					]
				},
				{
					title: "Brainstorm Bonanza Story Plan",
					prompt: "Generate several settings, characters, and conflicts, then choose the strongest combination and plan a story with a beginning, middle, end, and lesson.",
					evidence: [
						"Setting, character, and conflict brainstorm lists.",
						"Character entry with description and a sample line of dialogue.",
						"Story plan with beginning, middle, end, conflict, solution, and lesson."
					]
				},
				{
					title: "Picture Book Plot Diagram",
					prompt: "Use the course plot-diagram resource to organize the picture-book story idea. Fill in the major story parts and explain which narrative element each part represents.",
					evidence: [
						"Plot diagram draft for the original picture-book story.",
						"Labelled narrative elements such as character, setting, conflict, solution, and lesson.",
						"Revision note naming one missing or weak story part."
					]
				}
			],
			"WYB10 Presentation Skills": [
				{
					title: "Strong Presentation Criteria",
					prompt: "Build a criteria list for strong presentation delivery. Use the list to evaluate a short practice reading and identify one concrete improvement.",
					evidence: [
						"Criteria list with voice, pacing, expression, posture or presence, and visual support.",
						"Practice note naming one criterion that worked and one criterion to improve.",
						"Improvement plan for the next reading."
					]
				},
				{
					title: "Dramatic Reading with Visual Backdrop",
					prompt: "Prepare a dramatic reading of Gabby Tries or an original story excerpt. Add two or three backdrop drawings, rehearse once, and check the reading against the presentation criteria.",
					evidence: [
						"Reading excerpt or selected story section.",
						"Two or three visual-backdrop sketches or descriptions.",
						"Self-check against the presentation criteria after rehearsal."
					]
				}
			],
			"WYB11 Master Project": [
				{
					title: "Picture Book Assembly Portfolio",
					prompt: "Assemble the final picture book from the course work. The book can be an opinion book or a story book, but it needs a clear central idea, organized pages, text-picture connection, mechanics revision, and presentation plan.",
					evidence: [
						"Book plan naming opinion-book or story-book format.",
						"Draft pages with text and matching illustration notes.",
						"Revision checklist covering capitalization, punctuation, word choice, page order, and presentation readiness."
					]
				}
			]
		},
		staticAssets: ["wyb1_proj1_plotempty.png"],
		modules: [
			"WYB1 Book Brainstorm I",
			"WYB2 Parts of Speech",
			"WYB3 Capitalization",
			"WYB4 Commas & Quotation Marks",
			"WYB5 Opinion Writing",
			"WYB Check-In #1",
			"WYB6 Book Brainstorm II",
			"WYB7 Subject-Verb Agreement",
			"WYB8 Word Choice",
			"WYB9 Narrative Writing",
			"WYB Check-In #2",
			"WYB10 Presentation Skills",
			"WYB11 Master Project"
		]
	}),
	publicSpeaking: createSourceLibraryCourse({
		name: "Make Your Point: Introduction to Public Speaking",
		area: "public speaking",
		focus: "introductions, toast structure, speechwriting, keynote organization, storytelling, radio pitches, argument defense, comedy timing, and polished talk delivery",
		sourceActivityAnchors: {
			"MYP1 Personal Introductions": [
				{
					title: "Two-Minute Self Introduction",
					prompt: "Prepare and deliver a two-minute introduction that includes basic identity details, background, and a few specific interests or experiences. Treat the introduction as a mini-speech with an opening, main points, and a closing summary.",
					evidence: [
						"Outline that separates opening, main points, and closing summary.",
						"Delivery notes for confidence, pacing, and reduced filler words such as like and um.",
						"Reflection comparing the first version with a revised version."
					]
				},
				{
					title: "Introduce Another Person",
					prompt: "Create a short introduction for another real or fictional person. Include a visual support plan, the details that define who the person is, and the tone that fits the audience.",
					evidence: [
						"Profile notes naming the person's background, interests, and one memorable detail.",
						"Visual support sketch or description that reinforces the introduction without replacing the speaker.",
						"Delivery checklist for confident voice, clear structure, and controlled filler words."
					]
				}
			],
			"MYP2 Toastmaker": [
				{
					title: "Toast Outline and Delivery Notes",
					prompt: "Turn a toast outline into a short performance plan. The speech honors a person or group, keeps a conversational tone, and uses notes rather than a word-for-word script.",
					evidence: [
						"Toast outline with opening, meaningful details, and closing sentiment.",
						"Eye-contact cues placed at important moments in the outline.",
						"Revision note explaining how tone, pacing, or eye contact changed after rehearsal."
					]
				}
			],
			"MYP4 Keynote Speaker": [
				{
					title: "Annotated Keynote Performance",
					prompt: "Prepare a keynote speech from an annotated outline. Mark places for emphasis, gestures, enacted phrases, pacing, enunciation, and open posture.",
					evidence: [
						"Annotated outline with two emphasis cues and one enacted-gesture cue.",
						"Visual theme or slide/backdrop plan connected to the speech topic.",
						"Rehearsal note naming one pacing change, one clarity change, and one body-language change."
					]
				}
			],
			"MYP5 Storyteller": [
				{
					title: "Personal Narrative Performance",
					prompt: "Build a true-story performance from a personal narrative outline. The performance uses a hook, a clear sequence of events, a lesson or point, and conversational delivery from notes.",
					evidence: [
						"Narrative outline with hook, key scene, conflict or turning point, and ending lesson.",
						"Two eye-contact cues and two gesture or emphasis cues.",
						"Delivery reflection on whether the story sounded conversational rather than read aloud."
					]
				}
			],
			"MYP6 Radio Pitch": [
				{
					title: "Five-Minute Media Pitch",
					prompt: "Pitch a TV show or movie as the best choice for a specific audience. Limit the pitch to five minutes, organize the main details quickly, and revise the delivery after one feedback pass.",
					evidence: [
						"Three-minute planning outline with the title, audience, main claim, and strongest details.",
						"Pitch structure with opening hook, reasons, examples, and closing recommendation.",
						"Before-and-after note explaining what changed in the second delivery."
					]
				}
			],
			"MYP7 Defense Attorney": [
				{
					title: "Happiness v. Money Case Argument",
					prompt: "Use the case question 'Can money buy happiness?' to prepare a courtroom-style argument. Build a claim, supporting evidence, counterargument, and closing statement for one side of the case.",
					evidence: [
						"Three pieces of evidence that support the chosen side.",
						"Counterargument with a concise response supported by two reasons.",
						"Closing statement that summarizes the argument and includes delivery notes for eye contact, pacing, enunciation, gestures, and posture."
					]
				}
			],
			"MYP8 Stand-up Comedian": [
				{
					title: "Stand-Up Routine Performance",
					prompt: "Draft and perform a four-to-five-minute stand-up routine from an outline. Keep the tone conversational, mark gesture and eye-contact cues, and rehearse enough to speak from memory rather than reading line by line.",
					evidence: [
						"Routine outline with setup, joke sequence, transitions, and closing beat.",
						"Two eye-contact cues and two gesture or emphasis cues.",
						"Rehearsal note describing timing, filler-word control, and whether the routine landed clearly."
					]
				}
			],
			"MYP9 Master Project: Your TED-Ed Talk": [
				{
					title: "Ideas Worth Spreading Analysis",
					prompt: "Analyze TED-Ed-style talks for through-line, body language, visual aids, emotional effect, and the qualities that make an idea worth spreading.",
					evidence: [
						"Notes from several talks naming through-line, gestures, visual aids, and audience effect.",
						"Pattern list of qualities shared by strong ideas worth spreading.",
						"Draft criteria for choosing a personal talk topic."
					]
				},
				{
					title: "TED-Style Talk Portfolio",
					prompt: "Prepare a polished talk with a central idea, supporting stories or arguments, visual aids, rehearsal plan, delivery notes, and production-quality checklist.",
					evidence: [
						"Talk script or outline with through-line, supporting sections, and closing idea.",
						"Visual-aid plan that highlights points without carrying the whole message.",
						"Production checklist covering landscape framing, clear lighting, audible sound, clean edits, file format, and copyright-safe materials."
					]
				}
			]
		},
		staticAssets: ["ted_ed_release.pdf"],
		modules: [
			"MYP1 Personal Introductions",
			"MYP2 Toastmaker",
			"MYP3 Speechwriter",
			"MYP4 Keynote Speaker",
			"MYP5 Storyteller",
			"MYP6 Radio Pitch",
			"MYP7 Defense Attorney",
			"MYP8 Stand-up Comedian",
			"MYP9 Master Project: Your TED-Ed Talk"
		]
	}),
	middleSchoolLiterature: createSourceLibraryCourse({
		name: "Middle School A: Reading and Analyzing Literature",
		area: "literary analysis",
		focus: "main ideas, supporting evidence, inference, showing versus telling, theme, point of view, word choice, rhyme, alliteration, figurative language, and final analysis writing",
		staticAssets: ["msa1_concept1_mainideasupportingevidence.png"],
		sourceActivityAnchors: {
			"MSA1 Main Ideas & Supporting Evidence I": [
				{
					title: "Lead Prankster Main Idea Model",
					prompt: "Plan a harmless class-prank scenario as a source model: list three or four specific details, then convert those details into a one- or two-sentence general plan. The general plan functions as the main idea, while the specific details function as supporting evidence.",
					evidence: [
						"A detail list naming the actors, setting, materials, sequence, or intended result.",
						"A short general plan that is broader than any one detail but still specific enough to summarize the scenario.",
						"A one-sentence explanation of how the details support the general plan."
					]
				},
				{
					title: "Kyra's Fear Main Idea and Evidence",
					prompt: "Read the Kyra's Fear passage and choose a just-right main idea that is neither too broad nor too narrow. Separate the strongest main-idea sentence from evidence about the spider, the reaction to the hair movement, and Kyra's fear.",
					evidence: [
						"One main-idea sentence about the passage as a whole.",
						"Two or more quoted or paraphrased details connected to the main idea.",
						"A short note explaining why a detail is evidence rather than another main idea."
					]
				}
			],
			"MSA2 Main Ideas & Supporting Evidence II": [
				{
					title: "Soccer Summer Best Evidence Sort",
					prompt: "Read Soccer Summer, write a one- or two-sentence main idea, then choose the two most impactful, detailed, and concise pieces of evidence. Compare the chosen evidence against less useful details so the final support is deliberate rather than random.",
					evidence: [
						"A concise main idea for the Soccer Summer passage.",
						"Two selected quotes or paraphrases from the passage.",
						"A comparison note explaining why each selected detail is stronger than an unused alternative."
					]
				}
			],
			"MSA3 Making Inferences": [
				{
					title: "Car Ride Inference Record",
					prompt: "Use the smoke-house example to define inference, then read Car Ride and infer Kazim's mood from textual clues such as counting Mississippi seconds, sighing, losing phone access, repeating questions, and ignoring the atlas.",
					evidence: [
						"An inference about Kazim's mood or attitude during the trip.",
						"At least two textual clues that make the inference reasonable.",
						"A reasoning sentence that connects each clue to the conclusion."
					]
				}
			],
			"MSA4 Show; Don't Tell": [
				{
					title: "Show-Don't-Tell Paragraph Draft",
					prompt: "Write or revise a paragraph that hints at a feeling, setting, relationship, or conflict through concrete actions, dialogue, sensory details, and description instead of naming the idea directly.",
					evidence: [
						"A before-and-after pair or a revised paragraph with the direct label removed.",
						"Concrete details that reveal the intended feeling or idea through inference.",
						"A short annotation naming what the paragraph reveals without directly stating it."
					]
				}
			],
			"MSA Check-In #1": [
				{
					title: "Reading Literature Check-In Record",
					prompt: "Use one passage or original paragraph to demonstrate main idea, supporting evidence, inference, and showing-versus-telling. Keep the skill evidence separate from any self-assessment notes.",
					evidence: [
						"A main idea supported by at least two specific details.",
						"An inference supported by textual or descriptive clues.",
						"A show-versus-tell revision or explanation."
					]
				}
			],
			"MSA5 Identifying Themes": [
				{
					title: "Theme Versus Main Idea Sort",
					prompt: "Compare main idea and theme by sorting statements into plot summaries and larger messages. Then infer one theme from a passage by using character change, conflict, and plot evidence.",
					evidence: [
						"Sorted examples that distinguish a passage summary from a broader theme.",
						"One theme written as a complete idea rather than a single topic word.",
						"Evidence showing how the plot or character choices develop that theme."
					]
				}
			],
			"MSA6 Analyzing & Developing Themes": [
				{
					title: "Characters and Themes Analysis",
					prompt: "Analyze how character actions and qualities develop a theme. Use the Cinderella contrast as a model: kindness and cruelty create different outcomes and help explain the text's larger message.",
					evidence: [
						"A character trait or action connected to a theme.",
						"Evidence from the plot showing the consequence of that trait or action.",
						"A short explanation of how the character evidence develops the larger message."
					]
				}
			],
			"MSA7 Analyzing Point of View": [
				{
					title: "Point of View Effects Lab",
					prompt: "Identify first person, second person, third person objective, third person limited, and third person omniscient narration. Then rewrite or compare the same plot from a different point of view, such as retelling Snow White from the queen's perspective, to observe changes in theme, suspense, humor, sympathy, or tone.",
					evidence: [
						"Point-of-view labels with evidence from pronouns, narrator access, or knowledge limits.",
						"A rewritten or compared passage that changes the narrator's perspective.",
						"A note describing how the new perspective changes reader interpretation."
					]
				}
			],
			"MSA8 Analyzing Words & Phrases": [
				{
					title: "Connotation Nation Word Choice Record",
					prompt: "Distinguish denotation from connotation by comparing words with similar dictionary meanings but different emotional force. Use the comparison to explain how word choice changes tone and reader response.",
					evidence: [
						"Pairs or groups of related words with neutral, positive, or negative connotations.",
						"One sentence revised with a different connotation.",
						"An explanation of how the revised word changes tone or reader response."
					]
				}
			],
			"MSA9 Analyzing Rhyme & Alliteration": [
				{
					title: "Sound Pattern Annotation",
					prompt: "Read a short text aloud and listen for conspicuous rhyme and alliteration. Mark each sound pattern and explain why the author may have drawn attention to those specific words.",
					evidence: [
						"Marked rhyming words and alliterative word groups.",
						"A sentence explaining what the repeated sounds emphasize.",
						"A note connecting the sound pattern to mood, meaning, humor, or rhythm."
					]
				}
			],
			"MSA10 Analyzing Figurative Language": [
				{
					title: "Analysis Toolbox Paragraph",
					prompt: "Identify similes, metaphors, and other figurative language, then combine word choice, sound-pattern, and figurative-language observations into a paragraph about meaning and tone.",
					evidence: [
						"At least one simile, metaphor, or figurative phrase identified accurately.",
						"Notes on word choice, sound, and figurative meaning.",
						"A short analysis paragraph explaining how those choices shape meaning or tone."
					]
				}
			],
			"MSA Check-In #2": [
				{
					title: "Analyzing Literature Check-In Record",
					prompt: "Use one passage to demonstrate theme, character-theme relationship, point of view, connotation, rhyme, alliteration, figurative language, and a final analysis paragraph about meaning and tone.",
					evidence: [
						"Annotations for theme, character evidence, point of view, word choice, sound, and figurative language.",
						"A paragraph that combines multiple craft observations instead of listing them separately.",
						"A self-check naming the strongest evidence and one area needing more support."
					]
				}
			],
			"MSA11 Master Project": [
				{
					title: "Writing from an Image Literature Showcase",
					prompt: "Choose an image and write a short literary piece that intentionally uses point of view, theme, character action, word choice, sound, and figurative language. Add a brief analysis explaining how those craft choices shape interpretation.",
					evidence: [
						"An original short piece inspired by an image.",
						"Visible use of point of view, theme development, word choice, sound, or figurative language.",
						"A short reflection connecting craft choices to reader interpretation."
					]
				}
			]
		},
		modules: [
			"MSA1 Main Ideas & Supporting Evidence I",
			"MSA2 Main Ideas & Supporting Evidence II",
			"MSA3 Making Inferences",
			"MSA4 Show; Don't Tell",
			"MSA Check-In #1",
			"MSA5 Identifying Themes",
			"MSA6 Analyzing & Developing Themes",
			"MSA7 Analyzing Point of View",
			"MSA8 Analyzing Words & Phrases",
			"MSA9 Analyzing Rhyme & Alliteration",
			"MSA10 Analyzing Figurative Language",
			"MSA Check-In #2",
			"MSA11 Master Project"
		]
	}),
	middleSchoolWriting: createSourceLibraryCourse({
		name: "Middle School B: Analytical and Creative Writing",
		area: "writing",
		focus: "arguments, evidence, counterclaims, evidence analysis, transitions, revision, character development, conflict, plot, point of view, and short-story drafting",
		staticAssets: [
			"msa15_concept2_transitionaldevices.png",
			"msa17_concept2_nemochart.png",
			"msa19_concept2_emptyplot.png",
			"msa19_concept2_labeledplot.png"
		],
		sourceActivityAnchors: middleSchoolBWritingRetakeSourceAnchors,
		modules: [
			"MSB1 Arguments & Evidence",
			"MSB2 Counterclaims",
			"MSB3 Integrating Evidence",
			"MSB4 Analyzing Evidence",
			"MSB5 Concluding Statements & Transitional Devices",
			"MSB6 Color Coding & Revision",
			"MSB Check-In #1",
			"MSB7 Character Development",
			"MSB8 Character Portraits",
			"MSB9 Generating Conflict & Structuring Plot",
			"MSB10 Manipulating Point of View",
			"MSB11 Writing an Original Short Story",
			"MSB Check-In #2",
			"MSB12 Master Project"
		]
	}),
	middleSchoolWritingRetake: createSourceLibraryCourse({
		name: "Middle School B: Analytical and Creative Writing Retake",
		area: "writing reinforcement",
		focus: "targeted review of arguments, evidence, counterclaims, evidence analysis, transitions, revision, character development, conflict, plot, point of view, and short-story drafting",
		staticAssets: [
			"msa15_concept2_transitionaldevices.png",
			"msa17_concept2_nemochart.png",
			"msa19_concept2_emptyplot.png",
			"msa19_concept2_labeledplot.png"
		],
		sourceActivityAnchors: middleSchoolBWritingSourceAnchors,
		modules: [
			"MSB1 Arguments & Evidence",
			"MSB2 Counterclaims",
			"MSB3 Integrating Evidence",
			"MSB4 Analyzing Evidence",
			"MSB5 Concluding Statements & Transitional Devices",
			"MSB6 Color Coding & Revision",
			"MSB Check-In #1",
			"MSB7 Character Development",
			"MSB8 Character Portraits",
			"MSB9 Generating Conflict & Structuring Plot",
			"MSB10 Manipulating Point of View",
			"MSB11 Writing an Original Short Story",
			"MSB Check-In #2",
			"MSB12 Master Project"
		]
	}),
	grammarMechanics: createSourceLibraryCourse({
		name: "Middle School C: Grammar and Mechanics",
		area: "grammar",
		focus: "parts of speech, capitalization, punctuation, phrases, clauses, subjects, predicates, objects, sentence types, and mechanics revision",
		sourceActivityAnchors: grammarMechanicsSourceAnchors,
		modules: [
			"MSC1 Nouns, Pronouns & Adjectives",
			"MSC2 Verbs, Adverbs & Verbals",
			"MSC3 Prepositions & Interjections",
			"MSC4 Coordinating & Subordinating Conjunctions",
			"MSC Check-In #1",
			"MSC5 Capitalization",
			"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks",
			"MSC7 Phrases & Clauses I",
			"MSC8 Commas",
			"MSC9 Semicolons",
			"MSC10 Colons",
			"MSC11 Common Punctuation Errors",
			"MSC12 Pauses & Breaks",
			"MSC Check-In #2",
			"MSC13 Subjects & Predicates",
			"MSC14 Direct & Indirect Objects",
			"MSC15 Phrases & Clauses II",
			"MSC16 Sentence Types",
			"MSC Check-In #3",
			"MSC17 Master Project"
		]
	}),
	novelWriting: createSourceLibraryCourse({
		name: "Novel Writing",
		area: "long-form writing",
		focus: "goal setting, protagonist and antagonist design, drafting, conflict, setting, plot structure, character development, narration, dialogue, and revision toward a complete story arc",
		sourceActivityAnchors: novelWritingSourceAnchors,
		staticAssets: [
			"nw6_blank_narrative_arc.jpg",
			"nw6_narrative_arc_definitions.jpg"
		],
		modules: [
			"NW1 Course Overview & Goal Setting",
			"NW2 Developing a Protagonist and an Antagonist",
			"NW3 Novel Drafting: Introducing Your Characters",
			"NW4 Generating Conflict",
			"NW5 Novel Drafting: Setting the Scene",
			"NW6 Structuring Plot",
			"NW7 Character Development",
			"NW8 Narration",
			"Check-In #1",
			"NW9 Describing Setting",
			"NW10 Writing Dialogue",
			"NW11 Novel Drafting: Conflict",
			"NW12 Novel Drafting: Falling Action & Resolution",
			"Check-In #2"
		]
	})
} as const;

const earlyElementaryAMathSourceAnchors: Record<
	string,
	SourceActivityAnchor[]
> = {
	"EEA1 Addition and Subtraction within 20": [
		{
			title: "Ladybug Number Bond Cases",
			prompt: "Use the ladybug-box scenario to make different combinations that total 15. Move one ladybug between boxes, then create an equal-share case with one ladybug left in the net.",
			evidence: [
				"Drawing, frame, or table showing two addends that total 15.",
				"Updated equation after one ladybug moves from one box to the other.",
				"Equal-share equation with the leftover ladybug represented clearly."
			]
		}
	],
	"EEA2 Addition and Subtraction within 100": [
		{
			title: "Starfish Tank Regrouping",
			prompt: "Use the starfish-tank scenario with 22 starfish in one tank and 16 in another. Group by tens, move leftovers into smaller tanks, then compare one tank against the combined amount in the other tanks.",
			evidence: [
				"Total starfish count from the starting tanks.",
				"Regrouped representation separating tens and leftover ones.",
				"Subtraction comparison after two starfish move back into Tank A."
			]
		}
	],
	"EEA3 Representing Word Problems": [
		{
			title: "Birthday Candy Bag Model",
			prompt: "Model two birthday candy bags with fruity and chocolate candies, then update the model after sharing candy and receiving a late birthday bag.",
			evidence: [
				"Separate counts for fruity candy and chocolate candy in the first two bags.",
				"Updated drawing or equation after sharing 2 fruity candies and 4 chocolate candies.",
				"Final total after adding the late birthday bag with 10 candies and 2 fruity pieces."
			]
		}
	],
	"EEA4 Module Project: Escape the Game": [
		{
			title: "Escape the Game Character Budget",
			prompt: "Design a video-game character with a 100-point budget. Choose hair, suit, and extra features from the original point table, then calculate points used and points left.",
			evidence: [
				"Character name and selected specs from each category.",
				"Addition equation for total points used.",
				"Subtraction equation for points remaining from the 100-point budget."
			]
		},
		{
			title: "Liang Escape Route Grid",
			prompt: "Plan a grid route from the bottom-left corner to the top-right corner. The route uses at least 20 right jumps, 15 left jumps, 30 up jumps, and 5 down jumps.",
			evidence: [
				"Route sketch or coordinate-step list from start to exit.",
				"Jump totals for right, left, up, and down directions.",
				"Total jump count with evidence that every movement rule was met."
			]
		}
	],
	"EEA5 Measuring and Estimating Length in Standard Units": [
		{
			title: "Indiana Jones Length Expedition",
			prompt: "Use the jungle-expedition scenario to compare inches, feet, yards, centimeters, and meters. Place the fruit, bug, tree, and gem along a one-yard path and answer distance questions.",
			evidence: [
				"Path model showing 36 inches as one yard.",
				"Object lengths marked in inches, centimeters, or meters with comparisons.",
				"Report answering distance in feet and comparing one foot with one yard."
			]
		}
	],
	"EEA6 Relating Addition and Subtraction to Length": [
		{
			title: "Yarn Quilt Length Equations",
			prompt: "Use the mini-quilt yarn scenario to add 11-inch, 12-inch, 15-inch, and 7-inch pieces, then subtract 20 inches to find the last piece length.",
			evidence: [
				"Number-line or ruler model for each yarn segment.",
				"Addition equations for total yarn before the final piece.",
				"Subtraction equation for the final piece and a check of the 68-to-81-inch measurement error."
			]
		}
	],
	"EEA7 Module Project: The Longest Sandwich in California": [
		{
			title: "Akshay Sandwich Number Line",
			prompt: "Plan a 96-meter sandwich by choosing ingredients, measuring each ingredient, ordering lengths from smallest to largest, and placing the sandwich on a 0-to-96-meter number line.",
			evidence: [
				"Ingredient list with lengths and units.",
				"Ordered list from smallest ingredient length to largest ingredient length.",
				"Number line from 0 meters to 96 meters showing the sandwich plan."
			]
		},
		{
			title: "Sandwich Sharing Record",
			prompt: "Track the record-setting sandwich after donation and party sharing. Account for Monday donation, Tuesday eating totals, and Wednesday split of the remaining sandwich.",
			evidence: [
				"Equation for sandwich length left after Monday's donation.",
				"Tuesday total eaten from the five people in the scenario and length remaining.",
				"Wednesday equal split calculation for the final remaining sandwich."
			]
		}
	],
	"EEA8 Understanding Place Value": [
		{
			title: "Penguin Place Value Grouping",
			prompt: "Use the penguin counting scenario to estimate first, then group penguins by tens and hundreds. Write totals in expanded form and reason about how many tens make 1,000.",
			evidence: [
				"Estimate and exact count comparison.",
				"Groups of ten, groups of ten tens, and leftovers recorded separately.",
				"Expanded form for 216 and a written pattern for reaching 1,000."
			]
		}
	],
	"EEA9 Adding and Subtracting within 200": [
		{
			title: "Bookshelf Regrouping Record",
			prompt: "Use the classroom-bookshelf scenario to estimate book totals, regroup books by tens, reorganize reading books, and add 23 history books from storage.",
			evidence: [
				"Estimate and exact total for the starting shelves.",
				"Regrouped equation after extras move to the extra-books shelf.",
				"Updated equation after adding 23 history books and one rewritten equivalent expression."
			]
		}
	],
	"EEA10 Representing Advanced Word Problems": [
		{
			title: "Arcade Ticket Goal Tracker",
			prompt: "Track arcade tickets through the prize goal, lunch purchases, a 30-ticket gift, and five final games. Decide whether the 200-ticket mega prize is reachable.",
			evidence: [
				"Ticket total before lunch and tickets still needed for the first goal.",
				"Lunch item choices with ticket cost and remaining tickets.",
				"Final ticket total after the five games and conclusion about the 200-ticket prize."
			]
		}
	],
	"EEA11 Adding and Subtracting within 1000": [
		{
			title: "Millionaire Base-Ten Challenge",
			prompt: "Use the Who Wants To Be A Millionaire-style question set to solve addition and subtraction within 1,000 with base-ten blocks or equivalent place-value records.",
			evidence: [
				"Problem setup separating hundreds, tens, and ones.",
				"Work record showing regrouping or decomposition when needed.",
				"Final answer checked against the place-value representation."
			]
		}
	],
	"EEA12 Strategies to Add and Subtract within 1000": [
		{
			title: "Skee-Ball Team Score Ledger",
			prompt: "Use the five-round skee-ball scenario to track points gained and lost from outer-ring holes, inner-ring holes, bullseyes, misses, and balls outside the play area. Keep the running score visible after each round so additions, penalties, trades, and the final record comparison can be checked without recalculating the entire game.",
			evidence: [
				"Round-by-round score ledger with gains and penalties.",
				"Base-ten or expanded-form representation of the running score after at least two rounds.",
				"Final comparison with the 870-point record, including the exact number of points over or under the record."
			]
		}
	],
	"EEA13 Module Project: Going TikTok Famous": [
		{
			title: "TikTok Creator Follower Analysis",
			prompt: "Use Melody's creator table to order the top five TikTok creators, total their follower counts, and calculate how many followers each creator needs to reach one billion.",
			evidence: [
				"Creators ordered from most followers to fewest followers.",
				"Combined follower total for the top five creators.",
				"Difference from one billion followers for each creator."
			]
		},
		{
			title: "Melody Test Launch Data",
			prompt: "Design a video idea for Melody's test launch, then track new followers gained from Monday through Thursday and add them to the starting 673 followers.",
			evidence: [
				"Video idea with one reason it could attract viewers or followers.",
				"New-follower total from 37, 93, 334, and 158.",
				"Final follower count after adding the new followers to 673."
			]
		}
	],
	"Check-in #1": [
		{
			title: "Addition, Length, and Place Value Check",
			prompt: "Use the check-in problems to demonstrate sums and differences, length-unit addition and subtraction, place value comparison, expanded form, and operations within 1,000.",
			evidence: [
				"Backpacking, circle, rope, and ball-distance problems solved with diagrams or equations.",
				"Place value comparisons using greater-than, less-than, or equal signs.",
				"Addition and subtraction within 1,000 with the strategy named."
			]
		}
	],
	"EEA14 Working with Equal Groups": [
		{
			title: "Kickball Equal Groups",
			prompt: "Use the kickball roster scenario to divide players into equal teams, update the roster when three more players arrive, and connect five groups of four points to repeated addition.",
			evidence: [
				"Roster count before and after the three late arrivals.",
				"Team split showing whether the teams are equal at each stage.",
				"Repeated-addition equation for five players each scoring four points."
			]
		}
	],
	"EEA15 Partitioning Rectangles": [
		{
			title: "Board Game Rectangle Partitions",
			prompt: "Design a rectangular board game by partitioning a rectangle into rows and columns of equal-sized squares. Count the spaces and decide whether good and bad spaces can be split evenly.",
			evidence: [
				"Rectangle partitioned into equal rows and columns.",
				"Addition or array count for total squares.",
				"Good-space and bad-space count with an explanation of equal or unequal splitting."
			]
		}
	],
	"EEA16 Time": [
		{
			title: "Deserted Island Time Record",
			prompt: "Use the deserted-island scenario to distinguish a.m. and p.m., analog and digital clocks, half past, quarter until, elapsed time, and a 40-minute delay.",
			evidence: [
				"Examples of a.m. and p.m. based on time-of-day clues.",
				"Analog and digital clock readings for 8:30 and quarter until 10.",
				"Elapsed-time calculation from 7:30 a.m. to rescue time plus the 40-minute delay."
			]
		}
	],
	"EEA17 Money": [
		{
			title: "Grocery Coin Exchange",
			prompt: "Use the grocery-store scenario to represent item prices with dollars and coins, add up to four selected items, and exchange leftover coins for fewer coins or bills.",
			evidence: [
				"Coin combinations for selected grocery item prices.",
				"Total cost for up to four chosen items.",
				"Coin-exchange record for 3 quarters, 7 dimes, 10 nickels, and 20 pennies."
			]
		}
	],
	"EEA18 Visualizing Data": [
		{
			title: "Kitchen Utensil Data Display",
			prompt: "Collect kitchen utensil counts for spoons, knives, and forks, choose a visual display, then update the display after adding 3 forks, 2 spoons, and 4 knives.",
			evidence: [
				"Original utensil counts by category.",
				"Graph, table, or picture display showing all utensil categories.",
				"Updated counts and comparison of largest and smallest categories after the new set."
			]
		}
	],
	"EEA19 Polygons and Circles": [
		{
			title: "Bakery Dessert Shape Fractions",
			prompt: "Use the bakery dessert scenario to describe dessert shapes, then divide pies and ice cream cakes into two, three, and four equal parts for different party groups.",
			evidence: [
				"Shape observations naming sides, curves, corners, or equal parts.",
				"Partition drawings or descriptions for halves, thirds, and fourths.",
				"Explanation of how the parts stay equal for each dessert."
			]
		}
	],
	"EEA20 Module Project: The Next Hit iPhone": [
		{
			title: "Devyn iPhone Data Charts",
			prompt: "Use Devyn's iPhone table to create charts for initial price, battery life, and customer satisfaction. Use the displays to recommend price and battery-life choices for a future iPhone.",
			evidence: [
				"Chart or table for initial price by model.",
				"Chart or table for battery life and satisfaction by model.",
				"Recommendation for a future price and battery-life target with data evidence."
			]
		},
		{
			title: "Launch Party Array Cuts",
			prompt: "Use the launch-party dessert scenario to split square trays into exactly 15 brownies for the product team and 20 cake slices for the engineering team.",
			evidence: [
				"Array or partition plan for 15 equal brownie pieces.",
				"Array or partition plan for 20 equal cake pieces.",
				"Explanation connecting rows and columns to multiplication or repeated addition."
			]
		}
	],
	"Check-in #2": [
		{
			title: "Multiplication, Measurement, Data, and Shape Check",
			prompt: "Use the second check-in to demonstrate even and odd reasoning, arrays, equal groups, length, money, data displays, time, shapes, fractions, and final subtraction.",
			evidence: [
				"Even or odd, equal-sum, array, and rectangle-area responses with reasoning.",
				"Length, money, and picture-graph responses with labels and units.",
				"Time, shape, equal-parts, and 500-pound switch problems solved with visible work."
			]
		}
	]
};

const elementaryMathCourses = {
	earlyElementaryA: createSourceLibraryCourse({
		name: "Early Elementary A: Discovering Numbers, Operations, and Measurement",
		area: "early elementary math",
		focus: "addition, subtraction, word problems, length, place value, equal groups, rectangles, time, money, data, polygons, circles, and visual math explanations",
		sourceActivityAnchors: earlyElementaryAMathSourceAnchors,
		staticAssets: [
			"check_in_1_length_0.png",
			"check_in_1_sums_0.png",
			"check_in_1_sums_1.png",
			"check_in_2_additional_0.png",
			"check_in_2_money_1.png",
			"check_in_2_multiplication_0.png",
			"check_in_2_multiplication_1.png",
			"check_in_2_multiplication_2.png",
			"check_in_2_time_0.png",
			"mfa18_pset1_0.png",
			"module_example.png",
			"module_project_1_0.png"
		],
		modules: [
			"EEA1 Addition and Subtraction within 20",
			"EEA2 Addition and Subtraction within 100",
			"EEA3 Representing Word Problems",
			"EEA4 Module Project: Escape the Game",
			"EEA5 Measuring and Estimating Length in Standard Units",
			"EEA6 Relating Addition and Subtraction to Length",
			"EEA7 Module Project: The Longest Sandwich in California",
			"EEA8 Understanding Place Value",
			"EEA9 Adding and Subtracting within 200",
			"EEA10 Representing Advanced Word Problems",
			"EEA11 Adding and Subtracting within 1000",
			"EEA12 Strategies to Add and Subtract within 1000",
			"EEA13 Module Project: Going TikTok Famous",
			"Check-in #1",
			"EEA14 Working with Equal Groups",
			"EEA15 Partitioning Rectangles",
			"EEA16 Time",
			"EEA17 Money",
			"EEA18 Visualizing Data",
			"EEA19 Polygons and Circles",
			"EEA20 Module Project: The Next Hit iPhone",
			"Check-in #2"
		]
	}),
	earlyElementaryB: createSourceLibraryCourse({
		name: "Early Elementary B: Exploring Arithmetic, Fractions, and Geometry",
		area: "early elementary math",
		focus: "multi-digit operations, multiplication, division, word problems, measurement, area, fractions, data, perimeter, quadrilaterals, and geometric explanation",
		staticAssets: [
			"checkin2_app_0.png",
			"checkin2_gm_2.png",
			"checkin2_gm_3.png",
			"checkin2_gm_4.png",
			"checkin2_ma_0.png",
			"mfb10_concept1_0.png",
			"mfb14_pset1_0.png",
			"mfb14_pset1_1.png",
			"mfb14_pset1_2.png",
			"mfb14_pset1_3.png",
			"mfb14_pset1_4.png",
			"module_example.png"
		],
		modules: [
			"EEB1 Adding and Subtracting within 1000",
			"EEB2 Strategies to Add and Subtract within 1000",
			"EEB3 Multiplying and Dividing within 100",
			"EEB4 Properties of Multiplication and Division",
			"EEB5 Multiplication and Division Word Problems",
			"EEB6 Applying the Four Operations",
			"EEB7 Multiples of 10",
			"EEB8 Module Project: Using Science For Good",
			"Check-in #1",
			"EEB9 Units of Measurement",
			"EEB10 Area",
			"EEB11 Module Project: Investing for the Future",
			"EEB12 Partitioning Shapes",
			"EEB13 Fractions as Numbers",
			"EEB14 Represent and Interpret Data",
			"EEB15 Perimeter",
			"EEB16 Quadrilaterals",
			"EEB17 Module Project: 2001: A Warehouse Odyssey",
			"Check-in #2"
		]
	}),
	lateElementaryA: createSourceLibraryCourse({
		name: "Late Elementary A: Investigating Multiplication, Division, and Geometry",
		area: "late elementary math",
		focus: "place value, rounding, whole-number operations, factors, multiples, multiplication, division, lines, angles, triangles, polygons, perimeter, area, and volume",
		staticAssets: [
			"check_in_1_multiplication_0.png",
			"check_in_1_multiplication_1.png",
			"check_in_1_multiplication_3.png",
			"check_in_2_lines_0.png",
			"check_in_2_lines_2.png",
			"check_in_2_lines_4.png",
			"check_in_2_lines_5.png",
			"checkin1_app_0.png",
			"maa1_pset1_0.png",
			"maa6_pset1_0.png",
			"maa6_pset1_1.png",
			"maa6_pset1_2.png",
			"maa6_pset1_3.png",
			"maa6_pset1_4.png",
			"maa7_pset1_0.png",
			"maa7_pset1_1.png",
			"maa7_pset1_10.png",
			"maa7_pset1_11.png",
			"maa7_pset1_2.png",
			"maa7_pset1_6.png",
			"maa7_pset1_7.png",
			"maa7_pset1_8.png",
			"maa7_pset1_9.png",
			"maa7_pset2_0.png",
			"maa7_pset2_1.png",
			"maa7_pset2_2.png",
			"maa7_pset2_3.png",
			"maa7_pset3_0.png",
			"maa7_pset3_1.png",
			"maa7_pset3_2.png",
			"maa7_pset3_3.png",
			"maa7_pset3_4.png",
			"maa7_pset3_5.png",
			"maa7_pset3_6.png",
			"maa7_pset3_7.png",
			"maa7_pset3_8.png",
			"maa7_pset3_9.png",
			"module_example.png",
			"module_project_1_0.png"
		],
		modules: [
			"LEA1 Place Value",
			"LEA2 Comparing and Rounding",
			"LEA3 Addition and Subtraction",
			"LEA4 Module Project: Soccer Season",
			"LEA5 Factors and Multiples",
			"LEA6 Multiplication by One-Digit Numbers",
			"LEA7 Multiplication by Two-Digit Numbers",
			"LEA8 Division by One-Digit Numbers",
			"LEA9 Module Project: Invest-a-thon",
			"Check-in #1",
			"LEA10 Lines",
			"LEA11 Angles",
			"LEA12 Triangles",
			"LEA13 Module Project: An Obtuse Life",
			"LEA14 Polygons and Perimeter",
			"LEA15 Quadrilaterals",
			"LEA16 Area and Volume",
			"LEA17 Module Project: The LA River Master Plan",
			"Check-in #2"
		]
	}),
	lateElementaryB: createSourceLibraryCourse({
		name: "Late Elementary B: Mastering Fractions, Decimals, Units, and Coordinates",
		area: "late elementary math",
		focus: "fractions, decimals, unit conversion, numerical expressions, multi-digit multiplication and division, coordinate planes, patterns, figures, and geometric reasoning",
		staticAssets: [
			"checkin1_fractions_0.png",
			"checkin1_fractions_1.png",
			"leb16_concept1_0.png",
			"leb16_pset1_0.png",
			"leb16_pset1_2.png",
			"leb16_pset1_3.png",
			"module_example.png"
		],
		modules: [
			"LEB1 Equivalent Fractions",
			"LEB2 Comparing and Ordering Fractions",
			"LEB3 Adding and Subtracting Fractions",
			"LEB4 Multiplying Fractions",
			"LEB5 Dividing Fractions",
			"LEB6 Module Project: Saving the Environment One Cake at a Time",
			"LEB7 Place Value with Decimals",
			"LEB8 Comparing and Rounding Decimals",
			"LEB9 Decimal Operations",
			"LEB10 Module Project: From Facebook to YouTube",
			"Check-in #1",
			"LEB11 Customary and Metric Units",
			"LEB12 Module Project: From Factory Line to Test Drive",
			"LEB13 Numerical Expressions",
			"LEB14 Multiplying by Two and Three Digit Numbers",
			"LEB15 Dividing by Two Digit Numbers",
			"LEB16 The Coordinate Plane",
			"LEB17 Patterns, Figures and Shapes in the Coordinate Plane",
			"LEB18 Module Project: Chanh's Space Adventure",
			"Check-in #2"
		]
	})
} as const;

const sourceVariantCourses = {
	scratchBootcamp: createSourceLibraryCourse({
		name: "Scratch Level 1: Game Superstar Bootcamp",
		area: "visual programming bootcamp",
		focus: "Scratch setup, sounds, motion, costumes, backdrops, event listeners, loops, conditionals, variables, and a short master project sequence",
		sourceActivityAnchors: {
			"GS1 Event Listeners and Movement": [
				{
					title: "Scratch Account and First Project Tour",
					prompt: "Create or open a Scratch project and identify the stage, sprite list, code area, costumes, sounds, and save state. Use this setup pass to connect the project workspace to later movement, sound, and event-listener work.",
					evidence: [
						"A project workspace is open and saved with a clear title.",
						"The stage, sprites, costumes, sounds, and code blocks can be named from the interface.",
						"One note explains how Scratch projects are saved and reopened."
					]
				},
				{
					title: "Dragonfly Event Listener Remix",
					prompt: "Use the original dragonfly activity at https://scratch.mit.edu/projects/592006491/ as a reference for event-driven behavior. Add separate events for the green flag, space key, and sprite click so the dragonfly moves, plays a sound, and says a short message.",
					evidence: [
						"The green flag starts the project and moves the sprite to a random position.",
						"The space key triggers a sound effect without needing another click.",
						"Clicking the sprite produces a visible speech bubble or equivalent feedback."
					]
				},
				{
					title: "Beetle Keyboard Drawing Controls",
					prompt: "Use https://scratch.mit.edu/projects/592008620/ as the shape-drawing reference. Build keyboard events that move a beetle with the arrow keys, reset the drawing with the green flag, and draw a square, triangle, and arrow from number-key events.",
					evidence: [
						"Arrow-key controls move the sprite in predictable directions.",
						"The reset event clears the drawing and returns the beetle to a known starting position.",
						"Each number-key event creates a different shape using repeated move and turn blocks."
					]
				},
				{
					title: "Pencil Drawing Program Controls",
					prompt: "Use the drawing-program activity at https://scratch.mit.edu/projects/287738652/ to combine movement, turning, pen control, color changes, pen-size changes, and a reset event into one reusable drawing tool.",
					evidence: [
						"Forward, backward, left-turn, and right-turn controls are attached to key events.",
						"Pen-up, pen-down, color, and size controls change the visible drawing behavior.",
						"The green flag restores position, direction, pen size, and pen color."
					]
				},
				{
					title: "Arrow Direction and Mouse Targeting",
					prompt: "Use https://scratch.mit.edu/projects/287920173/ as a reference for direction events. Program an arrow sprite to point in the four arrow-key directions, rotate with letter keys, and point toward the mouse when the space key is pressed.",
					evidence: [
						"The arrow keys map to up, down, left, and right headings.",
						"Letter-key rotation changes the heading by a consistent number of degrees.",
						"The mouse-targeting event visibly points the sprite toward the cursor."
					]
				},
				{
					title: "Ball Looks and Motion Event Set",
					prompt: "Use https://scratch.mit.edu/projects/287924505/ to build a small event set for a ball sprite. Combine random starting position, movement with edge bounce, backdrop changes, size changes, sound, and color effects.",
					evidence: [
						"The green flag randomizes or resets the ball state.",
						"Movement includes edge-bounce behavior instead of leaving the stage permanently.",
						"At least three visible feedback events change sound, size, color, or backdrop."
					]
				}
			],
			"GS2 Loops": [
				{
					title: "Elephant Repeat and Forever Effects",
					prompt: "Use https://scratch.mit.edu/projects/592014695/ as the loop-effects reference. Build key events that grow, shrink, change color, apply another visual effect, and repeatedly hide and show the elephant.",
					evidence: [
						"Growth and shrink actions use repeat blocks instead of duplicated manual blocks.",
						"At least one visual effect runs in a forever loop.",
						"The hide-wait-show sequence repeats with a visible timing pattern."
					]
				},
				{
					title: "Mouse Shape Loops",
					prompt: "Use https://scratch.mit.edu/projects/601699148/ as the looped-shapes reference. Add a reset event, then use loops to draw a triangle, a circle-like shape, and at least one additional shape or design.",
					evidence: [
						"The reset event clears the previous drawing before a new drawing starts.",
						"Shape scripts use repeated movement and turns rather than one block per side.",
						"The extra design changes side count, turn amount, step size, or repetition count."
					]
				},
				{
					title: "Hot Cross Buns Music Loop",
					prompt: "Use https://scratch.mit.edu/projects/291117784/ as the music-loop reference. Recreate the note pattern EDC twice, followed by CCCC, DDDD, and EDC, then use loops to reduce repetition and play the full phrase twice.",
					evidence: [
						"The Music extension is active or the project uses equivalent sound blocks.",
						"Repeated note groups are represented with loops where possible.",
						"The song plays twice from one green-flag start event."
					]
				}
			],
			"GS3 Conditionals and Variables": [
				{
					title: "Button Click Timer Game",
					prompt: "Use https://scratch.mit.edu/projects/592019210/ as the variables reference. Build a timed button-click game with a click counter, countdown timer, start sequence, button feedback, and game-over hiding behavior.",
					evidence: [
						"A click-count variable resets at the start and increases only when the button is active.",
						"A timer variable counts down from 10 to 0.",
						"The ready-set-go sequence and game-over state are visible in the project."
					]
				},
				{
					title: "Crab Catching Game",
					prompt: "Use https://scratch.mit.edu/projects/327610777/ as the falling-object game reference. Move the crab with arrow keys, make the cheesy puffs fall from random top positions, reset missed puffs, and increase a score when the crab catches one.",
					evidence: [
						"The crab movement stays responsive during the falling-object loop.",
						"Cheesy puffs restart near the top after being caught or missed.",
						"The score variable resets at the start and increases on a collision."
					]
				},
				{
					title: "Zebra Step Counter",
					prompt: "Use https://scratch.mit.edu/projects/327635693/ as the step-count reference. Create a steps variable, reset it with the green flag, move the zebra with arrow keys, switch costumes during movement, and count each step.",
					evidence: [
						"The steps variable starts at zero on a fresh run.",
						"Each movement event changes the costume or animation state.",
						"The step count increases in sync with movement events."
					]
				}
			],
			"GS4 Master Project": [
				{
					title: "Bootcamp Game Selection",
					prompt: "Choose a master-project direction from the original options: Spider Smash at https://scratch.mit.edu/projects/299272518/, Hungry Shark at https://scratch.mit.edu/projects/608768681/, or Save the Princess at https://scratch.mit.edu/projects/608770708/. Identify the core player action, objective, score or win condition, and main feedback loop before building.",
					evidence: [
						"The project plan names the selected game direction and its playable goal.",
						"The plan includes events, loops, conditionals, variables, and visible feedback.",
						"One risk note names the behavior most likely to break during implementation."
					]
				},
				{
					title: "Playable Scratch Game Build",
					prompt: "Build a short original Scratch game that combines motion, events, loops, conditionals, variables, costumes or backdrops, sound or visual feedback, and a clear end state.",
					evidence: [
						"The game can be started from a fresh green-flag run.",
						"Player action changes the game state in a way that can be seen or measured.",
						"The final project includes a short explanation of controls, objective, scoring or success condition, and one improvement made after testing."
					]
				}
			]
		},
		modules: [
			"GS1 Event Listeners and Movement",
			"GS2 Loops",
			"GS3 Conditionals and Variables",
			"GS4 Master Project"
		]
	}),
	usacoBronzeOnDemand: createSourceLibraryCourse({
		name: "USACO Bronze: On Demand",
		area: "self-paced competitive programming",
		focus: "USACO setup, file input and output, simulation, complete search, greedy reasoning, modular arithmetic, grids, strings, arrays, intervals, and contest postmortems",
		staticAssets: [
			"UB1.png",
			"UB2.png",
			"UB3.png",
			"UB4.png",
			"UB5.png",
			"UB6.png",
			"missionTitle2.png",
			"nextStepTitle.png"
		],
		modules: [
			"UB0 Welcome to USACO Bronze!",
			"UB1 Square Pasture",
			"UB2 Your Ride Is Here",
			"UB3 Friday the Thirteenth",
			"UB4 Broken Necklace",
			"UB5 Greedy Gift Givers",
			"UB6 Milking Cows",
			"UB7 Name That Number",
			"UB8 Palindromic Squares",
			"UB9 Dual Palindromes",
			"UB10 Transformations",
			"UB11 Mixing Milk",
			"UB12 Barn Repair",
			"UB13 Combination Lock",
			"UB14 Prime Cryptarithm",
			"UB15 Ski Course Design",
			"UB16 Wormholes",
			"UB17 Block Game",
			"UB18 The Cow-Signal",
			"UB19 Don't Be Last",
			"UB20 Hoof, Paper, Scissors",
			"UB21 Cow Tipping",
			"UB22 Why Did the Cow Cross the Road",
			"UB23 Why Did the Cow Cross the Road II",
			"UB24 Why Did the Cow Cross the Road III",
			"UB25 The Lost Cow",
			"UB26 Bovine Genomics",
			"UB27 Modern Art",
			"UB28 Fence Painting",
			"UB29 Speeding Ticket",
			"UB30 Contaminated Milk",
			"UB31 Promotion Counting",
			"UB32 Angry Cows",
			"UB33 Mowing the Field",
			"UB34 Milk Pails",
			"UB35 Circular Barn",
			"UB36 Load Balancing",
			"UB37 Diamond Collector",
			"UB38 Bull in a China Shop",
			"UB39 Field Reduction",
			"UB40 Blocked Billboard",
			"UB41 The Bovine Shuffle",
			"UB42 Milk Measurement",
			"UB43 Blocked Billboard II",
			"UB44 Lifeguards",
			"UB45 Out of Place",
			"UB46 Teleportation",
			"UB47 Hoofball",
			"UB48 Taming the Herd",
			"UB49 Team Tic Tac Toe",
			"UB50 Milking Order",
			"UB51 Family Tree",
			"UB52 Additional Practice Problems"
		]
	})
} as const;

export const smartMoneyPersonalFinanceCourse = investingCourses.smartMoney;
export const moneyMindedInvestingCourse = investingCourses.moneyMinded;
export const entrepreneurship101Course = investingCourses.entrepreneurship;

export const earlyElementaryJoyOfReadingCourse = englishCourses.joyOfReading;
export const earlyElementaryPictureBookCourse = englishCourses.pictureBook;
export const introductionToPublicSpeakingCourse = englishCourses.publicSpeaking;
export const middleSchoolLiteratureCourse =
	englishCourses.middleSchoolLiterature;
export const middleSchoolWritingCourse = englishCourses.middleSchoolWriting;
export const middleSchoolWritingRetakeCourse =
	englishCourses.middleSchoolWritingRetake;
export const grammarMechanicsCourse = englishCourses.grammarMechanics;
export const novelWritingCourse = englishCourses.novelWriting;

export const earlyElementaryMathACourse =
	elementaryMathCourses.earlyElementaryA;
export const earlyElementaryMathBCourse =
	elementaryMathCourses.earlyElementaryB;
export const lateElementaryMathACourse = elementaryMathCourses.lateElementaryA;
export const lateElementaryMathBCourse = elementaryMathCourses.lateElementaryB;

export const scratchLevel1BootcampCourse = sourceVariantCourses.scratchBootcamp;
export const usacoBronzeOnDemandCourse =
	sourceVariantCourses.usacoBronzeOnDemand;
