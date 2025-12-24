---
sidebar_position: 2
title: 내장 타입
description: 내장 타입 전체 목록
---

<DocsBadge />


# 내장 타입

T-Ruby는 Ruby의 기본 데이터 타입과 일반적으로 사용되는 패턴에 해당하는 포괄적인 내장 타입 세트를 제공합니다. 이 레퍼런스는 T-Ruby에서 사용 가능한 모든 내장 타입을 문서화합니다.

## 프리미티브 타입

### String

텍스트 데이터를 나타냅니다. 문자열은 문자의 시퀀스입니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={25} />

```trb
name: String = "Alice"
message: String = 'Hello, world!'
text: String = <<~TEXT
  여러 줄
  문자열
TEXT
```

**일반 메서드:**
- `length: Integer` - 문자열 길이 반환
- `upcase: String` - 대문자로 변환
- `downcase: String` - 소문자로 변환
- `strip: String` - 앞뒤 공백 제거
- `split(delimiter: String): Array<String>` - 배열로 분리
- `include?(substring: String): Boolean` - 부분 문자열 포함 여부 확인
- `empty?: Boolean` - 문자열이 비어 있는지 확인

### Integer

정수(양수, 음수 또는 0)를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={36} />

```trb
count: Integer = 42
negative: Integer = -10
zero: Integer = 0
large: Integer = 1_000_000
```

**일반 메서드:**
- `abs: Integer` - 절대값
- `even?: Boolean` - 짝수인지 확인
- `odd?: Boolean` - 홀수인지 확인
- `to_s: String` - 문자열로 변환
- `to_f: Float` - 실수로 변환
- `times(&block: Proc<Integer, void>): void` - n번 반복

### Float

소수(부동 소수점)를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={47} />

```trb
price: Float = 19.99
pi: Float = 3.14159
negative: Float = -273.15
scientific: Float = 2.998e8
```

**일반 메서드:**
- `round: Integer` - 가장 가까운 정수로 반올림
- `round(digits: Integer): Float` - 소수점 자리수로 반올림
- `ceil: Integer` - 올림
- `floor: Integer` - 내림
- `abs: Float` - 절대값
- `to_s: String` - 문자열로 변환
- `to_i: Integer` - 정수로 변환

### Boolean

불리언 값: `true` 또는 `false`를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={58} />

```trb
active: Boolean = true
disabled: Boolean = false
is_valid: Boolean = count > 0
```

**참고:** T-Ruby는 타입 이름으로 `Boolean`을 사용합니다(`Boolean` 아님). `true`와 `false`만 유효한 불리언 값입니다. Ruby의 truthy 시스템과 달리, `Boolean`은 `1`, `"yes"`, 빈 문자열과 같은 truthy 값을 허용하지 않습니다.

### Symbol

불변 식별자를 나타냅니다. 심볼은 상수와 해시 키로 사용하기에 최적화되어 있습니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={69} />

```trb
status: Symbol = :active
role: Symbol = :admin
key: Symbol = :name
```

**일반 메서드:**
- `to_s: String` - 문자열로 변환
- `to_sym: Symbol` - self 반환 (호환성용)

**일반적인 용도:**
- 해시 키: `{ name: "Alice", role: :admin }`
- 상수 및 열거형
- 메서드 이름 및 식별자

### nil

값의 부재를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={80} />

```trb
nothing: nil = nil

# 유니온 타입에서 더 일반적으로 사용
optional: String | nil = nil
result: User | nil = find_user(123)
```

**메서드:**
- `nil?: Boolean` - nil에 대해 항상 `true` 반환

## 특수 타입

### Any

모든 타입을 나타냅니다. 타입 검사를 우회하므로 신중하게 사용하세요.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={91} />

```trb
value: Any = "string"
value = 123          # OK
value = true         # OK
```

**경고:** `Any`는 타입 안전성의 목적을 무효화합니다. 가능하면 `String | Integer`와 같은 유니온 타입을 선호하세요.

### void

반환 값이 없음을 나타냅니다. 부작용을 수행하는 함수에 사용됩니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={102} />

```trb
def log(message: String): void
  puts message
end

def save(data: Hash): void
  File.write("data.json", data.to_json)
end
```

**참고:** `void` 반환 타입이 있는 함수도 조기 종료를 위해 `return`을 실행할 수 있지만, 의미 있는 값을 반환해서는 안 됩니다.

### never

절대 발생하지 않는 값을 나타냅니다. 절대 반환하지 않는 함수에 사용됩니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={113} />

```trb
def raise_error(message: String): never
  raise StandardError, message
end

def infinite_loop: never
  loop { }
end
```

