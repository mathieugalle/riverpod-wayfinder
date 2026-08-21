<div align="center">

# 🧭 Riverpod Wayfinder

**생성된 파일이 아니라, 실제로 작성한 Riverpod provider로 바로 이동하세요.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.74.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

Riverpod + `riverpod_generator` 프로젝트를 위한 VSCode 확장 프로그램입니다. `viewFreshnessProvider`, `counterProvider` 등 provider 사용 위치를 클릭하면, 여러 provider가 섞여 있는 파일이라도 실제로 작성한 `class`나 함수로 이동합니다.

## 이 확장 프로그램이 필요한 이유

코드 생성을 사용하면 `fooProvider`는 실제로 `@riverpod` 코드를 작성한 위치가 아니라 생성된 `foo.g.dart` 파일에 정의됩니다. VSCode의 기본 탐색 기능은 자연스럽게 그곳으로 안내하며, 소스 코드로는 이동하지 않습니다. 이는 모든 Riverpod 코드베이스에 부과되는 작지만 지속적인 부담으로, 건드릴 필요가 없는 파일로의 우회가 하루에도 수십 번 발생합니다.

Riverpod Wayfinder는 이 우회를 없앱니다. `.g.dart` 파일을 대신 읽어, 클릭한 provider가 (파일에 여러 개가 묶여 있어도) 정확히 어떤 것인지 파악한 뒤, 실제 선언 위치로 데려다줍니다.

## 기능

