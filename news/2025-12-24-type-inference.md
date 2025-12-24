---
slug: type-inference-released
title: "Type Inference: Write Less, Type More"
authors: [yhk1038]
tags: [release, feature]
---

T-Ruby now automatically infers return types from your code. No more explicit annotations for obvious types!

## What's New

Previously, you had to write:

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

Now, the return type is optional:

```ruby
def greet(name: String)
  "Hello, #{name}!"
end
```

T-Ruby infers that `greet` returns `String` and generates the correct RBS:

```rbs
def greet: (name: String) -> String
```

## How It Works

The new type inference engine analyzes method bodies to determine return types:

- **Literal inference**: `"hello"` → `String`, `42` → `Integer`
- **Method call tracking**: `str.upcase` → `String`
- **Implicit returns**: Ruby's last expression becomes the return type
- **Conditional handling**: Union types from `if`/`else` branches

## Examples

### Simple Methods

```ruby
class Calculator
  def double(n: Integer)
    n * 2
  end

  def is_positive?(n: Integer)
    n > 0
  end
end
```

Generated RBS:

```rbs
class Calculator
  def double: (n: Integer) -> Integer
  def is_positive?: (n: Integer) -> bool
end
```

### Instance Variables

```ruby
class User
  def initialize(name: String)
    @name = name
  end

  def greeting
    "Hello, #{@name}!"
  end
end
```

Generated RBS:

```rbs
class User
  @name: String

  def initialize: (name: String) -> void
  def greeting: () -> String
end
```

## Technical Details

The inference system is inspired by TypeScript's approach:

- **BodyParser**: Parses T-Ruby method bodies into IR nodes
- **TypeEnv**: Manages scope chains for variable type tracking
- **ASTTypeInferrer**: Traverses IR with lazy evaluation and caching

For a deep dive into the implementation, check out our [technical blog post](/blog/typescript-style-type-inference).

## Try It Now

Update to the latest T-Ruby and enjoy automatic type inference:

```bash
gem update t-ruby
```

Your existing code will work as before - explicit types still take precedence. The inference only kicks in when return types are omitted.

## Feedback

We'd love to hear your experience with type inference. Found an edge case? Have suggestions? Open an issue on [GitHub](https://github.com/aspect-build/t-ruby).

Happy typing!
