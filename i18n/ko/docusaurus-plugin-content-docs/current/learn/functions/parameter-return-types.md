---
sidebar_position: 1
title: 매개변수 & 반환 타입
description: 함수 매개변수와 반환 값의 타입 지정
---

<DocsBadge />


# 매개변수 & 반환 타입

함수는 모든 Ruby 프로그램의 구성 요소입니다. T-Ruby에서는 함수 매개변수와 반환 값에 타입 어노테이션을 추가하여 오류를 조기에 발견하고 코드를 더 자체 문서화되게 만들 수 있습니다.

## 기본 함수 타이핑

함수에 타입을 추가하는 가장 간단한 방법은 매개변수와 반환 값에 어노테이션을 다는 것입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={25} />

```trb title="greetings.trb"
def greet(name: String): String
  "Hello, #{name}!"
end

def add(x: Integer, y: Integer): Integer
  x + y
end

# 함수 사용하기
puts greet("Alice")  # ✓ OK
puts add(5, 3)       # ✓ OK

# 컴파일 타임에 타입 오류 감지
greet(42)            # ✗ 오류: String을 기대했는데 Integer를 받음
add("5", "3")        # ✗ 오류: Integer를 기대했는데 String을 받음
```

구문은 다음 패턴을 따릅니다:
- **매개변수 타입**: `매개변수명: 타입`
- **반환 타입**: 매개변수 목록 뒤에 `: 타입`

## 반환 타입 추론

T-Ruby는 종종 함수 본문을 기반으로 반환 타입을 추론할 수 있지만, 명시적으로 작성하는 것이 좋은 관행입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={36} />

```trb title="inference.trb"
# 반환 타입 명시적으로 어노테이션
def double(n: Integer): Integer
  n * 2
end

# 반환 타입 추론됨 (하지만 덜 명확함)
def triple(n: Integer)
  n * 3  # T-Ruby가 Integer 반환 타입을 추론
end

# 명시적인 것이 더 좋음 - 다른 개발자에게 더 명확함
def quadruple(n: Integer): Integer
  n * 4
end
```

## 유니온 타입으로 다중 반환 타입

상황에 따라 함수가 다른 타입을 반환할 수 있습니다. 유니온 타입을 사용하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={47} />

```trb title="unions.trb"
def find_user(id: Integer): User | nil
  # 찾으면 User를 반환하고, 찾지 못하면 nil을 반환
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

# 함수 사용하기
user = find_user(123)
if user
  puts user.name  # T-Ruby는 여기서 user가 nil이 아님을 알고 있음
end

value = parse_value("3.14")
# value는 Integer, Float, 또는 nil일 수 있음
```

## Void 함수

의미 있는 값을 반환하지 않는 함수는 `void` 반환 타입을 사용합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={58} />

```trb title="void.trb"
def log_message(message: String): void
  puts "[LOG] #{message}"
  # 명시적인 return이 필요 없음
end

def save_to_database(record: Record): void
  database.insert(record)
  # 부작용만 있고, 반환 값 없음
end

# 이 함수들은 부작용을 위해 호출됨
log_message("Application started")
save_to_database(user_record)
```

## 복잡한 매개변수 타입

매개변수는 배열, 해시, 커스텀 클래스를 포함한 모든 타입을 가질 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={69} />

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

# 복잡한 타입 사용하기
count = process_names(["alice", "bob", "charlie"])

config = merge_configs(
  { "host" => "localhost", "port" => "3000" },
  { "port" => "8080" }
)
```

## 다중 매개변수

각 매개변수에 개별적으로 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={80} />

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

# 모든 매개변수로 호출
user = create_user("Alice", "alice@example.com", 30, false)
price = calculate_price(100.0, 0.08, 0.10)
```

## Nilable 매개변수

nil일 수 있는 매개변수에는 `?` 축약형을 사용합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={91} />

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

# 선택적 값을 포함하거나 포함하지 않고 호출
full_name = format_name("John", "Q", "Public")
short_name = format_name("Jane", nil, "Doe")

greeting1 = greet_with_title("Smith", "Dr.")
greeting2 = greet_with_title("Jones", nil)
```

참고: `String?`은 `String | nil`의 축약형입니다.

## Boolean 반환 타입

true/false를 반환하는 함수에는 `Boolean`을 사용합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={102} />

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

# boolean 함수 사용하기
if is_valid_email("user@example.com")
  puts "Email is valid"
end

can_edit = has_permission(current_user, "posts:edit")
```

## 제네릭 반환 타입

함수는 타입 정보를 보존하는 제네릭 타입을 반환할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={113} />

```trb title="generics.trb"
def first_element<T>(array: Array<T>): T | nil
  array.first
end

def wrap_in_array<T>(value: T): Array<T>
  [value]
end

# 타입이 보존됨
numbers = [1, 2, 3]
first_num = first_element(numbers)  # 타입: Integer | nil

strings = ["a", "b", "c"]
first_str = first_element(strings)  # 타입: String | nil

wrapped = wrap_in_array(42)  # 타입: Array<Integer>
```

## 실전 예제: 사용자 서비스

실제 시나리오에서 함수 타이핑을 보여주는 완전한 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={124} />

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

# 서비스 사용하기
service = UserService.new

# User | nil 반환
user = service.find_by_id(123)

# User 반환
new_user = service.create("Alice", "alice@example.com", 30)

# Boolean 반환
updated = service.update(123, { "name" => "Bob", "age" => 31 })

# void 반환
service.delete(456)

# Array<User> 반환
all_users = service.list_all()

# Integer 반환
total = service.count_users()

# Boolean 반환
exists = service.is_email_taken("test@example.com")
```

## 모범 사례

1. **공개 API에는 항상 어노테이션 작성**: 공개 인터페이스의 일부인 함수는 항상 명시적인 타입 어노테이션을 가져야 합니다.

2. **반환 타입을 명시적으로 작성**: T-Ruby가 추론할 수 있더라도, 명시적인 반환 타입은 문서로서 역할합니다.

3. **구체적인 타입 사용**: `Object`보다 `String`을, `Array`보다 `Array<Integer>`를 선호하세요.

4. **다중 반환 값에는 유니온 타입 사용**: `User | nil`은 아무 값이나 반환하는 것보다 명확합니다.

5. **부작용만 있는 함수에는 void 사용**: 함수가 반환 값이 아닌 부작용을 위해 호출된다는 것을 명확하게 합니다.

## 일반적인 패턴

### 팩토리 함수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={135} />

```trb title="factory.trb"
def create_admin_user(name: String, email: String): User
  User.new(name: name, email: email, role: "admin", permissions: ["all"])
end

def create_guest_user(): User
  User.new(name: "Guest", email: "guest@example.com", role: "guest", permissions: [])
end
```

### 변환 함수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={146} />

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

### 검증 함수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/functions/parameter_return_types_spec.rb" line={157} />

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

## 요약

함수 매개변수와 반환 타입 어노테이션은 T-Ruby의 기본입니다. 이것들은:

- 컴파일 타임에 타입 오류를 잡습니다
- 코드의 문서 역할을 합니다
- 자동 완성과 리팩토링으로 더 나은 IDE 지원을 가능하게 합니다
- 코드를 더 유지보수하기 쉽게 만듭니다

함수 시그니처에 타입을 추가하는 것부터 시작하면, 즉시 T-Ruby의 타입 검사 기능의 이점을 누릴 수 있습니다.
