---
slug: typescript-style-type-inference
title: "Building TypeScript-Style Type Inference for T-Ruby"
authors: [yhk1038]
tags: [technical, type-inference, compiler]
---

How we implemented TypeScript-inspired static type inference for T-Ruby, enabling automatic type detection without explicit annotations.

<!-- truncate -->

## The Problem

When writing T-Ruby code, developers had to explicitly annotate every return type:

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

Without the `: String` return type, the generated RBS would show `untyped`:

```rbs
def greet: (name: String) -> untyped
```

This was frustrating. The return type is obviously `String` - why can't T-Ruby figure it out?

## Inspiration: TypeScript's Approach

TypeScript handles this elegantly. You can write:

```typescript
function greet(name: string) {
  return `Hello, ${name}!`;
}
```

And TypeScript infers the return type as `string`. We wanted the same experience for T-Ruby.

### How TypeScript Does It

TypeScript's type inference is built on two key components:

1. **Binder**: Builds a Control Flow Graph (CFG) during parsing
2. **Checker**: Lazily evaluates types when needed, using flow analysis

The magic happens in `getFlowTypeOfReference` - a 1200+ line function that determines a symbol's type at any point in the code by walking backwards through flow nodes.

### Our Simplified Approach

Ruby's control flow is simpler than JavaScript's. We don't need the full complexity of TypeScript's flow graph. Instead, we implemented:

- **Linear data flow analysis** - Ruby's straightforward execution model
- **Separation of concerns** - IR Builder (Binder role) + ASTTypeInferrer (Checker role)
- **Lazy evaluation** - Types computed only when generating RBS

## Architecture

```
[Binder Stage - IR Builder]
Source (.trb) → Parser → IR Tree (with method bodies)

[Checker Stage - Type Inferrer]
IR Node traversal → Type determination → Caching

[Output Stage]
Inferred types → RBS generation
```

### The Core Components

#### 1. BodyParser - Parsing Method Bodies

The first challenge was that our parser didn't analyze method bodies - it only extracted signatures. We built `BodyParser` to convert T-Ruby method bodies into IR nodes:

```ruby
class BodyParser
  def parse(lines, start_line, end_line)
    statements = []
    # Parse each line into IR nodes
    # Handle: literals, variables, operators, method calls, conditionals
    IR::Block.new(statements: statements)
  end
end
```

Supported constructs:
- Literals: `"hello"`, `42`, `true`, `:symbol`
- Variables: `name`, `@instance_var`, `@@class_var`
- Operators: `a + b`, `x == y`, `!flag`
- Method calls: `str.upcase`, `array.map { |x| x * 2 }`
- Conditionals: `if`/`unless`/`elsif`/`else`

#### 2. TypeEnv - Scope Chain Management

```ruby
class TypeEnv
  def initialize(parent = nil)
    @parent = parent
    @bindings = {}       # Local variables
    @instance_vars = {}  # Instance variables
  end

  def lookup(name)
    @bindings[name] || @instance_vars[name] || @parent&.lookup(name)
  end

  def child_scope
    TypeEnv.new(self)
  end
end
```

This enables proper scoping - a method's local variables don't leak into other methods, but instance variables are shared across the class.

#### 3. ASTTypeInferrer - The Type Inference Engine

The heart of the system:

```ruby
class ASTTypeInferrer
  LITERAL_TYPE_MAP = {
    string: "String",
    integer: "Integer",
    float: "Float",
    boolean: "bool",
    symbol: "Symbol",
    nil: "nil"
  }.freeze

  def infer_expression(node, env)
    # Check cache first (lazy evaluation)
    return @type_cache[node.object_id] if @type_cache[node.object_id]

    type = case node
    when IR::Literal
      LITERAL_TYPE_MAP[node.literal_type]
    when IR::VariableRef
      env.lookup(node.name)
    when IR::BinaryOp
      infer_binary_op(node, env)
    when IR::MethodCall
      infer_method_call(node, env)
    # ... more cases
    end

    @type_cache[node.object_id] = type
  end
end
```

### Handling Ruby's Implicit Returns

Ruby's last expression is the implicit return value. This is crucial for type inference:

```ruby
def status
  if active?
    "running"
  else
    "stopped"
  end
end
# Implicit return: String (from both branches)
```

We handle this by:
1. Collecting all explicit `return` types
2. Finding the last expression (implicit return)
3. Unifying all return types

```ruby
def infer_method_return_type(method_node, env)
  # Collect explicit returns
  return_types, terminated = collect_return_types(method_node.body, env)

  # Add implicit return (unless method always returns explicitly)
  unless terminated
    implicit_return = infer_implicit_return(method_node.body, env)
    return_types << implicit_return if implicit_return
  end

  unify_types(return_types)
end
```

### Special Case: `initialize` Method

Ruby's `initialize` is a constructor. Its return value is ignored - `Class.new` returns the instance. Following RBS conventions, we always infer `void`:

```ruby
class User
  def initialize(name: String)
    @name = name
  end
end
```

Generates:

```rbs
class User
  def initialize: (name: String) -> void
end
```

### Built-in Method Type Knowledge

We maintain a table of common Ruby method return types:

```ruby
BUILTIN_METHOD_TYPES = {
  %w[String upcase] => "String",
  %w[String downcase] => "String",
  %w[String length] => "Integer",
  %w[String to_i] => "Integer",
  %w[Array first] => "untyped",  # Element type
  %w[Array length] => "Integer",
  %w[Integer to_s] => "String",
  # ... 200+ methods
}.freeze
```

## Results

Now this T-Ruby code:

```ruby
class Greeter
  def initialize(name: String)
    @name = name
  end

  def greet
    "Hello, #{@name}!"
  end

  def shout
    @name.upcase
  end
end
```

Automatically generates correct RBS:

```rbs
class Greeter
  @name: String

  def initialize: (name: String) -> void
  def greet: () -> String
  def shout: () -> String
end
```

No explicit return types needed!

## Testing

We built comprehensive tests:

- **Unit tests**: Literal inference, operator types, method call types
- **E2E tests**: Full compilation with RBS validation

```ruby
it "infers String from string literal" do
  create_trb_file("src/test.trb", <<~TRB)
    class Test
      def message
        "hello world"
      end
    end
  TRB

  rbs_content = compile_and_get_rbs("src/test.trb")
  expect(rbs_content).to include("def message: () -> String")
end
```

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Method bodies not parsed | Built custom BodyParser for T-Ruby syntax |
| Implicit returns | Analyze last expression in blocks |
| Recursive methods | 2-pass analysis (signatures first, then bodies) |
| Complex expressions | Gradual expansion: literals → variables → operators → method calls |
| Union types | Collect all return paths and unify |

## Future Work

- **Generic inference**: `[1, 2, 3]` → `Array[Integer]`
- **Block/lambda types**: Infer block parameter and return types
- **Type narrowing**: Smarter types after `if x.is_a?(String)`
- **Cross-method inference**: Use inferred types from other methods

## Conclusion

By studying TypeScript's approach and adapting it for Ruby's simpler semantics, we built a practical type inference system. The key insights:

1. **Parse method bodies** - You can't infer types without seeing the code
2. **Lazy evaluation with caching** - Don't compute until needed
3. **Handle Ruby idioms** - Implicit returns, `initialize`, etc.
4. **Start simple** - Literals first, then build up complexity

Type inference makes T-Ruby feel more natural. Write Ruby code, get type safety - no annotations required.

---

*The type inference system is available in T-Ruby. Try it out and let us know what you think!*
