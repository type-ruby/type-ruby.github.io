---
sidebar_position: 4
title: 표준 라이브러리 타입
description: Ruby 표준 라이브러리의 타입 정의
---

<DocsBadge />


# 표준 라이브러리 타입

T-Ruby는 Ruby의 표준 라이브러리에 대한 타입 정의를 제공합니다. 이 레퍼런스는 일반적으로 사용되는 stdlib 모듈과 클래스에 대한 타입이 지정된 인터페이스를 문서화합니다.

## 상태

:::info 현재 지원
T-Ruby의 표준 라이브러리 타입 커버리지는 활발히 성장하고 있습니다. 여기에 나열된 타입은 현재 릴리스에서 사용 가능합니다. 추가 stdlib 타입이 정기적으로 추가되고 있습니다.
:::

## 파일 시스템

### File

타입 안전성이 있는 파일 I/O 작업.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={25} />

```trb
# 파일 읽기
def read_config(path: String): String | nil
  return nil unless File.exist?(path)
  File.read(path)
end

# 파일 쓰기
def save_data(path: String, content: String): void
  File.write(path, content)
end

# 파일 작업
def process_file(path: String): Array<String>
  File.readlines(path).map(&:strip)
end
```

**타입 시그니처:**
- `File.exist?(path: String): Boolean`
- `File.read(path: String): String`
- `File.write(path: String, content: String): Integer`
- `File.readlines(path: String): Array<String>`
- `File.open(path: String, mode: String): File`
- `File.open(path: String, mode: String, &block: Proc<File, void>): void`
- `File.delete(*paths: Array<String>): Integer`
- `File.rename(old: String, new: String): Integer`
- `File.size(path: String): Integer`
- `File.directory?(path: String): Boolean`
- `File.file?(path: String): Boolean`

### Dir

디렉토리 작업.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={36} />

```trb
# 디렉토리 내용 나열
def list_files(dir: String): Array<String>
  Dir.entries(dir)
end

# 파일 찾기
def find_ruby_files(dir: String): Array<String>
  Dir.glob("#{dir}/**/*.rb")
end

# 디렉토리 작업
def create_dirs(path: String): void
  Dir.mkdir(path) unless Dir.exist?(path)
end
```

**타입 시그니처:**
- `Dir.entries(path: String): Array<String>`
- `Dir.glob(pattern: String): Array<String>`
- `Dir.exist?(path: String): Boolean`
- `Dir.mkdir(path: String): void`
- `Dir.rmdir(path: String): void`
- `Dir.pwd: String`
- `Dir.chdir(path: String): void`
- `Dir.home: String`

### FileUtils

고수준 파일 작업.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={47} />

```trb
require 'fileutils'

# 파일 복사
def backup_file(source: String, dest: String): void
  FileUtils.cp(source, dest)
end

# 디렉토리 제거
def clean_temp(dir: String): void
  FileUtils.rm_rf(dir)
end

# 디렉토리 트리 생성
def setup_structure(path: String): void
  FileUtils.mkdir_p(path)
end
```

**타입 시그니처:**
- `FileUtils.cp(src: String, dest: String): void`
- `FileUtils.mv(src: String, dest: String): void`
- `FileUtils.rm(path: String | Array<String>): void`
- `FileUtils.rm_rf(path: String | Array<String>): void`
- `FileUtils.mkdir_p(path: String): void`
- `FileUtils.touch(path: String | Array<String>): void`

## JSON

JSON 파싱과 생성.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={58} />

```trb
require 'json'

# JSON 파싱
def load_config(path: String): Hash<String, Any>
  content = File.read(path)
  JSON.parse(content)
end

# JSON 생성
def save_data(path: String, data: Hash<String, Any>): void
  json = JSON.generate(data)
  File.write(path, json)
end

# 예쁜 출력
def pretty_json(data: Hash<String, Any>): String
  JSON.pretty_generate(data)
end
```

**타입 시그니처:**
- `JSON.parse(source: String): Any`
- `JSON.generate(obj: Any): String`
- `JSON.pretty_generate(obj: Any): String`
- `JSON.dump(obj: Any, io: IO): void`
- `JSON.load(source: String | IO): Any`

