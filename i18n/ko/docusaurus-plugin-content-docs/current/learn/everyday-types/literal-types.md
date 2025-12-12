---
sidebar_position: 5
title: 리터럴 타입
description: 리터럴 값을 타입으로 사용하기
---

<DocsBadge />


# 리터럴 타입

리터럴 타입을 사용하면 넓은 범주가 아닌 정확한 값을 타입으로 지정할 수 있습니다. 변수가 `String`이라고 말하는 대신 특정 문자열 `"active"`여야 한다고 말할 수 있습니다. 이 장에서는 리터럴 타입을 사용하여 더 정밀한 타입 정의를 만드는 방법을 배웁니다.

## 리터럴 타입이란?

리터럴 타입은 단일의 특정 값을 나타내는 타입입니다. 모든 문자열을 받아들이는 대신 하나의 특정 문자열만 받아들입니다. 모든 정수 대신 하나의 특정 정수만 받아들입니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={25} />

```trb title="literal_basics.trb"
# 넓은 타입 - 모든 문자열
status: String = "active"

# 리터럴 타입 - "active" 문자열만
status: "active" = "active"

# 이것은 오류가 됩니다:
# status: "active" = "pending"  # 오류: "pending"은 "active"가 아님
```

## 문자열 리터럴 타입

문자열 리터럴은 가장 일반적인 리터럴 타입입니다:

### 단일 문자열 리터럴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={36} />

```trb title="single_literal.trb"
# "production"만 될 수 있는 변수
environment: "production" = "production"

# 정확히 "success"를 반환하는 메서드
def get_status(): "success"
  "success"
end

result: "success" = get_status()
```

### 문자열 리터럴의 Union

더 일반적으로 문자열 리터럴의 union을 사용하여 제한된 유효 값 집합을 나타냅니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={47} />

```trb title="string_literal_union.trb"
# 세 개의 특정 문자열 중 하나가 될 수 있음
def set_mode(mode: "development" | "staging" | "production")
  puts "모드 설정: #{mode}"
end

# 유효한 호출
set_mode("development")
set_mode("staging")
set_mode("production")

# 이것은 오류가 됩니다:
# set_mode("testing")  # 오류: "testing"은 union에 없음
```

### 실용적인 문자열 리터럴 예제

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={58} />

```trb title="status_system.trb"
# Status는 이 정확한 문자열 중 하나만 될 수 있음
type Status = "pending" | "active" | "suspended" | "cancelled"

class Account
  def initialize()
    @status: Status = "pending"
  end

  def set_status(new_status: Status)
    @status = new_status
  end

  def get_status(): Status
    @status
  end

  def is_active(): Bool
    @status == "active"
  end

  def can_use(): Bool
    @status == "active" || @status == "pending"
  end
end

account = Account.new()
account.set_status("active")  # 유효함
# account.set_status("invalid")  # 타입 오류가 됨
```

## 심볼 리터럴 타입

심볼도 리터럴 타입으로 사용할 수 있습니다:

### 심볼 리터럴 Union

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={69} />

```trb title="symbol_literals.trb"
# 이 특정 심볼 중 하나가 될 수 있음
def handle_event(event: :click | :hover | :focus)
  case event
  when :click
    puts "클릭됨!"
  when :hover
    puts "호버 중"
  when :focus
    puts "포커스됨"
  end
end

# 유효한 호출
handle_event(:click)
handle_event(:hover)

# 이것은 오류가 됩니다:
# handle_event(:blur)  # 오류: :blur는 union에 없음
```

### 상태 기계에 심볼 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={80} />

```trb title="state_machine.trb"
type State = :idle | :loading | :success | :error

class DataLoader
  def initialize()
    @state: State = :idle
    @data: String | nil = nil
    @error: String | nil = nil
  end

  def get_state(): State
    @state
  end

  def start_loading()
    @state = :loading
    @data = nil
    @error = nil
  end

  def complete_success(data: String)
    @state = :success
    @data = data
    @error = nil
  end

  def complete_error(error: String)
    @state = :error
    @data = nil
    @error = error
  end

  def reset()
    @state = :idle
    @data = nil
    @error = nil
  end

  def can_load(): Bool
    @state == :idle || @state == :error
  end
end

loader = DataLoader.new()
loader.start_loading()
loader.complete_success("data")
```

