const lessons = [
{
 title:"Python Basics: variables & print()", short:"Variables & print()", level:"BEGINNER",
 intro:"Learn how Python stores information and displays results with variables and print().",
 idea:"A variable is a name that refers to a value. Assignment uses = to put a value into that name.",
 analogy:"Imagine labeled boxes. The label is the variable name and the thing inside the box is the value.",
 code:'name = "Python"\nprint(name)\nprint("Hello!")',
 objectives:["Create and update variables","Use strings and numbers as values","Display information with print()"],
 quiz:{q:"Which line correctly creates a variable called age?", options:['age == 15','age = 15','15 = age'], answer:1, explain:"A single = assigns the value on the right to the name on the left."},
 challenge:{mode:"code",title:"Create a greeting", prompt:'Create a variable called name containing a name, then print "Hello, " followed by the name.', hint:'Use name = "..." and print().', solution:'name = "Python"\nprint("Hello, " + name)', starter:""}
},
{
 title:"Data Types: strings, integers & floats", short:"Data types", level:"BEGINNER",
 intro:"Python values come in different types. Understanding the type helps you know what operations make sense.",
 idea:"Strings are text, integers are whole numbers, and floats are numbers with decimal parts. You can inspect a value with type().",
 analogy:"Think of types like different containers: a text container, a whole-number container and a decimal-number container.",
 code:'name = "Python"\nage = 14\nheight = 1.72\nprint(type(name))\nprint(type(age))\nprint(type(height))',
 objectives:["Recognize str, int and float","Use type() to inspect a value","Choose an appropriate type for simple data"],
 quiz:{q:"What type is 3.14?", options:["str","int","float"], answer:2, explain:"3.14 has a decimal part, so Python treats it as a float."},
 challenge:{mode:"code",title:"Store three types", prompt:"Create name as text, age as a whole number and height as a decimal. Print all three.", hint:"Use quotes for text and no quotes for numbers.", solution:'name = "Alex"\nage = 15\nheight = 1.70\nprint(name, age, height)', starter:""}
},
{
 title:"Operators & input()", short:"Operators & input", level:"BEGINNER",
 intro:"Use arithmetic operators to calculate values and input() to receive text from a user.",
 idea:"Python supports +, -, *, /, //, %, and **. input() returns what the user typed as a string.",
 analogy:"Operators are tools in a toolbox: + combines, * repeats or multiplies, / divides, and % finds a remainder.",
 code:'name = input("Your name: ")\nage = int(input("Your age: "))\nprint("Hello", name)\nprint("Next year:", age + 1)',
 objectives:["Use common arithmetic operators","Read text with input()","Convert numeric text with int()"],
 quiz:{q:"What does int(input()) usually do?", options:["Turns user input into an integer","Prints an integer automatically","Creates a list"], answer:0, explain:"input() gives text; int() converts numeric text into an integer."},
 challenge:{mode:"predict",title:"Predict the output", prompt:"What will this program print?", hint:"Follow the variable value step by step.", solution:"16", starter:"age = 15\nprint(age + 1)"}
},
{
 title:"Conditions: if, elif & else", short:"if / elif / else", level:"BEGINNER",
 intro:"Conditions let your program make decisions based on whether an expression is true or false.",
 idea:"Python checks the condition after if. If it is false, elif or else can provide another path.",
 analogy:"It is like a decision gate: if the rule is true, walk through that door; otherwise choose another door.",
 code:'score = 72\nif score >= 50:\n    print("Passed!")\nelse:\n    print("Try again.")',
 objectives:["Write an if statement","Compare values with >, <, >=, <= and ==","Use else and elif for alternative paths"],
 quiz:{q:"Which operator checks whether two values are equal?", options:["=","==","!="], answer:1, explain:"= assigns a value; == compares two values."},
 challenge:{mode:"debug",title:"Fix the broken code", prompt:"Fix the syntax and indentation errors so the program prints Passed.", hint:"The if line needs a colon, and the print line must be indented.", solution:'score = 65\nif score >= 50:\n    print("Passed")\nelse:\n    print("Failed")', starter:'score = 65\nif score >= 50\nprint("Passed")'}
},
{
 title:"Loops: for & while", short:"for & while", level:"BEGINNER",
 intro:"Loops repeat instructions so you do not have to write the same code again and again.",
 idea:"A for loop is great for repeating over a sequence or range. A while loop continues while a condition stays true.",
 analogy:"A loop is an automatic worker: give it a rule and it keeps doing the task until the rule says stop.",
 code:'for number in range(1, 6):\n    print(number)\n\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1',
 objectives:["Use range() with for","Understand repeated execution","Create a simple while loop"],
 quiz:{q:"How many values does range(1, 5) produce?", options:["4","5","6"], answer:0, explain:"It starts at 1 and stops before 5: 1, 2, 3, 4."},
 challenge:{mode:"code",title:"Count to five", prompt:"Use a for loop with range() to print the numbers 1 through 5.", hint:"Remember that range(1, 6) stops before 6.", solution:"for number in range(1, 6):\n    print(number)", starter:""}
},
{
 title:"Functions: reusable code", short:"Functions", level:"BEGINNER",
 intro:"Functions package instructions into reusable blocks. They can accept arguments and return values.",
 idea:"Use def to define a function. Parameters are inputs, and return sends a result back to the caller.",
 analogy:"A function is like a machine: put something in, let the machine follow its recipe, and get a result out.",
 code:'def greet(name):\n    return f"Hello, {name}!"\n\nmessage = greet("Python")\nprint(message)',
 objectives:["Define a function with def","Pass arguments to a function","Return and use a result"],
 quiz:{q:"Which keyword sends a result back from a function?", options:["send","return","give"], answer:1, explain:"return ends the function and sends a value back to the caller."},
 challenge:{mode:"code",title:"Double a number", prompt:"Write a function double(number) that returns number * 2, then print double(6).", hint:"Define the function, use return, then call it.", solution:"def double(number):\n    return number * 2\n\nprint(double(6))", starter:""}
},
{
 title:"Lists & dictionaries", short:"Lists & dictionaries", level:"INTERMEDIATE",
 intro:"Collections let you store multiple related values and work with them using indexes, keys and loops.",
 idea:"Lists are ordered collections accessed by position. Dictionaries store key-value pairs and are useful for structured information.",
 analogy:"A list is like numbered lockers. A dictionary is like labeled drawers where each label points to a value.",
 code:'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\n\nstudent = {"name": "Mika", "score": 92}\nprint(student["name"])\nprint(student["score"])',
 objectives:["Create and index a list","Create and read dictionary key-value pairs","Loop through a collection"],
 quiz:{q:"How do you access the first item of a list called items?", options:["items[1]","items[0]","items.first"], answer:1, explain:"Python lists use zero-based indexing, so the first item is at index 0."},
 challenge:{mode:"mcq",title:"Choose the right tool", prompt:"Which Python expression correctly adds all values in numbers = [2, 4, 6]?", hint:"Look for the built-in function designed to total numeric values.", options:["len(numbers)","sum(numbers)","add(numbers)"], answer:1, solution:"sum(numbers)", starter:""}
},
{
 title:"Errors & modules", short:"Errors & modules", level:"INTERMEDIATE",
 intro:"Real programs encounter errors. Learn to read common errors and organize code with modules.",
 idea:"Exceptions describe problems during execution. import lets you use functionality from Python modules such as math.",
 analogy:"An error message is a mechanic's note: it tells you where the machine had trouble and often gives a clue about why.",
 code:'import math\n\ntry:\n    number = float("25")\n    print(math.sqrt(number))\nexcept ValueError:\n    print("That was not a valid number.")',
 objectives:["Recognize common error messages","Use import to access a module","Handle a simple exception with try/except"],
 quiz:{q:"Which keyword imports a module?", options:["include","import","module"], answer:1, explain:"Python uses import followed by the module name."},
 challenge:{mode:"code",title:"Use math", prompt:"Import math and print the square root of 49 using math.sqrt().", hint:"The result should be 7.0.", solution:"import math\nprint(math.sqrt(49))", starter:""}
},

{
 title:"String Skills", short:"Strings & text", level:"INTERMEDIATE",
 intro:"Work with text using indexing, slicing, methods and formatted strings.",
 idea:"Strings are sequences of characters. You can inspect parts of them, change their presentation with methods, and build readable messages with f-strings.",
 analogy:"A string is like a row of letters on a strip of paper: you can point to a position, cut out a section, or transform the text.",
 code:'text = "Python is fun"\nprint(text[0])\nprint(text[0:6])\nprint(text.upper())\nname = "Alex"\nprint(f"Hello, {name}!")',
 objectives:["Index and slice strings","Use common string methods","Build messages with f-strings"],
 quiz:{q:"What does text[0:3] return for text = \"Python\"?", options:["Pyt","Pyth","yth"], answer:0, explain:"Slicing starts at index 0 and stops before index 3, so the result is Pyt."},
 challenge:{mode:"fill",title:"Fill the missing line", prompt:"Complete the missing line so the program prints Hello, Alex! using the existing name variable.", hint:"An f-string can place a variable inside curly braces.", solution:'name = "Alex"\nprint(f"Hello, {name}!")', starter:'name = "Alex"\n{{answer}}\n', fillAnswer:'print(f"Hello, {name}!")'}
},
{
 title:"Tuples & sets", short:"Tuples & sets", level:"INTERMEDIATE",
 intro:"Learn two useful collection types: tuples for fixed ordered data and sets for unique values.",
 idea:"Tuples are ordered and immutable. Sets store unique values and are useful when duplicates should disappear.",
 analogy:"A tuple is like a sealed row of labeled seats that should not be rearranged; a set is like a basket that keeps one copy of each item.",
 code:'point = (10, 20)\nprint(point[0])\n\ncolors = {"red", "blue", "red"}\nprint(colors)',
 objectives:["Create and index tuples","Understand that tuples are immutable","Create sets and remove duplicate values"],
 quiz:{q:"Which collection automatically keeps only unique values?", options:["list","set","tuple"], answer:1, explain:"A set stores unique elements, so duplicate values are removed."},
 challenge:{mode:"code",title:"Remove duplicates", prompt:"Create values = {1, 2, 2, 3} and print the set. It should contain only 1, 2 and 3.", hint:"Use curly braces to create a set.", solution:"values = {1, 2, 2, 3}\nprint(values)", starter:""}
},
{
 title:"Comprehensions", short:"List comprehensions", level:"INTERMEDIATE",
 intro:"Build lists compactly by combining a loop and an expression in one readable line.",
 idea:"A list comprehension creates a new list by applying an expression to each item in an iterable, optionally with a condition.",
 analogy:"Instead of telling a worker every tiny step, a comprehension gives the worker one recipe: take each item, transform it, and collect the results.",
 code:'squares = [number * number for number in range(1, 6)]\nprint(squares)\nevens = [n for n in range(1, 11) if n % 2 == 0]\nprint(evens)',
 objectives:["Read a basic list comprehension","Create transformed lists","Add a condition to a comprehension"],
 quiz:{q:"What does [x * 2 for x in range(3)] produce?", options:["[0, 2, 4]","[2, 4, 6]","[0, 1, 2]"], answer:0, explain:"range(3) gives 0, 1, 2, and each value is multiplied by 2."},
 challenge:{mode:"debug",title:"Debug the list", prompt:"Fix the code so it creates the five square numbers and prints the list.", hint:"The range should reach 5, and the list comprehension needs a closing bracket.", solution:"squares = [n * n for n in range(1, 6)]\nprint(squares)", starter:"squares = [n * n for n in range(1, 5)\nprint(squares)"}
},
{
 title:"File handling", short:"Read & write files", level:"INTERMEDIATE",
 intro:"Learn how Python reads from and writes to text files using with open().",
 idea:"The open() function gives your program access to a file. Using with closes the file automatically when the block finishes.",
 analogy:"Opening a file is like checking a notebook out of a library: use it, then return it properly when you are done.",
 code:'with open("notes.txt", "w") as file:\n    file.write("Python is useful!\n")\n\nwith open("notes.txt", "r") as file:\n    content = file.read()\nprint(content)',
 objectives:["Open files safely with with","Write text to a file","Read text from a file"],
 quiz:{q:"Which mode opens a file for writing and replaces its old contents?", options:["r","w","a"], answer:1, explain:"w means write mode and creates or replaces the file."},
 challenge:{mode:"code",title:"Write a note", prompt:"Use with open(\"note.txt\", \"w\") to write the text \"Hello Python\" to a file.", hint:"Call file.write(\"Hello Python\").", solution:'with open("note.txt", "w") as file:\n    file.write("Hello Python")', starter:""}
},
{
 title:"Object-oriented Python", short:"Classes & objects", level:"INTERMEDIATE",
 intro:"Learn the basics of classes and objects so you can model related data and behavior together.",
 idea:"A class is a blueprint. An object is an instance created from that blueprint. Methods are functions defined inside a class.",
 analogy:"A class is a cookie cutter and an object is a cookie made from it. You can make many objects from one class design.",
 code:'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        return f"{self.name} says woof!"\n\ndog = Dog("Max")\nprint(dog.bark())',
 objectives:["Define a simple class","Create objects from a class","Use self and instance methods"],
 quiz:{q:"What is an object created from a class?", options:["An instance","A module","A loop"], answer:0, explain:"An object is an instance of a class."},
 challenge:{mode:"code",title:"Create a Person", prompt:"Define a Person class with __init__(self, name) storing self.name, create Person(\"Alex\"), and print the name.", hint:"Store the argument with self.name = name, then access person.name.", solution:'class Person:\n    def __init__(self, name):\n        self.name = name\n\nperson = Person("Alex")\nprint(person.name)', starter:""}
},
{
 title:"APIs & JSON", short:"APIs & JSON", level:"INTERMEDIATE",
 intro:"Learn how programs exchange structured data using JSON and HTTP APIs.",
 idea:"An API lets one program request data or actions from another service. JSON is a common text format for structured data such as objects and lists.",
 analogy:"An API is like a waiter carrying a request to the kitchen and bringing back the result. JSON is the organized order slip.",
 code:'import json\ndata = json.loads(\'{"name":"Python","version":3}\')\nprint(data["name"])\nprint(data["version"])',
 objectives:["Understand what an API provides","Parse JSON with json.loads()","Read values from JSON data"],
 quiz:{q:"Which Python module can parse JSON text?", options:["json","api","http"], answer:0, explain:"Python's built-in json module provides functions such as json.loads()."},
 challenge:{mode:"predict",title:"Predict the JSON value", prompt:"What value will this program print?", hint:"json.loads turns the JSON text into a Python dictionary.", solution:"95", starter:`import json\ndata = json.loads('{"score": 95}')\nprint(data["score"])`}
}

];

