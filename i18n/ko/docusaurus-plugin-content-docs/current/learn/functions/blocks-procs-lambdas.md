---
sidebar_position: 3
title: 블록, Proc & 람다
description: 블록, proc, 람다 표현식의 타이핑
---

<DocsBadge />


# 블록, Proc & 람다

블록, proc, 람다는 실행 가능한 코드를 전달할 수 있게 해주는 Ruby의 필수 기능입니다. T-Ruby는 Ruby의 유연성을 유지하면서 타입 안전성을 보장하는 강력한 타입 시스템을 이러한 구조에 제공합니다.

## 차이점 이해하기

타이핑에 들어가기 전에, 세 가지 개념을 명확히 하겠습니다:

- **블록**: 메서드에 전달되는 익명 코드 (객체가 아님)
- **Proc**: 객체로 감싸진 블록
- **람다**: 다른 인수 처리를 가진 더 엄격한 형태의 Proc

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="basics.trb"
# 블록 - do...end 또는 {...}로 전달
[1, 2, 3].each do |n|
  puts n
end

# Proc - Proc.new로 생성
my_proc: Proc<Integer, void> = Proc.new { |n| puts n }
my_proc.call(5)

# 람다 - ->로 생성
my_lambda: Proc<Integer, void> = ->(n: Integer) { puts n }
my_lambda.call(10)
```

## 블록 타이핑

블록을 받는 메서드는 `&block` 매개변수를 사용합니다. `Proc`으로 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="block_params.trb"
def each_number(&block: Proc<Integer, void>): void
  [1, 2, 3].each do |n|
    block.call(n)
  end
end

def transform_strings(&block: Proc<String, String>): Array<String>
  ["hello", "world"].map do |str|
    block.call(str)
  end
end

# 메서드 사용하기
each_number { |n| puts n * 2 }

result = transform_strings { |s| s.upcase }
# result: ["HELLO", "WORLD"]
```

`Proc<Input, Output>` 구문은 다음을 지정합니다:
- **첫 번째 타입**: 블록 매개변수 타입
- **두 번째 타입**: 블록의 반환 타입

## 다중 블록 매개변수

블록은 여러 매개변수를 받을 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="multiple_params.trb"
def each_pair(&block: Proc<[String, Integer], void>): void
  pairs = [["Alice", 30], ["Bob", 25], ["Charlie", 35]]
  pairs.each do |name, age|
    block.call(name, age)
  end
end

def transform_hash(&block: Proc<[String, Integer], String>): Array<String>
  { "a" => 1, "b" => 2, "c" => 3 }.map do |key, value|
    block.call(key, value)
  end
end

# 다중 매개변수 사용하기
each_pair do |name, age|
  puts "#{name} is #{age} years old"
end

results = transform_hash { |k, v| "#{k}=#{v}" }
# results: ["a=1", "b=2", "c=3"]
```

다중 블록 매개변수에는 튜플 구문 `[Type1, Type2]`를 사용합니다.

## 선택적 블록

일부 메서드는 블록이 있거나 없이 작동할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="optional_blocks.trb"
def process_items(items: Array<Integer>, &block: Proc<Integer, Integer>?): Array<Integer>
  if block
    items.map { |item| block.call(item) }
  else
    items  # 변경 없이 items 반환
  end
end

# 블록과 함께
doubled = process_items([1, 2, 3]) { |n| n * 2 }
# doubled: [2, 4, 6]

# 블록 없이
unchanged = process_items([1, 2, 3])
# unchanged: [1, 2, 3]
```

`?`는 블록을 선택적(nilable)으로 만듭니다.

## Proc 타입

Proc은 저장하고 전달할 수 있는 일급 객체입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="procs.trb"
# proc 타입 정의
adder: Proc<Integer, Integer> = Proc.new { |n| n + 10 }
greeter: Proc<String, String> = Proc.new { |name| "Hello, #{name}!" }
validator: Proc<String, Boolean> = Proc.new { |email| email.include?("@") }

# proc 사용하기
result1 = adder.call(5)        # 15
result2 = greeter.call("Alice") # "Hello, Alice!"
result3 = validator.call("test@example.com")  # true

