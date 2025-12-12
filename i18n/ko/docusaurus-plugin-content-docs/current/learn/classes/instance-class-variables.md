---
sidebar_position: 2
title: 인스턴스 & 클래스 변수
description: 인스턴스 및 클래스 변수 타이핑
---

<DocsBadge />


# 인스턴스 & 클래스 변수

인스턴스 변수와 클래스 변수는 Ruby의 객체 지향 프로그래밍의 기본입니다. T-Ruby는 둘 다에 대해 포괄적인 타입 안전성을 제공하여 데이터 구조가 예측 가능하고 오류가 없도록 합니다. 이 가이드에서는 인스턴스 및 클래스 레벨에서 변수에 타입을 지정하는 방법을 다룹니다.

## 인스턴스 변수

인스턴스 변수는 각 객체에 고유한 데이터를 저장합니다. T-Ruby에서는 여러 가지 방법으로 타입을 지정할 수 있습니다.

### attr_accessor, attr_reader, attr_writer 사용

인스턴스 변수에 타입을 지정하는 가장 일반적이고 권장되는 방법입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

# 사용법
person = Person.new(1, "Alice", 30)
person.name = "Alice Smith"  # ✓ OK - attr_accessor
puts person.name             # ✓ OK - attr_accessor
puts person.id               # ✓ OK - attr_reader
# person.id = 2              # ✗ 오류 - 읽기 전용
person.password = "secret"   # ✓ OK - attr_writer
# puts person.password       # ✗ 오류 - 쓰기 전용
```

### 명시적 인스턴스 변수 선언

인스턴스 변수를 초기화할 때 타입을 명시적으로 선언할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

### attr 메서드와 명시적 타입 조합

두 가지 접근 방식을 함께 사용할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

## Nilable 인스턴스 변수

nil일 수 있는 인스턴스 변수는 `?` 접미사를 사용합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

## 클래스 변수

클래스 변수는 클래스의 모든 인스턴스에서 공유됩니다. `@@`로 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

# 사용법
c1 = Counter.new
c2 = Counter.new
c3 = Counter.new
puts Counter.total_count()  # 3
Counter.reset_count()
puts Counter.total_count()  # 0
```

### 기본값이 있는 클래스 변수

적절한 기본값으로 클래스 변수를 초기화합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

# 사용법
Configuration.database_url = "postgresql://localhost/mydb"
Configuration.max_connections = 50
Configuration.enable_debug()
Configuration.add_allowed_host("example.com")
```

## 인스턴스 변수 vs 클래스 변수

각각을 언제 사용해야 하는지 이해하기:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

```trb title="comparison.trb"
class BankAccount
  # 클래스 변수 - 모든 인스턴스에서 공유
  @@total_accounts: Integer = 0
  @@total_balance: Float = 0.0

  # 인스턴스 변수 - 각 인스턴스에 고유
  attr_reader :account_number: Integer
  attr_accessor :balance: Float
  attr_accessor :owner: String

  def initialize(account_number: Integer, owner: String, initial_balance: Float)
    @account_number = account_number
    @owner = owner
    @balance = initial_balance

    # 클래스 변수 업데이트
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

  # 클래스 변수에 접근하는 클래스 메서드
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

# 사용법
account1 = BankAccount.new(1001, "Alice", 1000.0)
account2 = BankAccount.new(1002, "Bob", 2000.0)

# 인스턴스별 데이터
puts account1.balance  # 1000.0
puts account2.balance  # 2000.0

# 클래스 레벨 데이터
puts BankAccount.total_accounts()   # 2
puts BankAccount.total_balance()    # 3000.0
puts BankAccount.average_balance()  # 1500.0

