---
sidebar_position: 1
title: パラメータ & 戻り値の型
description: 関数パラメータと戻り値の型付け
---

<DocsBadge />


# パラメータ & 戻り値の型

関数はすべてのRubyプログラムの構成要素です。T-Rubyでは、関数パラメータと戻り値に型アノテーションを追加することで、エラーを早期に発見し、コードをより自己文書化されたものにできます。

## 基本的な関数の型付け

関数に型を追加する最も簡単な方法は、パラメータと戻り値にアノテーションを付けることです：

```trb title="greetings.trb"
def greet(name: String): String
  "Hello, #{name}!"
end

def add(x: Integer, y: Integer): Integer
  x + y
end

# 関数の使用
puts greet("Alice")  # ✓ OK
puts add(5, 3)       # ✓ OK

# コンパイル時に型エラーを検出
greet(42)            # ✗ エラー: Stringを期待したがIntegerを受け取った
add("5", "3")        # ✗ エラー: Integerを期待したがStringを受け取った
```

構文は次のパターンに従います：
- **パラメータ型**: `パラメータ名: 型`
- **戻り値の型**: パラメータリストの後に `: 型`

## 戻り値の型推論

T-Rubyは関数本体に基づいて戻り値の型を推論できることが多いですが、明示的に書くことが良い慣行です：

```trb title="inference.trb"
# 戻り値の型を明示的にアノテーション
def double(n: Integer): Integer
  n * 2
end

# 戻り値の型は推論される（しかし明確さに欠ける）
def triple(n: Integer)
  n * 3  # T-RubyがInteger戻り値の型を推論
end

# 明示的な方が良い - 他の開発者にとってより明確
def quadruple(n: Integer): Integer
  n * 4
end
```

## ユニオン型による複数の戻り値の型

状況に応じて関数が異なる型を返すことがあります。ユニオン型を使用します：

```trb title="unions.trb"
def find_user(id: Integer): User | nil
  # 見つかればUserを返し、見つからなければnilを返す
  users = load_users()
  users.find { |u| u.id == id }
end

def parse_value(input: String): Integer | Float | nil
  return nil if input.empty?

  if input.include?(".")
    input.to_f
  else
    input.to_i
  end
end

# 関数の使用
user = find_user(123)
if user
  puts user.name  # T-Rubyはここでuserがnilでないことを知っている
end

value = parse_value("3.14")
# valueはInteger、Float、またはnilの可能性がある
```

## Void関数

意味のある値を返さない関数は `void` 戻り値の型を使用します：

```trb title="void.trb"
def log_message(message: String): void
  puts "[LOG] #{message}"
  # 明示的なreturnは不要
end

def save_to_database(record: Record): void
  database.insert(record)
  # 副作用のみ、戻り値なし
end

# これらの関数は副作用のために呼び出される
log_message("Application started")
save_to_database(user_record)
```

## 複雑なパラメータ型

パラメータは配列、ハッシュ、カスタムクラスを含む任意の型を持つことができます：

```trb title="complex.trb"
def process_names(names: Array<String>): Integer
  names.map(&:capitalize).length
end

def merge_configs(base: Hash<String, String>, override: Hash<String, String>): Hash<String, String>
  base.merge(override)
end

def send_email(user: User, message: EmailMessage): Boolean
  email_service.send(user.email, message)
end

# 複雑な型の使用
count = process_names(["alice", "bob", "charlie"])

config = merge_configs(
  { "host" => "localhost", "port" => "3000" },
  { "port" => "8080" }
)
```

## 複数のパラメータ

各パラメータに個別に型を指定します：

```trb title="multiple_params.trb"
def create_user(
  name: String,
  email: String,
  age: Integer,
  admin: Boolean
): User
  User.new(
    name: name,
    email: email,
    age: age,
    admin: admin
  )
end

def calculate_price(
  base_price: Float,
  tax_rate: Float,
  discount: Float
): Float
  base_price * (1 + tax_rate) * (1 - discount)
end

# すべてのパラメータで呼び出し
user = create_user("Alice", "alice@example.com", 30, false)
price = calculate_price(100.0, 0.08, 0.10)
```

## Nilableパラメータ

nilになり得るパラメータには `?` 省略形を使用します：

```trb title="nilable.trb"
def format_name(first: String, middle: String?, last: String): String
  if middle
    "#{first} #{middle} #{last}"
  else
    "#{first} #{last}"
  end
end

def greet_with_title(name: String, title: String?): String
  if title
    "Hello, #{title} #{name}"
  else
    "Hello, #{name}"
  end
end

# オプション値を含めて、または含めずに呼び出し
full_name = format_name("John", "Q", "Public")
short_name = format_name("Jane", nil, "Doe")

greeting1 = greet_with_title("Smith", "Dr.")
greeting2 = greet_with_title("Jones", nil)
```

