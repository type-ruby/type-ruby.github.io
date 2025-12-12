---
sidebar_position: 2
title: 제약 조건
description: 제네릭 타입 매개변수 제약하기
---

<DocsBadge />


# 제약 조건

제네릭은 모든 타입과 작동하는 코드를 작성할 수 있게 해주지만, 때로는 사용되는 타입이 특정 속성이나 기능을 가지도록 해야 합니다. 제약 조건을 사용하면 특정 요구사항을 충족하는 타입으로 제네릭 타입 매개변수를 제한할 수 있어, 타입 안전성을 유지하면서 해당 메서드와 속성에 접근할 수 있습니다.

## 왜 제약 조건인가?

제약 조건 없이 제네릭 코드는 모든 타입에서 작동하는 연산만 수행할 수 있습니다. 제약 조건을 사용하면:

1. 제네릭 타입에서 특정 메서드나 속성에 접근
2. 타입이 특정 인터페이스를 구현하도록 보장
3. 타입이 특정 클래스를 확장하도록 요구
4. 여러 요구사항 결합

### 문제: 제약 없는 제네릭

```trb
# 제약 없이는 타입별 메서드를 사용할 수 없음
def print_length<T>(value: T): void
  puts value.length  # 에러: T에 length 메서드가 없을 수 있음
end

# 제약 없이는 특정 동작에 의존할 수 없음
def compare<T>(a: T, b: T): Integer
  a <=> b  # 에러: T가 비교 가능하지 않을 수 있음
end
```

### 해결책: 제약 조건으로

```trb
# T를 length 메서드가 있는 타입으로 제약
def print_length<T: Lengthable>(value: T): void
  puts value.length  # OK: T는 length가 있음을 보장
end

# T를 비교 가능한 타입으로 제약
def compare<T: Comparable>(a: T, b: T): Integer
  a <=> b  # OK: T는 <=>를 지원함을 보장
end
```

## 기본 제약 조건 문법

제약 조건은 타입 매개변수 뒤에 콜론(`:`)을 사용하여 지정합니다:

```trb
# 단일 제약 조건
def process<T: Interface>(value: T): void
  # T는 Interface를 구현해야 함
end

# 제약 조건이 있는 다중 타입 매개변수
def merge<K: Hashable, V: Serializable>(key: K, value: V): Hash<K, V>
  # K는 Hashable이어야 하고, V는 Serializable이어야 함
end
```

## 인터페이스 제약 조건

가장 일반적인 제약 조건은 타입이 인터페이스를 구현하도록 요구하는 것입니다.

### 제약 조건을 위한 인터페이스 정의

```trb
# 인터페이스 정의
interface Printable
  def to_s: String
end

# T를 Printable을 구현하는 타입으로 제약
def print_items<T: Printable>(items: Array<T>): void
  items.each do |item|
    puts item.to_s  # 안전: T는 to_s가 있음을 보장
  end
end

# 사용법
class User
  implements Printable

  @name: String

  def initialize(name: String): void
    @name = name
  end

  def to_s: String
    "User: #{@name}"
  end
end

users = [User.new("Alice"), User.new("Bob")]
print_items(users)  # OK: User는 Printable을 구현
```

### 일반적인 인터페이스 제약 조건

```trb
# Comparable 인터페이스
interface Comparable
  def <=>(other: self): Integer
end

def max<T: Comparable>(a: T, b: T): T
  a <=> b > 0 ? a : b
end

# Numeric 인터페이스
interface Numeric
  def +(other: self): self
  def -(other: self): self
  def *(other: self): self
  def /(other: self): self
end

def average<T: Numeric>(numbers: Array<T>): T
  sum = numbers.reduce { |acc, n| acc + n }
  sum / numbers.length
end

# Enumerable 인터페이스
interface Enumerable<T>
  def each(&block: Proc<T, void>): void
  def map<U>(&block: Proc<T, U>): Array<U>
end

def count_items<T, C: Enumerable<T>>(collection: C): Integer
  counter = 0
  collection.each { |_| counter += 1 }
  counter
end
```

## 클래스 제약 조건

타입 매개변수를 특정 클래스 또는 그 서브클래스로 제약할 수 있습니다.

