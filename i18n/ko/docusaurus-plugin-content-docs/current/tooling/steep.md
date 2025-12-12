---
sidebar_position: 2
title: Steep 사용하기
description: Steep을 사용한 타입 검사
---

<DocsBadge />


# Steep 사용하기

Steep은 타입 시그니처에 RBS를 사용하는 Ruby용 정적 타입 검사기입니다. T-Ruby는 Steep과 원활하게 통합되어 T-Ruby 컴파일러가 제공하는 것 이상의 추가 타입 검사를 활용할 수 있습니다.

## T-Ruby와 함께 Steep을 사용하는 이유

T-Ruby가 컴파일 중에 타입 검사를 수행하지만, Steep은 다음을 제공합니다:

- 생성된 Ruby 코드의 **추가 검증**
- 의존성과 라이브러리에 대한 **타입 검사**
- Ruby LSP를 통한 **IDE 통합**
- 컴파일된 코드가 RBS 시그니처와 일치하는지 **검증**
- **표준 Ruby 도구** 호환성

## 설치

프로젝트에 Steep 추가:

```bash
gem install steep
```

또는 Gemfile에:

```ruby
group :development do
  gem "steep"
  gem "t-ruby"
end
```

그 다음:

```bash
bundle install
```

## 기본 설정

### 1단계: T-Ruby 코드 컴파일

먼저 T-Ruby 코드를 컴파일하여 Ruby와 RBS 파일을 생성합니다:

```bash
trc compile src/
```

이렇게 생성됩니다:
```
build/          # 컴파일된 Ruby 파일
sig/            # RBS 타입 시그니처
```

### 2단계: Steepfile 생성

Steep을 설정하기 위한 `Steepfile` 생성:

```ruby title="Steepfile"
target :app do
  # 컴파일된 Ruby 파일 검사
  check "build"

  # T-Ruby가 생성한 시그니처 사용
  signature "sig"

  # Ruby 표준 라이브러리 타입 사용
  library "pathname"
end
```

### 3단계: Steep 실행

```bash
steep check
```

Steep은 컴파일된 Ruby 코드가 생성된 RBS 시그니처와 일치하는지 검증합니다.

## 전체 예제

전체 예제를 살펴보겠습니다.

**T-Ruby 소스** (`src/user.trb`):

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

  def self.find(id: Integer): User | nil
    # 데이터베이스 조회가 여기에
    nil
  end
end

# 클래스 사용
user = User.new(1, "Alice", "alice@example.com")
puts user.greet

# 이것은 타입 오류가 됩니다
# user = User.new("not a number", "Bob", "bob@example.com")
```

**컴파일**:

```bash
trc compile src/
```

**Steep 설정** (`Steepfile`):

```ruby
target :app do
  check "build"
  signature "sig"
end
```

**Steep 실행**:

```bash
steep check
```

출력:
```
# Type checking files:

build/user.rb:19:8: [error] Type mismatch:
  expected: Integer
  actual: String

# Typecheck result: FAILURE
```

## Steepfile 설정

### 기본 구조

```ruby
target :app do
  check "path/to/ruby/files"
  signature "path/to/rbs/files"
end
```

### 여러 타겟

더 큰 프로젝트에서는 여러 타겟을 사용:

```ruby
# 애플리케이션 코드
target :app do
  check "build/app"
  signature "sig/app"

  library "pathname", "logger"
end

# 테스트
target :test do
  check "build/test"
  signature "sig/test", "sig/app"

  library "pathname", "logger", "minitest"
end
```

### 라이브러리

Ruby 표준 라이브러리와 gem의 RBS 포함:

```ruby
target :app do
  check "build"
  signature "sig"

  # 표준 라이브러리
  library "pathname"
  library "json"
  library "net-http"

  # RBS 지원이 있는 gem
  library "activerecord"
  library "activesupport"
end
```

### 타입 해결

Steep이 타입을 해결하는 방법 설정:

```ruby
target :app do
  check "build"
  signature "sig"

  # 특정 파일 무시
  ignore "build/vendor/**/*.rb"

  # 타입 검사 엄격도 설정
  configure_code_diagnostics do |hash|
    hash[D::UnresolvedOverloading] = :information
    hash[D::FallbackAny] = :warning
  end
end
```

## T-Ruby 워크플로우와의 통합

### 개발 워크플로우

```bash
# 1. T-Ruby 코드 작성
vim src/user.trb

# 2. T-Ruby로 컴파일 (T-Ruby 타입 오류 검출)
trc compile src/

# 3. Steep으로 검사 (Ruby 출력 검증)
steep check

# 4. 코드 실행
ruby build/user.rb
```

### 감시 모드

T-Ruby 감시와 Steep 감시를 함께 사용:

**터미널 1** - T-Ruby 감시:
```bash
trc watch src/ --clear
```

**터미널 2** - Steep 감시:
```bash
steep watch --code=build --signature=sig
```

이제 파일을 편집할 때 둘 다 자동으로 다시 검사합니다.

### 단일 명령 워크플로우

둘 다 실행하는 스크립트 생성:

```bash title="bin/typecheck"
#!/bin/bash
set -e