### self

현재 인스턴스의 타입을 나타냅니다. 메서드 체이닝에 유용합니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={124} />

```trb
class Builder
  @value: String

  def initialize: void
    @value = ""
  end

  def append(text: String): self
    @value += text
    self
  end

  def build: String
    @value
  end
end

# 메서드 체이닝 작동
result = Builder.new.append("Hello").append(" ").append("World").build
```

## 컬렉션 타입

### Array\<T\>

타입 `T`의 요소로 이루어진 순서 있는 컬렉션을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={135} />

```trb
# 문자열 배열
names: Array<String> = ["Alice", "Bob", "Charlie"]

# 정수 배열
numbers: Array<Integer> = [1, 2, 3, 4, 5]

# 혼합 타입 배열
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]

# 중첩 배열
matrix: Array<Array<Integer>> = [[1, 2], [3, 4]]

# 타입이 있는 빈 배열
items: Array<String> = []
```

**일반 메서드:**
- `length: Integer` - 배열 길이 반환
- `size: Integer` - length의 별칭
- `empty?: Boolean` - 비어 있는지 확인
- `first: T | nil` - 첫 번째 요소 반환
- `last: T | nil` - 마지막 요소 반환
- `push(item: T): Array<T>` - 끝에 요소 추가
- `pop: T | nil` - 마지막 요소 제거 및 반환
- `shift: T | nil` - 첫 번째 요소 제거 및 반환
- `unshift(item: T): Array<T>` - 시작에 요소 추가
- `include?(item: T): Boolean` - 요소 포함 여부 확인
- `map<U>(&block: Proc<T, U>): Array<U>` - 요소 변환
- `select(&block: Proc<T, Boolean>): Array<T>` - 요소 필터링
- `each(&block: Proc<T, void>): void` - 요소 반복
- `reverse: Array<T>` - 뒤집힌 배열 반환
- `sort: Array<T>` - 정렬된 배열 반환
- `join(separator: String): String` - 문자열로 결합

### Hash\<K, V\>

타입 `K`의 키와 타입 `V`의 값으로 이루어진 키-값 쌍 컬렉션을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={146} />

```trb
# 문자열 키, 정수 값
scores: Hash<String, Integer> = { "Alice" => 100, "Bob" => 95 }

# 심볼 키, 문자열 값
config: Hash<Symbol, String> = { host: "localhost", port: "3000" }

# 혼합 값 타입
user: Hash<Symbol, String | Integer> = { name: "Alice", age: 30 }

# 중첩 해시
data: Hash<String, Hash<String, Integer>> = {
  "users" => { "total" => 100, "active" => 75 }
}

# 타입이 있는 빈 해시
cache: Hash<String, Any> = {}
```

**일반 메서드:**
- `length: Integer` - 쌍의 수 반환
- `size: Integer` - length의 별칭
- `empty?: Boolean` - 비어 있는지 확인
- `key?(key: K): Boolean` - 키 존재 여부 확인
- `value?(value: V): Boolean` - 값 존재 여부 확인
- `keys: Array<K>` - 키 배열 반환
- `values: Array<V>` - 값 배열 반환
- `fetch(key: K): V` - 값 가져오기 (없으면 예외)
- `fetch(key: K, default: V): V` - 기본값으로 값 가져오기
- `merge(other: Hash<K, V>): Hash<K, V>` - 해시 병합
- `each(&block: Proc<K, V, void>): void` - 쌍 반복

### Set\<T\>

고유한 요소의 순서 없는 컬렉션을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={157} />

```trb
# 문자열 집합
tags: Set<String> = Set.new(["ruby", "rails", "web"])

# 정수 집합
unique_ids: Set<Integer> = Set.new([1, 2, 3, 2, 1])  # {1, 2, 3}
```

**일반 메서드:**
- `add(item: T): Set<T>` - 요소 추가
- `delete(item: T): Set<T>` - 요소 제거
- `include?(item: T): Boolean` - 멤버십 확인
- `empty?: Boolean` - 비어 있는지 확인
- `size: Integer` - 요소 수 반환
- `to_a: Array<T>` - 배열로 변환

### Range

값의 범위를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={168} />

```trb
# 정수 범위
numbers: Range = 1..10      # 포함: 1에서 10
numbers: Range = 1...10     # 제외: 1에서 9

# 문자 범위
letters: Range = 'a'..'z'
```

**일반 메서드:**
- `to_a: Array` - 배열로 변환
- `each(&block: Proc<Any, void>): void` - 범위 반복
- `include?(value: Any): Boolean` - 값이 범위 내에 있는지 확인
- `first: Any` - 첫 번째 값 반환
- `last: Any` - 마지막 값 반환

