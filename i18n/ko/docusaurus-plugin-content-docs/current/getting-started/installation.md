---
sidebar_position: 1
title: 설치하기
description: T-Ruby 컴파일러 및 CLI 도구 설치
---

# 설치하기

이 가이드는 T-Ruby 컴파일러를 시스템에 설치하는 다양한 방법을 안내합니다.

## 필수 조건

- Ruby 3.0 이상
- Node.js 18 이상 (npm 패키지 사용 시)

## npm을 통한 설치 (권장)

가장 빠르게 시작하는 방법은 npm을 사용하는 것입니다:

```bash
npm install -g t-ruby
```

설치 확인:

```bash
trc --version
```

## RubyGems를 통한 설치

Ruby gems를 선호한다면:

```bash
gem install t-ruby
```

## 소스에서 빌드

개발 버전이나 기여를 위해 소스에서 빌드할 수 있습니다:

```bash
# 저장소 클론
git clone https://github.com/type-ruby/t-ruby.git
cd t-ruby

# 의존성 설치
bundle install
npm install

# 빌드
npm run build

# 전역 설치 (선택사항)
npm link
```

## 프로젝트 설정

기존 프로젝트에 T-Ruby를 추가하는 가장 좋은 방법:

```bash
cd my-project
npm init -y  # package.json이 없는 경우
npm install --save-dev t-ruby
```

그런 다음 `package.json`에 스크립트 추가:

```json
{
  "scripts": {
    "build": "trc src/**/*.trb",
    "check": "trc --check src/**/*.trb",
    "watch": "trc --watch src/**/*.trb"
  }
}
```

## 설치 확인

설치가 잘 되었는지 확인하려면:

```bash
# 버전 확인
trc --version

# 도움말 보기
trc --help

# 테스트 컴파일
echo 'def add(a: Integer, b: Integer): Integer
  a + b
end' > test.trb

trc test.trb

# 출력 확인
cat test.rb
```

## 문제 해결

### Node.js를 찾을 수 없음

npm을 통해 설치했는데 `trc` 명령을 찾을 수 없는 경우, npm의 전역 bin 디렉토리가 PATH에 있는지 확인하세요:

```bash
# npm 전역 bin 위치 찾기
npm bin -g

# 해당 경로를 PATH에 추가 (예시)
export PATH="$PATH:$(npm bin -g)"
```

### 권한 오류

Linux/macOS에서 권한 오류가 발생하면 npm 전역 설치 설정을 확인하세요:

```bash
# npm prefix 확인
npm config get prefix

# 권한 없이 설치하려면 prefix 변경
npm config set prefix ~/.npm-global
export PATH="$PATH:~/.npm-global/bin"
```

## 다음 단계

- [빠른 시작](/docs/getting-started/quick-start) - 첫 번째 프로그램 작성
- [에디터 설정](/docs/getting-started/editor-setup) - IDE 지원 구성
- [프로젝트 구성](/docs/getting-started/project-configuration) - T-Ruby 프로젝트 구성 옵션
