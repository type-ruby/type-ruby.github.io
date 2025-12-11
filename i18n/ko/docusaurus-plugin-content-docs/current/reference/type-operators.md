---
sidebar_position: 3
title: 타입 연산자
description: 타입 연산자와 수정자
---

# 타입 연산자

타입 연산자를 사용하면 T-Ruby에서 타입을 결합, 수정, 변환할 수 있습니다. 이 레퍼런스는 사용 가능한 모든 타입 연산자와 사용 패턴을 다룹니다.

## 유니온 연산자 (`|`)

유니온 연산자는 여러 타입을 하나로 결합하여 값이 지정된 타입 중 하나일 수 있음을 나타냅니다.

### 구문

```ruby
Type1 | Type2 | Type3
```

### 예시

```ruby
# 기본 유니온
id: String | Integer = "user-123"
id: String | Integer = 456

# 여러 타입
value: String | Integer | Float | Bool = 3.14

# nil과 함께 (선택적 타입)
name: String | nil = nil
user: User | nil = find_user(123)

# 컬렉션에서
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]
config: Hash<Symbol, String | Integer | Bool> = {
  host: "localhost",
  port: 3000,
  debug: true
}
```

### 사용 패턴

```ruby
# 함수 반환 타입
def find_user(id: Integer): User | nil
  # User 또는 nil 반환
end

# 함수 매개변수
def format_id(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    "ID-#{value}"
  end
end

# 오류 처리
def divide(a: Float, b: Float): Float | String
  return "Error: Division by zero" if b == 0
  a / b
end
```

### 타입 좁히기

타입 가드를 사용하여 유니온 타입을 좁힙니다:

```ruby
def process(value: String | Integer): String
  if value.is_a?(String)
    # T-Ruby는 여기서 value가 String임을 앎
    value.upcase
  else
    # T-Ruby는 여기서 value가 Integer임을 앎
    value.to_s
  end
end
```

## 선택적 연산자 (`?`)

`nil`과의 유니온의 약어입니다. `T?`는 `T | nil`과 동일합니다.

### 구문

```ruby
Type?
# 동일: Type | nil
```

### 예시

```ruby
# 이것들은 동일
name1: String | nil = nil
name2: String? = nil

# 선택적 매개변수
def greet(name: String?): String
  if name
    "Hello, #{name}!"
  else
    "Hello, stranger!"
  end
end

# 선택적 인스턴스 변수
class User
  @email: String?
  @phone: String | nil

  def initialize: void
    @email = nil
    @phone = nil
  end
end

# 컬렉션에서
users: Array<User?> = [User.new, nil, User.new]
cache: Hash<String, Integer?> = { "count" => 42, "missing" => nil }
```

### 안전 탐색

선택적 타입과 함께 안전 탐색 연산자(`&.`)를 사용하세요:

```ruby
def get_email_domain(user: User?): String?
  user&.email&.split("@")&.last
end
```

## 인터섹션 연산자 (`&`)

인터섹션 연산자는 여러 타입을 결합하여 값이 모든 타입을 동시에 만족해야 함을 요구합니다.

### 구문

```ruby
Type1 & Type2 & Type3
```

### 예시

```ruby
# 인터페이스 인터섹션
interface Printable
  def to_s: String
end

interface Comparable
  def <=>(other: self): Integer
end

# 타입은 두 인터페이스 모두 구현해야 함
type Serializable = Printable & Comparable

class User
  implements Printable & Comparable

  @name: String
  @id: Integer

  def initialize(name: String, id: Integer): void
    @name = name
    @id = id
  end

  def to_s: String
    "User(#{@id}: #{@name})"
  end

  def <=>(other: User): Integer
    @id <=> other.id
  end
end

# 인터섹션 타입을 받는 함수
def serialize(obj: Printable & Comparable): String
  obj.to_s
end
```

### 다중 제약

```ruby
# 다중 제약이 있는 제네릭
def sort_and_print<T>(items: Array<T>): void
  where T: Printable & Comparable

  sorted = items.sort
  sorted.each { |item| puts item.to_s }
end
```

