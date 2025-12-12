---
sidebar_position: 1
title: コマンド
description: trc CLIコマンドリファレンス
---

<DocsBadge />


# コマンド

`trc`コマンドラインインターフェースは、T-Rubyで作業するための主要ツールです。`.trb`ファイルをRubyにコンパイルし、コードを型チェックし、RBSシグネチャを生成します。

## 概要

```bash
trc [コマンド] [オプション] [ファイル...]
```

利用可能なコマンド:

- `compile` - T-RubyファイルをRubyとRBSにコンパイル
- `watch` - ファイルを監視し変更時に自動コンパイル
- `check` - 出力を生成せずに型チェック
- `init` - 新しいT-Rubyプロジェクトを初期化

## compile

T-Rubyソースファイル(`.trb`)をRuby(`.rb`)とRBS(`.rbs`)ファイルにコンパイルします。

### 基本的な使用法

```bash
# 単一ファイルをコンパイル
trc compile hello.trb

# 複数ファイルをコンパイル
trc compile user.trb post.trb

# ディレクトリ内のすべての.trbファイルをコンパイル
trc compile src/

# 現在のディレクトリをコンパイル
trc compile .
```

### 省略形

`compile`コマンドはデフォルトなので省略できます:

```bash
trc hello.trb
trc src/
trc .
```

### オプション

```bash
# 出力ディレクトリを指定
trc compile src/ --output build/

# Rubyファイルのみ生成（RBSをスキップ）
trc compile src/ --no-rbs

# RBSファイルのみ生成（Rubyをスキップ）
trc compile src/ --rbs-only

# RBS出力ディレクトリを指定
trc compile src/ --rbs-dir sig/

# 特定の設定ファイルを使用
trc compile src/ --config trc.production.yaml

# コンパイル前に出力ディレクトリをクリーン
trc compile . --clean

# 詳細出力を表示
trc compile . --verbose

# エラー以外のすべての出力を抑制
trc compile . --quiet
```

### 例

**カスタム出力ディレクトリでコンパイル:**

```bash
trc compile src/ \
  --output build/ \
  --rbs-dir signatures/
```

**本番用コンパイル（クリーンビルド、デバッグ情報なし）:**

```bash
trc compile . \
  --clean \
  --quiet \
  --no-debug-info
```

**ソース構造を維持してコンパイル:**

```bash
trc compile src/ \
  --output build/ \
  --preserve-structure
```

これを変換:
```
src/
├── models/
│   └── user.trb
└── services/
    └── auth.trb
```

結果:
```
build/
├── models/
│   └── user.rb
└── services/
    └── auth.rb
```

### 終了コード

- `0` - 成功
- `1` - コンパイルエラー
- `2` - 型エラー
- `3` - 設定エラー

## watch

T-Rubyファイルを監視し、変更が検出されると自動的に再コンパイルします。開発ワークフローに最適です。

### 基本的な使用法

```bash
# 現在のディレクトリを監視
trc watch

# 特定のディレクトリを監視
trc watch src/

# 複数のディレクトリを監視
trc watch src/ lib/
```

### オプション

```bash
# 各リビルド時にターミナルをクリア
trc watch --clear

# 成功したコンパイル後にコマンドを実行
trc watch --exec "bundle exec rspec"

# デバウンス遅延（ミリ秒）（デフォルト: 100）
trc watch --debounce 300

# 追加のファイルパターンを監視
trc watch --include "**/*.yaml"

# 特定のパターンを無視
trc watch --ignore "**/test/**"

# 最初の成功したコンパイル後に終了
trc watch --once
```

### 例

**監視して成功時にテストを実行:**

```bash
trc watch src/ --exec "bundle exec rake test"
```

**カスタムデバウンスで監視:**

```bash
# 最後の変更後500ms待ってからコンパイル
trc watch --debounce 500
```

**設定ファイルも監視:**

```bash
trc watch src/ --include "trc.yaml"
```

### 出力

監視モードはリアルタイムフィードバックを提供します:

```
src/でファイル変更を監視中...

[10:30:15] 変更: src/models/user.trb
[10:30:15] コンパイル中...
[10:30:16] ✓ 正常にコンパイルされました (1.2s)
[10:30:16] 生成:
  - build/models/user.rb
  - sig/models/user.rbs

変更を待機中...
```

エラーがある場合:

```
[10:31:20] 変更: src/models/user.trb
[10:31:20] コンパイル中...
[10:31:21] ✗ コンパイル失敗

エラー: src/models/user.trb:15:23
  型の不一致: Stringを期待、Integerを受け取り

    @email = user_id
              ^^^^^^^

変更を待機中...
```

