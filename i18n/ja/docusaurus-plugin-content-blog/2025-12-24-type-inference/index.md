---
slug: typescript-style-type-inference
title: "T-RubyのためのTypeScriptスタイル型推論の構築"
authors: [yhk1038]
tags: [technical, type-inference, compiler]
---

明示的な型宣言なしで自動的に型を検出する、TypeScriptに触発された静的型推論をT-Rubyに実装した話です。

<!-- truncate -->

## 問題点

T-Rubyコードを書く際、開発者はすべての戻り値の型を明示的に宣言する必要がありました：

```ruby
def greet(name: String): String
  "Hello, #{name}!"
end
```

`: String`の戻り値型がないと、生成されるRBSは`untyped`と表示されます：

```rbs
def greet: (name: String) -> untyped
```

これは不便でした。戻り値の型は明らかに`String`なのに - なぜT-Rubyが自動で判断できないのでしょうか？

## インスピレーション：TypeScriptのアプローチ

TypeScriptはこれをエレガントに処理します：

```typescript
function greet(name: string) {
  return `Hello, ${name}!`;
}
```

TypeScriptは戻り値の型を`string`と推論します。私たちもT-Rubyで同じ体験を望んでいました。

### TypeScriptの動作方法

TypeScriptの型推論は2つの主要コンポーネントで構成されています：

1. **Binder**：パース中に制御フローグラフ（CFG）を構築
2. **Checker**：必要なときに遅延評価で型を計算、フロー分析を使用

魔法は`getFlowTypeOfReference`で起こります - フローノードを逆方向にたどりながら、コードのどの地点でもシンボルの型を決定する1200行以上の関数です。

### 私たちの簡略化されたアプローチ

Rubyの制御フローはJavaScriptより単純です。TypeScriptのフローグラフの完全な複雑さは必要ありません。代わりに以下を実装しました：

- **線形データフロー分析** - Rubyの直感的な実行モデル
- **関心の分離** - IR Builder（Binderの役割）+ ASTTypeInferrer（Checkerの役割）
- **遅延評価** - RBS生成時にのみ型を計算

## アーキテクチャ

```
[Binderステージ - IR Builder]
ソース (.trb) → Parser → IRツリー（メソッド本体を含む）

[Checkerステージ - Type Inferrer]
IRノード走査 → 型決定 → キャッシング

[出力ステージ]
推論された型 → RBS生成
```

### 主要コンポーネント

#### 1. BodyParser - メソッド本体のパース

最初の課題は、パーサーがメソッド本体を分析していなかったことです - シグネチャのみを抽出していました。T-Rubyメソッド本体をIRノードに変換する`BodyParser`を構築しました：

```ruby
class BodyParser
  def parse(lines, start_line, end_line)
    statements = []
    # 各行をIRノードにパース
    # 処理：リテラル、変数、演算子、メソッド呼び出し、条件文
    IR::Block.new(statements: statements)
  end
end
```

サポートする構文：
- リテラル：`"hello"`、`42`、`true`、`:symbol`
- 変数：`name`、`@instance_var`、`@@class_var`
- 演算子：`a + b`、`x == y`、`!flag`
- メソッド呼び出し：`str.upcase`、`array.map { |x| x * 2 }`
- 条件文：`if`/`unless`/`elsif`/`else`

#### 2. TypeEnv - スコープチェーン管理

```ruby
class TypeEnv
  def initialize(parent = nil)
    @parent = parent
    @bindings = {}       # ローカル変数
    @instance_vars = {}  # インスタンス変数
  end

  def lookup(name)
    @bindings[name] || @instance_vars[name] || @parent&.lookup(name)
  end

  def child_scope
    TypeEnv.new(self)
  end
end
```

これにより適切なスコーピングが可能になります - メソッドのローカル変数は他のメソッドに漏れませんが、インスタンス変数はクラス全体で共有されます。

#### 3. ASTTypeInferrer - 型推論エンジン

