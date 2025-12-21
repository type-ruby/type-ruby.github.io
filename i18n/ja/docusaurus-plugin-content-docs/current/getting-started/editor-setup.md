---
sidebar_position: 4
title: エディタ設定
description: VS Code、Neovim、その他のエディタでT-Rubyを設定
---

<DocsBadge />


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
code --install-extension t-ruby.t-ruby
```

### 機能

VS Code拡張機能が提供するもの：

- `.trb`および`.d.trb`ファイルの**シンタックスハイライト**
- **リアルタイム診断** - 入力中に型エラーを表示
- 型情報付き**オートコンプリート**
- 型を表示する**ホバー情報**
- 関数とクラスの**定義へジャンプ**

### コマンド

拡張機能が提供するコマンド（コマンドパレットからアクセス可能）：

- **T-Ruby: Compile Current File** - 現在の`.trb`ファイルをコンパイル
- **T-Ruby: Generate Declaration File** - `.d.trb`宣言ファイルを生成
- **T-Ruby: Restart Language Server** - LSPサーバーを再起動

### 設定

拡張機能はプロジェクトルートの`trbconfig.yml`からプロジェクト設定を読み込みます。エディタ固有の設定はVS Code設定（`settings.json`）で構成できます：

```json title=".vscode/settings.json"
{
  // trcコンパイラのパス（PATHにない場合）
  "t-ruby.lspPath": "trc",

  // Language Server Protocolサポートを有効化
  "t-ruby.enableLSP": true,

  // リアルタイム診断を有効化
  "t-ruby.diagnostics.enable": true,

  // オートコンプリート候補を有効化
  "t-ruby.completion.enable": true
}
```

:::tip
出力ディレクトリや厳格度レベルなどのコンパイルオプションは、VS Code設定ではなく[`trbconfig.yml`](/docs/getting-started/project-configuration)で構成してください。これにより、すべてのエディタとCI/CDパイプラインで一貫した動作が保証されます。
:::

### 推奨拡張機能

最高のRuby/T-Ruby体験のために、以下もインストール：

- **Ruby LSP** - 一般的なRuby言語サポート
- **Ruby Solargraph** - 追加のRubyインテリジェンス
- **Error Lens** - インラインエラー表示

## Neovim

T-Rubyは[t-ruby-vim](https://github.com/type-ruby/t-ruby-vim)プラグインを通じて公式Neovimサポートを提供します。

### インストール

お好みのプラグインマネージャーを使用：

```lua title="lazy.nvim"
{
  'type-ruby/t-ruby-vim',
  ft = { 'truby' },
}
```

```vim title="vim-plug"
Plug 'type-ruby/t-ruby-vim'
```

### LSP設定

プラグインは組み込みLSP設定を提供します：

```lua title="init.lua"
require('t-ruby').setup()
```

またはカスタムオプション付き：

```lua title="init.lua"
require('t-ruby').setup({
  cmd = { 'trc', '--lsp' },
  on_attach = function(client, bufnr)
    -- on_attach関数
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
  end,
})
```

### コマンド

LSP設定後、以下のコマンドが使用可能：

- `:TRubyCompile` - 現在のファイルをコンパイル
- `:TRubyDecl` - 宣言ファイルを生成
- `:TRubyLspInfo` - LSPステータスを表示

### coc.nvimの使用

`coc-settings.json`に追加：

```json
{
  "languageserver": {
    "t-ruby": {
      "command": "trc",
      "args": ["--lsp"],
      "filetypes": ["truby"],
      "rootPatterns": ["trbconfig.yml", ".git/"]
    }
  }
}
```

### 推奨プラグイン

- **nvim-lspconfig** - LSP設定
- **nvim-cmp** - オートコンプリート
- **lspsaga.nvim** - 拡張LSP UI

## Vim

T-Rubyは[t-ruby-vim](https://github.com/type-ruby/t-ruby-vim)プラグインを通じて公式Vimサポートを提供します。

### インストール

```vim title="vim-plug"
Plug 'type-ruby/t-ruby-vim'
```

または手動でクローン：

```bash
git clone https://github.com/type-ruby/t-ruby-vim ~/.vim/pack/plugins/start/t-ruby-vim
```

### 機能

- `.trb`および`.d.trb`ファイルのシンタックスハイライト
- ファイルタイプ検出

### カスタムキーマッピング

```vim title=".vimrc"
autocmd FileType truby nnoremap <buffer> <leader>tc :!trc %<CR>
autocmd FileType truby nnoremap <buffer> <leader>td :!trc --decl %<CR>
```

## JetBrains IDE（RubyMine、IntelliJ）

T-Rubyは[t-ruby-jetbrains](https://github.com/type-ruby/t-ruby-jetbrains)を通じて公式JetBrainsプラグインサポートを提供します。

### プラグインのインストール

1. Settings/Preferencesを開く
2. Plugins → Marketplaceに移動
3. "T-Ruby"を検索
4. Installをクリックし、IDEを再起動

### 機能

プラグインが提供するもの：

- `.trb`および`.d.trb`ファイルの**シンタックスハイライト**
- LSP経由の**リアルタイム診断**
- 型情報付き**オートコンプリート**
- **定義へジャンプ**

### 設定

プラグインは`trbconfig.yml`からプロジェクト設定を読み込みます。エディタ固有の設定は**Settings → Tools → T-Ruby**で構成できます：

- **trcパス** - T-Rubyコンパイラのパス（デフォルト：`trc`）
- **LSPを有効化** - Language Server Protocolサポートを有効化
- **診断を有効化** - リアルタイム診断を有効化
- **補完を有効化** - コード補完を有効化

:::tip
VS Codeと同様に、コンパイルオプションはIDE設定ではなく`trbconfig.yml`で構成してください。
:::

## Sublime Text

:::note[近日公開]
Sublime Textサポートは計画中ですが、まだ利用できません。`.trb`ファイルをRubyとして扱うことで、汎用シンタックスハイライトを使用できます。
:::

### 一時的な設定

Rubyハイライトを使用するには、Sublime Text設定に追加：

```json title="Preferences.sublime-settings"
{
  "file_associations": {
    "*.trb": "Ruby"
  }
}
```

## Emacs

:::note[近日公開]
Emacsサポートは計画中ですが、まだ利用できません。基本的なシンタックスハイライトには`ruby-mode`を使用できます。
:::

### 一時的な設定

```elisp
(add-to-list 'auto-mode-alist '("\\.trb\\'" . ruby-mode))
```

LSPサポートには、T-Rubyコンパイラで設定：

```elisp
(use-package lsp-mode
  :ensure t
  :config
  (lsp-register-client
   (make-lsp-client
    :new-connection (lsp-stdio-connection '("trc" "--lsp"))
    :major-modes '(ruby-mode)
    :server-id 't-ruby-lsp)))
```

## 言語サーバー（LSP）

T-Rubyコンパイラには、任意のLSP互換エディタで使用できる組み込み言語サーバーが含まれています。

### LSPサーバーの実行

```bash
trc --lsp
```

LSPサーバーはJSON-RPC形式でstdin/stdoutを通じて通信します。

### 機能

| 機能 | サポート |
|---------|---------|
| エラー診断 | 完全 |
| ホバー情報 | 完全 |
| 定義へジャンプ | 完全 |
| オートコンプリート | 完全 |
| 参照の検索 | 計画中 |
| コードフォーマット | 計画中 |
| リネーム | 計画中 |

### 汎用LSP設定

上記にリストされていないエディタの場合、LSPクライアントを以下を実行するように設定：

```bash
trc --lsp
```

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

- `trc`がPATHにあるか確認：`which trc`
- LSPモードが動作するか確認：`trc --lsp`（入力待ちになるはず）
- エディタLSPログでエラーを確認

### 型チェックが遅い

- リアルタイムチェックの代わりに「保存時チェック」を使用
- `trbconfig.yml`で`vendor`および`node_modules`ディレクトリを除外

## 次のステップ

エディタが設定できたら、学習を続けましょう：

- [プロジェクト設定](/docs/getting-started/project-configuration) - T-Rubyプロジェクトの設定
- [基本型](/docs/learn/basics/basic-types) - 型システムを学ぶ
- [CLIリファレンス](/docs/cli/commands) - すべてのコンパイラコマンド
