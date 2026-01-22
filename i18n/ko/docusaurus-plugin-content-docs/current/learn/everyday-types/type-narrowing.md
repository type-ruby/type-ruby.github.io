---
sidebar_position: 4
title: 타입 좁히기
description: 제어 흐름 분석으로 타입 좁히기
---

<DocsBadge />


# 타입 좁히기

타입 좁히기는 T-Ruby가 제어 흐름 분석을 기반으로 변수의 타입을 자동으로 구체화하는 프로세스입니다. 변수의 타입이나 값을 검사할 때, T-Ruby는 해당 코드 경로 내에서 변수가 될 수 있는 타입을 좁힙니다. 이 장에서는 타입 좁히기가 어떻게 작동하는지, 그리고 타입 안전한 코드를 위해 이를 어떻게 활용하는지 배웁니다.

## 타입 좁히기란?

타입 좁히기는 T-Ruby가 코드를 분석하고 특정 범위 내에서 변수가 선언된 타입보다 더 구체적인 타입이어야 한다고 판단할 때 발생합니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={25} />

```trb title="narrowing_basics.trb"
def process(value: String | Integer): String
  if value.is_a?(String)
    # 이 블록 안에서 T-Ruby는 value가 String임을 알고 있음
    # String 전용 메서드를 사용할 수 있음
    value.upcase
  else
    # 여기서 T-Ruby는 value가 Integer여야 함을 알고 있음
    # Integer 전용 메서드를 사용할 수 있음
    value.to_s
  end
end
```

이 예제에서 `String | Integer` 타입은 첫 번째 분기에서 `String`으로만, else 분기에서 `Integer`로만 좁혀집니다.

## 타입 가드

타입 가드는 T-Ruby가 타입을 좁힐 수 있게 하는 표현식입니다. 가장 일반적인 타입 가드는 다음과 같습니다:

### `is_a?` 타입 가드

`is_a?` 메서드는 값이 특정 타입의 인스턴스인지 확인합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={36} />

```trb title="is_a_guard.trb"
def format_value(value: String | Integer | Boolean): String
  if value.is_a?(String)
    # 여기서 value는 String
    "텍스트: #{value}"
  elsif value.is_a?(Integer)
    # 여기서 value는 Integer
    "숫자: #{value}"
  elsif value.is_a?(Boolean)
    # 여기서 value는 Boolean
    "부울: #{value}"
  else
    "알 수 없음"
  end
end

result1: String = format_value("hello")  # "텍스트: hello"
result2: String = format_value(42)  # "숫자: 42"
result3: String = format_value(true)  # "부울: true"
```

### `nil?` 타입 가드

`nil?` 메서드는 선택적 타입을 좁힙니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={47} />

```trb title="nil_guard.trb"
def get_length(text: String | nil): Integer
  if text.nil?
    # 여기서 text는 nil
    0
  else
    # 여기서 text는 String (nil이 아님)
    text.length
  end
end

# 부정을 사용한 대안
def get_length_alt(text: String | nil): Integer
  if !text.nil?
    # 여기서 text는 String
    text.length
  else
    # 여기서 text는 nil
    0
  end
end

len1: Integer = get_length("hello")  # 5
len2: Integer = get_length(nil)  # 0
```

### `empty?` 타입 가드

`empty?` 메서드는 컬렉션의 타입을 좁힐 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={58} />

```trb title="empty_guard.trb"
def process_array(items: String[] | nil): String
  if items.nil? || items.empty?
    "항목 없음"
  else
    # 여기서 items는 비어있지 않은 String[]
    "첫 번째 항목: #{items.first}"
  end
end

result1: String = process_array(["a", "b"])  # "첫 번째 항목: a"
result2: String = process_array([])  # "항목 없음"
result3: String = process_array(nil)  # "항목 없음"
```

## 동등 비교로 좁히기

값을 특정 상수와 비교하면 타입이 좁혀집니다:

### nil과 비교

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={69} />

