---
sidebar_position: 2
title: 組み込み型
description: 組み込み型の完全なリスト
---

<DocsBadge />


# 組み込み型

T-Rubyは、Rubyの基本データ型と一般的に使用されるパターンに対応する包括的な組み込み型セットを提供します。このリファレンスでは、T-Rubyで利用可能なすべての組み込み型を文書化します。

## プリミティブ型

### String

テキストデータを表します。文字列は文字のシーケンスです。

```trb
name: String = "Alice"
message: String = 'Hello, world!'
text: String = <<~TEXT
  複数行の
  文字列
TEXT
```

**一般的なメソッド:**
- `length: Integer` - 文字列の長さを返す
- `upcase: String` - 大文字に変換
- `downcase: String` - 小文字に変換
- `strip: String` - 前後の空白を削除
- `split(delimiter: String): String[]` - 配列に分割
- `include?(substring: String): Boolean` - 部分文字列を含むかチェック
- `empty?: Boolean` - 文字列が空かチェック

### Integer

整数（正、負、またはゼロ）を表します。

```trb
count: Integer = 42
negative: Integer = -10
zero: Integer = 0
large: Integer = 1_000_000
```

**一般的なメソッド:**
- `abs: Integer` - 絶対値
- `even?: Boolean` - 偶数かチェック
- `odd?: Boolean` - 奇数かチェック
- `to_s: String` - 文字列に変換
- `to_f: Float` - 浮動小数点に変換
- `times(&block: Proc<Integer, void>): void` - n回繰り返す

### Float

小数（浮動小数点）を表します。

```trb
price: Float = 19.99
pi: Float = 3.14159
negative: Float = -273.15
scientific: Float = 2.998e8
```

**一般的なメソッド:**
- `round: Integer` - 最も近い整数に丸める
- `round(digits: Integer): Float` - 小数点以下の桁数で丸める
- `ceil: Integer` - 切り上げ
- `floor: Integer` - 切り捨て
- `abs: Float` - 絶対値
- `to_s: String` - 文字列に変換
- `to_i: Integer` - 整数に変換

### Boolean

ブール値：`true`または`false`を表します。

```trb
active: Boolean = true
disabled: Boolean = false
is_valid: Boolean = count > 0
```

**注意:** T-Rubyは型名として`Boolean`を使用します（`Boolean`ではありません）。`true`と`false`のみが有効なブール値です。RubyのtruthyシステムとBが異なり、`Boolean`は`1`、`"yes"`、空文字列などのtruthy値を受け入れません。

### Symbol

不変の識別子を表します。シンボルは定数やハッシュキーとして使用するために最適化されています。

```trb
status: Symbol = :active
role: Symbol = :admin
key: Symbol = :name
```

**一般的なメソッド:**
- `to_s: String` - 文字列に変換
- `to_sym: Symbol` - selfを返す（互換性のため）

**一般的な用途:**
- ハッシュキー: `{ name: "Alice", role: :admin }`
- 定数と列挙
- メソッド名と識別子

### nil

値の不在を表します。

```trb
nothing: nil = nil

# ユニオン型でより一般的に使用
optional: String | nil = nil
result: User | nil = find_user(123)
```

**メソッド:**
- `nil?: Boolean` - nilに対して常に`true`を返す

## 特殊型

### Any

任意の型を表します。型チェックをバイパスするため、控えめに使用してください。

```trb
value: Any = "string"
value = 123          # OK
value = true         # OK
```

**警告:** `Any`は型安全性の目的を無効にします。可能であれば`String | Integer`のようなユニオン型を優先してください。

### void

戻り値がないことを表します。副作用を実行する関数に使用されます。

```trb
def log(message: String): void
  puts message
end

def save(data: Hash): void
  File.write("data.json", data.to_json)
end
```

**注意:** `void`戻り型を持つ関数も早期終了のために`return`を実行できますが、意味のある値を返すべきではありません。

### never

決して発生しない値を表します。決して戻らない関数に使用されます。

```trb
def raise_error(message: String): never
  raise StandardError, message
end

def infinite_loop: never
  loop { }
end
```

### self

現在のインスタンスの型を表します。メソッドチェーンに便利です。

