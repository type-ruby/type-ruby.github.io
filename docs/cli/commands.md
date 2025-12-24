---
sidebar_position: 1
title: Commands
description: trc CLI commands reference
---

<DocsBadge />


# Commands

The `trc` command-line interface is the primary tool for working with T-Ruby. It compiles `.trb` files to Ruby, type-checks your code, and generates RBS signatures.

## Overview

```bash
trc [command] [options] [files...]
```

Available commands:

- `compile` - Compile T-Ruby files to Ruby and RBS
- `watch` - Watch files and auto-compile on changes
- `check` - Type-check without generating output
- `init` - Initialize a new T-Ruby project

## compile

Compiles T-Ruby source files (`.trb`) to Ruby (`.rb`) and RBS (`.rbs`) files.

### Basic Usage

```bash
# Compile a single file
trc compile hello.trb

# Compile multiple files
trc compile user.trb post.trb

# Compile all .trb files in directory
trc compile src/

# Compile current directory
trc compile .
```

### Shorthand

The `compile` command is the default, so you can omit it:

```bash
trc hello.trb
trc src/
trc .
```

### Options

```bash
# Specify output directory
trc compile src/ --output build/

# Generate only Ruby files (skip RBS)
trc compile src/ --no-rbs

# Generate only RBS files (skip Ruby)
trc compile src/ --rbs-only

# Specify RBS output directory
trc compile src/ --rbs-dir sig/

# Use specific config file
trc compile src/ --config trc.production.yaml

# Clean output directory before compilation
trc compile . --clean

# Show verbose output
trc compile . --verbose

# Suppress all output except errors
trc compile . --quiet
```

### Examples

**Compile with custom output directories:**

```bash
trc compile src/ \
  --output build/ \
  --rbs-dir signatures/
```

**Compile for production (clean build, no debug info):**

```bash
trc compile . \
  --clean \
  --quiet \
  --no-debug-info
```

**Compile and preserve source structure:**

```bash
trc compile src/ \
  --output build/ \
  --preserve-structure
```

This transforms:
```
src/
├── models/
│   └── user.trb
└── services/
    └── auth.trb
```

Into:
```
build/
├── models/
│   └── user.rb
└── services/
    └── auth.rb
```

### Exit Codes

- `0` - Success
- `1` - Compilation errors
- `2` - Type errors
- `3` - Configuration errors

## watch

Watches T-Ruby files and automatically recompiles when changes are detected. Perfect for development workflows.

### Basic Usage

```bash
# Watch current directory
trc watch

# Watch specific directory
trc watch src/

# Watch multiple directories
trc watch src/ lib/
```

### Options

```bash
# Clear terminal on each rebuild
trc watch --clear

# Run command after successful compilation
trc watch --exec "bundle exec rspec"

# Debounce delay in milliseconds (default: 100)
trc watch --debounce 300

# Watch additional file patterns
trc watch --include "**/*.yaml"

# Ignore specific patterns
trc watch --ignore "**/test/**"

# Exit after first successful compilation
trc watch --once
```

### Examples

**Watch and run tests on success:**

```bash
trc watch src/ --exec "bundle exec rake test"
```

**Watch with custom debounce:**

```bash
# Wait 500ms after last change before compiling
trc watch --debounce 500
```

**Watch configuration files too:**

```bash
trc watch src/ --include "trbconfig.yml"
```

### Output

Watch mode provides real-time feedback:

```
Watching for file changes in src/...

[10:30:15] Changed: src/models/user.trb
[10:30:15] Compiling...
[10:30:16] ✓ Compiled successfully (1.2s)
[10:30:16] Generated:
  - build/models/user.rb
  - sig/models/user.rbs

Waiting for changes...
```

If there are errors:

```
[10:31:20] Changed: src/models/user.trb
[10:31:20] Compiling...
[10:31:21] ✗ Compilation failed

Error: src/models/user.trb:15:23
  Type mismatch: expected String, got Integer

    @email = user_id
              ^^^^^^^

Waiting for changes...
```

### Keyboard Shortcuts

