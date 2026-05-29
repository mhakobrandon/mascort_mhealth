import 'package:flutter/material.dart';
// import 'package:video_player/video_player.dart';
import 'package:video_player/video_player.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/mascot_header.dart';

final List<VideoGuide> _staticGuides = [
  VideoGuide(
    id: 1,
    title: 'How to Use a Male Condom Correctly',
    description:
        'Step-by-step guide to correct condom use for protection against HIV and pregnancy.',
    videoUrl: 'assets/videos/how_to_use_a_condom.mp4',
    durationSeconds: 183,
    category: 'condom_use',
    viewsCount: 1250,
  ),
  VideoGuide(
    id: 2,
    title: 'HIV Prevention Methods',
    description:
        'Learn the main methods used to reduce HIV risk and stay protected.',
    videoUrl: 'assets/videos/methods_of_hiv_prevention.mp4',
    durationSeconds: 245,
    category: 'hiv_prevention',
    viewsCount: 1640,
  ),
  VideoGuide(
    id: 3,
    title: 'HIV Self-Testing',
    description:
        'How to use an HIV self-test kit, read results, and know your next steps.',
    videoUrl: 'assets/videos/hiv_testing.mp4',
    durationSeconds: 310,
    category: 'hiv_testing',
    viewsCount: 2100,
  ),
  VideoGuide(
    id: 4,
    title: 'How to Use PrEP',
    description:
        'PrEP explained — how it works, how to take it, and where to get it.',
    videoUrl: 'assets/videos/how_to_use_prep.mp4',
    durationSeconds: 198,
    category: 'hiv_prevention',
    viewsCount: 1640,
  ),
  VideoGuide(
    id: 5,
    title: 'Morning After Pill Guide',
    description:
        'When and how to use emergency contraception, plus common myths.',
    videoUrl: 'assets/videos/how_to_use_a_morning_after.mp4',
    durationSeconds: 160,
    category: 'contraception',
    viewsCount: 3200,
  ),
  VideoGuide(
    id: 6,
    title: 'HIV Prevention Overview',
    description: 'Simple guide to HIV prevention options and safer choices.',
    videoUrl: 'assets/videos/hiv_prevention.mp4',
    durationSeconds: 275,
    category: 'hiv_prevention',
    viewsCount: 940,
  ),
];

class VideoGuidesScreen extends StatefulWidget {
  const VideoGuidesScreen({super.key});

  @override
  State<VideoGuidesScreen> createState() => _VideoGuidesScreenState();
}

