---
sidebar_position: 2
title: Using with Steep
description: Type checking with Steep
---

# Using with Steep

Steep is a static type checker for Ruby that uses RBS for type signatures. T-Ruby integrates seamlessly with Steep, allowing you to leverage additional type checking beyond what T-Ruby's compiler provides.

## Why Use Steep with T-Ruby?

While T-Ruby performs type checking during compilation, Steep provides:

- **Additional validation** of generated Ruby code
- **Type checking for dependencies** and libraries
- **IDE integration** through Ruby LSP
- **Verification** that compiled code matches RBS signatures
- **Standard Ruby tooling** compatibility

## Installation

Add Steep to your project:

```bash
gem install steep
```

Or in your Gemfile:

```ruby
group :development do
  gem "steep"
  gem "t-ruby"
end
```

Then:

```bash
bundle install
```

## Basic Setup

### Step 1: Compile T-Ruby Code

First, compile your T-Ruby code to generate Ruby and RBS files:

```bash
trc compile src/
```

This creates:
```
build/          # Compiled Ruby files
sig/            # RBS type signatures
```

### Step 2: Create Steepfile

Create a `Steepfile` to configure Steep:

```ruby title="Steepfile"
target :app do
  # Check compiled Ruby files
  check "build"

  # Use T-Ruby generated signatures
  signature "sig"

  # Use Ruby standard library types
  library "pathname"
end
```

### Step 3: Run Steep

```bash
steep check
```

Steep verifies that your compiled Ruby code matches the generated RBS signatures.

## Complete Example

Let's walk through a complete example.

**T-Ruby source** (`src/user.trb`):

```ruby
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

  def self.find(id: Integer): User | nil
    # Database lookup would go here
    nil
  end
end

# Using the class
user = User.new(1, "Alice", "alice@example.com")
puts user.greet

# This would be a type error
# user = User.new("not a number", "Bob", "bob@example.com")
```

**Compile**:

```bash
trc compile src/
```

**Configure Steep** (`Steepfile`):

```ruby
target :app do
  check "build"
  signature "sig"
end
```

**Run Steep**:

```bash
steep check
```

Output:
```
# Type checking files:

build/user.rb:19:8: [error] Type mismatch:
  expected: Integer
  actual: String

# Typecheck result: FAILURE
```

## Steepfile Configuration

### Basic Structure

```ruby
target :app do
  check "path/to/ruby/files"
  signature "path/to/rbs/files"
end
```

### Multiple Targets

For larger projects, use multiple targets:

```ruby
# Application code
target :app do
  check "build/app"
  signature "sig/app"

  library "pathname", "logger"
end

# Tests
target :test do
  check "build/test"
  signature "sig/test", "sig/app"

  library "pathname", "logger", "minitest"
end
```

### Libraries

Include RBS for Ruby standard library and gems:

```ruby
target :app do
  check "build"
  signature "sig"

  # Standard library
  library "pathname"
  library "json"
  library "net-http"

  # Gems with RBS support
  library "activerecord"
  library "activesupport"
end
```

### Type Resolution

Configure how Steep resolves types:

```ruby
target :app do
  check "build"
  signature "sig"

  # Ignore specific files
  ignore "build/vendor/**/*.rb"

  # Configure type checking strictness
  configure_code_diagnostics do |hash|
    hash[D::UnresolvedOverloading] = :information
    hash[D::FallbackAny] = :warning
  end
end
```

## Integration with T-Ruby Workflow

### Development Workflow

```bash
# 1. Write T-Ruby code
vim src/user.trb

# 2. Compile with T-Ruby (catches T-Ruby type errors)
trc compile src/

# 3. Check with Steep (validates Ruby output)
steep check

# 4. Run the code
ruby build/user.rb
```

### Watch Mode

Use both T-Ruby watch and Steep watch together:

**Terminal 1** - T-Ruby watch:
```bash
trc watch src/ --clear
```

**Terminal 2** - Steep watch:
```bash
steep watch --code=build --signature=sig
```

Now both will automatically recheck as you edit files.

### Single Command Workflow

Create a script to run both:

```bash title="bin/typecheck"
#!/bin/bash
set -e

echo "Compiling T-Ruby..."
trc compile src/

echo "Running Steep..."
steep check

echo "Type checking passed!"
```

