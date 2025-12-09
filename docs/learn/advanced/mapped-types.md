---
sidebar_position: 4
title: Mapped Types
description: Transforming types programmatically
---

# Mapped Types

:::caution Coming Soon
This feature is planned for a future release.
:::

Mapped types allow you to transform one type into another by iterating over its properties. Think of them as "map" operations for types—they let you programmatically create new types based on existing ones by applying transformations to each property.

## Understanding Mapped Types

Mapped types iterate over the keys of a type and apply a transformation to create a new type:

```ruby
type MappedType<T> = {
  [K in keyof T]: Transformation<T[K]>
}
```

### Basic Syntax

```ruby
# Iterate over keys of T
type ReadonlyType<T> = {
  readonly [K in keyof T]: T[K]
}

# Make all properties optional
type OptionalType<T> = {
  [K in keyof T]?: T[K]
}

# Make all properties required
type RequiredType<T> = {
  [K in keyof T]-?: T[K]
}
```

## The `keyof` Operator

The `keyof` operator gets all keys of a type as a union:

```ruby
type User = {
  id: Integer,
  name: String,
  email: String
}

type UserKeys = keyof User  # "id" | "name" | "email"

# Use in mapped types
type UserValues<T> = {
  [K in keyof T]: T[K]
}
```

## Basic Mapped Type Patterns

### Make Properties Readonly

```ruby
# Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type ReadonlyUser = Readonly<User>
# {
#   readonly id: Integer,
#   readonly name: String,
#   readonly email: String
# }

# Usage
user: ReadonlyUser = { id: 1, name: "Alice", email: "alice@example.com" }
# user.name = "Bob"  # Error: Cannot assign to readonly property
```

### Make Properties Optional

```ruby
# Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type PartialUser = Partial<User>
# {
#   id?: Integer,
#   name?: String,
#   email?: String
# }

# Usage - all properties optional
partial_user: PartialUser = { name: "Alice" }  # OK
partial_user2: PartialUser = {}  # OK
```

### Make Properties Required

```ruby
# Remove optional modifiers
type Required<T> = {
  [K in keyof T]-?: T[K]
}

type UserUpdate = {
  id?: Integer,
  name?: String,
  email?: String
}

type RequiredUserUpdate = Required<UserUpdate>
# {
#   id: Integer,
#   name: String,
#   email: String
# }
```

## Property Transformations

### Transform Property Types

```ruby
# Convert all properties to arrays
type Arrayify<T> = {
  [K in keyof T]: Array<T[K]>
}

type User = {
  id: Integer,
  name: String
}

type ArrayUser = Arrayify<User>
# {
#   id: Array<Integer>,
#   name: Array<String>
# }

# Convert all properties to promises
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>
}

# Convert all properties to nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | nil
}
```

### Add or Remove Modifiers

```ruby
# Add readonly
type AddReadonly<T> = {
  +readonly [K in keyof T]: T[K]
}

# Remove readonly
type RemoveReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}

# Make optional
type MakeOptional<T> = {
  [K in keyof T]+?: T[K]
}

# Make required
type MakeRequired<T> = {
  [K in keyof T]-?: T[K]
}
```

## Filtering Keys

### Pick Specific Properties

```ruby
# Pick only specified keys
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type PublicUser = Pick<User, "id" | "name">
# {
#   id: Integer,
#   name: String
# }

# Usage
public_user: PublicUser = { id: 1, name: "Alice" }
```

### Omit Specific Properties

```ruby
# Omit specified keys
type Omit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type UserWithoutPassword = Omit<User, "password">
# {
#   id: Integer,
#   name: String,
#   email: String
# }

# Omit multiple properties
type UserBasic = Omit<User, "password" | "email">
# {
#   id: Integer,
#   name: String
# }
```

## Conditional Mapped Types

Combine mapped types with conditional types:

```ruby
# Make properties readonly based on condition
type ConditionalReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function ? T[K] : readonly T[K]
}

# Make properties nullable based on condition
type ConditionalNullable<T> = {
  [K in keyof T]: T[K] extends String ? T[K] | nil : T[K]
}

# Remove functions
type RemoveFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}
```

## Key Remapping

Transform property keys while mapping:

```ruby
# Add prefix to all keys
type Prefixed<T, Prefix extends String> = {
  [K in keyof T as `${Prefix}${K}`]: T[K]
}

type User = {
  id: Integer,
  name: String
}

type PrefixedUser = Prefixed<User, "user_">
# {
#   user_id: Integer,
#   user_name: String
# }

# Convert keys to uppercase
type Uppercased<T> = {
  [K in keyof T as Uppercase<K>]: T[K]
}

# Add getters
type WithGetters<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: () => T[K]
}

type User = { name: String, age: Integer }
type UserWithGetters = WithGetters<User>
# {
#   getName: () => String,
#   getAge: () => Integer
# }
```

## Practical Examples

### DTO Pattern

```ruby
# Data Transfer Object - all properties become optional and nullable
type DTO<T> = {
  [K in keyof T]?: T[K] | nil
}

# API Response - wrap data
type APIWrapper<T> = {
  [K in keyof T]: {
    value: T[K],
    updated_at: Time
  }
}

type User = {
  name: String,
  email: String
}

type UserDTO = DTO<User>
# {
#   name?: String | nil,
#   email?: String | nil
# }

type UserAPI = APIWrapper<User>
# {
#   name: { value: String, updated_at: Time },
#   email: { value: String, updated_at: Time }
# }
```

### Form Handlers

```ruby
# Convert properties to form fields
type FormFields<T> = {
  [K in keyof T]: {
    value: T[K],
    error: String | nil,
    touched: Bool
  }
}

# Form values only
type FormValues<T> = {
  [K in keyof T]: T[K]
}

# Form event handlers
type FormHandlers<T> = {
  [K in keyof T as `on${Capitalize<K>}Change`]: (value: T[K]) => void
}

type LoginForm = {
  username: String,
  password: String
}

type LoginFields = FormFields<LoginForm>
# {
#   username: { value: String, error: String | nil, touched: Bool },
#   password: { value: String, error: String | nil, touched: Bool }
# }

type LoginHandlers = FormHandlers<LoginForm>
# {
#   onUsernameChange: (value: String) => void,
#   onPasswordChange: (value: String) => void
# }
```

### Database Models

```ruby
# Add timestamps to model
type WithTimestamps<T> = T & {
  created_at: Time,
  updated_at: Time
}

# Make model partial for updates
type UpdateModel<T> = Partial<Omit<T, "id" | "created_at">>

# Add database metadata
type DBModel<T> = {
  [K in keyof T]: {
    value: T[K],
    column_name: String,
    dirty: Bool
  }
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type TimestampedUser = WithTimestamps<User>
# {
#   id: Integer,
#   name: String,
#   email: String,
#   created_at: Time,
#   updated_at: Time
# }

type UserUpdate = UpdateModel<User>
# {
#   name?: String,
#   email?: String
# }
```

### Event Handlers

```ruby
# Create event handlers for all properties
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<K>}Updated`]: (value: T[K]) => void
}

# Create validators for all properties
type Validators<T> = {
  [K in keyof T]: (value: T[K]) => Bool
}

# Create serializers for all properties
type Serializers<T> = {
  [K in keyof T]: (value: T[K]) => String
}

type Product = {
  name: String,
  price: Float,
  stock: Integer
}

type ProductHandlers = EventHandlers<Product>
# {
#   onNameUpdated: (value: String) => void,
#   onPriceUpdated: (value: Float) => void,
#   onStockUpdated: (value: Integer) => void
# }

type ProductValidators = Validators<Product>
# {
#   name: (value: String) => Bool,
#   price: (value: Float) => Bool,
#   stock: (value: Integer) => Bool
# }
```

## Deep Mapped Types

Apply mappings recursively to nested objects:

```ruby
# Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Hash<any, any>
    ? DeepReadonly<T[K]>
    : T[K]
}

# Deep partial
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Hash<any, any>
    ? DeepPartial<T[K]>
    : T[K]
}

# Deep required
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends Hash<any, any>
    ? DeepRequired<T[K]>
    : T[K]
}

type NestedUser = {
  profile: {
    name: String,
    settings: {
      theme: String,
      notifications: Bool
    }
  }
}

type DeepReadonlyUser = DeepReadonly<NestedUser>
# All nested properties become readonly
```

## Combining Mapped Types

Combine multiple mappings:

```ruby
# Readonly and Partial
type ReadonlyPartial<T> = Readonly<Partial<T>>

