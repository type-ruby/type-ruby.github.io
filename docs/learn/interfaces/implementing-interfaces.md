---
sidebar_position: 2
title: Implementing Interfaces
description: How classes implement interfaces
---

# Implementing Interfaces

Once you've defined interfaces, classes implement them using the `implements` keyword. T-Ruby ensures that implementing classes provide all required methods with the correct signatures. This guide shows you how to implement interfaces correctly and effectively.

## Basic Implementation

Use `implements` to declare that a class fulfills an interface contract:

```ruby title="basic_implementation.trb"
interface Drawable
  def draw(): void
  def get_area(): Float
end

class Circle
  implements Drawable

  attr_accessor :radius: Float

  def initialize(radius: Float)
    @radius = radius
  end

  def draw(): void
    puts "Drawing a circle with radius #{@radius}"
  end

  def get_area(): Float
    3.14159 * @radius * @radius
  end
end

class Square
  implements Drawable

  attr_accessor :side: Float

  def initialize(side: Float)
    @side = side
  end

  def draw(): void
    puts "Drawing a square with side #{@side}"
  end

  def get_area(): Float
    @side * @side
  end
end

# Usage - polymorphism at work
shapes: Array<Drawable> = [
  Circle.new(5.0),
  Square.new(4.0)
]

shapes.each { |shape| shape.draw() }
```

## Implementing Multiple Interfaces

A class can implement multiple interfaces:

```ruby title="multiple_interfaces.trb"
interface Serializable
  def to_json(): String
  def from_json(json: String): void
end

interface Comparable<T>
  def compare_to(other: T): Integer
end

interface Cloneable
  def clone(): self
end

class User
  implements Serializable, Comparable<User>, Cloneable

  attr_accessor :id: Integer
  attr_accessor :name: String
  attr_accessor :age: Integer

  def initialize(id: Integer, name: String, age: Integer)
    @id = id
    @name = name
    @age = age
  end

  # Serializable implementation
  def to_json(): String
    '{"id": #{@id}, "name": "#{@name}", "age": #{@age}}'
  end

  def from_json(json: String): void
    # Parse JSON and update fields
    # Simplified for example
  end

  # Comparable implementation
  def compare_to(other: User): Integer
    @id <=> other.id
  end

  # Cloneable implementation
  def clone(): User
    User.new(@id, @name, @age)
  end
end

# Usage
user1 = User.new(1, "Alice", 30)
user2 = User.new(2, "Bob", 25)

puts user1.to_json()
puts user1.compare_to(user2)  # -1
clone = user1.clone()
```

## Generic Interface Implementation

Implement generic interfaces with specific types:

```ruby title="generic_implementation.trb"
interface Storage<T>
  def save(item: T): void
  def load(id: String): T?
  def delete(id: String): Boolean
  def list_all(): Array<T>
end

class UserStorage
  implements Storage<User>

  def initialize()
    @users: Hash<String, User> = {}
  end

  def save(user: User): void
    @users[user.id.to_s] = user
  end

  def load(id: String): User?
    @users[id]
  end

  def delete(id: String): Boolean
    if @users.key?(id)
      @users.delete(id)
      true
    else
      false
    end
  end

  def list_all(): Array<User>
    @users.values
  end
end

class ProductStorage
  implements Storage<Product>

  def initialize()
    @products: Hash<String, Product> = {}
  end

  def save(product: Product): void
    @products[product.sku] = product
  end

  def load(sku: String): Product?
    @products[sku]
  end

  def delete(sku: String): Boolean
    if @products.key?(sku)
      @products.delete(sku)
      true
    else
      false
    end
  end

  def list_all(): Array<Product>
    @products.values
  end
end

# Usage - type-safe storage
user_storage: Storage<User> = UserStorage.new
user_storage.save(User.new(1, "Alice", 30))

product_storage: Storage<Product> = ProductStorage.new
product_storage.save(Product.new("SKU-001", "Laptop", 999.99))
```

## Partial Interface Implementation

Sometimes you'll implement interfaces partially through inheritance:

```ruby title="partial_implementation.trb"
interface Validator
  def validate(): Boolean
  def errors(): Array<String>
  def is_valid?(): Boolean
end

class BaseValidator
  def initialize()
    @errors: Array<String> = []
  end

  def errors(): Array<String>
    @errors
  end

  def is_valid?(): Boolean
    @errors.empty?
  end

  # Subclasses must implement validate()
end

class EmailValidator < BaseValidator
  implements Validator

  def initialize(email: String)
    super()
    @email = email
  end

  def validate(): Boolean
    @errors.clear()

    if !@email.include?("@")
      @errors.push("Email must contain @")
    end

    if !@email.include?(".")
      @errors.push("Email must contain a domain")
    end

    is_valid?()
  end
end

class PasswordValidator < BaseValidator
  implements Validator

  def initialize(password: String)
    super()
    @password = password
  end

  def validate(): Boolean
    @errors.clear()

    if @password.length < 8
      @errors.push("Password must be at least 8 characters")
    end

    if !@password.match?(/[A-Z]/)
      @errors.push("Password must contain uppercase letter")
    end

    if !@password.match?(/[0-9]/)
      @errors.push("Password must contain a number")
    end

    is_valid?()
  end
end

# Usage
email_validator = EmailValidator.new("test@example.com")
if email_validator.validate()
  puts "Email is valid"
else
  email_validator.errors().each { |e| puts e }
end

password_validator = PasswordValidator.new("weak")
if !password_validator.validate()
  password_validator.errors().each { |e| puts e }
end
```

## Interface Implementation with Delegation

Implement interfaces by delegating to other objects:

```ruby title="delegation.trb"
interface Logger
  def log(level: String, message: String): void
  def debug(message: String): void
  def info(message: String): void
  def error(message: String): void
end

class ConsoleLogger
  def log(level: String, message: String): void
    puts "[#{level}] #{message}"
  end
end

class Application
  implements Logger

  def initialize()
    @logger = ConsoleLogger.new
  end

  # Delegate to internal logger
  def log(level: String, message: String): void
    @logger.log(level, message)
  end

  def debug(message: String): void
    log("DEBUG", message)
  end

  def info(message: String): void
    log("INFO", message)
  end

  def error(message: String): void
    log("ERROR", message)
  end

  def run(): void
    info("Application starting")
    # Application logic
    info("Application shutting down")
  end
end

# Usage
app = Application.new
app.run()
```

## Practical Example: Payment Gateway

A complete example implementing payment interfaces:

```ruby title="payment_gateway.trb"
interface PaymentMethod
  def authorize(amount: Float): Boolean
  def capture(transaction_id: String): Boolean
  def refund(transaction_id: String, amount: Float): Boolean
  def get_transaction_status(transaction_id: String): String
end

interface PaymentProcessor
  def process_payment(amount: Float, method: PaymentMethod): Boolean
  def get_receipt(transaction_id: String): String
end

class CreditCardPayment
  implements PaymentMethod

  def initialize(card_number: String, cvv: String)
    @card_number = card_number
    @cvv = cvv
    @transactions: Hash<String, Hash<String, String | Float>> = {}
  end

  def authorize(amount: Float): Boolean
    transaction_id = generate_transaction_id()
    @transactions[transaction_id] = {
      "status" => "authorized",
      "amount" => amount
    }
    puts "Authorized $#{amount} on card ending in #{@card_number[-4..-1]}"
    true
  end

  def capture(transaction_id: String): Boolean
    if @transactions.key?(transaction_id)
      @transactions[transaction_id]["status"] = "captured"
      puts "Captured transaction #{transaction_id}"
      true
    else
      false
    end
  end

  def refund(transaction_id: String, amount: Float): Boolean
    if @transactions.key?(transaction_id)
      @transactions[transaction_id]["status"] = "refunded"
      puts "Refunded $#{amount} for transaction #{transaction_id}"
      true
    else
      false
    end
  end

  def get_transaction_status(transaction_id: String): String
    if @transactions.key?(transaction_id)
      @transactions[transaction_id]["status"].to_s
    else
      "not_found"
    end
  end

  private

  def generate_transaction_id(): String
    "CC_#{Time.now.to_i}_#{rand(10000)}"
  end
end

class PayPalPayment
  implements PaymentMethod

  def initialize(email: String)
    @email = email
    @transactions: Hash<String, Hash<String, String | Float>> = {}
  end

  def authorize(amount: Float): Boolean
    transaction_id = generate_transaction_id()
    @transactions[transaction_id] = {
      "status" => "authorized",
      "amount" => amount
    }
    puts "Authorized $#{amount} via PayPal (#{@email})"
    true
  end

  def capture(transaction_id: String): Boolean
    if @transactions.key?(transaction_id)
      @transactions[transaction_id]["status"] = "captured"
      puts "Captured PayPal transaction #{transaction_id}"
      true
    else
      false
    end
  end

  def refund(transaction_id: String, amount: Float): Boolean
    if @transactions.key?(transaction_id)
      @transactions[transaction_id]["status"] = "refunded"
      puts "Refunded $#{amount} via PayPal"
      true
    else
      false
    end
  end

  def get_transaction_status(transaction_id: String): String
    if @transactions.key?(transaction_id)
      @transactions[transaction_id]["status"].to_s
    else
      "not_found"
    end
  end

  private

  def generate_transaction_id(): String
    "PP_#{Time.now.to_i}_#{rand(10000)}"
  end
end

class CheckoutService
  implements PaymentProcessor

  def initialize()
    @receipts: Hash<String, String> = {}
  end

  def process_payment(amount: Float, method: PaymentMethod): Boolean
    if method.authorize(amount)
      # In a real system, we'd get the transaction ID from authorize
      transaction_id = "TXN_#{Time.now.to_i}"
      if method.capture(transaction_id)
        @receipts[transaction_id] = generate_receipt(amount, method)
        true
      else
        false
      end
    else
      false
    end
  end

  def get_receipt(transaction_id: String): String
    @receipts[transaction_id] || "Receipt not found"
  end

  private

  def generate_receipt(amount: Float, method: PaymentMethod): String
    "Receipt\n-------\nAmount: $#{amount}\nDate: #{Time.now}\n"
  end
end

# Usage
checkout = CheckoutService.new

credit_card = CreditCardPayment.new("4111111111111111", "123")
if checkout.process_payment(99.99, credit_card)
  puts "Payment successful!"
end

paypal = PayPalPayment.new("user@example.com")
if checkout.process_payment(49.99, paypal)
  puts "Payment successful!"
end
```

## Practical Example: Notification System

Another complete example with multiple interface implementations:

```ruby title="notification_system.trb"
interface NotificationChannel
  def send(recipient: String, message: String): Boolean
  def send_bulk(recipients: Array<String>, message: String): Array<Boolean>
  def is_available?(): Boolean
end

interface Formatter
  def format(template: String, data: Hash<String, String>): String
end

class EmailNotification
  implements NotificationChannel

  def initialize(smtp_host: String)
    @smtp_host = smtp_host
    @available = true
  end

  def send(recipient: String, message: String): Boolean
    if is_available?()
      puts "Sending email to #{recipient}: #{message}"
      true
    else
      false
    end
  end

  def send_bulk(recipients: Array<String>, message: String): Array<Boolean>
    recipients.map { |recipient| send(recipient, message) }
  end

  def is_available?(): Boolean
    @available
  end
end

class SMSNotification
  implements NotificationChannel

  def initialize(api_key: String)
    @api_key = api_key
    @available = true
  end

  def send(recipient: String, message: String): Boolean
    if is_available?()
      puts "Sending SMS to #{recipient}: #{message}"
      true
    else
      false
    end
  end

  def send_bulk(recipients: Array<String>, message: String): Array<Boolean>
    recipients.map { |recipient| send(recipient, message) }
  end

  def is_available?(): Boolean
    @available
  end
end

class PushNotification
  implements NotificationChannel

  def initialize(app_id: String)
    @app_id = app_id
    @available = true
  end

  def send(recipient: String, message: String): Boolean
    if is_available?()
      puts "Sending push notification to #{recipient}: #{message}"
      true
    else
      false
    end
  end

  def send_bulk(recipients: Array<String>, message: String): Array<Boolean>
    recipients.map { |recipient| send(recipient, message) }
  end

  def is_available?(): Boolean
    @available
  end
end

class TemplateFormatter
  implements Formatter

  def format(template: String, data: Hash<String, String>): String
    result = template
    data.each do |key, value|
      result = result.gsub("{{#{key}}}", value)
    end
    result
  end
end

class NotificationService
  def initialize()
    @channels: Array<NotificationChannel> = []
    @formatter: Formatter = TemplateFormatter.new
  end

  def add_channel(channel: NotificationChannel): void
    @channels.push(channel)
  end

  def notify(recipient: String, template: String, data: Hash<String, String>): void
    message = @formatter.format(template, data)
    @channels.each do |channel|
      if channel.is_available?()
        channel.send(recipient, message)
      end
    end
  end

  def notify_all(recipients: Array<String>, template: String, data: Hash<String, String>): void
    message = @formatter.format(template, data)
    @channels.each do |channel|
      if channel.is_available?()
        channel.send_bulk(recipients, message)
      end
    end
  end
end

# Usage
service = NotificationService.new
service.add_channel(EmailNotification.new("smtp.example.com"))
service.add_channel(SMSNotification.new("sms_api_key"))
service.add_channel(PushNotification.new("app_123"))

service.notify(
  "user@example.com",
  "Hello {{name}}, your order {{order_id}} has shipped!",
  { "name" => "Alice", "order_id" => "12345" }
)

service.notify_all(
  ["user1@example.com", "user2@example.com"],
  "Special offer for {{name}}!",
  { "name" => "Valued Customer" }
)
```

## Best Practices

1. **Implement all interface methods**: T-Ruby will enforce that you implement every method defined in the interface.

2. **Match signatures exactly**: Method signatures in the implementation must match the interface exactly (same parameters, same return type).

3. **Use meaningful implementations**: Don't create stub implementations that just throw errors - provide real functionality.

4. **Document implementation details**: Even though the interface defines what, document how your implementation works.

5. **Test interface compliance**: Write tests that verify your class correctly implements the interface contract.

6. **Keep implementations focused**: Each implementing class should have a single, clear responsibility.

## Common Patterns

### Adapter Pattern

```ruby title="adapter.trb"
interface ModernAPI
  def get_data(id: String): Hash<String, String>
  def save_data(id: String, data: Hash<String, String>): Boolean
end

class LegacySystem
  def fetch(id: Integer): String
    "legacy_data_#{id}"
  end

  def store(id: Integer, value: String): Boolean
    true
  end
end

class LegacyAdapter
  implements ModernAPI

  def initialize(legacy: LegacySystem)
    @legacy = legacy
  end

  def get_data(id: String): Hash<String, String>
    legacy_data = @legacy.fetch(id.to_i)
    { "data" => legacy_data }
  end

  def save_data(id: String, data: Hash<String, String>): Boolean
    @legacy.store(id.to_i, data.to_json)
  end
end
```

### Composite Pattern

```ruby title="composite.trb"
interface Component
  def render(): String
  def add(component: Component): void
  def remove(component: Component): void
end

class Leaf
  implements Component

  def initialize(text: String)
    @text = text
  end

  def render(): String
    @text
  end

  def add(component: Component): void
    # Leaf cannot have children
  end

  def remove(component: Component): void
    # Leaf cannot have children
  end
end

class Composite
  implements Component

  def initialize()
    @children: Array<Component> = []
  end

  def render(): String
    @children.map { |c| c.render() }.join("")
  end

  def add(component: Component): void
    @children.push(component)
  end

  def remove(component: Component): void
    @children.delete(component)
  end
end
```

## Summary

Implementing interfaces in T-Ruby:

- **Enforces contracts** ensuring classes provide required methods
- **Enables polymorphism** allowing different implementations to be used interchangeably
- **Provides type safety** with compile-time checking
- **Supports multiple interfaces** for flexible design

Master interface implementation to build flexible, maintainable, and type-safe applications. Interfaces are the foundation of good object-oriented design in T-Ruby.