account1.deposit(500.0)
puts BankAccount.total_balance()    # 3500.0
```

## 복잡한 인스턴스 변수 타입

인스턴스 변수는 모든 타입을 가질 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

## 실전 예제: 사용자 세션

인스턴스 변수와 클래스 변수를 조합한 실제 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

```trb title="user_session.trb"
class UserSession
  # 클래스 변수 - 모든 세션 추적
  @@active_sessions: Hash<String, UserSession> = {}
  @@session_count: Integer = 0

  # 인스턴스 변수 - 세션별 데이터
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

    # 이 세션 등록
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

  # 클래스 메서드
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

# 사용법
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

# 오래된 세션 만료
UserSession.expire_old_sessions(60)  # 60분보다 오래된 세션 만료
```

## 실전 예제: 캐시 시스템

클래스 변수와 인스턴스 변수의 효과적인 사용을 보여주는 또 다른 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

```trb title="cache_system.trb"
class Cache<T>
  # 클래스 변수 - 공유 통계
  @@total_hits: Integer = 0
  @@total_misses: Integer = 0
  @@total_caches: Integer = 0

  # 인스턴스 변수 - 캐시별 데이터
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
    # 캐시가 가득 차면 가장 오래된 항목 제거
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

  # 전역 통계를 위한 클래스 메서드
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

# 사용법
user_cache = Cache<User>.new("users", 50)
product_cache = Cache<Product>.new("products", 100)

# 캐시 사용
user_cache.set("user_1", User.new("Alice"))
user = user_cache.get("user_1")  # Hit
user_cache.get("user_2")         # Miss

product_cache.set("prod_1", Product.new("Laptop"))
product = product_cache.get("prod_1")  # Hit

# 인스턴스별 통계
puts user_cache.hit_rate()     # 50.0 (1 hit, 1 miss)
puts product_cache.hit_rate()  # 100.0 (1 hit, 0 misses)

# 전역 통계
puts Cache.global_hit_rate()   # 66.67 (2 hits, 1 miss)
puts Cache.total_caches()      # 2
```

## 모범 사례

1. **attr_accessor/attr_reader/attr_writer 사용**: 이것들이 타입이 지정된 인스턴스 변수를 정의하는 가장 깔끔한 방법입니다.

2. **복잡한 변수에 명시적으로 타입 지정**: 배열, 해시 또는 기타 복잡한 타입을 초기화할 때 항상 명시적 타입을 제공합니다.

3. **nilable 타입을 적절히 사용**: 변수가 진정으로 nil일 수 있을 때만 nilable(`?`)로 표시합니다.

4. **생성자에서 초기화**: 모든 인스턴스 변수를 `initialize`에서 적절한 기본값으로 설정합니다.

5. **공유 상태에 클래스 변수 사용**: 클래스 변수는 인스턴스 간에 공유되는 카운터, 캐시, 구성에 완벽합니다.

6. **접근자 메서드 제공**: 클래스 외부에서 클래스 변수에 직접 접근하지 말고 대신 클래스 메서드를 사용합니다.

## 일반적인 패턴

### 지연 초기화

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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
    # 비용이 큰 연산
    ["Item 1", "Item 2", "Item 3"]
  end
end
```

### 레지스트리 패턴

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

### 메모이제이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/classes/instance_class_variables_spec.rb" line={21} />

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

## 요약

T-Ruby의 인스턴스 및 클래스 변수는 타입 안전한 상태 관리를 제공합니다:

- **인스턴스 변수**는 객체별 데이터를 저장합니다
- **클래스 변수**는 모든 인스턴스에서 공유되는 데이터를 저장합니다
- **attr_accessor/attr_reader/attr_writer**는 타입이 지정된 접근자를 제공합니다
- **명시적 타입 어노테이션**은 복잡한 변수 타입을 명확하게 합니다
- **Nilable 타입**(`?`)은 선택적 데이터를 처리합니다

적절한 변수 타이핑은 클래스를 예측 가능하고 유지보수하기 쉽고 오류가 적게 만듭니다. 공개 인스턴스 변수에 타입을 지정하는 것부터 시작하여 내부 상태로 진행하세요.
