---
sidebar_position: 2
title: オプショナル & 残余パラメータ
description: オプショナルパラメータと残余引数
---

<DocsBadge />


# オプショナル & 残余パラメータ

Ruby関数は、パラメータリストに柔軟性が必要になることがよくあります。T-Rubyは、完全な型安全性を維持しながら、オプショナルパラメータ（デフォルト値付き）と残余パラメータ（可変長引数リスト）の両方をサポートします。

## デフォルト値付きオプショナルパラメータ

オプショナルパラメータは、引数が提供されない場合に使用されるデフォルト値を持ちます：

```trb title="optional.trb"
def greet(name: String, greeting: String = "Hello"): String
  "#{greeting}, #{name}!"
end

def create_user(name: String, role: String = "user", active: Boolean = true): User
  User.new(name: name, role: role, active: active)
end

# 異なる数の引数で呼び出し
puts greet("Alice")                    # "Hello, Alice!"
puts greet("Bob", "Hi")                # "Hi, Bob!"

user1 = create_user("Alice")                           # デフォルト使用: role="user", active=true
user2 = create_user("Bob", "admin")                    # デフォルト使用: active=true
user3 = create_user("Charlie", "moderator", false)     # デフォルト使用なし
```

型アノテーションは、パラメータが提供されても、デフォルト値を使用しても適用されます。

## Nilable型のオプショナルパラメータ

「提供されていない」と「明示的にnil」を区別したい場合があります。nilable型を使用します：

```trb title="nilable_optional.trb"
def format_title(text: String, prefix: String? = nil): String
  if prefix
    "#{prefix}: #{text}"
  else
    text
  end
end

def send_email(to: String, subject: String, cc: String? = nil): void
  email = Email.new(to: to, subject: subject)
  email.cc = cc if cc
  email.send
end

# nilableオプショナルパラメータの使用
title1 = format_title("Introduction")              # "Introduction"
title2 = format_title("Chapter 1", "Book")        # "Book: Chapter 1"
title3 = format_title("Epilogue", nil)            # "Epilogue"

send_email("alice@example.com", "Hello")
send_email("bob@example.com", "Meeting", "team@example.com")
```

## 残余パラメータ

残余パラメータは複数の引数を配列に収集します。配列の要素型を指定します：

```trb title="rest.trb"
def sum(*numbers: Integer[]): Integer
  numbers.reduce(0, :+)
end

def concat_strings(*strings: String[]): String
  strings.join(" ")
end

def log_messages(level: String, *messages: String[]): void
  messages.each do |msg|
    puts "[#{level}] #{msg}"
  end
end

# 可変引数で呼び出し
puts sum(1, 2, 3, 4, 5)                    # 15
puts sum(10)                                # 10
puts sum()                                  # 0

result = concat_strings("Hello", "world", "from", "T-Ruby")
# "Hello world from T-Ruby"

log_messages("INFO", "App started", "Database connected", "Ready")
# [INFO] App started
# [INFO] Database connected
# [INFO] Ready
```

型アノテーション `*numbers: Integer[]` は「配列に収集される0個以上のInteger引数」を意味します。

## オプショナルパラメータと残余パラメータの組み合わせ

オプショナルパラメータと残余パラメータを組み合わせることができますが、残余パラメータはオプショナルパラメータの後に来る必要があります：

```trb title="combined.trb"
def create_team(
  name: String,
  leader: String,
  active: Boolean = true,
  *members: String[]
): Team
  Team.new(
    name: name,
    leader: leader,
    active: active,
    members: members
  )
end

# 様々な呼び出し方法
team1 = create_team("Alpha", "Alice")
# name="Alpha", leader="Alice", active=true, members=[]

team2 = create_team("Beta", "Bob", false)
# name="Beta", leader="Bob", active=false, members=[]

team3 = create_team("Gamma", "Charlie", true, "Dave", "Eve", "Frank")
# name="Gamma", leader="Charlie", active=true, members=["Dave", "Eve", "Frank"]
```

## キーワード引数

T-Rubyでは、キーワード引数は `{ }` 構文（変数名なし）を使用して定義します。位置引数とは異なり、呼び出し時に名前で引数を渡します。

:::info 位置引数 vs キーワード引数

