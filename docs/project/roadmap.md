---
sidebar_position: 1
title: Roadmap
description: T-Ruby development roadmap
---

import VersionBadge from '@site/src/components/VersionBadge';

<DocsBadge />


# Roadmap

T-Ruby is under active development. This roadmap outlines the current status, upcoming features, and long-term vision for the project.

## Project Status

:::caution Active Development
T-Ruby is currently in **active development**. While core features are stable and well-tested, the language and tooling continue to evolve. Breaking changes may occur between versions.
:::

**Current Version:** <VersionBadge component="compiler" />
**License:** MIT

## Completed Milestones

### Milestone 1: Basic Type Parsing & Erasure ✅

- Parameter/return type annotations
- Type erasure for valid Ruby output
- Error handling and validation

### Milestone 2: Core Type System ✅

| Feature | Description |
|---------|-------------|
| Type Aliases | `type UserId = String` |
| Interfaces | `interface Readable ... end` |
| Union Types | `String \| Integer \| nil` |
| Generics | `Array<String>`, `Map<K, V>` |
| Intersections | `Readable & Writable` |
| RBS Generation | `.rbs` file output |

### Milestone 3: Ecosystem & Tooling ✅

| Feature | Status |
|---------|--------|
| LSP Server | ✅ Implemented |
| Declaration Files (.d.trb) | ✅ Implemented |
| VSCode Extension | ✅ Published |
| JetBrains Plugin | ✅ [Marketplace](https://plugins.jetbrains.com/plugin/29335-t-ruby) |
| Vim/Neovim Integration | ✅ Available |
| Stdlib Types | ✅ Comprehensive coverage |

### Milestone 4: Advanced Features ✅

| Feature | Description |
|---------|-------------|
| Constraint System | Generic type constraints |
| Type Inference | Automatic type detection |
| Runtime Validation | Optional runtime checks |
| Type Checking | SMT-based type verification |
| Caching | Incremental compilation support |
| Package Management | Type package system |

### Milestone 5: Infrastructure ✅

| Feature | Description |
|---------|-------------|
| Bundler Integration | Ruby ecosystem integration |
| IR System | Intermediate representation with optimization passes |
| Parser Combinator | Composable parsers for complex type grammars |
| SMT Solver | Constraint solving for advanced type inference |

### Milestone 6: Integration & Production Readiness ✅

| Feature | Status |
|---------|--------|
| Parser Combinator Integration | ✅ Replaced legacy parser |
| IR-based Compiler | ✅ Full IR pipeline |
| SMT-based Type Checking | ✅ Integrated |
| LSP v2 + Semantic Tokens | ✅ Type-based syntax highlighting |
| Incremental Compilation | ✅ Cache-based |
| Cross-file Type Checking | ✅ Multi-file support |
| Rails/RSpec/Sidekiq Types | ✅ Available |
| WebAssembly Target | ✅ `@t-ruby/wasm` (<VersionBadge component="wasm" />) |

## Current Focus

### Milestone 7: Next Generation (In Progress)

| Feature | Description | Status |
|---------|-------------|--------|
| External SMT Solver (Z3) | Enhanced type inference with Z3 | Planned |
| LSP v3 | Language Server Protocol 3.x support | Planned |
| Type-safe Metaprogramming | Safe `define_method`, `method_missing` | Planned |
| Gradual Typing Migration | Tools for migrating existing Ruby code | Planned |

## Planned Features

### Type System Enhancements

- [ ] Tuple types (`[String, Integer, Bool]`)
- [ ] Recursive type aliases
- [ ] Variance annotations (`in`, `out`)
- [ ] Conditional types (`T extends U ? X : Y`)
- [ ] Mapped types
- [ ] Readonly modifier

### Advanced Type Features

- [ ] Template literal types
- [ ] Discriminated unions
- [ ] Branded types
- [ ] Opaque types
- [ ] Dependent types (research)

### Module System

- [ ] Module type annotations
- [ ] Namespace support
- [ ] Import/export type syntax
- [ ] Module interfaces

## Future Vision

### Advanced Features

- [ ] Effect system (tracking side effects)
- [ ] Ownership and borrowing concepts
- [ ] Algebraic data types
- [ ] Pattern matching types
- [ ] Refinement types

### Ecosystem

- [ ] Type definition repository
- [ ] Cloud-based type checking service
- [ ] Sorbet compatibility mode
- [ ] Steep integration

## Research Areas

We're actively researching these advanced features:

### 1. Effect Types
Track side effects in the type system:

```trb
def read_file(path: String): String throws IOError
def calculate(x: Integer): Integer pure
```

### 2. Dependent Types
Types that depend on values:

```trb
def create_array<N: Integer>(size: N): Array<T>[N]
# Returns array of exactly N elements
```

### 3. Linear Types
Ensure resources are used exactly once:

```trb
def process_file(handle: File) consume: String
# handle can't be used after this call
```

### 4. Row Polymorphism
Flexible record types:

```trb
def add_id<T: { ... }>(obj: T): T & { id: Integer }
```

## Version History

| Component | Current Version |
|-----------|----------------|
| Compiler | <VersionBadge component="compiler" /> |
| VSCode Extension | <VersionBadge component="vscode" /> |
| JetBrains Plugin | <VersionBadge component="jetbrains" /> |
| WASM Package | <VersionBadge component="wasm" /> |

## Breaking Changes Policy

### Current Phase (Pre-1.0)
- Breaking changes may occur in any release
- Deprecation warnings provided when possible
- Migration guides for major changes
- Changelog documents all breaking changes

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

## Get Involved

Help shape T-Ruby's future:

- **Documentation** - Improve docs and examples
- **Testing** - Report bugs and edge cases
- **Features** - Propose and implement features
- **Tooling** - Build editor extensions
- **Types** - Add stdlib and gem type definitions
- **Community** - Answer questions, write tutorials

See our [Contributing Guide](/docs/project/contributing) to get started.

## Stay Updated

- **GitHub** - Watch the repository for updates
- **Twitter** - Follow [@t_ruby](https://twitter.com/t_ruby) for announcements
- **Discord** - Join our community chat

---

*Roadmap is subject to change based on community feedback and priorities.*
