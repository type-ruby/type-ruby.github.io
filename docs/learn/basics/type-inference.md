---
sidebar_position: 3
title: Type Inference
description: How T-Ruby automatically infers types
---

<DocsBadge />


# Type Inference

One of T-Ruby's most powerful features is type inference. The type system can automatically determine the types of variables and expressions without requiring explicit annotations everywhere. This chapter will teach you how type inference works and when to rely on it.

## What Is Type Inference?

Type inference is the ability of T-Ruby's type checker to automatically deduce the type of a variable or expression based on the value assigned to it or the context in which it's used. This means you don't always need to write type annotations.

### Basic Inference Example

```trb title="basic_inference.trb"
# T-Ruby infers that name is a String
name = "Alice"

# T-Ruby infers that count is an Integer
count = 42

# T-Ruby infers that price is a Float
price = 19.99

# T-Ruby infers that active is a Boolean
active = true
```

The transpiled Ruby is identical:

```ruby title="basic_inference.rb"
name = "Alice"
count = 42
price = 19.99
active = true
```

## How Type Inference Works

T-Ruby examines the value being assigned and determines its type from the literal:

### Literal-Based Inference

```trb title="literals.trb"
# String literal → String type
greeting = "Hello"

# Integer literal → Integer type
age = 25

# Float literal → Float type
temperature = 98.6

# Boolean literal → Boolean type
is_valid = false

# Symbol literal → Symbol type
status = :active

# nil literal → nil type
nothing = nil
```

### Expression-Based Inference

T-Ruby can infer types from expressions:

```trb title="expressions.trb"
x = 10
y = 20

# Inferred as Integer (result of Integer + Integer)
sum = x + y

# Inferred as String (result of String + String)
first_name = "Alice"
last_name = "Smith"
full_name = first_name + " " + last_name

# Inferred as Float (result of Integer.to_f)
decimal = x.to_f
```

### Method Return Type Inference

When a method has a return type annotation, T-Ruby knows the type of the result:

```trb title="method_returns.trb"
def get_name(): String
  "Alice"
end

# T-Ruby infers that name is a String
name = get_name()

def calculate_total(items: Integer, price: Float): Float
  items * price
end

# T-Ruby infers that total is a Float
total = calculate_total(3, 9.99)
```

## When Inference Works Best

Type inference works best for local variables with clear initialization:

### Local Variables

```trb title="local_vars.trb"
def process_order(quantity: Integer, unit_price: Float)
  # These types are all inferred
  subtotal = quantity * unit_price
  tax_rate = 0.08
  tax = subtotal * tax_rate
  total = subtotal + tax

  {
    subtotal: subtotal,
    tax: tax,
    total: total
  }
end
```

In this example, T-Ruby infers:
- `subtotal` is `Float` (Integer * Float = Float)
- `tax_rate` is `Float` (0.08 is a float literal)
- `tax` is `Float` (Float * Float = Float)
- `total` is `Float` (Float + Float = Float)

### Array and Hash Inference

T-Ruby can infer the types of array and hash elements:

```trb title="collections.trb"
# Inferred as Array<Integer>
numbers = [1, 2, 3, 4, 5]

# Inferred as Array<String>
names = ["Alice", "Bob", "Charlie"]

# Inferred as Hash<Symbol, String>
user = {
  name: "Alice",
  email: "alice@example.com"
}

# Inferred as Hash<String, Integer>
scores = {
  "math" => 95,
  "science" => 88
}
```

### Block Parameter Inference

T-Ruby can infer block parameter types when iterating over typed collections:

```trb title="blocks.trb"
def sum_numbers(numbers: Array<Integer>): Integer
  total = 0

  # T-Ruby infers that n is an Integer
  numbers.each do |n|
    total += n
  end

  total
end

def greet_all(names: Array<String>)
  # T-Ruby infers that name is a String
  names.each do |name|
    puts "Hello, #{name}!"
  end
end
```

## When to Add Explicit Annotations

While inference is powerful, there are times when you should add explicit type annotations:

### 1. Method Signatures (Always)

Always annotate method parameters and return types:

```trb title="method_sigs.trb"
# Good - explicit annotations
def calculate_discount(price: Float, percent: Integer): Float
  price * (percent / 100.0)
end

# Avoid - no annotations (harder to understand and use)
def calculate_discount(price, percent)
  price * (percent / 100.0)
end
```

### 2. Instance Variables

Instance variables should be annotated when declared:

```trb title="instance_vars.trb"
class ShoppingCart
  def initialize()
    @items: Array<String> = []
    @total: Float = 0.0
  end

  def add_item(item: String, price: Float)
    @items << item
    @total += price
  end
end
```

### 3. Ambiguous Situations

When the type isn't clear from the initial value:

```trb title="ambiguous.trb"
# Ambiguous - is this supposed to be Float or Integer?
result = 0  # Inferred as Integer

# Better - explicit when you need a Float
result: Float = 0.0

# Or when starting with a temporary value
users: Array<String> = []  # Will hold usernames later
```

### 4. Union Types

When a variable might hold different types:

```trb title="unions.trb"
# Explicit annotation needed for union types
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# Explicit annotation needed when initially nil
current_user: String | nil = nil
```

### 5. Public APIs

When defining public methods, classes, or modules:

```trb title="public_api.trb"
module MathHelpers
  # Public method - fully annotated
  def self.calculate_average(numbers: Array<Float>): Float
    sum = numbers.reduce(0.0) { |acc, n| acc + n }
    sum / numbers.length
  end

  # Public method - fully annotated
  def self.round_currency(amount: Float): String
    "$%.2f" % amount
  end
end
```

## Inference with Control Flow

T-Ruby's inference works through control flow structures:

### If Statements

```trb title="if_statements.trb"
def categorize_age(age: Integer): String
  # category is inferred as String in all branches
  if age < 13
    category = "child"
  elsif age < 20
    category = "teenager"
  else
    category = "adult"
  end

  category
end
```

### Case Statements

```trb title="case_statements.trb"
def get_day_type(day: Symbol): String
  # day_type is inferred as String
  day_type = case day
  when :monday, :tuesday, :wednesday, :thursday, :friday
    "weekday"
  when :saturday, :sunday
    "weekend"
  else
    "unknown"
  end

  day_type
end
```

## Common Inference Patterns

### Pattern 1: Initialize Then Use

```trb title="pattern1.trb"
def process_names(raw_names: String): Array<String>
  # names is inferred as Array<String>
  names = raw_names.split(",")

  # cleaned is inferred as Array<String>
  cleaned = names.map { |n| n.strip.downcase }

  cleaned
end
```

### Pattern 2: Accumulator Variables

```trb title="pattern2.trb"
def calculate_stats(numbers: Array<Integer>): Hash<Symbol, Float>
  # sum is inferred as Integer (starts at 0, adds Integers)
  sum = 0
  numbers.each { |n| sum += n }

  # avg is inferred as Float (Integer.to_f)
  avg = sum.to_f / numbers.length

  { sum: sum.to_f, average: avg }
end
```

### Pattern 3: Builder Pattern

```trb title="pattern3.trb"
def build_query(table: String, conditions: Array<String>): String
  # query is inferred as String
  query = "SELECT * FROM #{table}"

  if conditions.length > 0
    # where_clause is inferred as String
    where_clause = conditions.join(" AND ")
    query += " WHERE #{where_clause}"
  end

  query
end
```

## Limitations of Type Inference

There are situations where T-Ruby cannot infer types automatically:

### Empty Collections

```trb title="empty_collections.trb"
# T-Ruby cannot infer element type from empty array
items = []  # Needs annotation!

# Better - annotate the type
items: Array<String> = []

# Or initialize with at least one element
items = ["first_item"]
```

### Complex Union Types

