---
sidebar_position: 3
title: 型推論
description: T-Rubyが自動的に型を推論する方法
---

# 型推論

T-Rubyの最も強力な機能の1つは型推論です。型システムは、すべての場所で明示的なアノテーションを必要とせずに、変数や式の型を自動的に判断できます。この章では、型推論がどのように機能し、いつそれに頼るべきかを学びます。

## 型推論とは？

型推論は、T-Rubyの型チェッカーが、割り当てられた値や使用されるコンテキストに基づいて、変数や式の型を自動的に推論する能力です。これは、常に型アノテーションを書く必要がないことを意味します。

### 基本的な推論例

```ruby title="basic_inference.trb"
# T-RubyはnameがStringであることを推論
name = "Alice"

# T-RubyはcountがIntegerであることを推論
count = 42

# T-RubyはpriceがFloatであることを推論
price = 19.99

# T-RubyはactiveがBoolであることを推論
active = true
```

トランスパイルされたRubyは同じです：

```ruby title="basic_inference.rb"
name = "Alice"
count = 42
price = 19.99
active = true
```

## 型推論の仕組み

T-Rubyは割り当てられる値を調べ、リテラルから型を判断します：

### リテラルベースの推論

```ruby title="literals.trb"
# Stringリテラル → String型
greeting = "Hello"

# Integerリテラル → Integer型
age = 25

# Floatリテラル → Float型
temperature = 98.6

# Booleanリテラル → Bool型
is_valid = false

# Symbolリテラル → Symbol型
status = :active

# nilリテラル → nil型
nothing = nil
```

### 式ベースの推論

T-Rubyは式から型を推論できます：

```ruby title="expressions.trb"
x = 10
y = 20

# Integerとして推論（Integer + Integerの結果）
sum = x + y

# Stringとして推論（String + Stringの結果）
first_name = "Alice"
last_name = "Smith"
full_name = first_name + " " + last_name

# Floatとして推論（Integer.to_fの結果）
decimal = x.to_f
```

### メソッド戻り値型の推論

メソッドに戻り値型アノテーションがある場合、T-Rubyは結果の型を知っています：

```ruby title="method_returns.trb"
def get_name(): String
  "Alice"
end

# T-RubyはnameがStringであることを推論
name = get_name()

def calculate_total(items: Integer, price: Float): Float
  items * price
end

# T-RubyはtotalがFloatであることを推論
total = calculate_total(3, 9.99)
```

## 推論が最も効果的な場合

型推論は、明確な初期化を持つローカル変数に最も効果的です：

### ローカル変数

```ruby title="local_vars.trb"
def process_order(quantity: Integer, unit_price: Float)
  # これらの型はすべて推論される
  subtotal = quantity * unit_price
  tax_rate = 0.08
  tax = subtotal * tax_rate
  total = subtotal + tax

  {
    subtotal: subtotal,
    tax: tax,
    total: total
  }
end
```

この例でT-Rubyは以下を推論します：
- `subtotal`は`Float`（Integer * Float = Float）
- `tax_rate`は`Float`（0.08はfloatリテラル）
- `tax`は`Float`（Float * Float = Float）
- `total`は`Float`（Float + Float = Float）

### 配列とハッシュの推論

T-Rubyは配列とハッシュ要素の型を推論できます：

```ruby title="collections.trb"
# Array<Integer>として推論
numbers = [1, 2, 3, 4, 5]

# Array<String>として推論
names = ["Alice", "Bob", "Charlie"]

# Hash<Symbol, String>として推論
user = {
  name: "Alice",
  email: "alice@example.com"
}

# Hash<String, Integer>として推論
scores = {
  "math" => 95,
  "science" => 88
}
```

### ブロックパラメータの推論

T-Rubyは型付きコレクションを反復処理するときにブロックパラメータの型を推論できます：

```ruby title="blocks.trb"
def sum_numbers(numbers: Array<Integer>): Integer
  total = 0

  # T-RubyはnがIntegerであることを推論
  numbers.each do |n|
    total += n
  end

  total
end

def greet_all(names: Array<String>)
  # T-RubyはnameがStringであることを推論
  names.each do |name|
    puts "こんにちは、#{name}さん！"
  end
end
```

## 明示的アノテーションを追加すべき時

推論は強力ですが、明示的な型アノテーションを追加すべき場合があります：

### 1. メソッドシグネチャ（常に）

常にメソッドパラメータと戻り値型にアノテーションを付けてください：

```ruby title="method_sigs.trb"
# 良い - 明示的アノテーション
def calculate_discount(price: Float, percent: Integer): Float
  price * (percent / 100.0)
end

# 避けるべき - アノテーションなし（理解して使用するのが難しい）
def calculate_discount(price, percent)
  price * (percent / 100.0)
end
```

### 2. インスタンス変数

インスタンス変数は宣言時にアノテーションを付けるべきです：

```ruby title="instance_vars.trb"
class ShoppingCart
  def initialize()
    @items: Array<String> = []
    @total: Float = 0.0
  end

  def add_item(item: String, price: Float)
    @items << item
    @total += price
  end
end
```

### 3. 曖昧な状況

初期値から型が明確でない場合：

```ruby title="ambiguous.trb"
# 曖昧 - FloatかIntegerか？
result = 0  # Integerとして推論

# より良い - Floatが必要な場合は明示的に
result: Float = 0.0

# または一時的な値で始める場合
users: Array<String> = []  # 後でユーザー名を保持する
```

### 4. Union型

変数が異なる型を保持する可能性がある場合：

```ruby title="unions.trb"
# union型には明示的アノテーションが必要
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# 最初にnilの場合は明示的アノテーションが必要
current_user: String | nil = nil
```

### 5. パブリックAPI

パブリックメソッド、クラス、またはモジュールを定義する場合：

