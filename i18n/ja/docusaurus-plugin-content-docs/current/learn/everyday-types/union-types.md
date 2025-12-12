---
sidebar_position: 3
title: Union型
description: unionで複数の型を組み合わせる
---

<DocsBadge />


# Union型

Union型を使用すると、値が複数の異なる型のいずれかになることができます。正当に複数の形式を持つことができるデータをモデル化するために不可欠です。この章では、T-RubyでUnion型を効果的に使用する方法を学びます。

## Union型とは？

Union型は、指定された複数の型のいずれかになりうる値を表します。T-Rubyでは、パイプ（`|`）演算子を使用してUnion型を作成します：

```trb title="union_basics.trb"
# この変数はStringまたはnilになりうる
name: String | nil = "Alice"

# これはStringまたはIntegerになりうる
id: String | Integer = "user-123"

# これは3つの型のいずれかになりうる
value: String | Integer | Bool = true
```

## Union型を使用する理由

Union型はいくつかのシナリオで役立ちます：

### 1. オプショナル値

最も一般的な使用法は、型と`nil`を組み合わせてオプショナル値を表すことです：

```trb title="optional_values.trb"
def find_user(id: Integer): String | nil
  return nil if id < 0
  "User #{id}"
end

# 結果はnilの可能性がある
user: String | nil = find_user(1)  # "User 1"
no_user: String | nil = find_user(-1)  # nil
```

### 2. 複数の有効な入力型

関数が異なる型の入力を受け入れる場合：

```trb title="multiple_inputs.trb"
def format_id(id: String | Integer): String
  if id.is_a?(Integer)
    "ID-#{id}"
  else
    id.upcase
  end
end

formatted1: String = format_id(123)  # "ID-123"
formatted2: String = format_id("abc")  # "ABC"
```

### 3. 異なる戻り値型

関数が条件に基づいて異なる型を返す可能性がある場合：

```trb title="different_returns.trb"
def parse_value(input: String): String | Integer | Bool
  if input == "true" || input == "false"
    input == "true"
  elsif input.to_i.to_s == input
    input.to_i
  else
    input
  end
end

result1 = parse_value("42")  # 42 (Integer)
result2 = parse_value("true")  # true (Bool)
result3 = parse_value("hello")  # "hello" (String)
```

## Union型の操作

### `is_a?`による型チェック

Union型を持つ値を安全に使用するには、実際の型を確認する必要があります：

```trb title="type_checking.trb"
def process_value(value: String | Integer): String
  if value.is_a?(String)
    # このブロック内では、T-RubyはvalueがStringであることを知っている
    value.upcase
  else
    # ここでは、T-RubyはvalueがIntegerであることを知っている
    value.to_s
  end
end

result1: String = process_value("hello")  # "HELLO"
result2: String = process_value(42)  # "42"
```

### nilのチェック

オプショナル値を扱う場合、常に`nil`をチェックしてください：

```trb title="nil_checking.trb"
def get_length(text: String | nil): Integer
  if text.nil?
    0
  else
    # ここでは、T-RubyはtextがStringであることを知っている（nilではない）
    text.length
  end
end

len1: Integer = get_length("hello")  # 5
len2: Integer = get_length(nil)  # 0

# 安全ナビゲーション演算子を使用した代替
def get_length_safe(text: String | nil): Integer | nil
  text&.length
end
```

### 複数の型チェック

Unionに2つ以上の型がある場合：

```trb title="multiple_checks.trb"
def describe_value(value: String | Integer | Bool): String
  if value.is_a?(String)
    "テキスト: #{value}"
  elsif value.is_a?(Integer)
    "数値: #{value}"
  elsif value.is_a?(Bool)
    "ブール: #{value}"
  else
    "不明"
  end
end

desc1: String = describe_value("hello")  # "テキスト: hello"
desc2: String = describe_value(42)  # "数値: 42"
desc3: String = describe_value(true)  # "ブール: true"
```

## コレクションでのUnion型

Union型は配列やハッシュとよく一緒に使用されます：

### Union要素型を持つ配列

```trb title="union_arrays.trb"
# 文字列または整数を含むことができる配列
def create_mixed_list(): Array<String | Integer>
  ["Alice", 1, "Bob", 2, "Charlie", 3]
end

def sum_numbers(items: Array<String | Integer>): Integer
  total = 0

  items.each do |item|
    if item.is_a?(Integer)
      total += item
    end
  end

  total
end

def get_strings(items: Array<String | Integer>): Array<String>
  result: Array<String> = []

  items.each do |item|
    if item.is_a?(String)
      result << item
    end
  end

  result
end

mixed: Array<String | Integer> = create_mixed_list()
sum: Integer = sum_numbers(mixed)  # 6
strings: Array<String> = get_strings(mixed)  # ["Alice", "Bob", "Charlie"]
```

