---
sidebar_position: 3
title: Built-in Generics
description: Array, Hash, and other built-in generic types
---

# Built-in Generics

T-Ruby comes with several built-in generic types that you'll use every day. These types are parameterized to work with any type while providing type safety. Understanding how to use these built-in generics is essential for writing type-safe T-Ruby code.

## Array\<T\>

The most commonly used generic type is `Array<T>`, representing an array of elements of type `T`.

### Basic Array Usage

```ruby
# Explicitly typed arrays
numbers: Array<Integer> = [1, 2, 3, 4, 5]
names: Array<String> = ["Alice", "Bob", "Charlie"]
flags: Array<Bool> = [true, false, true]

# Type inference works too
inferred_numbers = [1, 2, 3]  # Array<Integer>
inferred_names = ["Alice", "Bob"]  # Array<String>

# Empty arrays need explicit types
empty_numbers: Array<Integer> = []
empty_users = Array<User>.new
```

### Array Operations

All standard array operations preserve type safety:

```ruby
numbers: Array<Integer> = [1, 2, 3, 4, 5]

# Accessing elements
first: Integer | nil = numbers[0]      # 1
last: Integer | nil = numbers[-1]      # 5
out_of_bounds: Integer | nil = numbers[100]  # nil

# Adding elements
numbers.push(6)        # Array<Integer>
numbers << 7           # Array<Integer>
numbers.unshift(0)     # Array<Integer>

# Removing elements
popped: Integer | nil = numbers.pop      # Removes and returns last
shifted: Integer | nil = numbers.shift   # Removes and returns first

# Checking contents
contains_three: Bool = numbers.include?(3)  # true
index: Integer | nil = numbers.index(3)     # 2
```

### Array Mapping and Transformation

Mapping transforms an `Array<T>` into an `Array<U>`:

```ruby
# Map integers to strings
numbers: Array<Integer> = [1, 2, 3, 4, 5]
strings: Array<String> = numbers.map { |n| n.to_s }
# Result: ["1", "2", "3", "4", "5"]

# Map strings to their lengths
words: Array<String> = ["hello", "world", "ruby"]
lengths: Array<Integer> = words.map { |w| w.length }
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

names: Array<String> = ["Alice", "Bob"]
people: Array<Person> = names.map { |name| Person.new(name, 25) }
```

### Array Filtering

Filtering maintains the same type:

```ruby
numbers: Array<Integer> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Filter for even numbers
evens: Array<Integer> = numbers.select { |n| n.even? }
# Result: [2, 4, 6, 8, 10]

# Filter for odd numbers
odds: Array<Integer> = numbers.reject { |n| n.even? }
# Result: [1, 3, 5, 7, 9]

# Find first matching element
first_even: Integer | nil = numbers.find { |n| n.even? }
# Result: 2

# Filter with complex conditions
words: Array<String> = ["hello", "world", "hi", "ruby", "typescript"]
long_words: Array<String> = words.select { |w| w.length > 4 }
# Result: ["hello", "world", "typescript"]
```

### Array Reduction

Reduce collapses an array into a single value:

```ruby
numbers: Array<Integer> = [1, 2, 3, 4, 5]

# Sum all numbers
sum: Integer = numbers.reduce(0) { |acc, n| acc + n }
# Result: 15

# Find maximum
max: Integer = numbers.reduce(numbers[0]) { |max, n| n > max ? n : max }
# Result: 5

# Concatenate strings
words: Array<String> = ["Hello", "World", "from", "T-Ruby"]
sentence: String = words.reduce("") { |acc, w| acc.empty? ? w : "#{acc} #{w}" }
# Result: "Hello World from T-Ruby"

# Build a hash from array
pairs: Array<Array<String>> = [["name", "Alice"], ["age", "30"]]
hash: Hash<String, String> = pairs.reduce({}) { |h, pair|
  h[pair[0]] = pair[1]
  h
}
```

### Nested Arrays

Arrays can be nested to any depth:

```ruby
# Two-dimensional array (matrix)
matrix: Array<Array<Integer>> = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]

# Accessing nested elements
first_row: Array<Integer> = matrix[0]      # [1, 2, 3]
element: Integer | nil = matrix[1][2]      # 6

# Three-dimensional array
cube: Array<Array<Array<Integer>>> = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
]

# Flatten nested arrays
nested: Array<Array<Integer>> = [[1, 2], [3, 4], [5, 6]]
flat: Array<Integer> = nested.flatten
# Result: [1, 2, 3, 4, 5, 6]
```

