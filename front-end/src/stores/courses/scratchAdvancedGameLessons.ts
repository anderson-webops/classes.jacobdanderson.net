export const scratchFishFoodPlan = `### Fish Food rules

The arrow keys move the player fish. A fish smaller than Player Size can be eaten; an equal or larger fish ends the round. Each eaten fish adds 5 to Player Size and to the player's displayed size. The reference starts at size 20 and wins above 200, at size 205. The labels progress from Guppy to Goldfish above 40, Flounder above 80, Barracuda above 120, Bluefin Tuna above 160 and Leviathan above 200.

The supplied starter has artwork but no game scripts. Player and Food are initially hidden. Player is the controlled fish; Food is the hidden original that produces moving fish clones. The three message sprites contain the loss message, victory message and level-label caption. A version built from a blank project can use different artwork while keeping these roles.

### Build one playable round

1. On the green flag, put Player at (0, 0), show it, use left-right rotation and set its size and Player Size to 20. Set Player Level to Guppy and hide that monitor until the ending. Hide the three ending messages.
2. A forever loop on Player checks each arrow key. Point in that direction and move 10 steps when it is held. Four separate if blocks permit more than one held direction.
3. Hide the original Food sprite. In its flag script, create a clone of itself, wait 1 second and repeat. A when I start as a clone script shows that clone, chooses one of the two fish costumes and a color, and sets a random size from 5 to Player Size + 20.
4. Choose a side: start at x: -240 or x: 240, with random y from -180 to 180. Point across the stage and glide to the opposite x at the same y over 3–4 seconds. Delete the clone after crossing.
5. A second clone-start script repeatedly checks touching Player. Compare that clone's size with Player Size. For a strictly smaller fish, broadcast Ate Food and delete that clone, so one meal cannot score repeatedly. On Player, Ate Food increases both size values and updates the level label.
6. An equal or larger fish triggers the loss outcome. A size above 200 triggers victory. Both endings must finish their message changes before stopping the game.

The corrected reference uses a shared Round State with playing, won and lost values. Set playing on the flag. Process collisions and growth only while playing. Set won or lost before announcing an ending, so another collision cannot change an outcome already chosen. Broadcast and wait lets all ending-message receivers finish; stop all then ends movement and spawning. A stop-all block in the first loss-message receiver could prevent the other receivers from displaying their messages.

Check a smaller, equal-sized and larger collision separately. Restart after both endings: the position, size, level, phase, hidden messages and fresh clone stream must reset. The size monitor and visible fish should agree after every meal.

### Optional Platformer Pal: collision and level control

The supplied Pal, Key, Teleport In and Teleport Out sprites use three level backdrops. Green ground is #00cc44; brown pitfalls are #79654a. Use the color picker on the actual artwork. A level broadcast places Pal and Key, then starts that level's movement controller. The reference starts Pal at (-207, -109), (-204, 37) and (-187, 13), with keys at (205, 59), (212, 2) and (4, 126).

The move l/r custom block checks held arrows and changes x by 10 or -10. The stay on ground block repeatedly changes y by -5 until Pal touches green or brown. Brown must return control to the level script, which plays the fall sound, drops Pal and restarts that level. Stopping this script inside the custom block would terminate its caller and prevent recovery.

A jump can rise in 15 steps of 10 while still calling move l/r. If it touches green above, move down in small steps until it is outside the platform. Set a sprite-only Jump Blocked variable to 1, skip further ascent, then return to the level controller. Reset Jump Blocked to 0 at each new jump. This preserves the caller; stop this script is not a function-return block.

Collecting a key changes the backdrop and broadcasts the next level. End the previous level controller after a transition. Level 3 places Teleport In at (183, -28) and Teleport Out at (85, 147); contact with the first sends Pal to the second. The last key announces victory and hides game actors. Check ceiling contact, both pitfall recoveries, each key, the portals and a fresh flag restart using the actual backdrop colors.`;

