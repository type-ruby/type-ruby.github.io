---
sidebar_position: 2
title: Contributing
description: How to contribute to T-Ruby
---

# Contributing to T-Ruby

Thank you for your interest in contributing to T-Ruby! This guide will help you get started with contributing code, documentation, types, and more.

## Code of Conduct

T-Ruby is committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other community members

Unacceptable behavior will not be tolerated. Please report any concerns to the project maintainers.

## Ways to Contribute

There are many ways to contribute to T-Ruby:

### 1. Report Bugs

Found a bug? Please open an issue on GitHub with:

- **Clear title** - Descriptive summary of the issue
- **T-Ruby version** - Run `trc --version`
- **Ruby version** - Run `ruby --version`
- **Steps to reproduce** - Minimal code example
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Error messages** - Full error output if applicable

**Example:**
```markdown
## Bug: Type inference fails for array map

**T-Ruby Version:** v0.1.0
**Ruby Version:** 3.2.0

### Steps to Reproduce
```ruby
numbers: Array<Integer> = [1, 2, 3]
strings = numbers.map { |n| n.to_s }
# Type of strings should be Array<String>
```

### Expected
`strings` should be inferred as `Array<String>`

### Actual
Type is inferred as `Array<Any>`
```

### 2. Suggest Features

Have an idea for T-Ruby? Open a feature request with:

- **Use case** - Why is this feature needed?
- **Proposed syntax** - How should it work?
- **Examples** - Code examples showing usage
- **Alternatives** - Other ways to solve the problem
- **TypeScript comparison** - How does TypeScript handle this?

### 3. Improve Documentation

Documentation contributions are highly valued:

- Fix typos and grammar
- Add code examples
- Improve explanations
- Write tutorials and guides
- Translate documentation
- Add diagrams and visuals

### 4. Add Standard Library Types

Help expand T-Ruby's stdlib coverage:

- Add type signatures for Ruby core classes
- Type popular gems (Rails, Sinatra, RSpec, etc.)
- Write tests for type definitions
- Document complex types

### 5. Build Tooling

Create tools for the T-Ruby ecosystem:

- Editor extensions (VSCode, Vim, etc.)
- Build system integrations
- Linters and formatters
- Code generators
- Migration tools

### 6. Write Tests

Improve test coverage:

- Add test cases for existing features
- Test edge cases and error conditions
- Write integration tests
- Add performance benchmarks

### 7. Fix Bugs

Browse open issues and submit pull requests:

- Look for "good first issue" labels
- Check "help wanted" issues
- Reproduce bugs and propose fixes
- Improve error messages

## Development Setup

### Prerequisites

- **Ruby** 3.0 or higher
- **Node.js** 16 or higher (for tooling)
- **Git** for version control

### Clone the Repository

```bash
git clone https://github.com/t-ruby/t-ruby.git
cd t-ruby
```

### Install Dependencies

```bash
# Install Ruby dependencies
bundle install

# Install Node.js dependencies (for tooling)
npm install
```

### Run Tests

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/compiler/type_checker_spec.rb

# Run with coverage
COVERAGE=true bundle exec rspec
```

### Build the Compiler

```bash
# Build development version
rake build

# Install locally
rake install

# Test the installation
trc --version
```

### Run Type Checker

```bash
# Type check a file
trc --check examples/hello.trb

# Compile a file
trc examples/hello.trb

# Watch mode
trc --watch examples/**/*.trb
```

## Pull Request Process

### 1. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/my-awesome-feature

# Or a bugfix branch
git checkout -b fix/issue-123
```

### 2. Make Changes

- Write clean, readable code
- Follow the coding style (see below)
- Add tests for new features
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Run tests
bundle exec rspec

# Run linter
bundle exec rubocop

# Type check examples
trc --check examples/**/*.trb

# Manual testing
trc your_test_file.trb
ruby your_test_file.rb
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "Add support for tuple types"
git commit -m "Fix type inference for array.map"
git commit -m "Document generic constraints"

# Bad commit messages
git commit -m "Fix bug"
git commit -m "Update code"
git commit -m "WIP"
```

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

**Example:**
```
feat: Add support for intersection types

Implement intersection type operator (&) that allows
combining multiple interface types. This enables
creating types that must satisfy multiple contracts.

Closes #123
```

### 5. Push and Create PR

```bash
# Push your branch
git push origin feature/my-awesome-feature

# Create PR on GitHub
```

### 6. PR Requirements

Your pull request should:

- [ ] Have a clear, descriptive title
- [ ] Reference related issues (e.g., "Fixes #123")
- [ ] Include tests for new functionality
- [ ] Update documentation if needed
- [ ] Pass all CI checks
- [ ] Have no merge conflicts
- [ ] Be reviewed by a maintainer

### 7. PR Template

```markdown
## Description
Brief description of changes

## Motivation
Why are these changes needed?

## Changes
- List of specific changes
- Another change

## Testing
How were these changes tested?

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Follows style guide
- [ ] No breaking changes (or documented)
```

## Coding Style

### Ruby Style

We follow the [Ruby Style Guide](https://rubystyle.guide/) with some modifications:

```ruby
# Good
def type_check(node: AST::Node): Type
  case node.type
  when :integer
    IntegerType.new
  when :string
    StringType.new
  else
    AnyType.new
  end
end

# Use descriptive variable names
def infer_array_type(elements: Array<AST::Node>): ArrayType
  element_types = elements.map { |el| infer_type(el) }
  union_type = UnionType.new(element_types)
  ArrayType.new(union_type)
end
```

### T-Ruby Style (for examples)

```ruby
# Use clear, explicit types in examples
def process_user(user: User): UserResponse
  UserResponse.new(
    id: user.id,
    name: user.name,
    email: user.email
  )
end

