---
sidebar_position: 3
title: Ruby LSPの使用
description: Ruby LSPを使ったIDE機能
---

<DocsBadge />


# Ruby LSPの使用

Ruby LSPはRubyコードにオートコンプリート、定義へ移動、インライン診断などのIDE機能を提供します。T-Rubyと組み合わせると、`.rbs`ファイルの型情報に基づいた豊富なIDEサポートを受けられます。

## Ruby LSPとは？

Ruby LSPはRuby用のLanguage Server Protocol実装で、以下を提供します：

- **オートコンプリート** - インテリジェントなコード補完
- **定義へ移動** - メソッド/クラス定義へのナビゲーション
- **ホバー情報** - 型シグネチャとドキュメントの表示
- **診断** - インライン型エラーと警告
- **コードアクション** - クイックフィックスとリファクタリング
- **ドキュメントシンボル** - ファイル構造のアウトライン表示

## インストール

### VS Code

公式Ruby LSP拡張機能をインストール：

1. VS Codeを開く
2. Extensions（Ctrl+Shift+X）に移動
3. "Ruby LSP"を検索
4. Shopifyの拡張機能をインストール

またはコマンドラインで：

```bash
code --install-extension Shopify.ruby-lsp
```

### 他のエディタ

Ruby LSPはLSPをサポートするすべてのエディタで動作します：

- **Neovim**：`nvim-lspconfig`を使用
- **Emacs**：`lsp-mode`または`eglot`を使用
- **Sublime Text**：`LSP`パッケージを使用
- **IntelliJ**：組み込みRubyサポート

## T-Ruby用の基本セットアップ

### ステップ1：Ruby LSP Gemのインストール

```bash
gem install ruby-lsp
```

またはGemfileに追加：

```ruby
group :development do
  gem "ruby-lsp"
  gem "t-ruby"
end
```

### ステップ2：T-Rubyコードのコンパイル

型情報用のRBSファイルを生成：

```bash
trc compile src/
```

これで生成されます：
```
build/          # コンパイル済みRubyファイル
sig/            # RBS型シグネチャ
```

### ステップ3：Ruby LSPの設定

`.vscode/settings.json`を作成：

```json
{
  "rubyLsp.enabledFeatures": {
    "diagnostics": true,
    "formatting": true,
    "documentSymbols": true,
    "hover": true,
    "completion": true,
    "codeActions": true
  },
  "rubyLsp.indexing": {
    "includedPatterns": ["**/*.rb", "**/*.trb"],
    "excludedPatterns": ["**/test/**", "**/vendor/**"]
  }
}
```

### ステップ4：RBSパスの設定

Ruby LSPにRBSシグネチャの場所を伝える：

```json
{
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  }
}
```

## T-Ruby専用設定

### .trbファイルの操作

VS Codeが`.trb`ファイルをRubyとして扱うように設定：

```json title=".vscode/settings.json"
{
  "files.associations": {
    "*.trb": "ruby"
  },
  "rubyLsp.indexing": {
    "includedPatterns": ["**/*.rb", "**/*.trb"]
  }
}
```

### 構文ハイライト

より良いT-Ruby構文ハイライトのために、TextMate文法を作成するかカスタムルールでRubyハイライトを使用：

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "storage.type.ruby",
        "settings": {
          "foreground": "#569CD6"
        }
      }
    ]
  }
}
```

### ワークスペース設定

プロジェクト固有の設定：

```json title=".vscode/settings.json"
{
  // Ruby LSP
  "rubyLsp.enabled": true,
  "rubyLsp.rubyVersionManager": "auto",

  // T-Ruby統合
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  },

  // ファイル関連付け
  "files.associations": {
    "*.trb": "ruby"
  },

  // フォーマット
  "editor.formatOnSave": true,
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp"
  },

  // 診断
  "rubyLsp.enabledFeatures": {
    "diagnostics": true,
    "hover": true,
    "completion": true
  }
}
```

## T-RubyでのIDE機能

### オートコンプリート

Ruby LSPはRBS型を使用してインテリジェントなオートコンプリートを提供：

```trb title="user.trb"
class User
  @name: String
  @email: String

  def initialize(name: String, email: String): void
    @name = name
    @email = email
  end

  def greet: String
    "Hello, #{@name}!"
  end
