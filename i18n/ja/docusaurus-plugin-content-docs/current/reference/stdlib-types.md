---
sidebar_position: 4
title: 標準ライブラリ型
description: Ruby標準ライブラリの型定義
---

<DocsBadge />


# 標準ライブラリ型

T-RubyはRubyの標準ライブラリに対する型定義を提供します。このリファレンスでは、一般的に使用されるstdlibモジュールとクラスの型付きインターフェースを文書化します。

## ステータス

:::info 現在のサポート
T-Rubyの標準ライブラリ型カバレッジは活発に成長しています。ここにリストされている型は現在のリリースで利用可能です。追加のstdlib型は定期的に追加されています。
:::

## ファイルシステム

### File

型安全性を持つファイルI/O操作。

```trb
# ファイル読み込み
def read_config(path: String): String | nil
  return nil unless File.exist?(path)
  File.read(path)
end

# ファイル書き込み
def save_data(path: String, content: String): void
  File.write(path, content)
end

# ファイル操作
def process_file(path: String): Array<String>
  File.readlines(path).map(&:strip)
end
```

**型シグネチャ:**
- `File.exist?(path: String): Boolean`
- `File.read(path: String): String`
- `File.write(path: String, content: String): Integer`
- `File.readlines(path: String): Array<String>`
- `File.open(path: String, mode: String): File`
- `File.open(path: String, mode: String, &block: Proc<File, void>): void`
- `File.delete(*paths: String): Integer`
- `File.rename(old: String, new: String): Integer`
- `File.size(path: String): Integer`
- `File.directory?(path: String): Boolean`
- `File.file?(path: String): Boolean`

### Dir

ディレクトリ操作。

```trb
# ディレクトリ内容をリスト
def list_files(dir: String): Array<String>
  Dir.entries(dir)
end

# ファイル検索
def find_ruby_files(dir: String): Array<String>
  Dir.glob("#{dir}/**/*.rb")
end

# ディレクトリ操作
def create_dirs(path: String): void
  Dir.mkdir(path) unless Dir.exist?(path)
end
```

**型シグネチャ:**
- `Dir.entries(path: String): Array<String>`
- `Dir.glob(pattern: String): Array<String>`
- `Dir.exist?(path: String): Boolean`
- `Dir.mkdir(path: String): void`
- `Dir.rmdir(path: String): void`
- `Dir.pwd: String`
- `Dir.chdir(path: String): void`
- `Dir.home: String`

### FileUtils

高レベルファイル操作。

```trb
require 'fileutils'

# ファイルコピー
def backup_file(source: String, dest: String): void
  FileUtils.cp(source, dest)
end

# ディレクトリ削除
def clean_temp(dir: String): void
  FileUtils.rm_rf(dir)
end

# ディレクトリツリー作成
def setup_structure(path: String): void
  FileUtils.mkdir_p(path)
end
```

**型シグネチャ:**
- `FileUtils.cp(src: String, dest: String): void`
- `FileUtils.mv(src: String, dest: String): void`
- `FileUtils.rm(path: String | Array<String>): void`
- `FileUtils.rm_rf(path: String | Array<String>): void`
- `FileUtils.mkdir_p(path: String): void`
- `FileUtils.touch(path: String | Array<String>): void`

## JSON

JSONパースと生成。

```trb
require 'json'

# JSONパース
def load_config(path: String): Hash<String, Any>
  content = File.read(path)
  JSON.parse(content)
end

# JSON生成
def save_data(path: String, data: Hash<String, Any>): void
  json = JSON.generate(data)
  File.write(path, json)
end

# プリティプリント
def pretty_json(data: Hash<String, Any>): String
  JSON.pretty_generate(data)
end
```

**型シグネチャ:**
- `JSON.parse(source: String): Any`
- `JSON.generate(obj: Any): String`
- `JSON.pretty_generate(obj: Any): String`
- `JSON.dump(obj: Any, io: IO): void`
- `JSON.load(source: String | IO): Any`

### 型付きJSON

型安全なJSON操作には、明示的な型を定義します：

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

YAMLパースと生成。

```trb
require 'yaml'

# YAMLロード
def load_yaml(path: String): Any
  YAML.load_file(path)
end

# YAML生成
def save_yaml(path: String, data: Any): void
  File.write(path, YAML.dump(data))
end

# 型付きYAMLロード
def load_config(path: String): Hash<String, Any>
  YAML.load_file(path) as Hash<String, Any>
end
```

