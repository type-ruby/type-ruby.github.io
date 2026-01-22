---
sidebar_position: 3
title: 型演算子
description: 型演算子と修飾子
---

<DocsBadge />


# 型演算子

型演算子を使用すると、T-Rubyで型を結合、修正、変換できます。このリファレンスでは、利用可能なすべての型演算子とその使用パターンについて説明します。

## ユニオン演算子 (`|`)

ユニオン演算子は複数の型を1つに結合し、値が指定された型のいずれかになり得ることを示します。

### 構文

```ruby
Type1 | Type2 | Type3
```

### 例

```trb
# 基本的なユニオン
id: String | Integer = "user-123"
id: String | Integer = 456

# 複数の型
value: String | Integer | Float | Boolean = 3.14

# nilと一緒に（オプション型）
name: String | nil = nil
user: User | nil = find_user(123)

# コレクションで
mixed: (String | Integer)[] = ["Alice", 1, "Bob", 2]
config: Hash<Symbol, String | Integer | Boolean> = {
  host: "localhost",
  port: 3000,
  debug: true
}
```

### 使用パターン

```trb
# 関数の戻り型
def find_user(id: Integer): User | nil
  # UserまたはnilをBash
end

# 関数パラメータ
def format_id(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    "ID-#{value}"
  end
end

# エラー処理
def divide(a: Float, b: Float): Float | String
  return "Error: Division by zero" if b == 0
  a / b
end
```

### 型絞り込み

型ガードを使用してユニオン型を絞り込みます：

```trb
def process(value: String | Integer): String
  if value.is_a?(String)
    # T-RubyはここでvalueがStringであることを知っている
    value.upcase
  else
    # T-RubyはここでvalueがIntegerであることを知っている
    value.to_s
  end
end
```

## オプション演算子 (`?`)

`nil`とのユニオンの省略形です。`T?`は`T | nil`と同等です。

### 構文

```trb
Type?
# 同等: Type | nil
```

### 例

```trb
# これらは同等
name1: String | nil = nil
name2: String? = nil

# オプションパラメータ
def greet(name: String?): String
  if name
    "Hello, #{name}!"
  else
    "Hello, stranger!"
  end
end

# オプションのインスタンス変数
class User
  @email: String?
  @phone: String | nil

  def initialize: void
    @email = nil
    @phone = nil
  end
end

# コレクションで
users: User?[] = [User.new, nil, User.new]
cache: Hash<String, Integer?> = { "count" => 42, "missing" => nil }
```

### セーフナビゲーション

オプション型と一緒にセーフナビゲーション演算子（`&.`）を使用します：

```trb
def get_email_domain(user: User?): String?
  user&.email&.split("@")&.last
end
```

## インターセクション演算子 (`&`)

インターセクション演算子は複数の型を結合し、値がすべての型を同時に満たす必要があることを要求します。

### 構文

```ruby
Type1 & Type2 & Type3
```

### 例

```trb
# インターフェースのインターセクション
interface Printable
  def to_s: String
end

interface Comparable
  def <=>(other: self): Integer
end

# 型は両方のインターフェースを実装する必要がある
type Serializable = Printable & Comparable

class User
  implements Printable & Comparable

  @name: String
  @id: Integer

  def initialize(name: String, id: Integer): void
    @name = name
    @id = id
  end

  def to_s: String
    "User(#{@id}: #{@name})"
  end

  def <=>(other: User): Integer
    @id <=> other.id
  end
end

# インターセクション型を受け取る関数
def serialize(obj: Printable & Comparable): String
  obj.to_s
end
```

### 複数の制約

```trb
# 複数の制約を持つジェネリック
def sort_and_print<T>(items: T[]): void
  where T: Printable & Comparable

  sorted = items.sort
  sorted.each { |item| puts item.to_s }
end
```

## ジェネリック型パラメータ (`<T>`)

山括弧はジェネリック型パラメータを示します。

### 関数のジェネリック

```trb
# 単一の型パラメータ
def first<T>(arr: T[]): T | nil
  arr[0]
end

# 複数の型パラメータ
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# 制約付きジェネリック
def find<T>(items: T[], predicate: Proc<T, Boolean>): T | nil
  items.find { |item| predicate.call(item) }
end
```

### クラスのジェネリック

```trb
# ジェネリッククラス
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end

  def set(value: T): void
    @value = value
  end
end

# 複数の型パラメータ
class Pair<K, V>
  @key: K
  @value: V

  def initialize(key: K, value: V): void
    @key = key
    @value = value
  end

  def key: K
    @key
  end

  def value: V
    @value
  end
end
```

### ネストされたジェネリック

```trb
# ネストされたジェネリック型
cache: Hash<String, Integer[]> = {
  "fibonacci" => [1, 1, 2, 3, 5, 8]
}

# 複雑なネスト
type NestedData = Hash<String, Hash<Symbol, String | Integer>[]>

data: NestedData = {
  "users" => [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
  ]
}
```

## 配列型演算子

配列型は単一の型パラメータを持つ山括弧表記を使用します。

### 構文

```trb
Array<ElementType>
```

### 例

