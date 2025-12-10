<p align="center">
  <img src="static/img/logo.svg" width="200" alt="T-Ruby Logo">
</p>

<h1 align="center">T-Ruby Documentation</h1>

<p align="center">
  <b>Type-safe Ruby, the TypeScript way</b>
</p>

<p align="center">
  <a href="https://type-ruby.github.io">Documentation</a> •
  <a href="https://github.com/type-ruby/t-ruby">T-Ruby Repository</a>
</p>

---

## About This Repository

This repository contains the source code for the [T-Ruby official documentation website](https://type-ruby.github.io).

The documentation site is built with [Docusaurus](https://docusaurus.io/) and supports multiple languages (English, Korean, Japanese).

## What is T-Ruby?

**T-Ruby** is a typed superset of Ruby that compiles to plain Ruby — just like TypeScript does for JavaScript.

- Write `.trb` files with type annotations
- Compile to standard `.rb` files with **zero runtime overhead**
- Automatically generate `.rbs` signature files for type checkers

```ruby
# input.trb
def greet(name: String): String
  "Hello, #{name}!"
end
```

```ruby
# output.rb (compiled)
def greet(name)
  "Hello, #{name}!"
end
```

```ruby
# output.rbs (generated)
def greet: (String name) -> String
```

For more information, visit the [T-Ruby repository](https://github.com/type-ruby/t-ruby).

## Local Development

### Prerequisites

- Node.js 20.0 or higher
- pnpm

### Installation

```bash
pnpm install
```

### Start Development Server

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
pnpm build
```

This command generates static content into the `build` directory.

### Deployment

```bash
pnpm deploy
```

This command builds the website and pushes to the `gh-pages` branch for GitHub Pages hosting.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Related Links

- [T-Ruby Repository](https://github.com/type-ruby/t-ruby) - The main T-Ruby compiler
- [Documentation Website](https://type-ruby.github.io) - Live documentation site
