export const inventoryRevision = "5647ce247101d3a537c3d8b79a6525e6fbb66ed5";
export const inventoryPacks = {
	"CPPI3-Inventory-Indexer/starter": {
		"main.cpp": "0a0d0c1456469b053f77ef622d7cf72d747688ea2b838e7118508f1ebc173a1e"
	},
	"CPPI3-Inventory-Indexer/solution": {
		"main.cpp": "cbf02937e334f38c19b5d679bddba2981a3dcd6f2f3af297e44fbe4dbb593f41"
	}
};
export const inventoryCases = [
	{
		rows: [
			[
				7,
				"beta",
				"tools",
				2
			],
			[
				2,
				"alpha",
				"tools",
				0
			],
			[
				9,
				"alpha",
				"lab",
				3
			]
		],
		duplicate: [
			7,
			"replacement",
			"ghost",
			99
		],
		category: "tools",
		suppliers: [
			[
				2,
				"Second"
			],
			[
				7,
				"First"
			]
		],
		from: "tools",
		to: "lab"
	},
	{
		rows: [],
		category: "missing",
		suppliers: [
			[
				8,
				"Unused"
			]
		],
		from: "missing",
		to: "new"
	},
	{
		rows: [
			[
				5,
				"same",
				"lab",
				1
			],
			[
				3,
				"same",
				"lab",
				0
			]
		],
		category: "lab",
		suppliers: [
			[
				5,
				"Known"
			]
		],
		from: "lab",
		to: "lab"
	},
	{
		rows: [
			[
				0,
				"Zed",
				"",
				-1
			],
			[
				-1,
				"Able",
				"Mixed",
				2
			]
		],
		category: "",
		suppliers: [
			[
				-1,
				"Other"
			],
			[
				0,
				"Zero"
			]
		],
		from: "",
		to: "Mixed"
	},
	{
		rows: [
			[
				6,
				"only",
				"solo",
				1
			]
		],
		category: "absent",
		suppliers: [],
		from: "absent",
		to: "ghost"
	}
];