# Proc은 메서드에 전달할 수 있음
def apply_to_all(numbers: Array<Integer>, operation: Proc<Integer, Integer>): Array<Integer>
  numbers.map { |n| operation.call(n) }
end

doubled = apply_to_all([1, 2, 3], Proc.new { |n| n * 2 })
# doubled: [2, 4, 6]
```

## 람다 타입

람다는 Proc과 동일한 타입 시그니처를 가집니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="lambdas.trb"
# 타입 어노테이션이 있는 람다
add_ten: Proc<Integer, Integer> = ->(n: Integer) { n + 10 }
multiply: Proc<[Integer, Integer], Integer> = ->(a: Integer, b: Integer) { a * b }
format_user: Proc<User, String> = ->(user: User) { "#{user.name} (#{user.email})" }

# 람다 사용하기
sum = add_ten.call(5)              # 15
product = multiply.call(3, 4)       # 12
formatted = format_user.call(user)  # "Alice (alice@example.com)"

# 람다는 메서드에 전달할 수 있음
def filter_users(users: Array<User>, predicate: Proc<User, Boolean>): Array<User>
  users.select { |user| predicate.call(user) }
end

is_admin: Proc<User, Boolean> = ->(user: User) { user.role == "admin" }
admins = filter_users(all_users, is_admin)
```

## 고차 함수

proc이나 람다를 반환하는 함수:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="higher_order.trb"
def create_multiplier(factor: Integer): Proc<Integer, Integer>
  ->(n: Integer) { n * factor }
end

def create_formatter(prefix: String): Proc<String, String>
  ->(text: String) { "#{prefix}: #{text}" }
end

def create_validator(min_length: Integer): Proc<String, Boolean>
  ->(text: String) { text.length >= min_length }
end

# 고차 함수 사용하기
times_three = create_multiplier(3)
times_three.call(4)  # 12

error_formatter = create_formatter("ERROR")
error_formatter.call("File not found")  # "ERROR: File not found"

password_validator = create_validator(8)
password_validator.call("secret")   # false
password_validator.call("secret123") # true
```

## 매개변수 없는 블록

일부 블록은 매개변수를 받지 않습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="no_params.trb"
def execute(&block: Proc<[], void>): void
  puts "Before execution"
  block.call
  puts "After execution"
end

def run_if_true(condition: Boolean, &block: Proc<[], String>): String?
  if condition
    block.call
  else
    nil
  end
end

# 매개변수 없는 블록 사용하기
execute do
  puts "Executing task"
end

result = run_if_true(true) do
  "Task completed"
end
```

매개변수를 받지 않는 블록에는 `Proc<[], ReturnType>`을 사용합니다.

## 제네릭 블록

블록은 타입 정보를 보존하기 위해 제네릭이 될 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="generic_blocks.trb"
def map<T, U>(array: Array<T>, &block: Proc<T, U>): Array<U>
  array.map { |item| block.call(item) }
end

def filter<T>(array: Array<T>, &block: Proc<T, Boolean>): Array<T>
  array.select { |item| block.call(item) }
end

def reduce<T, U>(array: Array<T>, initial: U, &block: Proc<[U, T], U>): U
  array.reduce(initial) { |acc, item| block.call(acc, item) }
end

# 제네릭 블록을 통해 타입이 보존됨
numbers = [1, 2, 3, 4, 5]
strings = map(numbers) { |n| n.to_s }  # Array<String>
evens = filter(numbers) { |n| n.even? }  # Array<Integer>
sum = reduce(numbers, 0) { |acc, n| acc + n }  # Integer
```

## 실전 예제: 이벤트 핸들러

이벤트 처리에 블록을 사용하는 실제 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="event_handler.trb"
class EventEmitter<T>
  def initialize()
    @listeners: Array<Proc<T, void>> = []
  end

  def on(&listener: Proc<T, void>): void
    @listeners.push(listener)
  end

  def emit(event: T): void
    @listeners.each { |listener| listener.call(event) }
  end

  def remove(&listener: Proc<T, void>): void
    @listeners.delete(listener)
  end
end

# 이벤트 이미터 사용하기
class UserEvent
  attr_accessor :type: String
  attr_accessor :user: User

  def initialize(type: String, user: User)
    @type = type
    @user = user
  end
end

user_events = EventEmitter<UserEvent>.new

# 이벤트 핸들러 등록
user_events.on do |event|
  puts "User event: #{event.type} for #{event.user.name}"
end

user_events.on do |event|
  if event.type == "login"
    log_login(event.user)
  end
end

# 이벤트 발생
user_events.emit(UserEvent.new("login", current_user))
user_events.emit(UserEvent.new("logout", current_user))
```

