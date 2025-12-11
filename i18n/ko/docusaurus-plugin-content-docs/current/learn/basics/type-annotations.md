---
sidebar_position: 1
title: 타입 어노테이션
description: T-Ruby에서 타입 어노테이션의 기본 학습
---

# 타입 어노테이션

타입 어노테이션은 T-Ruby 타입 시스템의 기반입니다. 변수, 메서드 매개변수, 반환 값의 타입을 명시적으로 선언할 수 있게 해줍니다. 이 장에서는 Ruby 코드에 타입 정보를 추가하는 문법과 모범 사례를 배웁니다.

## 타입 어노테이션이란?

타입 어노테이션은 변수, 매개변수 또는 반환 값이 어떤 타입의 데이터여야 하는지 T-Ruby에게 알려주는 특별한 문법입니다. 데이터가 예상한 대로 프로그램을 통해 흐르도록 보장하여 버그를 일찍 잡는 데 도움이 됩니다.

T-Ruby에서 타입 어노테이션은 콜론(`:`) 뒤에 타입 이름을 사용합니다:

```ruby title="hello.trb"
# 타입 어노테이션이 있는 변수
name: String = "Alice"

# 타입 어노테이션이 있는 메서드 매개변수
def greet(person: String)
  puts "Hello, #{person}!"
end

# 반환 타입 어노테이션이 있는 메서드
def get_age(): Integer
  25
end
```

T-Ruby가 이 코드를 트랜스파일하면, 타입 어노테이션이 제거되어 순수 Ruby가 남습니다:

```ruby title="hello.rb"
# 타입 어노테이션이 제거된 변수
name = "Alice"

# 타입 어노테이션 없는 메서드 매개변수
def greet(person)
  puts "Hello, #{person}!"
end

# 반환 타입 어노테이션 없는 메서드
def get_age()
  25
end
```

## 변수 타입 어노테이션

변수를 선언할 때 어노테이션을 추가할 수 있습니다. 문법은:

```ruby
variable_name: Type = value
```

### 기본 예제

```ruby title="variables.trb"
# String 변수
message: String = "Hello, world!"

# Integer 변수
count: Integer = 42

# Float 변수
price: Float = 19.99

# Boolean 변수
is_active: Bool = true
```

### 왜 변수에 어노테이션을 달아야 하나요?

변수의 타입 어노테이션은 여러 목적을 제공합니다:

1. **문서화**: 변수가 어떤 타입의 데이터를 담아야 하는지 명확하게 함
2. **오류 감지**: T-Ruby가 트랜스파일 시간에 타입 불일치를 잡음
3. **IDE 지원**: 에디터가 더 나은 자동완성과 힌트를 제공

```ruby title="error_example.trb"
# 이것은 타입 오류를 발생시킴
age: Integer = "twenty-five"  # 오류: Integer 변수에 String 할당

# 이것이 올바름
age: Integer = 25
```

## 메서드 매개변수 어노테이션

메서드가 어떤 타입의 인자를 받는지 지정하기 위해 매개변수에 어노테이션을 달아야 합니다:

```ruby title="parameters.trb"
def calculate_total(price: Float, quantity: Integer): Float
  price * quantity
end

# 메서드 호출
total = calculate_total(9.99, 3)  # 29.97 반환
```

### 여러 매개변수

메서드에 여러 매개변수가 있을 때 각각에 어노테이션을 달아야 합니다:

```ruby title="multiple_params.trb"
def create_user(name: String, age: Integer, email: String)
  {
    name: name,
    age: age,
    email: email
  }
end

user = create_user("Alice", 30, "alice@example.com")
```

### 기본값이 있는 옵셔널 매개변수

타입 어노테이션을 기본값과 결합할 수 있습니다:

```ruby title="defaults.trb"
def greet(name: String, greeting: String = "Hello")
  "#{greeting}, #{name}!"
end

puts greet("Alice")              # "Hello, Alice!"
puts greet("Bob", "Hi")          # "Hi, Bob!"
```

## 반환 타입 어노테이션

반환 타입 어노테이션은 메서드가 반환할 타입을 지정합니다. 매개변수 목록 뒤, 메서드 본문 앞에 옵니다:

```ruby title="return_types.trb"
# String 반환
def get_name(): String
  "Alice"
end

# Integer 반환
def get_age(): Integer
  25
end

# Boolean 반환
def is_adult?(age: Integer): Bool
  age >= 18
end

# nil 반환 (부작용 메서드에 유용)
def log_message(msg: String): nil
  puts msg
  nil
end
```

### 반환 타입이 중요한 이유

반환 타입 어노테이션은 메서드가 항상 예상된 타입을 반환하도록 보장하여 오류를 방지합니다:

```ruby title="return_safety.trb"
def divide(a: Integer, b: Integer): Float
  return 0.0 if b == 0  # 안전한 기본값
  a.to_f / b
end

# T-Ruby는 이것이 Float를 반환한다는 것을 앎
result: Float = divide(10, 3)
```

## 완전한 메서드 예제

모든 어노테이션 타입을 함께 보여주는 포괄적인 예제입니다:

```ruby title="complete_example.trb"
# 매개변수와 반환 타입 어노테이션이 있는 메서드
def calculate_discount(
  original_price: Float,
  discount_percent: Integer,
  is_member: Bool = false
): Float
  discount = original_price * (discount_percent / 100.0)

  # 멤버는 추가 5% 할인
  if is_member
    discount += original_price * 0.05
  end

  original_price - discount
end

# 메서드 사용
regular_price: Float = calculate_discount(100.0, 10)
# 90.0 반환

member_price: Float = calculate_discount(100.0, 10, true)
# 85.0 반환
```

이것은 깔끔한 Ruby로 트랜스파일됩니다:

```ruby title="complete_example.rb"
def calculate_discount(
  original_price,
  discount_percent,
  is_member = false
)
  discount = original_price * (discount_percent / 100.0)

  if is_member
    discount += original_price * 0.05
  end

  original_price - discount
end

regular_price = calculate_discount(100.0, 10)
member_price = calculate_discount(100.0, 10, true)
```

## 블록 매개변수 어노테이션

블록 매개변수에도 어노테이션을 달 수 있습니다:

```ruby title="blocks.trb"
def process_numbers(numbers: Array<Integer>)
  numbers.map do |n: Integer|
    n * 2
  end
end

result = process_numbers([1, 2, 3])
# [2, 4, 6] 반환
```

## 인스턴스 변수

클래스의 인스턴스 변수에도 어노테이션을 달 수 있습니다:

```ruby title="instance_vars.trb"
class Person
  def initialize(name: String, age: Integer)
    @name: String = name
    @age: Integer = age
  end

  def introduce(): String
    "저는 #{@name}이고 #{@age}살입니다"
  end
end

person = Person.new("Alice", 30)
puts person.introduce()
# 출력: "저는 Alice이고 30살입니다"
```

## 일반적인 함정

### 과도한 어노테이션 금지

모든 단일 변수에 어노테이션을 달 필요는 없습니다. T-Ruby는 타입 추론이 있습니다(다음 장에서 다룸). 명확성을 더할 때만 어노테이션을 달아야 합니다:

```ruby title="over_annotation.trb"
# 너무 많은 어노테이션
x: Integer = 5
y: Integer = 10
sum: Integer = x + y

# 더 나음 - 추론이 작동하게 함
x = 5
y = 10
sum: Integer = x + y  # 필요할 때만 결과에 어노테이션
```

### 반환 타입에 일관성 유지

메서드가 조건에 따라 다른 타입을 반환할 수 있다면, union 타입을 사용하세요(나중에 다룸):

```ruby title="inconsistent_return.trb"
# 이것은 오류를 발생시킴 - 일관성 없는 반환
def get_value(flag: Bool): String
  if flag
    return "yes"
  else
    return 42  # 오류: Integer가 String 반환 타입과 일치하지 않음
  end
end
```

### Nil 값 기억하기

메서드가 `nil`을 반환할 수 있다면, 반환 타입에 포함하세요:

```ruby title="nil_returns.trb"
# 올바름 - nil 가능성 포함
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# 이것은 nil일 수 있음!
user = find_user(-1)
```

## 모범 사례

1. **항상 메서드 매개변수와 반환 타입에 어노테이션** - 이것들은 공개 계약입니다
2. **타입이 명확하지 않을 때 변수에 어노테이션** - 독자가 코드를 이해하도록 도움
3. **지역 변수에 타입 추론 사용** - 타입이 명확할 때 복잡함 줄이기
4. **공개 API에서 명시적으로** - 라이브러리와 모듈 인터페이스는 완전히 어노테이션되어야 함
5. **어노테이션을 문서로 생각** - 코드를 이해하기 쉽게 만들어야 함

## 요약

T-Ruby의 타입 어노테이션은 콜론 문법을 사용하여 타입을 지정합니다:

- 변수: `name: String = "Alice"`
- 매개변수: `def greet(person: String)`
- 반환 타입: `def get_age(): Integer`
- 인스턴스 변수: `@name: String = name`

어노테이션은 안전성, 문서화, 더 나은 도구 지원을 제공하며, 트랜스파일 중에 완전히 제거되어 깔끔한 Ruby 코드를 생성합니다.

다음 장에서는 T-Ruby에서 사용 가능한 기본 타입에 대해 배웁니다.
