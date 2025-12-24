---
sidebar_position: 5
title: 유틸리티 타입
description: 일반적인 변환을 위한 내장 유틸리티 타입
---

<DocsBadge />


# 유틸리티 타입

:::caution 준비 중
이 기능은 향후 릴리스에 계획되어 있습니다.
:::

유틸리티 타입은 일반적인 타입 변환을 수행하는 미리 만들어진 제네릭 타입입니다. 타입을 위한 표준 라이브러리와 같아서, 일상적인 타입 조작 작업을 위한 즉시 사용 가능한 솔루션을 제공합니다. 이러한 유틸리티를 이해하면 T-Ruby 코드가 더 간결하고 표현력 있게 됩니다.

## 속성 수정자

### Partial\<T\>

타입의 모든 속성을 선택적으로 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={25} />

```trb
type Partial<T> = {
  [K in keyof T]?: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  age: Integer
}

type PartialUser = Partial<User>
# {
#   id?: Integer,
#   name?: String,
#   email?: String,
#   age?: Integer
# }

# 사용법 - update 함수는 종종 Partial을 사용
def update_user(id: Integer, updates: Partial<User>): User
  user = find_user(id)
  # 제공된 업데이트만 적용
  user.name = updates[:name] if updates[:name]
  user.email = updates[:email] if updates[:email]
  user.age = updates[:age] if updates[:age]
  user
end

# 속성의 모든 부분집합을 제공할 수 있음
update_user(1, { name: "Alice" })
update_user(1, { name: "Bob", email: "bob@example.com" })
update_user(1, {})  # 유효, 업데이트 없음
```

### Required\<T\>

모든 속성을 필수로 만듭니다(선택성 제거):

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={36} />

```trb
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

# 사용법 - 모든 필드가 있는지 확인
def create_user(data: Required<UserUpdate>): User
  # 모든 필드가 있음을 보장
  User.new(data[:id], data[:name], data[:email])
end
```

### Readonly\<T\>

모든 속성을 읽기 전용으로 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={47} />

```trb
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type ReadonlyUser = Readonly<User>

# 사용법 - 수정 방지
def display_user(user: ReadonlyUser): void
  puts "User: #{user.name}"
  # user.name = "Changed"  # 에러: 읽기 전용 속성을 수정할 수 없음
end

# 일반적인 패턴: 설정 고정
type Config = Readonly<{
  api_url: String,
  timeout: Integer,
  max_retries: Integer
}>

config: Config = {
  api_url: "https://api.example.com",
  timeout: 30,
  max_retries: 3
}
```

## 속성 선택

### Pick\<T, K\>

다른 타입에서 특정 속성을 선택하여 타입을 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={58} />

```trb
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String,
  created_at: Time,
  updated_at: Time
}

# 공개 필드만 선택
type PublicUser = Pick<User, "id" | "name" | "email">
# {
#   id: Integer,
#   name: String,
#   email: String
# }

# 인증 필드 선택
type AuthUser = Pick<User, "id" | "email" | "password">
# {
#   id: Integer,
#   email: String,
#   password: String
# }

# 사용법
def get_public_user(user: User): PublicUser
  {
    id: user.id,
    name: user.name,
    email: user.email
  }
end
```

### Omit\<T, K\>

다른 타입에서 특정 속성을 제외하여 타입을 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={69} />

```trb
type Omit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P]
}

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String,
  created_at: Time,
  updated_at: Time
}

# 민감한 데이터 제외
type SafeUser = Omit<User, "password">
# {
#   id: Integer,
#   name: String,
#   email: String,
#   created_at: Time,
#   updated_at: Time
# }

# 생성을 위해 생성된 필드 제외
type UserInput = Omit<User, "id" | "created_at" | "updated_at">
# {
#   name: String,
#   email: String,
#   password: String
# }

# 사용법
def create_user(input: UserInput): User
  User.new(
    id: generate_id(),
    name: input[:name],
    email: input[:email],
    password: hash_password(input[:password]),
    created_at: Time.now,
    updated_at: Time.now
  )
end
```

## 유니온 및 교차 연산

### Exclude\<T, U\>

유니온에서 타입 제외:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={80} />

```trb
type Exclude<T, U> = T extends U ? never : T

type AllTypes = String | Integer | Float | Boolean
type NumericOnly = Exclude<AllTypes, String | Boolean>
# Integer | Float

type Status = "pending" | "approved" | "rejected" | "cancelled"
type ActiveStatus = Exclude<Status, "cancelled">
# "pending" | "approved" | "rejected"

# 사용법
def process_active_order(status: ActiveStatus): void
  case status
  when "pending"
    puts "Processing pending order"
  when "approved"
    puts "Shipping approved order"
  when "rejected"
    puts "Handling rejected order"
  # "cancelled"는 여기서 불가능
  end
end
```

