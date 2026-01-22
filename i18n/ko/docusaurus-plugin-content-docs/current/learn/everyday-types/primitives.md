---
sidebar_position: 1
title: 원시 타입
description: T-Ruby의 원시 타입
---

<DocsBadge />


# 원시 타입

원시 타입은 T-Ruby 타입 시스템의 기본 구성 요소입니다. 더 복잡한 타입의 기초가 되는 단순하고 분할할 수 없는 값을 나타냅니다. 이 장에서는 원시 타입의 동작, 엣지 케이스, 그리고 모범 사례를 깊이 있게 살펴봅니다.

## 원시 타입이란?

T-Ruby의 원시 타입은 다음과 같습니다:

- `String` - 텍스트 및 문자 데이터
- `Integer` - 정수
- `Float` - 부동소수점 숫자
- `Boolean` - 부울 값 (true/false)
- `Symbol` - 불변 식별자
- `nil` - null 값

이러한 타입이 "원시"라고 불리는 이유는 더 단순한 타입으로 분해될 수 없기 때문입니다. 타입 시스템의 원자입니다.

## String 원시 타입 다루기

문자열은 Ruby에서 불변의 문자 시퀀스입니다. T-Ruby의 String 타입은 텍스트 작업에 대한 완전한 타입 안전성을 제공합니다.

### String 생성과 조작

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={25} />

```trb title="string_basics.trb"
# 문자열을 만드는 다양한 방법
single_quoted: String = 'Hello'
double_quoted: String = "World"
interpolated: String = "Hello, #{single_quoted}!"

# 여러 줄 문자열
heredoc: String = <<~TEXT
  이것은
  여러 줄 문자열입니다
TEXT
```

### 타입 안전성을 갖춘 String 메서드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={36} />

```trb title="string_methods.trb"
def process_text(input: String): String
  # 이 모든 작업은 String 타입을 유지합니다
  trimmed = input.strip
  lowercase = trimmed.downcase
  capitalized = lowercase.capitalize

  capitalized
end

result: String = process_text("  HELLO  ")
# "Hello" 반환

# 메서드 체이닝
def format_username(username: String): String
  username.strip.downcase.gsub(/[^a-z0-9]/, "_")
end

formatted: String = format_username("  John Doe! ")
# "john_doe_" 반환
```

### String 비교

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={47} />

```trb title="string_compare.trb"
def are_equal(a: String, b: String): Boolean
  a == b
end

def starts_with_hello(text: String): Boolean
  text.start_with?("Hello")
end

def contains_word(text: String, word: String): Boolean
  text.include?(word)
end

check1: Boolean = are_equal("hello", "hello")  # true
check2: Boolean = starts_with_hello("Hello, world!")  # true
check3: Boolean = contains_word("Ruby is great", "great")  # true
```

### String 길이와 인덱싱

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={58} />

```trb title="string_indexing.trb"
def get_first_char(text: String): String
  text[0]
end

def get_substring(text: String, start: Integer, length: Integer): String
  text[start, length]
end

def string_length(text: String): Integer
  text.length
end

first: String = get_first_char("Hello")  # "H"
sub: String = get_substring("Hello World", 6, 5)  # "World"
len: Integer = string_length("Hello")  # 5
```

### String 빌딩

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={69} />

```trb title="string_building.trb"
def build_greeting(name: String, title: String): String
  parts: String[] = ["Hello", title, name]
  parts.join(" ")
end

greeting: String = build_greeting("Smith", "Dr.")
# "Hello Dr. Smith" 반환

def repeat_text(text: String, times: Integer): String
  text * times
end

repeated: String = repeat_text("Ha", 3)
# "HaHaHa" 반환
```

## Integer 원시 타입 다루기

Integer는 소수점 없는 정수를 나타냅니다.

### Integer 산술

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={80} />

```trb title="integer_ops.trb"
def add(a: Integer, b: Integer): Integer
  a + b
end

def multiply(a: Integer, b: Integer): Integer
  a * b
end

def modulo(a: Integer, b: Integer): Integer
  a % b
end

def power(base: Integer, exponent: Integer): Integer
  base ** exponent
end

sum: Integer = add(10, 5)  # 15
product: Integer = multiply(10, 5)  # 50
remainder: Integer = modulo(10, 3)  # 1
result: Integer = power(2, 8)  # 256
```

### Integer 나눗셈 동작

Integer 산술의 중요한 측면은 나눗셈 동작입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={91} />