システムの心臓部です：

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
    # まずキャッシュを確認（遅延評価）
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
    # ... その他のケース
    end

    @type_cache[node.object_id] = type
  end
end
```

### Rubyの暗黙的な戻り値の処理

Rubyの最後の式は暗黙的な戻り値です。これは型推論にとって非常に重要です：

```ruby
def status
  if active?
    "running"
  else
    "stopped"
  end
end
# 暗黙的な戻り値：String（両方の分岐から）
```

私たちはこれを以下のように処理します：
1. すべての明示的な`return`型を収集
2. 最後の式を見つける（暗黙的な戻り値）
3. すべての戻り値型を統合

```ruby
def infer_method_return_type(method_node, env)
  # 明示的なreturnを収集
  return_types, terminated = collect_return_types(method_node.body, env)

  # 暗黙的な戻り値を追加（メソッドが常に明示的に戻らない場合）
  unless terminated
    implicit_return = infer_implicit_return(method_node.body, env)
    return_types << implicit_return if implicit_return
  end

  unify_types(return_types)
end
```

### 特殊ケース：`initialize`メソッド

Rubyの`initialize`はコンストラクタです。戻り値は無視されます - `Class.new`がインスタンスを返します。RBSの慣例に従い、常に`void`と推論します：

```ruby
class User
  def initialize(name: String)
    @name = name
  end
end
```

生成されるRBS：

```rbs
class User
  def initialize: (name: String) -> void
end
```

### 組み込みメソッドの型知識

一般的なRubyメソッドの戻り値型テーブルを維持しています：

```ruby
BUILTIN_METHOD_TYPES = {
  %w[String upcase] => "String",
  %w[String downcase] => "String",
  %w[String length] => "Integer",
  %w[String to_i] => "Integer",
  %w[Array first] => "untyped",  # 要素型
  %w[Array length] => "Integer",
  %w[Integer to_s] => "String",
  # ... 200以上のメソッド
}.freeze
```

## 結果

今ではこのT-Rubyコード：

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

正しいRBSを自動的に生成します：

```rbs
class Greeter
  @name: String

  def initialize: (name: String) -> void
  def greet: () -> String
  def shout: () -> String
end
```

明示的な戻り値型は不要です！

## テスト

包括的なテストを構築しました：

- **ユニットテスト**：リテラル推論、演算子型、メソッド呼び出し型
- **E2Eテスト**：RBS検証を含む完全なコンパイル

```ruby
it "文字列リテラルからStringを推論する" do
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

## 課題と解決策

| 課題 | 解決策 |
|------|--------|
| メソッド本体のパースがない | T-Ruby構文用のカスタムBodyParserを構築 |
| 暗黙的な戻り値 | ブロックの最後の式を分析 |
| 再帰メソッド | 2パス分析（シグネチャを先に、次に本体） |
| 複雑な式 | 段階的に拡張：リテラル → 変数 → 演算子 → メソッド呼び出し |
| ユニオン型 | すべての戻りパスを収集して統合 |

## 今後の計画

- **ジェネリック推論**：`[1, 2, 3]` → `Array[Integer]`
- **ブロック/ラムダ型**：ブロックパラメータと戻り値型を推論
- **型の絞り込み**：`if x.is_a?(String)`の後でよりスマートな型
- **クロスメソッド推論**：他のメソッドから推論された型を使用

## 結論

TypeScriptのアプローチを研究し、Rubyのよりシンプルなセマンティクスに適応させることで、実用的な型推論システムを構築しました。主要な洞察：

1. **メソッド本体をパース** - コードを見なければ型は推論できない
2. **キャッシングによる遅延評価** - 必要になるまで計算しない
3. **Rubyイディオムを処理** - 暗黙的な戻り値、`initialize`など
4. **シンプルに始める** - まずリテラル、次に複雑さを増す

型推論によりT-Rubyはより自然になります。Rubyコードを書いて、型安全性を得ましょう - アノテーション不要で。

---

*型推論システムはT-Rubyで利用可能です。試してみて、ご意見をお聞かせください！*
