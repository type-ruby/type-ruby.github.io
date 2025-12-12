---
sidebar_position: 2
title: Basic Types
description: String, Integer, Float, Boolean, Symbol, and nil
---

<DocsBadge />


# Basic Types

T-Ruby provides a set of basic types that correspond to Ruby's fundamental data types. Understanding these types is essential for writing type-safe T-Ruby code. In this chapter, we'll explore each basic type in detail with practical examples.

## Overview of Basic Types

T-Ruby includes the following basic types:

- `String` - Text data
- `Integer` - Whole numbers
- `Float` - Decimal numbers
- `Bool` - True or false values
- `Symbol` - Immutable identifiers
- `nil` - The absence of a value

Let's explore each one in detail.

## String

The `String` type represents text data. Strings are sequences of characters enclosed in quotes.

### Basic String Usage

```trb title="strings.trb"
# String variable
name: String = "Alice"
greeting: String = 'Hello, world!'

# Multi-line string
description: String = <<~TEXT
  This is a multi-line
  string in T-Ruby.
TEXT

# String interpolation
age = 30
message: String = "#{name} is #{age} years old"
# message is "Alice is 30 years old"
```

### String Methods

Strings in T-Ruby have all the standard Ruby methods. The type checker understands these methods:

```trb title="string_methods.trb"
def format_name(name: String): String
  name.strip.downcase.capitalize
end

result: String = format_name("  ALICE  ")
# Returns "Alice"

def get_initials(first: String, last: String): String
  "#{first[0]}.#{last[0]}."
end

initials: String = get_initials("Alice", "Smith")
# Returns "A.S."
```

### String Concatenation

```trb title="string_concat.trb"
def build_url(protocol: String, domain: String, path: String): String
  protocol + "://" + domain + path
end

url: String = build_url("https", "example.com", "/api/users")
# Returns "https://example.com/api/users"

# Alternative using interpolation
def build_url_v2(protocol: String, domain: String, path: String): String
  "#{protocol}://#{domain}#{path}"
end
```

## Integer

The `Integer` type represents whole numbers, both positive and negative.

### Basic Integer Usage

```trb title="integers.trb"
# Integer variables
count: Integer = 42
negative: Integer = -10
zero: Integer = 0

# Large integers
population: Integer = 7_900_000_000  # Underscores for readability
```

### Integer Arithmetic

```trb title="integer_math.trb"
def calculate_total(price: Integer, quantity: Integer): Integer
  price * quantity
end

total: Integer = calculate_total(15, 4)
# Returns 60

def next_even_number(n: Integer): Integer
  n + (n % 2)
end

result: Integer = next_even_number(7)
# Returns 8
```

### Integer Methods

```trb title="integer_methods.trb"
def absolute_value(n: Integer): Integer
  n.abs
end

abs_value: Integer = absolute_value(-42)
# Returns 42

def is_even(n: Integer): Bool
  n.even?
end

check: Bool = is_even(10)
# Returns true
```

### Integer Division

Note that integer division in Ruby truncates the result:

```trb title="integer_division.trb"
def divide_integers(a: Integer, b: Integer): Integer
  a / b
end

result: Integer = divide_integers(7, 2)
# Returns 3 (not 3.5)

# For decimal division, convert to Float
def divide_as_float(a: Integer, b: Integer): Float
  a.to_f / b
end

decimal_result: Float = divide_as_float(7, 2)
# Returns 3.5
```

## Float

The `Float` type represents decimal numbers (floating-point numbers).

### Basic Float Usage

```trb title="floats.trb"
# Float variables
price: Float = 19.99
temperature: Float = -3.5
pi: Float = 3.14159

# Scientific notation
speed_of_light: Float = 2.998e8  # 299,800,000
```

### Float Arithmetic

```trb title="float_math.trb"
def calculate_average(values: Array<Float>): Float
  sum = 0.0
  values.each do |v|
    sum += v
  end
  sum / values.length
end

avg: Float = calculate_average([10.5, 20.3, 15.7])
# Returns 15.5

def calculate_interest(principal: Float, rate: Float, years: Integer): Float
  principal * (1 + rate) ** years
end

amount: Float = calculate_interest(1000.0, 0.05, 5)
# Returns approximately 1276.28
```

### Rounding and Precision

```trb title="float_rounding.trb"
def round_to_cents(amount: Float): Float
  (amount * 100).round / 100.0
end

price: Float = round_to_cents(19.996)
# Returns 20.0

def format_currency(amount: Float): String
  "$%.2f" % amount
end

formatted: String = format_currency(19.99)
# Returns "$19.99"
```