### 타입이 지정된 JSON

타입 안전한 JSON 작업을 위해 명시적 타입을 정의하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={69} />

```trb
type JSONPrimitive = String | Integer | Float | Boolean | nil
type JSONArray = Array<JSONValue>
type JSONObject = Hash<String, JSONValue>
type JSONValue = JSONPrimitive | JSONArray | JSONObject

def parse_json(source: String): JSONValue
  JSON.parse(source) as JSONValue
end

def parse_object(source: String): JSONObject
  result = JSON.parse(source)
  result.is_a?(Hash) ? result : {}
end
```

## YAML

YAML 파싱과 생성.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={80} />

```trb
require 'yaml'

# YAML 로드
def load_yaml(path: String): Any
  YAML.load_file(path)
end

# YAML 생성
def save_yaml(path: String, data: Any): void
  File.write(path, YAML.dump(data))
end

# 타입이 지정된 YAML 로딩
def load_config(path: String): Hash<String, Any>
  YAML.load_file(path) as Hash<String, Any>
end
```

**타입 시그니처:**
- `YAML.load(source: String): Any`
- `YAML.load_file(path: String): Any`
- `YAML.dump(obj: Any): String`
- `YAML.safe_load(source: String): Any`

## Net::HTTP

HTTP 클라이언트 작업.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={91} />

```trb
require 'net/http'

# GET 요청
def fetch_data(url: String): String
  uri = URI(url)
  Net::HTTP.get(uri)
end

# POST 요청
def send_data(url: String, body: String): String
  uri = URI(url)
  Net::HTTP.post(uri, body, { 'Content-Type' => 'application/json' }).body
end

# 전체 요청
def api_call(url: String): Hash<String, Any> | nil
  uri = URI(url)
  response = Net::HTTP.get_response(uri)

  return nil unless response.is_a?(Net::HTTPSuccess)

  JSON.parse(response.body)
end
```

**타입 시그니처:**
- `Net::HTTP.get(uri: URI): String`
- `Net::HTTP.post(uri: URI, data: String, headers: Hash<String, String>?): Net::HTTPResponse`
- `Net::HTTP.get_response(uri: URI): Net::HTTPResponse`
- `Net::HTTPResponse#code: String`
- `Net::HTTPResponse#body: String`
- `Net::HTTPResponse#[](key: String): String?`

## URI

URI 파싱과 조작.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={102} />

```trb
require 'uri'

# URI 파싱
def parse_url(url: String): URI::HTTP | URI::HTTPS
  URI.parse(url) as URI::HTTP
end

# URI 빌드
def build_api_url(host: String, path: String, query: Hash<String, String>): String
  uri = URI::HTTP.build(
    host: host,
    path: path,
    query: URI.encode_www_form(query)
  )
  uri.to_s
end
```

**타입 시그니처:**
- `URI.parse(uri: String): URI::Generic`
- `URI.encode_www_form(params: Hash<String, String>): String`
- `URI::HTTP.build(params: Hash<Symbol, String>): URI::HTTP`
- `URI#host: String?`
- `URI#path: String?`
- `URI#query: String?`
- `URI#to_s: String`

## CSV

CSV 파일 처리.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={113} />

```trb
require 'csv'

# CSV 읽기
def load_csv(path: String): Array<Array<String>>
  CSV.read(path)
end

# 헤더와 함께 읽기
def load_users(path: String): Array<Hash<String, String>>
  result: Array<Hash<String, String>> = []

  CSV.foreach(path, headers: true) do |row|
    result << row.to_h
  end

  result
end

# CSV 쓰기
def save_csv(path: String, data: Array<Array<String>>): void
  CSV.open(path, 'w') do |csv|
    data.each { |row| csv << row }
  end
end
```

**타입 시그니처:**
- `CSV.read(path: String): Array<Array<String>>`
- `CSV.foreach(path: String, options: Hash<Symbol, Any>?, &block: Proc<CSV::Row, void>): void`
- `CSV.open(path: String, mode: String, &block: Proc<CSV, void>): void`
- `CSV#<<(row: Array<String>): void`
- `CSV::Row#to_h: Hash<String, String>`

