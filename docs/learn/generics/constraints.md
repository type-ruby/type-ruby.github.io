---
sidebar_position: 2
title: Constraints
description: Constraining generic type parameters
---

# Constraints

While generics allow you to write code that works with any type, sometimes you need to ensure that the types used have certain properties or capabilities. Constraints let you restrict generic type parameters to types that meet specific requirements, giving you access to their methods and properties while maintaining type safety.

## Why Constraints?

Without constraints, generic code can only perform operations that work on all types. Constraints allow you to:

1. Access specific methods or properties on generic types
2. Ensure types implement certain interfaces
3. Require types to extend specific classes
4. Combine multiple requirements

### The Problem: Unconstrained Generics

```ruby
# Without constraints, you can't use type-specific methods
def print_length<T>(value: T): void
  puts value.length  # Error: T might not have a length method
end

# Without constraints, you can't rely on specific behavior
def compare<T>(a: T, b: T): Integer
  a <=> b  # Error: T might not be comparable
end
```

### The Solution: With Constraints

```ruby
# Constrain T to types that have a length method
def print_length<T: Lengthable>(value: T): void
  puts value.length  # OK: T is guaranteed to have length
end

# Constrain T to comparable types
def compare<T: Comparable>(a: T, b: T): Integer
  a <=> b  # OK: T is guaranteed to support <=>
end
```

## Basic Constraint Syntax

Constraints are specified using a colon (`:`) after the type parameter:

```ruby
# Single constraint
def process<T: Interface>(value: T): void
  # T must implement Interface
end

# Multiple type parameters with constraints
def merge<K: Hashable, V: Serializable>(key: K, value: V): Hash<K, V>
  # K must be Hashable, V must be Serializable
end
```

## Interface Constraints

The most common constraint is requiring a type to implement an interface.

### Defining an Interface for Constraints

```ruby
# Define an interface
interface Printable
  def to_s: String
end

# Constrain T to types that implement Printable
def print_items<T: Printable>(items: Array<T>): void
  items.each do |item|
    puts item.to_s  # Safe: T is guaranteed to have to_s
  end
end

# Usage
class User
  implements Printable

  @name: String

  def initialize(name: String): void
    @name = name
  end

  def to_s: String
    "User: #{@name}"
  end
end

users = [User.new("Alice"), User.new("Bob")]
print_items(users)  # OK: User implements Printable
```

### Common Interface Constraints

```ruby
# Comparable interface
interface Comparable
  def <=>(other: self): Integer
end

def max<T: Comparable>(a: T, b: T): T
  a <=> b > 0 ? a : b
end

# Numeric interface
interface Numeric
  def +(other: self): self
  def -(other: self): self
  def *(other: self): self
  def /(other: self): self
end

def average<T: Numeric>(numbers: Array<T>): T
  sum = numbers.reduce { |acc, n| acc + n }
  sum / numbers.length
end

# Enumerable interface
interface Enumerable<T>
  def each(&block: Proc<T, void>): void
  def map<U>(&block: Proc<T, U>): Array<U>
end

def count_items<T, C: Enumerable<T>>(collection: C): Integer
  counter = 0
  collection.each { |_| counter += 1 }
  counter
end
```

## Class Constraints

You can constrain a type parameter to be a specific class or a subclass of it.

```ruby
# Constrain to a specific class
class Animal
  @name: String

  def initialize(name: String): void
    @name = name
  end

  def speak: String
    "Some sound"
  end
end

class Dog < Animal
  def speak: String
    "Woof!"
  end
end

class Cat < Animal
  def speak: String
    "Meow!"
  end
end

# T must be Animal or a subclass of Animal
def make_speak<T: Animal>(animal: T): void
  puts animal.speak  # Safe: Animal has speak method
end

# Usage
dog = Dog.new("Buddy")
cat = Cat.new("Whiskers")

make_speak(dog)  # OK: Dog is an Animal
make_speak(cat)  # OK: Cat is an Animal
make_speak("string")  # Error: String is not an Animal
```

### Working with Class Hierarchies

```ruby
class Vehicle
  @brand: String

  def initialize(brand: String): void
    @brand = brand
  end

  def brand: String
    @brand
  end
end

class Car < Vehicle
  @doors: Integer

  def initialize(brand: String, doors: Integer): void
    super(brand)
    @doors = doors
  end

  def doors: Integer
    @doors
  end
end

# Repository that works with any Vehicle subclass
class Repository<T: Vehicle>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): void
    @items.push(item)
  end

  def find_by_brand(brand: String): T | nil
    @items.find { |item| item.brand == brand }
  end

  def all: Array<T>
    @items.dup
  end
end

# Usage
car_repo = Repository<Car>.new
car_repo.add(Car.new("Toyota", 4))
car_repo.add(Car.new("Honda", 2))

found = car_repo.find_by_brand("Toyota")  # Car | nil
```

