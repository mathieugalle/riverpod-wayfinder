import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_controller.g.dart';

// Some codebases don't use the "xxxProvider" naming convention at all - here
// the generated identifier is named "authController" (no "Provider" suffix),
// e.g. because of a team convention or custom lint rule. Riverpod Wayfinder
// must not assume any particular suffix; it works wherever @riverpod itself
// works.

@riverpod
class AuthController extends _$AuthController {
  @override
  bool build() {
    return false;
  }

  void logIn() {
    state = true;
  }
}
