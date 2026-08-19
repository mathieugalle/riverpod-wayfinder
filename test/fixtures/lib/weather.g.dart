// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'weather.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$weatherHash() => r'1111111111111111111111111111111111111111';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    hash = 0x1fffffff & (hash + value);
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

typedef WeatherRef = AutoDisposeFutureProviderRef<String>;

/// See also [weather].
@ProviderFor(weather)
const weatherProvider = WeatherFamily();

/// See also [weather].
class WeatherFamily extends Family<AsyncValue<String>> {
  /// See also [weather].
  const WeatherFamily();

  /// See also [weather].
  WeatherProvider call({
    required String city,
  }) {
    return WeatherProvider(
      city: city,
    );
  }

  @override
  WeatherProvider getProviderOverride(
    covariant WeatherProvider provider,
  ) {
    return call(
      city: provider.city,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies => _dependencies;

  @override
  String? get name => r'weatherProvider';
}

/// See also [weather].
class WeatherProvider extends AutoDisposeFutureProvider<String> {
  /// See also [weather].
  WeatherProvider({
    required String city,
  }) : this._internal(
          (ref) => weather(
            ref as WeatherRef,
            city: city,
          ),
          from: weatherProvider,
          name: r'weatherProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$weatherHash,
          dependencies: WeatherFamily._dependencies,
          allTransitiveDependencies: WeatherFamily._dependencies,
          city: city,
        );

  WeatherProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.city,
  }) : super.internal();

  final String city;

  @override
  bool operator ==(Object other) {
    return other is WeatherProvider && other.city == city;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, city.hashCode);
    return _SystemHash.finish(hash);
  }
}
