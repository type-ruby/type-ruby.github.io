---
sidebar_position: 1
title: Parameter & Return Types
description: Typing function parameters and return values
---

<DocsBadge />


# Parameter & Return Types

Functions are the building blocks of any Ruby program. In T-Ruby, you can add type annotations to function parameters and return values to catch errors early and make your code more self-documenting.

## Basic Function Typing

The simplest way to add types to a function is to annotate its parameters and return value:

```trb title="greetings.trb"
def greet(name: String): String
  "Hello, #{name}!"
end

def add(x: Integer, y: Integer): Integer
  x + y
end

# Using the functions
puts greet("Alice")  # ✓ OK
puts add(5, 3)       # ✓ OK

# Type errors caught at compile time
greet(42)            # ✗ Error: Expected String, got Integer
add("5", "3")        # ✗ Error: Expected Integer, got String
```

The syntax follows this pattern:
- **Parameter types**: `parameter_name: Type`
- **Return type**: `: Type` after the parameter list

## Return Type Inference

T-Ruby can often infer the return type based on your function body, but it's good practice to be explicit:

```trb title="inference.trb"
# Return type explicitly annotated
def double(n: Integer): Integer
  n * 2
end

# Return type inferred (but less clear)
def triple(n: Integer)
  n * 3  # T-Ruby infers Integer return type
end

# Explicit is better - clearer for other developers
def quadruple(n: Integer): Integer
  n * 4
end
```

## Multiple Return Types with Union Types

Sometimes a function can return different types depending on the situation. Use union types:

```trb title="unions.trb"
def find_user(id: Integer): User | nil
  # Returns a User if found, or nil if not found
  users = load_users()
  users.find { |u| u.id == id }
end

def parse_value(input: String): Integer | Float | nil
  return nil if input.empty?

  if input.include?(".")
    input.to_f
  else
    input.to_i
  end
end

# Using the functions
user = find_user(123)
if user
  puts user.name  # T-Ruby knows user is not nil here
end

value = parse_value("3.14")
# value could be Integer, Float, or nil
```

## Void Functions

Functions that don't return a meaningful value use the `void` return type:

```trb title="void.trb"
def log_message(message: String): void
  puts "[LOG] #{message}"
  # No explicit return needed
end

def save_to_database(record: Record): void
  database.insert(record)
  # Side effect only, no return value
end

# These functions are called for their side effects
log_message("Application started")
save_to_database(user_record)
```

## Complex Parameter Types

Parameters can have any type, including arrays, hashes, and custom classes:

```trb title="complex.trb"
def process_names(names: Array<String>): Integer
  names.map(&:capitalize).length
end

def merge_configs(base: Hash<String, String>, override: Hash<String, String>): Hash<String, String>
  base.merge(override)
end

def send_email(user: User, message: EmailMessage): Boolean
  email_service.send(user.email, message)
end

# Using complex types
count = process_names(["alice", "bob", "charlie"])

config = merge_configs(
  { "host" => "localhost", "port" => "3000" },
  { "port" => "8080" }
)
```

## Multiple Parameters

Type each parameter individually:

```trb title="multiple_params.trb"
def create_user(
  name: String,
  email: String,
  age: Integer,
  admin: Boolean
): User
  User.new(
    name: name,
    email: email,
    age: age,
    admin: admin
  )
end

def calculate_price(
  base_price: Float,
  tax_rate: Float,
  discount: Float
): Float
  base_price * (1 + tax_rate) * (1 - discount)
end

# Calling with all parameters
user = create_user("Alice", "alice@example.com", 30, false)
price = calculate_price(100.0, 0.08, 0.10)
```

## Nilable Parameters

Use the `?` shorthand for parameters that can be nil:

```trb title="nilable.trb"
def format_name(first: String, middle: String?, last: String): String
  if middle
    "#{first} #{middle} #{last}"
  else
    "#{first} #{last}"
  end
end

def greet_with_title(name: String, title: String?): String
  if title
    "Hello, #{title} #{name}"
  else
    "Hello, #{name}"
  end
end

# Calling with and without optional values
full_name = format_name("John", "Q", "Public")
short_name = format_name("Jane", nil, "Doe")

greeting1 = greet_with_title("Smith", "Dr.")
greeting2 = greet_with_title("Jones", nil)
```

Note: `String?` is shorthand for `String | nil`.

