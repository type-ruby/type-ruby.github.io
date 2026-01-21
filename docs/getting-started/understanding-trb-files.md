---
sidebar_position: 3
title: Understanding .trb Files
description: Learn how T-Ruby files work
---

<DocsBadge />


# Understanding .trb Files

This guide takes you through creating a T-Ruby file step by step, explaining each concept as we go.

## Understanding .trb Files

A `.trb` file is a T-Ruby source file. It's essentially Ruby code with type annotations. The T-Ruby compiler (`trc`) reads `.trb` files and produces:

1. **`.rb` files** - Standard Ruby code with types removed
2. **`.rbs` files** - Type signature files for tooling

## Creating the File

Let's create a file called `calculator.trb` that implements a simple calculator:

```trb title="calculator.trb"
# calculator.trb - A simple typed calculator

# Basic arithmetic operations with type annotations
def add(a: Integer, b: Integer): Integer
  a + b
end

def subtract(a: Integer, b: Integer): Integer
  a - b
end

def multiply(a: Integer, b: Integer): Integer
  a * b
end

def divide(a: Integer, b: Integer): Float
  a.to_f / b
end
```

### Anatomy of a Typed Function

Let's break down the syntax:

```trb
def add(a: Integer, b: Integer): Integer
#   ^^^  ^  ^^^^^^^  ^  ^^^^^^^   ^^^^^^^
#   |    |    |      |    |         |
#   |    |    |      |    |         └── Return type
#   |    |    |      |    └── Second parameter type
#   |    |    |      └── Second parameter name
#   |    |    └── First parameter type
#   |    └── First parameter name
#   └── Function name
```

## Adding More Features

Let's expand our calculator with more advanced features:

```trb title="calculator.trb"
# Type alias for cleaner code
type Number = Integer | Float

# Now our functions can accept both Integer and Float
def add(a: Number, b: Number): Number
  a + b
end

def subtract(a: Number, b: Number): Number
  a - b
end

def multiply(a: Number, b: Number): Number
  a * b
end

def divide(a: Number, b: Number): Float
  a.to_f / b.to_f
end

# A function that might fail - returns nil on error
def safe_divide(a: Number, b: Number): Float | nil
  return nil if b == 0
  a.to_f / b.to_f
end

# Using a generic type for a utility function
def max<T: Comparable>(a: T, b: T): T
  a > b ? a : b
end
```

### Understanding Union Types

The `|` operator creates a union type:

```trb
type Number = Integer | Float  # Can be Integer OR Float

def safe_divide(a: Number, b: Number): Float | nil
  # Return type can be Float OR nil
  return nil if b == 0
  a.to_f / b.to_f
end
```

### Understanding Generics

The `<T>` syntax defines a generic type parameter:

```trb
def max<T: Comparable>(a: T, b: T): T
#     ^^  ^^^^^^^^^^
#     |       |
#     |       └── Constraint: T must implement Comparable
#     └── Generic type parameter

# This works with any comparable type:
max(5, 3)       # T is Integer
max(5.5, 3.2)   # T is Float
max("a", "b")   # T is String
```

## Adding a Class

Let's create a Calculator class:

```trb title="calculator.trb"
class Calculator
  # Instance variable with type annotation
  @history: String[]

  def initialize: void
    @history = []
  end

  def add(a: Number, b: Number): Number
    result = a + b
    record_operation("#{a} + #{b} = #{result}")
    result
  end

  def subtract(a: Number, b: Number): Number
    result = a - b
    record_operation("#{a} - #{b} = #{result}")
    result
  end

  def multiply(a: Number, b: Number): Number
    result = a * b
    record_operation("#{a} * #{b} = #{result}")
    result
  end

  def divide(a: Number, b: Number): Float | nil
    if b == 0
      record_operation("#{a} / #{b} = ERROR (division by zero)")
      return nil
    end
    result = a.to_f / b.to_f
    record_operation("#{a} / #{b} = #{result}")
    result
  end

  def history: String[]
    @history.dup
  end

  private

  def record_operation(operation: String): void
    @history << operation
  end
end

# Using the class
calc = Calculator.new
puts calc.add(10, 5)      # 15
puts calc.multiply(3, 4)  # 12
puts calc.divide(10, 3)   # 3.333...
puts calc.divide(10, 0)   # nil

puts "\nHistory:"
calc.history.each { |op| puts "  #{op}" }
```

## Compiling and Running

```bash
# Compile
trc calculator.trb

# Run
ruby build/calculator.rb
```

Expected output:
```
15
12
3.3333333333333335

History:
  10 + 5 = 15
  3 * 4 = 12
  10 / 3 = 3.3333333333333335
```

## Examining the Output

Look at the generated files:

```ruby title="build/calculator.rb"
class Calculator
  def initialize
    @history = []
  end

  def add(a, b)
    result = a + b
    record_operation("#{a} + #{b} = #{result}")
    result
  end

  # ... types are completely removed
end
```

```rbs title="build/calculator.rbs"
type Number = Integer | Float

class Calculator
  @history: Array[String]

  def initialize: () -> void
  def add: (Number a, Number b) -> Number
  def subtract: (Number a, Number b) -> Number
  def multiply: (Number a, Number b) -> Number
  def divide: (Number a, Number b) -> Float?
  def history: () -> Array[String]
  private def record_operation: (String operation) -> void
end
```

## Common Patterns

### Optional Parameters

```trb
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

greet("Alice")           # "Hello, Alice!"
greet("Alice", "Hi")     # "Hi, Alice!"
```

### Nullable Types (Optional Shorthand)

```trb
# These are equivalent:
def find(id: Integer): User | nil
def find(id: Integer): User?  # Shorthand
```

### Block Parameters

```rbs
def each_item(items: String[], &block: (String) -> void): void
  items.each(&block)
end

each_item(["a", "b", "c"]) { |item| puts item }
```

## Error Messages

T-Ruby provides helpful error messages. Here are some you might encounter:

### Type Mismatch
```
Error: calculator.trb:5:10
  Type mismatch: expected Integer, got String

    add("hello", 5)
        ^^^^^^^
```

### Missing Type Annotation
```
Warning: calculator.trb:3:5
  Parameter 'x' has no type annotation

    def process(x)
                ^
```

### Unknown Type
```
Error: calculator.trb:2:15
  Unknown type 'Stringg' (did you mean 'String'?)

    def greet(name: Stringg): String
                    ^^^^^^^
```

## Best Practices

1. **Start with public APIs** - Type your public methods first
2. **Use type aliases** - Make complex types readable
3. **Prefer specific types** - `String[]` over `Array`
4. **Document with types** - Types serve as documentation

## Next Steps

Now that you understand `.trb` files, continue with:

- [Editor Setup](/docs/getting-started/editor-setup) - Get IDE support
- [Project Configuration](/docs/getting-started/project-configuration) - Configure larger projects
- [Basic Types](/docs/learn/basics/basic-types) - Deep dive into the type system
