---
sidebar_position: 5
title: Utility Types
description: Built-in utility types for common transformations
---

<DocsBadge />


# Utility Types

:::caution Coming Soon
This feature is planned for a future release.
:::

Utility types are pre-built generic types that perform common type transformations. They're like a standard library for types, providing ready-to-use solutions for everyday type manipulation tasks. Understanding these utilities will make your T-Ruby code more concise and expressive.

## Property Modifiers

### Partial\<T\>

Makes all properties of a type optional:

```trb
type Partial<T> = {
  [K in keyof T]?: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  age: Integer
}

type PartialUser = Partial<User>
# {
#   id?: Integer,
#   name?: String,
#   email?: String,
#   age?: Integer
# }

# Usage - update functions often use Partial
def update_user(id: Integer, updates: Partial<User>): User
  user = find_user(id)
  # Apply only the provided updates
  user.name = updates[:name] if updates[:name]
  user.email = updates[:email] if updates[:email]
  user.age = updates[:age] if updates[:age]
  user
end

# Can provide any subset of properties
update_user(1, { name: "Alice" })
update_user(1, { name: "Bob", email: "bob@example.com" })
update_user(1, {})  # Valid, no updates
```

### Required\<T\>

Makes all properties required (removes optionality):

```trb
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

# Usage - ensure all fields are present
def create_user(data: Required<UserUpdate>): User
  # All fields guaranteed to be present
  User.new(data[:id], data[:name], data[:email])
end
```

### Readonly\<T\>

Makes all properties readonly:

```trb
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type ReadonlyUser = Readonly<User>

# Usage - prevent modifications
def display_user(user: ReadonlyUser): void
  puts "User: #{user.name}"
  # user.name = "Changed"  # Error: Cannot modify readonly property
end

# Common pattern: freeze configuration
type Config = Readonly<{
  api_url: String,
  timeout: Integer,
  max_retries: Integer
}>

config: Config = {
  api_url: "https://api.example.com",
  timeout: 30,
  max_retries: 3
}
```

## Property Selection

### Pick\<T, K\>

Creates a type by picking specific properties from another type:

```trb
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String,
  created_at: Time,
  updated_at: Time
}

# Pick only public fields
type PublicUser = Pick<User, "id" | "name" | "email">
# {
#   id: Integer,
#   name: String,
#   email: String
# }

# Pick authentication fields
type AuthUser = Pick<User, "id" | "email" | "password">
# {
#   id: Integer,
#   email: String,
#   password: String
# }

# Usage
def get_public_user(user: User): PublicUser
  {
    id: user.id,
    name: user.name,
    email: user.email
  }
end
```

### Omit\<T, K\>

Creates a type by omitting specific properties from another type:

```trb
type Omit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String,
  created_at: Time,
  updated_at: Time
}

# Omit sensitive data
type SafeUser = Omit<User, "password">
# {
#   id: Integer,
#   name: String,
#   email: String,
#   created_at: Time,
#   updated_at: Time
# }

# Omit generated fields for creation
type UserInput = Omit<User, "id" | "created_at" | "updated_at">
# {
#   name: String,
#   email: String,
#   password: String
# }

# Usage
def create_user(input: UserInput): User
  User.new(
    id: generate_id(),
    name: input[:name],
    email: input[:email],
    password: hash_password(input[:password]),
    created_at: Time.now,
    updated_at: Time.now
  )
end
```

## Union and Intersection Operations

### Exclude\<T, U\>

Excludes types from a union:

```trb
type Exclude<T, U> = T extends U ? never : T

type AllTypes = String | Integer | Float | Bool
type NumericOnly = Exclude<AllTypes, String | Bool>
# Integer | Float

type Status = "pending" | "approved" | "rejected" | "cancelled"
type ActiveStatus = Exclude<Status, "cancelled">
# "pending" | "approved" | "rejected"

# Usage
def process_active_order(status: ActiveStatus): void
  case status
  when "pending"
    puts "Processing pending order"
  when "approved"
    puts "Shipping approved order"
  when "rejected"
    puts "Handling rejected order"
  # "cancelled" is not possible here
  end
end
```