## 제네릭 타입 매개변수 (`<T>`)

꺾쇠 괄호는 제네릭 타입 매개변수를 나타냅니다.

### 함수 제네릭

```ruby
# 단일 타입 매개변수
def first<T>(arr: Array<T>): T | nil
  arr[0]
end

# 여러 타입 매개변수
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# 제약이 있는 제네릭
def find<T>(items: Array<T>, predicate: Proc<T, Bool>): T | nil
  items.find { |item| predicate.call(item) }
end
```

### 클래스 제네릭

```ruby
# 제네릭 클래스
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end

  def set(value: T): void
    @value = value
  end
end

# 여러 타입 매개변수
class Pair<K, V>
  @key: K
  @value: V

  def initialize(key: K, value: V): void
    @key = key
    @value = value
  end

  def key: K
    @key
  end

  def value: V
    @value
  end
end
```

### 중첩 제네릭

```ruby
# 중첩 제네릭 타입
cache: Hash<String, Array<Integer>> = {
  "fibonacci" => [1, 1, 2, 3, 5, 8]
}

# 복잡한 중첩
type NestedData = Hash<String, Array<Hash<Symbol, String | Integer>>>

data: NestedData = {
  "users" => [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
  ]
}
```

## 배열 타입 연산자

배열 타입은 단일 타입 매개변수와 함께 꺾쇠 괄호 표기법을 사용합니다.

### 구문

```ruby
Array<ElementType>
```

### 예시

```ruby
# 기본 배열
strings: Array<String> = ["a", "b", "c"]
numbers: Array<Integer> = [1, 2, 3]

# 유니온 요소 타입
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]

# 중첩 배열
matrix: Array<Array<Float>> = [
  [1.0, 2.0],
  [3.0, 4.0]
]

# 배열을 반환하는 제네릭 함수
def range<T>(start: T, count: Integer, &block: Proc<T, T>): Array<T>
  result: Array<T> = [start]
  current = start

  (count - 1).times do
    current = block.call(current)
    result.push(current)
  end

  result
end
```

## 해시 타입 연산자

해시 타입은 두 개의 타입 매개변수(키와 값 타입)와 함께 꺾쇠 괄호를 사용합니다.

### 구문

```ruby
Hash<KeyType, ValueType>
```

### 예시

```ruby
# 기본 해시
scores: Hash<String, Integer> = { "Alice" => 100 }
config: Hash<Symbol, String> = { host: "localhost" }

# 유니온 값 타입
data: Hash<String, String | Integer | Bool> = {
  "name" => "Alice",
  "age" => 30,
  "active" => true
}

# 중첩 해시
users: Hash<Integer, Hash<Symbol, String>> = {
  1 => { name: "Alice", email: "alice@example.com" }
}

# 제네릭 해시 함수
def group_by<T, K>(items: Array<T>, &block: Proc<T, K>): Hash<K, Array<T>>
  result: Hash<K, Array<T>> = {}

  items.each do |item|
    key = block.call(item)
    result[key] ||= []
    result[key].push(item)
  end

  result
end
```

## Proc 타입 연산자

Proc 타입은 타입이 지정된 매개변수와 반환 값을 가진 호출 가능한 객체를 지정합니다.

### 구문

```ruby
Proc<Param1Type, Param2Type, ..., ReturnType>
```

### 예시

```ruby
# 매개변수 없음
supplier: Proc<String> = ->: String { "Hello" }

# 단일 매개변수
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# 여러 매개변수
adder: Proc<Integer, Integer, Integer> = ->(a: Integer, b: Integer): Integer {
  a + b
}

# Void 반환
logger: Proc<String, void> = ->(msg: String): void { puts msg }

# 제네릭 proc 매개변수
def map<T, U>(arr: Array<T>, fn: Proc<T, U>): Array<U>
  arr.map { |item| fn.call(item) }
end

# 블록 매개변수
def each_with_index<T>(items: Array<T>, &block: Proc<T, Integer, void>): void
  items.each_with_index { |item, index| block.call(item, index) }
end
```

## 타입 단언 연산자 (`as`)

