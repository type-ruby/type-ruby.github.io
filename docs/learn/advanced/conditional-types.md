---
sidebar_position: 3
title: Conditional Types
description: Types that depend on conditions
---

# Conditional Types

:::caution Coming Soon
This feature is planned for a future release.
:::

Conditional types allow you to create types that change based on conditions. Think of them as "if-else" statements at the type level—the resulting type depends on whether a condition is true or false.

## Understanding Conditional Types

Conditional types use a ternary-like syntax to select between two types based on a type relationship:

```ruby
type Result = Condition ? TrueType : FalseType
```

If `Condition` is true, the result is `TrueType`. Otherwise, it's `FalseType`.

### Basic Syntax

```ruby
# Conditional type syntax
type TypeName<T> = T extends SomeType ? TypeIfTrue : TypeIfFalse

# Example: Check if T is a string
type IsString<T> = T extends String ? true : false

# Usage
type Test1 = IsString<String>   # true
type Test2 = IsString<Integer>  # false
```

## Extends Keyword

The `extends` keyword in conditional types checks if a type is assignable to another type:

```ruby
# T extends U means "Can T be assigned to U?"

type IsArray<T> = T extends Array<any> ? true : false

type Test1 = IsArray<Array<Integer>>  # true
type Test2 = IsArray<String>          # false
type Test3 = IsArray<Hash<String, Integer>>  # false
```

### Checking for Specific Types

```ruby
# Check if type is a number
type IsNumeric<T> = T extends Integer | Float ? true : false

# Check if type is nil
type IsNil<T> = T extends nil ? true : false

# Check if type is a function
type IsFunction<T> = T extends Proc<any, any> ? true : false

# Usage examples
type NumTest = IsNumeric<Integer>  # true
type NilTest = IsNil<nil>          # true
type FnTest = IsFunction<Proc<String, Integer>>  # true
```

## Conditional Type Patterns

### Extract Non-Nil Types

```ruby
# Remove nil from a union type
type NonNil<T> = T extends nil ? never : T

# Usage
type MaybeString = String | nil
type JustString = NonNil<MaybeString>  # String

type MixedTypes = String | Integer | nil | Float
type WithoutNil = NonNil<MixedTypes>  # String | Integer | Float
```

### Extract Function Return Types

```ruby
# Get the return type of a function
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

# Usage
type AddFunction = Proc<Integer, Integer, Integer>
type AddReturnType = ReturnType<AddFunction>  # Integer

type GetUserFunction = Proc<Integer, User>
type UserReturnType = ReturnType<GetUserFunction>  # User
```

### Extract Array Element Types

```ruby
# Get the element type of an array
type ElementType<T> = T extends Array<infer E> ? E : never

# Usage
type StringArray = Array<String>
type StringElement = ElementType<StringArray>  # String

type NumberArray = Array<Integer>
type NumberElement = ElementType<NumberArray>  # Integer
```

## The `infer` Keyword

The `infer` keyword allows you to capture and name a type within a conditional type:

```ruby
# Infer the parameter type of a function
type ParamType<T> = T extends Proc<infer P, any> ? P : never

# Infer the key type of a hash
type KeyType<T> = T extends Hash<infer K, any> ? K : never

# Infer the value type of a hash
type ValueError<T> = T extends Hash<any, infer V> ? V : never

# Usage
type MyFunction = Proc<String, Integer>
type Param = ParamType<MyFunction>  # String

type MyHash = Hash<Symbol, User>
type Key = KeyType<MyHash>    # Symbol
type Value = ValueError<MyHash>  # User
```

### Multiple Infer Usage

```ruby
# Extract both parts of a pair
type Unpair<T> = T extends Hash<Symbol, { first: infer F, second: infer S }>
  ? [F, S]
  : never

# Extract function signature parts
type FunctionParts<T> =
  T extends Proc<infer P, infer R>
    ? { params: P, return: R }
    : never
```

## Practical Examples

### Unwrap Types

Remove wrapper types to get the inner type:

