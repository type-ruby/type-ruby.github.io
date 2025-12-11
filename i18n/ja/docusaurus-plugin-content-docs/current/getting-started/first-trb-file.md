---
sidebar_position: 3
title: 最初の.trbファイル
description: 最初のT-Rubyファイルの作成とコンパイル
---

# 最初の.trbファイル

このガイドでは、T-Rubyファイルをステップバイステップで作成しながら、各概念を説明します。

## .trbファイルの理解

`.trb`ファイルはT-Rubyソースファイルです。基本的に型アノテーション付きのRubyコードです。T-Rubyコンパイラ（`trc`）は`.trb`ファイルを読み込み、以下を生成します：

1. **`.rb`ファイル** - 型が削除された標準Rubyコード
2. **`.rbs`ファイル** - ツール用の型シグネチャファイル

## ファイルの作成

シンプルな計算機を実装する`calculator.trb`ファイルを作成しましょう：

```ruby title="calculator.trb"
# calculator.trb - シンプルな型付き計算機

# 型アノテーション付きの基本算術演算
def add(a: Integer, b: Integer): Integer
  a + b
end

def subtract(a: Integer, b: Integer): Integer
  a - b
end

def multiply(a: Integer, b: Integer): Integer
  a * b
end

def divide(a: Integer, b: Integer): Float
  a.to_f / b
end
```

### 型付き関数の構造

構文を分解してみましょう：

```ruby
def add(a: Integer, b: Integer): Integer
#   ^^^  ^  ^^^^^^^  ^  ^^^^^^^   ^^^^^^^
#   |    |    |      |    |         |
#   |    |    |      |    |         └── 戻り値の型
#   |    |    |      |    └── 第2パラメータの型
#   |    |    |      └── 第2パラメータ名
#   |    |    └── 第1パラメータの型
#   |    └── 第1パラメータ名
#   └── 関数名
```

## より多くの機能を追加

計算機をより高度な機能で拡張しましょう：

```ruby title="calculator.trb"
# よりクリーンなコードのための型エイリアス
type Number = Integer | Float

# 関数がIntegerとFloatの両方を受け入れるようになりました
def add(a: Number, b: Number): Number
  a + b
end

def subtract(a: Number, b: Number): Number
  a - b
end

def multiply(a: Number, b: Number): Number
  a * b
end

def divide(a: Number, b: Number): Float
  a.to_f / b.to_f
end

# 失敗する可能性のある関数 - エラー時にnilを返す
def safe_divide(a: Number, b: Number): Float | nil
  return nil if b == 0
  a.to_f / b.to_f
end

# ユーティリティ関数にジェネリック型を使用
def max<T: Comparable>(a: T, b: T): T
  a > b ? a : b
end
```

### Union型の理解

`|`演算子はunion型を作成します：

```ruby
type Number = Integer | Float  # IntegerまたはFloatになれる

def safe_divide(a: Number, b: Number): Float | nil
  # 戻り値の型はFloatまたはnil
  return nil if b == 0
  a.to_f / b.to_f
end
```

### ジェネリクスの理解

`<T>`構文はジェネリック型パラメータを定義します：

```ruby
def max<T: Comparable>(a: T, b: T): T
#     ^^  ^^^^^^^^^^
#     |       |
#     |       └── 制約: TはComparableを実装する必要がある
#     └── ジェネリック型パラメータ

# 任意の比較可能な型で動作します：
max(5, 3)       # TはInteger
max(5.5, 3.2)   # TはFloat
max("a", "b")   # TはString
```

## クラスの追加

Calculatorクラスを作成しましょう：

