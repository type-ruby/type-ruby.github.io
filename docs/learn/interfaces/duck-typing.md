---
sidebar_position: 3
title: Duck Typing
description: Structural typing and duck typing in T-Ruby
---

# Duck Typing

"If it walks like a duck and quacks like a duck, then it must be a duck." Duck typing is a form of structural typing where type compatibility is determined by the presence of methods and properties, not by explicit interface implementation. T-Ruby supports duck typing while maintaining type safety.

## Understanding Duck Typing

In duck typing, you don't need to explicitly implement an interface—you just need to have the required methods:

```ruby title="duck_typing_basic.trb"
# No interface needed
def print_object(obj: { def to_string(): String }): void
  puts obj.to_string()
end

class User
  def initialize(name: String)
    @name = name
  end

  def to_string(): String
    "User: #{@name}"
  end
end

class Product
  def initialize(name: String)
    @name = name
  end

  def to_string(): String
    "Product: #{@name}"
  end
end

# Both work without implementing an interface
user = User.new("Alice")
product = Product.new("Laptop")

print_object(user)     # "User: Alice"
print_object(product)  # "Product: Laptop"
```

## Structural Type Syntax

Define structural types inline using object literal syntax:

```ruby title="structural_types.trb"
# Structural type definition
type Printable = {
  def print(): void
  def get_name(): String
}

def print_item(item: Printable): void
  puts "Printing: #{item.get_name()}"
  item.print()
end

class Document
  def initialize(title: String)
    @title = title
  end

  def print(): void
    puts "Document: #{@title}"
  end

  def get_name(): String
    @title
  end
end

class Report
  def initialize(name: String)
    @name = name
  end

  def print(): void
    puts "Report: #{@name}"
  end

  def get_name(): String
    @name
  end
end

# Both classes satisfy the structural type
doc = Document.new("Manual")
report = Report.new("Q4 Results")

print_item(doc)
print_item(report)
```

## Anonymous Structural Types

Use structural types directly without naming them:

```ruby title="anonymous_types.trb"
def process_data(
  source: { def read(): String },
  destination: { def write(content: String): void }
): void
  data = source.read()
  destination.write(data)
end

class FileReader
  def initialize(path: String)
    @path = path
  end

  def read(): String
    "File content from #{@path}"
  end
end

class DatabaseWriter
  def write(content: String): void
    puts "Writing to database: #{content}"
  end
end

class ConsoleWriter
  def write(content: String): void
    puts "Console: #{content}"
  end
end

# Usage
reader = FileReader.new("/path/to/file")
db_writer = DatabaseWriter.new
console_writer = ConsoleWriter.new

process_data(reader, db_writer)
process_data(reader, console_writer)
```

## Complex Structural Types

Structural types can define multiple methods and property signatures:

```ruby title="complex_structural.trb"
type Repository = {
  def find(id: Integer): Hash<String, String>?
  def save(data: Hash<String, String>): Boolean
  def delete(id: Integer): Boolean
  def count(): Integer
}

class MemoryRepository
  def initialize()
    @data: Hash<Integer, Hash<String, String>> = {}
    @next_id: Integer = 1
  end

  def find(id: Integer): Hash<String, String>?
    @data[id]
  end

  def save(data: Hash<String, String>): Boolean
    @data[@next_id] = data
    @next_id += 1
    true
  end

  def delete(id: Integer): Boolean
    if @data.key?(id)
      @data.delete(id)
      true
    else
      false
    end
  end

  def count(): Integer
    @data.length
  end
end

class FileRepository
  def initialize(path: String)
    @path = path
    @data: Hash<Integer, Hash<String, String>> = {}
  end

  def find(id: Integer): Hash<String, String>?
    @data[id]
  end

  def save(data: Hash<String, String>): Boolean
    # Save to file
    true
  end

  def delete(id: Integer): Boolean
    @data.key?(id) && @data.delete(id) != nil
  end

  def count(): Integer
    @data.length
  end
end

def use_repository(repo: Repository): void
  repo.save({ "name" => "Test" })
  puts "Repository has #{repo.count()} items"
end

# Both work with the same function
memory_repo = MemoryRepository.new
file_repo = FileRepository.new("/data")

use_repository(memory_repo)
use_repository(file_repo)
```

## Duck Typing vs Interfaces

Compare explicit interfaces with duck typing:

```ruby title="comparison.trb"
# Explicit interface approach
interface Logger
  def log(message: String): void
  def error(message: String): void
end

class ConsoleLogger
  implements Logger

  def log(message: String): void
    puts message
  end

  def error(message: String): void
    puts "ERROR: #{message}"
  end
end

# Duck typing approach (no implements keyword)
class FileLogger
  def log(message: String): void
    # Write to file
    puts "Logging to file: #{message}"
  end

  def error(message: String): void
    puts "ERROR to file: #{message}"
  end
end

# Both work with duck typing parameter
def use_logger(logger: { def log(message: String): void }): void
  logger.log("Application started")
end

console = ConsoleLogger.new
file = FileLogger.new

use_logger(console)  # Works - implements Logger
use_logger(file)     # Works - has log method (duck typing)
```

## Structural Subtyping

Objects with more methods than required still satisfy structural types:

```ruby title="subtyping.trb"
type BasicLogger = {
  def log(message: String): void
}

class AdvancedLogger
  def log(message: String): void
    puts message
  end

  def debug(message: String): void
    puts "DEBUG: #{message}"
  end

  def warn(message: String): void
    puts "WARN: #{message}"
  end

  def error(message: String): void
    puts "ERROR: #{message}"
  end
end

# AdvancedLogger satisfies BasicLogger requirement
def simple_logging(logger: BasicLogger): void
  logger.log("Message")
  # Can only call log() here, even though logger has more methods
end

advanced = AdvancedLogger.new
simple_logging(advanced)  # Works - structural subtyping
```

## Generic Structural Types

Combine generics with structural typing:

```ruby title="generic_structural.trb"
def transform<T, U>(
  items: Array<T>,
  transformer: { def transform(item: T): U }
): Array<U>
  items.map { |item| transformer.transform(item) }
end

class StringToInt
  def transform(item: String): Integer
    item.to_i
  end
end

class IntToString
  def transform(item: Integer): String
    item.to_s
  end
end

class DoubleTransformer
  def transform(item: Integer): Integer
    item * 2
  end
end

# All work with the same generic function
strings = ["1", "2", "3"]
string_to_int = StringToInt.new
integers = transform(strings, string_to_int)  # [1, 2, 3]

numbers = [1, 2, 3]
int_to_string = IntToString.new
strings_result = transform(numbers, int_to_string)  # ["1", "2", "3"]

doubler = DoubleTransformer.new
doubled = transform(numbers, doubler)  # [2, 4, 6]
```

## Practical Example: Plugin System

Using duck typing for a flexible plugin architecture:

```ruby title="plugin_duck_typing.trb"
type Plugin = {
  def name(): String
  def execute(): void
}

type ConfigurablePlugin = {
  def name(): String
  def execute(): void
  def configure(options: Hash<String, String>): void
}

class SimplePlugin
  def name(): String
    "Simple Plugin"
  end

  def execute(): void
    puts "Executing #{name()}"
  end
end

class AdvancedPlugin
  def initialize()
    @config: Hash<String, String> = {}
  end

  def name(): String
    "Advanced Plugin"
  end

  def execute(): void
    level = @config["level"] || "default"
    puts "Executing #{name()} at level #{level}"
  end

  def configure(options: Hash<String, String>): void
    @config = options
  end
end

class PluginRunner
  def run_plugin(plugin: Plugin): void
    puts "Running: #{plugin.name()}"
    plugin.execute()
  end

  def run_configurable(plugin: ConfigurablePlugin, config: Hash<String, String>): void
    plugin.configure(config)
    run_plugin(plugin)  # ConfigurablePlugin satisfies Plugin
  end
end

runner = PluginRunner.new

simple = SimplePlugin.new
runner.run_plugin(simple)

advanced = AdvancedPlugin.new
runner.run_configurable(advanced, { "level" => "high" })
```

## Practical Example: Data Pipeline

Duck typing for flexible data processing:

```ruby title="data_pipeline.trb"
type DataSource = {
  def read(): Array<Hash<String, String>>
}

type DataProcessor = {
  def process(data: Array<Hash<String, String>>): Array<Hash<String, String>>
}

type DataSink = {
  def write(data: Array<Hash<String, String>>): void
}

class CSVSource
  def initialize(path: String)
    @path = path
  end

  def read(): Array<Hash<String, String>>
    # Read CSV file
    [{ "name" => "Alice", "age" => "30" }]
  end
end

class JSONSource
  def initialize(url: String)
    @url = url
  end

  def read(): Array<Hash<String, String>>
    # Fetch JSON from URL
    [{ "name" => "Bob", "age" => "25" }]
  end
end

class FilterProcessor
  def initialize(field: String, value: String)
    @field = field
    @value = value
  end

  def process(data: Array<Hash<String, String>>): Array<Hash<String, String>>
    data.select { |row| row[@field] == @value }
  end
end

class TransformProcessor
  def process(data: Array<Hash<String, String>>): Array<Hash<String, String>>
    data.map do |row|
      row.merge({ "processed" => "true" })
    end
  end
end

class DatabaseSink
  def write(data: Array<Hash<String, String>>): void
    puts "Writing #{data.length} rows to database"
    data.each { |row| puts "  #{row}" }
  end
end

class FileSink
  def initialize(path: String)
    @path = path
  end

  def write(data: Array<Hash<String, String>>): void
    puts "Writing #{data.length} rows to #{@path}"
  end
end

class Pipeline
  def initialize(source: DataSource, sink: DataSink)
    @source = source
    @sink = sink
    @processors: Array<DataProcessor> = []
  end

  def add_processor(processor: DataProcessor): void
    @processors.push(processor)
  end

  def execute(): void
    data = @source.read()
    @processors.each do |processor|
      data = processor.process(data)
    end
    @sink.write(data)
  end
end

# Build pipeline with different combinations
csv_source = CSVSource.new("/data/input.csv")
json_source = JSONSource.new("https://api.example.com/data")

filter = FilterProcessor.new("age", "30")
transform = TransformProcessor.new

db_sink = DatabaseSink.new
file_sink = FileSink.new("/data/output.csv")

# Pipeline 1: CSV -> Filter -> Transform -> Database
pipeline1 = Pipeline.new(csv_source, db_sink)
pipeline1.add_processor(filter)
pipeline1.add_processor(transform)
pipeline1.execute()

# Pipeline 2: JSON -> Transform -> File
pipeline2 = Pipeline.new(json_source, file_sink)
pipeline2.add_processor(transform)
pipeline2.execute()
```

## Practical Example: Event System

Flexible event handling with duck typing:

```ruby title="event_system.trb"
type EventHandler = {
  def handle(event: Hash<String, String>): void
}

type AsyncEventHandler = {
  def handle(event: Hash<String, String>): void
  def handle_async(event: Hash<String, String>): void
}

class LogHandler
  def handle(event: Hash<String, String>): void
    puts "Log: #{event['type']} - #{event['message']}"
  end
end

class EmailHandler
  def handle(event: Hash<String, String>): void
    puts "Sending email for: #{event['type']}"
  end

  def handle_async(event: Hash<String, String>): void
    puts "Queueing email for: #{event['type']}"
  end
end

class MetricsHandler
  def handle(event: Hash<String, String>): void
    puts "Recording metric: #{event['type']}"
  end
end

class EventBus
  def initialize()
    @handlers: Array<EventHandler> = []
  end

  def subscribe(handler: EventHandler): void
    @handlers.push(handler)
  end

  def publish(event: Hash<String, String>): void
    @handlers.each { |handler| handler.handle(event) }
  end

  def publish_async(event: Hash<String, String>): void
    @handlers.each do |handler|
      # Check if handler supports async
      if handler.respond_to?(:handle_async)
        handler.handle_async(event)
      else
        handler.handle(event)
      end
    end
  end
end

# Usage
bus = EventBus.new
bus.subscribe(LogHandler.new)
bus.subscribe(EmailHandler.new)
bus.subscribe(MetricsHandler.new)

event = { "type" => "user_signup", "message" => "New user registered" }
bus.publish(event)
bus.publish_async(event)
```

## Best Practices

1. **Use structural types for flexibility**: When you need flexibility and don't want to enforce explicit interface implementation.

2. **Use interfaces for contracts**: When you want explicit contracts and documentation of requirements.

3. **Keep structural types simple**: Complex structural types can be harder to understand than named interfaces.

4. **Document expectations**: Clearly document what methods and behaviors are expected, even with duck typing.

5. **Consider future maintenance**: Explicit interfaces can make refactoring easier by showing all implementations.

6. **Combine approaches**: Use interfaces for core contracts and duck typing for flexible, optional features.

## When to Use Duck Typing

**Use duck typing when:**
- Working with third-party code you can't modify
- Building highly flexible, plugin-style architectures
- Prototyping and iteration speed is important
- You want to avoid deep inheritance hierarchies
- Different classes naturally have similar methods but aren't related

**Use explicit interfaces when:**
- Defining public APIs and contracts
- You want IDE support for all implementations
- Documentation and discoverability are important
- You're building frameworks or libraries
- Type safety is critical

## Summary

Duck typing in T-Ruby provides:

- **Structural typing** based on method presence, not explicit implementation
- **Flexibility** to work with any object that has the required methods
- **Type safety** ensuring objects have the methods you call
- **Gradual typing** combining strict interfaces with flexible duck typing

Master both explicit interfaces and duck typing to write flexible, type-safe T-Ruby code. Choose the right approach for each situation based on your needs for flexibility, type safety, and maintainability.
