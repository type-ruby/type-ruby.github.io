---
sidebar_position: 2
title: 왜 T-Ruby인가?
description: T-Ruby의 장점과 탄생 배경
---

<DocsBadge />


# 왜 T-Ruby인가?

Ruby는 표현력과 개발자의 즐거움으로 유명한 아름다운 언어입니다. 하지만 프로젝트가 커지면서 정적 타입의 부재는 잡기 어려운 버그로 이어질 수 있습니다. T-Ruby는 Ruby를 훌륭하게 만드는 모든 것을 보존하면서 이 문제를 해결합니다.

## 대규모 동적 타이핑의 문제점

이런 흔한 시나리오를 생각해보세요:

```ruby
# 누군가 이 API를 작성합니다
def fetch_user(id)
  User.find(id)
end

# 몇 달 후, 다른 사람이 호출합니다
user = fetch_user("123")  # 버그! Integer여야 합니다
```

이 버그는 런타임까지—아마도 프로덕션에서—나타나지 않습니다. T-Ruby를 사용하면:

```trb title="T-Ruby 사용"
def fetch_user(id: Integer): User
  User.find(id)
end

user = fetch_user("123")  # 컴파일 오류! Integer가 필요한데 String을 받음
```

코드가 실행되기 전에 오류가 즉시 잡힙니다.

## T-Ruby의 장점

### 1. 버그를 일찍 잡기

타입 오류는 런타임이 아닌 컴파일 타임에 잡힙니다. 이는 다음을 의미합니다:

- 프로덕션에서의 버그 감소
- 더 빠른 디버깅 사이클
- 리팩토링 시 더 큰 자신감

```trb
def process_payment(amount: Float, currency: String): PaymentResult
  # 타입 체커가 보장합니다:
  # - amount는 항상 Float
  # - currency는 항상 String
  # - 반환 값은 반드시 PaymentResult
end

# 이것들은 모두 컴파일 타임 오류가 됩니다:
process_payment("100", "USD")      # 오류: String은 Float가 아님
process_payment(100.0, :usd)       # 오류: Symbol은 String이 아님
process_payment(100.0, "USD").foo  # 오류: PaymentResult에 'foo' 메서드가 없음
```

### 2. 더 나은 개발자 경험

타입은 절대 오래되지 않는 문서 역할을 합니다:

```trb
# 타입 없이 - 이게 뭘 반환하나요? 뭘 전달해야 하나요?
def transform(data, options = {})
  # ...
end

# 타입과 함께 - 명확하게
def transform(data: Array<Record>, options: TransformOptions?): TransformResult
  # ...
end
```

IDE가 제공할 수 있는 것들:
- 지능적인 자동완성
- 인라인 타입 정보
- 리팩토링 지원
- 실제로 작동하는 정의로 이동

### 3. 점진적 도입

전체 코드베이스를 다시 작성할 필요가 없습니다. T-Ruby는 점진적 타이핑을 지원합니다:

```trb
# 가장 중요한 코드부터 시작하세요
def charge_customer(customer_id: Integer, amount: Float): ChargeResult
  # 이 함수는 이제 타입 안전합니다
  legacy_billing_system(customer_id, amount)
end

# 레거시 코드는 타입 없이 남을 수 있습니다
def legacy_billing_system(customer_id, amount)
  # 여전히 잘 작동합니다
end
```

### 4. 제로 런타임 비용

런타임 검사를 추가하는 일부 타입 시스템과 달리, T-Ruby 타입은 컴파일 중에 완전히 제거됩니다:

```trb title="컴파일 전 (app.trb)"
def multiply(a: Integer, b: Integer): Integer
  a * b
end
```

```ruby title="컴파일 후 (app.rb)"
def multiply(a, b)
  a * b
end
```

출력은 손으로 직접 작성한 것과 정확히 같습니다. 성능 오버헤드도, 의존성도, 마법도 없습니다.

### 5. 에코시스템 통합

T-Ruby는 표준 RBS 파일을 생성하여 기존 Ruby 타입 에코시스템과 통합됩니다:

- **Steep**을 사용한 추가 타입 검사
- **Ruby LSP**를 통한 IDE 지원
- **Sorbet** 타입 정의와 호환
- 모든 기존 Ruby gem과 함께 작동

## T-Ruby를 사용할 때

T-Ruby는 특히 다음에 유용합니다:

| 사용 사례 | 장점 |
|----------|---------|
| **대규모 코드베이스** | 타입이 버그를 방지하고 리팩토링을 더 안전하게 만듦 |
| **팀 프로젝트** | 타입이 개발자 간 문서와 계약 역할을 함 |
| **중요한 시스템** | 프로덕션에 도달하기 전에 오류를 잡음 |
| **라이브러리 작성자** | 사용자에게 타입 정보를 제공 |
| **Ruby 학습** | 타입이 API 이해와 실수 방지에 도움 |

## 타입이 과할 수 있는 경우

타입은 약간의 오버헤드를 추가합니다. 매우 작은 스크립트나 빠른 프로토타입의 경우, 타입 없는 Ruby가 더 적절할 수 있습니다:

```trb
# 빠른 스크립트의 경우, 이것으로 충분합니다
puts "Hello, #{ARGV[0]}!"

# 이렇게 할 필요 없습니다:
# def main(args: Array<String>): void
#   puts "Hello, #{args[0]}!"
# end
```

T-Ruby의 아름다움은 언제 어디서 타입을 추가할지 **당신이 선택한다**는 것입니다.

## TypeScript 성공 스토리

TypeScript는 동적 언어에 타입을 올바르게 추가할 수 있다는 것을 증명했습니다:

1. **점진적 도입** - 작게 시작하여 자연스럽게 성장
2. **타입 제거** - 런타임 오버헤드 없음
3. **에코시스템 통합** - 기존 코드와 함께 작동

T-Ruby는 이 검증된 접근 방식을 Ruby에 가져옵니다. TypeScript가 대규모 JavaScript 개발을 관리 가능하게 만들었다면, T-Ruby는 Ruby에서 같은 일을 할 수 있습니다.

## 다음 단계

확신이 드셨나요? 시작해봅시다:

1. [T-Ruby 설치하기](/docs/getting-started/installation)
2. [첫 번째 타입 Ruby 작성하기](/docs/getting-started/quick-start)
3. [타입 시스템 배우기](/docs/learn/basics/type-annotations)
