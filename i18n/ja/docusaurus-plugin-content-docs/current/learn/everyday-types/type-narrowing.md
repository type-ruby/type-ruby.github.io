---
sidebar_position: 4
title: 型ナローイング
description: 制御フロー分析による型のナローイング
---

<DocsBadge />


# 型ナローイング

型ナローイングは、T-Rubyが制御フロー分析に基づいて変数の型を自動的に具体化するプロセスです。変数の型や値をチェックすると、T-Rubyはそのコードパス内で変数がとりうる型を絞り込みます。この章では、型ナローイングがどのように機能し、型安全なコードのためにどのように活用するかを学びます。

## 型ナローイングとは？

型ナローイングは、T-Rubyがコードを分析し、特定のスコープ内で変数が宣言された型よりも具体的な型でなければならないと判断したときに発生します。

```trb title="narrowing_basics.trb"
def process(value: String | Integer): String
  if value.is_a?(String)
    # このブロック内では、T-RubyはvalueがStringであることを知っている
    # String固有のメソッドを使用できる
    value.upcase
  else
    # ここでは、T-RubyはvalueがIntegerでなければならないことを知っている
    # Integer固有のメソッドを使用できる
    value.to_s
  end
end
```

この例では、`String | Integer`型は最初の分岐で`String`のみに、else分岐で`Integer`のみに絞り込まれます。

## タイプガード

タイプガードは、T-Rubyが型を絞り込むことを可能にする式です。最も一般的なタイプガードは以下の通りです：

### `is_a?`タイプガード

`is_a?`メソッドは、値が特定の型のインスタンスかどうかをチェックします：

```trb title="is_a_guard.trb"
def format_value(value: String | Integer | Bool): String
  if value.is_a?(String)
    # ここでvalueはString
    "テキスト: #{value}"
  elsif value.is_a?(Integer)
    # ここでvalueはInteger
    "数値: #{value}"
  elsif value.is_a?(Bool)
    # ここでvalueはBool
    "ブール: #{value}"
  else
    "不明"
  end
end

result1: String = format_value("hello")  # "テキスト: hello"
result2: String = format_value(42)  # "数値: 42"
result3: String = format_value(true)  # "ブール: true"
```

### `nil?`タイプガード

`nil?`メソッドはオプショナル型を絞り込みます：

```trb title="nil_guard.trb"
def get_length(text: String | nil): Integer
  if text.nil?
    # ここでtextはnil
    0
  else
    # ここでtextはString（nilではない）
    text.length
  end
end

# 否定を使用した代替
def get_length_alt(text: String | nil): Integer
  if !text.nil?
    # ここでtextはString
    text.length
  else
    # ここでtextはnil
    0
  end
end

len1: Integer = get_length("hello")  # 5
len2: Integer = get_length(nil)  # 0
```

### `empty?`タイプガード

`empty?`メソッドはコレクションの型を絞り込むことができます：

```trb title="empty_guard.trb"
def process_array(items: Array<String> | nil): String
  if items.nil? || items.empty?
    "アイテムなし"
  else
    # ここでitemsは空でないArray<String>
    "最初のアイテム: #{items.first}"
  end
end

result1: String = process_array(["a", "b"])  # "最初のアイテム: a"
result2: String = process_array([])  # "アイテムなし"
result3: String = process_array(nil)  # "アイテムなし"
```

## 等価比較によるナローイング

値を特定の定数と比較すると、型が絞り込まれます：

### nilとの比較

```trb title="nil_comparison.trb"
def greet(name: String | nil): String
  if name == nil
    # ここでnameはnil
    "こんにちは、見知らぬ方！"
  else
    # ここでnameはString
    "こんにちは、#{name}さん！"
  end
end

# 代替構文
def greet_alt(name: String | nil): String
  if name != nil
    # ここでnameはString
    "こんにちは、#{name}さん！"
  else
    # ここでnameはnil
    "こんにちは、見知らぬ方！"
  end
end
```

### 特定の値との比較

```trb title="value_comparison.trb"
def process_status(status: String): String
  if status == "active"
    # statusはまだStringだが、値を知っている
    "ステータスはアクティブです"
  elsif status == "pending"
    "ステータスは保留中です"
  else
    "不明なステータス: #{status}"
  end
end
```

## 異なる制御フロー構造でのナローイング

### If/Elsif/Else文

```trb title="if_narrowing.trb"
def categorize(value: String | Integer | nil): String
  if value.nil?
    # valueはnil
    "空"
  elsif value.is_a?(String)
    # valueはString（nilではない、Integerではない）
    "テキスト: #{value.length}文字"
  else
    # valueはInteger（nilではない、Stringではない）
    "数値: #{value}"
  end
end

cat1: String = categorize(nil)  # "空"
cat2: String = categorize("hello")  # "テキスト: 5文字"
cat3: String = categorize(42)  # "数値: 42"
```

### Unless文