### Extract\<T, U\>

Extracts types from a union:

```trb
type Extract<T, U> = T extends U ? T : never

type AllTypes = String | Integer | Float | Bool
type NumericOnly = Extract<AllTypes, Integer | Float>
# Integer | Float

type Status = "pending" | "approved" | "rejected" | "cancelled"
type FinalStatus = Extract<Status, "approved" | "rejected" | "cancelled">
# "approved" | "rejected" | "cancelled"

# Usage
def finalize_order(status: FinalStatus): void
  # Only final statuses allowed
  puts "Order is in final state: #{status}"
end
```

### NonNullable\<T\>

Removes `nil` from a type:

```trb
type NonNullable<T> = T extends nil ? never : T

type MaybeString = String | nil
type DefiniteString = NonNullable<MaybeString>
# String

type MixedTypes = String | Integer | nil | Float | nil
type WithoutNil = NonNullable<MixedTypes>
# String | Integer | Float

# Usage
def process_value<T>(value: T | nil): NonNullable<T>
  raise "Value cannot be nil" if value.nil?
  value  # Type narrowed to T (without nil)
end
```

## Function Types

### ReturnType\<T\>

Extracts the return type of a function type:

```trb
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

type GetUserFn = Proc<Integer, User>
type UserType = ReturnType<GetUserFn>
# User

type CalculateFn = Proc<Integer, Integer, Float>
type ResultType = ReturnType<CalculateFn>
# Float

# Usage - infer return type from function
def wrap_function<F>(fn: F): Proc<any, ReturnType<F>>
  ->(args: any): ReturnType<F> {
    result = fn.call(args)
    puts "Function returned: #{result}"
    result
  }
end
```

### Parameters\<T\>

Extracts parameter types from a function type:

```trb
type Parameters<T> = T extends Proc<infer P, any> ? P : never

type GetUserFn = Proc<Integer, User>
type GetUserParams = Parameters<GetUserFn>
# Integer

type CreateUserFn = Proc<String, String, Integer, User>
type CreateUserParams = Parameters<CreateUserFn>
# [String, String, Integer]

# Usage
def call_with_logging<F>(fn: F, ...args: Parameters<F>): ReturnType<F>
  puts "Calling function with args: #{args}"
  result = fn.call(*args)
  puts "Function returned: #{result}"
  result
end
```

## Record Types

### Record\<K, V\>

Creates a type with keys of type K and values of type V:

```trb
type Record<K extends String | Symbol | Integer, V> = {
  [P in K]: V
}

# String keys, Integer values
type StringToInt = Record<String, Integer>
# { [key: String]: Integer }

# Specific string literal keys
type StatusMap = Record<"pending" | "approved" | "rejected", Bool>
# {
#   pending: Bool,
#   approved: Bool,
#   rejected: Bool
# }

# Usage examples
status_flags: StatusMap = {
  pending: true,
  approved: false,
  rejected: false
}

# User ID to User mapping
user_cache: Record<Integer, User> = {
  1 => User.new(1, "Alice"),
  2 => User.new(2, "Bob")
}

# Configuration by environment
configs: Record<"development" | "staging" | "production", Config> = {
  development: dev_config,
  staging: staging_config,
  production: prod_config
}
```

## Array and Tuple Utilities

### ArrayElement\<T\>

Extracts the element type from an array:

```trb
type ArrayElement<T> = T extends Array<infer E> ? E : never

type StringArray = Array<String>
type StringElement = ArrayElement<StringArray>
# String

type UserArray = Array<User>
type UserElement = ArrayElement<UserArray>
# User

# Usage
def first_element<T>(arr: Array<T>): ArrayElement<Array<T>> | nil
  arr.first
end
```

### ReadonlyArray\<T\>

An array whose elements cannot be modified:

