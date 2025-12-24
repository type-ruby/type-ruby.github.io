---
slug: type-inference-released
title: "型推論：少なく書いて、より多く型付け"
authors: [yhk1038]
tags: [release, feature]
---

T-Rubyがコードから戻り値の型を自動的に推論するようになりました。明らかな型に対して明示的なアノテーションは不要です！

## 新機能

以前は、こう書く必要がありました：

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

今では、戻り値の型はオプションです：

```ruby
def greet(name: String)
  "Hello, #{name}!"
end
```

T-Rubyは`greet`が`String`を返すと推論し、正しいRBSを生成します：

```rbs
def greet: (name: String) -> String
```

## 動作原理

新しい型推論エンジンはメソッド本体を分析して戻り値の型を決定します：

- **リテラル推論**：`"hello"` → `String`、`42` → `Integer`
- **メソッド呼び出しの追跡**：`str.upcase` → `String`
- **暗黙的な戻り値**：Rubyの最後の式が戻り値の型になる
- **条件文の処理**：`if`/`else`分岐からのユニオン型

## 例

### シンプルなメソッド

```ruby
class Calculator
  def double(n: Integer)
    n * 2
  end

  def is_positive?(n: Integer)
    n > 0
  end
end
```

生成されたRBS：

```rbs
class Calculator
  def double: (n: Integer) -> Integer
  def is_positive?: (n: Integer) -> bool
end
```

### インスタンス変数

```ruby
class User
  def initialize(name: String)
    @name = name
  end

  def greeting
    "Hello, #{@name}!"
  end
end
```

生成されたRBS：

```rbs
class User
  @name: String

  def initialize: (name: String) -> void
  def greeting: () -> String
end
```

## 技術的詳細

推論システムはTypeScriptのアプローチに触発されています：

- **BodyParser**：T-Rubyメソッド本体をIRノードにパース
- **TypeEnv**：変数型追跡のためのスコープチェーンを管理
- **ASTTypeInferrer**：遅延評価とキャッシングでIRを走査

実装の詳細については、[技術ブログ記事](/blog/typescript-style-type-inference)をご覧ください。

## 今すぐ試す

最新のT-Rubyにアップデートして、自動型推論をお楽しみください：

```bash
gem update t-ruby
```

既存のコードは以前と同じように動作します - 明示的な型は引き続き優先されます。推論は戻り値の型が省略された場合にのみ機能します。

## フィードバック

型推論の使用経験をお聞きしたいです。エッジケースを見つけましたか？提案がありますか？[GitHub](https://github.com/aspect-build/t-ruby)でイシューを開いてください。

ハッピータイピング！
