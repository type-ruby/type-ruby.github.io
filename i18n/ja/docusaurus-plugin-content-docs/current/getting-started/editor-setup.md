---
sidebar_position: 4
title: エディタ設定
description: VS Code、Neovim、その他のエディタでT-Rubyを設定
---

# エディタ設定

シンタックスハイライト、型チェック、オートコンプリートを備えたエディタを設定して、最高のT-Ruby開発体験を得ましょう。

## VS Code

VS Codeは最も完全なT-Ruby開発体験を提供します。

### 拡張機能のインストール

1. VS Codeを開く
2. 拡張機能に移動（`Cmd+Shift+X` / `Ctrl+Shift+X`）
3. "T-Ruby"を検索
4. **インストール**をクリック

またはコマンドラインからインストール：

```bash
code --install-extension type-ruby.t-ruby-vscode
```

### 機能

VS Code拡張機能が提供するもの：

- `.trb`ファイルの**シンタックスハイライト**
- 入力中の**型エラーハイライト**
- 型情報付き**オートコンプリート**
- 型を表示する**ホバー情報**
- 関数とクラスの**定義へジャンプ**
- **保存時フォーマット**（オプション）

### 設定

VS Code設定（`settings.json`）に追加：

```json title=".vscode/settings.json"
{
  // 入力中の型チェックを有効化
  "t-ruby.typeCheck.enabled": true,

  // インライン型ヒントを表示
  "t-ruby.inlayHints.enabled": true,

  // 保存時に.trbファイルをフォーマット
  "t-ruby.format.onSave": true,

  // trcコンパイラのパス（PATHにない場合）
  "t-ruby.compilerPath": "/usr/local/bin/trc",

  // 保存時にコンパイル
  "t-ruby.compile.onSave": true,

  // 出力ディレクトリ
  "t-ruby.compile.outputDir": "build"
}
```

### 推奨拡張機能

最高のRuby/T-Ruby体験のために、以下もインストール：

- **Ruby LSP** - 一般的なRuby言語サポート
- **Ruby Solargraph** - 追加のRubyインテリジェンス
- **Error Lens** - インラインエラー表示

## Neovim

T-Rubyは組み込みLSPクライアントを通じてNeovimをサポートします。

### nvim-lspconfigの使用

Neovim設定に追加：

```lua title="init.lua"
-- t-ruby-lspがなければインストール
-- gem install t-ruby-lsp

require('lspconfig').t_ruby_lsp.setup {
  cmd = { "t-ruby-lsp" },
  filetypes = { "truby" },
  root_dir = require('lspconfig').util.root_pattern("trc.yaml", ".git"),
  settings = {
    truby = {
      typeCheck = {
        enabled = true
      }
    }
  }
}
```

### Tree-sitterでシンタックスハイライト

シンタックスハイライトのために、T-Ruby tree-sitterパーサーを追加：

```lua title="init.lua"
require('nvim-treesitter.configs').setup {
  ensure_installed = { "ruby", "truby" },
  highlight = {
    enable = true,
  },
}
```

### ファイルタイプ検出

`.trb`ファイルのファイルタイプ検出を追加：

```lua title="init.lua"
vim.filetype.add({
  extension = {
    trb = "truby",
  },
})
```

### 推奨プラグイン

- **nvim-lspconfig** - LSP設定
- **nvim-treesitter** - シンタックスハイライト
- **nvim-cmp** - オートコンプリート
- **lspsaga.nvim** - 拡張LSP UI

### 完全なNeovim設定例

```lua title="init.lua"
-- ファイルタイプ検出
vim.filetype.add({
  extension = {
    trb = "truby",
  },
})

-- LSP設定
local lspconfig = require('lspconfig')

lspconfig.t_ruby_lsp.setup {
  on_attach = function(client, bufnr)
    -- <c-x><c-o>でトリガーされる補完を有効化
    vim.bo[bufnr].omnifunc = 'v:lua.vim.lsp.omnifunc'

    -- キーマップ
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, opts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, opts)
  end,
}

-- 保存時の自動コンパイル
vim.api.nvim_create_autocmd("BufWritePost", {
  pattern = "*.trb",
  callback = function()
    vim.fn.system("trc " .. vim.fn.expand("%"))
  end,
})
```

## Sublime Text

### パッケージのインストール

