---
sidebar_position: 3
title: Inheritance & Mixins
description: Type-safe inheritance and module mixins
---

<DocsBadge />


# Inheritance & Mixins

Inheritance and mixins are powerful features of Ruby's object-oriented programming. T-Ruby extends these concepts with type safety, allowing you to build complex class hierarchies and share functionality through modules while maintaining strong type guarantees.

## Basic Inheritance

Classes can inherit from parent classes, gaining access to their methods and instance variables:

```trb title="basic_inheritance.trb"
class Animal
  attr_accessor :name: String
  attr_accessor :age: Integer

  def initialize(name: String, age: Integer)
    @name = name
    @age = age
  end

  def speak(): String
    "Some sound"
  end

  def info(): String
    "#{@name} is #{@age} years old"
  end
end

class Dog < Animal
  attr_accessor :breed: String

  def initialize(name: String, age: Integer, breed: String)
    super(name, age)
    @breed = breed
  end

  def speak(): String
    "Woof!"
  end

  def fetch(item: String): String
    "#{@name} fetched the #{item}"
  end
end

class Cat < Animal
  def speak(): String
    "Meow!"
  end

  def scratch(): void
    puts "#{@name} is scratching"
  end
end

# Usage
dog = Dog.new("Buddy", 5, "Golden Retriever")
puts dog.speak()      # "Woof!"
puts dog.info()       # "Buddy is 5 years old"
puts dog.fetch("ball") # "Buddy fetched the ball"

cat = Cat.new("Whiskers", 3)
puts cat.speak()      # "Meow!"
cat.scratch()
```

## Method Overriding

Child classes can override parent methods with the same signature:

```trb title="override.trb"
class Shape
  def initialize()
    @sides: Integer = 0
  end

  def area(): Float
    0.0
  end

  def perimeter(): Float
    0.0
  end

  def describe(): String
    "A shape with #{@sides} sides"
  end
end

class Rectangle < Shape
  attr_accessor :width: Float
  attr_accessor :height: Float

  def initialize(width: Float, height: Float)
    super()
    @width = width
    @height = height
    @sides = 4
  end

  def area(): Float
    @width * @height
  end

  def perimeter(): Float
    2 * (@width + @height)
  end

  def describe(): String
    "Rectangle: #{@width} x #{@height}"
  end
end

class Circle < Shape
  attr_accessor :radius: Float

  def initialize(radius: Float)
    super()
    @radius = radius
    @sides = 0  # Infinite sides technically
  end

  def area(): Float
    3.14159 * @radius * @radius
  end

  def perimeter(): Float
    2 * 3.14159 * @radius
  end

  def describe(): String
    "Circle with radius #{@radius}"
  end
end

# Usage
rect = Rectangle.new(10.0, 5.0)
puts rect.area()       # 50.0
puts rect.perimeter()  # 30.0
puts rect.describe()   # "Rectangle: 10.0 x 5.0"

circle = Circle.new(5.0)
puts circle.area()     # 78.53975
```

## Super Keyword

Use `super` to call parent class methods:

```trb title="super.trb"
class Employee
  attr_accessor :name: String
  attr_accessor :salary: Float

  def initialize(name: String, salary: Float)
    @name = name
    @salary = salary
  end

  def annual_bonus(): Float
    @salary * 0.1
  end

  def total_compensation(): Float
    @salary + annual_bonus()
  end
end

class Manager < Employee
  attr_accessor :team_size: Integer

  def initialize(name: String, salary: Float, team_size: Integer)
    super(name, salary)
    @team_size = team_size
  end

  # Override: Managers get better bonuses
  def annual_bonus(): Float
    base_bonus = super()
    base_bonus + (@team_size * 1000.0)
  end

  def team_bonus(): Float
    @team_size * 500.0
  end

  # Override to include team bonus
  def total_compensation(): Float
    super() + team_bonus()
  end
end

# Usage
employee = Employee.new("Alice", 50000.0)
puts employee.total_compensation()  # 55000.0

manager = Manager.new("Bob", 80000.0, 5)
puts manager.annual_bonus()         # 8000.0 + 5000.0 = 13000.0
puts manager.total_compensation()   # 80000.0 + 13000.0 + 2500.0 = 95500.0
```

## Modules and Mixins

Modules allow you to share functionality across multiple classes:

```trb title="modules.trb"
module Timestampable
  def created_at(): Time?
    @created_at
  end

  def updated_at(): Time?
    @updated_at
  end

  def touch(): void
    @updated_at = Time.now
  end

  def set_created(): void
    @created_at = Time.now
    @updated_at = Time.now
  end
end

module Searchable
  def search(query: String): Boolean
    searchable_fields().any? { |field| field.include?(query) }
  end

  def searchable_fields(): String[]
    []
  end
end

class BlogPost
  include Timestampable
  include Searchable

  attr_accessor :title: String
  attr_accessor :content: String
  attr_accessor :author: String

  def initialize(title: String, content: String, author: String)
    @title = title
    @content = content
    @author = author
    @created_at: Time? = nil
    @updated_at: Time? = nil
    set_created()
  end

  def searchable_fields(): String[]
    [@title, @content, @author]
  end

  def update_content(new_content: String): void
    @content = new_content
    touch()
  end
end

class Product
  include Timestampable
  include Searchable

  attr_accessor :name: String
  attr_accessor :description: String
  attr_accessor :sku: String

  def initialize(name: String, description: String, sku: String)
    @name = name
    @description = description
    @sku = sku
    @created_at: Time? = nil
    @updated_at: Time? = nil
    set_created()
  end

  def searchable_fields(): String[]
    [@name, @description, @sku]
  end
end

# Usage
post = BlogPost.new("Hello World", "This is my first post", "Alice")
puts post.created_at()
post.update_content("Updated content")
puts post.updated_at()
puts post.search("first")  # true

product = Product.new("Laptop", "Gaming laptop", "SKU-001")
puts product.search("Gaming")  # true
```

