---
sidebar_position: 2
title: Arrays and Hashes
description: Working with Array and Hash types
---

# Arrays and Hashes

Arrays and hashes are the most commonly used collection types in T-Ruby. They allow you to store and organize multiple values in a structured way. This chapter will teach you how to use generic type parameters to create type-safe collections.

## Array Types

Arrays in T-Ruby use generic type syntax: `Array<T>`, where `T` is the type of elements in the array.

### Basic Array Syntax

```ruby title="array_basics.trb"
# Array of integers
numbers: Array<Integer> = [1, 2, 3, 4, 5]

# Array of strings
names: Array<String> = ["Alice", "Bob", "Charlie"]

# Array of floats
prices: Array<Float> = [9.99, 14.99, 19.99]

# Empty array (type annotation required)
items: Array<String> = []
```

### Type Inference with Arrays

When initializing with values, T-Ruby can infer the array type:

```ruby title="array_inference.trb"
# Type is inferred as Array<Integer>
numbers = [1, 2, 3, 4, 5]

# Type is inferred as Array<String>
names = ["Alice", "Bob", "Charlie"]

# For empty arrays, you must provide a type annotation
items: Array<String> = []
```

### Array Operations

```ruby title="array_operations.trb"
def add_item(items: Array<String>, item: String): Array<String>
  items << item
  items
end

def get_first(items: Array<String>): String | nil
  items.first
end

def get_last(items: Array<Integer>): Integer | nil
  items.last
end

def array_length(items: Array<String>): Integer
  items.length
end

# Usage
list: Array<String> = ["apple", "banana"]
updated = add_item(list, "cherry")  # ["apple", "banana", "cherry"]

first: String | nil = get_first(list)  # "apple"
count: Integer = array_length(list)  # 3
```

### Accessing Array Elements

```ruby title="array_access.trb"
def get_at_index(items: Array<String>, index: Integer): String | nil
  items[index]
end

def get_slice(items: Array<Integer>, start: Integer, length: Integer): Array<Integer>
  items[start, length]
end

def get_range(items: Array<String>, range: Range): Array<String>
  items[range]
end

fruits: Array<String> = ["apple", "banana", "cherry", "date"]

item: String | nil = get_at_index(fruits, 0)  # "apple"
slice: Array<Integer> = get_slice([1, 2, 3, 4, 5], 1, 3)  # [2, 3, 4]
subset: Array<String> = get_range(fruits, 1..2)  # ["banana", "cherry"]
```

### Iterating Over Arrays

```ruby title="array_iteration.trb"
def sum_numbers(numbers: Array<Integer>): Integer
  total = 0
  numbers.each do |n|
    total += n
  end
  total
end

def double_values(numbers: Array<Integer>): Array<Integer>
  numbers.map { |n| n * 2 }
end

def filter_positive(numbers: Array<Integer>): Array<Integer>
  numbers.select { |n| n > 0 }
end

def find_first_even(numbers: Array<Integer>): Integer | nil
  numbers.find { |n| n % 2 == 0 }
end

total: Integer = sum_numbers([1, 2, 3, 4, 5])  # 15
doubled: Array<Integer> = double_values([1, 2, 3])  # [2, 4, 6]
positive: Array<Integer> = filter_positive([-1, 2, -3, 4])  # [2, 4]
even: Integer | nil = find_first_even([1, 3, 4, 5])  # 4
```

### Array Transformation Methods

```ruby title="array_transform.trb"
def join_strings(items: Array<String>, separator: String): String
  items.join(separator)
end

def reverse_array(items: Array<Integer>): Array<Integer>
  items.reverse
end

def sort_numbers(numbers: Array<Integer>): Array<Integer>
  numbers.sort
end

def unique_items(items: Array<String>): Array<String>
  items.uniq
end

joined: String = join_strings(["a", "b", "c"], "-")  # "a-b-c"
reversed: Array<Integer> = reverse_array([1, 2, 3])  # [3, 2, 1]
sorted: Array<Integer> = sort_numbers([3, 1, 4, 2])  # [1, 2, 3, 4]
unique: Array<String> = unique_items(["a", "b", "a", "c"])  # ["a", "b", "c"]
```

### Nested Arrays

