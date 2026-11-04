export const scratchEducationalQuizGuide = `
Build an educational quiz after the class examples for scenes, conditions and
variables. The supplied buttons and question scripts are a foundation for a
teaching game; the independent mini-game remains an original design task.

**Run first:** Open the starter and press the flag. Click Start, enter any
display name, then click Next. The first question is (-3) + (8). The starter
keeps retrying even after 5 because one comparison is deliberately unfinished.
The working reset, buttons, questions and scoring location stay in place.

**Block guide:** Sensing's ask and wait pauses that script until an answer is
submitted. Its answer reporter contains the latest response, so asking again
replaces the previous answer. Operators' rounded + block computes a sum; the
hexagonal = block makes the true-or-false comparison needed by repeat until.
Join combines text and variable values into a question. Variables remember
values between events; show/hide variable changes only the monitor, not its
value. Events' broadcast starts matching receivers; broadcast and wait also
waits for those receivers to finish. A forever receiver would prevent it from
returning.

**Trace the states:** QuizState 0 shows Start. Start changes it to 1 while Quiz
asks the display name. Quiz then changes it to 2 and broadcasts Ready next.
Next appears only in state 2. Clicking Next changes state to 3 and hides the
button before broadcasting Question and wait. Quiz holds the same operands
while retrying. After a correct answer, Score increases once. Questions 1 and 2
return to state 2; question 3 enters state 4 and shows the ending. A second Next
click during state 3 cannot start another question.

**Normal:**

1. Select the Quiz sprite. Find when I receive [Question], then the repeat until
   block with <0 = 1>. This comparison is always false, so the starter cannot
   leave the retry loop.
2. In Operators, put the rounded + block in the right side of =. Put the Num1
   and Num2 variable reporters inside +. Put Sensing's answer reporter in the
   left side of =. The complete condition is <answer = (Num1 + Num2)>.
3. Keep the first ask before repeat until. Inside the loop, keep Try again for
   1 second followed by another ask of the same question. Choose or change the
   two operands before that first ask, never inside the retry loop.
4. Keep change Score by 1 after repeat until, followed by Correct! for 1 second.
   Putting the score update inside the loop would reward wrong attempts;
   immediately asking again would overwrite feedback before it can be read.
5. Complete the three questions: (-3) + (8) = 5, (6) + (-9) = -3, and
   (-4) + (-5) = -9. The final score is 3. Compare the completed reference only
   after saving the working attempt.

**Check:** Start hides during the greeting. Next appears after the greeting,
hides during a question and returns only after a correct answer. Try a wrong
number, a word and a blank response: the question and operands stay unchanged
and Score does not increase. Click Next repeatedly while answering; Question
still advances once. Finish all three questions and confirm Score 3, the
ending backdrop and hidden buttons. Restart during a question and after the
ending: Score and Question return to 0, Start returns, Next hides and the name
is asked again on the next Start.

**Hard:** Choose one extension after Normal works. For random questions, set
Num1 and Num2 to separate pick random values once per new question. Keep the
stored operands through every retry. Adding two independent random 1..10
values is not a uniform random 2..20 draw: there is one pair summing to 2 and
ten pairs summing to 11. Use the two stored operands to display and check the
same arithmetic problem.

For a typed stop/end option, check that word before awarding a point. End the
retry loop on either a correct answer or the stop word; after it, branch so
stop shows the final score without adding a point or showing Next. The editor's
red Stop button halts scripts immediately; it is not a project event for
showing a custom ending. Test stopping before any correct answer, after one
point, and during a retry, then restart.

**Verification:** Repeat the checks after an extension and after reopening the saved file.

**Explain and retain:** Identify the sender and receiver for each message, the
state that permits each button, where answer is replaced and where a point is
earned. Save separate .sb3 files for the starter and the completed game, reopen
the completed file and repeat the wrong-answer and restart checks.
`;