## Module Methods

Modules can define methods that work with instance variables:

```trb title="module_methods.trb"
module Validatable
  def valid?(): Boolean
    errors().empty?
  end

  def errors(): String[]
    @errors ||= []
  end

  def add_error(message: String): void
    @errors ||= []
    @errors.push(message)
  end

  def clear_errors(): void
    @errors = []
  end
end

class User
  include Validatable

  attr_accessor :email: String
  attr_accessor :age: Integer

  def initialize(email: String, age: Integer)
    @email = email
    @age = age
    @errors: String[] = []
  end

  def validate(): Boolean
    clear_errors()

    if !@email.include?("@")
      add_error("Email must contain @")
    end

    if @age < 18
      add_error("Must be 18 or older")
    end

    valid?()
  end
end

# Usage
user = User.new("invalid-email", 15)
if !user.validate()
  user.errors().each { |e| puts e }
  # "Email must contain @"
  # "Must be 18 or older"
end
```

## Multiple Mixins

Classes can include multiple modules:

```trb title="multiple_mixins.trb"
module Comparable
  def ==(other: self): Boolean
    compare_fields() == other.compare_fields()
  end

  def !=(other: self): Boolean
    !self.==(other)
  end

  def compare_fields(): (String | Integer)[]
    []
  end
end

module Serializable
  def to_hash(): Hash<String, String | Integer | Boolean>
    {}
  end

  def to_json(): String
    to_hash().to_json
  end
end

module Cloneable
  def clone(): self
    self.class.new(*clone_params())
  end

  def clone_params(): (String | Integer)[]
    []
  end
end

class Person
  include Comparable
  include Serializable
  include Cloneable

  attr_accessor :name: String
  attr_accessor :age: Integer
  attr_accessor :email: String

  def initialize(name: String, age: Integer, email: String)
    @name = name
    @age = age
    @email = email
  end

  def compare_fields(): (String | Integer)[]
    [@name, @age, @email]
  end

  def to_hash(): Hash<String, String | Integer | Boolean>
    { "name" => @name, "age" => @age, "email" => @email }
  end

  def clone_params(): (String | Integer)[]
    [@name, @age, @email]
  end
end

# Usage
person1 = Person.new("Alice", 30, "alice@example.com")
person2 = Person.new("Alice", 30, "alice@example.com")
person3 = Person.new("Bob", 25, "bob@example.com")

puts person1 == person2  # true
puts person1 == person3  # false

clone = person1.clone()
puts clone.name  # "Alice"
```

## Type Safety with Inheritance

T-Ruby ensures type safety across inheritance hierarchies:

```trb title="type_safety.trb"
class Vehicle
  attr_accessor :make: String
  attr_accessor :model: String

  def initialize(make: String, model: String)
    @make = make
    @model = model
  end

  def start(): void
    puts "Vehicle starting"
  end
end

class Car < Vehicle
  attr_accessor :num_doors: Integer

  def initialize(make: String, model: String, num_doors: Integer)
    super(make, model)
    @num_doors = num_doors
  end

  def start(): void
    puts "Car engine starting"
  end
end

class Motorcycle < Vehicle
  attr_accessor :has_sidecar: Boolean

  def initialize(make: String, model: String, has_sidecar: Boolean)
    super(make, model)
    @has_sidecar = has_sidecar
  end

  def start(): void
    puts "Motorcycle roaring to life"
  end
end

def start_vehicle(vehicle: Vehicle): void
  vehicle.start()
end

# Usage - all work because Car and Motorcycle inherit from Vehicle
car = Car.new("Toyota", "Camry", 4)
motorcycle = Motorcycle.new("Harley", "Street 750", false)

start_vehicle(car)         # "Car engine starting"
start_vehicle(motorcycle)  # "Motorcycle roaring to life"

# Type checking works
vehicles: Vehicle[] = [car, motorcycle]
vehicles.each { |v| v.start() }
```

## Practical Example: Content Management System

A complete example showing inheritance and mixins:

```trb title="cms.trb"
module Publishable
  def publish(): void
    @published = true
    @published_at = Time.now
  end

  def unpublish(): void
    @published = false
    @published_at = nil
  end

  def is_published?(): Boolean
    @published || false
  end

  def published_at(): Time?
    @published_at
  end
end

module Taggable
  def tags(): String[]
    @tags ||= []
  end

  def add_tag(tag: String): void
    @tags ||= []
    @tags.push(tag) unless @tags.include?(tag)
  end

  def remove_tag(tag: String): void
    @tags ||= []
    @tags.delete(tag)
  end

  def has_tag?(tag: String): Boolean
    tags().include?(tag)
  end
end

module Commentable
  def comments(): Comment[]
    @comments ||= []
  end

  def add_comment(comment: Comment): void
    @comments ||= []
    @comments.push(comment)
  end

  def comment_count(): Integer
    comments().length
  end
end

class Content
  attr_accessor :title: String
  attr_accessor :author: String
  attr_reader :created_at: Time

  def initialize(title: String, author: String)
    @title = title
    @author = author
    @created_at = Time.now
  end

  def summary(): String
    @title
  end
end

class Article < Content
  include Publishable
  include Taggable
  include Commentable

  attr_accessor :body: String
  attr_accessor :excerpt: String

  def initialize(title: String, author: String, body: String, excerpt: String)
    super(title, author)
    @body = body
    @excerpt = excerpt
    @published: Boolean = false
    @published_at: Time? = nil
    @tags: String[] = []
    @comments: Comment[] = []
  end

  def summary(): String
    @excerpt
  end

  def word_count(): Integer
    @body.split.length
  end
end

class Page < Content
  include Publishable

  attr_accessor :slug: String
  attr_accessor :content: String

  def initialize(title: String, author: String, slug: String, content: String)
    super(title, author)
    @slug = slug
    @content = content
    @published: Boolean = false
    @published_at: Time? = nil
  end

  def url(): String
    "/pages/#{@slug}"
  end
end

class Comment
  attr_reader :author: String
  attr_reader :body: String
  attr_reader :created_at: Time

  def initialize(author: String, body: String)
    @author = author
    @body = body
    @created_at = Time.now
  end
end

# Usage
article = Article.new(
  "Introduction to T-Ruby",
  "Alice",
  "T-Ruby is a typed superset of Ruby...",
  "Learn about T-Ruby's type system"
)

article.add_tag("ruby")
article.add_tag("types")
article.add_tag("programming")
article.publish()

comment = Comment.new("Bob", "Great article!")
article.add_comment(comment)

puts article.is_published?()    # true
puts article.has_tag?("ruby")   # true
puts article.comment_count()    # 1
puts article.word_count()       # 5

page = Page.new("About", "System", "about", "This is the about page")
page.publish()
puts page.url()  # "/pages/about"
```

## Best Practices

1. **Keep inheritance hierarchies shallow**: Prefer composition over deep inheritance chains.

2. **Use modules for shared behavior**: When multiple unrelated classes need the same functionality, use modules.

3. **Type all method parameters**: Even in modules, type all parameters and return values.

4. **Initialize module instance variables**: When modules use instance variables, initialize them in the including class.

5. **Use super appropriately**: When overriding methods, consider whether you need to call the parent implementation.

6. **Document module requirements**: If a module expects certain methods or instance variables, document them clearly.

## Common Patterns

### Template Method Pattern

```trb title="template_method.trb"
class DataImporter
  def import(file_path: String): void
    data = read_file(file_path)
    parsed = parse_data(data)
    validate_data(parsed)
    save_data(parsed)
  end

  def read_file(file_path: String): String
    # Common implementation
    File.read(file_path)
  end

  def validate_data(data: Hash<String, String>[]): void
    # Common validation
    raise "Empty data" if data.empty?
  end

  def parse_data(data: String): Hash<String, String>[]
    raise "Must implement parse_data"
  end

  def save_data(data: Hash<String, String>[]): void
    raise "Must implement save_data"
  end
end

class CSVImporter < DataImporter
  def parse_data(data: String): Hash<String, String>[]
    # Parse CSV
    []
  end

  def save_data(data: Hash<String, String>[]): void
    # Save to database
  end
end
```

### Decorator Pattern with Modules

```trb title="decorator.trb"
module Logging
  def log(message: String): void
    puts "[#{Time.now}] #{message}"
  end

  def with_logging(&block: Proc<[], void>): void
    log("Starting operation")
    block.call
    log("Operation completed")
  end
end

module Caching
  def cache(): Hash<String, String>
    @cache ||= {}
  end

  def cached(key: String, &block: Proc<[], String>): String
    if cache().key?(key)
      cache()[key]
    else
      result = block.call
      cache()[key] = result
      result
    end
  end
end

class DataService
  include Logging
  include Caching

  def fetch_data(id: String): String
    cached(id) do
      with_logging do
        # Expensive operation
        "Data for #{id}"
      end
    end
  end
end
```

## Summary

Inheritance and mixins in T-Ruby provide powerful code reuse mechanisms with type safety:

- **Inheritance** creates "is-a" relationships with type guarantees
- **Modules** share functionality across unrelated classes
- **Method overriding** maintains type signatures from parent classes
- **Super** calls parent implementations while preserving types
- **Multiple mixins** combine orthogonal concerns

Use inheritance for hierarchical relationships and modules for cross-cutting concerns. Always maintain type safety throughout your class hierarchies.
