---
sidebar_position: 2
title: Steepの使用
description: Steepを使った型チェック
---

# Steepの使用

SteepはRBSを型シグネチャに使用するRuby用の静的型チェッカーです。T-RubyはSteepとシームレスに統合され、T-Rubyコンパイラが提供するもの以上の追加の型チェックを活用できます。

## T-RubyでSteepを使用する理由

T-Rubyがコンパイル中に型チェックを行いますが、Steepは以下を提供します：

- 生成されたRubyコードの**追加検証**
- 依存関係とライブラリの**型チェック**
- Ruby LSPを通じた**IDE統合**
- コンパイルされたコードがRBSシグネチャと一致する**検証**
- **標準Rubyツール**の互換性

## インストール

プロジェクトにSteepを追加：

```bash
gem install steep
```

またはGemfileに：

```ruby
group :development do
  gem "steep"
  gem "t-ruby"
end
```

その後：

```bash
bundle install
```

## 基本セットアップ

### ステップ1：T-Rubyコードのコンパイル

まず、T-RubyコードをコンパイルしてRubyとRBSファイルを生成：

```bash
trc compile src/
```

これで生成されます：
```
build/          # コンパイル済みRubyファイル
sig/            # RBS型シグネチャ
```

### ステップ2：Steepfileの作成

Steepを設定するための`Steepfile`を作成：

```ruby title="Steepfile"
target :app do
  # コンパイル済みRubyファイルをチェック
  check "build"

  # T-Ruby生成シグネチャを使用
  signature "sig"

  # Ruby標準ライブラリの型を使用
  library "pathname"
end
```

### ステップ3：Steepの実行

```bash
steep check
```

SteepはコンパイルされたRubyコードが生成されたRBSシグネチャと一致するか検証します。

## 完全な例

完全な例を見てみましょう。

**T-Rubyソース** (`src/user.trb`)：

```ruby
class User
  @id: Integer
  @name: String
  @email: String

  def initialize(id: Integer, name: String, email: String): void
    @id = id
    @name = name
    @email = email
  end

  def greet: String
    "Hello, I'm #{@name}!"
  end

  def self.find(id: Integer): User | nil
    # データベース検索がここに
    nil
  end
end

# クラスの使用
user = User.new(1, "Alice", "alice@example.com")
puts user.greet

# これは型エラーになります
# user = User.new("not a number", "Bob", "bob@example.com")
```

**コンパイル**：

```bash
trc compile src/
```

**Steep設定** (`Steepfile`)：

```ruby
target :app do
  check "build"
  signature "sig"
end
```

**Steep実行**：

```bash
steep check
```

出力：
```
# Type checking files:

build/user.rb:19:8: [error] Type mismatch:
  expected: Integer
  actual: String

# Typecheck result: FAILURE
```

## Steepfile設定

### 基本構造

```ruby
target :app do
  check "path/to/ruby/files"
  signature "path/to/rbs/files"
end
```

### 複数ターゲット

大規模プロジェクトでは複数のターゲットを使用：

```ruby
# アプリケーションコード
target :app do
  check "build/app"
  signature "sig/app"

  library "pathname", "logger"
end

# テスト
target :test do
  check "build/test"
  signature "sig/test", "sig/app"

  library "pathname", "logger", "minitest"
end
```

### ライブラリ

Ruby標準ライブラリとgemのRBSを含める：

```ruby
target :app do
  check "build"
  signature "sig"

  # 標準ライブラリ
  library "pathname"
  library "json"
  library "net-http"

  # RBSサポートのあるgem
  library "activerecord"
  library "activesupport"
end
```

### 型解決

Steepが型を解決する方法を設定：

```ruby
target :app do
  check "build"
  signature "sig"

  # 特定のファイルを無視
  ignore "build/vendor/**/*.rb"

  # 型チェックの厳格さを設定
  configure_code_diagnostics do |hash|
    hash[D::UnresolvedOverloading] = :information
    hash[D::FallbackAny] = :warning
  end
end
```

## T-Rubyワークフローとの統合

### 開発ワークフロー

```bash
# 1. T-Rubyコードを書く
vim src/user.trb

# 2. T-Rubyでコンパイル（T-Ruby型エラーをキャッチ）
trc compile src/

# 3. Steepでチェック（Ruby出力を検証）
steep check

# 4. コードを実行
ruby build/user.rb
```

### ウォッチモード

T-RubyウォッチとSteepウォッチを一緒に使用：

**ターミナル1** - T-Rubyウォッチ：
```bash
trc watch src/ --clear
```

**ターミナル2** - Steepウォッチ：
```bash
steep watch --code=build --signature=sig
```

ファイルを編集すると両方が自動的に再チェックします。

### 単一コマンドワークフロー

両方を実行するスクリプトを作成：

