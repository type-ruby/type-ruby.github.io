---
slug: type-inference-released
title: "타입 추론: 적게 쓰고, 더 많이 타이핑하세요"
authors: [yhk1038]
tags: [release, feature]
---

T-Ruby가 이제 코드에서 반환 타입을 자동으로 추론합니다. 명백한 타입에 대해 더 이상 명시적 어노테이션이 필요 없습니다!

## 새로운 기능

이전에는 이렇게 작성해야 했습니다:

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

이제 반환 타입은 선택사항입니다:

```ruby
def greet(name: String)
  "Hello, #{name}!"
end
```

T-Ruby가 `greet`이 `String`을 반환한다고 추론하고 올바른 RBS를 생성합니다:

```rbs
def greet: (name: String) -> String
```

## 동작 원리

새로운 타입 추론 엔진은 메서드 본문을 분석하여 반환 타입을 결정합니다:

- **리터럴 추론**: `"hello"` → `String`, `42` → `Integer`
- **메서드 호출 추적**: `str.upcase` → `String`
- **암묵적 반환**: Ruby의 마지막 표현식이 반환 타입이 됨
- **조건문 처리**: `if`/`else` 분기에서 유니온 타입

## 예제

### 간단한 메서드

```ruby
class Calculator
  def double(n: Integer)
    n * 2
  end

  def is_positive?(n: Integer)
    n > 0
  end
end
```

생성된 RBS:

```rbs
class Calculator
  def double: (n: Integer) -> Integer
  def is_positive?: (n: Integer) -> bool
end
```

### 인스턴스 변수

```ruby
class User
  def initialize(name: String)
    @name = name
  end

  def greeting
    "Hello, #{@name}!"
  end
end
```

생성된 RBS:

```rbs
class User
  @name: String

  def initialize: (name: String) -> void
  def greeting: () -> String
end
```

## 기술적 세부사항

추론 시스템은 TypeScript의 접근 방식에서 영감을 받았습니다:

- **BodyParser**: T-Ruby 메서드 본문을 IR 노드로 파싱
- **TypeEnv**: 변수 타입 추적을 위한 스코프 체인 관리
- **ASTTypeInferrer**: 지연 평가와 캐싱으로 IR 순회

구현에 대한 심층 분석은 [기술 블로그 포스트](/blog/typescript-style-type-inference)를 확인하세요.

## 지금 사용해보세요

최신 T-Ruby로 업데이트하고 자동 타입 추론을 즐기세요:

```bash
gem update t-ruby
```

기존 코드는 이전과 동일하게 동작합니다 - 명시적 타입이 여전히 우선됩니다. 추론은 반환 타입이 생략된 경우에만 작동합니다.

## 피드백

타입 추론 사용 경험을 듣고 싶습니다. 엣지 케이스를 발견하셨나요? 제안이 있으신가요? [GitHub](https://github.com/aspect-build/t-ruby)에서 이슈를 열어주세요.

즐거운 타이핑 되세요!
