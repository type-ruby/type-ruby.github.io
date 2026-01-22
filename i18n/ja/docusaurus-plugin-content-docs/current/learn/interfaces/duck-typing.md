---
sidebar_position: 3
title: ダックタイピング
description: T-Rubyの構造的型付けとダックタイピング
---

<DocsBadge />


# ダックタイピング

「アヒルのように歩き、アヒルのように鳴くなら、それはアヒルに違いない。」ダックタイピングは、明示的なインターフェース実装ではなく、メソッドとプロパティの存在によって型の互換性が決定される構造的型付けの一形態です。T-Rubyは型安全性を維持しながらダックタイピングをサポートします。

## ダックタイピングの理解

ダックタイピングでは、インターフェースを明示的に実装する必要はありません—必要なメソッドを持っていればよいのです：

```trb title="duck_typing_basic.trb"
# インターフェース不要
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

# どちらもインターフェース実装なしで動作
user = User.new("Alice")
product = Product.new("Laptop")

print_object(user)     # "User: Alice"
print_object(product)  # "Product: Laptop"
```

## 構造的型の構文

オブジェクトリテラル構文を使用してインラインで構造的型を定義します：

```trb title="structural_types.trb"
# 構造的型の定義
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

# 両方のクラスが構造的型を満たす
doc = Document.new("Manual")
report = Report.new("Q4 Results")

print_item(doc)
print_item(report)
```

## 無名構造的型

名前を付けずに構造的型を直接使用します：

```trb title="anonymous_types.trb"
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

# 使用例
reader = FileReader.new("/path/to/file")
db_writer = DatabaseWriter.new
console_writer = ConsoleWriter.new

process_data(reader, db_writer)
process_data(reader, console_writer)
```

## 複雑な構造的型

構造的型は複数のメソッドとプロパティシグニチャを定義できます：

```trb title="complex_structural.trb"
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
    # ファイルに保存
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

# どちらも同じ関数で動作
memory_repo = MemoryRepository.new
file_repo = FileRepository.new("/data")

use_repository(memory_repo)
use_repository(file_repo)
```

## ダックタイピング vs インターフェース

明示的インターフェースとダックタイピングの比較：

```trb title="comparison.trb"
# 明示的インターフェースアプローチ
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

# ダックタイピングアプローチ（implementsキーワードなし）
class FileLogger
  def log(message: String): void
    # ファイルに書き込み
    puts "Logging to file: #{message}"
  end

  def error(message: String): void
    puts "ERROR to file: #{message}"
  end
end

# どちらもダックタイピングパラメータで動作
def use_logger(logger: { def log(message: String): void }): void
  logger.log("Application started")
end

console = ConsoleLogger.new
file = FileLogger.new

use_logger(console)  # 動作 - Loggerを実装
use_logger(file)     # 動作 - logメソッドを持つ（ダックタイピング）
```

## 構造的サブタイピング

必要以上のメソッドを持つオブジェクトも構造的型を満たします：

```trb title="subtyping.trb"
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

# AdvancedLoggerはBasicLoggerの要件を満たす
def simple_logging(logger: BasicLogger): void
  logger.log("Message")
  # ロガーがより多くのメソッドを持っていても、ここではlog()のみ呼び出し可能
end

advanced = AdvancedLogger.new
simple_logging(advanced)  # 動作 - 構造的サブタイピング
```

## ジェネリック構造的型

ジェネリクスと構造的型付けの組み合わせ：

```trb title="generic_structural.trb"
def transform<T, U>(
  items: T[],
  transformer: { def transform(item: T): U }
): U[]
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

# すべて同じジェネリック関数で動作
strings = ["1", "2", "3"]
string_to_int = StringToInt.new
integers = transform(strings, string_to_int)  # [1, 2, 3]

numbers = [1, 2, 3]
int_to_string = IntToString.new
strings_result = transform(numbers, int_to_string)  # ["1", "2", "3"]

doubler = DoubleTransformer.new
doubled = transform(numbers, doubler)  # [2, 4, 6]
```

## 実践例：プラグインシステム

柔軟なプラグインアーキテクチャのためのダックタイピング：

```trb title="plugin_duck_typing.trb"
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
    run_plugin(plugin)  # ConfigurablePluginはPluginを満たす
  end
end

runner = PluginRunner.new

simple = SimplePlugin.new
runner.run_plugin(simple)

advanced = AdvancedPlugin.new
runner.run_configurable(advanced, { "level" => "high" })
```

## 実践例：データパイプライン

柔軟なデータ処理のためのダックタイピング：