```trb
class Builder
  @value: String

  def initialize: void
    @value = ""
  end

  def append(text: String): self
    @value += text
    self
  end

  def build: String
    @value
  end
end

# メソッドチェーンが動作
result = Builder.new.append("Hello").append(" ").append("World").build
```

## コレクション型

### Array\<T\>

型`T`の要素で構成される順序付きコレクションを表します。

```trb
# 文字列の配列
names: String[] = ["Alice", "Bob", "Charlie"]

# 整数の配列
numbers: Integer[] = [1, 2, 3, 4, 5]

# 混合型の配列
mixed: (String | Integer)[] = ["Alice", 1, "Bob", 2]

# ネストされた配列
matrix: Integer[][] = [[1, 2], [3, 4]]

# 型付きの空配列
items: String[] = []
```

**一般的なメソッド:**
- `length: Integer` - 配列の長さを返す
- `size: Integer` - lengthのエイリアス
- `empty?: Boolean` - 空かチェック
- `first: T | nil` - 最初の要素を返す
- `last: T | nil` - 最後の要素を返す
- `push(item: T): T[]` - 末尾に要素を追加
- `pop: T | nil` - 最後の要素を削除して返す
- `shift: T | nil` - 最初の要素を削除して返す
- `unshift(item: T): T[]` - 先頭に要素を追加
- `include?(item: T): Boolean` - 要素を含むかチェック
- `map<U>(&block: Proc<T, U>): U[]` - 要素を変換
- `select(&block: Proc<T, Boolean>): T[]` - 要素をフィルタ
- `each(&block: Proc<T, void>): void` - 要素を反復
- `reverse: T[]` - 反転した配列を返す
- `sort: T[]` - ソートされた配列を返す
- `join(separator: String): String` - 文字列に結合

### Hash\<K, V\>

型`K`のキーと型`V`の値を持つキーバリューペアのコレクションを表します。

```trb
# 文字列キー、整数値
scores: Hash<String, Integer> = { "Alice" => 100, "Bob" => 95 }

# シンボルキー、文字列値
config: Hash<Symbol, String> = { host: "localhost", port: "3000" }

# 混合値型
user: Hash<Symbol, String | Integer> = { name: "Alice", age: 30 }

# ネストされたハッシュ
data: Hash<String, Hash<String, Integer>> = {
  "users" => { "total" => 100, "active" => 75 }
}

# 型付きの空ハッシュ
cache: Hash<String, Any> = {}
```

**一般的なメソッド:**
- `length: Integer` - ペアの数を返す
- `size: Integer` - lengthのエイリアス
- `empty?: Boolean` - 空かチェック
- `key?(key: K): Boolean` - キーが存在するかチェック
- `value?(value: V): Boolean` - 値が存在するかチェック
- `keys: K[]` - キーの配列を返す
- `values: V[]` - 値の配列を返す
- `fetch(key: K): V` - 値を取得（見つからない場合は例外）
- `fetch(key: K, default: V): V` - デフォルト値で値を取得
- `merge(other: Hash<K, V>): Hash<K, V>` - ハッシュをマージ
- `each(&block: Proc<K, V, void>): void` - ペアを反復

### Set\<T\>

一意な要素の順序なしコレクションを表します。

```trb
# 文字列のセット
tags: Set<String> = Set.new(["ruby", "rails", "web"])

# 整数のセット
unique_ids: Set<Integer> = Set.new([1, 2, 3, 2, 1])  # {1, 2, 3}
```

**一般的なメソッド:**
- `add(item: T): Set<T>` - 要素を追加
- `delete(item: T): Set<T>` - 要素を削除
- `include?(item: T): Boolean` - メンバーシップをチェック
- `empty?: Boolean` - 空かチェック
- `size: Integer` - 要素数を返す
- `to_a: T[]` - 配列に変換

### Range

値の範囲を表します。

```trb
# 整数の範囲
numbers: Range = 1..10      # 包含: 1から10
numbers: Range = 1...10     # 排他: 1から9

# 文字の範囲
letters: Range = 'a'..'z'
```

**一般的なメソッド:**
- `to_a: Array` - 配列に変換
- `each(&block: Proc<Any, void>): void` - 範囲を反復
- `include?(value: Any): Boolean` - 値が範囲内かチェック
- `first: Any` - 最初の値を返す
- `last: Any` - 最後の値を返す

## 数値型

### Numeric

