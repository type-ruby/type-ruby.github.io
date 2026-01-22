---
sidebar_position: 3
title: ブロック、Proc & ラムダ
description: ブロック、proc、ラムダ式の型付け
---

<DocsBadge />


# ブロック、Proc & ラムダ

ブロック、proc、ラムダは、実行可能なコードを渡すことができるRubyの重要な機能です。T-Rubyは、Rubyの柔軟性を保ちながら型安全性を保証する強力な型システムをこれらの構造に提供します。

## 違いを理解する

型付けに入る前に、3つの概念を明確にしましょう：

- **ブロック**: メソッドに渡される匿名コード（オブジェクトではない）
- **Proc**: オブジェクトでラップされたブロック
- **ラムダ**: 異なる引数処理を持つより厳密な形式のProc

```trb title="basics.trb"
# ブロック - do...end または {...} で渡す
[1, 2, 3].each do |n|
  puts n
end

# Proc - Proc.new で作成
my_proc: Proc<Integer, void> = Proc.new { |n| puts n }
my_proc.call(5)

# ラムダ - -> で作成
my_lambda: Proc<Integer, void> = ->(n: Integer) { puts n }
my_lambda.call(10)
```

## ブロックの型付け

ブロックを受け取るメソッドは `&block` パラメータを使用します。`Proc` で型を指定します：

```trb title="block_params.trb"
def each_number(&block: Proc<Integer, void>): void
  [1, 2, 3].each do |n|
    block.call(n)
  end
end

def transform_strings(&block: Proc<String, String>): String[]
  ["hello", "world"].map do |str|
    block.call(str)
  end
end

# メソッドの使用
each_number { |n| puts n * 2 }

result = transform_strings { |s| s.upcase }
# result: ["HELLO", "WORLD"]
```

`Proc<Input, Output>` 構文は以下を指定します：
- **最初の型**: ブロックパラメータの型
- **2番目の型**: ブロックの戻り値の型

## 複数のブロックパラメータ

ブロックは複数のパラメータを取ることができます：

```trb title="multiple_params.trb"
def each_pair(&block: Proc<[String, Integer], void>): void
  pairs = [["Alice", 30], ["Bob", 25], ["Charlie", 35]]
  pairs.each do |name, age|
    block.call(name, age)
  end
end

def transform_hash(&block: Proc<[String, Integer], String>): String[]
  { "a" => 1, "b" => 2, "c" => 3 }.map do |key, value|
    block.call(key, value)
  end
end

# 複数パラメータの使用
each_pair do |name, age|
  puts "#{name} is #{age} years old"
end

results = transform_hash { |k, v| "#{k}=#{v}" }
# results: ["a=1", "b=2", "c=3"]
```

複数のブロックパラメータにはタプル構文 `[Type1, Type2]` を使用します。

## オプショナルブロック

一部のメソッドはブロックの有無にかかわらず動作できます：

```trb title="optional_blocks.trb"
def process_items(items: Integer[], &block: Proc<Integer, Integer>?): Integer[]
  if block
    items.map { |item| block.call(item) }
  else
    items  # 変更なしでitemsを返す
  end
end

# ブロックあり
doubled = process_items([1, 2, 3]) { |n| n * 2 }
# doubled: [2, 4, 6]

# ブロックなし
unchanged = process_items([1, 2, 3])
# unchanged: [1, 2, 3]
```

`?` はブロックをオプショナル（nilable）にします。

## Proc型

Procは保存して渡すことができるファーストクラスオブジェクトです：

```trb title="procs.trb"
# proc型の定義
adder: Proc<Integer, Integer> = Proc.new { |n| n + 10 }
greeter: Proc<String, String> = Proc.new { |name| "Hello, #{name}!" }
validator: Proc<String, Boolean> = Proc.new { |email| email.include?("@") }

# procの使用
result1 = adder.call(5)        # 15
result2 = greeter.call("Alice") # "Hello, Alice!"
result3 = validator.call("test@example.com")  # true

# Procはメソッドに渡せる
def apply_to_all(numbers: Integer[], operation: Proc<Integer, Integer>): Integer[]
  numbers.map { |n| operation.call(n) }
end

doubled = apply_to_all([1, 2, 3], Proc.new { |n| n * 2 })
# doubled: [2, 4, 6]
```

