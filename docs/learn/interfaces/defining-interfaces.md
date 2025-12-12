---
sidebar_position: 1
title: Defining Interfaces
description: How to define interfaces in T-Ruby
---

<DocsBadge />


# Defining Interfaces

Interfaces define contracts that classes must fulfill. In T-Ruby, interfaces specify what methods a class must implement without providing the implementation details. This enables polymorphism and helps create flexible, maintainable code.

## Basic Interface Definition

Define interfaces using the `interface` keyword:

```trb title="basic_interface.trb"
interface Printable
  def print(): void
  def to_string(): String
end

class Document
  implements Printable

  attr_accessor :content: String

  def initialize(content: String)
    @content = content
  end

  def print(): void
    puts @content
  end

  def to_string(): String
    @content
  end
end

class Image
  implements Printable

  attr_accessor :url: String

  def initialize(url: String)
    @url = url
  end

  def print(): void
    puts "Printing image from #{@url}"
  end

  def to_string(): String
    "Image: #{@url}"
  end
end

# Usage
def print_item(item: Printable): void
  item.print()
end

doc = Document.new("Hello World")
img = Image.new("https://example.com/image.jpg")

print_item(doc)  # "Hello World"
print_item(img)  # "Printing image from https://example.com/image.jpg"
```

## Interface Methods with Parameters

Interfaces can define methods with parameters:

```trb title="interface_parameters.trb"
interface Comparable<T>
  def compare_to(other: T): Integer
  def equals?(other: T): Boolean
  def greater_than?(other: T): Boolean
  def less_than?(other: T): Boolean
end

class Version
  implements Comparable<Version>

  attr_reader :major: Integer
  attr_reader :minor: Integer
  attr_reader :patch: Integer

  def initialize(major: Integer, minor: Integer, patch: Integer)
    @major = major
    @minor = minor
    @patch = patch
  end

  def compare_to(other: Version): Integer
    if @major != other.major
      @major <=> other.major
    elsif @minor != other.minor
      @minor <=> other.minor
    else
      @patch <=> other.patch
    end
  end

  def equals?(other: Version): Boolean
    compare_to(other) == 0
  end

  def greater_than?(other: Version): Boolean
    compare_to(other) > 0
  end

  def less_than?(other: Version): Boolean
    compare_to(other) < 0
  end
end

# Usage
v1 = Version.new(1, 2, 3)
v2 = Version.new(1, 2, 4)

puts v1.less_than?(v2)      # true
puts v2.greater_than?(v1)   # true
puts v1.equals?(v2)         # false
```

## Generic Interfaces

Interfaces can be generic to work with any type:

```trb title="generic_interface.trb"
interface Container<T>
  def add(item: T): void
  def remove(item: T): Boolean
  def contains(item: T): Boolean
  def size(): Integer
  def is_empty?(): Boolean
  def clear(): void
end

class Stack<T>
  implements Container<T>

  def initialize()
    @items: Array<T> = []
  end

  def add(item: T): void
    @items.push(item)
  end

  def remove(item: T): Boolean
    index = @items.index(item)
    if index
      @items.delete_at(index)
      true
    else
      false
    end
  end

  def contains(item: T): Boolean
    @items.include?(item)
  end

  def size(): Integer
    @items.length
  end

  def is_empty?(): Boolean
    @items.empty?
  end

  def clear(): void
    @items.clear()
  end

  def pop(): T?
    @items.pop
  end

  def peek(): T?
    @items.last
  end
end

# Usage
string_stack: Container<String> = Stack<String>.new
string_stack.add("Hello")
string_stack.add("World")
puts string_stack.size()        # 2
puts string_stack.contains("Hello")  # true
```

## Multiple Method Interface

Interfaces can define many methods:

```trb title="multiple_methods.trb"
interface Repository<T>
  def find(id: Integer): T?
  def find_all(): Array<T>
  def create(entity: T): T
  def update(id: Integer, entity: T): Boolean
  def delete(id: Integer): Boolean
  def exists?(id: Integer): Boolean
  def count(): Integer
end

class UserRepository
  implements Repository<User>

  def initialize()
    @users: Hash<Integer, User> = {}
    @next_id: Integer = 1
  end

  def find(id: Integer): User?
    @users[id]
  end

  def find_all(): Array<User>
    @users.values
  end

  def create(user: User): User
    user.id = @next_id
    @users[@next_id] = user
    @next_id += 1
    user
  end

  def update(id: Integer, user: User): Boolean
    if @users.key?(id)
      @users[id] = user
      true
    else
      false
    end
  end

  def delete(id: Integer): Boolean
    if @users.key?(id)
      @users.delete(id)
      true
    else
      false
    end
  end

  def exists?(id: Integer): Boolean
    @users.key?(id)
  end

  def count(): Integer
    @users.length
  end
end

class User
  attr_accessor :id: Integer?
  attr_accessor :name: String
  attr_accessor :email: String

  def initialize(name: String, email: String)
    @id = nil
    @name = name
    @email = email
  end
end
```

