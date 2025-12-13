---
sidebar_position: 4
title: Rubyからの移行
description: 既存のRubyプロジェクトをT-Rubyに移行するガイド
---

<DocsBadge />


# Rubyからの移行

既存のRubyコードベースをT-Rubyに移行することは段階的なプロセスです。T-Rubyのオプショナル型システムのおかげで、すべてを一度に書き直すことなく、段階的に型を導入できます。

## 移行戦略

### 1. 段階的な導入

すべてを一度に移行する必要はありません。T-Rubyは段階的な導入を想定して設計されています：

- 単一のファイルまたはモジュールから開始
- まず新しいコードに型を追加
- 既存のコードを修正するときに移行
- 同じプロジェクトで`.rb`と`.trb`ファイルを混在

### 2. ボトムアップアプローチ

依存関係ツリーの下から上に向かって移行：

1. **ユーティリティ関数** - 明確な入力/出力を持つ純粋な関数
2. **データモデル** - データ構造を表すクラス
3. **サービス** - ビジネスロジックレイヤー
4. **コントローラー/ビュー** - 上位レベルのアプリケーションコード

### 3. 厳格さのレベル

移行中は異なる厳格さレベルを使用：

- **Permissive** - ここから開始、最小限の型要件
- **Standard** - 基本的な型が整ったらここへ移動
- **Strict** - 最大の型安全性のための最終目標

## ステップバイステップの移行

### ステップ1：T-Rubyのセットアップ

プロジェクトにT-Rubyをインストール：

```bash
gem install t-ruby
```

またはGemfileに追加：

```ruby
group :development do
  gem "t-ruby"
end
```

設定を初期化：

```bash
trc init
```

### ステップ2：開始点を選択

移行するファイルを選択。良い候補：

**データクラス** - 明確な構造、最小限の依存関係：

```ruby title="user.rb"
class User
  attr_reader :id, :name, :email

  def initialize(id, name, email)
    @id = id
    @name = name
    @email = email
  end

  def display_name
    "#{name} (#{email})"
  end
end
```

**純粋な関数** - 予測可能な入力と出力：

```ruby title="calculator.rb"
def calculate_tax(amount, rate)
  amount * rate
end

def format_currency(amount)
  "$#{sprintf('%.2f', amount)}"
end
```

### ステップ3：.trbにリネーム

```bash
mv user.rb user.trb
```

この時点で、ファイルはまだ有効なRubyです - すべてのRubyは有効なT-Rubyです。

### ステップ4：基本的な型を追加

シンプルな型アノテーションから開始：

```trb title="user.trb"
class User
  @id: Integer
  @name: String
  @email: String

  attr_reader :id, :name, :email

  def initialize(id: Integer, name: String, email: String): void
    @id = id
    @name = name
    @email = email
  end

  def display_name: String
    "#{@name} (#{@email})"
  end
end
```

### ステップ5：コンパイルしてエラーを修正

```bash
trc compile user.trb
```

表示される型エラーを修正：

```
Error: user.trb:12:5
  Type mismatch: expected String, got nil

  @email = params[:email]
           ^^^^^^^^^^^^^^

Hint: Did you mean: String | nil ?
```

修正：

```trb
def initialize(id: Integer, name: String, email: String | nil): void
  @id = id
  @name = name
  @email = email || "no-email@example.com"
end
```

### ステップ6：段階的な拡張

1つのファイルが動作したら、関連ファイルを移行：

```
Before:
  user.rb ✓ Migrated to user.trb
  post.rb ← Migrate next
  comment.rb

After:
  user.trb ✓
  post.trb ✓
  comment.rb
```

## 一般的な移行パターン

### パターン1：シンプルなデータクラス

**以前**（Ruby）：

```ruby
class Product
  attr_accessor :id, :name, :price, :in_stock

  def initialize(id, name, price, in_stock = true)
    @id = id
    @name = name
    @price = price
    @in_stock = in_stock
  end

  def discounted_price(percentage)
    @price * (1 - percentage / 100.0)
  end
end
```

**以後**（T-Ruby）：

```trb
class Product
  @id: Integer
  @name: String
  @price: Float
  @in_stock: Bool

  attr_accessor :id, :name, :price, :in_stock

  def initialize(
    id: Integer,
    name: String,
    price: Float,
    in_stock: Bool = true
  ): void
    @id = id
    @name = name
    @price = price
    @in_stock = in_stock
  end

  def discounted_price(percentage: Float): Float
    @price * (1 - percentage / 100.0)
  end
end
```