**型シグネチャ:**
- `YAML.load(source: String): Any`
- `YAML.load_file(path: String): Any`
- `YAML.dump(obj: Any): String`
- `YAML.safe_load(source: String): Any`

## Net::HTTP

HTTPクライアント操作。

```trb
require 'net/http'

# GETリクエスト
def fetch_data(url: String): String
  uri = URI(url)
  Net::HTTP.get(uri)
end

# POSTリクエスト
def send_data(url: String, body: String): String
  uri = URI(url)
  Net::HTTP.post(uri, body, { 'Content-Type' => 'application/json' }).body
end

# 完全なリクエスト
def api_call(url: String): Hash<String, Any> | nil
  uri = URI(url)
  response = Net::HTTP.get_response(uri)

  return nil unless response.is_a?(Net::HTTPSuccess)

  JSON.parse(response.body)
end
```

**型シグネチャ:**
- `Net::HTTP.get(uri: URI): String`
- `Net::HTTP.post(uri: URI, data: String, headers: Hash<String, String>?): Net::HTTPResponse`
- `Net::HTTP.get_response(uri: URI): Net::HTTPResponse`
- `Net::HTTPResponse#code: String`
- `Net::HTTPResponse#body: String`
- `Net::HTTPResponse#[](key: String): String?`

## URI

URIパースと操作。

```trb
require 'uri'

# URIパース
def parse_url(url: String): URI::HTTP | URI::HTTPS
  URI.parse(url) as URI::HTTP
end

# URIビルド
def build_api_url(host: String, path: String, query: Hash<String, String>): String
  uri = URI::HTTP.build(
    host: host,
    path: path,
    query: URI.encode_www_form(query)
  )
  uri.to_s
end
```

**型シグネチャ:**
- `URI.parse(uri: String): URI::Generic`
- `URI.encode_www_form(params: Hash<String, String>): String`
- `URI::HTTP.build(params: Hash<Symbol, String>): URI::HTTP`
- `URI#host: String?`
- `URI#path: String?`
- `URI#query: String?`
- `URI#to_s: String`

## CSV

CSVファイル処理。

```trb
require 'csv'

# CSV読み込み
def load_csv(path: String): Array<Array<String>>
  CSV.read(path)
end

# ヘッダー付き読み込み
def load_users(path: String): Array<Hash<String, String>>
  result: Array<Hash<String, String>> = []

  CSV.foreach(path, headers: true) do |row|
    result << row.to_h
  end

  result
end

# CSV書き込み
def save_csv(path: String, data: Array<Array<String>>): void
  CSV.open(path, 'w') do |csv|
    data.each { |row| csv << row }
  end
end
```

**型シグネチャ:**
- `CSV.read(path: String): Array<Array<String>>`
- `CSV.foreach(path: String, options: Hash<Symbol, Any>?, &block: Proc<CSV::Row, void>): void`
- `CSV.open(path: String, mode: String, &block: Proc<CSV, void>): void`
- `CSV#<<(row: Array<String>): void`
- `CSV::Row#to_h: Hash<String, String>`

## Logger

ロギング機能。

```trb
require 'logger'

# ロガー作成
def setup_logger(path: String): Logger
  Logger.new(path)
end

# メッセージロギング
def log_event(logger: Logger, message: String): void
  logger.info(message)
end

# 異なるログレベル
def log_error(logger: Logger, error: Exception): void
  logger.error(error.message)
  logger.debug(error.backtrace.join("\n"))
end
```

**型シグネチャ:**
- `Logger.new(logdev: String | IO): Logger`
- `Logger#debug(message: String): void`
- `Logger#info(message: String): void`
- `Logger#warn(message: String): void`
- `Logger#error(message: String): void`
- `Logger#fatal(message: String): void`
- `Logger#level=(severity: Integer): void`

## Pathname

オブジェクト指向のパス操作。

```trb
require 'pathname'

# パス操作
def process_directory(path: String): Array<String>
  dir = Pathname.new(path)
  dir.children.map { |child| child.to_s }
end

# パスクエリ
def find_config(dir: String): Pathname | nil
  path = Pathname.new(dir)
  config = path / "config.yml"

  config.exist? ? config : nil
end
```

**型シグネチャ:**
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

メモリ内文字列ストリーム。

```trb
require 'stringio'

# 文字列バッファ作成
def build_output: String
  buffer = StringIO.new
  buffer.puts "Header"
  buffer.puts "Content"
  buffer.string
end

# 文字列から読み込み
def parse_data(content: String): Array<String>
  io = StringIO.new(content)
  io.readlines
end
```

