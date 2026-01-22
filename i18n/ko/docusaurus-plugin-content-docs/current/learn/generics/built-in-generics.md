---
sidebar_position: 3
title: 내장 제네릭
description: Array, Hash 및 기타 내장 제네릭 타입
---

<DocsBadge />


# 내장 제네릭

T-Ruby에는 매일 사용하게 될 여러 내장 제네릭 타입이 있습니다. 이러한 타입은 타입 안전성을 제공하면서 모든 타입과 작동하도록 매개변수화되어 있습니다. 이러한 내장 제네릭의 사용법을 이해하는 것은 타입 안전한 T-Ruby 코드를 작성하는 데 필수적입니다.

## T[]

가장 일반적으로 사용되는 제네릭 타입은 `T[]`로, 타입 `T` 요소의 배열을 나타냅니다.

### 기본 배열 사용법

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={25} />

```trb
# 명시적으로 타입이 지정된 배열
numbers: Integer[] = [1, 2, 3, 4, 5]
names: String[] = ["Alice", "Bob", "Charlie"]
flags: Boolean[] = [true, false, true]

# 타입 추론도 작동
inferred_numbers = [1, 2, 3]  # Integer[]
inferred_names = ["Alice", "Bob"]  # String[]

# 빈 배열은 명시적 타입이 필요
empty_numbers: Integer[] = []
empty_users: User[] = []
```

### 배열 연산

모든 표준 배열 연산은 타입 안전성을 유지합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={36} />

```trb
numbers: Integer[] = [1, 2, 3, 4, 5]

# 요소 접근
first: Integer | nil = numbers[0]      # 1
last: Integer | nil = numbers[-1]      # 5
out_of_bounds: Integer | nil = numbers[100]  # nil

# 요소 추가
numbers.push(6)        # Integer[]
numbers << 7           # Integer[]
numbers.unshift(0)     # Integer[]

# 요소 제거
popped: Integer | nil = numbers.pop      # 마지막 제거 및 반환
shifted: Integer | nil = numbers.shift   # 첫 번째 제거 및 반환

# 내용 확인
contains_three: Boolean = numbers.include?(3)  # true
index: Integer | nil = numbers.index(3)     # 2
```

### 배열 매핑 및 변환

매핑은 `T[]`를 `U[]`로 변환합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={47} />

```trb
# 정수를 문자열로 매핑
numbers: Integer[] = [1, 2, 3, 4, 5]
strings: String[] = numbers.map { |n| n.to_s }
# 결과: ["1", "2", "3", "4", "5"]

# 문자열을 길이로 매핑
words: String[] = ["hello", "world", "ruby"]
lengths: Integer[] = words.map { |w| w.length }
# 결과: [5, 5, 4]

# 복잡한 타입으로 매핑
class Person
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def name: String
    @name
  end
end

names: String[] = ["Alice", "Bob"]
people: Person[] = names.map { |name| Person.new(name, 25) }
```

### 배열 필터링

필터링은 같은 타입을 유지합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={58} />

```trb
numbers: Integer[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 짝수 필터링
evens: Integer[] = numbers.select { |n| n.even? }
# 결과: [2, 4, 6, 8, 10]

# 홀수 필터링
odds: Integer[] = numbers.reject { |n| n.even? }
# 결과: [1, 3, 5, 7, 9]

# 첫 번째 일치하는 요소 찾기
first_even: Integer | nil = numbers.find { |n| n.even? }
# 결과: 2

# 복잡한 조건으로 필터링
words: String[] = ["hello", "world", "hi", "ruby", "typescript"]
long_words: String[] = words.select { |w| w.length > 4 }
# 결과: ["hello", "world", "typescript"]
```

### 배열 축소

reduce는 배열을 단일 값으로 축소합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={69} />

```trb
numbers: Integer[] = [1, 2, 3, 4, 5]

# 모든 숫자 합계
sum: Integer = numbers.reduce(0) { |acc, n| acc + n }
# 결과: 15

# 최대값 찾기
max: Integer = numbers.reduce(numbers[0]) { |max, n| n > max ? n : max }
# 결과: 5

# 문자열 연결
words: String[] = ["Hello", "World", "from", "T-Ruby"]
sentence: String = words.reduce("") { |acc, w| acc.empty? ? w : "#{acc} #{w}" }
# 결과: "Hello World from T-Ruby"

# 배열에서 해시 빌드
pairs: String[][] = [["name", "Alice"], ["age", "30"]]
hash: Hash<String, String> = pairs.reduce({}) { |h, pair|
  h[pair[0]] = pair[1]
  h
}
```