Arrays can contain other arrays:

```ruby title="nested_arrays.trb"
# 2D array (array of arrays)
def create_grid(rows: Integer, cols: Integer): Array<Array<Integer>>
  grid: Array<Array<Integer>> = []

  rows.times do |r|
    row: Array<Integer> = []
    cols.times do |c|
      row << (r * cols + c)
    end
    grid << row
  end

  grid
end

def get_cell(grid: Array<Array<Integer>>, row: Integer, col: Integer): Integer | nil
  return nil if grid[row].nil?
  grid[row][col]
end

matrix: Array<Array<Integer>> = create_grid(3, 3)
# [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

value = get_cell(matrix, 1, 1)  # 4
```

## Hash Types

Hashes in T-Ruby use generic type syntax: `Hash<K, V>`, where `K` is the key type and `V` is the value type.

### Basic Hash Syntax

```ruby title="hash_basics.trb"
# Hash with Symbol keys and String values
user: Hash<Symbol, String> = {
  name: "Alice",
  email: "alice@example.com"
}

# Hash with String keys and Integer values
scores: Hash<String, Integer> = {
  "math" => 95,
  "science" => 88,
  "english" => 92
}

# Hash with Integer keys and String values
id_map: Hash<Integer, String> = {
  1 => "Alice",
  2 => "Bob",
  3 => "Charlie"
}

# Empty hash (type annotation required)
config: Hash<Symbol, String> = {}
```

### Type Inference with Hashes

T-Ruby can infer hash types from their contents:

```ruby title="hash_inference.trb"
# Inferred as Hash<Symbol, String>
user = {
  name: "Alice",
  role: "admin"
}

# Inferred as Hash<String, Integer>
scores = {
  "alice" => 100,
  "bob" => 95
}

# For empty hashes, you must provide a type annotation
config: Hash<Symbol, String> = {}
```

### Hash Operations

```ruby title="hash_operations.trb"
def get_value(hash: Hash<Symbol, String>, key: Symbol): String | nil
  hash[key]
end

def set_value(hash: Hash<Symbol, Integer>, key: Symbol, value: Integer)
  hash[key] = value
end

def has_key(hash: Hash<String, Integer>, key: String): Bool
  hash.key?(key)
end

def hash_size(hash: Hash<Symbol, String>): Integer
  hash.size
end

# Usage
config: Hash<Symbol, String> = { mode: "production", version: "1.0" }

value: String | nil = get_value(config, :mode)  # "production"
exists: Bool = has_key({ "a" => 1 }, "a")  # true
count: Integer = hash_size(config)  # 2
```

### Iterating Over Hashes

```ruby title="hash_iteration.trb"
def print_hash(hash: Hash<Symbol, String>)
  hash.each do |key, value|
    puts "#{key}: #{value}"
  end
end

def get_keys(hash: Hash<String, Integer>): Array<String>
  hash.keys
end

def get_values(hash: Hash<Symbol, Integer>): Array<Integer>
  hash.values
end

def transform_values(hash: Hash<Symbol, Integer>): Hash<Symbol, Integer>
  hash.transform_values { |v| v * 2 }
end

scores: Hash<String, Integer> = { "alice" => 95, "bob" => 88 }

keys: Array<String> = get_keys(scores)  # ["alice", "bob"]
values: Array<Integer> = get_values({ a: 1, b: 2 })  # [1, 2]

doubled: Hash<Symbol, Integer> = transform_values({ a: 5, b: 10 })
# { a: 10, b: 20 }
```

### Hash Transformation Methods

```ruby title="hash_transform.trb"
def merge_hashes(
  hash1: Hash<Symbol, String>,
  hash2: Hash<Symbol, String>
): Hash<Symbol, String>
  hash1.merge(hash2)
end

def select_entries(
  hash: Hash<String, Integer>,
  threshold: Integer
): Hash<String, Integer>
  hash.select { |k, v| v >= threshold }
end

def invert_hash(hash: Hash<String, Integer>): Hash<Integer, String>
  hash.invert
end

h1: Hash<Symbol, String> = { a: "1", b: "2" }
h2: Hash<Symbol, String> = { b: "3", c: "4" }

merged: Hash<Symbol, String> = merge_hashes(h1, h2)
# { a: "1", b: "3", c: "4" }

scores: Hash<String, Integer> = { "alice" => 95, "bob" => 85, "charlie" => 90 }
high_scores: Hash<String, Integer> = select_entries(scores, 90)
# { "alice" => 95, "charlie" => 90 }

inverted: Hash<Integer, String> = invert_hash({ "a" => 1, "b" => 2 })
# { 1 => "a", 2 => "b" }
```

