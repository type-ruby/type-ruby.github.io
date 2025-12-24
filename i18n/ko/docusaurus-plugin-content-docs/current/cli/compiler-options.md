---
sidebar_position: 3
title: 컴파일러 옵션
description: 사용 가능한 모든 컴파일러 옵션
---

<DocsBadge />


# 컴파일러 옵션

T-Ruby의 컴파일러는 컴파일, 타입 검사, 코드 생성을 제어하기 위한 다양한 옵션을 제공합니다. 이 레퍼런스는 사용 가능한 모든 명령줄 플래그와 그 효과를 다룹니다.

## 개요

컴파일러 옵션은 세 가지 방법으로 지정할 수 있습니다:

1. **명령줄 플래그**: `trc --strict compile src/`
2. **설정 파일**: `trbconfig.yml`의 `compiler:` 섹션에서
3. **환경 변수**: `TRC_STRICT=true trc compile src/`

명령줄 플래그가 설정 파일 설정보다 우선합니다.

## 타입 검사 옵션

### --strict

엄격한 타입 검사 모드를 활성화합니다. 설정의 `strictness: strict`와 동일합니다.

```bash
trc compile --strict src/
```

엄격 모드에서:
- 모든 함수 매개변수와 반환 타입 필수
- 모든 인스턴스 변수에 타입 지정 필수
- 암시적 `any` 타입 불가
- 엄격한 nil 검사 활성화

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={25} />

```trb
# 엄격 모드는 전체 타입 지정 필요
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result: Hash<String, Integer> = {}
  result
end
```

### --permissive

관용적 타입 검사 모드를 활성화합니다. 점진적 타이핑을 허용합니다.

```bash
trc compile --permissive src/
```

관용 모드에서:
- 타입 선택적
- 암시적 `any` 허용
- 명시적 타입 오류만 캐치

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={36} />

```ruby
# 관용 모드는 타입 없는 코드 허용
def process(data)
  @count = 0
  result = {}
  result
end
```

### --no-implicit-any

암시적 `any` 타입을 허용하지 않습니다.

```bash
trc compile --no-implicit-any src/
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={46} />

```trb
# --no-implicit-any 사용 시 오류
def process(data)  # 오류: 암시적 any
  # ...
end

# 명시적으로 지정해야 함
def process(data: Any)  # OK
  # ...
end
```

### --strict-nil

엄격한 nil 검사를 활성화합니다.

```bash
trc compile --strict-nil src/
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={57} />

```trb
# --strict-nil 사용 시 오류
def find_user(id: Integer): User  # 오류: nil을 반환할 수 있음
  users.find { |u| u.id == id }
end

# 타입에 nil 포함 필요
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end
```

### --no-unused-vars

사용되지 않는 변수와 매개변수에 대해 경고합니다.

```bash
trc compile --no-unused-vars src/
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={68} />

```trb
# --no-unused-vars 사용 시 경고
def calculate(x: Integer, y: Integer): Integer
  x * 2  # 경고: y가 사용되지 않음
end

# 의도적으로 사용하지 않음을 나타내려면 밑줄 접두사 사용
def calculate(x: Integer, _y: Integer): Integer
  x * 2  # 경고 없음
end
```

### --no-unchecked-indexed-access

배열/해시 접근 전 검사를 요구합니다.

```bash
trc compile --no-unchecked-indexed-access src/
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={79} />

```trb
# --no-unchecked-indexed-access 사용 시 오류
users: Array<User> = get_users()
user = users[0]  # 오류: nil일 수 있음

# 먼저 검사해야 함
if users[0]
  user = users[0]  # OK
end
```

### --require-return-types

모든 함수에 명시적 반환 타입을 요구합니다.

```bash
trc compile --require-return-types src/
```

<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={90} />

```trb
# --require-return-types 사용 시 오류
def calculate(x: Integer)  # 오류: 반환 타입 누락
  x * 2
end

# 반환 타입 지정 필요
def calculate(x: Integer): Integer
  x * 2
end
```

## 출력 옵션

### --output, -o

컴파일된 Ruby 파일의 출력 디렉토리를 지정합니다.

```bash
trc compile src/ --output build/
trc compile src/ -o build/
```

기본값: `build/`

### --rbs-dir

