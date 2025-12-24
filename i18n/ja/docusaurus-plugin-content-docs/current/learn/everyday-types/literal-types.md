---
sidebar_position: 5
title: リテラル型
description: リテラル値を型として使用する
---

<DocsBadge />


# リテラル型

リテラル型を使用すると、広いカテゴリーではなく、正確な値を型として指定できます。変数が`String`であると言う代わりに、特定の文字列`"active"`でなければならないと指定できます。この章では、リテラル型を使用してより精密な型定義を作成する方法を学びます。

## リテラル型とは？

リテラル型は、単一の特定の値を表す型です。任意の文字列を受け入れるのではなく、1つの特定の文字列のみを受け入れます。任意の整数ではなく、1つの特定の整数のみです。

```trb title="literal_basics.trb"
# 広い型 - 任意の文字列
status: String = "active"

# リテラル型 - 文字列"active"のみ
status: "active" = "active"

# これはエラーになります:
# status: "active" = "pending"  # エラー: "pending"は"active"ではありません
```

## 文字列リテラル型

文字列リテラルは最も一般的なリテラル型です：

### 単一の文字列リテラル

```trb title="single_literal.trb"
# "production"のみを取れる変数
environment: "production" = "production"

# 正確に"success"を返すメソッド
def get_status(): "success"
  "success"
end

result: "success" = get_status()
```

### 文字列リテラルのユニオン

より一般的には、有効な値の限定されたセットを表すために文字列リテラルのユニオンを使用します：

```trb title="string_literal_union.trb"
# 3つの特定の文字列のいずれか
def set_mode(mode: "development" | "staging" | "production")
  puts "Mode set to: #{mode}"
end

# これらは有効
set_mode("development")
set_mode("staging")
set_mode("production")

# これはエラーになります:
# set_mode("testing")  # エラー: "testing"はユニオンに含まれません
```

### 実践的な文字列リテラルの例

```trb title="status_system.trb"
# Statusはこれらの正確な文字列のいずれかのみ
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
account.set_status("active")  # 有効
# account.set_status("invalid")  # 型エラーになります
```

## シンボルリテラル型

シンボルもリテラル型として使用できます：

### シンボルリテラルのユニオン

```trb title="symbol_literals.trb"
# これらの特定のシンボルのいずれか
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

# 有効な呼び出し
handle_event(:click)
handle_event(:hover)

# これはエラーになります:
# handle_event(:blur)  # エラー: :blurはユニオンに含まれません
```

### ステートマシンでのシンボル使用

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

## 整数リテラル型

整数リテラルは特定の数値を表します：

### 単一の整数リテラル

```trb title="integer_literal.trb"
# これは数値200のみ
http_ok: 200 = 200

# 常に0を返すメソッド
def get_zero(): 0
  0
end
```

### 整数リテラルのユニオン

```trb title="http_status.trb"
# HTTPステータスコード
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
# handle_response(301)  # 型エラーになります
```

## ブーリアンリテラル

ブーリアンリテラルは単純に`true`と`false`です：

### True/Falseリテラル

```trb title="boolean_literals.trb"
# trueのみを取れる変数
always_true: true = true

# falseのみを取れる変数
always_false: false = false

# 常にtrueを返すメソッド
def is_valid(): true
  true
end
```

### ブーリアンリテラル vs Boolean型

```trb title="bool_vs_literal.trb"
# Boolean型 - trueまたはfalseになれる
flag: Boolean = true  # falseにもなれる

# trueリテラル - trueのみ
enabled: true = true  # falseにはなれない

# falseリテラル - falseのみ
disabled: false = false  # trueにはなれない

# Booleanは(true | false)と同等
value: true | false = true  # Booleanと同じ
```

## リテラル型の組み合わせ

異なる種類のリテラルをユニオンで混在させることができます：

### 混合リテラル型

