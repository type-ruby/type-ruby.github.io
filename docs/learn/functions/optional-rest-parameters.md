---
sidebar_position: 2
title: Optional & Rest Parameters
description: Optional parameters and rest arguments
---

<DocsBadge />


# Optional & Rest Parameters

Ruby functions often need flexibility in their parameter lists. T-Ruby supports both optional parameters (with default values) and rest parameters (variable-length argument lists) while maintaining full type safety.

## Optional Parameters with Default Values

Optional parameters have default values that are used when the argument is not provided:

```trb title="optional.trb"
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

def create_user(name: String, role: String = "user", active: Boolean = true): User
  User.new(name: name, role: role, active: active)
end

# Calling with different numbers of arguments
puts greet("Alice")                    # "Hello, Alice!"
puts greet("Bob", "Hi")                # "Hi, Bob!"

user1 = create_user("Alice")                           # Uses defaults: role="user", active=true
user2 = create_user("Bob", "admin")                    # Uses default: active=true
user3 = create_user("Charlie", "moderator", false)     # No defaults used
```

The type annotation applies to the parameter whether it's provided or uses the default value.

## Optional Parameters with Nilable Types

Sometimes you want to distinguish between "not provided" and "explicitly nil". Use a nilable type:

```trb title="nilable_optional.trb"
def format_title(text: String, prefix: String? = nil): String
  if prefix
    "#{prefix}: #{text}"
  else
    text
  end
end

def send_email(to: String, subject: String, cc: String? = nil): void
  email = Email.new(to: to, subject: subject)
  email.cc = cc if cc
  email.send
end

# Using nilable optional parameters
title1 = format_title("Introduction")              # "Introduction"
title2 = format_title("Chapter 1", "Book")        # "Book: Chapter 1"
title3 = format_title("Epilogue", nil)            # "Epilogue"

send_email("alice@example.com", "Hello")
send_email("bob@example.com", "Meeting", "team@example.com")
```

## Rest Parameters

Rest parameters collect multiple arguments into an array. Type the array's element type:

```trb title="rest.trb"
def sum(*numbers: Integer[]): Integer
  numbers.reduce(0, :+)
end

def concat_strings(*strings: String[]): String
  strings.join(" ")
end

def log_messages(level: String, *messages: String[]): void
  messages.each do |msg|
    puts "[#{level}] #{msg}"
  end
end

# Calling with variable arguments
puts sum(1, 2, 3, 4, 5)                    # 15
puts sum(10)                                # 10
puts sum()                                  # 0

result = concat_strings("Hello", "world", "from", "T-Ruby")
# "Hello world from T-Ruby"

log_messages("INFO", "App started", "Database connected", "Ready")
# [INFO] App started
# [INFO] Database connected
# [INFO] Ready
```

The type annotation `*numbers: Integer[]` means "zero or more Integer arguments collected into an array".

## Combining Optional and Rest Parameters

You can combine optional and rest parameters, but rest parameters must come after optional ones:

```trb title="combined.trb"
def create_team(
  name: String,
  leader: String,
  active: Boolean = true,
  *members: String[]
): Team
  Team.new(
    name: name,
    leader: leader,
    active: active,
    members: members
  )
end

# Various ways to call
team1 = create_team("Alpha", "Alice")
# name="Alpha", leader="Alice", active=true, members=[]

team2 = create_team("Beta", "Bob", false)
# name="Beta", leader="Bob", active=false, members=[]

team3 = create_team("Gamma", "Charlie", true, "Dave", "Eve", "Frank")
# name="Gamma", leader="Charlie", active=true, members=["Dave", "Eve", "Frank"]
```

## Keyword Arguments

In T-Ruby, keyword arguments are defined using the `{ }` syntax (without variable name). Unlike positional arguments, they are passed by name when calling.

:::info Positional vs Keyword Arguments