すべての数値型の親型です。

```trb
value: Numeric = 42
value: Numeric = 3.14
```

**サブタイプ:**
- `Integer`
- `Float`
- `Rational`（計画中）
- `Complex`（計画中）

### Rational

有理数（分数）を表します。*（計画中の機能）*

```trb
fraction: Rational = Rational(1, 2)  # 1/2
```

### Complex

複素数を表します。*（計画中の機能）*

```trb
complex: Complex = Complex(1, 2)  # 1+2i
```

## 関数型

### Proc\<Args..., Return\>

proc、ラムダ、またはブロックを表します。

```trb
# シンプルなproc
callback: Proc<String, void> = ->(msg: String): void { puts msg }

# 戻り値を持つProc
transformer: Proc<Integer, String> = ->(n: Integer): String { n.to_s }

# 複数のパラメータ
adder: Proc<Integer, Integer, Integer> = ->(a: Integer, b: Integer): Integer { a + b }

# パラメータなし
supplier: Proc<String> = ->: String { "Hello" }
```

### Lambda

`Proc`の型エイリアスです。T-Rubyでは、ラムダとprocは同じ型を使用します。

```trb {skip-verify}
type Lambda<Args..., Return> = Proc<Args..., Return>
```

### ブロックパラメータ

```trb
# ブロックを受け取るメソッド
def each_item<T>(items: T[], &block: Proc<T, void>): void
  items.each { |item| block.call(item) }
end

# 複数のパラメータを持つブロック
def map_with_index<T, U>(
  items: T[],
  &block: Proc<T, Integer, U>
): U[]
  items.map.with_index { |item, index| block.call(item, index) }
end
```

## オブジェクト型

### Object

すべてのオブジェクトの基本型です。

```trb
value: Object = "string"
value: Object = 123
value: Object = User.new
```

### Class

クラスオブジェクトを表します。

```trb
user_class: Class = User
string_class: Class = String

# インスタンスの作成
instance = user_class.new
```

### Module

モジュールを表します。

```trb
mod: Module = Enumerable
```

## IO型

### IO

入出力ストリームを表します。

```trb
file: IO = File.open("data.txt", "r")
stdout: IO = $stdout

def read_file(io: IO): String
  io.read
end
```

### File

ファイルオブジェクトを表します（IOのサブタイプ）。

```trb
file: File = File.open("data.txt", "r")

def process_file(f: File): void
  content = f.read
  puts content
end
```

## 時間型

### Time

時点を表します。

```trb
now: Time = Time.now
past: Time = Time.new(2020, 1, 1)

def format_time(t: Time): String
  t.strftime("%Y-%m-%d %H:%M:%S")
end
```

### Date

日付（時刻なし）を表します。

```trb
today: Date = Date.today
birthday: Date = Date.new(1990, 5, 15)
```

### DateTime

タイムゾーン付きの日付と時刻を表します。

```trb
moment: DateTime = DateTime.now
```

## 正規表現型

### Regexp

正規表現パターンを表します。

```trb
pattern: Regexp = /\d+/
email_pattern: Regexp = /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i

def validate_email(email: String, pattern: Regexp): Boolean
  email.match?(pattern)
end
```

### MatchData

正規表現マッチの結果を表します。

```trb
def extract_numbers(text: String): String[] | nil
  match: MatchData | nil = text.match(/\d+/)
  return nil if match.nil?
  match.to_a
end
```

## エラー型

### Exception

すべての例外の基底クラスです。

```trb
def handle_error(error: Exception): String
  error.message
end
```

### StandardError

標準エラー型（最も一般的にrescueされる）。

```trb
def safe_divide(a: Integer, b: Integer): Float | StandardError
  begin
    a.to_f / b
  rescue => e
    e
  end
end
```

### 一般的な例外型

```ruby
ArgumentError      # 無効な引数
TypeError          # 型の不一致
NameError          # 未定義の名前
NoMethodError      # メソッドが見つからない
RuntimeError       # 一般的なランタイムエラー
IOError            # I/O操作の失敗
```

## Enumerator型

### Enumerator\<T\>

列挙可能なオブジェクトを表します。

```trb
enum: Enumerator<Integer> = [1, 2, 3].each
range_enum: Enumerator<Integer> = (1..10).each

def process<T>(enum: Enumerator<T>): T[]
  enum.to_a
end
```