| 定義 | 呼び出し方法 |
|------|-------------|
| `(x: String, y: Integer)` | `foo("hi", 10)` - 位置引数 |
| `({ x: String, y: Integer })` | `foo(x: "hi", y: 10)` - キーワード引数 |
| `(config: { x: String })` | `foo(config: { x: "hi" })` - Hashリテラル |

**重要なルール**: 変数名の有無で意味が決まります：
- `{ ... }` (変数名なし) → キーワード引数（分割代入）
- `name: { ... }` (変数名あり) → Hashリテラル

:::

### インライン型方式

型を `{ }` 内に直接定義します。デフォルト値は `= value` 形式で指定します：

```trb title="keyword_inline.trb"
def create_post({
  title: String,
  content: String,
  published: Boolean = false,
  tags: String[] = []
}): Post
  Post.new(
    title: title,
    content: content,
    published: published,
    tags: tags
  )
end

# キーワード引数で呼び出し（順序は関係なし）
post1 = create_post(
  title: "My First Post",
  content: "Hello world"
)

post2 = create_post(
  content: "Another post",
  title: "Second Post",
  published: true,
  tags: ["ruby", "programming"]
)
```

### Interface参照方式

別途interfaceを定義して参照します。デフォルト値はRubyスタイル `: value`（等号なし）で指定します：

```trb title="keyword_interface.trb"
interface PostOptions
  title: String
  content: String
  published?: Boolean    # ? でoptionalを表示
  tags?: String[]
end

def create_post({ title:, content:, published: false, tags: [] }: PostOptions): Post
  Post.new(
    title: title,
    content: content,
    published: published,
    tags: tags
  )
end

# 呼び出し方法は同じ
post = create_post(title: "Hello", content: "World")
```

:::tip インライン vs Interface の選択基準

| 項目 | インライン型 | interface参照 |
|------|------------|---------------|
| 型定義の場所 | `{ }` 内に直接 | 別途interface |
| デフォルト値構文 | `= value` | `: value`（等号なし） |
| Optional表示 | デフォルト値で暗示 | `?` 接尾辞 |
| 再利用性 | 単一メソッド | 複数メソッドで共有 |

**推奨**: 単一メソッドでのみ使用するならインライン、複数箇所で再利用するならinterface
:::

## キーワード残余パラメータ

ダブルスプラット `**` を使用してキーワード引数をハッシュに収集します：

```trb title="keyword_rest.trb"
def build_query(table: String, **conditions: Hash<Symbol, String | Integer>): String
  where_clause = conditions.map { |k, v| "#{k} = #{v}" }.join(" AND ")
  "SELECT * FROM #{table} WHERE #{where_clause}"
end

def create_config(env: String, **options: Hash<Symbol, String | Integer | Boolean>): Config
  Config.new(environment: env, options: options)
end

# キーワード残余パラメータの使用
query1 = build_query("users", id: 123, active: 1)
# "SELECT * FROM users WHERE id = 123 AND active = 1"

query2 = build_query("posts", author_id: 5, published: 1, category: "tech")
# "SELECT * FROM posts WHERE author_id = 5 AND published = 1 AND category = tech"

config = create_config(
  "production",
  debug: false,
  timeout: 30,
  host: "example.com"
)
```

型アノテーション `**conditions: Hash<Symbol, String | Integer>` は「ハッシュに収集されるStringまたはInteger値を持つ0個以上のキーワード引数」を意味します。

## 必須キーワード引数

デフォルト値のないキーワード引数は必須です：

```trb title="required_kwargs.trb"
def register_user({
  email: String,
  password: String,
  name: String = "Anonymous",
  age: Integer
}): User
  # email、password、ageは必須
  # nameはデフォルト値付きのオプショナル
  User.new(email: email, password: password, name: name, age: age)
end

# email、password、ageは必ず提供する必要がある
user = register_user(
  email: "alice@example.com",
  password: "secret123",
  age: 25
)

# nameはオプションで上書き可能
user2 = register_user(
  email: "bob@example.com",
  password: "secret456",
  name: "Bob",
  age: 30
)
```

## 位置、オプショナル、残余パラメータの混合

すべてのパラメータタイプを組み合わせることができますが、次の順序に従う必要があります：
1. 必須位置パラメータ
2. オプショナル位置パラメータ
3. 残余パラメータ (`*args`)
4. キーワード引数 (`{ ... }`)
5. キーワード残余パラメータ (`**kwargs`)

