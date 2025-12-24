---
slug: typescript-style-type-inference
title: "T-Ruby를 위한 TypeScript 스타일 타입 추론 구축기"
authors: [yhk1038]
tags: [technical, type-inference, compiler]
---

명시적 타입 선언 없이도 자동으로 타입을 감지하는 TypeScript 영감의 정적 타입 추론을 T-Ruby에 구현한 이야기입니다.

<!-- truncate -->

## 문제점

T-Ruby 코드를 작성할 때, 개발자들은 모든 반환 타입을 명시적으로 선언해야 했습니다:

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

`: String` 반환 타입이 없으면, 생성되는 RBS는 `untyped`로 표시됩니다:

```rbs
def greet: (name: String) -> untyped
```

이건 불편했습니다. 반환 타입이 명백히 `String`인데 - 왜 T-Ruby가 알아서 파악하지 못할까요?

## 영감: TypeScript의 접근 방식

TypeScript는 이것을 우아하게 처리합니다:

```typescript
function greet(name: string) {
  return `Hello, ${name}!`;
}
```

TypeScript는 반환 타입을 `string`으로 추론합니다. 우리도 T-Ruby에서 동일한 경험을 원했습니다.

### TypeScript의 동작 방식

TypeScript의 타입 추론은 두 가지 핵심 컴포넌트로 구성됩니다:

1. **Binder**: 파싱 중에 제어 흐름 그래프(CFG) 구축
2. **Checker**: 필요할 때 지연 평가로 타입 계산, 흐름 분석 사용

마법은 `getFlowTypeOfReference`에서 일어납니다 - 플로우 노드를 역방향으로 순회하며 코드의 어느 지점에서든 심볼의 타입을 결정하는 1200줄 이상의 함수입니다.

### 우리의 단순화된 접근

Ruby의 제어 흐름은 JavaScript보다 단순합니다. TypeScript 플로우 그래프의 완전한 복잡성은 필요하지 않습니다. 대신 우리는 다음을 구현했습니다:

- **선형 데이터 흐름 분석** - Ruby의 직관적인 실행 모델
- **관심사 분리** - IR Builder (Binder 역할) + ASTTypeInferrer (Checker 역할)
- **지연 평가** - RBS 생성 시점에만 타입 계산

## 아키텍처

```
[Binder 단계 - IR Builder]
소스 (.trb) → Parser → IR 트리 (메서드 본문 포함)

[Checker 단계 - Type Inferrer]
IR 노드 순회 → 타입 결정 → 캐싱

[출력 단계]
추론된 타입 → RBS 생성
```

### 핵심 컴포넌트

#### 1. BodyParser - 메서드 본문 파싱

첫 번째 과제는 파서가 메서드 본문을 분석하지 않았다는 것입니다 - 시그니처만 추출했습니다. T-Ruby 메서드 본문을 IR 노드로 변환하는 `BodyParser`를 구축했습니다:

```ruby
class BodyParser
  def parse(lines, start_line, end_line)
    statements = []
    # 각 라인을 IR 노드로 파싱
    # 처리: 리터럴, 변수, 연산자, 메서드 호출, 조건문
    IR::Block.new(statements: statements)
  end
end
```

지원하는 구문:
- 리터럴: `"hello"`, `42`, `true`, `:symbol`
- 변수: `name`, `@instance_var`, `@@class_var`
- 연산자: `a + b`, `x == y`, `!flag`
- 메서드 호출: `str.upcase`, `array.map { |x| x * 2 }`
- 조건문: `if`/`unless`/`elsif`/`else`

#### 2. TypeEnv - 스코프 체인 관리

```ruby
class TypeEnv
  def initialize(parent = nil)
    @parent = parent
    @bindings = {}       # 지역 변수
    @instance_vars = {}  # 인스턴스 변수
  end

  def lookup(name)
    @bindings[name] || @instance_vars[name] || @parent&.lookup(name)
  end

  def child_scope
    TypeEnv.new(self)
  end
end
```

이를 통해 적절한 스코핑이 가능합니다 - 메서드의 지역 변수는 다른 메서드로 누출되지 않지만, 인스턴스 변수는 클래스 전체에서 공유됩니다.

#### 3. ASTTypeInferrer - 타입 추론 엔진

시스템의 핵심입니다:

```ruby
class ASTTypeInferrer
  LITERAL_TYPE_MAP = {
    string: "String",
    integer: "Integer",
    float: "Float",
    boolean: "bool",
    symbol: "Symbol",
    nil: "nil"
  }.freeze

  def infer_expression(node, env)
    # 캐시 먼저 확인 (지연 평가)
    return @type_cache[node.object_id] if @type_cache[node.object_id]

    type = case node
    when IR::Literal
      LITERAL_TYPE_MAP[node.literal_type]
    when IR::VariableRef
      env.lookup(node.name)
    when IR::BinaryOp
      infer_binary_op(node, env)
    when IR::MethodCall
      infer_method_call(node, env)
    # ... 더 많은 케이스
    end

    @type_cache[node.object_id] = type
  end
end
```

