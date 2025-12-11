---
sidebar_position: 1
title: 型エイリアス
description: カスタム型名の作成
---

# 型エイリアス

型エイリアスを使用すると、型にカスタム名を作成でき、コードをより読みやすく保守しやすくします。型のニックネームと考えてください—新しい型を作成するのではなく、複雑な型をより扱いやすく理解しやすくします。

## なぜ型エイリアスか？

型エイリアスはいくつかの重要な目的を果たします：

1. **可読性の向上** - 複雑な型表現を意味のある名前で置換
2. **繰り返しの削減** - 一度定義し、どこでも使用
3. **意図の文書化** - 名前が型が表すものを伝えることができる
4. **リファクタリングの簡略化** - 一箇所で型を変更

### 型エイリアスなしで

```ruby
# 複雑な型がすべての場所で繰り返される
def find_user(id: Integer): Hash<Symbol, String | Integer | Bool> | nil
  # ...
end

def update_user(id: Integer, data: Hash<Symbol, String | Integer | Bool>): Bool
  # ...
end

def create_user(data: Hash<Symbol, String | Integer | Bool>): Integer
  # ...
end

# これが何を表すか理解しにくい
users: Array<Hash<Symbol, String | Integer | Bool>> = []
```

### 型エイリアス使用

```ruby
# 一度定義
type UserData = Hash<Symbol, String | Integer | Bool>

# どこでも使用 - はるかに明確！
def find_user(id: Integer): UserData | nil
  # ...
end

def update_user(id: Integer, data: UserData): Bool
  # ...
end

def create_user(data: UserData): Integer
  # ...
end

# これが何を表すか明確
users: Array<UserData> = []
```

## 基本的な型エイリアス

型エイリアスを作成する構文はシンプルです：

```ruby
type AliasName = ExistingType
```

### シンプルなエイリアス

```ruby
# プリミティブ型のエイリアス
type UserId = Integer
type EmailAddress = String
type Price = Float

# エイリアスの使用
user_id: UserId = 123
email: EmailAddress = "alice@example.com"
product_price: Price = 29.99

# エイリアスを使用する関数
def send_email(to: EmailAddress, subject: String, body: String): Bool
  # ...
end

def calculate_discount(original: Price, percentage: Float): Price
  original * (1.0 - percentage / 100.0)
end
```

### ユニオン型エイリアス

ユニオン型はエイリアスから大きな恩恵を受けます：

```ruby
# 以前：繰り返されるユニオン型
def process(value: String | Integer | Float): String
  # ...
end

def format(value: String | Integer | Float): String
  # ...
end

# 以後：明確なエイリアス
type Primitive = String | Integer | Float

def process(value: Primitive): String
  # ...
end

def format(value: Primitive): String
  # ...
end

# さらなる例
type ID = Integer | String
type JSONValue = String | Integer | Float | Bool | nil
type Result = :success | :error | :pending
```

### コレクションエイリアス

複雑なコレクション型をより読みやすくします：

```ruby
# 配列エイリアス
type StringList = Array<String>
type NumberList = Array<Integer>
type UserList = Array<User>

# ハッシュエイリアス
type StringMap = Hash<String, String>
type Configuration = Hash<Symbol, String | Integer>
type Cache = Hash<String, Any>

# ネストしたコレクション
type Matrix = Array<Array<Integer>>
type TagMap = Hash<String, Array<String>>
type UsersByAge = Hash<Integer, Array<User>>

# コレクションエイリアスの使用
users: UserList = []
config: Configuration = {
  port: 3000,
  host: "localhost",
  debug: true
}

tags: TagMap = {
  "ruby" => ["language", "dynamic"],
  "rails" => ["framework", "web"]
}
```

## ジェネリック型エイリアス

型エイリアス自体がジェネリックになり、型パラメータを受け取ることができます：

### 基本的なジェネリックエイリアス

