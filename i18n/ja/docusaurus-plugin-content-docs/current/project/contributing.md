---
sidebar_position: 2
title: コントリビューション
description: T-Rubyへの貢献方法
---

<DocsBadge />


# T-Rubyへのコントリビューション

T-Rubyへの貢献に関心をお持ちいただきありがとうございます！このガイドは、コード、ドキュメント、型などへの貢献を始めるのに役立ちます。

## 行動規範

T-Rubyは、すべてのコントリビューターに歓迎的で包括的な環境を提供することに取り組んでいます。すべての参加者には以下を期待します：

- 敬意を持ち思いやりを持つ
- 新規参加者を歓迎し、学習を支援する
- コミュニティにとって最善のことに焦点を当てる
- 他のコミュニティメンバーへの共感を示す

受け入れられない行動は許容されません。懸念事項があれば、プロジェクトメンテナーに報告してください。

## 貢献方法

T-Rubyに貢献する方法は多くあります：

### 1. バグの報告

バグを見つけましたか？GitHubで以下の内容でissueを開いてください：

- **明確なタイトル** - issueの説明的な要約
- **T-Rubyバージョン** - `trc --version`を実行
- **Rubyバージョン** - `ruby --version`を実行
- **再現手順** - 最小限のコード例
- **期待される動作** - どうなるべきか
- **実際の動作** - 実際にどうなるか
- **エラーメッセージ** - 該当する場合、完全なエラー出力

**例：**
```markdown
## バグ：配列mapの型推論が失敗する

**T-Rubyバージョン：** v0.1.0
**Rubyバージョン：** 3.2.0

### 再現手順
```trb
numbers: Array<Integer> = [1, 2, 3]
strings = numbers.map { |n| n.to_s }
# stringsの型はArray<String>であるべき
```

### 期待
`strings`は`Array<String>`と推論されるべき

### 実際
型が`Array<Any>`と推論される
```

### 2. 機能の提案

T-Rubyについてのアイデアがありますか？以下の内容で機能リクエストを開いてください：

- **ユースケース** - なぜこの機能が必要ですか？
- **提案する構文** - どのように動作すべきですか？
- **例** - 使用法を示すコード例
- **代替案** - 問題を解決する他の方法
- **TypeScriptとの比較** - TypeScriptはこれをどう処理しますか？

### 3. ドキュメントの改善

ドキュメントへの貢献は非常に価値があります：

- タイポと文法の修正
- コード例の追加
- 説明の改善
- チュートリアルとガイドの作成
- ドキュメントの翻訳
- ダイアグラムと視覚資料の追加

### 4. 標準ライブラリの型追加

T-Rubyのstdlibカバレッジの拡大を手伝ってください：

- Rubyコアクラスの型シグネチャを追加
- 人気のあるgem（Rails、Sinatra、RSpecなど）の型を定義
- 型定義のテストを書く
- 複雑な型をドキュメント化

### 5. ツールの構築

T-Rubyエコシステム用のツールを作成：

- エディタ拡張（VSCode、Vimなど）
- ビルドシステム統合
- リンターとフォーマッタ
- コードジェネレータ
- マイグレーションツール

### 6. テストの作成

テストカバレッジの改善：

- 既存機能のテストケースを追加
- エッジケースとエラー条件をテスト
- 統合テストを書く
- パフォーマンスベンチマークを追加

### 7. バグの修正

オープンなissueを確認してプルリクエストを提出：

- "good first issue"ラベルを探す
- "help wanted" issueを確認
- バグを再現して修正を提案
- エラーメッセージを改善

## 開発環境のセットアップ

### 前提条件

- **Ruby** 3.0以上
- **Node.js** 16以上（ツール用）
- **Git** バージョン管理

### リポジトリのクローン

```bash
git clone https://github.com/t-ruby/t-ruby.git
cd t-ruby
```

### 依存関係のインストール

```bash
# Ruby依存関係をインストール
bundle install

# Node.js依存関係をインストール（ツール用）
npm install
```

### テストの実行

```bash
# すべてのテストを実行
bundle exec rspec

# 特定のテストファイルを実行
bundle exec rspec spec/compiler/type_checker_spec.rb

# カバレッジ付きで実行
COVERAGE=true bundle exec rspec
```

### コンパイラのビルド

```bash
# 開発バージョンをビルド
rake build

# ローカルにインストール
rake install

# インストールをテスト
trc --version
```

### 型チェッカーの実行

```bash
# ファイルを型チェック
trc --check examples/hello.trb

# ファイルをコンパイル
trc examples/hello.trb

# ウォッチモード
trc --watch examples/**/*.trb
```

## プルリクエストプロセス

### 1. ブランチの作成

```bash
# 機能ブランチを作成
git checkout -b feature/my-awesome-feature

# またはバグ修正ブランチ
git checkout -b fix/issue-123
```