### 중첩 배열

배열은 어떤 깊이로든 중첩될 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={80} />

```trb
# 2차원 배열 (행렬)
matrix: Integer[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]

# 중첩 요소 접근
first_row: Integer[] = matrix[0]      # [1, 2, 3]
element: Integer | nil = matrix[1][2]      # 6

# 3차원 배열
cube: Integer[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
]

# 중첩 배열 평탄화
nested: Integer[][] = [[1, 2], [3, 4], [5, 6]]
flat: Integer[] = nested.flatten
# 결과: [1, 2, 3, 4, 5, 6]
```

## Hash\<K, V\>

`Hash<K, V>`는 타입 `K`의 키와 타입 `V`의 값을 가진 해시 맵을 나타냅니다.

### 기본 해시 사용법

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={91} />

```trb
# 명시적으로 타입이 지정된 해시
ages: Hash<String, Integer> = {
  "Alice" => 30,
  "Bob" => 25,
  "Charlie" => 35
}

# 심볼 키
config: Hash<Symbol, String> = {
  database: "postgresql",
  host: "localhost",
  port: "5432"
}

# 타입 추론
inferred = { "key" => "value" }  # Hash<String, String>

# 빈 해시는 명시적 타입이 필요
empty_hash: Hash<String, Integer> = {}
empty_map = Hash<Symbol, String[]>.new
```

### 해시 연산

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={102} />

```trb
ages: Hash<String, Integer> = {
  "Alice" => 30,
  "Bob" => 25
}

# 값 접근
alice_age: Integer | nil = ages["Alice"]   # 30
missing: Integer | nil = ages["Charlie"]   # nil

# 값 추가/업데이트
ages["Charlie"] = 35
ages["Alice"] = 31  # 기존 값 업데이트

# 값 제거
removed: Integer | nil = ages.delete("Bob")  # 25 반환

# 키 확인
has_alice: Boolean = ages.key?("Alice")      # true
has_bob: Boolean = ages.key?("Bob")          # false (삭제됨)

# 키와 값 가져오기
keys: String[] = ages.keys           # ["Alice", "Charlie"]
values: Integer[] = ages.values      # [31, 35]
```

### 해시 반복

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={113} />

```trb
scores: Hash<String, Integer> = {
  "Alice" => 95,
  "Bob" => 87,
  "Charlie" => 92
}

# 키-값 쌍 반복
scores.each do |name, score|
  puts "#{name}: #{score}"
end

# 배열로 매핑
name_score_pairs: String[] = scores.map { |name, score|
  "#{name} scored #{score}"
}

# 해시 필터링
high_scores: Hash<String, Integer> = scores.select { |_, score| score >= 90 }
# 결과: { "Alice" => 95, "Charlie" => 92 }

# 값 변환
doubled: Hash<String, Integer> = scores.transform_values { |score| score * 2 }
# 결과: { "Alice" => 190, "Bob" => 174, "Charlie" => 184 }
```

### 복잡한 해시 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={124} />

```trb
# 배열 값을 가진 해시
tags: Hash<String, String[]> = {
  "ruby" => ["programming", "language"],
  "rails" => ["framework", "web"],
  "postgres" => ["database", "sql"]
}

# 배열 값에 추가
tags["ruby"].push("dynamic")

# 해시 값을 가진 해시 (중첩)
users: Hash<String, Hash<Symbol, String | Integer>> = {
  "user1" => { name: "Alice", age: 30, email: "alice@example.com" },
  "user2" => { name: "Bob", age: 25, email: "bob@example.com" }
}

# 중첩 값 접근
user1_name = users["user1"][:name]  # "Alice"

# 커스텀 타입을 가진 해시
class User
  @name: String
  @email: String

  def initialize(name: String, email: String): void
    @name = name
    @email = email
  end
end

user_map: Hash<Integer, User> = {
  1 => User.new("Alice", "alice@example.com"),
  2 => User.new("Bob", "bob@example.com")
}
```

## Set\<T\>

`Set<T>`는 타입 `T`의 고유 요소의 정렬되지 않은 컬렉션을 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={135} />

