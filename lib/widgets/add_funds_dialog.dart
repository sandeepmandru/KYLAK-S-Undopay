import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class AddFundsDialog extends StatefulWidget {
  const AddFundsDialog({super.key});

  @override
  State<AddFundsDialog> createState() => _AddFundsDialogState();
}

class _AddFundsDialogState extends State<AddFundsDialog> {
  final TextEditingController _amountController = TextEditingController(text: '10000');

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    if (!provider.showAddFundsModal) return const SizedBox.shrink();

    void submit() {
      final double val = double.tryParse(_amountController.text) ?? 0.0;
      if (val > 0) {
        provider.addFunds(val);
        provider.closeAddFundsModal();
      }
    }

    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(28),
        side: const BorderSide(color: AppColors.cardBorder, width: 1.5),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: const [
                    Icon(Icons.account_balance_wallet_rounded, color: AppColors.gold, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Add Wealth Funds',
                      style: TextStyle(
                        color: AppColors.textSubtle,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textSecondary),
                  onPressed: () => provider.closeAddFundsModal(),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'Current Balance',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
            ),
            Text(
              '₹${provider.user.balance.toStringAsFixed(0)}',
              style: const TextStyle(
                color: AppColors.gold,
                fontSize: 28,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 16),

            // TextField
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.darkInset,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.gold, width: 1.5),
              ),
              child: Row(
                children: [
                  const Text(
                    '₹ ',
                    style: TextStyle(
                      color: AppColors.gold,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _amountController,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Presets
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [5000, 10000, 50000, 100000].map((preset) {
                return InkWell(
                  onTap: () {
                    setState(() {
                      _amountController.text = preset.toString();
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.darkButton,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: Text(
                      '+₹${(preset / 1000).toStringAsFixed(0)}k',
                      style: const TextStyle(
                        color: AppColors.gold,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.gold,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Text(
                  'ADD FUNDS TO ACCOUNT',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
