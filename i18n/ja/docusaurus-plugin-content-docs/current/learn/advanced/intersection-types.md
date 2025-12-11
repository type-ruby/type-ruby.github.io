---
sidebar_position: 2
title: 交差型
description: 交差で型を結合
---

# 交差型

:::caution 準備中
この機能は将来のリリースで計画されています。
:::

交差型を使用すると、複数の型を1つに結合し、各結合された型のすべてのプロパティとメソッドを持つ型を作成できます。交差型を「AND」関係と考えてください—値は交差のすべての型を満たす必要があります。

## 交差型の理解

ユニオン型が「どちらか」の関係（`A | B`は「AまたはB」）を表すのに対し、交差型は「かつ」の関係（`A & B`は「AかつB」）を表します。

### ユニオン vs 交差

```ruby
# ユニオン型: 値はStringまたはIntegerのどちらか
type StringOrInt = String | Integer
value1: StringOrInt = "hello"  # OK
value2: StringOrInt = 42       # OK

# 交差型: 値は両方の型のプロパティを持つ必要がある
type NamedAndAged = Named & Aged
# name（Namedから）とage（Agedから）の両方が必要
```

## 基本的な交差構文

交差演算子は`&`です：

```ruby
type Combined = TypeA & TypeB & TypeC
```

## インターフェースの結合

交差型の最も一般的な使用法はインターフェースの結合です：

```ruby
# 個別のインターフェースを定義
interface Named
  def name: String
end

interface Aged
  def age: Integer
end

interface Contactable
  def email: String
  def phone: String
end

# 交差でインターフェースを結合
type Person = Named & Aged
type Employee = Named & Aged & Contactable

# 交差を実装するクラスはすべてのインターフェースを実装する必要がある
class User
  implements Named, Aged

  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def name: String
    @name
  end

  def age: Integer
    @age
  end
end

# UserはPerson型として使用可能
user: Person = User.new("Alice", 30)
puts user.name  # OK: Namedインターフェース
puts user.age   # OK: Agedインターフェース
```

## 型とインターフェースの混合

インターフェースをクラス型と結合できます：

```ruby
# 基本クラス
class Entity
  @id: Integer

  def initialize(id: Integer): void
    @id = id
  end

  def id: Integer
    @id
  end
end

# インターフェース
interface Timestamped
  def created_at: Time
  def updated_at: Time
end

# クラスとインターフェースの交差
type TimestampedEntity = Entity & Timestamped

# 実装はEntityを拡張しTimestampedを実装する必要がある
class User < Entity
  implements Timestamped

  @name: String
  @created_at: Time
  @updated_at: Time

  def initialize(id: Integer, name: String): void
    super(id)
    @name = name
    @created_at = Time.now
    @updated_at = Time.now
  end

  def created_at: Time
    @created_at
  end

  def updated_at: Time
    @updated_at
  end
end

# Userは交差型を満たす
user: TimestampedEntity = User.new(1, "Alice")
puts user.id          # Entityクラスから
puts user.created_at  # Timestampedインターフェースから
```

## 実用的な例

### ミックスインパターン

交差型はRubyのミックスイン概念とうまく機能します：

```ruby
# 機能インターフェースを定義
interface Serializable
  def to_json: String
  def self.from_json(json: String): self
end

interface Validatable
  def valid?: Bool
  def errors: Array<String>
end

interface Persistable
  def save: Bool
  def delete: Bool
end

# 必要に応じて機能を結合
type Model = Serializable & Validatable & Persistable

# フル機能のモデルクラス
class Article
  implements Serializable, Validatable, Persistable

  @title: String
  @content: String
  @errors: Array<String>

  def initialize(title: String, content: String): void
    @title = title
    @content = content
    @errors = []
  end

  def to_json: String
    "{ \"title\": \"#{@title}\", \"content\": \"#{@content}\" }"
  end

  def self.from_json(json: String): Article
    # JSONをパースしてインスタンスを作成
    Article.new("Title", "Content")
  end

  def valid?: Bool
    @errors = []
    @errors.push("Title cannot be empty") if @title.empty?
    @errors.push("Content cannot be empty") if @content.empty?
    @errors.empty?
  end

  def errors: Array<String>
    @errors
  end

  def save: Bool
    return false unless valid?
    # データベースに保存
    true
  end

  def delete: Bool
    # データベースから削除
    true
  end
end

# ArticleはModel交差型を満たす
article: Model = Article.new("Hello", "World")
puts article.to_json    # Serializable
puts article.valid?     # Validatable
article.save            # Persistable
```

### リポジトリパターン