### パターン2：サービスクラス

**以前**（Ruby）：

```ruby
class UserService
  def find_user(id)
    # データベース検索
    User.find(id)
  end

  def create_user(attributes)
    User.create(attributes)
  end

  def active_users
    User.where(active: true)
  end
end
```

**以後**（T-Ruby）：

```trb
class UserService
  def find_user(id: Integer): User | nil
    User.find(id)
  end

  def create_user(attributes: Hash<String, Any>): User
    User.create(attributes)
  end

  def active_users: Array<User>
    User.where(active: true)
  end
end
```

### パターン3：ミックスインを持つモジュール

**以前**（Ruby）：

```ruby
module Timestampable
  def created_at
    @created_at
  end

  def updated_at
    @updated_at
  end

  def touch
    @updated_at = Time.now
  end
end

class Post
  include Timestampable
end
```

**以後**（T-Ruby）：

```trb
module Timestampable
  @created_at: Time
  @updated_at: Time

  def created_at: Time
    @created_at
  end

  def updated_at: Time
    @updated_at
  end

  def touch: void
    @updated_at = Time.now
  end
end

class Post
  include Timestampable

  @title: String
  @content: String

  def initialize(title: String, content: String): void
    @title = title
    @content = content
    @created_at = Time.now
    @updated_at = Time.now
  end
end
```

### パターン4：Hash多用コード

**以前**（Ruby）：

```ruby
def process_order(order_data)
  {
    order_id: order_data[:id],
    total: calculate_total(order_data[:items]),
    status: "pending"
  }
end

def calculate_total(items)
  items.sum { |item| item[:price] * item[:quantity] }
end
```

**以後**（T-Ruby）：

明確さのための型エイリアスを定義：

```trb
type OrderData = Hash<Symbol, Any>
type OrderItem = Hash<Symbol, Any>
type OrderResult = Hash<Symbol, String | Integer>

def process_order(order_data: OrderData): OrderResult
  {
    order_id: order_data[:id].to_i,
    total: calculate_total(order_data[:items]),
    status: "pending"
  }
end

def calculate_total(items: Array<OrderItem>): Integer
  items.sum { |item| item[:price].to_i * item[:quantity].to_i }
end
```

または構造化された型を使用：

```trb
class OrderItem
  @price: Integer
  @quantity: Integer

  def initialize(price: Integer, quantity: Integer): void
    @price = price
    @quantity = quantity
  end

  def total: Integer
    @price * @quantity
  end
end

def calculate_total(items: Array<OrderItem>): Integer
  items.sum(&:total)
end
```

### パターン5：動的メソッド呼び出し

**以前**（Ruby）：

```ruby
class DynamicModel
  def method_missing(method, *args)
    if method.to_s.start_with?('find_by_')
      attribute = method.to_s.sub('find_by_', '')
      find_by(attribute, args.first)
    else
      super
    end
  end

  def find_by(attribute, value)
    # データベースクエリ
  end
end
```

**以後**（T-Ruby）：

明示的なメソッドを使用するか型を定義：

```trb
class DynamicModel
  # 型安全性のための明示的メソッド
  def find_by_name(name: String): DynamicModel | nil
    find_by("name", name)
  end

  def find_by_email(email: String): DynamicModel | nil
    find_by("email", email)
  end

  private

  def find_by(attribute: String, value: String): DynamicModel | nil
    # データベースクエリ
  end
end
```

または柔軟な型付けのためにジェネリクスを使用：

```trb
class DynamicModel
  def find_by<T>(attribute: String, value: T): DynamicModel | nil
    # データベースクエリ
  end
end
```

## 難しいコードの処理

### Nil処理

Rubyコードは暗黙的にnilを使用することが多い：

**以前**：
```ruby
def find_user(id)
  users.find { |u| u.id == id }
end

user = find_user(123)
user.name  # nilならクラッシュ！
```

**以後**：
```trb
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end

user = find_user(123)
if user
  user.name  # 安全 - nilチェック済み
end

# またはセーフナビゲーションを使用
user&.name
```

### 複雑なHash

**以前**：
```ruby
config = {
  database: {
    host: "localhost",
    port: 5432,
    credentials: {
      username: "admin",
      password: "secret"
    }
  }
}
```

**以後** - 構造化されたクラスを使用：

