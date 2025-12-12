---
sidebar_position: 4
title: 매핑된 타입
description: 프로그래밍 방식으로 타입 변환
---

<DocsBadge />


# 매핑된 타입

:::caution 준비 중
이 기능은 향후 릴리스에 계획되어 있습니다.
:::

매핑된 타입을 사용하면 속성을 반복하여 한 타입을 다른 타입으로 변환할 수 있습니다. 타입을 위한 "map" 연산이라고 생각하세요—각 속성에 변환을 적용하여 기존 타입을 기반으로 프로그래밍 방식으로 새 타입을 만들 수 있습니다.

## 매핑된 타입 이해하기

매핑된 타입은 타입의 키를 반복하고 변환을 적용하여 새 타입을 만듭니다:

```trb
type MappedType<T> = {
  [K in keyof T]: Transformation<T[K]>
}
```

### 기본 문법

```trb
# T의 키를 반복
type ReadonlyType<T> = {
  readonly [K in keyof T]: T[K]
}

# 모든 속성을 선택적으로 만들기
type OptionalType<T> = {
  [K in keyof T]?: T[K]
}

# 모든 속성을 필수로 만들기
type RequiredType<T> = {
  [K in keyof T]-?: T[K]
}
```

## `keyof` 연산자

`keyof` 연산자는 타입의 모든 키를 유니온으로 가져옵니다:

```trb
type User = {
  id: Integer,
  name: String,
  email: String
}

type UserKeys = keyof User  # "id" | "name" | "email"

# 매핑된 타입에서 사용
type UserValues<T> = {
  [K in keyof T]: T[K]
}
```

## 기본 매핑된 타입 패턴

### 속성을 읽기 전용으로 만들기

```trb
# 모든 속성을 읽기 전용으로 만들기
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type ReadonlyUser = Readonly<User>
# {
#   readonly id: Integer,
#   readonly name: String,
#   readonly email: String
# }

# 사용법
user: ReadonlyUser = { id: 1, name: "Alice", email: "alice@example.com" }
# user.name = "Bob"  # 에러: 읽기 전용 속성에 할당할 수 없음
```

### 속성을 선택적으로 만들기

```trb
# 모든 속성을 선택적으로 만들기
type Partial<T> = {
  [K in keyof T]?: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type PartialUser = Partial<User>
# {
#   id?: Integer,
#   name?: String,
#   email?: String
# }

# 사용법 - 모든 속성이 선택적
partial_user: PartialUser = { name: "Alice" }  # OK
partial_user2: PartialUser = {}  # OK
```

### 속성을 필수로 만들기

```trb
# 선택적 수정자 제거
type Required<T> = {
  [K in keyof T]-?: T[K]
}

type UserUpdate = {
  id?: Integer,
  name?: String,
  email?: String
}

type RequiredUserUpdate = Required<UserUpdate>
# {
#   id: Integer,
#   name: String,
#   email: String
# }
```

## 속성 변환

### 속성 타입 변환

```trb
# 모든 속성을 배열로 변환
type Arrayify<T> = {
  [K in keyof T]: Array<T[K]>
}

type User = {
  id: Integer,
  name: String
}

type ArrayUser = Arrayify<User>
# {
#   id: Array<Integer>,
#   name: Array<String>
# }

# 모든 속성을 프로미스로 변환
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>
}

# 모든 속성을 널러블로 변환
type Nullable<T> = {
  [K in keyof T]: T[K] | nil
}
```

### 수정자 추가 또는 제거

```trb
# 읽기 전용 추가
type AddReadonly<T> = {
  +readonly [K in keyof T]: T[K]
}

# 읽기 전용 제거
type RemoveReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}

# 선택적으로 만들기
type MakeOptional<T> = {
  [K in keyof T]+?: T[K]
}

# 필수로 만들기
type MakeRequired<T> = {
  [K in keyof T]-?: T[K]
}
```

## 키 필터링

### 특정 속성 선택

```trb
# 지정된 키만 선택
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type PublicUser = Pick<User, "id" | "name">
# {
#   id: Integer,
#   name: String
# }

# 사용법
public_user: PublicUser = { id: 1, name: "Alice" }
```

### 특정 속성 제외

```trb
# 지정된 키 제외
type Omit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type UserWithoutPassword = Omit<User, "password">
# {
#   id: Integer,
#   name: String,
#   email: String
# }

# 여러 속성 제외
type UserBasic = Omit<User, "password" | "email">
# {
#   id: Integer,
#   name: String
# }
```

## 조건부 매핑된 타입

매핑된 타입을 조건부 타입과 결합:

```trb
# 조건에 따라 속성을 읽기 전용으로 만들기
type ConditionalReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function ? T[K] : readonly T[K]
}

# 조건에 따라 속성을 널러블로 만들기
type ConditionalNullable<T> = {
  [K in keyof T]: T[K] extends String ? T[K] | nil : T[K]
}

# 함수 제거
type RemoveFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}
```