### Nested Hashes

Hashes can contain other hashes:

```ruby title="nested_hashes.trb"
# Hash containing hashes
def create_user(
  name: String,
  age: Integer,
  email: String
): Hash<Symbol, String | Integer | Hash<Symbol, String>>
  {
    name: name,
    age: age,
    contact: {
      email: email,
      phone: "555-0100"
    }
  }
end

def get_nested_value(
  data: Hash<Symbol, String | Hash<Symbol, String>>,
  outer_key: Symbol,
  inner_key: Symbol
): String | nil
  outer = data[outer_key]
  if outer.is_a?(Hash)
    outer[inner_key]
  else
    nil
  end
end

user = create_user("Alice", 30, "alice@example.com")
# {
#   name: "Alice",
#   age: 30,
#   contact: { email: "alice@example.com", phone: "555-0100" }
# }
```

## Working with Union Types in Collections

Collections can hold multiple types using union types:

### Arrays with Union Types

```ruby title="array_unions.trb"
# Array that can contain strings or integers
def create_mixed_array(): Array<String | Integer>
  ["alice", 42, "bob", 100]
end

def sum_numbers_from_mixed(items: Array<String | Integer>): Integer
  total = 0

  items.each do |item|
    if item.is_a?(Integer)
      total += item
    end
  end

  total
end

mixed: Array<String | Integer> = create_mixed_array()
sum: Integer = sum_numbers_from_mixed(mixed)  # 142
```

### Hashes with Union Types

```ruby title="hash_unions.trb"
# Hash with mixed value types
def create_config(): Hash<Symbol, String | Integer | Bool>
  {
    host: "localhost",
    port: 3000,
    ssl: true,
    timeout: 30
  }
end

def get_config_value(
  config: Hash<Symbol, String | Integer | Bool>,
  key: Symbol
): String | Integer | Bool | nil
  config[key]
end

def get_port(config: Hash<Symbol, String | Integer | Bool>): Integer | nil
  port = config[:port]
  if port.is_a?(Integer)
    port
  else
    nil
  end
end

config = create_config()
port: Integer | nil = get_port(config)  # 3000
```

## Practical Example: Data Processing

Here's a comprehensive example combining arrays and hashes:

```ruby title="data_processing.trb"
class DataProcessor
  def initialize()
    @records: Array<Hash<Symbol, String | Integer>> = []
  end

  def add_record(name: String, age: Integer, score: Integer)
    record: Hash<Symbol, String | Integer> = {
      name: name,
      age: age,
      score: score
    }
    @records << record
  end

  def get_all_names(): Array<String>
    names: Array<String> = []

    @records.each do |record|
      name = record[:name]
      if name.is_a?(String)
        names << name
      end
    end

    names
  end

  def get_average_score(): Float
    return 0.0 if @records.empty?

    total = 0

    @records.each do |record|
      score = record[:score]
      if score.is_a?(Integer)
        total += score
      end
    end

    total.to_f / @records.length
  end

  def get_top_scorers(threshold: Integer): Array<String>
    top_scorers: Array<String> = []

    @records.each do |record|
      score = record[:score]
      name = record[:name]

      if score.is_a?(Integer) && name.is_a?(String) && score >= threshold
        top_scorers << name
      end
    end

    top_scorers
  end

  def group_by_age(): Hash<Integer, Array<String>>
    groups: Hash<Integer, Array<String>> = {}

    @records.each do |record|
      age = record[:age]
      name = record[:name]

      if age.is_a?(Integer) && name.is_a?(String)
        if groups[age].nil?
          groups[age] = []
        end
        groups[age] << name
      end
    end

    groups
  end

  def get_statistics(): Hash<Symbol, Float | Integer>
    count = @records.length
    avg = get_average_score()

    max_score = 0
    @records.each do |record|
      score = record[:score]
      if score.is_a?(Integer) && score > max_score
        max_score = score
      end
    end

    {
      count: count,
      average: avg,
      max: max_score
    }
  end
end

# Usage
processor = DataProcessor.new()

processor.add_record("Alice", 25, 95)
processor.add_record("Bob", 30, 88)
processor.add_record("Charlie", 25, 92)

names: Array<String> = processor.get_all_names()
# ["Alice", "Bob", "Charlie"]

avg: Float = processor.get_average_score()
# 91.67

top: Array<String> = processor.get_top_scorers(90)
# ["Alice", "Charlie"]

by_age: Hash<Integer, Array<String>> = processor.group_by_age()
# { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

stats: Hash<Symbol, Float | Integer> = processor.get_statistics()
# { count: 3, average: 91.67, max: 95 }
```

