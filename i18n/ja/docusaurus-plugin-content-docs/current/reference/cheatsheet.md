---
sidebar_position: 1
title: 型構文チートシート
description: T-Ruby型構文クイックリファレンス
---

# 型構文チートシート

T-Ruby型構文の包括的なクイックリファレンスガイドです。すべての型アノテーションと構文パターンに簡単にアクセスできるよう、このページをブックマークしてください。

## 基本型

| 型 | 説明 | 例 |
|----|------|-----|
| `String` | テキストデータ | `name: String = "Alice"` |
| `Integer` | 整数 | `count: Integer = 42` |
| `Float` | 小数 | `price: Float = 19.99` |
| `Bool` | ブール値 | `active: Bool = true` |
| `Symbol` | 不変識別子 | `status: Symbol = :active` |
| `nil` | 値の不在 | `value: nil = nil` |
| `Any` | 任意の型（可能なら避ける） | `data: Any = "anything"` |
| `void` | 戻り値なし | `def log(msg: String): void` |

## 変数アノテーション

```ruby
# 型アノテーション付きの変数
name: String = "Alice"
age: Integer = 30
price: Float = 99.99

# 複数の変数
x: Integer = 1
y: Integer = 2
z: Integer = 3

# 型推論（型アノテーションはオプション）
message = "Hello"  # Stringと推論
```

## 関数シグネチャ

```ruby
# 基本的な関数
def greet(name: String): String
  "Hello, #{name}!"
end

# 複数のパラメータ
def add(a: Integer, b: Integer): Integer
  a + b
end

# オプションパラメータ
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

# 残余パラメータ
def sum(*numbers: Integer): Integer
  numbers.sum
end

# キーワード引数
def create_user(name: String, email: String, age: Integer = 18): Hash
  { name: name, email: email, age: age }
end

# 戻り値なし
def log(message: String): void
  puts message
end
```

## ユニオン型

| 構文 | 説明 | 例 |
|------|------|-----|
| `A \| B` | 型AまたはB | `String \| Integer` |
| `A \| B \| C` | 複数の型のいずれか | `String \| Integer \| Bool` |
| `T \| nil` | オプション型 | `String \| nil` |
| `T?` | `T \| nil`の省略形 | `String?` |

```ruby
# ユニオン型
id: String | Integer = "user-123"
id: String | Integer = 456

# オプション値
name: String | nil = nil
name: String? = nil  # 省略形

# 複数の型
value: String | Integer | Bool = true

# ユニオン戻り型を持つ関数
def find_user(id: Integer): User | nil
  # UserまたはnilをBash
end
```

## 配列型

```ruby
# 特定の型の配列
names: Array<String> = ["Alice", "Bob"]
numbers: Array<Integer> = [1, 2, 3]

# ユニオン型の配列
mixed: Array<String | Integer> = ["Alice", 1, "Bob", 2]

# ネストされた配列
matrix: Array<Array<Integer>> = [[1, 2], [3, 4]]

# 型付きの空配列
items: Array<String> = []
```

## ハッシュ型

```ruby
# 特定のキーと値の型を持つハッシュ
scores: Hash<String, Integer> = { "Alice" => 100, "Bob" => 95 }

# シンボルキー
config: Hash<Symbol, String> = { host: "localhost", port: "3000" }

# ユニオン値型
data: Hash<String, String | Integer> = { "name" => "Alice", "age" => 30 }

# ネストされたハッシュ
users: Hash<Integer, Hash<Symbol, String>> = {
  1 => { name: "Alice", email: "alice@example.com" }
}
```

## ジェネリック型

```ruby
# ジェネリック関数
def first<T>(arr: Array<T>): T | nil
  arr[0]
end

# 複数の型パラメータ
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# ジェネリッククラス
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end
end

# ジェネリックの使用
box = Box<String>.new("hello")
result = first([1, 2, 3])  # 型推論
```

## 型エイリアス

```ruby
# シンプルなエイリアス
type UserId = Integer
type EmailAddress = String

# ユニオン型エイリアス
type ID = String | Integer
type JSONValue = String | Integer | Float | Bool | nil

# コレクションエイリアス
type StringList = Array<String>
type UserMap = Hash<Integer, User>

# ジェネリックエイリアス
type Result<T> = T | nil
type Callback<T> = Proc<T, void>

# エイリアスの使用
user_id: UserId = 123
email: EmailAddress = "alice@example.com"
```

