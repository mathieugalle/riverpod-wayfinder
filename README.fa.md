<div align="center">

# 🧭 Riverpod Wayfinder

**مستقیم به provider واقعی Riverpod که خودتان نوشته‌اید بروید — نه فایل تولیدشده.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.60.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

یک افزونه VSCode برای پروژه‌های Riverpod + `riverpod_generator`. روی محل استفاده یک provider کلیک کنید — `viewFreshnessProvider`، `counterProvider`، هرچه باشد — و به `class` یا تابعی که واقعاً خودتان نوشته‌اید بروید، حتی در فایل‌هایی که چند provider را در کنار هم دارند.

## چرا این افزونه وجود دارد

با تولید کد، `fooProvider` در واقع در جایی که کد `@riverpod` را نوشته‌اید تعریف نشده — بلکه در فایل تولیدشده‌ی `foo.g.dart` تعریف شده است. ناوبری پیش‌فرض VSCode به‌طور طبیعی شما را به آنجا می‌برد، نه به کد اصلی‌تان. این یک هزینه‌ی کوچک اما دائمی برای هر پروژه‌ی Riverpod است: ده‌ها انحراف مسیر در روز، از میان فایلی که قرار نیست به آن دست بزنید.

Riverpod Wayfinder این انحراف را حذف می‌کند. به‌جای شما فایل `.g.dart` را می‌خواند، دقیقاً مشخص می‌کند کدام provider را کلیک کرده‌اید (حتی وقتی فایل چند provider را در خود جای داده)، و شما را به تعریف واقعی می‌برد.

## ویژگی‌ها

