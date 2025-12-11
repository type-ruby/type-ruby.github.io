---
sidebar_position: 5
title: ユーティリティ型
description: 一般的な変換のための組み込みユーティリティ型
---

# ユーティリティ型

:::caution 準備中
この機能は将来のリリースで計画されています。
:::

ユーティリティ型は、一般的な型変換を実行する事前に構築されたジェネリック型です。型のための標準ライブラリのようなもので、日常的な型操作タスクのためのすぐに使えるソリューションを提供します。これらのユーティリティを理解すると、T-Rubyコードがより簡潔で表現力豊かになります。

## プロパティ修飾子

### Partial\<T\>

型のすべてのプロパティをオプショナルにします：

```ruby
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

# 使用法 - update関数はよくPartialを使用
def update_user(id: Integer, updates: Partial<User>): User
  user = find_user(id)
  # 提供された更新のみを適用
  user.name = updates[:name] if updates[:name]
  user.email = updates[:email] if updates[:email]
  user.age = updates[:age] if updates[:age]
  user
end

# プロパティの任意のサブセットを提供可能
update_user(1, { name: "Alice" })
update_user(1, { name: "Bob", email: "bob@example.com" })
update_user(1, {})  # 有効、更新なし
```

### Required\<T\>

すべてのプロパティを必須にします（オプショナル性を削除）：

```ruby
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

# 使用法 - すべてのフィールドが存在することを確認
def create_user(data: Required<UserUpdate>): User
  # すべてのフィールドが存在することを保証
  User.new(data[:id], data[:name], data[:email])
end
```

### Readonly\<T\>

すべてのプロパティを読み取り専用にします：

```ruby
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type User = {
  id: Integer,
  name: String,
  email: String
}

type ReadonlyUser = Readonly<User>

# 使用法 - 変更を防止
def display_user(user: ReadonlyUser): void
  puts "User: #{user.name}"
  # user.name = "Changed"  # エラー：読み取り専用プロパティを変更できない
end

# 一般的なパターン：設定を固定
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

## プロパティ選択

### Pick\<T, K\>

別の型から特定のプロパティを選んで型を作成：

```ruby
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

# 公開フィールドのみを選択
type PublicUser = Pick<User, "id" | "name" | "email">
# {
#   id: Integer,
#   name: String,
#   email: String
# }

# 認証フィールドを選択
type AuthUser = Pick<User, "id" | "email" | "password">
# {
#   id: Integer,
#   email: String,
#   password: String
# }

# 使用法
def get_public_user(user: User): PublicUser
  {
    id: user.id,
    name: user.name,
    email: user.email
  }
end
```

### Omit\<T, K\>

別の型から特定のプロパティを除外して型を作成：

```ruby
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

# 機密データを除外
type SafeUser = Omit<User, "password">
# {
#   id: Integer,
#   name: String,
#   email: String,
#   created_at: Time,
#   updated_at: Time
# }

# 作成用に生成フィールドを除外
type UserInput = Omit<User, "id" | "created_at" | "updated_at">
# {
#   name: String,
#   email: String,
#   password: String
# }

# 使用法
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

## ユニオンと交差演算

### Exclude\<T, U\>

ユニオンから型を除外：

```ruby
type Exclude<T, U> = T extends U ? never : T

type AllTypes = String | Integer | Float | Bool
type NumericOnly = Exclude<AllTypes, String | Bool>
# Integer | Float

type Status = "pending" | "approved" | "rejected" | "cancelled"
type ActiveStatus = Exclude<Status, "cancelled">
# "pending" | "approved" | "rejected"

# 使用法
def process_active_order(status: ActiveStatus): void
  case status
  when "pending"
    puts "Processing pending order"
  when "approved"
    puts "Shipping approved order"
  when "rejected"
    puts "Handling rejected order"
  # "cancelled"はここでは不可能
  end
end
```

### Extract\<T, U\>

ユニオンから型を抽出：

```ruby
type Extract<T, U> = T extends U ? T : never

type AllTypes = String | Integer | Float | Bool
type NumericOnly = Extract<AllTypes, Integer | Float>
# Integer | Float

type Status = "pending" | "approved" | "rejected" | "cancelled"
type FinalStatus = Extract<Status, "approved" | "rejected" | "cancelled">
# "approved" | "rejected" | "cancelled"

# 使用法
def finalize_order(status: FinalStatus): void
  # 最終ステータスのみ許可
  puts "Order is in final state: #{status}"
end
```

### NonNullable\<T\>

型から`nil`を削除：

```ruby
type NonNullable<T> = T extends nil ? never : T

type MaybeString = String | nil
type DefiniteString = NonNullable<MaybeString>
# String

type MixedTypes = String | Integer | nil | Float | nil
type WithoutNil = NonNullable<MixedTypes>
# String | Integer | Float

# 使用法
def process_value<T>(value: T | nil): NonNullable<T>
  raise "Value cannot be nil" if value.nil?
  value  # 型がTにナローイング（nilなし）
end
```

## 関数型

