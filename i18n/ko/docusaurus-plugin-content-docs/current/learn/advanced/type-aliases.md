---
sidebar_position: 1
title: 타입 별칭
description: 커스텀 타입 이름 만들기
---

<DocsBadge />


# 타입 별칭

타입 별칭을 사용하면 타입에 대한 커스텀 이름을 만들어 코드를 더 읽기 쉽고 유지보수하기 쉽게 만들 수 있습니다. 타입의 별명이라고 생각하세요—새로운 타입을 생성하는 것이 아니라 복잡한 타입을 더 쉽게 다루고 이해할 수 있게 해줍니다.

## 왜 타입 별칭인가?

타입 별칭은 여러 중요한 목적을 수행합니다:

1. **가독성 향상** - 복잡한 타입 표현식을 의미 있는 이름으로 대체
2. **반복 감소** - 한 번 정의하고 어디서나 사용
3. **의도 문서화** - 이름이 타입이 나타내는 것을 전달할 수 있음
4. **리팩토링 단순화** - 한 곳에서 타입을 변경

### 타입 별칭 없이

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={25} />

```trb
# 복잡한 타입이 모든 곳에서 반복됨
def find_user(id: Integer): Hash<Symbol, String | Integer | Bool> | nil
  # ...
end

def update_user(id: Integer, data: Hash<Symbol, String | Integer | Bool>): Bool
  # ...
end

def create_user(data: Hash<Symbol, String | Integer | Bool>): Integer
  # ...
end

# 이것이 무엇을 나타내는지 이해하기 어려움
users: Array<Hash<Symbol, String | Integer | Bool>> = []
```

### 타입 별칭 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={36} />

```trb
# 한 번 정의
type UserData = Hash<Symbol, String | Integer | Bool>

# 어디서나 사용 - 훨씬 명확!
def find_user(id: Integer): UserData | nil
  # ...
end

def update_user(id: Integer, data: UserData): Bool
  # ...
end

def create_user(data: UserData): Integer
  # ...
end

# 이것이 무엇을 나타내는지 명확
users: Array<UserData> = []
```

## 기본 타입 별칭

타입 별칭을 만드는 문법은 간단합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={47} />

```trb
type AliasName = ExistingType
```

### 간단한 별칭

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={58} />

```trb
# 기본 타입에 대한 별칭
type UserId = Integer
type EmailAddress = String
type Price = Float

# 별칭 사용
user_id: UserId = 123
email: EmailAddress = "alice@example.com"
product_price: Price = 29.99

# 별칭을 사용하는 함수
def send_email(to: EmailAddress, subject: String, body: String): Bool
  # ...
end

def calculate_discount(original: Price, percentage: Float): Price
  original * (1.0 - percentage / 100.0)
end
```

### 유니온 타입 별칭

유니온 타입은 별칭에서 큰 이점을 얻습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={69} />

```trb
# 이전: 반복되는 유니온 타입
def process(value: String | Integer | Float): String
  # ...
end

def format(value: String | Integer | Float): String
  # ...
end

# 이후: 명확한 별칭
type Primitive = String | Integer | Float

def process(value: Primitive): String
  # ...
end

def format(value: Primitive): String
  # ...
end

# 더 많은 예제
type ID = Integer | String
type JSONValue = String | Integer | Float | Bool | nil
type Result = :success | :error | :pending
```

### 컬렉션 별칭

복잡한 컬렉션 타입을 더 읽기 쉽게 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={80} />

```trb
# 배열 별칭
type StringList = Array<String>
type NumberList = Array<Integer>
type UserList = Array<User>

# 해시 별칭
type StringMap = Hash<String, String>
type Configuration = Hash<Symbol, String | Integer>
type Cache = Hash<String, Any>

# 중첩 컬렉션
type Matrix = Array<Array<Integer>>
type TagMap = Hash<String, Array<String>>
type UsersByAge = Hash<Integer, Array<User>>

# 컬렉션 별칭 사용
users: UserList = []
config: Configuration = {
  port: 3000,
  host: "localhost",
  debug: true
}

tags: TagMap = {
  "ruby" => ["language", "dynamic"],
  "rails" => ["framework", "web"]
}
```

## 제네릭 타입 별칭

타입 별칭 자체가 제네릭이 되어 타입 매개변수를 받을 수 있습니다:

