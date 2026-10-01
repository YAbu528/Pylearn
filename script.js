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
 challenge:{mode:"fill",title:"Fill the missing line", prompt:"Complete the missing line so the program prints Hello, Alex! using the existing name variable.", hint:"An f-string can place a variable inside curly braces.", solution:'name = "Alex"\nprint(f"Hello, {name}!")', starter:'name = "Alex"\n# Write your print line below\n'}
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


// Detailed lesson guidance used by the "Step by step", "Common mistakes",
// and "Quick recap" panels. Keep one entry for each lesson above.
const deepData = [
  {
    steps:[
      ["1","Create a variable","Use a clear name, then assign a value with =."],
      ["2","Store useful values","Variables can hold text, numbers, and other Python values."],
      ["3","Display the value","Use print() to send a value or message to the output."],
      ["4","Change a variable","Assignment can give the same variable a new value later."]
    ],
    mistakes:[
      ["Using == instead of =","== compares values; = assigns a value."],
      ["Forgetting quotes around text","Text such as Python needs quotes: \"Python\"."],
      ["Misspelling a variable name","Python treats name and Name as different names."]
    ],
    recap:"Variables give values names, and print() displays information."
  },
  {
    steps:[
      ["1","Recognize the type","Text is str, whole numbers are int, and decimal numbers are float."],
      ["2","Write values correctly","Strings use quotes; numbers normally do not."],
      ["3","Check a type","Use type(value) when you need to inspect what Python sees."],
      ["4","Choose the right type","Use the type that matches the kind of information you are storing."]
    ],
    mistakes:[
      ["Putting numbers in quotes","\"15\" is text, while 15 is an integer."],
      ["Calling every decimal an int","A value such as 1.7 is a float."],
      ["Confusing value and type","15 is the value; int is its type."]
    ],
    recap:"Strings hold text, ints hold whole numbers, and floats hold decimal numbers."
  },
  {
    steps:[
      ["1","Use arithmetic operators","Python can add, subtract, multiply, divide, find remainders, and use powers."],
      ["2","Get user input","input() reads what the user types and returns it as text."],
      ["3","Convert numeric input","Use int() or float() when text needs to become a number."],
      ["4","Use the result","Store the converted value in a variable and calculate with it."]
    ],
    mistakes:[
      ["Forgetting input() returns text","Convert numeric input before doing arithmetic."],
      ["Using / when you need whole-number division","// performs floor division."],
      ["Doing arithmetic on unconverted input","For example, \"15\" + 1 causes a type error."]
    ],
    recap:"Operators calculate values, while input() reads text that can be converted into numbers."
  },
  {
    steps:[
      ["1","Write a condition","A comparison such as score >= 50 produces True or False."],
      ["2","Start with if","Put the condition after if and finish the line with a colon."],
      ["3","Indent the block","The indented lines run when the condition is true."],
      ["4","Handle the other case","Use else or elif when another path is needed."]
    ],
    mistakes:[
      ["Using = for comparison","Use == to compare; use = to assign."],
      ["Forgetting the colon","if score >= 50: needs the colon."],
      ["Bad indentation","The code inside the condition must be indented consistently."]
    ],
    recap:"if/elif/else lets a program choose different actions based on conditions."
  },
  {
    steps:[
      ["1","Choose what repeats","Put the instruction you want to repeat inside the loop."],
      ["2","Use for with range()","range() creates a sequence of numbers for controlled repetition."],
      ["3","Indent the loop body","Indented code runs once for each loop iteration."],
      ["4","Know when to stop","A for loop follows its sequence; a while loop needs its condition to become false."]
    ],
    mistakes:[
      ["Forgetting that range stops before its end","range(1, 6) gives 1 through 5."],
      ["Forgetting indentation","The repeated statements must be inside the loop."],
      ["Creating an endless while loop","Make sure the condition can eventually become false."]
    ],
    recap:"Loops repeat code. for is useful for sequences, while repeats while a condition remains true."
  },
  {
    steps:[
      ["1","Define the function","Start with def, the function name, and parentheses."],
      ["2","Add parameters","Parameters let a function receive values from the caller."],
      ["3","Write the function body","Indent the instructions that belong to the function."],
      ["4","Return and call","return sends a result back, and calling the function runs it."]
    ],
    mistakes:[
      ["Forgetting the colon","A function definition ends with a colon."],
      ["Confusing parameter and argument","The parameter is in the definition; the argument is the value passed when calling."],
      ["Printing when you need a returned value","print() displays; return sends a value back to the caller."]
    ],
    recap:"Functions package reusable instructions and can accept inputs and return results."
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

const badges = [
 {id:"first", medal:"🌱", name:"First Steps", desc:"Complete your first lesson.", goal:"Complete 1 lesson", test:s=>s.done.length>=1, progress:s=>[Math.min(s.done.length,1),1]},
 {id:"code", medal:"💻", name:"First Code", desc:"Run your first Python program.", goal:"Run Python 1 time", test:s=>s.runs>=1, progress:s=>[Math.min(s.runs,1),1]},
 {id:"challenge", medal:"⚔️", name:"Challenge Accepted", desc:"Solve your first coding challenge.", goal:"Solve 1 challenge", test:s=>s.challenges.length>=1, progress:s=>[Math.min(s.challenges.length,1),1]},
 {id:"five", medal:"🔥", name:"On a Roll", desc:"Complete five lessons.", goal:"Complete 5 lessons", test:s=>s.done.length>=5, progress:s=>[Math.min(s.done.length,5),5]},
 {id:"quiz", medal:"🧠", name:"Quiz Master", desc:"Answer every lesson quiz correctly.", goal:`Master all ${lessons.length} quizzes`, test:s=>s.quiz.length>=lessons.length, progress:s=>[Math.min(s.quiz.length,lessons.length),lessons.length]},
 {id:"builder", medal:"🛠️", name:"Code Builder", desc:"Solve three coding challenges.", goal:"Solve 3 challenges", test:s=>s.challenges.length>=3, progress:s=>[Math.min(s.challenges.length,3),3]},
 {id:"week", medal:"🔥", name:"Week Warrior", desc:"Build a seven-day learning streak.", goal:"Reach a 7-day streak", test:s=>s.streak>=7, progress:s=>[Math.min(s.streak,7),7]},
 {id:"python", medal:"🐍", name:"Python Fundamentals", desc:"Complete the full current learning path.", goal:`Complete all ${lessons.length} lessons`, test:s=>s.done.length>=lessons.length, progress:s=>[Math.min(s.done.length,lessons.length),lessons.length]},
 {id:"explorer", medal:"🧭", name:"Python Explorer", desc:"Reach 500 XP through real learning actions.", goal:"Earn 500 XP", test:s=>s.xp>=500, progress:s=>[Math.min(s.xp,500),500]}
];

function readLocalJSON(key, fallback){
  try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)); }
  catch { return fallback; }
}
let current = Number(localStorage.getItem("pylearn_current") || 0);
current = Number.isInteger(current) ? Math.max(0, Math.min(current, lessons.length-1)) : 0;
let state = readLocalJSON("pylearn_state", {done:[],quiz:[],challenges:[],runs:0,xp:0,streak:0,lastDay:""});
state.done=Array.isArray(state.done)?state.done.filter(Number.isInteger):[];
state.quiz=Array.isArray(state.quiz)?state.quiz.filter(Number.isInteger):[];
state.challenges=Array.isArray(state.challenges)?state.challenges.filter(Number.isInteger):[];
state.runs = Number(state.runs || 0);
state.xp = Number(state.xp || 0);
state.streak = Number(state.streak || 0);
let bookmarks = readLocalJSON("pylearn_bookmarks", []).filter(i=>Number.isInteger(i) && i>=0 && i<lessons.length);
let notes = readLocalJSON("pylearn_notes", {});
let pythonWorker = null, pythonReady = false, pythonLoading = null, quizAnswered = false, runCount = 0, activeOutput = "", runTimer = null;

