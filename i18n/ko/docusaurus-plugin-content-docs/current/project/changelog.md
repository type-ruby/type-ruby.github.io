---
sidebar_position: 3
title: 변경 로그
description: T-Ruby 릴리스 히스토리
---

<DocsBadge />


# 변경 로그

T-Ruby의 모든 주목할 만한 변경 사항은 이 파일에 문서화됩니다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)를 기반으로 하며,
이 프로젝트는 [시맨틱 버저닝](https://semver.org/spec/v2.0.0.html)을 따릅니다.

## [미공개]

### 계획됨
- 튜플 타입
- 재귀적 타입 별칭
- Language Server Protocol (LSP) 구현
- VSCode 확장
- 개선된 오류 메시지
- Rails 타입 정의

## [0.1.0-alpha] - 2025-12-09

### 개요

T-Ruby의 첫 알파 릴리스입니다! 이 릴리스에는 핵심 타입 시스템 기능, 작동하는 컴파일러, 기본 도구가 포함되어 있습니다. T-Ruby는 이제 실험적 사용과 커뮤니티 피드백을 받을 준비가 되었습니다.

:::caution 실험적 릴리스
이것은 알파 릴리스입니다. API가 변경될 수 있으며 호환되지 않는 변경이 발생할 수 있습니다. 프로덕션 사용은 권장되지 않습니다.
:::

### 추가됨

#### 타입 시스템
- **기본 타입** - `String`, `Integer`, `Float`, `Bool`, `Symbol`, `nil`
- **특수 타입** - `Any`, `void`, `never`, `self`
- **유니온 타입** - `|` 연산자로 여러 타입 결합
- **선택적 타입** - `T | nil`의 단축형 `T?`
- **Array 제네릭** - 타입이 지정된 배열을 위한 `Array<T>`
- **Hash 제네릭** - 타입이 지정된 해시를 위한 `Hash<K, V>`
- **타입 추론** - 변수와 반환값에 대한 자동 타입 추론
- **타입 좁히기** - `is_a?`와 `nil?`을 사용한 스마트 좁히기
- **리터럴 타입** - 문자열, 숫자, 심볼, 불리언 리터럴
- **타입 별칭** - `type`으로 커스텀 타입 이름 생성
- **제네릭 타입 별칭** - `type Result<T> = T | nil`과 같은 제네릭 별칭
- **교차 타입** - `&` 연산자로 인터페이스 결합
- **Proc 타입** - `Proc<Args, Return>`으로 타입 안전 proc과 lambda

#### 함수
- 파라미터 타입 어노테이션
- 반환 타입 어노테이션
- 타입이 있는 선택적 파라미터
- 타입이 있는 가변 파라미터
- 타입이 있는 키워드 인수
- 블록 파라미터 타입
- 제네릭 함수
- 여러 타입 파라미터
- 타입 파라미터 추론

#### 클래스
- 인스턴스 변수 타입 어노테이션
- 클래스 변수 타입 어노테이션
- 생성자 타입
- 메서드 타입 어노테이션
- 제네릭 클래스
- 여러 클래스 타입 파라미터
- 타입이 있는 상속
- 믹스인/모듈 타입 지원

#### 인터페이스
- 인터페이스 정의
- 인터페이스 구현
- 구조적 타이핑
- 덕 타이핑 지원
- 제네릭 인터페이스
- 인터페이스의 교차

#### 컴파일러
- `.trb`에서 `.rb` 컴파일
- 타입 지우기 (런타임 오버헤드 없음)
- `.rbs` 파일 생성
- 디버깅을 위한 소스 맵
- `--watch`로 파일 감시
- `--check`로 타입 검사 모드
- 위치가 포함된 상세 오류 메시지
- 컬러 터미널 출력
- CI 통합을 위한 종료 코드

#### 표준 라이브러리
- 코어 Ruby 타입 정의 (File, Dir, IO)
- Time과 Date 타입
- JSON 모듈 타입
- YAML 모듈 타입
- CSV 모듈 타입
- Logger 타입
- Net::HTTP 타입
- URI 타입
- 파일 시스템 유틸리티 (FileUtils, Pathname)
- 문자열 조작 (StringIO)
- 컬렉션 (Set)
- 암호화 (Digest, Base64, SecureRandom)
- 템플릿 (ERB)
- 벤치마킹 (Benchmark)
- 타임아웃 유틸리티

#### 문서
- 포괄적인 시작 가이드
- 타입 시스템 튜토리얼
- API 참조 문서
- 표준 라이브러리 타입 참조
- CLI 명령 문서
- 에디터 설정 가이드
- 일반 Ruby에서 마이그레이션 가이드
- 예제 프로젝트
- 빠른 참조를 위한 치트시트
- 문제 해결 가이드

#### 도구
- `trc` 명령줄 컴파일러
- 버전 정보를 위한 `--version` 플래그
- 명령 문서를 위한 `--help`
- 타입 전용 검사를 위한 `--check`
- 개발 워크플로우를 위한 `--watch`
- 커스텀 출력 경로를 위한 `--output`
- RBS 생성을 위한 `--rbs` 플래그
- 컬러 오류 출력
- 보기 좋게 출력된 타입 오류

### 변경됨
- N/A (최초 릴리스)

### 폐기 예정
- N/A (최초 릴리스)

### 제거됨
- N/A (최초 릴리스)

### 수정됨
- N/A (최초 릴리스)

### 보안
- N/A (최초 릴리스)

## 릴리스 노트

### v0.1.0-alpha - 최초 알파 릴리스

**릴리스 날짜:** 2025년 12월 9일

이것은 T-Ruby의 첫 번째 공개 릴리스입니다! 몇 달간의 개발 끝에 Ruby 커뮤니티와 T-Ruby를 공유하게 되어 기쁩니다.

#### 포함된 것

T-Ruby는 Ruby에 TypeScript 스타일의 정적 타이핑을 가져옵니다. 타입 어노테이션이 있는 `.trb` 파일로 코드를 작성하고, 런타임 오버헤드 없이 순수한 Ruby로 컴파일하며, 더 나은 도구와 적은 버그를 즐기세요.

#### 주요 기능

1. **점진적 타이핑** - 자신의 속도에 맞게 타입을 추가하세요. 모든 Ruby는 유효한 T-Ruby입니다.
2. **런타임 비용 없음** - 타입은 컴파일 시점에 지워집니다. 성능 저하가 없습니다.
3. **RBS 생성** - 기존 도구와의 통합을 위해 `.rbs` 파일을 자동 생성합니다.
4. **친숙한 구문** - TypeScript를 알고 있다면 편하게 느낄 것입니다.
5. **포괄적인 Stdlib** - 일반적인 Ruby 표준 라이브러리 모듈에 대한 타입 정의.

#### 시작하기

```bash
# T-Ruby 설치
gem install t-ruby

# 파일 생성
echo 'def greet(name: String): String
  "Hello, #{name}!"
end' > hello.trb

# 컴파일
trc hello.trb

# 생성된 Ruby 실행
ruby hello.rb
```

#### 예제 코드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/project/changelog_spec.rb" line={21} />

```trb
# hello.trb - 타입 안전 Ruby
class User
  @name: String
  @email: String
  @age: Integer

  def initialize(name: String, email: String, age: Integer): void
    @name = name
    @email = email
    @age = age
  end

  def greet: String
    "Hello, my name is #{@name}"
  end

  def adult?: Bool
    @age >= 18
  end
end

# 사용자 생성
alice: User = User.new("Alice", "alice@example.com", 30)
bob: User = User.new("Bob", "bob@example.com", 17)

# 타입 안전 작업
users: Array<User> = [alice, bob]
adults: Array<User> = users.select { |u| u.adult? }

adults.each do |user|
  puts user.greet
end
```

`trc hello.trb`로 컴파일하면 모든 타입 어노테이션이 제거된 깨끗한 Ruby 코드가 생성됩니다.

#### 알려진 제한사항

이 알파 릴리스에는 몇 가지 제한사항이 있습니다:

- **불완전한 stdlib 커버리지** - 아직 모든 Ruby 표준 라이브러리 모듈에 타입이 없습니다
- **IDE 지원 없음** - LSP와 에디터 확장은 v0.2에서 제공 예정
- **제한된 오류 복구** - 타입 검사기가 일부 경우에 첫 번째 오류에서 중지됩니다
- **성능** - 대규모 프로젝트에서 타입 검사가 느릴 수 있습니다
- **호환되지 않는 변경 가능** - 향후 알파 릴리스에서 API가 변경될 수 있습니다

#### 다음 계획

이미 v0.2.0을 작업 중입니다:

- IDE 지원을 위한 Language Server Protocol (LSP)
- VSCode 확장
- 튜플 타입
- 재귀적 타입 별칭
- 더 나은 오류 메시지
- 성능 개선

#### 피드백 환영

이것은 실험적 릴리스입니다. 여러분의 피드백을 기다립니다!

- [GitHub Issues](https://github.com/t-ruby/t-ruby/issues)에서 버그 보고
- [GitHub Discussions](https://github.com/t-ruby/t-ruby/discussions)에서 기능 제안
- [Discord 커뮤니티](https://discord.gg/t-ruby) 참여
- 업데이트를 위해 [@t_ruby](https://twitter.com/t_ruby) 팔로우

#### 기여자

이 릴리스에 기여해 주신 모든 분들께 감사드립니다:

- 초기 개발 및 설계
- 타입 시스템 구현
- 문서 및 예제
- 테스트 및 버그 보고
- 커뮤니티 피드백 및 지원

Ruby와 TypeScript 커뮤니티의 영감과 지도에 특별히 감사드립니다.

#### 라이선스

T-Ruby는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

---

## 버전 히스토리

| 버전 | 릴리스 날짜 | 상태 | 하이라이트 |
|---------|--------------|--------|------------|
| [0.1.0-alpha](#010-alpha---2025-12-09) | 2025-12-09 | 알파 | 최초 릴리스, 핵심 기능 |
| 0.2.0 | TBD | 계획됨 | LSP, 튜플, 도구 |
| 0.3.0 | TBD | 계획됨 | Rails 타입, 고급 기능 |
| 1.0.0 | TBD | 계획됨 | 안정 릴리스 |

## 업그레이드 가이드

### v0.1.0-alpha로 업그레이드

이것은 최초 릴리스이므로 업그레이드할 것이 없습니다. T-Ruby에 오신 것을 환영합니다!

향후 업그레이드를 위해 여기에 상세한 마이그레이션 가이드를 제공할 예정입니다.

## 폐기 예정 공지

현재 폐기 예정인 것이 없습니다. 제거하기 훨씬 전에 폐기 예정을 발표할 것입니다.

## 호환되지 않는 변경 정책

### 알파 단계 (현재)
- 모든 버전에서 호환되지 않는 변경이 발생할 수 있음
- 가능한 경우 폐기 예정 경고 제공
- 중요한 변경에 대한 마이그레이션 가이드

### 베타 단계 (향후)
- 마이너 버전 (0.x.0)에서만 호환되지 않는 변경
- 최소 1개월의 폐기 예정 기간
- 가능한 경우 자동화된 마이그레이션 도구

### 안정 단계 (v1.0+)
- 패치 버전 (1.0.x)에서 호환되지 않는 변경 없음
- 메이저 버전 (2.0.0)에서만 호환되지 않는 변경
- 최소 6개월의 폐기 예정 기간
- 메이저 버전에 대한 장기 지원

## 시맨틱 버저닝

T-Ruby는 [시맨틱 버저닝](https://semver.org/)을 따릅니다:

- **MAJOR** 버전 (X.0.0) - 호환되지 않는 API 변경
- **MINOR** 버전 (0.X.0) - 새 기능, 하위 호환
- **PATCH** 버전 (0.0.X) - 버그 수정, 하위 호환

알파/베타 (0.x.x) 동안에는 마이너 버전에서 호환되지 않는 변경이 발생할 수 있습니다.

## 릴리스 채널

### Stable
프로덕션 사용을 위한 현재 안정 버전 (v1.0.0+, 사용 가능 시).

### Beta
기능 완료된 릴리스 후보 (v0.x.0, 향후).

### Alpha
핵심 기능이 있는 실험적 릴리스 (v0.1.0-alpha, 현재).

### Nightly
`main` 브랜치의 최신 빌드 (권장되지 않음).

## 최신 정보 얻기

- [GitHub 저장소](https://github.com/t-ruby/t-ruby)에서 릴리스 주시
- 발표를 위해 [@t_ruby](https://twitter.com/t_ruby) 팔로우
- 토론을 위해 [Discord](https://discord.gg/t-ruby) 참여
- 뉴스레터 구독 (출시 예정)

## 아카이브

모든 릴리스는 다음에서 사용 가능합니다:
- [GitHub Releases](https://github.com/t-ruby/t-ruby/releases)
- [RubyGems.org](https://rubygems.org/gems/t-ruby)

---

*최신 개발 상태는 [로드맵](/docs/project/roadmap)을 참조하세요.*
*기여하려면 [기여 가이드](/docs/project/contributing)를 참조하세요.*
