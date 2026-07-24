import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class PaymentSuccessScreen extends StatelessWidget {
  const PaymentSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final tx = provider.activeTransaction;

    if (tx == null) {
      return Center(
        child: ElevatedButton(
          onPressed: () => provider.navigateTo('home'),
          child: const Text('Return Home'),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(
            maxWidth: 420,
          ),
          child: Container(
            padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: AppColors.success.withOpacity(0.5), width: 1.5),
            boxShadow: [
              BoxShadow(
                color: AppColors.success.withOpacity(0.15),
                blurRadius: 25,
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.success.withOpacity(0.2),
                  border: Border.all(color: AppColors.success, width: 2),
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 48),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.success),
                ),
                child: const Text(
                  'PAYMENT FINALIZED • SUCCESSFUL',
                  style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                '₹${tx.amount.toStringAsFixed(0)}',
                style: const TextStyle(color: AppColors.gold, fontSize: 36, fontWeight: FontWeight.w900),
              ),
              Text(
                'Paid to ${tx.recipientName}',
                style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold),
              ),
              Text(
                tx.recipientUpiOrAccount,
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
              ),

              const SizedBox(height: 20),

              // Details card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.darkInset,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: Column(
                  children: [
                    _RowItem(label: 'Transaction Ref ID', value: tx.id),
                    const Divider(color: AppColors.cardBorder, height: 16),
                    _RowItem(label: 'Completed Date', value: tx.formattedDate),
                    const Divider(color: AppColors.cardBorder, height: 16),
                    _RowItem(label: 'Payment Method', value: tx.paymentMethod.name.toUpperCase()),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => provider.openReceipt(tx),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.gold),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('VIEW RECEIPT', style: TextStyle(color: AppColors.gold, fontWeight: FontWeight.bold, fontSize: 11)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => provider.navigateTo('home'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.gold,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('HOME DASHBOARD', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      ),
    );
  }
}

class _RowItem extends StatelessWidget {
  final String label;
  final String value;

  const _RowItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
        Text(value, style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