## 키 리매핑

매핑하는 동안 속성 키 변환:

```trb
# 모든 키에 접두사 추가
type Prefixed<T, Prefix extends String> = {
  [K in keyof T as `${Prefix}${K}`]: T[K]
}

type User = {
  id: Integer,
  name: String
}

type PrefixedUser = Prefixed<User, "user_">
# {
#   user_id: Integer,
#   user_name: String
# }

# 키를 대문자로 변환
type Uppercased<T> = {
  [K in keyof T as Uppercase<K>]: T[K]
}

# getter 추가
type WithGetters<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: () => T[K]
}

type User = { name: String, age: Integer }
type UserWithGetters = WithGetters<User>
# {
#   getName: () => String,
#   getAge: () => Integer
# }
```

## 실용적인 예제

### DTO 패턴

```trb
# 데이터 전송 객체 - 모든 속성이 선택적이고 널러블이 됨
type DTO<T> = {
  [K in keyof T]?: T[K] | nil
}

# API 응답 - 데이터 래핑
type APIWrapper<T> = {
  [K in keyof T]: {
    value: T[K],
    updated_at: Time
  }
}

type User = {
  name: String,
  email: String
}

type UserDTO = DTO<User>
# {
#   name?: String | nil,
#   email?: String | nil
# }

type UserAPI = APIWrapper<User>
# {
#   name: { value: String, updated_at: Time },
#   email: { value: String, updated_at: Time }
# }
```

### 폼 핸들러

```trb
# 속성을 폼 필드로 변환
type FormFields<T> = {
  [K in keyof T]: {
    value: T[K],
    error: String | nil,
    touched: Bool
  }
}

# 폼 값만
type FormValues<T> = {
  [K in keyof T]: T[K]
}

# 폼 이벤트 핸들러
type FormHandlers<T> = {
  [K in keyof T as `on${Capitalize<K>}Change`]: (value: T[K]) => void
}

type LoginForm = {
  username: String,
  password: String
}

type LoginFields = FormFields<LoginForm>
# {
#   username: { value: String, error: String | nil, touched: Bool },
#   password: { value: String, error: String | nil, touched: Bool }
# }

type LoginHandlers = FormHandlers<LoginForm>
# {
#   onUsernameChange: (value: String) => void,
#   onPasswordChange: (value: String) => void
# }
```

### 데이터베이스 모델

```trb
# 모델에 타임스탬프 추가
type WithTimestamps<T> = T & {
  created_at: Time,
  updated_at: Time
}

# 업데이트를 위해 모델을 부분적으로 만들기
type UpdateModel<T> = Partial<Omit<T, "id" | "created_at">>

# 데이터베이스 메타데이터 추가
type DBModel<T> = {
  [K in keyof T]: {
    value: T[K],
    column_name: String,
    dirty: Bool
  }
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type TimestampedUser = WithTimestamps<User>
# {
#   id: Integer,
#   name: String,
#   email: String,
#   created_at: Time,
#   updated_at: Time
# }

type UserUpdate = UpdateModel<User>
# {
#   name?: String,
#   email?: String
# }
```

### 이벤트 핸들러

```trb
# 모든 속성에 대한 이벤트 핸들러 생성
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<K>}Updated`]: (value: T[K]) => void
}

# 모든 속성에 대한 검증자 생성
type Validators<T> = {
  [K in keyof T]: (value: T[K]) => Bool
}

# 모든 속성에 대한 직렬화기 생성
type Serializers<T> = {
  [K in keyof T]: (value: T[K]) => String
}

type Product = {
  name: String,
  price: Float,
  stock: Integer
}

type ProductHandlers = EventHandlers<Product>
# {
#   onNameUpdated: (value: String) => void,
#   onPriceUpdated: (value: Float) => void,
#   onStockUpdated: (value: Integer) => void
# }

type ProductValidators = Validators<Product>
# {
#   name: (value: String) => Bool,
#   price: (value: Float) => Bool,
#   stock: (value: Integer) => Bool
# }
```

## 깊은 매핑된 타입

중첩된 객체에 재귀적으로 매핑 적용:

```trb
# 깊은 읽기 전용
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Hash<any, any>
    ? DeepReadonly<T[K]>
    : T[K]
}

# 깊은 부분
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Hash<any, any>
    ? DeepPartial<T[K]>
    : T[K]
}

# 깊은 필수
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends Hash<any, any>
    ? DeepRequired<T[K]>
    : T[K]
}

type NestedUser = {
  profile: {
    name: String,
    settings: {
      theme: String,
      notifications: Bool
    }
  }
}

