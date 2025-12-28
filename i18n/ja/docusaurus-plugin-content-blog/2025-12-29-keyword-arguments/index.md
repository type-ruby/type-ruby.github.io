---
slug: keyword-arguments-type-definitions
title: "T-Rubyでキーワード引数を扱う"
authors: [yhk1038]
tags: [tutorial, syntax, keyword-arguments]
---

T-Rubyを初めて公開したとき、最も多く寄せられた質問の一つが **「キーワード引数はどう定義しますか？」** でした。これが[Issue #19](https://github.com/aspect-build/t-ruby/issues/19)であり、言語にとって最も重要な設計決定の一つとなりました。

<!-- truncate -->

## 問題点：構文の衝突

T-Rubyでは、型アノテーションにコロン構文を使用します：`name: Type`。しかし、Rubyのキーワード引数もコロンを使用します：`name: value`。これが根本的な衝突を引き起こします。

このT-Rubyコードを見てください：

```ruby
def foo(x: String, y: Integer = 10)
```

`x`はキーワード引数ですか、それとも型アノテーション付きの位置引数ですか？初期のT-Rubyでは、常に**位置引数**として扱われていました - `foo("hi", 20)`として呼び出していました。

しかし、`foo(x: "hi", y: 20)`のように呼び出す実際のキーワード引数が必要な場合はどうすればよいでしょうか？

## 解決策：シンプルなルール

T-Rubyは一つのエレガントなルールでこの問題を解決します：**変数名の有無が意味を決定します**。

| 構文 | 意味 | コンパイル結果 |
|------|------|----------------|
| `{ name: String }` | キーワード引数（分割代入） | `def foo(name:)` |
| `config: { host: String }` | Hashリテラルパラメータ | `def foo(config)` |
| `**opts: Type` | 転送用ダブルスプラット | `def foo(**opts)` |

各パターンを見ていきましょう。

## パターン1：`{ }`を使用したキーワード引数

**変数名なしで**中括弧を使用すると、T-Rubyはこれをキーワード引数の分割代入として扱います：

```ruby
# T-Ruby
def greet({ name: String, prefix: String = "Hello" }): String
  "#{prefix}, #{name}!"
end

# 呼び出し方法
greet(name: "Alice")
greet(name: "Bob", prefix: "Hi")
```

これは以下のようにコンパイルされます：

```ruby
# Ruby
def greet(name:, prefix: "Hello")
  "#{prefix}, #{name}!"
end
```

そして以下のRBSシグネチャを生成します：

```rbs
def greet: (name: String, ?prefix: String) -> String
```

### 重要なポイント

- キーワード引数を`{ }`で囲みます
- 各引数に型を指定します：`name: String`
- デフォルト値は自然に動作します：`prefix: String = "Hello"`
- RBSの`?`はオプショナルパラメータを示します

## パターン2：変数名付きHashリテラル

中括弧の前に変数名を追加すると、T-RubyはこれをHashパラメータとして扱います：

```ruby
# T-Ruby
def process(config: { host: String, port: Integer }): String
  "#{config[:host]}:#{config[:port]}"
end

# 呼び出し方法
process(config: { host: "localhost", port: 8080 })
```

これは以下のようにコンパイルされます：

```ruby
# Ruby
def process(config)
  "#{config[:host]}:#{config[:port]}"
end
```

このパターンを使用する場合：
- Hashオブジェクト全体を渡したいとき
- `config[:key]`構文で値にアクセスする必要があるとき
- Hashを保存したり他のメソッドに渡す必要があるとき

## パターン3：`**`を使用したダブルスプラット

任意のキーワード引数を収集したり、他のメソッドに転送する場合：

```ruby
# T-Ruby
def with_transaction(**config: DbConfig): String
  conn = connect_db(**config)
  "BEGIN; #{conn}; COMMIT;"
end
```

これは以下のようにコンパイルされます：

```ruby
# Ruby
def with_transaction(**config)
  conn = connect_db(**config)
  "BEGIN; #{conn}; COMMIT;"
end
```

`**`が維持される理由は、Rubyで`opts: Type`が`def foo(opts:)`にコンパイルされるためです（`opts`という名前の単一キーワード引数）。これは`def foo(**opts)`（すべてのキーワード引数を収集）とは異なります。

## 位置引数とキーワード引数の混合

位置引数とキーワード引数を組み合わせることができます：

```ruby
# T-Ruby
def mixed(id: Integer, { name: String, age: Integer = 0 }): String
  "#{id}: #{name} (#{age})"
end

# 呼び出し方法
mixed(1, name: "Alice")
mixed(2, name: "Bob", age: 30)
```

以下のようにコンパイルされます：

```ruby
# Ruby
def mixed(id, name:, age: 0)
  "#{id}: #{name} (#{age})"
end
```

## Interfaceの使用

複雑な設定の場合、interfaceを定義して参照します：

```ruby
# Interfaceの定義
interface ConnectionOptions
  host: String
  port?: Integer
  timeout?: Integer
end

# 分割代入 + interface参照 - フィールド名とデフォルト値を明示
def connect({ host:, port: 8080, timeout: 30 }: ConnectionOptions): String
  "#{host}:#{port}"
end

# 呼び出し方法
connect(host: "localhost")
connect(host: "localhost", port: 3000)

# ダブルスプラット - キーワード引数の転送用
def forward(**opts: ConnectionOptions): String
  connect(**opts)
end
```

interface参照を使用する場合、分割代入パターンでフィールド名を明示的にリストする必要があります。デフォルト値はinterfaceではなく関数定義で指定します。

## 完全な例

複数のパターンを組み合わせた実際の例です：

```ruby
# T-Ruby
class ApiClient
  def initialize({ base_url: String, timeout: Integer = 30 })
    @base_url = base_url
    @timeout = timeout
  end

  def get({ path: String }): String
    "#{@base_url}#{path}"
  end

  def post(path: String, { body: String, headers: Hash = {} }): String
    "POST #{@base_url}#{path}"
  end
end

# 使用法
client = ApiClient.new(base_url: "https://api.example.com")
client.get(path: "/users")
client.post("/users", body: "{}", headers: { "Content-Type" => "application/json" })
```

これは以下のようにコンパイルされます：

```ruby
# Ruby
class ApiClient
  def initialize(base_url:, timeout: 30)
    @base_url = base_url
    @timeout = timeout
  end

  def get(path:)
    "#{@base_url}#{path}"
  end

  def post(path, body:, headers: {})
    "POST #{@base_url}#{path}"
  end
end
```

## クイックリファレンス

| 必要なもの | T-Ruby構文 | Ruby出力 |
|------------|------------|----------|
| 必須キーワード引数 | `{ name: String }` | `name:` |
| オプショナルキーワード引数 | `{ name: String = "default" }` | `name: "default"` |
| 複数のキーワード引数 | `{ a: String, b: Integer }` | `a:, b:` |
| Hashパラメータ | `opts: { a: String }` | `opts` |
| ダブルスプラット | `**opts: Type` | `**opts` |
| 混合 | `id: Integer, { name: String }` | `id, name:` |

## 設計の歴史

T-Rubyを初めて発表したとき、初期の構文はキーワード引数に`**{}`を使用していました：

```ruby
# 初期設計（却下）
def greet(**{ name: String, prefix: String = "Hello" }): String
```

コミュニティからのフィードバックで、これが複雑すぎるという意見がありました。いくつかの代替案を検討しました：

| 代替案 | 例 | 結果 |
|--------|-----|------|
| セミコロン | `; name: String` | 却下（可読性がさらに悪い） |
| ダブルコロン | `name:: String` | 却下（`::`がRuby定数と衝突） |
| `named`キーワード | `named name: String` | 検討 |
| **中括弧のみ** | `{ name: String }` | **採用** |

最終的な設計はシンプルなルールを使用します：変数名の有無が意味を決定します。これにより、新しいキーワードなしでクリーンで直感的な構文が実現できます。

## まとめ

T-Rubyのキーワード引数構文は直感的に設計されています：

1. **`{ }`で囲む** - キーワード引数用
2. **変数名を追加** - Hashパラメータ用
3. **`**`を使用** - ダブルスプラット転送用

このシンプルなルールが型アノテーションとRubyキーワード構文間の混乱を解消し、TypeScriptスタイルの型安全性とRubyの表現力豊かなキーワード引数の両方の利点を提供します。

---

*キーワード引数サポートはT-Ruby v0.0.41以降で利用可能です。ぜひお試しいただき、ご意見をお聞かせください！*
