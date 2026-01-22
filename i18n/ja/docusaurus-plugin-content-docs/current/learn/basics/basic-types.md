---
sidebar_position: 2
title: 基本型
description: String, Integer, Float, Boolean, Symbol, nil
---

<DocsBadge />


# 基本型

T-RubyはRubyの基本データ型に対応する基本型のセットを提供します。これらの型を理解することは、型安全なT-Rubyコードを書くために不可欠です。この章では、実用的な例とともに各基本型を詳しく探ります。

## 基本型の概要

T-Rubyには以下の基本型が含まれます：

- `String` - テキストデータ
- `Integer` - 整数
- `Float` - 小数点数
- `Boolean` - trueまたはfalse値
- `Symbol` - 不変識別子
- `nil` - 値の不在

それぞれを詳しく見ていきましょう。

## String

`String`型はテキストデータを表します。文字列は引用符で囲まれた文字のシーケンスです。

### 基本的なString使用

```trb title="strings.trb"
# String変数
name: String = "Alice"
greeting: String = 'Hello, world!'

# 複数行文字列
description: String = <<~TEXT
  これはT-Rubyの
  複数行文字列です。
TEXT

# 文字列補間
age = 30
message: String = "#{name}は#{age}歳です"
# messageは"Aliceは30歳です"
```

### Stringメソッド

T-RubyのStringはすべての標準Rubyメソッドを持っています。型チェッカーはこれらのメソッドを理解します：

```trb title="string_methods.trb"
def format_name(name: String): String
  name.strip.downcase.capitalize
end

result: String = format_name("  ALICE  ")
# "Alice"を返す

def get_initials(first: String, last: String): String
  "#{first[0]}.#{last[0]}."
end

initials: String = get_initials("Alice", "Smith")
# "A.S."を返す
```

### String連結

```trb title="string_concat.trb"
def build_url(protocol: String, domain: String, path: String): String
  protocol + "://" + domain + path
end

url: String = build_url("https", "example.com", "/api/users")
# "https://example.com/api/users"を返す

# 補間を使用した代替
def build_url_v2(protocol: String, domain: String, path: String): String
  "#{protocol}://#{domain}#{path}"
end
```

## Integer

`Integer`型は正と負の整数を表します。

### 基本的なInteger使用

```trb title="integers.trb"
# Integer変数
count: Integer = 42
negative: Integer = -10
zero: Integer = 0

# 大きな整数
population: Integer = 7_900_000_000  # 読みやすさのためのアンダースコア
```

### Integer算術

```trb title="integer_math.trb"
def calculate_total(price: Integer, quantity: Integer): Integer
  price * quantity
end

total: Integer = calculate_total(15, 4)
# 60を返す

def next_even_number(n: Integer): Integer
  n + (n % 2)
end

result: Integer = next_even_number(7)
# 8を返す
```

### Integerメソッド

```trb title="integer_methods.trb"
def absolute_value(n: Integer): Integer
  n.abs
end

abs_value: Integer = absolute_value(-42)
# 42を返す

def is_even(n: Integer): Boolean
  n.even?
end

check: Boolean = is_even(10)
# trueを返す
```

### Integer除算

Rubyの整数除算は結果を切り捨てます：

```trb title="integer_division.trb"
def divide_integers(a: Integer, b: Integer): Integer
  a / b
end

result: Integer = divide_integers(7, 2)
# 3を返す（3.5ではない）

# 小数除算が必要ならFloatに変換
def divide_as_float(a: Integer, b: Integer): Float
  a.to_f / b
end

decimal_result: Float = divide_as_float(7, 2)
# 3.5を返す
```

## Float

`Float`型は小数点数（浮動小数点数）を表します。

### 基本的なFloat使用

```trb title="floats.trb"
# Float変数
price: Float = 19.99
temperature: Float = -3.5
pi: Float = 3.14159

# 科学的記法
speed_of_light: Float = 2.998e8  # 299,800,000
```

### Float算術

