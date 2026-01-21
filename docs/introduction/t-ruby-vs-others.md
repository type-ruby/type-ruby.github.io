---
sidebar_position: 3
title: T-Ruby vs Others
description: Comparison of T-Ruby with TypeScript, RBS, and Sorbet
---

<DocsBadge />


# T-Ruby vs Others

The Ruby ecosystem has several approaches to static typing. This page compares T-Ruby with other solutions to help you understand where T-Ruby fits in.

## Quick Comparison

| Feature | T-Ruby | RBS | Sorbet | TypeScript |
|---------|--------|-----|--------|------------|
| **Language** | Ruby | Ruby | Ruby | JavaScript |
| **Type syntax** | Inline | Separate files | Comments + sig | Inline |
| **Compilation** | Yes (.trb → .rb) | N/A | No | Yes (.ts → .js) |
| **Runtime checking** | No | No | Optional | No |
| **Gradual typing** | Yes | Yes | Yes | Yes |
| **Generic types** | Yes | Yes | Yes | Yes |
| **Learning curve** | Low (TypeScript-like) | Medium | Higher | - |

## T-Ruby vs RBS

**RBS** is Ruby's official type signature format, introduced in Ruby 3.0.

### RBS Approach

Types are written in separate `.rbs` files:

```ruby title="lib/user.rb"
class User
  def initialize(name, age)
    @name = name
    @age = age
  end

  def greet
    "Hello, I'm #{@name}"
  end
end
```

```rbs title="sig/user.rbs"
class User
  @name: String
  @age: Integer

  def initialize: (String name, Integer age) -> void
  def greet: () -> String
end
```

### T-Ruby Approach

Types are written inline:

```trb title="lib/user.trb"
class User
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def greet: String
    "Hello, I'm #{@name}"
  end
end
```

### Key Differences

| Aspect | T-Ruby | RBS |
|--------|--------|-----|
| Type location | Same file as code | Separate .rbs files |
| Synchronization | Automatic | Manual (can drift) |
| Readability | Types visible while coding | Need to check two files |
| Generated output | .rb + .rbs | .rbs only |

**When to choose RBS:**
- You can't modify the Ruby source files
- Working with third-party libraries
- Team prefers separation of concerns

**When to choose T-Ruby:**
- You want types co-located with code
- Coming from TypeScript
- Want automatic RBS generation

## T-Ruby vs Sorbet

**Sorbet** is a type checker developed by Stripe.

### Sorbet Approach

Types use `sig` blocks and T:: syntax:

```ruby title="lib/calculator.rb"
# typed: strict
require 'sorbet-runtime'

class Calculator
  extend T::Sig

  sig { params(a: Integer, b: Integer).returns(Integer) }
  def add(a, b)
    a + b
  end

  sig { params(items: T::Array[String]).returns(String) }
  def join(items)
    items.join(", ")
  end
end
```

### T-Ruby Approach

```trb title="lib/calculator.trb"
class Calculator
  def add(a: Integer, b: Integer): Integer
    a + b
  end

  def join(items: String[]): String
    items.join(", ")
  end
end
```

### Key Differences

| Aspect | T-Ruby | Sorbet |
|--------|--------|--------|
| Syntax style | TypeScript-like | Ruby DSL |
| Runtime dependency | None | sorbet-runtime gem |
| Runtime checks | No | Optional |
| Compilation | Required | Not required |
| Verbosity | Lower | Higher |

**Sorbet example with runtime checks:**
```ruby
# Sorbet can check types at runtime
sig { params(name: String).returns(String) }
def greet(name)
  "Hello, #{name}"
end

greet(123)  # Raises TypeError at runtime if runtime checks enabled
```

**T-Ruby approach:**
```trb
# Types are compile-time only
def greet(name: String): String
  "Hello, #{name}"
end

greet(123)  # Compile error (caught before running)
```

**When to choose Sorbet:**
- You need runtime type checking
- Already using Sorbet in your project
- Prefer not to have a compilation step

**When to choose T-Ruby:**
- Want cleaner, more readable syntax
- Don't want runtime dependencies
- Coming from TypeScript

## T-Ruby vs TypeScript

Since T-Ruby is inspired by TypeScript, let's see how they compare:

### Syntax Comparison

```typescript title="TypeScript"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

interface User {
  name: string;
  age: number;
}

function processUser<T extends User>(user: T): string {
  return user.name;
}
```

```trb title="T-Ruby"
def greet(name: String): String
  "Hello, #{name}!"
end

interface User
  def name: String
  def age: Integer
end

def process_user<T: User>(user: T): String
  user.name
end
```

### Similarities

- Inline type annotations
- Type erasure (no runtime overhead)
- Gradual typing support
- Union types (`String | Integer`)
- Generic types (`T[]`)
- Interface definitions

### Differences

| Aspect | T-Ruby | TypeScript |
|--------|--------|------------|
| Base language | Ruby | JavaScript |
| Type naming | PascalCase (String, Integer) | lowercase (string, number) |
| Null type | `nil` | `null`, `undefined` |
| Optional | `T?` or `T \| nil` | `T \| null` or `T?` |
| Method syntax | Ruby's `def` | Function expressions |

## Integration: Using Multiple Tools

T-Ruby generates RBS files, which means you can use it alongside other tools:

```
┌─────────────┐
│    .trb     │
│   files     │
└──────┬──────┘
       │ trc compile
       ▼
┌─────────────┐     ┌─────────────┐
│    .rb      │     │    .rbs     │
│   files     │     │   files     │
└─────────────┘     └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌──────────┐  ┌──────────┐   ┌──────────┐
      │  Steep   │  │ Ruby LSP │   │  Sorbet  │
      │  checker │  │   IDE    │   │(optional)│
      └──────────┘  └──────────┘   └──────────┘
```

## Recommendation

| If you... | Consider |
|-----------|----------|
| Are starting a new Ruby project | **T-Ruby** - clean syntax, good DX |
| Have an existing Sorbet codebase | **Sorbet** - avoid migration cost |
| Need runtime type checking | **Sorbet** - built-in support |
| Want types separate from code | **RBS** - official format |
| Come from TypeScript | **T-Ruby** - familiar syntax |
| Work on a large team | **T-Ruby** or **Sorbet** - both work well |

## Conclusion

T-Ruby offers a modern, TypeScript-inspired approach to Ruby types with:

- Clean, inline syntax
- Zero runtime overhead
- Automatic RBS generation for ecosystem compatibility

It's not about replacing RBS or Sorbet—it's about giving Ruby developers another option that might better fit their workflow and preferences.