```trb title="complex_unions.trb"
# T-Ruby cannot infer that this should accept multiple types
def process_value(value)  # Needs annotation!
  if value.is_a?(String)
    value.upcase
  elsif value.is_a?(Integer)
    value * 2
  end
end

# Better - explicit union type
def process_value(value: String | Integer): String | Integer
  if value.is_a?(String)
    value.upcase
  else
    value * 2
  end
end
```

### Recursive Functions

```trb title="recursive.trb"
# Needs return type annotation for recursion
def factorial(n: Integer): Integer
  return 1 if n <= 1
  n * factorial(n - 1)
end

def fibonacci(n: Integer): Integer
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end
```

## Best Practices for Type Inference

### 1. Let Inference Handle Local Variables

```trb title="locals.trb"
def calculate_discount(price: Float, rate: Float): Float
  # Let inference work - types are obvious
  discount = price * rate
  final_price = price - discount

  final_price
end
```

### 2. Annotate When Sharing Across Scopes

```trb title="shared_scope.trb"
class OrderProcessor
  def initialize()
    # Annotate - shared across methods
    @pending_orders: Array<String> = []
    @completed_count: Integer = 0
  end

  def add_order(order: String)
    @pending_orders << order
  end

  def complete_order()
    @pending_orders.shift
    @completed_count += 1
  end
end
```

### 3. Prefer Inference for Intermediate Calculations

```trb title="intermediate.trb"
def calculate_compound_interest(
  principal: Float,
  rate: Float,
  years: Integer
): Float
  # All intermediate values are inferred
  rate_decimal = rate / 100.0
  multiplier = 1.0 + rate_decimal
  final_multiplier = multiplier ** years
  final_amount = principal * final_multiplier

  final_amount
end
```

### 4. Annotate for Clarity in Complex Logic

```trb title="clarity.trb"
def parse_config(raw: String): Hash<Symbol, String | Integer>
  # Annotate the result type for clarity
  config: Hash<Symbol, String | Integer> = {}

  raw.split("\n").each do |line|
    key, value = line.split("=")
    config[key.to_sym] = parse_value(value)
  end

  config
end

def parse_value(value: String): String | Integer
  integer_value = value.to_i
  if integer_value.to_s == value
    integer_value
  else
    value
  end
end
```

## Practical Example: Invoice Calculator

Here's a complete example showing effective use of type inference:

```trb title="invoice.trb"
class Invoice
  def initialize(customer: String)
    @customer: String = customer
    @items: Array<Hash<Symbol, String | Float>> = []
    @tax_rate: Float = 0.08
  end

  def add_item(name: String, price: Float, quantity: Integer)
    # item type is inferred from hash literal
    item = {
      name: name,
      price: price,
      quantity: quantity,
      total: price * quantity
    }

    @items << item
  end

  def calculate_total(): Float
    # subtotal is inferred as Float
    subtotal = 0.0

    @items.each do |item|
      # T-Ruby infers item properties from array type
      subtotal += item[:total]
    end

    # tax and total are inferred as Float
    tax = subtotal * @tax_rate
    total = subtotal + tax

    total
  end

  def generate_summary(): String
    # Inferred types throughout
    total = calculate_total()
    item_count = @items.length

    "Invoice for #{@customer}: #{item_count} items, Total: $#{'%.2f' % total}"
  end
end

# Usage
invoice = Invoice.new("Alice")
invoice.add_item("Widget", 9.99, 2)
invoice.add_item("Gadget", 14.99, 1)

summary: String = invoice.generate_summary()
# Returns: "Invoice for Alice: 2 items, Total: $37.57"
```

## Summary

Type inference in T-Ruby allows you to write clean, concise code while maintaining type safety:

- **Inference works** for local variables, literals, and expressions
- **Always annotate** method signatures, instance variables, and public APIs
- **Add annotations** when types are ambiguous or complex
- **Trust inference** for intermediate calculations and local variables
- **Use explicit types** for empty collections and union types

The goal is to strike a balance: let inference reduce clutter while adding annotations where they improve clarity and safety.

In the next section, you'll learn about everyday types like arrays, hashes, and union types that you'll use regularly in T-Ruby.
