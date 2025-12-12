---
sidebar_position: 1
title: 型アノテーション
description: T-Rubyにおける型アノテーションの基本を学ぶ
---

<DocsBadge />


# 型アノテーション

型アノテーションはT-Rubyの型システムの基盤です。変数、メソッドパラメータ、戻り値の型を明示的に宣言できます。この章では、Rubyコードに型情報を追加する構文とベストプラクティスを学びます。

## 型アノテーションとは？

型アノテーションは、変数、パラメータ、または戻り値がどのような型のデータであるべきかをT-Rubyに伝える特別な構文です。データがプログラム内で期待通りに流れることを保証し、バグを早期に発見するのに役立ちます。

T-Rubyでは、型アノテーションはコロン（`:`）の後に型名を使用します：

```trb title="hello.trb"
# 型アノテーション付き変数
name: String = "Alice"

# 型アノテーション付きメソッドパラメータ
def greet(person: String)
  puts "Hello, #{person}!"
end

# 戻り値型アノテーション付きメソッド
def get_age(): Integer
  25
end
```

T-Rubyがこのコードをトランスパイルすると、型アノテーションが削除され、純粋なRubyが残ります：

```ruby title="hello.rb"
# 型アノテーションが削除された変数
name = "Alice"

# 型アノテーションなしのメソッドパラメータ
def greet(person)
  puts "Hello, #{person}!"
end

# 戻り値型アノテーションなしのメソッド
def get_age()
  25
end
```

## 変数の型アノテーション

変数を宣言するときにアノテーションを追加できます。構文は：

```trb
variable_name: Type = value
```

### 基本例

```trb title="variables.trb"
# String変数
message: String = "Hello, world!"

# Integer変数
count: Integer = 42

# Float変数
price: Float = 19.99

# Boolean変数
is_active: Bool = true
```

### なぜ変数にアノテーションを付けるのか？

変数の型アノテーションはいくつかの目的を果たします：

1. **ドキュメント**：変数がどの型のデータを保持すべきかを明確にする
2. **エラー検出**：T-Rubyがトランスパイル時に型の不一致を検出
3. **IDEサポート**：エディタがより良い自動補完とヒントを提供

```trb title="error_example.trb"
# これは型エラーを引き起こす
age: Integer = "twenty-five"  # エラー: Integer変数にStringを代入

# これが正しい
age: Integer = 25
```

## メソッドパラメータのアノテーション

メソッドが受け入れる引数の型を指定するために、パラメータにアノテーションを付ける必要があります：

```trb title="parameters.trb"
def calculate_total(price: Float, quantity: Integer): Float
  price * quantity
end

# メソッドの呼び出し
total = calculate_total(9.99, 3)  # 29.97を返す
```

### 複数のパラメータ

メソッドに複数のパラメータがある場合、それぞれにアノテーションを付けます：

```trb title="multiple_params.trb"
def create_user(name: String, age: Integer, email: String)
  {
    name: name,
    age: age,
    email: email
  }
end

user = create_user("Alice", 30, "alice@example.com")
```

### デフォルト値付きオプショナルパラメータ

型アノテーションをデフォルト値と組み合わせることができます：

```trb title="defaults.trb"
def greet(name: String, greeting: String = "Hello")
  "#{greeting}, #{name}!"
end

puts greet("Alice")              # "Hello, Alice!"
puts greet("Bob", "Hi")          # "Hi, Bob!"
```

## 戻り値型アノテーション

戻り値型アノテーションは、メソッドが返す型を指定します。パラメータリストの後、メソッド本体の前に来ます：

```trb title="return_types.trb"
# Stringを返す
def get_name(): String
  "Alice"
end

# Integerを返す
def get_age(): Integer
  25
end

# Booleanを返す
def is_adult?(age: Integer): Bool
  age >= 18
end

# nilを返す（副作用メソッドに便利）
def log_message(msg: String): nil
  puts msg
  nil
end
```

### 戻り値型が重要な理由

戻り値型アノテーションは、メソッドが常に期待される型を返すことを保証してエラーを防ぎます：

