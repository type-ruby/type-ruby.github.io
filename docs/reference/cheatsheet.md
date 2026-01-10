---
sidebar_position: 1
title: Type Syntax Cheatsheet
description: Quick reference for T-Ruby type syntax
---

<DocsBadge />


# Type Syntax Cheatsheet

A comprehensive quick reference guide for T-Ruby type syntax. Bookmark this page for easy access to all type annotations and syntax patterns.

## Basic Types

| Type | Description | Example |
|------|-------------|---------|
| `String` | Text data | `name: String = "Alice"` |
| `Integer` | Whole numbers | `count: Integer = 42` |
| `Float` | Decimal numbers | `price: Float = 19.99` |
| `Boolean` | Boolean values | `active: Boolean = true` |
| `Symbol` | Immutable identifiers | `status: Symbol = :active` |
| `nil` | Absence of value | `value: nil = nil` |
| `Any` | Any type (avoid when possible) | `data: Any = "anything"` |
| `void` | No return value | `def log(msg: String): void` |

## Variable Annotations

```trb
# Variable with type annotation
name: String = "Alice"
age: Integer = 30
price: Float = 99.99

# Multiple variables
x: Integer = 1
y: Integer = 2
z: Integer = 3

# Type inference (type annotation optional)
message = "Hello"  # Inferred as String
```

## Function Signatures

```trb
# Basic function
def greet(name: String): String
  "Hello, #{name}!"
end

# Multiple parameters
def add(a: Integer, b: Integer): Integer
  a + b
end

# Optional parameters
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

# Rest parameters
def sum(*numbers: Integer[]): Integer
  numbers.sum
end

# Keyword arguments (no variable = destructured)
def create_user({ name: String, email: String, age: Integer = 18 }): Hash
  { name: name, email: email, age: age }
end

# Hash literal (with variable name)
def process(config: { host: String, port: Integer }): String
  "#{config[:host]}:#{config[:port]}"
end

# No return value
def log(message: String): void
  puts message
end
```

## Union Types

| Syntax | Description | Example |
|--------|-------------|---------|
| `A \| B` | Either type A or B | `String \| Integer` |
| `A \| B \| C` | One of multiple types | `String \| Integer \| Boolean` |
| `T \| nil` | Optional type | `String \| nil` |
| `T?` | Shorthand for `T \| nil` | `String?` |

```trb
# Union types
id: String | Integer = "user-123"
id: String | Integer = 456

# Optional values
name: String | nil = nil
name: String? = nil  # Shorthand

# Multiple types
value: String | Integer | Boolean = true

# Function with union return type
def find_user(id: Integer): User | nil
  # Returns User or nil
end
```

## Array Types

```trb
# Array of specific type (shorthand syntax)
names: String[] = ["Alice", "Bob"]
numbers: Integer[] = [1, 2, 3]

# Array of union types
mixed: (String | Integer)[] = ["Alice", 1, "Bob", 2]

# Nested arrays
matrix: Integer[][] = [[1, 2], [3, 4]]

# Empty array with type
items: String[] = []

# Nullable array vs array of nullable
nullable_array: String[]? = nil        # The array itself can be nil
array_of_nullable: String?[] = [nil]   # Elements can be nil
```

## Hash Types

```trb
# Hash with specific key and value types
scores: Hash<String, Integer> = { "Alice" => 100, "Bob" => 95 }

# Symbol keys
config: Hash<Symbol, String> = { host: "localhost", port: "3000" }

# Union value types
data: Hash<String, String | Integer> = { "name" => "Alice", "age" => 30 }

# Nested hashes
users: Hash<Integer, Hash<Symbol, String>> = {
  1 => { name: "Alice", email: "alice@example.com" }
}
```

## Generic Types

```trb
# Generic function
def first<T>(arr: T[]): T?
  arr[0]
end

# Multiple type parameters
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# Generic class
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end
end

# Using generics
box = Box<String>.new("hello")
result = first([1, 2, 3])  # Type inferred
```