**型シグネチャ:**
- `StringIO.new(string: String?): StringIO`
- `StringIO#puts(str: String): void`
- `StringIO#write(str: String): Integer`
- `StringIO#read: String`
- `StringIO#readlines: Array<String>`
- `StringIO#string: String`

## Set

一意な要素のコレクション。

```trb
require 'set'

# セットの作成と使用
def unique_tags(posts: Array<Hash<Symbol, Array<String>>>): Set<String>
  tags = Set<String>.new

  posts.each do |post|
    post[:tags].each { |tag| tags.add(tag) }
  end

  tags
end

# セット演算
def common_interests(users: Array<Hash<Symbol, Set<String>>>): Set<String>
  return Set.new if users.empty?

  users.map { |u| u[:interests] }.reduce { |a, b| a & b }
end
```

**型シグネチャ:**
- `Set.new(enum: Array<T>?): Set<T>`
- `Set#add(item: T): Set<T>`
- `Set#delete(item: T): Set<T>`
- `Set#include?(item: T): Boolean`
- `Set#size: Integer`
- `Set#empty?: Boolean`
- `Set#to_a: Array<T>`
- `Set#&(other: Set<T>): Set<T>` - 積集合
- `Set#|(other: Set<T>): Set<T>` - 和集合
- `Set#-(other: Set<T>): Set<T>` - 差集合

## OpenStruct

動的属性オブジェクト。

```trb
require 'ostruct'

# 構造体作成
def create_config: OpenStruct
  OpenStruct.new(
    host: "localhost",
    port: 3000,
    debug: true
  )
end

# プロパティアクセス
def get_host(config: OpenStruct): String
  config.host as String
end
```

**型シグネチャ:**
- `OpenStruct.new(hash: Hash<Symbol, Any>?): OpenStruct`
- `OpenStruct#[](key: Symbol): Any`
- `OpenStruct#[]=(key: Symbol, value: Any): void`
- `OpenStruct#to_h: Hash<Symbol, Any>`

## Benchmark

パフォーマンス測定。

```trb
require 'benchmark'

# 実行時間を測定
def measure_operation: Float
  result = Benchmark.measure do
    1_000_000.times { |i| i * 2 }
  end
  result.real
end

# 実装を比較
def compare_methods: void
  Benchmark.bm do |x|
    x.report("map") { (1..1000).map { |i| i * 2 } }
    x.report("each") { (1..1000).each { |i| i * 2 } }
  end
end
```

**型シグネチャ:**
- `Benchmark.measure(&block: Proc<void>): Benchmark::Tms`
- `Benchmark.bm(&block: Proc<Benchmark::Job, void>): void`
- `Benchmark::Tms#real: Float`
- `Benchmark::Tms#total: Float`

## ERB

埋め込みRubyテンプレート。

```trb
require 'erb'

# テンプレートレンダリング
def render_template(template: String, name: String): String
  erb = ERB.new(template)
  erb.result(binding)
end

# ファイルから
def render_email(user_name: String): String
  template = File.read("templates/email.erb")
  ERB.new(template).result(binding)
end
```

**型シグネチャ:**
- `ERB.new(str: String): ERB`
- `ERB#result(binding: Binding?): String`

## Base64

Base64エンコードとデコード。

```trb
require 'base64'

# エンコード
def encode_data(data: String): String
  Base64.strict_encode64(data)
end

# デコード
def decode_data(encoded: String): String
  Base64.strict_decode64(encoded)
end

# URL安全なエンコード
def url_safe_token(data: String): String
  Base64.urlsafe_encode64(data)
end
```

**型シグネチャ:**
- `Base64.encode64(str: String): String`
- `Base64.decode64(str: String): String`
- `Base64.strict_encode64(str: String): String`
- `Base64.strict_decode64(str: String): String`
- `Base64.urlsafe_encode64(str: String): String`
- `Base64.urlsafe_decode64(str: String): String`

## Digest

ハッシュ関数（MD5、SHA等）。

```trb
require 'digest'

# MD5ハッシュ
def md5_hash(data: String): String
  Digest::MD5.hexdigest(data)
end

# SHA256ハッシュ
def sha256_hash(data: String): String
  Digest::SHA256.hexdigest(data)
end

# ファイルチェックサム
def file_checksum(path: String): String
  Digest::SHA256.file(path).hexdigest
end
```

