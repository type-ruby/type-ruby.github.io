---
sidebar_position: 2
title: 기여하기
description: T-Ruby에 기여하는 방법
---

<DocsBadge />


# T-Ruby에 기여하기

T-Ruby에 기여하는 데 관심을 가져주셔서 감사합니다! 이 가이드는 코드, 문서, 타입 등에 기여하는 것을 시작하는 데 도움이 됩니다.

## 행동 강령

T-Ruby는 모든 기여자에게 환영하고 포용적인 환경을 제공하기 위해 노력합니다. 모든 참가자는 다음을 기대합니다:

- 존중하고 배려하기
- 신규 참여자를 환영하고 배움을 돕기
- 커뮤니티에 가장 좋은 것에 집중하기
- 다른 커뮤니티 구성원에게 공감 표시하기

용납할 수 없는 행동은 허용되지 않습니다. 우려 사항이 있으면 프로젝트 관리자에게 보고해 주세요.

## 기여 방법

T-Ruby에 기여하는 방법은 여러 가지가 있습니다:

### 1. 버그 보고

버그를 발견했나요? GitHub에서 다음 내용으로 이슈를 열어주세요:

- **명확한 제목** - 이슈에 대한 설명적인 요약
- **T-Ruby 버전** - `trc --version` 실행
- **Ruby 버전** - `ruby --version` 실행
- **재현 단계** - 최소한의 코드 예제
- **예상 동작** - 어떻게 되어야 하는지
- **실제 동작** - 실제로 어떻게 되는지
- **오류 메시지** - 해당되는 경우 전체 오류 출력

**예시:**
```markdown
## 버그: 배열 map에 대한 타입 추론 실패

**T-Ruby 버전:** v0.1.0
**Ruby 버전:** 3.2.0

### 재현 단계
<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={25} />

```trb
numbers: Integer[] = [1, 2, 3]
strings = numbers.map { |n| n.to_s }
# strings의 타입은 String[]이어야 함
```

### 예상
`strings`는 `String[]`으로 추론되어야 함

### 실제
타입이 `Any[]`로 추론됨
```

### 2. 기능 제안

T-Ruby에 대한 아이디어가 있으신가요? 다음 내용으로 기능 요청을 열어주세요:

- **사용 사례** - 왜 이 기능이 필요한가요?
- **제안 구문** - 어떻게 작동해야 하나요?
- **예시** - 사용법을 보여주는 코드 예제
- **대안** - 문제를 해결하는 다른 방법
- **TypeScript 비교** - TypeScript는 이것을 어떻게 처리하나요?

### 3. 문서 개선

문서 기여는 매우 가치 있습니다:

- 오타 및 문법 수정
- 코드 예제 추가
- 설명 개선
- 튜토리얼 및 가이드 작성
- 문서 번역
- 다이어그램 및 시각 자료 추가

### 4. 표준 라이브러리 타입 추가

T-Ruby의 stdlib 커버리지 확장을 도와주세요:

- Ruby 핵심 클래스에 대한 타입 시그니처 추가
- 인기 있는 gem 타입 지정 (Rails, Sinatra, RSpec 등)
- 타입 정의에 대한 테스트 작성
- 복잡한 타입 문서화

### 5. 도구 구축

T-Ruby 생태계를 위한 도구 만들기:

- 에디터 확장 (VSCode, Vim 등)
- 빌드 시스템 통합
- 린터 및 포매터
- 코드 생성기
- 마이그레이션 도구

### 6. 테스트 작성

테스트 커버리지 개선:

- 기존 기능에 대한 테스트 케이스 추가
- 엣지 케이스 및 오류 조건 테스트
- 통합 테스트 작성
- 성능 벤치마크 추가

### 7. 버그 수정

열린 이슈를 살펴보고 풀 리퀘스트 제출:

- "good first issue" 라벨 찾기
- "help wanted" 이슈 확인
- 버그 재현 및 수정 제안
- 오류 메시지 개선

