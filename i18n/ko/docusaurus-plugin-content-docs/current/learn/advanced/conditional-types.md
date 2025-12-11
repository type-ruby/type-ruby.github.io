---
sidebar_position: 3
title: 조건부 타입
description: 조건에 따라 달라지는 타입
---

# 조건부 타입

:::caution 준비 중
이 기능은 향후 릴리스에 계획되어 있습니다.
:::

조건부 타입을 사용하면 조건에 따라 변하는 타입을 만들 수 있습니다. 타입 수준의 "if-else" 문이라고 생각하세요—결과 타입은 조건이 참인지 거짓인지에 따라 달라집니다.

## 조건부 타입 이해하기

조건부 타입은 타입 관계에 기반하여 두 타입 중 하나를 선택하는 삼항 연산자 같은 구문을 사용합니다:

```ruby
type Result = Condition ? TrueType : FalseType
```

`Condition`이 참이면 결과는 `TrueType`입니다. 그렇지 않으면 `FalseType`입니다.

### 기본 문법

```ruby
# 조건부 타입 문법
type TypeName<T> = T extends SomeType ? TypeIfTrue : TypeIfFalse

# 예제: T가 문자열인지 확인
type IsString<T> = T extends String ? true : false

# 사용법
type Test1 = IsString<String>   # true
type Test2 = IsString<Integer>  # false
```

## Extends 키워드

조건부 타입의 `extends` 키워드는 타입이 다른 타입에 할당 가능한지 확인합니다:

```ruby
# T extends U는 "T를 U에 할당할 수 있는가?"를 의미

type IsArray<T> = T extends Array<any> ? true : false

type Test1 = IsArray<Array<Integer>>  # true
type Test2 = IsArray<String>          # false
type Test3 = IsArray<Hash<String, Integer>>  # false
```

### 특정 타입 확인

```ruby
# 타입이 숫자인지 확인
type IsNumeric<T> = T extends Integer | Float ? true : false

# 타입이 nil인지 확인
type IsNil<T> = T extends nil ? true : false

# 타입이 함수인지 확인
type IsFunction<T> = T extends Proc<any, any> ? true : false

# 사용 예제
type NumTest = IsNumeric<Integer>  # true
type NilTest = IsNil<nil>          # true
type FnTest = IsFunction<Proc<String, Integer>>  # true
```

## 조건부 타입 패턴

### nil이 아닌 타입 추출

```ruby
# 유니온 타입에서 nil 제거
type NonNil<T> = T extends nil ? never : T

# 사용법
type MaybeString = String | nil
type JustString = NonNil<MaybeString>  # String

type MixedTypes = String | Integer | nil | Float
type WithoutNil = NonNil<MixedTypes>  # String | Integer | Float
```

### 함수 반환 타입 추출

```ruby
# 함수의 반환 타입 가져오기
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

# 사용법
type AddFunction = Proc<Integer, Integer, Integer>
type AddReturnType = ReturnType<AddFunction>  # Integer

type GetUserFunction = Proc<Integer, User>
type UserReturnType = ReturnType<GetUserFunction>  # User
```

### 배열 요소 타입 추출

```ruby
# 배열의 요소 타입 가져오기
type ElementType<T> = T extends Array<infer E> ? E : never

# 사용법
type StringArray = Array<String>
type StringElement = ElementType<StringArray>  # String

type NumberArray = Array<Integer>
type NumberElement = ElementType<NumberArray>  # Integer
```

## `infer` 키워드

`infer` 키워드를 사용하면 조건부 타입 내에서 타입을 캡처하고 이름을 지정할 수 있습니다:

```ruby
# 함수의 매개변수 타입 추론
type ParamType<T> = T extends Proc<infer P, any> ? P : never

# 해시의 키 타입 추론
type KeyType<T> = T extends Hash<infer K, any> ? K : never

# 해시의 값 타입 추론
type ValueError<T> = T extends Hash<any, infer V> ? V : never

# 사용법
type MyFunction = Proc<String, Integer>
type Param = ParamType<MyFunction>  # String

type MyHash = Hash<Symbol, User>
type Key = KeyType<MyHash>    # Symbol
type Value = ValueError<MyHash>  # User
```

### 여러 개의 infer 사용

```ruby
# 쌍의 두 부분 추출
type Unpair<T> = T extends Hash<Symbol, { first: infer F, second: infer S }>
  ? [F, S]
  : never

# 함수 시그니처 부분 추출
type FunctionParts<T> =
  T extends Proc<infer P, infer R>
    ? { params: P, return: R }
    : never
```

