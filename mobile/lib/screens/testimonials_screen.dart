import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';

final List<Testimonial> _staticTestimonials = [
  Testimonial(
    id: 1,
    authorName: 'Chiedza, 21',
    content:
        'MASCOT helped me understand my options when I was confused about contraception. The AI assistant answered all my questions without judgment. I finally feel in control of my health.',
    rating: 5,
    topic: 'contraception',
  ),
  Testimonial(
    id: 2,
    authorName: 'Tatenda, 23',
    content:
        'I was scared to get tested for HIV but the app explained the process calmly and helped me find a clinic nearby. The test came back negative. Knowledge is power!',
    rating: 5,
    topic: 'hiv_prevention',
  ),
  Testimonial(
    id: 3,
    authorName: 'Ruvimbo, 20',
    content:
        'The video guides are amazing. I never knew how to properly use a condom before. Clear, no-nonsense instructions made all the difference.',
    rating: 5,
    topic: 'contraception',
  ),
  Testimonial(
    id: 4,
    authorName: 'Munyaradzi, 22',
    content:
        'As a student, I can\'t always afford to see a doctor. MASCOT gives me reliable health information and connects me to free services. Absolute lifesaver.',
    rating: 5,
    topic: 'general',
  ),
  Testimonial(
    id: 5,
    authorName: 'Shamiso, 24',
    content:
        'I used the commodity request feature to get HIV self-test kits delivered discretely. No embarrassment, no judgment. This is how healthcare should work.',
    rating: 5,
    topic: 'hiv_prevention',
  ),
  Testimonial(
    id: 6,
    authorName: 'Farai, 19',
    content:
        'The counselling booking feature connected me to a wonderful counsellor who helped me talk through my worries. I feel so much better now.',
    rating: 4,
    topic: 'counselling',
  ),
];

class TestimonialsScreen extends StatefulWidget {
  const TestimonialsScreen({super.key});

  @override
  State<TestimonialsScreen> createState() => _TestimonialsScreenState();
}

class _TestimonialsScreenState extends State<TestimonialsScreen> {
  bool _showSubmitForm = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Real Stories'),
        actions: [
          TextButton.icon(
            onPressed: () => setState(() => _showSubmitForm = !_showSubmitForm),
            icon: Icon(_showSubmitForm ? Icons.close : Icons.add, color: Colors.white, size: 18),
            label: Text(
              _showSubmitForm ? 'Cancel' : 'Share Yours',
              style: const TextStyle(color: Colors.white, fontSize: 12),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_showSubmitForm) ...[
              _buildSubmitForm(context),
              const SizedBox(height: 20),
            ],
            _buildStats(),
            const SizedBox(height: 20),
            const Text(
              'Community Stories',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            ..._staticTestimonials.map((t) => _TestimonialCard(testimonial: t)),
          ],
        ),
      ),
    );
  }

  Widget _buildStats() {
    return Row(
      children: [
        Expanded(child: _StatCard(value: '2,400+', label: 'Users Helped', color: AppColors.primary)),
        const SizedBox(width: 12),
        Expanded(child: _StatCard(value: '4.9/5', label: 'Average Rating', color: AppColors.secondary)),
        const SizedBox(width: 12),
        Expanded(child: _StatCard(value: '98%', label: 'Recommend Us', color: const Color(0xFFD97706))),
      ],
    );
  }

  Widget _buildSubmitForm(BuildContext context) {
    final contentController = TextEditingController();
    final nameController = TextEditingController();
    int selectedRating = 5;

    return StatefulBuilder(
      builder: (context, setInnerState) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Share Your Story', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 4),
            const Text(
              'Your story is anonymous and will be reviewed before publishing.',
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                hintText: 'Your name or nickname (e.g. "Tino, 22")',
                labelText: 'Display name',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: contentController,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'How has MASCOT mHealth helped you?',
                labelText: 'Your story',
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Text('Rating: ', style: TextStyle(fontWeight: FontWeight.w500)),
                ...List.generate(
                  5,
                  (i) => GestureDetector(
                    onTap: () => setInnerState(() => selectedRating = i + 1),
                    child: Icon(
                      i < selectedRating ? Icons.star_rounded : Icons.star_outline_rounded,
                      color: AppColors.accent,
                      size: 28,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            ElevatedButton(
              onPressed: () {
                setState(() => _showSubmitForm = false);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Thank you! Your story is under review.'),
                    backgroundColor: AppColors.secondary,
                  ),
                );
              },
              child: const Text('Submit Story'),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  final Color color;
  const _StatCard({required this.value, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: color)),
          Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _TestimonialCard extends StatelessWidget {
  final Testimonial testimonial;
  const _TestimonialCard({required this.testimonial});

  Color get _topicColor {
    switch (testimonial.topic) {
      case 'hiv_prevention': return const Color(0xFF059669);
      case 'contraception': return AppColors.primary;
      case 'counselling': return const Color(0xFF0891B2);
      default: return AppColors.secondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: _topicColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(
                    testimonial.authorName[0],
                    style: TextStyle(color: _topicColor, fontWeight: FontWeight.w700, fontSize: 16),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(testimonial.authorName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    Row(
                      children: List.generate(
                        5,
                        (i) => Icon(
                          i < testimonial.rating ? Icons.star_rounded : Icons.star_outline_rounded,
                          size: 14,
                          color: AppColors.accent,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: _topicColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  testimonial.topic.replaceAll('_', ' '),
                  style: TextStyle(fontSize: 10, color: _topicColor, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '"${testimonial.content}"',
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.6,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }
}