const projects = [
  {id:"calculator", icon:"🧮", level:"BEGINNER", title:"Smart Calculator", req:5, skills:"variables · input · operators · conditions · functions", mission:"Build a calculator that asks for two numbers and an operation, then prints the result.", checklist:["Ask the user for two numbers","Ask for +, -, *, or /","Use a condition to choose the operation","Print a clear result"], hints:"Convert numeric input with float(). Start with if / elif for the operations.", starter:`print("Smart Calculator")

a = float(input("First number: "))
b = float(input("Second number: "))
operation = input("Operation (+, -, *, /): ")

# TODO: choose the operation and print the result
`, testText:"Build the calculator behavior yourself."},
  {id:"guess", icon:"🎲", level:"BEGINNER", title:"Number Guessing Game", req:8, skills:"loops · conditions · input · random", mission:"Make a game that chooses a secret number and keeps asking until the player guesses it.", checklist:["Generate a secret number","Ask for guesses in a loop","Tell the player higher or lower","Stop when the guess is correct"], hints:"The random module can generate the secret number. Use while for repeated guesses.", starter:`import random

secret = random.randint(1, 20)

# TODO: keep asking for guesses until the player wins
`, testText:"Make the game repeat until the correct number is guessed."},
  {id:"todo", icon:"📝", level:"CORE", title:"To-Do List", req:8, skills:"lists · loops · functions · conditions", mission:"Create a small command-line to-do list where the user can add, view, and remove tasks.", checklist:["Store tasks in a list","Show a menu repeatedly","Add a task","View tasks","Remove a task"], hints:"Put each menu action in a function when the program starts getting large.", starter:`tasks = []

# TODO: build a menu for adding, viewing, and removing tasks
`, testText:"Create a working menu-driven to-do list."},
  {id:"analyzer", icon:"📊", level:"INTERMEDIATE", title:"Text Analyzer", req:12, skills:"strings · dictionaries · loops · functions", mission:"Ask for a piece of text and report useful statistics such as word count, character count, and the most common words.", checklist:["Read text from the user","Count characters and words","Normalize words","Count word frequencies","Display useful results"], hints:"split() helps with words. A dictionary is useful for counting frequencies.", starter:`text = input("Enter some text: ")

# TODO: analyze the text and print useful statistics
`, testText:"Turn raw text into a useful report."},
  {id:"weather", icon:"🌦️", level:"INTERMEDIATE", title:"Weather Dashboard", req:14, skills:"APIs · JSON · requests · error handling", mission:"Fetch weather data from a public API, parse the JSON response, and display a small weather report.", checklist:["Send an HTTP request","Check for errors","Parse JSON data","Extract useful fields","Display a readable report"], hints:"Use requests.get() and response.json(). Always handle a failed request gracefully.", starter:`import requests

# TODO: choose an API endpoint and fetch weather data
# response = requests.get(...)
`, testText:"Connect Python to real-world data and handle failure safely."}
];

