---
sidebar_position: 1
title: ジェネリック関数とクラス
description: ジェネリクスで再利用可能なコードを作成
---

<DocsBadge />


# ジェネリック関数とクラス

ジェネリクスはT-Rubyの最も強力な機能の一つで、型安全性を維持しながら複数の型で動作するコードを書くことができます。ジェネリクスを「型変数」と考えてください—コードが使用されるときに具体的な型で埋められるプレースホルダーです。

## なぜジェネリクスか？

ジェネリクスがなければ、同じ関数を異なる型に対して複数回書くか、`Any`を使用して型安全性を失う必要があります。ジェネリクスを使えば、一度コードを書いて異なる型で再利用できます。

### 問題：ジェネリクスなし

```trb
# ジェネリクスなしでは各型に別々の関数が必要
def first_string(arr: String[]): String | nil
  arr[0]
end

def first_integer(arr: Integer[]): Integer | nil
  arr[0]
end

def first_user(arr: User[]): User | nil
  arr[0]
end

# または型安全性を失う
def first(arr: Any[]): Any
  arr[0]  # 戻り値の型がAny - 型安全性なし！
end
```

### 解決策：ジェネリクスで

```trb
# すべての型で動作する1つの関数
def first<T>(arr: T[]): T | nil
  arr[0]
end

# TypeScriptスタイルの推論が自動的に動作
names = ["Alice", "Bob", "Charlie"]
result = first(names)  # resultはString | nil

numbers = [1, 2, 3]
value = first(numbers)  # valueはInteger | nil
```

## ジェネリック関数

ジェネリック関数は角括弧（`<T>`）の型パラメータを使用して、関数が呼び出されるときに決定される型を表します。

### 基本的なジェネリック関数

```trb
# シンプルなジェネリック関数
def identity<T>(value: T): T
  value
end

# 任意の型で動作
str = identity("hello")      # String
num = identity(42)           # Integer
arr = identity([1, 2, 3])    # Integer[]
```

### 複数の型パラメータ

必要に応じて複数の型パラメータを使用できます：

```trb
# 2つの型パラメータを持つ関数
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# 両方のパラメータで型推論が動作
result = pair("name", "Alice")     # Hash<String, String>
data = pair(:id, 123)              # Hash<Symbol, Integer>
mixed = pair("count", 42)          # Hash<String, Integer>
```

### 配列を扱うジェネリック関数

一般的なユースケースは任意の型の配列を扱うことです：

```trb
# 配列の最後の要素を取得
def last<T>(arr: T[]): T | nil
  arr[-1]
end

# 配列を反転
def reverse<T>(arr: T[]): T[]
  arr.reverse
end

# 述語で配列をフィルタ
def filter<T>(arr: T[], &block: Proc<T, Boolean>): T[]
  arr.select { |item| block.call(item) }
end

# 使用例
numbers = [1, 2, 3, 4, 5]
evens = filter(numbers) { |n| n.even? }  # Integer[]

words = ["hello", "world", "foo", "bar"]
long_words = filter(words) { |w| w.length > 3 }  # String[]
```

### 戻り値型変換のあるジェネリック関数

戻り値の型が入力型と異なるが、それでもジェネリックな場合もあります：

```trb
# 型TをUに変換するmap関数
def map<T, U>(arr: T[], &block: Proc<T, U>): U[]
  arr.map { |item| block.call(item) }
end

# 整数を文字列に変換
numbers = [1, 2, 3]
strings = map(numbers) { |n| n.to_s }  # String[]

# 文字列を長さに変換
words = ["hello", "world"]
lengths = map(words) { |w| w.length }  # Integer[]
```

## ジェネリッククラス

ジェネリッククラスを使用すると、クラス全体で型安全性を維持しながら任意の型で動作するデータ構造を作成できます。

### 基本的なジェネリッククラス

```trb
# シンプルなジェネリックコンテナ
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

# 異なる型でボックスを作成
string_box = Box<String>.new("hello")
puts string_box.get  # "hello"

number_box = Box<Integer>.new(42)
puts number_box.get  # 42

# 型安全性が強制される
string_box.set("world")  # OK
string_box.set(123)      # エラー：型の不一致
```

### 型推論のあるジェネリッククラス

