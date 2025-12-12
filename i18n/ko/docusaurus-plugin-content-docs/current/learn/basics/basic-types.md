---
sidebar_position: 2
title: 기본 타입
description: String, Integer, Float, Boolean, Symbol, nil
---

<DocsBadge />


# 기본 타입

T-Ruby는 Ruby의 기본 데이터 타입에 해당하는 기본 타입 세트를 제공합니다. 이러한 타입을 이해하는 것은 타입 안전한 T-Ruby 코드를 작성하는 데 필수적입니다. 이 장에서는 실용적인 예제와 함께 각 기본 타입을 자세히 살펴봅니다.

## 기본 타입 개요

T-Ruby에는 다음 기본 타입이 포함됩니다:

- `String` - 텍스트 데이터
- `Integer` - 정수
- `Float` - 소수점 숫자
- `Bool` - true 또는 false 값
- `Symbol` - 불변 식별자
- `nil` - 값의 부재

각각을 자세히 살펴봅시다.

## String

`String` 타입은 텍스트 데이터를 나타냅니다. 문자열은 따옴표로 둘러싸인 문자의 시퀀스입니다.

### 기본 String 사용

```trb title="strings.trb"
# String 변수
name: String = "Alice"
greeting: String = 'Hello, world!'

# 여러 줄 문자열
description: String = <<~TEXT
  이것은 T-Ruby의
  여러 줄 문자열입니다.
TEXT

# 문자열 보간
age = 30
message: String = "#{name}은 #{age}살입니다"
# message는 "Alice은 30살입니다"
```

### String 메서드

T-Ruby의 문자열은 모든 표준 Ruby 메서드를 가집니다. 타입 체커는 이러한 메서드를 이해합니다:

```trb title="string_methods.trb"
def format_name(name: String): String
  name.strip.downcase.capitalize
end

result: String = format_name("  ALICE  ")
# "Alice" 반환

def get_initials(first: String, last: String): String
  "#{first[0]}.#{last[0]}."
end

initials: String = get_initials("Alice", "Smith")
# "A.S." 반환
```

### String 연결

```trb title="string_concat.trb"
def build_url(protocol: String, domain: String, path: String): String
  protocol + "://" + domain + path
end

url: String = build_url("https", "example.com", "/api/users")
# "https://example.com/api/users" 반환

# 보간을 사용한 대안
def build_url_v2(protocol: String, domain: String, path: String): String
  "#{protocol}://#{domain}#{path}"
end
```

## Integer

`Integer` 타입은 양수와 음수를 포함한 정수를 나타냅니다.

### 기본 Integer 사용

```trb title="integers.trb"
# Integer 변수
count: Integer = 42
negative: Integer = -10
zero: Integer = 0

# 큰 정수
population: Integer = 7_900_000_000  # 가독성을 위한 밑줄
```

### Integer 산술

```trb title="integer_math.trb"
def calculate_total(price: Integer, quantity: Integer): Integer
  price * quantity
end

total: Integer = calculate_total(15, 4)
# 60 반환

def next_even_number(n: Integer): Integer
  n + (n % 2)
end

result: Integer = next_even_number(7)
# 8 반환
```

### Integer 메서드

```trb title="integer_methods.trb"
def absolute_value(n: Integer): Integer
  n.abs
end

abs_value: Integer = absolute_value(-42)
# 42 반환

def is_even(n: Integer): Bool
  n.even?
end

check: Bool = is_even(10)
# true 반환
```

### Integer 나눗셈

Ruby에서 정수 나눗셈은 결과를 자릅니다:

```trb title="integer_division.trb"
def divide_integers(a: Integer, b: Integer): Integer
  a / b
end

result: Integer = divide_integers(7, 2)
# 3 반환 (3.5가 아님)

# 소수 나눗셈이 필요하면 Float로 변환
def divide_as_float(a: Integer, b: Integer): Float
  a.to_f / b
end

decimal_result: Float = divide_as_float(7, 2)
# 3.5 반환
```

## Float

`Float` 타입은 소수점 숫자(부동소수점 숫자)를 나타냅니다.

### 기본 Float 사용

```trb title="floats.trb"
# Float 변수
price: Float = 19.99
temperature: Float = -3.5
pi: Float = 3.14159

# 과학적 표기법
speed_of_light: Float = 2.998e8  # 299,800,000
```

### Float 산술