### 기본 제네릭 별칭

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={91} />

```trb
# 제네릭 Result 타입
type Result<T> = T | nil

# 사용법
user_result: Result<User> = find_user(123)
count_result: Result<Integer> = count_records()

# 제네릭 콜백 타입
type Callback<T> = Proc<T, void>

# 사용법
on_user_load: Callback<User> = ->(user: User): void { puts user.name }
on_count: Callback<Integer> = ->(count: Integer): void { puts count }

# 제네릭 쌍 타입
type Pair<A, B> = Array<A | B>  # 예제를 위해 단순화됨

# 사용법
name_age: Pair<String, Integer> = ["Alice", 30]
```

### 복잡한 제네릭 별칭

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={102} />

```trb
# 메타데이터가 있는 제네릭 컬렉션
type Collection<T> = Hash<Symbol, T | Integer | String>

# 사용법
user_collection: Collection<User> = {
  data: User.new("Alice"),
  count: 1,
  status: "active"
}

# 제네릭 변환 함수 타입
type Transformer<T, U> = Proc<T, U>

# 사용법
to_string: Transformer<Integer, String> = ->(n: Integer): String { n.to_s }
to_length: Transformer<String, Integer> = ->(s: String): Integer { s.length }

# 제네릭 검증자 타입
type Validator<T> = Proc<T, Bool>

# 사용법
positive_validator: Validator<Integer> = ->(n: Integer): Bool { n > 0 }
email_validator: Validator<String> = ->(s: String): Bool { s.include?("@") }
```

### 부분 적용 제네릭 별칭

일부 타입 매개변수를 고정하고 다른 것은 열어둔 별칭을 만들 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={113} />

```trb
# 기본 제네릭 타입
type Response<T, E> = { success: Bool, data: T | nil, error: E | nil }

# 부분 적용 - 오류 타입 고정
type APIResponse<T> = Response<T, String>

# 사용법
user_response: APIResponse<User> = {
  success: true,
  data: User.new("Alice"),
  error: nil
}

product_response: APIResponse<Product> = {
  success: false,
  data: nil,
  error: "Product not found"
}

# 또 다른 예제
type StringMap<V> = Hash<String, V>

# 사용법
string_to_int: StringMap<Integer> = { "one" => 1, "two" => 2 }
string_to_user: StringMap<User> = { "admin" => User.new("Admin") }
```

## 실용적인 타입 별칭

### 도메인별 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={124} />

```trb
# 전자상거래 도메인
type ProductId = Integer
type OrderId = String
type CustomerId = Integer
type Price = Float
type Quantity = Integer

type Product = Hash<Symbol, ProductId | String | Price>
type OrderItem = Hash<Symbol, ProductId | Quantity | Price>
type Order = Hash<Symbol, OrderId | CustomerId | Array<OrderItem> | String>

# 도메인 타입 사용
def create_order(customer_id: CustomerId, items: Array<OrderItem>): Order
  {
    id: generate_order_id(),
    customer_id: customer_id,
    items: items,
    status: "pending"
  }
end

def calculate_total(items: Array<OrderItem>): Price
  items.reduce(0.0) { |sum, item| sum + item[:price] * item[:quantity] }
end
```

### 상태 및 상태 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={135} />

```trb
# 애플리케이션 상태
type Status = :pending | :processing | :completed | :failed
type UserRole = :admin | :editor | :viewer
type Environment = :development | :staging | :production

# HTTP 관련 타입
type HTTPMethod = :get | :post | :put | :patch | :delete
type HTTPStatus = Integer  # 더 구체적일 수 있음: 200 | 404 | 500 등
type Headers = Hash<String, String>

# 상태 타입 사용
class Request
  @method: HTTPMethod
  @path: String
  @headers: Headers
  @status: Status

  def initialize(method: HTTPMethod, path: String): void
    @method = method
    @path = path
    @headers = {}
    @status = :pending
  end

  def add_header(key: String, value: String): void
    @headers[key] = value
  end

  def status: Status
    @status
  end
end
```

### JSON 및 API 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={146} />