```trb title="nil_comparison.trb"
def greet(name: String | nil): String
  if name == nil
    # 여기서 name은 nil
    "안녕하세요, 낯선 분!"
  else
    # 여기서 name은 String
    "안녕하세요, #{name}님!"
  end
end

# 대안 구문
def greet_alt(name: String | nil): String
  if name != nil
    # 여기서 name은 String
    "안녕하세요, #{name}님!"
  else
    # 여기서 name은 nil
    "안녕하세요, 낯선 분!"
  end
end
```

### 특정 값과 비교

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={80} />

```trb title="value_comparison.trb"
def process_status(status: String): String
  if status == "active"
    # status는 여전히 String이지만 값을 알고 있음
    "상태는 활성입니다"
  elsif status == "pending"
    "상태는 대기 중입니다"
  else
    "알 수 없는 상태: #{status}"
  end
end
```

## 다양한 제어 흐름 구조에서의 좁히기

### If/Elsif/Else 문

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={91} />

```trb title="if_narrowing.trb"
def categorize(value: String | Integer | nil): String
  if value.nil?
    # value는 nil
    "비어있음"
  elsif value.is_a?(String)
    # value는 String (nil이 아님, Integer가 아님)
    "텍스트: #{value.length}자"
  else
    # value는 Integer (nil이 아님, String이 아님)
    "숫자: #{value}"
  end
end

cat1: String = categorize(nil)  # "비어있음"
cat2: String = categorize("hello")  # "텍스트: 5자"
cat3: String = categorize(42)  # "숫자: 42"
```

### Unless 문

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={102} />

```trb title="unless_narrowing.trb"
def process_unless(value: String | nil): String
  unless value.nil?
    # 여기서 value는 String
    value.upcase
  else
    # 여기서 value는 nil
    "값 없음"
  end
end

result1: String = process_unless("hello")  # "HELLO"
result2: String = process_unless(nil)  # "값 없음"
```

### Case/When 문

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={113} />

```trb title="case_narrowing.trb"
def describe(value: String | Integer | Symbol): String
  case value
  when String
    # 여기서 value는 String
    "길이가 #{value.length}인 문자열"
  when Integer
    # 여기서 value는 Integer
    "숫자: #{value}"
  when Symbol
    # 여기서 value는 Symbol
    "심볼: #{value}"
  else
    "알 수 없음"
  end
end

desc1: String = describe("hello")  # "길이가 5인 문자열"
desc2: String = describe(42)  # "숫자: 42"
desc3: String = describe(:active)  # "심볼: active"
```

### 삼항 연산자

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={124} />

```trb title="ternary_narrowing.trb"
def get_display_name(name: String | nil): String
  name.nil? ? "익명" : name.upcase
end

display1: String = get_display_name("alice")  # "ALICE"
display2: String = get_display_name(nil)  # "익명"
```

## 논리 연산자로 좁히기

### AND 연산자 (`&&`)

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={135} />

```trb title="and_narrowing.trb"
def process_and(
  value: String | nil,
  flag: Boolean
): String
  if !value.nil? && flag
    # 여기서 value는 String (nil이 아님)
    # flag는 true
    value.upcase
  else
    "건너뜀"
  end
end

def safe_access(items: String[] | nil, index: Integer): String | nil
  if !items.nil? && index < items.length
    # 여기서 items는 String[]
    items[index]
  else
    nil
  end
end
```

### OR 연산자 (`||`)

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={146} />

```trb title="or_narrowing.trb"
def process_or(value: String | nil): String
  if value.nil? || value.empty?
    "값 없음"
  else
    # 여기서 value는 비어있지 않은 String
    value.upcase
  end
end
```

## 조기 반환과 타입 좁히기

조기 반환은 함수의 나머지 부분에서 타입을 좁힙니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={157} />

```trb title="early_return.trb"
def process_with_guard(value: String | nil): String
  # 가드 절
  return "값 없음" if value.nil?

  # 이 지점 이후로 value는 String (nil이 아님)
  # else 블록이 필요 없음
  value.upcase
end

def validate_and_process(input: String | Integer): String
  # 다중 가드
  return "유효하지 않음" if input.nil?

  if input.is_a?(String)
    return "너무 짧음" if input.length < 3
    # input은 길이가 3 이상인 String
    return input.upcase
  end

  # 여기서 input은 Integer
  return "너무 작음" if input < 10
  # input은 10 이상인 Integer
  "유효한 숫자: #{input}"
end
```