class _VideoGuidesScreenState extends State<VideoGuidesScreen> {
  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);
  static const Color mascotSoftGreen = Color(0xFFE0F2C4);

  final _searchController = TextEditingController();

  bool _showSearch = false;
  String _query = '';
  String _selectedCategory = 'All';

  final _categories = [
    'All',
    'HIV Prevention',
    'Contraception',
    'HIV Testing',
    'Condom Use',
  ];

  final _categoryKeys = [
    '',
    'hiv_prevention',
    'contraception',
    'hiv_testing',
    'condom_use',
  ];

  List<VideoGuide> get _filtered {
    final key = _categoryKeys[_categories.indexOf(_selectedCategory)];

    return _staticGuides.where((guide) {
      final matchesCategory = key.isEmpty || guide.category == key;
      final matchesSearch = _query.isEmpty ||
          guide.title.toLowerCase().contains(_query.toLowerCase()) ||
          guide.description.toLowerCase().contains(_query.toLowerCase());

      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _toggleSearch() {
    setState(() {
      _showSearch = !_showSearch;

      if (!_showSearch) {
        _query = '';
        _searchController.clear();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: mascotLightGreen,
      body: CustomScrollView(
        slivers: [
          const MascotHeader(),
          SliverToBoxAdapter(child: _buildHeader()),
          if (_showSearch) SliverToBoxAdapter(child: _buildSearchField()),
          SliverToBoxAdapter(child: _buildCategoryFilter()),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) => _VideoListTile(guide: _filtered[index]),
              childCount: _filtered.length,
            ),
          ),
          if (_filtered.isEmpty)
            const SliverFillRemaining(
              child: Center(
                child: Text(
                  'No videos found',
                  style: TextStyle(
                    color: Colors.black54,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
      child: Row(
        children: [
          const Expanded(
            child: Text(
              'Video guides',
              style: TextStyle(
                color: mascotDarkGreen,
                fontSize: 32,
                fontWeight: FontWeight.w800,
                height: 1.08,
              ),
            ),
          ),
          GestureDetector(
            onTap: _toggleSearch,
            child: Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: mascotSoftGreen,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(
                _showSearch ? Icons.close_rounded : Icons.search_rounded,
                color: mascotDarkGreen,
                size: 24,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchField() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: TextField(
        controller: _searchController,
        onChanged: (value) => setState(() => _query = value),
        decoration: InputDecoration(
          hintText: 'Search videos...',
          hintStyle: const TextStyle(color: Colors.black45),
          prefixIcon: const Icon(Icons.search, color: mascotDarkGreen),
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(vertical: 11),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(28),
            borderSide: BorderSide(color: mascotGreen.withOpacity(0.3)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(28),
            borderSide: BorderSide(color: mascotGreen.withOpacity(0.3)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(28),
            borderSide: const BorderSide(color: mascotGreen),
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return SizedBox(
      height: 58,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 4),
        itemCount: _categories.length,
        itemBuilder: (context, i) {
          final isSelected = _selectedCategory == _categories[i];

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => setState(() => _selectedCategory = _categories[i]),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: isSelected ? mascotGreen : Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: mascotGreen.withOpacity(0.35)),
                ),
                child: Center(
                  child: Text(
                    _categories[i],
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? Colors.white : mascotDarkGreen,
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

class _VideoListTile extends StatefulWidget {
  final VideoGuide guide;

  const _VideoListTile({required this.guide});

  @override
  State<_VideoListTile> createState() => _VideoListTileState();
}

class _VideoListTileState extends State<_VideoListTile> {
  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  bool _expanded = false;
  VideoPlayerController? _videoController;
  bool _videoReady = false;

  Color get _categoryColor {
    switch (widget.guide.category) {
      case 'hiv_prevention':
        return const Color(0xFF059669);
      case 'hiv_testing':
        return const Color(0xFFDC2626);
      case 'contraception':
        return mascotGreen;
      default:
        return const Color(0xFF0891B2);
    }
  }

  String get _categoryLabel {
    return widget.guide.category
        .replaceAll('_', ' ')
        .split(' ')
        .map((w) => w.isEmpty ? '' : w[0].toUpperCase() + w.substring(1))
        .join(' ');
  }

  Future<void> _toggleExpanded() async {
    setState(() => _expanded = !_expanded);

    if (_expanded && _videoController == null) {
      final controller = VideoPlayerController.asset(widget.guide.videoUrl);
      _videoController = controller;

      await controller.initialize();

      if (!mounted) return;

      setState(() => _videoReady = true);
    }

    if (!_expanded) {
      _videoController?.pause();
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isPlaying = _videoController?.value.isPlaying ?? false;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _categoryColor.withOpacity(0.12)),
        boxShadow: [
          BoxShadow(
            color: mascotGreen.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          InkWell(
            borderRadius: BorderRadius.circular(18),
            onTap: _toggleExpanded,
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      color: _categoryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      Icons.play_circle_fill_rounded,
                      color: _categoryColor,
                      size: 32,
                    ),
                  ),
                  const SizedBox(width: 13),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.guide.title,
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 14,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.guide.description,
                          maxLines: _expanded ? 3 : 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.black54,
                            height: 1.35,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Icon(
                    _expanded
                        ? Icons.keyboard_arrow_up_rounded
                        : Icons.keyboard_arrow_down_rounded,
                    color: mascotDarkGreen,
                  ),
                ],
              ),
            ),
          ),
          if (_expanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
              child: Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      height: 190,
                      width: double.infinity,
                      color: mascotLightGreen,
                      child: _videoReady && _videoController != null
                          ? Stack(
                              alignment: Alignment.center,
                              children: [
                                AspectRatio(
                                  aspectRatio:
                                      _videoController!.value.aspectRatio,
                                  child: VideoPlayer(_videoController!),
                                ),
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      isPlaying
                                          ? _videoController!.pause()
                                          : _videoController!.play();
                                    });
                                  },
                                  child: Container(
                                    width: 58,
                                    height: 58,
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.35),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(
                                      isPlaying
                                          ? Icons.pause_rounded
                                          : Icons.play_arrow_rounded,
                                      color: Colors.white,
                                      size: 34,
                                    ),
                                  ),
                                ),
                                Positioned(
                                  top: 12,
                                  left: 12,
                                  child: _VideoBadge(
                                    text: _categoryLabel,
                                    color: _categoryColor,
                                  ),
                                ),
                                Positioned(
                                  bottom: 12,
                                  right: 12,
                                  child: _VideoBadge(
                                    text: widget.guide.durationLabel,
                                    color: Colors.black54,
                                  ),
                                ),
                              ],
                            )
                          : const Center(
                              child: CircularProgressIndicator(
                                color: mascotGreen,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Icon(
                        Icons.visibility_outlined,
                        size: 14,
                        color: Colors.black38,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${widget.guide.viewsCount} views',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black45,
                        ),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () {
                          if (_videoController == null) return;
                          setState(() {
                            isPlaying
                                ? _videoController!.pause()
                                : _videoController!.play();
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 7,
                          ),
                          decoration: BoxDecoration(
                            color: _categoryColor,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                isPlaying
                                    ? Icons.pause_rounded
                                    : Icons.play_arrow_rounded,
                                size: 16,
                                color: Colors.white,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                isPlaying ? 'Pause' : 'Play Video',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
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

class _VideoBadge extends StatelessWidget {
  final String text;
  final Color color;

  const _VideoBadge({
    required this.text,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
