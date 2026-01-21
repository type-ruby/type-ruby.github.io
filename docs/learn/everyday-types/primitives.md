---
sidebar_position: 1
title: Primitives
description: Primitive types in T-Ruby
---

<DocsBadge />


# Primitives

Primitive types are the fundamental building blocks of T-Ruby's type system. They represent simple, indivisible values that form the basis of more complex types. This chapter explores primitive types in depth, covering their behaviors, edge cases, and best practices.

## What Are Primitive Types?

Primitive types in T-Ruby are:

- `String` - Text and character data
- `Integer` - Whole numbers
- `Float` - Floating-point numbers
- `Boolean` - Boolean values (true/false)
- `Symbol` - Immutable identifiers
- `nil` - The null value

These types are called "primitive" because they cannot be broken down into simpler types. They are the atoms of the type system.

## Working with String Primitives

Strings are immutable sequences of characters in Ruby. T-Ruby's String type provides full type safety for text operations.

### String Creation and Manipulation

```trb title="string_basics.trb"
# Different ways to create strings
single_quoted: String = 'Hello'
double_quoted: String = "World"
interpolated: String = "Hello, #{single_quoted}!"

# Multiline strings
heredoc: String = <<~TEXT
  This is a
  multiline string
TEXT
```

### String Methods with Type Safety

```trb title="string_methods.trb"
def process_text(input: String): String
  # All these operations preserve the String type
  trimmed = input.strip
  lowercase = trimmed.downcase
  capitalized = lowercase.capitalize

  capitalized
end

result: String = process_text("  HELLO  ")
# Returns "Hello"

# Chaining methods
def format_username(username: String): String
  username.strip.downcase.gsub(/[^a-z0-9]/, "_")
end

formatted: String = format_username("  John Doe! ")
# Returns "john_doe_"
```

### String Comparison

```trb title="string_compare.trb"
def are_equal(a: String, b: String): Boolean
  a == b
end

def starts_with_hello(text: String): Boolean
  text.start_with?("Hello")
end

def contains_word(text: String, word: String): Boolean
  text.include?(word)
end

check1: Boolean = are_equal("hello", "hello")  # true
check2: Boolean = starts_with_hello("Hello, world!")  # true
check3: Boolean = contains_word("Ruby is great", "great")  # true
```

### String Length and Indexing

```trb title="string_indexing.trb"
def get_first_char(text: String): String
  text[0]
end

def get_substring(text: String, start: Integer, length: Integer): String
  text[start, length]
end

def string_length(text: String): Integer
  text.length
end

first: String = get_first_char("Hello")  # "H"
sub: String = get_substring("Hello World", 6, 5)  # "World"
len: Integer = string_length("Hello")  # 5
```

### String Building

```trb title="string_building.trb"
def build_greeting(name: String, title: String): String
  parts: String[] = ["Hello", title, name]
  parts.join(" ")
end

greeting: String = build_greeting("Smith", "Dr.")
# Returns "Hello Dr. Smith"

def repeat_text(text: String, times: Integer): String
  text * times
end

repeated: String = repeat_text("Ha", 3)
# Returns "HaHaHa"
```

## Working with Integer Primitives

Integers represent whole numbers without decimal points.

### Integer Arithmetic

```trb title="integer_ops.trb"
def add(a: Integer, b: Integer): Integer
  a + b
end

def multiply(a: Integer, b: Integer): Integer
  a * b
end

def modulo(a: Integer, b: Integer): Integer
  a % b
end

def power(base: Integer, exponent: Integer): Integer
  base ** exponent
end

sum: Integer = add(10, 5)  # 15
product: Integer = multiply(10, 5)  # 50
remainder: Integer = modulo(10, 3)  # 1
result: Integer = power(2, 8)  # 256
```

### Integer Division Behavior

A critical aspect of Integer arithmetic is division behavior:

```trb title="integer_division.trb"
def divide_truncate(a: Integer, b: Integer): Integer
  # Integer division always truncates toward zero
  a / b
end

def divide_with_remainder(a: Integer, b: Integer): Integer[]
  quotient = a / b
  remainder = a % b
  [quotient, remainder]
end

result1: Integer = divide_truncate(7, 2)  # 3 (not 3.5)
result2: Integer = divide_truncate(-7, 2)  # -3 (truncates toward zero)

parts: Integer[] = divide_with_remainder(17, 5)
# Returns [3, 2] (17 = 5 * 3 + 2)
```

### Integer Comparison

```trb title="integer_compare.trb"
def is_positive(n: Integer): Boolean
  n > 0
end

def is_even(n: Integer): Boolean
  n % 2 == 0
end

def is_in_range(n: Integer, min: Integer, max: Integer): Boolean
  n >= min && n <= max
end

def max(a: Integer, b: Integer): Integer
  if a > b
    a
  else
    b
  end
end

check1: Boolean = is_positive(5)  # true
check2: Boolean = is_even(7)  # false
check3: Boolean = is_in_range(5, 1, 10)  # true
maximum: Integer = max(10, 20)  # 20
```

### Integer Methods

```trb title="integer_methods.trb"
def absolute(n: Integer): Integer
  n.abs
end

def next_number(n: Integer): Integer
  n.next
end

def times_operation(n: Integer): Integer[]
  results: Integer[] = []
  n.times do |i|
    results << i
  end
  results
end

abs_value: Integer = absolute(-42)  # 42
next_val: Integer = next_number(5)  # 6
numbers: Integer[] = times_operation(5)  # [0, 1, 2, 3, 4]
```

## Working with Float Primitives

Floats represent decimal numbers using floating-point arithmetic.

### Float Arithmetic

```trb title="float_ops.trb"
def divide_precise(a: Integer, b: Integer): Float
  # Convert to float for precise division
  a.to_f / b
end

def calculate_average(numbers: Integer[]): Float
  sum = numbers.reduce(0) { |acc, n| acc + n }
  sum.to_f / numbers.length
end

def apply_percentage(amount: Float, percent: Float): Float
  amount * (percent / 100.0)
end

precise: Float = divide_precise(7, 2)  # 3.5
avg: Float = calculate_average([10, 20, 30])  # 20.0
discount: Float = apply_percentage(100.0, 15.0)  # 15.0
```

### Float Precision and Rounding

```trb title="float_precision.trb"
def round_to_places(value: Float, places: Integer): Float
  multiplier = 10 ** places
  (value * multiplier).round / multiplier.to_f
end

def round_to_nearest(value: Float): Integer
  value.round
end

def floor_value(value: Float): Integer
  value.floor
end

def ceil_value(value: Float): Integer
  value.ceil
end

rounded: Float = round_to_places(3.14159, 2)  # 3.14
nearest: Integer = round_to_nearest(3.7)  # 4
floored: Integer = floor_value(3.7)  # 3
ceiled: Integer = ceil_value(3.2)  # 4
```

### Float Comparison Challenges

Floating-point comparison requires care due to precision issues:

```trb title="float_compare.trb"
def approximately_equal(a: Float, b: Float, epsilon: Float = 0.0001): Boolean
  (a - b).abs < epsilon
end

def is_close_to_zero(value: Float): Boolean
  value.abs < 0.0001
end

# Direct comparison can be problematic
result1 = 0.1 + 0.2  # Might not be exactly 0.3 due to floating-point precision

# Use approximate comparison
check: Boolean = approximately_equal(0.1 + 0.2, 0.3)  # true

# Checking for zero
is_zero: Boolean = is_close_to_zero(0.0000001)  # true
```

### Float Special Values

```trb title="float_special.trb"
def is_infinite(value: Float): Boolean
  value.infinite? != nil
end

def is_nan(value: Float): Boolean
  value.nan?
end

def safe_divide(a: Float, b: Float): Float | nil
  return nil if b == 0.0
  a / b
end

# Special float values exist
positive_infinity: Float = 1.0 / 0.0  # Infinity
negative_infinity: Float = -1.0 / 0.0  # -Infinity
not_a_number: Float = 0.0 / 0.0  # NaN

check1: Boolean = is_infinite(positive_infinity)  # true
check2: Boolean = is_nan(not_a_number)  # true
```

## Working with Boolean Primitives