```trb
# 셋 생성
numbers: Set<Integer> = Set.new([1, 2, 3, 4, 5])
unique_words: Set<String> = Set.new(["hello", "world", "hello"])
# unique_words는 포함: {"hello", "world"}

# 요소 추가
numbers.add(6)
numbers.add(3)  # 이미 존재, 중복 없음

# 요소 제거
numbers.delete(2)

# 멤버십 확인
contains_three: Boolean = numbers.include?(3)  # true

# 셋 연산
set1: Set<Integer> = Set.new([1, 2, 3, 4])
set2: Set<Integer> = Set.new([3, 4, 5, 6])

union: Set<Integer> = set1 | set2           # {1, 2, 3, 4, 5, 6}
intersection: Set<Integer> = set1 & set2    # {3, 4}
difference: Set<Integer> = set1 - set2      # {1, 2}

# 배열로 변환
array: Integer[] = numbers.to_a
```

## Range\<T\>

`Range<T>`는 시작부터 끝까지의 값 범위를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={146} />

```trb
# 정수 범위
one_to_ten: Range<Integer> = 1..10      # 포함: 1, 2, ..., 10
one_to_nine: Range<Integer> = 1...10    # 제외: 1, 2, ..., 9

# 범위가 값을 포함하는지 확인
includes_five: Boolean = one_to_ten.include?(5)  # true

# 배열로 변환
numbers: Integer[] = (1..5).to_a   # [1, 2, 3, 4, 5]

# 범위 반복
(1..5).each do |i|
  puts i
end

# 문자 범위
alphabet: Range<String> = 'a'..'z'
letters: String[] = ('a'..'e').to_a  # ["a", "b", "c", "d", "e"]
```

## Proc\<Args, Return\>

`Proc<Args, Return>`은 타입이 지정된 매개변수와 반환 타입을 가진 proc/lambda를 나타냅니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={157} />

```trb
# 간단한 proc
doubler: Proc<Integer, Integer> = ->(x: Integer): Integer { x * 2 }
result = doubler.call(5)  # 10

# 다중 매개변수를 가진 Proc
adder: Proc<Integer, Integer, Integer> = ->(x: Integer, y: Integer): Integer { x + y }
sum = adder.call(3, 4)  # 7

# 반환 값이 없는 Proc
printer: Proc<String, void> = ->(msg: String): void { puts msg }
printer.call("Hello!")

# 매개변수로서의 Proc
def apply_twice<T>(value: T, fn: Proc<T, T>): T
  fn.call(fn.call(value))
end

result = apply_twice(5, doubler)  # 20 (5 * 2 * 2)

# Proc의 배열
operations: Proc<Integer, Integer>[] = [
  ->(x: Integer): Integer { x + 1 },
  ->(x: Integer): Integer { x * 2 },
  ->(x: Integer): Integer { x - 3 }
]

result = operations.reduce(10) { |acc, op| op.call(acc) }
# 10 + 1 = 11, 11 * 2 = 22, 22 - 3 = 19
```

## Nilable을 사용한 옵셔널 타입

엄격하게 제네릭은 아니지만, `T | nil`은 매우 자주 사용되어 언급할 가치가 있습니다. T-Ruby는 또한 `T?` 약칭을 지원합니다.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={168} />

```trb
# 명시적 옵셔널 타입
name: String | nil = "Alice"
age: Integer | nil = nil

# 약칭 문법
name: String? = "Alice"
age: Integer? = nil

# 옵셔널 배열 작업
numbers: Integer[]? = [1, 2, 3]
numbers = nil

# 옵셔널 요소의 배열
numbers: (Integer | nil)[] = [1, nil, 3, nil, 5]
numbers: Integer?[] = [1, nil, 3, nil, 5]  # 위와 동일

# 옵셔널 해시
config: Hash<String, String>? = { "key" => "value" }
config = nil

# 옵셔널 값을 가진 해시
settings: Hash<String, String | nil> = {
  "name" => "MyApp",
  "description" => nil
}
```

## 제네릭 타입 결합

제네릭 타입은 강력한 방식으로 결합할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={179} />

