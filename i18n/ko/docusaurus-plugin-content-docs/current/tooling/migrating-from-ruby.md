---
sidebar_position: 4
title: Ruby에서 마이그레이션
description: 기존 Ruby 프로젝트를 T-Ruby로 마이그레이션하는 가이드
---

<DocsBadge />


# Ruby에서 마이그레이션

기존 Ruby 코드베이스를 T-Ruby로 마이그레이션하는 것은 점진적인 과정입니다. T-Ruby의 선택적 타입 시스템 덕분에 모든 것을 한 번에 다시 작성하지 않고 점진적으로 타입을 도입할 수 있습니다.

## 마이그레이션 전략

### 1. 점진적 도입

모든 것을 한 번에 마이그레이션할 필요가 없습니다. T-Ruby는 점진적 도입을 위해 설계되었습니다:

- 단일 파일 또는 모듈로 시작
- 먼저 새 코드에 타입 추가
- 기존 코드를 수정할 때 마이그레이션
- 같은 프로젝트에서 `.rb`와 `.trb` 파일 혼합

### 2. 상향식 접근법

의존성 트리의 아래부터 위로 마이그레이션:

1. **유틸리티 함수** - 명확한 입력/출력이 있는 순수 함수
2. **데이터 모델** - 데이터 구조를 나타내는 클래스
3. **서비스** - 비즈니스 로직 레이어
4. **컨트롤러/뷰** - 상위 수준 애플리케이션 코드

### 3. 엄격도 수준

마이그레이션 중 다른 엄격도 수준 사용:

- **Permissive** - 여기서 시작, 최소한의 타입 요구사항
- **Standard** - 기본 타입이 갖춰지면 여기로 이동
- **Strict** - 최대 타입 안전성을 위한 최종 목표

## 단계별 마이그레이션

### 1단계: T-Ruby 설정

프로젝트에 T-Ruby 설치:

```bash
gem install t-ruby
```

또는 Gemfile에 추가:

```ruby
group :development do
  gem "t-ruby"
end
```

설정 초기화:

```bash
trc init
```

### 2단계: 시작점 선택

마이그레이션할 파일 선택. 좋은 후보:

**데이터 클래스** - 명확한 구조, 최소한의 의존성:

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

**순수 함수** - 예측 가능한 입력과 출력:

```ruby title="calculator.rb"
def calculate_tax(amount, rate)
  amount * rate
end

def format_currency(amount)
  "$#{sprintf('%.2f', amount)}"
end
```

### 3단계: .trb로 이름 변경

```bash
mv user.rb user.trb
```

이 시점에서 파일은 여전히 유효한 Ruby입니다 - 모든 Ruby는 유효한 T-Ruby입니다.

### 4단계: 기본 타입 추가

간단한 타입 어노테이션으로 시작:

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

### 5단계: 컴파일하고 오류 수정

```bash
trc compile user.trb
```

나타나는 타입 오류 수정:

```
Error: user.trb:12:5
  Type mismatch: expected String, got nil

  @email = params[:email]
           ^^^^^^^^^^^^^^

Hint: Did you mean: String | nil ?
```

수정:

```trb
def initialize(id: Integer, name: String, email: String | nil): void
  @id = id
  @name = name
  @email = email || "no-email@example.com"
end
```

### 6단계: 점진적 확장

하나의 파일이 작동하면 관련 파일 마이그레이션:

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

## 일반적인 마이그레이션 패턴

### 패턴 1: 간단한 데이터 클래스

**이전** (Ruby):

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

**이후** (T-Ruby):

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

### 패턴 2: 서비스 클래스

**이전** (Ruby):

```ruby
class UserService
  def find_user(id)
    # 데이터베이스 조회
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

**이후** (T-Ruby):

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

### 패턴 3: 믹스인이 있는 모듈

**이전** (Ruby):

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

**이후** (T-Ruby):

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

### 패턴 4: Hash가 많은 코드

**이전** (Ruby):

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

**이후** (T-Ruby):

명확성을 위해 타입 별칭 정의:

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

또는 구조화된 타입 사용:

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

### 패턴 5: 동적 메서드 호출

**이전** (Ruby):

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
    # 데이터베이스 쿼리
  end
end
```

**이후** (T-Ruby):

명시적 메서드를 사용하거나 타입 정의:

