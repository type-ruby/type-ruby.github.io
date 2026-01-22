---
sidebar_position: 1
title: 인터페이스 정의하기
description: T-Ruby에서 인터페이스를 정의하는 방법
---

<DocsBadge />


# 인터페이스 정의하기

인터페이스는 클래스가 충족해야 하는 계약을 정의합니다. T-Ruby에서 인터페이스는 구현 세부 사항 없이 클래스가 구현해야 하는 메서드를 지정합니다. 이를 통해 다형성을 가능하게 하고 유연하고 유지보수 가능한 코드를 만들 수 있습니다.

## 기본 인터페이스 정의

`interface` 키워드를 사용하여 인터페이스를 정의합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={25} />

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

# 사용법
def print_item(item: Printable): void
  item.print()
end

doc = Document.new("Hello World")
img = Image.new("https://example.com/image.jpg")

print_item(doc)  # "Hello World"
print_item(img)  # "Printing image from https://example.com/image.jpg"
```

## 매개변수가 있는 인터페이스 메서드

인터페이스는 매개변수가 있는 메서드를 정의할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={36} />

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

# 사용법
v1 = Version.new(1, 2, 3)
v2 = Version.new(1, 2, 4)

puts v1.less_than?(v2)      # true
puts v2.greater_than?(v1)   # true
puts v1.equals?(v2)         # false
```

## 제네릭 인터페이스

인터페이스는 모든 타입과 작동하도록 제네릭이 될 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={47} />

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
    @items: T[] = []
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

# 사용법
string_stack: Container<String> = Stack<String>.new
string_stack.add("Hello")
string_stack.add("World")
puts string_stack.size()        # 2
puts string_stack.contains("Hello")  # true
```

## 다중 메서드 인터페이스

인터페이스는 많은 메서드를 정의할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={58} />

```trb title="multiple_methods.trb"
interface Repository<T>
  def find(id: Integer): T?
  def find_all(): T[]
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

  def find_all(): User[]
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

## 인터페이스 상속

인터페이스는 다른 인터페이스를 확장할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={69} />

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

# 사용법
file = File.new("/path/to/file.txt")
file.write("Hello")
file.append(" World")
puts file.read()  # "Hello World"
file.clear()
puts file.read()  # ""
```

## 속성이 있는 인터페이스

인터페이스에서 필수 속성을 정의합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={80} />

```trb title="interface_properties.trb"
interface Identifiable
  def id(): Integer
  def name(): String
  def created_at(): Time
end

interface Taggable
  def tags(): String[]
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
    @tags: String[] = []
  end

  def tags(): String[]
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

## 실전 예제: 플러그인 시스템

플러그인 아키텍처를 위해 인터페이스를 사용하는 완전한 예제:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={91} />

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
    @plugins: Plugin[] = []
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

# 사용법
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

## 실전 예제: 데이터 직렬화

다양한 직렬화 형식을 위한 인터페이스:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={102} />

```trb title="serialization.trb"
interface Serializer
  def serialize(data: Hash<String, String | Integer | Boolean>): String
  def deserialize(text: String): Hash<String, String | Integer | Boolean>
  def format(): String
end

class JSONSerializer
  implements Serializer

  def serialize(data: Hash<String, String | Integer | Boolean>): String
    # JSON 직렬화
    data.to_json
  end

  def deserialize(text: String): Hash<String, String | Integer | Boolean>
    # JSON 역직렬화
    JSON.parse(text)
  end

  def format(): String
    "json"
  end
end

class XMLSerializer
  implements Serializer

  def serialize(data: Hash<String, String | Integer | Boolean>): String
    # XML 직렬화
    xml = "<root>"
    data.each do |key, value|
      xml += "<#{key}>#{value}</#{key}>"
    end
    xml += "</root>"
    xml
  end

  def deserialize(text: String): Hash<String, String | Integer | Boolean>
    # XML 역직렬화 (간소화됨)
    {}
  end

  def format(): String
    "xml"
  end
end

class YAMLSerializer
  implements Serializer

  def serialize(data: Hash<String, String | Integer | Boolean>): String
    # YAML 직렬화
    data.to_yaml
  end

  def deserialize(text: String): Hash<String, String | Integer | Boolean>
    # YAML 역직렬화
    YAML.load(text)
  end

  def format(): String
    "yaml"
  end
end

# 직렬화 서비스
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

# 사용법
data = { "name" => "Alice", "age" => 30, "active" => true }

json_service = SerializationService.new(JSONSerializer.new)
json_service.save(data, "user")

xml_service = SerializationService.new(XMLSerializer.new)
xml_service.save(data, "user")

yaml_service = SerializationService.new(YAMLSerializer.new)
yaml_service.save(data, "user")
```

## 모범 사례

1. **인터페이스를 작고 집중적으로 유지**: 인터페이스 분리 원칙을 따르세요 - 하나의 큰 인터페이스보다 여러 개의 작은 인터페이스가 좋습니다.

2. **설명적인 이름 사용**: 인터페이스 이름은 기능을 명확하게 설명해야 합니다 (예: `Serializable`, `Comparable`, `Printable`).

3. **모든 메서드 시그니처에 타입 지정**: 모든 인터페이스 메서드는 완전한 타입 어노테이션을 가져야 합니다.

4. **인터페이스 계약 문서화**: 각 메서드가 무엇을 해야 하는지와 제약 조건을 명확하게 문서화하세요.

5. **유연성을 위해 제네릭 사용**: 제네릭 인터페이스는 타입 안전성을 유지하면서 많은 타입과 작동할 수 있습니다.

6. **메서드 응집도 고려**: 인터페이스의 메서드는 관련되어 있고 함께 작동해야 합니다.

## 일반적인 인터페이스 패턴

### 이터레이터 인터페이스

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={113} />

```trb title="iterator.trb"
interface Iterator<T>
  def has_next?(): Boolean
  def next(): T
  def reset(): void
end

class ArrayIterator<T>
  implements Iterator<T>

  def initialize(items: T[])
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

### 옵저버 인터페이스

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={124} />

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

### 빌더 인터페이스

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/interfaces/defining_interfaces_spec.rb" line={135} />

```trb title="builder.trb"
interface Builder<T>
  def reset(): void
  def build(): T
end

interface QueryBuilder extends Builder<String>
  def select(fields: String[]): QueryBuilder
  def from(table: String): QueryBuilder
  def where(condition: String): QueryBuilder
end
```

## 요약

T-Ruby의 인터페이스는 다음을 제공합니다:

- **계약**: 클래스가 반드시 구현해야 하는 것
- **다형성**: 서로 다른 클래스를 상호 교환적으로 사용 가능
- **타입 안전성**: 구현이 인터페이스와 일치하는지 확인
- **유연성**: 제네릭 및 조합 가능한 인터페이스를 통해

코드베이스에서 기능과 계약을 정의하기 위해 인터페이스를 사용하세요. 유지보수 가능하고 테스트 가능하며 유연한 애플리케이션을 구축하는 데 필수적입니다.
