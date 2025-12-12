---
sidebar_position: 1
title: 타입 구문 치트시트
description: T-Ruby 타입 구문 빠른 참조
---

<DocsBadge />


# 타입 구문 치트시트

T-Ruby 타입 구문에 대한 포괄적인 빠른 참조 가이드입니다. 모든 타입 어노테이션과 구문 패턴에 쉽게 접근하기 위해 이 페이지를 북마크하세요.

## 기본 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `String` | 텍스트 데이터 | `name: String = "Alice"` |
| `Integer` | 정수 | `count: Integer = 42` |
| `Float` | 소수 | `price: Float = 19.99` |
| `Bool` | 불리언 값 | `active: Bool = true` |
| `Symbol` | 불변 식별자 | `status: Symbol = :active` |
| `nil` | 값의 부재 | `value: nil = nil` |
| `Any` | 모든 타입 (가능하면 피하세요) | `data: Any = "anything"` |
| `void` | 반환 값 없음 | `def log(msg: String): void` |

## 변수 어노테이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 타입 어노테이션이 있는 변수
name: String = "Alice"
age: Integer = 30
price: Float = 99.99

# 여러 변수
x: Integer = 1
y: Integer = 2
z: Integer = 3

# 타입 추론 (타입 어노테이션 선택적)
message = "Hello"  # String으로 추론
```

## 함수 시그니처

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 기본 함수
def greet(name: String): String
  "Hello, #{name}!"
end

# 여러 매개변수
def add(a: Integer, b: Integer): Integer
  a + b
end

# 선택적 매개변수
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

# 나머지 매개변수
def sum(*numbers: Integer): Integer
  numbers.sum
end

# 키워드 인자
def create_user(name: String, email: String, age: Integer = 18): Hash
  { name: name, email: email, age: age }
end

# 반환 값 없음
def log(message: String): void
  puts message
end
```

## 유니온 타입

| 구문 | 설명 | 예시 |
|------|------|------|
| `A \| B` | 타입 A 또는 B | `String \| Integer` |
| `A \| B \| C` | 여러 타입 중 하나 | `String \| Integer \| Bool` |
| `T \| nil` | 선택적 타입 | `String \| nil` |
| `T?` | `T \| nil`의 약어 | `String?` |

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 유니온 타입
id: String | Integer = "user-123"
id: String | Integer = 456

# 선택적 값
name: String | nil = nil
name: String? = nil  # 약어

# 여러 타입
value: String | Integer | Bool = true

# 유니온 반환 타입이 있는 함수
def find_user(id: Integer): User | nil
  # User 또는 nil 반환
end
```

## 배열 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 특정 타입의 배열
names: Array<String> = ["Alice", "Bob"]
numbers: Array<Integer> = [1, 2, 3]

# 유니온 타입의 배열
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]

# 중첩 배열
matrix: Array<Array<Integer>> = [[1, 2], [3, 4]]

# 타입이 있는 빈 배열
items: Array<String> = []
```

## 해시 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 특정 키와 값 타입의 해시
scores: Hash<String, Integer> = { "Alice" => 100, "Bob" => 95 }

# 심볼 키
config: Hash<Symbol, String> = { host: "localhost", port: "3000" }

# 유니온 값 타입
data: Hash<String, String | Integer> = { "name" => "Alice", "age" => 30 }

# 중첩 해시
users: Hash<Integer, Hash<Symbol, String>> = {
  1 => { name: "Alice", email: "alice@example.com" }
}
```

## 제네릭 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 제네릭 함수
def first<T>(arr: Array<T>): T | nil
  arr[0]
end

# 여러 타입 매개변수
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# 제네릭 클래스
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end
end

# 제네릭 사용
box = Box<String>.new("hello")
result = first([1, 2, 3])  # 타입 추론
```

## 타입 별칭

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 간단한 별칭
type UserId = Integer
type EmailAddress = String

# 유니온 타입 별칭
type ID = String | Integer
type JSONValue = String | Integer | Float | Bool | nil

# 컬렉션 별칭
type StringList = Array<String>
type UserMap = Hash<Integer, User>

# 제네릭 별칭
type Result<T> = T | nil
type Callback<T> = Proc<T, void>

