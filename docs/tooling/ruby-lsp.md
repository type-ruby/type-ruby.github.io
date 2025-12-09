---
sidebar_position: 3
title: Using with Ruby LSP
description: IDE features with Ruby LSP
---

# Using with Ruby LSP

Ruby LSP provides IDE features like autocomplete, go-to-definition, and inline diagnostics for Ruby code. When combined with T-Ruby, you get rich IDE support powered by type information from your `.rbs` files.

## What is Ruby LSP?

Ruby LSP is a Language Server Protocol implementation for Ruby that provides:

- **Autocomplete** - Intelligent code completion
- **Go to Definition** - Navigate to method/class definitions
- **Hover Information** - View type signatures and documentation
- **Diagnostics** - Inline type errors and warnings
- **Code Actions** - Quick fixes and refactorings
- **Document Symbols** - Outline view of file structure

## Installation

### VS Code

Install the official Ruby LSP extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Ruby LSP"
4. Install the extension by Shopify

Or install via command line:

```bash
code --install-extension Shopify.ruby-lsp
```

### Other Editors

Ruby LSP works with any editor supporting LSP:

- **Neovim**: Use `nvim-lspconfig`
- **Emacs**: Use `lsp-mode` or `eglot`
- **Sublime Text**: Use `LSP` package
- **IntelliJ**: Built-in Ruby support

## Basic Setup for T-Ruby

### Step 1: Install Ruby LSP Gem

```bash
gem install ruby-lsp
```

Or add to Gemfile:

```ruby
group :development do
  gem "ruby-lsp"
  gem "t-ruby"
end
```

### Step 2: Compile T-Ruby Code

Generate RBS files for type information:

```bash
trc compile src/
```

This creates:
```
build/          # Compiled Ruby files
sig/            # RBS type signatures
```

### Step 3: Configure Ruby LSP

Create `.vscode/settings.json`:

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

### Step 4: Configure RBS Path

Tell Ruby LSP where to find RBS signatures:

```json
{
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  }
}
```

## T-Ruby-Specific Configuration

### Working with .trb Files

Configure VS Code to treat `.trb` files as Ruby:

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

### Syntax Highlighting

For better T-Ruby syntax highlighting, create a TextMate grammar or use Ruby highlighting with custom rules:

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

### Workspace Settings

For project-specific configuration:

```json title=".vscode/settings.json"
{
  // Ruby LSP
  "rubyLsp.enabled": true,
  "rubyLsp.rubyVersionManager": "auto",

  // T-Ruby integration
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  },

  // File associations
  "files.associations": {
    "*.trb": "ruby"
  },

  // Formatting
  "editor.formatOnSave": true,
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp"
  },

  // Diagnostics
  "rubyLsp.enabledFeatures": {
    "diagnostics": true,
    "hover": true,
    "completion": true
  }
}
```

## IDE Features with T-Ruby

### Autocomplete

Ruby LSP provides intelligent autocomplete using RBS types:

```ruby title="user.trb"
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
user.   # <- Autocomplete shows: greet, name, email
```

After compiling, Ruby LSP reads `sig/user.rbs` and provides:
- Method suggestions
- Parameter types
- Return types

### Go to Definition

Navigate from usage to definition:

```ruby
user = User.new("Alice", "alice@example.com")
#      ^^^^ Cmd+Click to jump to User class definition

result = user.greet
#            ^^^^^ Cmd+Click to jump to greet method
```

### Hover Information

Hover over symbols to see type information:

```ruby
def process_user(user: User): String
  # Hover over 'user' shows: User
  # Hover over method shows: (User) -> String
  user.greet
end
```

### Inline Diagnostics

See type errors inline as you code:

```ruby
def greet(name: String): String
  name.upcase
end

# Error shown inline:
greet(123)  # Expected String, got Integer
      ^^^
```

### Code Actions

Quick fixes and refactorings:

```ruby
class User
  def initialize(name: String): void
    @name = name
  end
  # 💡 Code action: "Add type annotation for @name"
end
```

### Document Symbols

Outline view shows structure:

```
User (class)
  ├─ @name: String
  ├─ @email: String
  ├─ initialize(name, email)
  ├─ greet()
  └─ update_email(email)
```

## Integration with Steep

For enhanced type checking, use Ruby LSP with Steep:

### Install Steep

```bash
gem install steep
```

### Configure Steepfile

```ruby
target :app do
  check "build"
  signature "sig"
end
```

### Configure Ruby LSP to Use Steep

```json title=".vscode/settings.json"
{
  "rubyLsp.typechecker": "steep",
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  }
}
```

Now Ruby LSP will use Steep for type checking, providing:
- Real-time type errors
- More sophisticated type inference
- Better autocomplete

## Workflow with Ruby LSP

### Development Workflow

1. **Edit T-Ruby file** in VS Code
2. **Save file** - T-Ruby watch compiles automatically
3. **See updates** - Ruby LSP refreshes diagnostics
4. **Get autocomplete** - Based on updated RBS

### Setup Watch Mode

Use T-Ruby watch to auto-compile on save:

```bash
trc watch src/ --exec "echo 'Compiled'"
```

Configure VS Code to run this on startup:

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

## Advanced Configuration

### Custom RBS Paths

If you have multiple RBS directories:

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

