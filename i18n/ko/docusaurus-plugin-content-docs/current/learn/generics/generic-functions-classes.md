---
sidebar_position: 1
title: 제네릭 함수와 클래스
description: 제네릭으로 재사용 가능한 코드 만들기
---

<DocsBadge />


# 제네릭 함수와 클래스

제네릭은 T-Ruby의 가장 강력한 기능 중 하나로, 타입 안전성을 유지하면서 여러 타입과 작동하는 코드를 작성할 수 있게 해줍니다. 제네릭을 "타입 변수"로 생각하세요—코드가 사용될 때 구체적인 타입으로 채워지는 플레이스홀더입니다.

## 왜 제네릭인가?

제네릭 없이는 같은 함수를 다른 타입에 대해 여러 번 작성하거나, `Any`를 사용하여 타입 안전성을 잃어야 합니다. 제네릭을 사용하면 한 번만 코드를 작성하고 다른 타입으로 재사용할 수 있습니다.

### 문제: 제네릭 없이

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={25} />

```trb
# 제네릭 없이는 각 타입에 대해 별도의 함수가 필요
def first_string(arr: Array<String>): String | nil
  arr[0]
end

def first_integer(arr: Array<Integer>): Integer | nil
  arr[0]
end

def first_user(arr: Array<User>): User | nil
  arr[0]
end

# 또는 타입 안전성을 잃음
def first(arr: Array<Any>): Any
  arr[0]  # 반환 타입이 Any - 타입 안전성 없음!
end
```

### 해결책: 제네릭으로

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={36} />

```trb
# 모든 타입에 작동하는 하나의 함수
def first<T>(arr: Array<T>): T | nil
  arr[0]
end

# TypeScript 스타일 추론이 자동으로 작동
names = ["Alice", "Bob", "Charlie"]
result = first(names)  # result는 String | nil

numbers = [1, 2, 3]
value = first(numbers)  # value는 Integer | nil
```

## 제네릭 함수

제네릭 함수는 꺾쇠 괄호(`<T>`)의 타입 매개변수를 사용하여 함수가 호출될 때 결정될 타입을 나타냅니다.

### 기본 제네릭 함수

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={47} />

```trb
# 간단한 제네릭 함수
def identity<T>(value: T): T
  value
end

# 모든 타입과 작동
str = identity("hello")      # String
num = identity(42)           # Integer
arr = identity([1, 2, 3])    # Array<Integer>
```

### 다중 타입 매개변수

필요할 때 여러 타입 매개변수를 사용할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={58} />

```trb
# 두 개의 타입 매개변수를 가진 함수
def pair<K, V>(key: K, value: V): Hash<K, V>
  { key => value }
end

# 두 매개변수 모두에 대해 타입 추론이 작동
result = pair("name", "Alice")     # Hash<String, String>
data = pair(:id, 123)              # Hash<Symbol, Integer>
mixed = pair("count", 42)          # Hash<String, Integer>
```

### 배열과 함께하는 제네릭 함수

일반적인 사용 사례는 모든 타입의 배열과 작업하는 것입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={69} />

```trb
# 배열의 마지막 요소 가져오기
def last<T>(arr: Array<T>): T | nil
  arr[-1]
end

# 배열 뒤집기
def reverse<T>(arr: Array<T>): Array<T>
  arr.reverse
end

# 조건부로 배열 필터링
def filter<T>(arr: Array<T>, &block: Proc<T, Boolean>): Array<T>
  arr.select { |item| block.call(item) }
end

# 사용법
numbers = [1, 2, 3, 4, 5]
evens = filter(numbers) { |n| n.even? }  # Array<Integer>

words = ["hello", "world", "foo", "bar"]
long_words = filter(words) { |w| w.length > 3 }  # Array<String>
```

### 반환 타입 변환이 있는 제네릭 함수

때로는 반환 타입이 입력 타입과 다르지만 여전히 제네릭입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={80} />

```trb
# 타입 T를 타입 U로 변환하는 map 함수
def map<T, U>(arr: Array<T>, &block: Proc<T, U>): Array<U>
  arr.map { |item| block.call(item) }
end

# 정수를 문자열로 변환
numbers = [1, 2, 3]
strings = map(numbers) { |n| n.to_s }  # Array<String>

# 문자열을 길이로 변환
words = ["hello", "world"]
lengths = map(words) { |w| w.length }  # Array<Integer>
```

## 제네릭 클래스

제네릭 클래스를 사용하면 클래스 전체에서 타입 안전성을 유지하면서 모든 타입과 작동하는 데이터 구조를 만들 수 있습니다.

### 기본 제네릭 클래스

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={91} />

