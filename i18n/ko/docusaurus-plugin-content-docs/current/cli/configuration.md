---
sidebar_position: 2
title: 설정
description: T-Ruby 설정 파일 레퍼런스
---

<DocsBadge />


# 설정

T-Ruby는 `trc.yaml` 파일을 사용하여 컴파일러 동작, 소스 파일, 출력 위치, 타입 검사 규칙을 설정합니다. 이 레퍼런스는 사용 가능한 모든 설정 옵션을 다룹니다.

## 설정 파일

프로젝트 루트에 `trc.yaml`을 배치합니다:

```yaml title="trc.yaml"
# T-Ruby 설정 파일
version: ">=1.0.0"

source:
  include:
    - src
    - lib
  exclude:
    - "**/*_test.trb"

output:
  ruby_dir: build
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: standard
  generate_rbs: true
  target_ruby: "3.2"
```

## 설정 생성

설정 파일을 생성합니다:

```bash
# 기본값으로 생성
trc init

# 대화형 설정
trc init --interactive

# 템플릿 사용
trc init --template rails
```

## 설정 섹션

### version

필요한 최소 T-Ruby 컴파일러 버전을 지정합니다:

```yaml
version: ">=1.0.0"
```

지원 형식:
```yaml
version: "1.0.0"        # 정확한 버전
version: ">=1.0.0"      # 최소 버전
version: "~>1.0"        # 호환 버전
version: ">=1.0,<2.0"   # 범위
```

### source

컴파일할 파일을 설정합니다:

```yaml
source:
  # 포함할 디렉토리
  include:
    - src
    - lib
    - app

  # 제외할 패턴
  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/fixtures/**"
    - "**/tmp/**"

  # 파일 확장자 (기본값: [".trb"])
  extensions:
    - .trb
    - .truby
```

**Include 경로**는 다음이 될 수 있습니다:
- 디렉토리: `src`, `lib/models`
- Glob 패턴: `src/**/*.trb`
- 개별 파일: `app/main.trb`

**Exclude 패턴**은 다음을 지원합니다:
- 와일드카드: `**/test/**`, `*_spec.trb`
- 부정: `!important_test.trb`

복잡한 패턴 예시:

```yaml
source:
  include:
    - src
    - lib
    - "config/**/*.trb"  # config 파일 포함

  exclude:
    # 모든 테스트 파일 제외
    - "**/*_test.trb"
    - "**/*_spec.trb"

    # vendor 코드 제외
    - "**/vendor/**"
    - "**/node_modules/**"

    # 생성된 파일 제외
    - "**/generated/**"
    - "**/*.generated.trb"

    # 특정 테스트는 포함
    - "!test/important_integration_test.trb"
```

### output

컴파일된 파일이 작성되는 위치를 설정합니다:

```yaml
output:
  # 컴파일된 Ruby 파일 디렉토리
  ruby_dir: build

  # RBS 시그니처 파일 디렉토리
  rbs_dir: sig

  # 소스 디렉토리 구조 유지
  preserve_structure: true

  # 빌드 전 출력 디렉토리 정리
  clean_before_build: false

  # Ruby 출력 파일 확장자 (기본값: .rb)
  ruby_extension: .rb

  # RBS 출력 파일 확장자 (기본값: .rbs)
  rbs_extension: .rbs
```

#### preserve_structure

`true`일 때 소스 디렉토리 계층 구조를 유지합니다:

```yaml
preserve_structure: true
```

```
src/
├── models/
│   └── user.trb
└── services/
    └── auth.trb
```

컴파일 결과:

```
build/
├── models/
│   └── user.rb
└── services/
    └── auth.rb
```

`false`일 때 출력을 평면화합니다:

```yaml
preserve_structure: false
```

```
build/
├── user.rb
└── auth.rb
```

#### clean_before_build

컴파일 전에 출력 디렉토리의 모든 파일을 제거합니다:

```yaml
output:
  clean_before_build: true  # 컴파일 전 build/ 및 sig/ 정리
```

다음과 같은 경우 유용합니다:
- 고아 파일 제거
- CI에서 깨끗한 빌드 보장
- 이름이 변경된 파일과의 충돌 방지

### compiler

컴파일러 동작과 타입 검사를 설정합니다:

```yaml
compiler:
  # 엄격도 레벨
  strictness: standard

  # RBS 파일 생성
  generate_rbs: true

  # 대상 Ruby 버전
  target_ruby: "3.2"

  # 타입 검사 옵션
  checks:
    no_implicit_any: true
    no_unused_vars: false
    strict_nil: true
    no_unchecked_indexed_access: false

  # 실험적 기능
  experimental:
    - pattern_matching_types
    - refinement_types

  # 최적화 레벨
  optimization: none
```