### ReturnType\<T\>

関数型の戻り値の型を抽出：

```ruby
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

type GetUserFn = Proc<Integer, User>
type UserType = ReturnType<GetUserFn>
# User

type CalculateFn = Proc<Integer, Integer, Float>
type ResultType = ReturnType<CalculateFn>
# Float

# 使用法 - 関数から戻り値の型を推論
def wrap_function<F>(fn: F): Proc<any, ReturnType<F>>
  ->(args: any): ReturnType<F> {
    result = fn.call(args)
    puts "Function returned: #{result}"
    result
  }
end
```

### Parameters\<T\>

関数型からパラメータ型を抽出：

```ruby
type Parameters<T> = T extends Proc<infer P, any> ? P : never

type GetUserFn = Proc<Integer, User>
type GetUserParams = Parameters<GetUserFn>
# Integer

type CreateUserFn = Proc<String, String, Integer, User>
type CreateUserParams = Parameters<CreateUserFn>
# [String, String, Integer]

# 使用法
def call_with_logging<F>(fn: F, ...args: Parameters<F>): ReturnType<F>
  puts "Calling function with args: #{args}"
  result = fn.call(*args)
  puts "Function returned: #{result}"
  result
end
```

## レコード型

### Record\<K, V\>

キー型がKで値型がVの型を作成：

```ruby
type Record<K extends String | Symbol | Integer, V> = {
  [P in K]: V
}

# 文字列キー、整数値
type StringToInt = Record<String, Integer>
# { [key: String]: Integer }

# 特定の文字列リテラルキー
type StatusMap = Record<"pending" | "approved" | "rejected", Bool>
# {
#   pending: Bool,
#   approved: Bool,
#   rejected: Bool
# }

# 使用例
status_flags: StatusMap = {
  pending: true,
  approved: false,
  rejected: false
}

# ユーザーIDからUserへのマッピング
user_cache: Record<Integer, User> = {
  1 => User.new(1, "Alice"),
  2 => User.new(2, "Bob")
}

# 環境ごとの設定
configs: Record<"development" | "staging" | "production", Config> = {
  development: dev_config,
  staging: staging_config,
  production: prod_config
}
```

## 配列とタプルユーティリティ

### ArrayElement\<T\>

配列から要素型を抽出：

```ruby
type ArrayElement<T> = T extends Array<infer E> ? E : never

type StringArray = Array<String>
type StringElement = ArrayElement<StringArray>
# String

type UserArray = Array<User>
type UserElement = ArrayElement<UserArray>
# User

# 使用法
def first_element<T>(arr: Array<T>): ArrayElement<Array<T>> | nil
  arr.first
end
```

### ReadonlyArray\<T\>

要素を変更できない配列：

```ruby
type ReadonlyArray<T> = readonly Array<T>

# 使用法
def process_items(items: ReadonlyArray<String>): void
  items.each { |item| puts item }
  # items.push("new")  # エラー：読み取り専用配列を変更できない
  # items[0] = "changed"  # エラー：読み取り専用配列を変更できない
end

# 定数に便利
ALLOWED_STATUSES: ReadonlyArray<String> = ["pending", "approved", "rejected"]
```

## 実用的なユーティリティ型

### DeepPartial\<T\>

すべてのプロパティとネストされたプロパティをオプショナルに：

```ruby
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
      notifications: Bool
    }
  }
}

type DeepPartialUser = DeepPartial<User>
# すべてのレベルのすべてのプロパティがオプショナル

# 使用法 - 深い更新
def deep_update_user(id: Integer, updates: DeepPartial<User>): User
  user = find_user(id)
  # 任意のネストされたプロパティを更新可能
  user.profile.name = updates[:profile][:name] if updates[:profile]&.[](:name)
  user.profile.settings.theme = updates[:profile][:settings][:theme] if updates[:profile][:settings]&.[](:theme)
  user
end
```

### DeepReadonly\<T\>

すべてのプロパティとネストされたプロパティを読み取り専用に：

```ruby
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
      auth: Bool,
      api: Bool
    }
  }
}

type ImmutableConfig = DeepReadonly<Config>
# すべてのネストされたプロパティが読み取り専用

config: ImmutableConfig = load_config()
# config.app.name = "New"  # エラー：読み取り専用
# config.app.features.auth = false  # エラー：読み取り専用
```

### Mutable\<T\>

読み取り専用修飾子を削除：

```ruby
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

# 使用法 - 変更可能なコピーを作成
def clone_user(user: ReadonlyUser): MutableUser
  {
    id: user.id,
    name: user.name
  }
end
```

## 合成ユーティリティ

### Merge\<T, U\>

2つの型をマージし、UのプロパティがTのプロパティを上書き：

```ruby
type Merge<T, U> = Omit<T, keyof U> & U

type User = {
  id: Integer,
  name: String,
  email: String
}

type UserUpdate = {
  email: String | nil,  # nullを許可
  updated_at: Time      # 新しいプロパティ
}

type MergedUser = Merge<User, UserUpdate>
# {
#   id: Integer,
#   name: String,
#   email: String | nil,    # 上書きされた
#   updated_at: Time        # 追加された
# }
```

