---
sidebar_position: 4
title: マップ型
description: プログラム的に型を変換
---

# マップ型

:::caution 準備中
この機能は将来のリリースで計画されています。
:::

マップ型を使用すると、プロパティを反復することで1つの型を別の型に変換できます。型のための「map」操作と考えてください—各プロパティに変換を適用することで、既存の型に基づいてプログラム的に新しい型を作成できます。

## マップ型の理解

マップ型は型のキーを反復し、変換を適用して新しい型を作成します：

```ruby
type MappedType<T> = {
  [K in keyof T]: Transformation<T[K]>
}
```

### 基本構文

```ruby
# Tのキーを反復
type ReadonlyType<T> = {
  readonly [K in keyof T]: T[K]
}

# すべてのプロパティをオプショナルに
type OptionalType<T> = {
  [K in keyof T]?: T[K]
}

# すべてのプロパティを必須に
type RequiredType<T> = {
  [K in keyof T]-?: T[K]
}
```

## `keyof`演算子

`keyof`演算子は型のすべてのキーをユニオンとして取得します：

```ruby
type User = {
  id: Integer,
  name: String,
  email: String
}

type UserKeys = keyof User  # "id" | "name" | "email"

# マップ型で使用
type UserValues<T> = {
  [K in keyof T]: T[K]
}
```

## 基本的なマップ型パターン

### プロパティを読み取り専用に

```ruby
# すべてのプロパティを読み取り専用に
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

# 使用法
user: ReadonlyUser = { id: 1, name: "Alice", email: "alice@example.com" }
# user.name = "Bob"  # エラー：読み取り専用プロパティに割り当てられない
```

### プロパティをオプショナルに

```ruby
# すべてのプロパティをオプショナルに
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

# 使用法 - すべてのプロパティがオプショナル
partial_user: PartialUser = { name: "Alice" }  # OK
partial_user2: PartialUser = {}  # OK
```

### プロパティを必須に

```ruby
# オプショナル修飾子を削除
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

## プロパティ変換

### プロパティの型を変換

```ruby
# すべてのプロパティを配列に変換
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

# すべてのプロパティをPromiseに変換
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>
}

# すべてのプロパティをnullableに変換
type Nullable<T> = {
  [K in keyof T]: T[K] | nil
}
```

### 修飾子の追加または削除

```ruby
# readonlyを追加
type AddReadonly<T> = {
  +readonly [K in keyof T]: T[K]
}

# readonlyを削除
type RemoveReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}

# オプショナルに
type MakeOptional<T> = {
  [K in keyof T]+?: T[K]
}

# 必須に
type MakeRequired<T> = {
  [K in keyof T]-?: T[K]
}
```

## キーのフィルタリング

### 特定のプロパティを選択

```ruby
# 指定されたキーのみを選択
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

# 使用法
public_user: PublicUser = { id: 1, name: "Alice" }
```

### 特定のプロパティを除外

```ruby
# 指定されたキーを除外
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

# 複数のプロパティを除外
type UserBasic = Omit<User, "password" | "email">
# {
#   id: Integer,
#   name: String
# }
```

## 条件付きマップ型

マップ型を条件型と組み合わせる：

```ruby
# 条件に基づいてプロパティを読み取り専用に
type ConditionalReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function ? T[K] : readonly T[K]
}

# 条件に基づいてプロパティをnullableに
type ConditionalNullable<T> = {
  [K in keyof T]: T[K] extends String ? T[K] | nil : T[K]
}

# 関数を削除
type RemoveFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}
```

## キーのリマッピング

マッピング中にプロパティキーを変換：

```ruby
# すべてのキーにプレフィックスを追加
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

# キーを大文字に変換
type Uppercased<T> = {
  [K in keyof T as Uppercase<K>]: T[K]
}

# getterを追加
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

## 実用的な例

### DTOパターン

```ruby
# データ転送オブジェクト - すべてのプロパティがオプショナルでnullableに
type DTO<T> = {
  [K in keyof T]?: T[K] | nil
}

# APIレスポンス - データをラップ
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

### フォームハンドラ

```ruby
# プロパティをフォームフィールドに変換
type FormFields<T> = {
  [K in keyof T]: {
    value: T[K],
    error: String | nil,
    touched: Bool
  }
}

# フォーム値のみ
type FormValues<T> = {
  [K in keyof T]: T[K]
}

# フォームイベントハンドラ
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

