---
sidebar_position: 4
title: Editor Setup
description: Set up VS Code, Neovim, and other editors for T-Ruby
---

<DocsBadge />


# Editor Setup

Get the best T-Ruby development experience by configuring your editor with syntax highlighting, type checking, and autocomplete.

## VS Code

VS Code offers the most complete T-Ruby development experience.

### Installing the Extension

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for "T-Ruby"
4. Click **Install**

Or install from the command line:

```bash
code --install-extension t-ruby.t-ruby
```

### Features

The VS Code extension provides:

- **Syntax highlighting** for `.trb` and `.d.trb` files
- **Real-time diagnostics** - type errors as you type
- **Autocomplete** with type information
- **Hover information** showing types
- **Go to definition** for functions and classes

### Commands

The extension provides the following commands (accessible via Command Palette):

- **T-Ruby: Compile Current File** - Compile the active `.trb` file
- **T-Ruby: Generate Declaration File** - Generate `.d.trb` declaration file
- **T-Ruby: Restart Language Server** - Restart the LSP server

### Configuration

The extension reads project settings from `trbconfig.yml` in your project root. Editor-specific settings can be configured in VS Code settings (`settings.json`):

```json title=".vscode/settings.json"
{
  // Path to trc compiler (if not in PATH)
  "t-ruby.lspPath": "trc",

  // Enable Language Server Protocol support
  "t-ruby.enableLSP": true,

  // Enable real-time diagnostics
  "t-ruby.diagnostics.enable": true,

  // Enable autocomplete suggestions
  "t-ruby.completion.enable": true
}
```

:::tip
Compile options like output directory and strictness level should be configured in [`trbconfig.yml`](/docs/getting-started/project-configuration), not in VS Code settings. This ensures consistent behavior across all editors and CI/CD pipelines.
:::

### Recommended Extensions

For the best Ruby/T-Ruby experience, also install:

- **Ruby LSP** - General Ruby language support
- **Ruby Solargraph** - Additional Ruby intelligence
- **Error Lens** - Inline error display

## Neovim

T-Ruby provides official Neovim support through the [t-ruby-vim](https://github.com/type-ruby/t-ruby-vim) plugin.

### Installation

Using your preferred plugin manager:

```lua title="lazy.nvim"
{
  'type-ruby/t-ruby-vim',
  ft = { 'truby' },
}
```

```vim title="vim-plug"
Plug 'type-ruby/t-ruby-vim'
```

### LSP Setup

The plugin provides built-in LSP configuration:

```lua title="init.lua"
require('t-ruby').setup()
```

Or with custom options:

```lua title="init.lua"
require('t-ruby').setup({
  cmd = { 'trc', '--lsp' },
  on_attach = function(client, bufnr)
    -- Your on_attach function
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
  end,
})
```

### Commands

After setting up LSP, the following commands are available:

- `:TRubyCompile` - Compile the current file
- `:TRubyDecl` - Generate declaration file
- `:TRubyLspInfo` - Show LSP status

### With coc.nvim

Add to your `coc-settings.json`:

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

### Recommended Plugins

- **nvim-lspconfig** - LSP configuration
- **nvim-cmp** - Autocompletion
- **lspsaga.nvim** - Enhanced LSP UI

## Vim

T-Ruby provides official Vim support through the [t-ruby-vim](https://github.com/type-ruby/t-ruby-vim) plugin.

### Installation

```vim title="vim-plug"
Plug 'type-ruby/t-ruby-vim'
```

Or clone manually:

```bash
git clone https://github.com/type-ruby/t-ruby-vim ~/.vim/pack/plugins/start/t-ruby-vim
```

### Features

- Syntax highlighting for `.trb` and `.d.trb` files
- File type detection

### Custom Key Mappings

```vim title=".vimrc"
autocmd FileType truby nnoremap <buffer> <leader>tc :!trc %<CR>
autocmd FileType truby nnoremap <buffer> <leader>td :!trc --decl %<CR>
```

## JetBrains IDEs (RubyMine, IntelliJ)

T-Ruby provides official JetBrains plugin support through [t-ruby-jetbrains](https://github.com/type-ruby/t-ruby-jetbrains).

### Installing the Plugin

1. Open Settings/Preferences
2. Go to Plugins → Marketplace
3. Search for "T-Ruby"
4. Click Install and restart the IDE

### Features

The plugin provides:

- **Syntax highlighting** for `.trb` and `.d.trb` files
- **Real-time diagnostics** via LSP
- **Autocomplete** with type information
- **Go to definition**

### Configuration

The plugin reads project settings from `trbconfig.yml`. Editor-specific settings can be configured in **Settings → Tools → T-Ruby**:

- **trc Path** - Path to the T-Ruby compiler (default: `trc`)
- **Enable LSP** - Enable Language Server Protocol support
- **Enable Diagnostics** - Enable real-time diagnostics
- **Enable Completion** - Enable code completion

:::tip
Like VS Code, compile options should be configured in `trbconfig.yml`, not in IDE settings.
:::

## Sublime Text

:::note[Coming Soon]
Sublime Text support is planned but not yet available. You can use generic syntax highlighting by treating `.trb` files as Ruby.
:::

### Temporary Setup

Add to your Sublime Text settings to use Ruby highlighting:

```json title="Preferences.sublime-settings"
{
  "file_associations": {
    "*.trb": "Ruby"
  }
}
```

## Emacs

:::note[Coming Soon]
Emacs support is planned but not yet available. You can use `ruby-mode` for basic syntax highlighting.
:::

### Temporary Setup

```elisp
(add-to-list 'auto-mode-alist '("\\.trb\\'" . ruby-mode))
```

For LSP support, configure with the T-Ruby compiler:

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

## Language Server (LSP)

The T-Ruby compiler includes a built-in Language Server that can be used with any LSP-compatible editor.

### Running the LSP Server

```bash
trc --lsp
```

The LSP server communicates via stdin/stdout in JSON-RPC format.

### Capabilities

| Feature | Support |
|---------|---------|
| Error diagnostics | Full |
| Hover information | Full |
| Go to definition | Full |
| Autocomplete | Full |
| Find references | Planned |
| Code formatting | Planned |
| Rename | Planned |

### Generic LSP Configuration

For editors not listed above, configure your LSP client to run:

```bash
trc --lsp
```

## Troubleshooting

### Extension not working

1. Ensure T-Ruby is installed: `trc --version`
2. Restart your editor
3. Check the extension/plugin logs

### No syntax highlighting

- Verify file has `.trb` extension
- Check file type association in editor settings
- Reinstall the syntax extension

### LSP not connecting

- Verify `trc` is in your PATH: `which trc`
- Check if LSP mode works: `trc --lsp` (should wait for input)
- Look at editor LSP logs for errors

### Type checking slow

- Use "check on save" instead of real-time checking
- Exclude `vendor` and `node_modules` directories in `trbconfig.yml`

## Next Steps

With your editor configured, continue learning:

- [Project Configuration](/docs/getting-started/project-configuration) - Set up a T-Ruby project
- [Basic Types](/docs/learn/basics/basic-types) - Learn the type system
- [CLI Reference](/docs/cli/commands) - All compiler commands
