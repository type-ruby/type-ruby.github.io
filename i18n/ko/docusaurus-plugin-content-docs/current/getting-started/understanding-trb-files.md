---
sidebar_position: 3
title: .trb 파일 이해하기
description: T-Ruby 파일의 작동 방식 알아보기
---

<DocsBadge />


# .trb 파일 이해하기

이 가이드는 T-Ruby 파일을 단계별로 생성하면서 각 개념을 설명합니다.

## .trb 파일 이해하기

`.trb` 파일은 T-Ruby 소스 파일입니다. 기본적으로 타입 어노테이션이 있는 Ruby 코드입니다. T-Ruby 컴파일러(`trc`)는 `.trb` 파일을 읽고 다음을 생성합니다:

1. **`.rb` 파일** - 타입이 제거된 표준 Ruby 코드
2. **`.rbs` 파일** - 도구를 위한 타입 서명 파일

## 파일 생성하기

간단한 계산기를 구현하는 `calculator.trb` 파일을 만들어봅시다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={25} />

```trb title="calculator.trb"
# calculator.trb - 간단한 타입 계산기

# 타입 어노테이션이 있는 기본 산술 연산
def add(a: Integer, b: Integer): Integer
  a + b
end

def subtract(a: Integer, b: Integer): Integer
  a - b
end

def multiply(a: Integer, b: Integer): Integer
  a * b
end

def divide(a: Integer, b: Integer): Float
  a.to_f / b
end
```

### 타입 함수의 구조

문법을 분석해봅시다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={36} />

```trb
def add(a: Integer, b: Integer): Integer
#   ^^^  ^  ^^^^^^^  ^  ^^^^^^^   ^^^^^^^
#   |    |    |      |    |         |
#   |    |    |      |    |         └── 반환 타입
#   |    |    |      |    └── 두 번째 매개변수 타입
#   |    |    |      └── 두 번째 매개변수 이름
#   |    |    └── 첫 번째 매개변수 타입
#   |    └── 첫 번째 매개변수 이름
#   └── 함수 이름
```

## 더 많은 기능 추가하기

계산기를 더 고급 기능으로 확장해봅시다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={47} />

```trb title="calculator.trb"
# 더 깔끔한 코드를 위한 타입 별칭
type Number = Integer | Float

# 이제 함수가 Integer와 Float 모두 받을 수 있습니다
def add(a: Number, b: Number): Number
  a + b
end

def subtract(a: Number, b: Number): Number
  a - b
end

def multiply(a: Number, b: Number): Number
  a * b
end

def divide(a: Number, b: Number): Float
  a.to_f / b.to_f
end

# 실패할 수 있는 함수 - 오류 시 nil 반환
def safe_divide(a: Number, b: Number): Float | nil
  return nil if b == 0
  a.to_f / b.to_f
end

# 유틸리티 함수를 위한 제네릭 타입 사용
def max<T: Comparable>(a: T, b: T): T
  a > b ? a : b
end
```

### Union 타입 이해하기

`|` 연산자는 union 타입을 생성합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={58} />

```trb
type Number = Integer | Float  # Integer 또는 Float일 수 있음

def safe_divide(a: Number, b: Number): Float | nil
  # 반환 타입은 Float 또는 nil일 수 있음
  return nil if b == 0
  a.to_f / b.to_f
end
```

### 제네릭 이해하기

`<T>` 문법은 제네릭 타입 매개변수를 정의합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={69} />

```trb
def max<T: Comparable>(a: T, b: T): T
#     ^^  ^^^^^^^^^^
#     |       |
#     |       └── 제약: T는 Comparable을 구현해야 함
#     └── 제네릭 타입 매개변수

# 모든 비교 가능한 타입에서 작동합니다:
max(5, 3)       # T는 Integer
max(5.5, 3.2)   # T는 Float
max("a", "b")   # T는 String
```

## 클래스 추가하기

Calculator 클래스를 만들어봅시다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={80} />

