---
slug: introducing-t-ruby
title: T-Ruby のご紹介
authors: [yhk1038]
tags: [announcement]
---

Ruby 向けの TypeScript スタイル静的型システム、T-Ruby をご紹介します。

T-Ruby は、TypeScript 開発者にとって馴染みのある開発体験を Ruby 開発者に提供し、コードに直接型アノテーションを追加して、ランタイム前に型エラーを検出できるようにします。

## 主な機能

- **TypeScript スタイルの構文**: TypeScript 開発者に馴染みのある型アノテーション構文
- **段階的な型付け**: 既存の Ruby コードベースに段階的に型を追加可能
- **RBS 生成**: `.rbs` シグネチャファイルの自動生成
- **ゼロランタイムオーバーヘッド**: コンパイル時に型が削除される

## はじめに

T-Ruby をインストールして、Ruby コードに型を追加しましょう：

```bash
gem install t-ruby
```

最初の `.trb` ファイルを作成します：

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

Ruby にコンパイル：

```bash
trc greet.trb
```

詳細については、[ドキュメント](/docs/introduction/what-is-t-ruby)をご覧ください！
