---
sidebar_position: 1
title: 클래스 어노테이션
description: 클래스에 타입 어노테이션 추가하기
---

<DocsBadge />


# 클래스 어노테이션

클래스는 객체 지향 Ruby 프로그래밍의 기반입니다. T-Ruby는 메서드, 인스턴스 변수, 클래스 레벨 구조에 대한 어노테이션을 통해 클래스에 타입 안전성을 제공합니다. 이 가이드에서는 완전히 타입이 지정된 클래스를 작성하는 방법을 알려드립니다.

## 기본 클래스 타이핑

클래스의 메서드에 타입을 지정하는 것부터 시작합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="basic_class.trb"
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

# 클래스 사용하기
user = User.new("Alice", "alice@example.com", 30)
greeting = user.greet()  # 타입: String
adult = user.is_adult()   # 타입: Boolean
user.update_email("newemail@example.com")
```

## 인스턴스 변수 타이핑

인스턴스 변수는 `attr_accessor`, `attr_reader`, 또는 `attr_writer`로 타입을 지정해야 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="instance_vars.trb"
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

# 사용법
product = Product.new(1, "Laptop", 999.99)
product.name = "Gaming Laptop"  # ✓ OK - attr_accessor
puts product.id                  # ✓ OK - attr_reader
# product.id = 2                # ✗ 오류 - 읽기 전용
product.stock = 10               # ✓ OK - attr_writer (getter는 private)
```

## 명시적 인스턴스 변수 타입

생성자에서 인스턴스 변수 타입을 명시적으로 선언할 수도 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="explicit_ivars.trb"
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

## 클래스 메서드

클래스 메서드(싱글톤 메서드)는 인스턴스 메서드와 동일한 방식으로 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="class_methods.trb"
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
    # 데이터베이스에서 카운트 반환
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

# 클래스 메서드 사용하기
user1 = User.from_hash({ "name" => "Alice", "email" => "alice@example.com", "age" => 30 })
admin = User.create_admin("Bob", "bob@example.com")
total = User.count()
```

## 유니온 타입으로 생성자 오버로딩

Ruby는 진정한 오버로딩을 지원하지 않지만, 유연한 생성자를 위해 유니온 타입을 사용할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="flexible_constructor.trb"
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

# 둘 다 작동
rect1 = Rectangle.new(10, 20)       # Integer
rect2 = Rectangle.new(10.5, 20.5)   # Float
rect3 = Rectangle.new(10, 20.5)     # 혼합
```

## Private 메서드

Private 메서드도 public 메서드와 동일하게 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="private_methods.trb"
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

# 사용법
account = BankAccount.new(1000.0)
account.deposit(500.0)
account.withdraw(200.0)
# account.validate_amount(100.0)  # ✗ 오류 - private 메서드
```

## Getter와 Setter 메서드

커스텀 getter/setter 로직이 필요할 때 명시적으로 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="custom_accessors.trb"
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

# 사용법
temp = Temperature.new(0.0)
puts temp.celsius      # 0.0
puts temp.fahrenheit   # 32.0
puts temp.kelvin       # 273.15

temp.fahrenheit = 98.6
puts temp.celsius      # 37.0
```

## Nilable 인스턴스 변수

nil일 수 있는 인스턴스 변수는 `?` 접미사를 사용해야 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="nilable_ivars.trb"
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

# 사용법
profile = UserProfile.new("Alice")
profile.bio = "Software developer"
if profile.has_bio?
  puts profile.bio  # T-Ruby는 여기서 bio가 nil이 아님을 알고 있음
end
```

## 실전 예제: 전자상거래 상품

다양한 타이핑 기법을 보여주는 완전한 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="product.trb"
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

  # 재고 관리
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

  # 태그 관리
  def tags(): Array<String>
    @tags
  end

  def add_tag(tag: String): void
    @tags.push(tag) unless @tags.include?(tag)
  end

  def remove_tag(tag: String): void
    @tags.delete(tag)
  end

  # 할인 가격
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

  # 클래스 메서드
  def self.from_json(json: String): Product
    data = JSON.parse(json)
    Product.new(data["id"], data["name"], data["price"])
  end

  def self.bulk_create(names: Array<String>, default_price: Float): Array<Product>
    names.map.with_index do |name, index|
      Product.new(index + 1, name, default_price)
    end
  end

  # 비교
  def cheaper_than?(other: Product): Boolean
    current_price() < other.current_price()
  end

  def same_category?(other: Product): Boolean
    (@tags & other.tags()).any?
  end
end

# Product 클래스 사용하기
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

## 실전 예제: 태스크 매니저

다른 패턴을 보여주는 또 다른 완전한 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="task_manager.trb"
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

# 태스크 매니저 사용하기
list = TaskList.new("Work Tasks")

task1 = list.add_task("Write documentation", "high")
task1.due_date = Time.now + 86400  # 내일 마감

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

## 모범 사례

1. **항상 attr_accessor/attr_reader/attr_writer에 타입 지정**: 이것들은 클래스의 공개 인터페이스에 대한 명확한 계약을 제공합니다.

2. **initialize 매개변수에 타입 지정**: 생성자는 모든 매개변수에 대해 완전한 타입 어노테이션을 가져야 합니다.

3. **nilable 타입을 적절히 사용**: 인스턴스 변수가 진정으로 nil일 수 있을 때만 `Type?`으로 표시합니다.

4. **모든 public 메서드에 타입 지정**: Public 메서드는 클래스의 API이며 항상 타입이 지정되어야 합니다.

5. **private 메서드도 타입 지정**: Private 메서드도 내부용이지만 타입 안전성의 이점을 얻습니다.

6. **팩토리 패턴에 클래스 메서드 사용**: 특정 구성으로 인스턴스를 생성하는 클래스 메서드에 타입을 지정합니다.

## 일반적인 패턴

### 빌더 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="builder.trb"
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

### 값 객체

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="value_object.trb"
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

### 싱글톤 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/class_annotations_spec.rb" line={21} />

```trb title="singleton.trb"
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

## 요약

T-Ruby의 클래스 어노테이션은 다음을 제공합니다:

- 인스턴스 및 클래스 변수에 대한 **타입 안전성**
- 타입이 지정된 메서드 시그니처를 통한 **명확한 계약**
- IDE 자동 완성을 통한 **더 나은 도구** 지원
- 항상 최신 상태인 **문서**

공개 API(attr_accessor, public 메서드)에 타입을 지정하는 것부터 시작하고 점차적으로 클래스의 나머지 부분에 타입을 추가하세요. 코드가 더 유지보수하기 쉽고 오류가 적어질 것입니다.
