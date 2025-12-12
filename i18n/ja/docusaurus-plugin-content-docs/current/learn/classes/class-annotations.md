---
sidebar_position: 1
title: クラスアノテーション
description: クラスへの型アノテーションの追加
---

<DocsBadge />


# クラスアノテーション

クラスはオブジェクト指向Rubyプログラミングの基盤です。T-Rubyは、メソッド、インスタンス変数、クラスレベルの構造へのアノテーションを通じて、クラスに型安全性を提供します。このガイドでは、完全に型付けされたクラスの書き方を説明します。

## 基本的なクラスの型付け

クラスのメソッドに型を付けることから始めます：

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

# クラスの使用
user = User.new("Alice", "alice@example.com", 30)
greeting = user.greet()  # 型: String
adult = user.is_adult()   # 型: Boolean
user.update_email("newemail@example.com")
```

## インスタンス変数の型付け

インスタンス変数は `attr_accessor`、`attr_reader`、または `attr_writer` で型を付けるべきです：

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

# 使用法
product = Product.new(1, "Laptop", 999.99)
product.name = "Gaming Laptop"  # ✓ OK - attr_accessor
puts product.id                  # ✓ OK - attr_reader
# product.id = 2                # ✗ エラー - 読み取り専用
product.stock = 10               # ✓ OK - attr_writer (getterはprivate)
```

## 明示的なインスタンス変数の型

コンストラクタでインスタンス変数の型を明示的に宣言することもできます：

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

## クラスメソッド

クラスメソッド（シングルトンメソッド）は、インスタンスメソッドと同じ方法で型付けします：

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
    # データベースからカウントを返す
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

# クラスメソッドの使用
user1 = User.from_hash({ "name" => "Alice", "email" => "alice@example.com", "age" => 30 })
admin = User.create_admin("Bob", "bob@example.com")
total = User.count()
```

## ユニオン型によるコンストラクタのオーバーロード

Rubyは真のオーバーロードをサポートしていませんが、柔軟なコンストラクタのためにユニオン型を使用できます：

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

# 両方とも動作する
rect1 = Rectangle.new(10, 20)       # Integer
rect2 = Rectangle.new(10.5, 20.5)   # Float
rect3 = Rectangle.new(10, 20.5)     # 混合
```

## Privateメソッド

Privateメソッドもpublicメソッドと同様に型付けします：

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

# 使用法
account = BankAccount.new(1000.0)
account.deposit(500.0)
account.withdraw(200.0)
# account.validate_amount(100.0)  # ✗ エラー - privateメソッド
```

## GetterとSetterメソッド

カスタムのgetter/setterロジックが必要な場合、明示的に型付けします：

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

# 使用法
temp = Temperature.new(0.0)
puts temp.celsius      # 0.0
puts temp.fahrenheit   # 32.0
puts temp.kelvin       # 273.15

temp.fahrenheit = 98.6
puts temp.celsius      # 37.0
```

## Nilableインスタンス変数

nilになり得るインスタンス変数は `?` 接尾辞を使用します：

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

# 使用法
profile = UserProfile.new("Alice")
profile.bio = "Software developer"
if profile.has_bio?
  puts profile.bio  # T-Rubyはここでbioがnilでないことを知っている
end
```

## 実践例: Eコマース商品

様々な型付けテクニックを示す完全な例です：

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

  # 在庫管理
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

  # タグ管理
  def tags(): Array<String>
    @tags
  end

  def add_tag(tag: String): void
    @tags.push(tag) unless @tags.include?(tag)
  end

  def remove_tag(tag: String): void
    @tags.delete(tag)
  end

  # セール価格
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

  # クラスメソッド
  def self.from_json(json: String): Product
    data = JSON.parse(json)
    Product.new(data["id"], data["name"], data["price"])
  end

  def self.bulk_create(names: Array<String>, default_price: Float): Array<Product>
    names.map.with_index do |name, index|
      Product.new(index + 1, name, default_price)
    end
  end

  # 比較
  def cheaper_than?(other: Product): Boolean
    current_price() < other.current_price()
  end

  def same_category?(other: Product): Boolean
    (@tags & other.tags()).any?
  end
end

# Productクラスの使用
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

## 実践例: タスクマネージャ

別のパターンを示す完全な例です：

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

# タスクマネージャの使用
list = TaskList.new("Work Tasks")

task1 = list.add_task("Write documentation", "high")
task1.due_date = Time.now + 86400  # 明日が期限

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

## ベストプラクティス

1. **常にattr_accessor/attr_reader/attr_writerに型を付ける**: これらはクラスの公開インターフェースに対する明確な契約を提供します。

2. **initializeパラメータに型を付ける**: コンストラクタはすべてのパラメータに対して完全な型アノテーションを持つべきです。

3. **nilable型を適切に使用する**: インスタンス変数が本当にnilになり得る場合にのみ `Type?` としてマークします。

4. **すべてのpublicメソッドに型を付ける**: Publicメソッドはクラスの API であり、常に型付けされるべきです。

5. **privateメソッドにも型を付ける**: Privateメソッドも内部用ですが、型安全性の恩恵を受けます。

6. **ファクトリパターンにクラスメソッドを使用する**: 特定の構成でインスタンスを作成するクラスメソッドに型を付けます。

## 一般的なパターン

### ビルダーパターン

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

### 値オブジェクト

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

### シングルトンパターン

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

## まとめ

T-Rubyのクラスアノテーションは以下を提供します：

- インスタンス変数とクラス変数の**型安全性**
- 型付きメソッドシグネチャによる**明確な契約**
- IDEオートコンプリートによる**より良いツール**サポート
- 常に最新の**ドキュメント**

公開API（attr_accessor、publicメソッド）に型を付けることから始め、徐々にクラスの残りの部分に型を追加していきましょう。コードはより保守しやすく、エラーが少なくなります。