```trb title="float_math.trb"
def calculate_average(values: Float[]): Float
  sum = 0.0
  values.each do |v|
    sum += v
  end
  sum / values.length
end

avg: Float = calculate_average([10.5, 20.3, 15.7])
# 15.5を返す

def calculate_interest(principal: Float, rate: Float, years: Integer): Float
  principal * (1 + rate) ** years
end

amount: Float = calculate_interest(1000.0, 0.05, 5)
# 約1276.28を返す
```

### 丸めと精度

```trb title="float_rounding.trb"
def round_to_cents(amount: Float): Float
  (amount * 100).round / 100.0
end

price: Float = round_to_cents(19.996)
# 20.0を返す

def format_currency(amount: Float): String
  "$%.2f" % amount
end

formatted: String = format_currency(19.99)
# "$19.99"を返す
```

### Float vs Integer

整数と浮動小数点を混ぜると、結果は通常浮動小数点になります：

```trb title="mixed_math.trb"
# Integer + Float = Float
def add_numbers(a: Integer, b: Float): Float
  a + b
end

sum: Float = add_numbers(5, 2.5)
# 7.5を返す
```

## Boolean

`Boolean`型はブール値：`true`または`false`を表します。T-Rubyは`Boolean`ではなく`Boolean`を型名として使用します。

### 基本的なBoolean使用

```trb title="booleans.trb"
# Boolean変数
is_active: Boolean = true
has_permission: Boolean = false

# 比較からのBoolean
is_adult: Boolean = age >= 18
is_valid: Boolean = count > 0
```

### Boolean論理

```trb title="boolean_logic.trb"
def can_access(is_logged_in: Boolean, has_permission: Boolean): Boolean
  is_logged_in && has_permission
end

access: Boolean = can_access(true, true)
# trueを返す

def should_notify(is_important: Boolean, is_urgent: Boolean): Boolean
  is_important || is_urgent
end

notify: Boolean = should_notify(false, true)
# trueを返す

def toggle(flag: Boolean): Boolean
  !flag
end

flipped: Boolean = toggle(true)
# falseを返す
```

### 条件文でのBooleans

```trb title="boolean_conditionals.trb"
def get_status(is_complete: Boolean): String
  if is_complete
    "完了"
  else
    "保留中"
  end
end

status: String = get_status(true)
# "完了"を返す

def check_eligibility(age: Integer, has_license: Boolean): String
  can_drive: Boolean = age >= 16 && has_license

  if can_drive
    "運転資格あり"
  else
    "運転資格なし"
  end
end
```

### Truthiness vs Boolean

Rubyでは多くの値が「truthy」または「falsy」ですが、`Boolean`型は`true`または`false`のみを受け入れます：

```trb title="bool_strict.trb"
# これは正しい
flag: Boolean = true

# これらはエラーになる：
# flag: Boolean = 1        # エラー: IntegerはBooleanではない
# flag: Boolean = "yes"    # エラー: StringはBooleanではない
# flag: Boolean = nil      # エラー: nilはBooleanではない

# truthy値をBooleanに変換するには：
def to_bool(value: String | nil): Boolean
  !value.nil? && !value.empty?
end
```

## Symbol

`Symbol`型は不変識別子を表します。シンボルはハッシュのキーや定数としてよく使用されます。

### 基本的なSymbol使用

```trb title="symbols.trb"
# Symbol変数
status: Symbol = :active
direction: Symbol = :north

# シンボルはハッシュでよく使用される
def create_options(mode: Symbol): Hash<Symbol, String>
  {
    mode: mode.to_s,
    version: "1.0"
  }
end

options = create_options(:production)
```

### Symbols vs Strings

シンボルは文字列に似ていますが、不変で識別子として使用するために最適化されています：

```trb title="symbol_vs_string.trb"
# 同じシンボルは常にメモリ内の同じオブジェクト
def are_same_symbol(a: Symbol, b: Symbol): Boolean
  a.object_id == b.object_id
end

same: Boolean = are_same_symbol(:active, :active)
# trueを返す

# SymbolとString間の変換
def symbol_to_string(sym: Symbol): String
  sym.to_s
end

def string_to_symbol(str: String): Symbol
  str.to_sym
end

text: String = symbol_to_string(:hello)
# "hello"を返す

symbol: Symbol = string_to_symbol("world")
# :worldを返す
```

