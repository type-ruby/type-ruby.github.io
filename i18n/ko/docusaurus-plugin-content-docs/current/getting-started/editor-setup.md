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
code --install-extension t-ruby.t-ruby
```

### 기능

VS Code 확장이 제공하는 것들:

- `.trb` 및 `.d.trb` 파일의 **구문 강조**
- **실시간 진단** - 입력 중 타입 오류 표시
- 타입 정보가 있는 **자동완성**
- 타입을 보여주는 **호버 정보**
- 함수와 클래스의 **정의로 이동**

### 명령어

확장이 제공하는 명령어 (명령 팔레트에서 접근 가능):

- **T-Ruby: Compile Current File** - 현재 `.trb` 파일 컴파일
- **T-Ruby: Generate Declaration File** - `.d.trb` 선언 파일 생성
- **T-Ruby: Restart Language Server** - LSP 서버 재시작

### 구성

확장은 프로젝트 루트의 `trbconfig.yml`에서 프로젝트 설정을 읽습니다. 에디터 전용 설정은 VS Code 설정(`settings.json`)에서 구성할 수 있습니다:

```json title=".vscode/settings.json"
{
  // trc 컴파일러 경로 (PATH에 없는 경우)
  "t-ruby.lspPath": "trc",

  // Language Server Protocol 지원 활성화
  "t-ruby.enableLSP": true,

  // 실시간 진단 활성화
  "t-ruby.diagnostics.enable": true,

  // 자동완성 제안 활성화
  "t-ruby.completion.enable": true
}
```

:::tip
출력 디렉토리나 엄격도 수준 같은 컴파일 옵션은 VS Code 설정이 아닌 [`trbconfig.yml`](/docs/getting-started/project-configuration)에서 구성해야 합니다. 이렇게 하면 모든 에디터와 CI/CD 파이프라인에서 일관된 동작을 보장합니다.
:::

### 권장 확장

최고의 Ruby/T-Ruby 경험을 위해 다음도 설치하세요:

- **Ruby LSP** - 일반 Ruby 언어 지원
- **Ruby Solargraph** - 추가 Ruby 인텔리전스
- **Error Lens** - 인라인 오류 표시

## Neovim

T-Ruby는 [t-ruby-vim](https://github.com/type-ruby/t-ruby-vim) 플러그인을 통해 공식 Neovim 지원을 제공합니다.

### 설치

선호하는 플러그인 관리자 사용:

```lua title="lazy.nvim"
{
  'type-ruby/t-ruby-vim',
  ft = { 'truby' },
}
```

```vim title="vim-plug"
Plug 'type-ruby/t-ruby-vim'
```

### LSP 설정

플러그인은 내장 LSP 구성을 제공합니다:

```lua title="init.lua"
require('t-ruby').setup()
```

또는 사용자 정의 옵션과 함께:

```lua title="init.lua"
require('t-ruby').setup({
  cmd = { 'trc', '--lsp' },
  on_attach = function(client, bufnr)
    -- on_attach 함수
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
  end,
})
```

### 명령어

LSP 설정 후 다음 명령어를 사용할 수 있습니다:

- `:TRubyCompile` - 현재 파일 컴파일
- `:TRubyDecl` - 선언 파일 생성
- `:TRubyLspInfo` - LSP 상태 표시

### coc.nvim 사용

`coc-settings.json`에 추가:

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

### 권장 플러그인

- **nvim-lspconfig** - LSP 구성
- **nvim-cmp** - 자동완성
- **lspsaga.nvim** - 향상된 LSP UI

## Vim

T-Ruby는 [t-ruby-vim](https://github.com/type-ruby/t-ruby-vim) 플러그인을 통해 공식 Vim 지원을 제공합니다.

### 설치

```vim title="vim-plug"
Plug 'type-ruby/t-ruby-vim'
```

또는 수동으로 클론:

```bash
git clone https://github.com/type-ruby/t-ruby-vim ~/.vim/pack/plugins/start/t-ruby-vim
```

### 기능

- `.trb` 및 `.d.trb` 파일의 구문 강조
- 파일 타입 감지

### 사용자 정의 키 매핑

```vim title=".vimrc"
autocmd FileType truby nnoremap <buffer> <leader>tc :!trc %<CR>
autocmd FileType truby nnoremap <buffer> <leader>td :!trc --decl %<CR>
```

## JetBrains IDE (RubyMine, IntelliJ)

T-Ruby는 [t-ruby-jetbrains](https://github.com/type-ruby/t-ruby-jetbrains)를 통해 공식 JetBrains 플러그인 지원을 제공합니다.

### 플러그인 설치

1. Settings/Preferences 열기
2. Plugins → Marketplace로 이동
3. "T-Ruby" 검색
4. Install 클릭 후 IDE 재시작

### 기능

플러그인이 제공하는 것들:

- `.trb` 및 `.d.trb` 파일의 **구문 강조**
- LSP를 통한 **실시간 진단**
- 타입 정보가 있는 **자동완성**
- **정의로 이동**

### 구성

플러그인은 `trbconfig.yml`에서 프로젝트 설정을 읽습니다. 에디터 전용 설정은 **Settings → Tools → T-Ruby**에서 구성할 수 있습니다:

- **trc 경로** - T-Ruby 컴파일러 경로 (기본값: `trc`)
- **LSP 활성화** - Language Server Protocol 지원 활성화
- **진단 활성화** - 실시간 진단 활성화
- **완성 활성화** - 코드 완성 활성화

:::tip
VS Code와 마찬가지로 컴파일 옵션은 IDE 설정이 아닌 `trbconfig.yml`에서 구성해야 합니다.
:::

## Sublime Text

:::note[출시 예정]
Sublime Text 지원은 계획되어 있지만 아직 사용할 수 없습니다. `.trb` 파일을 Ruby로 처리하여 일반 구문 강조를 사용할 수 있습니다.
:::

### 임시 설정

Ruby 강조를 사용하려면 Sublime Text 설정에 추가:

```json title="Preferences.sublime-settings"
{
  "file_associations": {
    "*.trb": "Ruby"
  }
}
```

## Emacs

:::note[출시 예정]
Emacs 지원은 계획되어 있지만 아직 사용할 수 없습니다. 기본 구문 강조를 위해 `ruby-mode`를 사용할 수 있습니다.
:::

### 임시 설정

```elisp
(add-to-list 'auto-mode-alist '("\\.trb\\'" . ruby-mode))
```

LSP 지원을 위해 T-Ruby 컴파일러로 구성:

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

## 언어 서버 (LSP)

T-Ruby 컴파일러에는 모든 LSP 호환 에디터에서 사용할 수 있는 내장 언어 서버가 포함되어 있습니다.

### LSP 서버 실행

```bash
trc --lsp
```

LSP 서버는 JSON-RPC 형식으로 stdin/stdout을 통해 통신합니다.

### 기능

| 기능 | 지원 |
|---------|---------|
| 오류 진단 | 전체 |
| 호버 정보 | 전체 |
| 정의로 이동 | 전체 |
| 자동완성 | 전체 |
| 참조 찾기 | 계획됨 |
| 코드 포맷 | 계획됨 |
| 이름 변경 | 계획됨 |

### 일반 LSP 구성

위에 나열되지 않은 에디터의 경우 LSP 클라이언트를 다음과 같이 실행하도록 구성:

```bash
trc --lsp
```

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

- `trc`가 PATH에 있는지 확인: `which trc`
- LSP 모드가 작동하는지 확인: `trc --lsp` (입력 대기해야 함)
- 에디터 LSP 로그에서 오류 확인

### 타입 검사가 느림

- 실시간 검사 대신 "저장 시 검사" 사용
- `trbconfig.yml`에서 `vendor` 및 `node_modules` 디렉토리 제외

## 다음 단계

에디터가 구성되었으니 계속 학습하세요:

- [프로젝트 구성](/docs/getting-started/project-configuration) - T-Ruby 프로젝트 설정
- [기본 타입](/docs/learn/basics/basic-types) - 타입 시스템 배우기
- [CLI 참조](/docs/cli/commands) - 모든 컴파일러 명령