const foundationPractice = {
  0: [
    {title:"Update a score",prompt:"Create score = 10, add 5 to it, then print the updated score.",starter:"score = 10\n# Update the score below\n\nprint(score)",solution:"score = 10\nscore = score + 5\nprint(score)",hint:"Assign score + 5 back to the score variable."},
    {title:"Build a short introduction",prompt:"Store your name and a favorite subject in two variables. Print one sentence using both.",starter:'name = "Alex"\nsubject = "Science"\n# Write your print() line below\n',solution:'name = "Alex"\nsubject = "Science"\nprint("My name is", name, "and I like", subject)',hint:"print() can display several comma-separated values."},
    {title:"Predict a variable change",prompt:"Before running the code, predict the final value of total. Then try it in the playground.",starter:"total = 4\ntotal = total + 3\ntotal = total * 2\nprint(total)",solution:"total = 14",hint:"Follow each assignment in order: first add, then multiply."}
  ],
  1: [
    {title:"Convert text to a number",prompt:"Convert the text value price_text into a float, then print the number plus 2.",starter:'price_text = "12.5"\n# Convert and calculate\n',solution:'price_text = "12.5"\nprice = float(price_text)\nprint(price + 2)',hint:"Use float(price_text) to convert decimal text."},
    {title:"Check the types",prompt:"Create a string, an integer, and a float. Print type() for each one.",starter:'city = "Addis Ababa"\npopulation = 500\naverage = 2.5\n',solution:'city = "Addis Ababa"\npopulation = 500\naverage = 2.5\nprint(type(city))\nprint(type(population))\nprint(type(average))',hint:"Call type(variable) inside print()."},
    {title:"Fix the type mismatch",prompt:"Fix the program so it prints 18 instead of joining text and a number.",starter:'age_text = "17"\nprint(age_text + 1)',solution:'age_text = "17"\nage = int(age_text)\nprint(age + 1)',hint:"Convert the numeric text with int() before adding."}
  ],
  2: [
    {title:"Calculate a remainder",prompt:"Use the remainder operator to print the remainder when 23 is divided by 5.",starter:"number = 23\ndivisor = 5\n# Calculate the remainder\n",solution:"number = 23\ndivisor = 5\nprint(number % divisor)",hint:"The % operator gives the remainder."},
    {title:"Make a simple calculator",prompt:"Read two whole numbers using input(), add them, and print the result. The playground's Program Input accepts one number per line.",starter:'first = int(input("First number: "))\nsecond = int(input("Second number: "))\n# Print their sum\n',solution:'first = int(input("First number: "))\nsecond = int(input("Second number: "))\nprint(first + second)',hint:"Convert each input with int(), then add the variables."},
    {title:"Explore division",prompt:"Print the results of 17 / 5, 17 // 5, and 17 % 5 on separate lines.",starter:"number = 17\ndivisor = 5\n",solution:"number = 17\ndivisor = 5\nprint(number / divisor)\nprint(number // divisor)\nprint(number % divisor)",hint:"/, //, and % mean division, floor division, and remainder."}
  ],
  3: [
    {title:"Check a pass mark",prompt:"If score is at least 50, print Passed. Otherwise print Keep practicing.",starter:"score = 46\n# Add your if/else here\n",solution:'score = 46\nif score >= 50:\n    print("Passed")\nelse:\n    print("Keep practicing")',hint:"Use if score >= 50: and an indented else block."},
    {title:"Combine two rules",prompt:"Print Eligible only when age is at least 15 AND has_permission is True.",starter:"age = 16\nhas_permission = True\n",solution:'age = 16\nhas_permission = True\nif age >= 15 and has_permission:\n    print("Eligible")\nelse:\n    print("Not eligible")',hint:"The and operator requires both conditions to be true."},
    {title:"Choose a category",prompt:"Print Small for numbers below 10, Medium for numbers from 10 to 19, and Large for 20 or more.",starter:"number = 14\n",solution:'number = 14\nif number < 10:\n    print("Small")\nelif number < 20:\n    print("Medium")\nelse:\n    print("Large")',hint:"Check the smaller range first with if, then use elif and else."}
  ],
  4: [
    {title:"Count by twos",prompt:"Use a for loop and range() to print 2, 4, 6, 8, and 10.",starter:"# Write your loop below\n",solution:"for number in range(2, 11, 2):\n    print(number)",hint:"range(start, stop, step) can count by twos."},
    {title:"Add numbers with a loop",prompt:"Use a loop to calculate the total of the numbers from 1 through 5, then print the total.",starter:"total = 0\n# Add your loop below\nprint(total)",solution:"total = 0\nfor number in range(1, 6):\n    total += number\nprint(total)",hint:"Start total at 0 and add each number inside the loop."},
    {title:"Repeat until finished",prompt:"Use a while loop to print 3, 2, 1, then print Go!",starter:"count = 3\n",solution:'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint("Go!")',hint:"Decrease count by 1 each time so the condition eventually becomes false."}
  ]
};

