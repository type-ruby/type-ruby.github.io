---
sidebar_position: 3
title: 組み込みジェネリクス
description: Array、Hash、その他の組み込みジェネリック型
---

<DocsBadge />


# 組み込みジェネリクス

T-Rubyには毎日使用するいくつかの組み込みジェネリック型があります。これらの型は型安全性を提供しながら任意の型で動作するようにパラメータ化されています。これらの組み込みジェネリクスの使い方を理解することは、型安全なT-Rubyコードを書くために不可欠です。

## Array\<T\>

最も一般的に使用されるジェネリック型は`Array<T>`で、型`T`の要素の配列を表します。

### 基本的な配列の使用法

```trb
# 明示的に型付けされた配列
numbers: Array<Integer> = [1, 2, 3, 4, 5]
names: Array<String> = ["Alice", "Bob", "Charlie"]
flags: Array<Boolean> = [true, false, true]

# 型推論も動作
inferred_numbers = [1, 2, 3]  # Array<Integer>
inferred_names = ["Alice", "Bob"]  # Array<String>

# 空の配列は明示的な型が必要
empty_numbers: Array<Integer> = []
empty_users = Array<User>.new
```

### 配列操作

すべての標準配列操作は型安全性を維持します：

```trb
numbers: Array<Integer> = [1, 2, 3, 4, 5]

# 要素へのアクセス
first: Integer | nil = numbers[0]      # 1
last: Integer | nil = numbers[-1]      # 5
out_of_bounds: Integer | nil = numbers[100]  # nil

# 要素の追加
numbers.push(6)        # Array<Integer>
numbers << 7           # Array<Integer>
numbers.unshift(0)     # Array<Integer>

# 要素の削除
popped: Integer | nil = numbers.pop      # 最後を削除して返す
shifted: Integer | nil = numbers.shift   # 最初を削除して返す

# 内容の確認
contains_three: Boolean = numbers.include?(3)  # true
index: Integer | nil = numbers.index(3)     # 2
```

### 配列のマッピングと変換

マッピングは`Array<T>`を`Array<U>`に変換します：

```trb
# 整数を文字列にマップ
numbers: Array<Integer> = [1, 2, 3, 4, 5]
strings: Array<String> = numbers.map { |n| n.to_s }
# 結果: ["1", "2", "3", "4", "5"]

# 文字列を長さにマップ
words: Array<String> = ["hello", "world", "ruby"]
lengths: Array<Integer> = words.map { |w| w.length }
# 結果: [5, 5, 4]

# 複雑な型にマップ
class Person
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def name: String
    @name
  end
end

names: Array<String> = ["Alice", "Bob"]
people: Array<Person> = names.map { |name| Person.new(name, 25) }
```

### 配列のフィルタリング

フィルタリングは同じ型を維持します：

```trb
numbers: Array<Integer> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 偶数をフィルタ
evens: Array<Integer> = numbers.select { |n| n.even? }
# 結果: [2, 4, 6, 8, 10]

# 奇数をフィルタ
odds: Array<Integer> = numbers.reject { |n| n.even? }
# 結果: [1, 3, 5, 7, 9]

# 最初のマッチする要素を見つける
first_even: Integer | nil = numbers.find { |n| n.even? }
# 結果: 2

# 複雑な条件でフィルタ
words: Array<String> = ["hello", "world", "hi", "ruby", "typescript"]
long_words: Array<String> = words.select { |w| w.length > 4 }
# 結果: ["hello", "world", "typescript"]
```

### 配列のリダクション

reduceは配列を単一の値に畳み込みます：

```trb
numbers: Array<Integer> = [1, 2, 3, 4, 5]

# すべての数字を合計
sum: Integer = numbers.reduce(0) { |acc, n| acc + n }
# 結果: 15

# 最大値を見つける
max: Integer = numbers.reduce(numbers[0]) { |max, n| n > max ? n : max }
# 結果: 5

# 文字列を連結
words: Array<String> = ["Hello", "World", "from", "T-Ruby"]
sentence: String = words.reduce("") { |acc, w| acc.empty? ? w : "#{acc} #{w}" }
# 結果: "Hello World from T-Ruby"

# 配列からハッシュを構築
pairs: Array<Array<String>> = [["name", "Alice"], ["age", "30"]]
hash: Hash<String, String> = pairs.reduce({}) { |h, pair|
  h[pair[0]] = pair[1]
  h
}
```