## クラスアノテーション

```ruby
# インスタンス変数
class User
  @name: String
  @age: Integer
  @email: String | nil

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
    @email = nil
  end

  def name: String
    @name
  end

  def age: Integer
    @age
  end
end

# クラス変数
class Counter
  @@count: Integer = 0

  def self.increment: void
    @@count += 1
  end

  def self.count: Integer
    @@count
  end
end

# ジェネリッククラス
class Container<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def value: T
    @value
  end
end
```

## インターフェース定義

```ruby
# 基本的なインターフェース
interface Printable
  def to_s: String
end

# 複数のメソッドを持つインターフェース
interface Comparable
  def <=>(other: self): Integer
  def ==(other: self): Bool
end

# ジェネリックインターフェース
interface Collection<T>
  def add(item: T): void
  def remove(item: T): Bool
  def size: Integer
end

# インターフェースの実装
class User
  implements Printable

  @name: String

  def initialize(name: String): void
    @name = name
  end

  def to_s: String
    "User: #{@name}"
  end
end
```

## 型演算子

| 演算子 | 名前 | 説明 | 例 |
|--------|------|------|-----|
| `\|` | ユニオン | いずれかの型 | `String \| Integer` |
| `&` | インターセクション | 両方の型 | `Printable & Comparable` |
| `?` | オプション | `\| nil`の省略形 | `String?` |
| `<T>` | ジェネリック | 型パラメータ | `Array<T>` |
| `=>` | ハッシュペア | キー値の型 | `Hash<String => Integer>` |

```ruby
# ユニオン（OR）
value: String | Integer

# インターセクション（AND）
class Person
  implements Printable & Comparable
end

# オプション
name: String?  # String | nilと同じ

# ジェネリック
items: Array<String>
pairs: Hash<String, Integer>
```

## ブロック、Proc、ラムダ

```ruby
# ブロックパラメータ
def each_item<T>(items: Array<T>, &block: Proc<T, void>): void
  items.each { |item| block.call(item) }
end

# Proc型
callback: Proc<String, void> = ->(msg: String): void { puts msg }
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# 型付きラムダ
double: Proc<Integer, Integer> = ->(n: Integer): Integer { n * 2 }

# 複数のパラメータを持つブロック
def map<T, U>(items: Array<T>, &block: Proc<T, Integer, U>): Array<U>
  items.map.with_index { |item, index| block.call(item, index) }
end
```

## 型絞り込み

```ruby
# is_a?で型チェック
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase  # T-RubyはvalueがStringであることを知っている
  else
    value.to_s    # T-RubyはvalueがIntegerであることを知っている
  end
end

# Nilチェック
def get_length(text: String | nil): Integer
  if text.nil?
    0
  else
    text.length  # T-RubyはtextがStringであることを知っている
  end
end

# 複数のチェック
def describe(value: String | Integer | Bool): String
  if value.is_a?(String)
    "String: #{value}"
  elsif value.is_a?(Integer)
    "Number: #{value}"
  else
    "Boolean: #{value}"
  end
end
```

## リテラル型

```ruby
# 文字列リテラル
type Status = "pending" | "active" | "completed"
status: Status = "active"

# 数値リテラル
type Port = 80 | 443 | 8080
port: Port = 443

# シンボルリテラル
type Role = :admin | :editor | :viewer
role: Role = :admin

# ブールリテラル
type Yes = true
type No = false
```

## 高度な型

```ruby
# インターセクション型
type Serializable = Printable & Comparable
obj: Serializable  # 両方のインターフェースを実装する必要あり

# 条件型（計画中）
type NonNullable<T> = T extends nil ? never : T

# マップ型（計画中）
type Readonly<T> = { readonly [K in keyof T]: T[K] }

# ユーティリティ型
type Partial<T>    # すべてのプロパティをオプションに
type Required<T>   # すべてのプロパティを必須に
type Pick<T, K>    # プロパティを選択
type Omit<T, K>    # プロパティを除外
```

