---
sidebar_position: 2
title: Intersection Types
description: Combining types with intersection
---

<DocsBadge />


# Intersection Types

:::caution Coming Soon
This feature is planned for a future release.
:::

Intersection types allow you to combine multiple types into one, creating a type that has all the properties and methods of each combined type. Think of intersection types as "AND" relationships—a value must satisfy all types in the intersection.

## Understanding Intersection Types

While union types represent "either-or" relationships (`A | B` means "A OR B"), intersection types represent "and" relationships (`A & B` means "A AND B").

### Union vs Intersection

```trb
# Union type: value can be String OR Integer
type StringOrInt = String | Integer
value1: StringOrInt = "hello"  # OK
value2: StringOrInt = 42       # OK

# Intersection type: value must have properties of BOTH types
type NamedAndAged = Named & Aged
# Must have both name (from Named) and age (from Aged)
```

## Basic Intersection Syntax

The intersection operator is `&`:

```trb
type Combined = TypeA & TypeB & TypeC
```

## Combining Interfaces

The most common use of intersection types is combining interfaces:

```trb
# Define individual interfaces
interface Named
  def name: String
end

interface Aged
  def age: Integer
end

interface Contactable
  def email: String
  def phone: String
end

# Combine interfaces with intersection
type Person = Named & Aged
type Employee = Named & Aged & Contactable

# A class implementing the intersection must implement all interfaces
class User
  implements Named, Aged

  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def name: String
    @name
  end

  def age: Integer
    @age
  end
end

# User can be used as Person type
user: Person = User.new("Alice", 30)
puts user.name  # OK: Named interface
puts user.age   # OK: Aged interface
```

## Mixing Types and Interfaces

You can combine interfaces with class types:

```trb
# Base class
class Entity
  @id: Integer

  def initialize(id: Integer): void
    @id = id
  end

  def id: Integer
    @id
  end
end

# Interface
interface Timestamped
  def created_at: Time
  def updated_at: Time
end

# Intersection of class and interface
type TimestampedEntity = Entity & Timestamped

# Implementation must extend Entity AND implement Timestamped
class User < Entity
  implements Timestamped

  @name: String
  @created_at: Time
  @updated_at: Time

  def initialize(id: Integer, name: String): void
    super(id)
    @name = name
    @created_at = Time.now
    @updated_at = Time.now
  end

  def created_at: Time
    @created_at
  end

  def updated_at: Time
    @updated_at
  end
end

# User satisfies the intersection type
user: TimestampedEntity = User.new(1, "Alice")
puts user.id          # From Entity class
puts user.created_at  # From Timestamped interface
```

## Practical Examples

### Mixins Pattern

Intersection types work well with Ruby's mixin concept:

```trb
# Define capability interfaces
interface Serializable
  def to_json: String
  def self.from_json(json: String): self
end

interface Validatable
  def valid?: Bool
  def errors: Array<String>
end

interface Persistable
  def save: Bool
  def delete: Bool
end

# Combine capabilities as needed
type Model = Serializable & Validatable & Persistable

# A full-featured model class
class Article
  implements Serializable, Validatable, Persistable

  @title: String
  @content: String
  @errors: Array<String>

  def initialize(title: String, content: String): void
    @title = title
    @content = content
    @errors = []
  end

  def to_json: String
    "{ \"title\": \"#{@title}\", \"content\": \"#{@content}\" }"
  end

  def self.from_json(json: String): Article
    # Parse JSON and create instance
    Article.new("Title", "Content")
  end

  def valid?: Bool
    @errors = []
    @errors.push("Title cannot be empty") if @title.empty?
    @errors.push("Content cannot be empty") if @content.empty?
    @errors.empty?
  end

  def errors: Array<String>
    @errors
  end

  def save: Bool
    return false unless valid?
    # Save to database
    true
  end

  def delete: Bool
    # Delete from database
    true
  end
end

# Article satisfies Model intersection type
article: Model = Article.new("Hello", "World")
puts article.to_json    # Serializable
puts article.valid?     # Validatable
article.save            # Persistable
```

### Repository Pattern

