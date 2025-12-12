---
sidebar_position: 3
title: T-Ruby vs 다른 도구들
description: T-Ruby와 TypeScript, RBS, Sorbet 비교
---

<DocsBadge />


# T-Ruby vs 다른 도구들

Ruby 에코시스템에는 정적 타이핑에 대한 여러 접근 방식이 있습니다. 이 페이지에서는 T-Ruby가 어디에 위치하는지 이해하는 데 도움이 되도록 다른 솔루션과 비교합니다.

## 빠른 비교

| 기능 | T-Ruby | RBS | Sorbet | TypeScript |
|---------|--------|-----|--------|------------|
| **언어** | Ruby | Ruby | Ruby | JavaScript |
| **타입 문법** | 인라인 | 별도 파일 | 주석 + sig | 인라인 |
| **컴파일** | 예 (.trb → .rb) | N/A | 아니오 | 예 (.ts → .js) |
| **런타임 검사** | 아니오 | 아니오 | 선택적 | 아니오 |
| **점진적 타이핑** | 예 | 예 | 예 | 예 |
| **제네릭 타입** | 예 | 예 | 예 | 예 |
| **학습 곡선** | 낮음 (TypeScript 유사) | 중간 | 높음 | - |

## T-Ruby vs RBS

**RBS**는 Ruby 3.0에서 도입된 Ruby의 공식 타입 서명 형식입니다.

### RBS 접근 방식

타입은 별도의 `.rbs` 파일에 작성됩니다:

```ruby title="lib/user.rb"
class User
  def initialize(name, age)
    @name = name
    @age = age
  end

  def greet
    "Hello, I'm #{@name}"
  end
end
```

```rbs title="sig/user.rbs"
class User
  @name: String
  @age: Integer

  def initialize: (String name, Integer age) -> void
  def greet: () -> String
end
```

### T-Ruby 접근 방식

타입은 인라인으로 작성됩니다:

```trb title="lib/user.trb"
class User
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def greet: String
    "Hello, I'm #{@name}"
  end
end
```

### 주요 차이점

| 측면 | T-Ruby | RBS |
|--------|--------|-----|
| 타입 위치 | 코드와 같은 파일 | 별도 .rbs 파일 |
| 동기화 | 자동 | 수동 (불일치 가능) |
| 가독성 | 코딩 중 타입 확인 가능 | 두 파일을 확인해야 함 |
| 생성 출력 | .rb + .rbs | .rbs만 |

**RBS를 선택할 때:**
- Ruby 소스 파일을 수정할 수 없는 경우
- 서드파티 라이브러리 작업 시
- 팀이 관심사 분리를 선호하는 경우

**T-Ruby를 선택할 때:**
- 타입을 코드와 함께 두고 싶은 경우
- TypeScript에서 온 경우
- 자동 RBS 생성을 원하는 경우

## T-Ruby vs Sorbet

**Sorbet**은 Stripe에서 개발한 타입 체커입니다.

### Sorbet 접근 방식

타입은 `sig` 블록과 T:: 문법을 사용합니다:

```ruby title="lib/calculator.rb"
# typed: strict
require 'sorbet-runtime'

class Calculator
  extend T::Sig

  sig { params(a: Integer, b: Integer).returns(Integer) }
  def add(a, b)
    a + b
  end

  sig { params(items: T::Array[String]).returns(String) }
  def join(items)
    items.join(", ")
  end
end
```

### T-Ruby 접근 방식

```trb title="lib/calculator.trb"
class Calculator
  def add(a: Integer, b: Integer): Integer
    a + b
  end

  def join(items: Array<String>): String
    items.join(", ")
  end
end
```

### 주요 차이점

| 측면 | T-Ruby | Sorbet |
|--------|--------|--------|
| 문법 스타일 | TypeScript 유사 | Ruby DSL |
| 런타임 의존성 | 없음 | sorbet-runtime gem |
| 런타임 검사 | 아니오 | 선택적 |
| 컴파일 | 필수 | 불필요 |
| 장황함 | 낮음 | 높음 |

