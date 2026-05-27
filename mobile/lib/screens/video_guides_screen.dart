import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';

// Static data — replace with API call when video guides are seeded
final List<VideoGuide> _staticGuides = [
  VideoGuide(
    id: 1,
    title: 'How to Use a Male Condom Correctly',
    description: 'Step-by-step guide to correct condom use for maximum protection against HIV and pregnancy.',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    durationSeconds: 183,
    category: 'condom_use',
    viewsCount: 1250,
  ),
  VideoGuide(
    id: 2,
    title: 'Understanding Oral Contraceptives',
    description: 'What you need to know about the contraceptive pill — how it works, when to take it, and what to do if you miss a dose.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    durationSeconds: 245,
    category: 'contraception',
    viewsCount: 890,
  ),
  VideoGuide(
    id: 3,
    title: 'HIV Self-Testing: A Step-by-Step Guide',
    description: 'How to use an HIV rapid self-test kit at home — reading results and next steps.',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    durationSeconds: 310,
    category: 'hiv_testing',
    viewsCount: 2100,
  ),
  VideoGuide(
    id: 4,
    title: 'What is PrEP and Who Should Take It?',
    description: 'Pre-exposure prophylaxis (PrEP) explained — who it\'s for, how it works and where to get it in Zimbabwe.',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    durationSeconds: 198,
    category: 'hiv_prevention',
    viewsCount: 1640,
  ),
  VideoGuide(
    id: 5,
    title: 'Emergency Contraception (Morning-After Pill)',
    description: 'When and how to use emergency contraception, common myths debunked.',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    durationSeconds: 160,
    category: 'contraception',
    viewsCount: 3200,
  ),
  VideoGuide(
    id: 6,
    title: 'Talking to Your Partner About Sexual Health',
    description: 'Tips for open, comfortable conversations about consent, testing and contraception with your partner.',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    durationSeconds: 275,
    category: 'relationships',
    viewsCount: 940,
  ),
];

class VideoGuidesScreen extends StatefulWidget {
  const VideoGuidesScreen({super.key});

  @override
  State<VideoGuidesScreen> createState() => _VideoGuidesScreenState();
}

class _VideoGuidesScreenState extends State<VideoGuidesScreen> {
  String _selectedCategory = 'All';
  final _categories = ['All', 'HIV Prevention', 'Contraception', 'HIV Testing', 'Relationships'];
  final _categoryKeys = ['', 'hiv_prevention', 'contraception', 'hiv_testing', 'relationships'];

  List<VideoGuide> get _filtered {
    final key = _categoryKeys[_categories.indexOf(_selectedCategory)];
    return key.isEmpty ? _staticGuides : _staticGuides.where((g) => g.category == key).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Video Guides')),
      body: Column(
        children: [
          _buildCategoryFilter(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _filtered.length,
              itemBuilder: (context, i) => _VideoCard(guide: _filtered[i]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return SizedBox(
      height: 48,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: _categories.length,
        itemBuilder: (context, i) {
          final isSelected = _selectedCategory == _categories[i];
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => setState(() => _selectedCategory = _categories[i]),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected ? AppColors.primary : AppColors.divider,
                  ),
                ),
                child: Center(
                  child: Text(
                    _categories[i],
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: isSelected ? Colors.white : AppColors.textSecondary,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _VideoCard extends StatelessWidget {
  final VideoGuide guide;
  const _VideoCard({required this.guide});

  Color get _categoryColor {
    switch (guide.category) {
      case 'hiv_prevention': return const Color(0xFF059669);
      case 'hiv_testing': return const Color(0xFFDC2626);
      case 'contraception': return AppColors.primary;
      default: return const Color(0xFF0891B2);
    }
  }

  String get _categoryLabel {
    return guide.category.replaceAll('_', ' ').split(' ')
        .map((w) => w.isEmpty ? '' : w[0].toUpperCase() + w.substring(1))
        .join(' ');
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail placeholder
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Container(
              height: 160,
              color: _categoryColor.withOpacity(0.1),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Icon(Icons.play_circle_filled_rounded, size: 64, color: _categoryColor),
                  Positioned(
                    bottom: 10,
                    right: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        guide.durationLabel,
                        style: const TextStyle(color: Colors.white, fontSize: 12),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 10,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: _categoryColor,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        _categoryLabel,
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  guide.title,
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text(
                  guide.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    const Icon(Icons.visibility_outlined, size: 14, color: AppColors.textLight),
                    const SizedBox(width: 4),
                    Text(
                      '${guide.viewsCount} views',
                      style: const TextStyle(fontSize: 12, color: AppColors.textLight),
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: () {},
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                        decoration: BoxDecoration(
                          color: _categoryColor,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.play_arrow_rounded, size: 16, color: Colors.white),
                            SizedBox(width: 4),
                            Text('Watch', style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.w500)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