## 정수 리터럴 타입

정수 리터럴은 특정 숫자를 나타냅니다:

### 단일 정수 리터럴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={91} />

```trb title="integer_literal.trb"
# 숫자 200만 될 수 있음
http_ok: 200 = 200

# 항상 0을 반환하는 메서드
def get_zero(): 0
  0
end
```

### 정수 리터럴 Union

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={102} />

```trb title="http_status.trb"
# HTTP 상태 코드
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500

def handle_response(status: HttpStatus): String
  case status
  when 200
    "OK"
  when 201
    "Created"
  when 400
    "Bad Request"
  when 401
    "Unauthorized"
  when 403
    "Forbidden"
  when 404
    "Not Found"
  when 500
    "Server Error"
  else
    "Unknown"
  end
end

message: String = handle_response(200)  # "OK"
# handle_response(301)  # 타입 오류가 됨
```

## 부울 리터럴

부울 리터럴은 단순히 `true`와 `false`입니다:

### True/False 리터럴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={113} />

```trb title="boolean_literals.trb"
# true만 될 수 있는 변수
always_true: true = true

# false만 될 수 있는 변수
always_false: false = false

# 항상 true를 반환하는 메서드
def is_valid(): true
  true
end
```

### 부울 리터럴 vs Bool 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={124} />

```trb title="bool_vs_literal.trb"
# Bool 타입 - true 또는 false가 될 수 있음
flag: Bool = true  # false도 가능

# true 리터럴 - true만 될 수 있음
enabled: true = true  # false가 될 수 없음

# false 리터럴 - false만 될 수 있음
disabled: false = false  # true가 될 수 없음

# Bool은 (true | false)와 동일함
value: true | false = true  # Bool과 같음
```

## 리터럴 타입 결합하기

다양한 종류의 리터럴을 union으로 혼합할 수 있습니다:

### 혼합 리터럴 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={135} />

```trb title="mixed_literals.trb"
# 문자열과 정수 리터럴의 혼합
type ExitCode = "success" | "error" | 0 | 1

def exit_program(code: ExitCode): String
  if code == "success" || code == 0
    "성공적으로 종료"
  else
    "오류와 함께 종료"
  end
end

# 심볼과 문자열의 혼합
type Identifier = :id | :name | "index" | "key"
```

### 더 넓은 타입과의 리터럴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={146} />

```trb title="literals_with_types.trb"
# 특정 값 또는 모든 문자열
type ConfigValue = "auto" | "manual" | String

def set_config(value: ConfigValue)
  if value == "auto"
    puts "자동 모드"
  elsif value == "manual"
    puts "수동 모드"
  else
    puts "사용자 지정 값: #{value}"
  end
end

set_config("auto")  # "자동 모드"
set_config("manual")  # "수동 모드"
set_config("custom-value")  # "사용자 지정 값: custom-value"
```

## 실용적 예제

### 예제 1: 로그 레벨

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={157} />

```trb title="log_levels.trb"
type LogLevel = "debug" | "info" | "warn" | "error"

class Logger
  def initialize()
    @level: LogLevel = "info"
  end

  def set_level(level: LogLevel)
    @level = level
  end

  def log(level: LogLevel, message: String)
    return unless should_log?(level)

    prefix = case level
    when "debug"
      "[DEBUG]"
    when "info"
      "[INFO]"
    when "warn"
      "[WARN]"
    when "error"
      "[ERROR]"
    end

    puts "#{prefix} #{message}"
  end

  def debug(message: String)
    log("debug", message)
  end

  def info(message: String)
    log("info", message)
  end

  def warn(message: String)
    log("warn", message)
  end

  def error(message: String)
    log("error", message)
  end

  private

  def should_log?(level: LogLevel): Bool
    level_priority = get_priority(level)
    current_priority = get_priority(@level)

    level_priority >= current_priority
  end

  def get_priority(level: LogLevel): Integer
    case level
    when "debug"
      0
    when "info"
      1
    when "warn"
      2
    when "error"
      3
    else
      0
    end
  end
end

logger = Logger.new()
logger.set_level("warn")
logger.debug("이것은 표시되지 않음")  # 레벨이 너무 낮음
logger.error("이것은 표시됨")   # 레벨이 충분히 높음
```

