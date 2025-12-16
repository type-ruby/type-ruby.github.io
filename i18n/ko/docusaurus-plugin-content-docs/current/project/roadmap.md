---
sidebar_position: 1
title: 로드맵
description: T-Ruby 개발 로드맵
---

import VersionBadge from '@site/src/components/VersionBadge';

<DocsBadge />


# 로드맵

T-Ruby는 활발히 개발 중입니다. 이 로드맵은 프로젝트의 현재 상태, 예정된 기능, 장기 비전을 설명합니다.

## 프로젝트 상태

:::caution 활발한 개발 중
T-Ruby는 현재 **활발한 개발** 상태입니다. 핵심 기능은 안정적이고 잘 테스트되어 있지만, 언어와 도구는 계속 발전하고 있습니다. 버전 간에 호환되지 않는 변경이 발생할 수 있습니다.
:::

**현재 버전:** <VersionBadge component="compiler" />
**라이선스:** MIT

## 완료된 마일스톤

### 마일스톤 1: 기본 타입 파싱 & 지우기 ✅

- 파라미터/반환 타입 어노테이션
- 유효한 Ruby 출력을 위한 타입 지우기
- 오류 처리 및 검증

### 마일스톤 2: 핵심 타입 시스템 ✅

| 기능 | 설명 |
|------|------|
| 타입 별칭 | `type UserId = String` |
| 인터페이스 | `interface Readable ... end` |
| 유니온 타입 | `String \| Integer \| nil` |
| 제네릭 | `Array<String>`, `Map<K, V>` |
| 교차 타입 | `Readable & Writable` |
| RBS 생성 | `.rbs` 파일 출력 |

### 마일스톤 3: 생태계 & 도구 ✅