```ruby
# Unwrap Array
type Unwrap<T> = T extends Array<infer U> ? U : T

# Usage
type Wrapped1 = Unwrap<Array<String>>  # String
type Wrapped2 = Unwrap<String>         # String (no change)

# Unwrap nested arrays
type DeepUnwrap<T> =
  T extends Array<infer U>
    ? DeepUnwrap<U>
    : T

type NestedArray = Array<Array<Array<Integer>>>
type Unwrapped = DeepUnwrap<NestedArray>  # Integer
```

### Flatten Union Types

```ruby
# Flatten nested unions
type Flatten<T> =
  T extends Array<infer U>
    ? Flatten<U>
    : T extends Hash<any, infer V>
      ? Flatten<V>
      : T

# Remove duplicates from union (if possible)
type Unique<T, U = T> =
  T extends U
    ? [U] extends [T]
      ? T
      : Unique<T, Exclude<U, T>>
    : never
```

### Promise-like Types

```ruby
# Unwrap promise-like types
type Awaited<T> =
  T extends Promise<infer U>
    ? Awaited<U>
    : T

# Simulate async return type
type AsyncReturnType<T> =
  T extends Proc<any, infer R>
    ? Awaited<R>
    : never
```

## Distributive Conditional Types

When a conditional type acts on a union type, it distributes over the union:

```ruby
# This conditional type is distributive
type ToArray<T> = T extends any ? Array<T> : never

# When applied to a union, it distributes:
type StringOrNumber = String | Integer
type Result = ToArray<StringOrNumber>
# Result: Array<String> | Array<Integer>
# Not: Array<String | Integer>

# Another example
type BoxedType<T> = T extends any ? { value: T } : never

type Mixed = String | Integer | Bool
type Boxed = BoxedType<Mixed>
# Result: { value: String } | { value: Integer } | { value: Bool }
```

### Preventing Distribution

To prevent distribution, wrap types in a tuple:

```ruby
# Non-distributive version
type ToArrayNonDist<T> = [T] extends [any] ? Array<T> : never

type StringOrNumber = String | Integer
type Result = ToArrayNonDist<StringOrNumber>
# Result: Array<String | Integer>
```

## Advanced Patterns

### Type Narrowing

```ruby
# Narrow types based on properties
type NarrowByProperty<T, K extends keyof T, V> =
  T extends { K: V } ? T : never

# Filter types from union based on property
type FilterByProperty<T, K, V> =
  T extends infer U
    ? U extends { K: V }
      ? U
      : never
    : never
```

### Recursive Conditional Types

```ruby
# Deep readonly type
type DeepReadonly<T> =
  T extends (Array<infer U> | Hash<any, infer U>)
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends Hash<infer K, infer V>
      ? ReadonlyHash<K, DeepReadonly<V>>
      : T

# Deep partial type
type DeepPartial<T> =
  T extends Hash<infer K, infer V>
    ? Hash<K, DeepPartial<V> | nil>
    : T extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T
```

### Type Guard Functions

```ruby
# Create type predicates
def is_string<T>(value: T): value is String
  value.is_a?(String)
end

def is_array<T>(value: T): value is Array<any>
  value.is_a?(Array)
end

# Use with conditional types
type TypeGuardReturn<T, G> =
  G extends true ? T : never
```

## Conditional Types with Generics

Combine conditional types with generic constraints:

```ruby
# Only allow certain types
type Addable<T> =
  T extends Integer | Float | String
    ? T
    : never

def add<T extends Addable<T>>(a: T, b: T): T
  a + b
end

# Transform types conditionally
type Transform<T> =
  T extends String ? Integer :
  T extends Integer ? Float :
  T extends Float ? String :
  T

# Usage
def transform<T>(value: T): Transform<T>
  case value
  when String
    value.length  # Returns Integer
  when Integer
    value.to_f    # Returns Float
  when Float
    value.to_s    # Returns String
  else
    value
  end
end
```

## Practical Use Cases

### API Response Types

