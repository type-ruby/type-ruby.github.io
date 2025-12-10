# T-Ruby Documentation 기여 가이드

이 문서는 T-Ruby 문서 사이트를 수정하고 배포하는 방법을 설명합니다.

## 목차

- [프로젝트 구조](#프로젝트-구조)
- [로컬 개발 환경 설정](#로컬-개발-환경-설정)
- [문서 수정하기](#문서-수정하기)
- [새 문서 추가하기](#새-문서-추가하기)
- [번역 추가/수정하기](#번역-추가수정하기)
- [빌드 및 배포](#빌드-및-배포)
- [문제 해결](#문제-해결)

---

## 프로젝트 구조

```
t-ruby.github.io/
├── docs/                    # 영문 문서 (기본)
│   ├── introduction/        # 소개
│   ├── getting-started/     # 시작하기
│   ├── learn/               # 학습 가이드
│   │   ├── basics/
│   │   ├── everyday-types/
│   │   ├── functions/
│   │   ├── classes/
│   │   ├── interfaces/
│   │   ├── generics/
│   │   └── advanced/
│   ├── cli/                 # CLI 레퍼런스
│   ├── tooling/             # 도구 연동
│   ├── reference/           # 레퍼런스
│   └── project/             # 프로젝트 정보
├── i18n/                    # 번역 파일
│   ├── ko/                  # 한국어
│   │   ├── code.json        # UI 문자열 번역
│   │   └── docusaurus-plugin-content-docs/
│   │       └── current/     # 문서 번역
│   └── ja/                  # 일본어
│       ├── code.json
│       └── docusaurus-plugin-content-docs/
│           └── current/
├── src/
│   ├── pages/               # 커스텀 페이지
│   │   ├── index.tsx        # 랜딩 페이지
│   │   └── playground.tsx   # 플레이그라운드
│   └── css/
│       └── custom.css       # 커스텀 스타일
├── static/                  # 정적 파일 (이미지, 폰트 등)
├── docusaurus.config.ts     # Docusaurus 설정
└── sidebars.ts              # 사이드바 구조
```

---

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
# 영문 버전으로 실행 (기본)
pnpm start

# 한국어 버전으로 실행
pnpm start --locale ko

# 일본어 버전으로 실행
pnpm start --locale ja
```

브라우저에서 `http://localhost:3000`으로 접속하면 실시간으로 변경사항을 확인할 수 있습니다.

---

## 문서 수정하기

### 1. 문서 파일 찾기

모든 문서는 `docs/` 폴더에 Markdown 파일로 저장되어 있습니다.

```bash
# 예: 유틸리티 타입 문서 수정
docs/learn/advanced/utility-types.md

# 예: 설치 가이드 수정
docs/getting-started/installation.md
```

### 2. 문서 형식

각 문서 파일은 상단에 frontmatter가 있어야 합니다:

```markdown
---
sidebar_position: 1        # 사이드바에서의 순서
title: 문서 제목            # 페이지 제목
description: 간단한 설명    # SEO 및 미리보기용
---

# 본문 제목

본문 내용...
```

### 3. 주의사항: 제네릭 타입 문법

MDX는 `<T>`와 같은 문법을 JSX 태그로 인식합니다. **제목(heading)** 에서 제네릭 타입을 사용할 때는 반드시 이스케이프해야 합니다:

```markdown
<!-- ❌ 잘못된 예 - 빌드 에러 발생 -->
### Array<T>
### Hash<K, V>

<!-- ✅ 올바른 예 -->
### Array\<T\>
### Hash\<K, V\>
```

코드 블록(```` ``` ````) 안에서는 이스케이프가 필요 없습니다.

### 4. Admonitions (알림 상자) 사용

```markdown
:::note
일반 참고 사항
:::

:::tip
유용한 팁
:::

:::info
정보성 내용
:::

:::caution Coming Soon
이 기능은 아직 개발 중입니다.
:::

:::danger
주의가 필요한 내용
:::
```

---

## 새 문서 추가하기

### 1. 파일 생성

적절한 위치에 `.md` 파일을 생성합니다:

```bash
# 새 학습 문서 추가
touch docs/learn/basics/new-topic.md
```

### 2. Frontmatter 작성

```markdown
---
sidebar_position: 4
title: 새 주제
description: 새 주제에 대한 설명
---

# 새 주제

내용...
```

### 3. 사이드바에 추가 (필요한 경우)

`sidebars.ts`를 수정하여 새 문서를 사이드바에 추가합니다:

```typescript
// sidebars.ts
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Learn',
      items: [
        // ... 기존 항목
        'learn/basics/new-topic',  // 새 문서 추가
      ],
    },
  ],
};
```

---

## 번역 추가/수정하기

### 1. 문서 번역

번역할 문서를 해당 언어 폴더에 같은 경로로 생성합니다:

```bash
# 원본 (영어)
docs/getting-started/installation.md

# 한국어 번역
i18n/ko/docusaurus-plugin-content-docs/current/getting-started/installation.md

# 일본어 번역
i18n/ja/docusaurus-plugin-content-docs/current/getting-started/installation.md
```

### 2. UI 문자열 번역

`i18n/{locale}/code.json` 파일을 수정합니다:

```json
{
  "theme.docs.paginator.next": {
    "message": "다음",
    "description": "The label for the next page"
  }
}
```

### 3. 번역 확인

```bash
# 한국어 버전으로 개발 서버 실행
pnpm start --locale ko
```

---

## 빌드 및 배포

### 1. 로컬 빌드 테스트

```bash
# 프로덕션 빌드
pnpm build

# 빌드된 사이트 미리보기
pnpm serve
```

### 2. 빌드 에러 확인

빌드 에러가 발생하면 주로 다음을 확인하세요:

- **MDX 파싱 에러**: 제네릭 타입 `<T>` 이스케이프 여부
- **링크 에러**: 존재하지 않는 문서 경로 참조
- **Frontmatter 에러**: YAML 문법 오류

### 3. 변경사항 커밋

```bash
# 변경된 파일 확인
git status

# 변경사항 스테이징
git add .

# 커밋 (명확한 메시지로)
git commit -m "docs: Update utility types documentation"
```

### 4. GitHub Pages 배포

```bash
# gh-pages 브랜치로 빌드 및 배포
pnpm deploy
```

이 명령어는:
1. 사이트를 빌드합니다
2. 빌드 결과물을 `gh-pages` 브랜치에 푸시합니다

---

## 문제 해결

### 빌드 에러: MDX compilation failed

**에러 메시지:**
```
Error: MDX compilation failed for file "..."
Cause: Expected a closing tag for `<T>`
```

**해결 방법:**
제목(heading)에서 제네릭 타입을 이스케이프합니다:
```markdown
### Array\<T\>
```

### 빌드 에러: Broken link

**에러 메시지:**
```
Broken link on page ...
```

**해결 방법:**
링크 경로가 올바른지 확인합니다. 경로는 항상 `/docs/`로 시작해야 합니다:
```markdown
[설치하기](/docs/getting-started/installation)
```

### 개발 서버가 변경을 감지하지 못함

```bash
# 개발 서버 재시작
pnpm start
```

### 빌드 캐시 문제

```bash
# 캐시 삭제 후 재빌드
rm -rf .docusaurus build node_modules/.cache
pnpm build
```

---

## 커밋 메시지 컨벤션

```
docs: 문서 내용 변경
feat: 새 기능/페이지 추가
fix: 오타/버그 수정
style: 스타일 변경
chore: 설정 파일 변경
i18n: 번역 추가/수정
```

예시:
```bash
git commit -m "docs: Add error handling section to quick-start guide"
git commit -m "i18n(ko): Translate getting-started pages"
git commit -m "fix: Escape generic types in utility-types headings"
```

---

## 빠른 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `pnpm install` | 의존성 설치 |
| `pnpm start` | 개발 서버 실행 |
| `pnpm start --locale ko` | 한국어로 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm serve` | 빌드된 사이트 미리보기 |
| `pnpm deploy` | GitHub Pages 배포 |

---

## 도움이 필요하면

- [Docusaurus 공식 문서](https://docusaurus.io/docs)
- [MDX 문법 가이드](https://mdxjs.com/docs/)
- GitHub Issue를 통해 질문해주세요
