---
sidebar_position: 1
title: プリミティブ型
description: T-Rubyのプリミティブ型
---

<DocsBadge />


# プリミティブ型

プリミティブ型はT-Rubyの型システムの基本的な構成要素です。より複雑な型の基礎となる、単純で分割不可能な値を表します。この章では、プリミティブ型の動作、エッジケース、ベストプラクティスを深く探ります。

## プリミティブ型とは？

T-Rubyのプリミティブ型は以下の通りです：

- `String` - テキストと文字データ
- `Integer` - 整数
- `Float` - 浮動小数点数
- `Boolean` - ブール値（true/false）
- `Symbol` - 不変識別子
- `nil` - null値

これらの型が「プリミティブ」と呼ばれるのは、より単純な型に分解できないからです。型システムのアトム（原子）です。

## Stringプリミティブの操作

文字列はRubyでは不変の文字シーケンスです。T-RubyのString型はテキスト操作に対する完全な型安全性を提供します。

### Stringの作成と操作

```trb title="string_basics.trb"
# 文字列を作成するさまざまな方法
single_quoted: String = 'Hello'
double_quoted: String = "World"
interpolated: String = "Hello, #{single_quoted}!"

# 複数行文字列
heredoc: String = <<~TEXT
  これは
  複数行文字列です
TEXT
```

### 型安全性を持つStringメソッド

```trb title="string_methods.trb"
def process_text(input: String): String
  # これらの操作はすべてString型を保持します
  trimmed = input.strip
  lowercase = trimmed.downcase
  capitalized = lowercase.capitalize

  capitalized
end

result: String = process_text("  HELLO  ")
# "Hello"を返す

# メソッドチェーン
def format_username(username: String): String
  username.strip.downcase.gsub(/[^a-z0-9]/, "_")
end

formatted: String = format_username("  John Doe! ")
# "john_doe_"を返す
```

### String比較

```trb title="string_compare.trb"
def are_equal(a: String, b: String): Boolean
  a == b
end

def starts_with_hello(text: String): Boolean
  text.start_with?("Hello")
end

def contains_word(text: String, word: String): Boolean
  text.include?(word)
end

check1: Boolean = are_equal("hello", "hello")  # true
check2: Boolean = starts_with_hello("Hello, world!")  # true
check3: Boolean = contains_word("Ruby is great", "great")  # true
```

### Stringの長さとインデックス

```trb title="string_indexing.trb"
def get_first_char(text: String): String
  text[0]
end

def get_substring(text: String, start: Integer, length: Integer): String
  text[start, length]
end

def string_length(text: String): Integer
  text.length
end

first: String = get_first_char("Hello")  # "H"
sub: String = get_substring("Hello World", 6, 5)  # "World"
len: Integer = string_length("Hello")  # 5
```

### String構築

```trb title="string_building.trb"
def build_greeting(name: String, title: String): String
  parts: Array<String> = ["Hello", title, name]
  parts.join(" ")
end

greeting: String = build_greeting("Smith", "Dr.")
# "Hello Dr. Smith"を返す

def repeat_text(text: String, times: Integer): String
  text * times
end

repeated: String = repeat_text("Ha", 3)
# "HaHaHa"を返す
```

## Integerプリミティブの操作

Integerは小数点のない整数を表します。

### Integer算術

```trb title="integer_ops.trb"
def add(a: Integer, b: Integer): Integer
  a + b
end

def multiply(a: Integer, b: Integer): Integer
  a * b
end

def modulo(a: Integer, b: Integer): Integer
  a % b
end

def power(base: Integer, exponent: Integer): Integer
  base ** exponent
end

sum: Integer = add(10, 5)  # 15
product: Integer = multiply(10, 5)  # 50
remainder: Integer = modulo(10, 3)  # 1
result: Integer = power(2, 8)  # 256
```

### Integer除算の動作

Integer算術の重要な側面は除算の動作です：

```trb title="integer_division.trb"
def divide_truncate(a: Integer, b: Integer): Integer
  # 整数除算は常にゼロ方向に切り捨て
  a / b
end

def divide_with_remainder(a: Integer, b: Integer): Array<Integer>
  quotient = a / b
  remainder = a % b
  [quotient, remainder]
end

result1: Integer = divide_truncate(7, 2)  # 3（3.5ではない）
result2: Integer = divide_truncate(-7, 2)  # -3（ゼロ方向に切り捨て）

parts: Array<Integer> = divide_with_remainder(17, 5)
# [3, 2]を返す（17 = 5 * 3 + 2）
```

