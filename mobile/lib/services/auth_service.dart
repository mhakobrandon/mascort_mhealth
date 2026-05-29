import 'dart:convert';
import 'dart:io';

import 'package:path_provider/path_provider.dart';

class AuthService {
  static Future<File> _getFile() async {
    final dir = await getApplicationDocumentsDirectory();

    return File('${dir.path}/users.json');
  }

  static Future<List<dynamic>> _readUsers() async {
    try {
      final file = await _getFile();

      if (!await file.exists()) {
        await file.writeAsString(jsonEncode([]));
      }

      final content = await file.readAsString();

      return jsonDecode(content);
    } catch (e) {
      return [];
    }
  }

  static Future<void> signUp({
    required String username,
    required String email,
    required String password,
  }) async {
    final users = await _readUsers();

    final userExists = users.any(
      (u) => u['username'] == username,
    );

    if (userExists) {
      throw Exception('Username already exists');
    }

    users.add({
      'username': username,
      'email': email,
      'password': password,
    });

    final file = await _getFile();

    await file.writeAsString(jsonEncode(users));
  }

  static Future<bool> signIn({
    required String username,
    required String password,
  }) async {
    final users = await _readUsers();

    return users.any(
      (u) => u['username'] == username && u['password'] == password,
    );
  }
}