## Multiple Constraints

:::caution Coming Soon
This feature is planned for a future release.
:::

In the future, T-Ruby will support multiple constraints using the `&` operator:

```ruby
# Type must implement both interfaces
def process<T: Printable & Comparable>(value: T): void
  puts value.to_s
  # Can use methods from both interfaces
end

# Type must extend class and implement interface
def save<T: Entity & Serializable>(entity: T): void
  # Can use methods from Entity class and Serializable interface
end
```

## Union Type Constraints

You can constrain a type to be one of several specific types using union types:

```ruby
# T must be either String or Integer
def format<T: String | Integer>(value: T): String
  case value
  when String
    "String: #{value}"
  when Integer
    "Number: #{value}"
  end
end

format("hello")  # OK
format(42)       # OK
format(3.14)     # Error: Float is not String | Integer
```

### Practical Union Constraint Example

```ruby
# A flexible ID type
type StringOrInt = String | Integer

def find_user<T: StringOrInt>(id: T): User | nil
  case id
  when String
    User.find_by_username(id)
  when Integer
    User.find_by_id(id)
  end
end

# Both work
user1 = find_user(123)        # Find by integer ID
user2 = find_user("alice")    # Find by username string
```

## Constrained Generic Classes

Generic classes can have constrained type parameters:

```ruby
# Queue that only works with comparable items
class PriorityQueue<T: Comparable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def enqueue(item: T): void
    @items.push(item)
    @items.sort! { |a, b| b <=> a }  # Highest priority first
  end

  def dequeue: T | nil
    @items.shift
  end

  def peek: T | nil
    @items.first
  end
end

# Works with any comparable type
class Task
  implements Comparable

  @priority: Integer
  @name: String

  def initialize(name: String, priority: Integer): void
    @name = name
    @priority = priority
  end

  def <=>(other: Task): Integer
    @priority <=> other.priority
  end
end

queue = PriorityQueue<Task>.new
queue.enqueue(Task.new("Low priority", 1))
queue.enqueue(Task.new("High priority", 10))
queue.enqueue(Task.new("Medium priority", 5))

# Dequeues in priority order: High -> Medium -> Low
```

### Generic Class with Multiple Constrained Parameters

```ruby
# Map that requires hashable keys and serializable values
interface Hashable
  def hash: Integer
  def ==(other: self): Bool
end

interface Serializable
  def to_json: String
  def self.from_json(json: String): self
end

class SerializableMap<K: Hashable, V: Serializable>
  @data: Hash<K, V>

  def initialize: void
    @data = {}
  end

  def set(key: K, value: V): void
    @data[key] = value
  end

  def get(key: K): V | nil
    @data[key]
  end

  def to_json: String
    pairs = @data.map { |k, v| "#{k.hash}: #{v.to_json}" }
    "{ #{pairs.join(', ')} }"
  end
end
```

## Constraints with Default Types

You can provide default types for generic parameters with constraints:

```ruby
# Default to String if not specified
class Cache<K: Hashable = String, V = Any>
  @data: Hash<K, V>

  def initialize: void
    @data = {}
  end

  def set(key: K, value: V): void
    @data[key] = value
  end

  def get(key: K): V | nil
    @data[key]
  end
end

# Uses default: Cache<String, Any>
cache1 = Cache.new
cache1.set("key", "value")

# Explicit types
cache2 = Cache<Integer, User>.new
cache2.set(1, User.new("Alice"))
```

## Practical Examples

### Sortable Collection

```ruby
interface Comparable
  def <=>(other: self): Integer
end

class SortedList<T: Comparable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): void
    @items.push(item)
    @items.sort! { |a, b| a <=> b }
  end

  def remove(item: T): Bool
    if index = @items.index(item)
      @items.delete_at(index)
      true
    else
      false
    end
  end

  def first: T | nil
    @items.first
  end

  def last: T | nil
    @items.last
  end

  def to_a: Array<T>
    @items.dup
  end
end

# Usage with integers (naturally comparable)
numbers = SortedList<Integer>.new
numbers.add(5)
numbers.add(2)
numbers.add(8)
numbers.add(1)
puts numbers.to_a  # [1, 2, 5, 8] - always sorted
```

### Repository Pattern with Constraints