```ruby title="calculator.trb"
class Calculator
  # 型アノテーション付きインスタンス変数
  @history: Array<String>

  def initialize: void
    @history = []
  end

  def add(a: Number, b: Number): Number
    result = a + b
    record_operation("#{a} + #{b} = #{result}")
    result
  end

  def subtract(a: Number, b: Number): Number
    result = a - b
    record_operation("#{a} - #{b} = #{result}")
    result
  end

  def multiply(a: Number, b: Number): Number
    result = a * b
    record_operation("#{a} * #{b} = #{result}")
    result
  end

  def divide(a: Number, b: Number): Float | nil
    if b == 0
      record_operation("#{a} / #{b} = ERROR（ゼロ除算）")
      return nil
    end
    result = a.to_f / b.to_f
    record_operation("#{a} / #{b} = #{result}")
    result
  end

  def history: Array<String>
    @history.dup
  end

  private

  def record_operation(operation: String): void
    @history << operation
  end
end

# クラスの使用
calc = Calculator.new
puts calc.add(10, 5)      # 15
puts calc.multiply(3, 4)  # 12
puts calc.divide(10, 3)   # 3.333...
puts calc.divide(10, 0)   # nil

puts "\n履歴:"
calc.history.each { |op| puts "  #{op}" }
```

## コンパイルと実行

```bash
# コンパイル
trc calculator.trb

# 実行
ruby build/calculator.rb
```

期待される出力：
```
15
12
3.3333333333333335

履歴:
  10 + 5 = 15
  3 * 4 = 12
  10 / 3 = 3.3333333333333335
```

## 出力の確認

生成されたファイルを見てみましょう：

```ruby title="build/calculator.rb"
class Calculator
  def initialize
    @history = []
  end

  def add(a, b)
    result = a + b
    record_operation("#{a} + #{b} = #{result}")
    result
  end

  # ... 型は完全に削除される
end
```

```ruby title="build/calculator.rbs"
type Number = Integer | Float

class Calculator
  @history: Array[String]

  def initialize: () -> void
  def add: (Number a, Number b) -> Number
  def subtract: (Number a, Number b) -> Number
  def multiply: (Number a, Number b) -> Number
  def divide: (Number a, Number b) -> Float?
  def history: () -> Array[String]
  private def record_operation: (String operation) -> void
end
```

## 一般的なパターン

### オプショナルパラメータ

```ruby
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

greet("Alice")           # "Hello, Alice!"
greet("Alice", "Hi")     # "Hi, Alice!"
```

### Nullable型（オプショナルの短縮形）

```ruby
# これらは同等です：
def find(id: Integer): User | nil
def find(id: Integer): User?  # 短縮形
```

### ブロックパラメータ

```ruby
def each_item(items: Array<String>, &block: (String) -> void): void
  items.each(&block)
end

each_item(["a", "b", "c"]) { |item| puts item }
```

## エラーメッセージ

T-Rubyは役立つエラーメッセージを提供します。遭遇する可能性のあるいくつかを紹介します：

### 型の不一致
```
Error: calculator.trb:5:10
  型の不一致: IntegerではなくStringを受け取りました

    add("hello", 5)
        ^^^^^^^
```

### 型アノテーションの欠落
```
Warning: calculator.trb:3:5
  パラメータ'x'に型アノテーションがありません

    def process(x)
                ^
```

### 不明な型
```
Error: calculator.trb:2:15
  不明な型'Stringg'（'String'の間違いですか？）

    def greet(name: Stringg): String
                    ^^^^^^^
```

## ベストプラクティス

1. **パブリックAPIから始める** - パブリックメソッドに最初に型を付ける
2. **型エイリアスを使用** - 複雑な型を読みやすくする
3. **具体的な型を優先** - `Array`より`Array<String>`
4. **型でドキュメント化** - 型はドキュメントとして機能する

## 次のステップ

`.trb`ファイルを理解したら、次に進みましょう：

- [エディタ設定](/docs/getting-started/editor-setup) - IDEサポートを得る
- [プロジェクト設定](/docs/getting-started/project-configuration) - 大規模プロジェクトの設定
- [基本型](/docs/learn/basics/basic-types) - 型システムを深く学ぶ