#### strictness

타입 검사 엄격도를 제어합니다:

```yaml
compiler:
  strictness: strict  # strict | standard | permissive
```

**strict** - 최대 타입 안전성:
- 모든 함수에 매개변수와 반환 타입 필요
- 모든 인스턴스 변수에 타입 지정 필요
- 모든 지역 변수에 명시적 타입 지정 또는 추론 필요
- 암시적 `any` 타입 불허
- 엄격한 nil 검사 활성화

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```trb
# 엄격 모드에서 필요
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result: Hash<String, Integer> = {}
  # ...
end
```

**standard** (권장) - 균형 잡힌 접근:
- 공개 API 메서드에 타입 필요
- 프라이빗 메서드는 타입 생략 가능 (추론)
- 인스턴스 변수에 타입 필요
- 지역 변수는 추론 가능
- 암시적 `any`에 경고

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```trb
# 표준 모드에서 OK
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result = {}  # 타입 추론
  # ...
end

private

def helper(x)  # 프라이빗, 타입 추론
  x * 2
end
```

**permissive** - 점진적 타이핑:
- 명시적 타입 오류만 캐치
- 암시적 `any` 타입 허용
- 기존 코드 마이그레이션에 유용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```ruby
# 관용 모드에서 OK
def process(data)
  @count = 0
  result = {}
  # ...
end
```

#### target_ruby

특정 Ruby 버전과 호환되는 코드를 생성합니다:

```yaml
compiler:
  target_ruby: "3.2"
```

영향:
- 출력에 사용되는 구문 기능
- 표준 라이브러리 타입 정의
- 메서드 가용성 검사

지원 버전: `"2.7"`, `"3.0"`, `"3.1"`, `"3.2"`, `"3.3"`

예시 - 패턴 매칭:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```trb
# 입력 (.trb)
case value
in { name: String => n }
  puts n
end
```

`target_ruby: "3.0"` 사용 시:
<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```ruby
# 패턴 매칭 사용 (Ruby 3.0+)
case value
in { name: n }
  puts n
end
```

`target_ruby: "2.7"` 사용 시:
<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```ruby
# case/when으로 폴백
case
when value.is_a?(Hash) && value[:name].is_a?(String)
  n = value[:name]
  puts n
end
```

#### checks

세부적인 타입 검사 규칙:

```yaml
compiler:
  checks:
    # 암시적 'any' 타입 불허
    no_implicit_any: true

    # 미사용 변수 경고
    no_unused_vars: true

    # 엄격한 nil 검사
    strict_nil: true

    # 인덱스 접근 검사 (배열, 해시)
    no_unchecked_indexed_access: true

    # 명시적 반환 타입 요구
    require_return_types: false

    # 타입이 지정되지 않은 함수 호출 불허
    no_untyped_calls: false
```

**no_implicit_any**

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```trb
# no_implicit_any: true일 때 오류
def process(data)  # 오류: 암시적 'any' 타입
  # ...
end

# OK
def process(data: Any)  # 명시적 any
  # ...
end
```

**no_unused_vars**

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```trb
# no_unused_vars: true일 때 경고
def calculate(x: Integer, y: Integer): Integer
  result = x * 2  # 경고: 'y'가 미사용
  result
end
```

**strict_nil**

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```trb
# strict_nil: true일 때 오류
def find_user(id: Integer): User  # 오류: nil을 반환할 수 있음
  users.find { |u| u.id == id }
end

# OK
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end
```

**no_unchecked_indexed_access**

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/configuration_spec.rb" line={21} />

```trb
# no_unchecked_indexed_access: true일 때 오류
users: Array<User> = get_users()
user = users[0]  # 오류: nil일 수 있음

# OK - 먼저 검사
if users[0]
  user = users[0]  # 안전
end

# 또는 기본값과 함께 fetch 사용
user = users.fetch(0, default_user)
```

#### experimental

실험적 기능을 활성화합니다:

```yaml
compiler:
  experimental:
    - pattern_matching_types
    - refinement_types
    - variadic_generics
    - higher_kinded_types
```

**경고:** 실험적 기능은 향후 버전에서 변경되거나 제거될 수 있습니다.

#### optimization

코드 최적화 레벨을 제어합니다:

```yaml
compiler:
  optimization: none  # none | basic | aggressive
```

- `none` - 최적화 없음, 가독성 유지
- `basic` - 안전한 최적화 (상수 인라인, 데드 코드 제거)
- `aggressive` - 최대 최적화 (가독성 저하 가능)

### watch

감시 모드 동작을 설정합니다:

```yaml
watch:
  # 추가로 감시할 경로
  paths:
    - config
    - types

  # 디바운스 지연 (밀리초)
  debounce: 100

  # 리빌드 시 화면 지우기
  clear_screen: true

  # 성공적 컴파일 후 실행할 명령
  on_success: "bundle exec rspec"

  # 실패한 컴파일 후 실행할 명령
  on_failure: "notify-send 'Build failed'"

  # 무시할 패턴
  ignore:
    - "**/tmp/**"
    - "**/.git/**"
```

컴파일 후 테스트 실행 예시:

```yaml
watch:
  on_success: "bundle exec rake test"
  clear_screen: true
  debounce: 200
```

### types

타입 해결과 가져오기를 설정합니다:

```yaml
types:
  # 추가 타입 정의 디렉토리
  paths:
    - types
    - vendor/types
    - custom_types

  # 표준 라이브러리 타입 자동 가져오기
  stdlib: true

  # 외부 타입 정의
  external:
    - rails
    - rspec
    - activerecord

  # 타입 별칭
  aliases:
    UserId: Integer
    Timestamp: Integer

  # 타입 가져오기 엄격 모드
  strict_imports: false
```

#### paths

`.rbs` 타입 정의 파일이 포함된 디렉토리:

```yaml
types:
  paths:
    - types          # 프로젝트별 타입
    - vendor/types   # 서드파티 타입
```

```
types/
├── custom.rbs
└── external/
    └── third_party.rbs
```

#### external

라이브러리의 타입 정의를 가져옵니다:

```yaml
types:
  external:
    - rails
    - rspec
    - sidekiq
```

T-Ruby는 다음에서 찾습니다:
1. 번들된 타입 정의
2. Gem의 `sig/` 디렉토리
3. RBS 저장소

#### stdlib

Ruby 표준 라이브러리 타입을 포함합니다:

```yaml
types:
  stdlib: true  # Array, Hash, String 등 가져오기
```

### plugins

플러그인으로 T-Ruby를 확장합니다:

```yaml
plugins:
  # 커스텀 플러그인
  - name: my_custom_plugin
    path: ./plugins/custom.rb
    options:
      setting: value

  # 내장 플러그인
  - name: rails_types
    enabled: true

  - name: graphql_types
    enabled: true
```

### linting

린팅 규칙을 설정합니다:

```yaml
linting:
  # 린터 활성화
  enabled: true

  # 규칙 설정
  rules:
    # 명명 규칙
    naming_convention: snake_case
    class_naming: PascalCase
    constant_naming: SCREAMING_SNAKE_CASE

    # 복잡도
    max_method_lines: 50
    max_class_lines: 300
    max_complexity: 10

    # 스타일
    prefer_single_quotes: true
    require_trailing_comma: false

  # 특정 규칙 비활성화
  disabled_rules:
    - prefer_ternary
    - max_line_length
```

## 환경 변수

환경 변수로 설정을 재정의합니다:

```yaml
compiler:
  strictness: ${TRC_STRICTNESS:-standard}
  target_ruby: ${RUBY_VERSION:-3.2}

output:
  ruby_dir: ${TRC_OUTPUT_DIR:-build}
```

사용:

```bash
TRC_STRICTNESS=strict trc compile .
RUBY_VERSION=3.0 trc compile .
```

## 다중 설정 파일

다른 환경에 다른 설정을 사용합니다:

```bash
# 개발
trc --config trc.development.yaml compile

# 프로덕션
trc --config trc.production.yaml compile

# 테스트
trc --config trc.test.yaml check
```

**trc.development.yaml:**
```yaml
compiler:
  strictness: permissive
  checks:
    no_unused_vars: false

watch:
  on_success: "bundle exec rspec"
```

**trc.production.yaml:**
```yaml
compiler:
  strictness: strict
  optimization: aggressive
  checks:
    no_implicit_any: true
    no_unused_vars: true

output:
  clean_before_build: true
```

## 설정 상속

기본 설정을 만들고 확장합니다:

**trc.base.yaml:**
```yaml
compiler:
  target_ruby: "3.2"
  generate_rbs: true

types:
  stdlib: true
```

**trc.yaml:**
```yaml
extends: trc.base.yaml

compiler:
  strictness: standard

source:
  include:
    - src
```

## 워크스페이스 설정

여러 패키지가 있는 모노레포용:

**trc.workspace.yaml:**
```yaml
workspace:
  # 패키지 위치
  packages:
    - packages/core
    - packages/web
    - packages/api

  # 공유 설정
  shared:
    compiler:
      target_ruby: "3.2"
      strictness: strict

  # 패키지별 재정의
  overrides:
    packages/web:
      compiler:
        strictness: standard
```

각 패키지는 자체 `trc.yaml`을 가집니다:

**packages/core/trc.yaml:**
```yaml
source:
  include:
    - lib

output:
  ruby_dir: lib
  rbs_dir: sig
```

워크스페이스 빌드:

```bash
trc --workspace compile
```

## 완전한 예시

Rails 애플리케이션을 위한 포괄적인 설정:

```yaml title="trc.yaml"
# Rails 앱을 위한 T-Ruby 설정
version: ">=1.2.0"

# 소스 파일
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - app/jobs
    - lib

  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/concerns/**"  # Ruby로 유지
    - "**/vendor/**"

  extensions:
    - .trb

# 출력
output:
  ruby_dir: app
  rbs_dir: sig
  preserve_structure: true
  clean_before_build: false

# 컴파일러
compiler:
  strictness: standard
  generate_rbs: true
  target_ruby: "3.2"

  checks:
    no_implicit_any: true
    strict_nil: true
    no_unused_vars: true
    no_unchecked_indexed_access: false

  experimental: []

  optimization: basic

# 감시 모드
watch:
  paths:
    - config
    - app

  debounce: 150
  clear_screen: true
  on_success: "bin/rails test"

  ignore:
    - "**/tmp/**"
    - "**/log/**"

# 타입
types:
  paths:
    - types
    - vendor/types

  stdlib: true

  external:
    - rails
    - activerecord
    - actionpack
    - activesupport

# 린팅
linting:
  enabled: true

  rules:
    naming_convention: snake_case
    class_naming: PascalCase
    max_method_lines: 50
    max_class_lines: 300
    prefer_single_quotes: true

  disabled_rules:
    - max_line_length
```

## 설정 스키마

T-Ruby는 스키마에 대해 설정을 검증합니다. 스키마를 가져옵니다:

```bash
trc config --schema > trc-schema.json
```

에디터에서 자동완성과 검증을 위해 사용합니다:

```yaml
# yaml-language-server: $schema=./trc-schema.json

version: ">=1.0.0"
# ... IDE가 자동완성 제공
```

## 설정 디버깅

유효한 설정을 봅니다 (기본값과 재정의 병합 후):

```bash
# 유효한 설정 표시
trc config --show

# JSON으로 표시
trc config --show --json

# 설정 검증
trc config --validate

# 설정 소스 표시
trc config --debug
```

출력:

```
Configuration loaded from:
  - /path/to/trc.yaml
  - Environment variables:
    - TRC_STRICTNESS=standard
  - Command line:
    - --target-ruby=3.2

Effective configuration:
  version: ">=1.0.0"
  source:
    include: ["src", "lib"]
  ...
```

## 마이그레이션 가이드

### 버전 0.x에서 1.x로

버전 1.0에서 설정 형식이 변경되었습니다:

**이전 (0.x):**
```yaml
inputs:
  - src
output: build
rbs_output: sig
strict: true
```

**새로운 (1.x):**
```yaml
source:
  include:
    - src
output:
  ruby_dir: build
  rbs_dir: sig
compiler:
  strictness: strict
```

자동 마이그레이션:

```bash
trc config --migrate
```

## 모범 사례

### 1. 프로젝트 단계에 적합한 엄격도 사용

```yaml
# 새 프로젝트 - 엄격하게 시작
compiler:
  strictness: strict

# 기존 프로젝트 마이그레이션 - 관용적으로 시작
compiler:
  strictness: permissive
```

### 2. 유용한 검사를 점진적으로 활성화

```yaml
compiler:
  checks:
    # 이것들로 시작
    strict_nil: true
    no_implicit_any: true

    # 코드가 개선되면 나중에 추가
    # no_unused_vars: true
    # no_unchecked_indexed_access: true
```

### 3. 환경별 설정 사용

```yaml
# trc.yaml (기본값 - 개발)
compiler:
  strictness: standard

# trc.production.yaml
compiler:
  strictness: strict
  optimization: aggressive
```

### 4. 커스텀 설정 문서화

```yaml
# 우리 팀을 위한 커스텀 설정
# 자세한 내용은 docs/truby-setup.md 참조

compiler:
  # 더 나은 타입 안전성을 위해 엄격 모드 사용
  strictness: strict

  # 미사용 변수 경고 안 함 (_ 접두사 사용)
  checks:
    no_unused_vars: false
```

### 5. 버전 관리에 설정 유지

```bash
git add trc.yaml
git commit -m "Add T-Ruby configuration"
```

## 다음 단계

- [명령어 레퍼런스](/docs/cli/commands) - CLI 명령어 알아보기
- [컴파일러 옵션](/docs/cli/compiler-options) - 자세한 컴파일러 플래그
- [타입 어노테이션](/docs/learn/basics/type-annotations) - 코드에 타입 지정 시작