```trb
class Credentials
  @username: String
  @password: String

  def initialize(username: String, password: String): void
    @username = username
    @password = password
  end
end

class DatabaseConfig
  @host: String
  @port: Integer
  @credentials: Credentials

  def initialize(
    host: String,
    port: Integer,
    credentials: Credentials
  ): void
    @host = host
    @port = port
    @credentials = credentials
  end
end

class Config
  @database: DatabaseConfig

  def initialize(database: DatabaseConfig): void
    @database = database
  end
end

# 使用
config = Config.new(
  DatabaseConfig.new(
    "localhost",
    5432,
    Credentials.new("admin", "secret")
  )
)
```

### ダックタイピング

**以前**：
```ruby
def format(object)
  if object.respond_to?(:to_s)
    object.to_s
  else
    object.inspect
  end
end
```

**以後** - インターフェースを使用：

```trb
interface Stringable
  def to_s: String
end

def format<T>(object: T): String
  if object.is_a?(Stringable)
    object.to_s
  else
    object.inspect
  end
end
```

### メタプログラミング

一部のメタプログラミングは簡単に型付けできません。オプション：

1. 明示的なコードに**リファクタリング**
2. 動的な部分に**Any**型を使用
3. **.rb**ファイルとして保持（移行しない）

**以前**：
```ruby
class DynamicClass
  [:foo, :bar, :baz].each do |method_name|
    define_method(method_name) do |arg|
      instance_variable_set("@#{method_name}", arg)
    end
  end
end
```

**以後** - 明示的メソッド：

```trb
class DynamicClass
  @foo: Any
  @bar: Any
  @baz: Any

  def foo(arg: Any): void
    @foo = arg
  end

  def bar(arg: Any): void
    @bar = arg
  end

  def baz(arg: Any): void
    @baz = arg
  end
end
```

## 移行用の設定

### Permissiveモード

移行中はpermissiveモードで開始：

```yaml title="trbconfig.yml"
compiler:
  strictness: permissive

  checks:
    no_implicit_any: false
    strict_nil: false
    no_unused_vars: false
```

これにより以下が許可されます：
- 型なしパラメータ
- 暗黙の`any`型
- 欠落した戻り値型

### 段階的な厳格化

より多くの型を追加したら厳格さを増加：

```yaml title="trbconfig.yml"
compiler:
  strictness: standard  # permissiveから移行

  checks:
    no_implicit_any: true  # 段階的に有効化
    strict_nil: true
    no_unused_vars: false  # 後で有効化
```

### 最終的なStrictモード

完全に移行したら：

```yaml title="trbconfig.yml"
compiler:
  strictness: strict

  checks:
    no_implicit_any: true
    strict_nil: true
    no_unused_vars: true
    no_unchecked_indexed_access: true
```

## 混合コードベース

RubyとT-Rubyファイルを混在させることができます：

```
app/
├── models/
│   ├── user.trb          # 移行済み
│   ├── post.trb          # 移行済み
│   └── comment.rb        # まだRuby
├── services/
│   ├── auth.trb          # 移行済み
│   └── email.rb          # まだRuby
└── controllers/
    └── users_controller.rb  # まだRuby
```

T-Rubyが`.trb`ファイルのみをコンパイルするように設定：

```yaml title="trbconfig.yml"
source:
  include:
    - app/models
    - app/services

  extensions:
    - .trb  # .trbファイルのみコンパイル
```

生成されたRubyファイルは既存のRubyと一緒に動作：

```
app/
├── models/
│   ├── user.rb           # user.trbからコンパイル
│   ├── post.rb           # post.trbからコンパイル
│   └── comment.rb        # オリジナルのRuby
```

## 移行中のテスト

### 両方のバージョンをテスト

テストはRubyで保持し、コンパイルされたコードに対して実行：

```
test/
├── user_test.rb
├── post_test.rb
└── comment_test.rb

# テストはbuild/に対して実行
ruby -Itest -Ibuild test/user_test.rb
```

### テスト前に型チェック

```bash
# まず型チェック
trc check src/

# 通過したらコンパイルしてテスト
trc compile src/
bundle exec rake test
```

### CI設定

```yaml title=".github/workflows/ci.yml"
- name: Type Check T-Ruby
  run: trc check src/

- name: Compile T-Ruby
  run: trc compile src/

- name: Run Tests
  run: bundle exec rake test

- name: Check with Steep (optional)
  run: steep check
```

## 移行チェックリスト

### フェーズ1：セットアップ
- [ ] T-Rubyをインストール
- [ ] `trbconfig.yml`設定を作成
- [ ] ウォッチモードをセットアップ
- [ ] 型チェック用にCIを設定