### キーボードショートカット

監視モード実行中:

- `Ctrl+C` - 監視を停止して終了
- `r` - 強制再コンパイル
- `c` - ターミナルをクリア
- `q` - 終了

## check

出力を生成せずにT-Rubyファイルを型チェックします。CI/CDパイプラインや素早い検証に便利です。

### 基本的な使用法

```bash
# 単一ファイルをチェック
trc check hello.trb

# 複数ファイルをチェック
trc check src/**/*.trb

# ディレクトリ全体をチェック
trc check .
```

### オプション

```bash
# 厳格モード（警告でも失敗）
trc check . --strict

# エラーに加えて警告も表示
trc check . --warnings

# レポート形式（text, json, junit）
trc check . --format json

# レポートをファイルに出力
trc check . --output-file report.json

# 表示する最大エラー数（デフォルト: 50）
trc check . --max-errors 10

# 最初のエラーで続行（デフォルト: 50エラー後に停止）
trc check . --no-error-limit
```

### 例

**コミット前にチェック:**

```bash
# .git/hooks/pre-commitに追加
#!/bin/sh
trc check . --strict
```

**ツール用JSONレポートを生成:**

```bash
trc check . \
  --format json \
  --output-file type-errors.json
```

**最小出力で素早くチェック:**

```bash
trc check src/ --quiet --max-errors 5
```

### 出力形式

**テキスト（デフォルト）:**

```
15ファイルをチェック中...

エラー: src/models/user.trb:23:15
  型の不一致: Stringを期待、Integerを受け取り

    return user_id
           ^^^^^^^

エラー: src/services/auth.trb:45:8
  nilに'authenticate'メソッドが未定義

    user.authenticate(password)
    ^^^^

✗ 2ファイルで2エラーが見つかりました
```

**JSON:**

```json
{
  "files_checked": 15,
  "errors": [
    {
      "file": "src/models/user.trb",
      "line": 23,
      "column": 15,
      "severity": "error",
      "message": "型の不一致: Stringを期待、Integerを受け取り",
      "code": "type-mismatch"
    }
  ],
  "summary": {
    "error_count": 2,
    "warning_count": 0,
    "files_with_errors": 2
  }
}
```

**JUnit XML（CI統合用）:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="T-Ruby Type Check" tests="15" failures="2">
    <testcase name="src/models/user.trb">
      <failure message="型の不一致: Stringを期待、Integerを受け取り">
        Line 23, column 15
      </failure>
    </testcase>
  </testsuite>
</testsuites>
```

### 終了コード

- `0` - エラーなし
- `1` - 型エラーあり
- `2` - 警告あり（`--strict`の場合のみ）

## init

設定ファイルとディレクトリ構造で新しいT-Rubyプロジェクトを初期化します。

### 基本的な使用法

```bash
# 現在のディレクトリにtrc.yamlを作成
trc init

# インタラクティブセットアップ
trc init --interactive

# テンプレートを使用
trc init --template rails
```

### オプション

```bash
# プロンプトをスキップしてデフォルトを使用
trc init --yes

# プロジェクト名を指定
trc init --name my-project

# テンプレートを選択（basic, rails, gem, sinatra）
trc init --template rails

# ディレクトリ構造を作成
trc init --create-dirs

# gitリポジトリを初期化
trc init --git
```

### テンプレート

**Basic（デフォルト）:**

```bash
trc init --template basic
```

作成:
```
trc.yaml
src/
build/
sig/
```

**Rails:**

```bash
trc init --template rails
```

Railsプロジェクト用の設定を作成:
```yaml
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - lib

output:
  ruby_dir: app
  preserve_structure: true

compiler:
  strictness: standard

types:
  external:
    - rails
    - activerecord
```

**Gem:**

```bash
trc init --template gem
```

gem開発用の設定を作成:
```yaml
source:
  include:
    - lib
  exclude:
    - "**/*_spec.trb"

output:
  ruby_dir: lib
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: strict
  generate_rbs: true
```

**Sinatra:**

```bash
trc init --template sinatra
```

Sinatraアプリ用の設定を作成:
```yaml
source:
  include:
    - app
    - lib

output:
  ruby_dir: build
  rbs_dir: sig

compiler:
  strictness: standard

types:
  external:
    - sinatra
```

### インタラクティブモード

```bash
trc init --interactive
```

セットアップをガイドします:

```
T-Rubyプロジェクトセットアップ
====================

? プロジェクト名: my-awesome-project
? プロジェクトタイプ: (矢印キーを使用)
  ❯ Basic
    Rails
    Gem
    Sinatra
    Custom

