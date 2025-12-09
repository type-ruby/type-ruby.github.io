---
sidebar_position: 3
title: Compiler Options
description: All available compiler options
---

# Compiler Options

T-Ruby's compiler provides extensive options to control compilation, type checking, and code generation. This reference covers all available command-line flags and their effects.

## Overview

Compiler options can be specified in three ways:

1. **Command-line flags**: `trc --strict compile src/`
2. **Configuration file**: In `trc.yaml` under `compiler:` section
3. **Environment variables**: `TRC_STRICT=true trc compile src/`

Command-line flags override configuration file settings.

## Type Checking Options

### --strict

Enable strict type checking mode. Equivalent to setting `strictness: strict` in config.

```bash
trc compile --strict src/
```

In strict mode:
- All function parameters and return types required
- All instance variables must be typed
- No implicit `any` types
- Strict nil checking enabled

```ruby
# Strict mode requires full typing
def process(data: Array<String>): Hash<String, Integer>
  @count: Integer = 0
  result: Hash<String, Integer> = {}
  result
end
```

### --permissive

Enable permissive type checking mode. Allows gradual typing.

```bash
trc compile --permissive src/
```

In permissive mode:
- Types optional
- Implicit `any` allowed
- Only explicit type errors caught

```ruby
# Permissive mode allows untyped code
def process(data)
  @count = 0
  result = {}
  result
end
```

### --no-implicit-any

Disallow implicit `any` types.

```bash
trc compile --no-implicit-any src/
```

```ruby
# Error with --no-implicit-any
def process(data)  # Error: implicit any
  # ...
end

# Must be explicit
def process(data: Any)  # OK
  # ...
end
```

### --strict-nil

Enable strict nil checking.

```bash
trc compile --strict-nil src/
```

```ruby
# Error with --strict-nil
def find_user(id: Integer): User  # Error: might return nil
  users.find { |u| u.id == id }
end

# Must include nil in type
def find_user(id: Integer): User | nil
  users.find { |u| u.id == id }
end
```

### --no-unused-vars

Warn on unused variables and parameters.

```bash
trc compile --no-unused-vars src/
```

```ruby
# Warning with --no-unused-vars
def calculate(x: Integer, y: Integer): Integer
  x * 2  # Warning: y is unused
end

# Use underscore prefix to indicate intentionally unused
def calculate(x: Integer, _y: Integer): Integer
  x * 2  # No warning
end
```

### --no-unchecked-indexed-access

Require checks before array/hash access.

```bash
trc compile --no-unchecked-indexed-access src/
```

```ruby
# Error with --no-unchecked-indexed-access
users: Array<User> = get_users()
user = users[0]  # Error: might be nil

# Must check first
if users[0]
  user = users[0]  # OK
end
```

### --require-return-types

Require explicit return types for all functions.

```bash
trc compile --require-return-types src/
```

```ruby
# Error with --require-return-types
def calculate(x: Integer)  # Error: missing return type
  x * 2
end

# Must specify return type
def calculate(x: Integer): Integer
  x * 2
end
```

## Output Options

### --output, -o

Specify output directory for compiled Ruby files.

```bash
trc compile src/ --output build/
trc compile src/ -o build/
```

Default: `build/`

### --rbs-dir

Specify output directory for RBS signature files.

```bash
trc compile src/ --rbs-dir sig/
```

Default: `sig/`

### --no-rbs

Skip RBS file generation.

```bash
trc compile src/ --no-rbs
```

Useful when:
- You only need Ruby output
- RBS files generated elsewhere
- Faster compilation needed

### --rbs-only

Generate only RBS files, skip Ruby output.

```bash
trc compile src/ --rbs-only
```

Useful for:
- Updating type signatures
- Type-checking without compilation
- Generating types for existing Ruby code

### --preserve-structure

Preserve source directory structure in output.

```bash
trc compile src/ --preserve-structure
```

```
src/models/user.trb → build/models/user.rb
```

### --no-preserve-structure

Flatten output directory structure.

```bash
trc compile src/ --no-preserve-structure
```

```
src/models/user.trb → build/user.rb
```

### --clean

Clean output directories before compilation.

```bash
trc compile --clean src/
```

Removes all files from `output` and `rbs_dir` before compiling.