## 숫자 타입

### Numeric

모든 숫자 타입의 부모 타입입니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={179} />

```trb
value: Numeric = 42
value: Numeric = 3.14
```

**하위 타입:**
- `Integer`
- `Float`
- `Rational` (계획됨)
- `Complex` (계획됨)

### Rational

유리수(분수)를 나타냅니다. *(계획된 기능)*

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={190} />

```trb
fraction: Rational = Rational(1, 2)  # 1/2
```

### Complex

복소수를 나타냅니다. *(계획된 기능)*

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={201} />

```trb
complex: Complex = Complex(1, 2)  # 1+2i
```

## 함수 타입

### Proc\<Args..., Return\>

proc, 람다 또는 블록을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={212} />

```trb
# 간단한 proc
callback: Proc<String, void> = ->(msg: String): void { puts msg }

# 반환 값이 있는 Proc
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# 여러 매개변수
adder: Proc<Integer, Integer, Integer> = ->(a: Integer, b: Integer): Integer { a + b }

# 매개변수 없음
supplier: Proc<String> = ->: String { "Hello" }
```

### Lambda

`Proc`의 타입 별칭입니다. T-Ruby에서 람다와 proc은 같은 타입을 사용합니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={223} />

```trb {skip-verify}
type Lambda<Args..., Return> = Proc<Args..., Return>
```

### 블록 매개변수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={234} />

```trb
# 블록을 받는 메서드
def each_item<T>(items: Array<T>, &block: Proc<T, void>): void
  items.each { |item| block.call(item) }
end

# 여러 매개변수가 있는 블록
def map_with_index<T, U>(
  items: Array<T>,
  &block: Proc<T, Integer, U>
): Array<U>
  items.map.with_index { |item, index| block.call(item, index) }
end
```

## 객체 타입

### Object

모든 객체의 기본 타입입니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={245} />

```trb
value: Object = "string"
value: Object = 123
value: Object = User.new
```

### Class

클래스 객체를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={256} />

```trb
user_class: Class = User
string_class: Class = String

# 인스턴스 생성
instance = user_class.new
```

### Module

모듈을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={267} />

```trb
mod: Module = Enumerable
```

## IO 타입

### IO

입력/출력 스트림을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={278} />

```trb
file: IO = File.open("data.txt", "r")
stdout: IO = $stdout

def read_file(io: IO): String
  io.read
end
```

### File

파일 객체를 나타냅니다 (IO의 하위 타입).

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={289} />

```trb
file: File = File.open("data.txt", "r")

def process_file(f: File): void
  content = f.read
  puts content
end
```

## 시간 타입

### Time

시점을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={300} />

```trb
now: Time = Time.now
past: Time = Time.new(2020, 1, 1)

def format_time(t: Time): String
  t.strftime("%Y-%m-%d %H:%M:%S")
end
```

### Date

날짜(시간 없음)를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={311} />

```trb
today: Date = Date.today
birthday: Date = Date.new(1990, 5, 15)
```

### DateTime

시간대가 있는 날짜와 시간을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={322} />

```trb
moment: DateTime = DateTime.now
```

## 정규 표현식 타입

### Regexp

정규 표현식 패턴을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={333} />

```trb
pattern: Regexp = /\d+/
email_pattern: Regexp = /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i

def validate_email(email: String, pattern: Regexp): Boolean
  email.match?(pattern)
end
```

### MatchData

정규 표현식 매치의 결과를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={344} />

```trb
def extract_numbers(text: String): Array<String> | nil
  match: MatchData | nil = text.match(/\d+/)
  return nil if match.nil?
  match.to_a
end
```

## 오류 타입

### Exception

모든 예외의 기본 클래스입니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={355} />

```trb
def handle_error(error: Exception): String
  error.message
end
```

### StandardError

표준 오류 타입 (가장 일반적으로 rescue됨).

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={366} />

```trb
def safe_divide(a: Integer, b: Integer): Float | StandardError
  begin
    a.to_f / b
  rescue => e
    e
  end
end
```

### 일반적인 예외 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={377} />

```ruby
ArgumentError      # 잘못된 인자
TypeError          # 타입 불일치
NameError          # 정의되지 않은 이름
NoMethodError      # 메서드를 찾을 수 없음
RuntimeError       # 일반 런타임 오류
IOError            # I/O 작업 실패
```

## Enumerator 타입

### Enumerator\<T\>

열거 가능한 객체를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={387} />

```trb
enum: Enumerator<Integer> = [1, 2, 3].each
range_enum: Enumerator<Integer> = (1..10).each

def process<T>(enum: Enumerator<T>): Array<T>
  enum.to_a
end
```