```trb
class DynamicModel
  # 타입 안전성을 위한 명시적 메서드
  def find_by_name(name: String): DynamicModel | nil
    find_by("name", name)
  end

  def find_by_email(email: String): DynamicModel | nil
    find_by("email", email)
  end

  private

  def find_by(attribute: String, value: String): DynamicModel | nil
    # 데이터베이스 쿼리
  end
end
```

또는 유연한 타이핑을 위해 제네릭 사용:

```trb
class DynamicModel
  def find_by<T>(attribute: String, value: T): DynamicModel | nil
    # 데이터베이스 쿼리
  end
end
```

## 까다로운 코드 처리

### Nil 처리

Ruby 코드는 종종 암묵적으로 nil을 사용합니다:

**이전**:
```ruby
def find_user(id)
  users.find { |u| u.id == id }
end

user = find_user(123)
user.name  # nil이면 크래시!
```

**이후**:
```trb
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end

user = find_user(123)
if user
  user.name  # 안전 - nil 체크됨
end

# 또는 안전 내비게이션 사용
user&.name
```

### 복잡한 Hash

**이전**:
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

**이후** - 구조화된 클래스 사용:

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

# 사용
config = Config.new(
  DatabaseConfig.new(
    "localhost",
    5432,
    Credentials.new("admin", "secret")
  )
)
```

### 덕 타이핑

**이전**:
```ruby
def format(object)
  if object.respond_to?(:to_s)
    object.to_s
  else
    object.inspect
  end
end
```

**이후** - 인터페이스 사용:

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

### 메타프로그래밍

일부 메타프로그래밍은 쉽게 타입을 지정할 수 없습니다. 옵션:

1. 명시적 코드로 **리팩토링**
2. 동적 부분에 **Any** 타입 사용
3. **.rb** 파일로 유지 (마이그레이션하지 않음)

**이전**:
```ruby
class DynamicClass
  [:foo, :bar, :baz].each do |method_name|
    define_method(method_name) do |arg|
      instance_variable_set("@#{method_name}", arg)
    end
  end
end
```

**이후** - 명시적 메서드:

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

## 마이그레이션을 위한 설정

### Permissive 모드

마이그레이션 중 permissive 모드로 시작:

```yaml title="trc.yaml"
compiler:
  strictness: permissive

  checks:
    no_implicit_any: false
    strict_nil: false
    no_unused_vars: false
```

이것은 다음을 허용합니다:
- 타입이 없는 파라미터
- 암묵적 `any` 타입
- 누락된 반환 타입

### 점진적 엄격화

더 많은 타입을 추가하면 엄격도 증가:

```yaml title="trc.yaml"
compiler:
  strictness: standard  # permissive에서 이동

  checks:
    no_implicit_any: true  # 점진적으로 활성화
    strict_nil: true
    no_unused_vars: false  # 나중에 활성화
```

### 최종 Strict 모드

완전히 마이그레이션되면:

```yaml title="trc.yaml"
compiler:
  strictness: strict

  checks:
    no_implicit_any: true
    strict_nil: true
    no_unused_vars: true
    no_unchecked_indexed_access: true
```

## 혼합 코드베이스

Ruby와 T-Ruby 파일을 혼합할 수 있습니다:

```
app/
├── models/
│   ├── user.trb          # 마이그레이션됨
│   ├── post.trb          # 마이그레이션됨
│   └── comment.rb        # 여전히 Ruby
├── services/
│   ├── auth.trb          # 마이그레이션됨
│   └── email.rb          # 여전히 Ruby
└── controllers/
    └── users_controller.rb  # 여전히 Ruby
```

T-Ruby가 `.trb` 파일만 컴파일하도록 설정:

```yaml title="trc.yaml"
source:
  include:
    - app/models
    - app/services

  extensions:
    - .trb  # .trb 파일만 컴파일
```

생성된 Ruby 파일은 기존 Ruby와 함께 작동합니다:

```
app/
├── models/
│   ├── user.rb           # user.trb에서 컴파일됨
│   ├── post.rb           # post.trb에서 컴파일됨
│   └── comment.rb        # 원본 Ruby
```

## 마이그레이션 중 테스트

### 두 버전 모두 테스트

테스트는 Ruby로 유지하고, 컴파일된 코드에 대해 실행:

```
test/
├── user_test.rb
├── post_test.rb
└── comment_test.rb

