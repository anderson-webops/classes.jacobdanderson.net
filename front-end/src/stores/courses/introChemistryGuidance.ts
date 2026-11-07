import type { RawCourseModule, RawCourseModuleItem } from "./types";

const pack = "/course-assets/chemistry/chemistry-materials-pack.md";
const answers = "/course-assets/chemistry/chemistry-rubrics-answer-key.md";

const coreTasks = new Set([
	"Three-Representation and Accessible-Evidence Contract",
	"Matter Classification and Change Misconception Gate",
	"Atomic Identity, Charge, and Nuclear-Change Gate",
	"Checkpoint: Atomic Structure, Isotopes, and Ions",
	"Periodic Trend Evidence and Assessment Boundary",
	"Checkpoint: Bonding, Structure, and Energy Model Limits",
	"Thermal, Phase, and Attraction Evidence Contract",
	"Checkpoint: Energy, Phase Change, and Gases",
	"Limiting Reactants and Leftovers",
	"Qualitative Solution Evidence and pH Scope Gate",
	"Checkpoint: Quantitative Chemistry Reasoning",
	"Advanced-Topic Preview and Readiness Boundary",
	"Capstone Evidence, Revision, and Defense Packet",
	"Checkpoint: Capstone Defense"
]);

const moduleSections: Record<string, [string, string]> = {
	CHM1: ["model-comparison-cards", "model-comparison-key"],
	CHM2: ["phenomena-case-library", "phenomena-case-library-key"],
	CHM3: ["isotope-table", "isotope-key"],
	CHM4: [
		"periodic-table-reference-comparison",
		"periodic-table-reference-comparison-key"
	],
	CHM5: ["lewis-structure-practice-set", "lewis-structure-key"],
	CHM6: [
		"energy-phase-and-gas-checkpoint",
		"energy-phase-and-gas-checkpoint-key"
	],
	CHM7: ["reaction-type-cards", "reaction-type-key"],
	CHM8: ["concentration-and-ph-scenario-tables", "concentration-and-ph-key"],
	CHM9: [
		"molar-mass-and-stoichiometry-practice-set",
		"molar-mass-and-stoichiometry-key"
	],
	CHM10: ["advanced-topic-case-cards", "advanced-topic-case-key"],
	CHM11: ["capstone-evidence-seeds", "capstone-rubric"]
};

const itemSections: Record<string, [string, string]> = {
	"Safety and Remote Investigation Boundaries": [
		"investigation-safety-checklist",
		"safety-and-equity-checkpoint-key"
	],
	"Reading the Periodic Table": [
		"periodic-table-reference-comparison",
		"periodic-table-reference-comparison-key"
	],
	"Groups, Periods, Metals, Nonmetals, and Metalloids": [
		"periodic-table-reference-comparison",
		"periodic-table-reference-comparison-key"
	],
	"Valence Electrons and Reactivity Patterns": [
		"periodic-table-reference-comparison",
		"periodic-table-reference-comparison-key"
	],
	"Radioisotopes, Radiation, and Half-Life": ["isotope-table", "isotope-key"],
	"Ions and Charge": [
		"ion-and-formula-cards",
		"atomic-structure-checkpoint-key"
	],
	"Atomic Identity, Charge, and Nuclear-Change Gate": [
		"isotope-table",
		"isotope-key"
	],
	"Periodic Trend Evidence and Assessment Boundary": [
		"periodic-trend-mini-table",
		"periodic-trend-key"
	],
	"Molecular Shape and Polarity": [
		"lewis-structure-practice-set",
		"lewis-structure-key"
	],
	"Temperature, Thermal Energy, and Particle Motion": [
		"heating-curve-data",
		"heating-curve-key"
	],
	"Limiting Reactants and Leftovers": [
		"reaction-type-cards",
		"reaction-type-key"
	],
	"Stoichiometry with Limits and Reasonableness": [
		"stoichiometry-error-cases",
		"stoichiometry-error-key"
	],
	"Molarity as a Quantitative Concentration": [
		"molar-mass-and-stoichiometry-practice-set",
		"molar-mass-and-stoichiometry-key"
	],
	"Project: Concentration Investigation": [
		"concentration-and-ph-scenario-tables",
		"concentration-and-ph-key"
	],
	"Project: States of Matter Simulation Report": [
		"phenomena-case-library",
		"phenomena-case-library-key"
	],
	"Project: Molecule Shape Gallery": [
		"lewis-structure-practice-set",
		"lewis-structure-key"
	],
	"Project: Water Tension Experiment": [
		"phenomena-case-library",
		"phenomena-case-library-key"
	],
	"Project: Making Oobleck Case Analysis": [
		"phenomena-case-library",
		"phenomena-case-library-key"
	],
	"Project: Making a DIY Lava Lamp": [
		"phenomena-case-library",
		"phenomena-case-library-key"
	],
	"Project: Elephant Toothpaste Case Analysis": [
		"phenomena-case-library",
		"reaction-projects-key"
	],
	"Project: Making a Volcano Case Analysis": [
		"phenomena-case-library",
		"reaction-projects-key"
	],
	"Project: Making Invisible Ink Case Analysis": [
		"phenomena-case-library",
		"solutions-projects-key"
	],
	"Project: Solution Simulation": [
		"phenomena-case-library",
		"solutions-projects-key"
	],
	"Project: Separating Mixtures": [
		"phenomena-case-library",
		"solutions-projects-key"
	]
};

function viewer(asset: string) {
	return `/course-resource?asset=${encodeURIComponent(asset)}`;
}

export function preserveIntroChemistryTeaching(
	module: RawCourseModule
): RawCourseModule {
	const prefix = module.title.split(" ")[0];
	const fallback = moduleSections[prefix] ?? [
		"project-reference-index",
		"general-cer-rubric"
	];
	function preserve(
		item: RawCourseModuleItem,
		optional: boolean
	): RawCourseModuleItem {
		const override = itemSections[item.title];
		const input = override
			? `${pack}#${override[0]}`
			: item.datasetLink?.startsWith("/course-assets/chemistry/")
				? item.datasetLink
				: `${pack}#${fallback[0]}`;
		const response = override
			? `${answers}#${override[1]}`
			: item.solutionLink?.startsWith("/course-assets/chemistry/")
				? item.solutionLink
				: `${answers}#${fallback[1]}`;
		const background = item.datasetLink?.startsWith("https:")
			? `\n\n[Background reference](${item.datasetLink})`
			: "";
		return {
			...item,
			preserveInstructions: true,
			preserveAssignment: true,
			contentKind:
				optional || coreTasks.has(item.title)
					? "assignment"
					: "reading",
			datasetLink: input,
			solutionLink: response,
			content: `${item.content}\n\n[Case inputs](${viewer(
				input
			)})\n\n[Project self-check](${viewer(response)})${background}`
		};
	}
	return {
		...module,
		curriculum: module.curriculum.map(item => preserve(item, false)),
		supplementalProjects: module.supplementalProjects.map(item =>
			preserve(item, true)
		)
	};
}