export const scratchTreasureCavePlan = `### Treasure Cave rules and actors

Click the start button, then use the left and right arrows to explore. The Elf stays near the center while Cave and Treasure move in the opposite direction, creating the appearance of travel. Press i to show Inventory and o to hide it.

Contact with a chest pauses exploration and asks a question. A correct answer adds one random item to Inventory. Each wrong answer increases Wrong Answers. On the third wrong answer, empty Inventory and reset Wrong Answers to 0; exploration continues with a new chance to collect treasure. This is a continuing exploration game, rather than a fixed number of rounds.

The starter supplies artwork, sounds and a cave-scrolling example. The cave moves 5 steps opposite each held arrow and wraps between x: -240 and x: 240. The other actors need their own scripts. Their responsibilities are distinct:

- Button starts exploration and hides itself.
- Elf changes direction and switches between standing and walking costumes.
- Cave scrolls during exploration and stops for a question.
- Treasure waits, appears from one side, detects contact, asks a question and handles its result.
- Stage changes the background music for the current scene.

### Keep questions and answers aligned

Create Questions and Answers lists with the same length and matching positions. The reference pairs 19 - 11 with 8, 7 + 17 with 24, the shortest month's usual length with 28, a leap year's length with 366, and the number rhyming with store with 4. Store one random index in Question Num, ask item Question Num of Questions, then compare answer with item Question Num of Answers. Picking a second random index for the answer would compare unrelated entries.

The Treasures list contains the possible rewards. After a correct answer, store a random item from that list in Item, append Item to Inventory, open the chest costume and display the reward. Picking the reward once keeps the displayed item and stored item consistent.

### Coordinate a chest encounter

On the green flag, clear and hide Inventory, set Wrong Answers to 0, hide Elf and Treasure and show Button. A Start Game broadcast shows Elf and starts the exploration controllers. Treasure waits a random 2–5 seconds, chooses x: -256 or x: 256 at y: -128, uses its closed costume and appears.

Move the chest opposite the held arrows until it touches Elf. Broadcast Treasure challenge and wait. The Elf and Cave receivers stop their other movement scripts; Treasure picks and asks its question. Broadcast Correct or Wrong and wait for the reward or penalty handler to finish. Hide the chest, then broadcast Start Game to resume exploration and schedule another chest. The i/o key handlers can show and hide Inventory independently of the encounter.

Check that a correct answer adds exactly one displayed reward, a wrong answer adds none, the third wrong answer clears existing rewards, and the next question still works. Restart while a question is open and after collecting treasure; old prompts, movement and list contents must not remain.

### Optional Fruit Ninja: clones and a timed round

Move the mouse to control Blade. Contact slices ordinary fruit for one point. A bomb ends the round; three missed fruit also end it. The corrected reference uses a 60-second countdown, so reaching 0 ends the round even when no fruit is missed. The flag resets Score and Misses to 0, Timer to 60, the Dojo backdrop and the hidden end message.

The hidden original Fruit makes a clone every 2 seconds. Its probability list is [1, 1, 1, 2, 3, 3, 3, 4, 4, 4]. Choose a random list index from 1 to 10: costume 2 is the bomb, with probability 1/10; costumes 1, 3 and 4 are fruit, each with probability 3/10. This is weighted selection, not a uniform choice among the four costumes.

Each clone needs its own Fruit Kind variable, created for this sprite only. Set it from the chosen list item and use it both to select that clone's costume and to decide its collision/miss behavior. A shared costume variable lets a later clone turn an earlier fruit's rules into bomb rules even though its picture has not changed.

A clone starts at random x between -200 and 200, y: -170, glides up to a random peak over 0.5 seconds, waits 0.1 seconds and falls by changing y by -5. One clone-start script moves it; another watches for Blade contact. A sliced fruit adds 1 and deletes itself. Fruit falling past the lower line adds one miss and deletes itself; an untouched bomb adds no miss. Bomb contact plays the explosion effect and ends the game.

The game-over check uses Misses > 2, covering any value of at least 3. The countdown waits 1 second and decreases Timer by 1 for 60 repetitions before announcing Game Over. The end receiver shows the message, changes to Rays and stops all scripts. Verify fruit and bomb clones present together, one score or miss per clone, the third miss, a bomb slice, timeout and a fresh restart. Keep animation timing and collision behavior visible during the final play check.`;
