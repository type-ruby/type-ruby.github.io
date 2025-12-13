---
sidebar_position: 1
title: RBS 통합
description: T-Ruby가 RBS 파일을 생성하고 연동하는 방법
---

<DocsBadge />


# RBS 통합

T-Ruby는 Ruby의 공식 타입 시그니처 형식인 RBS(Ruby Signature)와 원활하게 통합됩니다. T-Ruby 코드를 컴파일하면 컴파일러가 Ruby 출력과 함께 `.rbs` 파일을 자동으로 생성하여 더 넓은 Ruby 타이핑 생태계와의 통합을 가능하게 합니다.

## RBS란?

RBS는 Ruby의 표준 타입 시그니처 형식입니다. Ruby 프로그램의 구조를 설명하기 위한 별도의 언어로, 다음을 포함합니다:

- 메서드 시그니처
- 클래스와 모듈 정의
- 인스턴스 변수와 클래스 변수
- 제네릭과 타입 파라미터

## T-Ruby가 RBS를 생성하는 방법

T-Ruby 코드를 컴파일하면 컴파일러가 타입 정보를 추출하여 해당하는 RBS 파일을 생성합니다.

### 기본 예제

**T-Ruby 입력** (`user.trb`):

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={25} />

```trb
class User
  @id: Integer
  @name: String
  @email: String

  def initialize(id: Integer, name: String, email: String): void
    @id = id
    @name = name
    @email = email
  end

  def greet: String
    "Hello, I'm #{@name}!"
  end

  def update_email(new_email: String): void
    @email = new_email
  end
end
```

**생성된 RBS** (`sig/user.rbs`):

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={36} />

```rbs
class User
  @id: Integer
  @name: String
  @email: String

  def initialize: (Integer id, String name, String email) -> void
  def greet: () -> String
  def update_email: (String new_email) -> void
end
```

**생성된 Ruby** (`build/user.rb`):

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={46} />

```ruby
class User
  def initialize(id, name, email)
    @id = id
    @name = name
    @email = email
  end

  def greet
    "Hello, I'm #{@name}!"
  end

  def update_email(new_email)
    @email = new_email
  end
end
```

## 컴파일 옵션

### RBS 생성 활성화/비활성화

기본적으로 RBS 파일이 생성됩니다. 이를 제어할 수 있습니다:

```yaml title="trbconfig.yml"
compiler:
  generate_rbs: true  # 기본값
```

또는 커맨드 라인에서:

```bash
# RBS 생성 건너뛰기
trc compile --no-rbs src/

# RBS만 생성 (Ruby 건너뛰기)
trc compile --rbs-only src/
```

### RBS 출력 디렉토리

RBS 파일이 작성될 위치 설정:

```yaml title="trbconfig.yml"
output:
  rbs_dir: sig  # 기본값
```

```bash
trc compile --rbs-dir signatures/ src/
```

## 지원되는 RBS 기능

### 메서드 시그니처

T-Ruby는 파라미터와 반환 타입을 포함한 메서드 시그니처를 자동으로 생성합니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={56} />

```trb title="calculator.trb"
def add(a: Integer, b: Integer): Integer
  a + b
end

def divide(a: Float, b: Float): Float | nil
  return nil if b == 0
  a / b
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={67} />

```rbs title="sig/calculator.rbs"
def add: (Integer a, Integer b) -> Integer
def divide: (Float a, Float b) -> (Float | nil)
```

### 선택적 파라미터와 키워드 파라미터

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={77} />

```trb title="formatter.trb"
def format(
  text: String,
  uppercase: Bool = false,
  prefix: String? = nil
): String
  result = uppercase ? text.upcase : text
  prefix ? "#{prefix}#{result}" : result
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={88} />

```rbs title="sig/formatter.rbs"
def format: (
  String text,
  ?Bool uppercase,
  ?String? prefix
) -> String
```

### 블록 시그니처

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={98} />

```trb title="iterator.trb"
def each_item(items: Array<String>): void do |String| -> void end
  items.each { |item| yield item }
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={109} />

```rbs title="sig/iterator.rbs"
def each_item: (Array[String] items) { (String) -> void } -> void
```

### 제네릭

T-Ruby의 제네릭 타입은 RBS 제네릭에 직접 매핑됩니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={119} />

```trb title="container.trb"
class Container<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end

  def set(value: T): void
    @value = value
  end
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={130} />

```rbs title="sig/container.rbs"
class Container[T]
  @value: T

  def initialize: (T value) -> void
  def get: () -> T
  def set: (T value) -> void
end
```

### 유니온 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={140} />

```trb title="parser.trb"
def parse(input: String): Integer | Float | nil
  return nil if input.empty?

  if input.include?(".")
    input.to_f
  else
    input.to_i
  end
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={151} />

```rbs title="sig/parser.rbs"
def parse: (String input) -> (Integer | Float | nil)
```

### 모듈과 믹스인

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={161} />

```trb title="loggable.trb"
module Loggable
  def log(message: String): void
    puts "[LOG] #{message}"
  end

  def log_error(error: String): void
    puts "[ERROR] #{error}"
  end
