---
sidebar_position: 3
title: Built-in Generics
description: Array, Hash, and other built-in generic types
---

<DocsBadge />


# Built-in Generics

T-Ruby comes with several built-in generic types that you'll use every day. These types are parameterized to work with any type while providing type safety. Understanding how to use these built-in generics is essential for writing type-safe T-Ruby code.

## Array\<T\> (or T[])

The most commonly used generic type is `Array<T>`, representing an array of elements of type `T`. T-Ruby also supports the shorthand syntax `T[]`.

### Basic Array Usage

```trb
# Explicitly typed arrays (shorthand syntax)
numbers: Integer[] = [1, 2, 3, 4, 5]
names: String[] = ["Alice", "Bob", "Charlie"]
flags: Boolean[] = [true, false, true]

# Type inference works too
inferred_numbers = [1, 2, 3]  # Integer[]
inferred_names = ["Alice", "Bob"]  # String[]

# Empty arrays need explicit types
empty_numbers: Integer[] = []
empty_users = Array<User>.new
```

### Array Operations

All standard array operations preserve type safety:

```trb
numbers: Integer[] = [1, 2, 3, 4, 5]

# Accessing elements
first: Integer? = numbers[0]      # 1
last: Integer? = numbers[-1]      # 5
out_of_bounds: Integer? = numbers[100]  # nil

# Adding elements
numbers.push(6)        # Integer[]
numbers << 7           # Integer[]
numbers.unshift(0)     # Integer[]

# Removing elements
popped: Integer? = numbers.pop      # Removes and returns last
shifted: Integer? = numbers.shift   # Removes and returns first

# Checking contents
contains_three: Boolean = numbers.include?(3)  # true
index: Integer? = numbers.index(3)     # 2
```

### Array Mapping and Transformation

Mapping transforms a `T[]` into a `U[]`:

```trb
# Map integers to strings
numbers: Integer[] = [1, 2, 3, 4, 5]
strings: String[] = numbers.map { |n| n.to_s }
# Result: ["1", "2", "3", "4", "5"]

# Map strings to their lengths
words: String[] = ["hello", "world", "ruby"]
lengths: Integer[] = words.map { |w| w.length }
# Result: [5, 5, 4]

# Map to complex types
class Person
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def name: String
    @name
  end
end

names: String[] = ["Alice", "Bob"]
people: Person[] = names.map { |name| Person.new(name, 25) }
```

### Array Filtering

Filtering maintains the same type:

```trb
numbers: Integer[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Filter for even numbers
evens: Integer[] = numbers.select { |n| n.even? }
# Result: [2, 4, 6, 8, 10]

# Filter for odd numbers
odds: Integer[] = numbers.reject { |n| n.even? }
# Result: [1, 3, 5, 7, 9]

# Find first matching element
first_even: Integer? = numbers.find { |n| n.even? }
# Result: 2

# Filter with complex conditions
words: String[] = ["hello", "world", "hi", "ruby", "typescript"]
long_words: String[] = words.select { |w| w.length > 4 }
# Result: ["hello", "world", "typescript"]
```

### Array Reduction

Reduce collapses an array into a single value:

```trb
numbers: Integer[] = [1, 2, 3, 4, 5]

# Sum all numbers
sum: Integer = numbers.reduce(0) { |acc, n| acc + n }
# Result: 15

# Find maximum
max: Integer = numbers.reduce(numbers[0]) { |max, n| n > max ? n : max }
# Result: 5

# Concatenate strings
words: String[] = ["Hello", "World", "from", "T-Ruby"]
sentence: String = words.reduce("") { |acc, w| acc.empty? ? w : "#{acc} #{w}" }
# Result: "Hello World from T-Ruby"

# Build a hash from array
pairs: String[][] = [["name", "Alice"], ["age", "30"]]
hash: Hash<String, String> = pairs.reduce({}) { |h, pair|
  h[pair[0]] = pair[1]
  h
}
```

### Nested Arrays

Arrays can be nested to any depth:

```trb
# Two-dimensional array (matrix)
matrix: Integer[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]

# Accessing nested elements
first_row: Integer[] = matrix[0]      # [1, 2, 3]
element: Integer? = matrix[1][2]      # 6

# Three-dimensional array
cube: Integer[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
]

# Flatten nested arrays
nested: Integer[][] = [[1, 2], [3, 4], [5, 6]]
flat: Integer[] = nested.flatten
# Result: [1, 2, 3, 4, 5, 6]
```

