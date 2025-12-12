---
sidebar_position: 3
title: Union 타입
description: union으로 여러 타입 결합하기
---

<DocsBadge />


# Union 타입

Union 타입을 사용하면 값이 여러 다른 타입 중 하나가 될 수 있습니다. 정당하게 여러 형태를 가질 수 있는 데이터를 모델링하는 데 필수적입니다. 이 장에서는 T-Ruby에서 union 타입을 효과적으로 사용하는 방법을 배웁니다.

## Union 타입이란?

Union 타입은 지정된 여러 타입 중 하나가 될 수 있는 값을 나타냅니다. T-Ruby에서는 파이프(`|`) 연산자를 사용하여 union 타입을 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="union_basics.trb"
# 이 변수는 String 또는 nil이 될 수 있음
name: String | nil = "Alice"

# 이것은 String 또는 Integer가 될 수 있음
id: String | Integer = "user-123"

# 이것은 세 가지 타입 중 하나가 될 수 있음
value: String | Integer | Bool = true
```

## Union 타입을 사용하는 이유

Union 타입은 여러 시나리오에서 유용합니다:

### 1. 선택적 값

가장 일반적인 용도는 타입과 `nil`을 결합하여 선택적 값을 나타내는 것입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="optional_values.trb"
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# 결과가 nil일 수 있음
user: String | nil = find_user(1)  # "User 1"
no_user: String | nil = find_user(-1)  # nil
```

### 2. 여러 유효한 입력 타입

함수가 다른 타입의 입력을 받을 수 있을 때:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="multiple_inputs.trb"
def format_id(id: String | Integer): String
  if id.is_a?(Integer)
    "ID-#{id}"
  else
    id.upcase
  end
end

formatted1: String = format_id(123)  # "ID-123"
formatted2: String = format_id("abc")  # "ABC"
```

### 3. 다른 반환 타입

함수가 조건에 따라 다른 타입을 반환할 수 있을 때:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="different_returns.trb"
def parse_value(input: String): String | Integer | Bool
  if input == "true" || input == "false"
    input == "true"
  elsif input.to_i.to_s == input
    input.to_i
  else
    input
  end
end

result1 = parse_value("42")  # 42 (Integer)
result2 = parse_value("true")  # true (Bool)
result3 = parse_value("hello")  # "hello" (String)
```

## Union 타입 다루기

### `is_a?`로 타입 검사

union 타입을 가진 값을 안전하게 사용하려면 실제 타입을 확인해야 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="type_checking.trb"
def process_value(value: String | Integer): String
  if value.is_a?(String)
    # 이 블록 안에서 T-Ruby는 value가 String임을 알고 있음
    value.upcase
  else
    # 여기서 T-Ruby는 value가 Integer여야 함을 알고 있음
    value.to_s
  end
end

result1: String = process_value("hello")  # "HELLO"
result2: String = process_value(42)  # "42"
```

### nil 검사

선택적 값을 다룰 때 항상 `nil`을 검사하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="nil_checking.trb"
def get_length(text: String | nil): Integer
  if text.nil?
    0
  else
    # 여기서 T-Ruby는 text가 String임을 알고 있음 (nil이 아님)
    text.length
  end
end

len1: Integer = get_length("hello")  # 5
len2: Integer = get_length(nil)  # 0

# 안전 내비게이션 연산자를 사용한 대안
def get_length_safe(text: String | nil): Integer | nil
  text&.length
end
```

### 다중 타입 검사

union에 두 개 이상의 타입이 있을 때:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="multiple_checks.trb"
def describe_value(value: String | Integer | Bool): String
  if value.is_a?(String)
    "텍스트: #{value}"
  elsif value.is_a?(Integer)
    "숫자: #{value}"
  elsif value.is_a?(Bool)
    "부울: #{value}"
  else
    "알 수 없음"
  end
end

desc1: String = describe_value("hello")  # "텍스트: hello"
desc2: String = describe_value(42)  # "숫자: 42"
desc3: String = describe_value(true)  # "부울: true"
```

## 컬렉션에서의 Union 타입

Union 타입은 배열과 해시와 함께 일반적으로 사용됩니다:

### Union 요소 타입을 가진 배열

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="union_arrays.trb"
# 문자열 또는 정수를 포함할 수 있는 배열
def create_mixed_list(): Array<String | Integer>
  ["Alice", 1, "Bob", 2, "Charlie", 3]
end

def sum_numbers(items: Array<String | Integer>): Integer
  total = 0

  items.each do |item|
    if item.is_a?(Integer)
      total += item
    end
  end

  total
end

def get_strings(items: Array<String | Integer>): Array<String>
  result: Array<String> = []

  items.each do |item|
    if item.is_a?(String)
      result << item
    end
  end

  result
end

mixed: Array<String | Integer> = create_mixed_list()
sum: Integer = sum_numbers(mixed)  # 6
strings: Array<String> = get_strings(mixed)  # ["Alice", "Bob", "Charlie"]
```