## 型アサーション

```ruby
# 型キャスト（注意して使用）
value = get_value() as String
number = parse("42") as Integer

# 安全な型変換
def to_integer(value: String | Integer): Integer
  if value.is_a?(Integer)
    value
  else
    value.to_i
  end
end
```

## モジュール型アノテーション

```ruby
module Formatter
  # 型付きモジュールメソッド
  def self.format(value: String, width: Integer): String
    value.ljust(width)
  end

  # 型付きモジュール定数
  DEFAULT_WIDTH: Integer = 80
  DEFAULT_CHAR: String = " "
end

# ミックスインモジュール
module Timestamped
  @created_at: Integer
  @updated_at: Integer

  def timestamp: Integer
    @created_at
  end
end
```

## 一般的なパターン

### デフォルト値付きオプションパラメータ

```ruby
def create_user(
  name: String,
  email: String,
  age: Integer = 18,
  active: Bool = true
): User
  User.new(name, email, age, active)
end
```

### Result型パターン

```ruby
type Result<T, E> = { success: Bool, value: T | nil, error: E | nil }

def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, value: nil, error: "Division by zero" }
  else
    { success: true, value: a / b, error: nil }
  end
end
```

### ビルダーパターン

```ruby
class QueryBuilder
  @conditions: Array<String>

  def initialize: void
    @conditions = []
  end

  def where(condition: String): self
    @conditions << condition
    self
  end

  def build: String
    @conditions.join(" AND ")
  end
end
```

### タイプガード

```ruby
def is_string(value: Any): value is String
  value.is_a?(String)
end

def is_user(value: Any): value is User
  value.is_a?(User)
end

# 使用方法
value = get_value()
if is_string(value)
  puts value.upcase  # ここでvalueはString
end
```

## クイックヒント

1. **型推論を使用** - すべてにアノテーションを付けず、T-Rubyに単純な型を推論させる
2. **Anyよりユニオン型を優先** - `String | Integer`は`Any`より良い
3. **型エイリアスを使用** - エイリアスで複雑な型を読みやすくする
4. **使用前に型を確認** - ユニオン型には`is_a?`と`nil?`を使用
5. **ジェネリックを活用** - 再利用可能で型安全なコードを書く
6. **段階的に開始** - 一度にすべてに型を付ける必要はない
7. **副作用には`void`を使用** - 意味のある値を返さないメソッド
8. **過度な型付けを避ける** - 型が明らかな場合はT-Rubyに推論させる

## 一般的な型エラー

```ruby
# ❌ 間違い: 誤った型の代入
name: String = 123  # エラー: IntegerはStringではない

# ✅ 正しい: ユニオン型を使用
id: String | Integer = 123

# ❌ 間違い: 型チェックなしでプロパティにアクセス
def get_length(value: String | nil): Integer
  value.length  # エラー: valueがnilの可能性あり
end

# ✅ 正しい: まずnilをチェック
def get_length(value: String | nil): Integer
  if value.nil?
    0
  else
    value.length
  end
end

# ❌ 間違い: 型パラメータなしのジェネリック
box = Box.new("hello")  # 型が推論できない場合エラー

# ✅ 正しい: 型パラメータを指定
box = Box<String>.new("hello")
```

## ファイル拡張子とコンパイル

```bash
# T-Rubyソースファイル
hello.trb

# Rubyにコンパイル
trc hello.trb
# 生成: hello.rb

# RBS型を生成
trc --rbs hello.trb
# 生成: hello.rbs

# ウォッチモード
trc --watch *.trb

# 型チェックのみ（出力なし）
trc --check hello.trb
```

## さらに読む

- [組み込み型](/docs/reference/built-in-types) - 組み込み型の完全なリスト
- [型演算子](/docs/reference/type-operators) - 詳細な演算子リファレンス
- [標準ライブラリ型](/docs/reference/stdlib-types) - Ruby stdlib型定義
- [型エイリアス](/docs/learn/advanced/type-aliases) - 高度なエイリアステクニック
- [ジェネリック](/docs/learn/generics/generic-functions-classes) - ジェネリックプログラミングガイド