```ruby
# ジェネリックResult型
type Result<T> = T | nil

# 使用法
user_result: Result<User> = find_user(123)
count_result: Result<Integer> = count_records()

# ジェネリックコールバック型
type Callback<T> = Proc<T, void>

# 使用法
on_user_load: Callback<User> = ->(user: User): void { puts user.name }
on_count: Callback<Integer> = ->(count: Integer): void { puts count }

# ジェネリックペア型
type Pair<A, B> = Array<A | B>  # 例のために簡略化

# 使用法
name_age: Pair<String, Integer> = ["Alice", 30]
```

### 複雑なジェネリックエイリアス

```ruby
# メタデータ付きジェネリックコレクション
type Collection<T> = Hash<Symbol, T | Integer | String>

# 使用法
user_collection: Collection<User> = {
  data: User.new("Alice"),
  count: 1,
  status: "active"
}

# ジェネリック変換関数型
type Transformer<T, U> = Proc<T, U>

# 使用法
to_string: Transformer<Integer, String> = ->(n: Integer): String { n.to_s }
to_length: Transformer<String, Integer> = ->(s: String): Integer { s.length }

# ジェネリックバリデータ型
type Validator<T> = Proc<T, Bool>

# 使用法
positive_validator: Validator<Integer> = ->(n: Integer): Bool { n > 0 }
email_validator: Validator<String> = ->(s: String): Bool { s.include?("@") }
```

### 部分適用ジェネリックエイリアス

一部の型パラメータを固定し、他を開いたままにしたエイリアスを作成できます：

```ruby
# 基本ジェネリック型
type Response<T, E> = { success: Bool, data: T | nil, error: E | nil }

# 部分適用 - エラー型を固定
type APIResponse<T> = Response<T, String>

# 使用法
user_response: APIResponse<User> = {
  success: true,
  data: User.new("Alice"),
  error: nil
}

product_response: APIResponse<Product> = {
  success: false,
  data: nil,
  error: "Product not found"
}

# 別の例
type StringMap<V> = Hash<String, V>

# 使用法
string_to_int: StringMap<Integer> = { "one" => 1, "two" => 2 }
string_to_user: StringMap<User> = { "admin" => User.new("Admin") }
```

## 実用的な型エイリアス

### ドメイン固有の型

```ruby
# Eコマースドメイン
type ProductId = Integer
type OrderId = String
type CustomerId = Integer
type Price = Float
type Quantity = Integer

type Product = Hash<Symbol, ProductId | String | Price>
type OrderItem = Hash<Symbol, ProductId | Quantity | Price>
type Order = Hash<Symbol, OrderId | CustomerId | Array<OrderItem> | String>

# ドメイン型の使用
def create_order(customer_id: CustomerId, items: Array<OrderItem>): Order
  {
    id: generate_order_id(),
    customer_id: customer_id,
    items: items,
    status: "pending"
  }
end

def calculate_total(items: Array<OrderItem>): Price
  items.reduce(0.0) { |sum, item| sum + item[:price] * item[:quantity] }
end
```

### ステータスと状態型

```ruby
# アプリケーションステータス
type Status = :pending | :processing | :completed | :failed
type UserRole = :admin | :editor | :viewer
type Environment = :development | :staging | :production

# HTTP関連型
type HTTPMethod = :get | :post | :put | :patch | :delete
type HTTPStatus = Integer  # より具体的にできる: 200 | 404 | 500 など
type Headers = Hash<String, String>

# 状態型の使用
class Request
  @method: HTTPMethod
  @path: String
  @headers: Headers
  @status: Status

  def initialize(method: HTTPMethod, path: String): void
    @method = method
    @path = path
    @headers = {}
    @status = :pending
  end

  def add_header(key: String, value: String): void
    @headers[key] = value
  end

  def status: Status
    @status
  end
end
```

### JSONとAPI型