注: `String?` は `String | nil` の省略形です。

## Boolean戻り値の型

true/falseを返す関数には `Boolean` を使用します：

```trb title="boolean.trb"
def is_valid_email(email: String): Boolean
  email.include?("@") && email.include?(".")
end

def has_permission(user: User, resource: String): Boolean
  user.permissions.include?(resource)
end

def is_adult(age: Integer): Boolean
  age >= 18
end

# boolean関数の使用
if is_valid_email("user@example.com")
  puts "Email is valid"
end

can_edit = has_permission(current_user, "posts:edit")
```

## ジェネリック戻り値の型

関数は型情報を保持するジェネリック型を返すことができます：

```trb title="generics.trb"
def first_element<T>(array: Array<T>): T | nil
  array.first
end

def wrap_in_array<T>(value: T): Array<T>
  [value]
end

# 型が保持される
numbers = [1, 2, 3]
first_num = first_element(numbers)  # 型: Integer | nil

strings = ["a", "b", "c"]
first_str = first_element(strings)  # 型: String | nil

wrapped = wrap_in_array(42)  # 型: Array<Integer>
```

## 実践例: ユーザーサービス

実際のシナリオで関数の型付けを示す完全な例です：

```trb title="user_service.trb"
class UserService
  def find_by_id(id: Integer): User | nil
    database.query("SELECT * FROM users WHERE id = ?", id).first
  end

  def find_by_email(email: String): User | nil
    database.query("SELECT * FROM users WHERE email = ?", email).first
  end

  def create(name: String, email: String, age: Integer): User
    user = User.new(name: name, email: email, age: age)
    database.insert(user)
    user
  end

  def update(id: Integer, attributes: Hash<String, String | Integer>): Boolean
    result = database.update("users", id, attributes)
    result.success?
  end

  def delete(id: Integer): void
    database.delete("users", id)
  end

  def list_all(): Array<User>
    database.query("SELECT * FROM users").map { |row| User.from_row(row) }
  end

  def count_users(): Integer
    database.query("SELECT COUNT(*) FROM users").first
  end

  def is_email_taken(email: String): Boolean
    find_by_email(email) != nil
  end
end

# サービスの使用
service = UserService.new

# User | nil を返す
user = service.find_by_id(123)

# User を返す
new_user = service.create("Alice", "alice@example.com", 30)

# Boolean を返す
updated = service.update(123, { "name" => "Bob", "age" => 31 })

# void を返す
service.delete(456)

# Array<User> を返す
all_users = service.list_all()

# Integer を返す
total = service.count_users()

# Boolean を返す
exists = service.is_email_taken("test@example.com")
```

## ベストプラクティス

1. **公開APIには常にアノテーションを付ける**: 公開インターフェースの一部である関数には、常に明示的な型アノテーションを付けるべきです。

2. **戻り値の型を明示的にする**: T-Rubyが推論できる場合でも、明示的な戻り値の型はドキュメントとして機能します。

3. **具体的な型を使用する**: `Object`より`String`を、`Array`より`Array<Integer>`を優先します。

4. **複数の戻り値にはユニオン型を使用する**: `User | nil` は任意の値を返すよりも明確です。

5. **副作用のみの関数にはvoidを使用する**: 関数が戻り値ではなく副作用のために呼び出されることを明確にします。

## 一般的なパターン

### ファクトリ関数

```trb title="factory.trb"
def create_admin_user(name: String, email: String): User
  User.new(name: name, email: email, role: "admin", permissions: ["all"])
end

def create_guest_user(): User
  User.new(name: "Guest", email: "guest@example.com", role: "guest", permissions: [])
end
```

### 変換関数

```trb title="converters.trb"
def to_integer(value: String): Integer | nil
  Integer(value) rescue nil
end

def to_boolean(value: String): Boolean
  ["true", "yes", "1"].include?(value.downcase)
end

def to_array(value: String): Array<String>
  value.split(",").map(&:strip)
end
```

### バリデーション関数

```trb title="validators.trb"
def validate_password(password: String): Boolean
  password.length >= 8 && password.match?(/[A-Z]/) && password.match?(/[0-9]/)
end

def validate_age(age: Integer): Boolean
  age >= 0 && age <= 150
end

def validate_email(email: String): Boolean
  email.match?(/\A[^@\s]+@[^@\s]+\z/)
end
```

## まとめ

関数パラメータと戻り値の型アノテーションはT-Rubyの基本です。これらは：

- コンパイル時に型エラーを検出します
- コードのドキュメントとして機能します
- オートコンプリートとリファクタリングでより良いIDEサポートを可能にします
- コードをより保守しやすくします

関数シグネチャに型を追加することから始めれば、すぐにT-Rubyの型チェック機能の恩恵を受けられます。
