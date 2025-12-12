---
sidebar_position: 2
title: Quick Start
description: Get started with T-Ruby in 5 minutes
---

<DocsBadge />


# Quick Start

Let's get you writing typed Ruby in under 5 minutes. This guide assumes you've already [installed T-Ruby](/docs/getting-started/installation).

## Step 1: Create a Project Directory

```bash
mkdir my-truby-project
cd my-truby-project
```

## Step 2: Write Your First T-Ruby File

Create a file called `hello.trb`:

```trb title="hello.trb"
# A simple typed function
def greet(name: String): String
  "Hello, #{name}!"
end

# A function with multiple parameters
def add(a: Integer, b: Integer): Integer
  a + b
end

# Using the functions
puts greet("World")
puts add(5, 3)
```

## Step 3: Compile

Run the T-Ruby compiler:

```bash
trc hello.trb
```

This creates two files in the `build/` directory:

```
build/
├── hello.rb    # Compiled Ruby code
└── hello.rbs   # Type signatures
```

## Step 4: Run Your Code

```bash
ruby build/hello.rb
```

Output:
```
Hello, World!
8
```

## Step 5: Explore the Output

Let's look at what T-Ruby generated:

```ruby title="build/hello.rb"
# Types have been erased - this is standard Ruby
def greet(name)
  "Hello, #{name}!"
end

def add(a, b)
  a + b
end

puts greet("World")
puts add(5, 3)
```

```rbs title="build/hello.rbs"
def greet: (String name) -> String
def add: (Integer a, Integer b) -> Integer
```

## Try Type Checking

Now let's see type checking in action. Modify `hello.trb` to introduce a bug:

```trb title="hello.trb (with bug)"
def greet(name: String): String
  "Hello, #{name}!"
end

# Bug: passing an Integer where String is expected
puts greet(42)
```

Compile again:

```bash
trc hello.trb
```

T-Ruby catches the error:

```
Error: hello.trb:6:12
  Type mismatch: expected String, got Integer

    puts greet(42)
               ^^
```

The code won't compile until you fix the type error.

## Using Watch Mode

For development, use watch mode to automatically recompile on changes:

```bash
trc watch .
```

Now every time you save a `.trb` file, it's automatically compiled.

## Quick Reference

Here's a summary of the commands you'll use most:

| Command | Description |
|---------|-------------|
| `trc file.trb` | Compile a single file |
| `trc *.trb` | Compile multiple files |
| `trc .` | Compile all .trb files in current directory |
| `trc watch .` | Watch and auto-compile on changes |
| `trc check file.trb` | Type-check without generating output |
| `trc init` | Initialize a new T-Ruby project |

## What's Next?

You've written and compiled your first T-Ruby code! Here's where to go next:

1. **[Your First .trb File](/docs/getting-started/first-trb-file)** - A deeper dive into T-Ruby files
2. **[Editor Setup](/docs/getting-started/editor-setup)** - Get syntax highlighting and autocomplete
3. **[Basic Types](/docs/learn/basics/basic-types)** - Learn the type system

## Example: A More Complete Program

Here's a slightly more complex example to play with:

```trb title="user.trb"
# Define a type alias
type UserId = Integer

# A class with typed properties
class User
  @id: UserId
  @name: String
  @email: String
  @active: Bool

  def initialize(id: UserId, name: String, email: String): void
    @id = id
    @name = name
    @email = email
    @active = true
  end

  def greet: String
    "Hello, I'm #{@name}!"
  end

  def deactivate: void
    @active = false
  end

  def active?: Bool
    @active
  end
end

# A function that works with User
def find_user(id: UserId): User | nil
  # In a real app, this would query a database
  User.new(id, "Alice", "alice@example.com")
end

# Using the code
user = find_user(1)
if user
  puts user.greet
  puts "Active: #{user.active?}"
end
```

Compile and run:

```bash
trc user.trb
ruby build/user.rb
```

Output:
```
Hello, I'm Alice!
Active: true
```
