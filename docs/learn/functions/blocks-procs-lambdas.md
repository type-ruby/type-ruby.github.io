---
sidebar_position: 3
title: Blocks, Procs & Lambdas
description: Typing blocks, procs, and lambda expressions
---

<DocsBadge />


# Blocks, Procs & Lambdas

Blocks, procs, and lambdas are essential features in Ruby that allow you to pass executable code around. T-Ruby provides a powerful type system for these constructs, ensuring type safety while preserving Ruby's flexibility.

## Understanding the Differences

Before diving into typing, let's clarify the three concepts:

- **Block**: Anonymous code passed to a method (not an object)
- **Proc**: A block wrapped in an object
- **Lambda**: A stricter form of Proc with different argument handling

```trb title="basics.trb"
# Block - passed with do...end or {...}
[1, 2, 3].each do |n|
  puts n
end

# Proc - created with Proc.new
my_proc: Proc<Integer, void> = Proc.new { |n| puts n }
my_proc.call(5)

# Lambda - created with ->
my_lambda: Proc<Integer, void> = ->(n: Integer) { puts n }
my_lambda.call(10)
```

## Typing Blocks

Methods that accept blocks use the `&block` parameter. Type it with `Proc`:

```trb title="block_params.trb"
def each_number(&block: Proc<Integer, void>): void
  [1, 2, 3].each do |n|
    block.call(n)
  end
end

def transform_strings(&block: Proc<String, String>): Array<String>
  ["hello", "world"].map do |str|
    block.call(str)
  end
end

# Using the methods
each_number { |n| puts n * 2 }

result = transform_strings { |s| s.upcase }
# result: ["HELLO", "WORLD"]
```

The `Proc<Input, Output>` syntax specifies:
- **First type**: The block parameter type
- **Second type**: The block's return type

## Multiple Block Parameters

Blocks can take multiple parameters:

```trb title="multiple_params.trb"
def each_pair(&block: Proc<[String, Integer], void>): void
  pairs = [["Alice", 30], ["Bob", 25], ["Charlie", 35]]
  pairs.each do |name, age|
    block.call(name, age)
  end
end

def transform_hash(&block: Proc<[String, Integer], String>): Array<String>
  { "a" => 1, "b" => 2, "c" => 3 }.map do |key, value|
    block.call(key, value)
  end
end

# Using multiple parameters
each_pair do |name, age|
  puts "#{name} is #{age} years old"
end

results = transform_hash { |k, v| "#{k}=#{v}" }
# results: ["a=1", "b=2", "c=3"]
```

Use tuple syntax `[Type1, Type2]` for multiple block parameters.

## Optional Blocks

Some methods can work with or without a block:

```trb title="optional_blocks.trb"
def process_items(items: Array<Integer>, &block: Proc<Integer, Integer>?): Array<Integer>
  if block
    items.map { |item| block.call(item) }
  else
    items  # Return items unchanged
  end
end

# With a block
doubled = process_items([1, 2, 3]) { |n| n * 2 }
# doubled: [2, 4, 6]

# Without a block
unchanged = process_items([1, 2, 3])
# unchanged: [1, 2, 3]
```

The `?` makes the block optional (nilable).

## Proc Types

Procs are first-class objects that can be stored and passed around:

```trb title="procs.trb"
# Define proc types
adder: Proc<Integer, Integer> = Proc.new { |n| n + 10 }
greeter: Proc<String, String> = Proc.new { |name| "Hello, #{name}!" }
validator: Proc<String, Boolean> = Proc.new { |email| email.include?("@") }

# Using procs
result1 = adder.call(5)        # 15
result2 = greeter.call("Alice") # "Hello, Alice!"
result3 = validator.call("test@example.com")  # true

# Procs can be passed to methods
def apply_to_all(numbers: Array<Integer>, operation: Proc<Integer, Integer>): Array<Integer>
  numbers.map { |n| operation.call(n) }
end

doubled = apply_to_all([1, 2, 3], Proc.new { |n| n * 2 })
# doubled: [2, 4, 6]
```

## Lambda Types

Lambdas have the same type signature as Procs:

```trb title="lambdas.trb"
# Lambdas with type annotations
add_ten: Proc<Integer, Integer> = ->(n: Integer) { n + 10 }
multiply: Proc<[Integer, Integer], Integer> = ->(a: Integer, b: Integer) { a * b }
format_user: Proc<User, String> = ->(user: User) { "#{user.name} (#{user.email})" }

# Using lambdas
sum = add_ten.call(5)              # 15
product = multiply.call(3, 4)       # 12
formatted = format_user.call(user)  # "Alice (alice@example.com)"

# Lambdas can be passed to methods
def filter_users(users: Array<User>, predicate: Proc<User, Boolean>): Array<User>
  users.select { |user| predicate.call(user) }
end

is_admin: Proc<User, Boolean> = ->(user: User) { user.role == "admin" }
admins = filter_users(all_users, is_admin)
```

## Higher-Order Functions

Functions that return procs or lambdas:

```trb title="higher_order.trb"
def create_multiplier(factor: Integer): Proc<Integer, Integer>
  ->(n: Integer) { n * factor }
end

def create_formatter(prefix: String): Proc<String, String>
  ->(text: String) { "#{prefix}: #{text}" }
end

def create_validator(min_length: Integer): Proc<String, Boolean>
  ->(text: String) { text.length >= min_length }
end

# Using higher-order functions
times_three = create_multiplier(3)
times_three.call(4)  # 12

error_formatter = create_formatter("ERROR")
error_formatter.call("File not found")  # "ERROR: File not found"

password_validator = create_validator(8)
password_validator.call("secret")   # false
password_validator.call("secret123") # true
```

## Blocks with No Parameters

Some blocks don't take parameters:

```trb title="no_params.trb"
def execute(&block: Proc<[], void>): void
  puts "Before execution"
  block.call
  puts "After execution"
end

def run_if_true(condition: Boolean, &block: Proc<[], String>): String?
  if condition
    block.call
  else
    nil
  end
end

# Using blocks with no parameters
execute do
  puts "Executing task"
end

result = run_if_true(true) do
  "Task completed"
end
```

Use `Proc<[], ReturnType>` for blocks that take no parameters.

## Generic Blocks

Blocks can be generic to preserve type information:

```trb title="generic_blocks.trb"
def map<T, U>(array: Array<T>, &block: Proc<T, U>): Array<U>
  array.map { |item| block.call(item) }
end

def filter<T>(array: Array<T>, &block: Proc<T, Boolean>): Array<T>
  array.select { |item| block.call(item) }
end

def reduce<T, U>(array: Array<T>, initial: U, &block: Proc<[U, T], U>): U
  array.reduce(initial) { |acc, item| block.call(acc, item) }
end

# Type is preserved through generic blocks
numbers = [1, 2, 3, 4, 5]
strings = map(numbers) { |n| n.to_s }  # Array<String>
evens = filter(numbers) { |n| n.even? }  # Array<Integer>
sum = reduce(numbers, 0) { |acc, n| acc + n }  # Integer
```

## Practical Example: Event Handlers

A real-world example using blocks for event handling:

```trb title="event_handler.trb"
class EventEmitter<T>
  def initialize()
    @listeners: Array<Proc<T, void>> = []
  end

  def on(&listener: Proc<T, void>): void
    @listeners.push(listener)
  end

  def emit(event: T): void
    @listeners.each { |listener| listener.call(event) }
  end

  def remove(&listener: Proc<T, void>): void
    @listeners.delete(listener)
  end
end

# Using the event emitter
class UserEvent
  attr_accessor :type: String
  attr_accessor :user: User

  def initialize(type: String, user: User)
    @type = type
    @user = user
  end
end

user_events = EventEmitter<UserEvent>.new

# Register event handlers
user_events.on do |event|
  puts "User event: #{event.type} for #{event.user.name}"
end

user_events.on do |event|
  if event.type == "login"
    log_login(event.user)
  end
end

# Emit events
user_events.emit(UserEvent.new("login", current_user))
user_events.emit(UserEvent.new("logout", current_user))
```

## Practical Example: Middleware Pattern

Using procs for middleware chains:

```trb title="middleware.trb"
class Request
  attr_accessor :path: String
  attr_accessor :params: Hash<String, String>

  def initialize(path: String, params: Hash<String, String>)
    @path = path
    @params = params
  end
end

class Response
  attr_accessor :status: Integer
  attr_accessor :body: String

  def initialize(status: Integer, body: String)
    @status = status
    @body = body
  end
end

type Middleware = Proc<[Request, Proc<Request, Response>], Response>

class MiddlewareStack
  def initialize()
    @middlewares: Array<Middleware> = []
  end

  def use(middleware: Middleware): void
    @middlewares.push(middleware)
  end

  def execute(request: Request, handler: Proc<Request, Response>): Response
    chain = @middlewares.reverse.reduce(handler) do |next_handler, middleware|
      ->(req: Request) { middleware.call(req, next_handler) }
    end
    chain.call(request)
  end
end

# Define middleware
logging_middleware: Middleware = ->(req: Request, next_handler: Proc<Request, Response>) {
  puts "Request: #{req.path}"
  response = next_handler.call(req)
  puts "Response: #{response.status}"
  response
}

auth_middleware: Middleware = ->(req: Request, next_handler: Proc<Request, Response>) {
  if req.params["token"]
    next_handler.call(req)
  else
    Response.new(401, "Unauthorized")
  end
}

# Use middleware stack
stack = MiddlewareStack.new
stack.use(logging_middleware)
stack.use(auth_middleware)

handler: Proc<Request, Response> = ->(req: Request) {
  Response.new(200, "Hello, World!")
}

request = Request.new("/api/users", { "token" => "abc123" })
response = stack.execute(request, handler)
```

## Practical Example: Functional Operations

Building a functional utility library:

```trb title="functional.trb"
module Functional
  def self.compose<A, B, C>(
    f: Proc<B, C>,
    g: Proc<A, B>
  ): Proc<A, C>
    ->(x: A) { f.call(g.call(x)) }
  end

  def self.curry<A, B, C>(
    f: Proc<[A, B], C>
  ): Proc<A, Proc<B, C>>
    ->(a: A) { ->(b: B) { f.call(a, b) } }
  end

  def self.memoize<T, U>(f: Proc<T, U>): Proc<T, U>
    cache: Hash<T, U> = {}
    ->(arg: T) {
      if cache.key?(arg)
        cache[arg]
      else
        result = f.call(arg)
        cache[arg] = result
        result
      end
    }
  end
end

# Using functional operations
add_one: Proc<Integer, Integer> = ->(n: Integer) { n + 1 }
multiply_two: Proc<Integer, Integer> = ->(n: Integer) { n * 2 }

# Compose functions
add_then_multiply = Functional.compose(multiply_two, add_one)
add_then_multiply.call(5)  # (5 + 1) * 2 = 12

# Curry functions
multiply: Proc<[Integer, Integer], Integer> = ->(a: Integer, b: Integer) { a * b }
curried_multiply = Functional.curry(multiply)
times_three = curried_multiply.call(3)
times_three.call(4)  # 12

# Memoize expensive operations
expensive: Proc<Integer, Integer> = ->(n: Integer) {
  puts "Computing..."
  n * n
}
memoized = Functional.memoize(expensive)
memoized.call(5)  # Prints "Computing..." and returns 25
memoized.call(5)  # Returns 25 immediately (cached)
```

## Block Return Types

Be specific about what blocks return:

```trb title="block_returns.trb"
# Block returns a value
def sum_transformed(numbers: Array<Integer>, &block: Proc<Integer, Integer>): Integer
  numbers.map { |n| block.call(n) }.sum
end

# Block returns nothing (void)
def each_with_index(&block: Proc<[String, Integer], void>): void
  ["a", "b", "c"].each_with_index do |item, index|
    block.call(item, index)
  end
end

# Block returns a boolean (for filtering)
def custom_select(items: Array<String>, &predicate: Proc<String, Boolean>): Array<String>
  items.select { |item| predicate.call(item) }
end

# Using different return types
total = sum_transformed([1, 2, 3]) { |n| n * n }  # 1 + 4 + 9 = 14

each_with_index { |item, idx| puts "#{idx}: #{item}" }

long_strings = custom_select(["hi", "hello", "hey"]) { |s| s.length > 2 }
# long_strings: ["hello"]
```

## Best Practices

1. **Be explicit with block types**: Always annotate block parameters with their expected types.

2. **Use lambdas for strict argument checking**: Lambdas enforce argument counts, Procs are more forgiving.

3. **Prefer generic blocks for reusability**: Generic blocks work with any type while maintaining type safety.

4. **Use Proc types for stored blocks**: When storing blocks in variables or instance variables, use Proc types.

5. **Document complex block signatures**: If a block takes many parameters or has complex types, add comments.

6. **Use void for side-effect blocks**: When a block is only used for side effects, mark its return type as void.

## Common Patterns

### Callback Pattern

```trb title="callbacks.trb"
def fetch_data(url: String, on_success: Proc<String, void>, on_error: Proc<String, void>): void
  begin
    data = HTTP.get(url)
    on_success.call(data)
  rescue => e
    on_error.call(e.message)
  end
end

fetch_data(
  "https://api.example.com/data",
  ->(data: String) { puts "Success: #{data}" },
  ->(error: String) { puts "Error: #{error}" }
)
```

### Builder Pattern with Blocks

```trb title="builder_block.trb"
class QueryBuilder
  def initialize()
    @conditions: Array<String> = []
  end

  def where(&block: Proc<QueryBuilder, void>): QueryBuilder
    block.call(self)
    self
  end

  def equals(field: String, value: String): void
    @conditions.push("#{field} = '#{value}'")
  end

  def build(): String
    "SELECT * FROM users WHERE #{@conditions.join(' AND ')}"
  end
end

query = QueryBuilder.new
query.where do |q|
  q.equals("name", "Alice")
  q.equals("active", "true")
end.build()
```

### Iterator Pattern

```trb title="iterator.trb"
def times(n: Integer, &block: Proc<Integer, void>): void
  (0...n).each { |i| block.call(i) }
end

def until_true(&block: Proc<Integer, Boolean>): Integer
  i = 0
  while !block.call(i)
    i += 1
  end
  i
end

times(5) { |i| puts "Iteration #{i}" }

result = until_true { |i| i > 10 }  # 11
```

## Summary

Blocks, Procs, and Lambdas in T-Ruby provide powerful abstractions while maintaining type safety:

- **Blocks** are typed with `&block: Proc<Input, Output>`
- **Multiple parameters** use tuple syntax: `Proc<[Type1, Type2], Output>`
- **Optional blocks** use `Proc<Input, Output>?`
- **Generic blocks** preserve type information through generic parameters
- **Higher-order functions** can create and return typed procs

With proper type annotations, you get all the flexibility of Ruby's blocks with the safety of static typing.