## Hash\<K, V\>

`Hash<K, V>` represents a hash map with keys of type `K` and values of type `V`.

### Basic Hash Usage

```trb
# Explicitly typed hashes
ages: Hash<String, Integer> = {
  "Alice" => 30,
  "Bob" => 25,
  "Charlie" => 35
}

# Symbol keys
config: Hash<Symbol, String> = {
  database: "postgresql",
  host: "localhost",
  port: "5432"
}

# Type inference
inferred = { "key" => "value" }  # Hash<String, String>

# Empty hashes need explicit types
empty_hash: Hash<String, Integer> = {}
empty_map = Hash<Symbol, Array<String>>.new
```

### Hash Operations

```trb
ages: Hash<String, Integer> = {
  "Alice" => 30,
  "Bob" => 25
}

# Accessing values
alice_age: Integer | nil = ages["Alice"]   # 30
missing: Integer | nil = ages["Charlie"]   # nil

# Adding/updating values
ages["Charlie"] = 35
ages["Alice"] = 31  # Update existing

# Removing values
removed: Integer | nil = ages.delete("Bob")  # Returns 25

# Checking keys
has_alice: Boolean = ages.key?("Alice")      # true
has_bob: Boolean = ages.key?("Bob")          # false (deleted)

# Getting keys and values
keys: String[] = ages.keys           # ["Alice", "Charlie"]
values: Integer[] = ages.values      # [31, 35]
```

### Hash Iteration

```trb
scores: Hash<String, Integer> = {
  "Alice" => 95,
  "Bob" => 87,
  "Charlie" => 92
}

# Iterate over key-value pairs
scores.each do |name, score|
  puts "#{name}: #{score}"
end

# Map to arrays
name_score_pairs: String[] = scores.map { |name, score|
  "#{name} scored #{score}"
}

# Filter hash
high_scores: Hash<String, Integer> = scores.select { |_, score| score >= 90 }
# Result: { "Alice" => 95, "Charlie" => 92 }

# Transform values
doubled: Hash<String, Integer> = scores.transform_values { |score| score * 2 }
# Result: { "Alice" => 190, "Bob" => 174, "Charlie" => 184 }
```

### Complex Hash Types

```trb
# Hash with array values
tags: Hash<String, String[]> = {
  "ruby" => ["programming", "language"],
  "rails" => ["framework", "web"],
  "postgres" => ["database", "sql"]
}

# Add to array value
tags["ruby"].push("dynamic")

# Hash with hash values (nested)
users: Hash<String, Hash<Symbol, String | Integer>> = {
  "user1" => { name: "Alice", age: 30, email: "alice@example.com" },
  "user2" => { name: "Bob", age: 25, email: "bob@example.com" }
}

# Access nested values
user1_name = users["user1"][:name]  # "Alice"

# Hash with custom types
class User
  @name: String
  @email: String

  def initialize(name: String, email: String): void
    @name = name
    @email = email
  end
end

user_map: Hash<Integer, User> = {
  1 => User.new("Alice", "alice@example.com"),
  2 => User.new("Bob", "bob@example.com")
}
```

## Set\<T\>

`Set<T>` represents an unordered collection of unique elements of type `T`.

```trb
# Creating sets
numbers: Set<Integer> = Set.new([1, 2, 3, 4, 5])
unique_words: Set<String> = Set.new(["hello", "world", "hello"])
# unique_words contains: {"hello", "world"}

# Adding elements
numbers.add(6)
numbers.add(3)  # Already exists, no duplicate

# Removing elements
numbers.delete(2)

# Checking membership
contains_three: Boolean = numbers.include?(3)  # true

# Set operations
set1: Set<Integer> = Set.new([1, 2, 3, 4])
set2: Set<Integer> = Set.new([3, 4, 5, 6])

union: Set<Integer> = set1 | set2           # {1, 2, 3, 4, 5, 6}
intersection: Set<Integer> = set1 & set2    # {3, 4}
difference: Set<Integer> = set1 - set2      # {1, 2}

# Convert to array
array: Integer[] = numbers.to_a
```

## Range\<T\>

`Range<T>` represents a range of values from a start to an end.

```trb
# Integer ranges
one_to_ten: Range<Integer> = 1..10      # Inclusive: 1, 2, ..., 10
one_to_nine: Range<Integer> = 1...10    # Exclusive: 1, 2, ..., 9

# Check if range includes a value
includes_five: Boolean = one_to_ten.include?(5)  # true

# Convert to array
numbers: Integer[] = (1..5).to_a   # [1, 2, 3, 4, 5]

# Iterate over range
(1..5).each do |i|
  puts i
end

# Character ranges
alphabet: Range<String> = 'a'..'z'
letters: String[] = ('a'..'e').to_a  # ["a", "b", "c", "d", "e"]
```