### ネストした配列

配列は任意の深さでネストできます：

```trb
# 2次元配列（行列）
matrix: Array<Array<Integer>> = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]

# ネストした要素へのアクセス
first_row: Array<Integer> = matrix[0]      # [1, 2, 3]
element: Integer | nil = matrix[1][2]      # 6

# 3次元配列
cube: Array<Array<Array<Integer>>> = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
]

# ネストした配列をフラット化
nested: Array<Array<Integer>> = [[1, 2], [3, 4], [5, 6]]
flat: Array<Integer> = nested.flatten
# 結果: [1, 2, 3, 4, 5, 6]
```

## Hash\<K, V\>

`Hash<K, V>`は型`K`のキーと型`V`の値を持つハッシュマップを表します。

### 基本的なハッシュの使用法

```trb
# 明示的に型付けされたハッシュ
ages: Hash<String, Integer> = {
  "Alice" => 30,
  "Bob" => 25,
  "Charlie" => 35
}

# シンボルキー
config: Hash<Symbol, String> = {
  database: "postgresql",
  host: "localhost",
  port: "5432"
}

# 型推論
inferred = { "key" => "value" }  # Hash<String, String>

# 空のハッシュは明示的な型が必要
empty_hash: Hash<String, Integer> = {}
empty_map = Hash<Symbol, Array<String>>.new
```

### ハッシュ操作

```trb
ages: Hash<String, Integer> = {
  "Alice" => 30,
  "Bob" => 25
}

# 値へのアクセス
alice_age: Integer | nil = ages["Alice"]   # 30
missing: Integer | nil = ages["Charlie"]   # nil

# 値の追加/更新
ages["Charlie"] = 35
ages["Alice"] = 31  # 既存を更新

# 値の削除
removed: Integer | nil = ages.delete("Bob")  # 25を返す

# キーの確認
has_alice: Boolean = ages.key?("Alice")      # true
has_bob: Boolean = ages.key?("Bob")          # false（削除済み）

# キーと値の取得
keys: Array<String> = ages.keys           # ["Alice", "Charlie"]
values: Array<Integer> = ages.values      # [31, 35]
```

### ハッシュの反復

```trb
scores: Hash<String, Integer> = {
  "Alice" => 95,
  "Bob" => 87,
  "Charlie" => 92
}

# キー値ペアの反復
scores.each do |name, score|
  puts "#{name}: #{score}"
end

# 配列にマップ
name_score_pairs: Array<String> = scores.map { |name, score|
  "#{name} scored #{score}"
}

# ハッシュのフィルタ
high_scores: Hash<String, Integer> = scores.select { |_, score| score >= 90 }
# 結果: { "Alice" => 95, "Charlie" => 92 }

# 値の変換
doubled: Hash<String, Integer> = scores.transform_values { |score| score * 2 }
# 結果: { "Alice" => 190, "Bob" => 174, "Charlie" => 184 }
```

### 複雑なハッシュ型

```trb
# 配列値を持つハッシュ
tags: Hash<String, Array<String>> = {
  "ruby" => ["programming", "language"],
  "rails" => ["framework", "web"],
  "postgres" => ["database", "sql"]
}

# 配列値に追加
tags["ruby"].push("dynamic")

# ハッシュ値を持つハッシュ（ネスト）
users: Hash<String, Hash<Symbol, String | Integer>> = {
  "user1" => { name: "Alice", age: 30, email: "alice@example.com" },
  "user2" => { name: "Bob", age: 25, email: "bob@example.com" }
}

# ネストした値へのアクセス
user1_name = users["user1"][:name]  # "Alice"

# カスタム型を持つハッシュ
class User
  @name: String
  @email: String

  def initialize(name: String, email: String): void
    @name = name
    @email = email
  end
end

user_map: Hash<Integer, User> = {
  1 => User.new("Alice", "alice@example.com"),
  2 => User.new("Bob", "bob@example.com")
}
```

## Set\<T\>

`Set<T>`は型`T`のユニークな要素の順序なしコレクションを表します。

