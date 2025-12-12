---
sidebar_position: 3
title: 条件型
description: 条件に依存する型
---

<DocsBadge />


# 条件型

:::caution 準備中
この機能は将来のリリースで計画されています。
:::

条件型を使用すると、条件に基づいて変化する型を作成できます。型レベルの「if-else」文と考えてください—結果の型は条件が真か偽かによって変わります。

## 条件型の理解

条件型は、型関係に基づいて2つの型のいずれかを選択する三項演算子のような構文を使用します：

```trb
type Result = Condition ? TrueType : FalseType
```

`Condition`が真なら、結果は`TrueType`です。そうでなければ`FalseType`です。

### 基本構文

```trb
# 条件型の構文
type TypeName<T> = T extends SomeType ? TypeIfTrue : TypeIfFalse

# 例：Tが文字列かどうかを確認
type IsString<T> = T extends String ? true : false

# 使用法
type Test1 = IsString<String>   # true
type Test2 = IsString<Integer>  # false
```

## Extendsキーワード

条件型の`extends`キーワードは、型が別の型に割り当て可能かどうかをチェックします：

```trb
# T extends Uは「TをUに割り当てられるか？」を意味する

type IsArray<T> = T extends Array<any> ? true : false

type Test1 = IsArray<Array<Integer>>  # true
type Test2 = IsArray<String>          # false
type Test3 = IsArray<Hash<String, Integer>>  # false
```

### 特定の型のチェック

```trb
# 型が数値かどうかを確認
type IsNumeric<T> = T extends Integer | Float ? true : false

# 型がnilかどうかを確認
type IsNil<T> = T extends nil ? true : false

# 型が関数かどうかを確認
type IsFunction<T> = T extends Proc<any, any> ? true : false

# 使用例
type NumTest = IsNumeric<Integer>  # true
type NilTest = IsNil<nil>          # true
type FnTest = IsFunction<Proc<String, Integer>>  # true
```

## 条件型パターン

### nil以外の型を抽出

```trb
# ユニオン型からnilを削除
type NonNil<T> = T extends nil ? never : T

# 使用法
type MaybeString = String | nil
type JustString = NonNil<MaybeString>  # String

type MixedTypes = String | Integer | nil | Float
type WithoutNil = NonNil<MixedTypes>  # String | Integer | Float
```

### 関数の戻り値の型を抽出

```trb
# 関数の戻り値の型を取得
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

# 使用法
type AddFunction = Proc<Integer, Integer, Integer>
type AddReturnType = ReturnType<AddFunction>  # Integer

type GetUserFunction = Proc<Integer, User>
type UserReturnType = ReturnType<GetUserFunction>  # User
```

### 配列の要素型を抽出

```trb
# 配列の要素型を取得
type ElementType<T> = T extends Array<infer E> ? E : never

# 使用法
type StringArray = Array<String>
type StringElement = ElementType<StringArray>  # String

type NumberArray = Array<Integer>
type NumberElement = ElementType<NumberArray>  # Integer
```

## `infer`キーワード

`infer`キーワードを使用すると、条件型内で型をキャプチャして名前を付けることができます：

```trb
# 関数のパラメータ型を推論
type ParamType<T> = T extends Proc<infer P, any> ? P : never

# ハッシュのキー型を推論
type KeyType<T> = T extends Hash<infer K, any> ? K : never

# ハッシュの値型を推論
type ValueError<T> = T extends Hash<any, infer V> ? V : never

# 使用法
type MyFunction = Proc<String, Integer>
type Param = ParamType<MyFunction>  # String

type MyHash = Hash<Symbol, User>
type Key = KeyType<MyHash>    # Symbol
type Value = ValueError<MyHash>  # User
```

### 複数のinferの使用

```trb
# ペアの両方の部分を抽出
type Unpair<T> = T extends Hash<Symbol, { first: infer F, second: infer S }>
  ? [F, S]
  : never

# 関数シグネチャの部分を抽出
type FunctionParts<T> =
  T extends Proc<infer P, infer R>
    ? { params: P, return: R }
    : never
```

## 実用的な例

### 型のアンラップ

ラッパー型を削除して内部の型を取得します：