## Target Options

### --target-ruby

Specify target Ruby version for generated code.

```bash
trc compile --target-ruby 3.2 src/
```

Supported: `2.7`, `3.0`, `3.1`, `3.2`, `3.3`

Affects:
- Syntax features used
- Standard library compatibility
- Method availability

Examples:

**Pattern Matching (Ruby 3.0+):**
```bash
# Target 3.0+
trc compile --target-ruby 3.0 src/

# Uses native pattern matching
case value
in { name: n }
  puts n
end
```

```bash
# Target 2.7
trc compile --target-ruby 2.7 src/

# Compiles to compatible code
case
when value.is_a?(Hash) && value[:name]
  n = value[:name]
  puts n
end
```

### --experimental

Enable experimental features.

```bash
trc compile --experimental pattern_matching_types src/
```

Multiple features:
```bash
trc compile \
  --experimental pattern_matching_types \
  --experimental refinement_types \
  src/
```

Available experimental features:

- `pattern_matching_types` - Type inference from pattern matching
- `refinement_types` - Refinement-based type narrowing
- `variadic_generics` - Variable-length generic parameters
- `higher_kinded_types` - Type constructors as type parameters
- `dependent_types` - Types depending on values

**Warning:** Experimental features may change or be removed.

## Optimization Options

### --optimize

Enable code optimization.

```bash
trc compile --optimize basic src/
```

Levels:
- `none` - No optimization (default)
- `basic` - Safe optimizations
- `aggressive` - Maximum optimization

**none:**
```ruby
# No changes to code structure
CONSTANT = 42

def calculate
  CONSTANT * 2
end
```

**basic:**
```ruby
# Inline constants, remove dead code
def calculate
  84  # Constant folded
end
```

**aggressive:**
```ruby
# May inline functions, reorder code
def calculate
  84
end
```

### --no-optimize

Disable all optimizations.

```bash
trc compile --no-optimize src/
```

Ensures output matches source structure exactly.

## Source Options

### --include

Include additional source files or directories.

```bash
trc compile src/ --include lib/ --include config/
```

### --exclude

Exclude files or patterns from compilation.

```bash
trc compile src/ --exclude "**/*_test.trb"
```

Multiple exclusions:
```bash
trc compile src/ \
  --exclude "**/*_test.trb" \
  --exclude "**/*_spec.trb" \
  --exclude "**/fixtures/**"
```

### --extensions

Specify file extensions to process.

```bash
trc compile src/ --extensions .trb,.truby
```

Default: `.trb`

## Type Options

### --type-paths

Add directories containing type definitions.

```bash
trc compile src/ --type-paths types/,vendor/types/
```

### --no-stdlib

Don't include standard library type definitions.

```bash
trc compile --no-stdlib src/
```

Useful when providing custom stdlib types.

### --external-types

Import external type definitions.

```bash
trc compile --external-types rails,rspec src/
```

Multiple libraries:
```bash
trc compile \
  --external-types rails \
  --external-types activerecord \
  --external-types rspec \
  src/
```

## Watch Options

(For `trc watch` command)

### --debounce

Set debounce delay in milliseconds.

```bash
trc watch --debounce 300 src/
```

Default: 100ms

Waits 300ms after last file change before recompiling.

### --clear

Clear terminal screen on each recompile.

```bash
trc watch --clear src/
```

### --exec

Run command after successful compilation.

```bash
trc watch --exec "bundle exec rspec" src/
```

### --on-success

Alias for `--exec`.

```bash
trc watch --on-success "rake test" src/
```

### --on-failure

Run command after failed compilation.

```bash
trc watch --on-failure "notify-send 'Build failed'" src/
```

### --watch-paths

Watch additional directories.

```bash
trc watch src/ --watch-paths config/,types/
```

### --ignore

Ignore file patterns in watch mode.

```bash
trc watch --ignore "**/tmp/**" src/
```

### --once

