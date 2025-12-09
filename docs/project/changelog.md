---
sidebar_position: 3
title: Changelog
description: T-Ruby release history
---

# Changelog

All notable changes to T-Ruby will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Tuple types
- Recursive type aliases
- Language Server Protocol (LSP) implementation
- VSCode extension
- Improved error messages
- Rails type definitions

## [0.1.0-alpha] - 2025-12-09

### Overview

Initial alpha release of T-Ruby! This release includes core type system features, a working compiler, and basic tooling. T-Ruby is now ready for experimental use and community feedback.

:::caution Experimental Release
This is an alpha release. APIs may change, and breaking changes can occur. Not recommended for production use.
:::

### Added

#### Type System
- **Basic Types** - `String`, `Integer`, `Float`, `Bool`, `Symbol`, `nil`
- **Special Types** - `Any`, `void`, `never`, `self`
- **Union Types** - Combine multiple types with `|` operator
- **Optional Types** - Shorthand `T?` for `T | nil`
- **Array Generics** - `Array<T>` for typed arrays
- **Hash Generics** - `Hash<K, V>` for typed hashes
- **Type Inference** - Automatic type inference for variables and returns
- **Type Narrowing** - Smart narrowing with `is_a?` and `nil?`
- **Literal Types** - String, number, symbol, and boolean literals
- **Type Aliases** - Create custom type names with `type`
- **Generic Type Aliases** - Generic aliases like `type Result<T> = T | nil`
- **Intersection Types** - Combine interfaces with `&` operator
- **Proc Types** - Type-safe procs and lambdas with `Proc<Args, Return>`

#### Functions
- Parameter type annotations
- Return type annotations
- Optional parameters with types
- Rest parameters with types
- Keyword arguments with types
- Block parameter types
- Generic functions
- Multiple type parameters
- Type parameter inference

#### Classes
- Instance variable type annotations
- Class variable type annotations
- Constructor types
- Method type annotations
- Generic classes
- Multiple class type parameters
- Inheritance with types
- Mixin/module type support

#### Interfaces
- Interface definitions
- Interface implementation
- Structural typing
- Duck typing support
- Generic interfaces
- Intersection of interfaces

#### Compiler
- `.trb` to `.rb` compilation
- Type erasure (zero runtime overhead)
- `.rbs` file generation
- Source maps for debugging
- File watching with `--watch`
- Type checking mode with `--check`
- Detailed error messages with locations
- Colored terminal output
- Exit codes for CI integration

#### Standard Library
- Core Ruby type definitions (File, Dir, IO)
- Time and Date types
- JSON module types
- YAML module types
- CSV module types
- Logger types
- Net::HTTP types
- URI types
- File system utilities (FileUtils, Pathname)
- String manipulation (StringIO)
- Collections (Set)
- Cryptography (Digest, Base64, SecureRandom)
- Templates (ERB)
- Benchmarking (Benchmark)
- Timeout utilities

#### Documentation
- Comprehensive getting started guide
- Type system tutorials
- API reference documentation
- Standard library type reference
- CLI command documentation
- Editor setup guides
- Migration guides from plain Ruby
- Example projects
- Cheatsheet for quick reference
- Troubleshooting guides

#### Tooling
- `trc` command-line compiler
- `--version` flag for version info
- `--help` for command documentation
- `--check` for type-only checking
- `--watch` for development workflow
- `--output` for custom output paths
- `--rbs` flag for RBS generation
- Colorized error output
- Pretty-printed type errors

### Changed
- N/A (initial release)

### Deprecated
- N/A (initial release)

### Removed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- N/A (initial release)

## Release Notes

### v0.1.0-alpha - Initial Alpha Release

**Release Date:** December 9, 2025

This is the first public release of T-Ruby! After months of development, we're excited to share T-Ruby with the Ruby community.

#### What's Included

T-Ruby brings TypeScript-style static typing to Ruby. Write code in `.trb` files with type annotations, compile to plain Ruby with zero runtime overhead, and enjoy better tooling and fewer bugs.

#### Key Features

1. **Gradual Typing** - Add types at your own pace. All Ruby is valid T-Ruby.
2. **Zero Runtime Cost** - Types are erased at compile time. No performance penalty.
3. **RBS Generation** - Automatically generate `.rbs` files for integration with existing tools.
4. **Familiar Syntax** - If you know TypeScript, you'll feel at home.
5. **Comprehensive Stdlib** - Type definitions for common Ruby standard library modules.

#### Getting Started

```bash
# Install T-Ruby
gem install t-ruby

# Create a file
echo 'def greet(name: String): String
  "Hello, #{name}!"
end' > hello.trb

# Compile it
trc hello.trb

# Run the generated Ruby
ruby hello.rb
```