```trb title="integer_division.trb"
def divide_truncate(a: Integer, b: Integer): Integer
  # 정수 나눗셈은 항상 0 방향으로 자릅니다
  a / b
end

def divide_with_remainder(a: Integer, b: Integer): Integer[]
  quotient = a / b
  remainder = a % b
  [quotient, remainder]
end

result1: Integer = divide_truncate(7, 2)  # 3 (3.5가 아님)
result2: Integer = divide_truncate(-7, 2)  # -3 (0 방향으로 자름)

parts: Integer[] = divide_with_remainder(17, 5)
# [3, 2] 반환 (17 = 5 * 3 + 2)
```

### Integer 비교

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={102} />

```trb title="integer_compare.trb"
def is_positive(n: Integer): Boolean
  n > 0
end

def is_even(n: Integer): Boolean
  n % 2 == 0
end

def is_in_range(n: Integer, min: Integer, max: Integer): Boolean
  n >= min && n <= max
end

def max(a: Integer, b: Integer): Integer
  if a > b
    a
  else
    b
  end
end

check1: Boolean = is_positive(5)  # true
check2: Boolean = is_even(7)  # false
check3: Boolean = is_in_range(5, 1, 10)  # true
maximum: Integer = max(10, 20)  # 20
```

### Integer 메서드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={113} />

```trb title="integer_methods.trb"
def absolute(n: Integer): Integer
  n.abs
end

def next_number(n: Integer): Integer
  n.next
end

def times_operation(n: Integer): Integer[]
  results: Integer[] = []
  n.times do |i|
    results << i
  end
  results
end

abs_value: Integer = absolute(-42)  # 42
next_val: Integer = next_number(5)  # 6
numbers: Integer[] = times_operation(5)  # [0, 1, 2, 3, 4]
```

## Float 원시 타입 다루기

Float는 부동소수점 산술을 사용하여 소수점 숫자를 나타냅니다.

### Float 산술

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={124} />

```trb title="float_ops.trb"
def divide_precise(a: Integer, b: Integer): Float
  # 정밀한 나눗셈을 위해 float로 변환
  a.to_f / b
end

def calculate_average(numbers: Integer[]): Float
  sum = numbers.reduce(0) { |acc, n| acc + n }
  sum.to_f / numbers.length
end

def apply_percentage(amount: Float, percent: Float): Float
  amount * (percent / 100.0)
end

precise: Float = divide_precise(7, 2)  # 3.5
avg: Float = calculate_average([10, 20, 30])  # 20.0
discount: Float = apply_percentage(100.0, 15.0)  # 15.0
```

### Float 정밀도와 반올림

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={135} />

```trb title="float_precision.trb"
def round_to_places(value: Float, places: Integer): Float
  multiplier = 10 ** places
  (value * multiplier).round / multiplier.to_f
end

def round_to_nearest(value: Float): Integer
  value.round
end

def floor_value(value: Float): Integer
  value.floor
end

def ceil_value(value: Float): Integer
  value.ceil
end

rounded: Float = round_to_places(3.14159, 2)  # 3.14
nearest: Integer = round_to_nearest(3.7)  # 4
floored: Integer = floor_value(3.7)  # 3
ceiled: Integer = ceil_value(3.2)  # 4
```

### Float 비교의 주의점

부동소수점 비교는 정밀도 문제로 인해 주의가 필요합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={146} />

```trb title="float_compare.trb"
def approximately_equal(a: Float, b: Float, epsilon: Float = 0.0001): Boolean
  (a - b).abs < epsilon
end

def is_close_to_zero(value: Float): Boolean
  value.abs < 0.0001
end

# 직접 비교는 문제가 될 수 있음
result1 = 0.1 + 0.2  # 부동소수점 정밀도로 인해 정확히 0.3이 아닐 수 있음

# 근사 비교 사용
check: Boolean = approximately_equal(0.1 + 0.2, 0.3)  # true

# 0 확인
is_zero: Boolean = is_close_to_zero(0.0000001)  # true
```

### Float 특수 값

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={157} />

```trb title="float_special.trb"
def is_infinite(value: Float): Boolean
  value.infinite? != nil
end

def is_nan(value: Float): Boolean
  value.nan?
end

def safe_divide(a: Float, b: Float): Float | nil
  return nil if b == 0.0
  a / b
end

# 특수 float 값이 존재함
positive_infinity: Float = 1.0 / 0.0  # Infinity
negative_infinity: Float = -1.0 / 0.0  # -Infinity
not_a_number: Float = 0.0 / 0.0  # NaN

check1: Boolean = is_infinite(positive_infinity)  # true
check2: Boolean = is_nan(not_a_number)  # true
```

