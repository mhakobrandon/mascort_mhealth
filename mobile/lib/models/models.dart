// ==================== PREVENTION ====================

class PreventionMethod {
  final int id;
  final String name;
  final String category;
  final String description;
  final int effectiveness;
  final String cost;
  final String sideEffects;
  final String howToUse;
  final Map<String, dynamic>? details;

  const PreventionMethod({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.effectiveness,
    required this.cost,
    required this.sideEffects,
    required this.howToUse,
    this.details,
  });

  factory PreventionMethod.fromJson(Map<String, dynamic> json) => PreventionMethod(
        id: json['id'] as int,
        name: json['name'] as String,
        category: json['category'] as String,
        description: json['description'] as String,
        effectiveness: json['effectiveness'] as int,
        cost: json['cost'] as String,
        sideEffects: json['side_effects'] as String,
        howToUse: json['how_to_use'] as String,
        details: json['details'] as Map<String, dynamic>?,
      );

  String get categoryLabel {
    switch (category) {
      case 'contraception': return 'Contraception';
      case 'hiv_prevention': return 'HIV Prevention';
      case 'emergency': return 'Emergency';
      default: return category;
    }
  }
}

// ==================== CLINICS ====================

class Clinic {
  final int id;
  final String name;
  final String location;
  final double latitude;
  final double longitude;
  final String phone;
  final List<String> services;
  final String openingHours;
  final bool isLgbtqFriendly;
  final double rating;
  double? distanceKm;

  Clinic({
    required this.id,
    required this.name,
    required this.location,
    required this.latitude,
    required this.longitude,
    required this.phone,
    required this.services,
    required this.openingHours,
    required this.isLgbtqFriendly,
    required this.rating,
    this.distanceKm,
  });

  factory Clinic.fromJson(Map<String, dynamic> json) => Clinic(
        id: json['id'] as int,
        name: json['name'] as String,
        location: json['location'] as String,
        latitude: (json['latitude'] as num).toDouble(),
        longitude: (json['longitude'] as num).toDouble(),
        phone: json['phone'] as String,
        services: List<String>.from(json['services'] as List),
        openingHours: json['opening_hours'] as String,
        isLgbtqFriendly: json['is_lgbtq_friendly'] as bool? ?? true,
        rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
        distanceKm: (json['distance_km'] as num?)?.toDouble(),
      );
}

// ==================== AI CHAT ====================

class ChatMessage {
  final String role; // 'user' | 'assistant'
  final String content;
  final DateTime timestamp;

  const ChatMessage({
    required this.role,
    required this.content,
    required this.timestamp,
  });

  bool get isUser => role == 'user';
}

class AIChatResponse {
  final int? conversationId;
  final String response;
  final double confidence;
  final List<String> sources;

  const AIChatResponse({
    this.conversationId,
    required this.response,
    required this.confidence,
    required this.sources,
  });

  factory AIChatResponse.fromJson(Map<String, dynamic> json) => AIChatResponse(
        conversationId: json['conversation_id'] as int?,
        response: json['response'] as String,
        confidence: (json['confidence'] as num).toDouble(),
        sources: List<String>.from(json['sources'] as List? ?? []),
      );
}

// ==================== TESTIMONIALS ====================

class Testimonial {
  final int id;
  final String authorName;
  final String content;
  final int rating;
  final String topic;

  const Testimonial({
    required this.id,
    required this.authorName,
    required this.content,
    required this.rating,
    required this.topic,
  });

  factory Testimonial.fromJson(Map<String, dynamic> json) => Testimonial(
        id: json['id'] as int,
        authorName: json['author_name'] as String,
        content: json['content'] as String,
        rating: json['rating'] as int,
        topic: json['topic'] as String,
      );
}

// ==================== VIDEO GUIDES ====================

class VideoGuide {
  final int id;
  final String title;
  final String description;
  final String videoUrl;
  final int durationSeconds;
  final String category;
  final String? thumbnailUrl;
  final int viewsCount;

  const VideoGuide({
    required this.id,
    required this.title,
    required this.description,
    required this.videoUrl,
    required this.durationSeconds,
    required this.category,
    this.thumbnailUrl,
    required this.viewsCount,
  });

  factory VideoGuide.fromJson(Map<String, dynamic> json) => VideoGuide(
        id: json['id'] as int,
        title: json['title'] as String,
        description: json['description'] as String,
        videoUrl: json['video_url'] as String,
        durationSeconds: json['duration_seconds'] as int,
        category: json['category'] as String,
        thumbnailUrl: json['thumbnail_url'] as String?,
        viewsCount: json['views_count'] as int? ?? 0,
      );

  String get durationLabel {
    final m = durationSeconds ~/ 60;
    final s = durationSeconds % 60;
    return '${m}m ${s.toString().padLeft(2, '0')}s';
  }
}

// ==================== COMMODITY REQUEST ====================

class CommodityType {
  static const condom = 'condom';
  static const pill = 'pill';
  static const injectable = 'injectable';
  static const implant = 'implant';
  static const iud = 'iud';
  static const hivSelfTest = 'hiv_self_test';

  static List<String> get all => [condom, pill, injectable, implant, iud, hivSelfTest];

  static String label(String type) {
    switch (type) {
      case condom: return 'Condoms';
      case pill: return 'Contraceptive Pills';
      case injectable: return 'Injectable';
      case implant: return 'Implant';
      case iud: return 'IUD';
      case hivSelfTest: return 'HIV Self-Test Kit';
      default: return type;
    }
  }
}

// ==================== USER ====================

class UserSession {
  final String userId;
  final String token;
  final String sessionToken;

  const UserSession({
    required this.userId,
    required this.token,
    required this.sessionToken,
  });

  factory UserSession.fromJson(Map<String, dynamic> json) => UserSession(
        userId: json['user_id'] as String,
        token: json['token'] as String,
        sessionToken: json['session_token'] as String,
      );
}
