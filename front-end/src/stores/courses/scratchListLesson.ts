export const scratchListLesson = `A list stores many related values in order. In Variables, Make a List creates a named collection such as Bucket List or Numbers. A variable holds one value; a list holds items that can be added, read, replaced or deleted separately.

### Store and read items

The blocks add [item] to [list], item [index] of [list], length of [list] and delete all of [list] are in Variables after a list is created. An index is an item's position. Scratch starts at 1. For the list [4, 7, 10], item 1 is 4, item 3 is 10 and the length is 3. Item 0 is outside the list. Reading an invalid index produces empty text.

In Bucket List, the green flag first deletes all items from Bucket List. A repeat 5 loop asks for one entry, waits for the answer and adds that answer to the list. Clearing once before the loop starts a new collection; clearing inside it would erase earlier entries.

### Traverse in either direction

A counter identifies which item to read. For the Numbers list [4, 7, 10], this sequence says 4, then 7, then 10:

\`\`\`text
set index to 1
repeat (length of Numbers)
    say (item index of Numbers) for 1 second
    change index by 1
\`\`\`

After reading item 3, index becomes 4, but the loop has finished. An empty list has length 0, so the body runs zero times. Reset index before every new traversal. Keep the list unchanged during the read so its positions stay predictable.

For a backward read, set index to length of Numbers, read the item, then change index by -1. The same three repetitions say 10, 7, 4. List Practice's doubled read says item times 2 without replacing the stored item. Its parity read checks item mod 2 = 0 for even numbers; otherwise the integer is odd.

### Stop before storing a sentinel

A sentinel is a special answer marking the end of input. Bucket List's optional stop version asks once before repeat until answer = stop. Inside the loop it adds answer, then asks again. The condition is checked before the next addition, so stop is never stored. Entering stop first leaves an empty list.

### Compare sequences and unique items

Music Memory uses a Solution list and a Guess list. Each new round clears both, stores the played notes in order and compares each submitted guess with Solution at the same 1-based index. A length match alone cannot prove the sequences match. After a correct round, the next sequence has one more note.

The list contains [item]? block answers true or false. Multiple Magic accepts a number only when its remainder is 0 and the guess list does not already contain it. Wheel of Fortune builds a list of unique letters: happy contributes h, a, p, y, so both p positions need only one correct guess. Each new correct letter enters the guess list once. Check for a complete match after processing every guess, including the last allowed guess, before declaring a loss.

Start each game with its lists, counters and score reset. An empty list, a repeated item and a fresh green-flag start reveal different mistakes from a normal round.`;
