import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../services/api_service.dart';

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

  @override
  void dispose() {
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_locationController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a delivery location'), backgroundColor: AppColors.error),
      );
      return;
    }
    setState(() => _submitting = true);
    try {
      await ApiService.instance.requestCommodity(
        itemType: _selectedType,
        quantity: _quantity,
        deliveryMethod: _deliveryMethod,
        deliveryLocation: _locationController.text.trim(),
      );
      if (mounted) setState(() { _submitting = false; _submitted = true; });
    } catch (e) {
      if (mounted) {
        setState(() => _submitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Request failed: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Request Supplies')),
      body: _submitted ? _buildSuccess() : _buildForm(),
    );
  }

  Widget _buildSuccess() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.secondary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle_rounded, size: 60, color: AppColors.secondary),
            ),
            const SizedBox(height: 24),
            const Text('Request Submitted!', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text(
              'Your request for ${CommodityType.label(_selectedType)} has been received. '
              'You\'ll be notified when it\'s ready for ${_deliveryMethod == 'pickup' ? 'collection' : 'delivery'}.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textSecondary, height: 1.5),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Back to Home'),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () => setState(() { _submitted = false; _quantity = 1; _locationController.clear(); }),
              child: const Text('Make Another Request'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
            ),
            child: const Row(
              children: [
                Icon(Icons.lock_rounded, size: 16, color: AppColors.primary),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'All requests are completely confidential and delivered discreetly.',
                    style: TextStyle(fontSize: 12, color: AppColors.primary),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const Text('What do you need?', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          ...CommodityType.all.map((type) => _TypeOption(
                type: type,
                isSelected: _selectedType == type,
                onTap: () => setState(() => _selectedType = type),
              )),

          const SizedBox(height: 24),
          const Text('Quantity', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          Row(
            children: [
              _CounterButton(
                icon: Icons.remove_rounded,
                onTap: () { if (_quantity > 1) setState(() => _quantity--); },
              ),
              const SizedBox(width: 20),
              Text('$_quantity', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
              const SizedBox(width: 20),
              _CounterButton(
                icon: Icons.add_rounded,
                onTap: () { if (_quantity < 10) setState(() => _quantity++); },
              ),
            ],
          ),

          const SizedBox(height: 24),
          const Text('Delivery Method', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _DeliveryOption(
                  icon: Icons.store_rounded,
                  label: 'Pick Up',
                  subtitle: 'Collect at clinic',
                  value: 'pickup',
                  selected: _deliveryMethod == 'pickup',
                  onTap: () => setState(() => _deliveryMethod = 'pickup'),
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
                  onTap: () => setState(() => _deliveryMethod = 'home_delivery'),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),
          Text(
            _deliveryMethod == 'pickup' ? 'Nearest Clinic / Location' : 'Delivery Address',
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _locationController,
            decoration: InputDecoration(
              hintText: _deliveryMethod == 'pickup'
                  ? 'e.g. UZ Campus, Harare'
                  : 'e.g. Room 204, Swinton Hall, UZ',
              prefixIcon: const Icon(Icons.location_on_outlined),
            ),
          ),

          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: _submitting ? null : _submit,
            child: _submitting
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                  )
                : const Text('Submit Request'),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _TypeOption extends StatelessWidget {
  final String type;
  final bool isSelected;
  final VoidCallback onTap;
  const _TypeOption({required this.type, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.08) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.divider,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_unchecked_rounded,
              color: isSelected ? AppColors.primary : AppColors.textLight,
              size: 20,
            ),
            const SizedBox(width: 12),
            Text(
              CommodityType.label(type),
              style: TextStyle(
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                color: isSelected ? AppColors.primary : AppColors.textPrimary,
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
  const _CounterButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppColors.primary),
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

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary.withOpacity(0.08) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.divider,
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: selected ? AppColors.primary : AppColors.textSecondary, size: 28),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 13,
                color: selected ? AppColors.primary : AppColors.textPrimary,
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
