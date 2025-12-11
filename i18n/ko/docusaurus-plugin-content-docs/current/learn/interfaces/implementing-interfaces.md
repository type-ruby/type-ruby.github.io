---
sidebar_position: 2
title: 인터페이스 구현하기
description: 클래스가 인터페이스를 구현하는 방법
---

# 인터페이스 구현하기

인터페이스를 정의한 후, 클래스는 `implements` 키워드를 사용하여 구현합니다. T-Ruby는 구현 클래스가 올바른 시그니처로 모든 필수 메서드를 제공하는지 확인합니다. 이 가이드는 인터페이스를 올바르고 효과적으로 구현하는 방법을 보여줍니다.

## 기본 구현

`implements`를 사용하여 클래스가 인터페이스 계약을 충족한다고 선언합니다:

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

# 사용법 - 다형성 작동
shapes: Array<Drawable> = [
  Circle.new(5.0),
  Square.new(4.0)
]

shapes.each { |shape| shape.draw() }
```

## 다중 인터페이스 구현

클래스는 여러 인터페이스를 구현할 수 있습니다:

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

  # Serializable 구현
  def to_json(): String
    '{"id": #{@id}, "name": "#{@name}", "age": #{@age}}'
  end

  def from_json(json: String): void
    # JSON 파싱 및 필드 업데이트
    # 예제를 위해 간소화됨
  end

  # Comparable 구현
  def compare_to(other: User): Integer
    @id <=> other.id
  end

  # Cloneable 구현
  def clone(): User
    User.new(@id, @name, @age)
  end
end

# 사용법
user1 = User.new(1, "Alice", 30)
user2 = User.new(2, "Bob", 25)

puts user1.to_json()
puts user1.compare_to(user2)  # -1
clone = user1.clone()
```

## 제네릭 인터페이스 구현

특정 타입으로 제네릭 인터페이스를 구현합니다:

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

# 사용법 - 타입 안전한 스토리지
user_storage: Storage<User> = UserStorage.new
user_storage.save(User.new(1, "Alice", 30))

product_storage: Storage<Product> = ProductStorage.new
product_storage.save(Product.new("SKU-001", "Laptop", 999.99))
```

## 부분 인터페이스 구현

상속을 통해 인터페이스를 부분적으로 구현할 때도 있습니다:

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

  # 서브클래스에서 validate()를 구현해야 함
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

# 사용법
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

## 위임을 사용한 인터페이스 구현

다른 객체에 위임하여 인터페이스를 구현합니다:

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

  # 내부 로거에 위임
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
    # 애플리케이션 로직
    info("Application shutting down")
  end
end

# 사용법
app = Application.new
app.run()
```

## 실전 예제: 결제 게이트웨이

결제 인터페이스를 구현하는 완전한 예제:

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
      # 실제 시스템에서는 authorize에서 트랜잭션 ID를 받을 것입니다
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

# 사용법
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

## 실전 예제: 알림 시스템

다중 인터페이스 구현이 있는 또 다른 완전한 예제:

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

# 사용법
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

## 모범 사례

1. **모든 인터페이스 메서드 구현**: T-Ruby는 인터페이스에 정의된 모든 메서드를 구현하도록 강제합니다.

2. **시그니처를 정확히 일치시키기**: 구현의 메서드 시그니처는 인터페이스와 정확히 일치해야 합니다 (동일한 매개변수, 동일한 반환 타입).

3. **의미 있는 구현 사용**: 단순히 에러를 던지는 스텁 구현을 만들지 마세요 - 실제 기능을 제공하세요.

4. **구현 세부 사항 문서화**: 인터페이스가 무엇을 정의하더라도, 구현이 어떻게 작동하는지 문서화하세요.

5. **인터페이스 준수 테스트**: 클래스가 인터페이스 계약을 올바르게 구현하는지 확인하는 테스트를 작성하세요.

6. **구현을 집중적으로 유지**: 각 구현 클래스는 단일하고 명확한 책임을 가져야 합니다.

## 일반적인 패턴

### 어댑터 패턴

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

### 컴포지트 패턴

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
    # Leaf는 자식을 가질 수 없음
  end

  def remove(component: Component): void
    # Leaf는 자식을 가질 수 없음
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

## 요약

T-Ruby에서 인터페이스 구현:

- **계약 강제**: 클래스가 필요한 메서드를 제공하도록 보장
- **다형성 활성화**: 서로 다른 구현을 상호 교환적으로 사용 가능
- **타입 안전성 제공**: 컴파일 타임 검사
- **다중 인터페이스 지원**: 유연한 설계를 위해

유연하고 유지보수 가능하며 타입 안전한 애플리케이션을 구축하기 위해 인터페이스 구현을 마스터하세요. 인터페이스는 T-Ruby의 좋은 객체 지향 설계의 기반입니다.