The Boolean type represents true/false values with strict type checking.

### Boolean Operations

```trb title="bool_ops.trb"
def and_operation(a: Boolean, b: Boolean): Boolean
  a && b
end

def or_operation(a: Boolean, b: Boolean): Boolean
  a || b
end

def not_operation(a: Boolean): Boolean
  !a
end

def xor_operation(a: Boolean, b: Boolean): Boolean
  (a || b) && !(a && b)
end

result1: Boolean = and_operation(true, false)  # false
result2: Boolean = or_operation(true, false)  # true
result3: Boolean = not_operation(true)  # false
result4: Boolean = xor_operation(true, false)  # true
```

### Boolean from Comparisons

```trb title="bool_from_compare.trb"
def is_valid_age(age: Integer): Boolean
  age >= 0 && age <= 150
end

def is_valid_email(email: String): Boolean
  email.include?("@") && email.include?(".")
end

def all_positive(numbers: Integer[]): Boolean
  numbers.all? { |n| n > 0 }
end

def any_even(numbers: Integer[]): Boolean
  numbers.any? { |n| n % 2 == 0 }
end

valid1: Boolean = is_valid_age(25)  # true
valid2: Boolean = is_valid_email("user@example.com")  # true
check1: Boolean = all_positive([1, 2, 3])  # true
check2: Boolean = any_even([1, 3, 5, 6])  # true
```

### Boolean vs Truthy Values

T-Ruby's Boolean type is strict - only `true` and `false` are valid:

```trb title="bool_strict.trb"
# These are Boolean values
flag1: Boolean = true
flag2: Boolean = false

# These would be type errors:
# flag3: Boolean = 1  # Error!
# flag4: Boolean = "yes"  # Error!
# flag5: Boolean = nil  # Error!

# Convert truthy values to Boolean
def to_bool(value: String | nil): Boolean
  !value.nil? && value != ""
end

def is_present(value: String | nil): Boolean
  value != nil && value.length > 0
end

converted1: Boolean = to_bool("hello")  # true
converted2: Boolean = to_bool(nil)  # false
present: Boolean = is_present("")  # false
```

## Working with Symbol Primitives

Symbols are immutable, unique identifiers often used as constants or keys.

### Symbol Usage

```trb title="symbol_usage.trb"
# Symbols as constants
STATUS_ACTIVE: Symbol = :active
STATUS_PENDING: Symbol = :pending
STATUS_CANCELLED: Symbol = :cancelled

def get_status_message(status: Symbol): String
  case status
  when :active
    "Currently active"
  when :pending
    "Awaiting approval"
  when :cancelled
    "Has been cancelled"
  else
    "Unknown status"
  end
end

message: String = get_status_message(:active)
# Returns "Currently active"
```

### Symbol vs String Performance

Symbols are more memory-efficient than strings for repeated use:

```trb title="symbol_performance.trb"
def categorize_with_symbols(items: Integer[]): Hash<Symbol, Integer[]>
  categories: Hash<Symbol, Integer[]> = {
    small: [],
    medium: [],
    large: []
  }

  items.each do |item|
    if item < 10
      categories[:small] << item
    elsif item < 100
      categories[:medium] << item
    else
      categories[:large] << item
    end
  end

  categories
end

result = categorize_with_symbols([5, 50, 500])
# Returns { small: [5], medium: [50], large: [500] }
```

### Converting Between Symbol and String

```trb title="symbol_conversion.trb"
def symbol_to_string(sym: Symbol): String
  sym.to_s
end

def string_to_symbol(str: String): Symbol
  str.to_sym
end

def normalize_key(key: Symbol | String): Symbol
  if key.is_a?(Symbol)
    key
  else
    key.to_sym
  end
end

text: String = symbol_to_string(:hello)  # "hello"
symbol: Symbol = string_to_symbol("world")  # :world
normalized: Symbol = normalize_key("status")  # :status
```

## Working with nil Primitives

The `nil` type represents the absence of a value.

### nil Checks

