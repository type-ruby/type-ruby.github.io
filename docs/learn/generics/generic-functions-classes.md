---
sidebar_position: 1
title: Generic Functions & Classes
description: Creating reusable code with generics
---

<DocsBadge />


# Generic Functions & Classes

Generics are one of the most powerful features in T-Ruby, allowing you to write code that works with multiple types while maintaining type safety. Think of generics as "type variables"—placeholders that get filled in with concrete types when your code is used.

## Why Generics?

Without generics, you'd need to write the same function multiple times for different types, or lose type safety by using `Any`. Generics let you write code once and reuse it with different types.

### The Problem: Without Generics

```trb
# Without generics, you need separate functions for each type
def first_string(arr: String[]): String | nil
  arr[0]
end

def first_integer(arr: Integer[]): Integer | nil
  arr[0]
end

def first_user(arr: User[]): User | nil
  arr[0]
end

# Or you lose type safety
def first(arr: Any[]): Any
  arr[0]  # Return type is Any - no type safety!
end
```

### The Solution: With Generics

```trb
# One function that works for all types
def first<T>(arr: T[]): T | nil
  arr[0]
end

# TypeScript-style inference works automatically
names = ["Alice", "Bob", "Charlie"]
result = first(names)  # result is String | nil

numbers = [1, 2, 3]
value = first(numbers)  # value is Integer | nil
```

## Generic Functions

Generic functions use type parameters in angle brackets (`<T>`) to represent types that will be determined when the function is called.

### Basic Generic Function

```trb
# A simple generic function
def identity<T>(value: T): T
  value
end

# Works with any type
str = identity("hello")      # String
num = identity(42)           # Integer
arr = identity([1, 2, 3])    # Integer[]
```

### Multiple Type Parameters

You can use multiple type parameters when needed:

```trb
# A function with two type parameters
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# Type inference works for both parameters
result = pair("name", "Alice")     # Hash<String, String>
data = pair(:id, 123)              # Hash<Symbol, Integer>
mixed = pair("count", 42)          # Hash<String, Integer>
```

### Generic Functions with Arrays

A common use case is working with arrays of any type:

```trb
# Get the last element of an array
def last<T>(arr: T[]): T | nil
  arr[-1]
end

# Reverse an array
def reverse<T>(arr: T[]): T[]
  arr.reverse
end

# Filter an array with a predicate
def filter<T>(arr: T[], &block: Proc<T, Boolean>): T[]
  arr.select { |item| block.call(item) }
end

# Usage
numbers = [1, 2, 3, 4, 5]
evens = filter(numbers) { |n| n.even? }  # Integer[]

words = ["hello", "world", "foo", "bar"]
long_words = filter(words) { |w| w.length > 3 }  # String[]
```

### Generic Functions with Return Type Transformation

Sometimes the return type differs from the input type, but is still generic:

```trb
# Map function that transforms type T to type U
def map<T, U>(arr: T[], &block: Proc<T, U>): U[]
  arr.map { |item| block.call(item) }
end

# Transform integers to strings
numbers = [1, 2, 3]
strings = map(numbers) { |n| n.to_s }  # String[]

# Transform strings to their lengths
words = ["hello", "world"]
lengths = map(words) { |w| w.length }  # Integer[]
```

## Generic Classes

Generic classes allow you to create data structures that work with any type while maintaining type safety throughout the class.

### Basic Generic Class

```trb
# A simple generic container
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end

  def set(value: T): void
    @value = value
  end
end

# Create boxes with different types
string_box = Box<String>.new("hello")
puts string_box.get  # "hello"

number_box = Box<Integer>.new(42)
puts number_box.get  # 42

# Type safety is enforced
string_box.set("world")  # OK
string_box.set(123)      # Error: Type mismatch
```

### Generic Class with Type Inference

T-Ruby can often infer the type parameter from the constructor:

```trb
class Container<T>
  @item: T

  def initialize(item: T): void
    @item = item
  end

  def item: T
    @item
  end

  def update(new_item: T): void
    @item = new_item
  end
end

# Type inference from constructor argument
container1 = Container.new("hello")  # Container<String>
container2 = Container.new(42)       # Container<Integer>

# Or explicitly specify the type
container3 = Container<Boolean>.new(true)
```

### Generic Stack Example

Here's a practical example of a generic stack data structure:

```trb
class Stack<T>
  @items: T[]

  def initialize: void
    @items = []
  end

  def push(item: T): void
    @items.push(item)
  end

  def pop: T | nil
    @items.pop
  end

  def peek: T | nil
    @items.last
  end

  def empty?: Boolean
    @items.empty?
  end

  def size: Integer
    @items.length
  end

  def to_a: T[]
    @items.dup
  end
end

# Usage with strings
string_stack = Stack<String>.new
string_stack.push("first")
string_stack.push("second")
string_stack.push("third")
puts string_stack.pop  # "third"
puts string_stack.size # 2

# Usage with integers
int_stack = Stack<Integer>.new
int_stack.push(1)
int_stack.push(2)
int_stack.push(3)
puts int_stack.peek  # 3 (doesn't remove)
puts int_stack.size  # 3
```

### Generic Class with Multiple Type Parameters

Generic classes can have multiple type parameters:

```trb
class Pair<K, V>
  @key: K
  @value: V

  def initialize(key: K, value: V): void
    @key = key
    @value = value
  end

  def key: K
    @key
  end

  def value: V
    @value
  end

  def swap: Pair<V, K>
    Pair.new(@value, @key)
  end

  def to_s: String
    "#{@key} => #{@value}"
  end
end

# Create pairs with different type combinations
name_age = Pair.new("Alice", 30)     # Pair<String, Integer>
id_name = Pair.new(123, "Bob")       # Pair<Integer, String>
coords = Pair.new(10.5, 20.3)        # Pair<Float, Float>

# Swap creates a new pair with types reversed
swapped = name_age.swap              # Pair<Integer, String>
```

### Generic Collection Class

A more complex example showing a custom collection:

```trb
class Collection<T>
  @items: T[]

  def initialize(items: T[] = []): void
    @items = items.dup
  end

  def add(item: T): void
    @items.push(item)
  end

  def remove(item: T): Boolean
    if index = @items.index(item)
      @items.delete_at(index)
      true
    else
      false
    end
  end

  def contains?(item: T): Boolean
    @items.include?(item)
  end

  def first: T | nil
    @items.first
  end

  def last: T | nil
    @items.last
  end

  def map<U>(&block: Proc<T, U>): Collection<U>
    Collection<U>.new(@items.map { |item| block.call(item) })
  end

  def filter(&block: Proc<T, Boolean>): Collection<T>
    Collection.new(@items.select { |item| block.call(item) })
  end

  def each(&block: Proc<T, void>): void
    @items.each { |item| block.call(item) }
  end

  def to_a: T[]
    @items.dup
  end

  def size: Integer
    @items.length
  end
end

# Usage
numbers = Collection<Integer>.new([1, 2, 3, 4, 5])
numbers.add(6)

# Map transforms the collection to a new type
strings = numbers.map { |n| n.to_s }  # Collection<String>

# Filter maintains the same type
evens = numbers.filter { |n| n.even? }  # Collection<Integer>

# Iterate over items
numbers.each { |n| puts n }
```

## Generic Methods in Non-Generic Classes

You can have generic methods in classes that aren't themselves generic:

```trb
class Utils
  # Generic method in a non-generic class
  def self.wrap<T>(value: T): T[]
    [value]
  end

  def self.duplicate<T>(value: T, times: Integer): T[]
    Array.new(times, value)
  end

  def self.zip<T, U>(arr1: T[], arr2: U[]): Pair<T, U>[]
    arr1.zip(arr2).map { |t, u| Pair.new(t, u) }
  end
end

# Usage
wrapped = Utils.wrap(42)                    # Integer[]
duplicates = Utils.duplicate("hello", 3)    # String[]
zipped = Utils.zip([1, 2], ["a", "b"])      # Array<Pair<Integer, String>>
```

