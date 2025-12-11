---
sidebar_position: 2
title: 制約
description: ジェネリック型パラメータの制約
---

# 制約

ジェネリクスは任意の型で動作するコードを書くことを可能にしますが、使用される型が特定のプロパティや機能を持つことを確認する必要がある場合があります。制約を使用すると、特定の要件を満たす型にジェネリック型パラメータを制限でき、型安全性を維持しながらそれらのメソッドやプロパティにアクセスできます。

## なぜ制約か？

制約なしでは、ジェネリックコードはすべての型で動作する操作のみを実行できます。制約を使用すると：

1. ジェネリック型で特定のメソッドやプロパティにアクセス
2. 型が特定のインターフェースを実装することを保証
3. 型が特定のクラスを拡張することを要求
4. 複数の要件を組み合わせ

### 問題：制約なしのジェネリクス

```ruby
# 制約なしでは型固有のメソッドを使用できない
def print_length<T>(value: T): void
  puts value.length  # エラー：Tにlengthメソッドがない可能性
end

# 制約なしでは特定の動作に依存できない
def compare<T>(a: T, b: T): Integer
  a <=> b  # エラー：Tが比較可能でない可能性
end
```

### 解決策：制約で

```ruby
# Tをlengthメソッドを持つ型に制約
def print_length<T: Lengthable>(value: T): void
  puts value.length  # OK：Tはlengthを持つことが保証
end

# Tを比較可能な型に制約
def compare<T: Comparable>(a: T, b: T): Integer
  a <=> b  # OK：Tは<=>をサポートすることが保証
end
```

## 基本的な制約構文

制約は型パラメータの後にコロン（`:`）を使用して指定します：

```ruby
# 単一の制約
def process<T: Interface>(value: T): void
  # TはInterfaceを実装する必要がある
end

# 制約付きの複数型パラメータ
def merge<K: Hashable, V: Serializable>(key: K, value: V): Hash<K, V>
  # KはHashableでなければならず、VはSerializableでなければならない
end
```

## インターフェース制約

最も一般的な制約は、型がインターフェースを実装することを要求することです。

### 制約用のインターフェース定義

```ruby
# インターフェースを定義
interface Printable
  def to_s: String
end

# TをPrintableを実装する型に制約
def print_items<T: Printable>(items: Array<T>): void
  items.each do |item|
    puts item.to_s  # 安全：Tはto_sを持つことが保証
  end
end

# 使用例
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

users = [User.new("Alice"), User.new("Bob")]
print_items(users)  # OK：UserはPrintableを実装
```

### 一般的なインターフェース制約

```ruby
# Comparableインターフェース
interface Comparable
  def <=>(other: self): Integer
end

def max<T: Comparable>(a: T, b: T): T
  a <=> b > 0 ? a : b
end

# Numericインターフェース
interface Numeric
  def +(other: self): self
  def -(other: self): self
  def *(other: self): self
  def /(other: self): self
end

def average<T: Numeric>(numbers: Array<T>): T
  sum = numbers.reduce { |acc, n| acc + n }
  sum / numbers.length
end

# Enumerableインターフェース
interface Enumerable<T>
  def each(&block: Proc<T, void>): void
  def map<U>(&block: Proc<T, U>): Array<U>
end

def count_items<T, C: Enumerable<T>>(collection: C): Integer
  counter = 0
  collection.each { |_| counter += 1 }
  counter
end
```

## クラス制約

型パラメータを特定のクラスまたはそのサブクラスに制約できます。

```ruby
# 特定のクラスに制約
class Animal
  @name: String

  def initialize(name: String): void
    @name = name
  end

  def speak: String
    "Some sound"
  end
end

class Dog < Animal
  def speak: String
    "Woof!"
  end
end

class Cat < Animal
  def speak: String
    "Meow!"
  end
end

# TはAnimalまたはAnimalのサブクラスでなければならない
def make_speak<T: Animal>(animal: T): void
  puts animal.speak  # 安全：Animalにspeakメソッドがある
end

# 使用例
dog = Dog.new("Buddy")
cat = Cat.new("Whiskers")

make_speak(dog)  # OK：DogはAnimal
make_speak(cat)  # OK：CatはAnimal
make_speak("string")  # エラー：StringはAnimalではない
```

