---
slug: keyword-arguments-type-definitions
title: "T-Ruby에서 키워드 인자 다루기"
authors: [yhk1038]
tags: [tutorial, syntax, keyword-arguments]
---

T-Ruby를 처음 공개했을 때 가장 많이 받은 질문 중 하나가 **"키워드 인자는 어떻게 정의하나요?"** 였습니다. 이것이 바로 [Issue #19](https://github.com/aspect-build/t-ruby/issues/19)였고, 언어의 가장 중요한 설계 결정 중 하나가 되었습니다.

<!-- truncate -->

## 문제점: 문법 충돌

T-Ruby에서 타입 어노테이션은 콜론 문법을 사용합니다: `name: Type`. 그런데 Ruby의 키워드 인자도 콜론을 사용합니다: `name: value`. 이것이 근본적인 충돌을 일으킵니다.

이 T-Ruby 코드를 보세요:

```ruby
def foo(x: String, y: Integer = 10)
```

`x`가 키워드 인자인가요, 아니면 타입 어노테이션이 있는 위치 인자인가요? 초기 T-Ruby에서는 항상 **위치 인자**로 처리되었습니다 - `foo("hi", 20)`으로 호출했습니다.

하지만 `foo(x: "hi", y: 20)`처럼 호출하는 실제 키워드 인자가 필요하다면 어떻게 할까요?

## 해결책: 간단한 규칙

T-Ruby는 하나의 우아한 규칙으로 이 문제를 해결합니다: **변수명의 유무가 의미를 결정합니다**.

| 문법 | 의미 | 컴파일 결과 |
|------|------|-------------|
| `{ name: String }` | 키워드 인자 (구조분해) | `def foo(name:)` |
| `config: { host: String }` | Hash 리터럴 파라미터 | `def foo(config)` |
| `**opts: Type` | 전달용 이중 스플랫(double splat) | `def foo(**opts)` |

각 패턴을 살펴봅시다.

## 패턴 1: `{ }`를 사용한 키워드 인자

**변수명 없이** 중괄호를 사용하면, T-Ruby는 이를 키워드 인자 구조분해로 처리합니다:

```ruby
# T-Ruby
def greet({ name: String, prefix: String = "Hello" }): String
  "#{prefix}, #{name}!"
end

# 호출 방법
greet(name: "Alice")
greet(name: "Bob", prefix: "Hi")
```

이것은 다음과 같이 컴파일됩니다:

```ruby
# Ruby
def greet(name:, prefix: "Hello")
  "#{prefix}, #{name}!"
end
```

그리고 다음 RBS 시그니처를 생성합니다:

```rbs
def greet: (name: String, ?prefix: String) -> String
```

### 핵심 포인트

- 키워드 인자를 `{ }`로 감싸세요
- 각 인자에 타입을 지정합니다: `name: String`
- 기본값은 자연스럽게 작동합니다: `prefix: String = "Hello"`
- RBS의 `?`는 선택적 파라미터를 나타냅니다

## 패턴 2: 변수명이 있는 Hash 리터럴

중괄호 앞에 변수명을 추가하면, T-Ruby는 이를 Hash 파라미터로 처리합니다:

```ruby
# T-Ruby
def process(config: { host: String, port: Integer }): String
  "#{config[:host]}:#{config[:port]}"
end

# 호출 방법
process(config: { host: "localhost", port: 8080 })
```

이것은 다음과 같이 컴파일됩니다:

```ruby
# Ruby
def process(config)
  "#{config[:host]}:#{config[:port]}"
end
```

다음 경우에 이 패턴을 사용하세요:
- Hash 객체 전체를 전달하고 싶을 때
- `config[:key]` 문법으로 값에 접근해야 할 때
- Hash를 저장하거나 다른 메서드에 전달해야 할 때

## 패턴 3: `**`를 사용한 이중 스플랫(double splat)

임의의 키워드 인자를 수집하거나 다른 메서드로 전달할 때:

```ruby
# T-Ruby
def with_transaction(**config: DbConfig): String
  conn = connect_db(**config)
  "BEGIN; #{conn}; COMMIT;"
end
```

이것은 다음과 같이 컴파일됩니다:

```ruby
# Ruby
def with_transaction(**config)
  conn = connect_db(**config)
  "BEGIN; #{conn}; COMMIT;"
end
```

`**`가 유지되는 이유는 Ruby에서 `opts: Type`이 `def foo(opts:)`로 컴파일되기 때문입니다(`opts`라는 이름의 단일 키워드 인자). 이는 `def foo(**opts)`(모든 키워드 인자 수집)와 다릅니다.

## 위치 인자와 키워드 인자 혼합

위치 인자와 키워드 인자를 조합할 수 있습니다:

```ruby
# T-Ruby
def mixed(id: Integer, { name: String, age: Integer = 0 }): String
  "#{id}: #{name} (#{age})"
end

# 호출 방법
mixed(1, name: "Alice")
mixed(2, name: "Bob", age: 30)
```

다음과 같이 컴파일됩니다:

```ruby
# Ruby
def mixed(id, name:, age: 0)
  "#{id}: #{name} (#{age})"
end
```

## Interface 사용하기

복잡한 설정의 경우, interface를 정의하고 참조하세요:

```ruby
# Interface 정의
interface ConnectionOptions
  host: String
  port?: Integer
  timeout?: Integer
end

# 구조분해 + interface 참조 - 필드명과 기본값을 명시
def connect({ host:, port: 8080, timeout: 30 }: ConnectionOptions): String
  "#{host}:#{port}"
end

# 호출 방법
connect(host: "localhost")
connect(host: "localhost", port: 3000)

# 이중 스플랫 - 키워드 인자 전달용
def forward(**opts: ConnectionOptions): String
  connect(**opts)
end
```

interface를 참조할 때는 구조분해 패턴에서 필드명을 명시적으로 나열해야 합니다. 기본값은 interface가 아닌 함수 정의에서 지정합니다.

## 완전한 예제

여러 패턴을 조합한 실제 예제입니다:

```ruby
# T-Ruby
class ApiClient
  def initialize({ base_url: String, timeout: Integer = 30 })
    @base_url = base_url
    @timeout = timeout
  end

  def get({ path: String }): String
    "#{@base_url}#{path}"
  end

  def post(path: String, { body: String, headers: Hash = {} }): String
    "POST #{@base_url}#{path}"
  end
end

# 사용법
client = ApiClient.new(base_url: "https://api.example.com")
client.get(path: "/users")
client.post("/users", body: "{}", headers: { "Content-Type" => "application/json" })
```

이것은 다음과 같이 컴파일됩니다:

```ruby
# Ruby
class ApiClient
  def initialize(base_url:, timeout: 30)
    @base_url = base_url
    @timeout = timeout
  end

  def get(path:)
    "#{@base_url}#{path}"
  end

  def post(path, body:, headers: {})
    "POST #{@base_url}#{path}"
  end
end
```

## 빠른 참조

| 원하는 것 | T-Ruby 문법 | Ruby 출력 |
|-----------|-------------|-----------|
| 필수 키워드 인자 | `{ name: String }` | `name:` |
| 선택 키워드 인자 | `{ name: String = "default" }` | `name: "default"` |
| 여러 키워드 인자 | `{ a: String, b: Integer }` | `a:, b:` |
| Hash 파라미터 | `opts: { a: String }` | `opts` |
| 이중 스플랫 | `**opts: Type` | `**opts` |
| 혼합 | `id: Integer, { name: String }` | `id, name:` |

## 설계 히스토리

T-Ruby를 처음 발표했을 때, 초기 문법은 키워드 인자에 `**{}`를 사용했습니다:

```ruby
# 초기 설계 (기각됨)
def greet(**{ name: String, prefix: String = "Hello" }): String
```

커뮤니티 피드백에서 이것이 너무 복잡하다는 의견이 있었습니다. 여러 대안을 탐구했습니다:

| 대안 | 예시 | 결과 |
|------|------|------|
| 세미콜론 | `; name: String` | 기각 (가독성 더 나쁨) |
| 이중 콜론 | `name:: String` | 기각 (`::` Ruby 상수와 충돌) |
| `named` 키워드 | `named name: String` | 검토함 |
| **중괄호만** | `{ name: String }` | **채택** |

최종 설계는 간단한 규칙을 사용합니다: 변수명의 유무가 의미를 결정합니다. 이는 새로운 키워드 없이도 깔끔하고 직관적인 문법을 만들어냅니다.

## 요약

T-Ruby의 키워드 인자 문법은 직관적으로 설계되었습니다:

1. **`{ }`로 감싸기** - 키워드 인자용
2. **변수명 추가** - Hash 파라미터용
3. **`**` 사용** - 이중 스플랫 전달용

이 간단한 규칙이 타입 어노테이션과 Ruby 키워드 문법 사이의 혼란을 제거하여, TypeScript 스타일의 타입 안전성과 Ruby의 표현력 있는 키워드 인자의 장점을 모두 제공합니다.

---

*키워드 인자 지원은 T-Ruby v0.0.41 이상에서 사용 가능합니다. 사용해보시고 의견을 알려주세요!*
