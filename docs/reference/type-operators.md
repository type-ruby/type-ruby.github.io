---
sidebar_position: 3
title: Type Operators
description: Type operators and modifiers
---

<DocsBadge />


# Type Operators

Type operators allow you to combine, modify, and transform types in T-Ruby. This reference covers all available type operators and their usage patterns.

## Union Operator (`|`)

The union operator combines multiple types into one, indicating a value can be any of the specified types.

### Syntax

```ruby
Type1 | Type2 | Type3
```

### Examples

```trb
# Basic union
id: String | Integer = "user-123"
id: String | Integer = 456

# Multiple types
value: String | Integer | Float | Boolean = 3.14

# With nil (optional type)
name: String | nil = nil
user: User | nil = find_user(123)

# In collections
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]
config: Hash<Symbol, String | Integer | Boolean> = {
  host: "localhost",
  port: 3000,
  debug: true
}
```

### Usage Patterns

```trb
# Function return types
def find_user(id: Integer): User | nil
  # Returns User or nil
end

# Function parameters
def format_id(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    "ID-#{value}"
  end
end

# Error handling
def divide(a: Float, b: Float): Float | String
  return "Error: Division by zero" if b == 0
  a / b
end
```

### Type Narrowing

Use type guards to narrow union types:

```trb
def process(value: String | Integer): String
  if value.is_a?(String)
    # T-Ruby knows value is String here
    value.upcase
  else
    # T-Ruby knows value is Integer here
    value.to_s
  end
end
```

## Optional Operator (`?`)

Shorthand for union with `nil`. `T?` is equivalent to `T | nil`.

### Syntax

```trb
Type?
# Equivalent to: Type | nil
```

### Examples

```trb
# These are equivalent
name1: String | nil = nil
name2: String? = nil

# Optional parameters
def greet(name: String?): String
  if name
    "Hello, #{name}!"
  else
    "Hello, stranger!"
  end
end

# Optional instance variables
class User
  @email: String?
  @phone: String | nil

  def initialize: void
    @email = nil
    @phone = nil
  end
end

# In collections
users: Array<User?> = [User.new, nil, User.new]
cache: Hash<String, Integer?> = { "count" => 42, "missing" => nil }
```

### Safe Navigation

Use the safe navigation operator (`&.`) with optional types:

```trb
def get_email_domain(user: User?): String?
  user&.email&.split("@")&.last
end
```

## Intersection Operator (`&`)

The intersection operator combines multiple types, requiring a value to satisfy all types simultaneously.

### Syntax

```ruby
Type1 & Type2 & Type3
```

### Examples

```trb
# Interface intersection
interface Printable
  def to_s: String
end

interface Comparable
  def <=>(other: self): Integer
end

# Type must implement both interfaces
type Serializable = Printable & Comparable

class User
  implements Printable & Comparable

  @name: String
  @id: Integer

  def initialize(name: String, id: Integer): void
    @name = name
    @id = id
  end

  def to_s: String
    "User(#{@id}: #{@name})"
  end

  def <=>(other: User): Integer
    @id <=> other.id
  end
end

# Function accepting intersection type
def serialize(obj: Printable & Comparable): String
  obj.to_s
end
```

### Multiple Constraints

```trb
# Generic with multiple constraints
def sort_and_print<T>(items: Array<T>): void
  where T: Printable & Comparable

  sorted = items.sort
  sorted.each { |item| puts item.to_s }
end
```

## Generic Type Parameters (`<T>`)

Angle brackets denote generic type parameters.

### Function Generics

```trb
# Single type parameter
def first<T>(arr: Array<T>): T | nil
  arr[0]
end

# Multiple type parameters
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# Generic with constraints
def find<T>(items: Array<T>, predicate: Proc<T, Boolean>): T | nil
  items.find { |item| predicate.call(item) }
end
```

### Class Generics

```trb
# Generic class
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

# Multiple type parameters
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
end
```

### Nested Generics

```trb
# Nested generic types
cache: Hash<String, Array<Integer>> = {
  "fibonacci" => [1, 1, 2, 3, 5, 8]
}

# Complex nesting
type NestedData = Hash<String, Array<Hash<Symbol, String | Integer>>>

data: NestedData = {
  "users" => [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
  ]
}
```

## Array Type Operator

Array types use angle bracket notation with a single type parameter.

### Syntax

```trb
Array<ElementType>
```

### Examples