### クラス階層での作業

```ruby
class Vehicle
  @brand: String

  def initialize(brand: String): void
    @brand = brand
  end

  def brand: String
    @brand
  end
end

class Car < Vehicle
  @doors: Integer

  def initialize(brand: String, doors: Integer): void
    super(brand)
    @doors = doors
  end

  def doors: Integer
    @doors
  end
end

# 任意のVehicleサブクラスで動作するRepository
class Repository<T: Vehicle>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): void
    @items.push(item)
  end

  def find_by_brand(brand: String): T | nil
    @items.find { |item| item.brand == brand }
  end

  def all: Array<T>
    @items.dup
  end
end

# 使用例
car_repo = Repository<Car>.new
car_repo.add(Car.new("Toyota", 4))
car_repo.add(Car.new("Honda", 2))

found = car_repo.find_by_brand("Toyota")  # Car | nil
```

## 複数の制約

:::caution 準備中
この機能は将来のリリースで計画されています。
:::

将来、T-Rubyは`&`演算子を使用した複数の制約をサポートする予定です：

```ruby
# 型は両方のインターフェースを実装する必要がある
def process<T: Printable & Comparable>(value: T): void
  puts value.to_s
  # 両方のインターフェースのメソッドを使用可能
end

# 型はクラスを拡張しインターフェースを実装する必要がある
def save<T: Entity & Serializable>(entity: T): void
  # Entityクラスとserializableインターフェースのメソッドを使用可能
end
```

## ユニオン型制約

ユニオン型を使用して、いくつかの特定の型のいずれかに制約できます：

```ruby
# TはStringまたはIntegerでなければならない
def format<T: String | Integer>(value: T): String
  case value
  when String
    "String: #{value}"
  when Integer
    "Number: #{value}"
  end
end

format("hello")  # OK
format(42)       # OK
format(3.14)     # エラー：FloatはString | Integerではない
```

### 実用的なユニオン制約の例

```ruby
# 柔軟なID型
type StringOrInt = String | Integer

def find_user<T: StringOrInt>(id: T): User | nil
  case id
  when String
    User.find_by_username(id)
  when Integer
    User.find_by_id(id)
  end
end

# 両方動作
user1 = find_user(123)        # 整数IDで検索
user2 = find_user("alice")    # ユーザー名文字列で検索
```

## 制約付きジェネリッククラス

ジェネリッククラスは制約付き型パラメータを持つことができます：

```ruby
# 比較可能なアイテムのみで動作するキュー
class PriorityQueue<T: Comparable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def enqueue(item: T): void
    @items.push(item)
    @items.sort! { |a, b| b <=> a }  # 高優先度が先
  end

  def dequeue: T | nil
    @items.shift
  end

  def peek: T | nil
    @items.first
  end
end

# 任意の比較可能な型で動作
class Task
  implements Comparable

  @priority: Integer
  @name: String

  def initialize(name: String, priority: Integer): void
    @name = name
    @priority = priority
  end

  def <=>(other: Task): Integer
    @priority <=> other.priority
  end
end

queue = PriorityQueue<Task>.new
queue.enqueue(Task.new("Low priority", 1))
queue.enqueue(Task.new("High priority", 10))
queue.enqueue(Task.new("Medium priority", 5))

# 優先度順にdequeue：High -> Medium -> Low
```

## 実践例

### ソート可能なコレクション

```ruby
interface Comparable
  def <=>(other: self): Integer
end

class SortedList<T: Comparable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): void
    @items.push(item)
    @items.sort! { |a, b| a <=> b }
  end

  def remove(item: T): Bool
    if index = @items.index(item)
      @items.delete_at(index)
      true
    else
      false
    end
  end

  def first: T | nil
    @items.first
  end

  def last: T | nil
    @items.last
  end

  def to_a: Array<T>
    @items.dup
  end
end

# 整数で使用（自然に比較可能）
numbers = SortedList<Integer>.new
numbers.add(5)
numbers.add(2)
numbers.add(8)
numbers.add(1)
puts numbers.to_a  # [1, 2, 5, 8] - 常にソート済み
```

