export const scratchNestedLoopLesson = `Each time an outer repeat starts a new iteration, its inner repeat runs from the beginning. Repeat counts multiply: six rows of eight squares make 6 × 8 = 48 squares.

### Repeat one shape

Add the Pen extension. Lift the pen before moving to a starting position, clear the old drawing, then lower the pen. A square repeats four sides: move the side length, then turn 90 degrees. An equilateral triangle repeats three sides with a 120-degree turn. These are the outside turns: the turns around a closed shape add to 360 degrees.

### Square Inception

Start at (0, 0), facing 90 degrees. Use an outer repeat of four for the quadrants. Inside it, set a side-length variable to 50 and repeat three squares. Each square uses a four-side loop, then increases the side length by 25. The three side lengths are 50, 75 and 100. After those squares, change the pen color by 25 and turn 90 degrees before the next quadrant. Resetting the side length inside the outer loop gives every quadrant the same three sizes. This makes 4 × 3 = 12 squares and 48 side movements.

### Growing triangles

For Pyramid, start at (0, 120), facing 150 degrees, with Num Steps set to 20. The inner loop repeats three moves and 120-degree turns to close one triangle. After that inner loop finishes, increase Num Steps by 20. Repeat the whole triangle-and-increase sequence 15 times. The first triangle has sides of 20, the second 40, and the fifteenth 300. The variable ends at 320, ready for another triangle; the last drawn side was 300. Increasing the variable after the inner loop keeps all three sides of a triangle equal.

### Rows and columns

For Grid, start at (-200, 150), facing 90 degrees. Use three loop levels: six rows, eight squares per row, and four sides per square. Each side is 50 steps. After a square closes, lift the pen and change x by 50 to reach the next cell. After a row, set x back to -200 and change y by -50. Lower the pen when the next square starts. This draws 48 squares with 192 side movements, covering x from -200 to 200 and y from -150 to 150.

### Reset a value at the right level

For Rainbow Flower, each petal starts at the center with Angle set to 0. Repeat 40 times: move 10 steps, turn by Angle, then increase Angle by 1. The turns use 0 through 39 degrees and Angle ends at 40. Lift the pen before returning to the center for the next petal, and reset Angle to 0 for that petal. Those 40 turns add to 780 degrees, leaving a 60-degree change in direction. Six petals fill the six orientations, with a pen-color change of 15 after each petal.

### Wait for another sprite

Playing Baseball repeats the pitch-and-bat sequence three times, matching three strikes. Within each turn, a four-repeat loop cycles the pitcher's four costumes. Broadcast and wait starts the batter's receiving script and pauses the pitcher until that script finishes, including its four-costume animation and sound. Put that wait inside the outer repeat so each batter turn finishes before the next pitch starts.`;