```trb title="float_math.trb"
def calculate_average(values: Array<Float>): Float
  sum = 0.0
  values.each do |v|
    sum += v
  end
  sum / values.length
end

avg: Float = calculate_average([10.5, 20.3, 15.7])
# 15.5 반환

def calculate_interest(principal: Float, rate: Float, years: Integer): Float
  principal * (1 + rate) ** years
end

amount: Float = calculate_interest(1000.0, 0.05, 5)
# 약 1276.28 반환
```

### 반올림과 정밀도

```trb title="float_rounding.trb"
def round_to_cents(amount: Float): Float
  (amount * 100).round / 100.0
end

price: Float = round_to_cents(19.996)
# 20.0 반환

def format_currency(amount: Float): String
  "$%.2f" % amount
end

formatted: String = format_currency(19.99)
# "$19.99" 반환
```

### Float vs Integer

정수와 부동소수점을 혼합하면 결과는 일반적으로 부동소수점입니다:

```trb title="mixed_math.trb"
# Integer + Float = Float
def add_numbers(a: Integer, b: Float): Float
  a + b
end

sum: Float = add_numbers(5, 2.5)
# 7.5 반환
```

## Bool

`Bool` 타입은 부울 값: `true` 또는 `false`를 나타냅니다. T-Ruby는 `Boolean`이 아닌 `Bool`을 타입 이름으로 사용합니다.

### 기본 Boolean 사용

```trb title="booleans.trb"
# Boolean 변수
is_active: Bool = true
has_permission: Bool = false

# 비교에서의 Boolean
is_adult: Bool = age >= 18
is_valid: Bool = count > 0
```

### Boolean 논리

```trb title="boolean_logic.trb"
def can_access(is_logged_in: Bool, has_permission: Bool): Bool
  is_logged_in && has_permission
end

access: Bool = can_access(true, true)
# true 반환

def should_notify(is_important: Bool, is_urgent: Bool): Bool
  is_important || is_urgent
end

notify: Bool = should_notify(false, true)
# true 반환

def toggle(flag: Bool): Bool
  !flag
end

flipped: Bool = toggle(true)
# false 반환
```

### 조건문에서의 Booleans

```trb title="boolean_conditionals.trb"
def get_status(is_complete: Bool): String
  if is_complete
    "완료"
  else
    "대기중"
  end
end

status: String = get_status(true)
# "완료" 반환

def check_eligibility(age: Integer, has_license: Bool): String
  can_drive: Bool = age >= 16 && has_license

  if can_drive
    "운전 가능"
  else
    "운전 불가"
  end
end
```

### Truthiness vs Bool

Ruby에서 많은 값이 "truthy" 또는 "falsy"이지만, `Bool` 타입은 `true` 또는 `false`만 받습니다:

```trb title="bool_strict.trb"
# 이것은 올바름
flag: Bool = true

# 이것들은 오류가 됨:
# flag: Bool = 1        # 오류: Integer는 Bool이 아님
# flag: Bool = "yes"    # 오류: String은 Bool이 아님
# flag: Bool = nil      # 오류: nil은 Bool이 아님

# truthy 값을 Bool로 변환하려면:
def to_bool(value: String | nil): Bool
  !value.nil? && !value.empty?
end
```

## Symbol

`Symbol` 타입은 불변 식별자를 나타냅니다. 심볼은 종종 해시의 키나 상수로 사용됩니다.

### 기본 Symbol 사용

```trb title="symbols.trb"
# Symbol 변수
status: Symbol = :active
direction: Symbol = :north

# 심볼은 해시에서 자주 사용됨
def create_options(mode: Symbol): Hash<Symbol, String>
  {
    mode: mode.to_s,
    version: "1.0"
  }
end

options = create_options(:production)
```

### Symbols vs Strings

심볼은 문자열과 비슷하지만 불변이고 식별자로 사용하도록 최적화되어 있습니다:

```trb title="symbol_vs_string.trb"
# 같은 심볼은 항상 메모리에서 같은 객체
def are_same_symbol(a: Symbol, b: Symbol): Bool
  a.object_id == b.object_id
end

same: Bool = are_same_symbol(:active, :active)
# true 반환

# Symbol과 String 간 변환
def symbol_to_string(sym: Symbol): String
  sym.to_s
end

def string_to_symbol(str: String): Symbol
  str.to_sym
end

text: String = symbol_to_string(:hello)
# "hello" 반환

symbol: Symbol = string_to_symbol("world")
# :world 반환
```

