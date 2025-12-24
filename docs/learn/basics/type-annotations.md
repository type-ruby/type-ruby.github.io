---
sidebar_position: 1
title: Type Annotations
description: Learn the basics of type annotations in T-Ruby
---

<DocsBadge />


# Type Annotations

Type annotations are the foundation of T-Ruby's type system. They allow you to explicitly declare the types of variables, method parameters, and return values. This chapter will teach you the syntax and best practices for adding type information to your Ruby code.

## What Are Type Annotations?

Type annotations are special syntax that tells T-Ruby what type of data a variable, parameter, or return value should be. They help catch bugs early by ensuring that data flows through your program in the way you expect.

In T-Ruby, type annotations use a colon (`:`) followed by the type name:

```trb title="hello.trb"
# Variable with type annotation
name: String = "Alice"

# Method parameter with type annotation
def greet(person: String)
  puts "Hello, #{person}!"
end

# Method with return type annotation
def get_age(): Integer
  25
end
```

When T-Ruby transpiles this code, the type annotations are removed, leaving pure Ruby:

```ruby title="hello.rb"
# Variable with type annotation removed
name = "Alice"

# Method parameter without type annotation
def greet(person)
  puts "Hello, #{person}!"
end

# Method without return type annotation
def get_age()
  25
end
```

## Variable Type Annotations

You can annotate variables when you declare them. The syntax is:

```trb
variable_name: Type = value
```

### Basic Examples

```trb title="variables.trb"
# String variable
message: String = "Hello, world!"

# Integer variable
count: Integer = 42

# Float variable
price: Float = 19.99

# Boolean variable
is_active: Boolean = true
```

### Why Annotate Variables?

Type annotations on variables serve several purposes:

1. **Documentation**: They make it clear what type of data a variable should hold
2. **Error Detection**: T-Ruby will catch type mismatches at transpile time
3. **IDE Support**: Editors can provide better autocomplete and hints

```trb title="error_example.trb"
# This will cause a type error
age: Integer = "twenty-five"  # Error: String assigned to Integer variable

# This is correct
age: Integer = 25
```

## Method Parameter Annotations

Method parameters should be annotated to specify what types of arguments the method accepts:

```trb title="parameters.trb"
def calculate_total(price: Float, quantity: Integer): Float
  price * quantity
end

# Calling the method
total = calculate_total(9.99, 3)  # Returns 29.97
```

### Multiple Parameters

When a method has multiple parameters, annotate each one:

```trb title="multiple_params.trb"
def create_user(name: String, age: Integer, email: String)
  {
    name: name,
    age: age,
    email: email
  }
end

user = create_user("Alice", 30, "alice@example.com")
```

### Optional Parameters with Defaults

You can combine type annotations with default values:

```trb title="defaults.trb"
def greet(name: String, greeting: String = "Hello")
  "#{greeting}, #{name}!"
end

puts greet("Alice")              # "Hello, Alice!"
puts greet("Bob", "Hi")          # "Hi, Bob!"
```

## Return Type Annotations

Return type annotations specify what type a method will return. They come after the parameter list, before the method body:

```trb title="return_types.trb"
# Returns a String
def get_name(): String
  "Alice"
end

# Returns an Integer
def get_age(): Integer
  25
end

# Returns a Boolean
def is_adult?(age: Integer): Boolean
  age >= 18
end

# Returns nil (useful for side-effect methods)
def log_message(msg: String): nil
  puts msg
  nil
end
```

### Why Return Types Matter

Return type annotations help prevent errors by ensuring methods always return the expected type:

```trb title="return_safety.trb"
def divide(a: Integer, b: Integer): Float
  return 0.0 if b == 0  # Safe default
  a.to_f / b
end

# T-Ruby knows this returns a Float
result: Float = divide(10, 3)
```

## Complete Method Example

Here's a comprehensive example showing all annotation types together:

```trb title="complete_example.trb"
# A method with parameter and return type annotations
def calculate_discount(
  original_price: Float,
  discount_percent: Integer,
  is_member: Boolean = false
): Float
  discount = original_price * (discount_percent / 100.0)

  # Members get an extra 5% off
  if is_member
    discount += original_price * 0.05
  end

  original_price - discount
end

# Using the method
regular_price: Float = calculate_discount(100.0, 10)
# Returns 90.0

member_price: Float = calculate_discount(100.0, 10, true)
# Returns 85.0
```

This transpiles to clean Ruby:

```ruby title="complete_example.rb"
def calculate_discount(
  original_price,
  discount_percent,
  is_member = false
)
  discount = original_price * (discount_percent / 100.0)

  if is_member
    discount += original_price * 0.05
  end

  original_price - discount
end

regular_price = calculate_discount(100.0, 10)
member_price = calculate_discount(100.0, 10, true)
```

## Block Parameter Annotations

You can also annotate block parameters:

```trb title="blocks.trb"
def process_numbers(numbers: Array<Integer>)
  numbers.map do |n: Integer|
    n * 2
  end
end

result = process_numbers([1, 2, 3])
# Returns [2, 4, 6]
```

## Instance Variables

Instance variables in classes can be annotated as well:

```trb title="instance_vars.trb"
class Person
  def initialize(name: String, age: Integer)
    @name: String = name
    @age: Integer = age
  end

  def introduce(): String
    "I'm #{@name} and I'm #{@age} years old"
  end
end

person = Person.new("Alice", 30)
puts person.introduce()
# Output: "I'm Alice and I'm 30 years old"
```

## Common Pitfalls

### Don't Over-Annotate

You don't need to annotate every single variable. T-Ruby has type inference (covered in the next chapter). Annotate when it adds clarity:

```trb title="over_annotation.trb"
# Too much annotation
x: Integer = 5
y: Integer = 10
sum: Integer = x + y

# Better - let inference work
x = 5
y = 10
sum: Integer = x + y  # Only annotate the result if needed
```

### Be Consistent with Return Types

If a method can return different types based on conditions, use a union type (covered later):

```trb title="inconsistent_return.trb"
# This will cause an error - inconsistent returns
def get_value(flag: Boolean): String
  if flag
    return "yes"
  else
    return 42  # Error: Integer doesn't match String return type
  end
end
```

### Remember Nil Values

If a method might return `nil`, include it in the return type:

```trb title="nil_returns.trb"
# Correct - includes nil possibility
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# This might be nil!
user = find_user(-1)
```

## Best Practices

1. **Always annotate method parameters and return types** - These are your public contracts
2. **Annotate variables when the type isn't obvious** - Help readers understand your code
3. **Use type inference for local variables** - Reduce clutter when the type is clear
4. **Be explicit in public APIs** - Library and module interfaces should be fully annotated
5. **Think of annotations as documentation** - They should make code easier to understand

## Summary

Type annotations in T-Ruby use the colon syntax to specify types:

- Variables: `name: String = "Alice"`
- Parameters: `def greet(person: String)`
- Return types: `def get_age(): Integer`
- Instance variables: `@name: String = name`

Annotations provide safety, documentation, and better tooling support, and they're completely removed during transpilation to produce clean Ruby code.

In the next chapter, you'll learn about the basic types available in T-Ruby.