## Logger

로깅 기능.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={124} />

```trb
require 'logger'

# 로거 생성
def setup_logger(path: String): Logger
  Logger.new(path)
end

# 메시지 로깅
def log_event(logger: Logger, message: String): void
  logger.info(message)
end

# 다른 로그 레벨
def log_error(logger: Logger, error: Exception): void
  logger.error(error.message)
  logger.debug(error.backtrace.join("\n"))
end
```

**타입 시그니처:**
- `Logger.new(logdev: String | IO): Logger`
- `Logger#debug(message: String): void`
- `Logger#info(message: String): void`
- `Logger#warn(message: String): void`
- `Logger#error(message: String): void`
- `Logger#fatal(message: String): void`
- `Logger#level=(severity: Integer): void`

## Pathname

객체 지향 경로 조작.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={135} />

```trb
require 'pathname'

# 경로 작업
def process_directory(path: String): Array<String>
  dir = Pathname.new(path)
  dir.children.map { |child| child.to_s }
end

# 경로 쿼리
def find_config(dir: String): Pathname | nil
  path = Pathname.new(dir)
  config = path / "config.yml"

  config.exist? ? config : nil
end
```

**타입 시그니처:**
- `Pathname.new(path: String): Pathname`
- `Pathname#/(other: String): Pathname`
- `Pathname#exist?: Boolean`
- `Pathname#directory?: Boolean`
- `Pathname#file?: Boolean`
- `Pathname#children: Array<Pathname>`
- `Pathname#basename: Pathname`
- `Pathname#dirname: Pathname`
- `Pathname#extname: String`
- `Pathname#to_s: String`

## StringIO

메모리 내 문자열 스트림.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={146} />

```trb
require 'stringio'

# 문자열 버퍼 생성
def build_output: String
  buffer = StringIO.new
  buffer.puts "Header"
  buffer.puts "Content"
  buffer.string
end

# 문자열에서 읽기
def parse_data(content: String): Array<String>
  io = StringIO.new(content)
  io.readlines
end
```

**타입 시그니처:**
- `StringIO.new(string: String?): StringIO`
- `StringIO#puts(str: String): void`
- `StringIO#write(str: String): Integer`
- `StringIO#read: String`
- `StringIO#readlines: Array<String>`
- `StringIO#string: String`

## Set

고유한 요소의 컬렉션.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={157} />

```trb
require 'set'

# 집합 생성 및 사용
def unique_tags(posts: Array<Hash<Symbol, Array<String>>>): Set<String>
  tags = Set<String>.new

  posts.each do |post|
    post[:tags].each { |tag| tags.add(tag) }
  end

  tags
end

# 집합 연산
def common_interests(users: Array<Hash<Symbol, Set<String>>>): Set<String>
  return Set.new if users.empty?

  users.map { |u| u[:interests] }.reduce { |a, b| a & b }
end
```

**타입 시그니처:**
- `Set.new(enum: Array<T>?): Set<T>`
- `Set#add(item: T): Set<T>`
- `Set#delete(item: T): Set<T>`
- `Set#include?(item: T): Boolean`
- `Set#size: Integer`
- `Set#empty?: Boolean`
- `Set#to_a: Array<T>`
- `Set#&(other: Set<T>): Set<T>` - 교집합
- `Set#|(other: Set<T>): Set<T>` - 합집합
- `Set#-(other: Set<T>): Set<T>` - 차집합

## OpenStruct

동적 속성 객체.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={168} />

```trb
require 'ostruct'

# 구조체 생성
def create_config: OpenStruct
  OpenStruct.new(
    host: "localhost",
    port: 3000,
    debug: true
  )
end

# 속성 접근
def get_host(config: OpenStruct): String
  config.host as String
end
```

**타입 시그니처:**
- `OpenStruct.new(hash: Hash<Symbol, Any>?): OpenStruct`
- `OpenStruct#[](key: Symbol): Any`
- `OpenStruct#[]=(key: Symbol, value: Any): void`
- `OpenStruct#to_h: Hash<Symbol, Any>`