```ruby title="public_api.trb"
module MathHelpers
  # パブリックメソッド - 完全にアノテーション
  def self.calculate_average(numbers: Array<Float>): Float
    sum = numbers.reduce(0.0) { |acc, n| acc + n }
    sum / numbers.length
  end

  # パブリックメソッド - 完全にアノテーション
  def self.round_currency(amount: Float): String
    "$%.2f" % amount
  end
end
```

## 制御フローと推論

T-Rubyの推論は制御フロー構造を通して機能します：

### If文

```ruby title="if_statements.trb"
def categorize_age(age: Integer): String
  # categoryはすべてのブランチでStringとして推論
  if age < 13
    category = "子供"
  elsif age < 20
    category = "ティーンエイジャー"
  else
    category = "大人"
  end

  category
end
```

### Case文

```ruby title="case_statements.trb"
def get_day_type(day: Symbol): String
  # day_typeはStringとして推論
  day_type = case day
  when :monday, :tuesday, :wednesday, :thursday, :friday
    "平日"
  when :saturday, :sunday
    "週末"
  else
    "不明"
  end

  day_type
end
```

## 一般的な推論パターン

### パターン1：初期化して使用

```ruby title="pattern1.trb"
def process_names(raw_names: String): Array<String>
  # namesはArray<String>として推論
  names = raw_names.split(",")

  # cleanedはArray<String>として推論
  cleaned = names.map { |n| n.strip.downcase }

  cleaned
end
```

### パターン2：アキュムレータ変数

```ruby title="pattern2.trb"
def calculate_stats(numbers: Array<Integer>): Hash<Symbol, Float>
  # sumはIntegerとして推論（0から始まり、Integerを加算）
  sum = 0
  numbers.each { |n| sum += n }

  # avgはFloatとして推論（Integer.to_f）
  avg = sum.to_f / numbers.length

  { sum: sum.to_f, average: avg }
end
```

### パターン3：ビルダーパターン

```ruby title="pattern3.trb"
def build_query(table: String, conditions: Array<String>): String
  # queryはStringとして推論
  query = "SELECT * FROM #{table}"

  if conditions.length > 0
    # where_clauseはStringとして推論
    where_clause = conditions.join(" AND ")
    query += " WHERE #{where_clause}"
  end

  query
end
```

## 型推論の制限

T-Rubyが自動的に型を推論できない状況があります：

### 空のコレクション

```ruby title="empty_collections.trb"
# T-Rubyは空の配列から要素型を推論できない
items = []  # アノテーションが必要！

# より良い - 型をアノテーション
items: Array<String> = []

# または少なくとも1つの要素で初期化
items = ["first_item"]
```

### 複雑なUnion型

```ruby title="complex_unions.trb"
# T-Rubyはこれが複数の型を受け入れるべきことを推論できない
def process_value(value)  # アノテーションが必要！
  if value.is_a?(String)
    value.upcase
  elsif value.is_a?(Integer)
    value * 2
  end
end

# より良い - 明示的なunion型
def process_value(value: String | Integer): String | Integer
  if value.is_a?(String)
    value.upcase
  else
    value * 2
  end
end
```

### 再帰関数

```ruby title="recursive.trb"
# 再帰には戻り値型アノテーションが必要
def factorial(n: Integer): Integer
  return 1 if n <= 1
  n * factorial(n - 1)
end

def fibonacci(n: Integer): Integer
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end
```

## 型推論のベストプラクティス

### 1. ローカル変数は推論に任せる

```ruby title="locals.trb"
def calculate_discount(price: Float, rate: Float): Float
  # 推論に任せる - 型は明らか
  discount = price * rate
  final_price = price - discount

  final_price
end
```

### 2. スコープ間で共有する場合はアノテーション

```ruby title="shared_scope.trb"
class OrderProcessor
  def initialize()
    # アノテーション - メソッド間で共有
    @pending_orders: Array<String> = []
    @completed_count: Integer = 0
  end

  def add_order(order: String)
    @pending_orders << order
  end

  def complete_order()
    @pending_orders.shift
    @completed_count += 1
  end
end
```

### 3. 中間計算には推論を優先

```ruby title="intermediate.trb"
def calculate_compound_interest(
  principal: Float,
  rate: Float,
  years: Integer
): Float
  # すべての中間値は推論される
  rate_decimal = rate / 100.0
  multiplier = 1.0 + rate_decimal
  final_multiplier = multiplier ** years
  final_amount = principal * final_multiplier

  final_amount
end
```

### 4. 複雑なロジックでは明確さのためにアノテーション

```ruby title="clarity.trb"
def parse_config(raw: String): Hash<Symbol, String | Integer>
  # 明確さのために結果型をアノテーション
  config: Hash<Symbol, String | Integer> = {}

  raw.split("\n").each do |line|
    key, value = line.split("=")
    config[key.to_sym] = parse_value(value)
  end

  config
end

def parse_value(value: String): String | Integer
  integer_value = value.to_i
  if integer_value.to_s == value
    integer_value
  else
    value
  end
end
```

## まとめ

T-Rubyの型推論により、型安全性を維持しながらクリーンで簡潔なコードを書くことができます：

- **推論が機能する場所**：ローカル変数、リテラル、式
- **常にアノテーション**：メソッドシグネチャ、インスタンス変数、パブリックAPI
- **アノテーションを追加**：型が曖昧または複雑な場合
- **推論を信頼**：中間計算とローカル変数で
- **明示的な型を使用**：空のコレクションとunion型で

目標はバランスを取ることです：推論で冗長さを減らし、明確さと安全性を向上させる場所にアノテーションを追加してください。

次のセクションでは、T-Rubyで定期的に使用する配列、ハッシュ、union型などの日常的な型について学びます。
