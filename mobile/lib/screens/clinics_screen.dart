import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class ClinicsScreen extends StatefulWidget {
  const ClinicsScreen({super.key});

  @override
  State<ClinicsScreen> createState() => _ClinicsScreenState();
}

class _ClinicsScreenState extends State<ClinicsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Clinic> _clinics = [];
  bool _loading = true;
  String? _error;
  final _searchController = TextEditingController();
  List<Clinic> _filtered = [];

  // Harare, Zimbabwe default coords
  static const double _defaultLat = -17.8252;
  static const double _defaultLon = 31.0335;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadClinics();
  }

  Future<void> _loadClinics() async {
    setState(() { _loading = true; _error = null; });
    try {
      final data = await ApiService.instance.getClinics();
      if (mounted) {
        setState(() {
          _clinics = data;
          _filtered = data;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _loading = false; });
    }
  }

  void _onSearch(String q) {
    setState(() {
      _filtered = q.isEmpty
          ? _clinics
          : _clinics.where((c) =>
              c.name.toLowerCase().contains(q.toLowerCase()) ||
              c.location.toLowerCase().contains(q.toLowerCase())).toList();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Find Services'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(96),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: TextField(
                  controller: _searchController,
                  onChanged: _onSearch,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search clinics...',
                    hintStyle: const TextStyle(color: Colors.white54),
                    prefixIcon: const Icon(Icons.search, color: Colors.white70),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30),
                      borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30),
                      borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30),
                      borderSide: const BorderSide(color: Colors.white70),
                    ),
                    fillColor: Colors.white.withOpacity(0.15),
                    filled: true,
                    contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ),
              TabBar(
                controller: _tabController,
                indicatorColor: Colors.white,
                labelColor: Colors.white,
                unselectedLabelColor: Colors.white60,
                tabs: const [
                  Tab(icon: Icon(Icons.list_rounded), text: 'List'),
                  Tab(icon: Icon(Icons.map_rounded), text: 'Map'),
                ],
              ),
            ],
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildListView(),
          _buildMapView(),
        ],
      ),
    );
  }

  Widget _buildListView() {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off_rounded, size: 60, color: AppColors.textLight),
            const SizedBox(height: 12),
            const Text('Could not load clinics'),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _loadClinics, child: const Text('Retry')),
          ],
        ),
      );
    }
    if (_filtered.isEmpty) {
      return const Center(child: Text('No clinics found'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _filtered.length,
      itemBuilder: (context, i) => _ClinicCard(clinic: _filtered[i]),
    );
  }

  Widget _buildMapView() {
    // Map placeholder — integrate flutter_map with actual tile provider in production
    return Stack(
      children: [
        Container(
          color: const Color(0xFFE8F5E9),
          child: const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.map_rounded, size: 80, color: AppColors.secondary),
                SizedBox(height: 16),
                Text(
                  'Map View',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                ),
                SizedBox(height: 8),
                Text(
                  'Add your Google Maps API key\nto enable full map functionality',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                ),
              ],
            ),
          ),
        ),
        // Clinic pins overlay
        Positioned(
          bottom: 20,
          left: 16,
          right: 16,
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10)],
            ),
            child: Row(
              children: [
                const Icon(Icons.location_on_rounded, color: AppColors.secondary),
                const SizedBox(width: 8),
                Text(
                  '${_clinics.length} clinics near Harare, Zimbabwe',
                  style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _ClinicCard extends StatelessWidget {
  final Clinic clinic;
  const _ClinicCard({required this.clinic});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.secondary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.local_hospital_rounded, color: AppColors.secondary, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(clinic.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                      Text(clinic.location, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                    ],
                  ),
                ),
                if (clinic.isLgbtqFriendly)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'LGBTQ+',
                      style: TextStyle(fontSize: 10, color: AppColors.primary, fontWeight: FontWeight.w500),
                    ),
                  ),
              ],
            ),
            if (clinic.services.isNotEmpty) ...[
              const SizedBox(height: 10),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: clinic.services.take(4).map((s) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.divider),
                  ),
                  child: Text(
                    s.replaceAll('_', ' '),
                    style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                  ),
                )).toList(),
              ),
            ],
            const Divider(height: 20),
            Row(
              children: [
                const Icon(Icons.access_time_rounded, size: 14, color: AppColors.textLight),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    clinic.openingHours,
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                ),
                GestureDetector(
                  onTap: () {},
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.phone_rounded, size: 14, color: Colors.white),
                        const SizedBox(width: 4),
                        Text(
                          clinic.phone,
                          style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w500),
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
    );
  }
}