## 개발 환경 설정

### 필수 조건

- **Ruby** 3.0 이상
- **Node.js** 16 이상 (도구용)
- **Git** 버전 관리

### 저장소 복제

```bash
git clone https://github.com/t-ruby/t-ruby.git
cd t-ruby
```

### 의존성 설치

```bash
# Ruby 의존성 설치
bundle install

# Node.js 의존성 설치 (도구용)
npm install
```

### 테스트 실행

```bash
# 모든 테스트 실행
bundle exec rspec

# 특정 테스트 파일 실행
bundle exec rspec spec/compiler/type_checker_spec.rb

# 커버리지와 함께 실행
COVERAGE=true bundle exec rspec
```

### 컴파일러 빌드

```bash
# 개발 버전 빌드
rake build

# 로컬 설치
rake install

# 설치 테스트
trc --version
```

### 타입 검사기 실행

```bash
# 파일 타입 검사
trc --check examples/hello.trb

# 파일 컴파일
trc examples/hello.trb

# 감시 모드
trc --watch examples/**/*.trb
```

## 풀 리퀘스트 프로세스

### 1. 브랜치 생성

```bash
# 기능 브랜치 생성
git checkout -b feature/my-awesome-feature

# 또는 버그 수정 브랜치
git checkout -b fix/issue-123
```

### 2. 변경 사항 적용

- 깔끔하고 읽기 쉬운 코드 작성
- 코딩 스타일 따르기 (아래 참조)
- 새 기능에 대한 테스트 추가
- 필요한 경우 문서 업데이트
- 커밋을 집중적이고 원자적으로 유지

### 3. 변경 사항 테스트

```bash
# 테스트 실행
bundle exec rspec

# 린터 실행
bundle exec rubocop

# 예제 타입 검사
trc --check examples/**/*.trb

# 수동 테스트
trc your_test_file.trb
ruby your_test_file.rb
```

### 4. 변경 사항 커밋

명확하고 설명적인 커밋 메시지 작성:

```bash
# 좋은 커밋 메시지
git commit -m "Add support for tuple types"
git commit -m "Fix type inference for array.map"
git commit -m "Document generic constraints"

# 나쁜 커밋 메시지
git commit -m "Fix bug"
git commit -m "Update code"
git commit -m "WIP"
```

**커밋 메시지 형식:**
```
<type>: <subject>

<body>

<footer>
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (포매팅 등)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가 또는 업데이트
- `chore`: 빌드 프로세스, 의존성 등

**예시:**
```
feat: Add support for intersection types

Implement intersection type operator (&) that allows
combining multiple interface types. This enables
creating types that must satisfy multiple contracts.

Closes #123
```

### 5. 푸시 및 PR 생성

```bash
# 브랜치 푸시
git push origin feature/my-awesome-feature

# GitHub에서 PR 생성
```

### 6. PR 요구사항

풀 리퀘스트는:

- [ ] 명확하고 설명적인 제목이 있어야 함
- [ ] 관련 이슈 참조 (예: "Fixes #123")
- [ ] 새 기능에 대한 테스트 포함
- [ ] 필요한 경우 문서 업데이트
- [ ] 모든 CI 검사 통과
- [ ] 병합 충돌 없음
- [ ] 관리자의 리뷰 필요

### 7. PR 템플릿

```markdown
## 설명
변경 사항에 대한 간략한 설명

## 동기
왜 이러한 변경이 필요한가요?

## 변경 사항
- 구체적인 변경 사항 목록
- 또 다른 변경 사항

## 테스트
이러한 변경 사항은 어떻게 테스트되었나요?

## 스크린샷
해당되는 경우 스크린샷 추가

