<div align="center">

# 🧭 Riverpod Wayfinder

**生成されたファイルではなく、あなたが実際に書いた Riverpod プロバイダーへ直接ジャンプ。**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.60.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

Riverpod + `riverpod_generator` プロジェクト向けの VSCode 拡張機能です。`viewFreshnessProvider` や `counterProvider` など、プロバイダーの使用箇所をクリックすると、複数のプロバイダーが混在するファイルであっても、実際に手書きした `class` や関数へジャンプします。

## なぜこの拡張機能が必要か

コード生成を使うと、`fooProvider` は実際には `@riverpod` コードを書いた場所ではなく、生成された `foo.g.dart` ファイルで定義されます。VSCode 標準のナビゲーションは自然とそちらへ案内してしまい、ソースコードには到達しません。これは Riverpod を使う全プロジェクトに課される小さくも継続的な負担で、触るべきでないファイルへの寄り道が毎日何十回も発生します。

Riverpod Wayfinder はこの寄り道をなくします。`.g.dart` ファイルを代わりに読み込み、クリックしたプロバイダーが（ファイルに複数まとまっていても）正確にどれかを特定し、本当の宣言箇所へ連れて行きます。

## 機能

- **`Ctrl+F12` / `Cmd+F12`（Go to Implementation）** — メインの操作方法。選択リストなしで、常に手書きのソースへ直接ジャンプします。
- **`Ctrl+Click` / `Cmd+Click`（Go to Definition）** — Dart 拡張機能自身の回答と並んで、手書きソースも候補として提示します。詳細は下記の[「なぜ選択リストが表示されるのか」](#なぜ-ctrlclick--cmdclick-は直接ジャンプせず選択リストを表示するのか)を参照してください。
- **`Ctrl+Alt+D` / `Cmd+Alt+D`** — 手動コマンドのフォールバック。ファイル内のどこからでも実行できます。
- クラスベースと関数ベースのスタイルが混在していても、**複数プロバイダー**を含むファイルを正しく処理します。
- `@riverpod class Foo extends _$Foo` と `@riverpod ReturnType foo(Ref ref)` の両方に対応。
- ファイル名の命名規則は不要 — 内容で一致を判定するため、`foo.providers.dart` / `foo.providers.g.dart` でも通常の `foo.dart` / `foo.g.dart` でも動作します。
- プロバイダーの命名規則も不要 — 生成される識別子が `Provider` で終わっても `Controller` で終わっても、チーム独自の命名でも、`@riverpod` によるコード生成が機能する場所であればどこでも動作します。
- 各解決ステップを表示するオプションのデバッグログ（`riverpod-wayfinder.enableLogging`）。

## インストール

まだマーケットプレイスには公開していません。[Releases](../../releases) ページから `.vsix` を取得するか、自分でビルドして（[開発](#開発)参照）手動でインストールしてください。

1. VSCode を開く → 拡張機能ビュー → `···` メニュー → **Install from VSIX...**
2. ダウンロードした `riverpod-wayfinder-*.vsix` ファイルを選択

またはコマンドラインから：

```bash
code --install-extension riverpod-wayfinder-0.1.1.vsix
```

## 使い方

1. プロバイダーの使用箇所（例：`viewFreshnessProvider`）にカーソルを置く（または選択する）
2. 以下のいずれかの方法で宣言へジャンプします：
   - **`Ctrl+F12`**（Windows/Linux）/ **`Cmd+F12`**（Mac）— "Go to Implementation" — 常に選択リストなしでソースへ直接到達
   - **`Ctrl+Click`** / **`Cmd+Click`**（または `F12`）— "Go to Definition" — 通常、生成された `.g.dart` の場所と手書きソースの両方を含む選択リストが開くので、好きな方を選択
   - **`Ctrl+Alt+D`**（Windows/Linux）/ **`Cmd+Alt+D`**（Mac）、またはコマンドパレットから **"Riverpod Wayfinder: Go to Provider Source"** を実行

### 例

複数のプロバイダーがスタイル混在でまとめられた1つのファイル — この拡張機能が存在する理由そのものです：

```dart
// view_freshness.providers.dart 内
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // viewFreshnessScoreProvider で Ctrl+F12 すると ViewFreshness ではなく、ここにジャンプ

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // viewFreshnessHistoryProvider ならここにジャンプ
```

### なぜ `Ctrl+Click` / `Cmd+Click` は直接ジャンプせず選択リストを表示するのか？

`Ctrl+Click` は VSCode の **Go to Definition** を起動しますが、これは `dart` 言語に対して `DefinitionProvider` を登録しているすべての拡張機能（生成された `.g.dart` ファイルへ解決する公式 Dart 拡張機能を含む）にまたがって集約されます（実際にシンボルが定義されているのはそこです）。VSCode は優先度・順序・速度によってどれか1つの提供者の結果を「勝たせる」ことはせず、複数の場所が返された場合は選択リスト/プレビューを表示します。Riverpod Wayfinder も `DefinitionProvider` を登録しているため、その回答（手書きソース）が Dart の回答と並んでリストに表示されます — Dart 自身の貢献を上書きしたり抑制したりすることはできませんし、そうしようともしていません。

毎回選びたくない場合は、代わりに **Go to Implementation**（`Ctrl+F12` / `Cmd+F12`）を使ってください — Dart 拡張機能が関与しない別の操作方法なので競合がなく、常に手書きソースへ直接ジャンプします。

### 仕組み

1. クリックされたプロバイダーを含む `.g.dart` ファイルを見つける
2. `part of` 文を読んで手書きの `.dart` ファイルを特定する
3. クリックした**その特定の**プロバイダーに対応する `@ProviderFor(...)` アノテーションを識別する（ファイル内の最初のものだけではない）
4. 対応する `class` または `@riverpod` アノテーション付きの関数宣言へジャンプする

## 必要条件

- VSCode 1.60.0 以上（Cursor など VSCode ベースのエディタでも動作）
- [Dart 拡張機能](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code)（`.g.dart` の生成と日常的な Dart サポートのため）

## 設定

| 設定 | デフォルト | 説明 |
|---|---|---|
| `riverpod-wayfinder.enableLogging` | `false` | 各解決ステップ（確認した候補 `.g.dart` ファイル、推測されたクラス/関数名、解決された対象行）をデバッグコンソールに記録します。 |

## 既知の問題

- ソースファイルを見つけるために `.g.dart` ファイルの `part of` 文に依存しています — 特殊なコード生成設定では解決できない場合があります。
- クラス/関数名の推測には大文字小文字のヒューリスティック（先頭が大文字ならクラス、小文字なら関数）を使用しています。Dart の命名規則に従わないコードは正しく解決されない場合があります。

## ロードマップ

この拡張機能は「信頼できるナビゲーション」という1つのことに集中していますが、既存の拡張機能ではまだうまくカバーされていない Riverpod の摩擦は他にもたくさんあります：プロバイダーの逆引き検索、プロジェクトの健全性チェックコマンド、依存関係グラフ、コード生成移行の支援などです。アイデアの一覧は [ROADMAP.md](ROADMAP.md) を参照してください — コントリビューションや投票を歓迎します。

## 開発

```bash
npm install
npm run test:unit    # エディタ不要の純粋な resolver ユニットテスト
npm run compile       # 型チェック、lint、バンドル
npx @vscode/vsce package   # インストール可能な .vsix をビルド
```

完全な統合チェック（実際のエディタで `Ctrl+F12` が正しくジャンプするか）を行うには、このフォルダを VSCode で開き `F5` を押して Extension Development Host を起動し、生成されたプロバイダーを含む `.dart` ファイルを開いて試してください — このステップは人の手が必要です。

解決ロジックはすべて [`src/resolver.ts`](src/resolver.ts) にあり、`vscode` のインポートは一切ありません — [`test/fixtures/`](test/fixtures/) 内の現実的な複数プロバイダーのフィクスチャに対してテストされた純粋関数です。[`src/extension.ts`](src/extension.ts) は VSCode 側の薄いラッパーです。

## コントリビューション

Issue や Pull Request を歓迎します — これは本当にコミュニティが所有するツールを目指しています。正しく解決できないケースに遭遇した場合は、それを再現できる最小限の `.dart` + `.g.dart` のペアを含めてください。通常それだけで回帰テストにできます。

## クレジット

これは [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider) のフォークです — オリジナルのアイデアのクレジットはすべて [@shinriyo](https://github.com/shinriyo) 氏にあります。このフォークでは複数プロバイダー解決のバグを修正し、実際に確実に動作するようメインの操作方法を `Go to Implementation` に切り替え、`Ctrl+Click` が常に生成ファイルへ行くのではなく選択肢を提示するよう、Dart のものと並んで `DefinitionProvider` を追加しています。

## ライセンス

MIT — 100% 無料・オープンソース、対価なし。[LICENSE](LICENSE) を参照してください。