```trb
type ReadonlyArray<T> = readonly Array<T>

# Usage
def process_items(items: ReadonlyArray<String>): void
  items.each { |item| puts item }
  # items.push("new")  # Error: Cannot modify readonly array
  # items[0] = "changed"  # Error: Cannot modify readonly array
end

# Useful for constants
ALLOWED_STATUSES: ReadonlyArray<String> = ["pending", "approved", "rejected"]
```

## Practical Utility Types

### DeepPartial\<T\>

Makes all properties and nested properties optional:

```trb
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Hash<any, any>
    ? DeepPartial<T[K]>
    : T[K]
}

type User = {
  id: Integer,
  profile: {
    name: String,
    email: String,
    settings: {
      theme: String,
      notifications: Bool
    }
  }
}

type DeepPartialUser = DeepPartial<User>
# All properties at all levels are optional

# Usage - deep updates
def deep_update_user(id: Integer, updates: DeepPartial<User>): User
  user = find_user(id)
  # Can update any nested property
  user.profile.name = updates[:profile][:name] if updates[:profile]&.[](:name)
  user.profile.settings.theme = updates[:profile][:settings][:theme] if updates[:profile][:settings]&.[](:theme)
  user
end
```

### DeepReadonly\<T\>

Makes all properties and nested properties readonly:

```trb
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Hash<any, any>
    ? DeepReadonly<T[K]>
    : T[K]
}

type Config = {
  app: {
    name: String,
    version: String,
    features: {
      auth: Bool,
      api: Bool
    }
  }
}

type ImmutableConfig = DeepReadonly<Config>
# All nested properties are readonly

config: ImmutableConfig = load_config()
# config.app.name = "New"  # Error: readonly
# config.app.features.auth = false  # Error: readonly
```

### Mutable\<T\>

Removes readonly modifiers:

```trb
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type ReadonlyUser = {
  readonly id: Integer,
  readonly name: String
}

type MutableUser = Mutable<ReadonlyUser>
# {
#   id: Integer,
#   name: String
# }

# Usage - create mutable copy
def clone_user(user: ReadonlyUser): MutableUser
  {
    id: user.id,
    name: user.name
  }
end
```

## Composition Utilities

### Merge\<T, U\>

Merges two types, with U's properties overriding T's:

```trb
type Merge<T, U> = Omit<T, keyof U> & U

type User = {
  id: Integer,
  name: String,
  email: String
}

type UserUpdate = {
  email: String | nil,  # Allow null
  updated_at: Time      # New property
}

type MergedUser = Merge<User, UserUpdate>
# {
#   id: Integer,
#   name: String,
#   email: String | nil,    # Overridden
#   updated_at: Time        # Added
# }
```

### Intersection\<T, U\>

Gets properties that exist in both types:

```trb
type Intersection<T, U> = Pick<T, Extract<keyof T, keyof U>>

type User = {
  id: Integer,
  name: String,
  email: String
}

type Person = {
  name: String,
  email: String,
  age: Integer
}

type Common = Intersection<User, Person>
# {
#   name: String,
#   email: String
# }
```

### Difference\<T, U\>

Gets properties that exist in T but not in U:

```trb
type Difference<T, U> = Omit<T, keyof U>

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type PublicFields = {
  id: Integer,
  name: String
}

type PrivateFields = Difference<User, PublicFields>
# {
#   email: String,
#   password: String
# }
```

## Conditional Utilities

### If\<Condition, Then, Else\>

Type-level if-else:

```trb
type If<Condition extends Bool, Then, Else> =
  Condition extends true ? Then : Else

# Usage
type IsProduction<Env> = If<
  Env extends "production",
  { debug: false, logging: :error },
  { debug: true, logging: :debug }
>

type ProdConfig = IsProduction<"production">
# { debug: false, logging: :error }

type DevConfig = IsProduction<"development">
# { debug: true, logging: :debug }
```

### Nullable\<T\>

Makes a type nullable:

```trb
type Nullable<T> = T | nil

type User = { id: Integer, name: String }
type MaybeUser = Nullable<User>
# User | nil

# Usage in functions
def find_user(id: Integer): Nullable<User>
  # May return nil if not found
end
```