T-Rubyはしばしばコンストラクタから型パラメータを推論できます：

```trb
class Container<T>
  @item: T

  def initialize(item: T): void
    @item = item
  end

  def item: T
    @item
  end

  def update(new_item: T): void
    @item = new_item
  end
end

# コンストラクタ引数から型推論
container1 = Container.new("hello")  # Container<String>
container2 = Container.new(42)       # Container<Integer>

# または明示的に型を指定
container3 = Container<Boolean>.new(true)
```

### ジェネリックスタックの例

ジェネリックスタックデータ構造の実用的な例：

```trb
class Stack<T>
  @items: T[]

  def initialize: void
    @items = []
  end

  def push(item: T): void
    @items.push(item)
  end

  def pop: T | nil
    @items.pop
  end

  def peek: T | nil
    @items.last
  end

  def empty?: Boolean
    @items.empty?
  end

  def size: Integer
    @items.length
  end

  def to_a: T[]
    @items.dup
  end
end

# 文字列で使用
string_stack = Stack<String>.new
string_stack.push("first")
string_stack.push("second")
string_stack.push("third")
puts string_stack.pop  # "third"
puts string_stack.size # 2

# 整数で使用
int_stack = Stack<Integer>.new
int_stack.push(1)
int_stack.push(2)
int_stack.push(3)
puts int_stack.peek  # 3（削除しない）
puts int_stack.size  # 3
```

### 複数の型パラメータを持つジェネリッククラス

ジェネリッククラスは複数の型パラメータを持つことができます：

```trb
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

  def swap: Pair<V, K>
    Pair.new(@value, @key)
  end

  def to_s: String
    "#{@key} => #{@value}"
  end
end

# 異なる型の組み合わせでペアを作成
name_age = Pair.new("Alice", 30)     # Pair<String, Integer>
id_name = Pair.new(123, "Bob")       # Pair<Integer, String>
coords = Pair.new(10.5, 20.3)        # Pair<Float, Float>

# swapは型が逆になった新しいペアを作成
swapped = name_age.swap              # Pair<Integer, String>
```

### ジェネリックコレクションクラス

カスタムコレクションを示すより複雑な例：

```trb
class Collection<T>
  @items: T[]

  def initialize(items: T[] = []): void
    @items = items.dup
  end

  def add(item: T): void
    @items.push(item)
  end

  def remove(item: T): Boolean
    if index = @items.index(item)
      @items.delete_at(index)
      true
    else
      false
    end
  end

  def contains?(item: T): Boolean
    @items.include?(item)
  end

  def first: T | nil
    @items.first
  end

  def last: T | nil
    @items.last
  end

  def map<U>(&block: Proc<T, U>): Collection<U>
    Collection<U>.new(@items.map { |item| block.call(item) })
  end

  def filter(&block: Proc<T, Boolean>): Collection<T>
    Collection.new(@items.select { |item| block.call(item) })
  end

  def each(&block: Proc<T, void>): void
    @items.each { |item| block.call(item) }
  end

  def to_a: T[]
    @items.dup
  end

  def size: Integer
    @items.length
  end
end

# 使用例
numbers = Collection<Integer>.new([1, 2, 3, 4, 5])
numbers.add(6)

# mapはコレクションを新しい型に変換
strings = numbers.map { |n| n.to_s }  # Collection<String>

# filterは同じ型を維持
evens = numbers.filter { |n| n.even? }  # Collection<Integer>

# アイテムを反復
numbers.each { |n| puts n }
```

## 非ジェネリッククラスのジェネリックメソッド

自身がジェネリックでないクラスでもジェネリックメソッドを持つことができます：

```trb
class Utils
  # 非ジェネリッククラスのジェネリックメソッド
  def self.wrap<T>(value: T): T[]
    [value]
  end

  def self.duplicate<T>(value: T, times: Integer): T[]
    Array.new(times, value)
  end

  def self.zip<T, U>(arr1: T[], arr2: U[]): Pair<T, U>[]
    arr1.zip(arr2).map { |t, u| Pair.new(t, u) }
  end
end

# 使用例
wrapped = Utils.wrap(42)                    # Integer[]
duplicates = Utils.duplicate("hello", 3)    # String[]
zipped = Utils.zip([1, 2], ["a", "b"])      # Pair<Integer, String>[]
```

