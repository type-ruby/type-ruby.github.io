---
sidebar_position: 2
title: 배열과 해시
description: Array와 Hash 타입 다루기
---

<DocsBadge />


# 배열과 해시

배열과 해시는 T-Ruby에서 가장 일반적으로 사용되는 컬렉션 타입입니다. 여러 값을 구조화된 방식으로 저장하고 구성할 수 있게 해줍니다. 이 장에서는 제네릭 타입 매개변수를 사용하여 타입 안전한 컬렉션을 만드는 방법을 배웁니다.

## Array 타입

T-Ruby의 배열은 축약 구문 `T[]`를 사용합니다. 여기서 `T`는 배열의 요소 타입입니다. 제네릭 구문 `Array<T>`도 사용 가능합니다.

### 기본 Array 구문

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={25} />

```trb title="array_basics.trb"
# 정수 배열
numbers: Integer[] = [1, 2, 3, 4, 5]

# 문자열 배열
names: String[] = ["Alice", "Bob", "Charlie"]

# 실수 배열
prices: Float[] = [9.99, 14.99, 19.99]

# 빈 배열 (타입 어노테이션 필요)
items: String[] = []
```

### 배열의 타입 추론

값으로 초기화할 때 T-Ruby는 배열 타입을 추론할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={36} />

```trb title="array_inference.trb"
# Array<Integer>로 추론됨
numbers = [1, 2, 3, 4, 5]

# Array<String>으로 추론됨
names = ["Alice", "Bob", "Charlie"]

# 빈 배열은 타입 어노테이션을 제공해야 함
items: String[] = []
```

### 배열 연산

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={47} />

```trb title="array_operations.trb"
def add_item(items: String[], item: String): String[]
  items << item
  items
end

def get_first(items: String[]): String | nil
  items.first
end

def get_last(items: Integer[]): Integer | nil
  items.last
end

def array_length(items: String[]): Integer
  items.length
end

# 사용법
list: String[] = ["apple", "banana"]
updated = add_item(list, "cherry")  # ["apple", "banana", "cherry"]

first: String | nil = get_first(list)  # "apple"
count: Integer = array_length(list)  # 3
```

### 배열 요소 접근

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={58} />

```trb title="array_access.trb"
def get_at_index(items: String[], index: Integer): String | nil
  items[index]
end

def get_slice(items: Integer[], start: Integer, length: Integer): Integer[]
  items[start, length]
end

def get_range(items: String[], range: Range): String[]
  items[range]
end

fruits: String[] = ["apple", "banana", "cherry", "date"]

item: String | nil = get_at_index(fruits, 0)  # "apple"
slice: Integer[] = get_slice([1, 2, 3, 4, 5], 1, 3)  # [2, 3, 4]
subset: String[] = get_range(fruits, 1..2)  # ["banana", "cherry"]
```

### 배열 반복

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={69} />

```trb title="array_iteration.trb"
def sum_numbers(numbers: Integer[]): Integer
  total = 0
  numbers.each do |n|
    total += n
  end
  total
end

def double_values(numbers: Integer[]): Integer[]
  numbers.map { |n| n * 2 }
end

def filter_positive(numbers: Integer[]): Integer[]
  numbers.select { |n| n > 0 }
end

def find_first_even(numbers: Integer[]): Integer | nil
  numbers.find { |n| n % 2 == 0 }
end

total: Integer = sum_numbers([1, 2, 3, 4, 5])  # 15
doubled: Integer[] = double_values([1, 2, 3])  # [2, 4, 6]
positive: Integer[] = filter_positive([-1, 2, -3, 4])  # [2, 4]
even: Integer | nil = find_first_even([1, 3, 4, 5])  # 4
```

### 배열 변환 메서드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={80} />

```trb title="array_transform.trb"
def join_strings(items: String[], separator: String): String
  items.join(separator)
end

def reverse_array(items: Integer[]): Integer[]
  items.reverse
end

def sort_numbers(numbers: Integer[]): Integer[]
  numbers.sort
end

def unique_items(items: String[]): String[]
  items.uniq
end

joined: String = join_strings(["a", "b", "c"], "-")  # "a-b-c"
reversed: Integer[] = reverse_array([1, 2, 3])  # [3, 2, 1]
sorted: Integer[] = sort_numbers([3, 1, 4, 2])  # [1, 2, 3, 4]
unique: String[] = unique_items(["a", "b", "a", "c"])  # ["a", "b", "c"]
```

### 중첩 배열

