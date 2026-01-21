---
sidebar_position: 4
title: Abstract Classes
description: Defining abstract classes and methods
---

<DocsBadge />


# Abstract Classes

Abstract classes define a template for subclasses, containing both implemented methods and abstract methods that must be overridden. While Ruby doesn't have built-in abstract class syntax, T-Ruby provides conventions and patterns to create type-safe abstract classes.

## Defining Abstract Classes

Create abstract classes by raising errors in methods that subclasses must implement:

```trb title="abstract_basic.trb"
class Shape
  def initialize()
    @name: String = "Shape"
  end

  # Abstract method - must be implemented by subclasses
  def area(): Float
    raise NotImplementedError, "Subclass must implement area()"
  end

  # Abstract method
  def perimeter(): Float
    raise NotImplementedError, "Subclass must implement perimeter()"
  end

  # Concrete method - shared by all shapes
  def describe(): String
    "#{@name}: area = #{area()}, perimeter = #{perimeter()}"
  end
end

class Rectangle < Shape
  attr_accessor :width: Float
  attr_accessor :height: Float

  def initialize(width: Float, height: Float)
    super()
    @name = "Rectangle"
    @width = width
    @height = height
  end

  def area(): Float
    @width * @height
  end

  def perimeter(): Float
    2 * (@width + @height)
  end
end

class Circle < Shape
  attr_accessor :radius: Float

  def initialize(radius: Float)
    super()
    @name = "Circle"
    @radius = radius
  end

  def area(): Float
    3.14159 * @radius * @radius
  end

  def perimeter(): Float
    2 * 3.14159 * @radius
  end
end

# Usage
rect = Rectangle.new(10.0, 5.0)
puts rect.describe()  # "Rectangle: area = 50.0, perimeter = 30.0"

circle = Circle.new(5.0)
puts circle.describe()  # "Circle: area = 78.53975, perimeter = 31.4159"

# This would raise NotImplementedError:
# shape = Shape.new
# shape.area()
```

## Abstract Classes with Type Annotations

All abstract methods should have full type annotations:

```trb title="typed_abstract.trb"
abstract class DataSource
  def connect(): Boolean
    raise NotImplementedError, "Must implement connect()"
  end

  def disconnect(): void
    raise NotImplementedError, "Must implement disconnect()"
  end

  def fetch(query: String): Hash<String, String>[]
    raise NotImplementedError, "Must implement fetch()"
  end

  def save(data: Hash<String, String>): Boolean
    raise NotImplementedError, "Must implement save()"
  end

  # Concrete helper method
  def fetch_one(query: String): Hash<String, String>?
    results = fetch(query)
    results.first
  end
end

class DatabaseSource < DataSource
  def initialize(connection_string: String)
    @connection_string = connection_string
    @connected: Boolean = false
  end

  def connect(): Boolean
    # Implementation
    @connected = true
    true
  end

  def disconnect(): void
    @connected = false
  end

  def fetch(query: String): Hash<String, String>[]
    raise "Not connected" unless @connected
    # Database query implementation
    []
  end

  def save(data: Hash<String, String>): Boolean
    raise "Not connected" unless @connected
    # Database save implementation
    true
  end
end

class APISource < DataSource
  def initialize(api_url: String, api_key: String)
    @api_url = api_url
    @api_key = api_key
    @connected: Boolean = false
  end

  def connect(): Boolean
    # API connection logic
    @connected = true
    true
  end

  def disconnect(): void
    @connected = false
  end

  def fetch(query: String): Hash<String, String>[]
    # API fetch implementation
    []
  end

  def save(data: Hash<String, String>): Boolean
    # API save implementation
    true
  end
end
```

## Template Method Pattern

Abstract classes often implement the template method pattern:

```trb title="template_method.trb"
abstract class Report
  def generate(): String
    validate()
    header = create_header()
    body = create_body()
    footer = create_footer()
    format_output(header, body, footer)
  end

  # Abstract methods - must be implemented
  def create_header(): String
    raise NotImplementedError, "Must implement create_header()"
  end

  def create_body(): String
    raise NotImplementedError, "Must implement create_body()"
  end

  def create_footer(): String
    raise NotImplementedError, "Must implement create_footer()"
  end

  # Concrete methods with default implementations
  def validate(): void
    # Default validation
  end

  def format_output(header: String, body: String, footer: String): String
    "#{header}\n\n#{body}\n\n#{footer}"
  end
end

class PDFReport < Report
  def initialize(title: String, data: String[])
    @title = title
    @data = data
  end

  def create_header(): String
    "PDF Report: #{@title}"
  end

  def create_body(): String
    @data.join("\n")
  end

  def create_footer(): String
    "Generated at #{Time.now}"
  end

  def validate(): void
    raise "No data" if @data.empty?
  end
end

class HTMLReport < Report
  def initialize(title: String, data: String[])
    @title = title
    @data = data
  end

  def create_header(): String
    "<h1>#{@title}</h1>"
  end

  def create_body(): String
    "<ul>" + @data.map { |d| "<li>#{d}</li>" }.join + "</ul>"
  end

  def create_footer(): String
    "<footer>Generated at #{Time.now}</footer>"
  end
end

# Usage
pdf = PDFReport.new("Sales Report", ["Item 1", "Item 2", "Item 3"])
puts pdf.generate()

html = HTMLReport.new("Sales Report", ["Item 1", "Item 2", "Item 3"])
puts html.generate()
```

## Abstract Classes with Partial Implementation

Abstract classes can provide some concrete functionality:

```trb title="partial_implementation.trb"
abstract class CacheStore<T>
  def initialize()
    @stats: Hash<String, Integer> = { "hits" => 0, "misses" => 0 }
  end

  # Abstract methods
  def get(key: String): T?
    raise NotImplementedError, "Must implement get()"
  end

  def set(key: String, value: T): void
    raise NotImplementedError, "Must implement set()"
  end

  def delete(key: String): void
    raise NotImplementedError, "Must implement delete()"
  end

  def clear(): void
    raise NotImplementedError, "Must implement clear()"
  end

  # Concrete helper methods
  def fetch(key: String, &default: Proc<[], T>): T
    value = get(key)
    if value
      record_hit()
      value
    else
      record_miss()
      default_value = default.call
      set(key, default_value)
      default_value
    end
  end

  def hit_rate(): Float
    total = @stats["hits"] + @stats["misses"]
    return 0.0 if total == 0
    (@stats["hits"].to_f / total.to_f) * 100
  end

  def stats(): Hash<String, Integer>
    @stats
  end

  protected

  def record_hit(): void
    @stats["hits"] += 1
  end

  def record_miss(): void
    @stats["misses"] += 1
  end
end

class MemoryCache<T> < CacheStore<T>
  def initialize(max_size: Integer = 100)
    super()
    @max_size = max_size
    @data: Hash<String, T> = {}
  end

  def get(key: String): T?
    @data[key]
  end

  def set(key: String, value: T): void
    # Simple eviction if full
    if @data.length >= @max_size && !@data.key?(key)
      @data.delete(@data.keys.first)
    end
    @data[key] = value
  end

  def delete(key: String): void
    @data.delete(key)
  end

  def clear(): void
    @data.clear()
  end
end

class FileCache<T> < CacheStore<T>
  def initialize(cache_dir: String)
    super()
    @cache_dir = cache_dir
  end

  def get(key: String): T?
    file_path = "#{@cache_dir}/#{key}.cache"
    if File.exist?(file_path)
      Marshal.load(File.read(file_path))
    else
      nil
    end
  end

  def set(key: String, value: T): void
    file_path = "#{@cache_dir}/#{key}.cache"
    File.write(file_path, Marshal.dump(value))
  end

  def delete(key: String): void
    file_path = "#{@cache_dir}/#{key}.cache"
    File.delete(file_path) if File.exist?(file_path)
  end

  def clear(): void
    Dir.glob("#{@cache_dir}/*.cache").each { |f| File.delete(f) }
  end
end

# Usage
memory_cache = MemoryCache<String>.new(50)
memory_cache.set("user_1", "Alice")
user = memory_cache.get("user_1")

# Using fetch with default
user2 = memory_cache.fetch("user_2") do
  "Default User"
end

puts memory_cache.hit_rate()
```

