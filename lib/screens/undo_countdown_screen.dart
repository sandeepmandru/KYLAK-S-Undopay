import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class UndoCountdownScreen extends StatelessWidget {
  const UndoCountdownScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final tx = provider.activeTransaction;
    final seconds = provider.countdownSeconds;

    if (tx == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('No active payment session.', style: TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => provider.navigateTo('home'),
              child: const Text('Return Home'),
            )
          ],
        ),
      );
    }

    final double progress = seconds / 15.0;

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
            border: Border.all(color: AppColors.gold, width: 2),
            boxShadow: [
              BoxShadow(
                color: AppColors.gold.withOpacity(0.2),
                blurRadius: 30,
                spreadRadius: 2,
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.gold),
                ),
                child: const Text(
                  '15-SECOND UNDO WINDOW ACTIVE',
                  style: TextStyle(
                    color: AppColors.gold,
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.5,
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Circular Progress Gauge with Seconds
              SizedBox(
                width: 180,
                height: 180,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CircularProgressIndicator(
                      value: progress,
                      strokeWidth: 10,
                      backgroundColor: AppColors.darkInset,
                      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.gold),
                    ),
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            '${seconds}s',
                            style: const TextStyle(
                              color: AppColors.gold,
                              fontSize: 52,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          const Text(
                            'REMAINING TO UNDO',
                            style: TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              Text(
                '₹${tx.amount.toStringAsFixed(0)}',
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 4),
              RichText(
                text: TextSpan(
                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
                  children: [
                    const TextSpan(text: 'Transfer initiated to '),
                    TextSpan(
                      text: tx.recipientName,
                      style: const TextStyle(color: AppColors.gold, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Payment will finalize automatically when countdown expires.',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 28),

              // UNDO BUTTON
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: () => provider.undoPayment(),
                  icon: const Icon(Icons.undo_rounded, color: Colors.white, size: 24),
                  label: const Text(
                    'PRESS TO UNDO PAYMENT',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 14,
                      letterSpacing: 1.2,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.errorRedBg,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: const BorderSide(color: AppColors.errorRed, width: 1.5),
                    ),
                    shadowColor: AppColors.errorRedBg.withOpacity(0.5),
                    elevation: 8,
                  ),
                ),
              ),

              const SizedBox(height: 12),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.verified, color: AppColors.success, size: 14),
                  SizedBox(width: 6),
                  Text(
                    '100% Funds Instantly Refunded to Account Balance',
                    style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold),
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