### Integer比較

```trb title="integer_compare.trb"
def is_positive(n: Integer): Boolean
  n > 0
end

def is_even(n: Integer): Boolean
  n % 2 == 0
end

def is_in_range(n: Integer, min: Integer, max: Integer): Boolean
  n >= min && n <= max
end

def max(a: Integer, b: Integer): Integer
  if a > b
    a
  else
    b
  end
end

check1: Boolean = is_positive(5)  # true
check2: Boolean = is_even(7)  # false
check3: Boolean = is_in_range(5, 1, 10)  # true
maximum: Integer = max(10, 20)  # 20
```

### Integerメソッド

```trb title="integer_methods.trb"
def absolute(n: Integer): Integer
  n.abs
end

def next_number(n: Integer): Integer
  n.next
end

def times_operation(n: Integer): Array<Integer>
  results: Array<Integer> = []
  n.times do |i|
    results << i
  end
  results
end

abs_value: Integer = absolute(-42)  # 42
next_val: Integer = next_number(5)  # 6
numbers: Array<Integer> = times_operation(5)  # [0, 1, 2, 3, 4]
```

## Floatプリミティブの操作

Floatは浮動小数点算術を使用して小数を表します。

### Float算術

```trb title="float_ops.trb"
def divide_precise(a: Integer, b: Integer): Float
  # 精密な除算のためにfloatに変換
  a.to_f / b
end

def calculate_average(numbers: Array<Integer>): Float
  sum = numbers.reduce(0) { |acc, n| acc + n }
  sum.to_f / numbers.length
end

def apply_percentage(amount: Float, percent: Float): Float
  amount * (percent / 100.0)
end

precise: Float = divide_precise(7, 2)  # 3.5
avg: Float = calculate_average([10, 20, 30])  # 20.0
discount: Float = apply_percentage(100.0, 15.0)  # 15.0
```

### Float精度と丸め

```trb title="float_precision.trb"
def round_to_places(value: Float, places: Integer): Float
  multiplier = 10 ** places
  (value * multiplier).round / multiplier.to_f
end

def round_to_nearest(value: Float): Integer
  value.round
end

def floor_value(value: Float): Integer
  value.floor
end

def ceil_value(value: Float): Integer
  value.ceil
end

rounded: Float = round_to_places(3.14159, 2)  # 3.14
nearest: Integer = round_to_nearest(3.7)  # 4
floored: Integer = floor_value(3.7)  # 3
ceiled: Integer = ceil_value(3.2)  # 4
```

### Float比較の注意点

浮動小数点比較は精度の問題により注意が必要です：

```trb title="float_compare.trb"
def approximately_equal(a: Float, b: Float, epsilon: Float = 0.0001): Boolean
  (a - b).abs < epsilon
end

def is_close_to_zero(value: Float): Boolean
  value.abs < 0.0001
end

# 直接比較は問題になる可能性がある
result1 = 0.1 + 0.2  # 浮動小数点精度のため正確に0.3にならない場合がある

# 近似比較を使用
check: Boolean = approximately_equal(0.1 + 0.2, 0.3)  # true

# ゼロのチェック
is_zero: Boolean = is_close_to_zero(0.0000001)  # true
```

### Float特殊値

```trb title="float_special.trb"
def is_infinite(value: Float): Boolean
  value.infinite? != nil
end

def is_nan(value: Float): Boolean
  value.nan?
end

def safe_divide(a: Float, b: Float): Float | nil
  return nil if b == 0.0
  a / b
end

# 特殊なfloat値が存在する
positive_infinity: Float = 1.0 / 0.0  # Infinity
negative_infinity: Float = -1.0 / 0.0  # -Infinity
not_a_number: Float = 0.0 / 0.0  # NaN

check1: Boolean = is_infinite(positive_infinity)  # true
check2: Boolean = is_nan(not_a_number)  # true
```

## Booleanプリミティブの操作

Boolean型は厳格な型チェックを持つtrue/false値を表します。

