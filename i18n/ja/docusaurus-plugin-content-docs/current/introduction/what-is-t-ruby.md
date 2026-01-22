---
sidebar_position: 1
title: T-Rubyとは？
description: T-Rubyの紹介 - RubyのためのTypeScriptスタイル型システム
---

<DocsBadge />


# T-Rubyとは？

T-RubyはRubyにTypeScriptスタイルの型構文を導入する新しいアプローチです。TypeScriptがJavaScriptに対して行うことを、Rubyにももたらします。

## コアアイデア

TypeScriptがJavaScriptに型安全性を追加するように、T-RubyはRubyに同じ機能を提供します。型アノテーション付きのRubyコードを`.trb`ファイルに書くと、T-Rubyがそれを純粋なRubyコードとRBS型定義にコンパイルします。

```trb
# 入力: hello.trb
def greet(name: String): String
  "こんにちは、#{name}さん！"
end

user: User | nil = find_user(123)
```

```ruby
# 出力: hello.rb（型なしの純粋なRuby）
def greet(name)
  "こんにちは、#{name}さん！"
end

user = find_user(123)
```

```rbs
# 出力: hello.rbs（RBS型定義）
def greet: (String) -> String
```

## なぜT-Ruby？

### 馴染みのある構文

T-Rubyの型構文はTypeScriptから直接インスピレーションを受けています。TypeScriptを使ったことがあれば、T-Rubyもすぐに理解できます。

```trb
# Union型
id: String | Integer = "user-123"

# オプショナル型
name: String? = nil

# ジェネリクス
users: User[] = []

# インターフェース
interface Printable
  def to_s: String
end
```

### ゼロランタイムオーバーヘッド

T-Rubyの型はビルド時にのみ存在します。コンパイルされたRubyコードには型情報が一切含まれず、パフォーマンスの低下なく実行されます。

### Rubyエコシステムとの互換性

T-RubyはRBSファイルを生成します。これにより：
- Steep、Sorbetなど既存のRuby型チェッカーと一緒に使用可能
- 既存のRBS型定義を活用可能
- 段階的な導入が可能 - 一度にすべてのコードを変換する必要はありません

## 仕組み

1. **書く**: 型アノテーション付きのRubyコードを`.trb`ファイルに書く
2. **コンパイル**: `trc`コマンドでコンパイル
3. **実行**: 生成された`.rb`ファイルを通常のRubyとして実行
4. **チェック**: RBSファイルで静的型チェックを実行

## 次のステップ

- [なぜT-Ruby？](/docs/introduction/why-t-ruby) - T-Rubyの利点を詳しく知る
- [インストール](/docs/getting-started/installation) - T-Rubyのインストールを始める
- [クイックスタート](/docs/getting-started/quick-start) - 最初のT-Rubyプロジェクトを作成