## 체크리스트
- [ ] 테스트 통과
- [ ] 문서 업데이트됨
- [ ] 스타일 가이드 준수
- [ ] 브레이킹 체인지 없음 (또는 문서화됨)
```

## 코딩 스타일

### Ruby 스타일

일부 수정과 함께 [Ruby 스타일 가이드](https://rubystyle.guide/)를 따릅니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={36} />

```trb
# 좋음
def type_check(node: AST::Node): Type
  case node.type
  when :integer
    IntegerType.new
  when :string
    StringType.new
  else
    AnyType.new
  end
end

# 설명적인 변수 이름 사용
def infer_array_type(elements: AST::Node[]): ArrayType
  element_types = elements.map { |el| infer_type(el) }
  union_type = UnionType.new(element_types)
  ArrayType.new(union_type)
end
```

### T-Ruby 스타일 (예제용)

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={47} />

```trb
# 예제에서 명확하고 명시적인 타입 사용
def process_user(user: User): UserResponse
  UserResponse.new(
    id: user.id,
    name: user.name,
    email: user.email
  )
end

# 명확성을 위한 타입 어노테이션 추가
users: User[] = fetch_users()
active_users: User[] = users.select { |u| u.active? }
```

### 문서 스타일

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={58} />

```trb
# 좋은 문서
# 배열 리터럴의 타입을 추론합니다
#
# @param elements [AST::Node[]] 배열 리터럴 요소
# @return [ArrayType] 추론된 배열 타입
# @example
#   infer_array_type([IntNode.new(1), IntNode.new(2)])
#   #=> Integer[]
def infer_array_type(elements)
  # ...
end
```

## 테스트 가이드라인

### 테스트 작성

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={69} />

```trb
RSpec.describe TypeChecker do
  describe '#infer_type' do
    it 'infers Integer for integer literals' do
      node = AST::IntegerNode.new(42)
      type = checker.infer_type(node)

      expect(type).to be_a(IntegerType)
    end

    it 'infers Union type for union syntax' do
      node = AST::UnionNode.new(
        StringType.new,
        IntegerType.new
      )
      type = checker.infer_type(node)

      expect(type).to be_a(UnionType)
      expect(type.types).to include(StringType.new, IntegerType.new)
    end

    context 'with generic types' do
      it 'infers T[] from literal' do
        # ...
      end
    end
  end
end
```

### 테스트 구성

```
spec/
├── compiler/
│   ├── parser_spec.rb
│   ├── type_checker_spec.rb
│   └── code_generator_spec.rb
├── types/
│   ├── union_type_spec.rb
│   ├── generic_type_spec.rb
│   └── intersection_type_spec.rb
└── integration/
    ├── compile_spec.rb
    └── type_check_spec.rb
```

## 표준 라이브러리 타입 추가

### 1. 타입 정의 파일 생성

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={80} />

```trb
# lib/t_ruby/stdlib/json.trb

# JSON 모듈에 대한 타입 정의
module JSON
  def self.parse(source: String): Any
  end

  def self.generate(obj: Any): String
  end

  def self.pretty_generate(obj: Any): String
  end
end
```

### 2. 테스트 추가

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={21} />

```trb
# spec/stdlib/json_spec.rb

RSpec.describe 'JSON types' do
  it 'type checks JSON.parse' do
    code = <<~RUBY
      require 'json'

      data: String = '{"name": "Alice"}'
      result = JSON.parse(data)
    RUBY

    expect(type_check(code)).to be_valid
  end
end
```

### 3. 타입 문서화

`/docs/reference/stdlib-types.md`에 추가:

```markdown
### JSON

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/contributing_spec.rb" line={21} />

```trb
def parse_json(file: String): Hash<String, Any>
  JSON.parse(File.read(file))
end
```