let projectState = JSON.parse(localStorage.getItem("pylearn_projects") || '{}');
let activeProject = null;


const $ = id => document.getElementById(id);

function save(){localStorage.setItem("pylearn_state",JSON.stringify(state));localStorage.setItem("pylearn_current",String(current))}
function go(id){$(id)?.scrollIntoView({behavior:"smooth",block:"start"}); if(id==="playground" && !pythonReady && !pythonLoading) initPython();}
function saveBookmarks(){localStorage.setItem("pylearn_bookmarks",JSON.stringify(bookmarks))}
function saveNotes(){localStorage.setItem("pylearn_notes",JSON.stringify(notes))}
function toggleBookmark(){
  const i=bookmarks.indexOf(current);
  if(i===-1){bookmarks.push(current);toast("🔖 Lesson bookmarked");}
  else{bookmarks.splice(i,1);toast("Bookmark removed");}
  saveBookmarks(); renderStudyTools(); renderLessonBookmark();
}
function renderLessonBookmark(){
  const b=$("bookmarkLesson"); if(!b) return;
  const saved=bookmarks.includes(current);
  b.textContent=saved?"★ Bookmarked":"☆ Bookmark lesson";
  b.classList.toggle("saved",saved);
}
function saveCurrentNote(show=true){
  const box=$("lessonNotes"); if(!box) return;
  const value=box.value.trim();
  if(value) notes[String(current)]=value; else delete notes[String(current)];
  saveNotes();
  if(show){$("noteStatus").textContent=value?"Saved locally":"No note yet"; toast(value?"📝 Note saved":"Note cleared");}
  renderStudyTools();
}
function clearCurrentNote(){const box=$("lessonNotes"); if(box){box.value="";} delete notes[String(current)]; saveNotes(); $("noteStatus").textContent="No note yet"; renderStudyTools(); toast("Note cleared");}
function openStudyLesson(i){selectLesson(i); setTimeout(()=>go("learn"),120)}
function searchLessons(){
  const q=($("lessonSearch")?.value||"").trim().toLowerCase();
  const results=$("searchResults"), count=$("searchCount"); if(!results||!count)return;
  if(!q){results.innerHTML='<div class="search-empty">🔎 Search for a topic like <b>loops</b>, <b>functions</b>, <b>JSON</b>, or <b>errors</b>.</div>';count.textContent="0 results";return;}
  const matches=lessons.map((x,i)=>({x,i,text:[x.title,x.short,x.intro,x.idea,x.analogy,...x.objectives,x.challenge.title,x.challenge.prompt].join(" ").toLowerCase()})).filter(r=>r.text.includes(q));
  count.textContent=`${matches.length} result${matches.length===1?"":"s"}`;
  results.innerHTML=matches.length?matches.map(({x,i})=>`<button class="search-result ${isUnlocked(i)?"":"locked-result"}" ${isUnlocked(i)?`onclick="openStudyLesson(${i})"`:"disabled"}><span>${x.level}</span><b>${String(i+1).padStart(2,"0")} · ${x.title}</b><small>${isUnlocked(i)?"Open lesson →":"🔒 Complete previous lessons to open"}</small></button>`).join(""):'<div class="search-empty">No lessons matched that search. Try another Python concept.</div>';
}
function renderStudyTools(){
  const list=$("bookmarkList"), count=$("bookmarkCount"), note=$("lessonNotes"), status=$("noteStatus");
  if(count) count.textContent=bookmarks.length;
  if(list) list.innerHTML=bookmarks.length?bookmarks.map(i=>{const x=lessons[i]; return `<div class="bookmark-item"><button onclick="openStudyLesson(${i})"><span>🔖</span><div><b>${String(i+1).padStart(2,"0")} · ${x.title}</b><small>${x.short}</small></div></button><button class="remove-bookmark" onclick="removeBookmark(${i})" aria-label="Remove bookmark">×</button></div>`}).join(""):'<div class="study-empty">No bookmarks yet. Bookmark a lesson when you want to review it later.</div>';
  if(note){note.value=notes[String(current)]||"";}
  if(status) status.textContent=notes[String(current)]?"Saved locally":"No note yet";
}
function removeBookmark(i){bookmarks=bookmarks.filter(x=>x!==i);saveBookmarks();renderStudyTools();renderLessonBookmark();toast("Bookmark removed");}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>$('toast').classList.remove("show"),2300)}