### Intersection\<T, U\>

両方の型に存在するプロパティを取得：

```ruby
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

Tにあるがにないプロパティを取得：

```ruby
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

## 条件付きユーティリティ

### If\<Condition, Then, Else\>

型レベルのif-else：

```ruby
type If<Condition extends Bool, Then, Else> =
  Condition extends true ? Then : Else

# 使用法
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

型をnullableに：

```ruby
type Nullable<T> = T | nil

type User = { id: Integer, name: String }
type MaybeUser = Nullable<User>
# User | nil

# 関数で使用
def find_user(id: Integer): Nullable<User>
  # 見つからない場合はnilを返す可能性
end
```

### Promisify\<T\>

戻り値の型をPromiseでラップ（非同期操作用）：

```ruby
type Promisify<T> = {
  [K in keyof T]: T[K] extends Proc<infer Args, infer R>
    ? Proc<Args, Promise<R>>
    : T[K]
}

type UserService = {
  find: Proc<Integer, User>,
  create: Proc<String, String, User>,
  delete: Proc<Integer, Bool>
}

type AsyncUserService = Promisify<UserService>
# {
#   find: Proc<Integer, Promise<User>>,
#   create: Proc<String, String, Promise<User>>,
#   delete: Proc<Integer, Promise<Bool>>
# }
```

## 実世界の例

### APIレスポンス型

```ruby
type APIResponse<T> = {
  success: true,
  data: T
} | {
  success: false,
  error: String,
  code: Integer
}

# 使用法
def fetch_user(id: Integer): APIResponse<User>
  begin
    user = find_user(id)
    { success: true, data: user }
  rescue => e
    { success: false, error: e.message, code: 500 }
  end
end

# レスポンスを処理
response = fetch_user(1)
if response[:success]
  user = response[:data]  # 型はUser
  puts user.name
else
  error = response[:error]  # 型はString
  puts "Error: #{error}"
end
```

### フォーム状態管理

```ruby
type FormState<T> = {
  values: T,
  errors: Partial<Record<keyof T, String>>,
  touched: Partial<Record<keyof T, Bool>>,
  dirty: Bool,
  valid: Bool
}

type LoginForm = {
  username: String,
  password: String
}

type LoginFormState = FormState<LoginForm>
# {
#   values: { username: String, password: String },
#   errors: { username?: String, password?: String },
#   touched: { username?: Bool, password?: Bool },
#   dirty: Bool,
#   valid: Bool
# }
```

### リポジトリパターン

```ruby
type Repository<T> = {
  find: Proc<Integer, Nullable<T>>,
  find_all: Proc<Array<T>>,
  create: Proc<Omit<T, "id">, T>,
  update: Proc<Integer, Partial<T>, Nullable<T>>,
  delete: Proc<Integer, Bool>
}

type User = {
  id: Integer,
  name: String,
  email: String
}

# 自動的に型付けされたリポジトリ
user_repository: Repository<User> = create_repository(User)

# 適切な型での使用
new_user = user_repository.create({ name: "Alice", email: "alice@example.com" })
updated = user_repository.update(1, { name: "Alice Smith" })
```

## ベストプラクティス

### 1. ユーティリティを構成

```ruby
# 良い：ユーティリティから複雑な型を構築
type SafeUserUpdate = Partial<Omit<Required<User>, "id" | "created_at">>

# あまり良くない：ユーティリティがあるときにカスタムマップ型
type SafeUserUpdate = {
  [K in Exclude<keyof User, "id" | "created_at">]?: User[K]
}
```

### 2. ドメイン固有のユーティリティを作成

```ruby
# 良い：ドメイン用のカスタムユーティリティ
type Entity<T> = T & { id: Integer }
type Timestamped<T> = T & { created_at: Time, updated_at: Time }
type SoftDeletable<T> = T & { deleted_at: Nullable<Time> }

type FullEntity<T> = Entity<Timestamped<SoftDeletable<T>>>

# 使用法
type User = FullEntity<{ name: String, email: String }>
```

### 3. 複雑なユーティリティを文書化

```ruby
# 良い：明確な文書化
# 任意のモデルのための型安全なフォーム状態を作成
# 検証エラーとtouched状態の追跡を含む
type FormState<T> = {
  values: T,
  errors: Partial<Record<keyof T, String>>,
  touched: Partial<Record<keyof T, Bool>>,
  submitting: Bool
}
```

## 次のステップ

ユーティリティ型を理解したので、次のことができます：

- [型エイリアス](/docs/learn/advanced/type-aliases)でドメイン固有の型を作成に適用
- [ジェネリクス](/docs/learn/generics/generic-functions-classes)と組み合わせて柔軟で再利用可能なコード
- [マップ型](/docs/learn/advanced/mapped-types)と一緒に使用してカスタム変換を作成
- [条件型](/docs/learn/advanced/conditional-types)で高度な型ロジックに活用