## 실전 예제: 미들웨어 패턴

미들웨어 체인에 proc을 사용하는 예제:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="middleware.trb"
class Request
  attr_accessor :path: String
  attr_accessor :params: Hash<String, String>

  def initialize(path: String, params: Hash<String, String>)
    @path = path
    @params = params
  end
end

class Response
  attr_accessor :status: Integer
  attr_accessor :body: String

  def initialize(status: Integer, body: String)
    @status = status
    @body = body
  end
end

type Middleware = Proc<[Request, Proc<Request, Response>], Response>

class MiddlewareStack
  def initialize()
    @middlewares: Array<Middleware> = []
  end

  def use(middleware: Middleware): void
    @middlewares.push(middleware)
  end

  def execute(request: Request, handler: Proc<Request, Response>): Response
    chain = @middlewares.reverse.reduce(handler) do |next_handler, middleware|
      ->(req: Request) { middleware.call(req, next_handler) }
    end
    chain.call(request)
  end
end

# 미들웨어 정의
logging_middleware: Middleware = ->(req: Request, next_handler: Proc<Request, Response>) {
  puts "Request: #{req.path}"
  response = next_handler.call(req)
  puts "Response: #{response.status}"
  response
}

auth_middleware: Middleware = ->(req: Request, next_handler: Proc<Request, Response>) {
  if req.params["token"]
    next_handler.call(req)
  else
    Response.new(401, "Unauthorized")
  end
}

# 미들웨어 스택 사용
stack = MiddlewareStack.new
stack.use(logging_middleware)
stack.use(auth_middleware)

handler: Proc<Request, Response> = ->(req: Request) {
  Response.new(200, "Hello, World!")
}

request = Request.new("/api/users", { "token" => "abc123" })
response = stack.execute(request, handler)
```

## 실전 예제: 함수형 연산

함수형 유틸리티 라이브러리 구축:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="functional.trb"
module Functional
  def self.compose<A, B, C>(
    f: Proc<B, C>,
    g: Proc<A, B>
  ): Proc<A, C>
    ->(x: A) { f.call(g.call(x)) }
  end

  def self.curry<A, B, C>(
    f: Proc<[A, B], C>
  ): Proc<A, Proc<B, C>>
    ->(a: A) { ->(b: B) { f.call(a, b) } }
  end

  def self.memoize<T, U>(f: Proc<T, U>): Proc<T, U>
    cache: Hash<T, U> = {}
    ->(arg: T) {
      if cache.key?(arg)
        cache[arg]
      else
        result = f.call(arg)
        cache[arg] = result
        result
      end
    }
  end
end

# 함수형 연산 사용하기
add_one: Proc<Integer, Integer> = ->(n: Integer) { n + 1 }
multiply_two: Proc<Integer, Integer> = ->(n: Integer) { n * 2 }

# 함수 합성
add_then_multiply = Functional.compose(multiply_two, add_one)
add_then_multiply.call(5)  # (5 + 1) * 2 = 12

# 함수 커링
multiply: Proc<[Integer, Integer], Integer> = ->(a: Integer, b: Integer) { a * b }
curried_multiply = Functional.curry(multiply)
times_three = curried_multiply.call(3)
times_three.call(4)  # 12

# 비용이 큰 연산 메모이제이션
expensive: Proc<Integer, Integer> = ->(n: Integer) {
  puts "Computing..."
  n * n
}
memoized = Functional.memoize(expensive)
memoized.call(5)  # "Computing..."을 출력하고 25를 반환
memoized.call(5)  # 즉시 25를 반환 (캐시됨)
```

## 블록 반환 타입