## Boolean 원시 타입 다루기

Boolean 타입은 엄격한 타입 검사를 갖춘 true/false 값을 나타냅니다.

### Boolean 연산

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={168} />

```trb title="bool_ops.trb"
def and_operation(a: Boolean, b: Boolean): Boolean
  a && b
end

def or_operation(a: Boolean, b: Boolean): Boolean
  a || b
end

def not_operation(a: Boolean): Boolean
  !a
end

def xor_operation(a: Boolean, b: Boolean): Boolean
  (a || b) && !(a && b)
end

result1: Boolean = and_operation(true, false)  # false
result2: Boolean = or_operation(true, false)  # true
result3: Boolean = not_operation(true)  # false
result4: Boolean = xor_operation(true, false)  # true
```

### 비교에서의 Boolean

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={179} />

```trb title="bool_from_compare.trb"
def is_valid_age(age: Integer): Boolean
  age >= 0 && age <= 150
end

def is_valid_email(email: String): Boolean
  email.include?("@") && email.include?(".")
end

def all_positive(numbers: Integer[]): Boolean
  numbers.all? { |n| n > 0 }
end

def any_even(numbers: Integer[]): Boolean
  numbers.any? { |n| n % 2 == 0 }
end

valid1: Boolean = is_valid_age(25)  # true
valid2: Boolean = is_valid_email("user@example.com")  # true
check1: Boolean = all_positive([1, 2, 3])  # true
check2: Boolean = any_even([1, 3, 5, 6])  # true
```

### Boolean vs Truthy 값

T-Ruby의 Boolean 타입은 엄격합니다 - `true`와 `false`만 유효합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={190} />

```trb title="bool_strict.trb"
# 이것은 Boolean 값입니다
flag1: Boolean = true
flag2: Boolean = false

# 이것은 타입 오류가 됩니다:
# flag3: Boolean = 1  # 오류!
# flag4: Boolean = "yes"  # 오류!
# flag5: Boolean = nil  # 오류!

# truthy 값을 Boolean로 변환
def to_bool(value: String | nil): Boolean
  !value.nil? && value != ""
end

def is_present(value: String | nil): Boolean
  value != nil && value.length > 0
end

converted1: Boolean = to_bool("hello")  # true
converted2: Boolean = to_bool(nil)  # false
present: Boolean = is_present("")  # false
```

## Symbol 원시 타입 다루기

Symbol은 종종 상수나 키로 사용되는 불변의 고유 식별자입니다.

### Symbol 사용법

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={201} />

```trb title="symbol_usage.trb"
# 상수로서의 심볼
STATUS_ACTIVE: Symbol = :active
STATUS_PENDING: Symbol = :pending
STATUS_CANCELLED: Symbol = :cancelled

def get_status_message(status: Symbol): String
  case status
  when :active
    "현재 활성 상태"
  when :pending
    "승인 대기 중"
  when :cancelled
    "취소됨"
  else
    "알 수 없는 상태"
  end
end

message: String = get_status_message(:active)
# "현재 활성 상태" 반환
```

### Symbol vs String 성능

심볼은 반복 사용 시 문자열보다 메모리 효율적입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={212} />

```trb title="symbol_performance.trb"
def categorize_with_symbols(items: Integer[]): Hash<Symbol, Integer[]>
  categories: Hash<Symbol, Integer[]> = {
    small: [],
    medium: [],
    large: []
  }

  items.each do |item|
    if item < 10
      categories[:small] << item
    elsif item < 100
      categories[:medium] << item
    else
      categories[:large] << item
    end
  end

  categories
end

result = categorize_with_symbols([5, 50, 500])
# { small: [5], medium: [50], large: [500] } 반환
```

### Symbol과 String 간 변환

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={223} />

```trb title="symbol_conversion.trb"
def symbol_to_string(sym: Symbol): String
  sym.to_s
end

def string_to_symbol(str: String): Symbol
  str.to_sym
end

def normalize_key(key: Symbol | String): Symbol
  if key.is_a?(Symbol)
    key
  else
    key.to_sym
  end
end

text: String = symbol_to_string(:hello)  # "hello"
symbol: Symbol = string_to_symbol("world")  # :world
normalized: Symbol = normalize_key("status")  # :status
```

## nil 원시 타입 다루기

`nil` 타입은 값의 부재를 나타냅니다.

### nil 검사

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={234} />