### Boolean演算

```trb title="bool_ops.trb"
def and_operation(a: Boolean, b: Boolean): Boolean
  a && b
end

def or_operation(a: Boolean, b: Boolean): Boolean
  a || b
end

def not_operation(a: Boolean): Boolean
  !a
end

def xor_operation(a: Boolean, b: Boolean): Boolean
  (a || b) && !(a && b)
end

result1: Boolean = and_operation(true, false)  # false
result2: Boolean = or_operation(true, false)  # true
result3: Boolean = not_operation(true)  # false
result4: Boolean = xor_operation(true, false)  # true
```

### 比較からのBoolean

```trb title="bool_from_compare.trb"
def is_valid_age(age: Integer): Boolean
  age >= 0 && age <= 150
end

def is_valid_email(email: String): Boolean
  email.include?("@") && email.include?(".")
end

def all_positive(numbers: Array<Integer>): Boolean
  numbers.all? { |n| n > 0 }
end

def any_even(numbers: Array<Integer>): Boolean
  numbers.any? { |n| n % 2 == 0 }
end

valid1: Boolean = is_valid_age(25)  # true
valid2: Boolean = is_valid_email("user@example.com")  # true
check1: Boolean = all_positive([1, 2, 3])  # true
check2: Boolean = any_even([1, 3, 5, 6])  # true
```

### Boolean vs Truthy値

T-RubyのBoolean型は厳格です - `true`と`false`のみが有効です：

```trb title="bool_strict.trb"
# これはBoolean値です
flag1: Boolean = true
flag2: Boolean = false

# これらは型エラーになります：
# flag3: Boolean = 1  # エラー！
# flag4: Boolean = "yes"  # エラー！
# flag5: Boolean = nil  # エラー！

# truthy値をBooleanに変換
def to_bool(value: String | nil): Boolean
  !value.nil? && value != ""
end

def is_present(value: String | nil): Boolean
  value != nil && value.length > 0
end

converted1: Boolean = to_bool("hello")  # true
converted2: Boolean = to_bool(nil)  # false
present: Boolean = is_present("")  # false
```

## Symbolプリミティブの操作

Symbolは定数やキーとしてよく使用される不変の一意の識別子です。

### Symbol使用法

```trb title="symbol_usage.trb"
# 定数としてのシンボル
STATUS_ACTIVE: Symbol = :active
STATUS_PENDING: Symbol = :pending
STATUS_CANCELLED: Symbol = :cancelled

def get_status_message(status: Symbol): String
  case status
  when :active
    "現在アクティブ"
  when :pending
    "承認待ち"
  when :cancelled
    "キャンセル済み"
  else
    "不明なステータス"
  end
end

message: String = get_status_message(:active)
# "現在アクティブ"を返す
```

### Symbol vs String パフォーマンス

シンボルは繰り返し使用する場合、文字列よりメモリ効率が良いです：

```trb title="symbol_performance.trb"
def categorize_with_symbols(items: Array<Integer>): Hash<Symbol, Array<Integer>>
  categories: Hash<Symbol, Array<Integer>> = {
    small: [],
    medium: [],
    large: []
  }

  items.each do |item|
    if item < 10
      categories[:small] << item
    elsif item < 100
      categories[:medium] << item
    else
      categories[:large] << item
    end
  end

  categories
end

result = categorize_with_symbols([5, 50, 500])
# { small: [5], medium: [50], large: [500] }を返す
```

### SymbolとString間の変換

```trb title="symbol_conversion.trb"
def symbol_to_string(sym: Symbol): String
  sym.to_s
end

def string_to_symbol(str: String): Symbol
  str.to_sym
end

def normalize_key(key: Symbol | String): Symbol
  if key.is_a?(Symbol)
    key
  else
    key.to_sym
  end
end

text: String = symbol_to_string(:hello)  # "hello"
symbol: Symbol = string_to_symbol("world")  # :world
normalized: Symbol = normalize_key("status")  # :status
```

## nilプリミティブの操作

`nil`型は値の不在を表します。

### nilチェック

```trb title="nil_checks.trb"
def is_nil(value: String | nil): Boolean
  value.nil?
end

def has_value(value: String | nil): Boolean
  !value.nil?
end

def get_or_default(value: String | nil, default: String): String
  if value.nil?
    default
  else
    value
  end
end

check1: Boolean = is_nil(nil)  # true
check2: Boolean = has_value("hello")  # true
result: String = get_or_default(nil, "default")  # "default"
```

