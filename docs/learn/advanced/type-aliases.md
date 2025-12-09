---
sidebar_position: 1
title: Type Aliases
description: Creating custom type names
---

# Type Aliases

Type aliases allow you to create custom names for types, making your code more readable and maintainable. Think of them as nicknames for types—they don't create new types, but they make complex types easier to work with and understand.

## Why Type Aliases?

Type aliases serve several important purposes:

1. **Improve readability** - Replace complex type expressions with meaningful names
2. **Reduce repetition** - Define once, use everywhere
3. **Document intent** - Names can convey what the type represents
4. **Simplify refactoring** - Change the type in one place

### Without Type Aliases

```ruby
# Complex types repeated everywhere
def find_user(id: Integer): Hash<Symbol, String | Integer | Bool> | nil
  # ...
end

def update_user(id: Integer, data: Hash<Symbol, String | Integer | Bool>): Bool
  # ...
end

def create_user(data: Hash<Symbol, String | Integer | Bool>): Integer
  # ...
end

# Hard to understand what this represents
users: Array<Hash<Symbol, String | Integer | Bool>> = []
```

### With Type Aliases

```ruby
# Define once
type UserData = Hash<Symbol, String | Integer | Bool>

# Use everywhere - much clearer!
def find_user(id: Integer): UserData | nil
  # ...
end

def update_user(id: Integer, data: UserData): Bool
  # ...
end

def create_user(data: UserData): Integer
  # ...
end

# Clear what this represents
users: Array<UserData> = []
```

## Basic Type Aliases

The syntax for creating a type alias is simple:

```ruby
type AliasName = ExistingType
```

### Simple Aliases

```ruby
# Alias for a primitive type
type UserId = Integer
type EmailAddress = String
type Price = Float

# Using the aliases
user_id: UserId = 123
email: EmailAddress = "alice@example.com"
product_price: Price = 29.99

# Functions using aliases
def send_email(to: EmailAddress, subject: String, body: String): Bool
  # ...
end

def calculate_discount(original: Price, percentage: Float): Price
  original * (1.0 - percentage / 100.0)
end
```

### Union Type Aliases

Union types benefit greatly from aliases:

```ruby
# Before: Repeated union types
def process(value: String | Integer | Float): String
  # ...
end

def format(value: String | Integer | Float): String
  # ...
end

# After: Clear alias
type Primitive = String | Integer | Float

def process(value: Primitive): String
  # ...
end

def format(value: Primitive): String
  # ...
end

# More examples
type ID = Integer | String
type JSONValue = String | Integer | Float | Bool | nil
type Result = :success | :error | :pending
```

### Collection Aliases

Make complex collection types more readable:

```ruby
# Array aliases
type StringList = Array<String>
type NumberList = Array<Integer>
type UserList = Array<User>

# Hash aliases
type StringMap = Hash<String, String>
type Configuration = Hash<Symbol, String | Integer>
type Cache = Hash<String, Any>

# Nested collections
type Matrix = Array<Array<Integer>>
type TagMap = Hash<String, Array<String>>
type UsersByAge = Hash<Integer, Array<User>>

# Using collection aliases
users: UserList = []
config: Configuration = {
  port: 3000,
  host: "localhost",
  debug: true
}

tags: TagMap = {
  "ruby" => ["language", "dynamic"],
  "rails" => ["framework", "web"]
}
```

## Generic Type Aliases

Type aliases can themselves be generic, accepting type parameters:

### Basic Generic Aliases

```ruby
# A generic Result type
type Result<T> = T | nil

# Usage
user_result: Result<User> = find_user(123)
count_result: Result<Integer> = count_records()

# A generic callback type
type Callback<T> = Proc<T, void>

# Usage
on_user_load: Callback<User> = ->(user: User): void { puts user.name }
on_count: Callback<Integer> = ->(count: Integer): void { puts count }

# A generic pair type
type Pair<A, B> = Array<A | B>  # Simplified for example

# Usage
name_age: Pair<String, Integer> = ["Alice", 30]
```

### Complex Generic Aliases

```ruby
# A generic collection with metadata
type Collection<T> = Hash<Symbol, T | Integer | String>

# Usage
user_collection: Collection<User> = {
  data: User.new("Alice"),
  count: 1,
  status: "active"
}

# A generic transformation function type
type Transformer<T, U> = Proc<T, U>

# Usage
to_string: Transformer<Integer, String> = ->(n: Integer): String { n.to_s }
to_length: Transformer<String, Integer> = ->(s: String): Integer { s.length }

# A generic validator type
type Validator<T> = Proc<T, Bool>

# Usage
positive_validator: Validator<Integer> = ->(n: Integer): Bool { n > 0 }
email_validator: Validator<String> = ->(s: String): Bool { s.include?("@") }
```

### Partially Applied Generic Aliases

You can create aliases that fix some type parameters while leaving others open:

