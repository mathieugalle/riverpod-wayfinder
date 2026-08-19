<div align="center">

# 🧭 Riverpod Wayfinder

**直接跳转到你真正编写的 Riverpod provider —— 而不是生成的文件。**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.60.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

一个面向 Riverpod + `riverpod_generator` 项目的 VSCode 扩展。点击一个 provider 的使用位置——`viewFreshnessProvider`、`counterProvider`，什么都行——即可跳转到你真正手写的 `class` 或函数，即使该文件混合了多个 provider 也不例外。

## 为什么需要这个扩展

使用代码生成时，`fooProvider` 实际上并不是定义在你编写 `@riverpod` 代码的地方，而是定义在生成的 `foo.g.dart` 文件中。VSCode 自带的导航自然会把你带到那里，而不是你的源代码。这是每个 Riverpod 代码库都要承受的一个小而持续的负担——每天都要绕道走进几十次一个你本不该碰的文件。

Riverpod Wayfinder 消除了这个绕路。它替你读取 `.g.dart` 文件，准确判断你点击的到底是哪个 provider（即使文件里聚合了好几个），然后带你到真正的声明处。

## 功能

- **`Ctrl+F12` / `Cmd+F12`（Go to Implementation）**——主要操作方式。不弹出选择列表，每次都直接跳转到手写源代码。
- **`Ctrl+Click` / `Cmd+Click`（Go to Definition）**——同时把手写源代码作为候选项之一，与 Dart 扩展自身的答案并列显示。详见下方[「为什么会弹出选择列表？」](#为什么-ctrlclick--cmdclick-会显示选择列表而不是直接跳转)。
- **`Ctrl+Alt+D` / `Cmd+Alt+D`**——手动命令备用方案，在文件任意位置都可使用。
- 正确处理包含**多个 provider**、且类风格与函数风格混合的文件，顺序不限。
- 同时支持 `@riverpod class Foo extends _$Foo` 和 `@riverpod ReturnType foo(Ref ref)`。
- 无需遵循文件命名约定——按内容匹配，因此 `foo.providers.dart` / `foo.providers.g.dart` 和普通的 `foo.dart` / `foo.g.dart` 都能正常工作。
- 也无需遵循 provider 命名约定——无论生成的标识符以 `Provider`、`Controller` 结尾，还是你团队自定义的任何后缀，只要 `@riverpod` 代码生成本身能工作的地方，它就能工作。
- 可选的调试日志（`riverpod-wayfinder.enableLogging`），显示每一步解析决策。

## 安装

尚未发布到任何应用市场——请从 [Releases](../../releases) 页面获取 `.vsix`，或自行构建（见[开发](#开发)），然后手动安装：

1. 打开 VSCode → 扩展视图 → `···` 菜单 → **Install from VSIX...**
2. 选择下载好的 `riverpod-wayfinder-*.vsix` 文件

或通过命令行：

```bash
code --install-extension riverpod-wayfinder-0.1.1.vsix
```

## 使用方法

1. 将光标放在（或选中）一个 provider 使用位置，例如 `viewFreshnessProvider`
2. 使用以下任一方法跳转到其定义：
   - **`Ctrl+F12`**（Windows/Linux）/ **`Cmd+F12`**（Mac）——"Go to Implementation"——始终不弹出选择列表，直接到达源代码
   - **`Ctrl+Click`** / **`Cmd+Click`**（或 `F12`）——"Go to Definition"——通常会弹出一个包含生成的 `.g.dart` 位置和手写源代码的选择列表，选择你想要的那个
   - **`Ctrl+Alt+D`**（Windows/Linux）/ **`Cmd+Alt+D`**（Mac），或从命令面板运行 **"Riverpod Wayfinder: Go to Provider Source"**

### 示例

一个文件中混合了多个不同风格的 provider——这正是该扩展存在的意义：

```dart
// 在 view_freshness.providers.dart 中
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // 在 viewFreshnessScoreProvider 上按 Ctrl+F12 会跳到这里，而不是 ViewFreshness

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // viewFreshnessHistoryProvider 则跳到这里
```

### 为什么 `Ctrl+Click` / `Cmd+Click` 会显示选择列表而不是直接跳转？

`Ctrl+Click` 触发的是 VSCode 的 **Go to Definition**，它会汇总所有为 `dart` 语言注册了 `DefinitionProvider` 的扩展的结果——包括官方 Dart 扩展，它会解析到生成的 `.g.dart` 文件（那里确实是符号真正定义的地方）。VSCode 不会按优先级、注册顺序或速度让某一个 provider 的结果"获胜"；当返回多个位置时，它会显示一个选择/预览列表。Riverpod Wayfinder 也注册了一个 `DefinitionProvider`，因此它的答案（手写源代码）会与 Dart 的答案一起出现在列表中——它不会、也无法覆盖或屏蔽 Dart 自身的贡献。

如果你不想每次都要选择，可以改用 **Go to Implementation**（`Ctrl+F12` / `Cmd+F12`）——这是一个 Dart 扩展没有介入的独立手势，因此不存在竞争，总是直接跳转到手写源代码。

### 工作原理

1. 找到包含所点击 provider 的 `.g.dart` 文件
2. 读取其 `part of` 语句以定位手写的 `.dart` 文件
3. 识别与你点击的**那一个特定** provider 对应的 `@ProviderFor(...)` 注解（而不仅仅是文件中的第一个）
4. 跳转到匹配的 `class` 或带 `@riverpod` 注解的函数声明

## 环境要求

- VSCode 1.60.0 及以上（也适用于 Cursor 等基于 VSCode 的编辑器）
- [Dart 扩展](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code)（用于 `.g.dart` 生成及日常 Dart 支持）

## 设置

| 设置项 | 默认值 | 说明 |
|---|---|---|
| `riverpod-wayfinder.enableLogging` | `false` | 将每一步解析决策（检查过的候选 `.g.dart` 文件、推断出的类/函数名、解析出的目标行）记录到调试控制台。 |

## 已知问题

- 依赖 `.g.dart` 文件中的 `part of` 语句来找到源文件——不寻常的代码生成配置可能无法解析。
- 类/函数名推断使用大小写启发式规则（首字母大写→类，小写→函数）；不遵循 Dart 命名约定的手写代码可能无法正确解析。

## 路线图

这个扩展专注于一件事——可靠的导航——但 Riverpod 还有很多摩擦点，目前没有任何扩展很好地解决：provider 使用位置的反向查找、工作区健康检查命令、依赖关系图、代码生成迁移辅助工具等等。完整的想法列表见 [ROADMAP.md](ROADMAP.md)——欢迎贡献和投票。

## 开发

```bash
npm install
npm run test:unit    # 纯粹的 resolver 单元测试，无需编辑器
npm run compile       # 类型检查、lint、打包
npx @vscode/vsce package   # 构建可安装的 .vsix
```

要进行完整的集成检查（`Ctrl+F12` 在真实编辑器中是否真的能正确跳转），请在 VSCode 中打开此文件夹并按 `F5` 启动 Extension Development Host，打开一个包含生成 provider 的 `.dart` 文件并进行测试——这一步需要人工操作。

所有解析逻辑都位于 [`src/resolver.ts`](src/resolver.ts)，完全没有 `vscode` 导入——它是一个针对 [`test/fixtures/`](test/fixtures/) 中真实的多 provider 测试用例进行测试的纯函数。[`src/extension.ts`](src/extension.ts) 只是一个面向 VSCode 的薄封装层。

## 贡献

欢迎提交 Issue 和 Pull Request——本项目致力于成为真正由社区拥有的工具。如果你遇到无法正确解析的情况，请附上一对能复现问题的最小 `.dart` + `.g.dart` 文件；通常这就足以转化为一个回归测试。

## 致谢

本项目 fork 自 [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider)——原始创意的所有功劳归于 [@shinriyo](https://github.com/shinriyo)。本 fork 修复了多 provider 解析的 bug，将主要操作方式切换为 `Go to Implementation` 以确保真正可靠地工作，并在 Dart 自身的 `DefinitionProvider` 旁边新增了一个，使 `Ctrl+Click` 能提供选择，而不是永远只跳到生成文件。

## 许可证

MIT ——100% 免费开源，无任何附加条件。详见 [LICENSE](LICENSE)。