While watch mode is running:

- `Ctrl+C` - Stop watching and exit
- `r` - Force recompilation
- `c` - Clear terminal
- `q` - Quit

## check

Type-check T-Ruby files without generating output. Useful for CI/CD pipelines and quick validation.

### Basic Usage

```bash
# Check a single file
trc check hello.trb

# Check multiple files
trc check src/**/*.trb

# Check entire directory
trc check .
```

### Options

```bash
# Strict mode (fail on warnings)
trc check . --strict

# Show warnings as well as errors
trc check . --warnings

# Report format (text, json, junit)
trc check . --format json

# Output report to file
trc check . --output-file report.json

# Max number of errors to show (default: 50)
trc check . --max-errors 10

# Continue on first error (default: stop after 50 errors)
trc check . --no-error-limit
```

### Examples

**Check before committing:**

```bash
# Add to .git/hooks/pre-commit
#!/bin/sh
trc check . --strict
```

**Generate JSON report for tooling:**

```bash
trc check . \
  --format json \
  --output-file type-errors.json
```

**Quick check with minimal output:**

```bash
trc check src/ --quiet --max-errors 5
```

### Output Formats

**Text (default):**

```
Checking 15 files...

Error: src/models/user.trb:23:15
  Type mismatch: expected String, got Integer

    return user_id
           ^^^^^^^

Error: src/services/auth.trb:45:8
  Undefined method 'authenticate' on nil

    user.authenticate(password)
    ^^^^

✗ Found 2 errors in 2 files
```

**JSON:**

```json
{
  "files_checked": 15,
  "errors": [
    {
      "file": "src/models/user.trb",
      "line": 23,
      "column": 15,
      "severity": "error",
      "message": "Type mismatch: expected String, got Integer",
      "code": "type-mismatch"
    }
  ],
  "summary": {
    "error_count": 2,
    "warning_count": 0,
    "files_with_errors": 2
  }
}
```

**JUnit XML (for CI integration):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="T-Ruby Type Check" tests="15" failures="2">
    <testcase name="src/models/user.trb">
      <failure message="Type mismatch: expected String, got Integer">
        Line 23, column 15
      </failure>
    </testcase>
  </testsuite>
</testsuites>
```

### Exit Codes

- `0` - No errors found
- `1` - Type errors found
- `2` - Warnings found (only with `--strict`)

## init

Initialize a new T-Ruby project with configuration file and directory structure.

### Basic Usage

```bash
# Create trbconfig.yml in current directory
trc --init

# Interactive setup
trc --init --interactive

# Use a template
trc --init --template rails
```

### Options

```bash
# Skip prompts and use defaults
trc --init --yes

# Specify project name
trc --init --name my-project

# Choose template (basic, rails, gem, sinatra)
trc --init --template rails

# Create directory structure
trc --init --create-dirs

# Initialize git repository
trc --init --git
```

### Templates

**Basic (default):**

```bash
trc --init --template basic
```

Creates:
```
trbconfig.yml
src/
build/
sig/
```

**Rails:**

```bash
trc --init --template rails
```

Creates configuration for Rails projects:
```yaml
source:
  include:
    - app/models
    - app/controllers
    - app/services
    - lib

output:
  ruby_dir: app
  preserve_structure: true

compiler:
  strictness: standard

types:
  external:
    - rails
    - activerecord
```

**Gem:**

```bash
trc --init --template gem
```

Creates configuration for gem development:
```yaml
source:
  include:
    - lib
  exclude:
    - "**/*_spec.trb"

output:
  ruby_dir: lib
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: strict
  generate_rbs: true
```

**Sinatra:**

```bash
trc --init --template sinatra
```

Creates configuration for Sinatra apps:
```yaml
source:
  include:
    - app
    - lib

output:
  ruby_dir: build
  rbs_dir: sig

compiler:
  strictness: standard

types:
  external:
    - sinatra
```

### Interactive Mode

```bash
trc --init --interactive
```

Guides you through setup:

```
T-Ruby Project Setup
====================

