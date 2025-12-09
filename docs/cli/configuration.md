---
sidebar_position: 2
title: Configuration
description: T-Ruby configuration file reference
---

# Configuration

T-Ruby uses a `trc.yaml` file to configure compiler behavior, source files, output locations, and type checking rules. This reference covers all available configuration options.

## Configuration File

Place `trc.yaml` in your project root:

```yaml title="trc.yaml"
# T-Ruby configuration file
version: ">=1.0.0"

source:
  include:
    - src
    - lib
  exclude:
    - "**/*_test.trb"

output:
  ruby_dir: build
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: standard
  generate_rbs: true
  target_ruby: "3.2"
```

## Creating Configuration

Generate a configuration file:

```bash
# Create with defaults
trc init

# Interactive setup
trc init --interactive

# Use template
trc init --template rails
```

## Configuration Sections

### version

Specify the minimum T-Ruby compiler version required:

```yaml
version: ">=1.0.0"
```

Supported formats:
```yaml
version: "1.0.0"        # Exact version
version: ">=1.0.0"      # Minimum version
version: "~>1.0"        # Compatible version
version: ">=1.0,<2.0"   # Range
```

### source

Configure which files to compile:

```yaml
source:
  # Directories to include
  include:
    - src
    - lib
    - app

  # Patterns to exclude
  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/fixtures/**"
    - "**/tmp/**"

  # File extensions (default: [".trb"])
  extensions:
    - .trb
    - .truby
```

**Include paths** can be:
- Directories: `src`, `lib/models`
- Glob patterns: `src/**/*.trb`
- Individual files: `app/main.trb`

**Exclude patterns** support:
- Wildcards: `**/test/**`, `*_spec.trb`
- Negation: `!important_test.trb`

Example with complex patterns:

```yaml
source:
  include:
    - src
    - lib
    - "config/**/*.trb"  # Include config files

  exclude:
    # Exclude all test files
    - "**/*_test.trb"
    - "**/*_spec.trb"

    # Exclude vendor code
    - "**/vendor/**"
    - "**/node_modules/**"

    # Exclude generated files
    - "**/generated/**"
    - "**/*.generated.trb"

    # But include specific test
    - "!test/important_integration_test.trb"
```

### output

Configure where compiled files are written:

```yaml
output:
  # Directory for compiled Ruby files
  ruby_dir: build

  # Directory for RBS signature files
  rbs_dir: sig

  # Preserve source directory structure
  preserve_structure: true

  # Clean output directory before build
  clean_before_build: false

  # File extension for Ruby output (default: .rb)
  ruby_extension: .rb

  # File extension for RBS output (default: .rbs)
  rbs_extension: .rbs
```

#### preserve_structure

When `true`, maintains source directory hierarchy:

```yaml
preserve_structure: true
```

```
src/
├── models/
│   └── user.trb
└── services/
    └── auth.trb
```

Compiles to:

```
build/
├── models/
│   └── user.rb
└── services/
    └── auth.rb
```

When `false`, flattens output:

```yaml
preserve_structure: false
```

```
build/
├── user.rb
└── auth.rb
```

#### clean_before_build

Remove all files in output directories before compilation:

```yaml
output:
  clean_before_build: true  # Clean build/ and sig/ before compile
```

Useful for:
- Removing orphaned files
- Ensuring clean builds in CI
- Avoiding conflicts with renamed files

### compiler

Configure compiler behavior and type checking:

```yaml
compiler:
  # Strictness level
  strictness: standard

  # Generate RBS files
  generate_rbs: true

  # Target Ruby version
  target_ruby: "3.2"

  # Type checking options
  checks:
    no_implicit_any: true
    no_unused_vars: false
    strict_nil: true
    no_unchecked_indexed_access: false

  # Experimental features
  experimental:
    - pattern_matching_types
    - refinement_types

  # Optimization level
  optimization: none
```

#### strictness

Controls type checking rigor:

```yaml
compiler:
  strictness: strict  # strict | standard | permissive
```

