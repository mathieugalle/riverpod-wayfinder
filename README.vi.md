<div align="center">

# 🧭 Riverpod Wayfinder

**Nhảy thẳng đến provider Riverpod mà bạn thực sự đã viết — không phải file được tạo tự động.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.74.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

Một tiện ích mở rộng VSCode dành cho các dự án Riverpod + `riverpod_generator`. Nhấp vào nơi sử dụng một provider — `viewFreshnessProvider`, `counterProvider`, bất cứ gì — và nhảy đến `class` hoặc hàm mà bạn thực sự đã viết tay, ngay cả trong các file gộp nhiều provider với nhau.

## Vì sao tiện ích này tồn tại

Với việc sinh mã, `fooProvider` thực ra không được định nghĩa ở nơi bạn viết mã `@riverpod` — nó được định nghĩa trong file `foo.g.dart` được tạo tự động. Điều hướng gốc của VSCode tự nhiên sẽ đưa bạn đến đó, chứ không phải mã nguồn của bạn. Đó là một khoản "thuế" nhỏ nhưng liên tục đánh vào mọi codebase Riverpod: hàng chục lần đi vòng mỗi ngày, qua một file mà bạn không nên đụng vào.

Riverpod Wayfinder loại bỏ khúc quanh đó. Nó đọc file `.g.dart` thay bạn, xác định chính xác bạn đã nhấp vào provider nào (ngay cả khi file gộp nhiều provider), và đưa bạn đến đúng nơi khai báo thật sự.

## Tính năng