### 예제 2: 방향 시스템

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={168} />

```trb title="directions.trb"
type Direction = "north" | "south" | "east" | "west"

class Position
  def initialize(x: Integer, y: Integer)
    @x: Integer = x
    @y: Integer = y
  end

  def move(direction: Direction): Position
    case direction
    when "north"
      Position.new(@x, @y + 1)
    when "south"
      Position.new(@x, @y - 1)
    when "east"
      Position.new(@x + 1, @y)
    when "west"
      Position.new(@x - 1, @y)
    end
  end

  def get_neighbor(direction: Direction): Hash<Symbol, Integer>
    new_pos = move(direction)
    { x: new_pos.x, y: new_pos.y }
  end

  def to_s(): String
    "(#{@x}, #{@y})"
  end

  attr_reader :x, :y
end

pos = Position.new(0, 0)
north = pos.move("north")  # (0, 1)
east = pos.move("east")    # (1, 0)
```

### 예제 3: API 응답 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={179} />

```trb title="api_response.trb"
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
type ResponseStatus = "success" | "error" | "loading"

class ApiClient
  def request(
    method: HttpMethod,
    path: String
  ): Hash<Symbol, String | Integer>
    # 요청 시뮬레이션
    status_code = case method
    when "GET"
      200
    when "POST"
      201
    when "PUT", "PATCH"
      200
    when "DELETE"
      204
    else
      400
    end

    {
      method: method,
      path: path,
      status: status_code
    }
  end

  def get(path: String)
    request("GET", path)
  end

  def post(path: String)
    request("POST", path)
  end

  def put(path: String)
    request("PUT", path)
  end

  def delete(path: String)
    request("DELETE", path)
  end
end

client = ApiClient.new()
response = client.get("/users")
```

### 예제 4: 리터럴 타입을 사용한 설정

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={190} />

```trb title="config_literals.trb"
type Environment = "development" | "test" | "staging" | "production"
type LogFormat = "json" | "text" | "colored"
type CacheStrategy = "memory" | "redis" | "none"

class AppConfig
  def initialize()
    @environment: Environment = "development"
    @log_format: LogFormat = "colored"
    @cache_strategy: CacheStrategy = "memory"
    @debug: Bool = false
  end

  def set_environment(env: Environment)
    @environment = env

    # 환경에 따른 자동 구성
    case env
    when "development"
      @debug = true
      @log_format = "colored"
      @cache_strategy = "memory"
    when "test"
      @debug = true
      @log_format = "text"
      @cache_strategy = "none"
    when "staging"
      @debug = false
      @log_format = "json"
      @cache_strategy = "redis"
    when "production"
      @debug = false
      @log_format = "json"
      @cache_strategy = "redis"
    end
  end

  def set_log_format(format: LogFormat)
    @log_format = format
  end

  def set_cache_strategy(strategy: CacheStrategy)
    @cache_strategy = strategy
  end

  def get_config(): Hash<Symbol, String | Bool>
    {
      environment: @environment,
      log_format: @log_format,
      cache_strategy: @cache_strategy,
      debug: @debug
    }
  end

  def is_production(): Bool
    @environment == "production"
  end

  def is_development(): Bool
    @environment == "development"
  end
end

config = AppConfig.new()
config.set_environment("production")
settings = config.get_config()
```

## 리터럴 타입의 장점

### 1. 컴파일 시간 안전성

리터럴 타입은 런타임 대신 트랜스파일 시간에 오류를 잡습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={201} />

```trb title="compile_safety.trb"
type Status = "active" | "inactive"

def set_status(status: Status)
  # 구현
end

# 이것은 트랜스파일 시간에 실패합니다:
# set_status("unknown")  # 오류!

# 이것은 유효합니다:
set_status("active")
```

### 2. 더 나은 문서화

리터럴 타입은 인라인 문서화 역할을 합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={212} />

