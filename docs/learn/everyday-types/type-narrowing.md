---
sidebar_position: 4
title: Type Narrowing
description: Narrowing types with control flow analysis
---

<DocsBadge />


# Type Narrowing

Type narrowing is the process by which T-Ruby automatically refines the type of a variable based on control flow analysis. When you check the type or value of a variable, T-Ruby narrows down what that variable can be within that code path. This chapter will teach you how type narrowing works and how to leverage it for type-safe code.

## What Is Type Narrowing?

Type narrowing occurs when T-Ruby analyzes your code and determines that within a certain scope, a variable must be a more specific type than its declared type.

```trb title="narrowing_basics.trb"
def process(value: String | Integer): String
  if value.is_a?(String)
    # Inside this block, T-Ruby knows value is a String
    # You can use String-specific methods
    value.upcase
  else
    # Here, T-Ruby knows value must be an Integer
    # You can use Integer-specific methods
    value.to_s
  end
end
```

In this example, the type `String | Integer` is narrowed to just `String` in the first branch and just `Integer` in the else branch.

## Type Guards

Type guards are expressions that allow T-Ruby to narrow types. The most common type guards are:

### The `is_a?` Type Guard

The `is_a?` method checks if a value is an instance of a particular type:

```trb title="is_a_guard.trb"
def format_value(value: String | Integer | Bool): String
  if value.is_a?(String)
    # value is String here
    "Text: #{value}"
  elsif value.is_a?(Integer)
    # value is Integer here
    "Number: #{value}"
  elsif value.is_a?(Bool)
    # value is Bool here
    "Boolean: #{value}"
  else
    "Unknown"
  end
end

result1: String = format_value("hello")  # "Text: hello"
result2: String = format_value(42)  # "Number: 42"
result3: String = format_value(true)  # "Boolean: true"
```

### The `nil?` Type Guard

The `nil?` method narrows optional types:

```trb title="nil_guard.trb"
def get_length(text: String | nil): Integer
  if text.nil?
    # text is nil here
    0
  else
    # text is String here (not nil)
    text.length
  end
end

# Alternative with negation
def get_length_alt(text: String | nil): Integer
  if !text.nil?
    # text is String here
    text.length
  else
    # text is nil here
    0
  end
end

len1: Integer = get_length("hello")  # 5
len2: Integer = get_length(nil)  # 0
```

### The `empty?` Type Guard

The `empty?` method can narrow types for collections:

```trb title="empty_guard.trb"
def process_array(items: Array<String> | nil): String
  if items.nil? || items.empty?
    "No items"
  else
    # items is a non-empty Array<String> here
    "First item: #{items.first}"
  end
end

result1: String = process_array(["a", "b"])  # "First item: a"
result2: String = process_array([])  # "No items"
result3: String = process_array(nil)  # "No items"
```

## Narrowing with Equality Checks

Comparing a value to a specific constant narrows its type:

### Comparing to nil

```trb title="nil_comparison.trb"
def greet(name: String | nil): String
  if name == nil
    # name is nil here
    "Hello, stranger!"
  else
    # name is String here
    "Hello, #{name}!"
  end
end

# Alternative syntax
def greet_alt(name: String | nil): String
  if name != nil
    # name is String here
    "Hello, #{name}!"
  else
    # name is nil here
    "Hello, stranger!"
  end
end
```

### Comparing to Specific Values

```trb title="value_comparison.trb"
def process_status(status: String): String
  if status == "active"
    # status is still String, but we know its value
    "The status is active"
  elsif status == "pending"
    "The status is pending"
  else
    "Unknown status: #{status}"
  end
end
```

## Narrowing in Different Control Flow Structures

### If/Elsif/Else Statements

```trb title="if_narrowing.trb"
def categorize(value: String | Integer | nil): String
  if value.nil?
    # value is nil
    "Empty"
  elsif value.is_a?(String)
    # value is String (not nil, not Integer)
    "Text: #{value.length} chars"
  else
    # value is Integer (not nil, not String)
    "Number: #{value}"
  end
end

cat1: String = categorize(nil)  # "Empty"
cat2: String = categorize("hello")  # "Text: 5 chars"
cat3: String = categorize(42)  # "Number: 42"
```

### Unless Statements

```trb title="unless_narrowing.trb"
def process_unless(value: String | nil): String
  unless value.nil?
    # value is String here
    value.upcase
  else
    # value is nil here
    "NO VALUE"
  end
end

result1: String = process_unless("hello")  # "HELLO"
result2: String = process_unless(nil)  # "NO VALUE"
```

