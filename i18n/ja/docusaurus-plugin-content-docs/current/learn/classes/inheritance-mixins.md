---
sidebar_position: 3
title: 継承 & ミックスイン
description: 型安全な継承とモジュールミックスイン
---

# 継承 & ミックスイン

継承とミックスインは、Rubyのオブジェクト指向プログラミングの強力な機能です。T-Rubyはこれらの概念を型安全性で拡張し、強力な型保証を維持しながら複雑なクラス階層を構築し、モジュールを通じて機能を共有できるようにします。

## 基本的な継承

クラスは親クラスから継承し、そのメソッドとインスタンス変数にアクセスできます：

```ruby title="basic_inheritance.trb"
class Animal
  attr_accessor :name: String
  attr_accessor :age: Integer

  def initialize(name: String, age: Integer)
    @name = name
    @age = age
  end

  def speak(): String
    "Some sound"
  end

  def info(): String
    "#{@name} is #{@age} years old"
  end
end

class Dog < Animal
  attr_accessor :breed: String

  def initialize(name: String, age: Integer, breed: String)
    super(name, age)
    @breed = breed
  end

  def speak(): String
    "Woof!"
  end

  def fetch(item: String): String
    "#{@name} fetched the #{item}"
  end
end

class Cat < Animal
  def speak(): String
    "Meow!"
  end

  def scratch(): void
    puts "#{@name} is scratching"
  end
end

# 使用法
dog = Dog.new("Buddy", 5, "Golden Retriever")
puts dog.speak()      # "Woof!"
puts dog.info()       # "Buddy is 5 years old"
puts dog.fetch("ball") # "Buddy fetched the ball"

cat = Cat.new("Whiskers", 3)
puts cat.speak()      # "Meow!"
cat.scratch()
```

## メソッドのオーバーライド

子クラスは同じシグネチャで親メソッドをオーバーライドできます：

```ruby title="override.trb"
class Shape
  def initialize()
    @sides: Integer = 0
  end

  def area(): Float
    0.0
  end

  def perimeter(): Float
    0.0
  end

  def describe(): String
    "A shape with #{@sides} sides"
  end
end

class Rectangle < Shape
  attr_accessor :width: Float
  attr_accessor :height: Float

  def initialize(width: Float, height: Float)
    super()
    @width = width
    @height = height
    @sides = 4
  end

  def area(): Float
    @width * @height
  end

  def perimeter(): Float
    2 * (@width + @height)
  end

  def describe(): String
    "Rectangle: #{@width} x #{@height}"
  end
end

class Circle < Shape
  attr_accessor :radius: Float

  def initialize(radius: Float)
    super()
    @radius = radius
    @sides = 0  # 技術的には無限
  end

  def area(): Float
    3.14159 * @radius * @radius
  end

  def perimeter(): Float
    2 * 3.14159 * @radius
  end

  def describe(): String
    "Circle with radius #{@radius}"
  end
end

# 使用法
rect = Rectangle.new(10.0, 5.0)
puts rect.area()       # 50.0
puts rect.perimeter()  # 30.0
puts rect.describe()   # "Rectangle: 10.0 x 5.0"

circle = Circle.new(5.0)
puts circle.area()     # 78.53975
```

## Superキーワード

親クラスのメソッドを呼び出すには `super` を使用します：

```ruby title="super.trb"
class Employee
  attr_accessor :name: String
  attr_accessor :salary: Float

  def initialize(name: String, salary: Float)
    @name = name
    @salary = salary
  end

  def annual_bonus(): Float
    @salary * 0.1
  end

  def total_compensation(): Float
    @salary + annual_bonus()
  end
end

class Manager < Employee
  attr_accessor :team_size: Integer

  def initialize(name: String, salary: Float, team_size: Integer)
    super(name, salary)
    @team_size = team_size
  end

  # オーバーライド: マネージャーはより良いボーナスを受け取る
  def annual_bonus(): Float
    base_bonus = super()
    base_bonus + (@team_size * 1000.0)
  end

  def team_bonus(): Float
    @team_size * 500.0
  end

  # チームボーナスを含めるためにオーバーライド
  def total_compensation(): Float
    super() + team_bonus()
  end
end

# 使用法
employee = Employee.new("Alice", 50000.0)
puts employee.total_compensation()  # 55000.0

manager = Manager.new("Bob", 80000.0, 5)
puts manager.annual_bonus()         # 8000.0 + 5000.0 = 13000.0
puts manager.total_compensation()   # 80000.0 + 13000.0 + 2500.0 = 95500.0
```