### Extract\<T, U\>

유니온에서 타입 추출:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={91} />

```trb
type Extract<T, U> = T extends U ? T : never

type AllTypes = String | Integer | Float | Boolean
type NumericOnly = Extract<AllTypes, Integer | Float>
# Integer | Float

type Status = "pending" | "approved" | "rejected" | "cancelled"
type FinalStatus = Extract<Status, "approved" | "rejected" | "cancelled">
# "approved" | "rejected" | "cancelled"

# 사용법
def finalize_order(status: FinalStatus): void
  # 최종 상태만 허용
  puts "Order is in final state: #{status}"
end
```

### NonNullable\<T\>

타입에서 `nil` 제거:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={102} />

```trb
type NonNullable<T> = T extends nil ? never : T

type MaybeString = String | nil
type DefiniteString = NonNullable<MaybeString>
# String

type MixedTypes = String | Integer | nil | Float | nil
type WithoutNil = NonNullable<MixedTypes>
# String | Integer | Float

# 사용법
def process_value<T>(value: T | nil): NonNullable<T>
  raise "Value cannot be nil" if value.nil?
  value  # 타입이 T로 좁혀짐 (nil 없음)
end
```

## 함수 타입

### ReturnType\<T\>

함수 타입의 반환 타입 추출:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={113} />

```trb
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

type GetUserFn = Proc<Integer, User>
type UserType = ReturnType<GetUserFn>
# User

type CalculateFn = Proc<Integer, Integer, Float>
type ResultType = ReturnType<CalculateFn>
# Float

# 사용법 - 함수에서 반환 타입 추론
def wrap_function<F>(fn: F): Proc<any, ReturnType<F>>
  ->(args: any): ReturnType<F> {
    result = fn.call(args)
    puts "Function returned: #{result}"
    result
  }
end
```

### Parameters\<T\>

함수 타입에서 매개변수 타입 추출:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={124} />

```trb
type Parameters<T> = T extends Proc<infer P, any> ? P : never

type GetUserFn = Proc<Integer, User>
type GetUserParams = Parameters<GetUserFn>
# Integer

type CreateUserFn = Proc<String, String, Integer, User>
type CreateUserParams = Parameters<CreateUserFn>
# [String, String, Integer]

# 사용법
def call_with_logging<F>(fn: F, ...args: Parameters<F>): ReturnType<F>
  puts "Calling function with args: #{args}"
  result = fn.call(*args)
  puts "Function returned: #{result}"
  result
end
```

## 레코드 타입

### Record\<K, V\>

키 타입이 K이고 값 타입이 V인 타입을 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={135} />

```trb
type Record<K extends String | Symbol | Integer, V> = {
  [P in K]: V
}

# 문자열 키, 정수 값
type StringToInt = Record<String, Integer>
# { [key: String]: Integer }

# 특정 문자열 리터럴 키
type StatusMap = Record<"pending" | "approved" | "rejected", Boolean>
# {
#   pending: Boolean,
#   approved: Boolean,
#   rejected: Boolean
# }

# 사용 예제
status_flags: StatusMap = {
  pending: true,
  approved: false,
  rejected: false
}

# 사용자 ID를 User에 매핑
user_cache: Record<Integer, User> = {
  1 => User.new(1, "Alice"),
  2 => User.new(2, "Bob")
}

# 환경별 설정
configs: Record<"development" | "staging" | "production", Config> = {
  development: dev_config,
  staging: staging_config,
  production: prod_config
}
```

## 배열 및 튜플 유틸리티

### ArrayElement\<T\>

배열에서 요소 타입 추출:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={146} />

```trb
type ArrayElement<T> = T extends Array<infer E> ? E : never

type StringArray = Array<String>
type StringElement = ArrayElement<StringArray>
# String

type UserArray = Array<User>
type UserElement = ArrayElement<UserArray>
# User

# 사용법
def first_element<T>(arr: Array<T>): ArrayElement<Array<T>> | nil
  arr.first
end
```

### ReadonlyArray\<T\>

요소를 수정할 수 없는 배열:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={157} />

