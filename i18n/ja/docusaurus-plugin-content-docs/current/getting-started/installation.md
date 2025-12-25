---
sidebar_position: 1
title: インストール
description: T-Rubyのインストール方法
---

<DocsBadge />


# インストール

このガイドでは、T-Rubyをシステムにインストールする方法を説明します。T-RubyにはRuby 3.0以上が必要です。

## 前提条件

T-Rubyをインストールする前に、以下が必要です：

- **Ruby 3.0+** がインストール済み ([ruby-lang.org](https://www.ruby-lang.org/ja/downloads/))
- **RubyGems** (Rubyに付属)
- ターミナル/コマンドプロンプト

Rubyのインストールを確認するには：

```bash
ruby --version
# 出力例: ruby 3.x.x ...
```

## RubyGemsでのインストール

T-Rubyをインストールする最も簡単な方法はRubyGemsを使用することです：

```bash
gem install t-ruby
```

これにより`trc`コンパイラがシステムにグローバルにインストールされます。

インストールの確認：

```bash
trc --version
# 出力例: trc x.x.x
```

## Bundlerでのインストール

プロジェクト固有のインストールには、`Gemfile`にT-Rubyを追加します：

```ruby title="Gemfile"
group :development do
  gem 't-ruby'
end
```

その後、実行：

```bash
bundle install
```

コンパイラを実行するには`bundle exec trc`を使用します：

```bash
bundle exec trc --version
```

## ソースからのインストール

最新の開発バージョンを使用するには：

```bash
git clone https://github.com/type-ruby/t-ruby.git
cd t-ruby
bundle install
rake install
```

## インストールの確認

インストール後、すべてが動作するか確認します：

```bash
# バージョン確認
trc --version

# ヘルプを表示
trc --help

# テストファイルを作成
echo 'def greet(name: String): String; "Hello, #{name}!"; end' > test.trb

# コンパイル
trc test.trb

# 出力を確認
cat build/test.rb
```

## T-Rubyの更新

最新バージョンに更新するには：

```bash
gem update t-ruby
```

## アンインストール

T-Rubyを削除するには：

```bash
gem uninstall t-ruby
```

## トラブルシューティング

### "Command not found: trc"

gemのバイナリパスがPATHに含まれていない可能性があります。以下で確認してください：

```bash
gem environment | grep "EXECUTABLE DIRECTORY"
```

そのディレクトリをシェルのPATHに追加してください。

### Linux/macOSでの権限エラー

権限エラーが発生した場合、以下のいずれかを試してください：

1. Rubyバージョンマネージャーを使用 (rbenv, rvm)
2. `sudo gem install t-ruby`を使用（非推奨）
3. ホームディレクトリにインストールするようgemを設定

### ビルドエラー

コンパイルが失敗した場合、開発ツールがインストールされているか確認してください：

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential

# Fedora
sudo dnf groupinstall "Development Tools"
```

## 次のステップ

T-Rubyがインストールされたので、コードを書いてみましょう：

- [クイックスタート](/docs/getting-started/quick-start) - 5分で始める
- [.trbファイルを理解する](/docs/getting-started/understanding-trb-files) - 詳細なガイド
- [エディタ設定](/docs/getting-started/editor-setup) - IDEの設定
