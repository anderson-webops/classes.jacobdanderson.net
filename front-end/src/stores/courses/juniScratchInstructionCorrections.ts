// Explicit corrections to the archived catalog, verified against the linked
// JuniLearningScratch starters. Unlisted original projects remain unchanged.
export const juniScratchInstructionCorrections = [
	{
		courseId: "scratch-level-1",
		title: "Project 1 – Bug Eater",
		projectId: "297831461",
		solutionId: "297828061",
		baselineContentSha256:
			"14f12acb5f2d1ea3fb1dc17438a4b5b5661642197b6a9832e3bbcd0a0419ea77",
		publishedInstructionsSha256:
			"1f492a7c3aea4e1acfe0b9c87eaa2073473474b52f3e747f83096528061b025d",
		content: `Use the frog's answers to explore the stage coordinates.

1. Start with the green flag and ask the user for an X coordinate.
2. Use that answer as the frog's x position.
3. Ask for a Y coordinate next, then use the new answer as the frog's y position.
4. Repeat both questions so the user can keep moving the frog.
5. Add a collectible sprite, such as a bug or fruit.
6. When the frog touches the collectible, move that sprite to a random position and play the chomp sound.`
	},
	{
		courseId: "scratch-level-1",
		title: "Project 2 – Cake Chaser",
		projectId: "299085513",
		solutionId: "297843021",
		baselineContentSha256:
			"e6de897b8d56f1e865f1ca5d84d8cac129c4e630cb921a0cf9cfb984bfc7a666",
		publishedInstructionsSha256:
			"cff2db4a123dfc400bd7d25adab031c693a8e0e26cf933595ad00ed29e8849fe",
		content: `Keep the cake away from the beetle by controlling its coordinates.

1. Move the cake horizontally with the left and right arrow keys, changing x by 10 in the appropriate direction.
2. Move it vertically with the up and down arrow keys, changing y by 10 in the appropriate direction.
3. On the green flag, return the cake to the center of the stage.
4. Start the beetle in a corner. Keep making it point toward the cake and move forward.
5. Stop the game when the beetle catches the cake.`
	},
	{
		courseId: "scratch-level-1",
		title: "Project 3 – Talent Show",
		projectId: "295339505",
		solutionId: "295340057",
		baselineContentSha256:
			"4a87b79804527c28a1cb77aecaaa3233ebfe5e4815cd79e82724406c78329de7",
		publishedInstructionsSha256:
			"d705245be4d08be21e5a411e8958308896e015af70c68c0420be34c79957977d",
		content: `Let the user choose which talent the cat performs.

1. Ask the user which talent the cat will perform.
2. For the answer "speak", have the cat say something.
3. For "song", have the cat play music.
4. For "spin", have the cat turn in place.
5. For "draw", have the cat draw a design with the pen.
6. For "corners", have the cat glide to all four corners of the stage.
7. For an unrecognized answer, have the cat explain that it does not know that talent yet.
8. Keep asking and performing talents until the user answers "stop".`
	},
	{
		courseId: "scratch-level-1",
		title: "Project 3 – Beetle Artist",
		projectId: "288003770",
		solutionId: "287999903",
		baselineContentSha256:
			"5952f23021f9ca5688244e1ae0a4eb8be21d8326408d908221ebecd0da65a05f",
		publishedInstructionsSha256:
			"24a5325bdda5bff958468e4a9d713372330b285544ca800b8aa6fc140ce603e2",
		content: `Use keyboard events to move the beetle and draw shapes.

1. Make each arrow key move the beetle 10 steps in that key's direction.
2. On the green flag, clear the drawing, return the beetle to the center facing right, and reset the pen size and color.
3. Use "1" to draw a square with movement and turns.
4. Use "2" to draw a triangle.
5. Use "3" to draw an arrow shape.
6. Try tracing the shapes shown on the other backdrops.`
	},
	{
		courseId: "scratch-level-1",
		title: "Project 1 – Speed Click",
		projectId: "299327014",
		solutionId: "299311602",
		baselineContentSha256:
			"21e9364efeae175d8f919fe3a58c6d53aea6baad6f499f02b4aedc3a430cc213",
		publishedInstructionsSha256:
			"0f070b71e18f7509ec1259c1b3dc8d5a78f9d10e8c77249a503d5b5ffcad0549",
		content: `Count how many times the user can click the button in 10 seconds.

1. Keep the click count in a variable. Each button click adds one.
2. A click also changes the button to its pressed costume and plays a sound.
3. Keep the remaining time in a separate variable.
4. Before the countdown, say "Ready...", "Set...", and "Go!" for one second each.
5. Count down from 10 to 0, reducing the timer once each second.
6. Hide the button when time runs out so the user cannot keep clicking it.
7. Show the button again and reset the click count when a new game starts.`
	},
	{
		courseId: "scratch-level-1",
		title: "Project 2 – Spider Smash",
		projectId: "299272518",
		solutionId: "299094220",
		baselineContentSha256:
			"0bca820a9af1d0b23d0cfeee15ecd5ee031895d5d28b32cd5c592bbcd4091d47",
		publishedInstructionsSha256:
			"93edbeba03e0e59872e8b84d08a0aaa231fcedd308135a0a1662307f225888d4",
		content: `Build a timed hammer-and-spider game and earn as many points as possible in one minute.

1. On the green flag, make the hammer follow the mouse pointer continuously.
2. While the mouse button is pressed, switch the hammer to its smash costume and play the whoosh sound.
3. Make the spider move to a random position every two seconds.
4. Award a point only when both conditions are true: the mouse button is pressed and the spider is touching the hammer.
5. After a successful smash, move the spider to a new random position and play the crunch sound.
6. Add a one-minute timer and end the game when time runs out.`
	},
	{
		courseId: "scratch-level-1",
		title: "GS9 Supplemental Project 1 – Counting Steps",
		projectId: "327635693",
		solutionId: "327634746",
		baselineContentSha256:
			"1c993af3a6ee59b54095fc1b164322e4fb41ee8df2c3f10727db16014181323f",
		publishedInstructionsSha256:
			"700002f6be108f6db6355944adda0531d05afaa268e0883b7f2e3a1cd4324023",
		content: `Use the zebra's movement to count steps.

1. Create a variable named "Zebra Steps" and set it to 0 on the green flag.
2. Make the right arrow point the zebra right and move it 10 steps. Make the left arrow point it left and move it 10 steps.
3. Switch to the next costume on each movement so the zebra appears to take a step.
4. Increase Zebra Steps by 1 for each movement and display the count on the stage.

Optional: add obstacles and a goal to reach.`
	},
	{
		courseId: "scratch-level-1",
		title: "GS9 Supplemental Project 2 – Hungry Crab",
		projectId: "327610777",
		solutionId: "327610727",
		baselineContentSha256:
			"cf78095187f06ad43333dc943585b3094053328a9a14dd9da87100cf7d3ebacb",
		publishedInstructionsSha256:
			"32a8b5250308ab426c1614e15589d179c62c99644eeb6ee02cfe74dc129598ec",
		content: `Help the crab catch falling cheesy puffs and count how many it eats.

1. Use the left and right arrow keys to move the crab across the stage.
2. On the green flag, place the cheesy puffs at a random x position near the top of the stage. Choose x with pick random and keep y at the chosen top position.
3. Make the puffs fall continuously by decreasing y. A larger downward change makes them fall faster.
4. When the puffs reach the lower part of the stage, return them to a random x at the top.
5. Create a variable named "Puffs Eaten" and set it to 0 on the green flag. Increase it by 1 when the crab touches the puffs.
6. Change the crab's costume and play its Chomp sound to show it eating, then restore the resting costume.

Optional: add a timed round that ends and reports the total.`
	},
	{
		courseId: "scratch-level-1",
		title: "GS9 Supplemental Project 3 – Lunch Money",
		projectId: "327607937",
		solutionId: "327607840",
		baselineContentSha256:
			"e4cc1d276ffe06436686b280553dcee393c324aaeed1f6d81377730f07a46bd3",
		publishedInstructionsSha256:
			"85c2141cacf25ff5133406eb5ddfddf5941ed7332659070abde13cce7a32d5e0",
		content: `Track a lunch budget while choosing items from this menu: donut $2, pizza $4, taco $3 and apple $1.

1. Ask how much lunch money is available and store the answer in a variable named "Lunch Money".
2. Repeatedly ask for one menu item or the word "done".
3. Before each purchase, compare the balance with that item's price. If the balance is too small, show a message and leave the balance unchanged. Otherwise, subtract the price.
4. After a purchase, report how much money remains.
5. Stop when the answer is "done". If the balance reaches 0, say that the money has run out and stop.

Optional: use join to show the message and remaining amount in one speech bubble.`
	}
] as const;

export const juniScratchInstructionsVerifiedOn = "2026-10-04";

export function findJuniScratchInstructionCorrection(
	courseId: string,
	title: string
) {
	return juniScratchInstructionCorrections.find(
		correction =>
			correction.courseId === courseId && correction.title === title
	);
}

export function correctedJuniScratchInstructions(title: string) {
	const correction = findJuniScratchInstructionCorrection(
		"scratch-level-1",
		title
	);
	if (!correction)
		throw new Error(`Missing verified Scratch instructions: ${title}`);
	return correction.content;
}
