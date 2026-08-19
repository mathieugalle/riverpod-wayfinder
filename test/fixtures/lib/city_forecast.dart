import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'city_forecast.g.dart';

// Class-based FAMILY (parameterized) provider - build() takes an argument,
// and the generated code wraps everything in a *Family class too.

@riverpod
class CityForecast extends _$CityForecast {
  @override
  Future<String> build(String city) async {
    return 'forecast for $city';
  }

  Future<void> refresh(String city) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => build(city));
  }
}
