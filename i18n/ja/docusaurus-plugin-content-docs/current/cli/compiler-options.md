---
sidebar_position: 3
title: コンパイラオプション
description: 利用可能なすべてのコンパイラオプション
---

<DocsBadge />


# コンパイラオプション

T-Rubyのコンパイラは、コンパイル、型チェック、コード生成を制御するための豊富なオプションを提供します。このリファレンスでは、利用可能なすべてのコマンドラインフラグとその効果について説明します。

## 概要

コンパイラオプションは3つの方法で指定できます：

1. **コマンドラインフラグ**: `trc --strict compile src/`
2. **設定ファイル**: `trbconfig.yml`の`compiler:`セクション
3. **環境変数**: `TRC_STRICT=true trc compile src/`

コマンドラインフラグは設定ファイルの設定より優先されます。

## 型チェックオプション

### --strict

厳格な型チェックモードを有効にします。設定の`strictness: strict`と同等です。

```bash
trc compile --strict src/
```

厳格モードでは：
- すべての関数パラメータと戻り型が必須
- すべてのインスタンス変数に型指定が必須
- 暗黙の`any`型は不可
- 厳格なnil検査が有効

```trb
# 厳格モードでは完全な型指定が必要
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result: Hash<String, Integer> = {}
  result
end
```

### --permissive

寛容な型チェックモードを有効にします。段階的な型付けを許可します。

```bash
trc compile --permissive src/
```

寛容モードでは：
- 型はオプション
- 暗黙の`any`を許可
- 明示的な型エラーのみをキャッチ

```ruby
# 寛容モードでは型なしコードを許可
def process(data)
  @count = 0
  result = {}
  result
end
```

### --no-implicit-any

暗黙の`any`型を禁止します。

```bash
trc compile --no-implicit-any src/
```

```trb
# --no-implicit-any使用時はエラー
def process(data)  # エラー: 暗黙のany
  # ...
end

# 明示的に指定が必要
def process(data: Any)  # OK
  # ...
end
```

### --strict-nil

厳格なnil検査を有効にします。

```bash
trc compile --strict-nil src/
```

```trb
# --strict-nil使用時はエラー
def find_user(id: Integer): User  # エラー: nilを返す可能性あり
  users.find { |u| u.id == id }
end

# 型にnilを含める必要あり
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end
```

### --no-unused-vars

未使用の変数とパラメータに対して警告します。

```bash
trc compile --no-unused-vars src/
```

```trb
# --no-unused-vars使用時は警告
def calculate(x: Integer, y: Integer): Integer
  x * 2  # 警告: yが未使用
end

# 意図的に未使用であることを示すにはアンダースコア接頭辞を使用
def calculate(x: Integer, _y: Integer): Integer
  x * 2  # 警告なし
end
```

### --no-unchecked-indexed-access

配列/ハッシュアクセス前の検査を要求します。

```bash
trc compile --no-unchecked-indexed-access src/
```

```trb
# --no-unchecked-indexed-access使用時はエラー
users: Array<User> = get_users()
user = users[0]  # エラー: nilの可能性あり

# まず検査が必要
if users[0]
  user = users[0]  # OK
end
```

### --require-return-types

すべての関数に明示的な戻り型を要求します。

```bash
trc compile --require-return-types src/
```

```trb
# --require-return-types使用時はエラー
def calculate(x: Integer)  # エラー: 戻り型が不足
  x * 2
end

# 戻り型の指定が必要
def calculate(x: Integer): Integer
  x * 2
end
```

## 出力オプション

### --output, -o

コンパイルされたRubyファイルの出力ディレクトリを指定します。

```bash
trc compile src/ --output build/
trc compile src/ -o build/
```

デフォルト: `build/`

### --rbs-dir

RBSシグネチャファイルの出力ディレクトリを指定します。

```bash
trc compile src/ --rbs-dir sig/
```

デフォルト: `sig/`

