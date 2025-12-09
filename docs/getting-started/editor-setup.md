---
sidebar_position: 4
title: Editor Setup
description: Set up VS Code, Neovim, and other editors for T-Ruby
---

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
code --install-extension type-ruby.t-ruby-vscode
```

### Features

The VS Code extension provides:

- **Syntax highlighting** for `.trb` files
- **Type error highlighting** as you type
- **Autocomplete** with type information
- **Hover information** showing types
- **Go to definition** for functions and classes
- **Format on save** (optional)

### Configuration

Add to your VS Code settings (`settings.json`):

```json title=".vscode/settings.json"
{
  // Enable type checking as you type
  "t-ruby.typeCheck.enabled": true,

  // Show type hints inline
  "t-ruby.inlayHints.enabled": true,

  // Format .trb files on save
  "t-ruby.format.onSave": true,

  // Path to trc compiler (if not in PATH)
  "t-ruby.compilerPath": "/usr/local/bin/trc",

  // Compile on save
  "t-ruby.compile.onSave": true,

  // Output directory
  "t-ruby.compile.outputDir": "build"
}
```

### Recommended Extensions

For the best Ruby/T-Ruby experience, also install:

- **Ruby LSP** - General Ruby language support
- **Ruby Solargraph** - Additional Ruby intelligence
- **Error Lens** - Inline error display

## Neovim

T-Ruby supports Neovim through the built-in LSP client.

### Using nvim-lspconfig

Add to your Neovim configuration:

```lua title="init.lua"
-- Install t-ruby-lsp if not present
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

### Syntax Highlighting with Tree-sitter

For syntax highlighting, add the T-Ruby tree-sitter parser:

```lua title="init.lua"
require('nvim-treesitter.configs').setup {
  ensure_installed = { "ruby", "truby" },
  highlight = {
    enable = true,
  },
}
```

### File Type Detection

Add file type detection for `.trb` files:

```lua title="init.lua"
vim.filetype.add({
  extension = {
    trb = "truby",
  },
})
```

### Recommended Plugins

- **nvim-lspconfig** - LSP configuration
- **nvim-treesitter** - Syntax highlighting
- **nvim-cmp** - Autocompletion
- **lspsaga.nvim** - Enhanced LSP UI

### Complete Neovim Setup Example

```lua title="init.lua"
-- File type detection
vim.filetype.add({
  extension = {
    trb = "truby",
  },
})

-- LSP setup
local lspconfig = require('lspconfig')

lspconfig.t_ruby_lsp.setup {
  on_attach = function(client, bufnr)
    -- Enable completion triggered by <c-x><c-o>
    vim.bo[bufnr].omnifunc = 'v:lua.vim.lsp.omnifunc'

    -- Keymaps
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, opts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, opts)
  end,
}

-- Autocompile on save
vim.api.nvim_create_autocmd("BufWritePost", {
  pattern = "*.trb",
  callback = function()
    vim.fn.system("trc " .. vim.fn.expand("%"))
  end,
})
```

## Sublime Text

### Installing the Package

1. Install Package Control if you haven't already
2. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Select "Package Control: Install Package"
4. Search for "T-Ruby" and install

### Manual Installation

Clone the syntax package to your Packages directory:

```bash
cd ~/Library/Application\ Support/Sublime\ Text/Packages/  # macOS
# or
cd ~/.config/sublime-text/Packages/  # Linux

git clone https://github.com/type-ruby/sublime-t-ruby.git T-Ruby
```

### Configuration

Add a build system for T-Ruby:

```json title="T-Ruby.sublime-build"
{
  "cmd": ["trc", "$file"],
  "file_regex": "^(.+):([0-9]+):([0-9]+): (.+)$",
  "selector": "source.truby"
}
```

## JetBrains IDEs (RubyMine, IntelliJ)

### Installing the Plugin

1. Open Settings/Preferences
2. Go to Plugins → Marketplace
3. Search for "T-Ruby"
4. Click Install and restart the IDE

### Configuration

The plugin automatically:
- Associates `.trb` files with T-Ruby
- Provides syntax highlighting
- Shows type errors

Additional settings in **Settings → Languages & Frameworks → T-Ruby**:
- Enable/disable type checking
- Configure compiler path
- Set output directory

## Emacs

### Using t-ruby-mode

Install via MELPA:

```elisp
(use-package t-ruby-mode
  :ensure t
  :mode "\\.trb\\'"
  :hook (t-ruby-mode . lsp-deferred))
```

### LSP Configuration

Configure lsp-mode for T-Ruby:

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

## Vim (without LSP)

For basic Vim support without LSP:

```vim title=".vimrc"
" File type detection
autocmd BufRead,BufNewFile *.trb set filetype=ruby

" Compile on save
autocmd BufWritePost *.trb silent !trc %

" Syntax highlighting (uses Ruby highlighting)
autocmd FileType truby setlocal syntax=ruby
```

## Language Server (LSP)

The T-Ruby Language Server can be used with any LSP-compatible editor.

### Installation

```bash
gem install t-ruby-lsp
```

### Running Manually

```bash
t-ruby-lsp --stdio
```

### Capabilities

The LSP server provides:

| Feature | Support |
|---------|---------|
| Syntax highlighting | Via semantic tokens |
| Error diagnostics | Full |
| Hover information | Full |
| Go to definition | Full |
| Find references | Full |
| Autocomplete | Full |
| Code formatting | Full |
| Code actions | Partial |
| Rename | Full |

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

- Install the LSP: `gem install t-ruby-lsp`
- Check LSP path in editor configuration
- Look at LSP server logs for errors

### Type checking slow

- Disable "check on type" if too slow
- Use "check on save" instead
- Exclude `node_modules` and `vendor` directories

## Next Steps

With your editor configured, continue learning:

- [Project Configuration](/docs/getting-started/project-configuration) - Set up a T-Ruby project
- [Basic Types](/docs/learn/basics/basic-types) - Learn the type system
- [CLI Reference](/docs/cli/commands) - All compiler commands