```trb
# JSON 타입
type JSONPrimitive = String | Integer | Float | Bool | nil
type JSONArray = Array<JSONValue>
type JSONObject = Hash<String, JSONValue>
type JSONValue = JSONPrimitive | JSONArray | JSONObject

# API 응답 타입
type APIError = Hash<Symbol, String | Integer>
type APISuccess<T> = Hash<Symbol, Bool | T>
type APIResult<T> = APISuccess<T> | APIError

# JSON 타입 사용
def parse_config(json: String): JSONObject
  # JSON 문자열을 객체로 파싱
  JSON.parse(json)
end

def api_call<T>(endpoint: String): APIResult<T>
  begin
    data = fetch(endpoint)
    { success: true, data: data }
  rescue => e
    { success: false, error: e.message, code: 500 }
  end
end
```

### 함수 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={157} />

```trb
# 일반적인 함수 시그니처
type Predicate<T> = Proc<T, Bool>
type Mapper<T, U> = Proc<T, U>
type Consumer<T> = Proc<T, void>
type Supplier<T> = Proc<T>
type Comparator<T> = Proc<T, T, Integer>

# 함수 타입 사용
def filter<T>(array: Array<T>, predicate: Predicate<T>): Array<T>
  array.select { |item| predicate.call(item) }
end

def map<T, U>(array: Array<T>, mapper: Mapper<T, U>): Array<U>
  array.map { |item| mapper.call(item) }
end

def for_each<T>(array: Array<T>, consumer: Consumer<T>): void
  array.each { |item| consumer.call(item) }
end

# 사용법
numbers = [1, 2, 3, 4, 5]
is_even: Predicate<Integer> = ->(n: Integer): Bool { n.even? }
evens = filter(numbers, is_even)  # [2, 4]

to_string: Mapper<Integer, String> = ->(n: Integer): String { n.to_s }
strings = map(numbers, to_string)  # ["1", "2", "3", "4", "5"]

print_it: Consumer<Integer> = ->(n: Integer): void { puts n }
for_each(numbers, print_it)
```

## 타입 별칭 구성

더 간단한 별칭에서 복잡한 타입 별칭을 만들 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={168} />

```trb
# 기본 타입
type UserId = Integer
type Username = String
type Email = String
type Timestamp = Integer

# 구성된 타입
type UserIdentifier = UserId | Username | Email
type UserMetadata = Hash<Symbol, String | Timestamp>
type UserData = Hash<Symbol, UserIdentifier | String | Timestamp>

# 부분에서 구성된 전체 사용자 타입
type User = {
  id: UserId,
  username: Username,
  email: Email,
  metadata: UserMetadata
}

# 또 다른 예제: 복잡성 증가
type Coordinate = Float
type Point = Array<Coordinate>  # [x, y]
type Line = Array<Point>        # [point1, point2]
type Polygon = Array<Point>     # [point1, point2, point3, ...]
type Shape = Point | Line | Polygon
type DrawingLayer = Array<Shape>
type Drawing = Hash<String, DrawingLayer>
```

## 재귀 타입 별칭

:::caution 준비 중
이 기능은 향후 릴리스에 계획되어 있습니다.
:::

향후 T-Ruby는 트리 구조와 연결 리스트를 위한 재귀 타입 별칭을 지원할 예정입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={179} />

```trb
# 트리 구조
type TreeNode<T> = {
  value: T,
  children: Array<TreeNode<T>>
}

# 연결 리스트
type ListNode<T> = {
  value: T,
  next: ListNode<T> | nil
}

# JSON (완전 재귀)
type JSONValue =
  | String
  | Integer
  | Float
  | Bool
  | nil
  | Array<JSONValue>
  | Hash<String, JSONValue>
```

## 모범 사례

### 1. 설명적인 이름 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={190} />

```trb
# 좋음: 명확하고 설명적인 이름
type EmailAddress = String
type ProductPrice = Float
type UserRole = :admin | :editor | :viewer

# 덜 좋음: 불명확한 약어
type EA = String
type PP = Float
type UR = :admin | :editor | :viewer
```

### 2. 관련 별칭 그룹화

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={201} />

```trb
# 좋음: 도메인별로 정리
# 사용자 관련 타입
type UserId = Integer
type Username = String
type UserEmail = String
type UserData = Hash<Symbol, String | Integer>

# 제품 관련 타입
type ProductId = Integer
type ProductName = String
type ProductPrice = Float
type ProductData = Hash<Symbol, String | Integer | Float>
```

