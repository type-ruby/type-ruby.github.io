---
sidebar_position: 5
title: プロジェクト設定
description: プロジェクトでT-Rubyを設定する
---

# プロジェクト設定

大規模なプロジェクトでは、T-Rubyは設定ファイルを使用してコンパイラオプション、パス、動作を管理します。

## 設定ファイル

プロジェクトルートに`trc.yaml`ファイルを作成します：

```yaml title="trc.yaml"
# T-Ruby設定

# コンパイラバージョン要件
version: ">=1.0.0"

# ソースファイル設定
source:
  # 含めるディレクトリ
  include:
    - src
    - lib
  # 除外するパターン
  exclude:
    - "**/*_test.trb"
    - "**/fixtures/**"

# 出力設定
output:
  # コンパイルされた.rbファイルの書き込み先
  ruby_dir: build
  # .rbsシグネチャファイルの書き込み先
  rbs_dir: sig
  # ソースディレクトリ構造を保持
  preserve_structure: true

# コンパイラオプション
compiler:
  # 厳格さレベル: "strict" | "standard" | "permissive"
  strictness: standard
  # .rbsファイルを生成
  generate_rbs: true
  # ターゲットRubyバージョン
  target_ruby: "3.0"
```

## プロジェクトの初期化

`trc init`を使用して設定ファイルを作成：

```bash
trc init
```

これにより、適切なデフォルト値で`trc.yaml`が作成されます。

対話的なセットアップの場合：

```bash
trc init --interactive
```

## 設定オプションリファレンス

### ソース設定

```yaml
source:
  # .trbファイルを含むディレクトリ
  include:
    - src
    - lib
    - app

  # 除外するファイル/パターン
  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/vendor/**"
    - "**/node_modules/**"

  # 処理するファイル拡張子（デフォルト: [".trb"]）
  extensions:
    - .trb
    - .truby
```

### 出力設定

```yaml
output:
  # コンパイルされたRubyファイル用ディレクトリ
  ruby_dir: build

  # RBSシグネチャファイル用ディレクトリ
  rbs_dir: sig

  # 出力でソースディレクトリ構造を保持
  # true:  src/models/user.trb → build/models/user.rb
  # false: src/models/user.trb → build/user.rb
  preserve_structure: true

  # コンパイル前に出力ディレクトリをクリーン
  clean_before_build: false
```

### コンパイラオプション

```yaml
compiler:
  # 厳格さレベル
  # - strict: すべてのコードが完全に型付けされる必要がある
  # - standard: パブリックAPIに型が必要
  # - permissive: 最小限の型要件
  strictness: standard

  # RBSファイルを生成
  generate_rbs: true

  # ターゲットRubyバージョン（生成コードに影響）
  target_ruby: "3.0"

  # 実験的機能を有効化
  experimental:
    - pattern_matching_types
    - refinement_types

  # 追加の型チェックルール
  checks:
    # 暗黙的なany型を警告
    no_implicit_any: true
    # 未使用変数をエラー
    no_unused_vars: false
    # 厳格なnilチェック
    strict_nil: true
```

### ウォッチモード設定

```yaml
watch:
  # 追加で監視するディレクトリ
  paths:
    - config

  # デバウンス遅延（ミリ秒）
  debounce: 100

  # リビルド時にターミナルをクリア
  clear_screen: true

  # コンパイル成功後に実行するコマンド
  on_success: "bundle exec rspec"
```

### 型解決

```yaml
types:
  # 追加の型定義パス
  paths:
    - types
    - vendor/types

  # 標準ライブラリ型を自動インポート
  stdlib: true

  # 外部型定義
  external:
    - rails
    - rspec
```

## ディレクトリ構造

典型的なT-Rubyプロジェクト構造：

```
my-project/
├── trc.yaml              # 設定
├── src/                  # T-Rubyソースファイル
│   ├── models/
│   │   ├── user.trb
│   │   └── post.trb
│   ├── services/
│   │   └── auth_service.trb
│   └── main.trb
├── types/                # カスタム型定義
│   └── external.rbs
├── build/                # コンパイルされたRuby出力
│   ├── models/
│   │   ├── user.rb
│   │   └── post.rb
│   └── ...
├── sig/                  # 生成されたRBSファイル
│   ├── models/
│   │   ├── user.rbs
│   │   └── post.rbs
│   └── ...
└── test/                 # テスト（.rbまたは.trb）
    └── ...
```

## 環境別設定

環境変数または複数の設定ファイルを使用：

```yaml title="trc.yaml"
# ベース設定

compiler:
  strictness: ${TRC_STRICTNESS:-standard}

output:
  ruby_dir: ${TRC_OUTPUT:-build}
```

または別ファイルを使用：

```bash
# 開発
trc --config trc.development.yaml

# 本番
trc --config trc.production.yaml
```

## Bundler統合

GemfileにT-Rubyを追加：

```ruby title="Gemfile"
source "https://rubygems.org"

group :development do
  gem "t-ruby"
end

# その他の依存関係
```

Rakeタスクを作成：

```ruby title="Rakefile"
require "t-ruby/rake_task"

TRuby::RakeTask.new(:compile) do |t|
  t.config_file = "trc.yaml"
end

# テスト実行前にコンパイル
task test: :compile
```

これで以下を実行できます：

```bash
bundle exec rake compile
bundle exec rake test
```

## Rails統合

Railsプロジェクトの場合、Rails構造に合わせてT-Rubyを設定：

```yaml title="trc.yaml"
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - lib

output:
  ruby_dir: app  # その場でコンパイル
  preserve_structure: true

compiler:
  strictness: standard

types:
  external:
    - rails
    - activerecord
```

`config/application.rb`に追加：

```ruby
# 開発中に.trbファイルを監視
config.watchable_extensions << "trb"
```

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

      - name: Type Check
        run: trc check .

      - name: Compile
        run: trc .
```

### GitLab CI

```yaml title=".gitlab-ci.yml"
typecheck:
  image: ruby:3.2
  script:
    - gem install t-ruby
    - trc check .
    - trc .
```

## モノレポ設定

複数パッケージを持つモノレポの場合：

```
monorepo/
├── packages/
│   ├── core/
│   │   ├── trc.yaml
│   │   └── src/
│   ├── web/
│   │   ├── trc.yaml
│   │   └── src/
│   └── api/
│       ├── trc.yaml
│       └── src/
└── trc.workspace.yaml
```

```yaml title="trc.workspace.yaml"
workspace:
  packages:
    - packages/core
    - packages/web
    - packages/api

  # 共有設定
  shared:
    compiler:
      strictness: strict
      target_ruby: "3.2"
```

すべてのパッケージをビルド：

```bash
trc --workspace
```

## 次のステップ

プロジェクトが設定できたら、以下を探索しましょう：

- [CLIコマンド](/docs/cli/commands) - 利用可能なすべてのコマンド
- [コンパイラオプション](/docs/cli/compiler-options) - 詳細オプションリファレンス
- [型アノテーション](/docs/learn/basics/type-annotations) - 型付きコードを書き始める