## Type Aliases

```trb
# Simple alias
type UserId = Integer
type EmailAddress = String

# Union type alias
type ID = String | Integer
type JSONValue = String | Integer | Float | Boolean | nil

# Collection alias
type StringList = String[]
type UserMap = Hash<Integer, User>

# Generic alias
type Result<T> = T | nil
type Callback<T> = Proc<T, void>

# Using aliases
user_id: UserId = 123
email: EmailAddress = "alice@example.com"
```

## Class Annotations

```trb
# Instance variables
class User
  @name: String
  @age: Integer
  @email: String | nil

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
    @email = nil
  end

  def name: String
    @name
  end

  def age: Integer
    @age
  end
end

# Class variables
class Counter
  @@count: Integer = 0

  def self.increment: void
    @@count += 1
  end

  def self.count: Integer
    @@count
  end
end

# Generic class
class Container<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def value: T
    @value
  end
end
```

## Interface Definitions

```trb
# Basic interface
interface Printable
  def to_s: String
end

# Interface with multiple methods
interface Comparable
  def <=>(other: self): Integer
  def ==(other: self): Boolean
end

# Generic interface
interface Collection<T>
  def add(item: T): void
  def remove(item: T): Boolean
  def size: Integer
end

# Implementing interfaces
class User
  implements Printable

  @name: String

  def initialize(name: String): void
    @name = name
  end

  def to_s: String
    "User: #{@name}"
  end
end
```

## Type Operators

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| `\|` | Union | Either/or types | `String \| Integer` |
| `&` | Intersection | Both types | `Printable & Comparable` |
| `?` | Optional | Shorthand for `\| nil` | `String?` |
| `[]` | Array | Array shorthand | `String[]` |
| `<T>` | Generic | Type parameter | `Array<T>` |
| `=>` | Hash pair | Key-value type | `Hash<String => Integer>` |

```trb
# Union (OR)
value: String | Integer

# Intersection (AND)
class Person
  implements Printable & Comparable
end

# Optional
name: String?  # Same as String | nil

# Array shorthand
items: String[]
nested: Integer[][]

# Generics (alternative)
items: Array<String>
pairs: Hash<String, Integer>
```

## Blocks, Procs, and Lambdas

```trb
# Block parameter
def each_item<T>(items: T[], &block: Proc<T, void>): void
  items.each { |item| block.call(item) }
end

# Proc types
callback: Proc<String, void> = ->(msg: String): void { puts msg }
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# Lambda with types
double: Proc<Integer, Integer> = ->(n: Integer): Integer { n * 2 }

# Block with multiple parameters
def map<T, U>(items: T[], &block: Proc<T, Integer, U>): U[]
  items.map.with_index { |item, index| block.call(item, index) }
end
```

## Type Narrowing

```trb
# Type checking with is_a?
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase  # T-Ruby knows value is String
  else
    value.to_s    # T-Ruby knows value is Integer
  end
end

# Nil checking
def get_length(text: String | nil): Integer
  if text.nil?
    0
  else
    text.length  # T-Ruby knows text is String
  end
end

# Multiple checks
def describe(value: String | Integer | Boolean): String
  if value.is_a?(String)
    "String: #{value}"
  elsif value.is_a?(Integer)
    "Number: #{value}"
  else
    "Boolean: #{value}"
  end
end
```

## Literal Types

```trb
# String literals
type Status = "pending" | "active" | "completed"
status: Status = "active"

# Number literals
type Port = 80 | 443 | 8080
port: Port = 443

# Symbol literals
type Role = :admin | :editor | :viewer
role: Role = :admin

# Boolean literals
type Yes = true
type No = false
```

## Advanced Types