function makeWorker(){
  const worker=new Worker("python-worker.js", {type:"module"});
  pythonWorker=worker;
  worker.onmessage=(e)=>{
    const m=e.data||{};
    if(m.type==="ready"){
      pythonReady=true;
      pythonLoading=null;
      $("status").textContent="● Python ready";
      $("status").classList.add("ready");
      $("output").style.color="";
      $("output").textContent="Python is ready. Write code and press Run Python.";
      $("runtimeNote").textContent="Python runs in a separate browser worker, so long-running code should not freeze the page. Internet is needed when the engine is first downloaded.";
      $("retryPy").disabled=false;
    }else if(m.type==="stdout"){
      appendOutput(m.text||"");
    }else if(m.type==="run-result"){
      if(runTimer){clearTimeout(runTimer);runTimer=null;}
      activeOutput=m.output||activeOutput;
      $("output").style.color="";
      $("output").textContent=activeOutput.trim()?activeOutput:"Program finished with no printed output.";
      state.runs+=1; state.xp+=5; runCount++; save(); renderLessons();
      $("runCount").textContent=`Run ${runCount}`;
      finishRunButton();
    }else if(m.type==="run-error"){
      if(runTimer){clearTimeout(runTimer);runTimer=null;}
      $("output").style.color="var(--red)";
      $("output").textContent=m.error||"Python error.";
      finishRunButton();
    }else if(m.type==="check-result"){
      if(window.__challengeCheckResolve){ const resolve=window.__challengeCheckResolve; window.__challengeCheckResolve=null; resolve(m.result); }
    }else if(m.type==="error"){
      if(window.__challengeCheckResolve){ const resolve=window.__challengeCheckResolve; window.__challengeCheckResolve=null; resolve({ok:false,output:"ERROR: "+(m.error||"Python worker error")}); }
      $("status").textContent="Python error";
    }
  };
  worker.onerror=(err)=>{
    pythonReady=false; pythonLoading=null;
    $("status").textContent="Python worker error";
    $("status").classList.remove("ready");
    if(window.__challengeCheckResolve){ const resolve=window.__challengeCheckResolve; window.__challengeCheckResolve=null; resolve({ok:false,output:"ERROR: Python worker failed."}); }
  };
  return worker;
}

function initPython(retry=false){
  const status=$("status"), out=$("output"), btn=$("retryPy");
  if(retry){
    if(pythonWorker) pythonWorker.terminate();
    pythonWorker=null; pythonReady=false; pythonLoading=null;
    if(runTimer){clearTimeout(runTimer);runTimer=null;}
  }
  if(pythonReady) return Promise.resolve();
  if(pythonLoading) return pythonLoading;
  status.textContent="Loading Python…"; status.classList.remove("ready");
  out.style.color=""; out.textContent="Downloading the Python engine…"; btn.disabled=true;
  const worker=makeWorker();
  pythonLoading=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{
      if(pythonWorker===worker){worker.terminate();pythonWorker=null;}
      pythonReady=false; pythonLoading=null; btn.disabled=false;
      status.textContent="Python timed out"; status.classList.remove("ready");
      out.textContent="Python took too long to load. Check your internet connection, then press “Retry Python engine”.";
      reject(new Error("Python engine timed out."));
    },45000);
    const original=worker.onmessage;
    worker.onmessage=(e)=>{
      original(e);
      if(e.data?.type==="ready"){clearTimeout(timeout);resolve();}
    };
  }).catch(()=>{}).finally(()=>{btn.disabled=false;});
  worker.postMessage({type:"init"});
  return pythonLoading;
}

function appendOutput(s){ activeOutput += String(s); $("output").textContent=activeOutput; }
function nextInputLine(){
  const box=$("stdin");
  const lines=(box?.value||"").split(/\r?\n/);
  const index=Number(box?.dataset.index||0);
  if(index < lines.length && lines[index] !== undefined){
    box.dataset.index=String(index+1);
    appendOutput(`\n[input ${index+1}] ${lines[index]}\n`);
    return lines[index];
  }
  throw new Error("input() needs another line in the Program Input box. Add one line per input() call, then run again.");
}

function resetInputQueue(){ if($("stdin")) $("stdin").dataset.index="0"; }
function finishRunButton(){const b=$("run");b.disabled=false;b.textContent="▶ Run Python"}

const today = () => new Intl.DateTimeFormat("en-CA", {timeZone:"Africa/Addis_Ababa"}).format(new Date());

function updateStreak(){
  const d=today();
  if(state.lastDay!==d){
    const previous = new Intl.DateTimeFormat("en-CA", {timeZone:"Africa/Addis_Ababa"}).format(new Date(Date.now()-86400000));
    state.streak = state.lastDay===previous ? state.streak+1 : 1;
    state.lastDay=d; save();
  }
}

function isUnlocked(i){return i===0 || state.done.includes(i-1)}
function levelName(){const level=Math.floor(state.xp/100)+1;return `Level ${level} · ${level<3?"Beginner":level<6?"Builder":"Python Explorer"}`}

