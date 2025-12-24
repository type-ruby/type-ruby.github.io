---
sidebar_position: 2
title: Built-in Types
description: Complete list of built-in types
---

<DocsBadge />


# Built-in Types

T-Ruby provides a comprehensive set of built-in types that correspond to Ruby's fundamental data types and commonly-used patterns. This reference documents all built-in types available in T-Ruby.

## Primitive Types

### String

Represents text data. Strings are sequences of characters.

```trb
name: String = "Alice"
message: String = 'Hello, world!'
text: String = <<~TEXT
  Multi-line
  string
TEXT
```

**Common Methods:**
- `length: Integer` - Returns string length
- `upcase: String` - Converts to uppercase
- `downcase: String` - Converts to lowercase
- `strip: String` - Removes leading/trailing whitespace
- `split(delimiter: String): Array<String>` - Splits into array
- `include?(substring: String): Boolean` - Checks if contains substring
- `empty?: Boolean` - Checks if string is empty

### Integer

Represents whole numbers (positive, negative, or zero).

```trb
count: Integer = 42
negative: Integer = -10
zero: Integer = 0
large: Integer = 1_000_000
```

**Common Methods:**
- `abs: Integer` - Absolute value
- `even?: Boolean` - Checks if even
- `odd?: Boolean` - Checks if odd
- `to_s: String` - Converts to string
- `to_f: Float` - Converts to float
- `times(&block: Proc<Integer, void>): void` - Iterates n times

### Float

Represents decimal numbers (floating-point).

```trb
price: Float = 19.99
pi: Float = 3.14159
negative: Float = -273.15
scientific: Float = 2.998e8
```

**Common Methods:**
- `round: Integer` - Rounds to nearest integer
- `round(digits: Integer): Float` - Rounds to decimal places
- `ceil: Integer` - Rounds up
- `floor: Integer` - Rounds down
- `abs: Float` - Absolute value
- `to_s: String` - Converts to string
- `to_i: Integer` - Converts to integer

### Boolean

Represents boolean values: `true` or `false`.

```trb
active: Boolean = true
disabled: Boolean = false
is_valid: Boolean = count > 0
```

**Note:** T-Ruby uses `Boolean` (not `Boolean`) as the type name. Only `true` and `false` are valid boolean values. Unlike Ruby's truthiness system, `Boolean` does not accept truthy values like `1`, `"yes"`, or empty strings.

### Symbol

Represents immutable identifiers. Symbols are optimized for use as constants and hash keys.

```trb
status: Symbol = :active
role: Symbol = :admin
key: Symbol = :name
```

**Common Methods:**
- `to_s: String` - Converts to string
- `to_sym: Symbol` - Returns self (for compatibility)

**Common Uses:**
- Hash keys: `{ name: "Alice", role: :admin }`
- Constants and enumerations
- Method names and identifiers

### nil

Represents the absence of a value.

```trb
nothing: nil = nil

# More commonly used in union types
optional: String | nil = nil
result: User | nil = find_user(123)
```

**Methods:**
- `nil?: Boolean` - Always returns `true` for nil

## Special Types

### Any

Represents any type. Use sparingly as it bypasses type checking.

```trb
value: Any = "string"
value = 123          # OK
value = true         # OK
```

**Warning:** `Any` defeats the purpose of type safety. Prefer union types like `String | Integer` when possible.

### void

Represents no return value. Used for functions that perform side effects.

```trb
def log(message: String): void
  puts message
end

def save(data: Hash): void
  File.write("data.json", data.to_json)
end
```

**Note:** Functions with `void` return type can still execute `return` for early exit, but should not return a meaningful value.

### never

Represents values that never occur. Used for functions that never return.

```trb
def raise_error(message: String): never
  raise StandardError, message
end

def infinite_loop: never
  loop { }
end
```

### self

Represents the type of the current instance. Useful for method chaining.

