---
sidebar_position: 2
title: 設定
description: T-Ruby設定ファイルリファレンス
---

<DocsBadge />


# 設定

T-Rubyは`trbconfig.yml`ファイルを使用して、コンパイラの動作、ソースファイル、出力場所、型チェックルールを設定します。このリファレンスでは、利用可能なすべての設定オプションについて説明します。

## 設定ファイル

プロジェクトルートに`trbconfig.yml`を配置します：

```yaml title="trbconfig.yml"
# T-Ruby設定ファイル
version: ">=1.0.0"

source:
  include:
    - src
    - lib
  exclude:
    - "**/*_test.trb"

output:
  ruby_dir: build
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: standard
  generate_rbs: true
  target_ruby: "3.2"
```

## 設定の作成

設定ファイルを生成します：

```bash
# デフォルトで作成
trc --init

# 対話型セットアップ
trc --init --interactive

# テンプレートを使用
trc --init --template rails
```

## 設定セクション

### version

必要な最小T-Rubyコンパイラバージョンを指定します：

```yaml
version: ">=1.0.0"
```

サポートされる形式：
```yaml
version: "1.0.0"        # 正確なバージョン
version: ">=1.0.0"      # 最小バージョン
version: "~>1.0"        # 互換バージョン
version: ">=1.0,<2.0"   # 範囲
```

### source

コンパイルするファイルを設定します：

```yaml
source:
  # 含めるディレクトリ
  include:
    - src
    - lib
    - app

  # 除外するパターン
  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/fixtures/**"
    - "**/tmp/**"

  # ファイル拡張子（デフォルト: [".trb"]）
  extensions:
    - .trb
    - .truby
```

**Includeパス**は以下が可能：
- ディレクトリ: `src`, `lib/models`
- Globパターン: `src/**/*.trb`
- 個別ファイル: `app/main.trb`

**Excludeパターン**は以下をサポート：
- ワイルドカード: `**/test/**`, `*_spec.trb`
- 否定: `!important_test.trb`

複雑なパターンの例：

```yaml
source:
  include:
    - src
    - lib
    - "config/**/*.trb"  # configファイルを含める

  exclude:
    # すべてのテストファイルを除外
    - "**/*_test.trb"
    - "**/*_spec.trb"

    # vendorコードを除外
    - "**/vendor/**"
    - "**/node_modules/**"

    # 生成されたファイルを除外
    - "**/generated/**"
    - "**/*.generated.trb"

    # 特定のテストは含める
    - "!test/important_integration_test.trb"
```

### output

コンパイルされたファイルの書き込み先を設定します：

```yaml
output:
  # コンパイルされたRubyファイルのディレクトリ
  ruby_dir: build

  # RBSシグネチャファイルのディレクトリ
  rbs_dir: sig

  # ソースディレクトリ構造を保持
  preserve_structure: true

  # ビルド前に出力ディレクトリをクリーン
  clean_before_build: false

  # Ruby出力のファイル拡張子（デフォルト: .rb）
  ruby_extension: .rb

  # RBS出力のファイル拡張子（デフォルト: .rbs）
  rbs_extension: .rbs
```

#### preserve_structure

`true`の場合、ソースディレクトリ階層を維持します：

```yaml
preserve_structure: true
```

```
src/
├── models/
│   └── user.trb
└── services/
    └── auth.trb
```

コンパイル結果：

```
build/
├── models/
│   └── user.rb
└── services/
    └── auth.rb
```

`false`の場合、出力をフラット化します：

```yaml
preserve_structure: false
```

```
build/
├── user.rb
└── auth.rb
```

#### clean_before_build

コンパイル前に出力ディレクトリのすべてのファイルを削除します：

```yaml
output:
  clean_before_build: true  # コンパイル前にbuild/とsig/をクリーン
```

以下の場合に便利：
- 孤立したファイルの削除
- CIでのクリーンビルドの保証
- 名前が変更されたファイルとの競合回避

### compiler

コンパイラの動作と型チェックを設定します：

```yaml
compiler:
  # 厳格度レベル
  strictness: standard

  # RBSファイルを生成
  generate_rbs: true

  # ターゲットRubyバージョン
  target_ruby: "3.2"

  # 型チェックオプション
  checks:
    no_implicit_any: true
    no_unused_vars: false
    strict_nil: true
    no_unchecked_indexed_access: false

  # 実験的機能
  experimental:
    - pattern_matching_types
    - refinement_types

  # 最適化レベル
  optimization: none
```

