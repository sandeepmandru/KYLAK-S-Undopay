import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/transaction_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class TransactionReceiptDialog extends StatelessWidget {
  const TransactionReceiptDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final tx = provider.viewingReceiptTransaction;

    if (tx == null) return const SizedBox.shrink();

    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(28),
        side: const BorderSide(color: AppColors.cardBorder, width: 1.5),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatusBadge(tx.status),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textSecondary),
                  onPressed: () => provider.closeReceipt(),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Text(
              '₹${tx.amount.toStringAsFixed(0)}',
              style: const TextStyle(
                color: AppColors.gold,
                fontSize: 36,
                fontWeight: FontWeight.w900,
              ),
            ),
            Text(
              tx.recipientName,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              tx.recipientUpiOrAccount,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 11,
              ),
            ),

            const SizedBox(height: 16),

            // Details list
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.darkInset,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Column(
                children: [
                  _DetailRow(label: 'Transaction ID', value: tx.id),
                  const Divider(color: AppColors.cardBorder, height: 16),
                  _DetailRow(label: 'Date & Time', value: tx.formattedDate),
                  const Divider(color: AppColors.cardBorder, height: 16),
                  _DetailRow(label: 'Payment Method', value: tx.paymentMethod.name.toUpperCase()),
                  const Divider(color: AppColors.cardBorder, height: 16),
                  _DetailRow(label: 'Funding Account', value: tx.fundingSource),
                  if (tx.note != null && tx.note!.isNotEmpty) ...[
                    const Divider(color: AppColors.cardBorder, height: 16),
                    _DetailRow(label: 'Note', value: tx.note!),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 16),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Receipt shared successfully!')),
                      );
                    },
                    icon: const Icon(Icons.share, size: 16, color: AppColors.gold),
                    label: const Text('Share', style: TextStyle(color: AppColors.gold, fontSize: 11)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.cardBorder),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Receipt PDF downloaded!')),
                      );
                    },
                    icon: const Icon(Icons.download, size: 16, color: AppColors.gold),
                    label: const Text('Download', style: TextStyle(color: AppColors.gold, fontSize: 11)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.cardBorder),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton.icon(
                onPressed: () {
                  provider.closeReceipt();
                  provider.navigateTo('enter-details', method: tx.paymentMethod, flowData: {
                    'recipientName': tx.recipientName,
                    'recipientUpiOrAccount': tx.recipientUpiOrAccount,
                    'recipientAvatar': tx.recipientAvatar,
                    'paymentMethod': tx.paymentMethod,
                  });
                },
                icon: const Icon(Icons.refresh, size: 16, color: Colors.black),
                label: Text(
                  'PAY ${tx.recipientName.split(" ")[0].toUpperCase()} AGAIN',
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: Colors.black),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.gold,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(TransactionStatus status) {
    if (status == TransactionStatus.success) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.success.withOpacity(0.2),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.success),
        ),
        child: const Text(
          'PAYMENT SUCCESSFUL',
          style: TextStyle(color: AppColors.success, fontSize: 9, fontWeight: FontWeight.bold),
        ),
      );
    } else if (status == TransactionStatus.cancelled) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.errorRedBg.withOpacity(0.4),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.errorRed),
        ),
        child: const Text(
          'PAYMENT UNDONE • REFUNDED',
          style: TextStyle(color: AppColors.errorRed, fontSize: 9, fontWeight: FontWeight.bold),
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.gold.withOpacity(0.3),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.gold),
        ),
        child: const Text(
          '15s UNDO ACTIVE',
          style: TextStyle(color: AppColors.gold, fontSize: 9, fontWeight: FontWeight.bold),
        ),
      );
    }
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 11,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