```trb
# 配列のアンラップ
type Unwrap<T> = T extends Array<infer U> ? U : T

# 使用法
type Wrapped1 = Unwrap<Array<String>>  # String
type Wrapped2 = Unwrap<String>         # String（変更なし）

# ネストした配列のアンラップ
type DeepUnwrap<T> =
  T extends Array<infer U>
    ? DeepUnwrap<U>
    : T

type NestedArray = Array<Array<Array<Integer>>>
type Unwrapped = DeepUnwrap<NestedArray>  # Integer
```

### ユニオン型のフラット化

```trb
# ネストしたユニオンのフラット化
type Flatten<T> =
  T extends Array<infer U>
    ? Flatten<U>
    : T extends Hash<any, infer V>
      ? Flatten<V>
      : T

# ユニオンから重複を削除（可能な場合）
type Unique<T, U = T> =
  T extends U
    ? [U] extends [T]
      ? T
      : Unique<T, Exclude<U, T>>
    : never
```

### Promiseのような型

```trb
# Promiseのような型をアンラップ
type Awaited<T> =
  T extends Promise<infer U>
    ? Awaited<U>
    : T

# 非同期戻り型のシミュレーション
type AsyncReturnType<T> =
  T extends Proc<any, infer R>
    ? Awaited<R>
    : never
```

## 分配条件型

条件型がユニオン型に作用するとき、ユニオンに対して分配されます：

```trb
# この条件型は分配的
type ToArray<T> = T extends any ? Array<T> : never

# ユニオンに適用されると分配される：
type StringOrNumber = String | Integer
type Result = ToArray<StringOrNumber>
# 結果：Array<String> | Array<Integer>
# ではない：Array<String | Integer>

# 別の例
type BoxedType<T> = T extends any ? { value: T } : never

type Mixed = String | Integer | Bool
type Boxed = BoxedType<Mixed>
# 結果：{ value: String } | { value: Integer } | { value: Bool }
```

### 分配の防止

分配を防ぐには、型をタプルでラップします：

```trb
# 非分配バージョン
type ToArrayNonDist<T> = [T] extends [any] ? Array<T> : never

type StringOrNumber = String | Integer
type Result = ToArrayNonDist<StringOrNumber>
# 結果：Array<String | Integer>
```

## 高度なパターン

### 型ナローイング

```trb {skip-verify}
# プロパティに基づいた型のナローイング
type NarrowByProperty<T, K extends keyof T, V> =
  T extends { K: V } ? T : never

# プロパティに基づいたユニオンからの型フィルタリング
type FilterByProperty<T, K, V> =
  T extends infer U
    ? U extends { K: V }
      ? U
      : never
    : never
```

### 再帰条件型

```trb
# 深い読み取り専用型
type DeepReadonly<T> =
  T extends (Array<infer U> | Hash<any, infer U>)
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends Hash<infer K, infer V>
      ? ReadonlyHash<K, DeepReadonly<V>>
      : T

# 深い部分型
type DeepPartial<T> =
  T extends Hash<infer K, infer V>
    ? Hash<K, DeepPartial<V> | nil>
    : T extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T
```

### 型ガード関数

```trb
# 型述語を作成
def is_string<T>(value: T): value is String
  value.is_a?(String)
end

def is_array<T>(value: T): value is Array<any>
  value.is_a?(Array)
end

# 条件型と一緒に使用
type TypeGuardReturn<T, G> =
  G extends true ? T : never
```

## ジェネリクスとの条件型

条件型をジェネリック制約と組み合わせます：

```trb
# 特定の型のみを許可
type Addable<T> =
  T extends Integer | Float | String
    ? T
    : never

def add<T extends Addable<T>>(a: T, b: T): T
  a + b
end

# 条件付きで型を変換
type Transform<T> =
  T extends String ? Integer :
  T extends Integer ? Float :
  T extends Float ? String :
  T

# 使用法
def transform<T>(value: T): Transform<T>
  case value
  when String
    value.length  # Integerを返す
  when Integer
    value.to_f    # Floatを返す
  when Float
    value.to_s    # Stringを返す
  else
    value
  end
end
```

## 実用的なユースケース

