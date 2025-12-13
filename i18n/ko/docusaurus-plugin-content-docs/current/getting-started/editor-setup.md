---
sidebar_position: 4
title: 에디터 설정
description: VS Code, Neovim 및 기타 에디터에서 T-Ruby 설정
---

<DocsBadge />


# 에디터 설정

구문 강조, 타입 검사, 자동완성을 갖춘 에디터를 구성하여 최고의 T-Ruby 개발 경험을 얻으세요.

## VS Code

VS Code는 가장 완벽한 T-Ruby 개발 경험을 제공합니다.

### 확장 설치

1. VS Code 열기
2. 확장으로 이동 (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. "T-Ruby" 검색
4. **설치** 클릭

또는 명령줄에서 설치:

```bash
code --install-extension type-ruby.t-ruby-vscode
```

### 기능

VS Code 확장이 제공하는 것들:

- `.trb` 파일의 **구문 강조**
- 입력 중 **타입 오류 강조**
- 타입 정보가 있는 **자동완성**
- 타입을 보여주는 **호버 정보**
- 함수와 클래스의 **정의로 이동**
- **저장 시 포맷** (선택 사항)

### 구성

VS Code 설정(`settings.json`)에 추가:

```json title=".vscode/settings.json"
{
  // 입력 중 타입 검사 활성화
  "t-ruby.typeCheck.enabled": true,

  // 인라인 타입 힌트 표시
  "t-ruby.inlayHints.enabled": true,

  // 저장 시 .trb 파일 포맷
  "t-ruby.format.onSave": true,

  // trc 컴파일러 경로 (PATH에 없는 경우)
  "t-ruby.compilerPath": "/usr/local/bin/trc",

  // 저장 시 컴파일
  "t-ruby.compile.onSave": true,

  // 출력 디렉토리
  "t-ruby.compile.outputDir": "build"
}
```

### 권장 확장

최고의 Ruby/T-Ruby 경험을 위해 다음도 설치하세요:

- **Ruby LSP** - 일반 Ruby 언어 지원
- **Ruby Solargraph** - 추가 Ruby 인텔리전스
- **Error Lens** - 인라인 오류 표시

## Neovim

T-Ruby는 내장 LSP 클라이언트를 통해 Neovim을 지원합니다.

### nvim-lspconfig 사용

Neovim 구성에 추가:

```lua title="init.lua"
-- t-ruby-lsp가 없으면 설치
-- gem install t-ruby-lsp

require('lspconfig').t_ruby_lsp.setup {
  cmd = { "t-ruby-lsp" },
  filetypes = { "truby" },
  root_dir = require('lspconfig').util.root_pattern("trbconfig.yml", ".git"),
  settings = {
    truby = {
      typeCheck = {
        enabled = true
      }
    }
  }
}
```

### Tree-sitter로 구문 강조

구문 강조를 위해 T-Ruby tree-sitter 파서를 추가:

```lua title="init.lua"
require('nvim-treesitter.configs').setup {
  ensure_installed = { "ruby", "truby" },
  highlight = {
    enable = true,
  },
}
```

### 파일 타입 감지

`.trb` 파일에 대한 파일 타입 감지 추가:

```lua title="init.lua"
vim.filetype.add({
  extension = {
    trb = "truby",
  },
})
```

### 권장 플러그인

- **nvim-lspconfig** - LSP 구성
- **nvim-treesitter** - 구문 강조
- **nvim-cmp** - 자동완성
- **lspsaga.nvim** - 향상된 LSP UI

### 완전한 Neovim 설정 예제

```lua title="init.lua"
-- 파일 타입 감지
vim.filetype.add({
  extension = {
    trb = "truby",
  },
})

-- LSP 설정
local lspconfig = require('lspconfig')

lspconfig.t_ruby_lsp.setup {
  on_attach = function(client, bufnr)
    -- <c-x><c-o>로 트리거되는 완성 활성화
    vim.bo[bufnr].omnifunc = 'v:lua.vim.lsp.omnifunc'

    -- 키맵
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, opts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, opts)
  end,
}

-- 저장 시 자동 컴파일
vim.api.nvim_create_autocmd("BufWritePost", {
  pattern = "*.trb",
  callback = function()
    vim.fn.system("trc " .. vim.fn.expand("%"))
  end,
})
```

## Sublime Text

### 패키지 설치

1. Package Control을 아직 설치하지 않았다면 설치
2. 명령 팔레트 열기 (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. "Package Control: Install Package" 선택
4. "T-Ruby" 검색 후 설치

### 수동 설치

Packages 디렉토리에 구문 패키지 클론:

```bash
cd ~/Library/Application\ Support/Sublime\ Text/Packages/  # macOS
# 또는
cd ~/.config/sublime-text/Packages/  # Linux

git clone https://github.com/type-ruby/sublime-t-ruby.git T-Ruby
```

### 구성

T-Ruby용 빌드 시스템 추가:

```json title="T-Ruby.sublime-build"
{
  "cmd": ["trc", "$file"],
  "file_regex": "^(.+):([0-9]+):([0-9]+): (.+)$",
  "selector": "source.truby"
}
```

## JetBrains IDE (RubyMine, IntelliJ)

### 플러그인 설치

1. Settings/Preferences 열기
2. Plugins → Marketplace로 이동
3. "T-Ruby" 검색
4. Install 클릭 후 IDE 재시작

### 구성

플러그인이 자동으로:
- `.trb` 파일을 T-Ruby와 연결
- 구문 강조 제공
- 타입 오류 표시

**Settings → Languages & Frameworks → T-Ruby**에서 추가 설정:
- 타입 검사 활성화/비활성화
- 컴파일러 경로 구성
- 출력 디렉토리 설정

## Emacs

### t-ruby-mode 사용

MELPA를 통해 설치:

```elisp
(use-package t-ruby-mode
  :ensure t
  :mode "\\.trb\\'"
  :hook (t-ruby-mode . lsp-deferred))
```

### LSP 구성

T-Ruby용 lsp-mode 구성:

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

## Vim (LSP 없이)

LSP 없이 기본 Vim 지원:

```vim title=".vimrc"
" 파일 타입 감지
autocmd BufRead,BufNewFile *.trb set filetype=ruby

" 저장 시 컴파일
autocmd BufWritePost *.trb silent !trc %

" 구문 강조 (Ruby 강조 사용)
autocmd FileType truby setlocal syntax=ruby
```

## 언어 서버 (LSP)

T-Ruby 언어 서버는 모든 LSP 호환 에디터에서 사용할 수 있습니다.

### 설치

```bash
gem install t-ruby-lsp
```

### 수동 실행

```bash
t-ruby-lsp --stdio
```

### 기능

LSP 서버가 제공하는 것들:

| 기능 | 지원 |
|---------|---------|
| 구문 강조 | 시맨틱 토큰 통해 |
| 오류 진단 | 전체 |
| 호버 정보 | 전체 |
| 정의로 이동 | 전체 |
| 참조 찾기 | 전체 |
| 자동완성 | 전체 |
| 코드 포맷 | 전체 |
| 코드 액션 | 부분 |
| 이름 변경 | 전체 |

## 문제 해결

### 확장이 작동하지 않음

1. T-Ruby가 설치되었는지 확인: `trc --version`
2. 에디터 재시작
3. 확장/플러그인 로그 확인

### 구문 강조 없음

- 파일이 `.trb` 확장자를 가지고 있는지 확인
- 에디터 설정에서 파일 타입 연결 확인
- 구문 확장 재설치

### LSP 연결 안 됨

- LSP 설치: `gem install t-ruby-lsp`
- 에디터 구성에서 LSP 경로 확인
- 오류에 대한 LSP 서버 로그 확인

### 타입 검사가 느림

- 너무 느리면 "입력 시 검사" 비활성화
- 대신 "저장 시 검사" 사용
- `node_modules`와 `vendor` 디렉토리 제외

## 다음 단계

에디터가 구성되었으니 계속 학습하세요:

- [프로젝트 구성](/docs/getting-started/project-configuration) - T-Ruby 프로젝트 설정
- [기본 타입](/docs/learn/basics/basic-types) - 타입 시스템 배우기
- [CLI 참조](/docs/cli/commands) - 모든 컴파일러 명령
