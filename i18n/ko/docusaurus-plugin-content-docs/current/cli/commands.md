---
sidebar_position: 1
title: 명령어
description: trc CLI 명령어 레퍼런스
---

<DocsBadge />


# 명령어

`trc` 명령줄 인터페이스는 T-Ruby로 작업하기 위한 주요 도구입니다. `.trb` 파일을 Ruby로 컴파일하고, 코드를 타입 체크하며, RBS 시그니처를 생성합니다.

## 개요

```bash
trc [명령어] [옵션] [파일...]
```

사용 가능한 명령어:

- `compile` - T-Ruby 파일을 Ruby 및 RBS로 컴파일
- `watch` - 파일을 감시하고 변경 시 자동 컴파일
- `check` - 출력을 생성하지 않고 타입 체크
- `init` - 새 T-Ruby 프로젝트 초기화

## compile

T-Ruby 소스 파일(`.trb`)을 Ruby(`.rb`) 및 RBS(`.rbs`) 파일로 컴파일합니다.

### 기본 사용법

```bash
# 단일 파일 컴파일
trc compile hello.trb

# 여러 파일 컴파일
trc compile user.trb post.trb

# 디렉토리의 모든 .trb 파일 컴파일
trc compile src/

# 현재 디렉토리 컴파일
trc compile .
```

### 축약형

`compile` 명령어는 기본값이므로 생략할 수 있습니다:

```bash
trc hello.trb
trc src/
trc .
```

### 옵션

```bash
# 출력 디렉토리 지정
trc compile src/ --output build/

# Ruby 파일만 생성 (RBS 생략)
trc compile src/ --no-rbs

# RBS 파일만 생성 (Ruby 생략)
trc compile src/ --rbs-only

# RBS 출력 디렉토리 지정
trc compile src/ --rbs-dir sig/

# 특정 설정 파일 사용
trc compile src/ --config trc.production.yaml

# 컴파일 전 출력 디렉토리 정리
trc compile . --clean

# 상세 출력 표시
trc compile . --verbose

# 에러를 제외한 모든 출력 억제
trc compile . --quiet
```

### 예제

**커스텀 출력 디렉토리로 컴파일:**

```bash
trc compile src/ \
  --output build/ \
  --rbs-dir signatures/
```

**프로덕션용 컴파일 (클린 빌드, 디버그 정보 없음):**

```bash
trc compile . \
  --clean \
  --quiet \
  --no-debug-info
```

**소스 구조를 유지하면서 컴파일:**

```bash
trc compile src/ \
  --output build/ \
  --preserve-structure
```

이렇게 변환됩니다:
```
src/
├── models/
│   └── user.trb
└── services/
    └── auth.trb
```

결과:
```
build/
├── models/
│   └── user.rb
└── services/
    └── auth.rb
```

### 종료 코드

- `0` - 성공
- `1` - 컴파일 에러
- `2` - 타입 에러
- `3` - 설정 에러

## watch

T-Ruby 파일을 감시하고 변경이 감지되면 자동으로 다시 컴파일합니다. 개발 워크플로우에 적합합니다.

### 기본 사용법

```bash
# 현재 디렉토리 감시
trc watch

# 특정 디렉토리 감시
trc watch src/

# 여러 디렉토리 감시
trc watch src/ lib/
```

### 옵션

```bash
# 각 재빌드 시 터미널 지우기
trc watch --clear

# 성공적인 컴파일 후 명령 실행
trc watch --exec "bundle exec rspec"

# 디바운스 지연 밀리초 (기본값: 100)
trc watch --debounce 300

# 추가 파일 패턴 감시
trc watch --include "**/*.yaml"

# 특정 패턴 무시
trc watch --ignore "**/test/**"

# 첫 번째 성공적인 컴파일 후 종료
trc watch --once
```

### 예제

**감시하고 성공 시 테스트 실행:**

```bash
trc watch src/ --exec "bundle exec rake test"
```

**커스텀 디바운스로 감시:**

```bash
# 마지막 변경 후 500ms 대기 후 컴파일
trc watch --debounce 500
```

**설정 파일도 감시:**

```bash
trc watch src/ --include "trbconfig.yml"
```

### 출력

감시 모드는 실시간 피드백을 제공합니다:

```
src/에서 파일 변경 감시 중...

[10:30:15] 변경됨: src/models/user.trb
[10:30:15] 컴파일 중...
[10:30:16] ✓ 성공적으로 컴파일됨 (1.2s)
[10:30:16] 생성됨:
  - build/models/user.rb
  - sig/models/user.rbs

변경 대기 중...
```

에러가 있는 경우:

```
[10:31:20] 변경됨: src/models/user.trb
[10:31:20] 컴파일 중...
[10:31:21] ✗ 컴파일 실패

에러: src/models/user.trb:15:23
  타입 불일치: String 예상, Integer 받음

    @email = user_id
              ^^^^^^^

변경 대기 중...
```

