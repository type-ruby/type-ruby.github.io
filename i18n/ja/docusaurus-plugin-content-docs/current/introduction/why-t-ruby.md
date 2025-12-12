---
sidebar_position: 2
title: なぜT-Rubyなのか？
description: T-Rubyの利点と開発動機
---

<DocsBadge />


# なぜT-Rubyなのか？

Rubyは表現力と開発者の幸福で知られる美しい言語です。しかし、プロジェクトが大きくなるにつれて、静的型の欠如は見つけにくいバグにつながる可能性があります。T-RubyはRubyを素晴らしくするすべてを保持しながら、この問題に対処します。

## 大規模な動的型付けの問題

このような一般的なシナリオを考えてみましょう：

```ruby
# 誰かがこのAPIを書きます
def fetch_user(id)
  User.find(id)
end

# 数ヶ月後、別の人が呼び出します
user = fetch_user("123")  # バグ！Integerであるべき
```

このバグは実行時まで—おそらく本番環境で—表面化しません。T-Rubyを使用すると：

```trb title="T-Ruby使用"
def fetch_user(id: Integer): User
  User.find(id)
end

user = fetch_user("123")  # コンパイルエラー！IntegerではなくStringを受け取った
```

コードが実行される前に、エラーが即座に検出されます。

## T-Rubyの利点

### 1. バグを早期に発見

型エラーは実行時ではなくコンパイル時に検出されます。これは次のことを意味します：

- 本番環境でのバグが減少
- より速いデバッグサイクル
- リファクタリング時の自信

```trb
def process_payment(amount: Float, currency: String): PaymentResult
  # 型チェッカーが保証します：
  # - amountは常にFloat
  # - currencyは常にString
  # - 戻り値は必ずPaymentResult
end

# これらはすべてコンパイル時エラーになります：
process_payment("100", "USD")      # エラー: StringはFloatではない
process_payment(100.0, :usd)       # エラー: SymbolはStringではない
process_payment(100.0, "USD").foo  # エラー: PaymentResultに'foo'メソッドがない
```

### 2. より良い開発者体験

型は決して古くならないドキュメントとして機能します：

```trb
# 型なし - これは何を返す？何を渡すべき？
def transform(data, options = {})
  # ...
end

# 型あり - 明確
def transform(data: Array<Record>, options: TransformOptions?): TransformResult
  # ...
end
```

IDEが提供できるもの：
- インテリジェントな自動補完
- インライン型情報
- リファクタリングサポート
- 実際に機能する定義へのジャンプ

### 3. 段階的な導入

コードベース全体を書き直す必要はありません。T-Rubyは段階的な型付けをサポートします：

```trb
# 最も重要なコードから始めましょう
def charge_customer(customer_id: Integer, amount: Float): ChargeResult
  # この関数は型安全になりました
  legacy_billing_system(customer_id, amount)
end

# レガシーコードは型なしのままでOK
def legacy_billing_system(customer_id, amount)
  # まだ正常に動作します
end
```

### 4. ゼロランタイムコスト

ランタイムチェックを追加する一部の型システムとは異なり、T-Rubyの型はコンパイル中に完全に消去されます：

```trb title="コンパイル前 (app.trb)"
def multiply(a: Integer, b: Integer): Integer
  a * b
end
```

```ruby title="コンパイル後 (app.rb)"
def multiply(a, b)
  a * b
end
```

出力は手書きと全く同じです。パフォーマンスオーバーヘッドも、依存関係も、魔法もありません。

### 5. エコシステム統合

T-Rubyは標準のRBSファイルを生成し、既存のRuby型エコシステムと統合します：

- **Steep**を使用した追加の型チェック
- **Ruby LSP**によるIDEサポート
- **Sorbet**の型定義と互換
- すべての既存Ruby gemと連携

## T-Rubyを使用するタイミング

T-Rubyは特に以下の場合に価値があります：

| ユースケース | 利点 |
|----------|---------|
| **大規模コードベース** | 型がバグを防ぎ、リファクタリングをより安全に |
| **チームプロジェクト** | 型が開発者間のドキュメントと契約として機能 |
| **クリティカルシステム** | 本番環境に到達する前にエラーを検出 |
| **ライブラリ作者** | ユーザーに型情報を提供 |
| **Ruby学習** | 型がAPIの理解とミスの発見に役立つ |

## 型が過剰な場合

型は若干のオーバーヘッドを追加します。非常に小さなスクリプトや素早いプロトタイプの場合、型なしのRubyの方が適切かもしれません：

```trb
# クイックスクリプトの場合、これで十分
puts "Hello, #{ARGV[0]}!"

# これは不要：
# def main(args: Array<String>): void
#   puts "Hello, #{args[0]}!"
# end
```

T-Rubyの美しさは、いつどこで型を追加するかを**あなたが選べる**ことです。

## TypeScriptの成功物語

TypeScriptは、動的言語に型を正しく追加できることを証明しました：

1. **段階的な導入** - 小さく始めて、有機的に成長
2. **型消去** - ランタイムオーバーヘッドなし
3. **エコシステム統合** - 既存コードと連携

T-Rubyはこの実証済みのアプローチをRubyにもたらします。TypeScriptが大規模なJavaScript開発を管理可能にしたように、T-RubyはRubyで同じことができます。

## 次のステップ

納得しましたか？始めましょう：

1. [T-Rubyをインストール](/docs/getting-started/installation)
2. [最初の型付きRubyを書く](/docs/getting-started/quick-start)
3. [型システムを学ぶ](/docs/learn/basics/type-annotations)
