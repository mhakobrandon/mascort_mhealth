import 'dart:async';
import 'package:flutter/material.dart';

class PreventionCarousel extends StatefulWidget {
  const PreventionCarousel({super.key});

  @override
  State<PreventionCarousel> createState() => _PreventionCarouselState();
}

class _PreventionCarouselState extends State<PreventionCarousel> {
  final PageController _pageController = PageController();

  Timer? _timer;
  int _currentIndex = 0;

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotSoftGreen = Color(0xFFE0F2C4);

  final List<_PreventionSlide> _slides = const [
    _PreventionSlide(
      image: 'assets/condoms.png',
      title: 'Condoms',
      description: 'Helps prevent HIV, STIs and pregnancy.',
    ),
    _PreventionSlide(
      image: 'assets/prep.png',
      title: 'PrEP',
      description: 'Daily medicine that helps prevent HIV.',
    ),
    _PreventionSlide(
      image: 'assets/depo.png',
      title: 'Depo',
      description: 'A contraceptive injection option.',
    ),
    _PreventionSlide(
      image: 'assets/contraceptive.png',
      title: 'Contraceptives',
      description: 'Pregnancy prevention options.',
    ),
  ];

  @override
  void initState() {
    super.initState();

    _timer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (!_pageController.hasClients) return;

      final nextPage = (_currentIndex + 1) % _slides.length;

      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 450),
        curve: Curves.easeInOut,
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Container(
        height: 290,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: mascotGreen.withOpacity(0.22),
          ),
          boxShadow: [
            BoxShadow(
              color: mascotGreen.withOpacity(0.10),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _slides.length,
                onPageChanged: (index) {
                  setState(() => _currentIndex = index);
                },
                itemBuilder: (context, index) {
                  final slide = _slides[index];

                  return Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      children: [
                        SizedBox(
                          width: double.infinity,
                          height: 170,
                          child: Center(
                            child: FractionallySizedBox(
                              widthFactor: 0.9,
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(16),
                                child: Image.asset(
                                  slide.image,
                                  width: double.infinity,
                                  height: 170,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          slide.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: mascotDarkGreen,
                            fontSize: 17,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            slide.description,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.black54,
                              fontSize: 12,
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _slides.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 220),
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    height: 5,
                    width: _currentIndex == index ? 18 : 6,
                    decoration: BoxDecoration(
                      color: _currentIndex == index
                          ? mascotGreen
                          : mascotSoftGreen,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PreventionSlide {
  final String image;
  final String title;
  final String description;

  const _PreventionSlide({
    required this.image,
    required this.title,
    required this.description,
  });
}