### --no-rbs

RBSファイル生成をスキップします。

```bash
trc compile src/ --no-rbs
```

以下の場合に便利：
- Ruby出力のみが必要な場合
- RBSファイルが別の場所で生成される場合
- 高速なコンパイルが必要な場合

### --rbs-only

RBSファイルのみを生成し、Ruby出力をスキップします。

```bash
trc compile src/ --rbs-only
```

以下の場合に便利：
- 型シグネチャの更新
- コンパイルなしの型チェック
- 既存Rubyコードの型生成

### --preserve-structure

出力でソースディレクトリ構造を保持します。

```bash
trc compile src/ --preserve-structure
```

```
src/models/user.trb → build/models/user.rb
```

### --no-preserve-structure

出力ディレクトリ構造をフラット化します。

```bash
trc compile src/ --no-preserve-structure
```

```
src/models/user.trb → build/user.rb
```

### --clean

コンパイル前に出力ディレクトリをクリーンアップします。

```bash
trc compile --clean src/
```

コンパイル前に`output`と`rbs_dir`のすべてのファイルを削除します。

## ターゲットオプション

### --target-ruby

生成コードのターゲットRubyバージョンを指定します。

```bash
trc compile --target-ruby 3.2 src/
```

サポート: `2.7`, `3.0`, `3.1`, `3.2`, `3.3`

影響：
- 使用される構文機能
- 標準ライブラリの互換性
- メソッドの利用可能性

例：

**パターンマッチング (Ruby 3.0+):**
```bash
# ターゲット3.0+
trc compile --target-ruby 3.0 src/

# ネイティブパターンマッチングを使用
case value
in { name: n }
  puts n
end
```

```bash
# ターゲット2.7
trc compile --target-ruby 2.7 src/

# 互換コードにコンパイル
case
when value.is_a?(Hash) && value[:name]
  n = value[:name]
  puts n
end
```

### --experimental

実験的機能を有効にします。

```bash
trc compile --experimental pattern_matching_types src/
```

複数の機能：
```bash
trc compile \
  --experimental pattern_matching_types \
  --experimental refinement_types \
  src/
```

利用可能な実験的機能：

- `pattern_matching_types` - パターンマッチングからの型推論
- `refinement_types` - リファインメントベースの型絞り込み
- `variadic_generics` - 可変長ジェネリックパラメータ
- `higher_kinded_types` - 型パラメータとしての型コンストラクタ
- `dependent_types` - 値に依存する型

**警告:** 実験的機能は変更または削除される可能性があります。

## 最適化オプション

### --optimize

コード最適化を有効にします。

```bash
trc compile --optimize basic src/
```

レベル：
- `none` - 最適化なし（デフォルト）
- `basic` - 安全な最適化
- `aggressive` - 最大最適化

**none:**
```ruby
# コード構造の変更なし
CONSTANT = 42

def calculate
  CONSTANT * 2
end
```

**basic:**
```ruby
# 定数のインライン化、デッドコードの削除
def calculate
  84  # 定数畳み込み
end
```

**aggressive:**
```ruby
# 関数のインライン化、コードの並べ替えの可能性
def calculate
  84
end
```

### --no-optimize

すべての最適化を無効にします。

```bash
trc compile --no-optimize src/
```

出力がソース構造と正確に一致することを保証します。

## ソースオプション

### --include

追加のソースファイルやディレクトリを含めます。

```bash
trc compile src/ --include lib/ --include config/
```

### --exclude

コンパイルからファイルやパターンを除外します。

```bash
trc compile src/ --exclude "**/*_test.trb"
```

複数の除外：
```bash
trc compile src/ \
  --exclude "**/*_test.trb" \
  --exclude "**/*_spec.trb" \
  --exclude "**/fixtures/**"
```

### --extensions

処理するファイル拡張子を指定します。

```bash
trc compile src/ --extensions .trb,.truby
```

デフォルト: `.trb`