```ruby
# Base entity class
class Entity
  @id: Integer

  def initialize(id: Integer): void
    @id = id
  end

  def id: Integer
    @id
  end
end

# Generic repository constrained to Entity subclasses
class Repository<T: Entity>
  @items: Hash<Integer, T>

  def initialize: void
    @items = {}
  end

  def save(entity: T): void
    @items[entity.id] = entity
  end

  def find(id: Integer): T | nil
    @items[id]
  end

  def all: Array<T>
    @items.values
  end

  def delete(id: Integer): Bool
    !!@items.delete(id)
  end
end

# Domain models
class User < Entity
  @name: String
  @email: String

  def initialize(id: Integer, name: String, email: String): void
    super(id)
    @name = name
    @email = email
  end

  def name: String
    @name
  end
end

class Product < Entity
  @title: String
  @price: Float

  def initialize(id: Integer, title: String, price: Float): void
    super(id)
    @title = title
    @price = price
  end

  def title: String
    @title
  end
end

# Usage
user_repo = Repository<User>.new
user_repo.save(User.new(1, "Alice", "alice@example.com"))
user_repo.save(User.new(2, "Bob", "bob@example.com"))

product_repo = Repository<Product>.new
product_repo.save(Product.new(1, "Laptop", 999.99))

found_user = user_repo.find(1)  # User | nil
all_products = product_repo.all  # Array<Product>
```

### Builder Pattern with Constraints

```ruby
interface Buildable
  def build: self
end

class Builder<T: Buildable>
  @instance: T

  def initialize(instance: T): void
    @instance = instance
  end

  def build: T
    @instance.build
  end
end

class QueryBuilder
  implements Buildable

  @table: String
  @conditions: Array<String>

  def initialize(table: String): void
    @table = table
    @conditions = []
  end

  def where(condition: String): self
    @conditions.push(condition)
    self
  end

  def build: self
    # In real implementation, would create SQL query
    self
  end

  def to_sql: String
    sql = "SELECT * FROM #{@table}"
    unless @conditions.empty?
      sql += " WHERE #{@conditions.join(' AND ')}"
    end
    sql
  end
end

# Usage
query = Builder.new(QueryBuilder.new("users"))
  .build
  .where("age > 18")
  .where("active = true")

puts query.to_sql
# SELECT * FROM users WHERE age > 18 AND active = true
```

## Type Inference with Constraints

T-Ruby can infer constrained types from usage:

```ruby
def sort_and_first<T: Comparable>(items: Array<T>): T | nil
  sorted = items.sort { |a, b| a <=> b }
  sorted.first
end

# Type inferred as Integer (which is Comparable)
numbers = [3, 1, 4, 1, 5]
first = sort_and_first(numbers)  # Integer | nil

# Type inferred as String (which is Comparable)
words = ["zebra", "apple", "mango"]
first_word = sort_and_first(words)  # String | nil
```

## Best Practices

### 1. Use the Least Restrictive Constraint

```ruby
# Good: Only requires what's needed
def print_all<T: Printable>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end

# Less good: Too restrictive
def print_all<T: User>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end
```

### 2. Create Small, Focused Interfaces for Constraints

```ruby
# Good: Small, focused interfaces
interface Identifiable
  def id: Integer
end

interface Timestamped
  def created_at: Time
  def updated_at: Time
end

def find_by_id<T: Identifiable>(items: Array<T>, id: Integer): T | nil
  items.find { |item| item.id == id }
end

# Less good: Large, monolithic interface
interface Model
  def id: Integer
  def save: void
  def delete: void
  def created_at: Time
  def updated_at: Time
  # Too many methods - hard to implement
end
```

### 3. Document Constraint Requirements

```ruby
# Good: Clear documentation
# Processes items that can be converted to strings
# @param items [Array<T>] Array of printable items
# @return [void]
def log_items<T: Printable>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end
```

## Common Constraint Patterns

### Identity Constraint

```ruby
interface Identifiable
  def id: Integer | String
end

def find_duplicates<T: Identifiable>(items: Array<T>): Array<T>
  seen = {}
  duplicates = []

  items.each do |item|
    if seen[item.id]
      duplicates.push(item)
    else
      seen[item.id] = true
    end
  end

  duplicates
end
```

### Validation Constraint

```ruby
interface Validatable
  def valid?: Bool
  def errors: Array<String>
end

def save_if_valid<T: Validatable>(item: T): Bool
  if item.valid?
    # Save logic here
    true
  else
    puts "Validation errors: #{item.errors.join(', ')}"
    false
  end
end
```

### Conversion Constraint

```ruby
interface Convertible<T>
  def convert: T
end

def batch_convert<S: Convertible<T>, T>(items: Array<S>): Array<T>
  items.map { |item| item.convert }
end
```

## Next Steps

Now that you understand constraints, explore:

- [Built-in Generics](/docs/learn/generics/built-in-generics) to see how constraints work with `Array<T>`, `Hash<K, V>`, and other built-in types
- [Interfaces](/docs/learn/interfaces/defining-interfaces) to create interfaces for use as constraints
- [Advanced Types](/docs/learn/advanced/type-aliases) for more complex type patterns