**型シグネチャ:**
- `Digest::MD5.hexdigest(str: String): String`
- `Digest::SHA1.hexdigest(str: String): String`
- `Digest::SHA256.hexdigest(str: String): String`
- `Digest::SHA256.file(path: String): Digest::SHA256`
- `Digest::Base#hexdigest: String`

## SecureRandom

暗号学的に安全なランダム値。

```trb
require 'securerandom'

# ランダムhex
def generate_token: String
  SecureRandom.hex(32)
end

# UUID
def generate_uuid: String
  SecureRandom.uuid
end

# ランダムバイト
def random_bytes(size: Integer): String
  SecureRandom.bytes(size)
end
```

**型シグネチャ:**
- `SecureRandom.hex(n: Integer?): String`
- `SecureRandom.uuid: String`
- `SecureRandom.bytes(n: Integer): String`
- `SecureRandom.random_number(n: Integer | Float?): Integer | Float`

## Timeout

タイムアウト付きコード実行。

```trb
require 'timeout'

# タイムアウト付き
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

**型シグネチャ:**
- `Timeout.timeout(sec: Integer | Float, &block: Proc<T>): T`

## カバレッジマップ

stdlibモジュールサポートのクイックリファレンステーブル：

| モジュール | ステータス | 備考 |
|----------|----------|------|
| `File` | ✅ サポート | 完全な型カバレッジ |
| `Dir` | ✅ サポート | 完全な型カバレッジ |
| `FileUtils` | ✅ サポート | 一般的なメソッドに型付き |
| `JSON` | ✅ サポート | 安全のため型キャストを使用 |
| `YAML` | ✅ サポート | 安全のため型キャストを使用 |
| `Net::HTTP` | ✅ サポート | 基本操作 |
| `URI` | ✅ サポート | パースとビルド |
| `CSV` | ✅ サポート | 読み込みと書き込み |
| `Logger` | ✅ サポート | すべてのログレベル |
| `Pathname` | ✅ サポート | パス操作 |
| `StringIO` | ✅ サポート | ストリーム操作 |
| `Set` | ✅ サポート | ジェネリック`Set<T>` |
| `OpenStruct` | ⚠️ 部分的 | 動的属性はAnyを使用 |
| `Benchmark` | ✅ サポート | パフォーマンス測定 |
| `ERB` | ✅ サポート | テンプレートレンダリング |
| `Base64` | ✅ サポート | エンコード/デコード |
| `Digest` | ✅ サポート | ハッシュ関数 |
| `SecureRandom` | ✅ サポート | 安全なランダム生成 |
| `Timeout` | ✅ サポート | タイムアウト実行 |
| `Socket` | 🚧 計画中 | 近日追加予定 |
| `Thread` | 🚧 計画中 | 近日追加予定 |
| `Queue` | 🚧 計画中 | 近日追加予定 |

## Stdlib型の使用

### インポートと使用

```trb
# stdlibモジュールをインポート
require 'json'
require 'fileutils'

# 型安全に使用
def process_config(path: String): Hash<String, Any> | nil
  return nil unless File.exist?(path)

  content = File.read(path)
  JSON.parse(content) as Hash<String, Any>
end
```

### 型キャスト

動的stdlibモジュールには型キャストを使用します：

```trb
# 安全なキャスト
def load_users(path: String): Array<Hash<String, String>>
  raw_data = JSON.parse(File.read(path))

  if raw_data.is_a?(Array)
    raw_data as Array<Hash<String, String>>
  else
    []
  end
end
```

### カスタムラッパー

より良い安全性のために型付きラッパーを作成します：

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

## ベストプラクティス

1. **動的結果を型キャスト** - JSON/YAMLパースには`as`を使用
2. **型安全なラッパーを作成** - 型付きインターフェースで動的ライブラリをラップ
3. **nilケースを処理** - stdlibメソッドは頻繁にnilを返す
4. **ユニオン型を使用** - 多くのstdlibメソッドは複数の戻り型を持つ
5. **外部データを検証** - パースされたJSON/YAML型を信頼しない

## Stdlib型への貢献

stdlibカバレッジの拡大に協力したいですか？新しい標準ライブラリ型定義の追加について詳しくは、[コントリビューションガイド](/docs/project/contributing)を参照してください。

## 次のステップ

- [組み込み型](/docs/reference/built-in-types) - コア型リファレンス
- [型演算子](/docs/reference/type-operators) - 型操作
- [チートシート](/docs/reference/cheatsheet) - クイック構文リファレンス
