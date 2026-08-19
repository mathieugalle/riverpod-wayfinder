// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'view_freshness.providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$viewFreshnessHash() => r'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

/// See also [ViewFreshness].
@ProviderFor(ViewFreshness)
final viewFreshnessProvider =
    AutoDisposeNotifierProvider<ViewFreshness, bool>.internal(
  ViewFreshness.new,
  name: r'viewFreshnessProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$viewFreshnessHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ViewFreshness = AutoDisposeNotifier<bool>;

String _$viewFreshnessScoreHash() =>
    r'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

/// See also [viewFreshnessScore].
@ProviderFor(viewFreshnessScore)
final viewFreshnessScoreProvider = AutoDisposeProvider<int>.internal(
  viewFreshnessScore,
  name: r'viewFreshnessScoreProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$viewFreshnessScoreHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef ViewFreshnessScoreRef = AutoDisposeProviderRef<int>;

String _$viewFreshnessHistoryHash() =>
    r'cccccccccccccccccccccccccccccccccccccccc';

/// See also [ViewFreshnessHistory].
@ProviderFor(ViewFreshnessHistory)
final viewFreshnessHistoryProvider =
    AutoDisposeNotifierProvider<ViewFreshnessHistory, List<bool>>.internal(
  ViewFreshnessHistory.new,
  name: r'viewFreshnessHistoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$viewFreshnessHistoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ViewFreshnessHistory = AutoDisposeNotifier<List<bool>>;
