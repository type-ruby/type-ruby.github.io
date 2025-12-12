---
sidebar_position: 2
title: インスタンス & クラス変数
description: インスタンス変数とクラス変数の型付け
---

<DocsBadge />


# インスタンス & クラス変数

インスタンス変数とクラス変数は、Rubyのオブジェクト指向プログラミングの基本です。T-Rubyは両方に対して包括的な型安全性を提供し、データ構造が予測可能でエラーのないことを保証します。このガイドでは、インスタンスレベルとクラスレベルの両方で変数に型を付ける方法を説明します。

## インスタンス変数

インスタンス変数は各オブジェクトに固有のデータを格納します。T-Rubyでは、いくつかの方法で型を付けることができます。

### attr_accessor、attr_reader、attr_writerの使用

インスタンス変数に型を付ける最も一般的で推奨される方法です：

```trb title="attr_methods.trb"
class Person
  attr_accessor :name: String
  attr_accessor :age: Integer
  attr_reader :id: Integer
  attr_writer :password: String

  def initialize(id: Integer, name: String, age: Integer)
    @id = id
    @name = name
    @age = age
    @password = ""
  end

  def display_info(): String
    "#{@name}, age #{@age}"
  end
end

# 使用法
person = Person.new(1, "Alice", 30)
person.name = "Alice Smith"  # ✓ OK - attr_accessor
puts person.name             # ✓ OK - attr_accessor
puts person.id               # ✓ OK - attr_reader
# person.id = 2              # ✗ エラー - 読み取り専用
person.password = "secret"   # ✓ OK - attr_writer
# puts person.password       # ✗ エラー - 書き込み専用
```

### 明示的なインスタンス変数宣言

インスタンス変数を初期化するときに型を明示的に宣言できます：

```trb title="explicit_types.trb"
class ShoppingCart
  def initialize()
    @items: Array<String> = []
    @quantities: Hash<String, Integer> = {}
    @total: Float = 0.0
    @discount: Float? = nil
  end

  def add_item(item: String, quantity: Integer): void
    @items.push(item)
    @quantities[item] = quantity
  end

  def set_discount(amount: Float): void
    @discount = amount
  end

  def calculate_total(price_per_item: Float): Float
    base = @items.length * price_per_item
    if @discount
      base - @discount
    else
      base
    end
  end
end
```

### attrメソッドと明示的型の組み合わせ

両方のアプローチを一緒に使用できます：

```trb title="combined.trb"
class Article
  attr_reader :title: String
  attr_accessor :published: Boolean

  def initialize(title: String)
    @title = title
    @published = false
    @views: Integer = 0
    @comments: Array<String> = []
    @author: String? = nil
  end

  def increment_views(): void
    @views += 1
  end

  def add_comment(comment: String): void
    @comments.push(comment)
  end

  def set_author(name: String): void
    @author = name
  end

  def author_name(): String
    @author || "Anonymous"
  end
end
```

## Nilableインスタンス変数

nilになり得るインスタンス変数は `?` 接尾辞を使用します：

```trb title="nilable.trb"
class UserAccount
  attr_accessor :username: String
  attr_accessor :email: String?
  attr_accessor :phone: String?
  attr_reader :last_login: Time?

  def initialize(username: String)
    @username = username
    @email = nil
    @phone = nil
    @last_login = nil
    @verified: Boolean = false
  end

  def verify(): void
    @verified = true
  end

  def is_verified(): Boolean
    @verified
  end

  def update_contact(email: String?, phone: String?): void
    @email = email
    @phone = phone
  end

  def has_contact_info?(): Boolean
    @email != nil || @phone != nil
  end

  def record_login(): void
    @last_login = Time.now
  end

  def days_since_login(): Integer?
    if @last_login
      ((Time.now - @last_login) / 86400).to_i
    else
      nil
    end
  end
end
```

## クラス変数

クラス変数はクラスのすべてのインスタンスで共有されます。`@@` で型を付けます：

```trb title="class_vars.trb"
class Counter
  def initialize()
    @@count: Integer ||= 0
    @@count += 1
  end

  def self.total_count(): Integer
    @@count || 0
  end

  def self.reset_count(): void
    @@count = 0
  end
end

# 使用法
c1 = Counter.new
c2 = Counter.new
c3 = Counter.new
puts Counter.total_count()  # 3
Counter.reset_count()
puts Counter.total_count()  # 0
```

