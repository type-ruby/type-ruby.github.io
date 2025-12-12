---
sidebar_position: 3
title: Ruby LSP 사용하기
description: Ruby LSP를 사용한 IDE 기능
---

<DocsBadge />


# Ruby LSP 사용하기

Ruby LSP는 Ruby 코드에 자동완성, 정의로 이동, 인라인 진단과 같은 IDE 기능을 제공합니다. T-Ruby와 결합하면 `.rbs` 파일의 타입 정보를 기반으로 풍부한 IDE 지원을 받을 수 있습니다.

## Ruby LSP란?

Ruby LSP는 Ruby용 Language Server Protocol 구현으로 다음을 제공합니다:

- **자동완성** - 지능적인 코드 완성
- **정의로 이동** - 메서드/클래스 정의로 이동
- **호버 정보** - 타입 시그니처와 문서 보기
- **진단** - 인라인 타입 오류와 경고
- **코드 액션** - 빠른 수정과 리팩토링
- **문서 심볼** - 파일 구조의 개요 보기

## 설치

### VS Code

공식 Ruby LSP 확장 설치:

1. VS Code 열기
2. Extensions로 이동 (Ctrl+Shift+X)
3. "Ruby LSP" 검색
4. Shopify의 확장 설치

또는 커맨드 라인에서:

```bash
code --install-extension Shopify.ruby-lsp
```

### 다른 에디터

Ruby LSP는 LSP를 지원하는 모든 에디터에서 작동합니다:

- **Neovim**: `nvim-lspconfig` 사용
- **Emacs**: `lsp-mode` 또는 `eglot` 사용
- **Sublime Text**: `LSP` 패키지 사용
- **IntelliJ**: 내장 Ruby 지원

## T-Ruby를 위한 기본 설정

### 1단계: Ruby LSP Gem 설치

```bash
gem install ruby-lsp
```

또는 Gemfile에 추가:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/ruby_lsp_spec.rb" line={25} />

```ruby
group :development do
  gem "ruby-lsp"
  gem "t-ruby"
end
```

### 2단계: T-Ruby 코드 컴파일

타입 정보를 위한 RBS 파일 생성:

```bash
trc compile src/
```

이렇게 생성됩니다:
```
build/          # 컴파일된 Ruby 파일
sig/            # RBS 타입 시그니처
```

### 3단계: Ruby LSP 설정

`.vscode/settings.json` 생성:

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

### 4단계: RBS 경로 설정

Ruby LSP에 RBS 시그니처 위치 알려주기:

```json
{
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  }
}
```

## T-Ruby 전용 설정

### .trb 파일 작업

VS Code가 `.trb` 파일을 Ruby로 처리하도록 설정:

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

### 구문 강조

더 나은 T-Ruby 구문 강조를 위해 TextMate 문법을 만들거나 커스텀 규칙과 함께 Ruby 강조 사용:

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

### 워크스페이스 설정

프로젝트별 설정:

```json title=".vscode/settings.json"
{
  // Ruby LSP
  "rubyLsp.enabled": true,
  "rubyLsp.rubyVersionManager": "auto",

  // T-Ruby 통합
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  },

  // 파일 연결
  "files.associations": {
    "*.trb": "ruby"
  },

  // 포매팅
  "editor.formatOnSave": true,
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp"
  },

  // 진단
  "rubyLsp.enabledFeatures": {
    "diagnostics": true,
    "hover": true,
    "completion": true
  }
}
```

## T-Ruby와 함께하는 IDE 기능

### 자동완성

Ruby LSP는 RBS 타입을 사용하여 지능적인 자동완성 제공:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/ruby_lsp_spec.rb" line={35} />

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
user.   # <- 자동완성이 보여줌: greet, name, email
```

컴파일 후 Ruby LSP는 `sig/user.rbs`를 읽어 다음을 제공:
- 메서드 제안
- 파라미터 타입
- 반환 타입

### 정의로 이동

사용 위치에서 정의로 이동:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/ruby_lsp_spec.rb" line={46} />

```ruby
user = User.new("Alice", "alice@example.com")
#      ^^^^ Cmd+클릭으로 User 클래스 정의로 이동