## 실용적인 예제

### 타입 언래핑

래퍼 타입을 제거하여 내부 타입을 가져옵니다:

```ruby
# 배열 언래핑
type Unwrap<T> = T extends Array<infer U> ? U : T

# 사용법
type Wrapped1 = Unwrap<Array<String>>  # String
type Wrapped2 = Unwrap<String>         # String (변경 없음)

# 중첩 배열 언래핑
type DeepUnwrap<T> =
  T extends Array<infer U>
    ? DeepUnwrap<U>
    : T

type NestedArray = Array<Array<Array<Integer>>>
type Unwrapped = DeepUnwrap<NestedArray>  # Integer
```

### 유니온 타입 평탄화

```ruby
# 중첩된 유니온 평탄화
type Flatten<T> =
  T extends Array<infer U>
    ? Flatten<U>
    : T extends Hash<any, infer V>
      ? Flatten<V>
      : T

# 유니온에서 중복 제거 (가능한 경우)
type Unique<T, U = T> =
  T extends U
    ? [U] extends [T]
      ? T
      : Unique<T, Exclude<U, T>>
    : never
```

### Promise 같은 타입

```ruby
# Promise 같은 타입 언래핑
type Awaited<T> =
  T extends Promise<infer U>
    ? Awaited<U>
    : T

# 비동기 반환 타입 시뮬레이션
type AsyncReturnType<T> =
  T extends Proc<any, infer R>
    ? Awaited<R>
    : never
```

## 분배 조건부 타입

조건부 타입이 유니온 타입에 작용할 때, 유니온에 대해 분배됩니다:

```ruby
# 이 조건부 타입은 분배적
type ToArray<T> = T extends any ? Array<T> : never

# 유니온에 적용되면 분배됨:
type StringOrNumber = String | Integer
type Result = ToArray<StringOrNumber>
# 결과: Array<String> | Array<Integer>
# 아님: Array<String | Integer>

# 또 다른 예제
type BoxedType<T> = T extends any ? { value: T } : never

type Mixed = String | Integer | Bool
type Boxed = BoxedType<Mixed>
# 결과: { value: String } | { value: Integer } | { value: Bool }
```

### 분배 방지

분배를 방지하려면 타입을 튜플로 감쌉니다:

```ruby
# 비분배 버전
type ToArrayNonDist<T> = [T] extends [any] ? Array<T> : never

type StringOrNumber = String | Integer
type Result = ToArrayNonDist<StringOrNumber>
# 결과: Array<String | Integer>
```

## 고급 패턴

### 타입 좁히기

```ruby
# 속성에 따른 타입 좁히기
type NarrowByProperty<T, K extends keyof T, V> =
  T extends { K: V } ? T : never

# 속성에 따른 유니온에서 타입 필터링
type FilterByProperty<T, K, V> =
  T extends infer U
    ? U extends { K: V }
      ? U
      : never
    : never
```

### 재귀 조건부 타입

```ruby
# 깊은 읽기 전용 타입
type DeepReadonly<T> =
  T extends (Array<infer U> | Hash<any, infer U>)
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends Hash<infer K, infer V>
      ? ReadonlyHash<K, DeepReadonly<V>>
      : T

# 깊은 부분 타입
type DeepPartial<T> =
  T extends Hash<infer K, infer V>
    ? Hash<K, DeepPartial<V> | nil>
    : T extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T
```

### 타입 가드 함수

```ruby
# 타입 술어 생성
def is_string<T>(value: T): value is String
  value.is_a?(String)
end

def is_array<T>(value: T): value is Array<any>
  value.is_a?(Array)
end

# 조건부 타입과 함께 사용
type TypeGuardReturn<T, G> =
  G extends true ? T : never
```

## 제네릭과 조건부 타입

조건부 타입을 제네릭 제약과 결합합니다:

```ruby
# 특정 타입만 허용
type Addable<T> =
  T extends Integer | Float | String
    ? T
    : never

def add<T extends Addable<T>>(a: T, b: T): T
  a + b
end

# 조건부로 타입 변환
type Transform<T> =
  T extends String ? Integer :
  T extends Integer ? Float :
  T extends Float ? String :
  T

# 사용법
def transform<T>(value: T): Transform<T>
  case value
  when String
    value.length  # Integer 반환
  when Integer
    value.to_f    # Float 반환
  when Float
    value.to_s    # String 반환
  else
    value
  end
end
```

## 실용적인 사용 사례

### API 응답 타입