### デフォルト値付きクラス変数

適切なデフォルト値でクラス変数を初期化します：

```trb title="class_var_defaults.trb"
class Configuration
  @@database_url: String = "localhost"
  @@max_connections: Integer = 10
  @@debug_mode: Boolean = false
  @@allowed_hosts: Array<String> = []

  def self.database_url(): String
    @@database_url
  end

  def self.database_url=(url: String): void
    @@database_url = url
  end

  def self.max_connections(): Integer
    @@max_connections
  end

  def self.max_connections=(n: Integer): void
    @@max_connections = n
  end

  def self.enable_debug(): void
    @@debug_mode = true
  end

  def self.debug_enabled?(): Boolean
    @@debug_mode
  end

  def self.add_allowed_host(host: String): void
    @@allowed_hosts.push(host) unless @@allowed_hosts.include?(host)
  end

  def self.allowed_hosts(): Array<String>
    @@allowed_hosts
  end
end

# 使用法
Configuration.database_url = "postgresql://localhost/mydb"
Configuration.max_connections = 50
Configuration.enable_debug()
Configuration.add_allowed_host("example.com")
```

## インスタンス変数 vs クラス変数

それぞれをいつ使用するかを理解する：

```trb title="comparison.trb"
class BankAccount
  # クラス変数 - すべてのインスタンスで共有
  @@total_accounts: Integer = 0
  @@total_balance: Float = 0.0

  # インスタンス変数 - 各インスタンスに固有
  attr_reader :account_number: Integer
  attr_accessor :balance: Float
  attr_accessor :owner: String

  def initialize(account_number: Integer, owner: String, initial_balance: Float)
    @account_number = account_number
    @owner = owner
    @balance = initial_balance

    # クラス変数を更新
    @@total_accounts += 1
    @@total_balance += initial_balance
  end

  def deposit(amount: Float): void
    @balance += amount
    @@total_balance += amount
  end

  def withdraw(amount: Float): Boolean
    if amount <= @balance
      @balance -= amount
      @@total_balance -= amount
      true
    else
      false
    end
  end

  # クラス変数にアクセスするクラスメソッド
  def self.total_accounts(): Integer
    @@total_accounts
  end

  def self.total_balance(): Float
    @@total_balance
  end

  def self.average_balance(): Float
    if @@total_accounts > 0
      @@total_balance / @@total_accounts
    else
      0.0
    end
  end
end

# 使用法
account1 = BankAccount.new(1001, "Alice", 1000.0)
account2 = BankAccount.new(1002, "Bob", 2000.0)

# インスタンス固有のデータ
puts account1.balance  # 1000.0
puts account2.balance  # 2000.0

# クラスレベルのデータ
puts BankAccount.total_accounts()   # 2
puts BankAccount.total_balance()    # 3000.0
puts BankAccount.average_balance()  # 1500.0

account1.deposit(500.0)
puts BankAccount.total_balance()    # 3500.0
```

## 複雑なインスタンス変数の型

インスタンス変数は任意の型を持つことができます：

```trb title="complex_types.trb"
class DataStore
  def initialize()
    @strings: Array<String> = []
    @numbers: Array<Integer> = []
    @mappings: Hash<String, Integer> = {}
    @nested: Hash<String, Array<String>> = {}
    @optional_data: String? = nil
    @union_data: String | Integer | nil = nil
  end

  def add_string(s: String): void
    @strings.push(s)
  end

  def add_number(n: Integer): void
    @numbers.push(n)
  end

  def add_mapping(key: String, value: Integer): void
    @mappings[key] = value
  end

  def add_nested(key: String, values: Array<String>): void
    @nested[key] = values
  end

  def set_optional(data: String?): void
    @optional_data = data
  end

  def set_union(data: String | Integer): void
    @union_data = data
  end

  def get_strings(): Array<String>
    @strings
  end

  def get_mapping(key: String): Integer?
    @mappings[key]
  end
end
```

## 実践例: ユーザーセッション

インスタンス変数とクラス変数を組み合わせた実際の例です：

