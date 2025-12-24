---
sidebar_position: 4
title: Standard Library Types
description: Type definitions for Ruby standard library
---

<DocsBadge />


# Standard Library Types

T-Ruby provides type definitions for Ruby's standard library. This reference documents the typed interfaces for commonly used stdlib modules and classes.

## Status

:::info Current Support
T-Ruby's standard library type coverage is actively growing. The types listed here are available in the current release. Additional stdlib types are being added regularly.
:::

## File System

### File

File I/O operations with type safety.

```trb
# Reading files
def read_config(path: String): String | nil
  return nil unless File.exist?(path)
  File.read(path)
end

# Writing files
def save_data(path: String, content: String): void
  File.write(path, content)
end

# File operations
def process_file(path: String): Array<String>
  File.readlines(path).map(&:strip)
end
```

**Type Signatures:**
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

Directory operations.

```trb
# List directory contents
def list_files(dir: String): Array<String>
  Dir.entries(dir)
end

# Find files
def find_ruby_files(dir: String): Array<String>
  Dir.glob("#{dir}/**/*.rb")
end

# Directory operations
def create_dirs(path: String): void
  Dir.mkdir(path) unless Dir.exist?(path)
end
```

**Type Signatures:**
- `Dir.entries(path: String): Array<String>`
- `Dir.glob(pattern: String): Array<String>`
- `Dir.exist?(path: String): Boolean`
- `Dir.mkdir(path: String): void`
- `Dir.rmdir(path: String): void`
- `Dir.pwd: String`
- `Dir.chdir(path: String): void`
- `Dir.home: String`

### FileUtils

High-level file operations.

```trb
require 'fileutils'

# Copy files
def backup_file(source: String, dest: String): void
  FileUtils.cp(source, dest)
end

# Remove directories
def clean_temp(dir: String): void
  FileUtils.rm_rf(dir)
end

# Create directory tree
def setup_structure(path: String): void
  FileUtils.mkdir_p(path)
end
```

**Type Signatures:**
- `FileUtils.cp(src: String, dest: String): void`
- `FileUtils.mv(src: String, dest: String): void`
- `FileUtils.rm(path: String | Array<String>): void`
- `FileUtils.rm_rf(path: String | Array<String>): void`
- `FileUtils.mkdir_p(path: String): void`
- `FileUtils.touch(path: String | Array<String>): void`

## JSON

JSON parsing and generation.

```trb
require 'json'

# Parse JSON
def load_config(path: String): Hash<String, Any>
  content = File.read(path)
  JSON.parse(content)
end

# Generate JSON
def save_data(path: String, data: Hash<String, Any>): void
  json = JSON.generate(data)
  File.write(path, json)
end

# Pretty printing
def pretty_json(data: Hash<String, Any>): String
  JSON.pretty_generate(data)
end
```

**Type Signatures:**
- `JSON.parse(source: String): Any`
- `JSON.generate(obj: Any): String`
- `JSON.pretty_generate(obj: Any): String`
- `JSON.dump(obj: Any, io: IO): void`
- `JSON.load(source: String | IO): Any`

### Typed JSON

For type-safe JSON operations, define explicit types:

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

YAML parsing and generation.

```trb
require 'yaml'

# Load YAML
def load_yaml(path: String): Any
  YAML.load_file(path)
end

# Generate YAML
def save_yaml(path: String, data: Any): void
  File.write(path, YAML.dump(data))
end

# Typed YAML loading
def load_config(path: String): Hash<String, Any>
  YAML.load_file(path) as Hash<String, Any>
end
```

**Type Signatures:**
- `YAML.load(source: String): Any`
- `YAML.load_file(path: String): Any`
- `YAML.dump(obj: Any): String`
- `YAML.safe_load(source: String): Any`

## Net::HTTP

HTTP client operations.

