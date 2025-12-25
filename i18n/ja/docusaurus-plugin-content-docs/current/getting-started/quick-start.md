---
sidebar_position: 2
title: クイックスタート
description: 最初のT-Rubyプログラムを書く
---

<DocsBadge />


# クイックスタート

5分でT-Rubyの基本を学びましょう！

## プロジェクト初期化

プロジェクトルートに`trbconfig.yml`を作成してソースと出力ディレクトリを設定します。`trc --init`で生成できます：

```bash
mkdir my-project && cd my-project
trc --init
```

以下のファイルが作成されます：
- `trbconfig.yml` - [コンパイラ設定](/docs/cli/configuration)
- `src/` - .trbファイル用のソースディレクトリ
- `build/` - コンパイル済みファイル用の出力ディレクトリ

## ウォッチモード実行

ウォッチモードを実行すると、ファイル保存時に自動的にコンパイルされます：

```bash
trc --watch
```

このターミナルは開いたまま、次のステップに進んでください。

## 最初のT-Rubyファイル

新しいターミナルを開いて、`src/hello.trb`ファイルを作成しましょう：

```trb title="src/hello.trb"
# 型付き関数
def greet(name: String): String
  "こんにちは、#{name}さん！"
end

# 変数の型アノテーション
message: String = greet("世界")
puts message

# Union型
id: String | Integer = "user-123"

# オプショナル型（nilになる可能性がある）
nickname: String? = nil
```

ファイルを保存すると、ウォッチモードが自動的にコンパイルします。`build/`ディレクトリに2つのファイルが生成されます：
- `hello.rb` - 純粋なRubyコード
- `hello.rbs` - RBS型定義

## 実行

生成されたRubyファイルを実行します：

```bash
ruby build/hello.rb
# 出力: こんにちは、世界さん！
```

## 基本型

T-RubyはRubyの基本型をすべてサポートしています：

```trb
# 基本型
name: String = "田中太郎"
age: Integer = 25
height: Float = 175.5
is_active: Boolean = true
role: Symbol = :admin

# コレクション
numbers: Array<Integer> = [1, 2, 3, 4, 5]
scores: Hash<String, Integer> = { "数学" => 100, "英語" => 95 }

# Nil許容（オプショナル）
email: String? = nil
```

## 関数の型

関数のパラメータと戻り値の型を指定します：

```trb
# 基本的な関数
def add(a: Integer, b: Integer): Integer
  a + b
end

# 戻り値のない関数
def log(message: String): void
  puts message
end

# オプショナルパラメータ
def greet(name: String, greeting: String = "こんにちは"): String
  "#{greeting}、#{name}さん！"
end

# Union戻り値型
def find_user(id: Integer): User | nil
  # Userを見つけるかnilを返す
end
```

## クラスの型

クラスに型を適用します：

```trb
class User
  @name: String
  @email: String
  @age: Integer?

  def initialize(name: String, email: String): void
    @name = name
    @email = email
    @age = nil
  end

  def name: String
    @name
  end

  def email: String
    @email
  end

  def adult?: Boolean
    @age.nil? ? false : @age >= 18
  end
end
```

## 次のステップ

おめでとうございます！T-Rubyの基本を学びました。さらに詳しく学ぶには：

- [.trbファイルを理解する](/docs/getting-started/understanding-trb-files) - 詳細な最初のファイルガイド
- [エディタ設定](/docs/getting-started/editor-setup) - VS Codeなどのエディタ設定
- [基本構文](/docs/learn/basics/type-annotations) - T-Ruby構文を詳しく学ぶ