### Float vs Integer

When mixing integers and floats, the result is typically a float:

```trb title="mixed_math.trb"
# Integer + Float = Float
def add_numbers(a: Integer, b: Float): Float
  a + b
end

sum: Float = add_numbers(5, 2.5)
# Returns 7.5
```

## Bool

The `Bool` type represents boolean values: `true` or `false`. Note that T-Ruby uses `Bool` (not `Boolean`) as the type name.

### Basic Boolean Usage

```trb title="booleans.trb"
# Boolean variables
is_active: Bool = true
has_permission: Bool = false

# Boolean from comparison
is_adult: Bool = age >= 18
is_valid: Bool = count > 0
```

### Boolean Logic

```trb title="boolean_logic.trb"
def can_access(is_logged_in: Bool, has_permission: Bool): Bool
  is_logged_in && has_permission
end

access: Bool = can_access(true, true)
# Returns true

def should_notify(is_important: Bool, is_urgent: Bool): Bool
  is_important || is_urgent
end

notify: Bool = should_notify(false, true)
# Returns true

def toggle(flag: Bool): Bool
  !flag
end

flipped: Bool = toggle(true)
# Returns false
```

### Booleans in Conditionals

```trb title="boolean_conditionals.trb"
def get_status(is_complete: Bool): String
  if is_complete
    "Done"
  else
    "Pending"
  end
end

status: String = get_status(true)
# Returns "Done"

def check_eligibility(age: Integer, has_license: Bool): String
  can_drive: Bool = age >= 16 && has_license

  if can_drive
    "Eligible to drive"
  else
    "Not eligible"
  end
end
```

### Truthiness vs Bool

In Ruby, many values are "truthy" or "falsy", but the `Bool` type only accepts `true` or `false`:

```trb title="bool_strict.trb"
# This is correct
flag: Bool = true

# These would be errors:
# flag: Bool = 1        # Error: Integer is not Bool
# flag: Bool = "yes"    # Error: String is not Bool
# flag: Bool = nil      # Error: nil is not Bool

# To convert truthy values to Bool:
def to_bool(value: String | nil): Bool
  !value.nil? && !value.empty?
end
```

## Symbol

The `Symbol` type represents immutable identifiers. Symbols are often used as keys in hashes or as constants.

### Basic Symbol Usage

```trb title="symbols.trb"
# Symbol variables
status: Symbol = :active
direction: Symbol = :north

# Symbols are often used in hashes
def create_options(mode: Symbol): Hash<Symbol, String>
  {
    mode: mode.to_s,
    version: "1.0"
  }
end

options = create_options(:production)
```

### Symbols vs Strings

Symbols are similar to strings but are immutable and optimized for use as identifiers:

```trb title="symbol_vs_string.trb"
# Same symbol is always the same object in memory
def are_same_symbol(a: Symbol, b: Symbol): Bool
  a.object_id == b.object_id
end

same: Bool = are_same_symbol(:active, :active)
# Returns true

# Converting between Symbol and String
def symbol_to_string(sym: Symbol): String
  sym.to_s
end

def string_to_symbol(str: String): Symbol
  str.to_sym
end

text: String = symbol_to_string(:hello)
# Returns "hello"

symbol: Symbol = string_to_symbol("world")
# Returns :world
```

### Symbols in Hash Keys

Symbols are commonly used as hash keys:

```trb title="symbol_keys.trb"
def create_user(name: String, role: Symbol): Hash<Symbol, String | Symbol>
  {
    name: name,
    role: role,
    status: :active
  }
end

user = create_user("Alice", :admin)
# Returns { name: "Alice", role: :admin, status: :active }
```

## nil

The `nil` type represents the absence of a value. In T-Ruby, `nil` is its own type.

### Basic nil Usage

```trb title="nil_basics.trb"
# nil variable (not very useful by itself)
nothing: nil = nil

# nil is more commonly used with union types
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

user = find_user(-1)
# Returns nil
```

### Checking for nil

```trb title="nil_checks.trb"
def greet(name: String | nil): String
  if name.nil?
    "Hello, stranger!"
  else
    "Hello, #{name}!"
  end
end

message1: String = greet("Alice")
# Returns "Hello, Alice!"

message2: String = greet(nil)
# Returns "Hello, stranger!"
```