### 2. 変更を行う

- クリーンで読みやすいコードを書く
- コーディングスタイルに従う（下記参照）
- 新機能のテストを追加
- 必要に応じてドキュメントを更新
- コミットを集中的でアトミックに保つ

### 3. 変更をテスト

```bash
# テストを実行
bundle exec rspec

# リンターを実行
bundle exec rubocop

# 例を型チェック
trc --check examples/**/*.trb

# 手動テスト
trc your_test_file.trb
ruby your_test_file.rb
```

### 4. 変更をコミット

明確で説明的なコミットメッセージを書く：

```bash
# 良いコミットメッセージ
git commit -m "Add support for tuple types"
git commit -m "Fix type inference for array.map"
git commit -m "Document generic constraints"

# 悪いコミットメッセージ
git commit -m "Fix bug"
git commit -m "Update code"
git commit -m "WIP"
```

**コミットメッセージ形式：**
```
<type>: <subject>

<body>

<footer>
```

**タイプ：**
- `feat`：新機能
- `fix`：バグ修正
- `docs`：ドキュメント変更
- `style`：コードスタイル変更（フォーマットなど）
- `refactor`：コードリファクタリング
- `test`：テストの追加または更新
- `chore`：ビルドプロセス、依存関係など

**例：**
```
feat: Add support for intersection types

Implement intersection type operator (&) that allows
combining multiple interface types. This enables
creating types that must satisfy multiple contracts.

Closes #123
```

### 5. プッシュしてPRを作成

```bash
# ブランチをプッシュ
git push origin feature/my-awesome-feature

# GitHubでPRを作成
```

### 6. PR要件

プルリクエストは以下を満たす必要があります：

- [ ] 明確で説明的なタイトルがある
- [ ] 関連するissueを参照（例："Fixes #123"）
- [ ] 新機能のテストを含む
- [ ] 必要に応じてドキュメントが更新されている
- [ ] すべてのCIチェックをパス
- [ ] マージコンフリクトがない
- [ ] メンテナーによるレビューが必要

### 7. PRテンプレート

```markdown
## 説明
変更の簡単な説明

## 動機
なぜこれらの変更が必要ですか？

## 変更点
- 具体的な変更のリスト
- 別の変更

## テスト
これらの変更はどのようにテストされましたか？

## スクリーンショット
該当する場合、スクリーンショットを追加

## チェックリスト
- [ ] テストをパス
- [ ] ドキュメントが更新されている
- [ ] スタイルガイドに従っている
- [ ] 破壊的変更なし（またはドキュメント化されている）
```

## コーディングスタイル

### Rubyスタイル