```ruby
# JSON型
type JSONPrimitive = String | Integer | Float | Bool | nil
type JSONArray = Array<JSONValue>
type JSONObject = Hash<String, JSONValue>
type JSONValue = JSONPrimitive | JSONArray | JSONObject

# APIレスポンス型
type APIError = Hash<Symbol, String | Integer>
type APISuccess<T> = Hash<Symbol, Bool | T>
type APIResult<T> = APISuccess<T> | APIError

# JSON型の使用
def parse_config(json: String): JSONObject
  # JSON文字列をオブジェクトにパース
  JSON.parse(json)
end

def api_call<T>(endpoint: String): APIResult<T>
  begin
    data = fetch(endpoint)
    { success: true, data: data }
  rescue => e
    { success: false, error: e.message, code: 500 }
  end
end
```

### 関数型

```ruby
# 一般的な関数シグネチャ
type Predicate<T> = Proc<T, Bool>
type Mapper<T, U> = Proc<T, U>
type Consumer<T> = Proc<T, void>
type Supplier<T> = Proc<T>
type Comparator<T> = Proc<T, T, Integer>

# 関数型の使用
def filter<T>(array: Array<T>, predicate: Predicate<T>): Array<T>
  array.select { |item| predicate.call(item) }
end

def map<T, U>(array: Array<T>, mapper: Mapper<T, U>): Array<U>
  array.map { |item| mapper.call(item) }
end

def for_each<T>(array: Array<T>, consumer: Consumer<T>): void
  array.each { |item| consumer.call(item) }
end

# 使用法
numbers = [1, 2, 3, 4, 5]
is_even: Predicate<Integer> = ->(n: Integer): Bool { n.even? }
evens = filter(numbers, is_even)  # [2, 4]

to_string: Mapper<Integer, String> = ->(n: Integer): String { n.to_s }
strings = map(numbers, to_string)  # ["1", "2", "3", "4", "5"]

print_it: Consumer<Integer> = ->(n: Integer): void { puts n }
for_each(numbers, print_it)
```

## 型エイリアスの構成

より単純なエイリアスから複雑な型エイリアスを構築できます：

```ruby
# 基本型
type UserId = Integer
type Username = String
type Email = String
type Timestamp = Integer

# 構成された型
type UserIdentifier = UserId | Username | Email
type UserMetadata = Hash<Symbol, String | Timestamp>
type UserData = Hash<Symbol, UserIdentifier | String | Timestamp>

# 部分から構成された完全なユーザー型
type User = {
  id: UserId,
  username: Username,
  email: Email,
  metadata: UserMetadata
}

# 別の例：複雑さの増加
type Coordinate = Float
type Point = Array<Coordinate>  # [x, y]
type Line = Array<Point>        # [point1, point2]
type Polygon = Array<Point>     # [point1, point2, point3, ...]
type Shape = Point | Line | Polygon
type DrawingLayer = Array<Shape>
type Drawing = Hash<String, DrawingLayer>
```

## 再帰型エイリアス

:::caution 準備中
この機能は将来のリリースで計画されています。
:::

将来、T-Rubyはツリー構造と連結リストのための再帰型エイリアスをサポートする予定です：

```ruby
# ツリー構造
type TreeNode<T> = {
  value: T,
  children: Array<TreeNode<T>>
}

# 連結リスト
type ListNode<T> = {
  value: T,
  next: ListNode<T> | nil
}

# JSON（完全再帰）
type JSONValue =
  | String
  | Integer
  | Float
  | Bool
  | nil
  | Array<JSONValue>
  | Hash<String, JSONValue>
```

## ベストプラクティス

### 1. 説明的な名前を使用

```ruby
# 良い：明確で説明的な名前
type EmailAddress = String
type ProductPrice = Float
type UserRole = :admin | :editor | :viewer

# あまり良くない：不明確な省略
type EA = String
type PP = Float
type UR = :admin | :editor | :viewer
```

### 2. 関連するエイリアスをグループ化

```ruby
# 良い：ドメインごとに整理
# ユーザー関連型
type UserId = Integer
type Username = String
type UserEmail = String
type UserData = Hash<Symbol, String | Integer>

# 製品関連型
type ProductId = Integer
type ProductName = String
type ProductPrice = Float
type ProductData = Hash<Symbol, String | Integer | Float>
```