# Add type annotations for clarity
users: Array<User> = fetch_users()
active_users: Array<User> = users.select { |u| u.active? }
```

### Documentation Style

```ruby
# Good documentation
# Infers the type of an array literal
#
# @param elements [Array<AST::Node>] Array literal elements
# @return [ArrayType] Inferred array type
# @example
#   infer_array_type([IntNode.new(1), IntNode.new(2)])
#   #=> ArrayType<Integer>
def infer_array_type(elements)
  # ...
end
```

## Testing Guidelines

### Writing Tests

```ruby
RSpec.describe TypeChecker do
  describe '#infer_type' do
    it 'infers Integer for integer literals' do
      node = AST::IntegerNode.new(42)
      type = checker.infer_type(node)

      expect(type).to be_a(IntegerType)
    end

    it 'infers Union type for union syntax' do
      node = AST::UnionNode.new(
        StringType.new,
        IntegerType.new
      )
      type = checker.infer_type(node)

      expect(type).to be_a(UnionType)
      expect(type.types).to include(StringType.new, IntegerType.new)
    end

    context 'with generic types' do
      it 'infers Array<T> from literal' do
        # ...
      end
    end
  end
end
```

### Test Organization

```
spec/
├── compiler/
│   ├── parser_spec.rb
│   ├── type_checker_spec.rb
│   └── code_generator_spec.rb
├── types/
│   ├── union_type_spec.rb
│   ├── generic_type_spec.rb
│   └── intersection_type_spec.rb
└── integration/
    ├── compile_spec.rb
    └── type_check_spec.rb
```

## Adding Standard Library Types

### 1. Create Type Definition File

```ruby
# lib/t_ruby/stdlib/json.trb

# Type definitions for JSON module
module JSON
  def self.parse(source: String): Any
  end

  def self.generate(obj: Any): String
  end

  def self.pretty_generate(obj: Any): String
  end
end
```

### 2. Add Tests

```ruby
# spec/stdlib/json_spec.rb

RSpec.describe 'JSON types' do
  it 'type checks JSON.parse' do
    code = <<~RUBY
      require 'json'

      data: String = '{"name": "Alice"}'
      result = JSON.parse(data)
    RUBY

    expect(type_check(code)).to be_valid
  end
end
```

### 3. Document the Types

Add to `/docs/reference/stdlib-types.md`:

```markdown
### JSON

```ruby
def parse_json(file: String): Hash<String, Any>
  JSON.parse(File.read(file))
end
```

**Type Signatures:**
- `JSON.parse(source: String): Any`
- `JSON.generate(obj: Any): String`
```

## Documentation Contributions

### Documentation Structure

```
docs/
├── introduction/         # Getting started
├── getting-started/      # Installation and setup
├── learn/               # Tutorials and guides
│   ├── basics/
│   ├── everyday-types/
│   ├── functions/
│   ├── classes/
│   ├── interfaces/
│   ├── generics/
│   └── advanced/
├── reference/           # API reference
│   ├── cheatsheet.md
│   ├── built-in-types.md
│   ├── type-operators.md
│   └── stdlib-types.md
├── cli/                # CLI documentation
├── tooling/            # Editor and tool integration
└── project/            # Project information
    ├── roadmap.md
    ├── contributing.md
    └── changelog.md
```

### Writing Documentation

1. **Use clear examples** - Show, don't just tell
2. **Explain the "why"** - Not just the "how"
3. **Include common pitfalls** - Help users avoid mistakes
4. **Link related topics** - Help users discover more
5. **Keep it concise** - Respect readers' time

## Review Process

### For Maintainers

When reviewing PRs:

1. **Check correctness** - Does it work as intended?
2. **Review tests** - Are there adequate tests?
3. **Check style** - Does it follow our guidelines?
4. **Consider impact** - Breaking changes? Performance?
5. **Provide feedback** - Be helpful and constructive
6. **Approve or request changes** - Clear next steps

### Response Times

We aim for:

- **First response** - Within 2 business days
- **Review cycle** - Within 1 week
- **Merge decision** - Within 2 weeks

## Release Process

### Version Numbers

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes (v1.0.0 → v2.0.0)
- **MINOR** - New features, backward compatible (v1.0.0 → v1.1.0)
- **PATCH** - Bug fixes (v1.0.0 → v1.0.1)

### Release Checklist

1. Update version in `lib/t_ruby/version.rb`
2. Update CHANGELOG.md
3. Run full test suite
4. Build and test gem
5. Create git tag
6. Push to GitHub
7. Create GitHub release
8. Publish gem to RubyGems
9. Announce release

## Getting Help

### Where to Ask Questions

- **GitHub Discussions** - General questions, ideas
- **GitHub Issues** - Bug reports, feature requests
- **Discord** - Real-time chat with community
- **Stack Overflow** - Tag questions with `t-ruby`

### Good Questions Include

- What you're trying to accomplish
- What you've tried so far
- Minimal code example
- Error messages (if any)
- T-Ruby and Ruby versions

## Recognition

Contributors are recognized:

- **Contributors list** - In README and website
- **Release notes** - Mentioned in changelog
- **Special thanks** - For significant contributions

## License

By contributing to T-Ruby, you agree that your contributions will be licensed under the MIT License.

## Resources

- **GitHub Repository** - https://github.com/t-ruby/t-ruby
- **Documentation** - https://t-ruby.github.io
- **Style Guide** - https://rubystyle.guide/
- **RSpec Guide** - https://rspec.info/
- **Semantic Versioning** - https://semver.org/

## Contact

- **Email** - maintainers@t-ruby.org
- **Twitter** - @t_ruby
- **Discord** - [Join our server](https://discord.gg/t-ruby)

---

Thank you for contributing to T-Ruby! Your efforts help make Ruby development better for everyone.