```trb title="unless_narrowing.trb"
def process_unless(value: String | nil): String
  unless value.nil?
    # ここでvalueはString
    value.upcase
  else
    # ここでvalueはnil
    "値なし"
  end
end

result1: String = process_unless("hello")  # "HELLO"
result2: String = process_unless(nil)  # "値なし"
```

### Case/When文

```trb title="case_narrowing.trb"
def describe(value: String | Integer | Symbol): String
  case value
  when String
    # ここでvalueはString
    "長さ#{value.length}の文字列"
  when Integer
    # ここでvalueはInteger
    "数値: #{value}"
  when Symbol
    # ここでvalueはSymbol
    "シンボル: #{value}"
  else
    "不明"
  end
end

desc1: String = describe("hello")  # "長さ5の文字列"
desc2: String = describe(42)  # "数値: 42"
desc3: String = describe(:active)  # "シンボル: active"
```

### 三項演算子

```trb title="ternary_narrowing.trb"
def get_display_name(name: String | nil): String
  name.nil? ? "匿名" : name.upcase
end

display1: String = get_display_name("alice")  # "ALICE"
display2: String = get_display_name(nil)  # "匿名"
```

## 論理演算子によるナローイング

### AND演算子（`&&`）

```trb title="and_narrowing.trb"
def process_and(
  value: String | nil,
  flag: Bool
): String
  if !value.nil? && flag
    # ここでvalueはString（nilではない）
    # flagはtrue
    value.upcase
  else
    "スキップ"
  end
end

def safe_access(items: Array<String> | nil, index: Integer): String | nil
  if !items.nil? && index < items.length
    # ここでitemsはArray<String>
    items[index]
  else
    nil
  end
end
```

### OR演算子（`||`）

```trb title="or_narrowing.trb"
def process_or(value: String | nil): String
  if value.nil? || value.empty?
    "値なし"
  else
    # ここでvalueは空でないString
    value.upcase
  end
end
```

## 早期リターンと型ナローイング

早期リターンは関数の残りの部分で型を絞り込みます：

```trb title="early_return.trb"
def process_with_guard(value: String | nil): String
  # ガード節
  return "値なし" if value.nil?

  # この時点以降、valueはString（nilではない）
  # elseブロックは不要
  value.upcase
end

def validate_and_process(input: String | Integer): String
  # 複数のガード
  return "無効" if input.nil?

  if input.is_a?(String)
    return "短すぎます" if input.length < 3
    # inputは長さ3以上のString
    return input.upcase
  end

  # ここでinputはInteger
  return "小さすぎます" if input < 10
  # inputは10以上のInteger
  "有効な数値: #{input}"
end
```

## メソッド呼び出しによるナローイング

一部のメソッド呼び出しは型ナローイングを提供します：

### Stringメソッド

```trb title="string_method_narrowing.trb"
def process_string(value: String | nil): String
  return "空" if value.nil? || value.empty?

  # ここでvalueは空でないString
  first_char = value[0]
  "開始文字: #{first_char}"
end
```

### Arrayメソッド

```trb title="array_method_narrowing.trb"
def get_first_element(items: Array<String> | nil): String
  return "アイテムなし" if items.nil? || items.empty?

  # ここでitemsは空でないArray<String>
  first: String = items.first
  first
end
```

## ブロックとラムダでのナローイング

型ナローイングはブロック内でも機能します：

```trb title="block_narrowing.trb"
def process_items(items: Array<String | nil>): Array<String>
  result: Array<String> = []

  items.each do |item|
    # ここでitemはString | nil
    unless item.nil?
      # ここでitemはString
      result << item.upcase
    end
  end

  result
end

def filter_and_map(items: Array<String | Integer>): Array<String>
  items.map do |item|
    if item.is_a?(String)
      # ここでitemはString
      item.upcase
    else
      # ここでitemはInteger
      item.to_s
    end
  end
end
```

## 実用的な例：フォームバリデータ

型ナローイングを使用した包括的な例です：