```bash
chmod +x bin/typecheck
./bin/typecheck
```

## Advanced Configuration

### Strict Mode

Enable strict type checking in Steep:

```ruby
target :app do
  check "build"
  signature "sig"

  # Strict mode - fail on any type issues
  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :error
    hash[D::UnresolvedOverloading] = :error
    hash[D::UnexpectedBlockGiven] = :error
    hash[D::IncompatibleMethodTypeAnnotation] = :error
  end
end
```

### Custom Type Directories

If you have hand-written RBS alongside T-Ruby generated ones:

```ruby
target :app do
  check "build"

  # T-Ruby generated signatures
  signature "sig/generated"

  # Hand-written signatures
  signature "sig/manual"

  # Vendor signatures
  signature "sig/vendor"
end
```

### Rails Integration

For Rails projects:

```ruby
target :app do
  check "app"

  signature "sig"

  # Rails core libraries
  library "pathname"
  library "logger"

  # Rails gems
  library "activerecord"
  library "actionpack"
  library "activesupport"
  library "actionview"

  # Configure Rails paths
  repo_path "vendor/rbs-rails"
end

# Configure for Rails autoloading
configure_code_diagnostics do |hash|
  # Rails uses autoloading - be lenient with constants
  hash[D::UnknownConstant] = :hint
end
```

### Ignore Patterns

Ignore generated or vendor code:

```ruby
target :app do
  check "build"
  signature "sig"

  # Ignore specific patterns
  ignore "build/vendor/**/*.rb"
  ignore "build/generated/**/*.rb"
  ignore "build/**/*_pb.rb"  # Protocol buffer generated files
end
```

## Diagnostic Configuration

Customize Steep's diagnostic levels:

```ruby
target :app do
  check "build"
  signature "sig"

  configure_code_diagnostics do |hash|
    # Errors
    hash[D::UnresolvedOverloading] = :error
    hash[D::FallbackAny] = :error

    # Warnings
    hash[D::UnexpectedBlockGiven] = :warning
    hash[D::IncompatibleAssignment] = :warning

    # Information
    hash[D::UnknownConstant] = :information

    # Hints (lowest severity)
    hash[D::UnsatisfiedConstraints] = :hint

    # Disable specific diagnostics
    hash[D::UnexpectedJumpValue] = nil
  end
end
```

## Common Diagnostics

### UnresolvedOverloading

Multiple method overloads, Steep can't determine which one:

```ruby
# In RBS
def process: (String) -> Integer
           | (Integer) -> String

# Steep may report UnresolvedOverloading
result = process(input)  # Type of input unclear
```

**Fix**: Add type annotation or make types clearer.

### FallbackAny

Steep can't infer a type and falls back to `Any`:

```ruby
result = some_method()  # Type unknown, falls back to Any
```

**Fix**: Add explicit types in T-Ruby source.

### IncompatibleAssignment

Type mismatch in assignment:

```ruby
x: Integer = "string"  # Error: incompatible types
```

**Fix**: Correct the type in T-Ruby source.

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

      - name: Compile T-Ruby
        run: trc compile src/

      - name: Type Check with Steep
        run: bundle exec steep check
```

### GitLab CI

```yaml title=".gitlab-ci.yml"
typecheck:
  image: ruby:3.2
  before_script:
    - gem install t-ruby
    - bundle install
  script:
    - trc compile src/
    - bundle exec steep check
```

### Pre-commit Hook

```bash title=".git/hooks/pre-commit"
#!/bin/sh

echo "Type checking with T-Ruby and Steep..."

# Compile T-Ruby
trc compile src/ || exit 1

# Check with Steep
steep check || exit 1

echo "Type check passed!"
```

## Steep Commands

### Check

Type check your code:

```bash
steep check
```

With specific target:
```bash
steep check --target=app
```

### Watch

Watch for changes and recheck:

```bash
steep watch
```

Specify paths:
```bash
steep watch --code=build --signature=sig
```

### Stats

Show type checking statistics:

```bash
steep stats
```

Output:
```
Target: app
  Files: 25
  Methods: 147
  Classes: 18
  Modules: 5
  Type errors: 0
  Warnings: 3
