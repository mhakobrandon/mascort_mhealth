import 'package:flutter/material.dart';
import '../screens/ai_chat_screen.dart';

class AIChatBubble extends StatelessWidget {
  const AIChatBubble({super.key});

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 7,
          ),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: mascotGreen.withOpacity(0.12),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: const Text(
            'Chat with our AI',
            style: TextStyle(
              color: mascotDarkGreen,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        FloatingActionButton(
          heroTag: 'ai_chat_bubble',
          backgroundColor: mascotGreen,
          elevation: 4,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AIChatScreen()),
            );
          },
          child: const Icon(
            Icons.smart_toy_rounded,
            color: Colors.white,
          ),
        ),
      ],
    );
  }
}
