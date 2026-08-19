// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'city_forecast.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$cityForecastHash() => r'2222222222222222222222222222222222222222';

abstract class _$CityForecast
    extends BuildlessAutoDisposeAsyncNotifier<String> {
  late final String city;

  @override
  FutureOr<String> build(
    String city,
  );
}

/// See also [CityForecast].
@ProviderFor(CityForecast)
const cityForecastProvider = CityForecastFamily();

/// See also [CityForecast].
class CityForecastFamily extends Family<AsyncValue<String>> {
  /// See also [CityForecast].
  const CityForecastFamily();

  /// See also [CityForecast].
  CityForecastProvider call(
    String city,
  ) {
    return CityForecastProvider(city);
  }

  @override
  CityForecastProvider getProviderOverride(
    covariant CityForecastProvider provider,
  ) {
    return call(provider.city);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies => _dependencies;

  @override
  String? get name => r'cityForecastProvider';
}

/// See also [CityForecast].
class CityForecastProvider extends AutoDisposeAsyncNotifierProviderImpl<
    CityForecast, String> {
  /// See also [CityForecast].
  CityForecastProvider(
    String city,
  ) : this._internal(
          () => CityForecast()..city = city,
          from: cityForecastProvider,
          name: r'cityForecastProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$cityForecastHash,
          dependencies: CityForecastFamily._dependencies,
          allTransitiveDependencies: CityForecastFamily._dependencies,
          city: city,
        );

  CityForecastProvider._internal(
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
    return other is CityForecastProvider && other.city == city;
  }
}
