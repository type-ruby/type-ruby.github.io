---
sidebar_position: 1
title: 설치하기
description: T-Ruby 설치 방법
---

<DocsBadge />


# 설치하기

이 가이드는 T-Ruby를 시스템에 설치하는 방법을 안내합니다. T-Ruby는 Ruby 3.0 이상이 필요합니다.

## 필수 조건

T-Ruby를 설치하기 전에 다음이 준비되어 있어야 합니다:

- **Ruby 3.0+** 설치 ([ruby-lang.org](https://www.ruby-lang.org/ko/downloads/))
- **RubyGems** (Ruby와 함께 제공됨)
- 터미널/명령 프롬프트

Ruby 설치를 확인하려면:

```bash
ruby --version
# 출력 예: ruby 3.x.x ...
```

## RubyGems를 통한 설치

T-Ruby를 설치하는 가장 쉬운 방법은 RubyGems를 사용하는 것입니다:

```bash
gem install t-ruby
```

이렇게 하면 `trc` 컴파일러가 시스템에 전역으로 설치됩니다.

설치 확인:

```bash
trc --version
# 출력 예: trc x.x.x
```

## Bundler를 통한 설치

프로젝트별 설치를 원한다면 `Gemfile`에 T-Ruby를 추가하세요:

```ruby title="Gemfile"
group :development do
  gem 't-ruby'
end
```

그런 다음 실행:

```bash
bundle install
```

컴파일러를 실행할 때는 `bundle exec trc`를 사용합니다:

```bash
bundle exec trc --version
```

## 소스에서 설치

최신 개발 버전을 사용하려면:

```bash
git clone https://github.com/type-ruby/t-ruby.git
cd t-ruby
bundle install
rake install
```

## 설치 확인

설치 후 모든 것이 작동하는지 확인합니다:

```bash
# 버전 확인
trc --version

# 도움말 보기
trc --help

# 테스트 파일 생성
echo 'def greet(name: String): String; "Hello, #{name}!"; end' > test.trb

# 컴파일
trc test.trb

# 출력 확인
cat build/test.rb
```

## T-Ruby 업데이트

최신 버전으로 업데이트하려면:

```bash
gem update t-ruby
```

## 제거

T-Ruby를 제거하려면:

```bash
gem uninstall t-ruby
```

## 문제 해결

### "Command not found: trc"

gem 바이너리 경로가 PATH에 없을 수 있습니다. 다음으로 찾으세요:

```bash
gem environment | grep "EXECUTABLE DIRECTORY"
```

해당 디렉토리를 셸의 PATH에 추가하세요.

### Linux/macOS에서 권한 오류

권한 오류가 발생하면 다음 중 하나를 시도하세요:

1. Ruby 버전 관리자 사용 (rbenv, rvm)
2. `sudo gem install t-ruby` 사용 (권장하지 않음)
3. 홈 디렉토리에 설치하도록 gem 설정

### 빌드 오류

컴파일이 실패하면 개발 도구가 설치되어 있는지 확인하세요:

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential

# Fedora
sudo dnf groupinstall "Development Tools"
```

## 다음 단계

T-Ruby가 설치되었으니, 이제 코드를 작성해봅시다:

- [빠른 시작](/docs/getting-started/quick-start) - 5분 만에 시작하기
- [.trb 파일 이해하기](/docs/getting-started/understanding-trb-files) - 상세한 안내
- [에디터 설정](/docs/getting-started/editor-setup) - IDE 설정