블록이 무엇을 반환하는지 구체적으로 지정하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="block_returns.trb"
# 블록이 값을 반환
def sum_transformed(numbers: Array<Integer>, &block: Proc<Integer, Integer>): Integer
  numbers.map { |n| block.call(n) }.sum
end

# 블록이 아무것도 반환하지 않음 (void)
def each_with_index(&block: Proc<[String, Integer], void>): void
  ["a", "b", "c"].each_with_index do |item, index|
    block.call(item, index)
  end
end

# 블록이 boolean을 반환 (필터링용)
def custom_select(items: Array<String>, &predicate: Proc<String, Boolean>): Array<String>
  items.select { |item| predicate.call(item) }
end

# 다른 반환 타입 사용하기
total = sum_transformed([1, 2, 3]) { |n| n * n }  # 1 + 4 + 9 = 14

each_with_index { |item, idx| puts "#{idx}: #{item}" }

long_strings = custom_select(["hi", "hello", "hey"]) { |s| s.length > 2 }
# long_strings: ["hello"]
```

## 모범 사례

1. **블록 타입을 명시적으로 지정**: 항상 블록 매개변수에 예상되는 타입을 어노테이션하세요.

2. **엄격한 인수 검사에는 람다 사용**: 람다는 인수 개수를 강제하고, Proc은 더 관대합니다.

3. **재사용성을 위해 제네릭 블록 선호**: 제네릭 블록은 타입 안전성을 유지하면서 모든 타입에서 작동합니다.

4. **저장된 블록에는 Proc 타입 사용**: 변수나 인스턴스 변수에 블록을 저장할 때 Proc 타입을 사용하세요.

5. **복잡한 블록 시그니처 문서화**: 블록이 많은 매개변수를 받거나 복잡한 타입을 가진 경우 주석을 추가하세요.

6. **부작용 블록에는 void 사용**: 블록이 부작용에만 사용될 때 반환 타입을 void로 표시하세요.

## 일반적인 패턴

### 콜백 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="callbacks.trb"
def fetch_data(url: String, on_success: Proc<String, void>, on_error: Proc<String, void>): void
  begin
    data = HTTP.get(url)
    on_success.call(data)
  rescue => e
    on_error.call(e.message)
  end
end

fetch_data(
  "https://api.example.com/data",
  ->(data: String) { puts "Success: #{data}" },
  ->(error: String) { puts "Error: #{error}" }
)
```

### 블록을 사용한 빌더 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="builder_block.trb"
class QueryBuilder
  def initialize()
    @conditions: Array<String> = []
  end

  def where(&block: Proc<QueryBuilder, void>): QueryBuilder
    block.call(self)
    self
  end

  def equals(field: String, value: String): void
    @conditions.push("#{field} = '#{value}'")
  end

  def build(): String
    "SELECT * FROM users WHERE #{@conditions.join(' AND ')}"
  end
end

query = QueryBuilder.new
query.where do |q|
  q.equals("name", "Alice")
  q.equals("active", "true")
end.build()
```

### 반복자 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/blocks_procs_lambdas_spec.rb" line={21} />

```trb title="iterator.trb"
def times(n: Integer, &block: Proc<Integer, void>): void
  (0...n).each { |i| block.call(i) }
end

def until_true(&block: Proc<Integer, Boolean>): Integer
  i = 0
  while !block.call(i)
    i += 1
  end
  i
end

times(5) { |i| puts "Iteration #{i}" }

result = until_true { |i| i > 10 }  # 11
```

## 요약

T-Ruby의 블록, Proc, 람다는 타입 안전성을 유지하면서 강력한 추상화를 제공합니다:

- **블록**은 `&block: Proc<Input, Output>`으로 타입을 지정합니다
- **다중 매개변수**는 튜플 구문을 사용합니다: `Proc<[Type1, Type2], Output>`
- **선택적 블록**은 `Proc<Input, Output>?`를 사용합니다
- **제네릭 블록**은 제네릭 매개변수를 통해 타입 정보를 보존합니다
- **고차 함수**는 타입이 지정된 proc을 생성하고 반환할 수 있습니다

적절한 타입 어노테이션을 통해 정적 타이핑의 안전성과 함께 Ruby 블록의 모든 유연성을 얻을 수 있습니다.
