import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/mascot_header.dart';
import '../widgets/bubble.dart';
import 'compare_options.dart';
import '../widgets/home_testimonials.dart';

class PreventionScreen extends StatefulWidget {
  const PreventionScreen({super.key});

  @override
  State<PreventionScreen> createState() => _PreventionScreenState();
}

class _PreventionScreenState extends State<PreventionScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _searchController = TextEditingController();

  bool _showSearch = false;
  String _selectedGroup = 'All';
  final Set<String> _selectedNames = {};

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  final List<String> _tabs = const [
    'HIV Prevention',
    'Pregnancy Prevention',
  ];

  final Map<String, List<String>> _topicCategories = const {
    'hiv': [
      'All',
      'Pre-Exposure Prophylaxis',
      'Barrier Methods',
      'Post-Exposure Prevention',
      'Medical Prevention',
      'Treatment-Based Prevention',
      'Harm Reduction',
    ],
    'pregnancy': [
      'All',
      'Short-Acting Methods',
      'Long-Acting Reversible Methods',
      'Permanent Methods',
      'Natural Methods',
    ],
  };

  final List<_PreventionMethod> _methods = const [
    _PreventionMethod(
      name: 'Birth Control Pills',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/contraceptive.png',
      description: 'Daily pills used to help prevent pregnancy.',
      howItWorks: 'Prevents ovulation and changes cervical mucus.',
      usage: 'Take one pill every day.',
      effectiveness: 'Over 99% with perfect use.',
      sideEffects:
          'May cause nausea, breast tenderness, mild headaches, mood changes, or changes in monthly bleeding.',
      cost: 'Free in public facilities; low cost privately.',
      access: 'Clinics, hospitals and pharmacies.',
      icon: Icons.medication_liquid_rounded,
    ),
    _PreventionMethod(
      name: 'Progestin-Only Pill',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/pop.png',
      description: 'A daily pill containing only progestin hormone.',
      howItWorks: 'Thickens cervical mucus and may stop ovulation.',
      usage: 'Take at the same time every day.',
      effectiveness: 'Very effective when taken correctly.',
      sideEffects:
          'May cause irregular bleeding, spotting, headaches, breast tenderness, or mild mood changes.',
      cost: 'Usually low cost or clinic based.',
      access: 'Clinics, hospitals and pharmacies.',
      icon: Icons.medication_liquid_rounded,
    ),
    _PreventionMethod(
      name: 'Combined Pill',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/contraceptive.png',
      description: 'A daily pill containing estrogen and progestin.',
      howItWorks: 'Prevents ovulation and changes cervical mucus.',
      usage: 'Take one pill daily as directed.',
      effectiveness: 'Very effective with correct daily use.',
      sideEffects:
          'May cause nausea, headaches, breast tenderness, spotting, or mood changes.',
      cost: 'Free in public facilities; private cost varies.',
      access: 'Clinics, hospitals and pharmacies.',
      icon: Icons.medication_rounded,
    ),
    _PreventionMethod(
      name: 'Injectable Contraceptives',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/depo.png',
      description: 'Hormonal injections used to prevent pregnancy.',
      howItWorks: 'Stops ovulation using hormones.',
      usage: 'Get injections on schedule.',
      effectiveness: 'Very effective when injections are on time.',
      sideEffects:
          'May cause irregular bleeding, delayed return to fertility, weight changes, headaches, or mood changes.',
      cost: 'Clinic based.',
      access: 'Public and private health facilities.',
      icon: Icons.vaccines_rounded,
    ),
    _PreventionMethod(
      name: 'Depo Provera',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/depo.png',
      description:
          'A contraceptive injection that protects for about 3 months.',
      howItWorks: 'Stops ovulation using a hormone.',
      usage: 'Get an injection every 3 months.',
      effectiveness: 'Over 99% with on-time injections.',
      sideEffects:
          'May cause irregular bleeding, no monthly bleeding, weight changes, headaches, or delayed return to fertility.',
      cost: 'Free in public facilities; private cost varies.',
      access: 'Public and private health facilities.',
      icon: Icons.vaccines_rounded,
    ),
    _PreventionMethod(
      name: 'Sayana Press',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/sayana.png',
      description: 'A small injectable contraceptive option.',
      howItWorks: 'Releases progestin to prevent ovulation.',
      usage: 'Used every 3 months as advised.',
      effectiveness: 'Very effective when used on time.',
      sideEffects:
          'May cause injection-site discomfort, irregular bleeding, headaches, or changes in monthly bleeding.',
      cost: 'Clinic based.',
      access: 'Selected health facilities.',
      icon: Icons.vaccines_rounded,
    ),
    _PreventionMethod(
      name: 'Male Condom',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/condoms.png',
      description: 'A barrier method that helps prevent pregnancy and STIs.',
      howItWorks: 'Creates a physical barrier during sex.',
      usage: 'Use correctly every time.',
      effectiveness: '98% effective with correct use.',
      sideEffects:
          'Usually no hormonal side effects. Some people may have irritation or latex sensitivity.',
      cost: 'Free in many clinics; also sold in shops.',
      access: 'Clinics, pharmacies and supermarkets.',
      icon: Icons.shield_rounded,
    ),
    _PreventionMethod(
      name: 'Female Condom',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/female_condoms.jpg',
      description: 'A barrier method worn internally.',
      howItWorks: 'Blocks sperm from reaching the uterus.',
      usage: 'Use once, every time during sex.',
      effectiveness: '95% effective with correct use.',
      sideEffects:
          'Usually no hormonal side effects. Some people may notice mild irritation or discomfort at first.',
      cost: 'Free or low cost in some facilities.',
      access: 'Clinics, hospitals and pharmacies.',
      icon: Icons.health_and_safety_rounded,
    ),
    _PreventionMethod(
      name: 'Emergency Contraception Pills',
      category: 'pregnancy',
      group: 'Short-Acting Methods',
      image: 'assets/emergency_contraceptive.png',
      description: 'Used after unprotected sex to reduce pregnancy risk.',
      howItWorks: 'Can delay ovulation before pregnancy starts.',
      usage: 'Take as soon as possible after sex.',
      effectiveness: 'Works better the sooner it is taken.',
      sideEffects:
          'May cause nausea, tiredness, headache, breast tenderness, or changes in the next period.',
      cost: 'Usually low cost in pharmacies.',
      access: 'Pharmacies and health facilities.',
      icon: Icons.warning_rounded,
    ),
    _PreventionMethod(
      name: 'Implant',
      category: 'pregnancy',
      group: 'Long-Acting Reversible Methods',
      image: 'assets/implant.png',
      description:
          'A small rod placed under the skin for long-term contraception.',
      howItWorks: 'Releases hormone slowly to prevent pregnancy.',
      usage: 'Inserted by a trained health provider.',
      effectiveness: 'Over 99% effective.',
      sideEffects:
          'May cause irregular bleeding, headaches, acne, breast tenderness, or mood changes.',
      cost: 'Free in public facilities; private cost varies.',
      access: 'Selected clinics and hospitals.',
      icon: Icons.spa_rounded,
    ),
    _PreventionMethod(
      name: 'Copper IUD',
      category: 'pregnancy',
      group: 'Long-Acting Reversible Methods',
      image: 'assets/copper_iud.png',
      description: 'A long-acting non-hormonal method placed in the uterus.',
      howItWorks: 'Copper affects sperm and prevents fertilisation.',
      usage: 'Inserted by a trained health provider.',
      effectiveness: 'Over 99% effective.',
      sideEffects:
          'May cause cramping, heavier periods, or more painful periods especially in the first months.',
      cost: 'Free in public facilities; private cost varies.',
      access: 'Selected health facilities.',
      icon: Icons.adjust_rounded,
    ),
    _PreventionMethod(
      name: 'Hormonal IUD',
      category: 'pregnancy',
      group: 'Long-Acting Reversible Methods',
      image: 'assets/copper_iud.png',
      description: 'A long-acting hormonal device placed in the uterus.',
      howItWorks: 'Releases hormone to prevent pregnancy.',
      usage: 'Inserted by a trained health provider.',
      effectiveness: 'Over 99% effective.',
      sideEffects:
          'May cause spotting, lighter periods, cramping after insertion, headaches, or acne.',
      cost: 'Clinic based.',
      access: 'Selected health facilities.',
      icon: Icons.adjust_rounded,
    ),
    _PreventionMethod(
      name: 'Tubal Ligation',
      category: 'pregnancy',
      group: 'Permanent Methods',
      image: 'assets/contraceptive.png',
      description: 'A permanent female sterilization method.',
      howItWorks: 'Blocks the fallopian tubes.',
      usage: 'Done by a trained health professional.',
      effectiveness: 'Permanent and highly effective.',
      sideEffects:
          'May involve short-term pain, tiredness, or recovery discomfort after the procedure.',
      cost: 'Facility based.',
      access: 'Hospitals and selected clinics.',
      icon: Icons.verified_rounded,
    ),
    _PreventionMethod(
      name: 'Vasectomy',
      category: 'pregnancy',
      group: 'Permanent Methods',
      image: 'assets/contraceptive.png',
      description: 'A permanent male sterilization method.',
      howItWorks: 'Blocks sperm from entering semen.',
      usage: 'Done by a trained health professional.',
      effectiveness: 'Permanent and highly effective.',
      sideEffects:
          'May cause short-term soreness, swelling, or mild discomfort after the procedure.',
      cost: 'Facility based.',
      access: 'Hospitals and selected clinics.',
      icon: Icons.verified_rounded,
    ),
    _PreventionMethod(
      name: 'Withdrawal / Pull-Out Method',
      category: 'pregnancy',
      group: 'Natural Methods',
      image: 'assets/contraceptive.png',
      description:
          'A natural method where withdrawal happens before ejaculation.',
      howItWorks: 'Reduces sperm entering the vagina.',
      usage: 'Requires control and correct timing every time.',
      effectiveness: 'Less reliable than medical methods.',
      sideEffects:
          'No medicine-related side effects, but it has a higher chance of failure than many other methods.',
      cost: 'No cost.',
      access: 'No clinic visit required.',
      icon: Icons.eco_rounded,
    ),
    _PreventionMethod(
      name: 'Lactational Amenorrhea Method',
      category: 'pregnancy',
      group: 'Natural Methods',
      image: 'assets/contraceptive.png',
      description: 'A temporary method linked to exclusive breastfeeding.',
      howItWorks: 'Breastfeeding can delay ovulation temporarily.',
      usage: 'Works only under specific breastfeeding conditions.',
      effectiveness: 'Effective only when strict conditions are met.',
      sideEffects:
          'No medicine-related side effects, but it only works under specific breastfeeding conditions.',
      cost: 'No cost.',
      access: 'Ask a health provider for guidance.',
      icon: Icons.eco_rounded,
    ),
    _PreventionMethod(
      name: 'Daily Oral PrEP',
      category: 'hiv',
      group: 'Pre-Exposure Prophylaxis',
      image: 'assets/prep.png',
      description: 'A daily medicine that helps prevent HIV before exposure.',
      howItWorks: 'Helps stop HIV from taking hold in the body.',
      usage: 'Taken daily as advised by a health provider.',
      effectiveness: 'Over 99% effective when used correctly.',
      sideEffects:
          'May cause nausea, headache, stomach discomfort, or tiredness, especially when starting.',
      cost: 'Often available through clinics.',
      access: 'Public and private health facilities.',
      icon: Icons.medication_rounded,
    ),
    _PreventionMethod(
      name: 'Cabotegravir Long-Acting Injection',
      category: 'hiv',
      group: 'Pre-Exposure Prophylaxis',
      image: 'assets/cabotegr.png',
      description: 'A long-acting injectable PrEP option.',
      howItWorks: 'Medicine stays in the body to help prevent HIV.',
      usage: 'Given as scheduled injections by a provider.',
      effectiveness: 'Highly effective when injections are on time.',
      sideEffects:
          'May cause injection-site pain, swelling, headache, fever, tiredness, or muscle aches.',
      cost: 'Facility based.',
      access: 'Selected health facilities.',
      icon: Icons.vaccines_rounded,
    ),
    _PreventionMethod(
      name: 'Lenacapavir Long-Acting Injectable',
      category: 'hiv',
      group: 'Pre-Exposure Prophylaxis',
      image: 'assets/lenacapavir.png',
      description: 'A long-acting injectable HIV prevention option.',
      howItWorks: 'Maintains medicine levels for HIV prevention.',
      usage: 'Given by a trained health provider.',
      effectiveness: 'Highly effective when used correctly.',
      sideEffects:
          'May cause injection-site reactions, headache, nausea, or mild tiredness.',
      cost: 'Facility based.',
      access: 'Selected health facilities.',
      icon: Icons.vaccines_rounded,
    ),
    _PreventionMethod(
      name: 'Dapivirine Vaginal Ring',
      category: 'hiv',
      group: 'Pre-Exposure Prophylaxis',
      image: 'assets/dapivirine.png',
      description: 'A vaginal ring used for HIV prevention.',
      howItWorks: 'Slowly releases medicine locally.',
      usage: 'Used as advised by a health provider.',
      effectiveness: 'Helps reduce HIV risk when used correctly.',
      sideEffects:
          'May cause mild vaginal discomfort, discharge, itching, or urinary discomfort.',
      cost: 'Clinic based.',
      access: 'Selected health facilities.',
      icon: Icons.radio_button_checked_rounded,
    ),
    _PreventionMethod(
      name: 'Male Condoms',
      category: 'hiv',
      group: 'Barrier Methods',
      image: 'assets/condoms.png',
      description:
          'A barrier method that helps prevent HIV, STIs and pregnancy.',
      howItWorks: 'Creates a physical barrier during sex.',
      usage: 'Use correctly every time.',
      effectiveness: '98% effective with correct use.',
      sideEffects:
          'Usually no hormonal side effects. Some people may have irritation or latex sensitivity.',
      cost: 'Free in many clinics; also sold in shops.',
      access: 'Clinics, pharmacies and supermarkets.',
      icon: Icons.shield_rounded,
    ),
    _PreventionMethod(
      name: 'Female Condoms',
      category: 'hiv',
      group: 'Barrier Methods',
      image: 'assets/female_condoms.jpg',
      description:
          'A barrier method worn internally to reduce STI and pregnancy risk.',
      howItWorks: 'Blocks sperm and reduces contact with fluids.',
      usage: 'Use once, every time during sex.',
      effectiveness: '95% effective with correct use.',
      sideEffects:
          'Usually no hormonal side effects. Some people may notice mild irritation or discomfort at first.',
      cost: 'Free or low cost in some facilities.',
      access: 'Clinics, hospitals and pharmacies.',
      icon: Icons.health_and_safety_rounded,
    ),
    _PreventionMethod(
      name: 'Post-Exposure Prophylaxis',
      category: 'hiv',
      group: 'Post-Exposure Prevention',
      image: 'assets/pep.png',
      description: 'Emergency HIV prevention after possible exposure.',
      howItWorks: 'Uses HIV medicines to reduce infection risk.',
      usage: 'Start as soon as possible, within 72 hours.',
      effectiveness: 'Works best when started early.',
      sideEffects:
          'May cause nausea, tiredness, headache, or stomach discomfort during the short course.',
      cost: 'Clinic based.',
      access: 'Health facilities and emergency services.',
      icon: Icons.local_hospital_rounded,
    ),
    _PreventionMethod(
      name: 'Voluntary Medical Male Circumcision',
      category: 'hiv',
      group: 'Medical Prevention',
      image: 'assets/hiv_general.png',
      description: 'A medical procedure that can reduce HIV risk for men.',
      howItWorks: 'Reduces biological risk during vaginal sex.',
      usage: 'Done by trained medical providers.',
      effectiveness: 'Provides partial protection only.',
      sideEffects:
          'May involve short-term pain, swelling, or healing discomfort after the procedure.',
      cost: 'Often clinic based.',
      access: 'Hospitals and selected clinics.',
      icon: Icons.medical_services_rounded,
    ),
    _PreventionMethod(
      name: 'Treatment as Prevention',
      category: 'hiv',
      group: 'Treatment-Based Prevention',
      image: 'assets/hiv_general.png',
      description:
          'HIV treatment can reduce the chance of passing HIV to others.',
      howItWorks: 'Treatment lowers the amount of HIV in the body.',
      usage: 'Take treatment consistently as prescribed.',
      effectiveness: 'Very effective when viral load is suppressed.',
      sideEffects:
          'Side effects depend on the HIV medicines used and may include nausea, headache, tiredness, or sleep changes.',
      cost: 'Available through HIV care services.',
      access: 'HIV treatment clinics.',
      icon: Icons.favorite_rounded,
    ),
    _PreventionMethod(
      name: 'Harm Reduction for People Who Inject Drugs',
      category: 'hiv',
      group: 'Harm Reduction',
      image: 'assets/hiv_general.png',
      description:
          'Supportive services that reduce HIV risk linked to injecting drug use.',
      howItWorks:
          'Reduces sharing of injecting equipment and supports safer care.',
      usage: 'Access harm reduction and health services where available.',
      effectiveness: 'Helps reduce HIV transmission risk.',
      sideEffects:
          'No medicine-related side effects unless medicines are part of the service; support is based on safer care and counselling.',
      cost: 'Depends on available services.',
      access: 'Community and health facilities where offered.',
      icon: Icons.volunteer_activism_rounded,
    ),
  ];

  List<_PreventionMethod> _filtered = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _tabController.addListener(_filterMethods);
    _filterMethods();
  }

  void _filterMethods() {
    final selected = _tabController.index == 0 ? 'hiv' : 'pregnancy';
    final query = _searchController.text.trim().toLowerCase();

    setState(() {
      _filtered = _methods.where((method) {
        final matchesTab = method.category == selected;

        final matchesGroup =
            _selectedGroup == 'All' || method.group == _selectedGroup;

        final matchesSearch = query.isEmpty ||
            method.name.toLowerCase().contains(query) ||
            method.description.toLowerCase().contains(query) ||
            method.group.toLowerCase().contains(query) ||
            method.sideEffects.toLowerCase().contains(query);

        return matchesTab && matchesGroup && matchesSearch;
      }).toList();
    });
  }

  void _openCompare() {
    final selected = _methods
        .where((m) => _selectedNames.contains(m.name))
        .map((m) => m.toCompareMap())
        .toList();

    if (selected.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Select at least 2 options to compare by clicking on the plus icon in the circle ',
          ),
        ),
      );
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CompareOptionsScreen(options: selected),
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  String get _selectedTopic => _tabController.index == 0 ? 'hiv' : 'pregnancy';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: mascotLightGreen,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              const MascotHeader(),
              SliverToBoxAdapter(child: _buildHeaderContent()),
              SliverToBoxAdapter(child: _buildBody()),
              const SliverToBoxAdapter(child: SizedBox(height: 90)),
            ],
          ),
          Positioned(
            left: 16,
            bottom: 18,
            child: _CompareButton(
              count: _selectedNames.length,
              onTap: _openCompare,
            ),
          ),
          Positioned(
            right: 16,
            bottom: 92,
            child: _TestimonialsBubble(
              count: 3,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const _TestimonialsPage(),
                  ),
                );
              },
            ),
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

  Widget _buildHeaderContent() {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
      child: Column(
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Prevention Methods',
                  style: TextStyle(
                    color: mascotDarkGreen,
                    fontSize: 25,
                    fontWeight: FontWeight.w900,
                    height: 1.12,
                    letterSpacing: -0.4,
                  ),
                ),
              ),
              InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  setState(() {
                    _showSearch = !_showSearch;
                    if (!_showSearch) {
                      _searchController.clear();
                      _filterMethods();
                    }
                  });
                },
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: mascotLightGreen,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    _showSearch ? Icons.close_rounded : Icons.search_rounded,
                    color: mascotDarkGreen,
                  ),
                ),
              ),
            ],
          ),
          if (_showSearch) ...[
            const SizedBox(height: 14),
            TextField(
              controller: _searchController,
              autofocus: true,
              onChanged: (_) => _filterMethods(),
              decoration: InputDecoration(
                hintText: 'Search prevention methods...',
                hintStyle: const TextStyle(color: Colors.black45),
                prefixIcon: const Icon(Icons.search, color: mascotDarkGreen),
                filled: true,
                fillColor: mascotLightGreen,
                contentPadding: const EdgeInsets.symmetric(vertical: 11),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(28),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ],
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: mascotLightGreen,
              borderRadius: BorderRadius.circular(28),
            ),
            child: TabBar(
              controller: _tabController,
              onTap: (_) {
                setState(() {
                  _selectedGroup = 'All';
                });
                _filterMethods();
              },
              indicator: BoxDecoration(
                color: mascotGreen,
                borderRadius: BorderRadius.circular(24),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              labelColor: Colors.white,
              unselectedLabelColor: mascotDarkGreen,
              labelStyle: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
              tabs: _tabs.map((tab) => Tab(text: tab)).toList(),
            ),
          ),
          const SizedBox(height: 12),
          _buildCategoryFilters(),
        ],
      ),
    );
  }

  Widget _buildCategoryFilters() {
    final categories = _topicCategories[_selectedTopic] ?? [];

    return SizedBox(
      height: 38,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final category = categories[index];
          final selected = _selectedGroup == category;

          return InkWell(
            borderRadius: BorderRadius.circular(22),
            onTap: () {
              setState(() {
                _selectedGroup = category;
              });
              _filterMethods();
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
              decoration: BoxDecoration(
                color: selected ? mascotGreen : mascotLightGreen,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(
                  color: selected
                      ? mascotGreen
                      : mascotDarkGreen.withOpacity(0.18),
                ),
              ),
              child: Text(
                category,
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
    );
  }

  Widget _buildBody() {
    if (_filtered.isEmpty) {
      return const Padding(
        padding: EdgeInsets.only(top: 80),
        child: Center(
          child: Text(
            'No methods found',
            style: TextStyle(
              color: Colors.black54,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 24),
      itemCount: _filtered.length,
      itemBuilder: (context, index) {
        final method = _filtered[index];

        return _PreventionCard(
          method: method,
          selected: _selectedNames.contains(method.name),
          onSelect: () {
            setState(() {
              if (_selectedNames.contains(method.name)) {
                _selectedNames.remove(method.name);
              } else {
                _selectedNames.add(method.name);
              }
            });
          },
        );
      },
    );
  }
}

class _TestimonialsPage extends StatelessWidget {
  const _TestimonialsPage();

  static const Color mascotLightGreen = Color(0xFFF2F9E6);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: mascotLightGreen,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              const MascotHeader(),
              SliverToBoxAdapter(
                child: Container(
                  width: double.infinity,
                  color: Colors.white,
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 18),
                  child: Row(
                    children: [
                      InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: mascotLightGreen,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            Icons.arrow_back_rounded,
                            color: mascotDarkGreen,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Text(
                          'Testimonials',
                          style: TextStyle(
                            color: mascotDarkGreen,
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            height: 1.08,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.fromLTRB(16, 16, 16, 32),
                  child: Material(
                    color: mascotLightGreen,
                    child: HeroMode(
                      enabled: false,
                      child: HomeTestimonials(),
                    ),
                  ),
                ),
              ),
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
}

class _TestimonialsBubble extends StatelessWidget {
  final int count;
  final VoidCallback onTap;

  const _TestimonialsBubble({
    required this.count,
    required this.onTap,
  });

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Testimonials',
            style: TextStyle(
              color: mascotDarkGreen,
              fontSize: 11,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 4),
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: mascotGreen.withOpacity(0.25),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.message_rounded,
                  color: mascotDarkGreen,
                  size: 26,
                ),
              ),
              Positioned(
                right: -2,
                top: -4,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.redAccent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                  child: Text(
                    '$count',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CompareButton extends StatelessWidget {
  final int count;
  final VoidCallback onTap;

  const _CompareButton({
    required this.count,
    required this.onTap,
  });

  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      heroTag: 'compare_button',
      backgroundColor: Colors.white,
      elevation: 4,
      onPressed: onTap,
      icon: const Icon(Icons.compare_arrows_rounded, color: mascotDarkGreen),
      label: Text(
        'Compare $count',
        style: const TextStyle(
          color: mascotDarkGreen,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}

class _PreventionCard extends StatelessWidget {
  final _PreventionMethod method;
  final bool selected;
  final VoidCallback onSelect;

  const _PreventionCard({
    required this.method,
    required this.selected,
    required this.onSelect,
  });

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  Color get categoryColor {
    return method.category == 'hiv' ? const Color(0xFF059669) : mascotGreen;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: selected ? mascotGreen : categoryColor.withOpacity(0.12),
          width: selected ? 1.8 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: mascotGreen.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.all(14),
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        leading: Container(
          width: 54,
          height: 54,
          decoration: BoxDecoration(
            color: categoryColor.withOpacity(0.12),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(method.icon, color: categoryColor, size: 28),
        ),
        title: Text(
          method.name,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              method.group,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 11,
                color: categoryColor,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              method.description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12, color: Colors.black54),
            ),
          ],
        ),
        trailing: IconButton(
          icon: Icon(
            selected
                ? Icons.check_circle_rounded
                : Icons.add_circle_outline_rounded,
            color: selected ? mascotGreen : mascotDarkGreen,
          ),
          onPressed: onSelect,
        ),
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.asset(
              method.image,
              width: double.infinity,
              height: 145,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 14),
          _InfoRow(title: 'Category', value: method.group),
          _InfoRow(title: 'How it works', value: method.howItWorks),
          _InfoRow(title: 'How to use', value: method.usage),
          _InfoRow(title: 'Effectiveness', value: method.effectiveness),
          _InfoRow(title: 'Side effects', value: method.sideEffects),
          _InfoRow(title: 'Cost', value: method.cost),
          _InfoRow(title: 'Where to access', value: method.access),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String title;
  final String value;

  const _InfoRow({
    required this.title,
    required this.value,
  });

  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: mascotLightGreen,
        borderRadius: BorderRadius.circular(14),
      ),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: '$title: ',
              style: const TextStyle(
                color: mascotDarkGreen,
                fontSize: 12,
                fontWeight: FontWeight.w800,
              ),
            ),
            TextSpan(
              text: value,
              style: const TextStyle(
                color: Colors.black54,
                fontSize: 12,
                height: 1.35,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PreventionMethod {
  final String name;
  final String category;
  final String group;
  final String image;
  final String description;
  final String howItWorks;
  final String usage;
  final String effectiveness;
  final String sideEffects;
  final String cost;
  final String access;
  final IconData icon;

  const _PreventionMethod({
    required this.name,
    required this.category,
    required this.group,
    required this.image,
    required this.description,
    required this.howItWorks,
    required this.usage,
    required this.effectiveness,
    required this.sideEffects,
    required this.cost,
    required this.access,
    required this.icon,
  });

  Map<String, String> toCompareMap() {
    return {
      'name': name,
      'description': description,
      'howItWorks': howItWorks,
      'usage': usage,
      'effectiveness': effectiveness,
      'sideEffects': sideEffects,
      'cost': cost,
      'access': access,
    };
  }
}