```trb
# 특정 클래스로 제약
class Animal
  @name: String

  def initialize(name: String): void
    @name = name
  end

  def speak: String
    "Some sound"
  end
end

class Dog < Animal
  def speak: String
    "Woof!"
  end
end

class Cat < Animal
  def speak: String
    "Meow!"
  end
end

# T는 Animal 또는 Animal의 서브클래스여야 함
def make_speak<T: Animal>(animal: T): void
  puts animal.speak  # 안전: Animal에 speak 메서드가 있음
end

# 사용법
dog = Dog.new("Buddy")
cat = Cat.new("Whiskers")

make_speak(dog)  # OK: Dog는 Animal
make_speak(cat)  # OK: Cat은 Animal
make_speak("string")  # 에러: String은 Animal이 아님
```

### 클래스 계층 구조와 작업

```trb
class Vehicle
  @brand: String

  def initialize(brand: String): void
    @brand = brand
  end

  def brand: String
    @brand
  end
end

class Car < Vehicle
  @doors: Integer

  def initialize(brand: String, doors: Integer): void
    super(brand)
    @doors = doors
  end

  def doors: Integer
    @doors
  end
end

# 모든 Vehicle 서브클래스와 작동하는 Repository
class Repository<T: Vehicle>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): void
    @items.push(item)
  end

  def find_by_brand(brand: String): T | nil
    @items.find { |item| item.brand == brand }
  end

  def all: Array<T>
    @items.dup
  end
end

# 사용법
car_repo = Repository<Car>.new
car_repo.add(Car.new("Toyota", 4))
car_repo.add(Car.new("Honda", 2))

found = car_repo.find_by_brand("Toyota")  # Car | nil
```

## 다중 제약 조건

:::caution 준비 중
이 기능은 향후 릴리스에 계획되어 있습니다.
:::

향후 T-Ruby는 `&` 연산자를 사용한 다중 제약 조건을 지원할 예정입니다:

```trb
# 타입은 두 인터페이스를 모두 구현해야 함
def process<T: Printable & Comparable>(value: T): void
  puts value.to_s
  # 두 인터페이스의 메서드 사용 가능
end

# 타입은 클래스를 확장하고 인터페이스를 구현해야 함
def save<T: Entity & Serializable>(entity: T): void
  # Entity 클래스와 Serializable 인터페이스의 메서드 사용 가능
end
```

## 유니온 타입 제약 조건

유니온 타입을 사용하여 여러 특정 타입 중 하나로 제약할 수 있습니다:

```trb
# T는 String 또는 Integer여야 함
def format<T: String | Integer>(value: T): String
  case value
  when String
    "String: #{value}"
  when Integer
    "Number: #{value}"
  end
end

format("hello")  # OK
format(42)       # OK
format(3.14)     # 에러: Float는 String | Integer가 아님
```

### 실용적인 유니온 제약 조건 예제

```trb
# 유연한 ID 타입
type StringOrInt = String | Integer

def find_user<T: StringOrInt>(id: T): User | nil
  case id
  when String
    User.find_by_username(id)
  when Integer
    User.find_by_id(id)
  end
end

# 둘 다 동작
user1 = find_user(123)        # 정수 ID로 찾기
user2 = find_user("alice")    # 사용자명 문자열로 찾기
```

## 제약된 제네릭 클래스

제네릭 클래스는 제약된 타입 매개변수를 가질 수 있습니다:

```trb
# 비교 가능한 항목으로만 작동하는 큐
class PriorityQueue<T: Comparable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def enqueue(item: T): void
    @items.push(item)
    @items.sort! { |a, b| b <=> a }  # 높은 우선순위 먼저
  end

  def dequeue: T | nil
    @items.shift
  end

  def peek: T | nil
    @items.first
  end
end

# 모든 비교 가능한 타입과 작동
class Task
  implements Comparable

  @priority: Integer
  @name: String

  def initialize(name: String, priority: Integer): void
    @name = name
    @priority = priority
  end

  def <=>(other: Task): Integer
    @priority <=> other.priority
  end
end

queue = PriorityQueue<Task>.new
queue.enqueue(Task.new("Low priority", 1))
queue.enqueue(Task.new("High priority", 10))
queue.enqueue(Task.new("Medium priority", 5))

# 우선순위 순서로 dequeue: High -> Medium -> Low
```

## 실전 예제

### 정렬 가능한 컬렉션

