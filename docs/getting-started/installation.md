---
sidebar_position: 1
title: Installation
description: How to install T-Ruby
---

<DocsBadge />


# Installation

This guide will help you install T-Ruby on your system. T-Ruby requires Ruby 3.0 or later.

## Prerequisites

Before installing T-Ruby, make sure you have:

- **Ruby 3.0+** installed ([ruby-lang.org](https://www.ruby-lang.org/en/downloads/))
- **RubyGems** (comes with Ruby)
- A terminal/command prompt

To verify your Ruby installation:

```bash
ruby --version
# Should output: ruby 3.x.x ...
```

## Install via RubyGems

The easiest way to install T-Ruby is via RubyGems:

```bash
gem install t-ruby
```

This installs the `trc` compiler globally on your system.

Verify the installation:

```bash
trc --version
# Should output: trc x.x.x
```

## Install via Bundler

For project-specific installation, add T-Ruby to your `Gemfile`:

```ruby title="Gemfile"
group :development do
  gem 't-ruby'
end
```

Then run:

```bash
bundle install
```

Use `bundle exec trc` to run the compiler:

```bash
bundle exec trc --version
```

## Install from Source

For the latest development version:

```bash
git clone https://github.com/type-ruby/t-ruby.git
cd t-ruby
bundle install
rake install
```

## Platform-Specific Notes

### macOS

T-Ruby works out of the box on macOS. If you use Homebrew:

```bash
# Install Ruby if needed
brew install ruby

# Then install T-Ruby
gem install t-ruby
```

### Linux

Most Linux distributions work without issues. On Ubuntu/Debian:

```bash
# Install Ruby if needed
sudo apt-get update
sudo apt-get install ruby ruby-dev

# Install T-Ruby
gem install t-ruby
```

### Windows

T-Ruby supports Windows via RubyInstaller:

1. Download and install [RubyInstaller](https://rubyinstaller.org/)
2. Open a command prompt and run:

```bash
gem install t-ruby
```

## Verify Installation

After installation, verify everything works:

```bash
# Check version
trc --version

# Show help
trc --help

# Create a test file
echo 'def greet(name: String): String; "Hello, #{name}!"; end' > test.trb

# Compile it
trc test.trb

# Check the output
cat build/test.rb
```

## Updating T-Ruby

To update to the latest version:

```bash
gem update t-ruby
```

## Uninstalling

To remove T-Ruby:

```bash
gem uninstall t-ruby
```

## Troubleshooting

### "Command not found: trc"

The gem binary path might not be in your PATH. Find it with:

```bash
gem environment | grep "EXECUTABLE DIRECTORY"
```

Add the directory to your shell's PATH.

### Permission errors on Linux/macOS

If you get permission errors, either:

1. Use a Ruby version manager (rbenv, rvm)
2. Use `sudo gem install t-ruby` (not recommended)
3. Configure gem to install to your home directory

### Build errors

If compilation fails, ensure you have development tools installed:

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential

# Fedora
sudo dnf groupinstall "Development Tools"
```

## Next Steps

Now that T-Ruby is installed, let's write some code:

- [Quick Start](/docs/getting-started/quick-start) - Get running in 5 minutes
- [Your First .trb File](/docs/getting-started/first-trb-file) - A detailed walkthrough
- [Editor Setup](/docs/getting-started/editor-setup) - Configure your IDE
