---
sidebar_position: 4
title: 추상 클래스
description: 추상 클래스와 메서드 정의하기
---

<DocsBadge />


# 추상 클래스

추상 클래스는 서브클래스를 위한 템플릿을 정의하며, 구현된 메서드와 반드시 오버라이드해야 하는 추상 메서드를 모두 포함합니다. Ruby에는 내장 추상 클래스 문법이 없지만, T-Ruby는 타입 안전한 추상 클래스를 생성하기 위한 규약과 패턴을 제공합니다.

## 추상 클래스 정의하기

서브클래스가 반드시 구현해야 하는 메서드에서 에러를 발생시켜 추상 클래스를 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

```trb title="abstract_basic.trb"
class Shape
  def initialize()
    @name: String = "Shape"
  end

  # 추상 메서드 - 서브클래스에서 반드시 구현해야 함
  def area(): Float
    raise NotImplementedError, "Subclass must implement area()"
  end

  # 추상 메서드
  def perimeter(): Float
    raise NotImplementedError, "Subclass must implement perimeter()"
  end

  # 구체적 메서드 - 모든 도형이 공유
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

# 사용법
rect = Rectangle.new(10.0, 5.0)
puts rect.describe()  # "Rectangle: area = 50.0, perimeter = 30.0"

circle = Circle.new(5.0)
puts circle.describe()  # "Circle: area = 78.53975, perimeter = 31.4159"

# 이렇게 하면 NotImplementedError가 발생합니다:
# shape = Shape.new
# shape.area()
```

## 타입 어노테이션이 있는 추상 클래스

모든 추상 메서드는 완전한 타입 어노테이션을 가져야 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

```trb title="typed_abstract.trb"
abstract class DataSource
  def connect(): Boolean
    raise NotImplementedError, "Must implement connect()"
  end

  def disconnect(): void
    raise NotImplementedError, "Must implement disconnect()"
  end

  def fetch(query: String): Array<Hash<String, String>>
    raise NotImplementedError, "Must implement fetch()"
  end

  def save(data: Hash<String, String>): Boolean
    raise NotImplementedError, "Must implement save()"
  end

  # 구체적 헬퍼 메서드
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
    # 구현
    @connected = true
    true
  end

  def disconnect(): void
    @connected = false
  end

  def fetch(query: String): Array<Hash<String, String>>
    raise "Not connected" unless @connected
    # 데이터베이스 쿼리 구현
    []
  end

  def save(data: Hash<String, String>): Boolean
    raise "Not connected" unless @connected
    # 데이터베이스 저장 구현
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
    # API 연결 로직
    @connected = true
    true
  end

  def disconnect(): void
    @connected = false
  end

  def fetch(query: String): Array<Hash<String, String>>
    # API fetch 구현
    []
  end

  def save(data: Hash<String, String>): Boolean
    # API 저장 구현
    true
  end
end
```

## 템플릿 메서드 패턴

추상 클래스는 종종 템플릿 메서드 패턴을 구현합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

```trb title="template_method.trb"
abstract class Report
  def generate(): String
    validate()
    header = create_header()
    body = create_body()
    footer = create_footer()
    format_output(header, body, footer)
  end

  # 추상 메서드 - 반드시 구현해야 함
  def create_header(): String
    raise NotImplementedError, "Must implement create_header()"
  end

  def create_body(): String
    raise NotImplementedError, "Must implement create_body()"
  end

  def create_footer(): String
    raise NotImplementedError, "Must implement create_footer()"
  end

  # 기본 구현이 있는 구체적 메서드
  def validate(): void
    # 기본 검증
  end

  def format_output(header: String, body: String, footer: String): String
    "#{header}\n\n#{body}\n\n#{footer}"
  end
end

class PDFReport < Report
  def initialize(title: String, data: Array<String>)
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
  def initialize(title: String, data: Array<String>)
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

# 사용법
pdf = PDFReport.new("Sales Report", ["Item 1", "Item 2", "Item 3"])
puts pdf.generate()

html = HTMLReport.new("Sales Report", ["Item 1", "Item 2", "Item 3"])
puts html.generate()
```

## 부분 구현이 있는 추상 클래스

추상 클래스는 일부 구체적 기능을 제공할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

