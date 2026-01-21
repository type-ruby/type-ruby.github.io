---
sidebar_position: 2
title: Instance & Class Variables
description: Typing instance and class variables
---

<DocsBadge />


# Instance & Class Variables

Instance and class variables are fundamental to Ruby's object-oriented programming. T-Ruby provides comprehensive type safety for both, ensuring your data structures are predictable and error-free. This guide covers how to type variables at both the instance and class level.

## Instance Variables

Instance variables store data unique to each object. In T-Ruby, there are several ways to type them.

### Using attr_accessor, attr_reader, and attr_writer

The most common and recommended way to type instance variables:

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

# Usage
person = Person.new(1, "Alice", 30)
person.name = "Alice Smith"  # ✓ OK - attr_accessor
puts person.name             # ✓ OK - attr_accessor
puts person.id               # ✓ OK - attr_reader
# person.id = 2              # ✗ Error - read-only
person.password = "secret"   # ✓ OK - attr_writer
# puts person.password       # ✗ Error - write-only
```

### Explicit Instance Variable Declarations

You can explicitly declare types when initializing instance variables:

```trb title="explicit_types.trb"
class ShoppingCart
  def initialize()
    @items: String[] = []
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

### Combining attr Methods with Explicit Types

You can use both approaches together:

```trb title="combined.trb"
class Article
  attr_reader :title: String
  attr_accessor :published: Boolean

  def initialize(title: String)
    @title = title
    @published = false
    @views: Integer = 0
    @comments: String[] = []
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

## Nilable Instance Variables

Instance variables that can be nil use the `?` suffix:

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

## Class Variables

Class variables are shared across all instances of a class. Type them with `@@`:

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

# Usage
c1 = Counter.new
c2 = Counter.new
c3 = Counter.new
puts Counter.total_count()  # 3
Counter.reset_count()
puts Counter.total_count()  # 0
```

### Class Variables with Default Values

Initialize class variables with appropriate defaults:

```trb title="class_var_defaults.trb"
class Configuration
  @@database_url: String = "localhost"
  @@max_connections: Integer = 10
  @@debug_mode: Boolean = false
  @@allowed_hosts: String[] = []

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

  def self.allowed_hosts(): String[]
    @@allowed_hosts
  end
end

# Usage
Configuration.database_url = "postgresql://localhost/mydb"
Configuration.max_connections = 50
Configuration.enable_debug()
Configuration.add_allowed_host("example.com")
```

## Instance Variables vs Class Variables

Understanding when to use each:

```trb title="comparison.trb"
class BankAccount
  # Class variable - shared across all instances
  @@total_accounts: Integer = 0
  @@total_balance: Float = 0.0

  # Instance variables - unique to each instance
  attr_reader :account_number: Integer
  attr_accessor :balance: Float
  attr_accessor :owner: String

  def initialize(account_number: Integer, owner: String, initial_balance: Float)
    @account_number = account_number
    @owner = owner
    @balance = initial_balance

    # Update class variables
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

  # Class methods accessing class variables
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

# Usage
account1 = BankAccount.new(1001, "Alice", 1000.0)
account2 = BankAccount.new(1002, "Bob", 2000.0)

# Instance-specific data
puts account1.balance  # 1000.0
puts account2.balance  # 2000.0

# Class-level data
puts BankAccount.total_accounts()   # 2
puts BankAccount.total_balance()    # 3000.0
puts BankAccount.average_balance()  # 1500.0

account1.deposit(500.0)
puts BankAccount.total_balance()    # 3500.0
```

## Complex Instance Variable Types

Instance variables can hold any type:

```trb title="complex_types.trb"
class DataStore
  def initialize()
    @strings: String[] = []
    @numbers: Integer[] = []
    @mappings: Hash<String, Integer> = {}
    @nested: Hash<String, String[]> = {}
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

  def add_nested(key: String, values: String[]): void
    @nested[key] = values
  end

  def set_optional(data: String?): void
    @optional_data = data
  end

  def set_union(data: String | Integer): void
    @union_data = data
  end

  def get_strings(): String[]
    @strings
  end

  def get_mapping(key: String): Integer?
    @mappings[key]
  end
end
```

## Practical Example: User Session

A real-world example combining instance and class variables:

```trb title="user_session.trb"
class UserSession
  # Class variables - track all sessions
  @@active_sessions: Hash<String, UserSession> = {}
  @@session_count: Integer = 0

  # Instance variables - session-specific data
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

    # Register this session
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

  # Class methods
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

# Usage
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

# Expire old sessions
UserSession.expire_old_sessions(60)  # Expire sessions older than 60 minutes
```

## Practical Example: Cache System

Another example showing effective use of class and instance variables:

```trb title="cache_system.trb"
class Cache<T>
  # Class variables - shared statistics
  @@total_hits: Integer = 0
  @@total_misses: Integer = 0
  @@total_caches: Integer = 0

  # Instance variables - cache-specific data
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
    # Evict oldest entry if cache is full
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

  def keys(): String[]
    @data.keys
  end

  private

  def evict_oldest(): void
    oldest_key = @access_times.min_by { |k, v| v }&.first
    if oldest_key
      delete(oldest_key)
    end
  end

  # Class methods for global statistics
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

# Usage
user_cache = Cache<User>.new("users", 50)
product_cache = Cache<Product>.new("products", 100)

# Use the caches
user_cache.set("user_1", User.new("Alice"))
user = user_cache.get("user_1")  # Hit
user_cache.get("user_2")         # Miss

product_cache.set("prod_1", Product.new("Laptop"))
product = product_cache.get("prod_1")  # Hit

# Instance-specific statistics
puts user_cache.hit_rate()     # 50.0 (1 hit, 1 miss)
puts product_cache.hit_rate()  # 100.0 (1 hit, 0 misses)

# Global statistics
puts Cache.global_hit_rate()   # 66.67 (2 hits, 1 miss)
puts Cache.total_caches()      # 2
```

## Best Practices

1. **Use attr_accessor/attr_reader/attr_writer**: These are the cleanest way to define typed instance variables.

2. **Explicitly type complex variables**: When initializing arrays, hashes, or other complex types, always provide explicit types.

3. **Use nilable types appropriately**: Only mark variables as nilable (`?`) when they genuinely can be nil.

4. **Initialize in constructor**: Set all instance variables in `initialize` with appropriate defaults.

5. **Use class variables for shared state**: Class variables are perfect for counters, caches, and configuration shared across instances.

6. **Provide accessor methods**: Don't access class variables directly from outside the class; use class methods instead.

## Common Patterns

### Lazy Initialization

```trb title="lazy_init.trb"
class Report
  attr_reader :name: String

  def initialize(name: String)
    @name = name
    @data: String[]? = nil
  end

  def data(): String[]
    @data ||= load_data()
  end

  private

  def load_data(): String[]
    # Expensive operation
    ["Item 1", "Item 2", "Item 3"]
  end
end
```

### Registry Pattern

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

  def self.all(): Plugin[]
    @@plugins.values
  end

  def self.count(): Integer
    @@plugins.length
  end
end
```

### Memoization

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

## Summary

Instance and class variables in T-Ruby provide type-safe state management:

- **Instance variables** store object-specific data
- **Class variables** store data shared across all instances
- **attr_accessor/attr_reader/attr_writer** provide typed accessors
- **Explicit type annotations** clarify complex variable types
- **Nilable types** (`?`) handle optional data

Proper variable typing makes your classes predictable, maintainable, and less error-prone. Start by typing your public instance variables and work your way to internal state.