### Union 값 타입을 가진 해시

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="union_hashes.trb"
# 다른 값 타입을 가진 해시
def create_config(): Hash<Symbol, String | Integer | Bool>
  {
    host: "localhost",
    port: 3000,
    debug: true,
    timeout: 30,
    environment: "development"
  }
end

def get_string_value(
  config: Hash<Symbol, String | Integer | Bool>,
  key: Symbol
): String | nil
  value = config[key]

  if value.is_a?(String)
    value
  else
    nil
  end
end

def get_integer_value(
  config: Hash<Symbol, String | Integer | Bool>,
  key: Symbol
): Integer | nil
  value = config[key]

  if value.is_a?(Integer)
    value
  else
    nil
  end
end

config = create_config()
host: String | nil = get_string_value(config, :host)  # "localhost"
port: Integer | nil = get_integer_value(config, :port)  # 3000
```

## 일반적인 Union 타입 패턴

### 패턴 1: 성공 또는 오류

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="result_pattern.trb"
def divide_safe(a: Float, b: Float): Float | String
  if b == 0.0
    "오류: 0으로 나눌 수 없음"
  else
    a / b
  end
end

def process_result(result: Float | String): String
  if result.is_a?(Float)
    "결과: #{result}"
  else
    # 오류 메시지임
    result
  end
end

result1 = divide_safe(10.0, 2.0)  # 5.0
result2 = divide_safe(10.0, 0.0)  # "오류: 0으로 나눌 수 없음"

message1: String = process_result(result1)  # "결과: 5.0"
message2: String = process_result(result2)  # "오류: 0으로 나눌 수 없음"
```

### 패턴 2: 기본값

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="default_pattern.trb"
def get_value_or_default(
  value: String | nil,
  default: String
): String
  if value.nil?
    default
  else
    value
  end
end

# 간단한 경우 || 사용
def get_or_default_short(value: String | nil, default: String): String
  value || default
end

result1: String = get_value_or_default("hello", "default")  # "hello"
result2: String = get_value_or_default(nil, "default")  # "default"
```

### 패턴 3: 타입 강제 변환

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="coercion_pattern.trb"
def to_integer(value: String | Integer): Integer
  if value.is_a?(Integer)
    value
  else
    value.to_i
  end
end

def to_string(value: String | Integer | Bool): String
  if value.is_a?(String)
    value
  else
    value.to_s
  end
end

num1: Integer = to_integer(42)  # 42
num2: Integer = to_integer("42")  # 42

str1: String = to_string("hello")  # "hello"
str2: String = to_string(42)  # "42"
str3: String = to_string(true)  # "true"
```

### 패턴 4: 다형성 함수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="polymorphic_pattern.trb"
def repeat(value: String | Integer, times: Integer): String
  if value.is_a?(String)
    value * times
  else
    # 숫자 표현 반복
    (value.to_s + " ") * times
  end
end

result1: String = repeat("Ha", 3)  # "HaHaHa"
result2: String = repeat(42, 3)  # "42 42 42 "
```

## 중첩 Union 타입

Union 타입은 복잡한 방식으로 결합될 수 있습니다:

### Union 안의 Union

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="nested_unions.trb"
# 숫자(Integer 또는 Float) 또는 텍스트(String 또는 Symbol)가 될 수 있는 값
def process_input(value: Integer | Float | String | Symbol): String
  if value.is_a?(Integer) || value.is_a?(Float)
    "숫자: #{value}"
  elsif value.is_a?(String)
    "문자열: #{value}"
  else
    "심볼: #{value}"
  end
end

result1: String = process_input(42)  # "숫자: 42"
result2: String = process_input(3.14)  # "숫자: 3.14"
result3: String = process_input("hello")  # "문자열: hello"
result4: String = process_input(:active)  # "심볼: active"
```

### 복잡한 타입과의 Union

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="complex_unions.trb"
# 단일 값이거나 값의 배열일 수 있음
def normalize_input(
  value: String | Array<String>
): Array<String>
  if value.is_a?(Array)
    value
  else
    [value]
  end
end

result1: Array<String> = normalize_input("hello")  # ["hello"]
result2: Array<String> = normalize_input(["a", "b"])  # ["a", "b"]

# 단일 정수 또는 범위일 수 있음
def expand_range(value: Integer | Range): Array<Integer>
  if value.is_a?(Range)
    value.to_a
  else
    [value]
  end
end

