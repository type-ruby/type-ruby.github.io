---
sidebar_position: 2
title: インターフェースの実装
description: クラスがインターフェースを実装する方法
---

<DocsBadge />


# インターフェースの実装

インターフェースを定義した後、クラスは`implements`キーワードを使用して実装します。T-Rubyは実装クラスが正しいシグニチャで全ての必須メソッドを提供することを確認します。このガイドではインターフェースを正しく効果的に実装する方法を示します。

## 基本的な実装

`implements`を使用してクラスがインターフェースコントラクトを満たすことを宣言します：

```trb title="basic_implementation.trb"
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

# 使用法 - ポリモーフィズムの動作
shapes: Array<Drawable> = [
  Circle.new(5.0),
  Square.new(4.0)
]

shapes.each { |shape| shape.draw() }
```

## 複数インターフェースの実装

クラスは複数のインターフェースを実装できます：

```trb title="multiple_interfaces.trb"
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

  # Serializable実装
  def to_json(): String
    '{"id": #{@id}, "name": "#{@name}", "age": #{@age}}'
  end

  def from_json(json: String): void
    # JSONをパースしてフィールドを更新
    # 例のために簡略化
  end

  # Comparable実装
  def compare_to(other: User): Integer
    @id <=> other.id
  end

  # Cloneable実装
  def clone(): User
    User.new(@id, @name, @age)
  end
end

# 使用例
user1 = User.new(1, "Alice", 30)
user2 = User.new(2, "Bob", 25)

puts user1.to_json()
puts user1.compare_to(user2)  # -1
clone = user1.clone()
```

## ジェネリックインターフェースの実装

特定の型でジェネリックインターフェースを実装します：

```trb title="generic_implementation.trb"
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

# 使用法 - 型安全なストレージ
user_storage: Storage<User> = UserStorage.new
user_storage.save(User.new(1, "Alice", 30))

product_storage: Storage<Product> = ProductStorage.new
product_storage.save(Product.new("SKU-001", "Laptop", 999.99))
```

## 部分的なインターフェース実装

継承を通じてインターフェースを部分的に実装することもあります：

```trb title="partial_implementation.trb"
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

  # サブクラスでvalidate()を実装する必要がある
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

# 使用例
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

## 委譲によるインターフェース実装

他のオブジェクトに委譲してインターフェースを実装します：

```trb title="delegation.trb"
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

  # 内部ロガーに委譲
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
    # アプリケーションロジック
    info("Application shutting down")
  end
end

# 使用例
app = Application.new
app.run()
```

## 実践例：決済ゲートウェイ

決済インターフェースを実装する完全な例：

```trb title="payment_gateway.trb"
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
      # 実際のシステムではauthorizeからトランザクションIDを取得します
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

# 使用例
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

## 実践例：通知システム

複数インターフェース実装を持つ別の完全な例：

```trb title="notification_system.trb"
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

# 使用例
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

## ベストプラクティス

1. **全てのインターフェースメソッドを実装**：T-Rubyはインターフェースで定義された全てのメソッドの実装を強制します。

2. **シグニチャを正確に一致させる**：実装のメソッドシグニチャはインターフェースと正確に一致する必要があります（同じパラメータ、同じ戻り値型）。

3. **意味のある実装を使用**：単にエラーを投げるスタブ実装を作らないでください - 実際の機能を提供してください。

4. **実装の詳細を文書化**：インターフェースが何を定義していても、実装がどのように動作するかを文書化してください。

5. **インターフェース準拠をテスト**：クラスがインターフェースコントラクトを正しく実装していることを確認するテストを書いてください。

6. **実装をフォーカスされた状態に保つ**：各実装クラスは単一で明確な責任を持つべきです。

## 一般的なパターン

### アダプターパターン

```trb title="adapter.trb"
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

### コンポジットパターン

```trb title="composite.trb"
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
    # Leafは子を持てない
  end

  def remove(component: Component): void
    # Leafは子を持てない
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

## まとめ

T-Rubyでのインターフェース実装：

- **コントラクトを強制**：クラスが必要なメソッドを提供することを保証
- **ポリモーフィズムを有効化**：異なる実装を相互に置き換え可能
- **型安全性を提供**：コンパイル時チェック
- **複数インターフェースをサポート**：柔軟な設計のために

柔軟でメンテナンス可能で型安全なアプリケーションを構築するためにインターフェース実装をマスターしてください。インターフェースはT-Rubyの良いオブジェクト指向設計の基盤です。