## 型オプション

### --type-paths

型定義を含むディレクトリを追加します。

```bash
trc compile src/ --type-paths types/,vendor/types/
```

### --no-stdlib

標準ライブラリの型定義を含めません。

```bash
trc compile --no-stdlib src/
```

カスタムstdlib型を提供する場合に便利です。

### --external-types

外部の型定義をインポートします。

```bash
trc compile --external-types rails,rspec src/
```

複数のライブラリ：
```bash
trc compile \
  --external-types rails \
  --external-types activerecord \
  --external-types rspec \
  src/
```

## ウォッチオプション

（`trc watch`コマンド用）

### --debounce

デバウンス遅延をミリ秒単位で設定します。

```bash
trc watch --debounce 300 src/
```

デフォルト: 100ms

最後のファイル変更後300ms待機してから再コンパイルします。

### --clear

各再コンパイル時にターミナル画面をクリアします。

```bash
trc watch --clear src/
```

### --exec

成功したコンパイル後にコマンドを実行します。

```bash
trc watch --exec "bundle exec rspec" src/
```

### --on-success

`--exec`のエイリアスです。

```bash
trc watch --on-success "rake test" src/
```

### --on-failure

失敗したコンパイル後にコマンドを実行します。

```bash
trc watch --on-failure "notify-send 'Build failed'" src/
```

### --watch-paths

追加のディレクトリを監視します。

```bash
trc watch src/ --watch-paths config/,types/
```

### --ignore

ウォッチモードでファイルパターンを無視します。

```bash
trc watch --ignore "**/tmp/**" src/
```

### --once

一度コンパイルして終了します（変更を監視しません）。

```bash
trc watch --once src/
```

ウォッチモード設定のテストに便利です。

## チェックオプション

（`trc check`コマンド用）

### --format

型チェック結果の出力形式を指定します。

```bash
trc check --format json src/
```

形式：
- `text` - 人間が読みやすい形式（デフォルト）
- `json` - JSON形式
- `junit` - JUnit XML形式

**text:**
```
Error: src/user.trb:15:10
  Type mismatch: expected String, got Integer
```

**json:**
```json
{
  "files_checked": 10,
  "errors": [{
    "file": "src/user.trb",
    "line": 15,
    "column": 10,
    "severity": "error",
    "message": "Type mismatch: expected String, got Integer"
  }]
}
```

**junit:**
```xml
<testsuites>
  <testsuite name="T-Ruby Type Check" tests="10" failures="1">
    <testcase name="src/user.trb">
      <failure message="Type mismatch">...</failure>
    </testcase>
  </testsuite>
</testsuites>
```

### --output-file

チェック結果をファイルに書き込みます。

```bash
trc check --format json --output-file results.json src/
```

### --max-errors

表示するエラー数を制限します。

```bash
trc check --max-errors 10 src/
```

デフォルト: 50

### --no-error-limit

すべてのエラーを表示します（制限なし）。

```bash
trc check --no-error-limit src/
```

### --warnings

エラーに加えて警告も表示します。

```bash
trc check --warnings src/
```

## 初期化オプション

（`trc --init`コマンド用）

### --template

プロジェクトテンプレートを使用します。

```bash
trc --init --template rails
```

テンプレート：
- `basic` - 基本プロジェクト（デフォルト）
- `rails` - Railsアプリケーション
- `gem` - Ruby gem
- `sinatra` - Sinatraアプリケーション

### --interactive

対話型プロジェクトセットアップ。

```bash
trc --init --interactive
```

すべての設定オプションをプロンプトします。

### --yes, -y

プロンプトなしですべてのデフォルトを受け入れます。

```bash
trc --init --yes
trc --init -y
```

### --name

プロジェクト名を設定します。

```bash
trc --init --name my-awesome-project
```

### --create-dirs

ディレクトリ構造を作成します。

```bash
trc --init --create-dirs
```