**타입 시그니처:**
- `JSON.parse(source: String): Any`
- `JSON.generate(obj: Any): String`
```

## 문서 기여

### 문서 구조

```
docs/
├── introduction/         # 시작하기
├── getting-started/      # 설치 및 설정
├── learn/               # 튜토리얼 및 가이드
│   ├── basics/
│   ├── everyday-types/
│   ├── functions/
│   ├── classes/
│   ├── interfaces/
│   ├── generics/
│   └── advanced/
├── reference/           # API 참조
│   ├── cheatsheet.md
│   ├── built-in-types.md
│   ├── type-operators.md
│   └── stdlib-types.md
├── cli/                # CLI 문서
├── tooling/            # 에디터 및 도구 통합
└── project/            # 프로젝트 정보
    ├── roadmap.md
    ├── contributing.md
    └── changelog.md
```

### 문서 작성

1. **명확한 예제 사용** - 설명만 하지 말고 보여주세요
2. **"왜"를 설명** - "어떻게"만이 아니라
3. **일반적인 함정 포함** - 사용자가 실수를 피하도록 도와주세요
4. **관련 주제 링크** - 사용자가 더 많이 발견하도록 도와주세요
5. **간결하게 유지** - 독자의 시간을 존중하세요

## 리뷰 프로세스

### 관리자를 위해

PR 리뷰 시:

1. **정확성 확인** - 의도한 대로 작동하나요?
2. **테스트 리뷰** - 적절한 테스트가 있나요?
3. **스타일 확인** - 가이드라인을 따르나요?
4. **영향 고려** - 브레이킹 체인지? 성능?
5. **피드백 제공** - 도움이 되고 건설적으로
6. **승인 또는 변경 요청** - 명확한 다음 단계

### 응답 시간

우리가 목표로 하는 것:

- **첫 번째 응답** - 영업일 기준 2일 이내
- **리뷰 사이클** - 1주일 이내
- **병합 결정** - 2주일 이내

## 릴리스 프로세스

### 버전 번호

[시맨틱 버저닝](https://semver.org/)을 따릅니다:

- **MAJOR** - 호환되지 않는 변경 (v1.0.0 → v2.0.0)
- **MINOR** - 새 기능, 하위 호환 (v1.0.0 → v1.1.0)
- **PATCH** - 버그 수정 (v1.0.0 → v1.0.1)

### 릴리스 체크리스트

1. `lib/t_ruby/version.rb`에서 버전 업데이트
2. CHANGELOG.md 업데이트
3. 전체 테스트 스위트 실행
4. gem 빌드 및 테스트
5. git 태그 생성
6. GitHub에 푸시
7. GitHub 릴리스 생성
8. RubyGems에 gem 게시
9. 릴리스 발표

## 도움 받기

### 질문할 곳

- **GitHub Discussions** - 일반적인 질문, 아이디어
- **GitHub Issues** - 버그 보고, 기능 요청

### 좋은 질문에 포함할 것

- 무엇을 달성하려고 하는지
- 지금까지 무엇을 시도했는지
- 최소한의 코드 예제
- 오류 메시지 (있는 경우)
- T-Ruby 및 Ruby 버전

## 인정

기여자는 인정받습니다:

- **기여자 목록** - README 및 웹사이트에서
- **릴리스 노트** - 변경 로그에 언급
- **특별 감사** - 중요한 기여에 대해

## 라이선스

T-Ruby에 기여함으로써, 귀하의 기여가 MIT 라이선스에 따라 라이선스된다는 데 동의하게 됩니다.

## 리소스

- **GitHub 저장소** - https://github.com/type-ruby/t-ruby
- **문서** - https://type-ruby.github.io
- **스타일 가이드** - https://rubystyle.guide/
- **RSpec 가이드** - https://rspec.info/
- **시맨틱 버저닝** - https://semver.org/

## 연락처

- **GitHub** - https://github.com/type-ruby/t-ruby
- **Discussions** - https://github.com/type-ruby/t-ruby/discussions

---

T-Ruby에 기여해 주셔서 감사합니다! 여러분의 노력이 모든 사람을 위해 Ruby 개발을 더 좋게 만드는 데 도움이 됩니다.