### Union値型を持つハッシュ

```trb title="union_hashes.trb"
# 異なる値型を持つハッシュ
def create_config(): Hash<Symbol, String | Integer | Bool>
  {
    host: "localhost",
    port: 3000,
    debug: true,
    timeout: 30,
    environment: "development"
  }
end

def get_string_value(
  config: Hash<Symbol, String | Integer | Bool>,
  key: Symbol
): String | nil
  value = config[key]

  if value.is_a?(String)
    value
  else
    nil
  end
end

def get_integer_value(
  config: Hash<Symbol, String | Integer | Bool>,
  key: Symbol
): Integer | nil
  value = config[key]

  if value.is_a?(Integer)
    value
  else
    nil
  end
end

config = create_config()
host: String | nil = get_string_value(config, :host)  # "localhost"
port: Integer | nil = get_integer_value(config, :port)  # 3000
```

## 一般的なUnion型パターン

### パターン1：成功またはエラー

```trb title="result_pattern.trb"
def divide_safe(a: Float, b: Float): Float | String
  if b == 0.0
    "エラー: ゼロで除算できません"
  else
    a / b
  end
end

def process_result(result: Float | String): String
  if result.is_a?(Float)
    "結果: #{result}"
  else
    # エラーメッセージ
    result
  end
end

result1 = divide_safe(10.0, 2.0)  # 5.0
result2 = divide_safe(10.0, 0.0)  # "エラー: ゼロで除算できません"

message1: String = process_result(result1)  # "結果: 5.0"
message2: String = process_result(result2)  # "エラー: ゼロで除算できません"
```

### パターン2：デフォルト値

```trb title="default_pattern.trb"
def get_value_or_default(
  value: String | nil,
  default: String
): String
  if value.nil?
    default
  else
    value
  end
end

# 単純なケースでは||を使用
def get_or_default_short(value: String | nil, default: String): String
  value || default
end

result1: String = get_value_or_default("hello", "default")  # "hello"
result2: String = get_value_or_default(nil, "default")  # "default"
```

### パターン3：型強制変換

```trb title="coercion_pattern.trb"
def to_integer(value: String | Integer): Integer
  if value.is_a?(Integer)
    value
  else
    value.to_i
  end
end

def to_string(value: String | Integer | Bool): String
  if value.is_a?(String)
    value
  else
    value.to_s
  end
end

num1: Integer = to_integer(42)  # 42
num2: Integer = to_integer("42")  # 42

str1: String = to_string("hello")  # "hello"
str2: String = to_string(42)  # "42"
str3: String = to_string(true)  # "true"
```

### パターン4：多態関数

```trb title="polymorphic_pattern.trb"
def repeat(value: String | Integer, times: Integer): String
  if value.is_a?(String)
    value * times
  else
    # 数値表現を繰り返す
    (value.to_s + " ") * times
  end
end

result1: String = repeat("Ha", 3)  # "HaHaHa"
result2: String = repeat(42, 3)  # "42 42 42 "
```

## ネストしたUnion型

Union型は複雑な方法で組み合わせることができます：

### Union内のUnion

```trb title="nested_unions.trb"
# 数値（IntegerまたはFloat）またはテキスト（StringまたはSymbol）になりうる値
def process_input(value: Integer | Float | String | Symbol): String
  if value.is_a?(Integer) || value.is_a?(Float)
    "数値: #{value}"
  elsif value.is_a?(String)
    "文字列: #{value}"
  else
    "シンボル: #{value}"
  end
end

result1: String = process_input(42)  # "数値: 42"
result2: String = process_input(3.14)  # "数値: 3.14"
result3: String = process_input("hello")  # "文字列: hello"
result4: String = process_input(:active)  # "シンボル: active"
```

### 複雑な型とのUnion

```trb title="complex_unions.trb"
# 単一の値または値の配列になりうる
def normalize_input(
  value: String | Array<String>
): Array<String>
  if value.is_a?(Array)
    value
  else
    [value]
  end
end

result1: Array<String> = normalize_input("hello")  # ["hello"]
result2: Array<String> = normalize_input(["a", "b"])  # ["a", "b"]

# 単一の整数または範囲になりうる
def expand_range(value: Integer | Range): Array<Integer>
  if value.is_a?(Range)
    value.to_a
  else
    [value]
  end
end

nums1: Array<Integer> = expand_range(5)  # [5]
nums2: Array<Integer> = expand_range(1..5)  # [1, 2, 3, 4, 5]
```

## 実用的な例：設定システム

Union型を使用した包括的な例です：