```trb title="calculator.trb"
class Calculator
  # 타입 어노테이션이 있는 인스턴스 변수
  @history: String[]

  def initialize: void
    @history = []
  end

  def add(a: Number, b: Number): Number
    result = a + b
    record_operation("#{a} + #{b} = #{result}")
    result
  end

  def subtract(a: Number, b: Number): Number
    result = a - b
    record_operation("#{a} - #{b} = #{result}")
    result
  end

  def multiply(a: Number, b: Number): Number
    result = a * b
    record_operation("#{a} * #{b} = #{result}")
    result
  end

  def divide(a: Number, b: Number): Float | nil
    if b == 0
      record_operation("#{a} / #{b} = ERROR (0으로 나눔)")
      return nil
    end
    result = a.to_f / b.to_f
    record_operation("#{a} / #{b} = #{result}")
    result
  end

  def history: String[]
    @history.dup
  end

  private

  def record_operation(operation: String): void
    @history << operation
  end
end

# 클래스 사용하기
calc = Calculator.new
puts calc.add(10, 5)      # 15
puts calc.multiply(3, 4)  # 12
puts calc.divide(10, 3)   # 3.333...
puts calc.divide(10, 0)   # nil

puts "\n히스토리:"
calc.history.each { |op| puts "  #{op}" }
```

## 컴파일 및 실행

```bash
# 컴파일
trc calculator.trb

# 실행
ruby build/calculator.rb
```

예상 출력:
```
15
12
3.3333333333333335

히스토리:
  10 + 5 = 15
  3 * 4 = 12
  10 / 3 = 3.3333333333333335
```

## 출력 확인하기

생성된 파일을 살펴보세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={91} />

```ruby title="build/calculator.rb"
class Calculator
  def initialize
    @history = []
  end

  def add(a, b)
    result = a + b
    record_operation("#{a} + #{b} = #{result}")
    result
  end

  # ... 타입이 완전히 제거됨
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={101} />

```rbs title="build/calculator.rbs"
type Number = Integer | Float

class Calculator
  @history: Array[String]

  def initialize: () -> void
  def add: (Number a, Number b) -> Number
  def subtract: (Number a, Number b) -> Number
  def multiply: (Number a, Number b) -> Number
  def divide: (Number a, Number b) -> Float?
  def history: () -> Array[String]
  private def record_operation: (String operation) -> void
end
```

## 일반적인 패턴

### 옵셔널 매개변수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={111} />

```trb
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

greet("Alice")           # "Hello, Alice!"
greet("Alice", "Hi")     # "Hi, Alice!"
```

### Nullable 타입 (옵셔널 축약형)

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={122} />

```trb
# 다음은 동일합니다:
def find(id: Integer): User | nil
def find(id: Integer): User?  # 축약형
```

### 블록 매개변수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/first_trb_file_spec.rb" line={133} />

```trb
def each_item(items: String[], &block: (String) -> void): void
  items.each(&block)
end

each_item(["a", "b", "c"]) { |item| puts item }
```

## 오류 메시지

T-Ruby는 유용한 오류 메시지를 제공합니다. 다음은 만날 수 있는 몇 가지입니다:

### 타입 불일치
```
Error: calculator.trb:5:10
  타입 불일치: Integer가 필요한데 String을 받음

    add("hello", 5)
        ^^^^^^^
```

### 타입 어노테이션 누락
```
Warning: calculator.trb:3:5
  매개변수 'x'에 타입 어노테이션이 없음

    def process(x)
                ^
```

### 알 수 없는 타입
```
Error: calculator.trb:2:15
  알 수 없는 타입 'Stringg' ('String'을 의미했나요?)

    def greet(name: Stringg): String
                    ^^^^^^^
```

## 모범 사례

1. **공개 API부터 시작** - 공개 메서드에 먼저 타입 지정
2. **타입 별칭 사용** - 복잡한 타입을 읽기 쉽게 만들기
3. **구체적인 타입 선호** - `Array`보다 `String[]`
4. **타입으로 문서화** - 타입은 문서 역할을 함

## 다음 단계

`.trb` 파일을 이해했으니, 다음으로 진행하세요:

- [에디터 설정](/docs/getting-started/editor-setup) - IDE 지원 받기
- [프로젝트 구성](/docs/getting-started/project-configuration) - 대규모 프로젝트 구성
- [기본 타입](/docs/learn/basics/basic-types) - 타입 시스템 깊이 알아보기