### 키보드 단축키

감시 모드 실행 중:

- `Ctrl+C` - 감시 중지 및 종료
- `r` - 강제 재컴파일
- `c` - 터미널 지우기
- `q` - 종료

## check

출력을 생성하지 않고 T-Ruby 파일을 타입 체크합니다. CI/CD 파이프라인과 빠른 검증에 유용합니다.

### 기본 사용법

```bash
# 단일 파일 체크
trc check hello.trb

# 여러 파일 체크
trc check src/**/*.trb

# 전체 디렉토리 체크
trc check .
```

### 옵션

```bash
# 엄격 모드 (경고에서도 실패)
trc check . --strict

# 에러와 함께 경고도 표시
trc check . --warnings

# 리포트 형식 (text, json, junit)
trc check . --format json

# 리포트를 파일로 출력
trc check . --output-file report.json

# 표시할 최대 에러 수 (기본값: 50)
trc check . --max-errors 10

# 첫 번째 에러에서 계속 (기본값: 50개 에러 후 중지)
trc check . --no-error-limit
```

### 예제

**커밋 전 체크:**

```bash
# .git/hooks/pre-commit에 추가
#!/bin/sh
trc check . --strict
```

**툴링용 JSON 리포트 생성:**

```bash
trc check . \
  --format json \
  --output-file type-errors.json
```

**최소 출력으로 빠른 체크:**

```bash
trc check src/ --quiet --max-errors 5
```

### 출력 형식

**텍스트 (기본값):**

```
15개 파일 체크 중...

에러: src/models/user.trb:23:15
  타입 불일치: String 예상, Integer 받음

    return user_id
           ^^^^^^^

에러: src/services/auth.trb:45:8
  nil에 'authenticate' 메서드 정의되지 않음

    user.authenticate(password)
    ^^^^

✗ 2개 파일에서 2개 에러 발견
```

**JSON:**

```json
{
  "files_checked": 15,
  "errors": [
    {
      "file": "src/models/user.trb",
      "line": 23,
      "column": 15,
      "severity": "error",
      "message": "타입 불일치: String 예상, Integer 받음",
      "code": "type-mismatch"
    }
  ],
  "summary": {
    "error_count": 2,
    "warning_count": 0,
    "files_with_errors": 2
  }
}
```

**JUnit XML (CI 통합용):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="T-Ruby Type Check" tests="15" failures="2">
    <testcase name="src/models/user.trb">
      <failure message="타입 불일치: String 예상, Integer 받음">
        Line 23, column 15
      </failure>
    </testcase>
  </testsuite>
</testsuites>
```

### 종료 코드

- `0` - 에러 없음
- `1` - 타입 에러 발견
- `2` - 경고 발견 (`--strict`에서만)

## init

설정 파일과 디렉토리 구조로 새 T-Ruby 프로젝트를 초기화합니다.

### 기본 사용법

```bash
# 현재 디렉토리에 trbconfig.yml 생성
trc init

# 대화형 설정
trc init --interactive

# 템플릿 사용
trc init --template rails
```

### 옵션

```bash
# 프롬프트 없이 기본값 사용
trc init --yes

# 프로젝트 이름 지정
trc init --name my-project

# 템플릿 선택 (basic, rails, gem, sinatra)
trc init --template rails

# 디렉토리 구조 생성
trc init --create-dirs

# git 저장소 초기화
trc init --git
```

### 템플릿

**Basic (기본값):**

```bash
trc init --template basic
```

생성됨:
```
trbconfig.yml
src/
build/
sig/
```

**Rails:**

```bash
trc init --template rails
```

Rails 프로젝트용 설정 생성:
```yaml
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - lib

output:
  ruby_dir: app
  preserve_structure: true

compiler:
  strictness: standard

types:
  external:
    - rails
    - activerecord
```

**Gem:**

```bash
trc init --template gem
```

gem 개발용 설정 생성:
```yaml
source:
  include:
    - lib
  exclude:
    - "**/*_spec.trb"

output:
  ruby_dir: lib
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: strict
  generate_rbs: true
```

**Sinatra:**

```bash
trc init --template sinatra
```

Sinatra 앱용 설정 생성:
```yaml
source:
  include:
    - app
    - lib

output:
  ruby_dir: build
  rbs_dir: sig

compiler:
  strictness: standard

types:
  external:
    - sinatra
```

### 대화형 모드

```bash
trc init --interactive
```

설정을 안내합니다:

```
T-Ruby 프로젝트 설정
====================

? 프로젝트 이름: my-awesome-project
? 프로젝트 유형: (화살표 키 사용)
  ❯ Basic
    Rails
    Gem
    Sinatra
    Custom