**strict** - Maximum type safety:
- All functions must have parameter and return types
- All instance variables must be typed
- All local variables must be explicitly typed or inferred
- No implicit `any` types allowed
- Strict nil checking enabled

```ruby
# Required in strict mode
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result: Hash<String, Integer> = {}
  # ...
end
```

**standard** (recommended) - Balanced approach:
- Public API methods must be typed
- Private methods can omit types (inferred)
- Instance variables must be typed
- Local variables can be inferred
- Warns on implicit `any`

```ruby
# OK in standard mode
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result = {}  # Type inferred
  # ...
end

private

def helper(x)  # Private, type inferred
  x * 2
end
```

**permissive** - Gradual typing:
- Only explicit type errors are caught
- Implicit `any` types allowed
- Useful for migrating existing code

```ruby
# OK in permissive mode
def process(data)
  @count = 0
  result = {}
  # ...
end
```

#### target_ruby

Generate code compatible with specific Ruby versions:

```yaml
compiler:
  target_ruby: "3.2"
```

Affects:
- Syntax features used in output
- Standard library type definitions
- Method availability checks

Supported versions: `"2.7"`, `"3.0"`, `"3.1"`, `"3.2"`, `"3.3"`

Example - Pattern matching:

```ruby
# Input (.trb)
case value
in { name: String => n }
  puts n
end
```

With `target_ruby: "3.0"`:
```ruby
# Uses pattern matching (Ruby 3.0+)
case value
in { name: n }
  puts n
end
```

With `target_ruby: "2.7"`:
```ruby
# Falls back to case/when
case
when value.is_a?(Hash) && value[:name].is_a?(String)
  n = value[:name]
  puts n
end
```

#### checks

Fine-grained type checking rules:

```yaml
compiler:
  checks:
    # Disallow implicit 'any' types
    no_implicit_any: true

    # Warn on unused variables
    no_unused_vars: true

    # Strict nil checking
    strict_nil: true

    # Check indexed access (arrays, hashes)
    no_unchecked_indexed_access: true

    # Require explicit return types
    require_return_types: false

    # Disallow untyped function calls
    no_untyped_calls: false
```

**no_implicit_any**

```ruby
# Error when no_implicit_any: true
def process(data)  # Error: implicit 'any' type
  # ...
end

# OK
def process(data: Any)  # Explicit any
  # ...
end
```

**no_unused_vars**

```ruby
# Warning when no_unused_vars: true
def calculate(x: Integer, y: Integer): Integer
  result = x * 2  # Warning: 'y' is unused
  result
end
```

**strict_nil**

```ruby
# Error when strict_nil: true
def find_user(id: Integer): User  # Error: might return nil
  users.find { |u| u.id == id }
end

# OK
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end
```

**no_unchecked_indexed_access**

```ruby
# Error when no_unchecked_indexed_access: true
users: Array<User> = get_users()
user = users[0]  # Error: might be nil

# OK - Check first
if users[0]
  user = users[0]  # Safe
end

# Or use fetch with default
user = users.fetch(0, default_user)
```

#### experimental

Enable experimental features:

```yaml
compiler:
  experimental:
    - pattern_matching_types
    - refinement_types
    - variadic_generics
    - higher_kinded_types
```

**Warning:** Experimental features may change or be removed in future versions.

#### optimization

Control code optimization level:

```yaml
compiler:
  optimization: none  # none | basic | aggressive
```

- `none` - No optimization, preserve readability
- `basic` - Safe optimizations (inline constants, remove dead code)
- `aggressive` - Maximum optimization (may reduce readability)

### watch

Configure watch mode behavior:

```yaml
watch:
  # Additional paths to watch
  paths:
    - config
    - types

  # Debounce delay in milliseconds
  debounce: 100

  # Clear screen on rebuild
  clear_screen: true

  # Run command after successful compile
  on_success: "bundle exec rspec"

  # Run command after failed compile
  on_failure: "notify-send 'Build failed'"

  # Ignore patterns
  ignore:
    - "**/tmp/**"
    - "**/.git/**"
```