```trb title="user_session.trb"
class UserSession
  # クラス変数 - すべてのセッションを追跡
  @@active_sessions: Hash<String, UserSession> = {}
  @@session_count: Integer = 0

  # インスタンス変数 - セッション固有のデータ
  attr_reader :session_id: String
  attr_reader :user_id: Integer
  attr_reader :created_at: Time
  attr_accessor :last_activity: Time

  def initialize(session_id: String, user_id: Integer)
    @session_id = session_id
    @user_id = user_id
    @created_at = Time.now
    @last_activity = Time.now
    @data: Hash<String, String | Integer | Boolean> = {}
    @expired: Boolean = false

    # このセッションを登録
    @@active_sessions[session_id] = self
    @@session_count += 1
  end

  def set_data(key: String, value: String | Integer | Boolean): void
    @data[key] = value
    @last_activity = Time.now
  end

  def get_data(key: String): String | Integer | Boolean | nil
    @last_activity = Time.now
    @data[key]
  end

  def expire(): void
    @expired = true
    @@active_sessions.delete(@session_id)
  end

  def is_expired?(): Boolean
    @expired
  end

  def age_in_minutes(): Integer
    ((Time.now - @created_at) / 60).to_i
  end

  def idle_time_in_minutes(): Integer
    ((Time.now - @last_activity) / 60).to_i
  end

  # クラスメソッド
  def self.find(session_id: String): UserSession?
    @@active_sessions[session_id]
  end

  def self.active_session_count(): Integer
    @@active_sessions.length
  end

  def self.total_sessions_created(): Integer
    @@session_count
  end

  def self.expire_old_sessions(max_age_minutes: Integer): Integer
    expired_count = 0
    @@active_sessions.each do |id, session|
      if session.age_in_minutes() > max_age_minutes
        session.expire()
        expired_count += 1
      end
    end
    expired_count
  end

  def self.expire_idle_sessions(max_idle_minutes: Integer): Integer
    expired_count = 0
    @@active_sessions.each do |id, session|
      if session.idle_time_in_minutes() > max_idle_minutes
        session.expire()
        expired_count += 1
      end
    end
    expired_count
  end
end

# 使用法
session1 = UserSession.new("sess_123", 1)
session1.set_data("theme", "dark")
session1.set_data("notifications", true)

session2 = UserSession.new("sess_456", 2)
session2.set_data("language", "en")

puts UserSession.active_session_count()     # 2
puts UserSession.total_sessions_created()   # 2

found = UserSession.find("sess_123")
if found
  puts found.get_data("theme")  # "dark"
end

# 古いセッションを期限切れにする
UserSession.expire_old_sessions(60)  # 60分より古いセッションを期限切れにする
```

## 実践例: キャッシュシステム

クラス変数とインスタンス変数の効果的な使用を示す別の例です：

```trb title="cache_system.trb"
class Cache<T>
  # クラス変数 - 共有統計
  @@total_hits: Integer = 0
  @@total_misses: Integer = 0
  @@total_caches: Integer = 0

  # インスタンス変数 - キャッシュ固有のデータ
  attr_reader :name: String
  attr_reader :max_size: Integer

  def initialize(name: String, max_size: Integer = 100)
    @name = name
    @max_size = max_size
    @data: Hash<String, T> = {}
    @access_times: Hash<String, Time> = {}
    @hits: Integer = 0
    @misses: Integer = 0

    @@total_caches += 1
  end

  def get(key: String): T?
    if @data.key?(key)
      @hits += 1
      @@total_hits += 1
      @access_times[key] = Time.now
      @data[key]
    else
      @misses += 1
      @@total_misses += 1
      nil
    end
  end

  def set(key: String, value: T): void
    # キャッシュがいっぱいの場合、最も古いエントリを削除
    if @data.length >= @max_size && !@data.key?(key)
      evict_oldest()
    end

    @data[key] = value
    @access_times[key] = Time.now
  end

  def delete(key: String): void
    @data.delete(key)
    @access_times.delete(key)
  end

  def clear(): void
    @data.clear()
    @access_times.clear()
  end

  def size(): Integer
    @data.length
  end

  def hit_rate(): Float
    total = @hits + @misses
    total > 0 ? (@hits.to_f / total.to_f) * 100 : 0.0
  end

  def keys(): Array<String>
    @data.keys
  end

  private

  def evict_oldest(): void
    oldest_key = @access_times.min_by { |k, v| v }&.first
    if oldest_key
      delete(oldest_key)
    end
  end

  # グローバル統計用のクラスメソッド
  def self.global_hit_rate(): Float
    total = @@total_hits + @@total_misses
    total > 0 ? (@@total_hits.to_f / total.to_f) * 100 : 0.0
  end

  def self.total_hits(): Integer
    @@total_hits
  end

  def self.total_misses(): Integer
    @@total_misses
  end

  def self.total_caches(): Integer
    @@total_caches
  end

  def self.reset_statistics(): void
    @@total_hits = 0
    @@total_misses = 0
  end
end

# 使用法
user_cache = Cache<User>.new("users", 50)
product_cache = Cache<Product>.new("products", 100)

# キャッシュの使用
user_cache.set("user_1", User.new("Alice"))
user = user_cache.get("user_1")  # Hit
user_cache.get("user_2")         # Miss

product_cache.set("prod_1", Product.new("Laptop"))
product = product_cache.get("prod_1")  # Hit

# インスタンス固有の統計
puts user_cache.hit_rate()     # 50.0 (1 hit, 1 miss)
puts product_cache.hit_rate()  # 100.0 (1 hit, 0 misses)

# グローバル統計
puts Cache.global_hit_rate()   # 66.67 (2 hits, 1 miss)
puts Cache.total_caches()      # 2
```

