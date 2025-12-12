---
sidebar_position: 3
title: T-Ruby vs 他のツール
description: T-RubyとTypeScript、RBS、Sorbetの比較
---

<DocsBadge />


# T-Ruby vs 他のツール

Rubyエコシステムには静的型付けに対するいくつかのアプローチがあります。このページでは、T-Rubyがどこに位置するかを理解するために、他のソリューションと比較します。

## クイック比較

| 機能 | T-Ruby | RBS | Sorbet | TypeScript |
|---------|--------|-----|--------|------------|
| **言語** | Ruby | Ruby | Ruby | JavaScript |
| **型構文** | インライン | 別ファイル | コメント + sig | インライン |
| **コンパイル** | あり (.trb → .rb) | N/A | なし | あり (.ts → .js) |
| **ランタイムチェック** | なし | なし | オプション | なし |
| **段階的型付け** | あり | あり | あり | あり |
| **ジェネリック型** | あり | あり | あり | あり |
| **学習曲線** | 低い (TypeScript風) | 中程度 | 高い | - |

## T-Ruby vs RBS

**RBS**はRuby 3.0で導入されたRubyの公式型シグネチャ形式です。

### RBSアプローチ

型は別の`.rbs`ファイルに書かれます：

```ruby title="lib/user.rb"
class User
  def initialize(name, age)
    @name = name
    @age = age
  end

  def greet
    "Hello, I'm #{@name}"
  end
end
```

```rbs title="sig/user.rbs"
class User
  @name: String
  @age: Integer

  def initialize: (String name, Integer age) -> void
  def greet: () -> String
end
```

### T-Rubyアプローチ

型はインラインで書かれます：

```trb title="lib/user.trb"
class User
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def greet: String
    "Hello, I'm #{@name}"
  end
end
```

### 主な違い

| 側面 | T-Ruby | RBS |
|--------|--------|-----|
| 型の場所 | コードと同じファイル | 別の.rbsファイル |
| 同期 | 自動 | 手動（ドリフトの可能性） |
| 可読性 | コーディング中に型が見える | 2つのファイルを確認する必要 |
| 生成出力 | .rb + .rbs | .rbsのみ |

**RBSを選ぶとき：**
- Rubyソースファイルを変更できない場合
- サードパーティライブラリを扱う場合
- チームが関心の分離を好む場合

**T-Rubyを選ぶとき：**
- 型をコードと一緒に置きたい場合
- TypeScriptから来た場合
- 自動RBS生成が欲しい場合

## T-Ruby vs Sorbet

**Sorbet**はStripeが開発した型チェッカーです。

### Sorbetアプローチ

型は`sig`ブロックとT::構文を使用します：

```ruby title="lib/calculator.rb"
# typed: strict
require 'sorbet-runtime'

class Calculator
  extend T::Sig

  sig { params(a: Integer, b: Integer).returns(Integer) }
  def add(a, b)
    a + b
  end

  sig { params(items: T::Array[String]).returns(String) }
  def join(items)
    items.join(", ")
  end
end
```

### T-Rubyアプローチ

```trb title="lib/calculator.trb"
class Calculator
  def add(a: Integer, b: Integer): Integer
    a + b
  end

  def join(items: Array<String>): String
    items.join(", ")
  end
end
```

### 主な違い

| 側面 | T-Ruby | Sorbet |
|--------|--------|--------|
| 構文スタイル | TypeScript風 | Ruby DSL |
| ランタイム依存 | なし | sorbet-runtime gem |
| ランタイムチェック | なし | オプション |
| コンパイル | 必須 | 不要 |
| 冗長性 | 低い | 高い |

**ランタイムチェック付きSorbetの例：**
```ruby
# Sorbetはランタイムで型をチェックできる
sig { params(name: String).returns(String) }
def greet(name)
  "Hello, #{name}"
end

greet(123)  # ランタイムチェックが有効ならTypeError発生
```

**T-Rubyアプローチ：**
```trb
# 型はコンパイル時のみ
def greet(name: String): String
  "Hello, #{name}"
end

greet(123)  # コンパイルエラー（実行前に検出）
```

**Sorbetを選ぶとき：**
- ランタイム型チェックが必要な場合
- すでにプロジェクトでSorbetを使用している場合
- コンパイルステップを避けたい場合

**T-Rubyを選ぶとき：**
- よりクリーンで読みやすい構文が欲しい場合
- ランタイム依存を避けたい場合
- TypeScriptから来た場合

## T-Ruby vs TypeScript

T-RubyはTypeScriptにインスパイアされているので、比較してみましょう：

### 構文比較

```typescript title="TypeScript"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

interface User {
  name: string;
  age: number;
}

function processUser<T extends User>(user: T): string {
  return user.name;
}
```

```trb title="T-Ruby"
def greet(name: String): String
  "Hello, #{name}!"
end

interface User
  def name: String
  def age: Integer
end

def process_user<T: User>(user: T): String
  user.name
end
```

### 類似点

- インライン型アノテーション
- 型消去（ランタイムオーバーヘッドなし）
- 段階的型付けサポート
- Union型（`String | Integer`）
- ジェネリック型（`Array<T>`）
- インターフェース定義

### 違い

| 側面 | T-Ruby | TypeScript |
|--------|--------|------------|
| ベース言語 | Ruby | JavaScript |
| 型名 | PascalCase (String, Integer) | 小文字 (string, number) |
| Null型 | `nil` | `null`, `undefined` |
| オプショナル | `T?` または `T \| nil` | `T \| null` または `T?` |
| メソッド構文 | Rubyの`def` | 関数式 |

## 統合：複数ツールの併用

T-RubyはRBSファイルを生成するため、他のツールと一緒に使用できます：

```
┌─────────────┐
│    .trb     │
│   files     │
└──────┬──────┘
       │ trc compile
       ▼
┌─────────────┐     ┌─────────────┐
│    .rb      │     │    .rbs     │
│   files     │     │   files     │
└─────────────┘     └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌──────────┐  ┌──────────┐   ┌──────────┐
      │  Steep   │  │ Ruby LSP │   │  Sorbet  │
      │  checker │  │   IDE    │   │(optional)│
      └──────────┘  └──────────┘   └──────────┘
```

## 推奨

| もし... | 検討すべき |
|-----------|----------|
| 新しいRubyプロジェクトを始めるなら | **T-Ruby** - クリーンな構文、良いDX |
| 既存のSorbetコードベースがあるなら | **Sorbet** - 移行コスト回避 |
| ランタイム型チェックが必要なら | **Sorbet** - 組み込みサポート |
| 型をコードから分離したいなら | **RBS** - 公式フォーマット |
| TypeScriptから来たなら | **T-Ruby** - 馴染みのある構文 |
| 大きなチームで働くなら | **T-Ruby** または **Sorbet** - どちらも有効 |

## 結論

T-RubyはRuby型に対する現代的なTypeScriptインスパイアのアプローチを提供します：

- クリーンなインライン構文
- ゼロランタイムオーバーヘッド
- エコシステム互換のための自動RBS生成

RBSやSorbetを置き換えることではありません—Ruby開発者に、ワークフローや好みにより適した別のオプションを提供することです。