## Struct 타입

### Struct

구조체 클래스를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={398} />

```trb
Point = Struct.new(:x, :y)

point: Point = Point.new(10, 20)
```

## Thread 타입

### Thread

실행 스레드를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={409} />

```trb
thread: Thread = Thread.new { puts "Hello from thread" }

def run_async(&block: Proc<void>): Thread
  Thread.new { block.call }
end
```

## 참조 테이블

| 타입 | 카테고리 | 설명 | 예시 |
|------|----------|------|------|
| `String` | 프리미티브 | 텍스트 데이터 | `"hello"` |
| `Integer` | 프리미티브 | 정수 | `42` |
| `Float` | 프리미티브 | 소수 | `3.14` |
| `Boolean` | 프리미티브 | True/false | `true` |
| `Symbol` | 프리미티브 | 식별자 | `:active` |
| `nil` | 프리미티브 | 값 없음 | `nil` |
| `Array<T>` | 컬렉션 | 순서 있는 목록 | `[1, 2, 3]` |
| `Hash<K, V>` | 컬렉션 | 키-값 쌍 | `{ "a" => 1 }` |
| `Set<T>` | 컬렉션 | 고유 항목 | `Set.new([1, 2])` |
| `Range` | 컬렉션 | 값 범위 | `1..10` |
| `Proc<Args, R>` | 함수 | 호출 가능 | `->​(x) { x * 2 }` |
| `Any` | 특수 | 모든 타입 | 모든 값 |
| `void` | 특수 | 반환 없음 | 부작용만 |
| `never` | 특수 | 절대 반환 안 함 | 예외/루프 |
| `self` | 특수 | 현재 인스턴스 | 메서드 체이닝 |
| `Time` | 시간 | 시점 | `Time.now` |
| `Date` | 시간 | 달력 날짜 | `Date.today` |
| `Regexp` | 패턴 | 정규식 패턴 | `/\d+/` |
| `IO` | I/O | 스트림 | `File.open(...)` |
| `Exception` | 오류 | 오류 객체 | `StandardError.new` |

## 타입 변환

T-Ruby는 내장 타입에 타입 변환 메서드를 제공합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={420} />

```ruby
# String으로
"123".to_s        # "123"
123.to_s          # "123"
3.14.to_s         # "3.14"
true.to_s         # "true"
:symbol.to_s      # "symbol"

# Integer로
"123".to_i        # 123
3.14.to_i         # 3 (버림)
true.to_i         # 오류: Boolean에는 to_i 없음

# Float으로
"3.14".to_f       # 3.14
123.to_f          # 123.0

# Symbol로
"name".to_sym     # :name
:name.to_sym      # :name

# Array로
(1..5).to_a       # [1, 2, 3, 4, 5]
{ a: 1 }.to_a     # [[:a, 1]]

# Hash로
[[:a, 1]].to_h    # { a: 1 }
```

## 타입 검사 메서드

모든 타입은 타입 검사 메서드를 지원합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/built_in_types_spec.rb" line={430} />

```trb
value: String | Integer = get_value()

# 클래스 검사
value.is_a?(String)    # Boolean
value.is_a?(Integer)   # Boolean
value.kind_of?(String) # Boolean (별칭)

# 인스턴스 검사
value.instance_of?(String)  # Boolean (정확한 클래스)

# Nil 검사
value.nil?             # Boolean

# 타입 메서드
value.class            # Class
value.class.name       # String
```

## 모범 사례

1. **Any보다 특정 타입 사용** - `Any` 대신 `String | Integer`
2. **컬렉션에 제네릭 활용** - `Array` 대신 `Array<String>`
3. **선택적 값에 유니온 타입 사용** - `String | nil` 또는 `String?`
4. **적절한 컬렉션 타입 선택** - 고유성에는 `Set`, 조회에는 `Hash`
5. **부작용에 `void` 선호** - 값을 반환하지 않는 함수를 명확히 표시
6. **반환하지 않는 함수에 `never` 사용** - 예외를 발생시키거나 영원히 루프하는 함수를 문서화

## 다음 단계

- [타입 연산자](/docs/reference/type-operators) - 유니온, 인터섹션 및 기타 연산자 알아보기
- [표준 라이브러리 타입](/docs/reference/stdlib-types) - Ruby stdlib 타입 정의 탐색
- [타입 별칭](/docs/learn/advanced/type-aliases) - 커스텀 타입 이름 만들기
- [제네릭](/docs/learn/generics/generic-functions-classes) - 제네릭 프로그래밍 마스터
