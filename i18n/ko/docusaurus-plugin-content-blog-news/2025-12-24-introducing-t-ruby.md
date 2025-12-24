---
slug: introducing-t-ruby
title: T-Ruby 소개
authors: [t-ruby-team]
tags: [announcement]
---

Ruby를 위한 TypeScript 스타일 정적 타입 시스템, T-Ruby를 소개합니다.

T-Ruby는 TypeScript 개발자에게 익숙한 개발 경험을 Ruby 개발자에게 제공하여, 코드에 직접 타입 어노테이션을 추가하고 런타임 전에 타입 오류를 감지할 수 있게 합니다.

## 주요 기능

- **TypeScript 스타일 문법**: TypeScript 개발자에게 익숙한 타입 어노테이션 문법
- **점진적 타이핑**: 기존 Ruby 코드베이스에 점진적으로 타입 추가 가능
- **RBS 생성**: `.rbs` 시그니처 파일 자동 생성
- **제로 런타임 오버헤드**: 컴파일 시 타입이 제거됨

## 시작하기

T-Ruby를 설치하고 Ruby 코드에 타입을 추가해보세요:

```bash
gem install t-ruby
```

첫 번째 `.trb` 파일을 작성합니다:

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

Ruby로 컴파일:

```bash
trc greet.trb
```

더 자세한 내용은 [문서](/docs/introduction/what-is-t-ruby)를 확인하세요!