```trb
class Builder
  @value: String

  def initialize: void
    @value = ""
  end

  def append(text: String): self
    @value += text
    self
  end

  def build: String
    @value
  end
end

# Method chaining works
result = Builder.new.append("Hello").append(" ").append("World").build
```

## Collection Types

### Array\<T\>

Represents an ordered collection of elements of type `T`.

```trb
# Array of strings
names: Array<String> = ["Alice", "Bob", "Charlie"]

# Array of integers
numbers: Array<Integer> = [1, 2, 3, 4, 5]

# Array of mixed types
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]

# Nested arrays
matrix: Array<Array<Integer>> = [[1, 2], [3, 4]]

# Empty typed array
items: Array<String> = []
```

**Common Methods:**
- `length: Integer` - Returns array length
- `size: Integer` - Alias for length
- `empty?: Boolean` - Checks if empty
- `first: T | nil` - Returns first element
- `last: T | nil` - Returns last element
- `push(item: T): Array<T>` - Adds element to end
- `pop: T | nil` - Removes and returns last element
- `shift: T | nil` - Removes and returns first element
- `unshift(item: T): Array<T>` - Adds element to beginning
- `include?(item: T): Boolean` - Checks if contains element
- `map<U>(&block: Proc<T, U>): Array<U>` - Transforms elements
- `select(&block: Proc<T, Boolean>): Array<T>` - Filters elements
- `each(&block: Proc<T, void>): void` - Iterates over elements
- `reverse: Array<T>` - Returns reversed array
- `sort: Array<T>` - Returns sorted array
- `join(separator: String): String` - Joins into string

### Hash\<K, V\>

Represents a collection of key-value pairs with keys of type `K` and values of type `V`.

```trb
# String keys, Integer values
scores: Hash<String, Integer> = { "Alice" => 100, "Bob" => 95 }

# Symbol keys, String values
config: Hash<Symbol, String> = { host: "localhost", port: "3000" }

# Mixed value types
user: Hash<Symbol, String | Integer> = { name: "Alice", age: 30 }

# Nested hashes
data: Hash<String, Hash<String, Integer>> = {
  "users" => { "total" => 100, "active" => 75 }
}

# Empty typed hash
cache: Hash<String, Any> = {}
```

**Common Methods:**
- `length: Integer` - Returns number of pairs
- `size: Integer` - Alias for length
- `empty?: Boolean` - Checks if empty
- `key?(key: K): Boolean` - Checks if key exists
- `value?(value: V): Boolean` - Checks if value exists
- `keys: Array<K>` - Returns array of keys
- `values: Array<V>` - Returns array of values
- `fetch(key: K): V` - Gets value (raises if not found)
- `fetch(key: K, default: V): V` - Gets value with default
- `merge(other: Hash<K, V>): Hash<K, V>` - Merges hashes
- `each(&block: Proc<K, V, void>): void` - Iterates over pairs

### Set\<T\>

Represents an unordered collection of unique elements.

```trb
# Set of strings
tags: Set<String> = Set.new(["ruby", "rails", "web"])

# Set of integers
unique_ids: Set<Integer> = Set.new([1, 2, 3, 2, 1])  # {1, 2, 3}
```

**Common Methods:**
- `add(item: T): Set<T>` - Adds element
- `delete(item: T): Set<T>` - Removes element
- `include?(item: T): Boolean` - Checks membership
- `empty?: Boolean` - Checks if empty
- `size: Integer` - Returns number of elements
- `to_a: Array<T>` - Converts to array

### Range

Represents a range of values.

```trb
# Integer range
numbers: Range = 1..10      # Inclusive: 1 to 10
numbers: Range = 1...10     # Exclusive: 1 to 9

# Character range
letters: Range = 'a'..'z'
```

**Common Methods:**
- `to_a: Array` - Converts to array
- `each(&block: Proc<Any, void>): void` - Iterates over range
- `include?(value: Any): Boolean` - Checks if value in range
- `first: Any` - Returns first value
- `last: Any` - Returns last value

