---
sidebar_position: 3
title: Union Types
description: Combining multiple types with union
---

<DocsBadge />


# Union Types

Union types allow a value to be one of several different types. They are essential for modeling data that can legitimately have multiple forms. This chapter will teach you how to use union types effectively in T-Ruby.

## What Are Union Types?

A union type represents a value that can be one of several specified types. In T-Ruby, you create union types using the pipe (`|`) operator:

```trb title="union_basics.trb"
# This variable can be either a String or nil
name: String | nil = "Alice"

# This can be a String or an Integer
id: String | Integer = "user-123"

# This can be one of three types
value: String | Integer | Bool = true
```

## Why Use Union Types?

Union types are useful in several scenarios:

### 1. Optional Values

The most common use is combining a type with `nil` to represent optional values:

```trb title="optional_values.trb"
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# The result might be nil
user: String | nil = find_user(1)  # "User 1"
no_user: String | nil = find_user(-1)  # nil
```

### 2. Multiple Valid Input Types

When a function can accept different types of input:

```trb title="multiple_inputs.trb"
def format_id(id: String | Integer): String
  if id.is_a?(Integer)
    "ID-#{id}"
  else
    id.upcase
  end
end

formatted1: String = format_id(123)  # "ID-123"
formatted2: String = format_id("abc")  # "ABC"
```

### 3. Different Return Types

When a function might return different types based on conditions:

```trb title="different_returns.trb"
def parse_value(input: String): String | Integer | Bool
  if input == "true" || input == "false"
    input == "true"
  elsif input.to_i.to_s == input
    input.to_i
  else
    input
  end
end

result1 = parse_value("42")  # 42 (Integer)
result2 = parse_value("true")  # true (Bool)
result3 = parse_value("hello")  # "hello" (String)
```

## Working with Union Types

### Type Checking with `is_a?`

To safely use a value with a union type, you need to check which type it actually is:

```trb title="type_checking.trb"
def process_value(value: String | Integer): String
  if value.is_a?(String)
    # Inside this block, T-Ruby knows value is a String
    value.upcase
  else
    # Here, T-Ruby knows value must be an Integer
    value.to_s
  end
end

result1: String = process_value("hello")  # "HELLO"
result2: String = process_value(42)  # "42"
```

### Checking for nil

When working with optional values, always check for `nil`:

```trb title="nil_checking.trb"
def get_length(text: String | nil): Integer
  if text.nil?
    0
  else
    # Here, T-Ruby knows text is a String
    text.length
  end
end

len1: Integer = get_length("hello")  # 5
len2: Integer = get_length(nil)  # 0

# Alternative using the safe navigation operator
def get_length_safe(text: String | nil): Integer | nil
  text&.length
end
```

### Multiple Type Checks

When you have more than two types in a union:

```trb title="multiple_checks.trb"
def describe_value(value: String | Integer | Bool): String
  if value.is_a?(String)
    "Text: #{value}"
  elsif value.is_a?(Integer)
    "Number: #{value}"
  elsif value.is_a?(Bool)
    "Boolean: #{value}"
  else
    "Unknown"
  end
end

desc1: String = describe_value("hello")  # "Text: hello"
desc2: String = describe_value(42)  # "Number: 42"
desc3: String = describe_value(true)  # "Boolean: true"
```

## Union Types with Collections

Union types are commonly used with arrays and hashes:

### Arrays with Union Element Types

```trb title="union_arrays.trb"
# Array that can contain strings or integers
def create_mixed_list(): Array<String | Integer>
  ["Alice", 1, "Bob", 2, "Charlie", 3]
end

def sum_numbers(items: Array<String | Integer>): Integer
  total = 0

  items.each do |item|
    if item.is_a?(Integer)
      total += item
    end
  end

  total
end

def get_strings(items: Array<String | Integer>): Array<String>
  result: Array<String> = []

  items.each do |item|
    if item.is_a?(String)
      result << item
    end
  end

  result
end

mixed: Array<String | Integer> = create_mixed_list()
sum: Integer = sum_numbers(mixed)  # 6
strings: Array<String> = get_strings(mixed)  # ["Alice", "Bob", "Charlie"]
```

### Hashes with Union Value Types