```trb
# Basic arrays
strings: Array<String> = ["a", "b", "c"]
numbers: Array<Integer> = [1, 2, 3]

# Union element types
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]

# Nested arrays
matrix: Array<Array<Float>> = [
  [1.0, 2.0],
  [3.0, 4.0]
]

# Generic function returning array
def range<T>(start: T, count: Integer, &block: Proc<T, T>): Array<T>
  result: Array<T> = [start]
  current = start

  (count - 1).times do
    current = block.call(current)
    result.push(current)
  end

  result
end
```

## Hash Type Operator

Hash types use angle brackets with two type parameters: key and value types.

### Syntax

```trb
Hash<KeyType, ValueType>
```

### Examples

```trb
# Basic hashes
scores: Hash<String, Integer> = { "Alice" => 100 }
config: Hash<Symbol, String> = { host: "localhost" }

# Union value types
data: Hash<String, String | Integer | Boolean> = {
  "name" => "Alice",
  "age" => 30,
  "active" => true
}

# Nested hashes
users: Hash<Integer, Hash<Symbol, String>> = {
  1 => { name: "Alice", email: "alice@example.com" }
}

# Generic hash function
def group_by<T, K>(items: Array<T>, &block: Proc<T, K>): Hash<K, Array<T>>
  result: Hash<K, Array<T>> = {}

  items.each do |item|
    key = block.call(item)
    result[key] ||= []
    result[key].push(item)
  end

  result
end
```

## Proc Type Operator

Proc types specify callable objects with typed parameters and return values.

### Syntax

```trb {skip-verify}
Proc<Param1Type, Param2Type, ..., ReturnType>
```

### Examples

```trb
# No parameters
supplier: Proc<String> = ->: String { "Hello" }

# Single parameter
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# Multiple parameters
adder: Proc<Integer, Integer, Integer> = ->(a: Integer, b: Integer): Integer {
  a + b
}

# Void return
logger: Proc<String, void> = ->(msg: String): void { puts msg }

# Generic proc parameter
def map<T, U>(arr: Array<T>, fn: Proc<T, U>): Array<U>
  arr.map { |item| fn.call(item) }
end

# Block parameter
def each_with_index<T>(items: Array<T>, &block: Proc<T, Integer, void>): void
  items.each_with_index { |item, index| block.call(item, index) }
end
```

## Type Assertion Operator (`as`)

Type assertions override type checking. Use with caution.

### Syntax

```ruby
value as TargetType
```

### Examples

```trb
# Asserting type
value = get_unknown_value() as String

# Casting from Any
data: Any = fetch_data()
user = data as User

# Narrowing union types
def process(value: String | Integer): String
  if is_string?(value)
    # Without assertion, T-Ruby may not narrow
    str = value as String
    str.upcase
  else
    value.to_s
  end
end
```

### Warning

Type assertions bypass type safety. Prefer type guards:

```trb
# ❌ Risky: Using type assertion
def bad_example(value: Any): String
  (value as String).upcase
end

# ✅ Better: Using type guard
def good_example(value: Any): String | nil
  if value.is_a?(String)
    value.upcase
  else
    nil
  end
end
```

## Type Guard Operator (`is`)

Type guards are predicates that narrow types. *(Experimental feature)*

### Syntax

```trb
def function_name(param: Type): param is NarrowedType
  # Type checking logic
end
```

### Examples

```trb
# String guard
def is_string(value: Any): value is String
  value.is_a?(String)
end

# Number guard
def is_number(value: Any): value is Integer | Float
  value.is_a?(Integer) || value.is_a?(Float)
end

# Usage
value = get_value()
if is_string(value)
  # value is String here
  puts value.upcase
end

# Custom type guard
def is_user(value: Any): value is User
  value.is_a?(User) && value.respond_to?(:name)
end
```

## Literal Type Operators

Literal types represent specific values rather than general types.

### String Literals

```trb
type Status = "pending" | "active" | "completed" | "failed"

status: Status = "active"  # OK
# status: Status = "unknown"  # Error

def set_status(s: Status): void
  # Only accepts the four specific strings
end
```

### Number Literals

```trb
type HTTPPort = 80 | 443 | 8080 | 3000

port: HTTPPort = 443  # OK
# port: HTTPPort = 9999  # Error

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6
```

### Symbol Literals

```trb
type Role = :admin | :editor | :viewer

role: Role = :admin  # OK
# role: Role = :guest  # Error

type HTTPMethod = :get | :post | :put | :patch | :delete
```

### Boolean Literals

```trb
type AlwaysTrue = true
type AlwaysFalse = false

flag: AlwaysTrue = true
# flag: AlwaysTrue = false  # Error
```

## Tuple Types *(Planned)*

Fixed-length arrays with specific types per position.

