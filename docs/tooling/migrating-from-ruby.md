---
sidebar_position: 4
title: Migrating from Ruby
description: Guide to migrating existing Ruby projects to T-Ruby
---

<DocsBadge />


# Migrating from Ruby

Migrating an existing Ruby codebase to T-Ruby is a gradual process. Thanks to T-Ruby's optional type system, you can adopt types incrementally without rewriting everything at once.

## Migration Strategy

### 1. Incremental Adoption

You don't need to migrate everything at once. T-Ruby is designed for gradual adoption:

- Start with a single file or module
- Add types to new code first
- Migrate existing code as you touch it
- Mix `.rb` and `.trb` files in the same project

### 2. Bottom-Up Approach

Migrate from the bottom of your dependency tree upward:

1. **Utility functions** - Pure functions with clear inputs/outputs
2. **Data models** - Classes representing data structures
3. **Services** - Business logic layers
4. **Controllers/Views** - Higher-level application code

### 3. Strictness Levels

Use different strictness levels during migration:

- **Permissive** - Start here, minimal type requirements
- **Standard** - Move to this once basic types are in place
- **Strict** - Final goal for maximum type safety

## Step-by-Step Migration

### Step 1: Set Up T-Ruby

Install T-Ruby in your project:

```bash
gem install t-ruby
```

Or add to Gemfile:

```ruby
group :development do
  gem "t-ruby"
end
```

Initialize configuration:

```bash
trc --init
```

### Step 2: Choose a Starting Point

Pick a file to migrate. Good candidates:

**Data classes** - Clear structure, minimal dependencies:

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

**Pure functions** - Predictable inputs and outputs:

```ruby title="calculator.rb"
def calculate_tax(amount, rate)
  amount * rate
end

def format_currency(amount)
  "$#{sprintf('%.2f', amount)}"
end
```

### Step 3: Rename to .trb

```bash
mv user.rb user.trb
```

At this point, the file is still valid Ruby - all Ruby is valid T-Ruby.

### Step 4: Add Basic Types

Start with simple type annotations:

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

### Step 5: Compile and Fix Errors

```bash
trc compile user.trb
```

Fix any type errors that appear:

```
Error: user.trb:12:5
  Type mismatch: expected String, got nil

  @email = params[:email]
           ^^^^^^^^^^^^^^

Hint: Did you mean: String | nil ?
```

Fix:

```trb
def initialize(id: Integer, name: String, email: String | nil): void
  @id = id
  @name = name
  @email = email || "no-email@example.com"
end
```

### Step 6: Gradual Expansion

Once one file works, migrate related files:

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

## Common Migration Patterns

### Pattern 1: Simple Data Class

**Before** (Ruby):

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

**After** (T-Ruby):

```trb
class Product
  @id: Integer
  @name: String
  @price: Float
  @in_stock: Boolean

  attr_accessor :id, :name, :price, :in_stock

  def initialize(
    id: Integer,
    name: String,
    price: Float,
    in_stock: Boolean = true
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

### Pattern 2: Service Class

**Before** (Ruby):

```ruby
class UserService
  def find_user(id)
    # Database lookup
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

**After** (T-Ruby):

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

### Pattern 3: Module with Mixins

**Before** (Ruby):

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

**After** (T-Ruby):

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

### Pattern 4: Hash-Heavy Code

**Before** (Ruby):

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

**After** (T-Ruby):

Define type aliases for clarity:

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

Or use structured types:

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

### Pattern 5: Dynamic Method Calls

**Before** (Ruby):

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
    # Database query
  end
end
```

**After** (T-Ruby):

Use explicit methods or define types:

```trb
class DynamicModel
  # Explicit methods for type safety
  def find_by_name(name: String): DynamicModel | nil
    find_by("name", name)
  end

  def find_by_email(email: String): DynamicModel | nil
    find_by("email", email)
  end

  private

  def find_by(attribute: String, value: String): DynamicModel | nil
    # Database query
  end
end
```

Or use generics for flexible typing:

```trb
class DynamicModel
  def find_by<T>(attribute: String, value: T): DynamicModel | nil
    # Database query
  end
end
```

## Handling Challenging Code

### Nil Handling

Ruby code often uses nil implicitly:

**Before**:
```ruby
def find_user(id)
  users.find { |u| u.id == id }
end

user = find_user(123)
user.name  # Might crash if nil!
```

**After**:
```trb
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end

user = find_user(123)
if user
  user.name  # Safe - nil checked
end

# Or use safe navigation
user&.name
```

### Complex Hashes

**Before**:
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

**After** - Use structured classes:

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

# Usage
config = Config.new(
  DatabaseConfig.new(
    "localhost",
    5432,
    Credentials.new("admin", "secret")
  )
)
```

### Duck Typing

**Before**:
```ruby
def format(object)
  if object.respond_to?(:to_s)
    object.to_s
  else
    object.inspect
  end
end
```

**After** - Use interfaces:

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

### Metaprogramming

Some metaprogramming can't be typed easily. Options:

