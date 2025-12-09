---
sidebar_position: 1
title: Roadmap
description: T-Ruby development roadmap
---

# Roadmap

T-Ruby is under active development. This roadmap outlines the current status, upcoming features, and long-term vision for the project.

## Project Status

:::caution Experimental Release
T-Ruby is currently in **experimental/alpha** status. While core features work, the language and tooling are evolving. Breaking changes may occur between versions. Use in production at your own risk.
:::

**Current Version:** v0.1.0-alpha
**Released:** December 2025
**License:** MIT

## Core Features Status

### ✅ Completed (v0.1.0)

#### Type System
- [x] Basic types (String, Integer, Float, Bool, Symbol, nil)
- [x] Union types (`String | Integer`)
- [x] Optional types (`String?`)
- [x] Array and Hash generics (`Array<T>`, `Hash<K, V>`)
- [x] Type inference for variables and return values
- [x] Function parameter and return type annotations
- [x] Instance variable type annotations
- [x] Class variable type annotations
- [x] Type narrowing with `is_a?` and `nil?`
- [x] Literal types (string, number, symbol, boolean literals)

#### Compiler
- [x] `.trb` to `.rb` compilation
- [x] Type erasure (zero runtime overhead)
- [x] `.rbs` file generation
- [x] Source maps for debugging
- [x] Watch mode (`--watch`)
- [x] Type checking mode (`--check`)
- [x] Error messages with file location

#### Generics
- [x] Generic functions (`def func<T>(...)`)
- [x] Generic classes (`class Box<T>`)
- [x] Multiple type parameters
- [x] Type parameter inference
- [x] Nested generics

#### Advanced Types
- [x] Type aliases (`type UserID = Integer`)
- [x] Generic type aliases (`type Result<T> = T | nil`)
- [x] Intersection types (`Printable & Comparable`)
- [x] Proc types (`Proc<T, R>`)
- [x] `void` return type
- [x] `never` type for non-returning functions
- [x] `self` type for method chaining

#### Standard Library
- [x] Core Ruby types (File, Dir, Time, etc.)
- [x] JSON type signatures
- [x] Common stdlib modules (CSV, Logger, etc.)

### 🚧 In Progress (v0.2.0 - Q1 2026)

#### Type System Enhancements
- [ ] Tuple types (`[String, Integer, Bool]`)
- [ ] Recursive type aliases
- [ ] Variance annotations (`in`, `out`)
- [ ] Type guards with `is` keyword
- [ ] Conditional types (`T extends U ? X : Y`)
- [ ] Mapped types
- [ ] Readonly modifier

#### Tooling
- [ ] Language Server Protocol (LSP) implementation
- [ ] VSCode extension
- [ ] Syntax highlighting for major editors
- [ ] Auto-complete support
- [ ] Go-to-definition
- [ ] Find references
- [ ] Rename refactoring

#### Compiler Improvements
- [ ] Incremental compilation
- [ ] Parallel type checking
- [ ] Better error messages with suggestions
- [ ] Type error recovery (continue checking after errors)
- [ ] Performance optimizations

#### Standard Library
- [ ] Complete Ruby core library coverage
- [ ] Rails type definitions (basic)
- [ ] Popular gems type definitions

### 📋 Planned (v0.3.0 - Q2 2026)

#### Advanced Type Features
- [ ] Template literal types
- [ ] Discriminated unions
- [ ] Type assertions improvements
- [ ] Branded types
- [ ] Opaque types
- [ ] Dependent types (research)

#### Interfaces
- [ ] Structural typing improvements
- [ ] Interface inheritance
- [ ] Mixin type support
- [ ] Duck typing refinements

#### Module System
- [ ] Module type annotations
- [ ] Namespace support
- [ ] Import/export type syntax
- [ ] Module interfaces

#### Tooling
- [ ] JetBrains IDE plugin
- [ ] Sublime Text plugin
- [ ] Vim/Neovim integration
- [ ] Code formatting tool (`trc fmt`)
- [ ] Documentation generator

### 🔮 Future (v0.4.0+)

#### Advanced Features
- [ ] Effect system (tracking side effects)
- [ ] Ownership and borrowing concepts
- [ ] Algebraic data types
- [ ] Pattern matching types
- [ ] Refinement types
- [ ] Gradual typing improvements

#### Ecosystem
- [ ] Rails integration package
- [ ] Sinatra type definitions
- [ ] RSpec type-safe matchers
- [ ] Gem ecosystem support
- [ ] Type definition repository

#### Performance
- [ ] JIT compilation for type checking
- [ ] Caching layer for large projects
- [ ] Distributed type checking
- [ ] Cloud-based type checking service

#### Interoperability
- [ ] Sorbet compatibility mode
- [ ] Steep integration
- [ ] RBS import/export improvements
- [ ] TypeScript type conversion utility

## Milestones

### Milestone 1: Developer Preview (✅ Completed - Dec 2025)
- Core type system working
- Basic compiler functionality
- Initial documentation
- Example projects

### Milestone 2: Alpha Release (Current - v0.1.0)
- Stable core features
- Comprehensive documentation
- Community feedback incorporation
- Bug fixes and improvements

### Milestone 3: Beta Release (Target: Q2 2026 - v0.3.0)
- Production-ready tooling
- Complete standard library types
- No breaking changes to core syntax
- Performance optimizations
- Editor support