```trb title="all_types.trb"
def complex_function(
  required_pos: String,                    # 1. 必須位置
  optional_pos: Integer = 0,               # 2. オプショナル位置
  *rest_args: String[],               # 3. 残余パラメータ
  {
    required_kw: Boolean,                  # 4. 必須キーワード
    optional_kw: String = "default"        # 5. オプショナルキーワード
  },
  **rest_kwargs: Hash<Symbol, String | Integer>  # 6. キーワード残余
): Hash<String, String | Integer | Boolean>
  {
    "required_pos" => required_pos,
    "optional_pos" => optional_pos,
    "rest_args" => rest_args.join(","),
    "required_kw" => required_kw,
    "optional_kw" => optional_kw,
    "rest_kwargs" => rest_kwargs
  }
end

# 呼び出し例
result = complex_function(
  "hello",                    # required_pos
  42,                         # optional_pos
  "a", "b", "c",             # rest_args
  required_kw: true,          # required_kw
  optional_kw: "custom",      # optional_kw
  extra1: "value1",           # rest_kwargs
  extra2: 123                 # rest_kwargs
)
```

## 実践例: HTTPリクエストビルダー

様々なパラメータタイプを示す実際の例です：

```trb title="http_builder.trb"
class HTTPRequestBuilder
  # 必須パラメータのみ
  def get(url: String): Response
    make_request("GET", url, nil, {})
  end

  # 必須 + オプショナルパラメータ
  def post(url: String, body: String, content_type: String = "application/json"): Response
    headers = { "Content-Type" => content_type }
    make_request("POST", url, body, headers)
  end

  # 必須 + 残余パラメータ
  def delete(*urls: String[]): Response[]
    urls.map { |url| make_request("DELETE", url, nil, {}) }
  end

  # キーワード引数（インライン型）
  def request({
    method: String,
    url: String,
    body: String? = nil,
    timeout: Integer = 30,
    retry_count: Integer = 3
  }): Response
    make_request(method, url, body, {}, timeout, retry_count)
  end

  # キーワード残余パラメータ
  def custom_request(
    method: String,
    url: String,
    **headers: Hash<Symbol, String>
  ): Response
    make_request(method, url, nil, headers)
  end

  private

  def make_request(
    method: String,
    url: String,
    body: String?,
    headers: Hash<String, String>,
    timeout: Integer = 30,
    retry_count: Integer = 3
  ): Response
    # 実装の詳細...
    Response.new
  end
end

# ビルダーの使用
builder = HTTPRequestBuilder.new

# シンプルなGET
response1 = builder.get("https://api.example.com/users")

# カスタムcontent typeでPOST
response2 = builder.post(
  "https://api.example.com/users",
  '{"name": "Alice"}',
  "application/json"
)

# 複数リソースをDELETE
responses = builder.delete(
  "https://api.example.com/users/1",
  "https://api.example.com/users/2",
  "https://api.example.com/users/3"
)

# カスタムオプションでリクエスト
response3 = builder.request(
  method: "PATCH",
  url: "https://api.example.com/users/1",
  body: '{"age": 31}',
  timeout: 60,
  retry_count: 5
)

# カスタムヘッダーでリクエスト
response4 = builder.custom_request(
  method: "GET",
  url: "https://api.example.com/protected",
  Authorization: "Bearer token123",
  Accept: "application/json",
  User_Agent: "MyApp/1.0"
)
```

## 実践例: ロガー

柔軟なパラメータ処理を示す別の例です：