```trb title="mixed_literals.trb"
# 文字列と整数リテラルの混合
type ExitCode = "success" | "error" | 0 | 1

def exit_program(code: ExitCode): String
  if code == "success" || code == 0
    "Exiting successfully"
  else
    "Exiting with error"
  end
end

# シンボルと文字列の混合
type Identifier = :id | :name | "index" | "key"
```

### リテラルと広い型の組み合わせ

```trb title="literals_with_types.trb"
# 特定の値または任意の文字列
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

## 実践的な例

### 例1: ログレベル

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
logger.debug("This won't show")  # レベルが低すぎる
logger.error("This will show")   # レベルが十分高い
```

### 例2: 方向システム

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

### 例3: APIレスポンス型

```trb title="api_response.trb"
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
type ResponseStatus = "success" | "error" | "loading"

class ApiClient
  def request(
    method: HttpMethod,
    path: String
  ): Hash<Symbol, String | Integer>
    # リクエストをシミュレート
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

### 例4: リテラル型を使った設定

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

    # 環境に基づいて自動設定
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

## リテラル型の利点

### 1. コンパイル時の安全性

リテラル型は実行時ではなくトランスパイル時にエラーを検出します：

```trb title="compile_safety.trb"
type Status = "active" | "inactive"

def set_status(status: Status)
  # 実装
end

# これはトランスパイル時に失敗します:
# set_status("unknown")  # エラー!

# これは有効:
set_status("active")
```

### 2. より良いドキュメント

リテラル型はインラインドキュメントとして機能します：

```trb title="documentation.trb"
# 有効な値が明確
def set_priority(priority: "low" | "medium" | "high")
  # ...
end

# 以下より明確:
def set_priority(priority: String)
  # どの文字列が有効？ドキュメントを確認する必要がある
end
```

### 3. 網羅性チェック

型チェッカーはすべてのケースを処理していることを確認できます：

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
  # ケースを見逃すと、型チェッカーが警告できます
  end
end
```

## 一般的なパターン

### パターン1: コマンド型

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

### パターン2: 結果型

```trb title="results.trb"
type Result = "ok" | "error"

def process(): Hash<Symbol, Result | String>
  success = true  # 操作をシミュレート

  if success
    { status: "ok", message: "Success!" }
  else
    { status: "error", message: "Failed!" }
  end
end
```

### パターン3: Enum風の型

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

## ベストプラクティス

### 1. 固定セットにはリテラルを使用

```trb title="fixed_sets.trb"
# 良い - 明確で固定された値のセット
type Size = "small" | "medium" | "large"

# 避ける - 制約が緩すぎる
type Size = String
```

### 2. 型エイリアスと組み合わせる

```trb title="type_aliases.trb"
# 一度定義して、どこでも使用
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

### 3. セットを管理可能な大きさに保つ

```trb title="manageable_sets.trb"
# 良い - 妥当な数のオプション
type Theme = "light" | "dark" | "auto"

# 避ける - リテラルが多すぎると型が扱いにくくなる
# type Country = "USA" | "Canada" | "Mexico" | ... (200以上の国)
# バリデーション付きのStringを使用する方が良い
```

## まとめ

T-Rubyのリテラル型を使用すると、正確な値を型として指定できます：

- **文字列リテラル**: `"active" | "pending" | "cancelled"`
- **シンボルリテラル**: `:start | :stop | :restart`
- **整数リテラル**: `200 | 404 | 500`
- **ブーリアンリテラル**: `true`と`false`

リテラル型の利点：

- **型安全性**: トランスパイル時に無効な値を検出
- **ドキュメント**: 有効な値を明示的にする
- **網羅性**: すべてのケースが処理されていることを確認
- **明確性**: 関数パラメータの明確なコントラクト

リテラル型は、ステートマシン、設定オプション、APIレスポンス、および有効な値の固定セットを表現するのに特に有用です。ユニオン型の柔軟性を備えたenum風の機能をT-Rubyにもたらします。

これでEveryday Typesセクションが完了しました！プリミティブ、コレクション、ユニオン、型の絞り込み、リテラル - 型安全なT-Rubyコードを書くための基本的な構成要素を理解しました。
