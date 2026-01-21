---
sidebar_position: 1
title: What is T-Ruby?
description: Introduction to T-Ruby - TypeScript-style type system for Ruby
---

<DocsBadge />


# What is T-Ruby?

T-Ruby is a **typed superset of Ruby** that compiles to plain Ruby. It adds optional static type annotations to Ruby code, allowing you to catch errors at compile time rather than runtime.

## The Core Concept

Think of T-Ruby as "TypeScript for Ruby." Just as TypeScript extends JavaScript with types and compiles down to JavaScript, T-Ruby extends Ruby with types and compiles down to Ruby.

```trb title="hello.trb"
# T-Ruby code with type annotations
def greet(name: String): String
  "Hello, #{name}!"
end

def add(a: Integer, b: Integer): Integer
  a + b
end
```

After compilation with `trc`, this becomes:

```ruby title="hello.rb"
# Standard Ruby code - types are erased
def greet(name)
  "Hello, #{name}!"
end

def add(a, b)
  a + b
end
```

## Key Characteristics

### 1. Zero Runtime Overhead

Types exist only at compile time. The output is pure Ruby code that runs anywhere Ruby runs—no special runtime, no performance penalty.

### 2. Gradual Typing

You don't need to type everything at once. Start with one file, one function, or even one parameter. T-Ruby works alongside untyped Ruby code.

```trb
# Fully typed
def calculate(x: Integer, y: Integer): Integer
  x * y + 10
end

# Partially typed (return type inferred)
def process(data: String[])
  data.map(&:upcase)
end

# Untyped (still valid T-Ruby)
def legacy_function(arg)
  arg.to_s
end
```

### 3. RBS Generation

T-Ruby automatically generates `.rbs` files—Ruby's official type signature format. This enables integration with:

- **Steep** for additional type checking
- **Ruby LSP** for IDE features
- **Sorbet** for compatibility with existing typed Ruby projects

### 4. Familiar Syntax

If you know TypeScript, you'll feel right at home. T-Ruby uses similar syntax for:

- Union types: `String | Integer`
- Generics: `Array<T>`
- Interfaces: `interface Printable`
- Optional types: `String?` (shorthand for `String | nil`)

## The T-Ruby Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   .trb      │     │    trc      │     │    .rb      │
│   files     │────▶│  compiler   │────▶│   files     │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    .rbs     │
                    │   files     │
                    └─────────────┘
```

1. **Write** your code in `.trb` files with type annotations
2. **Compile** using the `trc` command
3. **Run** the generated `.rb` files with any Ruby interpreter
4. **Optionally** use the generated `.rbs` files with type checkers

## What T-Ruby is NOT

- **Not a new language**: T-Ruby is Ruby with types. All valid Ruby is valid T-Ruby.
- **Not a runtime type checker**: Types are erased at compile time. There's no runtime type validation.
- **Not required**: You can gradually adopt T-Ruby in existing projects without rewriting everything.

## Next Steps

Ready to get started? Head to the [Installation](/docs/getting-started/installation) guide to set up T-Ruby, or jump straight into the [Quick Start](/docs/getting-started/quick-start) to see it in action.
