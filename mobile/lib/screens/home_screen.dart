import 'package:flutter/material.dart';
import 'prevention_screen.dart';
import 'commodity_request_screen.dart';
import 'ai_chat_screen.dart';
import '../widgets/prevention_carousel.dart';
// import '../widgets/home_testimonials.dart';
import '../widgets/mascot_header.dart';
import '../widgets/bubble.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: mascotLightGreen,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              const MascotHeader(),
              SliverToBoxAdapter(child: _buildHero()),
              SliverToBoxAdapter(child: _buildMainButtons(context)),
              const SliverToBoxAdapter(child: SizedBox(height: 8)),
              const SliverToBoxAdapter(child: PreventionCarousel()),
              // const SliverToBoxAdapter(child: HomeTestimonials()),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
          const Positioned(
            right: 16,
            bottom: 18,
            child: AIChatBubble(),
          ),
        ],
      ),
    );
  }

  Widget _buildHero() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
      child: Container(
        constraints: const BoxConstraints(minHeight: 240),
        padding: const EdgeInsets.fromLTRB(18, 12, 10, 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: mascotGreen.withOpacity(0.14),
              blurRadius: 22,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Expanded(
              flex: 6,
              child: Padding(
                padding: EdgeInsets.only(right: 6),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Knowledge protects,\nchoices empower',
                      style: TextStyle(
                        color: mascotDarkGreen,
                        fontSize: 25,
                        fontWeight: FontWeight.w900,
                        height: 1.12,
                        letterSpacing: -0.4,
                      ),
                    ),
                    SizedBox(height: 12),
                    Text(
                      'Private and supportive HIV & pregnancy prevention information made for you.',
                      style: TextStyle(
                        color: Colors.black54,
                        fontSize: 13.5,
                        fontWeight: FontWeight.w600,
                        height: 1.45,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              flex: 5,
              child: SizedBox(
                height: 235,
                child: Transform.scale(
                  scale: 1.5,
                  child: Image.asset(
                    'assets/person.png',
                    fit: BoxFit.contain,
                    alignment: Alignment.center,
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(
                        child: Icon(
                          Icons.person,
                          size: 92,
                          color: mascotGreen,
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMainButtons(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(6, 8, 6, 0),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _PrimaryActionCard(
                  title: 'HIV & Pregnancy \nInfo',
                  icon: Icons.shield_rounded,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const PreventionScreen(),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 2),
              Expanded(
                child: _PrimaryActionCard(
                  title: 'Ask AI\nAssistant',
                  icon: Icons.smart_toy_rounded,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const AIChatScreen(),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _WideActionCard(
            title: 'Distribution & Commodity Request',
            icon: Icons.inventory_2_rounded,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const CommodityRequestScreen(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PrimaryActionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _PrimaryActionCard({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  static const Color mascotGreen = Color(0xFF93C962);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: mascotGreen,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onTap,
        child: Container(
          height: 74,
          padding: const EdgeInsets.symmetric(
            horizontal: 10,
            vertical: 10,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(
                icon,
                color: Colors.white,
                size: 25,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    height: 1.18,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _WideActionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _WideActionCard({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  static const Color mascotGreen = Color(0xFF93C962);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onTap,
        child: Container(
          height: 74,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: mascotGreen,
              width: 2,
            ),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                color: mascotGreen,
                size: 25,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: mascotGreen,
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    height: 1.18,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