1. まだならPackage Controlをインストール
2. コマンドパレットを開く（`Cmd+Shift+P` / `Ctrl+Shift+P`）
3. "Package Control: Install Package"を選択
4. "T-Ruby"を検索してインストール

### 手動インストール

Packagesディレクトリにシンタックスパッケージをクローン：

```bash
cd ~/Library/Application\ Support/Sublime\ Text/Packages/  # macOS
# または
cd ~/.config/sublime-text/Packages/  # Linux

git clone https://github.com/type-ruby/sublime-t-ruby.git T-Ruby
```

### 設定

T-Ruby用のビルドシステムを追加：

```json title="T-Ruby.sublime-build"
{
  "cmd": ["trc", "$file"],
  "file_regex": "^(.+):([0-9]+):([0-9]+): (.+)$",
  "selector": "source.truby"
}
```

## JetBrains IDE（RubyMine、IntelliJ）

### プラグインのインストール

1. Settings/Preferencesを開く
2. Plugins → Marketplaceに移動
3. "T-Ruby"を検索
4. Installをクリックし、IDEを再起動

### 設定

プラグインが自動的に：
- `.trb`ファイルをT-Rubyに関連付け
- シンタックスハイライトを提供
- 型エラーを表示

**Settings → Languages & Frameworks → T-Ruby**で追加設定：
- 型チェックの有効化/無効化
- コンパイラパスの設定
- 出力ディレクトリの設定

## Emacs

### t-ruby-modeの使用

MELPAを通じてインストール：

```elisp
(use-package t-ruby-mode
  :ensure t
  :mode "\\.trb\\'"
  :hook (t-ruby-mode . lsp-deferred))
```

### LSP設定

T-Ruby用のlsp-mode設定：

```elisp
(use-package lsp-mode
  :ensure t
  :commands lsp
  :config
  (add-to-list 'lsp-language-id-configuration '(t-ruby-mode . "truby"))
  (lsp-register-client
   (make-lsp-client
    :new-connection (lsp-stdio-connection '("t-ruby-lsp"))
    :major-modes '(t-ruby-mode)
    :server-id 't-ruby-lsp)))
```

## Vim（LSPなし）

LSPなしの基本的なVimサポート：

```vim title=".vimrc"
" ファイルタイプ検出
autocmd BufRead,BufNewFile *.trb set filetype=ruby

" 保存時にコンパイル
autocmd BufWritePost *.trb silent !trc %

" シンタックスハイライト（Rubyハイライトを使用）
autocmd FileType truby setlocal syntax=ruby
```

## 言語サーバー（LSP）

T-Ruby言語サーバーは任意のLSP互換エディタで使用できます。

### インストール

```bash
gem install t-ruby-lsp
```

### 手動実行

```bash
t-ruby-lsp --stdio
```

### 機能

LSPサーバーが提供するもの：

| 機能 | サポート |
|---------|---------|
| シンタックスハイライト | セマンティックトークン経由 |
| エラー診断 | 完全 |
| ホバー情報 | 完全 |
| 定義へジャンプ | 完全 |
| 参照の検索 | 完全 |
| オートコンプリート | 完全 |
| コードフォーマット | 完全 |
| コードアクション | 部分的 |
| リネーム | 完全 |

## トラブルシューティング

### 拡張機能が動作しない

1. T-Rubyがインストールされているか確認：`trc --version`
2. エディタを再起動
3. 拡張機能/プラグインのログを確認

### シンタックスハイライトがない

- ファイルが`.trb`拡張子を持っているか確認
- エディタ設定でファイルタイプの関連付けを確認
- シンタックス拡張機能を再インストール

### LSPに接続できない

- LSPをインストール：`gem install t-ruby-lsp`
- エディタ設定でLSPパスを確認
- エラーのLSPサーバーログを確認

### 型チェックが遅い

- 遅すぎる場合は「入力時チェック」を無効化
- 代わりに「保存時チェック」を使用
- `node_modules`と`vendor`ディレクトリを除外

## 次のステップ

エディタが設定できたら、学習を続けましょう：

- [プロジェクト設定](/docs/getting-started/project-configuration) - T-Rubyプロジェクトの設定
- [基本型](/docs/learn/basics/basic-types) - 型システムを学ぶ
- [CLIリファレンス](/docs/cli/commands) - すべてのコンパイラコマンド
