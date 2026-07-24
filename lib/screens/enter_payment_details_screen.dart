import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/contact_model.dart';
import '../models/transaction_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class EnterPaymentDetailsScreen extends StatefulWidget {
  const EnterPaymentDetailsScreen({super.key});

  @override
  State<EnterPaymentDetailsScreen> createState() => _EnterPaymentDetailsScreenState();
}

class _EnterPaymentDetailsScreenState extends State<EnterPaymentDetailsScreen> {
  final TextEditingController _recipientController = TextEditingController();
  final TextEditingController _amountController = TextEditingController(text: '1500');
  final TextEditingController _noteController = TextEditingController();

  ContactModel? _selectedContact;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<AppProvider>(context, listen: false);
      final data = provider.activeFlowData;
      if (data != null) {
        if (data['recipientName'] != null) {
          _recipientController.text = data['recipientName'];
        }
        if (data['amount'] != null) {
          _amountController.text = (data['amount'] as num).toStringAsFixed(0);
        }
      }
    });
  }

  @override
  void dispose() {
    _recipientController.dispose();
    _amountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _onSelectContact(ContactModel c) {
    setState(() {
      _selectedContact = c;
      _recipientController.text = c.name;
    });
  }

  void _handleProceed() {
    final provider = Provider.of<AppProvider>(context, listen: false);
    final double amount = double.tryParse(_amountController.text) ?? 0.0;

    if (_recipientController.text.isEmpty || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter valid recipient and amount')),
      );
      return;
    }

    if (amount > provider.user.balance) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Insufficient balance! Add funds first.')),
      );
      return;
    }

    provider.openPinModal({
      'recipientName': _recipientController.text,
      'recipientUpiOrAccount': _selectedContact?.upiId ?? '${_recipientController.text.toLowerCase().replaceAll(' ', '.')}@okaxis',
      'recipientAvatar': _selectedContact?.avatar,
      'amount': amount,
      'paymentMethod': provider.selectedPaymentMethod,
      'note': _noteController.text,
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final method = provider.selectedPaymentMethod;

    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: AppColors.gold),
                onPressed: () => provider.navigateTo('choose-method'),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'PAY VIA ${method.name.toUpperCase()}',
                    style: const TextStyle(
                      color: AppColors.gold,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                  const Text(
                    'Enter Payment Details',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 20),

          // If Contact method selected, show contact picker list
          if (method == PaymentMethod.contact) ...[
            const Text(
              'SELECT SAVED CONTACT',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            SizedBox(
              height: 90,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: ContactModel.initialContacts.length,
                itemBuilder: (context, index) {
                  final c = ContactModel.initialContacts[index];
                  final isSelected = _selectedContact?.id == c.id;

                  return GestureDetector(
                    onTap: () => _onSelectContact(c),
                    child: Container(
                      width: 72,
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.gold.withOpacity(0.2) : AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? AppColors.gold : AppColors.cardBorder,
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircleAvatar(
                            radius: 18,
                            backgroundImage: NetworkImage(c.avatar),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            c.name.split(' ')[0],
                            style: const TextStyle(color: AppColors.textPrimary, fontSize: 10, fontWeight: FontWeight.bold),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Form Box
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('RECIPIENT NAME OR UPI ID', style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: _recipientController,
                  style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'e.g. Rohan Verma or rohan@upi',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    filled: true,
                    fillColor: AppColors.darkInset,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppColors.cardBorder),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppColors.gold),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                const Text('AMOUNT (INR ₹)', style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  style: const TextStyle(color: AppColors.gold, fontWeight: FontWeight.w900, fontSize: 24),
                  decoration: InputDecoration(
                    prefixText: '₹ ',
                    prefixStyle: const TextStyle(color: AppColors.gold, fontSize: 24, fontWeight: FontWeight.bold),
                    filled: true,
                    fillColor: AppColors.darkInset,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppColors.cardBorder),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppColors.gold),
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // Amount Presets
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [500, 1000, 2500, 5000].map((preset) {
                    return InkWell(
                      onTap: () => setState(() => _amountController.text = preset.toString()),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.darkButton,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        child: Text(
                          '₹$preset',
                          style: const TextStyle(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 16),

                const Text('NOTE / PURPOSE (OPTIONAL)', style: TextStyle(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: _noteController,
                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 12),
                  decoration: InputDecoration(
                    hintText: 'e.g. Dinner share or Deposit',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    filled: true,
                    fillColor: AppColors.darkInset,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppColors.cardBorder),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton.icon(
              onPressed: _handleProceed,
              icon: const Icon(Icons.lock_rounded, color: Colors.black, size: 20),
              label: const Text(
                'PROCEED TO UPI PIN VERIFICATION',
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.gold,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