RBS 시그니처 파일의 출력 디렉토리를 지정합니다.

```bash
trc compile src/ --rbs-dir sig/
```

기본값: `sig/`

### --no-rbs

RBS 파일 생성을 건너뜁니다.

```bash
trc compile src/ --no-rbs
```

다음과 같은 경우 유용합니다:
- Ruby 출력만 필요할 때
- RBS 파일이 다른 곳에서 생성될 때
- 빠른 컴파일이 필요할 때

### --rbs-only

RBS 파일만 생성하고 Ruby 출력을 건너뜁니다.

```bash
trc compile src/ --rbs-only
```

다음과 같은 경우 유용합니다:
- 타입 시그니처 업데이트
- 컴파일 없이 타입 검사
- 기존 Ruby 코드에 대한 타입 생성

### --preserve-structure

출력에서 소스 디렉토리 구조를 유지합니다.

```bash
trc compile src/ --preserve-structure
```

```
src/models/user.trb → build/models/user.rb
```

### --no-preserve-structure

출력 디렉토리 구조를 평면화합니다.

```bash
trc compile src/ --no-preserve-structure
```

```
src/models/user.trb → build/user.rb
```

### --clean

컴파일 전에 출력 디렉토리를 정리합니다.

```bash
trc compile --clean src/
```

컴파일 전에 `output`과 `rbs_dir`의 모든 파일을 제거합니다.

## 대상 옵션

### --target-ruby

생성된 코드의 대상 Ruby 버전을 지정합니다.

```bash
trc compile --target-ruby 3.2 src/
```

지원: `2.7`, `3.0`, `3.1`, `3.2`, `3.3`

영향:
- 사용되는 구문 기능
- 표준 라이브러리 호환성
- 메서드 사용 가능 여부

예시:

**패턴 매칭 (Ruby 3.0+):**
```bash
# 대상 3.0+
trc compile --target-ruby 3.0 src/

# 네이티브 패턴 매칭 사용
case value
in { name: n }
  puts n
end
```

```bash
# 대상 2.7
trc compile --target-ruby 2.7 src/

# 호환 코드로 컴파일
case
when value.is_a?(Hash) && value[:name]
  n = value[:name]
  puts n
end
```

### --experimental

실험적 기능을 활성화합니다.

```bash
trc compile --experimental pattern_matching_types src/
```

여러 기능:
```bash
trc compile \
  --experimental pattern_matching_types \
  --experimental refinement_types \
  src/
```

사용 가능한 실험적 기능:

- `pattern_matching_types` - 패턴 매칭에서 타입 추론
- `refinement_types` - 리파인먼트 기반 타입 좁히기
- `variadic_generics` - 가변 길이 제네릭 매개변수
- `higher_kinded_types` - 타입 매개변수로서의 타입 생성자
- `dependent_types` - 값에 의존하는 타입

**경고:** 실험적 기능은 변경되거나 제거될 수 있습니다.

## 최적화 옵션

### --optimize

코드 최적화를 활성화합니다.

```bash
trc compile --optimize basic src/
```

레벨:
- `none` - 최적화 없음 (기본값)
- `basic` - 안전한 최적화
- `aggressive` - 최대 최적화

**none:**
<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={101} />

```ruby
# 코드 구조 변경 없음
CONSTANT = 42

def calculate
  CONSTANT * 2
end
```

**basic:**
<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={111} />

```ruby
# 상수 인라인, 데드 코드 제거
def calculate
  84  # 상수 폴딩
end
```

**aggressive:**
<ExampleBadge status="pass" testFile="spec/docs_site/pages/cli/compiler_options_spec.rb" line={121} />

```ruby
# 함수 인라인, 코드 재정렬 가능
def calculate
  84
end
```

### --no-optimize

모든 최적화를 비활성화합니다.

```bash
trc compile --no-optimize src/
```

출력이 소스 구조와 정확히 일치하도록 보장합니다.

## 소스 옵션

### --include

추가 소스 파일이나 디렉토리를 포함합니다.

```bash
trc compile src/ --include lib/ --include config/
```

### --exclude

컴파일에서 파일이나 패턴을 제외합니다.

```bash
trc compile src/ --exclude "**/*_test.trb"
```