```trb
# セットの作成
numbers: Set<Integer> = Set.new([1, 2, 3, 4, 5])
unique_words: Set<String> = Set.new(["hello", "world", "hello"])
# unique_wordsは含む: {"hello", "world"}

# 要素の追加
numbers.add(6)
numbers.add(3)  # 既に存在、重複なし

# 要素の削除
numbers.delete(2)

# メンバーシップの確認
contains_three: Boolean = numbers.include?(3)  # true

# セット演算
set1: Set<Integer> = Set.new([1, 2, 3, 4])
set2: Set<Integer> = Set.new([3, 4, 5, 6])

union: Set<Integer> = set1 | set2           # {1, 2, 3, 4, 5, 6}
intersection: Set<Integer> = set1 & set2    # {3, 4}
difference: Set<Integer> = set1 - set2      # {1, 2}

# 配列に変換
array: Array<Integer> = numbers.to_a
```

## Range\<T\>

`Range<T>`は開始から終了までの値の範囲を表します。

```trb
# 整数範囲
one_to_ten: Range<Integer> = 1..10      # 包含: 1, 2, ..., 10
one_to_nine: Range<Integer> = 1...10    # 排他: 1, 2, ..., 9

# 範囲が値を含むか確認
includes_five: Boolean = one_to_ten.include?(5)  # true

# 配列に変換
numbers: Array<Integer> = (1..5).to_a   # [1, 2, 3, 4, 5]

# 範囲の反復
(1..5).each do |i|
  puts i
end

# 文字範囲
alphabet: Range<String> = 'a'..'z'
letters: Array<String> = ('a'..'e').to_a  # ["a", "b", "c", "d", "e"]
```

## Proc\<Args, Return\>

`Proc<Args, Return>`は型付きパラメータと戻り値型を持つproc/lambdaを表します。

```trb
# シンプルなproc
doubler: Proc<Integer, Integer> = ->(x: Integer): Integer { x * 2 }
result = doubler.call(5)  # 10

# 複数パラメータを持つProc
adder: Proc<Integer, Integer, Integer> = ->(x: Integer, y: Integer): Integer { x + y }
sum = adder.call(3, 4)  # 7

# 戻り値のないProc
printer: Proc<String, void> = ->(msg: String): void { puts msg }
printer.call("Hello!")

# パラメータとしてのProc
def apply_twice<T>(value: T, fn: Proc<T, T>): T
  fn.call(fn.call(value))
end

result = apply_twice(5, doubler)  # 20 (5 * 2 * 2)

# Procの配列
operations: Array<Proc<Integer, Integer>> = [
  ->(x: Integer): Integer { x + 1 },
  ->(x: Integer): Integer { x * 2 },
  ->(x: Integer): Integer { x - 3 }
]

result = operations.reduce(10) { |acc, op| op.call(acc) }
# 10 + 1 = 11, 11 * 2 = 22, 22 - 3 = 19
```

## Nilableを使用したオプショナル型

厳密にはジェネリックではありませんが、`T | nil`は非常に頻繁に使用されるので言及する価値があります。T-Rubyは`T?`という省略形もサポートしています。

```trb
# 明示的なオプショナル型
name: String | nil = "Alice"
age: Integer | nil = nil

# 省略形の構文
name: String? = "Alice"
age: Integer? = nil

# オプショナル配列の操作
numbers: Array<Integer>? = [1, 2, 3]
numbers = nil

# オプショナル要素の配列
numbers: Array<Integer | nil> = [1, nil, 3, nil, 5]
numbers: Array<Integer?> = [1, nil, 3, nil, 5]  # 上と同じ

# オプショナルハッシュ
config: Hash<String, String>? = { "key" => "value" }
config = nil

# オプショナル値を持つハッシュ
settings: Hash<String, String | nil> = {
  "name" => "MyApp",
  "description" => nil
}
```

## ジェネリック型の組み合わせ

ジェネリック型は強力な方法で組み合わせることができます：

