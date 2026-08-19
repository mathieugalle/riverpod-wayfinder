import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'counter.g.dart';

// Simple single-provider file with an ordinary filename (not
// "*.providers.dart") to confirm the extension isn't relying on any
// filename convention - it matches by content.

@riverpod
int counter(Ref ref) {
  return 0;
}