## Numeric Types

### Numeric

Parent type for all numeric types.

```trb
value: Numeric = 42
value: Numeric = 3.14
```

**Subtypes:**
- `Integer`
- `Float`
- `Rational` (planned)
- `Complex` (planned)

### Rational

Represents rational numbers (fractions). *(Planned feature)*

```trb
fraction: Rational = Rational(1, 2)  # 1/2
```

### Complex

Represents complex numbers. *(Planned feature)*

```trb
complex: Complex = Complex(1, 2)  # 1+2i
```

## Function Types

### Proc\<Args..., Return\>

Represents a proc, lambda, or block.

```trb
# Simple proc
callback: Proc<String, void> = ->(msg: String): void { puts msg }

# Proc with return value
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# Multiple parameters
adder: Proc<Integer, Integer, Integer> = ->(a: Integer, b: Integer): Integer { a + b }

# No parameters
supplier: Proc<String> = ->: String { "Hello" }
```

### Lambda

Type alias for `Proc`. In T-Ruby, lambdas and procs use the same type.

```trb {skip-verify}
type Lambda<Args..., Return> = Proc<Args..., Return>
```

### Block Parameters

```trb
# Method accepting a block
def each_item<T>(items: Array<T>, &block: Proc<T, void>): void
  items.each { |item| block.call(item) }
end

# Block with multiple parameters
def map_with_index<T, U>(
  items: Array<T>,
  &block: Proc<T, Integer, U>
): Array<U>
  items.map.with_index { |item, index| block.call(item, index) }
end
```

## Object Types

### Object

The base type for all objects.

```trb
value: Object = "string"
value: Object = 123
value: Object = User.new
```

### Class

Represents a class object.

```trb
user_class: Class = User
string_class: Class = String

# Creating instances
instance = user_class.new
```

### Module

Represents a module.

```trb
mod: Module = Enumerable
```

## IO Types

### IO

Represents input/output streams.

```trb
file: IO = File.open("data.txt", "r")
stdout: IO = $stdout

def read_file(io: IO): String
  io.read
end
```

### File

Represents file objects (subtype of IO).

```trb
file: File = File.open("data.txt", "r")

def process_file(f: File): void
  content = f.read
  puts content
end
```

## Time Types

### Time

Represents a point in time.

```trb
now: Time = Time.now
past: Time = Time.new(2020, 1, 1)

def format_time(t: Time): String
  t.strftime("%Y-%m-%d %H:%M:%S")
end
```

### Date

Represents a date (without time).

```trb
today: Date = Date.today
birthday: Date = Date.new(1990, 5, 15)
```

### DateTime

Represents a date and time with timezone.

```trb
moment: DateTime = DateTime.now
```

## Regular Expression Types

### Regexp

Represents a regular expression pattern.

```trb
pattern: Regexp = /\d+/
email_pattern: Regexp = /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i

def validate_email(email: String, pattern: Regexp): Boolean
  email.match?(pattern)
end
```

### MatchData

Represents the result of a regular expression match.

```trb
def extract_numbers(text: String): Array<String> | nil
  match: MatchData | nil = text.match(/\d+/)
  return nil if match.nil?
  match.to_a
end
```

## Error Types

### Exception

Base class for all exceptions.

```trb
def handle_error(error: Exception): String
  error.message
end
```

### StandardError

Standard error type (most commonly rescued).

```trb
def safe_divide(a: Integer, b: Integer): Float | StandardError
  begin
    a.to_f / b
  rescue => e
    e
  end
end
```

### Common Exception Types

```ruby
ArgumentError      # Invalid arguments
TypeError          # Type mismatch
NameError          # Undefined name
NoMethodError      # Method not found
RuntimeError       # Generic runtime error
IOError            # I/O operation failed
```

## Enumerator Types

### Enumerator\<T\>

Represents an enumerable object.

