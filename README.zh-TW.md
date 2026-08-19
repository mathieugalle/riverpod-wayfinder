<div align="center">

# 🧭 Riverpod Wayfinder

**直接跳轉到你真正撰寫的 Riverpod provider —— 而不是產生的檔案。**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.60.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

一個為 Riverpod + `riverpod_generator` 專案打造的 VSCode 擴充功能。點擊一個 provider 的使用位置——`viewFreshnessProvider`、`counterProvider`，都可以——即可跳轉到你真正手寫的 `class` 或函式，即使該檔案混合了多個 provider 也一樣。

## 為什麼需要這個擴充功能

使用程式碼產生時，`fooProvider` 實際上並不是定義在你撰寫 `@riverpod` 程式碼的地方，而是定義在產生的 `foo.g.dart` 檔案中。VSCode 內建的導覽自然會帶你到那裡，而不是你的原始碼。這是每個 Riverpod 程式碼庫都要承受的一種微小但持續的負擔——每天都要繞路走進幾十次一個你本來不該碰的檔案。

Riverpod Wayfinder 消除了這個繞路。它替你讀取 `.g.dart` 檔案，準確判斷你點擊的究竟是哪一個 provider（即使檔案裡聚合了好幾個），然後帶你到真正的宣告處。

## 功能

