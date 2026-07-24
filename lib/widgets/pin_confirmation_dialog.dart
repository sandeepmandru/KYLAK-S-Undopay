import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class PinConfirmationDialog extends StatefulWidget {
  const PinConfirmationDialog({super.key});

  @override
  State<PinConfirmationDialog> createState() => _PinConfirmationDialogState();
}

class _PinConfirmationDialogState extends State<PinConfirmationDialog> {
  String _pin = '';
  String _error = '';

  void _onKeyPress(String digit) {
    if (_pin.length < 4) {
      setState(() {
        _pin += digit;
        _error = '';
      });
      if (_pin.length == 4) {
        _submitPin(_pin);
      }
    }
  }

  void _onBackspace() {
    if (_pin.isNotEmpty) {
      setState(() {
        _pin = _pin.substring(0, _pin.length - 1);
        _error = '';
      });
    }
  }

  Future<void> _submitPin(String enteredPin) async {
    final provider = Provider.of<AppProvider>(context, listen: false);
    final success = await provider.verifyAndExecutePayment(enteredPin);
    if (!success) {
      setState(() {
        _pin = '';
        _error = 'Incorrect UPI PIN! Default demo PIN is 1234';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    if (!provider.showPinModal) return const SizedBox.shrink();

    final data = provider.activeFlowData ?? {};
    final double amount = (data['amount'] as num?)?.toDouble() ?? 0.0;
    final String recipientName = data['recipientName'] ?? 'Merchant';

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
                  children: [
                    const Icon(Icons.security, color: AppColors.gold, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'NPCI UPI PIN Security',
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
                  onPressed: () => provider.closePinModal(),
                )
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Paying ₹${amount.toStringAsFixed(0)}',
              style: const TextStyle(
                color: AppColors.gold,
                fontSize: 28,
                fontWeight: FontWeight.w900,
              ),
            ),
            Text(
              'To $recipientName',
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),

            // PIN Dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(4, (index) {
                final isFilled = index < _pin.length;
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isFilled ? AppColors.gold : Colors.transparent,
                    border: Border.all(
                      color: isFilled ? AppColors.gold : AppColors.textSecondary,
                      width: 2,
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 8),
            const Text(
              'Enter 4-Digit Security PIN (Demo PIN: 1234)',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
            ),

            if (_error.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                _error,
                style: const TextStyle(color: AppColors.errorRed, fontSize: 11, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ],

            const SizedBox(height: 20),

            // Number Keypad
            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 3,
              childAspectRatio: 1.6,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
              children: [
                ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
                  (d) => KeypadButton(
                    text: d,
                    onTap: () => _onKeyPress(d),
                  ),
                ),
                const SizedBox.shrink(),
                KeypadButton(
                  text: '0',
                  onTap: () => _onKeyPress('0'),
                ),
                IconButton(
                  icon: const Icon(Icons.backspace_outlined, color: AppColors.gold),
                  onPressed: _onBackspace,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class KeypadButton extends StatelessWidget {
  final String text;
  final VoidCallback onTap;

  const KeypadButton({super.key, required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.darkButton,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Center(
          child: Text(
            text,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