```trb
# 基本的な配列
strings: String[] = ["a", "b", "c"]
numbers: Integer[] = [1, 2, 3]

# ユニオン要素型
mixed: (String | Integer)[] = ["Alice", 1, "Bob", 2]

# ネストされた配列
matrix: Float[][] = [
  [1.0, 2.0],
  [3.0, 4.0]
]

# 配列を返すジェネリック関数
def range<T>(start: T, count: Integer, &block: Proc<T, T>): T[]
  result: T[] = [start]
  current = start

  (count - 1).times do
    current = block.call(current)
    result.push(current)
  end

  result
end
```

## ハッシュ型演算子

ハッシュ型は2つの型パラメータ（キーと値の型）を持つ山括弧を使用します。

### 構文

```trb
Hash<KeyType, ValueType>
```

### 例

```trb
# 基本的なハッシュ
scores: Hash<String, Integer> = { "Alice" => 100 }
config: Hash<Symbol, String> = { host: "localhost" }

# ユニオン値型
data: Hash<String, String | Integer | Boolean> = {
  "name" => "Alice",
  "age" => 30,
  "active" => true
}

# ネストされたハッシュ
users: Hash<Integer, Hash<Symbol, String>> = {
  1 => { name: "Alice", email: "alice@example.com" }
}

# ジェネリックハッシュ関数
def group_by<T, K>(items: T[], &block: Proc<T, K>): Hash<K, T[]>
  result: Hash<K, T[]> = {}

  items.each do |item|
    key = block.call(item)
    result[key] ||= []
    result[key].push(item)
  end

  result
end
```

## Proc型演算子

Proc型は型付きパラメータと戻り値を持つ呼び出し可能なオブジェクトを指定します。

### 構文

```trb {skip-verify}
Proc<Param1Type, Param2Type, ..., ReturnType>
```

### 例

```trb
# パラメータなし
supplier: Proc<String> = ->: String { "Hello" }

# 単一パラメータ
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# 複数パラメータ
adder: Proc<Integer, Integer, Integer> = ->(a: Integer, b: Integer): Integer {
  a + b
}

# Void戻り値
logger: Proc<String, void> = ->(msg: String): void { puts msg }

# ジェネリックprocパラメータ
def map<T, U>(arr: T[], fn: Proc<T, U>): U[]
  arr.map { |item| fn.call(item) }
end

# ブロックパラメータ
def each_with_index<T>(items: T[], &block: Proc<T, Integer, void>): void
  items.each_with_index { |item, index| block.call(item, index) }
end
```

## 型アサーション演算子 (`as`)

型アサーションは型チェックを上書きします。注意して使用してください。

### 構文

```ruby
value as TargetType
```

### 例

```trb
# 型アサーション
value = get_unknown_value() as String

# Anyからのキャスト
data: Any = fetch_data()
user = data as User

# ユニオン型の絞り込み
def process(value: String | Integer): String
  if is_string?(value)
    # アサーションなしではT-Rubyが絞り込めない可能性
    str = value as String
    str.upcase
  else
    value.to_s
  end
end
```

### 警告

型アサーションは型安全性をバイパスします。型ガードを優先してください：

```trb
# ❌ 危険: 型アサーションの使用
def bad_example(value: Any): String
  (value as String).upcase
end

# ✅ より良い: 型ガードの使用
def good_example(value: Any): String | nil
  if value.is_a?(String)
    value.upcase
  else
    nil
  end
end
```

## 型ガード演算子 (`is`)

型ガードは型を絞り込む述語です。*（実験的機能）*

### 構文

```trb
def function_name(param: Type): param is NarrowedType
  # 型チェックロジック
end
```

### 例

```trb
# 文字列ガード
def is_string(value: Any): value is String
  value.is_a?(String)
end

# 数値ガード
def is_number(value: Any): value is Integer | Float
  value.is_a?(Integer) || value.is_a?(Float)
end

# 使用方法
value = get_value()
if is_string(value)
  # ここでvalueはString
  puts value.upcase
end

# カスタム型ガード
def is_user(value: Any): value is User
  value.is_a?(User) && value.respond_to?(:name)
end
```

## リテラル型演算子

リテラル型は一般的な型ではなく特定の値を表します。

### 文字列リテラル

```trb
type Status = "pending" | "active" | "completed" | "failed"

status: Status = "active"  # OK
# status: Status = "unknown"  # エラー

def set_status(s: Status): void
  # 4つの特定の文字列のみを受け入れる
end
```

### 数値リテラル

```trb
type HTTPPort = 80 | 443 | 8080 | 3000

port: HTTPPort = 443  # OK
# port: HTTPPort = 9999  # エラー

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6
```

### シンボルリテラル

```trb
type Role = :admin | :editor | :viewer

role: Role = :admin  # OK
# role: Role = :guest  # エラー

type HTTPMethod = :get | :post | :put | :patch | :delete
```

### ブールリテラル

```trb
type AlwaysTrue = true
type AlwaysFalse = false

flag: AlwaysTrue = true
# flag: AlwaysTrue = false  # エラー
```

## タプル型 *（計画中）*

