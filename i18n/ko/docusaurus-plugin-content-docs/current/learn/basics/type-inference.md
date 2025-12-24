---
sidebar_position: 3
title: 타입 추론
description: T-Ruby가 자동으로 타입을 추론하는 방법
---

<DocsBadge />


# 타입 추론

T-Ruby의 가장 강력한 기능 중 하나는 타입 추론입니다. 타입 시스템은 모든 곳에 명시적 어노테이션을 요구하지 않고도 변수와 표현식의 타입을 자동으로 결정할 수 있습니다. 이 장에서는 타입 추론이 어떻게 작동하고 언제 의존해야 하는지 배웁니다.

## 타입 추론이란?

타입 추론은 T-Ruby의 타입 체커가 할당된 값이나 사용되는 컨텍스트를 기반으로 변수나 표현식의 타입을 자동으로 추론하는 능력입니다. 이는 항상 타입 어노테이션을 작성할 필요가 없다는 것을 의미합니다.

### 기본 추론 예제

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={25} />

```trb title="basic_inference.trb"
# T-Ruby는 name이 String임을 추론
name = "Alice"

# T-Ruby는 count가 Integer임을 추론
count = 42

# T-Ruby는 price가 Float임을 추론
price = 19.99

# T-Ruby는 active가 Boolean임을 추론
active = true
```

트랜스파일된 Ruby는 동일합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={36} />

```ruby title="basic_inference.rb"
name = "Alice"
count = 42
price = 19.99
active = true
```

## 타입 추론 작동 방식

T-Ruby는 할당되는 값을 검사하고 리터럴에서 타입을 결정합니다:

### 리터럴 기반 추론

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={46} />

```trb title="literals.trb"
# String 리터럴 → String 타입
greeting = "Hello"

# Integer 리터럴 → Integer 타입
age = 25

# Float 리터럴 → Float 타입
temperature = 98.6

# Boolean 리터럴 → Boolean 타입
is_valid = false

# Symbol 리터럴 → Symbol 타입
status = :active

# nil 리터럴 → nil 타입
nothing = nil
```

### 표현식 기반 추론

T-Ruby는 표현식에서 타입을 추론할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={57} />

```trb title="expressions.trb"
x = 10
y = 20

# Integer로 추론 (Integer + Integer의 결과)
sum = x + y

# String으로 추론 (String + String의 결과)
first_name = "Alice"
last_name = "Smith"
full_name = first_name + " " + last_name

# Float로 추론 (Integer.to_f의 결과)
decimal = x.to_f
```

### 메서드 반환 타입 추론

메서드에 반환 타입 어노테이션이 있을 때, T-Ruby는 결과의 타입을 알고 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={68} />

```trb title="method_returns.trb"
def get_name(): String
  "Alice"
end

# T-Ruby는 name이 String임을 추론
name = get_name()

def calculate_total(items: Integer, price: Float): Float
  items * price
end

# T-Ruby는 total이 Float임을 추론
total = calculate_total(3, 9.99)
```

## 추론이 가장 잘 작동하는 경우

타입 추론은 명확한 초기화가 있는 지역 변수에 가장 잘 작동합니다:

### 지역 변수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={79} />

```trb title="local_vars.trb"
def process_order(quantity: Integer, unit_price: Float)
  # 이러한 타입들은 모두 추론됨
  subtotal = quantity * unit_price
  tax_rate = 0.08
  tax = subtotal * tax_rate
  total = subtotal + tax

  {
    subtotal: subtotal,
    tax: tax,
    total: total
  }
end
```

이 예제에서 T-Ruby는 다음을 추론합니다:
- `subtotal`은 `Float` (Integer * Float = Float)
- `tax_rate`는 `Float` (0.08은 float 리터럴)
- `tax`는 `Float` (Float * Float = Float)
- `total`은 `Float` (Float + Float = Float)

### 배열과 해시 추론

T-Ruby는 배열과 해시 요소의 타입을 추론할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={90} />

```trb title="collections.trb"
# Array<Integer>로 추론
numbers = [1, 2, 3, 4, 5]

# Array<String>으로 추론
names = ["Alice", "Bob", "Charlie"]

# Hash<Symbol, String>으로 추론
user = {
  name: "Alice",
  email: "alice@example.com"
}

# Hash<String, Integer>로 추론
scores = {
  "math" => 95,
  "science" => 88
}
```

### 블록 매개변수 추론