```bash title="bin/typecheck"
#!/bin/bash
set -e

echo "Compiling T-Ruby..."
trc compile src/

echo "Running Steep..."
steep check

echo "Type checking passed!"
```

```bash
chmod +x bin/typecheck
./bin/typecheck
```

## 高度な設定

### 厳格モード

Steepで厳格な型チェックを有効化：

```ruby
target :app do
  check "build"
  signature "sig"

  # 厳格モード - すべての型問題で失敗
  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :error
    hash[D::UnresolvedOverloading] = :error
    hash[D::UnexpectedBlockGiven] = :error
    hash[D::IncompatibleMethodTypeAnnotation] = :error
  end
end
```

### カスタム型ディレクトリ

T-Ruby生成のRBSと手書きのRBSがある場合：

```ruby
target :app do
  check "build"

  # T-Ruby生成シグネチャ
  signature "sig/generated"

  # 手書きシグネチャ
  signature "sig/manual"

  # ベンダーシグネチャ
  signature "sig/vendor"
end
```

### Rails統合

Railsプロジェクトの場合：

```ruby
target :app do
  check "app"

  signature "sig"

  # Railsコアライブラリ
  library "pathname"
  library "logger"

  # Rails gem
  library "activerecord"
  library "actionpack"
  library "activesupport"
  library "actionview"

  # Railsパス設定
  repo_path "vendor/rbs-rails"
end

# Railsオートローディング設定
configure_code_diagnostics do |hash|
  # Railsはオートローディングを使用 - 定数に寛容に
  hash[D::UnknownConstant] = :hint
end
```

### 無視パターン

生成またはベンダーコードを無視：

```ruby
target :app do
  check "build"
  signature "sig"

  # 特定パターンを無視
  ignore "build/vendor/**/*.rb"
  ignore "build/generated/**/*.rb"
  ignore "build/**/*_pb.rb"  # プロトコルバッファ生成ファイル
end
```

## 診断設定

Steepの診断レベルをカスタマイズ：

```ruby
target :app do
  check "build"
  signature "sig"

  configure_code_diagnostics do |hash|
    # エラー
    hash[D::UnresolvedOverloading] = :error
    hash[D::FallbackAny] = :error

    # 警告
    hash[D::UnexpectedBlockGiven] = :warning
    hash[D::IncompatibleAssignment] = :warning

    # 情報
    hash[D::UnknownConstant] = :information

    # ヒント（最低の重要度）
    hash[D::UnsatisfiedConstraints] = :hint

    # 特定の診断を無効化
    hash[D::UnexpectedJumpValue] = nil
  end
end
```

## 一般的な診断

### UnresolvedOverloading

複数のメソッドオーバーロードがあり、Steepがどれか決定できない：

```ruby
# RBSで
def process: (String) -> Integer
           | (Integer) -> String

# SteepがUnresolvedOverloadingを報告する可能性
result = process(input)  # inputの型が不明確
```

**修正**：型アノテーションを追加するか、型をより明確にします。

### FallbackAny

Steepが型を推論できず`Any`にフォールバック：

```ruby
result = some_method()  # 型不明、Anyにフォールバック
```

**修正**：T-Rubyソースに明示的な型を追加します。

### IncompatibleAssignment

代入での型の不一致：

```ruby
x: Integer = "string"  # エラー：互換性のない型
```

**修正**：T-Rubyソースで型を修正します。

## CI/CD統合

### GitHub Actions

```yaml title=".github/workflows/typecheck.yml"
name: Type Check

on: [push, pull_request]

jobs:
  typecheck:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install T-Ruby
        run: gem install t-ruby

      - name: Compile T-Ruby
        run: trc compile src/

      - name: Type Check with Steep
        run: bundle exec steep check
```

### GitLab CI

```yaml title=".gitlab-ci.yml"
typecheck:
  image: ruby:3.2
  before_script:
    - gem install t-ruby
    - bundle install
  script:
    - trc compile src/
    - bundle exec steep check
```

### Pre-commitフック

```bash title=".git/hooks/pre-commit"
#!/bin/sh

echo "Type checking with T-Ruby and Steep..."

# T-Rubyコンパイル
trc compile src/ || exit 1

# Steepチェック
steep check || exit 1

echo "Type check passed!"
```

## Steepコマンド

### Check

コードを型チェック：

```bash
steep check
```

特定のターゲットで：
```bash
steep check --target=app
```

### Watch

変更を監視して再チェック：

```bash
steep watch
```

パスを指定：
```bash
steep watch --code=build --signature=sig
```

### Stats

型チェック統計を表示：

```bash
steep stats
```

出力：
```
Target: app
  Files: 25
  Methods: 147
  Classes: 18
  Modules: 5
  Type errors: 0
  Warnings: 3
```