#### Example Code

```ruby
# hello.trb - Type-safe Ruby
class User
  @name: String
  @email: String
  @age: Integer

  def initialize(name: String, email: String, age: Integer): void
    @name = name
    @email = email
    @age = age
  end

  def greet: String
    "Hello, my name is #{@name}"
  end

  def adult?: Bool
    @age >= 18
  end
end

# Create users
alice: User = User.new("Alice", "alice@example.com", 30)
bob: User = User.new("Bob", "bob@example.com", 17)

# Type-safe operations
users: Array<User> = [alice, bob]
adults: Array<User> = users.select { |u| u.adult? }

adults.each do |user|
  puts user.greet
end
```

After compiling with `trc hello.trb`, this generates clean Ruby code with all type annotations removed.

#### Known Limitations

This alpha release has some limitations:

- **Incomplete stdlib coverage** - Not all Ruby standard library modules have types yet
- **No IDE support** - LSP and editor extensions coming in v0.2
- **Limited error recovery** - Type checker stops at first error in some cases
- **Performance** - Large projects may experience slow type checking
- **Breaking changes possible** - API may change in future alpha releases

#### What's Next

We're already working on v0.2.0 with:

- Language Server Protocol (LSP) for IDE support
- VSCode extension
- Tuple types
- Recursive type aliases
- Better error messages
- Performance improvements

#### Feedback Welcome

This is an experimental release. We'd love your feedback!

- Report bugs on [GitHub Issues](https://github.com/t-ruby/t-ruby/issues)
- Suggest features in [GitHub Discussions](https://github.com/t-ruby/t-ruby/discussions)
- Join our [Discord community](https://discord.gg/t-ruby)
- Follow [@t_ruby](https://twitter.com/t_ruby) for updates

#### Contributors

Thank you to everyone who contributed to this release:

- Initial development and design
- Type system implementation
- Documentation and examples
- Testing and bug reports
- Community feedback and support

Special thanks to the Ruby and TypeScript communities for inspiration and guidance.

#### License

T-Ruby is released under the MIT License. See LICENSE file for details.

---

## Version History

| Version | Release Date | Status | Highlights |
|---------|--------------|--------|------------|
| [0.1.0-alpha](#010-alpha---2025-12-09) | 2025-12-09 | Alpha | Initial release, core features |
| 0.2.0 | TBD | Planned | LSP, tuples, tooling |
| 0.3.0 | TBD | Planned | Rails types, advanced features |
| 1.0.0 | TBD | Planned | Stable release |

## Upgrade Guides

### Upgrading to v0.1.0-alpha

This is the initial release, so there's nothing to upgrade from. Welcome to T-Ruby!

For future upgrades, we'll provide detailed migration guides here.

## Deprecation Notices

No current deprecations. We'll announce deprecations well in advance of removal.

## Breaking Changes Policy

### Alpha Phase (Current)
- Breaking changes may occur in any version
- We'll provide deprecation warnings when possible
- Migration guides for significant changes

### Beta Phase (Future)
- Breaking changes only in minor versions (0.x.0)
- Minimum 1-month deprecation period
- Automated migration tools where possible

### Stable Phase (v1.0+)
- No breaking changes in patch versions (1.0.x)
- Breaking changes only in major versions (2.0.0)
- Minimum 6-month deprecation period
- Long-term support for major versions

## Semantic Versioning

T-Ruby follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0) - Incompatible API changes
- **MINOR** version (0.X.0) - New features, backward compatible
- **PATCH** version (0.0.X) - Bug fixes, backward compatible

During alpha/beta (0.x.x), breaking changes may occur in minor versions.

## Release Channels

### Stable
Current stable version for production use (v1.0.0+, when available).

### Beta
Feature-complete release candidates (v0.x.0, future).

### Alpha
Experimental releases with core features (v0.1.0-alpha, current).

### Nightly
Bleeding edge builds from `main` branch (not recommended).

## Stay Updated

- Watch the [GitHub repository](https://github.com/t-ruby/t-ruby) for releases
- Follow [@t_ruby](https://twitter.com/t_ruby) for announcements
- Join [Discord](https://discord.gg/t-ruby) for discussions
- Subscribe to the newsletter (coming soon)

## Archive

All releases are available on:
- [GitHub Releases](https://github.com/t-ruby/t-ruby/releases)
- [RubyGems.org](https://rubygems.org/gems/t-ruby)

---

*For the latest development status, see the [Roadmap](/docs/project/roadmap).*
*To contribute, see the [Contributing Guide](/docs/project/contributing).*