## Interface Inheritance

Interfaces can extend other interfaces:

```trb title="interface_inheritance.trb"
interface Readable
  def read(): String
end

interface Writable
  def write(content: String): void
end

interface ReadWrite extends Readable, Writable
  def append(content: String): void
  def clear(): void
end

class File
  implements ReadWrite

  def initialize(path: String)
    @path = path
    @content: String = ""
  end

  def read(): String
    @content
  end

  def write(content: String): void
    @content = content
  end

  def append(content: String): void
    @content += content
  end

  def clear(): void
    @content = ""
  end
end

# Usage
file = File.new("/path/to/file.txt")
file.write("Hello")
file.append(" World")
puts file.read()  # "Hello World"
file.clear()
puts file.read()  # ""
```

## Interfaces with Properties

Define required properties in interfaces:

```trb title="interface_properties.trb"
interface Identifiable
  def id(): Integer
  def name(): String
  def created_at(): Time
end

interface Taggable
  def tags(): Array<String>
  def add_tag(tag: String): void
  def remove_tag(tag: String): void
  def has_tag?(tag: String): Boolean
end

class BlogPost
  implements Identifiable, Taggable

  attr_reader :id: Integer
  attr_reader :name: String
  attr_reader :created_at: Time

  def initialize(id: Integer, name: String)
    @id = id
    @name = name
    @created_at = Time.now
    @tags: Array<String> = []
  end

  def tags(): Array<String>
    @tags
  end

  def add_tag(tag: String): void
    @tags.push(tag) unless @tags.include?(tag)
  end

  def remove_tag(tag: String): void
    @tags.delete(tag)
  end

  def has_tag?(tag: String): Boolean
    @tags.include?(tag)
  end
end
```

## Practical Example: Plugin System

A complete example using interfaces for a plugin architecture:

```trb title="plugin_system.trb"
interface Plugin
  def name(): String
  def version(): String
  def initialize_plugin(): void
  def execute(): void
  def shutdown(): void
  def is_enabled?(): Boolean
end

interface Configurable
  def configure(options: Hash<String, String | Integer | Boolean>): void
  def get_config(key: String): String | Integer | Boolean | nil
end

class LoggerPlugin
  implements Plugin, Configurable

  def initialize()
    @enabled: Boolean = true
    @config: Hash<String, String | Integer | Boolean> = {}
  end

  def name(): String
    "Logger Plugin"
  end

  def version(): String
    "1.0.0"
  end

  def initialize_plugin(): void
    puts "Initializing #{name()} v#{version()}"
  end

  def execute(): void
    log_level = get_config("level") || "info"
    puts "[#{log_level.to_s.upcase}] Plugin executing"
  end

  def shutdown(): void
    puts "Shutting down #{name()}"
  end

  def is_enabled?(): Boolean
    @enabled
  end

  def configure(options: Hash<String, String | Integer | Boolean>): void
    @config = options
  end

  def get_config(key: String): String | Integer | Boolean | nil
    @config[key]
  end
end

class CachePlugin
  implements Plugin, Configurable

  def initialize()
    @enabled: Boolean = true
    @config: Hash<String, String | Integer | Boolean> = {}
    @cache: Hash<String, String> = {}
  end

  def name(): String
    "Cache Plugin"
  end

  def version(): String
    "2.0.0"
  end

  def initialize_plugin(): void
    max_size = get_config("max_size") || 100
    puts "Initializing #{name()} with max size #{max_size}"
  end

  def execute(): void
    puts "Cache has #{@cache.length} items"
  end

  def shutdown(): void
    @cache.clear()
    puts "Cache cleared and shutdown"
  end

  def is_enabled?(): Boolean
    @enabled
  end

  def configure(options: Hash<String, String | Integer | Boolean>): void
    @config = options
  end

  def get_config(key: String): String | Integer | Boolean | nil
    @config[key]
  end
end

class PluginManager
  def initialize()
    @plugins: Array<Plugin> = []
  end

  def register(plugin: Plugin): void
    @plugins.push(plugin)
  end

  def initialize_all(): void
    @plugins.each do |plugin|
      plugin.initialize_plugin() if plugin.is_enabled?()
    end
  end

  def execute_all(): void
    @plugins.each do |plugin|
      plugin.execute() if plugin.is_enabled?()
    end
  end

  def shutdown_all(): void
    @plugins.each do |plugin|
      plugin.shutdown() if plugin.is_enabled?()
    end
  end
end

# Usage
manager = PluginManager.new

logger = LoggerPlugin.new
logger.configure({ "level" => "debug" })
manager.register(logger)

cache = CachePlugin.new
cache.configure({ "max_size" => 200 })
manager.register(cache)

manager.initialize_all()
manager.execute_all()
manager.shutdown_all()
```