```ruby
# Base generic type
type Response<T, E> = { success: Bool, data: T | nil, error: E | nil }

# Partially applied - fix error type
type APIResponse<T> = Response<T, String>

# Usage
user_response: APIResponse<User> = {
  success: true,
  data: User.new("Alice"),
  error: nil
}

product_response: APIResponse<Product> = {
  success: false,
  data: nil,
  error: "Product not found"
}

# Another example
type StringMap<V> = Hash<String, V>

# Usage
string_to_int: StringMap<Integer> = { "one" => 1, "two" => 2 }
string_to_user: StringMap<User> = { "admin" => User.new("Admin") }
```

## Practical Type Aliases

### Domain-Specific Types

```ruby
# E-commerce domain
type ProductId = Integer
type OrderId = String
type CustomerId = Integer
type Price = Float
type Quantity = Integer

type Product = Hash<Symbol, ProductId | String | Price>
type OrderItem = Hash<Symbol, ProductId | Quantity | Price>
type Order = Hash<Symbol, OrderId | CustomerId | Array<OrderItem> | String>

# Using domain types
def create_order(customer_id: CustomerId, items: Array<OrderItem>): Order
  {
    id: generate_order_id(),
    customer_id: customer_id,
    items: items,
    status: "pending"
  }
end

def calculate_total(items: Array<OrderItem>): Price
  items.reduce(0.0) { |sum, item| sum + item[:price] * item[:quantity] }
end
```

### Status and State Types

```ruby
# Application states
type Status = :pending | :processing | :completed | :failed
type UserRole = :admin | :editor | :viewer
type Environment = :development | :staging | :production

# HTTP-related types
type HTTPMethod = :get | :post | :put | :patch | :delete
type HTTPStatus = Integer  # Could be more specific: 200 | 404 | 500 etc.
type Headers = Hash<String, String>

# Using state types
class Request
  @method: HTTPMethod
  @path: String
  @headers: Headers
  @status: Status

  def initialize(method: HTTPMethod, path: String): void
    @method = method
    @path = path
    @headers = {}
    @status = :pending
  end

  def add_header(key: String, value: String): void
    @headers[key] = value
  end

  def status: Status
    @status
  end
end
```

### JSON and API Types

```ruby
# JSON types
type JSONPrimitive = String | Integer | Float | Bool | nil
type JSONArray = Array<JSONValue>
type JSONObject = Hash<String, JSONValue>
type JSONValue = JSONPrimitive | JSONArray | JSONObject

# API response types
type APIError = Hash<Symbol, String | Integer>
type APISuccess<T> = Hash<Symbol, Bool | T>
type APIResult<T> = APISuccess<T> | APIError

# Using JSON types
def parse_config(json: String): JSONObject
  # Parse JSON string to object
  JSON.parse(json)
end

def api_call<T>(endpoint: String): APIResult<T>
  begin
    data = fetch(endpoint)
    { success: true, data: data }
  rescue => e
    { success: false, error: e.message, code: 500 }
  end
end
```

### Function Types

```ruby
# Common function signatures
type Predicate<T> = Proc<T, Bool>
type Mapper<T, U> = Proc<T, U>
type Consumer<T> = Proc<T, void>
type Supplier<T> = Proc<T>
type Comparator<T> = Proc<T, T, Integer>

# Using function types
def filter<T>(array: Array<T>, predicate: Predicate<T>): Array<T>
  array.select { |item| predicate.call(item) }
end

def map<T, U>(array: Array<T>, mapper: Mapper<T, U>): Array<U>
  array.map { |item| mapper.call(item) }
end

def for_each<T>(array: Array<T>, consumer: Consumer<T>): void
  array.each { |item| consumer.call(item) }
end

# Usage
numbers = [1, 2, 3, 4, 5]
is_even: Predicate<Integer> = ->(n: Integer): Bool { n.even? }
evens = filter(numbers, is_even)  # [2, 4]

to_string: Mapper<Integer, String> = ->(n: Integer): String { n.to_s }
strings = map(numbers, to_string)  # ["1", "2", "3", "4", "5"]

print_it: Consumer<Integer> = ->(n: Integer): void { puts n }
for_each(numbers, print_it)
```

## Type Alias Composition

You can build complex type aliases from simpler ones:

```ruby
# Base types
type UserId = Integer
type Username = String
type Email = String
type Timestamp = Integer

# Composed types
type UserIdentifier = UserId | Username | Email
type UserMetadata = Hash<Symbol, String | Timestamp>
type UserData = Hash<Symbol, UserIdentifier | String | Timestamp>

# Full user type composed from parts
type User = {
  id: UserId,
  username: Username,
  email: Email,
  metadata: UserMetadata
}

# Another example: Building up complexity
type Coordinate = Float
type Point = Array<Coordinate>  # [x, y]
type Line = Array<Point>        # [point1, point2]
type Polygon = Array<Point>     # [point1, point2, point3, ...]
type Shape = Point | Line | Polygon
type DrawingLayer = Array<Shape>
type Drawing = Hash<String, DrawingLayer>
```

