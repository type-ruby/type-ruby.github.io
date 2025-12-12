---
sidebar_position: 2
title: 교차 타입
description: 교차로 타입 결합하기
---

<DocsBadge />


# 교차 타입

:::caution 준비 중
이 기능은 향후 릴리스에 계획되어 있습니다.
:::

교차 타입을 사용하면 여러 타입을 하나로 결합하여 각 결합된 타입의 모든 속성과 메서드를 가진 타입을 만들 수 있습니다. 교차 타입을 "AND" 관계로 생각하세요—값은 교차의 모든 타입을 만족해야 합니다.

## 교차 타입 이해하기

유니온 타입이 "둘 중 하나" 관계(`A | B`는 "A 또는 B")를 나타내는 반면, 교차 타입은 "그리고" 관계(`A & B`는 "A 그리고 B")를 나타냅니다.

### 유니온 vs 교차

```trb
# 유니온 타입: 값은 String 또는 Integer일 수 있음
type StringOrInt = String | Integer
value1: StringOrInt = "hello"  # OK
value2: StringOrInt = 42       # OK

# 교차 타입: 값은 두 타입의 속성을 모두 가져야 함
type NamedAndAged = Named & Aged
# name(Named에서)과 age(Aged에서) 모두 있어야 함
```

## 기본 교차 문법

교차 연산자는 `&`입니다:

```trb
type Combined = TypeA & TypeB & TypeC
```

## 인터페이스 결합

교차 타입의 가장 일반적인 사용법은 인터페이스를 결합하는 것입니다:

```trb
# 개별 인터페이스 정의
interface Named
  def name: String
end

interface Aged
  def age: Integer
end

interface Contactable
  def email: String
  def phone: String
end

# 교차로 인터페이스 결합
type Person = Named & Aged
type Employee = Named & Aged & Contactable

# 교차를 구현하는 클래스는 모든 인터페이스를 구현해야 함
class User
  implements Named, Aged

  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def name: String
    @name
  end

  def age: Integer
    @age
  end
end

# User는 Person 타입으로 사용 가능
user: Person = User.new("Alice", 30)
puts user.name  # OK: Named 인터페이스
puts user.age   # OK: Aged 인터페이스
```

## 타입과 인터페이스 혼합

인터페이스를 클래스 타입과 결합할 수 있습니다:

```trb
# 기본 클래스
class Entity
  @id: Integer

  def initialize(id: Integer): void
    @id = id
  end

  def id: Integer
    @id
  end
end

# 인터페이스
interface Timestamped
  def created_at: Time
  def updated_at: Time
end

# 클래스와 인터페이스의 교차
type TimestampedEntity = Entity & Timestamped

# 구현은 Entity를 확장하고 Timestamped를 구현해야 함
class User < Entity
  implements Timestamped

  @name: String
  @created_at: Time
  @updated_at: Time

  def initialize(id: Integer, name: String): void
    super(id)
    @name = name
    @created_at = Time.now
    @updated_at = Time.now
  end

  def created_at: Time
    @created_at
  end

  def updated_at: Time
    @updated_at
  end
end

# User는 교차 타입을 만족
user: TimestampedEntity = User.new(1, "Alice")
puts user.id          # Entity 클래스에서
puts user.created_at  # Timestamped 인터페이스에서
```

## 실용적인 예제

### 믹스인 패턴

교차 타입은 Ruby의 믹스인 개념과 잘 작동합니다:

```trb
# 기능 인터페이스 정의
interface Serializable
  def to_json: String
  def self.from_json(json: String): self
end

interface Validatable
  def valid?: Bool
  def errors: Array<String>
end

interface Persistable
  def save: Bool
  def delete: Bool
end

# 필요에 따라 기능 결합
type Model = Serializable & Validatable & Persistable

# 완전한 기능의 모델 클래스
class Article
  implements Serializable, Validatable, Persistable

  @title: String
  @content: String
  @errors: Array<String>

  def initialize(title: String, content: String): void
    @title = title
    @content = content
    @errors = []
  end

  def to_json: String
    "{ \"title\": \"#{@title}\", \"content\": \"#{@content}\" }"
  end

  def self.from_json(json: String): Article
    # JSON 파싱 및 인스턴스 생성
    Article.new("Title", "Content")
  end

  def valid?: Bool
    @errors = []
    @errors.push("Title cannot be empty") if @title.empty?
    @errors.push("Content cannot be empty") if @content.empty?
    @errors.empty?
  end

  def errors: Array<String>
    @errors
  end

  def save: Bool
    return false unless valid?
    # 데이터베이스에 저장
    true
  end

  def delete: Bool
    # 데이터베이스에서 삭제
    true
  end
end

# Article은 Model 교차 타입을 만족
article: Model = Article.new("Hello", "World")
puts article.to_json    # Serializable
puts article.valid?     # Validatable
article.save            # Persistable
```

### 레포지토리 패턴