end

user = User.new("Alice", "alice@example.com")
user.   # <- オートコンプリートが表示：greet, name, email
```

コンパイル後、Ruby LSPは`sig/user.rbs`を読み取り、以下を提供：
- メソッド候補
- パラメータ型
- 戻り値型

### 定義へ移動

使用箇所から定義へナビゲート：

```ruby
user = User.new("Alice", "alice@example.com")
#      ^^^^ Cmd+クリックでUserクラス定義へ移動

result = user.greet
#            ^^^^^ Cmd+クリックでgreetメソッドへ移動
```

### ホバー情報

シンボル上にマウスを置くと型情報を表示：

```rbs
def process_user(user: User): String
  # 'user'にホバーすると：User
  # メソッドにホバーすると：(User) -> String
  user.greet
end
```

### インライン診断

コーディング中に型エラーをインラインで確認：

```trb
def greet(name: String): String
  name.upcase
end

# インラインでエラー表示：
greet(123)  # Expected String, got Integer
      ^^^
```

### コードアクション

クイックフィックスとリファクタリング：

```trb
class User
  def initialize(name: String): void
    @name = name
  end
  # 💡 コードアクション：「@nameに型アノテーションを追加」
end
```

### ドキュメントシンボル

アウトラインビューに構造を表示：

```
User (class)
  ├─ @name: String
  ├─ @email: String
  ├─ initialize(name, email)
  ├─ greet()
  └─ update_email(email)
```

## Steepとの統合

強化された型チェックのために、Ruby LSPをSteepと一緒に使用：

### Steepのインストール

```bash
gem install steep
```

### Steepfileの設定

```ruby
target :app do
  check "build"
  signature "sig"
end
```

### Steepを使用するようにRuby LSPを設定

```json title=".vscode/settings.json"
{
  "rubyLsp.typechecker": "steep",
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  }
}
```

これでRuby LSPが型チェックにSteepを使用し、以下を提供：
- リアルタイム型エラー
- より洗練された型推論
- より良いオートコンプリート

## Ruby LSPワークフロー

### 開発ワークフロー

1. VS Codeで**T-Rubyファイルを編集**
2. **ファイルを保存** - T-Rubyウォッチが自動コンパイル
3. **更新を確認** - Ruby LSPが診断を更新
4. **オートコンプリートを使用** - 更新されたRBSに基づく

### ウォッチモードのセットアップ

保存時に自動コンパイルするためにT-Rubyウォッチを使用：

```bash
trc watch src/ --exec "echo 'Compiled'"
```

VS Codeが起動時にこれを実行するように設定：

```json title=".vscode/tasks.json"
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "T-Ruby Watch",
      "type": "shell",
      "command": "trc watch src/ --clear",
      "isBackground": true,
      "problemMatcher": [],
      "presentation": {
        "reveal": "never",
        "panel": "dedicated"
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    }
  ]
}
```

## 高度な設定

### カスタムRBSパス

複数のRBSディレクトリがある場合：

```json
{
  "rubyLsp.rbs": {
    "enabled": true,
    "paths": [
      "sig/generated",
      "sig/manual",
      "vendor/rbs"
    ]
  }
}
```

### フォーマッタ設定

T-Rubyファイル用のフォーマット設定：

```json
{
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.insertSpaces": true
  }
}
```

### 診断設定

診断表示をカスタマイズ：

```json
{
  "rubyLsp.diagnostics": {
    "severity": {
      "type_error": "error",
      "warning": "warning",
      "hint": "information"
    }
  },
  "problems.decorations.enabled": true
}
```

### パフォーマンス設定

大規模プロジェクトでパフォーマンスを最適化：

```json
{
  "rubyLsp.indexing": {
    "includedPatterns": ["src/**/*.trb", "src/**/*.rb"],
    "excludedPatterns": [
      "**/test/**",
      "**/spec/**",
      "**/vendor/**",
      "**/node_modules/**",
      "**/tmp/**"
    ]
  },
  "rubyLsp.experimental": {
    "parallelIndexing": true
  }
}
```

## 他のエディタ設定

### Neovim

`nvim-lspconfig`を使用：

```lua
-- init.lua
local lspconfig = require('lspconfig')