```trb title="return_safety.trb"
def divide(a: Integer, b: Integer): Float
  return 0.0 if b == 0  # 安全なデフォルト
  a.to_f / b
end

# T-RubyはこれがFloatを返すことを知っている
result: Float = divide(10, 3)
```

## 完全なメソッド例

すべてのアノテーションタイプを一緒に示す包括的な例：

```trb title="complete_example.trb"
# パラメータと戻り値型アノテーション付きメソッド
def calculate_discount(
  original_price: Float,
  discount_percent: Integer,
  is_member: Bool = false
): Float
  discount = original_price * (discount_percent / 100.0)

  # メンバーは追加5%オフ
  if is_member
    discount += original_price * 0.05
  end

  original_price - discount
end

# メソッドの使用
regular_price: Float = calculate_discount(100.0, 10)
# 90.0を返す

member_price: Float = calculate_discount(100.0, 10, true)
# 85.0を返す
```

これはクリーンなRubyにトランスパイルされます：

```ruby title="complete_example.rb"
def calculate_discount(
  original_price,
  discount_percent,
  is_member = false
)
  discount = original_price * (discount_percent / 100.0)

  if is_member
    discount += original_price * 0.05
  end

  original_price - discount
end

regular_price = calculate_discount(100.0, 10)
member_price = calculate_discount(100.0, 10, true)
```

## ブロックパラメータのアノテーション

ブロックパラメータにもアノテーションを付けることができます：

```trb title="blocks.trb"
def process_numbers(numbers: Array<Integer>)
  numbers.map do |n: Integer|
    n * 2
  end
end

result = process_numbers([1, 2, 3])
# [2, 4, 6]を返す
```

## インスタンス変数

クラスのインスタンス変数にもアノテーションを付けることができます：

```trb title="instance_vars.trb"
class Person
  def initialize(name: String, age: Integer)
    @name: String = name
    @age: Integer = age
  end

  def introduce(): String
    "私は#{@name}で、#{@age}歳です"
  end
end

person = Person.new("Alice", 30)
puts person.introduce()
# 出力: "私はAliceで、30歳です"
```

## 一般的な落とし穴

### 過剰なアノテーションを避ける

すべての変数にアノテーションを付ける必要はありません。T-Rubyには型推論があります（次の章で説明）。明確さを追加する場合にのみアノテーションを付けてください：

```trb title="over_annotation.trb"
# 過剰なアノテーション
x: Integer = 5
y: Integer = 10
sum: Integer = x + y

# より良い - 推論に任せる
x = 5
y = 10
sum: Integer = x + y  # 必要な場合のみ結果にアノテーション
```

### 戻り値型の一貫性

メソッドが条件に基づいて異なる型を返す可能性がある場合、union型を使用してください（後で説明）：

```trb title="inconsistent_return.trb"
# これはエラーを引き起こす - 一貫性のない戻り値
def get_value(flag: Bool): String
  if flag
    return "yes"
  else
    return 42  # エラー: IntegerはString戻り値型と一致しない
  end
end
```

### Nil値を忘れない

メソッドが`nil`を返す可能性がある場合、戻り値型に含めてください：

```trb title="nil_returns.trb"
# 正しい - nil可能性を含む
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# これはnilかもしれない！
user = find_user(-1)
```

## ベストプラクティス

1. **常にメソッドパラメータと戻り値型にアノテーション** - これらは公開契約です
2. **型が明らかでないときは変数にアノテーション** - 読者がコードを理解するのを助ける
3. **ローカル変数には型推論を使用** - 型が明確なときは冗長さを減らす
4. **パブリックAPIでは明示的に** - ライブラリとモジュールのインターフェースは完全にアノテーションされるべき
5. **アノテーションをドキュメントとして考える** - コードを理解しやすくするべき

## まとめ

T-Rubyの型アノテーションは、コロン構文を使用して型を指定します：

- 変数: `name: String = "Alice"`
- パラメータ: `def greet(person: String)`
- 戻り値型: `def get_age(): Integer`
- インスタンス変数: `@name: String = name`

アノテーションは安全性、ドキュメント、より良いツールサポートを提供し、トランスパイル中に完全に削除されてクリーンなRubyコードを生成します。

次の章では、T-Rubyで利用可能な基本型について学びます。