? Project name: my-awesome-project
? Project type: (Use arrow keys)
  ❯ Basic
    Rails
    Gem
    Sinatra
    Custom

? Source directory: src
? Output directory: build
? RBS directory: sig

? Strictness level: (Use arrow keys)
    Strict (all code must be typed)
  ❯ Standard (public APIs must be typed)
    Permissive (minimal requirements)

? Generate RBS files? Yes
? Target Ruby version: 3.2

? Create directory structure? Yes
? Initialize git repository? Yes

✓ Created trbconfig.yml
✓ Created src/
✓ Created build/
✓ Created sig/
✓ Initialized git repository

Your T-Ruby project is ready! Try:

  trc compile src/
  trc watch src/
```

### Examples

**Quick start a new project:**

```bash
mkdir my-project
cd my-project
trc --init --yes --create-dirs
```

**Rails project setup:**

```bash
cd my-rails-app
trc --init --template rails --interactive
```

**Gem development:**

```bash
bundle gem my_gem
cd my_gem
trc --init --template gem --create-dirs
```

## Global Options

These options work with all commands:

```bash
# Show version
trc --version
trc -v

# Show help
trc --help
trc -h

# Show help for specific command
trc compile --help

# Use specific config file
trc --config path/to/trbconfig.yml

# Set log level (debug, info, warn, error)
trc --log-level debug

# Enable color output (default: auto)
trc --color

# Disable color output
trc --no-color

# Show stack traces on errors
trc --stack-trace
```

## Configuration File

Commands respect the `trbconfig.yml` configuration file. Command-line options override config file settings.

Example workflow:

```yaml title="trbconfig.yml"
source:
  include:
    - src
  exclude:
    - "**/*_test.trb"

output:
  ruby_dir: build
  rbs_dir: sig

compiler:
  strictness: standard
  generate_rbs: true
```

Then simply run:

```bash
# Uses settings from trbconfig.yml
trc compile
trc watch
trc check
```

## CI/CD Usage

### GitHub Actions

```yaml
- name: Type Check
  run: trc check . --format junit --output-file test-results.xml

- name: Compile
  run: trc compile . --quiet
```

### GitLab CI

```yaml
typecheck:
  script:
    - trc check . --strict
    - trc compile .
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Get staged .trb files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.trb$')

if [ -n "$STAGED_FILES" ]; then
  echo "Type checking staged files..."
  trc check $STAGED_FILES --strict

  if [ $? -ne 0 ]; then
    echo "Type check failed. Commit aborted."
    exit 1
  fi
fi
```

## Tips and Best Practices

### Development Workflow

1. **Use watch mode during development:**
   ```bash
   trc watch src/ --clear --exec "bundle exec rspec"
   ```

2. **Run check before committing:**
   ```bash
   trc check . --strict
   ```

3. **Use quiet mode in scripts:**
   ```bash
   trc compile . --quiet || exit 1
   ```

### Performance

1. **Compile specific files instead of entire directories when possible:**
   ```bash
   # Faster
   trc compile src/models/user.trb

   # Slower
   trc compile src/
   ```

2. **Use `--no-rbs` if you don't need RBS files:**
   ```bash
   trc compile . --no-rbs
   ```

3. **Increase debounce in watch mode for large projects:**
   ```bash
   trc watch --debounce 500
   ```

### Troubleshooting

**Command not found:**
```bash
# Check installation
which trc

# Reinstall if needed
gem install t-ruby
```

**Slow compilation:**
```bash
# Use verbose mode to see what's taking time
trc compile . --verbose

# Check configuration
trc compile . --log-level debug
```

**Unexpected output location:**
```bash
# Check your configuration
cat trbconfig.yml

# Or specify explicitly
trc compile src/ --output build/ --rbs-dir sig/
```

## Next Steps

- [Configuration Reference](/docs/cli/configuration) - Learn about `trbconfig.yml` options
- [Compiler Options](/docs/cli/compiler-options) - Detailed compiler flags and settings
- [Project Configuration](/docs/getting-started/project-configuration) - Set up your project