```ruby
# Conditionally add error field based on success status
type APIResponse<T, Success extends Bool> =
  Success extends true
    ? { success: true, data: T }
    : { success: false, error: String }

# Usage
type SuccessResponse = APIResponse<User, true>
# { success: true, data: User }

type ErrorResponse = APIResponse<User, false>
# { success: false, error: String }
```

### Smart Defaults

```ruby
# Provide default types conditionally
type WithDefault<T, D> = T extends nil ? D : T

# Usage
type MaybeString = String | nil
type StringWithDefault = WithDefault<MaybeString, String>  # String

type DefiniteValue = Integer
type IntegerWithDefault = WithDefault<DefiniteValue, Float>  # Integer
```

### Collection Element Access

```ruby
# Get type based on collection type
type CollectionElement<T> =
  T extends Array<infer E> ? E :
  T extends Hash<any, infer V> ? V :
  T extends Set<infer S> ? S :
  never

# Usage
type ArrayElement = CollectionElement<Array<String>>  # String
type HashValue = CollectionElement<Hash<Symbol, Integer>>  # Integer
type SetElement = CollectionElement<Set<User>>  # User
```

### Function Composition

```ruby
# Compose function types
type Compose<F, G> =
  F extends Proc<infer A, infer B>
    ? G extends Proc<B, infer C>
      ? Proc<A, C>
      : never
    : never

# Usage
type F = Proc<String, Integer>  # String -> Integer
type G = Proc<Integer, Bool>    # Integer -> Bool
type Composed = Compose<F, G>   # String -> Bool
```

## Best Practices

### 1. Keep Conditions Simple

```ruby
# Good: Simple, clear condition
type IsString<T> = T extends String ? true : false

# Less good: Complex nested conditions
type ComplexCheck<T> =
  T extends String
    ? T extends "hello"
      ? true
      : T extends "world"
        ? true
        : false
    : false
```

### 2. Use Descriptive Names

```ruby
# Good: Clear names
type NonNilable<T> = T extends nil ? never : T
type Unwrap<T> = T extends Array<infer U> ? U : T

# Less good: Cryptic names
type NN<T> = T extends nil ? never : T
type UW<T> = T extends Array<infer U> ? U : T
```

### 3. Document Complex Types

```ruby
# Good: Documented conditional type
# Extracts the return type of a function type
# @example ReturnType<Proc<String, Integer>> => Integer
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

# Recursively makes all properties optional
# @example DeepPartial<User> => All User properties become T | nil
type DeepPartial<T> =
  T extends Hash<infer K, infer V>
    ? Hash<K, DeepPartial<V> | nil>
    : T
```

### 4. Avoid Deep Nesting

```ruby
# Good: Flat, manageable structure
type FirstType<T> = T extends [infer F, ...any] ? F : never
type RestTypes<T> = T extends [any, ...infer R] ? R : never

# Less good: Deeply nested
type Extract<T> =
  T extends [infer F, ...infer R]
    ? F extends String
      ? R extends Array<infer U>
        ? U extends Integer
          ? [F, U]
          : never
        : never
      : never
    : never
```

## Limitations

### Recursion Depth

```ruby
# Very deep recursion may hit limits
type DeepNested<T, N> =
  N extends 0
    ? T
    : Array<DeepNested<T, Decrement<N>>>  # May hit depth limit
```

### Type Inference Complexity

```ruby
# Complex inference may not always work as expected
type ComplexInfer<T> =
  T extends {
    a: infer A,
    b: infer B,
    c: (x: infer C) => infer D
  } ? [A, B, C, D] : never
```

## Next Steps

Now that you understand conditional types, explore:

- [Mapped Types](/docs/learn/advanced/mapped-types) to transform properties of types
- [Utility Types](/docs/learn/advanced/utility-types) which use conditional types internally
- [Type Inference](/docs/learn/basics/type-inference) to understand how T-Ruby infers types
- [Generics with Constraints](/docs/learn/generics/constraints) for controlled type parameters
