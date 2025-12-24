---
sidebar_position: 1
title: RBS Integration
description: How T-Ruby generates and works with RBS files
---

<DocsBadge />


# RBS Integration

T-Ruby seamlessly integrates with RBS (Ruby Signature), Ruby's official type signature format. When you compile T-Ruby code, the compiler automatically generates `.rbs` files alongside the Ruby output, enabling integration with the broader Ruby typing ecosystem.

## What is RBS?

RBS is Ruby's standard format for type signatures. It's a separate language for describing the structure of Ruby programs, including:

- Method signatures
- Class and module definitions
- Instance and class variables
- Generics and type parameters

## How T-Ruby Generates RBS

When you compile T-Ruby code, the compiler extracts type information and generates corresponding RBS files.

### Basic Example

**T-Ruby input** (`user.trb`):

```trb
class User
  @id: Integer
  @name: String
  @email: String

  def initialize(id: Integer, name: String, email: String): void
    @id = id
    @name = name
    @email = email
  end

  def greet: String
    "Hello, I'm #{@name}!"
  end

  def update_email(new_email: String): void
    @email = new_email
  end
end
```

**Generated RBS** (`sig/user.rbs`):

```rbs
class User
  @id: Integer
  @name: String
  @email: String

  def initialize: (Integer id, String name, String email) -> void
  def greet: () -> String
  def update_email: (String new_email) -> void
end
```

**Generated Ruby** (`build/user.rb`):

```ruby
class User
  def initialize(id, name, email)
    @id = id
    @name = name
    @email = email
  end

  def greet
    "Hello, I'm #{@name}!"
  end

  def update_email(new_email)
    @email = new_email
  end
end
```

## Compilation Options

### Enable/Disable RBS Generation

By default, RBS files are generated. You can control this:

```yaml title="trbconfig.yml"
compiler:
  generate_rbs: true  # Default
```

Or via command line:

```bash
# Skip RBS generation
trc compile --no-rbs src/

# Generate only RBS (skip Ruby)
trc compile --rbs-only src/
```

### RBS Output Directory

Configure where RBS files are written:

```yaml title="trbconfig.yml"
output:
  rbs_dir: sig  # Default
```

```bash
trc compile --rbs-dir signatures/ src/
```

## RBS Features Supported

### Method Signatures

T-Ruby automatically generates method signatures with parameters and return types.

```trb title="calculator.trb"
def add(a: Integer, b: Integer): Integer
  a + b
end

def divide(a: Float, b: Float): Float | nil
  return nil if b == 0
  a / b
end
```

```rbs title="sig/calculator.rbs"
def add: (Integer a, Integer b) -> Integer
def divide: (Float a, Float b) -> (Float | nil)
```

### Optional and Keyword Parameters

```trb title="formatter.trb"
def format(
  text: String,
  uppercase: Boolean = false,
  prefix: String? = nil
): String
  result = uppercase ? text.upcase : text
  prefix ? "#{prefix}#{result}" : result
end
```

```rbs title="sig/formatter.rbs"
def format: (
  String text,
  ?Boolean uppercase,
  ?String? prefix
) -> String
```

### Block Signatures

```trb title="iterator.trb"
def each_item(items: Array<String>): void do |String| -> void end
  items.each { |item| yield item }
end
```

```rbs title="sig/iterator.rbs"
def each_item: (Array[String] items) { (String) -> void } -> void
```

### Generics

T-Ruby's generic types map directly to RBS generics.

```trb title="container.trb"
class Container<T>
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
```

```rbs title="sig/container.rbs"
class Container[T]
  @value: T

  def initialize: (T value) -> void
  def get: () -> T
  def set: (T value) -> void
end
```

### Union Types

```trb title="parser.trb"
def parse(input: String): Integer | Float | nil
  return nil if input.empty?

  if input.include?(".")
    input.to_f
  else
    input.to_i
  end
end
```

```rbs title="sig/parser.rbs"
def parse: (String input) -> (Integer | Float | nil)
```

### Modules and Mixins

```trb title="loggable.trb"
module Loggable
  def log(message: String): void
    puts "[LOG] #{message}"
  end

  def log_error(error: String): void
    puts "[ERROR] #{error}"
  end
end

class Service
  include Loggable

  def process: void
    log("Processing...")
  end
end
```

