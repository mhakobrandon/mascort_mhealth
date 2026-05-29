import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';

class CommodityRequestScreen extends StatefulWidget {
  const CommodityRequestScreen({super.key});

  @override
  State<CommodityRequestScreen> createState() => _CommodityRequestScreenState();
}

class _CommodityRequestScreenState extends State<CommodityRequestScreen> {
  String _selectedType = CommodityType.condom;
  int _quantity = 1;
  String _deliveryMethod = 'pickup';

  final _locationController = TextEditingController();

  bool _submitting = false;
  bool _submitted = false;

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  @override
  void dispose() {
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_locationController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a delivery location'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _submitting = true);

    // Fake loading delay for offline/demo mode
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _submitting = false;
        _submitted = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: mascotLightGreen,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        title: const Text(
          'Commodity Request',
          style: TextStyle(
            color: mascotDarkGreen,
            fontWeight: FontWeight.w900,
          ),
        ),
        iconTheme: const IconThemeData(color: mascotDarkGreen),
      ),
      body: _submitted ? _buildSuccess() : _buildForm(),
    );
  }

  Widget _buildSuccess() {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: mascotGreen.withOpacity(0.14),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 86,
                height: 86,
                decoration: const BoxDecoration(
                  color: mascotLightGreen,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  size: 58,
                  color: mascotDarkGreen,
                ),
              ),
              const SizedBox(height: 22),
              const Text(
                'Request Submitted!',
                style: TextStyle(
                  color: mascotDarkGreen,
                  fontSize: 23,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Your request for ${CommodityType.label(_selectedType)} has been received. '
                'You’ll be notified when it is ready for ${_deliveryMethod == 'pickup' ? 'collection' : 'delivery'}.',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.black54,
                  height: 1.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: mascotGreen,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Back to Home',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: mascotDarkGreen,
                    side: const BorderSide(
                      color: mascotGreen,
                      width: 1.6,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                  onPressed: () {
                    setState(() {
                      _submitted = false;
                      _quantity = 1;
                      _locationController.clear();
                    });
                  },
                  child: const Text(
                    'Make Another Request',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildIntroCard(),
          const SizedBox(height: 18),

          /// WHAT DO YOU NEED
          _SectionCard(
            title: 'What do you need?',
            child: Column(
              children: CommodityType.all
                  .map(
                    (type) => _TypeOption(
                      type: type,
                      isSelected: _selectedType == type,
                      onTap: () => setState(() => _selectedType = type),
                    ),
                  )
                  .toList(),
            ),
          ),

          const SizedBox(height: 14),

          /// QUANTITY
          _SectionCard(
            title: 'Quantity',
            child: Row(
              children: [
                _CounterButton(
                  icon: Icons.remove_rounded,
                  onTap: () {
                    if (_quantity > 1) {
                      setState(() => _quantity--);
                    }
                  },
                ),
                const SizedBox(width: 18),
                Container(
                  width: 72,
                  height: 46,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: mascotLightGreen,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    '$_quantity',
                    style: const TextStyle(
                      color: mascotDarkGreen,
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(width: 18),
                _CounterButton(
                  icon: Icons.add_rounded,
                  onTap: () {
                    if (_quantity < 10) {
                      setState(() => _quantity++);
                    }
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          /// DELIVERY METHOD
          _SectionCard(
            title: 'Delivery Method',
            child: Row(
              children: [
                Expanded(
                  child: _DeliveryOption(
                    icon: Icons.store_rounded,
                    label: 'Pick Up',
                    subtitle: 'Collect at clinic',
                    value: 'pickup',
                    selected: _deliveryMethod == 'pickup',
                    onTap: () => setState(() {
                      _deliveryMethod = 'pickup';
                    }),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _DeliveryOption(
                    icon: Icons.home_rounded,
                    label: 'Home Delivery',
                    subtitle: 'Delivered discreetly',
                    value: 'home_delivery',
                    selected: _deliveryMethod == 'home_delivery',
                    onTap: () => setState(() {
                      _deliveryMethod = 'home_delivery';
                    }),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          /// LOCATION
          _SectionCard(
            title: _deliveryMethod == 'pickup'
                ? 'Nearest Clinic / Location'
                : 'Delivery Address',
            child: TextField(
              controller: _locationController,
              decoration: InputDecoration(
                hintText: _deliveryMethod == 'pickup'
                    ? 'e.g. UZ Campus, Harare'
                    : 'e.g. Room 204, Swinton Hall, UZ',
                hintStyle: const TextStyle(color: Colors.black38),
                prefixIcon: const Icon(
                  Icons.location_on_outlined,
                  color: mascotDarkGreen,
                ),
                filled: true,
                fillColor: mascotLightGreen,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 14,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          const SizedBox(height: 22),

          /// SUBMIT BUTTON
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: mascotGreen,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              onPressed: _submitting ? null : _submit,
              child: _submitting
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : const Text(
                      'Submit Request',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 15,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIntroCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: mascotDarkGreen,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: mascotGreen.withOpacity(0.2),
            blurRadius: 16,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: const Row(
        children: [
          Icon(
            Icons.lock_rounded,
            size: 22,
            color: Colors.white,
          ),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              'All requests are confidential and handled discreetly.',
              style: TextStyle(
                fontSize: 13,
                color: Colors.white,
                fontWeight: FontWeight.w800,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final Widget child;

  const _SectionCard({
    required this.title,
    required this.child,
  });

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: mascotGreen.withOpacity(0.10),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: mascotDarkGreen,
              fontWeight: FontWeight.w900,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _TypeOption extends StatelessWidget {
  final String type;
  final bool isSelected;
  final VoidCallback onTap;

  const _TypeOption({
    required this.type,
    required this.isSelected,
    required this.onTap,
  });

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        margin: const EdgeInsets.only(bottom: 9),
        padding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 12,
        ),
        decoration: BoxDecoration(
          color: isSelected ? mascotLightGreen : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? mascotGreen : mascotGreen.withOpacity(0.18),
            width: isSelected ? 1.7 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected
                  ? Icons.check_circle_rounded
                  : Icons.radio_button_unchecked_rounded,
              color: isSelected ? mascotDarkGreen : Colors.black38,
              size: 21,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                CommodityType.label(type),
                style: TextStyle(
                  fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
                  color: isSelected ? mascotDarkGreen : Colors.black,
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CounterButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _CounterButton({
    required this.icon,
    required this.onTap,
  });

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: mascotLightGreen,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: mascotGreen.withOpacity(0.35),
            ),
          ),
          child: Icon(
            icon,
            color: mascotDarkGreen,
          ),
        ),
      ),
    );
  }
}

class _DeliveryOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final String value;
  final bool selected;
  final VoidCallback onTap;

  const _DeliveryOption({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.value,
    required this.selected,
    required this.onTap,
  });

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.all(13),
        decoration: BoxDecoration(
          color: selected ? mascotLightGreen : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? mascotGreen : mascotGreen.withOpacity(0.18),
            width: selected ? 1.7 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: selected ? mascotDarkGreen : Colors.black45,
              size: 28,
            ),
            const SizedBox(height: 7),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 13,
                color: selected ? mascotDarkGreen : Colors.black,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 11,
                color: Colors.black45,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