## Practical Example: Data Serialization

Interfaces for various serialization formats:

```trb title="serialization.trb"
interface Serializer
  def serialize(data: Hash<String, String | Integer | Boolean>): String
  def deserialize(text: String): Hash<String, String | Integer | Boolean>
  def format(): String
end

class JSONSerializer
  implements Serializer

  def serialize(data: Hash<String, String | Integer | Boolean>): String
    # JSON serialization
    data.to_json
  end

  def deserialize(text: String): Hash<String, String | Integer | Boolean>
    # JSON deserialization
    JSON.parse(text)
  end

  def format(): String
    "json"
  end
end

class XMLSerializer
  implements Serializer

  def serialize(data: Hash<String, String | Integer | Boolean>): String
    # XML serialization
    xml = "<root>"
    data.each do |key, value|
      xml += "<#{key}>#{value}</#{key}>"
    end
    xml += "</root>"
    xml
  end

  def deserialize(text: String): Hash<String, String | Integer | Boolean>
    # XML deserialization (simplified)
    {}
  end

  def format(): String
    "xml"
  end
end

class YAMLSerializer
  implements Serializer

  def serialize(data: Hash<String, String | Integer | Boolean>): String
    # YAML serialization
    data.to_yaml
  end

  def deserialize(text: String): Hash<String, String | Integer | Boolean>
    # YAML deserialization
    YAML.load(text)
  end

  def format(): String
    "yaml"
  end
end

# Serialization service
class SerializationService
  def initialize(serializer: Serializer)
    @serializer = serializer
  end

  def save(data: Hash<String, String | Integer | Boolean>, filename: String): void
    content = @serializer.serialize(data)
    File.write("#{filename}.#{@serializer.format()}", content)
    puts "Saved as #{@serializer.format()}"
  end

  def load(filename: String): Hash<String, String | Integer | Boolean>
    content = File.read("#{filename}.#{@serializer.format()}")
    @serializer.deserialize(content)
  end
end

# Usage
data = { "name" => "Alice", "age" => 30, "active" => true }

json_service = SerializationService.new(JSONSerializer.new)
json_service.save(data, "user")

xml_service = SerializationService.new(XMLSerializer.new)
xml_service.save(data, "user")

yaml_service = SerializationService.new(YAMLSerializer.new)
yaml_service.save(data, "user")
```

## Best Practices

1. **Keep interfaces small and focused**: Follow the Interface Segregation Principle - better to have multiple small interfaces than one large one.

2. **Use descriptive names**: Interface names should clearly describe the capability (e.g., `Serializable`, `Comparable`, `Printable`).

3. **Type all method signatures**: Every interface method should have full type annotations.

4. **Document interface contracts**: Clearly document what each method should do and any constraints.

5. **Use generics for flexibility**: Generic interfaces can work with many types while maintaining type safety.

6. **Consider method cohesion**: Methods in an interface should be related and work together.

## Common Interface Patterns

### Iterator Interface

```trb title="iterator.trb"
interface Iterator<T>
  def has_next?(): Boolean
  def next(): T
  def reset(): void
end

class ArrayIterator<T>
  implements Iterator<T>

  def initialize(items: Array<T>)
    @items = items
    @position = 0
  end

  def has_next?(): Boolean
    @position < @items.length
  end

  def next(): T
    item = @items[@position]
    @position += 1
    item
  end

  def reset(): void
    @position = 0
  end
end
```

### Observer Interface

```trb title="observer.trb"
interface Observer
  def update(event: String, data: Hash<String, String>): void
end

interface Observable
  def attach(observer: Observer): void
  def detach(observer: Observer): void
  def notify(event: String, data: Hash<String, String>): void
end
```

### Builder Interface

```trb title="builder.trb"
interface Builder<T>
  def reset(): void
  def build(): T
end

interface QueryBuilder extends Builder<String>
  def select(fields: Array<String>): QueryBuilder
  def from(table: String): QueryBuilder
  def where(condition: String): QueryBuilder
end
```

## Summary

Interfaces in T-Ruby provide:

- **Contracts** that classes must implement
- **Polymorphism** allowing different classes to be used interchangeably
- **Type safety** ensuring implementations match the interface
- **Flexibility** through generic and composable interfaces

Use interfaces to define capabilities and contracts in your codebase. They're essential for building maintainable, testable, and flexible applications.