## Struct型

### Struct

構造体クラスを表します。

```trb
Point = Struct.new(:x, :y)

point: Point = Point.new(10, 20)
```

## Thread型

### Thread

実行スレッドを表します。

```trb
thread: Thread = Thread.new { puts "Hello from thread" }

def run_async(&block: Proc<void>): Thread
  Thread.new { block.call }
end
```

## リファレンステーブル

| 型 | カテゴリ | 説明 | 例 |
|----|----------|------|-----|
| `String` | プリミティブ | テキストデータ | `"hello"` |
| `Integer` | プリミティブ | 整数 | `42` |
| `Float` | プリミティブ | 小数 | `3.14` |
| `Boolean` | プリミティブ | True/false | `true` |
| `Symbol` | プリミティブ | 識別子 | `:active` |
| `nil` | プリミティブ | 値なし | `nil` |
| `Array<T>` | コレクション | 順序付きリスト | `[1, 2, 3]` |
| `Hash<K, V>` | コレクション | キーバリューペア | `{ "a" => 1 }` |
| `Set<T>` | コレクション | 一意な項目 | `Set.new([1, 2])` |
| `Range` | コレクション | 値の範囲 | `1..10` |
| `Proc<Args, R>` | 関数 | 呼び出し可能 | `->​(x) { x * 2 }` |
| `Any` | 特殊 | 任意の型 | 任意の値 |
| `void` | 特殊 | 戻り値なし | 副作用のみ |
| `never` | 特殊 | 決して戻らない | 例外/ループ |
| `self` | 特殊 | 現在のインスタンス | メソッドチェーン |
| `Time` | 時間 | 時点 | `Time.now` |
| `Date` | 時間 | カレンダー日付 | `Date.today` |
| `Regexp` | パターン | 正規表現パターン | `/\d+/` |
| `IO` | I/O | ストリーム | `File.open(...)` |
| `Exception` | エラー | エラーオブジェクト | `StandardError.new` |

## 型変換

T-Rubyは組み込み型に型変換メソッドを提供します：

```ruby
# Stringへ
"123".to_s        # "123"
123.to_s          # "123"
3.14.to_s         # "3.14"
true.to_s         # "true"
:symbol.to_s      # "symbol"

# Integerへ
"123".to_i        # 123
3.14.to_i         # 3（切り捨て）
true.to_i         # エラー: Booleanにto_iはない

# Floatへ
"3.14".to_f       # 3.14
123.to_f          # 123.0

# Symbolへ
"name".to_sym     # :name
:name.to_sym      # :name

# Arrayへ
(1..5).to_a       # [1, 2, 3, 4, 5]
{ a: 1 }.to_a     # [[:a, 1]]

# Hashへ
[[:a, 1]].to_h    # { a: 1 }
```

## 型チェックメソッド

すべての型は型チェックメソッドをサポートします：

```trb
value: String | Integer = get_value()

# クラスチェック
value.is_a?(String)    # Boolean
value.is_a?(Integer)   # Boolean
value.kind_of?(String) # Boolean（エイリアス）

# インスタンスチェック
value.instance_of?(String)  # Boolean（正確なクラス）

# Nilチェック
value.nil?             # Boolean

# 型メソッド
value.class            # Class
value.class.name       # String
```

## ベストプラクティス

1. **Anyより特定の型を使用** - `Any`の代わりに`String | Integer`
2. **コレクションにジェネリックを活用** - `Array`の代わりに`String[]`
3. **オプション値にユニオン型を使用** - `String | nil`または`String?`
4. **適切なコレクション型を選択** - 一意性には`Set`、ルックアップには`Hash`
5. **副作用には`void`を優先** - 値を返さない関数を明確に示す
6. **戻らない関数には`never`を使用** - 例外を発生させたり永久にループする関数を文書化

## 次のステップ

- [型演算子](/docs/reference/type-operators) - ユニオン、インターセクション、その他の演算子を学ぶ
- [標準ライブラリ型](/docs/reference/stdlib-types) - Ruby stdlib型定義を探索
- [型エイリアス](/docs/learn/advanced/type-aliases) - カスタム型名を作成
- [ジェネリック](/docs/learn/generics/generic-functions-classes) - ジェネリックプログラミングをマスター