end

class Service
  include Loggable

  def process: void
    log("Processing...")
  end
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={172} />

```rbs title="sig/loggable.rbs"
module Loggable
  def log: (String message) -> void
  def log_error: (String error) -> void
end

class Service
  include Loggable

  def process: () -> void
end
```

### 타입 별칭

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={182} />

```trb title="types.trb"
type UserId = Integer
type UserMap = Hash<UserId, User>

def find_users(ids: Array<UserId>): UserMap
  # ...
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={193} />

```rbs title="sig/types.rbs"
type UserId = Integer
type UserMap = Hash[UserId, User]

def find_users: (Array[UserId] ids) -> UserMap
```

### 인터페이스

T-Ruby 인터페이스는 RBS 인터페이스 타입으로 변환됩니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={203} />

```trb title="printable.trb"
interface Printable
  def to_s: String
  def print: void
end

class Document
  implements Printable

  def to_s: String
    "Document"
  end

  def print: void
    puts to_s
  end
end
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={214} />

```rbs title="sig/printable.rbs"
interface _Printable
  def to_s: () -> String
  def print: () -> void
end

class Document
  include _Printable

  def to_s: () -> String
  def print: () -> void
end
```

## 생성된 RBS 파일 사용하기

### Steep과 함께 사용

Steep은 타입 검사를 위해 T-Ruby가 생성한 RBS 파일을 사용할 수 있습니다:

```yaml title="Steepfile"
target :app do
  signature "sig"  # T-Ruby가 생성한 시그니처
  check "build"    # 컴파일된 Ruby 파일
end
```

```bash
trc compile src/
steep check
```

### Ruby LSP와 함께 사용

T-Ruby의 RBS 파일을 사용하도록 Ruby LSP 설정:

```json title=".vscode/settings.json"
{
  "rubyLsp.enabledFeatures": {
    "diagnostics": true
  },
  "rubyLsp.typechecker": "steep",
  "rubyLsp.rbs.path": "sig"
}
```

### Sorbet과 함께 사용

RBS에서 Sorbet 호환 타입 스텁 생성:

```bash
# RBS 파일 생성
trc compile --rbs-only src/

# Sorbet 스텁으로 변환
rbs-to-sorbet sig/ sorbet/rbi/
```

### 표준 Gem과 함께 사용

RBS 시그니처를 gem에 포함:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={224} />

```ruby title="my_gem.gemspec"
Gem::Specification.new do |spec|
  spec.name = "my_gem"
  spec.files = Dir["lib/**/*", "sig/**/*"]
  spec.metadata["rbs_signatures"] = "sig"
end
```

## 고급 RBS 생성

### 커스텀 RBS 어노테이션

주석에 RBS 전용 어노테이션 추가:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={234} />

```trb title="service.trb"
class Service
  # @rbs_skip
  def debug_method: void
    # 이 메서드는 RBS에 나타나지 않음
  end

  # @rbs_override
  # def custom_signature: (String) -> Integer
  def custom_method(input: String): Integer
    input.length
  end
end
```

### 외부 RBS 통합

T-Ruby가 생성한 RBS와 직접 작성한 RBS 결합:

```
sig/
├── generated/      # T-Ruby가 생성
│   ├── user.rbs
│   └── service.rbs
└── manual/         # 직접 작성
    └── external.rbs
```

```yaml title="trbconfig.yml"
output:
  rbs_dir: sig/generated

types:
  paths:
    - sig/manual
    - sig/generated
```

### RBS 파일 병합

기존 RBS 파일이 있는 경우:

```bash
# 새 RBS 생성
trc compile --rbs-only src/

# 기존 파일과 병합
rbs merge sig/generated/ sig/manual/ -o sig/merged/
```

## RBS 유효성 검사

생성된 RBS 파일 검증:

```bash
# RBS 생성
trc compile src/

# RBS로 검증
rbs validate --signature-path=sig/
```

T-Ruby는 생성된 RBS가 항상 유효함을 보장하지만, 다음의 경우에 검증이 유용합니다:
- 직접 작성한 RBS와 결합할 때
- 외부 타입 정의를 사용할 때
- 타입 문제를 디버깅할 때

## RBS와 타입 검사 흐름

T-Ruby의 RBS 통합이 타입 검사에 어떻게 적용되는지:

```
┌─────────────┐
│  .trb 파일  │
│  (T-Ruby)   │
└──────┬──────┘
       │
       ▼
   ┌────────┐
   │  trc   │  컴파일
   └───┬────┘
       │
       ├──────────┐
       ▼          ▼
 ┌──────────┐  ┌──────────┐
 │ .rb 파일 │  │.rbs 파일 │
 │ (Ruby)   │  │  (RBS)   │
 └─────┬────┘  └────┬─────┘
       │            │
       │            ▼
       │      ┌──────────┐
       │      │  Steep   │  타입 검사
       │      │ Ruby LSP │
       │      └──────────┘
       │
       ▼
  ┌──────────┐
  │   Ruby   │  실행
  │인터프리터│
  └──────────┘
```