位置ごとに特定の型を持つ固定長配列です。

```trb
# タプル型（計画中）
type Point = [Float, Float]
type RGB = [Integer, Integer, Integer]

point: Point = [10.5, 20.3]
color: RGB = [255, 0, 128]

# ラベル付きタプル（計画中）
type Person = [name: String, age: Integer]
person: Person = ["Alice", 30]
```

## Readonly修飾子 *（計画中）*

型を不変にします。

```trb
# Readonly型（計画中）
type ReadonlyArray<T> = readonly T[]
type ReadonlyHash<K, V> = readonly Hash<K, V>

# 変更不可
nums: ReadonlyArray<Integer> = [1, 2, 3]
# nums.push(4)  # エラー: readonly配列は変更できない
```

## Keyof演算子 *（計画中）*

オブジェクト型からキーを抽出します。

```trb
# Keyof演算子（計画中）
interface User
  @name: String
  @email: String
  @age: Integer
end

type UserKey = keyof User  # :name | :email | :age
```

## Typeof演算子 *（計画中）*

値の型を取得します。

```trb
# Typeof演算子（計画中）
config = { host: "localhost", port: 3000 }
type Config = typeof config
# Config = Hash<Symbol, String | Integer>
```

## 演算子の優先順位

演算子を組み合わせる場合、T-Rubyは以下の優先順位に従います（高いものから低いものへ）：

1. ジェネリックパラメータ: `<T>`
2. Array/Hash/Proc: `Array<T>`, `Hash<K,V>`, `Proc<T,R>`
3. インターセクション: `&`
4. ユニオン: `|`
5. オプション: `?`

### 例

```trb
# インターセクションはユニオンより優先順位が高い
type A = String | Integer & Float
# 同等: String | (Integer & Float)

# 明確にするために括弧を使用
type B = (String | Integer) & Comparable

# オプションは左側の型全体に適用
type C = String | Integer?
# 同等: String | (Integer | nil)

# Integerのみをオプションにするには括弧を使用
type D = String | (Integer?)
```

## 演算子リファレンステーブル

| 演算子 | 名前 | 説明 | 例 |
|--------|------|------|-----|
| `\|` | ユニオン | いずれかの型 | `String \| Integer` |
| `&` | インターセクション | 両方の型 | `Printable & Comparable` |
| `?` | オプション | 型またはnil | `String?` |
| `<T>` | ジェネリック | 型パラメータ | `Array<T>` |
| `as` | 型アサーション | 型を強制 | `value as String` |
| `is` | 型ガード | 型述語 | `value is String` |
| `[]` | タプル | 固定配列 | `[String, Integer]`（計画中） |
| `readonly` | Readonly | 不変 | `readonly Array<T>`（計画中） |
| `keyof` | キー抽出 | オブジェクトのキー | `keyof User`（計画中） |
| `typeof` | 型クエリ | 型を取得 | `typeof value`（計画中） |

## ベストプラクティス

### 1. Anyよりユニオンを優先

```trb
# ❌ 過度に寛容
data: Any = get_data()

# ✅ 特定の型
data: String | Integer | Hash<String, String> = get_data()
```

### 2. 明確性のためにオプション演算子を使用

```trb
# ❌ 冗長
name: String | nil = nil

# ✅ 簡潔
name: String? = nil
```

### 3. ユニオンの複雑さを制限

```trb
# ❌ オプションが多すぎる
value: String | Integer | Float | Boolean | Symbol | nil | String[]

# ✅ 型エイリアスを使用
type PrimitiveValue = String | Integer | Float | Boolean
type OptionalPrimitive = PrimitiveValue?
```

### 4. 複数のインターフェースにインターセクションを使用

```trb
# ✅ 明確な要件
def process<T>(item: T): void
  where T: Serializable & Comparable
  # itemは両方を実装する必要がある
end
```

### 5. 過度な型アサーションを避ける

```trb
# ❌ 型安全性をバイパス
def risky(data: Any): String
  (data as Hash<String, String>)["key"] as String
end

# ✅ 型ガードを使用
def safe(data: Any): String?
  return nil unless data.is_a?(Hash)
  value = data["key"]
  value.is_a?(String) ? value : nil
end
```

## 一般的なパターン

### ユニオンを使用したResult型

```trb
type Result<T, E> = { success: true, value: T } | { success: false, error: E }

def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, error: "Division by zero" }
  else
    { success: true, value: a / b }
  end
end
```

### オプショナルチェーン

```trb
class User
  @profile: Profile?

  def avatar_url: String?
    @profile&.avatar&.url
  end
end
```

### ガードを使用した型絞り込み

```trb
def process_value(value: String | Integer | nil): String
  if value.nil?
    "No value"
  elsif value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end
```

## 次のステップ

- [組み込み型](/docs/reference/built-in-types) - 完全な型リファレンス
- [型エイリアス](/docs/learn/advanced/type-aliases) - カスタム型の作成
- [ジェネリック](/docs/learn/generics/generic-functions-classes) - ジェネリックプログラミング
- [ユニオン型](/docs/learn/everyday-types/union-types) - 詳細なユニオン型ガイド
