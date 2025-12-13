---
sidebar_position: 5
title: 프로젝트 구성
description: 프로젝트에서 T-Ruby 구성하기
---

<DocsBadge />


# 프로젝트 구성

대규모 프로젝트의 경우, T-Ruby는 컴파일러 옵션, 경로 및 동작을 관리하는 구성 파일을 사용합니다.

## 구성 파일

프로젝트 루트에 `trbconfig.yml` 파일을 생성합니다:

```yaml title="trbconfig.yml"
# T-Ruby 구성

# 컴파일러 버전 요구사항
version: ">=1.0.0"

# 소스 파일 구성
source:
  # 포함할 디렉토리
  include:
    - src
    - lib
  # 제외할 패턴
  exclude:
    - "**/*_test.trb"
    - "**/fixtures/**"

# 출력 구성
output:
  # 컴파일된 .rb 파일을 작성할 위치
  ruby_dir: build
  # .rbs 서명 파일을 작성할 위치
  rbs_dir: sig
  # 소스 디렉토리 구조 유지
  preserve_structure: true

# 컴파일러 옵션
compiler:
  # 엄격성 수준: "strict" | "standard" | "permissive"
  strictness: standard
  # .rbs 파일 생성
  generate_rbs: true
  # 대상 Ruby 버전
  target_ruby: "3.0"
```

## 프로젝트 초기화

`trc init`을 사용하여 구성 파일 생성:

```bash
trc init
```

이것은 합리적인 기본값으로 `trbconfig.yml`을 생성합니다.

대화형 설정의 경우:

```bash
trc init --interactive
```

## 구성 옵션 참조

### 소스 구성

```yaml
source:
  # .trb 파일이 있는 디렉토리
  include:
    - src
    - lib
    - app

  # 제외할 파일/패턴
  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/vendor/**"
    - "**/node_modules/**"

  # 처리할 파일 확장자 (기본: [".trb"])
  extensions:
    - .trb
    - .truby
```

### 출력 구성

```yaml
output:
  # 컴파일된 Ruby 파일용 디렉토리
  ruby_dir: build

  # RBS 서명 파일용 디렉토리
  rbs_dir: sig

  # 출력에서 소스 디렉토리 구조 유지
  # true:  src/models/user.trb → build/models/user.rb
  # false: src/models/user.trb → build/user.rb
  preserve_structure: true

  # 컴파일 전 출력 디렉토리 정리
  clean_before_build: false
```

### 컴파일러 옵션

```yaml
compiler:
  # 엄격성 수준
  # - strict: 모든 코드가 완전히 타입 지정되어야 함
  # - standard: 공개 API에 타입 필요
  # - permissive: 최소 타입 요구사항
  strictness: standard

  # RBS 파일 생성
  generate_rbs: true

  # 대상 Ruby 버전 (생성 코드에 영향)
  target_ruby: "3.0"

  # 실험적 기능 활성화
  experimental:
    - pattern_matching_types
    - refinement_types

  # 추가 타입 검사 규칙
  checks:
    # 암시적 any 타입 경고
    no_implicit_any: true
    # 사용하지 않는 변수 오류
    no_unused_vars: false
    # 엄격한 nil 검사
    strict_nil: true
```

### 감시 모드 구성

```yaml
watch:
  # 추가로 감시할 디렉토리
  paths:
    - config

  # 디바운스 지연 (밀리초)
  debounce: 100

  # 리빌드 시 터미널 지우기
  clear_screen: true

  # 성공적인 컴파일 후 실행할 명령
  on_success: "bundle exec rspec"
```

### 타입 해결

```yaml
types:
  # 추가 타입 정의 경로
  paths:
    - types
    - vendor/types

  # 표준 라이브러리 타입 자동 가져오기
  stdlib: true

  # 외부 타입 정의
  external:
    - rails
    - rspec
```

## 디렉토리 구조

일반적인 T-Ruby 프로젝트 구조:

```
my-project/
├── trbconfig.yml              # 구성
├── src/                  # T-Ruby 소스 파일
│   ├── models/
│   │   ├── user.trb
│   │   └── post.trb
│   ├── services/
│   │   └── auth_service.trb
│   └── main.trb
├── types/                # 사용자 정의 타입 정의
│   └── external.rbs
├── build/                # 컴파일된 Ruby 출력
│   ├── models/
│   │   ├── user.rb
│   │   └── post.rb
│   └── ...
├── sig/                  # 생성된 RBS 파일
│   ├── models/
│   │   ├── user.rbs
│   │   └── post.rbs
│   └── ...
└── test/                 # 테스트 (.rb 또는 .trb 가능)
    └── ...
```

## 환경별 구성

환경 변수 또는 여러 구성 파일 사용:

```yaml title="trbconfig.yml"
# 기본 구성

compiler:
  strictness: ${TRC_STRICTNESS:-standard}

output:
  ruby_dir: ${TRC_OUTPUT:-build}
```

또는 별도 파일 사용:

```bash
# 개발
trc --config trc.development.yaml

# 프로덕션
trc --config trc.production.yaml
```

## Bundler 통합

Gemfile에 T-Ruby 추가:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/project_configuration_spec.rb" line={25} />

```ruby title="Gemfile"
source "https://rubygems.org"

group :development do
  gem "t-ruby"
end

# 다른 의존성
```

Rake 태스크 생성:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/project_configuration_spec.rb" line={35} />

```ruby title="Rakefile"
require "t-ruby/rake_task"

TRuby::RakeTask.new(:compile) do |t|
  t.config_file = "trbconfig.yml"
end

# 테스트 실행 전 컴파일
task test: :compile
```

이제 다음을 실행할 수 있습니다:

```bash
bundle exec rake compile
bundle exec rake test
```

## Rails 통합

Rails 프로젝트의 경우, Rails 구조에 맞게 T-Ruby 구성:

```yaml title="trbconfig.yml"
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - lib

output:
  ruby_dir: app  # 제자리에서 컴파일
  preserve_structure: true

compiler:
  strictness: standard

types:
  external:
    - rails
    - activerecord
```

`config/application.rb`에 추가:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/project_configuration_spec.rb" line={45} />

```ruby
# 개발 중 .trb 파일 감시
config.watchable_extensions << "trb"
```

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

      - name: Type Check
        run: trc check .

      - name: Compile
        run: trc .
```

### GitLab CI

```yaml title=".gitlab-ci.yml"
typecheck:
  image: ruby:3.2
  script:
    - gem install t-ruby
    - trc check .
    - trc .
```

## 모노레포 구성

여러 패키지가 있는 모노레포의 경우:

```
monorepo/
├── packages/
│   ├── core/
│   │   ├── trbconfig.yml
│   │   └── src/
│   ├── web/
│   │   ├── trbconfig.yml
│   │   └── src/
│   └── api/
│       ├── trbconfig.yml
│       └── src/
└── trc.workspace.yaml
```

```yaml title="trc.workspace.yaml"
workspace:
  packages:
    - packages/core
    - packages/web
    - packages/api

  # 공유 구성
  shared:
    compiler:
      strictness: strict
      target_ruby: "3.2"
```

모든 패키지 빌드:

```bash
trc --workspace
```

## 다음 단계

프로젝트가 구성되었으니 다음을 탐색하세요:

- [CLI 명령](/docs/cli/commands) - 사용 가능한 모든 명령
- [컴파일러 옵션](/docs/cli/compiler-options) - 상세 옵션 참조
- [타입 어노테이션](/docs/learn/basics/type-annotations) - 타입 코드 작성 시작