? ソースディレクトリ: src
? 出力ディレクトリ: build
? RBSディレクトリ: sig

? 厳格性レベル: (矢印キーを使用)
    Strict（すべてのコードに型が必須）
  ❯ Standard（公開APIに型が必須）
    Permissive（最小限の要件）

? RBSファイルを生成しますか? Yes
? ターゲットRubyバージョン: 3.2

? ディレクトリ構造を作成しますか? Yes
? gitリポジトリを初期化しますか? Yes

✓ trc.yamlを作成しました
✓ src/を作成しました
✓ build/を作成しました
✓ sig/を作成しました
✓ gitリポジトリを初期化しました

T-Rubyプロジェクトの準備ができました！試してみてください:

  trc compile src/
  trc watch src/
```

### 例

**新しいプロジェクトをすばやく開始:**

```bash
mkdir my-project
cd my-project
trc init --yes --create-dirs
```

**Railsプロジェクトのセットアップ:**

```bash
cd my-rails-app
trc init --template rails --interactive
```

**Gem開発:**

```bash
bundle gem my_gem
cd my_gem
trc init --template gem --create-dirs
```

## グローバルオプション

これらのオプションはすべてのコマンドで動作します:

```bash
# バージョンを表示
trc --version
trc -v

# ヘルプを表示
trc --help
trc -h

# 特定のコマンドのヘルプを表示
trc compile --help

# 特定の設定ファイルを使用
trc --config path/to/trc.yaml

# ログレベルを設定（debug, info, warn, error）
trc --log-level debug

# カラー出力を有効化（デフォルト: auto）
trc --color

# カラー出力を無効化
trc --no-color

# エラー時にスタックトレースを表示
trc --stack-trace
```

## 設定ファイル

コマンドは`trc.yaml`設定ファイルを尊重します。コマンドラインオプションは設定ファイルの設定を上書きします。

ワークフロー例:

```yaml title="trc.yaml"
source:
  include:
    - src
  exclude:
    - "**/*_test.trb"

output:
  ruby_dir: build
  rbs_dir: sig

compiler:
  strictness: standard
  generate_rbs: true
```

その後、単純に実行:

```bash
# trc.yamlの設定を使用
trc compile
trc watch
trc check
```

## CI/CDでの使用

### GitHub Actions

```yaml
- name: Type Check
  run: trc check . --format junit --output-file test-results.xml

- name: Compile
  run: trc compile . --quiet
```

### GitLab CI

```yaml
typecheck:
  script:
    - trc check . --strict
    - trc compile .
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# ステージされた.trbファイルを取得
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.trb$')

if [ -n "$STAGED_FILES" ]; then
  echo "ステージされたファイルを型チェック中..."
  trc check $STAGED_FILES --strict

  if [ $? -ne 0 ]; then
    echo "型チェックに失敗しました。コミットが中止されました。"
    exit 1
  fi
fi
```

## ヒントとベストプラクティス

### 開発ワークフロー

1. **開発中は監視モードを使用:**
   ```bash
   trc watch src/ --clear --exec "bundle exec rspec"
   ```

2. **コミット前にチェックを実行:**
   ```bash
   trc check . --strict
   ```

3. **スクリプトではquietモードを使用:**
   ```bash
   trc compile . --quiet || exit 1
   ```

### パフォーマンス

1. **可能な限りディレクトリ全体ではなく特定のファイルをコンパイル:**
   ```bash
   # より高速
   trc compile src/models/user.trb

   # より遅い
   trc compile src/
   ```

2. **RBSファイルが不要な場合は`--no-rbs`を使用:**
   ```bash
   trc compile . --no-rbs
   ```

3. **大規模プロジェクトでは監視モードのデバウンスを増加:**
   ```bash
   trc watch --debounce 500
   ```

### トラブルシューティング

**コマンドが見つからない:**
```bash
# インストールを確認
which trc

# 必要に応じて再インストール
gem install t-ruby
```

**遅いコンパイル:**
```bash
# 詳細モードで何に時間がかかっているか確認
trc compile . --verbose

# 設定を確認
trc compile . --log-level debug
```

**予期しない出力場所:**
```bash
# 設定を確認
cat trc.yaml

# または明示的に指定
trc compile src/ --output build/ --rbs-dir sig/
```

## 次のステップ

- [設定リファレンス](/docs/cli/configuration) - `trc.yaml`オプションを学ぶ
- [コンパイラオプション](/docs/cli/compiler-options) - 詳細なコンパイラフラグと設定
- [プロジェクト設定](/docs/getting-started/project-configuration) - プロジェクトをセットアップ