## nil

`nil` 타입은 값의 부재를 나타냅니다. T-Ruby에서 `nil`은 자체 타입입니다.

### 기본 nil 사용

```trb title="nil_basics.trb"
# nil 변수 (그 자체로는 그다지 유용하지 않음)
nothing: nil = nil

# nil은 union 타입과 더 일반적으로 사용됨
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

user = find_user(-1)
# nil 반환
```

### nil 검사

```trb title="nil_checks.trb"
def greet(name: String | nil): String
  if name.nil?
    "안녕하세요, 낯선 분!"
  else
    "안녕하세요, #{name}님!"
  end
end

message1: String = greet("Alice")
# "안녕하세요, Alice님!" 반환

message2: String = greet(nil)
# "안녕하세요, 낯선 분!" 반환
```

### 안전 내비게이션 연산자

Ruby의 안전 내비게이션 연산자(`&.`)는 nil과 함께 작동합니다:

```trb title="safe_navigation.trb"
def get_name_length(name: String | nil): Integer | nil
  name&.length
end

len1 = get_name_length("Alice")
# 5 반환

len2 = get_name_length(nil)
# nil 반환
```

### nil과 기본값

```trb title="nil_defaults.trb"
def get_greeting(custom: String | nil): String
  custom || "안녕하세요!"
end

greeting1: String = get_greeting("환영합니다!")
# "환영합니다!" 반환

greeting2: String = get_greeting(nil)
# "안녕하세요!" 반환
```

## 타입 변환

종종 기본 타입 간 변환이 필요합니다:

### String으로 변환

```trb title="to_string.trb"
def describe_number(num: Integer): String
  num.to_s
end

def describe_float(num: Float): String
  num.to_s
end

def describe_bool(flag: Bool): String
  flag.to_s
end

text1: String = describe_number(42)
# "42" 반환

text2: String = describe_float(3.14)
# "3.14" 반환

text3: String = describe_bool(true)
# "true" 반환
```

### Integer로 변환

```trb title="to_integer.trb"
def parse_integer(text: String): Integer
  text.to_i
end

num1: Integer = parse_integer("42")
# 42 반환

num2: Integer = parse_integer("숫자 아님")
# 0 반환 (Ruby의 기본 동작)

def float_to_int(f: Float): Integer
  f.to_i
end

truncated: Integer = float_to_int(3.7)
# 3 반환 (반올림 아니고 자름)
```

## 실용적 예제: 온도 변환기

여러 기본 타입을 사용하는 완전한 예제입니다:

```trb title="temperature.trb"
def celsius_to_fahrenheit(celsius: Float): Float
  (celsius * 9.0 / 5.0) + 32.0
end

def fahrenheit_to_celsius(fahrenheit: Float): Float
  (fahrenheit - 32.0) * 5.0 / 9.0
end

def format_temperature(temp: Float, unit: Symbol): String
  rounded: Float = temp.round(1)
  unit_str: String = unit.to_s.upcase

  "#{rounded}°#{unit_str}"
end

def convert_temperature(temp: Float, from: Symbol, to: Symbol): String
  converted: Float

  if from == :c && to == :f
    converted = celsius_to_fahrenheit(temp)
  elsif from == :f && to == :c
    converted = fahrenheit_to_celsius(temp)
  else
    converted = temp
  end

  format_temperature(converted, to)
end

result: String = convert_temperature(100.0, :c, :f)
# "212.0°F" 반환
```

## 요약

T-Ruby의 기본 타입은 Ruby의 기본 타입을 반영합니다:

- **String**: 텍스트 데이터 (`"hello"`)
- **Integer**: 정수 (`42`)
- **Float**: 소수점 숫자 (`3.14`)
- **Bool**: 부울 값 (`true`, `false`)
- **Symbol**: 불변 식별자 (`:active`)
- **nil**: 값의 부재 (`nil`)

각 타입에는 특정 메서드와 동작이 있습니다. 타입 변환은 `to_s`, `to_i`, `to_f`와 같은 메서드를 사용하여 명시적으로 수행됩니다. 이러한 기본 타입을 이해하는 것은 효과적인 T-Ruby 코드 작성의 기본입니다.

다음 장에서는 T-Ruby가 어떻게 자동으로 타입을 추론하여 명시적 어노테이션의 필요성을 줄이는지 배웁니다.