## ラムダ型

ラムダはProcと同じ型シグネチャを持ちます：

```trb title="lambdas.trb"
# 型アノテーション付きラムダ
add_ten: Proc<Integer, Integer> = ->(n: Integer) { n + 10 }
multiply: Proc<[Integer, Integer], Integer> = ->(a: Integer, b: Integer) { a * b }
format_user: Proc<User, String> = ->(user: User) { "#{user.name} (#{user.email})" }

# ラムダの使用
sum = add_ten.call(5)              # 15
product = multiply.call(3, 4)       # 12
formatted = format_user.call(user)  # "Alice (alice@example.com)"

# ラムダはメソッドに渡せる
def filter_users(users: User[], predicate: Proc<User, Boolean>): User[]
  users.select { |user| predicate.call(user) }
end

is_admin: Proc<User, Boolean> = ->(user: User) { user.role == "admin" }
admins = filter_users(all_users, is_admin)
```

## 高階関数

procやラムダを返す関数：

```trb title="higher_order.trb"
def create_multiplier(factor: Integer): Proc<Integer, Integer>
  ->(n: Integer) { n * factor }
end

def create_formatter(prefix: String): Proc<String, String>
  ->(text: String) { "#{prefix}: #{text}" }
end

def create_validator(min_length: Integer): Proc<String, Boolean>
  ->(text: String) { text.length >= min_length }
end

# 高階関数の使用
times_three = create_multiplier(3)
times_three.call(4)  # 12

error_formatter = create_formatter("ERROR")
error_formatter.call("File not found")  # "ERROR: File not found"

password_validator = create_validator(8)
password_validator.call("secret")   # false
password_validator.call("secret123") # true
```

## パラメータなしのブロック

一部のブロックはパラメータを取りません：

```trb title="no_params.trb"
def execute(&block: Proc<[], void>): void
  puts "Before execution"
  block.call
  puts "After execution"
end

def run_if_true(condition: Boolean, &block: Proc<[], String>): String?
  if condition
    block.call
  else
    nil
  end
end

# パラメータなしのブロックの使用
execute do
  puts "Executing task"
end

result = run_if_true(true) do
  "Task completed"
end
```

パラメータを取らないブロックには `Proc<[], ReturnType>` を使用します。

## ジェネリックブロック

ブロックは型情報を保持するためにジェネリックにできます：

```trb title="generic_blocks.trb"
def map<T, U>(array: T[], &block: Proc<T, U>): U[]
  array.map { |item| block.call(item) }
end

def filter<T>(array: T[], &block: Proc<T, Boolean>): T[]
  array.select { |item| block.call(item) }
end

def reduce<T, U>(array: T[], initial: U, &block: Proc<[U, T], U>): U
  array.reduce(initial) { |acc, item| block.call(acc, item) }
end

# ジェネリックブロックを通じて型が保持される
numbers = [1, 2, 3, 4, 5]
strings = map(numbers) { |n| n.to_s }  # String[]
evens = filter(numbers) { |n| n.even? }  # Integer[]
sum = reduce(numbers, 0) { |acc, n| acc + n }  # Integer
```

## 実践例: イベントハンドラ

イベント処理にブロックを使用する実際の例です：

```trb title="event_handler.trb"
class EventEmitter<T>
  def initialize()
    @listeners: Proc<T, void>[] = []
  end

  def on(&listener: Proc<T, void>): void
    @listeners.push(listener)
  end

  def emit(event: T): void
    @listeners.each { |listener| listener.call(event) }
  end

  def remove(&listener: Proc<T, void>): void
    @listeners.delete(listener)
  end
end

# イベントエミッターの使用
class UserEvent
  attr_accessor :type: String
  attr_accessor :user: User

  def initialize(type: String, user: User)
    @type = type
    @user = user
  end
end

user_events = EventEmitter<UserEvent>.new

# イベントハンドラの登録
user_events.on do |event|
  puts "User event: #{event.type} for #{event.user.name}"
end

user_events.on do |event|
  if event.type == "login"
    log_login(event.user)
  end
end

# イベントの発火
user_events.emit(UserEvent.new("login", current_user))
user_events.emit(UserEvent.new("logout", current_user))
```