| 기능 | 상태 |
|------|------|
| LSP 서버 | ✅ 구현됨 |
| 선언 파일 (.d.trb) | ✅ 구현됨 |
| VSCode 확장 | ✅ 출시됨 |
| JetBrains 플러그인 | ✅ [마켓플레이스](https://plugins.jetbrains.com/plugin/29335-t-ruby) |
| Vim/Neovim 통합 | ✅ 제공됨 |
| 표준 라이브러리 타입 | ✅ 포괄적 커버리지 |

### 마일스톤 4: 고급 기능 ✅

| 기능 | 설명 |
|------|------|
| 제약 시스템 | 제네릭 타입 제약 |
| 타입 추론 | 자동 타입 감지 |
| 런타임 검증 | 선택적 런타임 검사 |
| 타입 검사 | SMT 기반 타입 검증 |
| 캐싱 | 증분 컴파일 지원 |
| 패키지 관리 | 타입 패키지 시스템 |

### 마일스톤 5: 인프라 ✅

| 기능 | 설명 |
|------|------|
| Bundler 통합 | Ruby 생태계 통합 |
| IR 시스템 | 최적화 패스를 포함한 중간 표현 |
| Parser Combinator | 복잡한 타입 문법을 위한 조합 가능한 파서 |
| SMT 솔버 | 고급 타입 추론을 위한 제약 해결 |

### 마일스톤 6: 통합 & 프로덕션 준비 ✅

| 기능 | 상태 |
|------|------|
| Parser Combinator 통합 | ✅ 레거시 파서 대체 |
| IR 기반 컴파일러 | ✅ 전체 IR 파이프라인 |
| SMT 기반 타입 검사 | ✅ 통합됨 |
| LSP v2 + 시맨틱 토큰 | ✅ 타입 기반 구문 강조 |
| 증분 컴파일 | ✅ 캐시 기반 |
| 파일 간 타입 검사 | ✅ 다중 파일 지원 |
| Rails/RSpec/Sidekiq 타입 | ✅ 제공됨 |
| WebAssembly 타겟 | ✅ `@t-ruby/wasm` (<VersionBadge component="wasm" />) |

## 현재 초점

### 마일스톤 7: 차세대 기능 (진행 중)

| 기능 | 설명 | 상태 |
|------|------|------|
| 외부 SMT 솔버 (Z3) | Z3를 통한 향상된 타입 추론 | 계획됨 |
| LSP v3 | Language Server Protocol 3.x 지원 | 계획됨 |
| 타입 안전 메타프로그래밍 | 안전한 `define_method`, `method_missing` | 계획됨 |
| 점진적 타이핑 마이그레이션 | 기존 Ruby 코드 마이그레이션 도구 | 계획됨 |

## 계획된 기능

### 타입 시스템 개선

- [ ] 튜플 타입 (`[String, Integer, Bool]`)
- [ ] 재귀적 타입 별칭
- [ ] 분산 어노테이션 (`in`, `out`)
- [ ] 조건부 타입 (`T extends U ? X : Y`)
- [ ] 매핑된 타입
- [ ] Readonly 수식어

### 고급 타입 기능

- [ ] 템플릿 리터럴 타입
- [ ] 구별된 유니온
- [ ] 브랜드 타입
- [ ] 불투명 타입
- [ ] 의존 타입 (연구)

### 모듈 시스템

- [ ] 모듈 타입 어노테이션
- [ ] 네임스페이스 지원
- [ ] 타입 가져오기/내보내기 구문
- [ ] 모듈 인터페이스

## 미래 비전

### 고급 기능

- [ ] 이펙트 시스템 (부작용 추적)
- [ ] 소유권 및 대여 개념
- [ ] 대수적 데이터 타입
- [ ] 패턴 매칭 타입
- [ ] 정제 타입

### 생태계

- [ ] 타입 정의 저장소
- [ ] 클라우드 기반 타입 검사 서비스
- [ ] Sorbet 호환 모드
- [ ] Steep 통합

## 연구 영역

다음 고급 기능을 적극적으로 연구하고 있습니다:

### 1. 이펙트 타입
타입 시스템에서 부작용 추적:

```trb
def read_file(path: String): String throws IOError
def calculate(x: Integer): Integer pure
```

### 2. 의존 타입
값에 의존하는 타입:

```trb
def create_array<N: Integer>(size: N): Array<T>[N]
# 정확히 N개의 요소를 가진 배열 반환
```

### 3. 선형 타입
리소스가 정확히 한 번만 사용되도록 보장:

```trb
def process_file(handle: File) consume: String
# 이 호출 후에는 handle을 사용할 수 없음
```

### 4. 로우 다형성
유연한 레코드 타입:

```trb
def add_id<T: { ... }>(obj: T): T & { id: Integer }
```

## 버전 히스토리

| 컴포넌트 | 현재 버전 |
|----------|----------|
| 컴파일러 | <VersionBadge component="compiler" /> |
| VSCode 확장 | <VersionBadge component="vscode" /> |
| JetBrains 플러그인 | <VersionBadge component="jetbrains" /> |
| WASM 패키지 | <VersionBadge component="wasm" /> |

## 호환되지 않는 변경 정책

### 현재 단계 (Pre-1.0)
- 모든 릴리스에서 호환되지 않는 변경이 발생할 수 있음
- 가능한 경우 폐기 예정 경고 제공
- 주요 변경에 대한 마이그레이션 가이드
- 변경 로그에 모든 호환되지 않는 변경 문서화

### 안정 단계 (v1.0+)
- 패치 버전에서 호환되지 않는 변경 없음
- 메이저 버전에서만 호환되지 않는 변경
- 최소 6개월의 폐기 예정 기간
- 자동화된 마이그레이션 도구
- 기업용 LTS 릴리스

## 로드맵에 영향을 미치는 방법

커뮤니티 의견을 환영합니다:

1. **기능 투표** - GitHub에서 이슈에 별표를 눌러 관심 표시
2. **기능 요청** - 상세한 기능 요청 열기
3. **코드 기여** - 로드맵 항목에 대한 PR 제출
4. **피드백 공유** - 무엇이 효과적이고 무엇이 아닌지 알려주기
5. **토론 참여** - RFC 프로세스에 참여

## 참여하기

T-Ruby의 미래를 형성하는 데 도움을 주세요:

- **문서** - 문서와 예제 개선
- **테스트** - 버그와 엣지 케이스 보고
- **기능** - 기능 제안 및 구현
- **도구** - 에디터 확장 구축
- **타입** - stdlib과 gem 타입 정의 추가
- **커뮤니티** - 질문 답변, 튜토리얼 작성

시작하려면 [기여 가이드](/docs/project/contributing)를 참조하세요.

## 최신 정보 얻기

- **GitHub** - 업데이트를 위해 저장소 주시
- **Twitter** - 발표를 위해 [@t_ruby](https://twitter.com/t_ruby) 팔로우
- **Discord** - 커뮤니티 채팅 참여

---

*로드맵은 커뮤니티 피드백과 우선순위에 따라 변경될 수 있습니다.*