여러 제외:
```bash
trc compile src/ \
  --exclude "**/*_test.trb" \
  --exclude "**/*_spec.trb" \
  --exclude "**/fixtures/**"
```

### --extensions

처리할 파일 확장자를 지정합니다.

```bash
trc compile src/ --extensions .trb,.truby
```

기본값: `.trb`

## 타입 옵션

### --type-paths

타입 정의가 포함된 디렉토리를 추가합니다.

```bash
trc compile src/ --type-paths types/,vendor/types/
```

### --no-stdlib

표준 라이브러리 타입 정의를 포함하지 않습니다.

```bash
trc compile --no-stdlib src/
```

커스텀 stdlib 타입을 제공할 때 유용합니다.

### --external-types

외부 타입 정의를 가져옵니다.

```bash
trc compile --external-types rails,rspec src/
```

여러 라이브러리:
```bash
trc compile \
  --external-types rails \
  --external-types activerecord \
  --external-types rspec \
  src/
```

## 감시 옵션

(`trc watch` 명령용)

### --debounce

디바운스 지연을 밀리초 단위로 설정합니다.

```bash
trc watch --debounce 300 src/
```

기본값: 100ms

마지막 파일 변경 후 300ms 대기 후 재컴파일합니다.

### --clear

각 재컴파일 시 터미널 화면을 지웁니다.

```bash
trc watch --clear src/
```

### --exec

성공적인 컴파일 후 명령을 실행합니다.

```bash
trc watch --exec "bundle exec rspec" src/
```

### --on-success

`--exec`의 별칭입니다.

```bash
trc watch --on-success "rake test" src/
```

### --on-failure

실패한 컴파일 후 명령을 실행합니다.

```bash
trc watch --on-failure "notify-send 'Build failed'" src/
```

### --watch-paths

추가 디렉토리를 감시합니다.

```bash
trc watch src/ --watch-paths config/,types/
```

### --ignore

감시 모드에서 파일 패턴을 무시합니다.

```bash
trc watch --ignore "**/tmp/**" src/
```

### --once

한 번 컴파일하고 종료합니다 (변경 감시 안 함).

```bash
trc watch --once src/
```

감시 모드 설정 테스트에 유용합니다.

## 검사 옵션

(`trc check` 명령용)

### --format

타입 검사 결과의 출력 형식을 지정합니다.

```bash
trc check --format json src/
```

형식:
- `text` - 사람이 읽기 쉬운 형식 (기본값)
- `json` - JSON 형식
- `junit` - JUnit XML 형식

**text:**
```
Error: src/user.trb:15:10
  Type mismatch: expected String, got Integer
```

**json:**
```json
{
  "files_checked": 10,
  "errors": [{
    "file": "src/user.trb",
    "line": 15,
    "column": 10,
    "severity": "error",
    "message": "Type mismatch: expected String, got Integer"
  }]
}
```

**junit:**
```xml
<testsuites>
  <testsuite name="T-Ruby Type Check" tests="10" failures="1">
    <testcase name="src/user.trb">
      <failure message="Type mismatch">...</failure>
    </testcase>
  </testsuite>
</testsuites>
```

### --output-file

검사 결과를 파일에 씁니다.

```bash
trc check --format json --output-file results.json src/
```

### --max-errors

표시할 오류 수를 제한합니다.

```bash
trc check --max-errors 10 src/
```

기본값: 50

### --no-error-limit

모든 오류를 표시합니다 (제한 없음).

```bash
trc check --no-error-limit src/
```

### --warnings

오류 외에 경고도 표시합니다.

```bash
trc check --warnings src/
```

## 초기화 옵션

(`trc --init` 명령용)

### --template

프로젝트 템플릿을 사용합니다.

```bash
trc --init --template rails
```

템플릿:
- `basic` - 기본 프로젝트 (기본값)
- `rails` - Rails 애플리케이션
- `gem` - Ruby gem
- `sinatra` - Sinatra 애플리케이션

### --interactive

대화형 프로젝트 설정.

```bash
trc --init --interactive
```

모든 설정 옵션을 프롬프트합니다.

### --yes, -y

프롬프트 없이 모든 기본값을 수락합니다.

```bash
trc --init --yes
trc --init -y
```

### --name

프로젝트 이름을 설정합니다.

```bash
trc --init --name my-awesome-project
```