### Formatter Settings

Configure formatting for T-Ruby files:

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

### Diagnostics Settings

Customize diagnostic display:

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

### Performance Settings

For large projects, optimize performance:

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

## Other Editor Configurations

### Neovim

With `nvim-lspconfig`:

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

-- Treat .trb as Ruby
vim.filetype.add({
  extension = {
    trb = "ruby"
  }
})
```

### Emacs

With `lsp-mode`:

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

## Troubleshooting

### Ruby LSP Not Working

**Problem**: No autocomplete or diagnostics.

**Solution**:

1. Check Ruby LSP is running:
   ```bash
   ps aux | grep ruby-lsp
   ```

2. Restart Ruby LSP in VS Code:
   - Cmd+Shift+P → "Ruby LSP: Restart"

3. Check output panel:
   - View → Output → Select "Ruby LSP"

### RBS Files Not Found

**Problem**: Ruby LSP doesn't find type information.

**Solution**:

1. Verify RBS files exist:
   ```bash
   ls sig/
   ```

2. Check RBS path in settings:
   ```json
   {
     "rubyLsp.rbs": {
       "enabled": true,
       "path": "sig"
     }
   }
   ```

3. Reload VS Code window:
   - Cmd+Shift+P → "Developer: Reload Window"

### Outdated Diagnostics

**Problem**: Diagnostics don't update after compilation.

**Solution**:

1. Ensure T-Ruby watch is running:
   ```bash
   trc watch src/
   ```

2. Manually refresh Ruby LSP:
   - Save file (Cmd+S)
   - Or restart Ruby LSP

### Performance Issues

**Problem**: Editor is slow with Ruby LSP.

**Solution**:

1. Exclude unnecessary directories:
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

2. Disable unused features:
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

### Type Information Missing

**Problem**: No type info shown on hover.

**Solution**:

1. Verify RBS was generated:
   ```bash
   cat sig/user.rbs
   ```

2. Check hover is enabled:
   ```json
   {
     "rubyLsp.enabledFeatures": {
       "hover": true
     }
   }
   ```

3. Ensure RBS is valid:
   ```bash
   rbs validate sig/
   ```

## Best Practices

### 1. Keep Ruby LSP Running

Start Ruby LSP automatically with VS Code workspace.

### 2. Use Watch Mode

Always run T-Ruby watch during development:

```bash
trc watch src/ --clear
```

### 3. Commit RBS Files

Keep RBS files in version control for team members:

```bash
git add sig/
git commit -m "Update RBS signatures"
```

### 4. Configure for Performance

Exclude unnecessary directories in large projects:

```json
{
  "rubyLsp.indexing": {
    "excludedPatterns": ["**/vendor/**", "**/tmp/**"]
  }
}
```

### 5. Use Steep Integration

For best type checking, enable Steep:

```json
{
  "rubyLsp.typechecker": "steep"
}
```

## Complete VS Code Setup

Here's a complete VS Code configuration for T-Ruby development:

```json title=".vscode/settings.json"
{
  // Ruby LSP configuration
  "rubyLsp.enabled": true,
  "rubyLsp.rubyVersionManager": "auto",
  "rubyLsp.typechecker": "steep",

  // RBS integration
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  },

  // Features
  "rubyLsp.enabledFeatures": {
    "diagnostics": true,
    "formatting": true,
    "documentSymbols": true,
    "hover": true,
    "completion": true,
    "codeActions": true,
    "inlayHints": true
  },

  // Indexing
  "rubyLsp.indexing": {
    "includedPatterns": ["src/**/*.rb", "src/**/*.trb"],
    "excludedPatterns": [
      "**/test/**",
      "**/spec/**",
      "**/vendor/**",
      "**/tmp/**"
    ]
  },

  // File associations
  "files.associations": {
    "*.trb": "ruby"
  },

  // Formatting
  "editor.formatOnSave": true,
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.tabSize": 2,
    "editor.insertSpaces": true
  },

  // Editor appearance
  "editor.inlayHints.enabled": "on",
  "problems.decorations.enabled": true,

  // Terminal
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

## Keyboard Shortcuts

Useful VS Code shortcuts when using Ruby LSP:

| Action | Shortcut (Mac) | Shortcut (Windows/Linux) |
|--------|----------------|------------------------|
| Go to Definition | Cmd+Click | Ctrl+Click |
| Go to Definition | F12 | F12 |
| Peek Definition | Alt+F12 | Alt+F12 |
| Find References | Shift+F12 | Shift+F12 |
| Rename Symbol | F2 | F2 |
| Format Document | Shift+Alt+F | Shift+Alt+F |
| Show Hover | Cmd+K Cmd+I | Ctrl+K Ctrl+I |
| Trigger Suggest | Ctrl+Space | Ctrl+Space |
| Quick Fix | Cmd+. | Ctrl+. |
| Restart LSP | Cmd+Shift+P → "Ruby LSP: Restart" | Ctrl+Shift+P → "Ruby LSP: Restart" |

## Next Steps

- [Using Steep](/docs/tooling/steep) - Enhanced type checking
- [RBS Integration](/docs/tooling/rbs-integration) - Learn about RBS files
- [Ruby LSP Documentation](https://shopify.github.io/ruby-lsp/) - Official docs