- **`Ctrl+F12` / `Cmd+F12`(Go to Implementation)** — 주요 동작 방식. 선택 목록 없이 매번 작성한 소스로 직접 이동합니다.
- **`Ctrl+Click` / `Cmd+Click`(Go to Definition)** — Dart 확장 프로그램 자체의 답변과 함께, 작성한 소스도 후보로 제시합니다. 자세한 내용은 아래 [왜 선택 목록이 표시되나요?](#왜-ctrlclick--cmdclick는-바로-이동하지-않고-선택-목록을-표시하나요)를 참고하세요.
- **`Ctrl+Alt+D` / `Cmd+Alt+D`** — 수동 명령 대체 수단으로, 파일 어디서든 사용 가능합니다.
- 클래스 기반과 함수 기반 스타일이 섞여 있어도 **여러 provider**가 있는 파일을 올바르게 처리합니다.
- `@riverpod class Foo extends _$Foo`와 `@riverpod ReturnType foo(Ref ref)` 모두 지원합니다.
- 파일 이름 규칙이 필요 없습니다 — 내용을 기준으로 일치를 판단하므로 `foo.providers.dart` / `foo.providers.g.dart`와 일반 `foo.dart` / `foo.g.dart` 모두 동작합니다.
- provider 명명 규칙도 필요 없습니다 — 생성된 식별자가 `Provider`로 끝나든 `Controller`로 끝나든, 팀만의 명명 규칙을 쓰든 상관없이 `@riverpod` 코드 생성이 동작하는 곳이라면 어디서나 작동합니다.
- **`Shift+F12`(Find All References)** — 직접 작성한 `@riverpod` 선언에서 사용하면, 그것이 생성하는 provider의 워크스페이스 내 모든 사용처를 나열합니다(`.g.dart` 위치는 절대 표시되지 않습니다). 가능하면 Dart 분석기 자체의 참조를 우선 사용하고, 그렇지 않으면 텍스트 검색으로 대체합니다.
- 단계별 해석 추적을 **"Riverpod Wayfinder" Output 채널**에 기록해 문제 해결에 활용할 수 있습니다 — 아래 [문제 해결](#문제-해결)을 참고하세요.

## 설치

아직 마켓플레이스에 게시되지 않았습니다 — [Releases](../../releases) 페이지에서 `.vsix`를 받거나 직접 빌드([개발](#개발) 참고)한 뒤 수동으로 설치하세요.

1. VSCode 열기 → 확장 프로그램 보기 → `···` 메뉴 → **Install from VSIX...**
2. 다운로드한 `riverpod-wayfinder-*.vsix` 파일 선택

또는 명령줄에서:

```bash
code --install-extension riverpod-wayfinder-0.3.0.vsix
```

## 사용 방법

1. provider 사용 위치(예: `viewFreshnessProvider`)에 커서를 놓거나 선택합니다
2. 다음 방법 중 하나로 선언으로 이동합니다:
   - **`Ctrl+F12`**(Windows/Linux) / **`Cmd+F12`**(Mac) — "Go to Implementation" — 항상 선택 목록 없이 소스로 직접 이동
   - **`Ctrl+Click`** / **`Cmd+Click`**(또는 `F12`) — "Go to Definition" — 보통 생성된 `.g.dart` 위치와 작성한 소스를 모두 포함한 선택 목록이 열리므로 원하는 것을 선택
   - **`Ctrl+Alt+D`**(Windows/Linux) / **`Cmd+Alt+D`**(Mac), 또는 명령 팔레트에서 **"Riverpod Wayfinder: Go to Provider Source"** 실행

### 예시

스타일이 섞인 여러 provider를 담은 하나의 파일 — 바로 이 확장 프로그램이 존재하는 이유입니다:

```dart
// view_freshness.providers.dart 안
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // viewFreshnessScoreProvider에서 Ctrl+F12 하면 ViewFreshness가 아니라 여기로 이동

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // viewFreshnessHistoryProvider는 여기로 이동
```

### 왜 `Ctrl+Click` / `Cmd+Click`는 바로 이동하지 않고 선택 목록을 표시하나요?

`Ctrl+Click`은 VSCode의 **Go to Definition**을 실행하는데, 이는 `dart` 언어에 대해 `DefinitionProvider`를 등록한 모든 확장 프로그램(생성된 `.g.dart` 파일로 해석하는 공식 Dart 확장 프로그램 포함, 실제로 심볼이 정의된 곳이기도 함)에 걸쳐 통합됩니다. VSCode는 우선순위, 순서, 속도로 어느 한 provider의 결과를 "승리"시키지 않으며, 둘 이상의 위치가 반환되면 선택 목록/미리보기를 표시합니다. Riverpod Wayfinder도 `DefinitionProvider`를 등록하므로, 그 답변(작성한 소스)이 Dart의 답변과 나란히 목록에 나타납니다 — Dart 자체의 기여를 덮어쓰거나 숨기지 않으며 그럴 수도 없습니다.

매번 선택하고 싶지 않다면 **Go to Implementation**(`Ctrl+F12` / `Cmd+F12`)을 사용하세요 — Dart 확장 프로그램이 관여하지 않는 별도의 동작이라 경쟁이 없으며, 항상 작성한 소스로 바로 이동합니다.

### `Shift+F12`("Find All References")가 가끔 여전히 `.g.dart` 위치를 보여주는 이유는 무엇인가요?

위의 `Ctrl+Click` 선택 목록과 근본 원인이 같습니다: VSCode는 등록된 모든 `ReferenceProvider`를 통합하는데, Riverpod Wayfinder 자체의 기여에는 `.g.dart` 위치가 절대 포함되지 않지만 — 공식 Dart 확장 프로그램의 기여에는 포함될 수 있습니다. 생성된 코드가 실제로 작성한 심볼을 다시 호출한다면(클래스 기반 provider의 생성 파일에 있는 `PackageMetrics create() => PackageMetrics();`처럼 보통 최소 한 번은 그렇습니다), 이는 Dart 입장에서 진짜 참조이며 Dart의 `ReferenceProvider`는 이를 올바르게 보고합니다. 병합된 목록에서 다른 확장 프로그램의 기여만 걸러낼 수 있는 지원되는 방법은 없습니다.

### 작동 방식

1. 클릭한 provider가 포함된 `.g.dart` 파일을 찾습니다
2. `part of` 문을 읽어 작성한 `.dart` 파일을 찾습니다
3. 클릭한 **바로 그** provider에 해당하는 `@ProviderFor(...)` 어노테이션을 식별합니다(파일 내 첫 번째 것만이 아님)
4. 일치하는 `class` 또는 `@riverpod` 어노테이션이 붙은 함수 선언으로 이동합니다

## 요구 사항

- VSCode 1.74.0 이상(Cursor 등 VSCode 기반 에디터에서도 동작)
- [Dart 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code)(`.g.dart` 생성 및 일상적인 Dart 지원용)

## 문제 해결

Riverpod Wayfinder는 각 해석 결정(확인한 후보 `.g.dart` 파일, 추론된 클래스/함수 이름, 해석된 대상 라인, 그리고 모든 오류)을 전용 **"Riverpod Wayfinder"** 채널로 Output 패널에 기록합니다:

1. **View → Output**을 연 다음, 채널 드롭다운에서 **"Riverpod Wayfinder"**를 선택하세요.
2. 단계별 추적은 기본적으로 숨겨져 있습니다. 보려면 해당 채널 툴바의 톱니바퀴 아이콘을 클릭하거나(또는 **"Developer: Set Log Level..."** → **"Riverpod Wayfinder"**를 실행하고) 레벨을 **Debug** 또는 **Trace**로 설정하세요.
3. 오류(읽지 못한 파일, 실패한 분석기 호출 등)는 이 레벨과 관계없이 항상 표시됩니다.

## 알려진 문제

- 소스 파일을 찾기 위해 `.g.dart` 파일의 `part of` 문에 의존합니다 — 특이한 코드 생성 설정에서는 해석되지 않을 수 있습니다.
- 클래스/함수 이름 추론은 대소문자 휴리스틱(첫 글자가 대문자면 클래스, 소문자면 함수)을 사용합니다. Dart 명명 규칙을 따르지 않는 코드는 올바르게 해석되지 않을 수 있습니다.
- `Shift+F12`는 Dart 확장 프로그램 자체가 가져오는 `.g.dart` 위치를 여전히 보여줄 수 있습니다 — 위 FAQ를 참고하세요, 이 확장 프로그램이 억제할 수 있는 것이 아닙니다.
- `Shift+F12`의 텍스트 검색 대체 방식(Dart 분석기가 결과를 반환하지 않을 때 사용)은 단순한 단어 경계 일치이므로, 주석이나 문자열 리터럴 안의 동일한 이름과 실제 사용처를 구분하지 못합니다.

## 로드맵

이 확장 프로그램은 신뢰할 수 있는 탐색이라는 한 가지에 집중하고 있지만, 기존 확장 프로그램들이 아직 잘 다루지 못하는 Riverpod의 불편함이 더 많습니다: 프로젝트 상태 점검 명령, 의존성 그래프, 코드 생성 마이그레이션 지원 등입니다. 아이디어 목록은 [ROADMAP.md](ROADMAP.md)를 참고하세요 — 기여와 투표를 환영합니다.

## 개발

```bash
npm install
npm run test:unit    # 에디터가 필요 없는 순수 resolver 단위 테스트
npm run compile       # 타입 검사, lint, 번들링
npx @vscode/vsce package   # 설치 가능한 .vsix 빌드
```

전체 통합 확인(실제 에디터에서 `Ctrl+F12`가 올바르게 이동하는지)을 위해서는 이 폴더를 VSCode에서 열고 `F5`를 눌러 Extension Development Host를 실행한 뒤, 생성된 provider가 있는 `.dart` 파일을 열어 테스트하세요 — 이 단계는 사람이 직접 확인해야 합니다.

해석 로직은 모두 [`src/resolver.ts`](src/resolver.ts)에 있으며 `vscode` 임포트가 전혀 없습니다 — [`test/fixtures/`](test/fixtures/)의 현실적인 다중 provider 픽스처에 대해 테스트된 순수 함수입니다. [`src/extension.ts`](src/extension.ts)는 VSCode 쪽의 얇은 래퍼입니다.

## 기여

이슈와 풀 리퀘스트를 환영합니다 — 진정으로 커뮤니티가 소유하는 도구를 지향합니다. 올바르게 해석되지 않는 경우를 발견하면, 이를 재현할 수 있는 최소한의 `.dart` + `.g.dart` 쌍을 포함해 주세요. 보통 그것만으로 회귀 테스트로 만들 수 있습니다.

## 크레딧

이것은 [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider)의 포크입니다 — 원래 아이디어에 대한 모든 공은 [@shinriyo](https://github.com/shinriyo)에게 있습니다. 이 포크는 다중 provider 해석 버그를 수정하고, 실제로 안정적으로 동작하도록 주요 동작 방식을 `Go to Implementation`으로 전환했으며, `Ctrl+Click`이 항상 생성된 파일로만 가지 않고 선택지를 제공하도록 Dart의 것과 나란히 `DefinitionProvider`를 추가했습니다.

## 라이선스

MIT — 100% 무료 오픈소스, 아무런 조건 없이. [LICENSE](LICENSE)를 참고하세요.