### --create-dirs

디렉토리 구조를 생성합니다.

```bash
trc --init --create-dirs
```

`src/`, `build/`, `sig/` 디렉토리를 생성합니다.

### --git

git 저장소를 초기화합니다.

```bash
trc --init --git
```

`.git/`과 `.gitignore`를 생성합니다.

## 로깅 및 디버그 옵션

### --verbose, -v

상세 출력을 표시합니다.

```bash
trc compile --verbose src/
trc compile -v src/
```

표시 내용:
- 처리 중인 파일
- 타입 해결 세부 정보
- 컴파일 단계

### --quiet, -q

오류가 아닌 출력을 억제합니다.

```bash
trc compile --quiet src/
trc compile -q src/
```

오류만 표시합니다.

### --log-level

로깅 레벨을 설정합니다.

```bash
trc compile --log-level debug src/
```

레벨:
- `debug` - 모든 메시지
- `info` - 정보성 메시지 (기본값)
- `warn` - 경고와 오류
- `error` - 오류만

### --stack-trace

오류 시 스택 트레이스를 표시합니다.

```bash
trc compile --stack-trace src/
```

컴파일러 문제 디버깅에 유용합니다.

### --profile

성능 프로파일링 정보를 표시합니다.

```bash
trc compile --profile src/
```

출력:
```
Compilation completed in 2.4s

Phase breakdown:
  Parse:        0.8s (33%)
  Type check:   1.2s (50%)
  Code gen:     0.3s (12%)
  Write files:  0.1s (5%)
```

## 설정 옵션

### --config, -c

특정 설정 파일을 사용합니다.

```bash
trc compile --config trc.production.yaml src/
trc compile -c trc.production.yaml src/
```

### --no-config

설정 파일을 무시합니다.

```bash
trc compile --no-config src/
```

명령줄 옵션과 기본값만 사용합니다.

### --print-config

유효한 설정을 출력하고 종료합니다.

```bash
trc compile --print-config src/
```

파일, 환경, 명령줄에서 병합된 설정을 표시합니다.

## 출력 제어 옵션

### --color

색상 출력을 강제합니다.

```bash
trc compile --color src/
```

### --no-color

색상 출력을 비활성화합니다.

```bash
trc compile --no-color src/
```

다음과 같은 경우 유용합니다:
- CI/CD 환경
- 로그 파일 출력
- 비터미널 출력

### --progress

컴파일 중 진행률 표시줄을 표시합니다.

```bash
trc compile --progress src/
```

```
Compiling: [████████████████░░░░] 80% (40/50 files)
```

### --no-progress

진행률 표시줄을 비활성화합니다.

```bash
trc compile --no-progress src/
```

## 병렬 컴파일 옵션

### --parallel

병렬 컴파일을 활성화합니다.

```bash
trc compile --parallel src/
```

여러 파일을 동시에 컴파일합니다.

### --jobs, -j

병렬 작업 수를 지정합니다.

```bash
trc compile --parallel --jobs 4 src/
trc compile --parallel -j 4 src/
```

기본값: CPU 코어 수

### --no-parallel

병렬 컴파일을 비활성화합니다 (직렬 컴파일).

```bash
trc compile --no-parallel src/
```

다음과 같은 경우 유용합니다:
- 디버깅
- 메모리 제한 환경
- 재현 가능한 출력 순서

## 캐싱 옵션

### --cache

컴파일 캐시를 활성화합니다.

```bash
trc compile --cache src/
```

타입 정보와 파싱된 AST를 캐시하여 후속 컴파일을 빠르게 합니다.

### --no-cache

컴파일 캐시를 비활성화합니다.

```bash
trc compile --no-cache src/
```

전체 재컴파일을 강제합니다.

### --cache-dir

캐시 디렉토리를 지정합니다.

```bash
trc compile --cache --cache-dir .trc-cache/ src/
```

기본값: `.trc-cache/`

### --clear-cache

실행 전 컴파일 캐시를 지웁니다.

```bash
trc compile --clear-cache src/
```

## 고급 옵션

### --ast

Ruby 코드 대신 추상 구문 트리를 출력합니다.

```bash
trc compile --ast src/user.trb
```

