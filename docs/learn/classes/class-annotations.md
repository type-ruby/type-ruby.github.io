---
sidebar_position: 1
title: Class Annotations
description: Adding type annotations to classes
---

# Class Annotations

Classes are the foundation of object-oriented Ruby programming. T-Ruby brings type safety to classes through annotations on methods, instance variables, and class-level constructs. This guide will teach you how to write fully typed classes.

## Basic Class Typing

Start by typing the methods in your class:

```ruby title="basic_class.trb"
class User
  def initialize(name: String, email: String, age: Integer)
    @name = name
    @email = email
    @age = age
  end

  def greet(): String
    "Hello, I'm #{@name}"
  end

  def is_adult(): Boolean
    @age >= 18
  end

  def update_email(new_email: String): void
    @email = new_email
  end
end

# Using the class
user = User.new("Alice", "alice@example.com", 30)
greeting = user.greet()  # Type: String
adult = user.is_adult()   # Type: Boolean
user.update_email("newemail@example.com")
```

## Typing Instance Variables

Instance variables should be typed with `attr_accessor`, `attr_reader`, or `attr_writer`:

```ruby title="instance_vars.trb"
class Product
  attr_accessor :name: String
  attr_accessor :price: Float
  attr_reader :id: Integer
  attr_writer :stock: Integer

  def initialize(id: Integer, name: String, price: Float)
    @id = id
    @name = name
    @price = price
    @stock = 0
  end

  def discounted_price(discount: Float): Float
    @price * (1 - discount)
  end

  def in_stock?(): Boolean
    @stock > 0
  end
end

# Usage
product = Product.new(1, "Laptop", 999.99)
product.name = "Gaming Laptop"  # ✓ OK - attr_accessor
puts product.id                  # ✓ OK - attr_reader
# product.id = 2                # ✗ Error - read-only
product.stock = 10               # ✓ OK - attr_writer (private getter)
```

## Explicit Instance Variable Types

You can also declare instance variable types explicitly in the constructor:

```ruby title="explicit_ivars.trb"
class BlogPost
  def initialize(title: String, content: String, published: Boolean = false)
    @title: String = title
    @content: String = content
    @published: Boolean = published
    @views: Integer = 0
    @tags: Array<String> = []
  end

  def publish(): void
    @published = true
  end

  def add_view(): void
    @views += 1
  end

  def add_tag(tag: String): void
    @tags.push(tag)
  end

  def tag_list(): Array<String>
    @tags
  end
end
```

## Class Methods

Class methods (singleton methods) are typed the same way as instance methods:

```ruby title="class_methods.trb"
class User
  def self.from_hash(data: Hash<String, String | Integer>): User
    User.new(
      data["name"].to_s,
      data["email"].to_s,
      data["age"].to_i
    )
  end

  def self.create_admin(name: String, email: String): User
    user = User.new(name, email, 30)
    user.role = "admin"
    user
  end

  def self.count(): Integer
    # Return count from database
    100
  end

  attr_accessor :name: String
  attr_accessor :email: String
  attr_accessor :role: String

  def initialize(name: String, email: String, age: Integer)
    @name = name
    @email = email
    @age = age
    @role = "user"
  end
end

# Using class methods
user1 = User.from_hash({ "name" => "Alice", "email" => "alice@example.com", "age" => 30 })
admin = User.create_admin("Bob", "bob@example.com")
total = User.count()
```

## Constructor Overloading with Union Types

Ruby doesn't support true overloading, but you can use union types for flexible constructors:

```ruby title="flexible_constructor.trb"
class Rectangle
  attr_reader :width: Float
  attr_reader :height: Float

  def initialize(width: Float | Integer, height: Float | Integer)
    @width = width.to_f
    @height = height.to_f
  end

  def area(): Float
    @width * @height
  end
end

# Both work
rect1 = Rectangle.new(10, 20)       # Integers
rect2 = Rectangle.new(10.5, 20.5)   # Floats
rect3 = Rectangle.new(10, 20.5)     # Mixed
```

## Private Methods

Private methods are typed just like public ones:

```ruby title="private_methods.trb"
class BankAccount
  attr_reader :balance: Float

  def initialize(initial_balance: Float)
    @balance = initial_balance
  end

  def deposit(amount: Float): void
    validate_amount(amount)
    @balance += amount
  end

  def withdraw(amount: Float): Boolean
    if can_withdraw?(amount)
      @balance -= amount
      true
    else
      false
    end
  end

  private

  def validate_amount(amount: Float): void
    if amount <= 0
      raise ArgumentError, "Amount must be positive"
    end
  end

  def can_withdraw?(amount: Float): Boolean
    amount > 0 && amount <= @balance
  end
end

# Usage
account = BankAccount.new(1000.0)
account.deposit(500.0)
account.withdraw(200.0)
# account.validate_amount(100.0)  # ✗ Error - private method
```

## Getter and Setter Methods

When you need custom getter/setter logic, type them explicitly:

```ruby title="custom_accessors.trb"
class Temperature
  def initialize(celsius: Float)
    @celsius = celsius
  end

  def celsius(): Float
    @celsius
  end

  def celsius=(value: Float): void
    @celsius = value
  end

  def fahrenheit(): Float
    @celsius * 9.0 / 5.0 + 32.0
  end

  def fahrenheit=(value: Float): void
    @celsius = (value - 32.0) * 5.0 / 9.0
  end

  def kelvin(): Float
    @celsius + 273.15
  end
end

# Usage
temp = Temperature.new(0.0)
puts temp.celsius      # 0.0
puts temp.fahrenheit   # 32.0
puts temp.kelvin       # 273.15

temp.fahrenheit = 98.6
puts temp.celsius      # 37.0
```

## Nilable Instance Variables

Instance variables that can be nil should use the `?` suffix:

```ruby title="nilable_ivars.trb"
class UserProfile
  attr_accessor :name: String
  attr_accessor :bio: String?
  attr_accessor :avatar_url: String?
  attr_reader :last_login: Time?

  def initialize(name: String)
    @name = name
    @bio = nil
    @avatar_url = nil
    @last_login = nil
  end

  def update_bio(text: String): void
    @bio = text
  end

  def clear_bio(): void
    @bio = nil
  end

  def has_bio?(): Boolean
    @bio != nil
  end

  def record_login(): void
    @last_login = Time.now
  end
end

# Usage
profile = UserProfile.new("Alice")
profile.bio = "Software developer"
if profile.has_bio?
  puts profile.bio  # T-Ruby knows bio is not nil here
end
```

## Practical Example: E-commerce Product

Here's a complete example showing various typing techniques:

```ruby title="product.trb"
class Product
  attr_reader :id: Integer
  attr_accessor :name: String
  attr_accessor :description: String?
  attr_accessor :price: Float
  attr_reader :created_at: Time

  def initialize(id: Integer, name: String, price: Float)
    @id = id
    @name = name
    @price = price
    @description = nil
    @stock = 0
    @tags = []
    @on_sale = false
    @sale_price = nil
    @created_at = Time.now
  end

  # Stock management
  def stock(): Integer
    @stock
  end

  def add_stock(quantity: Integer): void
    @stock += quantity
  end

  def remove_stock(quantity: Integer): Boolean
    if @stock >= quantity
      @stock -= quantity
      true
    else
      false
    end
  end

  def in_stock?(): Boolean
    @stock > 0
  end

  # Tag management
  def tags(): Array<String>
    @tags
  end

  def add_tag(tag: String): void
    @tags.push(tag) unless @tags.include?(tag)
  end

  def remove_tag(tag: String): void
    @tags.delete(tag)
  end

  # Sale pricing
  def on_sale(): Boolean
    @on_sale
  end

  def start_sale(sale_price: Float): void
    @on_sale = true
    @sale_price = sale_price
  end

  def end_sale(): void
    @on_sale = false
    @sale_price = nil
  end

  def current_price(): Float
    @on_sale && @sale_price ? @sale_price : @price
  end

  def discount_percentage(): Float?
    if @on_sale && @sale_price
      ((@price - @sale_price) / @price) * 100
    else
      nil
    end
  end

  # Class methods
  def self.from_json(json: String): Product
    data = JSON.parse(json)
    Product.new(data["id"], data["name"], data["price"])
  end

  def self.bulk_create(names: Array<String>, default_price: Float): Array<Product>
    names.map.with_index do |name, index|
      Product.new(index + 1, name, default_price)
    end
  end

  # Comparison
  def cheaper_than?(other: Product): Boolean
    current_price() < other.current_price()
  end

  def same_category?(other: Product): Boolean
    (@tags & other.tags()).any?
  end
end

# Using the Product class
laptop = Product.new(1, "Laptop", 999.99)
laptop.add_stock(50)
laptop.add_tag("electronics")
laptop.add_tag("computers")
laptop.start_sale(899.99)

puts laptop.current_price()        # 899.99
puts laptop.discount_percentage()  # 10.00
puts laptop.in_stock?()            # true

phone = Product.new(2, "Phone", 699.99)
phone.add_tag("electronics")

puts laptop.cheaper_than?(phone)   # false
puts laptop.same_category?(phone)  # true
```

## Practical Example: Task Manager

Another complete example with different patterns:

```ruby title="task_manager.trb"
class Task
  attr_reader :id: Integer
  attr_accessor :title: String
  attr_accessor :completed: Boolean
  attr_reader :created_at: Time
  attr_accessor :due_date: Time?
  attr_accessor :priority: String

  def initialize(id: Integer, title: String, priority: String = "normal")
    @id = id
    @title = title
    @completed = false
    @created_at = Time.now
    @due_date = nil
    @priority = priority
    @subtasks = []
  end

  def complete(): void
    @completed = true
  end

  def uncomplete(): void
    @completed = false
  end

  def overdue?(): Boolean
    if @due_date && !@completed
      Time.now > @due_date
    else
      false
    end
  end

  def add_subtask(title: String): Task
    subtask = Task.new(@subtasks.length + 1, title)
    @subtasks.push(subtask)
    subtask
  end

  def subtasks(): Array<Task>
    @subtasks
  end

  def all_subtasks_completed?(): Boolean
    @subtasks.all? { |t| t.completed }
  end
end

class TaskList
  attr_reader :name: String

  def initialize(name: String)
    @name = name
    @tasks = []
    @next_id = 1
  end

  def add_task(title: String, priority: String = "normal"): Task
    task = Task.new(@next_id, title, priority)
    @tasks.push(task)
    @next_id += 1
    task
  end

  def remove_task(id: Integer): Boolean
    task = find_task(id)
    if task
      @tasks.delete(task)
      true
    else
      false
    end
  end

  def find_task(id: Integer): Task?
    @tasks.find { |t| t.id == id }
  end

  def all_tasks(): Array<Task>
    @tasks
  end

  def completed_tasks(): Array<Task>
    @tasks.select { |t| t.completed }
  end

  def pending_tasks(): Array<Task>
    @tasks.reject { |t| t.completed }
  end

  def overdue_tasks(): Array<Task>
    @tasks.select { |t| t.overdue? }
  end

  def high_priority_tasks(): Array<Task>
    @tasks.select { |t| t.priority == "high" }
  end

  def task_count(): Integer
    @tasks.length
  end

  def completion_percentage(): Float
    return 0.0 if @tasks.empty?
    (completed_tasks().length.to_f / @tasks.length.to_f) * 100
  end
end

# Using the task manager
list = TaskList.new("Work Tasks")

task1 = list.add_task("Write documentation", "high")
task1.due_date = Time.now + 86400  # Due tomorrow

task2 = list.add_task("Review code")
task2.complete()

task3 = list.add_task("Fix bug", "high")
task3.add_subtask("Reproduce issue")
task3.add_subtask("Write test")
task3.add_subtask("Implement fix")

puts list.task_count()                # 3
puts list.completion_percentage()     # 33.33
puts list.high_priority_tasks().length # 2
puts list.overdue_tasks().length       # 0
```

## Best Practices

1. **Always type attr_accessor/attr_reader/attr_writer**: These provide clear contracts for your class's public interface.

2. **Type initialize parameters**: The constructor should have full type annotations for all parameters.

3. **Use nilable types appropriately**: Mark instance variables as `Type?` only when they genuinely can be nil.

4. **Type all public methods**: Public methods are your class's API and should always be typed.

5. **Type private methods too**: Private methods benefit from type safety even if they're internal.

6. **Use class methods for factory patterns**: Type class methods that create instances with specific configurations.

## Common Patterns

### Builder Pattern

```ruby title="builder.trb"
class EmailBuilder
  def initialize()
    @to = []
    @cc = []
    @subject = ""
    @body = ""
  end

  def to(addresses: Array<String>): EmailBuilder
    @to = addresses
    self
  end

  def cc(addresses: Array<String>): EmailBuilder
    @cc = addresses
    self
  end

  def subject(text: String): EmailBuilder
    @subject = text
    self
  end

  def body(text: String): EmailBuilder
    @body = text
    self
  end

  def build(): Email
    Email.new(@to, @cc, @subject, @body)
  end
end

email = EmailBuilder.new
  .to(["alice@example.com"])
  .cc(["bob@example.com"])
  .subject("Meeting")
  .body("Let's meet tomorrow")
  .build()
```

### Value Object

```ruby title="value_object.trb"
class Money
  attr_reader :amount: Float
  attr_reader :currency: String

  def initialize(amount: Float, currency: String)
    @amount = amount
    @currency = currency
  end

  def add(other: Money): Money
    raise "Currency mismatch" if @currency != other.currency
    Money.new(@amount + other.amount, @currency)
  end

  def multiply(factor: Float): Money
    Money.new(@amount * factor, @currency)
  end

  def equals?(other: Money): Boolean
    @amount == other.amount && @currency == other.currency
  end
end
```

### Singleton Pattern

```ruby title="singleton.trb"
class Configuration
  def self.instance(): Configuration
    @instance ||= Configuration.new
  end

  attr_accessor :database_url: String
  attr_accessor :api_key: String
  attr_accessor :debug: Boolean

  private

  def initialize()
    @database_url = "localhost"
    @api_key = ""
    @debug = false
  end
end

config = Configuration.instance()
config.database_url = "postgres://localhost/mydb"
```

## Summary

Class annotations in T-Ruby provide:

- **Type safety** for instance and class variables
- **Clear contracts** through typed method signatures
- **Better tooling** support with IDE autocomplete
- **Documentation** that's always up-to-date

Start by typing your public API (attr_accessor, public methods) and gradually add types to the rest of your class. Your code will be more maintainable and less error-prone.