```trb
# Intersection types
type Serializable = Printable & Comparable
obj: Serializable  # Must implement both interfaces

# Conditional types (planned)
type NonNullable<T> = T extends nil ? never : T

# Mapped types (planned)
type Readonly<T> = { readonly [K in keyof T]: T[K] }

# Utility types
type Partial<T>    # All properties optional
type Required<T>   # All properties required
type Pick<T, K>    # Select properties
type Omit<T, K>    # Remove properties
```

## Type Assertions

```trb
# Type casting (use with caution)
value = get_value() as String
number = parse("42") as Integer

# Safe type conversion
def to_integer(value: String | Integer): Integer
  if value.is_a?(Integer)
    value
  else
    value.to_i
  end
end
```

## Module Type Annotations

```trb
module Formatter
  # Module method with types
  def self.format(value: String, width: Integer): String
    value.ljust(width)
  end

  # Module constants with types
  DEFAULT_WIDTH: Integer = 80
  DEFAULT_CHAR: String = " "
end

# Mixin module
module Timestamped
  @created_at: Integer
  @updated_at: Integer

  def timestamp: Integer
    @created_at
  end
end
```

## Common Patterns

### Optional Parameters with Defaults

```trb
def create_user(
  name: String,
  email: String,
  age: Integer = 18,
  active: Boolean = true
): User
  User.new(name, email, age, active)
end
```

### Result Type Pattern

```trb
type Result<T, E> = { success: Boolean, value: T | nil, error: E | nil }

def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, value: nil, error: "Division by zero" }
  else
    { success: true, value: a / b, error: nil }
  end
end
```

### Builder Pattern

```trb
class QueryBuilder
  @conditions: String[]

  def initialize: void
    @conditions = []
  end

  def where(condition: String): self
    @conditions << condition
    self
  end

  def build: String
    @conditions.join(" AND ")
  end
end
```

### Type Guards

```trb
def is_string(value: Any): value is String
  value.is_a?(String)
end

def is_user(value: Any): value is User
  value.is_a?(User)
end

# Usage
value = get_value()
if is_string(value)
  puts value.upcase  # value is String here
end
```

## Quick Tips

1. **Use type inference** - Don't annotate everything, let T-Ruby infer simple types
2. **Prefer union types over Any** - `String | Integer` is better than `Any`
3. **Use type aliases** - Make complex types readable with aliases
4. **Check types before use** - Use `is_a?` and `nil?` for union types
5. **Leverage generics** - Write reusable, type-safe code
6. **Start gradually** - You don't need to type everything at once
7. **Use `void` for side effects** - Methods that don't return meaningful values
8. **Avoid over-typing** - If the type is obvious, let T-Ruby infer it

## Common Type Errors

```trb
# ❌ Wrong: Assigning wrong type
name: String = 123  # Error: Integer is not String

# ✅ Correct: Use union type
id: String | Integer = 123

# ❌ Wrong: Accessing property without type check
def get_length(value: String | nil): Integer
  value.length  # Error: value might be nil
end

# ✅ Correct: Check for nil first
def get_length(value: String | nil): Integer
  if value.nil?
    0
  else
    value.length
  end
end

# ❌ Wrong: Generic without type parameter
box = Box.new("hello")  # Error if type can't be inferred

# ✅ Correct: Specify type parameter
box = Box<String>.new("hello")
```

## File Extensions and Compilation

```bash
# T-Ruby source files
hello.trb

# Compile to Ruby
trc hello.trb
# Generates: hello.rb

# Generate RBS types
trc --rbs hello.trb
# Generates: hello.rbs

# Watch mode
trc --watch *.trb

# Type check only (no output)
trc --check hello.trb
```

## Further Reading

- [Built-in Types](/docs/reference/built-in-types) - Complete list of built-in types
- [Type Operators](/docs/reference/type-operators) - Detailed operator reference
- [Standard Library Types](/docs/reference/stdlib-types) - Ruby stdlib type definitions
- [Type Aliases](/docs/learn/advanced/type-aliases) - Advanced aliasing techniques
- [Generics](/docs/learn/generics/generic-functions-classes) - Generic programming guide