# 별칭 사용
user_id: UserId = 123
email: EmailAddress = "alice@example.com"
```

## 클래스 어노테이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 인스턴스 변수
class User
  @name: String
  @age: Integer
  @email: String | nil

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
    @email = nil
  end

  def name: String
    @name
  end

  def age: Integer
    @age
  end
end

# 클래스 변수
class Counter
  @@count: Integer = 0

  def self.increment: void
    @@count += 1
  end

  def self.count: Integer
    @@count
  end
end

# 제네릭 클래스
class Container<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def value: T
    @value
  end
end
```

## 인터페이스 정의

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 기본 인터페이스
interface Printable
  def to_s: String
end

# 여러 메서드가 있는 인터페이스
interface Comparable
  def <=>(other: self): Integer
  def ==(other: self): Bool
end

# 제네릭 인터페이스
interface Collection<T>
  def add(item: T): void
  def remove(item: T): Bool
  def size: Integer
end

# 인터페이스 구현
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
```

## 타입 연산자

| 연산자 | 이름 | 설명 | 예시 |
|--------|------|------|------|
| `\|` | 유니온 | 둘 중 하나 타입 | `String \| Integer` |
| `&` | 인터섹션 | 두 타입 모두 | `Printable & Comparable` |
| `?` | 선택적 | `\| nil`의 약어 | `String?` |
| `<T>` | 제네릭 | 타입 매개변수 | `Array<T>` |
| `=>` | 해시 쌍 | 키-값 타입 | `Hash<String => Integer>` |

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 유니온 (OR)
value: String | Integer

# 인터섹션 (AND)
class Person
  implements Printable & Comparable
end

# 선택적
name: String?  # String | nil과 동일

# 제네릭
items: Array<String>
pairs: Hash<String, Integer>
```

## 블록, Proc, 람다

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 블록 매개변수
def each_item<T>(items: Array<T>, &block: Proc<T, void>): void
  items.each { |item| block.call(item) }
end

# Proc 타입
callback: Proc<String, void> = ->(msg: String): void { puts msg }
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# 타입이 있는 람다
double: Proc<Integer, Integer> = ->(n: Integer): Integer { n * 2 }

# 여러 매개변수가 있는 블록
def map<T, U>(items: Array<T>, &block: Proc<T, Integer, U>): Array<U>
  items.map.with_index { |item, index| block.call(item, index) }
end
```

## 타입 좁히기

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# is_a?로 타입 검사
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase  # T-Ruby는 value가 String임을 앎
  else
    value.to_s    # T-Ruby는 value가 Integer임을 앎
  end
end

# Nil 검사
def get_length(text: String | nil): Integer
  if text.nil?
    0
  else
    text.length  # T-Ruby는 text가 String임을 앎
  end
end

# 여러 검사
def describe(value: String | Integer | Bool): String
  if value.is_a?(String)
    "String: #{value}"
  elsif value.is_a?(Integer)
    "Number: #{value}"
  else
    "Boolean: #{value}"
  end
end
```

## 리터럴 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 문자열 리터럴
type Status = "pending" | "active" | "completed"
status: Status = "active"

# 숫자 리터럴
type Port = 80 | 443 | 8080
port: Port = 443

# 심볼 리터럴
type Role = :admin | :editor | :viewer
role: Role = :admin

# 불리언 리터럴
type Yes = true
type No = false
```

## 고급 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 인터섹션 타입
type Serializable = Printable & Comparable
obj: Serializable  # 두 인터페이스 모두 구현해야 함

# 조건부 타입 (계획됨)
type NonNullable<T> = T extends nil ? never : T

# 매핑된 타입 (계획됨)
type Readonly<T> = { readonly [K in keyof T]: T[K] }

# 유틸리티 타입
type Partial<T>    # 모든 속성 선택적
type Required<T>   # 모든 속성 필수
type Pick<T, K>    # 속성 선택
type Omit<T, K>    # 속성 제거
```

## 타입 단언

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# 타입 캐스팅 (주의해서 사용)
value = get_value() as String
number = parse("42") as Integer

# 안전한 타입 변환
def to_integer(value: String | Integer): Integer
  if value.is_a?(Integer)
    value
  else
    value.to_i
  end