## Abstract Base Class for Common Patterns

Use abstract classes to enforce common patterns:

```trb title="common_patterns.trb"
abstract class Controller
  def initialize()
    @before_filters: Proc<[], void>[] = []
    @after_filters: Proc<[], void>[] = []
  end

  def execute(action: String): void
    run_before_filters()
    perform_action(action)
    run_after_filters()
  end

  # Abstract - subclass must implement
  def perform_action(action: String): void
    raise NotImplementedError, "Must implement perform_action()"
  end

  # Concrete helper methods
  def add_before_filter(filter: Proc<[], void>): void
    @before_filters.push(filter)
  end

  def add_after_filter(filter: Proc<[], void>): void
    @after_filters.push(filter)
  end

  protected

  def run_before_filters(): void
    @before_filters.each { |f| f.call }
  end

  def run_after_filters(): void
    @after_filters.each { |f| f.call }
  end
end

class UsersController < Controller
  def initialize()
    super()
    add_before_filter(->(){ puts "Authenticating..." })
    add_after_filter(->(){ puts "Logging action..." })
  end

  def perform_action(action: String): void
    case action
    when "index"
      index()
    when "show"
      show()
    when "create"
      create()
    else
      puts "Unknown action: #{action}"
    end
  end

  private

  def index(): void
    puts "Listing all users"
  end

  def show(): void
    puts "Showing user details"
  end

  def create(): void
    puts "Creating new user"
  end
end

# Usage
controller = UsersController.new
controller.execute("index")
# Authenticating...
# Listing all users
# Logging action...
```

## Practical Example: Payment Processor

A complete example using abstract classes:

```trb title="payment_processor.trb"
abstract class PaymentProcessor
  attr_reader :transaction_id: String?
  attr_reader :amount: Float
  attr_reader :status: String

  def initialize(amount: Float)
    @amount = amount
    @status = "pending"
    @transaction_id = nil
  end

  def process(): Boolean
    validate_amount()
    if connect()
      result = execute_payment()
      disconnect()
      result
    else
      false
    end
  end

  def refund(): Boolean
    return false if @status != "completed"
    if connect()
      result = execute_refund()
      disconnect()
      result
    else
      false
    end
  end

  # Abstract methods - payment gateway specific
  def connect(): Boolean
    raise NotImplementedError, "Must implement connect()"
  end

  def disconnect(): void
    raise NotImplementedError, "Must implement disconnect()"
  end

  def execute_payment(): Boolean
    raise NotImplementedError, "Must implement execute_payment()"
  end

  def execute_refund(): Boolean
    raise NotImplementedError, "Must implement execute_refund()"
  end

  # Concrete validation
  def validate_amount(): void
    if @amount <= 0
      raise ArgumentError, "Amount must be positive"
    end
  end

  protected

  def generate_transaction_id(): String
    "TXN_#{Time.now.to_i}_#{rand(10000)}"
  end
end

class StripeProcessor < PaymentProcessor
  def initialize(amount: Float, api_key: String)
    super(amount)
    @api_key = api_key
    @connected: Boolean = false
  end

  def connect(): Boolean
    puts "Connecting to Stripe..."
    @connected = true
    true
  end

  def disconnect(): void
    puts "Disconnecting from Stripe"
    @connected = false
  end

  def execute_payment(): Boolean
    return false unless @connected

    @transaction_id = generate_transaction_id()
    puts "Processing $#{@amount} via Stripe (#{@transaction_id})"
    @status = "completed"
    true
  end

  def execute_refund(): Boolean
    return false unless @connected

    puts "Refunding transaction #{@transaction_id} via Stripe"
    @status = "refunded"
    true
  end
end

class PayPalProcessor < PaymentProcessor
  def initialize(amount: Float, email: String)
    super(amount)
    @email = email
    @connected: Boolean = false
  end

  def connect(): Boolean
    puts "Connecting to PayPal..."
    @connected = true
    true
  end

  def disconnect(): void
    puts "Disconnecting from PayPal"
    @connected = false
  end

  def execute_payment(): Boolean
    return false unless @connected

    @transaction_id = generate_transaction_id()
    puts "Processing $#{@amount} via PayPal (#{@transaction_id})"
    @status = "completed"
    true
  end

  def execute_refund(): Boolean
    return false unless @connected

    puts "Refunding transaction #{@transaction_id} via PayPal"
    @status = "refunded"
    true
  end
end

# Usage
stripe = StripeProcessor.new(99.99, "sk_test_123")
if stripe.process()
  puts "Payment successful: #{stripe.transaction_id}"
  puts "Status: #{stripe.status}"
end

paypal = PayPalProcessor.new(49.99, "user@example.com")
if paypal.process()
  puts "Payment successful: #{paypal.transaction_id}"
  if paypal.refund()
    puts "Refund successful"
  end
end

# Polymorphism works
def process_payment(processor: PaymentProcessor): Boolean
  processor.process()
end

processors: PaymentProcessor[] = [stripe, paypal]
processors.each { |p| process_payment(p) }
```