### 制約付きRepositoryパターン

```ruby
# ベースエンティティクラス
class Entity
  @id: Integer

  def initialize(id: Integer): void
    @id = id
  end

  def id: Integer
    @id
  end
end

# Entityサブクラスに制約されたジェネリックrepository
class Repository<T: Entity>
  @items: Hash<Integer, T>

  def initialize: void
    @items = {}
  end

  def save(entity: T): void
    @items[entity.id] = entity
  end

  def find(id: Integer): T | nil
    @items[id]
  end

  def all: Array<T>
    @items.values
  end

  def delete(id: Integer): Bool
    !!@items.delete(id)
  end
end

# ドメインモデル
class User < Entity
  @name: String
  @email: String

  def initialize(id: Integer, name: String, email: String): void
    super(id)
    @name = name
    @email = email
  end

  def name: String
    @name
  end
end

class Product < Entity
  @title: String
  @price: Float

  def initialize(id: Integer, title: String, price: Float): void
    super(id)
    @title = title
    @price = price
  end

  def title: String
    @title
  end
end

# 使用例
user_repo = Repository<User>.new
user_repo.save(User.new(1, "Alice", "alice@example.com"))
user_repo.save(User.new(2, "Bob", "bob@example.com"))

product_repo = Repository<Product>.new
product_repo.save(Product.new(1, "Laptop", 999.99))

found_user = user_repo.find(1)  # User | nil
all_products = product_repo.all  # Array<Product>
```

## ベストプラクティス

### 1. 最も制限の少ない制約を使用

```ruby
# 良い：必要なものだけを要求
def print_all<T: Printable>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end

# あまり良くない：制限が多すぎる
def print_all<T: User>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end
```

### 2. 制約用に小さくフォーカスされたインターフェースを作成

```ruby
# 良い：小さくフォーカスされたインターフェース
interface Identifiable
  def id: Integer
end

interface Timestamped
  def created_at: Time
  def updated_at: Time
end

def find_by_id<T: Identifiable>(items: Array<T>, id: Integer): T | nil
  items.find { |item| item.id == id }
end

# あまり良くない：大きく一体的なインターフェース
interface Model
  def id: Integer
  def save: void
  def delete: void
  def created_at: Time
  def updated_at: Time
  # メソッドが多すぎる - 実装が難しい
end
```

### 3. 制約要件を文書化

```ruby
# 良い：明確なドキュメント
# 文字列に変換できるアイテムを処理
# @param items [Array<T>] 出力可能なアイテムの配列
# @return [void]
def log_items<T: Printable>(items: Array<T>): void
  items.each { |item| puts item.to_s }
end
```

## 一般的な制約パターン

### 識別制約

```ruby
interface Identifiable
  def id: Integer | String
end

def find_duplicates<T: Identifiable>(items: Array<T>): Array<T>
  seen = {}
  duplicates = []

  items.each do |item|
    if seen[item.id]
      duplicates.push(item)
    else
      seen[item.id] = true
    end
  end

  duplicates
end
```

### 検証制約

```ruby
interface Validatable
  def valid?: Bool
  def errors: Array<String>
end

def save_if_valid<T: Validatable>(item: T): Bool
  if item.valid?
    # 保存ロジック
    true
  else
    puts "Validation errors: #{item.errors.join(', ')}"
    false
  end
end
```

### 変換制約

```ruby
interface Convertible<T>
  def convert: T
end

def batch_convert<S: Convertible<T>, T>(items: Array<S>): Array<T>
  items.map { |item| item.convert }
end
```

## 次のステップ

制約を理解したので：

- [組み込みジェネリクス](/docs/learn/generics/built-in-generics)で`Array<T>`、`Hash<K, V>`、その他の組み込み型と制約がどのように動作するかを確認
- [インターフェース](/docs/learn/interfaces/defining-interfaces)で制約として使用するインターフェースを作成
- [高度な型](/docs/learn/advanced/type-aliases)でより複雑な型パターンを探索