```ruby
# 성공 상태에 따라 조건부로 오류 필드 추가
type APIResponse<T, Success extends Bool> =
  Success extends true
    ? { success: true, data: T }
    : { success: false, error: String }

# 사용법
type SuccessResponse = APIResponse<User, true>
# { success: true, data: User }

type ErrorResponse = APIResponse<User, false>
# { success: false, error: String }
```

### 스마트 기본값

```ruby
# 조건부로 기본 타입 제공
type WithDefault<T, D> = T extends nil ? D : T

# 사용법
type MaybeString = String | nil
type StringWithDefault = WithDefault<MaybeString, String>  # String

type DefiniteValue = Integer
type IntegerWithDefault = WithDefault<DefiniteValue, Float>  # Integer
```

### 컬렉션 요소 접근

```ruby
# 컬렉션 타입에 따른 타입 가져오기
type CollectionElement<T> =
  T extends Array<infer E> ? E :
  T extends Hash<any, infer V> ? V :
  T extends Set<infer S> ? S :
  never

# 사용법
type ArrayElement = CollectionElement<Array<String>>  # String
type HashValue = CollectionElement<Hash<Symbol, Integer>>  # Integer
type SetElement = CollectionElement<Set<User>>  # User
```

### 함수 합성

```ruby
# 함수 타입 합성
type Compose<F, G> =
  F extends Proc<infer A, infer B>
    ? G extends Proc<B, infer C>
      ? Proc<A, C>
      : never
    : never

# 사용법
type F = Proc<String, Integer>  # String -> Integer
type G = Proc<Integer, Bool>    # Integer -> Bool
type Composed = Compose<F, G>   # String -> Bool
```

## 모범 사례

### 1. 조건을 간단하게 유지

```ruby
# 좋음: 간단하고 명확한 조건
type IsString<T> = T extends String ? true : false

# 덜 좋음: 복잡한 중첩 조건
type ComplexCheck<T> =
  T extends String
    ? T extends "hello"
      ? true
      : T extends "world"
        ? true
        : false
    : false
```

### 2. 설명적인 이름 사용

```ruby
# 좋음: 명확한 이름
type NonNilable<T> = T extends nil ? never : T
type Unwrap<T> = T extends Array<infer U> ? U : T

# 덜 좋음: 암호 같은 이름
type NN<T> = T extends nil ? never : T
type UW<T> = T extends Array<infer U> ? U : T
```

### 3. 복잡한 타입 문서화

```ruby
# 좋음: 문서화된 조건부 타입
# 함수 타입의 반환 타입 추출
# @example ReturnType<Proc<String, Integer>> => Integer
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

# 모든 속성을 재귀적으로 선택적으로 만듦
# @example DeepPartial<User> => 모든 User 속성이 T | nil이 됨
type DeepPartial<T> =
  T extends Hash<infer K, infer V>
    ? Hash<K, DeepPartial<V> | nil>
    : T
```

### 4. 깊은 중첩 피하기

```ruby
# 좋음: 평평하고 관리 가능한 구조
type FirstType<T> = T extends [infer F, ...any] ? F : never
type RestTypes<T> = T extends [any, ...infer R] ? R : never

# 덜 좋음: 깊게 중첩됨
type Extract<T> =
  T extends [infer F, ...infer R]
    ? F extends String
      ? R extends Array<infer U>
        ? U extends Integer
          ? [F, U]
          : never
        : never
      : never
    : never
```

## 제한사항

### 재귀 깊이

```ruby
# 매우 깊은 재귀는 한계에 도달할 수 있음
type DeepNested<T, N> =
  N extends 0
    ? T
    : Array<DeepNested<T, Decrement<N>>>  # 깊이 한계에 도달할 수 있음
```

### 타입 추론 복잡성

```ruby
# 복잡한 추론이 항상 예상대로 작동하지 않을 수 있음
type ComplexInfer<T> =
  T extends {
    a: infer A,
    b: infer B,
    c: (x: infer C) => infer D
  } ? [A, B, C, D] : never
```

## 다음 단계

이제 조건부 타입을 이해했으니 다음을 탐색하세요:

- [매핑된 타입](/docs/learn/advanced/mapped-types)으로 타입의 속성 변환
- [유틸리티 타입](/docs/learn/advanced/utility-types)은 내부적으로 조건부 타입 사용
- [타입 추론](/docs/learn/basics/type-inference)으로 T-Ruby가 타입을 추론하는 방법 이해
- [제약이 있는 제네릭](/docs/learn/generics/constraints)으로 제어된 타입 매개변수