## Benchmark

성능 측정.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={179} />

```trb
require 'benchmark'

# 실행 시간 측정
def measure_operation: Float
  result = Benchmark.measure do
    1_000_000.times { |i| i * 2 }
  end
  result.real
end

# 구현 비교
def compare_methods: void
  Benchmark.bm do |x|
    x.report("map") { (1..1000).map { |i| i * 2 } }
    x.report("each") { (1..1000).each { |i| i * 2 } }
  end
end
```

**타입 시그니처:**
- `Benchmark.measure(&block: Proc<void>): Benchmark::Tms`
- `Benchmark.bm(&block: Proc<Benchmark::Job, void>): void`
- `Benchmark::Tms#real: Float`
- `Benchmark::Tms#total: Float`

## ERB

임베디드 Ruby 템플릿.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={190} />

```trb
require 'erb'

# 템플릿 렌더링
def render_template(template: String, name: String): String
  erb = ERB.new(template)
  erb.result(binding)
end

# 파일에서
def render_email(user_name: String): String
  template = File.read("templates/email.erb")
  ERB.new(template).result(binding)
end
```

**타입 시그니처:**
- `ERB.new(str: String): ERB`
- `ERB#result(binding: Binding?): String`

## Base64

Base64 인코딩과 디코딩.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={201} />

```trb
require 'base64'

# 인코딩
def encode_data(data: String): String
  Base64.strict_encode64(data)
end

# 디코딩
def decode_data(encoded: String): String
  Base64.strict_decode64(encoded)
end

# URL 안전 인코딩
def url_safe_token(data: String): String
  Base64.urlsafe_encode64(data)
end
```

**타입 시그니처:**
- `Base64.encode64(str: String): String`
- `Base64.decode64(str: String): String`
- `Base64.strict_encode64(str: String): String`
- `Base64.strict_decode64(str: String): String`
- `Base64.urlsafe_encode64(str: String): String`
- `Base64.urlsafe_decode64(str: String): String`

## Digest

해시 함수 (MD5, SHA 등).

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={212} />

```trb
require 'digest'

# MD5 해시
def md5_hash(data: String): String
  Digest::MD5.hexdigest(data)
end

# SHA256 해시
def sha256_hash(data: String): String
  Digest::SHA256.hexdigest(data)
end

# 파일 체크섬
def file_checksum(path: String): String
  Digest::SHA256.file(path).hexdigest
end
```

**타입 시그니처:**
- `Digest::MD5.hexdigest(str: String): String`
- `Digest::SHA1.hexdigest(str: String): String`
- `Digest::SHA256.hexdigest(str: String): String`
- `Digest::SHA256.file(path: String): Digest::SHA256`
- `Digest::Base#hexdigest: String`

## SecureRandom

암호학적으로 안전한 랜덤 값.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={223} />

```trb
require 'securerandom'

# 랜덤 hex
def generate_token: String
  SecureRandom.hex(32)
end

# UUID
def generate_uuid: String
  SecureRandom.uuid
end

# 랜덤 바이트
def random_bytes(size: Integer): String
  SecureRandom.bytes(size)
end
```

**타입 시그니처:**
- `SecureRandom.hex(n: Integer?): String`
- `SecureRandom.uuid: String`
- `SecureRandom.bytes(n: Integer): String`
- `SecureRandom.random_number(n: Integer | Float?): Integer | Float`

## Timeout

타임아웃으로 코드 실행.

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={234} />

```trb
require 'timeout'

# 타임아웃으로
def fetch_with_timeout(url: String): String | nil
  begin
    Timeout.timeout(5) do
      Net::HTTP.get(URI(url))
    end
  rescue Timeout::Error
    nil
  end
end
```

**타입 시그니처:**
- `Timeout.timeout(sec: Integer | Float, &block: Proc<T>): T`

## 커버리지 맵

stdlib 모듈 지원의 빠른 참조 테이블:

| 모듈 | 상태 | 참고 |
|------|------|------|
| `File` | ✅ 지원 | 전체 타입 커버리지 |
| `Dir` | ✅ 지원 | 전체 타입 커버리지 |
| `FileUtils` | ✅ 지원 | 일반 메서드에 타입 지정 |
| `JSON` | ✅ 지원 | 안전을 위해 타입 캐스팅 사용 |
| `YAML` | ✅ 지원 | 안전을 위해 타입 캐스팅 사용 |
| `Net::HTTP` | ✅ 지원 | 기본 작업 |
| `URI` | ✅ 지원 | 파싱과 빌드 |
| `CSV` | ✅ 지원 | 읽기와 쓰기 |
| `Logger` | ✅ 지원 | 모든 로그 레벨 |
| `Pathname` | ✅ 지원 | 경로 작업 |
| `StringIO` | ✅ 지원 | 스트림 작업 |
| `Set` | ✅ 지원 | 제네릭 `Set<T>` |
| `OpenStruct` | ⚠️ 부분 | 동적 속성은 Any 사용 |
| `Benchmark` | ✅ 지원 | 성능 측정 |
| `ERB` | ✅ 지원 | 템플릿 렌더링 |
| `Base64` | ✅ 지원 | 인코딩/디코딩 |
| `Digest` | ✅ 지원 | 해시 함수 |
| `SecureRandom` | ✅ 지원 | 안전한 랜덤 생성 |
| `Timeout` | ✅ 지원 | 타임아웃 실행 |
| `Socket` | 🚧 계획됨 | 곧 추가 예정 |
| `Thread` | 🚧 계획됨 | 곧 추가 예정 |
| `Queue` | 🚧 계획됨 | 곧 추가 예정 |

## Stdlib 타입 사용

### 가져오기와 사용

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={245} />

```trb
# stdlib 모듈 가져오기
require 'json'
require 'fileutils'

# 타입 안전하게 사용
def process_config(path: String): Hash<String, Any> | nil
  return nil unless File.exist?(path)

  content = File.read(path)
  JSON.parse(content) as Hash<String, Any>
end
```

### 타입 캐스팅

동적 stdlib 모듈에는 타입 캐스팅을 사용하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={256} />

```trb
# 안전한 캐스팅
def load_users(path: String): Array<Hash<String, String>>
  raw_data = JSON.parse(File.read(path))

  if raw_data.is_a?(Array)
    raw_data as Array<Hash<String, String>>
  else
    []
  end
end
```

### 커스텀 래퍼

더 나은 안전성을 위해 타입이 지정된 래퍼를 생성하세요:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/reference/stdlib_types_spec.rb" line={267} />

```trb
class Config
  @data: Hash<String, Any>

  def initialize(path: String): void
    @data = YAML.load_file(path) as Hash<String, Any>
  end

  def get_string(key: String): String?
    value = @data[key]
    value.is_a?(String) ? value : nil
  end

  def get_int(key: String): Integer?
    value = @data[key]
    value.is_a?(Integer) ? value : nil
  end
end
```

## 모범 사례

1. **동적 결과 타입 캐스팅** - JSON/YAML 파싱에 `as` 사용
2. **타입 안전한 래퍼 생성** - 타입이 지정된 인터페이스로 동적 라이브러리 래핑
3. **nil 케이스 처리** - stdlib 메서드는 종종 nil 반환
4. **유니온 타입 사용** - 많은 stdlib 메서드는 여러 반환 타입을 가짐
5. **외부 데이터 검증** - 파싱된 JSON/YAML 타입을 신뢰하지 마세요

## Stdlib 타입 기여

stdlib 커버리지 확장에 도움을 주고 싶으시다면? 새로운 표준 라이브러리 타입 정의 추가에 대한 자세한 내용은 [기여 가이드](/docs/project/contributing)를 참조하세요.

## 다음 단계

- [내장 타입](/docs/reference/built-in-types) - 핵심 타입 레퍼런스
- [타입 연산자](/docs/reference/type-operators) - 타입 조작
- [치트시트](/docs/reference/cheatsheet) - 빠른 구문 참조