배열은 다른 배열을 포함할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={91} />

```trb title="nested_arrays.trb"
# 2D 배열 (배열의 배열)
def create_grid(rows: Integer, cols: Integer): Integer[][]
  grid: Integer[][] = []

  rows.times do |r|
    row: Integer[] = []
    cols.times do |c|
      row << (r * cols + c)
    end
    grid << row
  end

  grid
end

def get_cell(grid: Integer[][], row: Integer, col: Integer): Integer | nil
  return nil if grid[row].nil?
  grid[row][col]
end

matrix: Integer[][] = create_grid(3, 3)
# [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

value = get_cell(matrix, 1, 1)  # 4
```

## Hash 타입

T-Ruby의 해시는 제네릭 타입 구문을 사용합니다: `Hash<K, V>`, 여기서 `K`는 키 타입이고 `V`는 값 타입입니다.

### 기본 Hash 구문

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={102} />

```trb title="hash_basics.trb"
# Symbol 키와 String 값을 가진 해시
user: Hash<Symbol, String> = {
  name: "Alice",
  email: "alice@example.com"
}

# String 키와 Integer 값을 가진 해시
scores: Hash<String, Integer> = {
  "math" => 95,
  "science" => 88,
  "english" => 92
}

# Integer 키와 String 값을 가진 해시
id_map: Hash<Integer, String> = {
  1 => "Alice",
  2 => "Bob",
  3 => "Charlie"
}

# 빈 해시 (타입 어노테이션 필요)
config: Hash<Symbol, String> = {}
```

### 해시의 타입 추론

T-Ruby는 해시 내용에서 타입을 추론할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={113} />

```trb title="hash_inference.trb"
# Hash<Symbol, String>으로 추론됨
user = {
  name: "Alice",
  role: "admin"
}

# Hash<String, Integer>로 추론됨
scores = {
  "alice" => 100,
  "bob" => 95
}

# 빈 해시는 타입 어노테이션을 제공해야 함
config: Hash<Symbol, String> = {}
```

### 해시 연산

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={124} />

```trb title="hash_operations.trb"
def get_value(hash: Hash<Symbol, String>, key: Symbol): String | nil
  hash[key]
end

def set_value(hash: Hash<Symbol, Integer>, key: Symbol, value: Integer)
  hash[key] = value
end

def has_key(hash: Hash<String, Integer>, key: String): Boolean
  hash.key?(key)
end

def hash_size(hash: Hash<Symbol, String>): Integer
  hash.size
end

# 사용법
config: Hash<Symbol, String> = { mode: "production", version: "1.0" }

value: String | nil = get_value(config, :mode)  # "production"
exists: Boolean = has_key({ "a" => 1 }, "a")  # true
count: Integer = hash_size(config)  # 2
```

### 해시 반복

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={135} />

```trb title="hash_iteration.trb"
def print_hash(hash: Hash<Symbol, String>)
  hash.each do |key, value|
    puts "#{key}: #{value}"
  end
end

def get_keys(hash: Hash<String, Integer>): String[]
  hash.keys
end

def get_values(hash: Hash<Symbol, Integer>): Integer[]
  hash.values
end

def transform_values(hash: Hash<Symbol, Integer>): Hash<Symbol, Integer>
  hash.transform_values { |v| v * 2 }
end

scores: Hash<String, Integer> = { "alice" => 95, "bob" => 88 }

keys: String[] = get_keys(scores)  # ["alice", "bob"]
values: Integer[] = get_values({ a: 1, b: 2 })  # [1, 2]

doubled: Hash<Symbol, Integer> = transform_values({ a: 5, b: 10 })
# { a: 10, b: 20 }
```

### 해시 변환 메서드

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={146} />

```trb title="hash_transform.trb"
def merge_hashes(
  hash1: Hash<Symbol, String>,
  hash2: Hash<Symbol, String>
): Hash<Symbol, String>
  hash1.merge(hash2)
end

def select_entries(
  hash: Hash<String, Integer>,
  threshold: Integer
): Hash<String, Integer>
  hash.select { |k, v| v >= threshold }
end

def invert_hash(hash: Hash<String, Integer>): Hash<Integer, String>
  hash.invert
end

h1: Hash<Symbol, String> = { a: "1", b: "2" }
h2: Hash<Symbol, String> = { b: "3", c: "4" }

merged: Hash<Symbol, String> = merge_hashes(h1, h2)
# { a: "1", b: "3", c: "4" }

scores: Hash<String, Integer> = { "alice" => 95, "bob" => 85, "charlie" => 90 }
high_scores: Hash<String, Integer> = select_entries(scores, 90)
# { "alice" => 95, "charlie" => 90 }

inverted: Hash<Integer, String> = invert_hash({ "a" => 1, "b" => 2 })
# { 1 => "a", 2 => "b" }
```