## モジュールとミックスイン

モジュールを使用すると、複数のクラス間で機能を共有できます：

```ruby title="modules.trb"
module Timestampable
  def created_at(): Time?
    @created_at
  end

  def updated_at(): Time?
    @updated_at
  end

  def touch(): void
    @updated_at = Time.now
  end

  def set_created(): void
    @created_at = Time.now
    @updated_at = Time.now
  end
end

module Searchable
  def search(query: String): Boolean
    searchable_fields().any? { |field| field.include?(query) }
  end

  def searchable_fields(): Array<String>
    []
  end
end

class BlogPost
  include Timestampable
  include Searchable

  attr_accessor :title: String
  attr_accessor :content: String
  attr_accessor :author: String

  def initialize(title: String, content: String, author: String)
    @title = title
    @content = content
    @author = author
    @created_at: Time? = nil
    @updated_at: Time? = nil
    set_created()
  end

  def searchable_fields(): Array<String>
    [@title, @content, @author]
  end

  def update_content(new_content: String): void
    @content = new_content
    touch()
  end
end

class Product
  include Timestampable
  include Searchable

  attr_accessor :name: String
  attr_accessor :description: String
  attr_accessor :sku: String

  def initialize(name: String, description: String, sku: String)
    @name = name
    @description = description
    @sku = sku
    @created_at: Time? = nil
    @updated_at: Time? = nil
    set_created()
  end

  def searchable_fields(): Array<String>
    [@name, @description, @sku]
  end
end

# 使用法
post = BlogPost.new("Hello World", "This is my first post", "Alice")
puts post.created_at()
post.update_content("Updated content")
puts post.updated_at()
puts post.search("first")  # true

product = Product.new("Laptop", "Gaming laptop", "SKU-001")
puts product.search("Gaming")  # true
```

## モジュールメソッド

モジュールはインスタンス変数と連携するメソッドを定義できます：

```ruby title="module_methods.trb"
module Validatable
  def valid?(): Boolean
    errors().empty?
  end

  def errors(): Array<String>
    @errors ||= []
  end

  def add_error(message: String): void
    @errors ||= []
    @errors.push(message)
  end

  def clear_errors(): void
    @errors = []
  end
end

class User
  include Validatable

  attr_accessor :email: String
  attr_accessor :age: Integer

  def initialize(email: String, age: Integer)
    @email = email
    @age = age
    @errors: Array<String> = []
  end

  def validate(): Boolean
    clear_errors()

    if !@email.include?("@")
      add_error("Email must contain @")
    end

    if @age < 18
      add_error("Must be 18 or older")
    end

    valid?()
  end
end

# 使用法
user = User.new("invalid-email", 15)
if !user.validate()
  user.errors().each { |e| puts e }
  # "Email must contain @"
  # "Must be 18 or older"
end
```

## 複数のミックスイン

クラスは複数のモジュールをインクルードできます：

```ruby title="multiple_mixins.trb"
module Comparable
  def ==(other: self): Boolean
    compare_fields() == other.compare_fields()
  end

  def !=(other: self): Boolean
    !self.==(other)
  end

  def compare_fields(): Array<String | Integer>
    []
  end
end

module Serializable
  def to_hash(): Hash<String, String | Integer | Boolean>
    {}
  end

  def to_json(): String
    to_hash().to_json
  end
end

module Cloneable
  def clone(): self
    self.class.new(*clone_params())
  end

  def clone_params(): Array<String | Integer>
    []
  end
end

class Person
  include Comparable
  include Serializable
  include Cloneable

  attr_accessor :name: String
  attr_accessor :age: Integer
  attr_accessor :email: String

  def initialize(name: String, age: Integer, email: String)
    @name = name
    @age = age
    @email = email
  end

  def compare_fields(): Array<String | Integer>
    [@name, @age, @email]
  end

  def to_hash(): Hash<String, String | Integer | Boolean>
    { "name" => @name, "age" => @age, "email" => @email }
  end

  def clone_params(): Array<String | Integer>
    [@name, @age, @email]
  end
end

# 使用法
person1 = Person.new("Alice", 30, "alice@example.com")
person2 = Person.new("Alice", 30, "alice@example.com")
person3 = Person.new("Bob", 25, "bob@example.com")

puts person1 == person2  # true
puts person1 == person3  # false

clone = person1.clone()
puts clone.name  # "Alice"
```