type DeepReadonlyUser = DeepReadonly<NestedUser>
# 모든 중첩 속성이 읽기 전용이 됨
```

## 매핑된 타입 결합

여러 매핑 결합:

```trb
# 읽기 전용과 부분
type ReadonlyPartial<T> = Readonly<Partial<T>>

# 읽기 전용과 필수
type ReadonlyRequired<T> = Readonly<Required<T>>

# 널러블과 부분
type NullablePartial<T> = {
  [K in keyof T]?: T[K] | nil
}

# Pick과 Partial
type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type SafeUserUpdate = ReadonlyPartial<Omit<User, "id">>
# {
#   readonly name?: String,
#   readonly email?: String,
#   readonly password?: String
# }
```

## 타입 안전 빌더

매핑된 타입을 사용하여 타입 안전 빌더 생성:

```trb
# 모든 속성이 설정되도록 보장하는 빌더
type Builder<T> = {
  [K in keyof T as `with${Capitalize<K>}`]: (value: T[K]) => Builder<T>
} & {
  build: () => T
}

# 플루언트 API
type FluentAPI<T> = {
  [K in keyof T]: (value: T[K]) => FluentAPI<T>
} & {
  get: () => T
}

# 사용 예제
type User = {
  name: String,
  email: String,
  age: Integer
}

type UserBuilder = Builder<User>
# {
#   withName: (value: String) => UserBuilder,
#   withEmail: (value: String) => UserBuilder,
#   withAge: (value: Integer) => UserBuilder,
#   build: () => User
# }
```

## 모범 사례

### 1. 설명적인 이름 사용

```trb
# 좋음: 명확한 목적
type ReadonlyUser = Readonly<User>
type PartialUpdate = Partial<UserUpdate>
type PublicProfile = Pick<User, "id" | "name">

# 덜 좋음: 일반적인 이름
type UserType1 = Readonly<User>
type UserType2 = Partial<UserUpdate>
```

### 2. 재사용 가능한 매핑된 타입 생성

```trb
# 좋음: 재사용 가능한 유틸리티
type WithTimestamps<T> = T & { created_at: Time, updated_at: Time }
type WithSoftDelete<T> = T & { deleted_at: Time | nil }
type WithMetadata<T> = T & { metadata: Hash<String, String> }

# 구성하기
type FullModel<T> = WithTimestamps<WithSoftDelete<WithMetadata<T>>>
```

### 3. 복잡한 매핑 문서화

```trb
# 좋음: 문서화됨
# 모든 속성을 해당 getter 메서드로 변환
# 예: { name: String } => { getName: () => String }
type ToGetters<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: () => T[K]
}
```

### 4. 조건부 타입과 결합

```trb
# 좋음: 스마트 변환
type SmartNullable<T> = {
  [K in keyof T]: T[K] extends String | Integer
    ? T[K] | nil
    : T[K]
}
```

## 일반적인 패턴

### 레포지토리 패턴

```trb
type Repository<T> = {
  find_by_id: (id: Integer) => T | nil,
  find_all: () => Array<T>,
  save: (entity: T) => T,
  update: (id: Integer, data: Partial<T>) => T | nil,
  delete: (id: Integer) => Bool
}

type CRUDHandlers<T> = {
  create: (data: Omit<T, "id">) => T,
  read: (id: Integer) => T | nil,
  update: (id: Integer, data: Partial<T>) => T | nil,
  delete: (id: Integer) => Bool
}
```

### 상태 관리

```trb
type State<T> = T

type Actions<T> = {
  [K in keyof T as `set${Capitalize<K>}`]: (value: T[K]) => void
} & {
  [K in keyof T as `get${Capitalize<K>}`]: () => T[K]
}

type Reducers<T> = {
  [K in keyof T]: (state: T[K], action: any) => T[K]
}
```

## 제한사항

### 새 속성을 추가할 수 없음

```trb
# 원본 타입에 없는 속성을 추가할 수 없음
type Extended<T> = {
  [K in keyof T]: T[K]
  # new_property: String  # 에러: 매핑된 타입에서 새 속성을 추가할 수 없음
}

# 대신 교차 사용
type Extended<T> = T & { new_property: String }
```

### 키 타입 제한

```trb
# 키는 String | Symbol | Integer여야 함
type ValidKeys = { [K in String]: any }     # OK
type InvalidKeys = { [K in User]: any }     # 에러: User는 유효한 키 타입이 아님
```

## 다음 단계

이제 매핑된 타입을 이해했으니 다음을 탐색하세요:

- [유틸리티 타입](/docs/learn/advanced/utility-types)은 매핑된 타입을 사용하여 구축됨
- [조건부 타입](/docs/learn/advanced/conditional-types)으로 매핑에 로직 추가
- [타입 별칭](/docs/learn/advanced/type-aliases)으로 매핑된 타입에 이름 붙이기
- [제네릭](/docs/learn/generics/generic-functions-classes)으로 매핑된 타입을 재사용 가능하게 만들기