result = user.greet
#            ^^^^^ Cmd+클릭으로 greet 메서드로 이동
```

### 호버 정보

심볼 위에 마우스를 올리면 타입 정보 표시:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/ruby_lsp_spec.rb" line={56} />

```trb
def process_user(user: User): String
  # 'user' 위에 호버하면: User
  # 메서드 위에 호버하면: (User) -> String
  user.greet
end
```

### 인라인 진단

코딩하면서 타입 오류를 인라인으로 확인:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/ruby_lsp_spec.rb" line={67} />

```trb
def greet(name: String): String
  name.upcase
end

# 인라인으로 오류 표시:
greet(123)  # Expected String, got Integer
      ^^^
```

### 코드 액션

빠른 수정과 리팩토링:

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/ruby_lsp_spec.rb" line={78} />

```trb
class User
  def initialize(name: String): void
    @name = name
  end
  # 💡 코드 액션: "@name에 타입 어노테이션 추가"
end
```

### 문서 심볼

개요 뷰에 구조 표시:

```
User (class)
  ├─ @name: String
  ├─ @email: String
  ├─ initialize(name, email)
  ├─ greet()
  └─ update_email(email)
```

## Steep과의 통합

향상된 타입 검사를 위해 Ruby LSP를 Steep과 함께 사용:

### Steep 설치

```bash
gem install steep
```

### Steepfile 설정

<ExampleBadge status="pass" testFile="spec/docs_site/pages/tooling/ruby_lsp_spec.rb" line={89} />

```ruby
target :app do
  check "build"
  signature "sig"
end
```

### Steep을 사용하도록 Ruby LSP 설정

```json title=".vscode/settings.json"
{
  "rubyLsp.typechecker": "steep",
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  }
}
```

이제 Ruby LSP가 타입 검사에 Steep을 사용하여 다음을 제공:
- 실시간 타입 오류
- 더 정교한 타입 추론
- 더 나은 자동완성

## Ruby LSP 워크플로우

### 개발 워크플로우

1. VS Code에서 **T-Ruby 파일 편집**
2. **파일 저장** - T-Ruby 감시가 자동으로 컴파일
3. **업데이트 확인** - Ruby LSP가 진단 새로고침
4. **자동완성 사용** - 업데이트된 RBS 기반

### 감시 모드 설정

저장 시 자동 컴파일을 위해 T-Ruby 감시 사용:

```bash
trc watch src/ --exec "echo 'Compiled'"
```

VS Code가 시작 시 이를 실행하도록 설정:

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

## 고급 설정

### 커스텀 RBS 경로

여러 RBS 디렉토리가 있는 경우:

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

### 포매터 설정

T-Ruby 파일에 대한 포매팅 설정:

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

### 진단 설정

진단 표시 커스터마이즈:

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

### 성능 설정

대규모 프로젝트에서 성능 최적화:

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

## 다른 에디터 설정

### Neovim

`nvim-lspconfig` 사용:

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

-- .trb를 Ruby로 처리
vim.filetype.add({
  extension = {
    trb = "ruby"
  }
})
```

### Emacs

`lsp-mode` 사용:

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

## 문제 해결

### Ruby LSP가 작동하지 않음

**문제**: 자동완성이나 진단이 없음.

**해결**:

1. Ruby LSP가 실행 중인지 확인:
   ```bash
   ps aux | grep ruby-lsp
   ```

2. VS Code에서 Ruby LSP 재시작:
   - Cmd+Shift+P → "Ruby LSP: Restart"

3. 출력 패널 확인:
   - View → Output → "Ruby LSP" 선택

### RBS 파일을 찾을 수 없음

**문제**: Ruby LSP가 타입 정보를 찾지 못함.

**해결**:

1. RBS 파일이 존재하는지 확인:
   ```bash
   ls sig/
   ```

2. 설정에서 RBS 경로 확인:
   ```json
   {
     "rubyLsp.rbs": {
       "enabled": true,
       "path": "sig"
     }
   }
   ```

3. VS Code 창 새로고침:
   - Cmd+Shift+P → "Developer: Reload Window"

### 오래된 진단

**문제**: 컴파일 후 진단이 업데이트되지 않음.

**해결**:

1. T-Ruby 감시가 실행 중인지 확인:
   ```bash
   trc watch src/
   ```