```rbs title="sig/loggable.rbs"
module Loggable
  def log: (String message) -> void
  def log_error: (String error) -> void
end

class Service
  include Loggable

  def process: () -> void
end
```

### Type Aliases

```trb title="types.trb"
type UserId = Integer
type UserMap = Hash<UserId, User>

def find_users(ids: Array<UserId>): UserMap
  # ...
end
```

```rbs title="sig/types.rbs"
type UserId = Integer
type UserMap = Hash[UserId, User]

def find_users: (Array[UserId] ids) -> UserMap
```

### Interfaces

T-Ruby interfaces are converted to RBS interface types.

```trb title="printable.trb"
interface Printable
  def to_s: String
  def print: void
end

class Document
  implements Printable

  def to_s: String
    "Document"
  end

  def print: void
    puts to_s
  end
end
```

```rbs title="sig/printable.rbs"
interface _Printable
  def to_s: () -> String
  def print: () -> void
end

class Document
  include _Printable

  def to_s: () -> String
  def print: () -> void
end
```

## Using Generated RBS Files

### With Steep

Steep can use T-Ruby's generated RBS files for type checking:

```yaml title="Steepfile"
target :app do
  signature "sig"  # T-Ruby generated signatures
  check "build"    # Compiled Ruby files
end
```

```bash
trc compile src/
steep check
```

### With Ruby LSP

Configure Ruby LSP to use T-Ruby's RBS files:

```json title=".vscode/settings.json"
{
  "rubyLsp.enabledFeatures": {
    "diagnostics": true
  },
  "rubyLsp.typechecker": "steep",
  "rubyLsp.rbs.path": "sig"
}
```

### With Sorbet

Generate Sorbet-compatible type stubs from RBS:

```bash
# Generate RBS files
trc compile --rbs-only src/

# Convert to Sorbet stubs
rbs-to-sorbet sig/ sorbet/rbi/
```

### With Standard Gem

Import RBS signatures into gems:

```ruby title="my_gem.gemspec"
Gem::Specification.new do |spec|
  spec.name = "my_gem"
  spec.files = Dir["lib/**/*", "sig/**/*"]
  spec.metadata["rbs_signatures"] = "sig"
end
```

## Advanced RBS Generation

### Custom RBS Annotations

Add RBS-specific annotations in comments:

```rbs title="service.trb"
class Service
  # @rbs_skip
  def debug_method: void
    # This method won't appear in RBS
  end

  # @rbs_override
  # def custom_signature: (String) -> Integer
  def custom_method(input: String): Integer
    input.length
  end
end
```

### External RBS Integration

Combine T-Ruby's generated RBS with hand-written RBS:

```
sig/
├── generated/      # T-Ruby generated
│   ├── user.rbs
│   └── service.rbs
└── manual/         # Hand-written
    └── external.rbs
```

```yaml title="trbconfig.yml"
output:
  rbs_dir: sig/generated

types:
  paths:
    - sig/manual
    - sig/generated
```

### Merging RBS Files

If you have existing RBS files:

```bash
# Generate new RBS
trc compile --rbs-only src/

# Merge with existing
rbs merge sig/generated/ sig/manual/ -o sig/merged/
```

## RBS Validation

Validate generated RBS files:

```bash
# Generate RBS
trc compile src/

# Validate with RBS
rbs validate --signature-path=sig/
```

T-Ruby ensures generated RBS is always valid, but validation is useful when:
- Combining with hand-written RBS
- Using external type definitions
- Debugging type issues

## RBS and Type Checking Flow

Here's how T-Ruby's RBS integration fits into type checking:

```
┌─────────────┐
│  .trb files │
│  (T-Ruby)   │
└──────┬──────┘
       │
       ▼
   ┌────────┐
   │  trc   │  Compile
   └───┬────┘
       │
       ├──────────┐
       ▼          ▼
 ┌──────────┐  ┌──────────┐
 │ .rb files│  │.rbs files│
 │ (Ruby)   │  │  (RBS)   │
 └─────┬────┘  └────┬─────┘
       │            │
       │            ▼
       │      ┌──────────┐
       │      │  Steep   │  Type check
       │      │ Ruby LSP │
       │      └──────────┘
       │
       ▼
  ┌──────────┐
  │   Ruby   │  Execute
  │Interpreter│
  └──────────┘
```