- **`Ctrl+F12` / `Cmd+F12` (Go to Implementation)** — روش اصلی. همیشه بدون هیچ فهرست انتخابی، مستقیم به کد اصلی نوشته‌شده می‌رود.
- **`Ctrl+Click` / `Cmd+Click` (Go to Definition)** — کد اصلی را نیز به‌عنوان یک گزینه، در کنار پاسخ خود افزونه‌ی Dart، پیشنهاد می‌دهد. برای جزئیات به [چرا فهرست انتخابی نمایش داده می‌شود؟](#چرا-ctrlclick--cmdclick-به‌جای-پرش-مستقیم-فهرست-انتخابی-نشان-می‌دهد) در پایین مراجعه کنید.
- **`Ctrl+Alt+D` / `Cmd+Alt+D`** — دستور دستی جایگزین، از هر جای فایل قابل استفاده است.
- فایل‌های دارای **چند provider**، با ترکیب سبک کلاس و تابع، در هر ترتیبی را به‌درستی پردازش می‌کند.
- از هر دو حالت `@riverpod class Foo extends _$Foo` و `@riverpod ReturnType foo(Ref ref)` پشتیبانی می‌کند.
- نیازی به قرارداد نام‌گذاری فایل نیست — تطبیق بر اساس محتوا انجام می‌شود، پس هم `foo.providers.dart` / `foo.providers.g.dart` و هم `foo.dart` / `foo.g.dart` معمولی کار می‌کنند.
- نیازی به قرارداد نام‌گذاری provider هم نیست — چه شناسه‌های تولیدشده با `Provider` تمام شوند، چه با `Controller`، یا هر پسوند دیگری که تیم شما استفاده می‌کند، هرجا که خود تولید کد `@riverpod` کار کند، این افزونه هم کار می‌کند.
- ثبت رویداد اختیاری برای اشکال‌زدایی (`riverpod-wayfinder.enableLogging`) که هر تصمیم تحلیل را نشان می‌دهد.

## نصب

هنوز در هیچ مارکت‌پلیسی منتشر نشده — فایل `.vsix` را از صفحه‌ی [Releases](../../releases) بگیرید (یا خودتان بسازید، به بخش [توسعه](#توسعه) مراجعه کنید) و به‌صورت دستی نصب کنید:

۱. VSCode را باز کنید → نمای Extensions → منوی `···` → **Install from VSIX...**
۲. فایل دانلودشده‌ی `riverpod-wayfinder-*.vsix` را انتخاب کنید

یا از خط فرمان:

```bash
code --install-extension riverpod-wayfinder-0.1.1.vsix
```

## نحوه استفاده

۱. مکان‌نما را روی محل استفاده‌ی یک provider قرار دهید (یا آن را انتخاب کنید)، مثلاً `viewFreshnessProvider`
۲. با یکی از روش‌های زیر به تعریف آن بروید:
   - **`Ctrl+F12`** (ویندوز/لینوکس) / **`Cmd+F12`** (مک) — "Go to Implementation" — همیشه بدون فهرست انتخابی مستقیم به کد اصلی می‌رسد
   - **`Ctrl+Click`** / **`Cmd+Click`** (یا `F12`) — "Go to Definition" — معمولاً فهرستی شامل هم مکان `.g.dart` تولیدشده و هم کد اصلی باز می‌شود؛ گزینه‌ی موردنظر را انتخاب کنید
   - **`Ctrl+Alt+D`** (ویندوز/لینوکس) / **`Cmd+Alt+D`** (مک)، یا اجرای **"Riverpod Wayfinder: Go to Provider Source"** از Command Palette

### مثال

یک فایل با چند provider که سبک‌های مختلف را ترکیب کرده — دقیقاً همان موردی که این افزونه برای آن ساخته شده:

```dart
// در view_freshness.providers.dart
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // Ctrl+F12 روی viewFreshnessScoreProvider به اینجا می‌پرد، نه به ViewFreshness

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // و viewFreshnessHistoryProvider به اینجا می‌پرد
```

### چرا `Ctrl+Click` / `Cmd+Click` به‌جای پرش مستقیم فهرست انتخابی نشان می‌دهد؟

`Ctrl+Click` قابلیت **Go to Definition** در VSCode را فعال می‌کند که میان تمام افزونه‌هایی که برای زبان `dart` یک `DefinitionProvider` ثبت کرده‌اند تجمیع می‌شود — از جمله افزونه‌ی رسمی Dart، که محل استفاده‌ی provider را به فایل تولیدشده‌ی `.g.dart` حل می‌کند (که واقعاً همان‌جاست که نماد تعریف شده است). VSCode اجازه نمی‌دهد پاسخ یک provider بر اساس اولویت، ترتیب یا سرعت "برنده" شود؛ وقتی بیش از یک مکان بازگردانده شود، فهرستی برای انتخاب/پیش‌نمایش نمایش می‌دهد. Riverpod Wayfinder نیز یک `DefinitionProvider` ثبت می‌کند، پس پاسخ آن (کد اصلی نوشته‌شده) در کنار پاسخ Dart در آن فهرست ظاهر می‌شود — این افزونه نمی‌تواند و تلاش هم نمی‌کند مشارکت خود Dart را بازنویسی یا سرکوب کند.

اگر نمی‌خواهید هر بار انتخاب کنید، به‌جای آن از **Go to Implementation** (`Ctrl+F12` / `Cmd+F12`) استفاده کنید — یک ژست جداگانه که افزونه‌ی Dart در آن مشارکتی ندارد، پس رقابتی وجود ندارد و همیشه مستقیم به کد اصلی می‌پرد.

### نحوه‌ی عملکرد

۱. فایل `.g.dart` حاوی provider کلیک‌شده را پیدا می‌کند
۲. عبارت `part of` آن را می‌خواند تا فایل `.dart` نوشته‌شده را پیدا کند
۳. مشخص می‌کند کدام حاشیه‌نویسی `@ProviderFor(...)` متعلق به همان provider *مشخصی* است که کلیک کرده‌اید (نه فقط اولین مورد در فایل)
۴. به `class` یا تابع دارای حاشیه‌نویسی `@riverpod` متناظر می‌پرد

## نیازمندی‌ها

- VSCode نسخه‌ی ۱.۶۰.۰ یا بالاتر (در ویرایشگرهای مبتنی بر VSCode مانند Cursor هم کار می‌کند)
- [افزونه‌ی Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) (برای تولید `.g.dart` و پشتیبانی روزمره‌ی Dart)

## تنظیمات

| تنظیم | پیش‌فرض | توضیح |
|---|---|---|
| `riverpod-wayfinder.enableLogging` | `false` | هر تصمیم تحلیل (فایل‌های `.g.dart` کاندید بررسی‌شده، نام کلاس/تابع استنتاج‌شده، خط هدف حل‌شده) را در کنسول اشکال‌زدایی ثبت می‌کند. |

## مشکلات شناخته‌شده

- برای یافتن فایل منبع به عبارت `part of` در فایل `.g.dart` وابسته است — تنظیمات غیرمعمول تولید کد ممکن است حل نشوند.
- استنتاج نام کلاس/تابع از یک قاعده‌ی حروف بزرگ/کوچک استفاده می‌کند (حرف اول بزرگ → کلاس، کوچک → تابع)؛ کدی که قراردادهای نام‌گذاری Dart را رعایت نکند ممکن است درست حل نشود.

## نقشه راه

این افزونه روی یک چیز تمرکز دارد — ناوبری قابل‌اعتماد — اما اصطکاک‌های دیگر زیادی در Riverpod وجود دارد که هیچ افزونه‌ای هنوز به‌خوبی آن‌ها را پوشش نمی‌دهد: یافتن معکوس همه‌ی محل‌های watch/read یک provider، دستور بررسی سلامت کل workspace، نمودار وابستگی‌ها، ابزار کمک به مهاجرت کد تولیدی، و موارد دیگر. برای فهرست کامل ایده‌ها به [ROADMAP.md](ROADMAP.md) مراجعه کنید — مشارکت و رأی‌دهی خوش‌آمد است.

## توسعه

```bash
npm install
npm run test:unit    # تست‌های واحد خالص resolver، بدون نیاز به ویرایشگر
npm run compile       # بررسی نوع، lint، بسته‌بندی
npx @vscode/vsce package   # ساخت یک .vsix قابل‌نصب
```

برای بررسی یکپارچگی کامل (که آیا `Ctrl+F12` واقعاً در یک ویرایشگر واقعی به‌درستی می‌پرد یا نه)، این پوشه را در VSCode باز کنید و `F5` را بزنید تا یک Extension Development Host اجرا شود، یک فایل `.dart` با provider‌های تولیدشده باز کنید و امتحان کنید — این مرحله نیاز به یک انسان پشت صفحه‌کلید دارد.

تمام منطق تحلیل در [`src/resolver.ts`](src/resolver.ts) قرار دارد، بدون هیچ import از `vscode` — این یک تابع خالص است که در برابر fixture‌های واقعی چند-provider در [`test/fixtures/`](test/fixtures/) تست شده. [`src/extension.ts`](src/extension.ts) فقط یک لایه‌ی نازک سمت VSCode است.

## مشارکت

Issue و Pull Request خوش‌آمدند — هدف این است که واقعاً ابزاری متعلق به جامعه باشد. اگر با موردی مواجه شدید که به‌درستی حل نمی‌شود، لطفاً یک جفت فایل حداقلی `.dart` + `.g.dart` که مشکل را بازتولید می‌کند ضمیمه کنید؛ معمولاً همین کافی است تا به یک تست رگرسیون تبدیل شود.

## قدردانی

این پروژه فورکی از [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider) است — تمام اعتبار ایده‌ی اصلی متعلق به [@shinriyo](https://github.com/shinriyo) است. این فورک اشکالات تحلیل چند-provider را برطرف کرده، روش اصلی را به `Go to Implementation` تغییر داده تا واقعاً به‌طور قابل‌اعتماد کار کند، و یک `DefinitionProvider` در کنار همان مورد Dart اضافه کرده تا `Ctrl+Click` به‌جای همیشه رفتن به فایل تولیدشده، یک انتخاب ارائه دهد.

## مجوز

MIT — ۱۰۰٪ رایگان و متن‌باز، بدون هیچ قید و شرطی. به [LICENSE](LICENSE) مراجعه کنید.