```trb
# ハッシュの配列
users: Array<Hash<Symbol, String | Integer>> = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
]

# 配列のハッシュ
tags_by_category: Hash<String, Array<String>> = {
  "colors" => ["red", "blue", "green"],
  "sizes" => ["small", "medium", "large"]
}

# 配列の配列（行列）
matrix: Array<Array<Integer>> = [
  [1, 2, 3],
  [4, 5, 6]
]

# 複雑な値を持つハッシュ
cache: Hash<String, Array<Hash<Symbol, String>>> = {
  "users" => [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" }
  ]
}

# オプショナル値のオプショナル配列
data: Array<Integer | nil>? = [1, nil, 3]
data = nil
```

## 組み込みジェネリクスの型エイリアス

複雑なジェネリック型のための読みやすいエイリアスを作成します：

```trb
# シンプルなエイリアス
type StringArray = Array<String>
type IntHash = Hash<String, Integer>

# 複雑なエイリアス
type UserData = Hash<Symbol, String | Integer>
type UserList = Array<UserData>
type TagMap = Hash<String, Array<String>>

# エイリアスの使用
users: UserList = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
]

tags: TagMap = {
  "ruby" => ["language", "dynamic"],
  "typescript" => ["language", "static"]
}

# ジェネリックエイリアス
type Result<T> = T | nil
type Callback<T> = Proc<T, void>
type Transformer<T, U> = Proc<T, U>

# ジェネリックエイリアスの使用
find_user: Result<User> = User.find(1)
on_success: Callback<String> = ->(msg: String): void { puts msg }
to_string: Transformer<Integer, String> = ->(n: Integer): String { n.to_s }
```

## ベストプラクティス

### 1. Anyより特定の型を優先

```trb
# 良い：特定の型
users: Array<User> = []
config: Hash<Symbol, String> = {}

# 避ける：Anyの使用は型安全性を失う
data: Array<Any> = []  # 型チェックなし
```

### 2. 複雑な型には型エイリアスを使用

```trb
# 良い：明確で再利用可能なエイリアス
type UserMap = Hash<Integer, User>
type ErrorList = Array<String>

def process_users(users: UserMap): ErrorList
  # ...
end

# あまり良くない：繰り返される複雑な型
def process_users(users: Hash<Integer, User>): Array<String>
  # ...
end
```

### 3. Nil値を明示的に処理

```trb
# 良い：明示的なnil処理
users: Array<User> = []
first_user: User | nil = users.first

if first_user
  puts first_user.name
else
  puts "No users found"
end

# 危険：non-nilの仮定
# first_user.name  # nilの場合クラッシュの可能性！
```

### 4. 適切なコレクション型を使用

```trb
# 良い：ユニークなアイテムにSetを使用
unique_tags: Set<String> = Set.new

# 効率が低い：ユニーク性のためにArrayを使用
unique_tags: Array<String> = []
unique_tags.push(tag) unless unique_tags.include?(tag)
```

## 共通パターン

### 安全な配列アクセス

```trb
def safe_get<T>(array: Array<T>, index: Integer, default: T): T
  array.fetch(index, default)
end

numbers = [1, 2, 3]
value = safe_get(numbers, 10, 0)  # nilの代わりに0を返す
```

### ハッシュでグループ化

```trb
class Person
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def age: Integer
    @age
  end
end

people: Array<Person> = [
  Person.new("Alice", 30),
  Person.new("Bob", 25),
  Person.new("Charlie", 30)
]

# 年齢でグループ化
by_age: Hash<Integer, Array<Person>> = people.group_by { |p| p.age }
# { 30 => [Alice, Charlie], 25 => [Bob] }
```

### ハッシュでメモ化

```trb
class Calculator
  @cache: Hash<Integer, Integer>

  def initialize: void
    @cache = {}
  end

  def expensive_calculation(n: Integer): Integer
    if @cache.key?(n)
      @cache[n]
    else
      result = n * n  # コストの高い操作
      @cache[n] = result
      result
    end
  end
end
```

## 次のステップ

T-Rubyの組み込みジェネリック型を理解したので：

- [型エイリアス](/docs/learn/advanced/type-aliases)を探索して複雑な型のカスタム名を作成
- [ユーティリティ型](/docs/learn/advanced/utility-types)を学んで高度な型変換
- [ジェネリック関数とクラス](/docs/learn/generics/generic-functions-classes)を参照して独自のジェネリック型を作成
