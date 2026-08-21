# Roadmap / Ideas

Riverpod Wayfinder currently does one thing well: reliable navigation from a provider usage to its hand-written source. This document tracks other Riverpod friction points that, as far as we can tell, aren't well covered by the existing tooling ecosystem (`riverpod_lint`, snippet packs, architecture generators, codegen-watch wrappers). Contributions, PRs, and "actually, X already does this" corrections are all welcome — please open an issue.

## What's already covered elsewhere (so we don't duplicate it)

- **Boilerplate snippets** for providers/notifiers/consumers — several extensions do this well (e.g. Flutter Riverpod Snippets, Riverpod Snippets).
- **Clean-architecture scaffolding** (generate feature folders/layers) — several dedicated generator extensions exist.
- **Static analysis / lint rules** (misused `ref`, provider dependency issues, functional vs class providers, scoped providers, etc.) — this is `riverpod_lint` via `custom_lint`, surfaced through the Dart analyzer itself. If you don't have it running, turn it on before reaching for a third-party extension — a lot of "gotchas" are already caught there.
- **`build_runner` watch convenience** — a couple of extensions wrap `dart run build_runner watch` with a status bar toggle.

## Ideas not covered yet

### Navigation & code intelligence (natural extensions of what this tool already does)

- **CodeLens above provider declarations**: an inline "3 watch · 1 read · 1 listen" summary above each `@riverpod` declaration, clickable to jump straight to those call sites — the Riverpod-aware equivalent of the built-in "N references" CodeLens that codegen breaks.
- **"Riverpod Doctor" workspace audit command**: a single command that scans the whole project and reports, in the Problems panel, things like orphaned `.g.dart` files (no matching source), missing `part` directives, duplicate provider names across files, and `.g.dart` files that are older than their source (stale codegen — you forgot to rerun `build_runner`).
- **Convert to `ConsumerWidget` / "Wrap with Consumer" refactor**: an AST-aware code action that turns a `StatelessWidget` into a `ConsumerWidget` (base class, `ref` parameter, imports) or wraps a widget subtree in a `Consumer`, more robust than a static snippet since it operates on your actual code.

### Understanding runtime behavior (bigger lift, high value)

- **Provider dependency graph**: a visual graph (e.g. rendered as Mermaid in a webview) of which providers `ref.watch` which others, to reason about rebuild cascades before they cause a performance problem.
- **"What rebuilds if I change this?" hover/CodeLens**: transitive watchers of a given provider, surfaced inline instead of requiring manual tracing.
- **Live provider state inspector inside VSCode**: today this requires the separate Riverpod DevTools panel in the browser; embedding a lightweight live view (current value per active provider, updating during a debug session) directly in the editor sidebar would remove a real context-switch.

### Migration & maintenance

- **Legacy-to-codegen migration assistant**: a codemod that helps convert hand-written `final fooProvider = Provider((ref) => ...)` / `StateNotifierProvider` declarations into `@riverpod`-annotated classes/functions. Riverpod's v1→v2 codegen migration is a commonly cited pain point and largely a manual, repetitive process today.
- **Rename-aware refactor**: renaming a provider's underlying class/function (F2) doesn't currently prompt you to rerun `build_runner`, and the generated file silently goes stale until you do. A rename hook that reminds you (or triggers the watcher) would close a real gap.
- **Test-scaffold generator scoped to a specific provider**: right-click a provider → generate a `ProviderContainer`/`ProviderScope` test file pre-filled with the correct type and an `overrides: [...]` stub for its actual dependencies (introspected, not a generic snippet).

## Prioritization (rough)

1. "Riverpod Doctor" audit command — high value, no runtime/debug-adapter complexity.
2. CodeLens usage counts — nice UX layer on top of the reverse-lookup resolver (now shipped, see [CHANGELOG.md](CHANGELOG.md)).
3. Convert-to-ConsumerWidget refactor — self-contained, doesn't depend on the others.
4. Dependency graph / live state inspector — most valuable long-term, but a much bigger investment (webview, possibly a VM service / debug adapter connection).
5. Migration assistant — valuable but scope-heavy; probably worth its own separate tool rather than a Wayfinder feature.

Have an opinion on ordering, or a pain point not listed here? Open an issue.