function projectUnlocked(p){ return state.done.length >= p.req; }
function saveProjects(){ localStorage.setItem("pylearn_projects",JSON.stringify(projectState)); }
function renderProjects(){
  const grid=$("projectsGrid"), summary=$("projectSummary");
  if(!grid) return;
  const ready=projects.filter(projectUnlocked).length, completed=projects.filter(p=>projectState[p.id]).length;
  summary.innerHTML=`<div><strong>Build path</strong><br><span>${completed}/${projects.length} projects completed · ${ready}/${projects.length} unlocked</span></div><div>Learn → Practice → <strong>Build</strong></div>`;
  grid.innerHTML=projects.map(p=>{
    const unlocked=projectUnlocked(p), done=!!projectState[p.id];
    const status=done?"✓ Completed":unlocked?"🔓 Ready to build":`🔒 Complete ${p.req} lessons`;
    return `<article class="${unlocked?"":"locked"}"><div class="project-icon">${p.icon}</div><span>${p.level}</span><h3>${p.title}</h3><p>${p.skills}</p><div class="project-status ${done?"done":unlocked?"ready":"locked"}">${status}</div><br><button ${unlocked?`onclick="openProject('${p.id}')"`:"disabled"}>${done?"Open project →":unlocked?"Start project →":"Locked"}</button></article>`;
  }).join("");
}
function openProject(id){
  const p=projects.find(x=>x.id===id); if(!p || !projectUnlocked(p)) return;
  activeProject=p;
  $("projectLab").hidden=false;
  $("projectLabTitle").textContent=`${p.icon} ${p.title}`;
  $("projectLabIntro").textContent=`${p.level} project · Uses: ${p.skills}`;
  $("projectMission").textContent=p.mission;
  $("projectHints").textContent=p.hints;
  $("projectChecklist").innerHTML=p.checklist.map((x,i)=>`<div class="project-check"><span>□</span><div>${x}</div></div>`).join("");
  $("projectCompleteBtn").textContent=projectState[p.id]?"✓ Project completed":"✓ Mark project complete";
  $("projectCompleteBtn").disabled=!!projectState[p.id];
  $("projectCompleteBtn").onclick=()=>completeProject(p.id);
  $("projectOpenPlayground").onclick=()=>openProjectInPlayground(p);
  $("projectLab").scrollIntoView({behavior:"smooth",block:"start"});
}
function closeProjectLab(){ $("projectLab").hidden=true; activeProject=null; }
function completeProject(id){
  if(projectState[id]) return;
  projectState[id]=true; saveProjects(); state.xp+=50; save();
  toast("🎉 Project completed! +50 XP"); renderProjects(); renderLessons();
  openProject(id);
}
function openProjectInPlayground(p){
  $("editor").value=p.starter; localStorage.setItem("pylearn_editor",p.starter);
  go("playground"); toast(`${p.title} loaded into the playground.`);
}

function renderLessons(){
  const nextIndex=lessons.findIndex((_,i)=>!state.done.includes(i));
  $("lessons").innerHTML=lessons.map((x,i)=>{
    const unlocked=isUnlocked(i), done=state.done.includes(i);
    let status=done?"✓ Completed":(unlocked?(i===current?"● Current":"▶ Unlocked"): `🔒 Complete lesson ${i}`);
    return `<button class="lesson ${i===current?"active":""} ${done?"done":""} ${unlocked?"":"locked"}" ${unlocked?`onclick="selectLesson(${i})"`:"disabled"} aria-label="${x.title} — ${status}">
      <b>${String(i+1).padStart(2,"0")}</b><span>${x.title.split(":")[0]}<small>${x.short}</small><em>${status}</em></span><i>${done?"✓":unlocked?"▶":"🔒"}</i>
    </button>`;
  }).join("");

  const pct=Math.round(state.done.length/lessons.length*100);
  $("bar").style.width=pct+"%"; $("percent").textContent=pct+"%"; $("pathPct").textContent=pct+"%";
  $("done").textContent=`${state.done.length}/${lessons.length}`; $("xp").textContent=state.xp;
  $("streak").textContent=state.streak; $("streakText").textContent=state.streak?`${state.streak} day${state.streak===1?"":"s"} in a row`:"Start learning today";
  $("levelText").textContent=levelName();
  $("goalText").textContent=nextIndex===-1?"Path complete — start a project!":`Finish lesson ${nextIndex+1}: ${lessons[nextIndex].title.split(":")[0]}`;
  $("pathHint").textContent=nextIndex===-1?"You completed the full current path.":`Next up: Lesson ${String(nextIndex+1).padStart(2,"0")} — ${lessons[nextIndex].short}`;
  $("pathNext").innerHTML=nextIndex===-1?`<div class="path-next-card complete"><b>🎉 Beginner path complete!</b><span>You've finished every current lesson.</span></div>`:`<div class="path-next-card"><small>NEXT UP</small><b>Lesson ${String(nextIndex+1).padStart(2,"0")} · ${lessons[nextIndex].title.split(":")[0]}</b><span>${isUnlocked(nextIndex)?"🔓 Unlocked — tap the lesson to continue.":`🔒 Complete lesson ${nextIndex} to unlock this.`}</span></div>`;
  $("badgeCount").textContent=badges.filter(b=>b.test(state)).length;
  renderBadges();
  renderRoadmap();
  renderDashboard();
  renderProjects();
}

function continueLearning(){
  const nextIndex=lessons.findIndex((_,i)=>!state.done.includes(i));
  if(nextIndex===-1){go("projects");return}
  if(!isUnlocked(nextIndex)){go("learn");toast("Finish the current lesson to unlock the next step.");return}
  selectLesson(nextIndex); go("learn");
}