### Validate

Steepfileを検証：

```bash
steep validate
```

### Version

Steepバージョンを表示：

```bash
steep version
```

## トラブルシューティング

### SteepがRBSファイルを見つけられない

**問題**：Steepが型シグネチャがないと報告。

**解決**：

```bash
# RBSファイルが生成されたか確認
ls -la sig/

# Steepfileのパスを確認
cat Steepfile
```

### 型の不一致

**問題**：Steepが生成されたコードで型エラーを報告。

**解決**：

1. T-Rubyコンパイルを確認：
   ```bash
   trc check src/
   ```

2. 生成されたRBSを表示：
   ```bash
   cat sig/user.rbs
   ```

3. 型が一致するか確認：
   ```bash
   trc compile --trace src/
   ```

### ライブラリが見つからない

**問題**：Steepがライブラリの型を見つけられない。

**解決**：RBSコレクションをインストールするかSteepfileにライブラリを追加：

```bash
# RBSコレクションを初期化
rbs collection init

# 依存関係をインストール
rbs collection install
```

```ruby
# Steepfileで
target :app do
  signature "sig"
  library "pathname", "json"
end
```

### パフォーマンス問題

**問題**：大規模プロジェクトでSteepが遅い。

**解決**：

1. 複数ターゲットを使用：
   ```ruby
   target :core do
     check "build/core"
     signature "sig/core"
   end

   target :plugins do
     check "build/plugins"
     signature "sig/plugins"
   end
   ```

2. 不要なファイルを無視：
   ```ruby
   target :app do
     check "build"
     ignore "build/vendor/**"
   end
   ```

## ベストプラクティス

### 1. CIでSteepを実行

常にCIでSteepを実行して型エラーをキャッチ：

```yaml
- name: Type Check
  run: |
    trc compile src/
    steep check
```

### 2. 開発中はSteep Watchを使用

即時フィードバックのためにSteepを実行状態に維持：

```bash
steep watch --code=build --signature=sig
```

### 3. 診断を適切に設定

寛容から始めて、時間とともに厳格さを増加：

```ruby
# ここから始める
configure_code_diagnostics do |hash|
  hash[D::FallbackAny] = :warning
end

# ここへ移行
configure_code_diagnostics do |hash|
  hash[D::FallbackAny] = :error
end
```

### 4. RBSファイルをバージョン管理に保持

生成されたRBSファイルをコミット：

```bash
git add sig/
git commit -m "Update RBS signatures"
```

### 5. T-RubyとSteepチェックの両方を使用

T-Rubyはコンパイル時に問題をキャッチし、Steepはランタイム動作を検証：

```bash
trc check src/     # コンパイル時チェック
trc compile src/   # Ruby + RBS生成
steep check        # ランタイム動作チェック
```

## Steep vs T-Ruby型チェック

| 側面 | T-Ruby | Steep |
|--------|--------|-------|
| いつ | コンパイル時 | コンパイル後 |
| 何を | `.trb`ファイル | `.rb`と`.rbs`ファイル |
| 目的 | T-Rubyコードの型安全性 | Ruby出力の検証 |
| エラー | コンパイルを防止 | 問題を報告 |
| 速度 | 高速（単一ファイル） | 低速（全プロジェクト） |
| 統合 | 内蔵 | 別ツール |

**両方使用**：開発にはT-Ruby、検証にはSteep。

## 実世界の例

本番アプリケーション用の完全なセットアップ：

```ruby title="Steepfile"
target :app do
  check "build/app"
  signature "sig/app"

  library "pathname"
  library "logger"
  library "json"
  library "net-http"

  ignore "build/app/vendor/**"

  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :error
    hash[D::UnresolvedOverloading] = :warning
    hash[D::IncompatibleAssignment] = :error
  end
end

target :test do
  check "build/test"
  signature "sig/app", "sig/test"

  library "minitest"

  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :warning  # テストではより寛容に
  end
end
```

```yaml title="trc.yaml"
source:
  include:
    - src/app
    - src/test

output:
  ruby_dir: build
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: strict
  generate_rbs: true
```

```bash title="bin/ci"
#!/bin/bash
set -e

echo "==> Compiling T-Ruby..."
trc compile src/app --strict

echo "==> Type checking with Steep..."
steep check --target=app

echo "==> Running tests..."
ruby -Ibuild/test -Ibuild/app build/test/all_tests.rb

echo "==> All checks passed!"
```

## 次のステップ

- [Ruby LSP統合](/docs/tooling/ruby-lsp) - Steepと一緒にIDEサポート
- [RBS統合](/docs/tooling/rbs-integration) - RBSについてもっと学ぶ
- [Steepドキュメント](https://github.com/soutaro/steep) - 公式Steepドキュメント
