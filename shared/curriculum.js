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

export { lessons };