Example - Run tests after compile:

```yaml
watch:
  on_success: "bundle exec rake test"
  clear_screen: true
  debounce: 200
```

### types

Configure type resolution and imports:

```yaml
types:
  # Additional type definition directories
  paths:
    - types
    - vendor/types
    - custom_types

  # Auto-import standard library types
  stdlib: true

  # External type definitions
  external:
    - rails
    - rspec
    - activerecord

  # Type aliases
  aliases:
    UserId: Integer
    Timestamp: Integer

  # Strict mode for type imports
  strict_imports: false
```

#### paths

Directories containing `.rbs` type definition files:

```yaml
types:
  paths:
    - types          # Project-specific types
    - vendor/types   # Third-party types
```

```
types/
├── custom.rbs
└── external/
    └── third_party.rbs
```

#### external

Import type definitions for libraries:

```yaml
types:
  external:
    - rails
    - rspec
    - sidekiq
```

T-Ruby will look for these in:
1. Bundled type definitions
2. Gem's `sig/` directory
3. RBS repository

#### stdlib

Include Ruby standard library types:

```yaml
types:
  stdlib: true  # Import Array, Hash, String, etc.
```

### plugins

Extend T-Ruby with plugins:

```yaml
plugins:
  # Custom plugins
  - name: my_custom_plugin
    path: ./plugins/custom.rb
    options:
      setting: value

  # Built-in plugins
  - name: rails_types
    enabled: true

  - name: graphql_types
    enabled: true
```

### linting

Configure linting rules:

```yaml
linting:
  # Enable linter
  enabled: true

  # Rules configuration
  rules:
    # Naming conventions
    naming_convention: snake_case
    class_naming: PascalCase
    constant_naming: SCREAMING_SNAKE_CASE

    # Complexity
    max_method_lines: 50
    max_class_lines: 300
    max_complexity: 10

    # Style
    prefer_single_quotes: true
    require_trailing_comma: false

  # Disable specific rules
  disabled_rules:
    - prefer_ternary
    - max_line_length
```

## Environment Variables

Override configuration with environment variables:

```yaml
compiler:
  strictness: ${TRC_STRICTNESS:-standard}
  target_ruby: ${RUBY_VERSION:-3.2}

output:
  ruby_dir: ${TRC_OUTPUT_DIR:-build}
```

Usage:

```bash
TRC_STRICTNESS=strict trc compile .
RUBY_VERSION=3.0 trc compile .
```

## Multiple Configuration Files

Use different configs for different environments:

```bash
# Development
trc --config trc.development.yaml compile

# Production
trc --config trc.production.yaml compile

# Testing
trc --config trc.test.yaml check
```

**trc.development.yaml:**
```yaml
compiler:
  strictness: permissive
  checks:
    no_unused_vars: false

watch:
  on_success: "bundle exec rspec"
```

**trc.production.yaml:**
```yaml
compiler:
  strictness: strict
  optimization: aggressive
  checks:
    no_implicit_any: true
    no_unused_vars: true

output:
  clean_before_build: true
```

## Configuration Inheritance

Create base configuration and extend it:

**trc.base.yaml:**
```yaml
compiler:
  target_ruby: "3.2"
  generate_rbs: true

types:
  stdlib: true
```

**trc.yaml:**
```yaml
extends: trc.base.yaml

compiler:
  strictness: standard

source:
  include:
    - src
```

## Workspace Configuration

For monorepos with multiple packages:

**trc.workspace.yaml:**
```yaml
workspace:
  # Package locations
  packages:
    - packages/core
    - packages/web
    - packages/api

  # Shared configuration
  shared:
    compiler:
      target_ruby: "3.2"
      strictness: strict

  # Per-package overrides
  overrides:
    packages/web:
      compiler:
        strictness: standard
```

Each package has its own `trc.yaml`:

**packages/core/trc.yaml:**
```yaml
source:
  include:
    - lib

output:
  ruby_dir: lib
  rbs_dir: sig
```