```trb
interface Comparable
  def <=>(other: self): Integer
end

class SortedList<T: Comparable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): void
    @items.push(item)
    @items.sort! { |a, b| a <=> b }
  end

  def remove(item: T): Bool
    if index = @items.index(item)
      @items.delete_at(index)
      true
    else
      false
    end
  end

  def first: T | nil
    @items.first
  end

  def last: T | nil
    @items.last
  end

  def to_a: Array<T>
    @items.dup
  end
end

# 정수와 함께 사용 (자연적으로 비교 가능)
numbers = SortedList<Integer>.new
numbers.add(5)
numbers.add(2)
numbers.add(8)
numbers.add(1)
puts numbers.to_a  # [1, 2, 5, 8] - 항상 정렬됨
```

### 제약 조건이 있는 Repository 패턴

```trb
# 기본 엔티티 클래스
class Entity
  @id: Integer

  def initialize(id: Integer): void
    @id = id
  end

  def id: Integer
    @id
  end
end

# Entity 서브클래스로 제약된 제네릭 repository
class Repository<T: Entity>
  @items: Hash<Integer, T>

  def initialize: void
    @items = {}
  end

  def save(entity: T): void
    @items[entity.id] = entity
  end

  def find(id: Integer): T | nil
    @items[id]
  end

  def all: Array<T>
    @items.values
  end

  def delete(id: Integer): Bool
    !!@items.delete(id)
  end
end

# 도메인 모델
class User < Entity
  @name: String
  @email: String

  def initialize(id: Integer, name: String, email: String): void
    super(id)
    @name = name
    @email = email
  end

  def name: String
    @name
  end
end

class Product < Entity
  @title: String
  @price: Float

  def initialize(id: Integer, title: String, price: Float): void
    super(id)
    @title = title
    @price = price
  end

  def title: String
    @title
  end
end

# 사용법
user_repo = Repository<User>.new
user_repo.save(User.new(1, "Alice", "alice@example.com"))
user_repo.save(User.new(2, "Bob", "bob@example.com"))

product_repo = Repository<Product>.new
product_repo.save(Product.new(1, "Laptop", 999.99))

found_user = user_repo.find(1)  # User | nil
all_products = product_repo.all  # Array<Product>
```

## 모범 사례

### 1. 가장 덜 제한적인 제약 조건 사용

```trb
# 좋음: 필요한 것만 요구
def print_all<T: Printable>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end

# 덜 좋음: 너무 제한적
def print_all<T: User>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end
```

### 2. 제약 조건을 위한 작고 집중된 인터페이스 생성

```trb
# 좋음: 작고 집중된 인터페이스
interface Identifiable
  def id: Integer
end

interface Timestamped
  def created_at: Time
  def updated_at: Time
end

def find_by_id<T: Identifiable>(items: Array<T>, id: Integer): T | nil
  items.find { |item| item.id == id }
end

# 덜 좋음: 크고 단일한 인터페이스
interface Model
  def id: Integer
  def save: void
  def delete: void
  def created_at: Time
  def updated_at: Time
  # 너무 많은 메서드 - 구현하기 어려움
end
```

### 3. 제약 조건 요구사항 문서화

```trb
# 좋음: 명확한 문서화
# 문자열로 변환할 수 있는 항목을 처리
# @param items [Array<T>] 출력 가능한 항목의 배열
# @return [void]
def log_items<T: Printable>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end
```

## 일반적인 제약 조건 패턴

### 식별 제약 조건

```trb
interface Identifiable
  def id: Integer | String
end

def find_duplicates<T: Identifiable>(items: Array<T>): Array<T>
  seen = {}
  duplicates = []

  items.each do |item|
    if seen[item.id]
      duplicates.push(item)
    else
      seen[item.id] = true
    end
  end

  duplicates
end
```

### 검증 제약 조건

```trb
interface Validatable
  def valid?: Bool
  def errors: Array<String>
end

def save_if_valid<T: Validatable>(item: T): Bool
  if item.valid?
    # 저장 로직
    true
  else
    puts "Validation errors: #{item.errors.join(', ')}"
    false
  end
end
```

### 변환 제약 조건

```trb
interface Convertible<T>
  def convert: T
end

def batch_convert<S: Convertible<T>, T>(items: Array<S>): Array<T>
  items.map { |item| item.convert }
end
```

## 다음 단계

이제 제약 조건을 이해했으니:

- [내장 제네릭](/docs/learn/generics/built-in-generics)에서 `Array<T>`, `Hash<K, V>` 및 기타 내장 타입과 함께 제약 조건이 어떻게 작동하는지 확인
- [인터페이스](/docs/learn/interfaces/defining-interfaces)에서 제약 조건으로 사용할 인터페이스 생성
- [고급 타입](/docs/learn/advanced/type-aliases)에서 더 복잡한 타입 패턴 탐색
