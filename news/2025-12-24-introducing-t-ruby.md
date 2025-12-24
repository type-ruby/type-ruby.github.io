---
slug: introducing-t-ruby
title: Introducing T-Ruby
authors: [yhk1038]
tags: [announcement]
---

We're excited to introduce T-Ruby, a TypeScript-style static type system for Ruby.

T-Ruby brings the familiar TypeScript development experience to Ruby developers, allowing you to add type annotations directly in your code and catch type errors before runtime.

## Key Features

- **TypeScript-style syntax**: Familiar type annotation syntax for TypeScript developers
- **Gradual typing**: Add types incrementally to your existing Ruby codebase
- **RBS generation**: Automatically generate `.rbs` signature files
- **Zero runtime overhead**: Types are stripped at compile time

## Getting Started

Install T-Ruby and start adding types to your Ruby code:

```bash
gem install t-ruby
```

Create your first `.trb` file:

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

Compile to Ruby:

```bash
trc greet.trb
```

Check out our [documentation](/docs/introduction/what-is-t-ruby) to learn more!