1. **Refactor** to explicit code
2. **Use Any** type for dynamic parts
3. **Keep as .rb** file (don't migrate)

**Before**:
```ruby
class DynamicClass
  [:foo, :bar, :baz].each do |method_name|
    define_method(method_name) do |arg|
      instance_variable_set("@#{method_name}", arg)
    end
  end
end
```

**After** - Explicit methods:

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

## Configuration for Migration

### Permissive Mode

Start with permissive mode during migration:

```yaml title="trbconfig.yml"
compiler:
  strictness: permissive

  checks:
    no_implicit_any: false
    strict_nil: false
    no_unused_vars: false
```

This allows:
- Untyped parameters
- Implicit `any` types
- Missing return types

### Gradual Strictness

As you add more types, increase strictness:

```yaml title="trbconfig.yml"
compiler:
  strictness: standard  # Move from permissive

  checks:
    no_implicit_any: true  # Enable gradually
    strict_nil: true
    no_unused_vars: false  # Enable later
```

### Final Strict Mode

Once fully migrated:

```yaml title="trbconfig.yml"
compiler:
  strictness: strict

  checks:
    no_implicit_any: true
    strict_nil: true
    no_unused_vars: true
    no_unchecked_indexed_access: true
```

## Mixed Codebase

You can mix Ruby and T-Ruby files:

```
app/
├── models/
│   ├── user.trb          # Migrated
│   ├── post.trb          # Migrated
│   └── comment.rb        # Still Ruby
├── services/
│   ├── auth.trb          # Migrated
│   └── email.rb          # Still Ruby
└── controllers/
    └── users_controller.rb  # Still Ruby
```

Configure T-Ruby to only compile `.trb` files:

```yaml title="trbconfig.yml"
source:
  include:
    - app/models
    - app/services

  extensions:
    - .trb  # Only compile .trb files
```

Generated Ruby files work alongside existing Ruby:

```
app/
├── models/
│   ├── user.rb           # Compiled from user.trb
│   ├── post.rb           # Compiled from post.trb
│   └── comment.rb        # Original Ruby
```

## Testing During Migration

### Test Both Versions

Keep tests in Ruby, run against compiled code:

```
test/
├── user_test.rb
├── post_test.rb
└── comment_test.rb

# Tests run against build/
ruby -Itest -Ibuild test/user_test.rb
```

### Type-Check Before Tests

```bash
# Type check first
trc check src/

# If passes, compile and test
trc compile src/
bundle exec rake test
```

### CI Configuration

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

## Migration Checklist

### Phase 1: Setup
- [ ] Install T-Ruby
- [ ] Create `trbconfig.yml` configuration
- [ ] Set up watch mode
- [ ] Configure CI for type checking

### Phase 2: Initial Migration
- [ ] Identify starting files (data models, utilities)
- [ ] Rename `.rb` to `.trb`
- [ ] Add basic type annotations
- [ ] Compile and fix errors
- [ ] Run tests

### Phase 3: Expansion
- [ ] Migrate related files
- [ ] Add stricter type checking
- [ ] Generate RBS files
- [ ] Set up Steep (optional)
- [ ] Configure Ruby LSP

### Phase 4: Completion
- [ ] Migrate remaining files
- [ ] Enable strict mode
- [ ] Document type conventions
- [ ] Train team on T-Ruby

## Tips for Successful Migration

### 1. Start Small

Don't try to migrate everything at once. Start with:
- One file
- One module
- One feature

### 2. Focus on Value

Migrate code where types provide the most value:
- Public APIs
- Complex business logic
- Data models
- Frequently modified code

### 3. Use Type Aliases

Make complex types readable:

```trb
type UserId = Integer
type UserAttributes = Hash<String, String | Integer | Boolean>
type UserList = Array<User>
```

### 4. Document Patterns

Create a style guide for your team:

```markdown
# T-Ruby Style Guide

## Naming
- Use PascalCase for types: `UserId`, `UserData`
- Use explicit types for public methods
- Private methods can omit types

## Patterns
- Prefer structured classes over hashes
- Use `String | nil` instead of implicit nil
- Add return type for all public methods
```

### 5. Leverage Tools

- **Watch mode** - Auto-compile on save
- **Ruby LSP** - IDE support
- **Steep** - Additional validation

### 6. Be Pragmatic

Not everything needs full types:
- Use `Any` for truly dynamic code
- Keep metaprogramming in `.rb` files
- Focus on public interfaces

## Rollback Strategy

If migration isn't working:

### Keep Original Files

```bash
# Before renaming
cp user.rb user.rb.bak

# If issues, restore
mv user.rb.bak user.rb
```

### Use Git Branches

```bash
git checkout -b migrate-user-model
# Make changes
# If it works:
git checkout main
git merge migrate-user-model
# If not:
git checkout main
git branch -D migrate-user-model
```

### Incremental Commits

Commit each file migration separately:

```bash
git add user.trb
git commit -m "Migrate User model to T-Ruby"

# If this causes issues, easy to revert:
git revert HEAD
```

## Real-World Example

Complete migration of a simple Rails model:

**Before** (`app/models/article.rb`):

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

**After** (`app/models/article.trb`):

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

  def published?: Boolean
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

## Next Steps

After migration:

1. **Enable stricter checking** - Gradually increase type safety
2. **Set up Steep** - Additional type validation
3. **Configure Ruby LSP** - Better IDE support
4. **Document patterns** - Create team guidelines
5. **Continue migrating** - Expand to more files

## Resources

- [Type Annotations Guide](/docs/learn/basics/type-annotations)
- [Configuration Reference](/docs/cli/configuration)
- [RBS Integration](/docs/tooling/rbs-integration)
- [Using with Steep](/docs/tooling/steep)