```trb
# 간단한 제네릭 컨테이너
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end

  def set(value: T): void
    @value = value
  end
end

# 다른 타입으로 박스 생성
string_box = Box<String>.new("hello")
puts string_box.get  # "hello"

number_box = Box<Integer>.new(42)
puts number_box.get  # 42

# 타입 안전성이 강제됨
string_box.set("world")  # OK
string_box.set(123)      # 에러: 타입 불일치
```

### 타입 추론이 있는 제네릭 클래스

T-Ruby는 종종 생성자에서 타입 매개변수를 추론할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={102} />

```trb
class Container<T>
  @item: T

  def initialize(item: T): void
    @item = item
  end

  def item: T
    @item
  end

  def update(new_item: T): void
    @item = new_item
  end
end

# 생성자 인자에서 타입 추론
container1 = Container.new("hello")  # Container<String>
container2 = Container.new(42)       # Container<Integer>

# 또는 명시적으로 타입 지정
container3 = Container<Boolean>.new(true)
```

### 제네릭 스택 예제

제네릭 스택 데이터 구조의 실용적인 예제:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={113} />

```trb
class Stack<T>
  @items: Array<T>

  def initialize: void
    @items = []
  end

  def push(item: T): void
    @items.push(item)
  end

  def pop: T | nil
    @items.pop
  end

  def peek: T | nil
    @items.last
  end

  def empty?: Boolean
    @items.empty?
  end

  def size: Integer
    @items.length
  end

  def to_a: Array<T>
    @items.dup
  end
end

# 문자열과 함께 사용
string_stack = Stack<String>.new
string_stack.push("first")
string_stack.push("second")
string_stack.push("third")
puts string_stack.pop  # "third"
puts string_stack.size # 2

# 정수와 함께 사용
int_stack = Stack<Integer>.new
int_stack.push(1)
int_stack.push(2)
int_stack.push(3)
puts int_stack.peek  # 3 (제거하지 않음)
puts int_stack.size  # 3
```

### 다중 타입 매개변수를 가진 제네릭 클래스

제네릭 클래스는 여러 타입 매개변수를 가질 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={124} />

```trb
class Pair<K, V>
  @key: K
  @value: V

  def initialize(key: K, value: V): void
    @key = key
    @value = value
  end

  def key: K
    @key
  end

  def value: V
    @value
  end

  def swap: Pair<V, K>
    Pair.new(@value, @key)
  end

  def to_s: String
    "#{@key} => #{@value}"
  end
end

# 다른 타입 조합으로 쌍 생성
name_age = Pair.new("Alice", 30)     # Pair<String, Integer>
id_name = Pair.new(123, "Bob")       # Pair<Integer, String>
coords = Pair.new(10.5, 20.3)        # Pair<Float, Float>

# swap은 타입이 뒤바뀐 새 쌍을 생성
swapped = name_age.swap              # Pair<Integer, String>
```

### 제네릭 컬렉션 클래스

커스텀 컬렉션을 보여주는 더 복잡한 예제:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={135} />

```trb
class Collection<T>
  @items: Array<T>

  def initialize(items: Array<T> = []): void
    @items = items.dup
  end

  def add(item: T): void
    @items.push(item)
  end

  def remove(item: T): Boolean
    if index = @items.index(item)
      @items.delete_at(index)
      true
    else
      false
    end
  end

  def contains?(item: T): Boolean
    @items.include?(item)
  end

  def first: T | nil
    @items.first
  end

  def last: T | nil
    @items.last
  end

  def map<U>(&block: Proc<T, U>): Collection<U>
    Collection<U>.new(@items.map { |item| block.call(item) })
  end

  def filter(&block: Proc<T, Boolean>): Collection<T>
    Collection.new(@items.select { |item| block.call(item) })
  end

  def each(&block: Proc<T, void>): void
    @items.each { |item| block.call(item) }
  end

  def to_a: Array<T>
    @items.dup
  end

  def size: Integer
    @items.length
  end
end

# 사용법
numbers = Collection<Integer>.new([1, 2, 3, 4, 5])
numbers.add(6)

# map은 컬렉션을 새 타입으로 변환
strings = numbers.map { |n| n.to_s }  # Collection<String>

# filter는 같은 타입 유지
evens = numbers.filter { |n| n.even? }  # Collection<Integer>

# 항목 순회
numbers.each { |n| puts n }
```

## 비제네릭 클래스의 제네릭 메서드

자체적으로 제네릭이 아닌 클래스에서도 제네릭 메서드를 가질 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={146} />

```trb
class Utils
  # 비제네릭 클래스의 제네릭 메서드
  def self.wrap<T>(value: T): Array<T>
    [value]
  end

  def self.duplicate<T>(value: T, times: Integer): Array<T>
    Array.new(times, value)
  end

  def self.zip<T, U>(arr1: Array<T>, arr2: Array<U>): Array<Pair<T, U>>
    arr1.zip(arr2).map { |t, u| Pair.new(t, u) }
  end
end

# 사용법
wrapped = Utils.wrap(42)                    # Array<Integer>
duplicates = Utils.duplicate("hello", 3)    # Array<String>
zipped = Utils.zip([1, 2], ["a", "b"])      # Array<Pair<Integer, String>>
```

