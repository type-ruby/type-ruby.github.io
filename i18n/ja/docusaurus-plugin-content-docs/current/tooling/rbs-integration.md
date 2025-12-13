---
sidebar_position: 1
title: RBS統合
description: T-RubyがRBSファイルを生成し連携する方法
---

<DocsBadge />


# RBS統合

T-RubyはRubyの公式型シグネチャフォーマットであるRBS（Ruby Signature）とシームレスに統合されます。T-Rubyコードをコンパイルすると、コンパイラはRuby出力と一緒に`.rbs`ファイルを自動的に生成し、より広いRuby型付けエコシステムとの統合を可能にします。

## RBSとは？

RBSはRubyの標準型シグネチャフォーマットです。Rubyプログラムの構造を記述するための別言語で、以下を含みます：

- メソッドシグネチャ
- クラスとモジュールの定義
- インスタンス変数とクラス変数
- ジェネリクスと型パラメータ

## T-RubyがRBSを生成する方法

T-Rubyコードをコンパイルすると、コンパイラが型情報を抽出し、対応するRBSファイルを生成します。

### 基本例

**T-Ruby入力** (`user.trb`):

```trb
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

  def update_email(new_email: String): void
    @email = new_email
  end
end
```

**生成されたRBS** (`sig/user.rbs`):

```rbs
class User
  @id: Integer
  @name: String
  @email: String

  def initialize: (Integer id, String name, String email) -> void
  def greet: () -> String
  def update_email: (String new_email) -> void
end
```

**生成されたRuby** (`build/user.rb`):

```ruby
class User
  def initialize(id, name, email)
    @id = id
    @name = name
    @email = email
  end

  def greet
    "Hello, I'm #{@name}!"
  end

  def update_email(new_email)
    @email = new_email
  end
end
```

## コンパイルオプション

### RBS生成の有効化/無効化

デフォルトでRBSファイルが生成されます。これを制御できます：

```yaml title="trbconfig.yml"
compiler:
  generate_rbs: true  # デフォルト
```

またはコマンドラインで：

```bash
# RBS生成をスキップ
trc compile --no-rbs src/

# RBSのみ生成（Rubyをスキップ）
trc compile --rbs-only src/
```

### RBS出力ディレクトリ

RBSファイルの出力先を設定：

```yaml title="trbconfig.yml"
output:
  rbs_dir: sig  # デフォルト
```

```bash
trc compile --rbs-dir signatures/ src/
```

## サポートされるRBS機能

### メソッドシグネチャ

T-Rubyはパラメータと戻り値の型を含むメソッドシグネチャを自動的に生成します。

```trb title="calculator.trb"
def add(a: Integer, b: Integer): Integer
  a + b
end

def divide(a: Float, b: Float): Float | nil
  return nil if b == 0
  a / b
end
```

```rbs title="sig/calculator.rbs"
def add: (Integer a, Integer b) -> Integer
def divide: (Float a, Float b) -> (Float | nil)
```

### オプショナルパラメータとキーワードパラメータ

```trb title="formatter.trb"
def format(
  text: String,
  uppercase: Bool = false,
  prefix: String? = nil
): String
  result = uppercase ? text.upcase : text
  prefix ? "#{prefix}#{result}" : result
end
```

```rbs title="sig/formatter.rbs"
def format: (
  String text,
  ?Bool uppercase,
  ?String? prefix
) -> String
```

### ブロックシグネチャ

```trb title="iterator.trb"
def each_item(items: Array<String>): void do |String| -> void end
  items.each { |item| yield item }
end
```

```rbs title="sig/iterator.rbs"
def each_item: (Array[String] items) { (String) -> void } -> void
```

### ジェネリクス

T-Rubyのジェネリック型はRBSジェネリクスに直接マッピングされます。

```trb title="container.trb"
class Container<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end

  def set(value: T): void
    @value = value
  end
end
```

```rbs title="sig/container.rbs"
class Container[T]
  @value: T

  def initialize: (T value) -> void
  def get: () -> T
  def set: (T value) -> void
end
```

### ユニオン型

```trb title="parser.trb"
def parse(input: String): Integer | Float | nil
  return nil if input.empty?

  if input.include?(".")
    input.to_f
  else
    input.to_i
  end
end
```

```rbs title="sig/parser.rbs"
def parse: (String input) -> (Integer | Float | nil)
```

### モジュールとミックスイン

```trb title="loggable.trb"
module Loggable
  def log(message: String): void
    puts "[LOG] #{message}"
  end

  def log_error(error: String): void
    puts "[ERROR] #{error}"
  end
end

class Service
  include Loggable

  def process: void
    log("Processing...")
  end
end
```

