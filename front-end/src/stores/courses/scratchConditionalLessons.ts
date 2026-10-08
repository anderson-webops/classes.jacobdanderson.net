import type { RawCourseModuleItem } from "./types";

export const dinoColorsLesson: RawCourseModuleItem = {
	title: "Dino's Colors: Sampling and Boundary Decisions",
	content: `
**Concept focus:** Sample scene colors, repeat a true-or-false check, and choose a predictable result when a costume overlaps more than one region.

### Follow the pointer and test a real color

Open the starter from the Dino's Colors project below and select **Dinosaur4**. The colored regions are part of the backdrop; they do not need to become separate sprites. Build one stack: **when green flag clicked → forever → go to mouse-pointer**. Blocks inside the forever block run repeatedly, so the dinosaur keeps following a moving pointer. Blocks underneath the forever block will never be reached.

1. Drag **touching color?** from Sensing into the hexagonal condition of an **if then** block. Put the if block inside forever, after go to mouse-pointer.
2. Click the color swatch in touching color?, choose the eyedropper, and click well inside the red region on the stage. Sampling the actual backdrop is more reliable than trying to match its hue by eye. Avoid a region's edge, the dinosaur, and its speech bubble when sampling. Move the dinosaur away or stop the project first if it covers the sample area.
3. Inside the if block, add the Looks block **say [I'm in red!]**. Use say without a duration so following the pointer is not paused while a timed speech block finishes. The say block must sit inside the if opening: that indentation means it runs only when the condition is true.
4. Click the green flag and move well inside red, then away from red. The condition checks the dinosaur's visible costume against the scene, rather than checking only the pointer's center. Add separate sampled checks and messages for yellow and blue. Test each away from all boundaries before adding grey.
5. Add grey as the fourth color for the completed project. Grey is part of the original requirement, even when an initial practice session stops after red, yellow, and blue.

An if block checks once each time the program reaches it. The forever loop supplies repeated checks; touching color? is a true-or-false question, not an event that starts a new stack. If a color never matches, resample its clear interior, check the selected sprite, and check that the if block is inside forever.

### Decide what happens at a boundary

A wide costume can touch two regions at once. With separate if blocks, both conditions can be true in the same pass. Each matching say replaces the speech bubble, so the **last matching check wins**. A grey border is not automatically preferred over a neighboring color.

Choose and write a priority before testing. For example, **red before yellow before blue before grey** means red wins whenever it is among the touched colors. To implement that policy with separate if blocks, put the checks in the opposite order: **grey, blue, yellow, red**. The most important match runs last. Another written priority is valid if the checks and observed result agree with it.

At the beginning of each pass, after go to mouse-pointer and before the color checks, add **say []** with an empty message. This clears an old message when no sampled color matches. Do not put an empty say after every false condition: a later false check would erase an earlier true result.

In the next module, if then else can express the same decision as one nested chain: check red; in its else check yellow; in that else check blue; then grey; finally an empty say. That chain chooses the first matching branch. Use either a deliberate sequence now or the later chain, and explain which ordering gives the chosen winner.

### Check the behavior together or independently

Test the interior of all four regions, a grey/color border, a boundary between two colors, and a place matching none of the sampled colors if the backdrop provides one. Record the touched colors, predicted winner, and observed message. Repeat a boundary test after changing costume or size; the overlap may change. Stop and restart, then verify that the dinosaur follows the pointer and uses the same rule again. A walkthrough partner can predict before the driver runs each case, then swap roles.
`
};

