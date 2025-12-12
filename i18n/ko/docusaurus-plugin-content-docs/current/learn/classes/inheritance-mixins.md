---
sidebar_position: 3
title: 상속 & 믹스인
description: 타입 안전한 상속과 모듈 믹스인
---

<DocsBadge />


# 상속 & 믹스인

상속과 믹스인은 Ruby의 객체 지향 프로그래밍의 강력한 기능입니다. T-Ruby는 이러한 개념을 타입 안전성으로 확장하여, 강력한 타입 보장을 유지하면서 복잡한 클래스 계층을 구축하고 모듈을 통해 기능을 공유할 수 있게 합니다.

## 기본 상속

클래스는 부모 클래스로부터 상속받아 메서드와 인스턴스 변수에 접근할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={25} />

```trb title="basic_inheritance.trb"
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

# 사용법
dog = Dog.new("Buddy", 5, "Golden Retriever")
puts dog.speak()      # "Woof!"
puts dog.info()       # "Buddy is 5 years old"
puts dog.fetch("ball") # "Buddy fetched the ball"

cat = Cat.new("Whiskers", 3)
puts cat.speak()      # "Meow!"
cat.scratch()
```

## 메서드 오버라이딩

자식 클래스는 동일한 시그니처로 부모 메서드를 오버라이드할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={36} />

```trb title="override.trb"
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
    @sides = 0  # 기술적으로 무한
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

# 사용법
rect = Rectangle.new(10.0, 5.0)
puts rect.area()       # 50.0
puts rect.perimeter()  # 30.0
puts rect.describe()   # "Rectangle: 10.0 x 5.0"

circle = Circle.new(5.0)
puts circle.area()     # 78.53975
```

## Super 키워드

부모 클래스 메서드를 호출하려면 `super`를 사용합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={47} />

```trb title="super.trb"
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

  # 오버라이드: 매니저는 더 나은 보너스를 받음
  def annual_bonus(): Float
    base_bonus = super()
    base_bonus + (@team_size * 1000.0)
  end

  def team_bonus(): Float
    @team_size * 500.0
  end

  # 팀 보너스를 포함하도록 오버라이드
  def total_compensation(): Float
    super() + team_bonus()
  end
end

# 사용법
employee = Employee.new("Alice", 50000.0)
puts employee.total_compensation()  # 55000.0

manager = Manager.new("Bob", 80000.0, 5)
puts manager.annual_bonus()         # 8000.0 + 5000.0 = 13000.0
puts manager.total_compensation()   # 80000.0 + 13000.0 + 2500.0 = 95500.0
```

## 모듈과 믹스인

모듈을 사용하면 여러 클래스에서 기능을 공유할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={58} />

```trb title="modules.trb"
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

# 사용법
post = BlogPost.new("Hello World", "This is my first post", "Alice")
puts post.created_at()
post.update_content("Updated content")
puts post.updated_at()
puts post.search("first")  # true

product = Product.new("Laptop", "Gaming laptop", "SKU-001")
puts product.search("Gaming")  # true
```

## 모듈 메서드

모듈은 인스턴스 변수와 함께 작동하는 메서드를 정의할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={69} />

```trb title="module_methods.trb"
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

# 사용법
user = User.new("invalid-email", 15)
if !user.validate()
  user.errors().each { |e| puts e }
  # "Email must contain @"
  # "Must be 18 or older"
end
```

## 다중 믹스인

클래스는 여러 모듈을 포함할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={80} />

```trb title="multiple_mixins.trb"
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

# 사용법
person1 = Person.new("Alice", 30, "alice@example.com")
person2 = Person.new("Alice", 30, "alice@example.com")
person3 = Person.new("Bob", 25, "bob@example.com")

puts person1 == person2  # true
puts person1 == person3  # false

clone = person1.clone()
puts clone.name  # "Alice"
```

## 상속과 타입 안전성

T-Ruby는 상속 계층 전체에서 타입 안전성을 보장합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={91} />

```trb title="type_safety.trb"
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

# 사용법 - Car와 Motorcycle이 Vehicle을 상속하므로 모두 작동
car = Car.new("Toyota", "Camry", 4)
motorcycle = Motorcycle.new("Harley", "Street 750", false)

start_vehicle(car)         # "Car engine starting"
start_vehicle(motorcycle)  # "Motorcycle roaring to life"

# 타입 검사 작동
vehicles: Array<Vehicle> = [car, motorcycle]
vehicles.each { |v| v.start() }
```

## 실전 예제: 콘텐츠 관리 시스템

상속과 믹스인을 보여주는 완전한 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={102} />

```trb title="cms.trb"
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

# 사용법
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

## 모범 사례

1. **상속 계층을 얕게 유지**: 깊은 상속 체인보다 조합을 선호합니다.

2. **공유 동작에 모듈 사용**: 여러 관련 없는 클래스가 같은 기능을 필요로 할 때 모듈을 사용합니다.

3. **모든 메서드 매개변수에 타입 지정**: 모듈에서도 모든 매개변수와 반환 값에 타입을 지정합니다.

4. **모듈 인스턴스 변수 초기화**: 모듈이 인스턴스 변수를 사용할 때, 포함하는 클래스에서 초기화합니다.

5. **super를 적절히 사용**: 메서드를 오버라이드할 때, 부모 구현을 호출할 필요가 있는지 고려합니다.

6. **모듈 요구사항 문서화**: 모듈이 특정 메서드나 인스턴스 변수를 기대하는 경우, 명확하게 문서화합니다.

## 일반적인 패턴

### 템플릿 메서드 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={113} />

```trb title="template_method.trb"
class DataImporter
  def import(file_path: String): void
    data = read_file(file_path)
    parsed = parse_data(data)
    validate_data(parsed)
    save_data(parsed)
  end

  def read_file(file_path: String): String
    # 공통 구현
    File.read(file_path)
  end

  def validate_data(data: Array<Hash<String, String>>): void
    # 공통 유효성 검사
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
    # CSV 파싱
    []
  end

  def save_data(data: Array<Hash<String, String>>): void
    # 데이터베이스에 저장
  end
end
```

### 모듈을 사용한 데코레이터 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/inheritance_mixins_spec.rb" line={124} />

```trb title="decorator.trb"
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
        # 비용이 큰 연산
        "Data for #{id}"
      end
    end
  end
end
```

## 요약

T-Ruby의 상속과 믹스인은 타입 안전성을 갖춘 강력한 코드 재사용 메커니즘을 제공합니다:

- **상속**은 타입 보장과 함께 "is-a" 관계를 생성합니다
- **모듈**은 관련 없는 클래스 간에 기능을 공유합니다
- **메서드 오버라이딩**은 부모 클래스의 타입 시그니처를 유지합니다
- **Super**는 타입을 보존하면서 부모 구현을 호출합니다
- **다중 믹스인**은 직교하는 관심사를 결합합니다

계층적 관계에는 상속을, 횡단 관심사에는 모듈을 사용하세요. 클래스 계층 전체에서 항상 타입 안전성을 유지하세요.