function renderDashboard(){
  const total=lessons.length;
  const completed=state.done.length;
  const pct=Math.round(completed/total*100);
  const degrees=Math.round(pct*3.6);
  const ring=$("progressRing");
  if(ring) ring.style.background=`conic-gradient(var(--purple2) 0deg ${degrees}deg, var(--line) ${degrees}deg 360deg)`;
  $("dashboardPercent").textContent=pct+"%";
  $("dashboardBar").style.width=pct+"%";
  $("dashLessons").textContent=`${completed}/${total}`;
  $("dashQuizzes").textContent=`${state.quiz.length}/${total}`;
  $("dashChallenges").textContent=`${state.challenges.length}/${total}`;
  $("dashStreak").textContent=`${state.streak} ${state.streak===1?"day":"days"}`;
  $("dashboardLevel").textContent=levelName();
  $("dashboardXp").textContent=`${state.xp} XP`;
  const levelStart=Math.floor(state.xp/100)*100;
  const levelProgress=state.xp-levelStart;
  const currentLevel=Math.floor(state.xp/100)+1;
  const nextLevelXp=(currentLevel)*100;
  const xpPct=Math.min(100,levelProgress);
  $("dashboardXpBar").style.width=xpPct+"%";
  $("dashboardNextXp").textContent=state.xp>=nextLevelXp?"Level ready":"";
  $("dashboardNextXp").textContent=`${nextLevelXp-state.xp} XP to Level ${currentLevel+1}`;
  $("dashboardLevelHint").textContent=`${levelProgress}/100 XP earned toward your next level.`;

  const nextIndex=lessons.findIndex((_,i)=>!state.done.includes(i));
  if(nextIndex===-1){
    $("dashboardPathTitle").textContent="Path complete!";
    $("dashboardPathText").textContent="You finished all current lessons. Your next step is to build a project.";
    $("continueTitle").textContent="Begin building";
    $("continueText").textContent="Your current learning path is complete. Explore projects next.";
    $("continueButton").textContent="View projects →";
    $("continueCard").classList.add("complete");
  }else{
    const x=lessons[nextIndex];
    $("dashboardPathTitle").textContent=`Lesson ${String(nextIndex+1).padStart(2,"0")} · ${x.title.split(":")[0]}`;
    $("dashboardPathText").textContent=`${completed} of ${total} lessons mastered. ${Math.max(0, total-completed)} lesson${total-completed===1?"":"s"} remaining.`;
    $("continueTitle").textContent=`Continue: ${x.title.split(":")[0]}`;
    $("continueText").textContent=x.intro;
    $("continueButton").textContent="Open lesson →";
    $("continueCard").classList.remove("complete");
  }
}

function renderRoadmap(){
  const stage1=$("stage1"), stage2=$("stage2"), stage3=$("stage3"), stage4=$("stage4");
  if(!stage1) return;
  const foundationCount=state.done.filter(i=>i>=0&&i<=4).length;
  const coreCount=state.done.filter(i=>i>=5&&i<=7).length;
  const intermediateCount=state.done.filter(i=>i>=8&&i<=13).length;
  const foundationDone=foundationCount===5;
  const coreDone=coreCount===3;
  const intermediateDone=intermediateCount===6;
  stage1.classList.toggle("complete",foundationDone);
  stage1.querySelector("em").textContent=foundationDone?"✓ Complete":`5 lessons · ${foundationCount}/5`;
  stage2.classList.toggle("active-stage",foundationDone&&!coreDone);
  stage2.classList.toggle("complete",coreDone);
  stage2.querySelector("em").textContent=coreDone?"✓ Complete":foundationDone?`🔓 Unlocked · ${coreCount}/3 lessons`:"🔒 Unlocks after Fundamentals";
  stage3.classList.toggle("active-stage",coreDone&&!intermediateDone);
  stage3.classList.toggle("complete",intermediateDone);
  stage3.querySelector("em").textContent=intermediateDone?"✓ Complete":coreDone?`🔓 Unlocked · ${intermediateCount}/6 lessons`:"🔒 Complete the core path first";
  stage4.classList.toggle("active-stage",intermediateDone);
  stage4.querySelector("em").textContent=intermediateDone?"🔓 Ready for projects":"🔒 Unlocks after Intermediate";
}

function renderBadges(){
  const earned=badges.filter(b=>b.test(state)).length;
  const summary=$("badgeSummary");
  if(summary) summary.textContent=`${earned}/${badges.length} unlocked`;
  $("badges").innerHTML=badges.map(b=>{
    const isEarned=b.test(state);
    const [value,total]=b.progress(state);
    const pct=Math.round(value/total*100);
    return `<article class="${isEarned?"earned":"locked-badge"}">
      <div class="badge-top"><span class="badge-status">${isEarned?"✓ EARNED":"🔒 LOCKED"}</span></div>
      <div class="medal">${b.medal}</div>
      <h3>${b.name}</h3><p>${b.desc}</p>
      <div class="badge-progress"><i style="width:${pct}%"></i></div>
      <small>${isEarned?"Achievement unlocked!":`${b.goal} · ${value}/${total}`}</small>
    </article>`;
  }).join("");
}

function selectLesson(i){
  if(!isUnlocked(i)){toast("Complete the previous lesson to unlock this one.");return}
  current=i; save(); renderLesson(); renderLessons();
  document.querySelector(".lesson-panel")?.scrollIntoView({behavior:"smooth",block:"start"});
}