Build workspace:

```bash
trc --workspace compile
```

## Complete Example

A comprehensive configuration for a Rails application:

```yaml title="trc.yaml"
# T-Ruby Configuration for Rails App
version: ">=1.2.0"

# Source files
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - app/jobs
    - lib

  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/concerns/**"  # Keep as Ruby
    - "**/vendor/**"

  extensions:
    - .trb

# Output
output:
  ruby_dir: app
  rbs_dir: sig
  preserve_structure: true
  clean_before_build: false

# Compiler
compiler:
  strictness: standard
  generate_rbs: true
  target_ruby: "3.2"

  checks:
    no_implicit_any: true
    strict_nil: true
    no_unused_vars: true
    no_unchecked_indexed_access: false

  experimental: []

  optimization: basic

# Watch mode
watch:
  paths:
    - config
    - app

  debounce: 150
  clear_screen: true
  on_success: "bin/rails test"

  ignore:
    - "**/tmp/**"
    - "**/log/**"

# Types
types:
  paths:
    - types
    - vendor/types

  stdlib: true

  external:
    - rails
    - activerecord
    - actionpack
    - activesupport

# Linting
linting:
  enabled: true

  rules:
    naming_convention: snake_case
    class_naming: PascalCase
    max_method_lines: 50
    max_class_lines: 300
    prefer_single_quotes: true

  disabled_rules:
    - max_line_length
```

## Configuration Schema

T-Ruby validates your configuration against a schema. Get the schema:

```bash
trc config --schema > trc-schema.json
```

Use in your editor for autocomplete and validation:

```yaml
# yaml-language-server: $schema=./trc-schema.json

version: ">=1.0.0"
# ... IDE will provide autocomplete
```

## Debugging Configuration

View effective configuration (after merging defaults and overrides):

```bash
# Show effective config
trc config --show

# Show as JSON
trc config --show --json

# Validate configuration
trc config --validate

# Show configuration sources
trc config --debug
```

Output:

```
Configuration loaded from:
  - /path/to/trc.yaml
  - Environment variables:
    - TRC_STRICTNESS=standard
  - Command line:
    - --target-ruby=3.2

Effective configuration:
  version: ">=1.0.0"
  source:
    include: ["src", "lib"]
  ...
```

## Migration Guide

### From version 0.x to 1.x

The configuration format changed in version 1.0:

**Old (0.x):**
```yaml
inputs:
  - src
output: build
rbs_output: sig
strict: true
```

**New (1.x):**
```yaml
source:
  include:
    - src
output:
  ruby_dir: build
  rbs_dir: sig
compiler:
  strictness: strict
```

Auto-migrate:

```bash
trc config --migrate
```

## Best Practices

### 1. Use strictness appropriate for project stage

```yaml
# New project - start strict
compiler:
  strictness: strict

# Migrating existing project - start permissive
compiler:
  strictness: permissive
```

### 2. Enable useful checks incrementally

```yaml
compiler:
  checks:
    # Start with these
    strict_nil: true
    no_implicit_any: true

    # Add later as code improves
    # no_unused_vars: true
    # no_unchecked_indexed_access: true
```

### 3. Use environment-specific configs

```yaml
# trc.yaml (default - development)
compiler:
  strictness: standard

# trc.production.yaml
compiler:
  strictness: strict
  optimization: aggressive
```

### 4. Document custom configuration

```yaml
# Custom configuration for our team
# See docs/truby-setup.md for details

compiler:
  # We use strict mode for better type safety
  strictness: strict

  # Don't warn on unused vars (we use _ prefix)
  checks:
    no_unused_vars: false
```

### 5. Keep configuration in version control

```bash
git add trc.yaml
git commit -m "Add T-Ruby configuration"
```

## Next Steps

- [Commands Reference](/docs/cli/commands) - Learn CLI commands
- [Compiler Options](/docs/cli/compiler-options) - Detailed compiler flags
- [Type Annotations](/docs/learn/basics/type-annotations) - Start typing your code
