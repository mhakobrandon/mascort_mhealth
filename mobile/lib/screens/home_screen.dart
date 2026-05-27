import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'prevention_screen.dart';
import 'clinics_screen.dart';
import 'ai_chat_screen.dart';
import 'commodity_request_screen.dart';
import 'video_guides_screen.dart';
import 'testimonials_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildHeroHeader(context),
          SliverToBoxAdapter(child: _buildQuickActions(context)),
          SliverToBoxAdapter(child: _buildAIBanner(context)),
          SliverToBoxAdapter(child: _buildCategorySection(context)),
          SliverToBoxAdapter(child: _buildHealthTip()),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  Widget _buildHeroHeader(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 220,
      floating: false,
      pinned: true,
      backgroundColor: AppColors.primary,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [AppColors.gradientStart, AppColors.gradientEnd],
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.health_and_safety_rounded,
                          color: Colors.white,
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'MASCOT mHealth',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Your health journey\nstarts here',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w700,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Private, safe and non-judgmental health support',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.85),
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        title: const Text('MASCOT mHealth',
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
        titlePadding: const EdgeInsetsDirectional.only(start: 16, bottom: 14),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      _QuickAction(
        icon: Icons.shield_rounded,
        label: 'Prevention\nMethods',
        color: AppColors.primary,
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PreventionScreen())),
      ),
      _QuickAction(
        icon: Icons.location_on_rounded,
        label: 'Find a\nClinic',
        color: const Color(0xFF059669),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ClinicsScreen())),
      ),
      _QuickAction(
        icon: Icons.inventory_2_rounded,
        label: 'Request\nSupplies',
        color: const Color(0xFFD97706),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CommodityRequestScreen())),
      ),
      _QuickAction(
        icon: Icons.local_hospital_rounded,
        label: 'Urgent\nCare',
        color: const Color(0xFFDC2626),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ClinicsScreen())),
      ),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Quick Actions', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          Row(
            children: actions
                .map((a) => Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: _QuickActionCard(action: a),
                      ),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildAIBanner(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: GestureDetector(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AIChatScreen())),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF7B2FBE), Color(0xFF3B82F6)],
            ),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.smart_toy_rounded, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Ask MASCOT AI',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
                    ),
                    SizedBox(height: 3),
                    Text(
                      'Get private, confidential answers\nabout sexual health',
                      style: TextStyle(color: Colors.white70, fontSize: 12, height: 1.4),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white60, size: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategorySection(BuildContext context) {
    final categories = [
      _Category(
        icon: Icons.play_circle_filled_rounded,
        label: 'Video Guides',
        subtitle: 'How-to tutorials',
        color: const Color(0xFF7C3AED),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const VideoGuidesScreen())),
      ),
      _Category(
        icon: Icons.format_quote_rounded,
        label: 'Testimonials',
        subtitle: 'Real stories',
        color: const Color(0xFF059669),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TestimonialsScreen())),
      ),
      _Category(
        icon: Icons.chat_bubble_rounded,
        label: 'Counselling',
        subtitle: 'Talk to a pro',
        color: const Color(0xFFD97706),
        onTap: () {},
      ),
      _Category(
        icon: Icons.groups_rounded,
        label: 'Support Groups',
        subtitle: 'Peer support',
        color: const Color(0xFF0891B2),
        onTap: () {},
      ),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Explore', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.6,
            children: categories.map((c) => _CategoryCard(category: c)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthTip() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.secondary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.secondary.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.secondary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.lightbulb_rounded, color: AppColors.secondary, size: 22),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Health Tip', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.secondary)),
                  SizedBox(height: 3),
                  Text(
                    'Consistent condom use reduces HIV transmission risk by up to 85%. Use correctly every time.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==================== Helper widgets ====================

class _QuickAction {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QuickAction({required this.icon, required this.label, required this.color, required this.onTap});
}

class _QuickActionCard extends StatelessWidget {
  final _QuickAction action;
  const _QuickActionCard({required this.action});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: action.onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 6),
        decoration: BoxDecoration(
          color: action.color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: action.color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(action.icon, color: action.color, size: 26),
            const SizedBox(height: 6),
            Text(
              action.label,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: action.color, height: 1.3),
            ),
          ],
        ),
      ),
    );
  }
}

class _Category {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;
  const _Category({required this.icon, required this.label, required this.subtitle, required this.color, required this.onTap});
}

class _CategoryCard extends StatelessWidget {
  final _Category category;
  const _CategoryCard({required this.category});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: category.onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [BoxShadow(color: category.color.withOpacity(0.1), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: category.color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(category.icon, color: category.color, size: 22),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(category.label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  Text(category.subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
