import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'weather.g.dart';

// Function-based FAMILY (parameterized) provider - the generated const is
// wrapped in a *Family class instead of being a plain final value.

@riverpod
Future<String> weather(Ref ref, {required String city}) async {
  return 'sunny in $city';
}