export const noisyReactionsLesson: RawCourseModuleItem = {
	title: "Noisy Reactions: Conditions and Sound Order",
	content: `
**Concept focus:** Nest a reaction inside its condition and distinguish starting a sound from waiting for that sound to finish.

### Put each reaction in its own sprite

Open the Noisy Reactions starter below. Its sprites are **Ball, Bell, Chick, Cloud, and Lightning**. Select a sprite before building its stack. The starter includes bell toll on Bell, Chirp on Chick, and Thunder Storm on Lightning; select the actual sound name from each sprite's Sounds tab and block menu.

On Ball, use **when green flag clicked → forever → move 10 steps → if on edge, bounce**. On each reacting sprite, use **when green flag clicked → forever → if touching Ball? then [reaction]**. The touching Ball? reporter goes inside the if condition. The reaction blocks go inside the if opening, which itself goes inside forever. This nesting keeps the reaction conditional while Ball's separate stack continues moving.

An if outside forever tests only once. Reaction blocks placed outside the if happen even without contact. During a walkthrough, trace the openings around each block and predict what happens when touching Ball? is false.

For Bell, reset its direction to 90 when starting. A **repeat 2** inside the if can turn left 30 degrees, play bell toll until done, turn right 30 degrees, and play bell toll until done. Two rings per repeat, repeated twice, makes four rings and restores the direction. For Chick, put **move 5 steps** and **start sound Chirp** inside its if. Start sound lets the next block run while the sound plays; **play sound until done** pauses only that stack until the sound finishes.

### Build and test the original lightning sequence

On Lightning, put **go to Cloud** and **point in direction 180** before forever. Cloud is the named sprite in the go to dropdown, not a backdrop. Its location is the reset point. Direction 180 points downward.

Inside Lightning's **if touching Ball? then**, put **repeat 10 → move 25 steps**, followed by **play sound Thunder Storm until done**, followed by **go to Cloud**. The repeat and both following blocks all belong inside the if. This follows the published reference: strike down, play thunder, wait for the sound, then return to Cloud. The return must be after the waiting sound block; replacing it with start sound would allow an immediate return while thunder is still playing.

The starter and reference have different Thunder Storm recordings. Listen to the recording in the project being edited rather than guessing its length or copying a wait time from a different project.

Test while Lightning is away from Ball, during contact, while thunder is playing, and after it finishes. Stop during a strike and restart: Lightning returns to Cloud before checking again. Ball keeps moving while Lightning waits. If the sound is inaudible, check the selected sprite's Sounds tab, volume, and device sound before changing the condition.

For **one reaction per contact**, put **wait until not touching Ball?** at the end of each reaction inside its if. Build not from Operators around the Sensing reporter. After finishing its reaction, that sprite waits for separation before checking for another contact. Without this block, a continuing overlap can trigger another reaction on the next loop pass. Choose which behavior is intended and test it explicitly.

The optional Concurrent Lightning Strike Challenge uses broadcasts to start motion and thunder together. It is a timing extension to the original sequence and can be revisited after the message broadcasting module.
`
};

export const lightningTimingChallenge: RawCourseModuleItem = {
	title: "Noisy Reactions: Concurrent Lightning Strike Challenge",
	content: `
### Start motion and thunder from one decision

First finish and test Noisy Reactions. This optional extension introduces **broadcast**, **when I receive**, and **broadcast and wait**, which are developed further in the message broadcasting module. A broadcast starts receiver stacks for the named message. Broadcast and wait also pauses its sending stack until those receivers finish.

Select Lightning and create a message named **lightning strike**. Replace its old reaction body rather than leaving the old strike stack running alongside it. Keep one contact monitor:

\`\`\`text
when green flag clicked
  go to Cloud
  forever
    if touching Ball? then
      broadcast lightning strike and wait
      go to Cloud
      wait until not touching Ball?
\`\`\`

Create two finite receiver stacks on **Lightning** for the same message:

\`\`\`text
when I receive lightning strike
  glide 1 seconds to x: -155 y: -130

when I receive lightning strike
  play sound Thunder Storm until done
\`\`\`

The glide destination is an example near the ground for the original starter, whose Cloud starts at x -155, y 79. If Cloud is moved, choose and record an appropriate ground destination beneath it. The return uses go to Cloud, so it follows that sprite's current position.

The single contact check starts both receivers. It does not rely on two separate loops noticing the same brief collision. Keep both receiver stacks finite: a forever block in a receiver would prevent broadcast and wait from finishing. Do not put go to Cloud inside either receiver. The monitor returns only after **both motion and sound finish**, then waits for separation before it can start another strike. If the sound is shorter than the glide, motion finishes last; if the glide is shorter, sound finishes last.

Test a short glide with the existing thunder recording, then make the glide longer than that recording. Predict which receiver finishes last and check that the return still waits for it. Check one sustained contact, a second separated contact, and a green-flag restart during playback. Ball's independent movement continues. Explain why merely moving play sound until done before or after a glide in one stack makes the actions sequential, and why start sound alone does not provide a completion gate for returning.
`
};
export const spiderSmashDebugGuide = `## Debugging hint: restore the hammer

After the mouse-button check changes the hammer to its smash costume, release the button. If the costume stays smashed, the program has no instruction for the false case. Try fixing that branch before reading the block guide below. Mouse down? means the mouse button is pressed; it does not mean the pointer is moving downward. Put this Boolean directly in the condition slot, without an equals block.

Keep the hammer following the pointer and check both costume states:

\`\`\`text
when green flag clicked
  switch costume to [resting costume]
  forever
    go to [mouse-pointer]
    if mouse down? then
      switch costume to [smash costume]
    else
      switch costume to [resting costume]
\`\`\`

Choose the actual resting and smash costume names from the hammer's Costumes tab; the brackets above describe their roles. The else branch restores the resting costume whenever the button is released. A one-time reset alone cannot handle later releases.

To play one whoosh per press, use a separate green-flag forever stack: wait until mouse down?, start sound [whoosh], then wait until not mouse down?. This keeps movement responsive and prevents a held button from starting the sound every loop pass. Select the sound that exists in the starter.

**Check and explain:** Move without pressing, hold the button while moving, release, and press again. The hammer must follow throughout, show smash only while pressed, and return to rest after release. Restart with the button released and check the resting costume. Explain the true and false branches before reconnecting the spider's two-condition scoring check.
`;
