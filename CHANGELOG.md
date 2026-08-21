# Change Log

All notable changes to the "Riverpod Wayfinder" extension (formerly "riverpod-jump-to-provider") will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Added

- Fixture and unit test proving resolution works with a completely arbitrary, made-up suffix (`widgetToto`, ending in `"Toto"`) — not just `"Provider"` or `"Controller"` — confirming no suffix is hardcoded anywhere in the resolver.
- Fixtures and unit tests validating **family (parameterized) providers**, both function-based (`@riverpod Future<String> weather(Ref ref, {required String city})`) and class-based (`@riverpod class CityForecast extends _$CityForecast { build(String city) }`). Family providers generate a different shape (`const xProvider = XFamily();` pointing at a wrapper class, instead of the plain `final xProvider = ...Provider<...>.internal(...)`) - confirmed working without any special-casing, plus a regression test guarding against the generated `XFamily`/`XProvider` wrapper class names being confused with the real (differently-cased) provider constant.

## [0.2.2]

### Fixed

- **`findFiles('**/*.g.dart')` was silently returning zero results in any workspace that excludes `.g.dart` from `files.exclude`** (a common setup for generated Dart files, including this project's own `.vscode/settings.json`). VSCode's `findFiles` applies the workspace's default excludes unless told otherwise, so the extension found no `.g.dart` files, and `jumpToRiverpodOrigin` silently returned `null` everywhere - no error, no log, just "go to definition" doing nothing. Fixed by passing `null` as the second argument to disable default excludes.

## [0.2.1]

### Changed

- **Removed the hardcoded `"Provider"` naming-convention requirement.** Previously a clicked word had to literally end in `Provider` before resolution was even attempted, which silently broke for codebases with a different generated-identifier convention (e.g. suffixing with `Controller`). Resolution is now based purely on whether the word is actually declared (`final <word> = ...`) in a `.g.dart` file backed by an `@ProviderFor(...)` annotation - it works for any naming convention your team's `@riverpod` codegen actually produces.
- Tightened `.g.dart` candidate matching from a loose substring check to a word-boundary declaration match, fixing a latent false-positive risk (e.g. clicking `viewFreshness` no longer coincidentally matches inside `viewFreshnessProvider`).

### Added

- Unit tests and a new fixture (`test/fixtures/lib/auth_controller.*`) covering a provider whose generated identifier does not end in `Provider` at all.

## [0.2.0]

### Changed

- **Renamed the project to Riverpod Wayfinder** (`riverpod-jump-to-provider` → `riverpod-wayfinder`). New extension ID, new command ID (`riverpod-wayfinder.goToDefinition`), new settings namespace (`riverpod-wayfinder.enableLogging`). If you had the old extension installed, uninstall it and install this one — VSCode treats them as different extensions.
- Command title changed to "Riverpod Wayfinder: Go to Provider Source" for clarity in the Command Palette.
- Finished the project for a first real, standalone release: full rewritten README, all language translations refreshed to match, dual-attribution MIT license (original author + this fork), and a public [ROADMAP.md](ROADMAP.md).

## [0.1.1]

### Added

- Re-registered a `DefinitionProvider` for `Ctrl+Click` / `Cmd+Click` / `F12`, alongside the `Ctrl+F12` `ImplementationProvider` added in 0.1.0. This does not try to override or out-race the Dart extension's own definition provider (still not possible, still not the goal) — it adds this extension's answer as an additional candidate. Since VSCode shows a picker/peek list when more than one `DefinitionProvider` returns a location, `Ctrl+Click` now typically offers a choice between the generated `.g.dart` location (Dart's answer) and the hand-written source (this extension's answer), instead of only ever showing Dart's. `Ctrl+F12` remains the direct, picker-free way to always land on the source.

## [0.1.0]

### Changed

- **Primary jump gesture switched from `Ctrl+Click` (Go to Definition) to `Ctrl+F12` / `Cmd+F12` (Go to Implementation).** VSCode aggregates every `DefinitionProvider` registered for the `dart` language, including the official Dart extension's, which resolves to the generated `.g.dart` file. There is no supported way to make one provider's result win over another's on the same gesture, so this extension's `Go to Definition` contribution was effectively dead on arrival for most users. `Go to Implementation` is a separate, uncontested gesture, so registering an `ImplementationProvider` for it makes the jump reliable. `Ctrl+Click` / `Cmd+Click` is intentionally left alone and continues to follow Dart's own tooling.
- Replaced the old `Cmd+Shift+P` keybinding (which collided with VSCode's built-in Command Palette shortcut on every platform) with `Ctrl+Alt+D` / `Cmd+Alt+D` for the manual "Go to Riverpod Declaration" fallback command.

### Fixed

- Multi-provider files now resolve correctly. Previously, matching a provider usage against a `.g.dart` file always grabbed the *first* `@ProviderFor(...)` annotation in that file, and jumping in the source `.dart` file always stopped at the *first* `@riverpod` annotation — both wrong whenever a file declared more than one provider (a common pattern, e.g. grouped `foo.providers.dart` files). Both lookups are now scoped to the specific provider that was clicked, regardless of how many other providers are declared earlier or later in the same file.
- `riverpod-jump-to-provider.enableLogging` is now actually declared as a setting in `package.json` and gates all debug logging; previously it was documented in the README but never registered or checked, so logging always ran unconditionally.

### Added

- Function-based providers (`@riverpod ReturnType name(Ref ref)`) are now handled explicitly alongside class-based providers (`@riverpod class Name extends _$Name`), including when both styles are mixed in the same file.
- `npm run test:unit`: a pure, VSCode-free unit test suite (Node's built-in test runner) covering the resolution logic against realistic multi-provider fixtures under `test/fixtures/`.

### Internal

- Extracted all jump-resolution logic out of the VSCode `DefinitionProvider`/`ImplementationProvider` callback and into a standalone module, `src/resolver.ts`, with no `vscode` imports. `src/extension.ts` is now a thin wrapper that gathers `.g.dart` candidates from the workspace and delegates to `resolveProviderTarget`.

## [0.0.3]

- Added support for jumping to provider implementation (function definition) instead of class definition
- Improved focus behavior after jumping to the target location

## [0.0.2]

- Lowered the minimum VSCode version requirement from 1.99.0 to 1.60.0 for better compatibility with Cursor and other VSCode-based editors

## [0.0.1]

- Initial release