echo "Compiling T-Ruby..."
trc compile src/

echo "Running Steep..."
steep check

echo "Type checking passed!"
```

```bash
chmod +x bin/typecheck
./bin/typecheck
```

## 고급 설정

### 엄격 모드

Steep에서 엄격한 타입 검사 활성화:

```ruby
target :app do
  check "build"
  signature "sig"

  # 엄격 모드 - 모든 타입 문제에서 실패
  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :error
    hash[D::UnresolvedOverloading] = :error
    hash[D::UnexpectedBlockGiven] = :error
    hash[D::IncompatibleMethodTypeAnnotation] = :error
  end
end
```

### 커스텀 타입 디렉토리

T-Ruby가 생성한 RBS와 함께 직접 작성한 RBS가 있는 경우:

```ruby
target :app do
  check "build"

  # T-Ruby가 생성한 시그니처
  signature "sig/generated"

  # 직접 작성한 시그니처
  signature "sig/manual"

  # 벤더 시그니처
  signature "sig/vendor"
end
```

### Rails 통합

Rails 프로젝트의 경우:

```ruby
target :app do
  check "app"

  signature "sig"

  # Rails 핵심 라이브러리
  library "pathname"
  library "logger"

  # Rails gem
  library "activerecord"
  library "actionpack"
  library "activesupport"
  library "actionview"

  # Rails 경로 설정
  repo_path "vendor/rbs-rails"
end

# Rails 오토로딩 설정
configure_code_diagnostics do |hash|
  # Rails는 오토로딩을 사용 - 상수에 관대하게
  hash[D::UnknownConstant] = :hint
end
```

### 무시 패턴

생성되거나 벤더 코드 무시:

```ruby
target :app do
  check "build"
  signature "sig"

  # 특정 패턴 무시
  ignore "build/vendor/**/*.rb"
  ignore "build/generated/**/*.rb"
  ignore "build/**/*_pb.rb"  # 프로토콜 버퍼 생성 파일
end
```

## 진단 설정

Steep의 진단 수준 커스터마이즈:

```ruby
target :app do
  check "build"
  signature "sig"

  configure_code_diagnostics do |hash|
    # 오류
    hash[D::UnresolvedOverloading] = :error
    hash[D::FallbackAny] = :error

    # 경고
    hash[D::UnexpectedBlockGiven] = :warning
    hash[D::IncompatibleAssignment] = :warning

    # 정보
    hash[D::UnknownConstant] = :information

    # 힌트 (가장 낮은 심각도)
    hash[D::UnsatisfiedConstraints] = :hint

    # 특정 진단 비활성화
    hash[D::UnexpectedJumpValue] = nil
  end
end
```

## 일반적인 진단

### UnresolvedOverloading

여러 메서드 오버로드가 있고, Steep이 어느 것인지 결정할 수 없음:

```rbs
# RBS에서
def process: (String) -> Integer
           | (Integer) -> String

# Steep이 UnresolvedOverloading을 보고할 수 있음
result = process(input)  # input의 타입이 불명확
```

**수정**: 타입 어노테이션을 추가하거나 타입을 더 명확하게 합니다.

### FallbackAny

Steep이 타입을 추론할 수 없어 `Any`로 대체:

```ruby
result = some_method()  # 타입 불명, Any로 대체
```

**수정**: T-Ruby 소스에 명시적 타입을 추가합니다.

### IncompatibleAssignment

할당에서 타입 불일치:

```trb
x: Integer = "string"  # 오류: 호환되지 않는 타입
```

**수정**: T-Ruby 소스에서 타입을 수정합니다.

## CI/CD 통합

### GitHub Actions

```yaml title=".github/workflows/typecheck.yml"
name: Type Check

on: [push, pull_request]

jobs:
  typecheck:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install T-Ruby
        run: gem install t-ruby

      - name: Compile T-Ruby
        run: trc compile src/

      - name: Type Check with Steep
        run: bundle exec steep check
```

### GitLab CI

```yaml title=".gitlab-ci.yml"
typecheck:
  image: ruby:3.2
  before_script:
    - gem install t-ruby
    - bundle install
  script:
    - trc compile src/
    - bundle exec steep check
```

### Pre-commit 훅

```bash title=".git/hooks/pre-commit"
#!/bin/sh

echo "Type checking with T-Ruby and Steep..."

# T-Ruby 컴파일
trc compile src/ || exit 1

# Steep 검사
steep check || exit 1

echo "Type check passed!"
```

## Steep 명령

### Check

코드를 타입 검사:

```bash
steep check
```

특정 타겟으로:
```bash
steep check --target=app
```

### Watch

변경을 감시하고 다시 검사:

```bash
steep watch
```

경로 지정:
```bash
steep watch --code=build --signature=sig
```

### Stats

타입 검사 통계 표시:

```bash
steep stats
```

출력:
```
Target: app
  Files: 25
  Methods: 147
  Classes: 18
  Modules: 5
  Type errors: 0
  Warnings: 3