```trb title="partial_implementation.trb"
abstract class CacheStore<T>
  def initialize()
    @stats: Hash<String, Integer> = { "hits" => 0, "misses" => 0 }
  end

  # 추상 메서드
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

  # 구체적 헬퍼 메서드
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
    # 가득 차면 간단한 제거
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

# 사용법
memory_cache = MemoryCache<String>.new(50)
memory_cache.set("user_1", "Alice")
user = memory_cache.get("user_1")

# 기본값과 함께 fetch 사용
user2 = memory_cache.fetch("user_2") do
  "Default User"
end

puts memory_cache.hit_rate()
```

## 공통 패턴을 위한 추상 베이스 클래스

추상 클래스를 사용하여 공통 패턴을 강제합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

```trb title="common_patterns.trb"
abstract class Controller
  def initialize()
    @before_filters: Array<Proc<[], void>> = []
    @after_filters: Array<Proc<[], void>> = []
  end

  def execute(action: String): void
    run_before_filters()
    perform_action(action)
    run_after_filters()
  end

  # 추상 - 서브클래스에서 반드시 구현해야 함
  def perform_action(action: String): void
    raise NotImplementedError, "Must implement perform_action()"
  end

  # 구체적 헬퍼 메서드
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

# 사용법
controller = UsersController.new
controller.execute("index")
# Authenticating...
# Listing all users
# Logging action...
```

## 실전 예제: 결제 프로세서

추상 클래스를 사용하는 완전한 예제:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

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

  # 추상 메서드 - 결제 게이트웨이별로 다름
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

  # 구체적 검증
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

# 사용법
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

# 다형성이 동작합니다
def process_payment(processor: PaymentProcessor): Boolean
  processor.process()
end

processors: Array<PaymentProcessor> = [stripe, paypal]
processors.each { |p| process_payment(p) }
```

## 모범 사례

1. **추상 메서드 문서화**: 서브클래스가 어떤 메서드를 구현해야 하는지 명확하게 문서화하세요.

2. **가능하면 기본 구현 제공**: 합리적인 기본값이 있는 메서드에는 구체적 구현을 제공하세요.

3. **의미 있는 에러 메시지 사용**: NotImplementedError를 발생시킬 때 명확한 안내를 제공하세요.

4. **모든 추상 메서드에 타입 지정**: 에러를 발생시키더라도, 추상 메서드는 완전한 타입 어노테이션을 가져야 합니다.

5. **추상 클래스를 집중적으로 유지**: 추상 클래스는 명확한 계약을 정의해야 하며, 너무 많은 것을 하려고 하면 안 됩니다.

6. **구체적 구현으로 테스트**: 추상 클래스 설계를 검증하기 위해 항상 최소 하나의 구체적 구현을 만드세요.

## 공통 패턴

### 전략 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

```trb title="strategy.trb"
abstract class SortStrategy
  def sort(array: Array<Integer>): Array<Integer>
    raise NotImplementedError, "Must implement sort()"
  end
end

class BubbleSort < SortStrategy
  def sort(array: Array<Integer>): Array<Integer>
    # 버블 정렬 구현
    array.sort
  end
end

class QuickSort < SortStrategy
  def sort(array: Array<Integer>): Array<Integer>
    # 퀵 정렬 구현
    array.sort
  end
end

class Sorter
  def initialize(strategy: SortStrategy)
    @strategy = strategy
  end

  def sort(data: Array<Integer>): Array<Integer>
    @strategy.sort(data)
  end
end

sorter = Sorter.new(QuickSort.new)
sorted = sorter.sort([3, 1, 4, 1, 5, 9, 2, 6])
```

### 팩토리 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/abstract_classes_spec.rb" line={21} />

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

## 요약

T-Ruby의 추상 클래스는 다음을 제공합니다:

- **템플릿 정의**: 서브클래스가 따라야 할 템플릿
- **부분 구현**: 구체적 헬퍼 메서드 포함
- **타입 안전한 계약**: 서브클래스가 필요한 메서드를 구현하도록 보장
- **다형성**: 서브클래스가 서로 바꿔서 사용 가능

관련 클래스 계열이 공통 동작을 공유하지만 특정 구현에서 차이가 있을 때 추상 클래스를 사용하세요. 템플릿 메서드, 전략, 플러그인 아키텍처에 완벽합니다.