## 継承と型安全性

T-Rubyは継承階層全体で型安全性を保証します：

```ruby title="type_safety.trb"
class Vehicle
  attr_accessor :make: String
  attr_accessor :model: String

  def initialize(make: String, model: String)
    @make = make
    @model = model
  end

  def start(): void
    puts "Vehicle starting"
  end
end

class Car < Vehicle
  attr_accessor :num_doors: Integer

  def initialize(make: String, model: String, num_doors: Integer)
    super(make, model)
    @num_doors = num_doors
  end

  def start(): void
    puts "Car engine starting"
  end
end

class Motorcycle < Vehicle
  attr_accessor :has_sidecar: Boolean

  def initialize(make: String, model: String, has_sidecar: Boolean)
    super(make, model)
    @has_sidecar = has_sidecar
  end

  def start(): void
    puts "Motorcycle roaring to life"
  end
end

def start_vehicle(vehicle: Vehicle): void
  vehicle.start()
end

# 使用法 - CarとMotorcycleがVehicleを継承しているのですべて動作する
car = Car.new("Toyota", "Camry", 4)
motorcycle = Motorcycle.new("Harley", "Street 750", false)

start_vehicle(car)         # "Car engine starting"
start_vehicle(motorcycle)  # "Motorcycle roaring to life"

# 型チェックが機能する
vehicles: Array<Vehicle> = [car, motorcycle]
vehicles.each { |v| v.start() }
```

## 実践例: コンテンツ管理システム

継承とミックスインを示す完全な例です：

```ruby title="cms.trb"
module Publishable
  def publish(): void
    @published = true
    @published_at = Time.now
  end

  def unpublish(): void
    @published = false
    @published_at = nil
  end

  def is_published?(): Boolean
    @published || false
  end

  def published_at(): Time?
    @published_at
  end
end

module Taggable
  def tags(): Array<String>
    @tags ||= []
  end

  def add_tag(tag: String): void
    @tags ||= []
    @tags.push(tag) unless @tags.include?(tag)
  end

  def remove_tag(tag: String): void
    @tags ||= []
    @tags.delete(tag)
  end

  def has_tag?(tag: String): Boolean
    tags().include?(tag)
  end
end

module Commentable
  def comments(): Array<Comment>
    @comments ||= []
  end

  def add_comment(comment: Comment): void
    @comments ||= []
    @comments.push(comment)
  end

  def comment_count(): Integer
    comments().length
  end
end

class Content
  attr_accessor :title: String
  attr_accessor :author: String
  attr_reader :created_at: Time

  def initialize(title: String, author: String)
    @title = title
    @author = author
    @created_at = Time.now
  end

  def summary(): String
    @title
  end
end

class Article < Content
  include Publishable
  include Taggable
  include Commentable

  attr_accessor :body: String
  attr_accessor :excerpt: String

  def initialize(title: String, author: String, body: String, excerpt: String)
    super(title, author)
    @body = body
    @excerpt = excerpt
    @published: Boolean = false
    @published_at: Time? = nil
    @tags: Array<String> = []
    @comments: Array<Comment> = []
  end

  def summary(): String
    @excerpt
  end

  def word_count(): Integer
    @body.split.length
  end
end

class Page < Content
  include Publishable

  attr_accessor :slug: String
  attr_accessor :content: String

  def initialize(title: String, author: String, slug: String, content: String)
    super(title, author)
    @slug = slug
    @content = content
    @published: Boolean = false
    @published_at: Time? = nil
  end

  def url(): String
    "/pages/#{@slug}"
  end
end

class Comment
  attr_reader :author: String
  attr_reader :body: String
  attr_reader :created_at: Time

  def initialize(author: String, body: String)
    @author = author
    @body = body
    @created_at = Time.now
  end
end

# 使用法
article = Article.new(
  "Introduction to T-Ruby",
  "Alice",
  "T-Ruby is a typed superset of Ruby...",
  "Learn about T-Ruby's type system"
)

article.add_tag("ruby")
article.add_tag("types")
article.add_tag("programming")
article.publish()

comment = Comment.new("Bob", "Great article!")
article.add_comment(comment)

puts article.is_published?()    # true
puts article.has_tag?("ruby")   # true
puts article.comment_count()    # 1
puts article.word_count()       # 5

page = Page.new("About", "System", "about", "This is the about page")
page.publish()
puts page.url()  # "/pages/about"
```

