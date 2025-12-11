---
sidebar_position: 3
title: 덕 타이핑
description: T-Ruby의 구조적 타이핑과 덕 타이핑
---

# 덕 타이핑

"오리처럼 걷고 오리처럼 꽥꽥거린다면, 그것은 오리임이 틀림없다." 덕 타이핑은 명시적 인터페이스 구현이 아닌 메서드와 속성의 존재에 의해 타입 호환성이 결정되는 구조적 타이핑의 한 형태입니다. T-Ruby는 타입 안전성을 유지하면서 덕 타이핑을 지원합니다.

## 덕 타이핑 이해하기

덕 타이핑에서는 인터페이스를 명시적으로 구현할 필요가 없습니다—필요한 메서드만 가지고 있으면 됩니다:

```ruby title="duck_typing_basic.trb"
# 인터페이스 필요 없음
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

# 둘 다 인터페이스 구현 없이 동작
user = User.new("Alice")
product = Product.new("Laptop")

print_object(user)     # "User: Alice"
print_object(product)  # "Product: Laptop"
```

## 구조적 타입 문법

객체 리터럴 문법을 사용하여 인라인으로 구조적 타입을 정의합니다:

```ruby title="structural_types.trb"
# 구조적 타입 정의
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

# 두 클래스 모두 구조적 타입을 만족
doc = Document.new("Manual")
report = Report.new("Q4 Results")

print_item(doc)
print_item(report)
```

## 익명 구조적 타입

이름을 붙이지 않고 구조적 타입을 직접 사용합니다:

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

# 사용법
reader = FileReader.new("/path/to/file")
db_writer = DatabaseWriter.new
console_writer = ConsoleWriter.new

process_data(reader, db_writer)
process_data(reader, console_writer)
```

## 복잡한 구조적 타입

구조적 타입은 여러 메서드와 속성 시그니처를 정의할 수 있습니다:

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
    # 파일에 저장
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

# 둘 다 같은 함수와 동작
memory_repo = MemoryRepository.new
file_repo = FileRepository.new("/data")

use_repository(memory_repo)
use_repository(file_repo)
```

## 덕 타이핑 vs 인터페이스

명시적 인터페이스와 덕 타이핑 비교:

```ruby title="comparison.trb"
# 명시적 인터페이스 접근법
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

# 덕 타이핑 접근법 (implements 키워드 없음)
class FileLogger
  def log(message: String): void
    # 파일에 쓰기
    puts "Logging to file: #{message}"
  end

  def error(message: String): void
    puts "ERROR to file: #{message}"
  end
end

# 둘 다 덕 타이핑 매개변수와 동작
def use_logger(logger: { def log(message: String): void }): void
  logger.log("Application started")
end

console = ConsoleLogger.new
file = FileLogger.new

use_logger(console)  # 동작 - Logger 구현
use_logger(file)     # 동작 - log 메서드 있음 (덕 타이핑)
```

## 구조적 서브타이핑

필요한 것보다 더 많은 메서드를 가진 객체도 구조적 타입을 만족합니다:

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

# AdvancedLogger는 BasicLogger 요구사항을 만족
def simple_logging(logger: BasicLogger): void
  logger.log("Message")
  # 로거가 더 많은 메서드를 가지고 있어도 여기서는 log()만 호출 가능
end

advanced = AdvancedLogger.new
simple_logging(advanced)  # 동작 - 구조적 서브타이핑
```

## 제네릭 구조적 타입

제네릭과 구조적 타이핑 결합:

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

# 모두 같은 제네릭 함수와 동작
strings = ["1", "2", "3"]
string_to_int = StringToInt.new
integers = transform(strings, string_to_int)  # [1, 2, 3]

numbers = [1, 2, 3]
int_to_string = IntToString.new
strings_result = transform(numbers, int_to_string)  # ["1", "2", "3"]

doubler = DoubleTransformer.new
doubled = transform(numbers, doubler)  # [2, 4, 6]
```

## 실전 예제: 플러그인 시스템

유연한 플러그인 아키텍처를 위한 덕 타이핑 사용:

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
    run_plugin(plugin)  # ConfigurablePlugin은 Plugin을 만족
  end
end

runner = PluginRunner.new

simple = SimplePlugin.new
runner.run_plugin(simple)