```ruby
interface Identifiable
  def id: Integer | String
end

interface Timestamped
  def created_at: Time
  def updated_at: Time
end

interface SoftDeletable
  def deleted?: Bool
  def deleted_at: Time | nil
end

# さまざまなニーズに合わせた組み合わせ
type BaseEntity = Identifiable & Timestamped
type DeletableEntity = Identifiable & Timestamped & SoftDeletable

class Repository<T: BaseEntity>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def find(id: Integer | String): T | nil
    @items.find { |item| item.id == id }
  end

  def all: Array<T>
    @items.dup
  end

  def recent(limit: Integer = 10): Array<T>
    @items.sort_by { |item| item.created_at }.reverse.take(limit)
  end
end

class SoftDeleteRepository<T: DeletableEntity> < Repository<T>
  def all: Array<T>
    @items.reject { |item| item.deleted? }
  end

  def with_deleted: Array<T>
    @items.dup
  end

  def only_deleted: Array<T>
    @items.select { |item| item.deleted? }
  end
end
```

### イベントシステム

```ruby
interface Event
  def event_type: String
  def timestamp: Time
end

interface Cancellable
  def cancelled?: Bool
  def cancel: void
end

interface Prioritized
  def priority: Integer
end

# さまざまな機能を持つイベントタイプ
type BasicEvent = Event
type CancellableEvent = Event & Cancellable
type PrioritizedCancellableEvent = Event & Cancellable & Prioritized

class UserClickEvent
  implements Event

  @event_type: String
  @timestamp: Time

  def initialize: void
    @event_type = "user_click"
    @timestamp = Time.now
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end
end

class NetworkRequestEvent
  implements Event, Cancellable

  @event_type: String
  @timestamp: Time
  @cancelled: Bool

  def initialize: void
    @event_type = "network_request"
    @timestamp = Time.now
    @cancelled = false
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end

  def cancelled?: Bool
    @cancelled
  end

  def cancel: void
    @cancelled = true
  end
end

class CriticalAlertEvent
  implements Event, Cancellable, Prioritized

  @event_type: String
  @timestamp: Time
  @cancelled: Bool
  @priority: Integer

  def initialize(priority: Integer): void
    @event_type = "critical_alert"
    @timestamp = Time.now
    @cancelled = false
    @priority = priority
  end

  def event_type: String
    @event_type
  end

  def timestamp: Time
    @timestamp
  end

  def cancelled?: Bool
    @cancelled
  end

  def cancel: void
    @cancelled = true
  end

  def priority: Integer
    @priority
  end
end

# さまざまなイベントタイプのイベントハンドラ
def handle_basic_event(event: BasicEvent): void
  puts "Event: #{event.event_type} at #{event.timestamp}"
end

def handle_cancellable_event(event: CancellableEvent): void
  if event.cancelled?
    puts "Event #{event.event_type} was cancelled"
  else
    puts "Processing #{event.event_type}"
  end
end

def handle_priority_event(event: PrioritizedCancellableEvent): void
  puts "Priority #{event.priority}: #{event.event_type}"
  event.cancel if event.priority < 5
end
```

## ジェネリクスとの交差

交差型はジェネリクスと組み合わせることができます：

```ruby
# 交差制約を持つジェネリック型
def process<T: Serializable & Validatable>(item: T): Bool
  if item.valid?
    json = item.to_json
    # APIに送信
    true
  else
    puts "Validation errors: #{item.errors.join(', ')}"
    false
  end
end

# 複数の機能を必要とするコレクション
class ValidatedCollection<T: Identifiable & Validatable>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def add(item: T): Bool
    if item.valid?
      @items.push(item)
      true
    else
      false
    end
  end

  def find(id: Integer | String): T | nil
    @items.find { |item| item.id == id }
  end

  def all_valid: Array<T>
    @items.select { |item| item.valid? }
  end

  def all_invalid: Array<T>
    @items.reject { |item| item.valid? }
  end
end
```

## 型ガードとナローイング

交差型は型ナローイングと連携します：

```ruby
interface Animal
  def speak: String
end

interface Swimmable
  def swim: void
end

interface Flyable
  def fly: void
end

type Duck = Animal & Swimmable & Flyable

class DuckImpl
  implements Animal, Swimmable, Flyable

  def speak: String
    "Quack!"
  end

  def swim: void
    puts "Swimming..."
  end

  def fly: void
    puts "Flying..."
  end
end

def test_duck(animal: Animal): void
  puts animal.speak

  # responds_to?での型ナローイング
  if animal.responds_to?(:swim) && animal.responds_to?(:fly)
    # ここでanimalはDuck (Animal & Swimmable & Flyable)として扱われる
    duck = animal as Duck
    duck.swim
    duck.fly
  end
end
```

## 競合と解決

交差型に競合するメンバーがある場合、より具体的な型が勝ちます：