```trb
type ReadonlyArray<T> = readonly Array<T>

# 사용법
def process_items(items: ReadonlyArray<String>): void
  items.each { |item| puts item }
  # items.push("new")  # 에러: 읽기 전용 배열을 수정할 수 없음
  # items[0] = "changed"  # 에러: 읽기 전용 배열을 수정할 수 없음
end

# 상수에 유용
ALLOWED_STATUSES: ReadonlyArray<String> = ["pending", "approved", "rejected"]
```

## 실용적인 유틸리티 타입

### DeepPartial\<T\>

모든 속성과 중첩된 속성을 선택적으로 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={168} />

```trb
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Hash<any, any>
    ? DeepPartial<T[K]>
    : T[K]
}

type User = {
  id: Integer,
  profile: {
    name: String,
    email: String,
    settings: {
      theme: String,
      notifications: Boolean
    }
  }
}

type DeepPartialUser = DeepPartial<User>
# 모든 수준의 모든 속성이 선택적

# 사용법 - 깊은 업데이트
def deep_update_user(id: Integer, updates: DeepPartial<User>): User
  user = find_user(id)
  # 어떤 중첩된 속성이든 업데이트 가능
  user.profile.name = updates[:profile][:name] if updates[:profile]&.[](:name)
  user.profile.settings.theme = updates[:profile][:settings][:theme] if updates[:profile][:settings]&.[](:theme)
  user
end
```

### DeepReadonly\<T\>

모든 속성과 중첩된 속성을 읽기 전용으로 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={179} />

```trb
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Hash<any, any>
    ? DeepReadonly<T[K]>
    : T[K]
}

type Config = {
  app: {
    name: String,
    version: String,
    features: {
      auth: Boolean,
      api: Boolean
    }
  }
}

type ImmutableConfig = DeepReadonly<Config>
# 모든 중첩 속성이 읽기 전용

config: ImmutableConfig = load_config()
# config.app.name = "New"  # 에러: 읽기 전용
# config.app.features.auth = false  # 에러: 읽기 전용
```

### Mutable\<T\>

읽기 전용 수정자 제거:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={190} />

```trb
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type ReadonlyUser = {
  readonly id: Integer,
  readonly name: String
}

type MutableUser = Mutable<ReadonlyUser>
# {
#   id: Integer,
#   name: String
# }

# 사용법 - 변경 가능한 복사본 생성
def clone_user(user: ReadonlyUser): MutableUser
  {
    id: user.id,
    name: user.name
  }
end
```

## 구성 유틸리티

### Merge\<T, U\>

두 타입을 병합하고, U의 속성이 T의 속성을 재정의:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={201} />

```trb
type Merge<T, U> = Omit<T, keyof U> & U

type User = {
  id: Integer,
  name: String,
  email: String
}

type UserUpdate = {
  email: String | nil,  # null 허용
  updated_at: Time      # 새 속성
}

type MergedUser = Merge<User, UserUpdate>
# {
#   id: Integer,
#   name: String,
#   email: String | nil,    # 재정의됨
#   updated_at: Time        # 추가됨
# }
```

### Intersection\<T, U\>

두 타입에 모두 존재하는 속성 가져오기:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={212} />

```trb
type Intersection<T, U> = Pick<T, Extract<keyof T, keyof U>>

type User = {
  id: Integer,
  name: String,
  email: String
}

type Person = {
  name: String,
  email: String,
  age: Integer
}

type Common = Intersection<User, Person>
# {
#   name: String,
#   email: String
# }
```

### Difference\<T, U\>

T에는 있지만 U에는 없는 속성 가져오기:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={223} />

```trb
type Difference<T, U> = Omit<T, keyof U>

type User = {
  id: Integer,
  name: String,
  email: String,
  password: String
}

type PublicFields = {
  id: Integer,
  name: String
}

type PrivateFields = Difference<User, PublicFields>
# {
#   email: String,
#   password: String
# }
```

## 조건부 유틸리티

### If\<Condition, Then, Else\>

타입 수준 if-else:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={234} />

```trb
type If<Condition extends Boolean, Then, Else> =
  Condition extends true ? Then : Else

# 사용법
type IsProduction<Env> = If<
  Env extends "production",
  { debug: false, logging: :error },
  { debug: true, logging: :debug }
>

type ProdConfig = IsProduction<"production">
# { debug: false, logging: :error }

type DevConfig = IsProduction<"development">
# { debug: true, logging: :debug }
```

### Nullable\<T\>

타입을 널러블로 만들기:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={245} />

```trb
type Nullable<T> = T | nil

type User = { id: Integer, name: String }
type MaybeUser = Nullable<User>
# User | nil

# 함수에서 사용
def find_user(id: Integer): Nullable<User>
  # 찾지 못하면 nil 반환 가능
end
```