nums1: Array<Integer> = expand_range(5)  # [5]
nums2: Array<Integer> = expand_range(1..5)  # [1, 2, 3, 4, 5]
```

## 실용적 예제: 설정 시스템

union 타입을 사용하는 종합적인 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="config_system.trb"
class ConfigManager
  def initialize()
    @config: Hash<String, String | Integer | Bool | nil> = {}
  end

  def set(key: String, value: String | Integer | Bool | nil)
    @config[key] = value
  end

  def get_string(key: String): String | nil
    value = @config[key]

    if value.is_a?(String)
      value
    else
      nil
    end
  end

  def get_integer(key: String): Integer | nil
    value = @config[key]

    if value.is_a?(Integer)
      value
    else
      nil
    end
  end

  def get_bool(key: String): Bool | nil
    value = @config[key]

    if value.is_a?(Bool)
      value
    else
      nil
    end
  end

  def get_string_or_default(key: String, default: String): String
    value = get_string(key)
    value || default
  end

  def get_integer_or_default(key: String, default: Integer): Integer
    value = get_integer(key)
    value || default
  end

  def get_bool_or_default(key: String, default: Bool): Bool
    value = get_bool(key)
    if value.nil?
      default
    else
      value
    end
  end

  def to_hash(): Hash<String, String | Integer | Bool | nil>
    @config.dup
  end

  def parse_and_set(key: String, raw_value: String)
    # boolean으로 파싱 시도
    if raw_value == "true"
      set(key, true)
      return
    elsif raw_value == "false"
      set(key, false)
      return
    end

    # 정수로 파싱 시도
    int_value = raw_value.to_i
    if int_value.to_s == raw_value
      set(key, int_value)
      return
    end

    # 그렇지 않으면 문자열로 저장
    set(key, raw_value)
  end
end

# 사용법
config = ConfigManager.new()

config.set("host", "localhost")
config.set("port", 3000)
config.set("debug", true)
config.set("optional_feature", nil)

host: String = config.get_string_or_default("host", "0.0.0.0")
# "localhost"

port: Integer = config.get_integer_or_default("port", 8080)
# 3000

debug: Bool = config.get_bool_or_default("debug", false)
# true

timeout: Integer = config.get_integer_or_default("timeout", 30)
# 30 (키가 존재하지 않으므로 기본값 사용)

# 문자열에서 파싱
config.parse_and_set("max_connections", "100")  # Integer로 저장
config.parse_and_set("enable_ssl", "true")  # Bool로 저장
config.parse_and_set("environment", "production")  # String으로 저장
```

## 모범 사례

### 1. Union을 단순하게 유지

너무 많은 타입을 가진 union을 피하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="simple_unions.trb"
# 좋음 - 명확하고 단순함
def process(value: String | Integer): String
  # ...
end

# 피해야 함 - 처리할 타입이 너무 많음
def process_complex(
  value: String | Integer | Float | Bool | Symbol | nil
): String
  # 너무 많은 분기가 필요함
end
```

### 2. 선택적 값에 nil Union 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="optional_best_practice.trb"
# 좋음 - 명확하게 선택적
def find_item(id: Integer): String | nil
  # ...
end

# 피해야 함 - 빈 문자열로 "찾지 못함"을 의미
def find_item_bad(id: Integer): String
  # 찾지 못하면 "" 반환 - 불명확함!
end
```

### 3. 일관된 순서로 타입 검사

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="consistent_checks.trb"
# 좋음 - 일관된 패턴
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

# 좋음 - 같은 패턴
def format(value: String | Integer): String
  if value.is_a?(String)
    "텍스트: #{value}"
  else
    "숫자: #{value}"
  end
end
```

### 4. Union 타입 의미 문서화

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="documentation.trb"
# 좋음 - 각 타입이 의미하는 바가 명확함
def get_status(id: Integer): String | Symbol | nil
  # 반환값:
  # - String: 오류 메시지
  # - Symbol: 상태 코드 (:active, :pending 등)
  # - nil: 항목을 찾지 못함

  return nil if id < 0
  return :active if id == 1
  "오류: 잘못된 상태"
end
```

## 일반적인 함정

### 타입 검사 잊음

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="missing_checks.trb"
# 잘못됨 - 타입을 검사하지 않음
def bad_example(value: String | Integer): Integer
  value.length  # 오류! Integer에는 length가 없음
end

# 올바름 - 먼저 타입 검사
def good_example(value: String | Integer): Integer
  if value.is_a?(String)
    value.length
  else
    value
  end
end
```

### 변경 후 타입 가정

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/union_types_spec.rb" line={21} />

```trb title="type_mutation.trb"
def risky_example(value: String | Integer)
  if value.is_a?(String)
    value = value.to_i  # 이제 Integer임!
    # value는 이제 Integer, String이 아님
  end

  # 여기서 value가 여전히 String이라고 가정할 수 없음
end
```

## 요약

T-Ruby의 Union 타입은 값이 여러 타입 중 하나가 될 수 있게 합니다:

- **구문**: 파이프 연산자(`|`)를 사용하여 타입 결합
- **일반적 용도**: `| nil`로 값을 선택적으로 만들기
- **타입 검사**: `is_a?`를 사용하여 실제 타입 결정
- **컬렉션**: Array와 Hash 타입과 함께 사용 가능
- **모범 사례**: union을 단순하게 유지하고 일관되게 타입 검사

Union 타입은 단일 타입에 맞지 않는 실제 데이터를 모델링하는 데 필수적입니다. 타입 좁히기(다음 장에서 다룸)와 결합하면 다양한 데이터를 처리하는 강력하고 안전한 방법을 제공합니다.