### 중첩 해시

해시는 다른 해시를 포함할 수 있습니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={157} />

```trb title="nested_hashes.trb"
# 해시를 포함하는 해시
def create_user(
  name: String,
  age: Integer,
  email: String
): Hash<Symbol, String | Integer | Hash<Symbol, String>>
  {
    name: name,
    age: age,
    contact: {
      email: email,
      phone: "555-0100"
    }
  }
end

def get_nested_value(
  data: Hash<Symbol, String | Hash<Symbol, String>>,
  outer_key: Symbol,
  inner_key: Symbol
): String | nil
  outer = data[outer_key]
  if outer.is_a?(Hash)
    outer[inner_key]
  else
    nil
  end
end

user = create_user("Alice", 30, "alice@example.com")
# {
#   name: "Alice",
#   age: 30,
#   contact: { email: "alice@example.com", phone: "555-0100" }
# }
```

## 컬렉션에서 Union 타입 사용하기

컬렉션은 union 타입을 사용하여 여러 타입을 담을 수 있습니다:

### Union 타입을 가진 배열

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={168} />

```trb title="array_unions.trb"
# 문자열 또는 정수를 포함할 수 있는 배열
def create_mixed_array(): (String | Integer)[]
  ["alice", 42, "bob", 100]
end

def sum_numbers_from_mixed(items: (String | Integer)[]): Integer
  total = 0

  items.each do |item|
    if item.is_a?(Integer)
      total += item
    end
  end

  total
end

mixed: (String | Integer)[] = create_mixed_array()
sum: Integer = sum_numbers_from_mixed(mixed)  # 142
```

### Union 타입을 가진 해시

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={179} />

```trb title="hash_unions.trb"
# 혼합 값 타입을 가진 해시
def create_config(): Hash<Symbol, String | Integer | Boolean>
  {
    host: "localhost",
    port: 3000,
    ssl: true,
    timeout: 30
  }
end

def get_config_value(
  config: Hash<Symbol, String | Integer | Boolean>,
  key: Symbol
): String | Integer | Boolean | nil
  config[key]
end

def get_port(config: Hash<Symbol, String | Integer | Boolean>): Integer | nil
  port = config[:port]
  if port.is_a?(Integer)
    port
  else
    nil
  end
end

config = create_config()
port: Integer | nil = get_port(config)  # 3000
```

## 실용적 예제: 데이터 처리

배열과 해시를 결합한 종합적인 예제입니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={190} />

```trb title="data_processing.trb"
class DataProcessor
  def initialize()
    @records: Hash<Symbol, String | Integer>[] = []
  end

  def add_record(name: String, age: Integer, score: Integer)
    record: Hash<Symbol, String | Integer> = {
      name: name,
      age: age,
      score: score
    }
    @records << record
  end

  def get_all_names(): String[]
    names: String[] = []

    @records.each do |record|
      name = record[:name]
      if name.is_a?(String)
        names << name
      end
    end

    names
  end

  def get_average_score(): Float
    return 0.0 if @records.empty?

    total = 0

    @records.each do |record|
      score = record[:score]
      if score.is_a?(Integer)
        total += score
      end
    end

    total.to_f / @records.length
  end

  def get_top_scorers(threshold: Integer): String[]
    top_scorers: String[] = []

    @records.each do |record|
      score = record[:score]
      name = record[:name]

      if score.is_a?(Integer) && name.is_a?(String) && score >= threshold
        top_scorers << name
      end
    end

    top_scorers
  end

  def group_by_age(): Hash<Integer, String[]>
    groups: Hash<Integer, String[]> = {}

    @records.each do |record|
      age = record[:age]
      name = record[:name]

      if age.is_a?(Integer) && name.is_a?(String)
        if groups[age].nil?
          groups[age] = []
        end
        groups[age] << name
      end
    end

    groups
  end

  def get_statistics(): Hash<Symbol, Float | Integer>
    count = @records.length
    avg = get_average_score()

    max_score = 0
    @records.each do |record|
      score = record[:score]
      if score.is_a?(Integer) && score > max_score
        max_score = score
      end
    end

    {
      count: count,
      average: avg,
      max: max_score
    }
  end
end

# 사용법
processor = DataProcessor.new()

processor.add_record("Alice", 25, 95)
processor.add_record("Bob", 30, 88)
processor.add_record("Charlie", 25, 92)

names: String[] = processor.get_all_names()
# ["Alice", "Bob", "Charlie"]

avg: Float = processor.get_average_score()
# 91.67

top: String[] = processor.get_top_scorers(90)
# ["Alice", "Charlie"]

by_age: Hash<Integer, String[]> = processor.group_by_age()
# { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

stats: Hash<Symbol, Float | Integer> = processor.get_statistics()
# { count: 3, average: 91.67, max: 95 }
```