### Milestone 4: Stable Release (Target: Q4 2026 - v1.0.0)
- Battle-tested in real projects
- Comprehensive test suite
- Full documentation
- Stable API
- Long-term support commitment

## Feature Requests

We're actively collecting community feedback. Top requested features:

1. **Better IDE Support** - LSP implementation (In Progress)
2. **Rails Types** - Comprehensive Rails type definitions (Planned)
3. **Gradual Migration Tools** - Convert Ruby to T-Ruby automatically
4. **Type Definition Generator** - Generate `.trb` types from existing Ruby
5. **Performance Improvements** - Faster compilation for large projects
6. **Better Error Messages** - More helpful type error explanations
7. **Pattern Matching Types** - Type-safe pattern matching
8. **Null Safety** - Strict null checking mode

## Research Areas

We're actively researching these advanced features:

### 1. Effect Types
Track side effects in the type system:
```ruby
def read_file(path: String): String throws IOError
def calculate(x: Integer): Integer pure
```

### 2. Dependent Types
Types that depend on values:
```ruby
def create_array<N: Integer>(size: N): Array<T>[N]
# Returns array of exactly N elements
```

### 3. Linear Types
Ensure resources are used exactly once:
```ruby
def process_file(handle: File) consume: String
# handle can't be used after this call
```

### 4. Row Polymorphism
Flexible record types:
```ruby
def add_id<T: { ... }>(obj: T): T & { id: Integer }
```

## Community Priorities

Based on community voting, we're prioritizing:

### Short Term (Next 3 Months)
1. LSP implementation for editor support
2. Better error messages
3. Performance improvements for large codebases
4. Rails basic type definitions

### Medium Term (3-6 Months)
1. Complete standard library coverage
2. Tuple types
3. Recursive type aliases
4. VSCode extension polish

### Long Term (6-12 Months)
1. JetBrains plugin
2. Advanced type features
3. Type definition repository
4. Cloud type checking

## Breaking Changes Policy

### Current Phase (Alpha)
- Breaking changes may occur in any release
- Deprecation warnings provided when possible
- Migration guides for major changes
- Changelog documents all breaking changes

### Beta Phase (Future)
- Breaking changes only in minor versions
- Minimum 1-month deprecation period
- Comprehensive migration tooling
- Detailed upgrade guides

### Stable Phase (v1.0+)
- No breaking changes in patch versions
- Breaking changes only in major versions
- Minimum 6-month deprecation period
- Automated migration tools
- LTS releases for enterprises

## How to Influence the Roadmap

We welcome community input:

1. **Vote on Features** - Star issues on GitHub to show interest
2. **Request Features** - Open detailed feature requests
3. **Contribute Code** - Submit PRs for roadmap items
4. **Share Feedback** - Tell us what works and what doesn't
5. **Join Discussions** - Participate in RFC process

## Release Schedule

We aim for predictable releases:

- **Patch releases** (v0.1.x): Monthly, bug fixes only
- **Minor releases** (v0.x.0): Quarterly, new features
- **Major releases** (vX.0.0): Yearly, breaking changes

### Upcoming Releases

| Version | Target Date | Focus Areas |
|---------|-------------|-------------|
| v0.1.1 | Jan 2026 | Bug fixes, performance |
| v0.2.0 | Mar 2026 | LSP, tooling, tuples |
| v0.3.0 | Jun 2026 | Rails types, advanced features |
| v0.4.0 | Sep 2026 | Ecosystem, plugins |
| v1.0.0 | Dec 2026 | Stable release |

## Project Metrics

Our current focus areas and success metrics:

### Quality Metrics
- [ ] 90%+ test coverage
- [ ] All core features documented
- [ ] Under 100ms type check for typical files
- [ ] Under 5% false positive error rate

### Adoption Metrics
- [ ] 100+ GitHub stars
- [ ] 10+ contributors
- [ ] 5+ production projects
- [ ] 1000+ npm downloads/month

### Ecosystem Metrics
- [ ] 20+ gems with type definitions
- [ ] 3+ editor extensions
- [ ] 50+ example projects
- [ ] Active community forum

## Long-Term Vision

Our vision for T-Ruby:

### 5-Year Goals
- **Default choice** for typed Ruby development
- **Mature ecosystem** with types for top gems
- **Industry adoption** in production applications
- **Active community** contributing types and tools
- **Research platform** for programming language innovations

### Aspirations
- Make Ruby development safer without sacrificing productivity
- Prove gradual typing works for dynamic languages
- Build tooling that delights developers
- Foster a welcoming, inclusive community
- Contribute research back to the PL community

## Get Involved

Help shape T-Ruby's future:

- 📖 **Documentation** - Improve docs and examples
- 🐛 **Testing** - Report bugs and edge cases
- 💡 **Features** - Propose and implement features
- 🎨 **Tooling** - Build editor extensions
- 📚 **Types** - Add stdlib and gem type definitions
- 🗣️ **Community** - Answer questions, write tutorials

See our [Contributing Guide](/docs/project/contributing) to get started.

## Stay Updated

- **GitHub** - Watch the repository for updates
- **Twitter** - Follow [@t_ruby](https://twitter.com/t_ruby) for announcements
- **Blog** - Read release notes and tutorials
- **Discord** - Join our community chat
- **Newsletter** - Monthly updates (coming soon)

---

*Last updated: December 2025*
*Roadmap is subject to change based on community feedback and priorities.*