```trb
require 'net/http'

# GET request
def fetch_data(url: String): String
  uri = URI(url)
  Net::HTTP.get(uri)
end

# POST request
def send_data(url: String, body: String): String
  uri = URI(url)
  Net::HTTP.post(uri, body, { 'Content-Type' => 'application/json' }).body
end

# Full request
def api_call(url: String): Hash<String, Any> | nil
  uri = URI(url)
  response = Net::HTTP.get_response(uri)

  return nil unless response.is_a?(Net::HTTPSuccess)

  JSON.parse(response.body)
end
```

**Type Signatures:**
- `Net::HTTP.get(uri: URI): String`
- `Net::HTTP.post(uri: URI, data: String, headers: Hash<String, String>?): Net::HTTPResponse`
- `Net::HTTP.get_response(uri: URI): Net::HTTPResponse`
- `Net::HTTPResponse#code: String`
- `Net::HTTPResponse#body: String`
- `Net::HTTPResponse#[](key: String): String?`

## URI

URI parsing and manipulation.

```trb
require 'uri'

# Parse URI
def parse_url(url: String): URI::HTTP | URI::HTTPS
  URI.parse(url) as URI::HTTP
end

# Build URI
def build_api_url(host: String, path: String, query: Hash<String, String>): String
  uri = URI::HTTP.build(
    host: host,
    path: path,
    query: URI.encode_www_form(query)
  )
  uri.to_s
end
```

**Type Signatures:**
- `URI.parse(uri: String): URI::Generic`
- `URI.encode_www_form(params: Hash<String, String>): String`
- `URI::HTTP.build(params: Hash<Symbol, String>): URI::HTTP`
- `URI#host: String?`
- `URI#path: String?`
- `URI#query: String?`
- `URI#to_s: String`

## CSV

CSV file handling.

```trb
require 'csv'

# Read CSV
def load_csv(path: String): Array<Array<String>>
  CSV.read(path)
end

# Read with headers
def load_users(path: String): Array<Hash<String, String>>
  result: Array<Hash<String, String>> = []

  CSV.foreach(path, headers: true) do |row|
    result << row.to_h
  end

  result
end

# Write CSV
def save_csv(path: String, data: Array<Array<String>>): void
  CSV.open(path, 'w') do |csv|
    data.each { |row| csv << row }
  end
end
```

**Type Signatures:**
- `CSV.read(path: String): Array<Array<String>>`
- `CSV.foreach(path: String, options: Hash<Symbol, Any>?, &block: Proc<CSV::Row, void>): void`
- `CSV.open(path: String, mode: String, &block: Proc<CSV, void>): void`
- `CSV#<<(row: Array<String>): void`
- `CSV::Row#to_h: Hash<String, String>`

## Logger

Logging functionality.

```trb
require 'logger'

# Create logger
def setup_logger(path: String): Logger
  Logger.new(path)
end

# Log messages
def log_event(logger: Logger, message: String): void
  logger.info(message)
end

# Different log levels
def log_error(logger: Logger, error: Exception): void
  logger.error(error.message)
  logger.debug(error.backtrace.join("\n"))
end
```

**Type Signatures:**
- `Logger.new(logdev: String | IO): Logger`
- `Logger#debug(message: String): void`
- `Logger#info(message: String): void`
- `Logger#warn(message: String): void`
- `Logger#error(message: String): void`
- `Logger#fatal(message: String): void`
- `Logger#level=(severity: Integer): void`

## Pathname

Object-oriented path manipulation.

```trb
require 'pathname'

# Path operations
def process_directory(path: String): Array<String>
  dir = Pathname.new(path)
  dir.children.map { |child| child.to_s }
end

# Path queries
def find_config(dir: String): Pathname | nil
  path = Pathname.new(dir)
  config = path / "config.yml"

  config.exist? ? config : nil
end
```

**Type Signatures:**
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

In-memory string streams.

```trb
require 'stringio'

# Create string buffer
def build_output: String
  buffer = StringIO.new
  buffer.puts "Header"
  buffer.puts "Content"
  buffer.string
end

# Read from string
def parse_data(content: String): Array<String>
  io = StringIO.new(content)
  io.readlines
end
```