# 테스트는 build/에 대해 실행
ruby -Itest -Ibuild test/user_test.rb
```

### 테스트 전 타입 검사

```bash
# 먼저 타입 검사
trc check src/

# 통과하면 컴파일 및 테스트
trc compile src/
bundle exec rake test
```

### CI 설정

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

## 마이그레이션 체크리스트

### 1단계: 설정
- [ ] T-Ruby 설치
- [ ] `trc.yaml` 설정 생성
- [ ] 감시 모드 설정
- [ ] 타입 검사를 위한 CI 설정

### 2단계: 초기 마이그레이션
- [ ] 시작 파일 식별 (데이터 모델, 유틸리티)
- [ ] `.rb`를 `.trb`로 이름 변경
- [ ] 기본 타입 어노테이션 추가
- [ ] 컴파일하고 오류 수정
- [ ] 테스트 실행

### 3단계: 확장
- [ ] 관련 파일 마이그레이션
- [ ] 더 엄격한 타입 검사 추가
- [ ] RBS 파일 생성
- [ ] Steep 설정 (선택적)
- [ ] Ruby LSP 설정

### 4단계: 완료
- [ ] 나머지 파일 마이그레이션
- [ ] strict 모드 활성화
- [ ] 타입 규칙 문서화
- [ ] 팀 T-Ruby 교육

## 성공적인 마이그레이션을 위한 팁

### 1. 작게 시작

모든 것을 한 번에 마이그레이션하려고 하지 마세요. 다음으로 시작:
- 하나의 파일
- 하나의 모듈
- 하나의 기능

### 2. 가치에 집중

타입이 가장 큰 가치를 제공하는 코드 마이그레이션:
- 공개 API
- 복잡한 비즈니스 로직
- 데이터 모델
- 자주 수정되는 코드

### 3. 타입 별칭 사용

복잡한 타입을 읽기 쉽게:

```trb
type UserId = Integer
type UserAttributes = Hash<String, String | Integer | Bool>
type UserList = Array<User>
```

### 4. 패턴 문서화

팀을 위한 스타일 가이드 생성:

```markdown
# T-Ruby 스타일 가이드

## 명명
- 타입에 PascalCase 사용: `UserId`, `UserData`
- 공개 메서드에 명시적 타입 사용
- private 메서드는 타입 생략 가능

## 패턴
- hash보다 구조화된 클래스 선호
- 암묵적 nil 대신 `String | nil` 사용
- 모든 공개 메서드에 반환 타입 추가
```

### 5. 도구 활용

- **감시 모드** - 저장 시 자동 컴파일
- **Ruby LSP** - IDE 지원
- **Steep** - 추가 검증

### 6. 실용적으로

모든 것에 전체 타입이 필요하지 않습니다:
- 진정으로 동적인 코드에 `Any` 사용
- 메타프로그래밍은 `.rb` 파일로 유지
- 공개 인터페이스에 집중

## 롤백 전략

마이그레이션이 작동하지 않으면:

### 원본 파일 유지

```bash
# 이름 변경 전
cp user.rb user.rb.bak

# 문제가 있으면 복원
mv user.rb.bak user.rb
```

### Git 브랜치 사용

```bash
git checkout -b migrate-user-model
# 변경 수행
# 작동하면:
git checkout main
git merge migrate-user-model
# 아니면:
git checkout main
git branch -D migrate-user-model
```

### 점진적 커밋

각 파일 마이그레이션을 별도로 커밋:

```bash
git add user.trb
git commit -m "Migrate User model to T-Ruby"

# 문제가 생기면 쉽게 되돌리기:
git revert HEAD
```

## 실제 예제

간단한 Rails 모델의 완전한 마이그레이션:

**이전** (`app/models/article.rb`):

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

**이후** (`app/models/article.trb`):

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

## 다음 단계

마이그레이션 후:

1. **더 엄격한 검사 활성화** - 점진적으로 타입 안전성 증가
2. **Steep 설정** - 추가 타입 검증
3. **Ruby LSP 설정** - 더 나은 IDE 지원
4. **패턴 문서화** - 팀 가이드라인 생성
5. **마이그레이션 계속** - 더 많은 파일로 확장

## 리소스

- [타입 어노테이션 가이드](/docs/learn/basics/type-annotations)
- [설정 참조](/docs/cli/configuration)
- [RBS 통합](/docs/tooling/rbs-integration)
- [Steep 사용하기](/docs/tooling/steep)