## Boolean Return Types

Use `Boolean` for functions that return true/false:

```trb title="boolean.trb"
def is_valid_email(email: String): Boolean
  email.include?("@") && email.include?(".")
end

def has_permission(user: User, resource: String): Boolean
  user.permissions.include?(resource)
end

def is_adult(age: Integer): Boolean
  age >= 18
end

# Using boolean functions
if is_valid_email("user@example.com")
  puts "Email is valid"
end

can_edit = has_permission(current_user, "posts:edit")
```

## Generic Return Types

Functions can return generic types that preserve type information:

```trb title="generics.trb"
def first_element<T>(array: Array<T>): T | nil
  array.first
end

def wrap_in_array<T>(value: T): Array<T>
  [value]
end

# Type is preserved
numbers = [1, 2, 3]
first_num = first_element(numbers)  # Type: Integer | nil

strings = ["a", "b", "c"]
first_str = first_element(strings)  # Type: String | nil

wrapped = wrap_in_array(42)  # Type: Array<Integer>
```

## Practical Example: User Service

Here's a complete example showing function typing in a real-world scenario:

```trb title="user_service.trb"
class UserService
  def find_by_id(id: Integer): User | nil
    database.query("SELECT * FROM users WHERE id = ?", id).first
  end

  def find_by_email(email: String): User | nil
    database.query("SELECT * FROM users WHERE email = ?", email).first
  end

  def create(name: String, email: String, age: Integer): User
    user = User.new(name: name, email: email, age: age)
    database.insert(user)
    user
  end

  def update(id: Integer, attributes: Hash<String, String | Integer>): Boolean
    result = database.update("users", id, attributes)
    result.success?
  end

  def delete(id: Integer): void
    database.delete("users", id)
  end

  def list_all(): Array<User>
    database.query("SELECT * FROM users").map { |row| User.from_row(row) }
  end

  def count_users(): Integer
    database.query("SELECT COUNT(*) FROM users").first
  end

  def is_email_taken(email: String): Boolean
    find_by_email(email) != nil
  end
end

# Using the service
service = UserService.new

# Returns User | nil
user = service.find_by_id(123)

# Returns User
new_user = service.create("Alice", "alice@example.com", 30)

# Returns Boolean
updated = service.update(123, { "name" => "Bob", "age" => 31 })

# Returns void
service.delete(456)

# Returns Array<User>
all_users = service.list_all()

# Returns Integer
total = service.count_users()

# Returns Boolean
exists = service.is_email_taken("test@example.com")
```

## Best Practices

1. **Always annotate public APIs**: Functions that are part of your public interface should always have explicit type annotations.

2. **Be explicit with return types**: Even when T-Ruby can infer them, explicit return types serve as documentation.

3. **Use specific types**: Prefer `String` over `Object`, `Array<Integer>` over `Array`.

4. **Use union types for multiple return values**: `User | nil` is clearer than just returning any value.

5. **Use void for side-effect-only functions**: Makes it clear the function is called for its side effects, not its return value.

## Common Patterns

### Factory Functions

```trb title="factory.trb"
def create_admin_user(name: String, email: String): User
  User.new(name: name, email: email, role: "admin", permissions: ["all"])
end

def create_guest_user(): User
  User.new(name: "Guest", email: "guest@example.com", role: "guest", permissions: [])
end
```

### Converter Functions

```trb title="converters.trb"
def to_integer(value: String): Integer | nil
  Integer(value) rescue nil
end

def to_boolean(value: String): Boolean
  ["true", "yes", "1"].include?(value.downcase)
end

def to_array(value: String): Array<String>
  value.split(",").map(&:strip)
end
```

### Validator Functions

```trb title="validators.trb"
def validate_password(password: String): Boolean
  password.length >= 8 && password.match?(/[A-Z]/) && password.match?(/[0-9]/)
end

def validate_age(age: Integer): Boolean
  age >= 0 && age <= 150
end

def validate_email(email: String): Boolean
  email.match?(/\A[^@\s]+@[^@\s]+\z/)
end
```

## Summary

Function parameter and return type annotations are fundamental to T-Ruby. They:

- Catch type errors at compile time
- Serve as documentation for your code
- Enable better IDE support with autocomplete and refactoring
- Make your code more maintainable

Start by adding types to your function signatures, and you'll immediately benefit from T-Ruby's type checking capabilities.