## 일반적인 패턴

### 동적으로 배열 만들기

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={201} />

```trb title="array_building.trb"
def build_range(start: Integer, stop: Integer): Integer[]
  result: Integer[] = []

  i = start
  while i <= stop
    result << i
    i += 1
  end

  result
end

def filter_and_transform(
  numbers: Integer[],
  threshold: Integer
): String[]
  result: String[] = []

  numbers.each do |n|
    if n > threshold
      result << "High: #{n}"
    end
  end

  result
end

range: Integer[] = build_range(1, 5)  # [1, 2, 3, 4, 5]
filtered: String[] = filter_and_transform([10, 5, 20, 3], 8)
# ["High: 10", "High: 20"]
```

### 동적으로 해시 만들기

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={212} />

```trb title="hash_building.trb"
def count_occurrences(words: String[]): Hash<String, Integer>
  counts: Hash<String, Integer> = {}

  words.each do |word|
    current = counts[word]
    if current.nil?
      counts[word] = 1
    else
      counts[word] = current + 1
    end
  end

  counts
end

def index_by_property(
  items: Hash<Symbol, String>[],
  key: Symbol
): Hash<String, Hash<Symbol, String>>
  index: Hash<String, Hash<Symbol, String>> = {}

  items.each do |item|
    key_value = item[key]
    if key_value.is_a?(String)
      index[key_value] = item
    end
  end

  index
end

words: String[] = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts: Hash<String, Integer> = count_occurrences(words)
# { "apple" => 3, "banana" => 2, "cherry" => 1 }
```

## 일반적인 함정

### 빈 컬렉션은 타입 어노테이션이 필요

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={223} />

```trb title="empty_collections.trb"
# 이것은 작동하지 않음 - 타입을 추론할 수 없음
# items = []  # 오류!

# 항상 빈 컬렉션에 어노테이션 추가
items: String[] = []
config: Hash<Symbol, Integer> = {}
```

### 컬렉션 변경

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={234} />

```trb title="mutation.trb"
def add_item_wrong(items: String[]): String[]
  # 이것은 원본 배열을 변경함
  items << "new"
  items
end

def add_item_safe(items: String[]): String[]
  # 먼저 복사본 생성
  new_items = items.dup
  new_items << "new"
  new_items
end

original: String[] = ["a", "b"]
result1 = add_item_wrong(original)
# original이 이제 ["a", "b", "new"]!

original2: String[] = ["a", "b"]
result2 = add_item_safe(original2)
# original2는 여전히 ["a", "b"]
```

### 해시 키 타입 주의

<ExampleBadge status="pass" testFile="spec/docs_site/pages/learn/everyday_types/arrays_and_hashes_spec.rb" line={245} />

```trb title="hash_keys.trb"
# Symbol 키와 String 키는 다름!
def demonstrate_key_types()
  hash: Hash<Symbol | String, Integer> = {}

  hash[:name] = 1  # Symbol 키
  hash["name"] = 2  # String 키

  # 이것은 다른 항목!
  hash[:name]  # 1 반환
  hash["name"]  # 2 반환
end
```

## 요약

배열과 해시는 T-Ruby의 필수 컬렉션 타입입니다:

- **배열**은 동종 컬렉션에 `T[]` 축약 구문 사용 (또는 `Array<T>`)
- **해시**는 키-값 쌍에 `Hash<K, V>` 구문 사용
- **타입 추론**은 비어있지 않은 컬렉션에서 작동
- **빈 컬렉션**은 항상 타입 어노테이션 필요
- **Union 타입**으로 혼합 타입 컬렉션 허용
- **중첩 구조**는 복잡한 데이터를 위해 배열과 해시 결합

이러한 컬렉션 타입을 이해하는 것은 T-Ruby 애플리케이션에서 데이터를 구성하는 데 중요합니다. 다음 장에서는 union 타입에 대해 더 자세히 배웁니다.
