import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";

const readings: Record<string, string> = {
	"MYP1 Personal Introductions": `
A speech has a purpose, an audience and an organized message. An introduction
helps a particular audience understand who someone is and why a few details
matter. An opening establishes contact, main points develop the message, and a
closing gives the listener a useful final thought.

## Original fictional model

> I am Rowan, and I like finding out how ordinary objects work. Last month I took apart a broken wind-up toy and drew its gears. I could not repair it, but I learned which part had stopped moving. I am joining this club because I want to build a small moving model with other people. If you like solving a problem by sketching it first, we may have a project in common.

The first sentence introduces a relevant interest. The toy supplies a memorable
detail, and the closing connects that interest to a club audience. A list of
unconnected favorites would be harder to follow. This short model demonstrates
structure; expand the project introduction to its two-minute target using details
that serve the chosen audience, then time the actual rehearsal.

For another-person introductions, change the point of view and verify real facts
or label an invented person as fictional. A gear sketch could reinforce Rowan's
interest without displaying the whole script. Pause at the end of a thought.
Record the effect of a filler or pause on clarity rather than treating every
filler as an error. Choose one change to test in the next rehearsal.
`.trim(),
	"MYP2 Toastmaker": `
A toast is a short ceremonial speech honoring a person, group or occasion. Its
purpose is recognition, not a complete biography. A specific memory supports the
sentiment more effectively than a string of broad compliments.

## Original fictional toast

> To the repair-club volunteers: when our model wheel stopped turning, you stayed to help us find the bent axle. You did not take the project away from us. You asked questions until we could see the problem ourselves. Thank you for giving us both a working model and the patience to try again. Here is to the next thing we learn to fix together.

The opening identifies the honorees. The bent axle is the meaningful detail, and
the closing returns to a shared value. "You are all amazing and the best ever"
offers praise without showing what the speaker appreciates.

Reduce the model to cue notes: volunteers; bent axle; useful questions; patience;
next repair. Rehearse from those notes so wording can remain conversational.
Mark a pause after the memory and emphasis on the final sentiment. For a visual
delivery, place an audience-look cue at the opening and closing when appropriate;
an audio-only version can use a greeting, vocal emphasis and pauses to establish
the same connection.
`.trim(),
	"MYP3 Speechwriter": `
A central claim is the main point the speech develops. A reason explains why
the audience should accept it. Evidence is a specific observation, example or
source detail; reasoning explains how that detail supports the claim.

## Worked outline for a fictional club

Audience: members sharing one model-building table. Purpose: persuade the group
to leave a brief handover note when stopping work. Claim: a handover note can
help the next person continue this shared project.

1. Opening: "Have you ever found a model on the table and wondered which pieces
   were still drying?" Name the proposed handover note.
2. First point: identify the current state. In the fictional trial, one note
   says, "Left wheel glued; let it dry; right wheel still loose." Explain which
   action that information makes possible and which action should wait.
3. Second point: name the next step. Add, "Next: test both wheels, then fit the
   axle." Contrast that specific instruction with "finish the model."
4. Closing: invite the group to try notes on its next shared model and compare
   whether the next person understands the state and next step.

The trial is an invented example, not research proving a universal result.
"Also, another thing" gives little guidance between points. "Knowing the current
state matters; naming the next step makes that information usable" explains the
relationship. Read the outline aloud, then revise one point whose connection to
the claim is unclear before adding performance polish.
`.trim(),
	"MYP4 Keynote Speaker": `
A keynote organizes a longer address around a central message suited to an
occasion. A through-line is the idea linking its sections. Emphasis changes which
words stand out; pacing includes speed and pauses; enunciation makes words
understandable. Gesture, posture and visuals can support a message when the
delivery format uses them.

## Annotated model segment

> [Show an unlabeled parts box, or describe it in audio.] Three lids, three identical boxes, and one missing axle. [Pause.] We had stored the parts, but we had not made them findable. A shared label needs to answer a user's question. [Emphasize "user's question."] Instead of "miscellaneous," our model label says, "Wheels and axles: test pieces on the left." [Point to the two groups, or name them aloud.] The next test is simple: can someone who did not write the label find the axle?

The through-line is that a useful shared label answers a user's question. The
box, revised wording and proposed test all serve it. A slide full of unrelated
storage tips would interrupt that line. The segment proposes a test rather than
claiming the label has already succeeded.

Build the full keynote around an opening situation, two connected main points
and a closing return to the central message. Annotate two meaningful emphasis
moments and one gesture or audio equivalent. Rehearse without visuals first;
then check whether any visual adds information instead of repeating the script.
`.trim(),
	"MYP5 Storyteller": `
A spoken narrative selects events to create a point for listeners. A hook raises
interest, a scene places a character in a situation, a turning point changes the
direction, and an ending shows why that change matters. A sequence of events
becomes clearer when the listener can understand the connections between them.

## Original fictional story

> I brought the tallest cardboard tower to the club and expected it to win the test. Then I put the small model weight on its top. The tower folded toward my shoe. I started telling everyone that the weight was unfair. My partner turned over our sketch and pointed to the wide base we had crossed out. We built that base again. The tower was shorter this time, but it stayed standing. I had arrived wanting to defend my first idea. I left wanting a test that could improve the next one.

The opening promises a test. The collapse creates a problem; the rejected sketch
is the turning point. The ending connects a practical revision to a change in
attitude. This invented story does not establish a scientific rule about every
tower; a real design claim would need appropriate testing.

Cue notes could be: tall tower; collapse; rejected base; rebuild; changed attitude.
Mark a pause after the collapse and a change in emphasis before the final
comparison. Expand scenes selectively rather than memorizing every sentence.
A true, adapted or fictional story can meet the project purpose; label inventions
and choose details suitable for the audience and delivery format.
`.trim(),
	"MYP6 Radio Pitch": `
A pitch recommends something to a specific audience. An audio pitch must make
its key details understandable without a screen. A recommendation needs criteria:
the best choice for a quiet mystery club may differ from the best choice for a
group seeking fast action.

## Supplied fictional media case

The Bell Courier is an invented family mystery. Its courier follows three
misdelivered notes through a town, consults the people named on them and discovers
that a rehearsal timetable was copied incorrectly. Each clue appears before its
explanation. The story's tension comes from misunderstanding and time pressure;
there is no on-screen violence in this invented synopsis.

For an audience wanting a low-intensity puzzle, an opening recommendation is:
"Choose The Bell Courier if your group likes solving a mystery from clues it can
check." Reasons: the three notes give listeners specific clues, and the timetable
reveal connects them. A competing audience wanting chase scenes might find that
slower structure a poor fit. "Everyone will love it" ignores the criterion.

Allow three minutes for planning and up to five minutes for delivering the
pitch. Draft the recommendation, strongest reasons, one example and
closing invitation, then time the actual delivery. After feedback, identify the
changed section and compare whether the listener can state the recommendation
and its reason without seeing a visual aid.
`.trim(),
	"MYP7 Defense Attorney": `
A structured argument makes a claim, supports it with evidence and explains the
connection. A counterargument is a reasonable challenge. A response addresses
the challenge or narrows the claim. The courtroom format here is a classroom
role-play for argument structure.

## Supplied fictional case cards: Can money buy happiness?

These invented cases support practice reasoning. They are not research about
income, proof of a population-wide relationship or financial advice.

1. Ari wants to attend a club meeting but cannot walk the distance. A purchased
   bus ticket lets Ari reach the meeting and enjoy time with the group.
2. Jo buys a new game but has no free evening to play it. Owning the game does
   not create the time Jo hoped to share with a friend.
3. Ren enjoys helping a neighbor repair a cardboard model using materials they
   already have. That enjoyable afternoon requires no new purchase.

A claim these cards can support is: money can remove some practical obstacles
to an enjoyable activity, but a purchase does not guarantee the experience.
Ari's ticket removes a travel obstacle; Jo's game leaves a time obstacle; Ren's
afternoon supplies an example of enjoyment without a new purchase. Explain each
connection rather than simply listing the cases.

Counterargument: without money, Ari could not have reached that meeting.
Response: first, the claim accepts that money can enable a particular activity;
second, Jo's and Ren's cases show why that does not establish a guarantee or a
universal requirement. A real-world generalization would require independently
checked evidence beyond these invented examples. Close by restating the bounded
claim, its strongest support and what the evidence does not establish.
`.trim(),
	"MYP8 Stand-up Comedian": `
A setup creates an expectation. A payoff changes or reframes it. Timing controls
when the listener has enough information to recognize that change. A transition
connects one piece to the next; a callback returns to an earlier idea with a
new use.

## Original observational segment

> I labeled a drawer "miscellaneous" so I would always know where things belonged. [Pause.] Now everything belongs there. I tried a second drawer called "other miscellaneous." [Short pause.] That is where I keep the labels. When someone asks where the scissors are, I can confidently say they are in our filing system.

The setup promises organization; the first payoff reveals that the broad label
has removed useful distinctions. The second drawer extends the pattern, and the
last line returns to the claim of organization. The fictional habit is the target,
not a classmate or someone's identity. A joke is not guaranteed to amuse every
audience; observe feedback instead of treating silence as a personal failure.

This is a short model segment, not a complete four-to-five-minute routine.
Build a sequence of related observations with a clear opening, transitions and
closing beat. Rehearse from an outline, mark two pauses or emphasis changes,
and cut a setup that takes longer than its payoff can justify. Cue cards can
hold the sequence without turning the performance into a line-by-line reading.
Private or audio-only rehearsal can test whether the meaning and timing are clear.
`.trim(),
	"MYP9 Master Project: Your TED-Ed Talk": `
A talk portfolio joins a central idea, support, delivery choices and revision
evidence. Analyze how those parts work together before polishing a performance.
The three original mini-talks below are classroom models, not TED or TED-Ed talks.
Bracketed cues describe intended delivery; an audience reaction must be observed
or described as a prediction rather than reported as a fact.

## Model A: Labels answer questions

> [Show two identical boxes, or describe them.] Which box holds the axle? "Miscellaneous" does not answer that question. [Replace the label.] "Wheels and axles" gives a useful starting point. [Pause.] A label is a small promise about what someone can find. Before printing twenty copies, ask one person who did not write it to locate the axle. Their search can show what the label still needs to explain.

## Model B: One useful question

> [Hold up a sketch with an arrow, or describe it.] My partner said, "Put it over there." I moved the whole model. My partner meant one wheel. [Pause.] The mistake was small, but it showed how much "it" and "there" were carrying. We tried one question: "Which part, and which place?" The answer gave us a wheel, a marked corner and a next action. A useful question can turn a vague instruction into something we can check.

## Model C: Leave a next step

> [Display a blank note beside an unfinished model, or describe both.] This note says, "Continue tomorrow." Tomorrow's builder knows when to work, but not what to do. [Add three short lines.] "Left wheel drying. Right wheel loose. Next: test the axle." The note does not finish the model. It lets another person understand where the work stands. When a project changes hands, a small next-step record can become part of the work itself.

For each model, identify its through-line, quoted supporting detail, pause or
gesture cue, visual or audio substitute and likely audience effect. A's contrast
makes its labeling problem concrete; B's misunderstanding invites recognition;
C's revised note demonstrates the proposal. Those are reasoned interpretations,
not measurements of a real audience. Compare which technique fits the intended
audience and use that comparison to choose a topic for the full project talk.

Rehearse once for message clarity, once for timing and once for delivery. Keep
the original outline, one feedback note and a visible revision. A visual aid
should add an example or comparison. Use original or appropriately licensed assets
and record the source and terms for borrowed material. For private audio-only
delivery, mark framing, lighting
and visual-edit checks as not applicable; check audible speech and any audio
rights instead.
`.trim()
};