## 실용 예제

### 예제 1: 라이브러리 개발

RBS를 포함한 타입이 지정된 라이브러리 생성:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={245} />

```trb title="lib/my_library.trb"
module MyLibrary
  class Client
    @api_key: String
    @endpoint: String

    def initialize(api_key: String, endpoint: String = "https://api.example.com"): void
      @api_key = api_key
      @endpoint = endpoint
    end

    def get<T>(path: String, params: Hash<String, Any> = {}): T | nil
      # 구현
    end

    def post<T>(path: String, body: Hash<String, Any>): T
      # 구현
    end
  end
end
```

컴파일:

```bash
trc compile lib/
```

생성된 파일:

```
lib/
├── my_library.rb   # 런타임용
sig/
└── my_library.rbs  # 타입 검사 및 문서용
```

사용자는 이제 다음과 같이 사용할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={256} />

```ruby
# Ruby에서 사용
require "my_library"
client = MyLibrary::Client.new("key123")

# Steep으로 타입 검사
# steep check는 sig/my_library.rbs를 사용
```

### 예제 2: Rails 애플리케이션

Rails 모델에서 RBS 사용:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={266} />

```trb title="app/models/user.trb"
class User < ApplicationRecord
  @name: String
  @email: String
  @admin: Bool

  def self.find_by_email(email: String): User | nil
    find_by(email: email)
  end

  def admin?: Bool
    @admin
  end

  def promote_to_admin: void
    update!(admin: true)
  end
end
```

```yaml title="trbconfig.yml"
source:
  include:
    - app/models

output:
  ruby_dir: app/models
  rbs_dir: sig
```

컴파일:

```bash
trc compile
```

이제 Steep이 Rails 앱을 검사할 수 있습니다:

```yaml title="Steepfile"
target :app do
  signature "sig"
  check "app"

  library "activerecord"
end
```

### 예제 3: 타입 시그니처를 포함한 Gem

gem에 RBS 패키징:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={277} />

```ruby title="my_gem.gemspec"
Gem::Specification.new do |spec|
  spec.name = "my_typed_gem"
  spec.version = "1.0.0"

  spec.files = Dir[
    "lib/**/*.rb",
    "sig/**/*.rbs"
  ]

  spec.metadata = {
    "rbs_signatures" => "sig"
  }
end
```

사용자는 gem을 사용할 때 자동으로 타입 정보를 얻습니다.

## 문제 해결

### RBS 생성 실패

RBS 생성이 실패하는 경우:

```bash
# 상세 출력으로 컴파일 확인
trc compile --verbose src/

# 먼저 T-Ruby 타입 검증
trc check src/

# 별도로 RBS 생성
trc compile --rbs-only src/
```

### RBS 유효성 검사 오류

RBS 검증이 실패하는 경우:

```bash
# 특정 RBS 파일 확인
rbs validate sig/user.rbs

# 생성된 RBS 보기
cat sig/user.rbs

# 디버그 모드로 재생성
trc compile --log-level debug src/
```

### 타입 불일치

T-Ruby와 RBS 간에 타입이 일치하지 않는 경우:

```bash
# 어떤 RBS가 생성되었는지 확인
trc compile --rbs-only --output-file - src/user.trb

# 타입 추적 사용
trc compile --trace src/
```

## 모범 사례

### 1. RBS를 버전 관리에 포함

```bash
git add sig/
git commit -m "Update RBS signatures"
```

RBS 파일은 소스 코드입니다 - Ruby 파일과 함께 커밋하세요.

### 2. CI에서 RBS 검증

```yaml title=".github/workflows/ci.yml"
- name: Generate and Validate RBS
  run: |
    trc compile src/
    rbs validate --signature-path=sig/
```

### 3. 공개 API 문서화

RBS 파일은 문서 역할을 합니다. 공개 API가 잘 타입 지정되어 있는지 확인하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={287} />

```trb
# 좋음 - 명확한 공개 API
class Service
  def process(data: Array<String>): Hash<String, Integer>
    # ...
  end

  private

  def internal_helper(x)  # private은 타입 없어도 됨
    # ...
  end
end
```

### 4. 명확성을 위한 타입 별칭 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/rbs_integration_spec.rb" line={298} />

```trb
type UserId = Integer
type ResponseData = Hash<String, Any>

def fetch_user(id: UserId): ResponseData
  # ...
end
```

### 5. 직접 작성한 RBS와 결합

생성된 RBS와 수동 RBS를 분리:

```
sig/
├── generated/     # T-Ruby에서 생성
└── manual/        # 직접 작성
```

## 다음 단계

- [Steep 사용하기](/docs/tooling/steep) - Steep으로 타입 검사
- [Ruby LSP 통합](/docs/tooling/ruby-lsp) - IDE 지원
- [RBS 공식 문서](https://github.com/ruby/rbs) - RBS에 대해 더 알아보기
