# Recursion checks

## Practice inputs
Use factorial inputs 0, 1, 4, 12, -1, 13; exponent inputs (2,0), (0,0), (-2,3), (2,31), (2,-1); sumDigits inputs 0, 1000, -1234, -2147483648; Fibonacci terms 1, 2, 5, 0, 32; palindrome inputs "", "x", "level", "Level", null, and 257 copies of "a". Use the public methods in Main.java. Trace a non-base case for each method.

## Practice answers
Factorials: 1, 1, 24, 479001600; -1 and 13 throw IllegalArgumentException. Exponents: 1, 1, -8; 2^31 throws ArithmeticException; power -1 throws IllegalArgumentException. Digit sums: 0, 1, 10, 47. Fibonacci: 0, 1, 3; terms 0 and 32 throw IllegalArgumentException. Palindromes: true, true, true, false; null and length 257 throw IllegalArgumentException. Non-ASCII input also throws IllegalArgumentException.

factorial(4) descends 4,3,2,1,0 and returns 1,1,2,6,24. exponent(2,3) descends powers 3,2,1,0 and returns 1,2,4,8. Each palindrome comparison removes two characters. These outputs check values; the submitted method bodies and traces must also demonstrate recursion.

## Seven inputs
Evaluate 0, 7, -7, 203, 204, 2147483647, -2147483648. Try console input "203 bad -7 quit 204", empty input, and "2147483648 0" followed by end-of-input. Compare the method independently with n % 7 == 0.

## Seven answers
The results are true, true, true, true, false, false, false. The first console case prints 203 is divisible by 7, Invalid integer., -7 is divisible by 7 on separate lines, then stops. Empty input exits without output. The out-of-range token prints Invalid integer., followed by 0 is divisible by 7 for zero.

The minimum int first widens to magnitude 2147483648, then reduces to 214748348, 21474818, 2147465, 214736, 21461, 2144, 206, 8: false. Every recursive magnitude decreases; zero and seven are terminating true cases.

## Branching inputs
Using term 1 = 0 and term 2 = 1, draw the complete recursive trees for terms 5 and 6. Count all calls, distinct term values, and maximum simultaneous frames. Compare with a loop retaining two preceding terms.

## Branching answers
Term 5 returns 3 after 9 calls; term 6 returns 5 after 15 calls. Let C(1) = C(2) = 1 and C(n) = 1 + C(n-1) + C(n-2). Then C(3)=3, C(4)=5, C(5)=9, C(6)=15. Distinct term numbers are 1..5 and 1..6, so 5 and 6 states. The longest active chains have 4 and 5 frames, respectively, because term 2 already stops. Repeated subtrees cause exponential call growth; maximum stack depth is linear. A loop visits successive terms once and retains two values.

For term 5, the root's term-4 child returns 2 from term 3 (1) and term 2 (1); the root's term-3 child returns 1 from term 2 (1) and term 1 (0). Thus the root returns 2 + 1 = 3.

## Digits inputs
Trace 0, 1000, -1234, and -2147483648 through a long-valued magnitude helper. Record prefix, last digit, and return value. Explain casting before absolute value.

## Digits answers
Zero returns 0 immediately. 1000 descends magnitudes 1000,100,10,1 and returns 1,1,1,1. -1234 becomes 1234, then 123,12,1; returns 1,3,6,10. The minimum int becomes long 2147483648, then 214748364,21474836,2147483,214748,21474,2147,214,21,2. Returns are 2,3,7,14,18,26,29,35,39,47. Each frame adds its removed digit to the smaller answer. Casting after Math.abs(int) preserves the already-overflowed negative value; cast before calling Math.abs. The result does not depend on the original sign.

## Backtracking inputs
Use the supplied include-then-skip algorithm with values [2,3,5], target 8. List all leaf subsets and sums; count every node, including the empty-root and terminal calls. Repeat target 5, then values [1,2,3,4], target 5. Each list position is usable once.

## Backtracking answers
Include-first leaf order: [2,3,5]→10; [2,3]→5; [2,5]→7; [2]→2; [3,5]→8; [3]→3; [5]→5; []→0. Only [3,5] reaches 8. The full tree has 1+2+4+8=15 calls. For target 5 with the original values, results are [2,3] and [5]. With [1,2,3,4], results are [1,4] and [2,3].

Every include is followed by exactly one undo before that frame's skip call. Each frame owns the decision at its index. A copied answer remains stable as chosen changes; retaining the same mutable list makes saved answers follow later undo operations. Without undo, the skip branch still contains the supposedly skipped value. At every call, index increases, so each path stops after the finite input length.