const supplementalTasks: Record<string, [string, string]> = {
	"MYP1 Personal Introductions": [
		`Rehearse the supplied Rowan introduction from five cue words instead of
reading the paragraph. Mark one pause between ideas and one word to emphasize.
Compare the two deliveries for clarity, then keep the cue notes and name one
change that helped the audience follow Rowan's reason for joining the club.`,
		`Prepare two introductions for the same fictional person: one for a
model-building club and one for a school welcome event. Choose the detail and
closing that matter to each audience. Keep both short outlines and explain which details
changed, which stayed accurate, and how the new closing connects with its
audience.`
	],
	"MYP2 Toastmaker": [
		`Reduce the supplied repair-club toast to five cue words, then deliver it
without reading the paragraph. Preserve the honoree, bent-axle memory and closing
sentiment. Mark an opening audience-look cue, or an audio greeting, and one pause.
Keep the cue notes and compare whether the meaningful detail remained clear.`,
		`Adapt the repair-club toast to thank one fictional volunteer rather than
the whole group. Choose a specific action from the supplied model and connect it
to the closing sentiment. Compare the group and individual versions; identify
which pronouns, details and emphasis changed without inventing a real person's
history.`
	],
	"MYP3 Speechwriter": [
		`Use the supplied handover-note outline to separate the central claim,
two reasons and the detail supporting each reason. Read only the transitions
aloud. Replace one vague transition with a sentence explaining the connection
between the points. Keep the annotated outline and explain how the revision
helps the club audience follow the proposal.`,
		`Change the audience for the handover-note speech from current club
members to people joining the club for the first time. Add the context needed
to understand the drying wheel and loose wheel. Keep the same proposal and
fictional facts, then compare the openings and identify one detail the original
audience could already understand.`
	],
	"MYP4 Keynote Speaker": [
		`Annotate the supplied parts-box segment with two emphasis cues and one
pause. Rehearse the segment twice, moving the pause between versions. Keep the
through-line about labels answering a user's question. Compare which placement
makes the change from the vague label to the useful label easier to follow,
using a rehearsal note or listener feedback.`,
		`Adapt the parts-box segment for audio-only delivery. Replace the showing
and pointing cues with brief descriptions that let a listener understand the
two labels and the proposed search test. Keep the central message unchanged.
Compare the versions and remove any spoken description that repeats information
the listener already has.`
	],
	"MYP5 Storyteller": [
		`Retell the supplied cardboard-tower story from five cue words. Preserve
the collapse, the rejected sketch, the rebuild and the narrator's changed
attitude. Mark one pause at the turning point. Compare the retelling with the
model and identify a detail that helped connect the practical problem to the
ending, rather than merely adding length.`,
		`Retell the fictional tower story from the partner's point of view.
Keep the visible events unchanged, but distinguish what the partner could
observe from what only the original narrator could know. Compare the two
openings and endings. Identify one changed interpretation and the event in
the supplied story that supports it.`
	],
	"MYP6 Radio Pitch": [
		`Plan an audio pitch for The Bell Courier using the supplied synopsis.
Use three minutes for the outline and keep the delivered pitch within five
minutes. Include a recommendation, a specific audience and two supporting
details. After rehearsal, check whether a listener can identify the
recommendation and its reason without a visual aid.`,
		`Change the target audience from a quiet mystery club to a group seeking
fast action. Use the same Bell Courier synopsis to explain why it may be a
poor fit. Keep the recommendation honest rather than adding chase scenes that
the synopsis does not supply. Compare which details matter to the two audiences
and revise the closing accordingly.`
	],
	"MYP7 Defense Attorney": [
		`Sort the three supplied fictional case cards into support for and
challenges to the claim that a purchase guarantees happiness. Explain how each
case affects the claim, then write a narrower conclusion that accounts for
all three. Keep case details separate from general claims about real people;
these examples are reasoning practice, not population evidence.`,
		`Present the strongest objection to the reading's bounded claim before
presenting the claim itself. Answer that objection using two of the supplied
case cards and explain how each bears on the response. Compare the reordered
argument with the original sequence, noting whether the conclusion still
acknowledges what the fictional evidence cannot establish.`
	],
	"MYP8 Stand-up Comedian": [
		`Rehearse the supplied miscellaneous-drawer segment with two different
pause placements. Preserve its wording so the comparison concerns timing.
Record where the listener has enough information to understand each payoff.
Keep the two marked scripts and a revision note; distinguish observed feedback
from a prediction when rehearsing without an audience.`,
		`Write a new closing line that calls back to the first drawer label in
the supplied segment. Keep the fictional organizing habit as the target.
Compare the new ending with the original filing-system line and explain how
each returns to an earlier idea. Rehearse both before choosing the ending
whose connection is clearest.`
	],
	"MYP9 Master Project: Your TED-Ed Talk": [
		`Choose one supplied mini-talk and annotate its central idea, one
supporting detail and two delivery cues. Rehearse it with a changed pause or
emphasis, keeping the wording stable. Explain which connection the changed cue
is meant to clarify, then distinguish that intention from any feedback actually
observed during the rehearsal.`,
		`Create a ninety-second version of the full project talk. Preserve its
central idea and one complete supporting example while cutting secondary
material. Time the delivery, then compare it with the longer outline. Identify
what the shorter version communicates clearly and one useful point lost in the
cut; revise an abrupt transition before delivering again.`
	]
};