### Promisify\<T\>

Wraps return types in promises (for async operations):

```trb
type Promisify<T> = {
  [K in keyof T]: T[K] extends Proc<infer Args, infer R>
    ? Proc<Args, Promise<R>>
    : T[K]
}

type UserService = {
  find: Proc<Integer, User>,
  create: Proc<String, String, User>,
  delete: Proc<Integer, Bool>
}

type AsyncUserService = Promisify<UserService>
# {
#   find: Proc<Integer, Promise<User>>,
#   create: Proc<String, String, Promise<User>>,
#   delete: Proc<Integer, Promise<Bool>>
# }
```

## Real-World Examples

### API Response Types

```trb
type APIResponse<T> = {
  success: true,
  data: T
} | {
  success: false,
  error: String,
  code: Integer
}

# Usage
def fetch_user(id: Integer): APIResponse<User>
  begin
    user = find_user(id)
    { success: true, data: user }
  rescue => e
    { success: false, error: e.message, code: 500 }
  end
end

# Handle response
response = fetch_user(1)
if response[:success]
  user = response[:data]  # Type is User
  puts user.name
else
  error = response[:error]  # Type is String
  puts "Error: #{error}"
end
```

### Form State Management

```trb
type FormState<T> = {
  values: T,
  errors: Partial<Record<keyof T, String>>,
  touched: Partial<Record<keyof T, Bool>>,
  dirty: Bool,
  valid: Bool
}

type LoginForm = {
  username: String,
  password: String
}

type LoginFormState = FormState<LoginForm>
# {
#   values: { username: String, password: String },
#   errors: { username?: String, password?: String },
#   touched: { username?: Bool, password?: Bool },
#   dirty: Bool,
#   valid: Bool
# }
```

### Repository Pattern

```trb
type Repository<T> = {
  find: Proc<Integer, Nullable<T>>,
  find_all: Proc<Array<T>>,
  create: Proc<Omit<T, "id">, T>,
  update: Proc<Integer, Partial<T>, Nullable<T>>,
  delete: Proc<Integer, Bool>
}

type User = {
  id: Integer,
  name: String,
  email: String
}

# Automatically typed repository
user_repository: Repository<User> = create_repository(User)

# Usage with proper types
new_user = user_repository.create({ name: "Alice", email: "alice@example.com" })
updated = user_repository.update(1, { name: "Alice Smith" })
```

## Best Practices

### 1. Compose Utilities

```trb
# Good: Build complex types from utilities
type SafeUserUpdate = Partial<Omit<Required<User>, "id" | "created_at">>

# Less good: Custom mapped type when utilities exist
type SafeUserUpdate = {
  [K in Exclude<keyof User, "id" | "created_at">]?: User[K]
}
```

### 2. Create Domain-Specific Utilities

```trb
# Good: Custom utilities for your domain
type Entity<T> = T & { id: Integer }
type Timestamped<T> = T & { created_at: Time, updated_at: Time }
type SoftDeletable<T> = T & { deleted_at: Nullable<Time> }

type FullEntity<T> = Entity<Timestamped<SoftDeletable<T>>>

# Usage
type User = FullEntity<{ name: String, email: String }>
```

### 3. Document Complex Utilities

```trb
# Good: Clear documentation
# Creates a type-safe form state for any model
# Includes validation errors and touched state tracking
type FormState<T> = {
  values: T,
  errors: Partial<Record<keyof T, String>>,
  touched: Partial<Record<keyof T, Bool>>,
  submitting: Bool
}
```

## Next Steps

Now that you understand utility types, you can:

- Apply them in [Type Aliases](/docs/learn/advanced/type-aliases) to create domain-specific types
- Combine them with [Generics](/docs/learn/generics/generic-functions-classes) for flexible, reusable code
- Use them with [Mapped Types](/docs/learn/advanced/mapped-types) to create custom transformations
- Leverage them in [Conditional Types](/docs/learn/advanced/conditional-types) for advanced type logic