```ruby
interface HasName
  def name: String
end

interface HasOptionalName
  def name: String | nil
end

# 交差はより制限的な型を要求
type Person = HasName & HasOptionalName
# person.nameはStringでなければならない（String | nilではない）
# StringがString | nilより具体的であるため

class User
  implements HasName, HasOptionalName

  @name: String

  def initialize(name: String): void
    @name = name
  end

  # 両方のインターフェースを満たすためにStringを返す必要がある
  def name: String
    @name
  end
end
```

## ベストプラクティス

### 1. 小さく焦点を絞ったインターフェースを構成

```ruby
# 良い：単一責任の小さなインターフェース
interface Identifiable
  def id: Integer
end

interface Named
  def name: String
end

interface Timestamped
  def created_at: Time
end

type Entity = Identifiable & Named & Timestamped

# あまり良くない：大きく一体的なインターフェース
interface Entity
  def id: Integer
  def name: String
  def created_at: Time
  def updated_at: Time
  def save: Bool
  def delete: Bool
  # 責任が多すぎる
end
```

### 2. 意味のある名前を使用

```ruby
# 良い：交差が何を表すか明確
type AuditedEntity = Entity & Auditable
type SerializableModel = Model & Serializable

# あまり良くない：一般的な名前
type TypeA = Interface1 & Interface2
type Combined = Foo & Bar
```

### 3. 過度に複雑にしない

```ruby
# 良い：適切な数の交差
type FullModel = Identifiable & Timestamped & Validatable

# 潜在的に問題：交差が多すぎる
type SuperType = A & B & C & D & E & F & G & H
# 実装と理解が困難
```

### 4. 意図を文書化

```ruby
# 良い：なぜ交差が必要かを説明するコメント
# シリアライズ可能でキャッシュ可能なエンティティを表す
type CacheableEntity = Serializable & Identifiable

# キャッシュ実装
class Cache<T: CacheableEntity>
  @store: Hash<Integer | String, String>

  def set(entity: T): void
    @store[entity.id] = entity.to_json
  end

  def get(id: Integer | String): String | nil
    @store[id]
  end
end
```

## 一般的なパターン

### ビルダーパターン

```ruby
interface Buildable
  def build: self
end

interface Validatable
  def valid?: Bool
end

interface Resettable
  def reset: void
end

type CompleteBuilder = Buildable & Validatable & Resettable

class FormBuilder
  implements Buildable, Validatable, Resettable

  @fields: Hash<String, String>
  @errors: Array<String>

  def initialize: void
    @fields = {}
    @errors = []
  end

  def add_field(name: String, value: String): self
    @fields[name] = value
    self
  end

  def build: self
    self
  end

  def valid?: Bool
    @errors = []
    @errors.push("No fields") if @fields.empty?
    @errors.empty?
  end

  def reset: void
    @fields = {}
    @errors = []
  end
end
```

### ステートマシン

```ruby
interface State
  def name: String
end

interface Transitionable
  def can_transition_to?(state: String): Bool
  def transition_to(state: String): void
end

interface Observable
  def on_enter: void
  def on_exit: void
end

type ManagedState = State & Transitionable & Observable

class WorkflowState
  implements State, Transitionable, Observable

  @name: String
  @allowed_transitions: Array<String>

  def initialize(name: String, allowed_transitions: Array<String>): void
    @name = name
    @allowed_transitions = allowed_transitions
  end

  def name: String
    @name
  end

  def can_transition_to?(state: String): Bool
    @allowed_transitions.include?(state)
  end

  def transition_to(state: String): void
    if can_transition_to?(state)
      on_exit
      # 遷移を実行
      on_enter
    else
      raise "Invalid transition from #{@name} to #{state}"
    end
  end

  def on_enter: void
    puts "Entering state: #{@name}"
  end

  def on_exit: void
    puts "Exiting state: #{@name}"
  end
end
```

## 制限事項

### プリミティブ型は交差できない

```ruby
# 意味がない - 値はStringでありながら同時にIntegerではありえない
# type Impossible = String & Integer  # 空の型になる

# 交差は構造型（インターフェース、クラス）で意味がある
type Valid = Interface1 & Interface2
```

### 実装要件

```ruby
# 交差を使用する場合、実装はすべての部分を満たす必要がある
type Complete = Interface1 & Interface2 & Interface3

class MyClass
  # Interface1、Interface2、Interface3すべてを実装する必要がある
  implements Interface1, Interface2, Interface3
  # ...
end
```

## 次のステップ

交差型を理解したので、次を探索してください：

- [ユニオン型](/docs/learn/everyday-types/union-types)で「または」の型関係
- [型エイリアス](/docs/learn/advanced/type-aliases)で複雑な交差に名前を付ける
- [インターフェース](/docs/learn/interfaces/defining-interfaces)で交差のためのビルディングブロックを作成
- [条件型](/docs/learn/advanced/conditional-types)で条件に依存する型