타입 단언은 타입 검사를 재정의합니다. 주의해서 사용하세요.

### 구문

```ruby
value as TargetType
```

### 예시

```ruby
# 타입 단언
value = get_unknown_value() as String

# Any에서 캐스팅
data: Any = fetch_data()
user = data as User

# 유니온 타입 좁히기
def process(value: String | Integer): String
  if is_string?(value)
    # 단언 없이 T-Ruby가 좁히지 못할 수 있음
    str = value as String
    str.upcase
  else
    value.to_s
  end
end
```

### 경고

타입 단언은 타입 안전성을 우회합니다. 타입 가드를 선호하세요:

```ruby
# ❌ 위험: 타입 단언 사용
def bad_example(value: Any): String
  (value as String).upcase
end

# ✅ 더 나음: 타입 가드 사용
def good_example(value: Any): String | nil
  if value.is_a?(String)
    value.upcase
  else
    nil
  end
end
```

## 타입 가드 연산자 (`is`)

타입 가드는 타입을 좁히는 술어입니다. *(실험적 기능)*

### 구문

```ruby
def function_name(param: Type): param is NarrowedType
  # 타입 검사 로직
end
```

### 예시

```ruby
# 문자열 가드
def is_string(value: Any): value is String
  value.is_a?(String)
end

# 숫자 가드
def is_number(value: Any): value is Integer | Float
  value.is_a?(Integer) || value.is_a?(Float)
end

# 사용
value = get_value()
if is_string(value)
  # 여기서 value는 String
  puts value.upcase
end

# 커스텀 타입 가드
def is_user(value: Any): value is User
  value.is_a?(User) && value.respond_to?(:name)
end
```

## 리터럴 타입 연산자

리터럴 타입은 일반 타입이 아닌 특정 값을 나타냅니다.

### 문자열 리터럴

```ruby
type Status = "pending" | "active" | "completed" | "failed"

status: Status = "active"  # OK
# status: Status = "unknown"  # 오류

def set_status(s: Status): void
  # 네 가지 특정 문자열만 허용
end
```

### 숫자 리터럴

```ruby
type HTTPPort = 80 | 443 | 8080 | 3000

port: HTTPPort = 443  # OK
# port: HTTPPort = 9999  # 오류

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6
```

### 심볼 리터럴

```ruby
type Role = :admin | :editor | :viewer

role: Role = :admin  # OK
# role: Role = :guest  # 오류

type HTTPMethod = :get | :post | :put | :patch | :delete
```

### 불리언 리터럴

```ruby
type AlwaysTrue = true
type AlwaysFalse = false

flag: AlwaysTrue = true
# flag: AlwaysTrue = false  # 오류
```

## 튜플 타입 *(계획됨)*

위치별로 특정 타입을 가진 고정 길이 배열입니다.

```ruby
# 튜플 타입 (계획됨)
type Point = [Float, Float]
type RGB = [Integer, Integer, Integer]

point: Point = [10.5, 20.3]
color: RGB = [255, 0, 128]

# 레이블이 있는 튜플 (계획됨)
type Person = [name: String, age: Integer]
person: Person = ["Alice", 30]
```

## Readonly 수정자 *(계획됨)*

타입을 불변으로 만듭니다.

```ruby
# Readonly 타입 (계획됨)
type ReadonlyArray<T> = readonly Array<T>
type ReadonlyHash<K, V> = readonly Hash<K, V>

# 수정 불가
nums: ReadonlyArray<Integer> = [1, 2, 3]
# nums.push(4)  # 오류: readonly 배열 수정 불가
```

## Keyof 연산자 *(계획됨)*

객체 타입에서 키를 추출합니다.

```ruby
# Keyof 연산자 (계획됨)
interface User
  @name: String
  @email: String
  @age: Integer
end

type UserKey = keyof User  # :name | :email | :age
```

## Typeof 연산자 *(계획됨)*

값의 타입을 가져옵니다.

```ruby
# Typeof 연산자 (계획됨)
config = { host: "localhost", port: 3000 }
type Config = typeof config
# Config = Hash<Symbol, String | Integer>
```

## 연산자 우선순위