#### strictness

型チェックの厳格さを制御します：

```yaml
compiler:
  strictness: strict  # strict | standard | permissive
```

**strict** - 最大の型安全性：
- すべての関数にパラメータと戻り型が必要
- すべてのインスタンス変数に型指定が必要
- すべてのローカル変数に明示的な型指定または推論が必要
- 暗黙の`any`型は不許可
- 厳格なnilチェックが有効

```trb
# 厳格モードで必要
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result: Hash<String, Integer> = {}
  # ...
end
```

**standard**（推奨）- バランスの取れたアプローチ：
- 公開APIメソッドには型が必要
- プライベートメソッドは型を省略可能（推論）
- インスタンス変数には型が必要
- ローカル変数は推論可能
- 暗黙の`any`に警告

```trb
# 標準モードでOK
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result = {}  # 型を推論
  # ...
end

private

def helper(x)  # プライベート、型を推論
  x * 2
end
```

**permissive** - 段階的な型付け：
- 明示的な型エラーのみをキャッチ
- 暗黙の`any`型を許可
- 既存コードの移行に便利

```ruby
# 寛容モードでOK
def process(data)
  @count = 0
  result = {}
  # ...
end
```

#### target_ruby

特定のRubyバージョンと互換性のあるコードを生成します：

```yaml
compiler:
  target_ruby: "3.2"
```

影響：
- 出力で使用される構文機能
- 標準ライブラリの型定義
- メソッドの可用性チェック

サポートされるバージョン: `"2.7"`, `"3.0"`, `"3.1"`, `"3.2"`, `"3.3"`

例 - パターンマッチング：

```trb
# 入力（.trb）
case value
in { name: String => n }
  puts n
end
```

`target_ruby: "3.0"`の場合：
```ruby
# パターンマッチングを使用（Ruby 3.0+）
case value
in { name: n }
  puts n
end
```

`target_ruby: "2.7"`の場合：
```ruby
# case/whenにフォールバック
case
when value.is_a?(Hash) && value[:name].is_a?(String)
  n = value[:name]
  puts n
end
```

#### checks

細かい型チェックルール：

```yaml
compiler:
  checks:
    # 暗黙の'any'型を禁止
    no_implicit_any: true

    # 未使用変数に警告
    no_unused_vars: true

    # 厳格なnilチェック
    strict_nil: true

    # インデックスアクセスをチェック（配列、ハッシュ）
    no_unchecked_indexed_access: true

    # 明示的な戻り型を要求
    require_return_types: false

    # 型が付いていない関数呼び出しを禁止
    no_untyped_calls: false
```

**no_implicit_any**

```trb
# no_implicit_any: trueの場合エラー
def process(data)  # エラー: 暗黙の'any'型
  # ...
end

# OK
def process(data: Any)  # 明示的なany
  # ...
end
```

**no_unused_vars**

```trb
# no_unused_vars: trueの場合警告
def calculate(x: Integer, y: Integer): Integer
  result = x * 2  # 警告: 'y'が未使用
  result
end
```

**strict_nil**

```trb
# strict_nil: trueの場合エラー
def find_user(id: Integer): User  # エラー: nilを返す可能性あり
  users.find { |u| u.id == id }
end

# OK
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end
```

**no_unchecked_indexed_access**

```trb
# no_unchecked_indexed_access: trueの場合エラー
users: Array<User> = get_users()
user = users[0]  # エラー: nilの可能性あり

# OK - まず検査
if users[0]
  user = users[0]  # 安全
end

# またはデフォルトでfetchを使用
user = users.fetch(0, default_user)
```

#### experimental

実験的機能を有効にします：

```yaml
compiler:
  experimental:
    - pattern_matching_types
    - refinement_types
    - variadic_generics
    - higher_kinded_types
```

**警告:** 実験的機能は将来のバージョンで変更または削除される可能性があります。

#### optimization

コード最適化レベルを制御します：

```yaml
compiler:
  optimization: none  # none | basic | aggressive
```

- `none` - 最適化なし、可読性を維持
- `basic` - 安全な最適化（定数のインライン化、デッドコードの削除）
- `aggressive` - 最大最適化（可読性が低下する可能性）

### watch

ウォッチモードの動作を設定します：