## Practical Examples

### Example 1: Library Development

Create a typed library with RBS:

```trb title="lib/my_library.trb"
module MyLibrary
  class Client
    @api_key: String
    @endpoint: String

    def initialize(api_key: String, endpoint: String = "https://api.example.com"): void
      @api_key = api_key
      @endpoint = endpoint
    end

    def get<T>(path: String, params: Hash<String, Any> = {}): T | nil
      # Implementation
    end

    def post<T>(path: String, body: Hash<String, Any>): T
      # Implementation
    end
  end
end
```

Compile:

```bash
trc compile lib/
```

Generated files:

```
lib/
├── my_library.rb   # For runtime
sig/
└── my_library.rbs  # For type checking and documentation
```

Users can now:

```ruby
# Use in Ruby
require "my_library"
client = MyLibrary::Client.new("key123")

# Type check with Steep
# steep check uses sig/my_library.rbs
```

### Example 2: Rails Application

Use RBS with Rails models:

```trb title="app/models/user.trb"
class User < ApplicationRecord
  @name: String
  @email: String
  @admin: Boolean

  def self.find_by_email(email: String): User | nil
    find_by(email: email)
  end

  def admin?: Boolean
    @admin
  end

  def promote_to_admin: void
    update!(admin: true)
  end
end
```

```yaml title="trbconfig.yml"
source:
  include:
    - app/models

output:
  ruby_dir: app/models
  rbs_dir: sig
```

Compile:

```bash
trc compile
```

Now Steep can check your Rails app:

```yaml title="Steepfile"
target :app do
  signature "sig"
  check "app"

  library "activerecord"
end
```

### Example 3: Gem with Type Signatures

Package RBS with your gem:

```ruby title="my_gem.gemspec"
Gem::Specification.new do |spec|
  spec.name = "my_typed_gem"
  spec.version = "1.0.0"

  spec.files = Dir[
    "lib/**/*.rb",
    "sig/**/*.rbs"
  ]

  spec.metadata = {
    "rbs_signatures" => "sig"
  }
end
```

Users automatically get type information when using your gem.

## Troubleshooting

### RBS Generation Fails

If RBS generation fails:

```bash
# Check compilation with verbose output
trc compile --verbose src/

# Validate T-Ruby types first
trc check src/

# Generate RBS separately
trc compile --rbs-only src/
```

### RBS Validation Errors

If RBS validation fails:

```bash
# Check specific RBS file
rbs validate sig/user.rbs

# View generated RBS
cat sig/user.rbs

# Re-generate with debug
trc compile --log-level debug src/
```

### Type Mismatches

If types don't match between T-Ruby and RBS:

```bash
# Check what RBS was generated
trc compile --rbs-only --output-file - src/user.trb

# Use type tracing
trc compile --trace src/
```

## Best Practices

### 1. Keep RBS in Version Control

```bash
git add sig/
git commit -m "Update RBS signatures"
```

RBS files are source code - commit them alongside Ruby files.

### 2. Validate RBS in CI

```yaml title=".github/workflows/ci.yml"
- name: Generate and Validate RBS
  run: |
    trc compile src/
    rbs validate --signature-path=sig/
```

### 3. Document Public APIs

RBS files serve as documentation. Ensure public APIs are well-typed:

```trb
# Good - clear public API
class Service
  def process(data: Array<String>): Hash<String, Integer>
    # ...
  end

  private

  def internal_helper(x)  # Private can be untyped
    # ...
  end
end
```

### 4. Use Type Aliases for Clarity

```trb
type UserId = Integer
type ResponseData = Hash<String, Any>

def fetch_user(id: UserId): ResponseData
  # ...
end
```

### 5. Combine with Hand-Written RBS

Keep generated and manual RBS separate:

```
sig/
├── generated/     # From T-Ruby
└── manual/        # Hand-written
```

## Next Steps

- [Using Steep](/docs/tooling/steep) - Type check with Steep
- [Ruby LSP Integration](/docs/tooling/ruby-lsp) - IDE support
- [RBS Official Documentation](https://github.com/ruby/rbs) - Learn more about RBS