```trb
# 해시의 배열
users: Hash<Symbol, String | Integer>[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
]

# 배열의 해시
tags_by_category: Hash<String, String[]> = {
  "colors" => ["red", "blue", "green"],
  "sizes" => ["small", "medium", "large"]
}

# 배열의 배열 (행렬)
matrix: Integer[][] = [
  [1, 2, 3],
  [4, 5, 6]
]

# 복잡한 값을 가진 해시
cache: Hash<String, Hash<Symbol, String>[]> = {
  "users" => [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" }
  ]
}

# 옵셔널 값의 옵셔널 배열
data: (Integer | nil)[]? = [1, nil, 3]
data = nil
```

## 내장 제네릭을 위한 타입 별칭

복잡한 제네릭 타입을 위한 읽기 쉬운 별칭을 만듭니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={190} />

```trb
# 간단한 별칭
type StringArray = String[]
type IntHash = Hash<String, Integer>

# 복잡한 별칭
type UserData = Hash<Symbol, String | Integer>
type UserList = UserData[]
type TagMap = Hash<String, String[]>

# 별칭 사용
users: UserList = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
]

tags: TagMap = {
  "ruby" => ["language", "dynamic"],
  "typescript" => ["language", "static"]
}

# 제네릭 별칭
type Result<T> = T | nil
type Callback<T> = Proc<T, void>
type Transformer<T, U> = Proc<T, U>

# 제네릭 별칭 사용
find_user: Result<User> = User.find(1)
on_success: Callback<String> = ->(msg: String): void { puts msg }
to_string: Transformer<Integer, String> = ->(n: Integer): String { n.to_s }
```

## 모범 사례

### 1. Any보다 특정 타입 선호

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={201} />

```trb
# 좋음: 특정 타입
users: User[] = []
config: Hash<Symbol, String> = {}

# 피하기: Any 사용은 타입 안전성을 잃음
data: Any[] = []  # 타입 검사 없음
```

### 2. 복잡한 타입에 타입 별칭 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={212} />

```trb
# 좋음: 명확하고 재사용 가능한 별칭
type UserMap = Hash<Integer, User>
type ErrorList = String[]

def process_users(users: UserMap): ErrorList
  # ...
end

# 덜 좋음: 반복되는 복잡한 타입
def process_users(users: Hash<Integer, User>): String[]
  # ...
end
```

### 3. Nil 값을 명시적으로 처리

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={223} />

```trb
# 좋음: 명시적 nil 처리
users: User[] = []
first_user: User | nil = users.first

if first_user
  puts first_user.name
else
  puts "No users found"
end

# 위험: non-nil 가정
# first_user.name  # nil이면 크래시 가능!
```

### 4. 적절한 컬렉션 타입 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={234} />

```trb
# 좋음: 고유 항목에 Set 사용
unique_tags: Set<String> = Set.new

# 덜 효율적: 고유성을 위해 Array 사용
unique_tags: String[] = []
unique_tags.push(tag) unless unique_tags.include?(tag)
```

## 공통 패턴

### 안전한 배열 접근

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={245} />

```trb
def safe_get<T>(array: T[], index: Integer, default: T): T
  array.fetch(index, default)
end

numbers = [1, 2, 3]
value = safe_get(numbers, 10, 0)  # nil 대신 0 반환
```

### 해시로 그룹화

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={256} />

```trb
class Person
  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def age: Integer
    @age
  end
end

people: Person[] = [
  Person.new("Alice", 30),
  Person.new("Bob", 25),
  Person.new("Charlie", 30)
]

# 나이로 그룹화
by_age: Hash<Integer, Person[]> = people.group_by { |p| p.age }
# { 30 => [Alice, Charlie], 25 => [Bob] }
```

### 해시로 메모이제이션

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/built_in_generics_spec.rb" line={267} />

```trb
class Calculator
  @cache: Hash<Integer, Integer>

  def initialize: void
    @cache = {}
  end

  def expensive_calculation(n: Integer): Integer
    if @cache.key?(n)
      @cache[n]
    else
      result = n * n  # 비용이 큰 연산
      @cache[n] = result
      result
    end
  end
end
```

## 다음 단계

이제 T-Ruby의 내장 제네릭 타입을 이해했으니:

- [타입 별칭](/docs/learn/advanced/type-aliases)을 탐색하여 복잡한 타입을 위한 커스텀 이름 생성
- [유틸리티 타입](/docs/learn/advanced/utility-types)을 배워 고급 타입 변환
- [제네릭 함수와 클래스](/docs/learn/generics/generic-functions-classes)를 참조하여 자신만의 제네릭 타입 생성