```trb title="nil_checks.trb"
def is_nil(value: String | nil): Boolean
  value.nil?
end

def has_value(value: String | nil): Boolean
  !value.nil?
end

def get_or_default(value: String | nil, default: String): String
  if value.nil?
    default
  else
    value
  end
end

check1: Boolean = is_nil(nil)  # true
check2: Boolean = has_value("hello")  # true
result: String = get_or_default(nil, "default")  # "default"
```

### 안전 내비게이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={245} />

```trb title="safe_navigation.trb"
def get_length_safe(text: String | nil): Integer | nil
  text&.length
end

def get_first_char_safe(text: String | nil): String | nil
  text&.[](0)
end

len1 = get_length_safe("hello")  # 5
len2 = get_length_safe(nil)  # nil

char1 = get_first_char_safe("hello")  # "h"
char2 = get_first_char_safe(nil)  # nil
```

## 원시 타입 간 타입 변환

원시 타입 간 변환은 T-Ruby에서 명시적입니다:

### String으로 변환

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={256} />

```trb title="to_string_conversions.trb"
def int_to_string(n: Integer): String
  n.to_s
end

def float_to_string(f: Float): String
  f.to_s
end

def bool_to_string(b: Boolean): String
  b.to_s
end

def symbol_to_string(s: Symbol): String
  s.to_s
end

str1: String = int_to_string(42)  # "42"
str2: String = float_to_string(3.14)  # "3.14"
str3: String = bool_to_string(true)  # "true"
str4: String = symbol_to_string(:active)  # "active"
```

### 숫자로 변환

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={267} />

```trb title="to_number_conversions.trb"
def string_to_int(s: String): Integer
  s.to_i
end

def string_to_float(s: String): Float
  s.to_f
end

def float_to_int(f: Float): Integer
  f.to_i  # 소수점 자름
end

def int_to_float(i: Integer): Float
  i.to_f
end

num1: Integer = string_to_int("42")  # 42
num2: Float = string_to_float("3.14")  # 3.14
num3: Integer = float_to_int(3.7)  # 3
num4: Float = int_to_float(42)  # 42.0
```

## 실용적 예제: 계산기

모든 원시 타입을 사용하는 종합적인 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/primitives_spec.rb" line={278} />

```trb title="calculator.trb"
class Calculator
  def initialize()
    @history: String[] = []
    @memory: Float = 0.0
  end

  def add(a: Float, b: Float): Float
    result = a + b
    log_operation(:add, a, b, result)
    result
  end

  def subtract(a: Float, b: Float): Float
    result = a - b
    log_operation(:subtract, a, b, result)
    result
  end

  def multiply(a: Float, b: Float): Float
    result = a * b
    log_operation(:multiply, a, b, result)
    result
  end

  def divide(a: Float, b: Float): Float | nil
    if b == 0.0
      puts "오류: 0으로 나눌 수 없음"
      return nil
    end

    result = a / b
    log_operation(:divide, a, b, result)
    result
  end

  def store_in_memory(value: Float)
    @memory = value
  end

  def recall_memory(): Float
    @memory
  end

  def clear_memory()
    @memory = 0.0
  end

  def get_history(): String[]
    @history
  end

  private

  def log_operation(op: Symbol, a: Float, b: Float, result: Float)
    op_str: String = op.to_s
    entry: String = "#{a} #{op_str} #{b} = #{result}"
    @history << entry
  end
end

# 사용법
calc = Calculator.new()

result1: Float = calc.add(10.5, 5.3)  # 15.8
result2: Float = calc.multiply(4.0, 2.5)  # 10.0

calc.store_in_memory(result1)
recalled: Float = calc.recall_memory()  # 15.8

history: String[] = calc.get_history()
# ["10.5 add 5.3 = 15.8", "4.0 multiply 2.5 = 10.0"] 반환
```

## 요약

원시 타입은 T-Ruby 타입 시스템의 기반입니다:

- **String**: 풍부한 조작 메서드를 가진 불변 텍스트
- **Integer**: 자르기 나눗셈을 가진 정수
- **Float**: 정밀도에 주의가 필요한 소수점 숫자
- **Boolean**: 엄격한 true/false 값 (truthy/falsy가 아님)
- **Symbol**: 상수와 키를 위한 불변 식별자
- **nil**: 값의 부재를 나타냄

원시 타입을 깊이 이해하면 더 복잡한 타입과 효과적으로 작업할 수 있습니다. 타입 변환은 명시적이며, 비교에는 중요한 엣지 케이스가 있고, 각 원시 타입에는 이해해야 할 특정 동작이 있습니다.

다음 장에서는 이러한 원시 타입을 기반으로 하는 배열과 해시 같은 복합 타입에 대해 배웁니다.