### 3. 복잡한 타입에 별칭 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={212} />

```trb
# 좋음: 여러 번 사용되는 복잡한 타입에 별칭
type QueryResult = Hash<Symbol, Array<Hash<String, String | Integer>> | Integer>

def execute_query(sql: String): QueryResult
  # ...
end

def cache_result(key: String, result: QueryResult): void
  # ...
end

# 덜 좋음: 복잡한 타입 반복
def execute_query(sql: String): Hash<Symbol, Array<Hash<String, String | Integer>> | Integer>
  # ...
end
```

### 4. 간단한 타입에 과도한 별칭 금지

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={223} />

```trb
# 불필요: String이 이미 명확함
type S = String
type N = Integer

# 좋음: 의미를 추가할 때만 별칭
type EmailAddress = String  # 의미적 의미 추가
type UserId = Integer       # 목적 명확화
```

## 타입 별칭 vs 클래스

타입 별칭은 새로운 타입을 생성하지 않습니다—단지 대체 이름일 뿐입니다. 이것은 클래스와 다릅니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={234} />

```trb
# 타입 별칭 - 단지 이름
type UserId = Integer

# 둘 다 같은 타입
id1: UserId = 123
id2: Integer = 456
id1 = id2  # OK - 같은 타입

# 클래스 - 새로운 타입 생성
class UserIdClass
  @value: Integer

  def initialize(value: Integer): void
    @value = value
  end
end

# 다른 타입
user_id: UserIdClass = UserIdClass.new(123)
int_id: Integer = 456
# user_id = int_id  # 에러: 다른 타입!
```

### 각각 언제 사용할지

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={245} />

```trb
# 타입 별칭 사용:
# - 의미적 명확성이 필요하지만 동일한 기본 동작을 원할 때
# - 복잡한 타입 표현식을 단순화하고 싶을 때
type EmailAddress = String
type JSONData = Hash<String, Any>

# 클래스 사용:
# - 다른 동작을 가진 별개의 타입이 필요할 때
# - 캡슐화와 메서드가 필요할 때
# - 런타임 타입 검사가 필요할 때
class Email
  @address: String

  def initialize(address: String): void
    raise "Invalid email" unless address.include?("@")
    @address = address
  end

  def domain: String
    @address.split("@").last
  end
end
```

## 일반적인 패턴

### 옵셔널 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={256} />

```trb
# 옵셔널/널러블 타입 별칭
type Optional<T> = T | nil
type Nullable<T> = T | nil

# 사용법
user: Optional<User> = find_user(123)
name: Nullable<String> = user&.name
```

### 결과 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={267} />

```trb
# 실패할 수 있는 연산을 위한 결과 타입
type Result<T, E> = { success: Bool, value: T | nil, error: E | nil }
type SimpleResult<T> = T | Error

# 사용법
def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, value: nil, error: "Division by zero" }
  else
    { success: true, value: a / b, error: nil }
  end
end
```

### 빌더 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={278} />

```trb
# 설정 빌더
type Config = Hash<Symbol, String | Integer | Bool>
type ConfigBuilder = Proc<Config, Config>

# 사용법
def configure(&block: ConfigBuilder): Config
  config = {
    port: 3000,
    host: "localhost",
    debug: false
  }
  block.call(config)
end
```

## 타입 별칭을 통한 문서화

타입 별칭은 인라인 문서화 역할을 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/type_aliases_spec.rb" line={289} />

```trb
# 별칭 이름이 타입이 나타내는 것을 문서화
type PositiveInteger = Integer  # > 0이어야 함
type NonEmptyString = String    # 비어 있지 않아야 함
type Percentage = Float         # 0.0에서 100.0이어야 함

def calculate_discount(price: Float, discount: Percentage): Float
  price * (1.0 - discount / 100.0)
end

def repeat(text: NonEmptyString, times: PositiveInteger): String
  text * times
end
```

## 다음 단계

이제 타입 별칭을 이해했으니 다음을 탐색하세요:

- [교차 타입](/docs/learn/advanced/intersection-types)으로 여러 타입 결합
- [유니온 타입](/docs/learn/everyday-types/union-types)으로 양자택일 타입 관계
- [유틸리티 타입](/docs/learn/advanced/utility-types)으로 고급 타입 변환