advanced = AdvancedPlugin.new
runner.run_configurable(advanced, { "level" => "high" })
```

## 실전 예제: 데이터 파이프라인

유연한 데이터 처리를 위한 덕 타이핑:

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
    # CSV 파일 읽기
    [{ "name" => "Alice", "age" => "30" }]
  end
end

class JSONSource
  def initialize(url: String)
    @url = url
  end

  def read(): Array<Hash<String, String>>
    # URL에서 JSON 가져오기
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

# 다양한 조합으로 파이프라인 구성
csv_source = CSVSource.new("/data/input.csv")
json_source = JSONSource.new("https://api.example.com/data")

filter = FilterProcessor.new("age", "30")
transform = TransformProcessor.new

db_sink = DatabaseSink.new
file_sink = FileSink.new("/data/output.csv")

# 파이프라인 1: CSV -> Filter -> Transform -> Database
pipeline1 = Pipeline.new(csv_source, db_sink)
pipeline1.add_processor(filter)
pipeline1.add_processor(transform)
pipeline1.execute()

# 파이프라인 2: JSON -> Transform -> File
pipeline2 = Pipeline.new(json_source, file_sink)
pipeline2.add_processor(transform)
pipeline2.execute()
```

## 실전 예제: 이벤트 시스템

덕 타이핑을 사용한 유연한 이벤트 처리:

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
      # 핸들러가 async를 지원하는지 확인
      if handler.respond_to?(:handle_async)
        handler.handle_async(event)
      else
        handler.handle(event)
      end
    end
  end
end

# 사용법
bus = EventBus.new
bus.subscribe(LogHandler.new)
bus.subscribe(EmailHandler.new)
bus.subscribe(MetricsHandler.new)

event = { "type" => "user_signup", "message" => "New user registered" }
bus.publish(event)
bus.publish_async(event)
```

## 모범 사례

1. **유연성을 위해 구조적 타입 사용**: 명시적 인터페이스 구현을 강제하지 않으면서 유연성이 필요할 때.

2. **계약을 위해 인터페이스 사용**: 명시적 계약과 요구사항 문서화가 필요할 때.

3. **구조적 타입을 단순하게 유지**: 복잡한 구조적 타입은 명명된 인터페이스보다 이해하기 어려울 수 있습니다.

4. **기대 사항 문서화**: 덕 타이핑에서도 어떤 메서드와 동작이 예상되는지 명확하게 문서화하세요.

5. **향후 유지보수 고려**: 명시적 인터페이스는 모든 구현을 보여주어 리팩토링을 더 쉽게 만들 수 있습니다.

6. **접근 방식 결합**: 핵심 계약에는 인터페이스를, 유연하고 선택적인 기능에는 덕 타이핑을 사용하세요.

## 덕 타이핑 사용 시점

**덕 타이핑을 사용할 때:**
- 수정할 수 없는 서드파티 코드와 작업할 때
- 매우 유연한 플러그인 스타일 아키텍처를 구축할 때
- 프로토타이핑과 반복 속도가 중요할 때
- 깊은 상속 계층을 피하고 싶을 때
- 서로 다른 클래스가 자연스럽게 비슷한 메서드를 가지지만 관련이 없을 때

**명시적 인터페이스를 사용할 때:**
- 공개 API와 계약을 정의할 때
- 모든 구현에 대한 IDE 지원이 필요할 때
- 문서화와 발견 가능성이 중요할 때
- 프레임워크나 라이브러리를 구축할 때
- 타입 안전성이 중요할 때

## 요약

T-Ruby의 덕 타이핑은 다음을 제공합니다:

- **구조적 타이핑**: 명시적 구현이 아닌 메서드 존재에 기반
- **유연성**: 필요한 메서드를 가진 모든 객체와 작동
- **타입 안전성**: 객체가 호출하는 메서드를 가지고 있는지 확인
- **점진적 타이핑**: 엄격한 인터페이스와 유연한 덕 타이핑 결합

유연하고 타입 안전한 T-Ruby 코드를 작성하기 위해 명시적 인터페이스와 덕 타이핑 모두를 마스터하세요. 유연성, 타입 안전성, 유지보수성에 대한 필요에 따라 각 상황에 맞는 접근 방식을 선택하세요.