### フェーズ2：初期移行
- [ ] 開始ファイルを特定（データモデル、ユーティリティ）
- [ ] `.rb`を`.trb`にリネーム
- [ ] 基本的な型アノテーションを追加
- [ ] コンパイルしてエラーを修正
- [ ] テストを実行

### フェーズ3：拡張
- [ ] 関連ファイルを移行
- [ ] より厳格な型チェックを追加
- [ ] RBSファイルを生成
- [ ] Steepをセットアップ（オプション）
- [ ] Ruby LSPを設定

### フェーズ4：完了
- [ ] 残りのファイルを移行
- [ ] strictモードを有効化
- [ ] 型規約をドキュメント化
- [ ] チームにT-Rubyを教育

## 成功する移行のためのヒント

### 1. 小さく始める

すべてを一度に移行しようとしないでください。以下から開始：
- 1つのファイル
- 1つのモジュール
- 1つの機能

### 2. 価値に焦点を当てる

型が最も価値を提供するコードを移行：
- パブリックAPI
- 複雑なビジネスロジック
- データモデル
- 頻繁に変更されるコード

### 3. 型エイリアスを使用

複雑な型を読みやすく：

```trb
type UserId = Integer
type UserAttributes = Hash<String, String | Integer | Bool>
type UserList = Array<User>
```

### 4. パターンをドキュメント化

チーム用のスタイルガイドを作成：

```markdown
# T-Rubyスタイルガイド

## 命名
- 型にはPascalCaseを使用：`UserId`, `UserData`
- パブリックメソッドには明示的な型を使用
- privateメソッドは型を省略可能

## パターン
- hashより構造化されたクラスを優先
- 暗黙のnilではなく`String | nil`を使用
- すべてのパブリックメソッドに戻り値型を追加
```

### 5. ツールを活用

- **ウォッチモード** - 保存時に自動コンパイル
- **Ruby LSP** - IDEサポート
- **Steep** - 追加検証

### 6. 実用的に

すべてに完全な型が必要なわけではありません：
- 真に動的なコードには`Any`を使用
- メタプログラミングは`.rb`ファイルで保持
- パブリックインターフェースに焦点を当てる

## ロールバック戦略

移行がうまくいかない場合：

### オリジナルファイルを保持

```bash
# リネーム前
cp user.rb user.rb.bak

# 問題があれば復元
mv user.rb.bak user.rb
```

### Gitブランチを使用

```bash
git checkout -b migrate-user-model
# 変更を行う
# うまくいけば：
git checkout main
git merge migrate-user-model
# そうでなければ：
git checkout main
git branch -D migrate-user-model
```

### 段階的なコミット

各ファイルの移行を個別にコミット：

```bash
git add user.trb
git commit -m "Migrate User model to T-Ruby"

# 問題が発生したら簡単にリバート：
git revert HEAD
```

## 実世界の例

シンプルなRailsモデルの完全な移行：

**以前**（`app/models/article.rb`）：

```ruby
class Article < ApplicationRecord
  belongs_to :user
  has_many :comments

  validates :title, :content, presence: true

  def published?
    published_at.present?
  end

  def publish!
    update!(published_at: Time.now)
  end

  def preview(length = 100)
    content[0...length] + "..."
  end

  def self.recent(limit = 10)
    order(created_at: :desc).limit(limit)
  end
end
```

**以後**（`app/models/article.trb`）：

```trb
class Article < ApplicationRecord
  @id: Integer
  @title: String
  @content: String
  @published_at: Time | nil
  @user_id: Integer
  @created_at: Time
  @updated_at: Time

  belongs_to :user
  has_many :comments

  validates :title, :content, presence: true

  def published?: Bool
    !@published_at.nil?
  end

  def publish!: void
    update!(published_at: Time.now)
  end

  def preview(length: Integer = 100): String
    @content[0...length] + "..."
  end

  def self.recent(limit: Integer = 10): Array<Article>
    order(created_at: :desc).limit(limit)
  end
end
```

## 次のステップ

移行後：

1. **より厳格なチェックを有効化** - 段階的に型安全性を増加
2. **Steepをセットアップ** - 追加の型検証
3. **Ruby LSPを設定** - より良いIDEサポート
4. **パターンをドキュメント化** - チームガイドラインを作成
5. **移行を継続** - より多くのファイルに拡張

## リソース

- [型アノテーションガイド](/docs/learn/basics/type-annotations)
- [設定リファレンス](/docs/cli/configuration)
- [RBS統合](/docs/tooling/rbs-integration)
- [Steepの使用](/docs/tooling/steep)