いくつかの修正を加えた[Rubyスタイルガイド](https://rubystyle.guide/)に従います：

```trb
# 良い例
def type_check(node: AST::Node): Type
  case node.type
  when :integer
    IntegerType.new
  when :string
    StringType.new
  else
    AnyType.new
  end
end

# 説明的な変数名を使用
def infer_array_type(elements: Array<AST::Node>): ArrayType
  element_types = elements.map { |el| infer_type(el) }
  union_type = UnionType.new(element_types)
  ArrayType.new(union_type)
end
```

### T-Rubyスタイル（例用）

```trb
# 例では明確で明示的な型を使用
def process_user(user: User): UserResponse
  UserResponse.new(
    id: user.id,
    name: user.name,
    email: user.email
  )
end

# 明確さのための型アノテーションを追加
users: Array<User> = fetch_users()
active_users: Array<User> = users.select { |u| u.active? }
```

### ドキュメントスタイル

```trb
# 良いドキュメント
# 配列リテラルの型を推論します
#
# @param elements [Array<AST::Node>] 配列リテラル要素
# @return [ArrayType] 推論された配列型
# @example
#   infer_array_type([IntNode.new(1), IntNode.new(2)])
#   #=> ArrayType<Integer>
def infer_array_type(elements)
  # ...
end
```

## テストガイドライン

### テストの作成

```trb
RSpec.describe TypeChecker do
  describe '#infer_type' do
    it 'infers Integer for integer literals' do
      node = AST::IntegerNode.new(42)
      type = checker.infer_type(node)

      expect(type).to be_a(IntegerType)
    end

    it 'infers Union type for union syntax' do
      node = AST::UnionNode.new(
        StringType.new,
        IntegerType.new
      )
      type = checker.infer_type(node)

      expect(type).to be_a(UnionType)
      expect(type.types).to include(StringType.new, IntegerType.new)
    end

    context 'with generic types' do
      it 'infers Array<T> from literal' do
        # ...
      end
    end
  end
end
```

### テストの構成

```
spec/
├── compiler/
│   ├── parser_spec.rb
│   ├── type_checker_spec.rb
│   └── code_generator_spec.rb
├── types/
│   ├── union_type_spec.rb
│   ├── generic_type_spec.rb
│   └── intersection_type_spec.rb
└── integration/
    ├── compile_spec.rb
    └── type_check_spec.rb
```

## 標準ライブラリ型の追加

### 1. 型定義ファイルの作成

```trb
# lib/t_ruby/stdlib/json.trb

# JSONモジュールの型定義
module JSON
  def self.parse(source: String): Any
  end

  def self.generate(obj: Any): String
  end

  def self.pretty_generate(obj: Any): String
  end
end
```

### 2. テストの追加

```trb
# spec/stdlib/json_spec.rb

RSpec.describe 'JSON types' do
  it 'type checks JSON.parse' do
    code = <<~RUBY
      require 'json'

      data: String = '{"name": "Alice"}'
      result = JSON.parse(data)
    RUBY

    expect(type_check(code)).to be_valid
  end
end
```

### 3. 型のドキュメント化

`/docs/reference/stdlib-types.md`に追加：

```markdown
### JSON

```trb
def parse_json(file: String): Hash<String, Any>
  JSON.parse(File.read(file))
end
```

**型シグネチャ：**
- `JSON.parse(source: String): Any`
- `JSON.generate(obj: Any): String`
```

## ドキュメント貢献

### ドキュメント構造

```
docs/
├── introduction/         # 始めに
├── getting-started/      # インストールとセットアップ
├── learn/               # チュートリアルとガイド
│   ├── basics/
│   ├── everyday-types/
│   ├── functions/
│   ├── classes/
│   ├── interfaces/
│   ├── generics/
│   └── advanced/
├── reference/           # APIリファレンス
│   ├── cheatsheet.md
│   ├── built-in-types.md
│   ├── type-operators.md
│   └── stdlib-types.md
├── cli/                # CLIドキュメント
├── tooling/            # エディタとツール統合
└── project/            # プロジェクト情報
    ├── roadmap.md
    ├── contributing.md
    └── changelog.md
```

### ドキュメントの作成

1. **明確な例を使用** - 説明だけでなく見せる
2. **「なぜ」を説明** - 「どのように」だけでなく
3. **よくある落とし穴を含める** - ユーザーがミスを避けるのを助ける
4. **関連トピックをリンク** - ユーザーがより多く発見できるように
5. **簡潔に保つ** - 読者の時間を尊重する

## レビュープロセス

### メンテナー向け

PRをレビューする際：

1. **正確性を確認** - 意図した通りに動作するか？
2. **テストをレビュー** - 適切なテストがあるか？
3. **スタイルを確認** - ガイドラインに従っているか？
4. **影響を考慮** - 破壊的変更？パフォーマンス？
5. **フィードバックを提供** - 助けになり建設的に
6. **承認または変更を要求** - 明確な次のステップ

### 応答時間

我々の目標：

- **最初の応答** - 2営業日以内
- **レビューサイクル** - 1週間以内
- **マージ決定** - 2週間以内

## リリースプロセス

### バージョン番号

[セマンティックバージョニング](https://semver.org/)に従います：

- **MAJOR** - 互換性のない変更（v1.0.0 → v2.0.0）
- **MINOR** - 新機能、後方互換（v1.0.0 → v1.1.0）
- **PATCH** - バグ修正（v1.0.0 → v1.0.1）

### リリースチェックリスト

1. `lib/t_ruby/version.rb`でバージョンを更新
2. CHANGELOG.mdを更新
3. 完全なテストスイートを実行
4. gemをビルドしてテスト
5. gitタグを作成
6. GitHubにプッシュ
7. GitHubリリースを作成
8. RubyGemsにgemを公開
9. リリースを発表

## ヘルプを得る

### 質問する場所

- **GitHub Discussions** - 一般的な質問、アイデア
- **GitHub Issues** - バグ報告、機能リクエスト

### 良い質問に含めるもの

- 達成しようとしていること
- これまでに試したこと
- 最小限のコード例
- エラーメッセージ（あれば）
- T-RubyとRubyのバージョン

## 認知

コントリビューターは認知されます：

- **コントリビューターリスト** - READMEとウェブサイトで
- **リリースノート** - changelogで言及
- **特別な感謝** - 重要な貢献に対して

## ライセンス

T-Rubyに貢献することで、あなたの貢献がMITライセンスの下でライセンスされることに同意します。

## リソース

- **GitHubリポジトリ** - https://github.com/type-ruby/t-ruby
- **ドキュメント** - https://type-ruby.github.io
- **スタイルガイド** - https://rubystyle.guide/
- **RSpecガイド** - https://rspec.info/
- **セマンティックバージョニング** - https://semver.org/

## 連絡先

- **GitHub** - https://github.com/type-ruby/t-ruby
- **Discussions** - https://github.com/type-ruby/t-ruby/discussions

---

T-Rubyへの貢献ありがとうございます！皆さんの努力が、すべての人のためにRuby開発をより良くするのに役立ちます。
