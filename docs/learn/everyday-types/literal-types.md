---
sidebar_position: 5
title: Literal Types
description: Using literal values as types
---

<DocsBadge />


# Literal Types

Literal types allow you to specify exact values as types, not just broad categories. Instead of saying a variable is a `String`, you can say it must be the specific string `"active"`. This chapter will teach you how to use literal types to create more precise type definitions.

## What Are Literal Types?

A literal type is a type that represents a single, specific value. Instead of accepting any string, it accepts only one particular string. Instead of any integer, only one particular integer.

```trb title="literal_basics.trb"
# Broad type - any string
status: String = "active"

# Literal type - only the string "active"
status: "active" = "active"

# This would be an error:
# status: "active" = "pending"  # Error: "pending" is not "active"
```

## String Literal Types

String literals are the most common literal types:

### Single String Literal

```trb title="single_literal.trb"
# Variable that can only be "production"
environment: "production" = "production"

# Method that returns exactly "success"
def get_status(): "success"
  "success"
end

result: "success" = get_status()
```

### Union of String Literals

More commonly, you'll use unions of string literals to represent a limited set of valid values:

```trb title="string_literal_union.trb"
# Can be one of three specific strings
def set_mode(mode: "development" | "staging" | "production")
  puts "Mode set to: #{mode}"
end

# These are valid
set_mode("development")
set_mode("staging")
set_mode("production")

# This would be an error:
# set_mode("testing")  # Error: "testing" not in union
```

### Practical String Literal Example

```trb title="status_system.trb"
# Status can only be one of these exact strings
type Status = "pending" | "active" | "suspended" | "cancelled"

class Account
  def initialize()
    @status: Status = "pending"
  end

  def set_status(new_status: Status)
    @status = new_status
  end

  def get_status(): Status
    @status
  end

  def is_active(): Boolean
    @status == "active"
  end

  def can_use(): Boolean
    @status == "active" || @status == "pending"
  end
end

account = Account.new()
account.set_status("active")  # Valid
# account.set_status("invalid")  # Would be a type error
```

## Symbol Literal Types

Symbols can also be used as literal types:

### Symbol Literal Union

```trb title="symbol_literals.trb"
# Can be one of these specific symbols
def handle_event(event: :click | :hover | :focus)
  case event
  when :click
    puts "Clicked!"
  when :hover
    puts "Hovering"
  when :focus
    puts "Focused"
  end
end

# Valid calls
handle_event(:click)
handle_event(:hover)

# This would be an error:
# handle_event(:blur)  # Error: :blur not in union
```

### Using Symbols for State Machines

```trb title="state_machine.trb"
type State = :idle | :loading | :success | :error

class DataLoader
  def initialize()
    @state: State = :idle
    @data: String | nil = nil
    @error: String | nil = nil
  end

  def get_state(): State
    @state
  end

  def start_loading()
    @state = :loading
    @data = nil
    @error = nil
  end

  def complete_success(data: String)
    @state = :success
    @data = data
    @error = nil
  end

  def complete_error(error: String)
    @state = :error
    @data = nil
    @error = error
  end

  def reset()
    @state = :idle
    @data = nil
    @error = nil
  end

  def can_load(): Boolean
    @state == :idle || @state == :error
  end
end

loader = DataLoader.new()
loader.start_loading()
loader.complete_success("data")
```

## Integer Literal Types

Integer literals represent specific numbers:

### Single Integer Literal

```trb title="integer_literal.trb"
# This can only be the number 200
http_ok: 200 = 200

# Method that always returns 0
def get_zero(): 0
  0
end
```

### Integer Literal Unions

```trb title="http_status.trb"
# HTTP status codes
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500

def handle_response(status: HttpStatus): String
  case status
  when 200
    "OK"
  when 201
    "Created"
  when 400
    "Bad Request"
  when 401
    "Unauthorized"
  when 403
    "Forbidden"
  when 404
    "Not Found"
  when 500
    "Server Error"
  else
    "Unknown"
  end
end

message: String = handle_response(200)  # "OK"
# handle_response(301)  # Would be a type error
```

## Boolean Literals

Boolean literals are simply `true` and `false`:

### True/False Literals

```trb title="boolean_literals.trb"
# Variable that can only be true
always_true: true = true

# Variable that can only be false
always_false: false = false

# Method that always returns true
def is_valid(): true
  true
end
```

### Boolean Literals vs Boolean Type

```trb title="bool_vs_literal.trb"
# Boolean type - can be true or false
flag: Boolean = true  # Can also be false

# true literal - can only be true
enabled: true = true  # Cannot be false

# false literal - can only be false
disabled: false = false  # Cannot be true

# Boolean is equivalent to (true | false)
value: true | false = true  # Same as Boolean
```