2. 수동으로 Ruby LSP 새로고침:
   - 파일 저장 (Cmd+S)
   - 또는 Ruby LSP 재시작

### 성능 문제

**문제**: Ruby LSP로 에디터가 느림.

**해결**:

1. 불필요한 디렉토리 제외:
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

2. 사용하지 않는 기능 비활성화:
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

### 타입 정보 누락

**문제**: 호버 시 타입 정보가 표시되지 않음.

**해결**:

1. RBS가 생성되었는지 확인:
   ```bash
   cat sig/user.rbs
   ```

2. 호버가 활성화되었는지 확인:
   ```json
   {
     "rubyLsp.enabledFeatures": {
       "hover": true
     }
   }
   ```

3. RBS가 유효한지 확인:
   ```bash
   rbs validate sig/
   ```

## 모범 사례

### 1. Ruby LSP 계속 실행

VS Code 워크스페이스와 함께 Ruby LSP 자동 시작.

### 2. 감시 모드 사용

개발 중에는 항상 T-Ruby 감시 실행:

```bash
trc watch src/ --clear
```

### 3. RBS 파일 커밋

팀원을 위해 RBS 파일을 버전 관리에 유지:

```bash
git add sig/
git commit -m "Update RBS signatures"
```

### 4. 성능을 위한 설정

대규모 프로젝트에서 불필요한 디렉토리 제외:

```json
{
  "rubyLsp.indexing": {
    "excludedPatterns": ["**/vendor/**", "**/tmp/**"]
  }
}
```

### 5. Steep 통합 사용

최상의 타입 검사를 위해 Steep 활성화:

```json
{
  "rubyLsp.typechecker": "steep"
}
```

## 완전한 VS Code 설정

T-Ruby 개발을 위한 완전한 VS Code 설정:

```json title=".vscode/settings.json"
{
  // Ruby LSP 설정
  "rubyLsp.enabled": true,
  "rubyLsp.rubyVersionManager": "auto",
  "rubyLsp.typechecker": "steep",

  // RBS 통합
  "rubyLsp.rbs": {
    "enabled": true,
    "path": "sig"
  },

  // 기능
  "rubyLsp.enabledFeatures": {
    "diagnostics": true,
    "formatting": true,
    "documentSymbols": true,
    "hover": true,
    "completion": true,
    "codeActions": true,
    "inlayHints": true
  },

  // 인덱싱
  "rubyLsp.indexing": {
    "includedPatterns": ["src/**/*.rb", "src/**/*.trb"],
    "excludedPatterns": [
      "**/test/**",
      "**/spec/**",
      "**/vendor/**",
      "**/tmp/**"
    ]
  },

  // 파일 연결
  "files.associations": {
    "*.trb": "ruby"
  },

  // 포매팅
  "editor.formatOnSave": true,
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.tabSize": 2,
    "editor.insertSpaces": true
  },

  // 에디터 모양
  "editor.inlayHints.enabled": "on",
  "problems.decorations.enabled": true,

  // 터미널
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

## 키보드 단축키

Ruby LSP 사용 시 유용한 VS Code 단축키:

| 동작 | 단축키 (Mac) | 단축키 (Windows/Linux) |
|--------|----------------|------------------------|
| 정의로 이동 | Cmd+클릭 | Ctrl+클릭 |
| 정의로 이동 | F12 | F12 |
| 정의 미리보기 | Alt+F12 | Alt+F12 |
| 참조 찾기 | Shift+F12 | Shift+F12 |
| 심볼 이름 변경 | F2 | F2 |
| 문서 포맷 | Shift+Alt+F | Shift+Alt+F |
| 호버 표시 | Cmd+K Cmd+I | Ctrl+K Ctrl+I |
| 제안 트리거 | Ctrl+Space | Ctrl+Space |
| 빠른 수정 | Cmd+. | Ctrl+. |
| LSP 재시작 | Cmd+Shift+P → "Ruby LSP: Restart" | Ctrl+Shift+P → "Ruby LSP: Restart" |

## 다음 단계

- [Steep 사용하기](/docs/tooling/steep) - 향상된 타입 검사
- [RBS 통합](/docs/tooling/rbs-integration) - RBS 파일에 대해 알아보기
- [Ruby LSP 문서](https://shopify.github.io/ruby-lsp/) - 공식 문서