**Type Signatures:**
- `StringIO.new(string: String?): StringIO`
- `StringIO#puts(str: String): void`
- `StringIO#write(str: String): Integer`
- `StringIO#read: String`
- `StringIO#readlines: Array<String>`
- `StringIO#string: String`

## Set

Collection of unique elements.

```trb
require 'set'

# Create and use sets
def unique_tags(posts: Array<Hash<Symbol, Array<String>>>): Set<String>
  tags = Set<String>.new

  posts.each do |post|
    post[:tags].each { |tag| tags.add(tag) }
  end

  tags
end

# Set operations
def common_interests(users: Array<Hash<Symbol, Set<String>>>): Set<String>
  return Set.new if users.empty?

  users.map { |u| u[:interests] }.reduce { |a, b| a & b }
end
```

**Type Signatures:**
- `Set.new(enum: Array<T>?): Set<T>`
- `Set#add(item: T): Set<T>`
- `Set#delete(item: T): Set<T>`
- `Set#include?(item: T): Boolean`
- `Set#size: Integer`
- `Set#empty?: Boolean`
- `Set#to_a: Array<T>`
- `Set#&(other: Set<T>): Set<T>` - Intersection
- `Set#|(other: Set<T>): Set<T>` - Union
- `Set#-(other: Set<T>): Set<T>` - Difference

## OpenStruct

Dynamic attribute objects.

```trb
require 'ostruct'

# Create struct
def create_config: OpenStruct
  OpenStruct.new(
    host: "localhost",
    port: 3000,
    debug: true
  )
end

# Access properties
def get_host(config: OpenStruct): String
  config.host as String
end
```

**Type Signatures:**
- `OpenStruct.new(hash: Hash<Symbol, Any>?): OpenStruct`
- `OpenStruct#[](key: Symbol): Any`
- `OpenStruct#[]=(key: Symbol, value: Any): void`
- `OpenStruct#to_h: Hash<Symbol, Any>`

## Benchmark

Performance measurement.

```trb
require 'benchmark'

# Measure execution time
def measure_operation: Float
  result = Benchmark.measure do
    1_000_000.times { |i| i * 2 }
  end
  result.real
end

# Compare implementations
def compare_methods: void
  Benchmark.bm do |x|
    x.report("map") { (1..1000).map { |i| i * 2 } }
    x.report("each") { (1..1000).each { |i| i * 2 } }
  end
end
```

**Type Signatures:**
- `Benchmark.measure(&block: Proc<void>): Benchmark::Tms`
- `Benchmark.bm(&block: Proc<Benchmark::Job, void>): void`
- `Benchmark::Tms#real: Float`
- `Benchmark::Tms#total: Float`

## ERB

Embedded Ruby templating.

```trb
require 'erb'

# Render template
def render_template(template: String, name: String): String
  erb = ERB.new(template)
  erb.result(binding)
end

# From file
def render_email(user_name: String): String
  template = File.read("templates/email.erb")
  ERB.new(template).result(binding)
end
```

**Type Signatures:**
- `ERB.new(str: String): ERB`
- `ERB#result(binding: Binding?): String`

## Base64

Base64 encoding and decoding.

```trb
require 'base64'

# Encode
def encode_data(data: String): String
  Base64.strict_encode64(data)
end

# Decode
def decode_data(encoded: String): String
  Base64.strict_decode64(encoded)
end

# URL-safe encoding
def url_safe_token(data: String): String
  Base64.urlsafe_encode64(data)
end
```

**Type Signatures:**
- `Base64.encode64(str: String): String`
- `Base64.decode64(str: String): String`
- `Base64.strict_encode64(str: String): String`
- `Base64.strict_decode64(str: String): String`
- `Base64.urlsafe_encode64(str: String): String`
- `Base64.urlsafe_decode64(str: String): String`

## Digest

Hash functions (MD5, SHA, etc.).

```trb
require 'digest'

# MD5 hash
def md5_hash(data: String): String
  Digest::MD5.hexdigest(data)
end

# SHA256 hash
def sha256_hash(data: String): String
  Digest::SHA256.hexdigest(data)
end

# File checksum
def file_checksum(path: String): String
  Digest::SHA256.file(path).hexdigest
end
```