function renderDeep(){
 const d=deepData[current]||deepData[0];
 $("steps").innerHTML=d.steps.map(s=>`<div class="step"><span class="step-num">${s[0]}</span><div><b>${s[1]}</b><p>${s[2]}</p></div></div>`).join("");
 $("mistakes").innerHTML=d.mistakes.map(m=>`<div class="mistake"><b>${m[0]}</b><p>${m[1]}</p></div>`).join("");
 $("recap").textContent=d.recap;
}
function challengeModeLabel(mode){return ({code:"✏️ CODE IT",debug:"🐛 FIX IT",predict:"🔮 PREDICT",fill:"🧩 FILL THE GAP",mcq:"🎯 CHOOSE ONE"}[mode]||"✏️ CODE IT")}
function renderChallengeUI(){
  const x=lessons[current].challenge, mode=x.mode||"code";
  $("challengeMode").textContent=challengeModeLabel(mode);
  $("challengeCode").value=x.starter||"";
  $("challengeCode").style.display=(mode==="mcq"||mode==="predict")?"none":"block";
  $("challengeCode").readOnly=false;
  $("challengeChoiceArea").innerHTML=mode==="mcq"?(x.options||[]).map((o,i)=>`<button class="challenge-choice" onclick="answerChallengeChoice(${i})">${o}</button>`).join(""):"";
  $("challengeAnswerArea").innerHTML=mode==="predict"?`<input id="challengeAnswer" type="text" inputmode="text" autocomplete="off" placeholder="Type the output you predict…">`:"";
  $("challengeInstructions").style.display=(mode==="mcq"||mode==="predict")?"block":"none";
  $("challengeInstructions").textContent=mode==="mcq"?"Choose one answer, then check it.":mode==="predict"?"Type the exact output you think the program will produce.":"";
  $("hintBtn").style.display="inline-block";
  $("solutionBtn").style.display="inline-block";
}
function showHint(){$("practiceHint").textContent="💡 "+lessons[current].challenge.hint}
function showSolution(){
  const x=lessons[current].challenge;
  if((x.mode||"code")==="mcq"){ $("practiceHint").textContent="👀 The correct answer is: "+x.options[x.answer]; return; }
  if((x.mode||"code")==="predict"){ $("practiceHint").textContent="👀 Expected output: "+x.solution; return; }
  $("practiceHint").textContent="👀 Solution shown below. Study it, then try writing it yourself.";
  $("challengeCode").value=x.solution;
}
function answerChallengeChoice(choice){
  const x=lessons[current].challenge;
  document.querySelectorAll(".challenge-choice").forEach((b,i)=>{b.classList.toggle("correct",i===x.answer);b.classList.toggle("wrong",i===choice&&i!==x.answer)});
  window.__challengeChoice=choice;
}

function renderLesson(){
  const x=lessons[current];
  renderDeep();
  $("levelTag").textContent=x.level; $("number").textContent=`LESSON ${String(current+1).padStart(2,"0")} / ${String(lessons.length).padStart(2,"0")}`;
  $("title").textContent=x.title; $("intro").textContent=x.intro; $("explain").textContent=x.idea; $("analogy").textContent=x.analogy;
  $("lessonCode").textContent=x.code; $("objectives").innerHTML=x.objectives.map(o=>`<li>${o}</li>`).join("");
  $("quizQuestion").textContent=x.quiz.q; $("quizOptions").innerHTML=x.quiz.options.map((o,i)=>`<button class="quiz-option" onclick="answerQuiz(${i})">${o}</button>`).join("");
  $("quizFeedback").textContent=state.quiz.includes(current)?"✓ Quiz completed. "+x.quiz.explain:"";
  $("quizScore").textContent=state.quiz.includes(current)?"1/1":"0/1";
  quizAnswered=state.quiz.includes(current);
  $("completeBtn").textContent=state.done.includes(current)?"✓ Lesson completed":"Mark complete +20 XP";
  $("nextBtn").style.display=current<lessons.length-1 && state.done.includes(current)?"inline-block":"none";
  $("challengeTitle").textContent=`Challenge: ${x.challenge.title}`;
  $("challengePrompt").textContent=x.challenge.prompt; $("challengeHint").textContent=x.challenge.hint; $("challengeLevel").textContent=x.level;
  renderChallengeUI();
  renderLessonBookmark();
  renderStudyTools();
  $("practiceHint").textContent="";
  window.__challengeChoice=null;
  $("challengeResult").textContent=state.challenges.includes(current)?"✓ Challenge solved. +30 XP":"Write your solution, then check it.";
}

function answerQuiz(choice){
  if(state.quiz.includes(current)){toast("You already completed this quiz.");return}
  const x=lessons[current];
  const options=[...document.querySelectorAll(".quiz-option")];
  options.forEach((b,i)=>b.disabled=true);
  if(choice===x.quiz.answer){
    options[choice].classList.add("correct");
    $("quizFeedback").textContent="✓ Correct! "+x.quiz.explain;
    $("quizScore").textContent="1/1"; quizAnswered=true; state.quiz.push(current); state.xp+=15; save(); updateStreak(); renderLessons(); toast("+15 XP — quiz mastered!");
  }else{
    options[choice].classList.add("wrong"); options[x.quiz.answer].classList.add("correct");
    $("quizFeedback").textContent="Not quite. "+x.quiz.explain;
    setTimeout(()=>{options.forEach(b=>b.disabled=false)},700);
  }
}