Compile once and exit (don't watch for changes).

```bash
trc watch --once src/
```

Useful for testing watch mode configuration.

## Check Options

(For `trc check` command)

### --format

Specify output format for type check results.

```bash
trc check --format json src/
```

Formats:
- `text` - Human-readable (default)
- `json` - JSON format
- `junit` - JUnit XML format

**text:**
```
Error: src/user.trb:15:10
  Type mismatch: expected String, got Integer
```

**json:**
```json
{
  "files_checked": 10,
  "errors": [{
    "file": "src/user.trb",
    "line": 15,
    "column": 10,
    "severity": "error",
    "message": "Type mismatch: expected String, got Integer"
  }]
}
```

**junit:**
```xml
<testsuites>
  <testsuite name="T-Ruby Type Check" tests="10" failures="1">
    <testcase name="src/user.trb">
      <failure message="Type mismatch">...</failure>
    </testcase>
  </testsuite>
</testsuites>
```

### --output-file

Write check results to file.

```bash
trc check --format json --output-file results.json src/
```

### --max-errors

Limit number of errors to display.

```bash
trc check --max-errors 10 src/
```

Default: 50

### --no-error-limit

Show all errors (no limit).

```bash
trc check --no-error-limit src/
```

### --warnings

Show warnings in addition to errors.

```bash
trc check --warnings src/
```

## Init Options

(For `trc init` command)

### --template

Use project template.

```bash
trc init --template rails
```

Templates:
- `basic` - Basic project (default)
- `rails` - Rails application
- `gem` - Ruby gem
- `sinatra` - Sinatra application

### --interactive

Interactive project setup.

```bash
trc init --interactive
```

Prompts for all configuration options.

### --yes, -y

Accept all defaults without prompting.

```bash
trc init --yes
trc init -y
```

### --name

Set project name.

```bash
trc init --name my-awesome-project
```

### --create-dirs

Create directory structure.

```bash
trc init --create-dirs
```

Creates `src/`, `build/`, `sig/` directories.

### --git

Initialize git repository.

```bash
trc init --git
```

Creates `.git/` and `.gitignore`.

## Logging and Debug Options

### --verbose, -v

Show verbose output.

```bash
trc compile --verbose src/
trc compile -v src/
```

Shows:
- Files being processed
- Type resolution details
- Compilation steps

### --quiet, -q

Suppress non-error output.

```bash
trc compile --quiet src/
trc compile -q src/
```

Only shows errors.

### --log-level

Set logging level.

```bash
trc compile --log-level debug src/
```

Levels:
- `debug` - All messages
- `info` - Informational messages (default)
- `warn` - Warnings and errors
- `error` - Only errors

### --stack-trace

Show stack traces on errors.

```bash
trc compile --stack-trace src/
```

Useful for debugging compiler issues.

### --profile

Show performance profiling information.

```bash
trc compile --profile src/
```

Output:
```
Compilation completed in 2.4s

Phase breakdown:
  Parse:        0.8s (33%)
  Type check:   1.2s (50%)
  Code gen:     0.3s (12%)
  Write files:  0.1s (5%)
```

## Configuration Options

### --config, -c

Use specific configuration file.

```bash
trc compile --config trc.production.yaml src/
trc compile -c trc.production.yaml src/
```

### --no-config

Ignore configuration file.

```bash
trc compile --no-config src/
```

Uses only command-line options and defaults.

### --print-config

Print effective configuration and exit.

```bash
trc compile --print-config src/
```

Shows merged configuration from file, environment, and command line.

## Output Control Options

### --color

Force colored output.

```bash
trc compile --color src/
```

### --no-color

Disable colored output.

```bash
trc compile --no-color src/
```

Useful for:
- CI/CD environments
- Log file output
- Non-terminal output

### --progress

Show progress bar during compilation.

```bash
trc compile --progress src/
```

```
Compiling: [████████████████░░░░] 80% (40/50 files)
```

### --no-progress

Disable progress bar.

```bash
trc compile --no-progress src/
```

## Parallel Compilation Options

### --parallel

Enable parallel compilation.

```bash
trc compile --parallel src/
```

Compiles multiple files concurrently.

### --jobs, -j

Specify number of parallel jobs.

```bash
trc compile --parallel --jobs 4 src/
trc compile --parallel -j 4 src/
```

Default: Number of CPU cores

### --no-parallel

Disable parallel compilation (compile serially).

```bash
trc compile --no-parallel src/
```

Useful for:
- Debugging
- Memory-constrained environments
- Reproducible output order

## Caching Options

### --cache

Enable compilation cache.

```bash
trc compile --cache src/
```

Caches type information and parsed ASTs for faster subsequent compilations.

### --no-cache

Disable compilation cache.

```bash
trc compile --no-cache src/
```

Forces full recompilation.

### --cache-dir

Specify cache directory.

```bash
trc compile --cache --cache-dir .trc-cache/ src/
```

Default: `.trc-cache/`

### --clear-cache

Clear compilation cache before running.

```bash
trc compile --clear-cache src/
```

## Advanced Options

### --ast

Output Abstract Syntax Tree instead of Ruby code.

```bash
trc compile --ast src/user.trb
```

Useful for:
- Debugging parser issues
- Understanding code structure
- Building tooling

### --tokens

Output token stream from lexer.

```bash
trc compile --tokens src/user.trb
```

### --trace

Trace type checking process.

```bash
trc compile --trace src/
```

Shows detailed type inference and checking steps.

### --dump-types

Dump inferred types to file.

```bash
trc compile --dump-types types.json src/
```

### --allow-errors

Continue compilation even with type errors.

```bash
trc compile --allow-errors src/
```

Generates Ruby output despite type errors. Useful for:
- Debugging generated code
- Gradual migration
- Testing

**Warning:** Generated code may have runtime errors.

### --source-maps

Generate source maps for debugging.

```bash
trc compile --source-maps src/
```

Creates `.rb.map` files mapping Ruby code back to T-Ruby source.

## Combined Examples

### Strict production build

```bash
trc compile \
  --strict \
  --no-implicit-any \
  --strict-nil \
  --optimize aggressive \
  --clean \
  --target-ruby 3.2 \
  src/
```

### Development with watch

```bash
trc watch \
  --permissive \
  --clear \
  --debounce 200 \
  --exec "bundle exec rspec" \
  src/
```

### CI/CD type checking

```bash
trc check \
  --strict \
  --format junit \
  --output-file test-results.xml \
  --no-color \
  --quiet \
  src/
```

### Fast incremental build

```bash
trc compile \
  --cache \
  --parallel \
  --jobs 8 \
  --no-rbs \
  src/
```

### Debug compilation issues

```bash
trc compile \
  --verbose \
  --stack-trace \
  --profile \
  --log-level debug \
  --no-parallel \
  src/
```

## Environment Variables

Many options can be set via environment variables:

```bash
export TRC_STRICT=true
export TRC_TARGET_RUBY=3.2
export TRC_OUTPUT_DIR=build
export TRC_CACHE=true
export TRC_PARALLEL=true
export TRC_JOBS=4

trc compile src/
```

Variables override config file but are overridden by command-line flags.

## Option Precedence

Options are resolved in this order (later overrides earlier):

1. Default values
2. Configuration file (`trc.yaml`)
3. Environment variables
4. Command-line flags

Example:

```yaml
# trc.yaml
compiler:
  strictness: standard
```

```bash
# Environment variable
export TRC_STRICTNESS=permissive

# Command-line flag wins
trc compile --strict src/

# Effective: strictness = strict
```

## Option Groups Reference

### Type Checking
- `--strict`, `--permissive`
- `--no-implicit-any`
- `--strict-nil`
- `--no-unused-vars`
- `--no-unchecked-indexed-access`
- `--require-return-types`

### Output Control
- `--output`, `-o`
- `--rbs-dir`
- `--no-rbs`, `--rbs-only`
- `--preserve-structure`
- `--clean`

### Target & Optimization
- `--target-ruby`
- `--optimize`
- `--experimental`

### Logging
- `--verbose`, `-v`
- `--quiet`, `-q`
- `--log-level`
- `--stack-trace`
- `--profile`

### Performance
- `--parallel`, `--jobs`
- `--cache`, `--cache-dir`
- `--no-parallel`

### Advanced
- `--ast`, `--tokens`
- `--trace`
- `--dump-types`
- `--allow-errors`
- `--source-maps`

## Next Steps

- [Commands Reference](/docs/cli/commands) - Learn about all CLI commands
- [Configuration File](/docs/cli/configuration) - Configure via `trc.yaml`
- [Type Annotations](/docs/learn/basics/type-annotations) - Start writing typed code