```trb title="config_system.trb"
class ConfigManager
  def initialize()
    @config: Hash<String, String | Integer | Bool | nil> = {}
  end

  def set(key: String, value: String | Integer | Bool | nil)
    @config[key] = value
  end

  def get_string(key: String): String | nil
    value = @config[key]

    if value.is_a?(String)
      value
    else
      nil
    end
  end

  def get_integer(key: String): Integer | nil
    value = @config[key]

    if value.is_a?(Integer)
      value
    else
      nil
    end
  end

  def get_bool(key: String): Bool | nil
    value = @config[key]

    if value.is_a?(Bool)
      value
    else
      nil
    end
  end

  def get_string_or_default(key: String, default: String): String
    value = get_string(key)
    value || default
  end

  def get_integer_or_default(key: String, default: Integer): Integer
    value = get_integer(key)
    value || default
  end

  def get_bool_or_default(key: String, default: Bool): Bool
    value = get_bool(key)
    if value.nil?
      default
    else
      value
    end
  end

  def to_hash(): Hash<String, String | Integer | Bool | nil>
    @config.dup
  end

  def parse_and_set(key: String, raw_value: String)
    # booleanとしてパース試行
    if raw_value == "true"
      set(key, true)
      return
    elsif raw_value == "false"
      set(key, false)
      return
    end

    # 整数としてパース試行
    int_value = raw_value.to_i
    if int_value.to_s == raw_value
      set(key, int_value)
      return
    end

    # それ以外は文字列として保存
    set(key, raw_value)
  end
end

# 使用法
config = ConfigManager.new()

config.set("host", "localhost")
config.set("port", 3000)
config.set("debug", true)
config.set("optional_feature", nil)

host: String = config.get_string_or_default("host", "0.0.0.0")
# "localhost"

port: Integer = config.get_integer_or_default("port", 8080)
# 3000

debug: Bool = config.get_bool_or_default("debug", false)
# true

timeout: Integer = config.get_integer_or_default("timeout", 30)
# 30（キーが存在しないのでデフォルトを使用）

# 文字列からパース
config.parse_and_set("max_connections", "100")  # Integerとして保存
config.parse_and_set("enable_ssl", "true")  # Boolとして保存
config.parse_and_set("environment", "production")  # Stringとして保存
```

## ベストプラクティス

### 1. Unionをシンプルに保つ

多すぎる型を持つUnionを避けてください：

```trb title="simple_unions.trb"
# 良い - 明確でシンプル
def process(value: String | Integer): String
  # ...
end

# 避ける - 処理する型が多すぎる
def process_complex(
  value: String | Integer | Float | Bool | Symbol | nil
): String
  # 分岐が多すぎる
end
```

### 2. オプショナル値にnil Unionを使用

```trb title="optional_best_practice.trb"
# 良い - 明確にオプショナル
def find_item(id: Integer): String | nil
  # ...
end

# 避ける - 空文字列で「見つからない」を意味
def find_item_bad(id: Integer): String
  # 見つからないと""を返す - 不明確！
end
```

### 3. 一貫した順序で型をチェック

```trb title="consistent_checks.trb"
# 良い - 一貫したパターン
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

# 良い - 同じパターン
def format(value: String | Integer): String
  if value.is_a?(String)
    "テキスト: #{value}"
  else
    "数値: #{value}"
  end
end
```

### 4. Union型の意味を文書化

```trb title="documentation.trb"
# 良い - 各型が何を意味するか明確
def get_status(id: Integer): String | Symbol | nil
  # 戻り値:
  # - String: エラーメッセージ
  # - Symbol: ステータスコード（:active, :pendingなど）
  # - nil: アイテムが見つからない

  return nil if id < 0
  return :active if id == 1
  "エラー: 無効な状態"
end
```

## 一般的な落とし穴

### 型チェックを忘れる

```trb title="missing_checks.trb"
# 間違い - 型をチェックしていない
def bad_example(value: String | Integer): Integer
  value.length  # エラー！Integerにはlengthがない
end

# 正しい - 最初に型をチェック
def good_example(value: String | Integer): Integer
  if value.is_a?(String)
    value.length
  else
    value
  end
end
```

### 変更後の型の仮定

```trb title="type_mutation.trb"
def risky_example(value: String | Integer)
  if value.is_a?(String)
    value = value.to_i  # これでIntegerに！
    # valueは今Integer、Stringではない
  end

  # ここでvalueがまだStringであると仮定できない
end
```

## まとめ

T-RubyのUnion型は、値が複数の型のいずれかになることを可能にします：

- **構文**: パイプ演算子（`|`）を使用して型を結合
- **一般的な用途**: `| nil`で値をオプショナルにする
- **型チェック**: `is_a?`を使用して実際の型を判定
- **コレクション**: ArrayやHash型と組み合わせて使用可能
- **ベストプラクティス**: Unionをシンプルに保ち、一貫して型をチェック

Union型は、単一の型に収まらない現実のデータをモデル化するために不可欠です。型ナローイング（次の章で説明）と組み合わせることで、多様なデータを処理する強力で安全な方法を提供します。