### Ruby의 암묵적 반환 처리

Ruby의 마지막 표현식은 암묵적 반환값입니다. 이는 타입 추론에 매우 중요합니다:

```ruby
def status
  if active?
    "running"
  else
    "stopped"
  end
end
# 암묵적 반환: String (양쪽 분기 모두에서)
```

우리는 이것을 다음과 같이 처리합니다:
1. 모든 명시적 `return` 타입 수집
2. 마지막 표현식 찾기 (암묵적 반환)
3. 모든 반환 타입 통합

```ruby
def infer_method_return_type(method_node, env)
  # 명시적 return 수집
  return_types, terminated = collect_return_types(method_node.body, env)

  # 암묵적 반환 추가 (메서드가 항상 명시적으로 반환하지 않는 경우)
  unless terminated
    implicit_return = infer_implicit_return(method_node.body, env)
    return_types << implicit_return if implicit_return
  end

  unify_types(return_types)
end
```

### 특수 케이스: `initialize` 메서드

Ruby의 `initialize`는 생성자입니다. 반환값은 무시됩니다 - `Class.new`가 인스턴스를 반환합니다. RBS 규칙을 따라 항상 `void`로 추론합니다:

```ruby
class User
  def initialize(name: String)
    @name = name
  end
end
```

생성되는 RBS:

```rbs
class User
  def initialize: (name: String) -> void
end
```

### 내장 메서드 타입 지식

일반적인 Ruby 메서드 반환 타입 테이블을 유지합니다:

```ruby
BUILTIN_METHOD_TYPES = {
  %w[String upcase] => "String",
  %w[String downcase] => "String",
  %w[String length] => "Integer",
  %w[String to_i] => "Integer",
  %w[Array first] => "untyped",  # 요소 타입
  %w[Array length] => "Integer",
  %w[Integer to_s] => "String",
  # ... 200개 이상의 메서드
}.freeze
```

## 결과

이제 이 T-Ruby 코드는:

```ruby
class Greeter
  def initialize(name: String)
    @name = name
  end

  def greet
    "Hello, #{@name}!"
  end

  def shout
    @name.upcase
  end
end
```

올바른 RBS를 자동으로 생성합니다:

```rbs
class Greeter
  @name: String

  def initialize: (name: String) -> void
  def greet: () -> String
  def shout: () -> String
end
```

명시적 반환 타입이 필요 없습니다!

## 테스트

포괄적인 테스트를 구축했습니다:

- **단위 테스트**: 리터럴 추론, 연산자 타입, 메서드 호출 타입
- **E2E 테스트**: RBS 검증을 포함한 전체 컴파일

```ruby
it "문자열 리터럴에서 String을 추론한다" do
  create_trb_file("src/test.trb", <<~TRB)
    class Test
      def message
        "hello world"
      end
    end
  TRB

  rbs_content = compile_and_get_rbs("src/test.trb")
  expect(rbs_content).to include("def message: () -> String")
end
```

## 도전 과제와 해결책

| 도전 과제 | 해결책 |
|-----------|--------|
| 메서드 본문 파싱 부재 | T-Ruby 문법을 위한 커스텀 BodyParser 구축 |
| 암묵적 반환 | 블록의 마지막 표현식 분석 |
| 재귀 메서드 | 2-pass 분석 (시그니처 먼저, 그 다음 본문) |
| 복잡한 표현식 | 점진적 확장: 리터럴 → 변수 → 연산자 → 메서드 호출 |
| 유니온 타입 | 모든 반환 경로를 수집하고 통합 |

## 향후 계획

- **제네릭 추론**: `[1, 2, 3]` → `Array[Integer]`
- **블록/람다 타입**: 블록 파라미터와 반환 타입 추론
- **타입 좁히기**: `if x.is_a?(String)` 이후 더 스마트한 타입
- **크로스 메서드 추론**: 다른 메서드에서 추론된 타입 사용

## 결론

TypeScript의 접근 방식을 연구하고 Ruby의 더 단순한 의미론에 맞게 적용함으로써, 실용적인 타입 추론 시스템을 구축했습니다. 핵심 통찰:

1. **메서드 본문 파싱** - 코드를 보지 않고는 타입을 추론할 수 없음
2. **캐싱을 사용한 지연 평가** - 필요할 때까지 계산하지 않음
3. **Ruby 관용구 처리** - 암묵적 반환, `initialize` 등
4. **단순하게 시작** - 리터럴 먼저, 그 다음 복잡성 증가

타입 추론은 T-Ruby를 더 자연스럽게 만듭니다. Ruby 코드를 작성하고, 타입 안전성을 얻으세요 - 어노테이션 필요 없이.

---

*타입 추론 시스템은 T-Ruby에서 사용 가능합니다. 사용해보시고 의견을 알려주세요!*