## ベストプラクティス

1. **継承階層を浅く保つ**: 深い継承チェーンよりもコンポジションを優先します。

2. **共有動作にはモジュールを使用する**: 複数の関連のないクラスが同じ機能を必要とする場合、モジュールを使用します。

3. **すべてのメソッドパラメータに型を付ける**: モジュールでも、すべてのパラメータと戻り値に型を付けます。

4. **モジュールのインスタンス変数を初期化する**: モジュールがインスタンス変数を使用する場合、インクルードするクラスで初期化します。

5. **superを適切に使用する**: メソッドをオーバーライドする場合、親の実装を呼び出す必要があるかどうかを検討します。

6. **モジュールの要件を文書化する**: モジュールが特定のメソッドやインスタンス変数を期待する場合、明確に文書化します。

## 一般的なパターン

### テンプレートメソッドパターン

```ruby title="template_method.trb"
class DataImporter
  def import(file_path: String): void
    data = read_file(file_path)
    parsed = parse_data(data)
    validate_data(parsed)
    save_data(parsed)
  end

  def read_file(file_path: String): String
    # 共通実装
    File.read(file_path)
  end

  def validate_data(data: Array<Hash<String, String>>): void
    # 共通バリデーション
    raise "Empty data" if data.empty?
  end

  def parse_data(data: String): Array<Hash<String, String>>
    raise "Must implement parse_data"
  end

  def save_data(data: Array<Hash<String, String>>): void
    raise "Must implement save_data"
  end
end

class CSVImporter < DataImporter
  def parse_data(data: String): Array<Hash<String, String>>
    # CSVパース
    []
  end

  def save_data(data: Array<Hash<String, String>>): void
    # データベースに保存
  end
end
```

### モジュールを使用したデコレータパターン

```ruby title="decorator.trb"
module Logging
  def log(message: String): void
    puts "[#{Time.now}] #{message}"
  end

  def with_logging(&block: Proc<[], void>): void
    log("Starting operation")
    block.call
    log("Operation completed")
  end
end

module Caching
  def cache(): Hash<String, String>
    @cache ||= {}
  end

  def cached(key: String, &block: Proc<[], String>): String
    if cache().key?(key)
      cache()[key]
    else
      result = block.call
      cache()[key] = result
      result
    end
  end
end

class DataService
  include Logging
  include Caching

  def fetch_data(id: String): String
    cached(id) do
      with_logging do
        # 高コストな操作
        "Data for #{id}"
      end
    end
  end
end
```

## まとめ

T-Rubyの継承とミックスインは、型安全性を備えた強力なコード再利用メカニズムを提供します：

- **継承**は型保証付きの「is-a」関係を作成します
- **モジュール**は関連のないクラス間で機能を共有します
- **メソッドのオーバーライド**は親クラスの型シグネチャを維持します
- **Super**は型を保持しながら親の実装を呼び出します
- **複数のミックスイン**は直交する関心事を組み合わせます

階層的な関係には継承を、横断的な関心事にはモジュールを使用してください。クラス階層全体で常に型安全性を維持しましょう。