`src/`, `build/`, `sig/`ディレクトリを作成します。

### --git

gitリポジトリを初期化します。

```bash
trc --init --git
```

`.git/`と`.gitignore`を作成します。

## ロギングとデバッグオプション

### --verbose, -v

詳細な出力を表示します。

```bash
trc compile --verbose src/
trc compile -v src/
```

表示内容：
- 処理中のファイル
- 型解決の詳細
- コンパイル手順

### --quiet, -q

エラー以外の出力を抑制します。

```bash
trc compile --quiet src/
trc compile -q src/
```

エラーのみを表示します。

### --log-level

ロギングレベルを設定します。

```bash
trc compile --log-level debug src/
```

レベル：
- `debug` - すべてのメッセージ
- `info` - 情報メッセージ（デフォルト）
- `warn` - 警告とエラー
- `error` - エラーのみ

### --stack-trace

エラー時にスタックトレースを表示します。

```bash
trc compile --stack-trace src/
```

コンパイラの問題のデバッグに便利です。

### --profile

パフォーマンスプロファイリング情報を表示します。

```bash
trc compile --profile src/
```

出力：
```
Compilation completed in 2.4s

Phase breakdown:
  Parse:        0.8s (33%)
  Type check:   1.2s (50%)
  Code gen:     0.3s (12%)
  Write files:  0.1s (5%)
```

## 設定オプション

### --config, -c

特定の設定ファイルを使用します。

```bash
trc compile --config trc.production.yaml src/
trc compile -c trc.production.yaml src/
```

### --no-config

設定ファイルを無視します。

```bash
trc compile --no-config src/
```

コマンドラインオプションとデフォルトのみを使用します。

### --print-config

有効な設定を出力して終了します。

```bash
trc compile --print-config src/
```

ファイル、環境、コマンドラインからマージされた設定を表示します。

## 出力制御オプション

### --color

カラー出力を強制します。

```bash
trc compile --color src/
```

### --no-color

カラー出力を無効にします。

```bash
trc compile --no-color src/
```

以下の場合に便利：
- CI/CD環境
- ログファイル出力
- 非ターミナル出力

### --progress

コンパイル中にプログレスバーを表示します。

```bash
trc compile --progress src/
```

```
Compiling: [████████████████░░░░] 80% (40/50 files)
```

### --no-progress

プログレスバーを無効にします。

```bash
trc compile --no-progress src/
```

## 並列コンパイルオプション

### --parallel

並列コンパイルを有効にします。

```bash
trc compile --parallel src/
```

複数のファイルを同時にコンパイルします。

### --jobs, -j

並列ジョブ数を指定します。

```bash
trc compile --parallel --jobs 4 src/
trc compile --parallel -j 4 src/
```

デフォルト: CPUコア数

### --no-parallel

並列コンパイルを無効にします（シリアルコンパイル）。

```bash
trc compile --no-parallel src/
```

以下の場合に便利：
- デバッグ
- メモリ制約環境
- 再現可能な出力順序

## キャッシングオプション

### --cache

コンパイルキャッシュを有効にします。

```bash
trc compile --cache src/
```

型情報とパースされたASTをキャッシュして、後続のコンパイルを高速化します。

### --no-cache

コンパイルキャッシュを無効にします。

```bash
trc compile --no-cache src/
```

完全な再コンパイルを強制します。

### --cache-dir

キャッシュディレクトリを指定します。

```bash
trc compile --cache --cache-dir .trc-cache/ src/
```

デフォルト: `.trc-cache/`

### --clear-cache

実行前にコンパイルキャッシュをクリアします。

```bash
trc compile --clear-cache src/
```

## 高度なオプション

### --ast

Rubyコードの代わりに抽象構文木を出力します。

```bash
trc compile --ast src/user.trb
```

以下の場合に便利：
- パーサーの問題のデバッグ
- コード構造の理解
- ツールの構築

### --tokens