다음과 같은 경우 유용합니다:
- 파서 문제 디버깅
- 코드 구조 이해
- 도구 빌드

### --tokens

렉서에서 토큰 스트림을 출력합니다.

```bash
trc compile --tokens src/user.trb
```

### --trace

타입 검사 프로세스를 추적합니다.

```bash
trc compile --trace src/
```

자세한 타입 추론 및 검사 단계를 표시합니다.

### --dump-types

추론된 타입을 파일에 덤프합니다.

```bash
trc compile --dump-types types.json src/
```

### --allow-errors

타입 오류가 있어도 컴파일을 계속합니다.

```bash
trc compile --allow-errors src/
```

타입 오류에도 불구하고 Ruby 출력을 생성합니다. 다음과 같은 경우 유용합니다:
- 생성된 코드 디버깅
- 점진적 마이그레이션
- 테스트

**경고:** 생성된 코드에 런타임 오류가 있을 수 있습니다.

### --source-maps

디버깅을 위한 소스 맵을 생성합니다.

```bash
trc compile --source-maps src/
```

Ruby 코드를 T-Ruby 소스에 매핑하는 `.rb.map` 파일을 생성합니다.

## 조합 예시

### 엄격한 프로덕션 빌드

```bash
trc compile \
  --strict \
  --no-implicit-any \
  --strict-nil \
  --optimize aggressive \
  --clean \
  --target-ruby 3.2 \
  src/
```

### 감시 모드로 개발

```bash
trc watch \
  --permissive \
  --clear \
  --debounce 200 \
  --exec "bundle exec rspec" \
  src/
```

### CI/CD 타입 검사

```bash
trc check \
  --strict \
  --format junit \
  --output-file test-results.xml \
  --no-color \
  --quiet \
  src/
```

### 빠른 증분 빌드

```bash
trc compile \
  --cache \
  --parallel \
  --jobs 8 \
  --no-rbs \
  src/
```

### 컴파일 문제 디버그

```bash
trc compile \
  --verbose \
  --stack-trace \
  --profile \
  --log-level debug \
  --no-parallel \
  src/
```

## 환경 변수

많은 옵션을 환경 변수로 설정할 수 있습니다:

```bash
export TRC_STRICT=true
export TRC_TARGET_RUBY=3.2
export TRC_OUTPUT_DIR=build
export TRC_CACHE=true
export TRC_PARALLEL=true
export TRC_JOBS=4

trc compile src/
```

변수는 설정 파일을 덮어쓰지만 명령줄 플래그로 덮어쓸 수 있습니다.

## 옵션 우선순위

옵션은 다음 순서로 해결됩니다 (나중 것이 이전 것을 덮어씀):

1. 기본값
2. 설정 파일 (`trbconfig.yml`)
3. 환경 변수
4. 명령줄 플래그

예시:

```yaml
# trbconfig.yml
compiler:
  strictness: standard
```

```bash
# 환경 변수
export TRC_STRICTNESS=permissive

# 명령줄 플래그가 우선
trc compile --strict src/

# 유효값: strictness = strict
```

## 옵션 그룹 레퍼런스

### 타입 검사
- `--strict`, `--permissive`
- `--no-implicit-any`
- `--strict-nil`
- `--no-unused-vars`
- `--no-unchecked-indexed-access`
- `--require-return-types`

### 출력 제어
- `--output`, `-o`
- `--rbs-dir`
- `--no-rbs`, `--rbs-only`
- `--preserve-structure`
- `--clean`

### 대상 및 최적화
- `--target-ruby`
- `--optimize`
- `--experimental`

### 로깅
- `--verbose`, `-v`
- `--quiet`, `-q`
- `--log-level`
- `--stack-trace`
- `--profile`

### 성능
- `--parallel`, `--jobs`
- `--cache`, `--cache-dir`
- `--no-parallel`

### 고급
- `--ast`, `--tokens`
- `--trace`
- `--dump-types`
- `--allow-errors`
- `--source-maps`

## 다음 단계

- [명령어 레퍼런스](/docs/cli/commands) - 모든 CLI 명령어 알아보기
- [설정 파일](/docs/cli/configuration) - `trbconfig.yml`로 설정하기
- [타입 어노테이션](/docs/learn/basics/type-annotations) - 타입이 지정된 코드 작성 시작