## Hash\<K, V\>

`Hash<K, V>` represents a hash map with keys of type `K` and values of type `V`.

### Basic Hash Usage

```ruby
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

```ruby
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
has_alice: Bool = ages.key?("Alice")      # true
has_bob: Bool = ages.key?("Bob")          # false (deleted)

# Getting keys and values
keys: Array<String> = ages.keys           # ["Alice", "Charlie"]
values: Array<Integer> = ages.values      # [31, 35]
```

### Hash Iteration

```ruby
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
name_score_pairs: Array<String> = scores.map { |name, score|
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

```ruby
# Hash with array values
tags: Hash<String, Array<String>> = {
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

```ruby
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
contains_three: Bool = numbers.include?(3)  # true

# Set operations
set1: Set<Integer> = Set.new([1, 2, 3, 4])
set2: Set<Integer> = Set.new([3, 4, 5, 6])

union: Set<Integer> = set1 | set2           # {1, 2, 3, 4, 5, 6}
intersection: Set<Integer> = set1 & set2    # {3, 4}
difference: Set<Integer> = set1 - set2      # {1, 2}

# Convert to array
array: Array<Integer> = numbers.to_a
```

## Range\<T\>

`Range<T>` represents a range of values from a start to an end.

```ruby
# Integer ranges
one_to_ten: Range<Integer> = 1..10      # Inclusive: 1, 2, ..., 10
one_to_nine: Range<Integer> = 1...10    # Exclusive: 1, 2, ..., 9

# Check if range includes a value
includes_five: Bool = one_to_ten.include?(5)  # true

# Convert to array
numbers: Array<Integer> = (1..5).to_a   # [1, 2, 3, 4, 5]

# Iterate over range
(1..5).each do |i|
  puts i
end

# Character ranges
alphabet: Range<String> = 'a'..'z'
letters: Array<String> = ('a'..'e').to_a  # ["a", "b", "c", "d", "e"]
```

## Enumerator\<T\>

`Enumerator<T>` represents a lazy enumeration of type `T`.

```ruby
# Create an enumerator
numbers: Array<Integer> = [1, 2, 3, 4, 5]
enum: Enumerator<Integer> = numbers.each

# Lazy evaluation
large_range: Enumerator<Integer> = (1..1_000_000).lazy
squares: Enumerator<Integer> = large_range.map { |n| n * n }
first_five_squares: Array<Integer> = squares.first(5)
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

```ruby
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
operations: Array<Proc<Integer, Integer>> = [
  ->(x: Integer): Integer { x + 1 },
  ->(x: Integer): Integer { x * 2 },
  ->(x: Integer): Integer { x - 3 }
]

result = operations.reduce(10) { |acc, op| op.call(acc) }
# 10 + 1 = 11, 11 * 2 = 22, 22 - 3 = 19
```

## Optional Types with Nilable

While not strictly a generic, `T | nil` is used so frequently it deserves mention. T-Ruby also supports the shorthand `T?`.

```ruby
# Explicit optional type
name: String | nil = "Alice"
age: Integer | nil = nil

# Shorthand syntax
name: String? = "Alice"
age: Integer? = nil

# Working with optional arrays
numbers: Array<Integer>? = [1, 2, 3]
numbers = nil

# Array of optional elements
numbers: Array<Integer | nil> = [1, nil, 3, nil, 5]
numbers: Array<Integer?> = [1, nil, 3, nil, 5]  # Same as above

# Optional hash
config: Hash<String, String>? = { "key" => "value" }
config = nil

# Hash with optional values
settings: Hash<String, String | nil> = {
  "name" => "MyApp",
  "description" => nil
}
```

## Combining Generic Types

Generic types can be combined in powerful ways:

```ruby
# Array of hashes
users: Array<Hash<Symbol, String | Integer>> = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
]

# Hash of arrays
tags_by_category: Hash<String, Array<String>> = {
  "colors" => ["red", "blue", "green"],
  "sizes" => ["small", "medium", "large"]
}

# Array of arrays (matrix)
matrix: Array<Array<Integer>> = [
  [1, 2, 3],
  [4, 5, 6]
]

# Hash with complex values
cache: Hash<String, Array<Hash<Symbol, String>>> = {
  "users" => [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" }
  ]
}

# Optional array of optional values
data: Array<Integer | nil>? = [1, nil, 3]
data = nil
```

## Type Aliases for Built-in Generics

Create readable aliases for complex generic types:

```ruby
# Simple aliases
type StringArray = Array<String>
type IntHash = Hash<String, Integer>

# Complex aliases
type UserData = Hash<Symbol, String | Integer>
type UserList = Array<UserData>
type TagMap = Hash<String, Array<String>>

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

```ruby
# Array methods preserve types
numbers: Array<Integer> = [1, 2, 3, 4, 5]

first_three: Array<Integer> = numbers.take(3)        # [1, 2, 3]
last_two: Array<Integer> = numbers.drop(3)           # [4, 5]
reversed: Array<Integer> = numbers.reverse           # [5, 4, 3, 2, 1]
unique: Array<Integer> = [1, 2, 2, 3].uniq          # [1, 2, 3]
sorted: Array<Integer> = [3, 1, 2].sort             # [1, 2, 3]

# Combining arrays
combined: Array<Integer> = numbers + [6, 7, 8]      # [1, 2, 3, 4, 5, 6, 7, 8]
intersection: Array<Integer> = [1, 2, 3] & [2, 3, 4]  # [2, 3]
difference: Array<Integer> = [1, 2, 3] - [2, 3]       # [1]

# Hash methods
hash: Hash<String, Integer> = { "a" => 1, "b" => 2 }

merged: Hash<String, Integer> = hash.merge({ "c" => 3 })
inverted: Hash<Integer, String> = hash.invert       # { 1 => "a", 2 => "b" }
```

## Default Values and Safety

```ruby
# Hash with default value
counts: Hash<String, Integer> = Hash.new(0)
counts["a"] += 1  # Safe: default is 0

# Hash with default block
groups: Hash<String, Array<String>> = Hash.new { |h, k| h[k] = [] }
groups["colors"].push("red")  # Safe: creates array if missing

# Array fetch with default
numbers: Array<Integer> = [1, 2, 3]
value: Integer = numbers.fetch(10, 0)  # Returns 0 if index out of bounds

# Hash fetch with default
config: Hash<String, String> = { "name" => "MyApp" }
port: String = config.fetch("port", "3000")  # Returns "3000" if key missing
```

## Best Practices

### 1. Prefer Specific Types Over Any

```ruby
# Good: Specific types
users: Array<User> = []
config: Hash<Symbol, String> = {}

# Avoid: Using Any loses type safety
data: Array<Any> = []  # No type checking
```

### 2. Use Type Aliases for Complex Types

```ruby
# Good: Clear, reusable alias
type UserMap = Hash<Integer, User>
type ErrorList = Array<String>

def process_users(users: UserMap): ErrorList
  # ...
end

# Less good: Repeated complex types
def process_users(users: Hash<Integer, User>): Array<String>
  # ...
end
```

### 3. Handle Nil Values Explicitly

```ruby
# Good: Explicit nil handling
users: Array<User> = []
first_user: User | nil = users.first

if first_user
  puts first_user.name
else
  puts "No users found"
end

# Dangerous: Assuming non-nil
# first_user.name  # Could crash if nil!
```

### 4. Use Appropriate Collection Types

```ruby
# Good: Use Set for unique items
unique_tags: Set<String> = Set.new

# Less efficient: Using Array for uniqueness
unique_tags: Array<String> = []
unique_tags.push(tag) unless unique_tags.include?(tag)
```

## Common Patterns

### Safe Array Access

```ruby
def safe_get<T>(array: Array<T>, index: Integer, default: T): T
  array.fetch(index, default)
end

numbers = [1, 2, 3]
value = safe_get(numbers, 10, 0)  # Returns 0 instead of nil
```

### Grouping with Hashes

```ruby
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

people: Array<Person> = [
  Person.new("Alice", 30),
  Person.new("Bob", 25),
  Person.new("Charlie", 30)
]

# Group by age
by_age: Hash<Integer, Array<Person>> = people.group_by { |p| p.age }
# { 30 => [Alice, Charlie], 25 => [Bob] }
```

### Memoization with Hashes

```ruby
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