```trb title="data_pipeline.trb"
type DataSource = {
  def read(): Hash<String, String>[]
}

type DataProcessor = {
  def process(data: Hash<String, String>[]): Hash<String, String>[]
}

type DataSink = {
  def write(data: Hash<String, String>[]): void
}

class CSVSource
  def initialize(path: String)
    @path = path
  end

  def read(): Hash<String, String>[]
    # CSVファイルを読み込み
    [{ "name" => "Alice", "age" => "30" }]
  end
end

class JSONSource
  def initialize(url: String)
    @url = url
  end

  def read(): Hash<String, String>[]
    # URLからJSONを取得
    [{ "name" => "Bob", "age" => "25" }]
  end
end

class FilterProcessor
  def initialize(field: String, value: String)
    @field = field
    @value = value
  end

  def process(data: Hash<String, String>[]): Hash<String, String>[]
    data.select { |row| row[@field] == @value }
  end
end

class TransformProcessor
  def process(data: Hash<String, String>[]): Hash<String, String>[]
    data.map do |row|
      row.merge({ "processed" => "true" })
    end
  end
end

class DatabaseSink
  def write(data: Hash<String, String>[]): void
    puts "Writing #{data.length} rows to database"
    data.each { |row| puts "  #{row}" }
  end
end

class FileSink
  def initialize(path: String)
    @path = path
  end

  def write(data: Hash<String, String>[]): void
    puts "Writing #{data.length} rows to #{@path}"
  end
end

class Pipeline
  def initialize(source: DataSource, sink: DataSink)
    @source = source
    @sink = sink
    @processors: DataProcessor[] = []
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

# 様々な組み合わせでパイプラインを構築
csv_source = CSVSource.new("/data/input.csv")
json_source = JSONSource.new("https://api.example.com/data")

filter = FilterProcessor.new("age", "30")
transform = TransformProcessor.new

db_sink = DatabaseSink.new
file_sink = FileSink.new("/data/output.csv")

# パイプライン1: CSV -> Filter -> Transform -> Database
pipeline1 = Pipeline.new(csv_source, db_sink)
pipeline1.add_processor(filter)
pipeline1.add_processor(transform)
pipeline1.execute()

# パイプライン2: JSON -> Transform -> File
pipeline2 = Pipeline.new(json_source, file_sink)
pipeline2.add_processor(transform)
pipeline2.execute()
```

## 実践例：イベントシステム

ダックタイピングを使用した柔軟なイベント処理：

```trb title="event_system.trb"
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
    @handlers: EventHandler[] = []
  end

  def subscribe(handler: EventHandler): void
    @handlers.push(handler)
  end

  def publish(event: Hash<String, String>): void
    @handlers.each { |handler| handler.handle(event) }
  end

  def publish_async(event: Hash<String, String>): void
    @handlers.each do |handler|
      # ハンドラがasyncをサポートしているか確認
      if handler.respond_to?(:handle_async)
        handler.handle_async(event)
      else
        handler.handle(event)
      end
    end
  end
end

# 使用例
bus = EventBus.new
bus.subscribe(LogHandler.new)
bus.subscribe(EmailHandler.new)
bus.subscribe(MetricsHandler.new)

event = { "type" => "user_signup", "message" => "New user registered" }
bus.publish(event)
bus.publish_async(event)
```

## ベストプラクティス

1. **柔軟性のために構造的型を使用**：明示的なインターフェース実装を強制せずに柔軟性が必要なとき。

2. **コントラクトのためにインターフェースを使用**：明示的なコントラクトと要件の文書化が必要なとき。

3. **構造的型をシンプルに保つ**：複雑な構造的型は名前付きインターフェースより理解しにくい場合があります。

4. **期待を文書化**：ダックタイピングでも、どのメソッドと動作が期待されるかを明確に文書化してください。

5. **将来のメンテナンスを考慮**：明示的なインターフェースはすべての実装を示すことでリファクタリングを容易にできます。

6. **アプローチを組み合わせる**：コアコントラクトにはインターフェースを、柔軟でオプションの機能にはダックタイピングを使用してください。

## ダックタイピングを使用するとき

**ダックタイピングを使用する場合：**
- 変更できないサードパーティコードを扱うとき
- 非常に柔軟なプラグインスタイルのアーキテクチャを構築するとき
- プロトタイピングと反復速度が重要なとき
- 深い継承階層を避けたいとき
- 異なるクラスが自然に似たメソッドを持つが関連していないとき

**明示的インターフェースを使用する場合：**
- パブリックAPIとコントラクトを定義するとき
- すべての実装に対するIDEサポートが必要なとき
- ドキュメントと発見可能性が重要なとき
- フレームワークやライブラリを構築するとき
- 型安全性が重要なとき

## まとめ

T-Rubyのダックタイピングは以下を提供します：

- **構造的型付け**：明示的な実装ではなくメソッドの存在に基づく
- **柔軟性**：必要なメソッドを持つ任意のオブジェクトで動作
- **型安全性**：オブジェクトが呼び出すメソッドを持っていることを確認
- **漸進的型付け**：厳格なインターフェースと柔軟なダックタイピングの組み合わせ

柔軟で型安全なT-Rubyコードを書くために、明示的インターフェースとダックタイピングの両方をマスターしてください。柔軟性、型安全性、メンテナンス性のニーズに応じて、各状況に適したアプローチを選択してください。
