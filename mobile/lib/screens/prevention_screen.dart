import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import 'prevention_detail_screen.dart';

class PreventionScreen extends StatefulWidget {
  const PreventionScreen({super.key});

  @override
  State<PreventionScreen> createState() => _PreventionScreenState();
}

class _PreventionScreenState extends State<PreventionScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _searchController = TextEditingController();

  final _categories = const ['All', 'Contraception', 'HIV Prevention', 'Emergency'];
  final _categoryKeys = const ['', 'contraception', 'hiv_prevention', 'emergency'];

  List<PreventionMethod> _methods = [];
  List<PreventionMethod> _filtered = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _categories.length, vsync: this);
    _tabController.addListener(_onTabChanged);
    _loadMethods();
  }

  void _onTabChanged() {
    if (!_tabController.indexIsChanging) _loadMethods();
  }

  Future<void> _loadMethods() async {
    setState(() { _loading = true; _error = null; });
    try {
      final cat = _categoryKeys[_tabController.index];
      final data = await ApiService.instance.getPreventionMethods(
        category: cat.isEmpty ? null : cat,
      );
      if (mounted) {
        setState(() {
          _methods = data;
          _filtered = data;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _loading = false; });
    }
  }

  void _onSearch(String query) {
    setState(() {
      _filtered = query.isEmpty
          ? _methods
          : _methods.where((m) =>
              m.name.toLowerCase().contains(query.toLowerCase()) ||
              m.description.toLowerCase().contains(query.toLowerCase())).toList();
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
        title: const Text('Prevention Methods'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(100),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: TextField(
                  controller: _searchController,
                  onChanged: _onSearch,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search methods...',
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
                isScrollable: true,
                indicatorColor: Colors.white,
                indicatorWeight: 3,
                labelColor: Colors.white,
                unselectedLabelColor: Colors.white60,
                labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                tabs: _categories.map((c) => Tab(text: c)).toList(),
              ),
            ],
          ),
        ),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return _buildError();
    }
    if (_filtered.isEmpty) {
      return _buildEmpty();
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _filtered.length,
      itemBuilder: (context, i) => _PreventionCard(
        method: _filtered[i],
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => PreventionDetailScreen(method: _filtered[i])),
        ),
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.wifi_off_rounded, size: 60, color: AppColors.textLight),
          const SizedBox(height: 12),
          const Text('Could not load data', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          const Text('Check your connection and try again', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: _loadMethods, child: const Text('Retry')),
        ],
      ),
    );
  }

  Widget _buildEmpty() {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.search_off_rounded, size: 60, color: AppColors.textLight),
          SizedBox(height: 12),
          Text('No methods found', style: TextStyle(fontWeight: FontWeight.w600)),
          SizedBox(height: 4),
          Text('Try a different search or category', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
        ],
      ),
    );
  }
}

class _PreventionCard extends StatelessWidget {
  final PreventionMethod method;
  final VoidCallback onTap;
  const _PreventionCard({required this.method, required this.onTap});

  Color get _categoryColor {
    switch (method.category) {
      case 'contraception': return const Color(0xFF7B2FBE);
      case 'hiv_prevention': return const Color(0xFF059669);
      case 'emergency': return const Color(0xFFDC2626);
      default: return AppColors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: _categoryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  method.category == 'hiv_prevention'
                      ? Icons.coronavirus_rounded
                      : method.category == 'emergency'
                          ? Icons.warning_rounded
                          : Icons.medication_rounded,
                  color: _categoryColor,
                  size: 26,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            method.name,
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: _categoryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            method.categoryLabel,
                            style: TextStyle(fontSize: 10, color: _categoryColor, fontWeight: FontWeight.w500),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      method.description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Flexible(
                          child: _StatBadge(
                            icon: Icons.bar_chart_rounded,
                            label: '${method.effectiveness}% effective',
                            color: method.effectiveness >= 90
                                ? AppColors.secondary
                                : method.effectiveness >= 70
                                    ? AppColors.accent
                                    : AppColors.error,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          child: _StatBadge(
                            icon: Icons.attach_money_rounded,
                            label: method.cost,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textLight),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _StatBadge({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 3),
          Flexible(child: Text(label, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w500), overflow: TextOverflow.ellipsis)),
        ],
      ),
    );
  }
}
