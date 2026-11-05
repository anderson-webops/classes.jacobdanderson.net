export const scratchOperatorLesson = `Computers can calculate, compare, and combine numbers. An operator takes input values and produces a result that another block can use.

### Arithmetic and absolute value

| Operation | Example | Result |
| --- | --- | --- |
| Addition | 7 + 3 | 10 |
| Subtraction | 7 - 3 | 4 |
| Multiplication | 7 * 3 | 21 |
| Division | 7 / 2 | 3.5 |
| Remainder | 10 mod 3 | 1 |
| Absolute value | abs of -7 | 7 |

Absolute value is distance from zero, so abs of 7 is also 7 and abs of 0 is 0. Scratch supplies abs in the mathematical-function dropdown. Division needs a nonzero divisor: dividing by zero has no finite answer. An input-handling extension can reject that case before calculating.

### Keep each calculator input

Each question replaces the answer reporter. Calculator therefore stores the first answer in Num1, the second in Num2, and the requested operation in Operator. Its conditional branches choose the matching arithmetic block. With inputs 7, 2 and /, the result is 3.5; with the same numbers and -, it is 5. An unsupported operation needs a separate response rather than a guessed calculation.

For the remainder challenge, use mod. For a nonnegative whole-number exponent, start a result variable at 1 and multiply it by the base once per repetition. Thus 2^3 = 8 and 2^0 = 1. The zero-exponent case performs no multiplications.

### Divisibility and branch order

A number is a multiple of 3 when its remainder after division by 3 is zero. For example, 12 mod 3 = 0, while 14 mod 3 = 2.

FizzBuzz starts its counter at 0, repeats 50 times, and increases the counter before choosing an output. This visits 1 through 50. Test the combined case first:

\`\`\`text
if (n mod 3 = 0) and (n mod 5 = 0)
  say [Fizzbuzz]
else if n mod 3 = 0
  say [Fizz]
else if n mod 5 = 0
  say [Buzz]
else
  say (n)
\`\`\`

At 15, both conditions are true. The first branch gives one combined output; placing the 3-only branch first would select Fizz before reaching that combined case. Useful checks include 1, 3, 5, 15 and 50.

### Multiples with a counter

Times Tables starts its multiplier at 1. Repeating product-then-increment ten times gives multipliers 1 through 10. For a base of 4, the outputs begin 4, 8, 12 and end at 40. In the optional variable-count version, save the base before asking how many multiples to produce, because that second answer replaces the first.

### A coordinate from a calculation

For Dotty, set x from the input and calculate y as abs of x before stamping. Inputs -30, 0 and 30 give (-30, 30), (0, 0) and (30, 30).

Lift the pen during the input-and-stamp phase. For the continuous graph, start at (-180, 180), lower the pen, and repeat 360 times: increase x by 1, then calculate y from that new x. The trace finishes at (180, 180). Updating y from the previous x instead leaves the final point one step behind.

### Choosing a random value

With whole-number limits, pick random 1 to 6 chooses one of 1, 2, 3, 4, 5 or 6; both limits are included. Save the result in a variable when several later checks must use the same choice. Boundary checks can use 1 and 6 directly rather than waiting for particular random rolls.`;
