import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000'; // Android emulator → localhost
  // For physical device, replace with your machine's IP: 'http://192.168.x.x:8000'

  static ApiService? _instance;
  static ApiService get instance => _instance ??= ApiService._();
  ApiService._();

  String? _token;
  String? _userId;

  // ==================== AUTH ====================

  Future<void> initSession() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    _userId = prefs.getString('user_id');

    if (_token == null) {
      await registerAnonymous();
    }
  }

  Future<void> registerAnonymous() async {
    try {
      final resp = await http.post(
        Uri.parse('$baseUrl/api/auth/register'),
        headers: {'Content-Type': 'application/json'},
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body) as Map<String, dynamic>;
        _token = data['token'] as String;
        _userId = data['user_id'] as String;
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', _token!);
        await prefs.setString('user_id', _userId!);
      }
    } catch (_) {
      // Offline mode — proceed without token
    }
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  // ==================== PREVENTION METHODS ====================

  Future<List<PreventionMethod>> getPreventionMethods({String? category}) async {
    final uri = Uri.parse('$baseUrl/api/prevention/').replace(
      queryParameters: category != null ? {'category': category} : null,
    );
    final resp = await http.get(uri, headers: _headers);
    if (resp.statusCode == 200) {
      final list = jsonDecode(resp.body) as List;
      return list.map((j) => PreventionMethod.fromJson(j as Map<String, dynamic>)).toList();
    }
    throw ApiException('Failed to load prevention methods', resp.statusCode);
  }

  Future<PreventionMethod> getPreventionMethod(int id) async {
    final resp = await http.get(
      Uri.parse('$baseUrl/api/prevention/$id'),
      headers: _headers,
    );
    if (resp.statusCode == 200) {
      return PreventionMethod.fromJson(jsonDecode(resp.body) as Map<String, dynamic>);
    }
    throw ApiException('Prevention method not found', resp.statusCode);
  }

  Future<List<PreventionMethod>> searchPreventionMethods(String query) async {
    final uri = Uri.parse('$baseUrl/api/prevention/search/').replace(
      queryParameters: {'query': query},
    );
    final resp = await http.get(uri, headers: _headers);
    if (resp.statusCode == 200) {
      final list = jsonDecode(resp.body) as List;
      return list.map((j) => PreventionMethod.fromJson(j as Map<String, dynamic>)).toList();
    }
    return [];
  }

  // ==================== CLINICS ====================

  Future<List<Clinic>> getClinics({String? services}) async {
    final uri = Uri.parse('$baseUrl/api/clinics/').replace(
      queryParameters: services != null ? {'services': services} : null,
    );
    final resp = await http.get(uri, headers: _headers);
    if (resp.statusCode == 200) {
      final list = jsonDecode(resp.body) as List;
      return list.map((j) => Clinic.fromJson(j as Map<String, dynamic>)).toList();
    }
    throw ApiException('Failed to load clinics', resp.statusCode);
  }

  Future<List<Clinic>> getNearbyClinics({
    required double latitude,
    required double longitude,
    double radiusKm = 5.0,
  }) async {
    final uri = Uri.parse('$baseUrl/api/clinics/nearby').replace(queryParameters: {
      'latitude': latitude.toString(),
      'longitude': longitude.toString(),
      'radius_km': radiusKm.toString(),
    });
    final resp = await http.get(uri, headers: _headers);
    if (resp.statusCode == 200) {
      final list = jsonDecode(resp.body) as List;
      return list.map((j) => Clinic.fromJson(j as Map<String, dynamic>)).toList();
    }
    throw ApiException('Failed to load nearby clinics', resp.statusCode);
  }

  Future<Clinic> getClinic(int id) async {
    final resp = await http.get(
      Uri.parse('$baseUrl/api/clinics/$id'),
      headers: _headers,
    );
    if (resp.statusCode == 200) {
      return Clinic.fromJson(jsonDecode(resp.body) as Map<String, dynamic>);
    }
    throw ApiException('Clinic not found', resp.statusCode);
  }

  // ==================== AI ASSISTANT ====================

  Future<AIChatResponse> sendChatMessage(String message, {int? conversationId}) async {
    final body = {
      'message': message,
      if (conversationId != null) 'conversation_id': conversationId,
    };
    final resp = await http.post(
      Uri.parse('$baseUrl/api/ai/chat'),
      headers: _headers,
      body: jsonEncode(body),
    );
    if (resp.statusCode == 200) {
      return AIChatResponse.fromJson(jsonDecode(resp.body) as Map<String, dynamic>);
    }
    throw ApiException('AI chat failed', resp.statusCode);
  }

  // ==================== COMMODITY REQUESTS ====================

  Future<Map<String, dynamic>> requestCommodity({
    required String itemType,
    required int quantity,
    required String deliveryMethod,
    required String deliveryLocation,
  }) async {
    final resp = await http.post(
      Uri.parse('$baseUrl/api/counselling/commodities/'),
      headers: _headers,
      body: jsonEncode({
        'item_type': itemType,
        'quantity': quantity,
        'delivery_method': deliveryMethod,
        'delivery_location': deliveryLocation,
      }),
    );
    if (resp.statusCode == 200) {
      return jsonDecode(resp.body) as Map<String, dynamic>;
    }
    throw ApiException('Commodity request failed', resp.statusCode);
  }

  // ==================== COUNSELLING ====================

  Future<List<Map<String, dynamic>>> getCounsellors({String? specialization}) async {
    final uri = Uri.parse('$baseUrl/api/counselling/counsellors/').replace(
      queryParameters: specialization != null ? {'specialization': specialization} : null,
    );
    final resp = await http.get(uri, headers: _headers);
    if (resp.statusCode == 200) {
      final list = jsonDecode(resp.body) as List;
      return list.cast<Map<String, dynamic>>();
    }
    return [];
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  const ApiException(this.message, this.statusCode);

  @override
  String toString() => 'ApiException($statusCode): $message';
}