```rbs title="sig/loggable.rbs"
module Loggable
  def log: (String message) -> void
  def log_error: (String error) -> void
end

class Service
  include Loggable

  def process: () -> void
end
```

### 型エイリアス

```trb title="types.trb"
type UserId = Integer
type UserMap = Hash<UserId, User>

def find_users(ids: Array<UserId>): UserMap
  # ...
end
```

```rbs title="sig/types.rbs"
type UserId = Integer
type UserMap = Hash[UserId, User]

def find_users: (Array[UserId] ids) -> UserMap
```

### インターフェース

T-RubyインターフェースはRBSインターフェース型に変換されます。

```trb title="printable.trb"
interface Printable
  def to_s: String
  def print: void
end

class Document
  implements Printable

  def to_s: String
    "Document"
  end

  def print: void
    puts to_s
  end
end
```

```rbs title="sig/printable.rbs"
interface _Printable
  def to_s: () -> String
  def print: () -> void
end

class Document
  include _Printable

  def to_s: () -> String
  def print: () -> void
end
```

## 生成されたRBSファイルの使用

### Steepと一緒に使用

SteepはT-Rubyが生成したRBSファイルを型チェックに使用できます：

```yaml title="Steepfile"
target :app do
  signature "sig"  # T-Ruby生成シグネチャ
  check "build"    # コンパイル済みRubyファイル
end
```

```bash
trc compile src/
steep check
```

### Ruby LSPと一緒に使用

T-RubyのRBSファイルを使用するようにRuby LSPを設定：

```json title=".vscode/settings.json"
{
  "rubyLsp.enabledFeatures": {
    "diagnostics": true
  },
  "rubyLsp.typechecker": "steep",
  "rubyLsp.rbs.path": "sig"
}
```

### Sorbetと一緒に使用

RBSからSorbet互換の型スタブを生成：

```bash
# RBSファイルを生成
trc compile --rbs-only src/

# Sorbetスタブに変換
rbs-to-sorbet sig/ sorbet/rbi/
```

### 標準Gemと一緒に使用

RBSシグネチャをgemに含める：

```ruby title="my_gem.gemspec"
Gem::Specification.new do |spec|
  spec.name = "my_gem"
  spec.files = Dir["lib/**/*", "sig/**/*"]
  spec.metadata["rbs_signatures"] = "sig"
end
```

## 高度なRBS生成

### カスタムRBSアノテーション

コメントにRBS専用アノテーションを追加：

```rbs title="service.trb"
class Service
  # @rbs_skip
  def debug_method: void
    # このメソッドはRBSに現れない
  end

  # @rbs_override
  # def custom_signature: (String) -> Integer
  def custom_method(input: String): Integer
    input.length
  end
end
```

### 外部RBS統合

T-Rubyが生成したRBSと手書きのRBSを組み合わせ：

```
sig/
├── generated/      # T-Rubyが生成
│   ├── user.rbs
│   └── service.rbs
└── manual/         # 手書き
    └── external.rbs
```

```yaml title="trbconfig.yml"
output:
  rbs_dir: sig/generated

types:
  paths:
    - sig/manual
    - sig/generated
```

### RBSファイルのマージ

既存のRBSファイルがある場合：

```bash
# 新しいRBSを生成
trc compile --rbs-only src/

# 既存と統合
rbs merge sig/generated/ sig/manual/ -o sig/merged/
```

## RBS検証

生成されたRBSファイルを検証：

```bash
# RBSを生成
trc compile src/

# RBSで検証
rbs validate --signature-path=sig/
```

T-Rubyは生成されたRBSが常に有効であることを保証しますが、以下の場合に検証が有用です：
- 手書きのRBSと組み合わせるとき
- 外部型定義を使用するとき
- 型の問題をデバッグするとき

## RBSと型チェックフロー

T-RubyのRBS統合が型チェックにどのように適用されるか：

```
┌─────────────┐
│  .trbファイル│
│  (T-Ruby)   │
└──────┬──────┘
       │
       ▼
   ┌────────┐
   │  trc   │  コンパイル
   └───┬────┘
       │
       ├──────────┐
       ▼          ▼
 ┌──────────┐  ┌──────────┐
 │ .rbファイル│  │.rbsファイル│
 │ (Ruby)   │  │  (RBS)   │
 └─────┬────┘  └────┬─────┘
       │            │
       │            ▼
       │      ┌──────────┐
       │      │  Steep   │  型チェック
       │      │ Ruby LSP │
       │      └──────────┘
       │
       ▼
  ┌──────────┐
  │   Ruby   │  実行
  │インタプリタ│
  └──────────┘
```