- **`Ctrl+F12` / `Cmd+F12`（Go to Implementation）**——主要操作方式。不會跳出選擇清單，每次都直接跳轉到手寫原始碼。
- **`Ctrl+Click` / `Cmd+Click`（Go to Definition）**——同時把手寫原始碼作為候選項之一，與 Dart 擴充功能自身的答案並列顯示。詳見下方[「為什麼會跳出選擇清單？」](#為什麼-ctrlclick--cmdclick-會顯示選擇清單而不是直接跳轉)。
- **`Ctrl+Alt+D` / `Cmd+Alt+D`**——手動指令備用方案，在檔案任意位置都可使用。
- 正確處理包含**多個 provider**、且類別風格與函式風格混合的檔案，順序不拘。
- 同時支援 `@riverpod class Foo extends _$Foo` 與 `@riverpod ReturnType foo(Ref ref)`。
- 不需要遵循檔案命名慣例——依內容比對，因此 `foo.providers.dart` / `foo.providers.g.dart` 與一般的 `foo.dart` / `foo.g.dart` 都能正常運作。
- 也不需要遵循 provider 命名慣例——無論產生的識別碼以 `Provider`、`Controller` 結尾，或是團隊自訂的任何後綴，只要 `@riverpod` 程式碼產生本身能運作的地方，它就能運作。
- 可選的除錯記錄（`riverpod-wayfinder.enableLogging`），顯示每一步解析決策。

## 安裝

尚未發布到任何應用程式市集——請從 [Releases](../../releases) 頁面取得 `.vsix`，或自行建置（見[開發](#開發)），然後手動安裝：

1. 開啟 VSCode → 擴充功能檢視 → `···` 選單 → **Install from VSIX...**
2. 選擇下載好的 `riverpod-wayfinder-*.vsix` 檔案

或透過命令列：

```bash
code --install-extension riverpod-wayfinder-0.1.1.vsix
```

## 使用方法

1. 將游標放在（或選取）一個 provider 使用位置，例如 `viewFreshnessProvider`
2. 使用以下任一方法跳轉到其宣告：
   - **`Ctrl+F12`**（Windows/Linux）/ **`Cmd+F12`**（Mac）——"Go to Implementation"——永遠不會跳出選擇清單，直接到達原始碼
   - **`Ctrl+Click`** / **`Cmd+Click`**（或 `F12`）——"Go to Definition"——通常會跳出一個包含產生的 `.g.dart` 位置與手寫原始碼的選擇清單，選擇你想要的那一個
   - **`Ctrl+Alt+D`**（Windows/Linux）/ **`Cmd+Alt+D`**（Mac），或從命令選擇區執行 **"Riverpod Wayfinder: Go to Provider Source"**

### 範例

一個檔案中混合了多個不同風格的 provider——這正是這個擴充功能存在的意義：

```dart
// 在 view_freshness.providers.dart 中
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // 在 viewFreshnessScoreProvider 上按 Ctrl+F12 會跳到這裡，而不是 ViewFreshness

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // viewFreshnessHistoryProvider 則跳到這裡
```

### 為什麼 `Ctrl+Click` / `Cmd+Click` 會顯示選擇清單而不是直接跳轉？

`Ctrl+Click` 觸發的是 VSCode 的 **Go to Definition**，它會彙整所有為 `dart` 語言註冊了 `DefinitionProvider` 的擴充功能的結果——包括官方 Dart 擴充功能，它會解析到產生的 `.g.dart` 檔案（那裡確實是符號真正定義的地方）。VSCode 不會依優先順序、註冊順序或速度讓某一個 provider 的結果「獲勝」；當回傳多個位置時，它會顯示一個選擇／預覽清單。Riverpod Wayfinder 也註冊了一個 `DefinitionProvider`，因此它的答案（手寫原始碼）會與 Dart 的答案一起出現在清單中——它不會、也無法覆蓋或隱藏 Dart 自身的貢獻。

如果你不想每次都要選擇，可以改用 **Go to Implementation**（`Ctrl+F12` / `Cmd+F12`）——這是一個 Dart 擴充功能沒有介入的獨立手勢，因此不存在競爭，總是直接跳轉到手寫原始碼。

### 運作原理

1. 找到包含所點擊 provider 的 `.g.dart` 檔案
2. 讀取其 `part of` 陳述式以定位手寫的 `.dart` 檔案
3. 識別與你點擊的**那一個特定** provider 對應的 `@ProviderFor(...)` 註解（而不僅僅是檔案中的第一個）
4. 跳轉到相符的 `class` 或帶 `@riverpod` 註解的函式宣告

## 系統需求

- VSCode 1.60.0 以上（也適用於 Cursor 等基於 VSCode 的編輯器）
- [Dart 擴充功能](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code)（用於 `.g.dart` 產生及日常 Dart 支援）

## 設定

| 設定項 | 預設值 | 說明 |
|---|---|---|
| `riverpod-wayfinder.enableLogging` | `false` | 將每一步解析決策（檢查過的候選 `.g.dart` 檔案、推斷出的類別／函式名稱、解析出的目標行）記錄到偵錯主控台。 |

## 已知問題

- 依賴 `.g.dart` 檔案中的 `part of` 陳述式來找到原始碼檔案——不尋常的程式碼產生設定可能無法解析。
- 類別／函式名稱推斷使用大小寫啟發式規則（首字母大寫→類別，小寫→函式）；不遵循 Dart 命名慣例的手寫程式碼可能無法正確解析。

## 路線圖

這個擴充功能專注於一件事——可靠的導覽——但 Riverpod 還有許多摩擦點，目前沒有任何擴充功能很好地解決：provider 使用位置的反向查詢、工作區健康檢查指令、依賴關係圖、程式碼產生遷移輔助工具等等。完整的構想清單見 [ROADMAP.md](ROADMAP.md)——歡迎貢獻與投票。

## 開發

```bash
npm install
npm run test:unit    # 純粹的 resolver 單元測試，不需要編輯器
npm run compile       # 型別檢查、lint、打包
npx @vscode/vsce package   # 建置可安裝的 .vsix
```

要進行完整的整合檢查（`Ctrl+F12` 在真實編輯器中是否真的能正確跳轉），請在 VSCode 中開啟此資料夾並按 `F5` 啟動 Extension Development Host，開啟一個包含產生 provider 的 `.dart` 檔案並測試——這一步需要人工操作。

所有解析邏輯都位於 [`src/resolver.ts`](src/resolver.ts)，完全沒有 `vscode` 匯入——它是一個針對 [`test/fixtures/`](test/fixtures/) 中真實的多 provider 測試案例進行測試的純函式。[`src/extension.ts`](src/extension.ts) 只是一個面向 VSCode 的薄封裝層。

## 貢獻

歡迎提交 Issue 與 Pull Request——本專案致力於成為真正由社群擁有的工具。如果你遇到無法正確解析的情況，請附上一組能重現問題的最小 `.dart` + `.g.dart` 檔案；通常這樣就足以轉化為一個回歸測試。

## 致謝

本專案 fork 自 [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider)——原始創意的所有功勞歸於 [@shinriyo](https://github.com/shinriyo)。本 fork 修正了多 provider 解析的錯誤，將主要操作方式切換為 `Go to Implementation` 以確保真正可靠地運作，並在 Dart 自身的 `DefinitionProvider` 旁新增了一個，讓 `Ctrl+Click` 能提供選擇，而不是永遠只跳到產生的檔案。

## 授權

MIT ——100% 免費開源，無任何附加條件。詳見 [LICENSE](LICENSE)。