## ネストしたジェネリクス

ジェネリクスをネストして複雑な型構造を作成できます：

```trb
# 各キーに対して値の配列を格納するキャッシュ
class Cache<K, V>
  @store: Hash<K, V[]>

  def initialize: void
    @store = {}
  end

  def add(key: K, value: V): void
    @store[key] ||= []
    @store[key].push(value)
  end

  def get(key: K): V[]
    @store[key] || []
  end

  def has_key?(key: K): Boolean
    @store.key?(key)
  end
end

# 使用例
user_tags = Cache<Integer, String>.new  # Cache<Integer, String>
user_tags.add(1, "ruby")
user_tags.add(1, "programming")
user_tags.add(2, "design")

tags = user_tags.get(1)  # String[] = ["ruby", "programming"]
```

## ベストプラクティス

### 1. 説明的な型パラメータ名を使用

```trb
# 良い：ドメイン固有の型に説明的な名前
class Repository<Entity, Id>
  def find(id: Id): Entity | nil
    # ...
  end
end

# OK：ジェネリックコレクションの標準的な規約
class List<T>
  # ...
end

# 避ける：複雑なシナリオで説明のない単一文字
class Processor<A, B, C, D>  # 暗号的すぎる
  # ...
end
```

### 2. ジェネリック関数をシンプルに保つ

```trb
# 良い：シンプルでフォーカスされたジェネリック関数
def head<T>(arr: T[]): T | nil
  arr.first
end

# あまり良くない：責任が多すぎる
def process<T>(arr: T[], flag: Boolean, count: Integer): T[] | Hash<Integer, T>
  # 複雑すぎる、ジェネリックの動作を理解しにくい
end
```

### 3. 可能な場合は型推論を使用

```trb
# T-Rubyに引数から型を推論させる
container = Container.new("hello")  # Container<String>が推論される

# 必要な場合のみ型を指定
container = Container<String | Integer>.new("hello")
```

## 共通パターン

### Option/Maybe型

```trb
class Option<T>
  @value: T | nil

  def initialize(value: T | nil): void
    @value = value
  end

  def is_some?: Boolean
    !@value.nil?
  end

  def is_none?: Boolean
    @value.nil?
  end

  def unwrap: T
    raise "Called unwrap on None" if @value.nil?
    @value
  end

  def unwrap_or(default: T): T
    @value || default
  end

  def map<U>(&block: Proc<T, U>): Option<U>
    if @value
      Option.new(block.call(@value))
    else
      Option<U>.new(nil)
    end
  end
end

# 使用例
some = Option.new(42)
none = Option<Integer>.new(nil)

puts some.unwrap_or(0)  # 42
puts none.unwrap_or(0)  # 0

result = some.map { |n| n * 2 }  # Option<Integer>、値84
```

### Result型

```trb
class Result<T, E>
  @value: T | nil
  @error: E | nil

  def self.ok(value: T): Result<T, E>
    result = Result<T, E>.new
    result.instance_variable_set(:@value, value)
    result
  end

  def self.err(error: E): Result<T, E>
    result = Result<T, E>.new
    result.instance_variable_set(:@error, error)
    result
  end

  def ok?: Boolean
    !@value.nil?
  end

  def err?: Boolean
    !@error.nil?
  end

  def unwrap: T
    raise "Called unwrap on Err: #{@error}" if @error
    @value
  end

  def unwrap_err: E
    raise "Called unwrap_err on Ok" if @value
    @error
  end
end

# 使用例
def divide(a: Integer, b: Integer): Result<Float, String>
  if b == 0
    Result.err("Division by zero")
  else
    Result.ok(a.to_f / b)
  end
end

result = divide(10, 2)
puts result.unwrap if result.ok?  # 5.0

result = divide(10, 0)
puts result.unwrap_err if result.err?  # "Division by zero"
```

## 次のステップ

ジェネリック関数とクラスを理解したので：

- [制約](/docs/learn/generics/constraints)を学んでジェネリクスで使用できる型を制限
- `Array<T>`や`Hash<K, V>`などの[組み込みジェネリクス](/docs/learn/generics/built-in-generics)を探索
- ジェネリクスが[インターフェース](/docs/learn/interfaces/defining-interfaces)とどのように動作するかを確認