```trb title="documentation.trb"
# 명확함 - 어떤 값이 유효한지 알 수 있음
def set_priority(priority: "low" | "medium" | "high")
  # ...
end

# 피해야 함 - 너무 개방적
def set_priority(priority: String)
  # 어떤 문자열이 유효한지? 문서를 확인해야 함
end
```

### 3. 완전성 검사

타입 검사기가 모든 케이스를 처리했는지 확인할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={223} />

```trb title="exhaustiveness.trb"
type Color = "red" | "green" | "blue"

def describe_color(color: Color): String
  case color
  when "red"
    "빨간색"
  when "green"
    "초록색"
  when "blue"
    "파란색"
  # 케이스를 놓치면 타입 검사기가 경고할 수 있음
  end
end
```

## 일반적인 패턴

### 패턴 1: 명령 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={234} />

```trb title="commands.trb"
type Command = "start" | "stop" | "restart" | "status"

def execute_command(cmd: Command): String
  case cmd
  when "start"
    "서비스 시작 중..."
  when "stop"
    "서비스 중지 중..."
  when "restart"
    "서비스 재시작 중..."
  when "status"
    "서비스 실행 중"
  end
end
```

### 패턴 2: 결과 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={245} />

```trb title="results.trb"
type Result = "ok" | "error"

def process(): Hash<Symbol, Result | String>
  success = true  # 작업 시뮬레이션

  if success
    { status: "ok", message: "성공!" }
  else
    { status: "error", message: "실패!" }
  end
end
```

### 패턴 3: 열거형 같은 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={256} />

```trb title="enums.trb"
type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
type Weekend = "saturday" | "sunday"
type Day = Weekday | Weekend

def is_weekend(day: Day): Bool
  day == "saturday" || day == "sunday"
end

def is_weekday(day: Day): Bool
  !is_weekend(day)
end
```

## 모범 사례

### 1. 고정된 집합에 리터럴 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={267} />

```trb title="fixed_sets.trb"
# 좋음 - 명확하고 고정된 값 집합
type Size = "small" | "medium" | "large"

# 피해야 함 - 너무 개방적
type Size = String
```

### 2. 타입 별칭과 결합

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={278} />

```trb title="type_aliases.trb"
# 한 번 정의하고 어디서나 사용
type Status = "pending" | "approved" | "rejected"
type Priority = "low" | "medium" | "high"

class Task
  def initialize()
    @status: Status = "pending"
    @priority: Priority = "medium"
  end

  def set_status(status: Status)
    @status = status
  end

  def set_priority(priority: Priority)
    @priority = priority
  end
end
```

### 3. 집합을 관리 가능하게 유지

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/literal_types_spec.rb" line={289} />

```trb title="manageable_sets.trb"
# 좋음 - 합리적인 옵션 수
type Theme = "light" | "dark" | "auto"

# 피해야 함 - 리터럴이 너무 많으면 타입이 다루기 어려워짐
# type Country = "USA" | "Canada" | "Mexico" | ... (200개 이상의 국가)
# 검증과 함께 String을 사용하는 것이 나음
```

## 요약

T-Ruby의 리터럴 타입을 사용하면 정확한 값을 타입으로 지정할 수 있습니다:

- **문자열 리터럴**: `"active" | "pending" | "cancelled"`
- **심볼 리터럴**: `:start | :stop | :restart`
- **정수 리터럴**: `200 | 404 | 500`
- **부울 리터럴**: `true`와 `false`

리터럴 타입의 장점:

- **타입 안전성**: 트랜스파일 시간에 유효하지 않은 값 잡기
- **문서화**: 유효한 값을 명시적으로 만들기
- **완전성**: 모든 케이스가 처리되었는지 확인
- **명확성**: 함수 매개변수에 대한 명확한 계약

리터럴 타입은 상태 기계, 설정 옵션, API 응답, 그리고 고정된 유효 값 집합을 나타내는 데 특히 유용합니다. union 타입의 유연성과 함께 T-Ruby에 열거형과 유사한 기능을 제공합니다.

이제 Everyday Types 섹션을 완료했습니다! 원시 타입, 컬렉션, union, 타입 좁히기, 리터럴 - 타입 안전한 T-Ruby 코드를 작성하기 위한 핵심 구성 요소를 이해했습니다.
