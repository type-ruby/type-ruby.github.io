---
sidebar_position: 2
title: 선택적 & 나머지 매개변수
description: 선택적 매개변수와 나머지 인수
---

<DocsBadge />


# 선택적 & 나머지 매개변수

Ruby 함수는 종종 매개변수 목록에 유연성이 필요합니다. T-Ruby는 완전한 타입 안전성을 유지하면서 선택적 매개변수(기본값 포함)와 나머지 매개변수(가변 길이 인수 목록)를 모두 지원합니다.

## 기본값이 있는 선택적 매개변수

선택적 매개변수는 인수가 제공되지 않을 때 사용되는 기본값을 가집니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={25} />

```trb title="optional.trb"
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

def create_user(name: String, role: String = "user", active: Boolean = true): User
  User.new(name: name, role: role, active: active)
end

# 다른 수의 인수로 호출
puts greet("Alice")                    # "Hello, Alice!"
puts greet("Bob", "Hi")                # "Hi, Bob!"

user1 = create_user("Alice")                           # 기본값 사용: role="user", active=true
user2 = create_user("Bob", "admin")                    # 기본값 사용: active=true
user3 = create_user("Charlie", "moderator", false)     # 기본값 사용 안 함
```

타입 어노테이션은 매개변수가 제공되든 기본값을 사용하든 적용됩니다.

## Nilable 타입의 선택적 매개변수

때로는 "제공되지 않음"과 "명시적으로 nil"을 구분하고 싶을 수 있습니다. nilable 타입을 사용하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={36} />

```trb title="nilable_optional.trb"
def format_title(text: String, prefix: String? = nil): String
  if prefix
    "#{prefix}: #{text}"
  else
    text
  end
end

def send_email(to: String, subject: String, cc: String? = nil): void
  email = Email.new(to: to, subject: subject)
  email.cc = cc if cc
  email.send
end

# nilable 선택적 매개변수 사용
title1 = format_title("Introduction")              # "Introduction"
title2 = format_title("Chapter 1", "Book")        # "Book: Chapter 1"
title3 = format_title("Epilogue", nil)            # "Epilogue"

send_email("alice@example.com", "Hello")
send_email("bob@example.com", "Meeting", "team@example.com")
```

## 나머지 매개변수

나머지 매개변수는 여러 인수를 배열로 수집합니다. 배열의 요소 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={47} />

```trb title="rest.trb"
def sum(*numbers: Array<Integer>): Integer
  numbers.reduce(0, :+)
end

def concat_strings(*strings: Array<String>): String
  strings.join(" ")
end

def log_messages(level: String, *messages: Array<String>): void
  messages.each do |msg|
    puts "[#{level}] #{msg}"
  end
end

# 가변 인수로 호출
puts sum(1, 2, 3, 4, 5)                    # 15
puts sum(10)                                # 10
puts sum()                                  # 0

result = concat_strings("Hello", "world", "from", "T-Ruby")
# "Hello world from T-Ruby"

log_messages("INFO", "App started", "Database connected", "Ready")
# [INFO] App started
# [INFO] Database connected
# [INFO] Ready
```

타입 어노테이션 `*numbers: Array<Integer>`는 "배열로 수집되는 0개 이상의 Integer 인수"를 의미합니다.

## 선택적 매개변수와 나머지 매개변수 조합

선택적 매개변수와 나머지 매개변수를 조합할 수 있지만, 나머지 매개변수는 선택적 매개변수 뒤에 와야 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={58} />

```trb title="combined.trb"
def create_team(
  name: String,
  leader: String,
  active: Boolean = true,
  *members: Array<String>
): Team
  Team.new(
    name: name,
    leader: leader,
    active: active,
    members: members
  )
end

# 다양한 호출 방법
team1 = create_team("Alpha", "Alice")
# name="Alpha", leader="Alice", active=true, members=[]

team2 = create_team("Beta", "Bob", false)
# name="Beta", leader="Bob", active=false, members=[]

team3 = create_team("Gamma", "Charlie", true, "Dave", "Eve", "Frank")
# name="Gamma", leader="Charlie", active=true, members=["Dave", "Eve", "Frank"]
```

## 키워드 인수

T-Ruby에서 키워드 인수는 `**{ }` 문법을 사용하여 정의합니다. 위치 인수와 달리 호출 시 이름으로 인자를 전달합니다.

:::info 위치 인수 vs 키워드 인수

