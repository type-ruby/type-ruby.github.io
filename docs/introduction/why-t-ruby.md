---
sidebar_position: 2
title: Why T-Ruby?
description: Benefits and motivation behind T-Ruby
---

<DocsBadge />


# Why T-Ruby?

Ruby is a beautiful language known for its expressiveness and developer happiness. But as projects grow, the lack of static types can lead to bugs that are hard to catch. T-Ruby addresses this while preserving everything that makes Ruby great.

## The Problem with Dynamic Typing at Scale

Consider this common scenario:

```ruby
# Someone writes this API
def fetch_user(id)
  User.find(id)
end

# Months later, someone else calls it
user = fetch_user("123")  # Bug! Should be an Integer
```

This bug won't surface until runtime—possibly in production. With T-Ruby:

```trb title="With T-Ruby"
def fetch_user(id: Integer): User
  User.find(id)
end

user = fetch_user("123")  # Compile error! Expected Integer, got String
```

The error is caught immediately, before the code ever runs.

## Benefits of T-Ruby

### 1. Catch Bugs Early

Type errors are caught at compile time, not runtime. This means:

- Fewer bugs in production
- Faster debugging cycles
- More confidence when refactoring

```trb
def process_payment(amount: Float, currency: String): PaymentResult
  # Type checker ensures:
  # - amount is always a Float
  # - currency is always a String
  # - Return value must be a PaymentResult
end

# These would all be compile-time errors:
process_payment("100", "USD")      # Error: String is not Float
process_payment(100.0, :usd)       # Error: Symbol is not String
process_payment(100.0, "USD").foo  # Error: PaymentResult has no method 'foo'
```

### 2. Better Developer Experience

Types serve as documentation that never goes out of date:

```trb
# Without types - what does this return? What should I pass?
def transform(data, options = {})
  # ...
end

# With types - crystal clear
def transform(data: Record[], options: TransformOptions?): TransformResult
  # ...
end
```

Your IDE can provide:
- Intelligent autocomplete
- Inline type information
- Refactoring support
- Go-to-definition that actually works

### 3. Gradual Adoption

You don't have to rewrite your entire codebase. T-Ruby supports gradual typing:

```trb
# Start with your most critical code
def charge_customer(customer_id: Integer, amount: Float): ChargeResult
  # This function is now type-safe
  legacy_billing_system(customer_id, amount)
end

# Legacy code can remain untyped
def legacy_billing_system(customer_id, amount)
  # Still works fine
end
```

### 4. Zero Runtime Cost

Unlike some type systems that add runtime checks, T-Ruby types are completely erased during compilation:

```trb title="Before compilation (app.trb)"
def multiply(a: Integer, b: Integer): Integer
  a * b
end
```

```ruby title="After compilation (app.rb)"
def multiply(a, b)
  a * b
end
```

The output is exactly what you'd write by hand. No performance overhead, no dependencies, no magic.

### 5. Ecosystem Integration

T-Ruby generates standard RBS files, integrating with the existing Ruby type ecosystem:

- Use **Steep** for additional type checking
- Get IDE support via **Ruby LSP**
- Compatible with **Sorbet** type definitions
- Works with all existing Ruby gems

## When to Use T-Ruby

T-Ruby is particularly valuable for:

| Use Case | Benefit |
|----------|---------|
| **Large codebases** | Types prevent bugs and make refactoring safer |
| **Team projects** | Types serve as documentation and contracts between developers |
| **Critical systems** | Catch errors before they reach production |
| **Library authors** | Provide type information for users |
| **Learning Ruby** | Types help understand APIs and catch mistakes |

## When Types Might Be Overkill

Types add some overhead. For very small scripts or quick prototypes, untyped Ruby might be more appropriate:

```trb
# For a quick script, this is fine
puts "Hello, #{ARGV[0]}!"

# No need for:
# def main(args: String[]): void
#   puts "Hello, #{args[0]}!"
# end
```

The beauty of T-Ruby is that **you choose** when and where to add types.

## The TypeScript Success Story

TypeScript proved that adding types to a dynamic language can be done right:

1. **Gradual adoption** - Start small, grow organically
2. **Type erasure** - No runtime overhead
3. **Ecosystem integration** - Works with existing code

T-Ruby brings this same proven approach to Ruby. If TypeScript made large-scale JavaScript development manageable, T-Ruby can do the same for Ruby.

## Next Steps

Convinced? Let's get started:

1. [Install T-Ruby](/docs/getting-started/installation)
2. [Write your first typed Ruby](/docs/getting-started/quick-start)
3. [Learn the type system](/docs/learn/basics/type-annotations)