## Combining Literal Types

You can mix different kinds of literals in unions:

### Mixed Literal Types

```trb title="mixed_literals.trb"
# Mix of string and integer literals
type ExitCode = "success" | "error" | 0 | 1

def exit_program(code: ExitCode): String
  if code == "success" || code == 0
    "Exiting successfully"
  else
    "Exiting with error"
  end
end

# Mix of symbols and strings
type Identifier = :id | :name | "index" | "key"
```

### Literals with Broader Types

```trb title="literals_with_types.trb"
# Specific values OR any string
type ConfigValue = "auto" | "manual" | String

def set_config(value: ConfigValue)
  if value == "auto"
    puts "Auto mode"
  elsif value == "manual"
    puts "Manual mode"
  else
    puts "Custom value: #{value}"
  end
end

set_config("auto")  # "Auto mode"
set_config("manual")  # "Manual mode"
set_config("custom-value")  # "Custom value: custom-value"
```

## Practical Examples

### Example 1: Log Levels

```trb title="log_levels.trb"
type LogLevel = "debug" | "info" | "warn" | "error"

class Logger
  def initialize()
    @level: LogLevel = "info"
  end

  def set_level(level: LogLevel)
    @level = level
  end

  def log(level: LogLevel, message: String)
    return unless should_log?(level)

    prefix = case level
    when "debug"
      "[DEBUG]"
    when "info"
      "[INFO]"
    when "warn"
      "[WARN]"
    when "error"
      "[ERROR]"
    end

    puts "#{prefix} #{message}"
  end

  def debug(message: String)
    log("debug", message)
  end

  def info(message: String)
    log("info", message)
  end

  def warn(message: String)
    log("warn", message)
  end

  def error(message: String)
    log("error", message)
  end

  private

  def should_log?(level: LogLevel): Boolean
    level_priority = get_priority(level)
    current_priority = get_priority(@level)

    level_priority >= current_priority
  end

  def get_priority(level: LogLevel): Integer
    case level
    when "debug"
      0
    when "info"
      1
    when "warn"
      2
    when "error"
      3
    else
      0
    end
  end
end

logger = Logger.new()
logger.set_level("warn")
logger.debug("This won't show")  # Level too low
logger.error("This will show")   # Level high enough
```

### Example 2: Direction System

```trb title="directions.trb"
type Direction = "north" | "south" | "east" | "west"

class Position
  def initialize(x: Integer, y: Integer)
    @x: Integer = x
    @y: Integer = y
  end

  def move(direction: Direction): Position
    case direction
    when "north"
      Position.new(@x, @y + 1)
    when "south"
      Position.new(@x, @y - 1)
    when "east"
      Position.new(@x + 1, @y)
    when "west"
      Position.new(@x - 1, @y)
    end
  end

  def get_neighbor(direction: Direction): Hash<Symbol, Integer>
    new_pos = move(direction)
    { x: new_pos.x, y: new_pos.y }
  end

  def to_s(): String
    "(#{@x}, #{@y})"
  end

  attr_reader :x, :y
end

pos = Position.new(0, 0)
north = pos.move("north")  # (0, 1)
east = pos.move("east")    # (1, 0)
```

### Example 3: API Response Types

```trb title="api_response.trb"
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
type ResponseStatus = "success" | "error" | "loading"

class ApiClient
  def request(
    method: HttpMethod,
    path: String
  ): Hash<Symbol, String | Integer>
    # Simulate request
    status_code = case method
    when "GET"
      200
    when "POST"
      201
    when "PUT", "PATCH"
      200
    when "DELETE"
      204
    else
      400
    end

    {
      method: method,
      path: path,
      status: status_code
    }
  end

  def get(path: String)
    request("GET", path)
  end

  def post(path: String)
    request("POST", path)
  end

  def put(path: String)
    request("PUT", path)
  end

  def delete(path: String)
    request("DELETE", path)
  end
end

client = ApiClient.new()
response = client.get("/users")
```

### Example 4: Configuration with Literal Types