## Enumerator\<T\>

`Enumerator<T>` represents a lazy enumeration of type `T`.

```trb
# Create an enumerator
numbers: Array<Integer> = [1, 2, 3, 4, 5]
enum: Enumerator<Integer> = numbers.each

# Lazy evaluation
large_range: Enumerator<Integer> = (1..1_000_000).lazy
squares: Enumerator<Integer> = large_range.map { |n| n * n }
first_five_squares: Integer[] = squares.first(5)
# Only computes first 5, not all 1 million

# Chain operations lazily
result = (1..Float::INFINITY)
  .lazy
  .select { |n| n.even? }
  .map { |n| n * 2 }
  .first(10)
# Efficiently gets first 10 results without infinite loop
```

## Proc\<Args, Return\>

`Proc<Args, Return>` represents a proc/lambda with typed parameters and return type.

```trb
# Simple proc
doubler: Proc<Integer, Integer> = ->(x: Integer): Integer { x * 2 }
result = doubler.call(5)  # 10

# Proc with multiple parameters
adder: Proc<Integer, Integer, Integer> = ->(x: Integer, y: Integer): Integer { x + y }
sum = adder.call(3, 4)  # 7

# Proc with no return value
printer: Proc<String, void> = ->(msg: String): void { puts msg }
printer.call("Hello!")

# Proc as parameter
def apply_twice<T>(value: T, fn: Proc<T, T>): T
  fn.call(fn.call(value))
end

result = apply_twice(5, doubler)  # 20 (5 * 2 * 2)

# Array of procs
operations: Proc<Integer, Integer>[] = [
  ->(x: Integer): Integer { x + 1 },
  ->(x: Integer): Integer { x * 2 },
  ->(x: Integer): Integer { x - 3 }
]

result = operations.reduce(10) { |acc, op| op.call(acc) }
# 10 + 1 = 11, 11 * 2 = 22, 22 - 3 = 19
```

## Optional Types with Nilable

While not strictly a generic, `T | nil` is used so frequently it deserves mention. T-Ruby also supports the shorthand `T?`.

```trb
# Explicit optional type
name: String | nil = "Alice"
age: Integer | nil = nil

# Shorthand syntax
name: String? = "Alice"
age: Integer? = nil

# Working with optional arrays
numbers: Integer[]? = [1, 2, 3]
numbers = nil

# Array of optional elements
numbers: (Integer | nil)[] = [1, nil, 3, nil, 5]
numbers: Integer?[] = [1, nil, 3, nil, 5]  # Same as above

# Optional hash
config: Hash<String, String>? = { "key" => "value" }
config = nil

# Hash with optional values
settings: Hash<String, String?> = {
  "name" => "MyApp",
  "description" => nil
}
```

## Combining Generic Types

Generic types can be combined in powerful ways:

```trb
# Array of hashes
users: Hash<Symbol, String | Integer>[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
]

# Hash of arrays
tags_by_category: Hash<String, String[]> = {
  "colors" => ["red", "blue", "green"],
  "sizes" => ["small", "medium", "large"]
}

# Array of arrays (matrix)
matrix: Integer[][] = [
  [1, 2, 3],
  [4, 5, 6]
]

# Hash with complex values
cache: Hash<String, Hash<Symbol, String>[]> = {
  "users" => [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" }
  ]
}

# Optional array of optional values
data: Integer?[]? = [1, nil, 3]
data = nil
```

## Type Aliases for Built-in Generics

Create readable aliases for complex generic types:

```trb
# Simple aliases
type StringArray = String[]
type IntHash = Hash<String, Integer>

# Complex aliases
type UserData = Hash<Symbol, String | Integer>
type UserList = UserData[]
type TagMap = Hash<String, String[]>

# Using aliases
users: UserList = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
]

tags: TagMap = {
  "ruby" => ["language", "dynamic"],
  "typescript" => ["language", "static"]
}

# Generic aliases
type Result<T> = T | nil
type Callback<T> = Proc<T, void>
type Transformer<T, U> = Proc<T, U>

# Using generic aliases
find_user: Result<User> = User.find(1)
on_success: Callback<String> = ->(msg: String): void { puts msg }
to_string: Transformer<Integer, String> = ->(n: Integer): String { n.to_s }
```

