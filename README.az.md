<div align="center">

# 🧭 Riverpod Wayfinder

**Yaradılan fayla deyil, birbaşa özünüzün yazdığınız Riverpod provider-ə keçin.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.74.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

Riverpod + `riverpod_generator` layihələri üçün VSCode genişlənməsi. Provider istifadə yerinə klikləyin — `viewFreshnessProvider`, `counterProvider`, fərq etməz — və faylda bir neçə provider qarışıq olsa belə, həqiqətən əl ilə yazdığınız `class` və ya funksiyaya keçin.

## Bu genişlənmə niyə mövcuddur

Kod generasiyası ilə `fooProvider` əslində `@riverpod` kodunuzu yazdığınız yerdə deyil, yaradılan `foo.g.dart` faylında təyin olunur. VSCode-un öz naviqasiyası təbii olaraq sizi ora aparır, mənbə koduna deyil. Bu, hər Riverpod layihəsinə düşən kiçik, lakin daimi bir yükdür: gündə onlarla dəfə, toxunmamalı olduğunuz bir fayl üzərindən keçən yan yollar.

Riverpod Wayfinder bu yan yolu aradan qaldırır. Sizin əvəzinizə `.g.dart` faylını oxuyur, klikləndiyiniz provider-in tam olaraq hansı olduğunu müəyyən edir (fayl bir neçəsini bir yerdə cəmləsə belə) və sizi əsl elana aparır.

## Xüsusiyyətlər