- **`Ctrl+F12` / `Cmd+F12` (Go to Implementation)** — thao tác chính. Luôn nhảy trực tiếp đến mã nguồn viết tay, không có danh sách chọn.
- **`Ctrl+Click` / `Cmd+Click` (Go to Definition)** — cũng đưa ra mã nguồn viết tay như một lựa chọn, cùng với câu trả lời của chính tiện ích Dart. Xem [Vì sao lại hiện danh sách chọn?](#vì-sao-ctrlclick--cmdclick-hiện-danh-sách-chọn-thay-vì-nhảy-trực-tiếp) bên dưới.
- **`Ctrl+Alt+D` / `Cmd+Alt+D`** — lệnh thủ công dự phòng, hoạt động từ bất kỳ đâu trong file.
- Xử lý đúng các file có **nhiều provider**, pha trộn phong cách class và hàm, theo bất kỳ thứ tự nào.
- Hỗ trợ cả `@riverpod class Foo extends _$Foo` và `@riverpod ReturnType foo(Ref ref)`.
- Không yêu cầu quy ước đặt tên file — khớp theo nội dung, nên cả `foo.providers.dart` / `foo.providers.g.dart` lẫn `foo.dart` / `foo.g.dart` thông thường đều hoạt động.
- Cũng không yêu cầu quy ước đặt tên provider — hoạt động dù định danh được sinh ra kết thúc bằng `Provider`, `Controller`, hay bất kỳ hậu tố nào nhóm bạn dùng, ở bất cứ đâu mà codegen `@riverpod` hoạt động.
- **`Shift+F12` (Find All References)** trên một khai báo `@riverpod` viết tay — liệt kê mọi nơi sử dụng provider *được sinh ra* mà nó tạo ra, ở khắp workspace (không bao giờ hiển thị vị trí `.g.dart`). Ưu tiên dùng chính các tham chiếu của Dart analyzer khi có thể, nếu không sẽ chuyển sang quét văn bản.
- Ghi log truy vết phân giải từng bước vào **kênh Output "Riverpod Wayfinder"** để gỡ lỗi — xem [Khắc phục sự cố](#khắc-phục-sự-cố) bên dưới.

## Cài đặt

Chưa được xuất bản lên marketplace nào — tải `.vsix` từ trang [Releases](../../releases) (hoặc tự build, xem [Phát triển](#phát-triển)) rồi cài đặt thủ công:

1. Mở VSCode → giao diện Extensions → menu `···` → **Install from VSIX...**
2. Chọn file `riverpod-wayfinder-*.vsix` đã tải về

Hoặc từ dòng lệnh:

```bash
code --install-extension riverpod-wayfinder-0.3.0.vsix
```

## Cách sử dụng

1. Đặt con trỏ tại (hoặc chọn) một nơi sử dụng provider, ví dụ `viewFreshnessProvider`
2. Nhảy đến khai báo của nó bằng một trong các cách:
   - **`Ctrl+F12`** (Windows/Linux) / **`Cmd+F12`** (Mac) — "Go to Implementation" — luôn đến thẳng mã nguồn, không có danh sách chọn
   - **`Ctrl+Click`** / **`Cmd+Click`** (hoặc `F12`) — "Go to Definition" — thường mở ra danh sách chọn gồm cả vị trí `.g.dart` được tạo tự động lẫn mã nguồn viết tay; chọn cái bạn muốn
   - **`Ctrl+Alt+D`** (Windows/Linux) / **`Cmd+Alt+D`** (Mac), hoặc chạy **"Riverpod Wayfinder: Go to Provider Source"** từ Command Palette

### Ví dụ

Một file gộp nhiều provider, pha trộn phong cách — chính xác là trường hợp mà tiện ích này được tạo ra để giải quyết:

```dart
// Trong view_freshness.providers.dart
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // Ctrl+F12 trên viewFreshnessScoreProvider nhảy ĐẾN ĐÂY, không phải ViewFreshness

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // và viewFreshnessHistoryProvider nhảy ĐẾN ĐÂY
```

### Vì sao `Ctrl+Click` / `Cmd+Click` hiện danh sách chọn thay vì nhảy trực tiếp?

`Ctrl+Click` kích hoạt **Go to Definition** của VSCode, được tổng hợp từ mọi tiện ích đăng ký `DefinitionProvider` cho ngôn ngữ `dart` — bao gồm cả tiện ích Dart chính thức, vốn phân giải nơi sử dụng provider về file `.g.dart` được tạo tự động (đó thực sự là nơi ký hiệu được định nghĩa). VSCode không cho phép kết quả của một provider nào đó "thắng" theo mức ưu tiên, thứ tự hay tốc độ; khi có nhiều hơn một vị trí trả về, nó sẽ hiện một danh sách chọn/xem trước tất cả. Riverpod Wayfinder cũng đăng ký một `DefinitionProvider`, nên câu trả lời của nó (mã nguồn viết tay) xuất hiện trong danh sách đó cạnh câu trả lời của Dart — nó không, và không thể, ghi đè hay ngăn chặn đóng góp riêng của Dart.

Nếu bạn không muốn chọn mỗi lần, hãy dùng **Go to Implementation** (`Ctrl+F12` / `Cmd+F12`) — một thao tác riêng biệt mà tiện ích Dart không tham gia, nên không có cạnh tranh, và luôn nhảy thẳng đến mã nguồn viết tay.

### Vì sao `Shift+F12` ("Find All References") đôi khi vẫn hiện một vị trí `.g.dart`?

Cùng nguyên nhân gốc rễ như danh sách chọn `Ctrl+Click` ở trên: VSCode tổng hợp mọi `ReferenceProvider` đã đăng ký, và đóng góp của chính Riverpod Wayfinder không bao giờ bao gồm vị trí `.g.dart` — nhưng đóng góp của tiện ích Dart chính thức thì có thể. Nếu mã được sinh ra thực sự gọi ngược lại ký hiệu viết tay của bạn (điều này thường xảy ra ít nhất một lần, ví dụ `PackageMetrics create() => PackageMetrics();` trong file sinh ra của một provider dựa trên class), thì đó là một tham chiếu thật sự theo góc nhìn của Dart, và `ReferenceProvider` của Dart báo cáo nó một cách chính xác. Không có cách nào được hỗ trợ để lọc bỏ đóng góp của một tiện ích khác khỏi danh sách đã gộp.

### Cách hoạt động

1. Tìm file `.g.dart` chứa provider đã nhấp
2. Đọc câu lệnh `part of` của nó để xác định file `.dart` viết tay
3. Xác định annotation `@ProviderFor(...)` nào tương ứng với *chính xác* provider bạn đã nhấp (không chỉ là cái đầu tiên trong file)
4. Nhảy đến khai báo `class` hoặc hàm có annotation `@riverpod` tương ứng

## Yêu cầu

- VSCode 1.74.0 trở lên (cũng hoạt động trong các trình soạn thảo dựa trên VSCode như Cursor)
- [Tiện ích Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) (để sinh `.g.dart` và hỗ trợ Dart hàng ngày)

## Khắc phục sự cố

Riverpod Wayfinder ghi log mọi quyết định phân giải (các file `.g.dart` ứng viên đã kiểm tra, tên class/hàm được suy luận, dòng đích đã phân giải, và mọi lỗi) vào kênh riêng **"Riverpod Wayfinder"** trong bảng Output:

1. Mở **View → Output**, rồi chọn **"Riverpod Wayfinder"** trong danh sách kênh thả xuống.
2. Truy vết từng bước mặc định bị ẩn. Để xem, nhấp vào biểu tượng bánh răng trên thanh công cụ của kênh đó (hoặc chạy **"Developer: Set Log Level..."** → **"Riverpod Wayfinder"**) rồi đặt mức thành **Debug** hoặc **Trace**.
3. Lỗi (một file không đọc được, một lần gọi analyzer thất bại, ...) luôn hiển thị, bất kể mức đó.

## Vấn đề đã biết

- Phụ thuộc vào câu lệnh `part of` trong file `.g.dart` để tìm file nguồn — các thiết lập sinh mã khác thường có thể không phân giải được.
- Việc suy luận tên class/hàm dùng một heuristic dựa trên chữ hoa/thường (chữ cái đầu viết hoa → class, viết thường → hàm); mã viết tay không theo quy ước đặt tên của Dart có thể không phân giải chính xác.
- `Shift+F12` vẫn có thể hiện một vị trí `.g.dart` do chính tiện ích Dart đóng góp — xem FAQ ở trên, đây không phải điều tiện ích này có thể ngăn được.
- Cơ chế quét văn bản dự phòng của `Shift+F12` (dùng khi Dart analyzer không trả về kết quả nào) chỉ là khớp theo ranh giới từ đơn giản — nó không thể phân biệt một lần sử dụng thật với một cái tên trùng khớp nằm trong comment hay chuỗi ký tự.

## Lộ trình

Tiện ích này tập trung vào một việc — điều hướng đáng tin cậy — nhưng còn rất nhiều điểm gây khó chịu khác của Riverpod mà chưa tiện ích nào giải quyết tốt: lệnh kiểm tra sức khỏe toàn workspace, đồ thị phụ thuộc, công cụ hỗ trợ di chuyển mã sinh tự động, và nhiều hơn nữa. Xem [ROADMAP.md](ROADMAP.md) để biết danh sách ý tưởng đang được theo dõi — hoan nghênh đóng góp và bình chọn.

## Phát triển

```bash
npm install
npm run test:unit    # unit test thuần cho resolver, không cần trình soạn thảo
npm run compile       # kiểm tra kiểu, lint, đóng gói
npx @vscode/vsce package   # build ra file .vsix có thể cài đặt
```

Để kiểm tra tích hợp đầy đủ (liệu `Ctrl+F12` có thực sự nhảy đúng trong một trình soạn thảo thật hay không), hãy mở thư mục này trong VSCode và nhấn `F5` để khởi chạy Extension Development Host, mở một file `.dart` có provider được sinh tự động và thử — bước này cần có con người trực tiếp thao tác.

Toàn bộ logic phân giải nằm trong [`src/resolver.ts`](src/resolver.ts), không hề import `vscode` — đó là một hàm thuần được kiểm thử với các fixture đa provider thực tế trong [`test/fixtures/`](test/fixtures/). [`src/extension.ts`](src/extension.ts) chỉ là một lớp bọc mỏng phía VSCode.

## Đóng góp

Issue và Pull Request đều được hoan nghênh — mục tiêu là một công cụ thực sự thuộc về cộng đồng. Nếu bạn gặp trường hợp không phân giải đúng, vui lòng đính kèm một cặp file `.dart` + `.g.dart` tối giản có thể tái hiện lỗi; thường như vậy là đủ để biến thành một bài test hồi quy.

## Ghi công

Đây là bản fork của [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider) — mọi công lao cho ý tưởng gốc thuộc về [@shinriyo](https://github.com/shinriyo). Bản fork này sửa các lỗi phân giải đa provider, chuyển thao tác chính sang `Go to Implementation` để hoạt động thực sự đáng tin cậy, và thêm một `DefinitionProvider` bên cạnh của Dart để `Ctrl+Click` đưa ra lựa chọn thay vì luôn chỉ đến file được sinh tự động.

## Giấy phép

MIT — 100% miễn phí và mã nguồn mở, không ràng buộc. Xem [LICENSE](LICENSE).