export function applyPublicSpeakingReadings(
	course: RawCourse,
	source: RawCourse
) {
	for (const original of source.modules) {
		const content = readings[original.title];
		const module = course.modules.find(
			item => item.title === original.title
		);
		const item = module?.curriculum.find(
			item =>
				item.title.startsWith("Concepts:") ||
				item.title.endsWith("Core Concepts")
		);
		const flow = original.curriculum[0]?.content.match(
			/\*\*Course flow:\*\* [\s\S]+$/
		)?.[0];
		if (!content || !module || !item || !flow) {
			throw new Error(
				`Missing Public Speaking reading: ${original.title}`
			);
		}
		item.content = formatAuthoredReading(`${content}\n\n${flow}`);
		item.contentKind = "reading";
		item.preserveInstructions = true;
		module.curriculum = [
			item,
			...original.curriculum.slice(1).map(project => ({
				...project,
				...module.curriculum.find(
					current => current.title === project.title
				),
				content: formatAuthoredAssignment(project.content),
				contentKind: "assignment" as const,
				preserveInstructions: true,
				preserveAssignment: true
			}))
		];
		for (const [index, optional] of module.supplementalProjects.entries()) {
			const task = supplementalTasks[original.title]?.[index];
			if (!task) {
				throw new Error(
					`Missing Public Speaking practice: ${original.title}/${index}`
				);
			}
			optional.contentKind = "assignment";
			optional.content = formatAuthoredAssignment(
				formatAuthoredReading(task)
			);
			optional.preserveInstructions = true;
			optional.preserveAssignment = true;
		}
	}
}