T-Ruby는 타입이 지정된 컬렉션을 반복할 때 블록 매개변수 타입을 추론할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={101} />

```trb title="blocks.trb"
def sum_numbers(numbers: Array<Integer>): Integer
  total = 0

  # T-Ruby는 n이 Integer임을 추론
  numbers.each do |n|
    total += n
  end

  total
end

def greet_all(names: Array<String>)
  # T-Ruby는 name이 String임을 추론
  names.each do |name|
    puts "안녕하세요, #{name}님!"
  end
end
```

## 명시적 어노테이션을 추가해야 할 때

추론이 강력하지만, 명시적 타입 어노테이션을 추가해야 하는 경우가 있습니다:

### 1. 메서드 시그니처 (항상)

항상 메서드 매개변수와 반환 타입에 어노테이션을 달아야 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={112} />

```trb title="method_sigs.trb"
# 좋음 - 명시적 어노테이션
def calculate_discount(price: Float, percent: Integer): Float
  price * (percent / 100.0)
end

# 피해야 함 - 어노테이션 없음 (이해하고 사용하기 어려움)
def calculate_discount(price, percent)
  price * (percent / 100.0)
end
```

### 2. 인스턴스 변수

인스턴스 변수는 선언할 때 어노테이션을 달아야 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={123} />

```trb title="instance_vars.trb"
class ShoppingCart
  def initialize()
    @items: Array<String> = []
    @total: Float = 0.0
  end

  def add_item(item: String, price: Float)
    @items << item
    @total += price
  end
end
```

### 3. 모호한 상황

초기 값에서 타입이 명확하지 않을 때:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={134} />

```trb title="ambiguous.trb"
# 모호함 - Float여야 하나 Integer여야 하나?
result = 0  # Integer로 추론

# 더 나음 - Float가 필요할 때 명시적으로
result: Float = 0.0

# 또는 임시 값으로 시작할 때
users: Array<String> = []  # 나중에 사용자 이름을 담을 것
```

### 4. Union 타입

변수가 다른 타입을 담을 수 있을 때:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={145} />

```trb title="unions.trb"
# union 타입에는 명시적 어노테이션 필요
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# 처음에 nil일 때 명시적 어노테이션 필요
current_user: String | nil = nil
```

### 5. 공개 API

공개 메서드, 클래스 또는 모듈을 정의할 때:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={156} />

```trb title="public_api.trb"
module MathHelpers
  # 공개 메서드 - 완전히 어노테이션됨
  def self.calculate_average(numbers: Array<Float>): Float
    sum = numbers.reduce(0.0) { |acc, n| acc + n }
    sum / numbers.length
  end

  # 공개 메서드 - 완전히 어노테이션됨
  def self.round_currency(amount: Float): String
    "$%.2f" % amount
  end
end
```

## 제어 흐름과 추론

T-Ruby의 추론은 제어 흐름 구조를 통해 작동합니다:

### If 문

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={167} />

```trb title="if_statements.trb"
def categorize_age(age: Integer): String
  # category는 모든 브랜치에서 String으로 추론
  if age < 13
    category = "어린이"
  elsif age < 20
    category = "청소년"
  else
    category = "성인"
  end

  category
end
```

### Case 문

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={178} />

```trb title="case_statements.trb"
def get_day_type(day: Symbol): String
  # day_type은 String으로 추론
  day_type = case day
  when :monday, :tuesday, :wednesday, :thursday, :friday
    "평일"
  when :saturday, :sunday
    "주말"
  else
    "알 수 없음"
  end

  day_type
end
```

## 일반적인 추론 패턴

### 패턴 1: 초기화 후 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={189} />

```trb title="pattern1.trb"
def process_names(raw_names: String): Array<String>
  # names는 Array<String>으로 추론
  names = raw_names.split(",")

  # cleaned는 Array<String>으로 추론
  cleaned = names.map { |n| n.strip.downcase }

  cleaned
end
```

### 패턴 2: 누산기 변수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={200} />

```trb title="pattern2.trb"
def calculate_stats(numbers: Array<Integer>): Hash<Symbol, Float>
  # sum은 Integer로 추론 (0으로 시작, Integer를 더함)
  sum = 0
  numbers.each { |n| sum += n }

  # avg는 Float로 추론 (Integer.to_f)
  avg = sum.to_f / numbers.length

  { sum: sum.to_f, average: avg }
end
```