```yaml
watch:
  # 追加で監視するパス
  paths:
    - config
    - types

  # デバウンス遅延（ミリ秒）
  debounce: 100

  # リビルド時に画面をクリア
  clear_screen: true

  # 成功したコンパイル後に実行するコマンド
  on_success: "bundle exec rspec"

  # 失敗したコンパイル後に実行するコマンド
  on_failure: "notify-send 'Build failed'"

  # 無視するパターン
  ignore:
    - "**/tmp/**"
    - "**/.git/**"
```

コンパイル後にテストを実行する例：

```yaml
watch:
  on_success: "bundle exec rake test"
  clear_screen: true
  debounce: 200
```

### types

型解決とインポートを設定します：

```yaml
types:
  # 追加の型定義ディレクトリ
  paths:
    - types
    - vendor/types
    - custom_types

  # 標準ライブラリ型を自動インポート
  stdlib: true

  # 外部型定義
  external:
    - rails
    - rspec
    - activerecord

  # 型エイリアス
  aliases:
    UserId: Integer
    Timestamp: Integer

  # 型インポートの厳格モード
  strict_imports: false
```

#### paths

`.rbs`型定義ファイルを含むディレクトリ：

```yaml
types:
  paths:
    - types          # プロジェクト固有の型
    - vendor/types   # サードパーティの型
```

```
types/
├── custom.rbs
└── external/
    └── third_party.rbs
```

#### external

ライブラリの型定義をインポートします：

```yaml
types:
  external:
    - rails
    - rspec
    - sidekiq
```

T-Rubyは以下を検索します：
1. バンドルされた型定義
2. Gemの`sig/`ディレクトリ
3. RBSリポジトリ

#### stdlib

Ruby標準ライブラリの型を含めます：

```yaml
types:
  stdlib: true  # Array, Hash, Stringなどをインポート
```

### plugins

プラグインでT-Rubyを拡張します：

```yaml
plugins:
  # カスタムプラグイン
  - name: my_custom_plugin
    path: ./plugins/custom.rb
    options:
      setting: value

  # 組み込みプラグイン
  - name: rails_types
    enabled: true

  - name: graphql_types
    enabled: true
```

### linting

リンティングルールを設定します：

```yaml
linting:
  # リンターを有効化
  enabled: true

  # ルール設定
  rules:
    # 命名規則
    naming_convention: snake_case
    class_naming: PascalCase
    constant_naming: SCREAMING_SNAKE_CASE

    # 複雑さ
    max_method_lines: 50
    max_class_lines: 300
    max_complexity: 10

    # スタイル
    prefer_single_quotes: true
    require_trailing_comma: false

  # 特定のルールを無効化
  disabled_rules:
    - prefer_ternary
    - max_line_length
```

## 環境変数

環境変数で設定を上書きします：

```yaml
compiler:
  strictness: ${TRC_STRICTNESS:-standard}
  target_ruby: ${RUBY_VERSION:-3.2}

output:
  ruby_dir: ${TRC_OUTPUT_DIR:-build}
```

使用方法：

```bash
TRC_STRICTNESS=strict trc compile .
RUBY_VERSION=3.0 trc compile .
```

## 複数の設定ファイル

異なる環境に異なる設定を使用します：

```bash
# 開発
trc --config trc.development.yaml compile

# 本番
trc --config trc.production.yaml compile

# テスト
trc --config trc.test.yaml check
```

**trc.development.yaml:**
```yaml
compiler:
  strictness: permissive
  checks:
    no_unused_vars: false

watch:
  on_success: "bundle exec rspec"
```

**trc.production.yaml:**
```yaml
compiler:
  strictness: strict
  optimization: aggressive
  checks:
    no_implicit_any: true
    no_unused_vars: true

output:
  clean_before_build: true
```

## 設定の継承

ベース設定を作成して拡張します：

**trc.base.yaml:**
```yaml
compiler:
  target_ruby: "3.2"
  generate_rbs: true

types:
  stdlib: true
```

**trbconfig.yml:**
```yaml
extends: trc.base.yaml

compiler:
  strictness: standard

source:
  include:
    - src
```

## ワークスペース設定

複数のパッケージを持つモノレポ用：

**trc.workspace.yaml:**
```yaml
workspace:
  # パッケージの場所
  packages:
    - packages/core
    - packages/web
    - packages/api

  # 共有設定
  shared:
    compiler:
      target_ruby: "3.2"
      strictness: strict

  # パッケージ別オーバーライド
  overrides:
    packages/web:
      compiler:
        strictness: standard
```

各パッケージは独自の`trbconfig.yml`を持ちます：