## 메서드 호출로 좁히기

일부 메서드 호출은 타입 좁히기를 제공합니다:

### String 메서드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={168} />

```trb title="string_method_narrowing.trb"
def process_string(value: String | nil): String
  return "비어있음" if value.nil? || value.empty?

  # 여기서 value는 비어있지 않은 String
  first_char = value[0]
  "시작 문자: #{first_char}"
end
```

### Array 메서드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={179} />

```trb title="array_method_narrowing.trb"
def get_first_element(items: String[] | nil): String
  return "항목 없음" if items.nil? || items.empty?

  # 여기서 items는 비어있지 않은 String[]
  first: String = items.first
  first
end
```

## 블록과 람다에서의 좁히기

타입 좁히기는 블록 내에서도 작동합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={190} />

```trb title="block_narrowing.trb"
def process_items(items: (String | nil)[]): String[]
  result: String[] = []

  items.each do |item|
    # 여기서 item은 String | nil
    unless item.nil?
      # 여기서 item은 String
      result << item.upcase
    end
  end

  result
end

def filter_and_map(items: (String | Integer)[]): String[]
  items.map do |item|
    if item.is_a?(String)
      # 여기서 item은 String
      item.upcase
    else
      # 여기서 item은 Integer
      item.to_s
    end
  end
end
```

## 실용적 예제: 폼 검증기

타입 좁히기를 사용하는 종합적인 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={201} />

```trb title="form_validator.trb"
class FormValidator
  def validate_field(
    name: String,
    value: String | Integer | Boolean | nil,
    required: Boolean
  ): String | nil
    # 필수 필드가 누락되면 조기 반환
    if required && value.nil?
      return "#{name}은(는) 필수입니다"
    end

    # 필수가 아니고 nil이면 유효함
    return nil if value.nil?

    # 이제 value가 nil이 아님을 알고 있음
    # 타입 좁히기로 특정 타입을 검사할 수 있음

    if value.is_a?(String)
      # 여기서 value는 String
      return "#{name}은(는) 비어있을 수 없습니다" if value.empty?
      return "#{name}이(가) 너무 깁니다" if value.length > 100
    elsif value.is_a?(Integer)
      # 여기서 value는 Integer
      return "#{name}은(는) 양수여야 합니다" if value < 0
      return "#{name}이(가) 너무 큽니다" if value > 1000
    end
    # String이나 Integer가 아니면 여기서 value는 Boolean

    # 오류 없음
    nil
  end

  def validate_email(email: String | nil): String | nil
    return "이메일은 필수입니다" if email.nil?

    # 여기서 email은 String
    return "이메일은 비어있을 수 없습니다" if email.empty?
    return "이메일에 @가 포함되어야 합니다" unless email.include?("@")
    return "이메일에 도메인이 포함되어야 합니다" unless email.include?(".")

    # 모든 검사 통과
    nil
  end

  def validate_age(age: Integer | String | nil): String | nil
    return "나이는 필수입니다" if age.nil?

    # 문자열이면 정수로 변환
    age_int: Integer

    if age.is_a?(Integer)
      age_int = age
    else
      # 여기서 age는 String
      return "나이는 숫자여야 합니다" if age.to_i.to_s != age
      age_int = age.to_i
    end

    # 이제 age_int는 확실히 Integer
    return "나이는 양수여야 합니다" if age_int < 0
    return "나이는 현실적이어야 합니다" if age_int > 150

    nil
  end

  def validate_form(
    name: String | nil,
    email: String | nil,
    age: Integer | String | nil
  ): Hash<Symbol, String[]>
    errors: Hash<Symbol, String[]> = {}

    # 이름 검증
    name_error = validate_field("이름", name, true)
    if !name_error.nil?
      errors[:name] = [name_error]
    end

    # 이메일 검증
    email_error = validate_email(email)
    if !email_error.nil?
      errors[:email] = [email_error]
    end

    # 나이 검증
    age_error = validate_age(age)
    if !age_error.nil?
      errors[:age] = [age_error]
    end

    errors
  end
end

# 사용법
validator = FormValidator.new()

# 유효한 폼
errors1 = validator.validate_form("Alice", "alice@example.com", 30)
# {} 반환

# 유효하지 않은 폼
errors2 = validator.validate_form(nil, "invalid-email", -5)
# {
#   name: ["이름은(는) 필수입니다"],
#   email: ["이메일에 @가 포함되어야 합니다"],
#   age: ["나이는 양수여야 합니다"]
# } 반환
```