```trb title="union_hashes.trb"
# Hash with different value types
def create_config(): Hash<Symbol, String | Integer | Bool>
  {
    host: "localhost",
    port: 3000,
    debug: true,
    timeout: 30,
    environment: "development"
  }
end

def get_string_value(
  config: Hash<Symbol, String | Integer | Bool>,
  key: Symbol
): String | nil
  value = config[key]

  if value.is_a?(String)
    value
  else
    nil
  end
end

def get_integer_value(
  config: Hash<Symbol, String | Integer | Bool>,
  key: Symbol
): Integer | nil
  value = config[key]

  if value.is_a?(Integer)
    value
  else
    nil
  end
end

config = create_config()
host: String | nil = get_string_value(config, :host)  # "localhost"
port: Integer | nil = get_integer_value(config, :port)  # 3000
```

## Common Union Type Patterns

### Pattern 1: Success or Error

```trb title="result_pattern.trb"
def divide_safe(a: Float, b: Float): Float | String
  if b == 0.0
    "Error: Division by zero"
  else
    a / b
  end
end

def process_result(result: Float | String): String
  if result.is_a?(Float)
    "Result: #{result}"
  else
    # It's an error message
    result
  end
end

result1 = divide_safe(10.0, 2.0)  # 5.0
result2 = divide_safe(10.0, 0.0)  # "Error: Division by zero"

message1: String = process_result(result1)  # "Result: 5.0"
message2: String = process_result(result2)  # "Error: Division by zero"
```

### Pattern 2: Default Values

```trb title="default_pattern.trb"
def get_value_or_default(
  value: String | nil,
  default: String
): String
  if value.nil?
    default
  else
    value
  end
end

# Using || for simpler cases
def get_or_default_short(value: String | nil, default: String): String
  value || default
end

result1: String = get_value_or_default("hello", "default")  # "hello"
result2: String = get_value_or_default(nil, "default")  # "default"
```

### Pattern 3: Type Coercion

```trb title="coercion_pattern.trb"
def to_integer(value: String | Integer): Integer
  if value.is_a?(Integer)
    value
  else
    value.to_i
  end
end

def to_string(value: String | Integer | Bool): String
  if value.is_a?(String)
    value
  else
    value.to_s
  end
end

num1: Integer = to_integer(42)  # 42
num2: Integer = to_integer("42")  # 42

str1: String = to_string("hello")  # "hello"
str2: String = to_string(42)  # "42"
str3: String = to_string(true)  # "true"
```

### Pattern 4: Polymorphic Functions

```trb title="polymorphic_pattern.trb"
def repeat(value: String | Integer, times: Integer): String
  if value.is_a?(String)
    value * times
  else
    # Repeat the number representation
    (value.to_s + " ") * times
  end
end

result1: String = repeat("Ha", 3)  # "HaHaHa"
result2: String = repeat(42, 3)  # "42 42 42 "
```

## Nested Union Types

Union types can be combined in complex ways:

### Unions in Unions

```trb title="nested_unions.trb"
# A value that can be a number (Integer or Float) or text (String or Symbol)
def process_input(value: Integer | Float | String | Symbol): String
  if value.is_a?(Integer) || value.is_a?(Float)
    "Number: #{value}"
  elsif value.is_a?(String)
    "String: #{value}"
  else
    "Symbol: #{value}"
  end
end

result1: String = process_input(42)  # "Number: 42"
result2: String = process_input(3.14)  # "Number: 3.14"
result3: String = process_input("hello")  # "String: hello"
result4: String = process_input(:active)  # "Symbol: active"
```

### Unions with Complex Types

```trb title="complex_unions.trb"
# Can be a simple value or an array of values
def normalize_input(
  value: String | Array<String>
): Array<String>
  if value.is_a?(Array)
    value
  else
    [value]
  end
end

result1: Array<String> = normalize_input("hello")  # ["hello"]
result2: Array<String> = normalize_input(["a", "b"])  # ["a", "b"]

# Can be a single integer or a range
def expand_range(value: Integer | Range): Array<Integer>
  if value.is_a?(Range)
    value.to_a
  else
    [value]
  end
end

nums1: Array<Integer> = expand_range(5)  # [5]
nums2: Array<Integer> = expand_range(1..5)  # [1, 2, 3, 4, 5]
```

## Practical Example: Configuration System

Here's a comprehensive example using union types:

```trb title="config_system.trb"
class ConfigManager
  def initialize()
    @config: Hash<String, String | Integer | Bool | nil> = {}
  end

  def set(key: String, value: String | Integer | Bool | nil)
    @config[key] = value
  end

  def get_string(key: String): String | nil
    value = @config[key]

    if value.is_a?(String)
      value
    else
      nil
    end
  end

  def get_integer(key: String): Integer | nil
    value = @config[key]

    if value.is_a?(Integer)
      value
    else
      nil
    end
  end

  def get_bool(key: String): Bool | nil
    value = @config[key]

    if value.is_a?(Bool)
      value
    else
      nil
    end
  end

  def get_string_or_default(key: String, default: String): String
    value = get_string(key)
    value || default
  end

  def get_integer_or_default(key: String, default: Integer): Integer
    value = get_integer(key)
    value || default
  end

  def get_bool_or_default(key: String, default: Bool): Bool
    value = get_bool(key)
    if value.nil?
      default
    else
      value
    end
  end

  def to_hash(): Hash<String, String | Integer | Bool | nil>
    @config.dup
  end

  def parse_and_set(key: String, raw_value: String)
    # Try to parse as boolean
    if raw_value == "true"
      set(key, true)
      return
    elsif raw_value == "false"
      set(key, false)
      return
    end

    # Try to parse as integer
    int_value = raw_value.to_i
    if int_value.to_s == raw_value
      set(key, int_value)
      return
    end

    # Otherwise, store as string
    set(key, raw_value)
  end
end

# Usage
config = ConfigManager.new()

config.set("host", "localhost")
config.set("port", 3000)
config.set("debug", true)
config.set("optional_feature", nil)

host: String = config.get_string_or_default("host", "0.0.0.0")
# "localhost"

port: Integer = config.get_integer_or_default("port", 8080)
# 3000

debug: Bool = config.get_bool_or_default("debug", false)
# true

timeout: Integer = config.get_integer_or_default("timeout", 30)
# 30 (uses default since key doesn't exist)

# Parsing from strings
config.parse_and_set("max_connections", "100")  # Stored as Integer
config.parse_and_set("enable_ssl", "true")  # Stored as Bool
config.parse_and_set("environment", "production")  # Stored as String
```

## Best Practices

### 1. Keep Unions Simple

Avoid unions with too many types:

```trb title="simple_unions.trb"
# Good - clear and simple
def process(value: String | Integer): String
  # ...
end

# Avoid - too many types to handle
def process_complex(
  value: String | Integer | Float | Bool | Symbol | nil
): String
  # Too many branches needed
end
```

### 2. Use nil Unions for Optional Values

```trb title="optional_best_practice.trb"
# Good - clearly optional
def find_item(id: Integer): String | nil
  # ...
end

# Avoid - using empty string to mean "not found"
def find_item_bad(id: Integer): String
  # Returns "" when not found - unclear!
end
```

### 3. Check Types in Consistent Order

```trb title="consistent_checks.trb"
# Good - consistent pattern
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

# Also good - same pattern
def format(value: String | Integer): String
  if value.is_a?(String)
    "Text: #{value}"
  else
    "Number: #{value}"
  end
end
```

### 4. Document Union Type Semantics

```trb title="documentation.trb"
# Good - clear what each type means
def get_status(id: Integer): String | Symbol | nil
  # Returns:
  # - String: Error message
  # - Symbol: Status code (:active, :pending, etc.)
  # - nil: Item not found

  return nil if id < 0
  return :active if id == 1
  "Error: Invalid state"
end
```

## Common Pitfalls

### Forgetting Type Checks

```trb title="missing_checks.trb"
# Wrong - doesn't check type
def bad_example(value: String | Integer): Integer
  value.length  # Error! Integer doesn't have length
end

# Correct - checks type first
def good_example(value: String | Integer): Integer
  if value.is_a?(String)
    value.length
  else
    value
  end
end
```

### Assuming Type After Mutation

```trb title="type_mutation.trb"
def risky_example(value: String | Integer)
  if value.is_a?(String)
    value = value.to_i  # Now it's an Integer!
    # value is now Integer, not String
  end

  # Can't assume value is still String here
end
```

## Summary

Union types in T-Ruby allow values to be one of several types:

- **Syntax**: Use the pipe operator (`|`) to combine types
- **Common use**: Making values optional with `| nil`
- **Type checking**: Use `is_a?` to determine actual type
- **Collections**: Can be used with Array and Hash types
- **Best practices**: Keep unions simple, check types consistently

Union types are essential for modeling real-world data that doesn't fit into a single type. Combined with type narrowing (covered in the next chapter), they provide powerful and safe ways to handle diverse data.