```trb
interface Identifiable
  def id: Integer | String
end

interface Timestamped
  def created_at: Time
  def updated_at: Time
end

interface SoftDeletable
  def deleted?: Bool
  def deleted_at: Time | nil
end

# Different combinations for different needs
type BaseEntity = Identifiable & Timestamped
type DeletableEntity = Identifiable & Timestamped & SoftDeletable

class Repository<T: BaseEntity>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def find(id: Integer | String): T | nil
    @items.find { |item| item.id == id }
  end

  def all: Array<T>
    @items.dup
  end

  def recent(limit: Integer = 10): Array<T>
    @items.sort_by { |item| item.created_at }.reverse.take(limit)
  end
end

class SoftDeleteRepository<T: DeletableEntity> < Repository<T>
  def all: Array<T>
    @items.reject { |item| item.deleted? }
  end

  def with_deleted: Array<T>
    @items.dup
  end

  def only_deleted: Array<T>
    @items.select { |item| item.deleted? }
  end
end
```

### Event System

```trb
interface Event
  def event_type: String
  def timestamp: Time
end

interface Cancellable
  def cancelled?: Bool
  def cancel: void
end

interface Prioritized
  def priority: Integer
end

# Different event types with different capabilities
type BasicEvent = Event
type CancellableEvent = Event & Cancellable
type PrioritizedCancellableEvent = Event & Cancellable & Prioritized

class UserClickEvent
  implements Event

  @event_type: String
  @timestamp: Time

  def initialize: void
    @event_type = "user_click"
    @timestamp = Time.now
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end
end

class NetworkRequestEvent
  implements Event, Cancellable

  @event_type: String
  @timestamp: Time
  @cancelled: Bool

  def initialize: void
    @event_type = "network_request"
    @timestamp = Time.now
    @cancelled = false
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end

  def cancelled?: Bool
    @cancelled
  end

  def cancel: void
    @cancelled = true
  end
end

class CriticalAlertEvent
  implements Event, Cancellable, Prioritized

  @event_type: String
  @timestamp: Time
  @cancelled: Bool
  @priority: Integer

  def initialize(priority: Integer): void
    @event_type = "critical_alert"
    @timestamp = Time.now
    @cancelled = false
    @priority = priority
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end

  def cancelled?: Bool
    @cancelled
  end

  def cancel: void
    @cancelled = true
  end

  def priority: Integer
    @priority
  end
end

# Event handlers for different event types
def handle_basic_event(event: BasicEvent): void
  puts "Event: #{event.event_type} at #{event.timestamp}"
end

def handle_cancellable_event(event: CancellableEvent): void
  if event.cancelled?
    puts "Event #{event.event_type} was cancelled"
  else
    puts "Processing #{event.event_type}"
  end
end

def handle_priority_event(event: PrioritizedCancellableEvent): void
  puts "Priority #{event.priority}: #{event.event_type}"
  event.cancel if event.priority < 5
end
```

## Intersection with Generics

Intersection types can be combined with generics:

```trb
# Generic type with intersection constraint
def process<T: Serializable & Validatable>(item: T): Bool
  if item.valid?
    json = item.to_json
    # Send to API
    true
  else
    puts "Validation errors: #{item.errors.join(', ')}"
    false
  end
end

# Collection that requires multiple capabilities
class ValidatedCollection<T: Identifiable & Validatable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): Bool
    if item.valid?
      @items.push(item)
      true
    else
      false
    end
  end

  def find(id: Integer | String): T | nil
    @items.find { |item| item.id == id }
  end

  def all_valid: Array<T>
    @items.select { |item| item.valid? }
  end

  def all_invalid: Array<T>
    @items.reject { |item| item.valid? }
  end
end
```

## Type Guards and Narrowing

Intersection types work with type narrowing:

```trb
interface Animal
  def speak: String
end

interface Swimmable
  def swim: void
end

interface Flyable
  def fly: void
end

type Duck = Animal & Swimmable & Flyable

class DuckImpl
  implements Animal, Swimmable, Flyable

  def speak: String
    "Quack!"
  end

  def swim: void
    puts "Swimming..."
  end

  def fly: void
    puts "Flying..."
  end
end

def test_duck(animal: Animal): void
  puts animal.speak

  # Type narrowing with responds_to?
  if animal.responds_to?(:swim) && animal.responds_to?(:fly)
    # Here animal is treated as Duck (Animal & Swimmable & Flyable)
    duck = animal as Duck
    duck.swim
    duck.fly
  end
end
```

## Conflicts and Resolution

When intersection types have conflicting members, the more specific type wins:

```trb
interface HasName
  def name: String
end

interface HasOptionalName
  def name: String | nil
end

# The intersection requires the more restrictive type
type Person = HasName & HasOptionalName
# person.name must be String (not String | nil)
# because String is more specific than String | nil

class User
  implements HasName, HasOptionalName

  @name: String

  def initialize(name: String): void
    @name = name
  end

  # Must return String to satisfy both interfaces
  def name: String
    @name
  end
end
```

## Best Practices

### 1. Compose Small, Focused Interfaces

```trb
# Good: Small, single-responsibility interfaces
interface Identifiable
  def id: Integer
end

interface Named
  def name: String
end

interface Timestamped
  def created_at: Time
end

type Entity = Identifiable & Named & Timestamped

# Less good: Large, monolithic interface
interface Entity
  def id: Integer
  def name: String
  def created_at: Time
  def updated_at: Time
  def save: Bool
  def delete: Bool
  # Too many responsibilities
end
```

### 2. Use Meaningful Names

```trb
# Good: Clear what the intersection represents
type AuditedEntity = Entity & Auditable
type SerializableModel = Model & Serializable

# Less good: Generic names
type TypeA = Interface1 & Interface2
type Combined = Foo & Bar
```

### 3. Don't Over-Complicate

```trb
# Good: Reasonable number of intersections
type FullModel = Identifiable & Timestamped & Validatable

# Potentially problematic: Too many intersections
type SuperType = A & B & C & D & E & F & G & H
# Hard to implement and understand
```

### 4. Document Intent

```trb
# Good: Comment explains why intersection is needed
# Represents entities that can be both serialized and cached
type CacheableEntity = Serializable & Identifiable

# Cache implementation
class Cache<T: CacheableEntity>
  @store: Hash<Integer | String, String>

  def set(entity: T): void
    @store[entity.id] = entity.to_json
  end

  def get(id: Integer | String): String | nil
    @store[id]
  end
end
```

## Common Patterns

### Builder Pattern

```trb
interface Buildable
  def build: self
end

interface Validatable
  def valid?: Bool
end

interface Resettable
  def reset: void
end

type CompleteBuilder = Buildable & Validatable & Resettable

class FormBuilder
  implements Buildable, Validatable, Resettable

  @fields: Hash<String, String>
  @errors: Array<String>

  def initialize: void
    @fields = {}
    @errors = []
  end

  def add_field(name: String, value: String): self
    @fields[name] = value
    self
  end

  def build: self
    self
  end

  def valid?: Bool
    @errors = []
    @errors.push("No fields") if @fields.empty?
    @errors.empty?
  end

  def reset: void
    @fields = {}
    @errors = []
  end
end
```

### State Machine

```trb
interface State
  def name: String
end

interface Transitionable
  def can_transition_to?(state: String): Bool
  def transition_to(state: String): void
end

interface Observable
  def on_enter: void
  def on_exit: void
end

type ManagedState = State & Transitionable & Observable

class WorkflowState
  implements State, Transitionable, Observable

  @name: String
  @allowed_transitions: Array<String>

  def initialize(name: String, allowed_transitions: Array<String>): void
    @name = name
    @allowed_transitions = allowed_transitions
  end

  def name: String
    @name
  end

  def can_transition_to?(state: String): Bool
    @allowed_transitions.include?(state)
  end

  def transition_to(state: String): void
    if can_transition_to?(state)
      on_exit
      # Perform transition
      on_enter
    else
      raise "Invalid transition from #{@name} to #{state}"
    end
  end

  def on_enter: void
    puts "Entering state: #{@name}"
  end

  def on_exit: void
    puts "Exiting state: #{@name}"
  end
end
```

## Limitations

### Cannot Intersect Primitive Types

```trb
# This doesn't make sense - a value can't be both String AND Integer
# type Impossible = String & Integer  # Would be empty type

# Intersection makes sense for structural types (interfaces, classes)
type Valid = Interface1 & Interface2
```

### Implementation Requirements

```trb
# When using intersection, implementation must satisfy ALL parts
type Complete = Interface1 & Interface2 & Interface3

class MyClass
  # Must implement ALL of: Interface1, Interface2, Interface3
  implements Interface1, Interface2, Interface3
  # ...
end
```

## Next Steps

Now that you understand intersection types, explore:

- [Union Types](/docs/learn/everyday-types/union-types) for "or" type relationships
- [Type Aliases](/docs/learn/advanced/type-aliases) for naming complex intersections
- [Interfaces](/docs/learn/interfaces/defining-interfaces) to create the building blocks for intersections
- [Conditional Types](/docs/learn/advanced/conditional-types) for types that depend on conditions