## 중첩 제네릭

제네릭을 중첩하여 복잡한 타입 구조를 만들 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={157} />

```trb
# 각 키에 대해 값 배열을 저장하는 캐시
class Cache<K, V>
  @store: Hash<K, Array<V>>

  def initialize: void
    @store = {}
  end

  def add(key: K, value: V): void
    @store[key] ||= []
    @store[key].push(value)
  end

  def get(key: K): Array<V>
    @store[key] || []
  end

  def has_key?(key: K): Boolean
    @store.key?(key)
  end
end

# 사용법
user_tags = Cache<Integer, String>.new  # Cache<Integer, String>
user_tags.add(1, "ruby")
user_tags.add(1, "programming")
user_tags.add(2, "design")

tags = user_tags.get(1)  # Array<String> = ["ruby", "programming"]
```

## 모범 사례

### 1. 설명적인 타입 매개변수 이름 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={168} />

```trb
# 좋음: 도메인별 타입에 설명적 이름
class Repository<Entity, Id>
  def find(id: Id): Entity | nil
    # ...
  end
end

# 괜찮음: 제네릭 컬렉션에 대한 표준 규칙
class List<T>
  # ...
end

# 피하기: 복잡한 시나리오에서 설명 없는 단일 문자
class Processor<A, B, C, D>  # 너무 암호적
  # ...
end
```

### 2. 제네릭 함수를 단순하게 유지

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={179} />

```trb
# 좋음: 간단하고 집중된 제네릭 함수
def head<T>(arr: Array<T>): T | nil
  arr.first
end

# 덜 좋음: 너무 많은 책임
def process<T>(arr: Array<T>, flag: Boolean, count: Integer): Array<T> | Hash<Integer, T>
  # 너무 복잡함, 제네릭 동작을 이해하기 어려움
end
```

### 3. 가능하면 타입 추론 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={190} />

```trb
# T-Ruby가 인자에서 타입 추론하도록 함
container = Container.new("hello")  # Container<String> 추론됨

# 필요할 때만 타입 지정
container = Container<String | Integer>.new("hello")
```

## 공통 패턴

### Option/Maybe 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={201} />

```trb
class Option<T>
  @value: T | nil

  def initialize(value: T | nil): void
    @value = value
  end

  def is_some?: Boolean
    !@value.nil?
  end

  def is_none?: Boolean
    @value.nil?
  end

  def unwrap: T
    raise "Called unwrap on None" if @value.nil?
    @value
  end

  def unwrap_or(default: T): T
    @value || default
  end

  def map<U>(&block: Proc<T, U>): Option<U>
    if @value
      Option.new(block.call(@value))
    else
      Option<U>.new(nil)
    end
  end
end

# 사용법
some = Option.new(42)
none = Option<Integer>.new(nil)

puts some.unwrap_or(0)  # 42
puts none.unwrap_or(0)  # 0

result = some.map { |n| n * 2 }  # Option<Integer> 값 84
```

### Result 타입

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/generics/generic_functions_classes_spec.rb" line={212} />

```trb
class Result<T, E>
  @value: T | nil
  @error: E | nil

  def self.ok(value: T): Result<T, E>
    result = Result<T, E>.new
    result.instance_variable_set(:@value, value)
    result
  end

  def self.err(error: E): Result<T, E>
    result = Result<T, E>.new
    result.instance_variable_set(:@error, error)
    result
  end

  def ok?: Boolean
    !@value.nil?
  end

  def err?: Boolean
    !@error.nil?
  end

  def unwrap: T
    raise "Called unwrap on Err: #{@error}" if @error
    @value
  end

  def unwrap_err: E
    raise "Called unwrap_err on Ok" if @value
    @error
  end
end

# 사용법
def divide(a: Integer, b: Integer): Result<Float, String>
  if b == 0
    Result.err("Division by zero")
  else
    Result.ok(a.to_f / b)
  end
end

result = divide(10, 2)
puts result.unwrap if result.ok?  # 5.0

result = divide(10, 0)
puts result.unwrap_err if result.err?  # "Division by zero"
```

## 다음 단계

이제 제네릭 함수와 클래스를 이해했으니:

- [제약 조건](/docs/learn/generics/constraints)을 배워 제네릭에 사용할 수 있는 타입 제한
- `Array<T>`와 `Hash<K, V>` 같은 [내장 제네릭](/docs/learn/generics/built-in-generics) 탐색
- 제네릭이 [인터페이스](/docs/learn/interfaces/defining-interfaces)와 어떻게 작동하는지 확인