## 実践例

### 例1：ライブラリ開発

RBSを含む型付きライブラリを作成：

```trb title="lib/my_library.trb"
module MyLibrary
  class Client
    @api_key: String
    @endpoint: String

    def initialize(api_key: String, endpoint: String = "https://api.example.com"): void
      @api_key = api_key
      @endpoint = endpoint
    end

    def get<T>(path: String, params: Hash<String, Any> = {}): T | nil
      # 実装
    end

    def post<T>(path: String, body: Hash<String, Any>): T
      # 実装
    end
  end
end
```

コンパイル：

```bash
trc compile lib/
```

生成されるファイル：

```
lib/
├── my_library.rb   # ランタイム用
sig/
└── my_library.rbs  # 型チェックとドキュメント用
```

ユーザーは以下のように使用できます：

```ruby
# Rubyで使用
require "my_library"
client = MyLibrary::Client.new("key123")

# Steepで型チェック
# steep checkはsig/my_library.rbsを使用
```

### 例2：Railsアプリケーション

RailsモデルでRBSを使用：

```trb title="app/models/user.trb"
class User < ApplicationRecord
  @name: String
  @email: String
  @admin: Bool

  def self.find_by_email(email: String): User | nil
    find_by(email: email)
  end

  def admin?: Bool
    @admin
  end

  def promote_to_admin: void
    update!(admin: true)
  end
end
```

```yaml title="trbconfig.yml"
source:
  include:
    - app/models

output:
  ruby_dir: app/models
  rbs_dir: sig
```

コンパイル：

```bash
trc compile
```

これでSteepがRailsアプリをチェックできます：

```yaml title="Steepfile"
target :app do
  signature "sig"
  check "app"

  library "activerecord"
end
```

### 例3：型シグネチャ付きGem

gemにRBSをパッケージング：

```ruby title="my_gem.gemspec"
Gem::Specification.new do |spec|
  spec.name = "my_typed_gem"
  spec.version = "1.0.0"

  spec.files = Dir[
    "lib/**/*.rb",
    "sig/**/*.rbs"
  ]

  spec.metadata = {
    "rbs_signatures" => "sig"
  }
end
```

ユーザーはgemを使用するとき自動的に型情報を取得します。

## トラブルシューティング

### RBS生成の失敗

RBS生成が失敗する場合：

```bash
# 詳細出力でコンパイルを確認
trc compile --verbose src/

# まずT-Rubyの型を検証
trc check src/

# 別途RBSを生成
trc compile --rbs-only src/
```

### RBS検証エラー

RBS検証が失敗する場合：

```bash
# 特定のRBSファイルを確認
rbs validate sig/user.rbs

# 生成されたRBSを表示
cat sig/user.rbs

# デバッグモードで再生成
trc compile --log-level debug src/
```

### 型の不一致

T-RubyとRBS間で型が一致しない場合：

```bash
# どのRBSが生成されたか確認
trc compile --rbs-only --output-file - src/user.trb

# 型トレースを使用
trc compile --trace src/
```

## ベストプラクティス

### 1. RBSをバージョン管理に含める

```bash
git add sig/
git commit -m "Update RBS signatures"
```

RBSファイルはソースコードです - Rubyファイルと一緒にコミットしてください。

### 2. CIでRBSを検証

```yaml title=".github/workflows/ci.yml"
- name: Generate and Validate RBS
  run: |
    trc compile src/
    rbs validate --signature-path=sig/
```

### 3. パブリックAPIをドキュメント化

RBSファイルはドキュメントとしても機能します。パブリックAPIが適切に型付けされていることを確認：

```trb
# 良い例 - 明確なパブリックAPI
class Service
  def process(data: Array<String>): Hash<String, Integer>
    # ...
  end

  private

  def internal_helper(x)  # privateは型なしでも可
    # ...
  end
end
```

### 4. 明確さのための型エイリアス使用

```trb
type UserId = Integer
type ResponseData = Hash<String, Any>

def fetch_user(id: UserId): ResponseData
  # ...
end
```

### 5. 手書きのRBSとの組み合わせ

生成されたRBSと手動RBSを分離：

```
sig/
├── generated/     # T-Rubyから生成
└── manual/        # 手書き
```

## 次のステップ

- [Steepの使用](/docs/tooling/steep) - Steepで型チェック
- [Ruby LSP統合](/docs/tooling/ruby-lsp) - IDEサポート
- [RBS公式ドキュメント](https://github.com/ruby/rbs) - RBSについてもっと学ぶ
