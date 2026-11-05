import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";

const readings: Record<string, string> = {
	"GS1 Event Listeners and Movement": `
A Scratch project contains a stage and sprites. Select a sprite before editing
its code, costumes or sounds: a script belongs to the selected target. The
stage supplies backdrops; sprites supply characters and objects. A costume
changes a sprite's appearance without creating a different sprite.

## An event starts a script

An event is something the project can respond to, such as clicking the green
flag, pressing a key or clicking a sprite. A hat-shaped event block starts a
stack. The blocks attached beneath it describe the response, in order. A
motion block sitting by itself does not become a keyboard control.

For Dragonfly, build three separate stacks on the dragonfly sprite:

~~~text
when green flag clicked
go to [random position]

when [space] key pressed
start sound [choose the dragonfly's pop sound]

when this sprite clicked
say [Buzzzz] for (2) seconds
~~~

The sound menu lists sounds on that sprite's Sounds tab. Choose its actual
sound name; square brackets in this written example describe menu choices,
not text to type into a new block. The three hats let each action start
independently. Pressing space does not also run the sprite-click stack.
The green flag starts every green-flag stack in the project, not just the one
currently visible in the code area.

## Movement and a dependable start

The stage center is x = 0, y = 0. Increasing x moves right; decreasing x moves
left. Increasing y moves up; decreasing y moves down. A direction of 90 points
right, 0 points up, -90 points left and 180 points down. A move-steps block
follows the sprite's current direction; change-x and change-y blocks move along
the corresponding stage axis.

An arrow-key control attaches change x by 10 to a right-arrow event.
Its left-arrow partner changes x by -10. This pair stays horizontal even
after a costume or direction changes. For the Spinner choice, use point in
direction because the objective is to change heading rather than position.

A reset restores state that earlier runs changed. If an activity changes size,
color or backdrop, put the desired initial values in its green-flag setup.
Test each event separately, change the sprite's state, then start again.
Explain which block caused each visible result before adding another effect.
`.trim(),
	"GS2 Loops": `
A loop runs its enclosed blocks more than once. Repeat has a count and then
continues with the block below it. Forever keeps cycling until its script or
the project is stopped. Blocks outside the loop run only when execution reaches
them. A wait inside the loop pauses every repetition; a wait below the loop
pauses only after that loop finishes.

## Trace a shape before drawing it

In Mouse Shape Loops, add the Pen extension to draw as the sprite moves. Pen
down makes later movement leave a line. Pen up allows repositioning without
drawing. Erase all clears existing pen marks; it does not return the sprite to
the center or restore its direction.

For a repeatable triangle, put this stack on the drawing sprite:

~~~text
when [1] key pressed
pen up
go to x: (0) y: (0)
point in direction (90)
pen down
repeat (3)
  move (60) steps
  turn clockwise (120) degrees
pen up
~~~

The turn is the outside turn, not the triangle's 60-degree inside angle.
Three turns of 120 degrees make a full 360-degree turn. The sprite travels
three equal sides and returns to its starting position and heading. A square
uses four equal sides and a 90-degree turn. Repeating move 5 and turn 10
thirty-six times makes a 36-sided approximation of a circle, not a perfectly
curved path. Keep the shape small enough to fit on the stage.

Give the green flag its own reset stack: erase all, pen up, go to the center
and point right. Predict how changing only the repeat count would change the
triangle. Two repeats leave an open path; three repeats close it. Changing the
side count also requires a matching turn if the goal is a regular polygon.

## Repetition over time

For the Elephant choice, repeat 10 with change size by 10 adds 100 percentage
points to its current size. It does not multiply its size by ten. Restore a
known size with the green flag before comparing runs.

A blinking loop needs time in both states: forever, hide, wait 1 second, show,
wait 1 second. Without the second wait, the visible state lasts almost no time.
Click Stop to end a forever loop, then restart cleanly when comparing changes.
In the music choice, identify the repeated E-D-C group and the four repeated
C and D notes before deciding which blocks belong inside each repeat.
`.trim(),
	"GS3 Conditionals and Variables": `
A variable stores a value that can change while a project runs. Set replaces
the current value; change adds an amount to it. A click counter needs set
Clicks to 0 at the start and change Clicks by 1 for an accepted click. Setting
Clicks to 1 on every click would keep the score at one.

## Separate setup, play and finish

The Button Click Timer game needs three variables: Clicks, Seconds left and
Playing. Choose for-all-sprites variables if several sprites need the same
values. Playing is a state flag: use 0 when the button is inactive and 1 while
clicks count. A conditional, if then, runs its enclosed blocks only when its
Boolean condition is true at that moment.

The original button already has event, costume and sound blocks. Extend those
stacks with the variables and conditional. Its green-flag stack can establish
the full round:

~~~text
when green flag clicked
set [Playing] to (0)
set [Clicks] to (0)
set [Seconds left] to (10)
show
say [Ready...] for (1) seconds
say [Set...] for (1) seconds
say [Go!] for (1) seconds
set [Playing] to (1)
repeat (10)
  wait (1) seconds
  change [Seconds left] by (-1)
set [Playing] to (0)
hide
~~~

In a separate when-this-sprite-clicked stack, put if Playing = 1 around change
Clicks by 1 and the pressed-costume/sound feedback. Clicks during Ready, Set
and Go then leave the score unchanged. The guard also protects the finish
state; hiding a sprite alone does not explain when the score may change.
Restore the button's resting costume on a fresh start and after brief feedback.

Seconds left is an ordinary variable, distinct from Scratch's built-in timer
reporter. Ten one-second waits give a simple countdown, but scheduling and
rendering can make its wall-clock duration slightly longer than ten seconds.
Use elapsed time for a game that requires precise timing. For this first
model, predict the values after three waits: Seconds left = 7 and Playing = 1.
At the end they are 0 and 0.

## Reset and check a changed case

Try clicking during the countdown introduction, during play and after the
button hides. Then click the green flag again. The button should reappear and
both counters should return to their initial values. This second round checks
reset behavior that one successful first run cannot show.

In the Zebra choice, update Steps in the same movement event that changes the
costume. In Crab Catching, check touching the crab inside the falling loop,
increase Score once for a catch, then reposition the puff at the top so that
one contact does not earn a point on every loop cycle.
`.trim(),
	"GS4 Master Project": `
A playable game connects an action, a rule and visible feedback. A player
needs a control they can use, an objective they can recognize and a clear
result. Artwork and sound can strengthen that loop after it works.

## Choose one minimum playable loop

Compare the original Spider Smash, Hungry Shark and Save the Princess
directions in Game Selection. Choose one. Describe what the player does,
which object responds and how the project decides success or failure.
For a small catching-game design, the player moves a catcher, an object falls,
and a successful catch changes Score and resets that object. That sequence is
the minimum playable loop; extra levels and additional characters can wait.

Write three states: setup, playing and finished. A green-flag script sets
Score to 0, restores starting positions and costumes, shows the necessary
sprites and enables play. An end condition disables play and displays the
result. A variable such as Playing lets other scripts check whether their
actions are currently allowed.

## Connect the blocks to the rule

Events start controls and setup. Loops keep movement or collision checks
running. Conditionals choose a response. Variables remember score, time or
state. Broadcasts can notify other sprites about a change, but the message
does not set their positions or scores by itself: each receiver needs its own
response.

Consider the falling object's decision inside a forever loop:

~~~text
if <(Playing) = (1)> then
  change y by (-5)
  if <touching [Catcher]?> then
    change [Score] by (1)
    go to x: (pick random (-180) to (180)) y: (160)
  if <(y position) < (-160)> then
    go to x: (pick random (-180) to (180)) y: (160)
~~~

Use the actual catcher sprite's name in the touching menu. Here a miss resets
the object without changing Score; a catch adds one point before resetting it.
The chosen positions and sprite sizes must keep the reset object away from the
catcher. Otherwise it could be caught again immediately. Add a separate win
rule, such as ending the round when Score reaches 5, and have the movement
scripts honor the finished state.

## Test a whole round and a restart

First verify one input and one response. Then test a miss, a catch, the end
condition and another input after the game ends. Finally restart after changing
score, positions and appearance. List every value that must return to its
initial state. A working restart is part of the game, not just preparation for
the next test.

Keep a saved project, a short controls/objective note and one observed change
made after testing. Explain a real example of how an event, loop, conditional
and variable cooperate in your game. Download the edited .sb3, reopen that file
and try the same round before treating the saved copy as complete.
`.trim()
};

export function applyScratchBootcampReadings(
	course: RawCourse,
	source: RawCourse
) {
	for (const original of source.modules) {
		const module = course.modules.find(
			item => item.title === original.title
		);
		const item = module?.curriculum.find(item =>
			item.title.startsWith("Concepts:")
		);
		const content = readings[original.title];
		const flow = original.curriculum[0]?.content.match(
			/\*\*Course flow:\*\* [\s\S]+$/
		)?.[0];
		if (!module || !item || !content || !flow) {
			throw new Error(
				`Missing Scratch Bootcamp reading: ${original.title}`
			);
		}
		item.content = formatAuthoredReading(`${content}\n\n${flow}`);
		item.contentKind = "reading";
		item.preserveInstructions = true;
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const project of original[section]) {
				if (!project.content.startsWith("**Project goal:**")) continue;
				const task = module[section].find(
					item => item.title === project.title
				);
				if (!task) {
					throw new Error(
						`Missing Scratch Bootcamp task: ${project.title}`
					);
				}
				task.content = formatAuthoredAssignment(project.content);
				task.contentKind = "assignment";
				task.preserveInstructions = true;
				task.preserveAssignment = true;
			}
		}
	}
}
