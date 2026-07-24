import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/transaction_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _showBalance = true;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.user;
    final txs = provider.transactions;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Wealth Balance Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: AppColors.gold, width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: AppColors.gold.withOpacity(0.15),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.stars_rounded, color: AppColors.gold, size: 18),
                        const SizedBox(width: 6),
                        Text(
                          user.accountType.toUpperCase(),
                          style: const TextStyle(
                            color: AppColors.textSubtle,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: Icon(
                        _showBalance ? Icons.visibility : Icons.visibility_off,
                        color: AppColors.gold,
                        size: 20,
                      ),
                      onPressed: () => setState(() => _showBalance = !_showBalance),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _showBalance ? '₹${user.balance.toStringAsFixed(0)}' : '••••••••',
                          style: const TextStyle(
                            color: AppColors.gold,
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          '100% Protected by 15s Undo Mechanism',
                          style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: () => provider.openAddFundsModal(),
                      icon: const Icon(Icons.add, size: 16, color: Colors.black),
                      label: const Text('ADD FUNDS', style: TextStyle(color: Colors.black, fontWeight: FontWeight.w800, fontSize: 10)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.gold,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // 2. Active 15s Undo Banner (if active)
          if (provider.activeTransaction != null && provider.activeTransaction!.status == TransactionStatus.initiated)
            InkWell(
              onTap: () => provider.navigateTo('undo-countdown'),
              child: Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.gold, width: 2),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.timer, color: AppColors.gold, size: 28),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'UNDO TIMER ACTIVE (15s)',
                              style: TextStyle(color: AppColors.gold, fontWeight: FontWeight.w800, fontSize: 12),
                            ),
                            Text(
                              'Tap to cancel payment to ${provider.activeTransaction!.recipientName}',
                              style: const TextStyle(color: AppColors.textPrimary, fontSize: 11),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.errorRedBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${provider.countdownSeconds}s',
                        style: const TextStyle(color: AppColors.errorRed, fontWeight: FontWeight.w900, fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // 3. Quick Payment Channels
          const Text(
            'UPI PAYMENT CHANNELS',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),

          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 1.5,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            children: [
              _ChannelTile(
                icon: Icons.qr_code_scanner,
                title: 'Scan QR Code',
                subtitle: 'Camera / Gallery QR',
                onTap: () => provider.openQrScanner(),
              ),
              _ChannelTile(
                icon: Icons.smartphone,
                title: 'Mobile Number',
                subtitle: 'Direct Phone UPI',
                onTap: () => provider.navigateTo('enter-details', method: PaymentMethod.mobile),
              ),
              _ChannelTile(
                icon: Icons.contacts,
                title: 'UPI Contacts',
                subtitle: 'Saved Recipient List',
                onTap: () => provider.navigateTo('enter-details', method: PaymentMethod.contact),
              ),
              _ChannelTile(
                icon: Icons.account_balance,
                title: 'Bank Transfer',
                subtitle: 'IFSC + Account No.',
                onTap: () => provider.navigateTo('enter-details', method: PaymentMethod.bank),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 4. Quick Telemetry Banner
          InkWell(
            onTap: () => provider.navigateTo('stats'),
            borderRadius: BorderRadius.circular(20),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.darkInset,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _StatMiniItem(
                    label: 'TOTAL SENT',
                    value: '₹${provider.totalAmountSent.toStringAsFixed(0)}',
                  ),
                  Container(width: 1, height: 28, color: AppColors.cardBorder),
                  _StatMiniItem(
                    label: 'SUCCESS RATE',
                    value: '${provider.successRate}%',
                  ),
                  Container(width: 1, height: 28, color: AppColors.cardBorder),
                  _StatMiniItem(
                    label: 'SAVED UNDO',
                    value: '₹${provider.totalAmountSavedUndo.toStringAsFixed(0)}',
                    color: AppColors.errorRed,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // 5. Recent Transactions Header & List
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'RECENT TRANSACTIONS',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              TextButton(
                onPressed: () => provider.navigateTo('history'),
                child: const Text(
                  'View All',
                  style: TextStyle(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          if (txs.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Center(
                child: Text('No transactions recorded yet.', style: TextStyle(color: AppColors.textSecondary)),
              ),
            )
          else
            Column(
              children: txs.take(5).map((tx) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: InkWell(
                    onTap: () => provider.openReceipt(tx),
                    borderRadius: BorderRadius.circular(18),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundImage: tx.recipientAvatar != null
                                    ? NetworkImage(tx.recipientAvatar!)
                                    : null,
                                backgroundColor: AppColors.darkButton,
                                child: tx.recipientAvatar == null
                                    ? Text(
                                        tx.recipientName[0],
                                        style: const TextStyle(color: AppColors.gold, fontWeight: FontWeight.bold),
                                      )
                                    : null,
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        tx.recipientName,
                                        style: const TextStyle(
                                          color: AppColors.textPrimary,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                        ),
                                      ),
                                      if (tx.status == TransactionStatus.cancelled) ...[
                                        const SizedBox(width: 6),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: AppColors.errorRedBg.withOpacity(0.4),
                                            borderRadius: BorderRadius.circular(6),
                                            border: Border.all(color: AppColors.errorRed.withOpacity(0.5)),
                                          ),
                                          child: const Text(
                                            'UNDONE',
                                            style: TextStyle(color: AppColors.errorRed, fontSize: 8, fontWeight: FontWeight.bold),
                                          ),
                                        )
                                      ]
                                    ],
                                  ),
                                  Text(
                                    '${tx.id} • ${tx.formattedDate}',
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 10),
                                  ),
                                ],
                              ),
                            ],
                          ),

                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                '-₹${tx.amount.toStringAsFixed(0)}',
                                style: TextStyle(
                                  color: tx.status == TransactionStatus.cancelled
                                      ? AppColors.errorRed
                                      : AppColors.textPrimary,
                                  decoration: tx.status == TransactionStatus.cancelled
                                      ? TextDecoration.lineThrough
                                      : TextDecoration.none,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                tx.status == TransactionStatus.success
                                    ? 'Success'
                                    : tx.status == TransactionStatus.cancelled
                                        ? 'Refunded'
                                        : 'Active Undo',
                                style: TextStyle(
                                  color: tx.status == TransactionStatus.success
                                      ? AppColors.success
                                      : tx.status == TransactionStatus.cancelled
                                          ? AppColors.errorRed
                                          : AppColors.gold,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }
}

class _ChannelTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ChannelTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.darkButton,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Icon(icon, color: AppColors.gold, size: 20),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 12),
            ),
            Text(
              subtitle,
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatMiniItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatMiniItem({
    required this.label,
    required this.value,
    this.color = AppColors.gold,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 8, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(value, style: TextStyle(color: color, fontSize: 14, fontWeight: FontWeight.w900)),
      ],
    );
  }
}