| 정의 | 호출 방식 |
|------|----------|
| `(x: String, y: Integer)` | `foo("hi", 10)` - 위치 인수 |
| `(**{ x: String, y: Integer })` | `foo(x: "hi", y: 10)` - 키워드 인수 |

:::

### 인라인 타입 방식

타입을 `**{ }` 안에 직접 정의합니다. 기본값은 `= value` 형태로 지정합니다:

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={69} /> */}

```trb title="keyword_inline.trb"
def create_post(**{
  title: String,
  content: String,
  published: Boolean = false,
  tags: Array<String> = []
}): Post
  Post.new(
    title: title,
    content: content,
    published: published,
    tags: tags
  )
end

# 키워드 인수로 호출 (순서는 상관없음)
post1 = create_post(
  title: "My First Post",
  content: "Hello world"
)

post2 = create_post(
  content: "Another post",
  title: "Second Post",
  published: true,
  tags: ["ruby", "programming"]
)
```

### Interface 참조 방식

별도의 interface를 정의하고 참조합니다. 기본값은 Ruby 스타일 `: value` (등호 없음)로 지정합니다:

```trb title="keyword_interface.trb"
interface PostOptions
  title: String
  content: String
  published?: Boolean    # ? 로 optional 표시
  tags?: Array<String>
end

def create_post(**{ title:, content:, published: false, tags: [] }: PostOptions): Post
  Post.new(
    title: title,
    content: content,
    published: published,
    tags: tags
  )
end

# 호출 방식은 동일
post = create_post(title: "Hello", content: "World")
```

:::tip 인라인 vs Interface 선택 기준

| 항목 | 인라인 타입 | interface 참조 |
|------|------------|---------------|
| 타입 정의 위치 | `**{ }` 안에 직접 | 별도 interface |
| 기본값 문법 | `= value` | `: value` (등호 없음) |
| Optional 표시 | 기본값으로 암시 | `?` 접미사 |
| 재사용성 | 단일 메서드 | 여러 메서드에서 공유 |

**권장**: 단일 메서드에서만 사용하면 인라인, 여러 곳에서 재사용하면 interface
:::

## 키워드 나머지 매개변수

이중 스플랫 `**`를 사용하여 키워드 인수를 해시로 수집합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={80} />

```trb title="keyword_rest.trb"
def build_query(table: String, **conditions: Hash<Symbol, String | Integer>): String
  where_clause = conditions.map { |k, v| "#{k} = #{v}" }.join(" AND ")
  "SELECT * FROM #{table} WHERE #{where_clause}"
end

def create_config(env: String, **options: Hash<Symbol, String | Integer | Boolean>): Config
  Config.new(environment: env, options: options)
end

# 키워드 나머지 매개변수 사용
query1 = build_query(table: "users", id: 123, active: 1)
# "SELECT * FROM users WHERE id = 123 AND active = 1"

query2 = build_query(table: "posts", author_id: 5, published: 1, category: "tech")
# "SELECT * FROM posts WHERE author_id = 5 AND published = 1 AND category = tech"

config = create_config(
  env: "production",
  debug: false,
  timeout: 30,
  host: "example.com"
)
```

타입 어노테이션 `**conditions: Hash<Symbol, String | Integer>`는 "해시로 수집되는 String 또는 Integer 값을 가진 0개 이상의 키워드 인수"를 의미합니다.

## 필수 키워드 인수

기본값이 없는 키워드 인수는 필수입니다:

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={91} /> */}

```trb title="required_kwargs.trb"
def register_user(**{
  email: String,
  password: String,
  name: String = "Anonymous",
  age: Integer
}): User
  # email, password, age는 필수
  # name은 기본값이 있는 선택적 매개변수
  User.new(email: email, password: password, name: name, age: age)
end

# email, password, age는 반드시 제공해야 함
user = register_user(
  email: "alice@example.com",
  password: "secret123",
  age: 25
)

# name은 선택적으로 재정의 가능
user2 = register_user(
  email: "bob@example.com",
  password: "secret456",
  name: "Bob",
  age: 30
)
```

## 위치, 선택적, 나머지 매개변수 혼합

모든 매개변수 타입을 조합할 수 있지만, 다음 순서를 따라야 합니다:
1. 필수 위치 매개변수
2. 선택적 위치 매개변수
3. 나머지 매개변수 (`*args`)
4. 키워드 인수 (`**{ ... }`)
5. 키워드 나머지 매개변수 (`**kwargs`)

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={102} /> */}

