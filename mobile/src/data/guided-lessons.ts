export type GuidedStep = { number: string; title: string; explanation: string };
export type CommonMistake = { title: string; explanation: string };
export type PracticeTask = {
  title: string;
  prompt: string;
  starter: string;
  solution: string;
  hint: string;
};
export type GuidedLesson = {
  steps: GuidedStep[];
  mistakes: CommonMistake[];
  recap: string;
  practice: PracticeTask[];
};

// Source: main/script.js on main (deepData and foundationPractice).
// Guided explanations and optional exercises are preserved from the website.
// The source explicitly defines these exercises as ungraded and non-persistent.
export const guidedLessons: Record<string, GuidedLesson> = {
  "python-basics": {
    steps: [
      { number: "1", title: "Give a value a name", explanation: "Write a clear variable name, then use = to assign a value: score = 10. The name now refers to the value 10." },
      { number: "2", title: "Display the value", explanation: "print(score) asks Python to display the current value stored under score. It does not change the variable." },
      { number: "3", title: "Update the value", explanation: "score = score + 5 means: read the old score (10), add 5, then store the result (15) back in score." },
      { number: "4", title: "Use the updated value", explanation: "After that assignment, print(score) displays 15. Later lines see the new value, not the old one." },
      { number: "5", title: "Keep text and numbers clear", explanation: "Text needs quotation marks, such as name = \"Mika\". A number such as age = 15 does not need quotes." }
    ],
    mistakes: [
      { title: "Using == when assigning", explanation: "Use one = to assign a value. Two equals signs (==) ask whether two values are equal." },
      { title: "Forgetting quotes around text", explanation: "name = Mika makes Python look for a variable named Mika. Write name = \"Mika\" for text." },
      { title: "Thinking assignment is an equation", explanation: "score = score + 5 is an instruction to update a value, not a claim that both sides are mathematically equal." },
      { title: "Changing capitalization", explanation: "Python treats score, Score, and SCORE as three different names." }
    ],
    recap: "A variable is a name connected to a value. = assigns or updates that value, and print() displays it. When you assign to the same variable again, the new value replaces the old one.",
    practice: [
      { title: "Update a score", prompt: "Create score = 10, add 5 to it, then print the updated score.", starter: "score = 10\n# Update the score below\n\nprint(score)", solution: "score = 10\nscore = score + 5\nprint(score)", hint: "Assign score + 5 back to the score variable." },
      { title: "Build a short introduction", prompt: "Store your name and a favorite subject in two variables. Print one sentence using both.", starter: "name = \"Alex\"\nsubject = \"Science\"\n# Write your print() line below\n", solution: "name = \"Alex\"\nsubject = \"Science\"\nprint(\"My name is\", name, \"and I like\", subject)", hint: "print() can display several comma-separated values." },
      { title: "Predict a variable change", prompt: "Before running the code, predict the final value of total. Then try it in the playground.", starter: "total = 4\ntotal = total + 3\ntotal = total * 2\nprint(total)", solution: "total = 14", hint: "Follow each assignment in order: first add, then multiply." }
    ]
  },
  "data-types": {
    steps: [
      { number: "1", title: "Read the value, not just how it looks", explanation: "\"17\" is a string (text), while 17 is an integer. They may look similar on screen, but Python treats them differently." },
      { number: "2", title: "Recognize the three common types", explanation: "str stores text, int stores whole numbers, and float stores numbers with decimal parts." },
      { number: "3", title: "Use quotes for strings", explanation: "city = \"Addis Ababa\" is text. The quotation marks tell Python to treat the characters as a string." },
      { number: "4", title: "Inspect a value with type()", explanation: "type(age) reports the kind of value stored in age. For example, type(17) is int and type(17.0) is float." },
      { number: "5", title: "Convert when the operation needs it", explanation: "int(\"17\") converts numeric text to 17. float(\"2.5\") converts numeric text to 2.5. The text must contain a valid number." },
      { number: "6", title: "Choose the type that matches the task", explanation: "Use a string for a name, an integer for a whole-number count, and a float when a decimal value is useful." }
    ],
    mistakes: [
      { title: "Putting a number in quotes by accident", explanation: "\"15\" is text, not an integer. Convert it with int() before integer arithmetic." },
      { title: "Expecting int() to keep a decimal part", explanation: "int(4.8) becomes 4. Use float() when you need to keep the decimal value." },
      { title: "Confusing a value with its type", explanation: "17 is the value; int is its type. type(17) lets you inspect the type." },
      { title: "Trying to convert ordinary words into numbers", explanation: "int(\"hello\") cannot work because \"hello\" does not represent a whole number." }
    ],
    recap: "str is for text, int is for whole numbers, and float is for decimal numbers. Use type() to inspect a value and int() or float() to convert valid numeric text.",
    practice: [
      { title: "Convert text to a number", prompt: "Convert the text value price_text into a float, then print the number plus 2.", starter: "price_text = \"12.5\"\n# Convert and calculate\n", solution: "price_text = \"12.5\"\nprice = float(price_text)\nprint(price + 2)", hint: "Use float(price_text) to convert decimal text." },
      { title: "Check the types", prompt: "Create a string, an integer, and a float. Print type() for each one.", starter: "city = \"Addis Ababa\"\npopulation = 500\naverage = 2.5\n", solution: "city = \"Addis Ababa\"\npopulation = 500\naverage = 2.5\nprint(type(city))\nprint(type(population))\nprint(type(average))", hint: "Call type(variable) inside print()." },
      { title: "Fix the type mismatch", prompt: "Fix the program so it prints 18 instead of joining text and a number.", starter: "age_text = \"17\"\nprint(age_text + 1)", solution: "age_text = \"17\"\nage = int(age_text)\nprint(age + 1)", hint: "Convert the numeric text with int() before adding." }
    ]
  },
  "operators-input": {
    steps: [
      { number: "1", title: "Choose the operation", explanation: "Use + to add, - to subtract, * to multiply, / for division, // for floor division, % for a remainder, and ** for a power." },
      { number: "2", title: "Follow the order of calculation", explanation: "Parentheses are handled first, then powers, then multiplication/division, then addition/subtraction. Use parentheses when you want to make the order obvious." },
      { number: "3", title: "Read input from the user", explanation: "input(\"Your age: \") displays a prompt and waits for typing. Whatever the user types is returned as a string." },
      { number: "4", title: "Convert before doing number work", explanation: "age_text = input(...) gives text. age = int(age_text) converts valid whole-number text so age + 1 performs addition." },
      { number: "5", title: "Store and use the result", explanation: "next_age = age + 1 calculates a new value. print(next_age) displays it; the calculation itself does not ask the user for more input." },
      { number: "6", title: "Compare the division operators", explanation: "For 17 and 5, 17 / 5 is 3.4, 17 // 5 is 3, and 17 % 5 is 2." }
    ],
    mistakes: [
      { title: "Assuming input() returns a number", explanation: "input() always returns text. Convert it with int() or float() before numeric calculations." },
      { title: "Joining text instead of adding numbers", explanation: "\"17\" + \"2\" produces \"172\". int(\"17\") + int(\"2\") produces 19." },
      { title: "Mixing up /, //, and %", explanation: "/ gives ordinary division, // gives floor division, and % gives the remainder." },
      { title: "Forgetting operator order", explanation: "2 + 3 * 4 is 14 because multiplication happens first. Use (2 + 3) * 4 if you want 20." }
    ],
    recap: "Operators perform calculations. input() reads text, so convert numeric input before calculating. /, //, and % have different jobs: division, floor division, and remainder.",
    practice: [
      { title: "Calculate a remainder", prompt: "Use the remainder operator to print the remainder when 23 is divided by 5.", starter: "number = 23\ndivisor = 5\n# Calculate the remainder\n", solution: "number = 23\ndivisor = 5\nprint(number % divisor)", hint: "The % operator gives the remainder." },
      { title: "Make a simple calculator", prompt: "Read two whole numbers using input(), add them, and print the result. The playground's Program Input accepts one number per line.", starter: "first = int(input(\"First number: \"))\nsecond = int(input(\"Second number: \"))\n# Print their sum\n", solution: "first = int(input(\"First number: \"))\nsecond = int(input(\"Second number: \"))\nprint(first + second)", hint: "Convert each input with int(), then add the variables." },
      { title: "Explore division", prompt: "Print the results of 17 / 5, 17 // 5, and 17 % 5 on separate lines.", starter: "number = 17\ndivisor = 5\n", solution: "number = 17\ndivisor = 5\nprint(number / divisor)\nprint(number // divisor)\nprint(number % divisor)", hint: "/, //, and % mean division, floor division, and remainder." }
    ]
  },
  "conditions": {
    steps: [
      { number: "1", title: "Understand the condition", explanation: "An expression such as score >= 50 is checked as either True or False. Here, 72 >= 50 is True." },
      { number: "2", title: "Start a decision with if", explanation: "Write if followed by the condition and a colon: if score >= 50:. The colon marks the start of the block." },
      { number: "3", title: "Indent the instructions", explanation: "The indented lines underneath if run only when its condition is True. Consistent indentation shows which instructions belong to the block." },
      { number: "4", title: "Add another path with else", explanation: "else runs when the if condition is False. It does not need another condition." },
      { number: "5", title: "Check several possibilities with elif", explanation: "Python checks an elif condition only if the earlier if/elif conditions were false. It runs the first matching block and then skips the remaining branches." },
      { number: "6", title: "Combine conditions when needed", explanation: "and requires both conditions to be true; or requires at least one. not reverses a Boolean value." }
    ],
    mistakes: [
      { title: "Using = instead of ==", explanation: "Use = to assign a value, and == to compare two values. For example, score == 50 asks whether score equals 50." },
      { title: "Forgetting the colon", explanation: "An if, elif, or else header must end with a colon." },
      { title: "Indenting the block incorrectly", explanation: "The statements controlled by a condition must be indented underneath it." },
      { title: "Putting a broad elif before a narrow one", explanation: "Python stops at the first matching branch. Check more specific ranges before broader ones." }
    ],
    recap: "Conditions let a program choose what to do. if checks the first rule, elif checks another rule when earlier ones fail, and else handles the remaining case.",
    practice: [
      { title: "Check a pass mark", prompt: "If score is at least 50, print Passed. Otherwise print Keep practicing.", starter: "score = 46\n# Add your if/else here\n", solution: "score = 46\nif score >= 50:\n    print(\"Passed\")\nelse:\n    print(\"Keep practicing\")", hint: "Use if score >= 50: and an indented else block." },
      { title: "Combine two rules", prompt: "Print Eligible only when age is at least 15 AND has_permission is True.", starter: "age = 16\nhas_permission = True\n", solution: "age = 16\nhas_permission = True\nif age >= 15 and has_permission:\n    print(\"Eligible\")\nelse:\n    print(\"Not eligible\")", hint: "The and operator requires both conditions to be true." },
      { title: "Choose a category", prompt: "Print Small for numbers below 10, Medium for numbers from 10 to 19, and Large for 20 or more.", starter: "number = 14\n", solution: "number = 14\nif number < 10:\n    print(\"Small\")\nelif number < 20:\n    print(\"Medium\")\nelse:\n    print(\"Large\")", hint: "Check the smaller range first with if, then use elif and else." }
    ]
  },
  "loops": {
    steps: [
      { number: "1", title: "Identify the repeated instruction", explanation: "Move the instruction you want repeated into the indented body of a loop." },
      { number: "2", title: "Use for when you have a sequence", explanation: "for number in range(1, 6): repeats once for each number produced by range()." },
      { number: "3", title: "Understand range() boundaries", explanation: "range(1, 6) produces 1, 2, 3, 4, 5. The start is included, but the stop value (6) is not." },
      { number: "4", title: "Follow one iteration at a time", explanation: "On each pass, number gets the next value. The indented print(number) runs once for that value." },
      { number: "5", title: "Use while for a condition-controlled loop", explanation: "while count > 0: repeats as long as the condition is True. If count starts at 3 and decreases by 1 each time, the loop stops after 3, 2, and 1." },
      { number: "6", title: "Make sure the loop can finish", explanation: "Change the value that controls a while condition, or provide another clear way for the condition to become False." }
    ],
    mistakes: [
      { title: "Expecting range() to include its stop value", explanation: "range(1, 6) ends at 5. To include 6, use range(1, 7)." },
      { title: "Forgetting to indent the loop body", explanation: "Only indented statements belong to the loop and repeat." },
      { title: "Never updating a while-loop condition", explanation: "If count stays 3 in while count > 0, the condition remains True and the loop does not finish." },
      { title: "Changing a loop variable unexpectedly", explanation: "Update the variable deliberately so the sequence and stopping condition are easy to follow." }
    ],
    recap: "Loops repeat instructions. Use for to process a sequence or range, and while to repeat as long as a condition is true. Remember that range() stops before its end value and that while loops need a way to finish.",
    practice: [
      { title: "Count by twos", prompt: "Use a for loop and range() to print 2, 4, 6, 8, and 10.", starter: "# Write your loop below\n", solution: "for number in range(2, 11, 2):\n    print(number)", hint: "range(start, stop, step) can count by twos." },
      { title: "Add numbers with a loop", prompt: "Use a loop to calculate the total of the numbers from 1 through 5, then print the total.", starter: "total = 0\n# Add your loop below\nprint(total)", solution: "total = 0\nfor number in range(1, 6):\n    total += number\nprint(total)", hint: "Start total at 0 and add each number inside the loop." },
      { title: "Repeat until finished", prompt: "Use a while loop to print 3, 2, 1, then print Go!", starter: "count = 3\n", solution: "count = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint(\"Go!\")", hint: "Decrease count by 1 each time so the condition eventually becomes false." }
    ]
  }
};