## nil

`nil`型は値の不在を表します。T-Rubyでは`nil`は独自の型です。

### 基本的なnil使用

```trb title="nil_basics.trb"
# nil変数（それ自体ではあまり有用ではない）
nothing: nil = nil

# nilはunion型とより一般的に使用される
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

user = find_user(-1)
# nilを返す
```

### nilのチェック

```trb title="nil_checks.trb"
def greet(name: String | nil): String
  if name.nil?
    "こんにちは、見知らぬ方！"
  else
    "こんにちは、#{name}さん！"
  end
end

message1: String = greet("Alice")
# "こんにちは、Aliceさん！"を返す

message2: String = greet(nil)
# "こんにちは、見知らぬ方！"を返す
```

### 安全ナビゲーション演算子

Rubyの安全ナビゲーション演算子（`&.`）はnilと一緒に動作します：

```trb title="safe_navigation.trb"
def get_name_length(name: String | nil): Integer | nil
  name&.length
end

len1 = get_name_length("Alice")
# 5を返す

len2 = get_name_length(nil)
# nilを返す
```

### nilとデフォルト値

```trb title="nil_defaults.trb"
def get_greeting(custom: String | nil): String
  custom || "こんにちは！"
end

greeting1: String = get_greeting("ようこそ！")
# "ようこそ！"を返す

greeting2: String = get_greeting(nil)
# "こんにちは！"を返す
```

## 型変換

基本型間の変換が必要なことがよくあります：

### Stringへの変換

```trb title="to_string.trb"
def describe_number(num: Integer): String
  num.to_s
end

def describe_float(num: Float): String
  num.to_s
end

def describe_bool(flag: Boolean): String
  flag.to_s
end

text1: String = describe_number(42)
# "42"を返す

text2: String = describe_float(3.14)
# "3.14"を返す

text3: String = describe_bool(true)
# "true"を返す
```

### Integerへの変換

```trb title="to_integer.trb"
def parse_integer(text: String): Integer
  text.to_i
end

num1: Integer = parse_integer("42")
# 42を返す

num2: Integer = parse_integer("数字ではない")
# 0を返す（Rubyのデフォルト動作）

def float_to_int(f: Float): Integer
  f.to_i
end

truncated: Integer = float_to_int(3.7)
# 3を返す（四捨五入ではなく切り捨て）
```

## 実用的な例：温度変換器

複数の基本型を使用した完全な例：

```trb title="temperature.trb"
def celsius_to_fahrenheit(celsius: Float): Float
  (celsius * 9.0 / 5.0) + 32.0
end

def fahrenheit_to_celsius(fahrenheit: Float): Float
  (fahrenheit - 32.0) * 5.0 / 9.0
end

def format_temperature(temp: Float, unit: Symbol): String
  rounded: Float = temp.round(1)
  unit_str: String = unit.to_s.upcase

  "#{rounded}°#{unit_str}"
end

def convert_temperature(temp: Float, from: Symbol, to: Symbol): String
  converted: Float

  if from == :c && to == :f
    converted = celsius_to_fahrenheit(temp)
  elsif from == :f && to == :c
    converted = fahrenheit_to_celsius(temp)
  else
    converted = temp
  end

  format_temperature(converted, to)
end

result: String = convert_temperature(100.0, :c, :f)
# "212.0°F"を返す
```

## まとめ

T-Rubyの基本型はRubyの基本型を反映しています：

- **String**: テキストデータ（`"hello"`）
- **Integer**: 整数（`42`）
- **Float**: 小数点数（`3.14`）
- **Boolean**: ブール値（`true`, `false`）
- **Symbol**: 不変識別子（`:active`）
- **nil**: 値の不在（`nil`）

各型には特定のメソッドと動作があります。型変換は`to_s`、`to_i`、`to_f`などのメソッドを使用して明示的に行います。これらの基本型を理解することは、効果的なT-Rubyコードを書くための基本です。

次の章では、T-Rubyが自動的に型を推論し、明示的なアノテーションの必要性を減らす方法を学びます。