## Working with Built-in Methods

T-Ruby's type system understands Ruby's built-in array and hash methods:

```trb
# Array methods preserve types
numbers: Integer[] = [1, 2, 3, 4, 5]

first_three: Integer[] = numbers.take(3)        # [1, 2, 3]
last_two: Integer[] = numbers.drop(3)           # [4, 5]
reversed: Integer[] = numbers.reverse           # [5, 4, 3, 2, 1]
unique: Integer[] = [1, 2, 2, 3].uniq          # [1, 2, 3]
sorted: Integer[] = [3, 1, 2].sort             # [1, 2, 3]

# Combining arrays
combined: Integer[] = numbers + [6, 7, 8]      # [1, 2, 3, 4, 5, 6, 7, 8]
intersection: Integer[] = [1, 2, 3] & [2, 3, 4]  # [2, 3]
difference: Integer[] = [1, 2, 3] - [2, 3]       # [1]

# Hash methods
hash: Hash<String, Integer> = { "a" => 1, "b" => 2 }

merged: Hash<String, Integer> = hash.merge({ "c" => 3 })
inverted: Hash<Integer, String> = hash.invert       # { 1 => "a", 2 => "b" }
```

## Default Values and Safety

```trb
# Hash with default value
counts: Hash<String, Integer> = Hash.new(0)
counts["a"] += 1  # Safe: default is 0

# Hash with default block
groups: Hash<String, String[]> = Hash.new { |h, k| h[k] = [] }
groups["colors"].push("red")  # Safe: creates array if missing

# Array fetch with default
numbers: Integer[] = [1, 2, 3]
value: Integer = numbers.fetch(10, 0)  # Returns 0 if index out of bounds

# Hash fetch with default
config: Hash<String, String> = { "name" => "MyApp" }
port: String = config.fetch("port", "3000")  # Returns "3000" if key missing
```

## Best Practices

### 1. Prefer Specific Types Over Any

```trb
# Good: Specific types
users: User[] = []
config: Hash<Symbol, String> = {}

# Avoid: Using Any loses type safety
data: Any[] = []  # No type checking
```

### 2. Use Type Aliases for Complex Types

```trb
# Good: Clear, reusable alias
type UserMap = Hash<Integer, User>
type ErrorList = String[]

def process_users(users: UserMap): ErrorList
  # ...
end

# Less good: Repeated complex types
def process_users(users: Hash<Integer, User>): String[]
  # ...
end
```

### 3. Handle Nil Values Explicitly

```trb
# Good: Explicit nil handling
users: User[] = []
first_user: User? = users.first

if first_user
  puts first_user.name
else
  puts "No users found"
end

# Dangerous: Assuming non-nil
# first_user.name  # Could crash if nil!
```

### 4. Use Appropriate Collection Types

```trb
# Good: Use Set for unique items
unique_tags: Set<String> = Set.new

# Less efficient: Using Array for uniqueness
unique_tags: String[] = []
unique_tags.push(tag) unless unique_tags.include?(tag)
```

## Common Patterns

### Safe Array Access

```trb
def safe_get<T>(array: T[], index: Integer, default: T): T
  array.fetch(index, default)
end

numbers = [1, 2, 3]
value = safe_get(numbers, 10, 0)  # Returns 0 instead of nil
```

### Grouping with Hashes

```trb
class Person
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def age: Integer
    @age
  end
end

people: Person[] = [
  Person.new("Alice", 30),
  Person.new("Bob", 25),
  Person.new("Charlie", 30)
]

# Group by age
by_age: Hash<Integer, Person[]> = people.group_by { |p| p.age }
# { 30 => [Alice, Charlie], 25 => [Bob] }
```

### Memoization with Hashes

```trb
class Calculator
  @cache: Hash<Integer, Integer>

  def initialize: void
    @cache = {}
  end

  def expensive_calculation(n: Integer): Integer
    if @cache.key?(n)
      @cache[n]
    else
      result = n * n  # Expensive operation
      @cache[n] = result
      result
    end
  end
end
```

## Next Steps

Now that you understand T-Ruby's built-in generic types, you can:

- Explore [Type Aliases](/docs/learn/advanced/type-aliases) to create custom names for complex types
- Learn about [Utility Types](/docs/learn/advanced/utility-types) for advanced type transformations
- See [Generic Functions & Classes](/docs/learn/generics/generic-functions-classes) to create your own generic types
