// Explicit corrections to the archived catalog, verified against the linked
// JuniLearningScratch programs and published instructions. Unlisted projects
// retain their archived instructions.
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
	},
	{
		courseId: "scratch-level-1",
		title: "Project 2 – Fortune Teller",
		projectId: "297744913",
		solutionId: "297735619",
		baselineContentSha256:
			"1d22348d99a8202af2ecaf57d50814b23bee55b1464089a60cb4748dee263c51",
		publishedInstructionsSha256:
			"a7bc68ec9ada8b383503e4219dad5690def817a74ffc1b742a951b176b68beaf",
		content: `Make the wizard hat tell a different fortune for each number.

1. When the hat is clicked, use ask and wait to request a number between 1 and 5.
2. After the answer arrives, start the Magic Spell sound and make the hat spin twice. A full turn is 360 degrees.
3. Compare answer with each number from 1 to 5 and show a different fortune for each match. Use the answer before asking another question.
4. Show a message when the number is outside that range.

Optional: add more fortunes or a second question.`
	},
	{
		courseId: "scratch-level-1",
		title: "Project 3 – Number Guesser",
		projectId: "295334181",
		solutionId: "294561252",
		baselineContentSha256:
			"2383a99d5196abfe41c08ffbb98e7efa655579785292c808e8c04cbdf2e99de1",
		publishedInstructionsSha256:
			"8004f5d279fa95ad406e7a30694cb9ea5e80212b6f7228a15ca95e8e5aae324a",
		content: `Help Giga give hints until the correct number is guessed.

1. Choose a target between 1 and 100. The supplied reference uses 51.
2. On the green flag, ask for a guess using ask and wait.
3. Compare answer with the target. If it is smaller, say "Too low!"; if it is larger, say "Too high!".
4. After an incorrect guess, ask again. Keep the target unchanged during these retries.
5. When the answer matches, celebrate with a costume, message and sound, then stop the game.

Optional: store a randomly chosen target in a variable before the first question, or count guesses.`
	},
	{
		courseId: "scratch-level-1",
		title: "GS7 Supplemental Project 1 – Animal Crossing",
		projectId: "328309551",
		solutionId: "328310531",
		baselineContentSha256:
			"5fe7ed1f01bc2ceced3939d80a29e017e6b14f449624dc68cf7ca9a235dd1b24",
		publishedInstructionsSha256:
			"319ca450cc1b4d0fc676f99dda3fa04bf3b7be5d460ac1f697df0f4c51541b92",
		content: `Choose an animal costume for a changing environment.

1. The starter provides backdrops named "1", "2" and "3". Pick a random number from 1 to 3 and use it to switch the backdrop.
2. Reset the sprite to its Abby-a costume, then ask which animal belongs there.
3. Compare answer with "dinosaur", "jellyfish" and "giraffe". Switch to the corresponding supplied costume when a name matches.
4. Explain when an answer is not one of the available animals.
5. Wait two seconds, choose another random backdrop and repeat the question.

Optional: also check whether the chosen animal matches the environment, using the backdrop name as a second condition.`
	},
	{
		courseId: "scratch-level-1",
		title: "GS7 Supplemental Project 2 – Space Cadets",
		projectId: "328310783",
		solutionId: "328308418",
		baselineContentSha256:
			"e7051efdaba34e980e33fe3655ec5a007756a5dfb63f092b2d6da90d00f92122",
		publishedInstructionsSha256:
			"b6f42f3e8603c98f6a0cc71d9425990422a067e06f30fa9d1519008f976071a2",
		content: `Move Dot to the place named in an answer and look for Spot.

1. On the green flag, send Spot randomly to one of the three destination sprites. They are named "1" for Star, "2" for Saturn and "3" for Earth. Put pick random 1 to 3 into the Motion go to input.
2. Start Dot at (0, 0) and ask "Where is Spot?".
3. Compare answer with "Earth", "Saturn" and "Star". Move Dot to sprite "3", "2" or "1", respectively.
4. For another answer, explain that the place is unknown and stop that question script.
5. In a separate green-flag forever loop on Spot, check whether it is touching Dot. When it is, have Spot say "Hi Dot!".`
	},
	{
		courseId: "scratch-level-1",
		title: "GS8 Supplemental Project 1 – Quadrant Practice",
		projectId: "329289426",
		solutionId: "329283944",
		baselineContentSha256:
			"b0e98ac2156c5b09bae179671f2d297e03612cc0f881392d140d4bdc4a42360b",
		publishedInstructionsSha256:
			"05597c7688fb56809a9a8c764258156c66fe9d5b084a35bc916f75ae4c4b5723",
		content: `Use the grid and the signs of x and y to describe the cat's position.

1. On the green flag, make Scratch the Cat follow the mouse pointer forever.
2. In that loop, use if and operator blocks to say "I'm in the top right!" when x is greater than 0 and y is greater than 0.
3. Add the other three cases: x less than 0 and y greater than 0 for top left; x greater than 0 and y less than 0 for bottom right; x less than 0 and y less than 0 for bottom left.

Optional: try arrow-key controls or add obstacles.`
	},
	{
		courseId: "scratch-level-1",
		title: "GS8 Supplemental Project 2 – Coordinate Drawings",
		projectId: "329294838",
		solutionId: "329290359",
		baselineContentSha256:
			"61080d36adf0d0b3049e4e0e425f719fdf7eac92ba021043ff325e937bac063c",
		publishedInstructionsSha256:
			"9ca33d08ea39528dd6f90fad3ab77b1d641f941f05afd2fd1e3b4828304bea84",
		content: `Recreate the drawings on the supplied grid backdrops with the Pen extension and x/y coordinates.

1. Look through the backdrops and choose a drawing to reproduce.
2. Lift the pen before placing the pencil at a starting coordinate, then lower it to begin the outline.
3. Use go to x/y and change x/y blocks to trace the drawing's corners and lines.
4. Try another supplied drawing and compare the result with its backdrop.

Optional: ask for coordinates so the user can choose points, or draw initials.`
	},
	{
		courseId: "scratch-level-2",
		title: "GM2 Supplemental Project 3: Rainbow Flower",
		projectId: "335808333",
		referenceSourceSha256:
			"2203067efcdda7093a077273cc6a5863421711248f09f402919d760a2d855dff",
		reason: "The reference repeats six petals; a seventh retraces the first orientation.",
		solutionId: "335807180",
		baselineContentSha256:
			"45ecf208549022fa7d54b5bea8f4a9489b6353cfcacbf7accfb5eb36904cc0e4",
		publishedInstructionsSha256:
			"b0e10aad197fc295730ac79c0cfd66825c9ac1b7a9fed7d4542eb85f2f2da0fc",
		content: `Draw a rainbow flower.

1. When the green flag is clicked, make the pencil sprite go to the center of the screen and put the pen down.
2. Start by programming a circle. Experiment with changing the turn amount and increasing it on each step. Use a variable to track the angle and increase it by 1 each time through the loop.
3. After experimenting, set the angle to 0 degrees and repeat 40 times to draw one spiral-shaped petal.
4. Draw the other five (six petals total), starting each petal at the center and moving outwards.
5. Change the pen color after each petal to make a rainbow-colored flower.`
	},
	{
		courseId: "scratch-level-2",
		title: "GM7 Project 2: List Practice",
		projectId: "315090026",
		solutionId: "315051160",
		baselineContentSha256:
			"952319acd98ef7201af1763f2ab4477a428dbd86008cb03546f0b9974b56709e",
		publishedInstructionsSha256:
			"57da55bf936de1cb2b769b4da8f15a20dc1aa527011bbc7ad5d63d18ee9a5b72",
		content: `1. When the spacebar is pressed, make the cat ask, “What number do you want to add to the list?” Add the number the user enters to the list.
2. When the green flag is clicked, delete everything in the list.
3. When the 1 key is pressed, program the cat to read the list normally, saying each number in the list for 1 second.
4. When the 2 key is pressed, program the cat to read each number in the list doubled.
5. When the 3 key is pressed, program the cat to read the list backwards.
6. When the 4 key is pressed, program the cat to read each number and then whether the number is odd or even (e.g.: “1, Odd, 14, Even,...”).

Optional:
- Say every other number in the list.
- Say every number in the list, multiplied by 10.
- Say each number and then turn that many degrees to the right.
Finally, share the project!
View CS Training's Code`
	},
	{
		courseId: "scratch-level-2",
		title: "GM7 Supplemental Project 2: Wheel of Fortune",
		projectId: "340691786",
		solutionId: "342643080",
		baselineContentSha256:
			"c37431d6a9a45435c537027a7bd30b100b0dc04353f287f88c46f3126f2b4575",
		publishedInstructionsSha256:
			"95fdc4295c5583e4bda6cbedf6a484c8140d0da96d2489f027c9e5302fbb736c",
		content: `Welcome to the Wheel of Fortune! In this game, the user has a certain number of guesses to guess every letter of the secret word.
1. Construct a word bank using a list, from which the computer will choose a random word of at the beginning of each game.
2. Once the secret word is decided, add all the letters of the word to a new list and count the total number of unique letters in the word. Use this variable to keep track of the total number of letters the user needs to guess correctly. As you are adding the letters, make sure you don't add the same letter twice.
3. Ask the user to guess a letter. If they guess a letter that is in the secret word (and they have not already guessed this letter), add this letter to the guess list and update the variable you are using to keep track of how many correct guesses the user has made.
4. Allow the user a certain number of guesses to win the game (for example, the length of the word, plus 5).
5. The user wins the game if they have correctly guessed all of the letters in the word, and they lose if they run out of guesses!`
	},
	{
		courseId: "scratch-level-2",
		title: "GM8 Supplemental Project 1: Extra Functions",
		projectId: "339918479",
		solutionId: "339602908",
		baselineContentSha256:
			"bf976ca2a8e1f048f12c1ed014a0cffe6afdf3b5dba042ce930fbcdbc2d22c5e",
		publishedInstructionsSha256:
			"8f8919c6e9d0eff8965031ca63375996f6cc921975aa79723ddc7471d9637082",
		content: `1. Write a function that draws a shape! It should take in as input the number of sides and the size of each side. To calculate how many degrees to turn after drawing each side, use 360 divided by the number of sides.
2. Write a function that takes in a starting number and an ending number, and make the function count from a starting number up to (and including) an ending number. (Challenge: If the ending number is smaller than the starting number, make it count down from the starting number.)
3. Write a function that takes in two numbers and reports the result of addition, subtraction, multiplication, and division with the two numbers. (Challenge: calculate the average of the two numbers as well.)
4. Write a function that takes in a number and says the first 10 multiples of that number. (Challenge: take in a number of multiples as another input, and say that many multiples of the number.)
5. Call each of these functions with inputs of your choice when the 1, 2, 3, or 4 key is pressed!`
	}
] as const;

export const juniScratchInstructionsVerifiedOn = "2026-11-05";

export function findJuniScratchInstructionCorrection(
	courseId: string,
	title: string
) {
	return juniScratchInstructionCorrections.find(
		correction =>
			correction.courseId === courseId && correction.title === title
	);
}

export function correctedJuniScratchInstructions(
	title: string,
	courseId = "scratch-level-1"
) {
	const correction = findJuniScratchInstructionCorrection(courseId, title);
	if (!correction)
		throw new Error(`Missing verified Scratch instructions: ${title}`);
	return correction.content;
}