**packages/core/trbconfig.yml:**
```yaml
source:
  include:
    - lib

output:
  ruby_dir: lib
  rbs_dir: sig
```

ワークスペースをビルド：

```bash
trc --workspace compile
```

## 完全な例

Railsアプリケーション用の包括的な設定：

```yaml title="trbconfig.yml"
# Railsアプリ用T-Ruby設定
version: ">=1.2.0"

# ソースファイル
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - app/jobs
    - lib

  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/concerns/**"  # Rubyとして維持
    - "**/vendor/**"

  extensions:
    - .trb

# 出力
output:
  ruby_dir: app
  rbs_dir: sig
  preserve_structure: true
  clean_before_build: false

# コンパイラ
compiler:
  strictness: standard
  generate_rbs: true
  target_ruby: "3.2"

  checks:
    no_implicit_any: true
    strict_nil: true
    no_unused_vars: true
    no_unchecked_indexed_access: false

  experimental: []

  optimization: basic

# ウォッチモード
watch:
  paths:
    - config
    - app

  debounce: 150
  clear_screen: true
  on_success: "bin/rails test"

  ignore:
    - "**/tmp/**"
    - "**/log/**"

# 型
types:
  paths:
    - types
    - vendor/types

  stdlib: true

  external:
    - rails
    - activerecord
    - actionpack
    - activesupport

# リンティング
linting:
  enabled: true

  rules:
    naming_convention: snake_case
    class_naming: PascalCase
    max_method_lines: 50
    max_class_lines: 300
    prefer_single_quotes: true

  disabled_rules:
    - max_line_length
```

## 設定スキーマ

T-Rubyは設定をスキーマに対して検証します。スキーマを取得：

```bash
trc config --schema > trc-schema.json
```

エディタで自動補完と検証に使用：

```yaml
# yaml-language-server: $schema=./trc-schema.json

version: ">=1.0.0"
# ... IDEが自動補完を提供
```

## 設定のデバッグ

有効な設定を表示（デフォルトとオーバーライドをマージ後）：

```bash
# 有効な設定を表示
trc config --show

# JSONとして表示
trc config --show --json

# 設定を検証
trc config --validate

# 設定のソースを表示
trc config --debug
```

出力：

```
Configuration loaded from:
  - /path/to/trbconfig.yml
  - Environment variables:
    - TRC_STRICTNESS=standard
  - Command line:
    - --target-ruby=3.2

Effective configuration:
  version: ">=1.0.0"
  source:
    include: ["src", "lib"]
  ...
```

## 移行ガイド

### バージョン0.xから1.xへ

バージョン1.0で設定形式が変更されました：

**旧（0.x）:**
```yaml
inputs:
  - src
output: build
rbs_output: sig
strict: true
```

**新（1.x）:**
```yaml
source:
  include:
    - src
output:
  ruby_dir: build
  rbs_dir: sig
compiler:
  strictness: strict
```

自動移行：

```bash
trc config --migrate
```

## ベストプラクティス

### 1. プロジェクト段階に適した厳格度を使用

```yaml
# 新規プロジェクト - 厳格に開始
compiler:
  strictness: strict

# 既存プロジェクトの移行 - 寛容に開始
compiler:
  strictness: permissive
```

### 2. 有用なチェックを段階的に有効化

```yaml
compiler:
  checks:
    # まずこれらから開始
    strict_nil: true
    no_implicit_any: true

    # コードが改善されたら後で追加
    # no_unused_vars: true
    # no_unchecked_indexed_access: true
```

### 3. 環境別設定を使用

```yaml
# trbconfig.yml（デフォルト - 開発）
compiler:
  strictness: standard

# trc.production.yaml
compiler:
  strictness: strict
  optimization: aggressive
```

### 4. カスタム設定をドキュメント化

```yaml
# チーム用のカスタム設定
# 詳細はdocs/truby-setup.mdを参照

compiler:
  # より良い型安全性のために厳格モードを使用
  strictness: strict

  # 未使用変数の警告なし（_接頭辞を使用）
  checks:
    no_unused_vars: false
```

### 5. バージョン管理に設定を保持

```bash
git add trbconfig.yml
git commit -m "Add T-Ruby configuration"
```

## 次のステップ

- [コマンドリファレンス](/docs/cli/commands) - CLIコマンドを学ぶ
- [コンパイラオプション](/docs/cli/compiler-options) - 詳細なコンパイラフラグ
- [型アノテーション](/docs/learn/basics/type-annotations) - コードに型を付け始める
