---
slug: keyword-arguments-type-definitions
title: "Handling Keyword Arguments in T-Ruby"
authors: [yhk1038]
tags: [tutorial, syntax, keyword-arguments]
---

When we first released T-Ruby, one of the most frequently asked questions was: **"How do I define keyword arguments?"** — this was [Issue #19](https://github.com/aspect-build/t-ruby/issues/19) - and it turned out to be one of the most important design decisions for the language.

<!-- truncate -->

## The Problem: Syntax Collision

In T-Ruby, type annotations use the colon syntax: `name: Type`. But Ruby's keyword arguments also use a colon: `name: value`. This creates a fundamental conflict.

Consider this T-Ruby code:

```ruby
def foo(x: String, y: Integer = 10)
```

Is `x` a keyword argument or a positional argument with a type annotation? In early T-Ruby, this was always treated as a **positional argument** - you'd call it as `foo("hi", 20)`.

But what if you wanted actual keyword arguments that you call as `foo(x: "hi", y: 20)`?

## The Solution: A Simple Rule

T-Ruby solves this with one elegant rule: **the presence of a variable name determines the meaning**.

| Syntax | Meaning | Compiles To |
|--------|---------|-------------|
| `{ name: String }` | Keyword argument (destructuring) | `def foo(name:)` |
| `config: { host: String }` | Hash literal parameter | `def foo(config)` |
| `**opts: Type` | Double splat for forwarding | `def foo(**opts)` |

Let's explore each pattern.

## Pattern 1: Keyword Arguments with `{ }`

When you use curly braces **without a variable name**, T-Ruby treats it as keyword argument destructuring:

```ruby
# T-Ruby
def greet({ name: String, prefix: String = "Hello" }): String
  "#{prefix}, #{name}!"
end

# How to call it
greet(name: "Alice")
greet(name: "Bob", prefix: "Hi")
```

This compiles to:

```ruby
# Ruby
def greet(name:, prefix: "Hello")
  "#{prefix}, #{name}!"
end
```

And generates this RBS signature:

```rbs
def greet: (name: String, ?prefix: String) -> String
```

### Key Points

- Wrap keyword arguments in `{ }`
- Each argument has a type: `name: String`
- Default values work naturally: `prefix: String = "Hello"`
- The `?` in RBS indicates optional parameters

## Pattern 2: Hash Literal with Variable Name

When you add a variable name before the braces, T-Ruby treats it as a Hash parameter:

```ruby
# T-Ruby
def process(config: { host: String, port: Integer }): String
  "#{config[:host]}:#{config[:port]}"
end

# How to call it
process(config: { host: "localhost", port: 8080 })
```

This compiles to:

```ruby
# Ruby
def process(config)
  "#{config[:host]}:#{config[:port]}"
end
```

Use this pattern when:
- You want to pass an entire Hash object
- You need to access values with `config[:key]` syntax
- The Hash might be stored or passed to other methods

## Pattern 3: Double Splat with `**`

For collecting arbitrary keyword arguments or forwarding them to other methods:

```ruby
# T-Ruby
def with_transaction(**config: DbConfig): String
  conn = connect_db(**config)
  "BEGIN; #{conn}; COMMIT;"
end
```

This compiles to:

```ruby
# Ruby
def with_transaction(**config)
  conn = connect_db(**config)
  "BEGIN; #{conn}; COMMIT;"
end
```

The `**` is preserved because Ruby's `opts: Type` compiles to `def foo(opts:)` (a single keyword argument named `opts`), not `def foo(**opts)` (collecting all keyword arguments).

## Mixing Positional and Keyword Arguments

You can combine positional arguments with keyword arguments:

```ruby
# T-Ruby
def mixed(id: Integer, { name: String, age: Integer = 0 }): String
  "#{id}: #{name} (#{age})"
end

# How to call it
mixed(1, name: "Alice")
mixed(2, name: "Bob", age: 30)
```

Compiles to:

```ruby
# Ruby
def mixed(id, name:, age: 0)
  "#{id}: #{name} (#{age})"
end
```

## Using Interfaces

For complex configurations, define an interface and reference it:

```ruby
# Define the interface
interface ConnectionOptions
  host: String
  port?: Integer
  timeout?: Integer
end

# Destructuring with interface reference - specify field names with defaults
def connect({ host:, port: 8080, timeout: 30 }: ConnectionOptions): String
  "#{host}:#{port}"
end

# How to call it
connect(host: "localhost")
connect(host: "localhost", port: 3000)

# Double splat - for forwarding keyword arguments
def forward(**opts: ConnectionOptions): String
  connect(**opts)
end
```

Note that when using interface references, you must explicitly list the field names in the destructuring pattern. Default values are specified in the function definition, not in the interface.

## Complete Example

Here's a real-world example combining multiple patterns:

```ruby
# T-Ruby
class ApiClient
  def initialize({ base_url: String, timeout: Integer = 30 })
    @base_url = base_url
    @timeout = timeout
  end

  def get({ path: String }): String
    "#{@base_url}#{path}"
  end

  def post(path: String, { body: String, headers: Hash = {} }): String
    "POST #{@base_url}#{path}"
  end
end

# Usage
client = ApiClient.new(base_url: "https://api.example.com")
client.get(path: "/users")
client.post("/users", body: "{}", headers: { "Content-Type" => "application/json" })
```

This compiles to:

```ruby
# Ruby
class ApiClient
  def initialize(base_url:, timeout: 30)
    @base_url = base_url
    @timeout = timeout
  end

  def get(path:)
    "#{@base_url}#{path}"
  end

  def post(path, body:, headers: {})
    "POST #{@base_url}#{path}"
  end
end
```

## Quick Reference

| What You Want | T-Ruby Syntax | Ruby Output |
|---------------|---------------|-------------|
| Required keyword arg | `{ name: String }` | `name:` |
| Optional keyword arg | `{ name: String = "default" }` | `name: "default"` |
| Multiple keyword args | `{ a: String, b: Integer }` | `a:, b:` |
| Hash parameter | `opts: { a: String }` | `opts` |
| Double splat | `**opts: Type` | `**opts` |
| Mixed | `id: Integer, { name: String }` | `id, name:` |

## Design History

When we first announced T-Ruby, the initial syntax used `**{}` for keyword arguments:

```ruby
# Initial design (rejected)
def greet(**{ name: String, prefix: String = "Hello" }): String
```

Community feedback pointed out this was too complex. We explored several alternatives:

| Alternative | Example | Result |
|-------------|---------|--------|
| Semicolon | `; name: String` | Rejected (worse readability) |
| Double colon | `name:: String` | Rejected (`::` conflicts with Ruby constants) |
| `named` keyword | `named name: String` | Considered |
| **Braces only** | `{ name: String }` | **Adopted** |

The final design uses a simple rule: the presence of a variable name determines the meaning. This creates a clean, intuitive syntax that doesn't require new keywords.

## Summary

T-Ruby's keyword argument syntax is designed to be intuitive:

1. **Wrap in `{ }`** for keyword arguments
2. **Add a variable name** for Hash parameters
3. **Use `**`** for double splat forwarding

This simple rule eliminates the confusion between type annotations and Ruby keyword syntax, giving you the best of both worlds: TypeScript-style type safety with Ruby's expressive keyword arguments.

---

*Keyword argument support is available in T-Ruby v0.0.41 and later. Try it out and let us know what you think!*