```trb
interface Identifiable
  def id: Integer | String
end

interface Timestamped
  def created_at: Time
  def updated_at: Time
end

interface SoftDeletable
  def deleted?: Bool
  def deleted_at: Time | nil
end

# 다양한 요구에 맞는 조합
type BaseEntity = Identifiable & Timestamped
type DeletableEntity = Identifiable & Timestamped & SoftDeletable

class Repository<T: BaseEntity>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def find(id: Integer | String): T | nil
    @items.find { |item| item.id == id }
  end

  def all: Array<T>
    @items.dup
  end

  def recent(limit: Integer = 10): Array<T>
    @items.sort_by { |item| item.created_at }.reverse.take(limit)
  end
end

class SoftDeleteRepository<T: DeletableEntity> < Repository<T>
  def all: Array<T>
    @items.reject { |item| item.deleted? }
  end

  def with_deleted: Array<T>
    @items.dup
  end

  def only_deleted: Array<T>
    @items.select { |item| item.deleted? }
  end
end
```

### 이벤트 시스템

```trb
interface Event
  def event_type: String
  def timestamp: Time
end

interface Cancellable
  def cancelled?: Bool
  def cancel: void
end

interface Prioritized
  def priority: Integer
end

# 다양한 기능을 가진 이벤트 타입
type BasicEvent = Event
type CancellableEvent = Event & Cancellable
type PrioritizedCancellableEvent = Event & Cancellable & Prioritized

class UserClickEvent
  implements Event

  @event_type: String
  @timestamp: Time

  def initialize: void
    @event_type = "user_click"
    @timestamp = Time.now
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end
end

class NetworkRequestEvent
  implements Event, Cancellable

  @event_type: String
  @timestamp: Time
  @cancelled: Bool

  def initialize: void
    @event_type = "network_request"
    @timestamp = Time.now
    @cancelled = false
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end

  def cancelled?: Bool
    @cancelled
  end

  def cancel: void
    @cancelled = true
  end
end

class CriticalAlertEvent
  implements Event, Cancellable, Prioritized

  @event_type: String
  @timestamp: Time
  @cancelled: Bool
  @priority: Integer

  def initialize(priority: Integer): void
    @event_type = "critical_alert"
    @timestamp = Time.now
    @cancelled = false
    @priority = priority
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end

  def cancelled?: Bool
    @cancelled
  end

  def cancel: void
    @cancelled = true
  end

  def priority: Integer
    @priority
  end
end

# 다양한 이벤트 타입을 위한 이벤트 핸들러
def handle_basic_event(event: BasicEvent): void
  puts "Event: #{event.event_type} at #{event.timestamp}"
end

def handle_cancellable_event(event: CancellableEvent): void
  if event.cancelled?
    puts "Event #{event.event_type} was cancelled"
  else
    puts "Processing #{event.event_type}"
  end
end

def handle_priority_event(event: PrioritizedCancellableEvent): void
  puts "Priority #{event.priority}: #{event.event_type}"
  event.cancel if event.priority < 5
end
```

## 제네릭과 교차

교차 타입은 제네릭과 결합할 수 있습니다:

```trb
# 교차 제약이 있는 제네릭 타입
def process<T: Serializable & Validatable>(item: T): Bool
  if item.valid?
    json = item.to_json
    # API로 전송
    true
  else
    puts "Validation errors: #{item.errors.join(', ')}"
    false
  end
end

# 여러 기능이 필요한 컬렉션
class ValidatedCollection<T: Identifiable & Validatable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): Bool
    if item.valid?
      @items.push(item)
      true
    else
      false
    end
  end

  def find(id: Integer | String): T | nil
    @items.find { |item| item.id == id }
  end

  def all_valid: Array<T>
    @items.select { |item| item.valid? }
  end

  def all_invalid: Array<T>
    @items.reject { |item| item.valid? }
  end
end
```

## 타입 가드와 좁히기

교차 타입은 타입 좁히기와 함께 작동합니다:

```trb
interface Animal
  def speak: String
end

interface Swimmable
  def swim: void
end

interface Flyable
  def fly: void
end

type Duck = Animal & Swimmable & Flyable

class DuckImpl
  implements Animal, Swimmable, Flyable

  def speak: String
    "Quack!"
  end

  def swim: void
    puts "Swimming..."
  end

  def fly: void
    puts "Flying..."
  end
end

def test_duck(animal: Animal): void
  puts animal.speak

  # responds_to?로 타입 좁히기
  if animal.responds_to?(:swim) && animal.responds_to?(:fly)
    # 여기서 animal은 Duck (Animal & Swimmable & Flyable)으로 취급
    duck = animal as Duck
    duck.swim
    duck.fly
  end
end
```

## 충돌과 해결

교차 타입에 충돌하는 멤버가 있을 때, 더 구체적인 타입이 이깁니다:

```trb
interface HasName
  def name: String
end

interface HasOptionalName
  def name: String | nil
end

# 교차는 더 제한적인 타입을 요구
type Person = HasName & HasOptionalName
# person.name은 String이어야 함 (String | nil이 아님)
# String이 String | nil보다 더 구체적이기 때문

class User
  implements HasName, HasOptionalName

  @name: String

  def initialize(name: String): void
    @name = name
  end

  # 두 인터페이스를 만족시키려면 String을 반환해야 함
  def name: String
    @name
  end
end
```

## 모범 사례

### 1. 작고 집중된 인터페이스 구성

```trb
# 좋음: 단일 책임을 가진 작은 인터페이스
interface Identifiable
  def id: Integer
end

interface Named
  def name: String
end

interface Timestamped
  def created_at: Time
end

type Entity = Identifiable & Named & Timestamped

# 덜 좋음: 크고 단일한 인터페이스
interface Entity
  def id: Integer
  def name: String
  def created_at: Time
  def updated_at: Time
  def save: Bool
  def delete: Bool
  # 너무 많은 책임
end
```

### 2. 의미 있는 이름 사용

```trb
# 좋음: 교차가 나타내는 것이 명확
type AuditedEntity = Entity & Auditable
type SerializableModel = Model & Serializable

# 덜 좋음: 일반적인 이름
type TypeA = Interface1 & Interface2
type Combined = Foo & Bar
```

### 3. 과도하게 복잡하게 만들지 않기

```trb
# 좋음: 적절한 수의 교차
type FullModel = Identifiable & Timestamped & Validatable

# 잠재적으로 문제: 너무 많은 교차
type SuperType = A & B & C & D & E & F & G & H
# 구현하고 이해하기 어려움
```

### 4. 의도 문서화

```trb
# 좋음: 왜 교차가 필요한지 설명하는 주석
# 직렬화되고 캐시될 수 있는 엔티티를 나타냄
type CacheableEntity = Serializable & Identifiable

# 캐시 구현
class Cache<T: CacheableEntity>
  @store: Hash<Integer | String, String>

  def set(entity: T): void
    @store[entity.id] = entity.to_json
  end

  def get(id: Integer | String): String | nil
    @store[id]
  end
end
```

## 일반적인 패턴

### 빌더 패턴

```trb
interface Buildable
  def build: self
end

interface Validatable
  def valid?: Bool
end

interface Resettable
  def reset: void
end

type CompleteBuilder = Buildable & Validatable & Resettable

class FormBuilder
  implements Buildable, Validatable, Resettable

  @fields: Hash<String, String>
  @errors: Array<String>

  def initialize: void
    @fields = {}
    @errors = []
  end

  def add_field(name: String, value: String): self
    @fields[name] = value
    self
  end

  def build: self
    self
  end

  def valid?: Bool
    @errors = []
    @errors.push("No fields") if @fields.empty?
    @errors.empty?
  end

  def reset: void
    @fields = {}
    @errors = []
  end
end
```

### 상태 머신

```trb
interface State
  def name: String
end

interface Transitionable
  def can_transition_to?(state: String): Bool
  def transition_to(state: String): void
end

interface Observable
  def on_enter: void
  def on_exit: void
end

type ManagedState = State & Transitionable & Observable

class WorkflowState
  implements State, Transitionable, Observable

  @name: String
  @allowed_transitions: Array<String>

  def initialize(name: String, allowed_transitions: Array<String>): void
    @name = name
    @allowed_transitions = allowed_transitions
  end

  def name: String
    @name
  end

  def can_transition_to?(state: String): Bool
    @allowed_transitions.include?(state)
  end

  def transition_to(state: String): void
    if can_transition_to?(state)
      on_exit
      # 전환 수행
      on_enter
    else
      raise "Invalid transition from #{@name} to #{state}"
    end
  end

  def on_enter: void
    puts "Entering state: #{@name}"
  end

  def on_exit: void
    puts "Exiting state: #{@name}"
  end
end
```

## 제한사항

### 기본 타입은 교차할 수 없음

```trb
# 의미가 없음 - 값은 String이면서 동시에 Integer일 수 없음
# type Impossible = String & Integer  # 빈 타입이 됨

# 교차는 구조적 타입(인터페이스, 클래스)에 의미가 있음
type Valid = Interface1 & Interface2
```

### 구현 요구사항

```trb
# 교차를 사용할 때 구현은 모든 부분을 만족해야 함
type Complete = Interface1 & Interface2 & Interface3

class MyClass
  # Interface1, Interface2, Interface3 모두 구현해야 함
  implements Interface1, Interface2, Interface3
  # ...
end
```

## 다음 단계

이제 교차 타입을 이해했으니 다음을 탐색하세요:

- [유니온 타입](/docs/learn/everyday-types/union-types)으로 "or" 타입 관계
- [타입 별칭](/docs/learn/advanced/type-aliases)으로 복잡한 교차에 이름 붙이기
- [인터페이스](/docs/learn/interfaces/defining-interfaces)로 교차를 위한 빌딩 블록 생성
- [조건부 타입](/docs/learn/advanced/conditional-types)으로 조건에 따른 타입