```trb title="config_literals.trb"
type Environment = "development" | "test" | "staging" | "production"
type LogFormat = "json" | "text" | "colored"
type CacheStrategy = "memory" | "redis" | "none"

class AppConfig
  def initialize()
    @environment: Environment = "development"
    @log_format: LogFormat = "colored"
    @cache_strategy: CacheStrategy = "memory"
    @debug: Boolean = false
  end

  def set_environment(env: Environment)
    @environment = env

    # Auto-configure based on environment
    case env
    when "development"
      @debug = true
      @log_format = "colored"
      @cache_strategy = "memory"
    when "test"
      @debug = true
      @log_format = "text"
      @cache_strategy = "none"
    when "staging"
      @debug = false
      @log_format = "json"
      @cache_strategy = "redis"
    when "production"
      @debug = false
      @log_format = "json"
      @cache_strategy = "redis"
    end
  end

  def set_log_format(format: LogFormat)
    @log_format = format
  end

  def set_cache_strategy(strategy: CacheStrategy)
    @cache_strategy = strategy
  end

  def get_config(): Hash<Symbol, String | Boolean>
    {
      environment: @environment,
      log_format: @log_format,
      cache_strategy: @cache_strategy,
      debug: @debug
    }
  end

  def is_production(): Boolean
    @environment == "production"
  end

  def is_development(): Boolean
    @environment == "development"
  end
end

config = AppConfig.new()
config.set_environment("production")
settings = config.get_config()
```

## Benefits of Literal Types

### 1. Compile-Time Safety

Literal types catch errors at transpile time instead of runtime:

```trb title="compile_safety.trb"
type Status = "active" | "inactive"

def set_status(status: Status)
  # Implementation
end

# This will fail at transpile time:
# set_status("unknown")  # Error!

# This is valid:
set_status("active")
```

### 2. Better Documentation

Literal types serve as inline documentation:

```trb title="documentation.trb"
# Clear what values are valid
def set_priority(priority: "low" | "medium" | "high")
  # ...
end

# Clearer than:
def set_priority(priority: String)
  # Which strings are valid? Need to check docs
end
```

### 3. Exhaustiveness Checking

Type checkers can ensure you handle all cases:

```trb title="exhaustiveness.trb"
type Color = "red" | "green" | "blue"

def describe_color(color: Color): String
  case color
  when "red"
    "The color red"
  when "green"
    "The color green"
  when "blue"
    "The color blue"
  # If we miss a case, type checker can warn us
  end
end
```

## Common Patterns

### Pattern 1: Command Types

```trb title="commands.trb"
type Command = "start" | "stop" | "restart" | "status"

def execute_command(cmd: Command): String
  case cmd
  when "start"
    "Starting service..."
  when "stop"
    "Stopping service..."
  when "restart"
    "Restarting service..."
  when "status"
    "Service is running"
  end
end
```

### Pattern 2: Result Types

```trb title="results.trb"
type Result = "ok" | "error"

def process(): Hash<Symbol, Result | String>
  success = true  # Simulate operation

  if success
    { status: "ok", message: "Success!" }
  else
    { status: "error", message: "Failed!" }
  end
end
```

### Pattern 3: Enum-like Types

```trb title="enums.trb"
type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
type Weekend = "saturday" | "sunday"
type Day = Weekday | Weekend

def is_weekend(day: Day): Boolean
  day == "saturday" || day == "sunday"
end

def is_weekday(day: Day): Boolean
  !is_weekend(day)
end
```

## Best Practices

### 1. Use Literals for Fixed Sets

```trb title="fixed_sets.trb"
# Good - clear, fixed set of values
type Size = "small" | "medium" | "large"

# Avoid - too open-ended
type Size = String
```

### 2. Combine with Type Aliases

```trb title="type_aliases.trb"
# Define once, use everywhere
type Status = "pending" | "approved" | "rejected"
type Priority = "low" | "medium" | "high"

class Task
  def initialize()
    @status: Status = "pending"
    @priority: Priority = "medium"
  end

  def set_status(status: Status)
    @status = status
  end

  def set_priority(priority: Priority)
    @priority = priority
  end
end
```

### 3. Keep Sets Manageable

```trb title="manageable_sets.trb"
# Good - reasonable number of options
type Theme = "light" | "dark" | "auto"

# Avoid - too many literals makes type unwieldy
# type Country = "USA" | "Canada" | "Mexico" | ... (200+ countries)
# Better to use String with validation
```

## Summary

Literal types in T-Ruby allow you to specify exact values as types:

- **String literals**: `"active" | "pending" | "cancelled"`
- **Symbol literals**: `:start | :stop | :restart`
- **Integer literals**: `200 | 404 | 500`
- **Boolean literals**: `true` and `false`

Benefits of literal types:

- **Type safety**: Catch invalid values at transpile time
- **Documentation**: Make valid values explicit
- **Exhaustiveness**: Ensure all cases are handled
- **Clarity**: Clear contracts for function parameters

Literal types are especially useful for representing state machines, configuration options, API responses, and any fixed set of valid values. They bring enum-like functionality to T-Ruby with the flexibility of union types.

You've now completed the Everyday Types section! You understand primitives, collections, unions, type narrowing, and literals - the core building blocks for writing type-safe T-Ruby code.