### APIレスポンス型

```trb
# 成功ステータスに基づいて条件付きでエラーフィールドを追加
type APIResponse<T, Success extends Bool> =
  Success extends true
    ? { success: true, data: T }
    : { success: false, error: String }

# 使用法
type SuccessResponse = APIResponse<User, true>
# { success: true, data: User }

type ErrorResponse = APIResponse<User, false>
# { success: false, error: String }
```

### スマートデフォルト

```trb
# 条件付きでデフォルト型を提供
type WithDefault<T, D> = T extends nil ? D : T

# 使用法
type MaybeString = String | nil
type StringWithDefault = WithDefault<MaybeString, String>  # String

type DefiniteValue = Integer
type IntegerWithDefault = WithDefault<DefiniteValue, Float>  # Integer
```

### コレクション要素アクセス

```trb
# コレクション型に基づいた型の取得
type CollectionElement<T> =
  T extends Array<infer E> ? E :
  T extends Hash<any, infer V> ? V :
  T extends Set<infer S> ? S :
  never

# 使用法
type ArrayElement = CollectionElement<Array<String>>  # String
type HashValue = CollectionElement<Hash<Symbol, Integer>>  # Integer
type SetElement = CollectionElement<Set<User>>  # User
```

### 関数合成

```trb
# 関数型の合成
type Compose<F, G> =
  F extends Proc<infer A, infer B>
    ? G extends Proc<B, infer C>
      ? Proc<A, C>
      : never
    : never

# 使用法
type F = Proc<String, Integer>  # String -> Integer
type G = Proc<Integer, Bool>    # Integer -> Bool
type Composed = Compose<F, G>   # String -> Bool
```

## ベストプラクティス

### 1. 条件をシンプルに保つ

```trb
# 良い：シンプルで明確な条件
type IsString<T> = T extends String ? true : false

# あまり良くない：複雑なネストされた条件
type ComplexCheck<T> =
  T extends String
    ? T extends "hello"
      ? true
      : T extends "world"
        ? true
        : false
    : false
```

### 2. 説明的な名前を使用

```trb
# 良い：明確な名前
type NonNilable<T> = T extends nil ? never : T
type Unwrap<T> = T extends Array<infer U> ? U : T

# あまり良くない：暗号的な名前
type NN<T> = T extends nil ? never : T
type UW<T> = T extends Array<infer U> ? U : T
```

### 3. 複雑な型を文書化

```trb
# 良い：文書化された条件型
# 関数型の戻り値の型を抽出
# @example ReturnType<Proc<String, Integer>> => Integer
type ReturnType<T> = T extends Proc<any, infer R> ? R : never

# すべてのプロパティを再帰的にオプショナルにする
# @example DeepPartial<User> => すべてのUserプロパティがT | nilになる
type DeepPartial<T> =
  T extends Hash<infer K, infer V>
    ? Hash<K, DeepPartial<V> | nil>
    : T
```

### 4. 深いネストを避ける

```trb
# 良い：フラットで管理可能な構造
type FirstType<T> = T extends [infer F, ...any] ? F : never
type RestTypes<T> = T extends [any, ...infer R] ? R : never

# あまり良くない：深くネストされている
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

## 制限事項

### 再帰の深さ

```trb
# 非常に深い再帰は限界に達する可能性がある
type DeepNested<T, N> =
  N extends 0
    ? T
    : Array<DeepNested<T, Decrement<N>>>  # 深さ制限に達する可能性
```

### 型推論の複雑さ

```trb
# 複雑な推論は常に期待通りに動作しない可能性がある
type ComplexInfer<T> =
  T extends {
    a: infer A,
    b: infer B,
    c: (x: infer C) => infer D
  } ? [A, B, C, D] : never
```

## 次のステップ

条件型を理解したので、次を探索してください：

- [マップ型](/docs/learn/advanced/mapped-types)で型のプロパティを変換
- [ユーティリティ型](/docs/learn/advanced/utility-types)は内部的に条件型を使用
- [型推論](/docs/learn/basics/type-inference)でT-Rubyが型を推論する方法を理解
- [制約付きジェネリクス](/docs/learn/generics/constraints)で制御された型パラメータ