lspconfig.ruby_lsp.setup({
  cmd = { "bundle", "exec", "ruby-lsp" },
  filetypes = { "ruby", "trb" },
  init_options = {
    enabledFeatures = {
      "diagnostics",
      "formatting",
      "documentSymbols",
      "hover",
      "completion",
      "codeActions"
    },
    rbs = {
      enabled = true,
      path = "sig"
    }
  }
})

-- .trbをRubyとして扱う
vim.filetype.add({
  extension = {
    trb = "ruby"
  }
})
```

### Emacs

`lsp-mode`を使用：

```elisp
;; init.el
(use-package lsp-mode
  :hook ((ruby-mode . lsp))
  :config
  (setq lsp-ruby-lsp-rbs-enabled t)
  (setq lsp-ruby-lsp-rbs-path "sig")
  (add-to-list 'auto-mode-alist '("\\.trb\\'" . ruby-mode)))
```

### Sublime Text

```json title="Ruby LSP.sublime-settings"
{
  "clients": {
    "ruby-lsp": {
      "enabled": true,
      "command": ["bundle", "exec", "ruby-lsp"],
      "selector": "source.ruby",
      "initializationOptions": {
        "enabledFeatures": {
          "diagnostics": true,
          "hover": true,
          "completion": true
        },
        "rbs": {
          "enabled": true,
          "path": "sig"
        }
      }
    }
  }
}
```

## トラブルシューティング

### Ruby LSPが動作しない

**問題**：オートコンプリートや診断がない。

**解決**：

1. Ruby LSPが実行中か確認：
   ```bash
   ps aux | grep ruby-lsp
   ```

2. VS CodeでRuby LSPを再起動：
   - Cmd+Shift+P → "Ruby LSP: Restart"

3. 出力パネルを確認：
   - View → Output → "Ruby LSP"を選択

### RBSファイルが見つからない

**問題**：Ruby LSPが型情報を見つけられない。

**解決**：

1. RBSファイルが存在するか確認：
   ```bash
   ls sig/
   ```

2. 設定でRBSパスを確認：
   ```json
   {
     "rubyLsp.rbs": {
       "enabled": true,
       "path": "sig"
     }
   }
   ```

3. VS Codeウィンドウをリロード：
   - Cmd+Shift+P → "Developer: Reload Window"

### 古い診断

**問題**：コンパイル後に診断が更新されない。

**解決**：

1. T-Rubyウォッチが実行中か確認：
   ```bash
   trc watch src/
   ```

2. 手動でRuby LSPを更新：
   - ファイルを保存（Cmd+S）
   - またはRuby LSPを再起動

### パフォーマンス問題

**問題**：Ruby LSPでエディタが遅い。

**解決**：

1. 不要なディレクトリを除外：
   ```json
   {
     "rubyLsp.indexing": {
       "excludedPatterns": [
         "**/vendor/**",
         "**/node_modules/**",
         "**/tmp/**"
       ]
     }
   }
   ```

2. 使用しない機能を無効化：
   ```json
   {
     "rubyLsp.enabledFeatures": {
       "diagnostics": true,
       "hover": true,
       "completion": true,
       "formatting": false,
       "codeActions": false
     }
   }
   ```

### 型情報がない

**問題**：ホバー時に型情報が表示されない。

**解決**：

1. RBSが生成されたか確認：
   ```bash
   cat sig/user.rbs
   ```

2. ホバーが有効か確認：
   ```json
   {
     "rubyLsp.enabledFeatures": {
       "hover": true
     }
   }
   ```

3. RBSが有効か確認：
   ```bash
   rbs validate sig/
   ```

## ベストプラクティス

### 1. Ruby LSPを実行し続ける

VS Codeワークスペースと一緒にRuby LSPを自動起動。

### 2. ウォッチモードを使用

開発中は常にT-Rubyウォッチを実行：

```bash
trc watch src/ --clear
```

### 3. RBSファイルをコミット

チームメンバーのためにRBSファイルをバージョン管理に保持：

```bash
git add sig/
git commit -m "Update RBS signatures"
```

### 4. パフォーマンスのための設定

大規模プロジェクトで不要なディレクトリを除外：

```json
{
  "rubyLsp.indexing": {
    "excludedPatterns": ["**/vendor/**", "**/tmp/**"]
  }
}
```

### 5. Steep統合を使用

最高の型チェックのためにSteepを有効化：

```json
{
  "rubyLsp.typechecker": "steep"
}
```

## 完全なVS Codeセットアップ

T-Ruby開発用の完全なVS Code設定：

```json title=".vscode/settings.json"
{
  // Ruby LSP設定
  "rubyLsp.enabled": true,
  "rubyLsp.rubyVersionManager": "auto",
  "rubyLsp.typechecker": "steep",

  // RBS統合
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  },

  // 機能
  "rubyLsp.enabledFeatures": {
    "diagnostics": true,
    "formatting": true,
    "documentSymbols": true,
    "hover": true,
    "completion": true,
    "codeActions": true,
    "inlayHints": true
  },

  // インデックス
  "rubyLsp.indexing": {
    "includedPatterns": ["src/**/*.rb", "src/**/*.trb"],
    "excludedPatterns": [
      "**/test/**",
      "**/spec/**",
      "**/vendor/**",
      "**/tmp/**"
    ]
  },

  // ファイル関連付け
  "files.associations": {
    "*.trb": "ruby"
  },

  // フォーマット
  "editor.formatOnSave": true,
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.tabSize": 2,
    "editor.insertSpaces": true
  },

  // エディタの外観
  "editor.inlayHints.enabled": "on",
  "problems.decorations.enabled": true,

  // ターミナル
  "terminal.integrated.env.osx": {
    "RUBYOPT": "-W0"
  }
}
```

```json title=".vscode/tasks.json"
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "T-Ruby Watch",
      "type": "shell",
      "command": "trc watch src/ --clear",
      "isBackground": true,
      "problemMatcher": [],
      "presentation": {
        "reveal": "never",
        "panel": "dedicated"
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    },
    {
      "label": "Steep Watch",
      "type": "shell",
      "command": "steep watch --code=build --signature=sig",
      "isBackground": true,
      "problemMatcher": [],
      "presentation": {
        "reveal": "never",
        "panel": "dedicated"
      }
    }
  ]
}
```

```json title=".vscode/extensions.json"
{
  "recommendations": [
    "shopify.ruby-lsp",
    "rebornix.ruby",
    "castwide.solargraph"
  ]
}
```

## キーボードショートカット

Ruby LSP使用時に便利なVS Codeショートカット：

| 操作 | ショートカット（Mac） | ショートカット（Windows/Linux） |
|--------|----------------|------------------------|
| 定義へ移動 | Cmd+クリック | Ctrl+クリック |
| 定義へ移動 | F12 | F12 |
| 定義をプレビュー | Alt+F12 | Alt+F12 |
| 参照を検索 | Shift+F12 | Shift+F12 |
| シンボルの名前変更 | F2 | F2 |
| ドキュメントをフォーマット | Shift+Alt+F | Shift+Alt+F |
| ホバーを表示 | Cmd+K Cmd+I | Ctrl+K Ctrl+I |
| 候補をトリガー | Ctrl+Space | Ctrl+Space |
| クイックフィックス | Cmd+. | Ctrl+. |
| LSPを再起動 | Cmd+Shift+P → "Ruby LSP: Restart" | Ctrl+Shift+P → "Ruby LSP: Restart" |

## 次のステップ

- [Steepの使用](/docs/tooling/steep) - 強化された型チェック
- [RBS統合](/docs/tooling/rbs-integration) - RBSファイルについて学ぶ
- [Ruby LSPドキュメント](https://shopify.github.io/ruby-lsp/) - 公式ドキュメント