```trb title="all_types.trb"
def complex_function(
  required_pos: String,                    # 1. 필수 위치
  optional_pos: Integer = 0,               # 2. 선택적 위치
  *rest_args: Array<String>,               # 3. 나머지 매개변수
  **{
    required_kw: Boolean,                  # 4. 필수 키워드
    optional_kw: String = "default"        # 5. 선택적 키워드
  },
  **rest_kwargs: Hash<Symbol, String | Integer>  # 6. 키워드 나머지
): Hash<String, String | Integer | Boolean>
  {
    "required_pos" => required_pos,
    "optional_pos" => optional_pos,
    "rest_args" => rest_args.join(","),
    "required_kw" => required_kw,
    "optional_kw" => optional_kw,
    "rest_kwargs" => rest_kwargs
  }
end

# 예제 호출
result = complex_function(
  "hello",                    # required_pos
  42,                         # optional_pos
  "a", "b", "c",             # rest_args
  required_kw: true,          # required_kw
  optional_kw: "custom",      # optional_kw
  extra1: "value1",           # rest_kwargs
  extra2: 123                 # rest_kwargs
)
```

## 실전 예제: HTTP 요청 빌더

다양한 매개변수 타입을 보여주는 실제 예제입니다:

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={113} /> */}

```trb title="http_builder.trb"
class HTTPRequestBuilder
  # 필수 위치 매개변수만
  def get(url: String): Response
    make_request("GET", url, nil, {})
  end

  # 필수 + 선택적 위치 매개변수
  def post(url: String, body: String, content_type: String = "application/json"): Response
    headers = { "Content-Type" => content_type }
    make_request("POST", url, body, headers)
  end

  # 나머지 매개변수
  def delete(*urls: Array<String>): Array<Response>
    urls.map { |url| make_request("DELETE", url, nil, {}) }
  end

  # 키워드 인수 (인라인 타입)
  def request(**{
    method: String,
    url: String,
    body: String? = nil,
    timeout: Integer = 30,
    retry_count: Integer = 3
  }): Response
    make_request(method, url, body, {}, timeout, retry_count)
  end

  # 위치 매개변수 + 키워드 나머지
  def custom_request(
    method: String,
    url: String,
    **headers: Hash<Symbol, String>
  ): Response
    make_request(method, url, nil, headers)
  end

  private

  def make_request(
    method: String,
    url: String,
    body: String?,
    headers: Hash<String, String>,
    timeout: Integer = 30,
    retry_count: Integer = 3
  ): Response
    # 구현 세부사항...
    Response.new
  end
end

# 빌더 사용
builder = HTTPRequestBuilder.new

# 간단한 GET (위치 인수)
response1 = builder.get("https://api.example.com/users")

# 커스텀 content type으로 POST (위치 인수)
response2 = builder.post(
  "https://api.example.com/users",
  '{"name": "Alice"}',
  "application/json"
)

# 여러 리소스 DELETE (나머지 매개변수)
responses = builder.delete(
  "https://api.example.com/users/1",
  "https://api.example.com/users/2",
  "https://api.example.com/users/3"
)

# 커스텀 옵션으로 요청 (키워드 인수)
response3 = builder.request(
  method: "PATCH",
  url: "https://api.example.com/users/1",
  body: '{"age": 31}',
  timeout: 60,
  retry_count: 5
)

# 커스텀 헤더로 요청 (위치 + 키워드 나머지)
response4 = builder.custom_request(
  "GET",
  "https://api.example.com/protected",
  Authorization: "Bearer token123",
  Accept: "application/json",
  User_Agent: "MyApp/1.0"
)
```

## 실전 예제: 로거

유연한 매개변수 처리를 보여주는 또 다른 예제입니다:

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={124} /> */}

```trb title="logger.trb"
class Logger
  # 선택적 레벨이 있는 간단한 메시지 (위치 인수)
  def log(message: String, level: String = "INFO"): void
    puts "[#{level}] #{message}"
  end

  # 나머지 매개변수로 여러 메시지
  def log_many(level: String, *messages: Array<String>): void
    messages.each { |msg| log(msg, level) }
  end

  # 위치 인수 + 키워드 나머지로 구조화된 로깅
  def log_structured(message: String, **metadata: Hash<Symbol, String | Integer | Boolean>): void
    meta_str = metadata.map { |k, v| "#{k}=#{v}" }.join(" ")
    puts "[INFO] #{message} | #{meta_str}"
  end

  # 나머지 매개변수 + 키워드 나머지
  def debug(*messages: Array<String>, **context: Hash<Symbol, String | Integer>): void
    messages.each do |msg|
      ctx_str = context.empty? ? "" : " (#{context.map { |k, v| "#{k}=#{v}" }.join(", ")})"
      puts "[DEBUG] #{msg}#{ctx_str}"
    end
  end
end

# 로거 사용
logger = Logger.new

# 간단한 로깅 (위치 인수)
logger.log("Application started")
logger.log("Warning: Low memory", "WARN")

# 여러 메시지 (나머지 매개변수)
logger.log_many("ERROR", "Database connection failed", "Retrying...", "Giving up")

# 구조화된 로깅 (위치 + 키워드 나머지)
logger.log_structured(
  "User logged in",
  user_id: 123,
  ip: "192.168.1.1",
  success: true
)

# 컨텍스트와 함께 디버그 (나머지 + 키워드 나머지)
logger.debug(
  "Processing request",
  "Validating data",
  "Saving to database",
  request_id: 789,
  user_id: 123
)
```