function completeLesson(){
  if(state.done.includes(current)){toast("Lesson already completed.");return}
  if(!quizAnswered){toast("Finish the quick check first.");return}
  state.done.push(current); state.xp+=20; updateStreak(); save(); renderLessons(); renderLesson(); toast("+20 XP — lesson complete!");
}

function nextLesson(){
  if(current<lessons.length-1){selectLesson(current+1);go("learn")}
}

function loadLesson(){ $("editor").value=lessons[current].code; go("playground"); toast("Example loaded into the playground."); }
function starter(){ $("editor").value='name = "Python"\nprint(f"Hello, {name}!")\nprint("2 + 3 =", 2 + 3)' }
function clearEditor(){ $("editor").value="" }
function clearOutput(){ $("output").textContent="" }

async function runPython(){
  const btn=$("run"), out=$("output");
  if(!pythonReady || !pythonWorker){
    out.textContent="Loading Python…";
    await initPython();
    if(!pythonReady || !pythonWorker){ out.textContent="Python is not ready yet. Press Retry Python engine if needed."; return; }
  }
  btn.disabled=true; btn.textContent="Running…"; activeOutput=""; out.style.color=""; out.textContent=""; resetInputQueue();
  if(runTimer) clearTimeout(runTimer);
  runTimer=setTimeout(()=>{
    if(pythonWorker) pythonWorker.terminate();
    pythonWorker=null; pythonReady=false; pythonLoading=null; runTimer=null;
    out.style.color="var(--red)";
    out.textContent="⏱️ Your program ran for more than 8 seconds and was stopped.\n\nThe Python worker was restarted so the rest of PyLearn stays responsive.";
    finishRunButton();
    initPython();
  },8000);
  const inputs=($("stdin")?.value||"").split(/\r?\n/);
  pythonWorker.postMessage({type:"run",code:$("editor").value,inputs});
}

async function checkChallenge(){
  const x=lessons[current].challenge, mode=x.mode||"code";
  const out=$("challengeResult");
  if(mode==="mcq"){
    if(window.__challengeChoice==null){out.textContent="Choose an answer first.";return;}
    if(window.__challengeChoice===x.answer) handleChallengeResult({ok:true,output:x.options[x.answer]});
    else out.textContent="Not quite. Try again or review the lesson.";
    return;
  }
  if(mode==="predict"){
    const answer=($("challengeAnswer")?.value||"").trim();
    if(!answer){out.textContent="Type your predicted output first.";return;}
    if(answer.toLowerCase()===String(x.solution).trim().toLowerCase()) handleChallengeResult({ok:true,output:answer});
    else out.textContent="Not quite. Run through the code step by step and try again.";
    return;
  }
  const code=$("challengeCode").value;
  if(!code.trim()){out.textContent="Write some Python first, then check your solution.";return;}
  if(!pythonReady){
    out.textContent="Loading Python…";
    await initPython();
    if(!pythonReady){out.textContent="Python is not ready. Press Retry Python engine.";return;}
  }
  out.textContent="Checking…";
  try{
    if(window.__challengeCheckResolve){out.textContent="A challenge check is already running.";return;}
    const result=await new Promise(resolve=>{
      window.__challengeCheckResolve=resolve;
      pythonWorker.postMessage({type:"check",code,validatorIndex:current});
      setTimeout(()=>{
        if(window.__challengeCheckResolve===resolve){window.__challengeCheckResolve=null;resolve({ok:false,output:"ERROR: Challenge check timed out."});}
      },8000);
    });
    handleChallengeResult(result);
  }catch(err){ out.textContent=String(err); }
}

function handleChallengeResult(result){
  const out=$("challengeResult");
  if(result.ok){
    out.textContent="✓ Correct! +30 XP";
    if(!state.challenges.includes(current)){state.challenges.push(current);state.xp+=30;updateStreak();save();renderLessons();toast("+30 XP — challenge solved!")}
  }else{
    out.textContent=result.output.startsWith("ERROR:") ? result.output+"\n\nCheck your code and try again." : "Not quite yet.\n\nYour code ran, but it did not meet the challenge requirements.\nUse the hint if you need help, then try again.";
  }
}

$("theme").onclick=()=>{document.body.classList.toggle("light");$("theme").textContent=document.body.classList.contains("light")?"🌙":"☀️";localStorage.setItem("pylearn_theme",document.body.classList.contains("light")?"light":"dark")};
$("menu").onclick=()=>$("mainNav").classList.toggle("open");

$("lessonSearch")?.addEventListener("input",searchLessons);
$("lessonNotes")?.addEventListener("input",()=>{
  clearTimeout(window.__noteTimer);
  $("noteStatus").textContent="Saving…";
  window.__noteTimer=setTimeout(()=>saveCurrentNote(false),500);
});
$("editor").addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();runPython()}});
if(localStorage.getItem("pylearn_theme")==="light"){document.body.classList.add("light");$("theme").textContent="🌙"}
// Do not start/increase a streak just because the app was opened.
// updateStreak() is called only after a real learning action succeeds.
renderLesson(); renderLessons(); renderStudyTools(); searchLessons();