**런타임 검사가 있는 Sorbet 예시:**
```ruby
# Sorbet은 런타임에 타입을 검사할 수 있음
sig { params(name: String).returns(String) }
def greet(name)
  "Hello, #{name}"
end

greet(123)  # 런타임 검사가 활성화되면 TypeError 발생
```

**T-Ruby 접근 방식:**
```trb
# 타입은 컴파일 타임에만 존재
def greet(name: String): String
  "Hello, #{name}"
end

greet(123)  # 컴파일 오류 (실행 전에 잡힘)
```

**Sorbet을 선택할 때:**
- 런타임 타입 검사가 필요한 경우
- 이미 프로젝트에서 Sorbet을 사용 중인 경우
- 컴파일 단계를 원하지 않는 경우

**T-Ruby를 선택할 때:**
- 더 깔끔하고 읽기 쉬운 문법을 원하는 경우
- 런타임 의존성을 원하지 않는 경우
- TypeScript에서 온 경우

## T-Ruby vs TypeScript

T-Ruby는 TypeScript에서 영감을 받았으므로, 어떻게 비교되는지 살펴봅시다:

### 문법 비교

```typescript title="TypeScript"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

interface User {
  name: string;
  age: number;
}

function processUser<T extends User>(user: T): string {
  return user.name;
}
```

```trb title="T-Ruby"
def greet(name: String): String
  "Hello, #{name}!"
end

interface User
  def name: String
  def age: Integer
end

def process_user<T: User>(user: T): String
  user.name
end
```

### 유사점

- 인라인 타입 어노테이션
- 타입 제거 (런타임 오버헤드 없음)
- 점진적 타이핑 지원
- Union 타입 (`String | Integer`)
- 제네릭 타입 (`Array<T>`)
- 인터페이스 정의

### 차이점

| 측면 | T-Ruby | TypeScript |
|--------|--------|------------|
| 기반 언어 | Ruby | JavaScript |
| 타입 이름 | PascalCase (String, Integer) | 소문자 (string, number) |
| Null 타입 | `nil` | `null`, `undefined` |
| 옵셔널 | `T?` 또는 `T \| nil` | `T \| null` 또는 `T?` |
| 메서드 문법 | Ruby의 `def` | 함수 표현식 |

## 통합: 여러 도구 함께 사용

T-Ruby는 RBS 파일을 생성하므로 다른 도구와 함께 사용할 수 있습니다:

```
┌─────────────┐
│    .trb     │
│   files     │
└──────┬──────┘
       │ trc compile
       ▼
┌─────────────┐     ┌─────────────┐
│    .rb      │     │    .rbs     │
│   files     │     │   files     │
└─────────────┘     └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌──────────┐  ┌──────────┐   ┌──────────┐
      │  Steep   │  │ Ruby LSP │   │  Sorbet  │
      │  checker │  │   IDE    │   │(optional)│
      └──────────┘  └──────────┘   └──────────┘
```

## 권장 사항

| 만약... | 고려 |
|-----------|----------|
| 새로운 Ruby 프로젝트를 시작한다면 | **T-Ruby** - 깔끔한 문법, 좋은 DX |
| 기존 Sorbet 코드베이스가 있다면 | **Sorbet** - 마이그레이션 비용 회피 |
| 런타임 타입 검사가 필요하다면 | **Sorbet** - 내장 지원 |
| 타입을 코드와 분리하고 싶다면 | **RBS** - 공식 형식 |
| TypeScript에서 왔다면 | **T-Ruby** - 익숙한 문법 |
| 큰 팀에서 일한다면 | **T-Ruby** 또는 **Sorbet** - 둘 다 잘 작동 |

## 결론

T-Ruby는 Ruby 타입에 대한 현대적인 TypeScript 영감의 접근 방식을 제공합니다:

- 깔끔한 인라인 문법
- 제로 런타임 오버헤드
- 에코시스템 호환성을 위한 자동 RBS 생성

RBS나 Sorbet을 대체하는 것이 아닙니다—Ruby 개발자에게 워크플로우와 선호도에 더 잘 맞을 수 있는 또 다른 옵션을 제공하는 것입니다.