## 좁히기 제한사항

타입 좁히기에는 알아야 할 몇 가지 제한사항이 있습니다:

### 함수 호출 간에 좁히기가 유지되지 않음

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={212} />

```trb title="narrowing_limits.trb"
def helper(value: String | Integer)
  # 호출자의 좁히기에 의존할 수 없음
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

def caller(value: String | Integer)
  if value.is_a?(String)
    # 여기서 value는 String
    result = helper(value)  # 하지만 helper는 이것을 모름
  end
end
```

### 변경 후에는 좁히기가 작동하지 않음

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={223} />

```trb title="mutation_limits.trb"
def example(value: String | Integer)
  if value.is_a?(String)
    # 여기서 value는 String
    value = value.to_i
    # value는 이제 Integer, String이 아님!
  end

  # 여기서 value가 String이라고 가정할 수 없음
end
```

### 복잡한 조건은 좁히지 못할 수 있음

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={234} />

```trb title="complex_limits.trb"
def complex(a: String | nil, b: String | nil): String
  # 이것은 작동함
  if !a.nil? && !b.nil?
    # 여기서 a와 b 모두 String
    a + b
  else
    "값 누락"
  end
end

def very_complex(value: String | Integer | nil): String
  # 매우 복잡한 조건은 예상대로 좁히지 못할 수 있음
  # 더 단순하고 명시적인 검사를 사용하는 것이 좋음
  if value.is_a?(String)
    value
  elsif value.is_a?(Integer)
    value.to_s
  else
    "nil"
  end
end
```

## 모범 사례

### 1. 가드 절 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={245} />

```trb title="guard_clauses.trb"
# 좋음 - 조기 반환으로 좁히기가 명확함
def process(value: String | nil): String
  return "비어있음" if value.nil?

  # 여기서부터 value는 String
  value.upcase
end

# 피해야 함 - 중첩된 if는 따라가기 어려움
def process_nested(value: String | nil): String
  if !value.nil?
    value.upcase
  else
    "비어있음"
  end
end
```

### 2. nil을 먼저 검사

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={256} />

```trb title="nil_first.trb"
# 좋음 - 다른 타입보다 nil을 먼저 검사
def process(value: String | Integer | nil): String
  return "없음" if value.nil?

  if value.is_a?(String)
    value
  else
    value.to_s
  end
end
```

### 3. 구체적인 타입 검사 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/type_narrowing_spec.rb" line={267} />

```trb title="specific_checks.trb"
# 좋음 - 구체적인 타입 검사
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

# 피해야 함 - 모호한 검사
def process_vague(value: String | Integer): String
  if value.respond_to?(:upcase)
    # 타입 검사기에 덜 명확함
    value.upcase
  else
    value.to_s
  end
end
```

## 요약

T-Ruby의 타입 좁히기는 타입 검사기가 자동으로 타입을 구체화할 수 있게 합니다:

- **타입 가드**: `is_a?`, `nil?`, 비교 연산자
- **제어 흐름**: if/elsif/else, case/when, 삼항 연산자와 함께 작동
- **논리 연산자**: `&&`와 `||`로 결합된 검사 가능
- **조기 반환**: 가드 절이 나머지 코드의 타입을 좁힘
- **블록**: 블록 범위 내에서 좁히기 작동

타입 좁히기는 타입을 검사한 후 타입별 메서드에 안전하게 접근할 수 있게 하여 union 타입을 실용적으로 만듭니다. union 타입과 결합하면 다양한 데이터를 처리하는 강력하고 타입 안전한 방법을 제공합니다.

다음 장에서는 정확한 값을 타입으로 지정할 수 있는 리터럴 타입에 대해 배웁니다.
