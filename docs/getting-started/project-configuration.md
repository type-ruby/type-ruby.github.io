---
sidebar_position: 5
title: Project Configuration
description: Configure T-Ruby for your project
---

# Project Configuration

For larger projects, T-Ruby uses a configuration file to manage compiler options, paths, and behavior.

## Configuration File

Create a `trc.yaml` file in your project root:

```yaml title="trc.yaml"
# T-Ruby Configuration

# Compiler version requirement
version: ">=1.0.0"

# Source files configuration
source:
  # Directories to include
  include:
    - src
    - lib
  # Patterns to exclude
  exclude:
    - "**/*_test.trb"
    - "**/fixtures/**"

# Output configuration
output:
  # Where to write compiled .rb files
  ruby_dir: build
  # Where to write .rbs signature files
  rbs_dir: sig
  # Preserve source directory structure
  preserve_structure: true

# Compiler options
compiler:
  # Strictness level: "strict" | "standard" | "permissive"
  strictness: standard
  # Generate .rbs files
  generate_rbs: true
  # Target Ruby version
  target_ruby: "3.0"
```

## Initializing a Project

Use `trc init` to create a configuration file:

```bash
trc init
```

This creates a `trc.yaml` with sensible defaults.

For interactive setup:

```bash
trc init --interactive
```

## Configuration Options Reference

### Source Configuration

```yaml
source:
  # Directories containing .trb files
  include:
    - src
    - lib
    - app

  # Files/patterns to exclude
  exclude:
    - "**/*_test.trb"
    - "**/*_spec.trb"
    - "**/vendor/**"
    - "**/node_modules/**"

  # File extensions to process (default: [".trb"])
  extensions:
    - .trb
    - .truby
```

### Output Configuration

```yaml
output:
  # Directory for compiled Ruby files
  ruby_dir: build

  # Directory for RBS signature files
  rbs_dir: sig

  # Preserve source directory structure in output
  # true:  src/models/user.trb → build/models/user.rb
  # false: src/models/user.trb → build/user.rb
  preserve_structure: true

  # Clean output directory before compilation
  clean_before_build: false
```

### Compiler Options

```yaml
compiler:
  # Strictness level
  # - strict: All code must be fully typed
  # - standard: Types required for public APIs
  # - permissive: Minimal type requirements
  strictness: standard

  # Generate RBS files
  generate_rbs: true

  # Target Ruby version (affects generated code)
  target_ruby: "3.0"

  # Enable experimental features
  experimental:
    - pattern_matching_types
    - refinement_types

  # Additional type checking rules
  checks:
    # Warn on implicit any types
    no_implicit_any: true
    # Error on unused variables
    no_unused_vars: false
    # Strict nil checking
    strict_nil: true
```

### Watch Mode Configuration

```yaml
watch:
  # Additional directories to watch
  paths:
    - config

  # Debounce delay in milliseconds
  debounce: 100

  # Clear terminal on rebuild
  clear_screen: true

  # Run command after successful compile
  on_success: "bundle exec rspec"
```

### Type Resolution

```yaml
types:
  # Additional type definition paths
  paths:
    - types
    - vendor/types

  # Auto-import standard library types
  stdlib: true

  # External type definitions
  external:
    - rails
    - rspec
```

## Directory Structure

A typical T-Ruby project structure:

```
my-project/
├── trc.yaml              # Configuration
├── src/                  # T-Ruby source files
│   ├── models/
│   │   ├── user.trb
│   │   └── post.trb
│   ├── services/
│   │   └── auth_service.trb
│   └── main.trb
├── types/                # Custom type definitions
│   └── external.rbs
├── build/                # Compiled Ruby output
│   ├── models/
│   │   ├── user.rb
│   │   └── post.rb
│   └── ...
├── sig/                  # Generated RBS files
│   ├── models/
│   │   ├── user.rbs
│   │   └── post.rbs
│   └── ...
└── test/                 # Tests (can be .rb or .trb)
    └── ...
```

## Environment-Specific Configuration

Use environment variables or multiple config files:

```yaml title="trc.yaml"
# Base configuration

compiler:
  strictness: ${TRC_STRICTNESS:-standard}

output:
  ruby_dir: ${TRC_OUTPUT:-build}
```

Or use separate files:

```bash
# Development
trc --config trc.development.yaml

# Production
trc --config trc.production.yaml
```

## Integration with Bundler

Add T-Ruby to your Gemfile:

```ruby title="Gemfile"
source "https://rubygems.org"

group :development do
  gem "t-ruby"
end

# Your other dependencies
```

Create a Rake task:

```ruby title="Rakefile"
require "t-ruby/rake_task"

TRuby::RakeTask.new(:compile) do |t|
  t.config_file = "trc.yaml"
end

# Compile before running tests
task test: :compile
```

Now you can run:

```bash
bundle exec rake compile
bundle exec rake test
```

## Integration with Rails

For Rails projects, configure T-Ruby to work with the Rails structure:

```yaml title="trc.yaml"
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - lib

output:
  ruby_dir: app  # Compile in place
  preserve_structure: true

compiler:
  strictness: standard

types:
  external:
    - rails
    - activerecord
```

Add to your `config/application.rb`:

```ruby
# Watch .trb files in development
config.watchable_extensions << "trb"
```

## CI/CD Integration

### GitHub Actions

```yaml title=".github/workflows/typecheck.yml"
name: Type Check

on: [push, pull_request]

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install T-Ruby
        run: gem install t-ruby

      - name: Type Check
        run: trc check .

      - name: Compile
        run: trc .
```

### GitLab CI

```yaml title=".gitlab-ci.yml"
typecheck:
  image: ruby:3.2
  script:
    - gem install t-ruby
    - trc check .
    - trc .
```

## Monorepo Configuration

For monorepos with multiple packages:

```
monorepo/
├── packages/
│   ├── core/
│   │   ├── trc.yaml
│   │   └── src/
│   ├── web/
│   │   ├── trc.yaml
│   │   └── src/
│   └── api/
│       ├── trc.yaml
│       └── src/
└── trc.workspace.yaml
```

```yaml title="trc.workspace.yaml"
workspace:
  packages:
    - packages/core
    - packages/web
    - packages/api

  # Shared configuration
  shared:
    compiler:
      strictness: strict
      target_ruby: "3.2"
```

Build all packages:

```bash
trc --workspace
```

## Next Steps

With your project configured, explore:

- [CLI Commands](/docs/cli/commands) - All available commands
- [Compiler Options](/docs/cli/compiler-options) - Detailed option reference
- [Type Annotations](/docs/learn/basics/type-annotations) - Start writing typed code
