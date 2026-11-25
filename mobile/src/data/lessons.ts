export type LessonQuiz = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type Lesson = {
  slug: string;
  title: string;
  shortTitle: string;
  level: "BEGINNER" | "INTERMEDIATE";
  intro: string;
  keyIdea: string;
  analogy: string;
  example: string;
  objectives: string[];
  quiz: LessonQuiz;
};

// Source: the existing website's main/script.js lesson model on main.
// Wording and examples are preserved; mobile-only slugs provide stable route IDs.
export const lessons: Lesson[] = [
  {
    slug: "python-basics",
    title: "Python Basics: variables & print()",
    shortTitle: "Variables & print()",
    level: "BEGINNER",
    intro: "Learn how Python stores information and displays results with variables and print().",
    keyIdea: "A variable is a name that refers to a value. Assignment uses = to put a value into that name.",
    analogy: "Imagine labeled boxes. The label is the variable name and the thing inside the box is the value.",
    example: 'name = "Python"\nprint(name)\nprint("Hello!")',
    objectives: ["Create and update variables", "Use strings and numbers as values", "Display information with print()"],
    quiz: {
      question: "Which line correctly creates a variable called age?",
      options: ["age == 15", "age = 15", "15 = age"],
      answerIndex: 1,
      explanation: "A single = assigns the value on the right to the name on the left."
    }
  },
  {
    slug: "data-types",
    title: "Data Types: strings, integers & floats",
    shortTitle: "Data types",
    level: "BEGINNER",
    intro: "Python values come in different types. Understanding the type helps you know what operations make sense.",
    keyIdea: "Strings are text, integers are whole numbers, and floats are numbers with decimal parts. You can inspect a value with type().",
    analogy: "Think of types like different containers: a text container, a whole-number container and a decimal-number container.",
    example: 'name = "Python"\nage = 14\nheight = 1.72\nprint(type(name))\nprint(type(age))\nprint(type(height))',
    objectives: ["Recognize str, int and float", "Use type() to inspect a value", "Choose an appropriate type for simple data"],
    quiz: {
      question: "What type is 3.14?",
      options: ["str", "int", "float"],
      answerIndex: 2,
      explanation: "3.14 has a decimal part, so Python treats it as a float."
    }
  },
  {
    slug: "operators-input",
    title: "Operators & input()",
    shortTitle: "Operators & input",
    level: "BEGINNER",
    intro: "Use arithmetic operators to calculate values and input() to receive text from a user.",
    keyIdea: "Python supports +, -, *, /, //, %, and **. input() returns what the user typed as a string.",
    analogy: "Operators are tools in a toolbox: + combines, * repeats or multiplies, / divides, and % finds a remainder.",
    example: 'name = input("Your name: ")\nage = int(input("Your age: "))\nprint("Hello", name)\nprint("Next year:", age + 1)',
    objectives: ["Use common arithmetic operators", "Read text with input()", "Convert numeric text with int()"],
    quiz: {
      question: "What does int(input()) usually do?",
      options: ["Turns user input into an integer", "Prints an integer automatically", "Creates a list"],
      answerIndex: 0,
      explanation: "input() gives text; int() converts numeric text into an integer."
    }
  },
  {
    slug: "conditions",
    title: "Conditions: if, elif & else",
    shortTitle: "if / elif / else",
    level: "BEGINNER",
    intro: "Conditions let your program make decisions based on whether an expression is true or false.",
    keyIdea: "Python checks the condition after if. If it is false, elif or else can provide another path.",
    analogy: "It is like a decision gate: if the rule is true, walk through that door; otherwise choose another door.",
    example: 'score = 72\nif score >= 50:\n    print("Passed!")\nelse:\n    print("Try again.")',
    objectives: ["Write an if statement", "Compare values with >, <, >=, <= and ==", "Use else and elif for alternative paths"],
    quiz: {
      question: "Which operator checks whether two values are equal?",
      options: ["=", "==", "!="],
      answerIndex: 1,
      explanation: "= assigns a value; == compares two values."
    }
  },
  {
    slug: "loops",
    title: "Loops: for & while",
    shortTitle: "for & while",
    level: "BEGINNER",
    intro: "Loops repeat instructions so you do not have to write the same code again and again.",
    keyIdea: "A for loop is great for repeating over a sequence or range. A while loop continues while a condition stays true.",
    analogy: "A loop is an automatic worker: give it a rule and it keeps doing the task until the rule says stop.",
    example: "for number in range(1, 6):\n    print(number)\n\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1",
    objectives: ["Use range() with for", "Understand repeated execution", "Create a simple while loop"],
    quiz: {
      question: "How many values does range(1, 5) produce?",
      options: ["4", "5", "6"],
      answerIndex: 0,
      explanation: "It starts at 1 and stops before 5: 1, 2, 3, 4."
    }
  },
  {
    slug: "functions",
    title: "Functions: reusable code",
    shortTitle: "Functions",
    level: "BEGINNER",
    intro: "Functions package instructions into reusable blocks. They can accept arguments and return values.",
    keyIdea: "Use def to define a function. Parameters are inputs, and return sends a result back to the caller.",
    analogy: "A function is like a machine: put something in, let the machine follow its recipe, and get a result out.",
    example: 'def greet(name):\n    return f"Hello, {name}!"\n\nmessage = greet("Python")\nprint(message)',
    objectives: ["Define a function with def", "Pass arguments to a function", "Return and use a result"],
    quiz: {
      question: "Which keyword sends a result back from a function?",
      options: ["send", "return", "give"],
      answerIndex: 1,
      explanation: "return ends the function and sends a value back to the caller."
    }
  },
  {
    slug: "lists-dictionaries",
    title: "Lists & dictionaries",
    shortTitle: "Lists & dictionaries",
    level: "INTERMEDIATE",
    intro: "Collections let you store multiple related values and work with them using indexes, keys and loops.",
    keyIdea: "Lists are ordered collections accessed by position. Dictionaries store key-value pairs and are useful for structured information.",
    analogy: "A list is like numbered lockers. A dictionary is like labeled drawers where each label points to a value.",
    example: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\n\nstudent = {"name": "Mika", "score": 92}\nprint(student["name"])\nprint(student["score"])',
    objectives: ["Create and index a list", "Create and read dictionary key-value pairs", "Loop through a collection"],
    quiz: {
      question: "How do you access the first item of a list called items?",
      options: ["items[1]", "items[0]", "items.first"],
      answerIndex: 1,
      explanation: "Python lists use zero-based indexing, so the first item is at index 0."
    }
  },
  {
    slug: "errors-modules",
    title: "Errors & modules",
    shortTitle: "Errors & modules",
    level: "INTERMEDIATE",
    intro: "Real programs encounter errors. Learn to read common errors and organize code with modules.",
    keyIdea: "Exceptions describe problems during execution. import lets you use functionality from Python modules such as math.",
    analogy: "An error message is a mechanic's note: it tells you where the machine had trouble and often gives a clue about why.",
    example: 'import math\n\ntry:\n    number = float("25")\n    print(math.sqrt(number))\nexcept ValueError:\n    print("That was not a valid number.")',
    objectives: ["Recognize common error messages", "Use import to access a module", "Handle a simple exception with try/except"],
    quiz: {
      question: "Which keyword imports a module?",
      options: ["include", "import", "module"],
      answerIndex: 1,
      explanation: "Python uses import followed by the module name."
    }
  },
  {
    slug: "string-skills",
    title: "String Skills",
    shortTitle: "Strings & text",
    level: "INTERMEDIATE",
    intro: "Work with text using indexing, slicing, methods and formatted strings.",
    keyIdea: "Strings are sequences of characters. You can inspect parts of them, change their presentation with methods, and build readable messages with f-strings.",
    analogy: "A string is like a row of letters on a strip of paper: you can point to a position, cut out a section, or transform the text.",
    example: 'text = "Python is fun"\nprint(text[0])\nprint(text[0:6])\nprint(text.upper())\nname = "Alex"\nprint(f"Hello, {name}!")',
    objectives: ["Index and slice strings", "Use common string methods", "Build messages with f-strings"],
    quiz: {
      question: 'What does text[0:3] return for text = "Python"?',
      options: ["Pyt", "Pyth", "yth"],
      answerIndex: 0,
      explanation: "Slicing starts at index 0 and stops before index 3, so the result is Pyt."
    }
  },
  {
    slug: "tuples-sets",
    title: "Tuples & sets",
    shortTitle: "Tuples & sets",
    level: "INTERMEDIATE",
    intro: "Learn two useful collection types: tuples for fixed ordered data and sets for unique values.",
    keyIdea: "Tuples are ordered and immutable. Sets store unique values and are useful when duplicates should disappear.",
    analogy: "A tuple is like a sealed row of labeled seats that should not be rearranged; a set is like a basket that keeps one copy of each item.",
    example: 'point = (10, 20)\nprint(point[0])\n\ncolors = {"red", "blue", "red"}\nprint(colors)',
    objectives: ["Create and index tuples", "Understand that tuples are immutable", "Create sets and remove duplicate values"],
    quiz: {
      question: "Which collection automatically keeps only unique values?",
      options: ["list", "set", "tuple"],
      answerIndex: 1,
      explanation: "A set stores unique elements, so duplicate values are removed."
    }
  },
  {
    slug: "comprehensions",
    title: "Comprehensions",
    shortTitle: "List comprehensions",
    level: "INTERMEDIATE",
    intro: "Build lists compactly by combining a loop and an expression in one readable line.",
    keyIdea: "A list comprehension creates a new list by applying an expression to each item in an iterable, optionally with a condition.",
    analogy: "Instead of telling a worker every tiny step, a comprehension gives the worker one recipe: take each item, transform it, and collect the results.",
    example: "squares = [number * number for number in range(1, 6)]\nprint(squares)\nevens = [n for n in range(1, 11) if n % 2 == 0]\nprint(evens)",
    objectives: ["Read a basic list comprehension", "Create transformed lists", "Add a condition to a comprehension"],
    quiz: {
      question: "What does [x * 2 for x in range(3)] produce?",
      options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]"],
      answerIndex: 0,
      explanation: "range(3) gives 0, 1, 2, and each value is multiplied by 2."
    }
  },
  {
    slug: "file-handling",
    title: "File handling",
    shortTitle: "Read & write files",
    level: "INTERMEDIATE",
    intro: "Learn how Python reads from and writes to text files using with open().",
    keyIdea: "The open() function gives your program access to a file. Using with closes the file automatically when the block finishes.",
    analogy: "Opening a file is like checking a notebook out of a library: use it, then return it properly when you are done.",
    example: 'with open("notes.txt", "w") as file:\n    file.write("Python is useful!\\n")\n\nwith open("notes.txt", "r") as file:\n    content = file.read()\nprint(content)',
    objectives: ["Open files safely with with", "Write text to a file", "Read text from a file"],
    quiz: {
      question: "Which mode opens a file for writing and replaces its old contents?",
      options: ["r", "w", "a"],
      answerIndex: 1,
      explanation: "w means write mode and creates or replaces the file."
    }
  },
  {
    slug: "object-oriented-python",
    title: "Object-oriented Python",
    shortTitle: "Classes & objects",
    level: "INTERMEDIATE",
    intro: "Learn the basics of classes and objects so you can model related data and behavior together.",
    keyIdea: "A class is a blueprint. An object is an instance created from that blueprint. Methods are functions defined inside a class.",
    analogy: "A class is a cookie cutter and an object is a cookie made from it. You can make many objects from one class design.",
    example: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        return f"{self.name} says woof!"\n\ndog = Dog("Max")\nprint(dog.bark())',
    objectives: ["Define a simple class", "Create objects from a class", "Use self and instance methods"],
    quiz: {
      question: "What is an object created from a class?",
      options: ["An instance", "A module", "A loop"],
      answerIndex: 0,
      explanation: "An object is an instance of a class."
    }
  },
  {
    slug: "apis-json",
    title: "APIs & JSON",
    shortTitle: "APIs & JSON",
    level: "INTERMEDIATE",
    intro: "Learn how programs exchange structured data using JSON and HTTP APIs.",
    keyIdea: "An API lets one program request data or actions from another service. JSON is a common text format for structured data such as objects and lists.",
    analogy: "An API is like a waiter carrying a request to the kitchen and bringing back the result. JSON is the organized order slip.",
    example: 'import json\ndata = json.loads(\'{"name":"Python","version":3}\')\nprint(data["name"])\nprint(data["version"])',
    objectives: ["Understand what an API provides", "Parse JSON with json.loads()", "Read values from JSON data"],
    quiz: {
      question: "Which Python module can parse JSON text?",
      options: ["json", "api", "http"],
      answerIndex: 0,
      explanation: "Python's built-in json module provides functions such as json.loads()."
    }
  }
];