## Common Patterns

### Building Arrays Dynamically

```ruby title="array_building.trb"
def build_range(start: Integer, stop: Integer): Array<Integer>
  result: Array<Integer> = []

  i = start
  while i <= stop
    result << i
    i += 1
  end

  result
end

def filter_and_transform(
  numbers: Array<Integer>,
  threshold: Integer
): Array<String>
  result: Array<String> = []

  numbers.each do |n|
    if n > threshold
      result << "High: #{n}"
    end
  end

  result
end

range: Array<Integer> = build_range(1, 5)  # [1, 2, 3, 4, 5]
filtered: Array<String> = filter_and_transform([10, 5, 20, 3], 8)
# ["High: 10", "High: 20"]
```

### Building Hashes Dynamically

```ruby title="hash_building.trb"
def count_occurrences(words: Array<String>): Hash<String, Integer>
  counts: Hash<String, Integer> = {}

  words.each do |word|
    current = counts[word]
    if current.nil?
      counts[word] = 1
    else
      counts[word] = current + 1
    end
  end

  counts
end

def index_by_property(
  items: Array<Hash<Symbol, String>>,
  key: Symbol
): Hash<String, Hash<Symbol, String>>
  index: Hash<String, Hash<Symbol, String>> = {}

  items.each do |item|
    key_value = item[key]
    if key_value.is_a?(String)
      index[key_value] = item
    end
  end

  index
end

words: Array<String> = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts: Hash<String, Integer> = count_occurrences(words)
# { "apple" => 3, "banana" => 2, "cherry" => 1 }
```

## Common Pitfalls

### Empty Collections Need Type Annotations

```ruby title="empty_collections.trb"
# This won't work - type cannot be inferred
# items = []  # Error!

# Always annotate empty collections
items: Array<String> = []
config: Hash<Symbol, Integer> = {}
```

### Mutating Collections

```ruby title="mutation.trb"
def add_item_wrong(items: Array<String>): Array<String>
  # This mutates the original array
  items << "new"
  items
end

def add_item_safe(items: Array<String>): Array<String>
  # Create a copy first
  new_items = items.dup
  new_items << "new"
  new_items
end

original: Array<String> = ["a", "b"]
result1 = add_item_wrong(original)
# original is now ["a", "b", "new"]!

original2: Array<String> = ["a", "b"]
result2 = add_item_safe(original2)
# original2 is still ["a", "b"]
```

### Hash Key Types Matter

```ruby title="hash_keys.trb"
# Symbol keys and String keys are different!
def demonstrate_key_types()
  hash: Hash<Symbol | String, Integer> = {}

  hash[:name] = 1  # Symbol key
  hash["name"] = 2  # String key

  # These are different entries!
  hash[:name]  # Returns 1
  hash["name"]  # Returns 2
end
```

## Summary

Arrays and Hashes are essential collection types in T-Ruby:

- **Arrays** use `Array<T>` syntax for homogeneous collections
- **Hashes** use `Hash<K, V>` syntax for key-value pairs
- **Type inference** works for non-empty collections
- **Empty collections** always require type annotations
- **Union types** allow mixed-type collections
- **Nested structures** combine arrays and hashes for complex data

Understanding these collection types is crucial for organizing data in T-Ruby applications. In the next chapter, you'll learn about union types in more detail.