end
```

## 모듈 타입 어노테이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
module Formatter
  # 타입이 있는 모듈 메서드
  def self.format(value: String, width: Integer): String
    value.ljust(width)
  end

  # 타입이 있는 모듈 상수
  DEFAULT_WIDTH: Integer = 80
  DEFAULT_CHAR: String = " "
end

# 믹스인 모듈
module Timestamped
  @created_at: Integer
  @updated_at: Integer

  def timestamp: Integer
    @created_at
  end
end
```

## 일반적인 패턴

### 기본값이 있는 선택적 매개변수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
def create_user(
  name: String,
  email: String,
  age: Integer = 18,
  active: Bool = true
): User
  User.new(name, email, age, active)
end
```

### 결과 타입 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
type Result<T, E> = { success: Bool, value: T | nil, error: E | nil }

def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, value: nil, error: "Division by zero" }
  else
    { success: true, value: a / b, error: nil }
  end
end
```

### 빌더 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
class QueryBuilder
  @conditions: Array<String>

  def initialize: void
    @conditions = []
  end

  def where(condition: String): self
    @conditions << condition
    self
  end

  def build: String
    @conditions.join(" AND ")
  end
end
```

### 타입 가드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
def is_string(value: Any): value is String
  value.is_a?(String)
end

def is_user(value: Any): value is User
  value.is_a?(User)
end

# 사용
value = get_value()
if is_string(value)
  puts value.upcase  # 여기서 value는 String
end
```

## 빠른 팁

1. **타입 추론 사용** - 모든 것에 어노테이션을 달지 말고, T-Ruby가 간단한 타입을 추론하게 하세요
2. **Any보다 유니온 타입 선호** - `String | Integer`가 `Any`보다 낫습니다
3. **타입 별칭 사용** - 별칭으로 복잡한 타입을 읽기 쉽게 만드세요
4. **사용 전 타입 확인** - 유니온 타입에 `is_a?`와 `nil?` 사용
5. **제네릭 활용** - 재사용 가능하고 타입 안전한 코드 작성
6. **점진적 시작** - 한 번에 모든 것에 타입을 지정할 필요 없습니다
7. **부작용에 `void` 사용** - 의미 있는 값을 반환하지 않는 메서드
8. **과도한 타입 지정 피하기** - 타입이 명확하면 T-Ruby가 추론하게 하세요

## 일반적인 타입 오류

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/cheatsheet_spec.rb" line={21} />

```trb
# ❌ 잘못됨: 잘못된 타입 할당
name: String = 123  # 오류: Integer는 String이 아님

# ✅ 올바름: 유니온 타입 사용
id: String | Integer = 123

# ❌ 잘못됨: 타입 검사 없이 속성 접근
def get_length(value: String | nil): Integer
  value.length  # 오류: value가 nil일 수 있음
end

# ✅ 올바름: 먼저 nil 검사
def get_length(value: String | nil): Integer
  if value.nil?
    0
  else
    value.length
  end
end

# ❌ 잘못됨: 타입 매개변수 없는 제네릭
box = Box.new("hello")  # 타입을 추론할 수 없으면 오류

# ✅ 올바름: 타입 매개변수 지정
box = Box<String>.new("hello")
```

## 파일 확장자와 컴파일

```bash
# T-Ruby 소스 파일
hello.trb

# Ruby로 컴파일
trc hello.trb
# 생성: hello.rb

# RBS 타입 생성
trc --rbs hello.trb
# 생성: hello.rbs

# 감시 모드
trc --watch *.trb

# 타입 검사만 (출력 없음)
trc --check hello.trb
```

## 추가 읽기

- [내장 타입](/docs/reference/built-in-types) - 내장 타입 전체 목록
- [타입 연산자](/docs/reference/type-operators) - 상세 연산자 레퍼런스
- [표준 라이브러리 타입](/docs/reference/stdlib-types) - Ruby stdlib 타입 정의
- [타입 별칭](/docs/learn/advanced/type-aliases) - 고급 별칭 기법
- [제네릭](/docs/learn/generics/generic-functions-classes) - 제네릭 프로그래밍 가이드