### 3. 複雑な型にエイリアスを使用

```ruby
# 良い：複数回使用される複雑な型にエイリアス
type QueryResult = Hash<Symbol, Array<Hash<String, String | Integer>> | Integer>

def execute_query(sql: String): QueryResult
  # ...
end

def cache_result(key: String, result: QueryResult): void
  # ...
end

# あまり良くない：複雑な型の繰り返し
def execute_query(sql: String): Hash<Symbol, Array<Hash<String, String | Integer>> | Integer>
  # ...
end
```

### 4. シンプルな型に過度なエイリアスを使わない

```ruby
# 不要：Stringはすでに明確
type S = String
type N = Integer

# 良い：意味を追加する場合のみエイリアス
type EmailAddress = String  # 意味的な意味を追加
type UserId = Integer       # 目的を明確化
```

## 型エイリアス vs クラス

型エイリアスは新しい型を作成しません—代替名にすぎません。これはクラスとは異なります：

```ruby
# 型エイリアス - 単なる名前
type UserId = Integer

# 両方とも同じ型
id1: UserId = 123
id2: Integer = 456
id1 = id2  # OK - 同じ型

# クラス - 新しい型を作成
class UserIdClass
  @value: Integer

  def initialize(value: Integer): void
    @value = value
  end
end

# 異なる型
user_id: UserIdClass = UserIdClass.new(123)
int_id: Integer = 456
# user_id = int_id  # エラー：異なる型！
```

### それぞれをいつ使うか

```ruby
# 型エイリアスを使用：
# - 意味的な明確性が必要だが同じ基本的な動作を望む場合
# - 複雑な型表現を簡略化したい場合
type EmailAddress = String
type JSONData = Hash<String, Any>

# クラスを使用：
# - 異なる動作を持つ別個の型が必要な場合
# - カプセル化とメソッドが必要な場合
# - ランタイム型チェックが必要な場合
class Email
  @address: String

  def initialize(address: String): void
    raise "Invalid email" unless address.include?("@")
    @address = address
  end

  def domain: String
    @address.split("@").last
  end
end
```

## 一般的なパターン

### オプショナル型

```ruby
# オプショナル/ナラブル型エイリアス
type Optional<T> = T | nil
type Nullable<T> = T | nil

# 使用法
user: Optional<User> = find_user(123)
name: Nullable<String> = user&.name
```

### 結果型

```ruby
# 失敗する可能性のある操作のための結果型
type Result<T, E> = { success: Bool, value: T | nil, error: E | nil }
type SimpleResult<T> = T | Error

# 使用法
def divide(a: Float, b: Float): Result<Float, String>
  if b == 0
    { success: false, value: nil, error: "Division by zero" }
  else
    { success: true, value: a / b, error: nil }
  end
end
```

### ビルダー型

```ruby
# 設定ビルダー
type Config = Hash<Symbol, String | Integer | Bool>
type ConfigBuilder = Proc<Config, Config>

# 使用法
def configure(&block: ConfigBuilder): Config
  config = {
    port: 3000,
    host: "localhost",
    debug: false
  }
  block.call(config)
end
```

## 型エイリアスによる文書化

型エイリアスはインライン文書化の役割を果たします：

```ruby
# エイリアス名が型が表すものを文書化
type PositiveInteger = Integer  # > 0であるべき
type NonEmptyString = String    # 空であってはならない
type Percentage = Float         # 0.0から100.0であるべき

def calculate_discount(price: Float, discount: Percentage): Float
  price * (1.0 - discount / 100.0)
end

def repeat(text: NonEmptyString, times: PositiveInteger): String
  text * times
end
```

## 次のステップ

型エイリアスを理解したので、次を探索してください：

- [交差型](/docs/learn/advanced/intersection-types)で複数の型を結合
- [ユニオン型](/docs/learn/everyday-types/union-types)で二者択一の型関係
- [ユーティリティ型](/docs/learn/advanced/utility-types)で高度な型変換