## ベストプラクティス

1. **attr_accessor/attr_reader/attr_writerを使用する**: これらは型付きインスタンス変数を定義する最もクリーンな方法です。

2. **複雑な変数に明示的に型を付ける**: 配列、ハッシュ、その他の複雑な型を初期化するときは、常に明示的な型を提供します。

3. **nilable型を適切に使用する**: 変数が本当にnilになり得る場合にのみnilable（`?`）としてマークします。

4. **コンストラクタで初期化する**: すべてのインスタンス変数を `initialize` で適切なデフォルト値で設定します。

5. **共有状態にはクラス変数を使用する**: クラス変数はインスタンス間で共有されるカウンター、キャッシュ、設定に最適です。

6. **アクセサメソッドを提供する**: クラス外部からクラス変数に直接アクセスせず、代わりにクラスメソッドを使用します。

## 一般的なパターン

### 遅延初期化

```trb title="lazy_init.trb"
class Report
  attr_reader :name: String

  def initialize(name: String)
    @name = name
    @data: Array<String>? = nil
  end

  def data(): Array<String>
    @data ||= load_data()
  end

  private

  def load_data(): Array<String>
    # 高コストな操作
    ["Item 1", "Item 2", "Item 3"]
  end
end
```

### レジストリパターン

```trb title="registry.trb"
class Plugin
  @@plugins: Hash<String, Plugin> = {}

  attr_reader :name: String

  def initialize(name: String)
    @name = name
    @@plugins[name] = self
  end

  def self.find(name: String): Plugin?
    @@plugins[name]
  end

  def self.all(): Array<Plugin>
    @@plugins.values
  end

  def self.count(): Integer
    @@plugins.length
  end
end
```

### メモ化

```trb title="memoization.trb"
class Calculator
  def initialize()
    @cache: Hash<String, Integer> = {}
  end

  def fibonacci(n: Integer): Integer
    key = "fib_#{n}"
    return @cache[key] if @cache.key?(key)

    result = if n <= 1
      n
    else
      fibonacci(n - 1) + fibonacci(n - 2)
    end

    @cache[key] = result
    result
  end
end
```

## まとめ

T-Rubyのインスタンス変数とクラス変数は、型安全な状態管理を提供します：

- **インスタンス変数**はオブジェクト固有のデータを格納します
- **クラス変数**はすべてのインスタンスで共有されるデータを格納します
- **attr_accessor/attr_reader/attr_writer**は型付きアクセサを提供します
- **明示的な型アノテーション**は複雑な変数の型を明確にします
- **Nilable型**（`?`）はオプショナルデータを処理します

適切な変数の型付けは、クラスを予測可能で、保守しやすく、エラーが少なくします。公開インスタンス変数に型を付けることから始め、内部状態へと進めていきましょう。
