import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

class StudentIdentity {
  static const String _key = 'steady_student_id';

  const StudentIdentity._();

  static Future<String> load() async {
    final SharedPreferences preferences = await SharedPreferences.getInstance();
    final String? existingId = preferences.getString(_key);
    if (existingId != null && existingId.isNotEmpty) {
      return existingId;
    }
    final String newId = const Uuid().v4();
    await preferences.setString(_key, newId);
    return newId;
  }
}