const deepData = [
  {
    steps:[
      ["1","Give a value a name","Write a clear variable name, then use = to assign a value: score = 10. The name now refers to the value 10."],
      ["2","Display the value","print(score) asks Python to display the current value stored under score. It does not change the variable."],
      ["3","Update the value","score = score + 5 means: read the old score (10), add 5, then store the result (15) back in score."],
      ["4","Use the updated value","After that assignment, print(score) displays 15. Later lines see the new value, not the old one."],
      ["5","Keep text and numbers clear","Text needs quotation marks, such as name = \"Mika\". A number such as age = 15 does not need quotes."]
    ],
    mistakes:[
      ["Using == when assigning","Use one = to assign a value. Two equals signs (==) ask whether two values are equal."],
      ["Forgetting quotes around text","name = Mika makes Python look for a variable named Mika. Write name = \"Mika\" for text."],
      ["Thinking assignment is an equation","score = score + 5 is an instruction to update a value, not a claim that both sides are mathematically equal."],
      ["Changing capitalization","Python treats score, Score, and SCORE as three different names."]
    ],
    recap:"A variable is a name connected to a value. = assigns or updates that value, and print() displays it. When you assign to the same variable again, the new value replaces the old one."
  },
  {
    steps:[
      ["1","Read the value, not just how it looks","\"17\" is a string (text), while 17 is an integer. They may look similar on screen, but Python treats them differently."],
      ["2","Recognize the three common types","str stores text, int stores whole numbers, and float stores numbers with decimal parts."],
      ["3","Use quotes for strings","city = \"Addis Ababa\" is text. The quotation marks tell Python to treat the characters as a string."],
      ["4","Inspect a value with type()","type(age) reports the kind of value stored in age. For example, type(17) is int and type(17.0) is float."],
      ["5","Convert when the operation needs it","int(\"17\") converts numeric text to 17. float(\"2.5\") converts numeric text to 2.5. The text must contain a valid number."],
      ["6","Choose the type that matches the task","Use a string for a name, an integer for a whole-number count, and a float when a decimal value is useful."]
    ],
    mistakes:[
      ["Putting a number in quotes by accident","\"15\" is text, not an integer. Convert it with int() before integer arithmetic."],
      ["Expecting int() to keep a decimal part","int(4.8) becomes 4. Use float() when you need to keep the decimal value."],
      ["Confusing a value with its type","17 is the value; int is its type. type(17) lets you inspect the type."],
      ["Trying to convert ordinary words into numbers","int(\"hello\") cannot work because \"hello\" does not represent a whole number."]
    ],
    recap:"str is for text, int is for whole numbers, and float is for decimal numbers. Use type() to inspect a value and int() or float() to convert valid numeric text."
  },
  {
    steps:[
      ["1","Choose the operation","Use + to add, - to subtract, * to multiply, / for division, // for floor division, % for a remainder, and ** for a power."],
      ["2","Follow the order of calculation","Parentheses are handled first, then powers, then multiplication/division, then addition/subtraction. Use parentheses when you want to make the order obvious."],
      ["3","Read input from the user","input(\"Your age: \") displays a prompt and waits for typing. Whatever the user types is returned as a string."],
      ["4","Convert before doing number work","age_text = input(...) gives text. age = int(age_text) converts valid whole-number text so age + 1 performs addition."],
      ["5","Store and use the result","next_age = age + 1 calculates a new value. print(next_age) displays it; the calculation itself does not ask the user for more input."],
      ["6","Compare the division operators","For 17 and 5, 17 / 5 is 3.4, 17 // 5 is 3, and 17 % 5 is 2."]
    ],
    mistakes:[
      ["Assuming input() returns a number","input() always returns text. Convert it with int() or float() before numeric calculations."],
      ["Joining text instead of adding numbers","\"17\" + \"2\" produces \"172\". int(\"17\") + int(\"2\") produces 19."],
      ["Mixing up /, //, and %","/ gives ordinary division, // gives floor division, and % gives the remainder."],
      ["Forgetting operator order","2 + 3 * 4 is 14 because multiplication happens first. Use (2 + 3) * 4 if you want 20."]
    ],
    recap:"Operators perform calculations. input() reads text, so convert numeric input before calculating. /, //, and % have different jobs: division, floor division, and remainder."
  },
  {
    steps:[
      ["1","Understand the condition","An expression such as score >= 50 is checked as either True or False. Here, 72 >= 50 is True."],
      ["2","Start a decision with if","Write if followed by the condition and a colon: if score >= 50:. The colon marks the start of the block."],
      ["3","Indent the instructions","The indented lines underneath if run only when its condition is True. Consistent indentation shows which instructions belong to the block."],
      ["4","Add another path with else","else runs when the if condition is False. It does not need another condition."],
      ["5","Check several possibilities with elif","Python checks an elif condition only if the earlier if/elif conditions were false. It runs the first matching block and then skips the remaining branches."],
      ["6","Combine conditions when needed","and requires both conditions to be true; or requires at least one. not reverses a Boolean value."]
    ],
    mistakes:[
      ["Using = instead of ==","Use = to assign a value, and == to compare two values. For example, score == 50 asks whether score equals 50."],
      ["Forgetting the colon","An if, elif, or else header must end with a colon."],
      ["Indenting the block incorrectly","The statements controlled by a condition must be indented underneath it."],
      ["Putting a broad elif before a narrow one","Python stops at the first matching branch. Check more specific ranges before broader ones."]
    ],
    recap:"Conditions let a program choose what to do. if checks the first rule, elif checks another rule when earlier ones fail, and else handles the remaining case."
  },
  {
    steps:[
      ["1","Identify the repeated instruction","Move the instruction you want repeated into the indented body of a loop."],
      ["2","Use for when you have a sequence","for number in range(1, 6): repeats once for each number produced by range()."],
      ["3","Understand range() boundaries","range(1, 6) produces 1, 2, 3, 4, 5. The start is included, but the stop value (6) is not."],
      ["4","Follow one iteration at a time","On each pass, number gets the next value. The indented print(number) runs once for that value."],
      ["5","Use while for a condition-controlled loop","while count > 0: repeats as long as the condition is True. If count starts at 3 and decreases by 1 each time, the loop stops after 3, 2, and 1."],
      ["6","Make sure the loop can finish","Change the value that controls a while condition, or provide another clear way for the condition to become False."]
    ],
    mistakes:[
      ["Expecting range() to include its stop value","range(1, 6) ends at 5. To include 6, use range(1, 7)."],
      ["Forgetting to indent the loop body","Only indented statements belong to the loop and repeat."],
      ["Never updating a while-loop condition","If count stays 3 in while count > 0, the condition remains True and the loop does not finish."],
      ["Changing a loop variable unexpectedly","Update the variable deliberately so the sequence and stopping condition are easy to follow."]
    ],
    recap:"Loops repeat instructions. Use for to process a sequence or range, and while to repeat as long as a condition is true. Remember that range() stops before its end value and that while loops need a way to finish."
  },
  {
    steps:[
      ["1","Create a list","Use square brackets and separate items with commas."],
      ["2","Use an index","Python starts list indexes at 0, so the first item is items[0]."],
      ["3","Create a dictionary","Use key:value pairs inside curly braces."],
      ["4","Read and process data","Use keys for dictionaries and indexes or loops for lists."]
    ],
    mistakes:[
      ["Using index 1 for the first list item","Python uses zero-based indexing."],
      ["Using a list index on a dictionary","Dictionaries are normally accessed by their keys."],
      ["Mixing up [] and {}","Lists use []; dictionaries use {}."]
    ],
    recap:"Lists store ordered items, while dictionaries store key-value pairs."
  },
  {
    steps:[
      ["1","Read the error","The exception type and message often tell you what went wrong."],
      ["2","Import a module","Use import followed by the module name, such as import math."],
      ["3","Call module functionality","Access functions with the module name, such as math.sqrt(49)."],
      ["4","Handle expected problems","try/except can keep a known error from stopping the whole program."]
    ],
    mistakes:[
      ["Ignoring the traceback","Read the last part of the error message for useful clues."],
      ["Forgetting to import a module","Python needs import math before using math.sqrt()."],
      ["Catching the wrong exception","Handle the specific error your code can reasonably produce."]
    ],
    recap:"Errors provide clues, modules add reusable functionality, and try/except handles expected exceptions."
  }

  ,{
    steps:[["1","Treat text as a sequence","Strings contain characters that you can index and slice."],["2","Use string methods","Methods such as upper(), lower(), and strip() transform or inspect text."],["3","Build readable messages","f-strings let you insert values directly into text."],["4","Practice slicing","A slice starts at one index and stops before the end index."]],
    mistakes:[["Forgetting zero-based indexing","The first character is at index 0."],["Expecting the end index to be included","text[0:3] stops before index 3."],["Mixing quotes and f-string syntax","An f-string needs an f before the opening quote."]],
    recap:"Strings are sequences of text, and Python provides powerful tools for indexing, slicing, formatting, and transforming them."
  },
  {
    steps:[["1","Create a tuple","Use parentheses and commas for ordered fixed data."],["2","Read tuple items","Use indexes just like with lists."],["3","Create a set","Use curly braces when you need unique values."],["4","Choose the right collection","Use tuples for fixed ordered data and sets for uniqueness."]],
    mistakes:[["Trying to change a tuple","Tuples are immutable."],["Expecting set order","Sets are not used for reliable positional order."],["Using an empty set with {}","{} creates an empty dictionary; use set() for an empty set."]],
    recap:"Tuples keep ordered immutable data, while sets keep unique values."
  },
  {
    steps:[["1","Choose the source","Start with an iterable such as range(1, 6)."],["2","Write the expression","Decide what each item should become."],["3","Add the loop","Use for to produce one result per source item."],["4","Add a condition if needed","An if at the end can filter the items."]],
    mistakes:[["Reading the order incorrectly","The expression comes before the for part."],["Forgetting brackets","A list comprehension uses square brackets."],["Making it too complicated","Use a normal loop when a comprehension becomes hard to read."]],
    recap:"List comprehensions create lists compactly by combining an expression, a loop, and optionally a condition."
  },
  {
    steps:[["1","Open the file","Use with open(filename, mode) as file."],["2","Choose a mode","r reads, w writes, and a appends."],["3","Read or write","Use read(), write(), or other file methods."],["4","Let with close it","The with block handles closing the file for you."]],
    mistakes:[["Using the wrong mode","w replaces old contents; a adds to the end."],["Forgetting the with block indentation","File operations belong inside the block."],["Using an unavailable file path","Make sure the file location is correct."]],
    recap:"with open() makes file access safer and clearer by handling the file lifecycle automatically."
  },
  {
    steps:[["1","Define a class","Use class followed by the class name and a colon."],["2","Initialize objects","__init__ runs when a new object is created."],["3","Store instance data","Use self.name or similar attributes."],["4","Add methods","Methods describe behavior that objects can perform."]],
    mistakes:[["Forgetting self","Instance methods need self as their first parameter."],["Confusing class and object","The class is the blueprint; the object is an instance."],["Calling a method without an object","Usually call object.method() so self is supplied automatically."]],
    recap:"Classes define blueprints for objects, which combine data and behavior in reusable structures."
  },
  {
    steps:[["1","Understand the request","An API exposes data or actions that another program can use."],["2","Recognize JSON","JSON commonly represents objects as key-value pairs and arrays as lists."],["3","Parse JSON","json.loads() turns JSON text into Python data."],["4","Use the data","Access dictionary keys and list items just like normal Python values."]],
    mistakes:[["Confusing JSON with a Python dictionary","JSON is text until you parse it."],["Forgetting to import json","Use import json before json.loads()."],["Using the wrong key","The key must match the JSON data exactly."]],
    recap:"APIs let programs communicate, and JSON is a common format for structured data exchanged between them."
  }

];

lessons.forEach((lesson,index)=>Object.assign(lesson,deepData[index]||{}));

export { lessons, foundationPractice };