### Promisify\<T\>

반환 타입을 프로미스로 래핑 (비동기 연산용):

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={256} />

```trb
type Promisify<T> = {
  [K in keyof T]: T[K] extends Proc<infer Args, infer R>
    ? Proc<Args, Promise<R>>
    : T[K]
}

type UserService = {
  find: Proc<Integer, User>,
  create: Proc<String, String, User>,
  delete: Proc<Integer, Boolean>
}

type AsyncUserService = Promisify<UserService>
# {
#   find: Proc<Integer, Promise<User>>,
#   create: Proc<String, String, Promise<User>>,
#   delete: Proc<Integer, Promise<Boolean>>
# }
```

## 실제 예제

### API 응답 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={267} />

```trb
type APIResponse<T> = {
  success: true,
  data: T
} | {
  success: false,
  error: String,
  code: Integer
}

# 사용법
def fetch_user(id: Integer): APIResponse<User>
  begin
    user = find_user(id)
    { success: true, data: user }
  rescue => e
    { success: false, error: e.message, code: 500 }
  end
end

# 응답 처리
response = fetch_user(1)
if response[:success]
  user = response[:data]  # 타입은 User
  puts user.name
else
  error = response[:error]  # 타입은 String
  puts "Error: #{error}"
end
```

### 폼 상태 관리

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={278} />

```trb
type FormState<T> = {
  values: T,
  errors: Partial<Record<keyof T, String>>,
  touched: Partial<Record<keyof T, Boolean>>,
  dirty: Boolean,
  valid: Boolean
}

type LoginForm = {
  username: String,
  password: String
}

type LoginFormState = FormState<LoginForm>
# {
#   values: { username: String, password: String },
#   errors: { username?: String, password?: String },
#   touched: { username?: Boolean, password?: Boolean },
#   dirty: Boolean,
#   valid: Boolean
# }
```

### 레포지토리 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={289} />

```trb
type Repository<T> = {
  find: Proc<Integer, Nullable<T>>,
  find_all: Proc<Array<T>>,
  create: Proc<Omit<T, "id">, T>,
  update: Proc<Integer, Partial<T>, Nullable<T>>,
  delete: Proc<Integer, Boolean>
}

type User = {
  id: Integer,
  name: String,
  email: String
}

# 자동으로 타입이 지정된 레포지토리
user_repository: Repository<User> = create_repository(User)

# 적절한 타입과 함께 사용
new_user = user_repository.create({ name: "Alice", email: "alice@example.com" })
updated = user_repository.update(1, { name: "Alice Smith" })
```

## 모범 사례

### 1. 유틸리티 구성

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={300} />

```trb
# 좋음: 유틸리티에서 복잡한 타입 구축
type SafeUserUpdate = Partial<Omit<Required<User>, "id" | "created_at">>

# 덜 좋음: 유틸리티가 있을 때 커스텀 매핑된 타입
type SafeUserUpdate = {
  [K in Exclude<keyof User, "id" | "created_at">]?: User[K]
}
```

### 2. 도메인별 유틸리티 생성

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={311} />

```trb
# 좋음: 도메인을 위한 커스텀 유틸리티
type Entity<T> = T & { id: Integer }
type Timestamped<T> = T & { created_at: Time, updated_at: Time }
type SoftDeletable<T> = T & { deleted_at: Nullable<Time> }

type FullEntity<T> = Entity<Timestamped<SoftDeletable<T>>>

# 사용법
type User = FullEntity<{ name: String, email: String }>
```

### 3. 복잡한 유틸리티 문서화

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/advanced/utility_types_spec.rb" line={322} />

```trb
# 좋음: 명확한 문서화
# 모든 모델에 대한 타입 안전 폼 상태 생성
# 검증 오류와 touched 상태 추적 포함
type FormState<T> = {
  values: T,
  errors: Partial<Record<keyof T, String>>,
  touched: Partial<Record<keyof T, Boolean>>,
  submitting: Boolean
}
```

## 다음 단계

이제 유틸리티 타입을 이해했으니 다음을 수행할 수 있습니다:

- [타입 별칭](/docs/learn/advanced/type-aliases)에서 도메인별 타입 생성에 적용
- [제네릭](/docs/learn/generics/generic-functions-classes)과 결합하여 유연하고 재사용 가능한 코드
- [매핑된 타입](/docs/learn/advanced/mapped-types)과 함께 사용하여 커스텀 변환 생성
- [조건부 타입](/docs/learn/advanced/conditional-types)에서 고급 타입 로직에 활용