```trb title="form_validator.trb"
class FormValidator
  def validate_field(
    name: String,
    value: String | Integer | Bool | nil,
    required: Bool
  ): String | nil
    # 必須フィールドが欠落している場合の早期リターン
    if required && value.nil?
      return "#{name}は必須です"
    end

    # 必須でなくnilの場合、有効
    return nil if value.nil?

    # ここでvalueがnilでないことを知っている
    # 型ナローイングで特定の型をチェックできる

    if value.is_a?(String)
      # ここでvalueはString
      return "#{name}は空にできません" if value.empty?
      return "#{name}は長すぎます" if value.length > 100
    elsif value.is_a?(Integer)
      # ここでvalueはInteger
      return "#{name}は正の数である必要があります" if value < 0
      return "#{name}は大きすぎます" if value > 1000
    end
    # StringでもIntegerでもなければ、ここでvalueはBool

    # エラーなし
    nil
  end

  def validate_email(email: String | nil): String | nil
    return "メールアドレスは必須です" if email.nil?

    # ここでemailはString
    return "メールアドレスは空にできません" if email.empty?
    return "メールアドレスには@が必要です" unless email.include?("@")
    return "メールアドレスにはドメインが必要です" unless email.include?(".")

    # すべてのチェックに合格
    nil
  end

  def validate_age(age: Integer | String | nil): String | nil
    return "年齢は必須です" if age.nil?

    # 文字列の場合は整数に変換
    age_int: Integer

    if age.is_a?(Integer)
      age_int = age
    else
      # ここでageはString
      return "年齢は数値である必要があります" if age.to_i.to_s != age
      age_int = age.to_i
    end

    # ここでage_intは確実にInteger
    return "年齢は正の数である必要があります" if age_int < 0
    return "年齢は現実的である必要があります" if age_int > 150

    nil
  end

  def validate_form(
    name: String | nil,
    email: String | nil,
    age: Integer | String | nil
  ): Hash<Symbol, Array<String>>
    errors: Hash<Symbol, Array<String>> = {}

    # 名前の検証
    name_error = validate_field("名前", name, true)
    if !name_error.nil?
      errors[:name] = [name_error]
    end

    # メールの検証
    email_error = validate_email(email)
    if !email_error.nil?
      errors[:email] = [email_error]
    end

    # 年齢の検証
    age_error = validate_age(age)
    if !age_error.nil?
      errors[:age] = [age_error]
    end

    errors
  end
end

# 使用法
validator = FormValidator.new()

# 有効なフォーム
errors1 = validator.validate_form("Alice", "alice@example.com", 30)
# {}を返す

# 無効なフォーム
errors2 = validator.validate_form(nil, "invalid-email", -5)
# {
#   name: ["名前は必須です"],
#   email: ["メールアドレスには@が必要です"],
#   age: ["年齢は正の数である必要があります"]
# }を返す
```

## ナローイングの制限

型ナローイングには注意すべきいくつかの制限があります：

### 関数呼び出し間でナローイングが維持されない

```trb title="narrowing_limits.trb"
def helper(value: String | Integer)
  # 呼び出し元のナローイングに依存できない
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

def caller(value: String | Integer)
  if value.is_a?(String)
    # ここでvalueはString
    result = helper(value)  # しかしhelperはこれを知らない
  end
end
```

### 変更後はナローイングが機能しない

```trb title="mutation_limits.trb"
def example(value: String | Integer)
  if value.is_a?(String)
    # ここでvalueはString
    value = value.to_i
    # valueは今Integer、Stringではない！
  end

  # ここでvalueがStringであると仮定できない
end
```

### 複雑な条件はナローイングできないことがある

```trb title="complex_limits.trb"
def complex(a: String | nil, b: String | nil): String
  # これは機能する
  if !a.nil? && !b.nil?
    # ここでaとbは両方String
    a + b
  else
    "値が欠落"
  end
end

def very_complex(value: String | Integer | nil): String
  # 非常に複雑な条件は期待通りにナローイングできないことがある
  # よりシンプルで明示的なチェックを使用するのが良い
  if value.is_a?(String)
    value
  elsif value.is_a?(Integer)
    value.to_s
  else
    "nil"
  end
end
```

## ベストプラクティス

### 1. ガード節を使用

```trb title="guard_clauses.trb"
# 良い - 早期リターンでナローイングが明確
def process(value: String | nil): String
  return "空" if value.nil?

  # ここからvalueはString
  value.upcase
end

# 避ける - ネストしたifは追いにくい
def process_nested(value: String | nil): String
  if !value.nil?
    value.upcase
  else
    "空"
  end
end
```

### 2. nilを最初にチェック

```trb title="nil_first.trb"
# 良い - 他の型の前にnilをチェック
def process(value: String | Integer | nil): String
  return "なし" if value.nil?

  if value.is_a?(String)
    value
  else
    value.to_s
  end
end
```

### 3. 具体的な型チェックを使用

```trb title="specific_checks.trb"
# 良い - 具体的な型チェック
def process(value: String | Integer): String
  if value.is_a?(String)
    value.upcase
  else
    value.to_s
  end
end

# 避ける - 曖昧なチェック
def process_vague(value: String | Integer): String
  if value.respond_to?(:upcase)
    # 型チェッカーにとって不明確
    value.upcase
  else
    value.to_s
  end
end
```

## まとめ

T-Rubyの型ナローイングは、型チェッカーが自動的に型を具体化することを可能にします：

- **タイプガード**: `is_a?`、`nil?`、比較演算子
- **制御フロー**: if/elsif/else、case/when、三項演算子で機能
- **論理演算子**: `&&`と`||`で組み合わせたチェックが可能
- **早期リターン**: ガード節が残りのコードの型を絞り込む
- **ブロック**: ブロックスコープ内でナローイングが機能

型ナローイングは、型をチェックした後に型固有のメソッドに安全にアクセスできるようにすることで、Union型を実用的にします。Union型と組み合わせることで、多様なデータを処理する強力で型安全な方法を提供します。

次の章では、正確な値を型として指定できるリテラル型について学びます。