```

### Validate

Validate Steepfile:

```bash
steep validate
```

### Version

Show Steep version:

```bash
steep version
```

## Troubleshooting

### Steep Can't Find RBS Files

**Problem**: Steep reports missing type signatures.

**Solution**: Verify RBS files exist and Steepfile paths are correct:

```bash
# Check RBS files were generated
ls -la sig/

# Verify Steepfile paths
cat Steepfile
```

### Type Mismatches

**Problem**: Steep reports type errors in generated code.

**Solution**:

1. Check T-Ruby compilation:
   ```bash
   trc check src/
   ```

2. View generated RBS:
   ```bash
   cat sig/user.rbs
   ```

3. Ensure types match:
   ```bash
   trc compile --trace src/
   ```

### Library Not Found

**Problem**: Steep can't find library types.

**Solution**: Install RBS collection or add library to Steepfile:

```bash
# Initialize RBS collection
rbs collection init

# Install dependencies
rbs collection install
```

```ruby
# In Steepfile
target :app do
  signature "sig"
  library "pathname", "json"
end
```

### Performance Issues

**Problem**: Steep is slow on large projects.

**Solution**:

1. Use multiple targets:
   ```ruby
   target :core do
     check "build/core"
     signature "sig/core"
   end

   target :plugins do
     check "build/plugins"
     signature "sig/plugins"
   end
   ```

2. Ignore unnecessary files:
   ```ruby
   target :app do
     check "build"
     ignore "build/vendor/**"
   end
   ```

## Best Practices

### 1. Run Steep in CI

Always run Steep in CI to catch type errors:

```yaml
- name: Type Check
  run: |
    trc compile src/
    steep check
```

### 2. Use Steep Watch During Development

Keep Steep running to get immediate feedback:

```bash
steep watch --code=build --signature=sig
```

### 3. Configure Diagnostics Appropriately

Start permissive, increase strictness over time:

```ruby
# Start here
configure_code_diagnostics do |hash|
  hash[D::FallbackAny] = :warning
end

# Move to this
configure_code_diagnostics do |hash|
  hash[D::FallbackAny] = :error
end
```

### 4. Keep RBS Files in Version Control

Commit generated RBS files:

```bash
git add sig/
git commit -m "Update RBS signatures"
```

### 5. Use Both T-Ruby and Steep Checks

T-Ruby catches issues at compile time, Steep validates runtime behavior:

```bash
trc check src/     # Compile-time check
trc compile src/   # Generate Ruby + RBS
steep check        # Runtime behavior check
```

## Steep vs T-Ruby Type Checking

| Aspect | T-Ruby | Steep |
|--------|--------|-------|
| When | Compile time | After compilation |
| What | `.trb` files | `.rb` and `.rbs` files |
| Purpose | Type safety in T-Ruby code | Validate Ruby output |
| Errors | Prevents compilation | Reports issues |
| Speed | Fast (single file) | Slower (whole project) |
| Integration | Built-in | Separate tool |

**Use both**: T-Ruby for development, Steep for validation.

## Real-World Example

Complete setup for a production application:

```ruby title="Steepfile"
target :app do
  check "build/app"
  signature "sig/app"

  library "pathname"
  library "logger"
  library "json"
  library "net-http"

  ignore "build/app/vendor/**"

  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :error
    hash[D::UnresolvedOverloading] = :warning
    hash[D::IncompatibleAssignment] = :error
  end
end

target :test do
  check "build/test"
  signature "sig/app", "sig/test"

  library "minitest"

  configure_code_diagnostics do |hash|
    hash[D::FallbackAny] = :warning  # More lenient for tests
  end
end
```

```yaml title="trc.yaml"
source:
  include:
    - src/app
    - src/test

output:
  ruby_dir: build
  rbs_dir: sig
  preserve_structure: true

compiler:
  strictness: strict
  generate_rbs: true
```

```bash title="bin/ci"
#!/bin/bash
set -e

echo "==> Compiling T-Ruby..."
trc compile src/app --strict

echo "==> Type checking with Steep..."
steep check --target=app

echo "==> Running tests..."
ruby -Ibuild/test -Ibuild/app build/test/all_tests.rb

echo "==> All checks passed!"
```

## Next Steps

- [Ruby LSP Integration](/docs/tooling/ruby-lsp) - IDE support with Steep
- [RBS Integration](/docs/tooling/rbs-integration) - Learn more about RBS
- [Steep Documentation](https://github.com/soutaro/steep) - Official Steep docs