| Definition | Call Style |
|------------|------------|
| `(x: String, y: Integer)` | `foo("hi", 10)` - positional |
| `({ x: String, y: Integer })` | `foo(x: "hi", y: 10)` - keyword |
| `(config: { x: String })` | `foo(config: { x: "hi" })` - Hash literal |

**Key Rule**: Variable name presence determines the meaning:
- `{ ... }` (no variable) → keyword arguments (destructured)
- `name: { ... }` (with variable) → Hash literal

:::

### Inline Type Style

Define types directly inside `{ }`. Default values use `= value` syntax:

```trb title="keyword_inline.trb"
def create_post({
  title: String,
  content: String,
  published: Boolean = false,
  tags: String[] = []
}): Post
  Post.new(
    title: title,
    content: content,
    published: published,
    tags: tags
  )
end

# Calling with keyword arguments (order doesn't matter)
post1 = create_post(
  title: "My First Post",
  content: "Hello world"
)

post2 = create_post(
  content: "Another post",
  title: "Second Post",
  published: true,
  tags: ["ruby", "programming"]
)
```

### Interface Reference Style

Define a separate interface and reference it. Default values use Ruby-style `: value` (no equals sign):

```trb title="keyword_interface.trb"
interface PostOptions
  title: String
  content: String
  published?: Boolean    # ? marks optional
  tags?: String[]
end

def create_post({ title:, content:, published: false, tags: [] }: PostOptions): Post
  Post.new(
    title: title,
    content: content,
    published: published,
    tags: tags
  )
end

# Call style is the same
post = create_post(title: "Hello", content: "World")
```

:::tip Choosing Between Inline and Interface

| Aspect | Inline Type | Interface Reference |
|--------|-------------|---------------------|
| Type definition | Inside `{ }` | Separate interface |
| Default value syntax | `= value` | `: value` (no equals) |
| Optional marking | Implied by default value | `?` suffix |
| Reusability | Single method | Shared across methods |

**Recommendation**: Use inline for single-method use, interface for reuse across multiple methods
:::

## Keyword Rest Parameters

Use double splat `**` to collect keyword arguments into a hash:

```trb title="keyword_rest.trb"
def build_query(table: String, **conditions: Hash<Symbol, String | Integer>): String
  where_clause = conditions.map { |k, v| "#{k} = #{v}" }.join(" AND ")
  "SELECT * FROM #{table} WHERE #{where_clause}"
end

def create_config(env: String, **options: Hash<Symbol, String | Integer | Boolean>): Config
  Config.new(environment: env, options: options)
end

# Using keyword rest parameters
query1 = build_query("users", id: 123, active: 1)
# "SELECT * FROM users WHERE id = 123 AND active = 1"

query2 = build_query("posts", author_id: 5, published: 1, category: "tech")
# "SELECT * FROM posts WHERE author_id = 5 AND published = 1 AND category = tech"

config = create_config(
  "production",
  debug: false,
  timeout: 30,
  host: "example.com"
)
```

The type annotation `**conditions: Hash<Symbol, String | Integer>` means "zero or more keyword arguments with String or Integer values collected into a hash".

## Required Keyword Arguments

Keyword arguments without default values are required:

```trb title="required_kwargs.trb"
def register_user({
  email: String,
  password: String,
  name: String = "Anonymous",
  age: Integer
}): User
  # email, password, and age are required
  # name is optional with default
  User.new(email: email, password: password, name: name, age: age)
end

# Must provide email, password, and age
user = register_user(
  email: "alice@example.com",
  password: "secret123",
  age: 25
)

# Can optionally override name
user2 = register_user(
  email: "bob@example.com",
  password: "secret456",
  name: "Bob",
  age: 30
)
```

## Mixing Positional, Optional, and Rest Parameters

You can combine all parameter types, but they must follow this order:
1. Required positional parameters
2. Optional positional parameters
3. Rest parameter (`*args`)
4. Keyword arguments (`{ ... }`)
5. Keyword rest parameter (`**kwargs`)

