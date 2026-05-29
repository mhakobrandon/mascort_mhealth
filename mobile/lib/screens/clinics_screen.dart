import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/mascot_header.dart';
import '../widgets/bubble.dart';

class ClinicsScreen extends StatefulWidget {
  const ClinicsScreen({super.key});

  @override
  State<ClinicsScreen> createState() => _ClinicsScreenState();
}

class _ClinicsScreenState extends State<ClinicsScreen> {
  final _searchController = TextEditingController();

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);
  static const Color mascotSoftGreen = Color(0xFFE0F2C4);

  bool _showSearch = false;
  String _query = '';
  String _selectedPlace = 'Harare';

  final List<String> _places = const [
    'Harare',
    'Bulawayo',
    'Mutare',
    'Gweru',
    'Masvingo',
  ];

  final List<_StaticClinic> _clinics = const [
    _StaticClinic(
      name: 'UZ Health Centre',
      city: 'Harare',
      location: 'University of Zimbabwe, Harare',
      phone: '+263 242 303211',
      openingHours: 'Mon-Fri 08:00-17:00',
      services: ['hiv testing', 'contraception', 'youth clinic', 'counselling'],
      rating: 4.5,
    ),
    _StaticClinic(
      name: 'Harare Central Hospital - Youth Clinic',
      city: 'Harare',
      location: 'Mazowe Street, Harare',
      phone: '+263 242 701531',
      openingHours: 'Mon-Sat 07:00-18:00',
      services: ['hiv testing', 'contraception', 'antenatal', 'sti treatment'],
      rating: 4.4,
    ),
    _StaticClinic(
      name: 'ZUPCO Community Health Clinic',
      city: 'Harare',
      location: 'Mbare, Harare',
      phone: '+263 242 552031',
      openingHours: 'Mon-Fri 08:00-16:30',
      services: ['hiv testing', 'prep', 'hiv self test', 'counselling'],
      rating: 4.2,
    ),
    _StaticClinic(
      name: 'Avenues Clinic - Sexual Health Unit',
      city: 'Harare',
      location: 'Baines Avenue, Harare',
      phone: '+263 242 251180',
      openingHours: 'Mon-Sun 08:00-20:00',
      services: ['hiv testing', 'sti treatment', 'contraception', 'prep'],
      rating: 4.6,
    ),
    _StaticClinic(
      name: 'Bulawayo Youth Friendly Clinic',
      city: 'Bulawayo',
      location: 'Fort Street, Bulawayo',
      phone: '+263 29 2861081',
      openingHours: 'Mon-Fri 08:00-17:00',
      services: ['youth clinic', 'contraception', 'hiv testing', 'counselling'],
      rating: 4.3,
    ),
    _StaticClinic(
      name: 'Mpilo Youth Wellness Corner',
      city: 'Bulawayo',
      location: 'Vera Road, Bulawayo',
      phone: '+263 29 2402111',
      openingHours: 'Mon-Fri 08:00-16:00',
      services: ['prep', 'hiv testing', 'contraception', 'sti treatment'],
      rating: 4.2,
    ),
    _StaticClinic(
      name: 'Mutare Provincial Youth Clinic',
      city: 'Mutare',
      location: 'Second Street, Mutare',
      phone: '+263 20 2061234',
      openingHours: 'Mon-Fri 08:00-16:30',
      services: ['hiv testing', 'family planning', 'counselling', 'prep'],
      rating: 4.1,
    ),
    _StaticClinic(
      name: 'Gweru Student Health Centre',
      city: 'Gweru',
      location: 'Mkoba, Gweru',
      phone: '+263 54 2221456',
      openingHours: 'Mon-Sat 08:00-17:00',
      services: ['contraception', 'hiv testing', 'youth clinic', 'pep'],
      rating: 4.0,
    ),
    _StaticClinic(
      name: 'Masvingo Community Health Hub',
      city: 'Masvingo',
      location: 'Robert Mugabe Way, Masvingo',
      phone: '+263 39 2267890',
      openingHours: 'Mon-Fri 08:00-16:00',
      services: ['hiv testing', 'prep', 'contraception', 'counselling'],
      rating: 4.1,
    ),
  ];

  List<_StaticClinic> get _filtered {
    final q = _query.toLowerCase();

    return _clinics.where((clinic) {
      final matchesPlace =
          clinic.city.toLowerCase() == _selectedPlace.toLowerCase();

      final matchesSearch = q.isEmpty ||
          clinic.name.toLowerCase().contains(q) ||
          clinic.location.toLowerCase().contains(q) ||
          clinic.services.any((service) => service.toLowerCase().contains(q));

      return matchesPlace && matchesSearch;
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
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              const MascotHeader(),
              SliverToBoxAdapter(child: _buildHeader()),
              if (_showSearch) SliverToBoxAdapter(child: _buildSearchField()),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 18, 16, 24),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      return _ClinicCard(clinic: _filtered[index]);
                    },
                    childCount: _filtered.length,
                  ),
                ),
              ),
              if (_filtered.isEmpty)
                const SliverFillRemaining(
                  child: Center(
                    child: Text(
                      'No clinics found',
                      style: TextStyle(
                        color: Colors.black54,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              const SliverToBoxAdapter(child: SizedBox(height: 90)),
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

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
      child: Column(
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Find Services',
                  style: TextStyle(
                    color: mascotDarkGreen,
                    fontSize: 25,
                    fontWeight: FontWeight.w900,
                    height: 1.12,
                    letterSpacing: -0.4,
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
          const SizedBox(height: 14),
          SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _places.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final place = _places[index];
                final selected = _selectedPlace == place;

                return InkWell(
                  borderRadius: BorderRadius.circular(22),
                  onTap: () {
                    setState(() {
                      _selectedPlace = place;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 9,
                    ),
                    decoration: BoxDecoration(
                      color: selected ? mascotGreen : mascotSoftGreen,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(
                        color: selected
                            ? mascotGreen
                            : mascotDarkGreen.withOpacity(0.15),
                      ),
                    ),
                    child: Text(
                      place,
                      style: TextStyle(
                        color: selected ? Colors.white : mascotDarkGreen,
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                );
              },
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
        onChanged: (value) {
          setState(() => _query = value);
        },
        decoration: InputDecoration(
          hintText: 'Search by clinic name, location or service...',
          hintStyle: const TextStyle(color: Colors.black45),
          prefixIcon: const Icon(Icons.search, color: mascotDarkGreen),
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(vertical: 11),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(28),
            borderSide: BorderSide(
              color: mascotGreen.withOpacity(0.3),
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(28),
            borderSide: BorderSide(
              color: mascotGreen.withOpacity(0.3),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(28),
            borderSide: const BorderSide(color: mascotGreen),
          ),
        ),
      ),
    );
  }
}

class _ClinicCard extends StatelessWidget {
  final _StaticClinic clinic;

  const _ClinicCard({required this.clinic});

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: mascotGreen.withOpacity(0.12),
        ),
        boxShadow: [
          BoxShadow(
            color: mascotGreen.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  clinic.name,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: mascotGreen.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.star_rounded,
                      size: 13,
                      color: mascotDarkGreen,
                    ),
                    const SizedBox(width: 3),
                    Text(
                      clinic.rating.toStringAsFixed(1),
                      style: const TextStyle(
                        color: mascotDarkGreen,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 7),
          Row(
            children: [
              const Icon(
                Icons.location_on_outlined,
                size: 16,
                color: Colors.black45,
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  clinic.location,
                  style: const TextStyle(
                    color: Colors.black54,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 7,
            runSpacing: 7,
            children: clinic.services.map((service) {
              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFF4F7F2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  service,
                  style: const TextStyle(
                    color: Colors.black54,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              );
            }).toList(),
          ),
          const Divider(height: 26),
          Row(
            children: [
              const Icon(
                Icons.access_time_rounded,
                size: 16,
                color: Colors.black45,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  clinic.openingHours,
                  style: const TextStyle(
                    color: Colors.black54,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF22C55E),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.phone_rounded,
                      color: Colors.white,
                      size: 15,
                    ),
                    const SizedBox(width: 5),
                    Text(
                      clinic.phone,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StaticClinic {
  final String name;
  final String city;
  final String location;
  final String phone;
  final String openingHours;
  final List<String> services;
  final double rating;

  const _StaticClinic({
    required this.name,
    required this.city,
    required this.location,
    required this.phone,
    required this.openingHours,
    required this.services,
    required this.rating,
  });
}