## 実践例: ミドルウェアパターン

ミドルウェアチェーンにprocを使用する例：

```trb title="middleware.trb"
class Request
  attr_accessor :path: String
  attr_accessor :params: Hash<String, String>

  def initialize(path: String, params: Hash<String, String>)
    @path = path
    @params = params
  end
end

class Response
  attr_accessor :status: Integer
  attr_accessor :body: String

  def initialize(status: Integer, body: String)
    @status = status
    @body = body
  end
end

type Middleware = Proc<[Request, Proc<Request, Response>], Response>

class MiddlewareStack
  def initialize()
    @middlewares: Middleware[] = []
  end

  def use(middleware: Middleware): void
    @middlewares.push(middleware)
  end

  def execute(request: Request, handler: Proc<Request, Response>): Response
    chain = @middlewares.reverse.reduce(handler) do |next_handler, middleware|
      ->(req: Request) { middleware.call(req, next_handler) }
    end
    chain.call(request)
  end
end

# ミドルウェアの定義
logging_middleware: Middleware = ->(req: Request, next_handler: Proc<Request, Response>) {
  puts "Request: #{req.path}"
  response = next_handler.call(req)
  puts "Response: #{response.status}"
  response
}

auth_middleware: Middleware = ->(req: Request, next_handler: Proc<Request, Response>) {
  if req.params["token"]
    next_handler.call(req)
  else
    Response.new(401, "Unauthorized")
  end
}

# ミドルウェアスタックの使用
stack = MiddlewareStack.new
stack.use(logging_middleware)
stack.use(auth_middleware)

handler: Proc<Request, Response> = ->(req: Request) {
  Response.new(200, "Hello, World!")
}

request = Request.new("/api/users", { "token" => "abc123" })
response = stack.execute(request, handler)
```

## 実践例: 関数型操作

関数型ユーティリティライブラリの構築：

```trb title="functional.trb"
module Functional
  def self.compose<A, B, C>(
    f: Proc<B, C>,
    g: Proc<A, B>
  ): Proc<A, C>
    ->(x: A) { f.call(g.call(x)) }
  end

  def self.curry<A, B, C>(
    f: Proc<[A, B], C>
  ): Proc<A, Proc<B, C>>
    ->(a: A) { ->(b: B) { f.call(a, b) } }
  end

  def self.memoize<T, U>(f: Proc<T, U>): Proc<T, U>
    cache: Hash<T, U> = {}
    ->(arg: T) {
      if cache.key?(arg)
        cache[arg]
      else
        result = f.call(arg)
        cache[arg] = result
        result
      end
    }
  end
end

# 関数型操作の使用
add_one: Proc<Integer, Integer> = ->(n: Integer) { n + 1 }
multiply_two: Proc<Integer, Integer> = ->(n: Integer) { n * 2 }

# 関数の合成
add_then_multiply = Functional.compose(multiply_two, add_one)
add_then_multiply.call(5)  # (5 + 1) * 2 = 12

# 関数のカリー化
multiply: Proc<[Integer, Integer], Integer> = ->(a: Integer, b: Integer) { a * b }
curried_multiply = Functional.curry(multiply)
times_three = curried_multiply.call(3)
times_three.call(4)  # 12

# 高コストな操作のメモ化
expensive: Proc<Integer, Integer> = ->(n: Integer) {
  puts "Computing..."
  n * n
}
memoized = Functional.memoize(expensive)
memoized.call(5)  # "Computing..."を出力し、25を返す
memoized.call(5)  # 即座に25を返す（キャッシュ済み）
```