## 모범 사례

1. **진정으로 선택적인 동작에 기본값 사용**: 매개변수가 선택적인 것이 의미 있을 때만 기본값을 추가하세요.

2. **매개변수를 논리적으로 정렬**: 필수 매개변수를 먼저, 그 다음 선택적 매개변수, 그 다음 나머지 매개변수를 배치하세요.

3. **명확성을 위해 키워드 인수 선호**: 여러 선택적 매개변수가 있을 때, 키워드 인수가 호출을 더 읽기 쉽게 만듭니다.

4. **컬렉션에는 나머지 매개변수 사용**: 가변 개수의 유사한 항목을 기대할 때, 나머지 매개변수가 배열 매개변수보다 깔끔합니다.

5. **나머지 매개변수에 적절한 타입 지정**: 문자열만 기대한다면 `*args: String | Integer`보다 `*args: String`이 더 좋습니다.

6. **복잡한 시그니처 문서화**: 많은 매개변수 타입을 조합할 때, 사용법을 설명하는 주석을 추가하세요.

## 일반적인 패턴

### 기본값이 있는 빌더 메서드 (키워드 인수)

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={135} /> */}

```trb title="builder_pattern.trb"
def build_email(**{
  to: String,
  subject: String,
  from: String = "noreply@example.com",
  reply_to: String? = nil,
  cc: Array<String> = [],
  bcc: Array<String> = []
}): Email
  Email.new(to, subject, from, reply_to, cc, bcc)
end

# 키워드 인수로 호출
email = build_email(to: "alice@example.com", subject: "Hello")
```

### 가변 팩토리 함수 (나머지 + 키워드 인수)

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={146} /> */}

```trb title="factory.trb"
def create_users(*names: Array<String>, **{ role: String = "user" }): Array<User>
  names.map { |name| User.new(name: name, role: role) }
end

users = create_users("Alice", "Bob", "Charlie", role: "admin")
```

### 설정 병합 (위치 + 키워드 나머지)

{/* TODO: ExampleBadge 활성화 - 파서 구현 후 */}
{/* <ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/optional_rest_parameters_spec.rb" line={157} /> */}

```trb title="config.trb"
def merge_config(base: Hash<String, String>, **overrides: Hash<Symbol, String>): Hash<String, String>
  base.merge(overrides)
end

config = merge_config(
  { "host" => "localhost", "port" => "3000" },
  port: "8080",
  ssl: "true"
)
```

## 요약

선택적 및 나머지 매개변수는 타입 안전성을 유지하면서 함수에 유연성을 제공합니다:

| 문법 | 설명 | 호출 예시 |
|------|------|----------|
| `(x: Type)` | 위치 인수 | `foo("hi")` |
| `(x: Type = default)` | 선택적 위치 인수 | `foo()` 또는 `foo("hi")` |
| `(*args: Array<Type>)` | 나머지 매개변수 | `foo("a", "b", "c")` |
| `(**{ x: Type })` | 키워드 인수 | `foo(x: "hi")` |
| `(**kwargs: Hash<Symbol, Type>)` | 키워드 나머지 | `foo(a: 1, b: 2)` |

**핵심 포인트:**
- **위치 인수** `(x: Type)`: 순서대로 전달
- **키워드 인수** `(**{ x: Type })`: 이름으로 전달
- **키워드 나머지** `(**kwargs: Hash<Symbol, Type>)`: 임의의 키워드 인수를 해시로 수집
- T-Ruby는 모든 매개변수 변형에 대해 타입 안전성을 보장합니다

이 패턴들을 마스터하여 사용하기 편리한 유연하고 타입 안전한 API를 작성하세요.