### The Safe Navigation Operator

Ruby's safe navigation operator (`&.`) works with nil:

```trb title="safe_navigation.trb"
def get_name_length(name: String | nil): Integer | nil
  name&.length
end

len1 = get_name_length("Alice")
# Returns 5

len2 = get_name_length(nil)
# Returns nil
```

### Default Values with nil

```trb title="nil_defaults.trb"
def get_greeting(custom: String | nil): String
  custom || "Hello!"
end

greeting1: String = get_greeting("Welcome!")
# Returns "Welcome!"

greeting2: String = get_greeting(nil)
# Returns "Hello!"
```

## Type Conversions

Often you need to convert between basic types:

### Converting to String

```trb title="to_string.trb"
def describe_number(num: Integer): String
  num.to_s
end

def describe_float(num: Float): String
  num.to_s
end

def describe_bool(flag: Bool): String
  flag.to_s
end

text1: String = describe_number(42)
# Returns "42"

text2: String = describe_float(3.14)
# Returns "3.14"

text3: String = describe_bool(true)
# Returns "true"
```

### Converting to Integer

```trb title="to_integer.trb"
def parse_integer(text: String): Integer
  text.to_i
end

num1: Integer = parse_integer("42")
# Returns 42

num2: Integer = parse_integer("not a number")
# Returns 0 (Ruby's default behavior)

def float_to_int(f: Float): Integer
  f.to_i
end

truncated: Integer = float_to_int(3.7)
# Returns 3 (truncates, doesn't round)
```

### Converting to Float

```trb title="to_float.trb"
def parse_float(text: String): Float
  text.to_f
end

num: Float = parse_float("3.14")
# Returns 3.14

def int_to_float(i: Integer): Float
  i.to_f
end

decimal: Float = int_to_float(42)
# Returns 42.0
```

## Practical Example: Temperature Converter

Here's a complete example using multiple basic types:

```trb title="temperature.trb"
def celsius_to_fahrenheit(celsius: Float): Float
  (celsius * 9.0 / 5.0) + 32.0
end

def fahrenheit_to_celsius(fahrenheit: Float): Float
  (fahrenheit - 32.0) * 5.0 / 9.0
end

def format_temperature(temp: Float, unit: Symbol): String
  rounded: Float = temp.round(1)
  unit_str: String = unit.to_s.upcase

  "#{rounded}°#{unit_str}"
end

def convert_temperature(temp: Float, from: Symbol, to: Symbol): String
  converted: Float

  if from == :c && to == :f
    converted = celsius_to_fahrenheit(temp)
  elsif from == :f && to == :c
    converted = fahrenheit_to_celsius(temp)
  else
    converted = temp
  end

  format_temperature(converted, to)
end

result: String = convert_temperature(100.0, :c, :f)
# Returns "212.0°F"
```

## Common Pitfalls

### Don't Confuse Integer Division

```trb title="division_pitfall.trb"
# This might surprise you
def calculate_half(n: Integer): Integer
  n / 2  # Integer division!
end

half: Integer = calculate_half(5)
# Returns 2, not 2.5

# Use Float if you need decimals
def calculate_half_precise(n: Integer): Float
  n / 2.0
end

half_precise: Float = calculate_half_precise(5)
# Returns 2.5
```

### Bool vs Truthiness

```trb title="bool_pitfall.trb"
# In Ruby, all values except false and nil are truthy
# But Bool type only accepts true or false

# This is wrong:
# flag: Bool = "yes"  # Error!

# Convert to Bool explicitly:
def to_bool(value: String): Bool
  value == "yes"
end
```

### nil Requires Union Types

```trb title="nil_pitfall.trb"
# This won't work:
# value: String = nil  # Error: nil is not String

# Use a union type:
value: String | nil = nil  # Correct
```

## Summary

T-Ruby's basic types mirror Ruby's fundamental types:

- **String**: Text data (`"hello"`)
- **Integer**: Whole numbers (`42`)
- **Float**: Decimal numbers (`3.14`)
- **Bool**: Boolean values (`true`, `false`)
- **Symbol**: Immutable identifiers (`:active`)
- **nil**: Absence of value (`nil`)

Each type has specific methods and behaviors. Type conversions are explicit using methods like `to_s`, `to_i`, and `to_f`. Understanding these basic types is fundamental to writing effective T-Ruby code.

In the next chapter, you'll learn how T-Ruby can automatically infer types, reducing the need for explicit annotations.
