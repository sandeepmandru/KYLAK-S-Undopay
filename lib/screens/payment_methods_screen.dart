import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/transaction_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class PaymentMethodsScreen extends StatelessWidget {
  const PaymentMethodsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: AppColors.gold),
                onPressed: () => provider.navigateTo('home'),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'SELECT PAYMENT METHOD',
                    style: TextStyle(
                      color: AppColors.gold,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                  Text(
                    'Instant Sovereign UPI Dispatch',
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

          _MethodCard(
            icon: Icons.qr_code_scanner,
            title: 'Scan QR Code',
            description: 'Scan merchant QR or select image from photo library.',
            badge: 'RECOMMENDED',
            onTap: () => provider.openQrScanner(),
          ),

          const SizedBox(height: 12),

          _MethodCard(
            icon: Icons.smartphone,
            title: 'Pay via Phone Number',
            description: 'Send payment directly using recipient phone number.',
            badge: '15S UNDO PROTECTED',
            onTap: () => provider.navigateTo('enter-details', method: PaymentMethod.mobile),
          ),

          const SizedBox(height: 12),

          _MethodCard(
            icon: Icons.contacts,
            title: 'Pay Phone Contacts',
            description: 'Select from saved frequent UPI recipients.',
            badge: 'FREQUENT',
            onTap: () => provider.navigateTo('enter-details', method: PaymentMethod.contact),
          ),

          const SizedBox(height: 12),

          _MethodCard(
            icon: Icons.account_balance,
            title: 'Bank Account Transfer',
            description: 'Enter Account Number & Bank IFSC Code.',
            badge: 'IMPS / NEFT',
            onTap: () => provider.navigateTo('enter-details', method: PaymentMethod.bank),
          ),
        ],
      ),
    );
  }
}

class _MethodCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final String badge;
  final VoidCallback onTap;

  const _MethodCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.cardBorder, width: 1),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.darkButton,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Icon(icon, color: AppColors.gold, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w800,
                          fontSize: 14,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        child: Text(
                          badge,
                          style: const TextStyle(
                            color: AppColors.gold,
                            fontSize: 8,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.chevron_right, color: AppColors.gold),
          ],
        ),
      ),
    );
  }
}