- **`Ctrl+F12` / `Cmd+F12` (Go to Implementation)** — əsas üsul. Heç bir seçim siyahısı olmadan, hər dəfə birbaşa əl ilə yazılmış mənbəyə keçir.
- **`Ctrl+Click` / `Cmd+Click` (Go to Definition)** — Dart genişlənməsinin öz cavabı ilə yanaşı, əl ilə yazılmış mənbəni də seçim kimi təqdim edir. Ətraflı məlumat üçün aşağıdakı [Niyə seçim siyahısı göstərilir?](#niyə-ctrlclick--cmdclick-birbaşa-keçmək-əvəzinə-seçim-siyahısı-göstərir) bölməsinə baxın.
- **`Ctrl+Alt+D` / `Cmd+Alt+D`** — manual əmr ehtiyat variantı, faylın istənilən yerindən işləyir.
- Sinif əsaslı və funksiya əsaslı üslubların qarışıq olduğu, **çoxsaylı provider** olan faylları düzgün emal edir, istənilən sırada.
- Həm `@riverpod class Foo extends _$Foo`, həm də `@riverpod ReturnType foo(Ref ref)` dəstəklənir.
- Fayl adlandırma qaydası tələb olunmur — məzmuna görə uyğunlaşdırır, ona görə `foo.providers.dart` / `foo.providers.g.dart` və adi `foo.dart` / `foo.g.dart` hər ikisi işləyir.
- Provider adlandırma qaydası da tələb olunmur — yaradılan identifikatorlar `Provider` ilə, `Controller` ilə, ya da komandanızın istifadə etdiyi istənilən başqa sonluqla bitsin, `@riverpod` kod generasiyasının özünün işlədiyi hər yerdə işləyir.
- **`Shift+F12` (Find All References)** əl ilə yazdığınız `@riverpod` elanı üzərində — onun yaratdığı *generasiya olunmuş* provider-in workspace daxilindəki bütün istifadə yerlərini sadalayır (`.g.dart` yerləri heç vaxt göstərilmir). Mümkün olduqda Dart analizatorunun öz istinadlarına üstünlük verir, əks halda mətn axtarışına keçir.
- Problemləri həll etmək üçün addım-addım analiz izləməsini **"Riverpod Wayfinder" Output kanalına** yazır — aşağıda [Problemlərin həlli](#problemlərin-həlli) bölməsinə baxın.

## Quraşdırma

Hələ heç bir marketpleysdə dərc olunmayıb — [Releases](../../releases) səhifəsindən `.vsix` faylını əldə edin (və ya özünüz qurun, bax [İnkişaf](#inkişaf)) və əl ilə quraşdırın:

1. VSCode-u açın → Extensions görünüşü → `···` menyusu → **Install from VSIX...**
2. Yüklənmiş `riverpod-wayfinder-*.vsix` faylını seçin

Və ya komanda sətrindən:

```bash
code --install-extension riverpod-wayfinder-0.3.0.vsix
```

## İstifadə qaydası

1. Kursoru bir provider istifadə yerinə qoyun (və ya seçin), məsələn `viewFreshnessProvider`
2. Aşağıdakı üsullardan biri ilə onun elanına keçin:
   - **`Ctrl+F12`** (Windows/Linux) / **`Cmd+F12`** (Mac) — "Go to Implementation" — həmişə seçim siyahısı olmadan birbaşa mənbəyə çatır
   - **`Ctrl+Click`** / **`Cmd+Click`** (və ya `F12`) — "Go to Definition" — adətən həm yaradılan `.g.dart` yerini, həm də əl ilə yazılmış mənbəni əhatə edən seçim siyahısı açılır; istədiyinizi seçin
   - **`Ctrl+Alt+D`** (Windows/Linux) / **`Cmd+Alt+D`** (Mac), və ya Command Palette-dən **"Riverpod Wayfinder: Go to Provider Source"** işə salın

### Nümunə

Üslubları qarışdıran, çoxsaylı provider-i bir yerə cəmləyən tək bir fayl — bu genişlənmənin mövcud olma səbəbi məhz budur:

```dart
// view_freshness.providers.dart faylında
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // viewFreshnessScoreProvider üzərində Ctrl+F12 ViewFreshness-ə deyil, BURAYA keçir

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // və viewFreshnessHistoryProvider BURAYA keçir
```

### Niyə `Ctrl+Click` / `Cmd+Click` birbaşa keçmək əvəzinə seçim siyahısı göstərir?

`Ctrl+Click` VSCode-un **Go to Definition** funksiyasını işə salır, bu isə `dart` dili üçün `DefinitionProvider` qeydiyyatdan keçirən bütün genişlənmələr arasında cəmlənir — rəsmi Dart genişlənməsi də daxil olmaqla, o, provider istifadə yerlərini yaradılan `.g.dart` faylına həll edir (simvolun həqiqətən təyin olunduğu yer də elə budur). VSCode heç bir provider-in nəticəsinin prioritet, sıra və ya sürətə görə "qalib gəlməsinə" icazə vermir; birdən çox yer qaytarıldıqda, hamısının seçim/önbaxış siyahısını göstərir. Riverpod Wayfinder da bir `DefinitionProvider` qeydiyyatdan keçirir, ona görə onun cavabı (əl ilə yazılmış mənbə) Dart-ın cavabı ilə yanaşı o siyahıda görünür — o, Dart-ın öz töhfəsini əvəz etmir və ya gizlətmir, bunu edə də bilməz.

Əgər hər dəfə seçim etmək istəmirsinizsə, əvəzinə **Go to Implementation** (`Ctrl+F12` / `Cmd+F12`) istifadə edin — Dart genişlənməsinin iştirak etmədiyi ayrı bir jest, ona görə rəqabət yoxdur və həmişə birbaşa əl ilə yazılmış mənbəyə keçir.

### Niyə `Shift+F12` ("Find All References") bəzən hələ də `.g.dart` yerini göstərir?

Yuxarıdakı `Ctrl+Click` seçim siyahısı ilə eyni kök səbəb: VSCode qeydiyyatdan keçmiş bütün `ReferenceProvider`-ləri cəmləyir, və Riverpod Wayfinder-in öz töhfəsinə heç vaxt `.g.dart` yeri daxil olmur — lakin rəsmi Dart genişlənməsinin töhfəsinə daxil ola bilər. Əgər generasiya olunmuş kod həqiqətən əl ilə yazdığınız simvolu geri çağırırsa (bu adətən ən azı bir dəfə baş verir, məsələn sinif əsaslı bir provider-in generasiya olunmuş faylındakı `PackageMetrics create() => PackageMetrics();`), bu, Dart baxımından həqiqi bir istinaddır və Dart-ın `ReferenceProvider`-i bunu düzgün bildirir. Birləşdirilmiş siyahıdan başqa bir genişlənmənin töhfəsini süzgəcdən keçirməyin dəstəklənən heç bir yolu yoxdur.

### Necə işləyir

1. Klikləndiyiniz provider-i ehtiva edən `.g.dart` faylını tapır
2. Əl ilə yazılmış `.dart` faylını tapmaq üçün onun `part of` ifadəsini oxuyur
3. Klikləndiyiniz **məhz həmin** provider-ə uyğun gələn `@ProviderFor(...)` annotasiyasını müəyyən edir (faylda yalnız birincisi deyil)
4. Uyğun `class` və ya `@riverpod` annotasiyalı funksiya elanına keçir

## Tələblər

- VSCode 1.74.0 və ya daha yüksək versiya (Cursor kimi VSCode əsaslı redaktorlarda da işləyir)
- [Dart genişlənməsi](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) (`.g.dart` generasiyası və gündəlik Dart dəstəyi üçün)

## Problemlərin həlli

Riverpod Wayfinder hər həll qərarını (yoxlanılan namizəd `.g.dart` faylları, təxmin edilən sinif/funksiya adı, həll olunmuş hədəf sətir və hər hansı xəta) Output panelindəki öz **"Riverpod Wayfinder"** kanalına yazır:

1. **View → Output** açın, sonra kanal siyahısından **"Riverpod Wayfinder"**-i seçin.
2. Addım-addım izləmə standart olaraq gizlidir. Onu görmək üçün həmin kanalın alət çubuğundakı dişli çarx ikonuna klikləyin (və ya **"Developer: Set Log Level..."** → **"Riverpod Wayfinder"** işə salın) və səviyyəni **Debug** və ya **Trace**-ə qoyun.
3. Xətalar (oxuna bilməyən fayl, uğursuz analizator çağırışı və s.) bu səviyyədən asılı olmayaraq həmişə göstərilir.

## Məlum problemlər

- Mənbə faylını tapmaq üçün `.g.dart` faylının `part of` ifadəsindən asılıdır — qeyri-adi kod generasiyası quraşdırmaları həll olunmaya bilər.
- Sinif/funksiya adının təxmin edilməsi böyük/kiçik hərf evristikasından istifadə edir (böyük hərflə başlayan → sinif, kiçik hərflə → funksiya); Dart adlandırma qaydalarına uyğun olmayan kod düzgün həll olunmaya bilər.
- `Shift+F12` hələ də Dart genişlənməsinin özünün gətirdiyi bir `.g.dart` yerini göstərə bilər — yuxarıdakı FAQ-a baxın, bu, bu genişlənmənin idarə edə biləcəyi bir şey deyil.
- `Shift+F12`-nin mətn axtarışı ehtiyat üsulu (Dart analizatoru heç bir nəticə qaytarmadıqda istifadə olunur) sadəcə sözün sərhədinə görə uyğunlaşdırmadır — o, real istifadəni şərh və ya mətn sətri daxilindəki eyni adlı bir şeydən ayıra bilmir.

## Yol xəritəsi

Bu genişlənmə bir şeyə — etibarlı naviqasiyaya — fokuslanıb, lakin heç bir mövcud genişlənmənin hələ yaxşı əhatə etmədiyi çoxlu Riverpod problemi var: workspace sağlamlıq yoxlaması əmri, asılılıq qrafikləri, kod generasiyası miqrasiya köməkçiləri və s. Fikirlərin tam siyahısı üçün [ROADMAP.md](ROADMAP.md) sənədinə baxın — töhfələr və səsvermə xoş qarşılanır.

## İnkişaf

```bash
npm install
npm run test:unit    # redaktor tələb etməyən təmiz resolver vahid testləri
npm run compile       # tip yoxlanışı, lint, bundle
npx @vscode/vsce package   # quraşdırıla bilən .vsix qurur
```

Tam inteqrasiya yoxlaması üçün (`Ctrl+F12`-in həqiqi redaktorda düzgün keçib-keçmədiyini yoxlamaq üçün) bu qovluğu VSCode-da açın və Extension Development Host işə salmaq üçün `F5` düyməsini basın, generasiya olunmuş provider-ləri olan bir `.dart` faylını açın və sınayın — bu addım klaviatura arxasında insan tələb edir.

Bütün həll məntiqi [`src/resolver.ts`](src/resolver.ts) faylında yerləşir, heç bir `vscode` import olmadan — bu, [`test/fixtures/`](test/fixtures/) qovluğundakı real çoxsaylı provider fixture-larına qarşı test edilmiş təmiz funksiyadır. [`src/extension.ts`](src/extension.ts) sadəcə VSCode tərəfli nazik bir wrapper-dır.

## Töhfə vermək

Issue və Pull Request-lər xoş qarşılanır — məqsəd həqiqətən icma tərəfindən sahiblənilən bir alət olmaqdır. Əgər düzgün həll olunmayan bir hal ilə qarşılaşsanız, zəhmət olmasa problemi təkrarlayan minimal `.dart` + `.g.dart` cütü əlavə edin; adətən bu, reqressiya testinə çevirmək üçün kifayətdir.

## Təşəkkür

Bu, [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider) layihəsinin fork-udur — orijinal ideyaya görə bütün təşəkkür [@shinriyo](https://github.com/shinriyo)-yə aiddir. Bu fork çoxsaylı provider həlli xətalarını düzəldir, həqiqətən etibarlı işləməsi üçün əsas jesti `Go to Implementation`-a keçirir və `Ctrl+Click`-in həmişə yaradılan fayla getmək əvəzinə seçim təklif etməsi üçün Dart-ın öz `DefinitionProvider`-i ilə yanaşı birini əlavə edir.

## Lisenziya

MIT — 100% pulsuz və açıq mənbə, heç bir şərt olmadan. Bax [LICENSE](LICENSE).