연산자를 결합할 때 T-Ruby는 다음 우선순위를 따릅니다 (높은 것에서 낮은 것으로):

1. 제네릭 매개변수: `<T>`
2. Array/Hash/Proc: `Array<T>`, `Hash<K,V>`, `Proc<T,R>`
3. 인터섹션: `&`
4. 유니온: `|`
5. 선택적: `?`

### 예시

```ruby
# 인터섹션이 유니온보다 높은 우선순위
type A = String | Integer & Float
# 동일: String | (Integer & Float)

# 명확성을 위해 괄호 사용
type B = (String | Integer) & Comparable

# 선택적은 왼쪽의 전체 타입에 적용
type C = String | Integer?
# 동일: String | (Integer | nil)

# Integer만 선택적으로 만들려면 괄호 사용
type D = String | (Integer?)
```

## 연산자 참조 테이블

| 연산자 | 이름 | 설명 | 예시 |
|--------|------|------|------|
| `\|` | 유니온 | 둘 중 하나 타입 | `String \| Integer` |
| `&` | 인터섹션 | 두 타입 모두 | `Printable & Comparable` |
| `?` | 선택적 | 타입 또는 nil | `String?` |
| `<T>` | 제네릭 | 타입 매개변수 | `Array<T>` |
| `as` | 타입 단언 | 타입 강제 | `value as String` |
| `is` | 타입 가드 | 타입 술어 | `value is String` |
| `[]` | 튜플 | 고정 배열 | `[String, Integer]` (계획됨) |
| `readonly` | Readonly | 불변 | `readonly Array<T>` (계획됨) |
| `keyof` | 키 추출 | 객체 키 | `keyof User` (계획됨) |
| `typeof` | 타입 쿼리 | 타입 가져오기 | `typeof value` (계획됨) |

## 모범 사례

### 1. Any보다 유니온 선호

```ruby
# ❌ 너무 관용적
data: Any = get_data()

# ✅ 특정 타입
data: String | Integer | Hash<String, String> = get_data()
```

### 2. 명확성을 위해 선택적 연산자 사용

```ruby
# ❌ 장황함
name: String | nil = nil

# ✅ 간결함
name: String? = nil
```

### 3. 유니온 복잡도 제한

```ruby
# ❌ 너무 많은 옵션
value: String | Integer | Float | Bool | Symbol | nil | Array<String>

# ✅ 타입 별칭 사용
type PrimitiveValue = String | Integer | Float | Bool
type OptionalPrimitive = PrimitiveValue?
```

### 4. 여러 인터페이스에 인터섹션 사용

```ruby
# ✅ 명확한 요구사항
def process<T>(item: T): void
  where T: Serializable & Comparable
  # item은 두 가지 모두 구현해야 함
end
```

### 5. 과도한 타입 단언 피하기

```ruby
# ❌ 타입 안전성 우회
def risky(data: Any): String
  (data as Hash<String, String>)["key"] as String
end

# ✅ 타입 가드 사용
def safe(data: Any): String?
  return nil unless data.is_a?(Hash)
  value = data["key"]
  value.is_a?(String) ? value : nil
end
```

## 일반적인 패턴

### 유니온이 있는 Result 타입

```ruby
type Result<T, E> = { success: true, value: T } | { success: false, error: E }

def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, error: "Division by zero" }
  else
    { success: true, value: a / b }
  end
end
```

### 선택적 체이닝

```ruby
class User
  @profile: Profile?

  def avatar_url: String?
    @profile&.avatar&.url
  end
end
```

### 가드가 있는 타입 좁히기

```ruby
def process_value(value: String | Integer | nil): String
  if value.nil?
    "No value"
  elsif value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end
```

## 다음 단계

- [내장 타입](/docs/reference/built-in-types) - 전체 타입 레퍼런스
- [타입 별칭](/docs/learn/advanced/type-aliases) - 커스텀 타입 만들기
- [제네릭](/docs/learn/generics/generic-functions-classes) - 제네릭 프로그래밍
- [유니온 타입](/docs/learn/everyday-types/union-types) - 상세 유니온 타입 가이드