```trb
enum: Enumerator<Integer> = [1, 2, 3].each
range_enum: Enumerator<Integer> = (1..10).each

def process<T>(enum: Enumerator<T>): Array<T>
  enum.to_a
end
```

## Struct Types

### Struct

Represents a struct class.

```trb
Point = Struct.new(:x, :y)

point: Point = Point.new(10, 20)
```

## Thread Types

### Thread

Represents a thread of execution.

```trb
thread: Thread = Thread.new { puts "Hello from thread" }

def run_async(&block: Proc<void>): Thread
  Thread.new { block.call }
end
```

## Reference Table

| Type | Category | Description | Example |
|------|----------|-------------|---------|
| `String` | Primitive | Text data | `"hello"` |
| `Integer` | Primitive | Whole numbers | `42` |
| `Float` | Primitive | Decimals | `3.14` |
| `Boolean` | Primitive | True/false | `true` |
| `Symbol` | Primitive | Identifiers | `:active` |
| `nil` | Primitive | No value | `nil` |
| `Array<T>` | Collection | Ordered list | `[1, 2, 3]` |
| `Hash<K, V>` | Collection | Key-value pairs | `{ "a" => 1 }` |
| `Set<T>` | Collection | Unique items | `Set.new([1, 2])` |
| `Range` | Collection | Value range | `1..10` |
| `Proc<Args, R>` | Function | Callable | `->​(x) { x * 2 }` |
| `Any` | Special | Any type | Any value |
| `void` | Special | No return | Side effects only |
| `never` | Special | Never returns | Raises/loops |
| `self` | Special | Current instance | Method chaining |
| `Time` | Time | Point in time | `Time.now` |
| `Date` | Time | Calendar date | `Date.today` |
| `Regexp` | Pattern | Regex pattern | `/\d+/` |
| `IO` | I/O | Stream | `File.open(...)` |
| `Exception` | Error | Error object | `StandardError.new` |

## Type Conversions

T-Ruby provides type conversion methods on built-in types:

```ruby
# To String
"123".to_s        # "123"
123.to_s          # "123"
3.14.to_s         # "3.14"
true.to_s         # "true"
:symbol.to_s      # "symbol"

# To Integer
"123".to_i        # 123
3.14.to_i         # 3 (truncates)
true.to_i         # Error: Boolean has no to_i

# To Float
"3.14".to_f       # 3.14
123.to_f          # 123.0

# To Symbol
"name".to_sym     # :name
:name.to_sym      # :name

# To Array
(1..5).to_a       # [1, 2, 3, 4, 5]
{ a: 1 }.to_a     # [[:a, 1]]

# To Hash
[[:a, 1]].to_h    # { a: 1 }
```

## Type Checking Methods

All types support type checking methods:

```trb
value: String | Integer = get_value()

# Class checking
value.is_a?(String)    # Boolean
value.is_a?(Integer)   # Boolean
value.kind_of?(String) # Boolean (alias)

# Instance checking
value.instance_of?(String)  # Boolean (exact class)

# Nil checking
value.nil?             # Boolean

# Type methods
value.class            # Class
value.class.name       # String
```

## Best Practices

1. **Use specific types over Any** - `String | Integer` instead of `Any`
2. **Leverage generics for collections** - `Array<String>` instead of `Array`
3. **Use union types for optional values** - `String | nil` or `String?`
4. **Choose appropriate collection types** - Use `Set` for uniqueness, `Hash` for lookups
5. **Prefer `void` for side effects** - Clearly indicate functions that don't return values
6. **Use `never` for non-returning functions** - Document functions that raise or loop forever

## Next Steps

- [Type Operators](/docs/reference/type-operators) - Learn about union, intersection, and other operators
- [Standard Library Types](/docs/reference/stdlib-types) - Explore Ruby stdlib type definitions
- [Type Aliases](/docs/learn/advanced/type-aliases) - Create custom type names
- [Generics](/docs/learn/generics/generic-functions-classes) - Master generic programming
