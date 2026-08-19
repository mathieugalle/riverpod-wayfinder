<div align="center">

# 🧭 Riverpod Wayfinder

**Jump straight to the Riverpod provider you actually wrote — not the generated file.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.60.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

A VSCode extension for Riverpod + `riverpod_generator` projects. Click on a provider usage — `viewFreshnessProvider`, `counterProvider`, whatever — and jump to the `class` or function you actually hand-wrote, even in files with several providers mixed together.

## Why this exists

With code generation, `fooProvider` isn't really defined where you wrote your `@riverpod` code — it's defined in the generated `foo.g.dart` file. VSCode's own navigation naturally lands you there, not in your source. That's a small but constant tax on every Riverpod codebase: dozens of little detours per day, through a file you're not supposed to touch.

Riverpod Wayfinder removes that detour. It reads the `.g.dart` file for you, figures out exactly which provider you clicked (even when the file groups several of them), and takes you to the real declaration.

## Features

- **`Ctrl+F12` / `Cmd+F12` (Go to Implementation)** — the main gesture. Jumps directly to the hand-written source, every time, no picker.
- **`Ctrl+Click` / `Cmd+Click` (Go to Definition)** — also offers the hand-written source as a candidate, alongside the Dart extension's own answer (the generated file). See [Why a picker?](#why-does-ctrlclick--cmdclick-show-a-picker-instead-of-jumping-directly) below.
- **`Ctrl+Alt+D` / `Cmd+Alt+D`** — manual command fallback, works from anywhere in the file.
- Correctly handles files with **multiple providers**, mixing class-based and function-based styles, in any order.
- Supports both `@riverpod class Foo extends _$Foo` and `@riverpod ReturnType foo(Ref ref)`.
- No filename convention required — matches by content, so `foo.providers.dart` / `foo.providers.g.dart` and plain `foo.dart` / `foo.g.dart` both work.
- No provider naming convention required either — works whether your generated identifiers end in `Provider`, `Controller`, or anything else your team uses, wherever `@riverpod` codegen itself works.
- Optional debug logging (`riverpod-wayfinder.enableLogging`) showing every resolution decision.

## Install

Not yet published to a marketplace — grab the `.vsix` from the [Releases](../../releases) page (or build it yourself, see [Development](#development)) and install it manually:

1. Open VSCode → Extensions view → `···` menu → **Install from VSIX...**
2. Pick the downloaded `riverpod-wayfinder-*.vsix` file

Or from the command line:

```bash
code --install-extension riverpod-wayfinder-0.1.1.vsix
```

## Usage

1. Place your cursor on (or select) a provider usage, e.g. `viewFreshnessProvider`
2. Jump to its declaration with any of:
   - **`Ctrl+F12`** (Windows/Linux) / **`Cmd+F12`** (Mac) — "Go to Implementation" — always lands directly on the source, no picker
   - **`Ctrl+Click`** / **`Cmd+Click`** (or `F12`) — "Go to Definition" — usually opens a picker with both the generated `.g.dart` location and the hand-written source; choose the one you want
   - **`Ctrl+Alt+D`** (Windows/Linux) / **`Cmd+Alt+D`** (Mac), or run **"Riverpod Wayfinder: Go to Provider Source"** from the Command Palette

### Example

A single grouped file with multiple providers, mixing styles — the exact case this extension exists for:

```dart
// In view_freshness.providers.dart
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // Ctrl+F12 on viewFreshnessScoreProvider jumps HERE, not to ViewFreshness

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // and viewFreshnessHistoryProvider jumps HERE
```

### Why does `Ctrl+Click` / `Cmd+Click` show a picker instead of jumping directly?

`Ctrl+Click` triggers VSCode's **Go to Definition**, which is aggregated across every extension that registers a `DefinitionProvider` for the `dart` language — including the official Dart extension, which resolves provider usages to the generated `.g.dart` file (that's genuinely where the symbol is defined). VSCode does not let one provider's result "win" by priority, order, or speed; when more than one location comes back, it shows a picker/peek list of all of them. Riverpod Wayfinder registers a `DefinitionProvider` too, so its answer (the hand-written source) shows up in that list next to Dart's — it does not, and cannot, override or suppress Dart's own contribution.

If you don't want to pick every time, use **Go to Implementation** (`Ctrl+F12` / `Cmd+F12`) instead — a separate gesture the Dart extension doesn't contribute to, so it's uncontested and always jumps straight to the hand-written source.

### How it works

1. Finds the `.g.dart` file that contains the clicked provider
2. Reads its `part of` statement to locate the hand-written `.dart` file
3. Identifies which `@ProviderFor(...)` annotation belongs to the *specific* provider you clicked (not just the first one in the file)
4. Jumps to the matching `class` or `@riverpod`-annotated function declaration

## Requirements

- VSCode 1.60.0+ (also works in VSCode-based editors like Cursor)
- The [Dart extension](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) (for `.g.dart` generation and everyday Dart support)

## Settings

| Setting | Default | Description |
|---|---|---|
| `riverpod-wayfinder.enableLogging` | `false` | Log every resolution decision (candidate `.g.dart` files checked, inferred class/function name, resolved target line) to the Debug Console. |

## Known issues

- Relies on the `.g.dart` file's `part of` statement to find the source file — unusual codegen setups may not resolve.
- Class/function name inference uses a casing heuristic (uppercase first letter → class, lowercase → function); hand-written code that breaks Dart naming conventions may not resolve correctly.

## Roadmap

This extension focuses on one thing — reliable navigation — but there's a lot more Riverpod friction that no existing extension addresses well yet: reverse "find all watch/read sites" for a provider, a workspace health-check command, dependency graphs, codegen-migration helpers, and more. See [ROADMAP.md](ROADMAP.md) for the running list of ideas — contributions and votes welcome.

## Development

```bash
npm install
npm run test:unit    # pure resolver unit tests, no editor required
npm run compile       # type-check, lint, bundle
npx @vscode/vsce package   # build an installable .vsix
```

For the full integration check (does `Ctrl+F12` actually jump correctly inside a real editor), open this folder in VSCode and press `F5` to launch an Extension Development Host, open a `.dart` file with generated providers, and try it — this step needs a human at the keyboard.

The resolution logic lives entirely in [`src/resolver.ts`](src/resolver.ts), with zero `vscode` imports — it's a pure function tested against realistic multi-provider fixtures in [`test/fixtures/`](test/fixtures/). [`src/extension.ts`](src/extension.ts) is a thin VSCode-facing wrapper.

## Contributing

Issues and pull requests are welcome — this is meant to be a genuinely community-owned tool. If you hit a case that doesn't resolve correctly, please include a minimal `.dart` + `.g.dart` pair that reproduces it; that's usually enough to turn into a regression test.

## Credits

This is a fork of [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider) — all credit for the original idea goes to [@shinriyo](https://github.com/shinriyo). This fork fixes the multi-provider resolution bugs, switches the primary gesture to `Go to Implementation` so it actually works reliably, and adds a `DefinitionProvider` alongside Dart's own so `Ctrl+Click` offers a choice instead of only ever going to the generated file.

## License

MIT — 100% free and open source, no strings attached. See [LICENSE](LICENSE).
