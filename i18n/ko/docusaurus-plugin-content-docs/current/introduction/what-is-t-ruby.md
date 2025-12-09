---
sidebar_position: 1
title: T-Ruby란?
description: T-Ruby 소개 - Ruby를 위한 TypeScript 스타일 타입 시스템
---

# T-Ruby란?

T-Ruby는 Ruby에 TypeScript 스타일의 타입 문법을 도입하는 새로운 접근 방식입니다. TypeScript가 JavaScript에 하는 역할을 Ruby에도 가져옵니다.

## 핵심 아이디어

TypeScript가 JavaScript에 타입 안전성을 추가하듯이, T-Ruby는 Ruby에 동일한 기능을 제공합니다. `.trb` 파일에 타입 주석이 포함된 Ruby 코드를 작성하면, T-Ruby가 이를 순수한 Ruby 코드와 RBS 타입 정의로 컴파일합니다.

```ruby
# 입력: hello.trb
def greet(name: String): String
  "안녕하세요, #{name}!"
end

user: User | nil = find_user(123)
```

```ruby
# 출력: hello.rb (타입 없는 순수 Ruby)
def greet(name)
  "안녕하세요, #{name}!"
end

user = find_user(123)
```

```ruby
# 출력: hello.rbs (RBS 타입 정의)
def greet: (String) -> String
```

## 왜 T-Ruby인가?

### 친숙한 문법

T-Ruby의 타입 문법은 TypeScript에서 직접 영감을 받았습니다. TypeScript를 사용해본 경험이 있다면, T-Ruby도 바로 이해할 수 있습니다.

```ruby
# Union 타입
id: String | Integer = "user-123"

# 옵셔널 타입
name: String? = nil

# 제네릭
users: Array<User> = []

# 인터페이스
interface Printable
  def to_s: String
end
```

### 제로 런타임 오버헤드

T-Ruby 타입은 빌드 타임에만 존재합니다. 컴파일된 Ruby 코드에는 어떤 타입 정보도 포함되지 않아 성능 저하 없이 실행됩니다.

### Ruby 에코시스템 호환성

T-Ruby는 RBS 파일을 생성합니다. 이는 다음을 의미합니다:
- Steep, Sorbet 등 기존 Ruby 타입 체커와 함께 사용 가능
- 기존 RBS 타입 정의 활용 가능
- 점진적 도입 가능 - 한 번에 모든 코드를 변환할 필요 없음

## 작동 방식

1. **작성**: `.trb` 파일에 타입 주석이 포함된 Ruby 코드 작성
2. **컴파일**: `trc` 명령어로 컴파일
3. **실행**: 생성된 `.rb` 파일을 일반 Ruby처럼 실행
4. **검사**: RBS 파일로 정적 타입 검사 수행

## 다음 단계

- [왜 T-Ruby인가?](/docs/introduction/why-t-ruby) - T-Ruby의 장점 자세히 알아보기
- [설치하기](/docs/getting-started/installation) - T-Ruby 설치 시작
- [빠른 시작](/docs/getting-started/quick-start) - 첫 번째 T-Ruby 프로젝트 만들기