```trb title="logger.trb"
class Logger
  # オプショナルレベル付きのシンプルなメッセージ
  def log(message: String, level: String = "INFO"): void
    puts "[#{level}] #{message}"
  end

  # 残余パラメータで複数メッセージ
  def log_many(level: String, *messages: String[]): void
    messages.each { |msg| log(msg, level) }
  end

  # キーワード残余で構造化ロギング
  def log_structured(message: String, **metadata: Hash<Symbol, String | Integer | Boolean>): void
    meta_str = metadata.map { |k, v| "#{k}=#{v}" }.join(" ")
    puts "[INFO] #{message} | #{meta_str}"
  end

  # 柔軟なデバッグロギング
  def debug(*messages: String[], **context: Hash<Symbol, String | Integer>): void
    messages.each do |msg|
      ctx_str = context.empty? ? "" : " (#{context.map { |k, v| "#{k}=#{v}" }.join(", ")})"
      puts "[DEBUG] #{msg}#{ctx_str}"
    end
  end
end

# ロガーの使用
logger = Logger.new

# シンプルなロギング
logger.log("Application started")
logger.log("Warning: Low memory", "WARN")

# 複数メッセージ
logger.log_many("ERROR", "Database connection failed", "Retrying...", "Giving up")

# 構造化ロギング
logger.log_structured(
  "User logged in",
  user_id: 123,
  ip: "192.168.1.1",
  success: true
)

# コンテキスト付きデバッグ
logger.debug(
  "Processing request",
  "Validating data",
  "Saving to database",
  request_id: 789,
  user_id: 123
)
```

## ベストプラクティス

1. **真にオプショナルな動作にデフォルト値を使用する**: パラメータがオプショナルであることが意味を持つ場合にのみデフォルト値を追加します。

2. **パラメータを論理的に順序付ける**: 必須パラメータを最初に、次にオプショナル、最後に残余パラメータを配置します。

3. **明確性のためにキーワード引数を優先する**: 複数のオプショナルパラメータがある場合、キーワード引数は呼び出しをより読みやすくします。

4. **コレクションには残余パラメータを使用する**: 可変数の類似アイテムを期待する場合、残余パラメータは配列パラメータよりもクリーンです。

5. **残余パラメータに適切な型を付ける**: 文字列のみを期待する場合、`*args: (String | Integer)[]`より`*args: String[]`の方が良いです。

6. **複雑なシグネチャを文書化する**: 多くのパラメータタイプを組み合わせる場合、使用法を説明するコメントを追加します。

## 一般的なパターン

### デフォルト付きビルダーメソッド（キーワード引数）

```trb title="builder_pattern.trb"
def build_email({
  to: String,
  subject: String,
  from: String = "noreply@example.com",
  reply_to: String? = nil,
  cc: String[] = [],
  bcc: String[] = []
}): Email
  Email.new(to, subject, from, reply_to, cc, bcc)
end

# キーワード引数で呼び出し
email = build_email(to: "alice@example.com", subject: "Hello")
```

### 可変ファクトリ関数（残余 + キーワード引数）

```trb title="factory.trb"
def create_users(*names: String[], { role: String = "user" }): User[]
  names.map { |name| User.new(name: name, role: role) }
end

users = create_users("Alice", "Bob", "Charlie", role: "admin")
```

### 設定のマージ

```trb title="config.trb"
def merge_config(base: Hash<String, String>, **overrides: Hash<Symbol, String>): Hash<String, String>
  base.merge(overrides)
end

config = merge_config(
  { "host" => "localhost", "port" => "3000" },
  port: "8080",
  ssl: "true"
)
```

## まとめ

オプショナルパラメータと残余パラメータは、型安全性を維持しながら関数に柔軟性を提供します：

| 文法 | 説明 | 呼び出し例 |
|------|------|----------|
| `(x: Type)` | 位置引数 | `foo("hi")` |
| `(x: Type = default)` | オプショナル位置引数 | `foo()` または `foo("hi")` |
| `(*args: Type[])` | 残余パラメータ | `foo("a", "b", "c")` |
| `({ x: Type })` | キーワード引数 | `foo(x: "hi")` |
| `(config: { x: Type })` | Hashリテラル | `foo(config: { x: "hi" })` |
| `(**kwargs: Hash<Symbol, Type>)` | キーワード残余 | `foo(a: 1, b: 2)` |

**重要なポイント：**
- **位置引数** `(x: Type)`: 順序で渡す
- **キーワード引数** `({ x: Type })`: 名前で渡す（変数名なし = 分割代入）
- **Hashリテラル** `(config: { x: Type })`: 変数名あり = Hash
- **キーワード残余** `(**kwargs: Hash<Symbol, Type>)`: 任意のキーワード引数をハッシュに収集
- T-Rubyはすべてのパラメータのバリエーションに対して型安全性を保証します

これらのパターンをマスターして、使いやすい柔軟で型安全なAPIを作成しましょう。