```

### Validate

Steepfile 검증:

```bash
steep validate
```

### Version

Steep 버전 표시:

```bash
steep version
```

## 문제 해결

### Steep이 RBS 파일을 찾지 못함

**문제**: Steep이 타입 시그니처가 없다고 보고함.

**해결**:

```bash
# RBS 파일이 생성되었는지 확인
ls -la sig/

# Steepfile 경로 확인
cat Steepfile
```

### 타입 불일치

**문제**: Steep이 생성된 코드에서 타입 오류를 보고함.

**해결**:

1. T-Ruby 컴파일 확인:
   ```bash
   trc check src/
   ```

2. 생성된 RBS 보기:
   ```bash
   cat sig/user.rbs
   ```

3. 타입이 일치하는지 확인:
   ```bash
   trc compile --trace src/
   ```

### 라이브러리를 찾을 수 없음

**문제**: Steep이 라이브러리 타입을 찾을 수 없음.

**해결**: RBS 컬렉션을 설치하거나 Steepfile에 라이브러리 추가:

```bash
# RBS 컬렉션 초기화
rbs collection init

# 의존성 설치
rbs collection install
```

```ruby
# Steepfile에서
target :app do
  signature "sig"
  library "pathname", "json"
end
```

### 성능 문제

**문제**: 큰 프로젝트에서 Steep이 느림.

**해결**:

1. 여러 타겟 사용:
   ```ruby
   target :core do
     check "build/core"
     signature "sig/core"
   end

   target :plugins do
     check "build/plugins"
     signature "sig/plugins"
   end
   ```

2. 불필요한 파일 무시:
   ```ruby
   target :app do
     check "build"
     ignore "build/vendor/**"
   end
   ```

## 모범 사례

### 1. CI에서 Steep 실행

항상 CI에서 Steep을 실행하여 타입 오류를 잡으세요:

```yaml
- name: Type Check
  run: |
    trc compile src/
    steep check
```

### 2. 개발 중 Steep Watch 사용

즉각적인 피드백을 위해 Steep을 실행 상태로 유지:

```bash
steep watch --code=build --signature=sig
```

### 3. 적절하게 진단 설정

관대하게 시작하고 시간이 지남에 따라 엄격도 증가:

```ruby
# 여기서 시작
configure_code_diagnostics do |hash|
  hash[D::FallbackAny] = :warning
end

# 여기로 이동
configure_code_diagnostics do |hash|
  hash[D::FallbackAny] = :error
end
```

### 4. RBS 파일을 버전 관리에 유지

생성된 RBS 파일 커밋:

```bash
git add sig/
git commit -m "Update RBS signatures"
```

### 5. T-Ruby와 Steep 검사 모두 사용

T-Ruby는 컴파일 시점에 문제를 잡고, Steep은 런타임 동작을 검증:

```bash
trc check src/     # 컴파일 시점 검사
trc compile src/   # Ruby + RBS 생성
steep check        # 런타임 동작 검사
```

## Steep vs T-Ruby 타입 검사

| 측면 | T-Ruby | Steep |
|--------|--------|-------|
| 언제 | 컴파일 시점 | 컴파일 후 |
| 무엇을 | `.trb` 파일 | `.rb`와 `.rbs` 파일 |
| 목적 | T-Ruby 코드의 타입 안전성 | Ruby 출력 검증 |
| 오류 | 컴파일 방지 | 문제 보고 |
| 속도 | 빠름 (단일 파일) | 느림 (전체 프로젝트) |
| 통합 | 내장 | 별도 도구 |

**둘 다 사용**: 개발에는 T-Ruby, 검증에는 Steep.

## 실제 예제

프로덕션 애플리케이션을 위한 완전한 설정:

```ruby title="Steepfile"
target :app do
  check "build/app"
  signature "sig/app"

  library "pathname"
  library "logger"
  library "json"
  library "net-http"

  ignore "build/app/vendor/**"

  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :error
    hash[D::UnresolvedOverloading] = :warning
    hash[D::IncompatibleAssignment] = :error
  end
end

target :test do
  check "build/test"
  signature "sig/app", "sig/test"

  library "minitest"

  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :warning  # 테스트에서는 더 관대하게
  end
end
```

```yaml title="trc.yaml"
source:
  include:
    - src/app
    - src/test

output:
  ruby_dir: build
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: strict
  generate_rbs: true
```

```bash title="bin/ci"
#!/bin/bash
set -e

echo "==> Compiling T-Ruby..."
trc compile src/app --strict

echo "==> Type checking with Steep..."
steep check --target=app

echo "==> Running tests..."
ruby -Ibuild/test -Ibuild/app build/test/all_tests.rb

echo "==> All checks passed!"
```

## 다음 단계

- [Ruby LSP 통합](/docs/tooling/ruby-lsp) - Steep과 함께 IDE 지원
- [RBS 통합](/docs/tooling/rbs-integration) - RBS에 대해 더 알아보기
- [Steep 문서](https://github.com/soutaro/steep) - 공식 Steep 문서
