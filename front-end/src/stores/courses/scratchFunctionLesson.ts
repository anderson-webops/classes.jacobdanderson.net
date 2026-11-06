export const scratchFunctionLesson = `A function is a named set of instructions that can be called more than once. Scratch implements these procedures as custom blocks in My Blocks. A definition describes the instructions; a call runs them and then continues with the next block in the calling script.

### Define a block with an input

Select the sprite that will perform the action. In My Blocks, choose Make a Block, name it draw square, add a number or text input named side and confirm. Scratch creates a define draw square (side) block. Attach the square's instructions below that definition:

\`\`\`text
define draw square (side)
    pen down
    repeat 4
        move (side) steps
        turn clockwise 90 degrees
    pen up
\`\`\`

The Pen extension supplies pen down and pen up. Drag the rounded side input from the definition into move's steps slot. Typing the word side into the slot would supply text rather than the parameter's value.

The definition alone has no event that starts it. Under when green flag clicked, place the new draw square block from My Blocks and enter 50 in its input. That call draws four 50-step sides. A later draw square (100) call uses the same definition with a different value.

### Parameters and stored state

A parameter is a value supplied for one call. The name side can be read inside that custom-block definition; it is not a global variable shared by every script. Separate inputs, such as sides and size, let a polygon block repeat sides times and turn 360 / sides degrees after each move. For a regular polygon, sides is an integer of at least 3. Small positive side lengths keep the drawing on the stage.

Variables and lists hold state that may remain after the call ends. A counting function must set its counter from its starting input each time. Scratch custom blocks perform actions but do not return a reporter value that can be placed into an arithmetic slot. A computed result can be displayed or stored in a variable.

Custom blocks belong to the sprite that defines them. Another sprite can respond to a broadcast with its own code; it cannot directly call the first sprite's block.

### Reuse actions in order

My First Functions separates speaking, drawing, jumping and teleporting. A jump with height 100 can repeat 10 changes of y by height / 10, then 10 changes by height / -10. Away from the stage boundary, the sprite rises 100 and returns to its original y. A speak block repeats its sound the supplied number of times.

The green-flag script calls jump (100), speak (3), draw square (100), teleport, then draw square (100). The teleport block needs no input because its behavior chooses its own random destination. Leaving Run without screen refresh unchecked lets these animated demonstrations update normally; the option is for short computations that should finish without intermediate redraws.

### Separate decisions from actions

Talent Show II asks which talent to perform, asks for that talent's parameter and calls the matching custom block. Use the second answer immediately as the input, or save it before another question replaces answer.

Rock Paper Scissors uses separate blocks for choosing the computer answer, validating player input and finding the winner. The find-winner block can call player-wins, computer-wins or tie helpers. A small main script then describes the round in order without repeating every detail.

Extra Functions calls four procedures with keys 1 through 4. For counting, say the starting value and then change the counter by 1 until the ending value is included. Equal endpoints produce one value. The descending challenge uses -1. Arithmetic examples need a nonzero divisor; multiples use an index starting at 1. Test a second call with different inputs to distinguish reusable code from a script that only works for its first values.`;