### 패턴 3: 빌더 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={211} />

```trb title="pattern3.trb"
def build_query(table: String, conditions: Array<String>): String
  # query는 String으로 추론
  query = "SELECT * FROM #{table}"

  if conditions.length > 0
    # where_clause는 String으로 추론
    where_clause = conditions.join(" AND ")
    query += " WHERE #{where_clause}"
  end

  query
end
```

## 타입 추론의 한계

T-Ruby가 자동으로 타입을 추론할 수 없는 상황이 있습니다:

### 빈 컬렉션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={222} />

```trb title="empty_collections.trb"
# T-Ruby는 빈 배열에서 요소 타입을 추론할 수 없음
items = []  # 어노테이션 필요!

# 더 나음 - 타입 어노테이션
items: Array<String> = []

# 또는 최소 하나의 요소로 초기화
items = ["first_item"]
```

### 복잡한 Union 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={233} />

```trb title="complex_unions.trb"
# T-Ruby는 이것이 여러 타입을 받아야 한다는 것을 추론할 수 없음
def process_value(value)  # 어노테이션 필요!
  if value.is_a?(String)
    value.upcase
  elsif value.is_a?(Integer)
    value * 2
  end
end

# 더 나음 - 명시적 union 타입
def process_value(value: String | Integer): String | Integer
  if value.is_a?(String)
    value.upcase
  else
    value * 2
  end
end
```

### 재귀 함수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={244} />

```trb title="recursive.trb"
# 재귀에는 반환 타입 어노테이션 필요
def factorial(n: Integer): Integer
  return 1 if n <= 1
  n * factorial(n - 1)
end

def fibonacci(n: Integer): Integer
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end
```

## 타입 추론 모범 사례

### 1. 지역 변수는 추론에 맡기기

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={255} />

```trb title="locals.trb"
def calculate_discount(price: Float, rate: Float): Float
  # 추론에 맡기기 - 타입이 명백함
  discount = price * rate
  final_price = price - discount

  final_price
end
```

### 2. 스코프 간 공유할 때 어노테이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={266} />

```trb title="shared_scope.trb"
class OrderProcessor
  def initialize()
    # 어노테이션 - 메서드 간 공유
    @pending_orders: Array<String> = []
    @completed_count: Integer = 0
  end

  def add_order(order: String)
    @pending_orders << order
  end

  def complete_order()
    @pending_orders.shift
    @completed_count += 1
  end
end
```

### 3. 중간 계산에는 추론 선호

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={277} />

```trb title="intermediate.trb"
def calculate_compound_interest(
  principal: Float,
  rate: Float,
  years: Integer
): Float
  # 모든 중간 값은 추론됨
  rate_decimal = rate / 100.0
  multiplier = 1.0 + rate_decimal
  final_multiplier = multiplier ** years
  final_amount = principal * final_multiplier

  final_amount
end
```

### 4. 복잡한 로직에서는 명확성을 위해 어노테이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/basics/type_inference_spec.rb" line={288} />

```trb title="clarity.trb"
def parse_config(raw: String): Hash<Symbol, String | Integer>
  # 명확성을 위해 결과 타입 어노테이션
  config: Hash<Symbol, String | Integer> = {}

  raw.split("\n").each do |line|
    key, value = line.split("=")
    config[key.to_sym] = parse_value(value)
  end

  config
end

def parse_value(value: String): String | Integer
  integer_value = value.to_i
  if integer_value.to_s == value
    integer_value
  else
    value
  end
end
```

## 요약

T-Ruby의 타입 추론은 타입 안전성을 유지하면서 깔끔하고 간결한 코드를 작성할 수 있게 해줍니다:

- **추론이 작동하는 곳**: 지역 변수, 리터럴, 표현식
- **항상 어노테이션**: 메서드 시그니처, 인스턴스 변수, 공개 API
- **어노테이션 추가**: 타입이 모호하거나 복잡할 때
- **추론 신뢰**: 중간 계산과 지역 변수에서
- **명시적 타입 사용**: 빈 컬렉션과 union 타입에서

목표는 균형을 맞추는 것입니다: 추론이 복잡함을 줄이고 어노테이션이 명확성과 안전성을 향상시키는 곳에 추가하세요.

다음 섹션에서는 T-Ruby에서 자주 사용하게 될 배열, 해시, union 타입과 같은 일상적인 타입에 대해 배웁니다.