## ブロックの戻り値の型

ブロックが何を返すかを具体的に指定します：

```trb title="block_returns.trb"
# ブロックが値を返す
def sum_transformed(numbers: Integer[], &block: Proc<Integer, Integer>): Integer
  numbers.map { |n| block.call(n) }.sum
end

# ブロックが何も返さない (void)
def each_with_index(&block: Proc<[String, Integer], void>): void
  ["a", "b", "c"].each_with_index do |item, index|
    block.call(item, index)
  end
end

# ブロックがbooleanを返す（フィルタリング用）
def custom_select(items: String[], &predicate: Proc<String, Boolean>): String[]
  items.select { |item| predicate.call(item) }
end

# 異なる戻り値の型の使用
total = sum_transformed([1, 2, 3]) { |n| n * n }  # 1 + 4 + 9 = 14

each_with_index { |item, idx| puts "#{idx}: #{item}" }

long_strings = custom_select(["hi", "hello", "hey"]) { |s| s.length > 2 }
# long_strings: ["hello"]
```

## ベストプラクティス

1. **ブロック型を明示的に指定する**: 常にブロックパラメータに期待される型をアノテーションしてください。

2. **厳密な引数チェックにはラムダを使用する**: ラムダは引数の数を強制し、Procはより寛容です。

3. **再利用性のためにジェネリックブロックを優先する**: ジェネリックブロックは型安全性を維持しながらどの型でも動作します。

4. **保存されるブロックにはProc型を使用する**: 変数やインスタンス変数にブロックを保存する場合、Proc型を使用してください。

5. **複雑なブロックシグネチャを文書化する**: ブロックが多くのパラメータを取る場合や複雑な型を持つ場合、コメントを追加してください。

6. **副作用ブロックにはvoidを使用する**: ブロックが副作用のみに使用される場合、戻り値の型をvoidとしてマークしてください。

## 一般的なパターン

### コールバックパターン

```trb title="callbacks.trb"
def fetch_data(url: String, on_success: Proc<String, void>, on_error: Proc<String, void>): void
  begin
    data = HTTP.get(url)
    on_success.call(data)
  rescue => e
    on_error.call(e.message)
  end
end

fetch_data(
  "https://api.example.com/data",
  ->(data: String) { puts "Success: #{data}" },
  ->(error: String) { puts "Error: #{error}" }
)
```

### ブロックを使用したビルダーパターン

```trb title="builder_block.trb"
class QueryBuilder
  def initialize()
    @conditions: String[] = []
  end

  def where(&block: Proc<QueryBuilder, void>): QueryBuilder
    block.call(self)
    self
  end

  def equals(field: String, value: String): void
    @conditions.push("#{field} = '#{value}'")
  end

  def build(): String
    "SELECT * FROM users WHERE #{@conditions.join(' AND ')}"
  end
end

query = QueryBuilder.new
query.where do |q|
  q.equals("name", "Alice")
  q.equals("active", "true")
end.build()
```

### イテレータパターン

```trb title="iterator.trb"
def times(n: Integer, &block: Proc<Integer, void>): void
  (0...n).each { |i| block.call(i) }
end

def until_true(&block: Proc<Integer, Boolean>): Integer
  i = 0
  while !block.call(i)
    i += 1
  end
  i
end

times(5) { |i| puts "Iteration #{i}" }

result = until_true { |i| i > 10 }  # 11
```

## まとめ

T-Rubyのブロック、Proc、ラムダは、型安全性を維持しながら強力な抽象化を提供します：

- **ブロック**は `&block: Proc<Input, Output>` で型付けします
- **複数パラメータ**はタプル構文を使用します: `Proc<[Type1, Type2], Output>`
- **オプショナルブロック**は `Proc<Input, Output>?` を使用します
- **ジェネリックブロック**はジェネリックパラメータを通じて型情報を保持します
- **高階関数**は型付きprocを作成して返すことができます

適切な型アノテーションにより、静的型付けの安全性とともにRubyブロックのすべての柔軟性を得ることができます。