```trb title="nil_checks.trb"
def is_nil(value: String | nil): Boolean
  value.nil?
end

def has_value(value: String | nil): Boolean
  !value.nil?
end

def get_or_default(value: String | nil, default: String): String
  if value.nil?
    default
  else
    value
  end
end

check1: Boolean = is_nil(nil)  # true
check2: Boolean = has_value("hello")  # true
result: String = get_or_default(nil, "default")  # "default"
```

### Safe Navigation

```trb title="safe_navigation.trb"
def get_length_safe(text: String | nil): Integer | nil
  text&.length
end

def get_first_char_safe(text: String | nil): String | nil
  text&.[](0)
end

len1 = get_length_safe("hello")  # 5
len2 = get_length_safe(nil)  # nil

char1 = get_first_char_safe("hello")  # "h"
char2 = get_first_char_safe(nil)  # nil
```

## Type Conversions Between Primitives

Converting between primitive types is explicit in T-Ruby:

### To String Conversions

```trb title="to_string_conversions.trb"
def int_to_string(n: Integer): String
  n.to_s
end

def float_to_string(f: Float): String
  f.to_s
end

def bool_to_string(b: Boolean): String
  b.to_s
end

def symbol_to_string(s: Symbol): String
  s.to_s
end

str1: String = int_to_string(42)  # "42"
str2: String = float_to_string(3.14)  # "3.14"
str3: String = bool_to_string(true)  # "true"
str4: String = symbol_to_string(:active)  # "active"
```

### To Number Conversions

```trb title="to_number_conversions.trb"
def string_to_int(s: String): Integer
  s.to_i
end

def string_to_float(s: String): Float
  s.to_f
end

def float_to_int(f: Float): Integer
  f.to_i  # Truncates decimal
end

def int_to_float(i: Integer): Float
  i.to_f
end

num1: Integer = string_to_int("42")  # 42
num2: Float = string_to_float("3.14")  # 3.14
num3: Integer = float_to_int(3.7)  # 3
num4: Float = int_to_float(42)  # 42.0
```

## Practical Example: Calculator

Here's a comprehensive example using all primitive types:

```trb title="calculator.trb"
class Calculator
  def initialize()
    @history: String[] = []
    @memory: Float = 0.0
  end

  def add(a: Float, b: Float): Float
    result = a + b
    log_operation(:add, a, b, result)
    result
  end

  def subtract(a: Float, b: Float): Float
    result = a - b
    log_operation(:subtract, a, b, result)
    result
  end

  def multiply(a: Float, b: Float): Float
    result = a * b
    log_operation(:multiply, a, b, result)
    result
  end

  def divide(a: Float, b: Float): Float | nil
    if b == 0.0
      puts "Error: Division by zero"
      return nil
    end

    result = a / b
    log_operation(:divide, a, b, result)
    result
  end

  def store_in_memory(value: Float)
    @memory = value
  end

  def recall_memory(): Float
    @memory
  end

  def clear_memory()
    @memory = 0.0
  end

  def get_history(): String[]
    @history
  end

  private

  def log_operation(op: Symbol, a: Float, b: Float, result: Float)
    op_str: String = op.to_s
    entry: String = "#{a} #{op_str} #{b} = #{result}"
    @history << entry
  end
end

# Usage
calc = Calculator.new()

result1: Float = calc.add(10.5, 5.3)  # 15.8
result2: Float = calc.multiply(4.0, 2.5)  # 10.0

calc.store_in_memory(result1)
recalled: Float = calc.recall_memory()  # 15.8

history: String[] = calc.get_history()
# Returns ["10.5 add 5.3 = 15.8", "4.0 multiply 2.5 = 10.0"]
```

## Summary

Primitive types are the foundation of T-Ruby's type system:

- **String**: Immutable text with rich manipulation methods
- **Integer**: Whole numbers with truncating division
- **Float**: Decimal numbers requiring care with precision
- **Boolean**: Strict true/false values (not truthy/falsy)
- **Symbol**: Immutable identifiers for constants and keys
- **nil**: Represents absence of value

Understanding primitives deeply helps you work effectively with more complex types. Type conversions are explicit, comparisons have important edge cases, and each primitive has specific behaviors you should understand.

In the next chapter, you'll learn about composite types like Arrays and Hashes that build on these primitives.
