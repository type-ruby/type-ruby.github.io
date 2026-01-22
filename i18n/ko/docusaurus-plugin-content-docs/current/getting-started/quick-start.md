---
sidebar_position: 2
title: 빠른 시작
description: 첫 T-Ruby 프로그램 작성하기
---

<DocsBadge />


# 빠른 시작

5분 만에 T-Ruby의 기본을 배워봅시다!

## 프로젝트 초기화

프로젝트 루트에 `trbconfig.yml`을 생성하여 소스 및 출력 디렉토리를 설정합니다. `trc --init`으로 생성할 수 있습니다:

```bash
mkdir my-project && cd my-project
trc --init
```

다음 파일들이 생성됩니다:
- `trbconfig.yml` - [컴파일러 설정](/docs/cli/configuration)
- `src/` - .trb 파일을 위한 소스 디렉토리
- `build/` - 컴파일된 파일을 위한 출력 디렉토리

## 감시 모드 실행

감시 모드를 실행하면 파일 저장 시 자동으로 컴파일됩니다:

```bash
trc --watch
```

이 터미널은 열어둔 채로 다음 단계를 진행하세요.

## 첫 번째 T-Ruby 파일

새 터미널을 열고 `src/hello.trb` 파일을 만들어 봅시다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/quick_start_spec.rb" line={25} />

```trb title="src/hello.trb"
# 타입이 지정된 함수
def greet(name: String): String
  "안녕하세요, #{name}!"
end

# 변수 타입 주석
message: String = greet("세계")
puts message

# Union 타입
id: String | Integer = "user-123"

# 옵셔널 타입 (nil이 될 수 있음)
nickname: String? = nil
```

파일을 저장하면 감시 모드가 자동으로 컴파일합니다. `build/` 디렉토리에 두 개의 파일이 생성됩니다:
- `hello.rb` - 순수 Ruby 코드
- `hello.rbs` - RBS 타입 정의

## 실행하기

생성된 Ruby 파일을 실행합니다:

```bash
ruby build/hello.rb
# 출력: 안녕하세요, 세계!
```

## 기본 타입

T-Ruby는 Ruby의 기본 타입을 모두 지원합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/quick_start_spec.rb" line={36} />

```trb
# 기본 타입
name: String = "홍길동"
age: Integer = 25
height: Float = 175.5
is_active: Boolean = true
role: Symbol = :admin

# 컬렉션
numbers: Integer[] = [1, 2, 3, 4, 5]
scores: Hash<String, Integer> = { "수학" => 100, "영어" => 95 }

# Nil 허용 (옵셔널)
email: String? = nil
```

## 함수 타입

함수의 매개변수와 반환 타입을 지정합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/quick_start_spec.rb" line={47} />

```trb
# 기본 함수
def add(a: Integer, b: Integer): Integer
  a + b
end

# 반환값이 없는 함수
def log(message: String): void
  puts message
end

# 옵셔널 매개변수
def greet(name: String, greeting: String = "안녕하세요"): String
  "#{greeting}, #{name}!"
end

# Union 반환 타입
def find_user(id: Integer): User | nil
  # User를 찾거나 nil 반환
end
```

## 클래스 타입

클래스에 타입을 적용합니다:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/getting_started/quick_start_spec.rb" line={58} />

```trb
class User
  @name: String
  @email: String
  @age: Integer?

  def initialize(name: String, email: String): void
    @name = name
    @email = email
    @age = nil
  end

  def name: String
    @name
  end

  def email: String
    @email
  end

  def adult?: Boolean
    @age.nil? ? false : @age >= 18
  end
end
```

## 다음 단계

축하합니다! T-Ruby의 기본을 배웠습니다. 더 자세히 알아보려면:

- [.trb 파일 이해하기](/docs/getting-started/understanding-trb-files) - 상세한 첫 파일 가이드
- [에디터 설정](/docs/getting-started/editor-setup) - VS Code 등 에디터 설정
- [기본 문법](/docs/learn/basics/type-annotations) - T-Ruby 문법 자세히 배우기