## Recursive Type Aliases

:::caution Coming Soon
This feature is planned for a future release.
:::

In the future, T-Ruby will support recursive type aliases for tree structures and linked lists:

```ruby
# Tree structure
type TreeNode<T> = {
  value: T,
  children: Array<TreeNode<T>>
}

# Linked list
type ListNode<T> = {
  value: T,
  next: ListNode<T> | nil
}

# JSON (fully recursive)
type JSONValue =
  | String
  | Integer
  | Float
  | Bool
  | nil
  | Array<JSONValue>
  | Hash<String, JSONValue>
```

## Best Practices

### 1. Use Descriptive Names

```ruby
# Good: Clear, descriptive names
type EmailAddress = String
type ProductPrice = Float
type UserRole = :admin | :editor | :viewer

# Less good: Unclear abbreviations
type EA = String
type PP = Float
type UR = :admin | :editor | :viewer
```

### 2. Group Related Aliases

```ruby
# Good: Organized by domain
# User-related types
type UserId = Integer
type Username = String
type UserEmail = String
type UserData = Hash<Symbol, String | Integer>

# Product-related types
type ProductId = Integer
type ProductName = String
type ProductPrice = Float
type ProductData = Hash<Symbol, String | Integer | Float>
```

### 3. Use Aliases for Complex Types

```ruby
# Good: Alias for complex type used multiple times
type QueryResult = Hash<Symbol, Array<Hash<String, String | Integer>> | Integer>

def execute_query(sql: String): QueryResult
  # ...
end

def cache_result(key: String, result: QueryResult): void
  # ...
end

# Less good: Repeating complex type
def execute_query(sql: String): Hash<Symbol, Array<Hash<String, String | Integer>> | Integer>
  # ...
end
```

### 4. Don't Over-Alias Simple Types

```ruby
# Unnecessary: String is already clear
type S = String
type N = Integer

# Good: Only alias when it adds meaning
type EmailAddress = String  # Adds semantic meaning
type UserId = Integer       # Clarifies purpose
```

## Type Aliases vs Classes

Type aliases don't create new types—they're just alternative names. This is different from classes:

```ruby
# Type alias - just a name
type UserId = Integer

# Both are the same type
id1: UserId = 123
id2: Integer = 456
id1 = id2  # OK - they're the same type

# Class - creates a new type
class UserIdClass
  @value: Integer

  def initialize(value: Integer): void
    @value = value
  end
end

# These are different types
user_id: UserIdClass = UserIdClass.new(123)
int_id: Integer = 456
# user_id = int_id  # Error: Different types!
```

### When to Use Each

```ruby
# Use type aliases when:
# - You want semantic clarity but same underlying behavior
# - You want to simplify complex type expressions
type EmailAddress = String
type JSONData = Hash<String, Any>

# Use classes when:
# - You need distinct types with different behavior
# - You want encapsulation and methods
# - You need runtime type checking
class Email
  @address: String

  def initialize(address: String): void
    raise "Invalid email" unless address.include?("@")
    @address = address
  end

  def domain: String
    @address.split("@").last
  end
end
```

## Common Patterns

### Optional Types

```ruby
# Optional/nullable type aliases
type Optional<T> = T | nil
type Nullable<T> = T | nil

# Usage
user: Optional<User> = find_user(123)
name: Nullable<String> = user&.name
```

### Result Types

```ruby
# Result type for operations that can fail
type Result<T, E> = { success: Bool, value: T | nil, error: E | nil }
type SimpleResult<T> = T | Error

# Usage
def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, value: nil, error: "Division by zero" }
  else
    { success: true, value: a / b, error: nil }
  end
end
```

### Builder Types

```ruby
# Configuration builders
type Config = Hash<Symbol, String | Integer | Bool>
type ConfigBuilder = Proc<Config, Config>

# Usage
def configure(&block: ConfigBuilder): Config
  config = {
    port: 3000,
    host: "localhost",
    debug: false
  }
  block.call(config)
end
```

## Documentation with Type Aliases

Type aliases serve as inline documentation:

```ruby
# The alias name documents what the type represents
type PositiveInteger = Integer  # Should be > 0
type NonEmptyString = String    # Should not be empty
type Percentage = Float         # Should be 0.0 to 100.0

def calculate_discount(price: Float, discount: Percentage): Float
  price * (1.0 - discount / 100.0)
end

def repeat(text: NonEmptyString, times: PositiveInteger): String
  text * times
end
```

## Next Steps

Now that you understand type aliases, explore:

- [Intersection Types](/docs/learn/advanced/intersection-types) for combining multiple types
- [Union Types](/docs/learn/everyday-types/union-types) for either-or type relationships
- [Utility Types](/docs/learn/advanced/utility-types) for advanced type transformations