**Type Signatures:**
- `Digest::MD5.hexdigest(str: String): String`
- `Digest::SHA1.hexdigest(str: String): String`
- `Digest::SHA256.hexdigest(str: String): String`
- `Digest::SHA256.file(path: String): Digest::SHA256`
- `Digest::Base#hexdigest: String`

## SecureRandom

Cryptographically secure random values.

```trb
require 'securerandom'

# Random hex
def generate_token: String
  SecureRandom.hex(32)
end

# UUID
def generate_uuid: String
  SecureRandom.uuid
end

# Random bytes
def random_bytes(size: Integer): String
  SecureRandom.bytes(size)
end
```

**Type Signatures:**
- `SecureRandom.hex(n: Integer?): String`
- `SecureRandom.uuid: String`
- `SecureRandom.bytes(n: Integer): String`
- `SecureRandom.random_number(n: Integer | Float?): Integer | Float`

## Timeout

Execute code with timeout.

```trb
require 'timeout'

# With timeout
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

**Type Signatures:**
- `Timeout.timeout(sec: Integer | Float, &block: Proc<T>): T`

## Coverage Map

Quick reference table of stdlib module support:

| Module | Status | Notes |
|--------|--------|-------|
| `File` | ✅ Supported | Full type coverage |
| `Dir` | ✅ Supported | Full type coverage |
| `FileUtils` | ✅ Supported | Common methods typed |
| `JSON` | ✅ Supported | Use type casting for safety |
| `YAML` | ✅ Supported | Use type casting for safety |
| `Net::HTTP` | ✅ Supported | Basic operations |
| `URI` | ✅ Supported | Parsing and building |
| `CSV` | ✅ Supported | Reading and writing |
| `Logger` | ✅ Supported | All log levels |
| `Pathname` | ✅ Supported | Path operations |
| `StringIO` | ✅ Supported | Stream operations |
| `Set` | ✅ Supported | Generic `Set<T>` |
| `OpenStruct` | ⚠️ Partial | Dynamic attributes use Any |
| `Benchmark` | ✅ Supported | Performance measurement |
| `ERB` | ✅ Supported | Template rendering |
| `Base64` | ✅ Supported | Encoding/decoding |
| `Digest` | ✅ Supported | Hash functions |
| `SecureRandom` | ✅ Supported | Secure random generation |
| `Timeout` | ✅ Supported | Timeout execution |
| `Socket` | 🚧 Planned | Coming soon |
| `Thread` | 🚧 Planned | Coming soon |
| `Queue` | 🚧 Planned | Coming soon |

## Using Stdlib Types

### Import and Use

```trb
# Import stdlib modules
require 'json'
require 'fileutils'

# Use with type safety
def process_config(path: String): Hash<String, Any> | nil
  return nil unless File.exist?(path)

  content = File.read(path)
  JSON.parse(content) as Hash<String, Any>
end
```

### Type Casting

For dynamic stdlib modules, use type casting:

```trb
# Safe casting
def load_users(path: String): Array<Hash<String, String>>
  raw_data = JSON.parse(File.read(path))

  if raw_data.is_a?(Array)
    raw_data as Array<Hash<String, String>>
  else
    []
  end
end
```

### Custom Wrappers

Create typed wrappers for better safety:

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

## Best Practices

1. **Type cast dynamic results** - Use `as` for JSON/YAML parsing
2. **Create type-safe wrappers** - Wrap dynamic libraries with typed interfaces
3. **Handle nil cases** - Stdlib methods often return nil
4. **Use union types** - Many stdlib methods have multiple return types
5. **Validate external data** - Don't trust parsed JSON/YAML types

## Contributing Stdlib Types

Want to help expand stdlib coverage? See the [Contributing Guide](/docs/project/contributing) for details on adding new standard library type definitions.

## Next Steps

- [Built-in Types](/docs/reference/built-in-types) - Core type reference
- [Type Operators](/docs/reference/type-operators) - Type manipulation
- [Cheatsheet](/docs/reference/cheatsheet) - Quick syntax reference