## Best Practices

1. **Document abstract methods**: Clearly document which methods must be implemented by subclasses.

2. **Provide default implementations when possible**: Give concrete implementations for methods that have sensible defaults.

3. **Use meaningful error messages**: When raising NotImplementedError, provide clear guidance.

4. **Type all abstract methods**: Even though they raise errors, abstract methods should have full type annotations.

5. **Keep abstract classes focused**: Abstract classes should define a clear contract, not try to do too much.

6. **Test with concrete implementations**: Always create at least one concrete implementation to verify the abstract class design.

## Common Patterns

### Strategy Pattern

```trb title="strategy.trb"
abstract class SortStrategy
  def sort(array: Integer[]): Integer[]
    raise NotImplementedError, "Must implement sort()"
  end
end

class BubbleSort < SortStrategy
  def sort(array: Integer[]): Integer[]
    # Bubble sort implementation
    array.sort
  end
end

class QuickSort < SortStrategy
  def sort(array: Integer[]): Integer[]
    # Quick sort implementation
    array.sort
  end
end

class Sorter
  def initialize(strategy: SortStrategy)
    @strategy = strategy
  end

  def sort(data: Integer[]): Integer[]
    @strategy.sort(data)
  end
end

sorter = Sorter.new(QuickSort.new)
sorted = sorter.sort([3, 1, 4, 1, 5, 9, 2, 6])
```

### Factory Pattern

```trb title="factory.trb"
abstract class Document
  def initialize(title: String)
    @title = title
  end

  def render(): String
    raise NotImplementedError, "Must implement render()"
  end
end

class PDFDocument < Document
  def render(): String
    "Rendering PDF: #{@title}"
  end
end

class WordDocument < Document
  def render(): String
    "Rendering Word: #{@title}"
  end
end

class DocumentFactory
  def create_document(type: String, title: String): Document
    case type
    when "pdf"
      PDFDocument.new(title)
    when "word"
      WordDocument.new(title)
    else
      raise "Unknown document type"
    end
  end
end
```

## Summary

Abstract classes in T-Ruby provide:

- **Template definitions** for subclasses to follow
- **Partial implementations** with concrete helper methods
- **Type-safe contracts** ensuring subclasses implement required methods
- **Polymorphism** allowing subclasses to be used interchangeably

Use abstract classes when you have a family of related classes that share common behavior but differ in specific implementations. They're perfect for template methods, strategies, and plugin architectures.