## Nested Generics

Generics can be nested to create complex type structures:

```trb
# A cache that stores arrays of values for each key
class Cache<K, V>
  @store: Hash<K, V[]>

  def initialize: void
    @store = {}
  end

  def add(key: K, value: V): void
    @store[key] ||= []
    @store[key].push(value)
  end

  def get(key: K): V[]
    @store[key] || []
  end

  def has_key?(key: K): Boolean
    @store.key?(key)
  end
end

# Usage
user_tags = Cache<Integer, String>.new  # Cache<Integer, String>
user_tags.add(1, "ruby")
user_tags.add(1, "programming")
user_tags.add(2, "design")

tags = user_tags.get(1)  # String[] = ["ruby", "programming"]
```

## Best Practices

### 1. Use Descriptive Type Parameter Names

```trb
# Good: Descriptive names for domain-specific types
class Repository<Entity, Id>
  def find(id: Id): Entity | nil
    # ...
  end
end

# OK: Standard conventions for generic collections
class List<T>
  # ...
end

# Avoid: Non-descriptive single letters for complex scenarios
class Processor<A, B, C, D>  # Too cryptic
  # ...
end
```

### 2. Keep Generic Functions Simple

```trb
# Good: Simple, focused generic function
def head<T>(arr: T[]): T | nil
  arr.first
end

# Less good: Too many responsibilities
def process<T>(arr: T[], flag: Boolean, count: Integer): T[] | Hash<Integer, T>
  # Too complex, hard to understand the generic behavior
end
```

### 3. Use Type Inference When Possible

```trb
# Let T-Ruby infer types from arguments
container = Container.new("hello")  # Container<String> inferred

# Only specify types when necessary
container = Container<String | Integer>.new("hello")
```

## Common Patterns

### Option/Maybe Type

```trb
class Option<T>
  @value: T | nil

  def initialize(value: T | nil): void
    @value = value
  end

  def is_some?: Boolean
    !@value.nil?
  end

  def is_none?: Boolean
    @value.nil?
  end

  def unwrap: T
    raise "Called unwrap on None" if @value.nil?
    @value
  end

  def unwrap_or(default: T): T
    @value || default
  end

  def map<U>(&block: Proc<T, U>): Option<U>
    if @value
      Option.new(block.call(@value))
    else
      Option<U>.new(nil)
    end
  end
end

# Usage
some = Option.new(42)
none = Option<Integer>.new(nil)

puts some.unwrap_or(0)  # 42
puts none.unwrap_or(0)  # 0

result = some.map { |n| n * 2 }  # Option<Integer> with value 84
```

### Result Type

```trb
class Result<T, E>
  @value: T | nil
  @error: E | nil

  def self.ok(value: T): Result<T, E>
    result = Result<T, E>.new
    result.instance_variable_set(:@value, value)
    result
  end

  def self.err(error: E): Result<T, E>
    result = Result<T, E>.new
    result.instance_variable_set(:@error, error)
    result
  end

  def ok?: Boolean
    !@value.nil?
  end

  def err?: Boolean
    !@error.nil?
  end

  def unwrap: T
    raise "Called unwrap on Err: #{@error}" if @error
    @value
  end

  def unwrap_err: E
    raise "Called unwrap_err on Ok" if @value
    @error
  end
end

# Usage
def divide(a: Integer, b: Integer): Result<Float, String>
  if b == 0
    Result.err("Division by zero")
  else
    Result.ok(a.to_f / b)
  end
end

result = divide(10, 2)
puts result.unwrap if result.ok?  # 5.0

result = divide(10, 0)
puts result.unwrap_err if result.err?  # "Division by zero"
```

## Next Steps

Now that you understand generic functions and classes, you can:

- Learn about [Constraints](/docs/learn/generics/constraints) to limit which types can be used with generics
- Explore [Built-in Generics](/docs/learn/generics/built-in-generics) like `T[]` and `Hash<K, V>`
- See how generics work with [Interfaces](/docs/learn/interfaces/defining-interfaces)
