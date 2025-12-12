---
sidebar_position: 1
title: インストール
description: T-RubyコンパイラとCLIツールのインストール
---

<DocsBadge />


# インストール

このガイドでは、T-Rubyコンパイラをシステムにインストールするさまざまな方法を説明します。

## 前提条件

- Ruby 3.0以上
- Node.js 18以上（npmパッケージを使用する場合）

## npmでのインストール（推奨）

最も素早く始める方法はnpmを使うことです：

```bash
npm install -g t-ruby
```

インストールの確認：

```bash
trc --version
```

## RubyGemsでのインストール

Ruby gemsを好む場合：

```bash
gem install t-ruby
```

## ソースからのビルド

開発バージョンや貢献のためにソースからビルドできます：

```bash
# リポジトリをクローン
git clone https://github.com/type-ruby/t-ruby.git
cd t-ruby

# 依存関係をインストール
bundle install
npm install

# ビルド
npm run build

# グローバルインストール（オプション）
npm link
```

## プロジェクトのセットアップ

既存のプロジェクトにT-Rubyを追加する最良の方法：

```bash
cd my-project
npm init -y  # package.jsonがない場合
npm install --save-dev t-ruby
```

その後、`package.json`にスクリプトを追加：

```json
{
  "scripts": {
    "build": "trc src/**/*.trb",
    "check": "trc --check src/**/*.trb",
    "watch": "trc --watch src/**/*.trb"
  }
}
```

## インストールの確認

インストールが正常に行われたか確認するには：

```bash
# バージョン確認
trc --version

# ヘルプを見る
trc --help

# テストコンパイル
echo 'def add(a: Integer, b: Integer): Integer
  a + b
end' > test.trb

trc test.trb

# 出力を確認
cat test.rb
```

## トラブルシューティング

### Node.jsが見つからない

npmでインストールしたのに`trc`コマンドが見つからない場合、npmのグローバルbinディレクトリがPATHに入っているか確認してください：

```bash
# npmグローバルbinの場所を確認
npm bin -g

# そのパスをPATHに追加（例）
export PATH="$PATH:$(npm bin -g)"
```

### 権限エラー

Linux/macOSで権限エラーが発生する場合、npmグローバルインストール設定を確認してください：

```bash
# npm prefixを確認
npm config get prefix

# 権限なしでインストールするにはprefixを変更
npm config set prefix ~/.npm-global
export PATH="$PATH:~/.npm-global/bin"
```

## 次のステップ

- [クイックスタート](/docs/getting-started/quick-start) - 最初のプログラムを書く
- [エディタ設定](/docs/getting-started/editor-setup) - IDE サポートの設定
- [プロジェクト設定](/docs/getting-started/project-configuration) - T-Rubyプロジェクトの設定オプション
