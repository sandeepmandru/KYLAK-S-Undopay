import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/transaction_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class DashboardStatsScreen extends StatelessWidget {
  const DashboardStatsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final txs = provider.transactions;

    final qrCount = txs.where((t) => t.paymentMethod == PaymentMethod.qr).length;
    final mobileCount = txs.where((t) => t.paymentMethod == PaymentMethod.mobile).length;
    final contactCount = txs.where((t) => t.paymentMethod == PaymentMethod.contact).length;
    final bankCount = txs.where((t) => t.paymentMethod == PaymentMethod.bank).length;

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
                    'TELEMETRY & UNDO ANALYTICS',
                    style: TextStyle(color: AppColors.gold, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1),
                  ),
                  Text(
                    'Wealth Analytics',
                    style: TextStyle(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Grid of Stat Cards
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 1.3,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            children: [
              _StatTile(
                icon: Icons.trending_up_rounded,
                title: 'TOTAL VOLUME SENT',
                value: '₹${provider.totalAmountSent.toStringAsFixed(0)}',
                subtitle: 'Successful Payments',
                accentColor: AppColors.gold,
              ),
              _StatTile(
                icon: Icons.check_circle_outline_rounded,
                title: 'SUCCESS RATE',
                value: '${provider.successRate}%',
                subtitle: '${provider.successfulTransactions} / ${provider.totalTransactions} Txns',
                accentColor: AppColors.goldLight,
              ),
              _StatTile(
                icon: Icons.undo_rounded,
                title: 'SAVED VIA UNDO',
                value: '₹${provider.totalAmountSavedUndo.toStringAsFixed(0)}',
                subtitle: '${provider.cancelledTransactions} Payments Refunded',
                accentColor: AppColors.errorRed,
                isRedBg: true,
              ),
              _StatTile(
                icon: Icons.shield_outlined,
                title: 'TOTAL ACTIONS',
                value: '${provider.totalTransactions}',
                subtitle: 'Live Shared State',
                accentColor: AppColors.textSubtle,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Channel Breakdown
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
                const Text(
                  'PAYMENT CHANNEL BREAKDOWN',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
                const SizedBox(height: 16),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _ChannelCount(icon: Icons.qr_code_scanner, name: 'QR Code', count: qrCount),
                    _ChannelCount(icon: Icons.smartphone, name: 'Mobile', count: mobileCount),
                    _ChannelCount(icon: Icons.contacts, name: 'Contacts', count: contactCount),
                    _ChannelCount(icon: Icons.account_balance, name: 'Bank', count: bankCount),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String subtitle;
  final Color accentColor;
  final bool isRedBg;

  const _StatTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.accentColor,
    this.isRedBg = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isRedBg ? AppColors.errorRedBg.withOpacity(0.3) : AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isRedBg ? AppColors.errorRed.withOpacity(0.5) : AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: accentColor, size: 22),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(value, style: TextStyle(color: accentColor, fontSize: 20, fontWeight: FontWeight.w900)),
          Text(subtitle, style: const TextStyle(color: AppColors.textSubtle, fontSize: 10)),
        ],
      ),
    );
  }
}

class _ChannelCount extends StatelessWidget {
  final IconData icon;
  final String name;
  final int count;

  const _ChannelCount({required this.icon, required this.name, required this.count});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.darkInset,
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.cardBorder),
          ),
          child: Icon(icon, color: AppColors.gold, size: 20),
        ),
        const SizedBox(height: 6),
        Text(name, style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.bold)),
        Text('$count Txns', style: const TextStyle(color: AppColors.gold, fontSize: 10, fontWeight: FontWeight.w800)),
      ],
    );
  }
}
