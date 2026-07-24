import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/transaction_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class TransactionHistoryScreen extends StatefulWidget {
  const TransactionHistoryScreen({super.key});

  @override
  State<TransactionHistoryScreen> createState() => _TransactionHistoryScreenState();
}

class _TransactionHistoryScreenState extends State<TransactionHistoryScreen> {
  String _searchQuery = '';
  String _statusFilter = 'all';

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final allTxs = provider.transactions;

    final filtered = allTxs.filter((tx) {
      final matchesSearch = tx.recipientName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          tx.id.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (tx.note != null && tx.note!.toLowerCase().contains(_searchQuery.toLowerCase())) ||
          tx.amount.toString().contains(_searchQuery);

      bool matchesStatus = true;
      if (_statusFilter == 'success') {
        matchesStatus = tx.status == TransactionStatus.success;
      } else if (_statusFilter == 'cancelled') {
        matchesStatus = tx.status == TransactionStatus.cancelled;
      } else if (_statusFilter == 'initiated') {
        matchesStatus = tx.status == TransactionStatus.initiated;
      }

      return matchesSearch && matchesStatus;
    }).toList();

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
                children: [
                  const Text(
                    'TRANSACTION AUDIT LOGS',
                    style: TextStyle(color: AppColors.gold, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1),
                  ),
                  Text(
                    'Transaction History (${allTxs.length})',
                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Search field
          TextField(
            onChanged: (val) => setState(() => _searchQuery = val),
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Search by recipient, transaction ID, or amount...',
              hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12),
              prefixIcon: const Icon(Icons.search, color: AppColors.gold, size: 20),
              filled: true,
              fillColor: AppColors.surface,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: AppColors.cardBorder),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: AppColors.gold),
              ),
            ),
          ),

          const SizedBox(height: 12),

          // Filter tabs
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _FilterTab(
                  label: 'All',
                  isSelected: _statusFilter == 'all',
                  onTap: () => setState(() => _statusFilter = 'all'),
                ),
                _FilterTab(
                  label: 'Successful',
                  isSelected: _statusFilter == 'success',
                  onTap: () => setState(() => _statusFilter = 'success'),
                ),
                _FilterTab(
                  label: 'Cancelled (Undo)',
                  isSelected: _statusFilter == 'cancelled',
                  onTap: () => setState(() => _statusFilter = 'cancelled'),
                ),
                _FilterTab(
                  label: 'Active 15s',
                  isSelected: _statusFilter == 'initiated',
                  onTap: () => setState(() => _statusFilter = 'initiated'),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // List
          if (filtered.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Center(
                child: Text('No transactions found matching criteria.', style: TextStyle(color: AppColors.textSecondary)),
              ),
            )
          else
            Column(
              children: filtered.map((tx) {
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
                                backgroundImage: tx.recipientAvatar != null ? NetworkImage(tx.recipientAvatar!) : null,
                                backgroundColor: AppColors.darkButton,
                                child: tx.recipientAvatar == null
                                    ? Text(tx.recipientName[0], style: const TextStyle(color: AppColors.gold, fontWeight: FontWeight.bold))
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
                                        style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13),
                                      ),
                                      if (tx.status == TransactionStatus.cancelled) ...[
                                        const SizedBox(width: 6),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: AppColors.errorRedBg.withOpacity(0.4),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: const Text('UNDONE', style: TextStyle(color: AppColors.errorRed, fontSize: 8, fontWeight: FontWeight.bold)),
                                        )
                                      ]
                                    ],
                                  ),
                                  Text(
                                    '${tx.id} • ${tx.paymentMethod.name.toUpperCase()}',
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 10, fontFamily: 'monospace'),
                                  ),
                                  Text(
                                    tx.formattedDate,
                                    style: const TextStyle(color: AppColors.textSubtle, fontSize: 10),
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
                                  color: tx.status == TransactionStatus.cancelled ? AppColors.errorRed : AppColors.textPrimary,
                                  decoration: tx.status == TransactionStatus.cancelled ? TextDecoration.lineThrough : TextDecoration.none,
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
                          )
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

extension _IterableFilter<T> on Iterable<T> {
  Iterable<T> filter(bool Function(T element) test) => where(test);
}

class _FilterTab extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterTab({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.gold : AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? AppColors.gold : AppColors.cardBorder),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.black : AppColors.textSecondary,
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}
