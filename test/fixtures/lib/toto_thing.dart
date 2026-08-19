import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'toto_thing.g.dart';

// A deliberately absurd, made-up naming convention - the generated
// identifier ends in "Toto", a suffix that means nothing and matches no
// pattern anyone would hardcode. If resolution still works here, it proves
// the extension truly does not depend on any specific suffix string at all
// (not "Provider", not "Controller", not anything on a list).

@riverpod
class WidgetToto extends _$WidgetToto {
  @override
  String build() {
    return 'hello';
  }
}