```trb title="all_types.trb"
def complex_function(
  required_pos: String,                    # 1. Required positional
  optional_pos: Integer = 0,               # 2. Optional positional
  *rest_args: String[],                    # 3. Rest parameter
  {
    required_kw: Boolean,                  # 4. Required keyword
    optional_kw: String = "default"        # 5. Optional keyword
  },
  **rest_kwargs: Hash<Symbol, String | Integer>  # 6. Keyword rest
): Hash<String, String | Integer | Boolean>
  {
    "required_pos" => required_pos,
    "optional_pos" => optional_pos,
    "rest_args" => rest_args.join(","),
    "required_kw" => required_kw,
    "optional_kw" => optional_kw,
    "rest_kwargs" => rest_kwargs
  }
end

# Example call
result = complex_function(
  "hello",                    # required_pos
  42,                         # optional_pos
  "a", "b", "c",             # rest_args
  required_kw: true,          # required_kw
  optional_kw: "custom",      # optional_kw
  extra1: "value1",           # rest_kwargs
  extra2: 123                 # rest_kwargs
)
```

## Practical Example: HTTP Request Builder

Here's a real-world example showing different parameter types:

```trb title="http_builder.trb"
class HTTPRequestBuilder
  # Required parameters only
  def get(url: String): Response
    make_request("GET", url, nil, {})
  end

  # Required + optional parameters
  def post(url: String, body: String, content_type: String = "application/json"): Response
    headers = { "Content-Type" => content_type }
    make_request("POST", url, body, headers)
  end

  # Required + rest parameters
  def delete(*urls: String[]): Response[]
    urls.map { |url| make_request("DELETE", url, nil, {}) }
  end

  # Keyword arguments (inline type)
  def request({
    method: String,
    url: String,
    body: String? = nil,
    timeout: Integer = 30,
    retry_count: Integer = 3
  }): Response
    make_request(method, url, body, {}, timeout, retry_count)
  end

  # Keyword rest parameters
  def custom_request(
    method: String,
    url: String,
    **headers: Hash<Symbol, String>
  ): Response
    make_request(method, url, nil, headers)
  end

  private

  def make_request(
    method: String,
    url: String,
    body: String?,
    headers: Hash<String, String>,
    timeout: Integer = 30,
    retry_count: Integer = 3
  ): Response
    # Implementation details...
    Response.new
  end
end

# Using the builder
builder = HTTPRequestBuilder.new

# Simple GET
response1 = builder.get("https://api.example.com/users")

# POST with custom content type
response2 = builder.post(
  "https://api.example.com/users",
  '{"name": "Alice"}',
  "application/json"
)

# DELETE multiple resources
responses = builder.delete(
  "https://api.example.com/users/1",
  "https://api.example.com/users/2",
  "https://api.example.com/users/3"
)

# Request with custom options
response3 = builder.request(
  method: "PATCH",
  url: "https://api.example.com/users/1",
  body: '{"age": 31}',
  timeout: 60,
  retry_count: 5
)

# Request with custom headers
response4 = builder.custom_request(
  method: "GET",
  url: "https://api.example.com/protected",
  Authorization: "Bearer token123",
  Accept: "application/json",
  User_Agent: "MyApp/1.0"
)
```

## Practical Example: Logger

Another example showing flexible parameter handling:

```trb title="logger.trb"
class Logger
  # Simple message with optional level
  def log(message: String, level: String = "INFO"): void
    puts "[#{level}] #{message}"
  end

  # Multiple messages with rest parameter
  def log_many(level: String, *messages: String[]): void
    messages.each { |msg| log(msg, level) }
  end

  # Structured logging with keyword rest
  def log_structured(message: String, **metadata: Hash<Symbol, String | Integer | Boolean>): void
    meta_str = metadata.map { |k, v| "#{k}=#{v}" }.join(" ")
    puts "[INFO] #{message} | #{meta_str}"
  end

  # Flexible debug logging
  def debug(*messages: String[], **context: Hash<Symbol, String | Integer>): void
    messages.each do |msg|
      ctx_str = context.empty? ? "" : " (#{context.map { |k, v| "#{k}=#{v}" }.join(", ")})"
      puts "[DEBUG] #{msg}#{ctx_str}"
    end
  end
end

# Using the logger
logger = Logger.new

# Simple logging
logger.log("Application started")
logger.log("Warning: Low memory", "WARN")

# Multiple messages
logger.log_many("ERROR", "Database connection failed", "Retrying...", "Giving up")

# Structured logging
logger.log_structured(
  "User logged in",
  user_id: 123,
  ip: "192.168.1.1",
  success: true
)

# Debug with context
logger.debug(
  "Processing request",
  "Validating data",
  "Saving to database",
  request_id: 789,
  user_id: 123
)
```

## Best Practices

1. **Use default values for truly optional behavior**: Only add default values when it makes sense for the parameter to be optional.

2. **Order parameters logically**: Put required parameters first, then optional ones, then rest parameters.

3. **Prefer keyword arguments for clarity**: When you have multiple optional parameters, keyword arguments make calls more readable.

4. **Use rest parameters for collections**: When you expect a variable number of similar items, rest parameters are cleaner than array parameters.

5. **Type rest parameters appropriately**: `*args: String[]` is better than `*args: (String | Integer)[]` if you only expect strings.

6. **Document complex signatures**: When combining many parameter types, add comments explaining the usage.

## Common Patterns

### Builder Methods with Defaults (Keyword Arguments)

```trb title="builder_pattern.trb"
def build_email({
  to: String,
  subject: String,
  from: String = "noreply@example.com",
  reply_to: String? = nil,
  cc: String[] = [],
  bcc: String[] = []
}): Email
  Email.new(to, subject, from, reply_to, cc, bcc)
end

# Call with keyword arguments
email = build_email(to: "alice@example.com", subject: "Hello")
```

### Variadic Factory Functions (Rest + Keyword Arguments)

```trb title="factory.trb"
def create_users(*names: String[], { role: String = "user" }): User[]
  names.map { |name| User.new(name: name, role: role) }
end

users = create_users("Alice", "Bob", "Charlie", role: "admin")
```

### Configuration Merging

```trb title="config.trb"
def merge_config(base: Hash<String, String>, **overrides: Hash<Symbol, String>): Hash<String, String>
  base.merge(overrides)
end

config = merge_config(
  { "host" => "localhost", "port" => "3000" },
  port: "8080",
  ssl: "true"
)
```

## Summary

Optional and rest parameters give your functions flexibility while maintaining type safety:

| Syntax | Description | Call Example |
|--------|-------------|--------------|
| `(x: Type)` | Positional argument | `foo("hi")` |
| `(x: Type = default)` | Optional positional | `foo()` or `foo("hi")` |
| `(*args: Type[])` | Rest parameter | `foo("a", "b", "c")` |
| `({ x: Type })` | Keyword argument | `foo(x: "hi")` |
| `(config: { x: Type })` | Hash literal | `foo(config: { x: "hi" })` |
| `(**kwargs: Hash<Symbol, Type>)` | Keyword rest | `foo(a: 1, b: 2)` |

**Key Points:**
- **Positional arguments** `(x: Type)`: passed by order
- **Keyword arguments** `({ x: Type })`: passed by name (no variable = destructured)
- **Hash literal** `(config: { x: Type })`: with variable name = Hash
- **Keyword rest** `(**kwargs: Hash<Symbol, Type>)`: collects arbitrary keyword arguments into a hash
- T-Ruby ensures type safety for all parameter variations

Master these patterns to write flexible, type-safe APIs that are pleasant to use.