```trb
# Tuple type (planned)
type Point = [Float, Float]
type RGB = [Integer, Integer, Integer]

point: Point = [10.5, 20.3]
color: RGB = [255, 0, 128]

# Tuple with labels (planned)
type Person = [name: String, age: Integer]
person: Person = ["Alice", 30]
```

## Readonly Modifier *(Planned)*

Makes types immutable.

```trb
# Readonly type (planned)
type ReadonlyArray<T> = readonly Array<T>
type ReadonlyHash<K, V> = readonly Hash<K, V>

# Cannot modify
nums: ReadonlyArray<Integer> = [1, 2, 3]
# nums.push(4)  # Error: Cannot modify readonly array
```

## Keyof Operator *(Planned)*

Extracts keys from object types.

```trb
# Keyof operator (planned)
interface User
  @name: String
  @email: String
  @age: Integer
end

type UserKey = keyof User  # :name | :email | :age
```

## Typeof Operator *(Planned)*

Gets the type of a value.

```trb
# Typeof operator (planned)
config = { host: "localhost", port: 3000 }
type Config = typeof config
# Config = Hash<Symbol, String | Integer>
```

## Operator Precedence

When combining operators, T-Ruby follows this precedence (highest to lowest):

1. Generic parameters: `<T>`
2. Array/Hash/Proc: `Array<T>`, `Hash<K,V>`, `Proc<T,R>`
3. Intersection: `&`
4. Union: `|`
5. Optional: `?`

### Examples

```trb
# Intersection has higher precedence than union
type A = String | Integer & Float
# Equivalent to: String | (Integer & Float)

# Use parentheses for clarity
type B = (String | Integer) & Comparable

# Optional applies to entire type on left
type C = String | Integer?
# Equivalent to: String | (Integer | nil)

# Use parentheses to make Integer optional only
type D = String | (Integer?)
```

## Operator Reference Table

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| `\|` | Union | Either/or types | `String \| Integer` |
| `&` | Intersection | Both types | `Printable & Comparable` |
| `?` | Optional | Type or nil | `String?` |
| `<T>` | Generic | Type parameter | `Array<T>` |
| `as` | Type assertion | Force type | `value as String` |
| `is` | Type guard | Type predicate | `value is String` |
| `[]` | Tuple | Fixed array | `[String, Integer]` (planned) |
| `readonly` | Readonly | Immutable | `readonly Array<T>` (planned) |
| `keyof` | Key extraction | Object keys | `keyof User` (planned) |
| `typeof` | Type query | Get type | `typeof value` (planned) |

## Best Practices

### 1. Prefer Union Over Any

```trb
# ❌ Too permissive
data: Any = get_data()

# ✅ Specific types
data: String | Integer | Hash<String, String> = get_data()
```

### 2. Use Optional Operator for Clarity

```trb
# ❌ Verbose
name: String | nil = nil

# ✅ Concise
name: String? = nil
```

### 3. Limit Union Complexity

```trb
# ❌ Too many options
value: String | Integer | Float | Boolean | Symbol | nil | Array<String>

# ✅ Use type alias
type PrimitiveValue = String | Integer | Float | Boolean
type OptionalPrimitive = PrimitiveValue?
```

### 4. Use Intersection for Multiple Interfaces

```trb
# ✅ Clear requirements
def process<T>(item: T): void
  where T: Serializable & Comparable
  # Item must implement both
end
```

### 5. Avoid Excessive Type Assertions

```trb
# ❌ Bypassing type safety
def risky(data: Any): String
  (data as Hash<String, String>)["key"] as String
end

# ✅ Use type guards
def safe(data: Any): String?
  return nil unless data.is_a?(Hash)
  value = data["key"]
  value.is_a?(String) ? value : nil
end
```

## Common Patterns

### Result Type with Union

```trb
type Result<T, E> = { success: true, value: T } | { success: false, error: E }

def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, error: "Division by zero" }
  else
    { success: true, value: a / b }
  end
end
```

### Optional Chaining

```trb
class User
  @profile: Profile?

  def avatar_url: String?
    @profile&.avatar&.url
  end
end
```

### Type Narrowing with Guards

```trb
def process_value(value: String | Integer | nil): String
  if value.nil?
    "No value"
  elsif value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end
```

## Next Steps

- [Built-in Types](/docs/reference/built-in-types) - Complete type reference
- [Type Aliases](/docs/learn/advanced/type-aliases) - Creating custom types
- [Generics](/docs/learn/generics/generic-functions-classes) - Generic programming
- [Union Types](/docs/learn/everyday-types/union-types) - Detailed union type guide
