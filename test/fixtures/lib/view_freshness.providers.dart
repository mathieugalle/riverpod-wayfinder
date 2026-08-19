import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'view_freshness.providers.g.dart';

// Multi-provider file mixing class-based and function-based providers, in
// the "grouped" style (e.g. foo.providers.dart) real projects tend to use.
// The extension must resolve EACH provider independently, not just the
// first one declared in the file.

@riverpod
class ViewFreshness extends _$ViewFreshness {
  @override
  bool build() {
    return true;
  }

  void markStale() {
    state = false;
  }
}

@riverpod
int viewFreshnessScore(Ref ref) {
  final fresh = ref.watch(viewFreshnessProvider);
  return fresh ? 100 : 0;
}

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory {
  @override
  List<bool> build() {
    return const [];
  }

  void record(bool value) {
    state = [...state, value];
  }
}