### 安全ナビゲーション

```trb title="safe_navigation.trb"
def get_length_safe(text: String | nil): Integer | nil
  text&.length
end

def get_first_char_safe(text: String | nil): String | nil
  text&.[](0)
end

len1 = get_length_safe("hello")  # 5
len2 = get_length_safe(nil)  # nil

char1 = get_first_char_safe("hello")  # "h"
char2 = get_first_char_safe(nil)  # nil
```

## プリミティブ型間の型変換

プリミティブ型間の変換はT-Rubyでは明示的です：

### Stringへの変換

```trb title="to_string_conversions.trb"
def int_to_string(n: Integer): String
  n.to_s
end

def float_to_string(f: Float): String
  f.to_s
end

def bool_to_string(b: Boolean): String
  b.to_s
end

def symbol_to_string(s: Symbol): String
  s.to_s
end

str1: String = int_to_string(42)  # "42"
str2: String = float_to_string(3.14)  # "3.14"
str3: String = bool_to_string(true)  # "true"
str4: String = symbol_to_string(:active)  # "active"
```

### 数値への変換

```trb title="to_number_conversions.trb"
def string_to_int(s: String): Integer
  s.to_i
end

def string_to_float(s: String): Float
  s.to_f
end

def float_to_int(f: Float): Integer
  f.to_i  # 小数点以下を切り捨て
end

def int_to_float(i: Integer): Float
  i.to_f
end

num1: Integer = string_to_int("42")  # 42
num2: Float = string_to_float("3.14")  # 3.14
num3: Integer = float_to_int(3.7)  # 3
num4: Float = int_to_float(42)  # 42.0
```

## 実用的な例：計算機

すべてのプリミティブ型を使用した包括的な例です：

```trb title="calculator.trb"
class Calculator
  def initialize()
    @history: Array<String> = []
    @memory: Float = 0.0
  end

  def add(a: Float, b: Float): Float
    result = a + b
    log_operation(:add, a, b, result)
    result
  end

  def subtract(a: Float, b: Float): Float
    result = a - b
    log_operation(:subtract, a, b, result)
    result
  end

  def multiply(a: Float, b: Float): Float
    result = a * b
    log_operation(:multiply, a, b, result)
    result
  end

  def divide(a: Float, b: Float): Float | nil
    if b == 0.0
      puts "エラー: ゼロで除算できません"
      return nil
    end

    result = a / b
    log_operation(:divide, a, b, result)
    result
  end

  def store_in_memory(value: Float)
    @memory = value
  end

  def recall_memory(): Float
    @memory
  end

  def clear_memory()
    @memory = 0.0
  end

  def get_history(): Array<String>
    @history
  end

  private

  def log_operation(op: Symbol, a: Float, b: Float, result: Float)
    op_str: String = op.to_s
    entry: String = "#{a} #{op_str} #{b} = #{result}"
    @history << entry
  end
end

# 使用法
calc = Calculator.new()

result1: Float = calc.add(10.5, 5.3)  # 15.8
result2: Float = calc.multiply(4.0, 2.5)  # 10.0

calc.store_in_memory(result1)
recalled: Float = calc.recall_memory()  # 15.8

history: Array<String> = calc.get_history()
# ["10.5 add 5.3 = 15.8", "4.0 multiply 2.5 = 10.0"]を返す
```

## まとめ

プリミティブ型はT-Rubyの型システムの基盤です：

- **String**: 豊富な操作メソッドを持つ不変テキスト
- **Integer**: 切り捨て除算を持つ整数
- **Float**: 精度に注意が必要な小数
- **Boolean**: 厳格なtrue/false値（truthy/falsyではない）
- **Symbol**: 定数とキーのための不変識別子
- **nil**: 値の不在を表す

プリミティブ型を深く理解することで、より複雑な型と効果的に作業できます。型変換は明示的であり、比較には重要なエッジケースがあり、各プリミティブ型には理解すべき特定の動作があります。

次の章では、これらのプリミティブ型を基盤とする配列やハッシュなどの複合型について学びます。