### データベースモデル

```ruby
# モデルにタイムスタンプを追加
type WithTimestamps<T> = T & {
  created_at: Time,
  updated_at: Time
}

# 更新用にモデルを部分的に
type UpdateModel<T> = Partial<Omit<T, "id" | "created_at">>

# データベースメタデータを追加
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

### イベントハンドラ

```ruby
# すべてのプロパティのイベントハンドラを作成
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<K>}Updated`]: (value: T[K]) => void
}

# すべてのプロパティのバリデータを作成
type Validators<T> = {
  [K in keyof T]: (value: T[K]) => Bool
}

# すべてのプロパティのシリアライザを作成
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

## 深いマップ型

ネストされたオブジェクトに再帰的にマッピングを適用：

```ruby
# 深い読み取り専用
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Hash<any, any>
    ? DeepReadonly<T[K]>
    : T[K]
}

# 深い部分
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Hash<any, any>
    ? DeepPartial<T[K]>
    : T[K]
}

# 深い必須
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
# すべてのネストされたプロパティが読み取り専用に
```

## マップ型の結合

複数のマッピングを結合：

```ruby
# 読み取り専用と部分
type ReadonlyPartial<T> = Readonly<Partial<T>>

# 読み取り専用と必須
type ReadonlyRequired<T> = Readonly<Required<T>>

# nullableと部分
type NullablePartial<T> = {
  [K in keyof T]?: T[K] | nil
}

# Pickと部分
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

## 型安全なビルダー

マップ型を使用して型安全なビルダーを作成：

```ruby
# すべてのプロパティが設定されることを保証するビルダー
type Builder<T> = {
  [K in keyof T as `with${Capitalize<K>}`]: (value: T[K]) => Builder<T>
} & {
  build: () => T
}

# フルーエントAPI
type FluentAPI<T> = {
  [K in keyof T]: (value: T[K]) => FluentAPI<T>
} & {
  get: () => T
}

# 使用例
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

## ベストプラクティス

### 1. 説明的な名前を使用

```ruby
# 良い：明確な目的
type ReadonlyUser = Readonly<User>
type PartialUpdate = Partial<UserUpdate>
type PublicProfile = Pick<User, "id" | "name">

# あまり良くない：一般的な名前
type UserType1 = Readonly<User>
type UserType2 = Partial<UserUpdate>
```

### 2. 再利用可能なマップ型を作成

```ruby
# 良い：再利用可能なユーティリティ
type WithTimestamps<T> = T & { created_at: Time, updated_at: Time }
type WithSoftDelete<T> = T & { deleted_at: Time | nil }
type WithMetadata<T> = T & { metadata: Hash<String, String> }

# 組み合わせる
type FullModel<T> = WithTimestamps<WithSoftDelete<WithMetadata<T>>>
```

### 3. 複雑なマッピングを文書化

```ruby
# 良い：文書化されている
# すべてのプロパティを対応するgetterメソッドに変換
# 例：{ name: String } => { getName: () => String }
type ToGetters<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: () => T[K]
}
```

### 4. 条件型と組み合わせる

```ruby
# 良い：スマートな変換
type SmartNullable<T> = {
  [K in keyof T]: T[K] extends String | Integer
    ? T[K] | nil
    : T[K]
}
```

## 一般的なパターン

### リポジトリパターン

```ruby
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

### 状態管理

```ruby
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

## 制限事項

### 新しいプロパティを追加できない

```ruby
# 元の型にないプロパティを追加できない
type Extended<T> = {
  [K in keyof T]: T[K]
  # new_property: String  # エラー：マップ型で新しいプロパティを追加できない
}

# 代わりに交差を使用
type Extended<T> = T & { new_property: String }
```

### キー型の制限

```ruby
# キーはString | Symbol | Integerでなければならない
type ValidKeys = { [K in String]: any }     # OK
type InvalidKeys = { [K in User]: any }     # エラー：Userは有効なキー型ではない
```

## 次のステップ

マップ型を理解したので、次を探索してください：

- [ユーティリティ型](/docs/learn/advanced/utility-types)はマップ型を使用して構築されている
- [条件型](/docs/learn/advanced/conditional-types)でマッピングにロジックを追加
- [型エイリアス](/docs/learn/advanced/type-aliases)でマップ型に名前を付ける
- [ジェネリクス](/docs/learn/generics/generic-functions-classes)でマップ型を再利用可能に