# Readonly and Required
type ReadonlyRequired<T> = Readonly<Required<T>>

# Nullable and Partial
type NullablePartial<T> = {
  [K in keyof T]?: T[K] | nil
}

# Pick and Partial
type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type SafeUserUpdate = ReadonlyPartial<Omit<User, "id">>
# {
#   readonly name?: String,
#   readonly email?: String,
#   readonly password?: String
# }
```

## Type-Safe Builders

Use mapped types to create type-safe builders:

```ruby
# Builder that ensures all properties are set
type Builder<T> = {
  [K in keyof T as `with${Capitalize<K>}`]: (value: T[K]) => Builder<T>
} & {
  build: () => T
}

# Fluent API
type FluentAPI<T> = {
  [K in keyof T]: (value: T[K]) => FluentAPI<T>
} & {
  get: () => T
}

# Usage example
type User = {
  name: String,
  email: String,
  age: Integer
}

type UserBuilder = Builder<User>
# {
#   withName: (value: String) => UserBuilder,
#   withEmail: (value: String) => UserBuilder,
#   withAge: (value: Integer) => UserBuilder,
#   build: () => User
# }
```

## Best Practices

### 1. Use Descriptive Names

```ruby
# Good: Clear purpose
type ReadonlyUser = Readonly<User>
type PartialUpdate = Partial<UserUpdate>
type PublicProfile = Pick<User, "id" | "name">

# Less good: Generic names
type UserType1 = Readonly<User>
type UserType2 = Partial<UserUpdate>
```

### 2. Create Reusable Mapped Types

```ruby
# Good: Reusable utilities
type WithTimestamps<T> = T & { created_at: Time, updated_at: Time }
type WithSoftDelete<T> = T & { deleted_at: Time | nil }
type WithMetadata<T> = T & { metadata: Hash<String, String> }

# Compose them
type FullModel<T> = WithTimestamps<WithSoftDelete<WithMetadata<T>>>
```

### 3. Document Complex Mappings

```ruby
# Good: Documented
# Converts all properties to their corresponding getter methods
# Example: { name: String } => { getName: () => String }
type ToGetters<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: () => T[K]
}
```

### 4. Combine with Conditional Types

```ruby
# Good: Smart transformations
type SmartNullable<T> = {
  [K in keyof T]: T[K] extends String | Integer
    ? T[K] | nil
    : T[K]
}
```

## Common Patterns

### Repository Pattern

```ruby
type Repository<T> = {
  find_by_id: (id: Integer) => T | nil,
  find_all: () => Array<T>,
  save: (entity: T) => T,
  update: (id: Integer, data: Partial<T>) => T | nil,
  delete: (id: Integer) => Bool
}

type CRUDHandlers<T> = {
  create: (data: Omit<T, "id">) => T,
  read: (id: Integer) => T | nil,
  update: (id: Integer, data: Partial<T>) => T | nil,
  delete: (id: Integer) => Bool
}
```

### State Management

```ruby
type State<T> = T

type Actions<T> = {
  [K in keyof T as `set${Capitalize<K>}`]: (value: T[K]) => void
} & {
  [K in keyof T as `get${Capitalize<K>}`]: () => T[K]
}

type Reducers<T> = {
  [K in keyof T]: (state: T[K], action: any) => T[K]
}
```

## Limitations

### Cannot Add New Properties

```ruby
# Cannot add properties not in the original type
type Extended<T> = {
  [K in keyof T]: T[K]
  # new_property: String  # Error: Cannot add new properties in mapped type
}

# Use intersection instead
type Extended<T> = T & { new_property: String }
```

### Key Type Restrictions

```ruby
# Keys must be String | Symbol | Integer
type ValidKeys = { [K in String]: any }     # OK
type InvalidKeys = { [K in User]: any }     # Error: User is not a valid key type
```

## Next Steps

Now that you understand mapped types, explore:

- [Utility Types](/docs/learn/advanced/utility-types) which are built using mapped types
- [Conditional Types](/docs/learn/advanced/conditional-types) to add logic to mappings
- [Type Aliases](/docs/learn/advanced/type-aliases) to name your mapped types
- [Generics](/docs/learn/generics/generic-functions-classes) to make mapped types reusable