レキサーからのトークンストリームを出力します。

```bash
trc compile --tokens src/user.trb
```

### --trace

型チェックプロセスをトレースします。

```bash
trc compile --trace src/
```

詳細な型推論とチェックの手順を表示します。

### --dump-types

推論された型をファイルにダンプします。

```bash
trc compile --dump-types types.json src/
```

### --allow-errors

型エラーがあってもコンパイルを続行します。

```bash
trc compile --allow-errors src/
```

型エラーにもかかわらずRuby出力を生成します。以下の場合に便利：
- 生成されたコードのデバッグ
- 段階的な移行
- テスト

**警告:** 生成されたコードにランタイムエラーがある可能性があります。

### --source-maps

デバッグ用のソースマップを生成します。

```bash
trc compile --source-maps src/
```

RubyコードをT-Rubyソースにマッピングする`.rb.map`ファイルを作成します。

## 組み合わせ例

### 厳格なプロダクションビルド

```bash
trc compile \
  --strict \
  --no-implicit-any \
  --strict-nil \
  --optimize aggressive \
  --clean \
  --target-ruby 3.2 \
  src/
```

### ウォッチモードで開発

```bash
trc watch \
  --permissive \
  --clear \
  --debounce 200 \
  --exec "bundle exec rspec" \
  src/
```

### CI/CD型チェック

```bash
trc check \
  --strict \
  --format junit \
  --output-file test-results.xml \
  --no-color \
  --quiet \
  src/
```

### 高速なインクリメンタルビルド

```bash
trc compile \
  --cache \
  --parallel \
  --jobs 8 \
  --no-rbs \
  src/
```

### コンパイルの問題をデバッグ

```bash
trc compile \
  --verbose \
  --stack-trace \
  --profile \
  --log-level debug \
  --no-parallel \
  src/
```

## 環境変数

多くのオプションは環境変数で設定できます：

```bash
export TRC_STRICT=true
export TRC_TARGET_RUBY=3.2
export TRC_OUTPUT_DIR=build
export TRC_CACHE=true
export TRC_PARALLEL=true
export TRC_JOBS=4

trc compile src/
```

変数は設定ファイルを上書きしますが、コマンドラインフラグで上書きできます。

## オプションの優先順位

オプションは以下の順序で解決されます（後のものが前のものを上書き）：

1. デフォルト値
2. 設定ファイル（`trbconfig.yml`）
3. 環境変数
4. コマンドラインフラグ

例：

```yaml
# trbconfig.yml
compiler:
  strictness: standard
```

```bash
# 環境変数
export TRC_STRICTNESS=permissive

# コマンドラインフラグが優先
trc compile --strict src/

# 有効値: strictness = strict
```

## オプショングループリファレンス

### 型チェック
- `--strict`, `--permissive`
- `--no-implicit-any`
- `--strict-nil`
- `--no-unused-vars`
- `--no-unchecked-indexed-access`
- `--require-return-types`

### 出力制御
- `--output`, `-o`
- `--rbs-dir`
- `--no-rbs`, `--rbs-only`
- `--preserve-structure`
- `--clean`

### ターゲットと最適化
- `--target-ruby`
- `--optimize`
- `--experimental`

### ロギング
- `--verbose`, `-v`
- `--quiet`, `-q`
- `--log-level`
- `--stack-trace`
- `--profile`

### パフォーマンス
- `--parallel`, `--jobs`
- `--cache`, `--cache-dir`
- `--no-parallel`

### 高度
- `--ast`, `--tokens`
- `--trace`
- `--dump-types`
- `--allow-errors`
- `--source-maps`

## 次のステップ

- [コマンドリファレンス](/docs/cli/commands) - すべてのCLIコマンドを学ぶ
- [設定ファイル](/docs/cli/configuration) - `trbconfig.yml`で設定する
- [型アノテーション](/docs/learn/basics/type-annotations) - 型付きコードを書き始める
