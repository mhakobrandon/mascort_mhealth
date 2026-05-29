import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'video_guides_screen.dart';
import 'commodity_request_screen.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('More')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildProfileCard(),
            const SizedBox(height: 24),
            const Text('Health Resources',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            _MoreItem(
              icon: Icons.play_circle_outline_rounded,
              label: 'Video Guides',
              subtitle: 'Step-by-step health tutorials',
              color: const Color(0xFF7C3AED),
              onTap: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const VideoGuidesScreen())),
            ),
            // _MoreItem(
            //   icon: Icons.format_quote_rounded,
            //   label: 'Community Stories',
            //   subtitle: 'Real experiences from peers',
            //   color: const Color(0xFF059669),
            //   onTap: () => Navigator.push(
            //       context,
            //       MaterialPageRoute(
            //           builder: (_) => const TestimonialsScreen())),
            // ),
            _MoreItem(
              icon: Icons.inventory_2_outlined,
              label: 'Request Supplies',
              subtitle: 'Condoms, pills, HIV test kits',
              color: const Color(0xFFD97706),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => const CommodityRequestScreen())),
            ),
            const SizedBox(height: 20),
            const Text('Support',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            _MoreItem(
              icon: Icons.chat_bubble_outline_rounded,
              label: 'Book Counselling',
              subtitle: 'Talk to a professional',
              color: const Color(0xFF0891B2),
              onTap: () {},
            ),
            _MoreItem(
              icon: Icons.groups_outlined,
              label: 'Support Groups',
              subtitle: 'Peer-to-peer community',
              color: const Color(0xFFDC2626),
              onTap: () {},
            ),
            const SizedBox(height: 20),
            const Text('About',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            _MoreItem(
              icon: Icons.info_outline_rounded,
              label: 'About MASCOT',
              subtitle: 'CeSHHAR Zimbabwe project',
              color: AppColors.primary,
              onTap: () => _showAbout(context),
            ),
            _MoreItem(
              icon: Icons.privacy_tip_outlined,
              label: 'Privacy Policy',
              subtitle: 'How we protect your data',
              color: AppColors.textSecondary,
              onTap: () => _showPrivacy(context),
            ),
            const SizedBox(height: 32),
            Center(
              child: Column(
                children: [
                  const Icon(Icons.health_and_safety_rounded,
                      size: 32, color: AppColors.primary),
                  const SizedBox(height: 6),
                  const Text('MASCOT mHealth v1.0.0',
                      style: TextStyle(
                          color: AppColors.textSecondary, fontSize: 12)),
                  Text('Team HealthBridge • University of Zimbabwe',
                      style:
                          TextStyle(color: AppColors.textLight, fontSize: 11)),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.gradientStart, AppColors.gradientEnd],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.25),
              borderRadius: BorderRadius.circular(14),
            ),
            child:
                const Icon(Icons.person_rounded, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Anonymous User',
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 16)),
                Text('Your identity is protected',
                    style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.lock_rounded, size: 12, color: Colors.white),
                SizedBox(width: 4),
                Text('Private',
                    style: TextStyle(color: Colors.white, fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showAbout(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('About MASCOT mHealth'),
        content: const Text(
          'MASCOT mHealth is a digital health platform designed for tertiary students in Zimbabwe.\n\n'
          'Built by Team HealthBridge (University of Zimbabwe) for the MASCOT Hackathon 2026 by CeSHHAR Zimbabwe.\n\n'
          'Our mission: provide safe, judgment-free, and accessible sexual health information and services to young people.',
          style: TextStyle(height: 1.6),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close')),
        ],
      ),
    );
  }

  void _showPrivacy(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Privacy Policy'),
        content: const SingleChildScrollView(
          child: Text(
            'We are committed to your privacy:\n\n'
            '• No personal information is collected\n'
            '• You are identified only by an anonymous UUID\n'
            '• No name, email, or phone number required\n'
            '• AI conversations are private and not shared\n'
            '• Health data is never sold to third parties\n'
            '• You can request data deletion at any time\n\n'
            'MASCOT complies with Zimbabwe data protection guidelines.',
            style: TextStyle(height: 1.6),
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close')),
        ],
      ),
    );
  }
}

class _MoreItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;
  const _MoreItem({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 2),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(label,
          style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14)),
      subtitle: Text(subtitle,
          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
      trailing: const Icon(Icons.arrow_forward_ios_rounded,
          size: 14, color: AppColors.textLight),
    );
  }
}