### Case/When Statements

```trb title="case_narrowing.trb"
def describe(value: String | Integer | Symbol): String
  case value
  when String
    # value is String here
    "String with length #{value.length}"
  when Integer
    # value is Integer here
    "Number: #{value}"
  when Symbol
    # value is Symbol here
    "Symbol: #{value}"
  else
    "Unknown"
  end
end

desc1: String = describe("hello")  # "String with length 5"
desc2: String = describe(42)  # "Number: 42"
desc3: String = describe(:active)  # "Symbol: active"
```

### Ternary Operator

```trb title="ternary_narrowing.trb"
def get_display_name(name: String | nil): String
  name.nil? ? "Anonymous" : name.upcase
end

display1: String = get_display_name("alice")  # "ALICE"
display2: String = get_display_name(nil)  # "Anonymous"
```

## Narrowing with Logical Operators

### AND Operator (`&&`)

```trb title="and_narrowing.trb"
def process_and(
  value: String | nil,
  flag: Bool
): String
  if !value.nil? && flag
    # value is String here (not nil)
    # flag is true
    value.upcase
  else
    "Skipped"
  end
end

def safe_access(items: Array<String> | nil, index: Integer): String | nil
  if !items.nil? && index < items.length
    # items is Array<String> here
    items[index]
  else
    nil
  end
end
```

### OR Operator (`||`)

```trb title="or_narrowing.trb"
def process_or(value: String | nil): String
  if value.nil? || value.empty?
    "No value"
  else
    # value is non-empty String here
    value.upcase
  end
end
```

## Early Returns and Type Narrowing

Early returns narrow types for the remainder of the function:

```trb title="early_return.trb"
def process_with_guard(value: String | nil): String
  # Guard clause
  return "No value" if value.nil?

  # After this point, value is String (not nil)
  # No need for else block
  value.upcase
end

def validate_and_process(input: String | Integer): String
  # Multiple guards
  return "Invalid" if input.nil?

  if input.is_a?(String)
    return "Too short" if input.length < 3
    # input is String with length >= 3
    return input.upcase
  end

  # input is Integer here
  return "Too small" if input < 10
  # input is Integer >= 10
  "Valid number: #{input}"
end
```

## Narrowing with Method Calls

Some method calls provide type narrowing:

### String Methods

```trb title="string_method_narrowing.trb"
def process_string(value: String | nil): String
  return "Empty" if value.nil? || value.empty?

  # value is non-empty String here
  first_char = value[0]
  "Starts with: #{first_char}"
end
```

### Array Methods

```trb title="array_method_narrowing.trb"
def get_first_element(items: Array<String> | nil): String
  return "No items" if items.nil? || items.empty?

  # items is non-empty Array<String> here
  first: String = items.first
  first
end
```

## Narrowing in Blocks and Lambdas

Type narrowing works within blocks:

```trb title="block_narrowing.trb"
def process_items(items: Array<String | nil>): Array<String>
  result: Array<String> = []

  items.each do |item|
    # item is String | nil here
    unless item.nil?
      # item is String here
      result << item.upcase
    end
  end

  result
end

def filter_and_map(items: Array<String | Integer>): Array<String>
  items.map do |item|
    if item.is_a?(String)
      # item is String here
      item.upcase
    else
      # item is Integer here
      item.to_s
    end
  end
end
```

## Practical Example: Form Validator

Here's a comprehensive example using type narrowing:

```trb title="form_validator.trb"
class FormValidator
  def validate_field(
    name: String,
    value: String | Integer | Bool | nil,
    required: Bool
  ): String | nil
    # Early return if required field is missing
    if required && value.nil?
      return "#{name} is required"
    end

    # If not required and nil, it's valid
    return nil if value.nil?

    # Now we know value is not nil
    # Type narrowing allows us to check specific types

    if value.is_a?(String)
      # value is String here
      return "#{name} cannot be empty" if value.empty?
      return "#{name} is too long" if value.length > 100
    elsif value.is_a?(Integer)
      # value is Integer here
      return "#{name} must be positive" if value < 0
      return "#{name} is too large" if value > 1000
    end
    # value is Bool here (if it wasn't String or Integer)

    # No errors
    nil
  end

  def validate_email(email: String | nil): String | nil
    return "Email is required" if email.nil?

    # email is String here
    return "Email cannot be empty" if email.empty?
    return "Email must contain @" unless email.include?("@")
    return "Email must contain domain" unless email.include?(".")

    # All checks passed
    nil
  end

  def validate_age(age: Integer | String | nil): String | nil
    return "Age is required" if age.nil?

    # Convert to integer if string
    age_int: Integer

    if age.is_a?(Integer)
      age_int = age
    else
      # age is String here
      return "Age must be a number" if age.to_i.to_s != age
      age_int = age.to_i
    end

    # Now age_int is definitely an Integer
    return "Age must be positive" if age_int < 0
    return "Age must be realistic" if age_int > 150

    nil
  end

  def validate_form(
    name: String | nil,
    email: String | nil,
    age: Integer | String | nil
  ): Hash<Symbol, Array<String>>
    errors: Hash<Symbol, Array<String>> = {}

    # Validate name
    name_error = validate_field("Name", name, true)
    if !name_error.nil?
      errors[:name] = [name_error]
    end

    # Validate email
    email_error = validate_email(email)
    if !email_error.nil?
      errors[:email] = [email_error]
    end

    # Validate age
    age_error = validate_age(age)
    if !age_error.nil?
      errors[:age] = [age_error]
    end

    errors
  end
end

# Usage
validator = FormValidator.new()

# Valid form
errors1 = validator.validate_form("Alice", "alice@example.com", 30)
# Returns {}

# Invalid form
errors2 = validator.validate_form(nil, "invalid-email", -5)
# Returns {
#   name: ["Name is required"],
#   email: ["Email must contain @"],
#   age: ["Age must be positive"]
# }
```

## Narrowing Limitations

Type narrowing has some limitations to be aware of:

### Narrowing Doesn't Persist Across Function Calls

```trb title="narrowing_limits.trb"
def helper(value: String | Integer)
  # Cannot rely on narrowing from caller
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

def caller(value: String | Integer)
  if value.is_a?(String)
    # value is String here
    result = helper(value)  # But helper doesn't know this
  end
end
```

### Narrowing Doesn't Work After Mutation

```trb title="mutation_limits.trb"
def example(value: String | Integer)
  if value.is_a?(String)
    # value is String here
    value = value.to_i
    # value is now Integer, not String!
  end

  # Cannot assume value is String here
end
```

### Complex Conditions May Not Narrow

```trb title="complex_limits.trb"
def complex(a: String | nil, b: String | nil): String
  # This works
  if !a.nil? && !b.nil?
    # Both a and b are String here
    a + b
  else
    "Missing values"
  end
end

def very_complex(value: String | Integer | nil): String
  # Very complex conditions might not narrow as expected
  # Better to use simpler, explicit checks
  if value.is_a?(String)
    value
  elsif value.is_a?(Integer)
    value.to_s
  else
    "nil"
  end
end
```

## Best Practices

### 1. Use Guard Clauses

```trb title="guard_clauses.trb"
# Good - early returns make narrowing clear
def process(value: String | nil): String
  return "Empty" if value.nil?

  # value is String from here on
  value.upcase
end

# Avoid - nested ifs harder to follow
def process_nested(value: String | nil): String
  if !value.nil?
    value.upcase
  else
    "Empty"
  end
end
```

### 2. Check nil First

```trb title="nil_first.trb"
# Good - check nil before other types
def process(value: String | Integer | nil): String
  return "None" if value.nil?

  if value.is_a?(String)
    value
  else
    value.to_s
  end
end
```

### 3. Use Specific Type Checks

```trb title="specific_checks.trb"
# Good - specific type checks
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

# Avoid - vague checks
def process_vague(value: String | Integer): String
  if value.respond_to?(:upcase)
    # Less clear for type checker
    value.upcase
  else
    value.to_s
  end
end
```

## Summary

Type narrowing in T-Ruby allows the type checker to automatically refine types:

- **Type guards**: `is_a?`, `nil?`, and comparison operators
- **Control flow**: Works with if/elsif/else, case/when, and ternary operators
- **Logical operators**: `&&` and `||` allow combined checks
- **Early returns**: Guard clauses narrow types for remaining code
- **Blocks**: Narrowing works within block scope

Type narrowing makes union types practical by letting you safely access type-specific methods after checking the type. Combined with union types, it provides a powerful and type-safe way to handle diverse data.

In the next chapter, you'll learn about literal types, which allow you to specify exact values as types.