? 소스 디렉토리: src
? 출력 디렉토리: build
? RBS 디렉토리: sig

? 엄격성 수준: (화살표 키 사용)
    Strict (모든 코드에 타입 필수)
  ❯ Standard (공개 API에 타입 필수)
    Permissive (최소 요구사항)

? RBS 파일 생성? Yes
? 대상 Ruby 버전: 3.2

? 디렉토리 구조 생성? Yes
? git 저장소 초기화? Yes

✓ trbconfig.yml 생성됨
✓ src/ 생성됨
✓ build/ 생성됨
✓ sig/ 생성됨
✓ git 저장소 초기화됨

T-Ruby 프로젝트가 준비되었습니다! 시도해보세요:

  trc compile src/
  trc watch src/
```

### 예제

**새 프로젝트 빠른 시작:**

```bash
mkdir my-project
cd my-project
trc init --yes --create-dirs
```

**Rails 프로젝트 설정:**

```bash
cd my-rails-app
trc init --template rails --interactive
```

**Gem 개발:**

```bash
bundle gem my_gem
cd my_gem
trc init --template gem --create-dirs
```

## 전역 옵션

이 옵션은 모든 명령어에서 작동합니다:

```bash
# 버전 표시
trc --version
trc -v

# 도움말 표시
trc --help
trc -h

# 특정 명령어 도움말 표시
trc compile --help

# 특정 설정 파일 사용
trc --config path/to/trbconfig.yml

# 로그 레벨 설정 (debug, info, warn, error)
trc --log-level debug

# 컬러 출력 활성화 (기본값: auto)
trc --color

# 컬러 출력 비활성화
trc --no-color

# 에러 시 스택 트레이스 표시
trc --stack-trace
```

## 설정 파일

명령어는 `trbconfig.yml` 설정 파일을 따릅니다. 명령줄 옵션이 설정 파일 설정을 재정의합니다.

예제 워크플로우:

```yaml title="trbconfig.yml"
source:
  include:
    - src
  exclude:
    - "**/*_test.trb"

output:
  ruby_dir: build
  rbs_dir: sig

compiler:
  strictness: standard
  generate_rbs: true
```

그런 다음 간단히 실행:

```bash
# trbconfig.yml의 설정 사용
trc compile
trc watch
trc check
```

## CI/CD 사용

### GitHub Actions

```yaml
- name: Type Check
  run: trc check . --format junit --output-file test-results.xml

- name: Compile
  run: trc compile . --quiet
```

### GitLab CI

```yaml
typecheck:
  script:
    - trc check . --strict
    - trc compile .
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# 스테이징된 .trb 파일 가져오기
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.trb$')

if [ -n "$STAGED_FILES" ]; then
  echo "스테이징된 파일 타입 체크 중..."
  trc check $STAGED_FILES --strict

  if [ $? -ne 0 ]; then
    echo "타입 체크 실패. 커밋이 중단되었습니다."
    exit 1
  fi
fi
```

## 팁과 모범 사례

### 개발 워크플로우

1. **개발 중 감시 모드 사용:**
   ```bash
   trc watch src/ --clear --exec "bundle exec rspec"
   ```

2. **커밋 전 체크 실행:**
   ```bash
   trc check . --strict
   ```

3. **스크립트에서 조용한 모드 사용:**
   ```bash
   trc compile . --quiet || exit 1
   ```

### 성능

1. **가능하면 전체 디렉토리 대신 특정 파일 컴파일:**
   ```bash
   # 더 빠름
   trc compile src/models/user.trb

   # 더 느림
   trc compile src/
   ```

2. **RBS 파일이 필요 없으면 `--no-rbs` 사용:**
   ```bash
   trc compile . --no-rbs
   ```

3. **대규모 프로젝트에서 감시 모드의 디바운스 증가:**
   ```bash
   trc watch --debounce 500
   ```

### 문제 해결

**명령어를 찾을 수 없음:**
```bash
# 설치 확인
which trc

# 필요시 재설치
gem install t-ruby
```

**느린 컴파일:**
```bash
# 상세 모드로 무엇이 시간을 소비하는지 확인
trc compile . --verbose

# 설정 확인
trc compile . --log-level debug
```

**예상치 못한 출력 위치:**
```bash
# 설정 확인
cat trbconfig.yml

# 또는 명시적으로 지정
trc compile src/ --output build/ --rbs-dir sig/
```

## 다음 단계

- [설정 레퍼런스](/docs/cli/configuration) - `trbconfig.yml` 옵션 배우기
- [컴파일러 옵션](/docs/cli/compiler-options) - 상세한 컴파일러 플래그 및 설정
- [프로젝트 설정](/docs/getting-started/project-configuration) - 프로젝트 설정하기
